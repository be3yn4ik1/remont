/* Квиз-калькулятор — vanilla JS (без jQuery/WP).
   Для боевого режима укажите endpoint в RQ_ENDPOINT (например, /wp-admin/admin-ajax.php
   или URL обработчика формы). Если endpoint пустой — заявка просто показывает экран успеха. */
(function () {
  'use strict';
  var RQ_ENDPOINT = ''; // вставьте URL обработчика заявок при интеграции

  var quiz = document.getElementById('repairQuiz');
  if (!quiz) return;

  var TOTAL = 5; // шагов (6-й — форма, 7-й — успех)
  var current = 1;

  var fill = document.getElementById('rqProgressFill');
  var text = document.getElementById('rqProgressText');
  var nav = document.getElementById('rqNav');
  var prevBtn = document.getElementById('rqPrev');
  var nextBtn = document.getElementById('rqNext');
  var submitBtn = document.getElementById('rqSubmit');

  function $(sel, ctx) { return (ctx || quiz).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || quiz).querySelectorAll(sel)); }

  function showStep(n) {
    $all('.rq-step').forEach(function (s) { s.classList.remove('active'); });
    var step = quiz.querySelector('[data-step="' + n + '"]');
    if (step) step.classList.add('active');

    var pct = Math.min(((n - 1) / TOTAL) * 100, 100);
    fill.style.width = pct + '%';
    text.textContent = n <= TOTAL ? 'Шаг ' + n + ' из ' + TOTAL : 'Финальный шаг';

    if (n >= 6) {
      nav.style.display = 'none';
    } else {
      nav.style.display = '';
      prevBtn.style.display = n > 1 ? '' : 'none';
    }
    current = n;
  }

  function checked(name) {
    var el = quiz.querySelector('[name="' + name + '"]:checked');
    return el ? el.value : '';
  }
  function val(name) {
    var el = quiz.querySelector('[name="' + name + '"]');
    return el ? el.value.trim() : '';
  }

  function markError(n) {
    quiz.querySelectorAll('.rq-error-msg').forEach(function (e) { e.remove(); });
    var step = quiz.querySelector('[data-step="' + n + '"]');
    if (!step) return;
    var p = document.createElement('p');
    p.className = 'rq-error-msg';
    p.style.cssText = 'color:#e74c3c;font-size:13px;margin-top:10px;width:100%';
    p.textContent = 'Пожалуйста, заполните все обязательные поля';
    step.appendChild(p);
  }

  function validate(n) {
    var ok = true;
    if (n === 1 && !checked('rq_object')) ok = false;
    if (n === 2) {
      if (!checked('rq_layout')) ok = false;
      if (!val('rq_area')) ok = false;
      if (!val('rq_ceiling')) ok = false;
    }
    if (n === 3 && !checked('rq_repair')) ok = false;
    if (n === 4 && !checked('rq_design')) ok = false;
    if (n === 5 && !checked('rq_timing')) ok = false;
    if (!ok) markError(n);
    else quiz.querySelectorAll('.rq-error-msg').forEach(function (e) { e.remove(); });
    return ok;
  }

  nextBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (!validate(current)) return;
    if (current < 6) showStep(current + 1);
  });

  prevBtn.addEventListener('click', function (e) {
    e.preventDefault();
    if (current > 1) showStep(current - 1);
  });

  quiz.addEventListener('change', function (e) {
    var step = e.target.closest('.rq-step');
    if (step) step.querySelectorAll('.rq-error-msg').forEach(function (el) { el.remove(); });
  });

  submitBtn.addEventListener('click', function () {
    var phoneEl = quiz.querySelector('[name="rq_phone"]');
    var phone = phoneEl.value.trim();
    if (!phone) {
      phoneEl.style.borderColor = '#e74c3c';
      phoneEl.focus();
      return;
    }
    phoneEl.style.borderColor = '';

    var payload = {
      object: checked('rq_object'), layout: checked('rq_layout'),
      area: val('rq_area'), ceiling: val('rq_ceiling'),
      repair: checked('rq_repair'), design: checked('rq_design'),
      timing: checked('rq_timing'), gift: checked('rq_gift'),
      channel: checked('rq_channel'), name: val('rq_name'), phone: phone
    };

    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;

    function done() { showStep(7); }

    if (!RQ_ENDPOINT) { setTimeout(done, 400); return; }

    var body = new URLSearchParams();
    body.append('action', 'repair_quiz_send');
    Object.keys(payload).forEach(function (k) { body.append('quiz_data[' + k + ']', payload[k]); });

    fetch(RQ_ENDPOINT, { method: 'POST', body: body })
      .then(function () { done(); })
      .catch(function () { done(); });
  });

  showStep(1);
})();
