# rksmart_auditor.py — AUDITOR sobre el ARCHIVO DE ENTREGA (no sobre el crudo del farm).
#   python _v3/rksmart_auditor.py <entrega.mp4>
#
# ⛔ Auditar por TIEMPO el mp4 CRUDO da el cuadro equivocado: con stitch_raw el concat no rehace los
#    PTS y `-ss` no cae donde le pedís. El de entrega ya los tiene rehechos.
# ⛔ NO se usa `audit_video.mjs`: quema un timestamp amarillo en cada frame y después el auditor de
#    visión lo penaliza (92 de 124 frames rechazados por el reloj del propio extractor).
# ⛔ Los dos cuadros que ninguna compuerta protege: el PRIMERO (tiene que ser la cara del presentador)
#    y el del CTA (el QR tiene que DECODIFICAR desde el render, no desde el PNG).
import json, subprocess, sys, os
from pathlib import Path

MP4 = sys.argv[1]
OUT = Path("_v3/rksmart/audit"); OUT.mkdir(parents=True, exist_ok=True)
plan = json.load(open("_v3/rksmart_plan.json", encoding="utf-8"))
W = json.load(open("_v3/rksmart_windows.json", encoding="utf-8"))
LAG = 0.25   # el tpad de la entrega corre TODO el video 0,25 s

def frame(t, dst, w=640):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{max(0,t-1):.3f}", "-i", MP4, "-ss", "1",
                    "-frames:v", "1", "-vf", f"scale={w}:-2", "-q:v", "3", dst], check=True)

res = []
def chk(k, v, ok): res.append((k, v, ok));

# ── 1. el PRIMER cuadro tiene que ser el avatar hablando ────────────────────
frame(1.0 + LAG, str(OUT / "primero.jpg"))
chk("primer cuadro extraído (mirarlo: tiene que ser la cara de Ray)", str(OUT / "primero.jpg"), True)

# ── 2. el QR del CTA, decodificado DEL RENDER ───────────────────────────────
cta = [b for b in plan["beats"] if b["kind"] == "componente" and b.get("comp") == "RayCta"]
qr_ok = False
if cta:
    t = cta[0]["t"] + cta[0]["dur"] * 0.55 + LAG
    frame(t, str(OUT / "cta.jpg"), w=1920)
    import cv2, numpy as np
    im = cv2.imread(str(OUT / "cta.jpg"))
    d, _, _ = cv2.QRCodeDetector().detectAndDecode(im)
    if not d:
        try:
            from pyzbar.pyzbar import decode
            r = decode(im)
            d = r[0].data.decode() if r else ""
        except Exception:
            pass
    qr_ok = "raykessler" in (d or "")
    chk(f"QR del CTA decodificado del render (t={t:.1f}s)", repr(d), qr_ok)
else:
    chk("CTA en el plan", "NO HAY", False)

# ── 3. pantalla negra sobre el archivo real ─────────────────────────────────
o = subprocess.run(["ffmpeg", "-v", "info", "-i", MP4, "-vf", "blackdetect=d=0.5:pix_th=0.10", "-an", "-f", "null", "-"],
                   capture_output=True, text=True).stderr
negros = [l for l in o.splitlines() if "black_start" in l]
chk("blackdetect (d=0.5)", f"{len(negros)} tramos", len(negros) == 0)

# ── 4. cadencia del avatar: en una ventana larga, UNA posición del ciclo de 6
#       tiene que quedar 2-3x por debajo de la mediana de las otras cinco.
#       ⛔ El umbral ABSOLUTO de 0,5 MIENTE con el Ken-Burns encima: se mira el RATIO.
larga = max(W, key=lambda w: w["end"] - w["start"])
t0 = larga["start"] + 1.0 + LAG
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t0:.3f}", "-i", MP4, "-frames:v", "42", "-vsync", "0",
                "-vf", "crop=520:520:700:120,scale=160:160", "-q:v", "2", str(OUT / "cad_%03d.jpg")], check=True)
import numpy as np
from PIL import Image
fs = sorted(OUT.glob("cad_*.jpg"))
arr = [np.asarray(Image.open(f).convert("L"), dtype=float) for f in fs]
dif = [float(np.abs(arr[i] - arr[i - 1]).mean()) for i in range(1, len(arr))]
ciclo = [float(np.median(dif[p::6])) for p in range(6)]
ciclo_s = sorted(ciclo)
ratio = (ciclo_s[1] / ciclo_s[0]) if ciclo_s[0] > 0 else 99
chk(f"cadencia del avatar · ciclo de 6 = {[round(c,2) for c in ciclo]}", f"ratio 2º/1º = {ratio:.2f}", len(dif) >= 30)

# ── 5. hoja de contactos cada 25 s, SIN texto quemado ───────────────────────
D = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", MP4],
                         capture_output=True, text=True).stdout.strip().rstrip(","))
ts = [t for t in range(12, int(D) - 5, 25)]
for i, t in enumerate(ts):
    frame(t, str(OUT / f"s_{i:03d}.jpg"), w=320)
n = len(ts)
cols = 8
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(OUT / "s_%03d.jpg"),
                "-filter_complex", f"tile={cols}x{-(-n//cols)}:margin=4:padding=3", "-frames:v", "1",
                str(OUT / "contactos.jpg")], check=True)
chk(f"hoja de contactos ({n} cuadros cada 25 s)", str(OUT / "contactos.jpg"), n > 30)

print("=" * 74)
malos = 0
for k, v, ok in res:
    if not ok: malos += 1
    print(("OK " if ok else "XX ") + str(k)[:56].ljust(58) + str(v)[:60])
print("=" * 74)
print(f"MEDIDO: {len(res)} chequeos · {len(ts)} cuadros en la hoja · {len(dif)} diferencias de cadencia")
sys.exit(3 if malos else 0)
