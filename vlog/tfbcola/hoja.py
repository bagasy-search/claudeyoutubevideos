# hoja.py <out.jpg> <w> <cols> <img>... — hoja de contactos con rótulo (nombre) por celda
import sys, os
from PIL import Image, ImageDraw, ImageFont
out, W, cols, fs = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4:]
H = int(W * 9 / 16); rows = (len(fs) + cols - 1) // cols
S = Image.new('RGB', (cols * W, rows * H), (30, 30, 30)); d = ImageDraw.Draw(S)
try: font = ImageFont.truetype('arial.ttf', max(14, W // 18))
except: font = ImageFont.load_default()
for i, f in enumerate(fs):
    try: im = Image.open(f).convert('RGB')
    except Exception: continue
    im.thumbnail((W, H)); x, y = (i % cols) * W, (i // cols) * H; S.paste(im, (x, y))
    g = f.replace(chr(92), '/'); lab = g.split('/')[-3] + '/' + os.path.basename(g) if '/anc/' in g else os.path.basename(g)
    d.rectangle([x, y, x + len(lab) * W // 30 + 8, y + W // 14], fill=(0, 0, 0)); d.text((x + 4, y + 2), lab, fill=(255, 255, 0), font=font)
S.save(out, quality=82); print(out, S.size)
