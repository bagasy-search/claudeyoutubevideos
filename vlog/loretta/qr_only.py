# Regenera SÓLO el QR (qr.png, verificado con cv2) sin re-renderizar páginas. SLUG=x python vlog/loretta/qr_only.py
import os, qrcode, cv2
S = os.environ["SLUG"]; O = f"D:/Proyectos/video2-wt/lnet46/public/img/{S}/"
URL = {"ck": "https://cookbook.lorettaschurch.com/?src=", "fo": "https://lorettaschurch.com/one?src=", "cl": "https://lorettaschurch.com/clean?src=", "fh": "https://lorettaschurch.com/farm?src=", "su": "https://lorettaschurch.com/sunday?src="}[S[:2]] + S
q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=2); q.add_data(URL); q.make(fit=True)
q.make_image(fill_color="black", back_color="white").convert("RGB").save(O + "qr.png")
got, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(O + "qr.png"))
assert got == URL, (got, URL); print(S, "QR OK", URL)
try: os.remove(O + "qr.jpg")
except FileNotFoundError: pass
