# medir_mp4.py — regla Bertha medida sobre el MP4 FINAL (sin EDL): 1 cuadro/s, cara frontal grande = avatar hablando.
#   python medir_mp4.py <slug> <url|archivo>   → imprime 1 línea JSON
# avatar = cara frontal con ancho >= MINW del cuadro en 2+ segundos seguidos (las fotos del b-roll con la persona suelen ser más chicas o duran 1 s).
# quieto = diferencia media entre cuadros seguidos < QUIETO (foto sin zoom o plano congelado).
import sys, json, subprocess, numpy as np, cv2
slug, src = sys.argv[1], sys.argv[2]
W, Hh = 320, 180; MINW = 0.16; QUIETO = 1.2
cas = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"fps=1,scale={W}:{Hh}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
face, diff, prev = [], [], None
while True:
    b = p.stdout.read(W * Hh)
    if len(b) < W * Hh: break
    g = np.frombuffer(b, np.uint8).reshape(Hh, W)
    f = cas.detectMultiScale(g, 1.15, 5, minSize=(int(W * MINW), int(W * MINW)))
    face.append(len(f) > 0)
    diff.append(0.0 if prev is None else float(np.mean(cv2.absdiff(g, prev))))
    prev = g
n = len(face)
if n < 30: print(json.dumps({"slug": slug, "err": "sin cuadros"})); sys.exit()
av = face[:]
for i in range(n):  # sólo tramos de 2+ s
    if face[i] and not ((i > 0 and face[i - 1]) or (i + 1 < n and face[i + 1])): av[i] = False
gaps, cur, at_ = [], 0, []
for i, x in enumerate(av):
    if x:
        gaps.append(cur)
        if cur > 20: at_.append(i - cur)
        cur = 0
    else: cur += 1
gaps.append(cur)
if cur > 20: at_.append(n - cur)
apar = sum(1 for i in range(n) if av[i] and (i == 0 or not av[i - 1]))
quieto = [d < QUIETO for d in diff]; quieto[0] = False
qrun, mq = 0, 0
for i, q in enumerate(quieto):
    qrun = qrun + 1 if (q and not av[i]) else 0; mq = max(mq, qrun)
print(json.dumps({"slug": slug, "min": round(n / 60, 1), "avatar_0_3s": any(av[:3]), "av_pct": round(100 * sum(av) / n, 1),
                  "apariciones": apar, "max_sin_av_s": max(gaps), "huecos_gt20": sum(1 for g in gaps if g > 20), "huecos_gt20_desde_s": at_, "face_s": [i for i in range(n) if face[i]],
                  "quieto_pct": round(100 * sum(1 for i in range(n) if quieto[i] and not av[i]) / n, 1), "max_quieto_s": mq}))
