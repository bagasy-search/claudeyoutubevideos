#!/usr/bin/env python3
"""
Prepara un PNG generado (IA, ilustrador, lo que sea) para que entre en el atlas
del juego.

Resuelve las tres cosas que rompen un sprite importado a mano:

1. **Centrado.** El render usa anchor 0.5, asi que el centro del personaje tiene
   que caer en el centro de la imagen. Con una cola, un arma o una capa que
   sobresalen, el centro del recuadro NO es el centro del personaje: el sprite
   queda corrido y se bambolea al animarse. La herramienta ancla en el centro
   horizontal de los PIES (la franja inferior del contenido), que ignora solo lo
   que sobresale a media altura.

2. **Escala.** Cada enemigo tiene un radio de colision y el dibujo tiene que
   medir lo mismo que el procedural, o va a chocar con la barra de vida y la
   sombra.

3. **Lienzo constante.** Todos los frames de una criatura tienen que salir del
   mismo recuadro. Si cada frame se recorta distinto, el sprite tiembla.

Uso:

    python3 tools/prep_sprite.py entrada.png --radius 40 --out public/art/coloso/walk_00.png
    python3 tools/prep_sprite.py frames/*.png --radius 40 --out-dir public/art/coloso

Radios actuales (de src/sim/balance/enemies.ts):
    grunt 20 · runner 17 · swarm 15 · brute 30 · juggernaut 40
"""

import argparse
import json
import os
import sys

try:
    from PIL import Image, ImageFilter
except ImportError:
    sys.exit("Falta Pillow.  pip install Pillow")


# El dibujo procedural va de -1.22r (alto de la cabeza) a +1.02r (pies).
CONTENT_HEIGHT = 2.24
# bake() usa un recuadro de radius * 2.1 de medio lado.
CANVAS_HALF = 2.1
# Distancia del centro del lienzo a la linea de los pies.
FEET_OFFSET = 1.02


def white_to_alpha(img: Image.Image, tolerance: int) -> Image.Image:
    """Vuelve transparente el fondo blanco. Solo sirve con fondos planos."""
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size
    limit = 255 - tolerance
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a > 0 and r >= limit and g >= limit and b >= limit:
                px[x, y] = (r, g, b, 0)
    return img


def add_outline(img: Image.Image, width: int, color: tuple[int, int, int]) -> Image.Image:
    """
    Contorno por dilatacion del alfa.

    Se hace en 2D y no en el render 3D a proposito: el contorno del estilo chibi
    es una propiedad de PANTALLA — tantos pixeles, siempre los mismos, sin
    importar si el personaje es grande o chico. Un casco invertido en 3D da un
    grosor en unidades de mundo, que cambia con la escala del modelo y se rompe
    en mallas poco densas. Ademas asi sirve igual para arte 2D que nunca paso
    por un render.
    """
    if width <= 0:
        return img
    alpha = img.getchannel("A")
    # MaxFilter dilata: cada pixel toma el maximo de su vecindario.
    grown = alpha.filter(ImageFilter.MaxFilter(width * 2 + 1))
    ink = Image.new("RGBA", img.size, color + (255,))
    ink.putalpha(grown)
    ink.alpha_composite(img)
    return ink


def _median(values: list[float]) -> float:
    s = sorted(values)
    n = len(s)
    return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2


def feet_center_x(img: Image.Image, band: float) -> float:
    """
    Centro horizontal de la franja inferior del contenido.

    Anclar por el centro del recuadro haria que una cola larga corriera al
    personaje. Los pies estan abajo y centrados bajo el cuerpo, asi que son una
    referencia mucho mas estable.

    Se usa la MEDIANA de los pixeles opacos de cada fila, no el punto medio
    entre los extremos: si la cola baja lo suficiente como para meterse en la
    franja, el punto medio se corre hacia ella. La mediana pesa por cantidad de
    pixeles, y las piernas siempre tienen mas masa que la punta de una cola.
    """
    alpha = img.getchannel("A")
    w, h = img.size
    start = int(h * (1 - band))
    centers = []
    for y in range(start, h):
        row = [x for x in range(w) if alpha.getpixel((x, y)) > 16]
        if row:
            centers.append(_median(row))
    if not centers:
        return w / 2
    return _median(centers)


def prep(
    path: str,
    radius: int,
    pixel_ratio: int,
    tolerance: int,
    band: float,
    outline: int,
    ink: tuple[int, int, int],
) -> Image.Image:
    img = Image.open(path).convert("RGBA")

    if tolerance >= 0:
        img = white_to_alpha(img, tolerance)

    bbox = img.getbbox()
    if bbox is None:
        raise SystemExit(f"{path}: la imagen quedo vacia (revisa --tolerance)")

    anchor_x = feet_center_x(img.crop(bbox), band)
    content = img.crop(bbox)

    # Escalar para que el alto del contenido coincida con el del procedural.
    target_h = CONTENT_HEIGHT * radius * pixel_ratio
    scale = target_h / content.height
    new_size = (max(1, round(content.width * scale)), max(1, round(content.height * scale)))
    content = content.resize(new_size, Image.LANCZOS)
    anchor_x *= scale

    canvas_side = round(CANVAS_HALF * 2 * radius * pixel_ratio)
    canvas = Image.new("RGBA", (canvas_side, canvas_side), (0, 0, 0, 0))

    # Los pies caen a FEET_OFFSET del centro; el ancla horizontal, en el centro.
    cx = canvas_side / 2
    cy = canvas_side / 2
    left = round(cx - anchor_x)
    top = round(cy + FEET_OFFSET * radius * pixel_ratio - content.height)
    canvas.alpha_composite(content, (left, top))

    # El contorno va al final, sobre el lienzo ya escalado: asi su grosor esta
    # en pixeles de juego y sale igual en todos los personajes.
    return add_outline(canvas, outline * pixel_ratio, ink)


def main() -> None:
    ap = argparse.ArgumentParser(description="Prepara PNGs para el atlas del juego.")
    ap.add_argument("inputs", nargs="+", help="PNGs de entrada (un frame cada uno)")
    ap.add_argument("--radius", type=int, required=True, help="radio de colision del enemigo")
    ap.add_argument("--out", help="ruta de salida (solo con un input)")
    ap.add_argument("--out-dir", help="carpeta de salida para varios inputs")
    ap.add_argument("--pixel-ratio", type=int, default=2, help="densidad de export (default 2)")
    ap.add_argument(
        "--tolerance",
        type=int,
        default=12,
        help="cuanto se aparta del blanco puro y sigue siendo fondo. -1 para no tocar el alfa.",
    )
    ap.add_argument("--band", type=float, default=0.12, help="franja inferior usada como pies")
    ap.add_argument("--outline", type=int, default=2, help="grosor del contorno en pixeles de juego (0 lo desactiva)")
    ap.add_argument("--ink", default="2b1a12", help="color del contorno en hex")
    args = ap.parse_args()

    if args.out and len(args.inputs) > 1:
        sys.exit("--out sirve para un solo archivo; usa --out-dir")
    if not args.out and not args.out_dir:
        sys.exit("hace falta --out o --out-dir")

    outputs = []
    for i, path in enumerate(sorted(args.inputs)):
        ink = tuple(int(args.ink[i : i + 2], 16) for i in (0, 2, 4))
        img = prep(path, args.radius, args.pixel_ratio, args.tolerance, args.band, args.outline, ink)
        if args.out:
            dest = args.out
        else:
            dest = os.path.join(args.out_dir, f"walk_{i:02d}.png")
        os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
        img.save(dest)
        outputs.append(dest)
        print(f"{path} -> {dest}  ({img.width}x{img.height})")

    # Entrada de manifiesto lista para copiar.
    rel = [os.path.relpath(o, "public/art") if "public/art" in o else o for o in outputs]
    entry = [{"path": r, "pixelRatio": args.pixel_ratio} for r in rel]
    print("\nEntrada para public/art/manifest.json:")
    print(json.dumps({"enemies": {"<id>": entry}}, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
