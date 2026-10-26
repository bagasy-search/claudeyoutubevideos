# mix_enhr01.py — voz de Rosa + foley suave del plano + papel/sellos de las piezas (SIN piano todavía: va sólo de la
# Biblioteca de Audio de YouTube «sin atribución», a -28/-32 dB subiendo en las pausas; se agrega re-mezclando sobre
# enhr01_vozfoley.wav, sin re-render). Hospicio = todo bajito: cuarto, reloj, taza, lluvia, pájaros de la mañana.
# Golpe SÓLO en los sellos (las revelaciones) con un swell suave antes; el sello acá es un toque de madera, no un mazazo.
# Uso: python mix_enhr01.py   → D:/rtmp_enhr01/enhr01_mix.wav (lo sube granja.sh) + copia D:/rtmp_enhr01/enhr01_vozfoley.wav
import json, os, re, sys, shutil, importlib.util
W = "D:/wt/enhr01/"
spec = importlib.util.spec_from_file_location("mezcla", "D:/rtmp/sfxlib/mezcla.py"); M = importlib.util.module_from_spec(spec); spec.loader.exec_module(M)
mk, kn = M.mk, M.kn
M.POOLS.update({
    "reloj": (mk("Bedroom ambience with wall clock", "Big old clock ticking"), -24),
    "puerta": (mk("Cabinet door closing", "Cupboard soft sliding door", "Bathroom door slide"), -19),
    "agua": (mk("Bathroom sink water running", "Bathroom sink water drip"), -20),
    "tetera": (mk("Kettle boiling"), -24),
    "cocina": (mk("Kitchen plates rattle", "Kitchen object pan opening"), -22),
    "llaves": (mk("Keys moving", "Keys moving and clicking"), -18),
    "pluma": (mk("Writing with a pen on paper", "Fast writing"), -16),
    "silla": (mk("Chair seat wood squeak"), -20),
    "tela": (mk("Cloth slide out"), -18),
    "vela": (mk("Fire match lighting"), -17),
    "lluvia": (mk("Intense rain in a calm night", "Forest rain loop"), -26),
    "noche": (mk("Crickets at night in nature", "Cricket chirp"), -28),
    "pajaros": (mk("Church bells and countryside ambience", "Bird singing and flapping wings"), -26),
    "campana": (mk("Church bell indoor", "Church bell calling", "Church bells ending"), -24),
    "pasos": (mk("Footsteps in the forest ground", "Crunchy footsteps loop"), -22),
    "coche": (mk("Car door close", "Car closing window"), -20),
    "swell": (mk("Cinematic static slow swell", "Angelic swell presentation", "Cinematic suspense swell"), -22),
    "stamp": (kn("impactWood_light_*", "impactSoft_medium_*"), -9),
})
# palabra del prompt → foley (el primero que aparece gana; lo más concreto primero)
REGLAS = [
    (r"kettle|stove|\btea\b|coffee|\bmug\b|\bcups?\b", "tetera"), (r"plates?\b|tortilla|\bpot\b|\bpan\b|cooking|stirs|dishes", "cocina"),
    (r"sink|washcloth|basin|water", "agua"), (r"keys?\b|keyring", "llaves"), (r"candle|match|veladora", "vela"),
    (r"writes|writing|\bpen\b|pencil|notebook|signs|\bform\b", "pluma"), (r"tucks|folds|folding|smooths|fluffs|pulls the (blanket|quilt|sheet)|adjusts the (blanket|quilt|sheet|pillow)", "tela"),
    (r"chair|sits down|rocking", "silla"), (r"door|doorway|cabinet|drawer", "puerta"), (r"clock|watch\b", "reloj"),
    (r"rain|window wet|puddle", "lluvia"), (r"church|chapel|rosary|bell\b|guadalupe", "campana"),
    (r"car\b|parking|driveway|steering", "coche"), (r"walking|walks|hallway|footsteps|porch", "pasos"),
    (r"paper|document|folder|envelope|card\b|letter|photo album|photograph", "paper"),
    (r"morning|sunrise|dawn|birds|garden|yard", "pajaros"), (r"night|dark|dim\b|lamp", "noche"),
]
AMB = ("reloj", "lluvia", "noche", "pajaros", "pasos", "tetera")
PROMPT = {}
for f in ("items.json", "items2.json", "items3.json"):
    p = f"D:/rtmp_enhr01/img/{f}"
    if os.path.exists(p):
        for it in json.load(open(p, encoding="utf8")): PROMPT[it["name"]] = it["prompt"].split("nothing blurred out.")[-1].split("white blouse,")[-1].split("Setting:")[0].lower()  # sólo la ACCIÓN, no su ropa ni el cuarto
segs = json.load(open(W + "src/enhr01/segs.json", encoding="utf8"))
ov = json.load(open(W + "src/enhr01/ov.json", encoding="utf8"))
END = json.load(open(W + "src/enhr01/avail.json"))["end"]
CUES, ult = [], None
for i, g in enumerate(segs):
    if g["k"] == "av" or not g.get("src"): ult = None; continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    pid = os.path.basename(g["src"]).rsplit(".", 1)[0]
    pr = PROMPT.get(pid, "")  # los clips LTX (hr_*) traen su propio sonido: sin foley encima
    pool = next((pl for rx, pl in REGLAS if re.search(rx, pr)), None)
    if not pool or (pool == ult and pool in AMB): ult = pool; continue  # un ambiente no se repite plano tras plano
    ult = pool
    amb = pool in AMB
    CUES.append((g["a"] + (0 if amb else 0.3), pool, None, {"dur": max(1.0, b - g["a"]), "fade": 0.8, "fadein": 0.4} if amb else {"dur": min(2.5, b - g["a"]), "fade": 0.4}))
# piezas: el papel suena al entrar, los sellos son las revelaciones (swell suave antes + toque de madera)
for o in ov:
    k = o["k"]
    if k in ("tarjeta", "libreta", "foto", "mapa", "quote", "dicho", "lugar", "comment"): CUES.append((o["a"] + 0.05, "paper", -4))
    elif k == "stamp": CUES += [(max(0, o["a"] - 1.6), "swell", None, {"dur": 1.7, "fade": 0.3, "fadein": 1.0}), (o["a"] + 0.05, "stamp", None)]
    elif k in ("big", "num", "cuenta", "reloj"): CUES.append((o["a"], "tick", -8))
    elif k in ("chips", "cinco", "linea", "tag", "lower"): CUES.append((o["a"], "paper", -8))
    for r in o.get("rows", []) or []:
        if r.get("tacha"): CUES.append((r["tacha"], "write", -6))
        elif r.get("ok"): CUES.append((r["ok"], "write", -9, {"dur": 0.6, "fade": 0.2}))
open("D:/rtmp_enhr01/cues_enhr01.py", "w", encoding="utf8").write("CUES = " + repr(CUES) + "\n")
from collections import Counter
print("cues", len(CUES), Counter(c[1] for c in CUES).most_common())
if "--seco" in sys.argv: sys.exit()
sys.argv = ["mezcla.py", W + "public/enhr01cut.wav", "D:/rtmp_enhr01/cues_enhr01.py", "D:/rtmp_enhr01/enhr01_mix.wav", "--dur", str(END)]
M.main()
shutil.copy("D:/rtmp_enhr01/enhr01_mix.wav", "D:/rtmp_enhr01/enhr01_vozfoley.wav")
