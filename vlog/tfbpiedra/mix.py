# tfbpiedra — mezcla final: voz (máster + vecino) + foley de los planos de detalle + SFX de cortes/componentes + cama
# musical desde el seg ~6, ~22 dB bajo la voz. Todo en numpy (48k mono) → public/tfbpiedra_mix.m4a (AAC, -14 LUFS).
import json, subprocess, numpy as np, os
R = "D:/Proyectos/video2-wt/tfbpiedra/"; V = R + "vlog/tfbpiedra/"; SR = 48000
def load(f, ss=0.0, d=None, rate=1.0):
    a = ["ffmpeg", "-v", "error", "-ss", f"{ss:.3f}", "-i", f]
    if d is not None: a += ["-t", f"{d * rate:.3f}"]
    af = [] if rate == 1 else [f"atempo={max(0.5, rate):.3f}"]
    a += (["-af", ",".join(af)] if af else []) + ["-vn", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"]
    b = subprocess.run(a, capture_output=True, creationflags=0x08000000).stdout
    return np.frombuffer(b, dtype=np.float32).copy()
voz = load(V + "voz.wav"); N = len(voz); out = voz.copy()
def movavg(x, w):  # media móvil O(N) (np.convolve con ventanas de 1e4 sobre 5e7 muestras tardaba >15 min)
    c = np.cumsum(np.concatenate([[0.0], x.astype(np.float64)])); h = w // 2
    i = np.clip(np.arange(len(x)) - h, 0, len(x)); j = np.clip(np.arange(len(x)) + h, 0, len(x))
    return ((c[j] - c[i]) / np.maximum(1, j - i)).astype(np.float32)
rms = lambda x: float(np.sqrt(np.mean(x ** 2) + 1e-12))
vr = rms(voz[np.abs(voz) > 0.01]) if (np.abs(voz) > 0.01).any() else 0.1
def add(x, t, g):
    i = int(round(t * SR)); j = min(N, i + len(x))
    if i < N and j > i: out[i:j] += x[: j - i] * g
SFX = {"whoosh": "sfx/whoosh.mp3", "whoosh_big": "sfx/smooth_airy_whoosh_m_#2-1780923688387.mp3", "impact": "sfx/deep-cinematic-impact-1.mp3",
       "slam": "sfx/text_slam.mp3", "pop": "sfx/sfx_pop.mp3", "tick": "sfx/digit_tick.mp3", "ticks": "sfx/counter_up.mp3", "swell": "sfx/section_swell.mp3",
       "riser": "sfx/cp_riser.wav", "marker": "sfx/marker_drive.mp3", "paper": "sfx/gentle_papercard_pop_#2-1780923860389.mp3", "shutter": "sfx/universfield-camera-shutter-199580.mp3"}
GAIN = {"whoosh": 0.35, "whoosh_big": 0.45, "impact": 0.55, "slam": 0.4, "pop": 0.3, "tick": 0.3, "ticks": 0.3, "swell": 0.35, "riser": 0.5, "marker": 0.3, "paper": 0.45, "shutter": 0.35}
cache = {}
EV = json.load(open(V + "events.json", encoding="utf-8"))
state = {}
def detclip(key):
    S, cid = key.split(":"); P = json.load(open(V + f"plan_{S}.json", encoding="utf-8"))
    st = json.load(open(P["dir"] + "/clips/state_det.json", encoding="utf-8")); return P["dir"] + "/clips/" + st[cid]["file"]
nf = ns = 0
for e in EV:
    if "sfx" in e:
        k = e["sfx"]
        if k not in SFX or not os.path.exists(R + "public/" + SFX[k]): continue
        if k not in cache: x = load(R + "public/" + SFX[k]); cache[k] = x / (np.abs(x).max() + 1e-9)
        add(cache[k], e["t"], GAIN[k] * vr * 2.2); ns += 1
    elif "foley" in e:
        x = load(e["foley"], e.get("ss", 0), e["d"] / max(0.5, e.get("rate", 1)) * e.get("rate", 1))
        if len(x): add(x / (rms(x) + 1e-9) * vr, e["t"], e["vol"] * 0.5); nf += 1
    elif "foleyClip" in e:
        x = load(detclip(e["foleyClip"]), 0, e["d"])
        if len(x): add(x / (rms(x) + 1e-9) * vr, e["t"], e["vol"] * 0.5); nf += 1
# cama musical: entra en el seg ~6, 22 dB bajo la voz, con fundidos; sube un poco donde no hay voz
beds = [load(R + "public/sfx/music_federer.mp3"), load(R + "public/sfx/leona_music.wav")]
T0 = int(6.0 * SR); bed = np.zeros(0, np.float32); k = 0; X = int(2.0 * SR)
while len(bed) < N - T0 + SR:
    b = beds[k % 2] / (rms(beds[k % 2]) + 1e-9); k += 1
    if len(bed) == 0: bed = b.copy()
    else:
        fade = np.linspace(0, 1, X, dtype=np.float32); ov = bed[-X:] * (1 - fade) + b[:X] * fade
        bed = np.concatenate([bed[:-X], ov, b[X:]])
bed = bed[: N - T0]
env = movavg(np.abs(voz), SR // 5)[T0:]
duck = np.where(env > vr * 0.08, 1.0, 1.9).astype(np.float32)
duck = movavg(duck, SR // 4)
g = vr * 10 ** (-22 / 20)
fi = np.minimum(1, np.arange(len(bed)) / (1.5 * SR)).astype(np.float32); fo = np.minimum(1, (len(bed) - np.arange(len(bed))) / (3 * SR)).astype(np.float32)
out[T0:] += bed * g * duck * fi * fo
peak = np.abs(out).max(); out = out / max(1.0, peak / 0.97)
wav = V + "mix.wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", wav], input=out.astype(np.float32).tobytes(), creationflags=0x08000000, check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", wav, "-af", "loudnorm=I=-14:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "192k", R + "public/tfbpiedra_mix.m4a"], creationflags=0x08000000, check=True)
print("mezcla OK · sfx", ns, "· foley", nf, "· dur %.2f s" % (N / SR))
