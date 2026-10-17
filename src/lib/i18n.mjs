// Taal van de pagina die nu wordt opgebouwd (nl of en). De build rendert eerst alle Nederlandse
// pagina's en daarna alle Engelse; templates vragen de huidige taal op via T() en isEn().

let current = 'nl';

export const LANGS = ['nl', 'en'];
export const setLang = (lang) => { current = lang === 'en' ? 'en' : 'nl'; };
export const getLang = () => current;
export const isEn = () => current === 'en';

/** Kiest de tekst voor de huidige taal: T('Nederlands', 'English'). */
export const T = (nl, en) => (current === 'en' ? en : nl);

/** Intl-locale voor bedragen en datums. */
export const numberLocale = () => (current === 'en' ? 'en-IE' : 'nl-NL');

/** Interne link in de huidige taal: '/contact/' → '/en/contact/'. Assets en API blijven gelijk. */
export function localPath(path, lang = current) {
  if (lang !== 'en' || typeof path !== 'string' || !path.startsWith('/') || path.startsWith('//')) return path;
  if (/^\/(assets|api|en)(\/|$)/.test(path) || path === '/version.txt') return path;
  return '/en' + path;
}

/** Zet alle interne links in een Engelse pagina om naar /en/… (a, form, area). Links met data-keep-href blijven staan. */
export function localizeHtml(html) {
  return html.replace(/<(a|form|area)\b[^>]*>/gi, (tag) => {
    if (/\sdata-keep-href\b/i.test(tag)) return tag;
    return tag.replace(/\s(href|action)="([^"]*)"/gi, (m, attr, url) => ` ${attr}="${localPath(url, 'en')}"`);
  });
}
