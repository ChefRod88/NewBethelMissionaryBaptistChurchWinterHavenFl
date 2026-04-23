// Hero word blur-in
window.addEventListener('load', () => {
  const words = document.querySelectorAll('.word');
  words.forEach((w, i) => setTimeout(() => w.classList.add('show'), 300 + i * 150));
});

// Hero video: muted + play() for autoplay; gradient fallback on error or reduced motion
(function initAboutHeroVideo() {
  const wrap = document.getElementById('aboutHeroBg');
  const v = document.querySelector('.about-hero-video');
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

// Parallax hero background
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const bg = document.querySelector('.about-hero-video, .hero-bg-wrap img');
  if (bg) bg.style.transform = `translateY(${y * 0.3}px)`;
  const txt = document.querySelector('.about-hero-viewport .hero-text-wrap');
  if (txt) txt.style.transform = `translateY(${y * 0.15}px)`;
}, { passive: true });

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
