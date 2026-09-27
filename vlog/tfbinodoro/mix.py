# tfbinodoro — MEZCLA FINAL capa por capa (lee vlog/tfbinodoro/timeline.json de mktimeline.mjs):
#  voz (máster Fish continuo + vecino = audio de las escenas armadas) · foley real de los planos keyframe · SFX del canal
#  (whoosh en cortes, impacto en revelaciones, riser antes del loop) · cama musical desde el seg ~6, -22 dB bajo la voz.
# Salida: public/tfbinodoro.m4a (48 kHz estéreo AAC) + out/tfbinodoro/mix.wav.  uso: python vlog/tfbinodoro/mix.py
import json, subprocess, numpy as np, os, random
R = "D:/Proyectos/video2-wt/tfbinodoro/"; SR = 48000
T = json.load(open(R + "vlog/tfbinodoro/timeline.json", encoding="utf-8"))
N = int(round(T["TOTAL"] / 30 * SR))
def load(f, ss=0.0, dur=None, rate=1.0):
    a = ["ffmpeg", "-v", "error", "-ss", f"{ss:.4f}"] + (["-t", f"{dur * rate + 0.05:.4f}"] if dur else []) + ["-i", f, "-vn", "-ac", "1", "-ar", str(SR)]
    if rate != 1.0: a += ["-af", f"atempo={max(0.5, rate):.4f}"]
    b = subprocess.run(a + ["-f", "f32le", "-"], capture_output=True).stdout
    x = np.frombuffer(b, np.float32).copy()
    return x[: int(dur * SR)] if dur else x
def put(buf, x, at, g=1.0):
    i = int(round(at * SR));
    if i < 0: x = x[-i:]; i = 0
    n = min(len(x), len(buf) - i)
    if n > 0: buf[i:i + n] += x[:n] * g
rms = lambda x: float(np.sqrt(np.mean(x ** 2)) + 1e-9)
db = lambda v: 10 ** (v / 20)
def fade(x, a=0.006, b=0.012):
    na, nb = int(a * SR), int(b * SR)
    if len(x) > na + nb: x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb)
    return x
voz = np.zeros(N, np.float32); fol = np.zeros(N, np.float32); fx = np.zeros(N, np.float32); mus = np.zeros(N, np.float32)
# 1) voz
for a in T["AUD"]:
    x = load(a["wav"], a["ss"], a["dur"]); put(voz, fade(x, 0.003, 0.003), a["at"])
vr = rms(voz[np.abs(voz) > 1e-4]) if np.any(voz) else 0.1
g = db(-18) / vr; voz *= g                                           # voz a -18 dBFS RMS (sobre lo hablado)
# 2) foley (T del tráiler fuerte cuando no hay voz; los de escena por debajo de la voz)
for f in T["FOLEY"]:
    src = f.get("wav") or f.get("mp4"); x = load(src, f["from"], f["dur"], f.get("rate", 1.0))
    if not len(x) or rms(x) < 1e-4: continue
    loud = f["t"] in ("t01", "t02")
    tgt = -15 if loud else (-30 if f.get("gain", 0.5) >= 0.5 else -32)
    x = fade(x * db(tgt) / rms(x), 0.01, 0.05); put(fol, x, f["at"])
# 3) SFX
L = R + "public/sfx/"
MAP = {"whoosh": [L + f"lib/whoosh_soft_{i}.mp3" for i in range(1, 9)], "whoosh_big": [L + "cp_whoosh.wav", L + "whoosh.mp3"],
       "impact": [L + "deep-cinematic-impact-1.mp3", L + "impacto_hit.mp3"], "hit": [L + "stinger_hit.mp3", L + "lib/impact_soft_1.mp3"],
       "pop": [L + f"lib/pop_soft_{i}.mp3" for i in range(1, 9)], "tick": [L + f"lib/tick_{i}.mp3" for i in range(1, 9)],
       "shimmer": [L + "lib/shimmer_1.mp3"], "riser": [L + "cp_riser.wav"], "sub": [L + "lib/sub_drop_1.mp3"], "paper": [L + "lib/page_flip_1.mp3"],
       "scan": [L + "lib/light_pass_1.mp3"], "flush": [L + "lib/pour_soft_1.mp3"], "draw": [L + "line_draw.mp3"], "freeze": [L + "lib/whoosh_reverse_1.mp3"]}
PEAK = {"whoosh": -20, "whoosh_big": -15, "impact": -9, "hit": -13, "pop": -19, "tick": -21, "shimmer": -18, "riser": -13, "sub": -12, "paper": -17, "scan": -19, "flush": -20, "draw": -19, "freeze": -16}
cache = {}; rnd = random.Random(7)
for s in T["SFX"]:
    f = rnd.choice(MAP[s["k"]]); x = cache.get(f)
    if x is None: x = load(f); cache[f] = x
    if not len(x): continue
    y = x * db(PEAK[s["k"]]) / (np.max(np.abs(x)) + 1e-9) * s.get("gain", 1.0)
    at = s["at"] - (3.2 if s["k"] == "riser" else 0)                # el riser TERMINA en la marca
    put(fx, y, at)
# 4) cama musical: entra en el seg 6 con fundido, loop con cruce, -22 dB bajo la voz; se apaga en la ficha y vuelve
m = load(L + "music_federer.mp3"); m = m / rms(m) * db(-18 - 22)
pos, start, cf = int(6.0 * SR), int(6.0 * SR), int(3 * SR)
while pos < N:
    seg = m.copy(); seg[:cf] *= np.linspace(0, 1, cf); seg[-cf:] *= np.linspace(1, 0, cf)
    put(mus, seg, pos / SR); pos += len(m) - cf
mus[start:start + int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR))
lam = [c for c in T["TL"] if c["kind"] == "lam"]
for c in lam:                                                         # durante la ficha, la música baja 6 dB más
    a, b = int(c["from"] / 30 * SR), int((c["from"] + c["dur"]) / 30 * SR); env = np.ones(N, np.float32)
    k = int(0.8 * SR); env[a:b] = db(-6); env[a - k:a] = np.linspace(1, db(-6), k); env[b:b + k] = np.linspace(db(-6), 1, k); mus *= env
mus[-int(3 * SR):] *= np.linspace(1, 0, int(3 * SR))
mix = voz + fol + fx + mus
pk = np.max(np.abs(mix)); print(f"pico antes del limitador {20*np.log10(pk):.1f} dBFS")
mix = np.tanh(mix / db(-1.5)) * db(-1.5)                              # limitador suave a -1,5 dBFS
os.makedirs(R + "out/tfbinodoro", exist_ok=True)
st = np.stack([mix, mix], 1).astype(np.float32)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", R + "out/tfbinodoro/mix.wav"], input=st.tobytes(), check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", R + "out/tfbinodoro/mix.wav", "-c:a", "aac", "-b:a", "192k", R + "public/tfbinodoro.m4a"], check=True)
print(f"mezcla {N/SR:.2f}s · voz rms {20*np.log10(rms(voz[np.abs(voz)>1e-4])):.1f} · música rms {20*np.log10(rms(mus[start:])):.1f} dBFS · public/tfbinodoro.m4a")
