# Arma public/vid/fumoscasf/vlog.mp4: la voz en off manda; cada tramo entre pausas de la voz lleva 1+ clip agnes-v2.0 (121 cuadros = 4,033 s),
# recortado por NÚMERO de cuadro para que el total sea EXACTO (round(T*30) cuadros). Minuto 1 → tramos de ~2,0 s para pasar el gate de ≥30 cortes.
#   python vlog/fumoscasf/mkvlog.py            (dry: escribe planos.json)
#   python vlog/fumoscasf/mkvlog.py --armar    (además arma el mp4)
import json, re, math, subprocess, os, sys
R = "D:/Proyectos/video2-wt/fumoscasf/"; D = R + "vlog/fumoscasf/"; FPS = 30; CLIPF = 121
ARMAR = "--armar" in sys.argv
WM = json.load(open(R + "_v3/fumoscasf_wordms.json", encoding="utf8"))
C = json.load(open(D + "cortes.json"))
def mapear(t):
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
fil = [l for l in open(R + "guiones/fumoscasf_filmado.txt", encoding="utf8").read().split("\n") if l.strip()]
secs_par = [re.match(r"\[([^|]+)\|", l).group(1) for l in fil]
paras = [l for l in open(R + "guiones/fumoscasf.txt", encoding="utf8").read().split("\n") if l.strip()]
pidx = [i for i, p in enumerate(paras) for _ in re.findall(r"\S+", p)]
assert len(pidx) == len(WM), (len(pidx), len(WM))
sec_pal = [secs_par[i] for i in pidx]
dur_audio = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", R + "public/fumoscasf_raw.wav"], capture_output=True, text=True).stdout)
T = mapear(dur_audio)
# gaps (en tiempo recortado) y secciones, en orden
gaps, wsec = [], []
for i in range(len(WM)):
    wsec.append(sec_pal[i])
    if i and sec_pal[i] != sec_pal[i - 1]: continue
    if i + 1 < len(WM):
        a, b = mapear(WM[i]["e"]), mapear(WM[i + 1]["s"])
        if b - a > 0.05 and sec_pal[i + 1] == sec_pal[i]: gaps.append(((a + b) / 2, a, b))
# tramos: primero corto por cambio de sección, después por objetivo de duración
bounds = [0.0]
for i in range(1, len(WM)):
    if sec_pal[i] != sec_pal[i - 1]: bounds.append((mapear(WM[i - 1]["e"]) + mapear(WM[i]["s"])) / 2)
bounds.append(T)
def objetivo(t): return 1.95 if t < 60 else 4.033
segs = []
for k in range(len(bounds) - 1):
    A, B, t = bounds[k], bounds[k + 1], bounds[k]
    if B - t < 0.4: continue  # sección pegada a la anterior: se une
    while B - t > objetivo(t) * 1.25:
        want = t + objetivo(t)
        op = [g for g in gaps if abs(g[0] - want) <= 0.35 and t + objetivo(t) * 0.5 <= g[0] <= B - 0.35]
        c = min(op, key=lambda g: abs(g[0] - want))[0] if op else want
        if c - t < 0.9 or B - c < 0.9: break
        segs.append({"a": t, "b": c}); t = c
    segs.append({"a": t, "b": B})
for s in segs: s["fa"] = max(0, round(s["a"] * FPS)); s["fb"] = round(s["b"] * FPS); s["n"] = s["fb"] - s["fa"]
_keep = [(C[i - 1][1] if i else 0.0, C[i][0]) for i in range(len(C))]
_keep.append((C[-1][1], dur_audio))
_keep = [(a, b) for a, b in _keep if b > a]
TF = sum(round(b * 30) - round(a * 30) for a, b in _keep)  # = frames conservados por cut.py (audio y video cierran igual)
if segs[-1]["fb"] != TF: segs[-1]["fb"] = TF; segs[-1]["n"] = segs[-1]["fb"] - segs[-1]["fa"]
assert all(s["n"] > 0 for s in segs), [s for s in segs if s["n"] <= 0]
# planos por sección (del filmado: el orden de secciones es el del guion)
orden, seen = [], set()
for s in wsec:
    if s not in seen: seen.add(s); orden.append(s)
BE = json.load(open(R + "_v3/fumoscasf_beats.json", encoding="utf8"))
porsec = {}
for b in BE: porsec.setdefault(b["sec"], []).append(b["id"])
for s in orden: assert s in porsec, s
CLIPDIR = R + "public/broll/fumoscasf"
def clip_path(i):
    for c in (f"{i}.mp4", f"{i}.webm", f"{i}_v2.0.mp4"):
        if os.path.exists(CLIPDIR + "/" + c): return CLIPDIR + "/" + c
    return None
k = {s: 0 for s in orden}
planos, faltan = [], set()
for s in segs:
    ls = [wsec[i] for i in range(len(wsec)) if s["fa"] / FPS <= mapear(WM[i]["s"]) < s["fb"] / FPS] or [wsec[0]]
    sec = ls[0]
    lst = porsec[sec]
    usados, resto = [], s["n"]
    while resto > 0:
        nom = lst[k[sec] % len(lst)]; k[sec] += 1
        n = min(CLIPF, resto)
        usados.append({"id": nom, "n": n}); resto -= n
    for u in usados:
        if clip_path(u["id"]) is None: faltan.add(u["id"])
    s["sec"] = sec; s["planos"] = usados
json.dump(segs, open(D + "planos.json", "w"), ensure_ascii=False, indent=0)
# registro de repetición que exige el farm (scripts/agnes_qc_gate.mjs): 1 entrada por plano usado,
# con el clip REAL del que sale cada tramo. Así agnes_qc mide "clips usados en más de un plano".
json.dump([{"key": u["id"], "src": f"broll/fumoscasf/{u['id']}.mp4", "start": 0, "dur": round(u["n"] / FPS, 4)}
           for s in segs for u in s["planos"]], open(R + "_v3/fumoscasf_cues.json", "w"), ensure_ascii=False, indent=0)
print(f"tramos {len(segs)} · cuadros {TF} = {TF / FPS:.2f} s · minuto 1: {sum(1 for s in segs if s['a'] < 60)} cortes")
if faltan: print("⛔ FALTAN CLIPS:", len(faltan), sorted(faltan)[:12]); sys.exit(1)
print("clips usados", sum(len(s["planos"]) for s in segs), "· distintos", len({u['id'] for s in segs for u in s['planos']}))
from collections import Counter
print(dict(Counter(s["sec"] for s in segs)))
if not ARMAR: sys.exit(0)
# armar: por TROZOS de clips (un solo select con 237 términos revienta el parser de ffmpeg)
os.makedirs(D + "all", exist_ok=True)
os.makedirs(R + "public/vid/fumoscasf", exist_ok=True)
usados = [(clip_path(u["id"]), u["n"]) for s in segs for u in s["planos"]]
GRP = 40
partes = []
for k in range(0, len(usados), GRP):
    tro = usados[k:k + GRP]
    with open(D + f"all/_c{k:03d}.txt", "w") as f:
        for p, n in tro: f.write(f"file '{p}'\n")
    # ⛔ 9-oct: `n` del select es el cuadro del CONCATENADO, y cada clip mide CLIPF cuadros. Antes se acumulaba
    # con el largo del TROZO (n), así que los rangos quedaban PEGADOS (0-55, 56-114, 115-173…) y el filtro
    # devolvía los primeros sum(n) cuadros tal cual: clips enteros de 121 pegados, cortes cada 4,033 s.
    # Hay que llevar DOS contadores: `pos` = cuadros de salida (para -frames:v) y `base` = cuadro del clip.
    sel, pos, base = [], 0, 0
    for p, n in tro:
        sel.append(f"between(n,{base},{base + n - 1})"); pos += n; base += CLIPF
    open(D + f"all/_s{k:03d}.txt", "w").write(f"select='{'+'.join(sel)}',setpts=N/({FPS}*TB),tpad=stop_mode=clone:stop=-1")
    pr = D + f"all/_p{k:03d}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", D + f"all/_c{k:03d}.txt", "-an", "-/vf", D + f"all/_s{k:03d}.txt",
                    "-fps_mode", "passthrough", "-frames:v", str(pos), "-c:v", "libx264", "-crf", "17", "-preset", "medium", "-bf", "0",
                    "-pix_fmt", "yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", pr], check=True)
    partes.append(pr)
with open(D + "all/_partes.txt", "w") as f:
    for pr in partes: f.write(f"file '{pr}'\n")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", D + "all/_partes.txt", "-c", "copy", R + "public/vid/fumoscasf/vlog.mp4"], check=True)
nf = int(subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", R + "public/vid/fumoscasf/vlog.mp4"], capture_output=True, text=True).stdout)
print("vlog.mp4:", nf, "cuadros =", round(nf / FPS, 2), "s · esperado", TF, "· partes", len(partes))
assert nf == TF, "⛔ cuadros != esperado"
