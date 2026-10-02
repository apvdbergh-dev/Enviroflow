# Nog in te vullen / aan te leveren

Placeholders zijn op de site geel gemarkeerd (`[ZO]`). Alles hieronder is bewust níet verzonnen.

## Bedrijfsgegevens (`src/data/site.json`)

| Placeholder | Waar zichtbaar |
|---|---|
| `[BTW-NUMMER]` | Footer, contactpagina |
| `[OFFICIEEL DEALER / DISTRIBUTEUR NEDERLAND]` – kies de exacte relatie met EXFLO | Homepage (partnerblok), /partners/exflo/ |
| Verzendkosten `[IN TE VULLEN]` (`shipping.flatRate`, of laten staan: "na bestelling berekend") | Winkelwagen, checkout, Levering & verzending |
| Controle adres: stond als "Molendijk 70, [3235XH] [Rockanje]" aangeleverd; nu getoond als Molendijk 70, 3235 XH Rockanje | Footer, contact, schema.org |
| Domein `baseUrl` (nu `https://www.enviroflow.nl`) | Canonicals, sitemap, schema.org |

## Beeld en merk

- `[EXFLO-LOGO]` – officieel EXFLO-logo (SVG of PNG), in `src/assets/img/` en `logo` in `brands.json`.
- Vectorversie (SVG) van het EnviroFlow-logo; de footer gebruikt nu een vectorbenadering voor donkere achtergrond.
- Hero-sfeerbeeld (homepage) en categoriebeelden: elke placeholder beschrijft het gewenste beeld.
- Productfoto's van EXFLO per product (`images` in `products.json`, met webp-versie).
- Foto van de oprichters (Over ons) – `[FOTO VOLGT]`.

## Producten (`src/data/products.json`)

- **Prijzen** – nu bij geen enkel product een echte prijs. Drie producten staan als online-bestelbaar sjabloon met `[PRIJS]` (afrekenen geblokkeerd): Flexibele opvangbak voor 1 IBC, … voor 2 IBC's, Wasmat voor voertuigen. Vul prijzen in uit uw prijslijst (excl. btw) of zet ze op `null`.
- **Productlijn controleren** – de producten per categorie (o.a. opvangbakken voor 1, 2 en 4 IBC's, vaten, voertuigen) zijn functioneel benoemd. Controleer namen, maten en varianten tegen het EXFLO-assortiment en vul artikelnummers (`sku`) in.
- **Specificaties** – afmetingen, capaciteit, materiaal (alleen TPU bij Waterbase D Plus is ingevuld), gewicht, aansluitingen, temperatuurbereik, chemische bestendigheid, garantie, certificering: alles uit de datasheets.
- **Geschikte vloeistoffen** (`liquids`) – alleen invullen als de datasheet dat vermeldt.
- **Datasheets (PDF)** per product.
- **Levertijd en voorraad** (`leadTime`, `stock`) – optioneel.
- **Voordelen-bullets** – algemeen geformuleerd; controleer ze tegen de datasheets.

## Teksten

- Juridische pagina's `[TEKST VOLGT]`: Levering & verzending, Retourneren, Algemene voorwaarden, Privacybeleid, Cookiebeleid.
- Projecten: sjabloon "Voorbeeldsituatie" met `[TITEL PROJECT]`, `[SECTOR]`, `[PLAATS]`, `[PRODUCT]`, `[PROJECTFOTO]` en de vier tekstblokken. Staat op `noindex` tot er een echt project is.
- Kennisbankartikelen: publicatiedatum (`datePublished`) per artikel; laat de inhoud bij voorkeur nog inhoudelijk controleren.

## Techniek bij livegang

- `MOLLIE_API_KEY` en `BASE_URL` instellen (betaalmethoden aanpassen in `site.json` aan wat in Mollie actief is).
- `NOTIFY_WEBHOOK_URL` of e-mailkoppeling voor meldingen van nieuwe aanvragen en bestellingen.
- Hosting met Node.js 20+ (bijv. een VPS, Render, Railway of Fly.io) en HTTPS.
- Optioneel: statistiekenpakket koppelen dat pas laadt na toestemming (`ef:consent`-event in `main.js`).
