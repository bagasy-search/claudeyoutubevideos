# eneh05/eneh06 (Enzo the HVAC Tech) · plan del video ENTERO anclado a la voz.
# Cada plano, pieza, evento del mundo y sonido se ancla a la frase que se dice en ese segundo (at() sobre words.json)
# → segs.json, ov.json, cam.json, ev.json, avail.json, edl.json en src/<slug> y snd.json (foley por plano) en D:/rtmp_<slug>.
# Bases: "w:<vista>" mundo del sótano de Enzo · "img:fNN" foto de Héctor (si existe c_fNN.mp4 = su clip agnes, va el clip)
# · "img:lNN" clip LTX (si no llegó → alt). Las ventanas del avatar (avwin.json) pisan todo.
import json, os, re, subprocess, unicodedata, sys, statistics

SL = sys.argv[1] if len(sys.argv) > 1 else "eneh06"
R = f"D:/wt/{SL}/"
S = R + f"src/{SL}/"
PUB = R + f"public/{SL}/"
W = json.load(open(S + "words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
WAV = f"D:/rtmp_{SL}/{SL}cut.wav"
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from views import V

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))
TOK = [norm(w) for _, w in W]
TS = [float(s) for s, _ in W]
cur = 0
miss = []

NUMR = r"(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth|twelfth|twentieth|thirtieth|fortieth|fiftieth|th|st|nd|rd|and|a|dollars|percent)+"
def isnum(x): return bool(re.fullmatch(NUMR, x)) and x not in ("and", "a")
def at(ph, d=0.0):
    """tiempo de la 1ª palabra de la frase, buscando hacia adelante desde el cursor (difuso: ≥75 % de las palabras en orden)."""
    global cur
    q = [norm(x) for x in ph.split() if norm(x)]
    allnum = all(isnum(x) for x in q)
    def score(i):
        r = _score(i)
        return r[0] if (r[1] or allnum) else 0
    def _score(i):
        j, k, hit, nn = i, 0, 0, 0
        while k < len(q) and j < len(TOK) and j < i + len(q) + 3:
            if re.search(r"\d", TOK[j]) and isnum(q[k]):  # el ASR escribe "$3,600" / "10" / "31st" donde la frase dice palabras
                while k < len(q) and isnum(q[k]): hit += 1; k += 1
                j += 1
                while j < len(TOK) and re.search(r"\d", TOK[j]) and j < i + len(q) + 3: j += 1
            elif TOK[j] == q[k] or (len(q[k]) > 4 and TOK[j][:5] == q[k][:5]): hit += 1; nn += not isnum(q[k]); k += 1; j += 1
            elif k + 1 < len(q) and TOK[j] == q[k + 1]: k += 1
            else: j += 1
        return hit, nn
    need = max(2, int(0.75 * len(q) + 0.5)) if len(q) > 1 else 1
    for lo, hi in ((cur, min(len(TOK), cur + 900)), (0, len(TOK))):
        for i in range(lo, hi):
            if score(i) >= need:
                if lo == cur: cur = i
                return round(TS[i] + d, 2)
    miss.append(ph)
    return None

END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode()) + 1.0
PTV = {"furn": "furn", "burner": "burner", "flue": "flue", "switch": "switch", "panel": "panel", "outlet": "outlet", "strip": "strip", "heater": "heater",
       "thermo": "thermo", "bench": "bench", "window": "window", "hp": "hp", "hpclose": "hp", "hptop": "hp", "meter": "meter"}

BEATS, OVS, EVR, KFS, WSS, SND = [], [], {}, {}, [], []
def B(ph, base, tr=None, d=0.0, alt=None, **kw):
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr, alt=alt, **kw))
    return a
def O(ph, k, dur, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: OVS.append(dict(k=k, a=a, b=round(a + dur, 2), **kw))
def EV(key, ph, dur, d=0.0):
    a = at(ph, d)
    if a is not None: EVR.setdefault(key, []).append([a, round(a + dur, 2)])
def KF(key, ph, v, d=0.0):
    a = at(ph, d)
    if a is not None: KFS.setdefault(key, []).append([a, v])
def WS(ph, tx, dur, car="A", d=0.0):
    a = at(ph, d)
    if a is not None: WSS.append(dict(a=a, b=round(a + dur, 2), tx=tx, car=car))
def SFX(ph, f, g=-26, d=0.0):
    a = at(ph, d)
    if a is not None: SND.append(dict(t=a, f=f, g=g))

exec(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), f"beats_{SL}.py"), encoding="utf8").read())

# ---------------- resolver bases: foto ↔ clip agnes, LTX que no llegó → alt ----------------
BEATS.sort(key=lambda b: b["a"])
used = set()
for b in BEATS:
    if not b["base"].startswith("img:"): continue
    i = b["base"][4:]
    ok = os.path.exists(PUB + "c_" + i + ".mp4") or os.path.exists(PUB + "i_" + i + ".jpg")
    if (not ok or i in used):
        b["base"] = b["alt"] or "w:wide"
        if not ok: print("  ↺ falta:", i, "→", b["base"])
        else: print("  ↺ repetida:", i)
    else: used.add(i)
media = {f[2:-4] for f in os.listdir(PUB) if f[:2] in ("i_", "c_") and not f.startswith("c_a")}
print("media sin usar:", sorted(media - used))

TRS = ["swipeL", "cut", "up", "swipeR", "wipe", "cut", "down", "zoom"]
def seg_of(b, a, tr):
    k, x = b["base"].split(":", 1) if ":" in b["base"] else (b["base"], None)
    g = {"a": round(a, 2), "tr": tr}
    if k == "img":
        g.update(k="img", id=x); h = sum(map(ord, x)) % 4
        g["z"] = [[1.03, 1.14], [1.14, 1.03], [1.05, 1.12], [1.04, 1.16]][h]; g["ox"] = [0, -30, 30, 0][h]; g["oy"] = [0, 10, -10, -20][h]
    elif k == "w": g.update(k="w", view=x)
    else: g.update(k="bk")
    return g

segs = []
for n, b in enumerate(BEATS):
    tr = b["tr"] or TRS[n % len(TRS)]
    g = seg_of(b, b["a"], tr)
    if g["k"] == "w" and tr == "portal" and segs and segs[-1]["k"] == "w": g["tr"] = "cut"
    segs.append(g)
segs[0]["a"] = 0.0
# el avatar pisa sus ventanas; al salir vuelve lo que corresponda (si era una foto ya empezada → el mundo)
for w in AVW:
    ms, me = w["ms"], w["me"]
    before = [g for g in segs if g["a"] <= me]
    active = before[-1] if before else segs[0]
    segs = [g for g in segs if not (ms <= g["a"] < me)]
    segs.append({"a": round(ms, 2), "k": "av", "tr": "zoom" if len(segs) % 2 else "iris"})
    nxt = [g for g in segs if g["a"] >= me]
    if not nxt or nxt[0]["a"] - me > 0.8:
        r = dict(active); r["a"] = round(me, 2); r["tr"] = "swipeL"
        if r["k"] == "img" and active["a"] < ms: r = {"a": round(me, 2), "k": "w", "view": "wide", "tr": "portal"}
        segs.append(r)
    segs.sort(key=lambda g: g["a"])
segs.sort(key=lambda g: g["a"])
out = []
for g in segs:  # sin planos de menos de 1,2 s (se come el más corto)
    if out and g["a"] - out[-1]["a"] < 1.2 and out[-1]["k"] != "av" and g["k"] != "av": out[-1] = g; continue
    out.append(g)
segs = out

# ---------------- nada más de ~4 s sin cambio visual ----------------
clips = sorted(f[2:-4] for f in os.listdir(PUB) if f.startswith("c_") and f.endswith(".mp4"))
cl = {c: round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + "c_" + c + ".mp4"]).decode()), 2) for c in clips}
SIB = {"wide": ["furn", "sewing", "stairs"], "furn": ["burner", "flue"], "burner": ["furn", "flue"], "flue": ["furn", "wide"], "switch": ["stairs", "furn"],
       "stairs": ["switch", "wide"], "panel": ["stairs", "wide"], "outlet": ["strip", "heater"], "strip": ["outlet", "heater"], "heater": ["sewing", "strip"],
       "sewing": ["heater", "outlet"], "thermo": ["furn", "wide"], "bench": ["window", "wide"], "window": ["bench", "furn"], "yard": ["hp", "hptop"],
       "hp": ["hpclose", "hptop"], "hpclose": ["hp", "hptop"], "hptop": ["hpclose", "hp"], "meter": ["hp", "yard"]}
nxt_world = ["wide", "furn", "sewing", "bench", "stairs", "thermo"]
for _ in range(6):
    add = []
    for i, g in enumerate(segs):
        b = segs[i + 1]["a"] if i + 1 < len(segs) else END
        d = b - g["a"]
        if g["k"] == "av": continue
        if g["k"] == "img":
            lim = (cl.get(g["id"], 3.2) + 0.6) if g["id"] in cl else 4.2
            if g["id"] in cl and g["id"].startswith("l"): lim = min(cl[g["id"]], 12.5)
            if d > lim + 0.3:
                v = nxt_world[int(g["a"]) % len(nxt_world)]
                add.append({"a": round(g["a"] + lim, 2), "k": "w", "view": v, "tr": "portal"})
        elif g["k"] == "w" and d > 4.4:
            v = SIB.get(g.get("view", "wide"), ["wide"])[int(g["a"]) % 2 if len(SIB.get(g.get("view", "wide"), [])) > 1 else 0]
            add.append({"a": round(g["a"] + min(3.6, d / 2), 2), "k": "w", "view": v, "tr": "cut"})
    if not add: break
    segs = sorted(segs + add, key=lambda g: g["a"])

# ---------------- cámara: llaves por plano del mundo (empuje lento; mundo→mundo = movimiento continuo) ----------------
def push(v, k=0.1):
    p, l, f = V[v]; return [round(p[i] + (l[i] - p[i]) * k, 3) for i in range(3)], l, f
keys = []
for i, g in enumerate(segs):
    if g["k"] not in ("w", "bk"): continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    v = g.get("view", "wide")
    prev = segs[i - 1] if i else None
    if prev is not None and prev["k"] == "w" and g["k"] == "w" and keys and g["tr"] != "cut":
        keys.append({"t": g["a"], "p": keys[-1]["p"], "l": keys[-1]["l"], "fov": keys[-1]["fov"]})
        p, l, f = V[v]; keys.append({"t": round(g["a"] + 1.4, 2), "p": p, "l": l, "fov": f, "arc": 0.05})
    else:
        p, l, f = V[v]; keys.append({"t": round(max(0, g["a"] - 0.02), 2), "p": p, "l": l, "fov": f})
    p2, l2, f2 = push(v, 0.12 if b - g["a"] < 8 else 0.22)
    keys.append({"t": round(b, 2), "p": p2, "l": l2, "fov": f2})
    if g["k"] == "w" and v in PTV: g["pt"] = PTV[v]
keys.sort(key=lambda k: k["t"])
ded = []
for k in keys:
    if ded and k["t"] <= ded[-1]["t"]: k["t"] = round(ded[-1]["t"] + 0.01, 2)
    ded.append(k)

# ---------------- piezas: tag con pt sólo sobre el mundo; "at" de listas → segundos ----------------
def base_at(t):
    g = [x for x in segs if x["a"] <= t]; return g[-1] if g else segs[0]
ov = []
for o in OVS:
    if o["k"] == "tag" and "pt" in o and base_at(o["a"] + 0.4)["k"] != "w": continue
    for lk in ("items", "rows", "vals", "marks", "steps", "pins", "bars"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for j, it in enumerate(o[lk]):
                a = at(it["at"]) if isinstance(it["at"], str) else it["at"]
                it["at"] = a if a is not None else round(o["a"] + 0.4 + 0.5 * j, 2)
            for it in o[lk]:
                if isinstance(it.get("xAt"), str): it["xAt"] = at(it["xAt"]) or it["at"] + 1
    for kk in ("hlAt", "xAt", "totalAt", "pageAt", "qrAt"):
        if isinstance(o.get(kk), str): o[kk] = at(o[kk]) or o["a"] + 2
    if "from_" in o: o["from"] = o.pop("from_")
    if o["k"] == "routine": o.setdefault("hl", -1)
    ov.append(o)
ov.sort(key=lambda o: o["a"])

ev = {k: sorted(v) for k, v in EVR.items()}
for k, v in KFS.items(): ev[k] = sorted(v)
ev["ws"] = sorted(WSS, key=lambda x: x["a"])
ev.update(EXTRA)
reel = os.path.exists(PUB + "reel0.mp4")
rl = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + "reel0.mp4"]).decode()) if reel else 0
json.dump(segs, open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "clips": clips, "clipLen": cl, "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"], "id": g.get("id") or g.get("view")} for i, g in enumerate(segs)]
json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))
json.dump(sorted(SND, key=lambda x: x["t"]), open(f"D:/rtmp_{SL}/snd.json", "w", encoding="utf8"), indent=0)

# ---------------- plan minuto a minuto (para revisar) ----------------
def mmss(t): return f"{int(t // 60):02d}:{t % 60:04.1f}"
ws_ = [(w, i) for i, w in enumerate(TS)]
def frase(a, b):
    return " ".join(W[i][1] for i in range(len(TS)) if a <= TS[i] < b)[:90]
lines = [f"# {SL} · plan segundo a segundo (mm:ss-mm:ss · frase · plano · componente · sonido)\n"]
for sh in shots:
    comp = ", ".join(o["k"] for o in ov if sh["a"] <= o["a"] < sh["b"])
    snd = ", ".join(os.path.basename(x["f"]) for x in SND if sh["a"] <= x["t"] < sh["b"])
    lines.append(f"{mmss(sh['a'])}-{mmss(sh['b'])} · {frase(sh['a'], sh['b'])} · {sh['k']}:{sh['id']} · {comp or '-'} · {snd or 'voz'}")
open(f"D:/rtmp/{SL}_PLAN_MxM.md", "w", encoding="utf8").write("\n".join(lines) + "\n")

# ---------------- medición ----------------
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "w", "img", "bk")}
gap, last = 0, 0
for g, d in zip(segs, dur):
    if g["k"] == "av": last = g["a"] + d
    else: gap = max(gap, g["a"] + d - last)
nclip = sum(1 for g in segs if g["k"] == "img" and g["id"] in cl)
print(f"END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · {tot} · av {100*tot['av']/END:.0f}% · hueco máx sin avatar {gap:.1f}s")
print(f"piezas {len(ov)} · eventos {sum(len(v) for v in EVR.values())} · llaves {len(ded)} · clips en pantalla {nclip} · reel {reel} · sonidos {len(SND)}")
long_ = [(round(g['a']), round(d, 1), g['k'], g.get('id') or g.get('view')) for g, d in zip(segs, dur) if d > 4.6 and g['k'] != 'av' and not (g['k'] == 'img' and g['id'] in cl)]
print("planos >4,6 s sin clip:", long_[:20], len(long_))
print("SIN ANCLAR:", miss if miss else "ninguna")
