/**
 * Quick inspect: water materials, textures, animations in bust-water.glb
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const glbPath = path.resolve(root, 'src/assets/hero/bust-water.glb');
const altPath = path.resolve(root, 'Assets/Hero/buste+water.glb');
const file = fs.existsSync(glbPath) ? glbPath : altPath;

console.log('file:', file, 'exists:', fs.existsSync(file));
const buf = fs.readFileSync(file);
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));

console.log('animations:', (gltf.animations || []).length);
console.log(
  'anim names:',
  (gltf.animations || []).map((a) => `${a.name} ch=${(a.channels || []).length}`),
);
console.log('images:', (gltf.images || []).length);
console.log('textures:', (gltf.textures || []).length);
console.log('materials:');
for (const m of gltf.materials || []) {
  console.log(
    JSON.stringify({
      name: m.name,
      baseColorFactor: m.pbrMetallicRoughness?.baseColorFactor,
      baseColorTexture: m.pbrMetallicRoughness?.baseColorTexture,
      metallicRoughnessTexture: m.pbrMetallicRoughness?.metallicRoughnessTexture,
      normalTexture: m.normalTexture,
      emissiveTexture: m.emissiveTexture,
      occlusionTexture: m.occlusionTexture,
      extensions: m.extensions ? Object.keys(m.extensions) : [],
    }),
  );
}
console.log('meshes:');
for (const mesh of gltf.meshes || []) {
  console.log('-', mesh.name, 'prims', (mesh.primitives || []).length);
}
