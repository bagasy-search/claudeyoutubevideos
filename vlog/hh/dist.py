# Reparte imágenes "<slug>__<nombre>.png" de una carpeta a public/img/<slug>/<nombre>.jpg (q90, 1920x1080). python vlog/hh/dist.py <carpeta>
import glob, os, sys
from PIL import Image
R = "D:/Proyectos/video2-wt/lhh/public/"
n = 0
for f in glob.glob(os.path.join(sys.argv[1], "*__*.png")):
    s, name = os.path.basename(f)[:-4].split("__", 1)
    out = R + f"img/{s}/{name}.jpg"
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(f): continue
    os.makedirs(R + f"img/{s}", exist_ok=True)
    Image.open(f).convert("RGB").resize((1920, 1080), Image.LANCZOS).save(out, quality=90); n += 1
print("repartidas", n)
