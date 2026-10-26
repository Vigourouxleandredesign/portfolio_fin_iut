/**
 * @file Lightweight GLB showcase for project pages
 * @module features/three-scene/glb-showcase
 * @description Lazy Three.js viewer on `[data-glb-showcase]`. MagicalLab assets use
 *   Draco + WebP — DRACOLoader required. Auto-rotates unless `prefers-reduced-motion`.
 *   Loads only near the viewport (desktop) or on demand (touch): see {@link initGlbShowcases}.
 * @see {@link ../../../../docs/ARCHITECTURE.md}
 */

import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three';

/** Self-hosted Draco WASM (same path as bust-hero). */
const DRACO_DECODER_PATH = '/draco/gltf/';

/** Extra space around the fitted bounding box (1 = flush). */
const FRAME_PADDING = 1.22;

export interface ShowcaseFrame {
  halfX: number;
  halfY: number;
  halfZ: number;
  /** World-space downward look offset so the subject sits higher in the view. */
  lift: number;
}

/**
 * Camera distance that fits a box of the given half-extents in the view.
 * Uses the tighter of the vertical and horizontal limits, then padding.
 */
export function showcaseCameraDistance(
  frame: Pick<ShowcaseFrame, 'halfX' | 'halfY' | 'halfZ'>,
  fovDeg: number,
  aspect: number,
  padding = FRAME_PADDING,
): number {
  const vFov = (fovDeg * Math.PI) / 180;
  const distY = frame.halfY / Math.tan(vFov / 2);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * Math.max(aspect, 0.01));
  const distX = frame.halfX / Math.tan(hFov / 2);
  return Math.max(distX, distY, frame.halfZ) * padding;
}

export interface GlbShowcaseHandle {
  dispose: () => void;
}

type Libs = {
  THREE: typeof import('three');
  gltfLoader: Awaited<ReturnType<typeof createGltfLoader>>['gltfLoader'];
  dracoLoader: { dispose: () => void };
};

async function createGltfLoader(): Promise<{
  THREE: typeof import('three');
  gltfLoader: InstanceType<typeof import('three/addons/loaders/GLTFLoader.js').GLTFLoader>;
  dracoLoader: InstanceType<typeof import('three/addons/loaders/DRACOLoader.js').DRACOLoader>;
}> {
  const THREE = await import('three');
  const { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
  const { DRACOLoader } = await import('three/addons/loaders/DRACOLoader.js');

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(DRACO_DECODER_PATH);

  const gltfLoader = new GLTFLoader();
  gltfLoader.setDRACOLoader(dracoLoader);
  return { THREE, gltfLoader, dracoLoader };
}

/** Distance (px) before the viewport at which a viewer starts loading. */
const LOAD_MARGIN = '200px';

/** Touch devices (phones, tablets): nothing 3D is downloaded unless the visitor asks for it. */
function isTouchDevice(): boolean {
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

/** Runs `task` once the page is loaded and the browser idle, so the 3D never competes with the first paint. */
function afterLoadAndIdle(task: () => void): void {
  const schedule = (): void => {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(task, { timeout: 2500 });
    } else {
      window.setTimeout(task, 1200);
    }
  };
  if (document.readyState === 'complete') {
    schedule();
  } else {
    window.addEventListener('load', schedule, { once: true });
  }
}

/**
 * Touch devices: replaces the loading message by a « Afficher le modèle 3D » button. Inside a link
 * (the MagicalLab portal) a button would be an interactive element nested in a link, so the message
 * just says where the model can be seen.
 */
function offerOnDemand(el: HTMLElement, start: () => Promise<void>): void {
  const fallback = el.querySelector<HTMLElement>('.glb-showcase__fallback');
  if (!fallback) return;
  if (el.closest('a')) {
    fallback.textContent = 'Modèle 3D visible sur ordinateur';
    return;
  }
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'button button--ghost glb-showcase__start';
  button.textContent = 'Afficher le modèle 3D';
  fallback.textContent = '';
  fallback.append(button);
  button.addEventListener(
    'click',
    () => {
      button.disabled = true;
      fallback.textContent = 'Chargement du modèle…';
      void start();
    },
    { once: true },
  );
}

/**
 * Mounts the `[data-glb-showcase]` viewers found under `root` (default: document), **lazily**:
 * - desktop: each viewer loads when it comes within 200 px of the viewport, after the page load
 *   and an idle moment (the MagicalLab robot, far below the fold, never loads unless scrolled to);
 * - touch devices: nothing is downloaded until the visitor presses « Afficher le modèle 3D ».
 * Failed loads surface an error label instead of spinning forever on the fallback.
 */
export function initGlbShowcases(root: ParentNode = document): GlbShowcaseHandle {
  const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-glb-showcase]'));
  const mounted: GlbShowcaseHandle[] = [];
  let libs: Promise<Libs> | null = null;
  let observer: IntersectionObserver | null = null;
  let disposed = false;

  const loadLibs = (): Promise<Libs> => {
    libs ??= createGltfLoader();
    return libs;
  };

  const mount = async (el: HTMLElement): Promise<void> => {
    const src = el.dataset.glbSrc?.trim();
    const canvas = el.querySelector<HTMLCanvasElement>('[data-glb-canvas]');
    if (!src || !canvas || disposed) return;
    const { THREE, gltfLoader } = await loadLibs();
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const handle = await mountOne(el, canvas, src, reduceMotion, THREE, gltfLoader);
    if (!handle) return;
    if (disposed) handle.dispose();
    else mounted.push(handle);
  };

  if (isTouchDevice()) {
    for (const el of nodes) offerOnDemand(el, () => mount(el));
  } else if (typeof IntersectionObserver === 'function') {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer?.unobserve(entry.target);
          afterLoadAndIdle(() => void mount(entry.target as HTMLElement));
        }
      },
      { rootMargin: LOAD_MARGIN },
    );
    for (const el of nodes) observer.observe(el);
  } else {
    for (const el of nodes) afterLoadAndIdle(() => void mount(el));
  }

  return {
    dispose: () => {
      disposed = true;
      observer?.disconnect();
      for (const handle of mounted) handle.dispose();
      void libs?.then(({ dracoLoader }) => dracoLoader.dispose());
    },
  };
}

function setFallbackMessage(el: HTMLElement, message: string): void {
  const fallback = el.querySelector('.glb-showcase__fallback');
  if (fallback) fallback.textContent = message;
  el.dataset.glbError = 'true';
}

async function mountOne(
  el: HTMLElement,
  canvas: HTMLCanvasElement,
  src: string,
  reduceMotion: boolean,
  THREE: typeof import('three'),
  gltfLoader: {
    loadAsync: (url: string) => Promise<{ scene: import('three').Object3D }>;
  },
): Promise<GlbShowcaseHandle | null> {
  let renderer: WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    });
  } catch {
    setFallbackMessage(el, 'WebGL indisponible');
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene: Scene = new THREE.Scene();
  const camera: PerspectiveCamera = new THREE.PerspectiveCamera(32, 1, 0.01, 100);

  const token = (name: string): InstanceType<typeof THREE.Color> => {
    const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value ? new THREE.Color(value) : new THREE.Color();
  };
  const hemi = new THREE.HemisphereLight(
    token('--color-light-beam'),
    token('--color-surface-elevated'),
    1.25,
  );
  scene.add(hemi);
  const key = new THREE.DirectionalLight(token('--color-light-fire'), 1.6);
  key.position.set(2.2, 2.4, 3.2);
  scene.add(key);
  const fill = new THREE.DirectionalLight(token('--color-light-steel'), 0.55);
  fill.position.set(-2.4, 0.6, 1.2);
  scene.add(fill);

  const pivot = new THREE.Group();
  scene.add(pivot);

  const frame: ShowcaseFrame = { halfX: 0.5, halfY: 0.5, halfZ: 0.5, lift: 0 };

  try {
    const gltf = await gltfLoader.loadAsync(src);
    const model = gltf.scene;

    const holder = new THREE.Group();
    pivot.add(holder);
    holder.add(model);

    model.updateMatrixWorld(true);
    const rawBox = new THREE.Box3().setFromObject(model);
    const rawSize = rawBox.getSize(new THREE.Vector3());
    const rawCenter = rawBox.getCenter(new THREE.Vector3());
    const maxDim = Math.max(rawSize.x, rawSize.y, rawSize.z, 0.001);
    const scale = 1 / maxDim;
    holder.scale.setScalar(scale);
    holder.position.copy(rawCenter).multiplyScalar(-scale);

    const yaw = Number.parseFloat(el.dataset.glbYaw ?? '0');
    if (!Number.isNaN(yaw)) pivot.rotation.y = yaw;
    pivot.updateMatrixWorld(true);

    const fitted = new THREE.Box3().setFromObject(pivot);
    const fittedSize = fitted.getSize(new THREE.Vector3());
    frame.halfX = Math.max(fittedSize.x / 2, 0.001);
    frame.halfY = Math.max(fittedSize.y / 2, 0.001);
    frame.halfZ = Math.max(fittedSize.z / 2, 0.001);

    const liftRatio = Number.parseFloat(el.dataset.glbLift ?? '0');
    frame.lift = Number.isNaN(liftRatio) ? 0 : fittedSize.y * liftRatio;
  } catch (err) {
    console.error('[glb-showcase] failed to load', src, err);
    renderer.dispose();
    setFallbackMessage(el, 'Modèle indisponible');
    return null;
  }

  el.dataset.glbReady = 'true';

  let raf = 0;
  let disposed = false;

  const resize = (): void => {
    const w = el.clientWidth || 1;
    const h = el.clientHeight || 1;
    renderer.setSize(w, h, false);
    const aspect = w / h;
    const dist = showcaseCameraDistance(frame, camera.fov, aspect);
    camera.position.set(0, -frame.lift * 0.35, dist);
    camera.near = Math.max(0.01, dist / 100);
    camera.far = dist * 40;
    camera.aspect = aspect;
    camera.lookAt(0, -frame.lift, 0);
    camera.updateProjectionMatrix();
  };

  const tick = (): void => {
    if (disposed) return;
    if (!reduceMotion) {
      pivot.rotation.y += 0.0045;
    }
    renderer.render(scene, camera);
    raf = window.requestAnimationFrame(tick);
  };

  resize();
  raf = window.requestAnimationFrame(tick);
  window.addEventListener('resize', resize);

  return {
    dispose: () => {
      disposed = true;
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      renderer.dispose();
      scene.clear();
      delete el.dataset.glbReady;
    },
  };
}
