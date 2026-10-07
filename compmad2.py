# compmad2.py — versiones GENÉRICAS (para el video completo) del hilo de altitud sobre la tabla y del mapa de madera.
#   perfil: win, draw[A,B], t_in, t_end, keys[[t, utc]] (coreografía manual), tick, marks[[utc, txt, wk_idx]], hl[a, b, txt], title, act
#   mapa:   cam[[t, lon, lat, span]], draw[A,B], t_in, t_end, cities, countries, labels, dashed, mark[lon, lat, txt], act
import os, math, json, numpy as np, cv2
from PIL import Image, ImageDraw
from cine import W, H, S, load, film, depth_dof, ease, ramp
from comp7 import tsec, alt_at, RUTA, CITY, COUNTRY_LBL, _merc, esn, hms, wkt
from compmad import (M, FPS, kv, wood_tex, text_mask, burn, carve, thread, pin, plane_icon, dof_point, stepped, BURN, REDT)
import comp8

def _u(x): return tsec(x if x.count(":") == 2 else x + ":00")

# ------------------------------------------------------------------ ALTITUD: hilo rojo sobre la tabla de arce
_BOARD = {}
def board_base(BW, BH):
    if (BW, BH) not in _BOARD:
        board = wood_tex(BW, BH, tint=(1.02, 0.99, 0.94))
        tb = load(f"{M}/img/i_tabla.png", size=(BW, BH))                   # esquina con el carrete de hilo y las chinches de verdad
        cm = np.zeros((BH, BW), np.float32); cm[:int(BH * 0.30), :int(BW * 0.24)] = 1; cm = cv2.GaussianBlur(cm, (0, 0), 30)[..., None]
        _BOARD[(BW, BH)] = board * (1 - cm) + tb * cm
    return _BOARD[(BW, BH)].copy()

def r_perfilmad(sh, sid, DUR, put):
    BW, BH = W, H
    u0, u1 = _u(sh.get("win", ["05:16:00", "05:24:00"])[0]), _u(sh.get("win", ["05:16:00", "05:24:00"])[1])
    dA, dB = _u(sh.get("draw", ["05:20:00", "05:24:00"])[0]), _u(sh.get("draw", ["05:20:00", "05:24:00"])[1])
    t_in, t_end = sh.get("t_in", 0.4), sh.get("t_end", DUR * 0.85)
    us_all = np.linspace(u0, u1, 900); alts = [alt_at(u) for u in us_all]
    AMAX = 36000 if max(alts) <= 34500 else 40000
    AMIN = 0 if min(alts) < 9000 else 10000
    X0, X1, Y0, Y1 = 0.16 * BW, 0.95 * BW, 0.86 * BH, 0.18 * BH
    def XY(u, a): return X0 + (X1 - X0) * (u - u0) / (u1 - u0), Y0 + (Y1 - Y0) * (a - AMIN) / (AMAX - AMIN)
    board = board_base(BW, BH)
    G = np.zeros((BH, BW), np.float32); items = []
    step = 5000 if AMAX - AMIN <= 26000 else 10000
    for a in range(AMIN, AMAX + 1, step):
        _, y = XY(u0, a); cv2.line(G, (int(X0), int(y)), (int(X1), int(y)), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
        items.append((esn(a), (X0 - 18 * S, y), 36 * S, "CormorantSC.ttf", "rm", 2 * S))
    tick = sh.get("tick", 60 if u1 - u0 <= 900 else (300 if u1 - u0 <= 3600 else 1800))
    lab_every = tick * max(1, int(round((u1 - u0) / tick / 6)))
    first = int(math.ceil(u0 / tick) * tick)
    for u in range(first, u1 + 1, tick):
        x, _ = XY(u, AMIN); cv2.line(G, (int(x), int(Y0)), (int(x), int(Y0 + 14 * S)), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
        if (u - first) % lab_every == 0: items.append((hms(u + 3 * 3600, False), (x, Y0 + 42 * S), 34 * S, "CormorantSC.ttf", "mm", 1 * S))
    title = (sh.get("title") or "Altitud en pies · FZ1073 · hora saudí").upper()
    items.append((title, (X0, 0.085 * BH), 40 * S, "CormorantSC.ttf", "lm", 5 * S))
    board = carve(board, G, 0.28); board = burn(board, text_mask(BW, BH, items), 0.7, 3.0)
    KEYS = [(float(a), _u(b)) for a, b in sh["keys"]] if sh.get("keys") else None
    def head_u(ta):
        if KEYS:
            for (t0, a0), (t1, a1) in zip(KEYS, KEYS[1:]):
                if ta <= t1: return a0 + (a1 - a0) * ease((ta - t0) / max(1e-6, t1 - t0))
            return KEYS[-1][1]
        return dA + (dB - dA) * ease(ramp(ta, t_in, t_end)) if dB > dA else dB
    marks = sh.get("marks") or []
    mt = [wkt(sh, m[2], None) if (len(m) > 2 and m[2] is not None) else None for m in marks]
    hl = sh.get("hl"); FALL0, FALL1 = tsec("05:20:55"), tsec("05:21:40")
    pl_w, pl_h = int(500 * S), int(160 * S)
    plaque = wood_tex(pl_w, pl_h, tint=(0.50, 0.34, 0.22), seed=1); plaque[:int(4 * S)] *= 1.25; plaque[-int(5 * S):] *= 0.5; plaque[:, -int(5 * S):] *= 0.6
    wide = (u1 - u0) > 1500
    last = None; g = np.random.default_rng(abs(hash(sid)) % 999)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        if i % 2 == 0 or last is None:
            ta = stepped(i) / FPS; hu = head_u(ta)
            start = max(u0, min(dA, hu) - (0 if wide else 240)) if not KEYS else max(u0, KEYS[0][1] - 120)
            us = np.linspace(start, hu, 360 if wide else 240); us = us[us >= u0]
            pts = []
            for u in us:
                x, y = XY(u, alt_at(u))
                if (not wide) and FALL0 <= u <= FALL1 and FALL0 <= hu <= FALL1 + 20: y += g.normal(0, 2.4 * S)       # el hilo tiembla en la caída
                pts.append((x, y))
            img = thread(board.copy(), pts, 6.5)
            img = pin(img, *pts[0], 12, 1.0) if pts else img
            for j, m in enumerate(marks):                                         # chinche + nota pirograbada cuando la punta llega (o en su palabra)
                um = _u(m[0]); tm = mt[j]
                show = (ta >= tm) if tm is not None else (hu >= um)
                if not show or um < u0 or um > u1: continue
                x, y = XY(um, alt_at(um)); k = ramp(ta, tm, tm + 0.3) if tm is not None else 1.0
                img = pin(img, x, y, 12, k)
                if m[1]:
                    up = y > BH * 0.45
                    img = burn(img, text_mask(BW, BH, [(m[1], (x, y + (-46 if up else 52) * S), 36 * S, "Anton-Regular.ttf", "mm", 2 * S)]), 0.88 * k, 2.5)
            if hl and hu >= _u(hl[1]):                                            # la caída anotada a lápiz rojo
                xa, ya = XY(_u(hl[0]), alt_at(_u(hl[0]))); xb, yb = XY(_u(hl[1]), alt_at(_u(hl[1])))
                kd = ramp(ta, (KEYS[-2][0] if KEYS else t_end * 0.8) + 0.2, (KEYS[-2][0] if KEYS else t_end * 0.8) + 0.6) if not wide else 1.0
                if kd > 0:
                    L = np.zeros((BH, BW), np.float32); xm = max(xa, xb) + 40 * S; yt = min(ya, yb)
                    cv2.line(L, (int(xm), int(yt)), (int(xm), int(yt + abs(yb - ya) * kd)), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                    if kd >= 1:
                        for sgn in (-1, 1): cv2.line(L, (int(xm + sgn * 12 * S), int(yt + abs(yb - ya) - 18 * S)), (int(xm), int(yt + abs(yb - ya))), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                    tx = hl[2].replace(" EN ", "\n").split("\n")
                    L = np.maximum(L, text_mask(BW, BH, [(tx[0], (xm + 22 * S, (ya + yb) / 2 - 20 * S), 80 * S, "Caveat.ttf", "lm", 0)] +
                                                ([("en " + tx[1].lower(), (xm + 24 * S, (ya + yb) / 2 + 50 * S), 56 * S, "Caveat.ttf", "lm", 0)] if len(tx) > 1 else [])) * kd)
                    img = img * (1 - L[..., None] * 0.85) + np.array([0.62, 0.08, 0.06]) * L[..., None] * 0.85
            hx, hy = pts[-1] if pts else XY(hu, alt_at(hu))
            if len(pts) > 6:
                img = plane_icon(img, hx, hy, math.atan2(pts[-1][1] - pts[-6][1], pts[-1][0] - pts[-6][0] + 1e-6), 26)
            a_now = int(round(alt_at(hu) / 100) * 100); px0, py0 = int(BW * 0.20), int(BH * 0.60)
            if hy > BH * 0.50 and hx < BW * 0.48: px0, py0 = int(BW * 0.62), int(BH * 0.20)
            sd = np.zeros((BH, BW), np.float32); sd[py0:py0 + pl_h, px0:px0 + pl_w] = 1; sd = cv2.GaussianBlur(np.roll(sd, (int(10 * S), int(9 * S)), (0, 1)), (0, 0), 10 * S)
            img = img * (1 - sd[..., None] * 0.5); img[py0:py0 + pl_h, px0:px0 + pl_w] = plaque
            T = text_mask(BW, BH, [(f"{esn(a_now)} FT", (px0 + pl_w / 2, py0 + pl_h * 0.46), 88 * S, "Anton-Regular.ttf", "mm", 2 * S),
                                    (hms(hu + 3 * 3600, True) + " HORA SAUDÍ", (px0 + pl_w / 2, py0 + pl_h * 0.84), 24 * S, "CormorantSC.ttf", "mm", 3 * S)])
            vs = (alt_at(hu + 2) - alt_at(hu - 2)) / 4 * 60
            col = np.array([1.0, 0.55, 0.42]) if vs < -3000 else np.array([0.96, 0.92, 0.84])
            img = img * (1 - T[..., None] * 0.95) + col * T[..., None] * 0.95
            if wide: z, cx, cy = 1.0 + 0.04 * ease(ta / DUR), BW / 2, BH / 2
            else:
                pull = ease(ramp(ta, DUR * 0.55, DUR * 0.9)) if not KEYS else ease(ramp(ta, KEYS[-3][0], KEYS[-2][0] + 0.6))
                z = 1.6 - 0.6 * pull; cx = hx * (1 - pull) + BW * 0.52 * pull; cy = hy * (1 - pull) + BH * 0.52 * pull
            cx = min(max(cx, W / (2 * z)), BW - W / (2 * z)); cy = min(max(cy, H / (2 * z)), BH - H / (2 * z))
            img = cv2.warpAffine(img, np.float32([[z, 0, W / 2 - z * cx], [0, z, H / 2 - z * cy]]), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            fx, fy = (hx - cx) * z + W / 2, (hy - cy) * z + H / 2
            if not wide: img = dof_point(img, fx, fy, strength=8 * max(0.25, (z - 1) / 0.6), r0=0.3)
            img = comp8.tone(img, sh.get("act"), ta)
            last = img
        put(film(last, t, i, "warm", halation=0.2))

# ------------------------------------------------------------------ MAPA de madera (arce = tierra, nogal = mar, pirograbado), base de alta resolución
_MAPW = {}
LON0, LON1, LAT0, LAT1 = 30.0, 60.0, 21.0, 36.5
def tile_tex(w, h, tint, seed=0, scale=1.6):
    tb = load(f"{M}/img/i_tabla.png"); th, tw = tb.shape[:2]
    crop = tb[int(th * 0.30):, int(tw * 0.22):]
    if seed: crop = crop[::-1, ::-1]
    c = cv2.resize(crop, (int(crop.shape[1] * scale), int(crop.shape[0] * scale)), interpolation=cv2.INTER_CUBIC)
    c2 = np.concatenate([c, c[:, ::-1]], 1); c4 = np.concatenate([c2, c2[::-1]], 0)
    reps = (h // c4.shape[0] + 1, w // c4.shape[1] + 1)
    return (np.tile(c4, (reps[0], reps[1], 1))[:h, :w] * np.array(tint)).astype(np.float32)
def map_wood():
    if "img" in _MAPW: return _MAPW["img"], _MAPW["f"]
    PXW = 9000; x0, y0 = _merc(LON0, LAT0); x1, y1 = _merc(LON1, LAT1); PXH = int(PXW * (y1 - y0) / (x1 - x0))
    def f(lon, lat): x, y = _merc(lon, lat); return (x - x0) / (x1 - x0) * PXW, (y1 - y) / (y1 - y0) * PXH
    path = f"{M}/fuentes/mapamad_hd.png"
    if not os.path.exists(path):
        gj = json.load(open(f"{M}/fuentes/ne10_countries.geojson", encoding="utf8"))
        land = Image.new("L", (PXW, PXH), 0); bord = Image.new("L", (PXW, PXH), 0); dl = ImageDraw.Draw(land); db = ImageDraw.Draw(bord)
        for ft in gj["features"]:
            g = ft["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
            for pl in polys:
                ring = [f(lon, lat) for lon, lat in pl[0]]
                if max(p[0] for p in ring) < 0 or min(p[0] for p in ring) > PXW: continue
                dl.polygon(ring, fill=255); db.line(ring + ring[:1], fill=255, width=5)
                for hole in pl[1:]: dl.polygon([f(lon, lat) for lon, lat in hole], fill=0)
        Lm = (np.asarray(land) > 0).astype(np.float32); Bm = np.asarray(bord).astype(np.float32) / 255 * Lm
        dist = cv2.distanceTransform((Lm > 0).astype(np.uint8), cv2.DIST_L2, 5)
        hgt = cv2.GaussianBlur((np.clip(dist / 55.0, 0, 1) ** 0.5 * Lm).astype(np.float32), (0, 0), 4)
        gy, gx = np.gradient(hgt * 30); shade = np.clip(0.5 - (gx * -0.7 + gy * -0.7) * 1.8, 0, 1)[..., None]; del gx, gy, hgt, dist
        lm = Lm[..., None]
        img = lm * tile_tex(PXW, PXH, (1.04, 1.0, 0.94)) * (0.78 + 0.44 * shade); del shade
        img += (1 - lm) * tile_tex(PXW, PXH, (0.60, 0.42, 0.28), seed=1)
        sd = np.roll(np.roll(cv2.GaussianBlur(Lm, (0, 0), 16), 14, 0), 12, 1)
        img *= (1 - ((1 - Lm) * sd * 0.35)[..., None]); del sd
        bb = cv2.GaussianBlur(Bm, (0, 0), 1.2); hal = cv2.GaussianBlur(Bm, (0, 0), 6) * 0.55
        img *= (1 - (hal * 0.30)[..., None] * (1 - np.array([0.55, 0.42, 0.30], np.float32)))
        img = img * (1 - (bb * 0.55)[..., None]) + np.array([0.16, 0.075, 0.03], np.float32) * (bb * 0.55)[..., None]
        Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(path); del img
    _MAPW["img"] = np.asarray(Image.open(path).convert("RGB")); _MAPW["f"] = f
    return _MAPW["img"], f

def r_mapamad(sh, sid, DUR, put):
    base, f = map_wood()
    cams = sh.get("cam", [[0, 41.0, 28.5, 22.0]])
    tA, tB = _u(sh.get("draw", ["03:05", "05:21"])[0]), _u(sh.get("draw", ["03:05", "05:21"])[1])
    RT = [(tsec(a + ":00"), lon, lat) for a, lon, lat in RUTA]
    def pos(u):
        for (t0, a0, b0), (t1, a1, b1) in zip(RT, RT[1:]):
            if t0 <= u <= t1: k = (u - t0) / max(1, t1 - t0); return a0 + (a1 - a0) * k, b0 + (b1 - b0) * k
        return (RT[-1][1], RT[-1][2]) if u > RT[-1][0] else (RT[0][1], RT[0][2])
    t_in, t_end = sh.get("t_in", 0.4), sh.get("t_end", DUR * 0.72)
    cities = sh.get("cities", ["DUBÁI", "TEL AVIV", "TABUK"])
    pins_t = sh.get("pins_t") or {c: t_in + 0.35 * k for k, c in enumerate(cities)}
    LBL = dict(COUNTRY_LBL, **{k: tuple(v) for k, v in (sh.get("labels") or {}).items()})
    countries = sh.get("countries", list(COUNTRY_LBL))
    TILT = 0.13
    src = np.float32([[0, 0], [W, 0], [W, H], [0, H]]); dst = np.float32([[W * TILT, -H * 0.05], [W * (1 - TILT), -H * 0.05], [W * 1.03, H * 1.02], [-W * 0.03, H * 1.02]])
    PM = cv2.getPerspectiveTransform(src, dst)
    yy = np.linspace(0, 1, H, dtype=np.float32)[:, None] * np.ones((1, W), np.float32)
    last = None
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        if i % 2 == 0 or last is None:
            ta = stepped(i) / FPS
            lon_c = kv([(c[0], c[1]) for c in cams], ta) if len(cams) > 1 else cams[0][1]
            lat_c = kv([(c[0], c[2]) for c in cams], ta) if len(cams) > 1 else cams[0][2]
            span = (kv([(c[0], c[3]) for c in cams], ta) if len(cams) > 1 else cams[0][3]) * 1.12
            cx, cy = f(lon_c, lat_c); xa, _ = f(lon_c - span / 2, lat_c); xb, _ = f(lon_c + span / 2, lat_c); sw = xb - xa; shh = sw * H / W
            Mx = np.float32([[W / sw, 0, -(cx - sw / 2) * W / sw], [0, W / sw, -(cy - shh / 2) * W / sw]])
            img = cv2.warpAffine(base, Mx, (W, H), flags=cv2.INTER_AREA if W / sw < 1 else cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT).astype(np.float32) / 255
            def sc(lon, lat): X, Y = f(lon, lat); return ((X - (cx - sw / 2)) * W / sw, (Y - (cy - shh / 2)) * W / sw)
            items = []
            for nm in countries:
                if nm not in LBL or (nm in ("ISRAEL", "KUWAIT", "QATAR") and span > 14): continue
                x, y = sc(*LBL[nm])
                if 80 < x < W - 80 and 60 < y < H - 60: items.append((nm, (x, y), (54 if span < 10 else 46) * S, "CormorantSC.ttf", "mm", 12 * S))
            img = burn(img, text_mask(W, H, items), 0.62, 4.0)
            if sh.get("dashed"):
                a_ = sc(*pos(tA)); b_ = sc(*CITY["TEL AVIV"]); L = np.zeros((H, W), np.float32); n = 46; kd = ramp(ta, t_in + 0.8, t_in + 2.6)
                for k in range(0, int(n * kd), 2):
                    p0 = (a_[0] + (b_[0] - a_[0]) * k / n, a_[1] + (b_[1] - a_[1]) * k / n); p1 = (a_[0] + (b_[0] - a_[0]) * (k + 1) / n, a_[1] + (b_[1] - a_[1]) * (k + 1) / n)
                    cv2.line(L, (int(p0[0]), int(p0[1])), (int(p1[0]), int(p1[1])), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                img = img * (1 - (L * 0.55)[..., None]) + np.array([0.20, 0.19, 0.18]) * (L * 0.55)[..., None]
            prog = tA + (tB - tA) * ease(ramp(ta, t_in, t_end)) if tB > tA else tB
            pts = [sc(*pos(u)) for u in np.linspace(RT[0][0], prog, 220)]
            for nm in cities:
                k = ramp(ta, pins_t.get(nm, t_in), pins_t.get(nm, t_in) + 0.25)
                if k > 0:
                    x, y = sc(*CITY[nm]); img = burn(img, text_mask(W, H, [(nm, (x + 30 * S, y - 30 * S), 62 * S, "Anton-Regular.ttf", "ls", 4 * S)]), 0.85 * k, 3.0)
            img = thread(img, pts, 7.0)
            for nm in cities:
                k = ramp(ta, pins_t.get(nm, t_in), pins_t.get(nm, t_in) + 0.25)
                if k > 0: x, y = sc(*CITY[nm]); img = pin(img, x, y, 13, k)
            if sh.get("mark"):
                lo, la, tx = sh["mark"]; tm = wkt(sh, 0, 0.8); k = ramp(ta, tm, tm + 0.4)
                if k > 0:
                    x, y = sc(lo, la); pr = (ta * 1.3) % 1
                    R_ = np.zeros((H, W), np.float32); cv2.circle(R_, (int(x), int(y)), int((16 + 60 * pr) * S), 1.0, max(1, int(4 * (1 - pr) * S)), cv2.LINE_AA)
                    img = img * (1 - R_[..., None] * k) + REDT * R_[..., None] * k; img = pin(img, x, y, 14, k, col=np.array([0.75, 0.12, 0.08]))
                    img = burn(img, text_mask(W, H, [(tx, (x, y + 70 * S), 44 * S, "Anton-Regular.ttf", "mm", 3 * S)]), 0.9 * k, 3.0)
            if len(pts) > 8 and prog > RT[0][0] + 60:
                (xa_, ya_), (xb_, yb_) = pts[-8], pts[-1]; img = plane_icon(img, xb_, yb_, math.atan2(yb_ - ya_, xb_ - xa_), 30)
            img = cv2.warpPerspective(img, PM, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
            hx, hy = pts[-1] if len(pts) > 1 else (W / 2, H / 2)
            v = PM @ np.array([hx, hy, 1.0]); fy = float(np.clip(v[1] / v[2] / H, 0.25, 0.85))
            img = depth_dof(img, np.clip(np.abs(yy - fy) - 0.14, 0, 1).astype(np.float32), 0.0, sh.get("dof", 12))
            img = comp8.tone(img, sh.get("act"), ta)
            last = img
        put(film(last, t, i, "warm", halation=0.2))
