# Componentes ENCIMA del vlog (fumoscasf): tiempos sacados de las palabras del máster (= tiempos del video armado).
# → src/fumoscasf/ov.json [{c, from, dur, props}] (cuadros a 30 fps) + public/vid/fumoscasf/bed_<n>.mp4 (el propio vlog en ese momento).
# ⛔ 9-oct (2ª pasada): NINGÚN componente puede pisar una ventana de avatar (src/fumoscasf/avwin.json). Los 4 nuevos van
# donde el guion explica cada cosa; los 3 que caían dentro de una ventana (ClBookPage, los 2 ClQRCard) se corrieron a la
# frase siguiente con lugar libre. 12 apariciones en total (8 + 4), ninguna dentro de [ms, me] de una ventana.
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
 # ⛔ 9-oct: 5,5 s tapaba los cortes del minuto 1 (el detector bajó de 31 a 29 con la tarjeta encima). La frase
 # "La vimos la semana pasada" dura ~1,7 s: la tarjeta entra y sale DENTRO del mismo tramo de 1,95 s y no come ningún corte.
 ("ClVideoRef", at("La vimos la semana pasada"), 2.0, {"thumb": I + "th_furatones5.jpg", "title": "Los 5 huecos por donde entra el ratón", "tag": "VIDEO ANTERIOR"}),
 # de dónde entra y qué la llama: el olor del bote sale por la puerta y la mosca lo sigue (el mosquitero, en cambio, no la para)
 ("ClFlyDoor", at("Cuando el bote de basura está abierto"), 7.5, {}),
 ("ClFlyCycle", at("Una mosca pone cientos de huevos"), 7.0, {"name": "Mosca"}),
 # el limón con los diez clavos, en el borde de la ventana
 ("ClLemon10", at("Cortas un limón por la mitad"), 10.0, {}),
 # las tres reglas de la cinta + la línea de altura de Bruno (el perro pasa por abajo)
 ("ClTapeHigh", at("Uno: lejos de la comida"), 12.5, {}),
 # ⛔ la página 16 la dice el avatar a cámara: el cuaderno va DESPUÉS de esa ventana, en "cuántos clavos por limón" (474,18)
 ("ClBookPage", at("cuántos clavos por limón"), 5.5, {"page": I + "page16.jpg", "pageNo": 16, "stamp": "Las medidas, en la página"}),
 ("ClDrainFactory", at("con hojas y agua estancada"), 7.0, {"mode": "clean"}),
 # la cocina entera con los cuatro arreglos puestos y las ventanas cerrándose (la casa de los Ramírez, sin ninguna mosca)
 ("ClMoscasMap", at("En la casa de los Ramírez no apareció ninguna"), 11.0, {}),
 ("ClCheck", at("Te dejé las tres pruebas en una hoja gratis"), 9.0, {"title": "ANTES DE FUMIGAR · la revisión de la noche", "items": ["La del bote de basura, por dentro", "La de la luz, una hora después", "La cinta doble faz (no está en ningún video)"]}),
 # ⛔ el QR del regalo: "Apuntas el celular a este código" (690,87) cae dentro de la ventana CTA [694,88-700,42] → entra en "La imprimes y la pegas"
 ("ClQRCard", at("La imprimes y la pegas por dentro del mueble"), 6.5, {"qr": I + "qr.jpg", "cover": I + "gift_cover.jpg", "text": "las 3 pruebas, gratis", "kicker": "REGALO · ANTES DE FUMIGAR"}),
 # ⛔ el Manual: "en esa misma página está el Manual del Fumigador" (697,11) también cae en la ventana CTA → entra en "los sesenta y seis arreglos"
 # (700,49, y nunca antes de 700,62, que es cuando la ventana CTA ya terminó)
 ("ClQRCard", at("los sesenta y seis arreglos de la casa"), 7.0, {"qr": I + "qr.jpg", "cover": I + "book_cover.jpg", "text": "66 arreglos · garantía 7 días", "kicker": "EL MANUAL · US$27"}, 700.62),
 ("ClVideoRef", at("La semana que viene te muestro cómo"), 5.0, {"thumb": I + "th_fumosquito.jpg", "title": "Mosquitos en casa, sin espiral ni aerosol", "tag": "PRÓXIMO VIDEO", "next": True}),
]
out = []
for e in OV:
    c, s, d, p = e[:4]
    s = max(0, s - 0.15)
    if len(e) > 4: s = max(s, e[4])                     # 5º campo opcional: "no antes de" (salir de una ventana de avatar)
    p = {**p, "bed": f"vid/fumoscasf/bed_{len(out)}.mp4#{round(d * 30) + 4}"}
    out.append({"c": c, "from": round(s * 30), "dur": round(d * 30), "props": p, "t": round(s, 2)})
# ⛔ compuerta: ningún componente puede pisar una ventana de avatar (ni al revés)
AV = json.load(open(R + "src/fumoscasf/avwin.json"))
bad = []
for o in out:
    a, b = o["t"], o["t"] + o["dur"] / 30
    for w in AV["win"]:
        if a < w["me"] and b > w["ms"]: bad.append((o["c"], round(a, 2), round(b, 2), w["n"], w["ms"], w["me"]))
for x in bad: print("⛔ PISA VENTANA DE AVATAR:", x)
if bad: sys.exit(2)
print(f"✓ {len(out)} componentes ({100*sum(o['dur'] for o in out)/30/741.9667:.1f} % del video), ninguna de las {len(AV['win'])} ventanas de avatar pisada")
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
