# acorta toda pausa (< -38 dBFS RMS en ventanas de 10 ms) de más de 0,25 s a 0,22 s, cortando del medio. Guarda el mapa.
import wave, numpy as np, json, sys
src, dst = sys.argv[1], sys.argv[2]
w = wave.open(src); sr = w.getframerate(); ch = w.getnchannels(); sw = w.getsampwidth()
x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch)
m = x.astype(np.float32).mean(1) / 32768
hop = sr // 100; n = len(m) // hop
db = 20 * np.log10(np.sqrt((m[:n*hop].reshape(n, hop) ** 2).mean(1)) + 1e-9)
sil = db < -38
keep = np.ones(len(x), bool); cuts = []; i = 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        L = (j - i) / 100
        cap = 0.22 if i / 100 < 75 else 0.34      # 1er minuto (+ margen): cero silencios; resto: pausa natural corta
        if L > cap + 0.03 and i > 0 and j < n:
            drop = L - cap; a = i * hop + int((cap / 2) * sr); b = a + int(drop * sr)
            keep[a:b] = False; cuts.append([round(a / sr, 3), round(drop, 3)])
        i = j
    else: i += 1
y = x[keep]
o = wave.open(dst, "wb"); o.setnchannels(ch); o.setsampwidth(sw); o.setframerate(sr); o.writeframes(y.tobytes()); o.close()
json.dump(cuts, open(dst + ".cuts.json", "w"))
print("pausas acortadas", len(cuts), "· quitado %.2f s" % sum(c[1] for c in cuts), "· dur", round(len(y) / sr, 2))
