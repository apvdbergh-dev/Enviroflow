// Maakt van ./dist een statische preview zonder server (./dist-preview):
// relatieve links, alleen WebP-productfoto's en formulieren die niets versturen.
// Gebruik: node build.mjs && node scripts/build-preview.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync, statSync, copyFileSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'dist');
const out = join(root, 'dist-preview');
rmSync(out, { recursive: true, force: true });

const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : files.push(p); } })(src);

const SHIM = (base) => `<script>
window.EF_BASE=${JSON.stringify(base)};
(function(){var B=window.EF_BASE;
function rel(u){var q='',i=u.search(/[?#]/);if(i>-1){q=u.slice(i);u=u.slice(0,i);}if(u==='/')return B+'home.html'+q;u=u.replace(/^\\//,'');if(u===''||/\\/$/.test(u))u+='index.html';return B+u+q;}
window.EF_REL=rel;var f=window.fetch;window.fetch=function(u,o){if(typeof u==='string'&&u.charAt(0)==='/'&&u.indexOf('/api/')!==0)u=rel(u);return f.call(this,u,o);};
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.getAttribute('href');if(h&&h.charAt(0)==='/'&&h.charAt(1)!=='/'){e.preventDefault();location.href=rel(h);}},true);
document.addEventListener('submit',function(e){var fm=e.target,act=fm.getAttribute('action')||'';if(act.indexOf('/api/')===0||fm.hasAttribute('data-checkout-form')){e.preventDefault();e.stopImmediatePropagation();var s=fm.querySelector('.form-status');var msg='Conceptversie: formulieren en bestellingen worden nog niet verzonden. Neem voorlopig contact op via 06 19 13 32 52 of Info@enviroflow.nl.';if(s){s.hidden=false;s.className='form-status err';s.textContent=msg;}}},true);
})();</script>
<div style="background:#FFF4D6;color:#5C3D00;font:600 13px/1.4 Inter,system-ui,sans-serif;padding:6px 16px;text-align:center">Conceptversie (preview). Prijzen, teksten en beelden zijn nog niet definitief. Bestellen en formulieren werken nog niet.</div>`;

const relPath = (fromFile, absUrl) => {
  let q = '';
  const i = absUrl.search(/[?#]/);
  if (i > -1) { q = absUrl.slice(i); absUrl = absUrl.slice(0, i); }
  let target = absUrl === '/' ? 'home.html' : absUrl.replace(/^\//, '');
  if (target === '' || target.endsWith('/')) target += 'index.html';
  target = target.replace(/^(assets\/img\/producten\/.+)\.jpg$/, '$1.webp');
  let r = relative(dirname(fromFile), join(out, target)).split('\\').join('/');
  return (r || 'index.html') + q;
};

let count = 0;
for (const f of files) {
  const relName = relative(src, f);
  if (relName.startsWith('assets/img/producten/') && relName.endsWith('.jpg')) continue;
  let dest = join(out, relName === 'index.html' ? 'home.html' : relName);
  mkdirSync(dirname(dest), { recursive: true });
  if (!f.endsWith('.html')) { copyFileSync(f, dest); count++; continue; }
  let html = readFileSync(f, 'utf8');
  html = html.replace(/(href|src|action)="(\/(?!\/|api\/)[^"]*)"/g, (m, a, u) => `${a}="${relPath(dest, u)}"`);
  html = html.replace(/srcset="([^"]+)"/g, (m, v) => `srcset="${v.split(',').map((part) => { const [u, d] = part.trim().split(/\s+/); return (u.startsWith('/') ? relPath(dest, u) : u) + (d ? ' ' + d : ''); }).join(', ')}"`);
  const base = relative(dirname(dest), out).split('\\').join('/');
  html = html.replace(/<body([^>]*)>/, (m) => m + SHIM(base ? base + '/' : ''));
  writeFileSync(dest, html); count++;
}

// Startpagina voor de Artifact: zonder eigen doctype/html/head/body (wordt door de host omhuld).
const home = readFileSync(join(out, 'home.html'), 'utf8');
const head = home.match(/<head>([\s\S]*?)<\/head>/)[1].replace(/<meta charset[^>]*>|<meta name="viewport"[^>]*>/g, '');
const body = home.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];
writeFileSync(join(out, 'index.html'), head.trim().replace(/<title>[^<]*<\/title>/, '<title>EnviroFlow concept</title>') + '\n' + body.trim() + '\n');
console.log(`Preview gereed: ${count + 1} bestanden → dist-preview/`);
