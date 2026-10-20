# doc_rankhoja.py — hojas de contacto de rank.json (doc_cliprank): una fila por concepto con sus candidatos.
# Uso: python -I scripts/doc_rankhoja.py <raiz> [clave]   → <raiz>/hojas/<clave>_NN.jpg
import json, os, sys
from PIL import Image, ImageDraw
R = sys.argv[1]; K = sys.argv[2] if len(sys.argv) > 2 else None
rk = [r for r in json.load(open(os.path.join(R, 'rank.json'), encoding='utf8')) if not K or r['clave'] == K]
os.makedirs(os.path.join(R, 'hojas'), exist_ok=True)
T, POR = 200, 8
for h in range(0, len(rk), POR):
    filas = rk[h:h + POR]
    im = Image.new('RGB', (40 + 6 * (T + 6), len(filas) * (T + 34)), (20, 20, 20)); d = ImageDraw.Draw(im)
    for y, r in enumerate(filas):
        Y = y * (T + 34)
        d.text((6, Y + 4), f"[{r['fila']}] {r['desde']}-{r['hasta']} {r['concepto'][:110]}", fill=(255, 220, 90))
        for x, c in enumerate(r['cands'][:6]):
            try: th = Image.open(os.path.join(R, c['p'])).convert('RGB'); th.thumbnail((T, T))
            except Exception: continue
            X = 40 + x * (T + 6); im.paste(th, (X, Y + 20))
            d.text((X + 2, Y + 22), f"{x} {c['vid'][-14:]} {c['t'] if c['t'] is not None else ''} {c['s']}", fill=(0, 255, 0))
    p = os.path.join(R, 'hojas', f"{K or 'todo'}_{h // POR:02d}.jpg"); im.save(p, quality=82); print(p)
