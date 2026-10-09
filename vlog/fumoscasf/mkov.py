# Componentes ENCIMA del vlog (fumoscasf): tiempos sacados de las palabras del máster (= tiempos del video armado).
# → src/fumoscasf/ov.json [{c, from, dur, props}] (cuadros a 30 fps) + public/vid/fumoscasf/bed_<n>.mp4 (el propio vlog en ese momento).
import json, re, unicodedata, subprocess, os, sys
R = "D:/Proyectos/video2-wt/fumoscasf/"; D = R + "vlog/fumoscasf/"
C = json.load(open(D + "cortes.json"))
def mapear(t):
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
WM = json.load(open(R + "_v3/fumoscasf_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
def at(frase, end=False):
    q = [nw(x) for x in frase.split()]
    for i in range(len(W) - len(q) + 1):
        if W[i:i + len(q)] == q: return mapear(WM[i + len(q) - 1]["e"] if end else WM[i]["s"])
    raise SystemExit("⛔ no encuentro: " + frase)
I = "img/fumoscasf/"
OV = [
 ("ClVideoRef", at("La vimos la semana pasada"), 5.5, {"thumb": I + "th_furatones5.jpg", "title": "Los 5 huecos por donde entra el ratón", "tag": "VIDEO ANTERIOR"}),
 ("ClFlyCycle", at("Una mosca pone cientos de huevos"), 7.0, {}),
 ("ClBookPage", at("Las medidas exactas están en la página dieciséis"), 7.5, {"page": I + "page16.jpg", "pageNo": 16, "stamp": "Las medidas, en la página"}),
 ("ClDrainFactory", at("con hojas y agua estancada"), 7.0, {"mode": "clean"}),
 ("ClCheck", at("Te dejé las tres pruebas en una hoja gratis"), 9.0, {"title": "ANTES DE FUMIGAR · la revisión de la noche", "items": ["La del bote de basura, por dentro", "La de la luz, una hora después", "La cinta doble faz (no está en ningún video)"]}),
 ("ClQRCard", at("Apuntas el celular a este código"), 6.0, {"qr": I + "qr.jpg", "cover": I + "gift_cover.jpg", "text": "las 3 pruebas, gratis", "kicker": "REGALO · ANTES DE FUMIGAR"}),
 ("ClQRCard", at("en esa misma página está el Manual del Fumigador"), 8.5, {"qr": I + "qr.jpg", "cover": I + "book_cover.jpg", "text": "66 arreglos · garantía 7 días", "kicker": "EL MANUAL · US$27"}),
 ("ClVideoRef", at("La semana que viene te muestro cómo"), 5.0, {"thumb": I + "th_fumosquito.jpg", "title": "Mosquitos en casa, sin espiral ni aerosol", "tag": "PRÓXIMO VIDEO", "next": True}),
]
out = []
for n, (c, s, d, p) in enumerate(OV):
    s = max(0, s - 0.15)
    p = {**p, "bed": f"vid/fumoscasf/bed_{n}.mp4#{round(d * 30) + 4}"}
    out.append({"c": c, "from": round(s * 30), "dur": round(d * 30), "props": p, "t": round(s, 2)})
json.dump(out, open(R + "src/fumoscasf/ov.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for o in out: print(o["c"], o["t"], o["dur"] / 30)
# beds: fragmento del vlog armado, exactamente dur+4 cuadros desde el inicio del componente
vl = R + "public/vid/fumoscasf/vlog.mp4"
if os.path.exists(vl):
    os.makedirs(R + "public/vid/fumoscasf", exist_ok=True)
    for n, o in enumerate(out):
        nf = o["dur"] + 4
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f'{o["t"]:.3f}', "-i", vl, "-frames:v", str(nf), "-an",
                        "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-bf", "0", "-pix_fmt", "yuv420p",
                        f'{R}public/vid/fumoscasf/bed_{n}.mp4'], check=True)
        print("bed", n, nf)
else:
    print("⚠️ sin vlog.mp4: los beds se generan después de mkvlog.py --armar")
