/**
 * When true, skip large autoplaying hero MP4s: reduced motion, Data Saver, or 2G.
 * Use with CSS fallbacks (gradient). Load before page-specific hero script.
 */
window.skipHeavyHeroVideo = function skipHeavyHeroVideo() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return true;
    }
    var c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!c) {
      return false;
    }
    if (c.saveData) {
      return true;
    }
    if (c.effectiveType === '2g' || c.effectiveType === 'slow-2g') {
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
};
