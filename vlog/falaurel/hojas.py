# hoja multi-escena: una fila por escena (anclas existentes), para aprobar prefijos. python hojas.py S1 S2 ... [--from S1:K5 ...]
import sys, json, os
from PIL import Image, ImageDraw
args = sys.argv[1:]; V = "D:/Proyectos/video2-wt/falaurel/vlog/falaurel/"
frm = dict(a.split(":") for a in args if ":" in a); scenes = [a for a in args if ":" not in a]
w, h, cols = 256, 144, 12
rows = []
for S in scenes:
    p = json.load(open(V + f"plan_{S}.json", encoding="utf-8"))
    ids = [a["id"] for a in p["anchors"] if os.path.exists(p["dir"] + "/anc/" + a["id"] + ".png")]
    k0 = int(frm.get(S, "K0")[1:]); ids = [i for i in ids if int(i[1:]) >= k0]
    for i in range(0, len(ids), cols): rows.append((S, ids[i:i + cols], p["dir"]))
im = Image.new("RGB", (w * cols + 40, h * len(rows)), "white"); d = ImageDraw.Draw(im)
for r, (S, ids, D) in enumerate(rows):
    d.text((3, r * h + 60), S, fill="red")
    for c, i in enumerate(ids):
        t = Image.open(D + "/anc/" + i + ".png").convert("RGB").resize((w, h)); x, y = 40 + c * w, r * h
        im.paste(t, (x, y)); d.rectangle((x, y, x + 34, y + 14), fill="black"); d.text((x + 2, y + 2), i, fill="yellow")
out = "D:/rtmp/fl_hojas.jpg"; im.save(out, quality=78); print(out, len(rows), "filas")
