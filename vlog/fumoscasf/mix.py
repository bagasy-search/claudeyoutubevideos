# Mezcla FINAL fumoscasf (SIN música): VOZ (máster sin pausas, manda) + AMBIENTE por sección (en loop, fundidos 0,8 s, ~24 dB bajo la voz,
# ducking suave) + FOLEY puntual (biblioteca sfx_pro/foley, sin ElevenLabs).
# −14 LUFS integrados, true peak ≤ −1 dBTP.  python vlog/fumoscasf/mix.py → out/fumoscasf_mix.wav (48 k estéreo)
import json, os, re, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/fumoscasf/"; D = R + "vlog/fumoscasf/"; SR = 48000
AMB = {"HOOK": ["sfx_pro/amb/amb_indoor_generic.flac", "sfx_pro/amb/amb_fridge_hum.flac"],
       "AF": ["sfx_pro/amb/amb_fridge_hum.flac", "sfx_pro/amb/amb_house_birds_fridge.flac"],
       "MO": ["sfx_pro/amb/amb_indoor_generic.flac"],
       "ALM": ["sfx_pro/amb/amb_indoor_generic.flac", "sfx_pro/amb/amb_hotel_lobby.flac"],
       "BA": ["sfx_pro/amb/amb_fridge_hum.flac"],
       "LI": ["sfx_pro/amb/amb_house_birds_fridge.flac"],
       "AL": ["sfx_pro/amb/amb_house_birds_fridge.flac"],
       "CI": ["sfx_pro/amb/amb_indoor_generic.flac"],
       "ME": ["sfx_pro/amb/amb_house_birds_fridge.flac"],
       "GR": ["sfx_pro/amb/amb_suburb_backyard.flac", "sfx_pro/amb/amb_suburb_birds.flac"],
       "NO": ["sfx_pro/amb/amb_indoor_generic.flac", "sfx_pro/amb/amb_fridge_hum.flac"],
       "CL": ["sfx_pro/amb/amb_house_birds_fridge.flac"],
       "NX": ["sfx_pro/amb/amb_indoor_generic.flac", "sfx_pro/amb/amb_suburb_backyard.flac"]}
GAIN = {"GR": 1.3, "MO": 1.15}
FOLEY = {"BA": [("cabinet_door_slide.flac", 0.6)], "LI": [("cap_unscrew_jar.flac", 0.4), ("cutter_cut.flac", 6.0)],
         "CI": [("ceramic_scrape.flac", 1.2)], "GR": [("bucket_pour.flac", 2.0)], "CL": [("drip_sink.flac", 1.0)]}
def load(f, ch=2):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", str(ch), "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, ch).copy()
def rms_db(x): return 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
def lufs(x):
    p = subprocess.run(["ffmpeg", "-hide_banner", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"], input=x.astype(np.float32).tobytes(), capture_output=True)
    o = p.stderr.decode("utf8", "replace"); return float(re.findall(r"I:\s+(-?[\d.]+) LUFS", o)[-1]), float(re.findall(r"Peak:\s+(-?[\d.]+) dBFS", o)[-1])
voice = load(R + "public/fumoscasfcut.wav", 1)[:, 0]; N = len(voice); V = np.repeat(voice[:, None], 2, 1)
vdb = rms_db(voice[np.abs(voice) > 0.02])
hop = 480; n = N // hop; env = np.sqrt((voice[:n * hop].reshape(n, hop) ** 2).mean(1)); act = np.clip((20 * np.log10(env + 1e-9) - (vdb - 30)) / 20, 0, 1)
sm = np.zeros_like(act); a = 0
for i, v in enumerate(act): a = v if v > a else a * 0.985; sm[i] = a
duck = np.repeat(1 - 0.35 * sm, hop)[:N]; duck = np.pad(duck, (0, max(0, N - len(duck))), constant_values=1)
segs = json.load(open(D + "planos.json", encoding="utf8")); secc = []
for s in segs:
    if secc and secc[-1][0] == s["sec"]: secc[-1][2] = s["b"]
    else: secc.append([s["sec"], s["a"], s["b"]])
A = np.zeros((N, 2), np.float32); cache = {}
for sc, s, e in secc:
    i0, i1 = int(s * SR), min(N, int(e * SR)); L = i1 - i0
    if L <= 0: continue
    bed = np.zeros((L, 2), np.float32)
    for f in AMB.get(sc, ["sfx_pro/amb/amb_indoor_generic.flac"]):
        if f not in cache:
            x = load(R + "public/" + f); cache[f] = x / (10 ** (rms_db(x) / 20)) * 10 ** ((vdb - 24) / 20)
        x = cache[f]; k = int(np.ceil(L / len(x))) + 1; bed += np.tile(x, (k, 1))[:L] * (0.8 if len(AMB.get(sc, f)) > 1 else 1)
    bed *= GAIN.get(sc, 1.0); fk = min(int(0.8 * SR), L // 3); r = np.linspace(0, 1, fk, dtype=np.float32)[:, None]
    bed[:fk] *= r; bed[-fk:] *= r[::-1]; A[i0:i1] += bed
A *= duck[:, None]
F = np.zeros((N, 2), np.float32)
for sc, s, e in secc:
    for f, off in FOLEY.get(sc, []):
        p = R + "public/sfx_pro/foley/" + f
        if not os.path.exists(p): continue
        x = load(p); i0 = int((s + off) * SR)
        if i0 >= N - 100: continue
        L = min(len(x), N - i0); F[i0:i0 + L] += x[:L] * (10 ** ((vdb - 30) / 20)) * duck[i0:i0 + L, None] ** 2
mix = V + A + F
I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
for _ in range(4):
    I, tp = lufs(mix)
    if tp <= -1.0: break
    pk = 10 ** (-1.3 / 20); mix = np.tanh(mix / pk) * pk
    I, tp = lufs(mix); mix *= 10 ** ((-14 - I) / 20)
os.makedirs(R + "out", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", R + "out/fumoscasf_mix.wav"], input=mix.astype(np.float32).tobytes(), check=True)
I, tp = lufs(mix); print(f"mix {N / SR:.2f}s · {I:.1f} LUFS · TP {tp:.1f} · secciones {len(secc)} · foley {sum(len(FOLEY.get(s, [])) for s, _, _ in secc)}")
