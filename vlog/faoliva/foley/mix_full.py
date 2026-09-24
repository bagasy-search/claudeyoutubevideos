# Mezcla final del video entero: voz (audio del mp4 de entrega) + efectos por acción + ambiente por escena.
# La línea de tiempo sale de timeline_faoliva.gen.ts (segmentos de escena con startFrom) → cero re-render.
#   python mix_full.py [EV_DB=-10] [AMB_LUFS=-44]
import json, re, subprocess, sys, numpy as np, soundfile as sf
sys.path.insert(0, "."); from soundmap import FULL, GATE, SCENE_AMB
W = "D:/Proyectos/video2-wt/faoliva/"; B = W + "vlog/faoliva/"; F = B + "foley/"
FIN = "D:/videosdeclaude/faoliva_entrega.mp4"; SR = 48000; FPS = 30
EV_DB = float(sys.argv[1]) if len(sys.argv) > 1 else -10.0
AMB_LUFS = float(sys.argv[2]) if len(sys.argv) > 2 else -44.0

def ff(*a): subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)
def load(p):
    ff("-i", p, "-af", "highpass=f=120", "-ac", "1", "-ar", str(SR), F + "_tmp.wav")
    return sf.read(F + "_tmp.wav", dtype="float32")[0]
def gate(x):
    w = int(0.02 * SR); e = np.sqrt(np.convolve(x * x, np.ones(w) / w, "same") + 1e-12)
    db = 20 * np.log10(e); thr = max(np.percentile(db, 60) + 9, db.max() - 20)
    m = (db > thr).astype(np.float32); a = int(0.004 * SR); r = int(0.18 * SR); out = np.zeros_like(m); g = 0.0
    for i in range(0, len(m), 48):
        tgt = m[i:i + 48].max(); g = min(1, g + 48 / a) if tgt > g else max(tgt, g - 48 / r); out[i:i + 48] = g
    return x * out
def src(cid):
    return F + (f"out_full/{cid}.flac" if cid in FULL else f"out_gate/{cid}.flac")
def ambient(kind, L):
    base = f"out_amb/{kind}"
    parts = [load(F + f"{base}{i}.flac")[: 8 * SR] for i in range(1, 7)]
    xf = int(1.5 * SR); a = parts[0]; k = 1
    while len(a) < L:
        p = parts[k % 6]; k += 1
        a = np.concatenate([a[:-xf], a[-xf:] * np.linspace(1, 0, xf) + p[:xf] * np.linspace(0, 1, xf), p[xf:]])
    a = a[:L]; sf.write(F + "_amb_raw.wav", a, SR)
    ff("-i", F + "_amb_raw.wav", "-af", f"loudnorm=I={AMB_LUFS}:TP=-9:LRA=7", "-ar", str(SR), F + "_amb_n.wav")
    return sf.read(F + "_amb_n.wav", dtype="float32")[0][:L]

# 1) pistas por escena (tiempo de escena)
EV, AM, n_ev = {}, {}, 0
for s in [f"S{i}" for i in range(1, 12)]:
    plan = json.load(open(B + f"plan_{s}.json", encoding="utf-8")); st = json.load(open(B + f"{s}/clips/state.json", encoding="utf-8"))
    T = [st[c["id"]]["T"] for c in plan["clips"]]; L = int((sum(T) + 2) * SR)
    ev = np.zeros(L, np.float32); off = 0.0; fd = int(0.05 * SR)
    for c, t in zip(plan["clips"], T):
        cid = c["id"]
        if cid in FULL or cid in GATE:
            x = load(src(cid))[: int(t * SR)]
            if cid in GATE: x = gate(x)
            x = x / (np.abs(x).max() + 1e-9) * (0.9 if cid in FULL else 1.0)
            if cid in ("s5_11", "s5_12", "s5_13", "s1_09", "s4_10", "s7_04"): x *= 0.55     # agua continua: más baja
            env = np.ones(len(x), np.float32); env[:fd] = np.linspace(0, 1, fd); env[-fd:] = np.linspace(1, 0, fd)
            i0 = int(off * SR); ev[i0:i0 + len(x)] += x * env; n_ev += 1
        off += t
    EV[s] = ev; AM[s] = ambient(SCENE_AMB[s], L)
    print(f"{s}: {sum(T)} s de escena")
print(f"MEDIDO: {n_ev} clips con efecto de {len(FULL) + len(GATE)} en el mapa")
if n_ev != len(FULL) + len(GATE): sys.exit("faltan efectos")

# 2) línea de tiempo del final
tl = open(W + "src/faoliva/timeline_faoliva.gen.ts", encoding="utf-8").read()
TOTAL = int(re.search(r"TOTAL_FRAMES_FAOLIVA = (\d+)", tl).group(1))
TL = json.loads(re.search(r"export const TL[^=]*= (\[.*?\]);", tl, re.S).group(1))
N = int(TOTAL / FPS * SR) + SR
ev_f = np.zeros(N, np.float32); am_f = np.zeros(N, np.float32)
last_scene = None
for seg in TL:
    a0 = int(seg["from"] / FPS * SR); n = int(seg["dur"] / FPS * SR)
    if seg["kind"] == "vid":
        s = re.search(r"(S\d+)\.mp4", seg["src"]).group(1); last_scene = s
        s0 = int((seg.get("startFrom") or 0) / FPS * SR)
        e = EV[s][s0:s0 + n]; m = AM[s][s0:s0 + n]
        ev_f[a0:a0 + len(e)] += e; am_f[a0:a0 + len(m)] += m
    elif seg["kind"] == "lam":                                # lámina: sigue el ambiente del living, sin efectos
        m = AM["S3"][: n] if len(AM["S3"]) >= n else np.resize(AM["S3"], n)
        am_f[a0:a0 + n] += m
# fundidos cortos del ambiente en cada corte de escena (evita clics)
for seg in TL:
    if seg["kind"] == "qr": continue
    a0 = int(seg["from"] / FPS * SR); k = int(0.04 * SR)
    am_f[a0:a0 + k] *= np.linspace(0, 1, k)
sf.write(F + "_full_ev.wav", ev_f, SR); sf.write(F + "_full_amb.wav", am_f, SR)

# 3) voz = audio del mp4 de entrega (máster + Carmen) · mezcla · −16 LUFS
ff("-i", FIN, "-vn", "-ac", "1", "-ar", str(SR), F + "_full_voz.wav")
vpk = float(np.abs(sf.read(F + "_full_voz.wav", dtype="float32")[0]).max())
gain = vpk * 10 ** (EV_DB / 20)
ff("-i", F + "_full_voz.wav", "-i", F + "_full_ev.wav", "-i", F + "_full_amb.wav", "-filter_complex",
   f"[1:a]volume={gain:.4f}[e];[0:a][e][2:a]amix=inputs=3:duration=first:normalize=0,"
   "loudnorm=I=-16:TP=-1.5:LRA=11,aformat=channel_layouts=stereo[a]", "-map", "[a]", "-ar", "48000", F + "_full_mix.wav")
# 4) mp4 nuevo: video de la entrega COPIADO (no se re-encodea) + audio nuevo
out = "D:/videosdeclaude/faoliva_entrega_sfx.mp4"
ff("-i", FIN, "-i", F + "_full_mix.wav", "-map", "0:v", "-map", "1:a", "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
   "-ar", "48000", "-shortest", "-movflags", "+faststart", out)
print("OK", out)
