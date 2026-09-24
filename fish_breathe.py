# -*- coding: utf-8 -*-
"""fish_breathe — alarga las PAUSAS de un master de Fish para que la respiracion
coincida con la de la voz de referencia real.

Por que existe: medido sobre el canal Golden Remedies (ago 2026), Fish s2.1
devuelve pausas de ~0.46s de mediana contra los ~0.73s de la narracion humana
de referencia, y NO cambia con temperature, top_p, la referencia clonada ni la
densidad de tags [pause]. El techo es del modelo. Como el creador juzga la voz
por respiracion y caidas de tono (no por diccion), esta es la palanca que mueve
la aguja.

Metodo: detecta los silencios reales (>= MINPAUSE) y los estira por FACTOR
repitiendo el ROOM TONE del propio silencio (con crossfade), nunca insertando
ceros digitales, que suenan a corte. El habla no se toca: ni pitch ni tempo.

    python fish_breathe.py <in.wav> <out.wav> [factor] [minpause]
"""
import sys
import numpy as np
from scipy.io import wavfile

SRC = sys.argv[1]
DST = sys.argv[2]
FACTOR = float(sys.argv[3]) if len(sys.argv) > 3 else 1.59
MINPAUSE = float(sys.argv[4]) if len(sys.argv) > 4 else 0.20
MAXPAUSE = 2.60          # techo: no queremos huecos muertos
XF = 0.006               # crossfade 6 ms en cada empalme

sr, x = wavfile.read(SRC)
if x.ndim > 1:
    x = x.mean(axis=1)
orig_dtype = x.dtype
x = x.astype(np.float64)
peak = np.abs(x).max() + 1e-9

# ---- deteccion de silencios (mismo criterio con el que se midio la referencia)
HOP, WIN = int(0.010 * sr), int(0.030 * sr)
n = (len(x) - WIN) // HOP
rms = np.array([np.sqrt(np.mean((x[i * HOP:i * HOP + WIN] / peak) ** 2)) for i in range(n)])
db = 20 * np.log10(rms + 1e-9)
thr = np.percentile(db, 10) + 8
quiet = db < thr

runs = []
i = 0
while i < n:
    if quiet[i]:
        j = i
        while j < n and quiet[j]:
            j += 1
        if (j - i) * 0.010 >= MINPAUSE:
            runs.append((i * HOP, min(j * HOP, len(x))))
        i = j
    else:
        i += 1

xf = int(XF * sr)


def tile_roomtone(seg, need):
    """Genera `need` muestras de room tone repitiendo seg con crossfade."""
    if need <= 0:
        return np.zeros(0)
    if len(seg) < 4 * xf:
        return np.zeros(need)                      # silencio muy corto: no hay tono que repetir
    body = seg[xf:len(seg) - xf]
    out = []
    have = 0
    prev = None
    while have < need:
        piece = body.copy()
        if prev is not None and len(piece) > xf and len(out) and len(out[-1]) > xf:
            w = np.linspace(0, 1, xf)
            out[-1][-xf:] = out[-1][-xf:] * (1 - w) + piece[:xf] * w
            piece = piece[xf:]
        out.append(piece)
        have += len(piece)
        prev = piece
    return np.concatenate(out)[:need]


pieces = []
cur = 0
added = 0
stats_old, stats_new = [], []
for a, b in runs:
    pieces.append(x[cur:a])
    seg = x[a:b]
    L = len(seg) / sr
    tgt = min(L * FACTOR, MAXPAUSE)
    need = int(max(0.0, tgt - L) * sr)
    pieces.append(seg)
    if need > 0:
        pieces.append(tile_roomtone(seg, need))
        added += need
    stats_old.append(L)
    stats_new.append(L + need / sr)
    cur = b
pieces.append(x[cur:])

y = np.concatenate(pieces)
y = np.clip(y, -peak, peak)
wavfile.write(DST, sr, y.astype(orig_dtype))

so, sn = np.array(stats_old), np.array(stats_new)
print('pausas detectadas : %d' % len(runs))
print('mediana  %.2fs -> %.2fs' % (np.median(so), np.median(sn)))
print('p90      %.2fs -> %.2fs' % (np.percentile(so, 90), np.percentile(sn, 90)))
print('silencio %.1f%% -> %.1f%%' % (100 * so.sum() * sr / len(x), 100 * sn.sum() * sr / len(y)))
print('duracion %.1f min -> %.1f min  (+%.1f min)'
      % (len(x) / sr / 60, len(y) / sr / 60, added / sr / 60))
