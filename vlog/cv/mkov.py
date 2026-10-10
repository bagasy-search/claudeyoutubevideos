# Componentes ENCIMA del VLOG Vaquero (receta furatones5): la lista vive en vlog/<slug>/ov_list.py (OV = [(componente, t, dur, props)],
# t con at("frase") = tiempo de las palabras del máster mapeado al recorte). Escribe src/<slug>/ov.json + src/<slug>/total.ts y corta
# las camas (bed_<n>.mp4 = el propio vlog en ese momento, mudo) en public/vid/<slug>/.
#   SLUG=x python vlog/cv/mkov.py
import json, re, unicodedata, sys, os, subprocess
S = os.environ["SLUG"]; R = f"D:/Proyectos/video2-wt/{os.environ.get('WT', S)}/"; D = R + f"vlog/{S}/"
sys.path.insert(0, R + "vlog/cv"); from recorte import mapear
WM = json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
def at(frase, end=False):
    q = [nw(x) for x in frase.split()]
    for i in range(len(W) - len(q) + 1):
        if W[i:i + len(q)] == q: return mapear(WM[i + len(q) - 1]["e"] if end else WM[i]["s"])
    raise SystemExit("no encuentro: " + frase)
NOBED = {"ClChip"}
ns = {"at": at, "I": f"img/{S}/"}; exec(open(D + "ov_list.py", encoding="utf8").read(), ns); OV = ns["OV"]
VLOG = R + f"public/vid/{S}/vlog.mp4"
nf = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", VLOG], capture_output=True, text=True).stdout)
out = []
for n, (c, s, d, p) in enumerate(OV):
    s = max(0, s - 0.15); fr, nfr = round(s * 30), round(d * 30)
    if c not in NOBED and "bed" not in p:
        b = R + f"public/vid/{S}/bed_{n}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{fr / 30:.4f}", "-i", VLOG, "-frames:v", str(nfr + 4), "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", b], check=True)
        p = {**p, "bed": f"vid/{S}/bed_{n}.mp4#{nfr + 4}"}
    out.append({"c": c, "from": fr, "dur": nfr, "props": p, "t": round(s, 2)})
keep = []  # un chip que pisa a otro componente se cae (LIMPIO gana a denso); otros solapes se avisan
for o in out:
    if keep and keep[-1]["from"] + keep[-1]["dur"] > o["from"]:
        if o["c"] == "ClChip": print("⚠️ chip sacado (pisa a", keep[-1]["c"] + "):", o["t"], o["props"].get("text")); continue
        print("⚠️ se pisan:", keep[-1]["c"], keep[-1]["t"], "→", o["c"], o["t"])
    keep.append(o)
out = keep
json.dump(out, open(R + f"src/{S}/ov.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
open(R + f"src/{S}/total.ts", "w").write(f"export const TOTAL_FRAMES = {nf};\n")
for o in out: print(o["c"], o["t"], round(o["dur"] / 30, 1))
print(f"MEDIDO ov: {len(out)} componentes · {sum(o['dur'] for o in out) / 30:.0f} s encima · total {nf} cuadros")
