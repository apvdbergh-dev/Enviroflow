/* Homepage: diashow in de hero. Crossfade met langzame zoom, tekst per dia en voortgangsbalken.
   Pauzeert bij hover/focus, als het tabblad verborgen is en via de pauzeknop. Swipe en pijltjestoetsen.
   Met 'minder beweging' start hij gepauzeerd en zonder zoom. */
(function () {
  'use strict';
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var slides = hero.querySelectorAll('.hero__slide');
  var captions = hero.querySelectorAll('.hero__caption');
  var dots = hero.querySelectorAll('[data-goto]');
  var toggle = hero.querySelector('[data-toggle]');
  var n = slides.length;
  if (n < 2) return;

  var INTERVAL = 7000;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var index = 0, timer = null, userPaused = reduce, hoverPaused = false, started = 0, remaining = INTERVAL;
  hero.style.setProperty('--interval', INTERVAL + 'ms');
  hero.classList.add('is-ready');

  function setPausedUi() {
    var paused = userPaused || hoverPaused || document.hidden;
    hero.classList.toggle('is-paused', paused);
    toggle.setAttribute('aria-pressed', String(userPaused));
    var en = document.documentElement.lang === 'en';
    toggle.setAttribute('aria-label', userPaused ? (en ? 'Play slideshow' : 'Diashow afspelen') : (en ? 'Pause slideshow' : 'Diashow pauzeren'));
    hero.querySelector('.hero__captions').setAttribute('aria-live', userPaused ? 'polite' : 'off');
  }

  function show(next, dir) {
    if (next === index) return;
    var prev = index;
    index = (next + n) % n;
    slides[prev].classList.remove('is-active'); slides[prev].classList.add('is-leaving');
    setTimeout(function () { slides[prev].classList.remove('is-leaving'); }, 1400);
    slides[index].classList.add('is-active');
    slides[index].style.setProperty('--dir', dir || 1);
    captions.forEach(function (c, i) {
      var on = i === index;
      c.classList.toggle('is-active', on);
      c.setAttribute('aria-hidden', String(!on));
      var link = c.querySelector('a'); if (link) link.tabIndex = on ? 0 : -1;
    });
    dots.forEach(function (d, i) { if (i === index) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
    // voortgangsbalk opnieuw starten
    var bar = dots[index].querySelector('i'); bar.style.animation = 'none'; void bar.offsetWidth; bar.style.animation = '';
    remaining = INTERVAL; schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (userPaused || hoverPaused || document.hidden) return;
    started = Date.now();
    timer = setTimeout(function () { show(index + 1, 1); }, remaining);
  }
  function pauseTimer() { if (timer) { clearTimeout(timer); timer = null; remaining = Math.max(400, remaining - (Date.now() - started)); } }

  hero.querySelector('[data-next]').addEventListener('click', function () { show(index + 1, 1); });
  hero.querySelector('[data-prev]').addEventListener('click', function () { show(index - 1, -1); });
  dots.forEach(function (d) { d.addEventListener('click', function () { var i = +d.getAttribute('data-goto'); show(i, i > index ? 1 : -1); }); });
  toggle.addEventListener('click', function () {
    userPaused = !userPaused;
    if (userPaused) pauseTimer(); else schedule();
    setPausedUi();
  });

  // Pauzeren zolang de muis of focus op de tekst/bediening staat.
  var holdZone = [hero.querySelector('.hero__captions'), hero.querySelector('.hero__controls')];
  holdZone.forEach(function (z) {
    z.addEventListener('mouseenter', function () { hoverPaused = true; pauseTimer(); setPausedUi(); });
    z.addEventListener('mouseleave', function () { hoverPaused = false; schedule(); setPausedUi(); });
    z.addEventListener('focusin', function () { hoverPaused = true; pauseTimer(); setPausedUi(); });
    z.addEventListener('focusout', function (e) { if (!z.contains(e.relatedTarget)) { hoverPaused = false; schedule(); setPausedUi(); } });
  });
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseTimer(); else schedule(); setPausedUi(); });

  // Pijltjestoetsen binnen de diashow.
  hero.addEventListener('keydown', function (e) {
    if (!e.target.closest('.hero__captions, .hero__controls')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1, 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1, -1); }
  });

  // Swipe (aanraakscherm), met snelheid zodat een korte veeg ook telt.
  var sx = 0, sy = 0, st = 0, tracking = false;
  hero.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse' || e.target.closest('a, button')) return; tracking = true; sx = e.clientX; sy = e.clientY; st = Date.now(); });
  hero.addEventListener('pointerup', function (e) {
    if (!tracking) return; tracking = false;
    var dx = e.clientX - sx, dy = e.clientY - sy, v = Math.abs(dx) / Math.max(1, Date.now() - st);
    if (Math.abs(dx) > Math.abs(dy) * 1.4 && (Math.abs(dx) > 60 || v > 0.4)) show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
  hero.addEventListener('pointercancel', function () { tracking = false; });

  // Volgende foto vast laden zodra de pagina rustig is.
  window.addEventListener('load', function () { slides.forEach(function (s) { var img = s.querySelector('img'); if (img) img.loading = 'eager'; }); });

  setPausedUi();
  schedule();
})();
