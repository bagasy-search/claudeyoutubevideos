# Comprime las pausas del máster de Fish: toda pausa > MAX se acorta a MAX (se saca el MEDIO de la pausa).
# uso: python pausas.py in.wav out.wav [max_s_min1=0.25] [max_s_resto=0.35] [corte_min1_s=75]
import sys, numpy as np, soundfile as sf
src, dst = sys.argv[1], sys.argv[2]
M1 = float(sys.argv[3]) if len(sys.argv) > 3 else 0.25
MR = float(sys.argv[4]) if len(sys.argv) > 4 else 0.35
T1 = float(sys.argv[5]) if len(sys.argv) > 5 else 75.0
x, sr = sf.read(src, dtype="float32")
mono = x if x.ndim == 1 else x.mean(1)
hop = int(sr * 0.01); n = len(mono) // hop
e = np.array([np.sqrt(np.mean(mono[i*hop:(i+1)*hop]**2) + 1e-12) for i in range(n)])
db = 20*np.log10(e + 1e-9); th = db.max() - 45
sil = db < th
runs = []; i = 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        runs.append((i, j)); i = j
    else: i += 1
keep = np.ones(len(mono), bool); quit_s = 0; cnt = 0
for a, b in runs:
    t = a*0.01; lim = M1 if t < T1 else MR
    L = (b - a)*0.01
    if a == 0 or b >= n or L <= lim: continue
    cut = L - lim; c0 = (a*0.01 + (L - cut)/2); s0 = int(c0*sr); s1 = int((c0 + cut)*sr)
    keep[s0:s1] = False; quit_s += cut; cnt += 1
y = x[keep]
sf.write(dst, y, sr, subtype="PCM_16")
print(f"pausas acortadas {cnt} · quitados {quit_s:.2f}s · {len(mono)/sr:.2f}s -> {len(y)/sr:.2f}s · umbral {th:.1f} dB")
