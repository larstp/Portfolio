/**
 * Scrolls to a document position using cubic easing.
 * Respects the user's reduced-motion preference.
 *
 * @param targetY - The vertical document position to reach.
 * @param duration - Animation duration in milliseconds.
 */
export function smoothScrollTo(targetY: number, duration = 800) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeInOutCubic(progress: number) {
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  function animate(currentTime: number) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      window.requestAnimationFrame(animate);
    }
  }

  window.requestAnimationFrame(animate);
}
