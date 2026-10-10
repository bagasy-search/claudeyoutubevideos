# Componentes ENCIMA del vlog (cccostillas): tiempo = la frase del máster (wordms) re-mapeada por el recorte de pausas. Props en src/cccostillas/comps.ts
# (las lee por node). → src/cccostillas/ov.json [{c, from, dur, props, t}] + camas vid/cccostillas/bed_<n>.mp4 (el propio vlog en ese momento).
import json, re, unicodedata, sys, subprocess, os
R = "D:/Proyectos/video2-wt/ccfrijoles/"; sys.path.insert(0, R + "vlog/cccostillas"); from recorte import mapear
WM = json.load(open(R + "_v3/cccostillas_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
def at(frase, end=False, raw=False):
    q = [nw(x) for x in frase.split()]
    for i in range(len(W) - len(q) + 1):
        if W[i:i + len(q)] == q: t = WM[i + len(q) - 1]["e"] if end else WM[i]["s"]; return t if raw else mapear(t)
    raise SystemExit("no encuentro: " + frase)
_js = re.sub(r"export const COMPS: Record<string, \[string, any\]> =", "const COMPS =", open(R + "src/cccostillas/comps.ts", encoding="utf8").read())
COMPS = json.loads(subprocess.run(["node", "-e", _js + ";console.log(JSON.stringify(COMPS))"], capture_output=True, text=True, check=True, encoding="utf8").stdout)
# (id, inicio, duración s, props extra)
m01 = at("Ese tejido no se ablanda con fuego fuerte", raw=True)
OV = [
 ("tejido", at("Ese tejido no se ablanda con fuego fuerte"), at("que se suelte del hueso", end=True) - at("Ese tejido no se ablanda con fuego fuerte") + 1.2,
    {"at": [round(at(x, raw=True) - m01, 2) for x in ("con fuego fuerte", "Se ablanda con calor bajito", "se vuelve gelatina", "que se suelte del hueso")]}),
 ("ficha", at("Esto es para cuatro a seis personas"), 7.0, {}),
 ("remojo", at("y quince minutos de remojo"), 3.6, {}),
 ("doshoras", at("Dos horas. Y a la mitad"), 3.6, {}),
 ("tapa", at("Cada vez que levantas la tapa"), 4.0, {}),
 ("comal", at("Tres a cuatro minutos, nada más"), 3.6, {}),
 ("antes", at("Este es el antes y el después"), at("dos horas y media después, esto", end=True) - at("Este es el antes y el después") + 0.6, {}),
 ("resumen", at("Te lo repito en corto"), 9.5, {}),
 ("costo", at("Ahora la cuenta. Los dos kilos"), at("cinco platos bien servidos", end=True) - at("Ahora la cuenta. Los dos kilos") + 0.8, {}),
 ("pagina", at("en la página treinta y ocho"), 6.0, {}),
 ("qr", at("El enlace está en la descripción"), 7.0, {}),
 ("proximo", at("Y la semana que viene, algo que todo el mundo"), 5.0, {}),
]
OV.sort(key=lambda o: o[1])
VL = R + "public/vid/cccostillas/vlog.mp4"; os.makedirs(R + "public/vid/cccostillas", exist_ok=True)
out = []
for n, (k, s, d, extra) in enumerate(OV):
    c, p = COMPS[k]; s = max(0, s - 0.15); p = {**p, **extra}
    if c != "ClChip" and k not in ("tejido", "antes"):  # cama = el propio vlog en ese momento (tejido/antes ya traen su foto)
        bf = f"vid/cccostillas/bed_{n}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", VL, "-t", f"{d + 0.3:.3f}", "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", R + "public/" + bf], check=True)
        p["bed"] = f"{bf}#{round(d * 30) + 4}"
    out.append({"c": c, "k": k, "from": round(s * 30), "dur": round(d * 30), "props": p, "t": round(s, 2)})
for a, b in zip(out, out[1:]):
    if a["from"] + a["dur"] > b["from"] - 6:   # se pisan: el primero termina 0,2 s antes del siguiente
        print("recorto", a["k"], a["dur"], "→", b["from"] - 6 - a["from"]); a["dur"] = b["from"] - 6 - a["from"]
json.dump(out, open(R + "src/cccostillas/ov.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for o in out: print(f'{o["k"]:<9} {o["c"]:<14} {o["t"]:>8.2f}  {o["dur"] / 30:5.1f} s')
