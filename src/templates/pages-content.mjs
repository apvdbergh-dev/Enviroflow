// Oplossingen, sectoren, projecten, kennisbank, over ons, partners, contact, juridisch, zoeken en 404.
import { esc, ph, icon, media, adviceBlock, ctaBand, productCard, categoryCard, field, honeypot, formStatus } from './ui.mjs';
import { stepsList } from './pages-shop.mjs';
import { T } from '../lib/i18n.mjs';

const H = { name: 'Home', url: '/' };
const COUNTRY_EN = { Polen: 'Poland' };
/** Foto van de eerste gekoppelde categorie met een foto. */
const heroImg = (cats, label) => { const c = (cats || []).find((x) => x && x.imageSrc); return c ? { src: c.imageSrc, alt: c.image } : { alt: `${T('Foto', 'Photo')}: ${label}` }; };
const sourcesBlock = (sources) => sources?.length ? `<div class="sources"><h3>${T('Officiële bronnen', 'Official sources')}</h3><ul>${sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a></li>`).join('')}</ul><p class="small muted">${T('Dit is algemene informatie. Welke eisen voor uw situatie gelden, bepaalt het bevoegd gezag.', 'This is general information. Which requirements apply to your situation is determined by the competent authority (Dutch: bevoegd gezag).')}</p></div>` : '';

/* ---------------------------------------------------------------- oplossingen */
export function solutionsOverview(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>${T('Oplossingen', 'Solutions')}</h1><p class="lead">${T('Begin bij uw situatie. Per vraagstuk leest u waar u op let en welke oplossingen passen.', 'Start from your situation. For each issue, read what to look out for and which solutions fit.')}</p></div></section>
<section class="section section--tight"><div class="container problem-grid">${ctx.solutions.map((s) => `<a class="ptile" href="/oplossingen/${s.slug}/"><span>${esc(s.tile)}</span>${icon('arrow')}</a>`).join('')}<a class="ptile ptile--alt" href="/keuzehulp/"><span>${T('Iets anders? Gebruik de keuzehulp', 'Something else? Use the selection guide')}</span>${icon('compass')}</a></div></section>
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  return { path: '/oplossingen/', title: T('Oplossingen per situatie | EnviroFlow', 'Solutions by situation | EnviroFlow'), description: T("IBC's opslaan, tijdelijke wateropslag, bluswater, brandstof, mest of wateroverlast: bekijk de oplossingen van EnviroFlow per situatie.", 'Storing IBCs, temporary water storage, fire water, fuel, manure or flooding: view the EnviroFlow solutions by situation.'), body, crumbs: [H, { name: T('Oplossingen', 'Solutions'), url: '/oplossingen/' }] };
}

export function solutionPage(s, ctx) {
  const cats = s.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);
  const prods = ctx.products.filter((p) => s.categories.includes(p.category)).slice(0, 6);
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><p class="eyebrow">${T('Oplossing', 'Solution')}</p><h1>${esc(s.title)}</h1>${s.problem.map((p, i) => `<p class="${i ? '' : 'lead'}">${esc(p)}</p>`).join('')}<a class="btn btn--primary" href="/offerte-aanvragen/?type=advies">${T('Bespreek uw situatie', 'Discuss your situation')}</a></div>${media(heroImg(cats, s.title), '4-3', true)}</div></section>
<section class="section section--tight section--grey"><div class="container split"><div><h2>${T('Waar let u op?', 'What to look out for')}</h2><ul class="check-list">${s.attention.map((a) => `<li>${icon('check')}${esc(a)}</li>`).join('')}</ul></div>${sourcesBlock(s.sources)}</div></section>
<section class="section section--tight"><div class="container"><h2>${T('Mogelijke oplossingen', 'Possible solutions')}</h2><div class="cat-grid">${cats.map((c) => categoryCard(c, ctx)).join('')}</div></div></section>
${prods.length ? `<section class="section section--tight"><div class="container"><h2>${T('Passende producten', 'Suitable products')}</h2><div class="product-grid product-grid--3">${prods.map((p) => productCard(p, ctx)).join('')}</div></div></section>` : ''}
${ctaBand({ title: T('Bespreek uw situatie', 'Discuss your situation'), text: T('Elke situatie is anders. Vertel ons wat u nodig heeft, dan denken wij mee.', 'Every situation is different. Tell us what you need and we will think along with you.'), buttons: [{ label: T('Bespreek uw situatie', 'Discuss your situation'), href: '/offerte-aanvragen/?type=advies', cls: 'btn--accent' }, { label: ctx.site.phonePrimary.display, href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: `/oplossingen/${s.slug}/`, title: s.seoTitle, description: s.seoDescription, body, crumbs: [H, { name: T('Oplossingen', 'Solutions'), url: '/oplossingen/' }, { name: s.title, url: `/oplossingen/${s.slug}/` }] };
}

/* ---------------------------------------------------------------- sectoren */
export function sectorsOverview(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>${T('Sectoren', 'Sectors')}</h1><p class="lead">${T("Elke sector heeft eigen vloeistoffen, risico's en omstandigheden. Bekijk welke oplossingen bij uw sector passen.", 'Every sector has its own liquids, risks and conditions. See which solutions fit your sector.')}</p></div></section>
<section class="section section--tight"><div class="container"><div class="sector-cards">${ctx.sectors.map((s) => `<a class="scard" href="/sectoren/${s.slug}/"><h2>${esc(s.name)}</h2><p>${esc(s.intro)}</p><span class="link-arrow">${T('Bekijk oplossingen', 'View solutions')} ${icon('arrow')}</span></a>`).join('')}</div></div></section>`;
  return { path: '/sectoren/', title: T('Sectoren | Vloeistofopslag en opvang per branche | EnviroFlow', 'Sectors | Liquid storage and containment by industry | EnviroFlow'), description: T('Oplossingen voor industrie, bouw & infra, landbouw, automotive, transport, gemeenten, brandweer, evenementen en scheepvaart.', 'Solutions for industry, construction & infrastructure, agriculture, automotive, transport, municipalities, fire services, events and shipping.'), body, crumbs: [H, { name: T('Sectoren', 'Sectors'), url: '/sectoren/' }] };
}

export function sectorPage(s, ctx) {
  const cats = s.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><p class="eyebrow">Sector</p><h1>${esc(s.name)}</h1><p class="lead">${esc(s.intro)}</p><a class="btn btn--primary" href="/offerte-aanvragen/?type=advies">${T('Advies aanvragen', 'Request advice')}</a></div>${media(heroImg(cats, s.name), '4-3', true)}</div></section>
<section class="section section--tight section--grey"><div class="container split">
  <div><h2>${T('Typische vloeistoffen', 'Typical liquids')}</h2><ul class="check-list">${s.liquids.map((l) => `<li>${icon('drop')}${esc(l)}</li>`).join('')}</ul></div>
  <div><h2>${T("Veelvoorkomende risico's", 'Common risks')}</h2><ul class="check-list">${s.risks.map((l) => `<li>${icon('info')}${esc(l)}</li>`).join('')}</ul></div>
</div></section>
<section class="section section--tight"><div class="container"><h2>${T('Passende EXFLO-oplossingen', 'Suitable EXFLO solutions')}</h2><div class="cat-grid">${cats.map((c) => categoryCard(c, ctx)).join('')}</div></div></section>
${ctaBand({ title: T(`Oplossing nodig voor uw bedrijf in ${s.name.toLowerCase()}?`, `Need a solution for your business in ${s.name.toLowerCase()}?`), text: T('Wij denken mee over de juiste opvang of opslag voor uw situatie.', 'We help you find the right containment or storage for your situation.'), buttons: [{ label: T('Offerte aanvragen', 'Request a quote'), href: '/offerte-aanvragen/', cls: 'btn--accent' }, { label: T('Bel een specialist', 'Call a specialist'), href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: `/sectoren/${s.slug}/`, title: T(`${s.name}: vloeistofopslag en opvang | EnviroFlow`, `${s.name}: liquid storage and containment | EnviroFlow`), description: T(`${s.intro} Bekijk passende oplossingen voor ${s.name.toLowerCase()}.`, `${s.intro} View suitable solutions for ${s.name.toLowerCase()}.`), body, crumbs: [H, { name: T('Sectoren', 'Sectors'), url: '/sectoren/' }, { name: s.name, url: `/sectoren/${s.slug}/` }] };
}

/* ---------------------------------------------------------------- projecten */
export function projectsPage() {
  const body = `
<section class="page-head"><div class="container"><h1>${T('Projecten', 'Projects')}</h1><p class="lead">${T('Hier verschijnen binnenkort projecten van EnviroFlow. Elk project beschrijven wij volgens dezelfde opbouw: situatie, uitdaging, oplossing en resultaat.', 'EnviroFlow projects will appear here soon. We describe each project with the same structure: situation, challenge, solution and result.')}</p></div></section>
<section class="section section--tight"><div class="container container--narrow">
  <div class="notice" role="note"><p>${T('Wij werken aan de eerste projectverhalen. Wilt u weten wat wij voor uw situatie kunnen betekenen? Wij denken graag met u mee.', 'We are working on our first project stories. Would you like to know what we can do for your situation? We are happy to think along with you.')}</p></div>
  <div class="btn-row"><a class="btn btn--primary" href="/offerte-aanvragen/">${T('Advies of offerte aanvragen', 'Request advice or a quote')}</a><a class="btn btn--ghost" href="/oplossingen/">${T('Bekijk oplossingen', 'View solutions')}</a></div>
</div></section>`;
  return { path: '/projecten/', title: T('Projecten | EnviroFlow', 'Projects | EnviroFlow'), description: T('Projecten van EnviroFlow: situatie, uitdaging, oplossing en resultaat.', 'EnviroFlow projects: situation, challenge, solution and result.'), body, crumbs: [H, { name: T('Projecten', 'Projects'), url: '/projecten/' }] };
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
  const body = `<section class="page-head"><div class="container"><h1>${T('Kennisbank', 'Knowledge base')}</h1><p class="lead">${T('Praktische uitleg over opvangen, opslaan en verplaatsen van vloeistoffen. Bij wet- en regelgeving verwijzen wij naar de officiële bron.', 'Practical explanations about containing, storing and moving liquids. For laws and regulations, we refer to the official source.')}</p></div></section>
<section class="section section--tight"><div class="container"><div class="article-grid">${ctx.articles.map((a) => `<a class="acard" href="/kennisbank/${a.slug}/">${media(heroImg(a.categories.map((id) => ctx.categoryById[id]), a.title), '16-9')}<div class="acard__body"><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p><span class="link-arrow">${T('Lees artikel', 'Read article')} ${icon('arrow')}</span></div></a>`).join('')}</div></div></section>`;
  return { path: '/kennisbank/', title: T('Kennisbank: lekbakken, flexibele tanks en opslag | EnviroFlow', 'Knowledge base: spill trays, flexible tanks and storage | EnviroFlow'), description: T('Artikelen over flexibele lekbakken, IBC opvangbakken, opvangcapaciteit, flexibele tanks, bluswater, mest, brandstof en wateroverlast.', 'Articles about flexible spill trays, IBC spill trays, containment capacity, flexible tanks, fire water, manure, fuel and flooding.'), body, crumbs: [H, { name: T('Kennisbank', 'Knowledge base'), url: '/kennisbank/' }] };
}

export function articlePage(a, ctx) {
  const cats = a.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);
  const others = ctx.articles.filter((x) => x.slug !== a.slug).slice(0, 3);
  const body = `
<article class="article">
  <header class="article__head container container--narrow"><p class="eyebrow">${T('Kennisbank', 'Knowledge base')}</p><h1>${esc(a.title)}</h1><p class="lead">${esc(a.intro)}</p></header>
  <div class="container container--narrow article__body">
    ${media(heroImg(cats, a.title), '16-9', true)}
    ${a.sections.map((s) => `<h2>${esc(s.h)}</h2>${(s.p || []).map((p) => `<p>${esc(p)}</p>`).join('')}${s.list ? `<ul class="check-list">${s.list.map((l) => `<li>${icon('check')}${esc(l)}</li>`).join('')}</ul>` : ''}`).join('')}
    ${sourcesBlock(a.sources)}
    <div class="notice">${icon('info')}<p>${ctx.t.requirementsNote}</p></div>
  </div>
</article>
${cats.length ? `<section class="section section--tight section--grey"><div class="container"><h2>${T('Bijbehorende oplossingen', 'Related solutions')}</h2><div class="cat-grid cat-grid--compact">${cats.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div></div></section>` : ''}
<section class="section section--tight"><div class="container"><h2>${T('Meer uit de kennisbank', 'More from the knowledge base')}</h2><ul class="link-list">${others.map((o) => `<li><a href="/kennisbank/${o.slug}/">${esc(o.title)}${icon('arrow')}</a></li>`).join('')}</ul></div></section>
<div class="container section--tight">${adviceBlock(ctx.site)}</div>`;
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, inLanguage: T('nl-NL', 'en'), mainEntityOfPage: ctx.site.baseUrl + `/kennisbank/${a.slug}/`, author: { '@type': 'Organization', name: 'EnviroFlow' }, publisher: { '@type': 'Organization', name: 'EnviroFlow', logo: { '@type': 'ImageObject', url: ctx.site.baseUrl + '/assets/img/enviroflow-logo.png' } } };
  if (a.datePublished) ld.datePublished = a.datePublished;
  return { path: `/kennisbank/${a.slug}/`, title: `${a.title} | ${T('Kennisbank', 'Knowledge base')} EnviroFlow`, description: a.description, body, crumbs: [H, { name: T('Kennisbank', 'Knowledge base'), url: '/kennisbank/' }, { name: a.title, url: `/kennisbank/${a.slug}/` }], jsonld: [ld] };
}

/* ---------------------------------------------------------------- over ons & partners */
export function aboutPage(ctx) {
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><h1>${T('Over EnviroFlow', 'About EnviroFlow')}</h1><p class="lead">${T('EnviroFlow is een jong bedrijf, opgericht door twee broers. Wij helpen bedrijven om vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen.', 'EnviroFlow is a young company founded by two brothers. We help businesses store, contain and move liquids safely and practically.')}</p></div>${media({ src: '/assets/img/producten/opvangbak-praktijk.jpg', alt: T("IBC's in een flexibele opvangbak van EXFLO", 'IBCs in a flexible EXFLO spill tray') }, '4-3', true)}</div></section>
<section class="section section--tight"><div class="container split">
  <div><h2>${T('Waar wij voor staan', 'What we stand for')}</h2>${T('<p>Wij zijn geen webshop die zo goedkoop mogelijk levert. Wij willen eerst begrijpen wat uw situatie is: welke vloeistof, hoeveel, waar en hoe lang. Daarna zoeken we de oplossing die daarbij past, standaard of op maat.</p><p>U heeft bij ons korte lijnen en persoonlijk contact. U belt of mailt rechtstreeks met de mensen die uw aanvraag behandelen.</p>', '<p>We are not a web shop that simply delivers as cheaply as possible. We first want to understand your situation: which liquid, how much, where and for how long. Then we look for the solution that fits, standard or custom-made.</p><p>With us you get short lines of communication and personal contact. You call or email directly with the people handling your request.</p>')}</div>
  <div><h2>${T('Onze ambitie', 'Our ambition')}</h2><p>${T('Wij beginnen met de flexibele oplossingen van EXFLO. Ons doel is om uit te groeien tot een vaste partner voor alles rond opslag en opvang van vloeistoffen. Het assortiment breiden wij stap voor stap uit, onder meer met lekbakken van staal en kunststof, spill kits, absorptiemateriaal, pompen en slangen.', 'We are starting with the flexible solutions from EXFLO. Our goal is to grow into a regular partner for everything related to the storage and containment of liquids. We will expand the range step by step, including steel and plastic spill trays, spill kits, absorbents, pumps and hoses.')}</p></div>
</div></section>
<section class="section section--grey"><div class="container"><h2>${T('Hoe wij werken', 'How we work')}</h2>${stepsList()}</div></section>
${ctaBand({ title: T('Kennismaken?', 'Get to know us?'), text: T('Bel of mail ons. Wij horen graag waar u mee bezig bent.', 'Call or email us. We would love to hear what you are working on.'), buttons: [{ label: T('Neem contact op', 'Contact us'), href: '/contact/', cls: 'btn--accent' }, { label: ctx.site.phonePrimary.display, href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: '/over-ons/', title: T('Over EnviroFlow | Persoonlijk advies in vloeistofopslag', 'About EnviroFlow | Personal advice on liquid storage'), description: T('EnviroFlow is een jong bedrijf, opgericht door twee broers. Korte lijnen, persoonlijk contact en praktisch advies over vloeistofopslag en opvang.', 'EnviroFlow is a young company founded by two brothers. Short lines of communication, personal contact and practical advice on liquid storage and containment.'), body, crumbs: [H, { name: T('Over ons', 'About us'), url: '/over-ons/' }] };
}

export function partnersPage(ctx) {
  const body = `<section class="page-head"><div class="container"><h1>Partners</h1><p class="lead">${T('EnviroFlow werkt samen met fabrikanten die wij kennen en vertrouwen.', 'EnviroFlow works with manufacturers we know and trust.')}</p></div></section>
<section class="section section--tight"><div class="container"><div class="cat-grid">${ctx.brands.filter((b) => b.active).map((b) => `<a class="ccard" href="/partners/${b.slug}/"><div class="logo-ph logo-ph--card">${b.logo ? `<img class="partner-logo" src="${b.logo}" alt="${esc(b.name)} logo" width="280" height="105">` : ph(b.logoPlaceholder)}</div><div class="ccard__body"><h2>${esc(b.name)}</h2><p>${esc(b.intro)}</p><span class="link-arrow">${T('Meer over', 'More about')} ${esc(b.name)} ${icon('arrow')}</span></div></a>`).join('')}</div></div></section>`;
  return { path: '/partners/', title: 'Partners | EnviroFlow', description: T('De fabrikanten waarmee EnviroFlow samenwerkt.', 'The manufacturers EnviroFlow works with.'), body, crumbs: [H, { name: 'Partners', url: '/partners/' }] };
}

export function brandPage(b, ctx) {
  const lines = ctx.products.filter((p) => p.brand === b.id && p.line).filter((p, i, arr) => arr.findIndex((x) => x.line === p.line) === i);
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><p class="eyebrow">Partner</p><h1>${esc(b.name)}</h1><p class="lead">${esc(b.intro)}</p><p>${T(`EnviroFlow is ${ph(ctx.site.partnerRelation)} van ${esc(b.name)}.`, `EnviroFlow is a ${ph(ctx.site.partnerRelation)} of ${esc(b.name)}.`)}</p></div><div class="logo-ph logo-ph--lg logo-ph--filled">${b.logo ? `<img class="partner-logo" src="${b.logo}" alt="${esc(b.name)} logo" width="280" height="105">` : ph(b.logoPlaceholder)}</div></div></section>
<section class="section section--tight"><div class="container split">
  <div><h2>${T('Over', 'About')} ${esc(b.name)}</h2>${T(`<p>${esc(b.name)} is een fabrikant uit ${esc(b.country)} van flexibele tanks, opvangbakken, waterkeringen en matten van technisch textiel. Het bedrijf is actief sinds ${esc(b.since)}.</p><p>EnviroFlow is geen fabrikant. Wij adviseren, leveren en denken mee over de toepassing van ${esc(b.name)}-producten in Nederland.</p>`, `<p>${esc(b.name)} is a manufacturer from ${esc(COUNTRY_EN[b.country] || b.country)} of flexible tanks, spill trays, flood barriers and mats made of technical textile. The company has been active since ${esc(b.since)}.</p><p>EnviroFlow is not a manufacturer. We advise on, supply and help with the use of ${esc(b.name)} products in the Netherlands.</p>`)}</div>
  <div><h2>${T('Productlijnen', 'Product lines')}</h2><ul class="check-list">${lines.map((p) => `<li>${icon('check')}<a href="${ctx.urls.product(p)}">${esc(p.line)}</a>: ${esc(p.short)}</li>`).join('')}</ul></div>
</div></section>
<section class="section section--tight section--grey"><div class="container"><h2>${T('Alle productgroepen', 'All product groups')}</h2><div class="cat-grid cat-grid--compact">${ctx.categories.map((c) => categoryCard(c, ctx, { compact: true })).join('')}</div></div></section>`;
  return { path: `/partners/${b.slug}/`, title: T(`${b.name}: flexibele tanks en opvangbakken | EnviroFlow`, `${b.name}: flexible tanks and spill trays | EnviroFlow`), description: `${b.intro}`, body, crumbs: [H, { name: 'Partners', url: '/partners/' }, { name: b.name, url: `/partners/${b.slug}/` }] };
}

/* ---------------------------------------------------------------- contact */
export function contactPage(ctx) {
  const { site } = ctx;
  const a = site.address;
  const body = `
<section class="page-head page-head--slim"><div class="container"><h1>Contact</h1><p class="lead">${T('Bel, mail of stuur ons een bericht. Wij nemen zo snel mogelijk contact met u op.', 'Call, email or send us a message. We will get back to you as soon as possible.')}</p></div></section>
<section class="section section--tight"><div class="container split split--form">
  <div>
    <div class="contact-cards">
      <a class="contact-card" href="tel:${site.phonePrimary.tel}">${icon('phone')}<span><small>${T('Telefoon', 'Phone')}</small>${site.phonePrimary.display}</span></a>
      <a class="contact-card" href="tel:${site.phoneSecondary.tel}">${icon('phone')}<span><small>${T('Telefoon', 'Phone')}</small>${site.phoneSecondary.display}</span></a>
      <a class="contact-card" href="mailto:${site.email}">${icon('mail')}<span><small>${T('E-mail', 'Email')}</small>${site.email}</span></a>
      <div class="contact-card">${icon('pin')}<span><small>${T('Adres', 'Address')}</small>${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}${T('', ', the Netherlands')}</span></div>
    </div>
    <dl class="facts facts--stack"><div><dt>${T('KvK-nummer', 'Chamber of Commerce (KvK) number')}</dt><dd>${esc(site.kvk)}</dd></div><div><dt>${T('Btw-nummer', 'VAT number')}</dt><dd>${ph(site.vatNumber)}</dd></div><div><dt>${T('Werkgebied', 'Service area')}</dt><dd>${esc(site.serviceArea)}</dd></div></dl>
    <div class="link-cards">
      <a class="link-card" href="/offerte-aanvragen/">${icon('clipboard')}<span><strong>${T('Offerte aanvragen', 'Request a quote')}</strong>${T('Voor een concreet product of project', 'For a specific product or project')}</span></a>
      <a class="link-card" href="/offerte-aanvragen/?type=advies" id="advies">${icon('chat')}<span><strong>${T('Advies aanvragen', 'Request advice')}</strong>${T('Weet u nog niet welke oplossing past?', 'Not sure which solution fits?')}</span></a>
      <a class="link-card" href="/maatwerk-aanvragen/">${icon('ruler')}<span><strong>${T('Maatwerk aanvragen', 'Request a custom solution')}</strong>${T('Afwijkende maat of uitvoering', 'Non-standard size or design')}</span></a>
    </div>
  </div>
  <form class="form card" action="/api/contact" method="post" data-form="contact" novalidate>
    <h2 class="form-title">${T('Stuur ons een bericht', 'Send us a message')}</h2>
    ${honeypot()}
    <input type="hidden" name="lang" value="${T('nl', 'en')}">
    <div class="form-grid">
      ${field({ name: 'name', label: T('Naam', 'Name'), required: true, autocomplete: 'name' })}
      ${field({ name: 'company', label: T('Bedrijfsnaam', 'Company name'), autocomplete: 'organization' })}
      ${field({ name: 'email', label: T('E-mailadres', 'Email address'), type: 'email', required: true, autocomplete: 'email' })}
      ${field({ name: 'phone', label: T('Telefoonnummer', 'Phone number'), type: 'tel', autocomplete: 'tel' })}
      ${field({ name: 'message', label: T('Uw vraag', 'Your question'), type: 'textarea', required: true, rows: 6, full: true })}
    </div>
    <label class="check"><input type="checkbox" name="privacy" value="1" required><span>${T('Ik ga akkoord dat EnviroFlow mijn gegevens gebruikt om op mijn vraag te reageren (zie <a href="/privacybeleid/">privacybeleid</a>).', 'I agree that EnviroFlow may use my details to respond to my question (see <a href="/privacybeleid/">privacy policy</a>).')} <span class="req" aria-hidden="true">*</span></span></label>
    ${formStatus()}
    <button class="btn btn--primary" type="submit" data-submit>${T('Bericht versturen', 'Send message')}</button>
  </form>
</div></section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact EnviroFlow', url: site.baseUrl + '/contact/' };
  return { path: '/contact/', title: 'Contact | EnviroFlow', description: T(`Neem contact op met EnviroFlow: ${site.phonePrimary.display}, ${site.phoneSecondary.display} of ${site.email}. ${a.street}, ${a.city}.`, `Contact EnviroFlow: ${site.phonePrimary.display}, ${site.phoneSecondary.display} or ${site.email}. ${a.street}, ${a.city}, the Netherlands.`), body, crumbs: [H, { name: 'Contact', url: '/contact/' }], jsonld: [ld], scripts: ['/assets/js/forms.js'] };
}

/* ---------------------------------------------------------------- juridisch, zoeken, 404 */
export function legalPage({ slug, title, extra = '', html = '', draft = false }) {
  const draftNote = draft ? `<div class="notice" role="note"><p>${T('<strong>Conceptversie.</strong> Deze tekst is nog niet definitief vastgesteld.', '<strong>Draft version.</strong> This text has not yet been finalised.')}</p></div>` : '';
  const body = `<section class="section"><div class="container container--narrow prose${html ? ' prose--legal' : ''}"><h1>${esc(title)}</h1>${draftNote}${extra}${html || `<p>${ph('[TEKST VOLGT]')}</p>`}</div></section>`;
  return { path: `/${slug}/`, title: `${title} | EnviroFlow`, description: T(`${title} van EnviroFlow.`, `${title} of EnviroFlow.`), body, crumbs: [H, { name: title, url: `/${slug}/` }] };
}

export function searchPage() {
  const body = `<section class="page-head page-head--slim"><div class="container"><h1>${T('Zoeken', 'Search')}</h1>
<form class="search search--page" role="search" action="/zoeken/" method="get"><label class="sr-only" for="q-page">${T('Zoekterm', 'Search term')}</label><input id="q-page" name="q" type="search" placeholder="${T('Zoek op product, toepassing of vloeistof', 'Search by product, application or liquid')}"><button class="btn btn--primary" type="submit">${icon('search')}${T('Zoeken', 'Search')}</button></form></div></section>
<section class="section section--tight"><div class="container"><p data-search-summary aria-live="polite"></p><ul class="search-list" data-search-page></ul><noscript><p>${T('Schakel JavaScript in om te zoeken, of bekijk het <a href="/producten/">productoverzicht</a>.', 'Please enable JavaScript to search, or view the <a href="/producten/">product overview</a>.')}</p></noscript></div></section>`;
  return { path: '/zoeken/', title: T('Zoeken | EnviroFlow', 'Search | EnviroFlow'), description: T('Zoek in producten, oplossingen en kennisbank van EnviroFlow.', 'Search the EnviroFlow products, solutions and knowledge base.'), body, noindex: true, crumbs: [H, { name: T('Zoeken', 'Search'), url: '/zoeken/' }] };
}

export function notFoundPage(ctx) {
  const body = `<section class="section"><div class="container container--narrow thanks"><h1>${T('Pagina niet gevonden', 'Page not found')}</h1><p class="lead">${T('Deze pagina bestaat niet (meer). Zoek verder of neem contact met ons op.', 'This page does not exist (anymore). Search further or contact us.')}</p><div class="btn-row"><a class="btn btn--primary" href="/producten/">${T('Naar de producten', 'To the products')}</a><a class="btn btn--ghost" href="/contact/">Contact</a><a class="btn btn--ghost" href="tel:${ctx.site.phonePrimary.tel}">${icon('phone')}${ctx.site.phonePrimary.display}</a></div></div></section>`;
  return { path: '/404.html', title: T('Pagina niet gevonden | EnviroFlow', 'Page not found | EnviroFlow'), description: T('Deze pagina bestaat niet.', 'This page does not exist.'), body, noindex: true, file: '404.html' };
}
