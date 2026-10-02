/* Offerte-, advies-, maatwerk- en contactformulieren: voorinvullen, validatie en verzenden. */
(function () {
  'use strict';
  var EF = window.EF;
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
      var h = document.querySelector('[data-quote-title]'); if (h) h.textContent = 'Advies aanvragen';
      document.title = 'Advies aanvragen | EnviroFlow';
    }
    var prod = params.get('product');
    if (prod) { var sel = quote.querySelector('[name="product"]'); if (sel.querySelector('option[value="' + CSS.escape(prod) + '"]')) sel.value = prod; }
    if (params.get('categorie')) addRemark('Interesse in categorie: ' + params.get('categorie'));

    var bron = params.get('bron');
    if (source) source.value = bron || '';
    if (bron === 'winkelwagen') {
      EF.catalog().then(function (cat) {
        var ls = EF.cart.items().filter(function (i) { return cat[i.id]; });
        if (!ls.length) return;
        addRemark('Producten uit mijn winkelwagen:\n' + ls.map(function (i) { return '- ' + i.qty + ' × ' + cat[i.id].name; }).join('\n'));
        note.hidden = false; note.textContent = 'De producten uit uw winkelwagen zijn toegevoegd aan het opmerkingenveld.';
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
        addRemark('Mijn antwoorden uit de keuzehulp:\n' + answers.text);
        if (answers.liquid) quote.querySelector('[name="liquid"]').value = answers.liquid;
        if (answers.quantity) quote.querySelector('[name="quantity"]').value = answers.quantity;
        if (answers.application) quote.querySelector('[name="application"]').value = answers.application;
        note.hidden = false; note.textContent = 'Uw antwoorden uit de keuzehulp zijn alvast ingevuld. Vul uw gegevens aan en verstuur de aanvraag.';
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
          status.textContent = tooMany ? 'U kunt maximaal ' + MAX_FILES + ' bestanden meesturen.' : 'Een of meer bestanden zijn groter dan 10 MB.';
          files.focus(); return;
        }
      }
      var label = btn.textContent; btn.disabled = true; btn.textContent = 'Bezig met verzenden…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          if (!res.ok) throw new Error(res.j.error || 'Versturen is niet gelukt.');
          try { sessionStorage.removeItem('ef-keuzehulp'); } catch (e) { /* */ }
          var box = document.createElement('div');
          box.className = 'form-status ok'; box.setAttribute('role', 'status'); box.tabIndex = -1;
          box.innerHTML = '<p><strong>' + EF.esc(EF.t.formThanks) + '</strong></p>';
          form.replaceWith(box); box.focus();
        })
        .catch(function (err) {
          status.hidden = false; status.className = 'form-status err';
          status.textContent = err.message + ' Probeer het opnieuw, mail naar Info@enviroflow.nl of bel ' + EF.phone.display + '.';
          btn.disabled = false; btn.textContent = label;
        });
    });
  });
})();
