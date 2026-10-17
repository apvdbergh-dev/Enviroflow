// Home, productoverzichten, productpagina's, winkelwagen, checkout, formulieren en keuzehulp.
import { esc, ph, icon, fmtEUR, media, priceBlock, faqBlock, adviceBlock, ctaBand, productCard, categoryCard, field, honeypot, formStatus } from './ui.mjs';
import { isOrderable, hasRealPrice } from '../lib/catalog.mjs';
import { T, isEn, getLang, localPath } from '../lib/i18n.mjs';


/* ================================================================ HOME */
export function home(ctx) {
  const { site, groups, categories, products, solutions, sectors, urls, brandById } = ctx;
  const exflo = brandById.exflo;
  const featured = products.filter((p) => isOrderable(p) && p.featured).slice(0, 4);
  const popular = categories.filter((c) => c.popular).slice(0, 8);
  const minPrice = (catId) => Math.min(...products.filter((p) => p.category === catId && typeof p.price === 'number' && !p.quoteOnly).map((p) => p.price));
  const catUrl = (id) => urls.category(ctx.categoryById[id]);
  const slides = [
    { img: 'hero-opvang', group: T('Opvang & spill containment', 'Spill containment'), short: T('Opvangbakken', 'Spill trays'), title: T("Flexibele opvangbakken voor IBC's en vaten", 'Flexible spill trays for IBCs and drums'), text: T(`Van 226 tot 22.575 liter opvangcapaciteit, met 7 jaar fabrieksgarantie. Online te bestellen vanaf ${fmtEUR(minPrice('flexibele-opvangbakken'))} excl. btw.`, `From 226 to 22,575 litres of containment capacity, with a 7-year manufacturer's warranty. Order online from ${fmtEUR(minPrice('flexibele-opvangbakken'))} excl. VAT.`), cta: T('Bekijk opvangbakken', 'View spill trays'), href: catUrl('flexibele-opvangbakken') },
    { img: 'hero-brandwater', group: T('Flexibele tanks', 'Flexible tanks'), short: T('Brandwatertanks', 'Fire water tanks'), title: T('Brandwatertanks van 50 tot 300 m³', 'Fire water tanks from 50 to 300 m³'), text: T('EXFLO Waterbase F met verwarmingsmatten en isolatie, voor een bluswatervoorziening die ook in de winter werkt.', 'EXFLO Waterbase F with heating mats and insulation, for a fire water supply that also works in winter.'), cta: T('Bekijk de Waterbase F', 'View the Waterbase F'), href: urls.product(products.find((p) => p.id === 'exflo-waterbase-f')) },
    { img: 'hero-waterkering', group: T('Mobiel & calamiteiten', 'Mobile & emergency'), short: T('Waterkeringen', 'Flood barriers'), title: T('Mobiele waterkeringen tegen wateroverlast', 'Mobile flood barriers against flooding'), text: T('EXFLO Exflooder: sneller geplaatst dan een dijk van zandzakken. Hoogte na vullen tot 89 cm, gestapeld meer dan 140 cm.', 'EXFLO Exflooder: faster to install than a sandbag dike. Height after filling up to 89 cm, stacked more than 140 cm.'), cta: T('Bekijk waterkeringen', 'View flood barriers'), href: catUrl('mobiele-waterkeringen') },
    { img: 'hero-mest', group: T('Landbouw', 'Agriculture'), short: T('Mest & UAN', 'Manure & UAN'), title: T('Extra opslag voor mest en meststoffen', 'Extra storage for manure and fertilisers'), text: T('Mestzakken van 50 tot 300 m³ zonder bouwwerkzaamheden, met 10 jaar garantie op lekdichtheid.', 'Manure bags from 50 to 300 m³ without construction work, with a 10-year warranty on leak-tightness.'), cta: T('Bekijk mestzakken', 'View manure bags'), href: catUrl('mest-en-slurrytanks') }
  ];
  const catCount = (g) => categories.filter((c) => c.group === g.id).length;

  const body = `
<section class="hero hero--slider" aria-labelledby="h-hero" data-hero>
  <div class="hero__slides" aria-hidden="true">
    ${slides.map((sl, i) => `<div class="hero__slide${i === 0 ? ' is-active' : ''}" data-slide="${i}"><picture><source type="image/webp" srcset="/assets/img/hero/${sl.img}.webp"><img src="/assets/img/hero/${sl.img}.jpg" alt="" width="1600" height="900" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture></div>`).join('')}
  </div>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="container hero__inner">
    <div class="hero__content">
      <p class="kicker kicker--light hero__in" style="--d:0">${T('Zakelijke specialist in vloeistofopslag en opvang', 'Business specialist in liquid storage and containment')}</p>
      <h1 id="h-hero" class="hero__title">${T('<span class="line"><span style="--d:1">Veilige oplossingen</span></span> <span class="line"><span style="--d:2">voor vloeistofopslag</span></span> <span class="line"><span style="--d:3">en opvang</span></span>', '<span class="line"><span style="--d:1">Safe solutions</span></span> <span class="line"><span style="--d:2">for liquid storage</span></span> <span class="line"><span style="--d:3">and containment</span></span>')}</h1>
      <p class="hero__lead hero__in" style="--d:4">${T("Van flexibele lekbakken voor IBC's tot brandwater-, brandstof- en mesttanks. EnviroFlow helpt bedrijven vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen.", 'From flexible spill trays for IBCs to fire water, fuel and manure tanks. EnviroFlow helps businesses store, contain and move liquids safely and practically.')}</p>
      <div class="btn-row hero__in" style="--d:5"><a class="btn btn--accent btn--lg" href="/producten/">${T('Bekijk producten', 'View products')} ${icon('arrow')}</a><a class="btn btn--outline-light btn--lg" href="/offerte-aanvragen/?type=advies">${T('Vraag advies aan', 'Request advice')}</a></div>
      <p class="hero__phone hero__in" style="--d:6">${icon('phone')}<span>${T('Liever direct overleggen? Bel', 'Prefer to talk right away? Call')} <a href="tel:${site.phonePrimary.tel}">${site.phonePrimary.display}</a></span></p>
    </div>
    <div class="hero__captions hero__in" style="--d:7" role="region" aria-roledescription="${T('carrousel', 'carousel')}" aria-label="${T('Uitgelichte oplossingen', 'Featured solutions')}">
      ${slides.map((sl, i) => `<div class="hero__caption${i === 0 ? ' is-active' : ''}" role="group" aria-roledescription="${T('dia', 'slide')}" aria-label="${i + 1} ${T('van', 'of')} ${slides.length}: ${esc(sl.group)}" data-caption="${i}"${i === 0 ? '' : ' aria-hidden="true"'}>
        <span class="hero__caption-kicker"><span class="hero__caption-num">${String(i + 1).padStart(2, '0')}</span>${esc(sl.group)}</span>
        <p class="hero__caption-title">${esc(sl.title)}</p>
        <p class="hero__caption-text">${esc(sl.text)}</p>
        <a class="hero__caption-link" href="${sl.href}"${i === 0 ? '' : ' tabindex="-1"'}>${esc(sl.cta)} ${icon('arrow')}</a>
      </div>`).join('')}
    </div>
  </div>
  <div class="container hero__controls hero__in" style="--d:8">
    <ol class="hero__progress">
      ${slides.map((sl, i) => `<li><button type="button" data-goto="${i}" aria-label="${T('Toon dia', 'Show slide')} ${i + 1}: ${esc(sl.group)}"${i === 0 ? ' aria-current="true"' : ''}><span class="hero__progress-label"><span>${String(i + 1).padStart(2, '0')}</span> ${esc(sl.short)}</span><span class="hero__progress-bar"><i></i></span></button></li>`).join('')}
    </ol>
    <div class="hero__nav">
      <button type="button" class="hero__btn" data-prev aria-label="${T('Vorige dia', 'Previous slide')}">${icon('arrow', 'flip')}</button>
      <button type="button" class="hero__btn" data-toggle aria-label="${T('Diashow pauzeren', 'Pause slideshow')}" aria-pressed="false"><svg class="ic ic-pause" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg><svg class="ic ic-play" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor"/></svg></button>
      <button type="button" class="hero__btn" data-next aria-label="${T('Volgende dia', 'Next slide')}">${icon('arrow')}</button>
    </div>
  </div>
</section>

<section class="usp" aria-label="${T('Waarom EnviroFlow', 'Why EnviroFlow')}">
  <ul class="container usp__list">
    ${(isEn() ? ['Business specialist', 'Practical advice', 'Custom-made possible', 'Personal contact', 'Products by EXFLO'] : ['Zakelijke specialist', 'Praktisch advies', 'Maatwerk mogelijk', 'Persoonlijk contact', 'Producten van EXFLO']).map((u) => `<li>${u}</li>`).join('')}
  </ul>
</section>

<section class="section" aria-labelledby="h-groups">
  <div class="container">
    <div class="section-head section-head--row"><div><p class="kicker">${T('Assortiment', 'Range')}</p><h2 id="h-groups">${T('Oplossingen voor opvang, opslag en bescherming', 'Solutions for containment, storage and protection')}</h2></div><p class="section-head__aside">${T('Vier productgroepen, één aanspreekpunt. Online te bestellen of op aanvraag, altijd met advies.', 'Four product groups, one point of contact. Order online or on request, always with advice.')}</p></div>
    <div class="group-grid">
      ${groups.map((g) => `<a class="gtile" href="${urls.group(g)}">
        ${media({ src: g.imageSrc, alt: g.image }, '3-4')}
        <span class="gtile__shade" aria-hidden="true"></span>
        <span class="gtile__body">
          <span class="gtile__count">${catCount(g)} ${T('categorieën', 'categories')}</span>
          <span class="gtile__title">${esc(g.name)}</span>
          <span class="gtile__text">${esc(g.short)}</span>
          <span class="gtile__go">${T('Bekijk', 'View')} ${icon('arrow')}</span>
        </span>
      </a>`).join('')}
    </div>
    <div class="index">
      <h3 class="index__title">${T('Populaire categorieën', 'Popular categories')}</h3>
      <ul class="index-list">${popular.map((c) => `<li><a href="${urls.category(c)}"><span class="index-list__name">${esc(c.name)}</span><span class="index-list__text">${esc(c.short)}</span>${icon('arrow')}</a></li>`).join('')}</ul>
    </div>
  </div>
</section>

<section class="section section--dark" aria-labelledby="h-problems">
  <div class="container problems">
    <div class="problems__head">
      <p class="kicker kicker--light">${T('Vanuit uw situatie', 'Based on your situation')}</p>
      <h2 id="h-problems">${T('Waar loopt u tegenaan?', 'What challenge are you facing?')}</h2>
      <p>${T('Kies de situatie die het best bij u past. Wij laten zien waar u op let en welke oplossingen passen.', 'Choose the situation that best matches yours. We show you what to look out for and which solutions fit.')}</p>
      <a class="btn btn--outline-light" href="/keuzehulp/">${icon('compass')}${T('Iets anders? Start de keuzehulp', 'Something else? Start the selection guide')}</a>
    </div>
    <ul class="problem-list">
      ${solutions.map((s) => `<li><a href="/oplossingen/${s.slug}/"><span>${esc(s.tile)}</span>${icon('arrow')}</a></li>`).join('')}
    </ul>
  </div>
</section>

${featured.length ? `<section class="section" aria-labelledby="h-featured">
  <div class="container">
    <div class="section-head section-head--row"><div><p class="kicker">${T('Direct online te bestellen', 'Order directly online')}</p><h2 id="h-featured">${T('Uitgelichte producten', 'Featured products')}</h2></div><a class="link-arrow" href="/producten/opvang-en-spill-containment/flexibele-opvangbakken/">${T('Alle opvangbakken', 'All spill trays')} ${icon('arrow')}</a></div>
    <div class="product-grid">${featured.map((p) => productCard(p, ctx)).join('')}</div>
  </div>
</section>` : ''}

<section class="section section--tight" aria-labelledby="h-keuze">
  <div class="container">
    <div class="keuze-teaser">
      <div class="keuze-teaser__text">
        <p class="kicker kicker--light">${T('Keuzehulp', 'Selection guide')}</p>
        <h2 id="h-keuze">${T('Welke oplossing heeft u nodig?', 'Which solution do you need?')}</h2>
        <p>${T('Zes korte vragen over uw vloeistof, de hoeveelheid en de locatie. U ziet direct welke oplossingen geschikt kunnen zijn. Een specialist kijkt op verzoek mee.', 'Six short questions about your liquid, the quantity and the location. You immediately see which solutions may be suitable. A specialist can review it on request.')}</p>
        <a class="btn btn--accent btn--lg" href="/keuzehulp/">${T('Start de keuzehulp', 'Start the selection guide')} ${icon('arrow')}</a>
      </div>
      <ol class="keuze-teaser__steps">
        ${(isEn() ? ['What do you want to do?', 'Which liquid?', 'How much?', 'Indoors or outdoors?', 'Temporary or permanent?', 'Available space'] : ['Wat wilt u doen?', 'Welke vloeistof?', 'Hoeveel?', 'Binnen of buiten?', 'Tijdelijk of permanent?', 'Beschikbare ruimte']).map((q, i) => `<li><span>${i + 1}</span>${q}</li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="h-sectors">
  <div class="container">
    <div class="section-head section-head--row"><div><p class="kicker">${T('Sectoren', 'Sectors')}</p><h2 id="h-sectors">${T('Voor bedrijven die met vloeistoffen werken', 'For businesses that work with liquids')}</h2></div><a class="link-arrow" href="/sectoren/">${T('Alle sectoren', 'All sectors')} ${icon('arrow')}</a></div>
    <ul class="sector-grid">${sectors.map((s) => `<li><a href="/sectoren/${s.slug}/"><span>${esc(s.name)}</span>${icon('arrow')}</a></li>`).join('')}</ul>
  </div>
</section>

<section class="section section--mist" aria-labelledby="h-werkwijze">
  <div class="container">
    <div class="section-head"><p class="kicker">${T('Werkwijze', 'Approach')}</p><h2 id="h-werkwijze">${T('Hoe wij werken', 'How we work')}</h2></div>
    ${stepsList()}
  </div>
</section>

<section class="section" aria-labelledby="h-maatwerk">
  <div class="container feature">
    <div class="feature__media">${media({ src: '/assets/img/producten/sfeer-hal-ibc.jpg', alt: T("IBC's in een flexibele opvangbak van EXFLO", 'IBCs in a flexible EXFLO spill tray') }, '4-3')}</div>
    <div class="feature__text">
      <p class="kicker">${T('Maatwerk', 'Custom-made')}</p>
      <h2 id="h-maatwerk">${T('Past een standaardmaat niet?', "Standard size doesn't fit?")}</h2>
      <p>${T('Een opvangbak rond een specifieke machine, een tank voor een ruimte met beperkte hoogte of een afwijkende aansluiting. Vertel ons wat u nodig heeft. Wij bekijken samen met de fabrikant wat mogelijk is.', 'A spill tray around a specific machine, a tank for a space with limited height or a non-standard connection. Tell us what you need. Together with the manufacturer we look at what is possible.')}</p>
      <div class="btn-row"><a class="btn btn--primary" href="/maatwerk-aanvragen/">${T('Vraag maatwerk aan', 'Request custom-made')}</a><a class="btn btn--ghost" href="/contact/">${T('Neem contact op', 'Contact us')}</a></div>
    </div>
  </div>
</section>

<section class="section section--tight" aria-labelledby="h-partner">
  <div class="container partner-block">
    <div class="partner-block__logo">${exflo.logo ? `<img class="partner-logo" src="${exflo.logo}" alt="EXFLO – Think flexible" width="280" height="105" loading="lazy">` : `<div class="logo-ph">${ph(exflo.logoPlaceholder)}</div>`}</div>
    <div class="partner-block__text">
      <p class="kicker">Partner</p>
      <h2 id="h-partner">${T('Producten van EXFLO', 'Products by EXFLO')}</h2>
      <p>${esc(exflo.intro)} ${T(`EnviroFlow is ${ph(site.partnerRelation)} van EXFLO.`, `EnviroFlow is a ${ph(site.partnerRelation)} of EXFLO.`)}</p>
      <a class="link-arrow" href="/partners/exflo/">${T('Meer over EXFLO', 'More about EXFLO')} ${icon('arrow')}</a>
    </div>
  </div>
</section>

${ctaBand({ title: T('Weet u niet welke oplossing u nodig heeft?', "Not sure which solution you need?"), text: T('Bespreek uw situatie met een specialist. Wij denken mee en komen met een passend voorstel.', 'Discuss your situation with a specialist. We think along with you and come up with a suitable proposal.'), buttons: [{ label: T('Vraag advies aan', 'Request advice'), href: '/offerte-aanvragen/?type=advies', cls: 'btn--accent' }, { label: `${T('Bel', 'Call')} ${site.phonePrimary.display}`, href: `tel:${site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}
`;
  const org = {
    '@context': 'https://schema.org', '@type': 'Organization', name: 'EnviroFlow', url: site.baseUrl,
    logo: site.baseUrl + '/assets/img/enviroflow-logo.png', email: site.email,
    telephone: [site.phonePrimary.tel, site.phoneSecondary.tel],
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, postalCode: site.address.postalCode, addressLocality: site.address.city, addressCountry: site.address.country },
    areaServed: { '@type': 'Country', name: site.address.countryName },
    identifier: { '@type': 'PropertyValue', propertyID: 'KvK', value: site.kvk },
    vatID: site.vatNumber,
    contactPoint: [{ '@type': 'ContactPoint', telephone: site.phonePrimary.tel, contactType: 'sales', areaServed: 'NL', availableLanguage: ['nl', 'en'] }]
  };
  return {
    path: '/',
    title: T('IBC lekbak, flexibele tanks & opvangbakken | EnviroFlow', 'IBC spill trays, flexible tanks & containment | EnviroFlow'),
    description: T('EnviroFlow levert flexibele opvangbakken, brandwater-, brandstof-, drinkwater- en mesttanks en mobiele waterkeringen voor bedrijven. Persoonlijk advies en maatwerk.', 'EnviroFlow supplies flexible spill trays, fire water, fuel, drinking water and manure tanks and mobile flood barriers for businesses. Personal advice and custom solutions.'),
    body, jsonld: [org], bodyClass: 'page-home', scripts: ['/assets/js/hero.js']
  };
}

export function stepsList() {
  const steps = [
    [T('U vertelt uw situatie', 'You tell us your situation'), T('Welke vloeistof, hoeveel, waar en hoe lang. Een foto helpt.', 'Which liquid, how much, where and for how long. A photo helps.'), 'chat'],
    [T('Wij denken mee', 'We think along'), T('Wij kijken welke oplossing past en waar u op moet letten.', 'We look at which solution fits and what you need to pay attention to.'), 'compass'],
    [T('U ontvangt een voorstel', 'You receive a proposal'), T('Een concreet voorstel met product, uitvoering en prijs.', 'A concrete proposal with product, design and price.'), 'clipboard'],
    [T('Wij leveren', 'We deliver'), T('Wij stemmen de levering af op uw locatie en planning.', 'We coordinate the delivery with your location and schedule.'), 'truck']
  ];
  return `<ol class="steps">${steps.map(([h, p, ic], i) => `<li class="step"><span class="step__num">0${i + 1}</span><span class="step__icon">${icon(ic)}</span><h3>${h}</h3><p>${p}</p></li>`).join('')}</ol>`;
}

/* ================================================================ LISTINGS */
const FILTERS = () => [
  { key: 'category', label: T('Categorie', 'Category'), type: 'check' },
  { key: 'capacity', label: T('Capaciteit (liter)', 'Capacity (litres)'), type: 'range' },
  { key: 'dimensions', label: T('Afmetingen', 'Dimensions'), type: 'check' },
  { key: 'ibc', label: T("Aantal IBC's", 'Number of IBCs'), type: 'check' },
  { key: 'drums', label: T('Aantal vaten', 'Number of drums'), type: 'check' },
  { key: 'material', label: T('Materiaal', 'Material'), type: 'check' },
  { key: 'application', label: T('Toepassing', 'Application'), type: 'check' },
  { key: 'liquid', label: T('Vloeistoftype', 'Liquid type'), type: 'check' },
  { key: 'location', label: T('Binnen / buiten', 'Indoors / outdoors'), type: 'check' },
  { key: 'duration', label: T('Tijdelijk / permanent', 'Temporary / permanent'), type: 'check' },
  { key: 'orderable', label: T('Bestelwijze', 'How to order'), type: 'check' },
  { key: 'price', label: T('Prijs (excl. btw)', 'Price (excl. VAT)'), type: 'range' }
];

function filterValues(p, key, ctx) {
  const a = p.attributes || {};
  switch (key) {
    case 'category': return [[p.category, ctx.categoryById[p.category].name]];
    case 'ibc': return a.ibcCount ? [[String(a.ibcCount), `${a.ibcCount} IBC${a.ibcCount > 1 ? T("'s", 's') : ''}`]] : [];
    case 'drums': return a.drumCount ? [[String(a.drumCount), `${a.drumCount} ${a.drumCount > 1 ? T('vaten', 'drums') : T('vat', 'drum')}`]] : [];
    case 'dimensions': return a.dimensions ? [[a.dimensions, a.dimensions]] : [];
    case 'material': return a.material ? [[a.material, a.material]] : [];
    case 'application': return (a.application || []).map((v) => [v, v]);
    case 'liquid': return (a.liquids || []).map((v) => [v, v]);
    case 'location': return a.location ? [[a.location, a.location]] : [];
    case 'duration': return a.duration ? [[a.duration, a.duration]] : [];
    case 'orderable': return isOrderable(p) ? [['online', T('Online bestelbaar', 'Order online')]] : [['aanvraag', T('Op aanvraag', 'On request')]];
    case 'capacity': return a.capacityL ? [[a.capacityL]] : [];
    case 'price': return hasRealPrice(p) && !p.quoteOnly ? [[p.price]] : [];
    default: return [];
  }
}

/** Bouwt filters dynamisch op: een filter verschijnt zodra er minimaal twee verschillende waarden in de data staan. */
function filterPanel(list, ctx) {
  const groups = FILTERS().map((f) => {
    const map = new Map();
    list.forEach((p) => filterValues(p, f.key, ctx).forEach(([v, l]) => map.set(String(v), l ?? v)));
    if (map.size < 2) return '';
    if (f.type === 'range') {
      const nums = [...map.keys()].map(Number);
      return `<fieldset class="filter" data-filter-range="${f.key}"><legend>${f.label}</legend><div class="filter__range">
        <label><span class="sr-only">${f.label} ${T('minimaal', 'minimum')}</span><input type="number" inputmode="numeric" placeholder="${Math.min(...nums)}" data-min></label><span aria-hidden="true">–</span>
        <label><span class="sr-only">${f.label} ${T('maximaal', 'maximum')}</span><input type="number" inputmode="numeric" placeholder="${Math.max(...nums)}" data-max></label></div></fieldset>`;
    }
    const opts = [...map.entries()].sort((a, b) => String(a[0]).localeCompare(String(b[0]), isEn() ? 'en' : 'nl', { numeric: true }));
    return `<fieldset class="filter" data-filter="${f.key}"><legend>${f.label}</legend>${opts.map(([v, l], i) => `<label class="check"><input type="checkbox" value="${esc(v)}" id="flt-${f.key}-${i}"><span>${esc(l)}</span></label>`).join('')}</fieldset>`;
  }).join('');
  return groups;
}

export function listingSection(list, ctx, { title = T('Producten', 'Products') } = {}) {
  const filters = filterPanel(list, ctx);
  return `<section class="section listing" aria-labelledby="h-listing" data-listing>
  <div class="container listing__inner ${filters ? '' : 'listing__inner--nofilters'}">
    ${filters ? `<aside class="filters" aria-label="Filters">
      <button class="btn btn--ghost btn--sm filters__toggle" type="button" aria-expanded="false" aria-controls="filters-body" data-filters-toggle>${icon('filter')}Filters</button>
      <form id="filters-body" class="filters__body" data-filters>
        <div class="filters__head"><h2 class="filters__title">Filters</h2><button type="reset" class="linklike">${T('Wis filters', 'Clear filters')}</button></div>
        ${filters}
      </form>
    </aside>` : ''}
    <div class="listing__main">
      <div class="listing__bar">
        <h2 id="h-listing" class="listing__title">${esc(title)} <span class="listing__count" data-count>(${list.length})</span></h2>
        <label class="listing__sort"><span>${T('Sorteren', 'Sort')}</span><select data-sort><option value="default">${T('Relevantie', 'Relevance')}</option><option value="name">${T('Naam (A–Z)', 'Name (A–Z)')}</option><option value="price-asc">${T('Prijs oplopend', 'Price ascending')}</option><option value="price-desc">${T('Prijs aflopend', 'Price descending')}</option></select></label>
      </div>
      <div class="product-grid product-grid--3" data-grid>${list.map((p) => productCard(p, ctx)).join('')}</div>
      <p class="listing__empty" data-empty hidden>${T('Geen producten gevonden met deze filters. <a href="/offerte-aanvragen/?type=advies">Vraag advies aan</a>, dan zoeken wij met u mee.', 'No products found with these filters. <a href="/offerte-aanvragen/?type=advies">Request advice</a> and we will help you search.')}</p>
    </div>
  </div>
</section>`;
}

export function productsOverview(ctx) {
  const { groups, categories, urls } = ctx;
  const body = `
<section class="page-head"><div class="container"><h1>${T('Producten', 'Products')}</h1><p class="lead">${T('Flexibele oplossingen voor het opvangen, opslaan en verplaatsen van vloeistoffen, en voor bescherming tegen water. Online te bestellen of op aanvraag.', 'Flexible solutions for containing, storing and moving liquids, and for protection against water. Order online or on request.')}</p></div></section>
${groups.map((g) => `<section class="section section--tight" aria-labelledby="h-${g.slug}"><div class="container">
  <div class="section-head section-head--row"><h2 id="h-${g.slug}">${esc(g.name)}</h2><a class="link-arrow" href="${urls.group(g)}">${T(`Alle ${esc(g.name.toLowerCase())}`, `All ${esc(g.name.toLowerCase())}`)} ${icon('arrow')}</a></div>
  <div class="cat-grid">${categories.filter((c) => c.group === g.id).map((c) => categoryCard(c, ctx)).join('')}</div>
</div></section>`).join('')}
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  return { path: '/producten/', title: T('Producten: opvangbakken, flexibele tanks en waterkeringen | EnviroFlow', 'Products: spill trays, flexible tanks and flood barriers | EnviroFlow'), description: T('Bekijk het assortiment van EnviroFlow: flexibele opvangbakken, wasmatten, brandwater-, drinkwater-, brandstof- en mesttanks, mobiele waterkeringen en maatwerk.', 'View the EnviroFlow range: flexible spill trays, wash mats, fire water, drinking water, fuel and manure tanks, mobile flood barriers and custom solutions.'), body, crumbs: [{ name: 'Home', url: '/' }, { name: T('Producten', 'Products'), url: '/producten/' }] };
}

export function groupPage(g, ctx) {
  const { categories, products, urls } = ctx;
  const cats = categories.filter((c) => c.group === g.id);
  const list = products.filter((p) => cats.some((c) => c.id === p.category));
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><h1>${esc(g.name)}</h1><p class="lead">${esc(g.short)}</p></div>${media({ src: g.imageSrc, alt: g.image }, '16-9')}</div></section>
<section class="section section--tight"><div class="container"><h2 class="subhead">${T('Categorieën', 'Categories')}</h2><div class="cat-grid cat-grid--compact">${cats.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div></div></section>
${listingSection(list, ctx, { title: T(`Alle producten in ${g.name.toLowerCase()}`, `All products in ${g.name.toLowerCase()}`) })}
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  return { path: urls.group(g), title: `${g.name} | EnviroFlow`, description: `${g.short} ${T('Bekijk de mogelijkheden of vraag advies aan bij EnviroFlow.', 'View the options or request advice from EnviroFlow.')}`, body, crumbs: [{ name: 'Home', url: '/' }, { name: T('Producten', 'Products'), url: '/producten/' }, { name: g.name, url: urls.group(g) }], scripts: ['/assets/js/listing.js'] };
}

export function categoryPage(c, ctx) {
  const { products, groupById, urls, site } = ctx;
  const g = groupById[c.group];
  const list = products.filter((p) => p.category === c.id);
  const faq = faqBlock(c.faq);
  const crumbs = [{ name: 'Home', url: '/' }, { name: T('Producten', 'Products'), url: '/producten/' }, { name: g.name, url: urls.group(g) }, { name: c.name, url: urls.category(c) }];
  const head = `<section class="page-head"><div class="container page-head__grid"><div>
    <p class="eyebrow">${esc(g.name)}</p><h1>${esc(c.name)}</h1>
    ${c.intro.map((p, i) => `<p class="${i === 0 ? 'lead' : ''}">${esc(p)}</p>`).join('')}
    <div class="btn-row"><a class="btn btn--primary" href="#h-listing">${T('Bekijk producten', 'View products')}</a><a class="btn btn--ghost" href="/offerte-aanvragen/?type=advies&amp;categorie=${c.id}">${T('Advies aanvragen', 'Request advice')}</a></div>
  </div>${media({ src: c.imageSrc, alt: c.image }, '4-3', true)}</div></section>
  ${c.applications?.length ? `<section class="section section--tight section--grey" aria-labelledby="h-toep"><div class="container"><h2 id="h-toep" class="subhead">${T('Toepassingen', 'Applications')}</h2><ul class="check-list check-list--cols">${c.applications.map((a) => `<li>${icon('check')}${esc(a)}</li>`).join('')}</ul></div></section>` : ''}`;

  let main;
  if (c.isCustom) {
    main = `<section class="section"><div class="container split split--form"><div>${customForm(ctx)}</div><div>${adviceBlock(site, { title: T('Liever eerst overleggen?', 'Prefer to talk first?'), text: T('Bel of mail ons met uw situatie. Wij denken graag met u mee.', 'Call or email us about your situation. We are happy to think along with you.') })}</div></div></section>`;
  } else {
    main = `${listingSection(list, ctx, { title: `${c.name}` })}
    <section class="section section--tight"><div class="container"><div class="custom-hint">${icon('ruler')}<div><h2>${T('Geen passende maat of uitvoering?', 'No suitable size or version?')}</h2><p>${T('Wij bekijken wat er op maat mogelijk is.', 'We look at what is possible as a custom solution.')}</p></div><a class="btn btn--ghost" href="/maatwerk-aanvragen/">${T('Vraag maatwerk aan', 'Request custom-made')}</a></div></div></section>`;
  }
  const body = `${head}${main}${faq.html}<div class="container section--tight">${adviceBlock(site)}</div>`;
  return { path: urls.category(c), title: c.seoTitle || `${c.name} | EnviroFlow`, description: c.seoDescription || c.short, body, crumbs, jsonld: faq.ld ? [faq.ld] : [], scripts: c.isCustom ? ['/assets/js/forms.js'] : ['/assets/js/listing.js'] };
}

/* ================================================================ PRODUCT */
const SPEC_LABELS = () => [
  ['afmetingen', T('Afmetingen', 'Dimensions')], ['capaciteit', T('Capaciteit', 'Capacity')], ['materiaal', T('Materiaal', 'Material')], ['gewicht', T('Gewicht', 'Weight')],
  ['aansluitingen', T('Aansluitingen', 'Connections')], ['temperatuurbereik', T('Temperatuurbereik', 'Temperature range')], ['chemischeBestendigheid', T('Chemische bestendigheid', 'Chemical resistance')],
  ['garantie', T('Garantie', 'Warranty')], ['certificering', T('Certificering', 'Certification')]
];

export function productPage(p, ctx) {
  const { t, site, urls, categoryById, groupById, products, brandById } = ctx;
  const c = categoryById[p.category];
  const g = groupById[c.group];
  const brand = brandById[p.brand];
  const orderable = isOrderable(p);
  const crumbs = [{ name: 'Home', url: '/' }, { name: T('Producten', 'Products'), url: '/producten/' }, { name: g.name, url: urls.group(g) }, { name: c.name, url: urls.category(c) }, { name: p.name, url: urls.product(p) }];
  const related = (p.related || []).map((id) => products.find((x) => x.id === id)).filter(Boolean)
    .concat(products.filter((x) => x.category === p.category && x.id !== p.id)).filter((x, i, arr) => arr.indexOf(x) === i).slice(0, 3);
  const images = p.images?.length ? p.images : [{ alt: `${T('Foto', 'Photo')}: ${p.name}` }];
  const unknown = `<span class="muted">${t.specsUnknown}</span>`;

  const body = `
<section class="product-top">
  <div class="container product-top__grid">
    <div class="gallery" data-gallery>
      <div class="gallery__main" data-gallery-main>${media(images[0], '4-3', true)}</div>
      ${images.length > 1 ? `<ul class="gallery__thumbs">${images.map((im, i) => `<li><button type="button" aria-label="${T('Toon afbeelding', 'Show image')} ${i + 1}: ${esc(im.alt)}" data-gallery-thumb="${i}" ${i === 0 ? 'aria-current="true"' : ''}>${media(im, '1-1')}</button></li>`).join('')}</ul>` : ''}
      <template data-gallery-items>${images.map((im) => media(im, '4-3')).join('')}</template>
    </div>
    <div class="buybox">
      <p class="buybox__brand">${t.manufacturer}: <a href="/partners/${brand.slug}/">${esc(brand.name)}</a>${p.line ? ` · ${T('Productlijn', 'Product line')} ${esc(p.line)}` : ''}</p>
      <h1>${esc(p.name)}</h1>
      <p class="buybox__short">${esc(p.short)}</p>
      ${priceBlock(p, t, 'price--lg')}
      <ul class="buybox__meta">
        <li>${icon('truck')}${p.leadTime ? esc(p.leadTime) : t.leadTimeOnRequest}</li>
        ${p.stock ? `<li>${icon('check')}${esc(p.stock)}</li>` : ''}
        ${p.sku ? `<li>${T('Artikelnummer', 'Item number')}: ${esc(p.sku)}</li>` : ''}
      </ul>
      ${orderable ? `<form class="buybox__cart" data-add-form="${esc(p.id)}">
        <label for="qty">${T('Aantal', 'Quantity')}</label>
        <div class="qty"><button type="button" data-qty-step="-1" aria-label="${T('Aantal verlagen', 'Decrease quantity')}">−</button><input id="qty" name="qty" type="number" min="1" max="999" value="1" inputmode="numeric"><button type="button" data-qty-step="1" aria-label="${T('Aantal verhogen', 'Increase quantity')}">+</button></div>
        <button class="btn btn--primary btn--lg" type="submit">${icon('cart')}${t.addToCart}</button>
      </form>` : ''}
      <a class="btn ${orderable ? 'btn--ghost' : 'btn--primary btn--lg'} btn--block" href="/offerte-aanvragen/?product=${encodeURIComponent(p.id)}">${T('Offerte aanvragen', 'Request a quote')}</a>
      ${orderable ? `<p class="buybox__tip">${icon('info')}${t.cartTip}</p>` : `<p class="buybox__tip">${icon('info')}${T('Dit product leveren wij op aanvraag. U ontvangt een voorstel op basis van uw situatie.', 'We supply this product on request. You will receive a proposal based on your situation.')}</p>`}
      <div class="buybox__help">${icon('phone')}<div><strong>${T('Vragen over dit product?', 'Questions about this product?')}</strong><br><a href="tel:${site.phonePrimary.tel}">${site.phonePrimary.display}</a> ${T('of', 'or')} <a href="tel:${site.phoneSecondary.tel}">${site.phoneSecondary.display}</a></div></div>
    </div>
  </div>
</section>

<nav class="subnav" aria-label="${T('Op deze pagina', 'On this page')}"><div class="container"><ul>
  <li><a href="#toepassing">${T('Toepassing', 'Application')}</a></li><li><a href="#voordelen">${T('Voordelen', 'Benefits')}</a></li><li><a href="#specificaties">${T('Specificaties', 'Specifications')}</a></li>${p.sizes ? `<li><a href="#uitvoeringen">${T('Uitvoeringen', 'Versions')}</a></li>` : ''}<li><a href="#geschikt">${T('Geschikt voor', 'Suitable for')}</a></li><li><a href="#downloads">Downloads</a></li>
</ul></div></nav>

<section class="section section--tight"><div class="container product-detail">
  <div class="product-detail__main">
    <section id="toepassing" class="pd-block"><h2>${T('Waarvoor is dit product?', 'What is this product for?')}</h2>${p.purpose.map((x) => `<p>${esc(x)}</p>`).join('')}</section>
    <section id="voordelen" class="pd-block"><h2>${T('Belangrijkste voordelen', 'Key benefits')}</h2><ul class="check-list">${p.benefits.slice(0, 4).map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul></section>
    <section id="specificaties" class="pd-block"><h2>${T('Specificaties', 'Specifications')}</h2>
      <table class="spec-table"><caption class="sr-only">${T('Specificaties', 'Specifications')} ${esc(p.name)}</caption><tbody>
        <tr><th scope="row">${t.manufacturer}</th><td>${esc(brand.name)}</td></tr>
        ${SPEC_LABELS().map(([k, l]) => `<tr><th scope="row">${l}</th><td>${p.specs?.[k] ? esc(p.specs[k]) + (k === 'certificering' ? `<br><span class="small muted">${t.foreignCertNote}</span>` : '') : unknown}</td></tr>`).join('')}
        <tr><th scope="row">${T('Geschikte vloeistoffen', 'Suitable liquids')}</th><td>${p.liquids?.length ? esc(p.liquids.join(', ')) : `<span class="muted">${t.liquidCheck}</span>`}</td></tr>
      </tbody></table>
      ${p.source ? `<p class="small muted">${T(`Bron: productinformatie van de fabrikant (${esc(brand.name)}). Wijzigingen voorbehouden.`, `Source: product information from the manufacturer (${esc(brand.name)}). Subject to change.`)}</p>` : ''}
    </section>
    ${p.sizes ? `<section id="uitvoeringen" class="pd-block"><h2>${T('Uitvoeringen', 'Versions')}</h2><div class="table-scroll"><table class="spec-table spec-table--grid"><caption class="sr-only">${T('Uitvoeringen', 'Versions')} ${esc(p.name)}</caption><thead><tr>${p.sizes.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${p.sizes.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>${p.sizes.note ? `<p class="small muted">${esc(p.sizes.note)}</p>` : ''}</section>` : ''}
    <section id="geschikt" class="pd-block"><h2>${T('Geschikt voor', 'Suitable for')}</h2><ul class="check-list">${p.suitableFor.map((b) => `<li>${icon('check')}${esc(b)}</li>`).join('')}</ul></section>
    <section id="downloads" class="pd-block"><h2>Downloads</h2>
      ${(p.downloads || []).map((d) => `<a class="download" href="${esc(d.href)}" download>${icon('download')}<span>${esc(d.label)}</span></a>`).join('')}
      <p class="muted">${T('Een volledige datasheet ontvangt u op aanvraag.', 'A full datasheet is available on request.')} <a href="mailto:${site.email}?subject=${encodeURIComponent(`Datasheet ${p.name}`)}">${T('Vraag de datasheet aan', 'Request the datasheet')}</a>.</p>
    </section>
    <div class="notice">${icon('info')}<p>${t.requirementsNote}</p></div>
  </div>
</div></section>

${related.length ? `<section class="section section--grey" aria-labelledby="h-related"><div class="container"><h2 id="h-related">${T('Gerelateerde producten', 'Related products')}</h2><div class="product-grid product-grid--3">${related.map((r) => productCard(r, ctx)).join('')}</div></div></section>` : ''}
<div class="container section--tight">${adviceBlock(site, { title: T('Hulp nodig bij uw keuze?', 'Need help choosing?'), text: T('Wij controleren of dit product past bij uw vloeistof, hoeveelheid en locatie.', 'We check whether this product suits your liquid, quantity and location.') })}</div>`;

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
  return { path: urls.product(p), title: `${p.name} | ${brand.name} | EnviroFlow`, description: (orderable ? T(`${p.short} Online te bestellen of vraag een offerte aan bij EnviroFlow.`, `${p.short} Order online or request a quote from EnviroFlow.`) : T(`${p.short} Prijs op aanvraag. Vraag een offerte aan bij EnviroFlow.`, `${p.short} Price on request. Request a quote from EnviroFlow.`)).replace(/\s+/g, ' '), body, crumbs, jsonld: [ld], scripts: ['/assets/js/product.js'] };
}

/* ================================================================ CART & CHECKOUT */
const langField = () => `<input type="hidden" name="lang" value="${getLang()}">`;

export function cartPage(ctx) {
  const { t } = ctx;
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>${T('Winkelwagen', 'Shopping cart')}</h1></div></section>
<section class="section section--tight"><div class="container cart" data-cart-page>
  <div class="cart__main">
    <div data-cart-items><noscript><p>${T('Schakel JavaScript in om uw winkelwagen te bekijken, of <a href="/offerte-aanvragen/">vraag een offerte aan</a>.', 'Please enable JavaScript to view your shopping cart, or <a href="/offerte-aanvragen/">request a quote</a>.')}</p></noscript></div>
    <div class="cart__tip">${icon('info')}<p>${t.cartTip} <a href="/offerte-aanvragen/?bron=winkelwagen" data-cart-to-quote>${T('Vraag een offerte aan', 'Request a quote')}</a></p></div>
  </div>
  <aside class="cart__summary" aria-labelledby="h-summary">
    <h2 id="h-summary">${T('Overzicht', 'Summary')}</h2>
    <div data-cart-summary></div>
    <a class="btn btn--primary btn--block btn--lg" href="/afrekenen/" data-checkout-link>${T('Verder naar afrekenen', 'Proceed to checkout')}</a>
    <a class="btn btn--ghost btn--block" href="/offerte-aanvragen/?bron=winkelwagen" data-cart-to-quote>${T('Offerte aanvragen voor deze producten', 'Request a quote for these products')}</a>
    <p class="small muted">${T('Alle prijzen zijn exclusief btw, tenzij anders aangegeven.', 'All prices exclude VAT unless stated otherwise.')}</p>
  </aside>
</div></section>`;
  return { path: '/winkelwagen/', title: T('Winkelwagen | EnviroFlow', 'Shopping cart | EnviroFlow'), description: T('Uw winkelwagen bij EnviroFlow.', 'Your shopping cart at EnviroFlow.'), body, noindex: true, crumbs: [{ name: 'Home', url: '/' }, { name: T('Winkelwagen', 'Shopping cart'), url: '/winkelwagen/' }], scripts: ['/assets/js/cart.js'] };
}

export function checkoutPage(ctx) {
  const { site } = ctx;
  const countries = [['NL', T('Nederland', 'Netherlands')]];
  const addr = (prefix, required) => `
    ${field({ name: `${prefix}_street`, label: T('Straat en huisnummer', 'Street and house number'), required, autocomplete: `${prefix === 'delivery' ? 'shipping' : 'billing'} street-address`, full: true })}
    ${field({ name: `${prefix}_postcode`, label: T('Postcode', 'Postcode'), required, autocomplete: `${prefix === 'delivery' ? 'shipping' : 'billing'} postal-code` })}
    ${field({ name: `${prefix}_city`, label: T('Plaats', 'City'), required, autocomplete: `${prefix === 'delivery' ? 'shipping' : 'billing'} address-level2` })}
    ${field({ name: `${prefix}_country`, label: T('Land', 'Country'), type: 'select', options: countries, required, value: 'NL' })}`;
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>${T('Afrekenen', 'Checkout')}</h1><ol class="checkout-steps" aria-label="${T('Stappen', 'Steps')}"><li>${T('Winkelwagen', 'Shopping cart')}</li><li aria-current="step">${T('Gegevens &amp; betaling', 'Details &amp; payment')}</li><li>${T('Bevestiging', 'Confirmation')}</li></ol></div></section>
<section class="section section--tight"><div class="container checkout">
  <form class="checkout__form form" action="/api/order" method="post" data-checkout-form novalidate>
    ${honeypot()}
    ${langField()}
    <fieldset class="form-section"><legend>${T('Bedrijfsgegevens', 'Company details')}</legend><div class="form-grid">
      ${field({ name: 'company', label: T('Bedrijfsnaam', 'Company name'), required: true, autocomplete: 'organization' })}
      ${field({ name: 'vat_number', label: T('Btw-nummer', 'VAT number'), autocomplete: 'off', hint: T('Bijvoorbeeld NL123456789B01', 'For example NL123456789B01') })}
      ${field({ name: 'name', label: T('Contactpersoon', 'Contact person'), required: true, autocomplete: 'name' })}
      ${field({ name: 'reference', label: T('Uw referentie / inkoopordernummer', 'Your reference / purchase order number') })}
      ${field({ name: 'email', label: T('E-mailadres', 'Email address'), type: 'email', required: true, autocomplete: 'email' })}
      ${field({ name: 'phone', label: T('Telefoonnummer', 'Phone number'), type: 'tel', required: true, autocomplete: 'tel' })}
    </div></fieldset>
    <fieldset class="form-section"><legend>${T('Afleveradres', 'Delivery address')}</legend><div class="form-grid">${addr('delivery', true)}</div></fieldset>
    <fieldset class="form-section"><legend>${T('Factuuradres', 'Billing address')}</legend>
      <label class="check"><input type="checkbox" name="billing_same" value="1" checked data-billing-same><span>${T('Factuuradres is gelijk aan afleveradres', 'Billing address is the same as the delivery address')}</span></label>
      <div class="form-grid" data-billing-fields hidden>${addr('billing', false)}</div>
    </fieldset>
    <fieldset class="form-section"><legend>${T('Levering', 'Delivery')}</legend>
      ${field({ name: 'remarks', label: T('Opmerkingen voor de levering', 'Delivery notes'), type: 'textarea', hint: T('Bijvoorbeeld lostijden, bereikbaarheid voor een vrachtwagen, laadperron of heftruck aanwezig.', 'For example unloading times, access for a lorry, whether a loading dock or forklift is available.'), full: true })}
    </fieldset>
    <fieldset class="form-section"><legend>${T('Betaalmethode', 'Payment method')}</legend>
      <div class="pay-methods">${site.paymentMethods.map((m, i) => `<label class="pay-method"${m.appleOnly ? ' data-apple-only hidden' : ''}><input type="radio" name="payment_method" value="${m.id}" ${i === 0 ? 'checked' : ''} required><span>${esc(m.label)}</span></label>`).join('')}</div>
    </fieldset>
    <div class="form-section">
      <label class="check"><input type="checkbox" name="terms" value="1" required><span>${T('Ik ga akkoord met de <a href="/algemene-voorwaarden/" target="_blank" rel="noopener">algemene voorwaarden</a> en heb het <a href="/privacybeleid/" target="_blank" rel="noopener">privacybeleid</a> gelezen.', 'I agree to the <a href="/algemene-voorwaarden/" target="_blank" rel="noopener">terms and conditions</a> and have read the <a href="/privacybeleid/" target="_blank" rel="noopener">privacy policy</a>.')} <span class="req" aria-hidden="true">*</span></span></label>
    </div>
    <input type="hidden" name="items" data-items-field>
    ${formStatus()}
    <button class="btn btn--primary btn--lg" type="submit" data-submit>${T('Bestelling plaatsen en betalen', 'Place order and pay')}</button>
    <p class="small muted">${T('U wordt doorgestuurd naar een beveiligde betaalpagina.', 'You will be redirected to a secure payment page.')}</p>
  </form>
  <aside class="checkout__summary" aria-labelledby="h-order">
    <h2 id="h-order">${T('Uw bestelling', 'Your order')}</h2>
    <div data-checkout-summary></div>
    <a class="small" href="/winkelwagen/">${T('Winkelwagen aanpassen', 'Edit shopping cart')}</a>
  </aside>
</div></section>`;
  return { path: '/afrekenen/', title: T('Afrekenen | EnviroFlow', 'Checkout | EnviroFlow'), description: T('Rond uw bestelling bij EnviroFlow af.', 'Complete your order with EnviroFlow.'), body, noindex: true, crumbs: [{ name: 'Home', url: '/' }, { name: T('Winkelwagen', 'Shopping cart'), url: '/winkelwagen/' }, { name: T('Afrekenen', 'Checkout'), url: '/afrekenen/' }], scripts: ['/assets/js/cart.js'] };
}

export function orderStatusPage() {
  const body = `<section class="section"><div class="container container--narrow" data-order-status>
  <h1>${T('Uw bestelling', 'Your order')}</h1>
  <p data-order-message>${T('Wij controleren de status van uw betaling…', 'We are checking the status of your payment…')}</p>
  <div class="btn-row"><a class="btn btn--ghost" href="/">${T('Naar de homepage', 'To the homepage')}</a><a class="btn btn--ghost" href="/contact/">Contact</a></div>
</div></section>`;
  return { path: '/bestelling/', title: T('Bestelling | EnviroFlow', 'Order | EnviroFlow'), description: T('Status van uw bestelling bij EnviroFlow.', 'Status of your order with EnviroFlow.'), body, noindex: true, scripts: ['/assets/js/cart.js'] };
}

/* ================================================================ FORMULIEREN */
function contactFields() {
  return `${field({ name: 'company', label: T('Bedrijfsnaam', 'Company name'), required: true, autocomplete: 'organization' })}
  ${field({ name: 'name', label: T('Naam', 'Name'), required: true, autocomplete: 'name' })}
  ${field({ name: 'email', label: T('E-mailadres', 'Email address'), type: 'email', required: true, autocomplete: 'email' })}
  ${field({ name: 'phone', label: T('Telefoonnummer', 'Phone number'), type: 'tel', required: true, autocomplete: 'tel' })}`;
}

const uploadField = (label = T('Bestanden of foto\'s', 'Files or photos')) => field({ name: 'files', label, type: 'file', accept: '.jpg,.jpeg,.png,.webp,.heic,.pdf', multiple: true, hint: T('Maximaal 10 bestanden van elk 10 MB (jpg, png, webp, heic of pdf).', 'Up to 10 files of 10 MB each (jpg, png, webp, heic or pdf).'), full: true });

const privacyCheck = () => `<label class="check"><input type="checkbox" name="privacy" value="1" required><span>${T('Ik ga akkoord dat EnviroFlow mijn gegevens gebruikt om contact met mij op te nemen over deze aanvraag (zie <a href="/privacybeleid/">privacybeleid</a>).', 'I agree that EnviroFlow may use my details to contact me about this request (see <a href="/privacybeleid/">privacy policy</a>).')} <span class="req" aria-hidden="true">*</span></span></label>`;

// Keuzelijsten: de waarde blijft Nederlands (voor de interne e-mail), het label volgt de taal.
const UNKNOWN = () => ['Weet ik nog niet', T('Weet ik nog niet', "Don't know yet")];

export function quoteForm(ctx) {
  const { products } = ctx;
  return `<form class="form" action="/api/quote" method="post" enctype="multipart/form-data" data-form="quote" novalidate>
  ${honeypot()}
  ${langField()}
  <fieldset class="form-section"><legend>${T('Soort aanvraag', 'Type of request')}</legend>
    <div class="radio-row"><label class="check"><input type="radio" name="request_type" value="offerte" checked><span>${T('Offerte', 'Quote')}</span></label><label class="check"><input type="radio" name="request_type" value="advies"><span>${T('Advies', 'Advice')}</span></label></div>
  </fieldset>
  <fieldset class="form-section"><legend>${T('Uw gegevens', 'Your details')}</legend><div class="form-grid">${contactFields()}</div></fieldset>
  <fieldset class="form-section"><legend>${T('Uw aanvraag', 'Your request')}</legend><div class="form-grid">
    ${field({ name: 'product', label: 'Product', type: 'select', options: [['', T('Kies een product (optioneel)', 'Choose a product (optional)')], ...products.map((p) => [p.id, p.name]), ['anders', T('Anders / weet ik nog niet', "Other / don't know yet")]] })}
    ${field({ name: 'quantity', label: T('Aantal', 'Quantity'), type: 'number', attrs: 'min="1" inputmode="numeric"' })}
    ${field({ name: 'liquid', label: T('Type vloeistof', 'Type of liquid'), hint: T('Bijvoorbeeld diesel, bluswater, drijfmest of een chemische stof', 'For example diesel, fire water, liquid manure or a chemical') })}
    ${field({ name: 'application', label: T('Toepassing', 'Application') })}
    ${field({ name: 'delivery_date', label: T('Gewenste leverdatum', 'Preferred delivery date'), type: 'date' })}
    ${field({ name: 'remarks', label: T('Opmerkingen', 'Remarks'), type: 'textarea', rows: 5, full: true, hint: T('Vertel zo veel mogelijk over uw situatie: locatie, afmetingen, binnen of buiten, tijdelijk of permanent.', 'Tell us as much as possible about your situation: location, dimensions, indoors or outdoors, temporary or permanent.') })}
    ${uploadField()}
  </div></fieldset>
  <input type="hidden" name="source" value="">
  ${privacyCheck()}
  ${formStatus()}
  <button class="btn btn--primary btn--lg" type="submit" data-submit>${T('Aanvraag versturen', 'Send request')}</button>
</form>`;
}

export function customForm() {
  return `<form class="form" action="/api/custom" method="post" enctype="multipart/form-data" data-form="custom" novalidate>
  ${honeypot()}
  ${langField()}
  <h2 class="form-title">${T('Maatwerk aanvragen', 'Request a custom solution')}</h2>
  <fieldset class="form-section"><legend>${T('Uw gegevens', 'Your details')}</legend><div class="form-grid">${contactFields()}</div></fieldset>
  <fieldset class="form-section"><legend>${T('Uw situatie', 'Your situation')}</legend><div class="form-grid">
    ${field({ name: 'liquid', label: T('Type vloeistof', 'Type of liquid') })}
    ${field({ name: 'volume', label: T('Volume', 'Volume'), hint: T("Bijvoorbeeld 2 IBC's, 5.000 liter of 50 m³", 'For example 2 IBCs, 5,000 litres or 50 m³') })}
    ${field({ name: 'dimensions', label: T('Afmetingen (beschikbare ruimte)', 'Dimensions (available space)'), hint: T('Lengte × breedte × hoogte in meters', 'Length × width × height in metres') })}
    ${field({ name: 'application', label: T('Toepassing', 'Application') })}
    ${field({ name: 'location', label: T('Locatie', 'Location'), type: 'select', options: [['', T('Maak een keuze', 'Make a choice')], ['Binnen', T('Binnen', 'Indoors')], ['Buiten', T('Buiten', 'Outdoors')], ['Binnen en buiten', T('Binnen en buiten', 'Indoors and outdoors')], UNKNOWN()] })}
    ${field({ name: 'duration', label: T('Tijdelijk of permanent', 'Temporary or permanent'), type: 'select', options: [['', T('Maak een keuze', 'Make a choice')], ['Tijdelijk', T('Tijdelijk', 'Temporary')], ['Permanent', T('Permanent', 'Permanent')], UNKNOWN()] })}
    ${field({ name: 'wish', label: T('Gewenste oplossing', 'Desired solution'), type: 'textarea', rows: 5, full: true, hint: T('Beschrijf wat u nodig heeft. Een schets of foto helpt.', 'Describe what you need. A sketch or photo helps.') })}
    ${uploadField(T("Foto's of tekeningen", 'Photos or drawings'))}
  </div></fieldset>
  ${privacyCheck()}
  ${formStatus()}
  <button class="btn btn--primary btn--lg" type="submit" data-submit>${T('Maatwerkaanvraag versturen', 'Send custom request')}</button>
</form>`;
}

function formAside(site) {
  return `<aside class="form-aside">
  <div class="card"><h2>${T('Wat gebeurt er na uw aanvraag?', 'What happens after your request?')}</h2>${stepsMini()}</div>
  <div class="card"><h2>${T('Liever direct contact?', 'Prefer direct contact?')}</h2>
    <p><a href="tel:${site.phonePrimary.tel}">${icon('phone')} ${site.phonePrimary.display}</a><br><a href="tel:${site.phoneSecondary.tel}">${icon('phone')} ${site.phoneSecondary.display}</a><br><a href="mailto:${site.email}">${icon('mail')} ${site.email}</a></p>
  </div>
</aside>`;
}
const stepsMini = () => T(
  `<ol class="steps-mini"><li>Wij bekijken uw aanvraag.</li><li>Wij nemen contact op om uw situatie te bespreken.</li><li>U ontvangt een voorstel.</li></ol>`,
  `<ol class="steps-mini"><li>We review your request.</li><li>We contact you to discuss your situation.</li><li>You receive a proposal.</li></ol>`
);

export function quotePage(ctx) {
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1 data-quote-title>${T('Offerte of advies aanvragen', 'Request a quote or advice')}</h1><p class="lead">${T('Vertel ons wat u nodig heeft. Wij denken mee en sturen u een passend voorstel.', 'Tell us what you need. We will think along with you and send you a suitable proposal.')}</p><div class="prefill-note" data-prefill-note hidden></div></div></section>
<section class="section section--tight"><div class="container split split--form">${quoteForm(ctx)}${formAside(ctx.site)}</div></section>`;
  return { path: '/offerte-aanvragen/', title: T('Offerte aanvragen | EnviroFlow', 'Request a quote | EnviroFlow'), description: T('Vraag een offerte of advies aan voor flexibele opvangbakken, tanks, waterkeringen of maatwerk. EnviroFlow denkt mee en stuurt een passend voorstel.', 'Request a quote or advice for flexible spill trays, tanks, flood barriers or custom solutions. EnviroFlow thinks along with you and sends a suitable proposal.'), body, crumbs: [{ name: 'Home', url: '/' }, { name: T('Offerte aanvragen', 'Request a quote'), url: '/offerte-aanvragen/' }], scripts: ['/assets/js/forms.js'] };
}

export function customPage(ctx) {
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>${T('Maatwerk aanvragen', 'Request a custom solution')}</h1><p class="lead">${T('Staat uw oplossing er niet tussen? Beschrijf uw situatie. Wij bekijken samen met de fabrikant wat mogelijk is.', "Can't find your solution? Describe your situation. Together with the manufacturer, we will look at what is possible.")}</p></div></section>
<section class="section section--tight"><div class="container split split--form">${customForm(ctx)}${formAside(ctx.site)}</div></section>`;
  return { path: '/maatwerk-aanvragen/', title: T('Maatwerk aanvragen | EnviroFlow', 'Request a custom solution | EnviroFlow'), description: T('Opvangbak, tank, mat of hoes op maat nodig? Beschrijf uw situatie en ontvang een voorstel van EnviroFlow.', 'Need a custom spill tray, tank, mat or cover? Describe your situation and receive a proposal from EnviroFlow.'), body, crumbs: [{ name: 'Home', url: '/' }, { name: T('Maatwerk aanvragen', 'Custom solutions'), url: '/maatwerk-aanvragen/' }], scripts: ['/assets/js/forms.js'] };
}

export function thanksPage(ctx) {
  const body = `<section class="section"><div class="container container--narrow thanks">${icon('check', 'thanks__icon')}<h1>${T('Bedankt voor uw aanvraag', 'Thank you for your request')}</h1><p class="lead">${ctx.t.formThanks}</p><div class="btn-row"><a class="btn btn--primary" href="/producten/">${T('Verder kijken', 'Continue browsing')}</a><a class="btn btn--ghost" href="/">${T('Naar de homepage', 'To the homepage')}</a></div></div></section>`;
  return { path: '/bedankt/', title: T('Bedankt | EnviroFlow', 'Thank you | EnviroFlow'), description: T('Bedankt voor uw aanvraag bij EnviroFlow.', 'Thank you for your request to EnviroFlow.'), body, noindex: true };
}

/* ================================================================ KEUZEHULP */
export function keuzehulpPage(ctx) {
  const { categories, urls, products } = ctx;
  const catData = categories.map((c) => ({ id: c.id, name: c.name, short: c.short, url: localPath(urls.category(c)) }));
  const prodData = products.filter(isOrderable).map((p) => ({ id: p.id, name: p.name, url: localPath(urls.product(p)), category: p.category, ibc: p.attributes?.ibcCount || null, drums: p.attributes?.drumCount || null }));
  const radio = (name, opts) => `<div class="choice-grid">${opts.map(([v, l]) => `<label class="choice"><input type="radio" name="${name}" value="${v}" required><span>${l}</span></label>`).join('')}</div>`;
  const dunno = T('Weet ik nog niet', "Don't know yet");
  const steps = [
    ['doel', T('Wat wilt u doen?', 'What do you want to do?'), radio('doel', [['opvangen', T('Vloeistof opvangen (lekkages, morsingen)', 'Contain liquid (leaks, spills)')], ['opslaan', T('Vloeistof opslaan', 'Store liquid')], ['beschermen', T('Beschermen tegen water', 'Protect against water')], ['anders', T('Iets anders', 'Something else')]])],
    ['vloeistof', T('Om welke vloeistof gaat het?', 'Which liquid is involved?'), radio('vloeistof', [['olie-chemicalien', T('Olie of chemicaliën', 'Oil or chemicals')], ['brandstof', T('Brandstof', 'Fuel')], ['drinkwater', T('Drinkwater', 'Drinking water')], ['bluswater', T('Bluswater', 'Fire water')], ['proceswater', T('Proces- of regenwater', 'Process water or rainwater')], ['afvalwater', T('Afvalwater', 'Waste water')], ['mest', T('Mest', 'Manure')], ['uan', T('UAN / vloeibare meststof', 'UAN / liquid fertiliser')], ['anders', T('Anders', 'Other')]])],
    ['hoeveelheid', T('Om hoeveel gaat het?', 'How much is involved?'), `<div class="form-grid form-grid--tight"><div class="field"><label for="kh-aantal">${T('Hoeveelheid', 'Quantity')}</label><input id="kh-aantal" name="aantal" type="number" min="0" step="any" inputmode="decimal"></div><div class="field"><label for="kh-eenheid">${T('Eenheid', 'Unit')}</label><select id="kh-eenheid" name="eenheid"><option value="IBC's">${T("IBC's", 'IBCs')}</option><option value="vaten">${T('Vaten', 'Drums')}</option><option value="liter">${T('Liter', 'Litres')}</option><option value="m³">m³</option></select></div></div><p class="field__hint">${T('Weet u het niet precies? Een schatting is voldoende, of laat het veld leeg.', 'Not sure exactly? An estimate is fine, or leave the field empty.')}</p>`],
    ['locatie', T('Staat de oplossing binnen of buiten?', 'Will the solution be indoors or outdoors?'), radio('locatie', [['binnen', T('Binnen', 'Indoors')], ['buiten', T('Buiten', 'Outdoors')], ['beide', T('Beide / wisselend', 'Both / varying')], ['onbekend', dunno]])],
    ['duur', T('Tijdelijk of permanent? Vast of mobiel?', 'Temporary or permanent? Fixed or mobile?'), `<p class="choice-label" id="kh-duur-l">${T('Duur', 'Duration')}</p>${radio('duur', [['tijdelijk', T('Tijdelijk', 'Temporary')], ['permanent', T('Permanent', 'Permanent')], ['onbekend', dunno]])}<p class="choice-label">${T('Plaatsing', 'Placement')}</p><div class="choice-grid">${[['vast', T('Vaste plek', 'Fixed location')], ['mobiel', T('Mobiel / verplaatsbaar', 'Mobile / movable')], ['onbekend', dunno]].map(([v, l]) => `<label class="choice"><input type="radio" name="mobiliteit" value="${v}"><span>${l}</span></label>`).join('')}</div>`],
    ['ruimte', T('Hoeveel ruimte is er beschikbaar?', 'How much space is available?'), `<div class="form-grid form-grid--tight"><div class="field"><label for="kh-l">${T('Lengte (m)', 'Length (m)')}</label><input id="kh-l" name="lengte" type="number" min="0" step="any" inputmode="decimal"></div><div class="field"><label for="kh-b">${T('Breedte (m)', 'Width (m)')}</label><input id="kh-b" name="breedte" type="number" min="0" step="any" inputmode="decimal"></div><div class="field"><label for="kh-h">${T('Hoogte (m)', 'Height (m)')}</label><input id="kh-h" name="hoogte" type="number" min="0" step="any" inputmode="decimal"></div></div><p class="field__hint">${T('Optioneel. Laat leeg als u het niet weet.', "Optional. Leave empty if you don't know.")}</p>`]
  ];
  const body = `
<section class="page-head page-head--slim"><div class="container container--narrow"><h1>${T('Welke oplossing heb ik nodig?', 'Which solution do I need?')}</h1><p class="lead">${T('Beantwoord zes korte vragen. U ziet direct welke oplossingen geschikt kunnen zijn.', 'Answer six short questions. You will immediately see which solutions may be suitable.')}</p></div></section>
<section class="section section--tight"><div class="container container--narrow">
  <form class="wizard" action="/offerte-aanvragen/" method="get" data-wizard novalidate>
    <input type="hidden" name="bron" value="keuzehulp">
    <div class="wizard__progress" aria-hidden="true"><div class="wizard__bar" data-wizard-bar></div></div>
    <p class="wizard__count" data-wizard-count aria-live="polite">${T('Vraag', 'Question')} 1 ${T('van', 'of')} ${steps.length}</p>
    ${steps.map(([key, q, inner], i) => `<fieldset class="wizard__step" data-step="${key}" ${i ? 'data-hidden' : ''}><legend><h2 class="wizard__q" tabindex="-1">${q}</h2></legend>${inner}</fieldset>`).join('')}
    <div class="wizard__nav">
      <button class="btn btn--ghost" type="button" data-wizard-prev hidden>${T('Vorige', 'Previous')}</button>
      <button class="btn btn--primary" type="button" data-wizard-next>${T('Volgende', 'Next')} ${icon('arrow')}</button>
      <noscript><button class="btn btn--primary" type="submit">${T('Verstuur naar een specialist', 'Send to a specialist')}</button></noscript>
    </div>
    <p class="wizard__error" role="alert" data-wizard-error hidden>${T('Maak een keuze om verder te gaan.', 'Please make a choice to continue.')}</p>
  </form>
  <section class="wizard-result" data-wizard-result hidden aria-labelledby="h-result">
    <h2 id="h-result" tabindex="-1">${T('Op basis van uw antwoorden kunnen deze oplossingen geschikt zijn', 'Based on your answers, these solutions may be suitable')}</h2>
    <div data-result-summary class="result-summary"></div>
    <div class="cat-grid cat-grid--compact" data-result-cats></div>
    <div data-result-products></div>
    <div class="notice">${icon('info')}<p>${T('Dit is een eerste indicatie.', 'This is a first indication.')} ${ctx.t.requirementsNote}</p></div>
    <div class="btn-row"><a class="btn btn--primary btn--lg" href="/offerte-aanvragen/?bron=keuzehulp" data-result-cta>${T('Laat een specialist meekijken', 'Have a specialist take a look')}</a><button class="btn btn--ghost" type="button" data-wizard-restart>${T('Opnieuw beginnen', 'Start again')}</button></div>
  </section>
</div></section>
<script type="application/json" id="kh-data">${JSON.stringify({ categories: catData, products: prodData }).replace(/</g, '\\u003c')}</script>`;
  return { path: '/keuzehulp/', title: T('Keuzehulp: welke oplossing heb ik nodig? | EnviroFlow', 'Selection guide: which solution do I need? | EnviroFlow'), description: T('Beantwoord zes korte vragen over uw vloeistof, hoeveelheid en locatie en zie welke opvangbak, tank of waterkering geschikt kan zijn.', 'Answer six short questions about your liquid, quantity and location and see which spill tray, tank or flood barrier may be suitable.'), body, crumbs: [{ name: 'Home', url: '/' }, { name: T('Keuzehulp', 'Selection guide'), url: '/keuzehulp/' }], scripts: ['/assets/js/keuzehulp.js'] };
}
