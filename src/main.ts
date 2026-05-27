/**
 * src/main.ts
 * ----------------------------------------------------------------------------
 * Application entry point. Orchestrates initialization of every progressive-
 * enhancement module in the correct order:
 *
 *   1. Apply theme synchronously (inlined head script handles first paint;
 *      initThemeToggle wires up the toggle button).
 *   2. Register GSAP plugins once (animations/gsap-setup).
 *   3. Initialise the scroll-progress bar so it tracks the preloader scroll too.
 *   4. Boot Lenis smooth-scroll (skipped on touch / reduced-motion devices).
 *   5. Initialise the custom cursor (desktop only).
 *   6. Run terminal preloader — it resolves once the console boot sequence
 *      completes and the reveal animation finishes.
 *   7. Wire section animations: Hero, Solutions, Process, Marquee, Magnetic,
 *      generic reveal, Stats counters, Team cards, Back-to-top button.
 *
 * Related files: index.html
 * ----------------------------------------------------------------------------
 */
import './styles/main.css';

import { setupGsap } from './animations/gsap-setup';
import { runPreloader } from './animations/preloader';
import { initSmoothScroll } from './animations/smooth-scroll';
import { initCursor } from './animations/cursor';
import { initHero } from './animations/hero';
import { initSolutions } from './animations/solutions';
import { initProcess } from './animations/process';
import { initMarquee } from './animations/marquee';
import { initMagnetic } from './animations/magnetic';
import { initReveal } from './animations/reveal';
import { initTeam } from './animations/team';
import { initStats } from './animations/stats';
import { initThemeToggle } from './animations/theme-toggle';
import { initScrollProgress } from './animations/scroll-progress';
import { initBackToTop } from './animations/back-to-top';

const isTouch =
  matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

async function bootstrap(): Promise<void> {
  // Wire the theme toggle button (the inlined <head> script already applied
  // the saved/system theme before first paint to avoid FOUC).
  initThemeToggle();

  setupGsap();
  initScrollProgress();

  // Custom cursor only makes sense on devices with a precise pointer.
  if (!isTouch) initCursor();

  // Smooth scroll is heavy on touch + drains battery — fall back to native.
  if (!isTouch && !prefersReducedMotion) initSmoothScroll();

  // Wait for preloader to finish before kicking off scroll-driven animations,
  // otherwise ScrollTrigger calculates positions against a 0-height viewport.
  await runPreloader({ skip: prefersReducedMotion });

  initHero({ disableParallax: isTouch || prefersReducedMotion });
  initSolutions();
  initProcess();
  initMarquee({ pauseOnHover: !isTouch });
  if (!isTouch && !prefersReducedMotion) initMagnetic();
  initReveal();

  initStats();
  initTeam();
  initBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
