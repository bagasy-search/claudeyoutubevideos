import sys, json, os
from PIL import Image, ImageDraw
S = sys.argv[1]; V = "D:/Proyectos/video2-wt/faoliva/vlog/faoliva/"
marks = json.load(open(V + f"ancheck_{S}.json", encoding="utf-8")) if os.path.exists(V + f"ancheck_{S}.json") else {}
plan = json.load(open(V + f"plan_{S}.json", encoding="utf-8"))
ids = [a["id"] for a in plan["anchors"]]
w, h, cols = 320, 180, 7
rows = (len(ids) + 1 + cols - 1) // cols
im = Image.new("RGB", (w * cols, h * rows), "white"); d = ImageDraw.Draw(im)
face = Image.open(plan["face"]).convert("RGB"); face.thumbnail((w, h)); im.paste(face, (0, 0)); d.text((5, 5), "FACE", fill="red")
for k, i in enumerate(ids, 1):
    p = plan["dir"] + "/anc/" + i + ".png"
    if not os.path.exists(p): continue
    t = Image.open(p).convert("RGB").resize((w, h)); x, y = (k % cols) * w, (k // cols) * h
    im.paste(t, (x, y)); m = marks.get(i)
    bad = m and (m.get("bad"))
    d.rectangle((x, y, x + 44, y + 16), fill="red" if bad else "black"); d.text((x + 3, y + 3), i, fill="yellow")
    if bad: d.rectangle((x, y, x + w - 1, y + h - 1), outline="red", width=4)
out = f"D:/rtmp/fo_hoja_{S}.jpg"; im.save(out, quality=82); print(out)
