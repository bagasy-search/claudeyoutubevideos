# empalma líneas regrabadas en el máster comprimido sin mover el resto: inserta f1+f2 tras s5_10 y reemplaza s8_07+s8_07x por f3
# (corre UNA vez sobre tramos.json/captions_c.json de align.py; escribe master_c2.wav y los reescribe)
import json, wave, numpy as np, subprocess
R = "D:/Proyectos/video2-wt/tfbpiedra/"
tr = json.load(open(R + "vlog/tfbpiedra/tramos.json", encoding="utf-8"))
assert len(tr) == 135, "ya empalmado"
def rd(f):
    w = wave.open(f); sr = w.getframerate(); ch = w.getnchannels()
    x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, ch).mean(1).astype(np.int16); return x, sr
M, sr = rd(R + "out/tfbpiedra/master_c.wav")
def fix(i):
    x, _ = rd(R + f"out/fix/f{i}/master.wav")
    a = np.abs(x.astype(np.float32)) / 32768; db = 20 * np.log10(np.convolve(a, np.ones(441) / 441, "same") + 1e-9); idx = np.where(db > -40)[0]
    x = x[max(0, idx[0] - int(0.03 * sr)):idx[-1] + int(0.06 * sr)]
    return np.concatenate([np.zeros(int(0.12 * sr), np.int16), x, np.zeros(int(0.16 * sr), np.int16)])
T = [t["t"] for t in tr]
i10 = next(k for k, t in enumerate(T) if t.startswith("Y también cambia con el cemento"))
i7 = next(k for k, t in enumerate(T) if t.startswith("Y elegir el sellador"))
assert "cuál sirve" in T[i7 + 1], T[i7 + 1]
S = lambda t: int(round(t * sr))
f1, f2, f3 = fix(1), fix(2), fix(3)
new, out = [], []; pos = 0.0
def add(seg, text):
    global pos
    new.append(seg); d = len(seg) / sr; out.append({"s": pos, "e": pos + d, "d": d, "t": text}); pos += d
for k, t in enumerate(tr):
    if k == i7 + 1: continue
    if k == i7: add(f3, "Y ojo al elegir el sellador: no todos sirven para afuera. Que la etiqueta diga que es para exterior, y para piedra o concreto."); continue
    add(M[S(t["s"]):S(t["e"])], t["t"])
    if k == i10:
        add(f1, "Y esa es la idea de toda la colección del canal: cada arreglo con sus materiales y sus medidas,")
        add(f2, "y con la prueba para saber si te salió bien. El enlace te lo dejé abajo.")
y = np.concatenate(new)
w = wave.open(R + "out/tfbpiedra/master_c2.wav", "wb"); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes()); w.close()
for i, o in enumerate(out): o["i"] = i
json.dump(tr, open(R + "vlog/tfbpiedra/tramos_v1.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
json.dump(out, open(R + "vlog/tfbpiedra/tramos.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
caps = json.load(open(R + "vlog/tfbpiedra/captions_c.json", encoding="utf-8"))
ins_at = tr[i10]["e"]; add12 = (len(f1) + len(f2)) / sr; rep_s = tr[i7]["s"]; rep_e = tr[i7 + 1]["e"]; dd = len(f3) / sr - (rep_e - rep_s)
nc = []
for c in caps:
    t = c["startMs"] / 1000
    if rep_s <= t < rep_e: continue
    sh = (add12 if t >= ins_at else 0) + (dd if t >= rep_e else 0)
    nc.append({**c, "startMs": round(c["startMs"] + sh * 1000), "endMs": round(c["endMs"] + sh * 1000)})
json.dump(nc, open(R + "vlog/tfbpiedra/captions_c.json", "w", encoding="utf-8"), ensure_ascii=False)
print("tramos", len(out), "dur %.2f" % pos, "i10", i10, "i7", i7)
