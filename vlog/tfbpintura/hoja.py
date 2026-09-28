# hoja.py <out.jpg> <cols> <img1> [img2 ...]  -> hoja de contactos con rótulo (ruta corta) por celda
import sys
from PIL import Image, ImageDraw, ImageFont
out, cols, imgs = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
W = 400; H = 225
rows = (len(imgs) + cols - 1) // cols
S = Image.new('RGB', (cols * W, rows * (H + 22)), (30, 30, 30)); d = ImageDraw.Draw(S)
try: fnt = ImageFont.truetype('arial.ttf', 16)
except: fnt = ImageFont.load_default()
for i, f in enumerate(imgs):
    im = Image.open(f).convert('RGB'); im.thumbnail((W, H))
    x, y = (i % cols) * W, (i // cols) * (H + 22)
    S.paste(im, (x, y + 22)); lab = '/'.join(f.replace(chr(92), '/').split('/')[-3:]).replace('/anc/', '/')
    d.text((x + 4, y + 3), lab, fill=(255, 220, 60), font=fnt)
S.save(out, quality=82)
print(out, len(imgs))
