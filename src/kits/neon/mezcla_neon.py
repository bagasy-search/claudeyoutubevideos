# Mezcla final del kit neon FUERA de Remotion (como cgordie1 → 0 desfase): voz + efectos de la pista, los efectos a la
# mitad mientras se habla, -14 LUFS / -1,5 dBTP. Nunca se estira ni remuestrea la voz (los efectos sí se remuestrean).
#   python mezcla_neon.py <eventos.json> <public/> <salida.wav> [voz.wav] [words.json] [duracion_s]
# Sin voz (escena de prueba) sale sólo la pista de efectos al mismo nivel relativo.
import json, sys, numpy as np, soundfile as sf
ev_p, pub, out = sys.argv[1:4]
voz_p = sys.argv[4] if len(sys.argv) > 4 and sys.argv[4] != '-' else None
words_p = sys.argv[5] if len(sys.argv) > 5 and sys.argv[5] != '-' else None
ev = json.load(open(ev_p, encoding='utf8'))
SR = 48000
if voz_p:
    voz, SR = sf.read(voz_p, always_2d=True)
    voz = voz[:, :2] if voz.shape[1] >= 2 else np.repeat(voz, 2, 1)
fin = max(t0 + d for t0, _, _, d in ev) + 0.5
TOTAL = float(sys.argv[6]) if len(sys.argv) > 6 else max(fin, len(voz) / SR if voz_p else 0)
N = int(TOTAL * SR)
v = np.zeros((N, 2))
if voz_p: v[:min(N, len(voz))] = voz[:N]
spk = np.zeros(N, bool)
if words_p:
    for x in json.load(open(words_p, encoding='utf8')):
        a = int(max(0, x['startMs'] / 1000 - 0.05) * SR); b = int((x['endMs'] / 1000 + 0.08) * SR); spk[a:b] = True
k = int(0.06 * SR); duck = 1 - 0.5 * np.clip(np.convolve(spk.astype(float), np.ones(k) / k, 'same'), 0, 1)
fx = np.zeros((N, 2)); cache = {}; miss = set()
for t0, name, vol, dur in ev:
    if name not in cache:
        try:
            a, s2 = sf.read(f'{pub}/{name}', always_2d=True)
        except Exception:
            miss.add(name); continue
        if s2 != SR:
            import scipy.signal as ss; a = ss.resample_poly(a, SR, s2, axis=0)
        cache[name] = a[:, :2] if a.shape[1] >= 2 else np.repeat(a, 2, 1)
    a = cache[name][:max(4, int(dur * SR))].copy(); fl = min(len(a), int(0.2 * SR)); a[-fl:] *= np.linspace(1, 0, fl)[:, None]
    i = int(max(0, t0) * SR); j = min(N, i + len(a)); fx[i:j] += a[:j - i] * vol
fx *= duck[:, None]
mix = v + fx
peak = 10 ** (-1.5 / 20)
if voz_p:
    import pyloudnorm as pyln
    m = pyln.Meter(SR); L = m.integrated_loudness(mix); mix *= 10 ** ((-14 - L) / 20)
else:
    mix *= 0.5 / max(1e-9, np.abs(mix).max())  # sólo efectos: pico -6 dB (van bajo la voz)
if np.abs(mix).max() > peak:
    g = np.minimum(1, peak / np.maximum(np.abs(mix).max(1), 1e-9)); kk = int(0.005 * SR)
    g = -np.convolve(-np.pad(g, (kk, kk), mode='edge'), np.ones(kk) / kk, 'same')[kk:-kk]
    mix *= np.minimum(1, g)[:, None]; mix = np.clip(mix, -peak, peak)
print('SR', SR, 'eventos', len(ev), 'faltan', sorted(miss), 'pico dB', round(20 * np.log10(np.abs(mix).max() + 1e-12), 2), 'dur', round(N / SR, 2))
sf.write(out, mix.astype(np.float32), SR, subtype='PCM_16')
