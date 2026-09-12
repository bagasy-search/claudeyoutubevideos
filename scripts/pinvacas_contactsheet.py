"""Hoja de contactos de TODAS las imagenes de pinvacas, con su luma REAL al lado.

Por que existe (skill video-pipeline, 2.ter.2): el medidor de luma sobre un frame REESCALADO
miente — dio 27-28 en clips que al MIRARLOS eran pantalla negra. Y ningun medidor numerico ve
un plano off-topic (en otro video, 18 de 35 clips eran de otra cosa y todos los numeros daban
verde). La unica verificacion que caza las dos es mirar los cuadros.

  python scripts/pinvacas_contactsheet.py [--out _v3/pinvacas/hoja]
"""
import json, pathlib, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
SLUG = "pinvacas"
IMGDIR = ROOT / "public" / "img" / SLUG
PLAN = json.loads((ROOT / "_v3" / f"{SLUG}_plan.json").read_text(encoding="utf-8"))

TW, TH = 320, 180          # miniatura
LAB = 22                   # franja de etiqueta
COLS, ROWS = 8, 8
PER = COLS * ROWS

def font(sz):
    for n in ("arialbd.ttf", "DejaVuSans-Bold.ttf", "arial.ttf"):
        try:
            return ImageFont.truetype(n, sz)
        except OSError:
            continue
    return ImageFont.load_default()

F = font(13)

def luma(im):
    g = im.convert("L")
    return sum(g.getdata()) / (g.width * g.height)

def cargar(name):
    for ext in (".jpg", ".png"):
        p = IMGDIR / (name + ext)
        if p.exists():
            try:
                return Image.open(p).convert("RGB")
            except Exception:
                return None
    return None

out_dir = ROOT / "_v3" / SLUG
out_dir.mkdir(parents=True, exist_ok=True)
faltan, oscuras, raras = [], [], []
hojas = []

for h in range((len(PLAN) + PER - 1) // PER):
    lote = PLAN[h * PER:(h + 1) * PER]
    W, H = COLS * (TW + 4), ROWS * (TH + LAB + 4)
    sheet = Image.new("RGB", (W, H), "#101010")
    d = ImageDraw.Draw(sheet)
    for k, p in enumerate(lote):
        cx, cy = (k % COLS) * (TW + 4), (k // COLS) * (TH + LAB + 4)
        im = cargar(p["name"])
        if im is None:
            faltan.append(p["name"])
            d.rectangle((cx, cy, cx + TW, cy + TH), fill="#3a1010")
            d.text((cx + 8, cy + TH // 2), "FALTA", font=F, fill="#ff8080")
            lum = -1
        else:
            ar = im.width / im.height
            if abs(ar - 16 / 9) > 0.06:
                raras.append((p["name"], round(ar, 3)))
            lum = luma(im)
            if lum < 40:
                oscuras.append((p["name"], round(lum, 1)))
            sheet.paste(im.resize((TW, TH), Image.Resampling.LANCZOS), (cx, cy))
        et = f'{p["name"]}  {p["encuadre"][:1].upper()}  {p["motor"][:1]}'
        if lum >= 0:
            et += f"  L{int(lum)}"
        col = "#ff6b6b" if (lum >= 0 and lum < 40) else "#dddddd"
        d.rectangle((cx, cy + TH, cx + TW, cy + TH + LAB), fill="#181818")
        d.text((cx + 5, cy + TH + 4), et, font=F, fill=col)
        d.text((cx + 122, cy + TH + 4), (p.get("muestra") or "")[:34], font=F, fill="#8a8a8a")
    fp = out_dir / f"hoja_{h + 1:02d}.jpg"
    sheet.save(fp, quality=86)
    hojas.append(fp.name)

print(json.dumps({
    "planos": len(PLAN),
    "hojas": hojas,
    "faltan": faltan[:40], "n_faltan": len(faltan),
    "oscuras_L<40": oscuras[:20], "n_oscuras": len(oscuras),
    "aspecto_no_16_9": raras[:20], "n_raras": len(raras),
}, ensure_ascii=False, indent=1))
