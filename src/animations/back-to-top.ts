/**
 * src/animations/back-to-top.ts
 * ----------------------------------------------------------------------------
 * Floating "scroll to top" button. Becomes visible after the user has
 * scrolled past 60% of the first viewport height. Scrolls smoothly using
 * the Lenis instance from smooth-scroll.ts if it exists (desktop, no
 * reduced-motion) and falls back to the native smooth scroll API on touch.
 * ----------------------------------------------------------------------------
 */
import { getSmoothScroll } from './smooth-scroll';

export function initBackToTop(): void {
  const btn = document.querySelector<HTMLButtonElement>('.to-top');
  if (!btn) return;

  const toggle = () => {
    const shown = window.scrollY > window.innerHeight * 0.6;
    btn.classList.toggle('is-visible', shown);
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', () => {
    const lenis = getSmoothScroll();
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
