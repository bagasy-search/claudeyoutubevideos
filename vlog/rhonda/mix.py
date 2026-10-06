# Mezcla FINAL del audio (determinista, sin las costuras AAC de los chunks del farm):
# máster de voz (mono→estéreo) + foley real de los clips kf (bajo la voz, fundidos 0,15 s)
# + sfx puntuales, todo en los cuadros exactos del timeline generado. → out/<slug>_mix.wav (SLUG=x python vlog/rhonda/mix.py) (48 kHz estéreo, -16 LUFS)
import json, re, subprocess, numpy as np
import os; S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/rhtoiletrim/"
SR = 48000; FPS = 30
ts = open(R + f"src/{S}/timeline.gen.ts", encoding="utf8").read()
grab = lambda k: json.loads(re.search(rf"export const {k}: any\[\] = (.*);", ts).group(1))
TOTAL = int(re.search(r"TOTAL_FRAMES = (\d+)", ts).group(1))
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
voice = load(f"{S}.wav", 1); add(np.repeat(voice, 2, 1), 0.0)
# sin cama musical en canales EN (creador 3-oct-2026): sólo voz + foley + sfx
for a in FOLEY: add(load(a["src"]), a["from"] / FPS, 1.0, a["dur"] / FPS, 0.15)
cache = {}
for a in SFX:
    if a["src"] not in cache: cache[a["src"]] = load(a["src"])
    add(cache[a["src"]], a["from"] / FPS, a["vol"], a["dur"] / FPS, 0.02)
# minuto 1 sin aire muerto (compuerta: 0 silencios >=0,3 s a -32 dB): ambiente de campo bajo en cada pausa >=0,25 s de la voz
amb = load("sfx/amb_campo.mp3"); amb = amb / (np.sqrt((amb ** 2).mean()) + 1e-9) * 10 ** (-27 / 20)
env = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(480) / 480, mode="same")); quiet = env < 10 ** (-40 / 20)
i, n1, filled = 0, int(60 * SR), 0
while i < n1:
    if quiet[i]:
        j = i
        while j < n1 and quiet[j]: j += 1
        if j - i >= int(0.25 * SR):
            a, b = max(0, i - int(0.08 * SR)), min(N, j + int(0.08 * SR)); seg = amb[(a % (len(amb) - (b - a))):][: b - a].copy()
            k = min(int(0.06 * SR), len(seg) // 2); r = np.linspace(0, 1, k, dtype=np.float32)[:, None]; seg[:k] *= r; seg[-k:] *= r[::-1]
            mix[a:b] += seg; filled += 1
        i = j
    else: i += 1
print("pausas del minuto 1 rellenadas con ambiente:", filled)
peak = np.abs(mix).max(); print("pico", round(float(20 * np.log10(peak + 1e-9)), 2), "dBFS")
raw = (np.clip(mix, -1, 1)).astype(np.float32).tobytes()
p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:linear=true", "-ar", str(SR), "-c:a", "pcm_s16le", R + f"out/{S}_mix.wav"], input=raw)
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", R + f"out/{S}_mix.wav", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
print("mezcla:", " ".join(l.strip() for l in o.splitlines() if re.match(r"\s+(I|Peak):", l)), "· dur", N / SR)
