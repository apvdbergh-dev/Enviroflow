// Knowledge base articles (English). Same slugs and structure as src/content/nl/articles.mjs.
// Dutch rules (PGS, Bal) keep their Dutch names; the sources are Dutch-language official pages.

const IMG = '/assets/img/producten/';
const SRC = {
  pgs15: { label: 'IPLO – PGS 15: containment in a storage facility (in Dutch)', url: 'https://iplo.nl/thema/externe-veiligheid/handleiding-publicatiereeks-gevaarlijke-stoffen/pgs-15-algemene-voorschriften/pgs-15-opslagvoorzieningen/pgs-15-productopvang-opslagvoorziening/' },
  pgs: { label: 'Dutch Hazardous Substances Publication Series (official PGS website, in Dutch)', url: 'https://publicatiereeksgevaarlijkestoffen.nl/' },
  pgs30: { label: 'PGS 30:2021 – Liquid fuels, above-ground tank installations (in Dutch)', url: 'https://publicatiereeksgevaarlijkestoffen.nl/publicaties/online/pgs-30/2021/1-1-april-2026' },
  diesel: { label: 'IPLO – Soil rules: storing diesel in an above-ground tank (in Dutch)', url: 'https://iplo.nl/regelgeving/regels-voor-activiteiten/opslaan-diesel-oxiderende-bijtende-aquatoxische/regels-bodem/' },
  mestBodem: { label: 'IPLO – Soil rules: storing liquid manure in a manure basin, section 4.86 Bal (in Dutch)', url: 'https://iplo.nl/regelgeving/regels-voor-activiteiten/opslaan-drijfmest-digestaat-dunne-fractie/regels-bodem/' },
  mestRegels: { label: 'IPLO – Storing manure: which rules apply when (in Dutch)', url: 'https://iplo.nl/thema/toepassing-regels-praktijk/veehouderijen/opslaan-mest-wanneer-welke-regels-gelden/' },
  rvo: { label: 'RVO – When to spread manure 2026 (table, in Dutch)', url: 'https://www.rvo.nl/sites/default/files/2026-02/Tabel-1-Wanneer-mest-uitrijden-2026.pdf' }
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
  capaciteit: '/kennisbank/hoe-kies-je-de-juiste-opvangcapaciteit/',
  brandstofArtikel: '/kennisbank/brandstof-tijdelijk-opslaan-op-locatie/'
};
const UPDATED = '2026-10-17';

export default [
  {
    slug: 'wat-is-een-flexibele-lekbak',
    kicker: 'Containment',
    title: 'Flexible spill tray: what is it and when should you choose one?',
    seoTitle: 'Flexible spill tray: what is it and when to choose one? | EnviroFlow',
    description: 'What is a flexible spill tray, how does it work and when is it a better fit than a steel one? With sizes, material, Dutch rules (PGS 15) and practical tips.',
    updated: UPDATED,
    image: { src: IMG + 'sfeer-ibc-hal.jpg', alt: 'IBCs in a flexible spill tray in a commercial hall' },
    intro: 'A flexible spill tray is a containment tray made of strong technical textile with raised edges. If something goes wrong with the IBC, drum or machine standing in it, the liquid stays in the tray. Not on the floor, not in the soil and not in the sewer. Below you can read how such a tray works, when it is a better fit than a steel tray and what to look out for when choosing one.',
    takeaways: [
      'A flexible spill tray catches leaks and spills under IBCs, drums, generators and vehicles.',
      'It is set up in a few minutes and can be folded when empty.',
      'For packaged liquid hazardous substances, the Dutch PGS 15 guideline requires containment of at least 110% of the largest container.',
      'Always check that the material is resistant to your liquid.'
    ],
    sections: [
      {
        h: 'How does a flexible spill tray work?',
        p: [
          'The floor and the raised edges together form one tray. If something leaks from an IBC, a drum or a machine, it stays within the edges. You then vacuum or pump up the liquid and dispose of it as required for that substance.',
          'The spill trays we supply are made of polyester fabric with an EVA coating of 1,365 g/m². According to the manufacturer, this is stronger and more chemically resistant than the 650 to 900 g/m² PVC fabric often used for standard spill trays.'
        ],
        image: { src: IMG + 'opvangbak-leeg.jpg', alt: 'Empty flexible spill tray with raised edges', caption: 'An empty spill tray: the floor and the raised edges together form the tray.' }
      },
      {
        h: 'Flexible or steel: what suits your situation?',
        p: ['A steel spill tray is a fine solution for a fixed location. A flexible tray is stronger where speed, space or moving it around matter.'],
        table: {
          head: ['Situation', 'Usually the best choice', 'Why'],
          rows: [
            ['Temporary storage or a changing workplace', 'Flexible', 'Set up quickly and cleared away again afterwards'],
            ['Little space or a non-standard size', 'Flexible', 'Can be custom-made, even around a machine'],
            ['Under a generator, pump or vehicle', 'Flexible', 'There are versions for generators, tanker trucks and lorries'],
            ['Fixed storage where a forklift drives in and out every day', 'Often steel', 'Better resistant to daily knocks and scraping'],
            ['Storage in a fire-resistant cabinet or room', 'According to the requirements for that storage', 'Discuss this with your adviser or the competent authority']
          ]
        }
      },
      {
        h: 'Which sizes are available?',
        p: [`There are standard sizes for drums, IBCs, generators and vehicles. If none of them fits, a custom size is possible. View all [flexible spill trays](${L.opvang}).`],
        table: {
          head: ['Version', 'Containment capacity', 'Dimensions (l × w × h)'],
          rows: [
            ['1 drum', '226 litres', '1.05 × 0.65 × 0.35 m'],
            ['2 drums', '410 litres', '1.90 × 0.65 × 0.35 m'],
            ['4 drums (low model)', '412 litres', '2.90 × 1.07 × 0.14 m'],
            ['1 IBC', '1,149 litres', '2.16 × 1.60 × 0.35 m'],
            ['2 IBCs', '1,795 litres', '2.50 × 2.16 × 0.35 m'],
            ['4 IBCs', '2,420 litres', '5.20 × 1.40 × 0.35 m'],
            ['10 IBCs', '5,836 litres', '5.95 × 2.95 × 0.35 m'],
            ['Generator (3 × 1.5 m)', '1,451 litres', '2.91 × 1.50 × 0.35 m'],
            ['Tanker truck (drive-in)', '11,655 litres', '9.50 × 3.69 × 0.35 m'],
            ['Lorry (drive-in)', '22,575 litres', '18.40 × 3.69 × 0.35 m']
          ]
        }
      },
      {
        h: 'Is the spill tray resistant to my liquid?',
        p: ['That differs per substance. The manufacturer has a resistance table stating for each liquid how the material holds up after two years of contact: A (good), B (moderate) or C (not suitable). Most oils and many chemicals score well, but not everything. Hydrochloric acid 32%, for example, is rated C.'],
        callout: { t: 'Tip', d: 'Keep the safety data sheet (SDS) of the substance to hand. It states exactly which substance it is. Send it with your request and we will check the resistance for you.' }
      },
      {
        h: 'What do the rules say?',
        p: [
          'In the Netherlands, the guideline for storing packaged liquid hazardous substances is **PGS 15**. It requires containment of at least **110% of the volume of the largest container**. If 10% of the total volume is more, that 10% applies. Empty, uncleaned packaging does not count.',
          `Whether PGS 15 applies to your storage depends on the substances and the quantity. The competent authority, usually the municipality or the environmental agency, decides this. The article [Calculating containment capacity](${L.capaciteit}) includes worked examples.`
        ]
      },
      {
        h: 'Indoors or outdoors?',
        p: ['A flexible spill tray can stand outdoors. According to the manufacturer, the material remains usable from −40 °C to +70 °C. Outdoors, however, rainwater collects in the tray and reduces the containment capacity. Outdoors, choose a larger tray or place the storage under a roof.']
      },
      {
        h: 'Use and inspection',
        list: [
          'Place the tray on a level surface without sharp stones or protrusions.',
          'Put IBCs and drums down carefully and do not slide them across the floor of the tray.',
          'Keep taps and dispensing points above the tray.',
          'Check the tray regularly for damage and remove leaked liquid immediately.',
          'If the tray is outdoors, check for water after rain.'
        ]
      }
    ],
    faq: [
      { q: 'How long does a flexible spill tray last?', a: 'The manufacturer gives a 7-year warranty on the spill trays we supply. How long it lasts in practice depends on use, the liquid and whether it is indoors or outdoors.' },
      { q: 'Can a flexible spill tray stand outdoors?', a: 'Yes. According to the manufacturer, the material remains usable from −40 °C to +70 °C. Keep in mind that rainwater reduces the available containment capacity.' },
      { q: 'Is a flexible spill tray suitable for flammable liquids?', a: 'According to the manufacturer, the spill trays are suitable for ATEX zone 2 (category 3G), including substances from subgroups IIA, IIB and IIC. The competent authority decides which requirements apply to your storage.' },
      { q: 'Can I have a spill tray custom-made?', a: 'Yes. Send us the dimensions of the space or machine and tell us what will stand in it. We will check with the manufacturer what is possible.' }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-ibc', 'opvangbak-2-vaten', 'opvangbak-aggregaat'],
    sources: [SRC.pgs15, SRC.pgs]
  },

  {
    slug: 'welke-opvangbak-heb-ik-nodig-voor-ibcs',
    kicker: 'Containment',
    title: 'Choosing an IBC spill tray: how to find the right one',
    seoTitle: 'Choosing an IBC spill tray: size, capacity and material | EnviroFlow',
    description: 'Which spill tray do you need for 1, 2, 4 or 10 IBCs? A step-by-step guide with a worked example (PGS 15), sizes and tips for indoor and outdoor storage.',
    updated: UPDATED,
    image: { src: IMG + 'sfeer-opslag-vaten.jpg', alt: 'IBCs in flexible spill trays in a warehouse, with a pallet truck' },
    intro: 'An IBC holds 1,000 litres. If it leaks empty without proper containment underneath, you have a big problem: liquid on the floor, in the soil or in the sewer. Five questions help you choose an IBC spill tray that fits the number of containers, the liquid and the location.',
    takeaways: [
      'For one full 1,000-litre IBC, the Dutch PGS 15 guideline requires at least 1,100 litres of containment.',
      'With several IBCs, 110% of the largest counts, or 10% of the total if that is more.',
      'Outdoors, rainwater fills the tray. Leave room for it.',
      'Flexible IBC spill trays are available for 1, 2, 4 and 10 IBCs, and custom-made.'
    ],
    sections: [
      {
        h: 'Five questions before you choose',
        steps: [
          { t: 'How many IBCs are there at the same time?', d: 'Count what stands there at the busiest moment, not the average. Also think of full IBCs that are put down temporarily during a delivery.' },
          { t: 'Which liquid do they contain?', d: 'Get the safety data sheet. The material of the tray must be resistant to the substance.' },
          { t: 'How much containment capacity is needed?', d: 'Use the 110% rule from PGS 15. The worked example is below.' },
          { t: 'Indoors or outdoors?', d: 'Outdoors, rainwater gets into the tray. That reduces the containment capacity.' },
          { t: 'How much space is there?', d: 'Measure the floor: length, width and the passage for the pallet truck or forklift.' }
        ]
      },
      {
        h: 'Worked example: how much containment do you need?',
        p: ['Under PGS 15, containment must be at least 110% of the volume of the largest container. If 10% of the total volume is more, that 10% applies. For full 1,000-litre IBCs it looks like this:'],
        table: {
          head: ['Number of IBCs', 'Total volume', '110% of the largest', '10% of the total', 'Minimum required'],
          rows: [
            ['1', '1,000 litres', '1,100 litres', '100 litres', '1,100 litres'],
            ['2', '2,000 litres', '1,100 litres', '200 litres', '1,100 litres'],
            ['4', '4,000 litres', '1,100 litres', '400 litres', '1,100 litres'],
            ['10', '10,000 litres', '1,100 litres', '1,000 litres', '1,100 litres'],
            ['12', '12,000 litres', '1,100 litres', '1,200 litres', '1,200 litres']
          ],
          note: 'Only from twelve full IBCs in one containment facility does the 10% rule become decisive.'
        },
        after: [`More examples, including drums, are in [Calculating containment capacity](${L.capaciteit}).`]
      },
      {
        h: 'Which IBC spill tray fits?',
        p: ['All standard IBC spill trays below have more containment capacity than the 1,100 litres needed for full 1,000-litre IBCs.'],
        table: {
          head: ['Version', 'Containment capacity', 'Dimensions (l × w × h)'],
          rows: [
            ['1 IBC', '1,149 litres', '2.16 × 1.60 × 0.35 m'],
            ['2 IBCs', '1,795 litres', '2.50 × 2.16 × 0.35 m'],
            ['4 IBCs (in a row)', '2,420 litres', '5.20 × 1.40 × 0.35 m'],
            ['10 IBCs', '5,836 litres', '5.95 × 2.95 × 0.35 m']
          ]
        },
        callout: { t: 'Please note', d: 'This worked example assumes a tray without rainwater. The competent authority decides which requirements apply to your storage.' },
        image: { src: IMG + 'opvangbak-4-ibc.jpg', alt: 'Flexible spill tray with four IBCs in a row', caption: 'The spill tray for 4 IBCs is long and narrow, so it fits well along a wall or in a corridor.' }
      },
      {
        h: 'Indoors or outdoors',
        p: ['Indoors, only the contents of the IBCs count. Outdoors, rainwater is added. A tray that is half full after a few showers holds less in a leak than you think. Outdoors, choose a larger tray, place the storage under a roof or check after every shower and pump out clean rainwater.']
      },
      {
        h: 'Tips for daily use',
        list: [
          'Put the IBCs into the tray with a pallet truck or forklift and do not slide them across the floor.',
          'Keep the dispensing tap above the tray, so drips during dispensing are also caught.',
          'Do not place substances that can react with each other in the same tray. The safety data sheet says which substances to keep apart.',
          'Check the tray regularly for damage and for liquid that should not be there.'
        ]
      }
    ],
    faq: [
      { q: 'How many litres must an IBC spill tray hold?', a: 'For one full 1,000-litre IBC at least 1,100 litres (110% of the largest container, under PGS 15).' },
      { q: 'Can I put several IBCs in one spill tray?', a: 'Yes, if the tray is large enough: at least 110% of the largest IBC, or 10% of the total volume if that is more. For 2 to 11 full 1,000-litre IBCs that is 1,100 litres.' },
      { q: 'Can I put IBCs with different substances in one tray?', a: 'Only if the substances do not react with each other. Check the safety data sheet or ask us.' },
      { q: 'Can the tray stand outdoors?', a: 'Yes. Keep rainwater in mind, though: it reduces the available containment capacity.' }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-ibc', 'opvangbak-2-ibc', 'opvangbak-4-ibc', 'opvangbak-10-ibc'],
    sources: [SRC.pgs15]
  },

  {
    slug: 'hoe-kies-je-de-juiste-opvangcapaciteit',
    kicker: 'Rules and calculation',
    title: 'Calculating containment capacity: the 110% rule explained',
    seoTitle: 'Calculating spill tray containment capacity (the 110% rule) | EnviroFlow',
    description: 'How many litres must a spill tray hold? The 110% and 10% rules from the Dutch PGS 15 guideline explained, with worked examples for IBCs and drums.',
    updated: UPDATED,
    image: { src: IMG + 'opvangbak-praktijk.jpg', alt: 'Drums on pallets in a large flexible spill tray' },
    intro: 'Containment capacity is the amount of liquid a spill tray can hold before it overflows. Too little means a leak still ends up on the floor or in the soil. For storing packaged liquid hazardous substances, the Dutch PGS 15 guideline gives a clear calculation rule. This is how it works.',
    takeaways: [
      'At least 110% of the volume of the largest container.',
      'Is 10% of the total volume more? Then that 10% applies.',
      'Empty, uncleaned packaging does not count.',
      'Under PGS 15, no containment is required for solid substances.'
    ],
    sections: [
      {
        h: 'The rule in short',
        p: ['PGS 15 (2021 version) states that the containment capacity must be at least 110% of the volume of the largest container in the storage. If 110% of the largest container is less than 10% of the total volume, you must use that 10%. The principle is simple: no liquid may flow out of the storage.']
      },
      {
        h: 'How to calculate it',
        steps: [
          { t: 'Take the largest container × 1.1', d: 'A 1,000-litre IBC gives 1,100 litres. A 200-litre drum gives 220 litres.' },
          { t: 'Take the total volume × 0.1', d: 'Add up all full containers and take 10% of that.' },
          { t: 'Choose the higher number', d: 'That is the minimum containment capacity you need.' }
        ]
      },
      {
        h: 'Worked examples',
        table: {
          head: ['What is stored?', '110% of the largest', '10% of the total', 'Minimum required'],
          rows: [
            ['1 drum of 200 litres', '220 litres', '20 litres', '220 litres'],
            ['4 drums of 200 litres', '220 litres', '80 litres', '220 litres'],
            ['6 IBCs of 1,000 litres and 8 drums of 200 litres', '1,100 litres', '760 litres', '1,100 litres'],
            ['40 drums of 200 litres', '220 litres', '800 litres', '800 litres'],
            ['12 IBCs of 1,000 litres', '1,100 litres', '1,200 litres', '1,200 litres']
          ],
          note: 'With a few large containers, the 110% rule usually decides. With many small containers, often the 10% rule.'
        }
      },
      {
        h: 'One large tray or several small ones?',
        p: [
          'Both are allowed. Under PGS 15 you can arrange containment for the whole storage at once, or with smaller spill trays per rack, pallet or container. Each tray must then be sufficient for what stands in it.',
          `Several small trays are handy when storage is spread out or changes often. One large tray keeps things simple for fixed storage. View the [sizes of the flexible spill trays](${L.opvang}).`
        ],
        image: { src: IMG + 'opvangbak-10-ibc.jpg', alt: 'Flexible spill tray for ten IBCs', caption: 'One tray for ten IBCs: 5,836 litres of containment capacity.' }
      },
      {
        h: 'Outdoors: allow for rainwater',
        p: ['The calculation assumes an empty tray. Outdoors, the tray fills up with rain and less room is left for a leak. So choose a larger tray, place the storage under a roof or check after every shower.']
      },
      {
        h: 'When does PGS 15 apply?',
        p: ['PGS 15 covers the storage of packaged hazardous substances. Whether the guideline applies to your storage depends on which substances you store and how much. The competent authority decides this, usually the municipality or the environmental agency.'],
        callout: { t: 'We do the maths with you', d: 'Send us a list of what is stored: the number of containers, their volume and the substance. We will calculate how much containment you need and which tray fits.' }
      }
    ],
    faq: [
      { q: 'How much containment do I need for one IBC?', a: 'For one full 1,000-litre IBC, at least 1,100 litres.' },
      { q: 'Do empty IBCs and drums count?', a: 'Under PGS 15, empty, uncleaned packaging does not count towards the containment capacity.' },
      { q: 'Does the 110% rule also apply to solid substances?', a: 'No. Under PGS 15, containment is not required for the storage of solid hazardous substances.' },
      { q: 'Does this rule also apply to diesel in a tank?', a: `No. PGS 15 covers packaging. Different rules apply to diesel in an above-ground tank; see our article on storing diesel temporarily on site.` }
    ],
    categories: ['flexibele-opvangbakken'],
    products: ['opvangbak-1-vat', 'opvangbak-4-vaten', 'opvangbak-10-ibc'],
    sources: [SRC.pgs15, SRC.pgs]
  },

  {
    slug: 'flexibele-tank-of-stalen-tank',
    kicker: 'Tanks',
    title: 'Flexible tank or fixed tank: what suits your situation?',
    seoTitle: 'Flexible water tank or fixed tank? The differences compared | EnviroFlow',
    description: 'A flexible tank or a fixed steel tank for water, fuel or manure? Compare installation, space, moving and applications in one overview.',
    updated: UPDATED,
    image: { src: IMG + 'waterbase-f.jpg', alt: 'Flexible tank on a commercial site' },
    intro: 'If you need to store water, fuel or manure, you may first think of a steel tank or a concrete pit. A flexible tank is a pillow-shaped tank made of technical textile that takes the shape of its contents. Empty, it is compact, and installation is quick. Which of the two suits you better depends on your situation.',
    takeaways: [
      'A flexible tank needs no foundation or lifting work, only a level, clean surface.',
      'When empty, you can fold it and take it to the next location.',
      'A fixed tank suits little floor space and the same location for many years better.',
      'Flexible tanks are available from 200 litres to 300 m³, depending on the liquid.'
    ],
    sections: [
      {
        h: 'How does a flexible tank work?',
        p: ['A flexible tank lies flat on the ground and fills up like a pillow. It is made of multi-layer fabric with a coating that suits the liquid: PVC for water and manure, TPU for drinking water and fuel. Filling and emptying are done via fixed connections, such as Storz couplings.'],
        image: { src: IMG + 'waterbase-r.jpg', alt: 'Filled flexible buffer tank on a site', caption: 'A flexible tank takes the shape of its contents. All it needs is a level surface.' }
      },
      {
        h: 'The differences compared',
        table: {
          head: ['', 'Flexible tank', 'Fixed (steel) tank'],
          rows: [
            ['Installation', 'Rolled out on a level surface, for example a compacted sand bed', 'Foundation, transport and often a crane'],
            ['Space', 'Flat and wide: a lot of floor space, little height', 'Tall and compact: little floor space'],
            ['Height', 'Low profile; a 250 m³ buffer tank is at most 1.4 m high', 'Depends on the model, often several metres'],
            ['Moving', 'Can be folded when empty and taken along', 'Usually stays in the same place'],
            ['Temporary use', 'Well suited', 'Less suited']
          ]
        }
      },
      {
        h: 'When should you choose a flexible tank?',
        list: [
          'You need storage for a project, a season or an emergency.',
          'A foundation or lifting work is not possible or not wanted.',
          'You want extra capacity quickly, without construction work.',
          'There is room in width, but not in height.'
        ]
      },
      {
        h: 'When is a fixed tank more logical?',
        list: [
          'Little floor space is available.',
          'The storage will stay in exactly the same place for decades.',
          'Heavy traffic passes close to or over the storage location every day.'
        ]
      },
      {
        h: 'Which flexible tank for which liquid?',
        table: {
          head: ['Liquid', 'Tank', 'Capacity'],
          rows: [
            ['Fire water', `[Waterbase F](${L.brandwater})`, '50 to 300 m³'],
            ['Drinking water', `[Waterbase D Plus](${L.drinkwater})`, '500 litres to 200 m³'],
            ['Rainwater and process water', `[Waterbase R](${L.buffer})`, '10 to 250 m³'],
            ['Waste water', `[Waterbase W](${L.afvalwater})`, '10 to 250 m³'],
            ['Diesel and heating oil', `[Fuelbase XSD](${L.brandstof})`, '200, 500 or 900 litres'],
            ['Liquid manure and digestate', `[Farmer type S](${L.mest})`, '50 to 300 m³'],
            ['UAN and liquid fertiliser', `[Farmer type U](${L.uan})`, '10 to 265 m³'],
            ['A lot of water fast, open top', `[Hydronion](${L.open})`, '5,000 to 25,000 litres']
          ]
        }
      },
      {
        h: 'What to look out for when installing',
        list: [
          'A level, clean surface without sharp stones or protrusions.',
          'Space around the tank for the connections and for access.',
          'Access for the lorry or pump that fills or empties it.',
          'Fuel: according to the manufacturer, the tank must stand in a spill tray holding at least 110% of the tank volume.'
        ]
      }
    ],
    faq: [
      { q: 'How long does a flexible tank last?', a: 'That differs per type. The manufacturer gives a 2- to 10-year warranty, depending on the tank. For the fire water tank, 2 years can be extended to 10 years with an annual inspection.' },
      { q: 'Can a flexible tank stand outdoors?', a: 'Yes. The tanks are UV-resistant, and according to the manufacturer most remain flexible down to −30 °C.' },
      { q: 'Do I need a permit?', a: 'That depends on the liquid, the volume and the location. In the Netherlands, ask your municipality or check the Omgevingsloket.' }
    ],
    categories: ['industriele-water-en-buffertanks', 'brandstoftanks', 'brandwatertanks'],
    products: ['waterbase-r-retentietank', 'exflo-waterbase-f', 'fuelbase-brandstoftank'],
    sources: []
  },

  {
    slug: 'tijdelijke-wateropslag-op-de-bouwplaats',
    kicker: 'Water',
    title: 'Temporary water storage on the construction site: five solutions',
    seoTitle: 'Temporary water storage on the construction site | Flexible water tank | EnviroFlow',
    description: 'Need water on a construction site without a connection? Five ways to store water temporarily, from open tank to flexible buffer tank, with capacities and tips.',
    updated: UPDATED,
    image: { src: IMG + 'waterbase-r-30000.jpg', alt: 'Filled flexible water tank in a car park' },
    intro: 'A construction site needs water: to clean equipment, to limit dust, as fire water or as drinking water in the site cabin. Not every location has a connection for it, and building a fixed tank for a project of a few months is a waste. A flexible or open tank solves that.',
    takeaways: [
      'An open tank is up within minutes and can be filled straight away.',
      'A flexible buffer tank stores up to 250 m³, with a maximum height of 1.4 m.',
      'Drinking water requires a separate tank with a drinking water certificate.',
      'After the project, you empty the tank, let it dry and fold it up.'
    ],
    sections: [
      {
        h: 'Five solutions compared',
        table: {
          head: ['Solution', 'Capacity', 'Good for', 'Note'],
          rows: [
            [`[Open tank (Hydronion)](${L.open})`, '5,000 to 25,000 litres', 'A lot of water fast, filling and drawing by several units at once', 'Open top'],
            [`[Flexible buffer tank (Waterbase R)](${L.buffer})`, '10 to 250 m³', 'Large volumes of process water or rainwater', 'Needs a level surface'],
            [`[Industrial water tank 30,000 l](${L.buffer})`, '30 m³', 'Industrial water and dirty water, one fixed size (8.78 × 4.95 m)', 'Not for drinking water'],
            [`[Mobile tank (Flextanker)](${L.mobiel})`, '500 to 10,000 litres', 'Moving water on a trailer or pick-up', 'Choose the size to fit your trailer'],
            [`[Drinking water tank (Waterbase D Plus)](${L.drinkwater})`, '500 litres to 200 m³', 'Drinking water on site', 'Foreign certificates, not a Dutch approval']
          ]
        }
      },
      {
        h: 'Water needed fast: the open tank',
        p: ['An open, self-supporting tank has no frame. You lay it out, fill it and it stands. According to the manufacturer, it is set up in two minutes. Via two connections with Storz 110 couplings, several units can fill and draw water at the same time.'],
        image: { src: IMG + 'hydronion.jpg', alt: 'Open self-supporting water tank during a fire service exercise', caption: 'An open tank is ready for use in a few minutes.' }
      },
      {
        h: 'A lot of water for a long time: the buffer tank',
        p: ['A flexible buffer tank is closed and suitable for large volumes. The tank is low: even the largest 250 m³ version is at most 1.4 m high. Empty, it weighs between 63 and 599 kg, depending on the size.']
      },
      {
        h: 'How to go about it',
        steps: [
          { t: 'Work out how much water you need', d: 'Per day and in total. That determines the capacity and how often you need to refill.' },
          { t: 'Choose the location', d: 'Level, accessible for the lorry or pump, and not in the path of heavy equipment.' },
          { t: 'Prepare the surface', d: 'Remove stones and sharp objects. A sand bed or a protective mat under the tank helps.' },
          { t: 'Connect and fill', d: 'The tanks have Storz couplings, so fire service and site hoses fit directly.' },
          { t: 'Clear up after the project', d: 'Empty it, let it dry and fold it up. The tank is then ready for the next project.' }
        ]
      },
      {
        h: 'Drinking water: mind how long it keeps',
        p: ['For drinking water, use a separate tank made of a material suitable for contact with drinking water. According to the manufacturer, the Waterbase D Plus has a Polish PZH certificate and is made of fabric compliant with BS 6920 with a British WRAS certificate. These are not Dutch approvals; check which requirements apply to your situation.'],
        callout: { t: 'Good to know', d: 'According to the manufacturer, drinking water from a flexible tank should be used within 24 to 48 hours at 20 °C. After that, bacteria can grow quickly.' }
      }
    ],
    faq: [
      { q: 'How quickly is a temporary water tank up?', a: 'According to the manufacturer, an open tank is set up in two minutes. A closed waste water tank is installed in about 30 minutes. Then it is filled.' },
      { q: 'Can I reuse the tank after the project?', a: 'Yes. Empty it, let it dry and fold it up. Empty, it takes up only a few per cent of its volume.' },
      { q: 'Can I keep drinking water in any water tank?', a: 'No. Use a tank intended for drinking water, such as the Waterbase D Plus, and use the water in time.' }
    ],
    categories: ['industriele-water-en-buffertanks', 'open-zelfdragende-tanks', 'mobiele-watertanks'],
    products: ['exflo-hydronion', 'waterbase-r-retentietank', 'exflo-flextanker'],
    sources: []
  },

  {
    slug: 'bluswatervoorziening-met-een-flexibele-tank',
    kicker: 'Fire safety',
    title: 'Arranging a fire water supply with a flexible fire water tank',
    seoTitle: 'Fire water tank: arranging a fire water supply | EnviroFlow',
    description: 'Not enough fire water at your location? Who sets the requirements, how a flexible fire water tank works, which sizes are available and how it stays frost-free.',
    updated: UPDATED,
    image: { src: IMG + 'waterbase-f-2.jpg', alt: 'Flexible fire water tank next to a commercial building' },
    intro: 'Not every location has enough fire water from the mains or from open water nearby. Think of a business on the edge of the network, a farm in the countryside or a temporary construction site. The fire service may then ask for your own fire water supply. A flexible fire water tank is a quick way to arrange it.',
    takeaways: [
      'The fire service or safety region advises on how much fire water is needed.',
      'A flexible fire water tank is available from 50 to 300 m³.',
      'Heating mats with sensors and insulation keep the water liquid in winter too.',
      'For temporary fire water, an open tank is set up within minutes.'
    ],
    sections: [
      {
        h: 'Who decides how much fire water you need?',
        p: [
          'In the Netherlands, the fire service does, via the safety region. Many regions use the 2019 Fire Water Supply and Accessibility Guide (Handreiking Bluswatervoorziening en Bereikbaarheid) from Brandweer Nederland. It is not law but an advisory framework. Some regions have their own version.',
          'Include the fire service’s advice in your request. It usually states how much water is needed, which connections and how far from the building the supply may be.'
        ]
      },
      {
        h: 'How a flexible fire water tank works',
        p: ['A flexible fire water tank is a closed pillow tank made of multi-layer fabric with internal polyester reinforcement. It lies on a level surface, for example a compacted sand bed. No construction work is needed.'],
        list: [
          'Two DN100 outlet connections with Storz 110 couplings, with heating cables and insulation',
          'One filling connection with a Storz 110 coupling',
          'Heating mats with a control unit and sensors',
          'Insulation mats and a cover with tension straps',
          'Optionally connected to a booster pump installation or water level monitoring'
        ]
      },
      {
        h: 'Sizes and heating power',
        table: {
          head: ['Capacity', 'Dimensions (l × w)', 'Heating mat power'],
          rows: [
            ['50 m³', '8.78 × 7.45 m', '7.5 kW'],
            ['100 m³', '11.72 × 9.00 m', '11.5 kW'],
            ['150 m³', '14.70 × 9.85 m', '15.0 kW'],
            ['200 m³', '15.25 × 11.86 m', '18.8 kW'],
            ['225 m³', '16.87 × 11.86 m', '22.5 kW'],
            ['250 m³', '18.85 × 11.86 m', '22.5 kW'],
            ['300 m³', '20.50 × 11.86 m', '26.1 kW']
          ]
        }
      },
      {
        h: 'Usable in winter too',
        p: ['Frozen fire water is of no use. That is why there are heating mats with temperature sensors under the tank and insulation around it. According to the manufacturer, the material remains flexible down to −30 °C.'],
        callout: { t: 'Energy use', d: 'According to the manufacturer, the heating does not need to be on from May to October. In standby, the system uses about 22 to 36 kWh per month. The heating mats must be connected by a qualified electrician.' }
      },
      {
        h: 'Need temporary fire water?',
        p: [`For a construction project, an event or during the renovation of a fixed fire water tank, an [open self-supporting tank](${L.open}) is a practical solution. It has no frame, is set up in two minutes according to the manufacturer and is available from 5,000 to 25,000 litres. Its height is suitable for filling helicopter fire buckets.`],
        image: { src: IMG + 'hydronion-2.jpg', alt: 'Open fire water tank next to a fire engine', caption: 'An open tank without a frame: put down quickly and filled straight away.' }
      }
    ],
    faq: [
      { q: 'How much fire water do I need?', a: 'The fire service or safety region advises on this based on your building and situation. Include that advice in your request and we will find a suitable tank.' },
      { q: 'Does the fire water tank have a certificate?', a: 'According to the manufacturer, the Waterbase F has a CNBOP approval certificate (no. 4983/2023). That is a Polish certificate, not a Dutch approval. Discuss with the fire service whether it is sufficient for your situation.' },
      { q: 'How long is the warranty?', a: 'The manufacturer gives a 2-year warranty, extendable to 10 years with an annual authorised inspection.' },
      { q: 'What does a fire water tank cost?', a: 'That depends on the capacity, the connections and the accessories. Request a quote and you will receive a tailored proposal.' }
    ],
    categories: ['brandwatertanks', 'open-zelfdragende-tanks'],
    products: ['exflo-waterbase-f', 'exflo-hydronion'],
    sources: []
  },

  {
    slug: 'mest-en-uan-flexibel-opslaan',
    kicker: 'Agriculture',
    title: 'Manure bag or UAN tank: extra storage without building',
    seoTitle: 'Manure bag and flexible manure storage: rules, sizes and tips | EnviroFlow',
    description: 'Need extra storage for liquid manure, digestate or UAN? How a manure bag works, which sizes are available and which Dutch rules apply to the liner and leak-tightness.',
    updated: UPDATED,
    image: { src: IMG + 'farmer-s-2.jpg', alt: 'Manure bag next to a field, with a tractor and slurry tanker in the background' },
    intro: 'In the Netherlands, liquid manure may not be spread in autumn and winter. Storage has to bridge those months, and the pit or basin often turns out to be too small. A flexible manure bag gives extra space, even where building is not possible or takes too long.',
    takeaways: [
      'A manure bag offers 50 to 300 m³ of extra storage, without construction work.',
      'The bag is closed, which according to the manufacturer limits gas and odour emissions.',
      'For manure basins in the Netherlands, the liner must be certified and the basin must be leak-tight.',
      'For UAN and liquid fertiliser there is a separate tank of 10 to 265 m³.'
    ],
    sections: [
      {
        h: 'Why extra manure storage?',
        list: [
          'In the winter months, liquid manure may not be spread. The exact periods per soil type and crop are in the RVO table.',
          'An extra buffer near the land where the manure is spread saves driving.',
          'Temporary storage during renovation or an emergency.',
          'Storage of digestate or liquid fraction.'
        ]
      },
      {
        h: 'How a manure bag works',
        p: ['A manure bag is a closed, flexible tank made of lacquered, PVC-coated fabric of 1,300 g/m². According to the manufacturer, the fabric is specifically intended for contact with natural fertilisers and digestate. You fill and empty the bag via a 5" slide valve with lever: one for 50 m³, two from 100 m³. The bag has no mixer.'],
        table: {
          head: ['Capacity', 'Dimensions (l × w)'],
          rows: [['50 m³', '8.78 × 7.20 m'], ['100 m³', '11.74 × 8.60 m'], ['150 m³', '14.70 × 9.40 m'], ['200 m³', '14.70 × 12.10 m'], ['250 m³', '17.67 × 12.50 m'], ['300 m³', '20.64 × 12.65 m']]
        },
        after: ['According to the manufacturer, the material withstands temperatures from −30 °C to +70 °C. There is a 10-year manufacturer’s warranty on leak-tightness.']
      },
      {
        h: 'Which rules apply?',
        p: ['In the Netherlands, the rules for storing liquid manure, digestate or liquid fraction in a manure basin are in section 4.86 of the Activities (Living Environment) Decree (Bal). For the soil, it comes down to this:'],
        list: [
          'The basin must be leak-tight, including the filling and emptying connections.',
          'The liner must be certified according to one of the assessment guidelines BRL-K519, BRL-K537, BRL-K538, BRL-K546 or BRL-1149. Certified liner carries a stamp with the code MB.',
          'Since 1 January 2024 there is no longer an inspection obligation. You must, however, check the basin yourself regularly for damage.',
          'Large manure storage, more than 750 m² or 2,500 m³ of liquid manure, requires an environmental permit.'
        ],
        callout: { t: 'Our advice', d: 'Whether and how these rules apply to your manure bag depends on your business and the location. Check with your municipality or environmental agency. Ask for the liner certificate of any manure bag. We will find it out for you.' }
      },
      {
        h: 'UAN and liquid fertiliser',
        p: [`For UAN and other liquid mineral fertilisers there is a separate [flexible UAN tank](${L.uan}) of 10 to 265 m³. According to the manufacturer, it is suitable for fertilisers with a pH of 3 to 10 and an alcohol content below 4%. The manufacturer recommends placing the tank in an additional containment membrane; this is available as a second tank wall.`],
        image: { src: IMG + 'farmer-u-2.jpg', alt: 'Flexible UAN tank in a containment membrane', caption: 'A UAN tank in a containment membrane as a second tank wall.' }
      },
      {
        h: 'What to look out for when installing',
        list: [
          'A level surface without sharp stones.',
          'Access for the slurry tanker or pump.',
          'Distances to ditches, buildings and neighbours: check with the municipality what applies to your location.',
          'Regular checks for damage to the bag and the connections.'
        ]
      }
    ],
    faq: [
      { q: 'Does a manure bag need to be inspected?', a: 'Since 1 January 2024, there has been no inspection obligation for manure basins in the Netherlands. The basin must still be leak-tight and you must check it yourself regularly.' },
      { q: 'How long does a manure bag last?', a: 'The manufacturer gives a 10-year warranty on leak-tightness. The actual service life depends on use and sun exposure.' },
      { q: 'Can I move a manure bag?', a: 'Yes. When empty, the bag can be folded and used again in another location.' },
      { q: 'Do I need a permit?', a: 'Large manure storage (more than 750 m² or 2,500 m³) requires an environmental permit. For smaller storage it depends on your situation; check with your municipality.' }
    ],
    categories: ['mest-en-slurrytanks', 'uan-tanks'],
    products: ['farmer-s-mestzak', 'farmer-u-uan-tank'],
    sources: [SRC.mestBodem, SRC.mestRegels, SRC.rvo]
  },

  {
    slug: 'brandstof-tijdelijk-opslaan-op-locatie',
    kicker: 'Fuel',
    title: 'Storing diesel temporarily on the construction site or at a generator',
    seoTitle: 'Storing diesel on site: flexible fuel tank and rules | EnviroFlow',
    description: 'Storing diesel temporarily on a project or at a generator? The Dutch rules for above-ground tanks, a flexible fuel tank and the right spill tray.',
    updated: UPDATED,
    image: { src: IMG + 'fuelbase.jpg', alt: 'Flexible fuel tank in a spill tray on a sandy surface' },
    intro: 'On a construction site, for emergency power or temporary heating, fuel is needed close to where it is used. A leak then quickly becomes soil contamination. The right tank and containment prevent that. These are the rules and the options.',
    takeaways: [
      'An above-ground diesel tank must stand in or above a spill tray, or be double-walled with leak detection.',
      'The filling point belongs above a liquid-tight facility or a drip tray.',
      'A flexible fuel tank is available in 200, 500 and 900 litres.',
      'According to the manufacturer, the tank must stand in a spill tray holding at least 110% of the tank volume.'
    ],
    sections: [
      {
        h: 'What do the rules say?',
        p: ['In the Netherlands, the soil rules for storing diesel in an above-ground tank are in the Activities (Living Environment) Decree (Bal). IPLO summarises them as follows:'],
        list: [
          'The tank stands above or in a spill tray, or is double-walled with leak detection.',
          'The filling or draining point is above a liquid-tight facility, or above or in a filling point drip tray.',
          'A drip tray on the tank holds at least 5 litres. A separate drip tray at least 65 litres.'
        ],
        after: ['There is also PGS 30 for liquid fuels in above-ground tanks up to 150 m³. It also mentions mobile tank installations, such as a separate tank with a pump on a construction site, and points out the risks of leaks from moving the tank and of refuelling over unpaved ground. The competent authority decides which rules apply to your situation.']
      },
      {
        h: 'The flexible fuel tank',
        p: ['The Fuelbase XSD is a self-supporting, flexible tank for diesel and heating oil. It is made of multi-layer fabric with an antistatic, UV-resistant TPU coating. According to the manufacturer, every tank is leak-tested by UDT, a Polish inspection body. Folded, it takes up only a few per cent of its volume.'],
        table: {
          head: ['Capacity', 'Dimensions (l × w)', 'Minimum containment (110%)'],
          rows: [['200 litres', '1.89 × 0.80 m', '220 litres'], ['500 litres', '1.89 × 1.40 m', '550 litres'], ['900 litres', '1.89 × 1.90 m', '990 litres']]
        },
        callout: { t: 'Please note', d: 'The spill tray must not only hold enough litres; the tank must also fit in it comfortably. We will agree the right size with you.' }
      },
      {
        h: 'Containment under the generator',
        p: [`A generator can leak itself too, for example during a malfunction or when refilling. A [spill tray for generators](${L.opvang}) of 2.91 × 1.50 m holds 1,451 litres and moves with you to the next project.`],
        image: { src: IMG + 'opvangbak-aggregaat.jpg', alt: 'Generator in a flexible spill tray', caption: 'A generator in a flexible spill tray: 1,451 litres of containment capacity.' }
      },
      {
        h: 'Tips for safe refuelling on site',
        list: [
          'Never refuel over unpaved ground without containment underneath.',
          'Check the tank and hoses for leaks after every move.',
          'Secure the tank and pump against unauthorised use.',
          'Keep absorbent material at hand for small spills.',
          'Agree who checks the tank and how often.'
        ]
      }
    ],
    faq: [
      { q: 'Can diesel be stored in a flexible tank?', a: 'Yes. The Fuelbase XSD is intended for the temporary storage of diesel and heating oil. According to the manufacturer, it must stand in a spill tray holding at least 110% of the tank volume.' },
      { q: 'Can petrol be stored in the Fuelbase XSD?', a: 'No. The XSD version is intended for diesel and heating oil.' },
      { q: 'Do I need to report the storage?', a: 'That depends on the quantity and your situation. In the Netherlands, check with your municipality or environmental agency, or look in the Omgevingsloket.' }
    ],
    categories: ['brandstoftanks', 'flexibele-opvangbakken'],
    products: ['fuelbase-brandstoftank', 'opvangbak-aggregaat'],
    sources: [SRC.diesel, SRC.pgs30]
  },

  {
    slug: 'je-bedrijf-beschermen-tegen-wateroverlast',
    kicker: 'Flooding',
    title: 'Protecting your business against flooding: an alternative to sandbags',
    seoTitle: 'Mobile flood barrier as an alternative to sandbags | EnviroFlow',
    description: 'How do you protect your building against flooding? A four-step plan, sandbags and mobile flood barriers compared, and which height you need.',
    updated: UPDATED,
    image: { src: IMG + 'exflooder-oefening.jpg', alt: 'Emergency workers filling a mobile flood barrier with water' },
    intro: 'Heavy rain, high water or a burst pipe: water entering your building causes a lot of damage to stock, installations and the building in a short time. If you have a plan in advance, you act faster and limit the damage. A mobile flood barrier helps.',
    takeaways: [
      'Make a plan before the water comes: where, how many metres, who and with what.',
      'You fill a mobile flood barrier with water on site. That is faster than filling sandbags.',
      'Barriers are available 22, 45 and 89 cm high. Stacked, you get above 140 cm.',
      'After use, you empty the barrier, let it dry and store it compactly.'
    ],
    sections: [
      {
        h: 'A plan in four steps',
        steps: [
          { t: 'Map where water can get in', d: 'Entrances, loading doors, garage doors, basement entrances and low-lying parts of the site.' },
          { t: 'Determine length and height', d: 'Measure how many metres of barrier you need and how high the water can rise.' },
          { t: 'Agree who does what', d: 'Who installs the barrier, where is it stored and where do you get the water from?' },
          { t: 'Practise once', d: 'Anyone who has done it once is much faster in a real emergency.' }
        ]
      },
      {
        h: 'Sandbags or mobile flood barrier?',
        table: {
          head: ['', 'Sandbags', 'Mobile flood barrier'],
          rows: [
            ['Filling', 'With sand, bag by bag', 'On site with water, using a pump or hydrant'],
            ['Installing', 'A lot of manual work', 'According to the manufacturer, faster than a sandbag dike'],
            ['After use', 'Often wet and contaminated, to be disposed of', 'Let it drain, dry it and store it'],
            ['Storage', 'A lot of space for sand and bags', 'Folded, a few per cent of its volume']
          ]
        }
      },
      {
        h: 'Which height do you need?',
        table: {
          head: ['Version', 'Height after filling', 'Lengths', 'Suitable for'],
          rows: [
            ['Ø 22 cm', '22 cm', '3, 5, 10 and 15 m', 'Entrances, garage doors and other low openings'],
            ['Ø 46 cm', '45 cm', '5, 10 and 15 m', 'Commercial buildings and sites'],
            ['Ø 94 cm', '89 cm', '5, 10 and 15 m', 'Higher water; stacked more than 140 cm']
          ],
          note: 'The Ø 46 cm and Ø 94 cm are also available as Exflooder+, with a self-sealing coupling sleeve to connect modules.'
        },
        image: { src: IMG + 'sfeer-waterkering.jpg', alt: 'Mobile flood barrier along a waterside', caption: 'Modules can be connected to the length you need.' }
      },
      {
        h: 'How to install a mobile flood barrier',
        steps: [
          { t: 'Roll it out', d: 'Lay the barrier where the water needs to be held back.' },
          { t: 'Anchor it', d: 'Secure the barrier with the anchoring straps.' },
          { t: 'Fill it with water', d: 'Connect a hose with a Storz coupling to the filling connection. Air escapes through the vent.' },
          { t: 'Afterwards', d: 'Let the barrier drain via the drain connection, let it dry and store it.' }
        ],
        after: ['According to the manufacturer, the fabric resists mould and bacteria during storage. The Exflooder comes with a 7-year manufacturer’s warranty.']
      }
    ],
    faq: [
      { q: 'How high does a mobile flood barrier get?', a: 'After filling 22, 45 or 89 cm, depending on the version. Stacking the Ø 94 cm version in a pyramid takes you above 140 cm.' },
      { q: 'What do I need to fill the barrier?', a: 'A water source, such as a pump or hydrant, and a hose with a Storz coupling. Ask us which connection goes with your version.' },
      { q: 'Can I use the barrier more than once?', a: 'Yes. After use, let it drain, dry it and fold it up. The manufacturer gives a 7-year warranty.' }
    ],
    categories: ['mobiele-waterkeringen'],
    products: ['exflooder-22', 'exflooder-46', 'exflooder-94'],
    sources: []
  }
];
