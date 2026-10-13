(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* language */
  var langBtn = $('#langBtn');
  function paintLang() { if (langBtn) langBtn.innerHTML = root.dataset.lang === 'en' ? '中 / <b>EN</b>' : '<b>中</b> / EN'; }
  paintLang();
  if (langBtn) langBtn.onclick = function () {
    root.dataset.lang = root.dataset.lang === 'en' ? 'zh' : 'en';
    root.lang = root.dataset.lang === 'en' ? 'en' : 'zh-CN';
    store('lang', root.dataset.lang); paintLang(); setKnob();
  };

  /* light / dark */
  var themeBtn = $('#themeBtn');
  if (themeBtn) themeBtn.onclick = function () {
    var dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark'; store('theme', root.dataset.theme);
  };

  /* mobile menu, header border, back to top */
  var burger = $('#burger'), links = $('#links');
  if (burger) {
    burger.onclick = function (e) { e.stopPropagation(); links.classList.toggle('open'); };
    document.addEventListener('click', function (e) { if (!links.contains(e.target)) links.classList.remove('open'); });
    addEventListener('keydown', function (e) { if (e.key === 'Escape') links.classList.remove('open'); });
  }
  var hdr = $('#hdr'), totop = $('#totop');
  addEventListener('scroll', function () {
    if (hdr) hdr.classList.toggle('scrolled', scrollY > 8);
    if (totop) totop.classList.toggle('show', scrollY > 500);
  }, { passive: true });
  if (totop) totop.onclick = function () { scrollTo({ top: 0, behavior: 'smooth' }); };

  /* gentle reveal on scroll */
  var rv = $$('.rv, .draw');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    rv.forEach(function (el, i) { el.style.transitionDelay = (el.classList.contains('rv') ? Math.min(i, 6) * 60 : 200) + 'ms'; io.observe(el); });
  } else rv.forEach(function (el) { el.classList.add('in'); });

  /* filter buttons on section pages: buttons carry data-filter, items carry data-f */
  $$('.filters').forEach(function (bar) {
    var list = $(bar.dataset.target);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      $$('button', bar).forEach(function (x) { x.classList.toggle('on', x === b); });
      $$('[data-f]', list).forEach(function (it) {
        var show = b.dataset.filter === 'all' || it.dataset.f === b.dataset.filter;
        it.style.display = show ? '' : 'none';
      });
    });
  });

  /* archive tabs: timeline / categories / tags */
  var tabs = $('#archTabs');
  function setKnob() {
    if (!tabs) return;
    var b = $('button.on', tabs), k = $('.knob', tabs);
    if (b && k) { k.style.left = b.offsetLeft + 'px'; k.style.width = b.offsetWidth + 'px'; }
  }
  function setView(v) {
    $$('button', tabs).forEach(function (b) { b.classList.toggle('on', b.dataset.view === v); });
    $$('.view').forEach(function (x) { x.classList.toggle('on', x.id === 'v-' + v); });
    setKnob();
  }
  if (tabs) {
    setView(tabs.dataset.initial || 'time');
    tabs.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) setView(b.dataset.view); });
    addEventListener('resize', setKnob);
  }

  /* friends: copy site info */
  var copyBtn = $('#copyBtn');
  if (copyBtn) copyBtn.onclick = function () {
    var done = function () { copyBtn.classList.add('done'); setTimeout(function () { copyBtn.classList.remove('done'); }, 1600); };
    try { navigator.clipboard.writeText($('#siteInfo').textContent).then(done, done); } catch (e) { done(); }
  };

  /* music: starts only on click, loops, quiet */
  var bgm = $('#bgm'), player = $('#player'), playBtn = $('#playBtn'), ico = $('#playIco');
  if (bgm && playBtn) {
    var PLAY = '<path d="M4 2.5v11l9-5.5z"/>', PAUSE = '<path d="M4 2.5h3v11H4zM9 2.5h3v11H9z"/>';
    var sync = function () { var on = !bgm.paused; player.classList.toggle('playing', on); ico.innerHTML = on ? PAUSE : PLAY; };
    playBtn.onclick = function () { bgm.volume = 0.35; if (bgm.paused) bgm.play().catch(function () { player.title = 'Music unavailable'; }); else bgm.pause(); };
    bgm.addEventListener('play', sync); bgm.addEventListener('pause', sync);
  }
})();
