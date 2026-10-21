"""
Bake desktop + mobile screenshots into a perspective overlay for
laptop-iphone-marble.png.

Usage (from repo root):
  python scripts/bake-dual-mockup-screens.py visualcom

Expects:
  src/assets/projects/<slug>/desktop.png
  src/assets/projects/<slug>/mobile.png

Writes:
  src/assets/projects/<slug>/mockup-screens.png
"""
from __future__ import annotations

import sys
from collections import deque
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
MOCKUP = ROOT / "src" / "assets" / "mockups" / "laptop-iphone-marble.png"


def is_black(rgb: tuple[int, int, int]) -> bool:
    r, g, b = rgb
    return r < 35 and g < 35 and b < 35


def find_screen_components(im: Image.Image) -> list[dict]:
    w, h = im.size
    px = im.load()
    visited = [[False] * w for _ in range(h)]
    components: list[dict] = []

    for y0 in range(h):
        for x0 in range(w):
            if visited[y0][x0] or not is_black(px[x0, y0]):
                continue
            q = deque([(x0, y0)])
            visited[y0][x0] = True
            cells: list[tuple[int, int]] = []
            minx = maxx = x0
            miny = maxy = y0
            while q:
                x, y = q.popleft()
                cells.append((x, y))
                minx = min(minx, x)
                maxx = max(maxx, x)
                miny = min(miny, y)
                maxy = max(maxy, y)
                for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
                    if 0 <= nx < w and 0 <= ny < h and not visited[ny][nx] and is_black(px[nx, ny]):
                        visited[ny][nx] = True
                        q.append((nx, ny))
            area = len(cells)
            bw = maxx - minx + 1
            bh = maxy - miny + 1
            if area < 2000 or (bw > w * 0.9 and bh > h * 0.9):
                continue
            components.append({"area": area, "cells": cells})

    components.sort(key=lambda c: -c["area"])
    return components


def corners_from_cells(cells: list[tuple[int, int]]) -> list[tuple[float, float]]:
    tl = max(cells, key=lambda p: -(p[0] + p[1]))
    tr = max(cells, key=lambda p: p[0] - p[1])
    br = max(cells, key=lambda p: p[0] + p[1])
    bl = max(cells, key=lambda p: -p[0] + p[1])
    return [
        (float(tl[0]), float(tl[1])),
        (float(tr[0]), float(tr[1])),
        (float(br[0]), float(br[1])),
        (float(bl[0]), float(bl[1])),
    ]


def find_perspective_coeffs(
    source: list[tuple[float, float]],
    destination: list[tuple[float, float]],
) -> list[float]:
    matrix: list[list[float]] = []
    for (xs, ys), (xd, yd) in zip(source, destination):
        matrix.append([xd, yd, 1, 0, 0, 0, -xs * xd, -xs * yd, xs])
        matrix.append([0, 0, 0, xd, yd, 1, -ys * xd, -ys * yd, ys])

    n = 8
    for col in range(n):
        pivot = max(range(col, n), key=lambda r: abs(matrix[r][col]))
        matrix[col], matrix[pivot] = matrix[pivot], matrix[col]
        piv = matrix[col][col]
        if abs(piv) < 1e-12:
            raise RuntimeError("Singular matrix in perspective solve")
        for j in range(col, n + 1):
            matrix[col][j] /= piv
        for row in range(n):
            if row == col:
                continue
            factor = matrix[row][col]
            for j in range(col, n + 1):
                matrix[row][j] -= factor * matrix[col][j]

    return [matrix[i][n] for i in range(n)]


def warp_to_quad(
    shot: Image.Image,
    mockup_size: tuple[int, int],
    quad: list[tuple[float, float]],
) -> Image.Image:
    sw, sh = shot.size
    source = [(0.0, 0.0), (float(sw), 0.0), (float(sw), float(sh)), (0.0, float(sh))]
    coeffs = find_perspective_coeffs(source, quad)
    rgba = shot.convert("RGBA")
    return rgba.transform(
        mockup_size,
        Image.Transform.PERSPECTIVE,
        coeffs,
        resample=Image.Resampling.BICUBIC,
        fillcolor=(0, 0, 0, 0),
    )


def tone(layer: Image.Image) -> Image.Image:
    r, g, b, a = layer.split()
    rgb = Image.merge("RGB", (r, g, b)).point(lambda v: int(v * 0.96))
    out = rgb.convert("RGBA")
    out.putalpha(a)
    return out


def bake(slug: str) -> Path:
    shots_dir = ROOT / "src" / "assets" / "projects" / slug
    desktop_path = shots_dir / "desktop.png"
    mobile_path = shots_dir / "mobile.png"
    if not desktop_path.is_file() or not mobile_path.is_file():
        raise SystemExit(f"Missing desktop.png or mobile.png in {shots_dir}")

    desktop = Image.open(desktop_path)
    mobile = Image.open(mobile_path)
    mockup = Image.open(MOCKUP).convert("RGBA")

    components = find_screen_components(mockup.convert("RGB"))
    if len(components) < 2:
        raise SystemExit(f"Expected 2 screens, found {len(components)}")

    laptop_layer = warp_to_quad(desktop, mockup.size, corners_from_cells(components[0]["cells"]))
    phone_layer = warp_to_quad(mobile, mockup.size, corners_from_cells(components[1]["cells"]))

    overlay = Image.new("RGBA", mockup.size, (0, 0, 0, 0))
    overlay.alpha_composite(tone(laptop_layer))
    overlay.alpha_composite(tone(phone_layer))

    out = shots_dir / "mockup-screens.png"
    overlay.save(out, optimize=True)
    return out


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit(__doc__)
    out = bake(sys.argv[1].strip())
    print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
