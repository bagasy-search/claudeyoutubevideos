# Componentes ENCIMA del vlog (ccfrijoles): tiempo = la frase del máster (wordms) re-mapeada por el recorte de pausas. Props en src/ccfrijoles/comps.ts
# (las lee por node). → src/ccfrijoles/ov.json [{c, from, dur, props, t}] + camas vid/ccfrijoles/bed_<n>.mp4 (el propio vlog en ese momento).
import json, re, unicodedata, sys, subprocess, os
R = "D:/Proyectos/video2-wt/ccfrijoles/"; sys.path.insert(0, R + "vlog/ccfrijoles"); from recorte import mapear
WM = json.load(open(R + "_v3/ccfrijoles_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
def at(frase, end=False, raw=False):
    q = [nw(x) for x in frase.split()]
    for i in range(len(W) - len(q) + 1):
        if W[i:i + len(q)] == q: t = WM[i + len(q) - 1]["e"] if end else WM[i]["s"]; return t if raw else mapear(t)
    raise SystemExit("no encuentro: " + frase)
_js = re.sub(r"export const COMPS: Record<string, \[string, any\]> =", "const COMPS =", open(R + "src/ccfrijoles/comps.ts", encoding="utf8").read())
COMPS = json.loads(subprocess.run(["node", "-e", _js + ";console.log(JSON.stringify(COMPS))"], capture_output=True, text=True, check=True, encoding="utf8").stdout)
# (id, inicio, duración s, props extra)
m01 = at("Mira este corte de la olla", raw=True)
OV = [
 ("corte", at("Mira este corte de la olla"), at("se estira lisita", end=True) - at("Mira este corte de la olla") + 1.2,
    {"at": [round(at(x, raw=True) - m01, 2) for x in ("Al principio el frijol", "En la hora de reposo", "y la cáscara se estira")]}),
 ("ficha", at("Ahora sí, la olla. Esto es para ocho"), 6.5, {}),
 ("dosmin", at("Dos minutos. Ahí tienes el temporizador"), 3.0, {}),
 ("unahora", at("Y me olvido de ella una hora entera"), 4.0, {}),
 ("fuego", at("Vuelvo a prender, pero ahora a fuego bajo"), 3.6, {}),
 ("cinco", at("No pruebes un frijol. Prueba cinco"), 3.6, {}),
 ("antes", at("Este es el antes y el después"), at("la noche anterior", end=True) - at("Este es el antes y el después") + 0.5, {}),
 ("resumen", at("Te lo repito en corto"), 9.5, {}),
 ("refritos", at("Cuatro tazas de frijoles cocidos"), 6.0, {}),
 ("costo", at("Son como cuatro dólares con quince"), at("para ser exactos", end=True) - at("Son como cuatro dólares con quince") + 0.8, {}),
 ("pagina", at("Estos frijoles están en la página doce"), 6.0, {}),
 ("qr", at("El enlace está en la descripción"), 7.0, {}),
 ("proximo", at("Y la semana que viene, esta misma olla de barro"), 5.0, {}),
]
OV.sort(key=lambda o: o[1])
VL = R + "public/vid/ccfrijoles/vlog.mp4"; os.makedirs(R + "public/vid/ccfrijoles", exist_ok=True)
out = []
for n, (k, s, d, extra) in enumerate(OV):
    c, p = COMPS[k]; s = max(0, s - 0.15); p = {**p, **extra}
    if c != "ClChip" and k not in ("corte", "antes"):  # cama = el propio vlog en ese momento (corte/antes ya traen su foto)
        bf = f"vid/ccfrijoles/bed_{n}.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-i", VL, "-t", f"{d + 0.3:.3f}", "-an", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-pix_fmt", "yuv420p", R + "public/" + bf], check=True)
        p["bed"] = f"{bf}#{round(d * 30) + 4}"
    out.append({"c": c, "k": k, "from": round(s * 30), "dur": round(d * 30), "props": p, "t": round(s, 2)})
for a, b in zip(out, out[1:]):
    if a["from"] + a["dur"] > b["from"] - 6:   # se pisan: el primero termina 0,2 s antes del siguiente
        print("recorto", a["k"], a["dur"], "→", b["from"] - 6 - a["from"]); a["dur"] = b["from"] - 6 - a["from"]
json.dump(out, open(R + "src/ccfrijoles/ov.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for o in out: print(f'{o["k"]:<9} {o["c"]:<14} {o["t"]:>8.2f}  {o["dur"] / 30:5.1f} s')
