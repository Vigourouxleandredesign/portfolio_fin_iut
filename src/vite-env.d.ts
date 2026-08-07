/**
 * @file Ambient module declarations — asset types not covered by `vite/client`
 * @description `vite/client` (see tsconfig.json) already declares `*.jpg`, `*.png`,
 *   `*.svg`, etc. `.glb` (3D models, used by features/three-scene/) needs its own
 *   declaration — Vite treats it as a static asset via `assetsInclude` in vite.config.ts.
 */

declare module '*.glb' {
  const src: string;
  export default src;
}
