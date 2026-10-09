# Páginas reales del libro de cada canal citadas en los guiones (pg N) → public/pages/<bk>/p<N>.jpg (1920 de ancho)
# + tapa (p1) de cada libro, + QR de cada video → public/qr/<slug>.png verificado con cv2. python vlog/lnet/paginas_qr.py
import re, os, glob, json, sys
import fitz, qrcode, cv2
sys.stdout.reconfigure(encoding="utf-8")
R = "D:/Proyectos/video2-wt/lnet/"; LIB = "D:/claude-brain/canales/loretta-red/libros/"
PDF = {"ck": "Lorettas-Church-Supper-Cookbook.pdf", "fo": "Supper-for-One.pdf", "cl": "The-Best-Way-to-Clean-It.pdf", "fh": "The-Bug-Free-Farmhouse.pdf", "su": "52-Sunday-Mornings-with-Loretta.pdf"}
PRECIO = {"fo": {53, 54, 55}, "cl": {51, 52}, "fh": {50, 51}, "su": {58, 59}, "ck": set()}
URL = {"ck": "https://cookbook.lorettaschurch.com/?src={}", "fo": "https://lorettaschurch.com/one?src={}", "cl": "https://lorettaschurch.com/clean?src={}", "fh": "https://lorettaschurch.com/farm?src={}", "su": "https://lorettaschurch.com/sunday?src={}"}
need = {k: {1} for k in PDF}; bad = []
for f in glob.glob(R + "guiones/*_filmado.txt"):
    s = os.path.basename(f)[:-12]; bk = s[:2]
    if bk not in PDF: continue
    for m in re.finditer(r"\bpg (\d+)", open(f, encoding="utf8").read()):
        n = int(m.group(1)); need[bk].add(n)
        if n in PRECIO[bk]: bad.append((s, n))
if bad: print("⛔ páginas con precio citadas:", bad); sys.exit(1)
for bk, pages in need.items():
    d = fitz.open(LIB + PDF[bk]); os.makedirs(R + f"public/pages/{bk}", exist_ok=True)
    for n in sorted(pages):
        out = R + f"public/pages/{bk}/p{n}.jpg"
        if os.path.exists(out): continue
        p = d[n - 1]; z = 1920 / p.rect.width
        p.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False).save(out, jpg_quality=88)
    print(bk, "páginas:", sorted(pages), "· tamaño", d[0].rect)
os.makedirs(R + "public/qr", exist_ok=True); det = cv2.QRCodeDetector()
for f in glob.glob(R + "guiones/*_filmado.txt"):
    s = os.path.basename(f)[:-12]; bk = s[:2]
    if bk not in URL: continue
    url = URL[bk].format(s); out = R + f"public/qr/{s}.png"
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=2); q.add_data(url); q.make(fit=True)
    q.make_image(fill_color="#2B1D14", back_color="#FFFDF7").save(out)
    val, _, _ = det.detectAndDecode(cv2.imread(out))
    print(("✓" if val == url else "⛔"), s, val)
