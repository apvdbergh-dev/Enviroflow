# Nog in te vullen / aan te leveren

Placeholders zijn op de site geel gemarkeerd (`[ZO]`). Alles hieronder is bewust níet verzonnen.

## Bedrijfsgegevens (`src/data/site.json`)

| Placeholder | Waar zichtbaar |
|---|---|
| Verzendkosten `[IN TE VULLEN]` (`shipping.flatRate`, of laten staan: "na bestelling berekend") | Winkelwagen, checkout, Levering & verzending |
| Controle adres: stond als "Molendijk 70, [3235XH] [Rockanje]" aangeleverd; nu getoond als Molendijk 70, 3235 XH Rockanje | Footer, contact, schema.org |
| Domein `baseUrl` (nu `https://www.enviroflow.nl`) | Canonicals, sitemap, schema.org |

## Beeld en merk

- Vectorversie (SVG) van het EnviroFlow-logo; de footer gebruikt nu een vectorbenadering voor donkere achtergrond.
- Foto van de oprichters (Over ons) – `[FOTO VOLGT]`.
- Sfeerbeelden voor oplossingen, sectoren en kennisbank (nu beschrijvende placeholders). Productfoto's, categoriefoto's, homepagebeeld en EXFLO-logo komen van exflo.eu.
- Controleer of het gebruik van de EXFLO-foto's en het logo past binnen uw distributieafspraak.

## Producten (`src/data/products.json`)

Alle productgegevens komen van exflo.eu (opgehaald 2 oktober 2026); de bron-URL staat per product in `source`.

- **Prijzen – VOORLOPIG, NOG DEFINITIEF VASTSTELLEN.** De 15 online bestelbare producten hebben in `products.json` de netto webshopprijzen van EXFLO. Op de site geldt tijdelijk een opslag van **30%** (`priceMarkup` in `site.json`, afgerond op hele euro's). Stel de definitieve verkoopprijzen vast (marge, transport naar Nederland) en pas de opslag of de prijzen per product aan.
- **Verzendkosten – NOG VASTSTELLEN.** Staat nu op "worden na bestelling berekend": klanten betalen online zonder verzendkosten. Vul `shipping.flatRate` in `site.json` in zodra bekend; dan vult ook de pagina Levering & verzending zich.
- **Bewust zonder prijs (offerte):** brandwater-, retentie-, afvalwater-, brandstof-, UAN- en mesttanks, Hydronion, Exflooder-waterkeringen (volgens uw webshopregels), decontaminatiematten, drinkwatertank, Flextanker en Exnoiser (EXFLO publiceert hiervoor geen prijs of het product valt onder "alleen offerte"). Ook de Waterbase R-tank van 30.000 l en de Exflooder hebben bij EXFLO wel een webprijs, maar staan volgens uw regels op offerte.
- **Levertijd en voorraad**: niet overgenomen, omdat de levertijden van EXFLO gelden voor levering in Polen. Vul `leadTime`/`stock` in als u uw eigen levertijd naar Nederland weet.
- **Te controleren:**
  - UAN-tank (Farmer type U): de EXFLO-pagina noemt zowel 7 als 10 jaar garantie. Op de site staat "10 jaar volgens de productpagina van EXFLO". Vraag dit na bij EXFLO.
  - Exflooder: in de EXFLO-webshop staan Exflooder+-varianten met Ø 45/90 cm en andere prijzen dan in hun prijslijst (Ø 46/94 cm). Op de site staan de maten uit de prijslijst; prijs op aanvraag.
  - Fuelbase: EXFLO noemt ook MIL-uitvoeringen (benzine, kerosine) "in certificering"; die zijn bewust niet opgenomen.
- **Datasheets:** EXFLO publiceert geen losse datasheets per product. Toegevoegd: de chemische bestendigheidstabel voor de opvangbakken (Engels, PDF). Vraag volledige datasheets op bij EXFLO en voeg ze toe aan `downloads`.
- **Artikelnummers** (`sku`) ontbreken; EXFLO toont ze niet online.
- **Dekzeilen en hoezen op maat:** geen EXFLO-productpagina gevonden; staat als maatwerk op aanvraag.

## Teksten

- Levering & verzending: `[TEKST VOLGT]` (hangt af van de keuze voor verzendkosten).
- Algemene voorwaarden, privacybeleid, retourbeleid en cookiebeleid: vastgesteld (16 oktober 2026) in `src/content/nl/legal.mjs`; termijnen in `LEGAL_CHOICES`. Advies: laat ze nog door een jurist toetsen (o.a. de meldtermijn van 24 uur voor verborgen gebreken).
- Projecten: sjabloon "Voorbeeldsituatie" met `[TITEL PROJECT]`, `[SECTOR]`, `[PLAATS]`, `[PRODUCT]`, `[PROJECTFOTO]` en de vier tekstblokken. Staat op `noindex` tot er een echt project is.
- Kennisbankartikelen: publicatiedatum (`datePublished`) per artikel; laat de inhoud bij voorkeur nog inhoudelijk controleren.

## Techniek bij livegang

- Cloudflare Pages-project met KV-binding `EF_DATA` (zie README, "Live op Cloudflare Pages").
- `MOLLIE_API_KEY` (eerst test, dan live); betaalmethoden in `site.json` gelijk maken aan wat in Mollie actief is.
- `NTFY_TOPIC` (pushmeldingen) en `RESEND_API_KEY` + domeinverificatie in Resend (e-mail).
- Domein (www.enviroflow.nl) van GitHub Pages naar Cloudflare Pages omzetten.
- Optioneel: statistiekenpakket koppelen dat pas laadt na toestemming (`ef:consent`-event in `main.js`).
