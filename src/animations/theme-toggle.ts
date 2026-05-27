/**
 * src/animations/theme-toggle.ts
 * ----------------------------------------------------------------------------
 * Header button that flips data-theme between "light" and "dark" on both
 * <html> and <body>. Persists the choice in localStorage and respects
 * prefers-color-scheme on first visit. Also updates <meta name="theme-color">
 * so the iOS Safari status bar matches the active palette.
 *
 * The matching pre-paint anti-flicker script is inlined in index.html
 * <head>, so initial render is already correct before this module runs.
 * ----------------------------------------------------------------------------
 */
const STORAGE_KEY = 'et-theme';
type Theme = 'light' | 'dark';

const META_COLORS: Record<Theme, string> = {
  light: '#F4F1EA',
  dark: '#14161C',
};

function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  document.body?.setAttribute('data-theme', theme);
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = META_COLORS[theme];
}

function resolveInitial(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function initThemeToggle(): void {
  applyTheme(resolveInitial());

  const btn = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next: Theme =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });
}
