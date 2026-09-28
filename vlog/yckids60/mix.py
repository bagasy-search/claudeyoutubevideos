# mix.py — máster final de yckids60: voz + música CC-BY (ducking bajo la voz) + sfx sincronizados a los componentes.
# Entradas: fish_out/yckids60/master.wav · D:/rtmp/yckids60/music/*.mp3 · D:/rtmp/yckids60/plan_report.json
# Salida:   public/yckids60.wav (48 kHz estéreo) + public/yckids60.m4a · D:/rtmp/yckids60/audio_ms.json
import json, subprocess, numpy as np, os, sys
SR = 48000
REPO = "C:/Users/bauti/Downloads/video2/"
R = "D:/rtmp/yckids60/"
SFX = REPO + "public/sfx/"

def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

voice = load(REPO + "fish_out/yckids60/master.wav")
TAIL = int(2.6 * SR)
N = len(voice) + TAIL
json.dump({"ms": round(N / SR * 1000)}, open(R + "audio_ms.json", "w"))
if "--only-len" in sys.argv:
    print("len", N / SR); sys.exit(0)
out = np.zeros((N, 2), np.float32)
out[: len(voice)] += voice

rep = json.load(open(R + "plan_report.json", encoding="utf8"))
cues = rep["cues"]
# ── música: una pista por tramo, con fundidos de 3 s
TRACKS = ["Dreamer", "Gymnopedie No 1", "Porch Swing Days - slower", "Wholesome", "Americana", "Heartwarming", "Dreamer", "Gymnopedie No 1"]
nums = sorted(c["from"] for c in cues if c["comp"] == "NumberCard3D")
bounds = [0] + [nums[i] for i in range(3, len(nums), 4)] + [10 ** 9]
music = np.zeros((N, 2), np.float32)
XF = int(3 * SR)
for k in range(len(bounds) - 1):
    a = int(bounds[k] / 30 * SR); b = min(N, int(bounds[k + 1] / 30 * SR))
    if a >= N: break
    tr = load(R + "music/" + TRACKS[k % len(TRACKS)] + ".mp3")
    seglen = b - a + XF
    reps = int(np.ceil(seglen / len(tr)))
    seg = np.tile(tr, (reps, 1))[:seglen]
    env = np.ones(len(seg), np.float32)
    if k > 0: env[:XF] = np.linspace(0, 1, XF)
    env[-XF:] = np.minimum(env[-XF:], np.linspace(1, 0, XF))
    s0 = max(0, a - (XF if k > 0 else 0)); s1 = min(N, s0 + len(seg))
    music[s0:s1] += seg[: s1 - s0] * env[: s1 - s0, None]
# ducking: envolvente de la voz (RMS 50 ms, ataque rápido / relajación lenta)
v = np.abs(voice[:, 0]) + np.abs(voice[:, 1])
hop = int(0.05 * SR)
rms = np.sqrt(np.convolve(np.pad(v[: len(v) // hop * hop].reshape(-1, hop).mean(1) ** 2, (0, 0)), np.ones(3) / 3, "same"))
act = (rms > 0.02).astype(np.float32)
sm = np.zeros_like(act)
for i in range(len(act)):
    prev = sm[i - 1] if i else 0
    sm[i] = act[i] if act[i] > prev else prev * 0.93
gain_v = np.repeat(sm, hop)
gain_v = np.concatenate([gain_v, np.zeros(N - len(gain_v))])[:N]
db = -19 + (-27 - -19) * gain_v          # -19 dB en silencios, -27 dB bajo la voz
music *= (10 ** (db / 20))[:, None].astype(np.float32)
# fade final
music[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
out += music

# ── sfx por componente
MAP = {
    "NumberCard3D": [("Smooth,_very_deep_ci_#2-1780916058254.mp3", 0.0, -9), ("kicker_type.mp3", 0.5, -16)],
    "Timeline3D": [("cam_travel.mp3", 0.1, -14)],
    "ThenNow": [("smooth_sliding_exten_#3-1780923878335.mp3", 0.55, -14)],
    "Kinetic": [("sfx_whoosh_soft.mp3", 0.05, -20)],
    "BanStamp": [("number_slam.mp3", 0.25, -8)],
    "Clipping": [("gentle_papercard_pop_#2-1780923860389.mp3", 0.1, -12), ("marker_drive.mp3", 1.0, -18)],
    "MapRoute": [("marker_drive.mp3", 0.5, -14), ("pin_plop.mp3", 0.2, -14)],
    "FilmStrip": [("fast_vintage_mechani_#2-1780924051971.mp3", 0.0, -12)],
    "Ticket": [("gentle_papercard_pop_#2-1780923860389.mp3", 0.1, -12), ("sfx_paper_tick.mp3", 2.2, -12)],
    "ChalkBars": [("bar_grow.mp3", 0.45, -14)],
    "BigCount": [("number_roll.mp3", 0.1, -15)],
    "PlaceTag": [("keyboard_type.mp3", 0.1, -20)],
    "PrintPush": [("Smooth_cinematic_zoo_#4-1780916032291.mp3", 0.0, -12)],
}
cache = {}
n_sfx = 0
for c in cues:
    for f, off, gdb in MAP.get(c["comp"], []):
        if f not in cache: cache[f] = load(SFX + f)
        s = cache[f]
        a = int((c["from"] / 30 + off) * SR)
        if a >= N: continue
        e = min(N, a + len(s))
        out[a:e] += s[: e - a] * (10 ** (gdb / 20))
        n_sfx += 1
peak = np.abs(out).max()
if peak > 0.98: out *= 0.98 / peak
tmp = R + "mix_raw.wav"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", tmp], input=out.tobytes(), check=True)
# loudness a -14 LUFS (YouTube)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.2:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", REPO + "public/yckids60.wav"], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", REPO + "public/yckids60.wav", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", REPO + "public/yckids60.m4a"], check=True)
print(f"mix ok · {N/SR:.1f} s · sfx {n_sfx} · pico previo {peak:.2f}")
