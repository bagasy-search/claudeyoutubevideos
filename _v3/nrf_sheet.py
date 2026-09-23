# nrf_sheet.py — hoja de contactos del stock: 2 cuadros por clip (25% y 70%) con nombre + consulta + la FRASE.
# Sale en D:/rtmp/nrf_work/cs/sheet_N.jpg (6 clips por fila, 5 filas). Se MIRA (no hay juez numérico que vea off-topic).
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
D = "public/broll/nrfloaters"; OUT = "D:/rtmp/nrf_work/cs"; os.makedirs(OUT, exist_ok=True)
L = json.load(open("_v3/nrf_stock.json", encoding="utf-8"))
M = {("s_" + m["id"]): m["snip"] for m in json.load(open("_v3/nrfloaters_moments.json", encoding="utf-8"))}
only = set(sys.argv[1:])
items = [x for x in L if not only or x["name"] in only]
W, H = 300, 169
font = ImageFont.truetype("arial.ttf", 13)
tiles = []
for x in items:
    p = f"{D}/{x['name']}.mp4"
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], text=True))
    t = Image.new("RGB", (W * 2, H + 34), (20, 20, 20))
    for k, f in enumerate((0.25, 0.7)):
        tmp = f"{OUT}/_f.jpg"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{d * f:.2f}", "-i", p, "-frames:v", "1", "-vf", f"scale={W}:{H}", tmp], check=True)
        t.paste(Image.open(tmp), (k * W, 0))
    dr = ImageDraw.Draw(t)
    dr.text((4, H + 2), f"{x['name']} [{x['query']}] {d:.0f}s", fill=(255, 220, 90), font=font)
    dr.text((4, H + 18), (M.get(x["name"], "(2º plano)"))[:80], fill=(220, 220, 220), font=font)
    tiles.append(t)
per = 3 * 6
for s in range(0, len(tiles), per):
    sh = Image.new("RGB", (W * 2 * 3, (H + 34) * 6), (0, 0, 0))
    for i, t in enumerate(tiles[s:s + per]):
        sh.paste(t, ((i % 3) * W * 2, (i // 3) * (H + 34)))
    sh.save(f"{OUT}/sheet_{s // per}.jpg", quality=80)
print(f"hojas: {(len(tiles) + per - 1) // per} · clips medidos {len(tiles)}")
