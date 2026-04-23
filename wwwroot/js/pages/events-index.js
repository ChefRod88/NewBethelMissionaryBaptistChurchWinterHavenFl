// Header word blur-in
window.addEventListener('load', () => {
  const words = document.querySelectorAll('.ev-eyebrow, .ev-title-word');
  words.forEach((w, i) => setTimeout(() => w.classList.add('show'), 300 + i * 150));
});

// Card scroll reveal
(function(){
  var obs=new IntersectionObserver(function(e){e.forEach(function(x,i){if(x.isIntersecting)setTimeout(function(){x.target.classList.add('visible')},i*80)})},{threshold:.08});
  document.querySelectorAll('.ev-card').forEach(function(el){obs.observe(el)});
})();
