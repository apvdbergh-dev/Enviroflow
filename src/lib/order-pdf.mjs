// Orderbevestiging als PDF, zonder externe bibliotheken (werkt op Cloudflare én in Node).
// Gebruikt de standaardfonts Helvetica/Helvetica-Bold (WinAnsi) en het logo als JPEG.
import { LOGO, WINANSI } from './pdf-assets.mjs';

const PAGE_W = 595.28, PAGE_H = 841.89, MARGIN = 50;
const DEEP = [10 / 255, 59 / 255, 44 / 255];      // #0A3B2C
const YELLOW = [242 / 255, 183 / 255, 5 / 255];   // #F2B705
const MUTED = [0.38, 0.42, 0.40];
const LINE = [0.85, 0.87, 0.86];
const SOFT = [191 / 255, 211 / 255, 203 / 255]; // #BFD3CB

// Huisstijl: groene golf met gele golf eronder (eerste pagina) en groene voetbalk. Maten in px op een A4 van 794 px breed.
const K = PAGE_W / 794;
const WAVE_YELLOW = [[794, 104], [[700, 126], [610, 126], [500, 112]], [[380, 96], [290, 74], [180, 90]], [[110, 100], [50, 110], [0, 110]]];
const WAVE_GREEN = [[794, 64], [[700, 98], [610, 108], [500, 96]], [[380, 82], [290, 64], [180, 82]], [[110, 94], [50, 106], [0, 108]]];
const WAVE_H = 150, SIDE = 66 * K, FOOT_H = 38 * K;

// Taal van de PDF volgt de taal waarin de klant bestelde (order.lang); Engels gebruikt en-IE (€1,234.56).
const LOCALE = { nl: 'nl-NL', en: 'en-IE' };
const fmtEur = (lang) => (n) => new Intl.NumberFormat(LOCALE[lang], { style: 'currency', currency: 'EUR' }).format(n);
const fmtDate = (lang) => (iso) => new Intl.DateTimeFormat(LOCALE[lang], { timeZone: 'Europe/Amsterdam', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));

/** Tekst naar WinAnsi-bytes (als latin1-string), met escapes voor PDF-strings. Onbekende tekens worden '?'. */
function encode(text) {
  let out = '';
  for (const ch of String(text ?? '')) {
    const m = WINANSI[ch.codePointAt(0)];
    const c = m ? m[0] : 63;
    out += c === 40 || c === 41 || c === 92 ? '\\' + String.fromCharCode(c) : String.fromCharCode(c);
  }
  return out;
}
function textWidth(text, size, bold = false) {
  let w = 0;
  for (const ch of String(text ?? '')) { const m = WINANSI[ch.codePointAt(0)]; w += m ? m[bold ? 2 : 1] : 556; }
  return (w * size) / 1000;
}
/** Breekt tekst af op woorden zodat elke regel binnen maxWidth past. */
function wrap(text, size, maxWidth, bold = false) {
  const words = String(text ?? '').split(/\s+/).filter(Boolean);
  const lines = []; let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, size, bold) <= maxWidth || !line) line = next;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [''];
}
const num = (n) => (Math.round(n * 100) / 100).toString();
const rgb = (c, stroke = false) => `${c.map(num).join(' ')} ${stroke ? 'RG' : 'rg'}`;

/** Bouwt de PDF en geeft hem terug als Uint8Array. `site` hoort bij de taal (voor de naam van de betaalmethode). */
export function orderPdf(order, site, lang = order.lang === 'en' ? 'en' : 'nl') {
  const T = (nl, en) => (lang === 'en' ? en : nl);
  const eur = fmtEur(lang), dateNl = fmtDate(lang);
  const title = T('Orderbevestiging', 'Order confirmation');
  const pages = []; let ops = [];
  let y = 0;
  const newPage = () => {
    const first = !ops.length && !pages.length;
    if (ops.length) pages.push(ops);
    ops = []; y = PAGE_H - MARGIN;
    if (!first) { text(`${title} ${order.id} (${T('vervolg', 'continued')})`, MARGIN, y - 8, { size: 9, bold: true, color: MUTED }); y -= 28; }
  };
  const text = (s, x, yy, { size = 10, bold = false, color = [0.1, 0.1, 0.1], align = 'left' } = {}) => {
    const w = textWidth(s, size, bold);
    const tx = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
    ops.push(`BT ${rgb(color)} /${bold ? 'F2' : 'F1'} ${size} Tf ${num(tx)} ${num(yy)} Td (${encode(s)}) Tj ET`);
  };
  const rect = (x, yy, w, h, color) => ops.push(`${rgb(color)} ${num(x)} ${num(yy)} ${num(w)} ${num(h)} re f`);
  const hline = (x1, x2, yy, color = LINE, width = 0.75) => ops.push(`${rgb(color, true)} ${width} w ${num(x1)} ${num(yy)} m ${num(x2)} ${num(yy)} l S`);
  const wave = ([start, ...curves], color) => {
    const P = (x, yy) => `${num(x * K)} ${num(PAGE_H - yy * K)}`;
    ops.push(`${rgb(color)} ${P(0, 0)} m ${P(794, 0)} l ${P(...start)} l ${curves.map(([a, b2, c2]) => `${P(...a)} ${P(...b2)} ${P(...c2)} c`).join(' ')} h f`);
  };

  const right = PAGE_W - MARGIN;
  const methodLabel = site.paymentMethods.find((m) => m.id === order.paymentMethod)?.label || order.paymentMethod;
  const paid = order.status === 'paid';
  const c = order.customer, d = order.delivery, b = order.billing, t = order.totals;

  // Kolommen van de producttabel
  const colQty = MARGIN + 8, colName = MARGIN + 52, colUnit = right - 110, colTotal = right - 8;
  const nameWidth = colUnit - 70 - colName;

  const tableHeader = () => {
    rect(MARGIN, y - 22, right - MARGIN, 22, DEEP);
    const ty = y - 15;
    text(T('Aantal', 'Qty'), colQty, ty, { size: 9, bold: true, color: [1, 1, 1] });
    text('Product', colName, ty, { size: 9, bold: true, color: [1, 1, 1] });
    text(T('Prijs per stuk', 'Unit price'), colUnit, ty, { size: 9, bold: true, color: [1, 1, 1], align: 'right' });
    text(T('Totaal', 'Total'), colTotal, ty, { size: 9, bold: true, color: [1, 1, 1], align: 'right' });
    y -= 36;
  };

  // ---------- pagina 1: kop (golf met wit logo en titel) ----------
  newPage();
  wave(WAVE_YELLOW, YELLOW);
  wave(WAVE_GREEN, DEEP);
  const logoW = 180 * K, logoH = (LOGO.height / LOGO.width) * logoW;
  ops.push(`q ${num(logoW)} 0 0 ${num(logoH)} ${num(66 * K)} ${num(PAGE_H - 40 * K - logoH)} cm /Im1 Do Q`);
  text(title, right, PAGE_H - 56 * K, { size: title.length > 12 ? 16.5 : 22.5, bold: true, color: [1, 1, 1], align: 'right' });
  y = PAGE_H - WAVE_H * K - 16;

  // ---------- gegevensblokken ----------
  // Rij 1: klant en bestelling; rij 2: afleveradres en factuuradres (altijd allebei).
  const col2 = MARGIN + 260;
  const block = (title, rows, x, width) => {
    let yy = y;
    text(title, x, yy, { size: 8.5, bold: true, color: MUTED });
    yy -= 14;
    for (const r of rows.filter(Boolean)) for (const ln of wrap(r, 9.5, width)) { text(ln, x, yy, { size: 9.5 }); yy -= 13; }
    return yy;
  };
  const addr = (a) => [a.street, `${a.postcode} ${a.city}`, a.country && a.country !== 'NL' ? a.country : T('Nederland', 'The Netherlands')];
  const billing = typeof b === 'string' ? d : b; // "gelijk aan afleveradres" → het afleveradres tonen
  const yA = block(T('KLANT', 'CUSTOMER'), [c.company, c.name, c.vatNumber ? `${T('Btw', 'VAT')}: ${c.vatNumber}` : '', c.email, c.phone], MARGIN, 230);
  const yC = block(T('BESTELLING', 'ORDER'), [`${T('Ordernummer', 'Order number')}: ${order.id}`, `${T('Datum', 'Date')}: ${dateNl(order.createdAt)}`, `${T('Betaalmethode', 'Payment method')}: ${methodLabel}`, paid ? `Status: ${T('betaald', 'paid')}${order.paidNotifiedAt ? ` ${T('op', 'on')} ${dateNl(order.paidNotifiedAt)}` : ''}` : `Status: ${T('nog te betalen', 'awaiting payment')}`, c.reference ? `${T('Uw referentie', 'Your reference')}: ${c.reference}` : ''], col2, right - col2);
  y = Math.min(yA, yC) - 10;
  const yB = block(T('AFLEVERADRES', 'DELIVERY ADDRESS'), addr(d), MARGIN, 230);
  const yD = block(T('FACTUURADRES', 'BILLING ADDRESS'), addr(billing), col2, right - col2);
  y = Math.min(yB, yD) - 6;
  y -= 10;

  // ---------- producten ----------
  tableHeader();
  for (const l of order.lines) {
    const nameLines = wrap(l.name, 9.5, nameWidth);
    const rowH = nameLines.length * 13 + 8;
    if (y - rowH < MARGIN + 60) { newPage(); tableHeader(); }
    text(String(l.qty), colQty, y, { size: 9.5 });
    nameLines.forEach((ln, i) => text(ln, colName, y - i * 13, { size: 9.5 }));
    text(eur(l.unitPriceExcl), colUnit, y, { size: 9.5, align: 'right' });
    text(eur(l.totalExcl), colTotal, y, { size: 9.5, align: 'right' });
    y -= rowH - 4;
    hline(MARGIN, right, y + 6);
    y -= 8;
  }

  // ---------- totalen ----------
  if (y < MARGIN + 150) newPage();
  y -= 6;
  const labelX = right - 190;
  const totalRow = (label, value, bold = false) => { text(label, labelX, y, { size: bold ? 11 : 9.5, bold }); text(value, colTotal, y, { size: bold ? 11 : 9.5, bold, align: 'right' }); y -= bold ? 18 : 15; };
  totalRow(T('Subtotaal excl. btw', 'Subtotal excl. VAT'), eur(t.subtotalExcl));
  totalRow(T('Verzendkosten', 'Shipping costs'), t.shippingExcl == null ? T('na bestelling berekend', 'calculated after ordering') : eur(t.shippingExcl));
  totalRow(`${T('Btw', 'VAT')} (${Math.round(site.vatRate * 100)}%)`, eur(t.vat));
  hline(labelX, right, y + 9, DEEP, 1);
  y -= 4;
  totalRow(T('Totaal incl. btw', 'Total incl. VAT'), eur(t.totalIncl), true);
  y -= 18;

  // ---------- opmerkingen en toelichting ----------
  const para = (title, body) => {
    const lines = wrap(body, 9.5, right - MARGIN);
    if (y - (lines.length * 13 + 16) < MARGIN + 40) newPage();
    text(title, MARGIN, y, { size: 8.5, bold: true, color: MUTED }); y -= 14;
    for (const ln of lines) { text(ln, MARGIN, y, { size: 9.5 }); y -= 13; }
    y -= 8;
  };
  if (order.remarks) para(T('UW OPMERKINGEN', 'YOUR REMARKS'), order.remarks);
  if (t.shippingExcl == null) para(T('VERZENDKOSTEN', 'SHIPPING COSTS'), T('De verzendkosten zijn niet in dit totaal opgenomen. Wij nemen contact met u op over de verzendkosten en de levering.', 'Shipping costs are not included in this total. We will contact you about the shipping costs and delivery.'));
  para(T('LET OP', 'PLEASE NOTE'), T('Dit document is een orderbevestiging en geen factuur.', 'This document is an order confirmation, not an invoice.'));
  para(T('VRAGEN?', 'QUESTIONS?'), T(`Neem contact met ons op via ${site.email} of ${site.phonePrimary.display} en vermeld uw ordernummer ${order.id}.`, `Contact us via ${site.email} or ${site.phonePrimary.display.replace(/^0/, '+31 ')} and quote your order number ${order.id}.`));

  pages.push(ops);

  // ---------- voettekst op elke pagina ----------
  const a = site.address;
  const footRest = ` · ${a.street}, ${a.postalCode} ${a.city}${T('', ', NL')} · ${T('KvK', 'CoC')} ${site.kvk} · ${T('Btw', 'VAT')} ${site.vatNumber} · ${site.phonePrimary.display} · ${site.email}`;
  pages.forEach((p, i) => {
    ops = p;
    rect(0, 0, PAGE_W, FOOT_H, DEEP);
    const fy = FOOT_H / 2 - 2.4;
    text(site.name, SIDE, fy, { size: 6.75, bold: true, color: YELLOW });
    text(footRest, SIDE + textWidth(site.name, 6.75, true), fy, { size: 6.75, color: SOFT });
    text(`${T('Pagina', 'Page')} ${i + 1} ${T('van', 'of')} ${pages.length}`, PAGE_W - SIDE, fy, { size: 6.75, color: SOFT, align: 'right' });
  });

  return buildPdf(pages.map((p) => p.join('\n')), `${title} ${order.id}`);
}

/** Schrijft de PDF-objecten (catalogus, pagina's, fonts, logo) met een correcte xref-tabel. */
function buildPdf(contents, title) {
  const logoBin = atob(LOGO.base64);
  const objs = [];
  const add = (body) => { objs.push(body); return objs.length; };
  const catalog = add(null), pagesId = add(null);
  const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  const img = add(`<< /Type /XObject /Subtype /Image /Width ${LOGO.width} /Height ${LOGO.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBin.length} >>\nstream\n${logoBin}\nendstream`);
  const pageIds = contents.map((c) => {
    const cid = add(`<< /Length ${c.length} >>\nstream\n${c}\nendstream`);
    return add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> /XObject << /Im1 ${img} 0 R >> >> /Contents ${cid} 0 R >>`);
  });
  objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objs[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  const info = add(`<< /Title (${encode(title)}) /Producer (EnviroFlow) >>`);

  let out = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets = [];
  objs.forEach((body, i) => { offsets.push(out.length); out += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;

  const bytes = new Uint8Array(out.length);
  for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 0xff;
  return bytes;
}
