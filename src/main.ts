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
 *   6. Run terminal preloader.
 *   7. Wire section animations: Hero, Solutions, Process, Marquee, Magnetic,
 *      generic reveal, Stats counters, Back-to-top button.
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
import { initStats } from './animations/stats';
import { initThemeToggle } from './animations/theme-toggle';
import { initScrollProgress } from './animations/scroll-progress';
import { initBackToTop } from './animations/back-to-top';

const isTouch =
  matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

async function bootstrap(): Promise<void> {
  initThemeToggle();

  setupGsap();
  initScrollProgress();

  if (!isTouch) initCursor();
  if (!isTouch && !prefersReducedMotion) initSmoothScroll();

  await runPreloader({ skip: prefersReducedMotion });

  initHero({ disableParallax: isTouch || prefersReducedMotion });
  initSolutions();
  initProcess();
  initMarquee({ pauseOnHover: !isTouch });
  if (!isTouch && !prefersReducedMotion) initMagnetic();
  initReveal();

  initStats();
  initBackToTop();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
