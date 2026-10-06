# vlog/beforeus/mix.py <slug> — máster del canal Before Us: voz + camas de ambiente por capítulo + SFX anclados.
# SIN MÚSICA (regla del creador 3-oct para los canales EN). Diseño de sonido por capas: ambiente del lugar,
# golpes y fuego en los componentes, sonidos anclados a frases, y silencio de ambiente antes de los datos fuertes.
# Entradas: D:/rtmp/<slug>/fish/master.wav · moments.json · wordms.json · plan_report.json
#           vlog/<slug>/sound.json = {"beds": {capítulo: [archivo, dB]}, "phr": [[frase, archivo, dB, max_s]], "hush": [frases]}
# Salida:   public/ah/<slug>/<slug>.wav + .m4a · D:/rtmp/<slug>/audio_ms.json
import json, subprocess, numpy as np, os, sys, re
SR = 48000
SLUG = sys.argv[1]
REPO = f"D:/Proyectos/video2-wt/{SLUG}/"; R = f"D:/rtmp/{SLUG}/"
LIB = "D:/rtmp/beforeus_sfx/"; LIB2 = REPO + "public/sfx/lib/"
OUTWAV = REPO + f"public/ah/{SLUG}/{SLUG}.wav"; OUTM4A = REPO + f"public/ah/{SLUG}/{SLUG}.m4a"
os.makedirs(os.path.dirname(OUTWAV), exist_ok=True)
SND = json.load(open(REPO + f"vlog/{SLUG}/sound.json", encoding="utf8"))

def load(p):
    if not os.path.isabs(p) and ":" not in p: p = (LIB + p) if os.path.exists(LIB + p) else (LIB2 + p)
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).copy()
    if not len(a): raise SystemExit("audio vacío: " + p)
    return a
db = lambda d: 10 ** (d / 20)

voice = load(R + "fish/master.wav")
TAIL = int(2.6 * SR); N = len(voice) + TAIL
json.dump({"ms": round(N / SR * 1000)}, open(R + "audio_ms.json", "w"))
if "--only-len" in sys.argv: print("len", N / SR); sys.exit(0)
out = np.zeros((N, 2), np.float32); out[: len(voice)] += voice

W_ = json.load(open(R + "wordms.json", encoding="utf8"))
NW = [re.sub(r"[^a-z0-9]", "", w["w"].lower()) for w in W_]
def at_phrase(ph):
    p = [re.sub(r"[^a-z0-9]", "", x.lower()) for x in ph.split()]
    for i in range(len(NW) - len(p) + 1):
        if NW[i:i + len(p)] == p: return W_[i]["in"] / 1000.0
    return None

# ── camas por capítulo (fundido de 2,5 s entre capítulos) ──
moments = json.load(open(R + "moments.json", encoding="utf8"))
chs = []
for m in moments:
    if not chs or chs[-1][0] != m["item"]: chs.append([m["item"], m["ms_in"] / 1000])
bed = np.zeros((N, 2), np.float32); XF = int(2.5 * SR); cache = {}
for k, (ch, t0) in enumerate(chs):
    spec = SND["beds"].get(ch)
    if not spec: continue
    a = 0 if k == 0 else int(t0 * SR); b = N if k + 1 == len(chs) else int(chs[k + 1][1] * SR)
    if spec[0] not in cache: cache[spec[0]] = load(spec[0])
    tr = cache[spec[0]]; L = b - a + XF
    seg = np.tile(tr, (int(np.ceil(L / len(tr))), 1))[:L] * db(spec[1])
    env = np.ones(L, np.float32)
    if k > 0: env[:XF] = np.linspace(0, 1, XF)
    env[-XF:] = np.minimum(env[-XF:], np.linspace(1, 0, XF))
    s0 = max(0, a - (XF if k > 0 else 0)); s1 = min(N, s0 + L)
    bed[s0:s1] += seg[: s1 - s0] * env[: s1 - s0, None]
# el ambiente baja un poco bajo la voz (no es música: sólo para que la voz respire)
v = np.abs(voice[:, 0]) + np.abs(voice[:, 1]); hop = int(0.05 * SR)
env = v[: len(v) // hop * hop].reshape(-1, hop).mean(1)
act = (env > 0.02).astype(np.float32); sm = np.zeros_like(act)
for i in range(len(act)): sm[i] = act[i] if act[i] > (sm[i - 1] if i else 0) else (sm[i - 1] if i else 0) * 0.95
g = np.repeat(sm, hop); g = np.concatenate([g, np.zeros(N - len(g))])[:N]
bed *= (db(-4 * g))[:, None].astype(np.float32)
for ph in SND.get("hush", []):
    t = at_phrase(ph)
    if t is None: print("sin ancla de silencio:", ph); continue
    a = int((t - 0.8) * SR); b = int((t + 0.4) * SR); r = int(0.15 * SR); u = int(0.5 * SR)
    gg = np.ones(N, np.float32); gg[a:b] = 0.12; gg[a - r:a] = np.linspace(1, 0.12, r); gg[b:b + u] = np.linspace(0.12, 1, u)
    bed *= gg[:, None]
bed[: int(1.5 * SR)] *= np.linspace(0, 1, int(1.5 * SR))[:, None]
bed[-int(4 * SR):] *= np.linspace(1, 0, int(4 * SR))[:, None]
out += bed

# ── SFX por componente (offset en s desde el inicio del cue, o el nombre de una marca del cue) ──
MAP = {
    "HourDial": [("1143.mp3", -0.3, -12), ("498.mp3", 0.3, -9), ("1346.mp3", 0.4, -18)],
    "EmberType": [("1349.mp3", 0.0, -16), ("2908.mp3", "formAt", -14)],
    "OchreWall": [("impact_soft_2.mp3", 0.25, -14), ("2182.mp3", 0.4, -20)],
    "RockList": [("2182.mp3", "t0", -18), ("2182.mp3", "t1", -18), ("2182.mp3", "t2", -18), ("2182.mp3", "t3", -18), ("2182.mp3", "t4", -18), ("2182.mp3", "t5", -18)],
    "ClayBind": [("1252.mp3", 0.0, -26), ("shimmer_2.mp3", 1.0, -16)],
    "GapLine": [("1222.mp3", 0.4, -22), ("773.mp3", "linkAt", -14)],
    "MatchCut": [("whoosh_reverse_2.mp3", "cutAt-0.45", -12), ("1348.mp3", "cutAt", -20)],
    "TitleCard": [("impact_soft_7.mp3", 0.05, -17)],
    "FlashSeq": [("whoosh_reverse_1.mp3", -0.3, -12), ("498.mp3", 0.0, -8), ("2150.mp3", 0.8, -12), ("2150.mp3", 1.7, -12)],
    "EmberWords": [("1348.mp3", "t0", -19), ("1348.mp3", "t1", -19), ("1348.mp3", "t2", -19), ("1348.mp3", "t3", -19), ("1348.mp3", "t4", -17)],
}
cues = json.load(open(R + "plan_report.json", encoding="utf8"))["cues"]
def _off(c, off):
    if not isinstance(off, str): return off
    m = re.match(r"^([A-Za-z0-9]+)([+-][0-9.]+)?$", off); v = (c.get("p") or {}).get(m.group(1))
    if v is None:
        return 0.0 if m.group(1) == "t0" else None
    return v / 30 + float(m.group(2) or 0)
n = 0
def put(snd, t, gdb):
    global n
    a = int(t * SR)
    if a < 0 or a >= N: return
    e = min(N, a + len(snd)); out[a:e] += snd[: e - a] * db(gdb); n += 1
for c in cues:
    for f, off, gdb in MAP.get(c["comp"], []):
        o = _off(c, off)
        if o is None: continue
        if f not in cache: cache[f] = load(f)
        put(cache[f], c["from"] / 30 + o, gdb)
for ph, f, gdb, maxs in SND.get("phr", []):
    t = at_phrase(ph)
    if t is None: print("sin ancla sfx:", ph); continue
    if f not in cache: cache[f] = load(f)
    s = cache[f][: int(maxs * SR)].copy(); fo = min(len(s), int(0.6 * SR)); s[-fo:] *= np.linspace(1, 0, fo)[:, None]
    put(s, t, gdb)
peak = np.abs(out).max()
if peak > 0.98: out *= 0.98 / peak
tmp = R + "mix_raw.wav"
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", tmp], input=out.tobytes(), check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.2:LRA=11", "-ar", str(SR), "-c:a", "pcm_s16le", OUTWAV], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", OUTWAV, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", OUTM4A], check=True)
print(f"MEDIDO: mix {N/SR:.1f} s · sfx {n} · capítulos con cama {sum(1 for c,_ in chs if c in SND['beds'])}/{len(chs)} · pico previo {peak:.2f}")
if n == 0: sys.exit(2)
