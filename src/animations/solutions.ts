/**
 * src/animations/solutions.ts
 * ----------------------------------------------------------------------------
 * Sticky stacking cards animation for the Solutions section.
 *
 * Behaviour:
 *   - The section acts as the ScrollTrigger container. As the user scrolls
 *     through it, each `.solutions__card` (already position:sticky via CSS)
 *     gets a slight scale-down and shadow increase to visually "press" into
 *     the deck as the next card slides over it.
 *   - Body theme is toggled to 'dark' while the section is in view.
 *   - Each card fades + slides in from below on first enter.
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

  // Animate each card in on scroll
  cards.forEach((card, index) => {
    gsap.from(card, {
      opacity: 0,
      y: 80,
      scale: 0.96,
      duration: 1,
      ease: 'expo.out',
      delay: index * 0.05,
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    });

    // For all but last card: scale down slightly as user scrolls past
    if (index < cards.length - 1) {
      ScrollTrigger.create({
        trigger: cards[index + 1],
        start: 'top bottom',
        end: 'top 30%',
        scrub: 0.5,
        animation: gsap.to(card, {
          scale: 0.95,
          filter: 'brightness(0.7)',
          duration: 1,
        }),
      });
    }
  });
}
