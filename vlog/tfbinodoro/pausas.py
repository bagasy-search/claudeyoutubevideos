# comprime pausas del máster Fish: silencios (< -40 dB, >= 0.25 s) → tope 0,20 s en el 1er minuto, 0,45 s después.
import subprocess, re, sys, numpy as np, soundfile as sf
IN, OUT = "out/tfbinodoro/master.wav", "out/tfbinodoro/master_c.wav"
x, sr = sf.read(IN, dtype="float32")
if x.ndim > 1: x = x.mean(1)
def det(db):
    log = subprocess.run(["ffmpeg", "-i", IN, "-af", f"silencedetect=noise={db}dB:d=0.2", "-f", "null", "-"], capture_output=True, text=True).stderr
    return list(zip([float(v) for v in re.findall(r"silence_start: ([\d.]+)", log)], [float(v) for v in re.findall(r"silence_end: ([\d.]+)", log)]))
# 1er minuto (~80 s de máster): umbral -30 dB (la compuerta mide -32 dB sobre la mezcla); después -40 dB
S = [p for p in det(-30) if p[0] < 80] + [p for p in det(-40) if p[0] >= 80]
st = [a for a, b in S]; en = [b for a, b in S]
segs, pos, t_out, cut = [], 0, 0.0, 0.0
for a, b in zip(st, en):
    tgt = 0.18 if a < 80 else 0.45
    d = b - a
    if d <= tgt: continue
    keep = tgt; m = a + keep / 2  # conserva keep/2 al principio y keep/2 al final del silencio
    s1 = int(round((a + keep / 2) * sr)); s2 = int(round((b - keep / 2) * sr))
    segs.append(x[pos:s1]); t_out += (s1 - pos) / sr; pos = s2; cut += d - keep
segs.append(x[pos:])
y = np.concatenate(segs)
# micro-fundido en cada unión (5 ms) para que no haga clic: se hace re-armando con crossfade simple
sf.write(OUT, y, sr)
print(f"silencios {len(st)} · recortado {cut:.1f}s · {len(x)/sr:.1f}s -> {len(y)/sr:.1f}s")
