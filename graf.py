# graf.py — gráficos animados por código para tgpildora (llamado desde plano.py)
import math, subprocess, os, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
import cine
from cine import W, H, S, load, xform, blur, over, film, ease, ramp, fbm
M = os.environ.get("TGP_M", os.getcwd()); FPS = 24
FP, FSC, FAN = f"{M}/fonts/Playfair.ttf", f"{M}/fonts/CormorantSC.ttf", f"{M}/fonts/Anton-Regular.ttf"
FHAND = f"{M}/fonts/Caveat.ttf"

def font(p, size): return ImageFont.truetype(p, max(8, int(size * S)))
def txt(img, s, f, size, xy, color=(255, 255, 255), a=1.0, anchor="mm", shadow=0.7):
    if a <= 0.01 or not s: return img
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im); F = font(f, size)
    if shadow: d.text((xy[0] + 3 * S, xy[1] + 4 * S), s, font=F, fill=(0, 0, 0, int(200 * a * shadow)), anchor=anchor)
    d.text(xy, s, font=F, fill=(*color, int(255 * a)), anchor=anchor)
    L = np.asarray(im).astype(np.float32) / 255
    return over(img, L)
def cut(path):
    c = path.replace(".png", "_cut.png")
    if not os.path.exists(c):
        from rembg import remove, new_session
        remove(Image.open(path).convert("RGB"), session=new_session("isnet-general-use"), post_process_mask=True).save(c)
    return np.asarray(Image.open(c).convert("RGBA")).astype(np.float32) / 255

def chalk_mask(h, w, seed=3):
    n = fbm(w // 4, h // 4, seed, octaves=4, base=40); n = cv2.resize(n, (w, h))
    return np.clip((n - 0.25) * 2.2, 0.25, 1)

def steroid(cx, cy, r):
    """esqueleto de 4 anillos (A,B,C hexágonos + D pentágono): lista de segmentos en orden de dibujo"""
    def hexa(x, y): return [(x + r * math.cos(math.radians(30 + 60 * k)), y + r * math.sin(math.radians(30 + 60 * k))) for k in range(6)]
    dx = r * math.sqrt(3)
    A = hexa(cx, cy); B = hexa(cx + dx, cy - 0 * r); C = hexa(cx + dx * 1.5, cy - 1.5 * r)
    # D: pentágono pegado al lado derecho de C
    c0, c1 = C[0], C[5]
    ang = math.atan2(c1[1] - c0[1], c1[0] - c0[0]); L = r
    p2 = (c1[0] + L * math.cos(ang - math.radians(72)), c1[1] + L * math.sin(ang - math.radians(72)))
    p3 = (p2[0] + L * math.cos(ang - math.radians(144)), p2[1] + L * math.sin(ang - math.radians(144)))
    p4 = (c0[0] + L * math.cos(ang - math.radians(108)), c0[1] + L * math.sin(ang - math.radians(108)))
    segs = []
    for ring in (A, B, C): segs += [(ring[k], ring[(k + 1) % 6]) for k in range(6)]
    segs += [(c1, p2), (p2, p3), (p3, p4), (p4, c0)]
    return segs, p3

def draw_segs(segs, prog, w=5, extra=()):
    lay = np.zeros((H, W), np.float32); n = len(segs); tot = prog * n
    for k, (a, b) in enumerate(list(segs) + list(extra)):
        f = min(1, max(0, tot - k))
        if f <= 0: break
        e = (a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f)
        cv2.line(lay, (int(a[0] * 4), int(a[1] * 4)), (int(e[0] * 4), int(e[1] * 4)), 1.0, max(1, int(w * S)), cv2.LINE_AA, shift=2)
    return lay

def render(sh, DUR, OUT, PREV=False):
    spec = sh["spec"]; N = max(1, int(round(DUR * FPS)))
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                          "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-pix_fmt", "yuv420p", OUT], stdin=subprocess.PIPE)
    put = lambda im: p.stdin.write((np.clip(im, 0, 1) * 255).astype(np.uint8).tobytes())
    rng = np.random.default_rng(5)
    if spec == "sello":
        bg = load(f"{M}/img/x_cuaderno.png", size=(int(W * 1.06), int(H * 1.06)))
        for i in range(N):
            t = i / FPS; u = ease(t / DUR); T = 0.45
            im = xform(bg, 1.0 + 0.03 * u)
            k = min(1, t / T); sc = 1.9 - 0.9 * (1 - (1 - k) ** 3); al = min(1, t / 0.2)
            cx, cy, R = W * 0.5, H * 0.55, 165 * S * sc
            sh_ = np.zeros((H, W), np.float32); cv2.circle(sh_, (int(cx + 10 * S * sc), int(cy + 14 * S * sc)), int(R * 1.02), 1, -1, cv2.LINE_AA)
            im = im * (1 - cv2.GaussianBlur(sh_, (0, 0), 14 * S * sc)[..., None] * 0.55 * al)
            seal = np.zeros((H, W), np.float32)
            pts = [(cx + R * (1 + 0.06 * math.sin(a * 7) + 0.03 * math.sin(a * 13)) * math.cos(a), cy + R * (1 + 0.06 * math.sin(a * 7) + 0.03 * math.sin(a * 13)) * math.sin(a)) for a in np.linspace(0, 2 * math.pi, 90)]
            cv2.fillPoly(seal, [np.int32(pts)], 1.0, cv2.LINE_AA)
            yy, xx = np.mgrid[0:H, 0:W]; g = np.clip(1 - np.hypot(xx - cx + R * 0.3, yy - cy + R * 0.3) / (R * 2.2), 0, 1)
            col = np.dstack([0.55 + 0.35 * g, 0.06 + 0.08 * g, 0.06 + 0.06 * g])
            im = im * (1 - seal[..., None] * al) + col * seal[..., None] * al
            ring = np.zeros((H, W), np.float32); cv2.circle(ring, (int(cx), int(cy)), int(R * 0.72), 1, max(1, int(5 * S * sc)), cv2.LINE_AA)
            im = im * (1 - ring[..., None] * 0.35 * al)
            im = txt(im, sh.get("year", "1951"), FSC, 120 * sc, (cx, cy), color=(120, 18, 18), a=al, shadow=0)
            im = txt(im, sh.get("year", "1951"), FSC, 120 * sc, (cx - 2 * S, cy - 2 * S), color=(235, 120, 110), a=al * 0.35, shadow=0)
            if t > T:
                q = math.exp(-(t - T) * 16); im = cv2.warpAffine(im, np.float32([[1, 0, 0], [0, 1, q * 10 * S]]), (W, H), borderMode=cv2.BORDER_REFLECT)
            im = txt(im, "EL TALLADOR DE GENIOS", FSC, 78, (W / 2, H * 0.15), a=ramp(t, T + 0.15, T + 0.8))
            put(film(im, t, i, "warm", halation=0.2))
    elif spec == "zapatitos":
        bg = load(f"{M}/img/o04_calendario_bg.png", size=(int(W * 1.05), int(H * 1.05)))
        Z = [cut(f"{M}/img/x_zapato{k}.png") for k in (1, 2, 3)]
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = blur(xform(bg, 1.02 + 0.02 * u), 9) * 0.75
            table = np.zeros((H, W), np.float32); table[int(H * 0.72):] = 1
            im = im * (1 - table[..., None] * 0.6) + table[..., None] * np.array([0.22, 0.13, 0.07])
            for k, z in enumerate(Z):
                tk = DUR * (0.12 + 0.26 * k); a = ramp(t, tk, tk + 0.25)
                if a <= 0: continue
                sc = 0.50 * (0.92 + 0.08 * a); L = xform(z, sc, dx=(-520 + 520 * k), dy=150)
                L[..., 3] *= a; im = over(im, L)
            put(film(im, t, i, "warm", halation=0.2))
    elif spec == "siete":
        bg = load(f"{M}/img/x_siete.png", size=(int(W * 1.08), int(H * 1.08)))
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = xform(bg, 1.0 + 0.05 * u, dy=-30)
            n = min(7, int(1 + 6 * ramp(t, 0.3, DUR * 0.55)))
            im = im * (1 - 0.35 * ramp(t, 0.2, 0.8))
            im = txt(im, str(n), FAN, 300, (W * 0.5, H * 0.30), color=(250, 245, 235), a=ramp(t, 0.2, 0.5))
            im = txt(im, "HIJOS POR MUJER · MÉXICO, 1960", FSC, 44, (W * 0.5, H * 0.50), a=ramp(t, DUR * 0.55, DUR * 0.7))
            im = txt(im, "Banco Mundial / CONAPO", FSC, 26, (W * 0.5, H * 0.56), color=(220, 210, 190), a=0.8 * ramp(t, DUR * 0.6, DUR * 0.75))
            put(film(im, t, i, "warm", halation=0.2))
    elif spec == "lupa":
        bg = load(f"{M}/img/o05_ampollas_fg.png", size=(W, H))
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = xform(bg, 1.05 + 0.03 * u)
            cx, cy, R = W * (0.30 + 0.40 * u), H * (0.52 + 0.04 * math.sin(u * 3)), 190 * S
            zoom = cv2.warpAffine(im, cv2.getRotationMatrix2D((cx, cy), 0, 1.9), (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
            m = np.zeros((H, W), np.float32); cv2.circle(m, (int(cx), int(cy)), int(R), 1, -1, cv2.LINE_AA)
            im = im * (1 - m[..., None]) + zoom * m[..., None] * 1.05
            rim = np.zeros((H, W), np.float32); cv2.circle(rim, (int(cx), int(cy)), int(R + 9 * S), 1, max(2, int(16 * S)), cv2.LINE_AA)
            im = im * (1 - rim[..., None]) + rim[..., None] * np.array([0.72, 0.55, 0.25])
            gl = np.zeros((H, W), np.float32); cv2.ellipse(gl, (int(cx - R * 0.35), int(cy - R * 0.4)), (int(R * 0.35), int(R * 0.15)), -30, 0, 360, 1, -1, cv2.LINE_AA)
            im = im + cv2.GaussianBlur(gl, (0, 0), 8 * S)[..., None] * 0.25
            put(film(im, t, i, "warm", halation=0.25))
    elif spec == "dolares":
        bg = load(f"{M}/img/o08_frasco_fg.png", size=(int(W * 1.05), int(H * 1.05)))
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = xform(bg, 1.02 + 0.03 * u) * (1 - 0.3 * ramp(t, 0, 0.6))
            v = int(240000 * ease(ramp(t, 0.3, DUR * 0.6)) / 1000) * 1000
            im = txt(im, f"${v:,.0f}".replace(",", "."), FAN, 190, (W * 0.5, H * 0.32), color=(245, 205, 110), a=ramp(t, 0.2, 0.5))
            im = txt(im, "DÓLARES DE 1944 · TRES KILOS DE PROGESTERONA", FSC, 40, (W * 0.5, H * 0.49), a=ramp(t, DUR * 0.55, DUR * 0.7))
            put(film(im, t, i, "warm", halation=0.25))
    elif spec in ("molecula_falla", "molecula_ok"):
        bg = load(f"{M}/img/x_pizarron.png", size=(int(W * 1.05), int(H * 1.05)))
        segs, tip = steroid(W * 0.27, H * 0.60, 105 * S); cm = chalk_mask(H, W)
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = xform(bg, 1.02 + 0.02 * u)
            prog = ramp(t, 0.2, DUR * (0.45 if spec == "molecula_falla" else 0.4))
            extra = []
            if spec == "molecula_ok":
                e1 = (tip[0] + 50 * S, tip[1] - 60 * S); e2 = (e1[0] + 70 * S, e1[1] - 70 * S)
                if t > DUR * 0.45: extra = [(tip, e1), (e1, e2)]
            lay = draw_segs(segs, prog, 6, extra=extra if prog >= 1 else ())
            if spec == "molecula_ok" and t > DUR * 0.45:
                tr = draw_segs([(tip, e1), (e1, e2)], ramp(t, DUR * 0.45, DUR * 0.6), 6)
                for off in (-7, 7):    # triple enlace dibujado
                    tr = np.maximum(tr, draw_segs([((e1[0] + off * S, e1[1] + off * S), (e2[0] + off * S, e2[1] + off * S))], ramp(t, DUR * 0.5, DUR * 0.62), 4))
                hl = cv2.GaussianBlur(tr, (0, 0), 6 * S)
                im = im + hl[..., None] * np.array([0.9, 0.75, 0.2]) * 0.6
                lay = np.maximum(lay, tr)
            if spec == "molecula_falla":
                er = ramp(t, DUR * 0.62, DUR * 0.92)
                if er > 0:
                    smear = cv2.GaussianBlur(lay, (0, 0), (2 + 14 * er) * S); lay = lay * (1 - er) + smear * (1 - er * 0.6)
            ch = lay * cm
            im = im * (1 - ch[..., None] * 0.85) + ch[..., None] * np.array([0.93, 0.93, 0.9])
            if spec == "molecula_falla":
                im = txt(im, "PROGESTERONA", FSC, 46, (W * 0.70, H * 0.30), color=(235, 235, 228), a=ramp(t, DUR * 0.3, DUR * 0.45), shadow=0)
                im = txt(im, "por la boca: el estómago la destruye", FHAND, 58, (W * 0.70, H * 0.42), color=(240, 200, 120), a=ramp(t, DUR * 0.5, DUR * 0.62), shadow=0)
            else:
                im = txt(im, "NORETISTERONA", FSC, 56, (W * 0.70, H * 0.30), color=(240, 240, 232), a=ramp(t, DUR * 0.55, DUR * 0.7), shadow=0)
                im = txt(im, "× 8", FAN, 150, (W * 0.70, H * 0.48), color=(240, 205, 110), a=ramp(t, DUR * 0.65, DUR * 0.8), shadow=0)
                im = txt(im, "y funciona en una pastilla", FHAND, 56, (W * 0.70, H * 0.64), color=(240, 240, 232), a=ramp(t, DUR * 0.75, DUR * 0.9), shadow=0)
            put(film(im, t, i, "warm", halation=0.15))
    elif spec in ("cita", "academia", "premio"):
        src = {"cita": f"{M}/img/x_mesa.png", "academia": f"{M}/img/o31_libro_bg.png", "premio": f"{M}/img/o22_medalla_fg.png"}[spec]
        bg = load(src, size=(int(W * 1.06), int(H * 1.06)))
        if spec == "cita": L1, L2, att = "«Nadie imaginaba que iba a funcionar.", "Funcionó. Y lo hizo Miramontes.»", "— CARL DJERASSI (paráfrasis)"
        elif spec == "academia": L1, L2, att = "«La mayor contribución de México", "a la ciencia del mundo.»", "— ACADEMIA MEXICANA DE CIENCIAS, 2005"
        else: L1, L2, att = "1986", "Premio Nacional de Química", "MÉXICO"
        words = (L1 + " | " + L2).split(" ")
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = blur(xform(bg, 1.02 + 0.03 * u), 7 if spec != "premio" else 3) * (0.42 if spec != "premio" else 0.55)
            k = int(len(words) * ramp(t, 0.3, DUR * 0.65)) if spec != "premio" else len(words)
            shown = " ".join(words[:k]).split(" | "); a1 = shown[0] if shown else ""; a2 = shown[1] if len(shown) > 1 else ""
            sz = 74 if spec != "premio" else 120
            im = txt(im, a1.replace("|", "").strip(), FP if spec != "premio" else FAN, sz, (W / 2, H * 0.40), a=1 if spec != "premio" else ramp(t, 0.2, 0.6))
            im = txt(im, a2.strip(), FP, 74 if spec != "premio" else 64, (W / 2, H * 0.40 + (110 if spec != "premio" else 130) * S), a=1 if spec != "premio" else ramp(t, 0.5, 0.9))
            im = txt(im, att, FSC, 36, (W / 2, H * 0.40 + 230 * S), color=(225, 210, 185), a=ramp(t, DUR * 0.7, DUR * 0.85))
            put(film(im, t, i, "warm", halation=0.15))
    elif spec == "timeline":
        bg = load(f"{M}/img/x_mesa.png", size=(int(W * 1.06), int(H * 1.06)))
        ev = [("1951", "Miramontes sintetiza", "la noretisterona"), ("1956", "patente en", "Estados Unidos"), ("1960", "llega a farmacias la", "primera píldora (otra molécula)"), ("1962", "se aprueba la", "noretisterona")]
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = blur(xform(bg, 1.02 + 0.03 * u), 5) * 0.45
            x0, x1, y = W * 0.12, W * 0.88, H * 0.52
            pr = ramp(t, 0.2, DUR * 0.75); lay = np.zeros((H, W), np.float32)
            cv2.line(lay, (int(x0), int(y)), (int(x0 + (x1 - x0) * pr), int(y)), 1, max(1, int(4 * S)), cv2.LINE_AA)
            for k, (yr, a, b) in enumerate(ev):
                xk = x0 + (x1 - x0) * k / 3; ak = ramp(t, 0.2 + DUR * 0.75 * k / 3 - 0.1, 0.2 + DUR * 0.75 * k / 3 + 0.3)
                if ak <= 0: continue
                cv2.circle(lay, (int(xk), int(y)), int(12 * S), 1, -1, cv2.LINE_AA)
                gold = (245, 205, 110) if k in (0, 3) else (240, 240, 235)
                im = txt(im, yr, FAN, 120, (xk, y - 110 * S), color=gold, a=ak)
                im = txt(im, a, FSC, 42, (xk, y + 70 * S), a=ak); im = txt(im, b, FSC, 42, (xk, y + 120 * S), a=ak)
            im = im * (1 - lay[..., None]) + lay[..., None] * 0.92
            put(film(im, t, i, "warm", halation=0.15))
    elif spec == "placas":
        names = ["THOMAS A. EDISON", "LOUIS PASTEUR", "LUIS E. MIRAMONTES"]
        wall = np.dstack([cv2.resize(fbm(240, 135, 9), (W, H)) * 0.10 + 0.06] * 3) * np.array([1.0, 0.9, 0.8])
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            im = wall.copy()
            for k, nm in enumerate(names):
                cx = W * (0.5 + (k - 1) * 0.52) - (W * 0.52) * u * 0.9 + W * 0.20; cy = H * 0.48; pw, ph = 860 * S, 440 * S
                lit = 1.0 if k < 2 else 0.55 + 0.45 * ramp(t, DUR * 0.55, DUR * 0.8)
                x0, y0 = int(cx - pw / 2), int(cy - ph / 2)
                plate = np.zeros((H, W), np.float32); cv2.rectangle(plate, (x0, y0), (int(x0 + pw), int(y0 + ph)), 1, -1)
                yy = (np.arange(H)[:, None] - y0) / ph
                metal = np.dstack([0.78 + 0.10 * np.sin(yy * 9), 0.58 + 0.08 * np.sin(yy * 9), 0.30 + 0.05 * np.sin(yy * 9)]) * lit
                im = im * (1 - plate[..., None]) + metal * plate[..., None]
                im = txt(im, "SALÓN DE LOS INVENTORES", FSC, 44, (cx, cy - 135 * S), color=(45, 28, 8), a=1, shadow=0)
                im = txt(im, nm, FP, 84, (cx, cy + 10 * S), color=(30, 18, 4), a=1, shadow=0)
                im = txt(im, nm, FP, 72, (cx - 2 * S, cy + 8 * S), color=(255, 225, 160), a=0.35 * lit, shadow=0)
            if t > DUR * 0.55:
                glow = np.zeros((H, W), np.float32); cx = W * (0.5 + 0.52) - (W * 0.52) * u * 0.9 + W * 0.20
                cv2.ellipse(glow, (int(cx), int(H * 0.48)), (int(500 * S), int(290 * S)), 0, 0, 360, 1, -1)
                im = im + cv2.GaussianBlur(glow, (0, 0), 60 * S)[..., None] * np.array([1.0, 0.75, 0.35]) * 0.25 * ramp(t, DUR * 0.55, DUR * 0.8)
            im = txt(im, "1964 · OFICINA DE PATENTES DE EE.UU.", FSC, 56, (W / 2, H * 0.86), a=ramp(t, 0.3, 0.9))
            put(film(im, t, i, "warm", halation=0.25))
    elif spec == "cuaderno":
        bg0 = load(f"{M}/img/x_cuaderno.png", size=(int(W * 1.08), int(H * 1.08))); bh, bw = bg0.shape[:2]
        lines = ["15 de octubre de 1951", "noretisterona", "(19-nor-17-etinil-testosterona)", "¡activa por vía oral!"]
        hf = ImageFont.truetype(FHAND, int(46 * S * 1.08))
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            tot = sum(len(l) for l in lines); k = int(tot * ramp(t, 0.3, DUR * 0.8)); acc = 0
            lay = Image.new("RGBA", (bw, bh), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
            for j, ln in enumerate(lines):          # sobre los renglones de la página derecha (medida: x 0.51-0.80, y desde 0.29)
                s_ = ln[:max(0, k - acc)]; acc += len(ln)
                d.text((bw * 0.53, bh * (0.315 + 0.082 * j)), s_, font=hf, fill=(22, 30, 85, 235), anchor="ls")
            L = np.asarray(lay).astype(np.float32) / 255
            bg = over(bg0, L)
            im = xform(bg, 1.0 + 0.35 * u, cx=bw * (0.5 + 0.15 * u), cy=bh * (0.5 - 0.08 * u))
            put(film(im, t, i, "warm", halation=0.15))
    p.stdin.close(); p.wait()
