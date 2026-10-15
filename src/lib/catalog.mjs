// Gedeelde catalogus-logica voor build én server (één bron van waarheid voor prijzen).
import { readFileSync } from 'node:fs';
import { buildCatalog } from './catalog-core.mjs';

export * from './catalog-core.mjs';

const read = (rel) => JSON.parse(readFileSync(new URL(`../data/${rel}`, import.meta.url), 'utf8'));

export function loadCatalog() {
  return buildCatalog({ site: read('site.json'), brands: read('brands.json'), categories: read('categories.json'), products: read('products.json') });
}
