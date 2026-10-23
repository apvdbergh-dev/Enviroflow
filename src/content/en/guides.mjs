// Stand-alone guide pages (English). Same paths and structure as src/content/nl/guides.mjs.

const IMG = '/assets/img/producten/';
const SRC = {
  pgs15: { label: 'IPLO – PGS 15: containment in a storage facility (in Dutch)', url: 'https://iplo.nl/thema/externe-veiligheid/handleiding-publicatiereeks-gevaarlijke-stoffen/pgs-15-algemene-voorschriften/pgs-15-opslagvoorzieningen/pgs-15-productopvang-opslagvoorziening/' },
  overzicht: { label: 'Manufacturer – Overview of spill trays: steel, plastic and flexible', url: 'https://exflo.eu/overview-of-spill-containment-trays-pallets-and-drip-trays/' },
  weefsel: { label: 'Manufacturer – PVC, EVA or TPU: differences in technical fabric', url: 'https://exflo.eu/pvc-eva-or-maybe-tpu-learn-about-the-differences-in-the-construction-of-spill-containment-berms/' }
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
    crumb: 'Why flexible?',
    kicker: 'Comparison',
    title: 'Why flexible? Flexible, steel and plastic spill trays compared',
    seoTitle: 'Flexible, steel or plastic spill tray? A comparison | EnviroFlow',
    description: 'Flexible spill tray, steel or plastic? Compare resistance, weak spots, storage space and custom sizes, and find out which type suits your situation.',
    updated: '2026-10-23',
    image: { src: IMG + 'opvangbak-4-vaten.jpg', alt: 'Four drums in a flexible spill tray' },
    intro: 'A spill tray catches liquid when a drum or IBC leaks. There are three kinds: steel, plastic (polyethylene, PE) and flexible technical fabric. Each type has strengths and weaknesses. On this page we set out the differences, so you can choose what suits your situation. Even if that is not a flexible spill tray.',
    takeaways: [
      'Steel is resistant to solvents and oil, plastic (PE) to acids and alkalis. Flexible EVA fabric is resistant to many oils, fuels, acids and glycol.',
      'A flexible spill tray folds up, can be made to measure and also suits vehicles and machines.',
      'For permanent storage where a forklift drives in and out every day, steel is often the logical choice.',
      'The same PGS 15 containment capacity applies to every type: at least 110% of the largest container, or 10% of the total if that is more.'
    ],
    sections: [
      {
        h: 'The three kinds of spill tray',
        steps: [
          { t: 'Steel spill tray', d: 'Resistant to solvents and oil. According to the manufacturer, steel is the usual choice for flammable liquids because a steel tray can be earthed. Watch out for corrosion.' },
          { t: 'Plastic spill tray (PE)', d: 'Polyethylene is resistant to aggressive liquids such as acids and alkalis, and does not rust. Watch out for cracks in the material.' },
          { t: 'Flexible spill tray', d: 'Made of technical fabric with welded seams and upright walls. Folds up, is easy to move and can be made to measure. How resistant it is depends on the coating of the fabric.' }
        ]
      },
      {
        h: 'The differences at a glance',
        table: {
          head: ['', 'Flexible (EVA fabric)', 'Steel', 'Plastic (PE)'],
          rows: [
            ['Resistant to', 'Many oils, fuels, acids and glycol; per substance in the resistance table', 'Solvents and oil', 'Acids and alkalis'],
            ['Weak spot', 'Cuts and tears in the fabric', 'Corrosion', 'Cracks'],
            ['Flammable liquids', 'According to the manufacturer suitable for ATEX zone 2 (category 3G)', 'The usual choice, as it can be earthed', 'Check with the supplier'],
            ['Driving in', 'Lay the wall flat: a forklift or vehicle can drive over the base', 'A low model with a grating makes forklift access easier, but holds less', 'A low model with a grating makes forklift access easier, but holds less'],
            ['When not in use', 'Folds up small, fits on a shelf', 'Takes up the same space', 'Takes up the same space'],
            ['Large or non-standard sizes', 'Can be made to measure, up to the size of a lorry', 'Depends on the supplier', 'Depends on the supplier']
          ],
          note: 'Sources: product information and technical articles from the manufacturer of our flexible spill trays (see below). Always check resistance per substance.'
        },
        callout: { t: 'Every spill tray must be undamaged', d: 'Corrosion in steel, a crack in plastic or a cut in the fabric: the tray no longer contains reliably. So check it regularly, whichever type you choose.' }
      },
      {
        h: 'When is a flexible spill tray a good choice?',
        list: [
          'The storage is temporary, or the location changes regularly.',
          'You want to protect the ground under a vehicle, generator or machine.',
          'You need a non-standard size. A [custom solution](' + L.maatwerk + ') is possible.',
          'There is little room to store a spill tray when it is not in use.',
          'You store several IBCs side by side and want one large tray instead of separate ones. Read [which spill tray you need for IBCs](' + L.ibc + ').'
        ]
      },
      {
        h: 'When is steel or plastic the better choice?',
        list: [
          'For permanent storage where a forklift drives in and out every day: steel withstands knocks and scraping better.',
          'For a substance that EVA fabric cannot withstand. Check this in the resistance table.',
          'If you often draw off small quantities: a tall tray with a grating is more practical.'
        ],
        after: ['Not sure? Send us the safety data sheet of your substance. We will tell you honestly whether a flexible spill tray is suitable, or whether another type is the better choice.']
      },
      {
        h: 'With a flexible spill tray, check the fabric',
        p: [
          'Flexible spill trays often look alike, but the fabric can differ greatly. A black tray may be PVC or EVA. So always ask about two things: the coating and the weight of the fabric per square metre.',
          '**The coating.** PVC is cheaper, but according to the manufacturer it is not resistant to petrol, engine oil, glycol and ethanol, among others. EVA is far more chemically resistant. TPU is more resistant still, but also much more expensive and mostly made to order.',
          '**The weight.** A heavier fabric is thicker and stronger. The manufacturer recommends at least 1,000 g/m², and 1,200 to 1,400 g/m² if trolleys or a forklift often drive over the base.',
          'Our [flexible spill trays](' + L.opvang + ') are made of EVA fabric of 1,365 g/m². The resistance table is under Downloads on every product page.'
        ]
      },
      {
        h: 'How much must the spill tray hold?',
        p: [
          'The material makes no difference to the containment capacity. Under PGS 15, a containment facility must hold at least 110% of the largest container. If 10% of the total contents of all containers is more, that 10% applies. Empty, uncleaned containers do not count.',
          'Note: the stated capacity of a spill tray applies to an empty tray. The volume taken up by the drums or IBCs themselves must be subtracted. Read how to calculate this in [choosing the right containment capacity](' + L.capaciteit + ').'
        ]
      },
      {
        h: 'And flexible tanks?',
        p: ['For the storage itself there is also a flexible alternative: a pillow-shaped tank of technical fabric instead of a fixed steel tank. Read the differences in [flexible tank or fixed tank](' + L.tank + ').']
      }
    ],
    faq: [
      { q: 'Is a flexible spill tray as safe as a steel one?', a: 'Both catch leaking liquid, as long as the tray is undamaged, large enough and resistant to the substance. Which type suits you best depends on the substance, the location and how the tray is used.' },
      { q: 'Is a flexible spill tray allowed under PGS 15?', a: 'PGS 15 requires a facility that catches leaking liquid, with a minimum containment capacity. Which requirements apply to your site is determined by your permit and the competent authority. If in doubt, consult them or your safety adviser.' },
      { q: 'Can I use a flexible spill tray outdoors?', a: 'Yes. According to the manufacturer, the EVA fabric remains usable from −40 °C to +70 °C. Do not let rainwater stand in the tray: it reduces the containment capacity.' }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-ibc', 'opvangbak-2-ibc', 'opvangbak-4-vaten'],
    sources: [SRC.pgs15, SRC.overzicht, SRC.weefsel]
  }
];
