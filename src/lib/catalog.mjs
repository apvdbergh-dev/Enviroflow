// Gedeelde catalogus-logica voor build én server (één bron van waarheid voor prijzen).
import { readFileSync, existsSync } from 'node:fs';
import { buildCatalog } from './catalog-core.mjs';
import { translateDeep } from './i18n-data.mjs';

export * from './catalog-core.mjs';

const read = (rel) => JSON.parse(readFileSync(new URL(`../data/${rel}`, import.meta.url), 'utf8'));

/** Catalogus in het Nederlands of (met de vertaaltabel) in het Engels. */
export function loadCatalog(lang = 'nl') {
  const raw = { site: read('site.json'), brands: read('brands.json'), categories: read('categories.json'), products: read('products.json') };
  if (lang === 'en') {
    const tablePath = new URL('../i18n/en-data.json', import.meta.url);
    const table = existsSync(tablePath) ? JSON.parse(readFileSync(tablePath, 'utf8')) : {};
    const missing = new Map();
    for (const k of Object.keys(raw)) raw[k] = translateDeep(raw[k], table, missing);
  }
  return buildCatalog(raw);
}
