// EnviroFlow – lokale server zonder externe afhankelijkheden: serveert ./dist en verwerkt /api/* met
// dezelfde code als de Cloudflare-versie (src/lib/api.mjs). Opslag in DATA_DIR in plaats van Cloudflare KV.
// Start: node server.mjs   (env: PORT, DATA_DIR en de variabelen uit README, zoals MOLLIE_API_KEY en NTFY_TOPIC)
import http from 'node:http';
import { createReadStream, existsSync, statSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog } from './src/lib/catalog.mjs';
import { createApi, configFromEnv } from './src/lib/api.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const DIST = join(root, 'dist');
const DATA = process.env.DATA_DIR || join(root, 'data');
const PORT = Number(process.env.PORT || 8080);
const BASE_URL = (process.env.BASE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const MAX_BODY = 102 * 1024 * 1024; // 10 bestanden van max. 10 MB plus formuliervelden

const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2', '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.pdf': 'application/pdf', '.ico': 'image/x-icon' };
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; form-action 'self' https://www.mollie.com; frame-ancestors 'self'; base-uri 'self'"
};

// Opslag op schijf: sleutel "soort:id" → DATA_DIR/soort/id.json, bijlagen → DATA_DIR/upload/<id>/<bestand>.
const keyPath = (key, ext = '') => {
  const [kind, ...rest] = key.split(':');
  return join(DATA, ...[kind, ...rest].map((part) => part.replace(/[^\w.-]+/g, '_'))) + ext;
};
const fileStore = {
  async getJSON(key) { const f = keyPath(key, '.json'); return existsSync(f) ? JSON.parse(readFileSync(f, 'utf8')) : null; },
  async putJSON(key, value) { const f = keyPath(key, '.json'); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, JSON.stringify(value, null, 2)); },
  async putFile(key, data) { const f = keyPath(key); mkdirSync(dirname(f), { recursive: true }); writeFileSync(f, Buffer.from(data)); }
};
const config = configFromEnv(process.env);
const api = createApi({ catalog: loadCatalog(), catalogEn: loadCatalog('en'), store: fileStore, config: { ...config, baseUrl: config.baseUrl || BASE_URL } });

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...SECURITY_HEADERS, ...headers });
  res.end(body);
}

async function readBody(req) {
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY) throw Object.assign(new Error('Het verzoek is te groot.'), { status: 413 });
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

/** Zet het Node-verzoek om naar een standaard Request, laat api.mjs het afhandelen en stuurt het antwoord terug. */
async function handleApi(req, res) {
  const headers = new Headers();
  for (const [k, v] of Object.entries(req.headers)) if (typeof v === 'string') headers.set(k, v);
  const body = req.method === 'POST' ? await readBody(req) : undefined;
  const response = await api(new Request(BASE_URL + req.url, { method: req.method, headers, body }));
  res.writeHead(response.status, { ...SECURITY_HEADERS, ...Object.fromEntries(response.headers) });
  res.end(Buffer.from(await response.arrayBuffer()));
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
    const nf = join(DIST, /^\/en(\/|$)/.test(p) ? 'en/404.html' : '404.html'); // Engelse 404 onder /en/
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
    if (url.pathname.startsWith('/api/')) return await handleApi(req, res);
    if (req.method === 'GET' || req.method === 'HEAD') return serveStatic(req, res, url.pathname);
    return send(res, 405, 'Method not allowed');
  } catch (err) {
    console.error(err);
    const status = err.status || 500;
    return url.pathname.startsWith('/api/') ? send(res, status, JSON.stringify({ error: status === 500 ? 'Er ging iets mis aan onze kant.' : err.message }), { 'Content-Type': 'application/json; charset=utf-8' }) : send(res, status, 'Er ging iets mis.');
  }
});

server.listen(PORT, () => console.log(`EnviroFlow draait op ${BASE_URL}${config.mollieKey ? ' (Mollie actief)' : ' (geen betaalprovider ingesteld)'}`));
