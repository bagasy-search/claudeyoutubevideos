# mix.py — máster final de ahnight: voz + música CC-BY (ducking) + cama de fogata + sfx sincronizados a los componentes.
# Entradas: D:/rtmp/ahnight/fish_out/master.wav · D:/rtmp/ahnight/music/*.mp3 · D:/rtmp/ahnight/plan_report.json
# Salida:   public/ah/ahnight/ahnight.wav + .m4a · D:/rtmp/ahnight/audio_ms.json
import json, subprocess, numpy as np, os, sys, glob, re as _re
SR = 48000
REPO = "D:/Proyectos/video2-wt/ahnight/"
R = "D:/rtmp/ahnight/"
SFX = "C:/Users/bauti/Downloads/video2/public/sfx/"
OUTWAV = REPO + "public/ah/ahnight/ahnight.wav"
OUTM4A = REPO + "public/ah/ahnight/ahnight.m4a"
os.makedirs(os.path.dirname(OUTWAV), exist_ok=True)

def load(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()

voice = load(R + "fish_out/master.wav")
LEAD = int(0.0 * SR)
TAIL = int(2.6 * SR)
N = len(voice) + TAIL
json.dump({"ms": round(N / SR * 1000)}, open(R + "audio_ms.json", "w"))
if "--only-len" in sys.argv:
    print("len", N / SR); sys.exit(0)
out = np.zeros((N, 2), np.float32)
out[: len(voice)] += voice

rep = json.load(open(R + "plan_report.json", encoding="utf8"))
cues = rep["cues"]
# ── música: una pista por tramo de capítulos (los NightClock marcan los cortes), fundidos de 3 s
TRACKS = sorted(glob.glob(R + "music/*.mp3"))
clocks = sorted(c["from"] for c in cues if c["comp"] == "NightClock")
bounds = [0] + [clocks[i] for i in range(0, len(clocks), 2)] + [10 ** 9]
bounds = sorted(set(bounds))
music = np.zeros((N, 2), np.float32)
XF = int(3 * SR)
for k in range(len(bounds) - 1):
    a = int(bounds[k] / 30 * SR); b = min(N, int(bounds[k + 1] / 30 * SR))
    if a >= N or not TRACKS: break
    tr = load(TRACKS[k % len(TRACKS)])
    seglen = b - a + XF
    seg = np.tile(tr, (int(np.ceil(seglen / len(tr))), 1))[:seglen]
    env = np.ones(len(seg), np.float32)
    if k > 0: env[:XF] = np.linspace(0, 1, XF)
    env[-XF:] = np.minimum(env[-XF:], np.linspace(1, 0, XF))
    s0 = max(0, a - (XF if k > 0 else 0)); s1 = min(N, s0 + len(seg))
    music[s0:s1] += seg[: s1 - s0] * env[: s1 - s0, None]
# ducking con la envolvente de la voz
v = np.abs(voice[:, 0]) + np.abs(voice[:, 1])
hop = int(0.05 * SR)
rms = np.sqrt(np.convolve(v[: len(v) // hop * hop].reshape(-1, hop).mean(1) ** 2, np.ones(3) / 3, "same"))
act = (rms > 0.02).astype(np.float32)
sm = np.zeros_like(act)
for i in range(len(act)):
    prev = sm[i - 1] if i else 0
    sm[i] = act[i] if act[i] > prev else prev * 0.93
gain_v = np.repeat(sm, hop)
gain_v = np.concatenate([gain_v, np.zeros(N - len(gain_v))])[:N]
db = -20 + (-28 - -20) * gain_v
music *= (10 ** (db / 20))[:, None].astype(np.float32)
music[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
out += music
# ── cama de fogata continua (muy baja) + viento en la hora más fría
fire = load(SFX + "Crackling_campfire_w_#1-1780924416643.mp3")
bed = np.tile(fire, (int(np.ceil(N / len(fire))), 1))[:N] * (10 ** (-31 / 20))
bed[: int(2 * SR)] *= np.linspace(0, 1, int(2 * SR))[:, None]
bed[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
out += bed
cold = [c["from"] for c in cues if c["comp"] == "NightClock" and "COLDEST" in json.dumps(c.get("p", {}))]
if cold:
    wind = load(SFX + "cold_winter_wind,_lo_#1-1780924461333.mp3")
    a = int(cold[0] / 30 * SR); L = min(int(14 * SR), N - a); wind = np.tile(wind, (int(np.ceil(L / len(wind))) + 1, 1))
    w = wind[:L] * (10 ** (-24 / 20)); w[: int(SR)] *= np.linspace(0, 1, int(SR))[:, None]; w[-int(2 * SR):] *= np.linspace(1, 0, int(2 * SR))[:, None]
    out[a:a + L] += w

MAP = {
    "NightClock": [("Smooth,_very_deep_ci_#2-1780916058254.mp3", 0.0, -10), ("soft_mechanical_odom_#3-1780923982906.mp3", 0.5, -15), ("kicker_type.mp3", 1.0, -17)],
    "Globe3D": [("cam_travel.mp3", 0.1, -14), ("warm_rising_tonal_sw_#3-1780924218410.mp3", 3.5, -15)],
    "Prerendered": [("cam_travel.mp3", 0.1, -14), ("warm_rising_tonal_sw_#3-1780924218410.mp3", 3.5, -15)],
    "YouThem": [("smooth_sliding_exten_#3-1780923878335.mp3", 0.05, -14), ("impactful_clean_text_#3-1780924163909.mp3", 0.6, -18)],
    "Counter": [("number_roll.mp3", 0.25, -15), ("number_slam.mp3", 1.85, -12)],
    "StudyCard": [("gentle_papercard_pop_#2-1780923860389.mp3", 0.1, -12), ("keyboard_type.mp3", 0.4, -22)],
    "Words": [("sfx_whoosh_soft.mp3", 0.05, -18)],
    "TalkBars": [("bar_grow.mp3", 0.3, -14), ("bar_grow.mp3", 0.9, -16)],
    "SleepBars": [("bar_grow.mp3", 0.5, -14), ("line_draw.mp3", 0.2, -18)],
    "SentinelRing": [("warm_rising_tonal_sw_#3-1780924218410.mp3", 0.0, -15), ("tiny_soft_tickclick__#3-1780923823227.mp3", 1.0, -18)],
    "MoonTally": [("sfx_chime.mp3", 0.3, -16), ("soft_organic_wooden__#4-1780923840971.mp3", 1.5, -13)],
    "PlaceStamp": [("keyboard_type.mp3", 0.2, -22)],
    "Recap": [("floraphonic-minimal-pop-click-ui-1-198301.mp3", "t0", -14), ("floraphonic-minimal-pop-click-ui-1-198301.mp3", "t1", -14), ("floraphonic-minimal-pop-click-ui-1-198301.mp3", "t2", -14), ("floraphonic-minimal-pop-click-ui-1-198301.mp3", "t3", -14), ("floraphonic-minimal-pop-click-ui-1-198301.mp3", "t4", -14)],
}
def _off(c, off):
    if not isinstance(off, str): return off
    m = _re.match(r"^([A-Za-z0-9]+)([+-][0-9.]+)?$", off)
    v = (c.get("p") or {}).get(m.group(1))
    if v is None: return None
    return v / 30 + float(m.group(2) or 0)
cache = {}
n_sfx = 0
for c in cues:
    for f, off, gdb in MAP.get(c["comp"], []):
        off = _off(c, off)
        if off is None: continue
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
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.2:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", OUTWAV], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", OUTWAV, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", OUTM4A], check=True)
print(f"mix ok · {N/SR:.1f} s · sfx {n_sfx} · pistas {len(TRACKS)} · pico previo {peak:.2f}")
