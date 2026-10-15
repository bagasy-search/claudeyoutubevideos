# scripts/backfire_grid.py <img> <out.jpg> [--px] — CUADRÍCULA para MEDIR coordenadas antes de escribir props.
#   por defecto: líneas cada 5 % rotuladas en % (DocumentPage.highlights usa % de la página).
#   --px: la imagen se conforma a 1920x1080 (cover) y la grilla va cada 100 px (MapPin / SceneCallout usan px).
# Abrir la salida con la vista y leer las coordenadas: nunca a ojo sobre la imagen sin grilla.
import sys
from PIL import Image, ImageDraw, ImageOps
src, out = sys.argv[1], sys.argv[2]
px = '--px' in sys.argv
im = Image.open(src).convert('RGB')
if px:
    im = ImageOps.fit(im, (1920, 1080), Image.LANCZOS)
d = ImageDraw.Draw(im)
W, H = im.size
if px:
    for x in range(0, W, 100):
        d.line([(x, 0), (x, H)], fill=(255, 0, 255) if x % 500 == 0 else (255, 120, 255), width=2 if x % 500 == 0 else 1)
        d.text((x + 3, 3), str(x), fill=(255, 255, 0))
    for y in range(0, H, 100):
        d.line([(0, y), (W, y)], fill=(255, 0, 255) if y % 500 == 0 else (255, 120, 255), width=2 if y % 500 == 0 else 1)
        d.text((3, y + 3), str(y), fill=(255, 255, 0))
else:
    for k in range(0, 101, 5):
        x, y = W * k / 100, H * k / 100
        w = 2 if k % 10 == 0 else 1
        d.line([(x, 0), (x, H)], fill=(255, 0, 255), width=w)
        d.line([(0, y), (W, y)], fill=(255, 0, 255), width=w)
        d.text((x + 3, 3), f'{k}', fill=(200, 0, 0))
        d.text((3, y + 3), f'{k}', fill=(200, 0, 0))
im.save(out, quality=88)
print(f'{out}  ({W}x{H}, {"px cada 100" if px else "% cada 5"})')
