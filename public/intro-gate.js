/*
 * Intro veil gate — runs before first paint (blocking, ~200 bytes, same origin so CSP-safe).
 * Marks <html> with `intro-skip` when the opening screen must not show: already seen in this
 * browser session, or the visitor asked for reduced motion. No secrets, no tracking.
 */
(function () {
  var root = document.documentElement;
  try {
    var seen = window.sessionStorage.getItem('lv-intro-seen') === '1';
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduced) root.classList.add('intro-skip');
  } catch (error) {
    /* storage blocked: show the veil, it lifts by itself */
  }
})();
