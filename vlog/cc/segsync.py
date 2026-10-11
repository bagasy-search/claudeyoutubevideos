# Sincro de labios MEDIDA en el video armado, tramo por tramo de avatar: movimiento de la boca vs envolvente de la voz (±400 ms).
# lag>0 = la boca va DETRÁS de la voz.   python vlog/cc/segsync.py <video> <wav> <armado.json> [ROI=x,y,w,h en 1920x1080]
import sys, json, subprocess, numpy as np
V, A, J = sys.argv[1:4]; x, y, w, h = map(int, (sys.argv[4] if len(sys.argv) > 4 else "800,340,240,180").split(","))
SR, FPS = 16000, 30
def mouth(s, e):
    b = subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{s}", "-i", V, "-t", f"{e - s}", "-vf", f"crop={w}:{h}:{x}:{y},format=gray", "-f", "rawvideo", "-"], capture_output=True).stdout
    v = np.frombuffer(b, np.uint8)[: (len(b) // (w * h)) * w * h].reshape(-1, h, w).astype(np.float32)
    return np.concatenate([[0], np.abs(np.diff(v, axis=0)).mean(axis=(1, 2))])
def env(s, e):
    a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-ss", f"{s}", "-i", A, "-t", f"{e - s}", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
    hop = SR // 100; en = np.sqrt(np.convolve(a * a, np.ones(hop) / hop, "same"))[::hop]
    return en + 2 * np.abs(np.diff(en, prepend=en[0]))
hp = lambda s: s - np.convolve(s, np.ones(60) / 60, "same")
segs = [a for a in json.load(open(J, encoding="utf8")) if a["kind"] == "av" and a["e"] - a["s"] > 3.5]
for a in segs:
    s, e = a["s"] + 0.3, a["e"] - 0.3
    m = mouth(s, e); ea = env(s, e); t = np.arange(len(ea)) / 100
    mm = np.interp(t, np.arange(len(m)) / FPS, m); X, Y = hp(ea), hp(mm); M = 40; best, bl = -9, 0
    for l in range(-M, M + 1):
        xa = X[M:len(X) - M]; yb = Y[M + l:len(Y) - M + l]; c = float(np.corrcoef(xa, yb)[0, 1])
        if c > best: best, bl = c, l
    print(f"{a['id']:<5} {a['s']:7.1f}-{a['e']:7.1f} {a['src'].split('/')[-2][-8:]:<8} lag {bl * 10:+5d} ms  r {best:.2f}")
