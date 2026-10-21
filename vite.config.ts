/**
 * @file Vite configuration — multi-page app (MPA)
 * @description Builds each HTML file under pages/ as a separate route.
 *   `root` stays at the project root so `dist/pages/*.html` matches
 *   `public/_redirects` on Netlify; the plugin below reproduces that
 *   "/" → "/pages/index.html" redirect for local dev and preview.
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
        ...projectDetailPageInputs(),
      },
    },
  },
});
