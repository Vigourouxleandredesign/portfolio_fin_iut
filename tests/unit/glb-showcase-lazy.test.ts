/**
 * @file Unit — GLB showcases load lazily (near the viewport) and never on touch without a tap
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const counters = vi.hoisted(() => ({ three: 0 }));

// Module factories run once per file, so count loader *instantiations*: one per library load.
vi.mock('three', () => ({}));
vi.mock('three/addons/loaders/GLTFLoader.js', () => ({
  GLTFLoader: class {
    constructor() {
      counters.three += 1;
    }
    setDRACOLoader(): void {}
    loadAsync(): Promise<never> {
      return Promise.reject(new Error('not used'));
    }
  },
}));
vi.mock('three/addons/loaders/DRACOLoader.js', () => ({
  DRACOLoader: class {
    setDecoderPath(): void {}
    dispose(): void {}
  },
}));

import { initGlbShowcases } from '../../src/scripts/features/three-scene/glb-showcase';

const TOUCH = '(hover: none) and (pointer: coarse)';

function setMedia(queries: string[]): void {
  window.matchMedia = ((query: string) => ({
    matches: queries.includes(query),
    media: query,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
  })) as unknown as typeof window.matchMedia;
}

const VIEWER = `
  <div data-glb-showcase data-glb-src="/documents/elements/robot.glb">
    <canvas data-glb-canvas></canvas>
    <p class="glb-showcase__fallback">Chargement du robot…</p>
  </div>`;

let observerCallback: IntersectionObserverCallback | null = null;

beforeEach(() => {
  vi.useFakeTimers();
  counters.three = 0;
  observerCallback = null;
  document.body.innerHTML = '';
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('desktop', () => {
  it('downloads nothing until a viewer is near the viewport, then loads after the idle delay', async () => {
    setMedia([]);
    document.body.innerHTML = VIEWER;
    const handle = initGlbShowcases(document);

    await vi.advanceTimersByTimeAsync(3000);
    expect(counters.three).toBe(0);

    const target = document.querySelector('[data-glb-showcase]') as Element;
    observerCallback?.(
      [{ isIntersecting: false, target } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    await vi.advanceTimersByTimeAsync(3000);
    expect(counters.three).toBe(0);

    observerCallback?.(
      [{ isIntersecting: true, target } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );
    await vi.advanceTimersByTimeAsync(3000);
    expect(counters.three).toBe(1);
    handle.dispose();
  });
});

describe('touch device', () => {
  it('offers a button and downloads nothing until it is pressed', async () => {
    setMedia([TOUCH]);
    document.body.innerHTML = VIEWER;
    initGlbShowcases(document);

    const button = document.querySelector<HTMLButtonElement>('.glb-showcase__start');
    expect(button?.textContent).toBe('Afficher le modèle 3D');
    await vi.advanceTimersByTimeAsync(5000);
    expect(counters.three).toBe(0);

    button?.click();
    await vi.advanceTimersByTimeAsync(10);
    expect(counters.three).toBe(1);
  });

  it('does not nest a button inside a link (the portal): it only explains where to see the model', async () => {
    setMedia([TOUCH]);
    document.body.innerHTML = `<a href="https://example.test/">${VIEWER}</a>`;
    initGlbShowcases(document);

    expect(document.querySelector('.glb-showcase__start')).toBeNull();
    expect(document.querySelector('.glb-showcase__fallback')?.textContent).toBe(
      'Modèle 3D visible sur ordinateur',
    );
    await vi.advanceTimersByTimeAsync(5000);
    expect(counters.three).toBe(0);
  });
});
