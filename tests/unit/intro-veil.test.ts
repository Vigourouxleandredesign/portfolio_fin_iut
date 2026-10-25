/**
 * @file Unit — intro veil timing (min visible, hero wait, cap, once per session)
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  initIntroVeil,
  MAX_WAIT_MS,
  MIN_VISIBLE_MS,
} from '../../src/scripts/features/intro-veil/intro-veil';

let veil: HTMLElement;
let origin = 0;
const now = (): number => Date.now() - origin;

beforeEach(() => {
  vi.useFakeTimers();
  origin = Date.now();
  document.documentElement.classList.remove('intro-skip');
  window.sessionStorage.clear();
  document.body.innerHTML = '<div class="intro-veil" data-intro-veil></div>';
  veil = document.querySelector<HTMLElement>('[data-intro-veil]') as HTMLElement;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('intro veil', () => {
  it('is removed at once when the gate marked the page as skipped', async () => {
    document.documentElement.classList.add('intro-skip');
    await initIntroVeil(veil, { now });
    expect(document.querySelector('[data-intro-veil]')).toBeNull();
  });

  it('never lifts before MIN_VISIBLE_MS, even if the hero is ready at once', async () => {
    const done = initIntroVeil(veil, { now, heroReady: Promise.resolve() });
    await vi.advanceTimersByTimeAsync(MIN_VISIBLE_MS - 100);
    expect(veil.classList.contains('is-leaving')).toBe(false);
    await vi.advanceTimersByTimeAsync(150);
    expect(veil.classList.contains('is-leaving')).toBe(true);
    await vi.advanceTimersByTimeAsync(1000);
    await done;
    expect(document.querySelector('[data-intro-veil]')).toBeNull();
  });

  it('waits for the 3D hero while it is within the cap', async () => {
    let resolveHero: () => void = () => undefined;
    const heroReady = new Promise<void>((resolve) => {
      resolveHero = resolve;
    });
    void initIntroVeil(veil, { now, heroReady });
    await vi.advanceTimersByTimeAsync(2000);
    expect(veil.classList.contains('is-leaving')).toBe(false);
    resolveHero();
    await vi.advanceTimersByTimeAsync(10);
    expect(veil.classList.contains('is-leaving')).toBe(true);
  });

  it('gives up waiting after MAX_WAIT_MS (slow device: the 3D pops in later)', async () => {
    void initIntroVeil(veil, { now, heroReady: new Promise(() => undefined) });
    await vi.advanceTimersByTimeAsync(MAX_WAIT_MS - 50);
    expect(veil.classList.contains('is-leaving')).toBe(false);
    await vi.advanceTimersByTimeAsync(100);
    expect(veil.classList.contains('is-leaving')).toBe(true);
  });

  it('remembers the intro was seen in this session', async () => {
    void initIntroVeil(veil, { now, heroReady: Promise.resolve() });
    await vi.advanceTimersByTimeAsync(MIN_VISIBLE_MS + 50);
    expect(window.sessionStorage.getItem('lv-intro-seen')).toBe('1');
  });
});
