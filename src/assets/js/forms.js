/* Offerte-, advies-, maatwerk- en contactformulieren: voorinvullen, validatie en verzenden. */
(function () {
  'use strict';
  var EF = window.EF; var L = EF.L;
  var params = new URLSearchParams(location.search);
  var MAX_FILES = 10, MAX_SIZE = 10 * 1024 * 1024;

  /* ---------- voorinvullen offerteformulier ---------- */
  var quote = document.querySelector('[data-form="quote"]');
  if (quote) {
    var note = document.querySelector('[data-prefill-note]');
    var remarks = quote.querySelector('[name="remarks"]');
    var source = quote.querySelector('[name="source"]');
    var addRemark = function (txt) { remarks.value = (remarks.value ? remarks.value + '\n\n' : '') + txt; };

    if (params.get('type') === 'advies') {
      quote.querySelector('[name="request_type"][value="advies"]').checked = true;
      var h = document.querySelector('[data-quote-title]'); if (h) h.textContent = L('Advies aanvragen', 'Request advice');
      document.title = L('Advies aanvragen', 'Request advice') + ' | EnviroFlow';
    }
    var prod = params.get('product');
    if (prod) { var sel = quote.querySelector('[name="product"]'); if (sel.querySelector('option[value="' + CSS.escape(prod) + '"]')) sel.value = prod; }
    if (params.get('categorie')) addRemark(L('Interesse in categorie: ', 'Interested in category: ') + params.get('categorie'));

    var bron = params.get('bron');
    if (source) source.value = bron || '';
    if (bron === 'winkelwagen') {
      EF.catalog().then(function (cat) {
        var ls = EF.cart.items().filter(function (i) { return cat[i.id]; });
        if (!ls.length) return;
        addRemark(L('Producten uit mijn winkelwagen:', 'Products from my shopping cart:') + '\n' + ls.map(function (i) { return '- ' + i.qty + ' × ' + cat[i.id].name; }).join('\n'));
        note.hidden = false; note.textContent = L('De producten uit uw winkelwagen zijn toegevoegd aan het opmerkingenveld.', 'The products from your shopping cart have been added to the remarks field.');
      });
    }
    if (bron === 'keuzehulp') {
      var answers = null;
      try { answers = JSON.parse(sessionStorage.getItem('ef-keuzehulp') || 'null'); } catch (e) { answers = null; }
      if (!answers) { // fallback zonder JavaScript-resultaat: antwoorden uit de URL
        var keys = ['doel', 'vloeistof', 'aantal', 'eenheid', 'locatie', 'duur', 'mobiliteit', 'lengte', 'breedte', 'hoogte'];
        var lines = keys.filter(function (k) { return params.get(k); }).map(function (k) { return k + ': ' + params.get(k); });
        if (lines.length) answers = { text: lines.join('\n') };
      }
      if (answers && answers.text) {
        quote.querySelector('[name="request_type"][value="advies"]').checked = true;
        addRemark(L('Mijn antwoorden uit de keuzehulp:', 'My answers from the selection guide:') + '\n' + answers.text);
        if (answers.liquid) quote.querySelector('[name="liquid"]').value = answers.liquid;
        if (answers.quantity) quote.querySelector('[name="quantity"]').value = answers.quantity;
        if (answers.application) quote.querySelector('[name="application"]').value = answers.application;
        note.hidden = false; note.textContent = L('Uw antwoorden uit de keuzehulp zijn alvast ingevuld. Vul uw gegevens aan en verstuur de aanvraag.', 'Your answers from the selection guide have already been filled in. Add your details and send the request.');
      }
    }
  }

  /* ---------- verzenden ---------- */
  document.querySelectorAll('[data-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');
    var btn = form.querySelector('[data-submit]');
    var files = form.querySelector('input[type="file"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.hidden = true;
      if (!EF.validate(form)) return;
      if (files && files.files.length) {
        var tooMany = files.files.length > MAX_FILES;
        var tooBig = Array.prototype.some.call(files.files, function (f) { return f.size > MAX_SIZE; });
        if (tooMany || tooBig) {
          status.hidden = false; status.className = 'form-status err';
          status.textContent = tooMany ? L('U kunt maximaal ' + MAX_FILES + ' bestanden meesturen.', 'You can attach up to ' + MAX_FILES + ' files.') : L('Een of meer bestanden zijn groter dan 10 MB.', 'One or more files are larger than 10 MB.');
          files.focus(); return;
        }
      }
      var label = btn.textContent; btn.disabled = true; btn.textContent = L('Bezig met verzenden…', 'Sending…');
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j.error || L('Versturen is niet gelukt.', 'Sending failed.'));
          try { sessionStorage.removeItem('ef-keuzehulp'); } catch (e) { /* */ }
          var box = document.createElement('div');
          box.className = 'form-status ok'; box.setAttribute('role', 'status'); box.tabIndex = -1;
          box.innerHTML = '<p><strong>' + EF.esc(EF.t.formThanks) + '</strong></p>';
          if (res.j.nr) box.innerHTML += '<p>' + EF.esc(L('Uw aanvraag ', 'Your request ')) + '<strong>' + EF.esc(res.j.nr) + '</strong>' + EF.esc(L(' is ontvangen. Vermeld dit nummer als u contact met ons opneemt.', ' has been received. Please quote this number when you contact us.')) + '</p>';
          form.replaceWith(box); box.focus();
        })
        .catch(function (err) {
          status.hidden = false; status.className = 'form-status err';
          status.textContent = err.message + L(' Probeer het opnieuw, mail naar Info@enviroflow.nl of bel ', ' Please try again, email Info@enviroflow.nl or call ') + EF.phone.display + '.';
          btn.disabled = false; btn.textContent = label;
        });
    });
  });
})();
