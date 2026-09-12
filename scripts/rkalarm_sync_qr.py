# -*- coding: utf-8 -*-
# 1) SINCRONIA contra el master, por correlacion cruzada de la envolvente.
#    ⛔ Hay que medir la correlacion EN el desfase encontrado, no a desfase cero: una senial
#       corrida da ~0 a desfase cero y parece que el test no encontro nada.
# 2) QR decodificado DEL RENDER, al TAMANIO REAL EN PANTALLA (104 px), no del PNG.
import os, sys, subprocess, wave, math
import numpy as np

MP4 = sys.argv[1]; WAV = sys.argv[2]; CTA = float(sys.argv[3]) if len(sys.argv) > 3 else 1620.5
TMP = "D:/rkalarm/_sq"; os.makedirs(TMP, exist_ok=True)

def env(src, t, dur=25, sr=8000):
    o = os.path.join(TMP, "e.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-t", str(dur), "-i", src,
                    "-vn", "-ac", "1", "-ar", str(sr), "-c:a", "pcm_s16le", o], check=True)
    with wave.open(o) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(np.float32)
    n = 80
    a = np.abs(a[: len(a) // n * n]).reshape(-1, n).mean(1)
    return (a - a.mean()) / (a.std() + 1e-9)

print("[1] SINCRONIA contra el master (correlacion de envolvente, 5 ventanas)")
peor = 0
for t in [30, 400, 800, 1200, 1560]:
    try:
        a, b = env(MP4, t), env(WAV, t)
        m = min(len(a), len(b)); a, b = a[:m], b[:m]
        c = np.correlate(a, b, "full")
        lag = int(np.argmax(c) - (m - 1))
        ms = lag * 80 / 8000 * 1000
        r = float(c[np.argmax(c)] / m)   # la correlacion EN el desfase encontrado
        print("    t=%5ds  desfase %+6.1f ms  (correlacion %.2f)" % (t, ms, r))
        peor = max(peor, abs(ms))
    except Exception as e:
        print("    t=%5ds  error: %s" % (t, e))
print("    peor desfase: %.1f ms" % peor)

print("\n[2] QR DEL RENDER al tamanio REAL de pantalla")
import cv2
det = cv2.QRCodeDetector()
ok = False
for off in (3, 6, 9):
    f = os.path.join(TMP, "cta_%d.png" % off)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(CTA + off), "-i", MP4,
                    "-frames:v", "1", f], check=False)
    if not os.path.exists(f): continue
    im = cv2.imread(f)
    # el QR vive en la tarjeta del CTA: se recorta la zona y se prueba a varias escalas
    h, w = im.shape[:2]
    roi = im[int(h * 0.55):h, int(w * 0.45):w]
    for esc in (1.0, 2.0, 3.0, 4.0):
        r2 = cv2.resize(roi, None, fx=esc, fy=esc, interpolation=cv2.INTER_CUBIC)
        txt, _, _ = det.detectAndDecode(r2)
        if txt:
            print("    t=%.1fs escala %.0fx -> %r" % (CTA + off, esc, txt))
            ok = True; break
    if ok: break
if not ok:
    print("    NO decodifico (revisar el recorte o el componente)")

print("\n[3] PRIMER y ULTIMO cuadro (los dos que ninguna compuerta protege)")
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                            "-of", "csv=p=0", MP4], capture_output=True, text=True).stdout.strip())
for nom, t in [("primero", 1.0), ("hook", 8.0), ("ultimo", dur - 3)]:
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", MP4, "-frames:v", "1",
                    "-vf", "scale=640:-2", os.path.join(TMP, "%s.jpg" % nom)], check=False)
    print("    %s (t=%.1fs) -> %s.jpg" % (nom, t, nom))
sys.exit(0 if peor < 120 else 1)
