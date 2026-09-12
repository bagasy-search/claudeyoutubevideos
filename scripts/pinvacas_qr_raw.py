# QR suelto de pinvacas (el que el build referencia como img/pinvacas/pin_qr.png)
import pathlib, qrcode, json
from PIL import Image
from pyzbar.pyzbar import decode as zdec

URL = "https://claudiomendoza.vercel.app/?src=yt-pin6"
OUT = pathlib.Path(__file__).resolve().parents[1] / "public" / "img" / "pinvacas"
OUT.mkdir(parents=True, exist_ok=True)

q = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=16, border=4)
q.add_data(URL)
q.make(fit=True)
img = q.make_image(fill_color="black", back_color="white").convert("RGB")
img.save(OUT / "pin_qr.png")

# blur hermano que pide el kit en runtime
img.filter(__import__("PIL.ImageFilter", fromlist=["GaussianBlur"]).GaussianBlur(18)).convert("RGB").save(
    OUT / "pin_qr_blur.jpg", quality=82)

# COMPUERTA: tiene que decodificar al TAMANO REAL EN PANTALLA, no solo en grande
checks = {}
for tag, px in [("nativo", img.width), ("560", 560), ("420", 420)]:
    r = img.resize((px, px), Image.Resampling.LANCZOS)
    d = zdec(r)
    checks[tag] = d[0].data.decode() if d else ""
malos = {k: v for k, v in checks.items() if v != URL}
if malos:
    raise SystemExit("QR NO decodifica: " + json.dumps(malos))
print(json.dumps({"ok": True, "size": img.size, "checks": checks}, indent=1))
