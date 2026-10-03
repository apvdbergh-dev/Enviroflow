/* Productoverzicht: filters en sortering (client-side, op data-attributen van de productkaarten). */
(function () {
  'use strict';
  var listing = document.querySelector('[data-listing]');
  if (!listing) return;
  var grid = listing.querySelector('[data-grid]');
  var cards = Array.prototype.slice.call(grid.children);
  var form = listing.querySelector('[data-filters]');
  var count = listing.querySelector('[data-count]');
  var empty = listing.querySelector('[data-empty]');
  var sort = listing.querySelector('[data-sort]');
  var toggle = listing.querySelector('[data-filters-toggle]');
  cards.forEach(function (c, i) { c.dataset.index = i; });

  if (toggle) toggle.addEventListener('click', function () {
    var aside = toggle.closest('.filters'); var open = !aside.classList.contains('open');
    aside.classList.toggle('open', open); toggle.setAttribute('aria-expanded', String(open));
  });

  function apply() {
    var checks = {}; var ranges = {};
    if (form) {
      form.querySelectorAll('[data-filter]').forEach(function (fs) {
        var vals = Array.prototype.map.call(fs.querySelectorAll('input:checked'), function (i) { return i.value; });
        if (vals.length) checks[fs.getAttribute('data-filter')] = vals;
      });
      form.querySelectorAll('[data-filter-range]').forEach(function (fs) {
        var min = parseFloat(fs.querySelector('[data-min]').value); var max = parseFloat(fs.querySelector('[data-max]').value);
        if (!isNaN(min) || !isNaN(max)) ranges[fs.getAttribute('data-filter-range')] = [isNaN(min) ? -Infinity : min, isNaN(max) ? Infinity : max];
      });
    }
    var shown = 0;
    cards.forEach(function (card) {
      var ok = Object.keys(checks).every(function (k) {
        var have = (card.dataset[k] || '').split('|');
        return checks[k].some(function (v) { return have.indexOf(v) > -1; });
      }) && Object.keys(ranges).every(function (k) {
        var v = parseFloat(card.dataset[k]); return !isNaN(v) && v >= ranges[k][0] && v <= ranges[k][1];
      });
      var wasHidden = card.hidden;
      card.hidden = !ok; if (ok) shown++;
      if (ok && wasHidden && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        card.classList.add('is-entering');
        requestAnimationFrame(function () { requestAnimationFrame(function () { card.classList.remove('is-entering'); }); });
      }
    });
    count.textContent = '(' + shown + ')';
    empty.hidden = shown !== 0;
  }

  function doSort() {
    var mode = sort.value;
    var sorted = cards.slice().sort(function (a, b) {
      if (mode === 'name') return a.dataset.name.localeCompare(b.dataset.name, 'nl');
      if (mode === 'price-asc' || mode === 'price-desc') {
        var pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
        if (isNaN(pa)) pa = mode === 'price-asc' ? Infinity : -Infinity;
        if (isNaN(pb)) pb = mode === 'price-asc' ? Infinity : -Infinity;
        return mode === 'price-asc' ? pa - pb : pb - pa;
      }
      return a.dataset.index - b.dataset.index;
    });
    sorted.forEach(function (c) { grid.appendChild(c); });
  }

  if (form) {
    form.addEventListener('change', apply);
    form.addEventListener('input', function (e) { if (e.target.type === 'number') apply(); });
    form.addEventListener('reset', function () { setTimeout(apply, 0); });
  }
  if (sort) sort.addEventListener('change', doSort);
})();
