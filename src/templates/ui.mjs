// Herbruikbare HTML-bouwstenen en de paginalayout.
import { hasRealPrice, hasPlaceholderPrice, isOrderable } from '../lib/catalog.mjs';

export const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/** Toont placeholders als [ZO] herkenbaar gemarkeerd. */
export const ph = (s = '') => esc(s).replace(/\[([^\]]+)\]/g, '<mark class="placeholder">[$1]</mark>');

export const fmtEUR = (n) => new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n);

const ICONS = {
  phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>',
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
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
  filter: '<path d="M22 3H2l8 9.5V19l4 2v-8.5z"/>'
};

export const icon = (name, cls = '') => `<svg class="ic ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
const iconSprite = () => `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${Object.entries(ICONS)
  .map(([k, v]) => `<symbol id="i-${k}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${v}</symbol>`).join('')}</svg>`;

/** Golflijn uit het logo als sectiescheiding. */
export const wave = (cls = '') => `<div class="wave ${cls}" aria-hidden="true"><svg viewBox="0 0 1440 48" preserveAspectRatio="none"><defs><linearGradient id="wg${cls.replace(/\W/g, '')}" x1="0" x2="1"><stop offset="0" stop-color="#2BA84A"/><stop offset=".55" stop-color="#12A18F"/><stop offset="1" stop-color="#1E9BE0"/></linearGradient></defs><path d="M0 30 C 240 4, 420 46, 720 26 S 1200 8, 1440 22" fill="none" stroke="url(#wg${cls.replace(/\W/g, '')})" stroke-width="3"/></svg></div>`;

/** Logo voor donkere achtergrond (vectorbenadering van het woordmerk). */
export const logoDark = () => `<img class="logo-dark" src="/assets/img/enviroflow-logo-wit.webp" srcset="/assets/img/enviroflow-logo-wit.webp 1x, /assets/img/enviroflow-logo-wit@2x.webp 2x" width="520" height="55" alt="EnviroFlow" loading="lazy">`;

/** Afbeelding of beschrijvende placeholder. img = { src, alt, width, height } */
export function media(img, ratio = '4-3', eager = false) {
  if (img && img.src) {
    const base = img.src.replace(/\.(jpe?g|png|webp)$/i, '');
    return `<picture class="media r-${ratio}"><source type="image/webp" srcset="${esc(base)}.webp"><img src="${esc(img.src)}" alt="${esc(img.alt)}" width="${img.width || 800}" height="${img.height || 600}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
  }
  const alt = img?.alt || 'Afbeelding volgt';
  return `<div class="media media--ph r-${ratio}" role="img" aria-label="${esc(alt)}"><span>${icon('file')}${esc(alt)}</span></div>`;
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
  return `<nav class="breadcrumbs container" aria-label="Kruimelpad"><ol>${items.map((b, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(b.name)}</span></li>`
    : `<li><a href="${b.url}">${esc(b.name)}</a></li>`).join('')}</ol></nav>`;
}

export const breadcrumbLd = (items, base) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((b, i) => ({ '@type': 'ListItem', position: i + 1, name: b.name, item: base + b.url }))
});

export function faqBlock(faq, title = 'Veelgestelde vragen') {
  if (!faq?.length) return { html: '', ld: null };
  const html = `<section class="section faq" aria-labelledby="faq-title"><div class="container container--narrow"><h2 id="faq-title">${esc(title)}</h2>${faq.map((f) => `<details class="faq__item"><summary>${esc(f.q)}${icon('chevron', 'faq__chev')}</summary><div class="faq__a"><p>${esc(f.a)}</p></div></details>`).join('')}</div></section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) };
  return { html, ld };
}

export function adviceBlock(site, { title = 'Twijfelt u welke oplossing past?', text = 'Vertel ons uw situatie. Wij denken mee en adviseren een passende oplossing.' } = {}) {
  return `<aside class="advice" aria-label="Advies">
  <div class="advice__body"><p class="eyebrow">Persoonlijk advies</p><h2 class="advice__title">${esc(title)}</h2><p>${esc(text)}</p></div>
  <div class="advice__contact">
    <a class="advice__line" href="tel:${site.phonePrimary.tel}">${icon('phone')}<span>${site.phonePrimary.display}</span></a>
    <a class="advice__line" href="tel:${site.phoneSecondary.tel}">${icon('phone')}<span>${site.phoneSecondary.display}</span></a>
    <a class="advice__line" href="mailto:${site.email}">${icon('mail')}<span>${site.email}</span></a>
    <div class="btn-row"><a class="btn btn--primary" href="/offerte-aanvragen/?type=advies">Advies aanvragen</a><a class="btn btn--ghost" href="/keuzehulp/">Naar de keuzehulp</a></div>
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
  <a class="pcard__media" href="${url}" tabindex="-1" aria-hidden="true">${media(p.images?.[0], '4-3')}</a>
  <div class="pcard__body">
    <p class="pcard__brand">${esc(ctx.brandById[p.brand]?.name || '')}</p>
    <h3 class="pcard__title"><a href="${url}">${esc(p.name)}</a></h3>
    <p class="pcard__short">${esc(p.short)}</p>
    <div class="pcard__foot">
      ${priceBlock(p, t)}
      <span class="tag ${orderable ? 'tag--green' : ''}">${orderable ? 'Online bestelbaar' : 'Op aanvraag'}</span>
    </div>
    <div class="pcard__actions">
      ${orderable ? `<button class="btn btn--primary btn--sm" type="button" data-add-to-cart="${esc(p.id)}">${icon('cart')}In winkelwagen</button>` : ''}
      <a class="btn ${orderable ? 'btn--ghost' : 'btn--primary'} btn--sm" href="/offerte-aanvragen/?product=${encodeURIComponent(p.id)}">Offerte aanvragen</a>
    </div>
  </div>
</article>`;
}

export function categoryCard(c, ctx, { compact = false } = {}) {
  return `<a class="ccard ${compact ? 'ccard--compact' : ''}" href="${ctx.urls.category(c)}">
  ${compact ? '' : media({ src: c.imageSrc, alt: c.image }, '16-9')}
  <div class="ccard__body"><h3>${esc(c.name)}</h3><p>${esc(c.short)}</p><span class="link-arrow">Bekijk oplossing ${icon('arrow')}</span></div>
</a>`;
}

/** Formulierveld. */
export function field({ name, label, type = 'text', required = false, autocomplete, options, hint, value = '', rows = 4, accept, multiple, full = false, attrs = '' }) {
  const id = `f-${name}`;
  const req = required ? ' required aria-required="true"' : '';
  const ac = autocomplete ? ` autocomplete="${autocomplete}"` : '';
  const hintId = hint ? ` aria-describedby="${id}-hint"` : '';
  const lab = `<label for="${id}">${esc(label)}${required ? ' <span class="req" aria-hidden="true">*</span>' : ' <span class="opt">(optioneel)</span>'}</label>`;
  let input;
  if (type === 'textarea') input = `<textarea id="${id}" name="${name}" rows="${rows}"${req}${hintId} ${attrs}>${esc(value)}</textarea>`;
  else if (type === 'select') input = `<select id="${id}" name="${name}"${req}${hintId} ${attrs}>${options.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  else if (type === 'file') input = `<input id="${id}" name="${name}" type="file"${accept ? ` accept="${accept}"` : ''}${multiple ? ' multiple' : ''}${hintId} ${attrs}>`;
  else input = `<input id="${id}" name="${name}" type="${type}"${req}${ac}${hintId} value="${esc(value)}" ${attrs}>`;
  return `<div class="field${full ? ' field--full' : ''}">${lab}${input}${hint ? `<p class="field__hint" id="${id}-hint">${esc(hint)}</p>` : ''}</div>`;
}

export const honeypot = () => `<div class="hp" aria-hidden="true"><label for="f-website">Laat dit veld leeg</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>`;

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
      <p class="eyebrow">Hulp bij kiezen</p>
      <p class="mega__aside-title">Welke oplossing heeft u nodig?</p>
      <p>Beantwoord zes korte vragen en zie welke oplossingen passen.</p>
      <a class="btn btn--primary btn--sm" href="/keuzehulp/">Start de keuzehulp</a>
    </div>
  </div>
</div>`;
}

function dropdown(id, items) {
  return `<div class="dropdown" id="${id}" hidden><ul>${items.map((i) => `<li><a href="${i.url}">${esc(i.name)}</a></li>`).join('')}</ul></div>`;
}

function header(ctx, path) {
  const { site, t } = ctx;
  const navItems = [
    { key: 'producten', label: t.products, url: '/producten/', panel: megaMenu(ctx) },
    { key: 'oplossingen', label: t.solutions, url: '/oplossingen/', panel: dropdown('dd-oplossingen', ctx.solutions.map((s) => ({ name: s.title, url: `/oplossingen/${s.slug}/` })).concat([{ name: 'Alle oplossingen', url: '/oplossingen/' }])) },
    { key: 'sectoren', label: t.sectors, url: '/sectoren/', panel: dropdown('dd-sectoren', ctx.sectors.map((s) => ({ name: s.name, url: `/sectoren/${s.slug}/` })).concat([{ name: 'Alle sectoren', url: '/sectoren/' }])) },
    { key: 'projecten', label: t.projects, url: '/projecten/' },
    { key: 'kennisbank', label: t.knowledge, url: '/kennisbank/' },
    { key: 'over-ons', label: t.about, url: '/over-ons/' },
    { key: 'contact', label: t.contact, url: '/contact/' }
  ];
  const isActive = (u) => (u !== '/' && path.startsWith(u)) ? ' aria-current="page"' : '';
  return `<header class="site-header" data-header>
  <div class="header-main">
    <div class="container header-main__inner">
      <a class="logo" href="/" aria-label="EnviroFlow – naar de homepage"><img src="/assets/img/enviroflow-logo.webp" srcset="/assets/img/enviroflow-logo.webp 1x, /assets/img/enviroflow-logo@2x.webp 2x" width="520" height="55" alt="EnviroFlow"></a>
      <form class="search" role="search" action="/zoeken/" method="get" data-search>
        <label class="sr-only" for="q-header">${t.search}</label>
        <input id="q-header" name="q" type="search" placeholder="${t.searchPlaceholder}" autocomplete="off" aria-controls="search-results" aria-expanded="false" aria-autocomplete="list">
        <button type="submit" class="search__btn" aria-label="${t.search}">${icon('search')}</button>
        <div class="search__results" id="search-results" role="listbox" aria-label="Zoekresultaten" hidden></div>
      </form>
      <div class="header-actions">
        <button class="icon-btn search-toggle" type="button" aria-label="Zoeken openen" aria-expanded="false" data-search-toggle>${icon('search')}</button>
        <a class="header-phone" href="tel:${site.phonePrimary.tel}">${icon('phone')}<span><small>Bel ons</small>${site.phonePrimary.display}</span></a>
        <a class="icon-btn cart-link" href="/winkelwagen/" aria-label="${t.cart}">${icon('cart')}<span class="cart-count" data-cart-count hidden>0</span></a>
        <a class="btn btn--primary header-cta" href="/offerte-aanvragen/">${t.quote}</a>
        <button class="icon-btn menu-toggle" type="button" aria-label="${t.menu}" aria-expanded="false" aria-controls="site-nav" data-menu-toggle>${icon('menu')}</button>
      </div>
    </div>
  </div>
  <nav class="site-nav" id="site-nav" aria-label="Hoofdmenu" data-nav>
    <div class="container site-nav__inner">
      <ul class="nav-list">
        ${navItems.map((n) => n.panel ? `<li class="nav-item has-panel">
          <a class="nav-link" href="${n.url}"${isActive(n.url)}>${esc(n.label)}</a><button class="nav-expand" type="button" aria-expanded="false" aria-controls="${n.key === 'producten' ? 'mega-producten' : `dd-${n.key}`}" aria-label="${esc(n.label)}: submenu openen">${icon('chevron')}</button>
          ${n.panel}
        </li>` : `<li class="nav-item"><a class="nav-link" href="${n.url}"${isActive(n.url)}>${esc(n.label)}</a></li>`).join('')}
      </ul>
      <div class="vat-toggle" role="group" aria-label="Prijsweergave">
        <span class="vat-toggle__label">Prijzen</span>
        <button type="button" data-vat="excl" aria-pressed="true">excl. btw</button>
        <button type="button" data-vat="incl" aria-pressed="false">incl. btw</button>
      </div>
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
  ${wave('footer-wave')}
  <div class="container footer-grid">
    <div class="footer-brand">
      <a href="/" class="footer-logo" aria-label="EnviroFlow – naar de homepage">${logoDark()}</a>
      <p>EnviroFlow helpt bedrijven om vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen — van een flexibele opvangbak tot complete tankoplossingen.</p>
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
      <h2 class="footer-title">Producten</h2>
      <ul class="footer-list">${groups.map((g) => `<li><a href="${urls.group(g)}">${esc(g.name)}</a></li>`).join('')}<li><a href="/producten/overige-oplossingen/maatwerk/">Maatwerk</a></li></ul>
    </div>
    <div>
      <h2 class="footer-title">EnviroFlow</h2>
      <ul class="footer-list">
        <li><a href="/oplossingen/">Oplossingen</a></li><li><a href="/sectoren/">Sectoren</a></li><li><a href="/projecten/">Projecten</a></li>
        <li><a href="/kennisbank/">Kennisbank</a></li><li><a href="/over-ons/">Over ons</a></li><li><a href="/partners/">Partners</a></li><li><a href="/contact/">Contact</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-title">Klantenservice</h2>
      <ul class="footer-list">
        <li><a href="/offerte-aanvragen/">Offerte aanvragen</a></li><li><a href="/keuzehulp/">Keuzehulp</a></li>
        <li><a href="/levering-en-verzending/">Levering &amp; verzending</a></li><li><a href="/retourneren/">Retourneren</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container footer-bottom__inner">
      <p>© <span data-year>${new Date().getFullYear()}</span> EnviroFlow · KvK ${esc(site.kvk)} · Btw ${ph(site.vatNumber)}</p>
      <ul class="footer-legal">
        <li><a href="/algemene-voorwaarden/">Algemene voorwaarden</a></li><li><a href="/privacybeleid/">Privacybeleid</a></li>
        <li><a href="/cookiebeleid/">Cookiebeleid</a></li><li><button type="button" class="linklike" data-cookie-settings>Cookie-instellingen</button></li>
      </ul>
    </div>
  </div>
</footer>
<div class="mobile-bar" aria-label="Snel contact">
  <a href="tel:${site.phonePrimary.tel}" class="mobile-bar__btn">${icon('phone')}Bel direct</a>
  <a href="/offerte-aanvragen/" class="mobile-bar__btn mobile-bar__btn--primary">${icon('clipboard')}Offerte</a>
</div>
<div class="cookie" role="dialog" aria-modal="false" aria-labelledby="cookie-title" data-cookie hidden>
  <div class="cookie__inner">
    <h2 id="cookie-title" class="cookie__title">Cookies op deze website</h2>
    <p>Wij gebruiken alleen functionele opslag die nodig is voor de website, zoals uw winkelwagen en voorkeur voor prijsweergave. Analytische cookies plaatsen wij alleen met uw toestemming. Lees meer in ons <a href="/cookiebeleid/">cookiebeleid</a>.</p>
    <div class="btn-row"><button type="button" class="btn btn--ghost btn--sm" data-cookie-choice="necessary">Alleen noodzakelijk</button><button type="button" class="btn btn--ghost btn--sm" data-cookie-choice="all">Alles accepteren</button></div>
  </div>
</div>`;
}

export function layout(ctx, { path, title, description, body, crumbs = [], jsonld = [], noindex = false, bodyClass = '', scripts = [], ogImage }) {
  const { site } = ctx;
  const canonical = site.baseUrl + path;
  const lds = [...jsonld];
  if (crumbs.length) lds.push(breadcrumbLd(crumbs, site.baseUrl));
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
<meta property="og:type" content="website"><meta property="og:locale" content="nl_NL"><meta property="og:site_name" content="EnviroFlow">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${canonical}">
<meta property="og:image" content="${site.baseUrl}${ogImage || '/assets/img/enviroflow-og.png'}">
<meta name="theme-color" content="#0A3B2C">
<link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/assets/fonts/inter-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/archivo-latin-wght.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css?v=${ctx.version}">
${lds.map((l) => `<script type="application/ld+json">${JSON.stringify(l).replace(/</g, '\\u003c')}</script>`).join('\n')}
</head>
<body class="${bodyClass}">
${iconSprite()}
<a class="skip-link" href="#main">${ctx.t.skipLink}</a>
${header(ctx, path)}
<main id="main" tabindex="-1">
${breadcrumbs(crumbs)}
${body}
</main>
${footer(ctx)}
<script>window.EF=${JSON.stringify({ vatRate: site.vatRate, t: ctx.t, shipping: site.shipping.flatRate, phone: site.phonePrimary })};</script>
<script src="/assets/js/main.js?v=${ctx.version}" defer></script>
${scripts.map((s) => `<script src="${s}?v=${ctx.version}" defer></script>`).join('\n')}
</body>
</html>`;
}
