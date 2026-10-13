# comp10.py — componentes de tgbertha (Bertha Benz, oct-2026): el auto de 1888 "como para un chico de 10 años"
#   r_olla       vapor (fuego afuera, la tapa salta) vs combustión interna (la explosión ADENTRO empuja el pistón); modos vapor / interna / dos
#   r_columpio   empujar en el momento justo; modo volante = el volante de inercia guarda el impulso entre explosiones
#   r_direccion  vista desde arriba: dos ruedas delanteras con el MISMO ángulo se arrastran / una sola rueda / 1893 cada una su ángulo
#   r_cambios    la cuesta con una sola marcha (se ahoga, empujan) vs una marcha más baja (sube despacio con más fuerza)
#   r_carburador plato con alcohol que se evapora / cajita de ligroína con el aire que pasa por encima y se lleva el vapor
#   r_freno      manos que se frotan (calor) / taco de madera contra la llanta que se gasta / tira de cuero del zapatero
#   r_vasos      llenar un balde con vasos grandes despacio (Benz) o vasitos corriendo (Daimler)
#   r_pava       el motor se enfría evaporando agua: el nivel baja, sale vapor, hay que rellenar
import math, numpy as np, cv2
from cine import W, H, film, ease, ramp, fbm
from comp6 import U, FPS, INK, RED, BLUE, BRASS, lay, line, poly, circ, arrow, dashed, txt, ink, cam, paper, kv
from comp9 import fill, title
from comp9 import label as _label
def label(img, s, xy, t, t0, px=34, col=INK, anchor="mm"): return _label(img, s, xy, t, t0, max(px, 34) * 1.15, col, anchor)

FIRE = np.array([0.95, 0.52, 0.12]); FIRE2 = np.array([0.98, 0.82, 0.30]); STEEL = np.array([0.55, 0.57, 0.62]); IRON = np.array([0.24, 0.24, 0.27])
WOOD = np.array([0.62, 0.42, 0.24]); LEATHER = np.array([0.36, 0.20, 0.10]); WATER = np.array([0.36, 0.58, 0.84]); STEAM = np.array([0.97, 0.97, 0.97])
GREEN = np.array([0.20, 0.48, 0.24])

def out(put, img, t, DUR, i, z=(1.0, 1.04), c=(0.5, 0.52)): put(film(cam(img, t, DUR, z[0], z[1], c), t, i, "warm", halation=0.08, grain=0.025))
def flames(img, cx, y, w, t, a=1.0, seed=0):
    L = lay(); L2 = lay()
    for k in range(7):
        x = cx - w / 2 + w * (k + 0.5) / 7; h = 70 + 30 * math.sin(t * 9 + k * 1.7 + seed)
        poly(L, [(x - w / 16, y), (x + w / 16, y), (x + 4 * math.sin(t * 7 + k), y - h)]); poly(L2, [(x - w / 30, y), (x + w / 30, y), (x, y - h * 0.55)])
    L = cv2.GaussianBlur(L, (0, 0), 2 * U); img = fill(img, L, FIRE, 0.9 * a); return fill(img, L2, FIRE2, 0.9 * a)
def steam(img, x, y, t, n=6, a=1.0, spread=40):
    L = lay()
    for k in range(n):
        ph = (t * 0.6 + k / n) % 1.0; yy = y - ph * 220; xx = x + math.sin(ph * 6 + k) * spread * ph
        circ(L, (xx, yy), 14 + 30 * ph, max(0.0, 1 - ph))
    return fill(img, cv2.GaussianBlur(L, (0, 0), 8 * U), STEAM, 0.75 * a)
def boom(img, c, k):
    if k <= 0: return img
    L = lay(); circ(L, c, 30 + 60 * k); L = cv2.GaussianBlur(L, (0, 0), 10 * U) * (1 - k * 0.5); img = fill(img, L, FIRE2, 0.95)
    L2 = lay(); circ(L2, c, 15 + 35 * k); return fill(img, cv2.GaussianBlur(L2, (0, 0), 6 * U), FIRE, 0.8)
def wheel(img, c, r, ang, col=INK, spokes=12, w=6, tyre=WOOD):
    L = lay(); circ(L, c, r, w=w * 2.4); img = fill(img, L, tyre, 0.95)
    L = lay(); circ(L, c, r * 0.12)
    for k in range(spokes):
        a = ang + k * 2 * math.pi / spokes; line(L, [c, (c[0] + math.cos(a) * r * 0.92, c[1] + math.sin(a) * r * 0.92)], 2.5)
    return fill(img, L, col, 0.85)

# ------------------------------------------------------------------ 1) LA OLLA
def _olla_vapor(img, cx, t, s=1.0):
    by = 690; w = 300 * s
    img = flames(img, cx, by + 90, w * 0.8, t)
    L = lay(); poly(L, [(cx - w / 2, by - 260 * s), (cx + w / 2, by - 260 * s), (cx + w / 2 * 0.9, by), (cx - w / 2 * 0.9, by)]); img = fill(img, L, IRON * 1.6)
    Lw = lay(); poly(Lw, [(cx - w / 2 * 0.92 + 10, by - 150 * s), (cx + w / 2 * 0.92 - 10, by - 150 * s), (cx + w / 2 * 0.88 - 10, by - 12), (cx - w / 2 * 0.88 + 10, by - 12)]); img = fill(img, Lw, WATER, 0.9)
    Lb = lay()
    for k in range(9):
        ph = (t * 1.3 + k * 0.37) % 1.0; circ(Lb, (cx - w * 0.35 + (k * 53) % (w * 0.7), by - 20 - ph * 120 * s), 5 + 4 * ph)
    img = fill(img, Lb, STEAM, 0.7)
    jump = max(0.0, math.sin(t * 5.0)) ** 6 * 40 * s
    Ll = lay(); poly(Ll, [(cx - w / 2 - 14, by - 262 * s - jump), (cx + w / 2 + 14, by - 262 * s - jump), (cx + w / 2 + 14, by - 280 * s - jump), (cx - w / 2 - 14, by - 280 * s - jump)])
    circ(Ll, (cx, by - 292 * s - jump), 14 * s); img = fill(img, Ll, IRON)
    if jump > 8: img = steam(img, cx + w / 2, by - 270 * s, t, 5, 0.8)
    return img
def _cilindro(img, cx, t, s=1.0, period=1.6, show_drop=True):
    top = 270; bot = 700; w = 220 * s
    ph = (t % period) / period; up = ease(min(1.0, ph / 0.18)) if ph < 0.5 else 1 - ease((ph - 0.5) / 0.5)
    py = bot - 120 * s - up * 190 * s
    Lc = lay()
    for sg in (-1, 1): poly(Lc, [(cx + sg * w / 2, top), (cx + sg * (w / 2 + 24), top), (cx + sg * (w / 2 + 24), bot), (cx + sg * w / 2, bot)])
    poly(Lc, [(cx - w / 2 - 24, bot), (cx + w / 2 + 24, bot), (cx + w / 2 + 24, bot + 24), (cx - w / 2 - 24, bot + 24)]); img = fill(img, Lc, STEEL)
    Lp = lay(); poly(Lp, [(cx - w / 2 + 3, py - 50), (cx + w / 2 - 3, py - 50), (cx + w / 2 - 3, py), (cx - w / 2 + 3, py)]); line(Lp, [(cx, py - 50), (cx, top - 90)], 18); img = fill(img, Lp, IRON * 1.4)
    gas = 0.15 + 0.6 * max(0.0, 1 - ph / 0.4)
    Lg = lay(); poly(Lg, [(cx - w / 2 + 3, py + 2), (cx + w / 2 - 3, py + 2), (cx + w / 2 - 3, bot - 2), (cx - w / 2 + 3, bot - 2)]); img = fill(img, Lg, FIRE, gas * 0.5)
    img = boom(img, (cx, bot - 50), ramp(ph, 0.0, 0.12) * (1 - ramp(ph, 0.25, 0.45)))
    Ls = lay(); line(Ls, [(cx + w / 2 + 24, bot - 50), (cx + w / 2 + 70, bot - 50)], 8); img = fill(img, Ls, INK)
    if ph > 0.9 or ph < 0.05:
        Lk = lay()
        for k in range(5): a = k * 1.25; line(Lk, [(cx + w / 2 + 6, bot - 50), (cx + w / 2 + 6 - math.cos(a) * 26, bot - 50 + math.sin(a) * 26)], 3)
        img = fill(img, Lk, FIRE2)
    La = lay(); arrow(La, (cx, top - 100), (cx, top - 100 - 70 * up), 8, 26, up); img = fill(img, La, RED, 0.85)
    return img
def r_olla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "dos"); base = paper(61)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "vapor":
            img = _olla_vapor(img, 800, t, 1.2); img = label(img, "FUEGO AFUERA", (800, 845), t, 0.4, 34, RED); img = label(img, "EL VAPOR EMPUJA LA TAPA", (1250, 330), t, 1.0, 32)
            img = title(img, "LA MÁQUINA DE VAPOR: UNA OLLA CON TAPA", t)
        elif mode == "interna":
            img = _cilindro(img, 800, t, 1.2); img = label(img, "UNA GOTA DE COMBUSTIBLE + UNA CHISPA", (800, 820), t, 0.4, 32, RED)
            img = label(img, "¡PUM! EMPUJA EL PISTÓN", (1210, 260), t, 0.9, 32); img = title(img, "COMBUSTIÓN INTERNA: LA EXPLOSIÓN, ADENTRO", t)
        else:
            img = _olla_vapor(img, 450, t, 0.95); img = _cilindro(img, 1150, t, 0.9)
            img = label(img, "VAPOR · FUEGO AFUERA", (450, 845), t, 0.4, 32, RED); img = label(img, "MOTOR · EXPLOSIÓN ADENTRO", (1150, 820), t, 0.9, 32, RED)
            Ld = lay(); line(Ld, [(800, 200), (800, 860)], 2); img = fill(img, Ld, INK, 0.3); img = title(img, "AFUERA O ADENTRO", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 2) EL COLUMPIO (y el volante de inercia)
def _swing(img, px, py, Lr, ang, t, push):
    bx, by = px + math.sin(ang) * Lr, py + math.cos(ang) * Lr
    L = lay(); line(L, [(px - 40, py), (bx - 40, by)], 4); line(L, [(px + 40, py), (bx + 40, by)], 4); img = fill(img, L, INK, 0.8)
    Ls = lay(); poly(Ls, [(bx - 70, by), (bx + 70, by), (bx + 70, by + 18), (bx - 70, by + 18)]); img = fill(img, Ls, WOOD)
    Lb = lay(); line(Lb, [(px - 200, py), (px + 200, py)], 10); img = fill(img, Lb, WOOD * 0.8)
    if push > 0:
        La = lay(); arrow(La, (bx - 230, by - 10), (bx - 90, by - 10), 9, 30, push); img = fill(img, La, RED, 0.9)
    return img
def _flywheel(img, c, r, ang, pulse):
    img = wheel(img, c, r, ang, IRON, 6, 10, IRON * 1.5)
    Lm = lay(); circ(Lm, (c[0] + math.cos(ang) * r * 0.75, c[1] + math.sin(ang) * r * 0.75), 12); img = fill(img, Lm, RED, 0.9)
    return boom(img, (c[0], c[1] + r + 60), pulse)
def r_columpio(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "ritmo"); base = paper(62)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "ritmo":
            om = 2 * math.pi / 2.2; amp = 0.28 + 0.10 * ramp(t, 0.5, DUR); ang = amp * math.sin(om * t)
            ph = (om * t / (2 * math.pi)) % 1.0; push = max(0.0, 1 - abs(ph - 0.75) / 0.08)
            img = _swing(img, 800, 200, 470, ang, t, push)
            if push > 0.3: img = label(img, "¡AHORA!", (520, 690), t, 0.0, 46, RED)
            img = title(img, "EMPUJAR EN EL MOMENTO JUSTO", t)
        else:
            om = 2 * math.pi / 2.2; ang = 0.32 * math.sin(om * t); ph = (om * t / (2 * math.pi)) % 1.0; push = max(0.0, 1 - abs(ph - 0.75) / 0.08)
            img = _swing(img, 430, 210, 380, ang, t, push)
            per = 0.9; pp = (t % per) / per; pulse = ramp(pp, 0.0, 0.08) * (1 - ramp(pp, 0.15, 0.4))
            rot = t * 2 * math.pi * 0.55 + 0.25 * sum(ramp(t, k * per, k * per + 0.25) for k in range(int(DUR / per) + 1))
            img = _flywheel(img, (1150, 470), 200, rot, pulse)
            img = label(img, "PUM · PUM · PUM", (1150, 790), t, 0.5, 34, RED); img = label(img, "EL VOLANTE GUARDA EL IMPULSO", (1150, 230), t, 0.9, 32)
            Ld = lay(); line(Ld, [(800, 200), (800, 860)], 2); img = fill(img, Ld, INK, 0.3); img = title(img, "ENTRE UNA EXPLOSIÓN Y LA OTRA", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 3) LA DIRECCIÓN (vista desde arriba)
def _car_top(img, cx, cy, steer, mode, t):
    """carro visto desde arriba, el frente hacia ARRIBA; steer en radianes (positivo = dobla a la derecha)"""
    Lb = lay(); poly(Lb, [(cx - 120, cy - 170), (cx + 120, cy - 170), (cx + 130, cy + 170), (cx - 130, cy + 170)]); img = fill(img, Lb, WOOD, 0.85)
    La = lay(); line(La, [(cx - 190, cy + 140), (cx + 190, cy + 140)], 6); img = fill(img, La, INK, 0.8)
    def tyre(x, y, a, col=INK):
        L = lay(); dx, dy = math.sin(a) * 50, -math.cos(a) * 50; ox, oy = math.cos(a) * 14, math.sin(a) * 14
        poly(L, [(x - dx - ox, y - dy - oy), (x + dx - ox, y + dy - oy), (x + dx + ox, y + dy + oy), (x - dx + ox, y - dy + oy)]); return fill(img, L, col, 0.95)
    img = tyre(cx - 190, cy + 140, 0); img = tyre(cx + 190, cy + 140, 0)
    R = 260 / max(math.tan(abs(steer)), 0.05); sgn = 1 if steer >= 0 else -1; ox_, oy_ = cx + sgn * R, cy + 140          # centro de giro sobre el eje trasero
    if mode == "una":
        Lf = lay(); line(Lf, [(cx, cy - 120), (cx, cy - 210)], 6); img = fill(img, Lf, INK, 0.8); img = tyre(cx, cy - 210, steer, RED * 0.8)
        Lt = lay(); line(Lt, [(cx, cy - 210), (cx - math.sin(steer + 0.6) * 0 + 70, cy - 120)], 5); img = fill(img, Lt, BRASS)
    else:
        Lf = lay(); line(Lf, [(cx - 190, cy - 210), (cx + 190, cy - 210)], 6); img = fill(img, Lf, INK, 0.8)
        for sx in (-190, 190):
            x = cx + sx; y = cy - 210
            a = steer if mode == "dos" else sgn * math.atan2(260, abs(ox_ - x))
            col = RED * 0.8 if (mode == "dos" and abs(steer) > 0.1) else GREEN
            img = tyre(x, y, a, col)
            if abs(steer) > 0.05 and abs(R) < 3000:
                Lr = lay(); dashed(Lr, [(x, y), (ox_, oy_)], t * 30, 14, 10, 2); img = fill(img, Lr, col, 0.6)
    return img
def r_direccion(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "dos"); base = paper(63)
    for i in range(N):
        t = i / FPS; img = base.copy(); st = 0.42 * ease(ramp(t, 0.5, DUR * 0.55))
        img = _car_top(img, 470, 520, st, mode, t)
        if mode == "dos":
            img = label(img, "LA DE ADENTRO DOBLA MÁS CERRADO", (1150, 330), t, 0.8, 30)
            if st > 0.3: img = label(img, "SE ARRASTRA Y SE TRABA", (1150, 410), t, DUR * 0.55, 36, RED)
            img = title(img, "DOS RUEDAS, EL MISMO ÁNGULO", t)
        elif mode == "una":
            img = label(img, "NADA QUE COORDINAR", (1150, 400), t, 0.8, 36, GREEN); img = label(img, "SE GIRA CON UNA PALANCA", (1150, 470), t, 1.2, 30)
            img = title(img, "1885 · UNA SOLA RUEDA ADELANTE", t)
        else:
            img = label(img, "CADA RUEDA, SU PROPIO ÁNGULO", (1150, 400), t, 0.8, 34, GREEN); img = label(img, "LAS DOS APUNTAN AL MISMO CENTRO", (1150, 470), t, 1.2, 28)
            img = title(img, "1893 · BENZ RESUELVE LAS CUATRO RUEDAS", t)
        out(put, img, t, DUR, i, c=(0.5, 0.5))

# ------------------------------------------------------------------ 4) LA CUESTA Y LOS CAMBIOS
def _gears(img, c, r1, r2, ang, t):
    for (x, y), r, a in (((c[0], c[1]), r1, ang), ((c[0] + 240, c[1]), r2, -ang * r1 / r2)):
        L = lay(); circ(L, (x, y), r)
        for k in range(int(r / 6)):
            th = a + k * 2 * math.pi / int(r / 6); poly(L, [(x + math.cos(th - 0.07) * r, y + math.sin(th - 0.07) * r), (x + math.cos(th - 0.05) * (r + 10), y + math.sin(th - 0.05) * (r + 10)),
                                                          (x + math.cos(th + 0.05) * (r + 10), y + math.sin(th + 0.05) * (r + 10)), (x + math.cos(th + 0.07) * r, y + math.sin(th + 0.07) * r)])
        img = fill(img, L, STEEL); Lc = lay(); circ(Lc, (x, y), r * 0.25); img = fill(img, Lc, INK, 0.7)
    Lch = lay(); line(Lch, [(c[0], c[1] - r1 - 6), (c[0] + 240, c[1] - r2 - 6)], 4); line(Lch, [(c[0], c[1] + r1 + 6), (c[0] + 240, c[1] + r2 + 6)], 4); return fill(img, Lch, INK, 0.75)
def r_cambios(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "cuesta"); base = paper(64)
    x0, y0, x1, y1 = 120, 800, 1480, 380
    for i in range(N):
        t = i / FPS; img = base.copy()
        Lg = lay(); poly(Lg, [(x0, y0), (x1, y1), (x1, 900), (x0, 900)]); img = fill(img, Lg, GREEN * 1.3, 0.35)
        Ll = lay(); line(Ll, [(x0, y0), (x1, y1)], 5); img = fill(img, Ll, INK, 0.8)
        if mode == "cuesta": f = 0.45 * (1 - (1 - ramp(t, 0.3, DUR * 0.7)) ** 2); stall = ramp(t, DUR * 0.55, DUR * 0.75)
        else: f = 0.15 + 0.6 * ramp(t, 0.3, DUR * 0.95); stall = 0.0
        x = x0 + (x1 - x0) * (0.12 + f * 0.8); y = y0 + (y1 - y0) * (0.12 + f * 0.8); slope = math.atan2(y1 - y0, x1 - x0)
        Lb = lay(); poly(Lb, [(x - 90, y - 70), (x + 90, y - 70 - 50), (x + 90, y - 120 - 40), (x - 90, y - 110)]); img = fill(img, Lb, WOOD, 0.9)
        img = wheel(img, (x - 70, y - 40), 40, -f * 40, INK, 10, 4); img = wheel(img, (x + 70, y - 82), 22, -f * 70, INK, 8, 3)
        if mode == "cuesta":
            img = label(img, "UNA SOLA MARCHA", (420, 260), t, 0.3, 34)
            if stall > 0: img = label(img, "EL MOTOR SE AHOGA", (x, y - 230), t, DUR * 0.55, 38, RED); img = steam(img, x - 90, y - 90, t, 4, stall)
            if stall > 0.5:
                La = lay(); arrow(La, (x - 300, y + 30), (x - 150, y - 30), 9, 30); img = fill(img, La, RED, 0.9); img = label(img, "¡A EMPUJAR!", (x - 300, y + 90), t, DUR * 0.7, 32, RED)
            img = _gears(img, (1080, 760), 70, 40, t * 6 * (1 - stall), t)
        else:
            img = label(img, "MARCHA BAJA: CADA VUELTA MUEVE MENOS LA RUEDA…", (620, 230), t, 0.3, 30); img = label(img, "…PERO CON MÁS FUERZA", (620, 280), t, 1.0, 34, GREEN)
            img = _gears(img, (1080, 760), 45, 75, t * 6, t)
        img = title(img, "LA CUESTA", t, 110)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 5) EL CARBURADOR (evaporación)
def r_carburador(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "caja"); base = paper(65); rng = np.random.default_rng(3)
    dots = rng.uniform(0, 1, (40, 2))
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "plato":
            lvl = 1 - 0.6 * ramp(t, 0.3, DUR)
            Lp = lay(); poly(Lp, [(500, 600), (1100, 600), (1040, 680), (560, 680)]); img = fill(img, Lp, STEEL * 1.3)
            Lw = lay(); poly(Lw, [(530, 610 + 50 * (1 - lvl)), (1070, 610 + 50 * (1 - lvl)), (1040, 670), (560, 670)]); img = fill(img, Lw, WATER, 0.6)
            Lv = lay()
            for k, (a, b) in enumerate(dots):
                ph = (t * 0.35 + b) % 1.0; circ(Lv, (540 + a * 520 + 20 * math.sin(ph * 8 + k), 600 - ph * 380), 5, 1 - ph)
            img = fill(img, Lv, BLUE, 0.6); img = label(img, "SE VA AL AIRE, SOLO", (800, 760), t, 0.6, 34)
            img = title(img, "UN PLATO CON ALCOHOL: SE EVAPORA", t)
        else:
            Lb = lay(); poly(Lb, [(420, 420), (900, 420), (900, 700), (420, 700)]); img = fill(img, Lb, BRASS * 0.9)
            Li = lay(); poly(Li, [(440, 440), (880, 440), (880, 680), (440, 680)]); img = fill(img, Li, np.array([0.95, 0.93, 0.86]))
            Lq = lay(); poly(Lq, [(440, 600), (880, 600), (880, 680), (440, 680)]); img = fill(img, Lq, np.array([0.80, 0.78, 0.55]), 0.8)
            Lt = lay(); poly(Lt, [(880, 470), (1150, 470), (1150, 520), (880, 520)]); img = fill(img, Lt, STEEL)
            Lc = lay(); poly(Lc, [(1150, 330), (1330, 330), (1330, 700), (1150, 700)]); img = fill(img, Lc, STEEL * 0.9)
            La = lay()
            for k in range(3):
                off = ((t * 140 + k * 70) % 210); arrow(La, (180 + off, 540 + k * 18), (330 + off, 540 + k * 18), 5, 18, 0.8)
            img = fill(img, La, INK, 0.6)
            Lv = lay()
            for k, (a, b) in enumerate(dots):
                ph = (t * 0.45 + a) % 1.0
                if ph < 0.5: x, y = 450 + ph * 2 * 420, 595 - b * 120
                else: q = (ph - 0.5) * 2; x, y = 880 + q * 330, 495 - 30 * math.sin(q * 3)
                circ(Lv, (x, y), 6, 0.9)
            img = fill(img, Lv, BLUE, 0.8)
            fl = (t % 0.8) / 0.8; img = boom(img, (1240, 600), ramp(fl, 0, 0.1) * (1 - ramp(fl, 0.2, 0.5)) * ramp(t, 1.0, 1.3))
            img = label(img, "AIRE", (230, 490), t, 0.3, 32); img = label(img, "LIGROÍNA", (660, 720), t, 0.6, 30); img = label(img, "AIRE + VAPOR = MEZCLA", (1015, 410), t, 1.0, 28, RED)
            img = label(img, "AL CILINDRO", (1240, 300), t, 1.4, 28)
            img = title(img, "EL CARBURADOR DE BENZ", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 6) EL FRENO (fricción)
def _palm(L, cx, cy, s=1.0):
    poly(L, [(cx - 90 * s, cy - 120 * s), (cx + 90 * s, cy - 120 * s), (cx + 100 * s, cy + 90 * s), (cx - 100 * s, cy + 90 * s)])
    for k in range(4): x = cx - 70 * s + k * 46 * s; poly(L, [(x - 18 * s, cy - 120 * s), (x + 18 * s, cy - 120 * s), (x + 16 * s, cy - (230 - abs(k - 1.5) * 25) * s), (x - 16 * s, cy - (230 - abs(k - 1.5) * 25) * s)])
def r_freno(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "taco"); base = paper(66)
    for i in range(N):
        t = i / FPS; img = base.copy(); heat = ramp(t, 0.4, DUR * 0.8)
        if mode == "manos":
            d = math.sin(t * 18) * 40
            L1 = lay(); _palm(L1, 760 + d, 540); L2 = lay(); _palm(L2, 840 - d, 540); img = fill(img, L1, np.array([0.80, 0.62, 0.48]), 0.95); img = fill(img, L2, np.array([0.74, 0.56, 0.42]), 0.95)
            Lh = lay(); circ(Lh, (800, 480), 160); img = fill(img, cv2.GaussianBlur(Lh, (0, 0), 40 * U), FIRE, 0.45 * heat)
            img = steam(img, 800, 300, t, 5, 0.4 * heat, 80); img = label(img, "FROTAR = CALOR", (800, 820), t, 0.6, 40, RED); img = title(img, "FRÍCCIÓN", t)
        else:
            cx, cy, r = 520, 520, 250; ang = t * (3.5 * (1 - 0.6 * heat))
            img = wheel(img, (cx, cy), r, ang, INK, 12, 8)
            wear = 0.55 * heat if mode == "taco" else 0.12 * heat
            bx = cx + r + 26
            Lb = lay(); poly(Lb, [(bx, cy - 90), (bx + 120 - 70 * wear, cy - 90), (bx + 120 - 70 * wear, cy + 90), (bx, cy + 90)]); img = fill(img, Lb, WOOD * 1.1)
            if mode == "cuero":
                Lc = lay(); poly(Lc, [(bx - 2, cy - 92), (bx + 18, cy - 92), (bx + 18, cy + 92), (bx - 2, cy + 92)]); img = fill(img, Lc, LEATHER)
            Ll = lay(); line(Ll, [(bx + 120, cy + 40), (bx + 300, cy + 230)], 12); img = fill(img, Ll, IRON * 1.4)
            hot = heat * (1.0 if mode == "taco" else 0.35)
            Lh = lay(); circ(Lh, (bx, cy), 110); img = fill(img, cv2.GaussianBlur(Lh, (0, 0), 30 * U), FIRE, 0.6 * hot)
            if mode == "taco":
                img = steam(img, bx + 40, cy - 100, t, 5, hot * 0.6); img = label(img, "LA MADERA SE CALIENTA…", (1210, 300), t, 0.6, 30); img = label(img, "…Y SE GASTA", (1210, 370), t, DUR * 0.5, 38, RED)
                img = title(img, "EL FRENO: UN TACO DE MADERA", t)
            else:
                img = label(img, "CUERO DE SUELA", (1210, 300), t, 0.5, 32, LEATHER); img = label(img, "AGARRA MEJOR · DURA MÁS", (1210, 370), t, 1.0, 34, GREEN)
                img = title(img, "1888 · LA PRIMERA GUARNICIÓN DE FRENO", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 7) LOS VASOS (Benz vs Daimler)
def r_vasos(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(67)
    for i in range(N):
        t = i / FPS; img = base.copy(); T = max(DUR - 0.8, 1.0)
        for cx, per, cup, name in ((450, 1.6, 52, "VASOS GRANDES, DESPACIO"), (1150, 0.4, 22, "VASITOS, CORRIENDO")):
            lvl = 0.85 * ramp(t, 0.3, T)
            Lk = lay(); poly(Lk, [(cx - 120, 420), (cx + 120, 420), (cx + 100, 720), (cx - 100, 720)]); img = fill(img, Lk, STEEL * 1.25)
            yw = 720 - 290 * lvl; Lw = lay(); poly(Lw, [(cx - 100 - 20 * lvl, yw), (cx + 100 + 20 * lvl, yw), (cx + 100, 718), (cx - 100, 718)]); img = fill(img, Lw, WATER, 0.85)
            ph = (t % per) / per; x = cx - 300 + 300 * math.sin(ph * math.pi) * 0 + (cx - 300 + 280 * ph - (cx - 300)) if ph < 0.6 else cx - 20
            x = cx - 330 + 310 * ease(min(1.0, ph / 0.6)); y = 380 - 120 * math.sin(min(1.0, ph / 0.6) * math.pi)
            Lc = lay(); poly(Lc, [(x - cup / 2, y - cup), (x + cup / 2, y - cup), (x + cup * 0.4, y), (x - cup * 0.4, y)]); img = fill(img, Lc, BLUE, 0.75)
            img = label(img, name, (cx, 790), t, 0.4, 30)
        Ld = lay(); line(Ld, [(800, 200), (800, 860)], 2); img = fill(img, Ld, INK, 0.3)
        img = label(img, "BENZ", (450, 230), t, 0.3, 40, RED); img = label(img, "DAIMLER", (1150, 230), t, 0.6, 40, RED)
        img = title(img, "AL FINAL, LOS DOS LLENAN EL BALDE", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 8) LA PAVA (enfriar evaporando)
def r_pava(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(68); refill = sh.get("rellena", True)
    for i in range(N):
        t = i / FPS; img = base.copy(); T = DUR * (0.65 if refill else 1.0)
        lvl = 1 - 0.85 * ramp(t, 0.3, T)
        if refill: lvl = lvl + 0.85 * ease(ramp(t, T + 0.1, DUR - 0.2))
        cx = 800
        Lj = lay(); poly(Lj, [(cx - 230, 280), (cx + 230, 280), (cx + 230, 720), (cx - 230, 720)]); img = fill(img, Lj, STEEL * 1.1)
        Lw = lay(); yw = 700 - 400 * lvl; poly(Lw, [(cx - 210, yw), (cx + 210, yw), (cx + 210, 700), (cx - 210, 700)]); img = fill(img, Lw, WATER, 0.85)
        Lc = lay(); poly(Lc, [(cx - 110, 250), (cx + 110, 250), (cx + 110, 740), (cx - 110, 740)]); img = fill(img, Lc, IRON * 1.5)
        hot = 0.3 + 0.7 * (1 - lvl); Lh = lay(); circ(Lh, (cx, 520), 120); img = fill(img, cv2.GaussianBlur(Lh, (0, 0), 30 * U), FIRE, 0.55 * hot)
        img = steam(img, cx - 150, 260, t, 6, 0.9 * (lvl > 0.1)); img = steam(img, cx + 150, 260, t + 0.4, 6, 0.9 * (lvl > 0.1))
        img = label(img, "AGUA", (cx + 330, 600), t, 0.5, 32, BLUE); img = label(img, "CILINDRO", (cx, 790), t, 0.8, 30)
        img = label(img, "SE EVAPORA…", (cx - 400, 300), t, 0.9, 34)
        if refill and t > T: img = label(img, "¡A RELLENAR!", (cx - 400, 380), t, T, 40, RED)
        img = title(img, "EL MOTOR SE ENFRÍA COMO UNA PAVA", t)
        out(put, img, t, DUR, i)
