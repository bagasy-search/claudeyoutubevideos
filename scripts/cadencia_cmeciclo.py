# -*- coding: utf-8 -*-
"""Compuerta de cadencia del avatar 25->30 fps.

`fps=30` (duplicacion) deja CINCO pasos parejos + UN cuadro repetido por ciclo de 6.
`minterpolate` no repite ninguno pero reparte el movimiento DESPAREJO, y eso se lee como tiron.

⛔ El criterio va RELATIVO, no con un umbral absoluto: donde hay mas movimiento, el cuadro
repetido deja mas ruido de compresion (medido: 0,49 en un tramo quieto y 0,59 en uno con mas
accion, siendo los dos el MISMO defecto inexistente). Un umbral fijo de 0,5 marca en rojo un
avatar sano. Lo que define la duplicacion es que UNA posicion este MUY por debajo de las otras.
"""
import subprocess, tempfile, os, glob, sys
import numpy as np
from PIL import Image

MP4 = sys.argv[1] if len(sys.argv) > 1 else "public/cmeciclo_opt.mp4"
TIEMPOS = [int(x) for x in (sys.argv[2:] or [60, 180, 330])]

malos = 0
for T in TIEMPOS:
    d = tempfile.mkdtemp()
    subprocess.run(["ffmpeg", "-v", "error", "-ss", str(T), "-i", MP4, "-frames:v", "36",
                    "-vsync", "0", "-vf", "crop=700:500:610:120,scale=350:250", "-q:v", "2",
                    os.path.join(d, "f_%03d.jpg")], check=True)
    fs = sorted(glob.glob(os.path.join(d, "*.jpg")))
    a = [np.asarray(Image.open(f).convert("L"), dtype=np.float32) for f in fs]
    diffs = [float(np.abs(a[i] - a[i - 1]).mean()) for i in range(1, len(a))]
    ciclo = [float(np.median(diffs[i::6])) for i in range(6)]
    orden = sorted(ciclo)
    minimo, resto = orden[0], float(np.median(orden[1:]))
    ratio = minimo / resto if resto else 1.0
    ok = ratio < 0.5 and orden[1] / resto > 0.6   # UNA sola posicion hundida, las otras 5 parejas
    malos += 0 if ok else 1
    print(f"t={T}s  ciclo {[round(c, 2) for c in ciclo]}  min/resto={ratio:.2f}  "
          f"{'OK duplicacion pareja' if ok else 'REVISAR: no hay UN cuadro repetido claro'}")

print(f"\nmedidos {len(TIEMPOS)} tramos · fallan {malos}")
sys.exit(1 if malos else 0)
