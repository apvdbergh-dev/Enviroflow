/* Keuzehulp: één vraag per scherm, voortgangsbalk en een indicatief resultaat. */
(function () {
  'use strict';
  var EF = window.EF; var L = EF.L;
  var form = document.querySelector('[data-wizard]');
  if (!form) return;
  var data = JSON.parse(document.getElementById('kh-data').textContent);
  var steps = Array.prototype.slice.call(form.querySelectorAll('.wizard__step'));
  var bar = form.querySelector('[data-wizard-bar]');
  var counter = form.querySelector('[data-wizard-count]');
  var prev = form.querySelector('[data-wizard-prev]');
  var next = form.querySelector('[data-wizard-next]');
  var error = form.querySelector('[data-wizard-error]');
  var result = document.querySelector('[data-wizard-result]');
  var current = 0;

  var DUNNO = L('Weet ik nog niet', "Don't know yet");
  var LABELS = {
    doel: { opvangen: L('Vloeistof opvangen', 'Contain liquid'), opslaan: L('Vloeistof opslaan', 'Store liquid'), beschermen: L('Beschermen tegen water', 'Protect against water'), anders: L('Iets anders', 'Something else') },
    vloeistof: { 'olie-chemicalien': L('Olie of chemicaliën', 'Oil or chemicals'), brandstof: L('Brandstof', 'Fuel'), drinkwater: L('Drinkwater', 'Drinking water'), bluswater: L('Bluswater', 'Fire water'), proceswater: L('Proces- of regenwater', 'Process water or rainwater'), afvalwater: L('Afvalwater', 'Waste water'), mest: L('Mest', 'Manure'), uan: L('UAN / vloeibare meststof', 'UAN / liquid fertiliser'), anders: L('Anders', 'Other') },
    locatie: { binnen: L('Binnen', 'Indoors'), buiten: L('Buiten', 'Outdoors'), beide: L('Beide / wisselend', 'Both / varying'), onbekend: DUNNO },
    duur: { tijdelijk: L('Tijdelijk', 'Temporary'), permanent: 'Permanent', onbekend: DUNNO },
    mobiliteit: { vast: L('Vaste plek', 'Fixed location'), mobiel: L('Mobiel / verplaatsbaar', 'Mobile / movable'), onbekend: DUNNO },
    eenheid: { "IBC's": L("IBC's", 'IBCs'), vaten: L('vaten', 'drums'), liter: L('liter', 'litres'), 'm³': 'm³' }
  };
  var val = function (name) { var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]:not([type=radio])'); return el ? el.value.trim() : ''; };
  var skipped = function (i) { var key = steps[i].getAttribute('data-step'); return val('doel') === 'beschermen' && (key === 'vloeistof' || key === 'hoeveelheid'); };
  var visibleSteps = function () { return steps.map(function (_, i) { return i; }).filter(function (i) { return !skipped(i); }); };

  function show(i, focus) {
    current = i;
    steps.forEach(function (s, j) { if (j === i) s.removeAttribute('data-hidden'); else s.setAttribute('data-hidden', ''); });
    var vis = visibleSteps(); var pos = vis.indexOf(i) + 1;
    bar.style.width = (pos / vis.length * 100) + '%';
    counter.textContent = L('Vraag ', 'Question ') + pos + L(' van ', ' of ') + vis.length;
    prev.hidden = pos === 1;
    next.innerHTML = pos === vis.length ? L('Toon oplossingen', 'Show solutions') + ' <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>' : L('Volgende', 'Next') + ' <svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg>';
    error.hidden = true;
    if (focus) steps[i].querySelector('.wizard__q').focus();
  }

  function stepValid(i) {
    var key = steps[i].getAttribute('data-step');
    var required = { doel: 'doel', vloeistof: 'vloeistof', locatie: 'locatie', duur: 'duur' }[key];
    return !required || !!val(required);
  }

  next.addEventListener('click', function () {
    if (!stepValid(current)) { error.hidden = false; var first = steps[current].querySelector('input'); if (first) first.focus(); return; }
    var vis = visibleSteps(); var pos = vis.indexOf(current);
    if (pos === vis.length - 1) return finish();
    show(vis[pos + 1], true);
  });
  prev.addEventListener('click', function () { var vis = visibleSteps(); var pos = vis.indexOf(current); if (pos > 0) show(vis[pos - 1], true); });
  form.addEventListener('change', function (e) { if (e.target.type === 'radio') error.hidden = true; });
  form.addEventListener('submit', function (e) { e.preventDefault(); next.click(); });

  function recommend(a) {
    var c = [];
    if (a.doel === 'beschermen') c.push('mobiele-waterkeringen');
    else if (a.doel === 'opvangen') {
      if (a.vloeistof === 'afvalwater') c.push('wasmatten-voertuigen');
      c.push('flexibele-opvangbakken');
    } else if (a.doel === 'opslaan') {
      var map = {
        'olie-chemicalien': ['flexibele-opvangbakken'], brandstof: ['brandstoftanks', 'flexibele-opvangbakken'], drinkwater: ['drinkwatertanks'],
        bluswater: ['brandwatertanks', 'open-zelfdragende-tanks'], proceswater: ['industriele-water-en-buffertanks', 'open-zelfdragende-tanks'],
        afvalwater: ['afvalwatertanks'], mest: ['mest-en-slurrytanks'], uan: ['uan-tanks'], anders: []
      };
      c = c.concat(map[a.vloeistof] || []);
      if (a.mobiliteit === 'mobiel' && /water/.test(a.vloeistof)) c.push('mobiele-watertanks');
    }
    c.push('maatwerk');
    return c.filter(function (x, i) { return c.indexOf(x) === i; }).map(function (id) { return data.categories.find(function (k) { return k.id === id; }); }).filter(Boolean);
  }

  function finish() {
    var a = { doel: val('doel'), vloeistof: val('vloeistof'), aantal: val('aantal'), eenheid: val('eenheid'), locatie: val('locatie'), duur: val('duur'), mobiliteit: val('mobiliteit'), lengte: val('lengte'), breedte: val('breedte'), hoogte: val('hoogte') };
    if (a.doel === 'beschermen') { a.vloeistof = ''; a.aantal = ''; }
    var rows = [
      [L('Wat wilt u doen?', 'What do you want to do?'), LABELS.doel[a.doel]],
      [L('Vloeistof', 'Liquid'), LABELS.vloeistof[a.vloeistof]],
      [L('Hoeveelheid', 'Quantity'), a.aantal ? a.aantal + ' ' + (LABELS.eenheid[a.eenheid] || a.eenheid) : ''],
      [L('Binnen of buiten', 'Indoors or outdoors'), LABELS.locatie[a.locatie]],
      [L('Duur', 'Duration'), LABELS.duur[a.duur]],
      [L('Plaatsing', 'Placement'), LABELS.mobiliteit[a.mobiliteit]],
      [L('Beschikbare ruimte', 'Available space'), [a.lengte, a.breedte, a.hoogte].some(Boolean) ? [a.lengte || '?', a.breedte || '?', a.hoogte || '?'].join(' × ') + L(' m (l × b × h)', ' m (l × w × h)') : '']
    ].filter(function (r) { return r[1]; });

    var cats = recommend(a);
    var catIds = cats.map(function (c) { return c.id; });
    var prods = data.products.filter(function (p) { return catIds.indexOf(p.category) > -1; });
    if (a.eenheid === 'vaten' && parseFloat(a.aantal) > 0) {
      var nv = parseFloat(a.aantal);
      var fitv = prods.filter(function (p) { return p.drums && p.drums >= nv; }).sort(function (x, y) { return x.drums - y.drums; });
      prods = fitv.length ? fitv : prods;
    }
    if (a.eenheid === "IBC's" && parseFloat(a.aantal) > 0) {
      var n = parseFloat(a.aantal);
      var fit = prods.filter(function (p) { return p.ibc && p.ibc >= n; }).sort(function (x, y) { return x.ibc - y.ibc; });
      prods = fit.length ? fit : prods;
    }

    result.querySelector('[data-result-summary]').innerHTML = '<p><strong>' + L('Uw antwoorden', 'Your answers') + '</strong></p><dl>' + rows.map(function (r) { return '<dt>' + EF.esc(r[0]) + '</dt><dd>' + EF.esc(r[1]) + '</dd>'; }).join('') + '</dl>';
    result.querySelector('[data-result-cats]').innerHTML = cats.map(function (c) {
      return '<a class="ccard ccard--compact" href="' + c.url + '"><span class="ccard__name">' + EF.esc(c.name) + '</span><span class="ccard__text">' + EF.esc(c.short) + '</span><svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a>';
    }).join('');
    result.querySelector('[data-result-products]').innerHTML = prods.length ? '<h3 class="subhead">' + L('Direct online te bestellen', 'Order online straight away') + '</h3><ul class="link-list">' + prods.slice(0, 3).map(function (p) { return '<li><a href="' + p.url + '">' + EF.esc(p.name) + '<svg class="ic" aria-hidden="true"><use href="#i-arrow"/></svg></a></li>'; }).join('') + '</ul>' : '';

    var text = rows.map(function (r) { return '- ' + r[0] + ': ' + r[1]; }).join('\n') + (cats.length ? '\n- ' + L('Voorgestelde oplossingen', 'Suggested solutions') + ': ' + cats.map(function (c) { return c.name; }).join(', ') : '');
    try { sessionStorage.setItem('ef-keuzehulp', JSON.stringify({ text: text, liquid: LABELS.vloeistof[a.vloeistof] || '', quantity: a.eenheid !== 'liter' && a.eenheid !== 'm³' ? a.aantal : '', application: LABELS.doel[a.doel] || '' })); } catch (e) { /* */ }

    form.hidden = true; result.hidden = false;
    result.querySelector('h2').focus();
  }

  result.querySelector('[data-wizard-restart]').addEventListener('click', function () {
    form.reset(); result.hidden = true; form.hidden = false; show(0, true);
  });

  show(0, false);
})();
