# -*- coding: utf-8 -*-
# Post-proceso del pool de imagenes de rkalarm. Corre DESPUES del fetch de los dos batches.
#   1. PNG -> JPG  (el tarball baja ~94%; el resolvedor del kit usa .jpg)
#   2. hermano `_blur.jpg` por cada imagen  (el kit lo pide en runtime; sin el, el pre-vuelo aborta)
#   3. COMPUERTA DE ASPECTO: todo 16:9 (tolerancia 0,06) o el objectFit:"cover" corta al sujeto
#   4. COMPUERTA DE LUMA: el defecto vive en el ARRANQUE, no en la media
#   5. hoja de contactos: el unico chequeo que caza off-topic y "negro que mide 27"
#
# Toda compuerta imprime CUANTO midio: una que puede dar 0 sin mirar no es una compuerta.
import io, os, sys, glob, subprocess
from PIL import Image, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else "D:/rkalarm/img"
FALTAN = []

pngs = sorted(glob.glob(os.path.join(SRC, "*.png")))
# el QR no se toca: es un asset del CTA, no del pool
pngs = [p for p in pngs if "qrcard" not in os.path.basename(p)]
print("=" * 70)
print("post-proceso · %d PNG encontrados en %s" % (len(pngs), SRC))
print("=" * 70)
if not pngs:
    print("⛔ 0 archivos: el fetch no dejo nada. NO sigas.")
    sys.exit(1)

# ---- 1+2. jpg + blur ----
hechos, blurs = 0, 0
aspectos = []
for p in pngs:
    base = os.path.splitext(p)[0]
    jpg, bl = base + ".jpg", base + "_blur.jpg"
    im = Image.open(p).convert("RGB")
    aspectos.append((os.path.basename(base), im.width, im.height, im.width / im.height))
    if not os.path.exists(jpg):
        im.save(jpg, "JPEG", quality=88, optimize=True); hechos += 1
    if not os.path.exists(bl):
        im.resize((im.width // 6, im.height // 6), Image.LANCZOS) \
          .filter(ImageFilter.GaussianBlur(6)) \
          .resize((im.width // 2, im.height // 2), Image.LANCZOS) \
          .save(bl, "JPEG", quality=70, optimize=True); blurs += 1
print("\n[1+2] convertidos a JPG: %d · hermanos _blur.jpg: %d" % (hechos, blurs))
pesoP = sum(os.path.getsize(p) for p in pngs) / 1048576
pesoJ = sum(os.path.getsize(os.path.splitext(p)[0] + ".jpg") for p in pngs) / 1048576
print("      peso PNG %.0f MB -> JPG %.0f MB  (%.0f%% menos)" % (pesoP, pesoJ, 100 * (1 - pesoJ / pesoP)))

# ---- 3. aspecto ----
malos = [a for a in aspectos if abs(a[3] - 16 / 9) > 0.06]
print("\n[3] ASPECTO · %d imagenes medidas contra 16:9 (1,778 +/- 0,06)" % len(aspectos))
print("    fuera de rango: %d %s" % (len(malos), [(m[0], "%dx%d" % (m[1], m[2])) for m in malos[:5]]))
if malos: FALTAN.append("%d imagenes NO son 16:9" % len(malos))

# ---- 4. luma del ARRANQUE (aca no hay video, medimos la imagen entera sin reescalar) ----
# ⛔ medir sobre un frame REESCALADO miente: el promedio del reescalado infla el valor y una
#    pantalla negra puede dar 27. Medimos sobre la imagen a tamanio real.
lumas = []
for p in pngs:
    im = Image.open(p).convert("L")
    lumas.append((os.path.basename(p), sum(im.getdata()) / (im.width * im.height)))
osc = [l for l in lumas if l[1] < 25]
lumas.sort(key=lambda x: x[1])
print("\n[4] LUMA · %d imagenes medidas a tamanio REAL (no reescaladas)" % len(lumas))
print("    minimo %.1f (%s) · mediana %.1f · maximo %.1f" % (
    lumas[0][1], lumas[0][0], lumas[len(lumas) // 2][1], lumas[-1][1]))
print("    por debajo de 25 (casi negras): %d %s" % (len(osc), [o[0] for o in osc[:5]]))
if osc: FALTAN.append("%d imagenes casi negras" % len(osc))

# ---- 5. hoja de contactos: hay que MIRARLA, el numero no cierra el caso ----
HOJA = os.path.join(os.path.dirname(SRC), "contactos")
os.makedirs(HOJA, exist_ok=True)
COLS, TW, TH, POR = 8, 300, 169, 48
nh = 0
for i in range(0, len(pngs), POR):
    lote = pngs[i:i + POR]
    filas = (len(lote) + COLS - 1) // COLS
    hoja = Image.new("RGB", (COLS * TW, filas * TH), (18, 18, 20))
    for k, p in enumerate(lote):
        t = Image.open(p).convert("RGB").resize((TW, TH), Image.LANCZOS)
        hoja.paste(t, ((k % COLS) * TW, (k // COLS) * TH))
    f = os.path.join(HOJA, "hoja_%02d.jpg" % (i // POR + 1))
    hoja.save(f, "JPEG", quality=72, optimize=True); nh += 1
print("\n[5] HOJA DE CONTACTOS · %d hojas de hasta %d planos en %s" % (nh, POR, HOJA))
print("    (hay que MIRARLAS: es lo unico que caza off-topic y el negro que mide 27)")

print("\n" + "=" * 70)
if FALTAN:
    print("⛔ %d PROBLEMAS:" % len(FALTAN))
    for f in FALTAN: print("   -", f)
    sys.exit(1)
print("OK · %d imagenes listas, con su _blur, 16:9 y sin negros" % len(pngs))
