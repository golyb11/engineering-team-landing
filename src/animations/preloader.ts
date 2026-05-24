/**
 * src/animations/preloader.ts
 * ----------------------------------------------------------------------------
 * Terminal-style preloader controller.
 *
 * Behaviour:
 *   1. Sequentially reveals console-style lines (opacity + translateY) with
 *      stagger timing, simulating a system boot sequence (~1.5-2s total).
 *   2. After all lines are visible, the entire preloader screen performs a
 *      combined scale(1.05) + clipPath reveal, creating a dramatic "system
 *      ready → world opens" transition.
 *   3. Resolves returned Promise so downstream initialisers can wire
 *      ScrollTrigger against an already-laid-out DOM.
 *
 * `skip` short-circuits the animation for users with
 * `prefers-reduced-motion: reduce`.
 *
 * Dependencies: ./gsap-setup
 * Related DOM: .preloader, [data-preloader-line]
 * Related CSS: src/styles/preloader.css
 * ----------------------------------------------------------------------------
 */
import { gsap } from './gsap-setup';

interface PreloaderOptions {
  skip?: boolean;
}

export function runPreloader({ skip = false }: PreloaderOptions = {}): Promise<void> {
  const root = document.querySelector<HTMLElement>('.preloader');
  const lines = document.querySelectorAll<HTMLElement>('[data-preloader-line]');

  if (!root) return Promise.resolve();

  if (skip) {
    root.classList.add('is-hidden');
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        root.classList.add('is-hidden');
        resolve();
      },
    });

    // Sequentially reveal each terminal line
    tl.to(lines, {
      opacity: 1,
      y: 0,
      duration: 0.15,
      stagger: 0.2,
      ease: 'power1.out',
    });

    // Hold briefly so user can read "[OK]"
    tl.to({}, { duration: 0.4 });

    // Dramatic reveal: scale up slightly then clip away
    tl.to(root, {
      scale: 1.05,
      duration: 0.5,
      ease: 'power2.in',
    })
      .to(
        root,
        {
          clipPath: 'inset(0 0 100% 0)',
          duration: 0.7,
          ease: 'expo.inOut',
        },
        '-=0.3'
      )
      .set(root, { autoAlpha: 0 });
  });
}
