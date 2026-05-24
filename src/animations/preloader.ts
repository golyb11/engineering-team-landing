/**
 * src/animations/preloader.ts
 * ----------------------------------------------------------------------------
 * Preloader controller.
 *
 * Behaviour:
 *   1. Animates a counter from 0 → 100 in roughly 1.4 seconds.
 *   2. Once the counter hits 100, collapses the overlay upward
 *      (clip-path inset top → bottom) revealing the page beneath.
 *   3. Resolves the returned Promise so downstream initialisers can wire
 *      ScrollTrigger against an already-laid-out DOM.
 *
 * `skip` short-circuits the animation for users with
 * `prefers-reduced-motion: reduce`.
 *
 * Dependencies: ./gsap-setup
 * Related DOM: .preloader, [data-preloader-count]
 * ----------------------------------------------------------------------------
 */
import { gsap } from './gsap-setup';

interface PreloaderOptions {
  skip?: boolean;
}

export function runPreloader({ skip = false }: PreloaderOptions = {}): Promise<void> {
  const root = document.querySelector<HTMLElement>('.preloader');
  const countEl = document.querySelector<HTMLElement>('[data-preloader-count]');

  if (!root) return Promise.resolve();

  if (skip) {
    root.classList.add('is-hidden');
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const counter = { value: 0 };
    const tl = gsap.timeline({
      defaults: { ease: 'expo.inOut' },
      onComplete: () => {
        root.classList.add('is-hidden');
        resolve();
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (countEl) countEl.textContent = String(Math.round(counter.value));
      },
    })
      .to(root, {
        duration: 0.9,
        clipPath: 'inset(0 0 100% 0)',
        ease: 'expo.inOut',
      })
      .set(root, { autoAlpha: 0 });
  });
}
