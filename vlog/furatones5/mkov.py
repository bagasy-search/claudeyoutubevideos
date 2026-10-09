# Componentes ENCIMA del vlog (furatones5): tiempos sacados de las palabras del máster (= tiempos del video: armado trunc sin agregados).
# → src/furatones5/ov.json [{c, from, dur, props}] (cuadros a 30 fps). bed = el propio vlog en ese momento (vid/furatones5/bed_<n>.mp4).
import json, re, unicodedata
R = "D:/Proyectos/video2-wt/furatones5/"; WM = json.load(open(R + "_v3/furatones5_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
def at(frase, end=False):
    q = [nw(x) for x in frase.split()]
    for i in range(len(W) - len(q) + 1):
        if W[i:i + len(q)] == q: return WM[i + len(q) - 1]["e"] if end else WM[i]["s"]
    raise SystemExit("no encuentro: " + frase)
I = "img/furatones5/"
OV = [
 ("ClCasa5", at("Hoy revisamos los cinco lugares") , 4.2, {"from": 0, "to": 0, "note": "si entra la moneda, entra el ratón"}),
 ("ClVideoRef", at("La semana pasada, en esta misma casa"), 5.5, {"thumb": I + "th_fucasero.jpg", "title": "Las bolitas caseras para cucarachas", "tag": "VIDEO ANTERIOR"}),
 ("ClChip", at("Si entra la moneda, entra el ratón. Jorge"[:-6]) , 3.6, {"text": "Si entra la moneda, entra el ratón", "corner": "tl"}),
 ("ClBookPage", at("Las medidas exactas están en la página quince"), 7.0, {"page": I + "page15.jpg", "pageNo": 15, "stamp": "Las medidas, en la página"}),
 ("ClCasa5", at("Y ahora sí. Lugar número cinco"), 4.4, {"from": 3, "to": 4, "focus": 5, "title": "EL QUINTO LUGAR", "note": "el que nadie revisa"}),
 ("ClCasa5", at("Cinco lugares, una tarde"), 3.6, {"from": 4, "to": 5, "note": "cinco lugares, una tarde"}),
 ("ClQRCard", at("Apunta el celular a este código"), 6.0, {"qr": I + "qr.jpg", "cover": I + "gift_cover.jpg", "text": "las 3 pruebas, gratis", "kicker": "REGALO · ANTES DE FUMIGAR"}),
 ("ClQRCard", at("en esa misma página está el Manual"), 8.5, {"qr": I + "qr.jpg", "cover": I + "book_cover.jpg", "text": "66 arreglos · garantía 7 días", "kicker": "EL MANUAL · US$27"}),
 ("ClVideoRef", at("La semana que viene te muestro cómo sacarlas"), 5.0, {"thumb": I + "th_fumoscas.jpg", "title": "Las moscas de la cocina, sin aerosol", "next": True}),
]
out = []
for n, (c, s, d, p) in enumerate(OV):
    s = max(0, s - 0.15)
    if c != "ClChip": p = {**p, "bed": f"vid/furatones5/bed_{n}.mp4#{round(d * 30) + 4}"}
    out.append({"c": c, "from": round(s * 30), "dur": round(d * 30), "props": p, "t": round(s, 2)})
json.dump(out, open(R + "src/furatones5/ov.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for o in out: print(o["c"], o["t"], o["dur"] / 30)
