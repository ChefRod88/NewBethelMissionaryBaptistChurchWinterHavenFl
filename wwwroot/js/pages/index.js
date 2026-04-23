// Hero word blur-in
window.addEventListener('load', () => {
  const words = document.querySelectorAll('.word');
  words.forEach((w, i) => setTimeout(() => w.classList.add('show'), 300 + i * 150));
});

// Parallax hero background
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const bg = document.querySelector('.hero-video, .hero-bg-wrap img');
  if (bg) bg.style.transform = `translateY(${y * 0.3}px)`;
  const txt = document.querySelector('.hero-text-wrap');
  if (txt) txt.style.transform = `translateY(${y * 0.15}px)`;
}, { passive: true });

// Hero video: respect reduced motion / save-data; otherwise force muted + play() for reliable autoplay
(function () {
  const heroVid = document.querySelector('.hero-video');
  const wrap = document.getElementById('heroBgWrap');
  if (!heroVid) return;

  if (typeof window.skipHeavyHeroVideo === 'function' && window.skipHeavyHeroVideo()) {
    heroVid.pause();
    heroVid.querySelectorAll('source').forEach(function (s) { s.remove(); });
    heroVid.removeAttribute('src');
    heroVid.load();
    if (wrap) wrap.classList.add('hero-bg-fallback');
    return;
  }

  heroVid.muted = true;
  heroVid.defaultMuted = true;
  heroVid.setAttribute('muted', '');

  // Faster, more dynamic hero motion (motionglass.mp4 is subtle at 1×)
  var HERO_PLAYBACK_RATE = 1.75;
  function applyHeroPlaybackRate() {
    try {
      heroVid.playbackRate = HERO_PLAYBACK_RATE;
    } catch (e) { /* ignore */ }
  }
  applyHeroPlaybackRate();
  heroVid.addEventListener('loadedmetadata', applyHeroPlaybackRate, { once: true });

  var tryPlay = function () {
    applyHeroPlaybackRate();
    heroVid.play()
      .then(function () { applyHeroPlaybackRate(); })
      .catch(function () {});
  };
  heroVid.addEventListener('loadeddata', tryPlay, { once: true });
  heroVid.addEventListener('canplay', tryPlay, { once: true });
  tryPlay();
  if (wrap) {
    heroVid.addEventListener('error', function () { wrap.classList.add('hero-bg-fallback'); }, { once: true });
  }
})();

// Card loop videos: muted autoplay; drop sources when skipping heavy video (same as hero policy)
(function () {
  document.querySelectorAll('.card-img-media').forEach(function (v) {
    if (typeof window.skipHeavyHeroVideo === 'function' && window.skipHeavyHeroVideo()) {
      v.pause();
      v.querySelectorAll('source').forEach(function (s) { s.remove(); });
      v.removeAttribute('src');
      v.load();
      v.style.display = 'none';
      return;
    }
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    var play = function () { v.play().catch(function () {}); };
    v.addEventListener('loadeddata', play, { once: true });
    v.addEventListener('canplay', play, { once: true });
    play();
  });
})();

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
