/**
 * vite.config.js
 * ----------------------------------------------------------------------------
 * Vite build configuration for the Engineering Team landing page.
 *
 * Purpose:
 *   - Produce a fully static `dist/` bundle that can be served by either
 *     `vite preview`, any static CDN, or the lightweight Express server
 *     defined in `server.js` (used on Render.com free tier).
 *
 * Key decisions:
 *   - `base: './'` keeps all asset URLs relative so the build works whether
 *     served from `/` or a sub-path.
 *   - Aggressive minification with esbuild for smallest bundle (Lighthouse 100).
 *   - Manual chunk for `gsap` so the main bundle stays small and the animation
 *     library can be cached separately on subsequent visits.
 *   - `assetsInlineLimit` kept at default (4 KiB) — only small icons are
 *     inlined; the large team illustration stays as a separately-cached file.
 *
 * Dependencies: vite
 * Related files: index.html, server.js, package.json
 * ----------------------------------------------------------------------------
 */
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          lenis: ['lenis'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
});
