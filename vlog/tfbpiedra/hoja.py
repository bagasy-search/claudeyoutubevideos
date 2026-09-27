# hoja de contactos: python hoja.py out.jpg cols ancho f1 f2 ... (rótulo = carpeta/archivo)
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, cols, W = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); fs = sys.argv[4:]
H = int(W * 9 / 16); rows = (len(fs) + cols - 1) // cols
im = Image.new("RGB", (cols * W, rows * (H + 22)), "white"); d = ImageDraw.Draw(im)
try: font = ImageFont.truetype("arial.ttf", 16)
except: font = ImageFont.load_default()
for i, f in enumerate(fs):
    x, y = (i % cols) * W, (i // cols) * (H + 22)
    try: t = Image.open(f).convert("RGB"); t.thumbnail((W, H)); im.paste(t, (x, y + 22))
    except Exception as e: d.text((x + 5, y + 40), "ERR " + str(e)[:40], fill="red", font=font)
    p = f.replace("\\", "/").split("/"); d.text((x + 4, y + 3), "/".join(p[-3:-2] + p[-1:]), fill="black", font=font)
im.save(out, quality=82); print(out, len(fs))
