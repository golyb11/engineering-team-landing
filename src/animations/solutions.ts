/**
 * src/animations/solutions.ts
 * ----------------------------------------------------------------------------
 * Sticky stacking cards animation for the Solutions section.
 *
 * Behaviour:
 *   - Each `.solutions__card` is `position:sticky` (CSS) with a generous
 *     `margin-block-end` so there is real scroll distance between cards.
 *   - As the next card approaches, the previous one scales down and dims
 *     smoothly via a long scrub window (feels like a deck being pressed).
 *   - First-enter fade/slide-up is one-way (no reverse) to avoid flicker
 *     when scrolling fast.
 *   - Body theme is toggled to 'dark' while the section is in view.
 *
 * Dependencies: ./gsap-setup (GSAP + ScrollTrigger)
 * Related CSS: src/styles/solutions.css
 * Related DOM: .solutions, [data-stacking-card]
 * ----------------------------------------------------------------------------
 */
import { gsap, ScrollTrigger } from './gsap-setup';

export function initSolutions(): void {
  const section = document.querySelector<HTMLElement>('.solutions');
  if (!section) return;

  const cards = section.querySelectorAll<HTMLElement>('[data-stacking-card]');

  // Toggle body to dark theme while solutions section is visible
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => document.body.setAttribute('data-theme', 'dark'),
    onEnterBack: () => document.body.setAttribute('data-theme', 'dark'),
    onLeave: () => document.body.setAttribute('data-theme', 'light'),
    onLeaveBack: () => document.body.setAttribute('data-theme', 'light'),
  });

  // Animate each card in on scroll (one-way, no reverse to prevent flicker)
  cards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 60,
      scale: 0.97,
      duration: 1.1,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });

    // For all but last card: long, smooth scale-down as next card approaches
    if (index < cards.length - 1) {
      ScrollTrigger.create({
        trigger: cards[index + 1],
        start: 'top 95%',
        end: 'top 35%',
        scrub: 1.2,
        animation: gsap.to(card, {
          scale: 0.94,
          filter: 'brightness(0.65)',
          ease: 'none',
        }),
      });
    }
  });
}
