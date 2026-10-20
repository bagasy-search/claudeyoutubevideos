# doc_planhoja.py — hojas de control del plan literal: miniatura de cada plano + lo que dice la voz en ese momento.
# Uso: python -I scripts/doc_planhoja.py <plan.json> <frases.json> <raiz_lit> <dir_salida> [por_hoja=40]
import json, sys, os, textwrap
from PIL import Image, ImageDraw, ImageFont
P = json.load(open(sys.argv[1], encoding='utf8')); F = json.load(open(sys.argv[2], encoding='utf8'))
R, OUT = sys.argv[3], sys.argv[4]; N = int(sys.argv[5]) if len(sys.argv) > 5 else 40
os.makedirs(OUT, exist_ok=True)
fn = ImageFont.truetype('arial.ttf', 15); fb = ImageFont.truetype('arialbd.ttf', 15)
sh = [i for p in P['portals'] for i in p['items']]
W, H, C = 300, 169, 5
def dicho(a, b): return ' '.join(f['txt'] for f in F if f['b'] > a + 0.2 and f['a'] < b - 0.2)
for h in range(0, len(sh), N):
    g = sh[h:h + N]; rows = (len(g) + C - 1) // C
    im = Image.new('RGB', (C * (W + 8), rows * (H + 104)), (20, 20, 20)); d = ImageDraw.Draw(im)
    for j, it in enumerate(g):
        x, y = (j % C) * (W + 8), (j // C) * (H + 104)
        src = it.get('src') or f"frames/{it['k'] if it['k'] != '-' else it['vid'].rsplit('_', 1)[0]}/{it['vid']}/{int(it['t'] / 3):05d}.jpg"
        try:
            t = Image.open(os.path.join(R, src)).convert('RGB'); t.thumbnail((W, H)); im.paste(t, (x + (W - t.width) // 2, y))
        except Exception: d.rectangle([x, y, x + W, y + H], outline=(200, 0, 0))
        tag = f"#{h + j} {it['a']:.1f}s {it['b'] - it['a']:.1f}s {'VID' if 'vid' in it else 'FOTO'} f{it['fila']}"
        d.text((x + 2, y + H + 2), tag, font=fb, fill=(255, 210, 80))
        for k, l in enumerate(textwrap.wrap(dicho(it['a'], it['b']), 38)[:5]): d.text((x + 2, y + H + 20 + k * 16), l, font=fn, fill=(230, 230, 230))
    im.save(os.path.join(OUT, f"plan_{h // N:02d}.jpg"), quality=82)
print('hojas', (len(sh) + N - 1) // N)
