/**
 * @file Unit — home-brush: reduced-motion no-op (B11), pigment tokens, solid gouache stroke (L2)
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { initHomeBrush } from '../../src/scripts/features/home-brush/home-brush';
import {
  drawStrokeSegment,
  drawStrokeTail,
  parseHexColor,
  sampleGradient,
} from '../../src/scripts/features/home-brush/home-brush-strokes';
import type { BrushPalette } from '../../src/scripts/features/home-brush/home-brush.types';

const palette: BrushPalette = {
  stops: [
    { r: 200, g: 100, b: 50 },
    { r: 220, g: 180, b: 80 },
    { r: 10, g: 70, b: 60 },
  ],
  shadow: 'rgb(0, 0, 0)',
};

function fakeContext(): CanvasRenderingContext2D & { strokes: string[] } {
  const strokes: string[] = [];
  const ctx = {
    strokes,
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(function (this: { strokeStyle: string }) {
      strokes.push(this.strokeStyle);
    }),
  };
  return ctx as unknown as CanvasRenderingContext2D & { strokes: string[] };
}

function mockMatchMedia(reducedMotion: boolean): void {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: reducedMotion && query.includes('prefers-reduced-motion'),
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }) as unknown as MediaQueryList,
  );
}

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.removeAttribute('style');
});

describe('home-brush', () => {
  it('no-ops under prefers-reduced-motion', () => {
    document.body.innerHTML = `<main><canvas data-home-brush></canvas></main>`;
    mockMatchMedia(true);
    const root = document.querySelector('main')!;
    const teardown = initHomeBrush(root);
    expect(() => teardown()).not.toThrow();
  });

  it('paints nothing when a pigment token is missing (no hex fallback)', () => {
    document.body.innerHTML = `<main><canvas data-home-brush></canvas></main>`;
    mockMatchMedia(false);
    const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
    const getContext = vi.spyOn(canvas, 'getContext');
    getContext.mockReturnValue({} as CanvasRenderingContext2D);
    const addListener = vi.spyOn(window, 'addEventListener');
    const teardown = initHomeBrush(document.querySelector('main')!);
    expect(addListener).not.toHaveBeenCalledWith('pointerdown', expect.anything());
    expect(() => teardown()).not.toThrow();
  });
});

describe('home-brush strokes', () => {
  it('parses #rgb and #rrggbb, rejects anything else', () => {
    expect(parseHexColor('#c8743f')).toEqual({ r: 200, g: 116, b: 63 });
    expect(parseHexColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHexColor('')).toBeNull();
    expect(parseHexColor('red')).toBeNull();
  });

  it('slides copper → gold → phtalo along the gradient', () => {
    expect(sampleGradient(palette.stops, 0)).toBe('rgb(200, 100, 50)');
    expect(sampleGradient(palette.stops, 0.5)).toBe('rgb(220, 180, 80)');
    expect(sampleGradient(palette.stops, 1)).toBe('rgb(10, 70, 60)');
  });

  it('draws one solid segment per call and colors it by distance travelled', () => {
    const ctx = fakeContext();
    const from = { x: 0, y: 0, pressure: 0.5 };
    const to = { x: 20, y: 0, pressure: 0.5 };
    drawStrokeSegment(ctx, from, to, palette, 0);
    drawStrokeSegment(ctx, from, to, palette, 5000);
    expect(ctx.strokes).toHaveLength(2);
    expect(ctx.strokes[0]).not.toBe(ctx.strokes[1]);
    expect(ctx.strokes[1]).toBe('rgb(10, 70, 60)');
  });

  it('draws nothing for an empty palette or a zero-length segment', () => {
    const ctx = fakeContext();
    const point = { x: 3, y: 3, pressure: 0.5 };
    drawStrokeSegment(ctx, point, point, palette, 0);
    drawStrokeSegment(ctx, point, { x: 30, y: 3, pressure: 0.5 }, { ...palette, stops: [] }, 0);
    drawStrokeTail(ctx, point, 0, { ...palette, stops: [] }, 10);
    expect(ctx.strokes).toHaveLength(0);
  });

  it('closes a gesture with a tapering tail', () => {
    const ctx = fakeContext();
    drawStrokeTail(ctx, { x: 0, y: 0, pressure: 0.8 }, 0, palette, 300);
    expect(ctx.strokes.length).toBeGreaterThan(3);
  });
});
