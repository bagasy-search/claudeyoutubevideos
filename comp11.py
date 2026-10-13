# comp11.py — componentes de tgmeucci (el teléfono, oct-2026): la voz por un cable "como para un chico de 10 años"
#   r_onda       modos: interruptor (telégrafo: prendido/apagado = puntos y rayas) · voz (la onda real) · regulador (la luz copia la voz)
#                · reis (sólo dos niveles: se ve la montaña pero no sus laderas) · coro (varias notas en un cable que el oído separa)
#   r_latas      dos latas con un hilo: la vibración viaja por el hilo (tenso) · se pierde (flojo)
#   r_microfono  voz → lámina → corriente que copia la forma → imán → lámina → oído
#   r_vinilo     el surco que tiembla con la forma de la música y la aguja que lo recorre
#   r_toalla     el caveat = la toalla en la reposera; modos ocupa / vence (no pagó los 10 dólares: el viento se la lleva)
#   r_horas      14-feb-1876: el reloj de la oficina de patentes con las dos llegadas (BELL · GRAY)
import math, numpy as np, cv2
from cine import W, H, film, ease, ramp, fbm
from comp6 import U, FPS, INK, RED, BLUE, BRASS, lay, line, poly, circ, arrow, dashed, txt, ink, cam, paper
from comp9 import fill, title
from comp9 import label as _label
def label(img, s, xy, t, t0, px=34, col=INK, anchor="mm"): return _label(img, s, xy, t, t0, max(px, 34) * 1.15, col, anchor)
GREEN = np.array([0.20, 0.48, 0.24]); TIN = np.array([0.66, 0.68, 0.70]); COPPER = np.array([0.78, 0.45, 0.22]); YEL = np.array([0.98, 0.85, 0.35])
SAND = np.array([0.93, 0.83, 0.58]); SEA = np.array([0.35, 0.60, 0.80]); TOWEL = np.array([0.80, 0.22, 0.20])

def out(put, img, t, DUR, i, z=(1.0, 1.04), c=(0.5, 0.52)): put(film(cam(img, t, DUR, z[0], z[1], c), t, i, "warm", halation=0.08, grain=0.025))
def voice(x, t):
    """una 'voz': suma de armónicos con envolvente que cambia (x en px de diseño)"""
    a = 0.55 + 0.45 * math.sin(x * 0.006 + t * 1.3)
    return a * (0.55 * math.sin(x * 0.045 - t * 9) + 0.30 * math.sin(x * 0.11 - t * 14 + 1) + 0.15 * math.sin(x * 0.23 - t * 21 + 2))
def wave(L, x0, x1, y, amp, f, w=4):
    line(L, [(x, y - amp * f(x)) for x in np.linspace(x0, x1, 260)], w)
def bulb(img, c, b):
    Lg = lay(); circ(Lg, c, 70 + 90 * b); img = fill(img, cv2.GaussianBlur(Lg, (0, 0), 30 * U), YEL, 0.75 * b)
    L = lay(); circ(L, c, 42); img = fill(img, L, YEL * (0.55 + 0.45 * b) + (1 - b) * 0.15)
    Lb = lay(); poly(Lb, [(c[0] - 20, c[1] + 38), (c[0] + 20, c[1] + 38), (c[0] + 16, c[1] + 70), (c[0] - 16, c[1] + 70)]); return fill(img, Lb, TIN)

# ------------------------------------------------------------------ 1) LA ONDA
def r_onda(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "interruptor"); base = paper(71)
    seq = [1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0]                        # · — ·  (en unidades)
    for i in range(N):
        t = i / FPS; img = base.copy(); p = ramp(t, 0.3, DUR * 0.85)
        if mode == "interruptor":
            on = seq[int(t * 5) % len(seq)]
            Ls = lay(); poly(Ls, [(250, 420), (370, 420), (370, 600), (250, 600)]); img = fill(img, Ls, np.array([0.85, 0.82, 0.74]))
            Lk = lay(); poly(Lk, [(285, 470 if on else 500), (335, 470 if on else 500), (335, 550 if on else 520), (285, 550 if on else 520)]); img = fill(img, Lk, INK, 0.85)
            img = bulb(img, (310, 300), on)
            L = lay(); xs = np.linspace(500, 1450, 400); hist = [(x, seq[int((t * 5 - (1450 - x) / 950 * 4) % len(seq))]) for x in xs]
            line(L, [(x, 640 - 160 * v) for x, v in hist], 5); img = fill(img, L, BLUE, 0.9)
            img = label(img, "PRENDIDO", (1290, 430), t, 0.3, 30); img = label(img, "APAGADO", (1290, 700), t, 0.3, 30)
            img = label(img, "·  —  ·", (975, 780), t, 0.8, 60, RED); img = title(img, "EL TELÉGRAFO: PRENDIDO O APAGADO", t)
        elif mode == "voz":
            L = lay(); wave(L, 160, 160 + 1280 * p, 500, 180, lambda x: voice(x, t), 5); img = fill(img, L, BLUE, 0.9)
            img = label(img, "MÁS FUERTE · MÁS SUAVE · MÁS AGUDO · MÁS GRAVE", (800, 780), t, 0.8, 32, RED); img = title(img, "UNA VOZ ES UNA ONDA", t)
        elif mode == "regulador":
            v = voice(400, t); b = 0.5 + 0.5 * v
            Lk = lay(); circ(Lk, (300, 560), 90); img = fill(img, Lk, np.array([0.85, 0.82, 0.74])); Lk = lay(); circ(Lk, (300, 560), 90, w=4); img = fill(img, Lk, INK, 0.6)
            a = -2.2 + 2.6 * b; Lp = lay(); line(Lp, [(300, 560), (300 + math.cos(a) * 75, 560 + math.sin(a) * 75)], 10); img = fill(img, Lp, RED)
            img = bulb(img, (300, 280), b)
            L = lay(); wave(L, 520, 1450, 520, 170, lambda x: voice(x + (1450 - x) * 0 + 400 - (1450 - x), t), 5); img = fill(img, L, BLUE, 0.9)
            img = label(img, "LA CORRIENTE COPIA LA FORMA DE LA VOZ", (985, 780), t, 0.8, 32, RED); img = title(img, "UN REGULADOR QUE MUEVE TU VOZ", t)
        elif mode == "reis":
            L = lay(); wave(L, 160, 1440, 470, 170, lambda x: voice(x, 0.0), 3); img = fill(img, L, INK, 0.25)
            L2 = lay(); line(L2, [(x, 470 - (150 if voice(x, 0.0) > 0 else -150)) for x in np.linspace(160, 160 + 1280 * p, 600)], 5); img = fill(img, L2, RED, 0.9)
            img = label(img, "LA VOZ", (240, 260), t, 0.3, 30, INK); img = label(img, "LO QUE PASABA: SÓLO DOS NIVELES", (800, 780), t, 0.8, 32, RED)
            img = title(img, "REIS: EL RITMO SÍ, LA FORMA NO", t)
        else:                                                   # coro
            cols = [RED, BLUE, GREEN]; fs = [0.03, 0.06, 0.10]
            for k in range(3):
                L = lay(); wave(L, 160, 560, 300 + k * 160, 50, lambda x, k=k: math.sin(x * fs[k] - t * 8), 4); img = fill(img, L, cols[k], 0.9)
                L = lay(); wave(L, 1040, 1440, 300 + k * 160, 50, lambda x, k=k: math.sin(x * fs[k] - t * 8), 4); img = fill(img, L, cols[k], 0.9 * ramp(t, 1.0, 1.6))
            Lm = lay(); wave(Lm, 600, 1000, 460, 80, lambda x: sum(0.33 * math.sin(x * f - t * 8) for f in fs), 5); img = fill(img, Lm, INK, 0.85)
            img = label(img, "UN SOLO CABLE", (800, 600), t, 0.6, 30); img = title(img, "EL TELÉGRAFO MÚLTIPLE: UN CORO", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 2) LAS LATAS
def _lata(img, cx, cy, s=1.0, face=1):
    L = lay(); poly(L, [(cx - 70 * s, cy - 90 * s), (cx + 70 * s, cy - 90 * s), (cx + 70 * s, cy + 90 * s), (cx - 70 * s, cy + 90 * s)]); img = fill(img, L, TIN)
    Lr = lay()
    for k in range(5): line(Lr, [(cx - 70 * s, cy - 60 * s + k * 30 * s), (cx + 70 * s, cy - 60 * s + k * 30 * s)], 2)
    return fill(img, Lr, INK, 0.25)
def r_latas(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "tensa"); base = paper(72)
    for i in range(N):
        t = i / FPS; img = base.copy(); x0, x1, y = 300, 1300, 480
        img = _lata(img, x0 - 80, y); img = _lata(img, x1 + 80, y)
        sag = 0 if mode == "tensa" else 120
        ph = (t * 1.2) % 1.0; damp = 1.0 if mode == "tensa" else max(0.0, 1 - ph * 2.2)
        L = lay(); pts = []
        for x in np.linspace(x0, x1, 300):
            u = (x - x0) / (x1 - x0); yy = y + sag * 4 * u * (1 - u)
            pulse = math.exp(-((u - ph) * 14) ** 2) * 22 * math.sin(u * 90) * (damp if mode == "flojo" else 1.0)
            pts.append((x, yy + pulse))
        line(L, pts, 3); img = fill(img, L, INK, 0.9)
        Lv = lay()
        for k in range(3): circ(Lv, (x0 - 220 - k * 40, y), 30 + k * 30, w=3)
        img = fill(img, Lv, RED, 0.6 * (0.5 + 0.5 * math.sin(t * 12)))
        if mode == "tensa":
            Lw = lay()
            for k in range(3): circ(Lw, (x1 + 220 + k * 40, y), 30 + k * 30, w=3)
            img = fill(img, Lw, RED, 0.6 * ramp(ph, 0.85, 0.95)); img = label(img, "LA VIBRACIÓN VIAJA POR EL HILO", (800, 300), t, 0.5, 32, RED)
            img = title(img, "DOS LATAS Y UN HILO", t)
        else:
            img = label(img, "SE PIERDE POR EL CAMINO", (800, 300), t, 0.5, 36, RED); img = title(img, "SI EL HILO SE AFLOJA…", t)
        img = label(img, "HABLAS", (x0 - 80, 640), t, 0.3, 28); img = label(img, "ESCUCHAS", (x1 + 80, 640), t, 0.3, 28)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 3) MICRÓFONO → CABLE → PARLANTE
def _diaf(img, cx, cy, off):
    L = lay(); line(L, [(cx + off * 0.3, cy - 110), (cx + off, cy), (cx + off * 0.3, cy + 110)], 7); return fill(img, L, INK, 0.9)
def r_microfono(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(73)
    for i in range(N):
        t = i / FPS; img = base.copy(); v = voice(300, t)
        Lb = lay(); poly(Lb, [(170, 380), (280, 400), (280, 560), (170, 580)]); img = fill(img, Lb, np.array([0.55, 0.38, 0.22]))
        img = _diaf(img, 300, 480, v * 18)
        Lc = lay(); circ(Lc, (390, 480), 40, w=10); img = fill(img, Lc, COPPER)
        L = lay(); wave(L, 440, 1160, 480, 90, lambda x: voice(300 - (x - 440) * 0.0 + (x - 440) * -1.0, t), 6); img = fill(img, L, BLUE, 0.9 * ramp(t, 0.4, 0.9))
        Lm = lay(); poly(Lm, [(1180, 420), (1240, 420), (1240, 540), (1180, 540)]); img = fill(img, Lm, RED * 0.9)
        img = _diaf(img, 1290, 480, voice(300 - 720, t) * 18 * ramp(t, 0.9, 1.3))
        Lv = lay()
        for k in range(3): circ(Lv, (1380 + k * 40, 480), 30 + k * 26, w=3)
        img = fill(img, Lv, RED, 0.55 * ramp(t, 1.0, 1.4) * (0.5 + 0.5 * math.sin(t * 12)))
        img = label(img, "LA VOZ MUEVE LA LÁMINA", (380, 700), t, 0.3, 28); img = label(img, "CORRIENTE QUE COPIA LA VOZ", (800, 330), t, 0.7, 30, BLUE)
        img = label(img, "EL IMÁN TIRA DE LA LÁMINA", (1220, 700), t, 1.1, 28); img = title(img, "MICRÓFONO → CABLE → PARLANTE", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 4) EL VINILO
def r_vinilo(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(74, (0.16, 0.15, 0.15))
    for i in range(N):
        t = i / FPS; img = base.copy(); off = t * 160
        for k in range(5):
            L = lay(); y = 260 + k * 110
            line(L, [(x, y + 26 * voice(x + off + k * 300, 0.0) * (1.0 if k == 2 else 0.6)) for x in np.linspace(80, 1520, 500)], 9 if k == 2 else 6)
            img = fill(img, L, np.array([0.42, 0.40, 0.40]) if k != 2 else np.array([0.70, 0.66, 0.60]), 0.9)
        yn = 480 + 26 * voice(800 + off + 600, 0.0)
        Ln = lay(); poly(Ln, [(780, 120), (820, 120), (806, yn), (794, yn)]); img = fill(img, Ln, BRASS)
        img = label(img, "EL SURCO TIEMBLA CON LA FORMA DE LA MÚSICA", (800, 820), t, 0.5, 30, np.array([0.92, 0.88, 0.80]))
        Lt = lay(); txt(Lt, "UN DISCO, DE MUY CERCA", (800, 80), 52, "AN", "mm", ramp(t, 0.25, 0.8)); img = fill(img, Lt, np.array([0.95, 0.92, 0.85]), 0.9)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 5) LA TOALLA (el caveat)
def r_toalla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "ocupa"); base = paper(75)
    for i in range(N):
        t = i / FPS; img = base.copy()
        Ls = lay(); poly(Ls, [(0, 620), (1600, 560), (1600, 900), (0, 900)]); img = fill(img, Ls, SAND, 0.9)
        Lw = lay(); poly(Lw, [(0, 420), (1600, 400), (1600, 570), (0, 625)]); img = fill(img, Lw, SEA, 0.7)
        cx, cy = 760, 640
        Lc = lay(); line(Lc, [(cx - 220, cy), (cx + 120, cy), (cx + 230, cy - 170)], 14); line(Lc, [(cx - 180, cy), (cx - 220, cy + 110)], 8); line(Lc, [(cx + 80, cy), (cx + 120, cy + 110)], 8)
        img = fill(img, Lc, np.array([0.55, 0.36, 0.20]))
        fly = 0.0 if mode == "ocupa" else ease(ramp(t, DUR * 0.45, DUR * 0.85))
        dx, dy, rot = 700 * fly, -380 * fly, fly * 2.0
        def tp(x, y):
            x -= cx; y -= cy; c, s = math.cos(rot), math.sin(rot); return (cx + dx + x * c - y * s, cy + dy + x * s + y * c)
        Lt = lay(); poly(Lt, [tp(cx - 200, cy - 22), tp(cx + 110, cy - 22), tp(cx + 220, cy - 180), tp(cx + 245, cy - 160), tp(cx + 130, cy + 4), tp(cx - 200, cy + 4)]); img = fill(img, Lt, TOWEL)
        Lst = lay()
        for k in range(4): line(Lst, [tp(cx - 140 + k * 70, cy - 22), tp(cx - 140 + k * 70, cy + 4)], 8)
        img = fill(img, Lst, np.array([0.97, 0.95, 0.90]))
        if mode == "ocupa":
            img = label(img, "NO ES TUYA PARA SIEMPRE…", (800, 250), t, 0.4, 32); img = label(img, "…PERO NADIE SE PUEDE SENTAR", (800, 310), t, 1.2, 34, RED)
            img = label(img, "CADA AÑO: 10 DÓLARES", (1150, 830), t, 1.8, 32, GREEN); img = title(img, "EL CAVEAT: UNA TOALLA EN LA REPOSERA", t)
        else:
            img = label(img, "1874 · NO SE PAGARON LOS 10 DÓLARES", (800, 250), t, 0.4, 32, RED)
            if fly > 0.6: img = label(img, "EL LUGAR QUEDA LIBRE", (800, 310), t, DUR * 0.7, 36)
            img = title(img, "EL CAVEAT VENCE", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 6) EL RELOJ DEL 14 DE FEBRERO
def r_horas(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(76); cx, cy, R = 560, 500, 270
    marks = sh.get("marks", [[11.75, "BELL", "SOLICITUD DE PATENTE"], [14.0, "GRAY", "CAVEAT"]])
    for i in range(N):
        t = i / FPS; img = base.copy(); hh = 11.0 + 3.4 * ease(ramp(t, 0.3, DUR * 0.85))
        L = lay(); circ(L, (cx, cy), R); img = fill(img, L, np.array([0.97, 0.95, 0.89])); L = lay(); circ(L, (cx, cy), R, w=8); img = fill(img, L, BRASS)
        Lk = lay()
        for k in range(12):
            a = k / 12 * 2 * math.pi - math.pi / 2; line(Lk, [(cx + math.cos(a) * R * 0.86, cy + math.sin(a) * R * 0.86), (cx + math.cos(a) * R * 0.96, cy + math.sin(a) * R * 0.96)], 6)
        img = fill(img, Lk, INK, 0.85)
        ah = (hh % 12) / 12 * 2 * math.pi - math.pi / 2; am = (hh % 1) * 2 * math.pi - math.pi / 2
        Lh = lay(); line(Lh, [(cx, cy), (cx + math.cos(ah) * R * 0.5, cy + math.sin(ah) * R * 0.5)], 14); line(Lh, [(cx, cy), (cx + math.cos(am) * R * 0.8, cy + math.sin(am) * R * 0.8)], 8)
        img = fill(img, Lh, INK)
        for k, (hm, who, what) in enumerate(marks):
            if hh >= hm:
                a = (hm % 12) / 12 * 2 * math.pi - math.pi / 2; Lm = lay(); circ(Lm, (cx + math.cos(a) * R * 1.08, cy + math.sin(a) * R * 1.08), 16); img = fill(img, Lm, RED if k == 0 else BLUE)
                img = label(img, who, (1180, 380 + k * 200), t, 0.0, 52, RED if k == 0 else BLUE); img = label(img, what, (1180, 440 + k * 200), t, 0.0, 28)
        img = title(img, "14 DE FEBRERO DE 1876 · WASHINGTON", t)
        out(put, img, t, DUR, i, c=(0.5, 0.5))
