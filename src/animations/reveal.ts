/**
 * src/animations/reveal.ts
 * ----------------------------------------------------------------------------
 * Generic scroll reveal. Adds `.is-revealed` class to any `[data-reveal]`
 * element when it enters the viewport, triggering the CSS transition defined
 * in `utilities.css`.
 *
 * Uses native IntersectionObserver — zero animation library overhead.
 *
 * Dependencies: none
 * Related CSS: src/styles/utilities.css
 * ----------------------------------------------------------------------------
 */
export function initReveal(): void {
  const targets = document.querySelectorAll<HTMLElement>('[data-reveal]');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));
}
