# comp5.py — pasada 3 de tgagote ("que sea una locura"): componentes de montaje y de narrativa visual
#   r_reloj        reloj de bolsillo con agujas por código que marcan la HORA real; segundero que salta; vela que titila; latido; QUEDAN N HORAS
#   r_gota         transición de la gota: cae sobre la escena A, florece en rojo y se cierra sobre el objeto redondo de la escena B
#   r_split        pantalla dividida "mientras tanto": dos lugares a la misma hora, la misma llama; opción de fundirse en uno
#   r_tipos        el titular armado en plomo: tipos espejados que caen al componedor, rodillo de tinta, el papel baja y sube impreso
#   r_potencias    viaje de potencias de diez: gasa -> gota macro -> microscopio con la red de fibrina
#   r_cables       los telegramas por los cables submarinos de 1914: Morse luminoso que viaja de Buenos Aires a cada destino
#   r_fotomaqueta  la recreación en marionetas se funde con la FOTO REAL alineando la cara del paciente
#   r_eras         tira de épocas de la sangre guardada (1917 -> hoy) con el año que corre
#   r_revela       la escena se aleja y resulta ser una maqueta dentro de una caja sobre el banco del tallador
import os, math, subprocess, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from cine import W, H, S, load, xform, blur, over, fbm, film, warp_depth, depth_dof, ease, ramp, bokeh
from comp import text_rgba, keyed, depthmap, M, FONTS
FPS = 24
def font(k, px): return ImageFont.truetype(FONTS.get(k, k), max(8, int(px)))
def frames(clipid, n=None):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f"{M}/clips/{clipid}.mp4", "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
def src_img(name, size=(W, H)):
    for p in (f"{M}/img/{name}.png", f"{M}/img/kf__{name}.png", f"{M}/{name}"):
        if os.path.exists(p): return load(p, size=size)
    raise FileNotFoundError(name)
def heartbeat(t, bpm):
    bp = 60.0 / bpm; ph = (t % bp) / bp
    return math.exp(-((ph - 0.05) / 0.035) ** 2) + 0.6 * math.exp(-((ph - 0.22) / 0.035) ** 2)

# ------------------------------------------------------------------ reloj de bolsillo
def r_reloj(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); img0 = load(f"{M}/img/{sh.get('src', 'x_reloj_dial2')}.png", size=(int(W * 1.1), int(H * 1.1))); h0, w0 = img0.shape[:2]
    cx, cy = sh.get("center", (0.494, 0.49)); cx *= w0; cy *= h0; R = sh.get("radius", 0.40) * h0
    h1, m1 = map(int, sh.get("hora", "20:00").split(":")); h2, m2 = map(int, sh.get("hasta", sh.get("hora", "20:00")).split(":"))
    t_a = h1 * 60 + m1; t_b = h2 * 60 + m2 + (24 * 60 if (h2 * 60 + m2) < t_a else 0)
    n = sh.get("n"); bpm = sh.get("bpm", 80)
    g = np.random.default_rng(4); flick = np.cumsum(g.normal(0, 0.05, N + 5)); flick = (flick - np.convolve(flick, np.ones(9) / 9, "same")) * 0.6
    yy, xx = np.mgrid[0:h0, 0:w0].astype(np.float32); candle = np.exp(-(((xx - w0 * -0.1) / (w0 * 0.9)) ** 2 + ((yy - h0 * 0.3) / (h0 * 0.9)) ** 2))
    def hand(lay, ang, L, wid, tail=0.15, spade=False):
        c, s = math.sin(ang), -math.cos(ang); px, py = -s, c
        tip = (cx + c * L, cy + s * L); base = (cx - c * L * tail, cy - s * L * tail)
        pts = [(base[0] + px * wid * 0.5, base[1] + py * wid * 0.5), (cx + c * L * 0.75 + px * wid * 0.45, cy + s * L * 0.75 + py * wid * 0.45), tip,
               (cx + c * L * 0.75 - px * wid * 0.45, cy + s * L * 0.75 - py * wid * 0.45), (base[0] - px * wid * 0.5, base[1] - py * wid * 0.5)]
        cv2.fillPoly(lay, [np.int32(np.array(pts) * 4)], 1.0, cv2.LINE_AA, shift=2)
        if spade: cv2.circle(lay, (int((cx + c * L * 0.72) * 4), int((cy + s * L * 0.72) * 4)), int(wid * 1.3 * 4), 1.0, -1, cv2.LINE_AA, shift=2)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        mins = t_a + (t_b - t_a) * ease(ramp(t, 0.3, DUR * 0.9)) if t_b != t_a else t_a
        sec = (int(t) % 60) if t_b == t_a else (t * 900) % 60                         # el segundero salta cada segundo (o corre si el tiempo avanza)
        img = img0 * (0.82 + 0.10 * flick[i] + 0.10 * candle[..., None])
        lay = np.zeros((h0, w0), np.float32); sec_l = np.zeros((h0, w0), np.float32)
        hand(lay, (mins / 60.0 % 12) / 12 * 2 * math.pi, R * 0.52, 16 * S * 1.1, spade=True)
        hand(lay, (mins % 60) / 60 * 2 * math.pi, R * 0.80, 11 * S * 1.1)
        sa = sec / 60 * 2 * math.pi; cv2.line(sec_l, (int(cx - math.sin(sa) * R * 0.2), int(cy + math.cos(sa) * R * 0.2)), (int(cx + math.sin(sa) * R * 0.86), int(cy - math.cos(sa) * R * 0.86)), 1.0, max(2, int(3 * S)), cv2.LINE_AA)
        shd = cv2.GaussianBlur(np.roll(np.maximum(lay, sec_l), (int(10 * S), int(12 * S)), (0, 1)), (0, 0), 6 * S)
        img = img * (1 - shd[..., None] * 0.45)
        blued = np.array([0.10, 0.13, 0.25]) + 0.25 * np.clip((xx - cx) / R, -1, 1)[..., None] * np.array([0.1, 0.15, 0.35])
        img = img * (1 - lay[..., None]) + blued * lay[..., None]
        img = img * (1 - sec_l[..., None]) + np.array([0.55, 0.12, 0.08]) * sec_l[..., None]
        cv2.circle(img, (int(cx), int(cy)), int(9 * S), (0.65, 0.50, 0.25), -1, cv2.LINE_AA)
        k_ = heartbeat(t, bpm); z = 1.04 + 0.10 * u + 0.006 * k_
        im = cv2.warpAffine(img, np.float32([[z * W / w0, 0, W / 2 - z * W / w0 * cx * 0.98], [0, z * W / w0, H / 2 - z * W / w0 * cy * 0.98]]), (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        vg = ((np.arange(W)[None, :] - W / 2) / (W / 2)) ** 2 + ((np.arange(H)[:, None] - H / 2) / (H / 2)) ** 2
        im = im * (1 - (0.35 + 0.10 * k_) * np.clip(vg / 2, 0, 1)[..., None])
        hh = int(mins // 60) % 24; mm = int(mins % 60)
        T = text_rgba(W, H, f"{hh:02d}:{mm:02d}", "SC", 58, (0.73, 0.69), (240, 230, 210), 0.12); T[..., 3] *= ramp(t, 0.2, 0.7) * 0.9
        im = im * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 5 * S)[..., None] * 0.6); im = over(im, T)
        if n is not None:
            txt = f"QUEDA{'' if n == 1 else 'N'} {n} HORA{'' if n == 1 else 'S'}"
            T = text_rgba(W, H, txt, "AN", 104, (0.73, 0.58), (250, 246, 236), 0.02); a = ramp(t, 0.15, 0.6); T[..., 3] *= a
            im = im * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 10 * S)[..., None] * 0.7); im = over(im, T)
        put(film(im, t, i, "warm", halation=0.3))

# ------------------------------------------------------------------ transición de la gota
def _drop_sprite(r):
    s = int(r * 4); yy, xx = np.mgrid[0:s, 0:s].astype(np.float32); cx, cy = s / 2, s * 0.62
    d = np.sqrt(((xx - cx) / r) ** 2 + ((yy - cy) / r) ** 2); top = (yy < cy) & (np.abs(xx - cx) < (cy - yy) * -0.0 + r * (1 - (cy - yy) / (r * 1.9)) ** 1.2)
    a = np.clip((1 - d) * r / 2, 0, 1); a = np.maximum(a, top.astype(np.float32) * np.clip((yy - (cy - r * 1.9)) / (r * 0.3), 0, 1))
    shade = np.clip(0.55 + 0.45 * (1 - d), 0, 1)
    rgb = np.dstack([0.62 * shade, 0.03 * shade, 0.04 * shade])
    hl = np.exp(-(((xx - cx + r * 0.35) / (r * 0.18)) ** 2 + ((yy - cy + r * 0.3) / (r * 0.25)) ** 2)); rgb = rgb + hl[..., None] * 0.9
    return np.dstack([np.clip(rgb, 0, 1), a]).astype(np.float32)
def r_gota(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); A = src_img(sh["from"]); B = src_img(sh["to"]); tr = sh.get("to_r", 0.12) * H
    tx, ty = _reddest(B) if sh.get("to_xy", "auto") == "auto" else sh["to_xy"]
    spr = _drop_sprite(26 * S); sh_, sw_ = spr.shape[:2]
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); nz = cv2.resize(fbm(96, 54, 8), (W, H))
    for i in range(N):
        t = i / FPS; f = t / DUR
        if f < 0.38:                                                        # la gota cae sobre A
            img = xform(A, 1.0 + 0.04 * f); y = -60 * S + (H * 0.5 + 60 * S) * (f / 0.38) ** 2
            L = np.zeros((H, W, 4), np.float32); x0, y0 = int(W / 2 - sw_ / 2), int(y - sh_ * 0.62)
            ys, ye = max(0, y0), min(H, y0 + sh_)
            if ye > ys: L[ys:ye, x0:x0 + sw_] = spr[ys - y0:ye - y0]
            img = over(img, L)
        else:                                                               # florece en rojo y se cierra sobre el objeto de B
            k = ease(ramp(f, 0.38, 0.62)); c = ease(ramp(f, 0.58, 1.0))
            cxp = W / 2 + (tx * W - W / 2) * c; cyp = H / 2 + (ty * H - H / 2) * c
            rad = (k * math.hypot(W, H) * 0.62) * (1 - c) + tr * c
            d = np.hypot(xx - cxp, yy - cyp) + (nz - 0.5) * 60 * S * (1 - c)
            m = np.clip((rad - d) / (8 * S + 30 * S * (1 - c)), 0, 1)
            base = xform(A, 1.04 + 0.1 * k) if c <= 0 else xform(B, 1.25 - 0.25 * c)
            red = np.array([0.42, 0.02, 0.03]) * (0.8 + 0.2 * nz[..., None])
            if c > 0:
                img = base * (1 - m[..., None] * (1 - c)) + red * m[..., None] * (1 - c)
            else:
                img = base * (1 - m[..., None]) + red * m[..., None]
        put(film(img, t, i, "warm", halation=0.25))

# ------------------------------------------------------------------ pantalla dividida "mientras tanto"
def _src_frames(spec):
    if spec.startswith("clip:"): return frames(spec[5:])
    return None
def r_split(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); L = sh["left"]; Rr = sh["right"]
    FL = _src_frames(L); FR = _src_frames(Rr)
    IL = None if FL is not None else src_img(L); IR = None if FR is not None else src_img(Rr)
    g = np.random.default_rng(2); flick = np.cumsum(g.normal(0, 0.04, N + 5)); flick -= np.convolve(flick, np.ones(11) / 11, "same")
    la, lb = sh.get("labels", ("", ""))
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        def get(Fr, Im):
            if Fr is not None:
                k = min(len(Fr) - 1, int((i // 2) * 2 * 30 / FPS)); return Fr[k].astype(np.float32) / 255
            return xform(Im, 1.03 + 0.04 * u)
        a = get(FL, IL); b = get(FR, IR)
        sp = 0.5 + (sh.get("merge_to", 0.5) - 0.5) * ease(ramp(t, DUR * 0.7, DUR))
        x = int(W * sp); img = np.empty_like(a)
        ca = int(W * 0.25); img[:, :x] = np.roll(a, -ca + (x - W // 2) // 2 * 0, 1)[:, :x] if True else a[:, :x]
        img[:, :x] = a[:, ca:ca + x] if ca + x <= W else a[:, W - x:]
        cb = int(W * 0.25); img[:, x:] = b[:, cb:cb + (W - x)] if cb + (W - x) <= W else b[:, :W - x]
        img = img * (1 + 0.12 * flick[i])                                  # la misma llama en los dos lados
        cv2.rectangle(img, (x - int(4 * S), 0), (x + int(4 * S), H), (0.20, 0.13, 0.08), -1)
        img[:, max(0, x - int(1 * S)):x + int(1 * S)] = img[:, max(0, x - int(1 * S)):x + int(1 * S)] * 0.5 + 0.35
        A_ = ramp(t, 0.3, 0.9) * (1 - ramp(t, DUR * 0.7, DUR * 0.8))
        for txt, xx_ in ((la, sp / 2), (lb, sp + (1 - sp) / 2)):
            if not txt: continue
            T = text_rgba(W, H, txt, "SC", 40, (xx_, 0.08), (245, 238, 225), 0.08); T[..., 3] *= A_
            img = img * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 5 * S)[..., None] * 0.6); img = over(img, T)
        put(film(img, t, i, "warm", halation=0.25))

# ------------------------------------------------------------------ tipos de plomo -> imprenta
def _type_block(ch, px):
    f = font("AN", px); w = int(px * 0.62) if ch != " " else int(px * 0.35); h = int(px * 1.25)
    im = Image.new("L", (w, h), 0); d = ImageDraw.Draw(im); d.text((w / 2, h * 0.55), ch, font=f, fill=255, anchor="mm")
    glyph = np.asarray(im.transpose(Image.FLIP_LEFT_RIGHT)).astype(np.float32) / 255           # el tipo va ESPEJADO
    body = np.ones((h, w), np.float32); yy = np.linspace(0, 1, h)[:, None]
    metal = np.dstack([0.42 + 0.12 * (1 - yy), 0.42 + 0.12 * (1 - yy), 0.45 + 0.12 * (1 - yy)]) * np.ones((1, w, 1))
    metal[:, :2] *= 0.6; metal[:, -2:] *= 0.6
    face = metal * (1 - glyph[..., None]) + (np.array([0.78, 0.78, 0.80]) + 0.1) * glyph[..., None]
    return np.dstack([np.clip(face, 0, 1), body])
def r_tipos(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); bg = blur(src_img(sh.get("bg", "i_v_q5")), 7) * 0.45
    line = sh.get("line", "NUEVO PROCEDIMIENTO"); head = sh.get("head", ["NUEVO PROCEDIMIENTO PARA LA", "TRANSFUSIÓN DE LA SANGRE"])
    px = int(92 * S); blocks = [_type_block(c, px) for c in reversed(line)]           # se compone de derecha a izquierda (espejado)
    tw = sum(b.shape[1] for b in blocks); x0 = (W - tw) // 2; yb = int(H * 0.56)
    paper = np.dstack([np.full((H, W), v, np.float32) for v in (0.92, 0.89, 0.80)]) - (cv2.resize(fbm(160, 90, 33), (W, H)) * 0.06)[..., None]
    pim = Image.new("L", (W, H), 0); dp = ImageDraw.Draw(pim)
    for k, ln in enumerate(head):
        f = font("AN", int(96 * S))
        while dp.textlength(ln, font=f) > W * 0.86: f = font("AN", f.size - 4)
        dp.text((W / 2, H * (0.40 + 0.14 * k)), ln, font=f, fill=255, anchor="mm")
    dp.text((W / 2, H * 0.16), "LA PRENSA", font=font("PF", int(70 * S)), fill=255, anchor="mm")
    ink = np.asarray(pim).astype(np.float32) / 255 * (0.85 + 0.15 * cv2.resize(fbm(200, 112, 41), (W, H)))
    printed = paper * (1 - ink[..., None] * 0.9) + np.array([0.08, 0.07, 0.07]) * ink[..., None] * 0.9
    nb = len(blocks); fase = sh.get("fase", "todo")
    if fase == "componer": T1, T2, T3 = DUR * 0.92, DUR * 10, DUR * 11           # sólo caen las letras
    elif fase == "imprimir": T1, T2, T3 = 0.0, DUR * 0.25, DUR * 0.42            # letras ya puestas: rodillo, papel, impreso
    else: T1, T2, T3 = DUR * 0.45, DUR * 0.6, DUR * 0.72
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        if t < T3:
            img = bg.copy()
            cv2.rectangle(img, (x0 - int(30 * S), yb + int(px * 1.25)), (x0 + tw + int(30 * S), yb + int(px * 1.25) + int(26 * S)), (0.62, 0.48, 0.22), -1)   # componedor de bronce
            x = x0
            for k, b in enumerate(blocks):
                tk = T1 * k / nb; a = 1.0 if fase == "imprimir" else ease(ramp(t, tk, tk + 0.25))
                if a > 0:
                    y = int(yb - (1 - a) * 160 * S); L = np.zeros((H, W, 4), np.float32); bh, bw = b.shape[:2]
                    L[max(0, y):y + bh, x:x + bw] = b[max(0, -y):, :]; img = over(img, L)
                x += b.shape[1]
            if t > T1 and fase != "componer":                                  # rodillo de tinta
                rx = int(x0 - 80 * S + (tw + 160 * S) * ramp(t, T1, T2))
                inked = np.zeros((H, W), np.float32); inked[yb:yb + int(px * 1.25), x0:min(rx, x0 + tw)] = 1
                img = img * (1 - inked[..., None] * 0.55)
                cv2.rectangle(img, (rx - int(26 * S), yb - int(70 * S)), (rx + int(26 * S), yb + int(px * 1.25) + int(20 * S)), (0.06, 0.06, 0.07), -1)
            if t > T2:                                                         # baja el papel
                k = ease(ramp(t, T2, T3)); py = int(-H + H * k)
                img[max(0, py):py + H] = paper[max(0, -py):H - max(0, py) + max(0, -py)][:img[max(0, py):py + H].shape[0]]
            img = xform(img, 1.0 + 0.05 * u)
        else:                                                                  # sube el papel impreso
            k = ease(ramp(t, T3, T3 + 0.6)); img = bg * 0.6 + 0.0
            ang = 8 * (1 - k); Mr = cv2.getRotationMatrix2D((W / 2, H * 1.2), ang, 0.92 + 0.08 * k)
            pr = cv2.warpAffine(printed, Mr, (W, H), borderMode=cv2.BORDER_CONSTANT, borderValue=(0, 0, 0))
            mask = cv2.warpAffine(np.ones((H, W), np.float32), Mr, (W, H))[..., None]
            img = img * (1 - mask) + pr * mask
            img = xform(img, 1.0 + 0.06 * ramp(t, T3, DUR))
        put(film(img, t, i, "warm", halation=0.18))

# ------------------------------------------------------------------ potencias de diez
def _reddest(img):
    r = img[..., 0] - 0.5 * (img[..., 1] + img[..., 2]); r = cv2.GaussianBlur(r, (0, 0), 15)
    y, x = np.unravel_index(np.argmax(r), r.shape); return x / img.shape[1], y / img.shape[0]
def r_potencias(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); A = src_img(sh.get("a", "i_v_gasa")); B = src_img(sh.get("b", "x_gota_macro"))
    pa = sh.get("pa") or _reddest(A); pb = sh.get("pb") or _reddest(B)
    import comp4
    MF = []
    rest = DUR * 0.45; comp4.r_microscopio(dict(sh.get("mic", {"mode": "coagula"})), sid, rest + 0.5, lambda im: MF.append(im.astype(np.float32)))
    def zoom(img, p, z):
        k = z; return cv2.warpAffine(img, np.float32([[k, 0, W / 2 - k * p[0] * W], [0, k, H / 2 - k * p[1] * H]]), (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    for i in range(N):
        t = i / FPS; f = t / DUR
        if f < 0.55:
            za = 1 * (8 ** ease(ramp(f, 0.0, 0.32))); a = zoom(A, pa, za); a = blur(a, 6 * ramp(f, 0.22, 0.32))
            zb = 1.0 * (7 ** ease(ramp(f, 0.24, 0.55))); b = zoom(B, pb, zb); b = blur(b, 4 * ramp(f, 0.45, 0.55))
            m = ease(ramp(f, 0.24, 0.34)); img = a * (1 - m) + b * m
            red = ease(ramp(f, 0.45, 0.58)); img = img * (1 - red) + np.array([0.45, 0.03, 0.04]) * red
            img = film(img, t, i, "warm", halation=0.25)
        else:
            k = min(len(MF) - 1, int((t - DUR * 0.55) * FPS)); mic = MF[k]
            zs = 0.35 + 0.65 * ease(ramp(f, 0.55, 0.68)); micz = cv2.warpAffine(mic, cv2.getRotationMatrix2D((W / 2, H / 2), 0, zs), (W, H), borderMode=cv2.BORDER_CONSTANT, borderValue=(0.45, 0.03, 0.04))
            m = ease(ramp(f, 0.55, 0.66)); img = np.array([0.45, 0.03, 0.04]) * (1 - m) + micz * m
        put(img)

# ------------------------------------------------------------------ cables submarinos + Morse
MORSE = {"A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.", "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..", "M": "--", "N": "-.",
         "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.", "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-", "Y": "-.--", "Z": "--..", " ": " "}
def morse_units(txt):
    u = []
    for ch in txt.upper():
        if ch == " ": u += [0] * 4; continue
        for s_ in MORSE.get(ch, ""): u += [1] * (1 if s_ == "." else 3) + [0]
        u += [0, 0]
    return u
def _spline(P, n=200):
    P = np.float32(P)
    if len(P) < 3: return np.float32([P[0] + (P[-1] - P[0]) * q for q in np.linspace(0, 1, n)])
    out = []; Q = np.vstack([P[0], P, P[-1]])
    for j in range(1, len(Q) - 2):
        p0, p1, p2, p3 = Q[j - 1], Q[j], Q[j + 1], Q[j + 2]
        for s in np.linspace(0, 1, max(8, n // (len(P) - 1)), endpoint=False):
            out.append(0.5 * ((2 * p1) + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s * s + (-p0 + 3 * p1 - 3 * p2 + p3) * s ** 3))
    out.append(P[-1]); return np.float32(out)
def r_cables(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); path = f"{M}/img/{sh.get('src', 'c_mapa')}.png"
    img0 = load(path, size=(int(W * 1.08), int(H * 1.08))); h0, w0 = img0.shape[:2]
    d0 = cv2.resize(depthmap(path), (w0, h0)); lo, hi = np.percentile(d0, 1), np.percentile(d0, 99); d0 = np.clip((d0 - lo) / (hi - lo + 1e-6), 0, 1)
    routes = [(_spline([(x * w0, y * h0) for x, y in r["pts"]], 260), r["label"], r.get("t", 0.1 + 0.08 * k)) for k, r in enumerate(sh["routes"])]
    U = np.array(morse_units(sh.get("morse", "CITRATO")), np.float32); unit = 7 * S * 1.08
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        lay = np.zeros((h0, w0), np.float32); pulse = np.zeros((h0, w0), np.float32); dots = np.zeros((h0, w0), np.float32)
        labs = []
        for P, lab, ts in routes:
            L = np.r_[0, np.cumsum(np.hypot(*np.diff(P, axis=0).T))]; tot = L[-1]
            pr = ease(ramp(t / DUR, ts, ts + 0.35)); n = int(np.searchsorted(L, pr * tot))
            if n < 2: continue
            cv2.polylines(lay, [np.int32(P[:n] * 4)], False, 1.0, max(2, int(3 * S)), cv2.LINE_AA, shift=2)
            off = (t * 260 * S) % (len(U) * unit)                                   # el mensaje en Morse viaja por el cable
            for k_, on in enumerate(U):
                if not on: continue
                q = off + k_ * unit
                while q < pr * tot:
                    j = int(np.searchsorted(L, q)); j2 = int(np.searchsorted(L, q + unit * 0.8))
                    if j2 > j: cv2.polylines(pulse, [np.int32(P[j:j2 + 1] * 4)], False, 1.0, max(3, int(6 * S)), cv2.LINE_AA, shift=2)
                    q += len(U) * unit
            if pr >= 0.999:
                cv2.circle(dots, (int(P[-1][0]), int(P[-1][1])), int(9 * S), 1.0, -1, cv2.LINE_AA); labs.append((P[-1], lab))
        cv2.circle(dots, (int(routes[0][0][0][0]), int(routes[0][0][0][1])), int(11 * S), 1.0, -1, cv2.LINE_AA)
        base = img0 * (1 - lay[..., None] * 0.7) + lay[..., None] * np.array([0.55, 0.25, 0.12])
        base = base + cv2.GaussianBlur(pulse, (0, 0), 5 * S)[..., None] * np.array([1.0, 0.75, 0.3]) + pulse[..., None] * np.array([1.0, 0.9, 0.6]) * 0.8
        base = base * (1 - dots[..., None]) + dots[..., None] * np.array([0.85, 0.1, 0.06]) + cv2.GaussianBlur(dots, (0, 0), 10 * S)[..., None] * np.array([0.6, 0.1, 0.05])
        im, dd = warp_depth(base, d0, 1.0 + 0.10 * u, 1.0 + 0.04 * u, focal=(0.5, 0.5))
        im = depth_dof(im, dd, focus=float(np.percentile(d0, 60)), strength=10)
        im = cv2.resize(im, (W, H), interpolation=cv2.INTER_AREA)
        z = 1.0 + 0.10 * u
        for p_, lab in labs:
            x = (p_[0] / w0 - 0.5) * z + 0.5; y = (p_[1] / h0 - 0.5) * z + 0.5 - 0.035
            T = text_rgba(W, H, lab, "SC", 34, (x, y), (250, 244, 232), 0.04); im = im * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 3 * S)[..., None] * 0.6); im = over(im, T)
        if sh.get("origin"):
            p0 = routes[0][0][0]; T = text_rgba(W, H, sh["origin"], "AN", 44, ((p0[0] / w0 - 0.5) * z + 0.5, (p0[1] / h0 - 0.5) * z + 0.5 + 0.045), (250, 246, 236), 0.04)
            im = im * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 4 * S)[..., None] * 0.6); im = over(im, T)
        T = text_rgba(W, H, "· – · –   " + sh.get("morse", "CITRATO") + "   – · – ·", "SC", 36, (0.5, 0.94), (250, 220, 150), 0.1); T[..., 3] *= ramp(t, 0.5, 1.2) * 0.85; im = over(im, T)
        put(film(im, t, i, "warm", halation=0.3))

# ------------------------------------------------------------------ foto real <-> maqueta
def r_fotomaqueta(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); P = src_img(sh["maqueta"]); R = src_img(sh["foto"])
    pf, rf = sh["maqueta_xy"], sh["foto_xy"]; rev = sh.get("reverse", True)          # reverse: de la maqueta a la foto real
    A, B, pa, pb = (P, R, pf, rf) if rev else (R, P, rf, pf)
    T0, T1 = DUR * 0.35, DUR * 0.62
    P_ = np.random.default_rng(5).random((220, 3)).astype(np.float32)
    for i in range(N):
        t = i / FPS; u = ease(t / DUR); m = ease(ramp(t, T0, T1))
        # las dos imágenes se mueven para que la cara del paciente quede en el MISMO punto de pantalla durante el fundido
        tgt = (0.5, 0.52); za = 1.10 + 0.20 * u
        def place(img, p, z):
            return cv2.warpAffine(img, np.float32([[z, 0, W * tgt[0] - z * p[0] * W], [0, z, H * tgt[1] - z * p[1] * H]]), (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
        a = place(A, pa, za); b = place(B, pb, za)
        gray = b.mean(-1, keepdims=True) * np.array([1.02, 0.97, 0.88])
        b = gray if rev else b
        img = a * (1 - m) + b * m
        if m > 0 and m < 1: img = img + (math.sin(math.pi * m) ** 2) * 0.12
        if rev and t > T1:
            P_[:, :2] += np.array([0.0004, 0.0008]); P_[:, :2] %= 1; lay = np.zeros((H, W), np.float32)
            for x, y, z in P_: cv2.circle(lay, (int(x * W), int(y * H)), max(1, int((0.8 + 3 * z * z) * S)), 1.0, -1, cv2.LINE_AA)
            img = img + cv2.GaussianBlur(lay, (0, 0), 1.3 * S)[..., None] * 0.12
        lb = sh.get("label")
        if lb and t > T1:
            a_ = ramp(t, T1, T1 + 0.6)
            T = text_rgba(W, H, lb[0], "PF", 54, (0.06, 0.86), (250, 245, 235), 0.0, anchor="lm"); T[..., 3] *= a_
            img = img * (1 - np.clip((np.arange(H)[:, None] / H - 0.76) / 0.1, 0, 1)[..., None] * 0.55 * a_); img = over(img, T)
            T = text_rgba(W, H, lb[1], "SC", 32, (0.06, 0.92), (236, 226, 206), 0.0, anchor="lm"); T[..., 3] *= a_; img = over(img, T)
        put(film(img, t, i, "warm", halation=0.2, grain=0.04 if rev and t > T1 else 0.035))

# ------------------------------------------------------------------ épocas de la sangre guardada
def r_eras(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); panels = [(src_img(p["img"], size=(int(W * 0.62), int(H * 0.62))), p["year"], p["label"]) for p in sh["panels"]]
    gap = int(40 * S); pw = panels[0][0].shape[1]; ph = panels[0][0].shape[0]; total = len(panels) * (pw + gap)
    bg = blur(src_img(sh.get("bg", "x_madera")), 4) * 0.35
    for i in range(N):
        t = i / FPS; u = ease(ramp(t, 0.2, DUR * 0.92))
        off = (W - pw) / 2 - u * (total - pw - gap)
        img = bg.copy(); y0 = int((H - ph) / 2 + 30 * S)
        for k, (im, yr, lab) in enumerate(panels):
            x0 = int(off + k * (pw + gap))
            if x0 > W or x0 + pw < 0: continue
            cx = x0 + pw / 2; foc = 1 - min(1, abs(cx - W / 2) / (W * 0.6))
            frame = im * (0.45 + 0.55 * foc)
            if foc < 0.85: frame = blur(frame, (1 - foc) * 10)
            xs, xe = max(0, x0), min(W, x0 + pw)
            img[y0:y0 + ph, xs:xe] = frame[:, xs - x0:xe - x0]
            cv2.rectangle(img, (x0 - int(6 * S), y0 - int(6 * S)), (x0 + pw + int(6 * S), y0 + ph + int(6 * S)), (0.85, 0.80, 0.70), max(2, int(4 * S)))
            T = text_rgba(W, H, yr, "AN", 110, (cx / W, (y0 - 70 * S) / H), (232, 196, 120), 0.04); T[..., 3] *= 0.4 + 0.6 * foc; img = over(img, T)
            T = text_rgba(W, H, lab, "SC", 34, (cx / W, (y0 + ph + 50 * S) / H), (240, 232, 215), 0.06); T[..., 3] *= foc; img = over(img, T)
        put(film(img, t, i, "warm", halation=0.25))

# ------------------------------------------------------------------ la maqueta revelada
def r_revela(sh, sid, DUR, put):
    N = int(round(DUR * FPS)); scene = src_img(sh["scene"]); bench = load(f"{M}/img/{sh.get('bench', 'x_banco_caja')}.png", size=(W, H))
    q = np.float32([(x * W, y * H) for x, y in sh.get("box", [(0.375, 0.23), (0.62, 0.23), (0.62, 0.62), (0.375, 0.62)])])
    full = np.float32([(0, 0), (W, 0), (W, H), (0, H)])
    Hb = cv2.getPerspectiveTransform(q, full)                            # la caja ocupando todo el cuadro
    for i in range(N):
        t = i / FPS; k = ease(ramp(t, DUR * 0.12, DUR * 0.85))
        Mz = (Hb * (1 - k) + np.eye(3) * k); Mz /= Mz[2, 2]
        b = cv2.warpPerspective(bench, Mz, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        qq = cv2.perspectiveTransform(q[None], Mz)[0]
        Hs = cv2.getPerspectiveTransform(full, qq)
        s_ = cv2.warpPerspective(scene, Hs, (W, H), flags=cv2.INTER_LINEAR)
        m = cv2.warpPerspective(np.ones((H, W), np.float32), Hs, (W, H)); m = cv2.erode(m, np.ones((3, 3), np.uint8))[..., None]
        inner = s_ * (1 - 0.25 * k)                                      # adentro de la caja hay un poco de sombra
        img = b * (1 - m) + inner * m
        img = blur(img, 1.5 * k)
        put(film(img, t, i, "warm", halation=0.22))

# ------------------------------------------------------------------ la lámina se calca sobre el objeto real
def r_lamina_ov(sh, sid, DUR, put):
    """los bordes REALES del objeto (Canny) se dibujan como plano técnico en tinta luminosa, con rótulos; la foto se aclara por detrás"""
    N = int(round(DUR * FPS)); img0 = src_img(sh["src"], size=(int(W * 1.06), int(H * 1.06))); h0, w0 = img0.shape[:2]
    g = (cv2.GaussianBlur(img0.mean(-1), (0, 0), 1.6) * 255).astype(np.uint8)
    E = cv2.Canny(g, sh.get("lo", 40), sh.get("hi", 110)).astype(np.float32) / 255
    bx = sh.get("box"); m = np.zeros_like(E)
    if bx: m[int(bx[1] * h0):int(bx[3] * h0), int(bx[0] * w0):int(bx[2] * w0)] = 1
    else: m[:] = 1
    if sh.get("near", True):                                         # sólo los bordes del primer plano (el objeto), no las ventanas del fondo
        dp = cv2.resize(depthmap(f"{M}/img/{sh['src']}.png"), (w0, h0)); m = m * (dp > np.percentile(dp, sh.get("near_p", 62))).astype(np.float32)
    E = cv2.dilate(E * m, np.ones((2, 2), np.uint8))
    ink = np.array([0.80, 0.92, 1.0])
    for i in range(N):
        t = i / FPS; u = ease(t / DUR)
        sweep = ramp(t, 0.15, DUR * 0.55); xs = np.arange(w0)[None, :] / w0
        rev = np.clip((sweep * 1.15 - xs) / 0.05, 0, 1)
        e = E * rev; glow = cv2.GaussianBlur(e, (0, 0), 3)
        base = img0 * (1 - 0.45 * ramp(t, 0.1, 0.6))                      # la foto baja para que la lámina se lea
        im = base * (1 - e[..., None] * 0.9) + ink * e[..., None] * 0.95 + glow[..., None] * ink * 0.35
        im = xform(im, 1.0 + 0.05 * u)
        for txt, tin, (ax, ay), (lx, ly) in sh.get("labels", []):
            a = ramp(t, DUR * tin, DUR * tin + 0.5)
            if a <= 0: continue
            ln = np.zeros((H, W), np.float32); cv2.line(ln, (int(ax * W), int(ay * H)), (int(lx * W), int(ly * H)), 1.0, max(1, int(2 * S)), cv2.LINE_AA)
            cv2.circle(ln, (int(ax * W), int(ay * H)), int(6 * S), 1.0, -1, cv2.LINE_AA)
            im = im * (1 - ln[..., None] * a) + ln[..., None] * a * ink
            T = text_rgba(W, H, txt, "SC", 44, (lx, ly - 0.03), (235, 245, 255), 0.06); T[..., 3] *= a
            im = im * (1 - cv2.GaussianBlur(T[..., 3], (0, 0), 5 * S)[..., None] * 0.6); im = over(im, T)
        put(film(im, t, i, "night", halation=0.3))
