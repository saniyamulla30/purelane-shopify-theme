(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal on scroll ---------- */
  var revs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
    revs.forEach(function (el) { ro.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- scene crossfade (scroll driven) ---------- */
  var scenes = [].slice.call(document.querySelectorAll('.scene'));
  var zones = [].slice.call(document.querySelectorAll('[data-scene]'));
  var stage = document.getElementById('scenes');
  var current = 0;
  function setScene(n) {
    if (n === current) return;
    current = n;
    scenes.forEach(function (s, i) { s.classList.toggle('on', i + 1 === n); });
    if (stage) stage.setAttribute('data-d', String(n));
  }
  function pickScene() {
    var focus = window.scrollY + window.innerHeight * 0.5, n = 1;
    for (var i = 0; i < zones.length; i++) {
      var z = zones[i], top = 0, el = z;
      while (el) { top += el.offsetTop; el = el.offsetParent; }
      if (top <= focus) n = parseInt(z.getAttribute('data-scene'), 10) || n;
    }
    setScene(n);
  }

  function onScroll() { pickScene(); }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  pickScene();
})();