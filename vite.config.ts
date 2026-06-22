/**
 * @file Vite configuration — multi-page app (MPA)
 * @description Builds each HTML file under pages/ as a separate route.
 */
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const projectRoot = resolve(__dirname);

export default defineConfig({
  root: projectRoot,
  publicDir: resolve(projectRoot, 'public'),
  build: {
    outDir: resolve(projectRoot, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'pages/index.html'),
        evaluator: resolve(projectRoot, 'pages/evaluator.html'),
      },
    },
  },
});
