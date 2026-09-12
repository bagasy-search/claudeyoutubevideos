# -*- coding: utf-8 -*-
"""Hoja de contactos: junta N imagenes en una grilla con el nombre debajo, para
revisar una sola imagen en vez de N (ahorra muchisimo contexto).
   python scripts/contact_sheet.py <salida.jpg> <img1> <img2> ...
"""
import sys
from PIL import Image, ImageDraw

OUT = sys.argv[1]
FILES = sys.argv[2:]
CW, CH, PAD, LAB = 460, 300, 10, 22
cols = 5 if len(FILES) > 6 else 3
rows = (len(FILES) + cols - 1) // cols

sheet = Image.new('RGB', (cols * (CW + PAD) + PAD, rows * (CH + LAB + PAD) + PAD), (24, 24, 26))
d = ImageDraw.Draw(sheet)
for i, f in enumerate(FILES):
    try:
        im = Image.open(f).convert('RGB')
    except Exception as e:
        print('skip', f, e)
        continue
    im.thumbnail((CW, CH))
    x = PAD + (i % cols) * (CW + PAD)
    y = PAD + (i // cols) * (CH + LAB + PAD)
    sheet.paste(im, (x + (CW - im.width) // 2, y))
    name = f.replace('\\', '/').split('/')[-1].rsplit('.', 1)[0]
    d.text((x + 2, y + CH + 4), name[-42:], fill=(200, 200, 205))

sheet.save(OUT, quality=88)
print('%s  %dx%d  %d imagenes' % (OUT, sheet.width, sheet.height, len(FILES)))
