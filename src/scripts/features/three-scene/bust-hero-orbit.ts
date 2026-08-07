/**
 * @file Bust hero — right-click-drag camera orbit
 * @module features/three-scene/bust-hero-orbit
 * @description Orbits the camera around the bust's focus point while the
 *   right mouse button is held and dragged, and — after sitting idle for a
 *   few seconds — eases back to the default facing (yaw = pitch = 0). Only
 *   the camera moves — the fragments, their rigid bodies and the cursor
 *   force field (raycast against a fixed world plane, see bust-hero.ts) are
 *   never touched, so nothing needs to be converted into a rotating
 *   reference frame.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import * as THREE from 'three';
import type { BustOrbitParams, BustOrbitState } from './bust-hero.types';

/** Orbit state starts centered on the default facing (yaw = pitch = 0). */
export function createOrbitState(): BustOrbitState {
  return { yaw: 0, pitch: 0, isDragging: false, idleSeconds: 0 };
}

const DEGREES_TO_RADIANS = Math.PI / 180;

/**
 * Nudges the orbit yaw/pitch from a pointer drag delta (CSS pixels since the
 * last event), clamping pitch so the camera can't flip over the top/bottom
 * of the bust.
 */
export function applyOrbitDrag(
  state: BustOrbitState,
  params: BustOrbitParams,
  movementX: number,
  movementY: number,
): void {
  const sensitivityRadians = params.sensitivity * DEGREES_TO_RADIANS;
  const maxPitchRadians = params.maxPitchDegrees * DEGREES_TO_RADIANS;

  state.yaw -= movementX * sensitivityRadians;
  state.pitch = Math.min(
    maxPitchRadians,
    Math.max(-maxPitchRadians, state.pitch - movementY * sensitivityRadians),
  );
}

/**
 * Eases yaw/pitch back toward the default facing (0, 0) once the drag has
 * ended — but only after the bust has sat idle for `springBackDelaySeconds`,
 * so a released orbit holds its pose for a beat instead of snapping back
 * immediately. The ease itself is an exponential decay, so it settles like a
 * gentle spring rather than a linear snap.
 */
export function stepOrbitSpringBack(
  state: BustOrbitState,
  params: BustOrbitParams,
  deltaSeconds: number,
): void {
  if (state.isDragging) {
    state.idleSeconds = 0;
    return;
  }

  state.idleSeconds += deltaSeconds;
  if (state.idleSeconds < params.springBackDelaySeconds) {
    return;
  }

  const ease = 1 - Math.exp(-params.springBackDamping * deltaSeconds);
  state.yaw += (0 - state.yaw) * ease;
  state.pitch += (0 - state.pitch) * ease;
}

/** Residual angle below which the spring-back snaps exactly to the default facing. */
const REST_EPSILON = 1e-5;

/**
 * Places the camera on a sphere of the given `distance` around `focusPoint`,
 * driven by the current orbit yaw/pitch, and keeps it looking at that point.
 */
export function applyOrbitCamera(
  camera: THREE.PerspectiveCamera,
  state: BustOrbitState,
  focusPoint: THREE.Vector3,
  distance: number,
): void {
  if (Math.abs(state.yaw) < REST_EPSILON) {
    state.yaw = 0;
  }
  if (Math.abs(state.pitch) < REST_EPSILON) {
    state.pitch = 0;
  }

  const cosPitch = Math.cos(state.pitch);
  camera.position.set(
    focusPoint.x + distance * Math.sin(state.yaw) * cosPitch,
    focusPoint.y + distance * Math.sin(state.pitch),
    focusPoint.z + distance * Math.cos(state.yaw) * cosPitch,
  );
  camera.lookAt(focusPoint);
}
