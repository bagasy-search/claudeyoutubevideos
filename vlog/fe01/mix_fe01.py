# mix_fe01.py — voz + foley suave del plano + sellos/papel de las piezas (SIN piano: el brief pide la música sólo de la
# Biblioteca de Audio de YouTube y hoy no hay Chrome; se agrega re-mezclando sobre fe01_vozfoley.wav, sin re-render).
# Foley: cada plano de b-roll suena a lo que se ve (pala, reja, veladora, grava, papel, campanas), elegido por las
# palabras del prompt de su foto. Nada de golpes salvo en los sellos (las revelaciones) con un swell suave antes.
# Uso: python mix_fe01.py   → D:/rtmp_fe01/fe01_mix.wav (lo sube granja.sh) + copia D:/rtmp_fe01/fe01_vozfoley.wav
import json, os, re, sys, shutil, importlib.util
W = "D:/wt/fe01/"
spec = importlib.util.spec_from_file_location("mezcla", "D:/rtmp/sfxlib/mezcla.py"); M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
mk = M.mk
M.POOLS.update({
    "pala": (mk("Falling hit on gravel", "Body impact falling into the sand", "Sand swish", "Creaky wooden scrap"), -16),
    "reja": (mk("Gate latch click", "Old church door open", "Creaky door open", "Door creak opened by the wind"), -15),
    "puerta": (mk("Creaking door open and close", "Creaky closing wood door", "Knocking on a thick wooden door"), -16),
    "vela": (mk("Fire match lighting", "Lighter wheel spin"), -15),
    "grava": (mk("Crunchy footsteps loop", "Footsteps on stones loop", "Footsteps in the forest ground", "Grass step"), -18),
    "campana": (mk("Church bell calling", "Low church bell calling", "Suburb church bell", "Melodic church bell", "Church bells ending"), -20),
    "viento": (mk("Cinematic wind swell", "Wind howl exterior", "Wind woosh"), -22),
    "noche": (mk("Summer night crickets", "Crickets at night in nature", "Night forest with insects"), -22),
    "pajaros": (mk("Morning birds", "Meadow birds isolated", "Church bells and countryside ambience"), -22),
    "lluvia": (mk("Light rain atmosphere", "Light rain loop", "Light rain on pavement"), -21),
    "agua": (mk("Pouring water", "Water pour light stream", "Pouring water to mug"), -17),
    "barrer": (mk("Sweeping the pavement", "Sweeping the sidewalk"), -18),
    "llaves": (mk("Keys moving", "Keys moving and clicking", "Door key in door lock"), -16),
    "pluma": (mk("Writing with a pen on paper", "Short pencil writing", "Fast signing with a pen", "Pen marker line"), -15),
    "maquina": (mk("Old typewriter typing", "Typewriter soft hit"), -18),
    "reloj": (mk("Old clock pendulum ticking"), -22),
    "calle": (mk("Urban city sounds and light car traffic", "Passing car and urban ambience"), -24),
    "coche": (mk("Old car arriving", "Car door close"), -20),
    "swell": (mk("Cinematic suspense swell", "Trailer cinematic suspense swell", "Cinematic wind swell"), -20),
})
# palabra del prompt → foley (el primero que aparece gana; orden = lo más concreto primero)
REGLAS = [
    (r"shovel|digging|dirt mound|soil|spatula|trowel", "pala"), (r"gate|iron bars|reja", "reja"), (r"wooden door|green door|doorway|knock", "puerta"),
    (r"candle|veladora|match|lighter", "vela"), (r"pour|watering|bucket of water|vase with water", "agua"), (r"broom|sweep", "barrer"),
    (r"keys?\b|keyring", "llaves"), (r"writes|writing|pen\b|pencil|signs", "pluma"), (r"typewriter", "maquina"), (r"clock", "reloj"),
    (r"rain|puddle|wet", "lluvia"), (r"bell tower|church|templo|temple", "campana"), (r"night|dark|dusk|evening", "noche"),
    (r"walking|walks|footsteps|path|gravel", "grava"), (r"street|sidewalk|bus\b|traffic", "calle"), (r"car\b|hearse|coche", "coche"),
    (r"paper|document|receipt|title|folder|envelope|ledger|book|notebook|photo album|map", "paper"),
    (r"morning|sunrise|dawn|birds", "pajaros"), (r"cemetery|graves?|tomb|panteón", "viento"),
]
PROMPT = {}
for f in ("items.json", "items2.json", "items3.json"):
    p = f"D:/rtmp_fe01/img/{f}"
    if os.path.exists(p):
        for it in json.load(open(p, encoding="utf8")): PROMPT[it["name"]] = it["prompt"].split("sharp focus, nothing blurred out.")[-1].lower()
segs = json.load(open(W + "src/fe01/segs.json", encoding="utf8"))
ov = json.load(open(W + "src/fe01/ov.json", encoding="utf8"))
END = json.load(open(W + "src/fe01/avail.json"))["end"]
CUES, ult = [], None
for i, g in enumerate(segs):
    if g["k"] == "av" or not g.get("src"): continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    pid = os.path.basename(g["src"]).rsplit(".", 1)[0]
    pr = PROMPT.get(pid, "")
    pool = next((pl for rx, pl in REGLAS if re.search(rx, pr)), None)
    if not pool or (pool == ult and pool in ("viento", "noche", "pajaros", "lluvia", "calle")): ult = pool; continue  # un ambiente no se repite plano tras plano
    ult = pool
    amb = pool in ("viento", "noche", "pajaros", "lluvia", "calle", "grava", "reloj")
    CUES.append((g["a"] + (0 if amb else 0.25), pool, None, {"dur": max(1.0, b - g["a"]), "fade": 0.6, "fadein": 0.3} if amb else {"dur": min(3.0, b - g["a"]), "fade": 0.3}))
# piezas: el papel suena al entrar, los sellos son las revelaciones (swell suave antes + golpe)
for o in ov:
    k = o["k"]
    if k in ("recibo", "ficha", "refrendo", "foto", "mapa", "quote", "dicho"): CUES.append((o["a"] + 0.05, "paper", None))
    elif k == "stamp": CUES += [(max(0, o["a"] - 1.4), "swell", None, {"dur": 1.5, "fade": 0.2, "fadein": 0.8}), (o["a"] + 0.05, "stamp", -3)]
    elif k == "big": CUES.append((o["a"], "tick", -6))
    elif k == "cap": CUES.append((o["a"], "paper", -2))
    elif k in ("rows",): pass
    for r in o.get("rows", []) or []:
        if r.get("tacha"): CUES.append((r["tacha"], "write", -4))
open("D:/rtmp_fe01/cues_fe01.py", "w", encoding="utf8").write("CUES = " + repr(CUES) + "\n")
print("cues", len(CUES))
sys.argv = ["mezcla.py", W + "public/fe01cut.wav", "D:/rtmp_fe01/cues_fe01.py", "D:/rtmp_fe01/fe01_mix.wav", "--dur", str(END)]
M.main()
shutil.copy("D:/rtmp_fe01/fe01_mix.wav", "D:/rtmp_fe01/fe01_vozfoley.wav")
