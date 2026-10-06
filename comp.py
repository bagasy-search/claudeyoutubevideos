# comp.py — componentes "After Effects" del Tallador, por código, sobre capas gratis de agnes.
#   texto_entre(): letras metidas ENTRE el fondo y lo que está adelante (oclusión por profundidad), con sombra y desenfoque coherentes
#   r_depth2():    cámara 3D por profundidad + FOCO QUE VIAJA (keyframes) + texto entre capas + tilt-shift
#   r_corridor():  línea de tiempo 3D — pasillo de tarjetas en perspectiva real, foco que sigue a la cámara, hilo rojo, año tallado
#   r_timelapse(): obra -> edificio (agnes keyframes) + ciclo día/noche acelerado + sombras de nubes + cerca desenfocada adelante + nombre entre capas
import os, math, subprocess, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
import cine
from cine import W, H, S, load, xform, blur, dof_rgba, over, bokeh, fbm, film, warp_depth, depth_dof, godrays, ease, ramp
M = os.environ.get("TGP_M", "C:/Users/bauti/Downloads/miramontes"); FPS = 24
FONTS = {"AN": f"{M}/fonts/Anton-Regular.ttf", "PF": f"{M}/fonts/Playfair.ttf", "SC": f"{M}/fonts/CormorantSC.ttf"}

def smooth(x, a, b): return np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))

def text_rgba(w, h, txt, font="AN", size=300, xy=(0.5, 0.5), color=(245, 238, 225), tracking=0.0, anchor="mm"):
    """capa RGBA del texto en coordenadas de la imagen fuente (w,h)"""
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    F = ImageFont.truetype(FONTS[font], int(size * w / 1920))
    if tracking:
        widths = [d.textlength(c, font=F) for c in txt]; tw = sum(widths) + tracking * size * w / 1920 * (len(txt) - 1)
        x = xy[0] * w - tw / 2
        for c, cw in zip(txt, widths):
            d.text((x, xy[1] * h), c, font=F, fill=(*color, 255), anchor="lm"); x += cw + tracking * size * w / 1920
    else:
        d.text((xy[0] * w, xy[1] * h), txt, font=F, fill=(*color, 255), anchor=anchor)
    return np.asarray(im).astype(np.float32) / 255

def texto_entre(img, dd, T, td, a=1.0, shadow=0.55, soft=0.035):
    """img y dd ya en el espacio final; T = RGBA del texto en ese espacio; td = profundidad del plano del texto (0 lejos .. 1 cerca).
    Lo que está más cerca que td TAPA al texto. Devuelve (img, profundidad compuesta) para que el DOF trate al texto en su plano."""
    near = smooth(dd, td - soft, td + soft)                                  # 1 donde la escena está delante del texto
    ta = T[..., 3] * a * (1 - near)
    if shadow:                                                                # sombra del texto proyectada sobre lo de atrás
        sh = cv2.GaussianBlur(T[..., 3], (0, 0), 9 * S); sh = np.roll(sh, (int(10 * S), int(14 * S)), (0, 1))
        img = img * (1 - (sh * shadow * a * (1 - near) * (1 - T[..., 3]))[..., None])
    out = img * (1 - ta[..., None]) + T[..., :3] * ta[..., None]
    return out, dd * (1 - ta) + td * ta

def depthmap(path):
    c = path.replace(".png", "_depth.npy")
    if not os.path.exists(c):
        import sys; sys.path.insert(0, os.environ.get("TGP_CINE", "C:/Users/bauti/Downloads/cine")); import prep
        np.save(c, prep.depth(path))
    return np.load(c)

def keyed(t, keys):
    """keys = [(t, v), ...] interpolación suave"""
    if t <= keys[0][0]: return keys[0][1]
    for (t0, v0), (t1, v1) in zip(keys, keys[1:]):
        if t <= t1: return v0 + (v1 - v0) * ease((t - t0) / max(1e-6, t1 - t0))
    return keys[-1][1]

def tilt_shift(img, center=0.55, band=0.16, amount=9):
    yy = np.abs(np.arange(H) / H - center)[:, None]
    m = np.clip((yy - band) / 0.25, 0, 1) ** 1.3
    b = cv2.GaussianBlur(img, (0, 0), amount * S)
    out = img * (1 - m[..., None]) + b * m[..., None]
    mu = out.mean(-1, keepdims=True); return np.clip(mu + (out - mu) * 1.18, 0, None)       # el look de maqueta pide más color

# ------------------------------------------------------------------ depth 2.0
def r_depth2(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh.get('src', sid)}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); d0 = cv2.resize(depthmap(path), (img0.shape[1], img0.shape[0]))
    lo, hi = np.percentile(d0, 1), np.percentile(d0, 99); d0 = np.clip((d0 - lo) / (hi - lo + 1e-6), 0, 1)
    fx = sh.get("fx", []); cam = sh.get("cam", "dolly"); fpt = sh.get("focal", (0.5, 0.5))
    def pv(v):                                                # "p92" = percentil de la profundidad de ESTA imagen; "mid" = entre fondo y objeto
        if isinstance(v, str):
            if v == "mid": return float((np.percentile(d0, 18) + np.percentile(d0, 93)) / 2)
            return float(np.percentile(d0, float(v[1:])))
        return v
    focus_keys = [(a, pv(b)) for a, b in sh["focus_keys"]] if sh.get("focus_keys") else None
    beh = sh.get("behind")                                    # {"t","font","size","xy","td","color","in"}
    T0 = text_rgba(img0.shape[1], img0.shape[0], beh["t"], beh.get("font", "AN"), beh.get("size", 300), tuple(beh.get("xy", (0.5, 0.5))),
                   tuple(beh.get("color", (245, 238, 225))), beh.get("tracking", 0.0)) if beh else None
    T1 = text_rgba(img0.shape[1], img0.shape[0], beh["sub"], "SC", beh.get("subsize", 60), tuple(beh.get("subxy", (0.5, 0.75))), (240, 230, 210), 0.25) if beh and beh.get("sub") else None
    lum = img0.mean(-1); thr = np.percentile(lum, 98.5); lightmask = (lum > max(thr, 0.75)).astype(np.float32)
    ys, xs = np.nonzero(lightmask); src = (xs.mean(), ys.mean()) if len(xs) else (img0.shape[1] * 0.5, 0)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        if cam == "push":   sn, sf, dxn = 1 + 0.30 * u, 1 + 0.10 * u, 0
        elif cam == "dolly": sn, sf, dxn = 1 + 0.20 * u, 1 + 0.04 * u, -40 * u * S
        elif cam == "orbit": sn, sf, dxn = 1.04, 1.02, (70 - 140 * u) * S
        elif cam == "rise":  sn, sf, dxn = 1.03 + 0.04 * u, 1.01, 0
        else:                sn, sf, dxn = 1.02 + 0.03 * u, 1.01, (-110 * u) * S
        dyn = (40 - 80 * u) * S if cam == "rise" else 0
        im, dd = warp_depth(img0, d0, sn, sf, dx_near=dxn, dy_near=dyn, focal=fpt)
        if T0 is not None:
            td = pv(beh.get("td", "mid")); a = ramp(t, DUR * beh.get("in", 0.15), DUR * beh.get("in", 0.15) + 0.9)
            const = np.full(d0.shape, td, np.float32)
            Tw = np.dstack([warp_depth(T0[..., k], const, sn, sf, dx_near=dxn, dy_near=dyn, focal=fpt)[0] for k in range(4)])
            # el texto sube un poco y gana aire de letras mientras entra
            Tw = np.roll(Tw, int((1 - a) * 30 * S), 0)
            im, dd = texto_entre(im, dd, Tw, td, a=a)
            if T1 is not None:
                a2 = ramp(t, DUR * beh.get("in", 0.15) + 0.6, DUR * beh.get("in", 0.15) + 1.4)
                T1w = np.dstack([warp_depth(T1[..., k], const, sn, sf, dx_near=dxn, dy_near=dyn, focal=fpt)[0] for k in range(4)])
                im, dd = texto_entre(im, dd, T1w, td, a=a2, shadow=0.35)
        f = keyed(u, focus_keys) if focus_keys else float(np.percentile(dd, 60))
        im = depth_dof(im, dd, focus=f, strength=sh.get("strength", 18))
        if "rays" in fx:
            lm, _ = warp_depth(np.dstack([lightmask] * 3), d0, sn, sf, dx_near=dxn, focal=fpt)
            im, _ = godrays(im, src, lm[..., 0] * 0.9, length=1.4, gain=0.32, tint=(1.0, 0.93, 0.82))
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        if "bokeh" in fx: im = im + (bokeh(im, 26, thresh=0.72) - im) * 0.6
        if "glint" in fx:                                                    # destello que recorre los objetos brillantes
            g = np.clip(im.mean(-1) - 0.62, 0, 1); x0 = (u * 1.6 - 0.3) * W
            band = np.exp(-((np.arange(W)[None, :] - x0 - (np.arange(H)[:, None] - H / 2) * 0.4) / (90 * S)) ** 2)
            im = im + (g * band * 2.2)[..., None] * np.array([1.0, 0.92, 0.7])
        if "tilt" in fx: im = tilt_shift(im)
        put(film(im, t, i, "warm", halation=0.28))

# ------------------------------------------------------------------ línea de tiempo 3D: pasillo de tarjetas
def card_texture(path, year, label, w=900, h=560, crop=None):
    im = Image.open(path).convert("RGB")
    if crop: iw, ih = im.size; im = im.crop((int(crop[0] * iw), int(crop[1] * ih), int(crop[2] * iw), int(crop[3] * ih)))
    im = im.resize((w, int(h * 0.74)), Image.LANCZOS)
    card = Image.new("RGB", (w, h), (236, 228, 212)); card.paste(im, (0, 0)); d = ImageDraw.Draw(card)
    d.rectangle((0, int(h * 0.74), w, h), fill=(28, 22, 18))
    d.text((40, int(h * 0.87)), year, font=ImageFont.truetype(FONTS["AN"], 92), fill=(232, 196, 120), anchor="lm")
    d.text((250, int(h * 0.87)), label, font=ImageFont.truetype(FONTS["SC"], 40), fill=(236, 228, 212), anchor="lm")
    a = np.asarray(card).astype(np.float32) / 255
    # bordes de papel y viñeta propia
    yy, xx = np.mgrid[0:h, 0:w]; v = 1 - 0.25 * (((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2) ** 2
    return np.dstack([a * v[..., None], np.ones((h, w), np.float32)])

def r_corridor(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); cards = sh["cards"]
    TX = [card_texture(f"{M}/{c['img']}", c["year"], c["label"], crop=c.get("crop")) for c in cards]
    n = len(TX); gap = 2.4
    pos = [((-0.78 if k % 2 == 0 else 0.78), 0.0, 3.6 + gap * k) for k in range(n)]      # zig-zag a izquierda y derecha
    f = W * 0.95
    haze = cv2.resize(fbm(320, 180, 77, base=3), (W, H))
    yy = np.arange(H)[:, None] / H
    base = np.dstack([0.10 + 0.10 * (1 - yy), 0.075 + 0.08 * (1 - yy), 0.055 + 0.06 * (1 - yy)]) * np.ones((1, W, 1))
    base = base + (haze * 0.05)[..., None] * np.array([1.0, 0.85, 0.6])
    P = np.random.default_rng(3).random((260, 3)) * [6, 3, gap * n + 6] + [-3, -1.5, 0]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        camz = 0.0 + (pos[-1][2] - 3.4) * u; camx = 0.25 * math.sin(u * math.pi * 2) * (1 - ramp(t, DUR * 0.7, DUR)) + 0.55 * pos[-1][0] * ramp(t, DUR * 0.7, DUR)
        # a qué tarjeta mira: el foco sigue a la más cercana delante de la cámara
        ahead = [p[2] - camz for p in pos if p[2] - camz > 1.7]
        fd = min(ahead) if ahead else 2.0
        img = base.copy()
        # piso de madera oscura con brillo (gradiente en perspectiva)
        floor = np.clip((yy - 0.62) / 0.38, 0, 1)
        img = img + (floor ** 1.5 * 0.10)[..., None] * np.array([0.9, 0.6, 0.35])
        # hilo rojo: polilínea 3D por el centro de las tarjetas (a la altura de su borde inferior)
        lay = np.zeros((H, W), np.float32); pts = []
        for (x, y, z) in pos:
            dz = z - camz
            if dz > 0.2: pts.append((W / 2 + f * (x * 0.85 - camx) / dz, H / 2 + f * (0.55) / dz))
        if len(pts) > 1: cv2.polylines(lay, [np.int32(pts)], False, 1.0, max(1, int(3 * S)), cv2.LINE_AA)
        img = img * (1 - lay[..., None] * 0.6) + (lay[..., None] * np.array([0.8, 0.12, 0.08])) + cv2.GaussianBlur(lay, (0, 0), 6 * S)[..., None] * np.array([0.6, 0.1, 0.05])
        # tarjetas de atrás hacia adelante
        order = sorted(range(n), key=lambda k: -(pos[k][2] - camz))
        for k in order:
            x, y, z = pos[k]; dz = z - camz
            if dz < 0.35: continue
            cw, ch = 1.9, 1.18; yaw = (-0.42 if x < 0 else 0.42)                       # giradas hacia el centro del pasillo
            corners = []
            for (sx, sy) in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                px = x + sx * cw / 2 * math.cos(yaw); pz = z + sx * cw / 2 * math.sin(yaw); py = y + sy * ch / 2
                dzz = pz - camz; corners.append((W / 2 + f * (px - camx) / dzz, H / 2 + f * py / dzz))
            tex = TX[k]; th, tw = tex.shape[:2]
            Hm = cv2.getPerspectiveTransform(np.float32([[0, 0], [tw, 0], [tw, th], [0, th]]), np.float32(corners))
            L = cv2.warpPerspective(tex, Hm, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
            coc = abs(dz - fd) * 2.6                                                  # desenfoque por distancia al plano de foco
            L = dof_rgba(L, min(coc, 16))
            fog = min(1, max(0, (dz - 5) / 9))                                       # lo lejano se pierde en la bruma
            L[..., :3] = L[..., :3] * (1 - fog * 0.75) + np.array([0.07, 0.06, 0.05]) * fog * 0.75
            # sombra de contacto en el piso
            shd = np.zeros((H, W), np.float32); bx = int(np.mean([c[0] for c in corners])); by = int(max(c[1] for c in corners))
            cv2.ellipse(shd, (bx, by), (int(abs(corners[1][0] - corners[0][0]) * 0.55), int(14 * S * 3 / max(dz, 1))), 0, 0, 360, 1, -1)
            img = img * (1 - cv2.GaussianBlur(shd, (0, 0), 10 * S)[..., None] * 0.5)
            img = over(img, L)
        # polvo en el haz, más grande cerca
        lay = np.zeros((H, W), np.float32)
        for (x, y, z) in P:
            dz = z - camz
            if dz < 0.3: continue
            sx, sy = W / 2 + f * (x - camx) / dz, H / 2 + f * y / dz
            if 0 <= sx < W and 0 <= sy < H: cv2.circle(lay, (int(sx), int(sy)), max(1, int(2.2 * S / dz * 3)), 1.0, -1, cv2.LINE_AA)
        img = img + cv2.GaussianBlur(lay, (0, 0), 1.5 * S)[..., None] * 0.25 * np.array([1, 0.9, 0.75])
        # luz cenital cálida desde arriba
        img = img * (1 + 0.25 * np.exp(-((np.arange(W) - W / 2) / (W * 0.45)) ** 2)[None, :, None])
        put(film(img, t, i, "warm", halation=0.3))

# ------------------------------------------------------------------ timelapse de la fundación
def r_timelapse(sh, sid, DUR, put):
    N = int(round(DUR * FPS))
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{M}/clips/{sh['clip']}.mp4", "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3); n = len(fr)
    dB = cv2.resize(depthmap(f"{M}/img/{sh['final']}.png"), (W, H)); lo, hi = np.percentile(dB, 1), np.percentile(dB, 99); dB = np.clip((dB - lo) / (hi - lo + 1e-6), 0, 1)
    fence = None
    if sh.get("fg"):
        c = f"{M}/img/{sh['fg']}_cut.png"
        fence = np.asarray(Image.open(c).convert("RGBA")).astype(np.float32) / 255; fence = cv2.resize(fence, (int(W * 1.2), int(H * 1.2)))
    beh = sh["behind"]; T = text_rgba(W, H, beh["t"], "AN", beh.get("size", 260), tuple(beh.get("xy", (0.5, 0.42))), (250, 246, 236), beh.get("tracking", 0.12))
    T2 = text_rgba(W, H, beh.get("sub", ""), "SC", 64, tuple(beh.get("subxy", (0.5, 0.60))), (245, 235, 215), 0.3) if beh.get("sub") else None
    clouds = cv2.resize(fbm(320, 180, 15, base=3), (W * 2, H))
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        k = min(n - 1, int(min(t / (DUR * 0.78), 1.0) * (n - 1)))                    # la obra termina al 78 % y se sostiene
        img = fr[k].astype(np.float32) / 255
        img = cv2.warpAffine(img, cv2.getRotationMatrix2D((W / 2, H * 0.6), 0, 1.0 + 0.05 * u), (W, H), borderMode=cv2.BORDER_REFLECT)
        # ciclo día/noche acelerado (2,5 días) mientras se construye
        ph = t / (DUR * 0.78) * 2.5 * 2 * math.pi if t < DUR * 0.78 else 2.5 * 2 * math.pi
        day = 0.5 + 0.5 * math.cos(ph)
        night = (1 - day) * (1 - ramp(t, DUR * 0.7, DUR * 0.85))
        img = img * (1 - 0.55 * night) * np.array([1 - 0.25 * night, 1 - 0.12 * night, 1 + 0.18 * night])
        # sombras de nubes que corren
        off = int((t * 900 * S) % W); cl = clouds[:, off:off + W]
        img = img * (1 - 0.28 * np.clip(cl - 0.45, 0, 1)[..., None] * 2 * (1 - night))
        # al terminar: el nombre aparece ENTRE el edificio y el cielo
        a = ramp(t, DUR * 0.80, DUR * 0.92)
        if a > 0:
            img, _ = texto_entre(img, dB, np.roll(T, int((1 - a) * 40 * S), 0), beh.get("td", 0.42), a=a)
            if T2 is not None: img, _ = texto_entre(img, dB, T2, beh.get("td", 0.42), a=ramp(t, DUR * 0.86, DUR * 0.97), shadow=0.3)
        # cerca desenfocada en primer plano, con paralaje
        if fence is not None:
            F = xform(fence, 1.05, dx=-140 * u, dy=330)
            img = over(img, dof_rgba(F, 9))
        put(film(img, t, i, "warm", halation=0.25))
