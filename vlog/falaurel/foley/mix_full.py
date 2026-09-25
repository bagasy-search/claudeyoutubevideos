# falaurel — mezcla final: voz del vlog (public/falaurel_voz.wav) + efectos por acción + ambiente por escena.
# La línea de tiempo sale de vlog/falaurel/timeline.json (mktimeline.mjs).  python mix_full.py [EV_DB=-10] [AMB_LUFS=-44]
# Salida: public/falaurel_mix.wav (48k estéreo, -16 LUFS) — es el audio del render y de la entrega.
import json, os, re, subprocess, sys, numpy as np, soundfile as sf
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); from soundmap import GATE, SCENE_AMB
W = "D:/Proyectos/video2-wt/falaurel/"; B = W + "vlog/falaurel/"; F = B + "foley/"; SR = 48000; FPS = 30
EV_DB = float(sys.argv[1]) if len(sys.argv) > 1 else -10.0
AMB_LUFS = float(sys.argv[2]) if len(sys.argv) > 2 else -44.0
def ff(*a): subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)
def load(p, hp=120):
    ff("-i", p, "-af", f"highpass=f={hp}", "-ac", "1", "-ar", str(SR), F + "_tmp.wav")
    return sf.read(F + "_tmp.wav", dtype="float32")[0]
def gate(x):
    w = int(0.02 * SR); e = np.sqrt(np.convolve(x * x, np.ones(w) / w, "same") + 1e-12)
    db = 20 * np.log10(e); thr = max(np.percentile(db, 60) + 9, db.max() - 20)
    m = (db > thr).astype(np.float32); a = int(0.004 * SR); r = int(0.18 * SR); out = np.zeros_like(m); g = 0.0
    for i in range(0, len(m), 48):
        tgt = m[i:i + 48].max(); g = min(1, g + 48 / a) if tgt > g else max(tgt, g - 48 / r); out[i:i + 48] = g
    return x * out
def ambient(kind, L):
    parts = [load(F + f"out_amb/{kind}{i}.flac", 60)[: 8 * SR] for i in range(1, 7)]
    xf = int(1.5 * SR); a = parts[0]; k = 1
    while len(a) < L:
        p = parts[k % 6]; k += 1
        a = np.concatenate([a[:-xf], a[-xf:] * np.linspace(1, 0, xf) + p[:xf] * np.linspace(0, 1, xf), p[xf:]])
    a = a[:L]; sf.write(F + "_amb_raw.wav", a, SR)
    ff("-i", F + "_amb_raw.wav", "-af", f"loudnorm=I={AMB_LUFS}:TP=-9:LRA=7", "-ar", str(SR), F + "_amb_n.wav")
    return sf.read(F + "_amb_n.wav", dtype="float32")[0][:L]
def norm1(x, pk=1.0): return x / (np.abs(x).max() + 1e-9) * pk
fd = int(0.05 * SR)
def env(x):
    e = np.ones(len(x), np.float32); n = min(fd, len(x) // 2); e[:n] = np.linspace(0, 1, n); e[len(x) - n:] = np.linspace(1, 0, n); return x * e
# 1) pistas por escena (tiempo de escena)
EV, AM, n_ev, n_own = {}, {}, 0, 0
SKIP = [x for x in os.environ.get("SKIP", "").split(",") if x]   # PRUEBA sin escenas aún sin armar (nunca en el final)
SC = [x for x in SCENE_AMB if x not in SKIP]
for S in SC:
    plan = json.load(open(B + f"plan_{S}.json", encoding="utf-8")); st = json.load(open(B + f"{S}/clips/state.json", encoding="utf-8"))
    T = [st[c["id"]]["T"] for c in plan["clips"]]; L = int((sum(T) + 2) * SR)
    ev = np.zeros(L, np.float32); off = 0.0
    for c, t in zip(plan["clips"], T):
        cid = c["id"]; x = None
        if c.get("kf"):                                   # detalle: foley propio de agnes, entero
            x = norm1(load(B + f"{S}/clips/" + st[cid]["file"], 80)[: int(t * SR)], 0.8); n_own += 1
        elif cid in GATE and os.path.exists(F + f"out_gate/{cid}.flac"):
            x = norm1(gate(load(F + f"out_gate/{cid}.flac")[: int(t * SR)])); n_ev += 1
            if cid in ("s8_04", "s10_02", "s6_14"): x *= 0.55          # agua / líquido continuo: más bajo
        if x is not None:
            i0 = int(off * SR); ev[i0:i0 + len(x)] += env(x)
        off += t
    EV[S] = ev; AM[S] = ambient(SCENE_AMB[S], L)
print(f"MEDIDO: {n_own} detalles con foley propio · {n_ev} clips GATE de {len(GATE)} en el mapa")
n_gate = len([g for g in GATE if g.split("_")[0].upper() not in SKIP])
if n_ev < n_gate: sys.exit(f"faltan efectos GATE ({n_ev}/{n_gate})")
# 2) línea de tiempo del final
TLJ = json.load(open(B + "timeline.json", encoding="utf-8")); TOTAL = TLJ["TOTAL"]; TL = TLJ["TL"]
N = int(TOTAL / FPS * SR) + SR
ev_f = np.zeros(N, np.float32); am_f = np.zeros(N, np.float32)
TS = json.load(open(B + "T/clips/state.json", encoding="utf-8"))
for seg in TL:
    a0 = int(seg["from"] / FPS * SR); n = int(seg["dur"] / FPS * SR)
    if seg["kind"] == "vid":
        m = re.search(r"/(S\d+)\.mp4", seg["src"])
        if m:
            S = m.group(1); s0 = int((seg.get("startFrom") or 0) / FPS * SR)
            e = EV[S][s0:s0 + n]; a = AM[S][s0:s0 + n]
            ev_f[a0:a0 + len(e)] += e; am_f[a0:a0 + len(a)] += a
        else:                                             # corte del tráiler: su foley propio, un poco más bajo, + ambiente cocina
            tid = re.search(r"T_(t\d+)\.mp4", seg["src"]).group(1)
            x = load(B + "T/clips/" + TS[tid]["file"], 80); s0 = int((seg.get("startFrom") or 0) / FPS * SR)
            x = env(norm1(x[s0:s0 + n], 0.6)); ev_f[a0:a0 + len(x)] += x
            am_f[a0:a0 + n] += AM["S1" if "S1" in AM else SC[0]][:n]
    elif seg["kind"] == "lam":
        a = np.resize(AM["S4"], n); am_f[a0:a0 + n] += a
for seg in TL:
    if seg["kind"] in ("qr", "txt"): continue
    a0 = int(seg["from"] / FPS * SR); k = int(0.04 * SR); am_f[a0:a0 + k] *= np.linspace(0, 1, k)
sf.write(F + "_full_ev.wav", ev_f, SR); sf.write(F + "_full_amb.wav", am_f, SR)
# 3) voz del vlog + efectos (pico EV_DB bajo el pico de la voz) + ambiente · -16 LUFS · estéreo
ff("-i", W + "public/falaurel_voz.wav", "-ac", "1", "-ar", str(SR), F + "_full_voz.wav")
vpk = float(np.abs(sf.read(F + "_full_voz.wav", dtype="float32")[0]).max()); gain = vpk * 10 ** (EV_DB / 20)
ff("-i", F + "_full_voz.wav", "-i", F + "_full_ev.wav", "-i", F + "_full_amb.wav", "-filter_complex",
   f"[1:a]volume={gain:.4f}[e];[0:a][e][2:a]amix=inputs=3:duration=first:normalize=0,"
   "loudnorm=I=-16:TP=-1.5:LRA=11,aformat=channel_layouts=stereo[a]", "-map", "[a]", "-ar", "48000", W + "public/falaurel_mix.wav")
d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", W + "public/falaurel_mix.wav"], capture_output=True, text=True).stdout)
print("OK public/falaurel_mix.wav", round(d, 3), "s vs video", round(TOTAL / FPS, 3))
