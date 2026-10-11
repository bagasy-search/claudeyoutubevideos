# Labios MEDIDOS en el reel de InfiniteTalk: cara por Haar (OpenCV) → zona de la boca → apertura (fracción de píxeles oscuros
# dentro de la boca) vs envolvente del reel.wav, por ventanas. lag>0 = la boca va DETRÁS de la voz.
#   SLUG=x [AVTAG=2] python vlog/cc/lipopen.py
import os, subprocess, numpy as np, cv2
S = os.environ["SLUG"]; TAG = os.environ.get("AVTAG", ""); O = f"D:/Proyectos/video2-wt/ccfrijoles/out/{S}_avatar{TAG}/"
cap = cv2.VideoCapture(O + "reel.mp4"); FPS = cap.get(cv2.CAP_PROP_FPS)
# la cabeza se mueve poco: seguimos la cara (bigote+barba) por plantilla y medimos la boca relativa a ella
FX, FY, FW, FH = map(int, os.environ.get("FACE", "320,120,140,130").split(","))   # caja de cara en 832x464 (cuadro 0)
MX, MY, MW, MH = map(int, os.environ.get("MOUTH", "50,54,48,26").split(","))       # boca dentro de esa caja
op = []; tpl = None
while True:
    ok, fr = cap.read()
    if not ok: break
    g = cv2.cvtColor(fr, cv2.COLOR_BGR2GRAY)
    if tpl is None: tpl = g[FY:FY + FH, FX:FX + FW].copy(); x, y = FX, FY
    else:
        x0, y0 = max(0, x - 30), max(0, y - 30); reg = g[y0:y0 + FH + 60, x0:x0 + FW + 60]
        r = cv2.matchTemplate(reg, tpl, cv2.TM_CCOEFF_NORMED); _, _, _, mx = cv2.minMaxLoc(r); x, y = x0 + mx[0], y0 + mx[1]
    m = g[y + MY:y + MY + MH, x + MX:x + MX + MW].astype(np.float32)
    op.append((float(m.mean()), float(m.std())))
op = np.array(op); SIG = int(os.environ.get("SIG", "1")); op = op[:, SIG] * (-1 if SIG == 0 else 1)
SR = 16000; a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", O + "reel.wav", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
hop = SR // 100; e = np.sqrt(np.convolve(a * a, np.ones(hop * 4) / (hop * 4), "same"))[::hop]
t = np.arange(len(e)) / 100; o = np.interp(t, np.arange(len(op)) / FPS, op)
hp = lambda s: np.convolve(s, np.ones(6) / 6, "same") - np.convolve(s, np.ones(40) / 40, "same")   # banda sílabas ~2-15 Hz
X, Y = hp(e), hp(o); W, M = int(os.environ.get("WIN", "1500")), 40; pts = []
for s in range(M, len(X) - W - M, 500):
    xa = X[s:s + W]; best, bl = -9, 0
    for l in range(-M, M + 1):
        c = float(np.corrcoef(xa, Y[s + l:s + l + W])[0, 1])
        if c > best: best, bl = c, l
    pts.append((s / 100 + 7.5, bl * 10, best)); print(f"t {s / 100 + 7.5:6.1f}  lag {bl * 10:+5d} ms  r {best:.2f}")
P = np.array([p for p in pts if p[2] > 0.35])
if len(P) > 2: k, c0 = np.polyfit(P[:, 0], P[:, 1], 1); print(f"{S}{TAG}: lag ≈ {c0:+.0f} ms {k * 1000:+.1f} ms/1000s·… · fin {k * P[-1, 0] + c0:+.0f} ms · mediana {np.median(P[:, 1]):+.0f} ms ({len(P)}/{len(pts)} ventanas)")
