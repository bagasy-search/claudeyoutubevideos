# hoja de contactos: python hoja.py out.jpg cols ancho img1 img2 ... (rótulo = carpeta/archivo)
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
h = int(w * 9 / 16); rows = (len(fs) + cols - 1) // cols
S = Image.new("RGB", (cols * w, rows * (h + 22)), "black"); d = ImageDraw.Draw(S)
try: font = ImageFont.truetype("arial.ttf", 16)
except Exception: font = None
for i, f in enumerate(fs):
    try: im = Image.open(f).convert("RGB").resize((w, h))
    except Exception: continue
    x, y = (i % cols) * w, (i // cols) * (h + 22)
    S.paste(im, (x, y + 22)); lab = os.path.basename(os.path.dirname(os.path.dirname(f))) + "/" + os.path.basename(f)
    d.text((x + 4, y + 2), lab, fill="yellow", font=font)
S.save(out, quality=85)
