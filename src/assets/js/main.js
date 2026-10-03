/* EnviroFlow – algemene interactie: menu, zoeken, btw-schakelaar, winkelwagen-teller, cookies. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var EF = window.EF || {};

  /* ---------- veilige opslag ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* opslag niet beschikbaar */ } }
  };
  EF.store = store;

  /* ---------- formattering ---------- */
  var nf = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
  EF.fmt = function (n) { return nf.format(n); };
  EF.vatMode = function () { return store.get('ef-vat', 'excl'); };

  /* ---------- winkelwagen (alleen id + aantal; prijzen komen uit de catalogus) ---------- */
  var Cart = {
    items: function () { var c = store.get('ef-cart', []); return Array.isArray(c) ? c : []; },
    save: function (items) { store.set('ef-cart', items); Cart.updateCount(); document.dispatchEvent(new CustomEvent('ef:cart')); },
    add: function (id, qty) {
      qty = Math.max(1, Math.min(999, parseInt(qty, 10) || 1));
      var items = Cart.items(); var line = items.find(function (i) { return i.id === id; });
      if (line) line.qty = Math.min(999, line.qty + qty); else items.push({ id: id, qty: qty });
      Cart.save(items);
    },
    set: function (id, qty) {
      var items = Cart.items().map(function (i) { return i.id === id ? { id: id, qty: Math.max(1, Math.min(999, parseInt(qty, 10) || 1)) } : i; });
      Cart.save(items);
    },
    remove: function (id) { Cart.save(Cart.items().filter(function (i) { return i.id !== id; })); },
    clear: function () { Cart.save([]); },
    count: function () { return Cart.items().reduce(function (s, i) { return s + i.qty; }, 0); },
    updateCount: function () {
      var n = Cart.count();
      document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
      document.querySelectorAll('.cart-link').forEach(function (a) { a.setAttribute('aria-label', 'Winkelwagen' + (n ? ', ' + n + ' artikel' + (n === 1 ? '' : 'en') : ', leeg')); });
    }
  };
  EF.cart = Cart;
  var catalogPromise;
  EF.catalog = function () {
    if (!catalogPromise) catalogPromise = fetch('/assets/data/catalog.json').then(function (r) { return r.json(); }).catch(function () { return {}; });
    return catalogPromise;
  };

  /* ---------- toast ---------- */
  var toastTimer;
  EF.toast = function (html) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); document.body.appendChild(t); }
    t.innerHTML = html; t.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { t.hidden = true; }, 5000);
  };
  EF.addedToast = function (name) { EF.toast('<span>' + (name ? escapeHtml(name) + ' is toegevoegd aan uw winkelwagen.' : 'Toegevoegd aan uw winkelwagen.') + '</span><a href="/winkelwagen/">Bekijk winkelwagen</a>'); };
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  EF.esc = escapeHtml;

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-add-to-cart]');
    if (!btn) return;
    Cart.add(btn.getAttribute('data-add-to-cart'), 1);
    var card = btn.closest('.pcard');
    EF.addedToast(card ? card.getAttribute('data-name') : '');
  });

  /* ---------- btw-schakelaar ---------- */
  EF.applyVat = function () {
    var mode = EF.vatMode(); var rate = EF.vatRate || 0.21;
    document.querySelectorAll('[data-price-excl]').forEach(function (el) {
      var v = parseFloat(el.getAttribute('data-price-excl'));
      if (!isNaN(v)) el.textContent = EF.fmt(mode === 'incl' ? v * (1 + rate) : v);
    });
    document.querySelectorAll('[data-vat-label]').forEach(function (el) { el.textContent = mode === 'incl' ? 'incl. btw' : 'excl. btw'; });
    document.querySelectorAll('[data-vat]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-vat') === mode)); });
  };
  document.querySelectorAll('[data-vat]').forEach(function (b) {
    b.addEventListener('click', function () { store.set('ef-vat', b.getAttribute('data-vat')); EF.applyVat(); document.dispatchEvent(new CustomEvent('ef:vat')); });
  });

  /* ---------- navigatie ---------- */
  var header = document.querySelector('[data-header]');
  var nav = document.querySelector('[data-nav]');
  var menuBtn = document.querySelector('[data-menu-toggle]');
  var desktop = window.matchMedia('(min-width: 960px)');
  var hoverable = window.matchMedia('(hover: hover)');

  function closePanels(except) {
    document.querySelectorAll('.nav-expand[aria-expanded="true"]').forEach(function (b) {
      if (b === except) return;
      b.setAttribute('aria-expanded', 'false');
      var p = document.getElementById(b.getAttribute('aria-controls')); if (p) p.hidden = true;
    });
  }
  function togglePanel(btn, open) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (open === undefined) open = btn.getAttribute('aria-expanded') !== 'true';
    if (open) closePanels(btn);
    btn.setAttribute('aria-expanded', String(open));
    if (panel) panel.hidden = !open;
  }
  document.querySelectorAll('.nav-expand').forEach(function (btn) {
    btn.addEventListener('click', function () { togglePanel(btn); });
    var item = btn.closest('.nav-item'); var timer;
    item.addEventListener('mouseenter', function () { if (desktop.matches && hoverable.matches) { clearTimeout(timer); togglePanel(btn, true); } });
    item.addEventListener('mouseleave', function () { if (desktop.matches && hoverable.matches) { timer = setTimeout(function () { togglePanel(btn, false); }, 150); } });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.nav-expand[aria-expanded="true"]');
    if (open) { togglePanel(open, false); open.focus(); return; }
    if (nav && nav.classList.contains('open')) { setMenu(false); menuBtn.focus(); }
    closeSearch();
  });
  document.addEventListener('click', function (e) { if (!e.target.closest('.nav-item')) closePanels(); });
  // focus die het menu verlaat sluit het paneel
  document.addEventListener('focusin', function (e) { if (desktop.matches && !e.target.closest('.nav-item')) closePanels(); });

  function setMenu(open) {
    if (!nav) return;
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu');
    menuBtn.innerHTML = '<svg class="ic" aria-hidden="true"><use href="#i-' + (open ? 'close' : 'menu') + '"/></svg>';
    document.body.style.overflow = open && !desktop.matches ? 'hidden' : '';
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  desktop.addEventListener('change', function () { setMenu(false); closePanels(); });

  /* ---------- zoeken ---------- */
  var searchToggle = document.querySelector('[data-search-toggle]');
  function closeSearch() { if (header && header.classList.contains('search-open')) { header.classList.remove('search-open'); searchToggle && searchToggle.setAttribute('aria-expanded', 'false'); } }
  if (searchToggle) searchToggle.addEventListener('click', function () {
    var open = !header.classList.contains('search-open');
    header.classList.toggle('search-open', open);
    searchToggle.setAttribute('aria-expanded', String(open));
    if (open) document.getElementById('q-header').focus();
  });

  var indexPromise;
  function loadIndex() { if (!indexPromise) indexPromise = fetch('/assets/data/search-index.json').then(function (r) { return r.json(); }).catch(function () { return []; }); return indexPromise; }
  var norm = function (s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); };
  EF.search = function (q) {
    var terms = norm(q).split(/\s+/).filter(Boolean);
    return loadIndex().then(function (idx) {
      if (!terms.length) return [];
      return idx.map(function (it) {
        var title = norm(it.t), hay = title + ' ' + norm(it.d) + ' ' + norm(it.x) + ' ' + norm(it.k);
        var score = 0;
        for (var i = 0; i < terms.length; i++) {
          if (hay.indexOf(terms[i]) === -1) return null;
          score += title.indexOf(terms[i]) > -1 ? 3 : 1;
        }
        if (it.k === 'Product' || it.k === 'Categorie') score += 0.5;
        return { it: it, score: score };
      }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).map(function (r) { return r.it; });
    });
  };

  var form = document.querySelector('[data-search]');
  if (form) {
    var input = form.querySelector('input'); var box = form.querySelector('.search__results'); var active = -1; var debounce;
    var close = function () { box.hidden = true; input.setAttribute('aria-expanded', 'false'); active = -1; };
    input.addEventListener('focus', loadIndex);
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        var q = input.value.trim();
        if (q.length < 2) return close();
        EF.search(q).then(function (res) {
          var top = res.slice(0, 6);
          box.innerHTML = top.length ? top.map(function (r, i) { return '<a role="option" id="sr-' + i + '" href="' + r.u + '"><small>' + escapeHtml(r.k) + '</small>' + escapeHtml(r.t) + '</a>'; }).join('') + '<a class="all" href="/zoeken/?q=' + encodeURIComponent(q) + '">Alle resultaten voor “' + escapeHtml(q) + '”</a>'
            : '<a class="all" href="/offerte-aanvragen/?type=advies">Geen resultaten. Vraag advies aan</a>';
          box.hidden = false; input.setAttribute('aria-expanded', 'true'); active = -1;
        });
      }, 120);
    });
    input.addEventListener('keydown', function (e) {
      var links = box.querySelectorAll('a'); if (box.hidden || !links.length) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        active = (active + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
        links.forEach(function (l, i) { l.setAttribute('aria-selected', String(i === active)); });
        input.setAttribute('aria-activedescendant', links[active].id || '');
      } else if (e.key === 'Enter' && active > -1) { e.preventDefault(); window.location.href = links[active].href; }
    });
    document.addEventListener('click', function (e) { if (!form.contains(e.target)) close(); });
  }

  // zoekresultatenpagina
  var resultList = document.querySelector('[data-search-page]');
  if (resultList) {
    var q = new URLSearchParams(location.search).get('q') || '';
    var pageInput = document.getElementById('q-page'); if (pageInput) pageInput.value = q;
    var summary = document.querySelector('[data-search-summary]');
    if (q) EF.search(q).then(function (res) {
      summary.textContent = res.length + ' resultaat' + (res.length === 1 ? '' : 'en') + ' voor “' + q + '”';
      resultList.innerHTML = res.map(function (r) { return '<li><a href="' + r.u + '"><small>' + escapeHtml(r.k) + '</small><strong>' + escapeHtml(r.t) + '</strong><br>' + escapeHtml(r.d) + '</a></li>'; }).join('')
        || '<li>Geen resultaten. <a href="/offerte-aanvragen/?type=advies">Vraag advies aan</a> of bel <a href="tel:' + EF.phone.tel + '">' + EF.phone.display + '</a>.</li>';
    });
  }

  /* ---------- cookies (AVG: standaard alleen noodzakelijk) ---------- */
  var banner = document.querySelector('[data-cookie]');
  EF.consent = store.get('ef-consent', null);
  if (banner && !EF.consent) banner.hidden = false;
  document.querySelectorAll('[data-cookie-choice]').forEach(function (b) {
    b.addEventListener('click', function () {
      EF.consent = b.getAttribute('data-cookie-choice'); store.set('ef-consent', EF.consent); banner.hidden = true;
      document.dispatchEvent(new CustomEvent('ef:consent', { detail: EF.consent }));
      // Laad hier eventueel analytische scripts als EF.consent === 'all'.
    });
  });
  document.querySelectorAll('[data-cookie-settings]').forEach(function (b) { b.addEventListener('click', function () { banner.hidden = false; banner.querySelector('button').focus(); }); });

  /* ---------- formuliervalidatie (toegankelijke foutmeldingen) ---------- */
  EF.validate = function (form) {
    var first = null;
    form.querySelectorAll('.field__error').forEach(function (e) { e.remove(); });
    form.querySelectorAll('[aria-invalid]').forEach(function (e) { e.removeAttribute('aria-invalid'); });
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      if (el.disabled || el.closest('[hidden]') || el.type === 'hidden' || el.closest('.hp')) return;
      if (el.checkValidity()) return;
      var msg = 'Dit veld is verplicht.';
      if (el.validity.typeMismatch && el.type === 'email') msg = 'Vul een geldig e-mailadres in.';
      else if (el.type === 'checkbox') msg = 'Vink dit aan om verder te gaan.';
      else if (el.validity.rangeUnderflow || el.validity.rangeOverflow) msg = 'Vul een geldige waarde in.';
      el.setAttribute('aria-invalid', 'true');
      var err = document.createElement('p'); err.className = 'field__error'; err.id = (el.id || el.name) + '-err'; err.textContent = msg;
      var host = el.closest('.field') || el.closest('label') || el.parentNode;
      host.appendChild(err);
      var desc = (el.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && !/-err$/.test(x); });
      desc.push(err.id); el.setAttribute('aria-describedby', desc.join(' '));
      if (!first) first = el;
    });
    if (first) first.focus();
    return !first;
  };

  // foutmelding verdwijnt zodra het veld geldig is
  ['input', 'change'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      var el = e.target;
      if (!el.getAttribute || el.getAttribute('aria-invalid') !== 'true' || !el.checkValidity()) return;
      el.removeAttribute('aria-invalid');
      var err = document.getElementById((el.id || el.name) + '-err'); if (err) err.remove();
    });
  });

  /* ---------- beweging ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header krijgt schaduw zodra de pagina scrolt.
  if (header) {
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 4); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  // Elementen onder de vouw komen rustig in beeld; wat al zichtbaar is, blijft direct staan.
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var groups = [
      '.section-head', '.group-grid > *', '.index-list > li', '.product-grid > *', '.cat-grid > *', '.problem-list > li', '.problems__head',
      '.steps > *', '.sector-grid > li', '.article-grid > *', '.keuze-teaser', '.feature__text', '.partner-block > *', '.advice',
      '.cta-band__inner > *', '.pd-block', '.faq', '.custom-hint', '.sector-cards > *', '.link-list > li', '.check-list--cols', '.scard'
    ];
    var revealEls = [];
    document.querySelectorAll(groups.join(',')).forEach(function (el) {
      if (el.closest('.hero')) return;
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      var siblings = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.setProperty('--rd', Math.min(siblings, 6) * 60 + 'ms');
      el.classList.add('reveal'); revealEls.push(el);
    });
    document.querySelectorAll('.feature__media, .page-head__grid > .media').forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
      el.classList.add('reveal-img'); revealEls.push(el);
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
    // Vangnet: nooit iets onzichtbaar laten (bijv. bij printen of een sprong naar een anker).
    window.addEventListener('beforeprint', function () { revealEls.forEach(function (el) { el.classList.add('is-visible'); }); });
    setTimeout(function () { revealEls.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible'); }); }, 1200);
  }

  // Winkelwagenteller springt kort op bij toevoegen.
  document.addEventListener('ef:cart', function () {
    if (reduceMotion) return;
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
  });
  // Prijzen wisselen zichtbaar bij de btw-schakelaar.
  document.addEventListener('ef:vat', function () {
    if (reduceMotion) return;
    document.querySelectorAll('[data-price-excl]').forEach(function (el) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); });
  });

  // Subnavigatie op productpagina's volgt de sectie in beeld.
  var subLinks = document.querySelectorAll('.subnav a[href^="#"]');
  if (subLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    subLinks.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) map[t.id] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        subLinks.forEach(function (a) { a.classList.remove('is-active'); });
        if (map[e.target.id]) map[e.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    Object.keys(map).forEach(function (id) { so.observe(document.getElementById(id)); });
  }

  Cart.updateCount();
  EF.applyVat();
  window.EF = EF;
})();
