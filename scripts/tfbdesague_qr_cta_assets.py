# -*- coding: utf-8 -*-
"""Assets del CTA de `tfbdesague` (canal The Free Builder / El Constructor Libre).

Reglas del canal que esto respeta y que NO se tocan:
  - El QR apunta a la landing REAL y se VERIFICA decodificandolo despues de simular
    el `objectFit: cover` + el Ken-Burns (scale 1.06..1.14) de `FloatingInsert`.
  - CERO precio en pantalla (el canal manda el precio a la descripcion, nunca al video).
  - CERO resenas inventadas: los testimonios salen TEXTUALES de la landing publicada.
  - Paleta terrosa del canal (crema + marron oscuro + ambar), coherente con la portada.

Salidas (public/img/):
  tfbdesague_qr.png        760x428  tarjeta del QR para FloatingInsert
  tfbdesague_portada.png  1792x1008 portada de la coleccion sobre fondo crema (sin precio)
  tfbdesague_prueba.png   1792x1008 tarjeta de prueba social con 3 testimonios REALES
"""
from __future__ import annotations

import io
import json
import re
import sys
from pathlib import Path

import cv2
import numpy as np
import qrcode
from PIL import Image, ImageDraw, ImageFont
from qrcode.constants import ERROR_CORRECT_H

URL = "https://manual-reparaciones-caseras.vercel.app/"
DOMINIO = "manual-reparaciones-caseras.vercel.app"
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img"
SRC = Path(r"D:\rtmp\tmp\claude\tfb")

PAPER = (246, 239, 221)      # #F6EFDD crema del canal
INK = (44, 33, 24)           # marron muy oscuro
AMBER = (176, 122, 38)
MUTED = (122, 106, 88)
WINE = (110, 26, 26)

F = Path(r"C:\Windows\Fonts")
DISPLAY = F / "georgiab.ttf"
BODY = F / "georgia.ttf"
SANS = F / "ARIALNB.TTF"
SANS_R = F / "arial.ttf"


def font(p: Path, s: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(p), size=s)


def wrap(d: ImageDraw.ImageDraw, text: str, fnt, max_w: int) -> list[str]:
    out, line = [], ""
    for w in text.split():
        t = (line + " " + w).strip()
        if d.textbbox((0, 0), t, font=fnt)[2] <= max_w:
            line = t
        else:
            if line:
                out.append(line)
            line = w
    if line:
        out.append(line)
    return out


def cover(im: Image.Image, sw: int, sh: int) -> Image.Image:
    """Replica objectFit:cover del kit."""
    s = max(sw / im.width, sh / im.height)
    r = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    x, y = (r.width - sw) // 2, (r.height - sh) // 2
    return r.crop((x, y, x + sw, y + sh))


def decode(im: Image.Image) -> str:
    """pyzbar primero (fiable), cv2 de respaldo."""
    arr = np.array(im.convert("RGB"))[:, :, ::-1]
    try:
        from pyzbar.pyzbar import decode as zdec

        r = zdec(im.convert("RGB"))
        if r:
            return r[0].data.decode("utf-8", "replace")
    except Exception:
        pass
    txt, _, _ = cv2.QRCodeDetector().detectAndDecode(arr)
    return txt or ""


# ───────────────────────── 1. tarjeta del QR (760x428) ─────────────────────────
def qr_card() -> Path:
    W, H = 760, 428
    card = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(card)

    q = qrcode.QRCode(version=None, error_correction=ERROR_CORRECT_H, box_size=10, border=2)
    q.add_data(URL)
    q.make(fit=True)

    # AREA SEGURA: FloatingInsert hace cover + Ken-Burns hasta 1.14 -> recorta ~6,1 %
    # por lado. Nada legible puede salir de este rectangulo.
    mx = round(W * (1 - 1 / 1.14) / 2) + 6
    my = round(H * (1 - 1 / 1.14) / 2) + 6
    sx0, sy0, sx1, sy1 = mx, my, W - mx, H - my

    # el QR se dibuja al tamano final con un box_size ENTERO: reescalar un QR ya
    # rasterizado corre los modulos medio pixel y lo puede volver indecodificable.
    objetivo = min(300, (sy1 - sy0) - 24)
    modulos = q.modules_count + 2 * q.border
    box = max(1, round(objetivo / modulos))
    q2 = qrcode.QRCode(version=q.version, error_correction=ERROR_CORRECT_H, box_size=box, border=q.border)
    q2.add_data(URL)
    q2.make(fit=True)
    qim = q2.make_image(fill_color=(20, 16, 12), back_color=PAPER).convert("RGB")
    side = qim.width

    qx, qy = sx0 + 18, (H - side) // 2
    card.paste(qim, (qx, qy))
    d.rectangle([qx - 9, qy - 9, qx + side + 9, qy + side + 9], outline=AMBER, width=3)

    tx = qx + side + 40
    tw = sx1 - tx
    d.text((tx, qy + 4), "ESCANEA CON", font=font(SANS, 24), fill=MUTED)
    d.text((tx, qy + 36), "TU CELULAR", font=font(SANS, 24), fill=MUTED)
    d.text((tx, qy + 86), "La hoja", font=font(DISPLAY, 48), fill=INK)
    d.text((tx, qy + 138), "completa", font=font(DISPLAY, 48), fill=WINE)
    d.line([tx, qy + 204, min(tx + 230, sx1), qy + 204], fill=AMBER, width=3)
    # el dominio no tiene espacios: se corta a mano por los guiones y se achica hasta entrar
    for j, ln in enumerate(["manual-reparaciones-", "caseras.vercel.app"]):
        f = font(SANS_R, 19)
        while d.textbbox((0, 0), ln, font=f)[2] > tw and f.size > 11:
            f = font(SANS_R, f.size - 1)
        d.text((tx, qy + 220 + j * 25), ln, font=f, fill=MUTED)

    p = OUT / "tfbdesague_qr.png"
    card.save(p)

    # verificacion: tal cual, y simulando cover + zoom del componente
    checks = {"1:1": decode(card)}
    for z in (1.06, 1.10, 1.14):
        zw, zh = round(W * z), round(H * z)
        zoomed = card.resize((zw, zh), Image.LANCZOS).crop(
            ((zw - W) // 2, (zh - H) // 2, (zw - W) // 2 + W, (zh - H) // 2 + H)
        )
        checks[f"zoom{z}"] = decode(zoomed)
        # y al tamano REAL en pantalla del slot (760x428 sobre 1920x1080 ya es 1:1)
        checks[f"zoom{z}@0.6"] = decode(zoomed.resize((456, 257), Image.LANCZOS))
    ok = all(v == URL for v in checks.values())
    print("[QR]", p.name, "->", json.dumps({k: (v == URL) for k, v in checks.items()}))
    if not ok:
        print("[QR] FALLA:", {k: v[:60] for k, v in checks.items() if v != URL})
        sys.exit(1)
    return p


# ───────────────────────── 2. portada (1792x1008) ─────────────────────────
def portada() -> Path:
    W, H = 1792, 1008
    base = Image.new("RGB", (W, H), (28, 22, 17))
    src = Image.open(SRC / "portada.jpg").convert("RGB")
    # la portada es 3:4 -> va CENTRADA, con el fondo crema alrededor (nunca estirada)
    ph = int(H * 0.88)
    pw = round(src.width * ph / src.height)
    src = src.resize((pw, ph), Image.LANCZOS)
    shadow = Image.new("RGB", (pw + 26, ph + 26), (12, 9, 7))
    base.paste(shadow, ((W - pw) // 2 - 13 + 8, (H - ph) // 2 - 13 + 10))
    base.paste(src, ((W - pw) // 2, (H - ph) // 2))
    d = ImageDraw.Draw(base)
    d.text((96, H // 2 - 150), "La hoja de hoy", font=font(DISPLAY, 62), fill=PAPER)
    d.text((96, H // 2 - 74), "sale de aquí adentro", font=font(BODY, 40), fill=(198, 180, 152))
    d.line([96, H // 2 - 6, 96 + 320, H // 2 - 6], fill=AMBER, width=4)
    d.text((96, H // 2 + 22), "3 guías + bonos", font=font(SANS, 30), fill=AMBER)
    d.text((96, H // 2 + 66), "Enlace en la descripción", font=font(SANS_R, 26), fill=(170, 155, 132))
    p = OUT / "tfbdesague_portada.png"
    base.save(p)
    print("[PORTADA]", p.name, base.size)
    return p


# ───────────────────────── 3. prueba social (1792x1008) ─────────────────────────
TESTIMONIOS = [
    ("Miguel Torres",
     "Tenía una pérdida debajo del fregadero y ya estaba por llamar a alguien. "
     "Revisé el manual, fui paso a paso y lo resolví yo."),
    ("Marta González",
     "Yo no sé prácticamente nada de reparaciones y ya pude hacer varias cosas sola. "
     "Lo que me gusta es que te dice cantidades y el orden exacto."),
    ("Ricardo Salazar",
     "Durante años pintábamos una pared y a los meses volvía a salir la humedad. "
     "Con la guía entendí de dónde venía."),
]


def estrella(d: ImageDraw.ImageDraw, cx: int, cy: int, r: int, col) -> None:
    """Arial no trae el glifo de estrella: se dibuja como poligono."""
    import math

    pts = []
    for k in range(10):
        rad = r if k % 2 == 0 else r * 0.44
        a = -math.pi / 2 + k * math.pi / 5
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    d.polygon(pts, fill=col)


def prueba() -> Path:
    W, H = 1792, 1008
    im = Image.new("RGB", (W, H), (30, 24, 18))
    d = ImageDraw.Draw(im)
    d.text((110, 92), "LO QUE DICEN QUIENES YA LA TIENEN", font=font(SANS, 34), fill=AMBER)
    y = 190
    for name, txt in TESTIMONIOS:
        card_h = 200
        d.rounded_rectangle([110, y, W - 110, y + card_h], radius=18, fill=(44, 35, 27))
        d.rounded_rectangle([110, y, 118, y + card_h], radius=4, fill=AMBER)
        for k in range(5):
            estrella(d, 168 + k * 34, y + 40, 11, AMBER)
        lines = wrap(d, txt, font(BODY, 32), W - 400)[:3]
        for j, ln in enumerate(lines):
            d.text((160, y + 66 + j * 42), ln, font=font(BODY, 32), fill=(232, 224, 208))
        d.text((W - 360, y + card_h - 48), name, font=font(SANS, 26), fill=(168, 152, 128))
        y += card_h + 34
    p = OUT / "tfbdesague_prueba.png"
    im.save(p)
    print("[PRUEBA]", p.name, im.size, "- 3 testimonios TEXTUALES de la landing")
    return p


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    qr_card()
    portada()
    prueba()
    print("OK - 3 assets de CTA generados")
