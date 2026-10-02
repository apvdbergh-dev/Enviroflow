// Gedeelde catalogus-logica voor build én server (één bron van waarheid voor prijzen).
import { readFileSync } from 'node:fs';

const read = (rel) => JSON.parse(readFileSync(new URL(`../data/${rel}`, import.meta.url), 'utf8'));

export function loadCatalog() {
  const site = read('site.json');
  const brands = read('brands.json');
  const { groups, categories } = read('categories.json');
  const products = read('products.json');

  const activeGroups = groups.filter((g) => g.active);
  const activeCategories = categories.filter((c) => c.active && activeGroups.some((g) => g.id === c.group));
  const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));
  const activeProducts = products.filter((p) => categoryById[p.category]?.active);

  return { site, brands, groups: activeGroups, categories: activeCategories, products: activeProducts, groupById, categoryById, brandById };
}

/** Een numerieke prijs is ingevuld (bestelbaar en afrekenbaar). */
export const hasRealPrice = (p) => typeof p.price === 'number' && Number.isFinite(p.price) && p.price > 0;
/** Prijs is nog een placeholder zoals "[PRIJS]": bestelknoppen tonen, afrekenen geblokkeerd. */
export const hasPlaceholderPrice = (p) => typeof p.price === 'string' && p.price.trim() !== '';
/** Online bestelbaar volgens de webshopregels. */
export const isOrderable = (p) => !p.quoteOnly && (hasRealPrice(p) || hasPlaceholderPrice(p));

export const groupUrl = (g) => `/producten/${g.slug}/`;
export const categoryUrl = (c, groupById) => `/producten/${groupById[c.group].slug}/${c.slug}/`;
export const productUrl = (p, categoryById, groupById) => `${categoryUrl(categoryById[p.category], groupById)}${p.slug}/`;
