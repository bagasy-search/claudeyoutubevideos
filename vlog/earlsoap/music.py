# Cama musical PROPIA (cero riesgo de Content ID): piano folk americano cálido (Dockside Earl), sintetizado en código.
# python vlog/lorpies/music.py <segundos> <out.wav>
import sys, numpy as np, wave
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
rng = np.random.default_rng(59)
BPM = 66; beat = 60 / BPM; eighth = beat / 2
def midi(n): return 440 * 2 ** ((n - 5 - 69) / 12)
def piano(f, length, vel):
    t = np.arange(int(length * SR)) / SR
    s = np.zeros_like(t)
    for h in range(1, 9):
        det = 1 + (rng.random() - 0.5) * 0.0015
        s += (1 / h ** 1.35) * np.sin(2 * np.pi * f * h * det * t) * np.exp(-t * (0.9 + 0.55 * h))
    att = np.minimum(1, t / 0.006)
    s *= att * vel
    s[: int(0.004 * SR)] += rng.normal(0, 0.01, int(0.004 * SR)) * vel  # martillo
    return s
# progresiones tipo himno (C mayor), 4 compases de 4 tiempos
PROG = [
    [(48, [60, 64, 67, 72]), (43, [59, 62, 67, 71]), (45, [60, 64, 69, 72]), (41, [60, 65, 69, 72])],
    [(48, [60, 64, 67, 72]), (41, [60, 65, 69, 72]), (43, [59, 62, 67, 74]), (48, [60, 64, 67, 72])],
    [(45, [60, 64, 69, 72]), (40, [59, 64, 67, 71]), (41, [60, 65, 69, 72]), (43, [59, 62, 65, 67])],
    [(41, [57, 60, 65, 69]), (48, [60, 64, 67, 72]), (43, [62, 65, 67, 71]), (48, [60, 64, 67, 72])],
]
n = int(dur * SR) + SR * 24
L = np.zeros(n); Rr = np.zeros(n)
t = 0.0; phr = 0
MEL = [72, 74, 76, 79, 76, 74, 72, 69, 67, 69, 72, 74]
while t < dur:
    prog = PROG[phr % 4] if phr % 8 < 4 else PROG[(phr + 2) % 4]
    for bar, (bass, ch) in enumerate(prog):
        i0 = int(t * SR)
        b = piano(midi(bass), 3.5, 0.55); e = min(n, i0 + len(b)); L[i0:e] += b[: e - i0]; Rr[i0:e] += b[: e - i0] * 0.9
        pattern = [0, 2, 1, 3, 2, 1, 3, 2]
        for k, idx in enumerate(pattern):
            ti = t + k * eighth + (rng.random() - 0.5) * 0.012
            v = 0.26 + 0.06 * rng.random() - (0.05 if k % 2 else 0)
            s = piano(midi(ch[idx]), 2.2, v); j0 = max(0, int(ti * SR)); e = min(n, j0 + len(s))
            pan = 0.35 + 0.3 * (idx / 3)
            L[j0:e] += s[: e - j0] * (1 - pan) * 1.4; Rr[j0:e] += s[: e - j0] * pan * 1.4
        if phr % 2 == 1 and bar in (1, 3):  # melodía simple cada dos frases
            m = MEL[(phr * 3 + bar) % len(MEL)]
            s = piano(midi(m), 2.6, 0.32); j0 = int((t + beat * 2) * SR); e = min(n, j0 + len(s)); L[j0:e] += s[: e - j0]; Rr[j0:e] += s[: e - j0]
        t += beat * 4
    phr += 1
def reverb(x):
    y = np.zeros_like(x)
    for d, g in [(1557, 0.78), (1617, 0.77), (1491, 0.79), (1422, 0.8)]:
        c = np.zeros_like(x); c[:] = x
        for i in range(d, len(x), d): c[i:i + d] += g * c[i - d:i][: len(c[i:i + d])]
        y += c * 0.25
    return x * 0.75 + y * 0.35
L = reverb(L)[: int(dur * SR)]; Rr = reverb(Rr)[: int(dur * SR)]
st = np.stack([L, Rr], 1); st /= np.max(np.abs(st)) + 1e-9; st *= 0.8
fade = int(3 * SR); st[:fade] *= np.linspace(0, 1, fade)[:, None]; st[-fade:] *= np.linspace(1, 0, fade)[:, None]
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st * 32767).astype(np.int16).tobytes())
print(out, dur)
