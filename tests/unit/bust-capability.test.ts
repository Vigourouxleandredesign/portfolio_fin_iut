/**
 * @file Unit — which devices get the 3D bust (mouse only) and which cap the opening veil
 */
import { describe, expect, it } from 'vitest';
import {
  canMountBust,
  isConstrainedDevice,
} from '../../src/scripts/features/three-scene/bust-capability';

type Env = { queries?: string[]; saveData?: boolean; effectiveType?: string };

/** Minimal `Window` stand-in: `matchMedia` is true only for the listed queries. */
function fakeWindow({ queries = [], saveData, effectiveType }: Env = {}): Window {
  return {
    matchMedia: (query: string) => ({ matches: queries.includes(query) }),
    navigator: { connection: { saveData, effectiveType } },
  } as unknown as Window;
}

const MOUSE = '(hover: hover) and (pointer: fine)';
const TOUCH = '(hover: none) and (pointer: coarse)';
const REDUCED = '(prefers-reduced-motion: reduce)';

describe('canMountBust', () => {
  it('mounts on a mouse / trackpad', () => {
    expect(canMountBust(fakeWindow({ queries: [MOUSE] }))).toBe(true);
  });

  it('never mounts on touch (phones, tablets)', () => {
    expect(canMountBust(fakeWindow({ queries: [TOUCH] }))).toBe(false);
  });

  it('never mounts with reduced motion, even with a mouse', () => {
    expect(canMountBust(fakeWindow({ queries: [MOUSE, REDUCED] }))).toBe(false);
  });

  it('never mounts when the visitor saves data', () => {
    expect(canMountBust(fakeWindow({ queries: [MOUSE], saveData: true }))).toBe(false);
  });

  it('does not mount when media queries are unsupported', () => {
    expect(canMountBust({ navigator: {} } as unknown as Window)).toBe(false);
  });
});

describe('isConstrainedDevice', () => {
  it('flags touch devices, save-data and 2g/3g connections', () => {
    expect(isConstrainedDevice(fakeWindow({ queries: [TOUCH] }))).toBe(true);
    expect(isConstrainedDevice(fakeWindow({ queries: [MOUSE], saveData: true }))).toBe(true);
    expect(isConstrainedDevice(fakeWindow({ queries: [MOUSE], effectiveType: '3g' }))).toBe(true);
    expect(isConstrainedDevice(fakeWindow({ queries: [MOUSE], effectiveType: '2g' }))).toBe(true);
  });

  it('leaves desktop on a good connection alone', () => {
    expect(isConstrainedDevice(fakeWindow({ queries: [MOUSE], effectiveType: '4g' }))).toBe(false);
  });
});
