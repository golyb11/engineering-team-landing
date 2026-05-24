/**
 * src/animations/magnetic.ts
 * ----------------------------------------------------------------------------
 * Magnetic button effect. Any element with `[data-magnetic]` will subtly
 * follow the cursor when within ~120px of its bounding rect, then snap back
 * with an elastic easing when the cursor leaves.
 *
 * Implementation:
 *   - Outer element receives a translation (the "pull").
 *   - Inner `.magnetic__inner` receives a stronger translation so the label
 *     feels weightier than the chrome.
 *
 * Dependencies: ./gsap-setup
 * ----------------------------------------------------------------------------
 */
import { gsap } from './gsap-setup';

const STRENGTH_OUTER = 0.35;
const STRENGTH_INNER = 0.55;
const ACTIVATION_PADDING = 80;

export function initMagnetic(): void {
  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const inner = el.querySelector<HTMLElement>('.magnetic__inner') ?? el;

    const handleMove = (event: PointerEvent): void => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const activation = Math.max(rect.width, rect.height) / 2 + ACTIVATION_PADDING;

      if (dist > activation) {
        reset();
        return;
      }

      gsap.to(el, {
        x: dx * STRENGTH_OUTER,
        y: dy * STRENGTH_OUTER,
        duration: 0.6,
        ease: 'power3.out',
      });
      gsap.to(inner, {
        x: dx * STRENGTH_INNER,
        y: dy * STRENGTH_INNER,
        duration: 0.6,
        ease: 'power3.out',
      });
    };

    const reset = (): void => {
      gsap.to([el, inner], {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    window.addEventListener('pointermove', handleMove, { passive: true });
    el.addEventListener('pointerleave', reset);
  });
}
