// Engelse vertaling van de juridische pagina's (zelfde inhoud en keuzes als src/content/nl/legal.mjs).
// Bij verschil tussen de Nederlandse en de Engelse tekst geldt de Nederlandse tekst.

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const COURT_EN = { 'Rechtbank Rotterdam': 'District Court of Rotterdam (Rechtbank Rotterdam)' };

function company(site) {
  const a = site.address;
  return `${esc(site.name)}, ${esc(a.street)}, ${esc(a.postalCode)} ${esc(a.city)}, the Netherlands, registered with the Dutch Chamber of Commerce (KvK) under number ${esc(site.kvk)}, VAT number ${esc(site.vatNumber)}`;
}
const contactLine = (site) => `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or ${esc(site.phonePrimary.display)}`;

export function legalPagesEn(site, K) {
  const updated = `<p class="small muted">Last updated: ${K.updatedEn}</p>
<div class="notice" role="note"><p>This is an English translation for your convenience. In the event of any difference, the <a href="__NL__" data-keep-href>Dutch version</a> prevails.</p></div>`;
  const withNl = (html, slug) => html.replace('__NL__', `/${slug}/`);

  const terms = `${updated}
<h2>Article 1 – Definitions</h2>
<ol>
<li><strong>EnviroFlow</strong>: ${company(site)}.</li>
<li><strong>Customer</strong>: the business or organisation that enters into an agreement with EnviroFlow or is negotiating one.</li>
<li><strong>Agreement</strong>: any arrangement between EnviroFlow and the customer for the supply of products or services, including an order via the web shop.</li>
</ol>

<h2>Article 2 – Applicability</h2>
<ol>
<li>These terms apply to all quotations, orders and agreements of EnviroFlow.</li>
<li>The web shop is intended for business customers. If you are ordering as a private individual, please contact us first; additional statutory rights apply to consumers.</li>
<li>The customer’s general terms and conditions do not apply unless EnviroFlow has accepted them in writing.</li>
<li>Deviations from these terms only apply if agreed in writing.</li>
</ol>

<h2>Article 3 – Quotations and formation of the agreement</h2>
<ol>
<li>Quotations are non-binding and valid for ${K.offerValidDays} days, unless the quotation states otherwise.</li>
<li>An agreement is formed when EnviroFlow confirms an order in writing, or when an order has been placed and paid for via the web shop.</li>
<li>Obvious mistakes or errors in prices, images or product information do not bind EnviroFlow.</li>
<li>Product information is based on the manufacturer’s data. Images may differ from the product supplied.</li>
</ol>

<h2>Article 4 – Prices</h2>
<ol>
<li>All prices are in euros and exclude VAT, unless stated otherwise.</li>
<li>Shipping costs are stated separately. Where the website states that shipping costs are calculated after ordering, you will be informed of them in advance.</li>
<li>Custom products and products with “price on request” are supplied at the price stated in the quotation.</li>
</ol>

<h2>Article 5 – Payment</h2>
<ol>
<li>Orders via the web shop are paid in advance using the payment methods offered (processed by our payment provider Mollie).</li>
<li>For payment on invoice, a payment term of ${K.paymentTermDays} days from the invoice date applies, unless agreed otherwise.</li>
<li>In the event of late payment, the customer owes the statutory commercial interest without notice of default, and reasonable collection costs are for the customer’s account.</li>
</ol>

<h2>Article 6 – Delivery</h2>
<ol>
<li>Stated delivery times are indicative and not strict deadlines. If they are exceeded, we will contact you.</li>
<li>Delivery takes place at the delivery address you provide. The risk of the products passes to the customer at the moment of delivery.</li>
<li>EnviroFlow may deliver an order in parts.</li>
</ol>

<h2>Article 7 – Retention of title</h2>
<p>Products supplied remain the property of EnviroFlow until the customer has paid in full everything owed under the agreement.</p>

<h2>Article 8 – Inspection and complaints</h2>
<ol>
<li>The customer inspects the products immediately upon receipt. The customer reports visible defects, damage or deviations within ${K.complaintHours} hours of delivery, preferably with photos, via ${contactLine(site)}.</li>
<li>The customer reports other defects within ${K.complaintHours} hours of discovering them or of the moment they could reasonably have been discovered.</li>
<li>A complaint does not suspend the payment obligation.</li>
</ol>

<h2>Article 9 – Warranty and use</h2>
<ol>
<li>Products are covered by the manufacturer’s warranty, in accordance with the manufacturer’s conditions. EnviroFlow will help you submit a warranty claim.</li>
<li>The customer uses the products in accordance with the manufacturer’s instructions for use and specifications, including the stated chemical resistance. The customer remains responsible for choosing a product for a particular liquid or application; if in doubt, we are happy to advise you in advance.</li>
<li>The warranty lapses in the event of incorrect use, incorrect storage, own repairs or use outside the specifications.</li>
</ol>

<h2>Article 10 – Liability</h2>
<ol>
<li>EnviroFlow’s liability is limited to compensation for direct damage, up to a maximum of the invoice amount (excluding VAT) of the order concerned.</li>
<li>EnviroFlow is not liable for indirect damage, such as consequential damage, lost profits, environmental damage caused by use outside the specifications and damage due to business interruption.</li>
<li>These limitations do not apply in the event of intent or deliberate recklessness on the part of EnviroFlow.</li>
</ol>

<h2>Article 11 – Force majeure</h2>
<p>In the event of force majeure, such as delays at the manufacturer or carrier, extreme weather conditions or government measures, EnviroFlow may suspend delivery. If the force majeure lasts longer than ${K.forceMajeureDays} days, either party may terminate the agreement for the part not yet delivered, without compensation.</p>

<h2>Article 12 – Returns</h2>
<p>There is no statutory right of withdrawal for business customers. Returns are possible under the conditions in our <a href="/retourneren/">returns policy</a>.</p>

<h2>Article 13 – Applicable law and disputes</h2>
<ol>
<li>All agreements are governed by Dutch law. The United Nations Convention on Contracts for the International Sale of Goods (CISG) is excluded.</li>
<li>Disputes are submitted to the competent court of the ${esc(COURT_EN[K.court] || K.court)}, unless the law prescribes otherwise.</li>
</ol>`;

  const privacy = `${updated}
<p>EnviroFlow handles your personal data with care. In this privacy policy you can read which data we process, why, and what rights you have.</p>

<h2>Who is responsible?</h2>
<p>${company(site)}. Questions about privacy can be sent via ${contactLine(site)}.</p>

<h2>Which data do we process?</h2>
<ul>
<li><strong>Contact form:</strong> name, company name, email address, phone number and your message.</li>
<li><strong>Quote and custom requests:</strong> the same contact details, plus the details of your application that you fill in (such as product, quantity, liquid, location and preferred delivery date) and any attachments you send.</li>
<li><strong>Orders:</strong> company name, VAT number, name, email address, phone number, delivery and billing address, your reference and remarks, the products ordered and the payment status.</li>
<li><strong>Payments:</strong> payments are processed by Mollie. We do not receive any bank or credit card details, only the status of the payment.</li>
</ul>

<h2>What do we use your data for?</h2>
<ul>
<li>To answer your question or request and prepare a quotation (at your request, prior to an agreement).</li>
<li>To process, deliver and invoice your order (performance of the agreement).</li>
<li>To comply with legal obligations, such as the statutory tax retention obligation.</li>
<li>To keep the website secure and working properly (legitimate interest).</li>
</ul>
<p>We do not use your data for newsletters or advertising and do not sell it to third parties.</p>

<h2>With whom do we share data?</h2>
<p>We work with service providers that only process data on our behalf:</p>
<ul>
<li><strong>Cloudflare</strong> – hosting of the website and storage of requests and orders.</li>
<li><strong>Resend</strong> – sending emails about requests and orders.</li>
<li><strong>Mollie</strong> – processing of online payments.</li>
<li><strong>Microsoft</strong> – our business email.</li>
</ul>
<p>For delivery, we share the necessary details (name, address, phone number) with the carrier or supplier. Some service providers are established outside the European Economic Area. In that case, the transfer takes place on the basis of the safeguards prescribed by the GDPR, such as the EU-US Data Privacy Framework or standard contractual clauses of the European Commission.</p>

<h2>How long do we keep data?</h2>
<ul>
<li>We keep contact messages and requests for as long as necessary to handle your question and answer any follow-up questions. After that, we delete them.</li>
<li>We keep order and invoice data for as long as the law requires; for the statutory tax retention obligation this is 7 years.</li>
</ul>

<h2>Cookies</h2>
<p>This website does not place tracking or advertising cookies. See our <a href="/cookiebeleid/">cookie policy</a>.</p>

<h2>Security</h2>
<p>The website uses a secure connection (https). Only EnviroFlow staff who need the data have access to it.</p>

<h2>Your rights</h2>
<p>You have the right to access your data, have it corrected or deleted, have its processing restricted, object, and have your data transferred. Send your request to ${contactLine(site)}. We will respond within one month. If you are not satisfied with how we handle your data, you can file a complaint with the Dutch Data Protection Authority (<a href="https://autoriteitpersoonsgegevens.nl" rel="noopener">Autoriteit Persoonsgegevens</a>).</p>

<h2>Changes</h2>
<p>We may amend this privacy policy. The date at the top shows when it was last updated.</p>`;

  const returns = `${updated}
<p>Not satisfied or ordered the wrong item? Contact us and we will find a solution together.</p>

<h2>Who does this apply to?</h2>
<p>Our web shop is intended for business customers. There is no statutory right of withdrawal for business purchases. Returns are possible, however, under the conditions below.</p>

<h2>Conditions</h2>
<ul>
<li>You register the return within ${K.returnNoticeWorkdays} working days of delivery via ${contactLine(site)}, stating your order number.</li>
<li>The product is unused, undamaged, has not been in contact with liquids and is in its original packaging.</li>
<li>After our approval, you send the product back within ${K.returnShipDays} days. Returning without approval is not possible.</li>
<li>The costs and risk of returning are for your account, unless the product was damaged or delivered incorrectly.</li>
</ul>

<h2>Excluded from returns</h2>
<ul>
<li>Custom products and products ordered or modified specifically for you.</li>
<li>Products that have been used or have been in contact with liquids, chemicals or manure.</li>
</ul>

<h2>Refund</h2>
<p>After receiving and inspecting the product, we refund the purchase amount using the method you paid with, within ${K.refundDays} days of receiving the return.</p>

<h2>Damaged or delivered incorrectly?</h2>
<p>Report this within ${K.complaintHours} hours of delivery, preferably with photos. We will then resolve it free of charge by repair, replacement or refund.</p>`;

  const cookies = `${updated}
<p>This website does not use tracking or advertising cookies, nor any analytics service. We only store data in your browser that is needed for the website to work:</p>
<ul>
<li><strong>Shopping cart</strong> (<code>ef-cart</code>): the products in your shopping cart.</li>
<li><strong>Price display</strong> (<code>ef-vat</code>): whether you want to see prices including or excluding VAT.</li>
<li><strong>Cookie choice</strong> (<code>ef-consent</code>): your choice in the cookie notice.</li>
<li><strong>Selection guide</strong> (<code>ef-keuzehulp</code>): your answers in the selection guide, only while the tab is open.</li>
</ul>
<p>This data stays on your own device and is not shared with us or with others. You can delete it via your browser settings. If we start using analytics in the future, we will only do so with your consent and will update this policy.</p>`;

  const flat = site.shipping?.flatRate;
  const delivery = `${updated}
<h2>Where do we deliver?</h2>
<p>We deliver in ${esc(site.serviceArea)}, to the delivery address you provide with your order. The billing address may differ from it.</p>

<h2>Shipping costs</h2>
${typeof flat === 'number'
    ? `<p>Shipping costs are € ${flat.toFixed(2)} excl. VAT per order. You will see them in your shopping cart before you pay.</p>`
    : `<p>Shipping costs depend on the product, the size and the delivery address. They are therefore not included in the total amount in the web shop. After your order, we will contact you about the shipping costs and delivery.</p>`}

<h2>Delivery time</h2>
<p>The delivery time is on request, unless a delivery time is stated with the product. Stated delivery times are indicative. Do you need a product by a certain date? Mention this with your order or <a href="/contact/">contact us</a> and we will see what is possible.</p>

<h2>On receipt</h2>
<p>Check the delivery immediately upon receipt. Is anything damaged or delivered incorrectly? Report this within ${K.complaintHours} hours via ${contactLine(site)}, preferably with photos and your order number.</p>

<h2>Large or custom products</h2>
<p>For large tanks, flood barriers and custom products, we always agree on the delivery with you in advance. You order these products via a <a href="/offerte-aanvragen/">quote request</a>.</p>

<h2>Returns</h2>
<p>Want to send something back? Read our <a href="/retourneren/">returns policy</a>.</p>`;

  return {
    pages: [
      { slug: 'levering-en-verzending', title: 'Delivery & shipping', html: withNl(delivery, 'levering-en-verzending') },
      { slug: 'retourneren', title: 'Returns', html: withNl(returns, 'retourneren') },
      { slug: 'algemene-voorwaarden', title: 'General terms and conditions', html: withNl(terms, 'algemene-voorwaarden') },
      { slug: 'privacybeleid', title: 'Privacy policy', html: withNl(privacy, 'privacybeleid') },
      { slug: 'cookiebeleid', title: 'Cookie policy', html: withNl(cookies, 'cookiebeleid') }
    ]
  };
}
