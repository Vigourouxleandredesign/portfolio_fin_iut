/**
 * @file Project screenshots — reproducible captures of live demos
 * @description Captures desktop (1440×900) and mobile (390×844) screenshots of
 *   each project demo into `src/assets/projects/<slug>/shots/`. Uses the
 *   Playwright already installed as a devDependency (no new dependency).
 *   Usage:
 *     node scripts/capture-project-shots.mjs                 # all live targets
 *     node scripts/capture-project-shots.mjs lab-horizon     # one slug
 *     node scripts/capture-project-shots.mjs magicallab --headed   # WebGL needs a real GPU
 *   Local targets (Docker / Spring Boot) need the app running first — see
 *   `LOCAL_TARGETS` below. Only public, non-personal screens are captured.
 * @see {@link ../docs/content/assets-kit.md}
 */
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

async function loadChromium() {
  try {
    return (await import('@playwright/test')).chromium;
  } catch {
    return (await import('playwright')).chromium;
  }
}

/** @typedef {{ slug: string, name: string, url: string, wait?: number, devices?: ('desktop'|'mobile')[], fullPage?: boolean }} ShotTarget */

/** @type {ShotTarget[]} */
const LIVE_TARGETS = [
  { slug: 'visualcom', name: 'home', url: 'https://visualcom.nc/', fullPage: true },
  { slug: 'village-jeunes', name: 'accueil', url: 'https://villagejeunes.nc/' },
  { slug: 'pacific-dataviz', name: 'home', url: 'https://leandredatavizchallenge.figma.site/', wait: 6000, fullPage: true },
];

/**
 * Need a real GPU / camera: run on your own machine with `--headed`-capable
 * Chromium (headless WebGL renders black, AR start screen renders blank).
 * @type {ShotTarget[]}
 */
const GPU_TARGETS = [
  { slug: 'magicallab', name: 'scene', url: 'https://magicallab.netlify.app/', wait: 9000 },
  { slug: 'micromonde', name: 'parcours', url: 'https://micromonde-ar.netlify.app/', wait: 5000, devices: ['mobile'] },
];

/** Cookie banners: refuse before shooting (no consent given on the user's behalf). */
const CONSENT_BUTTONS = ['Refuser', 'Tout refuser', 'Reject all', 'Decline'];

/** @type {ShotTarget[]} — run only when the app is up locally */
const LOCAL_TARGETS = [
  // docker compose up -d (Projet SAE 501) → http://localhost:8080
  { slug: 'lab-horizon', name: 'accueil', url: 'http://localhost:8080/', wait: 4000 },
  { slug: 'lab-horizon', name: 'recherche', url: 'http://localhost:8080/recherche', wait: 4000 },
  // Spring Boot (JAVA (SpringBoot)/tdSpringBoot) → http://localhost:8080 (lancer l’un OU l’autre)
  // { slug: 'back-springboot', name: 'login', url: 'http://localhost:8080/login', devices: ['desktop'] },
  // HyperLoop (ng serve) → http://localhost:4200/fr/
  // { slug: 'hyperloop', name: 'home', url: 'http://localhost:4200/fr/' },
];

const VIEWPORTS = {
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
  mobile: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
};

const MAX_FULL_PAGE_HEIGHT = 5400;

async function main() {
  const only = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const all = [...LIVE_TARGETS, ...GPU_TARGETS, ...LOCAL_TARGETS];
  const targets = only ? all.filter((t) => t.slug === only) : LIVE_TARGETS;
  if (targets.length === 0) {
    console.error(`[shots] No target for "${only}".`);
    process.exit(1);
  }

  const chromium = await loadChromium();
  const headed = process.argv.includes('--headed');
  const browser = await chromium.launch({ headless: !headed, args: ['--ignore-gpu-blocklist', '--enable-webgl'] });

  for (const target of targets) {
    const outDir = resolve(process.cwd(), 'src/assets/projects', target.slug, 'shots');
    mkdirSync(outDir, { recursive: true });
    for (const device of target.devices ?? ['desktop', 'mobile']) {
      const context = await browser.newContext({ viewport: VIEWPORTS[device], ...VIEWPORTS[device], locale: 'fr-FR' });
      const page = await context.newPage();
      try {
        await page.goto(target.url, { waitUntil: 'networkidle', timeout: 45_000 });
      } catch {
        await page.goto(target.url, { waitUntil: 'load', timeout: 45_000 });
      }
      for (const label of CONSENT_BUTTONS) {
        const button = page.getByRole('button', { name: label, exact: true }).first();
        if (await button.isVisible().catch(() => false)) {
          await button.click().catch(() => undefined);
          break;
        }
      }
      await page.waitForTimeout(target.wait ?? 2500);
      const base = `${target.slug}-${target.name}-${device}`;
      await page.screenshot({ path: resolve(outDir, `${base}.jpg`), type: 'jpeg', quality: 82 });
      if (target.fullPage) {
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.screenshot({
          path: resolve(outDir, `${base}-full.jpg`),
          type: 'jpeg',
          quality: 78,
          clip: { x: 0, y: 0, width: VIEWPORTS[device].width, height: Math.min(height, MAX_FULL_PAGE_HEIGHT) },
          fullPage: true,
        });
      }
      console.log(`[shots] ${target.slug}/${base}`);
      await context.close();
    }
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
