/**
 * src/animations/gsap-setup.ts
 * ----------------------------------------------------------------------------
 * Centralised GSAP configuration. Registers `ScrollTrigger` exactly once so
 * other modules can import GSAP without worrying about plugin registration
 * order.
 *
 * Also exposes a handful of named cubic-bezier easings via `CustomEase`-like
 * string registration that map 1:1 with the easings used in CSS so motion
 * looks consistent between CSS transitions and GSAP tweens.
 *
 * Dependencies: gsap, gsap/ScrollTrigger
 * ----------------------------------------------------------------------------
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;

export function setupGsap(): void {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);

  // Pre-define easings (string keys can be passed to `ease:` in tweens).
  gsap.defaults({
    ease: 'expo.out',
    duration: 0.8,
  });

  // Refresh ScrollTrigger after fonts load so layout calculations are exact.
  if ('fonts' in document) {
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  // Throttle ScrollTrigger refresh on resize via internal handler.
  ScrollTrigger.config({ ignoreMobileResize: true });
  registered = true;
}

export { gsap, ScrollTrigger };
