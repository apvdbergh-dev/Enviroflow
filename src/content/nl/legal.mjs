// Juridische pagina's: algemene voorwaarden, privacybeleid, retourbeleid, cookiebeleid.
// Opzet voor een B2B-webshop; laat de teksten vóór livegang controleren door een jurist.
// Zakelijke keuzes staan hieronder bij elkaar, zodat ze op één plek aan te passen zijn.

export const LEGAL_CHOICES = {
  draft: false,              // true = toont "Conceptversie" bovenaan de juridische pagina's
  updated: '16 oktober 2026',
  offerValidDays: 30,        // geldigheid van offertes
  paymentTermDays: 14,       // betaaltermijn bij betaling op factuur
  complaintHours: 24,        // gebreken/schade melden na levering of ontdekking
  returnNoticeWorkdays: 5,   // retour aanmelden na levering
  returnShipDays: 14,        // retour terugsturen na akkoord
  refundDays: 14,            // terugbetalen na ontvangst retour
  forceMajeureDays: 60,      // daarna mag ontbonden worden
  court: 'Rechtbank Rotterdam'
};

const K = LEGAL_CHOICES;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function company(site) {
  const a = site.address;
  return `${esc(site.name)}, ${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}, ingeschreven bij de Kamer van Koophandel onder nummer ${esc(site.kvk)}, btw-nummer ${esc(site.vatNumber)}`;
}
const contactLine = (site) => `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a> of ${esc(site.phonePrimary.display)}`;

export function legalPages(site) {
  const updated = `<p class="small muted">Laatst bijgewerkt: ${K.updated}</p>`;

  const voorwaarden = `${updated}
<h2>Artikel 1 – Definities</h2>
<ol>
<li><strong>EnviroFlow</strong>: ${company(site)}.</li>
<li><strong>Afnemer</strong>: de onderneming of organisatie die met EnviroFlow een overeenkomst sluit of daarover in onderhandeling is.</li>
<li><strong>Overeenkomst</strong>: iedere afspraak tussen EnviroFlow en de afnemer over de levering van producten of diensten, waaronder een bestelling via de webshop.</li>
</ol>

<h2>Artikel 2 – Toepasselijkheid</h2>
<ol>
<li>Deze voorwaarden gelden voor alle offertes, bestellingen en overeenkomsten van EnviroFlow.</li>
<li>De webshop is bedoeld voor zakelijke afnemers. Bestelt u als particulier, neem dan vooraf contact met ons op; voor consumenten gelden aanvullende wettelijke rechten.</li>
<li>Algemene voorwaarden van de afnemer zijn niet van toepassing, tenzij EnviroFlow dit schriftelijk heeft aanvaard.</li>
<li>Afwijkingen van deze voorwaarden gelden alleen als ze schriftelijk zijn overeengekomen.</li>
</ol>

<h2>Artikel 3 – Offertes en totstandkoming</h2>
<ol>
<li>Offertes zijn vrijblijvend en ${K.offerValidDays} dagen geldig, tenzij in de offerte anders staat.</li>
<li>Een overeenkomst komt tot stand wanneer EnviroFlow een opdracht schriftelijk bevestigt, of wanneer een bestelling via de webshop is geplaatst en betaald.</li>
<li>Kennelijke vergissingen of fouten in prijzen, afbeeldingen of productinformatie binden EnviroFlow niet.</li>
<li>Productinformatie is gebaseerd op de gegevens van de fabrikant. Afbeeldingen kunnen afwijken van het geleverde product.</li>
</ol>

<h2>Artikel 4 – Prijzen</h2>
<ol>
<li>Alle prijzen zijn in euro’s en exclusief btw, tenzij anders vermeld.</li>
<li>Verzendkosten worden apart vermeld. Waar op de website staat dat verzendkosten na bestelling worden berekend, ontvangt u hiervan vooraf bericht.</li>
<li>Maatwerk en producten met “prijs op aanvraag” worden geleverd tegen de prijs in de offerte.</li>
</ol>

<h2>Artikel 5 – Betaling</h2>
<ol>
<li>Bestellingen via de webshop betaalt u vooraf via de aangeboden betaalmethoden (afgehandeld door onze betaalprovider Mollie).</li>
<li>Bij betaling op factuur geldt een betaaltermijn van ${K.paymentTermDays} dagen na factuurdatum, tenzij anders afgesproken.</li>
<li>Bij te late betaling is de afnemer zonder ingebrekestelling de wettelijke handelsrente verschuldigd, en zijn redelijke incassokosten voor rekening van de afnemer.</li>
</ol>

<h2>Artikel 6 – Levering</h2>
<ol>
<li>Opgegeven levertijden zijn indicatief en geen fatale termijnen. Bij overschrijding nemen wij contact met u op.</li>
<li>Levering vindt plaats op het afleveradres dat u opgeeft. Het risico van de producten gaat op de afnemer over op het moment van aflevering.</li>
<li>EnviroFlow mag een bestelling in delen leveren.</li>
</ol>

<h2>Artikel 7 – Eigendomsvoorbehoud</h2>
<p>Geleverde producten blijven eigendom van EnviroFlow totdat de afnemer alles wat hij op grond van de overeenkomst verschuldigd is volledig heeft betaald.</p>

<h2>Artikel 8 – Controle en klachten</h2>
<ol>
<li>De afnemer controleert de producten direct na ontvangst. Zichtbare gebreken, beschadigingen of afwijkingen meldt de afnemer binnen ${K.complaintHours} uur na levering, bij voorkeur met foto’s, via ${contactLine(site)}.</li>
<li>Andere gebreken meldt de afnemer binnen ${K.complaintHours} uur nadat hij ze heeft ontdekt of redelijkerwijs had kunnen ontdekken.</li>
<li>Een klacht schort de betalingsverplichting niet op.</li>
</ol>

<h2>Artikel 9 – Garantie en gebruik</h2>
<ol>
<li>Op producten geldt de garantie van de fabrikant, volgens de voorwaarden van de fabrikant. EnviroFlow helpt u bij het indienen van een garantieclaim.</li>
<li>De afnemer gebruikt de producten volgens de gebruiksaanwijzing en de specificaties van de fabrikant, waaronder de opgegeven chemische bestendigheid. De afnemer blijft zelf verantwoordelijk voor de keuze van een product voor een bepaalde vloeistof of toepassing; bij twijfel adviseren wij u graag vooraf.</li>
<li>De garantie vervalt bij onjuist gebruik, onjuiste opslag, eigen reparaties of gebruik buiten de specificaties.</li>
</ol>

<h2>Artikel 10 – Aansprakelijkheid</h2>
<ol>
<li>De aansprakelijkheid van EnviroFlow is beperkt tot vergoeding van directe schade, tot ten hoogste het factuurbedrag (exclusief btw) van de betreffende bestelling.</li>
<li>EnviroFlow is niet aansprakelijk voor indirecte schade, zoals gevolgschade, gederfde winst, milieuschade door gebruik buiten de specificaties en schade door bedrijfsstilstand.</li>
<li>Deze beperkingen gelden niet bij opzet of bewuste roekeloosheid van EnviroFlow.</li>
</ol>

<h2>Artikel 11 – Overmacht</h2>
<p>Bij overmacht, zoals vertraging bij de fabrikant of vervoerder, extreme weersomstandigheden of overheidsmaatregelen, mag EnviroFlow de levering opschorten. Duurt de overmacht langer dan ${K.forceMajeureDays} dagen, dan mogen beide partijen de overeenkomst voor het nog niet geleverde deel ontbinden, zonder schadevergoeding.</p>

<h2>Artikel 12 – Retourneren</h2>
<p>Voor zakelijke afnemers geldt geen wettelijk herroepingsrecht. Retourneren is mogelijk onder de voorwaarden in ons <a href="/retourneren/">retourbeleid</a>.</p>

<h2>Artikel 13 – Toepasselijk recht en geschillen</h2>
<ol>
<li>Op alle overeenkomsten is Nederlands recht van toepassing. Het Weens Koopverdrag (CISG) is uitgesloten.</li>
<li>Geschillen worden voorgelegd aan de bevoegde rechter van de ${esc(K.court)}, tenzij de wet anders voorschrijft.</li>
</ol>`;

  const privacy = `${updated}
<p>EnviroFlow gaat zorgvuldig om met uw persoonsgegevens. In dit privacybeleid leest u welke gegevens wij verwerken, waarom, en welke rechten u heeft.</p>

<h2>Wie is verantwoordelijk?</h2>
<p>${company(site)}. Vragen over privacy stelt u via ${contactLine(site)}.</p>

<h2>Welke gegevens verwerken wij?</h2>
<ul>
<li><strong>Contactformulier:</strong> naam, bedrijfsnaam, e-mailadres, telefoonnummer en uw bericht.</li>
<li><strong>Offerte- en maatwerkaanvragen:</strong> dezelfde contactgegevens, plus de gegevens over uw toepassing die u invult (zoals product, aantal, vloeistof, locatie en gewenste leverdatum) en bijlagen die u meestuurt.</li>
<li><strong>Bestellingen:</strong> bedrijfsnaam, btw-nummer, naam, e-mailadres, telefoonnummer, aflever- en factuuradres, uw referentie en opmerkingen, de bestelde producten en de betaalstatus.</li>
<li><strong>Betalingen:</strong> betalingen lopen via Mollie. Wij ontvangen geen bank- of creditcardgegevens, alleen de status van de betaling.</li>
</ul>

<h2>Waarvoor gebruiken wij uw gegevens?</h2>
<ul>
<li>Om uw vraag of aanvraag te beantwoorden en een offerte te maken (op uw verzoek, voorafgaand aan een overeenkomst).</li>
<li>Om uw bestelling uit te voeren, te leveren en te factureren (uitvoering van de overeenkomst).</li>
<li>Om te voldoen aan wettelijke verplichtingen, zoals de fiscale bewaarplicht.</li>
<li>Om de website veilig en goed werkend te houden (gerechtvaardigd belang).</li>
</ul>
<p>Wij gebruiken uw gegevens niet voor nieuwsbrieven of advertenties en verkopen ze niet aan derden.</p>

<h2>Met wie delen wij gegevens?</h2>
<p>Wij werken met dienstverleners die gegevens alleen in onze opdracht verwerken:</p>
<ul>
<li><strong>Cloudflare</strong> – hosting van de website en opslag van aanvragen en bestellingen.</li>
<li><strong>Resend</strong> – verzending van e-mails over aanvragen en bestellingen.</li>
<li><strong>Mollie</strong> – afhandeling van online betalingen.</li>
<li><strong>Microsoft</strong> – onze zakelijke e-mail.</li>
</ul>
<p>Voor de levering delen wij de noodzakelijke gegevens (naam, adres, telefoonnummer) met de vervoerder of leverancier. Sommige dienstverleners zijn gevestigd buiten de Europese Economische Ruimte. In dat geval gebeurt de doorgifte op basis van de waarborgen die de AVG voorschrijft, zoals het EU-VS Data Privacy Framework of standaardcontractbepalingen van de Europese Commissie.</p>

<h2>Hoe lang bewaren wij gegevens?</h2>
<ul>
<li>Contactberichten en aanvragen bewaren wij zolang dat nodig is om uw vraag af te handelen en eventuele vervolgvragen te beantwoorden. Daarna verwijderen wij ze.</li>
<li>Gegevens van bestellingen en facturen bewaren wij zolang de wet dat verplicht; voor de fiscale bewaarplicht is dat 7 jaar.</li>
</ul>

<h2>Cookies</h2>
<p>Deze website plaatst geen tracking- of advertentiecookies. Zie ons <a href="/cookiebeleid/">cookiebeleid</a>.</p>

<h2>Beveiliging</h2>
<p>De website gebruikt een beveiligde verbinding (https). Alleen medewerkers van EnviroFlow die de gegevens nodig hebben, hebben er toegang toe.</p>

<h2>Uw rechten</h2>
<p>U heeft het recht om uw gegevens in te zien, te laten corrigeren of verwijderen, de verwerking te laten beperken, bezwaar te maken en uw gegevens over te laten dragen. Stuur uw verzoek naar ${contactLine(site)}. Wij reageren binnen één maand. Bent u niet tevreden over hoe wij met uw gegevens omgaan, dan kunt u een klacht indienen bij de <a href="https://autoriteitpersoonsgegevens.nl" rel="noopener">Autoriteit Persoonsgegevens</a>.</p>

<h2>Wijzigingen</h2>
<p>Wij kunnen dit privacybeleid aanpassen. De datum bovenaan laat zien wanneer het voor het laatst is bijgewerkt.</p>`;

  const retour = `${updated}
<p>Niet tevreden of iets verkeerd besteld? Neem contact met ons op, dan zoeken we samen naar een oplossing.</p>

<h2>Voor wie geldt dit?</h2>
<p>Onze webshop is bedoeld voor zakelijke afnemers. Voor zakelijke aankopen geldt geen wettelijk herroepingsrecht. Retourneren is wel mogelijk onder de voorwaarden hieronder.</p>

<h2>Voorwaarden</h2>
<ul>
<li>U meldt de retour binnen ${K.returnNoticeWorkdays} werkdagen na levering aan via ${contactLine(site)}, met uw ordernummer.</li>
<li>Het product is ongebruikt, onbeschadigd, niet in contact geweest met vloeistoffen en zit in de originele verpakking.</li>
<li>Na ons akkoord stuurt u het product binnen ${K.returnShipDays} dagen terug. Retour sturen zonder akkoord is niet mogelijk.</li>
<li>De kosten en het risico van het terugsturen zijn voor u, tenzij het product beschadigd of verkeerd geleverd is.</li>
</ul>

<h2>Uitgesloten van retour</h2>
<ul>
<li>Maatwerk en producten die speciaal voor u zijn besteld of aangepast.</li>
<li>Producten die zijn gebruikt of in contact zijn geweest met vloeistoffen, chemicaliën of mest.</li>
</ul>

<h2>Terugbetaling</h2>
<p>Na ontvangst en controle van het product betalen wij het aankoopbedrag terug op de manier waarop u heeft betaald, binnen ${K.refundDays} dagen na ontvangst van de retour.</p>

<h2>Beschadigd of verkeerd geleverd?</h2>
<p>Meld dit binnen ${K.complaintHours} uur na levering, bij voorkeur met foto’s. Dan lossen wij het kosteloos voor u op met herstel, vervanging of terugbetaling.</p>`;

  const cookies = `${updated}
<p>Deze website gebruikt geen tracking- of advertentiecookies en geen statistiekendienst. Wij slaan alleen gegevens in uw browser op die nodig zijn om de website te laten werken:</p>
<ul>
<li><strong>Winkelwagen</strong> (<code>ef-cart</code>): de producten in uw winkelwagen.</li>
<li><strong>Prijsweergave</strong> (<code>ef-vat</code>): of u prijzen inclusief of exclusief btw wilt zien.</li>
<li><strong>Cookiekeuze</strong> (<code>ef-consent</code>): uw keuze in de cookiemelding.</li>
<li><strong>Keuzehulp</strong> (<code>ef-keuzehulp</code>): uw antwoorden in de keuzehulp, alleen zolang het tabblad open is.</li>
</ul>
<p>Deze gegevens blijven op uw eigen apparaat en worden niet met ons of met anderen gedeeld. U kunt ze verwijderen via de instellingen van uw browser. Gaan wij in de toekomst statistieken gebruiken, dan doen wij dat alleen met uw toestemming en passen wij dit beleid aan.</p>`;

  return {
    'algemene-voorwaarden': voorwaarden,
    privacybeleid: privacy,
    retourneren: retour,
    cookiebeleid: cookies
  };
}
