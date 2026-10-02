// Oplossingen, sectoren, projecten, kennisbank, over ons, partners, contact, juridisch, zoeken en 404.
import { esc, ph, icon, media, adviceBlock, ctaBand, productCard, categoryCard, field, honeypot, formStatus } from './ui.mjs';
import { stepsList } from './pages-shop.mjs';

const H = { name: 'Home', url: '/' };
const sourcesBlock = (sources) => sources?.length ? `<div class="sources"><h3>Officiële bronnen</h3><ul>${sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul><p class="small muted">Dit is algemene informatie. Welke eisen voor uw situatie gelden, bepaalt het bevoegd gezag.</p></div>` : '';

/* ---------------------------------------------------------------- oplossingen */
export function solutionsOverview(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>Oplossingen</h1><p class="lead">Begin bij uw situatie. Per vraagstuk leest u waar u op let en welke oplossingen passen.</p></div></section>
<section class="section section--tight"><div class="container problem-grid">${ctx.solutions.map((s) => `<a class="ptile" href="/oplossingen/${s.slug}/"><span>${esc(s.tile)}</span>${icon('arrow')}</a>`).join('')}<a class="ptile ptile--alt" href="/keuzehulp/"><span>Iets anders? Gebruik de keuzehulp</span>${icon('compass')}</a></div></section>
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  return { path: '/oplossingen/', title: 'Oplossingen per situatie | EnviroFlow', description: "IBC's opslaan, tijdelijke wateropslag, bluswater, brandstof, mest of wateroverlast: bekijk de oplossingen van EnviroFlow per situatie.", body, crumbs: [H, { name: 'Oplossingen', url: '/oplossingen/' }] };
}

export function solutionPage(s, ctx) {
  const cats = s.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);
  const prods = ctx.products.filter((p) => s.categories.includes(p.category)).slice(0, 6);
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><p class="eyebrow">Oplossing</p><h1>${esc(s.title)}</h1>${s.problem.map((p, i) => `<p class="${i ? '' : 'lead'}">${esc(p)}</p>`).join('')}<a class="btn btn--primary" href="/offerte-aanvragen/?type=advies">Bespreek uw situatie</a></div>${media({ alt: `Foto: ${s.title.toLowerCase()} in de praktijk` }, '4-3')}</div></section>
<section class="section section--tight section--grey"><div class="container split"><div><h2>Waar let u op?</h2><ul class="check-list">${s.attention.map((a) => `<li>${icon('check')}${esc(a)}</li>`).join('')}</ul></div>${sourcesBlock(s.sources)}</div></section>
<section class="section section--tight"><div class="container"><h2>Mogelijke oplossingen</h2><div class="cat-grid">${cats.map((c) => categoryCard(c, ctx)).join('')}</div></div></section>
${prods.length ? `<section class="section section--tight"><div class="container"><h2>Passende producten</h2><div class="product-grid product-grid--3">${prods.map((p) => productCard(p, ctx)).join('')}</div></div></section>` : ''}
${ctaBand({ title: 'Bespreek uw situatie', text: 'Elke situatie is anders. Vertel ons wat u nodig heeft, dan denken wij mee.', buttons: [{ label: 'Bespreek uw situatie', href: '/offerte-aanvragen/?type=advies', cls: 'btn--accent' }, { label: ctx.site.phonePrimary.display, href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: `/oplossingen/${s.slug}/`, title: s.seoTitle, description: s.seoDescription, body, crumbs: [H, { name: 'Oplossingen', url: '/oplossingen/' }, { name: s.title, url: `/oplossingen/${s.slug}/` }] };
}

/* ---------------------------------------------------------------- sectoren */
export function sectorsOverview(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>Sectoren</h1><p class="lead">Elke sector heeft eigen vloeistoffen, risico's en omstandigheden. Bekijk welke oplossingen bij uw sector passen.</p></div></section>
<section class="section section--tight"><div class="container"><div class="sector-cards">${ctx.sectors.map((s) => `<a class="scard" href="/sectoren/${s.slug}/"><h2>${esc(s.name)}</h2><p>${esc(s.intro)}</p><span class="link-arrow">Bekijk oplossingen ${icon('arrow')}</span></a>`).join('')}</div></div></section>`;
  return { path: '/sectoren/', title: 'Sectoren | Vloeistofopslag en opvang per branche | EnviroFlow', description: 'Oplossingen voor industrie, bouw & infra, landbouw, automotive, transport, gemeenten, brandweer, evenementen en scheepvaart.', body, crumbs: [H, { name: 'Sectoren', url: '/sectoren/' }] };
}

export function sectorPage(s, ctx) {
  const cats = s.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><p class="eyebrow">Sector</p><h1>${esc(s.name)}</h1><p class="lead">${esc(s.intro)}</p><a class="btn btn--primary" href="/offerte-aanvragen/?type=advies">Advies aanvragen</a></div>${media({ alt: `Foto: toepassing in de sector ${s.name.toLowerCase()}` }, '4-3')}</div></section>
<section class="section section--tight section--grey"><div class="container split">
  <div><h2>Typische vloeistoffen</h2><ul class="check-list">${s.liquids.map((l) => `<li>${icon('drop')}${esc(l)}</li>`).join('')}</ul></div>
  <div><h2>Veelvoorkomende risico's</h2><ul class="check-list">${s.risks.map((l) => `<li>${icon('info')}${esc(l)}</li>`).join('')}</ul></div>
</div></section>
<section class="section section--tight"><div class="container"><h2>Passende EXFLO-oplossingen</h2><div class="cat-grid">${cats.map((c) => categoryCard(c, ctx)).join('')}</div></div></section>
${ctaBand({ title: `Oplossing nodig voor uw bedrijf in ${s.name.toLowerCase()}?`, text: 'Wij denken mee over de juiste opvang of opslag voor uw situatie.', buttons: [{ label: 'Offerte aanvragen', href: '/offerte-aanvragen/', cls: 'btn--accent' }, { label: 'Bel een specialist', href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: `/sectoren/${s.slug}/`, title: `${s.name}: vloeistofopslag en opvang | EnviroFlow`, description: `${s.intro} Bekijk passende oplossingen voor ${s.name.toLowerCase()}.`, body, crumbs: [H, { name: 'Sectoren', url: '/sectoren/' }, { name: s.name, url: `/sectoren/${s.slug}/` }] };
}

/* ---------------------------------------------------------------- projecten */
export function projectsPage() {
  const body = `
<section class="page-head"><div class="container"><h1>Projecten</h1><p class="lead">Hier verschijnen binnenkort projecten van EnviroFlow. Elk project beschrijven wij volgens dezelfde opbouw: situatie, uitdaging, oplossing en resultaat.</p></div></section>
<section class="section section--tight"><div class="container">
  <article class="project-card">
    <span class="tag tag--amber">Voorbeeldsituatie</span>
    <div class="project-card__grid">
      ${media({ alt: 'Foto: [PROJECTFOTO – volgt bij eerste project]' }, '4-3')}
      <div>
        <h2>[TITEL PROJECT]</h2>
        <p class="muted">[SECTOR] · [LOCATIE]</p>
        <p>Dit is een sjabloon. Er worden hier geen projecten van derden getoond.</p>
        <a class="link-arrow" href="/projecten/voorbeeldsituatie/">Bekijk het sjabloon ${icon('arrow')}</a>
      </div>
    </div>
  </article>
</div></section>`;
  return { path: '/projecten/', title: 'Projecten | EnviroFlow', description: 'Projecten van EnviroFlow: situatie, uitdaging, oplossing en resultaat.', body, crumbs: [H, { name: 'Projecten', url: '/projecten/' }] };
}

export function projectTemplatePage(ctx) {
  const block = (h, txt) => `<section class="pd-block"><h2>${h}</h2><p>${ph(txt)}</p></section>`;
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><span class="tag tag--amber">Voorbeeldsituatie</span><h1>[TITEL PROJECT]</h1><p class="lead">${ph('[KORTE SAMENVATTING VAN HET PROJECT]')}</p>
<dl class="facts"><div><dt>Sector</dt><dd>${ph('[SECTOR]')}</dd></div><div><dt>Locatie</dt><dd>${ph('[PLAATS]')}</dd></div><div><dt>Product</dt><dd>${ph('[PRODUCT]')}</dd></div></dl></div>${media({ alt: 'Foto: [PROJECTFOTO]' }, '4-3')}</div></section>
<section class="section section--tight"><div class="container container--narrow">
  ${block('Situatie', '[TEKST VOLGT: beschrijf de klant en de uitgangssituatie]')}
  ${block('Uitdaging', '[TEKST VOLGT: welk probleem moest worden opgelost?]')}
  ${block('Oplossing', '[TEKST VOLGT: welke oplossing is gekozen en waarom?]')}
  ${block('Resultaat', '[TEKST VOLGT: wat is het resultaat voor de klant? Alleen feitelijke, door de klant bevestigde informatie.]')}
</div></section>
${ctaBand({ title: 'Een vergelijkbare situatie?', text: 'Bespreek uw situatie met ons.', buttons: [{ label: 'Bespreek uw situatie', href: '/offerte-aanvragen/?type=advies', cls: 'btn--accent' }] })}`;
  return { path: '/projecten/voorbeeldsituatie/', title: 'Voorbeeldsituatie (sjabloon) | EnviroFlow', description: 'Sjabloon voor projectbeschrijvingen van EnviroFlow.', body, noindex: true, crumbs: [H, { name: 'Projecten', url: '/projecten/' }, { name: 'Voorbeeldsituatie', url: '/projecten/voorbeeldsituatie/' }] };
}

/* ---------------------------------------------------------------- kennisbank */
export function knowledgeOverview(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>Kennisbank</h1><p class="lead">Praktische uitleg over opvangen, opslaan en verplaatsen van vloeistoffen. Bij wet- en regelgeving verwijzen wij naar de officiële bron.</p></div></section>
<section class="section section--tight"><div class="container"><div class="article-grid">${ctx.articles.map((a) => `<a class="acard" href="/kennisbank/${a.slug}/">${media({ alt: `Illustratie bij: ${a.title}` }, '16-9')}<div class="acard__body"><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><span class="link-arrow">Lees artikel ${icon('arrow')}</span></div></a>`).join('')}</div></div></section>`;
  return { path: '/kennisbank/', title: 'Kennisbank: lekbakken, flexibele tanks en opslag | EnviroFlow', description: 'Artikelen over flexibele lekbakken, IBC opvangbakken, opvangcapaciteit, flexibele tanks, bluswater, mest, brandstof en wateroverlast.', body, crumbs: [H, { name: 'Kennisbank', url: '/kennisbank/' }] };
}

export function articlePage(a, ctx) {
  const cats = a.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);
  const others = ctx.articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const body = `
<article class="article">
  <header class="article__head container container--narrow"><p class="eyebrow">Kennisbank</p><h1>${esc(a.title)}</h1><p class="lead">${esc(a.intro)}</p></header>
  <div class="container container--narrow article__body">
    ${media({ alt: `Illustratie bij: ${a.title}` }, '16-9')}
    ${a.sections.map((s) => `<h2>${esc(s.h)}</h2>${(s.p || []).map((p) => `<p>${esc(p)}</p>`).join('')}${s.list ? `<ul class="check-list">${s.list.map((l) => `<li>${icon('check')}${esc(l)}</li>`).join('')}</ul>` : ''}`).join('')}
    ${sourcesBlock(a.sources)}
    <div class="notice">${icon('info')}<p>${ctx.t.requirementsNote}</p></div>
  </div>
</article>
${cats.length ? `<section class="section section--tight section--grey"><div class="container"><h2>Bijbehorende oplossingen</h2><div class="cat-grid cat-grid--compact">${cats.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div></div></section>` : ''}
<section class="section section--tight"><div class="container"><h2>Meer uit de kennisbank</h2><ul class="link-list">${others.map((o) => `<li><a href="/kennisbank/${o.slug}/">${esc(o.title)}${icon('arrow')}</a></li>`).join('')}</ul></div></section>
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, inLanguage: 'nl-NL', mainEntityOfPage: ctx.site.baseUrl + `/kennisbank/${a.slug}/`, author: { '@type': 'Organization', name: 'EnviroFlow' }, publisher: { '@type': 'Organization', name: 'EnviroFlow', logo: { '@type': 'ImageObject', url: ctx.site.baseUrl + '/assets/img/enviroflow-logo.png' } } };
  if (a.datePublished) ld.datePublished = a.datePublished;
  return { path: `/kennisbank/${a.slug}/`, title: `${a.title} | Kennisbank EnviroFlow`, description: a.description, body, crumbs: [H, { name: 'Kennisbank', url: '/kennisbank/' }, { name: a.title, url: `/kennisbank/${a.slug}/` }], jsonld: [ld] };
}

/* ---------------------------------------------------------------- over ons & partners */
export function aboutPage(ctx) {
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><h1>Over EnviroFlow</h1><p class="lead">EnviroFlow is een jong bedrijf, opgericht door twee broers. Wij helpen bedrijven om vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen.</p></div>${media({ alt: 'Foto: de twee oprichters van EnviroFlow bij een flexibele opvangbak [FOTO VOLGT]' }, '4-3')}</div></section>
<section class="section section--tight"><div class="container split">
  <div><h2>Waar wij voor staan</h2><p>Wij zijn geen webshop die zo goedkoop mogelijk levert. Wij willen eerst begrijpen wat uw situatie is: welke vloeistof, hoeveel, waar en hoe lang. Daarna zoeken we de oplossing die daarbij past, standaard of op maat.</p><p>U heeft bij ons korte lijnen en persoonlijk contact. U belt of mailt rechtstreeks met de mensen die uw aanvraag behandelen.</p></div>
  <div><h2>Onze ambitie</h2><p>Wij beginnen met de flexibele oplossingen van EXFLO. Ons doel is om uit te groeien tot een vaste partner voor alles rond opslag en opvang van vloeistoffen. Het assortiment breiden wij stap voor stap uit, onder meer met lekbakken van staal en kunststof, spill kits, absorptiemateriaal, pompen en slangen.</p></div>
</div></section>
<section class="section section--grey"><div class="container"><h2>Hoe wij werken</h2>${stepsList()}</div></section>
${ctaBand({ title: 'Kennismaken?', text: 'Bel of mail ons. Wij horen graag waar u mee bezig bent.', buttons: [{ label: 'Neem contact op', href: '/contact/', cls: 'btn--accent' }, { label: ctx.site.phonePrimary.display, href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: '/over-ons/', title: 'Over EnviroFlow | Persoonlijk advies in vloeistofopslag', description: 'EnviroFlow is een jong bedrijf, opgericht door twee broers. Korte lijnen, persoonlijk contact en praktisch advies over vloeistofopslag en opvang.', body, crumbs: [H, { name: 'Over ons', url: '/over-ons/' }] };
}

export function partnersPage(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>Partners</h1><p class="lead">EnviroFlow werkt samen met fabrikanten die wij kennen en vertrouwen.</p></div></section>
<section class="section section--tight"><div class="container"><div class="cat-grid">${ctx.brands.filter((b) => b.active).map((b) => `<a class="ccard" href="/partners/${b.slug}/"><div class="logo-ph logo-ph--card">${b.logo ? `<img class="partner-logo" src="${b.logo}" alt="${esc(b.name)} logo" width="280" height="105">` : ph(b.logoPlaceholder)}</div><div class="ccard__body"><h2>${esc(b.name)}</h2><p>${esc(b.intro)}</p><span class="link-arrow">Meer over ${esc(b.name)} ${icon('arrow')}</span></div></a>`).join('')}</div></div></section>`;
  return { path: '/partners/', title: 'Partners | EnviroFlow', description: 'De fabrikanten waarmee EnviroFlow samenwerkt.', body, crumbs: [H, { name: 'Partners', url: '/partners/' }] };
}

export function brandPage(b, ctx) {
  const lines = ctx.products.filter((p) => p.brand === b.id && p.line).filter((p, i, arr) => arr.findIndex((x) => x.line === p.line) === i);
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><p class="eyebrow">Partner</p><h1>${esc(b.name)}</h1><p class="lead">${esc(b.intro)}</p><p>EnviroFlow is ${ph(ctx.site.partnerRelation)} van ${esc(b.name)}.</p></div><div class="logo-ph logo-ph--lg logo-ph--filled">${b.logo ? `<img class="partner-logo" src="${b.logo}" alt="${esc(b.name)} logo" width="280" height="105">` : ph(b.logoPlaceholder)}</div></div></section>
<section class="section section--tight"><div class="container split">
  <div><h2>Over ${esc(b.name)}</h2><p>${esc(b.name)} is een fabrikant uit ${esc(b.country)} van flexibele tanks, opvangbakken, waterkeringen en matten van technisch textiel. Het bedrijf is actief sinds ${esc(b.since)}.</p><p>EnviroFlow is geen fabrikant. Wij adviseren, leveren en denken mee over de toepassing van ${esc(b.name)}-producten in Nederland.</p></div>
  <div><h2>Productlijnen</h2><ul class="check-list">${lines.map((p) => `<li>${icon('check')}<a href="${ctx.urls.product(p)}">${esc(p.line)}</a>: ${esc(p.short)}</li>`).join('')}</ul></div>
</div></section>
<section class="section section--tight section--grey"><div class="container"><h2>Alle productgroepen</h2><div class="cat-grid cat-grid--compact">${ctx.categories.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div></div></section>`;
  return { path: `/partners/${b.slug}/`, title: `${b.name}: flexibele tanks en opvangbakken | EnviroFlow`, description: `${b.intro}`, body, crumbs: [H, { name: 'Partners', url: '/partners/' }, { name: b.name, url: `/partners/${b.slug}/` }] };
}

/* ---------------------------------------------------------------- contact */
export function contactPage(ctx) {
  const { site } = ctx;
  const a = site.address;
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>Contact</h1><p class="lead">Bel, mail of stuur ons een bericht. Wij nemen zo snel mogelijk contact met u op.</p></div></section>
<section class="section section--tight"><div class="container split split--form">
  <div>
    <div class="contact-cards">
      <a class="contact-card" href="tel:${site.phonePrimary.tel}">${icon('phone')}<span><small>Telefoon</small>${site.phonePrimary.display}</span></a>
      <a class="contact-card" href="tel:${site.phoneSecondary.tel}">${icon('phone')}<span><small>Telefoon</small>${site.phoneSecondary.display}</span></a>
      <a class="contact-card" href="mailto:${site.email}">${icon('mail')}<span><small>E-mail</small>${site.email}</span></a>
      <div class="contact-card">${icon('pin')}<span><small>Adres</small>${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}</span></div>
    </div>
    <dl class="facts facts--stack"><div><dt>KvK-nummer</dt><dd>${esc(site.kvk)}</dd></div><div><dt>Btw-nummer</dt><dd>${ph(site.vatNumber)}</dd></div><div><dt>Werkgebied</dt><dd>${esc(site.serviceArea)}</dd></div></dl>
    <div class="link-cards">
      <a class="link-card" href="/offerte-aanvragen/">${icon('clipboard')}<span><strong>Offerte aanvragen</strong>Voor een concreet product of project</span></a>
      <a class="link-card" href="/offerte-aanvragen/?type=advies" id="advies">${icon('chat')}<span><strong>Advies aanvragen</strong>Weet u nog niet welke oplossing past?</span></a>
      <a class="link-card" href="/maatwerk-aanvragen/">${icon('ruler')}<span><strong>Maatwerk aanvragen</strong>Afwijkende maat of uitvoering</span></a>
    </div>
  </div>
  <form class="form card" action="/api/contact" method="post" data-form="contact" novalidate>
    <h2 class="form-title">Stuur ons een bericht</h2>
    ${honeypot()}
    <div class="form-grid">
      ${field({ name: 'name', label: 'Naam', required: true, autocomplete: 'name' })}
      ${field({ name: 'company', label: 'Bedrijfsnaam', autocomplete: 'organization' })}
      ${field({ name: 'email', label: 'E-mailadres', type: 'email', required: true, autocomplete: 'email' })}
      ${field({ name: 'phone', label: 'Telefoonnummer', type: 'tel', autocomplete: 'tel' })}
      ${field({ name: 'message', label: 'Uw vraag', type: 'textarea', required: true, rows: 6, full: true })}
    </div>
    <label class="check"><input type="checkbox" name="privacy" value="1" required><span>Ik ga akkoord dat EnviroFlow mijn gegevens gebruikt om op mijn vraag te reageren (zie <a href="/privacybeleid/">privacybeleid</a>). <span class="req" aria-hidden="true">*</span></span></label>
    ${formStatus()}
    <button class="btn btn--primary" type="submit" data-submit>Bericht versturen</button>
  </form>
</div></section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact EnviroFlow', url: site.baseUrl + '/contact/' };
  return { path: '/contact/', title: 'Contact | EnviroFlow', description: `Neem contact op met EnviroFlow: ${site.phonePrimary.display}, ${site.phoneSecondary.display} of ${site.email}. ${a.street}, ${a.city}.`, body, crumbs: [H, { name: 'Contact', url: '/contact/' }], jsonld: [ld], scripts: ['/assets/js/forms.js'] };
}

/* ---------------------------------------------------------------- juridisch, zoeken, 404 */
export function legalPage({ slug, title, extra = '' }) {
  const body = `<section class="section"><div class="container container--narrow prose"><h1>${esc(title)}</h1>${extra}<p>${ph('[TEKST VOLGT]')}</p></div></section>`;
  return { path: `/${slug}/`, title: `${title} | EnviroFlow`, description: `${title} van EnviroFlow.`, body, crumbs: [H, { name: title, url: `/${slug}/` }] };
}

export function searchPage() {
  const body = `<section class="page-head page-head--slim"><div class="container"><h1>Zoeken</h1>
<form class="search search--page" role="search" action="/zoeken/" method="get"><label class="sr-only" for="q-page">Zoekterm</label><input id="q-page" name="q" type="search" placeholder="Zoek op product, toepassing of vloeistof"><button class="btn btn--primary" type="submit">${icon('search')}Zoeken</button></form></div></section>
<section class="section section--tight"><div class="container"><p data-search-summary aria-live="polite"></p><ul class="search-list" data-search-page></ul><noscript><p>Schakel JavaScript in om te zoeken, of bekijk het <a href="/producten/">productoverzicht</a>.</p></noscript></div></section>`;
  return { path: '/zoeken/', title: 'Zoeken | EnviroFlow', description: 'Zoek in producten, oplossingen en kennisbank van EnviroFlow.', body, noindex: true, crumbs: [H, { name: 'Zoeken', url: '/zoeken/' }] };
}

export function notFoundPage(ctx) {
  const body = `<section class="section"><div class="container container--narrow thanks"><h1>Pagina niet gevonden</h1><p class="lead">Deze pagina bestaat niet (meer). Zoek verder of neem contact met ons op.</p><div class="btn-row"><a class="btn btn--primary" href="/producten/">Naar de producten</a><a class="btn btn--ghost" href="/contact/">Contact</a><a class="btn btn--ghost" href="tel:${ctx.site.phonePrimary.tel}">${icon('phone')}${ctx.site.phonePrimary.display}</a></div></div></section>`;
  return { path: '/404.html', title: 'Pagina niet gevonden | EnviroFlow', description: 'Deze pagina bestaat niet.', body, noindex: true, file: '404.html' };
}
