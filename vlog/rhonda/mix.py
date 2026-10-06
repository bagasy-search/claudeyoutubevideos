# Mezcla FINAL del canal Rhonda (determinista; el audio de los chunks del farm no se usa). SLUG=x R=<worktree> python vlog/rhonda/mix.py
# Buses: VOZ (máster mono→estéreo, manda) · AMBIENTE (sfx_pro/amb por escena, en loop, fundidos 0,6 s, ~24 dB bajo la voz, ducking suave)
#        · FOLEY + DISEÑO (sfx_pro, en los cuadros exactos del timeline, ducking -7 dB mientras habla Rhonda; los golpes no tapan palabras).
# Sin música (canal EN). Minuto 1 sin aire muerto: las pausas de la voz se rellenan subiendo el ambiente.
# Máster: -14 LUFS integrados, limitador, true peak ≤ -1 dBTP (se mide y se corrige). → out/<slug>_mix.wav 48 kHz estéreo + out/<slug>_mix.json
import json, re, subprocess, os, numpy as np
S = os.environ["SLUG"]; R = os.environ.get("R", "D:/Proyectos/video2-wt/rhtoiletrim/")
SR = 48000; FPS = 30
ts = open(R + f"src/{S}/timeline.gen.ts", encoding="utf8").read()
grab = lambda k: json.loads(re.search(rf"export const {k}: any\[\] = (.*);", ts).group(1)) if re.search(rf"export const {k}: any", ts) else []
TOTAL = int(re.search(r"TOTAL_FRAMES = (\d+)", ts).group(1))
SFX, AMB = grab("SFX"), grab("AMB")
N = int(TOTAL / FPS * SR)


def load(f, ch=2):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", R + "public/" + f, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()


def lufs(x):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], input=x.astype(np.float32).tobytes(), capture_output=True)
    o = p.stderr.decode("utf8", "replace")
    I = float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]); tp = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)
    return I, float(tp[-1]) if tp else 0.0


def fade(x, k):
    k = min(k, len(x) // 2)
    if k > 0:
        r = np.linspace(0, 1, k, dtype=np.float32)[:, None]; x[:k] *= r; x[-k:] *= r[::-1]
    return x


voice = load(f"{S}.wav", 1)[:, 0]
voice = np.pad(voice, (0, max(0, N - len(voice))))[:N]
V = np.repeat(voice[:, None], 2, 1)
# actividad de la voz (0..1): envolvente RMS 20 ms, ataque 15 ms / caída 300 ms
hop = 480; n = N // hop
rms = np.sqrt((voice[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-12); db = 20 * np.log10(rms + 1e-9)
act = np.clip((db + 48) / 18, 0, 1)
sm = np.zeros_like(act); a_up, a_dn = 1 - np.exp(-1 / 1.5), 1 - np.exp(-1 / 30)
for i in range(1, n): sm[i] = sm[i - 1] + (a_up if act[i] > sm[i - 1] else a_dn) * (act[i] - sm[i - 1])
ACT = np.interp(np.arange(N), np.arange(n) * hop + hop / 2, sm).astype(np.float32)[:, None]
VI, _ = lufs(V)

# ── AMBIENTE
amb = np.zeros((N, 2), np.float32); cache = {}
for a in AMB:
    if a["src"] not in cache: cache[a["src"]] = load(a["src"])
    src = cache[a["src"]]; i0 = int(a["from"] / FPS * SR); L = int(a["dur"] / FPS * SR) + int(0.6 * SR)
    off = int((a["from"] * 7919) % max(1, len(src) - 1))  # cada tramo arranca en otro punto del loop
    seg = np.concatenate([src[off:]] + [src] * (L // max(1, len(src)) + 2))[:L].copy()
    seg = fade(seg, int(0.6 * SR)); e = min(N, i0 + L); amb[i0:e] += seg[: e - i0]
AI, _ = lufs(amb + 1e-7)
amb *= 10 ** (((VI - 24) - AI) / 20)              # ambiente ~24 dB por debajo de la voz
amb *= (1 - 0.35 * ACT)                           # ducking suave
# minuto 1: pausas de la voz ≥0,18 s → el ambiente sube (nunca aire muerto)
n1 = int(62 * SR); quiet = (ACT[:n1, 0] < 0.08)
boost = np.convolve(quiet.astype(np.float32), np.ones(int(0.12 * SR)) / int(0.12 * SR), mode="same")
amb[:n1] *= (1 + 2.2 * boost)[:, None]

# ── FOLEY + DISEÑO
fx = np.zeros((N, 2), np.float32); cache = {}
for s in SFX:
    if s["src"] not in cache: cache[s["src"]] = load(s["src"])
    x = cache[s["src"]][: int(s["dur"] / FPS * SR)].copy(); x = fade(x, int(0.012 * SR))
    if len(x) > int(0.3 * SR):  # cola: fundido de salida más largo
        k = min(len(x) // 3, int(0.25 * SR)); x[-k:] *= np.linspace(1, 0, k, dtype=np.float32)[:, None]
    i0 = int(s["from"] / FPS * SR); e = min(N, i0 + len(x))
    if e > i0: fx[i0:e] += x[: e - i0] * s["vol"]
fx *= (1 - 0.55 * ACT)                            # -7 dB mientras habla: los efectos van DEBAJO de la voz

mix = V + amb + fx
I0, _ = lufs(mix)
mix *= 10 ** ((-14 - I0) / 20)
res = {}; LIM = 0.81
for it in range(6):  # limitador (true peak ≤ -1 dBTP): alimiter a ~-1,8 dBFS, se mide (ebur128 true peak) y se corrige ganancia/techo
    p = subprocess.run(["ffmpeg", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af",
                        f"alimiter=limit={LIM:.3f}:attack=2:release=60:level=false:asc=1", "-f", "f32le", "-"],
                       input=mix.astype(np.float32).tobytes(), capture_output=True)
    lim = np.frombuffer(p.stdout, np.float32).reshape(-1, 2)[:N].copy()
    I, TP = lufs(lim); res = {"I": round(I, 2), "TP": round(TP, 2), "iter": it, "limit_dBFS": round(20 * np.log10(LIM), 2)}
    if abs(I + 14) <= 0.3 and TP <= -1.0: break
    if TP > -1.0: LIM *= 0.95
    mix *= 10 ** ((-14 - I) / 20)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s24le", R + f"out/{S}_mix.wav"], input=lim.astype(np.float32).tobytes(), check=True)
res.update({"voz_LUFS": round(VI, 2), "sfx": len(SFX), "ambientes": len(AMB), "dur": round(N / SR, 2)})
json.dump(res, open(R + f"out/{S}_mix.json", "w"), indent=1)
print("mezcla:", res)
