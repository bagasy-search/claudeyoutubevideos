# Aplica cortes.json a un wav (fundido de 8 ms en cada unión, sin clics).  python aplicar_cortes.py in.wav out.wav
import json, sys, subprocess, numpy as np
D = "D:/Proyectos/video2-wt/furatones5/vlog/furatones5/"; SR = 48000; X = int(0.008 * SR)
src, dst = sys.argv[1], sys.argv[2]
info = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=channels", "-of", "csv=p=0", src], capture_output=True, text=True).stdout.split()[0]; ch = int(info)
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32).reshape(-1, ch)
C = json.load(open(D + "cortes.json")); keep, t = [], 0
for a, b in C: keep.append((t, a)); t = b
keep.append((t, len(x) / SR)); out = []
for a, b in keep:
    seg = x[int(a * SR):int(b * SR)].copy(); r = np.linspace(0, 1, X, dtype=np.float32)[:, None]
    if len(seg) > 2 * X: seg[:X] *= r; seg[-X:] *= r[::-1]
    out.append(seg)
y = np.concatenate(out)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", str(ch), "-i", "-", "-c:a", "pcm_s16le", dst], input=y.tobytes(), check=True)
print(dst, round(len(y) / SR, 2), "s")
