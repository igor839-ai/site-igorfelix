/* Igor Felix Advogados | comportamento comum das páginas */
(function () {
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');

  // Cabeçalho e barra de progresso
  var header = document.getElementById('header');
  var pbar = document.getElementById('pbar');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 40);
    if (pbar) {
      var h = doc.scrollHeight - window.innerHeight;
      pbar.style.width = (h > 0 ? (y / h * 100) : 0).toFixed(2) + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Menu do celular
  var menu = document.getElementById('menu');
  var menuBtn = document.getElementById('menuBtn');
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('open');
    if (menuBtn) { menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    document.body.style.overflow = '';
  }
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  }

  // Submenus (clique na seta, útil em telas de toque largas)
  document.querySelectorAll('.menu-caret').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var g = btn.closest('.menu-group');
      var open = !g.classList.contains('open');
      document.querySelectorAll('.menu-group.open').forEach(function (o) { o.classList.remove('open'); });
      g.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.menu-group.open').forEach(function (o) { o.classList.remove('open'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMenu();
      document.querySelectorAll('.menu-group.open').forEach(function (o) { o.classList.remove('open'); });
    }
  });

  // Animação de entrada
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('visible'); });
  }

  // Contadores
  var fmt = window.Intl ? new Intl.NumberFormat('pt-BR') : null;
  var counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cio.unobserve(en.target);
        var el = en.target, target = +el.getAttribute('data-count');
        var prefix = el.getAttribute('data-prefix') || '', suffix = el.getAttribute('data-suffix') || '';
        var t0 = performance.now(), dur = 1500;
        (function tick(now) {
          var p = Math.min((now - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
          var v = Math.round(target * eased);
          el.textContent = prefix + (fmt ? fmt.format(v) : v) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  // Perguntas frequentes
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q'), ans = item.querySelector('.faq-a');
    if (!btn || !ans) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      var wrap = item.parentNode;
      wrap.querySelectorAll('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
        o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Teste rápido (o GTM registra "quiz_concluido" quando #quizResult aparece)
  var Q = window.QUIZ;
  var card = document.getElementById('quizCard');
  if (Q && card) {
    var qEl = document.getElementById('quizQ');
    var stepEl = document.getElementById('quizStep');
    var optsEl = document.getElementById('quizOpts');
    var bodyEl = document.getElementById('quizBody');
    var resEl = document.getElementById('quizResult');
    var backBtn = document.getElementById('quizBack');
    var progWrap = document.getElementById('quizProgress');
    var step = 0, answers = [];
    progWrap.innerHTML = '';
    Q.questions.forEach(function () { progWrap.appendChild(document.createElement('span')); });
    var prog = progWrap.querySelectorAll('span');

    function render() {
      var item = Q.questions[step];
      stepEl.textContent = 'Pergunta ' + (step + 1) + ' de ' + Q.questions.length;
      qEl.textContent = item.q;
      optsEl.innerHTML = '';
      item.opts.forEach(function (o) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = o;
        b.addEventListener('click', function () { answer(o); });
        optsEl.appendChild(b);
      });
      prog.forEach(function (p, i) { p.classList.toggle('done', i < step); });
      backBtn.style.display = step > 0 ? 'inline-block' : 'none';
    }
    function answer(o) {
      answers[step] = o;
      step++;
      if (step < Q.questions.length) render(); else finish();
    }
    function finish() {
      prog.forEach(function (p) { p.classList.add('done'); });
      bodyEl.style.display = 'none';
      var r = Q.result(answers);
      document.getElementById('quizResultTitle').textContent = r.title;
      document.getElementById('quizResultText').textContent = r.text;
      var link = document.getElementById('quizResultLink');
      if (r.link) { link.href = r.link.href; link.textContent = r.link.label; link.style.display = 'block'; }
      else { link.style.display = 'none'; }
      document.getElementById('quizResultBtn').href = 'https://wa.me/5511971694420?text=' + encodeURIComponent(Q.summary(answers));
      resEl.classList.add('show');
    }
    backBtn.addEventListener('click', function () {
      if (step > 0) { step--; answers.length = step; render(); }
    });
    document.getElementById('quizRestart').addEventListener('click', function () {
      step = 0; answers = [];
      resEl.classList.remove('show');
      bodyEl.style.display = 'block';
      render();
    });
    render();
  }

  // Checagem de sinais de risco do CNIS (envia checagem_inicio e checagem_conclusao ao dataLayer)
  var C = window.CHECK;
  var cCard = document.getElementById('chkCard');
  if (C && cCard) {
    var byId = function (id) { return document.getElementById(id); };
    var cQ = byId('chkQ'), cStep = byId('chkStep'), cHint = byId('chkHint'), cOpts = byId('chkOpts');
    var cNext = byId('chkNext'), cBack = byId('chkBack'), cBody = byId('chkBody'), cRes = byId('chkResult');
    var cProgWrap = byId('chkProgress');
    var cs = 0, ca = [], sel = [], started = false;
    window.dataLayer = window.dataLayer || [];
    cProgWrap.innerHTML = '';
    C.questions.forEach(function () { cProgWrap.appendChild(document.createElement('span')); });
    var cProg = cProgWrap.querySelectorAll('span');

    function markSel() {
      cOpts.querySelectorAll('button').forEach(function (b, j) { b.setAttribute('aria-pressed', sel.indexOf(j) > -1 ? 'true' : 'false'); });
      cNext.disabled = sel.length === 0;
    }
    function cRender() {
      var item = C.questions[cs];
      cStep.textContent = 'Pergunta ' + (cs + 1) + ' de ' + C.questions.length;
      cQ.textContent = item.q;
      cHint.textContent = item.hint || '';
      cHint.hidden = !item.hint;
      cOpts.innerHTML = '';
      cOpts.classList.toggle('multi', !!item.multi);
      sel = item.multi && Array.isArray(ca[cs]) ? ca[cs].slice() : [];
      item.opts.forEach(function (o, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.appendChild(document.createTextNode(o.t));
        if (o.d) { var sm = document.createElement('small'); sm.textContent = o.d; b.appendChild(sm); }
        b.addEventListener('click', function () { if (item.multi) toggle(i); else cAnswer(i); });
        cOpts.appendChild(b);
      });
      cNext.hidden = !item.multi;
      if (item.multi) markSel();
      cProg.forEach(function (p, i) { p.classList.toggle('done', i < cs); });
      cBack.style.display = cs > 0 ? 'inline-block' : 'none';
    }
    function toggle(i) {
      var item = C.questions[cs], last = item.opts.length - 1, k = sel.indexOf(i);
      if (k > -1) sel.splice(k, 1);
      else if (item.none && i === last) sel = [i];
      else {
        sel.push(i);
        var n = sel.indexOf(last);
        if (item.none && n > -1) sel.splice(n, 1);
      }
      markSel();
    }
    function begin() {
      if (!started) { started = true; window.dataLayer.push({ event: 'checagem_inicio' }); }
    }
    function advance() {
      cs++;
      if (cs < C.questions.length) cRender(); else cFinish();
    }
    function cAnswer(i) { begin(); ca[cs] = i; advance(); }
    cNext.addEventListener('click', function () {
      if (!sel.length) return;
      begin();
      ca[cs] = sel.slice().sort(function (x, y) { return x - y; });
      advance();
    });
    function cFinish() {
      cProg.forEach(function (p) { p.classList.add('done'); });
      cBody.style.display = 'none';
      var r = C.result(ca);
      byId('chkTitle').textContent = r.title;
      byId('chkText').textContent = r.text;
      var link = byId('chkLink');
      if (r.link) { link.href = r.link.href; link.textContent = r.link.label; link.style.display = 'block'; }
      else { link.style.display = 'none'; }
      var btn = byId('chkBtn');
      btn.href = 'https://wa.me/5511971694420?text=' + encodeURIComponent(r.wa || C.summary(ca));
      byId('chkBtnTxt').textContent = r.btn || 'Enviar minhas respostas pelo WhatsApp';
      btn.classList.toggle('btn-outline', !!r.quiet);
      btn.classList.toggle('btn-gold', !r.quiet);
      cRes.classList.add('show');
      var ev = { event: 'checagem_conclusao' }, extra = C.track ? C.track(ca) : {};
      for (var key in extra) { if (Object.prototype.hasOwnProperty.call(extra, key)) ev[key] = extra[key]; }
      window.dataLayer.push(ev);
      var top = cCard.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) cCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    cBack.addEventListener('click', function () {
      if (cs > 0) { cs--; ca.length = cs + 1; cRender(); }
    });
    byId('chkRestart').addEventListener('click', function () {
      cs = 0; ca = [];
      cRes.classList.remove('show');
      cBody.style.display = 'block';
      cRender();
    });
    cRender();
  }
})();
