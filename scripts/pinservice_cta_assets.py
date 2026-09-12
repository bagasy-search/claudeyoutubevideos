# -*- coding: utf-8 -*-
"""CTA de `pinservice` (canal La Pinza de Claudio) -> public/img/pinservice/

Reglas del canal que esto respeta y que NO se tocan:
  · El QR apunta a la landing REAL y se VERIFICA decodificandolo al TAMANO EN QUE SE VE.
  · CERO precio en pantalla.
  · CERO resenas inventadas: solo titulos y paginas YA publicados en la landing viva.
  · Paleta de este canal: negro + ROJO + blanco (la de sus miniaturas), no el verde volt.
Las capturas de las paginas se reusan de public/img/cmeciclo/landing (misma landing, mismo producto).
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

URL = "https://claudiomendoza.vercel.app/?src=yt-pin1"
DOMINIO = "claudiomendoza.vercel.app"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img" / "pinservice"
LANDING = ROOT / "public" / "img" / "cmeciclo" / "landing"
W, H = 1920, 1080

INK = "#0A0B08"
PAPER = "#F4F2E8"
RED = "#E03127"
MUTED = "#A8ACA0"

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
    draw.rectangle((0, 0, W, 12), fill=RED)
    draw.ellipse((1460, -350, 2210, 400), fill="#1A100F")
    draw.ellipse((-300, 760, 420, 1480), fill="#161110")
    return img, draw


def add_brand(draw: ImageDraw.ImageDraw, kicker: str) -> None:
    draw.rounded_rectangle((80, 62, 146, 128), radius=18, fill=RED)
    draw.polygon([(103, 78), (129, 78), (115, 98), (132, 98), (101, 126), (110, 105), (93, 105)], fill=PAPER)
    draw.text((168, 74), "LA PINZA DE CLAUDIO", font=font(BODY_BOLD, 28), fill=PAPER)
    draw.text((168, 108), kicker, font=font(BODY, 20), fill=MUTED)


def save_with_blur(img: Image.Image, stem: str) -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    png = OUT / f"{stem}.png"
    blur = OUT / f"{stem}_blur.jpg"
    img.save(png, optimize=True)
    img.filter(ImageFilter.GaussianBlur(18)).convert("RGB").save(blur, quality=83, optimize=True)
    return {
        "image": png.relative_to(ROOT / "public").as_posix(),
        "blur": blur.relative_to(ROOT / "public").as_posix(),
        "sha256": hashlib.sha256(png.read_bytes()).hexdigest(),
        "size": list(img.size),
    }


def qr_card(qr: Image.Image) -> Image.Image:
    """Se ve mientras dice 'el codigo esta aca en la pantalla y el enlace te queda abajo'."""
    img, draw = base_canvas()
    add_brand(draw, "TODO MEDIDO CON LA PINZA")
    draw.text((82, 200), "SESENTA APARATOS", font=font(DISPLAY, 96), fill=PAPER)
    draw.text((82, 302), "YA MEDIDOS", font=font(DISPLAY, 96), fill=RED)
    copy = ("La tabla de consumos de una casa entera, con las hojas rapidas para imprimir "
            "y pegar adentro de la puerta del tablero.")
    draw.multiline_text((88, 445), wrap(draw, copy, font(BODY, 36), 950), font=font(BODY, 36),
                        fill="#D8DACF", spacing=13)
    draw.rounded_rectangle((1230, 120, 1810, 700), radius=40, fill=PAPER, outline=RED, width=7)
    img.paste(qr.resize((500, 500), Image.Resampling.NEAREST), (1270, 160))
    draw.rounded_rectangle((1228, 742, 1812, 914), radius=32, fill=RED)
    draw.text((1520, 788), "ESCANEA CON TU CELULAR", font=font(DISPLAY, 44), fill=PAPER, anchor="ma")
    draw.text((1520, 856), "Tambien esta en la descripcion", font=font(BODY_BOLD, 25), fill=PAPER, anchor="ma")
    draw.text((88, 905), DOMINIO.upper(), font=font(DISPLAY, 58), fill=RED)
    return img


def pages_card() -> Image.Image:
    """Lo que hay adentro, con los TITULOS y las PAGINAS REALES de la landing."""
    img, draw = base_canvas()
    add_brand(draw, "LO QUE HAY ADENTRO")
    draw.text((82, 190), "LA GUIA DEL CANAL", font=font(DISPLAY, 82), fill=PAPER)
    draw.text((82, 285), "APARATO POR APARATO", font=font(DISPLAY, 76), fill=RED)
    draw.multiline_text((88, 425),
                        "Ahorro Extremo - Metodo Cero Derroche\n"
                        "Cuando se va la luz\n"
                        "Promete 100 W. Entrega 43 W.\n"
                        "Cuaderno practico de 30 dias\n"
                        "Que comprar, cuanto pagar y donde te van a estafar",
                        font=font(BODY_BOLD, 32), fill="#D8DACF", spacing=18)
    files = [LANDING / "portada-ahorro-extremo.png", LANDING / "pagina-01.jpg", LANDING / "pagina-02.jpg"]
    boxes = [(930, 115, 1250, 955), (1275, 160, 1550, 910), (1570, 160, 1845, 910)]
    for idx, (path, box) in enumerate(zip(files, boxes)):
        x1, y1, x2, y2 = box
        page = fit_cover(Image.open(path).convert("RGB"), (x2 - x1, y2 - y1))
        draw.rounded_rectangle((x1 + 12, y1 + 18, x2 + 18, y2 + 24), radius=16, fill="#000000")
        img.paste(page, (x1, y1))
        draw.rounded_rectangle(box, radius=12, outline=RED if idx == 0 else "#4A4442", width=5)
    draw.text((88, 905), "MIDE ANTES DE PAGAR", font=font(DISPLAY, 46), fill=PAPER)
    return img


def decode(img: Image.Image) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def decode_como_en_pantalla(png: Path) -> str:
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
    assets["qr_card"] = save_with_blur(qr_card(qr), "pinservice_cta_qr")
    assets["pages"] = save_with_blur(pages_card(), "pinservice_cta_pages")

    checks = {
        "full_card": decode(Image.open(OUT / "pinservice_cta_qr.png")),
        "card_a_tamano_de_pantalla": decode_como_en_pantalla(OUT / "pinservice_cta_qr.png"),
    }
    malos = {k: v for k, v in checks.items() if v != URL}
    if malos:
        raise SystemExit(f"QR NO decodifica a la URL real: {malos}")

    manifest = {
        "slug": "pinservice",
        "destination_url": URL,
        "price_visible": False,
        "reviews_used": [],
        "review_policy": "Sin resenas: no se inventa ninguna. Solo titulos y paginas publicados en la landing viva.",
        "promesa_del_guion": "la guia del canal: los sesenta aparatos de una casa ya medidos, con las tablas para imprimir",
        "cumple": "la landing publica la tabla de 60 aparatos medidos y las hojas rapidas para imprimir",
        "qr_checks": checks,
        "assets": assets,
    }
    (OUT / "pinservice_cta_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
                                                      encoding="utf-8")
    print(json.dumps({"ok": True, "assets": len(assets), "qr_checks": checks}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
