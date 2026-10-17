// Kennisbankartikelen (Nederlands). De Engelse versie staat in src/content/en/articles.mjs met dezelfde slugs.
// Regels altijd met de officiële bron erbij; productgegevens alleen uit src/data/products.json.
//
// Opbouw van een artikel:
//   kicker, title (H1), seoTitle, description, updated, image {src, alt}, intro, takeaways[]
//   sections[]: { h, p[], image {src, alt, caption}, list[], steps[{t, d}], table {head, rows, note}, callout {t, d}, after[] }
//   faq[{q, a}], categories[], products[], sources[{label, url}]
// In tekst mag [linktekst](/pad/) en **vet** staan.

const IMG = '/assets/img/producten/';
const SRC = {
  pgs15: { label: 'IPLO – PGS 15: productopvang in een opslagvoorziening', url: 'https://iplo.nl/thema/externe-veiligheid/handleiding-publicatiereeks-gevaarlijke-stoffen/pgs-15-algemene-voorschriften/pgs-15-opslagvoorzieningen/pgs-15-productopvang-opslagvoorziening/' },
  pgs: { label: 'Publicatiereeks Gevaarlijke Stoffen (officiële PGS-website)', url: 'https://publicatiereeksgevaarlijkestoffen.nl/' },
  pgs30: { label: 'PGS 30:2021 – Vloeibare brandstoffen, bovengrondse tankinstallaties', url: 'https://publicatiereeksgevaarlijkestoffen.nl/publicaties/online/pgs-30/2021/1-1-april-2026' },
  diesel: { label: 'IPLO – Regels bodem: opslaan van diesel in een bovengrondse opslagtank', url: 'https://iplo.nl/regelgeving/regels-voor-activiteiten/opslaan-diesel-oxiderende-bijtende-aquatoxische/regels-bodem/' },
  mestBodem: { label: 'IPLO – Regels bodem: opslaan van drijfmest in een mestbassin (paragraaf 4.86 Bal)', url: 'https://iplo.nl/regelgeving/regels-voor-activiteiten/opslaan-drijfmest-digestaat-dunne-fractie/regels-bodem/' },
  mestRegels: { label: 'IPLO – Opslaan van mest: wanneer welke regels gelden', url: 'https://iplo.nl/thema/toepassing-regels-praktijk/veehouderijen/opslaan-mest-wanneer-welke-regels-gelden/' },
  rvo: { label: 'RVO – Wanneer mest uitrijden 2026 (tabel)', url: 'https://www.rvo.nl/sites/default/files/2026-02/Tabel-1-Wanneer-mest-uitrijden-2026.pdf' }
};
const L = {
  opvang: '/producten/opvang-en-spill-containment/flexibele-opvangbakken/',
  brandwater: '/producten/flexibele-tanks/brandwatertanks/',
  drinkwater: '/producten/flexibele-tanks/drinkwatertanks/',
  buffer: '/producten/flexibele-tanks/industriele-water-en-buffertanks/',
  afvalwater: '/producten/flexibele-tanks/afvalwatertanks/',
  brandstof: '/producten/flexibele-tanks/brandstoftanks/',
  uan: '/producten/flexibele-tanks/uan-tanks/',
  mest: '/producten/flexibele-tanks/mest-en-slurrytanks/',
  mobiel: '/producten/mobiel-en-calamiteiten/mobiele-watertanks/',
  open: '/producten/mobiel-en-calamiteiten/open-zelfdragende-tanks/',
  kering: '/producten/mobiel-en-calamiteiten/mobiele-waterkeringen/',
  capaciteit: '/kennisbank/hoe-kies-je-de-juiste-opvangcapaciteit/',
  ibc: '/kennisbank/welke-opvangbak-heb-ik-nodig-voor-ibcs/',
  lekbak: '/kennisbank/wat-is-een-flexibele-lekbak/',
  brandstofArtikel: '/kennisbank/brandstof-tijdelijk-opslaan-op-locatie/'
};
const UPDATED = '2026-10-17';

export default [
  {
    slug: 'wat-is-een-flexibele-lekbak',
    kicker: 'Opvang',
    title: 'Flexibele lekbak: wat is het en wanneer kiest u ervoor?',
    seoTitle: 'Flexibele lekbak: wat is het en wanneer kiest u ervoor? | EnviroFlow',
    description: 'Wat is een flexibele lekbak, hoe werkt hij en wanneer past hij beter dan een stalen lekbak? Met maten, materiaal, regels (PGS 15) en praktijktips.',
    updated: UPDATED,
    image: { src: IMG + 'sfeer-ibc-hal.jpg', alt: "IBC's in een flexibele lekbak in een bedrijfshal" },
    intro: 'Een flexibele lekbak is een opvangbak van stevig technisch textiel met opstaande randen. Staat er een IBC, vat of machine in en gaat er iets mis, dan blijft de vloeistof in de bak. Niet op de vloer, niet in de bodem en niet in het riool. Hieronder leest u hoe zo’n bak werkt, wanneer hij beter past dan een stalen lekbak en waar u op let bij het kiezen.',
    takeaways: [
      "Een flexibele lekbak vangt lekkages en morsingen op onder IBC's, vaten, aggregaten en voertuigen.",
      'Hij staat er in een paar minuten en kan leeg worden opgevouwen.',
      'Voor vloeibare gevaarlijke stoffen in verpakking geldt volgens PGS 15: minimaal 110% van de grootste verpakking opvangen.',
      'Controleer altijd of het materiaal bestand is tegen uw vloeistof.'
    ],
    sections: [
      {
        h: 'Hoe werkt een flexibele lekbak?',
        p: [
          'De bodem en de opstaande randen vormen samen één bak. Lekt er iets uit een IBC, een vat of een machine, dan blijft het binnen de randen. Daarna zuigt of pompt u de vloeistof op en voert u die af zoals voor die stof is voorgeschreven.',
          'De opvangbakken die wij leveren, zijn gemaakt van polyesterweefsel met een EVA-coating van 1.365 g/m². Volgens de fabrikant is dat sterker en chemisch beter bestand dan het PVC-weefsel van 650 tot 900 g/m² dat vaak voor standaard lekbakken wordt gebruikt.'
        ],
        image: { src: IMG + 'opvangbak-leeg.jpg', alt: 'Lege flexibele opvangbak met opstaande randen', caption: 'Een lege opvangbak: de bodem en de opstaande randen vormen samen de bak.' }
      },
      {
        h: 'Flexibel of staal: wat past bij uw situatie?',
        p: ['Een stalen lekbak is een prima oplossing voor een vaste plek. Een flexibele bak is sterker in situaties waar het om snelheid, ruimte of verplaatsen gaat.'],
        table: {
          head: ['Situatie', 'Meestal de beste keuze', 'Waarom'],
          rows: [
            ['Tijdelijke opslag of wisselende werkplek', 'Flexibel', 'Snel geplaatst en daarna weer opgeruimd'],
            ['Weinig ruimte of een afwijkende maat', 'Flexibel', 'Op maat te maken, ook rond een machine'],
            ['Onder een aggregaat, pomp of voertuig', 'Flexibel', 'Er zijn uitvoeringen voor aggregaten, tankwagens en vrachtwagens'],
            ['Vaste opslag waar dagelijks een heftruck in en uit rijdt', 'Vaak staal', 'Beter bestand tegen dagelijks stoten en schuren'],
            ['Opslag in een brandwerende kast of ruimte', 'Volgens de eisen van die opslag', 'Bespreek dit met uw adviseur of het bevoegd gezag']
          ]
        }
      },
      {
        h: 'Welke maten zijn er?',
        p: [`Er zijn standaardmaten voor vaten, IBC's, aggregaten en voertuigen. Past geen van deze maten, dan is maatwerk mogelijk. Bekijk alle [flexibele opvangbakken](${L.opvang}).`],
        table: {
          head: ['Uitvoering', 'Opvangcapaciteit', 'Afmetingen (l × b × h)'],
          rows: [
            ['1 vat', '226 liter', '1,05 × 0,65 × 0,35 m'],
            ['2 vaten', '410 liter', '1,90 × 0,65 × 0,35 m'],
            ['4 vaten (laag model)', '412 liter', '2,90 × 1,07 × 0,14 m'],
            ['1 IBC', '1.149 liter', '2,16 × 1,60 × 0,35 m'],
            ["2 IBC's", '1.795 liter', '2,50 × 2,16 × 0,35 m'],
            ["4 IBC's", '2.420 liter', '5,20 × 1,40 × 0,35 m'],
            ["10 IBC's", '5.836 liter', '5,95 × 2,95 × 0,35 m'],
            ['Aggregaat (3 × 1,5 m)', '1.451 liter', '2,91 × 1,50 × 0,35 m'],
            ['Tankwagen (inrijdbaar)', '11.655 liter', '9,50 × 3,69 × 0,35 m'],
            ['Vrachtwagen (inrijdbaar)', '22.575 liter', '18,40 × 3,69 × 0,35 m']
          ]
        }
      },
      {
        h: 'Is de lekbak bestand tegen mijn vloeistof?',
        p: ['Dat verschilt per stof. De fabrikant heeft een bestendigheidstabel waarin per vloeistof staat hoe het materiaal zich houdt bij twee jaar contact: A (goed), B (matig) of C (niet geschikt). De meeste oliën en veel chemicaliën scoren goed, maar niet alles. Zoutzuur 32% bijvoorbeeld staat op C.'],
        callout: { t: 'Tip', d: 'Houd het veiligheidsinformatieblad (VIB) van de stof bij de hand. Daarin staat precies welke stof het is. Stuur het mee met uw aanvraag, dan controleren wij de bestendigheid voor u.' }
      },
      {
        h: 'Wat zeggen de regels?',
        p: [
          'Voor de opslag van vloeibare gevaarlijke stoffen in verpakking is **PGS 15** de richtlijn. Daarin staat dat de opvang minimaal **110% van de inhoud van de grootste verpakking** moet zijn. Is 10% van de totale inhoud meer, dan geldt die 10%. Lege, niet-gereinigde verpakkingen tellen niet mee.',
          `Of PGS 15 voor uw opslag geldt, hangt af van de stoffen en de hoeveelheid. Dat bepaalt het bevoegd gezag, meestal de gemeente of de omgevingsdienst. In het artikel [Opvangcapaciteit berekenen](${L.capaciteit}) staan rekenvoorbeelden.`
        ]
      },
      {
        h: 'Binnen of buiten?',
        p: ['Een flexibele lekbak kan buiten staan. Volgens de fabrikant blijft het materiaal bruikbaar van −40 °C tot +70 °C. Buiten komt er wel regenwater in de bak, en dat gaat af van de opvangcapaciteit. Kies buiten liever een ruimere bak of zet de opslag onder een overkapping.']
      },
      {
        h: 'Gebruik en controle',
        list: [
          'Leg de bak op een vlakke ondergrond zonder scherpe stenen of uitsteeksels.',
          'Zet IBC’s en vaten voorzichtig neer en schuif ze niet over de bodem.',
          'Houd kranen en aftappunten boven de bak.',
          'Controleer de bak regelmatig op schade en verwijder gelekte vloeistof direct.',
          'Staat de bak buiten, kijk dan na een regenbui of er water in staat.'
        ]
      }
    ],
    faq: [
      { q: 'Hoe lang gaat een flexibele lekbak mee?', a: 'De fabrikant geeft 7 jaar garantie op de opvangbakken die wij leveren. Hoe lang hij in de praktijk meegaat, hangt af van het gebruik, de vloeistof en of hij binnen of buiten staat.' },
      { q: 'Kan een flexibele lekbak buiten staan?', a: 'Ja. Het materiaal blijft volgens de fabrikant bruikbaar van −40 °C tot +70 °C. Houd er rekening mee dat regenwater de beschikbare opvangcapaciteit verkleint.' },
      { q: 'Is een flexibele lekbak geschikt voor brandbare vloeistoffen?', a: 'Volgens de fabrikant zijn de opvangbakken geschikt voor ATEX-zone 2 (categorie 3G), ook voor stoffen uit subgroep IIA, IIB en IIC. Welke eisen voor uw opslag gelden, bepaalt het bevoegd gezag.' },
      { q: 'Kan ik een lekbak op maat laten maken?', a: 'Ja. Geef de afmetingen van de ruimte of de machine door en vertel wat erin komt te staan. Wij vragen bij de fabrikant na wat mogelijk is.' }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-ibc', 'opvangbak-2-vaten', 'opvangbak-aggregaat'],
    sources: [SRC.pgs15, SRC.pgs]
  },

  {
    slug: 'welke-opvangbak-heb-ik-nodig-voor-ibcs',
    kicker: 'Opvang',
    title: 'IBC lekbak kiezen: zo bepaalt u de juiste opvangbak',
    seoTitle: 'IBC lekbak kiezen: maat, capaciteit en materiaal | EnviroFlow',
    description: "Welke lekbak heeft u nodig voor 1, 2, 4 of 10 IBC's? Stappenplan met rekenvoorbeeld (PGS 15), maten en tips voor binnen- en buitenopslag.",
    updated: UPDATED,
    image: { src: IMG + 'sfeer-opslag-vaten.jpg', alt: "IBC's in flexibele opvangbakken in een magazijn, met een palletwagen" },
    intro: 'Een IBC bevat 1.000 liter. Lekt die leeg zonder goede opvang eronder, dan heeft u een groot probleem: vloeistof op de vloer, in de bodem of in het riool. Met vijf vragen kiest u een IBC lekbak die past bij het aantal containers, de vloeistof en de plek.',
    takeaways: [
      'Voor één volle IBC van 1.000 liter is volgens PGS 15 minimaal 1.100 liter opvang nodig.',
      "Bij meerdere IBC's telt 110% van de grootste, of 10% van het totaal als dat meer is.",
      'Buiten vult regenwater de bak. Houd daar ruimte voor.',
      "Flexibele IBC lekbakken zijn er voor 1, 2, 4 en 10 IBC's, en op maat."
    ],
    sections: [
      {
        h: 'Vijf vragen voordat u kiest',
        steps: [
          { t: "Hoeveel IBC's staan er tegelijk?", d: "Tel wat er op het drukste moment staat, niet het gemiddelde. Denk ook aan volle IBC's die bij een levering tijdelijk worden neergezet." },
          { t: 'Welke vloeistof zit erin?', d: 'Pak het veiligheidsinformatieblad erbij. Het materiaal van de bak moet bestand zijn tegen de stof.' },
          { t: 'Hoeveel opvangcapaciteit is nodig?', d: 'Reken met de 110%-regel uit PGS 15. Het rekenvoorbeeld staat hieronder.' },
          { t: 'Binnen of buiten?', d: 'Buiten komt regenwater in de bak. Dat gaat af van de opvangcapaciteit.' },
          { t: 'Hoeveel ruimte is er?', d: 'Meet de vloer: lengte, breedte en de doorgang voor de palletwagen of heftruck.' }
        ]
      },
      {
        h: 'Rekenvoorbeeld: hoeveel opvang heeft u nodig?',
        p: ['Volgens PGS 15 moet de opvang minimaal 110% zijn van de inhoud van de grootste verpakking. Is 10% van de totale inhoud meer, dan geldt die 10%. Voor volle IBC’s van 1.000 liter ziet dat er zo uit:'],
        table: {
          head: ["Aantal IBC's", 'Totale inhoud', '110% van de grootste', '10% van het totaal', 'Minimaal nodig'],
          rows: [
            ['1', '1.000 liter', '1.100 liter', '100 liter', '1.100 liter'],
            ['2', '2.000 liter', '1.100 liter', '200 liter', '1.100 liter'],
            ['4', '4.000 liter', '1.100 liter', '400 liter', '1.100 liter'],
            ['10', '10.000 liter', '1.100 liter', '1.000 liter', '1.100 liter'],
            ['12', '12.000 liter', '1.100 liter', '1.200 liter', '1.200 liter']
          ],
          note: "Pas vanaf twaalf volle IBC's in één opvangvoorziening wordt de 10%-regel bepalend."
        },
        after: [`Meer voorbeelden, ook met vaten, vindt u in [Opvangcapaciteit berekenen](${L.capaciteit}).`]
      },
      {
        h: 'Welke IBC lekbak past?',
        p: ["Alle standaard IBC lekbakken hieronder hebben meer opvangcapaciteit dan de 1.100 liter die nodig is voor volle IBC's van 1.000 liter."],
        table: {
          head: ['Uitvoering', 'Opvangcapaciteit', 'Afmetingen (l × b × h)'],
          rows: [
            ['1 IBC', '1.149 liter', '2,16 × 1,60 × 0,35 m'],
            ["2 IBC's", '1.795 liter', '2,50 × 2,16 × 0,35 m'],
            ["4 IBC's (op een rij)", '2.420 liter', '5,20 × 1,40 × 0,35 m'],
            ["10 IBC's", '5.836 liter', '5,95 × 2,95 × 0,35 m']
          ]
        },
        callout: { t: 'Let op', d: 'Dit rekenvoorbeeld gaat uit van een bak zonder regenwater. Het bevoegd gezag bepaalt welke eisen voor uw opslag gelden.' },
        image: { src: IMG + 'opvangbak-4-ibc.jpg', alt: "Flexibele opvangbak met vier IBC's op een rij", caption: "De lekbak voor 4 IBC's is smal en lang en past daardoor goed langs een wand of in een gang." }
      },
      {
        h: 'Binnen of buiten',
        p: ['Binnen telt alleen de inhoud van de IBC’s. Buiten komt daar regenwater bij. Een bak die na een paar regenbuien half vol staat, vangt bij een lekkage minder op dan u denkt. Kies buiten daarom een ruimere bak, zet de opslag onder een overkapping of controleer na elke bui en pomp schoon regenwater af.']
      },
      {
        h: 'Tips voor dagelijks gebruik',
        list: [
          'Zet de IBC’s met een palletwagen of heftruck in de bak en schuif ze niet over de bodem.',
          'Houd de aftapkraan boven de bak, zodat ook druppels bij het aftappen worden opgevangen.',
          'Zet stoffen die met elkaar kunnen reageren niet in dezelfde bak. Het veiligheidsinformatieblad zegt welke stoffen u apart moet houden.',
          'Controleer de bak regelmatig op schade en op vloeistof die er niet hoort.'
        ]
      }
    ],
    faq: [
      { q: 'Hoeveel liter moet een IBC lekbak kunnen opvangen?', a: 'Voor één volle IBC van 1.000 liter minimaal 1.100 liter (110% van de grootste verpakking, volgens PGS 15).' },
      { q: "Mag ik meerdere IBC's in één lekbak zetten?", a: "Ja, als de bak groot genoeg is: minimaal 110% van de grootste IBC, of 10% van de totale inhoud als dat meer is. Voor 2 tot 11 volle IBC's van 1.000 liter is dat 1.100 liter." },
      { q: "Kan ik IBC's met verschillende stoffen in één bak zetten?", a: 'Alleen als de stoffen niet met elkaar reageren. Kijk in het veiligheidsinformatieblad of vraag het ons.' },
      { q: 'Kan de bak buiten staan?', a: 'Ja. Houd wel rekening met regenwater: dat verkleint de beschikbare opvangcapaciteit.' }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-ibc', 'opvangbak-2-ibc', 'opvangbak-4-ibc', 'opvangbak-10-ibc'],
    sources: [SRC.pgs15]
  },

  {
    slug: 'hoe-kies-je-de-juiste-opvangcapaciteit',
    kicker: 'Regels en berekenen',
    title: 'Opvangcapaciteit berekenen: de 110%-regel uitgelegd',
    seoTitle: 'Opvangcapaciteit lekbak berekenen (PGS 15: 110%-regel) | EnviroFlow',
    description: 'Hoeveel liter moet een lekbak kunnen opvangen? De 110%- en 10%-regel uit PGS 15 uitgelegd, met rekenvoorbeelden voor IBC’s en vaten.',
    updated: UPDATED,
    image: { src: IMG + 'opvangbak-praktijk.jpg', alt: 'Vaten op pallets in een grote flexibele opvangbak' },
    intro: 'De opvangcapaciteit is de hoeveelheid vloeistof die een lekbak kan vasthouden voordat hij overloopt. Te weinig betekent dat een lekkage alsnog op de vloer of in de bodem komt. Voor de opslag van vloeibare gevaarlijke stoffen in verpakking geeft PGS 15 een duidelijke rekenregel. Zo werkt die.',
    takeaways: [
      'Minimaal 110% van de inhoud van de grootste verpakking.',
      'Is 10% van de totale inhoud meer? Dan geldt die 10%.',
      'Lege, niet-gereinigde verpakkingen tellen niet mee.',
      'Voor vaste stoffen is volgens PGS 15 geen productopvang nodig.'
    ],
    sections: [
      {
        h: 'De regel in het kort',
        p: ['In PGS 15 (versie 2021) staat dat de opvangcapaciteit ten minste 110% moet zijn van de inhoud van de grootste verpakking in de opslag. Is 110% van de grootste verpakking minder dan 10% van de totale inhoud, dan moet u die 10% aanhouden. Het uitgangspunt is simpel: er mag geen vloeistof uit de opslag stromen.']
      },
      {
        h: 'Zo rekent u het uit',
        steps: [
          { t: 'Neem de grootste verpakking × 1,1', d: 'Een IBC van 1.000 liter geeft 1.100 liter. Een vat van 200 liter geeft 220 liter.' },
          { t: 'Neem de totale inhoud × 0,1', d: 'Tel alle volle verpakkingen bij elkaar op en neem daar 10% van.' },
          { t: 'Kies het hoogste getal', d: 'Dat is de opvangcapaciteit die u minimaal nodig heeft.' }
        ]
      },
      {
        h: 'Rekenvoorbeelden',
        table: {
          head: ['Wat staat er?', '110% van de grootste', '10% van het totaal', 'Minimaal nodig'],
          rows: [
            ['1 vat van 200 liter', '220 liter', '20 liter', '220 liter'],
            ['4 vaten van 200 liter', '220 liter', '80 liter', '220 liter'],
            ["6 IBC's van 1.000 liter en 8 vaten van 200 liter", '1.100 liter', '760 liter', '1.100 liter'],
            ['40 vaten van 200 liter', '220 liter', '800 liter', '800 liter'],
            ["12 IBC's van 1.000 liter", '1.100 liter', '1.200 liter', '1.200 liter']
          ],
          note: 'Bij een paar grote verpakkingen is meestal de 110%-regel bepalend. Bij veel kleine verpakkingen vaak de 10%-regel.'
        }
      },
      {
        h: 'Eén grote bak of meerdere kleine?',
        p: [
          'Beide mag. Volgens PGS 15 kunt u de opvang voor de hele opslag in één keer regelen, of met kleinere lekbakken per stelling, pallet of verpakking. Elke bak moet dan wel voldoen voor wat erin staat.',
          `Meerdere kleine bakken zijn handig als de opslag verspreid staat of vaak verandert. Eén grote bak is overzichtelijk bij een vaste opslag. Bekijk de [maten van de flexibele opvangbakken](${L.opvang}).`
        ],
        image: { src: IMG + 'opvangbak-10-ibc.jpg', alt: "Flexibele opvangbak voor tien IBC's", caption: "Eén bak voor tien IBC's: 5.836 liter opvangcapaciteit." }
      },
      {
        h: 'Buiten: reken regenwater mee',
        p: ['De rekenregel gaat uit van een lege bak. Buiten loopt de bak bij regen vol en blijft er minder ruimte over voor een lekkage. Kies daarom een ruimere bak, zet de opslag onder een overkapping of controleer na elke regenbui.']
      },
      {
        h: 'Wanneer geldt PGS 15?',
        p: ['PGS 15 gaat over de opslag van verpakte gevaarlijke stoffen. Of de richtlijn voor uw opslag geldt, hangt af van welke stoffen u opslaat en hoeveel. Dat bepaalt het bevoegd gezag, meestal de gemeente of de omgevingsdienst.'],
        callout: { t: 'Wij rekenen met u mee', d: 'Stuur een lijstje van wat er staat: het aantal verpakkingen, de inhoud en de stof. Wij rekenen uit hoeveel opvang u nodig heeft en welke bak past.' }
      }
    ],
    faq: [
      { q: 'Hoeveel opvang heb ik nodig voor één IBC?', a: 'Voor één volle IBC van 1.000 liter minimaal 1.100 liter.' },
      { q: 'Tellen lege IBC’s en vaten mee?', a: 'Lege, niet-gereinigde verpakkingen tellen volgens PGS 15 niet mee voor de berekening van de opvangcapaciteit.' },
      { q: 'Geldt de 110%-regel ook voor vaste stoffen?', a: 'Nee. Volgens PGS 15 is productopvang niet nodig voor de opslag van vaste gevaarlijke stoffen.' },
      { q: 'Geldt deze regel ook voor diesel in een tank?', a: `Nee. PGS 15 gaat over verpakkingen. Voor diesel in een bovengrondse tank gelden andere regels; die leest u in ons artikel over diesel tijdelijk opslaan op locatie.` }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-vat', 'opvangbak-4-vaten', 'opvangbak-10-ibc'],
    sources: [SRC.pgs15, SRC.pgs]
  },

  {
    slug: 'flexibele-tank-of-stalen-tank',
    kicker: 'Tanks',
    title: 'Flexibele tank of vaste tank: wat past bij uw situatie?',
    seoTitle: 'Flexibele watertank of vaste tank? De verschillen op een rij | EnviroFlow',
    description: 'Flexibele tank of vaste stalen tank voor water, brandstof of mest? Vergelijk plaatsing, ruimte, verplaatsen en toepassingen in één overzicht.',
    updated: UPDATED,
    image: { src: IMG + 'waterbase-f.jpg', alt: 'Flexibele tank op een bedrijfsterrein' },
    intro: 'Moet u water, brandstof of mest opslaan, dan denkt u misschien eerst aan een stalen tank of een betonnen kelder. Een flexibele tank is een kussenvormige tank van technisch textiel die zich vormt naar de inhoud. Leeg is hij compact, en plaatsen gaat snel. Welke van de twee beter past, hangt af van uw situatie.',
    takeaways: [
      'Een flexibele tank heeft geen fundering of hijswerk nodig, alleen een vlakke, schone ondergrond.',
      'Leeg kunt u hem opvouwen en meenemen naar een volgende locatie.',
      'Een vaste tank past beter bij weinig vloeroppervlak en jarenlang dezelfde plek.',
      'Flexibele tanks zijn er van 200 liter tot 300 m³, afhankelijk van de vloeistof.'
    ],
    sections: [
      {
        h: 'Hoe werkt een flexibele tank?',
        p: ['Een flexibele tank ligt plat op de grond en vult zich als een kussen. Hij is gemaakt van meerlaags weefsel met een coating die past bij de vloeistof: PVC voor water en mest, TPU voor drinkwater en brandstof. Vullen en legen gaat via vaste aansluitingen, zoals Storz-koppelingen.'],
        image: { src: IMG + 'waterbase-r.jpg', alt: 'Gevulde flexibele buffertank op een terrein', caption: 'Een flexibele tank vormt zich naar de inhoud. Hij heeft alleen een vlakke ondergrond nodig.' }
      },
      {
        h: 'De verschillen op een rij',
        table: {
          head: ['', 'Flexibele tank', 'Vaste (stalen) tank'],
          rows: [
            ['Plaatsing', 'Uitrollen op een vlakke ondergrond, bijvoorbeeld een verdicht zandbed', 'Fundering, transport en vaak een kraan'],
            ['Ruimte', 'Plat en breed: veel vloeroppervlak, weinig hoogte', 'Hoog en compact: weinig vloeroppervlak'],
            ['Hoogte', 'Laag profiel; een buffertank van 250 m³ is maximaal 1,4 m hoog', 'Afhankelijk van het model, vaak meerdere meters'],
            ['Verplaatsen', 'Leeg op te vouwen en mee te nemen', 'Blijft meestal op dezelfde plek'],
            ['Tijdelijk gebruik', 'Goed geschikt', 'Minder geschikt']
          ]
        }
      },
      {
        h: 'Wanneer kiest u een flexibele tank?',
        list: [
          'U heeft opslag nodig voor een project, een seizoen of een calamiteit.',
          'Een fundering of hijswerk is niet mogelijk of niet gewenst.',
          'U wilt snel extra capaciteit, zonder bouwwerkzaamheden.',
          'Er is ruimte in de breedte, maar niet in de hoogte.'
        ]
      },
      {
        h: 'Wanneer is een vaste tank logischer?',
        list: [
          'Er is weinig vloeroppervlak beschikbaar.',
          'De opslag blijft tientallen jaren op precies dezelfde plek.',
          'Er rijdt dagelijks zwaar verkeer vlak langs of over de opslagplek.'
        ]
      },
      {
        h: 'Welke flexibele tank voor welke vloeistof?',
        table: {
          head: ['Vloeistof', 'Tank', 'Inhoud'],
          rows: [
            ['Bluswater', `[Waterbase F](${L.brandwater})`, '50 tot 300 m³'],
            ['Drinkwater', `[Waterbase D Plus](${L.drinkwater})`, '500 liter tot 200 m³'],
            ['Regen- en proceswater', `[Waterbase R](${L.buffer})`, '10 tot 250 m³'],
            ['Afvalwater', `[Waterbase W](${L.afvalwater})`, '10 tot 250 m³'],
            ['Diesel en verwarmingsolie', `[Fuelbase XSD](${L.brandstof})`, '200, 500 of 900 liter'],
            ['Drijfmest en digestaat', `[Farmer type S](${L.mest})`, '50 tot 300 m³'],
            ['UAN en vloeibare kunstmest', `[Farmer type U](${L.uan})`, '10 tot 265 m³'],
            ['Snel veel water, open bovenkant', `[Hydronion](${L.open})`, '5.000 tot 25.000 liter']
          ]
        }
      },
      {
        h: 'Waar let u op bij het plaatsen?',
        list: [
          'Een vlakke, schone ondergrond zonder scherpe stenen of uitsteeksels.',
          'Ruimte rondom de tank voor de aansluitingen en om bij te kunnen.',
          'Bereikbaarheid voor de vrachtwagen of pomp die vult of leegt.',
          'Brandstof: volgens de fabrikant moet de tank in een opvangbak staan die minimaal 110% van de tankinhoud opvangt.'
        ]
      }
    ],
    faq: [
      { q: 'Hoe lang gaat een flexibele tank mee?', a: 'Dat verschilt per type. De fabrikant geeft 2 tot 10 jaar garantie, afhankelijk van de tank. Bij de brandwatertank is 2 jaar uit te breiden tot 10 jaar met een jaarlijkse inspectie.' },
      { q: 'Kan een flexibele tank buiten staan?', a: 'Ja. De tanks zijn UV-bestendig, en de meeste blijven volgens de fabrikant flexibel tot −30 °C.' },
      { q: 'Heb ik een vergunning nodig?', a: 'Dat hangt af van de vloeistof, de inhoud en de plek. Vraag het na bij uw gemeente of kijk in het Omgevingsloket.' }
    ],
    categories: ['industriele-water-en-buffertanks', 'brandstoftanks', 'brandwatertanks'],
    products: ['waterbase-r-retentietank', 'exflo-waterbase-f', 'fuelbase-brandstoftank'],
    sources: []
  },

  {
    slug: 'tijdelijke-wateropslag-op-de-bouwplaats',
    kicker: 'Water',
    title: 'Tijdelijke wateropslag op de bouwplaats: vijf oplossingen',
    seoTitle: 'Tijdelijke wateropslag op de bouwplaats | Flexibele watertank | EnviroFlow',
    description: 'Water nodig op een bouwplaats zonder aansluiting? Vijf manieren om tijdelijk water op te slaan, van open tank tot flexibele buffertank, met inhoud en tips.',
    updated: UPDATED,
    image: { src: IMG + 'waterbase-r-30000.jpg', alt: 'Gevulde flexibele watertank op een parkeerterrein' },
    intro: 'Op een bouwplaats is water nodig: om materieel te reinigen, om stof te beperken, als bluswater of als drinkwater in de keet. Niet elke locatie heeft daarvoor een aansluiting, en een vaste tank bouwen is voor een project van een paar maanden zonde. Een flexibele of open tank lost dat op.',
    takeaways: [
      'Een open tank staat er binnen enkele minuten en is direct te vullen.',
      'Een flexibele buffertank slaat tot 250 m³ op, met een maximale hoogte van 1,4 m.',
      'Voor drinkwater is een aparte tank met een drinkwatercertificaat nodig.',
      'Na het project maakt u de tank leeg, laat u hem drogen en vouwt u hem op.'
    ],
    sections: [
      {
        h: 'Vijf oplossingen vergeleken',
        table: {
          head: ['Oplossing', 'Inhoud', 'Goed voor', 'Let op'],
          rows: [
            [`[Open tank (Hydronion)](${L.open})`, '5.000 tot 25.000 liter', 'Snel veel water, vullen en afnemen door meerdere eenheden tegelijk', 'Open bovenkant'],
            [`[Flexibele buffertank (Waterbase R)](${L.buffer})`, '10 tot 250 m³', 'Grote hoeveelheden proces- of regenwater', 'Vlakke ondergrond nodig'],
            [`[Industriewatertank 30.000 l](${L.buffer})`, '30 m³', 'Industriewater en vuil water, één vaste maat (8,78 × 4,95 m)', 'Geen drinkwater'],
            [`[Mobiele tank (Flextanker)](${L.mobiel})`, '500 tot 10.000 liter', 'Water verplaatsen op een aanhanger of pick-up', 'Kies de maat bij uw aanhanger'],
            [`[Drinkwatertank (Waterbase D Plus)](${L.drinkwater})`, '500 liter tot 200 m³', 'Drinkwater op locatie', 'Buitenlandse certificaten, geen Nederlandse goedkeuring']
          ]
        }
      },
      {
        h: 'Snel water nodig: de open tank',
        p: ['Een open, zelfdragende tank heeft geen frame. U legt hem uit, vult hem en hij staat. Volgens de fabrikant is hij in twee minuten opgezet. Via twee aansluitingen met Storz 110-koppeling kunnen meerdere eenheden tegelijk vullen en afnemen.'],
        image: { src: IMG + 'hydronion.jpg', alt: 'Open zelfdragende watertank tijdens een oefening van de brandweer', caption: 'Een open tank is in een paar minuten klaar voor gebruik.' }
      },
      {
        h: 'Veel water, lange tijd: de buffertank',
        p: ['Een flexibele buffertank is gesloten en geschikt voor grote volumes. De tank ligt laag: zelfs de grootste uitvoering van 250 m³ is maximaal 1,4 m hoog. Leeg weegt hij tussen de 63 en 599 kg, afhankelijk van de maat.']
      },
      {
        h: 'Zo pakt u het aan',
        steps: [
          { t: 'Bepaal hoeveel water u nodig heeft', d: 'Per dag en in totaal. Dat bepaalt de inhoud en hoe vaak u moet bijvullen.' },
          { t: 'Kies de plek', d: 'Vlak, bereikbaar voor de vrachtwagen of pomp, en niet in de looproute van zwaar materieel.' },
          { t: 'Maak de ondergrond klaar', d: 'Verwijder stenen en scherpe delen. Een zandbed of een beschermmat onder de tank helpt.' },
          { t: 'Sluit aan en vul', d: 'De tanks hebben Storz-koppelingen, zodat brandweer- en bouwslangen direct passen.' },
          { t: 'Opruimen na het project', d: 'Leeg maken, laten drogen en opvouwen. Zo is de tank klaar voor het volgende project.' }
        ]
      },
      {
        h: 'Drinkwater: let op de houdbaarheid',
        p: ['Voor drinkwater gebruikt u een aparte tank van een materiaal dat geschikt is voor contact met drinkwater. De Waterbase D Plus heeft volgens de fabrikant een Pools PZH-certificaat en is gemaakt van weefsel conform BS 6920 met een Brits WRAS-certificaat. Dat zijn geen Nederlandse goedkeuringen; controleer welke eisen voor uw situatie gelden.'],
        callout: { t: 'Goed om te weten', d: 'Volgens de fabrikant moet drinkwater uit een flexibele tank bij 20 °C binnen 24 tot 48 uur worden gebruikt. Daarna kunnen bacteriën snel groeien.' }
      }
    ],
    faq: [
      { q: 'Hoe snel staat een tijdelijke watertank?', a: 'Een open tank is volgens de fabrikant in twee minuten opgezet. Een gesloten afvalwatertank staat in ongeveer 30 minuten. Daarna volgt het vullen.' },
      { q: 'Kan ik de tank na het project hergebruiken?', a: 'Ja. Maak hem leeg, laat hem drogen en vouw hem op. Leeg neemt hij maar een paar procent van zijn volume in.' },
      { q: 'Mag ik drinkwater in elke watertank bewaren?', a: 'Nee. Gebruik een tank die bedoeld is voor drinkwater, zoals de Waterbase D Plus, en gebruik het water op tijd.' }
    ],
    categories: ['industriele-water-en-buffertanks', 'open-zelfdragende-tanks', 'mobiele-watertanks'],
    products: ['exflo-hydronion', 'waterbase-r-retentietank', 'exflo-flextanker'],
    sources: []
  },

  {
    slug: 'bluswatervoorziening-met-een-flexibele-tank',
    kicker: 'Brandveiligheid',
    title: 'Bluswatervoorziening regelen met een flexibele brandwatertank',
    seoTitle: 'Bluswatertank en brandwatertank: bluswatervoorziening regelen | EnviroFlow',
    description: 'Onvoldoende bluswater op uw locatie? Lees wie de eisen bepaalt, hoe een flexibele brandwatertank werkt, welke maten er zijn en hoe hij vorstvrij blijft.',
    updated: UPDATED,
    image: { src: IMG + 'waterbase-f-2.jpg', alt: 'Flexibele brandwatertank naast een bedrijfsgebouw' },
    intro: 'Niet elke locatie heeft genoeg bluswater uit de waterleiding of uit open water in de buurt. Denk aan een bedrijf op een bedrijventerrein aan de rand van het net, een boerderij in het buitengebied of een tijdelijke bouwlocatie. De brandweer kan dan om een eigen bluswatervoorziening vragen. Een flexibele brandwatertank is een snelle manier om die te regelen.',
    takeaways: [
      'De brandweer of veiligheidsregio adviseert over hoeveel bluswater nodig is.',
      'Een flexibele brandwatertank is er van 50 tot 300 m³.',
      'Verwarmingsmatten met sensoren en isolatie houden het water ook in de winter vloeibaar.',
      'Voor tijdelijk bluswater is een open tank in enkele minuten opgezet.'
    ],
    sections: [
      {
        h: 'Wie bepaalt hoeveel bluswater u nodig heeft?',
        p: [
          'Dat doet de brandweer, via de veiligheidsregio. Veel regio’s gebruiken daarbij de Handreiking Bluswatervoorziening en Bereikbaarheid van Brandweer Nederland uit 2019. Dat is geen wet, maar een advieskader. Sommige regio’s hebben er een eigen versie van.',
          'Neem het advies van de brandweer mee in uw aanvraag. Daarin staat meestal hoeveel water er nodig is, welke aansluitingen en hoe ver de voorziening van het gebouw mag staan.'
        ]
      },
      {
        h: 'Zo werkt een flexibele brandwatertank',
        p: ['Een flexibele brandwatertank is een gesloten kussentank van meerlaags weefsel met een interne polyester versterking. Hij ligt op een vlakke ondergrond, bijvoorbeeld een verdicht zandbed. Bouwwerkzaamheden zijn niet nodig.'],
        list: [
          'Twee afnameaansluitingen DN100 met Storz 110-koppeling, met verwarmingskabels en isolatie',
          'Eén vulaansluiting met Storz 110-koppeling',
          'Verwarmingsmatten met regelunit en sensoren',
          'Isolatiematten en een afdekking met spanbanden',
          'Optioneel te koppelen aan een hydrofoorinstallatie of waterstandsbewaking'
        ]
      },
      {
        h: 'Maten en verwarmingsvermogen',
        table: {
          head: ['Inhoud', 'Afmetingen (l × b)', 'Vermogen verwarmingsmatten'],
          rows: [
            ['50 m³', '8,78 × 7,45 m', '7,5 kW'],
            ['100 m³', '11,72 × 9,00 m', '11,5 kW'],
            ['150 m³', '14,70 × 9,85 m', '15,0 kW'],
            ['200 m³', '15,25 × 11,86 m', '18,8 kW'],
            ['225 m³', '16,87 × 11,86 m', '22,5 kW'],
            ['250 m³', '18,85 × 11,86 m', '22,5 kW'],
            ['300 m³', '20,50 × 11,86 m', '26,1 kW']
          ]
        }
      },
      {
        h: 'Ook in de winter bruikbaar',
        p: ['Bluswater dat bevroren is, heeft u niets aan. Daarom liggen er verwarmingsmatten met temperatuursensoren onder de tank en zit er isolatie omheen. Het materiaal blijft volgens de fabrikant flexibel tot −30 °C.'],
        callout: { t: 'Energieverbruik', d: 'Volgens de fabrikant hoeft de verwarming van mei tot en met oktober niet aan. In stand-by verbruikt het systeem ongeveer 22 tot 36 kWh per maand. De verwarmingsmatten moeten worden aangesloten door een erkend elektricien.' }
      },
      {
        h: 'Tijdelijk bluswater nodig?',
        p: [`Voor een bouwproject, een evenement of tijdens de renovatie van een vaste bluswatertank is een [open zelfdragende tank](${L.open}) een praktische oplossing. Hij heeft geen frame, is volgens de fabrikant in twee minuten opgezet en is er van 5.000 tot 25.000 liter. De hoogte is geschikt om helikopter-blusemmers te vullen.`],
        image: { src: IMG + 'hydronion-2.jpg', alt: 'Open bluswatertank naast een brandweerwagen', caption: 'Een open tank zonder frame: snel neergezet en direct te vullen.' }
      }
    ],
    faq: [
      { q: 'Hoeveel bluswater heb ik nodig?', a: 'Dat adviseert de brandweer of veiligheidsregio op basis van uw gebouw en situatie. Neem dat advies mee in uw aanvraag, dan zoeken wij een passende tank.' },
      { q: 'Heeft de brandwatertank een certificaat?', a: 'Volgens de fabrikant heeft de Waterbase F een CNBOP-goedkeuringscertificaat (nr. 4983/2023). Dat is een Pools certificaat, geen Nederlandse goedkeuring. Bespreek met de brandweer of dit voor uw situatie voldoet.' },
      { q: 'Hoe lang is de garantie?', a: 'De fabrikant geeft 2 jaar garantie, uit te breiden tot 10 jaar bij een jaarlijkse geautoriseerde inspectie.' },
      { q: 'Wat kost een bluswatertank?', a: 'Dat hangt af van de inhoud, de aansluitingen en de toebehoren. Vraag een offerte aan, dan ontvangt u een voorstel op maat.' }
    ],
    categories: ['brandwatertanks', 'open-zelfdragende-tanks'],
    products: ['exflo-waterbase-f', 'exflo-hydronion'],
    sources: []
  },

  {
    slug: 'mest-en-uan-flexibel-opslaan',
    kicker: 'Landbouw',
    title: 'Mestzak of UAN-tank: extra opslag zonder te bouwen',
    seoTitle: 'Mestzak en flexibele mestopslag: regels, maten en tips | EnviroFlow',
    description: 'Extra opslag nodig voor drijfmest, digestaat of UAN? Hoe een mestzak werkt, welke maten er zijn en welke regels gelden voor folie en lekdichtheid.',
    updated: UPDATED,
    image: { src: IMG + 'farmer-s-2.jpg', alt: 'Mestzak naast een akker, met een trekker en mesttank op de achtergrond' },
    intro: 'In het najaar en de winter mag er geen drijfmest worden uitgereden. De opslag moet die maanden overbruggen, en dan blijkt vaak dat de kelder of het bassin te klein is. Een flexibele mestzak geeft extra ruimte, ook op plekken waar bouwen niet kan of te lang duurt.',
    takeaways: [
      'Een mestzak biedt 50 tot 300 m³ extra opslag, zonder bouwwerkzaamheden.',
      'De zak is gesloten, wat volgens de fabrikant gas- en geuruitstoot beperkt.',
      'Voor mestbassins moet de folie gecertificeerd zijn en moet het bassin lekdicht zijn.',
      'Voor UAN en vloeibare kunstmest is er een aparte tank van 10 tot 265 m³.'
    ],
    sections: [
      {
        h: 'Waarom extra mestopslag?',
        list: [
          'In de wintermaanden mag geen drijfmest worden uitgereden. De exacte perioden per grondsoort en gewas staan in de tabel van RVO.',
          'Een extra buffer bij het land waar de mest wordt uitgereden, scheelt rijden.',
          'Tijdelijke opslag tijdens een verbouwing of bij een calamiteit.',
          'Opslag van digestaat of dunne fractie.'
        ]
      },
      {
        h: 'Zo werkt een mestzak',
        p: ['Een mestzak is een gesloten, flexibele tank van gelakt, PVC-gecoat weefsel van 1.300 g/m². Volgens de fabrikant is het weefsel speciaal bedoeld voor contact met natuurlijke meststoffen en digestaat. U vult en leegt de zak via een 5"-schuifafsluiter met hendel: één bij 50 m³, twee vanaf 100 m³. De zak heeft geen menger.'],
        table: {
          head: ['Inhoud', 'Afmetingen (l × b)'],
          rows: [['50 m³', '8,78 × 7,20 m'], ['100 m³', '11,74 × 8,60 m'], ['150 m³', '14,70 × 9,40 m'], ['200 m³', '14,70 × 12,10 m'], ['250 m³', '17,67 × 12,50 m'], ['300 m³', '20,64 × 12,65 m']]
        },
        after: ['Het materiaal is volgens de fabrikant bestand tegen temperaturen van −30 °C tot +70 °C. Op de lekdichtheid zit 10 jaar fabrieksgarantie.']
      },
      {
        h: 'Welke regels gelden?',
        p: [
          'Voor de opslag van drijfmest, digestaat of dunne fractie in een mestbassin staan de regels in paragraaf 4.86 van het Besluit activiteiten leefomgeving (Bal). Voor de bodem komt het hierop neer:'
        ],
        list: [
          'Het bassin moet lekdicht zijn, inclusief de aansluitingen voor vullen en legen.',
          'De folie moet gecertificeerd zijn volgens een van de beoordelingsrichtlijnen BRL-K519, BRL-K537, BRL-K538, BRL-K546 of BRL-1149. Gecertificeerde folie herkent u aan een stempel met de code MB.',
          'Sinds 1 januari 2024 is er geen keuringsplicht meer. U moet het bassin wel regelmatig zelf controleren op schade.',
          'Voor een grote mestopslag, meer dan 750 m² of 2.500 m³ drijfmest, is een omgevingsvergunning nodig.'
        ],
        callout: { t: 'Ons advies', d: 'Of en hoe deze regels op uw mestzak van toepassing zijn, hangt af van uw bedrijf en de plek. Vraag het na bij uw gemeente of omgevingsdienst. Vraag bij elke mestzak naar het certificaat van de folie. Wij zoeken dat voor u uit.' }
      },
      {
        h: 'UAN en vloeibare kunstmest',
        p: [`Voor UAN en andere vloeibare minerale meststoffen is er een aparte [flexibele UAN-tank](${L.uan}) van 10 tot 265 m³. Volgens de fabrikant is hij geschikt voor meststoffen met een pH van 3 tot 10 en een alcoholgehalte onder 4%. De fabrikant adviseert de tank in een extra opvangmembraan te zetten; dat is als tweede tankwand leverbaar.`],
        image: { src: IMG + 'farmer-u-2.jpg', alt: 'Flexibele UAN-tank in een opvangmembraan', caption: 'Een UAN-tank in een opvangmembraan als tweede tankwand.' }
      },
      {
        h: 'Waar let u op bij plaatsen?',
        list: [
          'Een vlakke ondergrond zonder scherpe stenen.',
          'Bereikbaarheid voor de mesttank of pomp.',
          'Afstanden tot sloten, gebouwen en buren: vraag bij de gemeente na wat voor uw plek geldt.',
          'Regelmatig controleren op schade aan de zak en de aansluitingen.'
        ]
      }
    ],
    faq: [
      { q: 'Moet een mestzak gekeurd worden?', a: 'Sinds 1 januari 2024 is er geen keuringsplicht meer voor mestbassins. Het bassin moet wel lekdicht zijn en u moet het regelmatig zelf controleren.' },
      { q: 'Hoe lang gaat een mestzak mee?', a: 'De fabrikant geeft 10 jaar garantie op de lekdichtheid. De werkelijke levensduur hangt af van gebruik en zon.' },
      { q: 'Kan ik een mestzak verplaatsen?', a: 'Ja. Leeg kan de zak worden opgevouwen en op een andere plek opnieuw worden gebruikt.' },
      { q: 'Heb ik een vergunning nodig?', a: 'Voor een grote mestopslag (meer dan 750 m² of 2.500 m³) is een omgevingsvergunning nodig. Voor kleinere opslag hangt het af van uw situatie; vraag het na bij uw gemeente.' }
    ],
    categories: ['mest-en-slurrytanks', 'uan-tanks'],
    products: ['farmer-s-mestzak', 'farmer-u-uan-tank'],
    sources: [SRC.mestBodem, SRC.mestRegels, SRC.rvo]
  },

  {
    slug: 'brandstof-tijdelijk-opslaan-op-locatie',
    kicker: 'Brandstof',
    title: 'Diesel tijdelijk opslaan op de bouwplaats of bij een aggregaat',
    seoTitle: 'Diesel opslaan op locatie: flexibele brandstoftank en regels | EnviroFlow',
    description: 'Diesel tijdelijk opslaan op een project of bij een aggregaat? De regels voor bovengrondse tanks, een flexibele brandstoftank en de juiste opvangbak.',
    updated: UPDATED,
    image: { src: IMG + 'fuelbase.jpg', alt: 'Flexibele brandstoftank in een opvangbak op een zandondergrond' },
    intro: 'Op een bouwplaats, bij noodstroom of bij een tijdelijke verwarming is brandstof nodig dicht bij het gebruik. Een lek is dan snel een bodemverontreiniging. Met de juiste tank en opvang voorkomt u dat. Dit zijn de regels en de mogelijkheden.',
    takeaways: [
      'Een bovengrondse dieseltank moet in of boven een lekbak staan, of dubbelwandig zijn met lekdetectie.',
      'Het vulpunt hoort boven een vloeistofdichte voorziening of een morsbak.',
      'Een flexibele brandstoftank is er in 200, 500 en 900 liter.',
      'Volgens de fabrikant moet de tank in een opvangbak van minimaal 110% van de tankinhoud staan.'
    ],
    sections: [
      {
        h: 'Wat zeggen de regels?',
        p: ['De bodemregels voor het opslaan van diesel in een bovengrondse tank staan in het Besluit activiteiten leefomgeving (Bal). IPLO vat ze zo samen:'],
        list: [
          'De tank staat boven of in een lekbak, of is dubbelwandig met lekdetectie.',
          'Het vul- of aftappunt zit boven een vloeistofdichte voorziening, of boven of in een vulpuntmorsbak.',
          'Een morsbak op de tank heeft minimaal 5 liter inhoud. Een losse morsbak minimaal 65 liter.'
        ],
        after: ['Daarnaast is er PGS 30 voor vloeibare brandstoffen in bovengrondse tanks tot 150 m³. Die noemt ook mobiele tankinstallaties, zoals een losse tank met pomp op een bouwplaats, en wijst op de risico’s van lekken door verplaatsen en van tanken boven onverharde grond. Welke regels voor uw situatie gelden, bepaalt het bevoegd gezag.']
      },
      {
        h: 'De flexibele brandstoftank',
        p: ['De Fuelbase XSD is een zelfdragende, flexibele tank voor diesel en verwarmingsolie. Hij is gemaakt van meerlaags weefsel met een antistatische, UV-bestendige TPU-coating. Volgens de fabrikant wordt elke tank op lekdichtheid getest door UDT, een Pools keuringsinstituut. Opgevouwen neemt hij maar een paar procent van zijn volume in.'],
        table: {
          head: ['Inhoud', 'Afmetingen (l × b)', 'Minimale opvang (110%)'],
          rows: [['200 liter', '1,89 × 0,80 m', '220 liter'], ['500 liter', '1,89 × 1,40 m', '550 liter'], ['900 liter', '1,89 × 1,90 m', '990 liter']]
        },
        callout: { t: 'Let op', d: 'De opvangbak moet niet alleen genoeg liters opvangen, de tank moet er ook ruim in passen. Wij stemmen de juiste maat met u af.' }
      },
      {
        h: 'Opvang onder het aggregaat',
        p: [`Een aggregaat kan ook zelf lekken, bijvoorbeeld bij een storing of bij het bijvullen. Een [opvangbak voor aggregaten](${L.opvang}) van 2,91 × 1,50 m vangt 1.451 liter op en neemt u zo mee naar het volgende project.`],
        image: { src: IMG + 'opvangbak-aggregaat.jpg', alt: 'Aggregaat in een flexibele opvangbak', caption: 'Een aggregaat in een flexibele opvangbak: 1.451 liter opvangcapaciteit.' }
      },
      {
        h: 'Tips voor veilig tanken op locatie',
        list: [
          'Tank nooit boven onverharde grond zonder opvang eronder.',
          'Controleer de tank en de slangen na elke verplaatsing op lekkage.',
          'Beveilig de tank en de pomp tegen onbevoegd gebruik.',
          'Houd absorptiemateriaal bij de hand voor kleine morsingen.',
          'Spreek af wie de tank controleert en hoe vaak.'
        ]
      }
    ],
    faq: [
      { q: 'Mag diesel in een flexibele tank?', a: 'Ja. De Fuelbase XSD is bedoeld voor de tijdelijke opslag van diesel en verwarmingsolie. Hij moet volgens de fabrikant in een opvangbak van minimaal 110% van de tankinhoud staan.' },
      { q: 'Mag benzine in de Fuelbase XSD?', a: 'Nee. De XSD-uitvoering is bedoeld voor diesel en verwarmingsolie.' },
      { q: 'Moet ik de opslag melden?', a: 'Dat hangt af van de hoeveelheid en uw situatie. Vraag het na bij uw gemeente of omgevingsdienst, of kijk in het Omgevingsloket.' }
    ],
    categories: ['brandstoftanks', 'flexibele-opvangbakken'],
    products: ['fuelbase-brandstoftank', 'opvangbak-aggregaat'],
    sources: [SRC.diesel, SRC.pgs30]
  },

  {
    slug: 'je-bedrijf-beschermen-tegen-wateroverlast',
    kicker: 'Wateroverlast',
    title: 'Uw bedrijf beschermen tegen wateroverlast: alternatief voor zandzakken',
    seoTitle: 'Mobiele waterkering als alternatief voor zandzakken | EnviroFlow',
    description: 'Hoe beschermt u uw pand tegen wateroverlast? Een plan in vier stappen, zandzakken en mobiele waterkeringen vergeleken, en welke hoogte u nodig heeft.',
    updated: UPDATED,
    image: { src: IMG + 'exflooder-oefening.jpg', alt: 'Hulpverleners vullen een mobiele waterkering met water' },
    intro: 'Hevige regen, hoog water of een gesprongen leiding: water dat uw pand binnenkomt, richt in korte tijd veel schade aan aan de voorraad, de installaties en het gebouw. Wie vooraf een plan heeft, is sneller en beperkt de schade. Een mobiele waterkering helpt daarbij.',
    takeaways: [
      'Maak een plan voordat het water komt: waar, hoeveel meter, wie en waarmee.',
      'Een mobiele waterkering vult u ter plaatse met water. Dat gaat sneller dan zandzakken vullen.',
      'Er zijn keringen van 22, 45 en 89 cm hoog. Gestapeld komt u boven de 140 cm.',
      'Na gebruik maakt u de kering leeg, laat u hem drogen en bergt u hem compact op.'
    ],
    sections: [
      {
        h: 'Een plan in vier stappen',
        steps: [
          { t: 'Breng in kaart waar water binnenkomt', d: 'Entrees, laaddeuren, garagedeuren, kelderingangen en laaggelegen delen van het terrein.' },
          { t: 'Bepaal lengte en hoogte', d: 'Meet hoeveel meter kering u nodig heeft en hoe hoog het water kan komen.' },
          { t: 'Leg vast wie wat doet', d: 'Wie plaatst de kering, waar ligt hij opgeslagen en waar haalt u het water vandaan?' },
          { t: 'Oefen één keer', d: 'Wie het één keer heeft gedaan, staat er bij een echte calamiteit veel sneller.' }
        ]
      },
      {
        h: 'Zandzakken of mobiele waterkering?',
        table: {
          head: ['', 'Zandzakken', 'Mobiele waterkering'],
          rows: [
            ['Vullen', 'Met zand, zak voor zak', 'Ter plaatse met water, met een pomp of brandkraan'],
            ['Plaatsen', 'Veel handwerk', 'Volgens de fabrikant sneller dan een dijk van zandzakken'],
            ['Na gebruik', 'Vaak nat en vervuild, af te voeren', 'Leeg laten lopen, drogen en opbergen'],
            ['Opslag', 'Veel ruimte voor zand en zakken', 'Opgevouwen een paar procent van het volume']
          ]
        }
      },
      {
        h: 'Welke hoogte heeft u nodig?',
        table: {
          head: ['Uitvoering', 'Hoogte na vullen', 'Lengtes', 'Geschikt voor'],
          rows: [
            ['Ø 22 cm', '22 cm', '3, 5, 10 en 15 m', 'Entrees, garagedeuren en andere lage openingen'],
            ['Ø 46 cm', '45 cm', '5, 10 en 15 m', 'Bedrijfspanden en terreinen'],
            ['Ø 94 cm', '89 cm', '5, 10 en 15 m', 'Hoger water; gestapeld meer dan 140 cm']
          ],
          note: 'De Ø 46 cm en Ø 94 cm zijn er ook als Exflooder+, met een zelfdichtende koppelmof om modules aan elkaar te koppelen.'
        },
        image: { src: IMG + 'sfeer-waterkering.jpg', alt: 'Mobiele waterkering langs een waterkant', caption: 'Modules zijn aan elkaar te koppelen tot de lengte die u nodig heeft.' }
      },
      {
        h: 'Zo plaatst u een mobiele waterkering',
        steps: [
          { t: 'Uitrollen', d: 'Leg de kering op de plek waar het water moet worden tegengehouden.' },
          { t: 'Verankeren', d: 'Zet de kering vast met de verankeringsbanden.' },
          { t: 'Vullen met water', d: 'Sluit een slang met Storz-koppeling aan op de vulaansluiting. Via de ontluchting kan de lucht ontsnappen.' },
          { t: 'Na afloop', d: 'Laat de kering leeglopen via de aftapaansluiting, laat hem drogen en berg hem op.' }
        ],
        after: ['Het weefsel is volgens de fabrikant bestand tegen schimmel en bacteriën tijdens de opslag. Op de Exflooder zit 7 jaar fabrieksgarantie.']
      }
    ],
    faq: [
      { q: 'Hoe hoog wordt een mobiele waterkering?', a: 'Na vullen 22, 45 of 89 cm, afhankelijk van de uitvoering. Met de Ø 94 cm-uitvoering in piramidevorm gestapeld komt u boven de 140 cm.' },
      { q: 'Wat heb ik nodig om de kering te vullen?', a: 'Een waterbron, zoals een pomp of brandkraan, en een slang met Storz-koppeling. Vraag ons welke aansluiting bij uw uitvoering hoort.' },
      { q: 'Kan ik de kering vaker gebruiken?', a: 'Ja. Na gebruik laat u hem leeglopen, laat u hem drogen en vouwt u hem op. De fabrikant geeft 7 jaar garantie.' }
    ],
    categories: ['mobiele-waterkeringen'],
    products: ['exflooder-22', 'exflooder-46', 'exflooder-94'],
    sources: []
  }
];
