(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hstage = document.getElementById('hstage');
  if (!hstage) return;

  var hs = [].slice.call(hstage.querySelectorAll('.hslide'));
  var hd = [].slice.call(document.querySelectorAll('#hdots button'));
  var hi = 0, htimer = null;

  function hgo(n) {
    hi = (n + hs.length) % hs.length;
    hs.forEach(function (s, i) { s.classList.toggle('on', i === hi); });
    hd.forEach(function (d, i) { d.classList.toggle('on', i === hi); });
  }
  function hplay() { if (!htimer && !reduce) htimer = setInterval(function () { hgo(hi + 1); }, 3800); }
  function hstop() { if (htimer) { clearInterval(htimer); htimer = null; } }

  hd.forEach(function (d, i) {
    d.addEventListener('click', function () { hstop(); hgo(i); hplay(); });
  });
  hstage.addEventListener('mouseenter', hstop);
  hstage.addEventListener('mouseleave', hplay);

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? hplay() : hstop(); });
    }, { threshold: 0.2 }).observe(hstage);
  } else {
    hplay();
  }
})();