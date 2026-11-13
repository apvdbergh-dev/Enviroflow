// Meldt alle pagina's uit de live sitemap aan bij IndexNow (Bing, DuckDuckGo, Ecosia, Yandex).
// Gebruik na een grote wijziging: node scripts/indexnow.mjs
import { readFileSync } from 'node:fs';
const key = /INDEXNOW_KEY = '([a-f0-9]+)'/.exec(readFileSync(new URL('../build.mjs', import.meta.url), 'utf8'))[1];
const host = 'www.enviroflow.nl';
const sitemap = await (await fetch(`https://${host}/sitemap.xml`)).text();
// Extra adressen (bijvoorbeeld oude adressen die nu doorverwijzen) kunnen als argument worden meegegeven:
//   node scripts/indexnow.mjs /oud/adres/ /nog/een/oud/adres/
const fromSitemap = [...sitemap.matchAll(/https:\/\/www\.enviroflow\.nl[^"<]*/g)].map((m) => m[0]);
const extra = process.argv.slice(2).map((u) => (u.startsWith('http') ? u : `https://${host}${u}`));
const urls = [...new Set([...fromSitemap, ...extra])];
const r = await fetch('https://api.indexnow.org/indexnow', { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body: JSON.stringify({ host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls }) });
console.log(`${urls.length} URL's aangemeld bij IndexNow: ${r.status} ${await r.text()}`);
