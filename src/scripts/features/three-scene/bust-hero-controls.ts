/**
 * @file Bust hero — Tweakpane dev panel
 * @module features/three-scene/bust-hero-controls
 * @description Live-tunable force field / spring parameters. Hidden by
 *   default — mount only with an explicit `?debug` query param.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import { Pane } from 'tweakpane';
import type { BustOrbitParams, BustPhysicsParams } from './bust-hero.types';

/**
 * Whether the debug panel should be mounted — opt-in via `?debug` only
 * (no longer auto-shown in the Vite dev server).
 */
export function shouldShowDebugPanel(): boolean {
  return new URLSearchParams(window.location.search).has('debug');
}

/**
 * Creates the Tweakpane panel bound to the given (mutable) physics + orbit
 * params.
 * @returns Teardown function disposing the panel
 */
export function createBustHeroPanel(
  params: BustPhysicsParams,
  orbitParams: BustOrbitParams,
): () => void {
  const pane = new Pane({ title: 'Bust hero — force field' });

  const forceFieldFolder = pane.addFolder({ title: 'Force field' });
  forceFieldFolder.addBinding(params, 'influenceRadius', {
    min: 0.1,
    max: 3,
    step: 0.05,
    label: 'radius',
  });
  forceFieldFolder.addBinding(params, 'pushStrength', { min: 0, max: 10, step: 0.05, label: 'push' });
  forceFieldFolder.addBinding(params, 'linearSpringStiffness', {
    min: 0,
    max: 60,
    step: 0.5,
    label: 'spring (pos)',
  });
  forceFieldFolder.addBinding(params, 'angularSpringStiffness', {
    min: 0,
    max: 30,
    step: 0.5,
    label: 'spring (rot)',
  });
  forceFieldFolder.addBinding(params, 'linearDamping', {
    min: 0,
    max: 20,
    step: 0.1,
    label: 'damping (pos)',
  });
  forceFieldFolder.addBinding(params, 'angularDamping', {
    min: 0,
    max: 20,
    step: 0.1,
    label: 'damping (rot)',
  });
  forceFieldFolder.addBinding(params, 'fragmentMass', { min: 0.05, max: 3, step: 0.05, label: 'mass' });

  const orbitFolder = pane.addFolder({ title: 'Orbit (right-click drag)' });
  orbitFolder.addBinding(orbitParams, 'sensitivity', {
    min: 0.02,
    max: 1,
    step: 0.01,
    label: 'sensitivity',
  });
  orbitFolder.addBinding(orbitParams, 'maxPitchDegrees', {
    min: 5,
    max: 85,
    step: 1,
    label: 'max pitch',
  });
  orbitFolder.addBinding(orbitParams, 'springBackDelaySeconds', {
    min: 0,
    max: 10,
    step: 0.5,
    label: 'spring-back delay (s)',
  });
  orbitFolder.addBinding(orbitParams, 'springBackDamping', {
    min: 0.5,
    max: 20,
    step: 0.1,
    label: 'spring-back',
  });

  const paneElement = pane.element;
  paneElement.style.position = 'fixed';
  paneElement.style.top = '5rem';
  paneElement.style.right = '1rem';
  paneElement.style.zIndex = '200';

  return () => {
    pane.dispose();
  };
}
