# comp9.py — componentes de tgbiro (el bolígrafo, oct-2026): física de la tinta "como para un chico de 10 años"
#   r_trazo       hilo de suspenso: la hoja de pruebas de la calle Oro (NADA → MANCHA → CORTADO → LÍNEA) con la punta que raspa
#   r_viscosidad  agua vs miel por una pajita fina; modos cocina / tinta / trampa / imprenta
#   r_bolilla     corte de la punta: gira / curva / cierra / floja / gravedad / tapa / ranuras / capilar / escribe
#   r_presion     el pistón que empuja la tinta (pasta de dientes): piston / ambas
#   r_capilar     pajita con el dedo arriba / servilleta que chupa el café / la pluma "pipeta"
#   r_altura      champú en la valija: la burbuja de aire se infla al subir; modos champu / pluma / birome
import math, numpy as np, cv2
from cine import W, H, film, ease, ramp, fbm
from comp4 import wood_bg
from comp6 import U, FPS, INK, RED, BLUE, BRASS, lay, line, poly, circ, arrow, dashed, txt, ink, cam, stamp, paper, P

STEEL = np.array([0.62, 0.64, 0.68]); HONEY = np.array([0.80, 0.52, 0.12]); COFFEE = np.array([0.42, 0.24, 0.12]); BLACKINK = np.array([0.07, 0.07, 0.09])
GREEN = np.array([0.20, 0.48, 0.24]); WATERB = np.array([0.30, 0.55, 0.85]); PAPERC = np.array([0.95, 0.93, 0.86])

def fill(img, L, col, a=1.0): return ink(img, np.clip(L, 0, 1), col, a)
def ball(img, c, r, rot=0.0, wet=0.0):
    """bolita de acero con brillo; un punto oscuro marca el giro; wet = capa de tinta arriba"""
    L = lay(); circ(L, c, r); img = fill(img, L, STEEL * 0.78)
    Lh = lay(); circ(Lh, (c[0] - r * 0.30, c[1] - r * 0.32), r * 0.42); Lh = cv2.GaussianBlur(Lh, (0, 0), r * U * 0.18) * L
    img = img + Lh[..., None] * 0.35
    Ls = lay(); circ(Ls, (c[0] + r * 0.18, c[1] + r * 0.2), r * 0.95); Ls = np.clip(L - Ls, 0, 1); img = img * (1 - Ls[..., None] * 0.35)
    if wet > 0:
        Lw = lay()
        for k in range(18):
            a0 = rot + k * 0.1
            line(Lw, [(c[0] + math.cos(a0) * r, c[1] + math.sin(a0) * r), (c[0] + math.cos(a0 + 0.1) * r, c[1] + math.sin(a0 + 0.1) * r)], 7)
        img = fill(img, Lw, BLUE, 0.9 * wet)
    Ld = lay(); circ(Ld, (c[0] + math.cos(rot) * r * 0.62, c[1] + math.sin(rot) * r * 0.62), r * 0.13); img = fill(img, Ld * L, INK, 0.55)
    Lo = lay(); circ(Lo, c, r, w=3); return fill(img, Lo, INK, 0.7)
def title(img, s, t, y=110, px=52):
    Lt = lay(); txt(Lt, s, (800, y), px, "AN", "mm", ramp(t, 0.25, 0.8)); return fill(img, Lt, INK, 0.9)
def label(img, s, xy, t, t0, px=30, col=INK, anchor="mm"):
    Lt = lay(); txt(Lt, s, xy, px, "SC", anchor, ramp(t, t0, t0 + 0.4)); return fill(img, Lt, col, 0.9)
def drops(img, pts, col=BLUE, r=10):
    L = lay()
    for (x, y) in pts:
        poly(L, [(x - r * 0.7, y), (x, y - r * 1.9), (x + r * 0.7, y)]); circ(L, (x, y), r)
    return fill(img, L, col, 0.92)

# ------------------------------------------------------------------ la punta en corte (base de bolilla / presion / altura)
def punta(img, cx, cy, t, s=1.0, ink_top=None, wide=50, gap=0.0, push=0.0, rot=0.0, wet=0.0, grooves=False, groove_flow=0.0, sealed=False):
    """tubo de latón visto en corte, asiento cónico y bolita; cy = centro de la bolita. Devuelve img."""
    r = 34 * s; seat = cy - r * 0.55 - push; top = cy - 420 * s
    ink_top = top + 30 * s if ink_top is None else ink_top
    inner = [(cx - wide * s, ink_top), (cx + wide * s, ink_top), (cx + wide * s, seat - 70 * s), (cx + (r * 0.78 + gap), seat), (cx - (r * 0.78 + gap), seat), (cx - wide * s, seat - 70 * s)]
    Li = lay(); poly(Li, inner); img = fill(img, Li, BLUE, 0.88)
    if ink_top > top + 40 * s:                                       # aire arriba
        La = lay(); poly(La, [(cx - wide * s, top), (cx + wide * s, top), (cx + wide * s, ink_top), (cx - wide * s, ink_top)]); img = fill(img, La, np.array([0.86, 0.90, 0.95]), 0.5)
    Lw = lay()
    for sg in (-1, 1):
        poly(Lw, [(cx + sg * wide * s, top), (cx + sg * (wide + 16) * s, top), (cx + sg * (wide + 16) * s, seat - 70 * s), (cx + sg * (r * 0.78 + 16 * s), seat + r * 0.45),
                  (cx + sg * (r * 0.78), seat + r * 0.45 - 2), (cx + sg * (r * 0.78 + gap), seat), (cx + sg * wide * s, seat - 70 * s)])
    img = fill(img, Lw, BRASS * 0.95)
    Le = lay(); line(Le, [(cx - (wide + 16) * s, top), (cx - (wide + 16) * s, seat - 70 * s), (cx - (r * 0.78 + 16 * s), seat + r * 0.45)], 3)
    line(Le, [(cx + (wide + 16) * s, top), (cx + (wide + 16) * s, seat - 70 * s), (cx + (r * 0.78 + 16 * s), seat + r * 0.45)], 3); img = fill(img, Le, INK, 0.6)
    if grooves:
        Lg = lay()
        for sg in (-1, 1):
            line(Lg, [(cx + sg * (r * 0.55), seat - 40 * s), (cx + sg * (r * 0.95), seat + r * 0.55)], 9)
        img = fill(img, Lg, BLUE, 0.95)
        if groove_flow > 0:
            La = lay()
            for sg in (-1, 1):
                ph = (t * 1.2) % 1.0; arrow(La, (cx + sg * r * 1.6, seat - 60 * s + ph * 30), (cx + sg * r * 1.15, seat + r * 0.6 + ph * 30), 4, 16, groove_flow)
            img = fill(img, La, RED, 0.8)
    img = ball(img, (cx, cy - push), r, rot, wet)
    if sealed:
        Lx = lay(); circ(Lx, (cx, seat - 4), r * 0.95, w=6); img = fill(img, Lx, RED, 0.85)
    return img
def hoja(img, y, t, trail=None, col=BLUE):
    Lp = lay(); poly(Lp, [(0, y), (1600, y), (1600, 900), (0, 900)]); img = fill(img, Lp, PAPERC, 1.0)
    Ll = lay(); line(Ll, [(0, y), (1600, y)], 3); img = fill(img, Ll, INK, 0.5)
    if trail:
        Lt = lay(); line(Lt, trail, 7); img = fill(img, Lt, col, 0.9)
    return img

# ------------------------------------------------------------------ 1) TRAZO · hilo de suspenso
ETAPAS = ["NADA", "MANCHA", "CORTADO", "LÍNEA"]
def _stroke(L, lv, x0, x1, y, prog, seed):
    g = np.random.default_rng(seed); xe = x0 + (x1 - x0) * prog
    pts = [(x, y + 6 * math.sin(x / 47.0) + 3 * math.sin(x / 13.0)) for x in np.linspace(x0, max(x0 + 1, xe), 120)]
    if lv == 0:                                                       # raspado seco: sólo una marca pálida
        line(L, pts, 2, 0.18)
    elif lv == 1:
        line(L, pts, 3, 0.35)
        for k in range(4):
            bx = x0 + (k + 0.6) * (x1 - x0) / 4.3
            if bx < xe: circ(L, (bx, y + g.normal() * 3), 16 + 10 * g.random(), 0.95)
    elif lv == 2:
        n = len(pts); seg = 0
        while seg < n - 1:
            a = seg; b = min(n - 1, seg + 6 + int(g.integers(0, 10)))
            line(L, pts[a:b + 1], 6, 0.95); seg = b + 4 + int(g.integers(0, 8))
    else:
        line(L, pts, 6, 0.97)
def r_trazo(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); a0 = int(sh.get("from", 0)); a1 = int(sh.get("to", a0))
    bg = wood_bg(W, H, seed=41, dark=0.42)
    # hoja de papel rayado sujeta con dos tachuelas, levemente girada
    sheet = lay(); poly(sheet, [(250, 120), (1350, 105), (1365, 840), (262, 855)])
    rules = lay()
    for k in range(13): line(rules, [(270, 190 + k * 52), (1350, 176 + k * 52)], 2, 0.6)
    line(rules, [(360, 115), (372, 850)], 2, 0.8)
    tacks = lay(); circ(tacks, (300, 150), 13); circ(tacks, (1310, 138), 13)
    shadow = cv2.GaussianBlur(np.roll(sheet, (int(14 * U), int(18 * U)), (0, 1)), (0, 0), 14 * U)
    hist = lay()                                                     # intentos anteriores (renglones de arriba)
    rows = [250, 354, 458, 562]
    for k in range(0, a0 + 1 if a1 > a0 else a0): _stroke(hist, k, 420, 1290, rows[k], 1.0, 7 + k)   # todo lo ya probado, incluido el FROM
    for i in range(N):
        t = i / FPS
        img = bg * (1 - shadow[..., None] * 0.5)
        img = fill(img, sheet, PAPERC, 1.0); img = fill(img, rules * sheet, np.array([0.55, 0.68, 0.82]), 0.55)
        img = fill(img, hist, BLUE, 0.9)
        prog = ease(ramp(t, 0.5, DUR * 0.72)); lv = a1
        if a1 > a0:                                                   # se dibuja el intento NUEVO en su renglón
            cur = lay(); _stroke(cur, lv, 420, 1290, rows[lv], prog, 7 + lv); img = fill(img, cur, BLUE, 0.9)
        else:
            cur = lay(); _stroke(cur, lv, 420, 1290, rows[lv], prog, 7 + lv); img = fill(img, cur, BLUE, 0.9)
        # la punta de latón que avanza
        xe = 420 + 870 * prog; ye = rows[lv] + 6 * math.sin(xe / 47.0)
        Lp = lay(); poly(Lp, [(xe, ye - 8), (xe + 260, ye - 330), (xe + 300, ye - 300), (xe + 18, ye + 2)]); img = fill(img, Lp, BRASS * 0.9)
        Lps = cv2.GaussianBlur(np.roll(Lp, (int(26 * U), int(30 * U)), (0, 1)), (0, 0), 10 * U); img = img * (1 - Lps[..., None] * 0.25)
        img = ball(img, (xe + 6, ye - 4), 9)
        img = fill(img, tacks, BRASS * 0.8)
        for k in range(lv + 1):                                       # rótulos de cada renglón
            Lr = lay(); txt(Lr, ETAPAS[k], (1300, rows[k] - 22), 24, "SC", "rm", 1.0 if k < lv or (k == lv and prog > 0.85) else 0.0); img = fill(img, Lr, RED, 0.75)
        if prog > 0.9: img = stamp(img, ETAPAS[lv], (1140, rows[lv] + 90), 46, t, DUR * 0.72 + 0.35, RED if lv < 3 else GREEN * 0.9)
        Lt = lay(); txt(Lt, sh.get("title", "CALLE ORO 3040 · 1943"), (800, 62), 42, "AN", "mm", ramp(t, 0.1, 0.5)); img = fill(img, Lt, np.array([0.94, 0.90, 0.80]), 0.95)
        put(film(cam(img, t, DUR, 1.0, 1.07, (0.5 + 0.12 * (prog - 0.5), 0.45)), t, i, "warm", halation=0.2))

# ------------------------------------------------------------------ 2) VISCOSIDAD · agua vs miel
def _tubo(img, cx, t, col, flow, top=330, bot=660, w=26, stuck=False, label_=None, t0=0.6, stain=None, side=-1):
    """tubo finito vertical (pajita / canal de la pluma): flow 0..1 cuánto pasa"""
    Lw = lay(); line(Lw, [(cx - w, top), (cx - w, bot)], 5); line(Lw, [(cx + w, top), (cx + w, bot)], 5); img = fill(img, Lw, INK, 0.55)
    Lr = lay(); poly(Lr, [(cx - 150, top - 120), (cx + 150, top - 120), (cx + w + 4, top), (cx - w - 4, top)]); img = fill(img, Lr, col, 0.9)   # el embudo/depósito
    if stuck:
        bul = 10 + 6 * math.sin(t * 1.3)
        Lc = lay(); poly(Lc, [(cx - w + 3, top), (cx + w - 3, top), (cx + w - 3, top + 70 + bul), (cx - w + 3, top + 70 + bul)]); img = fill(img, Lc, col, 0.92)
        Lb = lay(); circ(Lb, (cx, top + 70 + bul), w - 3); img = fill(img, Lb, col, 0.92)
    else:
        y = top + (bot - top) * min(1, flow * 1.4)
        Lc = lay(); poly(Lc, [(cx - w + 3, top), (cx + w - 3, top), (cx + w - 3, y), (cx - w + 3, y)]); img = fill(img, Lc, col, 0.85)
        if flow > 0.7:
            ds = [(cx, bot + 30 + ((t * 2.2 + k / 3) % 1.0) * 140) for k in range(3)]; img = drops(img, ds, col, 12)
    if stain is not None and stain > 0:
        Ls = lay(); circ(Ls, (cx, 880), 30 + 70 * stain); Ls = cv2.GaussianBlur(Ls, (0, 0), 8 * U); img = fill(img, Ls, col, 0.75)
    lx = cx + side * (300 if side < 0 else 255)                                              # rótulo AL COSTADO del tubo: ni el título ni la gota lo tapan
    if label_: img = label(img, label_[0], (lx, 470), t, t0, 34); img = label(img, label_[1], (lx, 515), t, t0 + 0.3, 28, RED if "NO" in label_[1] or "MANCHA" in label_[1] else GREEN)
    return img
def r_viscosidad(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "cocina"); base = paper(44)
    for i in range(N):
        t = i / FPS; f = ease(ramp(t, 0.5, DUR * 0.8)); img = base.copy()
        if mode == "cocina":
            img = title(img, "FINITO PASA · ESPESO NO", t)
            img = _tubo(img, 520, t, WATERB, f, label_=("AGUA CON COLOR", "PASA SOLA"))
            img = _tubo(img, 1080, t, HONEY, 0, side=1, stuck=True, label_=("MIEL", "SE QUEDA PEGADA"), t0=1.0)
        elif mode in ("tinta", "trampa"):
            img = title(img, "LA TRAMPA DE LA TINTA" if mode == "trampa" else "LA TINTA DE LA PLUMA", t)
            img = _tubo(img, 520, t, BLUE, f, label_=("TINTA DE PLUMA", "CORRE · PERO MANCHA"), stain=f if mode == "trampa" or t > DUR * 0.5 else 0)
            img = _tubo(img, 1080, t, BLACKINK, 0, side=1, stuck=True, label_=("TINTA DE IMPRENTA", "NO MANCHA · PERO NO PASA"), t0=1.0 if mode == "tinta" else 0.6)
            if mode == "trampa":
                Lq = lay(); txt(Lq, "?", (800, 470), 160, "AN", "mm", ramp(t, DUR * 0.45, DUR * 0.6)); img = fill(img, Lq, RED, 0.85)
        else:                                                         # imprenta: se seca al instante vs tarda
            img = title(img, "¿CUÁNTO TARDA EN SECARSE?", t)
            for k, (cx, col, dt, s1, s2) in enumerate([(500, BLUE, 6.0, "PLUMA FUENTE", "UN MINUTO · MOJADA"), (1100, BLACKINK, 0.4, "TINTA DE DIARIO", "AL INSTANTE · SECA")]):
                Lb = lay(); poly(Lb, [(cx - 200, 380), (cx + 200, 380), (cx + 200, 470), (cx - 200, 470)]); Lb = cv2.GaussianBlur(Lb, (0, 0), 3 * U); img = fill(img, Lb, col, 0.85)
                wet = 1 - ramp(t, 0.6, 0.6 + dt)
                Lh = lay(); poly(Lh, [(cx - 180, 392), (cx + 120, 392), (cx + 100, 402), (cx - 190, 402)]); img = img + (Lh * wet * 0.45)[..., None]
                a = ramp(t, 0.6, 0.6 + min(dt, DUR)); Lc = lay(); circ(Lc, (cx, 600), 52, w=5)
                line(Lc, [(cx, 600), (cx + math.sin(a * 2 * math.pi) * 40, 600 - math.cos(a * 2 * math.pi) * 40)], 5); img = fill(img, Lc, INK, 0.8)
                img = label(img, s1, (cx, 700), t, 0.5, 34); img = label(img, s2, (cx, 745), t, 0.9, 28, RED if k == 0 else GREEN)
        put(film(cam(img, t, DUR, 1.0, 1.04, (0.5, 0.5)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ 3) BOLILLA · la punta por dentro
BOL_TIT = {"gira": "LA BOLITA GIRA Y DEJA LA TINTA", "curva": "GIRA PARA CUALQUIER LADO", "cierra": "SI NO ESCRIBES, LA BOLITA TAPA", "floja": "FLOJA: SE ESCAPA · APRETADA: SE TRABA",
           "gravedad": "LA TINTA BAJA SOLA, POR SU PESO", "tapa": "AL APRETAR, LA BOLITA TAPA", "ranuras": "RANURAS EN EL ASIENTO", "capilar": "UN TUBO FINITO, COMO UNA PAJITA",
           "escribe": "LA BOLITA SE LLEVA UNA CAPA FINITA"}
def r_bolilla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "gira"); base = paper(47); cx, cy = 800, 720
    for i in range(N):
        t = i / FPS; u = ease(t / DUR); img = base.copy()
        if mode == "curva":                                           # vista de arriba: dibuja una firma
            img = hoja(img, 0, t)
            pts = [(300 + 1000 * (k / 200) + 90 * math.sin(k / 9.0), 470 + 170 * math.sin(k / 23.0) + 60 * math.cos(k / 7.0)) for k in range(int(200 * ease(ramp(t, 0.3, DUR * 0.85))) + 1)]
            Lt = lay(); line(Lt, pts, 7); img = fill(img, Lt, BLUE, 0.9)
            img = ball(img, pts[-1], 30, t * 9, 0.6)
            img = title(img, BOL_TIT[mode], t, 100)
        else:
            trail_x = 0; rot = 0; wet = 0; push = 0; gap = 0; sealed = False; grooves = False; flow = 0; ink_top = None; wide = 50; ds = []
            if mode == "gira":
                rot = t * 3.2; wet = 1.0; trail_x = cx - 30
            elif mode == "escribe":
                rot = t * 3.2; wet = 1.0; trail_x = cx - 30; ink_top = cy - 400 + 120 * u; wide = 24
            elif mode == "cierra":
                lift = 60 * ease(ramp(t, 0.5, 1.4)); cy_ = cy - lift; push = 0
            elif mode == "floja":
                phase = ramp(t, DUR * 0.5, DUR * 0.6)
                gap = 14 * (1 - phase); rot = t * 3 * (1 - phase)
                if phase < 1: ds = [(cx + sg * 50, cy + 20 + ((t * 1.6 + k / 2) % 1.0) * 160) for sg in (-1, 1) for k in range(2)]
                push = -6 * phase
            elif mode == "gravedad":
                ink_top = cy - 360 + 20 * math.sin(t); wide = 64
            elif mode == "tapa":
                push = 12 * ease(ramp(t, 0.8, 1.4)); sealed = t > 1.5; rot = t * 3 * (1 - ramp(t, 0.8, 1.4)); trail_x = cx - 30 if t < 1.4 else 0
            elif mode == "ranuras":
                grooves = True; flow = ramp(t, 0.8, 1.4); rot = t * 3; wet = flow; trail_x = cx - 30
            elif mode == "capilar":
                wide = 22; ink_top = cy - 380
            yb = cy + 34
            if mode == "cierra": yb = cy + 34
            trail = [(0, yb), (cx - 30, yb)] if trail_x and (mode != "tapa" or t < 1.4) else ([(0, yb), (cx - 120, yb)] if mode == "tapa" else None)
            if mode == "tapa" and t >= 1.4:
                pts = [(x, yb) for x in range(int(cx - 120), int(cx - 30), 40)]; trail = [(0, yb), (cx - 120, yb)]
            img = hoja(img, yb, t, trail)
            cyy = cy - (60 * ease(ramp(t, 0.5, 1.4)) if mode == "cierra" else 0)
            img = punta(img, cx, cyy, t, 1.0, ink_top, wide, gap, push, rot, wet, grooves, flow, sealed)
            if ds: img = drops(img, ds, BLUE, 9)
            if mode in ("gira", "escribe", "ranuras"):
                La = lay(); arrow(La, (cx + 160, cy - 80), (cx + 160, cy + 20), 4, 16, ramp(t, 0.6, 1.0)); img = fill(img, La, RED, 0.7)
                img = label(img, "ARRIBA SE MOJA", (cx + 200, cy - 110), t, 0.6, 26, INK, "lm"); img = label(img, "ABAJO DEJA LA CAPA", (cx + 200, cy + 60), t, 1.0, 26, INK, "lm")
                Lm = lay(); arrow(Lm, (cx - 260, 860), (cx - 420, 860), 4, 16, ramp(t, 0.5, 0.9)); img = fill(img, Lm, INK, 0.6)
            if mode == "tapa": img = label(img, "COMO UN TAPÓN EN LA PILETA", (800, 185), t, 1.6, 34, RED)
            if mode == "cierra": img = label(img, "NO GOTEA · NO SE SECA", (800, 185), t, 1.4, 34, GREEN)
            if mode == "gravedad":
                La = lay(); [arrow(La, (cx - 160, cy - 380 + k * 90), (cx - 160, cy - 300 + k * 90), 4, 16, 0.8) for k in range(3)]; img = fill(img, La, RED, 0.7)
                img = label(img, "SIN PISTÓN · SIN TORNILLO", (800, 185), t, 0.9, 34, INK)
            if mode == "ranuras": img = label(img, "COMO LOS AGUJEROS DEL SALERO", (800, 185), t, 1.2, 34, INK)
            if mode == "capilar": img = label(img, "LA TINTA QUEDA COLGADA", (800, 185), t, 0.9, 34, INK)
            if mode == "escribe": img = label(img, "Y LA COLUMNA BAJA UN POQUITO", (800, 185), t, DUR * 0.45, 34, INK)
            if mode == "floja":
                img = label(img, "FLOJA: SE ESCAPA", (330, 420), t, 0.5, 32, RED); img = label(img, "APRETADA: SE TRABA", (1270, 420), t, DUR * 0.6, 32, RED)
            img = title(img, BOL_TIT[mode], t, 110, 50)
        put(film(cam(img, t, DUR, 1.0, 1.05, (0.5, 0.55)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ 4) PRESIÓN · el pistón (pasta de dientes)
def _piston(img, cx, t, p, s=0.8, cy=740):          # más chico y más abajo: la flecha no pisa el título
    """p 0..1: cuánto empuja. poco = no sale; mucho = pegote"""
    top = cy - 420 * s; ink_top = top + 70 * s + 120 * s * p
    img = punta(img, cx, cy, t, s, ink_top, 50)
    Lp = lay(); poly(Lp, [(cx - 48 * s, ink_top - 30 * s), (cx + 48 * s, ink_top - 30 * s), (cx + 48 * s, ink_top), (cx - 48 * s, ink_top)])
    line(Lp, [(cx, top - 60 * s), (cx, ink_top - 30 * s)], 10); img = fill(img, Lp, INK * 1.6)
    Lr = lay()
    for k in range(5): line(Lr, [(cx - 22 * s, top - 50 * s + k * 18 * s), (cx + 22 * s, top - 40 * s + k * 18 * s)], 3)
    img = fill(img, Lr, BRASS * 0.7)
    La = lay(); arrow(La, (cx, top - 150 * s), (cx, top - 70 * s), 6, 22, 0.4 + 0.6 * p); img = fill(img, La, RED, 0.8)
    yb = cy + 34 * s
    if p > 0.7:
        bl = (p - 0.7) / 0.3; Lg = lay(); circ(Lg, (cx + 10, yb + 20), 20 + 50 * bl); Lg = cv2.GaussianBlur(Lg, (0, 0), 3 * U); img = fill(img, Lg, BLUE, 0.9)
    return img
def r_presion(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "piston"); base = paper(52)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "piston":
            p = ease(ramp(t, 0.6, DUR * 0.8)); img = hoja(img, 767, t, [(0, 767), (650, 767)] if p < 0.4 else [(0, 767), (780, 767)])
            img = _piston(img, 800, t, p)
            img = label(img, "POCO: NO SALE" if p < 0.5 else "MUCHO: ¡PEGOTE!", (1200, 420), t, 0.6, 38, RED)
            img = title(img, "HAY QUE EMPUJAR LA TINTA", t)
        else:
            img = hoja(img, 767, t)
            img = _piston(img, 480, t, 0.25); img = _piston(img, 1120, t, 1.0 * ease(ramp(t, 0.6, DUR * 0.7)))
            img = label(img, "POCO: NO SALE", (480, 225), t, 0.5, 36, RED); img = label(img, "MUCHO: PEGOTE", (1120, 225), t, 0.9, 36, RED)
            img = title(img, "NUNCA EN EL PUNTO JUSTO", t)
        put(film(cam(img, t, DUR, 1.0, 1.04, (0.5, 0.52)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ 5) CAPILARIDAD
def r_capilar(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "pajita"); base = paper(55)
    for i in range(N):
        t = i / FPS; u = ease(ramp(t, 0.4, DUR * 0.75)); img = base.copy()
        if mode == "pajita":
            Lg = lay(); poly(Lg, [(560, 590), (1040, 590), (1000, 860), (600, 860)]); img = fill(img, Lg, np.array([0.85, 0.92, 0.97]), 0.6)
            Lw = lay(); poly(Lw, [(570, 660), (1030, 660), (1000, 860), (600, 860)]); img = fill(img, Lw, WATERB, 0.55)
            Lo = lay(); line(Lo, [(560, 590), (600, 860), (1000, 860), (1040, 590)], 4); img = fill(img, Lo, INK, 0.5)
            lift = 240 * u; x0 = 790; ytop = 480 - lift; ybot = 800 - lift   # pajita corta: entra entera en cuadro y sale del vaso
            Ls = lay(); poly(Ls, [(x0 - 22, ytop), (x0 + 22, ytop), (x0 + 22, ybot), (x0 - 22, ybot)]); img = fill(img, Ls, np.array([0.97, 0.97, 0.97]), 0.65)
            wl = max(ytop + 60, 560 - lift * 0.0 - lift); Lc = lay(); poly(Lc, [(x0 - 18, max(ytop + 40, 660 - lift)), (x0 + 18, max(ytop + 40, 660 - lift)), (x0 + 18, ybot), (x0 - 18, ybot)]); img = fill(img, Lc, WATERB, 0.85)
            Lb = lay(); circ(Lb, (x0, ybot + 4), 15); img = fill(img, Lb, WATERB, 0.85)
            Lz = lay(); line(Lz, [(x0 - 22, ytop), (x0 - 22, ybot)], 3); line(Lz, [(x0 + 22, ytop), (x0 + 22, ybot)], 3); img = fill(img, Lz, INK, 0.6)
            Lf = lay(); poly(Lf, [(x0 - 60, ytop - 70), (x0 + 50, ytop - 90), (x0 + 60, ytop + 4), (x0 - 50, ytop + 14)]); img = fill(img, Lf, np.array([0.80, 0.62, 0.45]), 0.95)   # el dedo
            img = label(img, "EL DEDO TAPA ARRIBA", (x0 + 120, ytop - 30), t, 0.4, 30, INK, "lm")
            img = label(img, "¡EL AGUA NO SE CAE!", (x0 + 120, ybot - 20), t, DUR * 0.6, 34, GREEN, "lm")
            img = title(img, "LA PAJITA CON EL DEDO", t)
        elif mode == "servilleta":
            Lc = lay(); poly(Lc, [(500, 700), (1100, 700), (1060, 860), (540, 860)]); img = fill(img, Lc, COFFEE, 0.9)
            Ln = lay(); poly(Ln, [(640, 180), (960, 180), (960, 760), (640, 760)]); img = fill(img, Ln, np.array([0.99, 0.99, 0.97]), 1.0)
            h = 80 + 470 * u; wv = lay(); poly(wv, [(640, 760)] + [(640 + k * 8, 760 - h + 14 * math.sin(k / 3.0 + t * 2)) for k in range(41)] + [(960, 760)]); img = fill(img, wv * Ln, COFFEE, 0.55)
            La = lay(); [arrow(La, (1010, 700 - k * 120 - 40 * u), (1010, 640 - k * 120 - 40 * u), 4, 16, 0.8) for k in range(3)]; img = fill(img, La, RED, 0.75)
            img = label(img, "SUBE SOLO", (1040, 380), t, 0.8, 36, RED, "lm")
            img = title(img, "CAPILARIDAD", t)
        else:                                                         # pluma: el tubo finito y la bolita, como la pajita
            img = hoja(img, 674, t)
            img = punta(img, 800, 640, t, 1.0, 640 - 380, 22)
            Lf = lay(); poly(Lf, [(760, 190), (850, 175), (860, 240), (770, 252)]); img = fill(img, Lf, np.array([0.80, 0.62, 0.45]), 0.0)
            img = label(img, "LA PAJITA", (430, 360), t, 0.5, 40, INK); img = label(img, "=", (600, 360), t, 0.8, 50, RED);
            img = label(img, "EL TUBO DE TINTA", (1150, 360), t, 1.1, 40, INK)
            img = label(img, "NADA DE EMPUJAR", (1150, 430), t, DUR * 0.5, 36, GREEN)
            img = title(img, "UN SISTEMA DE PIPETA", t)
        put(film(cam(img, t, DUR, 1.0, 1.04, (0.5, 0.5)), t, i, "warm", halation=0.08, grain=0.025))

# ------------------------------------------------------------------ 6) ALTURA · la burbuja que se infla
def r_altura(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "champu"); base = paper(58)
    for i in range(N):
        t = i / FPS; alt = ease(ramp(t, 0.5, DUR * 0.8)); img = base.copy()
        # altímetro a la izquierda
        Lm = lay(); line(Lm, [(170, 220), (170, 780)], 6)
        for k in range(7): line(Lm, [(150, 780 - k * 93), (190, 780 - k * 93)], 3)
        img = fill(img, Lm, INK, 0.7)
        Lpl = lay(); y = 780 - 560 * alt; poly(Lpl, [(200, y), (290, y - 14), (310, y), (290, y + 14)]); poly(Lpl, [(240, y), (270, y - 40), (282, y - 40), (268, y)]); img = fill(img, Lpl, INK, 0.85)
        img = label(img, f"{int(alt * 6000):,} m".replace(",", "."), (330, y), t, 0.2, 30, INK, "lm")
        # el aire de afuera: flechas que empujan y se achican al subir
        Lo = lay()
        for k in range(6):
            ang = k / 6 * 2 * math.pi; r0 = 300; L_ = 70 * (1 - 0.75 * alt)
            arrow(Lo, (1000 + math.cos(ang) * (r0 + L_), 500 + math.sin(ang) * (r0 + L_)), (1000 + math.cos(ang) * r0, 500 + math.sin(ang) * r0), 4, 14, 0.7)
        img = fill(img, Lo, BLUE, 0.55)
        if mode in ("champu", "pluma"):
            col = np.array([0.93, 0.80, 0.55]) if mode == "champu" else BLUE
            bx, by = 1000, 520
            Lb = lay(); poly(Lb, [(880, 300), (1120, 300), (1120, 760), (880, 760)]); img = fill(img, Lb, col, 0.85)
            Lw = lay(); line(Lw, [(880, 300), (880, 760), (1120, 760), (1120, 300)], 6); poly(Lw, [(960, 240), (1040, 240), (1040, 300), (960, 300)]); img = fill(img, Lw, INK, 0.6)
            rb = 50 + 120 * alt; Lbb = lay(); circ(Lbb, (1000, 300 + rb + 10), rb); img = fill(img, Lbb, np.array([0.97, 0.98, 1.0]), 0.92)
            Lbo = lay(); circ(Lbo, (1000, 300 + rb + 10), rb, w=4); img = fill(img, Lbo, INK, 0.5)
            img = label(img, "AIRE", (1000, 300 + rb + 10), t, 0.4, 30, INK)
            if alt > 0.4:
                k_ = (alt - 0.4) / 0.6; ds = [(1000 + 30 * math.sin(q * 2.1), 230 - ((t * 1.4 + q / 3) % 1.0) * 150 * k_) for q in range(3)]
                img = drops(img, [(x, y_) for x, y_ in ds], col * 0.9, 13)
                img = label(img, "¡SE SALE!", (1190, 220), t, DUR * 0.55, 40, RED, "lm")
            img = title(img, "AL SUBIR, LA BURBUJA SE INFLA" if mode == "champu" else "LA PLUMA FUENTE EN EL AVIÓN", t)
        else:
            img = hoja(img, 820, t, [(0, 820), (960, 820)])
            img = punta(img, 1000, 786, t, 0.95, 786 - 360, 22)
            img = label(img, "SIN BURBUJA QUE EMPUJE", (1090, 420), t, 0.6, 30, INK, "lm")
            img = label(img, "NO GOTEA", (1090, 480), t, DUR * 0.5, 40, GREEN, "lm")
            img = title(img, "LA BIROME, A CUALQUIER ALTURA", t)
        put(film(cam(img, t, DUR, 1.0, 1.04, (0.5, 0.5)), t, i, "warm", halation=0.08, grain=0.025))
