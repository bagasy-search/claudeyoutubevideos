# Hoja de contactos: python sheet.py out.jpg cols w img1 img2 ... (rótulo = nombre de archivo)
import sys, os
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
h = int(w * 9 / 16); rows = (len(fs) + cols - 1) // cols
S = Image.new("RGB", (cols * w, rows * (h + 18)), "white"); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    try: im = Image.open(f).convert("RGB")
    except Exception: continue
    im.thumbnail((w, h)); x, y = (i % cols) * w, (i // cols) * (h + 18)
    S.paste(im, (x, y + 18)); d.text((x + 3, y + 2), os.path.basename(f)[:40], fill="black")
S.save(out, quality=82); print(out, len(fs))
