# -*- coding: utf-8 -*-
"""QR del embudo de fcstaza9 -> public/img/fcstaza9_qrcard.png
Casa: qrcode ECC-M, quiet-zone 4 modulos, verificacion por decode con OpenCV a 360/420/560px
(el PNG crudo con modulos gigantes NO decodifica: hay que probar al tamano en que se VE)."""
from __future__ import annotations
import json
from pathlib import Path
import cv2
import numpy as np
import qrcode
from qrcode.constants import ERROR_CORRECT_M
from PIL import Image

URL = "https://www.drfederer.com/"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"


def build_qr():
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_M, box_size=16, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    return qr.make_image(fill_color="#111111", back_color="#FFFFFF").convert("RGB")


def decode(img) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    qr_img = build_qr()
    path = OUT / "fcstaza9_qrcard.png"
    qr_img.save(path, optimize=True)
    checks = {}
    for px in (360, 420, 560):
        dec = decode(qr_img.resize((px, px), Image.Resampling.LANCZOS))
        checks[str(px)] = dec == URL
        assert dec == URL, "fcstaza9_qrcard no decodifica a %dpx: %r" % (px, dec)
    print(json.dumps({"url": URL, "path": str(path), "size": qr_img.size, "decode": checks}, ensure_ascii=False))


if __name__ == "__main__":
    main()
