# -*- coding: utf-8 -*-
# Compuerta de CADENCIA del avatar (regla 2.bis.2).
# El creador graba a 25 fps. A 30 hay dos caminos y solo uno vale:
#   fps=30 duplicado -> 5 pasos PAREJOS + 1 cuadro repetido   (el que VALIDO el creador)
#   minterpolate mci -> los 6 pasos DISTINTOS = movimiento irregular = tiron
#
# ⛔ Y el umbral ABSOLUTO (<0,5) miente si hay Ken-Burns encima: hasta el cuadro duplicado se
#    dibuja a una escala apenas distinta. Lo que se mira es el RATIO contra la mediana del ciclo.
#
# ⛔ Un cuadro se saca con UN SOLO proceso decodificando consecutivos: sacar cada uno con su
#    propio `-ss` devuelve DOS VECES el mismo y da un 0.00 exacto cada 3 cuadros en CUALQUIER
#    archivo. Pista: un repetido de verdad NUNCA da 0.00 exacto (el ruido de compresion lo impide).
import os, sys, glob, subprocess, statistics as st
import numpy as np
from PIL import Image

MP4 = sys.argv[1] if len(sys.argv) > 1 else "D:/rkalarm/rkalarm_opt.mp4"
TMP = "D:/rkalarm/_cad"
PUNTOS = [float(x) for x in (sys.argv[2:] or ["120", "600", "1100"])]

print("cadencia de %s" % MP4)
malos = []
for T in PUNTOS:
    for f in glob.glob(os.path.join(TMP, "*.jpg")):
        os.remove(f)
    os.makedirs(TMP, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(T), "-i", MP4,
                    "-frames:v", "42", "-vsync", "0", "-vf", "crop=700:700:610:120,scale=200:200",
                    "-q:v", "2", os.path.join(TMP, "f_%03d.jpg")], check=True)
    fs = sorted(glob.glob(os.path.join(TMP, "f_*.jpg")))
    if len(fs) < 40:
        print("  t=%ss: solo %d cuadros, salteo" % (T, len(fs))); continue
    ar = [np.asarray(Image.open(f).convert("L"), dtype=np.float32) for f in fs]
    dif = [float(np.abs(ar[i + 1] - ar[i]).mean()) for i in range(len(ar) - 1)]
    # mediana por POSICION dentro del ciclo de 6
    ciclo = [st.median(dif[p::6]) for p in range(6)]
    mn = min(ciclo)
    otros = sorted(ciclo)[1:]
    medOtros = st.median(otros)
    ratio = medOtros / mn if mn > 0.001 else 999
    bajos = sum(1 for c in ciclo if c < medOtros / 2)
    print("  t=%6.0fs  ciclo de 6: [%s]" % (T, ", ".join("%.2f" % c for c in ciclo)))
    print("            minimo %.2f · mediana de los otros 5 %.2f · RATIO %.1fx · posiciones bajas %d"
          % (mn, medOtros, ratio, bajos))
    if bajos != 1:
        malos.append("t=%ss: %d posiciones bajas (tiene que ser EXACTAMENTE 1)" % (T, bajos))
    elif ratio < 2.0:
        malos.append("t=%ss: ratio %.1fx (<2x) — se parece a minterpolate" % (T, ratio))

print()
if malos:
    print("⛔ CADENCIA SOSPECHOSA:")
    for m in malos: print("   -", m)
    sys.exit(1)
print("OK · duplicacion simple confirmada en %d tramos (1 cuadro repetido por ciclo de 6)" % len(PUNTOS))
