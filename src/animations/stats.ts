/**
 * src/animations/stats.ts
 * ----------------------------------------------------------------------------
 * Animated number counters. Each .stats__value reads:
 *   data-target   numeric target value
 *   data-prefix   optional accent prefix (e.g. "<")
 *   data-suffix   optional accent suffix (e.g. "+", "/100", " s")
 *   data-decimals number of decimal places (default 0)
 * Counts up once when the value enters the viewport.
 * ----------------------------------------------------------------------------
 */
import { gsap, ScrollTrigger } from './gsap-setup';

export function initStats(): void {
  const values = gsap.utils.toArray<HTMLElement>('.stats__value');
  if (!values.length) return;

  values.forEach((el) => {
    const target = Number(el.dataset.target ?? 0);
    const prefix = el.dataset.prefix ?? '';
    const suffix = el.dataset.suffix ?? '';
    const decimals = Number(el.dataset.decimals ?? 0);
    const state = { v: 0 };

    const render = () => {
      el.innerHTML =
        (prefix ? `<span class="stats__prefix">${prefix}</span>` : '') +
        state.v.toFixed(decimals) +
        (suffix ? `<span class="stats__suffix">${suffix}</span>` : '');
    };

    render();

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(state, {
          v: target,
          duration: 2,
          ease: 'expo.out',
          onUpdate: render,
        });
      },
    });
  });
}
