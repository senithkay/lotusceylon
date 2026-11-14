import sys
from PIL import Image
import numpy as np
src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
bg = 252.0
raw = np.clip((bg - im.min(axis=2)) / bg, 0, 1)             # colour-to-alpha
a = np.clip((raw - 0.06) / 0.45, 0, 1)                         # firm up strokes, drop paper noise
safe = np.maximum(raw, 1e-3)[..., None]
fg = np.clip((im - (1 - raw[..., None]) * bg) / safe, 0, 255)  # un-mix the white
r, g, b = fg[..., 0], fg[..., 1], fg[..., 2]
pink = (r > 150) & (g < 150) & (r > g + 70) & (r > b)
blue = (b > r + 40) & (b > g)
grey = ~pink & ~blue

def save(rgb, alpha, path, box=None, width=None):
    arr = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    img = Image.fromarray(arr, 'RGBA')
    if box: img = img.crop(box)
    if width: img = img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
    img.save(path, optimize=True)
    return img

# colour version
col = fg.copy()
# white version (keep the pink lotus, soften the island outline)
wht = np.where(pink[..., None], fg, 255.0)
a_w = np.where(grey & (raw < 0.6), a * 0.55, a)

ys, xs = np.where(a > 0.2); full = (xs.min() - 10, ys.min() - 10, xs.max() + 10, ys.max() + 10)
yb, xb = np.where((a > 0.2) & blue); word = (xb.min() - 8, min(yb.min(), ys.min()) - 8, xb.max() + 8, yb.max() + 8)
print('full', full, 'word', word)
save(col, a, f'{out}/logo-full.png', full, 900)
save(wht, a_w, f'{out}/logo-full-white.png', full, 900)
save(col, a, f'{out}/logo-wordmark.png', word, 640)
save(wht, a_w, f'{out}/logo-wordmark-white.png', word, 640)

# favicon: the lotus flower on white
yp, xp = np.where((a > 0.5) & pink & (raw > 0.5))
cx, cy = (xp.min() + xp.max()) // 2, (yp.min() + yp.max()) // 2
half = int(max(xp.max() - xp.min(), yp.max() - yp.min()) * 0.62)
near_pink = (r > g + 30) & (r > b - 10)
flower = Image.fromarray(np.dstack([col, np.where(near_pink, a, 0) * 255]).astype(np.uint8), 'RGBA').crop((cx - half, cy - half, cx + half, cy + half))
for size, name in [(512, 'icon.png'), (180, 'apple-icon.png')]:
    canvas = Image.new('RGBA', (size, size), (255, 255, 255, 255))
    f = flower.resize((size, size), Image.LANCZOS)
    canvas.alpha_composite(f)
    canvas.convert('RGB').save(f'{out}/{name}', optimize=True)
