import sys, json, os
from PIL import Image, ImageDraw
S = sys.argv[1]; V = "D:/Proyectos/video2-wt/faperejil/vlog/faperejil/"
plan = json.load(open(V + f"plan_{S}.json", encoding="utf-8"))
ids = [a["id"] for a in plan["anchors"]]
w, h, cols = 384, 216, 6
rows = (len(ids) + 1 + cols - 1) // cols
im = Image.new("RGB", (w * cols, h * rows), "white"); d = ImageDraw.Draw(im)
face = Image.open(plan["face"]).convert("RGB"); face.thumbnail((w, h)); im.paste(face, (0, 0)); d.text((5, 5), "FACE", fill="red")
for k, i in enumerate(ids, 1):
    p = plan["dir"] + "/anc/" + i + ".png"
    if not os.path.exists(p): continue
    t = Image.open(p).convert("RGB").resize((w, h)); x, y = (k % cols) * w, (k // cols) * h
    im.paste(t, (x, y)); d.rectangle((x, y, x + 40, y + 16), fill="black"); d.text((x + 3, y + 3), i, fill="yellow")
out = f"D:/rtmp/fp_hoja_{S}.jpg"; im.save(out, quality=85); print(out)
