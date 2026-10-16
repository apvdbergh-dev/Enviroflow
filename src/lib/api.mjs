// API voor formulieren, bestellingen en betalingen (Mollie) met meldingen (ntfy-push en e-mail via Resend).
// Werkt met standaard Request/Response, zodat dezelfde code draait op Cloudflare (functions/) en in server.mjs.
import { hasRealPrice, isOrderable } from './catalog-core.mjs';
import { orderPdf } from './order-pdf.mjs';

const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_ATTACH_TOTAL = 30 * 1024 * 1024; // Resend staat ~40 MB per mail toe; daarboven alleen opslaan.
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.pdf']);
const FINAL_STATUSES = new Set(['paid', 'failed', 'canceled', 'expired']);

const FORM_SPECS = {
  quote: { prefix: 'OFF', label: 'offerteaanvraag', title: 'Nieuwe offerteaanvraag', required: ['company', 'name', 'email', 'phone', 'privacy'], fields: ['request_type', 'company', 'name', 'email', 'phone', 'product', 'quantity', 'liquid', 'application', 'delivery_date', 'remarks', 'source'] },
  custom: { prefix: 'MW', label: 'maatwerkaanvraag', title: 'Nieuwe maatwerkaanvraag', required: ['company', 'name', 'email', 'phone', 'privacy'], fields: ['company', 'name', 'email', 'phone', 'liquid', 'volume', 'dimensions', 'application', 'location', 'duration', 'wish'] },
  contact: { prefix: 'CT', label: 'contactbericht', title: 'Nieuw contactbericht', required: ['name', 'email', 'message', 'privacy'], fields: ['name', 'company', 'email', 'phone', 'message'] }
};
const LONG_FIELDS = new Set(['remarks', 'wish', 'message']);
const FIELD_LABELS = {
  request_type: 'Soort aanvraag', company: 'Bedrijf', name: 'Naam', email: 'E-mail', phone: 'Telefoon', product: 'Product (id)', productName: 'Product',
  quantity: 'Aantal', liquid: 'Vloeistof', application: 'Toepassing', delivery_date: 'Gewenste leverdatum', remarks: 'Opmerkingen', source: 'Bron',
  volume: 'Volume', dimensions: 'Afmetingen', location: 'Locatie', duration: 'Gebruiksduur', wish: 'Wens', message: 'Bericht', vatNumber: 'Btw-nummer', reference: 'Referentie'
};
const ORDER_REQUIRED = ['company', 'name', 'email', 'phone', 'delivery_street', 'delivery_postcode', 'delivery_city', 'payment_method', 'terms'];

/** Leest de instellingen uit omgevingsvariabelen (Cloudflare `env` of Node `process.env`). */
export function configFromEnv(env = {}) {
  return {
    baseUrl: env.BASE_URL || '',
    mollieKey: env.MOLLIE_API_KEY || '',
    mollieApi: env.MOLLIE_API_URL || 'https://api.mollie.com/v2',
    ntfyServer: env.NTFY_SERVER || 'https://ntfy.sh',
    ntfyTopic: env.NTFY_TOPIC || '',
    ntfyToken: env.NTFY_TOKEN || '',
    resendKey: env.RESEND_API_KEY || '',
    resendApi: env.RESEND_API_URL || 'https://api.resend.com',
    mailFrom: env.MAIL_FROM || 'EnviroFlow <bestellingen@enviroflow.nl>',
    notifyEmail: env.NOTIFY_EMAIL || ''
  };
}

const clean = (v, max = 2000) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const round2 = (n) => Math.round(n * 100) / 100;
const escHtml = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = (n) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
const extOf = (name) => { const m = /\.[^.]+$/.exec(name || ''); return m ? m[0].toLowerCase() : ''; };

function newId(prefix) {
  const bytes = crypto.getRandomValues(new Uint8Array(3));
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${hex}`;
}

function toBase64(buf) {
  const bytes = new Uint8Array(buf); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

const httpError = (status, message) => Object.assign(new Error(message), { status });
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const wantsJson = (request) => (request.headers.get('accept') || '').includes('application/json');

/** Antwoord voor formulieren: JSON voor fetch, anders een doorverwijzing (werkt ook zonder JavaScript). */
function reply(request, status, obj, redirect = '/bedankt/') {
  if (wantsJson(request)) return json(status, obj);
  if (status < 300) return new Response(null, { status: 303, headers: { Location: redirect } });
  return new Response(`<!doctype html><meta charset="utf-8"><title>Fout</title><p>${escHtml(obj.error)}</p><p><a href="javascript:history.back()">Terug</a></p>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

async function readForm(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return { fields: await request.json().catch(() => ({})), files: [] };
  const fd = await request.formData();
  const fields = {}; const files = [];
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') fields[k] = v;
    else if (v && v.size > 0) files.push(v);
  }
  return { fields, files };
}

/** Bouwt platte tekst en eenvoudige HTML uit secties met [label, waarde]-regels. */
function renderMail(intro, sections, outro = '') {
  const text = [intro, ...sections.map(([title, rows]) => `${title}\n${rows.filter(([, v]) => v !== '' && v != null).map(([k, v]) => (k ? `  ${k}: ${v}` : `  ${v}`)).join('\n')}`), outro].filter(Boolean).join('\n\n');
  // Volledig HTML-document met taal en tekenset: nette opmaak telt mee bij spamfilters.
  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EnviroFlow</title></head><body style="margin:0;padding:16px;background:#ffffff">
<div style="font-family:Arial,sans-serif;font-size:14px;color:#1a1a1a;line-height:1.5;max-width:640px">
<p>${escHtml(intro).replace(/\n/g, '<br>')}</p>
${sections.map(([title, rows]) => `<h3 style="color:#0A3B2C;margin:20px 0 6px">${escHtml(title)}</h3><table style="border-collapse:collapse">${rows.filter(([, v]) => v !== '' && v != null).map(([k, v]) => `<tr><td style="padding:2px 12px 2px 0;color:#555;vertical-align:top">${escHtml(k)}</td><td style="padding:2px 0;white-space:pre-wrap">${escHtml(v)}</td></tr>`).join('')}</table>`).join('\n')}
${outro ? `<p style="margin-top:20px">${escHtml(outro).replace(/\n/g, '<br>')}</p>` : ''}
</div></body></html>`;
  return { text, html };
}

export function createApi({ catalog, store, config, log = console }) {
  const cfg = { ...configFromEnv(), ...config };
  const site = catalog.site;
  const notifyEmail = cfg.notifyEmail || site.email;
  const productsById = Object.fromEntries(catalog.products.map((p) => [p.id, p]));
  const companyFooter = `EnviroFlow · ${site.address.street}, ${site.address.postalCode} ${site.address.city} · KvK ${site.kvk} · Btw ${site.vatNumber}\n${site.phonePrimary.display} · ${site.email}`;

  /* ---------- meldingen ---------- */
  // Pushbericht zonder persoonsgegevens: het ntfy-kanaal is alleen afgeschermd door de geheime naam.
  async function push({ title, message, tags = [], priority = 4 }) {
    if (!cfg.ntfyTopic) return;
    const headers = { 'Content-Type': 'application/json' };
    if (cfg.ntfyToken) headers.Authorization = `Bearer ${cfg.ntfyToken}`;
    const body = JSON.stringify({ topic: cfg.ntfyTopic, title, message, tags, priority });
    // De verbinding naar ntfy valt soms weg (bijv. fout 522); dan na een korte pauze opnieuw proberen.
    let lastError;
    for (const wait of [0, 1500, 4000]) {
      if (wait) await new Promise((res) => setTimeout(res, wait));
      try {
        const r = await fetch(cfg.ntfyServer, { method: 'POST', headers, body });
        if (r.ok) return;
        lastError = new Error(`ntfy ${r.status}: ${(await r.text()).slice(0, 200)}`);
        if (r.status < 500 && r.status !== 429) break; // fout in de aanvraag zelf: opnieuw proberen helpt niet
      } catch (e) { lastError = e; }
    }
    throw lastError;
  }
  async function mail({ to, subject, text, html, replyTo, attachments }) {
    if (!cfg.resendKey) return false;
    const body = { from: cfg.mailFrom, to: [to], subject, text, html };
    if (replyTo) body.reply_to = replyTo;
    if (attachments?.length) body.attachments = attachments;
    const r = await fetch(`${cfg.resendApi}/emails`, { method: 'POST', headers: { Authorization: `Bearer ${cfg.resendKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 300)}`);
    return true;
  }
  // Meldingen mogen een aanvraag of bestelling nooit laten mislukken. De laatste fout wordt bewaard
  // (zonder sleutels of klantgegevens) zodat /api/status laat zien wat er misging.
  const safely = (label, p) => p.catch((e) => {
    log.error(`melding mislukt (${label}):`, e.message);
    return store.putJSON('diag:last-error', { label, error: String(e.message).slice(0, 300), at: new Date().toISOString() }).catch(() => {});
  });

  // Alleen of iets is ingesteld (ja/nee) en de laatste meldingsfout; geen sleutels of persoonsgegevens.
  async function handleStatus() {
    return json(200, {
      configured: { mollie: Boolean(cfg.mollieKey), mollieMode: cfg.mollieKey ? (cfg.mollieKey.startsWith('live_') ? 'live' : 'test') : null, ntfyTopic: Boolean(cfg.ntfyTopic), ntfyToken: Boolean(cfg.ntfyToken), resend: Boolean(cfg.resendKey) },
      lastNotificationError: await store.getJSON('diag:last-error')
    });
  }

  /* ---------- formulieren ---------- */
  async function handleForm(kind, request, bg) {
    const { fields, files } = await readForm(request);
    if (fields.website) return reply(request, 200, { ok: true }); // honeypot: stil negeren
    const spec = FORM_SPECS[kind];
    const missing = spec.required.filter((k) => !clean(fields[k]));
    if (missing.length) return reply(request, 400, { error: 'Vul alle verplichte velden in.', missing });
    if (!isEmail(clean(fields.email))) return reply(request, 400, { error: 'Vul een geldig e-mailadres in.' });
    if (files.length > MAX_FILES) return reply(request, 400, { error: `Maximaal ${MAX_FILES} bestanden.` });
    for (const f of files) {
      if (!ALLOWED_EXT.has(extOf(f.name))) return reply(request, 400, { error: 'Dit bestandstype is niet toegestaan.' });
      if (f.size > MAX_FILE_SIZE) return reply(request, 400, { error: 'Een bestand is groter dan 10 MB.' });
    }

    const record = { id: newId(spec.prefix), kind, createdAt: new Date().toISOString(), data: {} };
    spec.fields.forEach((k) => { record.data[k] = clean(fields[k], LONG_FIELDS.has(k) ? 5000 : 300); });
    if (record.data.product && productsById[record.data.product]) record.data.productName = productsById[record.data.product].name;

    const attachments = []; let attachSize = 0;
    record.files = [];
    for (const [i, f] of files.entries()) {
      const safe = `${String(i + 1).padStart(2, '0')}-${(f.name || 'bestand').replace(/[^\w.-]+/g, '_').slice(-80)}`;
      const buf = await f.arrayBuffer();
      await store.putFile(`upload:${record.id}:${safe}`, buf);
      record.files.push(safe);
      attachSize += buf.byteLength;
      if (attachSize <= MAX_ATTACH_TOTAL) attachments.push({ filename: safe, content: toBase64(buf) });
    }
    await store.putJSON(`submission:${record.id}`, record);

    const d = record.data;
    const rows = Object.entries(d).filter(([k]) => k !== 'product').map(([k, v]) => [FIELD_LABELS[k] || k, v]);
    const fileNote = record.files.length ? `${record.files.length} bijlage(n)${attachments.length < record.files.length ? ' (te groot om allemaal mee te sturen; opgeslagen bij ' + record.id + ')' : ''}` : '';
    const { text, html } = renderMail(`${spec.title} via de website (${record.id}).`, [['Gegevens', rows], ['Bijlagen', [['', fileNote || 'geen']]]], 'Beantwoorden van deze mail gaat rechtstreeks naar de klant.');
    bg(safely('formulier', Promise.all([
      push({ title: spec.title, message: `${record.id}${record.files.length ? ` · ${record.files.length} bijlage(n)` : ''} · details in je mail`, tags: ['envelope'] }),
      mail({ to: notifyEmail, subject: `${spec.title} ${record.id}${d.company ? ` – ${d.company}` : ''}`, text, html, replyTo: d.email, attachments })
    ])));
    log.log(`nieuwe ${kind}: ${record.id}`);
    return reply(request, 200, { ok: true, id: record.id });
  }

  /* ---------- bestellingen ---------- */
  function orderMailSections(order) {
    const c = order.customer; const dl = order.delivery; const b = order.billing; const t = order.totals;
    const method = site.paymentMethods.find((m) => m.id === order.paymentMethod)?.label || order.paymentMethod;
    return [
      ['Klant', [['Bedrijf', c.company], ['Btw-nummer', c.vatNumber], ['Naam', c.name], ['E-mail', c.email], ['Telefoon', c.phone], ['Referentie', c.reference]]],
      ['Afleveradres', [['', `${dl.street}, ${dl.postcode} ${dl.city} (${dl.country})`]]],
      ['Factuuradres', [['', typeof b === 'string' ? `${dl.street}, ${dl.postcode} ${dl.city} (${dl.country}) – gelijk aan afleveradres` : `${b.street}, ${b.postcode} ${b.city} (${b.country})`]]],
      ['Producten', order.lines.map((l) => [`${l.qty} ×`, `${l.name} — ${eur(l.totalExcl)} excl. btw`])],
      ['Totaal', [['Subtotaal excl. btw', eur(t.subtotalExcl)], ['Verzendkosten', t.shippingExcl == null ? 'Worden na bestelling berekend' : eur(t.shippingExcl)], [`Btw (${Math.round(site.vatRate * 100)}%)`, eur(t.vat)], ['Totaal incl. btw', eur(t.totalIncl)]]],
      ['Betaling', [['Methode', method], ['Status', order.status]]],
      ['Opmerkingen', [['', order.remarks]]]
    ];
  }
  // Orderbevestiging als PDF-bijlage; lukt dat niet, dan gaat de mail zonder bijlage.
  function pdfAttachment(order) {
    try { return [{ filename: `Orderbevestiging-${order.id}.pdf`, content: toBase64(orderPdf(order, site)) }]; }
    catch (e) { log.error('pdf mislukt', order.id, e.message); return []; }
  }
  function notifyOwnerOfOrder(order, headline) {
    const { text, html } = renderMail(`${headline} (${order.id}).`, orderMailSections(order), 'Beantwoorden van deze mail gaat rechtstreeks naar de klant. De orderbevestiging die de klant ontvangt, zit als PDF in de bijlage.');
    return Promise.all([
      push({ title: headline, message: `${order.id} · ${eur(order.totals.totalIncl)} · ${order.lines.reduce((s, l) => s + l.qty, 0)} artikel(en) · details in je mail`, tags: ['moneybag'], priority: 5 }),
      mail({ to: notifyEmail, subject: `${headline} ${order.id} – ${order.customer.company} – ${eur(order.totals.totalIncl)}`, text, html, replyTo: order.customer.email, attachments: pdfAttachment(order) })
    ]);
  }
  function confirmToCustomer(order, paid) {
    const intro = `Beste ${order.customer.name},\n\nBedankt voor uw bestelling bij EnviroFlow. ${paid ? 'Wij hebben uw betaling ontvangen.' : 'Wij hebben uw bestelling ontvangen. U ontvangt van ons een bevestiging met betaalinstructies.'}\nHieronder vindt u het overzicht van bestelling ${order.id}. In de bijlage vindt u de orderbevestiging als PDF.`;
    const sections = orderMailSections(order).filter(([title]) => title !== 'Betaling');
    const outro = `Wij nemen zo snel mogelijk contact met u op over de levering.\nHeeft u vragen? Bel ${site.phonePrimary.display} of mail naar ${site.email}.\n\nMet vriendelijke groet,\nEnviroFlow\n\n${companyFooter}`;
    const { text, html } = renderMail(intro, sections, outro);
    return mail({ to: order.customer.email, subject: `Bevestiging bestelling ${order.id} – EnviroFlow`, text, html, replyTo: site.email, attachments: pdfAttachment(order) });
  }

  async function mollie(path, init = {}) {
    const r = await fetch(`${cfg.mollieApi}${path}`, { ...init, headers: { Authorization: `Bearer ${cfg.mollieKey}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
    const body = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, body };
  }

  async function handleOrder(request, base, bg) {
    const { fields } = await readForm(request);
    if (fields.website) return json(200, { ok: true, orderId: '-' });
    const missing = ORDER_REQUIRED.filter((k) => !clean(fields[k]));
    if (!fields.billing_same) ['billing_street', 'billing_postcode', 'billing_city'].forEach((k) => { if (!clean(fields[k])) missing.push(k); });
    if (missing.length) return json(400, { error: 'Vul alle verplichte velden in.', missing });
    if (!isEmail(clean(fields.email))) return json(400, { error: 'Vul een geldig e-mailadres in.' });
    if (!site.paymentMethods.some((m) => m.id === fields.payment_method)) return json(400, { error: 'Kies een geldige betaalmethode.' });

    let items = fields.items;
    if (typeof items === 'string') { try { items = JSON.parse(items); } catch { items = []; } }
    if (!Array.isArray(items) || !items.length || items.length > 50) return json(400, { error: 'Uw winkelwagen is leeg.' });

    // Prijzen altijd uit de catalogus, nooit van de client.
    const lines = [];
    for (const it of items) {
      const p = productsById[it?.id];
      const qty = Math.floor(Number(it?.qty));
      if (!p || !isOrderable(p) || !Number.isFinite(qty) || qty < 1 || qty > 999) return json(400, { error: 'Een product in uw winkelwagen is niet (meer) online te bestellen.' });
      if (!hasRealPrice(p)) return json(400, { error: `Voor “${p.name}” is nog geen prijs bekend. Vraag een offerte aan.` });
      lines.push({ id: p.id, name: p.name, qty, unitPriceExcl: p.price, totalExcl: round2(p.price * qty) });
    }
    const flat = site.shipping.flatRate;
    const shipping = typeof flat === 'number' ? flat : 0;
    const subtotal = round2(lines.reduce((s, l) => s + l.totalExcl, 0));
    const vat = round2((subtotal + shipping) * site.vatRate);
    const total = round2(subtotal + shipping + vat);

    const g = (k, max) => clean(fields[k], max);
    const order = {
      id: newId('EF'), createdAt: new Date().toISOString(), status: 'created',
      customer: { company: g('company'), vatNumber: g('vat_number'), name: g('name'), email: g('email'), phone: g('phone'), reference: g('reference') },
      delivery: { street: g('delivery_street'), postcode: g('delivery_postcode'), city: g('delivery_city'), country: g('delivery_country') || 'NL' },
      billing: fields.billing_same ? 'gelijk aan afleveradres' : { street: g('billing_street'), postcode: g('billing_postcode'), city: g('billing_city'), country: g('billing_country') || 'NL' },
      remarks: g('remarks', 3000), paymentMethod: g('payment_method'),
      lines, totals: { subtotalExcl: subtotal, shippingExcl: typeof flat === 'number' ? flat : null, vat, totalIncl: total }
    };

    if (cfg.mollieKey) {
      const { ok, body: payment } = await mollie('/payments', {
        method: 'POST',
        body: JSON.stringify({
          amount: { currency: 'EUR', value: total.toFixed(2) },
          description: `Bestelling ${order.id} – EnviroFlow`,
          redirectUrl: `${base}/bestelling/?id=${order.id}`,
          webhookUrl: `${base}/api/mollie-webhook`,
          method: order.paymentMethod,
          metadata: { orderId: order.id }
        })
      });
      if (!ok) {
        log.error('Mollie fout', JSON.stringify(payment).slice(0, 500));
        return json(502, { error: 'De betaling kon niet worden gestart. Kies een andere betaalmethode of neem contact met ons op.' });
      }
      order.status = payment.status;
      order.payment = { provider: 'mollie', id: payment.id, status: payment.status };
      await store.putJSON(`order:${order.id}`, order);
      // Bij overboeking duurt betalen dagen; dan krijgt u nu al bericht.
      if (order.paymentMethod === 'banktransfer') bg(safely('bestelling', notifyOwnerOfOrder(order, 'Nieuwe bestelling (wacht op overboeking)')));
      log.log(`nieuwe bestelling: ${order.id} (${payment.id})`);
      return json(200, { ok: true, orderId: order.id, checkoutUrl: payment._links?.checkout?.href });
    }

    // Zonder betaalprovider: bestelling opslaan; EnviroFlow stuurt zelf een betaalverzoek of factuur.
    order.status = 'awaiting_payment_request';
    await store.putJSON(`order:${order.id}`, order);
    bg(safely('bestelling', Promise.all([notifyOwnerOfOrder(order, 'Nieuwe bestelling (betaalverzoek sturen)'), confirmToCustomer(order, false)])));
    log.log(`nieuwe bestelling: ${order.id} (zonder Mollie)`);
    return json(200, { ok: true, orderId: order.id, message: 'Wij hebben uw bestelling ontvangen. U ontvangt van ons een bevestiging met betaalinstructies.' });
  }

  const validOrderId = (id) => /^EF-\d{8}-[A-F0-9]{6}$/.test(id || '');

  async function handleMollieWebhook(request) {
    const { fields } = await readForm(request);
    const paymentId = clean(fields.id, 64);
    if (!cfg.mollieKey || !/^tr_\w+$/.test(paymentId)) return new Response('', { status: 200 });
    const { ok, body: payment } = await mollie(`/payments/${paymentId}`);
    if (!ok) throw httpError(502, 'Mollie niet bereikbaar'); // Mollie probeert het later opnieuw
    const orderId = payment.metadata?.orderId;
    const order = validOrderId(orderId) ? await store.getJSON(`order:${orderId}`) : null;
    if (!order || order.payment?.id !== paymentId) return new Response('', { status: 200 });

    order.payment.status = payment.status; order.status = payment.status;
    if (payment.status === 'paid' && !order.paidNotifiedAt) {
      order.paidNotifiedAt = new Date().toISOString();
      await store.putJSON(`order:${order.id}`, order);
      await safely('betaling', Promise.all([notifyOwnerOfOrder(order, 'Nieuwe bestelling betaald'), confirmToCustomer(order, true)]));
    } else {
      await store.putJSON(`order:${order.id}`, order);
    }
    log.log(`betaling ${paymentId} voor ${order.id}: ${payment.status}`);
    return new Response('', { status: 200 });
  }

  async function handleOrderStatus(url) {
    const id = url.searchParams.get('id');
    const order = validOrderId(id) ? await store.getJSON(`order:${id}`) : null;
    if (!order) return json(404, { error: 'Niet gevonden' });
    let status = order.status;
    // De klant kan terug zijn voordat de webhook binnen is: dan de actuele status bij Mollie opvragen.
    if (cfg.mollieKey && order.payment?.id && !FINAL_STATUSES.has(status)) {
      const { ok, body } = await mollie(`/payments/${order.payment.id}`);
      if (ok && body.status) status = body.status;
    }
    return json(200, { orderId: order.id, status });
  }

  /** Verwerkt /api/*-verzoeken. `waitUntil` laat meldingen na het antwoord doorlopen (Cloudflare). */
  return async function handle(request, { waitUntil } = {}) {
    const url = new URL(request.url);
    const base = (cfg.baseUrl || url.origin).replace(/\/$/, '');
    const bg = (p) => (waitUntil ? waitUntil(p) : p);
    try {
      if (request.method === 'POST') {
        if (url.pathname === '/api/quote') return await handleForm('quote', request, bg);
        if (url.pathname === '/api/custom') return await handleForm('custom', request, bg);
        if (url.pathname === '/api/contact') return await handleForm('contact', request, bg);
        if (url.pathname === '/api/order') return await handleOrder(request, base, bg);
        if (url.pathname === '/api/mollie-webhook') return await handleMollieWebhook(request);
      }
      if (request.method === 'GET' && url.pathname === '/api/order-status') return await handleOrderStatus(url);
      if (request.method === 'GET' && url.pathname === '/api/status') return await handleStatus();
      return json(404, { error: 'Onbekend endpoint' });
    } catch (err) {
      log.error(err);
      const status = err.status || 500;
      return json(status, { error: status === 500 ? 'Er ging iets mis aan onze kant.' : err.message });
    }
  };
}
