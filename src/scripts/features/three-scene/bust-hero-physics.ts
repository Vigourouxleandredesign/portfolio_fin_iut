/**
 * @file Bust hero — Rapier physics (force field + spring-back)
 * @module features/three-scene/bust-hero-physics
 * @description One dynamic rigid body per fragment, deliberately **without**
 *   colliders: fragments never collide with each other (this is a decorative
 *   "floating shards" effect, not a fracture simulation), so mass is set
 *   explicitly via `setAdditionalMass`. Two forces drive every fragment each
 *   frame: a spring pulling it back to its rest position + rotation, and an
 *   impulse pushing it away from the cursor when in range. The mesh geometry
 *   itself never changes — only the rigid body transform moves and always
 *   relaxes back to rest, so shards return with no permanent deformation.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import * as THREE from 'three';
import type * as Rapier from '@dimforge/rapier3d-compat';
import type { BustFragment, BustPhysicsParams } from './bust-hero.types';

export type RapierModule = typeof import('@dimforge/rapier3d-compat');

/**
 * Loads and initializes the Rapier WASM module, then creates a zero-gravity
 * world (fragments float and settle via springs/damping, they never fall).
 */
export async function createPhysicsWorld(): Promise<{
  RAPIER: RapierModule;
  world: Rapier.World;
}> {
  const RAPIER = await import('@dimforge/rapier3d-compat');
  await RAPIER.init();
  const world = new RAPIER.World({ x: 0, y: 0, z: 0 });
  return { RAPIER, world };
}

/**
 * Creates a dynamic, collider-less rigid body for one fragment at its rest
 * transform.
 */
export function createFragmentBody(
  RAPIER: RapierModule,
  world: Rapier.World,
  restPosition: THREE.Vector3,
  restQuaternion: THREE.Quaternion,
  params: BustPhysicsParams,
): Rapier.RigidBody {
  const desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(restPosition.x, restPosition.y, restPosition.z)
    .setRotation({
      x: restQuaternion.x,
      y: restQuaternion.y,
      z: restQuaternion.z,
      w: restQuaternion.w,
    })
    .setLinearDamping(params.linearDamping)
    .setAngularDamping(params.angularDamping)
    .setAdditionalMass(params.fragmentMass)
    .setCanSleep(false);

  return world.createRigidBody(desc);
}

const scratchCurrentQuat = new THREE.Quaternion();
const scratchDeltaQuat = new THREE.Quaternion();
const scratchAxis = new THREE.Vector3();

/**
 * Applies spring-back (linear + angular) and cursor-push forces to every
 * fragment, steps the physics world, then syncs each fragment's mesh from
 * its rigid body.
 *
 * @param fragments - Fragments to update
 * @param params - Live-tunable force field / spring parameters
 * @param cursorWorldPosition - Cursor position on the bust's depth plane, or `null` when away/idle
 * @param world - Rapier physics world
 * @param deltaSeconds - Clamped frame delta, used as the physics timestep
 */
export function stepBustPhysics(
  fragments: readonly BustFragment[],
  params: BustPhysicsParams,
  cursorWorldPosition: THREE.Vector3 | null,
  world: Rapier.World,
  deltaSeconds: number,
): void {
  for (const fragment of fragments) {
    const { body, restPosition, restQuaternion } = fragment;
    const position = body.translation();

    body.resetForces(true);
    body.addForce(
      {
        x: (restPosition.x - position.x) * params.linearSpringStiffness,
        y: (restPosition.y - position.y) * params.linearSpringStiffness,
        z: (restPosition.z - position.z) * params.linearSpringStiffness,
      },
      true,
    );

    const rotation = body.rotation();
    scratchCurrentQuat.set(rotation.x, rotation.y, rotation.z, rotation.w);
    scratchDeltaQuat.copy(restQuaternion).multiply(scratchCurrentQuat.invert());
    // Quaternions q and -q represent the same rotation — negate to always take the shorter path.
    if (scratchDeltaQuat.w < 0) {
      scratchDeltaQuat.set(
        -scratchDeltaQuat.x,
        -scratchDeltaQuat.y,
        -scratchDeltaQuat.z,
        -scratchDeltaQuat.w,
      );
    }
    const w = Math.min(1, Math.max(-1, scratchDeltaQuat.w));
    const angle = 2 * Math.acos(w);
    const sinHalfAngle = Math.sqrt(1 - w * w);

    body.resetTorques(true);
    if (angle > 1e-4 && sinHalfAngle > 1e-4) {
      scratchAxis
        .set(scratchDeltaQuat.x, scratchDeltaQuat.y, scratchDeltaQuat.z)
        .divideScalar(sinHalfAngle)
        .multiplyScalar(angle * params.angularSpringStiffness);
      body.addTorque({ x: scratchAxis.x, y: scratchAxis.y, z: scratchAxis.z }, true);
    }

    if (cursorWorldPosition) {
      const dx = position.x - cursorWorldPosition.x;
      const dy = position.y - cursorWorldPosition.y;
      const dz = position.z - cursorWorldPosition.z;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < params.influenceRadius && distance > 1e-4) {
        const falloff = 1 - distance / params.influenceRadius;
        const strength = (params.pushStrength * falloff * falloff) / distance;
        body.applyImpulse({ x: dx * strength, y: dy * strength, z: dz * strength }, true);
      }
    }
  }

  world.timestep = deltaSeconds;
  world.step();

  for (const fragment of fragments) {
    const position = fragment.body.translation();
    const rotation = fragment.body.rotation();
    fragment.mesh.position.set(position.x, position.y, position.z);
    fragment.mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
  }
}
