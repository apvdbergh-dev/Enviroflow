// Sectorpagina's. 'categories' verwijst naar categorie-id's uit src/data/categories.json.
export default [
  {
    slug: 'industrie', name: 'Industrie',
    intro: 'In productie, opslag en onderhoud werkt u met oliën, chemicaliën en proceswater. Lekkages moeten worden opgevangen voordat ze schade veroorzaken.',
    liquids: ['Oliën en smeermiddelen', 'Chemicaliën in IBC\'s en vaten', 'Proceswater', 'Bluswater'],
    risks: ['Lekkage bij opslag en aftappen', 'Morsingen tijdens onderhoud', 'Te weinig buffercapaciteit voor proceswater'],
    categories: ['flexibele-opvangbakken', 'industriele-water-en-buffertanks', 'brandwatertanks', 'maatwerk']
  },
  {
    slug: 'bouw-en-infra', name: 'Bouw & infra',
    intro: 'Op projectlocaties wisselt de situatie steeds. U heeft oplossingen nodig die snel staan en mee kunnen naar het volgende project.',
    liquids: ['Diesel', 'Hydraulische olie', 'Proceswater en bemalingswater', 'Bluswater'],
    risks: ['Lekkage onder materieel en aggregaten', 'Brandstofopslag op locatie', 'Geluidsoverlast voor de omgeving'],
    categories: ['flexibele-opvangbakken', 'brandstoftanks', 'industriele-water-en-buffertanks', 'geluidsabsorberende-matten']
  },
  {
    slug: 'landbouw', name: 'Landbouw',
    intro: 'Op het agrarisch bedrijf slaat u mest, meststoffen, brandstof en water op. Extra capaciteit is vaak nodig zonder dat u direct kunt bouwen.',
    liquids: ['Drijfmest en digestaat', 'UAN en vloeibare meststoffen', 'Diesel', 'Bluswater'],
    risks: ['Te weinig mestopslag', 'Lekkage van meststoffen of brandstof', 'Onvoldoende bluswater in het buitengebied'],
    categories: ['mest-en-slurrytanks', 'uan-tanks', 'brandwatertanks', 'brandstoftanks']
  },
  {
    slug: 'automotive', name: 'Automotive',
    intro: 'In werkplaatsen en op terreinen met voertuigen draait het om opvang van olie, koelvloeistof en waswater.',
    liquids: ['Motorolie en afgewerkte olie', 'Koelvloeistof', 'Waswater met reinigingsmiddelen'],
    risks: ['Druppels en lekkages onder voertuigen', 'Waswater dat in de bodem of het riool loopt', 'Opslag van vaten en IBC\'s'],
    categories: ['flexibele-opvangbakken', 'wasmatten-voertuigen']
  },
  {
    slug: 'transport-en-logistiek', name: 'Transport & logistiek',
    intro: 'Bij opslag, overslag en het wassen van voertuigen wilt u lekkages en vervuild water onder controle houden.',
    liquids: ['Diesel', 'Producten in IBC\'s en vaten', 'Waswater'],
    risks: ['Lekkende verpakkingen bij op- en overslag', 'Wassen van voertuigen zonder wasplaats', 'Lekkage onder geparkeerd materieel'],
    categories: ['flexibele-opvangbakken', 'wasmatten-voertuigen', 'brandstoftanks']
  },
  {
    slug: 'gemeenten-en-waterschappen', name: 'Gemeenten & waterschappen',
    intro: 'Voor beheer van openbare ruimte en calamiteiten heeft u oplossingen nodig die snel inzetbaar zijn en compact kunnen worden opgeslagen.',
    liquids: ['Oppervlaktewater en hemelwater', 'Drinkwater (noodvoorziening)', 'Afvalwater'],
    risks: ['Wateroverlast bij hevige regen of hoog water', 'Tijdelijke watervoorziening bij storingen', 'Opvang van vervuild water bij werkzaamheden'],
    categories: ['mobiele-waterkeringen', 'drinkwatertanks', 'open-zelfdragende-tanks', 'afvalwatertanks']
  },
  {
    slug: 'brandweer-en-veiligheidsregios', name: "Brandweer & veiligheidsregio's",
    intro: 'Bij inzet en oefening telt dat materiaal snel staat, licht is en goed mee te nemen.',
    liquids: ['Bluswater', 'Verontreinigd spoelwater', 'Gelekte gevaarlijke stoffen'],
    risks: ['Onvoldoende bluswater op locatie', 'Verontreinigd water bij decontaminatie', 'Opvang van lekkages bij incidenten'],
    categories: ['open-zelfdragende-tanks', 'brandwatertanks', 'decontaminatiematten-voertuigen', 'decontaminatiebaden-personen', 'flexibele-opvangbakken']
  },
  {
    slug: 'evenementen', name: 'Evenementen',
    intro: 'Op een evenemententerrein is alles tijdelijk. Water, brandstof en afvalwater moeten snel geregeld en weer opgeruimd zijn.',
    liquids: ['Drinkwater', 'Afvalwater', 'Diesel voor aggregaten', 'Bluswater'],
    risks: ['Geen vaste water- of rioolaansluiting', 'Lekkage onder aggregaten', 'Eisen voor bluswater op het terrein'],
    categories: ['drinkwatertanks', 'afvalwatertanks', 'flexibele-opvangbakken', 'brandwatertanks']
  },
  {
    slug: 'scheepvaart-en-offshore', name: 'Scheepvaart & offshore',
    intro: 'Op kades, schepen en offshore locaties is ruimte beperkt en moet materiaal compact te vervoeren zijn.',
    liquids: ['Brandstof en smeerolie', 'Chemicaliën in verpakking', 'Water'],
    risks: ['Lekkage bij opslag en overslag op de kade', 'Beperkte ruimte voor opvang', 'Tijdelijke opslag bij onderhoud'],
    categories: ['flexibele-opvangbakken', 'brandstoftanks', 'maatwerk']
  }
];
