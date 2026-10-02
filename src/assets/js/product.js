/* Productpagina: galerij en toevoegen aan winkelwagen. */
(function () {
  'use strict';
  var EF = window.EF;
  var form = document.querySelector('[data-add-form]');
  if (form) {
    var qty = form.querySelector('input[name="qty"]');
    form.querySelectorAll('[data-qty-step]').forEach(function (b) {
      b.addEventListener('click', function () {
        qty.value = Math.max(1, Math.min(999, (parseInt(qty.value, 10) || 1) + parseInt(b.getAttribute('data-qty-step'), 10)));
      });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      EF.cart.add(form.getAttribute('data-add-form'), qty.value);
      EF.addedToast(document.querySelector('h1').textContent);
    });
  }

  var gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    var main = gallery.querySelector('[data-gallery-main]');
    var tpl = gallery.querySelector('[data-gallery-items]');
    var items = tpl ? Array.prototype.slice.call(tpl.content.children) : [];
    gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = parseInt(b.getAttribute('data-gallery-thumb'), 10);
        if (!items[i]) return;
        main.innerHTML = ''; main.appendChild(items[i].cloneNode(true));
        gallery.querySelectorAll('[data-gallery-thumb]').forEach(function (x) { x.removeAttribute('aria-current'); });
        b.setAttribute('aria-current', 'true');
      });
    });
  }
})();
