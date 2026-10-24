/**
 * @file Bust hero — Three.js scene setup + GLTF/Draco loading
 * @module features/three-scene/bust-hero-scene
 * @description Renderer, camera, lighting rig and the fractured bust GLTF
 *   load. Fragments are flattened out of the GLTF hierarchy and recentered
 *   on the origin so a fragment's Three.js position directly matches its
 *   Rapier rigid body world translation (no parent transform to compose).
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import type { BustHeroOptions } from './bust-hero.types';

/**
 * Reads a brand color from `variables.css` (single source of truth) so the
 * WebGL lighting stays in sync with the rest of the page's palette.
 */
export function getCssColor(variableName: string): THREE.Color {
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
  return value ? new THREE.Color(value) : new THREE.Color();
}

/**
 * Creates the WebGL renderer for the hero canvas — transparent background
 * so the charcoal page shows through, capped pixel ratio for performance.
 */
export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);
  return renderer;
}

export function createCamera(aspect: number): THREE.PerspectiveCamera {
  return new THREE.PerspectiveCamera(35, aspect, 0.1, 100);
}

/**
 * Frames the camera so the whole bust (given its bounding-sphere radius) is
 * visible with a comfortable margin, regardless of the model's own scale.
 *
 * @returns The computed camera distance from the look-at point — reused by
 *   the orbit controls so drag-rotation doesn't recompute or drift it.
 */
export function frameCameraOnRadius(camera: THREE.PerspectiveCamera, radius: number): number {
  const fovRadians = (camera.fov * Math.PI) / 180;
  const margin = 1.35;
  const distance = (radius * margin) / Math.sin(fovRadians / 2);
  camera.position.set(0, radius * 0.05, distance);
  camera.lookAt(0, radius * 0.05, 0);
  camera.updateProjectionMatrix();
  return distance;
}

/**
 * Three-point lighting rig (key / fill / rim + hemisphere) for the « Odyssée »
 * grade: fire key light, steel rim light, soft marble fill — colors sourced
 * from `variables.css` (docs/DA.md §5).
 */
export function createLights(): THREE.Light[] {
  const marble = getCssColor('--color-marble');
  const fire = getCssColor('--color-light-fire');
  const steel = getCssColor('--color-light-steel');
  const bg = getCssColor('--color-bg');

  const hemisphere = new THREE.HemisphereLight(marble, bg, 0.9);

  const key = new THREE.DirectionalLight(fire, 2.6);
  key.position.set(-2.4, 3, 2.6);

  const fill = new THREE.DirectionalLight(marble, 0.5);
  fill.position.set(3, 1, 1.5);

  const rim = new THREE.DirectionalLight(steel, 1.4);
  rim.position.set(2.5, 2, -3);

  return [hemisphere, key, fill, rim];
}

export type LoadedBust = {
  /** Top-level fragment meshes, positions already recentered on the origin */
  meshes: THREE.Mesh[];
  /** Bounding-sphere radius (post-recenter), used to frame the camera */
  boundingRadius: number;
};

/**
 * Loads the fractured bust `.glb`, flattens its hierarchy into top-level
 * meshes and recenters everything on the origin.
 */
export async function loadBustModel(options: BustHeroOptions): Promise<LoadedBust> {
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(options.dracoDecoderPath);

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);

  const gltf = await gltfLoader.loadAsync(options.modelUrl);
  const root = gltf.scene;
  root.updateMatrixWorld(true);

  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  const sphere = new THREE.Sphere();
  box.getBoundingSphere(sphere);

  const sourceMeshes: THREE.Mesh[] = [];
  root.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      sourceMeshes.push(child);
    }
  });

  const worldPosition = new THREE.Vector3();
  const worldQuaternion = new THREE.Quaternion();
  const worldScale = new THREE.Vector3();
  const meshes: THREE.Mesh[] = [];

  for (const mesh of sourceMeshes) {
    mesh.getWorldPosition(worldPosition);
    mesh.getWorldQuaternion(worldQuaternion);
    mesh.getWorldScale(worldScale);
    worldPosition.sub(center);

    mesh.removeFromParent();
    mesh.position.copy(worldPosition);
    mesh.quaternion.copy(worldQuaternion);
    mesh.scale.copy(worldScale);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    meshes.push(mesh);
  }

  dracoLoader.dispose();

  return { meshes, boundingRadius: sphere.radius };
}
