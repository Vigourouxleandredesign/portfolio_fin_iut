/**
 * @file Unit — GLB showcase camera fit
 */
import { describe, expect, it } from 'vitest';
import { showcaseCameraDistance } from '../../src/scripts/features/three-scene/glb-showcase';

describe('showcaseCameraDistance', () => {
  const box = { halfX: 0.5, halfY: 0.5, halfZ: 0.1 };

  it('pulls back when the view is narrower than the object', () => {
    const portrait = showcaseCameraDistance(box, 32, 0.7);
    const square = showcaseCameraDistance(box, 32, 1);
    expect(portrait).toBeGreaterThan(square);
  });

  it('keeps the object inside a padded frame', () => {
    const dist = showcaseCameraDistance(box, 32, 1, 1.22);
    const vFov = (32 * Math.PI) / 180;
    const visibleHalfY = dist * Math.tan(vFov / 2);
    expect(visibleHalfY).toBeGreaterThan(box.halfY);
  });
});
