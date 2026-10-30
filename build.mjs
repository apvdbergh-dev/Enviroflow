// Statische sitegenerator voor EnviroFlow. Gebruik: node build.mjs  (output in ./dist)
import { mkdirSync, writeFileSync, rmSync, cpSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalog, isOrderable, hasRealPrice, groupUrl, categoryUrl, productUrl } from './src/lib/catalog.mjs';
import { setLang, localizeHtml, localPath, LANGS } from './src/lib/i18n.mjs';
import { translateDeep } from './src/lib/i18n-data.mjs';
import { layout } from './src/templates/ui.mjs';
import * as shop from './src/templates/pages-shop.mjs';
import * as content from './src/templates/pages-content.mjs';
import { legalPages, LEGAL_CHOICES } from './src/content/nl/legal.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, 'dist');
const readJson = (f) => JSON.parse(readFileSync(join(root, f), 'utf8'));
const raw = { site: readJson('src/data/site.json'), brands: readJson('src/data/brands.json'), categories: readJson('src/data/categories.json'), products: readJson('src/data/products.json') };
const rawContent = {
  solutions: (await import('./src/content/nl/solutions.mjs')).default,
  sectors: (await import('./src/content/nl/sectors.mjs')).default,
  articles: (await import('./src/content/nl/articles.mjs')).default,
  guides: (await import('./src/content/nl/guides.mjs')).default
};
// Kennisbankartikelen zijn lange teksten: de Engelse versie staat als eigen bestand (zelfde slugs).
const articlesEn = (await import('./src/content/en/articles.mjs')).default;
const guidesEn = (await import('./src/content/en/guides.mjs')).default;
const enTable = existsSync(join(root, 'src/i18n/en-data.json')) ? readJson('src/i18n/en-data.json') : {};
const version = Date.now().toString(36);
// De stylesheet gaat direct in elke pagina (geen apart verzoek dat de eerste weergave tegenhoudt).
// Paden worden absoluut, commentaar en overbodige witruimte gaan eruit.
const inlineCss = readFileSync(join(root, 'src/assets/css/main.css'), 'utf8')
  .replace(/url\("\.\.\//g, 'url("/assets/')
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s+/g, ' ')
  .replace(/\s*([{};])\s*/g, '$1')
  .trim();

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });
mkdirSync(join(dist, 'assets/data'), { recursive: true });

const sitemap = [];
let siteForRobots;

for (const lang of LANGS) {
  setLang(lang);
  const missing = new Map();
  const tr = (o) => (lang === 'en' ? translateDeep(o, enTable, missing) : o);
  const catalog = buildCatalog({ site: tr(raw.site), brands: tr(raw.brands), categories: tr(raw.categories), products: tr(raw.products) });
  const solutions = tr(rawContent.solutions), sectors = tr(rawContent.sectors), articles = lang === 'en' ? articlesEn : rawContent.articles;
  const guides = lang === 'en' ? guidesEn : rawContent.guides;
  if (missing.size && process.env.I18N_ALLOW_MISSING === '1') {
    console.warn(`(ontwikkelmodus) ${missing.size} vertaling(en) ontbreken nog`);
  } else if (missing.size) {
    console.error(`\nVERTALING ONTBREEKT voor ${missing.size} tekst(en). Vul ze aan met scripts/i18n-texts.mjs:\n` + [...missing].slice(0, 20).map(([id, nl]) => `  ${id}  ${nl.slice(0, 90)}`).join('\n'));
    process.exit(1);
  }
  const t = readJson(`src/i18n/${lang}.json`);
  const { groupById, categoryById } = catalog;
  const ctx = {
    ...catalog, t, solutions, sectors, articles, lang, version, inlineCss,
    urls: {
      group: (g) => groupUrl(g),
      category: (c) => categoryUrl(c, groupById),
      product: (p) => productUrl(p, categoryById, groupById)
    }
  };
  const out = lang === 'en' ? join(dist, 'en') : dist;
  if (lang === 'nl') siteForRobots = catalog.site;

  const emit = (page) => {
    // Pagina-paden blijven Nederlands in de templates; voor Engels komt er /en voor en worden links omgezet.
    const localized = { ...page, path: localPath(page.path), altPath: page.path };
    let html = layout(ctx, localized);
    if (lang === 'en') html = localizeHtml(html);
    const file = page.file ? join(out, page.file) : join(out, page.path, 'index.html');
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html);
    if (!page.noindex) sitemap.push({ path: localized.path, alt: page.path });
  };

  // Shop & kernpagina's
  emit(shop.home(ctx));
  emit(shop.productsOverview(ctx));
  ctx.groups.forEach((g) => emit(shop.groupPage(g, ctx)));
  ctx.categories.forEach((c) => emit(shop.categoryPage(c, ctx)));
  ctx.products.forEach((p) => emit(shop.productPage(p, ctx)));
  emit(shop.cartPage(ctx));
  emit(shop.checkoutPage(ctx));
  emit(shop.orderStatusPage(ctx));
  emit(shop.quotePage(ctx));
  emit(shop.customPage(ctx));
  emit(shop.thanksPage(ctx));
  emit(shop.keuzehulpPage(ctx));

  // Content
  emit(content.solutionsOverview(ctx));
  solutions.forEach((s) => emit(content.solutionPage(s, ctx)));
  emit(content.sectorsOverview(ctx));
  sectors.forEach((s) => emit(content.sectorPage(s, ctx)));
  emit(content.projectsPage(ctx));
  // Sjabloon voor projectpagina's: pas publiceren zodra er een echt project is.
  // emit(content.projectTemplatePage(ctx));
  emit(content.knowledgeOverview(ctx));
  articles.forEach((a) => emit(content.articlePage(a, ctx)));
  guides.forEach((g) => emit(content.articlePage(g, ctx)));
  emit(content.aboutPage(ctx));
  emit(content.partnersPage(ctx));
  ctx.brands.filter((b) => b.active).forEach((b) => emit(content.brandPage(b, ctx)));
  emit(content.contactPage(ctx));
  emit(content.searchPage(ctx));
  emit(content.notFoundPage(ctx));
  const legal = legalPages(catalog.site);
  legal.pages.forEach((l) => emit(content.legalPage({ ...l, draft: LEGAL_CHOICES.draft })));

  // Catalogus voor winkelwagen (prijzen worden server-side opnieuw gecontroleerd) en zoekindex, per taal.
  const suffix = lang === 'en' ? '.en' : '';
  const cartCatalog = Object.fromEntries(catalog.products.filter(isOrderable).map((p) => [p.id, {
    name: p.name, url: localPath(ctx.urls.product(p)), price: hasRealPrice(p) ? p.price : null, pricePlaceholder: hasRealPrice(p) ? null : p.price, image: p.images?.[0] || null
  }]));
  writeFileSync(join(dist, `assets/data/catalog${suffix}.json`), JSON.stringify(cartCatalog));
  const K = lang === 'en' ? { product: 'Product', category: 'Category', solution: 'Solution', sector: 'Sector', knowledge: 'Knowledge base' } : { product: 'Product', category: 'Categorie', solution: 'Oplossing', sector: 'Sector', knowledge: 'Kennisbank' };
  const searchIndex = [
    ...catalog.products.map((p) => ({ t: p.name, u: localPath(ctx.urls.product(p)), d: p.short, k: K.product, x: [p.line, categoryById[p.category].name, ...(p.attributes?.application || [])].filter(Boolean).join(' ') })),
    ...catalog.categories.map((c) => ({ t: c.name, u: localPath(ctx.urls.category(c)), d: c.short, k: K.category, x: (c.applications || []).join(' ') + ' ' + (c.seoTitle || '') })),
    ...solutions.map((s) => ({ t: s.title, u: localPath(`/oplossingen/${s.slug}/`), d: s.seoDescription, k: K.solution, x: s.tile })),
    ...sectors.map((s) => ({ t: s.name, u: localPath(`/sectoren/${s.slug}/`), d: s.intro, k: K.sector, x: s.liquids.join(' ') })),
    ...articles.map((a) => ({ t: a.title, u: localPath(`/kennisbank/${a.slug}/`), d: a.description, k: K.knowledge, x: '' })),
    ...guides.map((a) => ({ t: a.title, u: localPath(a.path), d: a.description, k: K.knowledge, x: '' }))
  ];
  writeFileSync(join(dist, `assets/data/search-index${suffix}.json`), JSON.stringify(searchIndex));

  // llms.txt: beknopt overzicht van het bedrijf en het aanbod voor AI-assistenten (ChatGPT, Perplexity, Gemini).
  if (lang === 'nl') {
    const S = catalog.site, B = S.baseUrl;
    const eur = (n) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);
    const line = (p) => `- [${p.name}](${B}${ctx.urls.product(p)}): ${p.short}${hasRealPrice(p) && !p.quoteOnly ? ` Prijs ${eur(p.price)} excl. btw.` : ' Prijs op aanvraag.'}`;
    const cats = catalog.categories.filter((c) => !c.isCustom).map((c) => {
      const list = catalog.products.filter((p) => p.category === c.id);
      return list.length ? `### [${c.name}](${B}${ctx.urls.category(c)})\n${c.short}\n\n${list.map(line).join('\n')}` : '';
    }).filter(Boolean);
    writeFileSync(join(dist, 'llms.txt'), `# EnviroFlow

> EnviroFlow is een Nederlands bedrijf (Rockanje, Zuid-Holland) dat flexibele lekbakken en opvangbakken levert voor IBC's, vaten, aggregaten en voertuigen, plus wasmatten, decontaminatiematten en flexibele tanks voor water, brandstof en mest. Zakelijke klanten bestellen standaardmaten direct online (prijzen excl. btw); maatwerk en advies op aanvraag.

- Adres: ${S.address.street}, ${S.address.postalCode} ${S.address.city}, Nederland
- KvK: ${S.kvk} · Btw: ${S.vatNumber}
- Telefoon: ${S.phonePrimary.display} · E-mail: ${S.email}
- Website: ${B}/ (Nederlands) en ${B}/en/ (Engels)

## Producten

${cats.join('\n\n')}

## Kennisbank

${[...articles, ...guides].map((a) => `- [${a.title}](${B}${a.path || `/kennisbank/${a.slug}/`}): ${a.description}`).join('\n')}

## Meer informatie

- [Waarom flexibel? Flexibele, stalen en kunststof lekbakken vergeleken](${B}/waarom-flexibel/)
- [Offerte of advies aanvragen](${B}/offerte-aanvragen/)
- [Maatwerk aanvragen](${B}/maatwerk-aanvragen/)
- [Levering en verzending](${B}/levering-en-verzending/)
- [Retourneren](${B}/retourneren/)
- [Over EnviroFlow](${B}/over-ons/)
- [Contact](${B}/contact/)
`);
  }
}
setLang('nl');

// Sitemap & robots
const today = new Date().toISOString().slice(0, 10);
const base = siteForRobots.baseUrl;
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.map((p) => `  <url><loc>${base}${p.path}</loc><lastmod>${today}</lastmod><xhtml:link rel="alternate" hreflang="nl" href="${base}${p.alt}"/><xhtml:link rel="alternate" hreflang="en" href="${base}${localPath(p.alt, 'en')}"/></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *
Disallow: /api/
Disallow: /winkelwagen/
Disallow: /afrekenen/
Disallow: /bestelling/
Disallow: /zoeken/
Disallow: /en/winkelwagen/
Disallow: /en/afrekenen/
Disallow: /en/bestelling/
Disallow: /en/zoeken/

Sitemap: ${base}/sitemap.xml
`);

// IndexNow-sleutel (Bing, DuckDuckGo, Ecosia): bewijst dat wij eigenaar zijn wanneer we nieuwe pagina's aanmelden.
export const INDEXNOW_KEY = 'd77f590aab0f64846ad9e0ad2b88de5b';
writeFileSync(join(dist, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

// Versie van deze build (Cloudflare geeft de commit mee), zodat te controleren is wat er live staat.
writeFileSync(join(dist, 'version.txt'), `${process.env.CF_PAGES_COMMIT_SHA || 'lokaal'} ${new Date().toISOString()}\n`);

// Beveiligings- en cacheheaders voor Cloudflare Pages (zelfde regels als server.mjs).
// Oude adressen die nog ergens gelinkt kunnen zijn (Cloudflare Pages leest _redirects).
writeFileSync(join(dist, '_redirects'), `/assets/datasheets/exflo-opvangbak-chemische-bestendigheid.pdf /assets/datasheets/opvangbak-chemische-bestendigheid.pdf 301
`);
writeFileSync(join(dist, '_headers'), `/*
  X-Content-Type-Options: nosniff
  Strict-Transport-Security: max-age=31536000
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; form-action 'self' https://www.mollie.com; frame-src https://www.youtube-nocookie.com; frame-ancestors 'self'; base-uri 'self'
/assets/css/*
  Cache-Control: public, max-age=31536000, immutable
/assets/js/*
  Cache-Control: public, max-age=31536000, immutable
/assets/img/*
  Cache-Control: public, max-age=31536000, immutable
/assets/fonts/*
  Cache-Control: public, max-age=31536000, immutable
`);

console.log(`Build gereed: ${sitemap.length} indexeerbare pagina's (NL + EN) → dist/`);
