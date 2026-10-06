# -*- coding: utf-8 -*-
"""QR funcional del embudo de mdpros -> public/img/mdpros_qrcard.png
Casa: qrcode ECC-H, quiet-zone 4 modulos, verificacion por decode con OpenCV a 360/420/560px."""
from __future__ import annotations
import json
from pathlib import Path
import cv2
import numpy as np
import qrcode
from qrcode.constants import ERROR_CORRECT_M

URL = "https://hydrogen-peroxide-ventas.vercel.app/"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"


def build_qr() -> "Image":
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_M, box_size=16, border=4)
    qr.add_data(URL)
    qr.make(fit=True)
    return qr.make_image(fill_color="#111111", back_color="#FFFFFF").convert("RGB")


def decode(img) -> str:
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def main() -> None:
    from PIL import Image
    OUT.mkdir(parents=True, exist_ok=True)
    qr_img = build_qr()
    path = OUT / "mdpros_qrcard.png"
    qr_img.save(path, optimize=True)
    checks = {}
    for px in (360, 420, 560):
        dec = decode(qr_img.resize((px, px), Image.Resampling.LANCZOS))
        checks[str(px)] = dec == URL
        assert dec == URL, f"mdpros_qrcard no decodifica a {px}px: {dec!r}"
    print(json.dumps({"url": URL, "path": str(path), "size": qr_img.size,
                      "checks": checks, "verified": all(checks.values())}, ensure_ascii=False))


if __name__ == "__main__":
    main()
