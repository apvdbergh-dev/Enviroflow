# EnviroFlow – website en webshop

Nederlandstalige B2B-website met hybride webshop (online bestellen én offerte aanvragen) voor EnviroFlow.

- **Geen externe afhankelijkheden.** Alleen Node.js 20 of nieuwer is nodig.
- **Statische HTML** (snel, SEO-vriendelijk) die door `build.mjs` uit data wordt gegenereerd.
- **Kleine Node-server** (`server.mjs`) voor formulieren, uploads, bestellingen en betalingen (Mollie).

## Starten

```bash
npm run build      # genereert ./dist
npm start          # serveert ./dist + API op http://localhost:8080
npm run check      # build + controle: één H1, unieke titles/descriptions, JSON-LD, dode links, labels
```

Omgevingsvariabelen voor de server:

| Variabele | Doel |
|---|---|
| `PORT` | Poort (standaard 8080) |
| `BASE_URL` | Publieke URL, bijv. `https://www.enviroflow.nl` (nodig voor Mollie-redirect en -webhook) |
| `MOLLIE_API_KEY` | Activeert online betalen via Mollie (iDEAL, creditcard, Bancontact, PayPal, overboeking). Zonder sleutel wordt een bestelling opgeslagen en stuurt u zelf een betaalverzoek. |
| `NOTIFY_WEBHOOK_URL` | Optioneel: elke aanvraag/bestelling wordt als JSON hierheen gestuurd (bijv. Make/Zapier → e-mail). |
| `DATA_DIR` | Map voor aanvragen, bestellingen en uploads (standaard `./data`, staat in `.gitignore`). |

## Opbouw

```
build.mjs                     generator → dist/
server.mjs                    statische bestanden + /api/quote, /api/custom, /api/contact, /api/order, /api/mollie-webhook, /api/order-status
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
| `datasheet` | Pad naar PDF, bijv. `/assets/datasheets/waterbase-f.pdf` (bestand in `src/assets/datasheets/`). |
| `images` | `[{ "src": "/assets/img/producten/x.jpg", "alt": "…", "width": 1200, "height": 900 }]`. Zet naast elke jpg/png een `.webp` met dezelfde naam; die wordt automatisch gebruikt. Zonder `src` verschijnt een beschrijvende placeholder. |
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
