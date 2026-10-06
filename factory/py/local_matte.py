# local_matte.py — RESPALDO LOCAL (CPU) de modal_matte.py cuando Modal no tiene saldo (30-sep-2026).
# Alfa del presentador cuadro por cuadro con rembg (u2net_human_seg, ONNX CPU) a 640 px, reescalado al
# tamaño de la ventana. Un segmentador de fotos PARPADEA entre cuadros (RVM no, por ser recurrente):
# se suaviza con una media exponencial de la máscara (EMA 0,55) y un blur leve del borde.
#   python factory/py/local_matte.py --src <ventana.mp4> --out <alpha.mp4>
import argparse, subprocess, json
import numpy as np


def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--src", required=True); ap.add_argument("--out", required=True)
    a = ap.parse_args()
    import cv2
    from PIL import Image
    from rembg import remove, new_session
    pr = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", a.src]))["streams"][0]
    W, H = pr["width"], pr["height"]
    fps = pr["r_frame_rate"]
    sw, sh = 640, int(round(640 * H / W / 2) * 2)
    rd = subprocess.Popen(["ffmpeg", "-v", "error", "-i", a.src, "-vf", f"scale={sw}:{sh}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], stdout=subprocess.PIPE)
    wr = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "gray", "-s", f"{W}x{H}", "-r", fps, "-i", "-",
                           "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", a.out], stdin=subprocess.PIPE)
    sess = new_session("u2net_human_seg")
    ema, n = None, 0
    while True:
        buf = rd.stdout.read(sw * sh * 3)
        if len(buf) < sw * sh * 3: break
        fr = np.frombuffer(buf, np.uint8).reshape(sh, sw, 3)
        m = np.array(remove(Image.fromarray(fr), session=sess, only_mask=True).convert("L"), dtype=np.float32)
        ema = m if ema is None else 0.55 * m + 0.45 * ema
        big = cv2.GaussianBlur(cv2.resize(ema, (W, H), interpolation=cv2.INTER_LINEAR), (5, 5), 0)
        wr.stdin.write(np.clip(big, 0, 255).astype(np.uint8).tobytes()); n += 1
        if n % 60 == 0: print(f"  matte local: {n} cuadros", flush=True)
    wr.stdin.close(); wr.wait(); rd.wait()
    print(f"alpha local: {n} cuadros -> {a.out}")


if __name__ == "__main__":
    main()
