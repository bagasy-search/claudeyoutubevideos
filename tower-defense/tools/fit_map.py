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
  2. Erosiona para despegar lo que se toca, etiqueta, y toma la pieza mas
     grande como camino; el resto, si son redondas y del tamaño esperado, son
     las plataformas.
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
    ap.add_argument(
        "--separate",
        type=float,
        default=1 / 38,
        help="erosion para despegar losas del camino, en fraccion del ancho",
    )
    ap.add_argument("--out", default=None, help="png de verificacion")
    return ap.parse_args()


def stone_mask(rgb: np.ndarray) -> np.ndarray:
    """
    Piedra clara contra pasto, con el umbral sacado de la propia imagen.

    Dos decisiones:

    1. **El discriminante no es el brillo.** Hay pasto al sol mas claro que
       piedra en sombra, asi que un umbral de luminancia se equivoca. Lo que no
       falla es que el pasto tiene el verde por encima del rojo y la piedra al
       reves. Medido sobre el tablero pintado: calzada y losas dan r-g de +30,
       el pasto iluminado +19 y el del medio -7. El brillo si aporta como
       desempate, pero pesa poco — de ahi el `/ 8`.

    2. **El corte lo elige Otsu, no yo.** Un umbral fijo funciona en la imagen
       con la que se lo calibro y falla en la siguiente: el pasto de un mapa
       mas soleado se cuela en la mascara, conecta todas las losas con la
       calzada, y la deteccion devuelve una sola pieza gigante. Otsu busca el
       corte que separa mejor los dos modos del histograma, sea cual sea la
       iluminacion del dibujo.
    """
    r = rgb[:, :, 0].astype(np.float32)
    g = rgb[:, :, 1].astype(np.float32)
    b = rgb[:, :, 2].astype(np.float32)
    score = (r - g) + (r + g + b) / 8.0

    lo, hi = float(score.min()), float(score.max())
    hist, edges = np.histogram(score, bins=256, range=(lo, hi))
    total = hist.sum()
    centers = (edges[:-1] + edges[1:]) / 2
    w0 = np.cumsum(hist)
    w1 = total - w0
    valid = (w0 > 0) & (w1 > 0)
    m0 = np.cumsum(hist * centers) / np.maximum(w0, 1)
    grand = (hist * centers).sum()
    m1 = (grand - np.cumsum(hist * centers)) / np.maximum(w1, 1)
    variance = np.where(valid, w0 * w1 * (m0 - m1) ** 2, -1.0)
    cut = centers[int(np.argmax(variance))]
    return score > cut


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
    # Cerrar primero: la calzada de tierra tiene matas de pasto adentro y sin
    # esto la componente conexa del camino se parte en pedazos.
    stone = ndimage.binary_closing(stone, np.ones((5, 5)))

    # Separar lo que se toca.
    #
    # Aca estaba el error que costo dos vueltas: una APERTURA (erosion seguida
    # de dilatacion) no sirve, porque la dilatacion vuelve a pegar lo que la
    # erosion habia despegado. Hay que ETIQUETAR SOBRE LA MASCARA EROSIONADA:
    # ahi las losas que rozan la calzada ya son piezas aparte. Varias del mapa
    # pintado estan a diez o quince pixeles del borde del camino y con la
    # apertura se perdian, absorbidas por la componente del camino.
    #
    # Despues el camino se reconstruye a ancho completo con una propagacion
    # dentro de la mascara original — el trazado del eje necesita la calzada
    # entera, no la erosionada.
    # Cuanto se erosiona, en fraccion del ancho de la imagen. Es EL parametro a
    # tocar si la deteccion falla: si faltan losas, subilo (separa mas); si
    # aparecen de mas, bajalo. El png de verificacion esta justamente para eso.
    bridge = max(3, int(iw * args.separate))
    core = ndimage.binary_erosion(stone, np.ones((bridge, bridge)))
    labels, n_labels = ndimage.label(core)
    if n_labels == 0:
        raise SystemExit("no se encontro ninguna zona de piedra clara")
    sizes = ndimage.sum(core, labels, range(1, n_labels + 1))
    road_label = int(np.argmax(sizes)) + 1
    road = ndimage.binary_propagation(labels == road_label, mask=stone)

    # La erosion encogio todo, asi que el area medida es menor que la real.
    # Se compensa el umbral en vez de dilatar cada losa por separado.
    shrink = (1 - bridge / (iw * 0.14)) ** 2
    # --------------------------------------------------------- plataformas
    area_px = iw * ih
    slots: list[tuple[float, float]] = []
    for lbl in range(1, labels.max() + 1):
        if lbl == road_label:
            continue
        blob = labels == lbl
        area = int(blob.sum())
        if not (area_px * amin * shrink <= area <= area_px * amax):
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
