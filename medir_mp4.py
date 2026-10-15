# medir_mp4.py — regla Bertha medida sobre el MP4 FINAL (sin EDL): 1 cuadro/s a 640 px, guarda por segundo el ancho
# relativo de la cara frontal más grande (0 = sin cara) para calibrar el umbral contra EDLs conocidos.
#   python medir_mp4.py <slug> <url|archivo>   → imprime 1 línea JSON con "fw" (lista por segundo) y "diff"
import sys, json, subprocess, numpy as np, cv2
slug, src = sys.argv[1], sys.argv[2]
W, Hh = 640, 360
cas = cv2.CascadeClassifier("haarcascade_frontalface_default.xml")
p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"fps=1,scale={W}:{Hh}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
fw, diff, prev = [], [], None
while True:
    b = p.stdout.read(W * Hh)
    if len(b) < W * Hh: break
    g = np.frombuffer(b, np.uint8).reshape(Hh, W)
    f = cas.detectMultiScale(g, 1.1, 5, minSize=(28, 28))
    fw.append(round(max([w for (x, y, w, h) in f], default=0) / W, 3))
    diff.append(0.0 if prev is None else round(float(np.mean(cv2.absdiff(g, prev))), 2))
    prev = g
print(json.dumps({"slug": slug, "n": len(fw), "fw": fw, "diff": diff}))
