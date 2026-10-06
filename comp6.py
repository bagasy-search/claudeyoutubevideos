# comp6.py — componentes de tgcierva (el autogiro, oct-2026): explicar física "como para un chico de 10 años"
#   r_tacometro  hilo de suspenso: tacómetro de latón del rotor (PARADO → GIRA CON EL VIENTO → GIRA SOLO → DESPEGA) y la sombra de las palas
#   r_ventanilla la mano por la ventanilla del coche: líneas de aire, flecha de SUSTENTACIÓN, velocímetro (modos inclina / frena / floja)
#   r_fuerzas    las 4 fuerzas sobre un biplano de 1920 (entran en la palabra con wk); modo gana / pierde
#   r_tunel      túnel de humo: el aire pegado al ala se despega en remolinos → PÉRDIDA
#   r_autorrot   el aire que sube por el rotor inclinado lo hace girar; modo paracaidas (motor parado, baja suave)
#   r_asimetria  rotor visto desde arriba: pala que avanza (mucho viento) vs la que retrocede; vista de frente que vuelca; modos calesita/brazos/parejo
#   r_bisagra    vista desde atrás: palas rígidas (vuelca) vs palas con bisagra (suben y bajan, queda derecho) + lupa sobre la bisagra
#   r_escalera   la escalera de fracasos C.1 → C.4: peldaños de madera que se rajan; el último resiste
#   r_ruta       ruta con hilo rojo sobre un mapa (pines con hora) y un autogiro que avanza
#   r_regla      cinta métrica sobre una escena: 0 → 183 m
import os, math, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from cine import W, H, S, load, xform, blur, over, fbm, film, ease, ramp
from comp import text_rgba, M, FONTS
from comp4 import wood_bg, text_mask
FPS = 24
U = W / 1600.0                                                     # diseño en 1600x900
INK = np.array([0.12, 0.12, 0.17]); RED = np.array([0.66, 0.11, 0.08]); BLUE = np.array([0.14, 0.33, 0.58]); BRASS = np.array([0.78, 0.60, 0.30])
def font(k, px): return ImageFont.truetype(FONTS.get(k, k), max(8, int(px)))
def P(x, y): return (int(x * U * 4), int(y * U * 4))              # punto de diseño -> píxel con shift=2
def kv(keys, t):
    if not keys: return 0.0
    if t <= keys[0][0]: return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1: return v0 + (v1 - v0) * ease((t - t0) / max(1e-6, t1 - t0))
    return keys[-1][1]
_PAPER = {}
def paper(seed=21, tone=(0.93, 0.90, 0.82)):
    k = (seed, tone, W)
    if k not in _PAPER:
        n = cv2.resize(fbm(160, 90, seed), (W, H)); yy, xx = np.mgrid[0:H, 0:W] / np.array([H, W])[:, None, None]
        b = np.dstack([np.full((H, W), v, np.float32) for v in tone]) - (n * 0.07)[..., None]
        b *= (1 - 0.30 * (((xx - 0.5) / 0.75) ** 2 + ((yy - 0.5) / 0.7) ** 2))[..., None]
        _PAPER[k] = b.astype(np.float32)
    return _PAPER[k].copy()
def lay(): return np.zeros((H, W), np.float32)
def line(L, pts, w=3, v=1.0):
    if len(pts) > 1: cv2.polylines(L, [np.int32([P(*p) for p in pts])], False, v, max(1, int(w * U)), cv2.LINE_AA, shift=2)
def poly(L, pts, v=1.0): cv2.fillPoly(L, [np.int32([P(*p) for p in pts])], v, cv2.LINE_AA, shift=2)
def circ(L, c, r, v=1.0, w=-1): cv2.circle(L, P(*c), int(r * U * 4), v, -1 if w < 0 else max(1, int(w * U)), cv2.LINE_AA, shift=2)
def arrow(L, a, b, w=6, head=22, v=1.0):
    ax, ay = a; bx, by = b; d = math.hypot(bx - ax, by - ay)
    if d < 2: return
    ux, uy = (bx - ax) / d, (by - ay) / d; hd = min(head, d * 0.6)
    line(L, [a, (bx - ux * hd * 0.8, by - uy * hd * 0.8)], w, v)
    poly(L, [(bx, by), (bx - ux * hd - uy * hd * 0.55, by - uy * hd + ux * hd * 0.55), (bx - ux * hd + uy * hd * 0.55, by - uy * hd - ux * hd * 0.55)], v)
def dashed(L, pts, off, dash=26, gap=16, w=3, v=1.0):
    seg = []; acc = -(off % (dash + gap))
    for a, b in zip(pts, pts[1:]):
        d = math.hypot(b[0] - a[0], b[1] - a[1]); s = 0.0
        while s < d:
            ph = (acc + s) % (dash + gap)
            if ph < dash:
                e = min(d, s + max(dash - ph, 0.5)); f0, f1 = s / max(d, 1e-6), e / max(d, 1e-6)
                line(L, [(a[0] + (b[0] - a[0]) * f0, a[1] + (b[1] - a[1]) * f0), (a[0] + (b[0] - a[0]) * f1, a[1] + (b[1] - a[1]) * f1)], w, v); s = e
            else: s += max((dash + gap) - ph, 0.5)
        acc += d
def txt(L, s, xy, px, f="SC", anchor="mm", v=1.0):
    im = Image.fromarray((L * 255).astype(np.uint8)); d = ImageDraw.Draw(im)
    d.text((xy[0] * U, xy[1] * U), s, font=font(f, px * U * (1.22 if f != "AN" else 1.1)), fill=int(255 * v), anchor=anchor); L[:] = np.asarray(im).astype(np.float32) / 255
def ink(img, L, col, a=0.95): return img * (1 - (L * a)[..., None]) + col * (L * a)[..., None]
def cam(img, t, DUR, z0=1.0, z1=1.05, c=(0.5, 0.5)):
    z = z0 + (z1 - z0) * ease(t / DUR); cx, cy = c[0] * W, c[1] * H
    return cv2.warpAffine(img, np.float32([[z, 0, W / 2 - z * cx], [0, z, H / 2 - z * cy]]), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
def wkv(sh, default):
    """wk [[t, valor], …] -> claves (t, valor); sin wk usa default"""
    w = sh.get("wk"); return [(float(a), b) for a, b in w] if w else default
def stamp(img, s, xy, px, t, t0, col=RED, rot=-6):
    a = ramp(t, t0, t0 + 0.18)
    if a <= 0: return img
    k = 1.0 + 0.6 * (1 - ease(ramp(t, t0, t0 + 0.22)))
    L = lay(); txt(L, s, xy, px * k, "AN", "mm")
    Mr = cv2.getRotationMatrix2D((xy[0] * U, xy[1] * U), rot, 1); L = cv2.warpAffine(L, Mr, (W, H))
    box = cv2.dilate(L, np.ones((int(18 * U) | 1, int(18 * U) | 1), np.uint8)); edge = np.clip(box - cv2.erode(box, np.ones((int(8 * U) | 1, int(8 * U) | 1), np.uint8)), 0, 1)
    grit = (cv2.resize(fbm(120, 68, 9), (W, H)) > 0.42).astype(np.float32) * 0.35 + 0.65
    return ink(img, np.clip((L + edge * 0.0) * grit, 0, 1), col, 0.9 * a)

# ------------------------------------------------------------------ tacómetro del rotor (hilo de suspenso)
ETAPAS = ["PARADO", "GIRA CON EL VIENTO", "GIRA SOLO", "DESPEGA"]
def r_tacometro(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); a0, a1 = sh.get("from", 0), sh.get("to", sh.get("from", 0))
    bg = wood_bg(W, H, seed=33, dark=0.50); cx, cy, R = 800, 470, 300
    ang = lambda lv: math.radians(-125 + lv * (250 / 3))             # 0..3 -> ángulo desde arriba
    face = lay(); circ(face, (cx, cy), R)
    rim = lay(); circ(rim, (cx, cy), R + 26); rim = np.clip(rim - face, 0, 1)
    marks = lay()
    for k in range(0, 61):
        a = math.radians(-125 + k * 250 / 60); r0 = R - (36 if k % 5 == 0 else 20)
        line(marks, [(cx + math.sin(a) * r0, cy - math.cos(a) * r0), (cx + math.sin(a) * (R - 8), cy - math.cos(a) * (R - 8))], 4 if k % 5 == 0 else 2)
    red = lay()
    for k in range(48, 61):
        a = math.radians(-125 + k * 250 / 60); line(red, [(cx + math.sin(a) * (R - 30), cy - math.cos(a) * (R - 30)), (cx + math.sin(a) * (R - 10), cy - math.cos(a) * (R - 10))], 9)
    labs = lay()
    for lv, s in enumerate(ETAPAS):
        a = ang(lv); r_ = R - 105; txt(labs, s.replace("GIRA CON EL VIENTO", "CON EL VIENTO"), (cx + math.sin(a) * r_, cy - math.cos(a) * r_), 22, "SC")
    txt(labs, "ROTOR", (cx, cy + 120), 30, "SC"); txt(labs, "C.4", (cx, cy + 160), 22, "SC")
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); dd = np.hypot(xx - cx * U, yy - cy * U) / (R * U)
    facecol = np.dstack([0.90 - 0.10 * dd, 0.86 - 0.10 * dd, 0.76 - 0.10 * dd]) - (cv2.resize(fbm(64, 36, 8), (W, H)) * 0.05)[..., None]
    g = np.random.default_rng(5)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        lv = a0 + (a1 - a0) * ease(ramp(t, 0.5, DUR * 0.75))
        trem = (0.5 + lv) * 0.012 * math.sin(t * 37) + (0.004 * lv) * g.normal()
        img = bg.copy()
        rimc = BRASS * (0.55 + 0.5 * np.clip((1.2 - dd), 0, 1))[..., None]
        img = img * (1 - rim[..., None]) + rimc * rim[..., None]
        img = img * (1 - face[..., None]) + facecol * face[..., None]
        img = ink(img, marks * face, INK, 0.9); img = ink(img, red * face, RED, 0.85); img = ink(img, labs * face, INK, 0.85)
        nd = lay(); a = ang(lv) + trem
        poly(nd, [(cx - math.cos(a) * 9, cy - math.sin(a) * 9), (cx + math.sin(a) * (R - 40), cy - math.cos(a) * (R - 40)), (cx + math.cos(a) * 9, cy + math.sin(a) * 9),
                  (cx - math.sin(a) * 60, cy + math.cos(a) * 60)])
        sh_ = cv2.GaussianBlur(np.roll(nd, (int(10 * U), int(8 * U)), (0, 1)), (0, 0), 6 * U)
        img = img * (1 - sh_[..., None] * 0.4); img = ink(img, nd, RED * 0.9, 1.0)
        hub = lay(); circ(hub, (cx, cy), 22); img = img * (1 - hub[..., None]) + BRASS[None, None] * hub[..., None]
        glass = np.exp(-(((xx - (cx - 120) * U) / (180 * U)) ** 2 + ((yy - (cy - 150) * U) / (90 * U)) ** 2)) * face
        img = img + glass[..., None] * 0.12
        # la sombra de las palas del rotor que pasa sobre el tablero, cada vez más rápido
        if lv > 0.3:
            om = (0.6 + 2.4 * (lv - 0.3)) * 2 * math.pi
            th = (xx / W - 0.5) * 0 + np.arctan2(yy - H * 0.3, xx - W * 0.5)
            bl = (np.cos(4 * (th - om * t)) > 0.86).astype(np.float32)
            bl = cv2.GaussianBlur(bl, (0, 0), (14 + 10 * lv) * U)
            img = img * (1 - bl[..., None] * 0.28 * min(1, lv))
        T = text_rgba(W, H, sh.get("title", "GETAFE · ENERO DE 1923"), "SC", 50, (0.5, 0.11), (240, 228, 205), 0.12); T[..., 3] *= ramp(t, 0.15, 0.6)
        img = over(img, T)
        sx = (lv * 1.2) * math.sin(t * 61) * U; img = cv2.warpAffine(img, np.float32([[1, 0, sx], [0, 1, sx * 0.6]]), (W, H), borderMode=cv2.BORDER_REFLECT)
        put(film(cam(img, t, DUR, 1.0, 1.06, (0.5, 0.52)), t, i, "warm", halation=0.25))

# ------------------------------------------------------------------ la mano por la ventanilla
def _hand(cx, cy, ang, L=300):
    """mano de perfil (palma plana): perfil tipo ala con el pulgar; rotada `ang` (rad, + nariz arriba)"""
    pts = []
    for k in range(41):
        x = k / 40; y = 0.13 * math.sqrt(max(0, x)) * (1 - x) ** 0.9 + 0.01
        pts.append((x, -y))
    for k in range(40, -1, -1):
        x = k / 40; pts.append((x, 0.035 * math.sqrt(max(0, x)) * (1 - x)))
    th = [(0.55, -0.05), (0.62, -0.13), (0.70, -0.12), (0.66, -0.04)]
    c, s = math.cos(-ang), math.sin(-ang)
    f = lambda p: (cx + ((p[0] - 0.45) * L) * c - (p[1] * L) * s, cy + ((p[0] - 0.45) * L) * s + (p[1] * L) * c)
    return [f(p) for p in pts], [f(p) for p in th]
def _stream(y0, cx, cy, ang, lift, sep=0.0, t=0.0, L=300):
    pts = []
    for k in range(81):
        x = -40 + k * 21.0; dx = (x - cx) / (L * 0.7); dy = (y0 - cy) / 90.0
        bump = math.exp(-dx * dx) * (1 if dy < 0 else -1) * 34 * math.exp(-abs(dy) * 0.55)
        tilt = (x - cx) * math.tan(-ang) * math.exp(-dx * dx) * math.exp(-abs(dy) * 0.4)
        down = (lift * 70) * (1 / (1 + math.exp(-(x - cx) / 60))) * math.exp(-abs(dy) * 0.35)
        y = y0 + bump + tilt + down
        if sep > 0 and dy < 0 and x > cx - L * 0.2:
            w = min(1, (x - cx + L * 0.2) / (L * 0.6)) * sep * math.exp(-abs(dy) * 0.5)
            y = y0 + bump * (1 - w) - w * 30 + w * 22 * math.sin(x / 34 - t * 9 + y0)
        pts.append((x, y))
    return pts
def r_ventanilla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "inclina"); cx, cy = 760, 480
    sp = wkv(sh, None)
    if mode == "frena": spk = [(t, float(v)) for t, v in sp] if sp else [(0, 60), (DUR * 0.25, 40), (DUR * 0.45, 20), (DUR * 0.65, 10), (DUR * 0.85, 0)]
    else: spk = [(0, 60), (DUR, 60)]
    if mode == "inclina": angk = [(0, 0.0), (0.6, 0.0), (DUR * 0.55, math.radians(12)), (DUR, math.radians(12))]
    elif mode == "floja": angk = [(0, math.radians(14)), (DUR * 0.35, math.radians(14)), (DUR * 0.75, math.radians(3)), (DUR, math.radians(3))]
    else: angk = [(0, math.radians(12)), (DUR, math.radians(12))]
    rise = [(0, 0), (DUR * 0.35, 0), (DUR * 0.75, -70), (DUR, -70)] if mode == "floja" else [(0, 0), (DUR, 0)]
    base = paper(23)
    for i in range(N):
        t = i / FPS; v = kv(spk, t); a = kv(angk, t); cyy = cy + kv(rise, t)
        lift = (v / 60.0) ** 2 * max(0, math.sin(a)) / math.sin(math.radians(12))
        img = base.copy(); Ls = lay(); Lh = lay(); La = lay(); Lt = lay()
        if v > 0.5:
            for y0 in range(230, 760, 46):
                pts = _stream(y0, cx, cyy, a, lift * 0.8)
                dashed(Ls, pts, t * 14 * v, 30, 18, 2.6, 0.55 + 0.45 * min(1, v / 40))
        body, thumb = _hand(cx, cyy, a)
        poly(Lh, body); poly(Lh, thumb)
        c_, s_ = math.cos(-a), math.sin(-a); Lf_ = lay()
        for k_ in range(3):                                         # las rayas entre los dedos juntos
            x1, x2 = 0.58, 0.95; y_ = -0.045 + k_ * 0.02
            f = lambda px, py: (cx + ((px - 0.45) * 300) * c_ - (py * 300) * s_, cyy + ((px - 0.45) * 300) * s_ + (py * 300) * c_)
            line(Lf_, [f(x1, y_), f(x2, y_ * 0.3)], 2)
        Lt0 = lay(); txt(Lt0, "TU MANO", (cx - 60, cyy + 110), 34, "AN")
        wrist = [(cx - 0.45 * 300 * math.cos(a) - 10, cyy + 0.45 * 300 * math.sin(a) - 30), (cx - 360, cyy + 30)]
        line(Lh, wrist, 70)
        img = ink(img, Ls, BLUE, 0.8)
        img = img * (1 - Lh[..., None] * 0.9) + np.array([0.70, 0.55, 0.40]) * Lh[..., None] * 0.9
        edge = np.clip(Lh - cv2.erode(Lh, np.ones((max(3, int(5 * U)),) * 2, np.uint8)), 0, 1); img = ink(img, edge, INK, 0.9)
        img = ink(img, Lf_, INK, 0.5); img = ink(img, Lt0, np.array([0.40, 0.25, 0.12]), 0.9)
        if lift > 0.03:
            top = (cx + 20, cyy - 60); arrow(La, top, (top[0], top[1] - 40 - 230 * lift), 9, 34)
            txt(Lt, "SUSTENTACIÓN", (top[0] + 30, top[1] - 60 - 230 * lift * 0.6), 36, "SC", "lm", min(1, lift * 3))
        img = ink(img, La, RED, 0.95)
        txt(Lt, "VIENTO", (120, 200), 34, "SC", "lm", ramp(t, 0.2, 0.7) * (1 if v > 0.5 else 0.3))
        if mode == "floja": txt(Lt, "MUÑECA FLOJA", (cx - 300, cyy + 130), 34, "SC", "mm", ramp(t, DUR * 0.3, DUR * 0.45))
        # velocímetro del coche
        gx, gy, gr = 1380, 190, 120; Lg = lay(); circ(Lg, (gx, gy), gr, 1.0, 4)
        for k in range(7):
            aa = math.radians(-120 + k * 40); line(Lg, [(gx + math.sin(aa) * (gr - 22), gy - math.cos(aa) * (gr - 22)), (gx + math.sin(aa) * (gr - 6), gy - math.cos(aa) * (gr - 6))], 3)
        aa = math.radians(-120 + 240 * min(1, v / 80)); line(Lg, [(gx, gy), (gx + math.sin(aa) * (gr - 20), gy - math.cos(aa) * (gr - 20))], 5)
        txt(Lg, f"{int(round(v))} km/h", (gx, gy + 60), 30, "SC"); img = ink(img, Lg, INK, 0.85)
        img = ink(img, Lt, INK, 0.9)
        if mode == "frena" and v < 0.5: img = stamp(img, "SIN VIENTO = SIN SUSTENTACIÓN", (820, 780), 54, t, spk[-1][0] + 0.2)
        put(film(cam(img, t, DUR, 1.02, 1.07, (0.5, 0.5)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ las 4 fuerzas
def _biplane(cx, cy, s=1.0, pitch=0.0):
    c, si = math.cos(pitch), math.sin(pitch); R = lambda p: (cx + (p[0] * c - p[1] * si) * s, cy + (p[0] * si + p[1] * c) * s)
    fus = [(-260, -12), (-120, -30), (150, -34), (230, -22), (250, 0), (230, 22), (150, 30), (-120, 22), (-260, 6)]
    wings = [[(-60, -110), (90, -110)], [(-70, 26), (100, 26)], [(-40, -110), (-40, 26)], [(70, -110), (70, 26)], [(-60, -110), (-30, 26)], [(90, -110), (60, 26)]]
    tail = [(-250, -10), (-290, -80), (-230, -80), (-200, -26)]
    stab = [[(-300, 0), (-190, 0)]]
    gear = [[(40, 30), (20, 80)], [(80, 30), (100, 80)]]
    prop = [[(258, -70), (258, 70)]]
    return [R(p) for p in fus], [[R(p) for p in w] for w in wings], [R(p) for p in tail], [[R(p) for p in w] for w in stab + gear + prop], [R((60, 80))]
def r_fuerzas(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "gana"); base = paper(27)
    tp = {int(v): tt for tt, v in sh.get("wk", [])}
    st = [tp.get(j, 0.4 + j * DUR * 0.18) for j in range(4)]
    F = [("PESO", (0, 1), INK, "la mochila de piedras"), ("EMPUJE", (1, 0), BLUE, "el motor"), ("RESISTENCIA", (-1, 0), np.array([0.40, 0.35, 0.30]), "el aire de frente"),
         ("SUSTENTACIÓN", (0, -1), RED, "el aire que la levanta")]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        fall = ramp(t, DUR * 0.6, DUR) if mode == "pierde" else 0
        climb = ramp(t, st[3] + 1.2, DUR) if mode == "gana" else 0
        cx, cy = 870, 470 - 40 * climb + 120 * fall * fall; pitch = math.radians(-4 * climb + 18 * fall)
        img = base.copy(); Lp = lay(); fus, wings, tail, misc, _ = _biplane(cx, cy, 1.15, pitch)
        poly(Lp, fus); poly(Lp, tail)
        for w in wings + misc: line(Lp, w, 7)
        circ(Lp, (cx + 23, cy + 94), 18, 1.0, 5); circ(Lp, (cx + 115, cy + 94), 18, 1.0, 5)
        pr = lay(); a_ = t * 40; line(pr, [(cx + 297, cy - 80 * math.cos(a_)), (cx + 297, cy + 80 * math.cos(a_))], 7)
        img = ink(img, Lp, INK, 0.88); img = ink(img, pr, INK, 0.6)
        for j, (name, (dx, dy), col, sub) in enumerate(F):
            g = ease(ramp(t, st[j], st[j] + 0.6))
            if g <= 0: continue
            L = 190 * g
            if name == "SUSTENTACIÓN": L *= (1 - 0.8 * fall) * (1 + 0.15 * climb)
            o = {"PESO": (cx + 25, cy + 50), "EMPUJE": (cx + 310, cy), "RESISTENCIA": (cx - 345, cy), "SUSTENTACIÓN": (cx + 10, cy - 140)}[name]
            La = lay(); arrow(La, o, (o[0] + dx * L, o[1] + dy * L), 12, 40); img = ink(img, La, col, 0.95)
            Lt = lay(); tx = (o[0] + dx * (L + 30) + (20 if dx == 0 else 0), o[1] + dy * (L + 40))
            an = "lm" if dx >= 0 else "rm"
            txt(Lt, name, tx, 48, "AN", an, g); txt(Lt, sub, (tx[0], tx[1] + 50), 34, F_HAND if os.path.exists(F_HAND) else "SC", an, g * 0.9)
            img = ink(img, Lt, col, 0.9)
        if mode == "pierde": img = stamp(img, "PÉRDIDA", (800, 160), 110, t, DUR * 0.62)
        put(film(cam(img, t, DUR, 1.0, 1.05, (0.5, 0.48)), t, i, "warm", halation=0.08, grain=0.025))
F_HAND = f"{M}/fonts/Caveat.ttf"

# ------------------------------------------------------------------ túnel de humo: la pérdida
def _airfoil(cx, cy, ang, ch=520):
    up, lo = [], []
    for k in range(61):
        x = (1 - math.cos(math.pi * k / 60)) / 2; yt = 0.6 * (0.2969 * math.sqrt(x) - 0.126 * x - 0.3516 * x ** 2 + 0.2843 * x ** 3 - 0.1015 * x ** 4)
        yc = 0.05 * (1 - (2 * x - 1) ** 2); up.append((x, yc + yt)); lo.append((x, yc - yt))
    c, s = math.cos(-ang), math.sin(-ang)
    f = lambda p: (cx + ((p[0] - 0.35) * ch) * c - (-p[1] * ch) * s, cy + ((p[0] - 0.35) * ch) * s + (-p[1] * ch) * c)
    return [f(p) for p in up] + [f(p) for p in lo[::-1]]
def r_tunel(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "angulo"); cx, cy = 780, 470
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    bg = np.dstack([0.08 + 0.03 * (1 - yy / H), 0.10 + 0.04 * (1 - yy / H), 0.13 + 0.05 * (1 - yy / H)]).astype(np.float32)
    bg = bg + (cv2.resize(fbm(96, 54, 3), (W, H)) * 0.04)[..., None]
    frame = lay(); line(frame, [(40, 140), (1560, 140)], 10); line(frame, [(40, 800), (1560, 800)], 10)
    for k in range(9): circ(frame, (120 + k * 170, 140), 7); circ(frame, (120 + k * 170, 800), 7)
    stall_t = sh.get("stall", DUR * 0.55)
    for i in range(N):
        t = i / FPS
        if mode == "angulo": a = math.radians(4 + 16 * ease(ramp(t, 0.6, stall_t)))
        else: a = math.radians(14)
        sep = ease(ramp(t, stall_t - 0.3, stall_t + 0.9))
        img = bg.copy(); img = ink(img, frame, np.array([0.55, 0.50, 0.42]), 0.9)
        Ls = lay()
        for y0 in range(190, 780, 30):
            pts = _stream(y0, cx, cy, a, (1 - sep) * 0.7 * math.sin(a) / math.sin(math.radians(12)), sep * 1.4, t, 520)
            dashed(Ls, pts, t * 520, 46, 6, 2.2, 0.75)
        Ls = cv2.GaussianBlur(Ls, (0, 0), 1.2 * U)
        img = img + Ls[..., None] * np.array([0.85, 0.88, 0.92]) * 0.75
        if sep > 0:                                                  # remolinos que se desprenden del extradós
            Lv = lay()
            for k in range(7):
                ph = (t * 0.9 + k / 7) % 1.0; x0 = cx - 40 + ph * 760; y0 = cy - 70 - 40 * math.sin(k * 2.1) - ph * 50
                r0 = (18 + 40 * ph) * sep
                sp = [(x0 + r0 * (q / 40) * math.cos(q * 0.45 - t * 8), y0 + r0 * (q / 40) * math.sin(q * 0.45 - t * 8)) for q in range(40)]
                line(Lv, sp, 3, (1 - ph) * sep)
            img = img + cv2.GaussianBlur(Lv, (0, 0), 1.5 * U)[..., None] * np.array([0.9, 0.9, 0.95]) * 0.8
        Lw = lay(); poly(Lw, _airfoil(cx, cy, a))
        img = img * (1 - Lw[..., None]) + np.array([0.70, 0.62, 0.50]) * Lw[..., None]
        lift = (1 - sep) * math.sin(a) / math.sin(math.radians(12))
        La = lay(); arrow(La, (cx, cy - 50), (cx, cy - 60 - 200 * max(0.05, lift)), 10, 36); img = ink(img, La, RED, 0.95 * max(0.25, 1 - sep * 0.7))
        Lt = lay(); txt(Lt, "TÚNEL DE VIENTO · HUMO", (800, 95), 34, "SC"); txt(Lt, f"ÁNGULO {math.degrees(a):.0f}°", (1450, 860), 30, "SC", "rm")
        txt(Lt, "EL AIRE PEGADO AL ALA" if sep < 0.3 else "EL AIRE SE DESPEGA", (180, 860), 30, "SC", "lm")
        img = img + Lt[..., None] * np.array([0.92, 0.88, 0.78]) * 0.9
        img = stamp(img, "PÉRDIDA", (1180, 250), 120, t, stall_t + 0.5)
        put(film(cam(img, t, DUR, 1.0, 1.06, (0.5, 0.5)), t, i, "cool" if False else "warm", halation=0.18, grain=0.03))

# ------------------------------------------------------------------ autorrotación
def _autogiro_side(L, cx, cy, s=1.0, rotor_ang=0.0, tilt=math.radians(-9), prop=0.0):
    R = lambda x, y: (cx + x * s, cy + y * s)
    poly(L, [R(-250, -6), R(-120, -26), R(120, -32), R(205, -18), R(222, 0), R(205, 20), R(120, 28), R(-120, 18), R(-250, 4)])
    poly(L, [R(-240, -4), R(-275, -70), R(-222, -70), R(-200, -22)])
    line(L, [R(-290, 0), R(-190, 0)], 8 * s)
    line(L, [R(30, -28), R(10, -150)], 9 * s); line(L, [R(70, -30), R(10, -150)], 7 * s)
    line(L, [R(40, 26), R(20, 78)], 7 * s); line(L, [R(80, 26), R(100, 78)], 7 * s); circ(L, R(20, 84), 14 * s, 1.0, 5); circ(L, R(100, 84), 14 * s, 1.0, 5)
    line(L, [R(230, -60 * math.cos(prop)), R(230, 60 * math.cos(prop))], 6 * s)
    hub = R(10, -152); circ(L, hub, 10 * s)
    for k in range(4):                                             # disco del rotor inclinado hacia atrás, palas en perspectiva
        q = rotor_ang + k * math.pi / 2; r = 330 * s; dx = math.cos(q) * r; dz = math.sin(q) * r * 0.10
        ct, st = math.cos(tilt), math.sin(tilt)
        line(L, [hub, (hub[0] + dx * ct - dz * st, hub[1] + dx * st + dz * ct)], 7 * s)
    return hub
def r_autorrot(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "avanza"); base = paper(31); tilt = math.radians(-9)
    ang = 0.0
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        om = (0.5 + 5.5 * ease(ramp(t, 0.3, DUR * 0.7))) if mode == "avanza" else 6.0
        ang += om / FPS * 2
        cy = 600 + (0 if mode == "avanza" else -140 + 200 * u); cx = 760
        img = base.copy(); Lp = lay(); hub = _autogiro_side(Lp, cx, cy, 1.35, ang, tilt, t * 50 if mode == "avanza" else 0.0)
        img = ink(img, Lp, INK, 0.88)
        La = lay()                                                 # el aire que entra por debajo y SUBE a través del disco
        for k in range(6):
            ph = (t * (0.55 if mode == "avanza" else 0.4) + k / 6) % 1.0
            x0 = hub[0] - 330 + k * 130; y0 = hub[1] + 170 - ph * 300
            pts = [(x0 + (q * 6) * (0.4 if mode == "avanza" else 0), y0 + 120 - q * 9) for q in range(14)]
            arrow(La, pts[0], pts[-1], 6, 24, (1 - abs(ph - 0.5) * 2) ** 0.5)
        img = ink(img, La, BLUE, 0.85)
        if mode == "avanza":
            Lw = lay()
            for k in range(5):
                ph = (t * 0.8 + k / 5) % 1.0; y = 300 + k * 90; x = 1500 - ph * 1300
                arrow(Lw, (x, y), (x - 90, y), 3, 14, 0.6 * (1 - abs(ph - 0.5) * 2) ** 0.4)
            img = ink(img, Lw, BLUE, 0.5)
        Lt = lay()
        txt(Lt, "EL AIRE HACE GIRAR EL ROTOR" if mode == "avanza" else "MOTOR PARADO · EL ROTOR SIGUE GIRANDO", (800, 130), 52, "AN", "mm", ramp(t, 0.4, 1.0))
        txt(Lt, "SIN MOTOR EN EL ROTOR", (hub[0] + 40, hub[1] - 90), 28, "SC", "lm", ramp(t, 0.9, 1.4))
        if mode != "avanza": txt(Lt, "BAJA SUAVE, COMO UNA SEMILLA", (800, 820), 34, "SC", "mm", ramp(t, DUR * 0.4, DUR * 0.6))
        img = ink(img, Lt, INK, 0.9)
        put(film(cam(img, t, DUR, 1.0, 1.05, (0.48, 0.48)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ asimetría de sustentación
def r_asimetria(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "vuelca"); base = paper(35)
    cx, cy, R = 690, 500, 300; ang = 0.0
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        V = 0.0 if mode == "calesita" else ease(ramp(t, 0.5, DUR * 0.45))
        roll = ease(ramp(t, DUR * 0.55, DUR * 0.95)) if mode == "vuelca" else 0.0
        ang += 2.4 / FPS * 2 * math.pi * 0.35
        img = base.copy(); Lr = lay(); Ld = lay()
        circ(Ld, (cx, cy), R, 1.0, 2)
        fus = lay(); poly(fus, [(cx - 18, cy - 150), (cx + 18, cy - 150), (cx + 22, cy + 160), (cx - 22, cy + 160)]); poly(fus, [(cx - 90, cy + 140), (cx + 90, cy + 140), (cx + 90, cy + 160), (cx - 90, cy + 160)])
        img = ink(img, fus, INK, 0.25); img = ink(img, Ld, INK, 0.5)
        for k in range(4):
            q = ang + k * math.pi / 2; tip = (cx + math.cos(q) * R, cy - math.sin(q) * R)
            side = math.cos(q)                                       # +1 derecha = pala que AVANZA (rotor antihorario, avance hacia arriba)
            col = RED if side > 0.2 else (BLUE if side < -0.2 else INK)
            Lb = lay(); line(Lb, [(cx, cy), tip], 14); img = ink(img, Lb, col, 0.85)
            vrel = 1.0 + 0.75 * V * side                                # velocidad del aire sobre la punta
            Lv = lay()
            dirx, diry = -math.sin(q), -math.cos(q)
            arrow(Lv, tip, (tip[0] + dirx * 110 * vrel, tip[1] + diry * 110 * vrel), 6, 22)
            img = ink(img, Lv, col, 0.8 * min(1, 0.3 + vrel))
        hub = lay(); circ(hub, (cx, cy), 14); img = ink(img, hub, BRASS, 1.0)
        Lw = lay()
        if V > 0.05:
            for k in range(5):
                ph = (t * 0.7 + k / 5) % 1.0; x = cx - 240 + k * 120; y = 140 + ph * 40
                arrow(Lw, (x, y), (x, y + 70), 3, 14, V * (1 - abs(ph - 0.5) * 2) ** 0.4)
            img = ink(img, Lw, INK, 0.45)
        # barras de sustentación de cada lado
        Lb = lay(); lr = (1 + 0.75 * V) ** 2 / 3.1; ll = (1 - 0.75 * V) ** 2 / 3.1
        if mode == "parejo": lr = ll = 0.5
        poly(Lb, [(1400, 840), (1460, 840), (1460, 840 - 380 * lr), (1400, 840 - 380 * lr)]); img = ink(img, Lb, RED, 0.85)
        Lb = lay(); poly(Lb, [(1300, 840), (1360, 840), (1360, 840 - 380 * ll), (1300, 840 - 380 * ll)]); img = ink(img, Lb, BLUE, 0.85)
        Lt = lay()
        labA, labR = ("AVANZA", "RETROCEDE")
        txt(Lt, labA, (cx + R + 30, cy - 20), 40, "AN", "lm", V if mode != "calesita" else 0); txt(Lt, "MUCHO VIENTO", (cx + R + 30, cy + 26), 24, "SC", "lm", V if mode != "calesita" else 0)
        txt(Lt, labR, (cx - R - 30, cy - 20), 40, "AN", "rm", V if mode != "calesita" else 0); txt(Lt, "POCO VIENTO", (cx - R - 30, cy + 26), 24, "SC", "rm", V if mode != "calesita" else 0)
        txt(Lt, "SUSTENTACIÓN", (1380, 870), 24, "SC"); txt(Lt, "VIENTO DEL AVANCE", (cx, 120), 24, "SC", "mm", V)
        if mode == "calesita": txt(Lt, "QUIETO EN SU LUGAR · LAS PALAS SIEMPRE TIENEN VIENTO", (800, 860), 32, "SC")
        img = ink(img, Lt, INK, 0.9)
        if mode in ("vuelca", "parejo"):                            # vista de frente en un recuadro: el aparato se ladea
            bx, by = 1340, 250; Lf = lay(); r_ = math.radians(-38 * roll)
            rot = lambda x, y: (bx + x * math.cos(r_) - y * math.sin(r_), by + x * math.sin(r_) + y * math.cos(r_))
            poly(Lf, [rot(-22, -30), rot(22, -30), rot(26, 40), rot(-26, 40)]); line(Lf, [rot(0, -30), rot(0, -70)], 6); line(Lf, [rot(-170, -72), rot(170, -72)], 7)
            circ(Lf, rot(-20, 52), 9); circ(Lf, rot(20, 52), 9)
            fr = lay(); cv2.rectangle(fr, P(bx - 200, by - 150), P(bx + 200, by + 110), 1.0, max(1, int(2 * U)), cv2.LINE_AA, shift=2)
            img = ink(img, fr, INK, 0.5); img = ink(img, Lf, INK, 0.85)
            L2 = lay(); txt(L2, "VISTA DE FRENTE", (bx, by - 125), 22, "SC"); img = ink(img, L2, INK, 0.7)
            if mode == "vuelca": img = stamp(img, "VUELCA", (bx - 260, by - 10), 70, t, DUR * 0.8)
        put(film(cam(img, t, DUR, 1.0, 1.04, (0.52, 0.5)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ la bisagra: palas rígidas vs articuladas
def _rotor_back(L, cx, cy, q, hinge, roll=0.0, s=1.0):
    r_ = roll; rot = lambda x, y: (cx + (x * math.cos(r_) - y * math.sin(r_)) * s, cy + (x * math.sin(r_) + y * math.cos(r_)) * s)
    poly(L, [rot(-36, -40), rot(36, -40), rot(42, 70), rot(-42, 70)]); line(L, [rot(0, -40), rot(0, -120)], 9 * s)
    line(L, [rot(-12, 70), rot(-40, 120)], 6 * s); line(L, [rot(12, 70), rot(40, 120)], 6 * s); circ(L, rot(-40, 126), 12 * s, 1.0, 4); circ(L, rot(40, 126), 12 * s, 1.0, 4)
    hub = rot(0, -124); tips = []
    for k in range(2):
        th = q + k * math.pi; x = math.cos(th) * 330                 # proyección desde atrás: la punta va de un lado al otro
        side = math.sin(th)                                         # >0: lado que avanza (derecha de la imagen)
        beta = (math.radians(9) * side if hinge else 0.0)
        y = -math.sin(beta) * 330 - 20
        tips.append(((rot(x * 0.06, -124 - 8)), rot(x, -124 + y), side))
        line(L, [hub, rot(x, -124 + y)], 8 * s)
    circ(L, hub, 12 * s)
    return hub, tips
def r_bisagra(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "split"); base = paper(39); q = 0.0
    for i in range(N):
        t = i / FPS; u = ease(t / DUR); q += 2 * math.pi * 1.1 / FPS
        img = base.copy()
        panes = [("C.3 · PALAS RÍGIDAS", False, 420), ("C.4 · CON BISAGRA", True, 1180)] if mode == "split" else [("CON BISAGRA", True, 800)]
        for title, hinge, cx in panes:
            roll = 0.0 if hinge else math.radians(-34) * ease(ramp(t, DUR * 0.35, DUR * 0.9))
            L = lay(); hub, tips = _rotor_back(L, cx, 540, q, hinge, roll, 1.05 if mode == "split" else 1.35)
            img = ink(img, L, INK, 0.85)
            La = lay()
            for root, tip, side in tips:                            # flechas de sustentación en las puntas
                Ls = 60 + 70 * max(0, side) if not hinge else 80
                arrow(La, (tip[0], tip[1] - 10), (tip[0], tip[1] - 10 - Ls * abs(side) - 10), 6, 22)
            img = ink(img, La, RED, 0.8)
            Lt = lay(); txt(Lt, title, (cx, 170), 46, "AN"); txt(Lt, "LADO QUE AVANZA →", (cx + 190, 700), 24, "SC", "mm", 0.8)
            img = ink(img, Lt, INK, 0.9)
            if hinge:                                               # lupa sobre la bisagra
                lx, ly, lr = cx + 230, 300, 90; Lm = lay(); circ(Lm, (lx, ly), lr, 1.0, 5); img = ink(img, Lm, BRASS * 0.8, 0.95)
                Lz = lay(); b = math.radians(14) * math.sin(q)
                circ(Lz, (lx - 30, ly), 14, 1.0, 4); line(Lz, [(lx - 80, ly + 4), (lx - 44, ly)], 10)
                line(Lz, [(lx - 16, ly), (lx - 16 + 110 * math.cos(b), ly - 110 * math.sin(b))], 10)
                img = ink(img, Lz, INK, 0.85); L3 = lay(); txt(L3, "BISAGRA", (lx, ly + lr + 26), 24, "SC"); img = ink(img, L3, INK, 0.8)
            else:
                img = stamp(img, "VUELCA", (cx, 820), 80, t, DUR * 0.75)
        if mode == "split":
            Ld = lay(); line(Ld, [(800, 180), (800, 860)], 2); img = ink(img, Ld, INK, 0.35)
        else:
            img = stamp(img, "DERECHO", (800, 820), 80, t, DUR * 0.6, col=BLUE, rot=0)
        put(film(cam(img, t, DUR, 1.0, 1.04, (0.5, 0.5)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ la escalera de fracasos
def r_escalera(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); steps = sh.get("steps", [["C.1", "1920", "NO DESPEGÓ"], ["C.2", "1921-22", "VOLCÓ"], ["C.3", "1921", "VOLCÓ"], ["C.4", "1923", "?"]])
    upto = sh.get("upto", len(steps)); final = sh.get("final", "?")
    tp = {int(v): tt for tt, v in sh.get("wk", [])}
    st = [tp.get(j, 0.3 + j * DUR * 0.8 / len(steps)) for j in range(len(steps))]
    bg = wood_bg(W, H, seed=41, dark=0.32); wood = wood_bg(W, H, seed=7, dark=1.0) * 1.25
    for i in range(N):
        t = i / FPS
        img = bg.copy(); top = lay(); front = lay(); Lt = lay(); cracks = lay()
        for j, (nm, yr, res) in enumerate(steps):
            x0 = 180 + j * 330; y0 = 700 - j * 140; w_ = 300; hh = 700 - y0 + 120
            g = ease(ramp(t, st[j] - 0.4, st[j] + 0.2)) if j < upto else 0
            if g <= 0: continue
            dy = (1 - g) * 60
            poly(top, [(x0, y0 + dy), (x0 + w_, y0 + dy), (x0 + w_ - 40, y0 - 50 + dy), (x0 + 40, y0 - 50 + dy)], g)
            poly(front, [(x0, y0 + dy), (x0 + w_, y0 + dy), (x0 + w_, y0 + hh + dy), (x0, y0 + hh + dy)], g)
            txt(Lt, nm, (x0 + w_ / 2, y0 + 60 + dy), 70, "AN", "mm", g); txt(Lt, yr, (x0 + w_ / 2, y0 + 120 + dy), 30, "SC", "mm", g)
            fail = j < len(steps) - 1 or final not in ("?", "VUELA")
            if fail and t > st[j] + 0.5:
                c = ease(ramp(t, st[j] + 0.5, st[j] + 0.9)); rng = np.random.default_rng(j + 3)
                pts = [(x0 + w_ * 0.5, y0 - 50 + dy)]
                for k in range(7): pts.append((pts[-1][0] + rng.normal(0, 22), pts[-1][1] + 34))
                line(cracks, pts[:max(2, int(len(pts) * c))], 4)
        img = img * (1 - front[..., None]) + wood * 0.55 * front[..., None]
        img = img * (1 - top[..., None]) + wood * 0.95 * top[..., None]
        img = ink(img, cracks, np.array([0.05, 0.03, 0.02]), 0.95)
        img = img * (1 - Lt[..., None] * 0.8) + np.array([0.12, 0.07, 0.03]) * Lt[..., None] * 0.8
        for j, (nm, yr, res) in enumerate(steps):
            if j >= upto: continue
            x0 = 180 + j * 330; y0 = 700 - j * 140
            if j == len(steps) - 1 and final in ("?", "VUELA"):
                if final == "VUELA": img = stamp(img, "¡VUELA!", (x0 + 150, y0 - 130), 76, t, st[j] + 0.6, col=BLUE, rot=0)
                else:
                    L = lay(); txt(L, "?", (x0 + 150, y0 - 140), 120, "AN", "mm", ramp(t, st[j] + 0.4, st[j] + 0.9)); img = ink(img, L, np.array([0.95, 0.88, 0.7]), 0.95)
            else:
                img = stamp(img, res, (x0 + 150, y0 - 110), 54, t, st[j] + 0.8)
        T = text_rgba(W, H, "LA ESCALERA DE FRACASOS", "SC", 48, (0.5, 0.12), (240, 228, 205), 0.12); T[..., 3] *= ramp(t, 0.1, 0.5); img = over(img, T)
        cyc = 0.56 - 0.08 * ease(ramp(t, 0.3, DUR * 0.9)); cxc = 0.44 + 0.12 * ease(ramp(t, 0.3, DUR * 0.9))
        put(film(cam(img, t, DUR, 1.0, 1.07, (cxc, cyc)), t, i, "warm", halation=0.22))

# ------------------------------------------------------------------ ruta sobre un mapa
def r_ruta(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); src = sh["src"]; pts = sh["pts"]; labs = sh.get("labels", [])
    p_ = f"{M}/img/{src}.png" if os.path.exists(f"{M}/img/{src}.png") else f"{M}/archivo/{src}.jpg"
    base = load(p_, size=(int(W * 1.15), int(H * 1.15))); bh, bw = base.shape[:2]
    tp = {int(v): tt for tt, v in sh.get("wk", [])}
    st = [tp.get(j, 0.4 + j * (DUR * 0.8) / max(1, len(pts) - 1)) for j in range(len(pts))]
    for i in range(N):
        t = i / FPS; img = base.copy() * 0.92
        # cabeza del hilo
        seg = 0; f = 0.0
        for j in range(len(pts) - 1):
            if t >= st[j]: seg = j; f = min(1, (t - st[j]) / max(0.3, st[j + 1] - st[j]))
        head = (pts[seg][0] + (pts[seg + 1][0] - pts[seg][0]) * ease(f), pts[seg][1] + (pts[seg + 1][1] - pts[seg][1]) * ease(f)) if len(pts) > 1 else pts[0]
        L = np.zeros((bh, bw), np.float32); path = [pts[k] for k in range(seg + 1)] + [head]
        cv2.polylines(L, [np.int32([(x * bw * 4, y * bh * 4) for x, y in path])], False, 1.0, max(2, int(6 * S)), cv2.LINE_AA, shift=2)
        shd = cv2.GaussianBlur(np.roll(L, (int(6 * S), int(5 * S)), (0, 1)), (0, 0), 4 * S)
        img = img * (1 - shd[..., None] * 0.45); img = img * (1 - L[..., None]) + RED * L[..., None]
        pil = Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)); d = ImageDraw.Draw(pil)
        for j, (x, y) in enumerate(pts):
            if t < st[j]: continue
            a = ramp(t, st[j], st[j] + 0.3); r_ = int((10 + 8 * (1 - ease(a))) * S * 1.4)
            d.ellipse((x * bw - r_, y * bh - r_, x * bw + r_, y * bh + r_), fill=(170, 28, 20), outline=(250, 240, 220), width=max(1, int(3 * S)))
            if j < len(labs):
                nm, sub = (labs[j] + "|").split("|")[:2]; dx = 22 * S * (1 if x < 0.75 else -1); an = "ls" if x < 0.75 else "rs"
                for (ox, oy), col in (((2, 2), (0, 0, 0)), ((0, 0), (250, 244, 230))):
                    d.text((x * bw + dx + ox * S, y * bh - 6 * S + oy * S), nm, font=font("AN", 44 * S), fill=col, anchor=an)
                    if sub: d.text((x * bw + dx + ox * S, y * bh + 40 * S + oy * S), sub, font=font("SC", 30 * S), fill=col, anchor=an)
        if sh.get("icon", True) and len(pts) > 1:                   # el autogiro que avanza: rotor girando sobre la cabeza del hilo
            hx, hy = head[0] * bw, head[1] * bh; rr = 26 * S * 1.4; qa = t * 14
            for k in range(4):
                q = qa + k * math.pi / 2; d.line((hx, hy, hx + math.cos(q) * rr, hy + math.sin(q) * rr * 0.5), fill=(20, 18, 25), width=max(1, int(3 * S)))
            d.ellipse((hx - 7 * S, hy - 7 * S, hx + 7 * S, hy + 7 * S), fill=(20, 18, 25))
        img = np.asarray(pil).astype(np.float32) / 255
        z = 1.0 + 0.10 * ease(t / DUR); cxp, cyp = head[0] * bw * 0.6 + bw * 0.2, head[1] * bh * 0.6 + bh * 0.2
        out = cv2.warpAffine(img, np.float32([[z * W / bw * 1.15, 0, W / 2 - z * W / bw * 1.15 * cxp], [0, z * W / bw * 1.15, H / 2 - z * W / bw * 1.15 * cyp]]), (W, H), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REFLECT)
        if sh.get("title"):
            T = text_rgba(W, H, sh["title"], "SC", 44, (0.5, 0.11), (245, 236, 215), 0.12); T[..., 3] *= ramp(t, 0.2, 0.7); out = over(out, T)
        put(film(out, t, i, "warm", halation=0.18))

# ------------------------------------------------------------------ regla: 0 → 183 m sobre una escena
def r_regla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); src = sh["src"]
    p_ = next(p for p in (f"{M}/img/{src}.png", f"{M}/img/kf__{src}.png", f"{M}/archivo/{src}.jpg") if os.path.exists(p))
    base = load(p_, size=(W, H)); (x0, y0), (x1, y1) = sh.get("p0", (0.12, 0.78)), sh.get("p1", (0.88, 0.62)); total = sh.get("metros", 183)
    col = np.array(sh.get("color", (0.95, 0.93, 0.88))); t0, t1 = sh.get("t0", 0.4), sh.get("t1", DUR * 0.75)
    for i in range(N):
        t = i / FPS; f = ease(ramp(t, t0, t1)); img = base.copy() * (0.85 if sh.get("dim", True) else 1.0)
        L = lay(); hx, hy = x0 + (x1 - x0) * f, y0 + (y1 - y0) * f
        cv2.line(L, (int(x0 * W), int(y0 * H)), (int(hx * W), int(hy * H)), 1.0, max(2, int(5 * S)), cv2.LINE_AA)
        n = 12
        for k in range(n + 1):
            if k / n > f + 1e-6: break
            tx, ty = x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n; dl = (16 if k % 3 == 0 else 9) * S
            cv2.line(L, (int(tx * W), int(ty * H - dl)), (int(tx * W), int(ty * H + dl)), 1.0, max(1, int(3 * S)), cv2.LINE_AA)
        shd = cv2.GaussianBlur(np.roll(L, (int(4 * S), int(4 * S)), (0, 1)), (0, 0), 3 * S)
        img = img * (1 - shd[..., None] * 0.5); img = img * (1 - L[..., None]) + col * L[..., None]
        m = int(round(total * f)); T = text_rgba(W, H, f"{m} m", "AN", 120 if f < 1 else 150, (min(0.84, max(0.16, hx)), hy - 0.09), (250, 246, 236), 0.02)
        T[..., 3] *= ramp(t, t0, t0 + 0.3); img = img * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 10 * S)[..., None] * 0.6); img = over(img, T)
        if sh.get("sub") and f >= 1:
            T2 = text_rgba(W, H, sh["sub"], "SC", 40, (0.5, 0.88), (240, 232, 212), 0.1); T2[..., 3] *= ramp(t, t1 + 0.1, t1 + 0.6); img = over(img, T2)
        put(film(xform(img, 1.0 + 0.05 * ease(t / DUR)), t, i, sh.get("grade", "warm"), halation=0.2))

# ------------------------------------------------------------------ archivo: proyector de cine de época
def r_proyector(sh, sid, DUR, put):
    """la foto de archivo proyectada como película de los años 20: vaivén de cuadro, parpadeo, rayas, polvo, viñeta redonda"""
    N = int(round(DUR * FPS)); p_ = f"{M}/img/{sh['src']}.png"
    im = load(p_, size=(int(W * 1.12), int(H * 1.12))); g = im.mean(-1, keepdims=True); im = np.clip(g * np.array([1.0, 0.97, 0.90]) * 1.05, 0, 1)
    rng = np.random.default_rng(abs(hash(sid)) % 2**31); yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    vig = np.clip(1 - (((xx - W / 2) / (W * 0.62)) ** 2 + ((yy - H / 2) / (H * 0.62)) ** 2) ** 1.6, 0, 1)[..., None]
    zc = sh.get("zoom_to", (0.5, 0.5)); scr = [(rng.random() * W, rng.random() * 0.5 + 0.2) for _ in range(3)]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR); z = 1.0 + 0.07 * u
        cx = W * 1.12 / 2 + (zc[0] - 0.5) * W * 0.12 * u; cy = H * 1.12 / 2 + (zc[1] - 0.5) * H * 0.12 * u
        wx, wy = rng.normal(0, 1.4 * S), rng.normal(0, 2.2 * S)
        fr = cv2.warpAffine(im, np.float32([[z, 0, W / 2 - z * cx + wx], [0, z, H / 2 - z * cy + wy]]), (W, H), borderMode=cv2.BORDER_REFLECT)
        fl = 0.90 + 0.10 * rng.random(); fr = fr * fl * (0.25 + 0.75 * vig)
        L = np.zeros((H, W), np.float32)
        for k, (x, life) in enumerate(scr):
            if rng.random() < life: cv2.line(L, (int(x + rng.normal(0, 3 * S)), 0), (int(x + rng.normal(0, 3 * S)), H), 1.0, max(1, int(1.5 * S)))
        for _ in range(rng.integers(2, 9)):
            cv2.circle(L, (int(rng.random() * W), int(rng.random() * H)), int(rng.integers(1, 5) * S + 1), 1.0, -1)
        L = cv2.GaussianBlur(L, (0, 0), 0.8 * S); fr = fr * (1 - L[..., None] * 0.7)
        if sh.get("bright_flash", True) and t < 0.12: fr = fr * 0.3 + 0.7 * (t / 0.12) * fr
        put(film(fr, t, i, "night", halation=0.05, grain=0.06))

# ------------------------------------------------------------------ archivo: la copia en papel que cae sobre el escritorio
def r_copia(sh, sid, DUR, put):
    from comp3 import _print_on_desk
    N = int(round(DUR * FPS)); desk = load(f"{M}/img/{sh.get('desk', 'x_mesa')}.png", size=(W, H)) * 0.55
    base, (px, py, pw, ph) = _print_on_desk(f"{M}/{sh['photo']}", desk)
    rot0 = sh.get("rot", -7 if hash(sid) % 2 else 6)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR); d = ease(ramp(t, 0.0, 0.55))
        ang = rot0 * (1 - d) + rot0 * 0.15 * d; sc = 1.18 - 0.18 * d + 0.06 * u; dy = (1 - d) * -60 * S
        Mr = cv2.getRotationMatrix2D((W / 2, H / 2), ang, sc); Mr[1, 2] += dy
        img = cv2.warpAffine(base, Mr, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        sw = ramp(t, 0.6, DUR * 0.9); xs = -0.3 * W + 1.6 * W * sw
        band = np.exp(-(((xx - xs) + (yy - H / 2) * 0.5) / (180 * S)) ** 2)[..., None] * 0.10 * (1 if 0 < sw < 1 else 0)
        put(film(img + band, t, i, "warm", halation=0.12))
