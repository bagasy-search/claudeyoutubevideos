#!/usr/bin/env python3
"""
Saca frames PNG con alfa de un video de preview (por ejemplo el que muestra
Meshy al lado de la animacion).

Es un plan B. Si tenes el modelo, exporta el GLB y usa render_sprites.py: el
render sale con alfa real, a la resolucion que quieras y con la camara exacta.
El video ya viene aplastado por el codec, con el personaje chico dentro del
cuadro y con una sombra proyectada pegada al piso.

El recorte del fondo no se hace por color plano, que es lo obvio y lo que falla:

- La sombra NO es del color del fondo (es mas oscura), asi que un filtro por
  color la deja pegada al personaje como una mancha.
- Filtrar todo lo gris tampoco sirve: los OJOS son blancos y negros, o sea
  grises, y desaparecerian.

Lo que se hace es marcar los pixeles poco saturados —fondo y sombra, ambos
grises— y despues **rellenar desde los bordes**. Solo se borra lo gris que esta
conectado con el borde del cuadro. Los ojos quedan, porque estan rodeados de
personaje.

Uso:

    pip install imageio imageio-ffmpeg Pillow
    python3 tools/video_to_frames.py preview.mp4 --out frames/ --frames 12
"""

import argparse
import os
import sys

try:
    import imageio.v3 as iio
    from PIL import Image, ImageChops, ImageDraw, ImageFilter
except ImportError:
    sys.exit("Faltan dependencias.  pip install imageio imageio-ffmpeg Pillow")


def saturation(img: Image.Image) -> Image.Image:
    """max(r,g,b) - min(r,g,b) por pixel. Los grises dan cero."""
    r, g, b = img.convert("RGB").split()
    hi = ImageChops.lighter(ImageChops.lighter(r, g), b)
    lo = ImageChops.darker(ImageChops.darker(r, g), b)
    return ImageChops.subtract(hi, lo)


def cut_background(img: Image.Image, sat_threshold: int, feather: int) -> Image.Image:
    """
    Deja transparente el fondo (y su sombra) conservando los grises interiores.
    """
    rgb = img.convert("RGB")
    w, h = rgb.size

    # 255 = candidato a fondo (poco saturado);  0 = personaje.
    sat = saturation(rgb)
    candidate = sat.point(lambda v: 255 if v < sat_threshold else 0)

    # Relleno desde las cuatro esquinas: solo lo gris CONECTADO al borde se va.
    marker = 128
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if candidate.getpixel(seed) == 255:
            ImageDraw.floodfill(candidate, seed, marker, thresh=0)

    alpha = candidate.point(lambda v: 0 if v == marker else 255)

    if feather > 0:
        # Erosionar un pelo come el halo gris que deja la compresion del video.
        alpha = alpha.filter(ImageFilter.MinFilter(feather * 2 + 1))

    out = rgb.convert("RGBA")
    out.putalpha(alpha)
    return out


def main() -> None:
    ap = argparse.ArgumentParser(description="Extrae frames con alfa de un video de preview.")
    ap.add_argument("video")
    ap.add_argument("--out", required=True, help="carpeta de salida")
    ap.add_argument("--frames", type=int, default=12, help="cuantos frames tomar del loop")
    ap.add_argument("--saturation", type=int, default=28, help="por debajo de esto se considera gris")
    ap.add_argument("--feather", type=int, default=1, help="pixeles a erosionar del borde")
    args = ap.parse_args()

    os.makedirs(args.out, exist_ok=True)
    frames = [Image.fromarray(f) for f in iio.imiter(args.video)]
    if not frames:
        sys.exit("el video no tiene frames")

    total = len(frames)
    print(f"video: {total} frames de {frames[0].width}x{frames[0].height}")

    for i in range(args.frames):
        # Muestreo parejo sobre el loop; el ultimo no se repite con el primero.
        src = frames[round(total * i / args.frames) % total]
        cut = cut_background(src, args.saturation, args.feather)
        dest = os.path.join(args.out, f"walk_{i:02d}.png")
        cut.save(dest)
        opaque = sum(1 for p in cut.getchannel("A").getdata() if p > 128)
        print(f"  {dest}  ({100 * opaque / (cut.width * cut.height):.1f}% opaco)")

    print("\nSiguiente paso:")
    print(f"  python3 tools/prep_sprite.py {args.out}/*.png --radius 20 --out-dir public/art/bicho --tolerance -1")


if __name__ == "__main__":
    main()
