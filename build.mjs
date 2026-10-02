// Statische sitegenerator voor EnviroFlow. Gebruik: node build.mjs  (output in ./dist)
import { mkdirSync, writeFileSync, rmSync, cpSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalog, isOrderable, hasRealPrice, groupUrl, categoryUrl, productUrl } from './src/lib/catalog.mjs';
import { layout } from './src/templates/ui.mjs';
import * as shop from './src/templates/pages-shop.mjs';
import * as content from './src/templates/pages-content.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const locale = 'nl';
const dist = join(root, 'dist');

const catalog = loadCatalog();
const t = JSON.parse(readFileSync(join(root, `src/i18n/${locale}.json`), 'utf8'));
const solutions = (await import(`./src/content/${locale}/solutions.mjs`)).default;
const sectors = (await import(`./src/content/${locale}/sectors.mjs`)).default;
const articles = (await import(`./src/content/${locale}/articles.mjs`)).default;

const { groupById, categoryById } = catalog;
const ctx = {
  ...catalog, t, solutions, sectors, articles,
  version: Date.now().toString(36),
  urls: {
    group: (g) => groupUrl(g),
    category: (c) => categoryUrl(c, groupById),
    product: (p) => productUrl(p, categoryById, groupById)
  }
};

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const sitemap = [];
function emit(page) {
  const html = layout(ctx, page);
  const file = page.file ? join(dist, page.file) : join(dist, page.path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (!page.noindex) sitemap.push(page.path);
}

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
emit(content.projectTemplatePage(ctx));
emit(content.knowledgeOverview(ctx));
articles.forEach((a) => emit(content.articlePage(a, ctx)));
emit(content.aboutPage(ctx));
emit(content.partnersPage(ctx));
ctx.brands.filter((b) => b.active).forEach((b) => emit(content.brandPage(b, ctx)));
emit(content.contactPage(ctx));
emit(content.searchPage(ctx));
emit(content.notFoundPage(ctx));
[
  { slug: 'levering-en-verzending', title: 'Levering & verzending', extra: `<p>Verzendkosten: ${catalog.site.shipping.flatRate != null ? `€ ${catalog.site.shipping.flatRate} excl. btw` : '<mark class="placeholder">[IN TE VULLEN]</mark> of berekend na bestelling'}. Levertijd: op aanvraag, tenzij bij het product vermeld.</p>` },
  { slug: 'retourneren', title: 'Retourneren' },
  { slug: 'algemene-voorwaarden', title: 'Algemene voorwaarden' },
  { slug: 'privacybeleid', title: 'Privacybeleid' },
  { slug: 'cookiebeleid', title: 'Cookiebeleid', extra: '<p>Deze website gebruikt standaard alleen functionele opslag (winkelwagen, prijsweergave en uw cookiekeuze). Analytische of marketingcookies worden alleen geplaatst na uw toestemming.</p>' }
].forEach((l) => emit(content.legalPage(l)));

// Assets
cpSync(join(root, 'src/assets'), join(dist, 'assets'), { recursive: true });
mkdirSync(join(dist, 'assets/data'), { recursive: true });

// Catalogus voor winkelwagen (prijzen worden server-side opnieuw gecontroleerd)
const cartCatalog = Object.fromEntries(catalog.products.filter(isOrderable).map((p) => [p.id, {
  name: p.name, url: ctx.urls.product(p), price: hasRealPrice(p) ? p.price : null, pricePlaceholder: hasRealPrice(p) ? null : p.price, image: p.images?.[0] || null
}]));
writeFileSync(join(dist, 'assets/data/catalog.json'), JSON.stringify(cartCatalog));

// Zoekindex
const searchIndex = [
  ...catalog.products.map((p) => ({ t: p.name, u: ctx.urls.product(p), d: p.short, k: 'Product', x: [p.line, categoryById[p.category].name, ...(p.attributes?.application || [])].filter(Boolean).join(' ') })),
  ...catalog.categories.map((c) => ({ t: c.name, u: ctx.urls.category(c), d: c.short, k: 'Categorie', x: (c.applications || []).join(' ') + ' ' + (c.seoTitle || '') })),
  ...solutions.map((s) => ({ t: s.title, u: `/oplossingen/${s.slug}/`, d: s.seoDescription, k: 'Oplossing', x: s.tile })),
  ...sectors.map((s) => ({ t: s.name, u: `/sectoren/${s.slug}/`, d: s.intro, k: 'Sector', x: s.liquids.join(' ') })),
  ...articles.map((a) => ({ t: a.title, u: `/kennisbank/${a.slug}/`, d: a.description, k: 'Kennisbank', x: '' }))
];
writeFileSync(join(dist, 'assets/data/search-index.json'), JSON.stringify(searchIndex));

// Sitemap & robots
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((p) => `  <url><loc>${catalog.site.baseUrl}${p}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *
Disallow: /api/
Disallow: /winkelwagen/
Disallow: /afrekenen/
Disallow: /bestelling/
Disallow: /zoeken/

Sitemap: ${catalog.site.baseUrl}/sitemap.xml
`);

console.log(`Build gereed: ${sitemap.length} indexeerbare pagina's → dist/`);
