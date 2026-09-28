# compress.py <in.wav> <out.wav> — pausas > MAXP se acortan a MAXP (la voz es el máster continuo, sin silencios muertos)
import sys, numpy as np, soundfile as sf
x, sr = sf.read(sys.argv[1]); mono = x if x.ndim == 1 else x.mean(1)
MAXP1, MAXP2, T1 = 0.24, 0.42, 66.0; hop = int(sr * 0.01)
n = len(mono) // hop; e = np.array([np.sqrt(np.mean(mono[i*hop:(i+1)*hop] ** 2) + 1e-12) for i in range(n)])
db = 20 * np.log10(e + 1e-9); th = db.max() - 40
sil = db < th; keep = np.ones(len(mono), bool); i = 0; cut = 0; npz = 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        L = (j - i) * 0.01
        MAXP = MAXP1 if i * 0.01 - cut < T1 else MAXP2
        if L > MAXP and i > 0 and j < n:
            a = i * hop + int(MAXP / 2 * sr); b = j * hop - int(MAXP / 2 * sr)
            keep[a:b] = False; cut += (b - a) / sr; npz += 1
        i = j
    else: i += 1
y = x[keep]
# micro-fundido en cada unión para que no haga click
sf.write(sys.argv[2], y, sr)
print(f'pausas acortadas {npz} · recortado {cut:.1f}s · {len(x)/sr:.1f}s → {len(y)/sr:.1f}s')
