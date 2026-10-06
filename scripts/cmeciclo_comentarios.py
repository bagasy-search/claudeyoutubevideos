# -*- coding: utf-8 -*-
"""Tarjetas de los COMENTARIOS REALES del video de 78K, para el gancho de `cmeciclo`.

Por que existe: el gancho del video es leer el comentario mas votado. Ese texto tiene que ser
LEGIBLE. gpt-image garabatea cualquier texto largo, asi que estos tres planos se dibujan aca,
deterministas, con el texto verbatim del comentario. No es un overlay: es el plano.

Los comentarios son REALES, del propio video del canal (`YK03l04tDI0`). No se inventa ninguno,
y no se muestra el nombre de quien los escribio (no se expone a nadie).
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "img" / "cmeciclo"
W, H = 1920, 1080

INK = "#10120D"
PAPER = "#F4F2E8"
VOLT = "#A8DC2A"
MUTED = "#8E948A"

FONT_DIR = Path(r"C:\Windows\Fonts")
DISPLAY = FONT_DIR / "ARIALNB.TTF"
BODY = FONT_DIR / "arial.ttf"
BODY_BOLD = FONT_DIR / "arialbd.ttf"

# Comentarios REALES del video YK03l04tDI0 (verbatim, sin autor).
COMENTARIOS = [
    ("cmeciclo_com_top",
     "Las baterías de arranque no son recomendables para eso. "
     "Se les disminuye la vida útil exponencialmente. "
     "Lo adecuado es una batería de ciclo profundo.",
     "16", True),
    ("cmeciclo_com_hora",
     "Con el refrigerador esa batería no te dura ni una hora.",
     "9", False),
    ("cmeciclo_com_arruinar",
     "Vas a arruinar la batería del auto haciendo eso.",
     "7", False),
]


def font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(path), size=size)


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    lines: list[str] = []
    line = ""
    for word in text.split():
        trial = f"{line} {word}".strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            line = trial
        else:
            if line:
                lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


def pulgar(draw: ImageDraw.ImageDraw, x: int, y: int, s: float, fill: str) -> None:
    """Un pulgar arriba dibujado, para no depender de una fuente de iconos."""
    draw.rounded_rectangle((x, y + 14 * s, x + 13 * s, y + 34 * s), radius=3 * s, fill=fill)
    draw.rounded_rectangle((x + 17 * s, y + 10 * s, x + 44 * s, y + 34 * s), radius=5 * s, fill=fill)
    draw.polygon([(x + 17 * s, y + 14 * s), (x + 29 * s, y - 2 * s), (x + 34 * s, y + 2 * s),
                  (x + 30 * s, y + 14 * s)], fill=fill)


def tarjeta(texto: str, likes: str, destacado: bool) -> Image.Image:
    img = Image.new("RGB", (W, H), INK)
    draw = ImageDraw.Draw(img)
    draw.rectangle((0, 0, W, 12), fill=VOLT)
    draw.ellipse((1360, -420, 2260, 480), fill="#18200F")

    fnt = font(BODY, 58)
    lineas = wrap(draw, texto, fnt, 1420)
    # el bloque entero (rotulo + chip + texto + likes) se centra vertical: si no, la mitad de
    # abajo queda muerta y a pantalla completa se lee como una diapositiva a medio hacer.
    alto = 60 + (66 if destacado else 0) + len(lineas) * 82 + 90
    y0 = (H - alto) // 2

    draw.text((150, y0), "COMENTARIOS DEL VIDEO ANTERIOR", font=font(BODY_BOLD, 30), fill=MUTED)
    if destacado:
        draw.rounded_rectangle((148, y0 + 56, 690, y0 + 122), radius=14, fill=VOLT)
        draw.text((176, y0 + 71), "EL MAS VOTADO", font=font(DISPLAY, 40), fill=INK)

    top = y0 + (176 if destacado else 116)
    # el avatar del comentarista: un circulo neutro, sin identidad de nadie
    draw.ellipse((150, top + 6, 246, top + 102), fill="#2A3220")
    draw.ellipse((178, top + 30, 218, top + 70), fill="#3D4830")
    draw.pieslice((166, top + 66, 230, top + 130), 180, 360, fill="#3D4830")

    y = top
    for ln in lineas:
        draw.text((292, y), ln, font=fnt, fill=PAPER)
        y += 82

    y += 26
    pulgar(draw, 296, y + 6, 1.15, VOLT)
    draw.text((362, y), likes, font=font(BODY_BOLD, 46), fill=VOLT)
    draw.text((362 + 26 * len(likes) + 18, y + 8), "me gusta", font=font(BODY, 36), fill=MUTED)
    return img


def guardar(img: Image.Image, stem: str) -> dict:
    OUT.mkdir(parents=True, exist_ok=True)
    png = OUT / f"{stem}.png"
    blur = OUT / f"{stem}_blur.jpg"
    img.save(png, optimize=True)
    img.filter(ImageFilter.GaussianBlur(18)).save(blur, quality=83, optimize=True)
    return {"image": png.relative_to(ROOT / "public").as_posix(),
            "blur": blur.relative_to(ROOT / "public").as_posix(),
            "sha256": hashlib.sha256(png.read_bytes()).hexdigest()}


def main() -> None:
    assets = {}
    for stem, texto, likes, destacado in COMENTARIOS:
        assets[stem] = guardar(tarjeta(texto, likes, destacado), stem)
        assets[stem]["texto"] = texto
    (OUT / "cmeciclo_comentarios_manifest.json").write_text(
        json.dumps({"fuente_video": "YK03l04tDI0", "autores_visibles": False, "assets": assets},
                   ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"ok": True, "tarjetas": len(assets)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
