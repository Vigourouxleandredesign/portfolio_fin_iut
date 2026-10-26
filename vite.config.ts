/**
 * @file Vite configuration — multi-page app (MPA)
 * @description Builds each HTML file under pages/ as a separate route.
 *   `root` stays at the project root so `dist/pages/*.html` matches
 *   `public/_redirects` on Netlify; the plugin below serves the same canonical URLs
 *   (`/`, `/projects/<slug>`, `/jury/<page>`…) for local dev and preview.
 */
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const projectRoot = resolve(__dirname);

/**
 * Registers each HTML file under pages/projects/ as a Rollup input.
 */
function projectDetailPageInputs(): Record<string, string> {
  const projectsDir = resolve(projectRoot, 'pages/projects');
  if (!existsSync(projectsDir)) {
    return {};
  }

  return Object.fromEntries(
    readdirSync(projectsDir)
      .filter((name) => name.endsWith('.html'))
      .map((name) => {
        const stem = name.replace(/\.html$/, '');
        return [`project-${stem}`, resolve(projectsDir, name)] as const;
      }),
  );
}

/**
 * Registers each HTML file under pages/jury/ (protected area) as a Rollup input.
 */
function juryPageInputs(): Record<string, string> {
  const juryDir = resolve(projectRoot, 'pages/jury');
  if (!existsSync(juryDir)) {
    return {};
  }

  return Object.fromEntries(
    readdirSync(juryDir)
      .filter((name) => name.endsWith('.html'))
      .map((name) => {
        const stem = name.replace(/\.html$/, '');
        return [`jury-${stem}`, resolve(juryDir, name)] as const;
      }),
  );
}

/** Canonical URL → source page (mirrors the `200` rewrites of `public/_redirects`). */
const CLEAN_URL_PAGES: Readonly<Record<string, string>> = {
  '/': '/pages/index.html',
  '/projects': '/pages/projects.html',
  '/cv': '/pages/cv.html',
  '/contact': '/pages/contact.html',
  '/jury': '/pages/jury/index.html',
};

/**
 * Maps a canonical URL (`/`, `/projects`, `/projects/<slug>`, `/jury/<page>`…) to its source page,
 * or `null` when the URL is not a page route (assets, unknown paths, `/pages/*` itself).
 */
export function resolveCleanUrl(pathname: string): string | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  const direct = CLEAN_URL_PAGES[path];
  if (direct) return direct;
  const nested = /^\/(projects|jury)\/([a-z0-9-]+)$/.exec(path);
  if (!nested) return null;
  const page = `/pages/${nested[1]}/${nested[2]}.html`;
  return existsSync(resolve(projectRoot, page.slice(1))) ? page : null;
}

/**
 * Serves canonical URLs for `vite` and `vite preview`, mirroring `public/_redirects`
 * (Netlify-only, not read by these servers). The rewrite is internal: the address bar keeps the
 * clean URL, exactly like the production `200` rewrites.
 */
function serveCleanUrls(): Plugin {
  const rewrite = (req: { url?: string }, _res: unknown, next: () => void): void => {
    const url = req.url ?? '';
    const queryStart = url.indexOf('?');
    const pathname = queryStart === -1 ? url : url.slice(0, queryStart);
    const search = queryStart === -1 ? '' : url.slice(queryStart);
    const page = resolveCleanUrl(pathname);
    if (page) req.url = `${page}${search}`;
    next();
  };

  return {
    name: 'serve-clean-urls',
    configureServer(server) {
      server.middlewares.use(rewrite);
    },
    configurePreviewServer(server) {
      server.middlewares.use(rewrite);
    },
  };
}

export default defineConfig({
  root: projectRoot,
  publicDir: resolve(projectRoot, 'public'),
  plugins: [serveCleanUrls()],
  // .glb (bust hero + project models) isn't a built-in Vite asset type.
  assetsInclude: ['**/*.glb'],
  server: {
    open: '/pages/index.html',
  },
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'pages/index.html'),
        projects: resolve(projectRoot, 'pages/projects.html'),
        cv: resolve(projectRoot, 'pages/cv.html'),
        contact: resolve(projectRoot, 'pages/contact.html'),
        notFound: resolve(projectRoot, 'pages/404.html'),
        ...projectDetailPageInputs(),
        ...juryPageInputs(),
      },
    },
  },
});
