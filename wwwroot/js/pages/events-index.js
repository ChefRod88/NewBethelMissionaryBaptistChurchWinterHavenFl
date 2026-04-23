// Hero video: muted + play() for autoplay; original gradient on error or reduced motion
(function initEventsHeroVideo() {
  const wrap = document.getElementById('eventsHeroBg');
  const v = document.querySelector('.ev-hero-video');
  if (!wrap || !v) return;
  if (typeof window.skipHeavyHeroVideo === 'function' && window.skipHeavyHeroVideo()) {
    v.pause();
    v.removeAttribute('src');
    v.load();
    wrap.classList.add('is-fallback');
    return;
  }
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute('muted', '');
  const tryPlay = function tryPlay() { v.play().catch(function () {}); };
  v.addEventListener('loadeddata', tryPlay, { once: true });
  v.addEventListener('canplay', tryPlay, { once: true });
  tryPlay();
  v.addEventListener('error', function onErr() {
    wrap.classList.add('is-fallback');
  }, { once: true });
})();

// Card scroll reveal
(function(){
  var obs=new IntersectionObserver(function(e){e.forEach(function(x,i){if(x.isIntersecting)setTimeout(function(){x.target.classList.add('visible')},i*80)})},{threshold:.08});
  document.querySelectorAll('.ev-card').forEach(function(el){obs.observe(el)});
})();
