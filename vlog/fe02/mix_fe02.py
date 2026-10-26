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

# v2 (26-oct, «hay sonidos muy malos / tapan la voz»): FUERA espadazos de transición, pops/chips/ticks, motor de auto,
# golpes de metal/madera y tic-tac de reloj. Queda: papel, pluma, tela, ambientes bajos, whoosh suave sólo en vuelos largos
# (≥1 cada 15 s), golpe sólo en precios. Todo 5-6 dB más bajo y duck de 12 dB bajo la voz.
for k in ("bovedas", "boveda_lujo", "boveda_llana", "urnas", "urna_barro", "urna_marmol", "cochera", "carroza", "faros",
          "tapa", "ataud1", "ataud2", "ataud3", "oficina", "escritorio", "retrato", "sillas", "corte", "exhibicion"): AMB.pop(k, None)
ult = None; ult_wh = -99
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    if g["k"] == "av": ult = None; continue
    st = g.get("st", "")
    if g.get("fly") and (b - g["a"]) > 5 and g["a"] - ult_wh >= 15:
        ult_wh = g["a"]; cue(g["a"] - 0.05, "whoosh", None, {}, f"vuelo largo de cámara → {st}")
    pool = AMB.get(st)
    if not pool or (pool == ult and pool in LARGOS): ult = pool; continue
    ult = pool
    if pool in LARGOS:
        cue(g["a"], pool, None, {"dur": max(1.0, b - g["a"]), "fade": 0.8, "fadein": 0.6}, f"ambiente de {st}")
    else:
        cue(g["a"] + 0.35, pool, None, {"dur": min(2.0, b - g["a"]), "fade": 0.3}, f"foley de {st}")

for o in ov:
    k, a, txt = o["k"], o["a"], o.get("text") or ""
    if k == "stamp":
        if PRECIO(o):
            cue(a - 1.4, "swell", None, {"dur": 1.5, "fade": 0.2, "fadein": 0.8}, f"subida antes de la revelación {txt}")
            cue(a + 0.04, "boom", None, {}, f"REVELACIÓN DE PRECIO {txt}"); cue(a + 0.05, "stamp", None, {}, f"sello {txt}")
        else: cue(a + 0.05, "paper", None, {}, f"sello suave {txt}")
    elif k in ("tag", "big") and PRECIO(o):
        cue(a - 1.2, "swell", None, {"dur": 1.3, "fade": 0.2, "fadein": 0.7}, f"subida antes de {txt}")
        cue(a + 0.03, "boom", None, {}, f"REVELACIÓN DE PRECIO {txt}")
    elif k in ("ficha", "refrendo", "mapa", "lista"): cue(a + 0.03, "paper", None, {}, f"entra {k}")
    elif k == "etiqueta": cue(a + 0.05, "cloth", None, {}, "etiqueta 2.5D que gira")
    elif k == "pluma": cue(a + 0.3, "pluma", None, {"dur": 1.6}, "pluma que tacha")
    elif k == "sobre": cue(a + 0.1, "paper", None, {}, "sobre"); cue(a + 0.9, "tear", None, {}, "se abre el sobre")

for t in ev["strikes"]: cue(t, "pluma", None, {"dur": 1.2, "fade": 0.2}, "tacha en la cotización 3D")
for t in ev["tags"]: cue(t - 0.1, "cloth", None, {}, "gira la etiqueta del ataúd")
for a, b in ev["book"]: cue(a, "paper", None, {}, "la Carpeta se abre"); cue(b - 0.2, "paper", None, {}, "la Carpeta se cierra")
cue(ev["sobre"], "tear", None, {}, "se abre el sobre amarillo 3D")
cue(ev["lapida"] - 0.3, "swell", None, {"dur": 1.6, "fade": 0.5, "fadein": 0.6}, "swell suave final en la lápida")

NIVEL = {"cuarto": -46, "campana": -35, "calle": -36, "pajaros": -35, "viento": -36, "vela": -33, "cajon": -32,
         "cloth": -32, "whoosh": -33, "paper": -31, "pluma": -30, "tear": -30, "swell": -30, "stamp": -27, "boom": -24}
for c in C:
    n = NIVEL[c[1]]
    if c[1] == "swell" and "final" in c[4]: n = -32
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
os.environ["DUCK_DB"] = "12"
sys.argv = ["mezcla.py", W + "public/fe02cut.wav", R + "cues_fe02.py", R + "fe02_mix.wav", "--dur", str(END)]
M.main()
shutil.copy(R + "fe02_mix.wav", R + "fe02_vozfoley.wav")
