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
# ── música por capítulo: calidez → tensión → alba (cortes en los SkyClock/NightClock), fundidos de 3 s
clocks = sorted(c["from"] for c in cues if c["comp"] in ("NightClock", "SkyClock"))
PLAN_M = ["Dark_Fog", "Echoes_of_Time", "Echoes_of_Time", "Ancient_Rite", "Ancient_Rite", "Long_Note_Three", "Night_Vigil", "Night_Vigil", "Rites", "Lightless_Dawn", "Lightless_Dawn"]
bounds = [0] + clocks + [10 ** 9]
segs = []
for k in range(len(bounds) - 1):
    name = PLAN_M[min(k, len(PLAN_M) - 1)]
    if segs and segs[-1][2] == name: segs[-1][1] = bounds[k + 1]
    else: segs.append([bounds[k], bounds[k + 1], name])
music = np.zeros((N, 2), np.float32)
XF = int(3 * SR)
for k, (fa, fb, name) in enumerate(segs):
    a = int(fa / 30 * SR); b = min(N, int(fb / 30 * SR))
    if a >= N: break
    tr = load(R + "music/" + name + ".mp3")
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
# respiros: silencio de música antes de los datos fuertes
W_ = json.load(open(R + "wordms.json", encoding="utf8"))
import re as _r2
_nw = [_r2.sub(r"[^a-z0-9]", "", w["w"].lower()) for w in W_]
def at_phrase(ph, frm=0):
    p = [_r2.sub(r"[^a-z0-9]", "", x.lower()) for x in ph.split()]
    for i in range(frm, len(_nw) - len(p) + 1):
        if _nw[i:i + len(p)] == p: return W_[i]["in"] / 1000.0
    return None
for ph in ["We'll also get to eighteen minutes.", "Eighty-one percent of night talk", "don't even have a word for insomnia", "Eighteen minutes. In twenty nights.", "Honestly, we don't know."]:
    t = at_phrase(ph)
    if t is None: print("sin ancla de silencio:", ph); continue
    a = int((t - 0.75) * SR); b = int((t + 0.35) * SR); ramp = int(0.15 * SR); up = int(0.4 * SR)
    g = np.ones(N, np.float32); g[a:b] = 0.08; g[a - ramp:a] = np.linspace(1, 0.08, ramp); g[b:b + up] = np.linspace(0.08, 1, up)
    music *= g[:, None]
music[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
out += music
# ── cama de fogata continua (muy baja) + viento en la hora más fría
fire = load(SFX + "Crackling_campfire_w_#1-1780924416643.mp3")
bed = np.tile(fire, (int(np.ceil(N / len(fire))), 1))[:N] * (10 ** (-33 / 20))
bed[: int(2 * SR)] *= np.linspace(0, 1, int(2 * SR))[:, None]
bed[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
out += bed
cold = []
if cold:
    wind = load(SFX + "cold_winter_wind,_lo_#1-1780924461333.mp3")
    a = int(cold[0] / 30 * SR); L = min(int(14 * SR), N - a); wind = np.tile(wind, (int(np.ceil(L / len(wind))) + 1, 1))
    w = wind[:L] * (10 ** (-24 / 20)); w[: int(SR)] *= np.linspace(0, 1, int(SR))[:, None]; w[-int(2 * SR):] *= np.linspace(1, 0, int(2 * SR))[:, None]
    out[a:a + L] += w

S2 = R + "sfx2/"
LIB = "C:/Users/bauti/Downloads/video2/public/sfx/lib/"
MAP = {
    "SkyClock": [(LIB + "riser_soft_3.mp3", -0.9, -13), ("Smooth,_very_deep_ci_#2-1780916058254.mp3", 0.0, -8), (LIB + "shimmer_2.mp3", 0.25, -18)],
    "Prerendered": [("cam_travel.mp3", 0.1, -14), ("warm_rising_tonal_sw_#3-1780924218410.mp3", 2.5, -16)],
    "EmberType": [(S2 + "fire_ignite_1.wav", 0.0, -14), (LIB + "impact_soft_4.mp3", "formAt", -9)],
    "OchreWall": [(LIB + "impact_soft_2.mp3", 0.25, -14), ("soft_organic_wooden__#4-1780923840971.mp3", 0.35, -16)],
    "ShadowWall": [(LIB + "impact_soft_5.mp3", "s0", -10), (LIB + "impact_soft_5.mp3", "s1", -11), (LIB + "impact_soft_6.mp3", "s2", -9)],
    "CampWatch": [("warm_rising_tonal_sw_#3-1780924218410.mp3", 0.0, -16), (LIB + "impact_soft_3.mp3", "l0", -8), (LIB + "impact_soft_1.mp3", "l1", -12), (LIB + "impact_soft_1.mp3", "l2", -12)],
    "DotTrail": [(LIB + "shimmer_3.mp3", 1.0, -15), ("sfx_chime.mp3", 1.2, -17)],
    "MatchCut": [(LIB + "whoosh_reverse_2.mp3", "cutAt-0.45", -12), (S2 + "fire_ignite_2.wav", "cutAt", -20)],
    "TitleCard": [(LIB + "impact_soft_7.mp3", 0.05, -17)],
    "FlashSeq": [(LIB + "whoosh_reverse_1.mp3", -0.3, -12), (LIB + "impact_soft_8.mp3", 0.0, -9), (LIB + "impact_soft_8.mp3", 0.3, -11), (LIB + "impact_soft_8.mp3", 0.6, -11)],
    "EmberWords": [(S2 + "fire_ignite_2.wav", "t0", -18), (S2 + "fire_ignite_2.wav", "t1", -18), (S2 + "fire_ignite_2.wav", "t2", -18), (S2 + "fire_ignite_2.wav", "t3", -18), (S2 + "fire_ignite_2.wav", "t4", -16)],
    "Nightfall": [(S2 + "wind_night.wav", 0.0, -22)],
}
PHR = [
    ("You're standing in a river valley", S2 + "wind_night.wav", -26, 9),
    ("And somewhere up the valley,", S2 + "heartbeat.wav", -12, 5),
    ("And somewhere up the valley,", S2 + "hyena_1.wav", -18, 5),
    ("with nothing to fill them but a fire", S2 + "flint_1.wav", -8, 2),
    ("and the people sitting around it.", S2 + "fire_ignite_1.wav", -10, 3),
    ("the neighbors are getting up.", S2 + "wolf_howl_2.wav", -22, 8),
    ("Cave hyenas, bigger than", S2 + "hyena_2.wav", -20, 4),
    ("marrow cracked out of a bone.", S2 + "bone_crack_1.wav", -12, 1.5),
    ("Story time.", S2 + "crickets_night.wav", -32, 20),
    ("Everyone's lying down.", S2 + "owl_1.wav", -24, 4),
    ("Out there, something is laughing.", S2 + "hyena_2.wav", -14, 4),
    ("Three fourteen AM.", S2 + "heartbeat.wav", -11, 8),
    ("someone gets up to feed it,", S2 + "fire_ignite_2.wav", -16, 3),
    ("They wait in the dark for animals", S2 + "wolf_howl_3.wav", -24, 6),
    ("The coldest hour.", S2 + "wind_night.wav", -20, 14),
    ("Six thirty AM. Dawn.", S2 + "dawn_birds.wav", -22, 30),
]
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
        fp = f if (":" in f or f.startswith("/")) else SFX + f
        if f not in cache: cache[f] = load(fp)
        s = cache[f]
        a = int((c["from"] / 30 + off) * SR)
        if a >= N: continue
        e = min(N, a + len(s))
        out[a:e] += s[: e - a] * (10 ** (gdb / 20))
        n_sfx += 1
for ph, fp, gdb, maxs in PHR:
    t = at_phrase(ph)
    if t is None: print("sin ancla sfx:", ph); continue
    if fp not in cache: cache[fp] = load(fp)
    snd = cache[fp][: int(maxs * SR)].copy()
    fo = min(len(snd), int(0.6 * SR)); snd[-fo:] *= np.linspace(1, 0, fo)[:, None]
    a = int(t * SR); e = min(N, a + len(snd)); out[a:e] += snd[: e - a] * (10 ** (gdb / 20)); n_sfx += 1
peak = np.abs(out).max()
if peak > 0.98: out *= 0.98 / peak
tmp = R + "mix_raw.wav"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", tmp], input=out.tobytes(), check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.2:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", OUTWAV], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", OUTWAV, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", OUTM4A], check=True)
print(f"mix ok · {N/SR:.1f} s · sfx {n_sfx} · tramos de música {len(segs)} · pico previo {peak:.2f}")
