// Catalogus-logica zonder bestandstoegang, zodat build, Node-server én Cloudflare dezelfde regels gebruiken.

export function buildCatalog({ site, brands, categories: { groups, categories }, products }) {
  const activeGroups = groups.filter((g) => g.active);
  const activeCategories = categories.filter((c) => c.active && activeGroups.some((g) => g.id === c.group));
  const groupById = Object.fromEntries(groups.map((g) => [g.id, g]));
  const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]));
  const brandById = Object.fromEntries(brands.map((b) => [b.id, b]));
  // Verkoopprijs = EXFLO-prijs (products.json) plus de opslag uit site.json, afgerond op hele euro's.
  // Overal (website, winkelwagen, afrekenen, Mollie) wordt deze verkoopprijs gebruikt.
  const markup = typeof site.priceMarkup === 'number' ? site.priceMarkup : 0;
  const withSalePrice = (p) => (typeof p.price === 'number' && Number.isFinite(p.price) && p.price > 0
    ? { ...p, basePrice: p.price, price: Math.round(p.price * (1 + markup)) }
    : p);
  const activeProducts = products.filter((p) => categoryById[p.category]?.active).map(withSalePrice);

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
