# -*- coding: utf-8 -*-
"""CTA determinista de `cmeciclo`: QR real a la landing viva + tarjeta de lo que hay adentro.

Reglas del canal que esto respeta y que NO se tocan:
  · El QR apunta a la landing REAL y se VERIFICA decodificandolo (no se entrega un QR de adorno).
  · CERO precio en pantalla (lo pide el creador: el precio no se dice ni se muestra en el video).
  · CERO resenas inventadas: sólo se usan textos y paginas que ya estan publicados en la landing.
  · Paleta VOLT del canal (negro + verde voltio), coherente con las miniaturas.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from qrcode.constants import ERROR_CORRECT_H

URL = "https://claudiomendoza.vercel.app/"
DOMINIO = "claudiomendoza.vercel.app"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img" / "cmeciclo"
LANDING = OUT / "landing"
W, H = 1920, 1080

INK = "#10120D"
PAPER = "#F4F2E8"
VOLT = "#A8DC2A"
MUTED = "#AAAFA1"

FONT_DIR = Path(r"C:\Windows\Fonts")
DISPLAY = FONT_DIR / "ARIALNB.TTF"
BODY = FONT_DIR / "arial.ttf"
BODY_BOLD = FONT_DIR / "arialbd.ttf"


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def fit_cover(img: Image.Image, size: tuple[int, int]) -> Image.Image:
    iw, ih = img.size
    tw, th = size
    scale = max(tw / iw, th / ih)
    r = img.resize((round(iw * scale), round(ih * scale)), Image.Resampling.LANCZOS)
    left, top = (r.width - tw) // 2, (r.height - th) // 2
    return r.crop((left, top, left + tw, top + th))


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> str:
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return "\n".join(lines)


def make_qr() -> Image.Image:
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, box_size=16, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    return qr.make_image(fill_color=INK, back_color=PAPER).convert("RGB")


def base_canvas() -> tuple[Image.Image, ImageDraw.ImageDraw]:
    img = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 12), fill=VOLT)
    draw.ellipse((1460, -350, 2210, 400), fill="#18200F")
    draw.ellipse((-300, 760, 420, 1480), fill="#161B11")
    return img, draw


def add_brand(draw: ImageDraw.ImageDraw, kicker: str) -> None:
    draw.rounded_rectangle((80, 62, 146, 128), radius=18, fill=VOLT)
    draw.polygon([(103, 78), (129, 78), (115, 98), (132, 98), (101, 126), (110, 105), (93, 105)], fill=INK)
    draw.text((168, 74), "CLAUDIO MENDOZA", font=font(BODY_BOLD, 28), fill=PAPER)
    draw.text((168, 108), kicker, font=font(BODY, 20), fill=MUTED)


def save_with_blur(img: Image.Image, stem: str) -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    png = OUT / f"{stem}.png"
    blur = OUT / f"{stem}_blur.jpg"
    img.save(png, optimize=True)
    img.filter(ImageFilter.GaussianBlur(18)).save(blur, quality=83, optimize=True)
    return {
        "image": png.relative_to(ROOT / "public").as_posix(),
        "blur": blur.relative_to(ROOT / "public").as_posix(),
        "sha256": hashlib.sha256(png.read_bytes()).hexdigest(),
        "size": list(img.size),
    }


def qr_card(qr: Image.Image) -> Image.Image:
    """La tarjeta que se ve mientras dice 'el codigo esta aca en la pantalla'."""
    img, draw = base_canvas()
    add_brand(draw, "ENERGIA EN CASA · TODO MEDIDO")
    draw.text((82, 200), "¿CUANTO ME VA", font=font(DISPLAY, 100), fill=PAPER)
    draw.text((82, 305), "A DURAR?", font=font(DISPLAY, 100), fill=VOLT)
    copy = ("Las cuentas ya resueltas para cada tipo de bateria y cada aparato de la casa, "
            "mas la tabla de cable y fusible.")
    draw.multiline_text((88, 445), wrap(draw, copy, font(BODY, 36), 950), font=font(BODY, 36),
                        fill="#D8DACF", spacing=13)
    draw.rounded_rectangle((1230, 120, 1810, 700), radius=40, fill=PAPER, outline=VOLT, width=7)
    img.paste(qr.resize((500, 500), Image.Resampling.NEAREST), (1270, 160))
    draw.rounded_rectangle((1228, 742, 1812, 914), radius=32, fill=VOLT)
    draw.text((1520, 788), "ESCANEA CON TU CELULAR", font=font(DISPLAY, 44), fill=INK, anchor="ma")
    draw.text((1520, 856), "Tambien esta en la descripcion", font=font(BODY_BOLD, 25), fill=INK, anchor="ma")
    draw.text((88, 905), DOMINIO.upper(), font=font(DISPLAY, 58), fill=VOLT)
    return img


def pages_card() -> Image.Image:
    """Lo que hay adentro, con las PAGINAS REALES publicadas en la landing."""
    img, draw = base_canvas()
    add_brand(draw, "LO QUE HAY ADENTRO")
    draw.text((82, 190), "SESENTA APARATOS", font=font(DISPLAY, 82), fill=PAPER)
    draw.text((82, 285), "MEDIDOS UNO POR UNO", font=font(DISPLAY, 82), fill=VOLT)
    # Titulos REALES de los capitulos publicados en la landing (no inventados).
    draw.multiline_text((88, 425),
                        "60 aparatos con medicion, reduccion y alerta\n"
                        "Cable y fusible: que grosor va en cada cosa\n"
                        "Las 7 conexiones que no se hacen nunca\n"
                        "Cuanto me va a durar: la cuenta ya resuelta",
                        font=font(BODY_BOLD, 34), fill="#D8DACF", spacing=20)
    files = [LANDING / "portada-ahorro-extremo.png", LANDING / "pagina-01.jpg", LANDING / "pagina-02.jpg"]
    boxes = [(930, 115, 1250, 955), (1275, 160, 1550, 910), (1570, 160, 1845, 910)]
    for idx, (path, box) in enumerate(zip(files, boxes)):
        x1, y1, x2, y2 = box
        page = fit_cover(Image.open(path).convert("RGB"), (x2 - x1, y2 - y1))
        draw.rounded_rectangle((x1 + 12, y1 + 18, x2 + 18, y2 + 24), radius=16, fill="#000000")
        img.paste(page, (x1, y1))
        draw.rounded_rectangle(box, radius=12, outline=VOLT if idx == 0 else "#4A5142", width=5)
    draw.text((88, 905), "MIDE ANTES DE COMPRAR", font=font(DISPLAY, 46), fill=PAPER)
    return img


def decode(img: Image.Image) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def decode_como_en_pantalla(png: Path) -> str:
    """El QR se verifica al TAMANO EN QUE SE VE, manteniendo el aspecto.

    Un crop reescalado a cuadrado deforma el codigo y devuelve vacio: parece roto y esta perfecto.
    """
    img = Image.open(png).convert("RGB")
    w, h = img.size
    escala = 560 / max(w, h)
    chico = img.resize((max(1, round(w * escala)), max(1, round(h * escala))), Image.Resampling.LANCZOS)
    return decode(chico)


def main() -> None:
    faltan = [p.name for p in [LANDING / "portada-ahorro-extremo.png", LANDING / "pagina-01.jpg",
                               LANDING / "pagina-02.jpg"] if not p.exists()]
    if faltan:
        raise SystemExit(f"faltan paginas reales de la landing: {faltan}")

    qr = make_qr()
    assets: dict[str, dict] = {}
    assets["qr_only"] = save_with_blur(qr.resize((720, 720), Image.Resampling.NEAREST), "cmeciclo_qr_only")
    assets["qr_card"] = save_with_blur(qr_card(qr), "cmeciclo_cta_qr")
    assets["pages"] = save_with_blur(pages_card(), "cmeciclo_cta_pages")

    checks = {
        "standalone": decode(Image.open(OUT / "cmeciclo_qr_only.png")),
        "full_card": decode(Image.open(OUT / "cmeciclo_cta_qr.png")),
        "card_a_tamano_de_pantalla": decode_como_en_pantalla(OUT / "cmeciclo_cta_qr.png"),
    }
    malos = {k: v for k, v in checks.items() if v != URL}
    if malos:
        raise SystemExit(f"QR NO decodifica a la URL real: {malos}")

    manifest = {
        "slug": "cmeciclo",
        "destination_url": URL,
        "price_visible": False,
        "reviews_used": [],
        "review_policy": "Sin resenas: la landing viva no publica testimonios con nombre y edad. No se inventa ninguna.",
        "source_pages": "https://claudiomendoza.vercel.app/ (paginas descargadas de la landing viva)",
        "qr_checks": checks,
        "assets": assets,
    }
    (OUT / "cmeciclo_cta_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
                                                    encoding="utf-8")
    print(json.dumps({"ok": True, "assets": len(assets), "qr_checks": checks}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
