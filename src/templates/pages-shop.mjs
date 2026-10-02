// Home, productoverzichten, productpagina's, winkelwagen, checkout, formulieren en keuzehulp.
import { esc, ph, icon, wave, media, priceBlock, faqBlock, adviceBlock, ctaBand, productCard, categoryCard, field, honeypot, formStatus } from './ui.mjs';
import { isOrderable, hasRealPrice } from '../lib/catalog.mjs';

const GROUP_ICONS = { opvang: 'tray', tanks: 'tank', mobiel: 'wave', overig: 'grid' };

/* ================================================================ HOME */
export function home(ctx) {
  const { site, groups, categories, products, solutions, sectors, urls, brandById } = ctx;
  const exflo = brandById.exflo;
  const featured = products.filter((p) => isOrderable(p) && p.featured).slice(0, 4);
  const popular = categories.filter((c) => c.popular).slice(0, 8);

  const body = `
<section class="hero">
  <div class="container hero__inner">
    <div class="hero__content">
      <p class="eyebrow eyebrow--light">Zakelijke specialist in vloeistofopslag en opvang</p>
      <h1>Veilige oplossingen voor vloeistofopslag en opvang</h1>
      <p class="hero__lead">Van flexibele lekbakken voor IBC's tot brandwater-, brandstof- en mesttanks. EnviroFlow helpt bedrijven vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen.</p>
      <div class="btn-row"><a class="btn btn--accent btn--lg" href="/producten/">Bekijk producten ${icon('arrow')}</a><a class="btn btn--outline-light btn--lg" href="/offerte-aanvragen/?type=advies">Vraag advies aan</a></div>
      <p class="hero__phone">Liever direct overleggen? Bel <a href="tel:${site.phonePrimary.tel}">${site.phonePrimary.display}</a></p>
    </div>
    <div class="hero__visual">${media({ alt: 'Sfeerbeeld: flexibele opvangbak met IBC\'s in een industriële hal, koel daglicht' }, '4-3', true)}</div>
  </div>
  ${wave('hero-wave')}
</section>

<section class="trustbar" aria-label="Waarom EnviroFlow">
  <ul class="container trustbar__list">
    ${['Zakelijke specialist', 'Praktisch advies', 'Maatwerk mogelijk', 'Persoonlijk contact', 'Producten van EXFLO'].map((u) => `<li>${icon('check')}${u}</li>`).join('')}
  </ul>
</section>

<section class="section" aria-labelledby="h-groups">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Assortiment</p><h2 id="h-groups">Oplossingen voor opvang, opslag en bescherming</h2><p>Vier productgroepen, één aanspreekpunt. Kies een groep of bekijk direct een populaire categorie.</p></div>
    <div class="group-grid">
      ${groups.map((g) => `<a class="gtile" href="${urls.group(g)}">
        <span class="gtile__icon">${icon(GROUP_ICONS[g.id] || 'grid')}</span>
        <h3>${esc(g.name)}</h3><p>${esc(g.short)}</p>
        <ul>${categories.filter((c) => c.group === g.id).slice(0, 4).map((c) => `<li>${esc(c.name)}</li>`).join('')}</ul>
        <span class="link-arrow">Bekijk ${esc(g.name.toLowerCase())} ${icon('arrow')}</span>
      </a>`).join('')}
    </div>
    <h3 class="subhead">Populaire categorieën</h3>
    <div class="cat-grid cat-grid--compact">${popular.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div>
  </div>
</section>

<section class="section section--grey" aria-labelledby="h-problems">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Vanuit uw situatie</p><h2 id="h-problems">Waar loopt u tegenaan?</h2><p>Kies de situatie die het best bij u past. Wij laten zien waar u op let en welke oplossingen passen.</p></div>
    <div class="problem-grid">
      ${solutions.map((s) => `<a class="ptile" href="/oplossingen/${s.slug}/"><span>${esc(s.tile)}</span>${icon('arrow')}</a>`).join('')}
      <a class="ptile ptile--alt" href="/keuzehulp/"><span>Iets anders? Gebruik de keuzehulp</span>${icon('compass')}</a>
    </div>
  </div>
</section>

${featured.length ? `<section class="section" aria-labelledby="h-featured">
  <div class="container">
    <div class="section-head section-head--row"><div><p class="eyebrow">Direct online te bestellen</p><h2 id="h-featured">Uitgelichte producten</h2></div><a class="link-arrow" href="/producten/opvang-en-spill-containment/">Alle opvangoplossingen ${icon('arrow')}</a></div>
    <div class="product-grid product-grid--3">${featured.map((p) => productCard(p, ctx)).join('')}</div>
  </div>
</section>` : ''}

<section class="section section--dark keuze-teaser" aria-labelledby="h-keuze">
  <div class="container keuze-teaser__inner">
    <div>
      <p class="eyebrow eyebrow--light">Keuzehulp</p>
      <h2 id="h-keuze">Welke oplossing heeft u nodig?</h2>
      <p>Beantwoord zes korte vragen over uw vloeistof, de hoeveelheid en de locatie. U ziet direct welke oplossingen geschikt kunnen zijn, en een specialist kijkt op verzoek mee.</p>
      <a class="btn btn--accent btn--lg" href="/keuzehulp/">Start de keuzehulp ${icon('arrow')}</a>
    </div>
    <ol class="keuze-teaser__steps">
      ${['Wat wilt u doen?', 'Welke vloeistof?', 'Hoeveel?', 'Binnen of buiten?', 'Tijdelijk of permanent?', 'Beschikbare ruimte'].map((q, i) => `<li><span>${i + 1}</span>${q}</li>`).join('')}
    </ol>
  </div>
</section>

<section class="section" aria-labelledby="h-sectors">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Sectoren</p><h2 id="h-sectors">Voor bedrijven die met vloeistoffen werken</h2></div>
    <ul class="sector-grid">${sectors.map((s) => `<li><a href="/sectoren/${s.slug}/">${esc(s.name)}${icon('arrow')}</a></li>`).join('')}</ul>
  </div>
</section>

<section class="section section--grey" aria-labelledby="h-werkwijze">
  <div class="container">
    <div class="section-head"><p class="eyebrow">Werkwijze</p><h2 id="h-werkwijze">Hoe wij werken</h2></div>
    ${stepsList()}
  </div>
</section>

<section class="section" aria-labelledby="h-partner">
  <div class="container partner-block">
    <div class="partner-block__logo">${exflo.logo ? `<img src="${exflo.logo}" alt="EXFLO logo" loading="lazy">` : `<div class="logo-ph">${ph(exflo.logoPlaceholder)}</div>`}</div>
    <div>
      <p class="eyebrow">Partner</p>
      <h2 id="h-partner">Producten van EXFLO</h2>
      <p>${esc(exflo.intro)}</p>
      <p>EnviroFlow is ${ph(site.partnerRelation)} van EXFLO.</p>
      <a class="link-arrow" href="/partners/exflo/">Meer over EXFLO ${icon('arrow')}</a>
    </div>
  </div>
</section>

<section class="section section--grey" aria-labelledby="h-maatwerk">
  <div class="container split">
    <div>
      <p class="eyebrow">Maatwerk</p>
      <h2 id="h-maatwerk">Past een standaardmaat niet?</h2>
      <p>Een opvangbak rond een specifieke machine, een tank voor een ruimte met beperkte hoogte of een afwijkende aansluiting. Vertel ons wat u nodig heeft. Wij bekijken samen met de fabrikant wat mogelijk is.</p>
      <a class="btn btn--primary" href="/maatwerk-aanvragen/">Vraag maatwerk aan</a>
    </div>
    ${media({ alt: 'Foto: opvangbak op maat rond een machine in een productiehal' }, '16-9')}
  </div>
</section>

${ctaBand({ title: 'Weet u niet welke oplossing u nodig heeft?', text: 'Bespreek uw situatie met een specialist. Wij denken mee en komen met een passend voorstel.', buttons: [{ label: 'Vraag advies aan', href: '/offerte-aanvragen/?type=advies', cls: 'btn--accent' }, { label: `Bel een specialist`, href: `tel:${site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}
`;
  const org = {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'EnviroFlow', url: site.baseUrl,
    logo: site.baseUrl + '/assets/img/enviroflow-logo.png', email: site.email,
    telephone: [site.phonePrimary.tel, site.phoneSecondary.tel],
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country },
    areaServed: { '@type': 'Country', name: site.address.countryName },
    identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: site.kvk },
    contactPoint: [{ '@type': 'ContactPoint', telephone: site.phonePrimary.tel, contactType: 'sales', areaServed: 'NL', availableLanguage: 'nl' }]
  };
  return {
    path: '/',
    title: 'IBC lekbak, flexibele tanks & opvangbakken | EnviroFlow',
    description: 'EnviroFlow levert flexibele opvangbakken, brandwater-, brandstof-, drinkwater- en mesttanks en mobiele waterkeringen voor bedrijven. Persoonlijk advies en maatwerk.',
    body, jsonld: [org], bodyClass: 'page-home'
  };
}

export function stepsList() {
  const steps = [
    ['U vertelt uw situatie', 'Welke vloeistof, hoeveel, waar en hoe lang. Een foto helpt.', 'chat'],
    ['Wij denken mee', 'Wij kijken welke oplossing past en waar u op moet letten.', 'compass'],
    ['U ontvangt een voorstel', 'Een concreet voorstel met product, uitvoering en prijs.', 'clipboard'],
    ['Wij leveren', 'Wij stemmen de levering af op uw locatie en planning.', 'truck']
  ];
  return `<ol class="steps">${steps.map(([h, p, ic], i) => `<li class="step"><span class="step__num">${i + 1}</span>${icon(ic, 'step__icon')}<h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>`;
}

/* ================================================================ LISTINGS */
const FILTERS = [
  { key: 'category', label: 'Categorie', type: 'check' },
  { key: 'capacity', label: 'Capaciteit (liter)', type: 'range' },
  { key: 'dimensions', label: 'Afmetingen', type: 'check' },
  { key: 'ibc', label: "Aantal IBC's", type: 'check' },
  { key: 'drums', label: 'Aantal vaten', type: 'check' },
  { key: 'material', label: 'Materiaal', type: 'check' },
  { key: 'application', label: 'Toepassing', type: 'check' },
  { key: 'liquid', label: 'Vloeistoftype', type: 'check' },
  { key: 'location', label: 'Binnen / buiten', type: 'check' },
  { key: 'duration', label: 'Tijdelijk / permanent', type: 'check' },
  { key: 'orderable', label: 'Bestelwijze', type: 'check' },
  { key: 'price', label: 'Prijs (excl. btw)', type: 'range' }
];

function filterValues(p, key, ctx) {
  const a = p.attributes || {};
  switch (key) {
    case 'category': return [[p.category, ctx.categoryById[p.category].name]];
    case 'ibc': return a.ibcCount ? [[String(a.ibcCount), `${a.ibcCount} IBC${a.ibcCount > 1 ? "'s" : ''}`]] : [];
    case 'drums': return a.drumCount ? [[String(a.drumCount), `${a.drumCount} vaten`]] : [];
    case 'dimensions': return a.dimensions ? [[a.dimensions, a.dimensions]] : [];
    case 'material': return a.material ? [[a.material, a.material]] : [];
    case 'application': return (a.application || []).map((v) => [v, v]);
    case 'liquid': return (a.liquids || []).map((v) => [v, v]);
    case 'location': return a.location ? [[a.location, a.location]] : [];
    case 'duration': return a.duration ? [[a.duration, a.duration]] : [];
    case 'orderable': return isOrderable(p) ? [['online', 'Online bestelbaar']] : [['aanvraag', 'Op aanvraag']];
    case 'capacity': return a.capacityL ? [[a.capacityL]] : [];
    case 'price': return hasRealPrice(p) && !p.quoteOnly ? [[p.price]] : [];
    default: return [];
  }
}

/** Bouwt filters dynamisch op: een filter verschijnt zodra er minimaal twee verschillende waarden in de data staan. */
function filterPanel(list, ctx) {
  const groups = FILTERS.map((f) => {
    const map = new Map();
    list.forEach((p) => filterValues(p, f.key, ctx).forEach(([v, l]) => map.set(String(v), l ?? v)));
    if (map.size < 2) return '';
    if (f.type === 'range') {
      const nums = [...map.keys()].map(Number);
      return `<fieldset class="filter" data-filter-range="${f.key}"><legend>${f.label}</legend><div class="filter__range">
        <label><span class="sr-only">${f.label} minimaal</span><input type="number" inputmode="numeric" placeholder="${Math.min(...nums)}" data-min></label><span aria-hidden="true">–</span>
        <label><span class="sr-only">${f.label} maximaal</span><input type="number" inputmode="numeric" placeholder="${Math.max(...nums)}" data-max></label></div></fieldset>`;
    }
    const opts = [...map.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]), 'nl', { numeric: true }));
    return `<fieldset class="filter" data-filter="${f.key}"><legend>${f.label}</legend>${opts.map(([v, l], i) => `<label class="check"><input type="checkbox" value="${esc(v)}" id="flt-${f.key}-${i}"><span>${esc(l)}</span></label>`).join('')}</fieldset>`;
  }).join('');
  return groups;
}

export function listingSection(list, ctx, { title = 'Producten' } = {}) {
  const filters = filterPanel(list, ctx);
  return `<section class="section listing" aria-labelledby="h-listing" data-listing>
  <div class="container listing__inner ${filters ? '' : 'listing__inner--nofilters'}">
    ${filters ? `<aside class="filters" aria-label="Filters">
      <button class="btn btn--ghost btn--sm filters__toggle" type="button" aria-expanded="false" aria-controls="filters-body" data-filters-toggle>${icon('filter')}Filters</button>
      <form id="filters-body" class="filters__body" data-filters>
        <div class="filters__head"><h2 class="filters__title">Filters</h2><button type="reset" class="linklike">Wis filters</button></div>
        ${filters}
      </form>
    </aside>` : ''}
    <div class="listing__main">
      <div class="listing__bar">
        <h2 id="h-listing" class="listing__title">${esc(title)} <span class="listing__count" data-count>(${list.length})</span></h2>
        <label class="listing__sort"><span>Sorteren</span><select data-sort><option value="default">Relevantie</option><option value="name">Naam (A–Z)</option><option value="price-asc">Prijs oplopend</option><option value="price-desc">Prijs aflopend</option></select></label>
      </div>
      <div class="product-grid product-grid--3" data-grid>${list.map((p) => productCard(p, ctx)).join('')}</div>
      <p class="listing__empty" data-empty hidden>Geen producten gevonden met deze filters. <a href="/offerte-aanvragen/?type=advies">Vraag advies aan</a>, dan zoeken wij met u mee.</p>
    </div>
  </div>
</section>`;
}

export function productsOverview(ctx) {
  const { groups, categories, urls } = ctx;
  const body = `
<section class="page-head"><div class="container"><h1>Producten</h1><p class="lead">Flexibele oplossingen voor het opvangen, opslaan en verplaatsen van vloeistoffen, en voor bescherming tegen water. Online te bestellen of op aanvraag.</p></div></section>
${groups.map((g) => `<section class="section section--tight" aria-labelledby="h-${g.slug}"><div class="container">
  <div class="section-head section-head--row"><h2 id="h-${g.slug}">${esc(g.name)}</h2><a class="link-arrow" href="${urls.group(g)}">Alle ${esc(g.name.toLowerCase())} ${icon('arrow')}</a></div>
  <div class="cat-grid">${categories.filter((c) => c.group === g.id).map((c) => categoryCard(c, ctx)).join('')}</div>
</div></section>`).join('')}
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  return { path: '/producten/', title: 'Producten: opvangbakken, flexibele tanks en waterkeringen | EnviroFlow', description: 'Bekijk het assortiment van EnviroFlow: flexibele opvangbakken, wasmatten, brandwater-, drinkwater-, brandstof- en mesttanks, mobiele waterkeringen en maatwerk.', body, crumbs: [{ name: 'Home', url: '/' }, { name: 'Producten', url: '/producten/' }] };
}

export function groupPage(g, ctx) {
  const { categories, products, urls } = ctx;
  const cats = categories.filter((c) => c.group === g.id);
  const list = products.filter((p) => cats.some((c) => c.id === p.category));
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><h1>${esc(g.name)}</h1><p class="lead">${esc(g.short)}</p></div>${media({ alt: g.image }, '16-9')}</div></section>
<section class="section section--tight"><div class="container"><h2 class="subhead">Categorieën</h2><div class="cat-grid cat-grid--compact">${cats.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div></div></section>
${listingSection(list, ctx, { title: `Alle producten in ${g.name.toLowerCase()}` })}
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  return { path: urls.group(g), title: `${g.name} | EnviroFlow`, description: `${g.short} Bekijk de mogelijkheden of vraag advies aan bij EnviroFlow.`, body, crumbs: [{ name: 'Home', url: '/' }, { name: 'Producten', url: '/producten/' }, { name: g.name, url: urls.group(g) }], scripts: ['/assets/js/listing.js'] };
}

export function categoryPage(c, ctx) {
  const { products, groupById, urls, site } = ctx;
  const g = groupById[c.group];
  const list = products.filter((p) => p.category === c.id);
  const faq = faqBlock(c.faq);
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Producten', url: '/producten/' }, { name: g.name, url: urls.group(g) }, { name: c.name, url: urls.category(c) }];
  const head = `<section class="page-head"><div class="container page-head__grid"><div>
    <p class="eyebrow">${esc(g.name)}</p><h1>${esc(c.name)}</h1>
    ${c.intro.map((p, i) => `<p class="${i === 0 ? 'lead' : ''}">${esc(p)}</p>`).join('')}
    <div class="btn-row"><a class="btn btn--primary" href="#h-listing">Bekijk producten</a><a class="btn btn--ghost" href="/offerte-aanvragen/?type=advies&amp;categorie=${c.id}">Advies aanvragen</a></div>
  </div>${media({ alt: c.image }, '4-3', true)}</div></section>
  ${c.applications?.length ? `<section class="section section--tight section--grey" aria-labelledby="h-toep"><div class="container"><h2 id="h-toep" class="subhead">Toepassingen</h2><ul class="check-list check-list--cols">${c.applications.map((a) => `<li>${icon('check')}${esc(a)}</li>`).join('')}</ul></div></section>` : ''}`;

  let main;
  if (c.isCustom) {
    main = `<section class="section"><div class="container split split--form"><div>${customForm(ctx)}</div><div>${adviceBlock(site, { title: 'Liever eerst overleggen?', text: 'Bel of mail ons met uw situatie. Wij denken graag met u mee.' })}</div></div></section>`;
  } else {
    main = `${listingSection(list, ctx, { title: `${c.name}` })}
    <section class="section section--tight"><div class="container"><div class="custom-hint">${icon('ruler')}<div><h2>Geen passende maat of uitvoering?</h2><p>Wij bekijken wat er op maat mogelijk is.</p></div><a class="btn btn--ghost" href="/maatwerk-aanvragen/">Vraag maatwerk aan</a></div></div></section>`;
  }
  const body = `${head}${main}${faq.html}<div class="container section--tight">${adviceBlock(site)}</div>`;
  return { path: urls.category(c), title: c.seoTitle || `${c.name} | EnviroFlow`, description: c.seoDescription || c.short, body, crumbs, jsonld: faq.ld ? [faq.ld] : [], scripts: c.isCustom ? ['/assets/js/forms.js'] : ['/assets/js/listing.js'] };
}

/* ================================================================ PRODUCT */
const SPEC_LABELS = [
  ['afmetingen', 'Afmetingen'], ['capaciteit', 'Capaciteit'], ['materiaal', 'Materiaal'], ['gewicht', 'Gewicht'],
  ['aansluitingen', 'Aansluitingen'], ['temperatuurbereik', 'Temperatuurbereik'], ['chemischeBestendigheid', 'Chemische bestendigheid'],
  ['garantie', 'Garantie'], ['certificering', 'Certificering']
];

export function productPage(p, ctx) {
  const { t, site, urls, categoryById, groupById, products, brandById } = ctx;
  const c = categoryById[p.category];
  const g = groupById[c.group];
  const brand = brandById[p.brand];
  const orderable = isOrderable(p);
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Producten', url: '/producten/' }, { name: g.name, url: urls.group(g) }, { name: c.name, url: urls.category(c) }, { name: p.name, url: urls.product(p) }];
  const related = (p.related || []).map((id) => products.find((x) => x.id === id)).filter(Boolean)
    .concat(products.filter((x) => x.category === p.category && x.id !== p.id)).filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 3);
  const images = p.images?.length ? p.images : [{ alt: `Foto: ${p.name}` }];
  const unknown = `<span class="muted">${t.specsUnknown}</span>`;

  const body = `
<section class="product-top">
  <div class="container product-top__grid">
    <div class="gallery" data-gallery>
      <div class="gallery__main" data-gallery-main>${media(images[0], '4-3', true)}</div>
      ${images.length > 1 ? `<ul class="gallery__thumbs">${images.map((im, i) => `<li><button type="button" aria-label="Toon afbeelding ${i + 1}: ${esc(im.alt)}" data-gallery-thumb="${i}" ${i === 0 ? 'aria-current="true"' : ''}>${media(im, '1-1')}</button></li>`).join('')}</ul>` : ''}
      <template data-gallery-items>${images.map((im) => media(im, '4-3')).join('')}</template>
    </div>
    <div class="buybox">
      <p class="buybox__brand">Fabrikant: <a href="/partners/${brand.slug}/">${esc(brand.name)}</a>${p.line ? ` · Productlijn ${esc(p.line)}` : ''}</p>
      <h1>${esc(p.name)}</h1>
      <p class="buybox__short">${esc(p.short)}</p>
      ${priceBlock(p, t, 'price--lg')}
      <ul class="buybox__meta">
        <li>${icon('truck')}${p.leadTime ? esc(p.leadTime) : t.leadTimeOnRequest}</li>
        ${p.stock ? `<li>${icon('check')}${esc(p.stock)}</li>` : ''}
        ${p.sku ? `<li>Artikelnummer: ${esc(p.sku)}</li>` : ''}
      </ul>
      ${orderable ? `<form class="buybox__cart" data-add-form="${esc(p.id)}">
        <label for="qty">Aantal</label>
        <div class="qty"><button type="button" data-qty-step="-1" aria-label="Aantal verlagen">−</button><input id="qty" name="qty" type="number" min="1" max="999" value="1" inputmode="numeric"><button type="button" data-qty-step="1" aria-label="Aantal verhogen">+</button></div>
        <button class="btn btn--primary btn--lg" type="submit">${icon('cart')}${t.addToCart}</button>
      </form>` : ''}
      <a class="btn ${orderable ? 'btn--ghost' : 'btn--primary btn--lg'} btn--block" href="/offerte-aanvragen/?product=${encodeURIComponent(p.id)}">Offerte aanvragen</a>
      ${orderable ? `<p class="buybox__tip">${icon('info')}${t.cartTip}</p>` : `<p class="buybox__tip">${icon('info')}Dit product leveren wij op aanvraag. U ontvangt een voorstel op basis van uw situatie.</p>`}
      <div class="buybox__help">${icon('phone')}<div><strong>Vragen over dit product?</strong><br><a href="tel:${site.phonePrimary.tel}">${site.phonePrimary.display}</a> of <a href="tel:${site.phoneSecondary.tel}">${site.phoneSecondary.display}</a></div></div>
    </div>
  </div>
</section>

<nav class="subnav" aria-label="Op deze pagina"><div class="container"><ul>
  <li><a href="#toepassing">Toepassing</a></li><li><a href="#voordelen">Voordelen</a></li><li><a href="#specificaties">Specificaties</a></li><li><a href="#geschikt">Geschikt voor</a></li><li><a href="#downloads">Downloads</a></li>
</ul></div></nav>

<section class="section section--tight"><div class="container product-detail">
  <div class="product-detail__main">
    <section id="toepassing" class="pd-block"><h2>Waarvoor is dit product?</h2>${p.purpose.map((x) => `<p>${esc(x)}</p>`).join('')}</section>
    <section id="voordelen" class="pd-block"><h2>Belangrijkste voordelen</h2><ul class="check-list">${p.benefits.slice(0, 4).map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul></section>
    <section id="specificaties" class="pd-block"><h2>Specificaties</h2>
      <table class="spec-table"><caption class="sr-only">Specificaties ${esc(p.name)}</caption><tbody>
        <tr><th scope="row">Fabrikant</th><td>${esc(brand.name)}</td></tr>
        ${SPEC_LABELS.map(([k, l]) => `<tr><th scope="row">${l}</th><td>${p.specs?.[k] ? esc(p.specs[k]) : unknown}</td></tr>`).join('')}
        <tr><th scope="row">Geschikte vloeistoffen</th><td>${p.liquids?.length ? esc(p.liquids.join(', ')) : `<span class="muted">${t.liquidCheck}</span>`}</td></tr>
      </tbody></table>
    </section>
    <section id="geschikt" class="pd-block"><h2>Geschikt voor</h2><ul class="check-list">${p.suitableFor.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul></section>
    <section id="downloads" class="pd-block"><h2>Downloads</h2>
      ${p.datasheet ? `<a class="download" href="${esc(p.datasheet)}" download>${icon('download')}<span>Datasheet ${esc(p.name)} (PDF)</span></a>` : `<p class="muted">Datasheet op aanvraag. <a href="mailto:${site.email}?subject=${encodeURIComponent(`Datasheet ${p.name}`)}">Vraag de datasheet aan</a>.</p>`}
    </section>
    <div class="notice">${icon('info')}<p>${t.requirementsNote}</p></div>
  </div>
</div></section>

${related.length ? `<section class="section section--grey" aria-labelledby="h-related"><div class="container"><h2 id="h-related">Gerelateerde producten</h2><div class="product-grid product-grid--3">${related.map((r) => productCard(r, ctx)).join('')}</div></div></section>` : ''}
<div class="container section--tight">${adviceBlock(site, { title: 'Hulp nodig bij uw keuze?', text: 'Wij controleren of dit product past bij uw vloeistof, hoeveelheid en locatie.' })}</div>`;

  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.short, category: c.name,
    url: site.baseUrl + urls.product(p),
    brand: { '@type': 'Brand', name: brand.name }, manufacturer: { '@type': 'Organization', name: brand.name }
  };
  if (p.sku) ld.sku = p.sku;
  const realImages = images.filter((i) => i.src).map((i) => site.baseUrl + i.src);
  if (realImages.length) ld.image = realImages;
  if (hasRealPrice(p) && !p.quoteOnly) {
    ld.offers = {
      '@type': 'Offer', url: site.baseUrl + urls.product(p), priceCurrency: 'EUR', price: p.price.toFixed(2),
      priceSpecification: { '@type': 'UnitPriceSpecification', price: p.price.toFixed(2), priceCurrency: 'EUR', valueAddedTaxIncluded: false },
      seller: { '@type': 'Organization', name: 'EnviroFlow' }
    };
  }
  return { path: urls.product(p), title: `${p.name} | ${brand.name} | EnviroFlow`, description: `${p.short} ${orderable ? 'Online te bestellen of' : 'Prijs op aanvraag.'} Vraag een offerte aan bij EnviroFlow.`.replace(/\s+/g, ' '), body, crumbs, jsonld: [ld], scripts: ['/assets/js/product.js'] };
}

/* ================================================================ CART & CHECKOUT */
export function cartPage(ctx) {
  const { t } = ctx;
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>Winkelwagen</h1></div></section>
<section class="section section--tight"><div class="container cart" data-cart-page>
  <div class="cart__main">
    <div data-cart-items><noscript><p>Schakel JavaScript in om uw winkelwagen te bekijken, of <a href="/offerte-aanvragen/">vraag een offerte aan</a>.</p></noscript></div>
    <div class="cart__tip">${icon('info')}<p>${t.cartTip} <a href="/offerte-aanvragen/?bron=winkelwagen" data-cart-to-quote>Vraag een offerte aan</a></p></div>
  </div>
  <aside class="cart__summary" aria-labelledby="h-summary">
    <h2 id="h-summary">Overzicht</h2>
    <div data-cart-summary></div>
    <a class="btn btn--primary btn--block btn--lg" href="/afrekenen/" data-checkout-link>Verder naar afrekenen</a>
    <a class="btn btn--ghost btn--block" href="/offerte-aanvragen/?bron=winkelwagen" data-cart-to-quote>Offerte aanvragen voor deze producten</a>
    <p class="small muted">Alle prijzen zijn exclusief btw, tenzij anders aangegeven.</p>
  </aside>
</div></section>`;
  return { path: '/winkelwagen/', title: 'Winkelwagen | EnviroFlow', description: 'Uw winkelwagen bij EnviroFlow.', body, noindex: true, crumbs: [{ name: 'Home', url: '/' }, { name: 'Winkelwagen', url: '/winkelwagen/' }], scripts: ['/assets/js/cart.js'] };
}

export function checkoutPage(ctx) {
  const { site } = ctx;
  const countries = [['NL', 'Nederland']];
  const addr = (prefix, required) => `
    ${field({ name: `${prefix}_street`, label: 'Straat en huisnummer', required, autocomplete: `${prefix === 'delivery' ? 'shipping' : 'billing'} street-address`, full: true })}
    ${field({ name: `${prefix}_postcode`, label: 'Postcode', required, autocomplete: `${prefix === 'delivery' ? 'shipping' : 'billing'} postal-code` })}
    ${field({ name: `${prefix}_city`, label: 'Plaats', required, autocomplete: `${prefix === 'delivery' ? 'shipping' : 'billing'} address-level2` })}
    ${field({ name: `${prefix}_country`, label: 'Land', type: 'select', options: countries, required, value: 'NL' })}`;
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>Afrekenen</h1><ol class="checkout-steps" aria-label="Stappen"><li>Winkelwagen</li><li aria-current="step">Gegevens &amp; betaling</li><li>Bevestiging</li></ol></div></section>
<section class="section section--tight"><div class="container checkout">
  <form class="checkout__form form" action="/api/order" method="post" data-checkout-form novalidate>
    ${honeypot()}
    <fieldset class="form-section"><legend>Bedrijfsgegevens</legend><div class="form-grid">
      ${field({ name: 'company', label: 'Bedrijfsnaam', required: true, autocomplete: 'organization' })}
      ${field({ name: 'vat_number', label: 'Btw-nummer', autocomplete: 'off', hint: 'Bijvoorbeeld NL123456789B01' })}
      ${field({ name: 'name', label: 'Contactpersoon', required: true, autocomplete: 'name' })}
      ${field({ name: 'reference', label: 'Uw referentie / inkoopordernummer' })}
      ${field({ name: 'email', label: 'E-mailadres', type: 'email', required: true, autocomplete: 'email' })}
      ${field({ name: 'phone', label: 'Telefoonnummer', type: 'tel', required: true, autocomplete: 'tel' })}
    </div></fieldset>
    <fieldset class="form-section"><legend>Afleveradres</legend><div class="form-grid">${addr('delivery', true)}</div></fieldset>
    <fieldset class="form-section"><legend>Factuuradres</legend>
      <label class="check"><input type="checkbox" name="billing_same" value="1" checked data-billing-same><span>Factuuradres is gelijk aan afleveradres</span></label>
      <div class="form-grid" data-billing-fields hidden>${addr('billing', false)}</div>
    </fieldset>
    <fieldset class="form-section"><legend>Levering</legend>
      ${field({ name: 'remarks', label: 'Opmerkingen voor de levering', type: 'textarea', hint: 'Bijvoorbeeld lostijden, bereikbaarheid voor een vrachtwagen, laadperron of heftruck aanwezig.', full: true })}
    </fieldset>
    <fieldset class="form-section"><legend>Betaalmethode</legend>
      <div class="pay-methods">${site.paymentMethods.map((m, i) => `<label class="pay-method"><input type="radio" name="payment_method" value="${m.id}" ${i === 0 ? 'checked' : ''} required><span>${esc(m.label)}</span></label>`).join('')}</div>
    </fieldset>
    <div class="form-section">
      <label class="check"><input type="checkbox" name="terms" value="1" required><span>Ik ga akkoord met de <a href="/algemene-voorwaarden/" target="_blank" rel="noopener">algemene voorwaarden</a> en heb het <a href="/privacybeleid/" target="_blank" rel="noopener">privacybeleid</a> gelezen. <span class="req" aria-hidden="true">*</span></span></label>
    </div>
    <input type="hidden" name="items" data-items-field>
    ${formStatus()}
    <button class="btn btn--primary btn--lg" type="submit" data-submit>Bestelling plaatsen en betalen</button>
    <p class="small muted">U wordt doorgestuurd naar een beveiligde betaalpagina.</p>
  </form>
  <aside class="checkout__summary" aria-labelledby="h-order">
    <h2 id="h-order">Uw bestelling</h2>
    <div data-checkout-summary></div>
    <a class="small" href="/winkelwagen/">Winkelwagen aanpassen</a>
  </aside>
</div></section>`;
  return { path: '/afrekenen/', title: 'Afrekenen | EnviroFlow', description: 'Rond uw bestelling bij EnviroFlow af.', body, noindex: true, crumbs: [{ name: 'Home', url: '/' }, { name: 'Winkelwagen', url: '/winkelwagen/' }, { name: 'Afrekenen', url: '/afrekenen/' }], scripts: ['/assets/js/cart.js'] };
}

export function orderStatusPage() {
  const body = `<section class="section"><div class="container container--narrow" data-order-status>
  <h1>Uw bestelling</h1>
  <p data-order-message>Wij controleren de status van uw betaling…</p>
  <div class="btn-row"><a class="btn btn--ghost" href="/">Naar de homepage</a><a class="btn btn--ghost" href="/contact/">Contact</a></div>
</div></section>`;
  return { path: '/bestelling/', title: 'Bestelling | EnviroFlow', description: 'Status van uw bestelling bij EnviroFlow.', body, noindex: true, scripts: ['/assets/js/cart.js'] };
}

/* ================================================================ FORMULIEREN */
function contactFields() {
  return `${field({ name: 'company', label: 'Bedrijfsnaam', required: true, autocomplete: 'organization' })}
  ${field({ name: 'name', label: 'Naam', required: true, autocomplete: 'name' })}
  ${field({ name: 'email', label: 'E-mailadres', type: 'email', required: true, autocomplete: 'email' })}
  ${field({ name: 'phone', label: 'Telefoonnummer', type: 'tel', required: true, autocomplete: 'tel' })}`;
}

const uploadField = (label = 'Bestanden of foto\'s') => field({ name: 'files', label, type: 'file', accept: '.jpg,.jpeg,.png,.webp,.heic,.pdf', multiple: true, hint: 'Maximaal 10 bestanden van elk 10 MB (jpg, png, webp, heic of pdf).', full: true });

const privacyCheck = () => `<label class="check"><input type="checkbox" name="privacy" value="1" required><span>Ik ga akkoord dat EnviroFlow mijn gegevens gebruikt om contact met mij op te nemen over deze aanvraag (zie <a href="/privacybeleid/">privacybeleid</a>). <span class="req" aria-hidden="true">*</span></span></label>`;

export function quoteForm(ctx) {
  const { products } = ctx;
  return `<form class="form" action="/api/quote" method="post" enctype="multipart/form-data" data-form="quote" novalidate>
  ${honeypot()}
  <fieldset class="form-section"><legend>Soort aanvraag</legend>
    <div class="radio-row"><label class="check"><input type="radio" name="request_type" value="offerte" checked><span>Offerte</span></label><label class="check"><input type="radio" name="request_type" value="advies"><span>Advies</span></label></div>
  </fieldset>
  <fieldset class="form-section"><legend>Uw gegevens</legend><div class="form-grid">${contactFields()}</div></fieldset>
  <fieldset class="form-section"><legend>Uw aanvraag</legend><div class="form-grid">
    ${field({ name: 'product', label: 'Product', type: 'select', options: [['', 'Kies een product (optioneel)'], ...products.map((p) => [p.id, p.name]), ['anders', 'Anders / weet ik nog niet']] })}
    ${field({ name: 'quantity', label: 'Aantal', type: 'number', attrs: 'min="1" inputmode="numeric"' })}
    ${field({ name: 'liquid', label: 'Type vloeistof', hint: 'Bijvoorbeeld diesel, bluswater, drijfmest of een chemische stof' })}
    ${field({ name: 'application', label: 'Toepassing' })}
    ${field({ name: 'delivery_date', label: 'Gewenste leverdatum', type: 'date' })}
    ${field({ name: 'remarks', label: 'Opmerkingen', type: 'textarea', rows: 5, full: true, hint: 'Vertel zo veel mogelijk over uw situatie: locatie, afmetingen, binnen of buiten, tijdelijk of permanent.' })}
    ${uploadField()}
  </div></fieldset>
  <input type="hidden" name="source" value="">
  ${privacyCheck()}
  ${formStatus()}
  <button class="btn btn--primary btn--lg" type="submit" data-submit>Aanvraag versturen</button>
</form>`;
}

export function customForm() {
  return `<form class="form" action="/api/custom" method="post" enctype="multipart/form-data" data-form="custom" novalidate>
  ${honeypot()}
  <h2 class="form-title">Maatwerk aanvragen</h2>
  <fieldset class="form-section"><legend>Uw gegevens</legend><div class="form-grid">${contactFields()}</div></fieldset>
  <fieldset class="form-section"><legend>Uw situatie</legend><div class="form-grid">
    ${field({ name: 'liquid', label: 'Type vloeistof' })}
    ${field({ name: 'volume', label: 'Volume', hint: "Bijvoorbeeld 2 IBC's, 5.000 liter of 50 m³" })}
    ${field({ name: 'dimensions', label: 'Afmetingen (beschikbare ruimte)', hint: 'Lengte × breedte × hoogte in meters' })}
    ${field({ name: 'application', label: 'Toepassing' })}
    ${field({ name: 'location', label: 'Locatie', type: 'select', options: [['', 'Maak een keuze'], 'Binnen', 'Buiten', 'Binnen en buiten', 'Weet ik nog niet'] })}
    ${field({ name: 'duration', label: 'Tijdelijk of permanent', type: 'select', options: [['', 'Maak een keuze'], 'Tijdelijk', 'Permanent', 'Weet ik nog niet'] })}
    ${field({ name: 'wish', label: 'Gewenste oplossing', type: 'textarea', rows: 5, full: true, hint: 'Beschrijf wat u nodig heeft. Een schets of foto helpt.' })}
    ${uploadField("Foto's of tekeningen")}
  </div></fieldset>
  ${privacyCheck()}
  ${formStatus()}
  <button class="btn btn--primary btn--lg" type="submit" data-submit>Maatwerkaanvraag versturen</button>
</form>`;
}

function formAside(site) {
  return `<aside class="form-aside">
  <div class="card"><h2>Wat gebeurt er na uw aanvraag?</h2>${stepsMini()}</div>
  <div class="card"><h2>Liever direct contact?</h2>
    <p><a href="tel:${site.phonePrimary.tel}">${icon('phone')} ${site.phonePrimary.display}</a><br><a href="tel:${site.phoneSecondary.tel}">${icon('phone')} ${site.phoneSecondary.display}</a><br><a href="mailto:${site.email}">${icon('mail')} ${site.email}</a></p>
  </div>
</aside>`;
}
const stepsMini = () => `<ol class="steps-mini"><li>Wij bekijken uw aanvraag.</li><li>Wij nemen contact op om uw situatie te bespreken.</li><li>U ontvangt een voorstel.</li></ol>`;

export function quotePage(ctx) {
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1 data-quote-title>Offerte of advies aanvragen</h1><p class="lead">Vertel ons wat u nodig heeft. Wij denken mee en sturen u een passend voorstel.</p><div class="prefill-note" data-prefill-note hidden></div></div></section>
<section class="section section--tight"><div class="container split split--form">${quoteForm(ctx)}${formAside(ctx.site)}</div></section>`;
  return { path: '/offerte-aanvragen/', title: 'Offerte aanvragen | EnviroFlow', description: 'Vraag een offerte of advies aan voor flexibele opvangbakken, tanks, waterkeringen of maatwerk. EnviroFlow denkt mee en stuurt een passend voorstel.', body, crumbs: [{ name: 'Home', url: '/' }, { name: 'Offerte aanvragen', url: '/offerte-aanvragen/' }], scripts: ['/assets/js/forms.js'] };
}

export function customPage(ctx) {
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>Maatwerk aanvragen</h1><p class="lead">Staat uw oplossing er niet tussen? Beschrijf uw situatie. Wij bekijken samen met de fabrikant wat mogelijk is.</p></div></section>
<section class="section section--tight"><div class="container split split--form">${customForm(ctx)}${formAside(ctx.site)}</div></section>`;
  return { path: '/maatwerk-aanvragen/', title: 'Maatwerk aanvragen | EnviroFlow', description: 'Opvangbak, tank, mat of hoes op maat nodig? Beschrijf uw situatie en ontvang een voorstel van EnviroFlow.', body, crumbs: [{ name: 'Home', url: '/' }, { name: 'Maatwerk aanvragen', url: '/maatwerk-aanvragen/' }], scripts: ['/assets/js/forms.js'] };
}

export function thanksPage(ctx) {
  const body = `<section class="section"><div class="container container--narrow thanks">${icon('check', 'thanks__icon')}<h1>Bedankt voor uw aanvraag</h1><p class="lead">${ctx.t.formThanks}</p><div class="btn-row"><a class="btn btn--primary" href="/producten/">Verder kijken</a><a class="btn btn--ghost" href="/">Naar de homepage</a></div></div></section>`;
  return { path: '/bedankt/', title: 'Bedankt | EnviroFlow', description: 'Bedankt voor uw aanvraag bij EnviroFlow.', body, noindex: true };
}

/* ================================================================ KEUZEHULP */
export function keuzehulpPage(ctx) {
  const { categories, urls, products } = ctx;
  const catData = categories.map((c) => ({ id: c.id, name: c.name, short: c.short, url: urls.category(c) }));
  const prodData = products.filter(isOrderable).map((p) => ({ id: p.id, name: p.name, url: urls.product(p), category: p.category, ibc: p.attributes?.ibcCount || null }));
  const radio = (name, opts) => `<div class="choice-grid">${opts.map(([v, l]) => `<label class="choice"><input type="radio" name="${name}" value="${v}" required><span>${l}</span></label>`).join('')}</div>`;
  const steps = [
    ['doel', 'Wat wilt u doen?', radio('doel', [['opvangen', 'Vloeistof opvangen (lekkages, morsingen)'], ['opslaan', 'Vloeistof opslaan'], ['beschermen', 'Beschermen tegen water'], ['anders', 'Iets anders']])],
    ['vloeistof', 'Om welke vloeistof gaat het?', radio('vloeistof', [['olie-chemicalien', 'Olie of chemicaliën'], ['brandstof', 'Brandstof'], ['drinkwater', 'Drinkwater'], ['bluswater', 'Bluswater'], ['proceswater', 'Proces- of regenwater'], ['afvalwater', 'Afvalwater'], ['mest', 'Mest'], ['uan', 'UAN / vloeibare meststof'], ['anders', 'Anders']])],
    ['hoeveelheid', 'Om hoeveel gaat het?', `<div class="form-grid form-grid--tight"><div class="field"><label for="kh-aantal">Hoeveelheid</label><input id="kh-aantal" name="aantal" type="number" min="0" step="any" inputmode="decimal"></div><div class="field"><label for="kh-eenheid">Eenheid</label><select id="kh-eenheid" name="eenheid"><option value="IBC's">IBC's</option><option value="vaten">Vaten</option><option value="liter">Liter</option><option value="m³">m³</option></select></div></div><p class="field__hint">Weet u het niet precies? Een schatting is voldoende, of laat het veld leeg.</p>`],
    ['locatie', 'Staat de oplossing binnen of buiten?', radio('locatie', [['binnen', 'Binnen'], ['buiten', 'Buiten'], ['beide', 'Beide / wisselend'], ['onbekend', 'Weet ik nog niet']])],
    ['duur', 'Tijdelijk of permanent? Vast of mobiel?', `<p class="choice-label" id="kh-duur-l">Duur</p>${radio('duur', [['tijdelijk', 'Tijdelijk'], ['permanent', 'Permanent'], ['onbekend', 'Weet ik nog niet']])}<p class="choice-label">Plaatsing</p><div class="choice-grid">${[['vast', 'Vaste plek'], ['mobiel', 'Mobiel / verplaatsbaar'], ['onbekend', 'Weet ik nog niet']].map(([v, l]) => `<label class="choice"><input type="radio" name="mobiliteit" value="${v}"><span>${l}</span></label>`).join('')}</div>`],
    ['ruimte', 'Hoeveel ruimte is er beschikbaar?', `<div class="form-grid form-grid--tight"><div class="field"><label for="kh-l">Lengte (m)</label><input id="kh-l" name="lengte" type="number" min="0" step="any" inputmode="decimal"></div><div class="field"><label for="kh-b">Breedte (m)</label><input id="kh-b" name="breedte" type="number" min="0" step="any" inputmode="decimal"></div><div class="field"><label for="kh-h">Hoogte (m)</label><input id="kh-h" name="hoogte" type="number" min="0" step="any" inputmode="decimal"></div></div><p class="field__hint">Optioneel. Laat leeg als u het niet weet.</p>`]
  ];
  const body = `
<section class="page-head page-head--slim"><div class="container container--narrow"><h1>Welke oplossing heb ik nodig?</h1><p class="lead">Beantwoord zes korte vragen. U ziet direct welke oplossingen geschikt kunnen zijn.</p></div></section>
<section class="section section--tight"><div class="container container--narrow">
  <form class="wizard" action="/offerte-aanvragen/" method="get" data-wizard novalidate>
    <input type="hidden" name="bron" value="keuzehulp">
    <div class="wizard__progress" aria-hidden="true"><div class="wizard__bar" data-wizard-bar></div></div>
    <p class="wizard__count" data-wizard-count aria-live="polite">Vraag 1 van ${steps.length}</p>
    ${steps.map(([key, q, inner], i) => `<fieldset class="wizard__step" data-step="${key}" ${i ? 'data-hidden' : ''}><legend><h2 class="wizard__q" tabindex="-1">${q}</h2></legend>${inner}</fieldset>`).join('')}
    <div class="wizard__nav">
      <button class="btn btn--ghost" type="button" data-wizard-prev hidden>Vorige</button>
      <button class="btn btn--primary" type="button" data-wizard-next>Volgende ${icon('arrow')}</button>
      <noscript><button class="btn btn--primary" type="submit">Verstuur naar een specialist</button></noscript>
    </div>
    <p class="wizard__error" role="alert" data-wizard-error hidden>Maak een keuze om verder te gaan.</p>
  </form>
  <section class="wizard-result" data-wizard-result hidden aria-labelledby="h-result">
    <h2 id="h-result" tabindex="-1">Op basis van uw antwoorden kunnen deze oplossingen geschikt zijn</h2>
    <div data-result-summary class="result-summary"></div>
    <div class="cat-grid cat-grid--compact" data-result-cats></div>
    <div data-result-products></div>
    <div class="notice">${icon('info')}<p>Dit is een eerste indicatie. ${ctx.t.requirementsNote}</p></div>
    <div class="btn-row"><a class="btn btn--primary btn--lg" href="/offerte-aanvragen/?bron=keuzehulp" data-result-cta>Laat een specialist meekijken</a><button class="btn btn--ghost" type="button" data-wizard-restart>Opnieuw beginnen</button></div>
  </section>
</div></section>
<script type="application/json" id="kh-data">${JSON.stringify({ categories: catData, products: prodData }).replace(/</g, '\\u003c')}</script>`;
  return { path: '/keuzehulp/', title: 'Keuzehulp: welke oplossing heb ik nodig? | EnviroFlow', description: 'Beantwoord zes korte vragen over uw vloeistof, hoeveelheid en locatie en zie welke opvangbak, tank of waterkering geschikt kan zijn.', body, crumbs: [{ name: 'Home', url: '/' }, { name: 'Keuzehulp', url: '/keuzehulp/' }], scripts: ['/assets/js/keuzehulp.js'] };
}
