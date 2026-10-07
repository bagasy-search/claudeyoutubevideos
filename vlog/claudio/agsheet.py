# Hoja de revisión A OJO de los clips agnes de un slug (3 cuadros por clip: 0,2 · 2,0 · 3,8 s) → _v3/<slug>_agnes.jpg
# SLUG=x python vlog/claudio/agsheet.py
import subprocess, glob, os
from PIL import Image, ImageDraw
S = os.environ["SLUG"]
fs = sorted(glob.glob(f"public/vid/{S}/*.mp4")) + sorted(glob.glob(f"public/broll/{S}/*.mp4"))
rows = []
for f in fs:
    fr = []
    for t in (0.2, 2.0, 3.8):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f, "-frames:v", "1", "-vf", "scale=320:-1", "_v3/_t.jpg"])
        fr.append(Image.open("_v3/_t.jpg").copy())
    rows.append((os.path.basename(f), fr))
W, H = 960, 180
c = Image.new("RGB", (W * 2, H * max(1, (len(rows) + 1) // 2)), "white"); d = ImageDraw.Draw(c)
for i, (n, fr) in enumerate(rows):
    x, y = (i % 2) * W, (i // 2) * H
    for k, im in enumerate(fr): c.paste(im.resize((320, 180)), (x + k * 320, y))
    d.text((x + 4, y + 4), n, fill="yellow")
c.save(f"_v3/{S}_agnes.jpg", quality=85)
print(len(rows), "clips ->", f"_v3/{S}_agnes.jpg")
