/**
 * src/animations/smooth-scroll.ts
 * ----------------------------------------------------------------------------
 * Lenis smooth-scroll bootstrap. Hooks Lenis into GSAP's ticker so that
 * `ScrollTrigger` reacts to the smoothed scroll position rather than the raw
 * native scroll (which would otherwise look "snappier" than the page).
 *
 * Disabled on touch + reduced-motion devices by the caller (`main.ts`).
 *
 * Dependencies: lenis, ./gsap-setup
 * ----------------------------------------------------------------------------
 */
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap-setup';

let instance: Lenis | null = null;

export function initSmoothScroll(): Lenis | null {
  if (instance) return instance;

  instance = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1.4,
  });

  // Sync Lenis with GSAP's ticker for jitter-free ScrollTrigger updates.
  instance.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    instance?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return instance;
}

export function getSmoothScroll(): Lenis | null {
  return instance;
}
