#!/usr/bin/env python3
"""Task 21: Extract REAL glossy Win7 icons from user's uploaded icon sheet.
Background = smooth blue/green gradient wallpaper -> model it per-cell via
border-ring interpolation, then alpha-matte + hole-fill + feather."""
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
from scipy.interpolate import griddata
import os

SRC = "/home/z/my-project/upload/dadr79hskpnc1.png"
OUT = "/home/z/my-project/public/icons"
os.makedirs(OUT, exist_ok=True)

img = Image.open(SRC).convert("RGB")
W, H = img.size  # 2000 x 3000

# grid: 4 cols x 6 rows (row 6 sits below a divider band)
col_c = [418, 819, 1219, 1620]
row_c = [403, 853, 1304, 1750, 2195, 2637]
CELL_W, CELL_H = 470, 420

ICONS = {
    "folder-videos":  (0, 0),   # folder w/ film strip
    "shield-check":   (1, 0),   # green security shield
    "windows-flag":   (2, 0),   # win7 flag (glossy version)
    "cd-music":       (3, 0),   # CD + music note
    "media-player":   (0, 1),   # glass stack + orange play (WMP style)
    "dvd":            (1, 1),   # DVD disc
    "wav-file":       (2, 1),   # WAV file icon  <-- SOUND
    "ie":             (3, 1),   # Internet Explorer
    "monitor-pair":   (0, 2),   # monitors + cable
    "battery":        (1, 2),
    "folder":         (2, 2),   # manila folder
    "notepad":        (3, 2),   # glass notepad
    "film":           (0, 3),
    "info":           (1, 3),   # blue info circle
    "users":          (2, 3),   # contacts
    "win-update":     (3, 3),
    "monitor":        (0, 4),   # Computer!
    "speaker":        (1, 4),   # Speaker! <-- SOUND
    "globe-mic":      (2, 4),
    "spiky":          (3, 4),
    "recycle-full":   (0, 5),   # Recycle bin full!
    "shield-4color":  (1, 5),
    "firewall":       (2, 5),
    "network":        (3, 5),
}

TOL_OVERRIDE = {"users": 30.0, "recycle-full": 44.0}
CLOSE_OVERRIDE = {"recycle-full": 13}
SOFT_GLASS = {"recycle-full"}

def extract(name, cx, cy, tol=42.0, close_k=7):
    box = (max(cx - CELL_W // 2, 0), max(cy - CELL_H // 2, 0),
           min(cx + CELL_W // 2, W), min(cy + CELL_H // 2, H))
    cell = np.asarray(img.crop(box), dtype=np.float64)
    h, w, _ = cell.shape

    # --- background model from border ring + flat interior samples ---
    ring = 10
    ys, xs = np.mgrid[0:h, 0:w]
    border = np.zeros((h, w), bool)
    border[:ring, :] = border[-ring:, :] = True
    border[:, :ring] = border[:, -ring:] = True
    # sparse interior grid, keep only FLAT patches (local std small => real bg)
    inside = np.zeros((h, w), bool)
    step = 26
    inside[ring + 8::step, ring + 8::step] = True
    flat = np.zeros((h, w), bool)
    gray = cell.mean(-1)
    mg = ndimage.uniform_filter(gray, 9)
    mg2 = ndimage.uniform_filter(gray * gray, 9)
    std = np.sqrt(np.maximum(mg2 - mg * mg, 0))
    flat = std < 5.5
    src = border | (inside & flat)
    pts = np.stack([ys[src], xs[src]], 1).astype(float)
    vals = cell[src]
    gy, gx = np.mgrid[0:h:16, 0:w:16]
    bg_small = griddata(pts, vals, (gy, gx), method="nearest")
    bg = np.asarray(Image.fromarray(bg_small.astype(np.uint8)).resize((w, h), Image.BILINEAR)
                    .filter(ImageFilter.GaussianBlur(12)), dtype=np.float64)

    # --- alpha matte ---
    dist = np.sqrt(((cell - bg) ** 2).sum(-1))
    fg = dist > tol
    fg = ndimage.binary_opening(fg, np.ones((3, 3)))
    lbl, n = ndimage.label(fg)
    if n == 0:
        return None
    sizes = ndimage.sum(fg, lbl, range(1, n + 1))
    mx = sizes.max()
    ids = [i + 1 for i, s in enumerate(sizes) if s >= 0.15 * mx]
    # wallpaper light-streaks cross the whole cell -> they touch left/right edge -> drop
    clean = []
    for i in ids:
        ys_i, xs_i = np.where(lbl == i)
        if (xs_i < 3).any() or (xs_i > w - 4).any():
            continue
        bw = xs_i.max() - xs_i.min()
        bh = ys_i.max() - ys_i.min()
        if bw > 0.5 * w and bh < 0.13 * h:  # flat horizontal streak sliver
            continue
        clean.append(i)
    ids = clean
    if not ids:
        return None
    # multi-part icons (users=2 people, disc+note) keep parts >=15% of main; drop streaks/fragments
    keep = np.isin(lbl, ids)
    # close cracks (glass rims), fill enclosed glass holes, cut bg fringe
    keep = ndimage.binary_closing(keep, np.ones((close_k, close_k)))
    keep = ndimage.binary_fill_holes(keep)
    keep = ndimage.binary_opening(keep, np.ones((3, 3)))
    keep = ndimage.binary_erosion(keep, iterations=1)

    alpha_bin = ndimage.gaussian_filter(keep.astype(float), 1.3)
    if name in SOFT_GLASS:
        # translucent glass (recycle bin) -> semi-transparent instead of holes
        soft = np.clip((dist - 8.0) / 50.0, 0, 1)
        alpha = (alpha_bin * (0.38 + 0.62 * soft) * 255).astype(np.uint8)
    else:
        alpha = (alpha_bin * 255).astype(np.uint8)
    rgba = np.dstack([cell.astype(np.uint8), alpha])
    out = Image.fromarray(rgba)

    bbox = out.getbbox()
    if not bbox:
        return None
    out = out.crop(bbox)
    # pad to square, icon centered
    s = max(out.size) + 8
    sq = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    sq.paste(out, ((s - out.width) // 2, (s - out.height) // 2))
    return sq

# only the ones we actually need on the site
WANT = ["folder", "monitor", "recycle-full", "notepad", "ie", "media-player",
        "wav-file", "speaker", "cd-music", "users", "info", "folder-videos", "shield-check"]

report = []
for name in WANT:
    c, r = ICONS[name]
    im = extract(name, col_c[c], row_c[r], tol=TOL_OVERRIDE.get(name, 42.0),
                 close_k=CLOSE_OVERRIDE.get(name, 7))
    if im is None:
        report.append((name, "FAIL"))
        continue
    im.save(f"{OUT}/{name}.png")
    report.append((name, f"{im.width}x{im.height}"))

# contact sheet for visual QA: same icons on dark & light halves
pad, cell = 12, 150
cols = 7
rows = (len(WANT) + cols - 1) // cols
sheet = Image.new("RGB", (cols * (cell + pad) + pad, rows * 2 * (cell + pad) + pad), (40, 40, 40))
dr = Image.new("RGB", (cols * (cell + pad) + pad, rows * 2 * (cell + pad) + pad), (245, 245, 245))
for i, name in enumerate(WANT):
    p = f"{OUT}/{name}.png"
    if not os.path.exists(p):
        continue
    ic = Image.open(p).resize((cell, cell), Image.LANCZOS)
    x = pad + (i % cols) * (cell + pad)
    y = pad + (i // cols) * (cell + pad)
    sheet.paste(ic, (x, y), ic)
    dr.paste(ic, (x, y), ic)
combo = Image.new("RGB", (sheet.width, sheet.height * 2 + 10), (0, 0, 0))
combo.paste(sheet, (0, 0)); combo.paste(dr, (0, sheet.height + 10))
combo.save("/home/z/my-project/download/task21_icon_qa.png")
print("\n".join(f"{n}: {s}" for n, s in report))
