# mix_fe02.py — voz + foley del MUNDO 3D (cada estación suena a lo que se ve) + wooshes de los vuelos de cámara +
# entradas de piezas + tachas/etiquetas/libro/sobre/faros/lápida + tono de cuarto bajo. Sin música (no hay Chrome).
# Golpe fuerte (swell + boom) SÓLO en las revelaciones de precio; el resto de los sellos van suaves.
# Regla: el mismo archivo no más de 3 veces por minuto (se elige acá y se fija con "var").
# Uso: python mix_fe02.py → D:/rtmp_fe02/fe02_mix.wav + fe02_vozfoley.wav + vlog/fe02/sfx_fe02.json
import json, os, sys, shutil, subprocess, importlib.util, math
W = "D:/wt/fe02/"; R = "D:/rtmp_fe02/"
spec = importlib.util.spec_from_file_location("mezcla", "D:/rtmp/sfxlib/mezcla.py"); M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
mk = M.mk
segs = json.load(open(W + "src/fe02/segs.json", encoding="utf8"))
cams = json.load(open(W + "src/fe02/cams.json", encoding="utf8"))
ov = json.load(open(W + "src/fe02/ov.json", encoding="utf8"))
ev = json.load(open(W + "src/fe02/ev.json", encoding="utf8"))
END = json.load(open(W + "src/fe02/avail.json"))["end"]

# tono de cuarto: un solo colchón en loop de todo el largo (no cuenta para el tope por minuto)
bed = R + "cuarto_bed.wav"
if not os.path.exists(bed):
    src = mk("Cinematic room tone loop")[0]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-stream_loop", "-1", "-i", src, "-t", f"{END + 1:.1f}", "-af", "highpass=f=60,lowpass=f=5000", "-ac", "2", "-ar", "48000", bed], check=True)
M.POOLS.update({
    "cuarto": ([bed], -36),
    "pluma": (mk("Writing with a pen on paper", "Short pencil writing", "Fast signing with a pen", "Pen marker line"), -17),
    "vela": (mk("Fire match lighting", "Lighter wheel spin", "Campfire crackles"), -20),
    "reloj": (mk("Big old clock ticking", "Bedroom ambience with wall clock", "Old clock pendulum ticking"), -26),
    "campana": (mk("Church bell indoor", "Low church bell calling", "Suburb church bell", "Church bells ending", "Melodic church bell"), -24),
    "pajaros": (mk("Morning birds", "Meadow birds isolated", "Birds in the forest", "Birds chirping near the river"), -26),
    "viento": (mk("Abstract wind howl interior", "Cinematic wind swell", "Wind woosh", "Deep cinematic wind hum"), -26),
    "calle": (mk("Urban city sounds and light car traffic", "Passing car and urban ambience"), -27),
    "coche": (mk("Car engine start", "Car ignition", "Car door close", "Car start ignition"), -21),
    "piso": (mk("Creaking old floorboard", "Creaky wooden floorboard", "Creaky wooden scrap"), -23),
    "cajon": (mk("Cabinet door slide", "Cupboard soft sliding door", "Cupboard sliding door", "Cabinet door closing"), -21),
    "puerta": (mk("Creaking door open and close", "Creaky closing wood door", "Creaky door open"), -22),
    "grava": (mk("Crunchy footsteps loop", "Footsteps on stones loop", "Grass step"), -24),
    "swell": (mk("Cinematic suspense swell", "Trailer cinematic suspense swell", "Cinematic wind swell"), -21),
})
# estación → foley de lo que se ve (ambiente largo o acción corta)
AMB = {"cupula": "campana", "ventana": "calle", "patio": "pajaros", "pirul": "viento", "nicho": "viento", "lapida": "viento",
       "capilla": "campana", "flores": "pajaros", "sillas": "piso", "veladoras": "vela", "oficina": "reloj", "escritorio": "reloj",
       "archivero": "cajon", "fotos": "paper", "retrato": "reloj", "cotizacion": "paper", "pluma": "pluma", "veladora": "vela",
       "sobre": "paper", "carpeta": "paper", "corte": "piso", "exhibicion": "piso", "tapa": "wood_hit",
       "bovedas": "metal", "boveda_lujo": "metal", "boveda_llana": "metal", "urnas": "wood_hit", "urna_barro": "wood_hit",
       "urna_marmol": "metal", "cochera": "coche", "carroza": "coche", "faros": "coche"}
for k in ("ataud1", "ataud2", "ataud3"): AMB[k] = "wood_hit"
for k in ("tag1", "tag2", "tag3"): AMB[k] = "cloth"
LARGOS = {"campana", "calle", "pajaros", "viento", "reloj", "vela"}
# revelaciones de precio = golpe fuerte (swell antes + boom); los otros sellos suaves
PRECIO = lambda o: any(ch in (o.get("text") or "") for ch in "$") or (o.get("text") or "") in ("LA MITAD",)

C = []  # (t, pool, gain, opts, porque)
def cue(t, pool, g=None, o=None, why=""): C.append([round(max(0, t), 3), pool, g, dict(o or {}), why])
cue(0, "cuarto", None, {"dur": END, "fade": 2.0, "fadein": 1.0}, "tono de cuarto bajo todo el video")

ult = None
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    prev = segs[i - 1]["k"] if i else None
    # entrada/salida del avatar: transición suave
    if i and (g["k"] == "av") != (prev == "av"):
        cue(g["a"] - 0.12, "swish" if g.get("tr", "cut") != "cut" else "whoosh", -6, {}, f"transición {g.get('tr')} {'al' if g['k'] == 'av' else 'desde el'} avatar")
    if g["k"] == "av": ult = None; continue
    st = g.get("st", "")
    if g.get("fly"):
        dist_big = (b - g["a"]) > 5
        cue(g["a"] - 0.05, "whoosh_big" if dist_big and i % 3 == 0 else "whoosh", -4 if dist_big else -7, {}, f"vuelo de cámara → {st}")
    pool = AMB.get(st)
    if not pool or (pool == ult and pool in LARGOS): ult = pool; continue
    ult = pool
    if pool in LARGOS:
        cue(g["a"], pool, -2 if g["k"] == "bk" else None, {"dur": max(1.0, b - g["a"]), "fade": 0.6, "fadein": 0.35}, f"ambiente de {st}")
    else:
        cue(g["a"] + 0.35, pool, -3 if g["k"] == "bk" else None, {"dur": min(2.5, b - g["a"]), "fade": 0.3}, f"foley de {st}")

for o in ov:
    k, a, txt = o["k"], o["a"], o.get("text") or ""
    if k == "stamp":
        if PRECIO(o):
            cue(a - 1.4, "swell", None, {"dur": 1.5, "fade": 0.2, "fadein": 0.8}, f"subida antes de la revelación {txt}")
            cue(a + 0.04, "boom", -8, {}, f"REVELACIÓN DE PRECIO {txt}"); cue(a + 0.05, "stamp", -2, {}, f"sello {txt}")
        else: cue(a + 0.05, "stamp", -7, {}, f"sello suave {txt}")
    elif k in ("tag", "big"):
        if PRECIO(o):
            cue(a - 1.2, "swell", -2, {"dur": 1.3, "fade": 0.2, "fadein": 0.7}, f"subida antes de {txt}")
            cue(a + 0.03, "boom", -9, {}, f"REVELACIÓN DE PRECIO {txt}")
        cue(a + 0.02, "pop" if k == "tag" else "tick", -6, {}, f"entra {k} {txt}")
    elif k == "cuenta": cue(a, "roll", -6, {}, "cuenta que sube")
    elif k in ("ficha", "refrendo", "quote", "dicho", "mapa", "lista", "lower", "lugar", "cap", "comment"):
        cue(a + 0.03, "paper" if k not in ("chips", "lower", "comment") else "pop", -4 if k != "cap" else -6, {}, f"entra {k}")
    elif k == "chips":
        for j in range(3): cue(a + 0.05 + j * 0.35, "pop", -9, {"pitch": j}, "chip")
    elif k == "etiqueta": cue(a + 0.05, "cloth", -3, {}, "etiqueta 2.5D que gira")
    elif k == "pluma": cue(a + 0.3, "pluma", None, {"dur": 1.6}, "pluma que tacha")
    elif k == "balanza": cue(a + 0.1, "wood_hit", -6, {}, "balanza"); cue(a + 1.2, "metal", -6, {}, "plato de la balanza cae")
    elif k == "sobre": cue(a + 0.1, "paper", -3, {}, "sobre"); cue(a + 0.9, "tear", -5, {}, "se abre el sobre")
    if k == "lista":
        for r in range(4): cue(a + 0.8 + r * 0.5, "tick", -10, {}, "renglón de la lista")

for t in ev["strikes"]: cue(t, "pluma", None, {"dur": 1.2, "fade": 0.2}, "tacha en la cotización 3D")
for t in ev["tags"]: cue(t - 0.1, "cloth", -2, {}, "gira la etiqueta del ataúd"); cue(t + 0.4, "tick", -8, {}, "etiqueta se asienta")
for a, b in ev["book"]: cue(a, "paper", None, {}, "la Carpeta se abre"); cue(a + 0.7, "paper", -3, {}, "hojas"); cue(b - 0.2, "paper", -5, {}, "la Carpeta se cierra")
cue(ev["sobre"], "tear", -4, {}, "se abre el sobre amarillo 3D")
cue(ev["faros"], "coche", -2, {"dur": 3.0}, "se encienden los faros de la carroza"); cue(ev["faros"] + 0.1, "flash", -10, {}, "faros")
cue(ev["lapida"] - 0.3, "swell", -2, {"dur": 1.6, "fade": 0.5, "fadein": 0.6}, "swell suave final en la lápida")

# nivel REAL (dBFS RMS antes del duck; mezcla normaliza cada SFX a -24): efectos entre -28 y -18, golpe sólo en precios
NIVEL = {"cuarto": -40, "campana": -28, "calle": -28, "pajaros": -28, "viento": -28, "reloj": -28, "vela": -27,
         "piso": -26, "cajon": -26, "grava": -26, "cloth": -26, "tick": -27, "pop": -26, "swish": -26, "whoosh": -25,
         "whoosh_big": -22, "paper": -24, "pluma": -23, "wood_hit": -24, "metal": -25, "tear": -23, "coche": -24,
         "roll": -24, "flash": -27, "swell": -24, "stamp": -22, "boom": -18}
for c in C:
    n = NIVEL[c[1]]
    if c[1] == "stamp" and "sello " in c[4] and "suave" not in c[4]: n = -19
    if c[1] == "swell" and "final" in c[4]: n = -26
    c[2] = n + 24 - M.POOLS[c[1]][1]
# tope: el mismo archivo ≤3 veces por cada 60 s (se elige variante y se fija con var)
uso = {}
tabla = []
for c in sorted(C, key=lambda c: c[0]):
    t, pool, gn, o, why = c
    fs, gdef = M.POOLS.get(pool, ([], 0))
    if not fs: tabla.append({"t": t, "pool": pool, "falta": True}); continue
    cand = sorted(range(len(fs)), key=lambda k: (sum(1 for x in uso.get(fs[k], []) if t - x < 60), len(uso.get(fs[k], [])), (k + int(t * 7)) % len(fs)))
    k = cand[0]
    if pool != "cuarto" and sum(1 for x in uso.get(fs[k], []) if t - x < 60) >= 3: continue  # saturado: se saltea
    uso.setdefault(fs[k], []).append(t); o["var"] = k; c[3] = o
    tabla.append({"t": t, "sonido": os.path.basename(fs[k]), "pool": pool, "dB": gdef + (gn or 0) - 24, "por_que": why})
CUES = [tuple(c[:4]) for c in sorted(C, key=lambda c: c[0]) if "var" in c[3]]
json.dump(tabla, open(W + "vlog/fe02/sfx_fe02.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
open(R + "cues_fe02.py", "w", encoding="utf8").write("CUES = " + repr(CUES) + "\n")
peor = max(sum(1 for y in v if 0 <= y - x < 60) for v in uso.values() for x in v if len(v) and v is not uso.get(bed))
print("cues", len(CUES), "· archivos", len(uso), "· máx mismo archivo en 60 s:", peor)
sys.argv = ["mezcla.py", W + "public/fe02cut.wav", R + "cues_fe02.py", R + "fe02_mix.wav", "--dur", str(END)]
M.main()
shutil.copy(R + "fe02_mix.wav", R + "fe02_vozfoley.wav")
