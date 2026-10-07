import os
# cine.py — compositor de cine 2.5D para "El Tallador de Genios". Todo por código sobre capas gratis de agnes.
# Técnicas: multiplano con paralaje, cambio de foco físico (círculo de confusión por capa), bokeh de discos,
# cámara 3D desde mapa de profundidad, dolly-zoom (Vértigo), rayos volumétricos, polvo 3D con desenfoque,
# lluvia en el vidrio, relámpagos que re-iluminan, llama que titila, niebla entre planos, lluvia en 3 capas,
# match-cut por forma; y "película": halación, bloom, aberración cromática, temblor de gate, grano, viñeta.
# uso: python cine.py <shot> [--prev]     shots: barra lab vertigo tormenta calle match
import sys, os, subprocess, math, numpy as np, cv2
from PIL import Image
D = os.environ.get("TGP_M", os.getcwd())
W, H, FPS = 1920, 1080, 24
PREV = "--prev" in sys.argv
if PREV: W, H = 960, 540
S = W / 1920.0                                     # escala de píxeles (previa a media resolución)
rng = np.random.default_rng(11)

# ------------------------------------------------------------------ utilidades
def load(path, size=None, alpha=False):
    im = Image.open(path).convert("RGBA" if alpha else "RGB")
    if size: im = im.resize(size, Image.LANCZOS)
    return np.asarray(im).astype(np.float32) / 255

def ease(x): x = min(max(x, 0.0), 1.0); return x * x * (3 - 2 * x)
def ramp(t, a, b): return ease((t - a) / (b - a)) if b > a else float(t >= a)

def xform(img, scale=1.0, dx=0.0, dy=0.0, cx=None, cy=None, out=(None, None)):
    """escala alrededor de (cx,cy) y traslada, subpíxel, salida W x H (con sobre-escaneo de la fuente)"""
    ow, oh = out[0] or W, out[1] or H
    h, w = img.shape[:2]
    cx = w / 2 if cx is None else cx; cy = h / 2 if cy is None else cy
    k = scale * ow / w                              # la fuente se ajusta al ancho de salida
    M = np.float32([[k, 0, ow / 2 - k * cx + dx * S], [0, k, oh / 2 - k * cy + dy * S]])
    if img.shape[2] == 4:   # capas con alfa: fuera de la imagen es TRANSPARENTE (no espejo)
        return cv2.warpAffine(img, M, (ow, oh), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0, 0))
    return cv2.warpAffine(img, M, (ow, oh), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT101)

def blur(img, sigma):
    if sigma * S < 0.35: return img
    return cv2.GaussianBlur(img, (0, 0), sigma * S)

def dof_rgba(rgba, sigma):
    """desenfoque de capa con alfa premultiplicado (sin halos oscuros)"""
    if sigma * S < 0.35: return rgba
    a = rgba[..., 3:4]; pre = np.concatenate([rgba[..., :3] * a, a], -1)
    b = cv2.GaussianBlur(pre, (0, 0), sigma * S)
    return np.concatenate([b[..., :3] / np.maximum(b[..., 3:4], 1e-4), b[..., 3:4]], -1)

def over(dst, rgba):
    a = rgba[..., 3:4]; return dst * (1 - a) + rgba[..., :3] * a

DISK = {}
def bokeh(img, radius, thresh=0.72, gain=1.6):
    """discos de bokeh a partir de las altas luces (calculado a 1/4 de resolución)"""
    r = int(radius * S / 4)
    if r < 2: return img
    small = cv2.resize(img, (img.shape[1] // 4, img.shape[0] // 4), interpolation=cv2.INTER_AREA)
    hi = np.clip(small - thresh, 0, 1) ** 1.2 * gain
    if r not in DISK:
        k = np.zeros((2 * r + 1, 2 * r + 1), np.float32); cv2.circle(k, (r, r), r, 1, -1, cv2.LINE_AA)
        k[r, r] += 0.0; DISK[r] = k / k.sum() * 3.0
    disc = cv2.filter2D(hi, -1, DISK[r])
    return img + cv2.resize(disc, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_LINEAR)

def fbm(w, h, seed, octaves=5, base=4):
    """ruido fractal suave (para niebla y humo)"""
    g = np.random.default_rng(seed); acc = np.zeros((h, w), np.float32); amp = 1; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        acc += amp * cv2.resize(g.random((n, int(n * w / h) + 1)).astype(np.float32), (w, h), interpolation=cv2.INTER_CUBIC)
        tot += amp; amp *= 0.5
    return acc / tot

def film(img, t, i, look="warm", halation=0.22, grain=0.035, weave=True, ca=1.0):
    """acabado de película"""
    if os.environ.get("TGP_LOOK") == "clay":                       # Caja Naranja: maqueta de arcilla, limpio (sin halación roja ni temblor)
        hi = np.clip(img - 0.86, 0, None); img = img + cv2.GaussianBlur(hi, (0, 0), 30 * S) * 0.25
        img = img * np.array([1.0, 0.995, 0.985]) + np.array([0.0, 0.002, 0.008]) * (1 - img)
        yy, xx = np.ogrid[:H, :W]; img = img * (1 - 0.10 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.5)[..., None]
        gr = cv2.resize(np.random.default_rng(i).normal(0, 1, (H // 2, W // 2)).astype(np.float32), (W, H))
        return np.clip(img + gr[..., None] * 0.012, 0, 1)
    hi = np.clip(img - 0.78, 0, None)
    hal = cv2.GaussianBlur(hi, (0, 0), 14 * S) * np.array([1.0, 0.45, 0.25], np.float32)      # halación rojiza
    bloom = cv2.GaussianBlur(hi, (0, 0), 40 * S)
    img = img + hal * halation * 3 + bloom * 0.35
    if look == "warm":  img = img * np.array([1.03, 1.0, 0.95]) + np.array([0.0, 0.004, 0.018]) * (1 - img)   # sombras frías
    if look == "night": img = img * np.array([0.97, 1.0, 1.06]) + np.array([0.0, 0.006, 0.02]) * (1 - img)
    img = np.clip(img, 0, None); img = img / (1 + img * 0.18) * 1.12                                   # hombro suave
    if ca:
        sh = 1.2 * S * ca                                                                             # aberración cromática radial
        Mr = cv2.getRotationMatrix2D((W / 2, H / 2), 0, 1 + sh / W * 2); Mb = cv2.getRotationMatrix2D((W / 2, H / 2), 0, 1 - sh / W * 2)
        img[..., 0] = cv2.warpAffine(img[..., 0], Mr, (W, H), borderMode=cv2.BORDER_REFLECT)
        img[..., 2] = cv2.warpAffine(img[..., 2], Mb, (W, H), borderMode=cv2.BORDER_REFLECT)
    yy, xx = np.ogrid[:H, :W]
    v = 1 - 0.38 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) ** 1.4
    img = img * v[..., None]
    if weave:                                                                                         # temblor de gate
        g = np.random.default_rng(int(i // 2) + 999)
        img = cv2.warpAffine(img, np.float32([[1, 0, g.normal(0, 0.35) * S], [0, 1, g.normal(0, 0.45) * S]]), (W, H), borderMode=cv2.BORDER_REFLECT)
    gr = np.random.default_rng(i).normal(0, 1, (H // 2, W // 2)).astype(np.float32)
    gr = cv2.resize(gr, (W, H), interpolation=cv2.INTER_LINEAR)
    lum = img.mean(-1, keepdims=True)
    img = img + gr[..., None] * grain * (0.35 + 0.65 * (1 - np.abs(lum - 0.45) * 1.6).clip(0, 1))
    return np.clip(img, 0, 1)

class Writer:
    def __init__(self, name):
        self.p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                                   "-i", "-", "-c:v", "libx264", "-crf", "15" if not PREV else "22", "-preset", "medium",
                                   "-pix_fmt", "yuv420p", f"{D}/out/{name}{'_prev' if PREV else ''}.mp4"], stdin=subprocess.PIPE)
        self.n = 0
    def put(self, img): self.p.stdin.write((np.clip(img, 0, 1) * 255).astype(np.uint8).tobytes()); self.n += 1
    def close(self): self.p.stdin.close(); self.p.wait()

def clip_frames(path, size, start=0.0, n=None, keyed=False):
    """lee un clip; si keyed, recorta cada cuadro con rembg -> RGBA (caché en disco)"""
    cache = path.replace(".mp4", f"_{'k' if keyed else 'f'}{size[0]}.npy")
    if os.path.exists(cache): return np.load(cache, mmap_mode="r")
    cmd = ["ffmpeg", "-v", "error", "-ss", str(start), "-i", path, "-vf", f"scale={size[0]}:{size[1]}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    raw = subprocess.run(cmd, capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, size[1], size[0], 3)
    if n: fr = fr[:n]
    if keyed:
        from rembg import remove, new_session
        s = new_session("isnet-general-use"); out = []
        for k, f in enumerate(fr):
            if k % 2 == 1: out.append(out[-1]); continue                 # en dos: recorto 1 de cada 2
            out.append(np.asarray(remove(Image.fromarray(f), session=s, post_process_mask=True)))
        fr = np.stack(out)
    np.save(cache, fr); return np.load(cache, mmap_mode="r")

# ------------------------------------------------------------------ 1 · LA BARRA (multiplano + cambio de foco + humo)
def shot_barra(dur=6.5):
    bg = load(f"{D}/layers/p1_bg.png")
    fg_rgb = load(f"{D}/layers/p1_fg.png")
    cut = load(f"{D}/layers/p1_fg_cut.png", alpha=True)
    lum = fg_rgb.mean(-1); hh = fg_rgb.shape[0]; yy = np.arange(hh)[:, None]
    counter = ((fg_rgb[..., 0] > 0.10) & (fg_rgb[..., 0] > fg_rgb[..., 2] * 1.3) & (yy > hh * 0.55)).astype(np.float32)   # la barra: madera marrón, no la pared negra
    counter = cv2.GaussianBlur(cv2.morphologyEx(counter, cv2.MORPH_CLOSE, np.ones((9, 9), np.float32)), (0, 0), 1.5)
    fg = np.concatenate([fg_rgb, np.maximum(cut[..., 3], counter)[..., None]], -1)
    chpath = f"{D}/clips/p1_char.mp4"
    chw = 1100
    ch = clip_frames(chpath, (chw, int(chw * 9 / 16)), keyed=True) if os.path.exists(chpath) else None
    still = load(f"{D}/layers/p1_char_cut.png", size=(chw, int(chw * 9 / 16)), alpha=True)
    smoke = [fbm(480, 270, 50 + k) for k in range(2)]
    wr = Writer("s1_barra"); N = int(dur * FPS)
    for i in range(N):
        t = i / FPS; u = ease(t / dur)
        # paralaje: fondo a la izquierda, personaje apenas a la derecha, primer plano rápido a la izquierda
        B = xform(bg, 1.08 + 0.025 * u, dx=30 - 70 * u, dy=-10)
        F = xform(fg, 1.02 + 0.05 * u, dx=-120 * u - 60, dy=150, cx=fg.shape[1] * 0.42)
        if ch is not None: c = ch[min(len(ch) - 1, int(i * len(ch) / N))].astype(np.float32) / 255
        else: c = still
        Ci = xform(c, 0.58, dx=300 + 18 * u, dy=105, out=(W, H))
        # foco: 0-2.4 s en la botella, 2.4-3.6 s se pasa al personaje
        f = ramp(t, 2.4, 3.6)
        sB, sC, sF = 9 + 2 * f, 7 * (1 - f), 15 * f
        breathe = 1 + 0.006 * math.sin(math.pi * f)                           # respiración de foco
        B = blur(B, sB); B = bokeh(B, 26 + 10 * f, thresh=0.68)
        img = B
        # humo de tabaco entre fondo y personaje (deriva hacia arriba-derecha)
        sm = cv2.resize(smoke[0], (W, H))
        sm = np.roll(sm, (int(-t * 18 * S), int(t * 10 * S)), (0, 1))
        img = img + (np.clip(sm - 0.45, 0, 1) * 0.55)[..., None] * np.array([0.9, 0.75, 0.55]) * 0.35
        img = over(img, dof_rgba(Ci, sC))
        sm2 = np.roll(cv2.resize(smoke[1], (W, H)), (int(-t * 30 * S), int(t * 24 * S)), (0, 1))
        img = img + (np.clip(sm2 - 0.55, 0, 1) * 0.5)[..., None] * np.array([0.9, 0.78, 0.6]) * 0.25
        img = over(img, dof_rgba(F, sF))
        if breathe != 1: img = xform(img, breathe)
        wr.put(film(img, t, i, "warm", halation=0.3))
    wr.close(); print("barra", wr.n)

# ------------------------------------------------------------------ 2 · EL LABORATORIO (cámara 3D por profundidad + rayos + polvo)
def warp_depth(img, d, scale_near, scale_far, dx_near=0, dy_near=0, focal=(0.5, 0.5)):
    h, w = d.shape
    cx, cy = w * focal[0], h * focal[1]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    dd = d
    for _ in range(2):                                                            # mapeo inverso aproximado
        s = scale_far + (scale_near - scale_far) * dd
        sx = cx + (xx - cx - dx_near * dd) / s; sy = cy + (yy - cy - dy_near * dd) / s
        dd = cv2.remap(d, sx, sy, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    return cv2.remap(img, sx, sy, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT), dd

def depth_dof(img, d, focus, strength):
    """desenfoque variable por profundidad con 4 niveles mezclados"""
    coc = np.abs(d - focus) * strength
    levels = [0, 3, 7, 13]
    blurs = [img] + [blur(img, s) for s in levels[1:]]
    out = np.zeros_like(img); wsum = np.zeros(d.shape, np.float32)
    for s, b in zip(levels, blurs):
        wgt = np.exp(-((coc - s) ** 2) / (2 * 2.5 ** 2)); out += b * wgt[..., None]; wsum += wgt
    return out / wsum[..., None]

def godrays(img, src, mask, length=0.9, steps=24, tint=(1.0, 0.86, 0.62), gain=0.9):
    """rayos volumétricos: desenfoque radial de la máscara de luz desde la fuente"""
    acc = np.zeros(mask.shape, np.float32); m = mask.copy()
    for k in range(steps):
        s = 1 + length * k / steps
        M = cv2.getRotationMatrix2D(src, 0, s)
        acc += cv2.warpAffine(m, M, (mask.shape[1], mask.shape[0])) * (1 - k / steps)
    acc /= steps
    return img + (acc * gain)[..., None] * np.array(tint, np.float32), acc

def shot_lab(dur=6.5):
    img0 = load(f"{D}/layers/p2_lab.png", size=(int(W * 1.1), int(H * 1.1)))
    d0 = cv2.resize(np.load(f"{D}/layers/p2_lab_depth.npy"), (img0.shape[1], img0.shape[0]))
    lum = img0.mean(-1)
    win = ((lum > 0.80) & (np.arange(img0.shape[1])[None, :] < img0.shape[1] * 0.22)).astype(np.float32)
    # polvo: 420 motas en 3D (x,y en 0..1, z = profundidad 0 lejos .. 1 cerca)
    P = rng.random((420, 3)).astype(np.float32); P[:, 2] = P[:, 2] ** 0.7
    vel = rng.normal(0, 1, (420, 2)).astype(np.float32) * 0.004
    wr = Writer("s2_lab"); N = int(dur * FPS); src = (img0.shape[1] * 0.10, img0.shape[0] * 0.22)
    for i in range(N):
        t = i / FPS; u = ease(t / dur)
        im, dd = warp_depth(img0, d0, 1.0 + 0.30 * u, 1.0 + 0.05 * u, dx_near=-140 * u * S, focal=(0.55, 0.5))
        dm, _ = warp_depth(np.dstack([win] * 3), d0, 1.0 + 0.30 * u, 1.0 + 0.05 * u, dx_near=-140 * u * S, focal=(0.55, 0.5))
        im = depth_dof(im, dd, focus=0.30, strength=26)                         # foco en el científico del fondo
        im, rays = godrays(im, src, dm[..., 0] * 0.9, length=1.6, gain=0.38, tint=(1.0, 0.93, 0.82))
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA); rays = cv2.resize(rays, (W, H))
        # motas: se iluminan dentro del haz, tamaño y desenfoque según profundidad
        P[:, :2] += vel + np.array([0.0006, -0.0003]); P[:, :2] %= 1.0
        layer = np.zeros((H, W), np.float32)
        for (x, y, z) in P:
            sx = (0.5 + (x - 0.5) * (1 + 0.5 * z * u)) * W; sy = (0.5 + (y - 0.5) * (1 + 0.5 * z * u)) * H
            if not (0 <= sx < W and 0 <= sy < H): continue
            r = (0.8 + 4.5 * z ** 2) * S
            cv2.circle(layer, (int(sx * 4), int(sy * 4)), max(1, int(r * 4)), 1.0, -1, cv2.LINE_AA, shift=2)
        layer = cv2.GaussianBlur(layer, (0, 0), 1.6 * S)
        light = 0.12 + rays * 3.0
        im = im + (layer * light * 0.9)[..., None] * np.array([1.0, 0.9, 0.7])
        m_ = im.mean(-1, keepdims=True); im = np.clip((im - m_) * 1.25 + m_, 0, None)           # más color
        im = (im - 0.06) / 0.94 * np.array([0.98, 1.0, 1.04])                                   # negro real, menos sepia
        wr.put(film(im, t, i, "night", halation=0.25))
    wr.close(); print("lab", wr.n)

# ------------------------------------------------------------------ 3 · VÉRTIGO (dolly zoom: la cara quieta, el fondo se estira)
def shot_vertigo(dur=3.4):
    img = load(f"{D}/layers/p3_face.png", size=(W, H))
    d = cv2.resize(np.load(f"{D}/layers/p3_face_depth.npy"), (W, H))
    face = (d > 0.62).astype(np.uint8)
    face = cv2.dilate(face, np.ones((int(61 * S) | 1,) * 2, np.uint8))
    plate = cv2.inpaint((img * 255).astype(np.uint8), face, int(12 * S), cv2.INPAINT_TELEA).astype(np.float32) / 255
    fm = cv2.GaussianBlur((d > 0.60).astype(np.float32), (0, 0), 1.5 * S)
    fcx, fcy = W * 0.56, H * 0.42
    wr = Writer("s3_vertigo"); N = int(dur * FPS)
    for i in range(N):
        t = i / FPS; u = ease(t / dur)
        # el fondo se agranda según su distancia (más lejos = más), la cara no
        bgw, _ = warp_depth(plate, np.clip(0.62 - d, 0, None) / 0.62, 1.0 + 0.55 * u, 1.0, focal=(fcx / W, fcy / H))
        bgw = blur(bgw, 2.0 + 3 * u)
        im = bgw * (1 - fm[..., None]) + img * fm[..., None]
        # luz verde que sube desde abajo y empuje mínimo
        grad = np.clip((np.arange(H)[:, None] / H - 0.4) / 0.6, 0, 1) ** 1.5
        im = im + (grad * (0.10 + 0.45 * fm) * u)[..., None] * np.array([0.35, 1.0, 0.25]) * (0.2 + im.mean(-1, keepdims=True))
        im = cv2.warpAffine(im, cv2.getRotationMatrix2D((fcx, fcy), 0, 1.0 + 0.03 * u), (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT101)
        wr.put(film(im, t, i, "night", halation=0.2))
    wr.close(); print("vertigo", wr.n)

# ------------------------------------------------------------------ 4 · LA TORMENTA (lluvia en el vidrio + relámpagos + llama)
def shot_tormenta(dur=4.0):
    fr = clip_frames(f"{D}/../escena20/clips/s08_escribe.mp4", (W, H))
    wx0, wx1, wy0, wy1 = int(510 * S), int(1420 * S), 0, int(510 * S)
    lamp = (464 * S, 590 * S)
    # gotas: posiciones fijas + chorros que bajan
    drops = rng.random((260, 3)) * [wx1 - wx0, wy1 - wy0, 1] + [wx0, wy0, 0]
    streams = rng.random((26, 3)) * [wx1 - wx0, wy1 - wy0, 1] + [wx0, wy0, 0]
    flashes = [(1.05, 0.10), (1.25, 0.18), (2.85, 0.14)]
    wr = Writer("s4_tormenta"); N = int(dur * FPS); yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    lampfall = np.exp(-np.hypot(xx - lamp[0], yy - lamp[1]) / (380 * S))
    for i in range(N):
        t = i / FPS
        f = fr[min(len(fr) - 1, (i // 2) * 2 * len(fr) // N)].astype(np.float32) / 255     # en dos
        r, g, b = f[..., 0], f[..., 1], f[..., 2]
        winm = np.zeros((H, W), np.float32); winm[wy0:wy1, wx0:wx1] = ((b > r * 1.05) & (f.mean(-1) < 0.55))[wy0:wy1, wx0:wx1]
        winm = cv2.GaussianBlur(winm, (0, 0), 3 * S)
        # lluvia en el vidrio: refracción aproximada (desplazar el fondo dentro de cada gota)
        rain = np.zeros((H, W), np.float32)
        for x, y, z in drops: cv2.circle(rain, (int(x), int(y)), max(1, int((1.5 + 3 * z) * S)), 1, -1, cv2.LINE_AA)
        for k, (x, y0, z) in enumerate(streams):
            y = (y0 + t * (120 + 260 * z) * S) % (wy1 - wy0)
            cv2.line(rain, (int(x), int(y - 40 * S * z)), (int(x + 2), int(y)), 0.7, max(1, int(2 * S)), cv2.LINE_AA)
            cv2.circle(rain, (int(x + 2), int(y)), max(1, int(3.5 * S * (0.5 + z))), 1, -1, cv2.LINE_AA)
        rain *= winm
        shift = cv2.GaussianBlur(rain, (0, 0), 2 * S)
        disp = cv2.remap(f, xx + shift * 9 * S, yy + shift * 12 * S, cv2.INTER_LINEAR)
        f = f * (1 - rain[..., None]) + (disp * 1.15 + 0.06) * rain[..., None]
        # relámpago: re-ilumina con luz fría, más fuerte en la ventana y en lo que mira hacia ella
        fl = sum(a * math.exp(-((t - c) / 0.035) ** 2) for c, a in flashes) * 5
        fl += sum(a * 0.6 * math.exp(-max(0, t - c) / 0.18) * (t > c) for c, a in flashes)
        lum = f.mean(-1, keepdims=True)
        f = f * (1 - 0.25 * min(fl, 1)) + fl * (1.1 * lum + 1.6 * winm[..., None] + 0.04) * np.array([0.62, 0.78, 1.0])
        # llama: titileo cálido con ruido
        fk = 1 + 0.10 * math.sin(t * 23) + 0.07 * math.sin(t * 37 + 1) + 0.05 * rng.normal()
        f = f * (1 + (fk - 1) * 1.4 * lampfall[..., None] * np.array([1.0, 0.8, 0.5]))
        wr.put(film(f, t, i, "night", halation=0.3))
    wr.close(); print("tormenta", wr.n)

# ------------------------------------------------------------------ 5 · LA CALLE (multiplano por profundidad + niebla + lluvia 3D)
def shot_calle(dur=6.0):
    img = load(f"{D}/layers/p5_street.png", size=(int(W * 1.12), int(H * 1.12)))
    d = cv2.resize(np.load(f"{D}/layers/p5_street_depth.npy"), (img.shape[1], img.shape[0]))
    cuts = [0.0, 0.18, 0.42, 0.70, 1.01]                                          # 4 planos
    planes = []
    for k in range(4):
        m = ((d >= cuts[k]) & (d < cuts[k + 1])).astype(np.float32)
        # rellenar lo que tapan los planos más cercanos (inpaint), para que no aparezcan agujeros al moverse
        nearer = (d >= cuts[k + 1]).astype(np.uint8)
        fill = img if k == 3 else cv2.inpaint((img * 255).astype(np.uint8), cv2.dilate(nearer, np.ones((15, 15), np.uint8)), 9, cv2.INPAINT_TELEA).astype(np.float32) / 255
        a = cv2.GaussianBlur(m, (0, 0), 1.2) if k > 0 else np.ones_like(m)
        if k > 0: planes.append(np.dstack([fill, a]))
        else: planes.append(np.dstack([fill, np.ones_like(m)]))
    walk = f"{D}/clips/p5_walk.mp4"
    wk = clip_frames(walk, (640, 360), keyed=True) if os.path.exists(walk) else None
    still = load(f"{D}/layers/p5_walk_cut.png", size=(640, 360), alpha=True)
    fogs = [fbm(480, 270, 80 + k, base=3) for k in range(3)]
    rain = [(rng.random((n, 2)), sp, ln, wd, al) for n, sp, ln, wd, al in [(500, 1.6, 22, 1, 0.25), (160, 2.4, 60, 2, 0.30), (40, 3.4, 150, 5, 0.22)]]
    wr = Writer("s5_calle"); N = int(dur * FPS)
    for i in range(N):
        t = i / FPS; u = ease(t / dur)
        img_t = None
        for k, pl in enumerate(planes):
            par = [0.2, 0.45, 0.72, 1.0][k]                                       # cuánto se mueve cada plano
            L = xform(pl, 1.0 + 0.02 * u * par, dx=(40 - 110 * u) * par, dy=(-50 + 70 * u) * par)
            L = dof_rgba(L, [3.5, 1.5, 0.0, 2.0][k])
            img_t = L[..., :3] if img_t is None else over(img_t, L)
            if k == 1:                                                            # el personaje camina en el plano medio
                c = (wk[min(len(wk) - 1, int(i * len(wk) / N))].astype(np.float32) / 255) if wk is not None else still
                Ci = xform(c, 0.24, dx=150 - 120 * u + (40 - 110 * u) * 0.6, dy=150 + (-50 + 70 * u) * 0.6, out=(W, H))
                Ci = dof_rgba(Ci, 0.8); Ci[..., :3] *= 0.85
                img_t = over(img_t, Ci)
            if k < 3:                                                             # niebla entre planos
                fg_ = np.roll(cv2.resize(fogs[k], (W, H)), int(t * (12 + 10 * k) * S), 1)
                img_t = img_t + (np.clip(fg_ - 0.42, 0, 1) * 0.45)[..., None] * np.array([0.55, 0.62, 0.75]) * (0.5 - 0.12 * k)
        # lluvia en 3 capas (lejos fina, cerca gruesa y desenfocada)
        for (pts, sp, ln, wd, al) in rain:
            lay = np.zeros((H, W), np.float32)
            for x, y in pts:
                yy_ = ((y + t * sp) % 1.0) * (H + ln * S) - ln * S; xx_ = x * W + (yy_ * 0.08)
                cv2.line(lay, (int(xx_), int(yy_)), (int(xx_ + ln * 0.08 * S), int(yy_ + ln * S)), 1.0, max(1, int(wd * S)), cv2.LINE_AA)
            if wd > 3: lay = cv2.GaussianBlur(lay, (0, 0), 3 * S)
            img_t = img_t + (lay * al)[..., None] * np.array([0.75, 0.82, 0.95])
        # faroles: titileo de las llamas
        img_t = img_t * (1 + 0.04 * math.sin(t * 19) * (img_t.mean(-1, keepdims=True) > 0.8))
        wr.put(film(img_t, t, i, "night", halation=0.35))
    wr.close(); print("calle", wr.n)

# ------------------------------------------------------------------ 6 · MATCH-CUT (la colonia de moho se vuelve la luna)
def shot_match(dur=4.2):
    fr = clip_frames(f"{D}/../escena20/fx/s07_macro.mp4", (W, H), start=1.6)
    moon = load(f"{D}/layers/p6_moon.png", size=(int(W * 1.0), int(H * 1.0)))
    mcx, mcy, mr = 832 / 1664 * W, 303 / 928 * H, 274 / 1664 * W                # luna medida sobre la imagen
    last = fr[-1].astype(np.float32) / 255
    g = last[..., 1]; m = (g > last[..., 0] * 1.06) & (g > 0.45)
    ys, xs = np.nonzero(m); ccx, ccy = xs.mean(), ys.mean(); cr = math.sqrt(m.sum() / math.pi) * 1.25
    wr = Writer("s6_match"); N = int(dur * FPS); T1 = 1.6                            # cruce en 1.6 s
    for i in range(N):
        t = i / FPS
        if t < T1:
            f = fr[min(len(fr) - 1, int(t * 30))].astype(np.float32) / 255
            z = 1 + 0.35 * ease(t / T1)                                             # empuje hacia la colonia
            A = xform(f, z, cx=ccx, cy=ccy, dx=(W / 2 - ccx) * 0 , dy=0)
            # colonia en pantalla: centro (W/2 + (ccx-W/2)... ) con la escala z sobre su propio centro
            sc, scx, scy = cr * z, W / 2, H / 2
        u = ramp(t, T1 - 0.45, T1 + 0.35)
        # la luna arranca alineada con la colonia y se abre hasta su encuadre
        k = ramp(t, T1, dur - 0.3)
        zc = (cr * (1 + 0.35)) / mr
        zm = zc * (1 - k) + 1.0 * k
        cxm = mcx * (1 - k) + W / 2 * k; cym = mcy * (1 - k) + H / 2 * k
        Mo = xform(moon, zm, cx=cxm, cy=cym)
        if t < T1 + 0.4:
            fA = fr[min(len(fr) - 1, int(min(t, T1) * 30))].astype(np.float32) / 255
            A = xform(fA, 1 + 0.35 * ease(min(t, T1) / T1), cx=ccx, cy=ccy)
            im = A * (1 - u) + Mo * u
        else:
            im = Mo
        wr.put(film(im, t, i, "night", halation=0.3))
    wr.close(); print("match", wr.n)

if __name__ == "__main__":
    {"barra": shot_barra, "lab": shot_lab, "vertigo": shot_vertigo, "tormenta": shot_tormenta,
     "calle": shot_calle, "match": shot_match}[sys.argv[1]]()
