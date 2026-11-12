import sys, json, numpy as np, soundfile as sf, pyloudnorm as pyln
S = sys.argv[1]; SR = 48000
v, _ = sf.read('voz48.wav', dtype='float32')
cfg = json.load(open('sfx.json')); N = max(len(v), int(cfg['total'] * SR)) + SR
out = np.zeros((N, 2), np.float32); out[:len(v)] += v
# envolvente de la voz (para bajar la cama cuando habla)
env = np.abs(v).mean(1); w = int(0.25 * SR); env = np.convolve(env, np.ones(w) / w, 'same'); env = np.pad(env, (0, N - len(env)))
talk = np.clip(env / (env.max() * 0.08 + 1e-9), 0, 1)
def loop(fn, n):
    b, _ = sf.read(fn, dtype='float32'); b = b if b.ndim == 2 else np.stack([b, b], 1)
    r = np.tile(b, (n // len(b) + 2, 1))[:n]; return r / (np.abs(r).max() + 1e-9)
bed = loop('bed_wind2.wav', N) * 0.55 + loop('bed_wind.wav', N) * 0.25 + loop('bed_room.wav', N) * 0.35
# cama a ~-34 dBFS bajo la voz, sube a ~-28 en las pausas
g = (10 ** (-34 / 20)) * talk + (10 ** (-28 / 20)) * (1 - talk)
out += bed * g[:, None]
for x in cfg['sfx']:
    s, _ = sf.read('sfx/' + x['f'].replace('.mp3', '.wav'), dtype='float32'); s = s if s.ndim == 2 else np.stack([s, s], 1)
    i = int(x['t'] * SR); j = min(N, i + len(s)); out[i:j] += s[: j - i] * x['v']
out = out[: int(cfg['total'] * SR)]
m = pyln.Meter(SR); L = m.integrated_loudness(out); out = pyln.normalize.loudness(out, L, -14.0)
for _ in range(3):  # limitador suave: sólo los picos, la sonoridad queda en -14
    t = 0.7; a = np.abs(out); over = a > t
    out[over] = np.sign(out[over]) * (t + (0.89 - t) * np.tanh((a[over] - t) / (0.89 - t)))
    L = m.integrated_loudness(out); out = pyln.normalize.loudness(out, L, -14.0)
pk = np.abs(out).max()
if pk > 0.89: out *= 0.89 / pk
L2 = m.integrated_loudness(out)
# anti-mudo: ningún tramo de 2,5 s por debajo de -50 dBFS
blk = int(0.5 * SR); rms = [20 * np.log10(np.sqrt((out[i:i + blk] ** 2).mean()) + 1e-9) for i in range(0, len(out) - blk, blk)]
run = mx = 0
for r in rms: run = run + 1 if r < -50 else 0; mx = max(mx, run)
sf.write(f'{S}_mix.wav', out, SR, subtype='PCM_16')
res = {'lufs': round(L2, 2), 'peak_db': round(20 * np.log10(np.abs(out).max()), 2), 'mudo_max_s': mx * 0.5, 'dur': len(out) / SR}
print(res); json.dump(res, open('out/mix.json', 'w'))
assert mx * 0.5 < 2.5, 'tramo mudo'
