/**
 * @file Intro veil — lifts the opening screen once the hero is really ready
 * @description The veil (`[data-intro-veil]`, styled by `components/intro-veil.css`) hides the
 *   moment where the page would look unfinished: fonts swapping, hero images painting row by row,
 *   the 3D bust popping in over its static fallback. It lifts when fonts, hero images and the
 *   3D scene (if any) are ready — never before `MIN_VISIBLE_MS` after navigation start (so the
 *   monogram can finish drawing), never later than `MAX_WAIT_MS` (a slow device must not wait
 *   for the 3D). Shown once per browser session; `/intro-gate.js` skips it up front.
 * @see {@link ../../../styles/components/intro-veil.css}
 */

/** The monogram needs ~0.9 s to draw: lifting earlier would look like a glitch. */
export const MIN_VISIBLE_MS = 900;

/** Hard cap since navigation start: past this the page shows as-is (3D pops in later). */
export const MAX_WAIT_MS = 3200;

/** Matches the CSS transition of `.intro-veil` (700 ms) with a little margin. */
const LEAVE_MS = 800;

const SEEN_KEY = 'lv-intro-seen';

export interface IntroVeilOptions {
  /** Resolves when the 3D bust is mounted or has given up (never rejects). */
  heroReady?: Promise<unknown>;
  /** Milliseconds since navigation start; injectable for tests. */
  now?: () => number;
}

function imageReady(image: HTMLImageElement): Promise<void> {
  if (image.complete && image.naturalWidth > 0) {
    return image.decode().then(
      () => undefined,
      () => undefined,
    );
  }
  return new Promise((resolve) => {
    image.addEventListener('load', () => resolve(), { once: true });
    image.addEventListener('error', () => resolve(), { once: true });
  });
}

function fontsReady(): Promise<unknown> {
  return document.fonts?.ready ?? Promise.resolve();
}

function markSeen(): void {
  try {
    window.sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // Storage blocked (private mode): the veil may show again on the next page load. Harmless.
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, Math.max(0, ms)));
}

/**
 * Waits for the hero, then lifts and removes the veil.
 * Resolves when the veil is gone (or was never needed).
 */
export async function initIntroVeil(
  veil: HTMLElement,
  options: IntroVeilOptions = {},
): Promise<void> {
  if (document.documentElement.classList.contains('intro-skip')) {
    veil.remove();
    return;
  }

  const now = options.now ?? ((): number => performance.now());
  const heroImages = Array.from(
    document.querySelectorAll<HTMLImageElement>(
      '[data-hero-3d-atmosphere], [data-hero-3d-fallback]',
    ),
  );

  const ready = Promise.all([
    fontsReady(),
    ...heroImages.map(imageReady),
    options.heroReady ?? Promise.resolve(),
  ]);

  await Promise.race([ready, delay(MAX_WAIT_MS - now())]);
  await delay(MIN_VISIBLE_MS - now());

  veil.classList.add('is-leaving');
  markSeen();
  await delay(LEAVE_MS);
  veil.remove();
}
