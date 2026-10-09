# Tramos de voz para los clips agnes del VLOG CONTINUO (furatones5).
# Escenas visuales = párrafos seguidos con el mismo lugar (scenes.json: {"orden": [[escena, [tags…]], …]}).
# Los tramos TILEAN el máster sin huecos: cada corte cae en una pausa entre palabras, pegado (~0,08 s) al inicio de la
# palabra siguiente → cada tramo arranca hablando y la pausa natural queda al final (boca cerrada).
# Largo: minuto 1 → 4-5,5 s; resto → 10,5-11,8 s. Se penaliza el relleno hasta el segundo entero (T = ceil(d+0,15)):
# ⛔ relleno grande = agnes REPITE la última frase.  python vlog/furatones5/seg.py  → vlog/furatones5/segs.json
import json, re, math, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"
WM = json.load(open(R + "_v3/furatones5_wordms.json", encoding="utf8"))
paras = [l for l in open(R + "guiones/furatones5.txt", encoding="utf8").read().split("\n") if l.strip()]
fil = [l for l in open(R + "guiones/furatones5_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
tags = [re.match(r"\[([^\]]*)\]", l).group(1) for l in fil]
pidx = [i for i, p in enumerate(paras) for _ in re.findall(r"\S+", p)]; assert len(pidx) == len(WM)
SC = json.load(open(D + "scenes.json", encoding="utf8"))["orden"]
tag2sc = {t: sc for sc, ts in SC for t in ts}; assert set(tag2sc) == set(tags), set(tags) ^ set(tag2sc)
SR = 16000
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", R + "public/furatones5.wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
TOT = len(x) / SR
# cortes candidatos: entre palabra i y i+1
cands = []
for i in range(len(WM) - 1):
    e, s = WM[i]["e"], WM[i + 1]["s"]
    newp = pidx[i] != pidx[i + 1]
    if s - e < 0.06 and not newp: continue
    cut = max(e + 0.03, s - 0.08) if s - e >= 0.06 else (e + s) / 2
    end_sent = bool(re.search(r"[.!?]$", WM[i]["w"])); comma = bool(re.search(r"[,:;]$", WM[i]["w"]))
    cands.append({"i": i, "t": cut, "gap": s - e, "sent": end_sent, "comma": comma, "newpara": pidx[i] != pidx[i + 1]})
def scene_of_word(i): return tag2sc[tags[pidx[i]]]
# fronteras de escena
bounds = [0.0]; order = [scene_of_word(0)]
for c in cands:
    if c["newpara"] and scene_of_word(c["i"]) != scene_of_word(c["i"] + 1): bounds.append(c["t"]); order.append(scene_of_word(c["i"] + 1))
bounds.append(TOT)
def pad(d): return math.ceil(d + 0.15) - d
def score(c, d, lo, hi):
    s = 0 if c["sent"] else (3 if c["comma"] else 8)
    s += 0 if lo <= d <= hi else 6 + abs(d - (lo + hi) / 2)
    s += 7 * pad(d) + (0 if c["gap"] > 0.18 else 2)
    return s
segs = []
for k, sc in enumerate(order):
    a, b = bounds[k], bounds[k + 1]; t = a; inner = [c for c in cands if a + 0.5 < c["t"] < b - 0.5]
    while b - t > (5.85 if t < 56 else 11.85):
        m1 = t < 56
        lo, hi = (3.9, 5.85) if m1 else (9.6, 11.85)
        opts = [c for c in inner if 3.9 <= c["t"] - t <= (6.5 if m1 else 11.85) and b - c["t"] >= 3.9]
        if not opts: opts = [c for c in inner if 3.9 <= c["t"] - t <= 11.85 and b - c["t"] >= 3.9]
        if not opts and b - t <= 11.85: break
        if not opts: raise SystemExit(f"⛔ sin corte en {sc} desde {t:.2f}")
        best = min(opts, key=lambda c: score(c, c["t"] - t, lo, hi))
        segs.append({"sc": sc, "s": round(t, 3), "e": round(best["t"], 3)}); t = best["t"]
    if b - t < 3.9 and segs and segs[-1]["sc"] == sc:  # cola corta: repartir con el anterior
        t0 = segs[-1]["s"]; opts = [c for c in inner if 3.9 <= c["t"] - t0 and b - c["t"] >= 3.9]
        if opts: best = min(opts, key=lambda c: abs((c["t"] - t0) - (b - c["t"])) + 2 * pad(c["t"] - t0) + 2 * pad(b - c["t"]) + (0 if c["sent"] else 2)); segs[-1]["e"] = round(best["t"], 3); t = best["t"]
    segs.append({"sc": sc, "s": round(t, 3), "e": round(b, 3)})
for n, s in enumerate(segs):
    ws = [WM[i]["w"] for i in range(len(WM)) if s["s"] - 0.05 <= (WM[i]["s"] + WM[i]["e"]) / 2 < s["e"]]
    s.update(id=f"c{n + 1:02d}", d=round(s["e"] - s["s"], 3), T=math.ceil(s["e"] - s["s"] + 0.15), text=" ".join(ws))
    s["pad"] = round(s["T"] - s["d"], 2)
json.dump(segs, open(D + "segs.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
for s in segs: print(s["id"], s["sc"], f'{s["s"]:7.2f} {s["d"]:5.2f}s T{s["T"]} pad {s["pad"]:.2f}', "|", s["text"][:110])
print("clips", len(segs), "· min1", sum(1 for s in segs if s["s"] < 60), "· d<4", [s["id"] for s in segs if s["d"] < 3.9], "· >11.85", [s["id"] for s in segs if s["d"] > 11.85],
      "· pad>0.6", [s["id"] for s in segs if s["pad"] > 0.6], "· total", round(sum(s["d"] for s in segs), 2), "/", round(TOT, 2))
