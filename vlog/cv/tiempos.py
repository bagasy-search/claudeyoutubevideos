# Tiempos (ya recortados) del arranque de cada párrafo del guion → para armar capítulos.  SLUG=x python vlog/cv/tiempos.py
import sys, json, os
S = os.environ["SLUG"]; R = f"D:/Proyectos/video2-wt/{S}/"; sys.path.insert(0, R + "vlog/cv"); os.chdir(R)
from recorte import mapear
W = json.load(open(f"_v3/{S}_wordms.json", encoding="utf8")); i = 0
for p in open(f"guiones/{S}.txt", encoding="utf8").read().split("\n"):
    n = len(p.split())
    if not n: continue
    t = mapear(W[i]["s"]); print(f"{int(t // 60)}:{int(t % 60):02d}", p[:85]); i += n
