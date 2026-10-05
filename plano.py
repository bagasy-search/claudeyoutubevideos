# plano.py — renderiza UN plano de tgpildora a planos/<id>.mp4 (1920x1080, 24 fps).
# uso: python plano.py <id> <dur_s> [--prev]
import sys, os, json, math, subprocess, numpy as np, cv2
sys.argv = [sys.argv[0]] + sys.argv[1:]
PREV = "--prev" in sys.argv
sys.path.insert(0, os.environ.get("TGP_CINE", "C:/Users/bauti/Downloads/cine"))
if PREV and "--prev" not in sys.argv: sys.argv.append("--prev")
import cine                                   # motor: xform, blur, dof_rgba, over, bokeh, fbm, film, warp_depth, depth_dof, godrays
from cine import W, H, S, load, xform, blur, dof_rgba, over, bokeh, fbm, film, warp_depth, depth_dof, godrays, ease, ramp
from PIL import Image, ImageDraw, ImageFont, ImageFilter
M = os.environ.get("TGP_M", "C:/Users/bauti/Downloads/miramontes"); FPS = 24
F_SC, F_PF, F_AN = f"{M}/fonts/CormorantSC.ttf", f"{M}/fonts/Playfair.ttf", f"{M}/fonts/Anton-Regular.ttf"
F_HAND = f"{M}/fonts/Caveat.ttf"
SHOTS = {s["id"]: s for s in json.load(open(f"{M}/shots.json", encoding="utf8"))}
sid, DUR = sys.argv[1], float(sys.argv[2]); sh = SHOTS.get(sid, {"kind": "graf", "spec": sid})
N = max(1, int(round(DUR * FPS)))
rng = np.random.default_rng(abs(hash(sid)) % 2**32)
os.makedirs(f"{M}/planos", exist_ok=True)
OUT = f"{M}/planos/{sid}{'_prev' if PREV else ''}.mp4"

def writer():
    return subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
                             "-c:v", "libx264", "-crf", "16" if not PREV else "23", "-preset", "medium", "-pix_fmt", "yuv420p", OUT], stdin=subprocess.PIPE)
def put(p, img): p.stdin.write((np.clip(img, 0, 1) * 255).astype(np.uint8).tobytes())

def text_layer(lines, font, size, xy, color=(255, 255, 255), alpha=1.0, anchor="la", shadow=True, spacing=1.15):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    f = ImageFont.truetype(font, int(size * S)); x, y = xy
    for k, ln in enumerate(lines):
        yy = y + k * size * spacing * S
        if shadow: d.text((x + 2 * S, yy + 3 * S), ln, font=f, fill=(0, 0, 0, int(170 * alpha)), anchor=anchor)
        d.text((x, yy), ln, font=f, fill=(*color, int(255 * alpha)), anchor=anchor)
    a = np.asarray(im).astype(np.float32) / 255
    if shadow: pass
    return a

def lower_third(img, t, top, bottom):
    a = ramp(t, 0.4, 1.0) * (1 - ramp(t, DUR - 0.8, DUR - 0.2))
    if a <= 0: return img
    L = text_layer([top], F_SC, 46, (110 * S, H - 170 * S), alpha=a)
    img = over(img, L)
    img = over(img, text_layer([bottom], F_SC, 32, (110 * S, H - 105 * S), color=(230, 220, 200), alpha=a * 0.9))
    w_ = int(min(520, max(0, (t - 0.6) * 900)) * S); y0 = int(H - 118 * S)
    img[y0:y0 + max(1, int(2 * S)), int(112 * S):int(112 * S) + w_] = img[y0:y0 + max(1, int(2 * S)), int(112 * S):int(112 * S) + w_] * (1 - 0.7 * a) + 0.7 * a
    return img

def dust_layer(P, u, light=None):
    lay = np.zeros((H, W), np.float32)
    for (x, y, z) in P:
        sx = (0.5 + (x - 0.5) * (1 + 0.4 * z * u)) * W; sy = (0.5 + (y - 0.5) * (1 + 0.4 * z * u)) * H
        if 0 <= sx < W and 0 <= sy < H:
            cv2.circle(lay, (int(sx * 4), int(sy * 4)), max(1, int((0.8 + 4 * z * z) * S * 4)), 1.0, -1, cv2.LINE_AA, shift=2)
    lay = cv2.GaussianBlur(lay, (0, 0), 1.5 * S)
    return lay * (0.12 + (light * 3 if light is not None else 0.25))

def rain_overlay(img, t, strength=0.22):
    lay = np.zeros((H, W), np.float32); g = np.random.default_rng(7)
    for x, y, z in g.random((260, 3)):
        yy = ((y + t * (0.9 + 1.4 * z)) % 1.0) * H; xx = x * W
        cv2.line(lay, (int(xx), int(yy)), (int(xx + 3 * S), int(yy + (18 + 40 * z) * S)), 0.5 + 0.5 * z, max(1, int((1 + z) * S)), cv2.LINE_AA)
    lay = cv2.GaussianBlur(lay, (0, 0), 0.8 * S)
    return img + (lay * strength)[..., None] * np.array([0.75, 0.82, 0.95])

def steam_layer(base, t, region=None):
    n = cv2.resize(fbm(320, 180, 31), (W, H))
    n = np.roll(n, (int(-t * 45 * S), int(t * 6 * S)), (0, 1))
    m = np.clip(n - 0.48, 0, 1) * 1.6
    if region is not None: m *= region
    return base + m[..., None] * 0.22 * np.array([0.95, 0.95, 1.0])

def cutout(path):
    """recorte de utilería sobre negro: rembg (isnet) + caché"""
    cache = path.replace(".png", "_cut.png")
    if not os.path.exists(cache):
        from rembg import remove, new_session
        remove(Image.open(path).convert("RGB"), session=new_session("isnet-general-use"), post_process_mask=True).save(cache)
    return np.asarray(Image.open(cache).convert("RGBA")).astype(np.float32) / 255

def depthmap(path):
    cache = path.replace(".png", "_depth.npy")
    if not os.path.exists(cache):
        sys.path.insert(0, os.environ.get("TGP_CINE", "C:/Users/bauti/Downloads/cine")); import prep
        np.save(cache, prep.depth(path))
    return np.load(cache)

def apply_fx(img, t, i, u, fx, fgbox=None, P=None, rays=None):
    for f in fx:
        if f == "rain": img = rain_overlay(img, t)
        elif f == "dust" and P is not None:
            P[:, :2] += np.array([0.0006, -0.0003]) + rng.normal(0, 0.0007, (len(P), 2)); P[:, :2] %= 1
            img = img + dust_layer(P, u, rays)[..., None] * np.array([1.0, 0.92, 0.78])
        elif f == "steam": img = steam_layer(img, t)
        elif f.startswith("title:"):
            a, b = f[6:].split("|"); img = lower_third(img, t, a, b)
    return img

# ---------------------------------------------------------------- tipos
def r_clip():
    src = f"{M}/clips/{sid}.mp4"
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3); n = len(fr); p = writer()
    for i in range(N):
        t = i / FPS
        lim = int(sh.get("maxs", 99) * 30)
        k = min(n - 1, lim, int((i // 2) * 2 * 30 / FPS))                 # en dos
        img = fr[k].astype(np.float32) / 255
        hold = max(0, t - (min(n, lim) - 1) / 30)                               # si el momento es más largo, empuje lento sobre el último cuadro
        z = 1 + 0.012 * t / max(DUR, 1) + 0.02 * hold
        if z > 1.0005: img = cv2.warpAffine(img, cv2.getRotationMatrix2D((W / 2, H / 2), 0, z), (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        put(p, film(img, t, i, "warm" if "tallador" not in sid else "warm", halation=0.22))
    p.stdin.close(); p.wait()

def r_still():
    img0 = load(f"{M}/img/kf__{sid}.png", size=(int(W * 1.1), int(H * 1.1))); p = writer()
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        put(p, film(xform(img0, 1.0 + 0.05 * u), t, i, "warm"))
    p.stdin.close(); p.wait()

def r_multi():
    bg = load(f"{M}/img/{sid}_bg.png", size=(int(W * 1.12), int(H * 1.12)))
    fg = cutout(f"{M}/img/{sid}_fg.png"); fg = cv2.resize(fg, (int(W * 1.12), int(H * 1.12)), interpolation=cv2.INTER_AREA)
    fx = sh.get("fx", []); P = rng.random((300, 3)).astype(np.float32) if "dust" in fx else None
    if P is not None: P[:, 2] **= 0.7
    a_ = fg[..., 3]; ys, xs = np.nonzero(a_ > 0.5)
    box = (xs.min(), ys.min(), xs.max(), ys.max()) if len(xs) else (0, 0, fg.shape[1], fg.shape[0])
    p = writer(); mode = sh.get("focus", "fg2bg")
    hw_font = ImageFont.truetype(F_HAND, int(54 * S)) if "handwriting" in fx else None
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        f = ramp(t, DUR * 0.35, DUR * 0.62)
        if mode == "fg2bg": sF, sB = 14 * f, 11 * (1 - f) + 1
        elif mode == "bg2fg": sF, sB = 14 * (1 - f), 1 + 10 * f
        else: sF, sB = 0, 10
        B = xform(bg, 1.03 + 0.02 * u, dx=30 - 60 * u)
        fsc = sh.get("fgscale", 1.0); fdx, fdy = sh.get("fgpos", (0, 0))
        Fg = xform(fg, fsc * (1.0 + 0.05 * u), dx=-90 * u + 30 + fdx, dy=fdy)
        # escritura a mano sobre la página del cuaderno (aparece letra por letra)
        if hw_font is not None:
            txt = ["15 de octubre de 1951", "19-nor-17α-etinil-", "testosterona  ✓"]
            k = int(len("".join(txt)) * ramp(t, 0.4, DUR * 0.7)); im = Image.new("RGBA", (fg.shape[1], fg.shape[0]), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
            x0, y0 = box[0] + (box[2] - box[0]) * 0.18, box[1] + (box[3] - box[1]) * 0.22; acc = 0
            for j, ln in enumerate(txt):
                s_ = ln[:max(0, k - acc)]; acc += len(ln)
                d.text((x0, y0 + j * 70 * S), s_, font=hw_font, fill=(25, 30, 70, 235))
            hw = np.asarray(im.rotate(-4, resample=Image.BICUBIC, center=(x0, y0))).astype(np.float32) / 255
            hw[..., 3] *= fg[..., 3]
            fgm = fg.copy(); fgm[..., :3] = fgm[..., :3] * (1 - hw[..., 3:4]) + hw[..., :3] * hw[..., 3:4]
            Fg = xform(fgm, 1.0 + 0.05 * u, dx=-90 * u + 30)
        Bblur = blur(B, sB)
        amt = ease(min(max((sB - 1.5) / 7.0, 0.0), 1.0))          # el bokeh entra GRADUAL con el desenfoque (antes: de golpe en sB>2 y salto de radio en sB>4)
        Bb = Bblur + (bokeh(Bblur, 12 + 2.2 * sB, thresh=0.70) - Bblur) * amt if amt > 0 else Bblur
        if "lampon" in fx: Bb = Bb * (0.25 + 0.75 * ramp(t, 0.5, 1.4))
        if "fade_light" in fx: Bb = Bb * (1 - 0.55 * ramp(t, DUR * 0.4, DUR))
        img = over(Bb, dof_rgba(Fg, sF))
        if "lampon" in fx: img = img * (0.3 + 0.7 * ramp(t, 0.5, 1.4))
        if "fade_light" in fx: img = img * (1 - 0.35 * ramp(t, DUR * 0.4, DUR))
        if "glint" in fx:
            hi = (np.clip(Fg[..., :3].mean(-1) - 0.75, 0, 1) * Fg[..., 3]); g = cv2.GaussianBlur(hi, (0, 0), 6 * S)
            img = img + (g * (0.6 + 0.6 * math.sin(t * 6)))[..., None] * 1.2
        if "routes" in fx:
            o = (int(W * 0.24), int(H * 0.48)); dests = [(0.52, 0.34), (0.49, 0.30), (0.73, 0.40), (0.83, 0.62), (0.31, 0.72), (0.56, 0.56), (0.20, 0.33)]
            lay = np.zeros((H, W), np.float32)
            for k, (dx_, dy_) in enumerate(dests):
                pr = ramp(t, 0.3 + 0.25 * k, 1.6 + 0.25 * k)
                if pr <= 0: continue
                ex, ey = int(W * dx_), int(H * dy_); pts = []
                for q in np.linspace(0, pr, 40):
                    mx, my = (o[0] + ex) / 2, (o[1] + ey) / 2 - 0.12 * H
                    x = (1 - q) ** 2 * o[0] + 2 * (1 - q) * q * mx + q * q * ex; y = (1 - q) ** 2 * o[1] + 2 * (1 - q) * q * my + q * q * ey; pts.append((x, y))
                cv2.polylines(lay, [np.int32(pts)], False, 1.0, max(1, int(3 * S)), cv2.LINE_AA)
                if pr >= 1: cv2.circle(lay, (ex, ey), int(7 * S), 1.0, -1, cv2.LINE_AA)
            lay = cv2.GaussianBlur(lay, (0, 0), 1.2 * S); glow = cv2.GaussianBlur(lay, (0, 0), 8 * S)
            img = img * (1 - lay[..., None] * 0.5) + (lay[..., None] * np.array([0.95, 0.3, 0.2]) + glow[..., None] * np.array([1.0, 0.5, 0.3]) * 0.8)
        if "stamp" in fx:
            hit = 0.9
            if t > hit:
                k = math.exp(-(t - hit) * 18); img = cv2.warpAffine(img, np.float32([[1, 0, k * 6 * S * math.sin(t * 90)], [0, 1, k * 9 * S]]), (W, H), borderMode=cv2.BORDER_REFLECT)
        img = apply_fx(img, t, i, u, [x for x in fx if x not in ("lampon", "fade_light", "glint", "routes", "stamp", "handwriting")], P=P)
        put(p, film(img, t, i, "warm", halation=0.28))
    p.stdin.close(); p.wait()

def r_depth():
    path = f"{M}/img/{sid}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); d0 = cv2.resize(depthmap(path), (img0.shape[1], img0.shape[0]))
    fx = sh.get("fx", []); cam = sh.get("cam", "dolly")
    lum = img0.mean(-1); thr = np.percentile(lum, 98.5); lightmask = (lum > max(thr, 0.75)).astype(np.float32)
    ys, xs = np.nonzero(lightmask); src = (xs.mean(), ys.mean()) if len(xs) else (img0.shape[1] * 0.5, 0)
    P = rng.random((320, 3)).astype(np.float32) if "dust" in fx else None
    if P is not None: P[:, 2] **= 0.7
    p = writer()
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        if cam == "dolly": sn, sf, dxn = 1 + 0.20 * u, 1 + 0.04 * u, -40 * u * S
        elif cam == "orbit": sn, sf, dxn = 1.04, 1.02, (70 - 140 * u) * S
        else: sn, sf, dxn = 1.02 + 0.03 * u, 1.01, (-110 * u) * S
        im, dd = warp_depth(img0, d0, sn, sf, dx_near=dxn, focal=(0.5, 0.5))
        im = depth_dof(im, dd, focus=float(np.percentile(dd, 60)), strength=16)
        rays = None
        if "rays" in fx:
            lm, _ = warp_depth(np.dstack([lightmask] * 3), d0, sn, sf, dx_near=dxn, focal=(0.5, 0.5))
            im, rays = godrays(im, src, lm[..., 0] * 0.9, length=1.4, gain=0.35, tint=(1.0, 0.93, 0.82))
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        if rays is not None: rays = cv2.resize(rays, (W, H))
        im = apply_fx(im, t, i, u, fx, P=P, rays=rays)
        put(p, film(im, t, i, "warm", halation=0.25))
    p.stdin.close(); p.wait()

def r_arch():
    src = sh["src"].replace("C:/Users/bauti/Downloads/miramontes", M); p = writer()
    if sh.get("move") == "names":                       # la patente: bajar desde el encabezado hasta los nombres y subrayar con luz
        pg = load(src); ph, pw = pg.shape[:2]
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            cy = ph * (0.10 + (0.306 - 0.10) * ramp(t, 0.2, DUR * 0.55)); z = 1.25 + 0.9 * ramp(t, 0.2, DUR * 0.6)
            cx = pw * (0.30 + 0.09 * ramp(t, 0.2, DUR * 0.6))
            crop = xform(pg, z, cx=cx, cy=cy)
            # barrido de luz sobre "Luis Miramontes" (medido en la página 1547x2272: renglón y≈0.306, x 0.322-0.457)
            g_ = crop.mean(-1, keepdims=True); paper = (g_ * 0.92 + crop * 0.08) * 0.86     # papel neutro, sin amarillo ni quemado
            hl = ramp(t, DUR * 0.62, DUR * 0.92)
            if hl > 0:                                                   # marcador sobre "Luis Miramontes", DESPUÉS del gris
                k = W * z / pw; y = H / 2 + (0.2935 * ph - cy) * k; x0 = W / 2 + (0.311 * pw - cx) * k; x1 = x0 + (0.145 * pw * k) * hl
                lay = np.zeros((H, W), np.float32); cv2.rectangle(lay, (int(x0), int(y - 11 * k)), (int(x1), int(y + 13 * k)), 1.0, -1)
                lay = cv2.GaussianBlur(lay, (0, 0), 3 * S)[..., None]
                paper = paper * (1 - lay) + paper * np.array([1.0, 0.86, 0.45]) * lay * 1.08
            put(p, film(paper, t, i, "night", halation=0.06, grain=0.03))
    else:
        im = load(src); ih, iw = im.shape[:2]
        bgc = cv2.resize(cv2.GaussianBlur(im, (0, 0), 25), (W, H)) * 0.35
        top, bottom = (sh.get("label", "|").split("|") + [""])[:2]
        for i in range(N):
            t = i / FPS; u = ease(t / DUR)
            k = H * 0.80 / ih * (1 + 0.06 * u); ph = cv2.resize(im, (int(iw * k), int(ih * k)), interpolation=cv2.INTER_AREA)
            frame = bgc.copy(); y0 = (H - ph.shape[0]) // 2; x0 = int(W * 0.60 - ph.shape[1] / 2)
            pad = int(14 * S); cv2.rectangle(frame, (x0 - pad, y0 - pad), (x0 + ph.shape[1] + pad, y0 + ph.shape[0] + pad), (0.93, 0.91, 0.86), -1)
            frame[y0:y0 + ph.shape[0], x0:x0 + ph.shape[1]] = ph
            frame = over(frame, text_layer([top], F_PF, 58, (110 * S, H * 0.42), alpha=ramp(t, 0.5, 1.2)))
            frame = over(frame, text_layer([bottom], F_SC, 38, (110 * S, H * 0.42 + 90 * S), color=(225, 215, 195), alpha=ramp(t, 0.9, 1.6)))
            put(p, film(frame, t, i, "warm", halation=0.12))
    p.stdin.close(); p.wait()

def r_open():
    """cuadro 0 = la MINIATURA exacta (sin grano ni viñeta); fundido de agnes; el look de película entra en ~1 s"""
    th = load(f"{M}/miniatura.jpg", size=(W, H))
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{M}/clips/apertura.mp4", "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3); n = len(fr); HOLD = 0.30; p = writer()
    for i in range(N):
        t = i / FPS
        if t < HOLD: img = th.copy()
        else:
            k = min(n - 1, int((t - HOLD) * 30)); img = fr[k].astype(np.float32) / 255
            a = 1 - ramp(t, HOLD, HOLD + 0.25)                       # la miniatura real encima los primeros 6 cuadros: calce exacto
            if a > 0: img = img * (1 - a) + th * a
        g = ramp(t, 0.35, 1.3)                                       # el acabado entra de a poco: el cuadro 0 queda intacto
        img = img if g <= 0 else img * (1 - g) + film(img, t, i, "warm", halation=0.22) * g
        put(p, img)
    p.stdin.close(); p.wait()

if __name__ == "__main__":
    k = sh["kind"]
    if k == "graf":
        import graf; graf.render(sh, DUR, OUT, PREV)
    else:
        {"clip": r_clip, "still": r_still, "multi": r_multi, "depth": r_depth, "arch": r_arch, "open": r_open}[k]()
    print("ok", sid, k, N, "cuadros")
