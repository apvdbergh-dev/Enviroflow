// Cloudflare Pages Function: alle /api/*-verzoeken. Opslag in Workers KV (binding EF_DATA).
// Instellingen staan als omgevingsvariabelen in het Cloudflare-dashboard; zie README.
import { createApi, configFromEnv } from '../../src/lib/api.mjs';
import { buildCatalog } from '../../src/lib/catalog-core.mjs';
import site from '../../src/data/site.json';
import brands from '../../src/data/brands.json';
import categories from '../../src/data/categories.json';
import products from '../../src/data/products.json';

const catalog = buildCatalog({ site, brands, categories, products });
const YEAR = 365 * 24 * 3600;

const kvStore = (kv) => ({
  getJSON: (key) => kv.get(key, 'json'),
  putJSON: (key, value) => kv.put(key, JSON.stringify(value)),
  // Bijlagen worden ook gemaild; de kopie in KV verloopt na een jaar.
  putFile: (key, data) => kv.put(key, data, { expirationTtl: YEAR })
});

export async function onRequest(context) {
  const { request, env } = context;
  if (!env.EF_DATA) return Response.json({ error: 'Opslag is niet gekoppeld (KV-binding EF_DATA ontbreekt).' }, { status: 500 });
  const api = createApi({ catalog, store: kvStore(env.EF_DATA), config: configFromEnv(env) });
  return api(request, { waitUntil: (p) => context.waitUntil(p) });
}
