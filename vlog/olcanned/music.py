# Cama musical PROPIA (cero riesgo de Content ID): guitarra acústica fingerpicking folk (Karplus-Strong)
# + bajo pulsado suave, en Sol, tempo lento de fogón. Sintetizada en código, determinista.
# python vlog/olcanned/music.py <segundos> <out.m4a> [lufs=-37]
import sys, subprocess, numpy as np, wave, os
from scipy.signal import lfilter, fftconvolve
SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]; LUFS = float(sys.argv[3]) if len(sys.argv) > 3 else -37.0
rng = np.random.default_rng(11)
BPM = 76; beat = 60 / BPM; e8 = beat / 2
def hz(n): return 440 * 2 ** ((n - 69) / 12)

def pluck(f, length, vel, bright=0.5):
    """Karplus-Strong con cuerpo: cuerda de acero amortiguada."""
    n = int(length * SR); p = max(2, int(SR / f))
    buf = (rng.random(p) * 2 - 1) * vel
    # filtro de púa: más oscuro con bright bajo
    for _ in range(int(3 - 2 * bright)): buf = 0.5 * (buf + np.roll(buf, 1))
    y = np.zeros(n, np.float32); d = 0.996 - 0.004 * (f / 800)
    b = buf.copy(); i = 0
    for k in range(n):
        v = b[i]; nx = b[(i + 1) % p]
        b[i] = d * 0.5 * (v + nx); y[k] = v; i = (i + 1) % p
    env = np.minimum(1, np.arange(n) / (0.002 * SR))
    return y * env

# cuerpo de guitarra: resonancias suaves
def body(x):
    out = x.copy()
    for fr, q, g in [(110, 8, 0.25), (210, 6, 0.18), (420, 5, 0.1)]:
        w = 2 * np.pi * fr / SR; r = np.exp(-w / (2 * q))
        a1, a2 = -2 * r * np.cos(w), r * r
        res = lfilter([1.0], [1.0, a1, a2], x)
        out += g * res / (np.abs(res).max() + 1e-9) * np.abs(x).max()
    return out

# progresión folk en Sol (G - Em - C - D / G - C - G/B - D), 1 compás = 4 tiempos
CH = {"G": [43, 47, 50, 55, 59, 67], "Em": [40, 47, 52, 55, 59, 64], "C": [48, 52, 55, 60, 64, 67], "D": [50, 54, 57, 62, 66, 69], "Am": [45, 52, 57, 60, 64, 69]}
PROG = ["G", "Em", "C", "D", "G", "C", "Am", "D", "G", "Em", "C", "G", "Am", "C", "D", "D"]
# patrón de fingerpicking (índices de cuerda por corchea): pulgar alterna bajo, dedos arriba
PAT = [0, 3, 1, 4, 0, 3, 2, 5]
bar = 4 * beat
nbars = int(dur / bar) + 2
L = int((nbars * bar + 3) * SR)
mix = np.zeros(L, np.float32)
cache = {}
for b in range(nbars):
    ch = CH[PROG[b % len(PROG)]]
    for k, s in enumerate(PAT):
        t = b * bar + k * e8 + (rng.random() - 0.5) * 0.012  # humanizado
        note = ch[s] + (12 if (b // 16) % 2 == 1 and s >= 4 and k % 4 == 3 else 0)
        vel = (0.55 if s in (0, 1) else 0.34) * (0.9 + 0.2 * rng.random())
        key = (note, round(vel, 2))
        if key not in cache: cache[key] = pluck(hz(note), 2.6, vel, 0.45 if s < 2 else 0.6)
        x = cache[key]; i0 = max(0, int(t * SR)); e = min(L, i0 + len(x)); mix[i0:e] += x[: e - i0]
    # bajo pulsado (raíz) en tiempos 1 y 3, muy suave
    for q in (0, 2):
        t = b * bar + q * beat; f = hz(ch[0] - 12 if ch[0] > 45 else ch[0])
        n = int(1.4 * SR); tt = np.arange(n) / SR
        x = 0.22 * np.sin(2 * np.pi * f * tt) * np.exp(-tt * 2.2) * np.minimum(1, tt / 0.01)
        i0 = int(t * SR); e = min(L, i0 + n); mix[i0:e] += x[: e - i0].astype(np.float32)
mix = body(mix[: int(dur * SR)])
# reverb corta de cuarto de troncos (convolución con ruido decreciente)
ir_n = int(0.9 * SR); ir = rng.normal(0, 1, ir_n) * np.exp(-np.arange(ir_n) / (0.22 * SR)); ir[0] = 6
wet = fftconvolve(mix, ir / np.abs(ir).sum() * 4)[: len(mix)]
y = 0.8 * mix + 0.35 * wet
fi, fo = int(3 * SR), int(4 * SR); y[:fi] *= np.linspace(0, 1, fi); y[-fo:] *= np.linspace(1, 0, fo)
y = (y / (np.abs(y).max() + 1e-9) * 0.8).astype(np.float32)
tmp = out + ".tmp.wav"
with wave.open(tmp, "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype(np.int16).tobytes())
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", tmp, "-af", f"loudnorm=I={LUFS}:TP=-9:LRA=7:linear=true", "-ac", "2", "-ar", "48000", "-c:a", "aac", "-b:a", "128k", out], check=True)
os.remove(tmp)
print("cama", out, dur, "s @", LUFS, "LUFS")
