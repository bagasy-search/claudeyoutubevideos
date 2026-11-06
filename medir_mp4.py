# medir_mp4.py v2 (16-oct-2026) — regla Bertha medida sobre el MP4 FINAL en el farm: 1 cuadro/s.
#   python medir_mp4.py <slug> <mp4> [huellas_<slug>.npz]   → imprime 1 línea JSON
#
# avatar = el cuadro se PARECE a un cuadro del reel del avatar (huellas, ver huellas.py)  O  cara frontal grande (haar).
# Por qué v2: la v1 sólo miraba una cara de ≥16 % del ancho. Con el presentador en plano medio/abierto (Lou, Mickey,
#   Stan) la cara mide 7-10 % → "0,3 % de avatar" o huecos falsos de 24-40 s, y cada sesión perdía tiempo mirando
#   stills a mano o bajaba el umbral (bajarlo cuenta también las FOTOS del presentador del b-roll).
#   Medido en lou2/lou3: cuadro del reel vs huella ≥ 0,94 (con zoom 1,0-1,5) · fotos del b-roll con Lou ≤ 0,62 → corte 0,80.
# Un tramo cuenta como avatar si dura 2+ s seguidos. quieto = diferencia media entre cuadros < QUIETO (foto sin zoom).
import sys, json, os, subprocess, numpy as np, cv2
slug, src = sys.argv[1], sys.argv[2]
hf = sys.argv[3] if len(sys.argv) > 3 else f"huellas_{slug}.npz"
W, Hh = 640, 360; MINW = 0.16; QUIETO = 1.2; CORTE = float(os.environ.get("AV_CORTE", 0.80))
VW, VH = 64, 36
def vec(g):
    g = cv2.resize(g, (VW, VH), interpolation=cv2.INTER_AREA).astype(np.float32)
    g = cv2.GaussianBlur(g, (3, 3), 0); g -= g.mean(); n = np.linalg.norm(g)
    return (g / n if n else g).ravel()
R = None
if os.path.exists(hf):
    R = np.load(hf)["h"].astype(np.float32)
    R /= np.maximum(np.linalg.norm(R, axis=1, keepdims=True), 1e-6)
cas = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"fps=1,scale={W}:{Hh}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
face, reel, sim, diff, prev = [], [], [], [], None
while True:
    b = p.stdout.read(W * Hh)
    if len(b) < W * Hh: break
    g = np.frombuffer(b, np.uint8).reshape(Hh, W)
    s = cv2.resize(g, (320, 180), interpolation=cv2.INTER_AREA)
    f = cas.detectMultiScale(s, 1.15, 5, minSize=(int(320 * MINW), int(320 * MINW)))
    face.append(len(f) > 0)
    c = float((R @ vec(g)).max()) if R is not None else 0.0
    sim.append(c); reel.append(c >= CORTE)
    diff.append(0.0 if prev is None else float(np.mean(cv2.absdiff(s, prev))))
    prev = s
n = len(face)
if n < 30: print(json.dumps({"slug": slug, "err": "sin cuadros"})); sys.exit()
raw = [face[i] or reel[i] for i in range(n)]
av = raw[:]
for i in range(n):  # sólo tramos de 2+ s
    if raw[i] and not ((i > 0 and raw[i - 1]) or (i + 1 < n and raw[i + 1])): av[i] = False
gaps, cur = [], 0
for x in av:
    if x: gaps.append(cur); cur = 0
    else: cur += 1
gaps.append(cur)
apar = sum(1 for i in range(n) if av[i] and (i == 0 or not av[i - 1]))
quieto = [d < QUIETO for d in diff]; quieto[0] = False
qrun, mq = 0, 0
for i, q in enumerate(quieto):
    qrun = qrun + 1 if (q and not av[i]) else 0; mq = max(mq, qrun)
# huecos > 20 s con su inicio, para ir directo al segundo que falla
huecos, cur, ini = [], 0, 0
for i, x in enumerate(av + [True]):
    if x:
        if cur > 20: huecos.append([ini, cur])
        cur = 0
    else:
        if cur == 0: ini = i
        cur += 1
print(json.dumps({"slug": slug, "metodo": "reel+haar" if R is not None else "haar (SIN huellas: plano medio puede dar falsos huecos)",
                  "min": round(n / 60, 1), "avatar_0_3s": any(av[:3]), "av_pct": round(100 * sum(av) / n, 1),
                  "av_reel_pct": round(100 * sum(reel) / n, 1), "av_haar_pct": round(100 * sum(face) / n, 1),
                  "apariciones": apar, "max_sin_av_s": max(gaps), "huecos_gt20": len(huecos), "huecos": huecos,
                  "quieto_pct": round(100 * sum(1 for i in range(n) if quieto[i] and not av[i]) / n, 1), "max_quieto_s": mq,
                  "av_s": [i for i in range(n) if av[i]], "quieto_s": [i for i in range(n) if quieto[i] and not av[i]]}))
