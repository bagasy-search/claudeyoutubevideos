# comp13.py — componentes de tgmexico (20 inventos mexicanos, oct-2026): cada [G] del guion = una analogía que se VE
#   r_nochebuena  lo rojo son hojas, la flor son los botoncitos amarillos · las noches largas la ponen roja
#   r_helice      la pala: la punta va más rápido que el centro (pala) · los remeros en la calesita (calesita)
#   r_azul        el añil se esconde en los túneles de la arcilla (panal) y el ácido/la luz no lo alcanzan
#   r_vainilla    la tapita que separa macho y hembra · la abeja la abre (abeja) · el palito de Albius (palito)
#   r_chile       la capsaicina engaña al sensor del calor (lengua) · el pájaro sí, el mamífero no (pajaros)
#   r_chinampa    estacas → ramas → barro → ahuejotes; el agua sube desde abajo
#   r_cero        guardar un lugar: 1 vs 10 (lugar) · MMXXV × 348 (romanos) · punto, raya, concha y pisos (maya)
#   r_hule        hilos sueltos de caucho (suelto) · la enredadera los ata con nudos (atado)
#   r_cacao       fermentar → secar → tostar → moler: recién al final aparece el chocolate
#   r_precios     la lista de 1545: tomate 1 · aguacate 3 · conejo 30 · guajolote 100 semillas
#   r_rueda       la rueda roja-verde-azul delante de la cámara (camara) · el ojo suma los tres (suma)
#   r_teocintle   espiga de 5-12 granos vs mazorca · el lobo y el salchicha (perro)
#   r_nixtamal    la niacina en una caja fuerte; la cal la abre
import math, numpy as np, cv2
from cine import W, H, film, ease, ramp, fbm
from comp6 import U, FPS, INK, RED, BLUE, BRASS, lay, line, poly, circ, arrow, dashed, txt, ink, cam, paper
from comp9 import fill, title
from comp9 import label as _label
def label(img, s, xy, t, t0, px=34, col=INK, anchor="mm"): return _label(img, s, xy, t, t0, max(px, 34) * 1.15, col, anchor)
GREEN = np.array([0.20, 0.48, 0.24]); YEL = np.array([0.95, 0.78, 0.20]); CORN = np.array([0.93, 0.74, 0.25]); MAYA = np.array([0.24, 0.62, 0.70])
CLAY = np.array([0.80, 0.72, 0.56]); WATER = np.array([0.36, 0.58, 0.84]); MUD = np.array([0.38, 0.28, 0.18]); WOOD = np.array([0.62, 0.42, 0.24])
CACAO = np.array([0.42, 0.24, 0.14]); SKIN = np.array([0.86, 0.68, 0.54]); RUB = np.array([0.22, 0.18, 0.14]); GREY = np.array([0.55, 0.55, 0.55])

def out(put, img, t, DUR, i, z=(1.0, 1.04), c=(0.5, 0.52)): put(film(cam(img, t, DUR, z[0], z[1], c), t, i, "warm", halation=0.08, grain=0.025))
def _rng(seed): return np.random.default_rng(seed)
def _rect(L, x0, y0, x1, y1): poly(L, [(x0, y0), (x1, y0), (x1, y1), (x0, y1)])

# ------------------------------------------------------------------ 1) NOCHEBUENA
def r_nochebuena(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(131)
    for i in range(N):
        t = i / FPS; img = base.copy(); red = ease(ramp(t, 0.8, 2.2))
        col = GREEN * (1 - red) + RED * red
        L = lay()
        for k in range(7):
            a = k / 7 * 2 * math.pi + 0.2; cx, cy = 800 + math.cos(a) * 130, 500 + math.sin(a) * 130
            poly(L, [(800, 500), (cx + math.cos(a + 1.3) * 60, cy + math.sin(a + 1.3) * 60), (800 + math.cos(a) * 270, 500 + math.sin(a) * 270), (cx + math.cos(a - 1.3) * 60, cy + math.sin(a - 1.3) * 60)])
        img = fill(img, L, col, 0.92)
        Lc = lay()
        for k in range(6): circ(Lc, (800 + math.cos(k) * 22, 500 + math.sin(k) * 22), 12)
        img = fill(img, Lc, YEL)
        Lm = lay(); a = ramp(t, 1.4, 1.9); arrow(Lm, (1080, 300), (835, 470), 5) if a > 0 else None; img = fill(img, Lm, INK, a)
        img = label(img, "LA FLOR DE VERDAD", (1180, 270), t, 1.4, 30, INK)
        img = label(img, "HOJAS QUE CAMBIAN DE COLOR", (800, 830), t, 0.5, 32, RED)
        n = ease(ramp(t, 0.2, 1.4)); Ln = lay(); _rect(Ln, 120, 200, 120 + 260 * n, 240); img = fill(img, Ln, INK, 0.8)
        img = label(img, "NOCHES LARGAS", (250, 280), t, 0.3, 26, INK)
        img = title(img, "LO ROJO NO SON PÉTALOS", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 2) LA HÉLICE
def r_helice(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "pala"); base = paper(132)
    for i in range(N):
        t = i / FPS; img = base.copy(); a = t * 1.6
        if mode == "pala":
            L = lay()
            for s in (0, math.pi):
                ca, sa = math.cos(a + s), math.sin(a + s); px, py = -sa, ca
                poly(L, [(800 + px * 18, 470 + py * 18), (800 + ca * 360 + px * 10, 470 + sa * 360 + py * 10), (800 + ca * 360 - px * 30, 470 + sa * 360 - py * 30), (800 - px * 40, 470 - py * 40)])
            img = fill(img, L, WOOD, 0.95); Lh = lay(); circ(Lh, (800, 470), 34); img = fill(img, Lh, INK)
            Lc = lay(); circ(Lc, (800, 470), 360, w=2); circ(Lc, (800, 470), 120, w=2); img = fill(img, Lc, INK, 0.3)
            for r, s, col, t0 in [(360, "LA PUNTA: MUY RÁPIDO", RED, 0.4), (120, "EL CENTRO: LENTO", BLUE, 1.0)]:
                x, y = 800 + math.cos(a) * r, 470 + math.sin(a) * r; La = lay()
                arrow(La, (x, y), (x - math.sin(a) * r * 0.45, y + math.cos(a) * r * 0.45), 6, 18); img = fill(img, La, col, ramp(t, t0, t0 + 0.4))
                img = label(img, s, (1240 if r > 200 else 330, 250 if r > 200 else 760), t, t0, 30, col)
            img = label(img, "CADA PARTE DE LA PALA, CON SU PROPIA INCLINACIÓN", (800, 860), t, 1.8, 28, INK)
            img = title(img, "LA HÉLICE ANÁHUAC", t)
        else:
            L = lay(); circ(L, (800, 500), 330, w=5); circ(L, (800, 500), 40); img = fill(img, L, INK, 0.7)
            for k in range(4):
                b = a * 0.7 + k * math.pi / 2; Lb = lay(); line(Lb, [(800, 500), (800 + math.cos(b) * 330, 500 + math.sin(b) * 330)], 5); img = fill(img, Lb, WOOD)
                for r, col, st in [(300, RED, 0.6), (120, BLUE, 1.6)]:
                    x, y = 800 + math.cos(b) * r, 500 + math.sin(b) * r; Lp = lay(); circ(Lp, (x, y - 20), 18); _rect(Lp, x - 18, y - 4, x + 18, y + 40)
                    ph = math.sin(t * 8 * st + k); line(Lp, [(x, y), (x + 50 * ph, y + 40)], 6); img = fill(img, Lp, col, 0.9)
            img = label(img, "AFUERA: REMAN SUAVE", (1250, 200), t, 0.4, 30, RED); img = label(img, "ADENTRO: REMAN FUERTE", (360, 800), t, 1.0, 30, BLUE)
            img = label(img, "ASÍ TODOS EMPUJAN IGUAL", (800, 870), t, 1.8, 30, INK); img = title(img, "REMEROS EN UNA CALESITA", t)
        out(put, img, t, DUR, i, c=(0.5, 0.5))

# ------------------------------------------------------------------ 3) EL AZUL MAYA
def r_azul(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(133); r = _rng(13)
    cells = [(560 + c * 96 + (rw % 2) * 48, 330 + rw * 84) for rw in range(5) for c in range(5)]
    mol = r.uniform([200, 150], [1400, 260], (len(cells), 2))
    for i in range(N):
        t = i / FPS; img = base.copy(); heat = ramp(t, 0.6, 1.3)
        Lh = lay()
        for cx, cy in cells:
            pts = [(cx + 48 * math.cos(math.pi / 6 + k * math.pi / 3), cy + 48 * math.sin(math.pi / 6 + k * math.pi / 3)) for k in range(7)]; line(Lh, pts, 6)
        img = fill(img, Lh, CLAY * 0.75)
        Lm = lay()
        for k, (cx, cy) in enumerate(cells):
            u = ease(ramp(t, 0.8 + k * 0.03, 1.8 + k * 0.03)); x = mol[k][0] * (1 - u) + cx * u; y = mol[k][1] * (1 - u) + cy * u; circ(Lm, (x, y), 16)
        img = fill(img, Lm, MAYA, 0.95)
        Lf = lay(); _rect(Lf, 700, 800, 900, 830); img = fill(img, Lf, RED, 0.8 * heat * (1 - ramp(t, 1.9, 2.2)))
        img = label(img, "CALOR", (800, 870), t, 0.6, 26, RED)
        La = lay()
        if t > 2.0:
            for k in range(3):
                y0 = 300 + k * 160; x = 1450 - 200 * ease(ramp(t, 2.0 + k * 0.2, 2.6 + k * 0.2)); arrow(La, (1500, y0), (x, y0), 5)
        img = fill(img, La, GREY, 0.8); img = label(img, "ÁCIDO · LUZ · TIEMPO", (1260, 800), t, 2.1, 26, GREY)
        img = label(img, "AÑIL", (380, 210), t, 0.2, 30, MAYA); img = label(img, "ARCILLA CON TÚNELES", (800, 755), t, 0.3, 28, CLAY * 0.6)
        img = title(img, "EL TINTE SE ESCONDE EN UN PANAL", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 4) LA VAINILLA
def r_vainilla(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "abeja"); base = paper(134)
    for i in range(N):
        t = i / FPS; img = base.copy(); op = ease(ramp(t, 1.0, 1.8))
        L = lay()
        for k in range(5):
            a = -math.pi / 2 + (k - 2) * 0.55; poly(L, [(800, 520), (800 + math.cos(a - 0.2) * 240, 520 + math.sin(a - 0.2) * 240), (800 + math.cos(a) * 300, 520 + math.sin(a) * 300), (800 + math.cos(a + 0.2) * 240, 520 + math.sin(a + 0.2) * 240)])
        img = fill(img, L, np.array([0.93, 0.92, 0.70]))
        Lm = lay(); _rect(Lm, 760, 380, 840, 520); img = fill(img, Lm, YEL * 0.9)
        Lt = lay(); poly(Lt, [(760, 440 - op * 40), (840, 440 - op * 40), (840, 452 - op * 40), (760, 452 - op * 40)]); img = fill(img, Lt, RED, 0.95)
        img = label(img, "MACHO", (1010, 400), t, 0.2, 26, BLUE); img = label(img, "HEMBRA", (1010, 490), t, 0.2, 26, RED)
        img = label(img, "LA TAPITA", (620, 440), t, 0.5, 28, RED)
        if mode == "abeja":
            bx, by = 1300 - 470 * ease(ramp(t, 0.2, 1.0)), 300 + 120 * ease(ramp(t, 0.2, 1.0)); Lb = lay(); circ(Lb, (bx, by), 30); circ(Lb, (bx + 34, by), 22); img = fill(img, Lb, YEL * 0.8)
            Lw = lay(); circ(Lw, (bx + 5, by - 34), 22); img = fill(img, Lw, np.array([0.9, 0.95, 1.0]), 0.7)
            img = label(img, "SÓLO LAS ABEJAS DE MÉXICO SABÍAN ABRIRLA", (800, 860), t, 1.6, 28, INK); img = title(img, "POR QUÉ NO DABA VAINAS", t)
        else:
            Ls = lay(); line(Ls, [(1200 - 360 * ease(ramp(t, 0.3, 1.0)), 300), (1300 - 360 * ease(ramp(t, 0.3, 1.0)), 200)], 7); img = fill(img, Ls, WOOD)
            img = label(img, "UN PALITO Y EL PULGAR", (800, 860), t, 1.4, 30, INK); img = title(img, "EL MÉTODO DE EDMOND ALBIUS · 1841", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 5) EL CHILE
def r_chile(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "lengua"); base = paper(135)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "lengua":
            L = lay(); poly(L, [(250, 640), (700, 560), (720, 720), (260, 760)]); img = fill(img, L, np.array([0.88, 0.50, 0.50]))
            Ls = lay()
            for k in range(5): circ(Ls, (330 + k * 80, 680), 12)
            img = fill(img, Ls, BRASS); img = label(img, "SENSOR DEL CALOR", (480, 820), t, 0.3, 26, INK)
            u = ease(ramp(t, 0.6, 1.6)); Lw = lay(); dashed(Lw, [(500, 640), (500 + 700 * u, 640 - 360 * u)], t * 60, 22, 14, 5); img = fill(img, Lw, RED)
            Lb = lay(); circ(Lb, (1250, 290), 120, w=5); img = fill(img, Lb, INK, 0.8)
            fl = ramp(t, 1.6, 2.0); Lf = lay()
            for k in range(3): poly(Lf, [(1200 + k * 50, 300), (1225 + k * 50, 200 - 30 * math.sin(t * 9 + k)), (1250 + k * 50, 300)])
            img = fill(img, Lf, RED, fl); img = label(img, "«¡ME QUEMO!»", (1250, 470), t, 1.8, 34, RED)
            img = label(img, "PERO NO HAY FUEGO", (800, 870), t, 2.3, 30, INK); img = title(img, "LA CAPSAICINA ENGAÑA A TU LENGUA", t)
        else:
            for k, (x, s, ok) in enumerate([(450, "PÁJARO: NO SIENTE EL PICANTE", 1), (1150, "MAMÍFERO: SE ALEJA", 0)]):
                Lc = lay(); poly(Lc, [(x - 30, 330), (x + 30, 330), (x + 8, 500), (x - 8, 500)]); img = fill(img, Lc, RED)
                img = label(img, s, (x, 600), t, 0.3 + k * 0.6, 28, GREEN if ok else RED)
            r = _rng(3); Ls = lay(); u = ease(ramp(t, 1.4, 2.6))
            for k in range(14): circ(Ls, (450 + r.uniform(-1, 1) * 380 * u, 700 + r.uniform(0, 1) * 120 * u), 8)
            img = fill(img, Ls, CORN); img = label(img, "SEMILLAS LEJOS", (450, 860), t, 1.8, 26, INK)
            img = title(img, "EL PICANTE ELIGE QUIÉN LA COME", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 6) LA CHINAMPA
def r_chinampa(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(136); steps = ["ESTACAS", "RAMAS", "BARRO", "AHUEJOTES"]
    for i in range(N):
        t = i / FPS; img = base.copy(); k = min(3, int(t / max(DUR / 4.6, 0.6)))
        Lw = lay(); _rect(Lw, 120, 560, 1480, 800); img = fill(img, Lw, WATER, 0.55)
        Lb = lay(); _rect(Lb, 120, 800, 1480, 840); img = fill(img, Lb, MUD, 0.8)
        Ls = lay()
        for x in range(460, 1160, 70): line(Ls, [(x, 840), (x, 520)], 8)
        img = fill(img, Ls, WOOD)
        if k >= 1: Lr = lay(); [line(Lr, [(470, 790 - j * 22), (1150, 795 - j * 22)], 6) for j in range(5)]; img = fill(img, Lr, np.array([0.45, 0.50, 0.25]))
        if k >= 2: Lm = lay(); _rect(Lm, 465, 520, 1155, 690); img = fill(img, Lm, MUD)
        if k >= 3:
            Lt = lay()
            for x in (480, 1140): _rect(Lt, x - 8, 280, x + 8, 520); circ(Lt, (x, 260), 60)
            img = fill(img, Lt, GREEN); Lc = lay(); [circ(Lc, (560 + j * 80, 500), 22) for j in range(8)]; img = fill(img, Lc, CORN)
        up = (t * 0.6) % 1.0; La = lay(); [arrow(La, (x, 790), (x, 790 - 80 * up - 20), 4, 12) for x in (600, 800, 1000)]; img = fill(img, La, WATER * 0.7, 0.8 * ramp(t, 1.2, 1.6))
        img = label(img, " → ".join(steps[:k + 1]), (800, 880), t, 0.2, 30, INK)
        img = title(img, "UNA ISLA QUE SE RIEGA SOLA", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 7) EL CERO
def _maya_num(L, x, y, n, s=1.0):
    if n == 0: poly(L, [(x - 50 * s, y), (x, y - 26 * s), (x + 50 * s, y), (x, y + 22 * s)]); return
    bars, dots = n // 5, n % 5
    for b in range(bars): _rect(L, x - 60 * s, y + 10 * s - b * 26 * s, x + 60 * s, y + 26 * s - b * 26 * s)
    for d in range(dots): circ(L, (x + (d - (dots - 1) / 2) * 30 * s, y - 14 * s - bars * 26 * s), 11 * s)
def r_cero(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "lugar"); base = paper(137)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "lugar":
            for k, (x, s) in enumerate([(560, "DECENAS"), (1040, "UNIDADES")]):
                L = lay(); _rect(L, x - 170, 260, x + 170, 640); img = fill(img, L, np.array([0.85, 0.80, 0.70]), 0.7); img = label(img, s, (x, 700), t, 0.2, 28)
            Lt = lay(); txt(Lt, "1", (560, 450), 260, "AN"); img = fill(img, Lt, INK)
            z = ramp(t, 1.0, 1.5); Lz = lay(); txt(Lz, "0", (1040, 450), 260, "AN", "mm", z); img = fill(img, Lz, RED)
            img = label(img, "SIN EL CERO: «1»" if t < 1.0 else "CON EL CERO: «10»", (800, 830), t, 0.3, 36, RED if t >= 1.0 else INK)
            img = title(img, "EL CERO GUARDA UN LUGAR", t)
        elif mode == "romanos":
            Lt = lay(); txt(Lt, "MMXXV × CCCXLVIII", (800, 380), 110, "AN"); img = fill(img, Lt, INK)
            sh_ = ramp(t, 1.0, 1.6); Lq = lay(); txt(Lq, "= ???", (800, 540), 110, "AN", "mm", sh_); img = fill(img, Lq, RED)
            Lb = lay(); txt(Lb, "2025 × 348 = 704.700", (800, 720), 80, "AN", "mm", ramp(t, 1.9, 2.4)); img = fill(img, Lb, GREEN)
            img = title(img, "MULTIPLICAR SIN CERO", t)
        else:
            u = ease(ramp(t, 0.2, 0.9)); L = lay()
            for k, n in enumerate([1, 5, 13]):
                if t > 0.3 + k * 0.5: _maya_num(L, 330 + k * 300, 470, n, 1.1)
            img = fill(img, L, INK); img = label(img, "1", (330, 600), t, 0.3, 30); img = label(img, "5", (630, 600), t, 0.8, 30); img = label(img, "13", (930, 600), t, 1.3, 30)
            Lf = lay(); _rect(Lf, 1180, 260, 1440, 400); _rect(Lf, 1180, 420, 1440, 560); img = fill(img, Lf, np.array([0.85, 0.80, 0.70]), 0.6 * ramp(t, 1.8, 2.1))
            if t > 2.0: Ls = lay(); _maya_num(Ls, 1310, 330, 1); _maya_num(Ls, 1310, 495, 0); img = fill(img, Ls, INK)
            img = label(img, "= 20", (1310, 620), t, 2.4, 34, RED); img = label(img, "LA CONCHA: EL PISO VACÍO", (800, 860), t, 2.4, 28, RED)
            img = title(img, "PUNTO, RAYA Y CONCHA", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 8) EL HULE
def r_hule(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "atado"); base = paper(138); r = _rng(8)
    ch = [[(r.uniform(300, 1300), r.uniform(250, 750))] for _ in range(9)]
    for c in ch:
        for _ in range(14): x, y = c[-1]; c.append((np.clip(x + r.uniform(-90, 90), 200, 1400), np.clip(y + r.uniform(-60, 60), 220, 780)))
    knots = [(int(r.integers(0, 9)), int(r.integers(1, 14))) for _ in range(16)]
    for i in range(N):
        t = i / FPS; img = base.copy(); sq = 1 + 0.08 * math.sin(t * 5) * (mode == "atado")
        L = lay()
        for c in ch:
            wob = 0 if mode == "atado" else 1
            line(L, [(800 + (x - 800) * sq + wob * 18 * math.sin(t * 2 + y * 0.02), 500 + (y - 500) / sq) for x, y in c], 5)
        img = fill(img, L, RUB, 0.9)
        if mode == "atado":
            Lk = lay()
            for k, (a, b) in enumerate(knots):
                if t > 0.4 + k * 0.08: x, y = ch[a][b]; circ(Lk, (800 + (x - 800) * sq, 500 + (y - 500) / sq), 14)
            img = fill(img, Lk, RED); img = label(img, "LOS NUDOS: LA ENREDADERA (O EL AZUFRE)", (800, 860), t, 1.0, 28, RED)
            img = title(img, "ATAR LOS HILOS DE LA MARAÑA", t)
        else:
            img = label(img, "CALOR: SE DERRITE · FRÍO: SE QUIEBRA", (800, 860), t, 0.6, 28, INK); img = title(img, "EL CAUCHO SIN TRATAR", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 9) EL CACAO
def r_cacao(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(139); steps = [("FERMENTAR", np.array([0.80, 0.70, 0.55])), ("SECAR AL SOL", np.array([0.62, 0.42, 0.28])), ("TOSTAR", CACAO), ("MOLER", CACAO * 0.7)]
    for i in range(N):
        t = i / FPS; img = base.copy()
        for k, (s, col) in enumerate(steps):
            x = 290 + k * 340; a = ramp(t, 0.3 + k * 0.45, 0.6 + k * 0.45)
            L = lay()
            if k < 3:
                for j in range(5): circ(L, (x - 60 + (j % 3) * 60, 460 + (j // 3) * 60), 28)
            else: poly(L, [(x - 90, 520), (x + 90, 520), (x + 60, 420), (x - 60, 420)])
            img = fill(img, L, col, a); img = label(img, s, (x, 600), t, 0.3 + k * 0.45, 26)
            if k < 3: La = lay(); arrow(La, (x + 100, 480), (x + 230, 480), 5, 14); img = fill(img, La, INK, 0.6 * a)
        img = label(img, "AMARGAS Y SIN GUSTO", (360, 720), t, 0.4, 26, RED); img = label(img, "RECIÉN AHÍ: CHOCOLATE", (1220, 720), t, 2.0, 28, GREEN)
        img = title(img, "ALGUIEN TUVO QUE DESCUBRIR CADA PASO", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 10) LOS PRECIOS EN CACAO (1545)
def r_precios(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(140); items = [("UN TOMATE", 1), ("UN AGUACATE", 3), ("UN CONEJO", 30), ("UN GUAJOLOTE", 100)]
    for i in range(N):
        t = i / FPS; img = base.copy()
        for k, (s, n) in enumerate(items):
            y = 290 + k * 140; t0 = 0.3 + k * 0.5; g = ease(ramp(t, t0, t0 + 0.6)); img = label(img, s, (380, y), t, t0, 32)
            L = lay(); m = int(round(min(n, 50) * g))
            for j in range(m): circ(L, (620 + (j % 25) * 32, y - 14 + (j // 25) * 30), 12)
            img = fill(img, L, CACAO); img = label(img, f"{int(round(n * g))}", (1500, y), t, t0, 36, RED)
        img = title(img, "LA LISTA DE PRECIOS DE 1545 · EN SEMILLAS DE CACAO", t, px=44)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 11) LA RUEDA DE COLORES
def r_rueda(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "camara"); base = paper(141, (0.08, 0.08, 0.09)); C3 = [RED * 1.2, np.array([0.2, 0.75, 0.3]), np.array([0.25, 0.4, 0.95])]
    for i in range(N):
        t = i / FPS; img = base.copy(); a = t * 7
        L3 = [lay(), lay(), lay()]
        for k in range(3):
            for j in range(40):
                b0 = a + k * 2 * math.pi / 3 + j / 40 * 2 * math.pi / 3; poly(L3[k], [(560, 470), (560 + math.cos(b0) * 230, 470 + math.sin(b0) * 230), (560 + math.cos(b0 + 0.06) * 230, 470 + math.sin(b0 + 0.06) * 230)])
        for k in range(3): img = fill(img, L3[k], np.clip(C3[k], 0, 1), 0.85)
        Lh = lay(); circ(Lh, (560, 470), 30); img = fill(img, Lh, np.array([0.2, 0.2, 0.2]))
        cur = int(((a % (2 * math.pi)) / (2 * math.pi / 3))) % 3
        if mode == "camara":
            Lc = lay(); _rect(Lc, 900, 380, 1160, 560); poly(Lc, [(1160, 430), (1250, 400), (1250, 540), (1160, 510)]); img = fill(img, Lc, np.array([0.3, 0.3, 0.32]))
            for k in range(3):
                Lf = lay(); _rect(Lf, 1300, 300 + k * 110, 1460, 390 + k * 110); img = fill(img, Lf, np.clip(C3[k], 0, 1), 0.9 if k == cur else 0.25)
            img = label(img, "ROJO · VERDE · AZUL", (1300, 680), t, 0.5, 28, np.array([0.9, 0.9, 0.9]))
            Lt = lay(); txt(Lt, "LA RUEDA DELANTE DE LA CÁMARA", (800, 110), 50, "AN", "mm", ramp(t, 0.25, 0.8)); img = fill(img, Lt, np.array([0.92, 0.9, 0.85]))
        else:
            Le = lay(); poly(Le, [(1060, 470), (1200, 400), (1340, 470), (1200, 540)]); img = fill(img, Le, np.array([0.92, 0.92, 0.92])); Lp = lay(); circ(Lp, (1200, 470), 40); img = fill(img, Lp, np.clip(C3[cur], 0, 1))
            s = ramp(t, 1.4, 2.2); Lr = lay(); _rect(Lr, 1000, 640, 1400, 820); img = fill(img, Lr, np.array([0.85, 0.62, 0.40]), s)
            img = label(img, "EL OJO SUMA LOS TRES", (1200, 590), t, 1.2, 28, np.array([0.9, 0.9, 0.9]))
            Lt = lay(); txt(Lt, "TRES COLORES = TODOS LOS COLORES", (800, 110), 50, "AN", "mm", ramp(t, 0.25, 0.8)); img = fill(img, Lt, np.array([0.92, 0.9, 0.85]))
        out(put, img, t, DUR, i, c=(0.5, 0.5))

# ------------------------------------------------------------------ 12) TEOCINTLE → MAÍZ
def r_teocintle(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); mode = sh.get("mode", "espiga"); base = paper(142)
    for i in range(N):
        t = i / FPS; img = base.copy()
        if mode == "espiga":
            L = lay()
            for k in range(8): poly(L, [(470, 300 + k * 40), (500, 290 + k * 40), (500, 326 + k * 40), (470, 336 + k * 40)])
            img = fill(img, L, np.array([0.55, 0.45, 0.30])); img = label(img, "TEOCINTLE: 5 A 12 GRANOS", (480, 720), t, 0.3, 28)
            g = ease(ramp(t, 0.8, 1.6)); Lm = lay(); poly(Lm, [(1100, 260 + 40 * (1 - g)), (1160, 250), (1220, 260 + 40 * (1 - g)), (1230, 600), (1160, 640), (1090, 600)]); img = fill(img, Lm, CORN, g)
            Lk = lay()
            for r_ in range(14):
                for c in range(4): circ(Lk, (1118 + c * 28, 290 + r_ * 23), 9)
            img = fill(img, Lk, CORN * 0.8, g * 0.8); img = label(img, "MAÍZ: CIENTOS DE GRANOS", (1160, 720), t, 1.2, 28)
            img = label(img, "9.000 AÑOS DE ELEGIR LAS MEJORES SEMILLAS", (800, 860), t, 1.8, 28, RED); img = title(img, "EL MAÍZ NO EXISTÍA: LO INVENTARON", t)
        else:
            for k, (x, s) in enumerate([(480, "LOBO"), (1120, "SALCHICHA")]):
                L = lay(); w = 200 if k == 0 else 260; hgt = 140 if k == 0 else 60
                _rect(L, x - w / 2, 520 - hgt, x + w / 2, 520); circ(L, (x + w / 2 + 30, 520 - hgt - 10), 44); [_rect(L, x + dx - 10, 520, x + dx + 10, 520 + (110 if k == 0 else 30)) for dx in (-w / 2 + 20, w / 2 - 20)]
                img = fill(img, L, GREY if k == 0 else WOOD, ramp(t, 0.3 + k * 0.8, 0.7 + k * 0.8)); img = label(img, s, (x, 740), t, 0.3 + k * 0.8, 34)
            img = label(img, "TEOCINTLE ≈ LOBO · MAÍZ ≈ SALCHICHA", (800, 860), t, 1.8, 28, RED); img = title(img, "PARIENTES QUE NO SE PARECEN", t)
        out(put, img, t, DUR, i)

# ------------------------------------------------------------------ 13) LA NIXTAMALIZACIÓN
def r_nixtamal(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); base = paper(143)
    for i in range(N):
        t = i / FPS; img = base.copy(); op = ease(ramp(t, 1.2, 2.0))
        L = lay(); _rect(L, 600, 300, 1000, 640); img = fill(img, L, GREY * 0.8)
        Ld = lay(); poly(Ld, [(600, 300), (600 - 300 * op, 300 + 60 * op), (600 - 300 * op, 640 - 60 * op), (600, 640)]); img = fill(img, Ld, GREY, 0.9)
        Lw = lay(); circ(Lw, (800, 470), 60, w=10); [line(Lw, [(800, 470), (800 + math.cos(t * 3 * (1 - op) + k * 2.1) * 60, 470 + math.sin(t * 3 * (1 - op) + k * 2.1) * 60)], 8) for k in range(3)]; img = fill(img, Lw, BRASS)
        Lv = lay(); [circ(Lv, (800 + (j - 2) * 60 + 300 * op * (j - 2) / 2, 470 + 220 * op * math.sin(j)), 22) for j in range(5)]; img = fill(img, Lv, CORN, op)
        img = label(img, "NIACINA", (800, 700), t, 1.8, 32, np.array([0.7, 0.5, 0.1]))
        Lc = lay(); _rect(Lc, 1180, 380, 1420, 560); img = fill(img, Lc, np.array([0.96, 0.96, 0.94])); img = label(img, "CAL", (1300, 470), t, 0.2, 36)
        La = lay(); arrow(La, (1170, 470), (1030, 470), 6) if t > 0.8 else None; img = fill(img, La, RED, ramp(t, 0.8, 1.2))
        img = label(img, "+ CÁSCARA BLANDA · + CALCIO", (800, 835), t, 2.2, 28, GREEN); img = title(img, "LA CAL ABRE LA CAJA FUERTE", t)
        out(put, img, t, DUR, i)
