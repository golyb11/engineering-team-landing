/**
 * src/animations/marquee.ts
 * ----------------------------------------------------------------------------
 * Infinite marquee controller.
 *
 *   - Duplicates the track once so the CSS `translateX(-50%)` loop appears
 *     seamless.
 *   - On hover, swaps the marquee class to slow it down and switches text
 *     from stroked → filled (driven by `.is-hover` in stack.css).
 *
 * Dependencies: none
 * Related CSS: src/styles/stack.css
 * ----------------------------------------------------------------------------
 */
interface MarqueeOptions {
  pauseOnHover?: boolean;
}

export function initMarquee({ pauseOnHover = true }: MarqueeOptions = {}): void {
  const root = document.querySelector<HTMLElement>('[data-marquee]');
  const track = root?.querySelector<HTMLElement>('[data-marquee-track]');
  if (!root || !track) return;

  // Duplicate track contents so the keyframe `translateX(-50%)` lands on a
  // perfect repeat — no visible seam.
  track.innerHTML += track.innerHTML;

  if (pauseOnHover) {
    root.addEventListener('mouseenter', () => {
      root.classList.add('is-hover', 'is-slow');
    });
    root.addEventListener('mouseleave', () => {
      root.classList.remove('is-hover', 'is-slow');
    });
  }
}
