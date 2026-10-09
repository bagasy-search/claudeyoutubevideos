# Mezcla FINAL furatones5 (sin música): VOZ (máster con sala, manda) + AMBIENTE por escena (en loop, fundidos 0,8 s, ~24 dB bajo la voz,
# ducking suave) + FOLEY opcional (vlog/furatones5/foley/<id>.wav, en el inicio de cada clip según el timeline del armado).
# −14 LUFS integrados, true peak ≤ −1 dBTP.  python vlog/furatones5/mix5.py → out/furatones5_mix.wav (48 k estéreo)
import json, os, re, subprocess, sys, numpy as np
sys.path.insert(0, "D:/Proyectos/video2-wt/furatones5/vlog/furatones5"); from recorte import mapear
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"; SR = 48000
AMB = {"lav": ["sfx_pro/amb/amb_laundry.flac"], "lav2": ["sfx_pro/amb/amb_laundry.flac"], "frente": ["amb5/wind.mp3"], "ferre": ["amb5/store.mp3"],
       "puerta": ["sfx_pro/amb/amb_indoor_generic.flac"], "cocina": ["sfx_pro/amb/amb_fridge_hum.flac", "sfx_pro/amb/amb_house_birds_fridge.flac"],
       "patio": ["sfx_pro/amb/amb_suburb_backyard.flac", "amb5/wind.mp3"], "mesa": ["sfx_pro/amb/amb_house_birds_fridge.flac"],
       "sala": ["sfx_pro/amb/amb_indoor_generic.flac"], "garaje": ["amb5/garage.mp3"], "noche": ["amb5/night.mp3"],
       "techo": ["amb5/wind.mp3", "sfx_pro/amb/amb_suburb_birds.flac"], "cierre": ["sfx_pro/amb/amb_fridge_hum.flac", "sfx_pro/amb/amb_house_birds_fridge.flac"]}
GAIN = {"frente": 1.6, "patio": 1.3, "techo": 1.3, "ferre": 1.4}  # afuera y ferretería se oyen más
def load(f, ch=2):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def lufs(x):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], input=x.astype(np.float32).tobytes(), capture_output=True)
    o = p.stderr.decode("utf8", "replace"); return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1])
voice = load(R + "public/furatones5cut.wav", 1)[:, 0]; N = len(voice); V = np.repeat(voice[:, None], 2, 1)
vdb = rms_db(voice[np.abs(voice) > 0.02])
hop = 480; n = N // hop; env = np.sqrt((voice[:n * hop].reshape(n, hop) ** 2).mean(1)); act = np.clip((20 * np.log10(env + 1e-9) - (vdb - 30)) / 20, 0, 1)
sm = np.zeros_like(act); a = 0
for i, v in enumerate(act): a = v if v > a else a * 0.985; sm[i] = a
duck = np.repeat(1 - 0.35 * sm, hop)[:N]; duck = np.pad(duck, (0, N - len(duck)), constant_values=1)
segs = json.load(open(D + "segs.json", encoding="utf8")); scenes = []
for s in segs:
    if scenes and scenes[-1][0] == s["sc"]: scenes[-1][2] = mapear(s["e"])
    else: scenes.append([s["sc"], mapear(s["s"]), mapear(s["e"])])
A = np.zeros((N, 2), np.float32); cache = {}
for sc, s, e in scenes:
    i0, i1 = int(s * SR), min(N, int(e * SR)); L = i1 - i0; bed = np.zeros((L, 2), np.float32)
    for f in AMB[sc]:
        if f not in cache: x = load(R + "public/" + f); cache[f] = x / (10 ** (rms_db(x) / 20)) * 10 ** ((vdb - 24) / 20)
        x = cache[f]; k = int(np.ceil(L / len(x))) + 1; bed += np.tile(x, (k, 1))[:L] * (0.8 if len(AMB[sc]) > 1 else 1)
    bed *= GAIN.get(sc, 1.0); fk = min(int(0.8 * SR), L // 3); r = np.linspace(0, 1, fk, dtype=np.float32)[:, None]
    bed[:fk] *= r; bed[-fk:] *= r[::-1]; A[i0:i1] += bed
A *= duck[:, None]
F = np.zeros((N, 2), np.float32)
tl = json.load(open(D + "timeline_all.json", encoding="utf8")) if os.path.exists(D + "timeline_all.json") else []
for c in tl:
    f = D + f"foley/{c['id']}.wav"
    if os.path.exists(f):
        x = load(f); i0 = int(c["start"] * SR); L = min(len(x), N - i0, int(c["dur"] * SR)); F[i0:i0 + L] += x[:L] * duck[i0:i0 + L, None] ** 2
mix = V + A + F
I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
for _ in range(4):
    I, tp = lufs(mix)
    if tp <= -1.0: break
    pk = 10 ** (-1.3 / 20); mix = np.tanh(mix / pk) * pk  # limitador suave
    I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
os.makedirs(R + "out", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", R + "out/furatones5_mix.wav"], input=mix.astype(np.float32).tobytes(), check=True)
I, tp = lufs(mix); print(f"mix {N / SR:.2f}s · {I:.1f} LUFS · TP {tp:.1f} · escenas {len(scenes)} · foley {sum(os.path.exists(D + f'foley/{c[chr(105)+chr(100)]}.wav') for c in tl)}")
