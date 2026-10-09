# Cama musical PROPIA (cero riesgo de Content ID): guitarra folk acústica fingerpicking sintetizada en código (Karplus-Strong),
# lenta, con un violín-pad muy suave. python vlog/olsup/music_ole.py <segundos> <out.wav>
import sys, numpy as np, wave
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
rng = np.random.default_rng(11)
BPM = 66; beat = 60 / BPM; eighth = beat / 2
def midi(n): return 440 * 2 ** ((n - 69) / 12)

_C = {}
def pluck(f, length, vel, bright=0.5):
    k = (round(f, 2), length, bright)
    if k not in _C: _C[k] = _pluck(f, length, 1.0, bright)
    return _C[k] * vel

def _pluck(f, length, vel, bright=0.5):
    n = int(length * SR)
    N = int(SR / f)
    buf = rng.uniform(-1, 1, N) * vel
    # filtrar el ruido inicial (cuerda de nylon/acero suave)
    for _ in range(int(3 + (1 - bright) * 6)):
        buf = 0.5 * (buf + np.roll(buf, 1))
    y = np.zeros(n)
    i = 0; damp = 0.9965
    for k in range(n):
        y[k] = buf[i]
        j = (i + 1) % N
        buf[i] = damp * 0.5 * (buf[i] + buf[j])
        i = j
    return y * np.minimum(1, np.arange(n) / (0.002 * SR))

def pad(f, length, vel):
    t = np.arange(int(length * SR)) / SR
    s = np.zeros_like(t)
    for d in (-0.004, 0, 0.004):
        s += np.sin(2 * np.pi * f * (1 + d) * t + 0.3 * np.sin(2 * np.pi * 4.7 * t))
    env = np.minimum(1, t / 1.6) * np.minimum(1, (length - t) / 2.0)
    return s * env * vel / 3

# Sol mayor, folk: G  Em  C  D  |  G  C  D  G   (cada acorde 2 compases de 4/4)
CH = [(43, [55, 59, 62, 67]), (40, [52, 55, 59, 64]), (48, [55, 60, 64, 67]), (50, [54, 57, 62, 66]),
      (43, [55, 59, 62, 67]), (48, [55, 60, 64, 67]), (50, [54, 57, 62, 66]), (43, [55, 59, 62, 67])]
PATT = [0, 2, 1, 3, 2, 1, 3, 1]  # fingerpicking en corcheas sobre las 4 notas del acorde
n = int(dur * SR) + SR * 12
L = np.zeros(n); Rr = np.zeros(n)
t = 0.0; ci = 0
while t < dur:
    bass, notes = CH[ci % len(CH)]
    for bar in range(2):
        for e in range(8):
            at = t + (bar * 8 + e) * eighth
            if at >= dur: break
            if e == 0:
                v = pluck(midi(bass), 3.2, 0.55, 0.3)
            else:
                nn = notes[PATT[e]] + (12 if e in (3, 7) else 0)
                v = pluck(midi(nn), 2.4, 0.30 + 0.06 * rng.random(), 0.5)
            i0 = int(at * SR); pan = 0.35 + 0.3 * rng.random()
            m = min(len(v), n - i0)
            L[i0:i0 + m] += v[:m] * (1 - pan); Rr[i0:i0 + m] += v[:m] * pan
    # pad de cuerdas muy suave sobre el acorde
    pd = pad(midi(notes[1] + 12), 16 * eighth + 1.5, 0.05)
    i0 = int(t * SR); m = min(len(pd), n - i0)
    L[i0:i0 + m] += pd[:m]; Rr[i0:i0 + m] += pd[:m]
    t += 16 * eighth; ci += 1
L = L[: int(dur * SR)]; Rr = Rr[: int(dur * SR)]
# reverb sencilla (cola de ruido decreciente, 1,4 s)
ir = rng.normal(0, 1, int(1.4 * SR)) * np.exp(-np.arange(int(1.4 * SR)) / (0.35 * SR)); ir /= np.abs(ir).sum()
def rv(x):
    from numpy.fft import rfft, irfft
    N = 1 << int(np.ceil(np.log2(len(x) + len(ir))))
    return irfft(rfft(x, N) * rfft(ir, N), N)[: len(x)]
Lw = 0.75 * L + 0.55 * rv(L); Rw = 0.75 * Rr + 0.55 * rv(Rr)
y = np.stack([Lw, Rw], 1); y /= np.abs(y).max() * 1.05
with wave.open(out, "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
print("ok", out, dur)
