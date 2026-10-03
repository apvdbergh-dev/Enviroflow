// Kwaliteitscontrole op de build: één H1, unieke title/description, geldige JSON-LD en geen dode interne links.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url).pathname;
const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith('.html')) pages.push(p); } })(dist);

const errors = []; const titles = new Map(); const descs = new Map();
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const rel = '/' + file.slice(dist.length).replace(/index\.html$/, '');
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${rel}: ${h1} × <h1>`);
  const noindex = html.includes('noindex');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const desc = html.match(/<meta name="description" content="(.*?)">/)?.[1];
  if (!title || !desc) errors.push(`${rel}: title/description ontbreekt`);
  if (!noindex) {
    if (titles.has(title)) errors.push(`${rel}: dubbele title met ${titles.get(title)}`); else titles.set(title, rel);
    if (descs.has(desc)) errors.push(`${rel}: dubbele description met ${descs.get(desc)}`); else descs.set(desc, rel);
  }
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) { try { JSON.parse(m[1]); } catch { errors.push(`${rel}: ongeldige JSON-LD`); } }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) {
    for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (u.startsWith('/') && !existsSync(join(dist, u))) errors.push(`${rel}: ontbrekende srcset ${u}`); }
  }
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const u = m[1];
    const target = join(dist, u);
    const ok = existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
    if (!ok) errors.push(`${rel}: dode link ${u}`);
  }
  for (const m of html.matchAll(/<img (?![^>]*alt=)[^>]*>/g)) errors.push(`${rel}: img zonder alt ${m[0].slice(0, 60)}`);
  for (const m of html.matchAll(/<input [^>]*id="([^"]+)"/g)) {
    const id = m[1]; if (!html.includes(`for="${id}"`) && !/type="(hidden|checkbox|radio)"/.test(m[0])) errors.push(`${rel}: input #${id} zonder label`);
  }
}
const unique = [...new Set(errors)];
console.log(`${pages.length} pagina's gecontroleerd, ${unique.length} problemen`);
unique.slice(0, 80).forEach((e) => console.log(' - ' + e));
process.exit(unique.length ? 1 : 0);
