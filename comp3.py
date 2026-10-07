# comp3.py — componentes nuevos del Tallador (tgagote, oct-2026)
#   r_fotolupa  la FOTO REAL de archivo apoyada sobre el escritorio; una lupa de bronce la recorre y se detiene en el detalle (target)
#   r_flujo     la sangre (o cualquier líquido) avanza por un tubo de la escena, con pulsos; el foco y la cámara siguen la punta
import os, math, numpy as np, cv2
from PIL import Image
from cine import W, H, S, load, xform, blur, over, film, warp_depth, depth_dof, ease, ramp
from comp import text_rgba, keyed, depthmap, M
FPS = 24

# ------------------------------------------------------------------ lupa sobre la foto de archivo
def _print_on_desk(photo, desk):
    """arma el cuadro base: la copia en papel (borde blanco, tono plata) apoyada sobre el escritorio con sombra. Devuelve (img, rect de la foto)"""
    im = Image.open(photo).convert("L"); iw, ih = im.size
    ph = int(H * 0.80); pw = int(iw * ph / ih)
    if pw > W * 0.86: pw = int(W * 0.86); ph = int(ih * pw / iw)
    g = np.asarray(im.resize((pw, ph), Image.LANCZOS)).astype(np.float32)[..., None] / 255
    g = np.clip(g * np.array([1.02, 0.97, 0.88]) * 0.95 + 0.03, 0, 1)                      # copia en plata, apenas cálida
    b = int(ph * 0.035); card = np.ones((ph + 2 * b, pw + 2 * b, 3), np.float32) * np.array([0.93, 0.91, 0.86])
    card[b:b + ph, b:b + pw] = g
    base = desk.copy(); ch, cw = card.shape[:2]; x0, y0 = (W - cw) // 2, (H - ch) // 2
    shd = np.zeros((H, W), np.float32); cv2.rectangle(shd, (x0 + int(14 * S), y0 + int(20 * S)), (x0 + cw + int(14 * S), y0 + ch + int(20 * S)), 1, -1)
    base = base * (1 - cv2.GaussianBlur(shd, (0, 0), 18 * S)[..., None] * 0.6)
    base[y0:y0 + ch, x0:x0 + cw] = card
    return base, (x0 + b, y0 + b, pw, ph)

def r_fotolupa(sh, sid, DUR, put):
    N = int(round(DUR * FPS))
    desk = load(f"{M}/img/{sh.get('desk', 'x_mesa')}.png", size=(W, H)) * 0.55
    base, (px, py, pw, ph) = _print_on_desk(f"{M}/{sh['photo']}", desk)
    tx, ty = sh.get("target", (0.5, 0.5)); sx, sy = sh.get("start", (0.30, 0.30))
    T = (px + tx * pw, py + ty * ph); S0 = (px + sx * pw, py + sy * ph)
    R = sh.get("radius", 0.13) * H; zoomk = sh.get("zoom", 2.1)
    top, bot = sh.get("label", ("", ""))
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        # empuje lento hacia el detalle
        z = 1.0 + 0.10 * u; cx = W / 2 + (T[0] - W / 2) * 0.35 * u; cy = H / 2 + (T[1] - H / 2) * 0.35 * u
        Mx = np.float32([[z, 0, W / 2 - z * cx], [0, z, H / 2 - z * cy]])
        img = cv2.warpAffine(base, Mx, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        # la lupa: entra, recorre y se detiene en el objetivo al 62 %
        k = ease(ramp(t, 0.25, DUR * 0.62)); wob = (1 - k) * 18 * S
        lx = S0[0] + (T[0] - S0[0]) * k + math.sin(t * 2.1) * wob; ly = S0[1] + (T[1] - S0[1]) * k + math.cos(t * 1.7) * wob
        Lx, Ly = z * lx + W / 2 - z * cx, z * ly + H / 2 - z * cy
        ain = ramp(t, 0.0, 0.5)
        # foco de luz que sigue a la lupa
        d2 = ((xx - Lx) ** 2 + (yy - Ly) ** 2) / (R * 2.4) ** 2
        img = img * (1 - 0.35 * ain * np.clip(d2, 0, 1))[..., None]
        # sombra de la lupa sobre el papel
        shd = np.zeros((H, W), np.float32); cv2.circle(shd, (int(Lx + 26 * S), int(Ly + 34 * S)), int(R * 1.08), 1, int(22 * S), cv2.LINE_AA)
        img = img * (1 - cv2.GaussianBlur(shd, (0, 0), 14 * S)[..., None] * 0.45 * ain)
        # vidrio: aumento con leve barril
        r = np.sqrt((xx - Lx) ** 2 + (yy - Ly) ** 2) / R
        zz = zoomk * (1 + 0.12 * r ** 2) * (0.6 + 0.4 * ain) + 1 * (1 - ain) * 0
        mx = Lx + (xx - Lx) / zz; my = Ly + (yy - Ly) / zz
        mag = cv2.remap(img, mx, my, cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        m = np.clip((1 - r) * R / (2 * S), 0, 1)[..., None] * ain
        img = img * (1 - m) + mag * m * 1.04
        # aro de bronce + reflejo
        rim = np.zeros((H, W), np.float32); cv2.circle(rim, (int(Lx), int(Ly)), int(R + 8 * S), 1, max(2, int(15 * S)), cv2.LINE_AA)
        rim = cv2.GaussianBlur(rim, (0, 0), 1.2 * S)[..., None] * ain
        shade = 0.75 + 0.35 * np.clip((Ly - yy) / R, -1, 1)[..., None]
        img = img * (1 - rim) + rim * np.array([0.70, 0.52, 0.24]) * shade
        gl = np.zeros((H, W), np.float32); cv2.ellipse(gl, (int(Lx - R * 0.38), int(Ly - R * 0.42)), (int(R * 0.34), int(R * 0.13)), -32, 0, 360, 1, -1, cv2.LINE_AA)
        img = img + cv2.GaussianBlur(gl, (0, 0), 9 * S)[..., None] * 0.22 * ain
        # anillo rojo que marca el detalle cuando la lupa llega
        hr = ramp(t, DUR * 0.66, DUR * 0.8)
        if hr > 0:
            ring = np.zeros((H, W), np.float32)
            cv2.ellipse(ring, (int(Lx), int(Ly)), (int(R * 0.55), int(R * 0.55)), -90, 0, 360 * hr, 1, max(2, int(5 * S)), cv2.LINE_AA)
            ring = cv2.GaussianBlur(ring, (0, 0), 1.0 * S)
            img = img * (1 - ring[..., None] * 0.9) + ring[..., None] * np.array([0.85, 0.12, 0.08])
        a = ramp(t, 0.6, 1.3) * (1 - ramp(t, DUR - 0.6, DUR - 0.1))
        if a > 0:                                                    # banda oscura para que el rótulo se lea sobre la foto
            band = np.clip((yy / H - 0.74) / 0.12, 0, 1)[..., None]; img = img * (1 - 0.62 * a * band)
        if top: img = over(img, text_rgba(W, H, top, "PF", 58, (0.06, 0.865), (250, 245, 235), anchor="lm") * np.array([1, 1, 1, a]))
        if bot: img = over(img, text_rgba(W, H, bot, "SC", 34, (0.06, 0.925), (236, 226, 206), anchor="lm") * np.array([1, 1, 1, a]))
        put(film(img, t, i, "warm", halation=0.18))

# ------------------------------------------------------------------ líquido que corre por el tubo
def _poly_len(P):
    d = np.hypot(np.diff(P[:, 0]), np.diff(P[:, 1])); return np.r_[0, np.cumsum(d)]
def _smooth_path(pts, n=240):
    P = np.float32(pts)
    if len(P) < 3: return np.float32([P[0] + (P[-1] - P[0]) * q for q in np.linspace(0, 1, n)])
    out = []                                                    # Catmull-Rom
    Q = np.vstack([P[0], P, P[-1]])
    for j in range(1, len(Q) - 2):
        p0, p1, p2, p3 = Q[j - 1], Q[j], Q[j + 1], Q[j + 2]
        for s in np.linspace(0, 1, n // (len(P) - 1), endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s * s + (-p0 + 3 * p1 - 3 * p2 + p3) * s ** 3))
    out.append(P[-1]); return np.float32(out)

def r_flujo(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh['src']}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); h0, w0 = img0.shape[:2]
    d0 = cv2.resize(depthmap(path), (w0, h0)); lo, hi = np.percentile(d0, 1), np.percentile(d0, 99); d0 = np.clip((d0 - lo) / (hi - lo + 1e-6), 0, 1)
    P = _smooth_path([(x * w0, y * h0) for x, y in sh["path"]]); L = _poly_len(P); tot = L[-1]
    col = np.array(sh.get("color", (0.42, 0.02, 0.03))); th = sh.get("width", 0.007) * w0
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        pr = ease(ramp(t, DUR * 0.08, DUR * 0.78)); n = max(2, int(np.searchsorted(L, pr * tot)))
        tip = P[min(n, len(P) - 1)]
        lay = np.zeros((h0, w0), np.float32); hl = np.zeros((h0, w0), np.float32); beads = np.zeros((h0, w0), np.float32)
        cv2.polylines(lay, [np.int32(P[:n] * 4)], False, 1.0, max(2, int(th)), cv2.LINE_AA, shift=2)
        cv2.polylines(hl, [np.int32((P[:n] + [-th * 0.22, -th * 0.22]) * 4)], False, 1.0, max(1, int(th * 0.25)), cv2.LINE_AA, shift=2)
        for b in range(6):                                       # pulsos que bajan por el tubo
            q = ((t * 0.35 + b / 6) % 1.0) * pr * tot; j = min(len(P) - 1, int(np.searchsorted(L, q)))
            cv2.circle(beads, (int(P[j][0] * 4), int(P[j][1] * 4)), int(th * 0.7 * 4), 1.0, -1, cv2.LINE_AA, shift=2)
        cv2.circle(lay, (int(tip[0] * 4), int(tip[1] * 4)), int(th * 0.75 * 4), 1.0, -1, cv2.LINE_AA, shift=2)
        lay = cv2.GaussianBlur(lay, (0, 0), 0.8); hl = cv2.GaussianBlur(hl, (0, 0), 0.8) * lay; beads = cv2.GaussianBlur(beads, (0, 0), th * 0.4) * lay
        base = img0 * (1 - lay[..., None] * 0.92) + lay[..., None] * col + hl[..., None] * np.array([0.9, 0.55, 0.5]) * 0.55 + beads[..., None] * np.array([0.35, 0.03, 0.03])
        glow = cv2.GaussianBlur(lay, (0, 0), th * 1.6)
        base = base + glow[..., None] * np.array([0.25, 0.02, 0.01]) * 0.6
        # cámara contenida y punto focal FIJO: mover el focal o separar mucho cerca/lejos duplica el frasco (medido tgagote)
        im, dd = warp_depth(base, d0, 1.0 + 0.07 * u, 1.0 + 0.04 * u, focal=tuple(sh.get("focal", (0.5, 0.55))))
        ty, tx = int(min(h0 - 1, tip[1])), int(min(w0 - 1, tip[0]))
        f = float(np.median(d0[max(0, ty - 14):ty + 14, max(0, tx - 14):tx + 14]))
        im = depth_dof(im, dd, focus=f, strength=sh.get("strength", 20))
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        put(film(im, t, i, "warm", halation=0.26))
