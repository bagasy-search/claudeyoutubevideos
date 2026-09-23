# nrt_layers.py — capas 2.5D por foto: <id>_bg.jpg (fondo con el sujeto borrado por inpainting) +
# <id>_fg.png (sujeto/primer plano con alfa suave según la profundidad). Cerca = blanco en el mapa.
# El sujeto se mueve distinto que el fondo (paralaje) sin dejar fantasma porque el fondo ya no lo tiene.
import os, glob, cv2, numpy as np
SRC = "public/img/nrtinnitus"; DEP = f"{SRC}/depth"; OUT = f"{SRC}/p25"; os.makedirs(OUT, exist_ok=True)
n = ok = skip = 0
for dp in sorted(glob.glob(f"{DEP}/m*.png")):
    i = os.path.basename(dp)[:-4]; n += 1
    img = cv2.imread(f"{SRC}/{i}.jpg"); d = cv2.imread(dp, cv2.IMREAD_GRAYSCALE)
    if img is None or d is None: continue
    sg = cv2.imread(f"{SRC}/seg/{i}.png", cv2.IMREAD_GRAYSCALE)
    if sg is None: skip += 1; continue
    # máscara de SUJETO (BiRefNet): sólida; se endurece y se suaviza sólo el borde
    a = cv2.resize(sg, (img.shape[1], img.shape[0])).astype(np.float32) / 255
    a = np.clip((a - 0.35) / 0.3, 0, 1)
    frac = float((a > 0.5).mean())
    if frac < 0.05 or frac > 0.55:           # sin sujeto separable (ilustración plana, plano abierto): no hay 2.5D
        skip += 1; continue
    a = cv2.GaussianBlur(a, (0, 0), 1.2)
    # fondo: borrar el sujeto (máscara dilatada) e inpaint a media resolución (rápido) → reescalar
    m = (a > 0.08).astype(np.uint8) * 255
    m = cv2.dilate(m, np.ones((21, 21), np.uint8))
    h, w = img.shape[:2]; s = 0.5
    small = cv2.resize(img, (int(w * s), int(h * s))); ms = cv2.resize(m, (int(w * s), int(h * s)))
    bg = cv2.inpaint(small, ms, 7, cv2.INPAINT_TELEA)
    bg = cv2.resize(bg, (w, h), interpolation=cv2.INTER_CUBIC)
    bg = np.where(m[..., None] > 0, cv2.GaussianBlur(bg, (0, 0), 2), img)   # fuera de la máscara: píxeles originales
    cv2.imwrite(f"{OUT}/{i}_bg.jpg", bg, [cv2.IMWRITE_JPEG_QUALITY, 92])
    fg = np.dstack([img, (a * 255).astype(np.uint8)])
    cv2.imwrite(f"{OUT}/{i}_fg.png", fg)
    ok += 1
print(f"capas 2.5D: {n} mapas medidos · {ok} fotos separadas · {skip} sin sujeto separable (quedan con Ken Burns)")
