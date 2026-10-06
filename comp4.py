# comp4.py — componentes que EXPLICAN (pasada 2 de tgagote, oct-2026)
#   r_capitulo    tarjeta de capítulo: número romano + título tallados en madera; la gubia avanza y saltan virutas
#   r_microscopio vista de microscopio: glóbulos rojos, calcio, red de fibrina que se teje (o no) — modos coagula/citrato/grumos/libre
#   r_lamina      lámina técnica de patente que se dibuja sola, pieza por pieza, sincronizada con la palabra (wk) — "aparato" / "brazo"
#   r_carrera     tres carriles (ciudades) sobre un calendario que avanza; los hitos se encienden cuando pasa el cabezal
#   r_mapazoom    acercamiento de mapa a un punto, con anillo que late y rótulo
import os, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from cine import W, H, S, load, xform, blur, over, fbm, film, warp_depth, depth_dof, ease, ramp
from comp import text_rgba, keyed, depthmap, M, FONTS
FPS = 24
F_HAND = f"{M}/fonts/Caveat.ttf"
def font(k, px): return ImageFont.truetype(FONTS.get(k, k), max(8, int(px)))

def wood_bg(w, h, seed=5, dark=0.55):
    n = cv2.resize(fbm(96, 54, seed, base=3), (w, h)); yy = np.arange(h)[:, None] / h; xx = np.arange(w)[None, :] / w
    g = 0.5 + 0.5 * np.sin((yy * 7 + n * 1.6 + xx * 0.3) * 6.28 * 4)
    b = np.dstack([0.36 + 0.10 * g, 0.22 + 0.07 * g, 0.12 + 0.04 * g]) * dark / 0.55
    v = 1 - 0.55 * (((xx - 0.5) / 0.75) ** 2 + ((yy - 0.5) / 0.7) ** 2)
    return np.clip(b * v[..., None], 0, 1).astype(np.float32)

def text_mask(w, h, lines):
    """lines = [(texto, fuente, px, (x,y) fracción, anchor)] -> máscara L float"""
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im)
    for t, f, px, (x, y), an in lines: d.text((x * w, y * h), t, font=font(f, px * w / 1920), fill=255, anchor=an)
    return np.asarray(im).astype(np.float32) / 255

# ------------------------------------------------------------------ tarjeta de capítulo
def r_capitulo(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); wp = f"{M}/img/{sh.get('src', 'x_madera')}.png"
    bg = load(wp, size=(W, H)) * 0.62 if os.path.exists(wp) else wood_bg(W, H, seed=hash(sid) % 97 + 3)
    yy_, xx_ = np.mgrid[0:H, 0:W] / np.array([H, W])[:, None, None]; bg = bg * (1 - 0.5 * (((xx_ - 0.5) / 0.8) ** 2 + ((yy_ - 0.5) / 0.75) ** 2))[..., None]
    num, title = sh.get("num", "I"), sh.get("title", "")
    Mk = text_mask(W, H, [(num, "PF", 130, (0.5, 0.33), "mm"), (title, "AN", 160, (0.5, 0.54), "mm")])
    if sh.get("sub"): Mk = np.maximum(Mk, text_mask(W, H, [(sh["sub"], "SC", 40, (0.5, 0.70), "mm")]))
    ys, xs = np.nonzero(Mk > 0.3); x0, x1 = (xs.min(), xs.max()) if len(xs) else (0, W)
    g = np.random.default_rng(7); chips = []
    lum = (0.5 + 0.5 * np.sin(np.arange(W)[None, :] / (9 * S) + cv2.resize(fbm(64, 36, 4), (W, H)) * 4)).astype(np.float32)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        cut = x0 + (x1 - x0 + 40 * S) * ease(ramp(t, 0.25, DUR * 0.62))          # dónde va la gubia
        rev = np.clip((cut - np.arange(W)[None, :]) / (30 * S), 0, 1)
        m = Mk * rev
        inner = np.dstack([0.20 + 0.10 * lum, 0.12 + 0.06 * lum, 0.06 + 0.03 * lum])    # madera clara del corte, con fibra
        img = bg.copy()
        sh_ = np.roll(m, (int(4 * S), int(3 * S)), (0, 1)); hl = np.roll(m, (-int(2 * S), -int(2 * S)), (0, 1))
        img = img * (1 - m[..., None]) + (inner * 2.2) * m[..., None]
        img = img * (1 - (sh_ * (1 - m))[..., None] * 0.5) + ((hl * (1 - m)) * 0.10)[..., None]
        if t < DUR * 0.66 and i % 2 == 0:                                         # virutas que saltan del filo
            for _ in range(3): chips.append([cut, H * (0.40 + 0.2 * g.random()), g.normal(-60, 40) * S, g.normal(-220, 80) * S, t, g.random()])
        lay = np.zeros((H, W), np.float32)
        for c in chips:
            a = t - c[4]
            if a < 0 or a > 1.2: continue
            x = c[0] + c[2] * a; y = c[1] + c[3] * a + 500 * S * a * a
            cv2.ellipse(lay, (int(x), int(y)), (int((4 + 5 * c[5]) * S), int(2 * S)), int(c[5] * 360 + a * 400), 0, 360, 1.0 - a / 1.2, -1, cv2.LINE_AA)
        img = img + lay[..., None] * np.array([0.75, 0.55, 0.32]) * 0.9
        img = xform(img, 1.0 + 0.04 * u)
        put(film(img, t, i, "warm", halation=0.2))

# ------------------------------------------------------------------ microscopio
def _rbc_sprite(r, squash, rot):
    s = int(r * 2.6); yy, xx = np.mgrid[0:s, 0:s].astype(np.float32) - s / 2
    c, si = math.cos(rot), math.sin(rot); x = (xx * c + yy * si); y = (-xx * si + yy * c) / max(0.35, squash)
    d = np.sqrt(x * x + y * y) / r
    a = np.clip((1.0 - d) * r / 2.0, 0, 1)
    prof = 0.62 + 0.38 * np.exp(-((d - 0.72) / 0.22) ** 2) - 0.18 * np.exp(-(d / 0.35) ** 2)        # bicóncavo: aro claro, centro hundido
    rgb = np.dstack([0.78 * prof, 0.10 * prof, 0.09 * prof]) + np.dstack([0.25, 0.06, 0.05]) * np.exp(-((d - 0.55) / 0.15) ** 2)[..., None] * 0.4
    return np.dstack([np.clip(rgb, 0, 1), a]).astype(np.float32)
def _blit(img, spr, cx, cy, alpha=1.0, sig=0.0):
    if sig > 0.4: spr = np.dstack([cv2.GaussianBlur(spr[..., k], (0, 0), sig) for k in range(4)])
    h, w = spr.shape[:2]; x0, y0 = int(cx - w / 2), int(cy - h / 2)
    xs, ys, xe, ye = max(0, x0), max(0, y0), min(W, x0 + w), min(H, y0 + h)
    if xe <= xs or ye <= ys: return
    s_ = spr[ys - y0:ye - y0, xs - x0:xe - x0]; a = s_[..., 3:] * alpha
    img[ys:ye, xs:xe] = img[ys:ye, xs:xe] * (1 - a) + s_[..., :3] * a
def r_microscopio(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "coagula"); g = np.random.default_rng(sh.get("seed", 11))
    R = H * 0.47; C = (W / 2, H / 2)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); rr = np.hypot(xx - C[0], yy - C[1]) / R
    plasma = np.dstack([0.93 - 0.12 * rr, 0.83 - 0.12 * rr, 0.58 - 0.10 * rr]) + (cv2.resize(fbm(160, 90, 9), (W, H)) * 0.06)[..., None]
    aperture = np.clip((1 - rr) * R / (6 * S), 0, 1)[..., None]
    n = sh.get("cells", 30)
    P = np.c_[C[0] + (g.random(n) - 0.5) * 2 * R, C[1] + (g.random(n) - 0.5) * 2 * R]
    V = np.c_[g.normal(26, 10, n), g.normal(4, 8, n)] * S
    Z = g.random(n)                                                    # profundidad: los lejanos van desenfocados y más chicos
    SPR = [_rbc_sprite(44 * S * (0.75 + 0.4 * z), 0.45 + 0.55 * g.random(), g.random() * 6.28) for z in Z]
    ni = 14; I = np.c_[C[0] + (g.random(ni) - 0.5) * 1.6 * R, C[1] + (g.random(ni) - 0.5) * 1.6 * R]   # iones de calcio
    # red de fibrina: hilos entre puntos, nacen de los iones
    F = []
    for k in range(70):
        a = I[k % ni] + g.normal(0, 40, 2) * S; ang = g.random() * 6.28; L_ = (120 + 260 * g.random()) * S
        F.append((a, a + L_ * np.array([math.cos(ang), math.sin(ang)]), 0.18 + 0.5 * g.random(), k % ni))
    cit = np.c_[np.full(ni, C[0] - R * 1.3) - g.random(ni) * 200 * S, I[:, 1] + g.normal(0, 30, ni) * S]
    grab = np.full(ni, -1.0)
    clusters = np.c_[C[0] + (g.random(5) - 0.5) * R, C[1] + (g.random(5) - 0.5) * R]; cid = g.integers(0, 5, n)
    lab = sh.get("labels", [])
    for i in range(N):
        t = i / FPS; u = t / DUR
        img = plasma.copy()
        net = ease(ramp(t, DUR * 0.25, DUR * 0.8)) if mode == "coagula" else 0.0
        # citrato: entra y atrapa a cada ion
        if mode == "citrato":
            for k in range(ni):
                if grab[k] < 0:
                    tgt = I[k]; d = tgt - cit[k]; dist = np.hypot(*d)
                    cit[k] += d / max(dist, 1) * min(dist, (380 + 140 * (k % 3)) * S / FPS) if t > DUR * 0.18 + 0.12 * k * DUR / ni else 0
                    if dist < 10 * S: grab[k] = t
                else: cit[k] = I[k]
        # glóbulos: derivan; con red se frenan; con grumos se juntan
        slow = 1 - 0.92 * net
        for k in range(n):
            if mode == "grumos":
                pull = ease(ramp(t, DUR * 0.2, DUR * 0.7)); tgt = clusters[cid[k]] + np.array([math.cos(k), math.sin(k * 1.7)]) * 30 * S * (1 + k % 3)
                P[k] += ((tgt - P[k]) * 0.06 * pull + V[k] / FPS * (1 - pull))
            else:
                P[k] += V[k] / FPS * slow + np.array([math.sin(t * 1.3 + k), math.cos(t * 1.1 + k * 0.7)]) * 0.6 * S
            if P[k][0] > C[0] + R * 1.15: P[k][0] -= 2.3 * R
        for k in np.argsort(Z):                                         # de atrás hacia adelante
            _blit(img, SPR[k], P[k][0], P[k][1], 0.92, sig=(1 - Z[k]) * 3.0 * S)
        # iones de calcio
        lay = np.zeros((H, W), np.float32); spark = np.zeros((H, W), np.float32)
        for k in range(ni):
            dim = 0.25 if (mode == "citrato" and grab[k] >= 0) else 1.0
            I[k] += np.array([math.sin(t * 2 + k), math.cos(t * 1.7 + k)]) * 0.8 * S
            cv2.circle(lay, (int(I[k][0]), int(I[k][1])), int(8 * S), dim, -1, cv2.LINE_AA)
        # hilos de fibrina
        fl = np.zeros((H, W), np.float32)
        if mode in ("coagula", "citrato"):
            for a, b, st, ik in F:
                if mode == "citrato":
                    pr = ramp(t, DUR * st * 0.6, DUR * st * 0.6 + 0.6) * (0.25 if grab[ik] < 0 else 0) * (1 - ramp(t, DUR * 0.45, DUR * 0.6))
                else:
                    pr = ramp(t, DUR * (0.22 + st * 0.6), DUR * (0.22 + st * 0.6) + 0.9)
                if pr <= 0: continue
                e = a + (b - a) * pr
                cv2.line(fl, (int(a[0]), int(a[1])), (int(e[0]), int(e[1])), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                if pr < 1: cv2.circle(spark, (int(e[0]), int(e[1])), int(5 * S), 1.0, -1, cv2.LINE_AA)
        fl = cv2.GaussianBlur(fl, (0, 0), 0.7 * S)
        img = img * (1 - fl[..., None] * 0.55) + fl[..., None] * np.array([0.98, 0.95, 0.80]) * 0.55 + cv2.GaussianBlur(fl, (0, 0), 4 * S)[..., None] * np.array([1.0, 0.9, 0.6]) * 0.25
        img = img + cv2.GaussianBlur(lay, (0, 0), 3 * S)[..., None] * np.array([0.35, 0.85, 1.0]) * 0.9 + lay[..., None] * np.array([0.6, 0.95, 1.0]) * 0.5
        img = img + cv2.GaussianBlur(spark, (0, 0), 6 * S)[..., None] * np.array([1.0, 0.95, 0.7]) * 0.9
        if mode == "citrato":                                          # moléculas de citrato: estrella de tres brazos dorada
            cl = np.zeros((H, W), np.float32)
            for k in range(ni):
                x, y = cit[k]
                for j in range(3):
                    an = j * 2.094 + t * 1.5
                    cv2.line(cl, (int(x), int(y)), (int(x + 16 * S * math.cos(an)), int(y + 16 * S * math.sin(an))), 1.0, max(2, int(4 * S)), cv2.LINE_AA)
            img = img * (1 - cl[..., None] * 0.8) + cl[..., None] * np.array([1.0, 0.78, 0.25]) + cv2.GaussianBlur(cl, (0, 0), 5 * S)[..., None] * np.array([0.6, 0.45, 0.1]) * 0.6
        # ocular: borde negro, viñeta, leve desenfoque en el borde
        img = img * aperture + (1 - aperture) * 0.015
        img = img * (1 - 0.35 * np.clip(rr - 0.75, 0, 1)[..., None] * 4)
        # rótulos con línea guía: [texto, desde_frac, x, y]
        for txt, tin, lx, ly in lab:
            a = ramp(u, tin, tin + 0.06)
            if a <= 0: continue
            ax, ay = lx * W, ly * H; tx, ty = ax + (180 if lx < 0.5 else -180) * S, ay - 120 * S
            ln = np.zeros((H, W), np.float32); cv2.line(ln, (int(ax), int(ay)), (int(tx), int(ty)), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
            cv2.circle(ln, (int(ax), int(ay)), int(5 * S), 1.0, -1, cv2.LINE_AA)
            img = img * (1 - ln[..., None] * a) + ln[..., None] * a
            T = text_rgba(W, H, txt, "SC", 54, (tx / W, ty / H - 0.03), (255, 255, 255), 0.08); T[..., 3] *= a
            img = img * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 4 * S)[..., None] * 0.6); img = over(img, T)
        if sh.get("title"):
            T = text_rgba(W, H, sh["title"], "SC", 40, (0.5, 0.035), (235, 228, 210), 0.2); T[..., 3] *= ramp(t, 0.2, 0.8) * 0.8; img = over(img, T)
        put(film(img, t, i, "cool" if False else "warm", halation=0.15, grain=0.025))

# ------------------------------------------------------------------ lámina técnica que se dibuja sola
def _arc(cx, cy, rx, ry, a0, a1, n=40): return [(cx + rx * math.cos(a), cy + ry * math.sin(a)) for a in np.linspace(a0, a1, n)]
def _drawing(name):
    """piezas: [(nombre_rótulo, [polilíneas], (x_rótulo, y_rótulo), (x_punta, y_punta))] en un lienzo 1600x900"""
    if name == "aparato":
        bott = [[(690, 330), (690, 700), (700, 718), (900, 718), (910, 700), (910, 330), (880, 300), (840, 290), (840, 240)], [(760, 240), (760, 290), (720, 300), (690, 330)],
                [(748, 232), (852, 232), (852, 248), (748, 248), (748, 232)]] + [[(690, y), (712 if k % 2 else 724, y)] for k, y in enumerate(range(680, 360, -40))]
        tubes = [[(780, 232), (780, 170), (770, 150), (740, 140), (440, 140), (400, 160), (330, 300)], [(820, 232), (820, 170), (830, 150), (860, 140), (1150, 140), (1185, 165), (1200, 230)]]
        needle = [[(330, 300), (300, 330), (250, 395)], [(318, 318), (290, 352)], [(250, 395), (243, 410), (262, 400)]]
        pera = [_arc(1210, 310, 55, 80, 0, 6.3), [(1200, 230), (1205, 232)], [(1185, 240), (1235, 240)]]
        bano = [[(560, 470), (560, 790), (580, 810), (1020, 810), (1040, 790), (1040, 470)], [(560, 520), *[(560 + k * 20, 520 + 7 * math.sin(k * 0.9)) for k in range(25)]],
                *[[(620 + 140 * k + 10 * math.sin(j), 470 - j * 14) for j in range(6)] for k in range(3)]]
        return [("FRASCO GRADUADO", bott, (1000, 420), (905, 470)), ("DOBLE TUBULADURA", tubes, (560, 100), (620, 140)),
                ("AGUJA DE PLATINO", needle, (300, 500), (262, 400)), ("PERA DE AIRE", pera, (1380, 420), (1262, 330)),
                ("BAÑO DE AGUA CALIENTE", bano, (1100, 860), (1035, 760))], "FIG. 1 — APARATO DE TRANSFUSIÓN CON SANGRE CITRATADA", "según la descripción de L. Agote, Anales del Instituto Modelo (1915)"
    # brazo a brazo: dos personas acostadas, los brazos cosidos
    def person(y, flip=1):
        head = _arc(300, y - 6, 40, 46, 0, 6.3)
        body = [(345, y - 18), (380, y - 34), (470, y - 42), (640, y - 36), (700, y - 30), (900, y - 26), (1010, y - 20), (1040, y - 8), (1040, y + 10), (1010, y + 24),
                (900, y + 30), (700, y + 34), (640, y + 40), (470, y + 44), (380, y + 36), (345, y + 18)]
        cot = [(250, y + 60), (1080, y + 60)]; legs = [[(250, y + 60), (250, y + 90)], [(1080, y + 60), (1080, y + 90)]]
        arm = [(520, y + 40 * flip), (640, y + 110 * flip), (790, y + 150 * flip), (820, y + 152 * flip)]
        return [head, body, cot, *legs, arm]
    a = person(300, 1); b = person(640, -1)
    sut = [[(820, 450), (820, 490)], *[[(805, 455 + 9 * k), (835, 460 + 9 * k)] for k in range(4)]]
    return [("DONANTE", a, (1080, 280), (1000, 300)), ("ENFERMO", b, (1080, 660), (1000, 640)),
            ("ARTERIA COSIDA A LA VENA", sut, (930, 470), (835, 470))], "ANTES DE 1914: TRANSFUSIÓN BRAZO A BRAZO", "una cirugía por cada transfusión"
def r_lamina(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); parts, title, sub = _drawing(sh.get("drawing", "aparato"))
    wpx, hpx = 3200, 1800; k = wpx / 1600
    paper = np.dstack([np.full((hpx, wpx), v, np.float32) for v in (0.93, 0.90, 0.82)]) - (cv2.resize(fbm(160, 90, 21), (wpx, hpx)) * 0.07)[..., None]
    ink = np.array([0.13, 0.12, 0.18])
    # tiempos de cada pieza: por palabra (wk: [[t, índice], …]) o repartidos
    tp = {int(v): tt for tt, v in sh.get("wk", [])}
    starts = [tp.get(j, 0.3 + j * (DUR * 0.75 / len(parts))) for j in range(len(parts))]
    fT = font("SC", 40 * k); fS = font(F_HAND, 34 * k); fL = font("SC", 38 * k)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        im = Image.new("L", (wpx, hpx), 0); d = ImageDraw.Draw(im); lab = Image.new("L", (wpx, hpx), 0); dl = ImageDraw.Draw(lab)
        d.rectangle((40 * k, 30 * k, 1560 * k, 870 * k), outline=150, width=int(2 * k))
        d.text((800 * k, 60 * k), title, font=fT, fill=int(255 * ramp(t, 0.1, 0.6)), anchor="mm")
        d.text((800 * k, 835 * k), sub, font=fS, fill=int(220 * ramp(t, 0.3, 0.9)), anchor="mm")
        focus = (800, 450)
        for j, (name, polys, lxy, pxy) in enumerate(parts):
            pr = ramp(t, starts[j], starts[j] + 1.4)
            if pr <= 0: continue
            tot = sum(sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pl, pl[1:])) for pl in polys); left = tot * pr
            for pl in polys:
                for a, b in zip(pl, pl[1:]):
                    L_ = math.hypot(b[0] - a[0], b[1] - a[1])
                    if left <= 0: break
                    f = min(1, left / max(L_, 1e-6)); e = (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)
                    d.line([(a[0] * k, a[1] * k), (e[0] * k, e[1] * k)], fill=255, width=int(3.2 * k)); left -= L_
            la = ramp(t, starts[j] + 0.9, starts[j] + 1.5)
            if la > 0:
                dl.line([(lxy[0] * k, lxy[1] * k), (pxy[0] * k, pxy[1] * k)], fill=int(255 * la), width=int(2 * k))
                dl.ellipse((pxy[0] * k - 6 * k, pxy[1] * k - 6 * k, pxy[0] * k + 6 * k, pxy[1] * k + 6 * k), fill=int(255 * la))
                dl.text((lxy[0] * k, lxy[1] * k - 8 * k), name, font=fL, fill=int(255 * la), anchor="mb" if lxy[1] > pxy[1] else "mb")
            if pr < 1 or t < starts[j] + 2.0: focus = pxy
        A = np.asarray(im).astype(np.float32) / 255; Lb = np.asarray(lab).astype(np.float32) / 255
        img = paper * (1 - A[..., None] * 0.92) + ink * A[..., None] * 0.92
        img = img * (1 - Lb[..., None]) + np.array([0.62, 0.10, 0.08]) * Lb[..., None]
        if sh.get("drawing", "aparato") == "aparato":                     # la sangre sube en el frasco cuando ya está dibujado
            fill = ramp(t, starts[0] + 1.6, starts[0] + 3.6)
            if fill > 0:
                y0 = int((716 - 360 * fill) * k); m = np.zeros((hpx, wpx), np.float32); cv2.rectangle(m, (int(694 * k), y0), (int(906 * k), int(714 * k)), 1, -1)
                m = cv2.GaussianBlur(m, (0, 0), 3 * k) * 0.75; img = img * (1 - m[..., None]) + np.array([0.52, 0.05, 0.06]) * m[..., None]
        # cámara: empuje leve y centrado (con zoom a la pieza se cortaban los rótulos de los bordes)
        z = 1.0 + 0.06 * u; ccx, ccy = 800.0, 450.0
        Mx = np.float32([[z * W / wpx, 0, W / 2 - z * W / wpx * ccx * k], [0, z * W / wpx, H / 2 - z * W / wpx * ccy * k]])
        out = cv2.warpAffine(img, Mx, (W, H), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REPLICATE)
        put(film(out, t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ la carrera de 1914
def r_carrera(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); bg = wood_bg(W, H, seed=19, dark=0.42)
    lanes = sh.get("lanes", ["BRUSELAS", "BUENOS AIRES", "NUEVA YORK"]); ys = [0.38, 0.56, 0.74]
    months = sh.get("months", ["MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC", "ENE", "FEB"])
    x0, x1 = 0.20, 0.95
    ev = sh["events"]                                 # [carril, mes_float (0 = 1-mar-1914), etiqueta, fecha]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR); img = bg.copy()
        ph = x0 + (x1 - x0) * ease(ramp(t, 0.6, DUR * 0.85))
        ov = np.zeros((H, W, 4), np.float32)
        lay = np.zeros((H, W), np.float32)
        for k, m in enumerate(months):                                  # regla del calendario
            x = x0 + (x1 - x0) * k / (len(months) - 1)
            cv2.line(lay, (int(x * W), int(0.27 * H)), (int(x * W), int(0.83 * H)), 0.25, 1, cv2.LINE_AA)
            ov = np.maximum(ov, text_rgba(W, H, m, "SC", 36, (x, 0.24), (230, 220, 200), 0.0) * 0.85)
        ov = np.maximum(ov, text_rgba(W, H, "1914", "AN", 44, (x0, 0.17), (232, 196, 120), 0.05) * ramp(t, 0.1, 0.6))
        ov = np.maximum(ov, text_rgba(W, H, "1915", "AN", 44, (x0 + (x1 - x0) * 10 / 11, 0.17), (232, 196, 120), 0.05) * ramp(t, 0.1, 0.6))
        for k, (ln, y) in enumerate(zip(lanes, ys)):
            cv2.line(lay, (int(x0 * W), int(y * H)), (int(x1 * W), int(y * H)), 0.55, max(1, int(2 * S)), cv2.LINE_AA)
            ov = np.maximum(ov, text_rgba(W, H, ln, "SC", 50, (0.03, y), (245, 238, 225), 0.0, anchor="lm") * ramp(t, 0.2 + 0.2 * k, 0.8 + 0.2 * k))
        img = img * (1 - lay[..., None] * 0.6) + lay[..., None] * np.array([0.9, 0.85, 0.75]) * 0.6
        cv2.line(img, (int(ph * W), int(0.27 * H)), (int(ph * W), int(0.83 * H)), (0.85, 0.12, 0.08), max(2, int(4 * S)), cv2.LINE_AA)
        for e_ in ev:
            lane, mf, label, date = e_[:4]; pos = e_[4] if len(e_) > 4 else ""      # "up": fecha y texto arriba · "down": abajo
            yd, yl = {"up": (-0.05, -0.10), "down": (0.055, 0.10)}.get(pos, (-0.05, 0.05))
            x = x0 + (x1 - x0) * mf / (len(months) - 1); y = ys[lane]
            a = ramp(ph, x - 0.005, x + 0.03)
            if a <= 0: continue
            dot = np.zeros((H, W), np.float32); cv2.circle(dot, (int(x * W), int(y * H)), int(12 * S), 1, -1, cv2.LINE_AA)
            img = img + cv2.GaussianBlur(dot, (0, 0), 10 * S)[..., None] * np.array([1.0, 0.5, 0.2]) * a + dot[..., None] * a * np.array([1.0, 0.85, 0.6])
            T = text_rgba(W, H, date, "AN", 46, (x, y + yd), (250, 225, 160), 0.0); T[..., 3] *= a; ov = np.maximum(ov, T)
            T = text_rgba(W, H, label, "SC", 34, (x, y + yl), (245, 240, 230), 0.0); T[..., 3] *= a; ov = np.maximum(ov, T)
        if sh.get("title"): ov = np.maximum(ov, text_rgba(W, H, sh["title"], "SC", 56, (0.5, 0.92), (245, 235, 215), 0.1) * ramp(t, DUR * 0.5, DUR * 0.62))
        sh_ = cv2.GaussianBlur(ov[..., 3], (0, 0), 3 * S); img = img * (1 - sh_[..., None] * 0.5)
        img = over(img, ov)
        img = xform(img, 1.0 + 0.05 * u, dx=-(ph - 0.55) * 80)
        put(film(img, t, i, "warm", halation=0.2))

# ------------------------------------------------------------------ acercamiento de mapa
def r_mapazoom(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.1), int(H * 1.1))); h0, w0 = img0.shape[:2]
    d0 = cv2.resize(depthmap(path), (w0, h0)); lo, hi = np.percentile(d0, 1), np.percentile(d0, 99); d0 = np.clip((d0 - lo) / (hi - lo + 1e-6), 0, 1)
    px, py = sh["pin"][0] * w0, sh["pin"][1] * h0; zmax = sh.get("zoom", 2.6)
    for i in range(N):
        t = i / FPS; z = 1 + (zmax - 1) * ease(ramp(t, 0.2, DUR * 0.75))
        cx = w0 / 2 + (px - w0 / 2) * ease(ramp(t, 0.2, DUR * 0.75)); cy = h0 / 2 + (py - h0 / 2) * ease(ramp(t, 0.2, DUR * 0.75))
        k = z * W / w0; Mx = np.float32([[k, 0, W / 2 - k * cx], [0, k, H / 2 - k * cy]])
        im = cv2.warpAffine(img0, Mx, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        dd = cv2.warpAffine(d0, Mx, (W, H), borderMode=cv2.BORDER_REFLECT)
        im = depth_dof(im, dd, focus=float(d0[int(py), int(px)]), strength=10 + 8 * ramp(t, DUR * 0.4, DUR))
        a = ramp(t, DUR * 0.55, DUR * 0.7)
        if a > 0:
            ring = np.zeros((H, W), np.float32); r_ = (24 + 40 * ((t * 1.2) % 1)) * S
            cv2.circle(ring, (W // 2, H // 2), int(r_), 1.0 - ((t * 1.2) % 1), max(2, int(3 * S)), cv2.LINE_AA)
            cv2.circle(ring, (W // 2, H // 2), int(9 * S), 1.0, -1, cv2.LINE_AA)
            im = im * (1 - ring[..., None] * a) + ring[..., None] * a * np.array([0.9, 0.12, 0.08])
            T = text_rgba(W, H, sh.get("label", ""), "AN", 64, (0.5, 0.40), (250, 246, 236), 0.06); T[..., 3] *= a
            im = im * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 6 * S)[..., None] * 0.6); im = over(im, T)
            if sh.get("sub"):
                T = text_rgba(W, H, sh["sub"], "SC", 34, (0.5, 0.60), (240, 232, 215), 0.2); T[..., 3] *= ramp(t, DUR * 0.65, DUR * 0.8); im = over(im, T)
        put(film(im, t, i, "warm", halation=0.22))
