// Vertaling van gegevens en content (producten, categorieën, oplossingen, …) via een vertaaltabel.
// Elke Nederlandse tekst heeft een korte sleutel (hash); src/i18n/en-data.json bevat per sleutel { nl, en }.
// Ontbreekt een vertaling, dan stopt de build met een duidelijke lijst (er komt nooit Nederlands op de Engelse site).

/** Velden met technische waarden (id's, links, bestanden) die niet vertaald worden. */
const SKIP_KEYS = new Set(['id', 'slug', 'category', 'brand', 'src', 'href', 'source', 'related', 'group', 'imageSrc', 'url', 'sku', 'logo', 'logoDark', 'website', 'icon', 'tel', 'email', 'baseUrl', 'width', 'height', 'key', 'currency', 'defaultLocale', 'locales', 'vatNumber', 'kvk', 'postalCode', 'street', 'city', 'country', 'line', 'display']);
/** Velden die soms een lijst met id's zijn (overslaan) en soms echte inhoud (vertalen). */
const ID_LIST_KEYS = new Set(['categories', 'products', 'solutions', 'sectors', 'articles', 'riskCategories']);
const skip = (k, v) => SKIP_KEYS.has(k) || k.startsWith('_') || (ID_LIST_KEYS.has(k) && Array.isArray(v) && v.every((x) => typeof x === 'string'));

// Eenvoudige, overal werkende hash (FNV-1a, twee varianten): ook op Cloudflare, zonder Node-modules.
function fnv1a(str, seed) {
  let h = seed >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}
export const textId = (s) => fnv1a(s, 0x811c9dc5) + fnv1a(s, 0x9e3779b9).slice(0, 4);

/** Moet deze tekst vertaald worden? (Getallen, maten en merknamen zonder letters niet.) */
const needsTranslation = (s) => /[A-Za-zÀ-ÿ]{2,}/.test(s) || /\d,\d|\d\.\d{3}\b|\bl × b\b/.test(s); // ook Nederlandse getallen (2,16 en 1.149) en maten

/** Geeft alle te vertalen teksten (met vindplaats) uit een object. */
export function collectTexts(obj, where = '', out = new Map()) {
  if (typeof obj === 'string') {
    if (needsTranslation(obj) && !out.has(obj)) out.set(obj, where);
  } else if (Array.isArray(obj)) obj.forEach((v, i) => collectTexts(v, `${where}[${i}]`, out));
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) if (!skip(k, v)) collectTexts(v, where ? `${where}.${k}` : k, out);
  }
  return out;
}

/** Vertaalt alle tekstwaarden in een object (diepe kopie). Ontbrekende teksten komen in `missing`. */
export function translateDeep(obj, table, missing, key = '') {
  if (typeof obj === 'string') {
    if (!needsTranslation(obj)) return obj;
    const entry = table[textId(obj)];
    if (entry && entry.nl === obj && typeof entry.en === 'string' && entry.en.trim()) return entry.en;
    missing.set(textId(obj), obj);
    return obj;
  }
  if (Array.isArray(obj)) return obj.map((v) => translateDeep(v, table, missing, key));
  if (obj && typeof obj === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(obj)) out[k] = skip(k, v) ? v : translateDeep(v, table, missing, k);
    return out;
  }
  return obj;
}
