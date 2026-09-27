# hoja de contactos: python hoja.py out.jpg img1 img2 ... (rótulo = carpeta/escena + nombre)
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, fs = sys.argv[1], sys.argv[2:]
cols = int(os.environ.get("COLS", 4)); w, h = int(os.environ.get("W", 480)), 0
ims = []
for f in fs:
    im = Image.open(f).convert("RGB"); r = w / im.width; im = im.resize((w, int(im.height * r))); ims.append((f, im)); h = max(h, im.height)
rows = (len(ims) + cols - 1) // cols
S = Image.new("RGB", (cols * w, rows * (h + 26)), "white"); d = ImageDraw.Draw(S)
try: font = ImageFont.truetype("arial.ttf", 18)
except: font = None
for i, (f, im) in enumerate(ims):
    x, y = (i % cols) * w, (i // cols) * (h + 26)
    S.paste(im, (x, y + 26)); p = f.replace("\\", "/").split("/"); d.text((x + 4, y + 3), "/".join(p[-3:]).replace("/anc/", "/"), fill="black", font=font)
S.save(out, quality=82)
