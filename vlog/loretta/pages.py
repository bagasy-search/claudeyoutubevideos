# Páginas REALES del libro del canal → public/img/<slug>/pg<N>[_top|_mid|_bot].jpg (1920x1080, sello "PAGE N · TÍTULO"),
# tapa (cover.jpg) y QR al link del canal con ?src=<slug> (qr.png, verificado con cv2). SLUG=x python vlog/loretta/pages.py
# Los PDF se leen de D:/claude-brain (repo de video PÚBLICO: nunca se copian al repo; sólo las páginas renderizadas van al tar del farm).
import os, json, io
import pymupdf, qrcode, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/lnet46/"; CH = S[:2]
LIB = "D:/claude-brain/canales/loretta-red/libros/"
PDF = {"ck": "Lorettas-Church-Supper-Cookbook.pdf", "fo": "Supper-for-One.pdf", "cl": "The-Best-Way-to-Clean-It.pdf", "fh": "The-Bug-Free-Farmhouse.pdf", "su": "52-Sunday-Mornings-with-Loretta.pdf"}[CH]
TITLE = {"ck": "CHURCH SUPPER COOKBOOK", "fo": "SUPPER FOR ONE", "cl": "THE BEST WAY TO CLEAN IT", "fh": "THE BUG-FREE FARMHOUSE", "su": "52 SUNDAY MORNINGS"}[CH]
URL = {"ck": "https://cookbook.lorettaschurch.com/?src=", "fo": "https://lorettaschurch.com/one?src=", "cl": "https://lorettaschurch.com/clean?src=", "fh": "https://lorettaschurch.com/farm?src=", "su": "https://lorettaschurch.com/sunday?src="}[CH] + S
O = R + f"public/img/{S}/"; os.makedirs(O, exist_ok=True)
need = json.load(open(R + f"_v3/{S}_need.json", encoding="utf8"))
doc = pymupdf.open(LIB + PDF)
FB = "C:/Windows/Fonts/georgiab.ttf"
def page_img(n, w=1600):
    pg = doc[n - 1]; z = w / pg.rect.width
    pix = pg.get_pixmap(matrix=pymupdf.Matrix(z, z))
    return Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
def bg_from(im):
    b = im.resize((1920, int(1920 * im.height / im.width))).crop((0, 0, 1920, 1080)).filter(ImageFilter.GaussianBlur(28))
    return Image.blend(b, Image.new("RGB", b.size, (70, 52, 38)), 0.55)
def shadow_paste(canvas, im, xy):
    sh = Image.new("RGBA", (im.width + 60, im.height + 60), (0, 0, 0, 0)); d = ImageDraw.Draw(sh)
    d.rectangle((30, 30, im.width + 30, im.height + 30), fill=(0, 0, 0, 150)); sh = sh.filter(ImageFilter.GaussianBlur(18))
    canvas.paste(sh, (xy[0] - 22, xy[1] - 14), sh); canvas.paste(im, xy)
def stamp(c, n):
    d = ImageDraw.Draw(c); f = ImageFont.truetype(FB, 40); t = f"PAGE {n}  ·  {TITLE}"
    w = d.textlength(t, font=f); x, y = 60, 1080 - 96
    d.rounded_rectangle((x, y, x + w + 56, y + 66), 12, fill=(200, 50, 58)); d.text((x + 28, y + 12), t, font=f, fill=(255, 253, 247))
def content(im):
    im = im.crop((0, 0, im.width, int(im.height * 0.93))); a = np.asarray(im).astype(int); bg = np.median(a.reshape(-1, 3), axis=0)
    m = np.abs(a - bg).sum(2) > 40; ys = np.where(m.any(1))[0]; xs = np.where(m.any(0))[0]
    if not len(ys): return im
    pad = 24; return im.crop((max(0, xs[0] - pad), max(0, ys[0] - pad), min(im.width, xs[-1] + pad), min(im.height, ys[-1] + pad)))
def fit(im, W, H):
    k = min(W / im.width, H / im.height); return im.resize((int(im.width * k), int(im.height * k)), Image.LANCZOS)
for nm in need["pages"]:
    out = O + nm + ".jpg"
    if os.path.exists(out): continue
    n = int(nm[2:].split("_")[0]); reg = nm.split("_")[1] if "_" in nm else None
    im = page_img(n, 1800); c = bg_from(im); ct = content(im)
    if reg:
        k = {"top": 0, "mid": 1, "bot": 2}[reg]; H = ct.height; a = int(H * 0.31 * k); b = min(H, a + int(H * 0.40))
        ct = ct.crop((0, a, ct.width, b))
    p = fit(ct, 1760, 880); shadow_paste(c, p, ((1920 - p.width) // 2, 36 + (880 - p.height) // 2))
    stamp(c, n); c.save(out, quality=90)
# tapa (página 1) y QR
cv_ = page_img(1, 900); cv_.save(O + "cover.jpg", quality=92)
q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=20, border=2); q.add_data(URL); q.make(fit=True)
q.make_image(fill_color="black", back_color="white").convert("RGB").save(O + "qr.png")
got, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(O + "qr.png"))
print(S, "páginas", len(need["pages"]), "· QR", "OK" if got == URL else f"⛔ leyó {got!r}", URL)
if got != URL: raise SystemExit(1)
