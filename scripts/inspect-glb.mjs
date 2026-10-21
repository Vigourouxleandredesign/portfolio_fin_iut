/**
 * Inspect a GLB for bust-hero compatibility (mesh count, Draco, water mesh).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const glbRel = process.argv[2] || 'Assets/Hero/buste+water.glb';
const glbPath = path.resolve(root, glbRel);
const comparePath = path.resolve(root, 'src/assets/hero/bust-fractured.glb');

if (!fs.existsSync(glbPath)) {
  console.error('Missing', glbPath);
  process.exit(1);
}

const stat = fs.statSync(glbPath);
console.log('=== File ===');
console.log('path:', glbPath);
console.log('size_mb:', (stat.size / (1024 * 1024)).toFixed(2));

const buffer = fs.readFileSync(glbPath);
const magic = buffer.toString('utf8', 0, 4);
console.log('magic:', magic);

// glTF binary: chunk0 JSON
let jsonHint = '';
if (magic === 'glTF') {
  const jsonLength = buffer.readUInt32LE(12);
  const jsonChunk = buffer.subarray(20, 20 + jsonLength).toString('utf8');
  try {
    const gltf = JSON.parse(jsonChunk);
    const extensionsUsed = gltf.extensionsUsed || [];
    const extensionsRequired = gltf.extensionsRequired || [];
    console.log('extensionsUsed:', extensionsUsed.join(', ') || '(none)');
    console.log('extensionsRequired:', extensionsRequired.join(', ') || '(none)');
    console.log('has_draco:', extensionsUsed.includes('KHR_draco_mesh_compression'));
    console.log('meshes_in_json:', (gltf.meshes || []).length);
    console.log('materials_in_json:', (gltf.materials || []).length);
    console.log('nodes_in_json:', (gltf.nodes || []).length);
    console.log('scenes_in_json:', (gltf.scenes || []).length);
    jsonHint = 'ok';
  } catch (e) {
    jsonHint = String(e);
  }
}
console.log('json_parse:', jsonHint);

function inspectScene(label, scene) {
  const meshes = [];
  const materials = new Map();
  scene.updateMatrixWorld(true);
  scene.traverse((child) => {
    if (child.isMesh) {
      meshes.push(child);
      const mats = Array.isArray(child.material) ? child.material : [child.material];
      for (const m of mats) {
        if (!m) continue;
        const key = m.uuid;
        if (!materials.has(key)) {
          materials.set(key, {
            name: m.name || '(unnamed)',
            type: m.type,
            transparent: !!m.transparent,
            opacity: m.opacity,
            metalness: m.metalness,
            roughness: m.roughness,
            transmission: m.transmission,
            ior: m.ior,
            color: m.color ? `#${m.color.getHexString()}` : null,
          });
        }
      }
    }
  });

  const box = new THREE.Box3().setFromObject(scene);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const sphere = box.getBoundingSphere(new THREE.Sphere());

  console.log(`\n=== ${label} (runtime load) ===`);
  console.log('mesh_count:', meshes.length);
  console.log(
    'bbox_size:',
    size.toArray().map((n) => Number(n.toFixed(3))),
  );
  console.log(
    'bbox_center:',
    center.toArray().map((n) => Number(n.toFixed(3))),
  );
  console.log('bounding_radius:', Number(sphere.radius.toFixed(3)));

  const waterish = meshes.filter((m) => {
    const n = (m.name || '').toLowerCase();
    const matNames = (Array.isArray(m.material) ? m.material : [m.material])
      .map((mat) => (mat?.name || '').toLowerCase())
      .join(' ');
    return /water|eau|floor|sol|plane|mirror|reflect/.test(`${n} ${matNames}`);
  });

  console.log('\n--- meshes (name | tris | mat) ---');
  for (const m of meshes) {
    const geo = m.geometry;
    const idx = geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3;
    const mat = Array.isArray(m.material) ? m.material[0] : m.material;
    console.log(
      `- ${m.name || '(unnamed)'} | tris≈${Math.round(idx)} | mat=${mat?.name || mat?.type || '?'} | type=${mat?.type}`,
    );
  }

  console.log('\n--- unique materials ---');
  for (const m of materials.values()) {
    console.log(JSON.stringify(m));
  }

  console.log('\n--- water-like mesh candidates ---');
  if (waterish.length === 0) {
    console.log('(none by name)');
  } else {
    for (const m of waterish) {
      console.log('-', m.name, 'parent=', m.parent?.name);
    }
  }

  // Largest horizontal plane heuristic (water floor)
  let flattest = null;
  for (const m of meshes) {
    const b = new THREE.Box3().setFromObject(m);
    const s = b.getSize(new THREE.Vector3());
    const area = s.x * s.z;
    const height = s.y;
    if (!flattest || area / Math.max(height, 1e-6) > flattest.score) {
      flattest = { name: m.name, size: s.toArray(), area, height, score: area / Math.max(height, 1e-6) };
    }
  }
  console.log('\n--- flattest / widest mesh (likely floor) ---');
  console.log(flattest);

  return { meshCount: meshes.length, radius: sphere.radius };
}

async function load(filePath) {
  const draco = new DRACOLoader();
  draco.setDecoderPath(pathToFileURL(path.join(root, 'public/draco/gltf/')).href);
  // Node: DRACOLoader needs fetchable paths — use absolute file URLs for wasm/js
  // Fallback: try without decoder path override if package path works
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  // In Node, GLTFLoader expects ArrayBuffer + path for resources
  const arrayBuffer = fs.readFileSync(filePath).buffer.slice(
    fs.readFileSync(filePath).byteOffset,
    fs.readFileSync(filePath).byteOffset + fs.readFileSync(filePath).byteLength,
  );
  // Avoid double read
  const buf = fs.readFileSync(filePath);
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);

  return new Promise((resolve, reject) => {
    loader.parse(
      ab,
      pathToFileURL(path.dirname(filePath) + '/').href,
      (gltf) => {
        draco.dispose();
        resolve(gltf);
      },
      (err) => {
        draco.dispose();
        reject(err);
      },
    );
  });
}

const newGltf = await load(glbPath);
inspectScene('buste+water.glb', newGltf.scene);

if (fs.existsSync(comparePath)) {
  try {
    const oldGltf = await load(comparePath);
    inspectScene('bust-fractured.glb (current hero)', oldGltf.scene);
    console.log('\n=== delta vs current hero ===');
    console.log(
      'size_mb new vs old:',
      (stat.size / (1024 * 1024)).toFixed(2),
      'vs',
      (fs.statSync(comparePath).size / (1024 * 1024)).toFixed(2),
    );
  } catch (e) {
    console.log('\n(compare load failed)', e.message || e);
  }
}

console.log('\n=== hero pipeline notes ===');
console.log(
  'Today loadBustModel() treats EVERY mesh as a Rapier fragment. Water must be excluded by name or exported separately.',
);
