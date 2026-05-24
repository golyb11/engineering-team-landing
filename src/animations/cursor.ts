/**
 * src/animations/cursor.ts
 * ----------------------------------------------------------------------------
 * Custom cursor controller (desktop only).
 *
 * Implementation notes:
 *   - Dot follows the pointer 1:1 (no lerp) for precise targeting.
 *   - Ring lerps toward the dot ~18% per frame for a subtle drag.
 *   - Adds `.is-hover` when over any `[data-cursor-target]` element so CSS
 *     can scale + invert the ring without any per-frame JS work.
 *
 * Dependencies: none (pure DOM + rAF)
 * Related CSS: src/styles/cursor.css
 * ----------------------------------------------------------------------------
 */
export function initCursor(): void {
  const root = document.querySelector<HTMLElement>('[data-cursor]');
  if (!root) return;

  const dot = root.querySelector<HTMLElement>('.cursor__dot');
  const ring = root.querySelector<HTMLElement>('.cursor__ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const handleMove = (event: PointerEvent): void => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  };

  const handleEnter = (): void => root.classList.remove('is-hidden');
  const handleLeave = (): void => root.classList.add('is-hidden');

  const handleOver = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-cursor-target], a, button')) {
      root.classList.add('is-hover');
    }
  };
  const handleOut = (event: Event): void => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-cursor-target], a, button')) {
      root.classList.remove('is-hover');
    }
  };

  window.addEventListener('pointermove', handleMove, { passive: true });
  document.addEventListener('pointerenter', handleEnter);
  document.addEventListener('pointerleave', handleLeave);
  document.addEventListener('pointerover', handleOver);
  document.addEventListener('pointerout', handleOut);

  const tick = (): void => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
