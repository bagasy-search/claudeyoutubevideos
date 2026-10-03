# Acorta los silencios de voz de los primeros 123 s del máster a 0,34 s (el 1er ítem tiene que cerrar antes de 2:00).
import subprocess, re, numpy as np, sys
SRC, DST, TMAX, KEEP = "out/earlboil/master.wav", "public/earlboil.wav", 123.0, 0.30
o = subprocess.run(["ffmpeg", "-hide_banner", "-t", str(TMAX), "-i", SRC, "-af", "silencedetect=noise=-30dB:d=0.36", "-f", "null", "-"], capture_output=True, text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([0-9.]+)", o)]; en = [float(x) for x in re.findall(r"silence_end: ([0-9.]+)", o)]
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", SRC, "-f", "s16le", "-ac", "1", "-ar", "44100", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.int16); SR = 44100
cuts = []
for a, b in zip(st, en):
    if a < 0.5: continue
    d = b - a; rm = d - KEEP
    if rm > 0.02: m = (a + b) / 2; cuts.append((m - rm / 2, m + rm / 2))
keep = []; p = 0
for a, b in cuts: keep.append(x[p:int(a * SR)]); p = int(b * SR)
keep.append(x[p:])
y = np.concatenate(keep)
fade = int(0.004 * SR)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", DST], input=y.tobytes(), check=True)
print("silencios recortados", len(cuts), "· quitado", round(sum(b - a for a, b in cuts), 2), "s · nuevo largo", round(len(y) / SR, 2))
