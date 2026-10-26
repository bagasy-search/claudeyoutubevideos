# cola común de Enzo (beats_<slug>.py define FOTO_FR y LTX_ALT antes de cargarla) · planos, piezas, eventos del sótano y foley, anclados a la voz (lo ejecuta plan.py)
# Todo entra a una COLA y se ejecuta ordenado por la posición de la frase en el guion (así el cursor de at() siempre avanza).
# Fotos de Enzo (fotos_cara.json) y clips LTX (pedidos) se anclan solos a su frase; a mano: mundo, eventos, piezas y sonido.
FO, DE, VS = "D:/Proyectos/sfx_pro/foley/", "D:/Proyectos/sfx_pro/design/", "C:/Users/bauti/Downloads/video2/public/sfx/"
MX, KN = "D:/rtmp/sfxlib/mixkit/", "D:/rtmp/sfxlib/kenney/kenney_impact-sounds/Audio/"
SWELL, HIT, STAMP, WHOOSH, WSOFT = DE + "swell_suspense.flac", DE + "impact_drum_subtle.flac", DE + "stamp_rubber.flac", DE + "whoosh_slow_sweep.flac", DE + "whoosh_sweep_small.flac"
PEN, PENC, PAPER, CRINK, TICK, CLICK, POP = DE + "pen_write.flac", DE + "pencil_paper.flac", DE + "paper_slide.flac", FO + "paper_crinkle.flac", DE + "tick_clock_close.flac", DE + "click_interface.flac", DE + "pop_soap_bubble.flac"
WIND, FIRE, SWITCH, PHONE, PHONE2, COINS, HUM, ZAP, CAR, CAR2, DOOR, WATER, CREAK = (MX + "wind/1153.mp3", MX + "fire/1330.mp3", MX + "switch/1891.mp3", MX + "phone-ring/2344.mp3", MX + "phone-ring/2976.mp3",
    MX + "coins/1936.mp3", MX + "hum/1553.mp3", MX + "electricity/2967.mp3", MX + "car/1535.mp3", MX + "car/1536.mp3", MX + "doors/109.mp3", MX + "water/1178.mp3", MX + "creaking-floorboard/176.mp3")
POUR, STIR, SCRUB, KEYS, LIGHT, DRAIN, BUCKET, METAL = MX + "pour/3140.mp3", FO + "stir_coffee.flac", FO + "scrub_pad.flac", FO + "keys_jingle.flac", FO + "light_pull_switch.flac", FO + "washer_drain_water.flac", FO + "bucket_pour.flac", KN + "impactMetal_light_000.ogg"
STEP = [KN + f"footstep_wood_00{i}.ogg" for i in range(3)]
SNOW = [KN + f"footstep_snow_00{i}.ogg" for i in range(3)]

# ---------------- cola ordenada por el guion ----------------
_GW = [norm(x) for x in open(f"D:/rtmp_{SL}/guion.txt", encoding="utf8").read().split() if norm(x)]
_GS = " " + " ".join(_GW) + " "
def _pos(ph):
    q = " " + " ".join(norm(x) for x in ph.split() if norm(x)) + " "
    i = _GS.find(q)
    if i < 0: print("  ? frase que no está en el guion:", ph); return 10 ** 9
    return _GS[:i].count(" ")
_Q = []
_fB, _fO, _fEV, _fKF, _fBL, _fSFX = B, O, EV, KF, BL, SFX
def _q(f, ph, a, k): _Q.append((_pos(ph), k.get("d", 0.0), len(_Q), f, ph, a, k))
def B(ph, *a, **k): _q(_fB, ph, a, k)
def O(ph, *a, **k): _q(_fO, ph, a, k)
def EV(ph_key, ph, *a, **k): _q(lambda p, *x, **y: _fEV(ph_key, p, *x, **y), ph, a, k)
def KF(key, ph, *a, **k): _q(lambda p, *x, **y: _fKF(key, p, *x, **y), ph, a, k)
def BL(ph, *a, **k): _q(_fBL, ph, a, k)
def SFX(ph, *a, **k): _q(_fSFX, ph, a, k)
def EV2(key, ph, ph2):
    """evento del mundo desde una frase hasta otra (la 2ª se busca sin mover el cursor)"""
    def f(p):
        global cur
        a = at(p)
        if a is None: return
        c = cur; b = at(ph2); cur = c
        if b is not None and b > a: EVR.setdefault(key, []).append([a, b])
    _q(f, ph, (), {})
def STEPS(ph, n=3, gap=0.45):
    for i in range(n): SFX(ph, STEP[i % 3], -22, d=i * gap)

# ---------------- fotos de Enzo y clips LTX: cada uno a su frase ----------------
for it in json.load(open(f"D:/rtmp_{SL}/fotos_cara.json", encoding="utf8")):
    k = it["name"].split("_")[1]
    B(FOTO_FR.get(k, it["frase"]), "img:" + k, None, alt="w:wide")
_cyc = ["w:doll", "w:wide", "w:outside", "w:house", "w:bench", "w:duct"]
# 25-oct v2: tomas LTX de Enzo HACIENDO lo que narra (D:/rtmp/enzo/ltx2) → c_<clip><a|b|c>.mp4, cada una a su frase
_T2 = json.load(open(f"D:/rtmp/enzo/ltx2/{SL}_tomas.json", encoding="utf8")); _F2 = {x["frase"] for x in _T2}
for x in _T2: B(x["frase"], "img:" + x["id"], "cut", alt="w:wide")
for j, it in enumerate(x for x in json.load(open(f"D:/rtmp/enzo/ltx/{SL}_pedidos.json", encoding="utf8")) if x["frase"] not in _F2):
    B(LTX_FR.get(it["id"], it["frase"]), "img:" + it["id"], "cut", alt=LTX_ALT.get(it["id"], _cyc[j % len(_cyc)]))

