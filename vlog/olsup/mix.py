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

# ── AMBIENTE DEL MINUTO 1 (sintetizado, determinista): cuarto de cabaña = ruido rosa grave + ráfagas de viento + crepitar de brasas.
# Sube en los HUECOS de la voz (nadie habla → suena la cabaña) y baja bajo la voz: el minuto 1 no tiene silencios.
AMB_T = 66.0
rng = np.random.default_rng(5); n_amb = int(AMB_T * SR)
def lp(x, fc):
    a = np.exp(-2 * np.pi * fc / SR); y = np.zeros_like(x); acc = 0.0
    for i in range(len(x)): acc = a * acc + (1 - a) * x[i]; y[i] = acc
    return y
w = rng.normal(0, 1, n_amb).astype(np.float64)
room = lp(lp(w, 260), 260); room /= (np.abs(room).max() + 1e-9)
t_ = np.arange(n_amb) / SR
gust = 0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * t_ + 1.3) * np.sin(2 * np.pi * 0.037 * t_ + 0.4)
wind = lp(rng.normal(0, 1, n_amb), 900) * gust; wind /= (np.abs(wind).max() + 1e-9)
crack = np.zeros(n_amb)
for _ in range(int(AMB_T * 7)):
    i0 = int(rng.random() * (n_amb - 2000)); L = int(rng.integers(60, 500)); crack[i0:i0 + L] += rng.normal(0, 1, L) * np.exp(-np.arange(L) / (L / 4)) * rng.random()
crack = lp(crack, 5000); crack /= (np.abs(crack).max() + 1e-9)
amb = 0.70 * room + 0.35 * wind + 0.30 * crack
amb = np.stack([amb, np.roll(amb, 37)], 1).astype(np.float32)   # leve decorrelación estéreo
amb /= np.sqrt((amb ** 2).mean()) + 1e-9                       # RMS = 1
v0 = load("olsup.wav", 1)[: int(AMB_T * SR), 0]
hop = int(0.02 * SR); m = len(v0) // hop
ve = np.sqrt((v0[: m * hop].reshape(m, hop) ** 2).mean(1))
talk = (ve > 0.02).astype(np.float32)
talk = np.convolve(talk, np.ones(15) / 15, "same")                 # 300 ms de suavizado
gain_c = np.repeat(0.012 + (0.045 - 0.012) * (1 - talk), hop)[: len(amb)]
gain_c = np.pad(gain_c, (0, len(amb) - len(gain_c)), constant_values=0.045)
k = int(1.5 * SR); ramp = np.ones(len(amb), np.float32); ramp[:k] = np.linspace(0, 1, k); ramp[-k * 2:] = np.linspace(1, 0, k * 2)
add(amb * (gain_c * ramp)[:, None].astype(np.float32), 0.0)
bed = load("sfx/olsup_bed.m4a"); add(bed, 6.0, 1.0, fade=1.5)
for a in FOLEY: add(load(a["src"]), a["from"] / FPS, a.get("vol", 1.0), a["dur"] / FPS, 0.15)
cache = {}
for a in SFX:
    if a["src"] not in cache: cache[a["src"]] = load(a["src"])
    add(cache[a["src"]], a["from"] / FPS, a["vol"], a["dur"] / FPS, 0.02)
peak = np.abs(mix).max(); print("pico", round(float(20 * np.log10(peak + 1e-9)), 2), "dBFS")
raw = (np.clip(mix, -1, 1)).astype(np.float32).tobytes()
p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:linear=true", "-ar", str(SR), "-c:a", "pcm_s16le", R + "out/olsup_mix.wav"], input=raw)
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", R + "out/olsup_mix.wav", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
print("mezcla:", " ".join(l.strip() for l in o.splitlines() if re.match(r"\s+(I|Peak):", l)), "· dur", N / SR)
