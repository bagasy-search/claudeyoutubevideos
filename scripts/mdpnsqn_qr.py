# -*- coding: utf-8 -*-
import json
from pathlib import Path
import cv2, numpy as np, qrcode
from qrcode.constants import ERROR_CORRECT_M
from PIL import Image
URL = "https://hydrogen-peroxide-ventas.vercel.app/"
OUT = Path(__file__).resolve().parents[1] / "public" / "img"
def build():
    qr = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_M, box_size=20, border=4)
    qr.add_data(URL); qr.make(fit=True)
    return qr.make_image(fill_color="#111111", back_color="#FFFFFF").convert("RGB")
def decode(img):
    arr = cv2.cvtColor(np.array(img.convert("RGB")), cv2.COLOR_RGB2BGR)
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]
OUT.mkdir(parents=True, exist_ok=True)
img = build()
p = OUT / "mdpnsqn_qrcard.png"
img.save(p, optimize=True)
res = {"url": URL, "size": img.size}
for px in (300, 360, 420, 480, 560):
    res[str(px)] = decode(img.resize((px, px), Image.Resampling.LANCZOS)) == URL
print(json.dumps(res))
