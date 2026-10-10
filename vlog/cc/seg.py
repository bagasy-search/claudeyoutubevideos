# Tramos del máster para CLAUDIO COCINA (VLOG CONTINUO mixto). Lee vlog/<slug>/tomas.json {"paras": [[tag, kind, escena], …]} (1 por párrafo)
# kind: vl = Claudio hablando (agnes reference ancla→ancla) · st = stock real (voz en off) · kf = detalle de comida keyframe con sonido real
#       cmp = componente a pantalla completa · av = avatar InfiniteTalk (apertura y CTA).
# Corridas = párrafos seguidos con el mismo (kind, escena). Los tramos TILEAN el máster sin huecos; cada corte cae en una pausa entre
# palabras, pegado (~0,08 s) al inicio de la palabra siguiente (arranca hablando, la pausa queda al final con la boca cerrada).
#   vl: minuto 1 → 3,9-5,85 s; resto → 9,6-11,85 s (T = ceil(d+0,15), relleno chico: agnes no repite la frase)
#   st: tomas de 3-6,5 s (cambia de plano en fin de frase/coma) · kf/cmp/av: un tramo por párrafo.
#   SLUG=ccfrijoles python vlog/cc/seg.py → vlog/<slug>/segs.json
import json, re, math, os, subprocess
S = os.environ["SLUG"]; R = os.environ.get("R") or os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"
D = R + f"vlog/{S}/"
WM = json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))
paras = [l for l in open(R + f"guiones/{S}.txt", encoding="utf8").read().split("\n") if l.strip()]
TOM = json.load(open(D + "tomas.json", encoding="utf8"))["paras"]; assert len(TOM) == len(paras), (len(TOM), len(paras))
pidx = [i for i, p in enumerate(paras) for _ in re.findall(r"\S+", p)]; assert len(pidx) == len(WM), (len(pidx), len(WM))
TOT = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", R + f"public/{S}.wav"], capture_output=True, text=True).stdout)
cands = []
for i in range(len(WM) - 1):
    e, s = WM[i]["e"], WM[i + 1]["s"]; newp = pidx[i] != pidx[i + 1]
    if s - e < 0.06 and not newp: continue
    cut = max(e + 0.03, s - 0.08) if s - e >= 0.06 else (e + s) / 2
    cands.append({"i": i, "t": cut, "gap": s - e, "sent": bool(re.search(r"[.!?]$", WM[i]["w"])), "comma": bool(re.search(r"[,:;]$", WM[i]["w"])), "newpara": newp})
run_of = lambda p: (TOM[p][1], TOM[p][2])
# fronteras: entre corridas (vl/st) y entre párrafos (kf/cmp/av)
bounds, runs = [0.0], [(run_of(0), 0)]
for c in cands:
    if not c["newpara"]: continue
    a, b = pidx[c["i"]], pidx[c["i"] + 1]
    if run_of(a) != run_of(b) or run_of(b)[0] in ("kf", "cmp", "av"): bounds.append(c["t"]); runs.append((run_of(b), b))
bounds.append(TOT)
pad = lambda d: math.ceil(d + 0.15) - d
def split(a, b, lo, hi, mn, wpad):
    out, t = [], a; inner = [c for c in cands if a + 0.5 < c["t"] < b - 0.5]
    def sc(c, d): return (0 if c["sent"] else (3 if c["comma"] else 8)) + (0 if lo <= d <= hi else 6 + abs(d - (lo + hi) / 2)) + wpad * pad(d) + (0 if c["gap"] > 0.18 else 2)
    while b - t > hi:
        opts = [c for c in inner if mn <= c["t"] - t <= min(hi + 0.6, 11.85) and b - c["t"] >= mn] or [c for c in inner if mn <= c["t"] - t <= 11.85 and b - c["t"] >= mn]
        if not opts: break
        best = min(opts, key=lambda c: sc(c, c["t"] - t)); out.append([t, best["t"]]); t = best["t"]
    if b - t < mn and out:  # cola corta: repartir con el anterior
        t0 = out[-1][0]; opts = [c for c in inner if mn <= c["t"] - t0 and b - c["t"] >= mn]
        if opts: best = min(opts, key=lambda c: abs((c["t"] - t0) - (b - c["t"])) + (0 if c["sent"] else 2)); out[-1][1] = best["t"]; t = best["t"]
        else: out[-1][1] = b; return out
    out.append([t, b]); return out
segs = []
for k, ((kind, sc), p0) in enumerate(runs):
    a, b = bounds[k], bounds[k + 1]
    if kind == "vl": parts = split(a, b, 3.9, 5.85, 3.9, 7) if a < 56 else split(a, b, 9.6, 11.85, 3.9, 7)
    elif kind == "st": parts = split(a, b, 3.2, 6.0, 2.6, 0)
    else: parts = [[a, b]]
    for s, e in parts: segs.append({"kind": kind, "sc": sc, "s": round(s, 3), "e": round(e, 3)})
n = {}
for x in segs:
    ws = [i for i in range(len(WM)) if x["s"] - 0.05 <= (WM[i]["s"] + WM[i]["e"]) / 2 < x["e"]]
    pre = {"vl": "c", "st": "s", "kf": "k", "cmp": "m", "av": "a"}[x["kind"]]; n[pre] = n.get(pre, 0) + 1
    x.update(id=f"{pre}{n[pre]:02d}", d=round(x["e"] - x["s"], 3), T=math.ceil(x["e"] - x["s"] + 0.15), tag=TOM[pidx[ws[0]]][0] if ws else "", text=" ".join(WM[i]["w"] for i in ws))
json.dump(segs, open(D + "segs.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for x in segs: print(x["id"], x["sc"].ljust(12), f'{x["s"]:7.2f} {x["d"]:5.2f}s', "|", x["text"][:100])
vl = [x for x in segs if x["kind"] == "vl"]
print("tramos", len(segs), "· vl", len(vl), "· st", sum(x["kind"] == "st" for x in segs), "· kf", sum(x["kind"] == "kf" for x in segs), "· vl<3.9", [x["id"] for x in vl if x["d"] < 3.9],
      "· vl>11.85", [x["id"] for x in vl if x["d"] > 11.85], "· kf>12", [x["id"] for x in segs if x["kind"] == "kf" and x["d"] > 12], "· tilea", abs(sum(x["d"] for x in segs) - TOT) < 0.01)
