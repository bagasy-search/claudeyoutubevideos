# Páginas REALES del libro (pymupdf → PNG 1920 de ancho) + QR por video (verificado con cv2). Todo a public/ (ignorado por git).
#   python vlog/hh/pages_qr.py
import json, os, fitz, qrcode, cv2
R = "D:/Proyectos/video2-wt/lhh/"; PDF = "D:/claude-brain/canales/loretta-house-hacks/refs/Lorettas-Church-Lady-House-Book.pdf"
SL = ["hhdollar", "hhwinter", "hhexpire", "hhfreeze", "hhgrocery", "hhscraps", "hhvinegar", "hhperox", "hhtoilet", "hhnever"]
os.makedirs(R + "public/img/hhpages", exist_ok=True)
pages = set()
for s in SL:
    for m in json.load(open(R + f"_v3/{s}_plan.json", encoding="utf8"))["marks"]:
        if m["k"] == "pg": pages.add(m["page"])
doc = fitz.open(PDF)
for p in sorted(pages):
    out = R + f"public/img/hhpages/p{p:03d}.jpg"
    if os.path.exists(out): continue
    pg = doc[p - 1]; zoom = 1920 / pg.rect.width
    pix = pg.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    pix.save(out.replace(".jpg", ".png"));
    from PIL import Image
    Image.open(out.replace(".jpg", ".png")).convert("RGB").save(out, quality=92); os.remove(out.replace(".jpg", ".png"))
print("páginas:", len(pages), sorted(pages))
det = cv2.QRCodeDetector()
for s in SL:
    url = f"https://lorettaschurch.com/house?src={s}"
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=24, border=2)
    q.add_data(url); q.make(fit=True)
    f = R + f"public/img/hhpages/qr_{s}.png"
    q.make_image(fill_color="#3B2A1E", back_color="#FFFDF7").save(f)
    val, pts, _ = det.detectAndDecode(cv2.imread(f))
    assert val == url, (s, val)
    print("QR OK", s, val)
