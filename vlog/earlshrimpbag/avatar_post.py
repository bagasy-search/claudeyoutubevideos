# Post del avatar RunPod: reel.mp4 → public/avatar_clips/earlshrimpbag/reel30.mp4 (1920x1080, 30/1 CFR, mudo) y LAG por ventana
# (correlación de la envolvente del audio que devolvió RunPod contra el reel.wav que se le mandó) → _v3/earlshrimpbag_avwin.json.
# Compuerta: dur(mp4) ≈ dur(reel.wav) (cap medido ~600 s); si viene corto, NO se asume nada: exit 2.
import json, subprocess, sys, numpy as np, os
R = "D:/Proyectos/video2-wt/earlshrimpbag/"
SRC, WAV = R + "out/avatar/reel.mp4", R + "out/avatar/reel.wav"
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
dm, dw = dur(SRC), dur(WAV)
print(f"reel.mp4 {dm:.2f} s · reel.wav {dw:.2f} s · diferencia {dm - dw:+.2f} s")
if dm < dw - 0.6:
    print("⛔ el mp4 volvió MÁS CORTO que el audio (cap): falta la cola → DUDA antes de un 2º /run"); sys.exit(2)
def env(f, sr=8000):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vn", "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32)
    hop = 80  # 10 ms
    n = len(x) // hop
    return np.sqrt((x[: n * hop].reshape(n, hop) ** 2).mean(1) + 1e-6)
A, B = env(SRC), env(WAV)
W = json.load(open(R + "_v3/earlshrimpbag_avwin.json"))
lags = []
for w in W["win"]:
    c0 = int(w["off"] * 100); c1 = int((w["off"] + (w["me"] - w["ms"])) * 100)
    b = B[c0:c1]
    if len(b) < 50: w["lag"] = 0.0; continue
    best, bl = -1e9, 0
    for L in range(-40, 41):  # ±0,4 s
        a = A[c0 + L:c1 + L] if c0 + L >= 0 and c1 + L <= len(A) else None
        if a is None or len(a) != len(b): continue
        r = np.corrcoef(a, b)[0, 1]
        if r > best: best, bl = r, L
    w["lag"] = bl / 100.0; w["corr"] = round(float(best), 3); lags.append(bl / 100.0)
json.dump(W, open(R + "_v3/earlshrimpbag_avwin.json", "w"), indent=1)
print(f"lag por ventana (s): min {min(lags):+.2f} · max {max(lags):+.2f} · mediana {np.median(lags):+.2f} · {len(lags)} ventanas")
os.makedirs(R + "public/avatar_clips/earlshrimpbag", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-an", "-vf", f"scale=1920:1080:flags=lanczos,fps=30,tpad=stop_mode=clone:stop_duration=2,format=yuv420p", "-t", f"{max(dm, dw) + 1:.3f}", "-r", "30", "-c:v", "libx264", "-crf", "18", "-preset", "veryfast", "-g", "30", R + "public/avatar_clips/earlshrimpbag/reel30.mp4"], check=True)
print("OK public/avatar_clips/earlshrimpbag/reel30.mp4", dur(R + "public/avatar_clips/earlshrimpbag/reel30.mp4"))
