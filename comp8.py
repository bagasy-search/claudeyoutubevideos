# comp8.py — Caja Naranja v2 ("premium"): la DATA vive DENTRO del mundo de la maqueta. Cada componente se compone sobre una PLACA real
# de arcilla generada con agnes (cielo de nubes, mesa de escultor, pedestal del 737, la maqueta cenital del avión, las dos cajas naranjas,
# la escena misma del plano anterior) con sombras proyectadas, empuje de cámara y tipografía grande (mínimo 17 px de diseño a 1080p).
#   perfil8   la caída como CINTA naranja sobre el mar de nubes (sombra sobre las nubes), lectura de altitud y velocidad vertical gigantes
#   mapa8     mapa en RELIEVE de arcilla (Natural Earth + bisel por distancia + textura), inclinado como una mesa, ruta en tubo naranja con sombra
#   cabina8   la maqueta CENITAL real del 737 (placa K_top) con fichas de color con sombra que se mueven en la palabra; puerta que se abre
#   tiras8    REGISTRO como TIRAS DE PROGRESO DE VUELO (las de los controladores) que entran a la bandeja; sello de goma que golpea
#   squawk8   el transpondedor como pieza física con brillo ámbar sobre el pedestal del 737; tabla de códigos en tiras
#   cita8     la cita sobre la ESCENA del plano anterior (oscurecida, empuje lento), tipografía grande, sello
#   lista8    fichas de papel sobre la mesa de arcilla, con sombra y giro leve; numero8: cifra de arcilla recortada parada sobre la mesa
#   montana8  la montaña rusa sobre el cielo; cajas8: llamadas sobre la foto de las dos cajas; capitulo8: capítulo sobre su escena; foto8: archivo
#             como copia en papel apoyada sobre la mesa
#   overlays()  RECONSTRUCCIÓN · rótulo · lugar · SELLO de goma · RELOJ UTC · ALTÍMETRO (la caída) · fuente
import os, math, json, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from cine import W, H, S, ease, ramp
import comp7
from comp7 import (Cv, C, F, BG, CARD, INK, MUTED, LINEC, ORANGE, RED, BLUE, GRAPH, GREEN, VIOLET, ETIQ, FPS, M, kv, hms, tsec, wkt, esn, lerp,
                   PERFIL, SIN_COBERTURA, perfil_pts, alt_at, RUTA, CITY, COUNTRY_LBL, _merc, LON0, LON1, LAT0, LAT1, seven, SEG7)
WHITE = (250, 248, 244)
DARK = (22, 22, 25)

# ------------------------------------------------------------------ placas y luz
_PL = {}
def plate(name, over=1.12):
    key = (name, over)
    if key not in _PL:
        p = f"{M}/img/{name}.png"
        im = Image.open(p).convert("RGB").resize((int(W * over), int(H * over)), Image.LANCZOS).filter(ImageFilter.UnsharpMask(2, 60, 2))
        _PL[key] = np.asarray(im).astype(np.float32) / 255
    return _PL[key]
def cam(pl, t, DUR, z0=1.0, z1=1.06, dx=0.0, dy=0.0, cx=0.5, cy=0.5):
    """empuje de cámara sobre la placa (pl ya es over x el cuadro): z = zoom relativo al cuadro, dx/dy desplazamiento total en fracción"""
    u = ease(min(1, t / max(DUR, 1e-3))); z = lerp(z0, z1, u); ph, pw = pl.shape[:2]
    ox = cx * pw + (u - 0.5) * dx * W; oy = cy * ph + (u - 0.5) * dy * H
    Mx = np.float32([[z, 0, W / 2 - ox * z], [0, z, H / 2 - oy * z]])
    return cv2.warpAffine(pl, Mx, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
def tone(img, act, t=0.0, plate_only=True):
    """luz por acto (la misma que piden las imágenes): dawn cálido · alert frío, oscuro y un latido rojo · day duro · dusk azul gris"""
    if act == "alert":
        g = img.mean(-1, keepdims=True); img = (img * 0.62 + g * 0.38) * np.array([0.86, 0.88, 0.95])
        img = np.clip((img - 0.5) * 1.12 + 0.47, 0, 1)
        yy, xx = np.ogrid[:H, :W]; r = (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
        pulse = 0.5 + 0.5 * math.sin(t * 2 * math.pi * 0.8)
        img = img + (np.clip(r - 0.35, 0, 1) * (0.06 + 0.06 * pulse))[..., None] * np.array([1.0, 0.05, 0.03])
    elif act == "dusk":
        g = img.mean(-1, keepdims=True); img = (img * 0.75 + g * 0.25) * np.array([0.90, 0.94, 1.03])
    elif act == "day":
        img = np.clip((img - 0.5) * 1.05 + 0.52, 0, 1)
    return np.clip(img, 0, 1)
def grade(img, t, i):
    yy, xx = np.ogrid[:H, :W]
    v = 1 - 0.16 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4
    img = img * v[..., None]
    gr = np.random.default_rng(i).normal(0, 1, (H // 2, W // 2)).astype(np.float32)
    return np.clip(img + cv2.resize(gr, (W, H))[..., None] * 0.010, 0, 1)

# ------------------------------------------------------------------ sombras proyectadas (a 1/4 de resolución, rápidas)
def shadows(img, shapes, off=(0.010, 0.018), blur=0.012, a=0.45):
    """shapes: [("rect", x0,y0,x1,y1,r) | ("poly", [(x,y)…]) | ("circle", x,y,r) | ("line", [(x,y)…], w)] en fracción; oscurece img debajo"""
    q = 4; w, h = W // q, H // q
    m = Image.new("L", (w, h), 0); d = ImageDraw.Draw(m)
    ox, oy = off
    for sh in shapes:
        k = sh[0]
        if k == "rect":
            _, x0, y0, x1, y1, r = sh[:6]; al = sh[6] if len(sh) > 6 else 1.0
            d.rounded_rectangle([(x0 + ox) * w, (y0 + oy) * h, (x1 + ox) * w, (y1 + oy) * h], radius=r * w, fill=int(255 * al))
        elif k == "poly": d.polygon([((x + ox) * w, (y + oy) * h) for x, y in sh[1]], fill=int(255 * (sh[2] if len(sh) > 2 else 1)))
        elif k == "circle":
            _, x, y, r = sh[:4]; d.ellipse([(x + ox) * w - r * w, (y + oy) * h - r * w, (x + ox) * w + r * w, (y + oy) * h + r * w], fill=int(255 * (sh[4] if len(sh) > 4 else 1)))
        elif k == "line": d.line([((x + ox) * w, (y + oy) * h) for x, y in sh[1]], fill=255, width=max(1, int(sh[2] * w)), joint="curve")
    m = m.filter(ImageFilter.GaussianBlur(blur * w))
    sm = cv2.resize(np.asarray(m).astype(np.float32) / 255, (W, H), interpolation=cv2.INTER_LINEAR)
    return img * (1 - sm[..., None] * a * np.array([1.0, 1.0, 0.96]))

# ------------------------------------------------------------------ piezas tipográficas del canal
def tag(cv, x, y, txt, size=22, f="monob", fg=WHITE, bg=DARK, a=1.0, anchor="l", pad=0.012, alpha_bg=0.92, track=1.2):
    tw = cv.tw(txt, size, f) + (len(txt) * track * S / W if track else 0) + pad * 2; th = size * S / H * 1.9
    x0 = x if anchor == "l" else (x - tw / 2 if anchor == "m" else x - tw)
    cv.rect(x0, y - th / 2, x0 + tw, y + th / 2, bg, alpha_bg * a, r=4)
    cv.text(txt, x0 + pad, y, size, f, fg, a, "lm", track=track)
    return x0, x0 + tw
def stamp(cv, x, y, et, t0, t, size=30, rot=-6, src=None):
    """SELLO DE GOMA: entra grande y golpea (t0), queda girado con tinta irregular. Devuelve True si se ve"""
    k = ramp(t, t0, t0 + 0.12)
    if k <= 0: return False
    col = ETIQ.get(et, INK); sc = 1 + 0.55 * (1 - ease(ramp(t, t0, t0 + 0.14)))
    fo = F("black", size * sc, 2); tw = cv.d.textlength(et, font=fo) / cv.w
    pw, ph = tw + 0.03 * sc, size * sc * S / H * 1.75
    im = Image.new("RGBA", (int(pw * cv.w) + 40, int(ph * cv.h) + 40), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    bw = max(3, int(5 * S * cv.k * sc))
    d.rounded_rectangle([20, 20, im.width - 20, im.height - 20], radius=int(10 * cv.k), outline=tuple(col) + (235,), width=bw)
    d.text((im.width / 2, im.height / 2), et, font=fo, fill=tuple(col) + (235,), anchor="mm")
    g = np.random.default_rng(len(et) * 7 + int(x * 100)).random((im.height, im.width))      # tinta irregular
    a = np.asarray(im).copy(); a[..., 3] = (a[..., 3] * np.clip(0.55 + 0.6 * cv2.GaussianBlur(g.astype(np.float32), (0, 0), 2.5), 0, 1) * k).astype(np.uint8)
    im = Image.fromarray(a).rotate(rot, resample=Image.BICUBIC, expand=True)
    cv.im.paste(im, (int(x * cv.w - im.width / 2), int(y * cv.h - im.height / 2)), im)
    if src:
        ks = ramp(t, t0 + 0.15, t0 + 0.45)
        if ks > 0: cv.text(src.upper(), x, y + ph / 2 + 0.035, 17, "mono", INK, ks, "mm", track=1)
    return True
def footer(cv, txt, a=1.0, dark=False):
    if not txt: return
    txt = txt.upper(); tw = cv.tw(txt, 17, "mono") + len(txt) * 1.0 * S / W + 0.024
    cv.rect(0.035, 0.935, 0.035 + tw, 0.975, (250, 248, 244) if not dark else (20, 20, 22), 0.80 * a, r=4)
    cv.text(txt, 0.047, 0.955, 17, "mono", INK if not dark else (225, 220, 210), a, "lm", track=1.0)

# ============================================================== SUPERPOSICIONES v2 (más grandes, el sello es de goma, altímetro en la caída)
def overlays(img, t, sh, DUR):
    lay = None
    def L():
        nonlocal lay
        if lay is None: lay = Cv(base=img, k=1)
        return lay
    if sh.get("tag"):
        cv = L(); tag(cv, 0.962, 0.062, sh["tag"] if isinstance(sh["tag"], str) else "RECONSTRUCCIÓN", 18, "monob", anchor="r", alpha_bg=0.72, track=2)
    if sh.get("rotulo"):
        nm, rol = sh["rotulo"]; k = ramp(t, 0.3, 0.8) * (1 - ramp(t, DUR - 0.5, DUR - 0.05))
        if k > 0:
            cv = L(); w_ = max(cv.tw(nm.upper(), 40, "black"), cv.tw(rol.upper(), 19, "mono") + len(rol) * S / W) + 0.045; x0 = 0.045 - (1 - ease(k)) * 0.04
            cv.rect(x0, 0.775, x0 + w_, 0.905, DARK, 0.90 * k, r=6); cv.rect(x0, 0.775, x0 + 0.007, 0.905, ORANGE, k, r=2)
            cv.text(nm.upper(), x0 + 0.022, 0.818, 40, "black", WHITE, k, "lm")
            cv.text(rol.upper(), x0 + 0.022, 0.868, 19, "mono", (205, 200, 192), k, "lm", track=1)
    if sh.get("lugar"):
        a_, b_ = sh["lugar"]; k = ramp(t, 0.2, 0.7) * (1 - ramp(t, DUR - 0.5, DUR))
        if k > 0:
            cv = L(); w_ = max(cv.tw(a_.upper(), 46, "black"), cv.tw(b_.upper(), 20, "mono") + len(b_) * 1.2 * S / W) + 0.05
            cv.rect(0.040, 0.765, 0.040 + w_, 0.905, (250, 248, 244), 0.86 * k, r=6); cv.rect(0.040, 0.765, 0.047, 0.905, ORANGE, k, r=2)
            cv.text(a_.upper(), 0.060, 0.812, 46, "black", INK, k, "lm")
            cv.text(b_.upper(), 0.060, 0.866, 20, "mono", MUTED, k, "lm", track=1.2)
    if sh.get("sello"):
        et, src = sh["sello"][:2]; t0 = sh.get("_sello_t", 0.4)
        cv = L(); stamp(cv, 0.855, 0.80 if not sh.get("sello_top") else 0.20, et, t0, t, 30, -5, src)
    if sh.get("reloj"):
        u0, rate = tsec(sh["reloj"][0]), (sh["reloj"][1] if len(sh["reloj"]) > 1 else 1.0)
        now = u0 + t * rate; tp = now - tsec("05:21:00"); cv = L(); x0, y0 = 0.040, 0.050
        cv.rect(x0, y0, x0 + 0.245, y0 + 0.125, DARK, 0.84, r=6)
        cv.text(hms(now) + " UTC", x0 + 0.014, y0 + 0.042, 44, "monob", WHITE, 1, "lm")
        cv.text(f"{hms(now + 3 * 3600, False)} HORA SAUDÍ", x0 + 0.014, y0 + 0.093, 18, "mono", (205, 200, 192), 1, "lm", track=1)
        sg = "+" if tp >= 0 else "−"; cv.text(f"T{sg}{hms(abs(tp))[3:]}", x0 + 0.232, y0 + 0.093, 20, "monob", ORANGE, 1, "rm")
    if sh.get("alti"):                                                  # ALTÍMETRO persistente en la caída: la altitud REAL del ADS-B en ese segundo
        u0, rate = tsec(sh["alti"][0]), (sh["alti"][1] if len(sh["alti"]) > 1 else 1.0)
        now = u0 + t * rate; a = alt_at(now); vs = (alt_at(now + 2) - alt_at(now - 2)) / 4 * 60
        cv = L(); x1, y0 = 0.962, 0.115
        cv.rect(x1 - 0.215, y0, x1, y0 + 0.165, DARK, 0.84, r=6)
        cv.text("ALTITUD · ADS-B", x1 - 0.200, y0 + 0.030, 16, "monob", (205, 200, 192), 1, "lm", track=1.5)
        cv.text(f"{esn(round(a / 10) * 10)} FT", x1 - 0.200, y0 + 0.080, 44, "monob", WHITE, 1, "lm")
        col = RED if vs < -3000 else ((120, 200, 140) if vs > 1500 else (205, 200, 192))
        cv.text(f"{'▼' if vs < -300 else ('▲' if vs > 300 else '■')} {esn(abs(round(vs / 100) * 100))} FT/MIN", x1 - 0.200, y0 + 0.132, 20, "monob", col, 1, "lm")
    if sh.get("fuente"):
        k = ramp(t, 0.3, 0.8); cv = L(); footer(cv, sh["fuente"], k)
    return lay.out() if lay is not None else img

# ============================================================== PERFIL: la cinta naranja sobre el mar de nubes
def r_perfil8(sh, sid, DUR, put):
    w0, w1 = [tsec(x) for x in sh.get("win", ["05:15:00", "05:40:00"])]
    dA, dB = [tsec(x) for x in sh.get("draw", ["05:21:00", "05:25:00"])]
    t_in, t_end = sh.get("t_in", 0.4), sh.get("t_end", DUR * 0.85)
    X0, X1, Y0, Y1 = 0.30, 0.95, 0.20, 0.80
    def X(u): return X0 + (X1 - X0) * (u - w0) / (w1 - w0)
    def Y(a): return Y1 - (Y1 - Y0) * a / 40000
    dense = [(u, alt_at(u)) for u in np.linspace(w0, w1, 700)]
    pl = plate(sh.get("plate", "P_sky"), 1.15)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        prog = dA + (dB - dA) * ease(ramp(t, t_in, t_end)) if dB > dA else dB
        base = tone(cam(pl, t, DUR, 1.0, 1.05, dx=0.03, dy=-0.02), sh.get("act"), t)
        pts = [(X(u), Y(a)) for u, a in dense if u <= prog]
        base = shadows(base, [("line", pts, 0.006)] if len(pts) > 1 else [], off=(0.012, 0.045), blur=0.010, a=0.38)
        cv = Cv(base=base)
        for a in range(10000, 40001, 10000):                            # niveles: líneas finas grabadas en el aire
            cv.line([(X0, Y(a)), (X1, Y(a))], (255, 255, 255), 1.5, 0.55)
            cv.text(f"{a // 1000}.000 FT", X1, Y(a) - 0.018, 17, "monob", (255, 255, 255), 0.85, "rm", track=1)
        if len(pts) > 1:
            ymin = min(p[1] for p in pts); yb = Y1 + 0.10                  # la "pared" bajo la cinta: se desvanece hacia abajo (cortina de luz)
            for q in range(12):
                ya_, yb_ = lerp(ymin, yb, q / 12), lerp(ymin, yb, (q + 1) / 12)
                band = [(x, max(y, ya_)) for x, y in pts]; poly = band + [(pts[-1][0], yb_), (pts[0][0], yb_)]
                cv.d.polygon([cv.P(*p) for p in poly], fill=cv.col((255, 250, 240), 0.05))
            nc = tsec(SIN_COBERTURA[0]); dd = [d for d in dense if d[0] <= prog]
            p_ok = [p for (u, a), p in zip(dd, pts) if u <= nc]; p_nc = [p for (u, a), p in zip(dd, pts) if u >= nc]
            cv.line(p_ok, C("B8400F"), 13); cv.line(p_ok, ORANGE, 10); cv.line([(x, y - 0.003) for x, y in p_ok], C("FF9A6A"), 3, 0.9)
            for k_ in range(0, len(p_nc) - 1, 6): cv.line(p_nc[k_:k_ + 4], ORANGE, 8, 0.75)
            hx, hy = pts[-1]
            pr = (t * 1.1) % 1; cv.circle(hx, hy, 14 + 40 * pr, None, 1, outline=ORANGE, ow=4 * (1 - pr) + 0.5); cv.circle(hx, hy, 13, WHITE, outline=ORANGE, ow=5)
        if sh.get("hl"):
            ha, hb = tsec(sh["hl"][0]), tsec(sh["hl"][1]); tk = wkt(sh, 0, DUR * 0.5) if sh.get("hl_wk", True) else 0.6
            k = ramp(t, tk, (tk or 0) + 0.4)
            if prog >= hb and k > 0:
                xa, xb = X(ha), X(hb); ya, yb = Y(alt_at(ha)), Y(alt_at(hb))
                cv.line([(xb + 0.018, min(ya, yb)), (xb + 0.03, min(ya, yb)), (xb + 0.03, max(ya, yb)), (xb + 0.018, max(ya, yb))], RED, 5, k)
                lab = sh["hl"][2]; lw = cv.tw(lab, 30, "black") + 0.03; lx = min(xb + 0.045, 0.96 - lw); ly = (ya + yb) / 2
                cv.rect(lx, ly - 0.035, lx + lw, ly + 0.035, RED, k, r=5); cv.text(lab, lx + lw / 2, ly, 30, "black", WHITE, k, "mm")
        for j, mk in enumerate(sh.get("marks", [])):
            u = tsec(mk[0]); ti = wkt(sh, mk[2]) if len(mk) > 2 and mk[2] is not None else 0.5 + j * 0.6
            k = ramp(t, ti, ti + 0.35)
            if k <= 0 or u > prog + 1: continue
            x, y = X(u), Y(alt_at(u)); cv.line([(x, y), (x, y - 0.10)], INK, 2.5, k); cv.circle(x, y, 8, INK, k)
            tag(cv, x, y - 0.12, mk[1], 22, "monob", a=k, anchor="m")
        # LECTURA gigante a la izquierda (lo que no se puede dejar de mirar)
        a_now = alt_at(prog); vs = (alt_at(prog + 2) - alt_at(prog - 2)) / 4 * 60
        cv.rect(0.035, 0.20, 0.265, 0.62, DARK, 0.86, r=8)
        cv.text(sh.get("title", "ALTITUD · FZ1073").upper(), 0.052, 0.245, 17, "monob", (205, 200, 192), 1, "lm", track=1.5)
        cv.text(esn(round(a_now / 10) * 10), 0.052, 0.335, 84, "black", WHITE, 1, "lm")
        cv.text("PIES", 0.052, 0.405, 20, "monob", (205, 200, 192), 1, "lm", track=3)
        cv.text(hms(prog) + " UTC", 0.052, 0.475, 30, "monob", ORANGE, 1, "lm")
        col = RED if vs < -3000 else (205, 200, 192)
        cv.text(("▼ " if vs < -300 else ("▲ " if vs > 300 else "■ ")) + esn(abs(round(vs / 100) * 100)) + " FT/MIN", 0.052, 0.545, 24, "monob", col, 1, "lm")
        cv.text(f"≈ {esn(a_now * 0.3048)} m", 0.052, 0.590, 18, "mono", (205, 200, 192), 1, "lm")
        footer(cv, sh.get("src", "Traza ADS-B: Wikimedia Commons (Phoenix7777, CC BY-SA 4.0) · horas: Flightradar24 / Al Jazeera · punteado = sin cobertura"))
        put(grade(cv.out(), t, i))

# ============================================================== MAPA en RELIEVE de arcilla, inclinado como una mesa
_MAP8 = {}
def map8_base():
    if "img" in _MAP8: return _MAP8["img"], _MAP8["f"]
    path = f"{M}/fuentes/mapa8_base.png"
    x0, y0 = _merc(LON0, LAT0); x1, y1 = _merc(LON1, LAT1); PXW = 7000; PXH = int(PXW * (y1 - y0) / (x1 - x0))
    def f(lon, lat): x, y = _merc(lon, lat); return (x - x0) / (x1 - x0) * PXW, (y1 - y) / (y1 - y0) * PXH
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
        L_ = np.asarray(land).astype(np.uint8); B_ = np.asarray(bord).astype(np.float32) / 255
        dist = cv2.distanceTransform((L_ > 0).astype(np.uint8), cv2.DIST_L2, 5)
        hgt = np.clip(dist / 60.0, 0, 1) ** 0.6                          # bisel del borde costero: la tierra es una placa de arcilla elevada
        rng = np.random.default_rng(4)
        nz = sum(cv2.resize(rng.random((PXH // s + 1, PXW // s + 1)).astype(np.float32), (PXW, PXH), interpolation=cv2.INTER_CUBIC) * (s / 400) for s in (400, 160, 60, 20))
        hgt = hgt * (0.85 + 0.30 * nz) * (L_ > 0)
        hgt = cv2.GaussianBlur(hgt.astype(np.float32), (0, 0), 3)
        gy, gx = np.gradient(hgt * 40)
        shade = np.clip(0.5 - (gx * -0.7 + gy * -0.7) * 0.9, 0, 1)        # luz desde arriba a la izquierda
        land_c = np.array([0.93, 0.915, 0.885]); sea_c = np.array([0.80, 0.845, 0.865])
        lm = (L_ > 0).astype(np.float32)[..., None]
        sea_tex = 1 + 0.02 * (cv2.resize(rng.random((PXH // 30 + 1, PXW // 30 + 1)).astype(np.float32), (PXW, PXH)) - 0.5)[..., None]
        img = lm * land_c * (0.80 + 0.40 * shade[..., None]) + (1 - lm) * sea_c * sea_tex
        sd = cv2.GaussianBlur(lm[..., 0], (0, 0), 14); sd = np.roll(np.roll(sd, 10, 0), 8, 1)          # sombra de la placa sobre el mar
        img = img * (1 - (1 - lm) * sd[..., None] * 0.18)
        bb = cv2.GaussianBlur(B_, (0, 0), 1.2)[..., None]                # fronteras: surco grabado (oscuro + luz corrida)
        img = img * (1 - bb * 0.22 * lm) + np.roll(bb, 3, 0) * 0.06 * lm
        Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save(path)
    _MAP8["img"] = np.asarray(Image.open(path).convert("RGB")).astype(np.float32) / 255; _MAP8["f"] = f
    return _MAP8["img"], f
def r_mapa8(sh, sid, DUR, put):
    base, f = map8_base()
    cams = sh.get("cam", [[0, 41.0, 28.5, 22.0]])
    tA, tB = [tsec(x + ":00" if len(x) == 5 else x) for x in sh.get("draw", ["03:05", "05:21"])]
    RT = [(tsec(a + ":00"), lon, lat) for a, lon, lat in RUTA]
    def pos(u):
        for (t0, a0, b0), (t1, a1, b1) in zip(RT, RT[1:]):
            if t0 <= u <= t1: k = (u - t0) / max(1, t1 - t0); return a0 + (a1 - a0) * k, b0 + (b1 - b0) * k
        return (RT[-1][1], RT[-1][2]) if u > RT[-1][0] else (RT[0][1], RT[0][2])
    t_in, t_end = sh.get("t_in", 0.3), sh.get("t_end", DUR * 0.9)
    TILT = 0.16                                                          # la mesa: el borde de arriba se achica (perspectiva)
    src = np.float32([[0, 0], [W, 0], [W, H], [0, H]]); dst = np.float32([[W * TILT, -H * 0.06], [W * (1 - TILT), -H * 0.06], [W * 1.02, H], [-W * 0.02, H]])
    PM = cv2.getPerspectiveTransform(src, dst)
    def warp_pt(x, y):
        v = PM @ np.array([x * W, y * H, 1.0]); return v[0] / v[2] / W, v[1] / v[2] / H
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        lon_c = kv([(c[0], c[1]) for c in cams], t); lat_c = kv([(c[0], c[2]) for c in cams], t); span = kv([(c[0], c[3]) for c in cams], t) * 1.25
        cx, cy = f(lon_c, lat_c); x0_, _ = f(lon_c - span / 2, lat_c); x1_, _ = f(lon_c + span / 2, lat_c)
        sw = x1_ - x0_; shh = sw * H / W
        Mx = np.float32([[W / sw, 0, -(cx - sw / 2) * W / sw], [0, W / sw, -(cy - shh / 2) * W / sw]])
        img = cv2.warpAffine(base, Mx, (W, H), flags=cv2.INTER_AREA if W / sw < 1 else cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        def sc(lon, lat): X, Y = f(lon, lat); return ((X - (cx - sw / 2)) / sw, (Y - (cy - shh / 2)) / shh)
        prog = tA + (tB - tA) * ease(ramp(t, t_in, t_end)) if tB > tA else tB
        pts = [sc(*pos(u)) for u in np.linspace(RT[0][0], prog, 300)]
        img = shadows(img, [("line", pts, 0.007)] if len(pts) > 1 else [], off=(0.006, 0.012), blur=0.006, a=0.40)
        cv = Cv(base=img)
        LBL = dict(COUNTRY_LBL, **{k: tuple(v) for k, v in (sh.get("labels") or {}).items()})
        for nm in sh.get("countries", list(COUNTRY_LBL)):
            if nm in ("ISRAEL", "KUWAIT", "QATAR") and span > 14: continue  # países chicos: en el plano general se pisan con los vecinos
            x, y = sc(*LBL[nm])
            if 0.03 < x < 0.97 and 0.05 < y < 0.95:                     # grabado en la arcilla: oscuro + luz corrida
                sz = 34 if span < 14 else 26
                cv.text(nm, x + 0.0012, y + 0.002, sz, "monob", (255, 255, 255), 0.55, "mm", track=8)
                cv.text(nm, x, y, sz, "monob", (120, 114, 104), 0.85, "mm", track=8)
        if sh.get("dashed"):
            a = sc(*pos(tA)); b = sc(*CITY["TEL AVIV"]); n = 40
            for k in range(0, n, 2): cv.line([(lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)), (lerp(a[0], b[0], (k + 1) / n), lerp(a[1], b[1], (k + 1) / n))], INK, 4, 0.6)
        if len(pts) > 1:
            cv.line(pts, C("B8400F"), 14); cv.line(pts, ORANGE, 10); cv.line([(x, y - 0.002) for x, y in pts], C("FF9A6A"), 3, 0.9)
        for nm in sh.get("cities", ["DUBÁI", "TEL AVIV", "TABUK"]):
            x, y = sc(*CITY[nm])
            if -0.05 < x < 1.05 and -0.05 < y < 1.05:
                cv.circle(x, y, 10, WHITE, outline=INK, ow=4); tag(cv, x + 0.012, y - 0.040, nm, 24, "monob", a=1, anchor="l")
        if sh.get("mark"):
            lo, la, tx = sh["mark"]; x, y = sc(lo, la); k = ramp(t, wkt(sh, 0, 0.8), wkt(sh, 0, 0.8) + 0.4)
            if k > 0:
                pr = (t * 1.3) % 1; cv.circle(x, y, 12 + 50 * pr, None, 1, outline=RED, ow=4 * (1 - pr) + 0.5); cv.circle(x, y, 10, RED, k)
                tag(cv, x, y + 0.06, tx, 24, "black", bg=RED, a=k, anchor="m")
        if len(pts) > 1:                                                # el avión: flecha naranja con borde y sombra
            (xa, ya), (xb, yb) = pts[max(0, len(pts) - 6)], pts[-1]; ang = math.atan2(yb - ya, xb - xa)
            r_ = 0.034; tri = [(xb + math.cos(ang) * r_ * 1.5 * H / W * 1.6, yb + math.sin(ang) * r_ * 1.5), (xb + math.cos(ang + 2.5) * r_ * H / W * 1.6, yb + math.sin(ang + 2.5) * r_),
                               (xb + math.cos(math.pi + ang) * r_ * 0.35 * H / W * 1.6, yb + math.sin(math.pi + ang) * r_ * 0.35), (xb + math.cos(ang - 2.5) * r_ * H / W * 1.6, yb + math.sin(ang - 2.5) * r_)]
            cv.d.polygon([cv.P(x + 0.006, y + 0.014) for x, y in tri], fill=cv.col((40, 30, 20), 0.35))
            cv.d.polygon([cv.P(*p) for p in tri], fill=cv.col(ORANGE), outline=cv.col(DARK), width=int(cv.px(3)))
        flat = cv.out()
        img = cv2.warpPerspective(flat, PM, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        yy = np.linspace(0, 1, H)[:, None, None]; haze = np.clip(0.30 - yy, 0, 1) / 0.30           # bruma arriba: profundidad de mesa
        img = img * (1 - haze * 0.45) + np.array([0.93, 0.92, 0.90]) * haze * 0.45
        img = tone(img, sh.get("act"), t)
        cv = Cv(base=img, k=1)
        if len(pts) > 1 and sh.get("clock", True):
            cv.rect(0.040, 0.755, 0.330, 0.905, DARK, 0.86, r=6)
            cv.text(hms(prog, False) + " UTC", 0.056, 0.805, 48, "monob", WHITE, 1, "lm")
            cv.text(f"{hms(prog + 3 * 3600, False)} HORA SAUDÍ · {esn(round(alt_at(prog) / 100) * 100)} FT", 0.056, 0.865, 19, "mono", (205, 200, 192), 1, "lm", track=1)
        footer(cv, sh.get("src", "Mapa: Natural Earth (dominio público) · ruta aproximada con los puntos publicados por Flightradar24 / AP"))
        put(grade(cv.out(), t, i))

# ============================================================== CABINA: la maqueta cenital real con fichas de color
TOP = {"cmd": (0.372, 0.600), "fo": (0.372, 0.362), "tali": (0.475, 0.700), "tz": (0.700, 0.420), "hay": (0.820, 0.590), "asaf": (0.820, 0.700),
       "den": (0.930, 0.300), "res1": (0.930, 0.600), "res2": (0.930, 0.700)}
FIG8 = {"cmd": ("COMANDANTE", BLUE), "fo": ("PRIMER OFICIAL", GRAPH), "tali": ("TALI M.", ORANGE), "tz": ("TZVIKA M.", ORANGE), "hay": ("YANIV H.", ORANGE),
        "asaf": ("ASAF R.", ORANGE), "den": ("DENTISTA", ORANGE), "res1": ("PILOTO DE RESERVA", C("6FA8DC")), "res2": ("PILOTO DE RESERVA", C("6FA8DC"))}
DOOR = ((0.418, 0.405), (0.418, 0.560)); AXE = (0.412, 0.665); YOKES = [(0.300, 0.372), (0.300, 0.598)]
def d2p(x, y):
    """unidades de diseño de comp7 (x a lo largo, y a lo ancho, comandante arriba) -> fracción de la placa K_top (nariz a la izquierda, comandante abajo)"""
    xs = [0.0, 0.17, 0.30, 0.46, 0.70, 0.96, 1.2]; ps = [0.10, 0.372, 0.418, 0.560, 0.700, 0.930, 1.05]
    return float(np.interp(x, xs, ps)), float(np.clip(0.48 + 0.857 * (0.5 - y), 0.22, 0.78))
def r_cabina8(sh, sid, DUR, put):
    figs = sh.get("figs", list(TOP)); st = sh.get("steps", [])
    def P0(fid): x, y = TOP[fid]; return [x, y, 0.0, 0.0]
    keys = []; cur = {k: P0(k) for k in figs}; door = 0.0; tt = 0.0
    keys.append((0.0, {k: list(v) for k, v in cur.items()}, door, None, [], None))
    for s in st:
        tt = wkt(sh, s["wk"]) if "wk" in s else s.get("t", tt + 1.0)
        for k, v in s.get("fig", {}).items():
            x, y = d2p(v[0], v[1]); cur[k] = [x, y, -v[2], v[3]]
        door = s.get("door", door)
        keys.append((tt, {k: list(v) for k, v in cur.items()}, door, s.get("hit"), s.get("arrows", []), s.get("hl")))
    def state(t):
        prev = keys[0]
        for k_ in keys[1:]:
            if t < k_[0]: break
            prev = k_
        idx = keys.index(prev); return prev, keys[idx - 1] if idx > 0 else prev, ease(ramp(t, prev[0], prev[0] + sh.get("tr", 0.6)))
    pl = plate("K_top", 1.0)
    zc = sh.get("cam", [[0, 1.0, 0.5, 0.5]])
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; (k1, k0, u) = state(t)
        z0_ = kv([(c[0], c[1]) for c in zc], t); ccx = kv([(c[0], c[2]) for c in zc], t); ccy = kv([(c[0], c[3]) for c in zc], t)
        z = 1 + (z0_ - 1) * 0.6                                          # el cuadro de comp7 -> diseño -> placa
        fx_, fy_ = d2p((ccx - 0.05) / 0.93, (ccy - 0.14) / 0.76)
        fx_ = lerp(0.5, fx_, min(1, (z - 1) * 2.5)); fy_ = lerp(0.5, fy_, min(1, (z - 1) * 2.5))
        Mx = np.float32([[z, 0, W / 2 - fx_ * W * z], [0, z, H / 2 - fy_ * H * z]])
        img = cv2.warpAffine(pl, Mx, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        def Pp(x, y): return 0.5 + (x - fx_) * z, 0.5 + (y - fy_) * z
        pos = {}
        for fid in figs:
            a0 = k0[1].get(fid, P0(fid)); a1 = k1[1].get(fid, P0(fid))
            pos[fid] = [lerp(a0[j], a1[j], u) for j in range(4)]
        img = shadows(img, [("circle", *Pp(p[0], p[1]), 0.024 * z) for p in pos.values()], off=(0.006 * z, 0.012 * z), blur=0.006, a=0.5)
        img = tone(img, sh.get("act"), t)
        cv = Cv(base=img)
        dv = lerp(k0[2], k1[2], u)                                        # la puerta blindada: barra que gira hacia la cocina
        (hx, hy), (ex0, ey0) = DOOR; L_ = ey0 - hy; ang = math.radians(80 * dv)
        ex, ey = hx + math.sin(ang) * L_ * H / W, hy + math.cos(ang) * L_
        cv.line([Pp(hx, hy), Pp(ex, ey)], RED if dv > 0.05 else DARK, 9 * z)
        lx, ly = Pp(hx, hy - 0.03); tag(cv, lx, ly, "PUERTA BLINDADA · " + ("ABIERTA" if dv > 0.5 else "CERRADA"), 18, "monob",
                                        bg=RED if dv > 0.5 else DARK, a=1, anchor="m")
        if k1[5] == "axe" or sh.get("hl") == "axe":
            x, y = Pp(*AXE); pr = (t * 1.2) % 1; cv.circle(x, y, (14 + 30 * pr) * z, None, 1, outline=RED, ow=4 * (1 - pr) + 0.5)
            tag(cv, x - 0.01, y + 0.06, "HACHA DE EMERGENCIA", 18, "monob", bg=RED, anchor="r")
        if k1[5] == "yokes" or sh.get("hl") == "yokes":
            for yk in YOKES: x, y = Pp(*yk); cv.circle(x, y, 30 * z, None, 1, outline=ORANGE, ow=5)
        placed = [((lambda a: (a[0] - 0.13, a[1] - 0.05, a[0] + 0.13, a[1] - 0.01))(Pp(DOOR[0][0], DOOR[0][1])))]
        for fid in figs:                                                 # fichas de arcilla de color: disco con luz y borde + cuerpo
            x, y, rot, ly = pos[fid]; nm, col = FIG8[fid]; X, Y = Pp(x, y); r0 = 0.020 * z
            ca, sa = math.cos(math.radians(rot)), math.sin(math.radians(rot)); bl = (0.012 + 0.045 * ly) * z
            body = [(X + (ca * dx - sa * dy) * H / W, Y + (sa * dx + ca * dy)) for dx, dy in
                    [(-bl - r0 * 0.3, -r0 * 1.1), (r0 * 0.2, -r0 * 1.25), (r0 * 0.2, r0 * 1.25), (-bl - r0 * 0.3, r0 * 1.1)]]
            cv.d.polygon([cv.P(*p) for p in body], fill=cv.col(tuple(int(c * 0.80) for c in col)))
            cv.circle(X, Y, 26 * z, tuple(int(c * 0.72) for c in col)); cv.circle(X - 0.002 * z, Y - 0.004 * z, 22 * z, col)
            cv.circle(X - 0.006 * z, Y - 0.010 * z, 7 * z, tuple(min(255, int(c * 1.25 + 40)) for c in col), 0.8)
            if k1[3] == fid and t - k1[0] < 1.6:
                pr = ((t - k1[0]) * 1.6) % 1; cv.circle(X, Y, (26 + 60 * pr) * z, None, 1, outline=RED, ow=5 * (1 - pr) + 0.5)
            if sh.get("labels", True):                                   # etiquetas sin pisarse: prueba arriba/abajo/más lejos
                tw_ = cv.tw(nm, 17, "monob") + len(nm) * 1.2 * S / W + 0.024
                for dy_ in (-0.062, 0.062, -0.105, 0.105, -0.148, 0.148):
                    ry = Y + dy_ * z; rb = (X - tw_ / 2, ry - 0.022, X + tw_ / 2, ry + 0.022)
                    if not any(rb[0] < q[2] and q[0] < rb[2] and rb[1] < q[3] and q[1] < rb[3] for q in placed): break
                placed.append(rb); tag(cv, X, ry, nm, 17, "monob", bg=tuple(int(c * 0.78) for c in col), anchor="m")
        for fid, ax, ay in k1[4]:
            ax, ay = d2p(ax, ay); p0 = Pp(*pos[fid][:2]); p1 = Pp(ax, ay); k = ramp(t, k1[0], k1[0] + 0.5)
            cv.line([p0, (lerp(p0[0], p1[0], k), lerp(p0[1], p1[1], k))], ORANGE, 6, 0.95)
        ttl = sh.get("title", "Cabina de mando · vista desde arriba")
        tag(cv, 0.040, 0.075, ttl.upper(), 24, "black", a=1, anchor="l")
        footer(cv, sh.get("src", "Posiciones ilustrativas · relato del comandante (Ynet), pasajeros y fiscalía de EAU"))
        put(grade(cv.out(), t, i))

# ============================================================== TIRAS DE PROGRESO DE VUELO (el registro)
def _strip_t(sh, r, j, n, DUR):
    return wkt(sh, r[4], 0.3 + j * (DUR * 0.75 / n)) if len(r) > 4 and r[4] is not None else 0.3 + j * (DUR * 0.75 / n)
def r_tiras8(sh, sid, DUR, put):
    rows = sh["rows"]; n = len(rows)
    pl = plate(sh.get("plate", "P_mesa"), 1.12)
    hh = min(0.17, 0.62 / max(n, 1)); gap = 0.022; tot = n * hh + (n - 1) * gap; y0 = 0.53 - tot / 2
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        img = tone(cam(pl, t, DUR, 1.0, 1.05, dx=-0.02), sh.get("act"), t)
        vis = []
        for j, r in enumerate(rows):
            ti = _strip_t(sh, r, j, n, DUR)
            if t < ti: break
            k = ease(ramp(t, ti, ti + 0.35)); vis.append((j, r, ti, k))
        sh_ = [("rect", 0.07, y0 - 0.03, 0.93, y0 + tot + 0.03, 0.006, 0.9)]
        for j, r, ti, k in vis:
            y = y0 + j * (hh + gap); xo = (1 - k) * 0.9
            sh_.append(("rect", 0.085 + xo, y, 0.915 + xo, y + hh, 0.004))
        img = shadows(img, sh_, off=(0.004, 0.010), blur=0.008, a=0.40)
        cv = Cv(base=img)
        cv.rect(0.07, y0 - 0.03, 0.93, y0 + tot + 0.03, C("3A3833"), 0.92, r=8)            # la bandeja (rack) de las tiras
        for j in range(n): cv.rect(0.078, y0 + j * (hh + gap) - 0.004, 0.922, y0 + j * (hh + gap) + hh + 0.004, C("2A2925"), 0.9, r=4)
        tag(cv, 0.07, y0 - 0.075, sh.get("title", "REGISTRO · 30 SEP 2026 · HORA UTC").upper(), 22, "monob", a=1, anchor="l")
        for j, r, ti, k in vis:
            hora, emi, txt, et = r[0], r[1], r[2], (r[3] if len(r) > 3 else None)
            y = y0 + j * (hh + gap); xo = (1 - k) * 0.9; x0, x1 = 0.085 + xo, 0.915 + xo
            last = j == len(vis) - 1
            cv.rect(x0, y, x1, y + hh, C("F6F0E2") if not last else C("FFF8EA"), 1, r=4)               # tira de papel
            cv.rect(x0, y, x0 + 0.13, y + hh, ORANGE if last else C("E9DDC4"), 1, r=4)                 # bloque de la hora
            for q in range(1, 4): cv.line([(x0 + 0.13 + q * 0.0005, y + 0.01), (x0 + 0.13 + q * 0.0005, y + hh - 0.01)], C("D8CCB4"), 1)
            cv.text(hora, x0 + 0.065, y + hh / 2, 40 if hh > 0.12 else 32, "monob", WHITE if last else INK, 1, "mm")
            cv.text(emi.upper(), x0 + 0.15, y + hh * 0.30, 18, "monob", MUTED, 1, "lm", track=1.5)
            ch = int(len(txt) * min(1, max(0, t - ti - 0.2) / max(0.4, len(txt) / 40)))
            cv.text(txt[:ch] + ("▍" if ch < len(txt) and (i // 6) % 2 == 0 else ""), x0 + 0.15, y + hh * 0.64, 36 if hh > 0.12 else 30, "semi", INK, 1, "lm")
            if et and ch >= len(txt): stamp(cv, x1 - 0.105, y + hh / 2, et, ti + 0.2 + len(txt) / 40, t, 22 if hh > 0.12 else 18, -7)
        footer(cv, sh.get("src", "Fuentes: Flightradar24 · Al Jazeera · Anadolu · fiscalía de EAU"))
        put(grade(cv.out(), t, i))

# ============================================================== TRANSPONDEDOR físico
def r_squawk8(sh, sid, DUR, put):
    mode = sh.get("mode", "panel"); pl = plate("P_ped", 1.15)
    if mode == "tabla":
        rows = [[c, "", txt, None, wi] for c, txt, wi in sh["rows"]]
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        img = cam(pl, t, DUR, 1.02, 1.08, dx=0.02) * 0.55                 # el pedestal real, en penumbra: la pieza manda
        img = tone(img, sh.get("act"), t)
        if mode == "tabla":
            n = len(rows); hh = 0.17; gap = 0.03; y0 = 0.53 - (n * hh + (n - 1) * gap) / 2
            vis = [(j, r, wkt(sh, r[4], 0.3 + j), ease(ramp(t, wkt(sh, r[4], 0.3 + j), wkt(sh, r[4], 0.3 + j) + 0.35))) for j, r in enumerate(rows) if t >= wkt(sh, r[4], 0.3 + j)]
            img = shadows(img, [("rect", 0.14, y0 + j * (hh + gap) + (1 - k) * 0.05, 0.86, y0 + j * (hh + gap) + hh + (1 - k) * 0.05, 0.006) for j, r, ti, k in vis], a=0.6)
            cv = Cv(base=img); tag(cv, 0.14, y0 - 0.06, "TRANSPONDEDOR · LOS TRES CÓDIGOS QUE TODO CONTROLADOR CONOCE", 22, "monob", anchor="l")
            for j, r, ti, k in vis:
                code, txt = r[0], r[2]; y = y0 + j * (hh + gap) + (1 - k) * 0.05
                col = RED if code == "7500" else (ORANGE if code == "7700" else INK)
                cv.rect(0.14, y, 0.86, y + hh, C("F6F0E2"), k, r=6); cv.rect(0.14, y, 0.42, y + hh, (20, 18, 16), k, r=6)
                for d_, ch in enumerate(code): seven(cv, ch, 0.165 + d_ * 0.062, y + 0.03, 0.044, hh - 0.06, (255, 168, 60), k, off=(52, 40, 26))
                cv.text(txt, 0.45, y + hh / 2, 40, "black", col if code != "7600" else INK, k, "lm")
        else:
            seq = sh["seq"]; cur = seq[0]; tcur = 0.0
            for j_, s_ in enumerate(seq):
                ti = 0.0 if j_ == 0 else (wkt(sh, s_[3]) if isinstance(s_[3], int) and sh.get("wk") else (s_[3] if isinstance(s_[3], (int, float)) else 0))
                if t >= ti: cur = s_; tcur = ti
            code, lab, colk = cur[0], cur[1], cur[2]; col = {"red": RED, "orange": ORANGE, "ink": INK}[colk]
            X0, Y0, X1, Y1 = 0.20, 0.20, 0.80, 0.62
            img = shadows(img, [("rect", X0, Y0, X1, Y1, 0.012)], off=(0.012, 0.03), blur=0.02, a=0.7)
            cv = Cv(base=img)
            cv.rect(X0, Y0, X1, Y1, (58, 59, 63), 1, r=22); cv.rect(X0 + 0.006, Y0 + 0.008, X1 - 0.006, Y0 + 0.03, (90, 91, 96), 0.7, r=14)   # bisel de luz
            for sx, sy in ((X0 + 0.02, Y0 + 0.04), (X1 - 0.02, Y0 + 0.04), (X0 + 0.02, Y1 - 0.04), (X1 - 0.02, Y1 - 0.04)):
                cv.circle(sx, sy, 7, (35, 35, 38)); cv.line([(sx - 0.004, sy), (sx + 0.004, sy)], (110, 110, 115), 2)
            cv.rect(X0 + 0.05, Y0 + 0.07, X1 - 0.05, Y0 + 0.28, (14, 12, 10), 1, r=10)
            fl = 1.0 if t - tcur > 0.5 or (i // 3) % 2 == 0 else 0.35
            glow = Image.new("RGB", (cv.w, cv.h), (0, 0, 0)); gcv = Cv(base=None, bg=(0, 0, 0)); gcv.im = glow; gcv.d = ImageDraw.Draw(glow, "RGBA")
            for d_, ch in enumerate(code):
                seven(cv, ch, X0 + 0.085 + d_ * 0.110, Y0 + 0.095, 0.080, 0.16, (255, 172, 64), fl, off=(48, 36, 24))
                seven(gcv, ch, X0 + 0.085 + d_ * 0.110, Y0 + 0.095, 0.080, 0.16, (255, 140, 40), fl, off=(0, 0, 0))
            kidx = sum(1 for j_, s_ in enumerate(seq) if j_ > 0 and t >= (wkt(sh, s_[3]) if isinstance(s_[3], int) and sh.get("wk") else (s_[3] if isinstance(s_[3], (int, float)) else 0)))
            for q, kx in enumerate((0.30, 0.43, 0.57, 0.70)):               # perillas que giran al cambiar el código
                ang = math.radians(-60 + 40 * kidx * (q + 1) + 90 * ease(ramp(t, tcur, tcur + 0.4)) * (q % 2))
                cv.circle(kx, Y1 - 0.075, 34, (32, 32, 35)); cv.circle(kx, Y1 - 0.078, 28, (78, 79, 84))
                cv.line([(kx, Y1 - 0.078), (kx + math.cos(ang) * 0.012, Y1 - 0.078 + math.sin(ang) * 0.021)], (230, 230, 230), 4)
            im = np.asarray(cv.im).astype(np.float32) / 255
            gl = cv2.GaussianBlur(np.asarray(glow).astype(np.float32) / 255, (0, 0), 18 * cv.k)
            cv.im = Image.fromarray((np.clip(im + gl * 0.9, 0, 1) * 255).astype(np.uint8)); cv.d = ImageDraw.Draw(cv.im, "RGBA")
            tag(cv, 0.5, Y0 - 0.055, "TRANSPONDEDOR · VUELO FZ1073", 22, "monob", anchor="m")
            if lab:
                k = ease(ramp(t, tcur, tcur + 0.3)); sc = 1 + 0.3 * (1 - k)
                w_ = cv.tw(lab, 48 * sc, "black") + 0.05
                cv.rect(0.5 - w_ / 2, 0.68, 0.5 + w_ / 2, 0.78, col, k, r=8); cv.text(lab, 0.5, 0.73, 48 * sc, "black", WHITE, k, "mm")
            if len(cur) > 4: cv.text(cur[4].upper(), 0.5, 0.83, 22, "monob", WHITE, ramp(t, tcur + 0.2, tcur + 0.6), "mm", track=2)
        footer(cv, sh.get("src", "Códigos: OACI · horas: Flightradar24 / Al Jazeera / Anadolu (no coinciden)"))
        put(grade(cv.out(), t, i))

# ============================================================== CITA sobre la escena
def r_cita8(sh, sid, DUR, put):
    q, who, src, et = sh["q"], sh.get("who", ""), sh.get("src", ""), sh.get("et")
    pl = plate(sh.get("bg", "P_mesa"), 1.12); dark = sh.get("bg") is not None
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        img = cam(pl, t, DUR, 1.02, 1.10)
        img = tone(img, sh.get("act"), t)
        if dark: img = img * 0.30 + np.array([0.02, 0.02, 0.025])
        cv = Cv(base=img); fg = WHITE if dark else INK; mut = (210, 205, 196) if dark else MUTED
        big = sh.get("big")
        size = 78 if big else 54
        lines = cv.wrap(("«" + q + "»") if big else q, size, "bold" if big else "semi", 0.80 if big else 0.72)
        lh = size * S / H * 1.22; y = 0.48 - len(lines) * lh / 2
        x = 0.5 if big else 0.14
        if not big: cv.text("“", 0.135, y - 0.07, 150, "black", ORANGE, ramp(t, 0.1, 0.4), "lm")
        nw = sum(len(l.split()) for l in lines); wi = 0
        for j, l in enumerate(lines):                                    # palabra por palabra
            ws = l.split(); acc = ""
            for w in ws:
                kk = ramp(t, 0.15 + wi * 0.07, 0.40 + wi * 0.07); wi += 1
                if kk > 0:
                    px = (x - cv.tw(l, size, "bold" if big else "semi") / 2 if big else x) + cv.tw(acc, size, "bold" if big else "semi")
                    cv.text(w, px, y + j * lh + (1 - ease(kk)) * 0.02, size, "bold" if big else "semi", fg, kk, "lm")
                acc += w + " "
        ka = ramp(t, 0.3 + nw * 0.07, 0.7 + nw * 0.07); ya = y + len(lines) * lh + 0.03
        if who: cv.text(who.upper(), x, ya, 24, "bold", fg, ka, "mm" if big else "lm")
        if src: cv.text(src.upper(), x, ya + 0.045, 18, "mono", mut, ka, "mm" if big else "lm", track=1)
        if et: stamp(cv, 0.84 if not big else 0.5, 0.80 if not big else min(0.90, ya + 0.12), et, 0.45 + nw * 0.07, t, 30, -6)
        footer(cv, sh.get("footer", ""), dark=dark)
        put(grade(cv.out(), t, i))

# ============================================================== LISTA: fichas sobre la mesa
def r_lista8(sh, sid, DUR, put):
    it = sh["items"]; n = len(it); pl = plate("P_mesa", 1.12)
    hh = min(0.16, 0.64 / n); gap = 0.02; tot = n * hh + (n - 1) * gap; y0 = 0.54 - tot / 2
    rng = np.random.default_rng(len(sid)); rots = rng.uniform(-0.006, 0.006, n)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        img = tone(cam(pl, t, DUR, 1.0, 1.05, dx=0.02), sh.get("act"), t)
        vis = []; prev = -1.0
        for j, r in enumerate(it):
            ti = wkt(sh, r[3], None) if len(r) > 3 and r[3] is not None else None
            ti = max(prev + 0.8, 0.3) if ti is None else ti; prev = ti      # sin marca: entra DESPUÉS de la anterior (nunca antes)
            k = ramp(t, ti, ti + 0.35)
            if k > 0: vis.append((j, r, ti, ease(k)))
        img = shadows(img, [("rect", 0.12, y0 + j * (hh + gap) + (1 - k) * 0.06, 0.88, y0 + j * (hh + gap) + hh + (1 - k) * 0.06, 0.006, k) for j, r, ti, k in vis],
                      off=(0.006, 0.016), blur=0.010, a=0.45)
        cv = Cv(base=img)
        tag(cv, 0.12, y0 - 0.07, sh.get("title", "").upper(), 24, "black", a=ramp(t, 0.1, 0.4), anchor="l")
        for j, r, ti, k in vis:
            yy = y0 + j * (hh + gap) + (1 - k) * 0.06; dark = sh.get("dark_last") and j == n - 1
            cv.rect(0.12, yy, 0.88, yy + hh, (26, 26, 29) if dark else C("FBF8F1"), k, r=6)
            cv.rect(0.12, yy, 0.128, yy + hh, ORANGE, k, r=2)
            xt = 0.15
            if sh.get("numbered"): cv.text(str(j + 1), 0.165, yy + hh / 2, 64, "black", ORANGE, k, "mm"); xt = 0.21
            cv.text(r[0].upper(), xt, yy + hh * 0.28, 18, "monob", ORANGE if not dark else (255, 160, 110), k, "lm", track=1.5)
            cv.text(r[1], xt, yy + hh * 0.64, 40 if hh > 0.13 else 34, "bold", INK if not dark else WHITE, k, "lm")
            if len(r) > 2 and r[2]: stamp(cv, 0.80, yy + hh / 2, r[2], ti + 0.25, t, 20, -6)
        footer(cv, sh.get("src", ""))
        put(grade(cv.out(), t, i))

# ============================================================== NÚMERO: cifra de arcilla parada sobre la mesa
def extruded(cv, txt, x, y, size, col=WHITE, depth=16, a=1.0, f="black"):
    for d in range(depth, 0, -1):                                        # el canto de la letra recortada (más oscuro hacia atrás)
        sh_ = 0.62 + 0.25 * (1 - d / depth); cv.text(txt, x + d * 0.0009, y + d * 0.0016, size, f, tuple(int(c * sh_) for c in col), a, "mm")
    cv.text(txt, x, y, size, f, col, a, "mm")
def r_numero8(sh, sid, DUR, put):
    pl = plate("P_mesa", 1.12)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; k = ramp(t, 0.1, 0.5)
        img = tone(cam(pl, t, DUR, 1.0, 1.06, dy=0.02), sh.get("act"), t)
        n = sh["n"]
        if sh.get("count") and n.isdigit(): n = str(int(int(n) * ease(ramp(t, 0.1, 1.2))))
        alt = sh.get("alt"); ta = wkt(sh, alt[2]) if alt else None; ka = ramp(t, ta, ta + 0.4) if alt else 0
        x = 0.5 - 0.22 * ease(ka)
        cvs = Cv(base=img, k=1); fo = F("black", 230, 1); tw = cvs.d.textlength(n, font=fo) / W
        img = shadows(img, [("rect", x - tw / 2, 0.38, x + tw / 2, 0.58, 0.02, k)], off=(0.03, 0.05), blur=0.03, a=0.55)
        if alt and ka > 0:
            tw2 = cvs.d.textlength(alt[0], font=fo) / W; img = shadows(img, [("rect", 0.72 - tw2 / 2, 0.38, 0.72 + tw2 / 2, 0.58, 0.02, ka)], off=(0.03, 0.05), blur=0.03, a=0.55)
        cv = Cv(base=img)
        extruded(cv, n, x, 0.46 - (1 - ease(k)) * 0.04, 230, C("F4F1EA"), 18, k)
        cv.text(sh.get("sub", "").upper(), x, 0.68, 24, "monob", INK, k, "mm", track=1.5)
        if alt and ka > 0:
            extruded(cv, alt[0], 0.72, 0.46 - (1 - ease(ka)) * 0.04, 230, C("F4F1EA"), 18, ka)
            cv.text(alt[1].upper(), 0.72, 0.68, 24, "monob", INK, ka, "mm", track=1.5)
            stamp(cv, 0.5, 0.82, "EN DISPUTA", ta + 0.3, t, 34, -5)
        footer(cv, sh.get("src", ""))
        put(grade(cv.out(), t, i))

# ============================================================== MONTAÑA RUSA sobre el cielo
def r_montana8(sh, sid, DUR, put):
    mode = sh.get("mode", "carro"); pl = plate("P_sky", 1.15)
    xs = np.linspace(0.06, 0.94, 300)
    if mode == "carro": ys = 0.32 + 0.38 * (1 / (1 + np.exp(-(xs - 0.45) * 14))) - 0.06 * np.exp(-((xs - 0.2) / 0.08) ** 2)
    else: ys = np.array([0.30 + (0.0 if x < 0.30 else (0.40 * ease(min(1, (x - 0.30) / 0.22))) - (0.08 * ease(max(0, min(1, (x - 0.55) / 0.12))) if x > 0.55 else 0) + (0.10 * ease(max(0, min(1, (x - 0.70) / 0.12))) if x > 0.70 else 0)) for x in xs])
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; u = ease(ramp(t, 0.4, DUR * 0.85)); j = int(u * 299)
        img = tone(cam(pl, t, DUR, 1.0, 1.05), sh.get("act"), t)
        img = shadows(img, [("line", list(zip(xs, ys)), 0.008)], off=(0.01, 0.05), blur=0.012, a=0.35)
        cv = Cv(base=img)
        if mode == "carro":
            for x in np.linspace(0.08, 0.92, 22):
                y = float(np.interp(x, xs, ys)); cv.line([(x, y + 0.01), (x, 1.0)], (235, 230, 222), 5, 0.95)
            cv.line(list(zip(xs, ys)), C("CFC8BA"), 16); cv.line(list(zip(xs, ys)), WHITE, 11)
        else:
            cv.line(list(zip(xs, ys)), C("B8400F"), 13); cv.line(list(zip(xs, ys)), ORANGE, 9)
        j2 = max(1, j); ang = math.atan2((ys[j2] - ys[j2 - 1]) * H, (xs[j2] - xs[j2 - 1]) * W); x, y = xs[j], ys[j]
        slope = max(0.0, min(1.0, math.sin(ang) * 3.2)); g = 1.0 - slope
        ca, sa = math.cos(ang), math.sin(ang)
        def R(px_, py_): return (x + (ca * px_ - sa * py_) * H / W, y + (sa * px_ + ca * py_))
        if mode == "carro":
            cart = [R(-0.09, -0.035), R(0.09, -0.035), R(0.08, 0.02), R(-0.08, 0.02)]
            cv.d.polygon([cv.P(*p) for p in cart], fill=cv.col(ORANGE), outline=cv.col(C("B8400F")), width=int(cv.px(3)))
            lift = (1 - g) * 0.07
            hx, hy = R(0.0, -0.11 - lift); cv.line([R(0.0, -0.035 - lift), (hx, hy)], C("E6DFD2"), 34); cv.circle(hx, hy - 0.022, 30, C("F2ECE1"), outline=C("BDB5A7"), ow=3)
        else:
            tag(cv, 0.06, 0.20, "PICADA DEL VUELO 1073 · FORMA ILUSTRATIVA", 20, "monob", anchor="l")
            body = [R(-0.07, -0.01), R(0.065, -0.01), R(0.085, 0), R(0.065, 0.01), R(-0.07, 0.01)]
            cv.d.polygon([cv.P(*p) for p in body], fill=cv.col(WHITE), outline=cv.col(INK), width=int(cv.px(3)))
            cv.d.polygon([cv.P(*p) for p in [R(-0.012, -0.01), R(0.025, -0.01), R(-0.025, -0.06)]], fill=cv.col(WHITE), outline=cv.col(INK), width=int(cv.px(3)))
        cv.rect(0.68, 0.06, 0.96, 0.33, DARK, 0.88, r=8)
        cv.text("LO QUE SIENTE EL PASAJERO", 0.82, 0.10, 17, "monob", (205, 200, 192), 1, "mm", track=1.5)
        if mode == "carro":
            cv.text(f"{g:.1f} g".replace(".", ","), 0.82, 0.19, 96, "black", RED if g < 0.15 else WHITE, 1, "mm")
            st = "PESO NORMAL" if g > 0.85 else ("MÁS LIVIANO" if g > 0.15 else "FLOTA")
            cv.text(st, 0.82, 0.285, 24, "monob", RED if g < 0.15 else ORANGE, 1, "mm", track=3)
        else:
            cv.text("¿ ? g", 0.82, 0.19, 96, "black", WHITE, 1, "mm"); cv.text("DATO NO PUBLICADO", 0.82, 0.285, 22, "monob", RED, 1, "mm", track=3)
        footer(cv, sh.get("src", "Ilustración · las fuerzas reales del vuelo están en el registrador de datos, todavía sin publicar"))
        put(grade(cv.out(), t, i))

# ============================================================== LAS DOS CAJAS (foto real de la maqueta) con llamadas
def r_cajas8(sh, sid, DUR, put):
    pl = plate("P_cajas", 1.12)
    CALL = [("FDR", "REGISTRADOR DE DATOS", "cientos de parámetros por segundo", (0.27, 0.52), (0.05, 0.80), 0),
            ("CVR", "REGISTRADOR DE VOZ", "últimas 25 h de audio de la cabina", (0.62, 0.30), (0.56, 0.06), 1)]
    for i in range(int(round(DUR * FPS))):
        t = i / FPS
        img = tone(cam(pl, t, DUR, 1.0, 1.07, dx=-0.02), sh.get("act"), t)
        vis = [(c, ease(ramp(t, wkt(sh, c[5], 0.3 + c[5]), wkt(sh, c[5], 0.3 + c[5]) + 0.4))) for c in CALL]
        img = shadows(img, [("rect", c[4][0], c[4][1], c[4][0] + 0.39, c[4][1] + 0.15, 0.006, k) for c, k in vis if k > 0], a=0.5)
        cv = Cv(base=img)
        for (nm, l1, l2, (ax, ay), (bx, by), wi), k in vis:
            if k <= 0: continue
            cv.circle(ax, ay, 14, WHITE, k, outline=INK, ow=4)
            ex, ey = (bx + 0.10, by + (0.15 if by < ay else 0.0))
            cv.line([(ax, ay), (lerp(ax, ex, k), lerp(ay, ey, k))], WHITE, 4, k)
            cv.rect(bx, by, bx + 0.39, by + 0.15, DARK, 0.92 * k, r=8)
            cv.text(nm, bx + 0.02, by + 0.05, 46, "black", ORANGE, k, "lm"); cv.text(l1, bx + 0.11, by + 0.05, 20, "monob", WHITE, k, "lm", track=1.5)
            cv.text(l2, bx + 0.02, by + 0.112, 26, "semi", (225, 220, 210), k, "lm")
        tag(cv, 0.96, 0.95, sh.get("title", "LAS «CAJAS NEGRAS» SON NARANJAS: PARA ENCONTRARLAS"), 20, "monob", anchor="r")
        put(grade(cv.out(), t, i))

# ============================================================== CAPÍTULO sobre su escena
def r_capitulo8(sh, sid, DUR, put):
    num, title = sh["num"], sh["title"]; pl = plate(sh.get("bg", "K_side"), 1.12)
    trf, TR = f"{M}/clips/{sid}_tr.mp4", 1.5                            # transición SIN CORTE a la escena (agnes 2.5 keyframe: este cuadro -> el primero del plano siguiente)
    TRF = None
    if os.path.exists(trf):
        import subprocess
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", trf, "-vf", f"scale={W}:{H}:flags=lanczos", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
        TRF = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; u = ease(ramp(t, 0.1, DUR * 0.8))
        if TRF is not None and t >= DUR - TR:
            q = min(len(TRF) - 1, int((t - (DUR - TR)) / TR * (len(TRF) - 1) + 0.5)); put(TRF[q].astype(np.float32) / 255); continue
        img = cam(pl, t, DUR, 1.04, 1.12)
        img = tone(img, sh.get("act"), t) * 0.38 + np.array([0.015, 0.015, 0.02])
        cv = Cv(base=img)
        k = ease(ramp(t, 0.2, 0.8))
        cv.text(f"{num:02d}" if isinstance(num, int) else str(num), 0.93, 0.50, 420, "black", (255, 255, 255), 0.07 * k, "rm")
        pts = [(0.08 + 0.84 * q / 200, 0.70 - 0.04 * math.sin(q / 200 * 3.2) - (0.10 if q / 200 > 0.62 else 0) * ease(min(1, (q / 200 - 0.62) / 0.04))) for q in range(201)]
        nn = int(200 * u) + 1; cv.line(pts[:nn], ORANGE, 5, 0.95)
        if nn > 1: cv.circle(*pts[nn - 1], 10, ORANGE)
        cv.text(f"CAPÍTULO {num:02d}" if isinstance(num, int) else str(num), 0.08, 0.36, 26, "monob", ORANGE, k, "lm", track=6)
        cv.text(title.upper(), 0.08 - (1 - k) * 0.03, 0.47, 104, "black", WHITE, k, "lm")
        if sh.get("sub"): cv.text(sh["sub"].upper(), 0.08, 0.80, 22, "monob", (215, 210, 200), ramp(t, 0.6, 1.1), "lm", track=2)
        put(grade(cv.out(), t, i))

# ============================================================== ARCHIVO como copia en papel sobre la mesa
def r_foto8(sh, sid, DUR, put):
    pl = plate("P_mesa", 1.12); ph = Image.open(f"{M}/img/{sh['src']}.png").convert("RGB")
    rot = sh.get("rot", -1.6); maxw, maxh = 0.66, 0.70
    fw = maxw; fh = fw * (ph.height / ph.width) * W / H
    if fh > maxh: fh = maxh; fw = fh * (ph.width / ph.height) * H / W
    pw_, phh = int(fw * W * 1.15), int(fh * H * 1.15)
    photo = ph.resize((pw_, phh), Image.LANCZOS); bd = int(18 * S * 1.15)
    card = Image.new("RGB", (pw_ + 2 * bd, phh + 2 * bd), (248, 246, 241)); card.paste(photo, (bd, bd))
    card = card.rotate(rot, resample=Image.BICUBIC, expand=True, fillcolor=(0, 0, 0)); mask = Image.new("L", (pw_ + 2 * bd, phh + 2 * bd), 255).rotate(rot, expand=True)
    cw, ch = card.size
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; u = ease(t / DUR)
        tbl = tone(cam(pl, t, DUR, 1.0, 1.04), sh.get("act"), t)
        z = 1.0 / 1.15 * (1.0 + 0.06 * u)                                 # la cámara se acerca a la foto
        cw2, ch2 = int(cw * z), int(ch * z); x0 = (W - cw2) // 2 + int((0.5 - u) * 30 * S); y0 = (H - ch2) // 2 - int(10 * S)
        img = shadows(tbl, [("rect", x0 / W, y0 / H, (x0 + cw2) / W, (y0 + ch2) / H, 0.002)], off=(0.008, 0.02), blur=0.012, a=0.55)
        im = Image.fromarray((img * 255).astype(np.uint8)); c2 = card.resize((cw2, ch2), Image.LANCZOS); m2 = mask.resize((cw2, ch2), Image.LANCZOS)
        im.paste(c2, (x0, y0), m2)
        put(grade(np.asarray(im).astype(np.float32) / 255, t, i))

# ============================================================== IMAGEN FIJA retocada (sin agnes: agnes "repararía" el daño) con empuje y marca
def r_still8(sh, sid, DUR, put):
    pl = plate(sh["src"], 1.12); ph, pw = pl.shape[:2]
    for i in range(int(round(DUR * FPS))):
        t = i / FPS; u = ease(min(1, t / DUR)); z = lerp(1.0, 1.08, u)
        cx, cy = sh.get("focus", (0.5, 0.5)); ox = cx * pw; oy = cy * ph
        ox = lerp(0.5 * pw, ox, 0.35 + 0.65 * u); oy = lerp(0.5 * ph, oy, 0.35 + 0.65 * u)
        Mx = np.float32([[z, 0, W / 2 - ox * z], [0, z, H / 2 - oy * z]])
        img = tone(cv2.warpAffine(pl, Mx, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT), sh.get("act"), t)
        cv = Cv(base=img)
        if sh.get("dash"):                                               # la forma ORIGINAL que falta (como el molde: contorno punteado)
            k = ramp(t, sh.get("dash_t", 0.6), sh.get("dash_t", 0.6) + 0.5)
            if k > 0:
                P_ = [((x * pw * z + Mx[0, 2]) / W, (y * ph * z + Mx[1, 2]) / H) for x, y in sh["dash"]]
                for (xa, ya), (xb, yb) in zip(P_, P_[1:]):
                    n = 18
                    for q in range(0, n, 2): cv.line([(lerp(xa, xb, q / n), lerp(ya, yb, q / n)), (lerp(xa, xb, (q + 1) / n), lerp(ya, yb, (q + 1) / n))], RED, 5, k)
                mx, my = max(P_, key=lambda p: p[0])
                tag(cv, min(mx + 0.03, 0.70), my + 0.06, sh.get("dash_lbl", "FORMA ORIGINAL"), 22, "monob", bg=RED, a=k, anchor="l")
        put(grade(cv.out(), t, i))

R8 = {"still": r_still8, "perfil": r_perfil8, "mapa": r_mapa8, "cabina": r_cabina8, "registro": r_tiras8, "squawk": r_squawk8, "cita": r_cita8, "lista": r_lista8,
      "numero": r_numero8, "montana": r_montana8, "cajas": r_cajas8, "capitulo7": r_capitulo8, "foto": r_foto8}
