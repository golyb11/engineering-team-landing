/**
 * server.js
 * ----------------------------------------------------------------------------
 * Tiny Express static server for production deploys on Render.com (free tier).
 *
 * Purpose:
 *   - Serve the pre-built `dist/` directory with gzip/deflate compression,
 *     aggressive caching for hashed assets, and HTML no-cache to ensure the
 *     latest entry-point is always picked up.
 *   - Provide the fastest possible cold start: no framework boot-up beyond
 *     Express, no view engine, no DB, no auth middleware.
 *
 * Why Express + compression rather than `vite preview`?
 *   - `vite preview` is a dev tool, not intended for production traffic.
 *   - Express is industry-standard, ~50ms cold start on Render free tier.
 *
 * Run with: `npm start` (after `npm run build`).
 *
 * Dependencies: express, compression
 * Related files: vite.config.js, package.json (scripts.start)
 * ----------------------------------------------------------------------------
 */
import express from 'express';
import compression from 'compression';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3000;

const app = express();

app.disable('x-powered-by');
app.use(compression());

// Static assets with hashed filenames -> immutable, year-long cache.
app.use(
  '/assets',
  express.static(path.join(DIST_DIR, 'assets'), {
    immutable: true,
    maxAge: '365d',
  })
);

// Everything else (favicon, illustration, manifest) — 1 day cache.
app.use(
  express.static(DIST_DIR, {
    maxAge: '1d',
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// SPA fallback (single-page, so any unknown path returns index.html).
app.get('*', (_req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] Engineering Team landing live on :${PORT}`);
});
