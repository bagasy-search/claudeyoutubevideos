# Mezcla de un video dom16: los segmentos de audio de los clips Veo en el orden de la edl + cama de room tone continua.
import json, os, numpy as np, soundfile as sf, pyloudnorm as pyln
S = os.environ['S']; SR = 48000
plan = json.load(open('mix_plan.json')); N = int(plan['dur'] * SR) + SR
out = np.zeros((N, 2), np.float32)
db = lambda x: 10 ** (x / 20)
cache = {}
def wav(c):
    if c not in cache:
        a, sr = sf.read(f'v/{c}.wav', dtype='float32'); cache[c] = a if a.ndim == 2 else np.stack([a, a], 1)
    return cache[c]
F = int(0.012 * SR)  # 12 ms de fundido en cada borde: cortes secos sin clic
mudos = []
for s in plan['segs']:
    a = wav(s['c']); i0 = int(s['a'] * SR); i1 = min(len(a), int(s['b'] * SR)); seg = a[i0:i1].copy()
    if len(seg) < 2 * F: continue
    rms = np.sqrt((seg ** 2).mean())
    if rms < 1e-3: mudos.append(s['c'])
    ramp = np.linspace(0, 1, F, dtype=np.float32)[:, None]; seg[:F] *= ramp; seg[-F:] *= ramp[::-1]
    seg *= db(s.get('g', 0.0))
    t = int(s['t0'] * SR); j = min(N, t + len(seg)); out[t:j] += seg[: j - t]
# cama de room tone: los tramos más calmos (percentil 20 de RMS por bloque de 0,5 s) de todos los clips, en bucle a -42 dBFS RMS
blk = SR // 2; calmos = []
for c, a in cache.items():
    for i in range(int(0.5 * SR), len(a) - blk, blk):
        b = a[i:i + blk]; r = np.sqrt((b ** 2).mean())
        if r > 1e-4: calmos.append((r, c, i))
calmos.sort(); calmos = calmos[: max(20, len(calmos) // 5)]
rng = np.random.default_rng(7); cama = np.zeros_like(out); t = 0; X = int(0.08 * SR)
while t < N:
    r, c, i = calmos[rng.integers(len(calmos))]; b = cache[c][i:i + blk].copy(); b /= (np.sqrt((b ** 2).mean()) + 1e-9)
    ramp = np.linspace(0, 1, X, dtype=np.float32)[:, None]; b[:X] *= ramp; b[-X:] *= ramp[::-1]
    j = min(N, t + blk); cama[t:j] += b[: j - t]; t += blk - X
out += cama * db(-42)
out = out[: int(plan['dur'] * SR)]
def limitar(x, tope=0.84, B=240):
    nb = len(x) // B + 1; a = np.abs(np.pad(x, ((0, nb * B - len(x)), (0, 0)))).max(1).reshape(nb, B).max(1)
    g = np.minimum(1.0, tope / (a + 1e-9)); g = np.minimum.reduce([g, np.roll(g, -1), np.roll(g, -2), np.roll(g, 1)])
    gs = np.empty_like(g); prev = 1.0
    for i in range(nb): prev = min(g[i], prev + 0.08); gs[i] = prev
    gg = np.repeat(gs, B)[: len(x)]; k = np.ones(B) / B; gg = np.minimum(np.convolve(gg, k, 'same'), np.repeat(g, B)[: len(x)])
    return np.clip(x * gg[:, None], -0.95, 0.95)
m = pyln.Meter(SR)
for _ in range(4):
    L = m.integrated_loudness(out); out = pyln.normalize.loudness(out, L, -14.0); out = limitar(out)
L2 = m.integrated_loudness(out)
rms = [20 * np.log10(np.sqrt((out[i:i + blk] ** 2).mean()) + 1e-9) for i in range(0, len(out) - blk, blk)]
run = mx = 0
for r in rms: run = run + 1 if r < -50 else 0; mx = max(mx, run)
min60 = [round(20 * np.log10(np.sqrt((out[i:i + 60 * SR] ** 2).mean()) + 1e-9), 1) for i in range(0, len(out) - 10 * SR, 60 * SR)]
sf.write(f'{S}_mix.wav', out, SR, subtype='PCM_16')
res = {'lufs': round(L2, 2), 'peak_db': round(20 * np.log10(np.abs(out).max()), 2), 'mudo_max_s': mx * 0.5, 'min60_db': min(min60),
       'dur': len(out) / SR, 'clips_mudos': mudos}
print(res); json.dump(res, open('out/mix.json', 'w'))
assert mx * 0.5 < 2.5, 'tramo mudo'
assert min(min60) > -45, 'un minuto bajo -45 dB'
