# -*- coding: utf-8 -*-
"""CTA determinista de cmecalor: QR, páginas reales y reseñas reales de la landing."""
from __future__ import annotations

import hashlib
import json
import textwrap
from pathlib import Path

import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from qrcode.constants import ERROR_CORRECT_H


URL = "https://claudiomendoza.vercel.app/"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img" / "cmecalor"
LANDING = OUT / "landing"
W, H = 1920, 1080

INK = "#10120D"
PAPER = "#F4F2E8"
VOLT = "#A8DC2A"
VOLT_DARK = "#5C8410"
MUTED = "#AAAFA1"
ALERT = "#C45136"

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
    resized = img.resize((round(iw * scale), round(ih * scale)), Image.Resampling.LANCZOS)
    left = (resized.width - tw) // 2
    top = (resized.height - th) // 2
    return resized.crop((left, top, left + tw, top + th))


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> str:
    words = text.split()
    lines: list[str] = []
    line = ""
    for word in words:
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
    img, draw = base_canvas()
    add_brand(draw, "ENERGÍA EN CASA · RESPALDO MEDIDO")
    draw.text((82, 205), "MICROGENERADORES", font=font(DISPLAY, 108), fill=PAPER)
    draw.text((86, 330), "AUTONOMÍA · ARRANQUE · AISLAMIENTO", font=font(BODY_BOLD, 32), fill=VOLT)
    copy = "Calcula qué sistema necesitas según el consumo real, el pico del motor y las horas que quieres cubrir."
    draw.multiline_text((88, 430), wrap(draw, copy, font(BODY, 36), 880), font=font(BODY, 36), fill="#D8DACF", spacing=13)
    draw.rounded_rectangle((1230, 120, 1810, 700), radius=40, fill=PAPER, outline=VOLT, width=7)
    qr2 = qr.resize((500, 500), Image.Resampling.NEAREST)
    img.paste(qr2, (1270, 160))
    draw.rounded_rectangle((1228, 742, 1812, 914), radius=32, fill=VOLT)
    draw.text((1520, 790), "ESCANEA EL CAPÍTULO", font=font(DISPLAY, 52), fill=INK, anchor="ma")
    draw.text((1520, 861), "También está en la descripción", font=font(BODY_BOLD, 25), fill=INK, anchor="ma")
    draw.text((88, 923), "CUATRO DATOS. UNA DECISIÓN SIN COMPRAS A CIEGAS.", font=font(DISPLAY, 46), fill=PAPER)
    return img


def pages_card() -> Image.Image:
    img, draw = base_canvas()
    add_brand(draw, "CAPÍTULO · MICROGENERADORES")
    draw.text((82, 190), "LA CUENTA YA", font=font(DISPLAY, 94), fill=PAPER)
    draw.text((82, 290), "VIENE RESUELTA", font=font(DISPLAY, 94), fill=VOLT)
    draw.multiline_text((88, 425), "Consumo real\nPico de arranque\nHoras de autonomía", font=font(BODY_BOLD, 36), fill="#D8DACF", spacing=20)
    files = [LANDING / "portada-vol1.jpg", LANDING / "pagina-01.jpg", LANDING / "pagina-02.jpg"]
    boxes = [(930, 115, 1250, 955), (1275, 160, 1550, 910), (1570, 160, 1845, 910)]
    for idx, (path, box) in enumerate(zip(files, boxes)):
        x1, y1, x2, y2 = box
        page = fit_cover(Image.open(path).convert("RGB"), (x2 - x1, y2 - y1))
        shadow = (x1 + 12, y1 + 18, x2 + 18, y2 + 24)
        draw.rounded_rectangle(shadow, radius=16, fill="#000000")
        img.paste(page, (x1, y1))
        draw.rounded_rectangle(box, radius=12, outline=VOLT if idx == 0 else "#4A5142", width=5)
    draw.text((88, 920), "RESPALDO SIN ALIMENTAR TODA LA CASA", font=font(DISPLAY, 42), fill=PAPER)
    return img


def review_card(photo_name: str, name: str, age: str, quote: str) -> Image.Image:
    img, draw = base_canvas()
    add_brand(draw, "RESEÑA REAL · COMPRA VERIFICADA")
    photo = fit_cover(Image.open(LANDING / photo_name).convert("RGB"), (480, 680))
    img.paste(photo, (86, 230))
    draw.rounded_rectangle((86, 230, 566, 910), radius=34, outline=VOLT, width=5)
    draw.text((650, 220), "★★★★★", font=font(BODY_BOLD, 48), fill=VOLT)
    qfont = font(BODY_BOLD, 43)
    wrapped = wrap(draw, f"“{quote}”", qfont, 1110)
    draw.multiline_text((650, 315), wrapped, font=qfont, fill=PAPER, spacing=18)
    draw.text((650, 825), name, font=font(DISPLAY, 48), fill=VOLT)
    draw.text((650, 885), age, font=font(BODY, 28), fill=MUTED)
    return img


def decode(img: Image.Image) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def main() -> None:
    qr = make_qr()
    assets: dict[str, dict] = {}
    assets["qr_only"] = save_with_blur(qr.resize((720, 720), Image.Resampling.NEAREST), "cmec_qr_only")
    card = qr_card(qr)
    assets["qr_card"] = save_with_blur(card, "cmec_cta_microgeneradores")
    assets["pages"] = save_with_blur(pages_card(), "cmec_cta_pages")
    assets["review_ricardo"] = save_with_blur(review_card(
        "resena-04.jpg", "RICARDO P.", "61 años",
        "En mi casa los cortes de luz son bastante frecuentes. Ahora ya sé qué puedo dejar conectado, qué tengo que apagar primero y cuánto tiempo me aguanta cada cosa."
    ), "cmec_cta_review_ricardo")
    assets["review_carlos"] = save_with_blur(review_card(
        "resena-01.jpg", "CARLOS M.", "58 años",
        "Busqué el refrigerador, vi cuánto consume y después miré qué batería necesitaba. No tuve que sacar una sola cuenta."
    ), "cmec_cta_review_carlos")

    qr_checks = {
        "standalone": decode(Image.open(OUT / "cmec_qr_only.png")),
        "full_card": decode(Image.open(OUT / "cmec_cta_microgeneradores.png")),
    }
    assert all(v == URL for v in qr_checks.values()), qr_checks

    manifest = {
        "slug": "cmecalor",
        "destination_url": URL,
        "price_visible": False,
        "review_source": "https://claudiomendoza.vercel.app/#resenas",
        "review_policy": "Solo texto y personas publicados en la landing; ninguna reseña inventada.",
        "qr_checks": qr_checks,
        "assets": assets,
    }
    (OUT / "cmec_cta_manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"ok": True, "assets": len(assets), "qr": qr_checks}, ensure_ascii=False))


if __name__ == "__main__":
    main()
