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

// Pause video for reduced-motion preference or slow connections
const heroVid = document.querySelector('.hero-video');
if (heroVid) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    heroVid.pause();
  }
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g')) {
    heroVid.style.display = 'none';
    heroVid.removeAttribute('src');
    heroVid.load();
  }
}

// Scroll reveal
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
