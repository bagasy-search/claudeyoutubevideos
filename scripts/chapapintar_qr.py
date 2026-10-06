# -*- coding: utf-8 -*-
"""QR funcional de El Constructor Libre para el video chapapintar:
   chapapintar_qr.png (QR crudo) + chapapintar_qr_land.png (tarjeta APAISADA crema,
   para el FloatingInsert al lado del avatar). Verifica por decodificacion OpenCV.
"""
from __future__ import annotations
import json
from pathlib import Path
import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H

URL = "https://constructorlibre.com"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"

INK = "#2B2118"       # espresso
PAPER = "#F6EFDD"     # crema off-white
AMBER = "#C6821F"

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


def build_land(qr_img: Image.Image) -> Image.Image:
    """Tarjeta APAISADA 1520x856 (16:9-ish para el frame 760x428 de FloatingInsert)."""
    W, H = 1520, 856
    card = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(card)
    d.rounded_rectangle((22, 22, W - 22, H - 22), radius=48, outline=AMBER, width=8)
    # QR a la izquierda, textos a la derecha
    qr_size = 620
    qr_r = qr_img.resize((qr_size, qr_size), Image.Resampling.LANCZOS)
    qx, qy = 120, (H - qr_size) // 2
    pad = 24
    d.rounded_rectangle((qx - pad, qy - pad, qx + qr_size + pad, qy + qr_size + pad), radius=28, fill="#FFFFFF")
    card.paste(qr_r, (qx, qy))
    tx = qx + qr_size + 110
    d.text((tx, 300), "ESCANEA CON", font=font(FONT_BODY_BOLD, 58), fill=INK, anchor="lm")
    d.text((tx, 372), "TU CELULAR", font=font(FONT_BODY_BOLD, 58), fill=INK, anchor="lm")
    d.text((tx, 470), "La Coleccion del", font=font(FONT_BODY_BOLD, 44), fill=AMBER, anchor="lm")
    d.text((tx, 524), "Constructor Libre", font=font(FONT_BODY_BOLD, 44), fill=AMBER, anchor="lm")
    return card


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    qr_img = build_qr()
    qr_path = OUT / "chapapintar_qr.png"
    qr_img.save(qr_path, optimize=True)

    checks = {}
    for px in (420, 560, 760):
        decoded = decode(qr_img.resize((px, px), Image.Resampling.LANCZOS))
        checks[str(px)] = {"decoded": decoded, "ok": decoded == URL}
        assert decoded == URL, f"chapapintar_qr no decodifica a {px}px: {decoded!r}"

    land = build_land(qr_img)
    land_path = OUT / "chapapintar_qr_land.png"
    land.save(land_path, optimize=True)
    land_dec = decode(land.resize((760, 428), Image.Resampling.LANCZOS))
    assert land_dec == URL, f"chapapintar_qr_land no decodifica: {land_dec!r}"

    print(json.dumps({
        "url": URL,
        "qr": str(qr_path), "qr_size": qr_img.size,
        "land": str(land_path),
        "standalone_checks": checks,
        "land_decoded_760px": land_dec,
        "verified": all(c["ok"] for c in checks.values()) and land_dec == URL,
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
