/**
 * @file Bust hero — 3D fractured bust orchestrator
 * @module features/three-scene/bust-hero
 * @description Mounts the Three.js scene, loads the fractured bust GLB,
 *   creates one Rapier rigid body per fragment, then runs the render loop:
 *   a cursor-follow force field displaces nearby fragments, a spring pulls
 *   every fragment back to its rest position/rotation once the cursor moves
 *   away — the mesh geometry itself never deforms, only its transform
 *   moves and always relaxes back to rest (see bust-hero-physics.ts).
 *   Holding the right mouse button and dragging orbits the camera around
 *   the bust; releasing eases the camera back to the default facing (see
 *   bust-hero-orbit.ts) — the force field is paused while orbiting so the
 *   two interactions don't fight each other.
 *   No-ops (keeps the static `<img>` fallback in `pages/index.html`
 *   visible) under `prefers-reduced-motion` or when WebGL is unavailable.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import * as THREE from 'three';
import type {
  BustFragment,
  BustHeroOptions,
  BustOrbitParams,
  BustPhysicsParams,
} from './bust-hero.types';
import {
  createCamera,
  createLights,
  createRenderer,
  frameCameraOnRadius,
  loadBustModel,
} from './bust-hero-scene';
import { createFragmentBody, createPhysicsWorld, stepBustPhysics } from './bust-hero-physics';
import {
  applyOrbitCamera,
  applyOrbitDrag,
  createOrbitState,
  stepOrbitSpringBack,
} from './bust-hero-orbit';

const DEFAULT_PARAMS: BustPhysicsParams = {
  influenceRadius: 0.9,
  pushStrength: 2.2,
  linearSpringStiffness: 22,
  angularSpringStiffness: 9,
  linearDamping: 6,
  angularDamping: 6,
  fragmentMass: 0.35,
};

const DEFAULT_ORBIT_PARAMS: BustOrbitParams = {
  sensitivity: 0.25,
  maxPitchDegrees: 45,
  springBackDelaySeconds: 5,
  springBackDamping: 6,
};

/** Right mouse button, per the `PointerEvent.button` spec. */
const RIGHT_MOUSE_BUTTON = 2;

/** Clamp the physics timestep so a dropped frame / tab switch can't fling fragments. */
const MAX_DELTA_SECONDS = 1 / 30;

/**
 * Mounts the 3D fractured bust hero on `[data-hero-3d]`.
 *
 * @param root - Element with `[data-hero-3d]`, must contain `[data-hero-3d-canvas]`
 * @param options - Model URL + self-hosted Draco decoder path
 * @returns Teardown function (stops the render loop, disposes GPU/physics resources)
 */
export async function initBustHero(
  root: HTMLElement,
  options: BustHeroOptions,
): Promise<() => void> {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    return () => undefined;
  }

  const canvas = root.querySelector<HTMLCanvasElement>('[data-hero-3d-canvas]');
  if (!canvas) {
    console.warn('[bust-hero] Missing [data-hero-3d-canvas]');
    return () => undefined;
  }

  if (!isWebGLAvailable()) {
    console.warn('[bust-hero] WebGL unavailable — keeping the static fallback');
    return () => undefined;
  }

  try {
    const params: BustPhysicsParams = { ...DEFAULT_PARAMS };
    const orbitParams: BustOrbitParams = { ...DEFAULT_ORBIT_PARAMS };

    const [{ meshes, boundingRadius }, physics] = await Promise.all([
      loadBustModel(options),
      createPhysicsWorld(),
    ]);
    const { RAPIER, world } = physics;

    const scene = new THREE.Scene();
    scene.add(...createLights());

    const camera = createCamera(root.clientWidth / Math.max(root.clientHeight, 1));
    const orbitDistance = frameCameraOnRadius(camera, boundingRadius);
    const orbitFocus = new THREE.Vector3(0, boundingRadius * 0.05, 0);
    const orbitState = createOrbitState();

    const renderer = createRenderer(canvas);

    const fragments: BustFragment[] = meshes.map((mesh) => {
      const restPosition = mesh.position.clone();
      const restQuaternion = mesh.quaternion.clone();
      const body = createFragmentBody(RAPIER, world, restPosition, restQuaternion, params);
      scene.add(mesh);
      return { mesh, body, restPosition, restQuaternion };
    });

    root.classList.add('hero-3d--active');

    const raycaster = new THREE.Raycaster();
    const pointerNDC = new THREE.Vector2();
    const cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const cursorWorldPosition = new THREE.Vector3();
    let hasCursor = false;

    const updatePointer = (event: PointerEvent): void => {
      const rect = canvas.getBoundingClientRect();
      pointerNDC.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNDC.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      raycaster.setFromCamera(pointerNDC, camera);
      hasCursor = raycaster.ray.intersectPlane(cursorPlane, cursorWorldPosition) !== null;
    };
    const onPointerMove = (event: PointerEvent): void => {
      if (orbitState.isDragging) {
        applyOrbitDrag(orbitState, orbitParams, event.movementX, event.movementY);
        return;
      }
      updatePointer(event);
    };
    const onPointerLeave = (): void => {
      hasCursor = false;
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (event.button !== RIGHT_MOUSE_BUTTON) {
        return;
      }
      event.preventDefault();
      orbitState.isDragging = true;
      hasCursor = false;
      root.setPointerCapture(event.pointerId);
    };
    const endOrbitDrag = (event: PointerEvent): void => {
      if (!orbitState.isDragging) {
        return;
      }
      orbitState.isDragging = false;
      if (root.hasPointerCapture(event.pointerId)) {
        root.releasePointerCapture(event.pointerId);
      }
    };
    const onContextMenu = (event: MouseEvent): void => {
      event.preventDefault();
    };

    root.addEventListener('pointermove', onPointerMove);
    root.addEventListener('pointerleave', onPointerLeave);
    root.addEventListener('pointerdown', onPointerDown);
    root.addEventListener('pointerup', endOrbitDrag);
    root.addEventListener('pointercancel', endOrbitDrag);
    root.addEventListener('contextmenu', onContextMenu);

    const resize = (): void => {
      const width = root.clientWidth;
      const height = Math.max(root.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(root);

    // Tweakpane only ships when `?debug` is in the URL (lazy chunk, never in the main bundle).
    let disposePanel: (() => void) | null = null;
    if (new URLSearchParams(window.location.search).has('debug')) {
      void import('./bust-hero-controls').then(({ createBustHeroPanel }) => {
        disposePanel = createBustHeroPanel(params, orbitParams);
      });
    }

    const clock = new THREE.Clock();
    let animationFrame = 0;

    const renderLoop = (): void => {
      const deltaSeconds = Math.min(clock.getDelta(), MAX_DELTA_SECONDS);
      stepBustPhysics(
        fragments,
        params,
        hasCursor ? cursorWorldPosition : null,
        world,
        deltaSeconds,
      );
      stepOrbitSpringBack(orbitState, orbitParams, deltaSeconds);
      applyOrbitCamera(camera, orbitState, orbitFocus, orbitDistance);
      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(renderLoop);
    };
    animationFrame = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('pointerdown', onPointerDown);
      root.removeEventListener('pointerup', endOrbitDrag);
      root.removeEventListener('pointercancel', endOrbitDrag);
      root.removeEventListener('contextmenu', onContextMenu);
      disposePanel?.();
      root.classList.remove('hero-3d--active');

      for (const fragment of fragments) {
        fragment.mesh.geometry.dispose();
        const material = fragment.mesh.material;
        if (Array.isArray(material)) {
          material.forEach((oneMaterial) => oneMaterial.dispose());
        } else {
          material.dispose();
        }
      }
      world.free();
      renderer.dispose();
    };
  } catch (error) {
    console.warn('[bust-hero] Failed to initialize — keeping the static fallback', error);
    return () => undefined;
  }
}

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext && (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}
