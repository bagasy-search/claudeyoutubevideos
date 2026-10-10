# Post del avatar RunPod (Vaquero): vlog/<slug>/avatar/reel.mp4 → public/avatar_clips/<slug>/reel30.mp4 (1920x1080, 30 CFR, mudo)
# + LAG por ventana (envolvente del audio devuelto vs reel.wav enviado) → avwin.json. Compuerta: dur(mp4) ≈ dur(wav), si no exit 2.
#   SLUG=x python vlog/cv/avatar_post.py
import json, subprocess, sys, os, numpy as np
S = os.environ["SLUG"]; R = f"D:/Proyectos/video2-wt/{os.environ.get('WT', S)}/"; A = R + f"vlog/{S}/avatar/"
SRC, WAV = A + "reel.mp4", A + "reel.wav"
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
dm, dw = dur(SRC), dur(WAV)
print(f"reel.mp4 {dm:.2f} s · reel.wav {dw:.2f} s · diferencia {dm - dw:+.2f} s")
if dm < dw - 0.6: print("⛔ el mp4 volvió MÁS CORTO que el audio: falta la cola"); sys.exit(2)
def env(f, sr=8000):
    x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-vn", "-ac", "1", "-ar", str(sr), "-f", "s16le", "-"], capture_output=True).stdout, np.int16).astype(np.float32)
    n = len(x) // 80; return np.sqrt((x[: n * 80].reshape(n, 80) ** 2).mean(1) + 1e-6)
EA, EB = env(SRC), env(WAV)
W = json.load(open(A + "avwin.json")); lags = []
for w in W["win"]:
    c0 = int(w["off"] * 100); c1 = int((w["off"] + w["me"] - w["ms"]) * 100); b = EB[c0:c1]
    if len(b) < 50: w["lag"] = 0.0; continue
    best, bl = -1e9, 0
    for L in range(-120, 121):
        if c0 + L < 0 or c1 + L > len(EA): continue
        r = np.corrcoef(EA[c0 + L:c1 + L], b)[0, 1]
        if r > best: best, bl = r, L
    w["lag"] = bl / 100.0; w["corr"] = round(float(best), 3); lags.append(w["lag"])
json.dump(W, open(A + "avwin.json", "w"), indent=1)
print(f"MEDIDO lag por ventana (s): min {min(lags):+.2f} · max {max(lags):+.2f} · mediana {np.median(lags):+.2f} · corr mín {min(w.get('corr', 1) for w in W['win']):.2f}")
os.makedirs(R + f"public/avatar_clips/{S}", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", SRC, "-an", "-vf", "scale=1920:1080:flags=lanczos,fps=30,tpad=stop_mode=clone:stop_duration=2,format=yuv420p", "-t", f"{max(dm, dw) + 1:.3f}", "-r", "30", "-c:v", "libx264", "-crf", "16", "-preset", "veryfast", "-g", "30", R + f"public/avatar_clips/{S}/reel30.mp4"], check=True)
print("OK reel30", dur(R + f"public/avatar_clips/{S}/reel30.mp4"))
