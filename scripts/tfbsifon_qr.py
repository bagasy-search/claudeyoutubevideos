# QR del CTA de tfbsifon, para FloatingInsert.
#
# ⛔ EL PUNTO CLAVE (medido en el propio componente, src/VideoEdit/scenes/FloatingInsert.tsx):
#    el slot es 760x428, la imagen se dibuja con objectFit:"cover" Y ADEMAS lleva un Ken-Burns
#    scale(1.06 -> 1.14). O sea que al final del plano se ve solo el 1/1.14 central de la tarjeta.
#    Dimensionar el QR contra el slot (como se hizo en otros videos) lo deja al borde de que el
#    zoom le coma filas de modulos y deje de decodificar, que es el defecto que costo 2 renders
#    en apafireants.
#
#    Area segura al zoom MAXIMO: 760/1.14 x 428/1.14 = 667 x 375.
#    El QR cuadrado se hace de 0.86 de esa altura y se centra.
import pathlib, json, sys
import qrcode
from PIL import Image, ImageFilter

URL = "https://manual-reparaciones-caseras.vercel.app/?src=yt-tfb-sifon"
W, H = 760, 428              # slot REAL de FloatingInsert
ZOOM_MAX = 1.14              # kb final del componente
SS = 2                       # se dibuja a 2x y se baja, para que el QR quede nitido
CREMA = (246, 239, 221)      # #F6EFDD, el crema de la marca del canal

OUT = pathlib.Path(__file__).resolve().parents[1] / "public" / "img"
OUT.mkdir(parents=True, exist_ok=True)

safe_h = H / ZOOM_MAX
lado = int(safe_h * 0.86)                      # 322 px sobre el lienzo de 428

q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=20, border=2)
q.add_data(URL)
q.make(fit=True)
code = q.make_image(fill_color="black", back_color="white").convert("RGB")
code = code.resize((lado * SS, lado * SS), Image.Resampling.NEAREST)   # NEAREST = modulos limpios

card = Image.new("RGB", (W * SS, H * SS), CREMA)
card.paste(code, ((W * SS - code.width) // 2, (H * SS - code.height) // 2))
card = card.resize((W, H), Image.Resampling.LANCZOS)
card.save(OUT / "tfbsifon_qr.png")
card.filter(ImageFilter.GaussianBlur(18)).save(OUT / "tfbsifon_qr_blur.jpg", quality=82)


def cover(im, sw, sh):
    """replica objectFit:cover del kit"""
    s = max(sw / im.width, sh / im.height)
    r = im.resize((max(1, int(im.width * s)), max(1, int(im.height * s))), Image.Resampling.LANCZOS)
    x, y = (r.width - sw) // 2, (r.height - sh) // 2
    return r.crop((x, y, x + sw, y + sh))


def zoom(im, z):
    """replica el transform scale(z) del Ken-Burns: se ve el 1/z central"""
    w, h = int(im.width / z), int(im.height / z)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h)).resize((im.width, im.height), Image.Resampling.LANCZOS)


def decode(im):
    try:
        from pyzbar.pyzbar import decode as zdec
        d = zdec(im)
        if d:
            return d[0].data.decode()
    except Exception:
        pass
    import cv2, numpy as np
    v, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.cvtColor(np.array(im), cv2.COLOR_RGB2BGR))
    return v or ""


# COMPUERTA: decodificar como se ve EN PANTALLA — pasado por cover, en los dos extremos del
# Ken-Burns, y a los tamanos reales a los que se muestra la tarjeta.
checks, malos = {}, {}
base = cover(Image.open(OUT / "tfbsifon_qr.png"), W, H)
for z in (1.06, 1.10, 1.14):
    vis = zoom(base, z)
    for px in (W, 560, 420):
        tag = "z%.2f@%d" % (z, px)
        got = decode(vis.resize((px, int(px * H / W)), Image.Resampling.LANCZOS))
        checks[tag] = got
        if got != URL:
            malos[tag] = got
print(json.dumps({"url": URL, "card": [W, H], "qr_lado": lado,
                  "area_segura": [round(W / ZOOM_MAX), round(H / ZOOM_MAX)],
                  "checks_ok": len(checks) - len(malos), "checks_total": len(checks),
                  "malos": malos}, indent=1, ensure_ascii=False))
if malos:
    sys.exit("QR NO decodifica en pantalla en %d de %d condiciones" % (len(malos), len(checks)))
