// Oplossingen, sectoren, projecten, kennisbank, over ons, partners, contact, juridisch, zoeken en 404.
import { esc, ph, icon, media, CARD_SIZES, adviceBlock, ctaBand, productCard, categoryCard, field, honeypot, formStatus, faqBlock, insightFields } from './ui.mjs';
import { stepsList } from './pages-shop.mjs';
import { T, numberLocale } from '../lib/i18n.mjs';

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
const sectorCats = (s, ctx) => s.categories.map((id) => ctx.categoryById[id]).filter((c) => c?.active);

function sectorCard(s, ctx) {
  const n = sectorCats(s, ctx).length;
  return `<a class="secard" href="/sectoren/${s.slug}/">
  <div class="secard__media">${media(s.image, '3-2', false, CARD_SIZES)}<span class="secard__count">${n} ${T('oplossingen', 'solutions')}</span></div>
  <div class="secard__body"><h2>${esc(s.name)}</h2><p>${esc(s.intro)}</p>
    <ul class="secard__tags">${s.liquids.slice(0, 3).map((l) => `<li>${esc(l)}</li>`).join('')}</ul>
    <span class="link-arrow">${T('Bekijk sector', 'View sector')} ${icon('arrow')}</span></div>
</a>`;
}

export function sectorsOverview(ctx) {
  const body = `<section class="page-head sec-head"><div class="container"><p class="eyebrow">${T('Sectoren', 'Sectors')}</p><h1>${T('Opvang en opslag, afgestemd op uw sector', 'Containment and storage, tailored to your sector')}</h1><p class="lead">${T("Een bouwplaats vraagt iets anders dan een melkveebedrijf of een werkplaats. Kies uw sector en zie welke vloeistoffen, risico's en oplossingen erbij horen.", 'A construction site needs something different from a dairy farm or a workshop. Choose your sector and see which liquids, risks and solutions go with it.')}</p>
<nav class="sec-chips" aria-label="${T('Sectoren', 'Sectors')}">${ctx.sectors.map((s) => `<a href="/sectoren/${s.slug}/">${esc(s.name)}</a>`).join('')}</nav></div></section>
<section class="section section--tight"><div class="container"><div class="sec-grid">${ctx.sectors.map((s) => sectorCard(s, ctx)).join('')}</div></div></section>
<div class="container section--tight">${adviceBlock(ctx.site, { title: T('Staat uw sector er niet bij?', 'Is your sector not listed?'), text: T('Vertel ons wat u wilt opvangen of opslaan. Wij denken mee over een passende oplossing.', 'Tell us what you want to contain or store. We will help you find a suitable solution.') })}</div>`;
  return { path: '/sectoren/', title: T('Sectoren | Vloeistofopslag en opvang per branche | EnviroFlow', 'Sectors | Liquid storage and containment by industry | EnviroFlow'), description: T('Oplossingen voor industrie, bouw & infra, landbouw, automotive, transport, gemeenten, brandweer, evenementen en scheepvaart.', 'Solutions for industry, construction & infrastructure, agriculture, automotive, transport, municipalities, fire services, events and shipping.'), body, ogImage: ctx.sectors[0].image.src, crumbs: [H, { name: T('Sectoren', 'Sectors'), url: '/sectoren/' }] };
}

export function sectorPage(s, ctx) {
  const cats = sectorCats(s, ctx);
  const reads = ctx.articles.filter((a) => a.categories.some((c) => s.categories.includes(c))).slice(0, 3);
  const others = ctx.sectors.filter((o) => o.slug !== s.slug);
  const risk = (r, i) => {
    const c = ctx.categoryById[s.riskCategories?.[i]];
    return `<li class="sec-risk"><span class="sec-risk__n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(r)}</h3>${c?.active ? `<a class="sec-risk__fix" href="${ctx.urls.category(c)}"><span>${T('Oplossing', 'Solution')}</span>${esc(c.name)} ${icon('arrow')}</a>` : ''}</li>`;
  };
  const body = `
<section class="sec-hero-wrap"><div class="container">
  <div class="sec-hero">
    <div class="sec-hero__bg">${media(s.image, '21-9', true)}</div>
    <div class="sec-hero__inner"><p class="eyebrow">Sector</p><h1>${esc(s.name)}</h1><p class="lead">${esc(s.intro)}</p>
      <div class="btn-row"><a class="btn btn--accent" href="/offerte-aanvragen/?type=advies">${T('Advies aanvragen', 'Request advice')}</a><a class="btn btn--outline-light" href="tel:${ctx.site.phonePrimary.tel}">${icon('phone')}${ctx.site.phonePrimary.display}</a></div></div>
  </div>
  <div class="sec-liquids"><p>${T('Vloeistoffen in deze sector', 'Liquids in this sector')}</p><ul>${s.liquids.map((l) => `<li>${icon('drop')}${esc(l)}</li>`).join('')}</ul></div>
</div></section>
<section class="section section--tight"><div class="container">
  <div class="sec-intro"><p class="eyebrow">${T('Uitdagingen', 'Challenges')}</p><h2>${T('Waar het in de praktijk vaak misgaat', 'Where things often go wrong in practice')}</h2></div>
  <ol class="sec-risks">${s.risks.map(risk).join('')}</ol>
</div></section>
<section class="section section--tight section--grey"><div class="container"><div class="sec-intro"><p class="eyebrow">${T('Oplossingen', 'Solutions')}</p><h2>${T(`Passende oplossingen voor ${s.name.toLowerCase()}`, `Suitable solutions for ${s.name.toLowerCase()}`)}</h2></div><div class="cat-grid">${cats.map((c) => categoryCard(c, ctx)).join('')}</div></div></section>
${reads.length ? `<section class="section section--tight"><div class="container"><div class="sec-intro sec-intro--row"><div><p class="eyebrow">${T('Kennisbank', 'Knowledge base')}</p><h2>${T('Verder lezen', 'Further reading')}</h2></div><a class="link-arrow" href="/kennisbank/">${T('Alle artikelen', 'All articles')} ${icon('arrow')}</a></div><div class="kb-grid kb-grid--3">${reads.map((a) => articleCard(a)).join('')}</div></div></section>` : ''}
<section class="section section--tight sec-others"><div class="container"><h2>${T('Andere sectoren', 'Other sectors')}</h2><nav class="sec-chips" aria-label="${T('Andere sectoren', 'Other sectors')}">${others.map((o) => `<a href="/sectoren/${o.slug}/">${esc(o.name)}</a>`).join('')}</nav></div></section>
${ctaBand({ title: T(`Oplossing nodig voor uw bedrijf in ${s.name.toLowerCase()}?`, `Need a solution for your business in ${s.name.toLowerCase()}?`), text: T('Wij denken mee over de juiste opvang of opslag voor uw situatie.', 'We help you find the right containment or storage for your situation.'), buttons: [{ label: T('Offerte aanvragen', 'Request a quote'), href: '/offerte-aanvragen/', cls: 'btn--accent' }, { label: T('Bel een specialist', 'Call a specialist'), href: `tel:${ctx.site.phonePrimary.tel}`, cls: 'btn--outline-light', icon: 'phone' }] })}`;
  return { path: `/sectoren/${s.slug}/`, title: T(`${s.name}: vloeistofopslag en opvang | EnviroFlow`, `${s.name}: liquid storage and containment | EnviroFlow`), description: T(`${s.intro} Bekijk passende oplossingen voor ${s.name.toLowerCase()}.`, `${s.intro} View suitable solutions for ${s.name.toLowerCase()}.`), body, ogImage: s.image.src, crumbs: [H, { name: T('Sectoren', 'Sectors'), url: '/sectoren/' }, { name: s.name, url: `/sectoren/${s.slug}/` }] };
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
// Tekst uit de artikelen: eerst escapen, dan **vet** en [link](/pad/) omzetten.
const inline = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`);
const plain = (s) => String(s || '').replace(/\*\*|\[|\]\([^)]*\)/g, '');
const slugify = (s) => plain(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/** Leestijd in minuten (200 woorden per minuut, minimaal 3). */
function readMinutes(a) {
  const parts = [a.intro, ...(a.takeaways || [])];
  for (const s of a.sections) parts.push(s.h, ...(s.p || []), ...(s.list || []), ...(s.after || []), ...(s.steps || []).flatMap((x) => [x.t, x.d]), ...(s.table?.rows || []).flat(), s.callout?.d || '');
  for (const f of a.faq || []) parts.push(f.q, f.a);
  return Math.max(3, Math.round(parts.join(' ').split(/\s+/).length / 200));
}
const fmtDate = (iso) => new Intl.DateTimeFormat(numberLocale(), { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
const readLabel = (a) => `${readMinutes(a)} ${T('min leestijd', 'min read')}`;

function articleCard(a, cls = '') {
  return `<a class="kcard ${cls}" href="/kennisbank/${a.slug}/">
  <div class="kcard__media">${cls ? media(a.image, '16-10') : media(a.image, '3-2', false, CARD_SIZES)}</div>
  <div class="kcard__body"><p class="kb-kicker">${esc(a.kicker)}</p><h2>${esc(a.title)}</h2><p>${esc(a.description)}</p>
  <p class="kcard__meta">${icon('file')}<span>${readLabel(a)}</span><span class="link-arrow">${T('Lees artikel', 'Read article')} ${icon('arrow')}</span></p></div>
</a>`;
}

export function knowledgeOverview(ctx) {
  const [first, ...rest] = ctx.articles;
  const topics = [...new Set(ctx.articles.map((a) => a.kicker))];
  const body = `<section class="page-head kb-head"><div class="container"><p class="eyebrow">${T('Kennisbank', 'Knowledge base')}</p><h1>${T('Praktische kennis over opvang en opslag van vloeistoffen', 'Practical knowledge about containing and storing liquids')}</h1><p class="lead">${T(`${ctx.articles.length} artikelen met rekenvoorbeelden, maten en de regels die gelden. Bij wet- en regelgeving linken we naar de officiële bron.`, `${ctx.articles.length} articles with worked examples, sizes and the rules that apply. For laws and regulations, we link to the official source.`)}</p>
<ul class="kb-topics" aria-label="${T('Onderwerpen', 'Topics')}">${topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></section>
<section class="section section--tight"><div class="container">
  ${articleCard(first, 'kcard--featured')}
  <div class="kb-grid">${rest.map((a) => articleCard(a)).join('')}</div>
</div></section>
<div class="container section--tight">${adviceBlock(ctx.site, { title: T('Staat uw vraag er niet tussen?', 'Is your question not covered?'), text: T('Bel of mail ons. Wij denken mee en rekenen met u mee.', 'Call or email us. We will think along and do the maths with you.') })}</div>`;
  return { path: '/kennisbank/', title: T('Kennisbank: lekbakken, flexibele tanks en opslag | EnviroFlow', 'Knowledge base: spill trays, flexible tanks and storage | EnviroFlow'), description: T('Artikelen over flexibele lekbakken, IBC lekbakken, opvangcapaciteit (PGS 15), flexibele tanks, bluswater, mestopslag, diesel en wateroverlast.', 'Articles about flexible spill trays, IBC spill trays, containment capacity (PGS 15), flexible tanks, fire water, manure storage, diesel and flooding.'), body, crumbs: [H, { name: T('Kennisbank', 'Knowledge base'), url: '/kennisbank/' }] };
}

function sectionHtml(s) {
  const id = slugify(s.h);
  const table = s.table ? `<div class="table-scroll"><table class="kb-table"><thead><tr>${s.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${s.table.rows.map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${inline(c)}</th>` : `<td>${inline(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>${s.table.note ? `<p class="kb-note">${inline(s.table.note)}</p>` : ''}` : '';
  return `<section class="kb-section" id="${id}" aria-labelledby="h-${id}">
  <h2 id="h-${id}">${esc(s.h)}</h2>
  ${(s.p || []).map((x) => `<p>${inline(x)}</p>`).join('')}
  ${s.list ? `<ul class="check-list">${s.list.map((x) => `<li>${icon('check')}<span>${inline(x)}</span></li>`).join('')}</ul>` : ''}
  ${s.steps ? `<ol class="kb-steps">${s.steps.map((x, i) => `<li><span class="kb-steps__n" aria-hidden="true">${i + 1}</span><div><h3>${esc(x.t)}</h3><p>${inline(x.d)}</p></div></li>`).join('')}</ol>` : ''}
  ${table}
  ${(s.after || []).map((x) => `<p>${inline(x)}</p>`).join('')}
  ${s.callout ? `<aside class="kb-callout">${icon('info')}<div><strong>${esc(s.callout.t)}</strong><p>${inline(s.callout.d)}</p></div></aside>` : ''}
  ${s.image ? `<figure class="kb-figure">${media(s.image, '16-9')}<figcaption>${esc(s.image.caption || '')}</figcaption></figure>` : ''}
</section>`;
}

export function articlePage(a, ctx) {
  const prods = (a.products || []).map((id) => ctx.products.find((p) => p.id === id)).filter(Boolean);
  const others = ctx.articles.filter((x) => x.slug !== a.slug).sort((x, y) => (y.kicker === a.kicker) - (x.kicker === a.kicker)).slice(0, 3);
  const toc = a.sections.map((s) => `<li><a href="#${slugify(s.h)}">${esc(s.h)}</a></li>`).join('') + (a.faq?.length ? `<li><a href="#faq-title">${T('Veelgestelde vragen', 'Frequently asked questions')}</a></li>` : '');
  const faq = faqBlock(a.faq);
  const body = `
<article class="kb-article">
  <header class="kb-hero">
    <div class="container kb-hero__text">
      <p class="kb-kicker">${esc(a.kicker)}</p>
      <h1>${esc(a.title)}</h1>
      <p class="kb-lead">${esc(a.intro)}</p>
      <p class="kb-meta"><span>${icon('file')}${readLabel(a)}</span><span>${T('Bijgewerkt op', 'Updated on')} ${fmtDate(a.updated)}</span><span>${T('Door', 'By')} EnviroFlow</span></p>
    </div>
    <div class="container kb-hero__media">${media(a.image, '21-9', true)}</div>
  </header>
  <div class="container kb-layout">
    <aside class="kb-toc"><nav aria-label="${T('In dit artikel', 'In this article')}"><p class="kb-toc__title">${T('In dit artikel', 'In this article')}</p><ol>${toc}</ol></nav></aside>
    <div class="kb-body">
      <details class="kb-toc-mobile"><summary>${T('In dit artikel', 'In this article')}${icon('chevron')}</summary><ol>${toc}</ol></details>
      <div class="kb-summary"><h2>${T('In het kort', 'In short')}</h2><ul class="check-list">${a.takeaways.map((x) => `<li>${icon('check')}<span>${inline(x)}</span></li>`).join('')}</ul></div>
      ${a.sections.map(sectionHtml).join('\n')}
      ${sourcesBlock(a.sources)}
    </div>
  </div>
</article>
${prods.length ? `<section class="section section--tight section--grey"><div class="container"><h2>${T('Producten bij dit artikel', 'Products for this article')}</h2><div class="product-grid product-grid--3">${prods.map((p) => productCard(p, ctx)).join('')}</div></div></section>` : ''}
${faq.html}
<div class="container section--tight">${adviceBlock(ctx.site)}</div>
<section class="section section--tight"><div class="container"><h2>${T('Lees ook', 'Read also')}</h2><div class="kb-grid kb-grid--3">${others.map((o) => articleCard(o)).join('')}</div></div></section>`;
  const abs = (u) => ctx.site.baseUrl + u;
  // Gidspagina's (zoals /waarom-flexibel/) gebruiken dezelfde opbouw, maar met een eigen adres.
  const path = a.path || `/kennisbank/${a.slug}/`;
  const crumbs = a.path ? [H, { name: a.crumb, url: a.path }] : [H, { name: T('Kennisbank', 'Knowledge base'), url: '/kennisbank/' }, { name: a.title, url: path }];
  const ld = { '@context': 'https://schema.org', '@type': 'Article', headline: a.title, description: a.description, image: [abs(a.image.src)], inLanguage: T('nl-NL', 'en'), datePublished: a.updated, dateModified: a.updated, mainEntityOfPage: abs(path), author: { '@type': 'Organization', name: 'EnviroFlow', url: ctx.site.baseUrl }, publisher: { '@type': 'Organization', name: 'EnviroFlow', logo: { '@type': 'ImageObject', url: abs('/assets/img/enviroflow-logo.png') } } };
  return { path, title: a.seoTitle || `${a.title} | EnviroFlow`, description: a.description, ogImage: a.image.src, body, crumbs, jsonld: [ld, faq.ld].filter(Boolean) };
}

/* ---------------------------------------------------------------- over ons & partners */
export function aboutPage(ctx) {
  const body = `
<section class="page-head"><div class="container page-head__grid"><div><h1>${T('Over EnviroFlow', 'About EnviroFlow')}</h1><p class="lead">${T('EnviroFlow is een jong bedrijf, opgericht door twee broers. Wij helpen bedrijven om vloeistoffen veilig en praktisch op te slaan, op te vangen en te verplaatsen.', 'EnviroFlow is a young company founded by two brothers. We help businesses store, contain and move liquids safely and practically.')}</p></div>${media({ src: '/assets/img/producten/opvangbak-praktijk.jpg', alt: T("IBC's in een flexibele opvangbak", 'IBCs in a flexible spill tray') }, '4-3', true)}</div></section>
<section class="section section--tight"><div class="container split">
  <div><h2>${T('Waar wij voor staan', 'What we stand for')}</h2>${T('<p>Wij zijn geen webshop die zo goedkoop mogelijk levert. Wij willen eerst begrijpen wat uw situatie is: welke vloeistof, hoeveel, waar en hoe lang. Daarna zoeken we de oplossing die daarbij past, standaard of op maat.</p><p>U heeft bij ons korte lijnen en persoonlijk contact. U belt of mailt rechtstreeks met de mensen die uw aanvraag behandelen.</p>', '<p>We are not a web shop that simply delivers as cheaply as possible. We first want to understand your situation: which liquid, how much, where and for how long. Then we look for the solution that fits, standard or custom-made.</p><p>With us you get short lines of communication and personal contact. You call or email directly with the people handling your request.</p>')}</div>
  <div><h2>${T('Onze ambitie', 'Our ambition')}</h2><p>${T('Wij beginnen met flexibele oplossingen van technisch textiel: opvangbakken, tanks en waterkeringen. Ons doel is om uit te groeien tot een vaste partner voor alles rond opslag en opvang van vloeistoffen. Het assortiment breiden wij stap voor stap uit, onder meer met lekbakken van staal en kunststof, spill kits, absorptiemateriaal, pompen en slangen.', 'We are starting with flexible solutions made of technical textile: spill trays, tanks and flood barriers. Our goal is to grow into a regular partner for everything related to the storage and containment of liquids. We will expand the range step by step, including steel and plastic spill trays, spill kits, absorbents, pumps and hoses.')}</p></div>
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
  // Eén product per productlijn (eerste in de catalogus) voor de kaarten met foto.
  const lines = ctx.products.filter((p) => p.brand === b.id && p.line).filter((p, i, arr) => arr.findIndex((x) => x.line === p.line) === i);
  const country = T(b.country, COUNTRY_EN[b.country] || b.country);
  const logo = b.logoDark || b.logo;
  const facts = [[b.since, T('actief sinds', 'active since')], [country, T('land van de fabrikant', "manufacturer's country")], [String(lines.length), T('productlijnen bij EnviroFlow', 'product lines at EnviroFlow')]];
  const roles = [
    ['chat', T('Advies', 'Advice'), T('Welk product past bij uw vloeistof, hoeveelheid en locatie? Wij denken met u mee.', 'Which product suits your liquid, quantity and location? We think along with you.')],
    ['truck', T('Levering', 'Delivery'), T('Wij leveren in Nederland, op het afleveradres dat u opgeeft.', 'We deliver in the Netherlands, to the delivery address you provide.')],
    ['ruler', T('Maatwerk', 'Custom-made'), T('Past een standaardmaat niet? Wij bekijken samen met de fabrikant wat mogelijk is.', "Standard size doesn't fit? Together with the manufacturer, we look at what is possible.")]
  ];
  const body = `
<section class="brand-hero" aria-labelledby="h-brand">
  <div class="container brand-hero__grid">
    <div class="brand-hero__text">
      <p class="eyebrow eyebrow--light">${T('Partner · fabrikant', 'Partner · manufacturer')}</p>
      <h1 id="h-brand" class="brand-hero__title">${logo ? `<img src="${logo}" alt="${esc(b.name)}" width="280" height="105">` : esc(b.name)}</h1>
      <p class="brand-hero__lead">${esc(b.intro)}</p>
      <p class="brand-hero__relation">${icon('check')}<span>${T(`EnviroFlow is ${ph(ctx.site.partnerRelation)} van ${esc(b.name)}.`, `EnviroFlow is a ${ph(ctx.site.partnerRelation)} of ${esc(b.name)}.`)}</span></p>
      <div class="btn-row"><a class="btn btn--accent" href="#productlijnen">${T('Bekijk de productlijnen', 'View the product lines')} ${icon('arrow')}</a><a class="btn btn--outline-light" href="/offerte-aanvragen/?type=advies">${T('Advies aanvragen', 'Request advice')}</a></div>
    </div>
    <div class="brand-hero__visual">
      ${media({ src: '/assets/img/producten/sfeer-ibc-hal.jpg', alt: T("IBC's in een flexibele opvangbak in een bedrijfshal", 'IBCs in a flexible spill tray in a commercial hall'), width: 1200, height: 900 }, '4-3', true)}
    </div>
  </div>
  <div class="container"><dl class="brand-facts">${facts.map(([v, l]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
</section>
<section class="section" aria-labelledby="h-about">
  <div class="container brand-about">
    <div>
      <p class="kicker">${T('De fabrikant', 'The manufacturer')}</p>
      <h2 id="h-about">${T('Over', 'About')} ${esc(b.name)}</h2>
      ${T(`<p>${esc(b.name)} is een fabrikant uit ${esc(b.country)} van flexibele tanks, opvangbakken, waterkeringen en matten van technisch textiel. Het bedrijf is actief sinds ${esc(b.since)}.</p><p>EnviroFlow is een zelfstandig Nederlands bedrijf en geen fabrikant. Wij adviseren, leveren en denken mee over de toepassing van ${esc(b.name)}-producten in Nederland.</p>`, `<p>${esc(b.name)} is a manufacturer from ${esc(country)} of flexible tanks, spill trays, flood barriers and mats made of technical textile. The company has been active since ${esc(b.since)}.</p><p>EnviroFlow is an independent Dutch company, not a manufacturer. We advise on, supply and help with the use of ${esc(b.name)} products in the Netherlands.</p>`)}
    </div>
    <ul class="brand-roles" aria-label="${T('Wat EnviroFlow doet', 'What EnviroFlow does')}">
      ${roles.map(([ic, h, txt]) => `<li><span class="brand-roles__icon">${icon(ic)}</span><div><h3>${h}</h3><p>${txt}</p></div></li>`).join('')}
    </ul>
  </div>
</section>
<section class="section section--tight" id="productlijnen" aria-labelledby="h-lines">
  <div class="container">
    <div class="section-head"><h2 id="h-lines">${T('Productlijnen', 'Product lines')}</h2></div>
    <div class="line-grid">${lines.map((p) => `<a class="line-card" href="${ctx.urls.product(p)}">${media(p.images?.[0] ? { ...p.images[0], alt: p.images[0].alt } : { alt: p.name }, '4-3', false, CARD_SIZES)}<div class="line-card__body"><h3>${esc(p.line)}</h3><p>${esc(p.short)}</p><span class="link-arrow">${T('Bekijk product', 'View product')} ${icon('arrow')}</span></div></a>`).join('')}</div>
  </div>
</section>
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
      ${insightFields()}
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
