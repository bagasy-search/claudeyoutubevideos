# -*- coding: utf-8 -*-
"""Genera las tarjetas QR deterministas de las tres CTAs de cmesilencio.

El QR se compone con texto y geometría raster deterministas para conservar copy exacto,
zona tranquila y legibilidad al tamaño en que lo verá el espectador.
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
ROOT = Path(__file__).resolve().parents[1]
PROJECT_OUT = ROOT / "public" / "img" / "cmesilencio"
DELIVER_OUT = Path(r"C:\Users\bauti\Documents\Codex\2026-08-28\files-pasted-by-the-user-agnes\outputs")
W = H = 1080

INK = "#0A0B08"
PAPER = "#F6F5EF"
VOLT = "#C8F000"
VOLT_SOFT = "#8FAD00"
MUTED = "#AAB29A"

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_BODY = FONT_DIR / "arial.ttf"
FONT_BODY_BOLD = FONT_DIR / "arialbd.ttf"
FONT_DISPLAY = FONT_DIR / "ARIALNB.TTF"
FONT_DISPLAY_BOLD = FONT_DIR / "ARIALNB.TTF"

VARIANTS = [
    {
        "key": "01_luz",
        "eyebrow": "NOTA DE CAMPO 01",
        "title": "CUANDO SE VA\nLA LUZ",
        "subtitle": "Qué mantener encendido\nsin improvisar",
        "footer": "ABRE LA GUÍA",
    },
    {
        "key": "02_100w",
        "eyebrow": "NOTA DE CAMPO 02",
        "title": "PROMETE 100 W.\nENTREGA 43 W.",
        "subtitle": "La prueba antes\nde comprar",
        "footer": "ABRE LA GUÍA",
    },
    {
        "key": "03_todo_medido",
        "eyebrow": "NOTA DE CAMPO 03",
        "title": "TODO\nMEDIDO",
        "subtitle": "Las dos guías +\nlos cuatro anexos",
        "footer": "ABRE EL MAPA",
    },
]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def text_box(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont) -> tuple[int, int, int, int]:
    return draw.multiline_textbbox((0, 0), text, font=fnt, spacing=0)


def build_qr() -> Image.Image:
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,
        box_size=12,
        border=4,
    )
    qr.add_data(URL)
    qr.make(fit=True)
    return qr.make_image(fill_color=INK, back_color=PAPER).convert("RGB")


def rounded_panel(card: Image.Image, box: tuple[int, int, int, int], radius: int, fill: str, outline: str | None = None, width: int = 1) -> None:
    draw = ImageDraw.Draw(card)
    draw.rounded_rectangle(box, radius=radius, fill=fill, outline=outline, width=width)


def build_card(qr_img: Image.Image, variant: dict[str, str], number: int) -> Image.Image:
    canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))

    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle((47, 58, 1035, 1046), radius=56, fill=(0, 0, 0, 205))
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    canvas.alpha_composite(shadow, (0, 16))

    card = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card)
    card_draw.rounded_rectangle((40, 40, 1040, 1040), radius=56, fill=INK, outline=VOLT, width=3)

    # Retícula mínima: evoca medición sin competir con el QR ni el copy.
    for x in range(94, 1000, 44):
        card_draw.line((x, 86, x, 995), fill=(200, 240, 0, 10), width=1)
    for y in range(104, 995, 44):
        card_draw.line((86, y, 995, y), fill=(200, 240, 0, 8), width=1)

    card_draw.ellipse((78, 78, 98, 98), fill=VOLT)
    body = font(FONT_BODY_BOLD, 22)
    body_regular = font(FONT_BODY, 20)
    display = font(FONT_DISPLAY_BOLD, 78 if number != 2 else 66)
    eyebrow = font(FONT_BODY_BOLD, 25)
    footer = font(FONT_BODY_BOLD, 22)

    card_draw.text((116, 76), "CLAUDIO MENDOZA", font=body, fill=PAPER)
    card_draw.text((116, 106), "ENERGÍA EN CASA", font=body_regular, fill=MUTED)
    card_draw.text((800, 82), variant["eyebrow"], font=eyebrow, fill=VOLT, anchor="ra")

    title = variant["title"]
    bbox = text_box(card_draw, title, display)
    title_h = bbox[3] - bbox[1]
    card_draw.multiline_text((92, 164), title, font=display, fill=PAPER, spacing=-5)
    title_bottom = 164 + title_h
    card_draw.rounded_rectangle((92, title_bottom + 22, 988, title_bottom + 29), radius=3, fill=VOLT)
    card_draw.multiline_text((92, title_bottom + 52), variant["subtitle"], font=font(FONT_BODY, 31), fill=MUTED, spacing=4)

    # El panel claro mantiene el quiet zone del QR y lo hace legible sobre cualquier b-roll.
    qr_size = max(qr_img.size)
    frame_left = (W - qr_size) // 2 - 28
    frame_top = 410
    frame_right = frame_left + qr_size + 56
    frame_bottom = frame_top + qr_size + 56
    card_draw.rounded_rectangle((frame_left, frame_top, frame_right, frame_bottom), radius=32, fill=PAPER)
    card_draw.rounded_rectangle((frame_left - 10, frame_top - 10, frame_right + 10, frame_bottom + 10), radius=42, outline=(200, 240, 0, 130), width=2)
    card.alpha_composite(qr_img.convert("RGBA"), (frame_left + 28, frame_top + 28))

    card_draw.text((W // 2, frame_bottom + 24), variant["footer"], font=footer, fill=VOLT, anchor="ma")
    card_draw.text((W // 2, frame_bottom + 55), "TODO MEDIDO · MEDIDO DE VERDAD", font=font(FONT_BODY, 18), fill=MUTED, anchor="ma")

    canvas.alpha_composite(card)
    return canvas


def composite_for_scan(img: Image.Image, size: tuple[int, int] | None = None) -> Image.Image:
    rgba = img.convert("RGBA")
    bg = Image.new("RGBA", rgba.size, INK)
    bg.alpha_composite(rgba)
    rgb = bg.convert("RGB")
    if size:
        rgb = rgb.resize(size, Image.Resampling.LANCZOS)
    return rgb


def decode(img: Image.Image) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def main() -> None:
    PROJECT_OUT.mkdir(parents=True, exist_ok=True)
    DELIVER_OUT.mkdir(parents=True, exist_ok=True)
    qr_img = build_qr()

    qr_only_name = "cms_cta_qr_only.png"
    qr_img.save(PROJECT_OUT / qr_only_name, optimize=True)
    qr_img.save(DELIVER_OUT / qr_only_name, optimize=True)

    qr_checks = {}
    for px in (420, 560, 760):
        decoded = decode(qr_img.resize((px, px), Image.Resampling.LANCZOS))
        qr_checks[str(px)] = {"decoded": decoded, "ok": decoded == URL}
        assert decoded == URL, f"QR standalone no decodifica a {px}px: {decoded!r}"

    variants_meta = []
    for idx, variant in enumerate(VARIANTS, start=1):
        card = build_card(qr_img, variant, idx)
        name = f"cms_cta_qr_{variant['key']}.png"
        card.save(PROJECT_OUT / name, optimize=True)
        card.save(DELIVER_OUT / name, optimize=True)
        # El farm espera un companion _blur para cualquier imagen raster que pueda
        # terminar como cama. La tarjeta se usa nítida como CTA, pero dejamos también
        # la variante de respaldo para que el preflight sea cerrado y determinista.
        blur_name = f"cms_cta_qr_{variant['key']}_blur.jpg"
        blurred = composite_for_scan(card).filter(ImageFilter.GaussianBlur(10))
        blurred.save(PROJECT_OUT / blur_name, quality=82, optimize=True)
        blurred.save(DELIVER_OUT / blur_name, quality=82, optimize=True)
        decoded_full = decode(composite_for_scan(card, (470, 470)))
        variants_meta.append({
            "key": variant["key"],
            "filename": name,
            "cta": variant,
            "size": [W, H],
            "decoded_at_470px": decoded_full,
            "verified": decoded_full == URL,
            "sha256": hashlib.sha256((PROJECT_OUT / name).read_bytes()).hexdigest(),
        })
        assert decoded_full == URL, f"Tarjeta {name} no decodifica al tamaño de pantalla: {decoded_full!r}"

    manifest = {
        "slug": "cmesilencio",
        "asset_type": "deterministic_qr_cta_cards",
        "destination_url": URL,
        "brand_system": {
            "ink": INK,
            "paper": PAPER,
            "volt": VOLT,
            "display_font": "Arial Narrow Bold fallback for Oswald",
            "body_font": "Arial fallback for IBM Plex Sans",
        },
        "qr": {
            "error_correction": "H",
            "quiet_zone_modules": 4,
            "standalone_verification": qr_checks,
        },
        "variants": variants_meta,
        "usage": {
            "cta_01": "Después de plantear qué mantener encendido durante un apagón.",
            "cta_02": "Después de hablar de cables, baterías y paneles que prometen más de lo que entregan.",
            "cta_03": "En el cierre, cuando el video conecta ruido, consumo y respaldo.",
            "render_note": "Mostrar una variante por CTA, sin inventar tiempos hasta transcribir el WAV real.",
        },
    }
    for dest in (PROJECT_OUT / "cmesilencio_qr_cta_manifest.json", DELIVER_OUT / "cmesilencio_qr_cta_manifest.json"):
        dest.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({
        "qr_only": qr_only_name,
        "variants": [v["filename"] for v in variants_meta],
        "url": URL,
        "verified": all(v["verified"] for v in variants_meta) and all(v["ok"] for v in qr_checks.values()),
        "project_dir": str(PROJECT_OUT),
        "deliver_dir": str(DELIVER_OUT),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
