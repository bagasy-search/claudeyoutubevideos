# comp12.py — componentes de tgaccidentes (inventos accidentales, oct-2026): cada analogía del guion "como para un chico de 10 años"
#   r_promedio   esperanza de vida: 6 hijos, 2 mueren chicos → el promedio cae a <40 (modo promedio) · 1800 vs hoy (modo hoy)
#   r_manos      las manos llevan "partículas" de la sala de autopsias a la de partos (lleva) · el agua clorada las borra (lava)
#   r_nervios    el cuerpo = red de cables al cerebro: el dolor viaja (dolor) · la anestesia desconecta al que recibe (anestesia)
#   r_ejercito   la vacuna: el ejército aprende la cara de la prima débil (aprende) y reconoce a la peligrosa (reconoce)
#   r_llave      la insulina: el río de azúcar y la llave que abre la célula (llave) · sin llave el azúcar se queda en el río (sinllave)
#   r_halo       la placa de Petri: el moho suelta su veneno y las bacterias de alrededor desaparecen
#   r_trafico    la coagulación: camiones que tapan el agujero (normal) · el trébol podrido no los deja llegar (trebol)
#   r_canilla    la nitroglicerina abre los vasos: canilla más abierta, pasa más agua con menos presión
#   r_director   el marcapasos: la batuta y la orquesta (director) · se desmaya (falla) · el pulso eléctrico, uno por segundo (pulso)
#   r_rayos      el tubo tapado con cartón, la pantalla brilla: libro y madera sí pasan, el plomo no (objetos) · la mano (mano)
#   r_celulas    las células se parten en dos (normal) · con platino se estiran como fideos y no se parten (platino)
#   r_parabrisas vidrio común (se desarma) vs vidrio laminado (se raja como telaraña y queda en su lugar)
import math, numpy as np, cv2
from cine import W, H, film, ease, ramp, fbm
from comp6 import U, FPS, INK, RED, BLUE, BRASS, lay, line, poly, circ, arrow, dashed, txt, ink, cam, paper
from comp9 import fill, title
from comp9 import label as _label
def label(img, s, xy, t, t0, px=34, col=INK, anchor="mm"): return _label(img, s, xy, t, t0, max(px, 34) * 1.15, col, anchor)
GREEN = np.array([0.20, 0.48, 0.24]); TIN = np.array([0.66, 0.68, 0.70]); SKIN = np.array([0.86, 0.68, 0.54]); BAC = np.array([0.55, 0.62, 0.20])
SUGAR = np.array([0.98, 0.85, 0.35]); BLOOD = np.array([0.72, 0.12, 0.12]); MOLD = np.array([0.28, 0.52, 0.48]); SCREEN = np.array([0.45, 0.95, 0.55])
WATER = np.array([0.36, 0.58, 0.84]); LEAD = np.array([0.40, 0.42, 0.46]); WOOD = np.array([0.62, 0.42, 0.24]); GLASS = np.array([0.70, 0.84, 0.88])

def out(put, img, t, DUR, i, z=(1.0, 1.04), c=(0.5, 0.52)): put(film(cam(img, t, DUR, z[0], z[1], c), t, i, "warm", halation=0.08, grain=0.025))
def _rng(seed): return np.random.default_rng(seed)
def kid(img, cx, cy, s, col, a=1.0):
    """figurita simple: cabeza + cuerpo"""
    L = lay(); circ(L, (cx, cy - 60 * s), 26 * s); poly(L, [(cx - 30 * s, cy - 28 * s), (cx + 30 * s, cy - 28 * s), (cx + 40 * s, cy + 70 * s), (cx - 40 * s, cy + 70 * s)])
    return fill(img, L, col, a)

# ------------------------------------------------------------------ 1) EL PROMEDIO
def r_promedio(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "promedio"); base = paper(81)
    edades = [2, 4, 55, 62, 68, 71]
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "promedio":
            Lax = lay(); line(Lax, [(260, 720), (1360, 720)], 4); img = fill(img, Lax, INK, 0.7)
            for k, e in enumerate(edades):
                x = 330 + k * 190; g = ease(ramp(t, 0.2 + k * 0.15, 0.9 + k * 0.15)); h = 6.2 * e * g
                L = lay(); poly(L, [(x - 55, 720), (x + 55, 720), (x + 55, 720 - h), (x - 55, 720 - h)]); img = fill(img, L, RED if e < 10 else BLUE, 0.85)
                img = label(img, f"{e}", (x, 690 - h), t, 0.3 + k * 0.15, 30, RED if e < 10 else INK)
            pm = sum(edades) / len(edades); a = ramp(t, 1.8, 2.3); y = 720 - 6.2 * pm
            Lp = lay(); dashed(Lp, [(260, y), (1360, y)], 5, 24) if a > 0 else None; img = fill(img, Lp, INK, 0.9 * a)
            img = label(img, f"PROMEDIO: {pm:.0f} AÑOS", (800, 800), t, 1.9, 38, RED); img = title(img, "SEIS HIJOS EN UNA FAMILIA DE 1800", t)
        else:
            for k, (yr, e, col) in enumerate([("1800", 39, RED), ("HOY", 73, GREEN)]):
                y = 380 + k * 220; g = ease(ramp(t, 0.3 + k * 0.6, 1.4 + k * 0.6)); w = 13 * e * g
                L = lay(); poly(L, [(330, y - 55), (330 + w, y - 55), (330 + w, y + 55), (330, y + 55)]); img = fill(img, L, col, 0.85)
                img = label(img, yr, (230, y), t, 0.2, 40); img = label(img, f"{e * g:.0f} AÑOS", (330 + w + 120, y), t, 0.4 + k * 0.6, 40, col)
            img = title(img, "ESPERANZA DE VIDA AL NACER", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 2) LAS MANOS
def _mano(img, cx, cy, s=1.0, col=SKIN):
    L = lay(); poly(L, [(cx - 70 * s, cy + 140 * s), (cx + 70 * s, cy + 140 * s), (cx + 80 * s, cy), (cx - 80 * s, cy)])
    for k in range(4): poly(L, [(cx - 75 * s + k * 40 * s, cy + 5), (cx - 45 * s + k * 40 * s, cy + 5), (cx - 48 * s + k * 40 * s, cy - (110 - abs(k - 1.5) * 18) * s), (cx - 72 * s + k * 40 * s, cy - (110 - abs(k - 1.5) * 18) * s)])
    poly(L, [(cx + 75 * s, cy + 60 * s), (cx + 140 * s, cy - 10 * s), (cx + 155 * s, cy + 10 * s), (cx + 80 * s, cy + 100 * s)])
    return fill(img, L, col)
def r_manos(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "lleva"); base = paper(82); r = _rng(5); P = r.uniform(-1, 1, (60, 2))
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "lleva":
            u = ease(ramp(t, 0.6, DUR * 0.8)); hx = 420 + 760 * u
            for k, (x, s) in enumerate([(360, "SALA DE AUTOPSIAS"), (1240, "SALA DE PARTOS")]):
                Lr = lay(); poly(Lr, [(x - 190, 300), (x + 190, 300), (x + 190, 760), (x - 190, 760)], ) ; img = fill(img, Lr, np.array([0.88, 0.85, 0.78]), 0.6)
                Lr = lay(); line(Lr, [(x - 190, 300), (x + 190, 300), (x + 190, 760), (x - 190, 760), (x - 190, 300)], 4); img = fill(img, Lr, INK, 0.5)
                img = label(img, s, (x, 260), t, 0.2, 28)
            img = _mano(img, hx, 560, 0.9)
            Lb = lay()
            for px, py in P: circ(Lb, (hx + px * 70, 520 + py * 80), 6)
            img = fill(img, Lb, BAC, 0.9)
            img = label(img, "PARTÍCULAS INVISIBLES", (800, 820), t, 1.0, 32, RED); img = title(img, "DE UNA SALA A LA OTRA, SIN LAVARSE", t)
        else:
            w = ease(ramp(t, 0.8, DUR * 0.75))
            Lw = lay(); poly(Lw, [(500, 700), (1100, 700), (1040, 800), (560, 800)]); img = fill(img, Lw, WATER, 0.7)
            img = _mano(img, 800, 520 + 40 * math.sin(t * 6) * (1 - w), 1.0)
            Lb = lay()
            for k, (px, py) in enumerate(P):
                if k / len(P) >= w: circ(Lb, (800 + px * 75, 480 + py * 90), 6)
            img = fill(img, Lb, BAC, 0.9)
            Ld = lay()
            for k in range(14): circ(Ld, (560 + (k * 47) % 480, 640 + ((t * 300 + k * 53) % 70)), 6)
            img = fill(img, Ld, WATER, 0.6 * ramp(t, 0.6, 1.0))
            img = label(img, "AGUA CLORADA", (800, 860), t, 0.5, 30, BLUE); img = label(img, f"MUERTES: {10 - 8.5 * w:.0f} DE CADA 100", (1260, 360), t, 1.0, 30, RED)
            img = title(img, "LAVARSE LAS MANOS", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 3) LOS NERVIOS (anestesia)
def r_nervios(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "dolor"); base = paper(83)
    path = [(300, 760), (420, 640), (560, 600), (700, 520), (860, 470), (1040, 400), (1200, 330)]
    for i in range(N):
        t = i / FPS; img = base.copy()
        L = lay(); line(L, path, 8); img = fill(img, L, INK, 0.75)
        Lb = lay(); circ(Lb, (1270, 290), 95); img = fill(img, Lb, np.array([0.93, 0.70, 0.72]))
        Lb = lay(); circ(Lb, (1270, 290), 95, w=5); img = fill(img, Lb, INK, 0.6)
        img = label(img, "CEREBRO", (1270, 420), t, 0.2, 28)
        Lc = lay(); line(Lc, [(260, 800), (340, 720)], 12); img = fill(img, Lc, BLOOD)
        img = label(img, "HERIDA", (300, 840), t, 0.2, 28, RED)
        u = ((t * 0.55) % 1.0); seg = u * (len(path) - 1); k = int(seg); f = seg - k
        px = path[k][0] + (path[k + 1][0] - path[k][0]) * f; py = path[k][1] + (path[k + 1][1] - path[k][1]) * f
        Lp = lay(); circ(Lp, (px, py), 18); img = fill(img, Lp, RED, 0.95)
        if mode == "dolor":
            hit = ramp(u, 0.92, 1.0)
            Lr = lay()
            for j in range(3): circ(Lr, (1270, 290), 110 + j * 30, w=4)
            img = fill(img, Lr, RED, 0.7 * hit); img = label(img, "¡DUELE!", (1270, 140), t, 0.0, 44, RED) if hit > 0 else img
            img = title(img, "EL DOLOR VIAJA POR LOS CABLES", t)
        else:
            z = ramp(t, 0.4, 1.0)
            for j in range(3):
                img = label(img, "z", (1330 + j * 40, 190 - j * 45), t, 0.4 + j * 0.3, 34 + j * 8, BLUE)
            Ld = lay(); circ(Ld, (1270, 290), 95); img = fill(img, Ld, np.array([0.30, 0.32, 0.45]), 0.45 * z)
            img = label(img, "EL MENSAJE LLEGA… PERO NADIE LO ATIENDE", (760, 860), t, 1.0, 30, BLUE); img = title(img, "LA ANESTESIA DESCONECTA AL QUE ESCUCHA", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 4) EL EJÉRCITO (vacuna)
def _virus(img, cx, cy, r, col, a=1.0, spikes=10, rot=0.0):
    L = lay(); circ(L, (cx, cy), r)
    for k in range(spikes):
        ang = k / spikes * 2 * math.pi + rot; line(L, [(cx + math.cos(ang) * r, cy + math.sin(ang) * r), (cx + math.cos(ang) * r * 1.4, cy + math.sin(ang) * r * 1.4)], 5)
        circ(L, (cx + math.cos(ang) * r * 1.45, cy + math.sin(ang) * r * 1.45), 7)
    return fill(img, L, col, a)
def r_ejercito(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "aprende"); base = paper(84)
    for i in range(N):
        t = i / FPS; img = base.copy()
        for k in range(5):
            x = 330 + k * 85; img = kid(img, x, 600, 0.9, BLUE, 0.9)
        if mode == "aprende":
            img = _virus(img, 1150, 520, 60, np.array([0.60, 0.70, 0.40]), 1.0, rot=t * 0.6)
            Lf = lay(); poly(Lf, [(560, 280), (760, 280), (760, 420), (560, 420)]); img = fill(img, Lf, np.array([0.97, 0.95, 0.88]))
            img = _virus(img, 660, 350, 32, np.array([0.60, 0.70, 0.40]), ramp(t, 0.8, 1.4), spikes=10)
            img = label(img, "SE APRENDE SU CARA", (660, 230), t, 1.0, 30, BLUE)
            img = label(img, "LA PRIMA DÉBIL (VACA)", (1150, 700), t, 0.3, 28); img = title(img, "LA VACUNA: EL EJÉRCITO APRENDE", t)
        else:
            dx = 300 * ease(ramp(t, 0.3, 1.4)); hit = ramp(t, 1.5, 2.2)
            img = _virus(img, 1250 - dx * 0.3, 520, 70, np.array([0.70, 0.18, 0.18]), 1.0 - 0.8 * ramp(t, 2.3, 3.0), rot=t * 0.8)
            Lf = lay(); poly(Lf, [(560, 280), (760, 280), (760, 420), (560, 420)]); img = fill(img, Lf, np.array([0.97, 0.95, 0.88]))
            img = _virus(img, 660, 350, 32, np.array([0.60, 0.70, 0.40]), 1.0, spikes=10)
            Ls = lay()
            for k in range(5): arrow(Ls, (370 + k * 85, 520), (1060 - dx * 0.3, 520 + (k - 2) * 30), 5) if hit > 0 else None
            img = fill(img, Ls, BLUE, 0.85 * hit)
            img = label(img, "¡ES ESA CARA!", (660, 230), t, 0.9, 34, RED); img = label(img, "LA PELIGROSA (VIRUELA)", (1150, 720), t, 0.3, 28, RED)
            img = title(img, "Y CUANDO LLEGA LA DE VERDAD…", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 5) LA LLAVE (insulina)
def _celula(img, cx, cy, r, door_open, hunger):
    L = lay(); circ(L, (cx, cy), r); img = fill(img, L, np.array([0.95, 0.78, 0.70]) * (1 - 0.25 * hunger))
    L = lay(); circ(L, (cx, cy), r, w=6); img = fill(img, L, INK, 0.6)
    Ld = lay(); poly(Ld, [(cx - r - 6, cy - 30), (cx - r + 18, cy - 30), (cx - r + 18, cy + 30), (cx - r - 6, cy + 30)]); img = fill(img, Ld, GREEN if door_open else RED, 0.9)
    return img
def r_llave(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "llave"); base = paper(85); r = _rng(7); S = r.uniform(0, 1, (40, 2))
    for i in range(N):
        t = i / FPS; img = base.copy()
        Lr = lay(); poly(Lr, [(0, 330), (1600, 330), (1600, 470), (0, 470)]); img = fill(img, Lr, BLOOD, 0.55)
        img = label(img, "LA SANGRE: UN RÍO CON AZÚCAR", (800, 290), t, 0.2, 28, BLOOD)
        open_ = mode == "llave" and t > 1.2
        cells = [(450, 690), (800, 700), (1150, 690)]
        Ls = lay()
        for k, (sx, sy) in enumerate(S):
            x = (sx * 1700 + t * 160) % 1700 - 50; y = 345 + sy * 110
            if open_ and k % 3 == 0:
                cx, cy = cells[k % 3 * 0 + (k // 3) % 3]; f = ramp(t, 1.2 + (k % 7) * 0.12, 1.9 + (k % 7) * 0.12)
                x = x + (cx - 130 - x) * f; y = y + (cy - y) * f
            circ(Ls, (x, y), 9)
        img = fill(img, Ls, SUGAR, 0.95)
        for cx, cy in cells: img = _celula(img, cx, cy, 120, open_, 0 if open_ else ramp(t, 0.5, 2.0))
        if mode == "llave":
            kx = 300 + 120 * ease(ramp(t, 0.3, 1.1))
            Lk = lay(); circ(Lk, (kx, 560), 22, w=8); line(Lk, [(kx + 22, 560), (kx + 80, 560)], 8); line(Lk, [(kx + 65, 560), (kx + 65, 580)], 6); img = fill(img, Lk, BRASS)
            img = label(img, "INSULINA = LA LLAVE", (800, 880), t, 0.6, 32, GREEN); img = title(img, "LA LLAVE ABRE LA CÉLULA", t)
        else:
            img = label(img, "SIN LLAVE: HAMBRE, RODEADAS DE COMIDA", (800, 880), t, 0.8, 30, RED); img = title(img, "SIN LA LLAVE", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 6) EL HALO (penicilina)
def r_halo(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(86, (0.14, 0.13, 0.12)); r = _rng(11)
    cx, cy, R = 800, 480, 330; pts = []
    while len(pts) < 900:
        x, y = r.uniform(-R, R, 2)
        if x * x + y * y < (R - 14) ** 2: pts.append((cx + x, cy + y))
    mx, my = cx + 150, cy - 120
    for i in range(N):
        t = i / FPS; img = base.copy()
        L = lay(); circ(L, (cx, cy), R); img = fill(img, L, np.array([0.86, 0.78, 0.52]), 0.9)
        L = lay(); circ(L, (cx, cy), R, w=10); img = fill(img, L, GLASS, 0.7)
        g = ease(ramp(t, 0.3, 1.2)); halo = 175 * ease(ramp(t, 1.0, DUR * 0.8))
        Lb = lay()
        for x, y in pts:
            if math.hypot(x - mx, y - my) > halo: circ(Lb, (x, y), 5)
        img = fill(img, Lb, np.array([0.93, 0.92, 0.80]), 0.95)
        Lm = lay()
        for k in range(26):
            a = k * 2.4; rr = 20 + 50 * ((k * 37) % 13) / 13 * g
            circ(Lm, (mx + math.cos(a) * rr, my + math.sin(a) * rr), 26 * g + 4)
        img = fill(img, Lm, MOLD, 0.95)
        if halo > 60:
            Lh = lay(); circ(Lh, (mx, my), halo, w=3); img = fill(img, Lh, RED, 0.5 * ramp(t, 1.5, 2.2))
        img = label(img, "MOHO", (mx, my - 120), t, 0.8, 30, np.array([0.92, 0.90, 0.82]))
        img = label(img, "BACTERIAS", (cx - 240, cy + 260), t, 0.3, 28, np.array([0.92, 0.90, 0.82]))
        img = label(img, "EL CÍRCULO LIMPIO", (1310, 760), t, 1.8, 32, RED)
        Lt = lay(); txt(Lt, "QUÉ RARO…", (800, 80), 52, "AN", "mm", ramp(t, 0.25, 0.8)); img = fill(img, Lt, np.array([0.95, 0.92, 0.85]), 0.9)
        out(put, img, t, DUR, i, c=(0.5, 0.5))

# ------------------------------------------------------------------ 7) EL TRÁFICO (coagulación)
def r_trafico(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "normal"); base = paper(87)
    for i in range(N):
        t = i / FPS; img = base.copy()
        Lr = lay(); poly(Lr, [(0, 380), (1600, 380), (1600, 560), (0, 560)]); img = fill(img, Lr, np.array([0.45, 0.43, 0.42]), 0.9)
        Ll = lay(); dashed(Ll, [(0, 470), (1600, 470)], 5, 40); img = fill(img, Ll, np.array([0.95, 0.92, 0.80]), 0.8)
        hx = 900; Lh = lay(); poly(Lh, [(hx - 60, 560), (hx + 60, 560), (hx + 40, 620), (hx - 40, 620)]); img = fill(img, Lh, INK, 0.9)
        Lc = lay()
        for k in range(8):
            x = (k * 210 + t * 220) % 1700 - 80; circ(Lc, (x, 420 + (k % 2) * 90), 16)
        img = fill(img, Lc, BLOOD, 0.9)
        leak = 1.0
        if mode == "normal":
            u = ease(ramp(t, 0.5, 2.0)); tx = -150 + (hx - 60 + 150) * u
            Lt = lay(); poly(Lt, [(tx, 495), (tx + 120, 495), (tx + 120, 545), (tx, 545)]); circ(Lt, (tx + 25, 552), 12); circ(Lt, (tx + 95, 552), 12); img = fill(img, Lt, np.array([0.95, 0.80, 0.25]))
            plug = ramp(t, 2.0, 2.6); leak = 1 - plug
            Lp = lay(); poly(Lp, [(hx - 60, 560), (hx + 60, 560), (hx + 40, 600), (hx - 40, 600)]); img = fill(img, Lp, np.array([0.95, 0.80, 0.25]), plug)
            img = label(img, "LA COAGULACIÓN TAPA EL AGUJERO", (800, 820), t, 1.2, 32, GREEN); img = title(img, "LA SANGRE ES UNA CIUDAD CON TRÁFICO", t)
        else:
            Lx = lay(); line(Lx, [(200, 520), (300, 540)], 6); img = fill(img, Lx, RED, 0.9)
            img = label(img, "LOS CAMIONES NO LLEGAN", (800, 820), t, 0.8, 32, RED); img = title(img, "EL TRÉBOL PODRIDO", t)
        Ld = lay()
        for k in range(6): circ(Ld, (hx + (k - 2.5) * 12, 640 + ((t * 180 + k * 37) % 160)), 10)
        img = fill(img, Ld, BLOOD, 0.9 * leak)
        img = label(img, "HERIDA", (hx + 160, 600), t, 0.2, 28, RED)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 8) LA CANILLA (nitroglicerina)
def r_canilla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(88)
    for i in range(N):
        t = i / FPS; img = base.copy(); o = ease(ramp(t, 0.8, 2.2)); w = 30 + 70 * o
        Lp = lay(); poly(Lp, [(200, 470 - w), (1400, 470 - w), (1400, 470 + w), (200, 470 + w)]); img = fill(img, Lp, BLOOD, 0.35)
        Lw = lay(); line(Lw, [(200, 470 - w), (1400, 470 - w)], 8); line(Lw, [(200, 470 + w), (1400, 470 + w)], 8); img = fill(img, Lw, INK, 0.8)
        Ld = lay()
        for k in range(18):
            x = 200 + ((k * 73 + t * (260 + 200 * o)) % 1200); y = 470 + ((k * 41) % 7 - 3) / 3 * (w - 18)
            circ(Ld, (x, y), 12)
        img = fill(img, Ld, BLOOD, 0.9)
        Lv = lay(); circ(Lv, (800, 470 - w - 60), 36, w=8); line(Lv, [(800, 470 - w - 24), (800, 470 - w)], 10); img = fill(img, Lv, BRASS)
        Lh = lay(); line(Lh, [(800 - 50 * math.cos(o * 1.6), 470 - w - 60 - 50 * math.sin(o * 1.6)), (800 + 50 * math.cos(o * 1.6), 470 - w - 60 + 50 * math.sin(o * 1.6))], 10); img = fill(img, Lh, INK)
        img = label(img, "ARTERIA APRETADA" if o < 0.5 else "ARTERIA ABIERTA", (800, 720), t, 0.2, 32, RED if o < 0.5 else GREEN)
        img = label(img, "MÁS SANGRE · MENOS PRESIÓN", (800, 800), t, 2.0, 30, BLUE); img = title(img, "LA NITROGLICERINA ABRE LA CANILLA", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 9) EL DIRECTOR (marcapasos)
def r_director(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "director"); base = paper(89, (0.08, 0.10, 0.09) if mode == "pulso" else None) if mode == "pulso" else paper(89)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "pulso":
            Lg = lay()
            for k in range(9): line(Lg, [(200, 220 + k * 70), (1400, 220 + k * 70)], 1)
            for k in range(13): line(Lg, [(200 + k * 100, 220), (200 + k * 100, 780)], 1)
            img = fill(img, Lg, SCREEN, 0.15)
            L = lay(); pts = []
            for x in np.linspace(200, 1400, 600):
                ph = ((x - 200) / 300 - t) % 1.0; v = math.exp(-((ph - 0.5) * 40) ** 2) * 220
                if (x - 200) / 1200 < ((t * 0.25) % 1.2): pts.append((x, 520 - v))
            if len(pts) > 2: line(L, pts, 5)
            img = fill(img, cv2.GaussianBlur(L, (0, 0), 6 * U), SCREEN, 0.6); img = fill(img, L, SCREEN, 0.95)
            img = label(img, "UN PULSO · UN SEGUNDO · OTRO PULSO", (800, 860), t, 0.5, 30, SCREEN)
            Lt = lay(); txt(Lt, "EL ERROR DE GREATBATCH", (800, 110), 52, "AN", "mm", ramp(t, 0.25, 0.8)); img = fill(img, Lt, SCREEN * 0.9, 0.9)
        else:
            beat = (t % 1.0); up = math.exp(-(beat * 6) ** 2); fall = mode == "falla" and t > 1.2
            ang = (-0.9 + 1.2 * up) if not fall else 1.3 * ease(ramp(t, 1.2, 1.8))
            Lc = lay(); circ(Lc, (800, 330), 36); poly(Lc, [(770, 365), (830, 365), (845, 520), (755, 520)]); img = fill(img, Lc, INK, 0.9)
            Lb = lay(); line(Lb, [(830, 400), (830 + math.cos(ang) * 150, 400 - math.sin(ang) * 150)], 6); img = fill(img, Lb, BRASS)
            for k in range(7):
                x = 330 + k * 157; j = 0 if fall else up * 14
                col = [RED, BLUE, GREEN, BRASS, RED, BLUE, GREEN][k]
                img = kid(img, x, 700 - j * (1 if not fall else 0) + (k % 2) * 8 * (fall * math.sin(t * 13 + k)), 0.75, col, 0.85)
            Lh = lay()
            if not fall:
                for k in range(3): circ(Lh, (800, 600), 60 + k * 50 + beat * 40, w=3)
            img = fill(img, Lh, RED, 0.4 * up)
            if mode == "director":
                img = label(img, "UNA SEÑAL POR SEGUNDO: TODOS TOCAN JUNTOS", (800, 860), t, 0.6, 30, RED); img = title(img, "EL MARCAPASOS NATURAL: UN DIRECTOR", t)
            else:
                img = label(img, "SI EL DIRECTOR SE DESMAYA…", (800, 860), t, 1.3, 32, RED); img = title(img, "CUANDO LA SEÑAL FALLA", t)
        out(put, img, t, DUR, i, c=(0.5, 0.5))

# ------------------------------------------------------------------ 10) LOS RAYOS (Röntgen)
def _hueso(L, x0, y0, x1, y1, w):
    line(L, [(x0, y0), (x1, y1)], w); circ(L, (x0, y0), w * 0.7); circ(L, (x1, y1), w * 0.7)
def r_rayos(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "objetos"); base = paper(90, (0.06, 0.06, 0.07))
    objs = [("LIBRO", 1, WOOD * 0.7), ("MADERA", 1, WOOD), ("PLOMO", 0, LEAD)]
    for i in range(N):
        t = i / FPS; img = base.copy()
        Lt = lay(); poly(Lt, [(150, 400), (420, 400), (420, 560), (150, 560)]); img = fill(img, Lt, np.array([0.10, 0.10, 0.10]))
        img = label(img, "TUBO TAPADO", (285, 610), t, 0.2, 26, np.array([0.85, 0.85, 0.85]))
        Ls = lay(); poly(Ls, [(1240, 300), (1320, 300), (1320, 660), (1240, 660)])
        if mode == "objetos":
            k = min(2, int(t / (DUR / 3.0))); nm, passes, col = objs[k]
            glow = 1.0 if passes else 0.05
            img = fill(img, cv2.GaussianBlur(Ls, (0, 0), 26 * U), SCREEN, 0.6 * glow); img = fill(img, Ls, SCREEN * (0.25 + 0.75 * glow))
            Lr = lay()
            for j in range(9): dashed(Lr, [(430, 420 + j * 15), (760 if not passes else 1230, 420 + j * 15)], 2, 18)
            img = fill(img, Lr, SCREEN, 0.25)
            Lo = lay(); poly(Lo, [(770, 360), (850, 360), (850, 600), (770, 600)]); img = fill(img, Lo, col)
            img = label(img, nm, (810, 660), t, 0.0, 34, np.array([0.95, 0.92, 0.85]))
            img = label(img, "SIGUE BRILLANDO" if passes else "SE APAGA", (1280, 730), t, 0.0, 32, SCREEN if passes else RED)
        else:
            img = fill(img, cv2.GaussianBlur(Ls, (0, 0), 26 * U), SCREEN, 0.6); img = fill(img, Ls, SCREEN)
            Lscr = lay(); poly(Lscr, [(950, 250), (1450, 250), (1450, 720), (950, 720)]); img = fill(img, cv2.GaussianBlur(Lscr, (0, 0), 30 * U), SCREEN, 0.35); img = fill(img, Lscr, SCREEN * 0.8)
            wig = 6 * math.sin(t * 2.0)
            Lh = lay()
            for k in range(4):
                bx = 1100 + k * 55; _hueso(Lh, bx, 640, bx + wig * 0.3, 520, 18); _hueso(Lh, bx + wig * 0.3, 505, bx + wig, 420 - abs(k - 1.5) * 15, 14); _hueso(Lh, bx + wig, 405 - abs(k - 1.5) * 15, bx + wig * 1.3, 340 - abs(k - 1.5) * 25, 12)
            _hueso(Lh, 1060, 640, 1010, 560, 18); _hueso(Lh, 1005, 545, 980, 480, 14)
            img = fill(img, Lh, np.array([0.05, 0.20, 0.08]), 0.9)
            img = label(img, "LOS HUESOS DE SU PROPIA MANO", (800, 830), t, 0.6, 32, SCREEN)
        Lx = lay(); txt(Lx, "RAYOS X", (800, 110), 56, "AN", "mm", ramp(t, 0.25, 0.8)); img = fill(img, Lx, SCREEN * 0.9, 0.9)
        out(put, img, t, DUR, i, c=(0.5, 0.5))

# ------------------------------------------------------------------ 11) LAS CÉLULAS (cisplatino)
def r_celulas(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "normal"); base = paper(91)
    for i in range(N):
        t = i / FPS; img = base.copy(); u = (t / DUR)
        for k in range(3):
            cx, cy = 380 + k * 420, 500
            if mode == "normal":
                s = ease(ramp((t + k * 0.4) % 2.4, 0.4, 1.8)); d = 70 * s
                L = lay()
                if s < 0.5: poly(L, [(cx - 70 - d, cy - 60), (cx + 70 + d, cy - 60), (cx + 70 + d, cy + 60), (cx - 70 - d, cy + 60)])
                else:
                    circ(L, (cx - 40 - d, cy), 62); circ(L, (cx + 40 + d, cy), 62)
                img = fill(img, L, BAC, 0.85)
            else:
                ln = 70 + 120 * ease(ramp(t, 0.3 + k * 0.2, DUR * 0.85)); L = lay()
                line(L, [(cx - ln + 30 * math.sin(a), cy + (a - 3) * 18 * math.sin(t + k)) for a in np.linspace(0, 6, 3)] + [(cx + ln, cy)], 40)
                img = fill(img, L, BAC, 0.85)
        if mode == "normal": img = label(img, "SE PARTEN EN DOS", (800, 760), t, 0.5, 32, GREEN); img = title(img, "ASÍ SE MULTIPLICAN LAS CÉLULAS", t)
        else: img = label(img, "CRECEN COMO FIDEOS… Y NO SE PARTEN", (800, 760), t, 0.8, 32, RED); img = title(img, "CON UN POCO DE PLATINO", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 12) EL PARABRISAS (vidrio laminado)
def r_parabrisas(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(92); r = _rng(3)
    cracks = [(r.uniform(0, 2 * math.pi), r.uniform(150, 230)) for _ in range(14)]; frag = r.uniform(-1, 1, (26, 2))
    for i in range(N):
        t = i / FPS; img = base.copy(); hit = ramp(t, 0.8, 1.0); fall = ease(ramp(t, 1.0, 2.2))
        for k, (cx, nm) in enumerate([(470, "VIDRIO COMÚN"), (1130, "VIDRIO LAMINADO")]):
            cy = 470
            if k == 0:
                Lf = lay()
                for fx, fy in frag:
                    x = cx + fx * 190; y = cy + fy * 170 + fall * (300 + 140 * abs(fy)) * hit
                    poly(Lf, [(x - 18, y - 14), (x + 20, y - 8), (x + 10, y + 18), (x - 16, y + 12)])
                img = fill(img, Lf, GLASS, 0.85)
                if hit < 1:
                    Lg = lay(); poly(Lg, [(cx - 210, cy - 190), (cx + 210, cy - 190), (cx + 210, cy + 190), (cx - 210, cy + 190)]); img = fill(img, Lg, GLASS, 0.7 * (1 - hit))
            else:
                Lg = lay(); poly(Lg, [(cx - 210, cy - 190), (cx + 210, cy - 190), (cx + 210, cy + 190), (cx - 210, cy + 190)]); img = fill(img, Lg, GLASS, 0.7)
                Lc = lay()
                for a, rr in cracks: line(Lc, [(cx, cy), (cx + math.cos(a) * rr * hit, cy + math.sin(a) * rr * hit)], 3)
                for j in range(3): circ(Lc, (cx, cy), (40 + j * 50) * hit, w=2)
                img = fill(img, Lc, np.array([0.97, 0.98, 1.0]), 0.95)
                Lm = lay(); line(Lm, [(cx - 210, cy + 200), (cx + 210, cy + 200)], 6); img = fill(img, Lm, BRASS, 0.8)
            img = label(img, nm, (cx, 760), t, 0.2, 32, RED if k == 0 else GREEN)
        img = label(img, "LA CAPA DE PLÁSTICO LOS MANTIENE EN SU LUGAR", (800, 850), t, 2.0, 28, BLUE)
        img = title(img, "EL FRASCO QUE NO SE DESARMÓ", t)
        out(put, img, t, DUR, i)
