// Explanation shown below the products on a category page, per category id (English version of src/content/nl/category-guides.mjs).

const IMG = '/assets/img/producten/';

export default {
  'flexibele-opvangbakken': {
    sections: [
      {
        h: 'How does a flexible spill tray work?',
        p: [
          'The floor and the raised edges together form one tray. If something leaks from an IBC, a drum or a machine, it stays within the edges. You then vacuum or pump up the liquid and dispose of it as required for that substance.',
          'We supply the spill trays in two versions. The **Plus** is made of polyester fabric with an EVA coating of 1,365 g/m². According to the manufacturer, this is stronger and more chemically resistant than the 650 to 900 g/m² PVC fabric often used for standard spill trays. The **Starter** is the economical version in 900 g/m² PVC fabric, intended for short-term contact with chemicals. Read more in [PVC or EVA spill berm: what is the difference?](/kennisbank/verschil-pvc-en-eva-lekbak/)'
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
        h: 'Is the spill tray resistant to my liquid?',
        p: ['That differs per substance and per version. For the Plus (EVA), the manufacturer has a resistance table stating for each liquid how the material holds up after two years of contact: A (good), B (moderate) or C (not suitable). Most oils and many chemicals score well, but not everything. Hydrochloric acid 32%, for example, is rated C. The Starter (PVC) is intended for short-term contact and, according to the manufacturer, is not suitable for petrol and diesel, among others.'],
        callout: { t: 'Tip', d: 'Keep the safety data sheet (SDS) of the substance to hand. It states exactly which substance it is. Send it with your request and we will check the resistance for you.' }
      },
      {
        h: 'What do the rules say?',
        p: [
          'In the Netherlands, the guideline for storing packaged liquid hazardous substances is **PGS 15**. It requires containment of at least **110% of the volume of the largest container**. If 10% of the total volume is more, that 10% applies. Empty, uncleaned packaging does not count. Source: [IPLO, PGS 15 product containment (in Dutch)](https://iplo.nl/thema/externe-veiligheid/handleiding-publicatiereeks-gevaarlijke-stoffen/pgs-15-algemene-voorschriften/pgs-15-opslagvoorzieningen/pgs-15-productopvang-opslagvoorziening/).',
          'Whether a spill tray is mandatory for your storage depends on the substance, the quantity and how it is stored. [When is a spill tray mandatory?](/kennisbank/wanneer-is-een-lekbak-verplicht/) explains it per situation, with the official sources. Worked examples are in [Calculating containment capacity](/kennisbank/hoe-kies-je-de-juiste-opvangcapaciteit/).'
        ]
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
      { q: 'What else is a flexible spill tray called?', a: 'A flexible spill tray is also called a foldable spill tray, portable spill tray, flexible containment berm or spill containment berm.' },
      { q: 'How long does a flexible spill tray last?', a: 'The manufacturer gives a 7-year warranty on the Plus version in EVA. How long a spill tray lasts in practice depends on use, the liquid and whether it is indoors or outdoors.' },
      { q: 'Can a flexible spill tray stand outdoors?', a: 'Yes. According to the manufacturer, the EVA fabric of the Plus version remains usable from −40 °C to +70 °C. Keep in mind that rainwater reduces the available containment capacity.' },
      { q: 'Is a flexible spill tray suitable for flammable liquids?', a: 'According to the manufacturer, the Plus version in EVA is suitable for ATEX zone 2 (category 3G), including substances from subgroups IIA, IIB and IIC. The Starter in PVC is not suitable for petrol and diesel. The competent authority decides which requirements apply to your storage.' }
    ]
  }
};
