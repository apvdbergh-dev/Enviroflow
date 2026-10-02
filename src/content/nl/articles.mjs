// Kennisbankartikelen. Algemene uitleg; bij regelgeving altijd verwijzen naar de officiële bron.
// Secties: { h: kop, p: [alinea's], list: [opsomming] }
const PGS = { label: 'Publicatiereeks Gevaarlijke Stoffen (officiële PGS-richtlijnen)', url: 'https://publicatiereeksgevaarlijkestoffen.nl/' };

export default [
  {
    slug: 'wat-is-een-flexibele-lekbak',
    title: 'Wat is een flexibele lekbak?',
    description: 'Een flexibele lekbak vangt lekkages op onder IBC\'s, vaten, machines en voertuigen. Lees hoe hij werkt en wanneer hij een goede keuze is.',
    intro: 'Een flexibele lekbak (ook wel flexibele opvangbak of spill containment berm) is een opvangbak van technisch textiel met opstaande randen. Hij vangt vloeistof op die lekt of gemorst wordt, zodat die niet op de vloer, in de bodem of in het riool terechtkomt.',
    sections: [
      { h: 'Hoe werkt een flexibele lekbak?', p: ['De bodem en randen vormen samen een bak. Lekt er vloeistof uit een IBC, vat of machine, dan blijft die binnen de randen. U kunt de vloeistof daarna gecontroleerd opruimen of afvoeren.'] },
      { h: 'Wanneer kiest u voor een flexibele lekbak?', list: ['U heeft opvang nodig op een tijdelijke of wisselende locatie', 'Een stalen lekbak is te zwaar of past niet', 'U wilt de opvang na gebruik compact opbergen', 'U heeft een afwijkende maat nodig'] },
      { h: 'Waar let u op?', list: ['Is het materiaal bestand tegen uw vloeistof?', 'Is de opvangcapaciteit voldoende voor uw situatie?', 'Staat de lekbak binnen of buiten?', 'Rijdt er materieel overheen?'] },
      { h: 'Regels', p: ['Voor de opslag van gevaarlijke stoffen in verpakking gelden regels, onder meer uit PGS 15. Welke eisen voor uw situatie gelden, leest u in de officiële publicatie of hoort u van uw bevoegd gezag.'] }
    ],
    categories: ['flexibele-opvangbakken'],
    sources: [PGS]
  },
  {
    slug: 'welke-opvangbak-heb-ik-nodig-voor-ibcs',
    title: "Welke opvangbak heb ik nodig voor IBC's?",
    description: "Een IBC lekbak kiezen: let op het aantal IBC's, de vloeistof, de opvangcapaciteit en de locatie. Een stappenplan.",
    intro: "Een IBC bevat veel vloeistof. Gaat er iets mis, dan wilt u dat alles wordt opgevangen. Met deze vragen kiest u een passende IBC opvangbak.",
    sections: [
      { h: "1. Hoeveel IBC's staan er?", p: ["Tel het aantal IBC's dat tegelijk op de plek staat. Flexibele opvangbakken zijn er voor één tot meerdere IBC's, en op maat."] },
      { h: '2. Welke vloeistof zit erin?', p: ['Het materiaal van de opvangbak moet bestand zijn tegen de vloeistof. Houd het veiligheidsinformatieblad bij de hand. Wij controleren de geschiktheid voor uw vloeistof.'] },
      { h: '3. Hoeveel opvangcapaciteit is nodig?', p: ['Dit hangt af van de inhoud van de IBC\'s en de regels voor uw situatie. Lees ook ons artikel over het kiezen van de juiste opvangcapaciteit.'] },
      { h: '4. Binnen of buiten?', p: ['Buiten kan regenwater in de opvangbak komen. Dat vermindert de beschikbare opvangcapaciteit. Houd hier rekening mee bij de keuze en het beheer.'] },
      { h: '5. Tijdelijk of permanent?', p: ['Voor tijdelijke en wisselende locaties is een flexibele opvangbak praktisch. Voor een vaste opstelling kan ook een andere oplossing passen.'] }
    ],
    categories: ['flexibele-opvangbakken'],
    sources: [PGS]
  },
  {
    slug: 'hoe-kies-je-de-juiste-opvangcapaciteit',
    title: 'Hoe kies je de juiste opvangcapaciteit?',
    description: 'Hoeveel liter moet een lekbak kunnen opvangen? Een uitleg over opvangcapaciteit en waar u de geldende eisen vindt.',
    intro: 'De opvangcapaciteit is de hoeveelheid vloeistof die een opvangbak kan bevatten. Te weinig capaciteit betekent dat een lekkage alsnog buiten de bak terechtkomt.',
    sections: [
      { h: 'Waar hangt de benodigde capaciteit van af?', list: ['Het aantal verpakkingen en hun inhoud', 'Het soort stof en de gevarenklasse', 'De regels die voor uw opslag gelden', 'Binnen- of buitenopslag (regenwater)'] },
      { h: 'Waar vindt u de eisen?', p: ['Voor de opslag van gevaarlijke stoffen in verpakking is PGS 15 een belangrijke richtlijn. Raadpleeg de actuele versie op de officiële website. Uw bevoegd gezag (gemeente of omgevingsdienst) bepaalt welke eisen voor uw locatie gelden.'] },
      { h: 'Wij rekenen met u mee', p: ['Geef het aantal en de inhoud van uw verpakkingen door. Wij helpen u een opvangbak met passende capaciteit te kiezen.'] }
    ],
    categories: ['flexibele-opvangbakken'],
    sources: [PGS]
  },
  {
    slug: 'flexibele-tank-of-stalen-tank',
    title: 'Flexibele tank of stalen tank?',
    description: 'De verschillen tussen een flexibele tank en een stalen tank: plaatsing, transport, ruimte en toepassing.',
    intro: 'Voor de opslag van water, brandstof of mest kunt u kiezen voor een vaste tank of een flexibele tank. Beide hebben hun eigen toepassing.',
    sections: [
      { h: 'Flexibele tank', list: ['Leeg compact te vervoeren en op te slaan', 'Geen zware fundering of hijswerk voor de tank zelf', 'Geschikt voor tijdelijke en wisselende locaties', 'Wel een vlakke, schone ondergrond nodig'] },
      { h: 'Stalen tank', list: ['Vaste constructie', 'Zwaarder om te transporteren en te plaatsen', 'Geschikt voor een vaste plek'] },
      { h: 'Wat past bij u?', p: ['Dat hangt af van de vloeistof, het volume, de duur van de opslag en de ruimte op locatie. Bespreek uw situatie met ons.'] }
    ],
    categories: ['industriele-water-en-buffertanks', 'brandstoftanks', 'brandwatertanks'],
    sources: []
  },
  {
    slug: 'tijdelijke-wateropslag-op-de-bouwplaats',
    title: 'Tijdelijke wateropslag op de bouwplaats',
    description: 'Water nodig op de bouwplaats? Zo regelt u tijdelijke wateropslag met een flexibele of open tank.',
    intro: 'Op een bouwplaats is water nodig voor het werk, voor reiniging en soms als bluswater. Niet elke locatie heeft daarvoor een aansluiting.',
    sections: [
      { h: 'Mogelijkheden', list: ['Flexibele buffertank voor proceswater', 'Open zelfdragende tank voor snel beschikbaar water', 'Mobiele watertank voor kleine hoeveelheden'] },
      { h: 'Waar let u op?', list: ['Een vlakke, draagkrachtige ondergrond', 'Bereikbaarheid voor vullen en aftappen', 'Hoe lang de opslag nodig is'] }
    ],
    categories: ['industriele-water-en-buffertanks', 'open-zelfdragende-tanks', 'mobiele-watertanks'],
    sources: []
  },
  {
    slug: 'bluswatervoorziening-met-een-flexibele-tank',
    title: 'Bluswatervoorziening met een flexibele tank',
    description: 'Wanneer is een eigen bluswatervoorziening nodig en hoe past een flexibele brandwatertank daarin?',
    intro: 'Als er onvoldoende bluswater beschikbaar is uit het waterleidingnet of open water, kan de brandweer om een eigen voorziening vragen. Een flexibele brandwatertank is een van de mogelijkheden.',
    sections: [
      { h: 'Wie bepaalt de eisen?', p: ['De brandweer of veiligheidsregio adviseert over de benodigde hoeveelheid bluswater en de aansluitingen. Neem hun advies mee in uw aanvraag.'] },
      { h: 'Waar let u op?', list: ['Benodigde inhoud', 'Type en plaats van de aansluitingen', 'Bereikbaarheid voor brandweervoertuigen', 'Ondergrond en ruimte'] }
    ],
    categories: ['brandwatertanks', 'open-zelfdragende-tanks'],
    sources: []
  },
  {
    slug: 'mest-en-uan-flexibel-opslaan',
    title: 'Mest en UAN flexibel opslaan',
    description: 'Extra opslag voor drijfmest, digestaat of UAN met een flexibele tank: waar let u op?',
    intro: 'Extra opslagcapaciteit voor mest of vloeibare meststoffen is vaak snel nodig. Een flexibele mestzak of UAN-tank is een alternatief voor een vaste opslag.',
    sections: [
      { h: 'Waar let u op?', list: ['Welke stof u opslaat', 'Benodigde inhoud', 'Een geschikte, vlakke ondergrond', 'Vullen en leegmaken'] },
      { h: 'Regels', p: ['Voor mestopslag en de opslag van meststoffen gelden regels. Vraag bij uw gemeente of omgevingsdienst na welke eisen voor uw situatie gelden.'] }
    ],
    categories: ['mest-en-slurrytanks', 'uan-tanks'],
    sources: []
  },
  {
    slug: 'brandstof-tijdelijk-opslaan-op-locatie',
    title: 'Brandstof tijdelijk opslaan op locatie',
    description: 'Diesel of verwarmingsolie tijdelijk opslaan op een project: mogelijkheden en aandachtspunten.',
    intro: 'Op projecten en bij tijdelijke installaties is brandstof vaak dicht bij het gebruik nodig. Een flexibele brandstoftank is een van de mogelijkheden.',
    sections: [
      { h: 'Waar let u op?', list: ['Hoeveel liter en welke brandstof', 'Opvang van lekkages en morsingen', 'Beveiliging tegen onbevoegd gebruik', 'Duur van de opslag'] },
      { h: 'Regels', p: ['Voor de opslag van vloeibare brandstoffen geldt onder meer PGS 30. Raadpleeg de actuele versie en bespreek met het bevoegd gezag wat voor uw situatie geldt.'] }
    ],
    categories: ['brandstoftanks', 'flexibele-opvangbakken'],
    sources: [PGS]
  },
  {
    slug: 'je-bedrijf-beschermen-tegen-wateroverlast',
    title: 'Uw bedrijf beschermen tegen wateroverlast',
    description: 'Hoe beschermt u uw pand, voorraad en installaties tegen wateroverlast? Over mobiele waterkeringen en voorbereiding.',
    intro: 'Wateroverlast ontstaat vaak onverwacht. Wie vooraf een plan heeft, kan sneller handelen en beperkt de schade.',
    sections: [
      { h: 'Bereid u voor', list: ['Breng in kaart waar water uw pand of terrein binnen kan komen', 'Bepaal wat u wilt beschermen', 'Leg vast wie de kering plaatst en waar hij ligt'] },
      { h: 'Mobiele waterkering', p: ['Een mobiele waterkering legt u neer waar het nodig is. Buiten gebruik slaat u hem compact op.'] }
    ],
    categories: ['mobiele-waterkeringen'],
    sources: []
  }
];
