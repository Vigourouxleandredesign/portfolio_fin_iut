/**
 * @file Vite configuration — multi-page app (MPA)
 * @description Builds each HTML file under pages/ as a separate route.
 *   `root` stays at the project root so `dist/pages/*.html` matches
 *   `public/_redirects` on Netlify; the plugin below reproduces that
 *   "/" → "/pages/index.html" redirect for local dev and preview.
 */
import { resolve } from 'node:path';
import { defineConfig, type Plugin } from 'vite';

const projectRoot = resolve(__dirname);

/**
 * Redirects the site root to the home page for `vite` and `vite preview`,
 * mirroring `public/_redirects` (Netlify-only, not read by these servers).
 */
function redirectRootToHome(): Plugin {
  const redirect = (
    req: { url?: string },
    res: { statusCode: number; setHeader: (name: string, value: string) => void; end: () => void },
    next: () => void,
  ): void => {
    if (req.url === '/') {
      res.statusCode = 302;
      res.setHeader('Location', '/pages/index.html');
      res.end();
      return;
    }
    next();
  };

  return {
    name: 'redirect-root-to-home',
    configureServer(server) {
      server.middlewares.use(redirect);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirect);
    },
  };
}

export default defineConfig({
  root: projectRoot,
  publicDir: resolve(projectRoot, 'public'),
  plugins: [redirectRootToHome()],
  // .glb (fractured bust model, features/three-scene/) isn't a built-in Vite asset type.
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
        evaluator: resolve(projectRoot, 'pages/evaluator.html'),
        heroLegacy: resolve(projectRoot, 'pages/hero-legacy.html'),
      },
    },
  },
});
