# mapa3d.py — MAPA 3D TALLADO EN MADERA con geografía REAL y cámara que vuela (tgbiro, 2ª pasada, 13-oct-2026)
#   Escenas (se arman UNA vez en local con `python mapa3d.py build <escena>` y viajan al farm en fuentes/):
#     mundo   = Atlántico (Europa + América), Natural Earth 10m           · arce claro sobre agua de nogal
#     plata   = Río de la Plata, Natural Earth 10m                         · la costa real de Buenos Aires
#     palermo = calles/vías/parques/lagos de OpenStreetMap (ODbL)          · manzanas en relieve, calles como surcos
#   Coordenadas del suelo: Mercator en GRADOS (X = lon, Y = y_merc). Altura en las mismas unidades (exagerada por escena).
#   Render: cámara pinhole con inclinación (pitch) y giro (yaw) -> rayo por píxel -> suelo -> paralaje del relieve (4 pasadas)
#   -> textura horneada (luz, sombras, surcos) -> desenfoque de miniatura por distancia -> hilo rojo en ARCO 3D + chinches + placas.
import os, sys, json, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
M = os.environ.get("TGP_M", os.getcwd())
MOTOR = os.path.dirname(os.path.abspath(__file__))

def merc_y(lat): lat = max(-85.0, min(85.0, lat)); return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))

SCENES = {
    "mundo":   {"bbox": (-100.0, -45.0, 30.0, 58.0), "px": 4600, "hs": 0.55},
    "plata":   {"bbox": (-59.4, -35.5, -56.3, -33.8), "px": 5200, "hs": 0.010},
    "palermo": {"bbox": (-58.495, -34.635, -58.365, -34.535), "px": 4000, "hs": 0.00035},
    # relieve REAL (SRTM, tiles terrarium de AWS en fuentes/dem/) tallado en capas por curva de nivel + ríos de OSM (fuentes/osm_rios_<escena>.json)
    "baden":   {"bbox": (8.25, 48.80, 8.95, 49.58), "px": 4200, "hs": 0.030, "dem": 10, "paso": 40,
                "rios": {"Rhein": 22, "Neckar": 13, "Enz": 8, "Pfinz": 6, "Nagold": 6},
                "labels": [("RIN", 8.40, 49.20, 120, "brass", 30, -62), ("NECKAR", 8.84, 49.43, 80, "brass", 16, 8),
                           ("ODENWALD", 8.82, 49.53, 110, "burn", 30, 0), ("KRAICHGAU", 8.80, 49.15, 110, "burn", 30, 0),
                           ("SELVA NEGRA", 8.55, 48.84, 100, "burn", 26, 0)]},
    # puerto de Nueva York (tgmeucci): relieve SRTM + batimetría (terrarium trae el fondo del mar < 0 m) → agua en nogal con gubia
    "nyh":     {"bbox": (-74.27, 40.48, -73.90, 40.82), "px": 4200, "hs": 0.010, "dem": 12, "paso": 12, "mar": True, "rios": {},
                "labels": [("STATEN ISLAND", -74.150, 40.585, 120, "burn", 26, 0), ("MANHATTAN", -73.985, 40.765, 100, "burn", 22, 62),
                           ("BROOKLYN", -73.955, 40.655, 110, "burn", 24, 0), ("NEW JERSEY", -74.180, 40.730, 100, "burn", 22, 0),
                           ("BAHÍA DE NUEVA YORK", -74.050, 40.668, 80, "brass", 22, 0), ("THE NARROWS", -74.040, 40.603, 70, "brass", 16, 70)]},
}
def scene_geo(name):
    lon0, lat0, lon1, lat1 = SCENES[name]["bbox"]; PXW = SCENES[name]["px"]
    X0, X1, Y0, Y1 = lon0, lon1, merc_y(lat0), merc_y(lat1)
    PXH = int(round(PXW * (Y1 - Y0) / (X1 - X0)))
    return X0, X1, Y0, Y1, PXW, PXH

# ------------------------------------------------------------------ materiales
def _noise(h, w, scale, seed):
    r = np.random.default_rng(seed); g = r.normal(0, 1, (max(2, h // scale), max(2, w // scale))).astype(np.float32)
    return cv2.resize(g, (w, h), interpolation=cv2.INTER_CUBIC)

_WP = {}
def _photo():
    if "l" not in _WP:
        p = f"{M}/img/x_madera.png"
        im = cv2.imread(p if os.path.exists(p) else f"{M}/fuentes/x_madera.png").astype(np.float32) / 255
        L = im.mean(2); L = L / cv2.GaussianBlur(L, (0, 0), 90); _WP["l"] = L / L.mean()      # sin el sombreado grande de la foto
    return _WP["l"]

def wood(h, w, base, dark, seed=0, ring=None, ang=None, plank=0.55):
    """veta REAL (foto de nogal x_madera) armada en tablones con corrimiento y espejo al azar, reteñida a la paleta base/dark"""
    src = _photo(); sh_, sw_ = src.shape; r = np.random.default_rng(seed)
    ph = max(40, int(sh_ * plank)); out = np.zeros((h, w), np.float32); y = 0
    while y < h:
        y0 = int(r.integers(0, sh_ - ph)); strip = src[y0:y0 + ph]
        if r.random() < 0.5: strip = strip[:, ::-1]
        row = np.concatenate([strip, strip[:, ::-1]] * (w // (2 * sw_) + 2), 1)
        x0 = int(r.integers(0, sw_)); row = row[:, x0:x0 + w] * r.uniform(0.97, 1.03)
        hh = min(ph, h - y); out[y:y + hh] = row[:hh]
        out[y:y + 2] *= 0.82                                                       # junta entre tablones
        y += hh
    k = np.clip((1.25 - out) / 0.9, 0, 1)[..., None]; del out                      # veta oscura -> color dark
    res = np.empty((h, w, 3), np.float32)
    for c in range(3): res[..., c] = np.float32(base[c]) + (np.float32(dark[c]) - np.float32(base[c])) * k[..., 0]
    return res

def gouges(h, w, seed=0, period=26):
    """marcas de gubia (agua tallada a mano): olas cortas y paralelas"""
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    off = _noise(h, w, 90, seed) * period * 0.6
    ph = (yy + off + np.sin(xx / (period * 3.1)) * period * 0.35) / period
    g = 1 - np.abs(np.sin(ph * math.pi)) ** 0.6
    brk = (_noise(h, w, 40, seed + 9) > -0.6).astype(np.float32)
    return cv2.GaussianBlur(g * brk, (0, 0), 1.2)

def bake(col, hgt, light=(-0.55, -0.62, 0.56), zs=1.0, ao=0.55, shadow=0.55):
    """luz horneada: normal del relieve + oclusión + sombra arrojada (desplazada hacia abajo-derecha) · float32 y en el lugar (poca RAM)"""
    gy, gx = np.gradient(hgt * np.float32(zs)); gx = gx.astype(np.float32); gy = gy.astype(np.float32)
    L = np.float32(light) / np.float32(np.linalg.norm(light))
    nn = np.sqrt(gx * gx + gy * gy + 1, dtype=np.float32)
    lam = np.clip((-gx * L[0] - gy * L[1] + L[2]) / nn, 0, 1).astype(np.float32); del gx, gy, nn
    f = np.float32(0.42) + np.float32(0.78) * lam; del lam
    occ = np.clip((cv2.GaussianBlur(hgt, (0, 0), 14) - hgt) * np.float32(ao * 8), 0, 0.5); f *= (1 - occ); del occ
    sh = np.zeros_like(hgt)
    for k in range(1, 9):
        np.maximum(sh, np.clip((np.roll(np.roll(hgt, k * 2, 0), k * 2, 1) - hgt - np.float32(k * 0.012)) * 6, 0, 1), out=sh)
    f *= (1 - cv2.GaussianBlur(sh, (0, 0), 2.5) * np.float32(shadow)); del sh
    col = col.astype(np.float32); col *= f[..., None]
    return np.clip(col, 0, 1, out=col)

def _font(name, px): return ImageFont.truetype(f"{MOTOR}/fonts/{name}", max(8, int(px)))

def text_layer(w, h, items):
    """items: [(texto, (x,y) px, size, fuente, tracking_px, angulo)] -> máscara 0..1 (centrada)"""
    out = np.zeros((h, w), np.float32)
    for s, (x, y), sz, fn, tr, ang in items:
        f = _font(fn, sz); im = Image.new("L", (int(sz * len(s) * 1.2 + tr * len(s) + 40), int(sz * 1.8)), 0); d = ImageDraw.Draw(im)
        cx = 20
        for c in s: d.text((cx, sz * 0.2), c, font=f, fill=255); cx += d.textlength(c, font=f) + tr
        a = np.asarray(im).astype(np.float32)[:, :int(cx) + 20] / 255
        if ang:
            dg = int(math.hypot(*a.shape)) + 4; pad = np.zeros((dg, dg), np.float32); oy, ox = (dg - a.shape[0]) // 2, (dg - a.shape[1]) // 2
            pad[oy:oy + a.shape[0], ox:ox + a.shape[1]] = a
            a = cv2.warpAffine(pad, cv2.getRotationMatrix2D((dg / 2, dg / 2), ang, 1.0), (dg, dg))
        hh, ww = a.shape; x0, y0 = int(x - ww / 2), int(y - hh / 2)
        xa, ya, xb, yb = max(0, x0), max(0, y0), min(w, x0 + ww), min(h, y0 + hh)
        if xb > xa and yb > ya: out[ya:yb, xa:xb] = np.maximum(out[ya:yb, xa:xb], a[ya - y0:yb - y0, xa - x0:xb - x0])
    return out

# ------------------------------------------------------------------ ARMADO DE ESCENAS (local)
def _rasterize_ne(name, X0, X1, Y0, Y1, PXW, PXH):
    gj = json.load(open(f"{M}/fuentes/ne10_countries.geojson", encoding="utf8"))
    land = Image.new("L", (PXW, PXH), 0); bord = Image.new("L", (PXW, PXH), 0); dl = ImageDraw.Draw(land); db = ImageDraw.Draw(bord)
    def f(lon, lat): return ((lon - X0) / (X1 - X0) * PXW, (Y1 - merc_y(lat)) / (Y1 - Y0) * PXH)
    for ft in gj["features"]:
        g = ft["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
        for pl in polys:
            ring = [f(lon, lat) for lon, lat in pl[0]]
            xs = [p[0] for p in ring]; ys = [p[1] for p in ring]
            if max(xs) < 0 or min(xs) > PXW or max(ys) < 0 or min(ys) > PXH: continue
            dl.polygon(ring, fill=255); db.line(ring + ring[:1], fill=255, width=max(2, PXW // 2600))
            for hole in pl[1:]: dl.polygon([f(lon, lat) for lon, lat in hole], fill=0)
    return (np.asarray(land) > 0).astype(np.float32), np.asarray(bord).astype(np.float32) / 255

MAPLE = ((0.90, 0.74, 0.52), (0.60, 0.40, 0.22)); WALNUT = ((0.36, 0.25, 0.18), (0.13, 0.08, 0.05))
PARK = ((0.46, 0.50, 0.30), (0.26, 0.30, 0.16)); BURN = np.float32([0.16, 0.075, 0.03]); BRASS = np.float32([0.85, 0.66, 0.32])

def build(name):
    X0, X1, Y0, Y1, PXW, PXH = scene_geo(name)
    def f(lon, lat): return ((lon - X0) / (X1 - X0) * PXW, (Y1 - merc_y(lat)) / (Y1 - Y0) * PXH)
    labels = []                      # (texto, lon, lat, size_px, color 'burn'|'brass', tracking, ang)
    if name in ("mundo", "plata"):
        land, bord = _rasterize_ne(name, X0, X1, Y0, Y1, PXW, PXH)
        dist = cv2.distanceTransform((land > 0).astype(np.uint8), cv2.DIST_L2, 5)
        bev = 18 if name == "mundo" else 30
        hgt = (np.clip(dist / bev, 0, 1) ** 0.6) * land
        hgt += land * _noise(PXH, PXW, 160, 7) * 0.05 + land * _noise(PXH, PXW, 18, 8) * 0.012     # facetas de talla
        water = 1 - land
        hgt += water * (gouges(PXH, PXW, 3, 22 if name == "mundo" else 34) * 0.05 - 0.12)
        col = wood(PXH, PXW, *MAPLE, seed=1) * land[..., None] + wood(PXH, PXW, *WALNUT, seed=2, ring=0.006) * water[..., None]
        col = col * (1 - (bord * land * 0.55)[..., None]) + BURN * (bord * land * 0.55)[..., None]              # fronteras a pirógrafo
        if name == "mundo":
            labels = [("OCÉANO ATLÁNTICO", -46, 27, 120, "brass", 26, 0), ("OCÉANO ATLÁNTICO", -22, -30, 120, "brass", 26, 0),
                      ("ARGENTINA", -66.5, -33.0, 96, "burn", 14, 0), ("BRASIL", -50, -10, 110, "burn", 16, 0),
                      ("ESTADOS UNIDOS", -88, 37.5, 96, "burn", 14, 0), ("FRANCIA", 2.4, 46.5, 64, "burn", 8, 0),
                      ("HUNGRÍA", 19.5, 47.0, 46, "burn", 6, 0), ("ESPAÑA", -3.6, 40.0, 60, "burn", 8, 0)]
        else:
            labels = [("RÍO DE LA PLATA", -57.55, -34.85, 150, "brass", 34, -18), ("URUGUAY", -57.1, -34.05, 120, "burn", 26, 0),
                      ("PROVINCIA DE BUENOS AIRES", -58.75, -35.05, 92, "burn", 14, 0), ("BUENOS AIRES", -58.66, -34.72, 120, "burn", 22, 0)]
    elif SCENES[name].get("dem"):
        hgt, col, labels = _build_dem(name, X0, X1, Y0, Y1, PXW, PXH, f)
    else:
        G = json.load(open(f"{M}/fuentes/osm_calles.json", encoding="utf8"))["elements"]
        R = json.load(open(f"{M}/fuentes/osm_resto.json", encoding="utf8"))["elements"]
        streets = np.zeros((PXH, PXW), np.float32); parks = np.zeros_like(streets); water = np.zeros_like(streets); rail = np.zeros_like(streets)
        sea = np.zeros_like(streets)
        WID = {"motorway": 13, "trunk": 12, "primary": 11, "secondary": 9, "tertiary": 7}
        def pts(e): return np.int32([[a * 4 for a in f(p["lon"], p["lat"])] for p in e.get("geometry", [])])
        for e in G:
            p_ = pts(e)
            if len(p_) > 1: cv2.polylines(streets, [p_], False, 1.0, WID.get(e["tags"].get("highway"), 5), cv2.LINE_AA, shift=2)
        coast = []
        for e in R:
            t = e.get("tags", {})
            if e["type"] == "relation":
                for m_ in e.get("members", []):
                    if m_.get("role") == "outer" and m_.get("geometry"):
                        p_ = np.int32([[a * 4 for a in f(q["lon"], q["lat"])] for q in m_["geometry"]]); cv2.fillPoly(water, [p_], 1.0, cv2.LINE_AA, shift=2)
                continue
            p_ = pts(e)
            if len(p_) < 2: continue
            if t.get("railway") == "rail": cv2.polylines(rail, [p_], False, 1.0, 5, cv2.LINE_AA, shift=2)
            elif t.get("leisure") == "park": cv2.fillPoly(parks, [p_], 1.0, cv2.LINE_AA, shift=2)
            elif t.get("natural") == "water": cv2.fillPoly(water, [p_], 1.0, cv2.LINE_AA, shift=2)
            elif t.get("natural") == "coastline": coast.append(p_)
        # el río: la costa de OSM deja la tierra a la IZQUIERDA; se cierra el polígono por el lado noreste del recuadro
        land_ne, _ = _rasterize_ne("plata", X0, X1, Y0, Y1, PXW, PXH)
        sea = 1 - land_ne
        if coast:
            cm = np.zeros_like(streets)
            for p_ in coast: cv2.polylines(cm, [p_], False, 1.0, 9, cv2.LINE_AA, shift=2)
            # marcar como río lo que queda del lado del agua de la costa real: tierra NE = sin calles cerca y hacia el NE de la costa
            near = cv2.dilate((streets > 0.3).astype(np.uint8), np.ones((61, 61), np.uint8)).astype(np.float32)
            sea = np.clip(np.maximum(sea * (1 - near), 0), 0, 1)
            sea = np.maximum(sea, 0); sea = cv2.morphologyEx(sea, cv2.MORPH_CLOSE, np.ones((25, 25), np.uint8))
        water = np.clip(np.maximum(water, sea), 0, 1)
        parks = parks * (1 - water); streets = streets * (1 - water)
        blocks = np.clip(1 - streets - parks - water, 0, 1)
        nlab, lab = cv2.connectedComponents((blocks > 0.5).astype(np.uint8))
        rnd = np.random.default_rng(3).uniform(0.45, 1.0, nlab + 1).astype(np.float32); rnd[0] = 0
        bh = rnd[lab] * (blocks > 0.5)
        bd = cv2.distanceTransform((blocks > 0.5).astype(np.uint8), cv2.DIST_L2, 3)
        hgt = bh * np.clip(bd / 3.5, 0, 1) ** 0.5                                   # manzanas con bisel
        trees = np.clip(_noise(PXH, PXW, 7, 11) * 0.5 + 0.25, 0, 1) * parks
        hgt += parks * 0.12 + cv2.GaussianBlur(trees, (0, 0), 2) * 0.35
        hgt += streets * 0.03 - water * 0.10 + water * gouges(PXH, PXW, 5, 18) * 0.03
        col = np.zeros((PXH, PXW, 3), np.float32)
        for msk, args in ((blocks, (MAPLE[0], MAPLE[1], 1)), (streets, ((0.60, 0.45, 0.30), (0.44, 0.30, 0.18), 4)), (parks, (PARK[0], PARK[1], 5)), (water, (WALNUT[0], WALNUT[1], 2))):
            wd = wood(PXH, PXW, args[0], args[1], seed=args[2]); wd *= msk[..., None]; col += wd; del wd
        col /= np.clip(blocks + streets + parks + water, 1e-3, None)[..., None]
        col = col * (1 - (rail * 0.7)[..., None]) + BURN * (rail * 0.7)[..., None]
        labels = [("RÍO DE LA PLATA", -58.392, -34.556, 120, "brass", 26, -38), ("PALERMO", -58.440, -34.590, 110, "burn", 30, 0)]

        land = 1 - water
    # placas: pirograbado sobre madera clara, latón embutido sobre el agua
    try: labels = [tuple(x) for x in json.load(open(f"{M}/fuentes/labels_{name}.json", encoding="utf8"))]
    except FileNotFoundError: pass
    items_b = [(s, f(lo, la), sz, "CormorantSC.ttf", tr, an) for s, lo, la, sz, c, tr, an in labels if c == "burn"]
    items_m = [(s, f(lo, la), sz, "CormorantSC.ttf", tr, an) for s, lo, la, sz, c, tr, an in labels if c == "brass"]
    if items_b:
        m = text_layer(PXW, PXH, items_b); hal = cv2.GaussianBlur(m, (0, 0), 5) * 0.4
        col = col * (1 - (hal * 0.5)[..., None]) ; col = col * (1 - (m * 0.85)[..., None]) + BURN * (m * 0.85)[..., None]
        hgt = hgt - m * 0.04
    if items_m:
        m = text_layer(PXW, PXH, items_m); col = col * (1 - (m * 0.9)[..., None]) + BRASS * (m * 0.9)[..., None]; hgt = hgt + m * 0.02
    zs = {"mundo": 14.0, "plata": 18.0, "palermo": 10.0}.get(name, 12.0)
    tex = bake(col.astype(np.float32), hgt.astype(np.float32), zs=zs)
    os.makedirs(f"{M}/fuentes", exist_ok=True)
    Image.fromarray((tex * 255).astype(np.uint8)).save(f"{M}/fuentes/m3_{name}.jpg", quality=92)
    np.save(f"{M}/fuentes/m3_{name}_h.npy", hgt.astype(np.float16))
    print(name, PXW, PXH)

def _build_dem(name, X0, X1, Y0, Y1, PXW, PXH, f):
    """maqueta de relieve: elevación real en CAPAS de madera (una por curva de nivel, borde quemado) + ríos tallados en nogal"""
    cfg = SCENES[name]; z = cfg["dem"]; N = 2 ** z * 256
    gx = lambda lon: (lon + 180) / 360 * N
    gy = lambda Ym: (1 - math.radians(Ym) / math.pi) / 2 * N                     # Ym = y Mercator en grados
    tx0, tx1 = int(gx(X0) // 256), int(gx(X1) // 256); ty0, ty1 = int(gy(Y1) // 256), int(gy(Y0) // 256)
    mos = np.zeros(((ty1 - ty0 + 1) * 256, (tx1 - tx0 + 1) * 256), np.float32)
    for tx in range(tx0, tx1 + 1):
        for ty in range(ty0, ty1 + 1):
            a = cv2.imread(f"{M}/fuentes/dem/{z}_{tx}_{ty}.png")[..., ::-1].astype(np.float32)
            mos[(ty - ty0) * 256:(ty - ty0 + 1) * 256, (tx - tx0) * 256:(tx - tx0 + 1) * 256] = a[..., 0] * 256 + a[..., 1] + a[..., 2] / 256 - 32768
    xs = np.float32([gx(X0 + (X1 - X0) * (i + 0.5) / PXW) - tx0 * 256 for i in range(PXW)])
    ys = np.float32([gy(Y1 - (Y1 - Y0) * (j + 0.5) / PXH) - ty0 * 256 for j in range(PXH)])
    mx, my = np.meshgrid(xs, ys)
    elev = cv2.remap(mos, mx, my, cv2.INTER_CUBIC); elev = cv2.GaussianBlur(elev, (0, 0), 2.0)
    sea = None
    if cfg.get("mar"):                                                              # costa = cota 0; el mar se talla aparte
        sea = cv2.GaussianBlur((elev < 0.8).astype(np.float32), (0, 0), 1.5); elev = np.maximum(elev, 0.8)
    e0, e1 = np.percentile(elev, 1), np.percentile(elev, 99.7); paso = cfg["paso"]
    lay = np.floor((elev - e0) / paso); nl = max(1.0, (e1 - e0) / paso)
    lay_s = cv2.GaussianBlur(lay, (0, 0), 1.2)                                     # canto apenas redondeado de cada capa
    hgt = lay_s / nl + (elev - e0) / (e1 - e0) * 0.08                                # capas + un poco de la forma real
    hgt += _noise(PXH, PXW, 30, 8) * 0.006
    edge = np.clip(np.abs(cv2.Laplacian(lay_s, cv2.CV_32F)) * 3, 0, 1)            # canto de cada capa = línea quemada
    col = wood(PXH, PXW, *MAPLE, seed=1)
    tone = np.clip(0.80 + 0.30 * (lay / nl), 0.75, 1.12)[..., None]               # capas altas más claras (madera de otra tabla)
    col = col * tone
    col = col * (1 - (edge * 0.6)[..., None]) + BURN * (edge * 0.6)[..., None]
    riv = np.zeros((PXH, PXW), np.float32)
    try:
        R = json.load(open(f"{M}/fuentes/osm_rios_{name}.json", encoding="utf8"))["elements"]
    except FileNotFoundError: R = []
    for e in R:
        wdt = cfg["rios"].get(e.get("tags", {}).get("name"), 0)
        if not wdt or not e.get("geometry"): continue
        p_ = np.int32([[a * 4 for a in f(q["lon"], q["lat"])] for q in e["geometry"]])
        cv2.polylines(riv, [p_], False, 1.0, wdt, cv2.LINE_AA, shift=2)
    riv = cv2.GaussianBlur(riv, (0, 0), 1.0)
    hgt = hgt * (1 - riv * 0.6) - riv * 0.02 + riv * gouges(PXH, PXW, 5, 16) * 0.004
    wal = wood(PXH, PXW, *WALNUT, seed=2, ring=0.006)
    col = col * (1 - riv[..., None]) + wal * riv[..., None]
    if sea is not None:
        bord = np.clip(np.abs(cv2.Laplacian(sea, cv2.CV_32F)) * 4, 0, 1)
        hgt = hgt * (1 - sea) + sea * (gouges(PXH, PXW, 3, 22) * 0.03 - 0.10)
        col = col * (1 - sea[..., None]) + wal * sea[..., None]
        col = col * (1 - (bord * 0.6)[..., None]) + BURN * (bord * 0.6)[..., None]
    return hgt.astype(np.float32), col.astype(np.float32), cfg.get("labels", [])

# ------------------------------------------------------------------ RENDER
_SC = {}
def scene(name):
    if name not in _SC:
        X0, X1, Y0, Y1, PXW, PXH = scene_geo(name)
        tex = cv2.imread(f"{M}/fuentes/m3_{name}.jpg")[..., ::-1].copy()
        hgt = np.load(f"{M}/fuentes/m3_{name}_h.npy").astype(np.float32)
        _SC[name] = dict(X0=X0, X1=X1, Y0=Y0, Y1=Y1, PXW=PXW, PXH=PXH, tex=tex, hgt=hgt, hs=SCENES[name]["hs"])
    return _SC[name]

def to_px(sc, X, Y): return (X - sc["X0"]) / (sc["X1"] - sc["X0"]) * sc["PXW"], (sc["Y1"] - Y) / (sc["Y1"] - sc["Y0"]) * sc["PXH"]

class Cam:
    """cámara: mira al punto (lon, lat) del suelo; span = ancho visible en grados de longitud en ese punto;
    pitch = grados desde la vertical (0 = cenital); yaw = giro en grados (0 = norte arriba)"""
    def __init__(self, lon, lat, span, pitch, yaw, W, H, fov=38.0):
        self.T = np.float64([lon, merc_y(lat), 0.0]); self.W, self.H = W, H
        self.f = 1.0 / math.tan(math.radians(fov) / 2)
        D = span * self.f / 2
        p, y = math.radians(pitch), math.radians(yaw)
        fwd_h = np.float64([math.sin(y), math.cos(y), 0.0])                       # hacia dónde mira en el plano (norte = +Y)
        self.C = self.T - fwd_h * D * math.sin(p) + np.float64([0, 0, D * math.cos(p)])
        self.fw = (self.T - self.C) / np.linalg.norm(self.T - self.C)
        self.rt = np.cross(self.fw, [0, 0, 1.0]); self.rt /= np.linalg.norm(self.rt)
        self.up = np.cross(self.rt, self.fw); self.D = D
    def rays(self, w, h):
        xs = (np.arange(w) + 0.5) / w * 2 - 1; ys = ((np.arange(h) + 0.5) / h * 2 - 1) * (h / w)
        sx, sy = np.meshgrid(xs, ys)
        d = self.fw[None, None] * self.f + sx[..., None] * self.rt[None, None] - sy[..., None] * self.up[None, None]
        return d / np.linalg.norm(d, axis=2, keepdims=True)
    def project(self, X, Y, Z):
        v = np.float64([X, Y, Z]) - self.C; z = v @ self.fw
        if z <= 1e-9: return None
        return ((v @ self.rt) / z * self.f * 0.5 + 0.5) * self.W, (0.5 - (v @ self.up) / z * self.f * 0.5 * self.W / self.H) * self.H

def render_ground(cam, names, W, H, alpha=None):
    """devuelve imagen float32 (H,W,3) 0..1 y profundidad relativa; names = escenas de grande a chica (la última se mezcla encima)"""
    hw, hh = W // 2, H // 2
    d = cam.rays(hw, hh); dz = np.minimum(d[..., 2], -1e-4)
    s = -cam.C[2] / dz; P = cam.C[None, None, :2] + d[..., :2] * s[..., None]      # suelo z=0
    rxy = d[..., :2] / (-dz)[..., None]                                            # cuánto se corre el punto por unidad de altura
    out = None; dist = s
    for k, nm in enumerate(names):
        sc = scene(nm); a_ = 1.0 if (alpha is None or k == 0) else alpha[k]
        if a_ <= 0.001: continue
        Q = P.copy(); z = np.zeros(P.shape[:2])
        for _ in range(4):                                                         # paralaje del relieve
            u, v = to_px(sc, Q[..., 0], Q[..., 1])
            hv = cv2.remap(sc["hgt"], u.astype(np.float32), v.astype(np.float32), cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
            z = np.maximum(hv, -0.2) * sc["hs"]; Q = P - rxy * z[..., None]
        u, v = to_px(sc, Q[..., 0], Q[..., 1])
        U = cv2.resize(u.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR); V = cv2.resize(v.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
        img = cv2.remap(sc["tex"], U, V, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT).astype(np.float32) / 255
        if out is None: out = img
        else:
            inb = ((U > 2) & (V > 2) & (U < sc["PXW"] - 3) & (V < sc["PXH"] - 3)).astype(np.float32)
            inb = cv2.GaussianBlur(inb, (0, 0), 25)[..., None] * a_
            out = out * (1 - inb) + img * inb
    dist = cv2.resize(dist.astype(np.float32), (W, H), interpolation=cv2.INTER_LINEAR)
    return out, dist

if __name__ == "__main__":
    if sys.argv[1] == "build":
        for nm in sys.argv[2:]: build(nm)

# ------------------------------------------------------------------ COMPONENTE para plano.py (kind "mapa3d")
#   sh["cam"]    = [[t, lon, lat, span, pitch, yaw], ...]   (cuadros clave con easing)
#   sh["scenes"] = ["plata", "palermo"]  (de grande a chica; la chica entra cuando span < fade[0] y queda entera en fade[1])
#   sh["pins"]   = [[t, lon, lat, "TEXTO", "subtítulo"], ...]  chinche de latón que cae + placa de madera pirograbada
#   sh["route"]  = [[lon, lat], ...] · sh["route_t"] = [t0, t1] · sh["arc"] = altura del arco (fracción del largo)
def _kv(keys, t, j):
    if t <= keys[0][0]: return keys[0][j]
    for a, b in zip(keys, keys[1:]):
        if t <= b[0]:
            u = (t - a[0]) / max(1e-6, b[0] - a[0]); u = u * u * (3 - 2 * u)
            if j == 3: return math.exp(math.log(a[j]) + (math.log(b[j]) - math.log(a[j])) * u)      # zoom geométrico (vuelo parejo)
            return a[j] + (b[j] - a[j]) * u
    return keys[-1][j]

def _route_pts(route, arc, prog, n=220):
    """muestras 3D del hilo (arco sobre el mapa) hasta 'prog' 0..1 del largo total"""
    P = [(lo, merc_y(la)) for lo, la in route]; L = [math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(P, P[1:])]; T = sum(L)
    out = []; acc = 0
    for (a, b), l in zip(zip(P, P[1:]), L):
        k = max(2, int(n * l / T))
        for i in range(k + 1):
            s = i / k; d = acc + l * s
            if d > prog * T: return out
            out.append((a[0] + (b[0] - a[0]) * s, a[1] + (b[1] - a[1]) * s, arc * l * 4 * s * (1 - s)))
        acc += l
    return out

def _plate(txt, sub, scale=1.0):
    """placa de madera clara con el texto pirograbado (RGBA float)"""
    f1 = _font("CormorantSC.ttf", 46 * scale); f2 = _font("Cormorant.ttf", 30 * scale)
    tmp = ImageDraw.Draw(Image.new("L", (10, 10)))
    w = int(max(tmp.textlength(txt, font=f1) + 12 * len(txt) * scale * 0.18, tmp.textlength(sub or "", font=f2)) + 56 * scale)
    h = int((112 if sub else 74) * scale)
    src = _photo(); wd = cv2.resize(src[:, :max(60, w // 2)], (w, h))
    base = np.float32((0.86, 0.70, 0.49)); k = np.clip((1.25 - wd) / 0.9, 0, 1)[..., None]
    col = base * (1 - k * 0.6) + np.float32((0.60, 0.40, 0.22)) * k * 0.6
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    d.text((w / 2, 40 * scale), txt, font=f1, fill=255, anchor="mm")
    if sub: d.text((w / 2, 84 * scale), sub, font=f2, fill=255, anchor="mm")
    m = np.asarray(im).astype(np.float32) / 255
    col = col * (1 - (cv2.GaussianBlur(m, (0, 0), 3) * 0.35)[..., None]); col = col * (1 - m[..., None] * 0.88) + BURN * m[..., None] * 0.88
    yy, xx = np.mgrid[0:h, 0:w]; edge = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy)).astype(np.float32)
    col = col * (0.78 + 0.22 * np.clip(edge / (6 * scale), 0, 1))[..., None]
    return np.dstack([col, np.ones((h, w), np.float32)])

def _blend(img, rgba, x, y):
    h, w = rgba.shape[:2]; H, W = img.shape[:2]; x, y = int(x), int(y)
    xa, ya, xb, yb = max(0, x), max(0, y), min(W, x + w), min(H, y + h)
    if xb <= xa or yb <= ya: return img
    a = rgba[ya - y:yb - y, xa - x:xb - x, 3:4]; img[ya:yb, xa:xb] = img[ya:yb, xa:xb] * (1 - a) + rgba[ya - y:yb - y, xa - x:xb - x, :3] * a
    return img

def _pin(img, x, y, sx, sy, r, a):
    """chinche de latón (cabeza esférica + aguja) con sombra en el suelo (sx, sy)"""
    H, W = img.shape[:2]; yy, xx = np.ogrid[:H, :W]
    sd = np.exp(-(((xx - sx) ** 2) / (2 * (r * 1.1) ** 2) + ((yy - sy) ** 2) / (2 * (r * 0.6) ** 2)))
    img *= (1 - sd * 0.5 * a)[..., None]
    L = np.zeros((H, W), np.float32); cv2.line(L, (int(sx), int(sy)), (int(x), int(y + r * 0.8)), 1.0, max(2, int(r * 0.22)), cv2.LINE_AA)
    img[:] = img * (1 - L[..., None] * a) + np.float32([0.55, 0.55, 0.58]) * L[..., None] * a
    dd = np.sqrt((xx - x) ** 2 + (yy - y) ** 2) / r; disc = np.clip((1 - dd) * r * 0.7, 0, 1)
    spec = np.exp(-(((xx - x + r * 0.35) ** 2 + (yy - y + r * 0.38) ** 2) / (2 * (r * 0.25) ** 2)))
    shade = np.clip(1.05 - dd * 0.55, 0, 1)
    col = np.float32([0.72, 0.10, 0.07])[None, None] * shade[..., None] + spec[..., None] * 0.65
    img[:] = img * (1 - disc[..., None] * a) + col * disc[..., None] * a
    return img

def r_mapa3d(sh, sid, DUR, put):
    from cine import W, H, FPS, film, depth_dof
    names = sh.get("scenes", ["plata"]); fade = sh.get("fade", [0.16, 0.09]); keys = sh["cam"]
    pins = sh.get("pins", []); route = sh.get("route"); rt = sh.get("route_t", [0.3, DUR * 0.8]); arc = sh.get("arc", 0.18)
    if sh.get("rel"):                                    # tiempos en FRACCIÓN del plano (la duración la decide timeline.py)
        keys = [[k[0] * DUR] + list(k[1:]) for k in keys]; pins = [[q[0] * DUR] + list(q[1:]) for q in pins]
        rt = [x * DUR for x in sh.get("route_t", [0.06, 0.8])]
    plates = {}
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        lon, lat, span, pitch, yaw = (_kv(keys, t, j) for j in (1, 2, 3, 4, 5))
        cam = Cam(lon, lat, span, pitch, yaw, W, H)
        al = [1.0] + [float(np.clip((fade[0] - span) / max(1e-9, fade[0] - fade[1]), 0, 1)) for _ in names[1:]]
        img, dist = render_ground(cam, names, W, H, al); img = img.astype(np.float32)
        dd = np.log(np.clip(dist / cam.D, 0.2, 5)).astype(np.float32)
        img = depth_dof(img, dd, 0.0, sh.get("dof", 9.0)).astype(np.float32)
        # hilo rojo en arco + su sombra sobre el mapa
        if route:
            prog = float(np.clip((t - rt[0]) / max(1e-6, rt[1] - rt[0]), 0, 1)); prog = prog * prog * (3 - 2 * prog)
            pts = _route_pts(route, arc, prog)
            if len(pts) > 1:
                scr = [cam.project(X, Y, Z) for X, Y, Z in pts]; shd = [cam.project(X, Y, 0) for X, Y, Z in pts]
                scr = [p for p in scr if p]; shd = [p for p in shd if p]
                th = max(3, int(sh.get("thread_w", 5) * W / 1920))
                S_ = np.zeros((H, W), np.float32); cv2.polylines(S_, [np.int32([(x * 4, y * 4) for x, y in shd])], False, 1.0, th * 2, cv2.LINE_AA, shift=2)
                img *= (1 - cv2.GaussianBlur(S_, (0, 0), 6 * W / 1920) * 0.45)[..., None]
                L = np.zeros((H, W), np.float32); cv2.polylines(L, [np.int32([(x * 4, y * 4) for x, y in scr])], False, 1.0, th, cv2.LINE_AA, shift=2)
                Lh = np.zeros((H, W), np.float32); cv2.polylines(Lh, [np.int32([(x * 4, y * 4 - 4) for x, y in scr])], False, 1.0, max(1, th // 3), cv2.LINE_AA, shift=2)
                img = img * (1 - L[..., None]) + np.float32([0.66, 0.06, 0.05]) * L[..., None]
                img = img + Lh[..., None] * np.float32([0.25, 0.08, 0.06])
        for k, (tp, plon, plat, txt, sub) in enumerate(pins):
            if t < tp: continue
            u = min(1.0, (t - tp) / 0.45); drop = (1 - u) ** 2                     # cae con un pique
            Y = merc_y(plat); hz = span * 0.035
            g = cam.project(plon, Y, 0); hp = cam.project(plon, Y, hz * (1.0 + 3 * drop))
            if not g or not hp: continue
            r = 13 * W / 1920 * sh.get("pin_s", 1.0)
            img = _pin(img, hp[0], hp[1], g[0], g[1], r, 1.0)
            if txt:
                if k not in plates: plates[k] = _plate(txt, sub, W / 1920 * sh.get("plate_s", 1.0))
                pa = plates[k].copy(); pa[..., 3] *= min(1.0, max(0.0, (t - tp - 0.25) / 0.35))
                img = _blend(img, pa, hp[0] + r * 1.8, hp[1] - pa.shape[0] * 0.5)
        put(film(np.clip(img * np.float32(sh.get("gain", 1.14)), 0, 1), t, i, "warm", halation=0.10, grain=0.025))
