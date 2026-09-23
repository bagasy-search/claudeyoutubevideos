# nrt_sound.py — diseño sonoro PROCEDURAL de nrtinnitus (sin licencias: todo sintetizado acá).
# Salidas (48 kHz estéreo float → wav 16-bit): D:/rtmp/nrt_work/snd/music.wav · sfx.wav
# Los tiempos de los SFX salen del Main generado (startSec de cada componente/lámina) y del mapa palabra→ms.
import json, re, os, numpy as np, wave
SR = 48000; DUR = 1100.3; N = int(SR * DUR)
OUT = "D:/rtmp/nrt_work/snd"; os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)
t = np.arange(N, dtype=np.float32) / SR

def lp(x, fc):  # filtro pasa-bajos de un polo (vectorizado por bloques vía lfilter manual)
    from scipy.signal import lfilter
    a = np.exp(-2 * np.pi * fc / SR); return lfilter([1 - a], [1, -a], x).astype(np.float32)
def hp(x, fc):
    return (x - lp(x, fc)).astype(np.float32)
def midi(m): return 440.0 * 2 ** ((m - 69) / 12)

# ── MÚSICA: progresiones por acto (segundos de inicio del acto, acordes MIDI, brillo) ──
ACTS = [
    (0,    [[45, 57, 60, 64, 71], [41, 53, 57, 60, 67], [43, 55, 58, 62, 69], [40, 52, 55, 59, 67]], 900),   # dolor: Am9 F G/Bb Em
    (120,  [[45, 57, 64, 67, 72], [48, 55, 64, 67, 71], [41, 57, 60, 65, 69], [43, 55, 62, 67, 71]], 1300),  # mecanismo
    (270,  [[50, 57, 62, 65, 69], [46, 58, 62, 65, 70], [48, 55, 60, 64, 67], [45, 57, 60, 64, 69]], 1500),  # tambor
    (555,  [[48, 55, 64, 67, 72], [41, 57, 64, 69, 72], [45, 57, 64, 67, 71], [43, 55, 62, 67, 74]], 2200),  # lámina: cálida
    (836,  [[48, 60, 64, 67, 72], [43, 55, 62, 67, 71], [45, 57, 60, 64, 69], [41, 53, 60, 65, 69]], 2000),  # solución: C G Am F
]
CH = 8.0  # segundos por acorde
music = np.zeros((N, 2), np.float32)
env_att = lambda n: np.minimum(1, np.arange(n) / (SR * 2.5)) * np.minimum(1, (n - np.arange(n)) / (SR * 2.5))
for ai, (start, prog, bright) in enumerate(ACTS):
    end = ACTS[ai + 1][0] if ai + 1 < len(ACTS) else DUR
    k = 0; s0 = start
    while s0 < end:
        s1 = min(end + 2.5, s0 + CH + 2.5)          # solapa 2,5 s con el siguiente (crossfade)
        i0, i1 = int(s0 * SR), min(N, int(s1 * SR)); n = i1 - i0
        tt = np.arange(n) / SR
        chord = prog[k % len(prog)]; sig = np.zeros((n, 2), np.float32)
        for vi, m in enumerate(chord):
            f = midi(m)
            for det, pan in ((-0.12, 0.3), (0.12, 0.7)):
                ph = rng.uniform(0, 6.28)
                w = np.sin(2 * np.pi * (f * (1 + det / 100)) * tt + ph) + 0.25 * np.sin(2 * np.pi * 2 * f * tt + ph)
                amp = (0.9 if vi == 0 else 0.55) / len(chord)
                sig[:, 0] += w * amp * (1 - pan); sig[:, 1] += w * amp * pan
        e = env_att(n)[:, None]
        music[i0:i1] += sig * e
        s0 += CH; k += 1
    # brillo por acto
    a0, a1 = int(start * SR), min(N, int(end * SR))
    for c in range(2): music[a0:a1, c] = lp(music[a0:a1, c], bright)
# pulso suave en el tramo del tambor (latido grave cada 1,2 s) y "aire" de ruido rosado muy bajo en todo
for s in np.arange(283.0, 407.0, 1.2):
    i0 = int(s * SR); n = int(0.5 * SR); tt = np.arange(n) / SR
    k = np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 9) * 0.35
    music[i0:i0 + n] += k[:, None]
air = lp(rng.standard_normal(N).astype(np.float32), 700) * 0.04
music += np.stack([air, np.roll(air, 900)], 1)
# fade in/out global
fade = np.minimum(1, t / 4) * np.minimum(1, (DUR - t) / 6)
music *= fade[:, None]
music /= np.max(np.abs(music)) + 1e-6

# ── SFX ──
sfx = np.zeros((N, 2), np.float32)
def put(sec, x, gain=1.0, pan=0.5):
    i0 = int(sec * SR); n = min(len(x), N - i0)
    if n <= 0 or i0 < 0: return
    sfx[i0:i0 + n, 0] += x[:n] * gain * (1 - pan) * 2; sfx[i0:i0 + n, 1] += x[:n] * gain * pan * 2
def whoosh(dur=0.55, up=True):
    n = int(dur * SR); tt = np.arange(n) / n
    no = rng.standard_normal(n).astype(np.float32)
    # barrido de filtro: pasa-bajos que abre y cierra
    out = np.zeros(n, np.float32); step = 1024
    for i in range(0, n, step):
        fc = 300 + 3500 * np.sin(np.pi * min(1, (i + step / 2) / n)) ** 1.5
        out[i:i + step] = lp(no[i:i + step], fc)
    env = np.sin(np.pi * tt) ** 1.6
    return hp(out * env, 120) * 0.9
def thump(f=70, dur=0.35):
    n = int(dur * SR); tt = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * tt * (1 + 0.6 * np.exp(-tt * 30))) * np.exp(-tt * 14)).astype(np.float32)
def chime(fs=(1318.5, 1975.5, 2637.0), dur=2.2):
    n = int(dur * SR); tt = np.arange(n) / SR
    return sum(np.sin(2 * np.pi * f * tt) * np.exp(-tt * (2.2 + i)) / (i + 1) for i, f in enumerate(fs)).astype(np.float32) * 0.5
def riser(dur=2.6):
    n = int(dur * SR); tt = np.arange(n) / n
    no = rng.standard_normal(n).astype(np.float32); out = np.zeros(n, np.float32)
    for i in range(0, n, 1024): out[i:i + 1024] = lp(no[i:i + 1024], 200 + 5000 * (i / n) ** 2)
    return hp(out * tt ** 2, 150)
def impact():
    a = thump(48, 1.2) * 1.2; b = hp(whoosh(0.25), 800) * 0.3; a[:len(b)] += b; return a

main = open("src/_fed6/VideoEdit/Main_nrtinnitus.tsx", encoding="utf-8").read()
cues = [(float(s), el) for s, el in re.findall(r'startSec: ([0-9.]+), dur: [0-9.]+, el: \(d: number\) => (.{0,160})', main)]
words = json.load(open("_v3/nrtinnitus_wordms.json", encoding="utf-8"))
def at(phrase, after=0):
    nz = lambda s: s.lower().strip('.,"?!…'); ws = [nz(w["w"]) for w in words]; p = [nz(x) for x in phrase.split()]
    for i in range(len(ws)):
        if words[i]["ms"] / 1000 >= after and ws[i:i + len(p)] == p: return words[i]["ms"] / 1000
    return None
nw = nt = 0
for s, el in cues:
    if "<ChapterTitle" in el or "<PullQuote" in el or "<MythTruth" in el or "<FlowSteps" in el or "<NumberedSteps" in el or "<ChecklistReveal" in el or "<CutawayCallouts" in el or "<GaugeDial" in el or "<BigStatReveal" in el:
        put(s - 0.12, whoosh(), 0.55, 0.35 + 0.3 * rng.random()); nw += 1
    if "<StampBadge" in el: put(s + 0.25, impact(), 0.7); nw += 1
    if "<Lamina" in el:
        for k in re.findall(r'"at":([0-9.]+)', el): pass
# keys de la lámina: un whoosh suave en cada movimiento de cámara
for m in re.finditer(r'startSec: ([0-9.]+), dur: [0-9.]+, el: \(d: number\) => <Lamina\w*[^\n]*? keys=\{(\[[^\]]*\])\}', main):
    s0 = float(m.group(1))
    for k in json.loads(m.group(2)):
        if k["at"] > 0.5: put(s0 + k["at"] - 1.1, whoosh(0.9), 0.35); nw += 1
lam0 = min(s for s, el in cues if "<Lamina" in el)
put(lam0 - 2.6, riser(), 0.45)
c = at("oh, and by the way...", lam0) or at("oh, and by the way", lam0)
if c: put(c + 0.5, chime(), 0.6)
for ph in ("tap. tap. tap.",):
    s = at("tap.", 280)
    if s:
        for j in range(3): put(s + j * 0.42, thump(90, 0.25), 0.8); nt += 1
q = at("\"but i don't hate it anymore.\"") or at("but i don't hate it anymore.")
if q: put(q, chime((987.8, 1480.0, 1975.5), 2.8), 0.4)
# ── v3: primer minuto ──
def click(f=2200, dur=0.05):
    n = int(dur * SR); tt = np.arange(n) / SR
    return (hp(rng.standard_normal(n).astype(np.float32), 900) * np.exp(-tt * 90) * 0.8 + np.sin(2 * np.pi * f * tt) * np.exp(-tt * 120) * 0.3).astype(np.float32)
def glitch(dur=0.32):
    n = int(dur * SR); x = rng.standard_normal(n).astype(np.float32)
    gate = np.repeat((rng.random(n // 480 + 1) > 0.45).astype(np.float32), 480)[:n]
    return hp(x * gate, 300) * 0.6
def swell(dur=2.4, f=48):
    n = int(dur * SR); tt = np.arange(n) / SR; e = np.sin(np.pi * tt / dur) ** 2
    return (np.sin(2 * np.pi * f * tt) * 0.8 + lp(rng.standard_normal(n).astype(np.float32), 180) * 0.6) * e
def crack(dur=0.5):
    n = int(dur * SR); x = np.zeros(n, np.float32)
    for k in range(18):
        i = int(rng.random() * n * 0.8); m = int(SR * 0.004); x[i:i + m] += hp(rng.standard_normal(m).astype(np.float32), 1500) * (1 - k / 20)
    return x
put(0.58, glitch(), 0.7)
put(12.5, impact(), 0.8)
for j in range(7): put(20.2 + j * 1.3 / 6, click(1800 + j * 60), 0.55)
put(27.35, whoosh(0.5), 0.35); put(32.05, whoosh(0.45), 0.4)
put(35.5, click(900, 0.08), 0.7); put(35.52, thump(120, 0.15), 0.3)
put(36.9, click(2600, 0.04), 0.8)
put(39.4, swell(), 0.55); put(51.8, swell(2.8, 44), 0.6)
for s0 in (60.1, 61.2, 62.9):
    put(s0, thump(58, 0.3), 0.9); put(s0 + 0.28, thump(52, 0.3), 0.6)
put(70.0, impact(), 0.6); put(71.3, crack(), 0.9)
sfx = np.tanh(sfx * 0.9)
def save(p, x, g):
    x = np.clip(x * g, -1, 1); b = (x * 32767).astype("<i2").tobytes()
    with wave.open(p, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(b)
save(f"{OUT}/music.wav", music, 0.9); save(f"{OUT}/sfx.wav", sfx, 0.9)
print(f"música {DUR:.0f}s · SFX: {nw} whoosh/impactos · {nt} taps · riser @{lam0 - 2.6:.1f}s · chime CTA @{c}")
