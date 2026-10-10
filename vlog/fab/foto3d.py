# -*- coding: utf-8 -*-
# FOTO 3D: una foto quieta → clip de 121 cuadros (4,03 s a 30 fps) con movimiento de cámara REAL por profundidad
# (Depth Anything V2 small ONNX, local y gratis): lo cercano se mueve más que el fondo = paralaje, no un zoom plano.
#   python vlog/fab/foto3d.py <foto.png> <salida.mp4> [modo 0-5]
#   modos: 0 acercar · 1 alejar · 2 ir a la izquierda · 3 ir a la derecha · 4 subir · 5 acercar en diagonal
import sys, subprocess, numpy as np, cv2
MODELO = "D:/rtmp/fab/modelos/depth_v2_small.onnx"
_ses = None
def profundidad(img):
    global _ses
    if _ses is None:
        import onnxruntime as o
        _ses = o.InferenceSession(MODELO, providers=["CPUExecutionProvider"])
    x = cv2.resize(cv2.cvtColor(img, cv2.COLOR_BGR2RGB), (518, 294), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
    x = (x - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    d = _ses.run(None, {"pixel_values": x.transpose(2, 0, 1)[None].astype(np.float32)})[0][0]
    d = cv2.resize(d, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_CUBIC)
    d = (d - np.percentile(d, 2)) / max(1e-6, np.percentile(d, 98) - np.percentile(d, 2))
    return cv2.GaussianBlur(np.clip(d, 0, 1), (0, 0), 9)          # 1 = cerca · 0 = lejos (suave: sin desgarros)

def clip(src, dst, modo=0, n=121, w=1920, h=1080):
    img = cv2.resize(cv2.imread(src), (int(w * 1.06), int(h * 1.06)), interpolation=cv2.INTER_CUBIC)   # margen para no ver bordes
    H, W = img.shape[:2]; d = profundidad(img)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32); cx, cy = W / 2, H / 2
    ff = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "bgr24", "-s", f"{w}x{h}", "-r", "30", "-i", "-",
                           "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-pix_fmt", "yuv420p", "-an", dst], stdin=subprocess.PIPE)
    for i in range(n):
        t = i / (n - 1); e = t * t * (3 - 2 * t) * 0.35 + t * 0.65          # casi lineal, arranque suave
        par = 0.6 + 0.8 * d                                                  # cuánto se mueve cada pixel según su cercanía
        z = {0: 0.07 * e, 1: 0.07 * (1 - e), 5: 0.06 * e}.get(modo, 0.025)
        tx = {2: -0.028 * W * e, 3: 0.028 * W * e, 5: 0.015 * W * e}.get(modo, 0.0)
        ty = {4: -0.025 * H * e}.get(modo, 0.0)
        s = 1 + z * par
        mx = cx + (xx - cx) / s - tx * (par - 0.6)
        my = cy + (yy - cy) / s - ty * (par - 0.6)
        fr = cv2.remap(img, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        oy, ox = (H - h) // 2, (W - w) // 2
        ff.stdin.write(np.ascontiguousarray(fr[oy:oy + h, ox:ox + w]).tobytes())
    ff.stdin.close(); ff.wait()

if __name__ == "__main__":
    clip(sys.argv[1], sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 0)
