# compmad.py — Caja Naranja con el look del Tallador (madera tallada + stop-motion): la data como OBJETOS de taller.
#   r_mapamad   mapa en relieve de madera (mar teñido de nogal, fronteras y nombres quemados a pirógrafo), hilo rojo + chinches de bronce
#   r_perfilmad la altitud = hilo rojo clavado sobre una tabla de arce; tiembla y cae en la palabra; foco que sigue la punta del hilo
#   marca()     superposición: marca a fuego (CONFIRMADO, EN DISPUTA…) que se quema con brasa y humo y se enfría
# Todo se anima "en dos" (12 poses/s, como stop-motion); el grano de película corre a 24.
import os, math, json, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from cine import W, H, S, load, blur, over, fbm, film, depth_dof, ease, ramp
import comp7
from comp7 import tsec, alt_at, RUTA, CITY, COUNTRY_LBL, _merc, esn, hms
M = os.environ.get("TGP_M", os.getcwd()); FPS = 24
FD = f"{M}/fonts"
def font(name, px): return ImageFont.truetype(f"{FD}/{name}", max(8, int(px)))
BURN = np.array([0.16, 0.075, 0.03]); REDT = np.array([0.70, 0.07, 0.05]); BRASS = np.array([0.80, 0.62, 0.30])

def kv(keys, t):
    if t <= keys[0][0]: return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1: return v0 + (v1 - v0) * ease((t - t0) / max(1e-6, t1 - t0))
    return keys[-1][1]

def wood_tex(w, h, tint=None, seed=0):
    """textura de arce de la tabla real (agnes) recortada sin el hilo ni las chinches"""
    tb = load(f"{M}/img/i_tabla.png"); th, tw = tb.shape[:2]
    crop = tb[int(th * 0.30):, int(tw * 0.22):]
    if seed: crop = crop[:, ::-1]
    t = cv2.resize(crop, (w, h), interpolation=cv2.INTER_CUBIC)
    if tint is not None: t = t * np.array(tint)
    return t

def text_mask(w, h, items):
    """items: [(texto, (x,y) px, size, fuente, anchor, tracking_px)] -> máscara 0..1"""
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    for s, (x, y), sz, fn, an, tr in items:
        f = font(fn, sz)
        if tr:
            tw_ = sum(d.textlength(c, font=f) for c in s) + tr * (len(s) - 1)
            x0 = x - tw_ / 2 if an[0] == "m" else (x - tw_ if an[0] == "r" else x)
            for c in s: d.text((x0, y), c, font=f, fill=255, anchor="l" + an[1]); x0 += d.textlength(c, font=f) + tr
        else: d.text((x, y), s, font=f, fill=255, anchor=an)
    return np.asarray(im).astype(np.float32) / 255

def burn(img, m, a=0.9, scorch=6.0):
    """pirograbado: halo chamuscado alrededor + trazo quemado"""
    if a <= 0: return img
    hal = cv2.GaussianBlur(m, (0, 0), scorch * S) * 0.55
    img = img * (1 - (hal * a * 0.55)[..., None] * (1 - np.array([0.55, 0.42, 0.30])))
    mm = cv2.GaussianBlur(m, (0, 0), 0.6 * S)
    return img * (1 - (mm * a)[..., None]) + BURN * (mm * a)[..., None]

def carve(img, m, depth=0.35):
    """surco tallado: borde oscuro arriba-izquierda, luz abajo-derecha"""
    sh_ = np.roll(m, (int(2 * S), int(2 * S)), (0, 1)); hi = np.roll(m, (-int(1 * S), -int(1 * S)), (0, 1))
    img = img * (1 - (m * depth)[..., None])
    return img + (np.clip(sh_ - m, 0, 1) * 0.10)[..., None] - (np.clip(hi - m, 0, 1) * 0.10)[..., None]

def thread(img, pts, w=6.0, a=1.0, lift=1.0):
    """hilo rojo de algodón con sombra (despegado de la madera) y brillo torcido"""
    if len(pts) < 2 or a <= 0: return img
    def mask(off=(0, 0), ww=w):
        L = np.zeros(img.shape[:2], np.float32)
        cv2.polylines(L, [np.int32([((x + off[0]) * 4, (y + off[1]) * 4) for x, y in pts])], False, 1.0, max(1, int(ww * S)), cv2.LINE_AA, shift=2)
        return L
    sh_ = cv2.GaussianBlur(mask((5 * lift * S, 7 * lift * S)), (0, 0), 3.5 * S)
    img = img * (1 - (sh_ * 0.45 * a)[..., None])
    L = mask(); img = img * (1 - (L * a)[..., None]) + REDT * (L * a)[..., None]
    hl = mask((-0.9 * S, -1.4 * S), max(1.0, w * 0.28))
    tw = 0.5 + 0.5 * np.sin((np.arange(img.shape[1])[None, :] + np.arange(img.shape[0])[:, None]) * 0.9 / S)      # hebra torcida
    return img + (hl * L * tw * 0.35 * a)[..., None] * np.array([1.0, 0.65, 0.55])

def pin(img, x, y, r=11.0, a=1.0, col=BRASS):
    if a <= 0: return img
    h, w = img.shape[:2]; yy, xx = np.ogrid[:h, :w]; R = r * S * (1 + 0.35 * (1 - a))
    sd = np.exp(-(((xx - x - 6 * S) ** 2 + (yy - y - 8 * S) ** 2) / (2 * (R * 0.9) ** 2)))
    img = img * (1 - (sd * 0.45 * a)[..., None])
    dd = np.sqrt((xx - x) ** 2 + (yy - y) ** 2) / R; disc = np.clip((1 - dd) * R * 0.8, 0, 1)
    spec = np.exp(-(((xx - x + R * 0.35) ** 2 + (yy - y + R * 0.35) ** 2) / (2 * (R * 0.28) ** 2)))
    c = col * (0.55 + 0.6 * np.clip(1 - dd, 0, 1))[..., None] + spec[..., None] * 0.6
    return img * (1 - (disc * a)[..., None]) + c * (disc * a)[..., None]

def dof_point(img, x, y, strength=9.0, r0=0.20):
    """foco que viaja: nítido alrededor de (x,y), desenfoque creciente con la distancia (como lente macro sobre la mesa)"""
    h, w = img.shape[:2]; yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    d = np.clip((np.hypot((xx - x) / w, (yy - y) / w * 1.25) - r0 * 0.5) / 0.6, 0, 1).astype(np.float32)
    return depth_dof(img, d, 0.0, strength * 1.6)

def stepped(i): return (i // 2) * 2                                    # stop-motion "en dos"

# ------------------------------------------------------------------ marca a fuego (superposición)
_MK = {}
def marca(img, t, sh, DUR):
    """sh['marca'] = [ETIQUETA, fuente, t_golpe]  -> abajo a la derecha, quemada en una tablita de madera"""
    et, src, tb = sh["marca"]
    if t < tb - 0.25: return img
    key = (et, src)
    if key not in _MK:
        pw, ph = int(470 * S), int(150 * S)
        wd = wood_tex(pw, ph, tint=(0.95, 0.88, 0.78), seed=1)
        m1 = text_mask(pw, ph, [(et, (pw / 2, ph * 0.40), 54 * S, "Anton-Regular.ttf", "mm", 6 * S)])
        m2 = text_mask(pw, ph, [(src.upper(), (pw / 2, ph * 0.78), 22 * S, "CormorantSC.ttf", "mm", 3 * S)])
        fr = np.zeros((ph, pw), np.float32); cv2.rectangle(fr, (int(10 * S), int(10 * S)), (pw - int(10 * S), ph - int(10 * S)), 1.0, max(1, int(3 * S)))
        wd[:int(4 * S)] *= 1.18; wd[-int(5 * S):] *= 0.55; wd[:, :int(4 * S)] *= 1.12; wd[:, -int(5 * S):] *= 0.6
        _MK[key] = (wd, m1, m2, fr)
    wd, m1, m2, fr = _MK[key]; ph, pw = wd.shape[:2]
    ta = (math.floor(t * 12) / 12)                                      # en dos
    k_in = ramp(ta, tb - 0.25, tb); k_out = 1 - ramp(t, DUR - 0.45, DUR - 0.05)
    if k_in <= 0 or k_out <= 0: return img
    hot = math.exp(-max(0, t - tb) * 2.2) if t >= tb else 0.0           # brasa: naranja al rojo que se enfría
    pl = wd.copy(); pl = burn(pl, m1 * (t >= tb), 0.92, 3.0); pl = burn(pl, m2 * (t >= tb), 0.8, 2.0); pl = burn(pl, fr * (t >= tb), 0.75, 2.0)
    if hot > 0:
        g = cv2.GaussianBlur(m1 + m2 * 0.6 + fr * 0.5, (0, 0), 2.5 * S)
        pl = pl + (g * hot)[..., None] * np.array([1.0, 0.42, 0.08]) * 1.4
    x0 = int(W - pw - 70 * S); y0 = int(H - ph - 64 * S - (1 - k_in) * 40 * S)
    img = img.copy()
    shd = np.zeros((H, W), np.float32); shd[y0:y0 + ph, x0:x0 + pw] = 1; shd = cv2.GaussianBlur(np.roll(shd, (int(10 * S), int(8 * S)), (0, 1)), (0, 0), 10 * S)
    img = img * (1 - (shd * 0.5 * k_in * k_out)[..., None])
    a = k_in * k_out; img[y0:y0 + ph, x0:x0 + pw] = img[y0:y0 + ph, x0:x0 + pw] * (1 - a) + pl * a
    if t >= tb and t < tb + 2.2:                                      # humo que sube del quemado
        sm = cv2.resize(fbm(120, 60, 77), (pw, int(ph * 1.6)))
        sm = np.roll(sm, int(-(t - tb) * 60 * S), 0); env = math.exp(-(t - tb) * 1.4)
        y1 = max(0, y0 - int(ph * 0.6)); region = img[y1:y0 + ph, x0:x0 + pw]; m_ = np.clip(sm[-region.shape[0]:] - 0.45, 0, 1) * env * 0.9
        img[y1:y0 + ph, x0:x0 + pw] = region * (1 - m_[..., None] * 0.6) + m_[..., None] * 0.6 * np.array([0.85, 0.83, 0.80])
    return img

# ------------------------------------------------------------------ mapa de madera
_MAPW = {}
LON0, LON1, LAT0, LAT1 = 30.0, 60.0, 21.0, 36.5
def map_wood():
    if "img" in _MAPW: return _MAPW["img"], _MAPW["f"]
    PXW = 4200; x0, y0 = _merc(LON0, LAT0); x1, y1 = _merc(LON1, LAT1); PXH = int(PXW * (y1 - y0) / (x1 - x0))
    def f(lon, lat): x, y = _merc(lon, lat); return (x - x0) / (x1 - x0) * PXW, (y1 - y) / (y1 - y0) * PXH
    path = f"{M}/fuentes/mapamad_base.png"
    if not os.path.exists(path):
        gj = json.load(open(f"{M}/fuentes/ne10_countries.geojson", encoding="utf8"))
        land = Image.new("L", (PXW, PXH), 0); bord = Image.new("L", (PXW, PXH), 0); dl = ImageDraw.Draw(land); db = ImageDraw.Draw(bord)
        for ft in gj["features"]:
            g = ft["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
            for pl in polys:
                ring = [f(lon, lat) for lon, lat in pl[0]]
                if max(p[0] for p in ring) < 0 or min(p[0] for p in ring) > PXW: continue
                dl.polygon(ring, fill=255); db.line(ring + ring[:1], fill=255, width=3)
                for hole in pl[1:]: dl.polygon([f(lon, lat) for lon, lat in hole], fill=0)
        Lm = (np.asarray(land) > 0).astype(np.float32); Bm = np.asarray(bord).astype(np.float32) / 255 * Lm
        dist = cv2.distanceTransform((Lm > 0).astype(np.uint8), cv2.DIST_L2, 5)
        hgt = cv2.GaussianBlur((np.clip(dist / 28.0, 0, 1) ** 0.5 * Lm).astype(np.float32), (0, 0), 2)
        gy, gx = np.gradient(hgt * 30); shade = np.clip(0.5 - (gx * -0.7 + gy * -0.7) * 0.9, 0, 1)[..., None]
        maple = wood_tex(PXW, PXH, tint=(1.04, 1.0, 0.94)); walnut = wood_tex(PXW, PXH, tint=(0.60, 0.42, 0.28), seed=1)
        lm = Lm[..., None]
        img = lm * maple * (0.78 + 0.44 * shade) + (1 - lm) * walnut
        sd = np.roll(np.roll(cv2.GaussianBlur(Lm, (0, 0), 9), 7, 0), 6, 1)            # la placa de arce proyecta sombra sobre el nogal
        img = img * (1 - ((1 - lm[..., 0]) * sd * 0.35)[..., None])
        img = burn(img, cv2.GaussianBlur(Bm, (0, 0), 0.8), 0.55, 3.0)                    # fronteras a pirógrafo
        Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(path)
    _MAPW["img"] = load(path); _MAPW["f"] = f
    return _MAPW["img"], f

def r_mapamad(sh, sid, DUR, put):
    base, f = map_wood(); bh, bw = base.shape[:2]
    cams = sh.get("cam", [[0, 46.0, 28.6, 25.0], [DUR, 44.0, 28.8, 22.0]])
    tA, tB = tsec(sh.get("draw", ["03:05", "05:21"])[0] + ":00"), tsec(sh.get("draw", ["03:05", "05:21"])[1] + ":00")
    RT = [(tsec(a + ":00"), lon, lat) for a, lon, lat in RUTA]
    def pos(u):
        for (t0, a0, b0), (t1, a1, b1) in zip(RT, RT[1:]):
            if t0 <= u <= t1: k = (u - t0) / max(1, t1 - t0); return a0 + (a1 - a0) * k, b0 + (b1 - b0) * k
        return (RT[-1][1], RT[-1][2]) if u > RT[-1][0] else (RT[0][1], RT[0][2])
    t_in, t_end = sh.get("t_in", 0.4), sh.get("t_end", DUR * 0.72)
    pins_t = sh.get("pins_t", {"DUBÁI": 0.3, "TEL AVIV": 2.6})
    TILT = 0.13
    src = np.float32([[0, 0], [W, 0], [W, H], [0, H]]); dst = np.float32([[W * TILT, -H * 0.05], [W * (1 - TILT), -H * 0.05], [W * 1.03, H * 1.02], [-W * 0.03, H * 1.02]])
    PM = cv2.getPerspectiveTransform(src, dst)
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None] * np.ones((1, W), np.float32)
    last = None
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        if i % 2 == 0 or last is None:
            ta = stepped(i) / FPS
            lon_c = kv([(c[0], c[1]) for c in cams], ta); lat_c = kv([(c[0], c[2]) for c in cams], ta); span = kv([(c[0], c[3]) for c in cams], ta)
            cx, cy = f(lon_c, lat_c); xa, _ = f(lon_c - span / 2, lat_c); xb, _ = f(lon_c + span / 2, lat_c); sw = xb - xa; shh = sw * H / W
            Mx = np.float32([[W / sw, 0, -(cx - sw / 2) * W / sw], [0, W / sw, -(cy - shh / 2) * W / sw]])
            img = cv2.warpAffine(base, Mx, (W, H), flags=cv2.INTER_AREA if W / sw < 1 else cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            def sc(lon, lat): X, Y = f(lon, lat); return ((X - (cx - sw / 2)) * W / sw, (Y - (cy - shh / 2)) * W / sw)
            # nombres de países a pirógrafo
            items = []
            for nm, (lo, la) in COUNTRY_LBL.items():
                if nm in ("ISRAEL", "KUWAIT", "QATAR"): continue
                x, y = sc(lo, la)
                if 60 < x < W - 60 and 50 < y < H - 50: items.append((nm, (x, y), 46 * S, "CormorantSC.ttf", "mm", 12 * S))
            img = burn(img, text_mask(W, H, items), 0.62, 4.0)
            # ruta planeada (puntos de lápiz) a Tel Aviv
            if sh.get("dashed", True):
                a_ = sc(*pos(tA)); b_ = sc(*CITY["TEL AVIV"]); L = np.zeros((H, W), np.float32); n = 46
                kd = ramp(ta, 1.6, 3.4)
                for k in range(0, int(n * kd), 2):
                    p0 = (a_[0] + (b_[0] - a_[0]) * k / n, a_[1] + (b_[1] - a_[1]) * k / n); p1 = (a_[0] + (b_[0] - a_[0]) * (k + 1) / n, a_[1] + (b_[1] - a_[1]) * (k + 1) / n)
                    cv2.line(L, (int(p0[0]), int(p0[1])), (int(p1[0]), int(p1[1])), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                img = img * (1 - (L * 0.55)[..., None]) + np.array([0.20, 0.19, 0.18]) * (L * 0.55)[..., None]
            prog = tA + (tB - tA) * ease(ramp(ta, t_in, t_end))
            pts = [sc(*pos(u)) for u in np.linspace(RT[0][0], prog, 160)]
            # nombres de ciudades + chinches
            for nm, tp in pins_t.items():
                k = ramp(ta, tp, tp + 0.25)
                if k <= 0: continue
                x, y = sc(*CITY[nm])
                img = burn(img, text_mask(W, H, [(nm, (x + 30 * S, y - 30 * S), 62 * S, "Anton-Regular.ttf", "ls", 4 * S)]), 0.85 * k, 3.0)
            img = thread(img, pts, 7.0)
            for nm, tp in pins_t.items():
                k = ramp(ta, tp, tp + 0.25)
                if k > 0: x, y = sc(*CITY[nm]); img = pin(img, x, y, 13, k)
            if len(pts) > 1 and prog > tA + 60:                                     # el avioncito de madera en la punta del hilo
                (xa_, ya_), (xb_, yb_) = pts[max(0, len(pts) - 8)], pts[-1]; ang = math.atan2(yb_ - ya_, xb_ - xa_)
                img = plane_icon(img, xb_, yb_, ang, 30)
            flat = img
            img = cv2.warpPerspective(flat, PM, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            hx, hy = pts[-1] if len(pts) > 1 else (W / 2, H / 2)
            v = PM @ np.array([hx, hy, 1.0]); fy = float(np.clip(v[1] / v[2] / H, 0.15, 0.95))
            img = depth_dof(img, np.clip(np.abs(yy - fy) - 0.12, 0, 1).astype(np.float32), 0.0, sh.get("dof", 14))                  # mesa en miniatura: foco en la banda del avión
            img = img * np.array([1.04, 1.0, 0.93])
            last = img
        put(film(last, t, i, "warm", halation=0.25))

def plane_icon(img, x, y, ang, size=30):
    """avioncito tallado visto desde arriba: blanco pintado, borde oscuro, sombra"""
    s = size * S; ca, sa = math.cos(ang), math.sin(ang)
    shape = [(1.0, 0), (0.25, 0.10), (0.05, 0.85), (-0.15, 0.85), (-0.05, 0.10), (-0.6, 0.08), (-0.75, 0.35), (-0.88, 0.35), (-0.82, 0), (-0.88, -0.35), (-0.75, -0.35),
             (-0.6, -0.08), (-0.05, -0.10), (-0.15, -0.85), (0.05, -0.85), (0.25, -0.10)]
    P_ = [(x + (px * ca - py * sa) * s, y + (px * sa + py * ca) * s) for px, py in shape]
    L = np.zeros(img.shape[:2], np.float32); cv2.fillPoly(L, [np.int32([(a * 4, b * 4) for a, b in P_])], 1.0, cv2.LINE_AA, shift=2)
    sd = cv2.GaussianBlur(np.roll(L, (int(9 * S), int(7 * S)), (0, 1)), (0, 0), 4 * S)
    img = img * (1 - (sd * 0.5)[..., None])
    ed = np.clip(L - cv2.erode(L, np.ones((3, 3), np.float32)), 0, 1)
    img = img * (1 - L[..., None]) + np.array([0.95, 0.93, 0.88]) * L[..., None]
    return img * (1 - (ed * 0.6)[..., None])

# ------------------------------------------------------------------ altitud: hilo rojo sobre la tabla
def r_perfilmad(sh, sid, DUR, put):
    BW, BH = int(W * 1.0), int(H * 1.0)
    board = wood_tex(BW, BH, tint=(1.02, 0.99, 0.94))
    tb = load(f"{M}/img/i_tabla.png", size=(BW, BH))                   # la esquina con el carrete de hilo y las chinches de verdad
    cm = np.zeros((BH, BW), np.float32); cm[:int(BH * 0.30), :int(BW * 0.24)] = 1; cm = cv2.GaussianBlur(cm, (0, 0), 30)[..., None]
    board = board * (1 - cm) + tb * cm
    X0, X1, Y0, Y1 = 0.16 * BW, 0.95 * BW, 0.88 * BH, 0.16 * BH          # área del gráfico (alt 0 abajo, 36.000 arriba)
    u0, u1 = tsec(sh.get("win", ["05:16:00", "05:24:00"])[0]), tsec(sh.get("win", ["05:16:00", "05:24:00"])[1])
    AMIN, AMAX = 10000, 36000
    def XY(u, a): return X0 + (X1 - X0) * (u - u0) / (u1 - u0), Y0 + (Y1 - Y0) * (a - AMIN) / (AMAX - AMIN)
    # grilla tallada + rótulos pirograbados (estáticos)
    G = np.zeros((BH, BW), np.float32); items = []
    for a in (10000, 15000, 20000, 25000, 30000, 35000):
        _, y = XY(u0, a); cv2.line(G, (int(X0), int(y)), (int(X1), int(y)), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
        items.append((f"{esn(a)}", (X0 - 18 * S, y), 38 * S, "CormorantSC.ttf", "rm", 2 * S))
    for u in range(u0, u1 + 1, 60):
        x, _ = XY(u, 0); cv2.line(G, (int(x), int(Y0)), (int(x), int(Y0 + 14 * S)), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
        if (u - u0) % 120 == 0: items.append((hms(u + 3 * 3600, False), (x, Y0 + 44 * S), 36 * S, "CormorantSC.ttf", "mm", 1 * S))
    items.append(("ALTITUD EN PIES · FZ1073 · HORA SAUDÍ", (X0, 0.085 * BH), 42 * S, "CormorantSC.ttf", "lm", 5 * S))
    board = carve(board, G, 0.28); board = burn(board, text_mask(BW, BH, items), 0.7, 3.0)
    # coreografía (s del plano): llega a 08:21 · tiembla · un minuto después · CAE
    wk = {str(b): a for a, b in sh.get("wk", [])}
    tT = float(wk.get("__sello", 2.2)); tC = sh.get("t_cae", 7.0)
    KEYS = [(0.0, u0 + 60), (tT, tsec("05:21:00")), (tT + 1.6, tsec("05:21:14")), (tC - 0.5, tsec("05:21:20")), (tC + 1.0, tsec("05:21:34")), (DUR, tsec("05:22:05"))]
    def head_u(ta):
        for (t0, a0), (t1, a1) in zip(KEYS, KEYS[1:]):
            if ta <= t1: k = (ta - t0) / max(1e-6, t1 - t0); return a0 + (a1 - a0) * (k if t0 >= tC - 0.5 else ease(k))
        return KEYS[-1][1]
    pl_w, pl_h = int(520 * S), int(170 * S)
    plaque = wood_tex(pl_w, pl_h, tint=(0.50, 0.34, 0.22), seed=1); plaque[:int(4 * S)] *= 1.25; plaque[-int(5 * S):] *= 0.5; plaque[:, -int(5 * S):] *= 0.6
    last = None; g = np.random.default_rng(3)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        if i % 2 == 0 or last is None:
            ta = stepped(i) / FPS; hu = head_u(ta)
            us = np.linspace(u0 + 60 - 120, hu, 220); us = us[us >= u0]
            trem = 0.0 if ta < tT else (1 - ramp(ta, tT + 1.8, tT + 2.6)) * 1.0 + (0.6 if ta >= tC - 0.5 else 0)
            pts = []
            for k, u in enumerate(us):
                x, y = XY(u, alt_at(u))
                if trem > 0 and u >= tsec("05:20:30"): y += g.normal(0, 2.2 * S * trem)   # el hilo tiembla
                pts.append((x, y))
            img = thread(board.copy(), pts, 6.5, lift=1.0 + 0.6 * trem)
            img = pin(img, *XY(u0 + 60 - 120 if u0 + 60 - 120 >= u0 else u0, alt_at(u0)), 12, 1.0)
            for tp, u in ((tT, tsec("05:21:00")), (tC + 1.0, tsec("05:21:34"))):
                img = pin(img, *XY(u, alt_at(u)), 12, ramp(ta, tp, tp + 0.25))
            hx, hy = pts[-1]
            img = plane_icon(img, hx, hy, math.atan2(pts[-1][1] - pts[max(0, len(pts) - 6)][1], pts[-1][0] - pts[max(0, len(pts) - 6)][0] + 1e-6), 26)
            # tablita de lectura (arriba a la derecha): número pintado que cae con la punta del hilo
            a_now = int(round(alt_at(hu) / 100) * 100)
            px0, py0 = int(BW * 0.20), int(BH * 0.58)
            sd = np.zeros((BH, BW), np.float32); sd[py0:py0 + pl_h, px0:px0 + pl_w] = 1; sd = cv2.GaussianBlur(np.roll(sd, (int(10 * S), int(9 * S)), (0, 1)), (0, 0), 10 * S)
            img = img * (1 - sd[..., None] * 0.5); img[py0:py0 + pl_h, px0:px0 + pl_w] = plaque
            T = text_mask(BW, BH, [(f"{esn(a_now)} FT", (px0 + pl_w / 2, py0 + pl_h * 0.47), 92 * S, "Anton-Regular.ttf", "mm", 2 * S),
                                    (hms(hu + 3 * 3600, True) + " HORA SAUDÍ", (px0 + pl_w / 2, py0 + pl_h * 0.84), 22 * S, "CormorantSC.ttf", "mm", 3 * S)])
            col = np.array([0.96, 0.92, 0.84]) if ta < tC else np.array([1.0, 0.55, 0.42])
            img = img * (1 - T[..., None] * 0.95) + col * T[..., None] * 0.95
            kd = ramp(ta, tC + 1.1, tC + 1.5)
            if kd > 0:                                                    # la caída anotada a lápiz rojo junto al hilo
                xa, ya = XY(tsec("05:21:14"), alt_at(tsec("05:21:14"))); xb, yb = XY(tsec("05:21:34"), alt_at(tsec("05:21:34")))
                L = np.zeros((BH, BW), np.float32); xm = max(xa, xb) + 40 * S
                cv2.line(L, (int(xm), int(ya)), (int(xm), int(ya + (yb - ya) * kd)), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                if kd >= 1:
                    cv2.line(L, (int(xm - 12 * S), int(yb - 18 * S)), (int(xm), int(yb)), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                    cv2.line(L, (int(xm + 12 * S), int(yb - 18 * S)), (int(xm), int(yb)), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                L = np.maximum(L, text_mask(BW, BH, [("−17.400 FT", (xm + 22 * S, (ya + yb) / 2 - 20 * S), 92 * S, "Caveat.ttf", "lm", 0),
                                                      ("en ~30 segundos", (xm + 24 * S, (ya + yb) / 2 + 60 * S), 64 * S, "Caveat.ttf", "lm", 0)]) * kd)
                img = img * (1 - L[..., None] * 0.85) + np.array([0.62, 0.08, 0.06]) * L[..., None] * 0.85
            # cámara: macro pegada a la punta del hilo y se abre cuando cae (revela el pozo)
            z = kv([(0, 1.75), (tT, 1.6), (tC - 0.5, 1.45), (tC + 1.6, 1.0), (DUR, 1.0)], ta)
            pull = kv([(0, 0.0), (tC - 0.5, 0.15), (tC + 1.6, 1.0), (DUR, 1.0)], ta)
            cx = hx * (1 - pull) + BW * 0.52 * pull; cy = hy * (1 - pull) + BH * 0.52 * pull
            cx = min(max(cx, W / (2 * z)), BW - W / (2 * z)); cy = min(max(cy, H / (2 * z)), BH - H / (2 * z))
            Mz = np.float32([[z, 0, W / 2 - z * cx], [0, z, H / 2 - z * cy]])
            img = cv2.warpAffine(img, Mz, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            fx, fy = (hx - cx) * z + W / 2, (hy - cy) * z + H / 2
            img = dof_point(img, fx, fy, strength=9 * (1 - 0.75 * pull), r0=0.25 + 0.5 * pull)
            if ta >= tC - 0.5 and ta < tC + 1.0:                          # sacudón de la caída
                k = math.sin(ta * 70) * 6 * S * (1 - ramp(ta, tC, tC + 1.0))
                img = cv2.warpAffine(img, np.float32([[1, 0, k], [0, 1, k * 0.6]]), (W, H), borderMode=cv2.BORDER_REFLECT)
            last = img
        put(film(last, t, i, "warm", halation=0.25))
