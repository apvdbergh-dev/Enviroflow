// Uitleg onder de producten op een categoriepagina, per categorie-id.
// Zelfde opbouw als de secties van een kennisbankartikel: { h, p[], image, list[], table, callout }, plus extra veelgestelde vragen.
// De Engelse versie staat in src/content/en/category-guides.mjs. Alleen vaststaande feiten: regels met de officiële bron, productgegevens volgens de fabrikant.

const IMG = '/assets/img/producten/';

export default {
  'flexibele-opvangbakken': {
    sections: [
      {
        h: 'Hoe werkt een flexibele lekbak?',
        p: [
          'De bodem en de opstaande randen vormen samen één bak. Lekt er iets uit een IBC, een vat of een machine, dan blijft het binnen de randen. Daarna zuigt of pompt u de vloeistof op en voert u die af zoals voor die stof is voorgeschreven.',
          'Wij leveren de lekbakken in twee uitvoeringen. De **Plus** is gemaakt van polyesterweefsel met een EVA-coating van 1.365 g/m². Volgens de fabrikant is dat sterker en chemisch beter bestand dan het PVC-weefsel van 650 tot 900 g/m² dat vaak voor standaard lekbakken wordt gebruikt. De **Starter** is de voordelige uitvoering in PVC-weefsel van 900 g/m², bedoeld voor kortdurend contact met chemicaliën. Meer hierover leest u in [PVC of EVA lekbak: wat is het verschil?](/kennisbank/verschil-pvc-en-eva-lekbak/)'
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
        h: 'Is de lekbak bestand tegen mijn vloeistof?',
        p: ['Dat verschilt per stof en per uitvoering. Voor de Plus (EVA) heeft de fabrikant een bestendigheidstabel waarin per vloeistof staat hoe het materiaal zich houdt bij twee jaar contact: A (goed), B (matig) of C (niet geschikt). De meeste oliën en veel chemicaliën scoren goed, maar niet alles. Zoutzuur 32% bijvoorbeeld staat op C. De Starter (PVC) is bedoeld voor kortdurend contact en is volgens de fabrikant niet geschikt voor onder meer benzine en diesel.'],
        callout: { t: 'Tip', d: 'Houd het veiligheidsinformatieblad (VIB) van de stof bij de hand. Daarin staat precies welke stof het is. Stuur het mee met uw aanvraag, dan controleren wij de bestendigheid voor u.' }
      },
      {
        h: 'Wat zeggen de regels?',
        p: [
          'Voor de opslag van vloeibare gevaarlijke stoffen in verpakking is **PGS 15** de richtlijn. Daarin staat dat de opvang minimaal **110% van de inhoud van de grootste verpakking** moet zijn. Is 10% van de totale inhoud meer, dan geldt die 10%. Lege, niet-gereinigde verpakkingen tellen niet mee. Bron: [IPLO, PGS 15 productopvang](https://iplo.nl/thema/externe-veiligheid/handleiding-publicatiereeks-gevaarlijke-stoffen/pgs-15-algemene-voorschriften/pgs-15-opslagvoorzieningen/pgs-15-productopvang-opslagvoorziening/).',
          'Of een lekbak voor uw opslag verplicht is, hangt af van de stof, de hoeveelheid en de manier van opslaan. In [Wanneer is een lekbak verplicht?](/kennisbank/wanneer-is-een-lekbak-verplicht/) staat het per situatie, met de officiële bronnen. Rekenvoorbeelden vindt u in [Opvangcapaciteit berekenen](/kennisbank/hoe-kies-je-de-juiste-opvangcapaciteit/).'
        ]
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
      { q: 'Hoe heet een flexibele lekbak nog meer?', a: 'Een flexibele lekbak wordt ook opvouwbare lekbak, mobiele lekbak of flexibele opvangbak genoemd. In het Engels heet hij spill containment berm.' },
      { q: 'Hoe lang gaat een flexibele lekbak mee?', a: 'Op de Plus-uitvoering in EVA geeft de fabrikant 7 jaar garantie. Hoe lang een lekbak in de praktijk meegaat, hangt af van het gebruik, de vloeistof en of hij binnen of buiten staat.' },
      { q: 'Kan een flexibele lekbak buiten staan?', a: 'Ja. Het EVA-weefsel van de Plus-uitvoering blijft volgens de fabrikant bruikbaar van −40 °C tot +70 °C. Houd er rekening mee dat regenwater de beschikbare opvangcapaciteit verkleint.' },
      { q: 'Is een flexibele lekbak geschikt voor brandbare vloeistoffen?', a: 'Volgens de fabrikant is de Plus-uitvoering in EVA geschikt voor ATEX-zone 2 (categorie 3G), ook voor stoffen uit subgroep IIA, IIB en IIC. De Starter in PVC is niet geschikt voor benzine en diesel. Welke eisen voor uw opslag gelden, bepaalt het bevoegd gezag.' }
    ]
  }
};
