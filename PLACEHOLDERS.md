# Nog in te vullen / aan te leveren

Placeholders zijn op de site geel gemarkeerd (`[ZO]`). Alles hieronder is bewust níet verzonnen.

## Bedrijfsgegevens (`src/data/site.json`)

| Placeholder | Waar zichtbaar |
|---|---|
| `[BTW-NUMMER]` | Footer, contactpagina |
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

- **Prijzen – BESLISSING NODIG.** De 15 online bestelbare producten (10 opvangbakken, 4 wasmatten voor voertuigen en 1 motorwasmat) hebben nu de **netto webshopprijzen van EXFLO in euro's**, één-op-één overgenomen. Dat zijn de verkoopprijzen van de fabrikant zelf. Pas ze aan naar uw eigen verkoopprijs (marge, transport naar Nederland) voordat de shop live gaat.
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

- Juridische pagina's `[TEKST VOLGT]`: Levering & verzending, Retourneren, Algemene voorwaarden, Privacybeleid, Cookiebeleid.
- Projecten: sjabloon "Voorbeeldsituatie" met `[TITEL PROJECT]`, `[SECTOR]`, `[PLAATS]`, `[PRODUCT]`, `[PROJECTFOTO]` en de vier tekstblokken. Staat op `noindex` tot er een echt project is.
- Kennisbankartikelen: publicatiedatum (`datePublished`) per artikel; laat de inhoud bij voorkeur nog inhoudelijk controleren.

## Techniek bij livegang

- `MOLLIE_API_KEY` en `BASE_URL` instellen (betaalmethoden aanpassen in `site.json` aan wat in Mollie actief is).
- `NOTIFY_WEBHOOK_URL` of e-mailkoppeling voor meldingen van nieuwe aanvragen en bestellingen.
- Hosting met Node.js 20+ (bijv. een VPS, Render, Railway of Fly.io) en HTTPS.
- Optioneel: statistiekenpakket koppelen dat pas laadt na toestemming (`ef:consent`-event in `main.js`).
