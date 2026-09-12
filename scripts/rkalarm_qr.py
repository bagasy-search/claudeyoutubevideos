# -*- coding: utf-8 -*-
# QR del CTA de rkalarm.
# ⛔ RayCta lo dibuja en un slot de 104x104 con objectFit:"contain" => el PNG va CUADRADO,
#    y la verificacion se hace DECODIFICANDO A 104 px, que es su tamanio REAL en pantalla.
#    (Verificar al tamanio del PNG es la trampa: un QR gigante decodifica y en pantalla no.)
import io, sys
import qrcode
from qrcode.constants import ERROR_CORRECT_M
from PIL import Image
import numpy as np
import cv2

URL = "https://raykessler.vercel.app/"      # ⛔ SIEMPRE con https://
OUT = "D:/rkalarm/img/rkalarm_qrcard.png"
SLOT = 104                                   # el tamanio real en pantalla

q = qrcode.QRCode(error_correction=ERROR_CORRECT_M, border=4, box_size=1)
q.add_data(URL); q.make(fit=True)
mods = q.modules_count
lado = mods + 2 * q.border
print("URL           : %s" % URL)
print("version       : %s  (%dx%d modulos + borde %d = %d)" % (q.version, mods, mods, q.border, lado))
print("px por modulo a %dpx: %.2f" % (SLOT, SLOT / lado))

# generar a un multiplo exacto del slot para que el downscale caiga en grilla
box = max(1, (SLOT * 8) // lado)
q2 = qrcode.QRCode(error_correction=ERROR_CORRECT_M, border=4, box_size=box)
q2.add_data(URL); q2.make(fit=True)
img = q2.make_image(fill_color="black", back_color="white").convert("RGB")
img.save(OUT)
print("guardado      : %s  (%dx%d)" % (OUT, img.size[0], img.size[1]))
assert img.size[0] == img.size[1], "el QR TIENE que ser cuadrado (slot contain)"

# ---- la verificacion que cierra el caso: decodificar AL TAMANIO DE PANTALLA ----
det = cv2.QRCodeDetector()
print("\ndecodificacion (el gate es %dpx, el resto es margen):" % SLOT)
ok_slot = False
for px in (SLOT, int(SLOT * 1.6), int(SLOT * 2.2), int(SLOT * 3), img.size[0]):
    chico = img.resize((px, px), Image.LANCZOS)
    a = cv2.cvtColor(np.array(chico), cv2.COLOR_RGB2BGR)
    txt, pts, _ = det.detectAndDecode(a)
    marca = "OK" if txt == URL else ("DISTINTO: %r" % txt[:40] if txt else "no decodifica")
    print("   %4d px -> %s" % (px, marca))
    if px == SLOT and txt == URL: ok_slot = True

print()
if ok_slot:
    print("RESULTADO: el QR decodifica al tamanio REAL de pantalla (%dpx). Sirve." % SLOT)
    sys.exit(0)
print("RESULTADO: NO decodifica a %dpx -> hay que agrandar el modulo (menos datos o mas ECC)." % SLOT)
sys.exit(1)
