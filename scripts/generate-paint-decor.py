"""
@file Paint decor generator — DA v3 gouache / watercolor marks
@description Builds the paint marks of `docs/DA.md` §6 from original procedural
  shapes modelled on Léandre's references (impasto swipe, vertical smear,
  multi-colour impasto cluster, watercolour splat, bloom and drip).
  Outputs, for each mark:
    - src/assets/decor/paint/<name>.webp                 painted texture (RGBA, relief + light from top-left)
    - src/assets/decor/paint/silhouettes/<name>.svg      single-path silhouette (fill="currentColor", for CSS masks / inline)
  Colours = DA tokens only (copied from src/styles/variables.css).
  Usage: python scripts/generate-paint-decor.py   (needs numpy, opencv-python, scikit-image, pillow)
"""
from __future__ import annotations

import math
from pathlib import Path

import cv2
import numpy as np
from PIL import Image
from skimage import measure

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "decor" / "paint"
SIL = OUT / "silhouettes"

HEX = {
    "copper": "#c8743f", "copper-light": "#f0b07a", "copper-dark": "#8a4520",
    "gold": "#d9ae52", "gold-light": "#f6dc93", "gold-dark": "#8f6a22",
    "phtalo": "#1a7a66", "phtalo-light": "#2fa486", "phtalo-dark": "#0b4840",
    "phtalo-glint": "#3df2c0", "beam": "#f3e6cc",
}
# phtalo is lifted one step (phtalo-light as body) so it reads on the night background.
HEX["phtalo-light"] = "#2a9479"


def rgb(name: str) -> np.ndarray:
    h = HEX[name].lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0


PIG = {
    p: (rgb(f"{p}-dark"), rgb(p), rgb(f"{p}-light")) for p in ("copper", "gold", "phtalo")
}

# ---------------------------------------------------------------- noise utils


def fbm(h: int, w: int, rng: np.random.Generator, scale: float = 64, octaves: int = 4) -> np.ndarray:
    out = np.zeros((h, w), np.float32)
    amp, total = 1.0, 0.0
    s = scale
    for _ in range(octaves):
        gh, gw = max(2, int(h / s) + 2), max(2, int(w / s) + 2)
        g = rng.standard_normal((gh, gw)).astype(np.float32)
        out += amp * cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)
        total += amp
        amp *= 0.5
        s /= 2
    out /= total
    return (out - out.min()) / (np.ptp(out) + 1e-6)


def streaks(h: int, w: int, rng: np.random.Generator, along: float = 60, across: float = 1.2) -> np.ndarray:
    """Anisotropic noise: long along x, thin across y (bristle lines)."""
    n = rng.standard_normal((h, w)).astype(np.float32)
    n = cv2.GaussianBlur(n, (0, 0), sigmaX=along, sigmaY=across)
    return (n - n.min()) / (np.ptp(n) + 1e-6)


def smoothstep(e0: float, e1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def noise1d(n: int, rng: np.random.Generator, smooth: float) -> np.ndarray:
    v = rng.standard_normal(n + 64).astype(np.float32)
    v = cv2.GaussianBlur(v.reshape(1, -1), (0, 0), sigmaX=smooth).ravel()[32:32 + n]
    return (v - v.mean()) / (v.std() + 1e-6)


# ---------------------------------------------------------------- impasto stroke (horizontal frame)


def impasto_stroke(w: int, h: int, rng: np.random.Generator, *, length: float, width: float,
                   fray: float = 0.62, dry: float = 0.55, cap: float = 0.9, taper: float = 0.25):
    """Returns (mask, height, streak) for a horizontal stroke centred in a w×h canvas.
    Blunt loaded start on the left, bristles fraying and drying out on the right."""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    x0 = (w - length) / 2
    x1 = x0 + length
    t = np.clip((xx - x0) / length, 0, 1)
    cy = h / 2 + noise1d(w, rng, 140)[None, :] * width * 0.04
    # width profile: loaded start, slight belly, thinning towards the end
    prof = width * (0.92 + 0.12 * np.sin(np.pi * np.clip(t, 0, 1))) * (1 - taper * smoothstep(0.55, 1, t))
    top_n = noise1d(w, rng, 9)[None, :] * width * 0.006 + noise1d(w, rng, 110)[None, :] * width * 0.022
    bot_n = noise1d(w, rng, 8)[None, :] * width * 0.008 + noise1d(w, rng, 100)[None, :] * width * 0.026
    top = cy - prof / 2 + top_n
    bot = cy + prof / 2 + bot_n
    inside_y = (yy > top) & (yy < bot)
    v = np.clip((yy - top) / np.maximum(bot - top, 1), 0, 1)  # 0 top .. 1 bottom
    # blunt rounded start, with a little raggedness
    start_r = np.abs(v - 0.5) * 2
    start_edge = x0 + width * 0.18 * cap * (1 - np.sqrt(np.clip(1 - start_r ** 2, 0, 1))) + noise1d(h, rng, 3)[:, None] * 2.5
    # ragged bristle end: each row (bristle clump) stops at a different x
    clump = noise1d(h, rng, 2.2)[:, None]
    end_edge = x1 - length * (1 - fray) * np.clip(0.5 + 0.45 * clump, 0, 1) * (0.6 + 0.8 * np.abs(v - 0.5))
    mask = inside_y & (xx > start_edge) & (xx < end_edge)
    # dry-brush gaps along bristle lines in the last part of the stroke
    s = streaks(h, w, rng, along=length * 0.08, across=1.1)
    dryness = smoothstep(fray - 0.15, 1.0, t) * dry
    mask &= ~(s < dryness * 0.9)
    mask = mask.astype(np.float32)
    mask = cv2.GaussianBlur(mask, (0, 0), 1.6)
    mask = (mask > 0.5).astype(np.float32)
    # height: thick in the loaded part, ridges on the borders, bristle grooves
    dist = cv2.distanceTransform((mask * 255).astype(np.uint8), cv2.DIST_L2, 5)
    body = np.clip(dist / (width * 0.22), 0, 1) ** 0.6
    ridge = np.exp(-((dist - width * 0.05) ** 2) / (2 * (width * 0.03) ** 2)) * 0.18
    grooves = (streaks(h, w, rng, along=length * 0.12, across=1.4) - 0.5) * 0.9
    load = 1.15 - 0.55 * t
    height = (body * load + ridge + grooves * 0.22 * body) * mask
    streak = streaks(h, w, rng, along=length * 0.15, across=2.0)
    return mask, height, streak, v


def bend(img: np.ndarray, amp: float, periods: float, phase: float) -> np.ndarray:
    h, w = img.shape[:2]
    xx, yy = np.meshgrid(np.arange(w, dtype=np.float32), np.arange(h, dtype=np.float32))
    dy = amp * np.sin(2 * np.pi * periods * xx / w + phase)
    return cv2.remap(img, xx, yy - dy, cv2.INTER_LINEAR, borderValue=0)


def rotate(img: np.ndarray, deg: float, out_w: int, out_h: int, cx: float, cy: float) -> np.ndarray:
    h, w = img.shape[:2]
    m = cv2.getRotationMatrix2D((w / 2, h / 2), deg, 1.0)
    m[0, 2] += cx - w / 2
    m[1, 2] += cy - h / 2
    return cv2.warpAffine(img, m, (out_w, out_h), flags=cv2.INTER_LINEAR, borderValue=0)


def light(height: np.ndarray, mask: np.ndarray, strength: float = 13.0):
    """Lambert + warm specular, light from top-left (DA: fire light)."""
    hs = cv2.GaussianBlur(height, (0, 0), 1.2) * strength
    gx = cv2.Sobel(hs, cv2.CV_32F, 1, 0, ksize=3) / 8
    gy = cv2.Sobel(hs, cv2.CV_32F, 0, 1, ksize=3) / 8
    n = np.dstack([-gx, -gy, np.ones_like(gx)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    l = np.array([-0.55, -0.6, 0.58], np.float32)
    l /= np.linalg.norm(l)
    diff = np.clip((n * l).sum(2), 0, 1)
    hv = l + np.array([0, 0, 1], np.float32)
    hv /= np.linalg.norm(hv)
    spec = np.clip((n * hv).sum(2), 0, 1) ** 38
    return diff, spec


def paint_impasto(colfield: np.ndarray, height: np.ndarray, mask: np.ndarray, gloss: float = 0.55) -> np.ndarray:
    diff, spec = light(height, mask)
    shade = 0.62 + 0.55 * diff
    col = colfield * shade[..., None] + rgb("beam")[None, None, :] * (spec * gloss)[..., None]
    return np.clip(col, 0, 1)


# ---------------------------------------------------------------- watercolour shapes


def blob_mask(w: int, h: int, rng: np.random.Generator, cx: float, cy: float, r: float,
              rough: float = 0.28, sx: float = 1.0, sy: float = 1.0) -> np.ndarray:
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dx, dy = (xx - cx) / sx, (yy - cy) / sy
    ang = np.arctan2(dy, dx)
    rad = np.hypot(dx, dy)
    k = np.arange(1, 9)
    amps = rng.standard_normal(8) / k ** 1.1
    phs = rng.uniform(0, 2 * np.pi, 8)
    rr = r * (1 + rough * sum(a * np.sin(kk * ang + p) for a, kk, p in zip(amps, k, phs)) / 1.6)
    f = fbm(h, w, rng, scale=r * 0.6, octaves=4)
    return ((rad / rr) + (f - 0.5) * 0.5 < 1.0).astype(np.float32)


def tapered_line(m: np.ndarray, p0, p1, w0: float, w1: float):
    n = max(2, int(np.hypot(p1[0] - p0[0], p1[1] - p0[1]) / 2))
    for i in range(n + 1):
        t = i / n
        x = p0[0] + (p1[0] - p0[0]) * t
        y = p0[1] + (p1[1] - p0[1]) * t
        cv2.circle(m, (int(x), int(y)), max(1, int(round((w0 + (w1 - w0) * t) / 2))), 1.0, -1, lineType=cv2.LINE_AA)


def metaball(m: np.ndarray, sigma: float = 2.0) -> np.ndarray:
    return (cv2.GaussianBlur(m, (0, 0), sigma) > 0.45).astype(np.float32)


def splat_mask(w: int, h: int, rng: np.random.Generator, cx: float, cy: float, r: float, rays: int = 64) -> np.ndarray:
    m = blob_mask(w, h, rng, cx, cy, r, rough=0.32)
    def curved_ray(a, L, w0, w1, drift):
        pts, ang, rr = [], a, r * 0.7
        for i in range(13):
            pts.append((cx + np.cos(ang) * (rr + L * i / 12), cy + np.sin(ang) * (rr + L * i / 12)))
            ang += drift / 12
        for i in range(12):
            t0, t1 = i / 12, (i + 1) / 12
            tapered_line(m, pts[i], pts[i + 1], w0 + (w1 - w0) * t0, w0 + (w1 - w0) * t1)
        return pts[-1]

    for _ in range(rays):
        a = rng.uniform(0, 2 * np.pi)
        L = r * rng.choice([rng.uniform(0.12, 0.45), rng.uniform(0.45, 0.9)], p=[0.7, 0.3])
        end = curved_ray(a, L, rng.uniform(r * 0.06, r * 0.17), 1.5, rng.normal(0, 0.12))
        if rng.random() < 0.5:  # droplet beyond the ray
            d = rng.uniform(2.5, r * 0.05)
            k = rng.uniform(1.6, 3.5)
            cv2.circle(m, (int(end[0] + np.cos(a) * d * k), int(end[1] + np.sin(a) * d * k)), int(d), 1.0, -1, cv2.LINE_AA)
    # two long whip flicks, smoothly curved (the reference's dramatic streaks)
    for _ in range(2):
        curved_ray(rng.uniform(0, 2 * np.pi), r * rng.uniform(1.5, 2.3), r * 0.07, 1.2, rng.normal(0, 0.18))
    # satellite spray, denser near the body
    for _ in range(120):
        a = rng.uniform(0, 2 * np.pi)
        d = r * (1.05 + rng.exponential(0.55))
        s = max(1.0, r * 0.05 * rng.random() / (d / r))
        cv2.circle(m, (int(cx + np.cos(a) * d), int(cy + np.sin(a) * d)), int(s), 1.0, -1, cv2.LINE_AA)
    return metaball(m, 1.6)


def watercolor(mask: np.ndarray, col: np.ndarray, rng: np.random.Generator, edge_col: np.ndarray | None = None,
               base_alpha: float = 0.78) -> tuple[np.ndarray, np.ndarray]:
    """Flat watercolour: pigment pooled on the edges, granulation, soft cauliflower blooms."""
    h, w = mask.shape
    dist = cv2.distanceTransform((mask * 255).astype(np.uint8), cv2.DIST_L2, 5)
    edge = np.exp(-dist / 5.0)
    gran = fbm(h, w, rng, scale=18, octaves=3)
    bloom = fbm(h, w, rng, scale=90, octaves=3)
    rings = np.exp(-((bloom - 0.55) ** 2) / 0.0008) * 0.12
    alpha = mask * np.clip(base_alpha - 0.18 * (bloom - 0.5) + 0.22 * edge + 0.10 * (gran - 0.5) + rings * 0.4, 0, 1)
    colf = col if col.ndim == 3 else col[None, None, :]
    ec = edge_col if edge_col is not None else colf * 0.72
    ecf = ec if ec.ndim == 3 else ec[None, None, :]
    c = colf * (1 - edge[..., None] * 0.6) + ecf * (edge[..., None] * 0.6)
    c = c * (0.94 + 0.12 * gran[..., None])
    return np.clip(c, 0, 1), np.clip(alpha, 0, 1)


# ---------------------------------------------------------------- compositing / export


class Canvas:
    def __init__(self, w: int, h: int):
        self.w, self.h = w, h
        self.rgb = np.zeros((h, w, 3), np.float32)
        self.a = np.zeros((h, w), np.float32)

    def over(self, col: np.ndarray, alpha: np.ndarray):
        a = alpha[..., None]
        out_a = alpha + self.a * (1 - alpha)
        self.rgb = (col * a + self.rgb * self.a[..., None] * (1 - a)) / np.maximum(out_a[..., None], 1e-6)
        self.a = out_a

    def drop_shadow(self, dx: int = 6, dy: int = 9, blur: float = 7, opacity: float = 0.45):
        sh = cv2.GaussianBlur(np.roll(np.roll(self.a, dy, 0), dx, 1), (0, 0), blur) * opacity
        out_a = self.a + sh * (1 - self.a)
        self.rgb = (self.rgb * self.a[..., None]) / np.maximum(out_a[..., None], 1e-6)
        self.a = out_a

    def save(self, name: str, out_w: int | None = None):
        OUT.mkdir(parents=True, exist_ok=True)
        SIL.mkdir(parents=True, exist_ok=True)
        ys, xs = np.where(self.a > 0.02)
        pad = 8
        y0, y1 = max(0, ys.min() - pad), min(self.h, ys.max() + pad)
        x0, x1 = max(0, xs.min() - pad), min(self.w, xs.max() + pad)
        rgba = np.dstack([self.rgb, self.a])[y0:y1, x0:x1]
        img = Image.fromarray((np.clip(rgba, 0, 1) * 255).astype(np.uint8), "RGBA")
        if out_w and img.width > out_w:
            img = img.resize((out_w, round(img.height * out_w / img.width)), Image.LANCZOS)
        img.save(OUT / f"{name}.webp", "WEBP", quality=86, method=6)
        write_silhouette(self.a[y0:y1, x0:x1], name)
        print(f"{name}: {img.width}x{img.height}  {(OUT / f'{name}.webp').stat().st_size // 1024} KB")


def write_silhouette(alpha: np.ndarray, name: str):
    m = cv2.GaussianBlur((alpha > 0.35).astype(np.float32), (0, 0), 1.0)
    m = np.pad(m, 2)
    h, w = m.shape
    parts = []
    for c in measure.find_contours(m, 0.5):
        if len(c) < 8:
            continue
        area = 0.5 * abs(np.dot(c[:, 0], np.roll(c[:, 1], 1)) - np.dot(c[:, 1], np.roll(c[:, 0], 1)))
        if area < 6:
            continue
        p = measure.approximate_polygon(c, tolerance=0.9)
        parts.append("M" + "L".join(f"{x - 2:.1f} {y - 2:.1f}" for y, x in p) + "Z")
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w - 4} {h - 4}" aria-hidden="true">'
           f'<path fill="currentColor" fill-rule="evenodd" d="{"".join(parts)}"/></svg>\n')
    (SIL / f"{name}.svg").write_text(svg, encoding="utf-8")


def color_field(v: np.ndarray, streak: np.ndarray, bands: list[tuple[str, float]], rng, wobble: float = 0.05,
                highlights: float = 0.0) -> np.ndarray:
    """Bands of pigment across the stroke width (v: 0 top → 1 bottom), streaked along the stroke."""
    h, w = v.shape
    wob = (fbm(h, w, rng, scale=120, octaves=3) - 0.5) * wobble * 2
    vv = np.clip(v + wob + (streak - 0.5) * 0.08, 0, 1)
    edges = np.cumsum([b[1] for b in bands])
    edges = edges / edges[-1]
    col = np.zeros((h, w, 3), np.float32)
    prev = 0.0
    for (p, _), e in zip(bands, edges):
        sel = ((vv >= prev) & (vv <= e)).astype(np.float32)
        dark, mid, lite = PIG[p]
        mix = np.clip((streak - 0.5) * 3.2, -1, 1)
        mx = mix[..., None]
        c = mid[None, None, :] + np.where(mx > 0, (lite - mid)[None, None, :] * mx, (mid - dark)[None, None, :] * mx)
        col += c * sel[..., None]
        prev = e
    if highlights:
        hl = (streaks(h, w, rng, along=80, across=1.5) > 1 - highlights).astype(np.float32)
        col = col * (1 - hl[..., None] * 0.7) + rgb("beam")[None, None, :] * hl[..., None] * 0.7
    return col


# ---------------------------------------------------------------- marks


def swipe(name: str, pigment: str, seed: int, *, W=1700, H=620, length=1350, width=300, deg=-4.0, out_w=1400):
    rng = np.random.default_rng(seed)
    mask, height, streak, v = impasto_stroke(W, H, rng, length=length, width=width)
    col = color_field(v, streak, [(pigment, 1)], rng)
    rgbv = paint_impasto(col, height, mask)
    rgbv, mask = bend(rgbv, 22, 0.6, seed), bend(mask, 22, 0.6, seed)
    cv_ = Canvas(W, H)
    cv_.over(rotate(rgbv, deg, W, H, W / 2, H / 2), rotate(mask, deg, W, H, W / 2, H / 2))
    flecks(cv_, rng, pigment, x=W / 2 + length * 0.42, y=H / 2, spread=(160, 120), n=26)
    cv_.drop_shadow()
    cv_.save(name, out_w)


def underline(name: str, pigment: str, seed: int):
    swipe(name, pigment, seed, W=1500, H=240, length=1300, width=70, deg=-1.5, out_w=900)


def smear_vertical(name: str, seed: int):
    """Ref 1: loaded vertical smear, three pigments side by side, crumbly dry end at the bottom."""
    rng = np.random.default_rng(seed)
    W, H = 760, 1500
    mask, height, streak, v = impasto_stroke(H, W, rng, length=1150, width=300, fray=0.7, dry=0.75, taper=0.15)
    col = color_field(v, streak, [("phtalo", 0.8), ("gold", 0.9), ("copper", 1.4)], rng, wobble=0.07, highlights=0.04)
    rgbv = paint_impasto(col, height, mask)
    cv_ = Canvas(W, H)
    cv_.over(rotate(rgbv, -92, W, H, W / 2, H / 2), rotate(mask, -92, W, H, W / 2, H / 2))
    flecks(cv_, rng, "copper", x=W / 2, y=H / 2 + 560, spread=(140, 90), n=40, small=True)
    cv_.drop_shadow()
    cv_.save(name, 560)


def impasto_cluster(name: str, seed: int):
    """Ref 4: several thick diagonal strokes overlapping, multi-pigment, dry flecks."""
    rng = np.random.default_rng(seed)
    W, H = 1500, 1500
    cv_ = Canvas(W, H)
    plan = [
        ("copper", [("copper", 1), ("gold", 0.6)], (W * 0.56, H * 0.33), 1000, 230, -28),
        ("gold", [("gold", 1), ("copper", 0.5)], (W * 0.47, H * 0.47), 1080, 260, -24),
        ("beam", [("gold", 0.3), ("copper", 0.2)], (W * 0.5, H * 0.58), 900, 120, -22),
        ("phtalo", [("phtalo", 1), ("gold", 0.25)], (W * 0.45, H * 0.68), 1050, 240, -18),
        ("phtalo", [("phtalo", 1)], (W * 0.52, H * 0.8), 700, 130, -14),
    ]
    for i, (_, bands, (cx, cy), length, width, deg) in enumerate(plan):
        r2 = np.random.default_rng(seed * 10 + i)
        sw, sh = int(length * 1.25), int(width * 2.2)
        mask, height, streak, v = impasto_stroke(sw, sh, r2, length=length, width=width, fray=0.6, dry=0.6)
        col = color_field(v, streak, bands, r2, wobble=0.08, highlights=0.06 if i == 2 else 0.02)
        if i == 2:  # light-beam stroke: the « white » of the reference, warm ivory
            col = col * 0.25 + rgb("beam")[None, None, :] * 0.75
        rgbv = paint_impasto(col, height, mask, gloss=0.65)
        rgbv, mask = bend(rgbv, 18, 0.5, i), bend(mask, 18, 0.5, i)
        cv_.over(rotate(rgbv, deg, W, H, cx, cy), rotate(mask, deg, W, H, cx, cy))
    flecks(cv_, rng, "copper", x=W * 0.78, y=H * 0.22, spread=(220, 160), n=40)
    flecks(cv_, rng, "phtalo", x=W * 0.2, y=H * 0.82, spread=(200, 140), n=30)
    cv_.drop_shadow()
    cv_.save(name, 1100)


def flecks(cv_: Canvas, rng, pigment: str, x: float, y: float, spread, n: int, small: bool = False):
    dark, mid, lite = PIG[pigment]
    m = np.zeros((cv_.h, cv_.w), np.float32)
    for _ in range(n):
        px = int(x + rng.normal(0, spread[0]))
        py = int(y + rng.normal(0, spread[1]))
        r = rng.uniform(1.5, 4 if small else 7)
        ax = (int(r * rng.uniform(1, 2.6)), int(r))
        cv2.ellipse(m, (px, py), ax, rng.uniform(0, 180), 0, 360, 1.0, -1, cv2.LINE_AA)
    col = np.broadcast_to((mid * 0.6 + lite * 0.4)[None, None, :], (cv_.h, cv_.w, 3)).copy()
    hgt = cv2.GaussianBlur(m, (0, 0), 1.5)
    cv_.over(paint_impasto(col, hgt, m), m)


def splat(name: str, pigment: str, seed: int):
    """Ref 3: watercolour splat — organic body, radial rays, whip streaks, spray."""
    rng = np.random.default_rng(seed)
    W = H = 1400
    m = splat_mask(W, H, rng, W / 2, H / 2, 210)
    dark, mid, lite = PIG[pigment]
    c, a = watercolor(m, mid, rng, edge_col=dark, base_alpha=0.72)
    cv_ = Canvas(W, H)
    cv_.over(c, a)
    cv_.save(name, 1000)


def bloom(name: str, seed: int):
    """Ref 5: layered watercolour blooms in three pigments, bleeding into each other, with spray."""
    rng = np.random.default_rng(seed)
    W, H = 1200, 1500
    cv_ = Canvas(W, H)
    for p, (cx, cy, r, sx, sy) in [("phtalo", (W * 0.47, H * 0.33, 230, 1.1, 0.85)),
                                   ("copper", (W * 0.52, H * 0.52, 260, 1.15, 0.85)),
                                   ("gold", (W * 0.5, H * 0.7, 210, 1.0, 0.9))]:
        m = blob_mask(W, H, rng, cx, cy, r, rough=0.4, sx=sx, sy=sy)
        for _ in range(10):
            a = rng.uniform(0, 2 * np.pi)
            L = r * rng.uniform(0.3, 0.9)
            tapered_line(m, (cx + np.cos(a) * r * 0.8, cy + np.sin(a) * r * 0.8),
                         (cx + np.cos(a) * (r * 0.8 + L), cy + np.sin(a) * (r * 0.8 + L)), r * 0.08, 1)
        for _ in range(40):
            a = rng.uniform(0, 2 * np.pi)
            d = r * (1.0 + rng.exponential(0.5))
            cv2.circle(m, (int(cx + np.cos(a) * d), int(cy + np.sin(a) * d)), int(rng.uniform(1, 7)), 1.0, -1, cv2.LINE_AA)
        m = metaball(m, 1.8)
        dark, mid, lite = PIG[p]
        c, a = watercolor(m, mid, rng, edge_col=dark, base_alpha=0.6)
        cv_.over(c, a * 0.82)
    cv_.save(name, 900)


def drip(name: str, blob_pig: str, drip_pig: str, seed: int):
    """Ref 6: watercolour blot at the top, runs dripping down with bulb ends, a few drops aside."""
    rng = np.random.default_rng(seed)
    W, H = 1000, 1600
    m = blob_mask(W, H, rng, W * 0.46, H * 0.2, 230, rough=0.35, sx=1.2, sy=0.75)
    runs = np.zeros_like(m)
    ys, xs = np.where(m > 0)
    left, right = xs.min() + 40, xs.max() - 40
    for i in range(rng.integers(5, 8)):
        x = rng.uniform(left, right)
        col_ys = ys[np.abs(xs - x) < 3]
        if col_ys.size == 0:
            continue
        y0 = col_ys.max() - 10
        L = rng.uniform(250, 1050)
        w0 = rng.uniform(22, 44)
        w1 = rng.uniform(7, 13)
        y0 -= 45
        prev = (x, y0)
        wig = rng.uniform(2, 6)
        for k in range(1, 41):
            t = k / 40
            cur = (x + np.sin(t * 7 + i) * wig * t, y0 + L * t)
            ww = w1 + (w0 - w1) * (1 - t) ** 3
            tapered_line(runs, prev, cur, ww, ww)
            prev = cur
        cv2.circle(runs, (int(prev[0]), int(prev[1])), int(w1 * 0.95), 1.0, -1, cv2.LINE_AA)
    for _ in range(6):
        cv2.circle(m, (int(rng.uniform(W * 0.7, W * 0.95)), int(rng.uniform(H * 0.08, H * 0.3))), int(rng.uniform(4, 16)), 1.0, -1, cv2.LINE_AA)
    blob_bottom = ys.max()
    m = metaball(np.maximum(m, runs), 1.5)
    d1, m1, l1 = PIG[drip_pig]
    d0, m0, l0 = PIG[blob_pig]
    yy = np.arange(H, dtype=np.float32)[:, None, None]
    k = smoothstep(blob_bottom - 120, blob_bottom + 60, yy)
    col = (m0 * 0.8 + l0 * 0.2)[None, None, :] * (1 - k) + m1[None, None, :] * k
    c, a = watercolor(m, col, rng, edge_col=d1, base_alpha=0.74)
    cv_ = Canvas(W, H)
    cv_.over(c, a)
    cv_.save(name, 640)


def droplets(name: str, pigment: str, seed: int):
    rng = np.random.default_rng(seed)
    W, H = 700, 360
    m = np.zeros((H, W), np.float32)
    for x, y, r in [(110, 170, 46), (300, 120, 18), (380, 220, 26), (520, 150, 12), (610, 230, 8), (240, 260, 7)]:
        cv2.circle(m, (x, y), r, 1.0, -1, cv2.LINE_AA)
    m *= blob_mask(W, H, rng, W / 2, H / 2, 900, rough=0.05)
    m = metaball(m, 2.5)
    dark, mid, lite = PIG[pigment]
    c, a = watercolor(m, mid, rng, edge_col=dark, base_alpha=0.85)
    cv_ = Canvas(W, H)
    cv_.over(c, a)
    cv_.save(name, 420)


if __name__ == "__main__":
    swipe("swipe-copper", "copper", 11)
    swipe("swipe-gold", "gold", 23, deg=3)
    swipe("swipe-phtalo", "phtalo", 37, deg=-6)
    underline("underline-copper", "copper", 41)
    underline("underline-phtalo", "phtalo", 43)
    smear_vertical("smear-vertical-trio", 51)
    impasto_cluster("impasto-cluster", 61)
    splat("splat-copper", "copper", 71)
    splat("splat-phtalo", "phtalo", 73)
    bloom("bloom-trio", 81)
    drip("drip-gold", "gold", "copper", 91)
    drip("drip-copper", "copper", "copper", 93)
    droplets("droplets-gold", "gold", 97)
