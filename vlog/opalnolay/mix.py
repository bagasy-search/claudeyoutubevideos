# Mezcla FINAL del audio (determinista, sin las costuras AAC de los chunks del farm):
# máster de voz (mono→estéreo) + cama propia desde el seg 6 + foley real de los clips kf (bajo la voz, fundidos 0,15 s)
# + sfx puntuales, todo en los cuadros exactos del timeline generado. → out/opalnolay_mix.wav (48 kHz estéreo, -16 LUFS)
import json, re, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/opalnolay/"
SR = 48000; FPS = 30
ts = open(R + "src/opalnolay/timeline_opalnolay.gen.ts", encoding="utf8").read()
grab = lambda k: json.loads(re.search(rf"export const {k}: any\[\] = (.*);", ts).group(1))
TOTAL = int(re.search(r"TOTAL_FRAMES_OPALNOLAY = (\d+)", ts).group(1))
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
voice = load("opalnolay.wav", 1); add(np.repeat(voice, 2, 1), 0.0)
bed = load("sfx/opalnolay_bed.m4a"); add(bed, 0.0, 1.0, fade=0.6)
for a in FOLEY: add(load(a["src"]), a["from"] / FPS, 1.0, a["dur"] / FPS, 0.15)
cache = {}
for a in SFX:
    if a["src"] not in cache: cache[a["src"]] = load(a["src"])
    add(cache[a["src"]], a["from"] / FPS, a["vol"], a["dur"] / FPS, 0.02)
peak = np.abs(mix).max(); print("pico", round(float(20 * np.log10(peak + 1e-9)), 2), "dBFS")
raw = (np.clip(mix, -1, 1)).astype(np.float32).tobytes()
p = subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:linear=true", "-ar", str(SR), "-c:a", "pcm_s16le", R + "out/opalnolay_mix.wav"], input=raw)
o = subprocess.run(["ffmpeg", "-hide_banner", "-i", R + "out/opalnolay_mix.wav", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], capture_output=True, text=True).stderr
print("mezcla:", " ".join(l.strip() for l in o.splitlines() if re.match(r"\s+(I|Peak):", l)), "· dur", N / SR)
