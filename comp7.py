# comp7.py — canal "Caja Naranja" (aviación, reconstrucción segundo a segundo). Estilo ARCILLA: blanco hueso, tinta casi negra,
# naranja de caja negra como acento, rojo SÓLO para lo grave. La DATA es la protagonista. Todo en FRACCIÓN del cuadro (previa 960, final 1920).
#   r_perfil    perfil de altitud que se dibuja en el tiempo del guion (la caída SE VE caer), marcas en la palabra (wk)
#   r_mapa      ruta sobre mapa REAL (Natural Earth 1:10m) con el avión avanzando, hora UTC/local y zoom al punto del evento
#   r_cabina    corte de la cabina visto desde arriba: figuras SIN cara que se mueven por estados (wk): rezo, ataque, puerta, entran, reducen…
#   r_registro  registro de eventos con hora y emisor que se escribe sincronizado a la voz (no hay ATC/CVR públicos: es el registro de FUENTES)
#   r_squawk    el display del transpondedor cambiando (7700/7500) + la tabla de los 3 códigos
#   r_capitulo  tarjeta de capítulo sobria (número mono + título) con la línea de vuelo que se dibuja
#   r_cita      cita con atribución y sello; r_lista tarjetas que se apilan; r_numero cifra grande (y su versión en disputa)
#   r_montana   la montaña rusa: g que siente el pasajero (1 → 0,4 → 0 flota) y el avión con "DATO NO PUBLICADO"
#   r_cajas     las dos cajas naranjas (FDR/CVR) dibujadas, con lo que graba cada una
#   overlays()  superposiciones del canal: RECONSTRUCCIÓN, rótulo limpio, lugar/hora, SELLO de fuente en la palabra, RELOJ UTC/T+
import os, math, json, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from cine import W, H, S, ease, ramp, blur, over
FPS = 24
M = os.environ.get("TGP_M", os.getcwd())
FD = f"{M}/fonts"
def C(h): h = h.lstrip("#"); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))
BG, CARD, INK, MUTED, LINEC = C("EFECE6"), C("FBFAF7"), C("19191C"), C("77736C"), C("D3CFC7")
ORANGE, RED, BLUE, GRAPH, GREEN, VIOLET = C("FF5F1F"), C("D7263D"), C("1F5E8C"), C("3B3B3E"), C("1E8C5A"), C("6B4FA0")
ETIQ = {"CONFIRMADO": GREEN, "REPORTADO": BLUE, "AFIRMADO": VIOLET, "EN DISPUTA": RED}
FONTF = {"reg": "Inter-Regular.ttf", "semi": "Inter-SemiBold.ttf", "bold": "Inter-Bold.ttf", "black": "Archivo-Black.ttf", "cond": "Archivo-Cond.ttf",
         "mono": "Mono-Medium.ttf", "monob": "Mono-Bold.ttf"}
K = 2                                                                      # supermuestreo: se dibuja a 2x y se reduce (bordes limpios)
_FC = {}
def F(k, px, kk=K):
    key = (k, int(px * S * kk))
    if key not in _FC: _FC[key] = ImageFont.truetype(f"{FD}/{FONTF[k]}", max(6, int(px * S * kk)))
    return _FC[key]
def lerp(a, b, u): return a + (b - a) * u
def kv(keys, t):
    if not keys: return 0.0
    if t <= keys[0][0]: return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1: return v0 + (v1 - v0) * ease((t - t0) / max(1e-6, t1 - t0))
    return keys[-1][1]
def hms(s, sec=True):
    s = int(round(s)) % 86400; return f"{s // 3600:02d}:{s % 3600 // 60:02d}" + (f":{s % 60:02d}" if sec else "")
def tsec(x): p = [int(v) for v in x.split(":")] + [0, 0]; return p[0] * 3600 + p[1] * 60 + p[2]
def wkt(sh, i, dflt=None):
    w = sh.get("wk") or []
    return w[i][0] if i < len(w) else dflt
def esn(n): return f"{int(round(n)):,}".replace(",", ".")                  # 14.000 (miles con punto)

class Cv:
    """lienzo RGBA a 2x; coordenadas en FRACCIÓN del cuadro (x,y), tamaños en px de diseño 1920"""
    def __init__(s, bg=BG, base=None, k=K):
        # RGB + Draw("RGBA") = PIL MEZCLA la transparencia (sobre una imagen RGBA la escribiría tal cual: barras opacas)
        s.k = k; s.w, s.h = int(W * k), int(H * k)
        if base is not None: s.im = Image.fromarray((np.clip(base, 0, 1) * 255).astype(np.uint8)).resize((s.w, s.h)) if k != 1 else Image.fromarray((np.clip(base, 0, 1) * 255).astype(np.uint8))
        else: s.im = Image.new("RGB", (s.w, s.h), tuple(bg if bg is not None else BG))
        s.d = ImageDraw.Draw(s.im, "RGBA")
    def P(s, x, y): return (x * s.w, y * s.h)
    def px(s, v): return v * S * s.k
    def col(s, c, a=1.0): return tuple(c) + (int(255 * max(0, min(1, a))),)
    def rect(s, x0, y0, x1, y1, c, a=1.0, r=0, outline=None, ow=0):
        s.d.rounded_rectangle([*s.P(x0, y0), *s.P(x1, y1)], radius=s.px(r), fill=s.col(c, a) if c is not None else None,
                              outline=s.col(outline, a) if outline else None, width=int(s.px(ow)) if ow else 0)
    def card(s, x0, y0, x1, y1, a=1.0, r=14, c=CARD):              # tarjeta blanca con sombra suave (capas)
        for k in range(6, 0, -1):
            o = k * 3
            s.d.rounded_rectangle([s.P(x0, y0)[0] - s.px(o) * 0.3, s.P(x0, y0)[1] + s.px(o) * 0.5, s.P(x1, y1)[0] + s.px(o) * 0.3, s.P(x1, y1)[1] + s.px(o) * 1.1],
                                  radius=s.px(r + o), fill=(40, 30, 20, int(9 * a)))
        s.rect(x0, y0, x1, y1, c, a, r)
    def line(s, pts, c, w=3, a=1.0):
        if len(pts) > 1: s.d.line([s.P(*p) for p in pts], fill=s.col(c, a), width=max(1, int(s.px(w))), joint="curve")
    def circle(s, x, y, r, c, a=1.0, outline=None, ow=0):
        X, Y = s.P(x, y); R = s.px(r)
        s.d.ellipse([X - R, Y - R, X + R, Y + R], fill=s.col(c, a) if c is not None else None, outline=s.col(outline, a) if outline else None, width=int(s.px(ow)) if ow else 0)
    def text(s, t, x, y, size, f="reg", c=INK, a=1.0, anchor="la", spacing=1.2, track=0):
        if a <= 0 or not t: return
        fo = F(f, size, s.k)
        if track:
            X, Y = s.P(x, y); tw = sum(s.d.textlength(ch, font=fo) + s.px(track) for ch in t) - s.px(track)
            if anchor[0] == "m": X -= tw / 2
            elif anchor[0] == "r": X -= tw
            for ch in t: s.d.text((X, Y), ch, font=fo, fill=s.col(c, a), anchor="l" + anchor[1]); X += s.d.textlength(ch, font=fo) + s.px(track)
            return
        s.d.multiline_text(s.P(x, y), t, font=fo, fill=s.col(c, a), anchor=anchor, spacing=s.px(size) * (spacing - 1)) if "\n" in t else \
            s.d.text(s.P(x, y), t, font=fo, fill=s.col(c, a), anchor=anchor)
    def tw(s, t, size, f="reg"): return s.d.textlength(t, font=F(f, size, s.k)) / s.w
    def wrap(s, t, size, f, maxw):
        out, cur = [], ""
        for w in t.split():
            if cur and s.tw(cur + " " + w, size, f) > maxw: out.append(cur); cur = w
            else: cur = (cur + " " + w).strip()
        if cur: out.append(cur)
        return out
    def out(s):
        im = s.im.resize((W, H), Image.LANCZOS) if s.k != 1 else s.im
        return np.asarray(im).astype(np.float32) / 255

def grade(img, t, i, strength=1.0):
    """acabado ARCILLA: sin halación roja ni temblor; viñeta leve y grano fino (que no parezca vector plano)"""
    yy, xx = np.ogrid[:H, :W]
    v = 1 - 0.10 * strength * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.5
    img = img * v[..., None]
    gr = np.random.default_rng(i).normal(0, 1, (H // 2, W // 2)).astype(np.float32)
    img = img + cv2.resize(gr, (W, H))[..., None] * 0.012 * strength
    return np.clip(img, 0, 1)

def footer(cv, txt, a=1.0, y=0.955, x=0.04, c=MUTED):
    cv.text(txt.upper(), x, y, 15, "mono", c, a, "lm", track=1.2)

# ============================================================== SUPERPOSICIONES DEL CANAL (las llama plano.put cuando TGP_LOOK=clay)
_OV = {}
def overlays(img, t, sh, DUR):
    lay = None
    def L():
        nonlocal lay
        if lay is None: lay = Cv(base=img, k=1)
        return lay
    if sh.get("tag"):                                                     # caja fija RECONSTRUCCIÓN arriba a la derecha
        cv = L(); txt = sh["tag"] if isinstance(sh["tag"], str) else "RECONSTRUCCIÓN"
        w_ = cv.tw(txt, 15, "monob") + 0.016
        cv.rect(0.96 - w_, 0.045, 0.96, 0.083, (25, 25, 28), 0.78, r=3); cv.text(txt, 0.96 - w_ / 2, 0.064, 15, "monob", (245, 243, 238), 1, "mm", track=1.5)
    if sh.get("rotulo"):                                                  # rótulo limpio: nombre (negro) + rol (mono) — personas SIN cara
        nm, rol = sh["rotulo"]; k = ramp(t, 0.3, 0.8) * (1 - ramp(t, DUR - 0.6, DUR - 0.1))
        if k > 0:
            cv = L(); w_ = max(cv.tw(nm.upper(), 26, "bold"), cv.tw(rol.upper(), 14, "mono")) + 0.03; x0 = 0.045 - (1 - k) * 0.03
            cv.rect(x0, 0.80, x0 + w_, 0.895, (22, 22, 25), 0.9 * k, r=4)
            cv.text(nm.upper(), x0 + 0.015, 0.828, 26, "bold", (250, 248, 244), k, "lm")
            cv.text(rol.upper(), x0 + 0.015, 0.868, 14, "mono", (200, 196, 188), k, "lm", track=1)
    if sh.get("lugar"):                                                   # lugar y hora (abajo a la izquierda, barra naranja)
        a_, b_ = sh["lugar"]; k = ramp(t, 0.2, 0.7) * (1 - ramp(t, DUR - 0.5, DUR))
        if k > 0:
            cv = L(); cv.rect(0.045, 0.835, 0.049, 0.905, ORANGE, k)
            cv.text(a_.upper(), 0.058, 0.852, 30, "black", INK if not sh.get("dark") else (250, 248, 244), k, "lm")
            cv.text(b_.upper(), 0.058, 0.890, 15, "mono", MUTED if not sh.get("dark") else (215, 210, 200), k, "lm", track=1.2)
    if sh.get("sello"):                                                   # SELLO de fuente que entra en la palabra
        et, src = sh["sello"][:2]; t0 = sh.get("_sello_t", 0.4); k = ramp(t, t0, t0 + 0.25)
        if k > 0:
            cv = L(); col = ETIQ.get(et, INK); w_ = cv.tw(et, 17, "monob") + 0.022; x1 = 0.955; y0 = 0.86 if not sh.get("sello_top") else 0.11
            sc = 1 + 0.25 * (1 - ease(ramp(t, t0, t0 + 0.18)))           # golpe de sello: entra grande y se asienta
            cx, cy = x1 - w_ / 2, y0 + 0.021; ww, hh = w_ * sc / 2, 0.021 * sc
            cv.rect(cx - ww, cy - hh, cx + ww, cy + hh, col, 0.95 * k, r=3)
            cv.text(et, cx, cy, 17 * sc, "monob", (255, 255, 255), k, "mm", track=1.6)
            sw = cv.tw(src.upper(), 13, "mono")
            cv.rect(x1 - sw - 0.016, y0 + 0.048, x1, y0 + 0.078, (250, 248, 244), 0.88 * k, r=3)
            cv.text(src.upper(), x1 - 0.008, y0 + 0.063, 13, "mono", INK, k, "rm", track=0.8)
    if sh.get("reloj"):                                                   # RELOJ del vuelo: UTC + hora saudí + T± desde 05:21:00
        u0, rate = tsec(sh["reloj"][0]), (sh["reloj"][1] if len(sh["reloj"]) > 1 else 1.0)
        now = u0 + t * rate; tp = now - tsec("05:21:00"); cv = L(); x0, y0 = 0.045, 0.055
        cv.rect(x0, y0, x0 + 0.205, y0 + 0.105, (22, 22, 25), 0.82, r=4)
        cv.text(hms(now) + " UTC", x0 + 0.012, y0 + 0.033, 30, "monob", (250, 248, 244), 1, "lm")
        cv.text(f"{hms(now + 3 * 3600, False)} HORA SAUDÍ", x0 + 0.012, y0 + 0.068, 14, "mono", (200, 196, 188), 1, "lm", track=1)
        sg = "+" if tp >= 0 else "−"; cv.text(f"T{sg}{hms(abs(tp))[3:]}", x0 + 0.193, y0 + 0.068, 15, "monob", ORANGE, 1, "rm")
    if sh.get("fuente"):                                                  # línea mono de fuente al pie
        k = ramp(t, 0.3, 0.8); cv = L(); footer(cv, sh["fuente"], k * 0.95, c=MUTED if not sh.get("dark") else (225, 220, 210))
    return lay.out() if lay is not None else img

# ============================================================== PERFIL DE ALTITUD (data reconstruida de los puntos publicados)
# traza REAL digitalizada de Wikimedia Commons ("Flydubai Flight 1073 altitude and speed.svg", Phoenix7777, CC BY-SA 4.0, datos ADS-B)
PERFIL = [("03:05:00", 0), ("03:08:30", 5000), ("03:18:00", 20000), ("03:28:00", 32000), ("04:07:30", 32000), ("04:09:00", 34000), ("05:21:00", 34000),
          ("05:21:08", 33300), ("05:21:14", 33900), ("05:21:20", 30500), ("05:21:34", 16600), ("05:22:05", 16500), ("05:22:31", 21800),
          ("05:23:25", 21700), ("05:24:10", 16200), ("05:24:45", 14300), ("05:25:40", 13900), ("05:26:30", 13600), ("05:28:30", 14400),
          ("05:30:00", 15000), ("05:40:00", 15100), ("05:50:00", 14900), ("06:13:00", 15000), ("06:29:30", 5000), ("06:44:00", 3300), ("06:45:00", 2550)]
SIN_COBERTURA = ("06:13:00", "06:45:00")                             # en el gráfico son rectas: sin datos ADS-B cerca de Tabuk
def perfil_pts():
    return [(tsec(a), v) for a, v in PERFIL]
def alt_at(u):
    P_ = perfil_pts()
    for (t0, v0), (t1, v1) in zip(P_, P_[1:]):
        if t0 <= u <= t1: return v0 + (v1 - v0) * (u - t0) / max(1, t1 - t0)
    return P_[-1][1] if u > P_[-1][0] else P_[0][1]
def r_perfil(sh, sid, DUR, put):
    """sh: win=[utc0, utc1] ventana del eje x · draw=[utcA, utcB] el trazo avanza de A a B en el plano (A=B: estático)
       marks=[[utc, texto, wk_idx|None]] anotaciones · hl=[utcA, utcB, texto] tramo resaltado · title"""
    w0, w1 = [tsec(x) for x in sh.get("win", ["05:15:00", "05:40:00"])]
    dA, dB = [tsec(x) for x in sh.get("draw", ["05:21:00", "05:25:00"])]
    t_in, t_end = sh.get("t_in", 0.4), sh.get("t_end", DUR * 0.85)
    X0, X1, Y0, Y1 = 0.10, 0.90, 0.20, 0.80
    def X(u): return X0 + (X1 - X0) * (u - w0) / (w1 - w0)
    def Y(a): return Y1 - (Y1 - Y0) * a / 40000
    P_ = perfil_pts()
    dense = [(u, alt_at(u)) for u in np.linspace(w0, w1, 900)]
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv()
        cv.text(sh.get("title", "ALTITUD · VUELO FZ1073 · 30 SEP 2026").upper(), X0, 0.12, 17, "monob", MUTED, 1, "lm", track=1.5)
        for a in range(0, 40001, 10000):                                 # grilla
            cv.line([(X0, Y(a)), (X1, Y(a))], LINEC, 1.2, 0.9)
            cv.text(f"{a // 1000} mil ft" if a else "0", X0 - 0.012, Y(a), 14, "mono", MUTED, 1, "rm")
            if a: cv.text(f"{esn(a * 0.3048 / 100) }00 m".replace(".00", ""), X1 + 0.012, Y(a), 12, "mono", LINEC[:3] and MUTED, 0.7, "lm")
        step = sh.get("tick", 300)
        for u in range(int(math.ceil(w0 / step) * step), w1 + 1, step):
            cv.line([(X(u), Y1), (X(u), Y1 + 0.012)], MUTED, 1.2)
            cv.text(hms(u, False) + "Z", X(u), Y1 + 0.035, 13, "mono", MUTED, 1, "mm")
        prog = dA + (dB - dA) * ease(ramp(t, t_in, t_end)) if dB > dA else dB
        pts = [(X(u), Y(a)) for u, a in dense if u <= prog]
        if len(pts) > 1:
            poly = pts + [(pts[-1][0], Y1), (pts[0][0], Y1)]
            cv.d.polygon([cv.P(*p) for p in poly], fill=cv.col(ORANGE, 0.08))
            nc = tsec(SIN_COBERTURA[0]); p_ok = [p for (u, a), p in zip([d for d in dense if d[0] <= prog], pts) if u <= nc]
            p_nc = [p for (u, a), p in zip([d for d in dense if d[0] <= prog], pts) if u >= nc]
            cv.line(p_ok, ORANGE, 5)
            for k_ in range(0, len(p_nc) - 1, 6): cv.line(p_nc[k_:k_ + 4], ORANGE, 4, 0.7)       # tramo sin cobertura: punteado
            hx, hy = pts[-1]; cv.circle(hx, hy, 9, ORANGE); cv.circle(hx, hy, 18, None, 1, outline=ORANGE, ow=2)
            cv.card(min(hx + 0.015, 0.78), max(hy - 0.075, 0.13), min(hx + 0.015, 0.78) + 0.155, max(hy - 0.075, 0.13) + 0.07, 0.95, r=6)
            bx, by = min(hx + 0.015, 0.78), max(hy - 0.075, 0.13)
            cv.text(f"{esn(alt_at(prog))} ft", bx + 0.012, by + 0.025, 24, "monob", INK, 1, "lm")
            cv.text(hms(prog) + " UTC", bx + 0.012, by + 0.052, 13, "mono", MUTED, 1, "lm")
        if sh.get("hl"):
            ha, hb = tsec(sh["hl"][0]), tsec(sh["hl"][1]); k = ramp(t, wkt(sh, 0, DUR * 0.5) if sh.get("hl_wk", True) else 0.6, (wkt(sh, 0, DUR * 0.5) or 0) + 0.4)
            if prog >= hb and k > 0:
                xa, xb = X(ha), X(hb); ya, yb = Y(alt_at(ha)), Y(alt_at(hb))
                cv.rect(xa - 0.006, min(ya, yb) - 0.02, xb + 0.006, max(ya, yb) + 0.02, RED, 0.10 * k, r=4)
                lab = sh["hl"][2]; lw = cv.tw(lab, 20, "bold") + 0.03
                lx = min(xb + 0.02, 0.92 - lw); ly = (ya + yb) / 2
                cv.rect(lx, ly - 0.028, lx + lw, ly + 0.028, RED, k, r=4); cv.text(lab, lx + lw / 2, ly, 20, "bold", (255, 255, 255), k, "mm")
        for j, mk in enumerate(sh.get("marks", [])):
            u = tsec(mk[0]); ti = wkt(sh, mk[2]) if len(mk) > 2 and mk[2] is not None else 0.5 + j * 0.6
            k = ramp(t, ti, ti + 0.35)
            if k <= 0 or u > prog + 1: continue
            x, y = X(u), Y(alt_at(u)); cv.line([(x, y), (x, y - 0.09)], INK, 1.5, k); cv.circle(x, y, 6, INK, k)
            tw_ = cv.tw(mk[1], 15, "semi") + 0.02; cv.rect(x - tw_ / 2, y - 0.125, x + tw_ / 2, y - 0.09, INK, 0.92 * k, r=3)
            cv.text(mk[1], x, y - 0.1075, 15, "semi", (250, 248, 244), k, "mm")
        footer(cv, sh.get("src", "Traza ADS-B: Wikimedia Commons (Phoenix7777, CC BY-SA 4.0) · horas: Flightradar24 / Al Jazeera · punteado = sin cobertura"))
        put(grade(cv.out(), t, i))

# ============================================================== MAPA REAL con ruta
_MAP = {}
LON0, LON1, LAT0, LAT1 = 30.0, 60.0, 21.0, 36.5                         # caja de la base (equirectangular corregida por cos(lat))
CITY = {"DUBÁI": (55.364, 25.253), "TEL AVIV": (34.886, 32.011), "TABUK": (36.619, 28.365), "AMÁN": (35.93, 31.95), "RIAD": (46.72, 24.69),
        "ABU DABI": (54.37, 24.45), "EL CAIRO": (31.24, 30.04), "BAGDAD": (44.36, 33.31)}
COUNTRY_LBL = {"ARABIA SAUDITA": (44.0, 24.6), "JORDANIA": (36.6, 31.15), "ISRAEL": (34.55, 31.2), "IRAK": (43.5, 32.6), "EGIPTO": (30.9, 27.0),
               "EMIRATOS": (54.6, 23.5), "IRÁN": (54.0, 31.5), "KUWAIT": (47.6, 29.4), "QATAR": (51.2, 25.25), "OMÁN": (57.3, 22.5), "SIRIA": (38.4, 34.6)}
RUTA = [("03:05", 55.364, 25.253), ("03:25", 52.6, 26.0), ("03:55", 48.9, 27.2), ("04:25", 45.3, 28.2), ("04:55", 41.7, 29.1), ("05:21", 38.40, 29.90),
        ("05:24", 38.15, 30.02), ("05:33", 37.90, 30.15), ("05:40", 37.45, 30.33), ("05:44", 37.20, 30.25), ("05:46", 37.15, 30.05),
        ("06:00", 37.35, 29.55), ("06:20", 36.95, 28.90), ("06:45", 36.619, 28.365)]
def _merc(lon, lat): lat = max(-85.0, min(85.0, lat)); return lon, math.degrees(math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)))
def map_base():
    if "img" in _MAP: return _MAP["img"], _MAP["f"]
    path = f"{M}/fuentes/mapa_base.png"; meta = f"{M}/fuentes/mapa_base.json"
    x0, y0 = _merc(LON0, LAT0); x1, y1 = _merc(LON1, LAT1); PXW = 7000; PXH = int(PXW * (y1 - y0) / (x1 - x0))
    def f(lon, lat): x, y = _merc(lon, lat); return (x - x0) / (x1 - x0) * PXW, (y1 - y) / (y1 - y0) * PXH
    if not os.path.exists(path):
        gj = json.load(open(f"{M}/fuentes/ne10_countries.geojson", encoding="utf8"))
        im = Image.new("RGB", (PXW, PXH), (216, 222, 226)); d = ImageDraw.Draw(im)            # mar gris azulado muy claro
        for ft in gj["features"]:
            g = ft["geometry"]; polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
            for pl in polys:
                ring = [f(lon, lat) for lon, lat in pl[0]]
                if max(p[0] for p in ring) < 0 or min(p[0] for p in ring) > PXW: continue
                d.polygon(ring, fill=(236, 233, 227)); d.line(ring + ring[:1], fill=(170, 164, 154), width=4)
                for hole in pl[1:]: d.polygon([f(lon, lat) for lon, lat in hole], fill=(216, 222, 226))
        im.save(path); json.dump({"w": PXW, "h": PXH}, open(meta, "w"))
    _MAP["img"] = np.asarray(Image.open(path).convert("RGB")).astype(np.float32) / 255; _MAP["f"] = f
    return _MAP["img"], f
def r_mapa(sh, sid, DUR, put):
    """sh: cam=[[t_rel, lon, lat, ancho_grados], …] · draw=[utcA, utcB] avance del avión · cities=[…] · countries=[…] · t_in/t_end
       mark=[lon, lat, texto] pin del evento · dashed=True tramo previsto (Tel Aviv)"""
    base, f = map_base(); BH, BW = base.shape[:2]
    cams = sh.get("cam", [[0, 41.0, 28.5, 22.0]])
    tA, tB = [tsec(x + ":00" if len(x) == 5 else x) for x in sh.get("draw", ["03:05", "05:21"])]
    RT = [(tsec(a + ":00"), lon, lat) for a, lon, lat in RUTA]
    def pos(u):
        for (t0, a0, b0), (t1, a1, b1) in zip(RT, RT[1:]):
            if t0 <= u <= t1: k = (u - t0) / max(1, t1 - t0); return a0 + (a1 - a0) * k, b0 + (b1 - b0) * k
        return (RT[-1][1], RT[-1][2]) if u > RT[-1][0] else (RT[0][1], RT[0][2])
    t_in, t_end = sh.get("t_in", 0.3), sh.get("t_end", DUR * 0.9)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        lon_c = kv([(c[0], c[1]) for c in cams], t); lat_c = kv([(c[0], c[2]) for c in cams], t); span = kv([(c[0], c[3]) for c in cams], t)
        cx, cy = f(lon_c, lat_c); x0_, _ = f(lon_c - span / 2, lat_c); x1_, _ = f(lon_c + span / 2, lat_c)
        sw = x1_ - x0_; shh = sw * H / W
        Mx = np.float32([[W / sw, 0, -(cx - sw / 2) * W / sw], [0, W / sw, -(cy - shh / 2) * W / sw]])
        img = cv2.warpAffine(base, Mx, (W, H), flags=cv2.INTER_AREA if W / sw < 1 else cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        def sc(lon, lat): X, Y = f(lon, lat); return ((X - (cx - sw / 2)) / sw, (Y - (cy - shh / 2)) / shh)
        cv = Cv(base=img)
        LBL = dict(COUNTRY_LBL, **{k: tuple(v) for k, v in (sh.get("labels") or {}).items()})
        for nm in sh.get("countries", list(COUNTRY_LBL)):
            x, y = sc(*LBL[nm])
            if 0.03 < x < 0.97 and 0.05 < y < 0.95: cv.text(nm, x, y, 19 if span > 10 else 24, "monob", (140, 135, 126), 0.9, "mm", track=4)
        if sh.get("dashed"):                                            # el destino previsto: Tel Aviv
            a = sc(*pos(tA)); b = sc(*CITY["TEL AVIV"]); n = 40
            for k in range(0, n, 2): cv.line([(lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)), (lerp(a[0], b[0], (k + 1) / n), lerp(a[1], b[1], (k + 1) / n))], MUTED, 2, 0.8)
        prog = tA + (tB - tA) * ease(ramp(t, t_in, t_end)) if tB > tA else tB
        us = [u for u in np.linspace(RT[0][0], prog, 400)]
        pts = [sc(*pos(u)) for u in us]
        if len(pts) > 1: cv.line(pts, ORANGE, 7)
        for nm in sh.get("cities", ["DUBÁI", "TEL AVIV", "TABUK"]):
            x, y = sc(*CITY[nm])
            if -0.05 < x < 1.05 and -0.05 < y < 1.05:
                cv.circle(x, y, 7, INK); tw_ = cv.tw(nm, 16, "monob") + 0.016
                cv.rect(x + 0.010, y - 0.042, x + 0.010 + tw_, y - 0.010, INK, 0.92, r=3); cv.text(nm, x + 0.018, y - 0.026, 16, "monob", (250, 248, 244), 1, "lm")
        if sh.get("mark"):
            lo, la, tx = sh["mark"]; x, y = sc(lo, la); k = ramp(t, wkt(sh, 0, 0.8), wkt(sh, 0, 0.8) + 0.4)
            if k > 0:
                pr = (t * 1.3) % 1; cv.circle(x, y, 10 + 40 * pr, None, 1, outline=RED, ow=3 * (1 - pr) + 0.5); cv.circle(x, y, 8, RED, k)
                tw_ = cv.tw(tx, 17, "bold") + 0.02; cv.rect(x - tw_ / 2, y + 0.03, x + tw_ / 2, y + 0.07, RED, k, r=3); cv.text(tx, x, y + 0.05, 17, "bold", (255, 255, 255), k, "mm")
        if len(pts) > 1:                                                # el avión: triángulo orientado según el rumbo
            (xa, ya), (xb, yb) = pts[max(0, len(pts) - 6)], pts[-1]; ang = math.atan2(yb - ya, xb - xa)
            r_ = 0.026; tri = [(xb + math.cos(ang) * r_ * 1.4 * H / W * 1.6, yb + math.sin(ang) * r_ * 1.4),
                               (xb + math.cos(ang + 2.5) * r_ * H / W * 1.6, yb + math.sin(ang + 2.5) * r_), (xb + math.cos(ang - 2.5) * r_ * H / W * 1.6, yb + math.sin(ang - 2.5) * r_)]
            cv.d.polygon([cv.P(*p) for p in tri], fill=cv.col(ORANGE), outline=cv.col(INK), width=int(cv.px(2)))
            if sh.get("clock", True):
                cv.rect(0.045, 0.80, 0.30, 0.905, (22, 22, 25), 0.85, r=4)
                cv.text(hms(prog, False) + " UTC", 0.058, 0.833, 34, "monob", (250, 248, 244), 1, "lm")
                cv.text(f"{hms(prog + 3 * 3600, False)} HORA SAUDÍ · {esn(alt_at(prog))} FT", 0.058, 0.877, 14, "mono", (200, 196, 188), 1, "lm", track=1)
        footer(cv, sh.get("src", "Mapa: Natural Earth (dominio público) · ruta aproximada con los puntos publicados por Flightradar24 / AP"))
        put(grade(cv.out(), t, i))

# ============================================================== CABINA VISTA DESDE ARRIBA (figuras sin cara)
# plano en unidades de diseño: x a lo largo del avión (0 = punta, 1 = fila 3), y a lo ancho (0..1). Se dibuja en la caja (0.08..0.92, 0.18..0.86)
FIG = {"cmd": ("COMANDANTE", BLUE), "fo": ("PRIMER OFICIAL", GRAPH), "tali": ("TALI M.", ORANGE), "tz": ("TZVIKA M.", ORANGE), "hay": ("YANIV H.", ORANGE),
       "asaf": ("ASAF R.", ORANGE), "den": ("DENTISTA", ORANGE), "res1": ("PILOTO DE RESERVA", C("6FA8DC")), "res2": ("PILOTO DE RESERVA", C("6FA8DC"))}
POS0 = {"cmd": (0.17, 0.36, 0, 0), "fo": (0.17, 0.64, 0, 0), "tali": (0.47, 0.30, 90, 0), "tz": (0.73, 0.22, 0, 0), "hay": (0.86, 0.70, 0, 0), "asaf": (0.86, 0.80, 0, 0),
        "den": (0.97, 0.22, 0, 0), "res1": (0.97, 0.80, 0, 0), "res2": (0.97, 0.88, 0, 0)}
def r_cabina(sh, sid, DUR, put):
    """sh: figs=[ids visibles] · steps=[{t|wk, fig:{id:[x,y,rot,acostado]}, door:0..1, hit:id, arrows:[[id,x,y]], hl:"axe"|"yokes"}]
       cam=[[t, zoom, cx, cy]] · labels=True"""
    figs = sh.get("figs", list(POS0)); st = sh.get("steps", [])
    BX0, BX1, BY0, BY1 = 0.05, 0.98, 0.14, 0.90
    keys = []; cur = {k: list(POS0[k]) for k in figs}; door = 0.0; tt = 0.0
    keys.append((0.0, {k: list(v) for k, v in cur.items()}, door, None, [], None))
    for j, s in enumerate(st):
        tt = wkt(sh, s["wk"]) if "wk" in s else s.get("t", tt + 1.0)
        for k, v in s.get("fig", {}).items(): cur[k] = list(v)
        door = s.get("door", door)
        keys.append((tt, {k: list(v) for k, v in cur.items()}, door, s.get("hit"), s.get("arrows", []), s.get("hl")))
    TR = sh.get("tr", 0.6)
    def state(t):
        prev = keys[0]
        for k_ in keys[1:]:
            if t < k_[0]: break
            prev = k_
        idx = keys.index(prev); nxt = keys[idx + 1] if idx + 1 < len(keys) else None
        return prev, keys[idx - 1] if idx > 0 else prev, ease(ramp(t, prev[0], prev[0] + TR))
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; (k1, k0, u) = state(t)
        zc = sh.get("cam", [[0, 1.0, 0.5, 0.5]]); z = kv([(c[0], c[1]) for c in zc], t); ccx = kv([(c[0], c[2]) for c in zc], t); ccy = kv([(c[0], c[3]) for c in zc], t)
        def Pp(x, y):                                                    # unidades del plano -> fracción de cuadro con cámara
            fx = BX0 + (BX1 - BX0) * x; fy = BY0 + (BY1 - BY0) * y
            return 0.5 + (fx - ccx) * z, 0.5 + (fy - ccy) * z * 1.0
        cv = Cv(BG)
        # fuselaje: punta redondeada + cilindro
        nose = [Pp(0.30 - 0.30 * math.cos(th), 0.5 - 0.47 * math.sin(th)) for th in np.linspace(math.pi / 2, -math.pi / 2, 70)]
        outl = [Pp(1.2, 0.03)] + nose + [Pp(1.2, 0.97)]
        cv.d.polygon([cv.P(*p) for p in outl], fill=cv.col(C("FAF8F4")), outline=cv.col(C("B5AEA3")), width=int(cv.px(4 * z)))
        for wx in np.arange(0.36, 1.2, 0.07):                             # ventanillas
            for wy in (0.035, 0.965): xx_, yy_ = Pp(wx, wy); cv.circle(xx_, yy_, 5 * z, C("C9C3B9"))
        def box(x0, y0, x1, y1, c=C("E2DED6"), a=1.0, r=6, ol=C("C9C3B9")):
            p0, p1 = Pp(x0, y0), Pp(x1, y1); cv.rect(p0[0], p0[1], p1[0], p1[1], c, a, r * z, outline=ol, ow=1.5 * z)
        box(0.05, 0.42, 0.20, 0.58, C("D9D4CB"))                         # pedestal / consola
        box(0.04, 0.24, 0.09, 0.30, C("CFC9BF")); box(0.04, 0.70, 0.09, 0.76, C("CFC9BF"))   # columnas de mando (yokes)
        if k1[5] == "yokes" or sh.get("hl") == "yokes":
            for yy in (0.27, 0.73): x, y = Pp(0.065, yy); cv.circle(x, y, 26 * z, None, 1, outline=ORANGE, ow=3)
        box(0.13, 0.27, 0.22, 0.45, C("E8E4DC")); box(0.13, 0.55, 0.22, 0.73, C("E8E4DC"))   # asientos
        box(0.26, 0.05, 0.30, 0.95, C("D3CEC5"), r=2)                    # mamparo cabina de mando
        # puerta blindada (bisagra en y=0.44, abre HACIA la cabina de pasajeros = +x)
        dv = lerp(k0[2], k1[2], u); ang = math.radians(-80 * dv); hx, hy = 0.30, 0.43; L_ = 0.15
        ex, ey = hx + math.sin(-ang) * L_ * 0.55, hy + math.cos(ang) * L_
        cv.d.rectangle([*cv.P(*Pp(0.26, 0.43)), *cv.P(*Pp(0.30, 0.58))], fill=cv.col(BG if dv > 0.05 else C("D3CEC5")))
        cv.line([Pp(hx, hy), Pp(ex, ey)], RED if dv > 0.05 else INK, 7 * z)
        lbl = "PUERTA BLINDADA" + (" · ABIERTA" if dv > 0.5 else " · CERRADA")
        xx, yy = Pp(0.33, 0.50); cv.text(lbl, xx, yy, 13 * z, "monob", RED if dv > 0.5 else MUTED, 1, "lm", track=1)
        box(0.24, 0.06, 0.26, 0.12, C("C7C1B6"), r=2)                    # pared de atrás: el hacha
        if k1[5] == "axe" or sh.get("hl") == "axe":
            x, y = Pp(0.25, 0.09); pr = (t * 1.2) % 1; cv.circle(x, y, (14 + 26 * pr) * z, None, 1, outline=RED, ow=3 * (1 - pr) + 0.5)
            cv.text("HACHA DE EMERGENCIA", x + 0.02, y - 0.03, 13 * z, "monob", RED, 1, "lm", track=1)
        box(0.32, 0.62, 0.46, 0.90, C("E2DED6")); xx, yy = Pp(0.39, 0.76); cv.text("BAÑO", xx, yy, 12 * z, "mono", MUTED, 1, "mm", track=1)
        box(0.32, 0.10, 0.44, 0.38, C("E2DED6")); xx, yy = Pp(0.38, 0.24); cv.text("GALLEY", xx, yy, 12 * z, "mono", MUTED, 1, "mm", track=1)
        for row, x in enumerate((0.70, 0.83, 0.96)):                     # filas 1-3 (3+3)
            for yv in (0.13, 0.22, 0.31, 0.69, 0.78, 0.87): box(x - 0.035, yv - 0.04, x + 0.035, yv + 0.04, C("E8E4DC"), r=5)
        # figuras (cabeza + hombros, SIN cara)
        for fid in figs:
            a0 = k0[1].get(fid, POS0[fid]); a1 = k1[1].get(fid, POS0[fid])
            x = lerp(a0[0], a1[0], u); y = lerp(a0[1], a1[1], u); rot = lerp(a0[2], a1[2], u); ly = lerp(a0[3], a1[3], u)
            nm, col = FIG[fid]; X, Y = Pp(x, y); r0 = 0.028 * z
            ca, sa = math.cos(math.radians(rot)), math.sin(math.radians(rot))
            bl = 0.018 + 0.05 * ly                                       # acostado: cuerpo largo
            body = [(X + (ca * dx - sa * dy) * H / W, Y + (sa * dx + ca * dy)) for dx, dy in
                    [(-r0 * 0.6 - bl * z, -r0 * 1.5), (r0 * 0.4, -r0 * 1.6), (r0 * 0.4, r0 * 1.6), (-r0 * 0.6 - bl * z, r0 * 1.5)]]
            cv.d.polygon([cv.P(*p) for p in body], fill=cv.col(tuple(int(c * 0.88) for c in col)))
            cv.circle(X, Y, 30 * z, col, outline=tuple(int(c * 0.7) for c in col), ow=2)      # cabeza (sin cara)
            if k1[3] == fid and t - k1[0] < 1.6:                         # golpe/alerta: anillo rojo
                pr = ((t - k1[0]) * 1.6) % 1; cv.circle(X, Y, (24 + 50 * pr) * z, None, 1, outline=RED, ow=4 * (1 - pr) + 0.5)
            if sh.get("labels", True):
                tw_ = cv.tw(nm, 14 * z, "monob") + 0.014
                cv.rect(X - tw_ / 2, Y - 0.085 * z, X + tw_ / 2, Y - 0.052 * z, tuple(int(c * 0.82) for c in col), 0.95, r=3)
                cv.text(nm, X, Y - 0.0685 * z, 14 * z, "monob", (255, 255, 255), 1, "mm", track=0.8)
        for fid, ax, ay in k1[4]:
            a1 = k1[1].get(fid, POS0[fid]); p0 = Pp(a1[0], a1[1]); p1 = Pp(ax, ay); k = ramp(t, k1[0], k1[0] + 0.5)
            q = (lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k)); cv.line([p0, q], ORANGE, 4, 0.9)
        cv.text(sh.get("title", "CABINA DE MANDO · VISTA DESDE ARRIBA").upper(), 0.045, 0.085, 16, "monob", MUTED, 1, "lm", track=1.5)
        footer(cv, sh.get("src", "Posiciones ilustrativas · relato del comandante (Ynet), pasajeros y fiscalía de EAU"))
        put(grade(cv.out(), t, i))

# ============================================================== REGISTRO de eventos (se escribe con la voz)
def r_registro(sh, sid, DUR, put):
    """sh: rows=[[hora, emisor, texto, etiqueta|None, wk_idx|None]] · title"""
    rows = sh["rows"]; n = len(rows)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv()
        cv.text(sh.get("title", "REGISTRO · 30 SEP 2026 · HORA UTC"), 0.08, 0.10, 17, "monob", MUTED, 1, "lm", track=1.5)
        cv.line([(0.08, 0.135), (0.92, 0.135)], LINEC, 1.5)
        y = 0.18; dy = min(0.11, 0.70 / max(n, 1))
        for j, r in enumerate(rows):
            hora, emi, txt, et = r[0], r[1], r[2], (r[3] if len(r) > 3 else None)
            ti = wkt(sh, r[4], 0.3 + j * (DUR * 0.75 / n)) if len(r) > 4 and r[4] is not None else 0.3 + j * (DUR * 0.75 / n)
            if t < ti: break
            k = ramp(t, ti, ti + 0.25); ch = int(len(txt) * min(1, (t - ti) / max(0.4, len(txt) / 38)))
            last = (j == n - 1) or (len(rows) > j + 1 and t < (wkt(sh, rows[j + 1][4], 0.3 + (j + 1) * (DUR * 0.75 / n)) if len(rows[j + 1]) > 4 and rows[j + 1][4] is not None else 0.3 + (j + 1) * (DUR * 0.75 / n)))
            if last: cv.rect(0.075, y - 0.012, 0.925, y + dy - 0.03, ORANGE, 0.08, r=4)
            cv.text(hora, 0.09, y + 0.02, 24, "monob", ORANGE, k, "lm")
            cv.text(emi.upper(), 0.20, y + 0.02, 15, "monob", MUTED, k, "lm", track=1.2)
            cv.text(txt[:ch] + ("▍" if ch < len(txt) and (i // 6) % 2 == 0 else ""), 0.38, y + 0.02, 23, "semi", INK, k, "lm")
            if et and ch >= len(txt):
                col = ETIQ[et]; w_ = cv.tw(et, 13, "monob") + 0.014; cv.rect(0.92 - w_, y + 0.002, 0.92, y + 0.038, col, k, r=3)
                cv.text(et, 0.92 - w_ / 2, y + 0.02, 13, "monob", (255, 255, 255), k, "mm", track=1)
            y += dy
        footer(cv, sh.get("src", "Fuentes: Flightradar24 · Al Jazeera · Anadolu · fiscalía de EAU"))
        put(grade(cv.out(), t, i))

# ============================================================== TRANSPONDEDOR
SEG7 = {"0": "abcdef", "1": "bc", "2": "abged", "3": "abgcd", "4": "fgbc", "5": "afgcd", "6": "afgedc", "7": "abc", "8": "abcdefg", "9": "abcfgd", "-": "g", " ": ""}
def seven(cv, ch, x, y, w, h, col, a=1.0, off=(60, 50, 40)):
    th = w * 0.17; segs = {"a": [(x, y), (x + w, y + th * 1.0)], "d": [(x, y + h - th * 1.0), (x + w, y + h)], "g": [(x, y + h / 2 - th / 2), (x + w, y + h / 2 + th / 2)],
                           "f": [(x, y), (x + th * W / H * 0.56, y + h / 2)], "b": [(x + w - th * W / H * 0.56, y), (x + w, y + h / 2)],
                           "e": [(x, y + h / 2), (x + th * W / H * 0.56, y + h)], "c": [(x + w - th * W / H * 0.56, y + h / 2), (x + w, y + h)]}
    for sname, (p0, p1) in segs.items():
        on = sname in SEG7.get(ch, "")
        cv.rect(p0[0], p0[1], p1[0], p1[1], col if on else off, a if on else 0.35 * a, r=3)
def r_squawk(sh, sid, DUR, put):
    """sh: seq=[[código, etiqueta, color, wk_idx|t]] (el display cambia en la palabra) · mode="panel"|"tabla" · rows (tabla)=[[código, texto, wk]]"""
    mode = sh.get("mode", "panel")
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv()
        if mode == "tabla":
            cv.text("TRANSPONDEDOR · LOS TRES CÓDIGOS QUE TODO CONTROLADOR CONOCE", 0.5, 0.13, 17, "monob", MUTED, 1, "mm", track=1.5)
            for j, (code, txt, wi) in enumerate(sh["rows"]):
                ti = wkt(sh, wi, 0.3 + j); k = ramp(t, ti, ti + 0.35); y = 0.27 + j * 0.20
                if k <= 0: continue
                col = RED if code == "7500" else (ORANGE if code == "7700" else INK)
                cv.card(0.16, y, 0.84, y + 0.16, k)
                for d_, ch in enumerate(code): seven(cv, ch, 0.20 + d_ * 0.058, y + 0.03, 0.040, 0.10, col, k, off=(225, 221, 214))
                cv.text(txt, 0.47, y + 0.08, 34, "bold", col if code == "7500" else INK, k, "lm")
        else:
            seq = sh["seq"]; cur = seq[0]; tcur = 0.0
            for j_, s_ in enumerate(seq):
                if j_ == 0: ti = 0.0                                     # el primer estado está desde el cuadro 0
                else: ti = wkt(sh, s_[3]) if isinstance(s_[3], int) and sh.get("wk") else (s_[3] if isinstance(s_[3], (int, float)) else 0)
                if t >= ti: cur = s_; tcur = ti
            code, lab, colk = cur[0], cur[1], cur[2]; col = {"red": RED, "orange": ORANGE, "ink": INK}[colk]
            cv.text("TRANSPONDEDOR", 0.5, 0.17, 18, "monob", MUTED, 1, "mm", track=3)
            cv.rect(0.24, 0.24, 0.76, 0.62, (46, 47, 50), 1, r=18)               # panel del 737
            cv.rect(0.29, 0.29, 0.71, 0.53, (18, 16, 14), 1, r=8)
            fl = 1.0 if t - tcur > 0.5 or (i // 3) % 2 == 0 else 0.35         # parpadea al cambiar
            amber = (255, 168, 60)
            for d_, ch in enumerate(code): seven(cv, ch, 0.315 + d_ * 0.1, 0.315, 0.072, 0.19, amber, fl, off=(52, 40, 26))
            for kx in (0.30, 0.42, 0.58, 0.70): cv.circle(kx, 0.585, 16, (90, 91, 95)); cv.circle(kx, 0.585, 6, (140, 141, 145))
            if lab:
                w_ = cv.tw(lab, 34, "black") + 0.05; k = ramp(t, tcur, tcur + 0.3)
                cv.rect(0.5 - w_ / 2, 0.68, 0.5 + w_ / 2, 0.76, col, k, r=6); cv.text(lab, 0.5, 0.72, 34, "black", (255, 255, 255), k, "mm")
            if len(cur) > 4: cv.text(cur[4], 0.5, 0.81, 18, "mono", MUTED, ramp(t, tcur + 0.2, tcur + 0.6), "mm", track=1)
        footer(cv, sh.get("src", "Códigos: OACI · horas: Flightradar24 / Al Jazeera / Anadolu (no coinciden)"))
        put(grade(cv.out(), t, i))

# ============================================================== CAPÍTULO
def r_capitulo(sh, sid, DUR, put):
    num, title = sh["num"], sh["title"]
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv(); u = ease(ramp(t, 0.1, DUR * 0.8))
        pts = [(0.08 + 0.84 * k / 200, 0.62 - 0.05 * math.sin(k / 200 * 3.2) - (0.10 if k / 200 > 0.62 else 0) * ease(min(1, (k / 200 - 0.62) / 0.04))) for k in range(201)]
        n = int(200 * u) + 1; cv.line(pts[:n], ORANGE, 3, 0.9)
        if n > 1: cv.circle(*pts[n - 1], 7, ORANGE)
        k = ramp(t, 0.2, 0.7)
        cv.text(f"CAPÍTULO {num:02d}" if isinstance(num, int) else str(num), 0.08, 0.36, 20, "monob", ORANGE, k, "lm", track=4)
        cv.text(title.upper(), 0.08 - (1 - k) * 0.02, 0.46, 72, "black", INK, k, "lm")
        if sh.get("sub"): cv.text(sh["sub"].upper(), 0.08, 0.75, 16, "mono", MUTED, ramp(t, 0.6, 1.1), "lm", track=1.5)
        put(grade(cv.out(), t, i))

# ============================================================== CITA / LISTA / NÚMERO
def r_cita(sh, sid, DUR, put):
    """sh: q (texto), who, src, et (etiqueta), foto (ruta archivo, opcional, a la izquierda), big=True (sin tarjeta, centrada)"""
    q, who, src, et = sh["q"], sh.get("who", ""), sh.get("src", ""), sh.get("et")
    foto = None
    if sh.get("foto"):
        im = Image.open(f"{M}/{sh['foto']}").convert("RGB"); foto = im
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv(); k = ramp(t, 0.15, 0.6)
        if sh.get("big"):
            lines = cv.wrap("«" + q + "»", 64, "bold", 0.80)
            y = 0.5 - len(lines) * 0.045
            for j, l in enumerate(lines): cv.text(l, 0.5, y + j * 0.09, 64, "bold", INK, ramp(t, 0.15 + j * 0.25, 0.55 + j * 0.25), "mm")
            cv.text(who.upper(), 0.5, y + len(lines) * 0.09 + 0.04, 17, "mono", MUTED, ramp(t, 0.8, 1.2), "mm", track=1.5)
        else:
            x0 = 0.42 if foto else 0.16; x1 = 0.88 if foto else 0.84
            lines = cv.wrap(q, 40, "semi", x1 - x0 - 0.08)
            hh = 0.10 + len(lines) * 0.062 + 0.08; y0 = 0.5 - hh / 2
            cv.card(x0, y0, x1, y0 + hh, k)
            cv.text("“", x0 + 0.035, y0 + 0.05, 90, "black", ORANGE, k, "lm")
            for j, l in enumerate(lines): cv.text(l, x0 + 0.04, y0 + 0.11 + j * 0.062, 40, "semi", INK, ramp(t, 0.25 + j * 0.15, 0.6 + j * 0.15), "lm")
            cv.text(who, x0 + 0.04, y0 + hh - 0.06, 21, "bold", INK, ramp(t, 0.6, 1.0), "lm")
            cv.text(src.upper(), x0 + 0.04, y0 + hh - 0.028, 13, "mono", MUTED, ramp(t, 0.7, 1.1), "lm", track=1)
            if et:
                col = ETIQ[et]; w_ = cv.tw(et, 14, "monob") + 0.016; cv.rect(x1 - w_ - 0.02, y0 + 0.025, x1 - 0.02, y0 + 0.06, col, k, r=3)
                cv.text(et, x1 - 0.02 - w_ / 2, y0 + 0.0425, 14, "monob", (255, 255, 255), k, "mm", track=1)
        base = cv.out()
        if foto is not None:                                             # foto de archivo a la izquierda con marco blanco y empuje lento
            fw = int(W * 0.30); fh = int(fw * foto.height / foto.width); fh = min(fh, int(H * 0.62))
            z = 1 + 0.04 * t / DUR; ph = np.asarray(foto.resize((int(fw * z), int(fh * z)), Image.LANCZOS)).astype(np.float32) / 255
            ph = ph[(ph.shape[0] - fh) // 2:(ph.shape[0] - fh) // 2 + fh, (ph.shape[1] - fw) // 2:(ph.shape[1] - fw) // 2 + fw]
            x0p, y0p = int(W * 0.08), (H - fh) // 2; a_ = ramp(t, 0.0, 0.4)
            base[y0p - 8:y0p + fh + 8, x0p - 8:x0p + fw + 8] = base[y0p - 8:y0p + fh + 8, x0p - 8:x0p + fw + 8] * (1 - a_) + np.array([0.985, 0.98, 0.97]) * a_
            base[y0p:y0p + fh, x0p:x0p + fw] = base[y0p:y0p + fh, x0p:x0p + fw] * (1 - a_) + ph * a_
        cvf = Cv(base=base, k=1); footer(cvf, sh.get("footer", ""), 1); put(grade(cvf.out(), t, i))

def r_lista(sh, sid, DUR, put):
    """sh: title · items=[[kicker, texto, etiqueta|None, wk|None]] tarjetas que se apilan · dark_last=True (la última, negra: el escenario grave)"""
    it = sh["items"]; n = len(it)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv()
        cv.text(sh.get("title", "").upper(), 0.12, 0.14, 17, "monob", MUTED, ramp(t, 0.1, 0.4), "lm", track=1.5)
        hh = min(0.14, 0.66 / n); y = 0.5 - n * hh / 2 + 0.02
        for j, r in enumerate(it):
            ti = wkt(sh, r[3], 0.3 + j * 0.8) if len(r) > 3 and r[3] is not None else 0.3 + j * 0.8
            k = ramp(t, ti, ti + 0.35); yy = y + j * hh + (1 - k) * 0.03
            if k <= 0: continue
            dark = sh.get("dark_last") and j == n - 1
            cv.card(0.12, yy, 0.88, yy + hh - 0.02, k, r=10, c=(24, 24, 27) if dark else CARD)
            if sh.get("numbered"): cv.text(str(j + 1), 0.15, yy + (hh - 0.02) / 2, 36, "black", ORANGE, k, "mm")
            xt = 0.19 if sh.get("numbered") else 0.15
            cv.text(r[0].upper(), xt, yy + 0.032, 13, "mono", ORANGE if not dark else (255, 160, 110), k, "lm", track=1.2)
            cv.text(r[1], xt, yy + (hh - 0.02) / 2 + 0.014, 30 if hh > 0.11 else 26, "semi", INK if not dark else (250, 248, 244), k, "lm")
            if len(r) > 2 and r[2]:
                col = ETIQ[r[2]]; w_ = cv.tw(r[2], 13, "monob") + 0.014; cv.rect(0.86 - w_, yy + 0.02, 0.86, yy + 0.052, col, k, r=3)
                cv.text(r[2], 0.86 - w_ / 2, yy + 0.036, 13, "monob", (255, 255, 255), k, "mm", track=1)
        footer(cv, sh.get("src", ""))
        put(grade(cv.out(), t, i))

def r_numero(sh, sid, DUR, put):
    """sh: n (texto grande), sub, src · alt=[n2, sub2, wk] segunda cifra que entra y marca EN DISPUTA · count=True (cuenta desde 0)"""
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv(); k = ramp(t, 0.1, 0.5)
        n = sh["n"]
        if sh.get("count") and n.isdigit(): n = str(int(int(n) * ease(ramp(t, 0.1, 1.2))))
        alt = sh.get("alt"); ta = wkt(sh, alt[2]) if alt else None; ka = ramp(t, ta, ta + 0.4) if alt else 0
        x = 0.5 - 0.2 * ka
        cv.card(x - 0.17, 0.30, x + 0.17, 0.70, k)
        cv.text(n, x, 0.47, 150, "black", INK, k, "mm"); cv.text(sh.get("sub", "").upper(), x, 0.62, 15, "mono", MUTED, k, "mm", track=1.2)
        if alt and ka > 0:
            cv.card(0.53, 0.30, 0.87, 0.70, ka); cv.text(alt[0], 0.70, 0.47, 150, "black", INK, ka, "mm")
            cv.text(alt[1].upper(), 0.70, 0.62, 15, "mono", MUTED, ka, "mm", track=1.2)
            w_ = cv.tw("EN DISPUTA", 22, "monob") + 0.03; cv.rect(0.5 - w_ / 2, 0.75, 0.5 + w_ / 2, 0.81, RED, ka, r=4)
            cv.text("EN DISPUTA", 0.5, 0.78, 22, "monob", (255, 255, 255), ka, "mm", track=2)
        footer(cv, sh.get("src", ""))
        put(grade(cv.out(), t, i))

# ============================================================== MONTAÑA RUSA (la g que siente el pasajero)
def r_montana(sh, sid, DUR, put):
    """sh: mode="carro" (montaña rusa: 1 g → liviano → flota) | "avion" (picada del 737: '¿?' + DATO NO PUBLICADO) · wk: [frase, fase]"""
    mode = sh.get("mode", "carro")
    xs = np.linspace(0.06, 0.94, 300)
    if mode == "carro": ys = 0.30 + 0.38 * (1 / (1 + np.exp(-(xs - 0.45) * 14))) - 0.06 * np.exp(-((xs - 0.2) / 0.08) ** 2)
    else: ys = np.array([0.28 + (0.0 if x < 0.30 else (0.40 * ease(min(1, (x - 0.30) / 0.22))) - (0.08 * ease(max(0, min(1, (x - 0.55) / 0.12))) if x > 0.55 else 0) + (0.10 * ease(max(0, min(1, (x - 0.70) / 0.12))) if x > 0.70 else 0)) for x in xs])
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv(); u = ease(ramp(t, 0.4, DUR * 0.85)); j = int(u * 299)
        cv.line([(x, y) for x, y in zip(xs, ys)], LINEC if mode == "carro" else ORANGE, 6 if mode == "carro" else 5)
        if mode == "carro":
            for x in np.linspace(0.08, 0.92, 22):
                y = float(np.interp(x, xs, ys)); cv.line([(x, y + 0.01), (x, 0.86)], LINEC, 2, 0.8)
        j2 = max(1, j); dx, dy = xs[j2] - xs[j2 - 1], ys[j2] - ys[j2 - 1]; ang = math.atan2(dy * H, dx * W)
        x, y = xs[j], ys[j]
        slope = max(0.0, min(1.0, math.sin(ang) * 3.2))                 # cuánto "cae": 0 plano, 1 vertical
        g = 1.0 - slope if mode == "carro" else None
        if mode == "carro":                                              # carrito + maniquí que se separa del asiento cuando g→0
            ca, sa = math.cos(ang), math.sin(ang)
            def R(px_, py_): return (x + (ca * px_ - sa * py_) * H / W, y + (sa * px_ + ca * py_))
            cart = [R(-0.08, -0.03), R(0.08, -0.03), R(0.07, 0.018), R(-0.07, 0.018)]
            cv.d.polygon([cv.P(*p) for p in cart], fill=cv.col(ORANGE))
            lift = (1 - g) * 0.06
            hx, hy = R(0.0, -0.10 - lift); cv.line([R(0.0, -0.03 - lift), (hx, hy)], C("D9D2C5"), 30); cv.circle(hx, hy - 0.02, 26, C("E8E1D4"), outline=C("BDB5A7"), ow=2)
        else:
            cv.text("PICADA DEL VUELO 1073 (forma ilustrativa)", 0.06, 0.20, 15, "monob", MUTED, 1, "lm", track=1)
            ca, sa = math.cos(ang), math.sin(ang)
            def R(px_, py_): return (x + (ca * px_ - sa * py_) * H / W, y + (sa * px_ + ca * py_))
            body = [R(-0.06, -0.008), R(0.055, -0.008), R(0.07, 0), R(0.055, 0.008), R(-0.06, 0.008)]
            cv.d.polygon([cv.P(*p) for p in body], fill=cv.col(C("F7F5F0")), outline=cv.col(INK), width=int(cv.px(2)))
            cv.d.polygon([cv.P(*p) for p in [R(-0.01, -0.008), R(0.02, -0.008), R(-0.02, -0.05)]], fill=cv.col(C("F7F5F0")), outline=cv.col(INK), width=int(cv.px(2)))
        # medidor de g
        cv.card(0.70, 0.08, 0.94, 0.30, 1, r=10)
        cv.text("LO QUE SIENTE EL PASAJERO", 0.82, 0.115, 12, "monob", MUTED, 1, "mm", track=1)
        if mode == "carro":
            cv.text(f"{g:.1f} g".replace(".", ","), 0.82, 0.19, 64, "black", RED if g < 0.15 else INK, 1, "mm")
            st = "PESO NORMAL" if g > 0.85 else ("MÁS LIVIANO" if g > 0.15 else "FLOTA")
            cv.text(st, 0.82, 0.265, 16, "monob", RED if g < 0.15 else ORANGE, 1, "mm", track=2)
        else:
            cv.text("¿ ? g", 0.82, 0.19, 64, "black", INK, 1, "mm")
            cv.text("DATO NO PUBLICADO", 0.82, 0.265, 16, "monob", RED, 1, "mm", track=2)
        footer(cv, sh.get("src", "Ilustración · las fuerzas reales del vuelo están en el registrador de datos, todavía sin publicar"))
        put(grade(cv.out(), t, i))

# ============================================================== LAS DOS CAJAS NARANJAS
def r_cajas(sh, sid, DUR, put):
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; cv = Cv()
        for j, (x0, nm, l1, l2, wi) in enumerate([(0.12, "FDR", "REGISTRADOR DE DATOS", "cientos de parámetros por segundo", 0), (0.54, "CVR", "REGISTRADOR DE VOZ", "últimas 25 h de audio de la cabina", 1)]):
            ti = wkt(sh, wi, 0.3 + j); k = ramp(t, ti, ti + 0.4); fl = 0.02 * math.sin(t * 2 + j)
            if k <= 0: continue
            y0 = 0.30 + fl
            cv.rect(x0, y0, x0 + 0.32, y0 + 0.26, ORANGE, k, r=14)
            for s_ in range(5): cv.rect(x0 + 0.02, y0 + 0.03 + s_ * 0.025, x0 + 0.10, y0 + 0.04 + s_ * 0.025, C("D9480F"), k, r=2)
            cv.rect(x0 + 0.26, y0 + 0.07, x0 + 0.30, y0 + 0.20, C("2B2B2E"), k, r=8)
            cv.text(nm, x0 + 0.16, y0 + 0.17, 54, "black", (255, 255, 255), k, "mm")
            cv.text(l1, x0, y0 + 0.31, 18, "monob", INK, k, "lm", track=1.5); cv.text(l2, x0, y0 + 0.35, 22, "semi", MUTED, k, "lm")
        cv.text(sh.get("title", "LAS «CAJAS NEGRAS» SON NARANJAS: PARA ENCONTRARLAS"), 0.5, 0.15, 18, "monob", MUTED, 1, "mm", track=2)
        footer(cv, sh.get("src", "OACI Anexo 6: CVR de 25 h para aviones con certificado individual desde 2021 · contenido de FZ1073: sin publicar"))
        put(grade(cv.out(), t, i))
