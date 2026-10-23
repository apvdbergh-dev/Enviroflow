// Herbruikbare HTML-bouwstenen en de paginalayout.
import { hasRealPrice, hasPlaceholderPrice, isOrderable } from '../lib/catalog.mjs';
import { T, isEn, getLang, numberLocale, localPath } from '../lib/i18n.mjs';

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Toont placeholders als [ZO] herkenbaar gemarkeerd. */
export const ph = (s = '') => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="placeholder">[$1]</mark>');

export const fmtEUR = (n) => new Intl.NumberFormat(numberLocale(), { style: 'currency', currency: 'EUR' }).format(n);

const ICONS = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  play: '<path d="M7 4.5v15l12.5-7.5z"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  drop: '<path d="M12 2.7s-6 6.6-6 11.3a6 6 0 0 0 12 0c0-4.7-6-11.3-6-11.3z"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>',
  tray: '<path d="M3 13h4l2 3h6l2-3h4"/><path d="M3 13v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/><path d="M6 13V5h12v8"/>',
  tank: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  wave: '<path d="M2 9c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/><path d="M2 15c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
  grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  ruler: '<path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"/><path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
  clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
  compass: '<circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3z"/>',
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>'
};

export const icon = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
const iconSprite = () => `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${Object.entries(ICONS)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join('')}</svg>`;

/** Golflijn uit het logo als sectiescheiding. */
export const wave = (cls = '') => `<div class="wave ${cls}" aria-hidden="true"><svg viewBox="0 0 1440 48" preserveAspectRatio="none"><defs><linearGradient id="wg${cls.replace(/\W/g, '')}" x1="0" x2="1"><stop offset="0" stop-color="#2BA84A"/><stop offset=".55" stop-color="#12A18F"/><stop offset="1" stop-color="#1E9BE0"/></linearGradient></defs><path d="M0 30 C 240 4, 420 46, 720 26 S 1200 8, 1440 22" fill="none" stroke="url(#wg${cls.replace(/\W/g, '')})" stroke-width="3"/></svg></div>`;

/** Logo voor donkere achtergrond (vectorbenadering van het woordmerk). */
export const logoDark = () => `<img class="logo-dark" src="/assets/img/enviroflow-logo-wit-400.webp" width="400" height="42" alt="EnviroFlow" loading="lazy">`;

/** Afbeelding of beschrijvende placeholder. img = { src, alt, width, height } */
/** `sizes` voor foto's in kaarten van een raster (smal op desktop, bijna schermbreed op een telefoon). */
export const CARD_SIZES = '(max-width: 640px) 92vw, (max-width: 1000px) 45vw, 300px';

export function media(img, ratio = '4-3', eager = false, sizes = '(max-width: 700px) 100vw, 600px') {
  if (img && img.src) {
    const base = img.src.replace(/\.(jpe?g|png|webp)$/i, '');
    // Productfoto's hebben ook versies van 400 en 800 px breed (voor kaarten en telefoons).
    const srcset = base.startsWith('/assets/img/producten/') ? `${esc(base)}-400.webp 400w, ${esc(base)}-800.webp 800w, ${esc(base)}.webp 1200w" sizes="${sizes}` : `${esc(base)}.webp`;
    return `<picture class="media r-${ratio}"><source type="image/webp" srcset="${srcset}"><img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width || 800}" height="${img.height || 600}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
  }
  const alt = img?.alt || T('Afbeelding volgt', 'Image to follow');
  const label = alt.replace(/^(Foto|Illustratie bij|Photo|Illustration):\s*/i, '');
  return `<div class="media media--ph r-${ratio}" role="img" aria-label="${esc(label)}"><span>${icon('grid')}${esc(label)}</span></div>`;
}

export function priceBlock(p, t, size = '') {
  if (hasRealPrice(p) && !p.quoteOnly) {
    return `<div class="price ${size}"><span class="price__amount" data-price-excl="${p.price}">${fmtEUR(p.price)}</span> <span class="price__vat" data-vat-label>${t.pricesExcl}</span></div>`;
  }
  if (hasPlaceholderPrice(p) && !p.quoteOnly) {
    return `<div class="price ${size}"><span class="price__amount">€ <mark class="placeholder">${esc(p.price)}</mark></span> <span class="price__vat" data-vat-label>${t.pricesExcl}</span></div>`;
  }
  return `<div class="price price--request ${size}">${t.priceOnRequest}</div>`;
}

export function breadcrumbs(items) {
  if (!items?.length) return '';
  return `<nav class="breadcrumbs container" aria-label="${T('Kruimelpad', 'Breadcrumb')}"><ol>${items.map((b, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(b.name)}</span></li>`
    : `<li><a href="${b.url}">${esc(b.name)}</a></li>`).join('')}</ol></nav>`;
}

export const breadcrumbLd = (items, base) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: base + localPath(b.url) }))
});

export function faqBlock(faq, title = T('Veelgestelde vragen', 'Frequently asked questions')) {
  if (!faq?.length) return { html: '', ld: null };
  const html = `<section class="section faq" aria-labelledby="faq-title"><div class="container container--narrow"><h2 id="faq-title">${esc(title)}</h2>${faq.map((f) => `<details class="faq__item"><summary>${esc(f.q)}${icon('chevron', 'faq__chev')}</summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('')}</div></section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return { html, ld };
}

export function adviceBlock(site, { title = T('Twijfelt u welke oplossing past?', 'Not sure which solution fits?'), text = T('Vertel ons uw situatie. Wij denken mee en adviseren een passende oplossing.', 'Tell us about your situation. We will think along with you and recommend a suitable solution.') } = {}) {
  return `<aside class="advice" aria-label="${T('Advies', 'Advice')}">
  <div class="advice__body"><p class="eyebrow">${T('Persoonlijk advies', 'Personal advice')}</p><h2 class="advice__title">${esc(title)}</h2><p>${esc(text)}</p></div>
  <div class="advice__contact">
    <a class="advice__line" href="tel:${site.phonePrimary.tel}">${icon('phone')}<span>${site.phonePrimary.display}</span></a>
    <a class="advice__line" href="tel:${site.phoneSecondary.tel}">${icon('phone')}<span>${site.phoneSecondary.display}</span></a>
    <a class="advice__line" href="mailto:${site.email}">${icon('mail')}<span>${site.email}</span></a>
    <div class="btn-row"><a class="btn btn--primary" href="/offerte-aanvragen/?type=advies">${T('Advies aanvragen', 'Request advice')}</a><a class="btn btn--ghost" href="/keuzehulp/">${T('Naar de keuzehulp', 'Go to the selection guide')}</a></div>
  </div>
</aside>`;
}

export function ctaBand({ title, text, buttons }) {
  return `<section class="cta-band"><div class="container cta-band__inner"><div><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}</div><div class="btn-row">${buttons.map((b) => `<a class="btn ${b.cls || 'btn--light'}" href="${b.href}">${b.icon ? icon(b.icon) : ''}${esc(b.label)}</a>`).join('')}</div></div></section>`;
}

export function productCard(p, ctx) {
  const { t, urls } = ctx;
  const orderable = isOrderable(p);
  const a = p.attributes || {};
  const data = {
    category: p.category,
    ibc: a.ibcCount ?? '',
    drums: a.drumCount ?? '',
    capacity: a.capacityL ?? '',
    dimensions: a.dimensions ?? '',
    material: a.material ?? '',
    application: (a.application || []).join('|'),
    liquid: (a.liquids || []).join('|'),
    location: a.location ?? '',
    duration: a.duration ?? '',
    orderable: orderable ? 'online' : 'aanvraag',
    price: hasRealPrice(p) ? p.price : '',
    name: p.name
  };
  const attrs = Object.entries(data).map(([k, v]) => `data-${k}="${esc(v)}"`).join(' ');
  const url = urls.product(p);
  return `<article class="pcard" ${attrs}>
  <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">${media(p.images?.[0], '4-3', false, CARD_SIZES)}</a>
  <div class="pcard__body">
    <p class="pcard__meta"><span>${esc(p.line || '')}</span><span class="status ${orderable ? 'status--on' : ''}">${orderable ? T('Online bestelbaar', 'Order online') : T('Op aanvraag', 'On request')}</span></p>
    <h3 class="pcard__title"><a href="${url}">${esc(p.name)}</a></h3>
    <p class="pcard__short">${esc(p.short)}</p>
    <div class="pcard__foot">
      ${priceBlock(p, t)}
      <div class="pcard__actions">
        ${orderable ? `<button class="btn btn--primary btn--sm" type="button" data-add-to-cart="${esc(p.id)}">${icon('cart')}${T('In winkelwagen', 'Add to cart')}</button>` : `<a class="btn btn--primary btn--sm" href="/offerte-aanvragen/?product=${encodeURIComponent(p.id)}">${T('Offerte aanvragen', 'Request a quote')}</a>`}
        ${orderable ? `<a class="pcard__quote" href="/offerte-aanvragen/?product=${encodeURIComponent(p.id)}">${T('Offerte aanvragen', 'Request a quote')}</a>` : `<a class="pcard__quote" href="${url}">${T('Bekijk details', 'View details')}</a>`}
      </div>
    </div>
  </div>
</article>`;
}

export function categoryCard(c, ctx, { compact = false } = {}) {
  if (compact) return `<a class="ccard ccard--compact" href="${ctx.urls.category(c)}"><span class="ccard__name">${esc(c.name)}</span><span class="ccard__text">${esc(c.short)}</span>${icon('arrow')}</a>`;
  return `<a class="ccard" href="${ctx.urls.category(c)}">
  <span class="ccard__media">${media({ src: c.imageSrc, alt: c.image }, '16-10', false, CARD_SIZES)}</span>
  <span class="ccard__body"><span class="ccard__title">${esc(c.name)}</span><span class="ccard__text">${esc(c.short)}</span><span class="link-arrow">${T('Bekijk oplossing', 'View solution')} ${icon('arrow')}</span></span>
</a>`;
}

/** Formulierveld. */
export function field({ name, label, type = 'text', required = false, autocomplete, options, hint, value = '', rows = 4, accept, multiple, full = false, attrs = '' }) {
  const id = `f-${name}`;
  const req = required ? ' required aria-required="true"' : '';
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : '';
  const hintId = hint ? ` aria-describedby="${id}-hint"` : '';
  const lab = `<label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ` <span class="opt">(${T('optioneel', 'optional')})</span>`}</label>`;
  let input;
  if (type === 'textarea') input = `<textarea id="${id}" name="${name}" rows="${rows}"${req}${hintId} ${attrs}>${esc(value)}</textarea>`;
  else if (type === 'select') input = `<select id="${id}" name="${name}"${req}${hintId} ${attrs}>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  else if (type === 'file') input = `<input id="${id}" name="${name}" type="file"${accept ? ` accept="${accept}"` : ''}${multiple ? ' multiple' : ''}${hintId} ${attrs}>`;
  else input = `<input id="${id}" name="${name}" type="${type}"${req}${ac}${hintId} value="${esc(value)}" ${attrs}>`;
  return `<div class="field${full ? ' field--full' : ''}">${lab}${input}${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}</div>`;
}

/** Twee optionele vragen om te leren van elke aanvraag. De waarde blijft Nederlands (voor de interne e-mail), het label volgt de taal. */
export const insightFields = () => `${field({ name: 'found_via', label: T('Hoe heeft u ons gevonden?', 'How did you find us?'), type: 'select', options: [['', T('Maak een keuze', 'Make a choice')], ['Google (zoeken)', T('Google (zoeken)', 'Google (search)')], ['Advertentie', T('Advertentie', 'Advertisement')], ['LinkedIn', 'LinkedIn'], ['Aanbevolen door iemand', T('Aanbevolen door iemand', 'Recommended by someone')], ['Website van de fabrikant', T('Website van de fabrikant', "Manufacturer's website")], ['Beurs of evenement', T('Beurs of evenement', 'Trade fair or event')], ['Anders', T('Anders', 'Other')]] })}
    ${field({ name: 'doubts', label: T('Waar twijfelt u nog over?', 'What are you still unsure about?'), type: 'textarea', rows: 3, full: true, hint: T('Bijvoorbeeld de maat, de geschiktheid voor uw vloeistof, de regels of de levertijd. Zo kunnen wij u gerichter helpen.', 'For example the size, suitability for your liquid, the rules or the delivery time. This helps us to help you better.') })}`;

export const honeypot = () => `<div class="hp" aria-hidden="true"><label for="f-website">${T('Laat dit veld leeg', 'Leave this field empty')}</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>`;

export const formStatus = () => `<div class="form-status" role="status" aria-live="polite" hidden></div>`;

/* ---------------------------------------------------------------- layout */

function megaMenu(ctx) {
  const { groups, categories, urls } = ctx;
  const groupIcons = { opvang: 'tray', tanks: 'tank', mobiel: 'wave', overig: 'grid' };
  return `<div class="mega" id="mega-producten" hidden>
  <div class="container mega__inner">
    ${groups.map((g) => `<div class="mega__col">
      <a class="mega__group" href="${urls.group(g)}">${icon(groupIcons[g.id] || 'grid')}<span>${esc(g.name)}</span></a>
      <ul>${categories.filter((c) => c.group === g.id).map((c) => `<li><a href="${urls.category(c)}">${esc(c.menuName || c.name)}</a></li>`).join('')}</ul>
    </div>`).join('')}
    <div class="mega__aside">
      <p class="eyebrow">${T('Hulp bij kiezen', 'Help choosing')}</p>
      <p class="mega__aside-title">${T('Welke oplossing heeft u nodig?', 'Which solution do you need?')}</p>
      <p>${T('Beantwoord zes korte vragen en zie welke oplossingen passen.', 'Answer six short questions and see which solutions fit.')}</p>
      <a class="btn btn--primary btn--sm" href="/keuzehulp/">${T('Start de keuzehulp', 'Start the selection guide')}</a>
    </div>
  </div>
</div>`;
}

function dropdown(id, items) {
  return `<div class="dropdown" id="${id}" hidden><ul>${items.map((i) => `<li><a href="${i.url}">${esc(i.name)}</a></li>`).join('')}</ul></div>`;
}

/** Taalschakelaar NL | EN. altPath is het Nederlandse pad van de huidige pagina. */
function langSwitch(altPath, cls = '') {
  const en = isEn();
  const target = altPath === '/404.html' ? '/' : altPath; // vanaf de 404 naar de homepage van de andere taal
  const nlHref = target, enHref = localPath(target, 'en');
  return `<div class="lang-switch ${cls}" data-lang-switch data-active="${en ? 'en' : 'nl'}" role="group" aria-label="${T('Taal', 'Language')}">
  ${icon('globe', 'lang-switch__icon')}
  <a href="${nlHref}" hreflang="nl" lang="nl" data-keep-href data-lang="nl"${en ? '' : ' aria-current="true"'}><span class="sr-only">Nederlands </span>NL</a>
  <a href="${enHref}" hreflang="en" lang="en" data-keep-href data-lang="en"${en ? ' aria-current="true"' : ''}><span class="sr-only">English </span>EN</a>
</div>`;
}

function header(ctx, path, altPath) {
  const { site, t } = ctx;
  const navItems = [
    { key: 'producten', label: t.products, url: '/producten/', panel: megaMenu(ctx) },
    { key: 'oplossingen', label: t.solutions, url: '/oplossingen/', panel: dropdown('dd-oplossingen', ctx.solutions.map((s) => ({ name: s.title, url: `/oplossingen/${s.slug}/` })).concat([{ name: T('Alle oplossingen', 'All solutions'), url: '/oplossingen/' }])) },
    { key: 'sectoren', label: t.sectors, url: '/sectoren/', panel: dropdown('dd-sectoren', ctx.sectors.map((s) => ({ name: s.name, url: `/sectoren/${s.slug}/` })).concat([{ name: T('Alle sectoren', 'All sectors'), url: '/sectoren/' }])) },
    { key: 'projecten', label: t.projects, url: '/projecten/' },
    { key: 'kennisbank', label: t.knowledge, url: '/kennisbank/' },
    { key: 'over-ons', label: t.about, url: '/over-ons/' },
    { key: 'contact', label: t.contact, url: '/contact/' }
  ];
  const isActive = (u) => (u !== '/' && altPath.startsWith(u)) ? ' aria-current="page"' : '';
  return `<header class="site-header" data-header>
  <div class="header-main">
    <div class="container header-main__inner">
      <a class="logo" href="/" aria-label="${T('EnviroFlow – naar de homepage', 'EnviroFlow – to the homepage')}"><img src="/assets/img/enviroflow-logo-400.webp" width="400" height="42" alt="EnviroFlow"></a>
      <form class="search" role="search" action="/zoeken/" method="get" data-search>
        <label class="sr-only" for="q-header">${t.search}</label>
        <input id="q-header" name="q" type="search" role="combobox" placeholder="${t.searchPlaceholder}" autocomplete="off" aria-controls="search-results" aria-expanded="false" aria-autocomplete="list">
        <button type="submit" class="search__btn" aria-label="${t.search}">${icon('search')}</button>
        <div class="search__results" id="search-results" role="listbox" aria-label="${T('Zoekresultaten', 'Search results')}" hidden></div>
      </form>
      <div class="header-actions">
        <button class="icon-btn search-toggle" type="button" aria-label="${T('Zoeken openen', 'Open search')}" aria-expanded="false" data-search-toggle>${icon('search')}</button>
        <a class="header-phone" href="tel:${site.phonePrimary.tel}">${icon('phone')}<span><small>${T('Bel ons', 'Call us')}</small>${site.phonePrimary.display}</span></a>
        ${langSwitch(altPath, 'lang-switch--header')}
        <a class="icon-btn cart-link" href="/winkelwagen/" aria-label="${t.cart}">${icon('cart')}<span class="cart-count" data-cart-count hidden>0</span></a>
        <a class="btn btn--primary header-cta" href="/offerte-aanvragen/">${t.quote}</a>
        <button class="icon-btn menu-toggle" type="button" aria-label="${t.menu}" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>${icon('menu')}</button>
      </div>
    </div>
  </div>
  <nav class="site-nav" id="site-nav" aria-label="${T('Hoofdmenu', 'Main menu')}" data-nav>
    <div class="container site-nav__inner">
      <ul class="nav-list">
        ${navItems.map((n) => n.panel ? `<li class="nav-item has-panel">
          <a class="nav-link" href="${n.url}"${isActive(n.url)}>${esc(n.label)}</a><button class="nav-expand" type="button" aria-expanded="false" aria-controls="${n.key === 'producten' ? 'mega-producten' : `dd-${n.key}`}" aria-label="${esc(n.label)}: ${T('submenu openen', 'open submenu')}">${icon('chevron')}</button>
          ${n.panel}
        </li>` : `<li class="nav-item"><a class="nav-link" href="${n.url}"${isActive(n.url)}>${esc(n.label)}</a></li>`).join('')}
      </ul>
      <div class="vat-toggle" role="group" aria-label="${T('Prijsweergave', 'Price display')}">
        <span class="vat-toggle__label">${T('Prijzen', 'Prices')}</span>
        <button type="button" data-vat="excl" aria-pressed="true">${T('excl. btw', 'excl. VAT')}</button>
        <button type="button" data-vat="incl" aria-pressed="false">${T('incl. btw', 'incl. VAT')}</button>
      </div>
      ${langSwitch(altPath, 'lang-switch--menu')}
      <div class="nav-mobile-contact">
        <a href="tel:${site.phonePrimary.tel}">${icon('phone')} ${site.phonePrimary.display}</a>
        <a href="mailto:${site.email}">${icon('mail')} ${site.email}</a>
      </div>
    </div>
  </nav>
</header>`;
}

function footer(ctx) {
  const { site, groups, urls } = ctx;
  const a = site.address;
  return `<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href="/" class="footer-logo" aria-label="${T('EnviroFlow – naar de homepage', 'EnviroFlow – to the homepage')}">${logoDark()}</a>
      <p>${T('EnviroFlow helpt bedrijven om vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen — van een flexibele opvangbak tot complete tankoplossingen.', 'EnviroFlow helps businesses store, contain and move liquids safely and practically — from a flexible spill tray to complete tank solutions.')}</p>
    </div>
    <div>
      <h2 class="footer-title">Contact</h2>
      <ul class="footer-list">
        <li><a href="tel:${site.phonePrimary.tel}">${icon('phone')}${site.phonePrimary.display}</a></li>
        <li><a href="tel:${site.phoneSecondary.tel}">${icon('phone')}${site.phoneSecondary.display}</a></li>
        <li><a href="mailto:${site.email}">${icon('mail')}${site.email}</a></li>
        <li><span>${icon('pin')}${esc(a.street)}<br>${esc(a.postalCode)} ${esc(a.city)}</span></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-title">${T('Producten', 'Products')}</h2>
      <ul class="footer-list">${groups.map((g) => `<li><a href="${urls.group(g)}">${esc(g.name)}</a></li>`).join('')}<li><a href="/producten/overige-oplossingen/maatwerk/">${T('Maatwerk', 'Custom-made')}</a></li></ul>
    </div>
    <div>
      <h2 class="footer-title">EnviroFlow</h2>
      <ul class="footer-list">
        <li><a href="/oplossingen/">${T('Oplossingen', 'Solutions')}</a></li><li><a href="/sectoren/">${T('Sectoren', 'Sectors')}</a></li><li><a href="/projecten/">${T('Projecten', 'Projects')}</a></li>
        <li><a href="/kennisbank/">${T('Kennisbank', 'Knowledge base')}</a></li><li><a href="/over-ons/">${T('Over ons', 'About us')}</a></li><li><a href="/partners/">Partners</a></li><li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-title">${T('Klantenservice', 'Customer service')}</h2>
      <ul class="footer-list">
        <li><a href="/offerte-aanvragen/">${T('Offerte aanvragen', 'Request a quote')}</a></li><li><a href="/keuzehulp/">${T('Keuzehulp', 'Selection guide')}</a></li>
        <li><a href="/levering-en-verzending/">${T('Levering &amp; verzending', 'Delivery &amp; shipping')}</a></li><li><a href="/retourneren/">${T('Retourneren', 'Returns')}</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom__inner">
      <p>© <span data-year>${new Date().getFullYear()}</span> EnviroFlow · ${T('KvK', 'CoC')} ${esc(site.kvk)} · ${T('Btw', 'VAT')} ${ph(site.vatNumber)}</p>
      <ul class="footer-legal">
        <li><a href="/algemene-voorwaarden/">${T('Algemene voorwaarden', 'Terms and conditions')}</a></li><li><a href="/privacybeleid/">${T('Privacybeleid', 'Privacy policy')}</a></li>
        <li><a href="/cookiebeleid/">${T('Cookiebeleid', 'Cookie policy')}</a></li><li><button type="button" class="linklike" data-cookie-settings>${T('Cookie-instellingen', 'Cookie settings')}</button></li>
      </ul>
    </div>
  </div>
</footer>
<div class="mobile-bar" aria-label="${T('Snel contact', 'Quick contact')}">
  <a href="tel:${site.phonePrimary.tel}" class="mobile-bar__btn">${icon('phone')}${T('Bel direct', 'Call now')}</a>
  <a href="/offerte-aanvragen/" class="mobile-bar__btn mobile-bar__btn--primary">${icon('clipboard')}${T('Offerte', 'Quote')}</a>
</div>
<div class="cookie" role="dialog" aria-modal="false" aria-labelledby="cookie-title" data-cookie hidden>
  <div class="cookie__inner">
    <h2 id="cookie-title" class="cookie__title">${T('Cookies op deze website', 'Cookies on this website')}</h2>
    <p>${T('Wij gebruiken alleen functionele opslag die nodig is voor de website, zoals uw winkelwagen en voorkeur voor prijsweergave. Analytische cookies plaatsen wij alleen met uw toestemming. Lees meer in ons <a href="/cookiebeleid/">cookiebeleid</a>.', 'We only use functional storage that the website needs, such as your shopping cart and price display preference. We only place analytical cookies with your consent. Read more in our <a href="/cookiebeleid/">cookie policy</a>.')}</p>
    <div class="btn-row"><button type="button" class="btn btn--ghost btn--sm" data-cookie-choice="necessary">${T('Alleen noodzakelijk', 'Necessary only')}</button><button type="button" class="btn btn--ghost btn--sm" data-cookie-choice="all">${T('Alles accepteren', 'Accept all')}</button></div>
  </div>
</div>
<script>/* Melding meteen bij de eerste weergave tonen (niet pas na het laden van main.js). */try{if(!localStorage.getItem('ef-consent'))document.querySelector('[data-cookie]').hidden=false}catch(e){}</script>`;
}

/** Zet links naar de eigen site in JSON-LD om naar de taalversie (/en/…). */
function localizeLd(value, base) {
  if (typeof value === 'string') return value.startsWith(base + '/') && !value.startsWith(base + '/assets/') ? base + localPath(value.slice(base.length)) : value;
  if (Array.isArray(value)) return value.map((v) => localizeLd(v, base));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localizeLd(v, base)]));
  return value;
}

export function layout(ctx, { path, altPath = path, title, description, body, crumbs = [], jsonld = [], noindex = false, bodyClass = '', scripts = [], ogImage, preload = '' }) {
  const { site } = ctx;
  const canonical = site.baseUrl + path;
  const lds = [...jsonld];
  if (crumbs.length) lds.push(breadcrumbLd(crumbs, site.baseUrl));
  const ldOut = isEn() ? lds.map((l) => localizeLd(l, site.baseUrl)) : lds;
  const lang = getLang();
  const altLinks = path === '/404.html' || altPath === '/404.html' ? '' : `<link rel="alternate" hreflang="nl" href="${site.baseUrl}${altPath}"><link rel="alternate" hreflang="en" href="${site.baseUrl}${localPath(altPath, 'en')}"><link rel="alternate" hreflang="x-default" href="${site.baseUrl}${altPath}">`;
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${altLinks}
${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
<meta property="og:type" content="website"><meta property="og:locale" content="${isEn() ? 'en_GB' : 'nl_NL'}"><meta property="og:locale:alternate" content="${isEn() ? 'nl_NL' : 'en_GB'}"><meta property="og:site_name" content="EnviroFlow">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.baseUrl}${ogImage || '/assets/img/enviroflow-og.png'}">
<meta name="theme-color" content="#0A3B2C">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
${preload}
<link rel="preload" href="/assets/fonts/inter-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
${ctx.inlineCss ? `<style>${ctx.inlineCss}</style>` : `<link rel="stylesheet" href="/assets/css/main.css?v=${ctx.version}">`}
${ldOut.map((l) => `<script type="application/ld+json">${JSON.stringify(l).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body class="${bodyClass}">
${iconSprite()}
<a class="skip-link" href="#main">${ctx.t.skipLink}</a>
${header(ctx, path, altPath)}
<main id="main" tabindex="-1">
${breadcrumbs(crumbs)}
${body}
</main>
${footer(ctx)}
<script>window.EF=${JSON.stringify({ lang, base: isEn() ? '/en' : '', vatRate: site.vatRate, t: ctx.t, shipping: site.shipping.flatRate, phone: site.phonePrimary })};</script>
<script src="/assets/js/main.js?v=${ctx.version}" defer></script>
${scripts.map((s) => `<script src="${s}?v=${ctx.version}" defer></script>`).join('\n')}
${site.cfAnalyticsToken ? `<script>/* Bezoekersstatistieken pas laden als de pagina klaar is (telt niet mee in de laadtijd). */addEventListener('load',function(){setTimeout(function(){var s=document.createElement('script');s.defer=true;s.src='https://static.cloudflareinsights.com/beacon.min.js';s.setAttribute('data-cf-beacon','${JSON.stringify({ token: site.cfAnalyticsToken })}');document.body.appendChild(s)},3000)})</script>` : ''}
</body>
</html>`;
}
