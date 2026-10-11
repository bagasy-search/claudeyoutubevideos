# Deriva de LABIOS medida en la IMAGEN (para reels cuyo audio es el wav remuxado y avlag.py da 0 = ciego):
# movimiento de la boca (diferencia de cuadros en la zona de la boca) contra la envolvente del reel.wav, por ventanas de 20 s.
# lag>0 = la boca va DETRÁS del wav.  SLUG=x [AVTAG=2] [ROI=x,y,w,h] python vlog/cc/lipdrift.py
import os, subprocess, numpy as np, json
S = os.environ["SLUG"]; TAG = os.environ.get("AVTAG", ""); R = "D:/Proyectos/video2-wt/ccfrijoles/"; O = R + f"out/{S}_avatar{TAG}/"
x, y, w, h = map(int, os.environ.get("ROI", "330,150,120,75").split(","))
FPS = 25
v = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", O + "reel.mp4", "-vf", f"crop={w}:{h}:{x}:{y},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout, np.uint8)
v = v.reshape(-1, h, w).astype(np.float32); mv = np.abs(np.diff(v, axis=0)).mean(axis=(1, 2)); mv = np.concatenate([[0], mv])
SR = 16000; a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", O + "reel.wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
hop = SR // 100; e = np.sqrt(np.convolve(a * a, np.ones(hop) / hop, "same"))[::hop]   # 100 Hz
ed = np.abs(np.diff(e, prepend=e[0]))
# movimiento a 100 Hz
t100 = np.arange(len(e)) / 100; mv100 = np.interp(t100, np.arange(len(mv)) / FPS, mv)
def z(s): s = s - np.convolve(s, np.ones(100) / 100, "same"); return s
A, B = z(e + 2 * ed), z(mv100)
W, M = 2000, 40; pts = []
for s in range(M, min(len(A), len(B)) - W - M, 1000):
    xa = A[s:s + W]; best, bl = -1, 0
    for l in range(-M, M + 1):
        yb = B[s + l:s + l + W]; c = float(((xa - xa.mean()) * (yb - yb.mean())).sum() / (xa.std() * yb.std() * W + 1e-9))
        if c > best: best, bl = c, l
    pts.append((s / 100 + 10, bl / 100, best))
for p in pts: print(f"t {p[0]:6.0f}  lag {p[1] * 1000:+5.0f} ms  r {p[2]:.2f}")
P = np.array([p for p in pts if p[2] > 0.25])
k, c0 = np.polyfit(P[:, 0], P[:, 1], 1)
print(f"{S}{TAG}: boca = wav·{1 + k:.6f} {c0 * 1000:+.0f} ms · {len(P)}/{len(pts)} ventanas · fin {(k * P[-1, 0] + c0) * 1000:+.0f} ms")
