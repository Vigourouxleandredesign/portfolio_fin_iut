/**
 * @file Paint decor generator — gouache swipes, smears, splatters, drips
 * @description Writes self-contained SVG decor files (relief / stain filters and
 *   pigment gradients embedded in each file) to `src/assets/decor/paint/`.
 *   Shapes follow the DA references: wide loaded-brush swipes whose tail frays
 *   into dry-brush bristles, vertical knife smears with crumbly edges, splatters
 *   with radiating spikes + droplets, blots with drips ending in round drops,
 *   knife squares and rings. Deterministic (seeded): re-running gives the same
 *   files. No dependency. Usage: `node scripts/generate-paint-decor.mjs`
 *   Pigment hex values mirror `src/styles/variables.css` (SVG used as <img>
 *   cannot read CSS custom properties) — keep both in sync.
 * @see {@link ../docs/DA.md}
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const OUT_DIR = resolve(process.cwd(), 'src/assets/decor/paint');

/* ---------- pigments (keep in sync with variables.css) ---------- */
const PIGMENTS = {
  copper: { light: '#F0B07A', mid: '#C8743F', dark: '#8A4520', edge: '#D98A55' },
  gold: { light: '#F6DC93', mid: '#D9AE52', dark: '#8F6A22', edge: '#EBC872' },
  phtalo: { light: '#1A7A66', mid: '#0B4840', dark: '#062C27', edge: '#0B5F4E' },
  marble: { light: '#FFFFFF', mid: '#ECE8E1', dark: '#9C968E', edge: '#D4CFC6' },
};
const PHTALO_GLINT = '#3DF2C0';

/* ---------- seeded random ---------- */
function rng(seed) {
  let a = Math.floor(seed * 9973) >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- geometry helpers ---------- */
const fmt = (n) => Number(n.toFixed(1));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const bez = (p0, p1, p2, p3, t) => {
  const u = 1 - t;
  return [
    u ** 3 * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t ** 3 * p3[0],
    u ** 3 * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t ** 3 * p3[1],
  ];
};
const polyPath = (points) => `M${points.map(([x, y]) => `${fmt(x)} ${fmt(y)}`).join(' L')} Z`;

/** One cubic curve sampled by arc length → { at(t) → {p, n} } */
function curve(p0, p1, p2, p3, samples = 120) {
  const pts = Array.from({ length: samples }, (_, i) => bez(p0, p1, p2, p3, i / (samples - 1)));
  const len = [0];
  for (let i = 1; i < pts.length; i += 1) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const total = len[len.length - 1];
  return {
    length: total,
    at(t) {
      const target = Math.min(1, Math.max(0, t)) * total;
      let i = 1;
      while (i < len.length - 1 && len[i] < target) i += 1;
      const k = (target - len[i - 1]) / (len[i] - len[i - 1] || 1);
      const p = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)];
      const dx = pts[i][0] - pts[i - 1][0];
      const dy = pts[i][1] - pts[i - 1][1];
      const d = Math.hypot(dx, dy) || 1;
      return { p, n: [-dy / d, dx / d] };
    },
  };
}

/** Smoothed value noise in [-1, 1] along t */
function noise1d(seed, octaves = [[6, 1], [17, 0.45], [41, 0.2]]) {
  const r = rng(seed);
  const phases = octaves.map(() => r() * Math.PI * 2);
  return (t) => octaves.reduce((s, [f, a], i) => s + a * Math.sin(f * t + phases[i]), 0) / 1.65;
}

/**
 * Ribbon polygon along a curve between t0..t1.
 * width(t) = full width; offset(t) = lateral shift; ragged = edge noise amplitude (× width).
 */
function ribbon(c, { t0 = 0, t1 = 1, width, offset = () => 0, ragged = 0.05, seed = 1, steps = 90 }) {
  const nl = noise1d(seed);
  const nr = noise1d(seed + 7);
  const left = [];
  const right = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = lerp(t0, t1, i / steps);
    const { p, n } = c.at(t);
    const w = Math.max(0.4, width(t));
    const o = offset(t);
    const wl = (w / 2) * (1 + ragged * nl(t * 9));
    const wr = (w / 2) * (1 + ragged * nr(t * 9));
    left.push([p[0] + n[0] * (o + wl), p[1] + n[1] * (o + wl)]);
    right.push([p[0] + n[0] * (o - wr), p[1] + n[1] * (o - wr)]);
  }
  return polyPath([...left, ...right.reverse()]);
}

/** Irregular closed blob (Catmull-Rom) */
function blob(cx, cy, r, seed, { points = 12, irregular = 0.3, squash = 0.9 } = {}) {
  const rand = rng(seed);
  const pts = [];
  for (let i = 0; i < points; i += 1) {
    const a = (2 * Math.PI * i) / points + (rand() - 0.5) * 0.3;
    const rr = r * (1 + (rand() - 0.5) * 2 * irregular);
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a) * squash]);
  }
  const n = pts.length;
  let d = `M${fmt(pts[0][0])} ${fmt(pts[0][1])}`;
  for (let i = 0; i < n; i += 1) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    d += ` C${fmt(p1[0] + (p2[0] - p0[0]) / 6)} ${fmt(p1[1] + (p2[1] - p0[1]) / 6)} ${fmt(p2[0] - (p3[0] - p1[0]) / 6)} ${fmt(p2[1] - (p3[1] - p1[1]) / 6)} ${fmt(p2[0])} ${fmt(p2[1])}`;
  }
  return `${d} Z`;
}

const disc = (cx, cy, r, seed) => blob(cx, cy, r, seed, { points: 9, irregular: 0.1, squash: 1 });

function knife(cx, cy, w, h, rotDeg, seed, jitter = 0.12) {
  const rand = rng(seed);
  const a = (rotDeg * Math.PI) / 180;
  const corners = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([dx, dy]) => {
    const x = ((dx * w) / 2) * (1 + (rand() - 0.5) * 2 * jitter);
    const y = ((dy * h) / 2) * (1 + (rand() - 0.5) * 2 * jitter);
    return [cx + x * Math.cos(a) - y * Math.sin(a), cy + x * Math.sin(a) + y * Math.cos(a)];
  });
  const out = [];
  for (let i = 0; i < 4; i += 1) {
    const p = corners[i];
    const q = corners[(i + 1) % 4];
    out.push(p, [lerp(p[0], q[0], 0.15), lerp(p[1], q[1], 0.15)], [lerp(p[0], q[0], 0.85), lerp(p[1], q[1], 0.85)]);
  }
  return polyPath(out);
}

function ring(cx, cy, r, thickness, seed) {
  const rand = rng(seed);
  const outer = [];
  const inner = [];
  for (let i = 0; i < 40; i += 1) {
    const a = (2 * Math.PI * i) / 40;
    const t = thickness * (0.55 + 0.9 * Math.abs(Math.sin(a * 1.5 + seed)));
    const rr = r * (1 + (rand() - 0.5) * 0.08);
    outer.push([cx + (rr + t / 2) * Math.cos(a), cy + (rr + t / 2) * Math.sin(a)]);
    inner.push([cx + (rr - t / 2) * Math.cos(a), cy + (rr - t / 2) * Math.sin(a)]);
  }
  return `${polyPath(outer)} ${polyPath(inner.reverse())}`;
}

/** Thin tapered spike from (x,y) in direction a, length L, base width w */
function spike(x, y, a, L, w, seed) {
  const c = curve([x, y], [x + Math.cos(a) * L * 0.33, y + Math.sin(a) * L * 0.33], [x + Math.cos(a + 0.08) * L * 0.66, y + Math.sin(a + 0.08) * L * 0.66], [x + Math.cos(a) * L, y + Math.sin(a) * L], 40);
  return ribbon(c, { width: (t) => w * (1 - t) ** 1.4 + 0.5, ragged: 0.15, seed, steps: 24 });
}

/* ---------- compositions ---------- */
/**
 * Loaded-brush swipe: blunt, thick start; body with ridges; tail fraying into
 * dry-brush bristles + flecks. Returns layers [{ fill, d, opacity? }].
 */
function swipe({ c, width, pigment, seed, bristles = 16, flecks = 18, fray = 0.62 }) {
  const P = PIGMENTS[pigment];
  const rand = rng(seed);
  const n = noise1d(seed + 3);
  const layers = [];
  const bodyW = (t) => width * smoothstep(-0.02, 0.06, t) * (1 - smoothstep(fray, fray + 0.3, t)) * (0.92 + 0.08 * n(t * 5));
  layers.push({ fill: `url(#${pigment})`, d: ribbon(c, { width: bodyW, ragged: 0.07, seed, t1: Math.min(1, fray + 0.3) }) });
  // dry-brush bristles fraying out of the tail
  for (let k = 0; k < bristles; k += 1) {
    const lat = (k / (bristles - 1) - 0.5) * width * 0.92;
    const tStart = fray - 0.15 + rand() * 0.1;
    const tEnd = Math.min(1, fray + 0.22 + rand() * (0.98 - fray - 0.22));
    const bw = width * (0.025 + rand() * 0.05);
    const tone = rand() < 0.3 ? P.light : rand() < 0.5 ? P.dark : P.mid;
    layers.push({
      fill: tone,
      d: ribbon(c, {
        t0: tStart, t1: tEnd, seed: seed + k * 3, ragged: 0.2, steps: 40,
        width: (t) => bw * (1 - smoothstep(tStart + (tEnd - tStart) * 0.4, tEnd, t)) + 0.4,
        offset: (t) => lat * (1 + (t - fray) * 0.25 * (rand() - 0.2)),
      }),
    });
  }
  // ridges (light) and furrows (dark) along the body
  for (let k = 0; k < 7; k += 1) {
    const lat = (rand() - 0.5) * width * 0.75;
    const t0 = 0.04 + rand() * 0.15;
    const t1 = fray + 0.05 + rand() * 0.22;
    const light = k % 3 !== 2;
    layers.push({
      fill: light ? P.light : P.dark,
      opacity: light ? 0.55 : 0.45,
      d: ribbon(c, { t0, t1, seed: seed + 40 + k, ragged: 0.3, steps: 50, width: (t) => width * (0.025 + 0.02 * Math.sin(t * 7 + k)) * (1 - smoothstep(t1 - 0.1, t1, t)), offset: () => lat }),
    });
  }
  // flecks thrown off the tail
  for (let k = 0; k < flecks; k += 1) {
    const t = fray + rand() * (1 - fray);
    const { p, n: nn } = c.at(t);
    const side = (rand() - 0.5) * width * 1.3;
    layers.push({ fill: rand() < 0.5 ? P.mid : P.light, d: disc(p[0] + nn[0] * side + (rand() - 0.5) * 18, p[1] + nn[1] * side + (rand() - 0.5) * 18, 1 + rand() * 3.5, seed + 100 + k) });
  }
  return layers;
}

/** Splatter: central blot + radiating spikes ending in droplets + scattered drops */
function splatter({ cx, cy, r, pigment, seed, spikes = 16, drops = 22 }) {
  const P = PIGMENTS[pigment];
  const rand = rng(seed);
  const layers = [{ fill: `url(#${pigment})`, d: blob(cx, cy, r, seed, { points: 14, irregular: 0.28, squash: 0.85 }) }];
  for (let k = 0; k < spikes; k += 1) {
    const a = (2 * Math.PI * k) / spikes + (rand() - 0.5) * 0.35;
    const L = r * (0.45 + rand() * (k % 4 === 0 ? 1.6 : 0.8));
    const sx = cx + Math.cos(a) * r * 0.75;
    const sy = cy + Math.sin(a) * r * 0.75 * 0.85;
    layers.push({ fill: P.mid, d: spike(sx, sy, a, L, r * (0.12 + rand() * 0.12), seed + k) });
    if (rand() < 0.55) layers.push({ fill: P.mid, d: disc(sx + Math.cos(a) * (L + 4), sy + Math.sin(a) * (L + 4), 1.5 + rand() * 3, seed + 50 + k) });
  }
  for (let k = 0; k < drops; k += 1) {
    const a = rand() * Math.PI * 2;
    const dist = r * (1.3 + rand() * 1.4);
    layers.push({ fill: rand() < 0.3 ? P.light : P.mid, d: disc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist * 0.85, 1 + rand() * 4, seed + 200 + k) });
  }
  return layers;
}

/** Blot with drips running down, each ending in a round drop */
function drips({ cx, cy, r, pigment, seed, count = 5, maxLen = 160 }) {
  const P = PIGMENTS[pigment];
  const rand = rng(seed);
  const layers = [{ fill: `url(#${pigment})`, d: blob(cx, cy, r, seed, { points: 13, irregular: 0.22, squash: 0.8 }) }];
  for (let k = 0; k < count; k += 1) {
    const x = cx + (k / (count - 1) - 0.5) * r * 1.4 + (rand() - 0.5) * 10;
    const y0 = cy + r * 0.45;
    const len = maxLen * (0.35 + rand() * 0.65);
    const w = 4 + rand() * 7;
    const c = curve([x, y0], [x + (rand() - 0.5) * 6, y0 + len * 0.33], [x + (rand() - 0.5) * 6, y0 + len * 0.66], [x + (rand() - 0.5) * 4, y0 + len], 40);
    layers.push({ fill: P.mid, d: ribbon(c, { width: (t) => w * (1 - 0.35 * t) * (1 - 0.3 * Math.sin(t * 9 + k) ** 2), ragged: 0.1, seed: seed + k, steps: 30 }) });
    layers.push({ fill: P.mid, d: disc(x, y0 + len + w * 0.3, w * 0.85, seed + 30 + k) });
  }
  for (let k = 0; k < 6; k += 1) {
    layers.push({ fill: P.light, d: disc(cx + r * (1.2 + rand() * 0.8), cy - r * 0.2 + rand() * r, 1.5 + rand() * 3.5, seed + 60 + k) });
  }
  return layers;
}

/* ---------- filters & file wrapper ---------- */
function defs(gradientNames) {
  const impasto = (id, specColor, specConst, glow, relief) => `
    <filter id="${id}" x="-20%" y="-30%" width="140%" height="160%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.5" numOctaves="3" seed="3" result="bristle"/>
      <feDisplacementMap in="SourceGraphic" in2="bristle" scale="4" xChannelSelector="R" yChannelSelector="G" result="shape"/>
      <feGaussianBlur in="shape" stdDeviation="1.6" result="body"/>
      <feComposite in="bristle" in2="body" operator="arithmetic" k1="0.75" k2="0" k3="0.7" k4="0" result="height"/>
      <feDiffuseLighting in="height" surfaceScale="${relief}" diffuseConstant="1.15" lighting-color="#FFFFFF" result="diffuse"><feDistantLight azimuth="225" elevation="50"/></feDiffuseLighting>
      <feComposite in="shape" in2="diffuse" operator="arithmetic" k1="1.1" k2="0" k3="0" k4="0" result="shaded"/>
      <feSpecularLighting in="height" surfaceScale="${relief}" specularConstant="${specConst}" specularExponent="22" lighting-color="${specColor}" result="spec"><feDistantLight azimuth="225" elevation="42"/></feSpecularLighting>
      <feComposite in="spec" in2="shape" operator="in" result="specIn"/>
      <feComposite in="shaded" in2="shape" operator="in" result="shadedIn"/>
      <feComposite in="specIn" in2="shadedIn" operator="arithmetic" k1="0" k2="0.8" k3="1" k4="0" result="paint"/>
      ${glow ? `<feGaussianBlur in="shape" stdDeviation="7" result="halo"/>
      <feFlood flood-color="${PHTALO_GLINT}" flood-opacity="0.3" result="haloColor"/>
      <feComposite in="haloColor" in2="halo" operator="in" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="paint"/></feMerge>` : ''}
    </filter>`;
  // Stain: flatter, mottled pigment (splatters / drips) — no holes
  const stain = (id, glow) => `
    <filter id="${id}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="8" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G" result="shape"/>
      <feColorMatrix in="n" type="matrix" values="0.25 0.25 0.25 0 0.72  0.25 0.25 0.25 0 0.72  0.25 0.25 0.25 0 0.72  0 0 0 0 1" result="mottle"/>
      <feComposite in="shape" in2="mottle" operator="arithmetic" k1="1.12" k2="0" k3="0" k4="0" result="tinted"/>
      <feComposite in="tinted" in2="shape" operator="in" result="paint"/>
      ${glow ? `<feGaussianBlur in="shape" stdDeviation="6" result="halo"/>
      <feFlood flood-color="${PHTALO_GLINT}" flood-opacity="0.25" result="haloColor"/>
      <feComposite in="haloColor" in2="halo" operator="in" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="paint"/></feMerge>` : ''}
    </filter>`;
  const grad = (name) => {
    const P = PIGMENTS[name];
    return `
    <linearGradient id="${name}" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${P.light}"/><stop offset="0.38" stop-color="${P.mid}"/><stop offset="0.72" stop-color="${P.dark}"/><stop offset="1" stop-color="${P.edge}"/>
    </linearGradient>`;
  };
  return `<defs>${impasto('impasto', '#FFF1D6', 0.85, false, 4)}${impasto('impasto-phtalo', '#7DFFD8', 1.15, true, 4)}${stain('stain', false)}${stain('stain-phtalo', true)}${gradientNames.map(grad).join('')}</defs>`;
}

function svgFile({ name, width, height, groups }) {
  const used = new Set();
  const body = groups
    .map(({ filter, layers }) => {
      const inner = layers
        .map(({ fill, d, opacity }) => {
          const m = /^url\(#(\w+)\)$/.exec(fill);
          if (m) used.add(m[1]);
          return `<path d="${d}" fill="${fill}"${opacity ? ` fill-opacity="${opacity}"` : ''} fill-rule="evenodd"/>`;
        })
        .join('');
      return `<g filter="url(#${filter})">${inner}</g>`;
    })
    .join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <!-- ${name} — generated by scripts/generate-paint-decor.mjs (do not edit by hand) -->
  ${defs([...used])}
  ${body}
</svg>
`;
}

const filterFor = (pigment, kind = 'impasto') => (pigment === 'phtalo' ? `${kind}-phtalo` : kind);

/* ---------- catalogue ---------- */
const DECOR = [
  {
    name: 'swipe-copper', width: 760, height: 300,
    groups: [{ filter: 'impasto', layers: swipe({ c: curve([60, 170], [220, 90], [420, 210], [720, 120]), width: 120, pigment: 'copper', seed: 1.3 }) }],
  },
  {
    name: 'swipe-phtalo', width: 760, height: 300,
    groups: [{ filter: 'impasto-phtalo', layers: swipe({ c: curve([60, 140], [250, 220], [450, 80], [720, 170]), width: 110, pigment: 'phtalo', seed: 2.7 }) }],
  },
  {
    name: 'swipe-gold', width: 620, height: 220,
    groups: [{ filter: 'impasto', layers: swipe({ c: curve([50, 130], [200, 70], [380, 160], [580, 90]), width: 70, pigment: 'gold', seed: 0.9, bristles: 12 }) }],
  },
  {
    name: 'swipe-trio',
    width: 800, height: 420,
    groups: [
      { filter: 'impasto', layers: swipe({ c: curve([70, 150], [260, 60], [480, 170], [760, 90]), width: 100, pigment: 'copper', seed: 4.1 }) },
      { filter: 'impasto', layers: swipe({ c: curve([60, 230], [260, 150], [470, 250], [740, 190]), width: 90, pigment: 'gold', seed: 5.3, fray: 0.58 }) },
      { filter: 'impasto-phtalo', layers: swipe({ c: curve([50, 310], [250, 250], [460, 340], [700, 290]), width: 90, pigment: 'phtalo', seed: 6.2, fray: 0.55 }) },
    ],
  },
  {
    name: 'smear-copper-vertical', width: 260, height: 460,
    groups: [{ filter: 'impasto', layers: swipe({ c: curve([130, 50], [120, 160], [140, 280], [125, 420]), width: 120, pigment: 'copper', seed: 7.7, bristles: 10, flecks: 26, fray: 0.7 }) }],
  },
  {
    name: 'underline-copper', width: 460, height: 90,
    groups: [{ filter: 'impasto', layers: swipe({ c: curve([20, 48], [140, 30], [280, 60], [440, 40]), width: 26, pigment: 'copper', seed: 2.2, bristles: 8, flecks: 6, fray: 0.66 }) }],
  },
  {
    name: 'underline-phtalo', width: 460, height: 90,
    groups: [{ filter: 'impasto-phtalo', layers: swipe({ c: curve([20, 40], [150, 60], [290, 28], [440, 46]), width: 24, pigment: 'phtalo', seed: 3.4, bristles: 8, flecks: 6, fray: 0.66 }) }],
  },
  {
    name: 'splatter-phtalo', width: 420, height: 420,
    groups: [{ filter: 'stain-phtalo', layers: splatter({ cx: 210, cy: 210, r: 70, pigment: 'phtalo', seed: 9.1 }) }],
  },
  {
    name: 'splatter-copper', width: 420, height: 420,
    groups: [{ filter: 'stain', layers: splatter({ cx: 210, cy: 210, r: 66, pigment: 'copper', seed: 10.4, spikes: 18 }) }],
  },
  {
    name: 'drips-gold', width: 320, height: 420,
    groups: [{ filter: 'stain', layers: drips({ cx: 150, cy: 110, r: 80, pigment: 'gold', seed: 11.2, count: 5, maxLen: 230 }) }],
  },
  {
    name: 'drips-copper', width: 300, height: 380,
    groups: [{ filter: 'stain', layers: drips({ cx: 140, cy: 100, r: 66, pigment: 'copper', seed: 12.6, count: 4, maxLen: 200 }) }],
  },
  {
    name: 'knife-phtalo-cluster', width: 260, height: 190,
    groups: [{ filter: 'impasto-phtalo', layers: [
      { fill: 'url(#phtalo)', d: knife(80, 60, 96, 52, -8, 11) },
      { fill: 'url(#phtalo)', d: knife(160, 100, 110, 60, 6, 12) },
      { fill: 'url(#phtalo)', d: knife(100, 140, 70, 36, -3, 13) },
    ] }],
  },
  {
    name: 'knife-gold-pair', width: 180, height: 150,
    groups: [{ filter: 'impasto', layers: [
      { fill: 'url(#gold)', d: knife(70, 60, 62, 48, -14, 1) },
      { fill: 'url(#gold)', d: knife(120, 100, 34, 30, 22, 2) },
    ] }],
  },
  {
    name: 'dots-gold', width: 240, height: 140,
    groups: [{ filter: 'impasto', layers: [
      { fill: 'url(#gold)', d: disc(60, 56, 20, 31) },
      { fill: 'url(#gold)', d: disc(128, 92, 12, 32) },
      { fill: 'url(#gold)', d: disc(190, 46, 8, 33) },
      { fill: 'url(#gold)', d: disc(104, 36, 5, 34) },
      { fill: 'url(#gold)', d: ring(196, 104, 18, 7, 35) },
    ] }],
  },
  {
    name: 'ring-phtalo', width: 140, height: 140,
    groups: [{ filter: 'impasto-phtalo', layers: [{ fill: 'url(#phtalo)', d: ring(70, 70, 40, 14, 2) }] }],
  },
];

mkdirSync(OUT_DIR, { recursive: true });
for (const item of DECOR) {
  writeFileSync(resolve(OUT_DIR, `${item.name}.svg`), svgFile(item));
  console.log(`[paint-decor] ${item.name}.svg`);
}
