// Losse gidspagina's met dezelfde opbouw als een kennisbankartikel, maar met een eigen adres (path).
// De Engelse versie staat in src/content/en/guides.mjs met hetzelfde path.
// Alleen vaststaande feiten: regels met de officiële bron, productgegevens volgens de fabrikant.

const IMG = '/assets/img/producten/';
const SRC = {
  pgs15: { label: 'IPLO – PGS 15: productopvang in een opslagvoorziening', url: 'https://iplo.nl/thema/externe-veiligheid/handleiding-publicatiereeks-gevaarlijke-stoffen/pgs-15-algemene-voorschriften/pgs-15-opslagvoorzieningen/pgs-15-productopvang-opslagvoorziening/' },
  overzicht: { label: 'Fabrikant – Overzicht van lekbakken: staal, kunststof en flexibel (Engels)', url: 'https://exflo.eu/overview-of-spill-containment-trays-pallets-and-drip-trays/' },
  weefsel: { label: 'Fabrikant – PVC, EVA of TPU: verschillen in technisch weefsel (Engels)', url: 'https://exflo.eu/pvc-eva-or-maybe-tpu-learn-about-the-differences-in-the-construction-of-spill-containment-berms/' }
};
const L = {
  opvang: '/producten/opvang-en-spill-containment/flexibele-opvangbakken/',
  capaciteit: '/kennisbank/hoe-kies-je-de-juiste-opvangcapaciteit/',
  ibc: '/kennisbank/welke-opvangbak-heb-ik-nodig-voor-ibcs/',
  tank: '/kennisbank/flexibele-tank-of-stalen-tank/',
  maatwerk: '/maatwerk-aanvragen/'
};

export default [
  {
    path: '/waarom-flexibel/',
    slug: 'waarom-flexibel',
    crumb: 'Waarom flexibel?',
    kicker: 'Vergelijking',
    title: 'Waarom flexibel? Flexibele, stalen en kunststof lekbakken vergeleken',
    seoTitle: 'Flexibele lekbak, stalen of kunststof lekbak? Vergelijking | EnviroFlow',
    description: 'Flexibele lekbak, stalen lekbak of kunststof lekbak? Vergelijk bestendigheid, zwakke plekken, ruimte en maatwerk, en lees wanneer welk type past.',
    updated: '2026-10-23',
    image: { src: IMG + 'opvangbak-4-vaten.jpg', alt: 'Vier vaten in een flexibele opvangbak' },
    intro: 'Een lekbak vangt vloeistof op als een vat of IBC lekt. Er zijn drie soorten: van staal, van kunststof (polyethyleen, PE) en van flexibel technisch weefsel. Elk type heeft sterke en zwakke kanten. Op deze pagina zetten we de verschillen op een rij, zodat u kunt kiezen wat bij uw situatie past. Ook als dat geen flexibele lekbak is.',
    takeaways: [
      'Staal is bestand tegen oplosmiddelen en olie, kunststof (PE) tegen zuren en logen. Flexibel EVA-weefsel is bestand tegen veel oliën, brandstoffen, zuren en glycol.',
      'Een flexibele lekbak is op te vouwen, op maat te maken en ook geschikt voor voertuigen en machines.',
      'Voor vaste opslag waar dagelijks een heftruck in en uit rijdt, is staal vaak de logische keuze.',
      'Voor elk type geldt dezelfde opvangcapaciteit uit PGS 15: minimaal 110% van de grootste verpakking, of 10% van het totaal als dat meer is.'
    ],
    sections: [
      {
        h: 'De drie soorten lekbakken',
        steps: [
          { t: 'Stalen lekbak', d: 'Bestand tegen oplosmiddelen en olie. Volgens de fabrikant is staal de gangbare keuze voor brandbare vloeistoffen, omdat een stalen bak te aarden is. Let op corrosie.' },
          { t: 'Kunststof lekbak (PE)', d: 'Polyethyleen is bestand tegen agressieve vloeistoffen zoals zuren en logen, en roest niet. Let op scheuren in het materiaal.' },
          { t: 'Flexibele lekbak', d: 'Gemaakt van technisch weefsel met gelaste naden en opstaande randen. Op te vouwen, licht te verplaatsen en op maat te maken. Hoe bestendig hij is, hangt af van de coating van het weefsel.' }
        ]
      },
      {
        h: 'De verschillen op een rij',
        table: {
          head: ['', 'Flexibel (EVA-weefsel)', 'Staal', 'Kunststof (PE)'],
          rows: [
            ['Bestand tegen', 'Veel oliën, brandstoffen, zuren en glycol; per stof in de bestendigheidstabel', 'Oplosmiddelen en olie', 'Zuren en logen'],
            ['Zwakke plek', 'Sneden en scheuren in het weefsel', 'Corrosie', 'Scheuren'],
            ['Brandbare vloeistoffen', 'Volgens de fabrikant geschikt voor ATEX-zone 2 (categorie 3G)', 'Gangbare keuze, want te aarden', 'Controleer bij de leverancier'],
            ['Inrijden', 'Wand plat leggen: een heftruck of voertuig kan over de bodem rijden', 'Een laag model met rooster maakt toegang met een heftruck makkelijker, maar vangt minder op', 'Een laag model met rooster maakt toegang met een heftruck makkelijker, maar vangt minder op'],
            ['Niet in gebruik', 'Opgevouwen klein, past op een stelling', 'Neemt evenveel ruimte in', 'Neemt evenveel ruimte in'],
            ['Grote of afwijkende maten', 'Op maat te maken, tot onder een vrachtwagen', 'Afhankelijk van de leverancier', 'Afhankelijk van de leverancier']
          ],
          note: 'Bronnen: productinformatie en vakartikelen van de fabrikant van onze flexibele opvangbakken (zie onderaan). Zoek de bestendigheid altijd per stof op.'
        },
        callout: { t: 'Elke lekbak moet onbeschadigd zijn', d: 'Corrosie in staal, een scheur in kunststof of een snee in het weefsel: dan vangt de lekbak niet meer betrouwbaar op. Controleer hem daarom regelmatig, welk type u ook kiest.' }
      },
      {
        h: 'Wanneer is een flexibele lekbak een goede keuze?',
        list: [
          'De opslag is tijdelijk, of de plek verandert regelmatig.',
          'U wilt een voertuig, aggregaat of machine van onderen afschermen.',
          'U heeft een afwijkende maat nodig. [Maatwerk](' + L.maatwerk + ') is mogelijk.',
          'Er is weinig ruimte om een lekbak op te bergen als u hem niet gebruikt.',
          'U slaat meerdere IBC\'s naast elkaar op en wilt één grote opvangbak in plaats van losse bakken. Lees [welke opvangbak u nodig heeft voor IBC\'s](' + L.ibc + ').'
        ]
      },
      {
        h: 'Wanneer kiest u beter staal of kunststof?',
        list: [
          'Bij vaste opslag waar dagelijks een heftruck in en uit rijdt: staal is beter bestand tegen stoten en schuren.',
          'Bij een stof die het EVA-weefsel niet verdraagt. Controleer dat in de bestendigheidstabel.',
          'Als u vaak kleine hoeveelheden aftapt: een hoge lekbak met rooster werkt dan prettiger.'
        ],
        after: ['Twijfelt u? Stuur ons het veiligheidsinformatieblad van uw stof. Wij zeggen eerlijk of een flexibele lekbak geschikt is, of dat u beter een ander type kiest.']
      },
      {
        h: 'Let bij een flexibele lekbak op het weefsel',
        p: [
          'Flexibele lekbakken zien er vaak hetzelfde uit, maar het weefsel kan sterk verschillen. Een zwarte lekbak kan van PVC of van EVA zijn. Vraag daarom altijd naar twee dingen: de coating en het gewicht van het weefsel per vierkante meter.',
          '**De coating.** PVC is goedkoper, maar volgens de fabrikant niet bestand tegen onder meer benzine, motorolie, glycol en ethanol. EVA is chemisch veel beter bestand. TPU is nog bestendiger, maar ook veel duurder en wordt vooral op bestelling gemaakt.',
          '**Het gewicht.** Een zwaarder weefsel is dikker en sterker. De fabrikant adviseert minimaal 1.000 g/m², en 1.200 tot 1.400 g/m² als er vaak met karren of een heftruck over de bodem wordt gereden.',
          'Onze [flexibele opvangbakken](' + L.opvang + ') zijn gemaakt van EVA-weefsel van 1.365 g/m². De bestendigheidstabel staat bij elk product onder Downloads.'
        ]
      },
      {
        h: 'Hoeveel moet de lekbak opvangen?',
        p: [
          'Voor de opvangcapaciteit maakt het materiaal niet uit. Volgens PGS 15 moet een opvangvoorziening minimaal 110% van de grootste verpakking kunnen opvangen. Is 10% van de totale inhoud van alle verpakkingen meer, dan geldt die 10%. Lege, ongereinigde verpakkingen tellen niet mee.',
          'Let op: de opgegeven capaciteit van een lekbak geldt voor een lege bak. Het volume dat de vaten of IBC\'s zelf innemen, gaat ervan af. Lees hoe u dat berekent in [de juiste opvangcapaciteit kiezen](' + L.capaciteit + ').'
        ]
      },
      {
        h: 'En flexibele tanks?',
        p: ['Ook voor de opslag zelf bestaat een flexibel alternatief: een kussenvormige tank van technisch weefsel in plaats van een vaste stalen tank. De verschillen leest u in [flexibele tank of vaste tank](' + L.tank + ').']
      }
    ],
    faq: [
      { q: 'Is een flexibele lekbak net zo veilig als een stalen lekbak?', a: 'Beide vangen lekkende vloeistof op, zolang de lekbak onbeschadigd is, groot genoeg is en bestand is tegen de stof. Welk type het beste past, hangt af van de stof, de plek en hoe de lekbak wordt gebruikt.' },
      { q: 'Mag een flexibele lekbak volgens PGS 15?', a: 'PGS 15 vraagt om een voorziening die lekkende vloeistof opvangt, met een minimale opvangcapaciteit. Welke eisen voor uw locatie gelden, bepalen uw vergunning en het bevoegd gezag. Overleg bij twijfel met hen of met uw veiligheidskundige.' },
      { q: 'Kan ik een flexibele lekbak buiten gebruiken?', a: 'Ja. Volgens de fabrikant blijft het EVA-weefsel bruikbaar van −40 °C tot +70 °C. Laat regenwater niet in de bak staan: dat gaat af van de opvangcapaciteit.' }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-ibc', 'opvangbak-2-ibc', 'opvangbak-4-vaten'],
    sources: [SRC.pgs15, SRC.overzicht, SRC.weefsel]
  }
];
