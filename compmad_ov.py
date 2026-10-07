# compmad_ov.py — SUPERPOSICIONES de Caja Naranja en madera: rótulo/lugar = tablita de arce pirograbada, reloj/altímetro = tablitas de nogal
# con números pintados, sello = marca a fuego (compmad.marca), etiqueta y fuente en versalitas.
import numpy as np, cv2
from PIL import Image, ImageDraw
from cine import W, H, S, ease, ramp
from compmad import wood_tex, text_mask, burn, marca, font
from comp7 import tsec, alt_at, esn, hms
import comp7

_PQ = {}
def plaque(w, h, dark=False, seed=0):
    key = (w, h, dark, seed)
    if key not in _PQ:
        p = wood_tex(w, h, tint=(0.52, 0.36, 0.24) if dark else (1.04, 0.98, 0.90), seed=seed)
        b = max(2, int(4 * S)); p[:b] *= 1.20; p[-b - 1:] *= 0.55; p[:, :b] *= 1.12; p[:, -b - 1:] *= 0.62
        _PQ[key] = np.clip(p, 0, 1)
    return _PQ[key]

def put_plaque(img, P, x0, y0, a=1.0):
    ph, pw = P.shape[:2]; x0, y0 = int(x0), int(y0)
    xs, ys, xe, ye = max(0, x0), max(0, y0), min(W, x0 + pw), min(H, y0 + ph)
    if xe <= xs or ye <= ys or a <= 0: return img
    sd = np.zeros((H, W), np.float32); sd[ys:ye, xs:xe] = 1
    sd = cv2.GaussianBlur(np.roll(sd, (int(9 * S), int(7 * S)), (0, 1)), (0, 0), 9 * S)
    img = img * (1 - (sd * 0.5 * a)[..., None])
    img[ys:ye, xs:xe] = img[ys:ye, xs:xe] * (1 - a) + P[ys - y0:ye - y0, xs - x0:xe - x0] * a
    return img

def paint(img, items, col, a=1.0):
    if a <= 0: return img
    m = text_mask(W, H, items); return img * (1 - (m * a)[..., None]) + np.array(col) * (m * a)[..., None]

def tw(s, px, fn, tr=0):
    f = font(fn, px); d = ImageDraw.Draw(Image.new("L", (1, 1))); return sum(d.textlength(c, font=f) for c in s) + tr * max(0, len(s) - 1)

CREAM, SOFT = (0.97, 0.93, 0.85), (0.88, 0.82, 0.72)
def overlays(img, t, sh, DUR):
    img = img.copy()
    if sh.get("tag"):
        tg = sh["tag"] if isinstance(sh["tag"], str) else "RECONSTRUCCIÓN"
        img = paint(img, [(tg, (W - 44 * S, 60 * S), 24 * S, "CormorantSC.ttf", "rm", 4 * S)], (0, 0, 0), 0.45)
        img = paint(img, [(tg, (W - 46 * S, 58 * S), 24 * S, "CormorantSC.ttf", "rm", 4 * S)], (0.98, 0.95, 0.88), 0.92)
    for key in ("rotulo", "lugar"):
        if not sh.get(key): continue
        a_, b_ = sh[key]; k = ramp(t, 0.3, 0.85) * (1 - ramp(t, DUR - 0.5, DUR - 0.05))
        if k <= 0: continue
        A, B = (a_ if key == "lugar" else a_.upper()), b_.upper()
        szA = 50 if key == "lugar" else 44
        w_ = int(max(tw(A, szA * S, "Playfair.ttf"), tw(B, 26 * S, "CormorantSC.ttf", 3 * S)) + 84 * S); h_ = int(132 * S)
        x0 = 56 * S - (1 - ease(k)) * (w_ + 60 * S); y0 = (46 * S if (key == "lugar" and not sh.get("reloj")) else H - h_ - 64 * S)
        img = put_plaque(img, plaque(w_, h_, False, 1), x0, y0)
        img = burn(img, text_mask(W, H, [(A, (x0 + 40 * S, y0 + 52 * S), szA * S, "Playfair.ttf", "lm", 0),
                                          (B, (x0 + 42 * S, y0 + 100 * S), 26 * S, "CormorantSC.ttf", "lm", 3 * S)]), 0.92, 2.5)
    if sh.get("sello"):
        et, src = sh["sello"][:2]; img = marca(img, t, {"marca": [et, src, sh.get("_sello_t", 0.4)]}, DUR)
    if sh.get("reloj"):
        u0, rate = tsec(sh["reloj"][0]), (sh["reloj"][1] if len(sh["reloj"]) > 1 else 1.0)
        now = u0 + t * rate; tp = now - tsec(comp7.RELOJ_REF); w_, h_ = int(470 * S), int(136 * S); x0, y0 = 46 * S, 46 * S
        img = put_plaque(img, plaque(w_, h_, True, 2), x0, y0)
        img = paint(img, [(hms(now) + " UTC", (x0 + 28 * S, y0 + 54 * S), 56 * S, "Anton-Regular.ttf", "lm", 2 * S)], CREAM)
        sg = "+" if tp >= 0 else "−"
        img = paint(img, [(comp7.loc(now), (x0 + 30 * S, y0 + 106 * S), 24 * S, "CormorantSC.ttf", "lm", 2 * S)], SOFT)
        if comp7.RELOJ_FIN and tp >= 0:                                    # cuenta regresiva hasta el final de la grabación
            rem = tsec(comp7.RELOJ_FIN) - now
            lab = f"QUEDAN {int(rem // 60)}:{int(rem % 60):02d}" if rem > 0 else "FIN"
            img = paint(img, [(lab, (x0 + w_ - 26 * S, y0 + 106 * S), 28 * S, "Anton-Regular.ttf", "rm", 1 * S)], (1.0, 0.36, 0.26) if rem < 60 else (1.0, 0.62, 0.30))
        else:
            img = paint(img, [(f"T{sg}{hms(abs(tp))[3:]}", (x0 + w_ - 26 * S, y0 + 106 * S), 28 * S, "Anton-Regular.ttf", "rm", 1 * S)], (1.0, 0.62, 0.30))
    if sh.get("alti"):
        u0, rate = tsec(sh["alti"][0]), (sh["alti"][1] if len(sh["alti"]) > 1 else 1.0)
        now = u0 + t * rate; a = alt_at(now); vs = (alt_at(now + 2) - alt_at(now - 2)) / 4 * 60
        w_, h_ = int(410 * S), int(176 * S); x0, y0 = W - w_ - 46 * S, 120 * S
        img = put_plaque(img, plaque(w_, h_, True, 3), x0, y0)
        img = paint(img, [(comp7.ALT_LBL, (x0 + 26 * S, y0 + 34 * S), 22 * S, "CormorantSC.ttf", "lm", 3 * S)], SOFT)
        img = paint(img, [(f"{esn(round(a / 10) * 10)} FT", (x0 + 24 * S, y0 + 90 * S), 64 * S, "Anton-Regular.ttf", "lm", 2 * S)], CREAM)
        col = (1.0, 0.36, 0.26) if vs < -3000 else ((0.55, 0.85, 0.6) if vs > 1500 else SOFT)
        arrow = "▼" if vs < -300 else ("▲" if vs > 300 else "■")
        img = paint(img, [(f"{arrow} {esn(abs(round(vs / 100) * 100))} FT/MIN", (x0 + 26 * S, y0 + 146 * S), 28 * S, "Mono-Bold.ttf", "lm", 0)], col)
    if sh.get("subt"):                                                  # SUBTÍTULO en tablita (archivo real en otro idioma): [[t0, t1, texto], ...] en s del plano
        for t0_, t1_, tx in sh["subt"]:
            k = ramp(t, t0_, t0_ + 0.2) * (1 - ramp(t, t1_ - 0.2, t1_))
            if k <= 0: continue
            lines = [tx] if len(tx) <= 58 else [tx[:tx.rfind(" ", 0, 58)], tx[tx.rfind(" ", 0, 58) + 1:]]
            w_ = int(max(tw(l_, 40 * S, "Playfair.ttf") for l_ in lines) + 90 * S); h_ = int((40 + 54 * len(lines)) * S)
            x0, y0 = (W - w_) / 2, H - h_ - 96 * S
            img = put_plaque(img, plaque(w_, h_, True, 4), x0, y0, k)
            img = paint(img, [(l_, (W / 2, y0 + (46 + 54 * j) * S), 40 * S, "Playfair.ttf", "mm", 0) for j, l_ in enumerate(lines)], CREAM, k)
    if sh.get("fuente"):
        k = ramp(t, 0.3, 0.8); txt = sh["fuente"].upper()
        img = paint(img, [(txt, (42 * S, H - 32 * S), 22 * S, "CormorantSC.ttf", "lm", 2 * S)], (0, 0, 0), 0.5 * k)
        img = paint(img, [(txt, (40 * S, H - 34 * S), 22 * S, "CormorantSC.ttf", "lm", 2 * S)], (0.98, 0.95, 0.88), 0.95 * k)
    return np.clip(img, 0, 1)
