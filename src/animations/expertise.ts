/**
 * src/animations/expertise.ts
 * ----------------------------------------------------------------------------
 * Expertise section animations.
 *
 *   - Toggles `data-theme="dark"` on <body> while the section is in the
 *     viewport, flipping the global palette via the tokens defined in
 *     `tokens.css`.
 *   - Fades + slides each `.expertise__item` in as it enters the viewport.
 *
 * The sticky-column "pinned" effect is implemented purely with CSS
 * `position: sticky;` — no JS pin needed, which keeps the page resilient
 * to Lenis quirks.
 *
 * Dependencies: ./gsap-setup
 * Related CSS: src/styles/expertise.css
 * ----------------------------------------------------------------------------
 */
import { gsap, ScrollTrigger } from './gsap-setup';

export function initExpertise(): void {
  const section = document.querySelector<HTMLElement>('.expertise');
  if (!section) return;

  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => document.body.setAttribute('data-theme', 'dark'),
    onEnterBack: () => document.body.setAttribute('data-theme', 'dark'),
    onLeave: () => document.body.setAttribute('data-theme', 'light'),
    onLeaveBack: () => document.body.setAttribute('data-theme', 'light'),
  });

  const items = section.querySelectorAll<HTMLElement>('.expertise__item');
  items.forEach((item, index) => {
    gsap.from(item, {
      opacity: 0,
      y: 60,
      duration: 1,
      ease: 'expo.out',
      delay: index * 0.05,
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}
