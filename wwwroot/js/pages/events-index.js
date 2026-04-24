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

// Bethel Beacon modal viewer
(function initBethelBeaconModal() {
  var modal = document.getElementById('bethelBeaconModal');
  if (!modal) return;

  var image = document.getElementById('bethelBeaconModalImage');
  var pageLabel = document.getElementById('bethelBeaconModalPageLabel');
  var prevButton = modal.querySelector('[data-beacon-nav="prev"]');
  var nextButton = modal.querySelector('[data-beacon-nav="next"]');
  var closeButtons = modal.querySelectorAll('[data-beacon-close]');
  var openButtons = document.querySelectorAll('[data-beacon-open]');

  if (!image || !pageLabel || !prevButton || !nextButton || openButtons.length === 0) return;

  var pages = [
    {
      key: 'front',
      label: 'Front page',
      src: modal.dataset.frontSrc,
      alt: modal.dataset.frontAlt
    },
    {
      key: 'back',
      label: 'Back page',
      src: modal.dataset.backSrc,
      alt: modal.dataset.backAlt
    }
  ].filter(function(page) {
    return page.src;
  });

  if (pages.length === 0) return;

  var currentIndex = 0;
  var lastTrigger = null;
  var previousBodyOverflow = '';

  function renderPage(index) {
    currentIndex = (index + pages.length) % pages.length;

    var page = pages[currentIndex];
    image.src = page.src;
    image.alt = page.alt || '';
    pageLabel.textContent = page.label;

    var showNavigation = pages.length > 1;
    prevButton.hidden = !showNavigation;
    nextButton.hidden = !showNavigation;
  }

  function openModal(pageKey, trigger) {
    var matchedIndex = pages.findIndex(function(page) { return page.key === pageKey; });
    lastTrigger = trigger || null;
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.hidden = false;
    renderPage(matchedIndex >= 0 ? matchedIndex : 0);
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = previousBodyOverflow;
    image.removeAttribute('src');

    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  openButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      openModal(button.dataset.beaconOpen, button);
    });
  });

  closeButtons.forEach(function(button) {
    button.addEventListener('click', closeModal);
  });

  prevButton.addEventListener('click', function() {
    renderPage(currentIndex - 1);
  });

  nextButton.addEventListener('click', function() {
    renderPage(currentIndex + 1);
  });

  document.addEventListener('keydown', function(event) {
    if (modal.hidden) return;

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (pages.length < 2) return;

    if (event.key === 'ArrowLeft') {
      renderPage(currentIndex - 1);
    }

    if (event.key === 'ArrowRight') {
      renderPage(currentIndex + 1);
    }
  });
})();
