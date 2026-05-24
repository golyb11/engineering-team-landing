/**
 * src/animations/process.ts
 * ----------------------------------------------------------------------------
 * Process / workflow timeline animation.
 *
 * Behaviour:
 *   - A vertical progress line (`.process__line-fill`) fills with the accent
 *     colour as the user scrolls through the `.process` section (scrub-based
 *     ScrollTrigger driving scaleY from 0 → 1).
 *   - Each `.process__step` watches for its own intersection trigger. When the
 *     fill line reaches it, the step transitions from opacity:0 + translateX(40)
 *     to fully visible (class `.is-active`) and the indicator dot lights up.
 *
 * Dependencies: ./gsap-setup (GSAP + ScrollTrigger)
 * Related CSS: src/styles/process.css
 * Related DOM: .process, [data-timeline-fill], [data-timeline-step]
 * ----------------------------------------------------------------------------
 */
import { gsap, ScrollTrigger } from './gsap-setup';

export function initProcess(): void {
  const section = document.querySelector<HTMLElement>('.process');
  const fill = document.querySelector<HTMLElement>('[data-timeline-fill]');
  const steps = document.querySelectorAll<HTMLElement>('[data-timeline-step]');

  if (!section || !fill || !steps.length) return;

  // Animate the fill line as user scrolls through section
  gsap.to(fill, {
    scaleY: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: section,
      start: 'top 50%',
      end: 'bottom 60%',
      scrub: 0.3,
    },
  });

  // Each step becomes active when scrolled into view
  steps.forEach((step) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 75%',
      onEnter: () => step.classList.add('is-active'),
      onLeaveBack: () => step.classList.remove('is-active'),
    });
  });
}
