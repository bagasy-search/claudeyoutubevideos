# -*- coding: utf-8 -*-
# Compuertas numericas sobre el pool de clips i2v. Corre ANTES del build.
#
# ⛔ EL DEFECTO DE LUMA VIVE EN EL ARRANQUE, NO EN LA MEDIA: mucho clip abre con un fundido desde
#    negro. Medido: mediana 107 y minimo 52 (todos "sanos") y aun asi 1,7 s de pantalla casi negra
#    en el render. `blackdetect` tampoco lo ve (pide 0,3-0,5 s y el fundido duraba 0,17 s).
#
# ⛔ Y MEDIR SOBRE UN FRAME REESCALADO MIENTE: `signalstats` sobre scale=160:90 dio 27-28 en clips
#    que al MIRARLOS eran pantalla negra (luma real 13-14). Aca se mide sobre el cuadro sin
#    reescalar y ademas se arma hoja de contactos para mirarlos.
import os, sys, glob, subprocess, json, statistics as st
import numpy as np
from PIL import Image

CLIPS = sys.argv[1] if len(sys.argv) > 1 else "D:/rkalarm/broll"
TMP = "D:/rkalarm/_cg"
os.makedirs(TMP, exist_ok=True)
fs = sorted(glob.glob(os.path.join(CLIPS, "*.mp4")))
print("clips a medir: %d" % len(fs))
if not fs:
    print("⛔ 0 clips"); sys.exit(1)

def frame(f, t):
    o = os.path.join(TMP, "x.png")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f, "-frames:v", "1", o],
                   check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    if not os.path.exists(o) or os.path.getsize(o) == 0: return None
    im = Image.open(o).convert("L")
    a = np.asarray(im, dtype=np.float32)
    os.remove(o)
    return a

arranque, medios, fin = {}, {}, {}
fallos = []
for i, f in enumerate(fs):
    n = os.path.basename(f)[:-4]
    a0 = frame(f, 0.05)     # ARRANQUE: donde vive el fundido
    a1 = frame(f, 1.2)
    a2 = frame(f, 2.7)
    if a0 is None or a1 is None:
        fallos.append("%s: no se pudo leer" % n); continue
    arranque[n] = float(a0.mean()); medios[n] = float(a1.mean())
    if a2 is not None: fin[n] = float(a2.mean())
    if (i + 1) % 60 == 0: print("  ... %d/%d" % (i + 1, len(fs)))

va = sorted(arranque.items(), key=lambda x: x[1])
negros = [k for k, v in arranque.items() if v < 40]
print("\n[1] LUMA DEL ARRANQUE (0,05 s) · %d clips medidos a tamanio REAL" % len(arranque))
print("    minimo %.1f (%s) · mediana %.1f · maximo %.1f" % (va[0][1], va[0][0], va[len(va)//2][1], va[-1][1]))
print("    por debajo de 40 (arrancan en negro): %d %s" % (len(negros), negros[:6]))

# ⛔ CONGELADO: si el ultimo cuadro es identico al primero, el clip no se movio
quietos = []
for n in arranque:
    if n in fin and abs(fin[n] - arranque[n]) < 0.15 and abs(medios[n] - arranque[n]) < 0.15:
        quietos.append(n)
print("\n[2] MOVIMIENTO · %d clips con 3 muestras" % len(fin))
print("    sin cambio perceptible entre 0,05 / 1,2 / 2,7 s: %d %s" % (len(quietos), quietos[:6]))

# hoja de contactos del ARRANQUE: el numero no cierra el caso, hay que mirar
COLS, TW, TH, POR = 10, 240, 135, 80
HOJA = "D:/rkalarm/contactos"
os.makedirs(HOJA, exist_ok=True)
nh = 0
for i in range(0, len(fs), POR):
    lote = fs[i:i + POR]
    filas = (len(lote) + COLS - 1) // COLS
    h = Image.new("RGB", (COLS * TW, filas * TH), (12, 12, 14))
    for k, f in enumerate(lote):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.05", "-i", f, "-frames:v", "1",
                        "-vf", "scale=%d:%d" % (TW, TH), os.path.join(TMP, "t.jpg")],
                       check=False, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(os.path.join(TMP, "t.jpg")):
            h.paste(Image.open(os.path.join(TMP, "t.jpg")).convert("RGB"), ((k % COLS) * TW, (k // COLS) * TH))
    p = os.path.join(HOJA, "clips_%02d.jpg" % (i // POR + 1))
    h.save(p, "JPEG", quality=72, optimize=True); nh += 1
print("\n[3] HOJA DE CONTACTOS del arranque: %d hojas en %s" % (nh, HOJA))

json.dump({"arranque": arranque, "negros": negros, "quietos": quietos},
          open("D:/rkalarm/_clipgate.json", "w"), indent=1)
print()
if negros or fallos:
    print("⛔ PROBLEMAS: %d arrancan en negro · %d ilegibles" % (len(negros), len(fallos)))
    sys.exit(1)
print("OK · %d clips, ninguno arranca en negro" % len(arranque))
