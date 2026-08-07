/**
 * @file Bust hero — type definitions
 * @module features/three-scene
 */

import type * as THREE from 'three';
import type * as Rapier from '@dimforge/rapier3d-compat';

/**
 * Options passed to {@link initBustHero}.
 */
export type BustHeroOptions = {
  /** URL of the fractured bust `.glb` (resolved by Vite) */
  modelUrl: string;
  /** Self-hosted Draco decoder folder, trailing slash, e.g. `/draco/gltf/` */
  dracoDecoderPath: string;
};

/**
 * Live-tunable force field / spring parameters — bound to the Tweakpane
 * panel in dev and used as-is by the physics step every frame.
 */
export type BustPhysicsParams = {
  /** Distance (world units) within which the cursor pushes a fragment */
  influenceRadius: number;
  /** Cursor push impulse magnitude at zero distance (falls off to 0 at `influenceRadius`) */
  pushStrength: number;
  /** Force pulling a fragment back to its rest position, per unit of displacement */
  linearSpringStiffness: number;
  /** Torque pulling a fragment back to its rest rotation, per radian of misalignment */
  angularSpringStiffness: number;
  /** Rapier linear damping — how fast translation settles */
  linearDamping: number;
  /** Rapier angular damping — how fast rotation settles */
  angularDamping: number;
  /** Mass given to every fragment body (no collider, so mass is set explicitly) */
  fragmentMass: number;
};

/**
 * One bust shard: a Three.js mesh driven every frame by a Rapier rigid body,
 * with its rest transform kept aside for the spring-back force.
 */
export type BustFragment = {
  mesh: THREE.Mesh;
  body: Rapier.RigidBody;
  restPosition: THREE.Vector3;
  restQuaternion: THREE.Quaternion;
};

/**
 * Live-tunable right-click-drag camera orbit — bound to the Tweakpane panel
 * in dev. The camera orbits the bust on drag and, after sitting idle for
 * `springBackDelaySeconds`, eases back to the default facing (yaw = pitch = 0).
 */
export type BustOrbitParams = {
  /** Degrees of yaw/pitch per pixel of pointer movement while dragging */
  sensitivity: number;
  /** Maximum pitch, in degrees, up or down from the default facing */
  maxPitchDegrees: number;
  /** Seconds to wait after releasing the drag before the spring-back starts */
  springBackDelaySeconds: number;
  /** Exponential ease-back speed toward the default facing once released */
  springBackDamping: number;
};

/**
 * Mutable orbit state carried across frames by the render loop.
 */
export type BustOrbitState = {
  yaw: number;
  pitch: number;
  isDragging: boolean;
  /** Seconds elapsed since the drag ended — spring-back starts once this reaches `springBackDelaySeconds`. */
  idleSeconds: number;
};
