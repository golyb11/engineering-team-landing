/**
 * src/animations/hero.ts
 * ----------------------------------------------------------------------------
 * Hero section animations:
 *   - Splits headline lines and reveals them with a staggered translateY.
 *   - Reveals lead paragraph + meta line slightly after the headline.
 *   - Adds a soft mouse-driven parallax to the team illustration (desktop).
 *
 * Dependencies: ./gsap-setup
 * Related CSS: src/styles/hero.css
 * Related DOM: .hero, .hero__title-line, .hero__lead, .hero__meta, [data-parallax]
 * ----------------------------------------------------------------------------
 */
import { gsap } from './gsap-setup';

interface HeroOptions {
  disableParallax?: boolean;
}

export function initHero({ disableParallax = false }: HeroOptions = {}): void {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;

  // Wrap each title-line content in a span so we can translate it
  // independently from the overflow-hidden parent.
  hero.querySelectorAll<HTMLElement>('.hero__title-line').forEach((line) => {
    if (line.firstElementChild?.tagName === 'SPAN' && line.children.length === 1) return;
    const inner = document.createElement('span');
    inner.innerHTML = line.innerHTML;
    line.innerHTML = '';
    line.appendChild(inner);
  });

  const lines = hero.querySelectorAll<HTMLElement>('.hero__title-line > span');
  const lead = hero.querySelector<HTMLElement>('.hero__lead');
  const meta = hero.querySelector<HTMLElement>('.hero__meta');
  const media = hero.querySelector<HTMLElement>('[data-parallax]');

  const tl = gsap.timeline({ delay: 0.1 });

  tl.set([lines, lead, meta], { autoAlpha: 0 });
  tl.set(lines, { yPercent: 110 });

  tl.to(media, {
    autoAlpha: 1,
    scale: 1,
    duration: 1.4,
    ease: 'expo.out',
  });

  tl.to(
    lines,
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.08,
    },
    '-=1.1'
  );

  tl.to(
    lead,
    { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out' },
    '-=0.7'
  );
  tl.to(
    meta,
    { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out' },
    '-=0.6'
  );

  // Mouse parallax — desktop only.
  if (!disableParallax && media) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMove = (event: PointerEvent): void => {
      const { innerWidth, innerHeight } = window;
      targetX = (event.clientX - innerWidth / 2) / innerWidth;
      targetY = (event.clientY - innerHeight / 2) / innerHeight;
    };

    window.addEventListener('pointermove', handleMove, { passive: true });

    const tick = (): void => {
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      media.style.transform = `translate3d(${currentX * -24}px, ${currentY * -24}px, 0)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
}
