# reelfix_farm.py <src.mp4> <out_dir> [x0,x1,y0] — saca el MOSAICO de un reel de avatar (InfiniteTalk lo mete a partir de ~130 s):
# máscara u2net_human_seg 1/s → placa limpia (mediana del fondo sin la persona) → persona sobre la placa → parche fijo en los pies
# (la máscara deja pasar el mosaico en las botas; x0,x1,y0 = caja del parche, "" = sin parche). Sale <out_dir>/reel0.mp4 con el
# audio original + av_still.png. Lo corre .github/workflows/reelfix.yml en el runner (8-nov-2026, sesión premium8n_I).
import subprocess, sys, os, time, gc, numpy as np, cv2, onnxruntime as ort
SRC, OUT = sys.argv[1], sys.argv[2]; os.makedirs(OUT, exist_ok=True)
FOOT = [int(v) for v in sys.argv[3].split(",")] if len(sys.argv) > 3 and sys.argv[3] else None
MODEL = os.environ.get("U2NET", os.path.expanduser("~/.u2net/u2net_human_seg.onnx"))
pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate:format=duration", "-of", "default=nw=1", SRC], capture_output=True, text=True).stdout
kv = dict(l.split("=", 1) for l in pr.split() if "=" in l)
W, H = int(kv["width"]), int(kv["height"]); a_, b_ = kv["r_frame_rate"].split("/"); FPS = round(int(a_) / int(b_)); DUR = float(kv["duration"])
print("reel", W, H, FPS, DUR, flush=True)
def frames(t0=0.0, n=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{t0:.3f}", "-i", SRC] + (["-frames:v", str(n)] if n else []) + ["-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    while True:
        b = p.stdout.read(W * H * 3)
        if len(b) < W * H * 3: return
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)
# 1) máscaras 1 por segundo
so = ort.SessionOptions(); so.intra_op_num_threads = os.cpu_count() or 4
s = ort.InferenceSession(MODEL, so, providers=["CPUExecutionProvider"]); n = s.get_inputs()[0].name
p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", SRC, "-vf", f"select='not(mod(n\\,{FPS}))',format=rgb24", "-vsync", "0", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
M = []; t0 = time.time()
while True:
    b = p.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    im = np.frombuffer(b, np.uint8).reshape(H, W, 3)
    x = cv2.resize(im, (320, 320), interpolation=cv2.INTER_AREA) / 255.0
    x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
    o = s.run(None, {n: x})[0][0, 0]; o = (o - o.min()) / (o.max() - o.min() + 1e-8)
    M.append((cv2.resize(o, (W, H)) * 255).astype(np.uint8))
    if len(M) % 100 == 0: print("mascara", len(M), round(time.time() - t0), flush=True)
need = int(DUR) + 1
if len(M) < need - 1: sys.exit(f"máscaras incompletas {len(M)}/{need}")
M = np.stack(M); print("mascaras", len(M), flush=True)
def Mf(i): return M[i].astype(np.float32) / 255.0
# 2) placa limpia
K15 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31))
def mediana(ts):
    st, ms = [], []
    for k in ts:
        a = min(int(k), len(M) - 2); st.append(next(frames(k, 1)).astype(np.float32))
        ms.append(cv2.dilate((np.maximum(Mf(a), Mf(a + 1)) > 0.15).astype(np.uint8), K15) > 0)
    st = np.stack(st); st[np.stack(ms)] = np.nan
    return np.nanmedian(st, axis=0)
plate = mediana(np.arange(0, 10.6, 0.5)); hole = np.isnan(plate[..., 0])
if hole.any():
    v1 = mediana(np.arange(10, min(110, DUR - 1), 2.0)); plate[hole] = v1[hole]
    h2 = np.isnan(plate[..., 0])
    if h2.any():
        p8 = np.nan_to_num(plate).clip(0, 255).astype(np.uint8)
        plate = cv2.inpaint(p8, h2.astype(np.uint8), 5, cv2.INPAINT_TELEA).astype(np.float32)
plate = plate.clip(0, 255).astype(np.uint8); cv2.imwrite(f"{OUT}/plate.png", plate[..., ::-1]); plate = plate.astype(np.float32)
# 3) parche de pies (de un cuadro limpio, antes del mosaico)
if FOOT:
    x0, x1, y0 = FOOT; F = 26; ref = next(frames(30.0 if DUR > 60 else 2.0, 1)).astype(np.float32)
    fa = np.zeros((H, W), np.float32)
    for y in range(y0, H): fa[y, x0:x1] = min(1.0, (y - y0) / F)
    for x in range(x0, x1): fa[:, x] *= min(1.0, (x - x0) / F, (x1 - 1 - x) / F)
    fa = fa[..., None]
K6 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
def alfa(i):
    t = i / FPS; a = min(int(np.floor(t)), len(M) - 1); b = min(a + 1, len(M) - 1)
    m = np.maximum(Mf(a), Mf(b)); m = np.clip((m - 0.08) / 0.35, 0, 1); m = cv2.dilate(m, K6)
    return cv2.GaussianBlur(m, (0, 0), 1.2)[..., None]
FIX = f"{OUT}/reel0_fix.mp4"
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-g", str(FPS), "-keyint_min", str(FPS), "-pix_fmt", "yuv420p",
                        "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", FIX], stdin=subprocess.PIPE)
i = -1
for i, f in enumerate(frames()):
    a = alfa(i); o = f * a + plate * (1 - a)
    if FOOT: o = ref * fa + o * (1 - fa)
    enc.stdin.write(o.astype(np.uint8).tobytes())
    if i % 1000 == 0: print("cuadro", i, flush=True)
enc.stdin.close(); enc.wait(); print("video", i + 1, flush=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FIX, "-i", SRC, "-map", "0:v", "-map", "1:a", "-c", "copy", f"{OUT}/reel0.mp4"], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "2", "-i", f"{OUT}/reel0.mp4", "-frames:v", "1", f"{OUT}/av_still.png"], check=True)
d2 = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{OUT}/reel0.mp4"], capture_output=True, text=True).stdout)
if abs(d2 - DUR) > 0.15: sys.exit(f"duración distinta {DUR} vs {d2}")
os.remove(FIX); print("LISTO", d2, flush=True)
