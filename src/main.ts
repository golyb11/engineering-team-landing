/**
 * src/main.ts
 * ----------------------------------------------------------------------------
 * Application entry point. Orchestrates initialization of every progressive-
 * enhancement module in the correct order:
 *
 *   1. Register GSAP plugins once (animations/gsap-setup).
 *   2. Run preloader counter — it resolves once the DOM is interactive.
 *   3. Boot Lenis smooth-scroll (skipped on touch / reduced-motion devices).
 *   4. Initialise the custom cursor (desktop only).
 *   5. Wire section animations: Hero, Expertise, Stack marquee, Footer magnetic
 *      button, generic scroll-reveal.
 *
 * Why a single entry?
 *   - Keeps the dev experience zero-config: `npm run dev` just works.
 *   - Vite tree-shakes unused exports — splitting into many entries would
 *     hurt cache locality without measurable benefit at this size.
 *
 * Dependencies:
 *   - ./animations/gsap-setup    (GSAP + ScrollTrigger registration)
 *   - ./animations/preloader     (counter & curtain reveal)
 *   - ./animations/smooth-scroll (Lenis bootstrap, syncs with ScrollTrigger)
 *   - ./animations/cursor        (custom cursor with hover state)
 *   - ./animations/hero          (parallax + headline reveal)
 *   - ./animations/expertise     (pinned layout + theme invert)
 *   - ./animations/marquee       (infinite stack ticker)
 *   - ./animations/magnetic      (footer CTA magnetic effect)
 *   - ./animations/reveal        (generic [data-reveal] fade-in-up)
 *   - ./styles/main.css          (global tokens + section styles)
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
import { initExpertise } from './animations/expertise';
import { initMarquee } from './animations/marquee';
import { initMagnetic } from './animations/magnetic';
import { initReveal } from './animations/reveal';

const isTouch =
  matchMedia('(hover: none)').matches || 'ontouchstart' in window;
const prefersReducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

async function bootstrap(): Promise<void> {
  setupGsap();

  // Custom cursor only makes sense on devices with a precise pointer.
  if (!isTouch) initCursor();

  // Smooth scroll is heavy on touch + drains battery — fall back to native.
  if (!isTouch && !prefersReducedMotion) initSmoothScroll();

  // Wait for preloader to finish before kicking off scroll-driven animations,
  // otherwise ScrollTrigger calculates positions against a 0-height viewport.
  await runPreloader({ skip: prefersReducedMotion });

  initHero({ disableParallax: isTouch || prefersReducedMotion });
  initExpertise();
  initMarquee({ pauseOnHover: !isTouch });
  if (!isTouch && !prefersReducedMotion) initMagnetic();
  initReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
} else {
  bootstrap();
}
