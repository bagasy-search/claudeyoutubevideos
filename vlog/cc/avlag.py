# Deriva LINEAL de InfiniteTalk: el audio del reel.mp4 devuelto contra el reel.wav enviado, correlacionado por ventanas de 20 s.
# La boca va con el audio del mp4 → cuadro del reel para el tiempo T del wav = scale·T + lag.  → _v3/<slug>_lag<TAG>.json
#   SLUG=x [AVTAG=2] python vlog/cc/avlag.py
import json, os, subprocess, numpy as np
S = os.environ["SLUG"]; TAG = os.environ.get("AVTAG", ""); R = "D:/Proyectos/video2-wt/ccfrijoles/"; O = R + f"out/{S}_avatar{TAG}/"
SR = 8000
def load(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
a, b = load(O + "reel.wav"), load(O + "reel.mp4")
env = lambda x: np.sqrt(np.convolve(x * x, np.ones(80) / 80, "same"))[::40]   # envolvente a 200 Hz (5 ms)
A, B = env(a), env(b); F = SR / 40
W, M = int(20 * F), int(0.6 * F); pts = []
for s in range(M, len(A) - W - M, int(10 * F)):
    x = A[s:s + W] - A[s:s + W].mean(); best, bl = -1, 0
    for l in range(-M, M + 1):
        y = B[s + l:s + l + W]; y = y - y.mean(); c = float((x * y).sum() / (np.linalg.norm(x) * np.linalg.norm(y) + 1e-9))
        if c > best: best, bl = c, l
    if best > 0.6: pts.append((s / F + 10, bl / F))
t, l = np.array(pts).T; k, c0 = np.polyfit(t, l, 1); res = np.abs(l - (k * t + c0)).max()
json.dump({"scale": round(1 + k, 6), "lag": round(c0, 4), "pts": len(pts), "res": round(res, 3)}, open(R + f"_v3/{S}_lag{TAG}.json", "w"))
print(f"{S}{TAG}: scale {1 + k:.6f} · lag {c0 * 1000:+.0f} ms · {len(pts)} ventanas · residuo máx {res * 1000:.0f} ms · fin {(k * t[-1] + c0) * 1000:+.0f} ms")
