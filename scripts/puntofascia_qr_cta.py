# -*- coding: utf-8 -*-
"""Genera el QR funcional de puntofascia (pf_qr.png) + tarjeta opcional (pf_qrcard).

Sigue la casa (cmesilencio): qrcode ECC-H, quiet-zone 4 modulos, verificacion por
decodificacion con OpenCV a varios tamanos. Look clinico teal/crema/tinta.
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H

URL = "https://archivos-federer.vercel.app"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"

INK = "#123B3A"        # tinta oscura teal-ada
PAPER = "#F6F3EA"      # crema off-white
TEAL = "#12B3AE"
TEAL_SOFT = "#0E8F8B"

FONT_DIR = Path(r"C:\Windows\Fonts")
FONT_BODY_BOLD = FONT_DIR / "arialbd.ttf"


def build_qr() -> Image.Image:
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_H, box_size=16, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    return qr.make_image(fill_color=INK, back_color=PAPER).convert("RGB")


def decode(img: Image.Image) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def build_card(qr_img: Image.Image) -> Image.Image:
    W = H = 1080
    card = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(card)
    # marco teal
    d.rounded_rectangle((26, 26, W - 26, H - 26), radius=44, outline=TEAL, width=8)
    # titulo
    title_f = font(FONT_BODY_BOLD, 60)
    d.text((W // 2, 120), "LA GUIA COMPLETA", font=title_f, fill=INK, anchor="mm")
    sub_f = font(FONT_BODY_BOLD, 34)
    d.text((W // 2, 182), "Secuencia nocturna · senales de alerta", font=sub_f, fill=TEAL_SOFT, anchor="mm")
    # placa blanca del QR (quiet zone conservada)
    qr_size = max(qr_img.size)
    fx = (W - qr_size) // 2
    fy = 250
    pad = 26
    d.rounded_rectangle((fx - pad, fy - pad, fx + qr_size + pad, fy + qr_size + pad), radius=28, fill="#FFFFFF")
    card.paste(qr_img, (fx, fy))
    # url + instruccion
    foot_f = font(FONT_BODY_BOLD, 40)
    d.text((W // 2, fy + qr_size + 92), "archivos-federer.vercel.app", font=foot_f, fill=INK, anchor="mm")
    inst_f = font(FONT_BODY_BOLD, 34)
    d.text((W // 2, fy + qr_size + 150), "ESCANEA PARA LA GUIA", font=inst_f, fill=TEAL, anchor="mm")
    return card


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    qr_img = build_qr()
    qr_path = OUT / "pf_qr.png"
    qr_img.save(qr_path, optimize=True)

    checks = {}
    for px in (420, 560, 760):
        decoded = decode(qr_img.resize((px, px), Image.Resampling.LANCZOS))
        checks[str(px)] = {"decoded": decoded, "ok": decoded == URL}
        assert decoded == URL, f"pf_qr no decodifica a {px}px: {decoded!r}"

    card = build_card(qr_img)
    card_path = OUT / "pf_qrcard.jpg"
    card.save(card_path, quality=92, optimize=True)
    card_decoded = decode(card.resize((540, 540), Image.Resampling.LANCZOS))
    assert card_decoded == URL, f"pf_qrcard no decodifica: {card_decoded!r}"

    print(json.dumps({
        "url": URL,
        "pf_qr": str(qr_path),
        "pf_qr_size": qr_img.size,
        "pf_qrcard": str(card_path),
        "standalone_checks": checks,
        "card_decoded_540px": card_decoded,
        "verified": all(c["ok"] for c in checks.values()) and card_decoded == URL,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
