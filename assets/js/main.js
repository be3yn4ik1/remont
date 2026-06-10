/* РемонтПрофи — интерактив главной страницы. Лёгкий vanilla JS, без зависимостей. */
(function () {
  'use strict';

  /* Sticky-хедер: тень при скролле */
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Мобильное меню */
  var burger = document.querySelector('.burger');
  var backdrop = document.querySelector('.backdrop');
  function toggleMenu(force) {
    var open = force !== undefined ? force : !document.body.classList.contains('menu-open');
    document.body.classList.toggle('menu-open', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', function () { toggleMenu(); });
  if (backdrop) backdrop.addEventListener('click', function () { toggleMenu(false); });
  document.querySelectorAll('.mobile-nav a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });

  /* Плавная прокрутка по якорям + закрытие меню */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      toggleMenu(false);
      var top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* Reveal на скролле */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in-view'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* Count-up для счётчиков trust */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1100, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var v = Math.round(target * eased);
      el.textContent = v.toLocaleString('ru-RU') + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* Финальная форма CTA — демо-обработка */
  var ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = ctaForm.querySelector('button[type="submit"]');
      btn.textContent = 'Заявка отправлена ✓';
      btn.disabled = true;
      ctaForm.reset();
      setTimeout(function () {
        btn.textContent = 'Рассчитать стоимость';
        btn.disabled = false;
      }, 3000);
    });
  }
})();
