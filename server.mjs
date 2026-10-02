// EnviroFlow – server zonder externe afhankelijkheden: serveert ./dist en verwerkt formulieren en bestellingen.
// Start: node server.mjs   (env: PORT, BASE_URL, MOLLIE_API_KEY, NOTIFY_WEBHOOK_URL, DATA_DIR)
import http from 'node:http';
import { createReadStream, existsSync, statSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomBytes } from 'node:crypto';
import { loadCatalog, hasRealPrice, isOrderable } from './src/lib/catalog.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const DIST = join(root, 'dist');
const DATA = process.env.DATA_DIR || join(root, 'data');
const PORT = Number(process.env.PORT || 8080);
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const MOLLIE_KEY = process.env.MOLLIE_API_KEY || '';
const NOTIFY_URL = process.env.NOTIFY_WEBHOOK_URL || '';
const MAX_FILES = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.pdf']);

const catalog = loadCatalog();
const productsById = Object.fromEntries(catalog.products.map((p) => [p.id, p]));

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self' https://www.mollie.com; frame-ancestors 'self'; base-uri 'self'"
};

const newId = (prefix) => `${prefix}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomBytes(3).toString('hex').toUpperCase()}`;
const clean = (v, max = 2000) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}
const json = (res, status, obj) => send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
const wantsJson = (req) => (req.headers.accept || '').includes('application/json');
function reply(req, res, status, obj, redirect = '/bedankt/') {
  if (wantsJson(req)) return json(res, status, obj);
  if (status < 300) return send(res, 303, '', { Location: redirect });
  return send(res, status, `<!doctype html><meta charset="utf-8"><title>Fout</title><p>${obj.error}</p><p><a href="javascript:history.back()">Terug</a></p>`, { 'Content-Type': 'text/html; charset=utf-8' });
}

async function readBody(req, limit) {
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Object.assign(new Error('Het verzoek is te groot.'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** Leest formulierdata (multipart, urlencoded of JSON) via de ingebouwde Web-API van Node. */
async function readForm(req) {
  const type = req.headers['content-type'] || '';
  const buf = await readBody(req, type.includes('multipart/form-data') ? (MAX_FILES * MAX_FILE_SIZE + 2 * 1024 * 1024) : 200 * 1024);
  if (type.includes('application/json')) return { fields: JSON.parse(buf.toString('utf8') || '{}'), files: [] };
  const request = new Request('http://local/', { method: 'POST', headers: { 'content-type': type }, body: buf });
  const fd = await request.formData();
  const fields = {}; const files = [];
  for (const [k, v] of fd.entries()) {
    if (typeof v === 'string') fields[k] = v;
    else if (v && v.size > 0) files.push(v);
  }
  return { fields, files };
}

async function saveSubmission(kind, record, files = []) {
  const dir = join(DATA, kind); mkdirSync(dir, { recursive: true });
  if (files.length) {
    if (files.length > MAX_FILES) throw Object.assign(new Error(`Maximaal ${MAX_FILES} bestanden.`), { status: 400 });
    const fdir = join(DATA, 'uploads', record.id); mkdirSync(fdir, { recursive: true });
    record.files = [];
    for (const [i, f] of files.entries()) {
      const ext = extname(f.name || '').toLowerCase();
      if (!ALLOWED_EXT.has(ext)) throw Object.assign(new Error('Dit bestandstype is niet toegestaan.'), { status: 400 });
      if (f.size > MAX_FILE_SIZE) throw Object.assign(new Error('Een bestand is groter dan 10 MB.'), { status: 400 });
      const safe = `${String(i + 1).padStart(2, '0')}-${(f.name || 'bestand').replace(/[^\w.-]+/g, '_').slice(-80)}`;
      writeFileSync(join(fdir, safe), Buffer.from(await f.arrayBuffer()));
      record.files.push(safe);
    }
  }
  writeFileSync(join(dir, `${record.id}.json`), JSON.stringify(record, null, 2));
  notify(kind, record);
  return record;
}

/** Meldingen: logt altijd; stuurt optioneel door naar een webhook (bijv. e-maildienst, Slack, Zapier/Make). */
function notify(kind, record) {
  console.log(`[${new Date().toISOString()}] nieuwe ${kind}: ${record.id}`);
  if (!NOTIFY_URL) return;
  fetch(NOTIFY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ kind, record }) }).catch((e) => console.error('notify mislukt', e.message));
}

const FORM_SPECS = {
  quote: { required: ['company', 'name', 'email', 'phone', 'privacy'], fields: ['request_type', 'company', 'name', 'email', 'phone', 'product', 'quantity', 'liquid', 'application', 'delivery_date', 'remarks', 'source'] },
  custom: { required: ['company', 'name', 'email', 'phone', 'privacy'], fields: ['company', 'name', 'email', 'phone', 'liquid', 'volume', 'dimensions', 'application', 'location', 'duration', 'wish'] },
  contact: { required: ['name', 'email', 'message', 'privacy'], fields: ['name', 'company', 'email', 'phone', 'message'] }
};

async function handleForm(kind, req, res) {
  const { fields, files } = await readForm(req);
  if (fields.website) return reply(req, res, 200, { ok: true }); // honeypot: stil negeren
  const spec = FORM_SPECS[kind];
  const missing = spec.required.filter((k) => !clean(fields[k]));
  if (missing.length) return reply(req, res, 400, { error: 'Vul alle verplichte velden in.', missing });
  if (!isEmail(clean(fields.email))) return reply(req, res, 400, { error: 'Vul een geldig e-mailadres in.' });
  const record = { id: newId(kind === 'quote' ? 'OFF' : kind === 'custom' ? 'MW' : 'CT'), kind, createdAt: new Date().toISOString(), data: {} };
  spec.fields.forEach((k) => { record.data[k] = clean(fields[k], k === 'remarks' || k === 'wish' || k === 'message' ? 5000 : 300); });
  if (record.data.product && productsById[record.data.product]) record.data.productName = productsById[record.data.product].name;
  await saveSubmission(kind === 'quote' ? 'offertes' : kind === 'custom' ? 'maatwerk' : 'contact', record, files);
  return reply(req, res, 200, { ok: true, id: record.id });
}

/* ---------------------------------------------------------------- bestellingen */
const ORDER_REQUIRED = ['company', 'name', 'email', 'phone', 'delivery_street', 'delivery_postcode', 'delivery_city', 'payment_method', 'terms'];
const round2 = (n) => Math.round(n * 100) / 100;

async function handleOrder(req, res) {
  const { fields } = await readForm(req);
  if (fields.website) return json(res, 200, { ok: true, orderId: '-' });
  const missing = ORDER_REQUIRED.filter((k) => !clean(fields[k]));
  if (!fields.billing_same) ['billing_street', 'billing_postcode', 'billing_city'].forEach((k) => { if (!clean(fields[k])) missing.push(k); });
  if (missing.length) return json(res, 400, { error: 'Vul alle verplichte velden in.', missing });
  if (!isEmail(clean(fields.email))) return json(res, 400, { error: 'Vul een geldig e-mailadres in.' });
  if (!catalog.site.paymentMethods.some((m) => m.id === fields.payment_method)) return json(res, 400, { error: 'Kies een geldige betaalmethode.' });

  let items = fields.items;
  if (typeof items === 'string') { try { items = JSON.parse(items); } catch { items = []; } }
  if (!Array.isArray(items) || !items.length || items.length > 50) return json(res, 400, { error: 'Uw winkelwagen is leeg.' });

  // Prijzen altijd uit de catalogus, nooit van de client.
  const lines = [];
  for (const it of items) {
    const p = productsById[it?.id];
    const qty = Math.floor(Number(it?.qty));
    if (!p || !isOrderable(p) || !Number.isFinite(qty) || qty < 1 || qty > 999) return json(res, 400, { error: 'Een product in uw winkelwagen is niet (meer) online te bestellen.' });
    if (!hasRealPrice(p)) return json(res, 400, { error: `Voor “${p.name}” is nog geen prijs bekend. Vraag een offerte aan.` });
    lines.push({ id: p.id, name: p.name, qty, unitPriceExcl: p.price, totalExcl: round2(p.price * qty) });
  }
  const vatRate = catalog.site.vatRate;
  const shipping = typeof catalog.site.shipping.flatRate === 'number' ? catalog.site.shipping.flatRate : 0;
  const subtotal = round2(lines.reduce((s, l) => s + l.totalExcl, 0));
  const vat = round2((subtotal + shipping) * vatRate);
  const total = round2(subtotal + shipping + vat);

  const g = (k, max) => clean(fields[k], max);
  const order = {
    id: newId('EF'), createdAt: new Date().toISOString(), status: 'created',
    customer: { company: g('company'), vatNumber: g('vat_number'), name: g('name'), email: g('email'), phone: g('phone'), reference: g('reference') },
    delivery: { street: g('delivery_street'), postcode: g('delivery_postcode'), city: g('delivery_city'), country: g('delivery_country') || 'NL' },
    billing: fields.billing_same ? 'gelijk aan afleveradres' : { street: g('billing_street'), postcode: g('billing_postcode'), city: g('billing_city'), country: g('billing_country') || 'NL' },
    remarks: g('remarks', 3000), paymentMethod: g('payment_method'),
    lines, totals: { subtotalExcl: subtotal, shippingExcl: catalog.site.shipping.flatRate, vat, totalIncl: total, shippingNote: catalog.site.shipping.flatRate == null ? 'Verzendkosten worden na bestelling berekend' : null }
  };

  if (MOLLIE_KEY) {
    const r = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${MOLLIE_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: { currency: 'EUR', value: total.toFixed(2) },
        description: `Bestelling ${order.id} – EnviroFlow`,
        redirectUrl: `${BASE_URL}/bestelling/?id=${order.id}`,
        webhookUrl: `${BASE_URL}/api/mollie-webhook`,
        method: order.paymentMethod,
        metadata: { orderId: order.id }
      })
    });
    const payment = await r.json();
    if (!r.ok) { console.error('Mollie fout', payment); return json(res, 502, { error: 'De betaling kon niet worden gestart.' }); }
    order.payment = { provider: 'mollie', id: payment.id, status: payment.status };
    await saveSubmission('bestellingen', order);
    return json(res, 200, { ok: true, orderId: order.id, checkoutUrl: payment._links?.checkout?.href });
  }

  // Zonder betaalprovider: bestelling wordt opgeslagen; u stuurt zelf een betaalverzoek/factuur.
  order.status = 'awaiting_payment_request';
  await saveSubmission('bestellingen', order);
  return json(res, 200, { ok: true, orderId: order.id, message: 'Wij hebben uw bestelling ontvangen. U ontvangt van ons een bevestiging met betaalinstructies.' });
}

function readOrder(id) {
  if (!/^EF-\d{8}-[A-F0-9]{6}$/.test(id || '')) return null;
  const f = join(DATA, 'bestellingen', `${id}.json`);
  return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null;
}

async function handleMollieWebhook(req, res) {
  const { fields } = await readForm(req);
  const paymentId = clean(fields.id, 64);
  if (!MOLLIE_KEY || !/^tr_\w+$/.test(paymentId)) return send(res, 200, '');
  const r = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, { headers: { Authorization: `Bearer ${MOLLIE_KEY}` } });
  if (!r.ok) return send(res, 200, '');
  const payment = await r.json();
  const order = readOrder(payment.metadata?.orderId);
  if (order && order.payment?.id === paymentId) {
    order.payment.status = payment.status; order.status = payment.status;
    writeFileSync(join(DATA, 'bestellingen', `${order.id}.json`), JSON.stringify(order, null, 2));
    if (payment.status === 'paid') notify('betaling', { id: order.id, total: order.totals.totalIncl });
  }
  return send(res, 200, '');
}

/* ---------------------------------------------------------------- statische bestanden */
function serveStatic(req, res, pathname) {
  let p = decodeURIComponent(pathname);
  const target = normalize(join(DIST, p));
  if (!target.startsWith(DIST)) return send(res, 403, 'Forbidden');
  let file = target;
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!p.endsWith('/')) return send(res, 301, '', { Location: p + '/' });
    file = join(file, 'index.html');
  }
  if (!existsSync(file)) {
    const nf = join(DIST, '404.html');
    return send(res, 404, existsSync(nf) ? readFileSync(nf) : 'Niet gevonden', { 'Content-Type': 'text/html; charset=utf-8' });
  }
  const ext = extname(file);
  const immutable = /\/assets\/(fonts|img)\//.test(file);
  res.writeHead(200, { ...SECURITY_HEADERS, 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.html' ? 'no-cache' : immutable ? 'public, max-age=31536000, immutable' : 'public, max-age=3600' });
  if (req.method === 'HEAD') return res.end();
  createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://local');
  try {
    if (req.method === 'POST') {
      if (url.pathname === '/api/quote') return await handleForm('quote', req, res);
      if (url.pathname === '/api/custom') return await handleForm('custom', req, res);
      if (url.pathname === '/api/contact') return await handleForm('contact', req, res);
      if (url.pathname === '/api/order') return await handleOrder(req, res);
      if (url.pathname === '/api/mollie-webhook') return await handleMollieWebhook(req, res);
      return json(res, 404, { error: 'Onbekend endpoint' });
    }
    if (req.method === 'GET' && url.pathname === '/api/order-status') {
      const order = readOrder(url.searchParams.get('id'));
      return order ? json(res, 200, { orderId: order.id, status: order.status }) : json(res, 404, { error: 'Niet gevonden' });
    }
    if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, url.pathname);
    return send(res, 405, 'Method not allowed');
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return wantsJson(req) || url.pathname.startsWith('/api/') ? json(res, status, { error: status === 500 ? 'Er ging iets mis aan onze kant.' : err.message }) : send(res, status, 'Er ging iets mis.');
  }
});

server.listen(PORT, () => console.log(`EnviroFlow draait op ${BASE_URL}${MOLLIE_KEY ? ' (Mollie actief)' : ' (geen betaalprovider ingesteld)'}`));
