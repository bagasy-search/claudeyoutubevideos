# Mezcla FINAL del audio (determinista, sin las costuras AAC de los chunks del farm):
# máster de voz (mono→estéreo) + cama propia desde el seg 6 + foley real de los clips kf (bajo la voz, fundidos 0,15 s)
# + sfx puntuales, todo en los cuadros exactos del timeline generado. → out/olsup_mix.wav (48 kHz estéreo, -16 LUFS)
import json, re, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/olsup/"
SR = 48000; FPS = 30
ts = open(R + "src/olsup/timeline_olsup.gen.ts", encoding="utf8").read()
grab = lambda k: json.loads(re.search(rf"export const {k}: any\[\] = (.*);", ts).group(1))
TOTAL = int(re.search(r"TOTAL_FRAMES_OLSUP = (\d+)", ts).group(1))
SFX, FOLEY = grab("SFX"), grab("FOLEY")
def load(f, ch=2):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", R + "public/" + f, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
N = int(TOTAL / FPS * SR)
mix = np.zeros((N, 2), np.float32)
def add(x, at, gain=1.0, dur=None, fade=0.0):
    i0 = int(at * SR)
    if dur is not None: x = x[: int(dur * SR)]
    x = x.copy()
    if fade > 0 and len(x) > 2 * int(fade * SR):
        k = int(fade * SR); r = np.linspace(0, 1, k, dtype=np.float32)[:, None]; x[:k] *= r; x[-k:] *= r[::-1]
    e = min(N, i0 + len(x))
    if e > i0: mix[i0:e] += x[: e - i0] * gain
voice = load("olsup.wav", 1); add(np.repeat(voice, 2, 1), 0.0)

bed = load("sfx/olsup_bed.m4a")
v0 = load("olsup.wav", 1)[: int(66 * SR), 0]
hop = int(0.02 * SR); m = len(v0) // hop
ve = np.sqrt((v0[: m * hop].reshape(m, hop) ** 2).mean(1))
talk = np.convolve((ve > 0.02).astype(np.float32), np.ones(25) / 25, "same")
g1 = np.repeat(1.0 + 3.2 * (1 - talk), hop)                      # minuto 1: la música respira en las pausas (x4,2 ≈ +12 dB)
g = np.ones(len(bed), np.float32); n1 = min(len(g1), len(g)); g[:n1] = g1[:n1]; g[n1:] = 1.0
if n1 < len(g): g[n1:n1 + 2 * SR] = np.linspace(g[n1 - 1], 1.0, min(2 * SR, len(g) - n1))
add(bed * (0.7 * g)[:, None].astype(np.float32), 0.0, 1.0, fade=1.5)
for a in FOLEY:
    if "winter_wind" in a["src"]: continue
    add(load(a["src"]), a["from"] / FPS, a.get("vol", 1.0) * 0.6, a["dur"] / FPS, 0.15)
cache = {}
for a in SFX:
    if a["src"] not in cache: cache[a["src"]] = load(a["src"])
    add(cache[a["src"]], a["from"] / FPS, a["vol"], a["dur"] / FPS, 0.02)
peak = np.abs(mix).max(); print("pico", round(float(20 * np.log10(peak + 1e-9)), 2), "dBFS")
raw = (np.clip(mix, -1, 1)).astype(np.float32).tobytes()
p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:linear=true", "-ar", str(SR), "-c:a", "pcm_s16le", R + "out/olsup_mix.wav"], input=raw)
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", R + "out/olsup_mix.wav", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
print("mezcla:", " ".join(l.strip() for l in o.splitlines() if re.match(r"\s+(I|Peak):", l)), "· dur", N / SR)
