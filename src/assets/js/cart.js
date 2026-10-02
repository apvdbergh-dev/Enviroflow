/* Winkelwagen, checkout en bestelstatus. Prijzen komen uit catalog.json en worden server-side opnieuw berekend. */
(function () {
  'use strict';
  var EF = window.EF; var esc = EF.esc;
  var rate = EF.vatRate || 0.21;

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
  var ph = function (v) { return '<mark class="placeholder">' + esc(v || '[PRIJS]') + '</mark>'; };
  var money = function (n, l) { return l && l.price == null ? '€ ' + ph(l.placeholder) : EF.fmt(n); };
  function unitPrice(l) {
    if (l.price == null) return '€ ' + ph(l.placeholder);
    return EF.fmt(EF.vatMode() === 'incl' ? l.price * (1 + rate) : l.price) + ' <span class="small muted">' + (EF.vatMode() === 'incl' ? 'incl.' : 'excl.') + ' btw</span>';
  }
  function totalsHtml(t) {
    if (t.hasPlaceholder) {
      return '<div class="totals"><div><span>Subtotaal excl. btw</span><span>€ ' + ph('[PRIJS]') + '</span></div><div><span>Verzendkosten</span><span>' + (t.ship != null ? EF.fmt(t.ship) : 'Na bestelling berekend') + '</span></div><div class="total"><span>Totaal incl. btw</span><span>€ ' + ph('[PRIJS]') + '</span></div></div>' +
        '<p class="small" role="note">Een of meer producten hebben nog geen prijs. Online afrekenen is daarom nog niet mogelijk. Vraag een offerte aan.</p>';
    }
    return '<div class="totals"><div><span>Subtotaal excl. btw</span><span>' + EF.fmt(t.sub) + '</span></div>' +
      '<div><span>Verzendkosten</span><span>' + (t.ship != null ? EF.fmt(t.ship) : 'Na bestelling berekend') + '</span></div>' +
      '<div><span>Btw (' + Math.round(rate * 100) + '%)</span><span>' + EF.fmt(t.vat) + '</span></div>' +
      '<div class="total"><span>Totaal incl. btw</span><span>' + EF.fmt(t.total) + '</span></div></div>';
  }
  var phMedia = function (l) { return '<div class="media media--ph r-1-1" role="img" aria-label="' + esc(l.image && l.image.alt || l.name) + '"><span><svg class="ic" aria-hidden="true"><use href="#i-file"/></svg></span></div>'; };

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
          itemsEl.innerHTML = '<div class="cart-empty"><h2>Uw winkelwagen is leeg</h2><p>Bekijk onze producten of vraag direct een offerte aan.</p><div class="btn-row" style="justify-content:center"><a class="btn btn--primary" href="/producten/">Bekijk producten</a><a class="btn btn--ghost" href="/offerte-aanvragen/">Offerte aanvragen</a></div></div>';
          sumEl.innerHTML = totalsHtml(totals([]));
          checkoutLink.setAttribute('aria-disabled', 'true'); checkoutLink.classList.add('is-disabled'); checkoutLink.removeAttribute('href');
          return;
        }
        itemsEl.innerHTML = '<h2 class="sr-only">Producten in uw winkelwagen</h2><ul class="cart-lines" style="list-style:none;padding:0;margin:0">' + ls.map(function (l) {
          return '<li class="cart-line"><div class="cart-line__media">' + phMedia(l) + '</div><div>' +
            '<a class="cart-line__name" href="' + l.url + '">' + esc(l.name) + '</a><div class="small muted">Prijs per stuk: ' + unitPrice(l) + '</div>' +
            '<div class="cart-line__row"><div class="qty qty--sm"><button type="button" data-step="-1" data-id="' + esc(l.id) + '" aria-label="Aantal ' + esc(l.name) + ' verlagen">−</button>' +
            '<input type="number" min="1" max="999" value="' + l.qty + '" data-qty="' + esc(l.id) + '" aria-label="Aantal ' + esc(l.name) + '" inputmode="numeric">' +
            '<button type="button" data-step="1" data-id="' + esc(l.id) + '" aria-label="Aantal ' + esc(l.name) + ' verhogen">+</button></div>' +
            '<strong>' + (l.price == null ? '€ ' + ph(l.placeholder) : EF.fmt(l.price * l.qty) + ' <span class="small muted">excl. btw</span>') + '</strong>' +
            '<button type="button" class="cart-line__remove" data-remove="' + esc(l.id) + '">Verwijderen<span class="sr-only"> ' + esc(l.name) + '</span></button></div></div></li>';
        }).join('') + '</ul>';
        var t = totals(ls);
        sumEl.innerHTML = totalsHtml(t);
        if (t.hasPlaceholder) { checkoutLink.setAttribute('aria-disabled', 'true'); checkoutLink.removeAttribute('href'); }
        else { checkoutLink.removeAttribute('aria-disabled'); checkoutLink.setAttribute('href', '/afrekenen/'); }
      });
    };
    cartPage.addEventListener('click', function (e) {
      var s = e.target.closest('[data-step]'); var r = e.target.closest('[data-remove]');
      if (s) { var id = s.getAttribute('data-id'); var cur = EF.cart.items().find(function (i) { return i.id === id; }); if (cur) { var n = cur.qty + parseInt(s.getAttribute('data-step'), 10); if (n < 1) return; EF.cart.set(id, n); } }
      if (r) { EF.cart.remove(r.getAttribute('data-remove')); EF.toast('<span>Product verwijderd uit uw winkelwagen.</span>'); }
    });
    cartPage.addEventListener('change', function (e) { var q = e.target.closest('[data-qty]'); if (q) EF.cart.set(q.getAttribute('data-qty'), q.value); });
    document.addEventListener('ef:cart', render);
    document.addEventListener('ef:vat', render);
    render();
  }

  /* ---------- checkout ---------- */
  var co = document.querySelector('[data-checkout-form]');
  if (co) {
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
        sumBox.innerHTML = '<p>Uw winkelwagen is leeg.</p><a class="btn btn--primary" href="/producten/">Bekijk producten</a>';
        submit.disabled = true; return;
      }
      sumBox.innerHTML = ls.map(function (l) { return '<div class="mini-line"><span>' + l.qty + ' × ' + esc(l.name) + '</span><span>' + (l.price == null ? '€ ' + ph(l.placeholder) : EF.fmt(l.price * l.qty)) + '</span></div>'; }).join('') + totalsHtml(t);
      if (t.hasPlaceholder) {
        submit.disabled = true;
        status.hidden = false; status.className = 'form-status err';
        status.innerHTML = 'Een of meer producten hebben nog geen prijs. <a href="/offerte-aanvragen/?bron=winkelwagen">Vraag een offerte aan</a>.';
      }
    });

    co.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!EF.validate(co)) return;
      var data = {}; new FormData(co).forEach(function (v, k) { data[k] = v; });
      data.items = EF.cart.items();
      submit.disabled = true; submit.textContent = 'Bezig met verwerken…';
      fetch(co.action, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (res.ok && res.j.checkoutUrl) { window.location.href = res.j.checkoutUrl; return; }
          if (res.ok) {
            EF.cart.clear();
            co.innerHTML = '<div class="form-status ok" role="status"><p><strong>Bedankt voor uw bestelling (' + esc(res.j.orderId) + ').</strong></p><p>' + esc(res.j.message || 'Wij nemen zo snel mogelijk contact met u op.') + '</p></div>';
            return;
          }
          throw new Error(res.j.error || 'Er ging iets mis.');
        })
        .catch(function (err) {
          status.hidden = false; status.className = 'form-status err';
          status.textContent = (err && err.message ? err.message : 'Er ging iets mis.') + ' Probeer het opnieuw of bel ' + EF.phone.display + '.';
          submit.disabled = false; submit.textContent = 'Bestelling plaatsen en betalen';
        });
    });
  }

  /* ---------- bestelstatus na betaling ---------- */
  var os = document.querySelector('[data-order-status]');
  if (os) {
    var msg = os.querySelector('[data-order-message]');
    var id = new URLSearchParams(location.search).get('id');
    if (!id) { msg.textContent = 'Geen bestelling gevonden.'; return; }
    fetch('/api/order-status?id=' + encodeURIComponent(id)).then(function (r) { return r.json(); }).then(function (j) {
      if (j.status === 'paid') { EF.cart.clear(); msg.innerHTML = '<strong>Bedankt! Uw betaling is ontvangen.</strong> Uw ordernummer is ' + esc(j.orderId) + '. Wij nemen zo snel mogelijk contact met u op over de levering.'; }
      else if (j.status === 'open' || j.status === 'pending' || j.status === 'created') msg.textContent = 'Uw betaling wordt nog verwerkt. U ontvangt bericht zodra de betaling is bevestigd.';
      else msg.innerHTML = 'De betaling is niet gelukt of geannuleerd. <a href="/afrekenen/">Probeer het opnieuw</a> of neem contact met ons op.';
    }).catch(function () { msg.textContent = 'De status kon niet worden opgehaald. Neem contact met ons op.'; });
  }
})();
