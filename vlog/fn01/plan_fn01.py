# fn01 · «What Happens to the Cemetery at Night After Day of the Dead» (Ernie Navarro, Funeral Director, EN) · plan del video ENTERO escrito A MANO,
# plano por plano, sobre la frase de ese segundo (at() sobre words.json, frases copiadas del guion). → segs.json, ov.json, avail.json,
# edl.json en src/fn01 y D:/rtmp/fn01_PLAN_MxM.md (una línea por plano). Las ventanas del avatar las manda avwin.json (av_temprano):
# ahí la base es el avatar y al salir vuelve el plano que corresponde.
# Bases: "img:<id>" foto (si su toma LTX-vlog ya llegó, va el clip de Ernesto haciendo eso) · "ph:<id>" foto quieta
# · "ltx:<id>|<respaldo>" clip LTX de lugar (si todavía no llegó, el respaldo) · "bk[:<id>]" foto oscurecida para piezas grandes
# · "fill" el siguiente clip/foto que nadie pidió (nunca se repite nada).
# ⛔ Nunca cuerpos, ataúd abierto ni restos en pantalla. Sin voz todavía: corre con words SIMULADAS del guion (--sim) para probar.
import json, os, re, subprocess, unicodedata, sys, statistics

sys.stdout.reconfigure(encoding="utf-8")
SL = "fn01"
R = f"D:/wt/{SL}/"
S = R + f"src/{SL}/"
PUB = R + "public/"
WAV = PUB + f"{SL}cut.wav"
SIM = "--sim" in sys.argv or not os.path.exists(S + "words.json")

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))

if SIM:  # palabras simuladas del guion (2,55 palabras/s, pausas en punto y aparte) sólo para probar el plan antes de la voz
    W, t = [], 0.4
    for par in open("D:/rtmp_fn01/guion.txt", encoding="utf8").read().split("\n"):
        for w in par.split():
            W.append([w, round(t, 2)]); t += 1 / 2.55 + (0.28 if w[-1] in ".?!" else 0.1 if w[-1] in ",:;" else 0)
        t += 0.55
    END = t + 1.0
else:
    W = [[x[1], x[0]] for x in json.load(open(S + "words.json", encoding="utf8"))]
    END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode())
TOK = [norm(w) for w, _ in W]
TS = [float(s) for _, s in W]
AVW = json.load(open(S + "avwin.json", encoding="utf8")).get("win", [])
if not AVW:  # sin av_temprano todavía: ventanas de prueba (0 s + cada ~17 s, 4,5 s) → ~27 %
    AVW = [{"ms": 0.0, "me": 6.0}] + [{"ms": round(x, 2), "me": round(x + 4.6, 2)} for x in [6.0 + 17.0 * k for k in range(1, int(END / 17))] if x + 4.6 < END - 3]
cur = 0
miss = []

def at(ph, d=0.0):
    """tiempo de la 1ª palabra de la frase, buscando hacia adelante desde el cursor (difuso: ≥75 % de las palabras en orden)."""
    global cur
    q = [norm(x) for x in ph.split() if norm(x)]
    def eq(t, w): return t == w or (len(w) > 4 and t[:5] == w[:5])
    def score(i):
        # la frase tiene que EMPEZAR acá (su 1ª o 2ª palabra), si no el difuso devuelve un segundo varias palabras antes
        if not (eq(TOK[i], q[0]) or (len(q) > 1 and len(q[1]) > 3 and eq(TOK[i], q[1]))): return 0
        j, k, hit = i, 0, 0
        while k < len(q) and j < len(TOK) and j < i + len(q) + 3:
            if TOK[j] == q[k] or (len(q[k]) > 4 and TOK[j][:5] == q[k][:5]): hit += 1; k += 1; j += 1
            elif k + 1 < len(q) and TOK[j] == q[k + 1]: k += 1
            else: j += 1
        return hit
    need = max(2, int(0.75 * len(q) + 0.5)) if len(q) > 1 else 1
    for lo, hi in ((cur, min(len(TOK), cur + 900)), (0, len(TOK))):
        for i in range(lo, hi):
            if score(i) >= need:
                if lo == cur: cur = i
                return round(TS[i] + d, 2)
    miss.append(ph)
    return None

BEATS, OVS = [], []
def B(ph, base, tr=None, d=0.0, why="", **kw):
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr, ph=ph, why=why, **kw))
def O(ph, k, L, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: OVS.append(dict(k=k, a=a, b=round(a + L, 2), **kw))
def T(ph, t0=0.0):
    """segundo de una frase buscando desde t0 (la entrada de la pieza) SIN mover el cursor (para los 'at' internos de las piezas)."""
    global cur
    c = cur; cur = next((i for i, x in enumerate(TS) if x >= t0 - 3), 0); v = at(ph); cur = c; return v
CEMPA, ROJO, VERDE = "#f39a1e", "#b8322a", "#3f9d5a"

exec(open("D:/rtmp_fn01/beats_fn01.py", encoding="utf8").read())  # los planos a mano, frase por frase

# ---------------- medios disponibles ----------------
def clip_len(p):
    try: return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 2)
    except Exception: return 0.0
LTXD = PUB + f"{SL}/ltx/"; IMGD = PUB + f"{SL}/img/"
ltx_ok = {f[:-4] for f in os.listdir(LTXD) if f.endswith(".mp4")} if os.path.isdir(LTXD) else set()
RECH = {l.split()[0] for l in open("D:/rtmp_fn01/ltx_rechazados.txt", encoding="utf8") if l.strip()} if os.path.exists("D:/rtmp_fn01/ltx_rechazados.txt") else set()
ltx_ok -= RECH  # clips mirados a ojo y rechazados (texto deformado, etc.): su lugar lo toma la foto
VMAP = json.load(open("D:/rtmp_fn01/ltx_vlog_mapa.json", encoding="utf8")) if os.path.exists("D:/rtmp_fn01/ltx_vlog_mapa.json") else {}
img_ok = {f[:-4] for f in os.listdir(IMGD) if f.endswith(".jpg")} if os.path.isdir(IMGD) else set()
if (SIM or "--supone" in sys.argv) and not img_ok:  # prueba sin fotos todavía: se asumen todas las del pedido
    img_ok = set(json.load(open("D:/rtmp_fn01/anclas_n.json", encoding="utf8"))) | {f"c{i:02d}" for i in range(1, 49)} | {"f01", "f02"}
REF = set()
for b in BEATS:
    for p in re.split(r"[:|]", b["base"])[1:]: REF.add(p)
LTX_ALL = [x["id"] for x in json.load(open("D:/rtmp_fn01/ltx/pedidos.json", encoding="utf8"))]
POOL_CLIP = [x for x in LTX_ALL if x not in REF]
# cada foto tiene SU frase (anclas_n.json, en el orden del guion → búsqueda secuencial): el relleno de un segundo es la foto libre más cerca
ANC = json.load(open("D:/rtmp_fn01/anclas_n.json", encoding="utf8"))
ANC.update({"c10": "The Mezquitán has a huge iron gate", "c17": "graves buried in marigolds"})
AT = {}
c0 = cur; cur = 0
for k, ph in ANC.items():
    if k.startswith("p") and k[1:].isdigit() and int(k[1:]) >= 176:  # tanda de fondos (agregada al final del json): búsqueda desde 0
        c1 = cur; cur = 0; v = at(ph); cur = c1
    else: v = at(ph)
    if v is not None: AT[k] = v
    elif k.startswith("p") and k[1:].isdigit() and int(k[1:]) >= 176: print("  ! foto sin anclar", k, ph)
cur = c0
POOL_IMG = sorted((x for x in img_ok if x not in REF and x not in ("f01", "f02")), key=lambda x: AT.get(x, 9e9))
used, notes, FILLS_USED = set(), [], []
def fill_img(t=None, ancho=1):
    libres = [f for f in POOL_IMG if f not in used]
    if not libres: return None
    if t is not None:
        cerca = [f for f in libres if f in AT and t - 12 * ancho <= AT[f] <= t + 18 * ancho]
        f = min(cerca, key=lambda f: abs(AT[f] - t - 1.5)) if cerca else None
        if f is None and t is not None: return None
    else: f = libres[0]
    used.add(f); FILLS_USED.append(f); return f
MOVD = PUB + f"{SL}/mov/"  # respaldo de movimiento: la foto animada por agnes multishot (3 s, 0,33×) mientras la cola LTX está frenada
mov_ok = {f[:-4] for f in os.listdir(MOVD) if f.endswith(".mp4") and "_cu" not in f} if os.path.isdir(MOVD) else set()
def mov_o_foto(pid):
    if pid in mov_ok: return {"k": "clip", "src": f"{SL}/mov/{pid}.mp4", "len": clip_len(MOVD + pid + ".mp4"), "id": pid}
    return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": pid}
def clip_libre():
    for c in POOL_CLIP:
        if c in ltx_ok and c not in used:
            used.add(c); return {"k": "clip", "src": f"{SL}/ltx/{c}.mp4", "len": clip_len(LTXD + c + ".mp4"), "id": c}
    return None
def fill_seg(t=None):
    f = fill_img(t)  # 1º la foto de ESA frase
    if f: return mov_o_foto(f)
    c = clip_libre()  # 2º un clip de lugar que nadie pidió
    if c: return c
    f = (fill_img(t, 3) or fill_img(t, 6)) if t is not None else None  # 2,5º una foto libre de una frase vecina (±36-54 s) antes que repetir una foto en recorte
    if f: return mov_o_foto(f)
    # 3º otro recorte (inserto de detalle) de una foto de esa misma frase ya usada
    for u in sorted((u for u in img_ok if u in used and u in AT and abs(AT[u] - t) <= 15) if t is not None else [], key=lambda u: abs(AT[u] - t)):
        if "det_" + u not in used:
            used.add("det_" + u); h = len(used) % 4
            return {"k": "img", "src": f"{SL}/img/{u}.jpg", "id": "det_" + u, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    f = fill_img(None)
    if f: notes.append(f"relleno lejos de su frase @{t}: {f}"); return {"k": "img", "src": f"{SL}/img/{f}.jpg", "id": f}
    # todo usado: un relleno vuelve UNA vez como inserto de detalle (otro recorte, otra zona), nunca el mismo cuadro
    for u in FILLS_USED:
        if "det_" + u not in used:
            used.add("det_" + u); h = len(used) % 4
            return {"k": "img", "src": f"{SL}/img/{u}.jpg", "id": "det_" + u, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    notes.append("¡pool de relleno vacío!"); return {"k": "bk"}

def resolve(base, a):
    """base → dict de plano. Nunca repite un clip ni una foto."""
    if base.startswith("bk"):
        pid = base[3:]
        if pid in img_ok and ("bk_" + pid) not in used: used.add("bk_" + pid); return {"k": "bk", "src": f"{SL}/img/{pid}.jpg"}
        f = fill_img(a) or fill_img(None); return {"k": "bk", "src": f"{SL}/img/{f}.jpg"} if f else {"k": "bk"}
    if base == "fill": return fill_seg(a)
    if base.startswith("ltx:"):
        lid, alt = base[4:].split("|")
        if lid in ltx_ok and lid not in used:
            used.add(lid); return {"k": "clip", "src": f"{SL}/ltx/{lid}.mp4", "len": clip_len(LTXD + lid + ".mp4"), "id": lid}
        notes.append(f"LTX {lid} no llegó → {alt}"); base = "img:" + alt
    force_ph = base.startswith("ph:")
    pid = base.split(":", 1)[1]
    if not force_ph and pid in VMAP and VMAP[pid][0] in ltx_ok and ("vl_" + pid) not in used:
        cid, fr, ln = VMAP[pid]; used.add("vl_" + pid); used.add(pid)
        return {"k": "clip", "src": f"{SL}/ltx/{cid}.mp4", "from": fr, "len": ln, "id": "vl_" + pid}
    if pid in img_ok and pid not in used:
        used.add(pid); return mov_o_foto(pid)
    if pid in img_ok and ("det_" + pid) not in used:
        f = fill_img(a) or fill_img(a, 3)  # la foto ya salió: antes que un recorte, una libre de esa misma zona del guion
        if f: return mov_o_foto(f)
        used.add("det_" + pid); h = len(used) % 4
        return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": "det_" + pid, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    notes.append(f"{base} sin medio → relleno"); return fill_seg(a)

BEATS.sort(key=lambda b: b["a"])
ZS = [[1.03, 1.13], [1.13, 1.03], [1.05, 1.12], [1.04, 1.15]]
segs = []
for n, b in enumerate(BEATS):
    g = {"a": b["a"], "tr": b["tr"] or "cut", "why": b["why"], "ph": b["ph"], **resolve(b["base"], b["a"])}
    segs.append(g)
segs[0]["a"] = 0.0
# el avatar pisa sus ventanas; al salir vuelve lo que corresponda (una foto/clip ya empezado no se retoma → relleno)
for w in AVW:
    ms, me = w["ms"], w["me"]
    before = [g for g in segs if g["a"] <= me]
    active = before[-1] if before else segs[0]
    segs = [g for g in segs if not (ms <= g["a"] < me)]
    segs.append({"a": round(ms, 2), "k": "av", "tr": "zoom" if len(segs) % 2 else "iris", "why": "avatar", "ph": ""})
    nxt = [g for g in segs if g["a"] >= me]
    if not nxt or nxt[0]["a"] - me > 0.8:
        r = dict(active); r["a"] = round(me, 2); r["tr"] = "swipeL"
        if r["k"] in ("img", "clip", "bk") and active["a"] < ms: r = {"a": round(me, 2), "tr": "swipeL", "why": "relleno tras el avatar", "ph": "", **fill_seg(me)}
        segs.append(r)
    segs.sort(key=lambda g: g["a"])
segs[0]["tr"] = "cut"
out = []
for g in segs:
    if out and g["a"] - out[-1]["a"] < 1.0 and out[-1]["k"] != "av" and g["k"] != "av": out[-1] = g; continue
    out.append(g)
segs = out
# planos largos: foto > ~4 s (3 s en el 1er minuto) o clip que se queda corto → otro plano (nunca > ~4 s quieto)
add = []
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    lim = min(g.get("len", 3) + 1.0, 6.0) if g["k"] == "clip" else (3.0 if g["a"] < 60 else 4.0) if g["k"] == "img" else 5.5 if g["k"] == "bk" else 99
    t0 = g["a"] + lim
    while g["k"] in ("img", "clip", "bk") and b - t0 > 1.2:
        x = {"a": round(t0, 2), "tr": "cut", "why": "el plano se acaba → otro", "ph": "", **fill_seg(t0)}
        if x.get("det") and b - g["a"] <= 6.5: notes.append(f"plano @{g['a']} queda {round(b - g['a'], 1)} s antes que repetir foto"); break
        add.append(x); t0 += min(x.get("len", 3) + 1.0, 6.0) if x["k"] == "clip" else (3.0 if t0 < 60 else 4.0)
segs = sorted(segs + add, key=lambda g: g["a"])
segs = [g for i, g in enumerate(segs) if g["k"] == "av" or i + 1 >= len(segs) or segs[i + 1]["a"] - g["a"] >= 0.7]
for n, g in enumerate(segs):
    if g.get("k") == "img" and "det" in g:
        g["z"] = [1.32, 1.42]; g["ox"], g["oy"] = g.pop("dz"); g.pop("det")
    elif g.get("k") == "img":
        h = n % 4; g["z"] = ZS[h]; g["ox"] = [0, -30, 30, 0][h]; g["oy"] = [0, 10, -10, -20][h]

# ---------------- piezas: "at" de texto → segundos ----------------
ov = []
for o in OVS:
    for lk in ("items", "rows", "pins"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for it in o[lk]:
                if isinstance(it.get("at"), str):
                    a = T(it["at"], o["a"]); it["at"] = a if a is not None and a < o["b"] else round(o["a"] + 0.6 + 0.7 * o[lk].index(it), 2)
    for dk in ("route", "total", "sello"):
        if dk in o and isinstance(o[dk].get("at"), str):
            a = T(o[dk]["at"], o["a"]); o[dk]["at"] = a if a is not None and a < o["b"] else round(o["b"] - 1.6, 2)
    for kk in ("venceAt",):
        if isinstance(o.get(kk), str):
            v = T(o[kk], o["a"])
            if v is None: print("  ! ancla interna sin encontrar:", o["k"], kk, o[kk]); v = o["a"] + 1.5
            o[kk] = v
    for it in o.get("rows", []) if o["k"] == "recibo" else []:
        if it.pop("x", 0): it["tacha"] = round(it["at"] + 0.7, 2)
    if "from_" in o: o["from"] = o.pop("from_")
    ov.append(o)
# las piezas no van encima del avatar (le tapan la cara): si entra ≥2 s antes de la ventana se recorta; si no, se corre a la
# salida de la ventana (si eso es ≤5 s después de su frase) con su largo; si tampoco, sale
nv = []
for o in sorted(ov, key=lambda o: o["a"]):
    a, b = o["a"], o["b"]
    if o["k"] == "lower":  # el rótulo del nombre va JUSTO sobre el avatar (abajo, no le tapa la cara)
        nv.append({**o, "a0": o["a"]}); continue
    for _ in range(3):
        w = next((w for w in AVW if a < w["me"] and b > w["ms"]), None)
        if not w: break
        if w["ms"] - a >= 2.0: b = w["ms"]; break
        L = b - a
        if w["me"] - o["a"] <= 7.0: a = w["me"] + 0.15; b = a + L; continue
        # si no, antes de la ventana (anticipa ≤6 s la frase) cuando el hueco previo alcanza
        pw = max((x["me"] for x in AVW if x["me"] <= w["ms"]), default=0)
        a2 = max(w["ms"] - 0.15 - L, pw + 0.15)
        if w["ms"] - 0.15 - a2 >= min(L, 2.2) and o["a"] - a2 <= 6.0: a, b = a2, w["ms"] - 0.15; break
        a = None; break
    if a is None or next((w for w in AVW if a < w["me"] and b > w["ms"]), None):
        notes.append(f"pieza {o['k']} @{o['a']} quedó bajo el avatar → sale"); continue
    x = dict(o); sh = round(a - o["a"], 2); x["a"], x["b"], x["a0"] = round(a, 2), round(b, 2), o["a"]
    if sh:  # las anclas internas se corren con la pieza
        for lk in ("items", "rows", "pins"):
            if lk in x and x[lk] and isinstance(x[lk][0], dict): x[lk] = [{**it, "at": round(it["at"] + sh, 2), **({"tacha": round(it["tacha"] + sh, 2)} if "tacha" in it else {})} for it in x[lk]]
        for dk in ("route", "total", "sello"):
            if dk in x: x[dk] = {**x[dk], "at": round(x[dk]["at"] + sh, 2)}
        if "venceAt" in x: x["venceAt"] = round(x["venceAt"] + sh, 2)
    nv.append(x)
ov = sorted(nv, key=lambda o: o["a"])
# una pieza por vez (el rótulo de nombre/lugar convive): la que entra corta a la anterior; si a la anterior le quedan <1,2 s, la nueva espera
SOLAS = ("lower", "lugar", "tag")
CHICAS = {"stamp": (960, 540), "big": (960, 520), "comment": (1300, 800), "chips": (960, 880)}  # piezas que ocupan un lugar del cuadro
def choca(o, p):  # dos piezas chicas en lugares distintos del cuadro conviven; si alguna ocupa el cuadro entero, chocan
    if o["k"] not in CHICAS or p["k"] not in CHICAS: return True
    (ox, oy), (px, py) = [(z.get("x", CHICAS[z["k"]][0]), z.get("y", CHICAS[z["k"]][1])) for z in (o, p)]
    return abs(oy - py) < 300 and abs(ox - px) < 800
for i, o in enumerate(ov):
    if o["k"] in SOLAS: continue
    for p in ov[:i]:
        if p["k"] in SOLAS or p["b"] <= o["a"] or abs(o["a0"] - p["a0"]) < 0.6: continue  # las que entran juntas son un combo a propósito
        if not choca(o, p): continue
        if p["a"] - p["a0"] > 4.0 and o["a"] - o["a0"] < 1.5 and p["k"] not in ("cap", "big"): p["b"] = p["a"]; continue  # la corrida lejos de su frase cede el lugar (sale)
        keep = p.get("keep", 3.0 if p["k"] == "cap" else 1.2)  # lo mínimo que se ve la anterior (el capítulo, más)
        if o["a"] - p["a"] < keep: o["a"] = round(min(p["b"], p["a"] + keep) + 0.05, 2)  # la nueva espera (su final no se mueve)
        p["b"] = round(min(p["b"], o["a"] - 0.05), 2)
for o in ov:  # tras correr/esperar: cada renglón entra después que la pieza y se tacha después de entrar
    for lk in ("items", "rows", "pins"):
        for i, it in enumerate(o.get(lk) or []):
            if isinstance(it, dict) and "at" in it:
                it["at"] = round(max(it["at"], o["a"] + 0.4 + 0.35 * i), 2)
                if "tacha" in it: it["tacha"] = round(max(it["tacha"], it["at"] + 0.7), 2)
    for dk in ("route", "total", "sello"):  # el sello/total entra con aire para leerse antes de que la pieza salga
        if isinstance(o.get(dk), dict) and "at" in o[dk]: o[dk]["at"] = round(min(max(o[dk]["at"], o["a"] + 0.6), o["b"] - 1.4), 2)
    tard = [it for lk in ("items", "rows", "pins") for it in (o.get(lk) or []) if isinstance(it, dict) and it.get("at", 0) > o["b"] - 1.2]
    if tard: notes.append(f"aviso {o['k']} @{o['a']}: {len(tard)} renglón(es) entran <1,2 s antes de salir")
ov = [o for o in ov if o["b"] - o["a"] >= 1.0 or notes.append(f"pieza {o['k']} @{o['a']} (frase {o['a0']}) quedó <1 s al encimarse → sale")]
lost = [n for n in notes if n.startswith("pieza")]

reel = os.path.exists(PUB + f"av/{SL}/reel0.mp4")
rl = clip_len(PUB + f"av/{SL}/reel0.mp4") if reel else 0
if not SIM:
    json.dump([{k: v for k, v in g.items() if k not in ("why", "ph", "id")} for g in segs], open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
    json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
    json.dump({"reel": reel, "reelLen": round(rl, 3), "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
    shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"], "src": g.get("src"), "len": g.get("len")} for i, g in enumerate(segs)]
    json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))

# ---------------- el plan minuto a minuto (una línea por plano) ----------------
def mmss(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"
lines = [f"# {SL} · PLAN MxM (generado de plan_fn01.py, escrito a mano plano por plano){' · SIMULADO sin voz' if SIM else ''} · END {mmss(END)}", "mm:ss-mm:ss · frase · plano · componente · sonido", ""]
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    pz = [o["k"] for o in ov if g["a"] - 0.2 <= o["a"] < b]
    what = g["k"] + (":" + (g.get("src") or "").split("/")[-1] if g.get("src") else "")
    snd = "voz" if g["k"] == "av" else "voz + audio nativo del clip −26 dB" if g["k"] == "clip" else "voz + foley suave (viento, pájaros, grava)"
    lines.append(f"{mmss(g['a'])}-{mmss(b)} · {g.get('ph', '')[:48]} · {what} ({g.get('why', '')}) · {', '.join(pz) or '—'} · {snd}")
open(f"D:/rtmp/{SL}_PLAN_MxM{'_SIM' if SIM else ''}.md", "w", encoding="utf8").write("\n".join(lines))

# ---------------- medición ----------------
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "img", "clip", "bk")}
gap, last = 0, 0
for g, d in zip(segs, dur):
    if g["k"] == "av": last = g["a"] + d
    else: gap = max(gap, g["a"] + d - last)
m1 = [d for g, d in zip(segs, dur) if g["a"] < 60]
print(f"{'SIMULADO · ' if SIM else ''}END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · 1er min {len(m1)} planos (máx {max(m1):.1f}s) · {tot} · av {100*tot['av']/END:.0f}% · hueco máx sin avatar {gap:.1f}s")
print(f"piezas {len(ov)} (perdidas bajo el avatar {len(lost)}) · beats {len(BEATS)} · LTX llegados {len(ltx_ok)} · fotos {len(img_ok)} · reel {reel}")
nl = sum(1 for g in segs if "/ltx/" in (g.get("src") or ""))
print(f"clips LTX en pantalla {nl} · respaldos usados {sum(1 for n in notes if n.startswith('LTX'))}")
long_ = [(mmss(g["a"]), round(d, 1), g["k"]) for g, d in zip(segs, dur) if d > 4.6 and g["k"] not in ("av",)]
print("planos > 4,6 s (no avatar):", long_[:20], "…" if len(long_) > 20 else "")
print("SIN ANCLAR:", miss if miss else "ninguna")
for n in notes:
    if not n.startswith("LTX"): print("  ", n)

