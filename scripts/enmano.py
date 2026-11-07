# EN MANO — cámara en mano realista para avatares (video) y fotos fijas. Corre en el FARM (.github/workflows/enmano.yml,
# lanzador scripts/enmano_farm.mjs); también anda local.
#
#   python3 enmano.py --in avatar.mp4 --out trozo.mp4 [--desde 0 --frames 375] [--seed 7] [--k 1]
#   python3 enmano.py --in foto.jpg   --out foto.mp4 --dur 6 [--seed 7]
#
# Cámara 3D virtual: giro (yaw/pitch/roll) con perspectiva + balanceo del cuerpo con PARALAJE por profundidad
# (Depth Anything V2 Small), movida por trayectorias REALES rastreadas de clips filmados en mano (enmano_banco.npz,
# 6 tramos de 12 s elegidos entre 140 por tener menos tirones). Lo que aprendimos (7-nov-2026):
#  1. Movimiento rastreado de cámaras reales, nunca wiggle/seno (eso queda robótico).
#  2. Domina el GIRO chico (~0,3-0,5°); mucho desplazamiento con poco giro = "cuadro que se desliza".
#  3. Sin picos: velocidad y aceleración con límite suave (tanh).
#  4. Desenfoque de movimiento (obturador 180°, subcuadros).
#  5. Foco y exposición que respiran muy leve.
#  6. Paralaje: lo cercano se mueve más que el fondo.
# TROZOS SIN COSTURA: la trayectoria depende sólo de --seed y del tiempo GLOBAL del reel; la profundidad se calcula en
# una grilla global (cada --paso cuadros) y se normaliza con 5 cuadros fijos del reel entero → dos trozos vecinos
# dan el mismo cuadro en el borde.
import argparse, os, subprocess, cv2, numpy as np
from scipy.ndimage import gaussian_filter1d, gaussian_filter

ap = argparse.ArgumentParser()
ap.add_argument("--in", dest="src", required=True); ap.add_argument("--out", required=True)
ap.add_argument("--banco", default=os.path.join(os.path.dirname(os.path.abspath(__file__)), "enmano_banco.npz"))
ap.add_argument("--k", type=float, default=1.0); ap.add_argument("--seed", type=int, default=0)
ap.add_argument("--desde", type=int, default=0); ap.add_argument("--frames", type=int, default=0)
ap.add_argument("--dur", type=float, default=6); ap.add_argument("--fps", type=float, default=30)
ap.add_argument("--paso", type=int, default=12); ap.add_argument("--sub", type=int, default=5)
ap.add_argument("--w", type=int, default=1920); ap.add_argument("--h", type=int, default=1080)
ap.add_argument("--crf", type=int, default=17); ap.add_argument("--audio", action="store_true")
A = ap.parse_args()
W, H, K = A.w, A.h, A.k
es_foto = A.src.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))

def ajustar(fr):  # llenar W x H (cover)
    h, w = fr.shape[:2]; s = max(W / w, H / h)
    fr = cv2.resize(fr, (round(w * s), round(h * s)), interpolation=cv2.INTER_LANCZOS4 if s > 1 else cv2.INTER_AREA)
    y, x = (fr.shape[0] - H) // 2, (fr.shape[1] - W) // 2
    return fr[y:y + H, x:x + W]

if es_foto:
    foto = ajustar(cv2.imread(A.src)); fps = A.fps; total = n = int(round(A.dur * fps)); i0 = 0
else:
    cap = cv2.VideoCapture(A.src); fps = cap.get(cv2.CAP_PROP_FPS); total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); cap.release()
    i0 = A.desde; n = min(A.frames or total, total - i0)

# ---------- profundidad ----------
import torch
from transformers import AutoImageProcessor, AutoModelForDepthEstimation
torch.set_num_threads(os.cpu_count() or 4)
mid = "depth-anything/Depth-Anything-V2-Small-hf"
proc = AutoImageProcessor.from_pretrained(mid); model = AutoModelForDepthEstimation.from_pretrained(mid).eval()
def prof(fr):
    rgb = cv2.cvtColor(cv2.resize(fr, (640, 360), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)
    with torch.no_grad(): d = model(**proc(images=rgb, return_tensors="pt")).predicted_depth[0].numpy()
    return gaussian_filter(cv2.resize(d, (480, 270), interpolation=cv2.INTER_CUBIC), 2.5)

def leer(idx):  # cuadros pedidos (ordenados) en una sola pasada secuencial (exacto, sin seek)
    want, out, c = set(idx), {}, cv2.VideoCapture(A.src)
    for j in range(max(idx) + 1):
        if j in want:
            ok, fr = c.read()
            if ok: out[j] = ajustar(fr)
        elif not c.grab(): break
    c.release(); return out

if es_foto:
    keys = {0: prof(foto)}; refs = [keys[0]]
else:
    g0 = (i0 // A.paso) * A.paso
    kidx = list(range(g0, min(i0 + n + A.paso, total - 1) + 1, A.paso))
    ridx = [int(total * f) for f in (0.1, 0.3, 0.5, 0.7, 0.9)]
    frs = leer(sorted(set(kidx + ridx)))
    keys = {k: prof(frs[k]) for k in kidx if k in frs}; refs = [prof(frs[k]) for k in ridx if k in frs]; del frs
del model, proc; torch.set_num_threads(1)
R_ = np.stack(refs); hh, ww = R_.shape[1:]
lo = np.percentile(R_, 3); hi = np.percentile(R_[:, hh // 6: hh * 5 // 6, ww // 3: ww * 2 // 3], 90)  # sujeto central = 1
norm = lambda d: (0.15 + 0.85 * np.clip((d - lo) / (hi - lo + 1e-6), 0, 1)).astype(np.float32)
ks = sorted(keys); Kd = [norm(keys[k]) for k in ks]
def disp(i):
    if len(ks) == 1: return Kd[0]
    j = min(max(np.searchsorted(ks, i, side="right") - 1, 0), len(ks) - 2)
    a = np.clip((i - ks[j]) / (ks[j + 1] - ks[j]), 0, 1); a = a * a * (3 - 2 * a)
    return Kd[j] * (1 - a) + Kd[j + 1] * a

# ---------- trayectoria real del banco (depende SÓLO de --seed) ----------
B = np.load(A.banco); nombres = sorted(B.files)
rng = np.random.default_rng(A.seed)
T = B[nombres[A.seed % len(nombres)]].astype(np.float64); fps_t = 30.0
T = np.concatenate([T, T[::-1]])                         # ida y vuelta: periódica, sin costura
T = np.roll(T, -rng.integers(0, len(T)), axis=0)
def limitar(x, f=1.6):                                   # límite suave de velocidad y aceleración
    v = np.diff(x, append=x[0]); vl = np.percentile(np.abs(v), 90) * f + 1e-12
    v = vl * np.tanh(v / vl); a = np.diff(v, append=v[0]); al = np.percentile(np.abs(a), 90) * f + 1e-12
    a = al * np.tanh(a / al); a -= a.mean(); v = np.cumsum(a); v -= v.mean(); x = np.cumsum(v)
    return x - gaussian_filter1d(x, fps_t * 6, mode="wrap")
T = np.stack([limitar(T[:, c]) for c in range(4)], 1)
T = gaussian_filter1d(T, 1.2, axis=0, mode="wrap")
p95 = lambda v: np.percentile(np.abs(v - np.median(v)), 95) + 1e-12
f = W / (2 * np.tan(np.radians(62) / 2))                 # lente de celular ~62°
yaw = T[:, 0] / p95(T[:, 0]) * np.radians(0.45) * K
pitch = T[:, 1] / p95(T[:, 1]) * np.radians(0.35) * K
roll = T[:, 2] / p95(T[:, 2]) * np.radians(0.30) * K
sx = gaussian_filter1d(T[:, 0], fps_t * 0.8, mode="wrap"); sy = gaussian_filter1d(T[:, 1], fps_t * 0.8, mode="wrap")
par_x = sx / p95(sx) * 12 * K; par_y = sy / p95(sy) * 7 * K
tz = gaussian_filter1d(T[:, 3], fps_t * 0.5, mode="wrap"); tz = tz / p95(tz) * 0.007 * K
gz = np.abs(np.gradient(tz)); foco = gaussian_filter1d(np.clip(gz / (np.percentile(gz, 95) + 1e-12), 0, 1) * 0.18, fps_t * 0.4, mode="wrap")
expo = gaussian_filter1d(rng.normal(size=len(T)), fps_t * 1.5, mode="wrap"); expo = expo / p95(expo) * 0.01
tt = np.arange(len(T)) / fps_t; L = len(T) / fps_t
def at(arr, t): return np.interp(t % L, tt, arr, period=L)

BASE = 1 + 2 * (f * np.tan(np.abs(yaw).max()) + np.abs(par_x).max()) / W + np.sin(np.abs(roll).max()) * (W / H) + 0.004
BASE = max(BASE, 1 + 2 * (f * np.tan(np.abs(pitch).max()) + np.abs(par_y).max()) / H + 0.004)

uu, vv = np.meshgrid(np.arange(W, dtype=np.float32), np.arange(H, dtype=np.float32))
cx, cy = W / 2, H / 2; X0 = (uu - cx) / BASE; Y0 = (vv - cy) / BASE
def Rinv(y, p, r):
    c, s = np.cos, np.sin
    Ry = np.array([[c(y), 0, s(y)], [0, 1, 0], [-s(y), 0, c(y)]]); Rx = np.array([[1, 0, 0], [0, c(p), -s(p)], [0, s(p), c(p)]])
    Rz = np.array([[c(r), -s(r), 0], [s(r), c(r), 0], [0, 0, 1]]); return (Rz @ Rx @ Ry).T

cmd = ["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{W}x{H}", "-r", f"{fps:.6f}", "-i", "-"]
if A.audio and not es_foto: cmd += ["-ss", f"{i0 / fps:.6f}", "-t", f"{n / fps:.6f}", "-i", A.src, "-map", "0:v", "-map", "1:a?", "-c:a", "aac", "-b:a", "192k"]
cmd += ["-c:v", "libx264", "-crf", str(A.crf), "-preset", "medium", "-pix_fmt", "yuv420p", "-video_track_timescale", "90000", A.out]
ff = subprocess.Popen(cmd, stdin=subprocess.PIPE)
if not es_foto:
    cap = cv2.VideoCapture(A.src)
    for _ in range(i0): cap.grab()
for k in range(n):
    i = i0 + k
    if es_foto: fr = foto
    else:
        ok, fr = cap.read()
        if not ok: break
        fr = ajustar(fr)
    w = cv2.resize(disp(i), (W, H), interpolation=cv2.INTER_LINEAR)
    acc = np.zeros(fr.shape, np.float32)
    for s in range(A.sub):
        t = (i + (s / A.sub - 0.5) * 0.5) / fps                 # tiempo GLOBAL del reel
        M = Rinv(at(yaw, t), at(pitch, t), at(roll, t))
        a = M[0, 0] * X0 + M[0, 1] * Y0 + M[0, 2] * f; b = M[1, 0] * X0 + M[1, 1] * Y0 + M[1, 2] * f
        c = M[2, 0] * X0 + M[2, 1] * Y0 + M[2, 2] * f
        z = 1 - at(tz, t) * w
        mx = (f * a / c) * z - at(par_x, t) * w + cx; my = (f * b / c) * z - at(par_y, t) * w + cy
        acc += cv2.remap(fr, mx.astype(np.float32), my.astype(np.float32), cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    img = acc / A.sub
    fb = at(foco, i / fps)
    if fb > 0.01: img = img * (1 - fb) + cv2.GaussianBlur(img, (0, 0), 1.3) * fb
    img *= 1 + at(expo, i / fps)
    ff.stdin.write(np.clip(img + 0.5, 0, 255).astype(np.uint8).tobytes())
ff.stdin.close(); ff.wait()
print("ok", A.out, "cuadros", n, "desde", i0, "base", round(BASE, 3), "tray", nombres[A.seed % len(nombres)])
