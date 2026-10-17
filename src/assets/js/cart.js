/* Winkelwagen, checkout en bestelstatus. Prijzen komen uit catalog.json en worden server-side opnieuw berekend. */
(function () {
  'use strict';
  var EF = window.EF; var esc = EF.esc;
  var rate = EF.vatRate || 0.21;
  var L = EF.L, U = EF.url;
  var VAT = L('btw', 'VAT');

  function lines(catalog) {
    return EF.cart.items().filter(function (i) { return catalog[i.id]; }).map(function (i) {
      var p = catalog[i.id];
      return { id: i.id, qty: i.qty, name: p.name, url: p.url, price: p.price, placeholder: p.pricePlaceholder, image: p.image };
    });
  }
  function totals(ls) {
    var hasPlaceholder = ls.some(function (l) { return l.price == null; });
    var sub = ls.reduce(function (s, l) { return s + (l.price || 0) * l.qty; }, 0);
    var ship = typeof EF.shipping === 'number' ? EF.shipping : null;
    var base = sub + (ship || 0);
    return { hasPlaceholder: hasPlaceholder, sub: sub, ship: ship, vat: base * rate, total: base * (1 + rate) };
  }
  var ph = function (v) { return '<mark class="placeholder">' + esc(v || L('[PRIJS]', '[PRICE]')) + '</mark>'; };
  var money = function (n, l) { return l && l.price == null ? '€ ' + ph(l.placeholder) : EF.fmt(n); };
  function unitPrice(l) {
    if (l.price == null) return '€ ' + ph(l.placeholder);
    return EF.fmt(EF.vatMode() === 'incl' ? l.price * (1 + rate) : l.price) + ' <span class="small muted">' + (EF.vatMode() === 'incl' ? 'incl.' : 'excl.') + ' ' + VAT + '</span>';
  }
  function totalsHtml(t) {
    if (t.hasPlaceholder) {
      return '<div class="totals"><div><span>' + L('Subtotaal excl. btw', 'Subtotal excl. VAT') + '</span><span>€ ' + ph() + '</span></div><div><span>' + L('Verzendkosten', 'Shipping costs') + '</span><span>' + (t.ship != null ? EF.fmt(t.ship) : L('Na bestelling berekend', 'Calculated after ordering')) + '</span></div><div class="total"><span>' + L('Totaal incl. btw', 'Total incl. VAT') + '</span><span>€ ' + ph() + '</span></div></div>' +
        '<p class="small" role="note">' + L('Een of meer producten hebben nog geen prijs. Online afrekenen is daarom nog niet mogelijk. Vraag een offerte aan.', 'One or more products do not have a price yet, so online checkout is not possible. Please request a quote.') + '</p>';
    }
    return '<div class="totals"><div><span>' + L('Subtotaal excl. btw', 'Subtotal excl. VAT') + '</span><span>' + EF.fmt(t.sub) + '</span></div>' +
      '<div><span>' + L('Verzendkosten', 'Shipping costs') + '</span><span>' + (t.ship != null ? EF.fmt(t.ship) : L('Na bestelling berekend', 'Calculated after ordering')) + '</span></div>' +
      '<div><span>' + L('Btw', 'VAT') + ' (' + Math.round(rate * 100) + '%)</span><span>' + EF.fmt(t.vat) + '</span></div>' +
      '<div class="total"><span>' + L('Totaal incl. btw', 'Total incl. VAT') + '</span><span>' + EF.fmt(t.total) + '</span></div></div>';
  }
  // Productfoto (WebP, met JPG als terugval); zonder foto een neutraal vlak.
  var rel = function (u) { return window.EF_REL ? window.EF_REL(u) : u; };
  var phMedia = function (l, ratio) {
    var img = l.image || {}; ratio = ratio || '1-1';
    if (img.src) {
      var webp = img.src.replace(/\.(jpe?g|png)$/i, '.webp');
      return '<div class="media r-' + ratio + ' media--product"><img src="' + rel(webp) + '" alt="' + esc(img.alt || l.name) + '" width="160" height="160" loading="lazy" decoding="async" onerror="this.onerror=null;this.src=\'' + rel(img.src) + '\'"></div>';
    }
    return '<div class="media media--ph r-' + ratio + '" role="img" aria-label="' + esc(l.name) + '"><span><svg class="ic" aria-hidden="true"><use href="#i-grid"/></svg></span></div>';
  };

  /* ---------- winkelwagenpagina ---------- */
  var cartPage = document.querySelector('[data-cart-page]');
  if (cartPage) {
    var itemsEl = cartPage.querySelector('[data-cart-items]');
    var sumEl = cartPage.querySelector('[data-cart-summary]');
    var checkoutLink = cartPage.querySelector('[data-checkout-link]');
    var render = function () {
      EF.catalog().then(function (cat) {
        var ls = lines(cat);
        if (!ls.length) {
          itemsEl.innerHTML = '<div class="cart-empty"><h2>' + L('Uw winkelwagen is leeg', 'Your shopping cart is empty') + '</h2><p>' + L('Bekijk onze producten of vraag direct een offerte aan.', 'View our products or request a quote straight away.') + '</p><div class="btn-row" style="justify-content:center"><a class="btn btn--primary" href="' + U('/producten/') + '">' + L('Bekijk producten', 'View products') + '</a><a class="btn btn--ghost" href="' + U('/offerte-aanvragen/') + '">' + L('Offerte aanvragen', 'Request a quote') + '</a></div></div>';
          sumEl.innerHTML = totalsHtml(totals([]));
          checkoutLink.setAttribute('aria-disabled', 'true'); checkoutLink.classList.add('is-disabled'); checkoutLink.removeAttribute('href');
          return;
        }
        itemsEl.innerHTML = '<h2 class="sr-only">' + L('Producten in uw winkelwagen', 'Products in your shopping cart') + '</h2><ul class="cart-lines" style="list-style:none;padding:0;margin:0">' + ls.map(function (l) {
          return '<li class="cart-line"><a class="cart-line__media" href="' + l.url + '" tabindex="-1" aria-hidden="true">' + phMedia(l) + '</a><div>' +
            '<a class="cart-line__name" href="' + l.url + '">' + esc(l.name) + '</a><div class="small muted">' + L('Prijs per stuk', 'Unit price') + ': ' + unitPrice(l) + '</div>' +
            '<div class="cart-line__row"><div class="qty qty--sm"><button type="button" data-step="-1" data-id="' + esc(l.id) + '" aria-label="' + L('Aantal ' + esc(l.name) + ' verlagen', 'Decrease quantity of ' + esc(l.name)) + '">−</button>' +
            '<input type="number" min="1" max="999" value="' + l.qty + '" data-qty="' + esc(l.id) + '" aria-label="' + L('Aantal', 'Quantity') + ' ' + esc(l.name) + '" inputmode="numeric">' +
            '<button type="button" data-step="1" data-id="' + esc(l.id) + '" aria-label="' + L('Aantal ' + esc(l.name) + ' verhogen', 'Increase quantity of ' + esc(l.name)) + '">+</button></div>' +
            '<strong>' + (l.price == null ? '€ ' + ph(l.placeholder) : EF.fmt(l.price * l.qty) + ' <span class="small muted">excl. ' + VAT + '</span>') + '</strong>' +
            '<button type="button" class="cart-line__remove" data-remove="' + esc(l.id) + '">' + L('Verwijderen', 'Remove') + '<span class="sr-only"> ' + esc(l.name) + '</span></button></div></div></li>';
        }).join('') + '</ul>';
        var t = totals(ls);
        sumEl.innerHTML = totalsHtml(t);
        if (t.hasPlaceholder) { checkoutLink.setAttribute('aria-disabled', 'true'); checkoutLink.removeAttribute('href'); }
        else { checkoutLink.removeAttribute('aria-disabled'); checkoutLink.setAttribute('href', U('/afrekenen/')); }
      });
    };
    cartPage.addEventListener('click', function (e) {
      var s = e.target.closest('[data-step]'); var r = e.target.closest('[data-remove]');
      if (s) { var id = s.getAttribute('data-id'); var cur = EF.cart.items().find(function (i) { return i.id === id; }); if (cur) { var n = cur.qty + parseInt(s.getAttribute('data-step'), 10); if (n < 1) return; EF.cart.set(id, n); } }
      if (r) { EF.cart.remove(r.getAttribute('data-remove')); EF.toast('<span>' + L('Product verwijderd uit uw winkelwagen.', 'Product removed from your shopping cart.') + '</span>'); }
    });
    cartPage.addEventListener('change', function (e) { var q = e.target.closest('[data-qty]'); if (q) EF.cart.set(q.getAttribute('data-qty'), q.value); });
    document.addEventListener('ef:cart', render);
    document.addEventListener('ef:vat', render);
    render();
  }

  /* ---------- checkout ---------- */
  var co = document.querySelector('[data-checkout-form]');
  if (co) {
    // Apple Pay alleen tonen op apparaten die het ondersteunen (Safari op iPhone, iPad of Mac).
    try {
      if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) co.querySelectorAll('[data-apple-only]').forEach(function (el) { el.hidden = false; });
    } catch (e) { /* geen Apple Pay */ }
    var sumBox = document.querySelector('[data-checkout-summary]');
    var submit = co.querySelector('[data-submit]');
    var status = co.querySelector('.form-status');
    var same = co.querySelector('[data-billing-same]');
    var billing = co.querySelector('[data-billing-fields]');
    var syncBilling = function () {
      billing.hidden = same.checked;
      billing.querySelectorAll('input:not([type=hidden]), select').forEach(function (el) {
        if (/billing_(street|postcode|city)/.test(el.name)) { el.required = !same.checked; el.setAttribute('aria-required', String(!same.checked)); }
      });
    };
    same.addEventListener('change', syncBilling); syncBilling();

    EF.catalog().then(function (cat) {
      var ls = lines(cat); var t = totals(ls);
      if (!ls.length) {
        sumBox.innerHTML = '<p>' + L('Uw winkelwagen is leeg.', 'Your shopping cart is empty.') + '</p><a class="btn btn--primary" href="' + U('/producten/') + '">' + L('Bekijk producten', 'View products') + '</a>';
        submit.disabled = true; return;
      }
      sumBox.innerHTML = ls.map(function (l) { return '<div class="mini-line"><span class="mini-line__media">' + phMedia(l) + '</span><span class="mini-line__name">' + l.qty + ' × ' + esc(l.name) + '</span><span>' + (l.price == null ? '€ ' + ph(l.placeholder) : EF.fmt(l.price * l.qty)) + '</span></div>'; }).join('') + totalsHtml(t);
      if (t.hasPlaceholder) {
        submit.disabled = true;
        status.hidden = false; status.className = 'form-status err';
        status.innerHTML = L('Een of meer producten hebben nog geen prijs.', 'One or more products do not have a price yet.') + ' <a href="' + U('/offerte-aanvragen/') + '?bron=winkelwagen">' + L('Vraag een offerte aan', 'Request a quote') + '</a>.';
      }
    });

    co.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!EF.validate(co)) return;
      var data = {}; new FormData(co).forEach(function (v, k) { data[k] = v; });
      data.items = EF.cart.items();
      submit.disabled = true; submit.textContent = L('Bezig met verwerken…', 'Processing…');
      fetch(co.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j.checkoutUrl) { window.location.href = res.j.checkoutUrl; return; }
          if (res.ok) {
            EF.cart.clear();
            co.innerHTML = '<div class="form-status ok" role="status"><p><strong>' + L('Bedankt voor uw bestelling', 'Thank you for your order') + ' (' + esc(res.j.orderId) + ').</strong></p><p>' + esc(res.j.message || L('Wij nemen zo snel mogelijk contact met u op.', 'We will contact you as soon as possible.')) + '</p></div>';
            return;
          }
          throw new Error(res.j.error || L('Er ging iets mis.', 'Something went wrong.'));
        })
        .catch(function (err) {
          status.hidden = false; status.className = 'form-status err';
          status.textContent = (err && err.message ? err.message : L('Er ging iets mis.', 'Something went wrong.')) + L(' Probeer het opnieuw of bel ', ' Please try again or call ') + EF.phone.display + '.';
          submit.disabled = false; submit.textContent = L('Bestelling plaatsen en betalen', 'Place order and pay');
        });
    });
  }

  /* ---------- bestelstatus na betaling ---------- */
  var os = document.querySelector('[data-order-status]');
  if (os) {
    var msg = os.querySelector('[data-order-message]');
    var id = new URLSearchParams(location.search).get('id');
    if (!id) { msg.textContent = L('Geen bestelling gevonden.', 'No order found.'); return; }
    fetch('/api/order-status?id=' + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (j) {
      if (j.status === 'paid') { EF.cart.clear(); msg.innerHTML = L('<strong>Bedankt! Uw betaling is ontvangen.</strong> Uw ordernummer is ' + esc(j.orderId) + '. Wij nemen zo snel mogelijk contact met u op over de levering.', '<strong>Thank you! Your payment has been received.</strong> Your order number is ' + esc(j.orderId) + '. We will contact you about the delivery as soon as possible.'); }
      else if (j.status === 'open' || j.status === 'pending' || j.status === 'created') msg.textContent = L('Uw betaling wordt nog verwerkt. U ontvangt bericht zodra de betaling is bevestigd.', 'Your payment is still being processed. You will be notified as soon as the payment is confirmed.');
      else msg.innerHTML = L('De betaling is niet gelukt of geannuleerd.', 'The payment failed or was cancelled.') + ' <a href="' + U('/afrekenen/') + '">' + L('Probeer het opnieuw', 'Try again') + '</a> ' + L('of neem contact met ons op.', 'or contact us.');
    }).catch(function () { msg.textContent = L('De status kon niet worden opgehaald. Neem contact met ons op.', 'The status could not be retrieved. Please contact us.'); });
  }
})();
