# vlog/beforeus/luma_gate.py <slug> [piso=24] — compuerta de luminancia sobre TODO clip candidato del plan
# (agnes en public/broll/<slug> + metraje real de D:/rtmp/<slug>/footage). Mide YAVG cuadro a cuadro (stderr de
# ffmpeg) y marca el clip si la RACHA más larga bajo el piso dura >=0,4 s. Salida: _v3/<slug>_oscuros.json
# (nombres que plan.mjs descarta: "<nombre>.mp4" para agnes y "r_<archivo>" para metraje). exit 2 si midió 0.
import json, os, re, subprocess, sys, glob
from concurrent.futures import ThreadPoolExecutor
SLUG = sys.argv[1]; PISO = float(sys.argv[2]) if len(sys.argv) > 2 else 24
REPO = f"D:/Proyectos/video2-wt/{SLUG}/"
files = [(f, os.path.basename(f)) for f in glob.glob(REPO + f"public/broll/{SLUG}/*.mp4")]
cat = f"D:/rtmp/{SLUG}/footage/catalog.json"
if os.path.exists(cat):
    for c in json.load(open(cat, encoding="utf8")):
        if c["type"] == "video" and os.path.exists(c["file"]): files.append((c["file"], "r_" + re.sub(r"[^A-Za-z0-9._-]", "", os.path.basename(c["file"]))))
def run(t):
    f, name = t
    r = subprocess.run(["ffmpeg", "-v", "info", "-i", f, "-an", "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], capture_output=True, text=True)
    ys = [float(x) for x in re.findall(r"YAVG=([0-9.]+)", r.stderr)]
    best = cur = 0
    for y in ys:
        cur = cur + 1 if y < PISO else 0; best = max(best, cur)
    return name, len(ys), best / 30.0
with ThreadPoolExecutor(6) as ex: res = list(ex.map(run, files))
measured = [r for r in res if r[1] > 0]
bad = [n for n, k, run_s in measured if run_s >= 0.4]
json.dump(bad, open(REPO + f"_v3/{SLUG}_oscuros.json", "w"))
print(f"MEDIDO: {len(measured)}/{len(files)} clips · oscuros (racha>=0,4 s bajo {PISO}): {len(bad)} -> {bad[:20]}")
sys.exit(2 if not measured or len(measured) < len(files) * 0.9 else 0)
