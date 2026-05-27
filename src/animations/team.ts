/**
 * src/animations/team.ts
 * ----------------------------------------------------------------------------
 * Staggered reveal of team cards as they enter the viewport.
 * Uses ScrollTrigger.batch so multiple cards entering together are animated
 * in a single tick with a per-card stagger.
 * ----------------------------------------------------------------------------
 */
import { gsap, ScrollTrigger } from './gsap-setup';

export function initTeam(): void {
  const cards = gsap.utils.toArray<HTMLElement>('.team__card');
  if (!cards.length) return;

  gsap.set(cards, { y: 40, opacity: 0 });

  ScrollTrigger.batch(cards, {
    start: 'top 85%',
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
        overwrite: true,
      }),
    once: true,
  });
}
