# corte.py <in_c.mp4> <out.webm>: recorta el perro cuadro a cuadro (rembg u2net) → VP9 con alfa, 1280x720, 24 fps, 7.5 s
import sys, subprocess, numpy as np
from rembg import new_session, remove
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
W, H, N = 1280, 720, 180
ses = new_session("u2net")
dec = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-i", src, "-frames:v", str(N), "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
enc = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", "24", "-i", "-",
                        "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "2M", "-auto-alt-ref", "0", "-deadline", "realtime", "-cpu-used", "8", dst], stdin=subprocess.PIPE)
n = 0
while True:
    b = dec.stdout.read(W * H * 3)
    if len(b) < W * H * 3: break
    im = Image.frombytes("RGB", (W, H), b)
    m = remove(im, session=ses, only_mask=True, post_process_mask=True)
    a = np.dstack([np.asarray(im), np.asarray(m.convert("L"))])
    enc.stdin.write(a.astype(np.uint8).tobytes()); n += 1
enc.stdin.close(); enc.wait(); print(dst, n, "cuadros")
