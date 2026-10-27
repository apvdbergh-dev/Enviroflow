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
  quote: { prefix: 'OF', label: 'offerteaanvraag', title: 'Nieuwe offerteaanvraag', required: ['company', 'name', 'email', 'phone', 'privacy'], fields: ['request_type', 'company', 'name', 'email', 'phone', 'product', 'quantity', 'liquid', 'application', 'delivery_date', 'remarks', 'source', 'found_via', 'doubts'] },
  custom: { prefix: 'OF', label: 'maatwerkaanvraag', title: 'Nieuwe maatwerkaanvraag', required: ['company', 'name', 'email', 'phone', 'privacy'], fields: ['company', 'name', 'email', 'phone', 'liquid', 'volume', 'dimensions', 'application', 'location', 'duration', 'wish', 'found_via', 'doubts'] },
  contact: { prefix: 'CT', label: 'contactbericht', title: 'Nieuw contactbericht', required: ['name', 'email', 'message', 'privacy'], fields: ['name', 'company', 'email', 'phone', 'message', 'found_via', 'doubts'] }
};
// Nummers: letters + jaar (2 cijfers) + volgnummer van 4 cijfers, per jaar opnieuw vanaf 0001.
// Offertes (ook maatwerk): OF260396. Contactberichten: CT-262648. Webshopbestellingen: EF-263886.
// `start` = per jaar het laatste nummer dat al vergeven is (of het gekozen beginpunt); de website gaat daarna verder.
const NUMBER_SERIES = {
  OF: { sep: '', start: { 26: 395 }, key: 'submission' },
  CT: { sep: '-', start: { 26: 2647 }, key: 'submission' },
  EF: { sep: '-', start: { 26: 3885 }, key: 'order' }
};
const LONG_FIELDS = new Set(['remarks', 'wish', 'message', 'doubts']);
const FIELD_LABELS = {
  request_type: 'Soort aanvraag', company: 'Bedrijf', name: 'Naam', email: 'E-mail', phone: 'Telefoon', product: 'Product (id)', productName: 'Product',
  quantity: 'Aantal', liquid: 'Vloeistof', application: 'Toepassing', delivery_date: 'Gewenste leverdatum', remarks: 'Opmerkingen', source: 'Bron',
  volume: 'Volume', dimensions: 'Afmetingen', location: 'Locatie', duration: 'Gebruiksduur', wish: 'Wens', message: 'Bericht', found_via: 'Hoe gevonden', doubts: 'Twijfelt nog over', vatNumber: 'Btw-nummer', reference: 'Referentie'
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
const eur = (n, lang = 'nl') => new Intl.NumberFormat(lang === 'en' ? 'en-IE' : 'nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
/** Taal van de klant: 'en' als het formulier op de Engelse site is ingevuld, anders 'nl'. */
const langOf = (fields) => (fields?.lang === 'en' ? 'en' : 'nl');
const tr = (lang) => (nl, en) => (lang === 'en' ? en : nl);
const extOf = (name) => { const m = /\.[^.]+$/.exec(name || ''); return m ? m[0].toLowerCase() : ''; };

function toBase64(buf) {
  const bytes = new Uint8Array(buf); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

const httpError = (status, message) => Object.assign(new Error(message), { status });
const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
const wantsJson = (request) => (request.headers.get('accept') || '').includes('application/json');

/** Antwoord voor formulieren: JSON voor fetch, anders een doorverwijzing (werkt ook zonder JavaScript). */
function reply(request, status, obj, lang = 'nl') {
  if (wantsJson(request)) return json(status, obj);
  const T = tr(lang);
  if (status < 300) return new Response(null, { status: 303, headers: { Location: T('/bedankt/', '/en/bedankt/') + (obj.nr ? `?nr=${encodeURIComponent(obj.nr)}` : '') } });
  return new Response(`<!doctype html><html lang="${lang}"><meta charset="utf-8"><title>${T('Fout', 'Error')}</title><p>${escHtml(obj.error)}</p><p><a href="javascript:history.back()">${T('Terug', 'Back')}</a></p></html>`, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
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
function renderMail(intro, sections, outro = '', lang = 'nl') {
  const text = [intro, ...sections.map(([title, rows]) => `${title}\n${rows.filter(([, v]) => v !== '' && v != null).map(([k, v]) => (k ? `  ${k}: ${v}` : `  ${v}`)).join('\n')}`), outro].filter(Boolean).join('\n\n');
  // Volledig HTML-document met taal en tekenset; opmaak één keer in <style> i.p.v. per cel (meer tekst t.o.v. code).
  const rowsHtml = (rows) => rows.filter(([, v]) => v !== '' && v != null).map(([k, v]) => `<tr><td class="k">${escHtml(k)}</td><td>${escHtml(v)}</td></tr>`).join('');
  const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>EnviroFlow</title>
<style>body{margin:0;padding:16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.5;color:#1a1a1a}h3{color:#0A3B2C;margin:20px 0 6px}table{border-collapse:collapse}td{padding:2px 12px 2px 0;vertical-align:top;white-space:pre-wrap}td.k{color:#555}</style></head>
<body><p>${escHtml(intro).replace(/\n/g, '<br>')}</p>
${sections.map(([title, rows]) => `<h3>${escHtml(title)}</h3><table>${rowsHtml(rows)}</table>`).join('\n')}
${outro ? `<p>${escHtml(outro).replace(/\n/g, '<br>')}</p>` : ''}
</body></html>`;
  return { text, html };
}

export function createApi({ catalog, catalogEn = catalog, store, config, log = console }) {
  const cfg = { ...configFromEnv(), ...config };
  const site = catalog.site;
  const siteFor = (lang) => (lang === 'en' ? catalogEn.site : site);
  const notifyEmail = cfg.notifyEmail || site.email;
  const now = cfg.now || (() => new Date());

  /** Volgend nummer in een reeks (OF, CT of EF). Het jaar volgt de Nederlandse tijd, zodat 1 januari 00:00 meteen het nieuwe jaar is. */
  async function nextNumber(series) {
    const { sep, start, key: recordKey } = NUMBER_SERIES[series];
    const yy = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', year: '2-digit' }).format(now());
    const key = `counter:${series}:${yy}`;
    let n = Math.max(Number(await store.getJSON(key)) || 0, start[yy] || 0);
    let id;
    // Bestaat het nummer toch al (bijv. twee aanvragen tegelijk), dan het volgende nemen.
    do { n += 1; id = `${series}${sep}${yy}${String(n).padStart(4, '0')}`; } while (await store.getJSON(`${recordKey}:${id}`));
    await store.putJSON(key, n);
    return id;
  }
  const productsById = Object.fromEntries(catalog.products.map((p) => [p.id, p]));
  const productsByIdEn = Object.fromEntries(catalogEn.products.map((p) => [p.id, p]));
  const companyFooter = (lang) => tr(lang)(
    `EnviroFlow · ${site.address.street}, ${site.address.postalCode} ${site.address.city} · KvK ${site.kvk} · Btw ${site.vatNumber}\n${site.phonePrimary.display} · ${site.email}`,
    `EnviroFlow · ${site.address.street}, ${site.address.postalCode} ${site.address.city}, the Netherlands · CoC (KvK) ${site.kvk} · VAT ${site.vatNumber}\n${site.phonePrimary.display.replace(/^0/, '+31 ')} · ${site.email}`
  );
  const LANG_NOTE = 'Engels – de klant vulde het formulier in op de Engelse website; antwoord bij voorkeur in het Engels';

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
    const lang = langOf(fields); const T = tr(lang);
    if (fields.website) return reply(request, 200, { ok: true }, lang); // honeypot: stil negeren
    const spec = FORM_SPECS[kind];
    const missing = spec.required.filter((k) => !clean(fields[k]));
    if (missing.length) return reply(request, 400, { error: T('Vul alle verplichte velden in.', 'Please fill in all required fields.'), missing }, lang);
    if (!isEmail(clean(fields.email))) return reply(request, 400, { error: T('Vul een geldig e-mailadres in.', 'Please enter a valid email address.') }, lang);
    if (files.length > MAX_FILES) return reply(request, 400, { error: T(`Maximaal ${MAX_FILES} bestanden.`, `A maximum of ${MAX_FILES} files.`) }, lang);
    for (const f of files) {
      if (!ALLOWED_EXT.has(extOf(f.name))) return reply(request, 400, { error: T('Dit bestandstype is niet toegestaan.', 'This file type is not allowed.') }, lang);
      if (f.size > MAX_FILE_SIZE) return reply(request, 400, { error: T('Een bestand is groter dan 10 MB.', 'A file is larger than 10 MB.') }, lang);
    }

    const record = { id: await nextNumber(spec.prefix), kind, lang, createdAt: now().toISOString(), data: {} };
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
    // Zoals EnviroFlow een offerte noemt: "Enviroflow OF260396 Bedrijfsnaam" (bedrijfsnaam precies zoals ingevuld).
    const nr = spec.prefix === 'OF' ? `Enviroflow ${record.id}` : null;
    const rows = Object.entries(d).filter(([k]) => k !== 'product').map(([k, v]) => [FIELD_LABELS[k] || k, v]);
    if (lang === 'en') rows.push(['Taal', LANG_NOTE]);
    const fileNote = record.files.length ? `${record.files.length} bijlage(n)${attachments.length < record.files.length ? ' (te groot om allemaal mee te sturen; opgeslagen bij ' + record.id + ')' : ''}` : '';
    const { text, html } = renderMail(`${spec.title} via de website (${record.id}).`, [['Gegevens', rows], ['Bijlagen', [['', fileNote || 'geen']]]], 'Beantwoorden van deze mail gaat rechtstreeks naar de klant.');
    bg(safely('formulier', Promise.all([
      push({ title: spec.title, message: `${record.id}${record.files.length ? ` · ${record.files.length} bijlage(n)` : ''} · details in je mail`, tags: ['envelope'] }),
      mail({ to: notifyEmail, subject: nr ? `${nr}${d.company ? ` ${d.company}` : ''}` : `${spec.title} ${record.id}${d.company ? ` – ${d.company}` : ''}`, text, html, replyTo: d.email, attachments })
    ])));
    log.log(`nieuwe ${kind}: ${record.id}${lang === 'en' ? ' (Engels)' : ''}`);
    return reply(request, 200, { ok: true, id: record.id, ...(nr ? { nr } : {}) }, lang);
  }

  /* ---------- bestellingen ---------- */
  // Secties van de bestelmail. Voor EnviroFlow altijd Nederlands; voor de klant in de taal waarin hij bestelde.
  function orderMailSections(order, lang = 'nl') {
    const T = tr(lang); const money = (n) => eur(n, lang);
    const c = order.customer; const dl = order.delivery; const b = order.billing; const t = order.totals;
    const method = siteFor(lang).paymentMethods.find((m) => m.id === order.paymentMethod)?.label || order.paymentMethod;
    const lineName = (l) => (lang === 'en' ? l.nameEn || l.name : l.nameNl || l.name);
    const sections = [
      [T('Klant', 'Customer'), [[T('Bedrijf', 'Company'), c.company], [T('Btw-nummer', 'VAT number'), c.vatNumber], [T('Naam', 'Name'), c.name], [T('E-mail', 'Email'), c.email], [T('Telefoon', 'Phone'), c.phone], [T('Referentie', 'Reference'), c.reference]]],
      [T('Afleveradres', 'Delivery address'), [['', `${dl.street}, ${dl.postcode} ${dl.city} (${dl.country})`]]],
      [T('Factuuradres', 'Billing address'), [['', typeof b === 'string' ? `${dl.street}, ${dl.postcode} ${dl.city} (${dl.country}) – ${T('gelijk aan afleveradres', 'same as delivery address')}` : `${b.street}, ${b.postcode} ${b.city} (${b.country})`]]],
      [T('Producten', 'Products'), order.lines.map((l) => [`${l.qty} ×`, `${lineName(l)} — ${money(l.totalExcl)} ${T('excl. btw', 'excl. VAT')}`])],
      [T('Totaal', 'Total'), [[T('Subtotaal excl. btw', 'Subtotal excl. VAT'), money(t.subtotalExcl)], [T('Verzendkosten', 'Shipping costs'), t.shippingExcl == null ? T('Worden na bestelling berekend', 'Calculated after ordering') : money(t.shippingExcl)], [`${T('Btw', 'VAT')} (${Math.round(site.vatRate * 100)}%)`, money(t.vat)], [T('Totaal incl. btw', 'Total incl. VAT'), money(t.totalIncl)]]],
      [T('Betaling', 'Payment'), [[T('Methode', 'Method'), method], ['Status', order.status]]],
      [T('Opmerkingen', 'Remarks'), [['', order.remarks]]]
    ];
    if (lang === 'nl' && order.lang === 'en') sections[0][1].push(['Taal', LANG_NOTE]);
    return sections;
  }
  // Orderbevestiging als PDF-bijlage; lukt dat niet, dan gaat de mail zonder bijlage.
  function pdfAttachment(order) {
    const lang = order.lang === 'en' ? 'en' : 'nl';
    const pdfOrder = { ...order, lines: order.lines.map((l) => ({ ...l, name: lang === 'en' ? l.nameEn || l.name : l.nameNl || l.name })) };
    try { return [{ filename: `${lang === 'en' ? 'Order-confirmation' : 'Orderbevestiging'}-${order.id}.pdf`, content: toBase64(orderPdf(pdfOrder, siteFor(lang), lang)) }]; }
    catch (e) { log.error('pdf mislukt', order.id, e.message); return []; }
  }
  function notifyOwnerOfOrder(order, headline) {
    const pdfNote = order.lang === 'en' ? 'De orderbevestiging die de klant ontvangt (in het Engels), zit als PDF in de bijlage.' : 'De orderbevestiging die de klant ontvangt, zit als PDF in de bijlage.';
    const { text, html } = renderMail(`${headline} (${order.id}).`, orderMailSections(order), `Beantwoorden van deze mail gaat rechtstreeks naar de klant. ${pdfNote}`);
    return Promise.all([
      push({ title: headline, message: `${order.id} · ${eur(order.totals.totalIncl)} · ${order.lines.reduce((s, l) => s + l.qty, 0)} artikel(en) · details in je mail`, tags: ['moneybag'], priority: 5 }),
      mail({ to: notifyEmail, subject: `${headline} ${order.id} – ${order.customer.company} – ${eur(order.totals.totalIncl)}`, text, html, replyTo: order.customer.email, attachments: pdfAttachment(order) })
    ]);
  }
  function confirmToCustomer(order, paid) {
    const lang = order.lang === 'en' ? 'en' : 'nl'; const T = tr(lang);
    const intro = T(
      `Beste ${order.customer.name},\n\nBedankt voor uw bestelling bij EnviroFlow. ${paid ? 'Wij hebben uw betaling ontvangen.' : 'Wij hebben uw bestelling ontvangen. U ontvangt van ons een bevestiging met betaalinstructies.'}\nHieronder vindt u het overzicht van bestelling ${order.id}. In de bijlage vindt u de orderbevestiging als PDF.`,
      `Dear ${order.customer.name},\n\nThank you for your order with EnviroFlow. ${paid ? 'We have received your payment.' : 'We have received your order. You will receive a confirmation with payment instructions from us.'}\nBelow you will find the overview of order ${order.id}. The order confirmation is attached as a PDF.`
    );
    const paymentTitle = T('Betaling', 'Payment');
    const sections = orderMailSections(order, lang).filter(([title]) => title !== paymentTitle);
    const outro = T(
      `Wij nemen zo snel mogelijk contact met u op over de levering.\nHeeft u vragen? Bel ${site.phonePrimary.display} of mail naar ${site.email}.\n\nMet vriendelijke groet,\nEnviroFlow\n\n${companyFooter('nl')}`,
      `We will contact you about the delivery as soon as possible.\nAny questions? Call ${site.phonePrimary.display.replace(/^0/, "+31 ")} or email ${site.email}.\n\nKind regards,\nEnviroFlow\n\n${companyFooter('en')}`
    );
    const { text, html } = renderMail(intro, sections, outro, lang);
    return mail({ to: order.customer.email, subject: T(`Bevestiging bestelling ${order.id} – EnviroFlow`, `Order confirmation ${order.id} – EnviroFlow`), text, html, replyTo: site.email, attachments: pdfAttachment(order) });
  }

  async function mollie(path, init = {}) {
    const r = await fetch(`${cfg.mollieApi}${path}`, { ...init, headers: { Authorization: `Bearer ${cfg.mollieKey}`, 'Content-Type': 'application/json', ...(init.headers || {}) } });
    const body = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, body };
  }

  async function handleOrder(request, base, bg) {
    const { fields } = await readForm(request);
    const lang = langOf(fields); const T = tr(lang);
    if (fields.website) return json(200, { ok: true, orderId: '-' });
    const missing = ORDER_REQUIRED.filter((k) => !clean(fields[k]));
    if (!fields.billing_same) ['billing_street', 'billing_postcode', 'billing_city'].forEach((k) => { if (!clean(fields[k])) missing.push(k); });
    if (missing.length) return json(400, { error: T('Vul alle verplichte velden in.', 'Please fill in all required fields.'), missing });
    if (!isEmail(clean(fields.email))) return json(400, { error: T('Vul een geldig e-mailadres in.', 'Please enter a valid email address.') });
    if (!site.paymentMethods.some((m) => m.id === fields.payment_method)) return json(400, { error: T('Kies een geldige betaalmethode.', 'Please choose a valid payment method.') });

    let items = fields.items;
    if (typeof items === 'string') { try { items = JSON.parse(items); } catch { items = []; } }
    if (!Array.isArray(items) || !items.length || items.length > 50) return json(400, { error: T('Uw winkelwagen is leeg.', 'Your shopping cart is empty.') });

    // Prijzen altijd uit de catalogus, nooit van de client.
    const lines = [];
    for (const it of items) {
      const p = productsById[it?.id];
      const qty = Math.floor(Number(it?.qty));
      const nameEn = productsByIdEn[it?.id]?.name;
      if (!p || !isOrderable(p) || !Number.isFinite(qty) || qty < 1 || qty > 999) return json(400, { error: T('Een product in uw winkelwagen is niet (meer) online te bestellen.', 'A product in your shopping cart can no longer be ordered online.') });
      if (!hasRealPrice(p)) return json(400, { error: T(`Voor “${p.name}” is nog geen prijs bekend. Vraag een offerte aan.`, `There is no price yet for “${nameEn || p.name}”. Please request a quote.`) });
      // name = Nederlands (voor EnviroFlow); nameEn alleen bij een Engelse bestelling, voor de klant.
      lines.push({ id: p.id, name: p.name, ...(lang === 'en' && nameEn ? { nameEn } : {}), qty, unitPriceExcl: p.price, totalExcl: round2(p.price * qty) });
    }
    const flat = site.shipping.flatRate;
    const shipping = typeof flat === 'number' ? flat : 0;
    const subtotal = round2(lines.reduce((s, l) => s + l.totalExcl, 0));
    const vat = round2((subtotal + shipping) * site.vatRate);
    const total = round2(subtotal + shipping + vat);

    const g = (k, max) => clean(fields[k], max);
    const order = {
      id: await nextNumber('EF'), lang, createdAt: now().toISOString(), status: 'created',
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
          description: T(`Bestelling ${order.id} – EnviroFlow`, `Order ${order.id} – EnviroFlow`),
          redirectUrl: `${base}${T('', '/en')}/bestelling/?id=${order.id}`,
          webhookUrl: `${base}/api/mollie-webhook`,
          method: order.paymentMethod,
          locale: T('nl_NL', 'en_US'),
          metadata: { orderId: order.id }
        })
      });
      if (!ok) {
        log.error('Mollie fout', JSON.stringify(payment).slice(0, 500));
        return json(502, { error: T('De betaling kon niet worden gestart. Kies een andere betaalmethode of neem contact met ons op.', 'The payment could not be started. Please choose another payment method or contact us.') });
      }
      order.status = payment.status;
      order.payment = { provider: 'mollie', id: payment.id, status: payment.status };
      await store.putJSON(`order:${order.id}`, order);
      // Bij overboeking duurt betalen dagen; dan krijgt u nu al bericht.
      if (order.paymentMethod === 'banktransfer') bg(safely('bestelling', notifyOwnerOfOrder(order, 'Nieuwe bestelling (wacht op overboeking)')));
      log.log(`nieuwe bestelling: ${order.id} (${payment.id})${lang === 'en' ? ' (Engels)' : ''}`);
      return json(200, { ok: true, orderId: order.id, checkoutUrl: payment._links?.checkout?.href });
    }

    // Zonder betaalprovider: bestelling opslaan; EnviroFlow stuurt zelf een betaalverzoek of factuur.
    order.status = 'awaiting_payment_request';
    await store.putJSON(`order:${order.id}`, order);
    bg(safely('bestelling', Promise.all([notifyOwnerOfOrder(order, 'Nieuwe bestelling (betaalverzoek sturen)'), confirmToCustomer(order, false)])));
    log.log(`nieuwe bestelling: ${order.id} (zonder Mollie)`);
    return json(200, { ok: true, orderId: order.id, message: T('Wij hebben uw bestelling ontvangen. U ontvangt van ons een bevestiging met betaalinstructies.', 'We have received your order. You will receive a confirmation with payment instructions from us.') });
  }

  // Nieuw: EF-263886. Oud (vóór de doorlopende nummering): EF-20261021-5FBECE; die blijven werken.
  const validOrderId = (id) => /^EF-(\d{6,}|\d{8}-[A-F0-9]{6})$/.test(id || '');

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
