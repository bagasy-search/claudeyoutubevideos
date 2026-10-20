# Sonidos sintéticos del kit neon: encendido de tubo (parpadeo + zumbido 120 Hz) y giro de tragamonedas (trinquete).
import numpy as np, soundfile as sf
SR = 48000; import os, sys
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '../../../../public/sfx/neon')
os.makedirs(OUT, exist_ok=True)
PARP = [0, 0.85, 0.1, 0.75, 0.25, 1, 0.5, 1, 1, 0.65, 1, 1, 1]
def hum(n, f0, rng):
    t = np.arange(n) / SR
    s = sum((0.9 / k ** 1.1) * np.sin(2 * np.pi * f0 * k * t + rng.uniform(0, 6.28)) for k in range(1, 9))
    s += 0.25 * np.sign(np.sin(2 * np.pi * f0 * t)) * 0.3  # aspereza del balasto
    return s
def neon_on(seed, f0):
    rng = np.random.default_rng(seed)
    dur = 1.05; n = int(dur * SR); t = np.arange(n) / SR
    env = np.zeros(n)
    seg = 0.42 / len(PARP)
    for i, v in enumerate(PARP):
        a = int(i * seg * SR); b = int((i + 1) * seg * SR); env[a:b] = v
    env[int(0.42 * SR):] = 1
    k = int(0.004 * SR); env = np.convolve(env, np.ones(k) / k, 'same')
    tail = np.clip((dur - t) / 0.45, 0, 1) ** 1.5
    s = hum(n, f0, rng) * 0.22 * env * tail
    # chasquidos en cada salto del parpadeo
    d = np.abs(np.diff(env, prepend=0))
    for i in np.where(d > 0.08)[0][::max(1, k // 2)]:
        L = int(0.012 * SR); j = min(n, i + L)
        s[i:j] += rng.normal(0, 1, j - i) * np.exp(-np.arange(j - i) / (0.002 * SR)) * 0.5 * d[i] / 0.5
    # siseo de gas al prender
    hiss = rng.normal(0, 1, n); hiss = np.convolve(hiss, [1, -0.95], 'same') * 0.02 * env * tail
    s = s + hiss
    st = np.stack([s, np.roll(s, int(0.0007 * SR))], 1)
    st /= np.abs(st).max() / 0.7
    sf.write(f'{OUT}/neon_on_{seed}.wav', st.astype(np.float32), SR, subtype='PCM_16')
for seed, f0 in [(1, 120), (2, 100), (3, 132)]: neon_on(seed, f0)
def slot_spin():
    rng = np.random.default_rng(7)
    dur = 1.7; n = int(dur * SR); s = np.zeros(n)
    t = 0.0
    while t < dur - 0.05:
        rate = 34 * min(1, (t + 0.05) / 0.25) * (1 - 0.65 * max(0, (t - 0.9) / 0.8))  # arranca, sostiene, frena
        i = int(t * SR); L = int(0.008 * SR); j = min(n, i + L)
        tick = rng.normal(0, 1, j - i) * np.exp(-np.arange(j - i) / (0.0015 * SR))
        tick += 0.6 * np.sin(2 * np.pi * 2400 * np.arange(j - i) / SR) * np.exp(-np.arange(j - i) / (0.002 * SR))
        s[i:j] += tick * rng.uniform(0.6, 1)
        t += 1 / max(8, rate)
    tt = np.arange(n) / SR
    whirr = rng.normal(0, 1, n); whirr = np.convolve(whirr, np.ones(40) / 40, 'same') * 0.6
    whirr *= np.clip(tt / 0.2, 0, 1) * np.clip((dur - tt) / 0.6, 0, 1)
    s = s * 0.5 + whirr * 0.5
    st = np.stack([s, np.roll(s, int(0.0005 * SR))], 1); st /= np.abs(st).max() / 0.6
    sf.write(f'{OUT}/slot_spin.wav', st.astype(np.float32), SR, subtype='PCM_16')
slot_spin()
print('ok')
