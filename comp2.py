# comp2.py — 12 componentes "nivel After Effects" del Tallador (todo por código sobre imágenes gratis de agnes)
#   r_doc3d      documento sobre el escritorio en ángulo rasante: tinta que se escribe en perspectiva + foco que barre el renglón
#   r_mapamesa   mapa sobre la mesa: hilo rojo de pin en pin con el foco siguiendo la punta del hilo
#   r_retrato    foto REAL del inventor dentro de un portarretratos de la escena + foco que pasa de la foto a la figura tallada
#   r_match      corte por forma: el fondo redondo del matraz se convierte en el reloj de pared
#   r_rail       línea de tiempo sobre un riel de tren a escala: carteles de estación que se enfocan al pasar
#   r_persiana   antes/después con persiana de luz
#   r_periodico  diario de época que gira y cae sobre la mesa del café
#   r_balanza    balanza: el foco salta de un plato al otro y la escena se mece
#   r_particulas el vapor del laboratorio forma la molécula y se deshace
#   (contador en el objeto y paso-a-través van como opciones de comp.r_depth2)
import os, math, subprocess, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
import cine, comp
from cine import W, H, S, load, xform, blur, dof_rgba, over, bokeh, fbm, film, warp_depth, depth_dof, godrays, ease, ramp
from comp import text_rgba, texto_entre, depthmap, keyed, tilt_shift, FONTS, M
FPS = 24

def font(k, px): return ImageFont.truetype(FONTS[k] if k in FONTS else k, max(8, int(px)))
def frame0(clip, w=W, h=H):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", clip, "-frames:v", "1", "-vf", f"scale={w}:{h}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(h, w, 3).astype(np.float32) / 255

def depth_norm(path, shape):
    d = cv2.resize(depthmap(path), (shape[1], shape[0])); lo, hi = np.percentile(d, 1), np.percentile(d, 99)
    return np.clip((d - lo) / (hi - lo + 1e-6), 0, 1)

def plane_render(tex, pitch, z0, cam, out=(W, H), f=None):
    """textura plana (h,w,c) acostada en el piso (y = +1) que se aleja de la cámara: devuelve imagen y profundidad sintética (0 lejos..1 cerca)"""
    f = f or W * 0.9; th, tw = tex.shape[:2]
    cx, cz, cy = cam
    def proj(u, v):                               # u en [-1,1] ancho, v en [0,1] largo (0 = cerca)
        X = u * 1.0; Z = z0 + v * 1.6 * pitch; Y = 0.25
        dz = Z - cz; return (out[0] / 2 + f * (X - cx) / dz, out[1] / 2 - out[1] * 0.30 + f * (Y - cy) / dz), dz
    (p00, d0), (p10, _), (p11, d1), (p01, _) = proj(-1, 1), proj(1, 1), proj(1, 0), proj(-1, 0)
    src = np.float32([[0, 0], [tw, 0], [tw, th], [0, th]]); dst = np.float32([p00, p10, p11, p01])
    Hm = cv2.getPerspectiveTransform(src, dst)
    img = cv2.warpPerspective(tex, Hm, out, flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,) * tex.shape[2])
    vv = cv2.warpPerspective(np.tile(np.linspace(0, 1, th, dtype=np.float32)[:, None], (1, tw)), Hm, out, borderValue=1.0)
    return img, Hm, vv                             # profundidad: arriba de la textura = lejos (0), abajo = cerca (1)

# ------------------------------------------------------------------ 1 · documento 3D
def r_doc3d(sh, sid, DUR, put):
    N = int(round(DUR * FPS))
    desk = load(f"{M}/img/{sh.get('desk', 'x_mesa')}.png", size=(1600, 1000))
    page = Image.open(f"{M}/{sh['page']}").convert("RGB")
    pw = 760; ph = int(page.height * pw / page.width)
    if ph > 960: page = page.crop((0, 0, page.width, int(page.width * 960 / pw))); ph = 960
    page = np.asarray(page.resize((pw, ph), Image.LANCZOS)).astype(np.float32) / 255
    g = page.mean(-1, keepdims=True); page = np.clip(g * np.array([0.98, 0.95, 0.88]) + 0.02, 0, 1)   # papel envejecido
    lines = sh.get("write", []); hf = font(f"{M}/fonts/Caveat.ttf", 64)
    px0, py0 = (1600 - pw) // 2, max(0, min(1000 - ph, (1000 - ph) // 2 + 20))
    hl = sh.get("highlight")                      # (x0,y0,x1,y1) fracción de la página
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        tex = desk.copy()
        # sombra suave de la hoja sobre el escritorio
        shd = np.zeros(tex.shape[:2], np.float32); cv2.rectangle(shd, (px0 + 14, py0 + 18), (px0 + pw + 14, py0 + ph + 18), 1, -1)
        tex *= (1 - cv2.GaussianBlur(shd, (0, 0), 14)[..., None] * 0.55)
        pg = page.copy()
        if lines:
            k = int(sum(len(l) for l in lines) * ramp(t, 0.3, DUR * 0.8)); acc = 0
            im = Image.new("RGBA", (pw, ph), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            for j, ln in enumerate(lines):
                s_ = ln[:max(0, k - acc)]; acc += len(ln)
                d.text((sh.get("x0", 70), 120 + j * 92), s_, font=hf, fill=(22, 30, 85, 235))
            L = np.asarray(im).astype(np.float32) / 255; pg = pg * (1 - L[..., 3:]) + L[..., :3] * L[..., 3:]
        if hl:
            a = ramp(t, DUR * 0.55, DUR * 0.85)
            x0, y0, x1, y1 = [int(v * s) for v, s in zip(hl, (pw, ph, pw, ph))]
            m = np.zeros((ph, pw), np.float32); cv2.rectangle(m, (x0, y0), (int(x0 + (x1 - x0) * a), y1), 1, -1)
            m = cv2.GaussianBlur(m, (0, 0), 2)[..., None]; pg = pg * (1 - m) + pg * np.array([1.0, 0.86, 0.42]) * m * 1.05
        tex[py0:py0 + ph, px0:px0 + pw] = pg
        # ventana de lectura que se desliza por la hoja, proyectada en un trapecio rasante que llena el cuadro
        scroll = keyed(u, sh.get("scroll", [(0, 0.0), (1, 0.35)]))
        wy0 = int(py0 - 40 + scroll * ph); wy1 = int(wy0 + ph * 0.62); wx0, wx1 = px0 - 120, px0 + pw + 120
        crop = tex[max(0, wy0):min(1000, wy1), max(0, wx0):min(1600, wx1)]
        chh, cww = crop.shape[:2]
        wt = W * (1.05 + 0.12 * u); wb = W * 2.4; yt = H * (0.02 - 0.04 * u)
        dst = np.float32([[W / 2 - wt / 2, yt], [W / 2 + wt / 2, yt], [W / 2 + wb / 2, H * 1.08], [W / 2 - wb / 2, H * 1.08]])
        Hm = cv2.getPerspectiveTransform(np.float32([[0, 0], [cww, 0], [cww, chh], [0, chh]]), dst)
        img = cv2.warpPerspective(crop, Hm, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        dsyn = cv2.warpPerspective(np.tile(np.linspace(0, 1, chh, dtype=np.float32)[:, None], (1, cww)), Hm, (W, H), borderMode=cv2.BORDER_REPLICATE)
        # el foco barre: sigue la línea que se escribe / la línea resaltada
        fz = keyed(u, sh.get("focus_keys", [(0, 0.55), (1, 0.55)]))
        img = depth_dof(img, dsyn, focus=fz, strength=24)
        img = img * (0.92 + 0.18 * np.exp(-((np.arange(W) - W * 0.45) / (W * 0.4)) ** 2)[None, :, None])     # charco de luz de lámpara
        put(film(img, t, i, "warm", halation=0.25))

# ------------------------------------------------------------------ 2 · mapa sobre la mesa
def r_mapamesa(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); d0 = depth_norm(path, img0.shape)
    pts = [(x * img0.shape[1], y * img0.shape[0]) for x, y in sh["pins"]]
    def _lb(k, lb):                                              # etiqueta: "TEXTO" o ["TEXTO", dx, dy] (fracción del cuadro)
        t_, dx_, dy_ = (lb, 0.0, -0.035) if isinstance(lb, str) else lb
        return text_rgba(img0.shape[1], img0.shape[0], t_, "SC", sh.get("label_size", 30), (pts[k][0] / img0.shape[1] + dx_, pts[k][1] / img0.shape[0] + dy_), (250, 244, 232), 0.06)
    LB = [_lb(k, lb) for k, lb in enumerate(sh.get("labels", []))]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        im, dd = warp_depth(img0, d0, 1.0 + 0.16 * u, 1.0 + 0.05 * u, dx_near=-50 * u * S, focal=(0.5, 0.6))
        pr = ramp(t, DUR * 0.1, DUR * 0.85) * (len(pts) - 1); kseg = min(int(pr), len(pts) - 2); fr_ = pr - kseg
        tip = (pts[kseg][0] + (pts[kseg + 1][0] - pts[kseg][0]) * fr_, pts[kseg][1] + (pts[kseg + 1][1] - pts[kseg][1]) * fr_)
        lay = np.zeros(d0.shape, np.float32)
        poly = pts[:kseg + 1] + [tip]
        pairs = list(zip(poly, poly[1:]))
        if sh.get("radial"):                         # abanico: cada hilo sale del primer pin (p. ej. telegramas desde una ciudad)
            pairs = [(pts[0], p_) for p_ in pts[1:kseg + 1]] + [(pts[0], (pts[kseg][0] + (pts[kseg + 1][0] - pts[kseg][0]) * 0, 0)) ][:0]
            if kseg + 1 < len(pts): pairs.append((pts[0], (pts[0][0] + (pts[kseg + 1][0] - pts[0][0]) * fr_, pts[0][1] + (pts[kseg + 1][1] - pts[0][1]) * fr_)))
            tip = pairs[-1][1] if pairs else pts[0]
        for a_, b_ in pairs:                         # hilo con una leve curva (cuelga)
            arc = 14 if not sh.get("radial") else -0.18 * math.hypot(b_[0] - a_[0], b_[1] - a_[1])     # en abanico: arcos que suben
            seg = [(a_[0] + (b_[0] - a_[0]) * q, a_[1] + (b_[1] - a_[1]) * q + math.sin(q * math.pi) * arc) for q in np.linspace(0, 1, 24)]
            cv2.polylines(lay, [np.int32(seg)], False, 1.0, 3, cv2.LINE_AA)
        for k_, p_ in enumerate(pts[:kseg + 1 + (1 if fr_ > 0.95 else 0)]):
            cv2.circle(lay, (int(p_[0]), int(p_[1])), 9, 1.0, -1, cv2.LINE_AA)
        lw, _ = warp_depth(np.dstack([lay] * 3), d0, 1.0 + 0.16 * u, 1.0 + 0.05 * u, dx_near=-50 * u * S, focal=(0.5, 0.6))
        lw = lw[..., 0]
        for k_, T_ in enumerate(LB):
            a_ = ramp(pr, k_ - 0.15, k_ + 0.05) if k_ else ramp(t, 0.2, 0.7)
            if a_ <= 0: continue
            Tw = np.dstack([warp_depth(T_[..., c], d0, 1.0 + 0.16 * u, 1.0 + 0.05 * u, dx_near=-50 * u * S, focal=(0.5, 0.6))[0] for c in range(4)])
            Tw[..., 3] *= a_; sh_ = cv2.GaussianBlur(Tw[..., 3], (0, 0), 3); im = im * (1 - sh_[..., None] * 0.55)
            im = over(im, Tw)
        im = im * (1 - lw[..., None] * 0.85) + lw[..., None] * np.array([0.78, 0.08, 0.06]) + cv2.GaussianBlur(lw, (0, 0), 6)[..., None] * np.array([0.5, 0.06, 0.03])
        ty, tx = int(min(d0.shape[0] - 1, tip[1])), int(min(d0.shape[1] - 1, tip[0]))
        focus = float(np.median(d0[max(0, ty - 12):ty + 12, max(0, tx - 12):tx + 12]))
        im = depth_dof(im, dd, focus=focus, strength=24)
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        put(film(im, t, i, "warm", halation=0.28))

# ------------------------------------------------------------------ 3 · el retrato real en la escena
def find_card(img):
    """el cartón blanco del portarretratos: el cuadrilátero claro más grande"""
    g = (img.mean(-1) * 255).astype(np.uint8); _, th = cv2.threshold(g, int(np.percentile(g, 93)), 255, cv2.THRESH_BINARY)
    th = cv2.morphologyEx(th, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    cs, _ = cv2.findContours(th, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE); c = max(cs, key=cv2.contourArea)
    q = cv2.approxPolyDP(c, 0.03 * cv2.arcLength(c, True), True).reshape(-1, 2)
    if len(q) != 4: x, y, w, h = cv2.boundingRect(c); q = np.array([[x, y], [x + w, y], [x + w, y + h], [x, y + h]])
    s = q.sum(1); df = np.diff(q, axis=1).ravel()
    return np.float32([q[np.argmin(s)], q[np.argmin(df)], q[np.argmax(s)], q[np.argmax(df)]])
def r_retrato(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); d0 = depth_norm(path, img0.shape)
    # esquinas del cartón: medidas a mano (sh['card'] = 4 puntos en fracción, sentido horario desde arriba-izq) o detectadas
    quad = np.float32([(x * img0.shape[1], y * img0.shape[0]) for x, y in sh['card']]) if sh.get('card') else find_card(img0)
    ph = Image.open(f"{M}/{sh['photo']}").convert("L")
    qw = int(np.linalg.norm(quad[1] - quad[0])); qh = int(np.linalg.norm(quad[3] - quad[0]))
    pw_, ph_ = ph.size; r = qw / qh
    if pw_ / ph_ > r: nw = int(ph_ * r); ph = ph.crop(((pw_ - nw) // 2, 0, (pw_ - nw) // 2 + nw, ph_))
    else: nh = int(pw_ / r); ph = ph.crop((0, 0, pw_, nh))
    phot = np.asarray(ph.resize((qw * 2, qh * 2), Image.LANCZOS)).astype(np.float32)[..., None] / 255
    phot = np.clip(phot * np.array([1.02, 0.96, 0.86]) * 0.92 + 0.03, 0, 1)                      # copia en plata, tono cálido
    Hm = cv2.getPerspectiveTransform(np.float32([[0, 0], [qw * 2, 0], [qw * 2, qh * 2], [0, qh * 2]]), quad)
    pl = cv2.warpPerspective(phot, Hm, (img0.shape[1], img0.shape[0])); m = cv2.warpPerspective(np.ones((qh * 2, qw * 2), np.float32), Hm, (img0.shape[1], img0.shape[0]))
    m = cv2.erode(m, np.ones((3, 3), np.uint8)); m = cv2.GaussianBlur(m, (0, 0), 0.8)[..., None]
    shade = (cv2.GaussianBlur(img0.mean(-1), (0, 0), 25) / max(1e-3, float(img0.mean())))[..., None]      # la luz de la escena cae sobre la foto
    base = img0 * (1 - m) + pl * np.clip(shade, 0.6, 1.3) * m
    fdepth = float(np.median(d0[m[..., 0] > 0.5])); bdepth = float(np.percentile(d0, 30))
    P = np.random.default_rng(9).random((260, 3)).astype(np.float32)
    lum = img0.mean(-1); lm = (lum > np.percentile(lum, 98)).astype(np.float32); ys, xs = np.nonzero(lm); src = (xs.mean(), ys.mean()) if len(xs) else (0, 0)
    top, bot = sh.get("label", ("", ""))
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        im, dd = warp_depth(base, d0, 1.0 + 0.12 * u, 1.0 + 0.04 * u, dx_near=-30 * u * S, focal=(0.6, 0.5))
        f = keyed(u, [(0, fdepth), (0.55, fdepth), (0.9, bdepth), (1, bdepth)])
        im = depth_dof(im, dd, focus=f, strength=22)
        lw, _ = warp_depth(np.dstack([lm] * 3), d0, 1.0 + 0.12 * u, 1.0 + 0.04 * u, dx_near=-30 * u * S, focal=(0.6, 0.5))
        im, rays = godrays(im, src, lw[..., 0] * 0.8, length=1.3, gain=0.28, tint=(1.0, 0.92, 0.78))
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA); rays = cv2.resize(rays, (W, H))
        P[:, :2] += np.array([0.0004, 0.0009]); P[:, :2] %= 1
        lay = np.zeros((H, W), np.float32)
        for x, y, z in P: cv2.circle(lay, (int(x * W), int(y * H)), max(1, int((0.8 + 3.5 * z * z) * S)), 1.0, -1, cv2.LINE_AA)
        im = im + (cv2.GaussianBlur(lay, (0, 0), 1.4 * S) * (0.08 + rays * 3))[..., None] * np.array([1, 0.92, 0.78])
        a = ramp(t, 0.5, 1.2) * (1 - ramp(t, DUR - 0.6, DUR - 0.1))
        if top: im = over(im, comp.text_rgba(W, H, top, "PF", 54, (0.07, 0.80), (250, 245, 235), anchor="lm") * np.array([1, 1, 1, a]))
        if bot: im = over(im, comp.text_rgba(W, H, bot, "SC", 34, (0.07, 0.86), (230, 220, 200), anchor="lm") * np.array([1, 1, 1, a]))
        put(film(im, t, i, "warm", halation=0.25))

# ------------------------------------------------------------------ 5 · corte por forma (matraz -> reloj)
def find_circle(img, hint=None):
    g = cv2.GaussianBlur((img.mean(-1) * 255).astype(np.uint8), (0, 0), 2)
    c = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, 1.4, 60, param1=110, param2=40, minRadius=int(img.shape[0] * 0.03), maxRadius=int(img.shape[0] * 0.25))
    if c is None: return hint
    c = c[0]
    if hint: c = sorted(c, key=lambda q: (q[0] - hint[0]) ** 2 + (q[1] - hint[1]) ** 2)
    return tuple(float(v) for v in c[0])
def r_match(sh, sid, DUR, put):
    N = int(round(DUR * FPS))
    A = load(f"{M}/img/{sh['from']}.png", size=(W, H)); B = load(f"{M}/img/{sh['to']}.png", size=(W, H))
    fx_ = sh.get("from_xy"); ca = (fx_[0] * W, fx_[1] * H, fx_[2] * H) if fx_ else find_circle(A)
    th_ = sh.get("to_hint"); tx_ = sh.get("to_xy")
    cb = (tx_[0] * W, tx_[1] * H, tx_[2] * H) if tx_ else find_circle(B, (th_[0] * W, th_[1] * H) if th_ else None)
    ra, rb = ca[2], cb[2]
    T1 = sh.get("cut", 0.45)
    for i in range(N):
        t = i / FPS
        if t < T1 + 0.3:
            za = 1.0 * (H * 0.42 / ra) * (1 + 0.15 * ramp(t, 0, T1 + 0.3))
            ia = cv2.warpAffine(A, np.float32([[za, 0, W / 2 - za * ca[0]], [0, za, H / 2 - za * ca[1]]]), (W, H), borderMode=cv2.BORDER_REFLECT)
        k = ramp(t, T1, DUR * 0.9)
        zb = (H * 0.42 / rb) * (1 - ease(k)) + 1.0 * ease(k)
        cxb = cb[0] * (1 - ease(k)) + W / 2 * ease(k); cyb = cb[1] * (1 - ease(k)) + H / 2 * ease(k)
        ib = cv2.warpAffine(B, np.float32([[zb, 0, W / 2 - zb * cxb], [0, zb, H / 2 - zb * cyb]]), (W, H), borderMode=cv2.BORDER_REFLECT)
        mix = ramp(t, T1 - 0.2, T1 + 0.3)
        img = ib if t >= T1 + 0.3 else ia * (1 - mix) + ib * mix
        img = blur(img, 6 * (1 - ramp(t, T1 + 0.2, T1 + 1.2)))                           # la lente vuelve a enfocar después del cruce
        put(film(img, t, i, "night", halation=0.3))

# ------------------------------------------------------------------ 8 · riel de tren
def board(year, label):
    w, h = 520, 300; im = Image.new("RGB", (w, h), (120, 82, 48)); d = ImageDraw.Draw(im)
    for y in range(0, h, 6): d.line([(0, y), (w, y + np.random.randint(-3, 3))], fill=(104 + np.random.randint(-10, 10), 70, 40), width=2)
    d.rectangle((8, 8, w - 8, h - 8), outline=(70, 44, 24), width=6)
    d.text((w / 2 + 2, 118), year, font=font("AN", 132), fill=(52, 30, 14), anchor="mm"); d.text((w / 2, 114), year, font=font("AN", 132), fill=(244, 214, 150), anchor="mm")
    d.text((w / 2, 228), label, font=font("SC", 34), fill=(250, 238, 215), anchor="mm")
    a = np.asarray(im).astype(np.float32) / 255; return np.dstack([a, np.ones((h, w), np.float32)])
def r_rail(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.1), int(H * 1.1))); d0 = depth_norm(path, img0.shape)
    TX = [board(s["year"], s["label"]) for s in sh["stations"]]; n = len(TX); f = W * 0.9; gap = 2.2
    pos = [(0.62 if k % 2 == 0 else -0.62, -0.05, 2.4 + gap * k) for k in range(n)]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        camz = (pos[-1][2] - 2.4) * u
        im, dd = warp_depth(img0, d0, 1.0 + 0.35 * u, 1.0 + 0.06 * u, focal=(0.5, 0.5))
        im = depth_dof(im, dd, focus=0.9, strength=14)
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        ahead = [p[2] - camz for p in pos if p[2] - camz > 1.6]; fd = min(ahead) if ahead else 2.4
        for k in sorted(range(n), key=lambda k: -(pos[k][2] - camz)):
            x, y, z = pos[k]; dz = z - camz
            if dz < 0.4: continue
            cw, ch = 0.9, 0.52; yaw = -0.5 if x > 0 else 0.5
            cs = []
            for sx, sy in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                px = x + sx * cw / 2 * math.cos(yaw); pz = z + sx * cw / 2 * math.sin(yaw); py = y + sy * ch / 2; dzz = pz - camz
                cs.append((W / 2 + f * px / dzz, H / 2 + f * py / dzz))
            tex = TX[k]; th, tw = tex.shape[:2]
            L = cv2.warpPerspective(tex, cv2.getPerspectiveTransform(np.float32([[0, 0], [tw, 0], [tw, th], [0, th]]), np.float32(cs)), (W, H), borderValue=(0, 0, 0, 0))
            # poste
            px0 = int((cs[2][0] + cs[3][0]) / 2); py0 = int((cs[2][1] + cs[3][1]) / 2); py1 = int(H / 2 + f * 0.55 / dz)
            post = np.zeros((H, W, 4), np.float32); cv2.line(post, (px0, py0), (px0, py1), (0.25, 0.16, 0.09, 1), max(2, int(28 / dz)))
            L = over(post, L) if False else L
            img_l = dof_rgba(L, min(14, abs(dz - fd) * 3.0)); post = dof_rgba(post, min(14, abs(dz - fd) * 3.0))
            im = over(im, post); im = over(im, img_l)
        put(film(im, t, i, "warm", halation=0.3))

# ------------------------------------------------------------------ 9 · persiana antes/después
def r_persiana(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); A = load(f"{M}/img/{sh['before']}.png", size=(int(W * 1.06), int(H * 1.06))); B = load(f"{M}/img/{sh['after']}.png", size=(int(W * 1.06), int(H * 1.06)))
    nsl = 14
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        a = xform(A, 1.0 + 0.04 * u); b = xform(B, 1.0 + 0.04 * u)
        img = a.copy(); xs = np.arange(W)
        for k in range(nsl):
            x0, x1 = int(W * k / nsl), int(W * (k + 1) / nsl)
            p = ramp(t, DUR * (0.22 + 0.025 * k), DUR * (0.42 + 0.025 * k))          # cada lama gira con un poco de retraso
            if p <= 0: continue
            wv = (x1 - x0); edge = int(x0 + wv * p)
            img[:, x0:edge] = b[:, x0:edge]
            if 0 < p < 1:                                                               # filo de luz en la lama que gira
                e0 = max(x0, edge - int(10 * S)); img[:, e0:edge] = img[:, e0:edge] * 0.6 + 0.55
                img[:, x0:edge] *= (0.75 + 0.25 * p)
        la = 1 - ramp(t, DUR * 0.25, DUR * 0.45); lb = ramp(t, DUR * 0.62, DUR * 0.8)
        img = over(img, comp.text_rgba(W, H, sh.get("lab_a", "1950"), "AN", 120, (0.06, 0.86), (250, 245, 235), anchor="lm") * np.array([1, 1, 1, la]))
        img = over(img, comp.text_rgba(W, H, sh.get("lab_b", "HOY"), "AN", 120, (0.94, 0.86), (250, 245, 235), anchor="rm") * np.array([1, 1, 1, lb]))
        put(film(img, t, i, "warm", halation=0.22))

# ------------------------------------------------------------------ 11 · el periódico
def newspaper(head, sub, date, masthead="EL HERALDO"):
    w, h = 900, 1200; im = Image.new("RGB", (w, h), (232, 225, 205)); d = ImageDraw.Draw(im)
    mf = font("PF", 96)
    while d.textlength(masthead, font=mf) > w - 60: mf = font("PF", mf.size - 4)
    d.text((w / 2, 70), masthead, font=mf, fill=(25, 22, 20), anchor="mm")
    d.line([(40, 130), (w - 40, 130)], fill=(25, 22, 20), width=4); d.text((w / 2, 152), date, font=font("SC", 28), fill=(40, 36, 32), anchor="mm")
    d.line([(40, 175), (w - 40, 175)], fill=(25, 22, 20), width=2)
    y = 210
    for ln in head:
        hf = font("AN", 92)
        while d.textlength(ln, font=hf) > w - 70: hf = font("AN", hf.size - 3)
        d.text((w / 2, y), ln, font=hf, fill=(18, 16, 14), anchor="ma"); y += 104
    d.text((w / 2, y + 10), sub, font=font("PF", 34), fill=(40, 36, 32), anchor="ma"); y += 80
    rng = np.random.default_rng(4)
    for col in range(3):
        x0 = 50 + col * 275; yy = y + 20
        d.rectangle((x0, yy, x0 + 245, yy + 160), fill=(150, 145, 135)) if col == 1 else None
        yy += 180 if col == 1 else 0
        while yy < h - 50:
            d.line([(x0, yy), (x0 + rng.integers(170, 245), yy)], fill=(95, 90, 82), width=6); yy += 18
    a = np.asarray(im).astype(np.float32) / 255; return np.dstack([a, np.ones((h, w), np.float32)])
def r_periodico(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); bgp = f"{M}/img/{sh['src']}.png"
    bg = load(bgp, size=(int(W * 1.06), int(H * 1.06))); NP = newspaper(sh["head"], sh["sub"], sh["date"], sh.get("masthead", "EL HERALDO")); nh, nw = NP.shape[:2]
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        land = ramp(t, 0, DUR * 0.38); el = ease(land)
        ang = (1 - el) * 900                                    # gira 2,5 vueltas y frena
        sc = (2.6 * (1 - el) + 0.62 * el) * (1 + 0.15 * ramp(t, DUR * 0.45, DUR))
        tilt = 0.55 * el                                        # se acuesta sobre la mesa (perspectiva)
        cx, cy = W * 0.5, H * (0.50 + 0.10 * el)
        M2 = cv2.getRotationMatrix2D((nw / 2, nh / 2), ang + (-8 * el), 1)
        corners = np.float32([[0, 0], [nw, 0], [nw, nh], [0, nh]]); c2 = cv2.transform(corners[None], M2)[0]
        c2 = (c2 - [nw / 2, nh / 2]) * sc * (H / nh)
        c2[:, 1] *= (1 - 0.45 * tilt); c2[:, 0] *= (1 + 0.25 * tilt * (c2[:, 1] / (H / 2)))
        dst = np.float32(c2 + [cx, cy])
        L = cv2.warpPerspective(NP, cv2.getPerspectiveTransform(corners, dst), (W, H), borderValue=(0, 0, 0, 0))
        b = blur(xform(bg, 1.02 + 0.04 * u), 6 + 4 * el)
        shd = cv2.GaussianBlur(L[..., 3], (0, 0), 18 * S); shd = np.roll(shd, (int(20 * S * el), int(16 * S * el)), (0, 1))
        b = b * (1 - shd[..., None] * 0.45 * el)
        L = dof_rgba(L, 8 * (1 - ramp(t, DUR * 0.3, DUR * 0.45)))                     # desenfoque de movimiento mientras gira
        img = over(b, L)
        put(film(img, t, i, "warm", halation=0.22))

# ------------------------------------------------------------------ 10 · balanza (foco espacial que salta de plato en plato)
def r_balanza(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); xs = np.arange(img0.shape[1])[None, :] / img0.shape[1]
    sharp = img0; soft = cv2.GaussianBlur(img0, (0, 0), 10 * S); soft = soft + (bokeh(soft, 22, thresh=0.7) - soft) * 0.5
    L, R = sh.get("plates", (0.27, 0.72))
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        c = keyed(u, [(0, L), (0.35, L), (0.6, R), (1, R)])
        m = np.exp(-((xs - c) / 0.17) ** 2)[..., None]
        im = soft * (1 - m) + sharp * m
        rot = 1.2 * math.sin(t * 1.6) * (1 - 0.5 * u)
        im = cv2.warpAffine(im, cv2.getRotationMatrix2D((im.shape[1] / 2, im.shape[0] * 0.55), rot, 1.0 + 0.05 * u), (im.shape[1], im.shape[0]), borderMode=cv2.BORDER_REFLECT)
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        put(film(im, t, i, "warm", halation=0.28))

# ------------------------------------------------------------------ 12 · partículas que forman la molécula
def r_particulas(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); d0 = depth_norm(path, img0.shape)
    import graf
    if sh.get("shape") == "gota":                                     # contorno de una gota
        cx_, cy_, r_ = W * 0.58, H * 0.48, 150 * S; pts_ = []
        for a in np.linspace(0, 2 * math.pi, 64):
            x = r_ * math.sin(a) * (1 - math.cos(a)) * 0.62 * 1.4; y = -r_ * math.cos(a) * 1.25
            pts_.append((cx_ + x * 0.9, cy_ + y))
        segs = list(zip(pts_, pts_[1:] + pts_[:1]))
    else:
        segs, _ = graf.steroid(W * 0.58, H * 0.42, 70 * S)
    tgt = []
    for a_, b_ in segs:
        for q in np.linspace(0, 1, 14, endpoint=False): tgt.append((a_[0] + (b_[0] - a_[0]) * q, a_[1] + (b_[1] - a_[1]) * q))
    tgt = np.float32(tgt); n = len(tgt); g = np.random.default_rng(2)
    start = np.float32(np.c_[g.normal(W * 0.32, 60 * S, n), g.normal(H * 0.85, 40 * S, n)])     # sale de la columna de destilación
    wob = g.random((n, 2)).astype(np.float32) * 6.28
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        im, dd = warp_depth(img0, d0, 1.0 + 0.08 * u, 1.0 + 0.02 * u, focal=(0.4, 0.6))
        im = depth_dof(im, dd, focus=float(np.percentile(d0, 85)), strength=16)
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA) * 0.85
        form = ease(ramp(t, DUR * 0.15, DUR * 0.55)); go = ease(ramp(t, DUR * 0.78, DUR))
        p = start * (1 - form) + tgt * form
        p[:, 0] += np.sin(t * 2.3 + wob[:, 0]) * 18 * S * (1 - form) + go * (g.normal(0, 1, n) * 0 + np.cos(wob[:, 1]) * 260 * S)
        p[:, 1] += np.cos(t * 1.9 + wob[:, 1]) * 18 * S * (1 - form) - go * (120 + 200 * np.sin(wob[:, 0]) ** 2) * S
        lay = np.zeros((H, W), np.float32)
        for (x, y) in p:
            if 0 <= x < W and 0 <= y < H: cv2.circle(lay, (int(x * 4), int(y * 4)), int(4.5 * S * 4), 1.0, -1, cv2.LINE_AA, shift=2)
        if form > 0.85 and go < 0.2:                                               # en el instante formado, las aristas se encienden
            ln = np.zeros((H, W), np.float32)
            for a_, b_ in segs: cv2.line(ln, (int(a_[0]), int(a_[1])), (int(b_[0]), int(b_[1])), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
            lay = np.maximum(lay, ln * (form - 0.85) / 0.15 * (1 - go * 5))
        glow = cv2.GaussianBlur(lay, (0, 0), 7 * S); core = cv2.GaussianBlur(lay, (0, 0), 1.2 * S)
        im = im + glow[..., None] * np.array([1.0, 0.7, 0.3]) * 0.9 + core[..., None] * np.array([1.0, 0.92, 0.75]) * 0.9
        put(film(im, t, i, "warm", halation=0.35))
