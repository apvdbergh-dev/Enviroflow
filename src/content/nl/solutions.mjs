// Oplossingspagina's: probleem → waar let u op → mogelijke oplossingen → passende producten → CTA.
// 'categories' verwijst naar categorie-id's uit src/data/categories.json.
export default [
  {
    slug: 'ibc-en-vaten-veilig-opslaan',
    tile: "Ik wil IBC's of vaten veilig opslaan",
    title: "IBC's en vaten veilig opslaan",
    seoTitle: "IBC's en vaten veilig opslaan | IBC lekbak | EnviroFlow",
    seoDescription: "IBC's of vaten met olie of chemicaliën veilig opslaan? Lees waar u op let en welke flexibele opvangbak of lekbak bij uw situatie past.",
    problem: [
      "Een IBC of vat kan lekken door een beschadiging, een losse kraan of een fout bij het aftappen. Zonder opvang komt de vloeistof op de vloer, in de bodem of in het riool.",
      "Voor de opslag van gevaarlijke stoffen in verpakking gelden bovendien regels, bijvoorbeeld uit PGS 15."
    ],
    attention: [
      'Welke vloeistof slaat u op, en is de opvangbak daartegen bestand?',
      "Hoeveel IBC's of vaten staan er, en hoeveel opvangcapaciteit is nodig?",
      'Staat de opslag binnen of buiten (regenwater in de opvangbak)?',
      'Is de opslag tijdelijk of permanent, en moet hij verplaatsbaar zijn?',
      'Hoeveel ruimte is er beschikbaar?'
    ],
    categories: ['flexibele-opvangbakken', 'maatwerk'],
    sources: [{ label: 'Publicatiereeks Gevaarlijke Stoffen (PGS 15)', url: 'https://publicatiereeksgevaarlijkestoffen.nl/' }]
  },
  {
    slug: 'tijdelijke-wateropslag',
    tile: 'Ik heb tijdelijk wateropslag nodig',
    title: 'Tijdelijke wateropslag',
    seoTitle: 'Tijdelijke wateropslag met een flexibele tank | EnviroFlow',
    seoDescription: 'Tijdelijk water opslaan op de bouwplaats, bij een evenement of tijdens een storing? Bekijk de mogelijkheden met flexibele en open tanks.',
    problem: [
      'Bij projecten, evenementen, storingen of droogte is vaak tijdelijk water nodig op een plek zonder (voldoende) aansluiting. Een vaste tank bouwen is dan te duur of te traag.'
    ],
    attention: [
      'Om welk water gaat het: drinkwater, proceswater, regenwater of bluswater?',
      'Hoeveel water heeft u nodig, en hoe snel moet het beschikbaar zijn?',
      'Is de ondergrond vlak en draagkrachtig genoeg voor een gevulde tank?',
      'Moet de tank verplaatsbaar zijn?'
    ],
    categories: ['industriele-water-en-buffertanks', 'open-zelfdragende-tanks', 'mobiele-watertanks', 'drinkwatertanks'],
    sources: []
  },
  {
    slug: 'bluswatervoorziening',
    tile: 'Ik zoek bluswatervoorziening',
    title: 'Bluswatervoorziening',
    seoTitle: 'Bluswatervoorziening met een brandwatertank | EnviroFlow',
    seoDescription: 'Onvoldoende bluswater op uw locatie? Lees waar u op let bij een bluswatervoorziening en bekijk flexibele brandwatertanks.',
    problem: [
      'Niet elke locatie heeft voldoende bluswater uit het waterleidingnet of uit open water. De brandweer of veiligheidsregio kan dan een eigen bluswatervoorziening vragen.'
    ],
    attention: [
      'Welke inhoud en aansluitingen vraagt de brandweer of veiligheidsregio?',
      'Is de tank bereikbaar voor brandweervoertuigen?',
      'Is de voorziening tijdelijk (bijvoorbeeld tijdens de bouw) of permanent?',
      'Is er voldoende vlakke ruimte voor de tank?'
    ],
    categories: ['brandwatertanks', 'open-zelfdragende-tanks'],
    sources: []
  },
  {
    slug: 'brandstofopslag-op-locatie',
    tile: 'Ik zoek brandstofopslag op locatie',
    title: 'Brandstofopslag op locatie',
    seoTitle: 'Diesel opslag op locatie | Flexibele brandstoftank | EnviroFlow',
    seoDescription: 'Diesel of verwarmingsolie tijdelijk opslaan op een project of bij een aggregaat? Lees waar u op let en bekijk flexibele brandstoftanks.',
    problem: [
      'Op bouwprojecten, bij noodstroom of tijdelijke verwarming moet brandstof dicht bij het gebruik worden opgeslagen. Lekkage van brandstof leidt snel tot bodemverontreiniging.',
      'Voor de opslag van vloeibare brandstoffen gelden regels, bijvoorbeeld uit PGS 30.'
    ],
    attention: [
      'Welke brandstof en hoeveel liter slaat u op?',
      'Is er opvang voor lekkages en morsingen bij het tanken?',
      'Hoe lang blijft de opslag staan?',
      'Welke eisen stelt het bevoegd gezag aan uw situatie?'
    ],
    categories: ['brandstoftanks', 'flexibele-opvangbakken'],
    sources: [{ label: 'Publicatiereeks Gevaarlijke Stoffen (PGS 30)', url: 'https://publicatiereeksgevaarlijkestoffen.nl/' }]
  },
  {
    slug: 'mest-en-meststoffen-opslaan',
    tile: 'Ik wil mest of meststoffen opslaan',
    title: 'Mest en meststoffen opslaan',
    seoTitle: 'Mest en UAN opslaan | Mestzak en UAN tank | EnviroFlow',
    seoDescription: 'Extra opslag nodig voor drijfmest, digestaat of UAN? Lees waar u op let en bekijk flexibele mestzakken en UAN-tanks.',
    problem: [
      'Te weinig opslagcapaciteit voor drijfmest of digestaat, of vloeibare meststoffen die u in grotere hoeveelheden inkoopt: een vaste opslag bouwen is duur en kost tijd.'
    ],
    attention: [
      'Welke stof slaat u op: drijfmest, digestaat, slurry of UAN?',
      'Hoeveel kubieke meter extra opslag heeft u nodig?',
      'Is de ondergrond geschikt en is er ruimte op het erf?',
      'Welke regels gelden er bij uw gemeente of omgevingsdienst?'
    ],
    categories: ['mest-en-slurrytanks', 'uan-tanks'],
    sources: []
  },
  {
    slug: 'bescherming-tegen-wateroverlast',
    tile: 'Ik moet me beschermen tegen wateroverlast',
    title: 'Bescherming tegen wateroverlast',
    seoTitle: 'Bescherming tegen wateroverlast | Mobiele waterkering | EnviroFlow',
    seoDescription: 'Uw pand of terrein beschermen tegen wateroverlast? Lees waar u op let en bekijk mobiele waterkeringen en flood sleeves.',
    problem: [
      'Hevige regen, hoog water of een gesprongen leiding kan in korte tijd veel schade veroorzaken aan uw pand, voorraad of installaties.'
    ],
    attention: [
      'Welke ingangen, gevels of installaties wilt u beschermen?',
      'Over welke lengte moet de kering staan?',
      'Hoe snel moet de kering geplaatst kunnen worden, en door wie?',
      'Waar slaat u de kering op als hij niet nodig is?'
    ],
    categories: ['mobiele-waterkeringen'],
    sources: []
  },
  {
    slug: 'oplossingen-voor-de-bouwplaats',
    tile: 'Ik zoek een oplossing voor mijn bouwplaats',
    title: 'Oplossingen voor de bouwplaats',
    seoTitle: 'Oplossingen voor de bouwplaats | Opvang, water en geluid | EnviroFlow',
    seoDescription: 'Opvang onder materieel, brandstof en water op locatie of minder geluidsoverlast: bekijk flexibele oplossingen voor de bouwplaats.',
    problem: [
      'Op een bouwplaats komen veel vloeistoffen samen: brandstof voor materieel, olie, bluswater en proceswater. Daarnaast speelt vaak geluidsoverlast voor de omgeving.'
    ],
    attention: [
      'Staat er materieel of een aggregaat dat olie of brandstof kan lekken?',
      'Is er water nodig voor het werk of als bluswatervoorziening?',
      'Moet u geluidsoverlast voor omwonenden beperken?',
      'Hoe vaak verplaatst u de oplossing naar een volgend project?'
    ],
    categories: ['flexibele-opvangbakken', 'brandstoftanks', 'industriele-water-en-buffertanks', 'geluidsabsorberende-matten'],
    sources: []
  }
];
