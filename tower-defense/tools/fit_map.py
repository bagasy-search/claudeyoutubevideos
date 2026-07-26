#!/usr/bin/env python3
"""
Ajusta la simulacion a un tablero PINTADO.

El problema: el camino de la sim es una lista de waypoints en el codigo, y las
plataformas son otra lista. Si el mapa lo dibuja una IA (o una persona), esas
dos listas dejan de coincidir con lo que se ve: los bichos caminan por el pasto
al lado de la ruta y las torres aparecen flotando junto a las losas.

Se puede arreglar a ojo, moviendo numeros y mirando capturas. Es lento y nunca
queda exacto. Esto lo MIDE:

  1. Separa "piedra clara" (camino + losas) del pasto por color.
  2. La componente conexa mas grande es el camino; el resto, si son redondas y
     del tamaño esperado, son las plataformas.
  3. Recorre el eje del camino con Dijkstra sobre el mapa de distancias al
     borde, de la entrada a la salida. Buscar el maximo de distancia al borde
     es lo que lo mantiene CENTRADO: un camino minimo pelado se pega a la curva
     interior de cada codo, que es justo por donde no camina nadie.
  4. Reduce el trazado a una docena de puntos de control y escupe TypeScript.

Uso:
    python3 tools/fit_map.py mapa.png [--field 540x960] [--slot-area 900:9000]

Imprime el DEFAULT_PATH y el BUILD_SLOTS listos para pegar en src/sim/game.ts,
y guarda mapa.fit.png con el resultado dibujado encima para verificar de un
vistazo.
"""
from __future__ import annotations

import argparse
import heapq
import math
import sys

import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage


def parse_args() -> argparse.Namespace:
    ap = argparse.ArgumentParser()
    ap.add_argument("image")
    ap.add_argument("--field", default="540x960", help="tamaño logico del campo")
    ap.add_argument("--control-points", type=int, default=12)
    ap.add_argument(
        "--slot-area",
        default="0.003:0.012",
        # Medido sobre un tablero de 1080x1920 con losas de 60 px de radio: cada
        # una ocupa el 0.5% del cuadro. Las rocas y los tocones sueltos, que son
        # igual de claros y tambien redondos, quedan por debajo del 0.15% — el
        # area es el unico discriminante que los separa de forma limpia.
        help="area de una plataforma como fraccion de la imagen, min:max",
    )
    ap.add_argument("--out", default=None, help="png de verificacion")
    return ap.parse_args()


def stone_mask(rgb: np.ndarray) -> np.ndarray:
    """
    Piedra clara contra pasto.

    El discriminante NO es el brillo: hay pasto iluminado mas claro que piedra
    en sombra. Es que el pasto tiene el verde por encima del rojo y la piedra
    no. `g - r` separa los dos limpiamente en cualquier iluminacion, que es
    justamente lo que un umbral de luminancia no consigue.
    """
    r = rgb[:, :, 0].astype(np.int16)
    g = rgb[:, :, 1].astype(np.int16)
    b = rgb[:, :, 2].astype(np.int16)
    warm = (r - g) > -12
    bright = (r.astype(np.int32) + g + b) > 330
    return warm & bright


def largest_component(mask: np.ndarray) -> tuple[np.ndarray, np.ndarray, int]:
    labels, n = ndimage.label(mask)
    if n == 0:
        raise SystemExit("no se encontro ninguna zona de piedra clara")
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    biggest = int(np.argmax(sizes)) + 1
    return labels == biggest, labels, biggest


def trace_centerline(road: np.ndarray, start: tuple[int, int], goal: tuple[int, int]) -> list[tuple[int, int]]:
    """
    Camino de coste minimo donde el coste castiga acercarse al borde.

    Dijkstra sobre la grilla de pixeles con peso `1 / (dist_al_borde ** 2)`.
    Elevar al cuadrado importa: con peso lineal el atajo por la curva interior
    de un codo cerrado todavia gana, porque ahorra mas longitud de la que paga
    en penalizacion.
    """
    dist = ndimage.distance_transform_edt(road)
    h, w = road.shape
    weight = np.where(road, 1.0 / np.maximum(dist, 0.5) ** 2, np.inf)

    best = np.full((h, w), np.inf)
    prev = np.full((h, w, 2), -1, dtype=np.int32)
    sy, sx = start
    best[sy, sx] = 0.0
    heap = [(0.0, sy, sx)]
    gy, gx = goal

    neighbours = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]
    while heap:
        cost, y, x = heapq.heappop(heap)
        if cost > best[y, x]:
            continue
        if (y, x) == (gy, gx):
            break
        for dy, dx in neighbours:
            ny, nx = y + dy, x + dx
            if not (0 <= ny < h and 0 <= nx < w) or not road[ny, nx]:
                continue
            step = math.hypot(dy, dx) * weight[ny, nx]
            nc = cost + step
            if nc < best[ny, nx]:
                best[ny, nx] = nc
                prev[ny, nx] = (y, x)
                heapq.heappush(heap, (nc, ny, nx))

    if not np.isfinite(best[gy, gx]):
        raise SystemExit("la entrada y la salida no estan conectadas por el camino")

    path = []
    y, x = gy, gx
    while y >= 0:
        path.append((y, x))
        y, x = prev[y, x]
    path.reverse()
    return path


def resample(points: list[tuple[float, float]], n: int) -> list[tuple[float, float]]:
    """Reparte n puntos a intervalos iguales de LONGITUD, no de indice."""
    cum = [0.0]
    for i in range(1, len(points)):
        cum.append(cum[-1] + math.dist(points[i - 1], points[i]))
    total = cum[-1]
    out = []
    for k in range(n):
        target = total * k / (n - 1)
        i = np.searchsorted(cum, target)
        i = min(max(i, 1), len(points) - 1)
        span = cum[i] - cum[i - 1]
        t = 0.0 if span == 0 else (target - cum[i - 1]) / span
        ax, ay = points[i - 1]
        bx, by = points[i]
        out.append((ax + (bx - ax) * t, ay + (by - ay) * t))
    return out


def main() -> None:
    args = parse_args()
    fw, fh = (int(v) for v in args.field.lower().split("x"))
    amin, amax = (float(v) for v in args.slot_area.split(":"))

    img = Image.open(args.image).convert("RGB")
    iw, ih = img.size
    if abs(iw / ih - fw / fh) > 0.03:
        print(
            f"aviso: la imagen es {iw}x{ih} ({iw/ih:.3f}) y el campo {fw}x{fh} "
            f"({fw/fh:.3f}). Se va a estirar; recortala antes si te importa.",
            file=sys.stderr,
        )
    rgb = np.asarray(img)

    stone = stone_mask(rgb)
    # Cerrar primero: el camino de tierra tiene manchas de pasto adentro y sin
    # esto la componente conexa se parte en pedazos.
    stone = ndimage.binary_closing(stone, np.ones((5, 5)))
    # Y abrir despues. Las losas que quedan al borde de la calzada estan a pocos
    # pixeles de ella, y con el desenfoque del pintado el puente se cierra: sin
    # esta apertura se funden con el camino y desaparecen de la deteccion. El
    # elemento va escalado al ancho de la imagen — tiene que romper puentes de
    # unos pocos pixeles sin comerse el borde de una losa, que mide diez veces
    # mas.
    bridge = max(3, iw // 80)
    stone = ndimage.binary_opening(stone, np.ones((bridge, bridge)))
    road, labels, road_label = largest_component(stone)

    # --------------------------------------------------------- plataformas
    area_px = iw * ih
    slots: list[tuple[float, float]] = []
    for lbl in range(1, labels.max() + 1):
        if lbl == road_label:
            continue
        blob = labels == lbl
        area = int(blob.sum())
        if not (area_px * amin <= area <= area_px * amax):
            continue
        ys, xs = np.nonzero(blob)
        h_ = ys.max() - ys.min() + 1
        w_ = xs.max() - xs.min() + 1
        # Redondez: una losa llena mas del 60% de su caja y no es un fideo.
        if area / (h_ * w_) < 0.6 or not (0.45 < w_ / h_ < 2.6):
            continue
        slots.append((xs.mean(), ys.mean()))
        print(f"  losa area={area/area_px:.4f} caja={w_}x{h_}", file=sys.stderr)
    # De arriba hacia abajo, que es el orden en el que el jugador las va a ver.
    slots.sort(key=lambda p: p[1])

    # -------------------------------------------------------------- camino
    # Entrada y salida: los pixeles de camino mas altos y mas bajos, tomando la
    # mediana en x de esa fila para caer en el medio de la calzada.
    ys, xs = np.nonzero(road)
    top_y = int(ys.min())
    bot_y = int(ys.max())
    start = (top_y + 2, int(np.median(xs[ys <= top_y + 2])))
    goal = (bot_y - 2, int(np.median(xs[ys >= bot_y - 2])))

    trace = trace_centerline(road, start, goal)
    xy = [(float(x), float(y)) for y, x in trace]
    ctrl = resample(xy, args.control_points)

    # ------------------------------------------------------------- salida
    sx, sy = fw / iw, fh / ih
    print("const DEFAULT_PATH: PathPoint[] = [")
    for i, (x, y) in enumerate(ctrl):
        fx, fy = x * sx, y * sy
        # El primero y el ultimo se empujan fuera del campo para que la calzada
        # sangre por el borde en vez de cortarse en seco.
        if i == 0:
            fy -= 45
        print(f"  {{ x: {round(fx)}, y: {round(fy)} }},")
    print("]")
    print()
    print(f"export const BUILD_SLOTS: readonly PathPoint[] = [  // {len(slots)} detectadas")
    for x, y in slots:
        print(f"  {{ x: {round(x * sx)}, y: {round(y * sy)} }},")
    print("]")

    out = args.out or args.image.rsplit(".", 1)[0] + ".fit.png"
    check = img.copy()
    d = ImageDraw.Draw(check)
    d.line([(x, y) for x, y in xy], fill=(255, 40, 200), width=max(2, iw // 200))
    for x, y in ctrl:
        r = iw // 90
        d.ellipse([x - r, y - r, x + r, y + r], fill=(255, 255, 0), outline=(0, 0, 0), width=2)
    for x, y in slots:
        r = iw // 45
        d.ellipse([x - r, y - r, x + r, y + r], outline=(0, 120, 255), width=max(3, iw // 250))
    check.save(out)
    print(f"\nverificacion en {out}", file=sys.stderr)


if __name__ == "__main__":
    main()
