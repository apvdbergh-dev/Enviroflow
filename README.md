# EnviroFlow – website en webshop

Nederlandstalige B2B-website met hybride webshop (online bestellen én offerte aanvragen) voor EnviroFlow.

- **Geen externe afhankelijkheden.** Alleen Node.js 20 of nieuwer is nodig.
- **Statische HTML** (snel, SEO-vriendelijk) die door `build.mjs` uit data wordt gegenereerd.
- **Bestellingen, formulieren en betalingen (Mollie)** via `src/lib/api.mjs`: live op Cloudflare Pages Functions, lokaal via `server.mjs`.

## Starten

```bash
npm run build      # genereert ./dist
npm start          # serveert ./dist + API op http://localhost:8080
npm run check      # build + controle: één H1, unieke titles/descriptions, JSON-LD, dode links, labels
```

Instellingen (omgevingsvariabelen; op Cloudflare onder *Settings → Variables and Secrets*, lokaal als env):

| Variabele | Doel |
|---|---|
| `MOLLIE_API_KEY` | Activeert online betalen via Mollie. Eerst de **test**-sleutel (`test_…`), bij livegang de `live_…`-sleutel. Zonder sleutel wordt een bestelling opgeslagen en stuurt EnviroFlow zelf een betaalverzoek. **Als geheim (secret) instellen.** |
| `NTFY_TOPIC` | Geheime kanaalnaam voor pushmeldingen via de ntfy-app. De melding bevat alleen ordernummer en bedrag, geen persoonsgegevens. |
| `RESEND_API_KEY` | E-mail via Resend: alle gegevens van aanvragen en bestellingen naar EnviroFlow (met bijlagen) en een bevestiging aan de klant na betaling. **Als geheim instellen.** |
| `MAIL_FROM` | Afzender, standaard `EnviroFlow <bestellingen@enviroflow.nl>` (domein moet in Resend geverifieerd zijn). |
| `NOTIFY_EMAIL` | Ontvanger van meldingen, standaard het adres uit `site.json`. |
| `BASE_URL` | Optioneel: publieke URL voor Mollie-terugkeer en -webhook. Standaard het adres waarop het verzoek binnenkomt. |
| `NTFY_SERVER`, `NTFY_TOKEN`, `MOLLIE_API_URL`, `RESEND_API_URL` | Optioneel: eigen ntfy-server of testomgevingen. |
| `PORT`, `DATA_DIR` | Alleen lokaal (`server.mjs`): poort en map voor opslag (standaard `./data`). |

## Live op Cloudflare Pages

De website (`dist/`) en de API (`functions/api/[[path]].js`) draaien samen op Cloudflare Pages; opslag in Workers KV.

1. *Workers & Pages → Create → Pages → Connect to Git*, kies deze repository en branch.
2. Build command `node build.mjs`, output directory `dist`, omgevingsvariabele `NODE_VERSION` = `22`.
3. Maak een KV-namespace aan (bijv. `enviroflow-data`) en koppel die in het project onder *Settings → Bindings* als **`EF_DATA`**.
4. Vul de variabelen hierboven in en deploy opnieuw.
5. Testen kan op het `*.pages.dev`-adres met de Mollie-testsleutel; daarna het domein koppelen.

Lokaal testen met de echte Cloudflare-runtime: `npx wrangler pages dev dist --kv EF_DATA` (na `npm run build`).

## Opbouw

```
build.mjs                     generator → dist/
server.mjs                    lokale server: statische bestanden + /api/* (zelfde code als Cloudflare)
functions/api/[[path]].js     Cloudflare Pages Function voor /api/* (opslag: KV-binding EF_DATA)
src/lib/api.mjs               formulieren, bestellingen, Mollie, meldingen (ntfy + Resend)
src/lib/catalog-core.mjs      catalogusregels zonder bestandstoegang (build, server én Cloudflare)
src/data/site.json            bedrijfsgegevens, btw, verzendkosten, betaalmethoden, relatie met EXFLO
src/data/brands.json          merken/partners (EXFLO; later meer)
src/data/categories.json      4 hoofdgroepen + categorieën (inclusief toekomstige, met "active": false)
src/data/products.json        producten: prijs, specificaties, filters, afbeeldingen, datasheet
src/content/nl/*.mjs          oplossingen, sectoren, kennisbankartikelen
src/i18n/nl.json              vaste interfaceteksten
src/templates/*.mjs           layout en paginasjablonen
src/assets/                   CSS, JS, zelf-gehoste fonts (Archivo, Inter), logo
scripts/check.mjs             kwaliteitscontrole van de build
```

## Producten beheren (`src/data/products.json`)

| Veld | Betekenis |
|---|---|
| `price` | `null` = *Prijs op aanvraag*. Een getal (excl. btw) = online bestelbaar. De tekst `"[PRIJS]"` = sjabloonweergave: bestelknop zichtbaar, maar afrekenen is geblokkeerd tot er een echte prijs staat. |
| `quoteOnly` | `true` = altijd alleen offerte (grote tanks, waterkeringen, maatwerk), ook als er een prijs is. |
| `leadTime`, `stock` | Alleen tonen als ingevuld; anders *Levertijd op aanvraag*. |
| `specs.*` | `null` = *Neem contact op voor actuele specificaties*. Vul alleen waarden uit de EXFLO-datasheet in. `certificering`: exacte naam uit de datasheet. |
| `liquids` | Alleen vullen als de datasheet de vloeistoffen noemt; anders *Wij controleren de geschiktheid voor uw vloeistof*. |
| `downloads` | Lijst van PDF's: `[{ "label": "…", "href": "/assets/datasheets/x.pdf" }]` (bestand in `src/assets/datasheets/`). |
| `sizes` | Optionele tabel met uitvoeringen: `{ "head": [...], "rows": [[...]], "note": "…" }`. |
| `source` | URL van de bronpagina bij de fabrikant. |
| `images` | `[{ "src": "/assets/img/producten/x.jpg", "alt": "…", "width": 1200, "height": 900 }]`. Zet naast elke jpg/png een `.webp` met dezelfde naam; die wordt automatisch gebruikt. Zonder `src` verschijnt een beschrijvende placeholder. Productfoto's staan in `src/assets/img/producten/`. |
| `attributes` | Voedt de filters: `ibcCount`, `drumCount`, `capacityL`, `dimensions`, `material`, `application[]`, `liquids[]`, `location`, `duration`. Een filter verschijnt automatisch zodra er minstens twee verschillende waarden in een overzicht staan. |
| `featured` | Tonen bij *Uitgelichte producten* op de homepage (alleen als het product online bestelbaar is). |

De server berekent prijzen altijd opnieuw uit `products.json`; prijzen uit de browser worden genegeerd.

## Uitbreiden

- **Nieuwe categorie** (bijv. stalen lekbakken, spill kits, absorptiemateriaal, pompen): staat al in `categories.json` met `"active": false`. Zet op `true`, vul `intro`, `applications`, `faq`, `seoTitle`, `seoDescription` en voeg producten toe. Menu, sitemap, filters en zoekindex worden automatisch bijgewerkt.
- **Nieuw merk**: voeg toe aan `brands.json` (`active: true`) en verwijs ernaar via `brand` in een product. Er komt automatisch een pagina onder `/partners/<slug>/`.
- **Nieuwe taal/land** (NL → BE → DE → EN): kopieer `src/i18n/nl.json` en `src/content/nl/`, voeg de locale toe aan `site.json` en laat `build.mjs` per locale renderen in een submap (`/be/`, `/de/`, `/en/`) met `hreflang`-links. Catalogus, content en URL-opbouw zijn al centraal; de sjablonen bevatten nog Nederlandse vaste teksten die bij de eerste extra taal naar `src/i18n/` moeten worden verplaatst.
- **Landen in de checkout**: lijst `countries` in `checkoutPage` (`src/templates/pages-shop.mjs`).

## Techniek & kwaliteit

- Mobile-first, sticky mobiele balk (*Bel direct* / *Offerte*), mega-menu met toetsenbordbediening (Enter/Escape).
- WCAG 2.1 AA: kleurcontrast gecontroleerd (donkere varianten van groen/teal voor tekst en knoppen), skiplink, focusstijlen, labels, foutmeldingen met `aria-describedby`, `prefers-reduced-motion`.
- SEO: unieke title en meta description per pagina, één H1, breadcrumbs, `sitemap.xml`, `robots.txt`, schema.org (Organization, Product + Offer bij een echte prijs, BreadcrumbList, FAQPage, Article).
- AVG: fonts zelf gehost (geen verzoeken naar Google), geen tracking zonder toestemming, cookiemelding met gelijkwaardige keuzes.
- Beveiliging: honeypot tegen spam, beperking op bestandstypen/grootte, securityheaders en CSP, prijscontrole aan de serverkant.

Zie **PLACEHOLDERS.md** voor alles wat nog moet worden aangeleverd.
