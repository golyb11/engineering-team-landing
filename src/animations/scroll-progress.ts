/**
 * src/animations/scroll-progress.ts
 * ----------------------------------------------------------------------------
 * Top-of-page reading progress line. Reads native scroll position through
 * requestAnimationFrame; this works equally on touch devices (Lenis is
 * disabled there) and on desktop (Lenis still updates the native scroll).
 * ----------------------------------------------------------------------------
 */
export function initScrollProgress(): void {
  const bar = document.querySelector<HTMLElement>('.scroll-progress');
  if (!bar) return;

  let ticking = false;
  const update = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    bar.style.inlineSize = `${pct}%`;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );
  window.addEventListener('resize', update, { passive: true });
  update();
}
