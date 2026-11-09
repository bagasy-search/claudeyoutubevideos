# reelfix_farm.py <slug>: reel sin mosaico en el farm (persona u2net sobre placa limpia). Entrada ./reel0.mp4, salida w/reel0_fixa.mp4
# Guarda el ORIGINAL pago en D:/rtmp/avatar_reels/<slug>/ (nunca se toca), deja reel0.mp4 con audio en public/<slug>/ y av_still.png.
import subprocess, numpy as np, cv2, sys, os, shutil, time, json, onnxruntime as ort
S = sys.argv[1]; D = "w/"; os.makedirs(D, exist_ok=True)
SRC = "reel0.mp4"

W, H, FPS = 832, 464, 25
import gc
def seguro(fn, *a):  # la PC se queda sin memoria a ratos: reintenta en vez de morir
    while True:
        try: return fn(*a)
        except (MemoryError, cv2.error, ort.capi.onnxruntime_pybind11_state.RuntimeException, ort.capi.onnxruntime_pybind11_state.Fail): gc.collect(); time.sleep(20)
if not os.path.exists(D + "masks.npy"):
    so = ort.SessionOptions(); so.intra_op_num_threads = 4; so.enable_cpu_mem_arena = False
    s = ort.InferenceSession("u2net_human_seg.onnx", so, providers=["CPUExecutionProvider"]); n = s.get_inputs()[0].name
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", SRC], capture_output=True, text=True).stdout); total = int(dur * FPS - 1) // 25 + 1
    def abre(ini): return subprocess.Popen(["ffmpeg", "-v", "error", "-ss", str(ini), "-i", SRC, "-vf", "select='not(mod(n\\,25))',format=rgb24", "-fps_mode", "passthrough", "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    def paso(b):
        im = np.frombuffer(b, np.uint8).reshape(H, W, 3)
        x = cv2.resize(im, (320, 320), interpolation=cv2.INTER_AREA) / 255.0
        x = ((x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]).transpose(2, 0, 1)[None].astype(np.float32)
        o = s.run(None, {n: x})[0][0, 0]; o = (o - o.min()) / (o.max() - o.min() + 1e-8)
        return (cv2.resize(o, (W, H)) * 255).astype(np.uint8)
    out = []; t0 = time.time(); p = abre(0); cortes = 0
    while len(out) < total:
        b = seguro(p.stdout.read, W * H * 3)
        if len(b) < W * H * 3:  # ffmpeg murió sin memoria: se retoma desde el segundo que falta, nunca se guarda a medias
            cortes += 1
            if cortes > 5: sys.exit(f"ffmpeg cortó {cortes} veces en {len(out)}/{total}")
            gc.collect(); time.sleep(6); p = abre(len(out)); continue
        out.append(seguro(paso, b))
        if len(out) % 50 == 0: print(len(out), round(time.time() - t0), flush=True)
    p.kill(); np.save(D + "masks.npy", np.stack(out)); print("mascaras", len(out), "de", total, flush=True)
M = np.load(D + "masks.npy", mmap_mode="r")  # sin copiar a RAM (float32 = 700 MB; la PC está sin memoria)
def Mf(i): return M[i].astype(np.float32) / 255.0
def frames(t0=0.0, n=None):
    cmd = ["ffmpeg", "-v", "error", "-ss", f"{t0:.3f}", "-i", SRC] + (["-frames:v", str(n)] if n else []) + ["-f", "rawvideo", "-pix_fmt", "rgb24", "-"]
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE)
    while True:
        b = seguro(p.stdout.read, W * H * 3)
        if len(b) < W * H * 3: return
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)
K15 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (31, 31))
def mediana(ts):
    st, ms = [], []
    for k in ts:
        a = min(int(k), len(M) - 2); st.append(next(frames(k, 1)).astype(np.float32))
        ms.append(cv2.dilate((np.maximum(Mf(a), Mf(a + 1)) > 0.15).astype(np.uint8), K15) > 0)
    st = np.stack(st); st[np.stack(ms)] = np.nan
    return np.nanmedian(st, axis=0)
if os.path.exists(D + "plate.png"): plate = cv2.imread(D + "plate.png")[..., ::-1].astype(np.float32)
else:
    plate = mediana(np.arange(0, 10.6, 0.5)); hole = np.isnan(plate[..., 0])
    if hole.any():
        v1 = mediana(np.arange(10, 110, 2.0)); plate[hole] = v1[hole]
        h2 = np.isnan(plate[..., 0])
        if h2.any():
            p8 = np.nan_to_num(plate).clip(0, 255).astype(np.uint8)
            plate = cv2.inpaint(p8, h2.astype(np.uint8), 5, cv2.INPAINT_TELEA).astype(np.float32)
    plate = plate.clip(0, 255).astype(np.uint8); cv2.imwrite(D + "plate.png", plate[..., ::-1]); plate = plate.astype(np.float32)
K6 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))
def alfa(i):
    t = i / FPS; a = min(int(np.floor(t)), len(M) - 1); b = min(a + 1, len(M) - 1)
    m = np.maximum(Mf(a), Mf(b)); m = np.clip((m - 0.08) / 0.35, 0, 1); m = cv2.dilate(m, K6)
    return cv2.GaussianBlur(m, (0, 0), 1.2)[..., None]
if len(sys.argv) > 2:
    t = float(sys.argv[2]); i = int(round(t * FPS)); f = next(frames(t, 1)); a = alfa(i)
    o = (f * a + plate * (1 - a)).astype(np.uint8); cv2.imwrite(D + f"prueba_{sys.argv[2]}.jpg", np.concatenate([f, o], 1)[..., ::-1]); sys.exit()
FIX = D + "reel0_fix.mp4"; A = D + "reel0_fixa.mp4"
enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-c:v", "libx264", "-preset", "medium", "-crf", "14", "-g", "25", "-keyint_min", "25", "-pix_fmt", "yuv420p", "-threads", "4",
                        "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", FIX], stdin=subprocess.PIPE)
for i, f in enumerate(frames()):
    a = seguro(alfa, i); enc.stdin.write(seguro(lambda: (f * a + plate * (1 - a)).astype(np.uint8).tobytes()))
    if i % 1000 == 0: print(i, flush=True)
enc.stdin.close(); enc.wait(); print("video", i + 1, flush=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", FIX, "-i", SRC, "-map", "0:v", "-map", "1:a", "-c", "copy", A], check=True)
dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", A], capture_output=True, text=True).stdout)
for t_ in (30, 300, 450, dur - 5):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t_), "-i", SRC, "-ss", str(t_), "-i", A, "-frames:v", "1", "-filter_complex", "hstack", f"w/cmp_{int(t_)}.jpg"], check=True)
print("LISTO", S, flush=True)
