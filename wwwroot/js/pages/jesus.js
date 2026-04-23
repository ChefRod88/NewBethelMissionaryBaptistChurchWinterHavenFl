// Hero word blur-in
window.addEventListener('load', () => {
  const words = document.querySelectorAll('.word');
  words.forEach((w, i) => setTimeout(() => w.classList.add('show'), 300 + i * 150));
});

// Hero video (mirrors inline script in Jesus.cshtml)
(function initJesusHeroVideo() {
  const wrap = document.getElementById('jesusHeroBg');
  const v = document.querySelector('.jesus-hero-video');
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
  v.addEventListener('error', function onVideoError() {
    wrap.classList.add('is-fallback');
  }, { once: true });
})();

// Parallax hero
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const bg = document.querySelector('.jesus-hero-video');
  if (bg) bg.style.transform = `translateY(${y * 0.3}px)`;
  const txt = document.querySelector('.jesus-hero-text-wrap');
  if (txt) txt.style.transform = `translateY(${y * 0.15}px)`;
}, { passive: true });

// Accordion
document.querySelectorAll('.faq-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.faq-item');
    const body = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
      openItem.querySelector('.faq-body').style.maxHeight = '0';
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
