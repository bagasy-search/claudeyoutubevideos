# modal_matte.py — ALFA del presentador cuadro por cuadro (Robust Video Matting, GPL-3.0 sólo como
# herramienta, no se distribuye) en GPU de Modal. RVM es recurrente: el recorte NO parpadea entre
# cuadros, que es lo que delata un compositing hecho con un segmentador de fotos.
# Uso (lo llama factory/tools/matte.mjs):
#   python -m modal run factory/py/modal_matte.py --src <ventana.mp4> --out <alpha.mp4>
import modal

app = modal.App("rvm-matte")
image = (modal.Image.debian_slim().apt_install("ffmpeg", "libgl1", "libglib2.0-0")
         .pip_install("torch==2.3.1", "torchvision==0.18.1", "av==12.3.0", "pims==0.6.1", "tqdm", "numpy<2"))


@app.function(image=image, gpu="T4", timeout=1800)
def matte(data: bytes) -> bytes:
    import os, subprocess, tempfile, torch
    d = tempfile.mkdtemp()
    src, alpha, out = os.path.join(d, "in.mp4"), os.path.join(d, "alpha_raw.mp4"), os.path.join(d, "alpha.mp4")
    open(src, "wb").write(data)
    model = torch.hub.load("PeterL1n/RobustVideoMatting", "resnet50", trust_repo=True).cuda().eval()
    convert = torch.hub.load("PeterL1n/RobustVideoMatting", "converter", trust_repo=True)
    # downsample 0.4 para 1080p (recomendado por RVM para cuerpo entero/medio cuerpo)
    convert(model, input_source=src, output_type="video", output_alpha=alpha,
            downsample_ratio=0.4, seq_chunk=12, output_video_mbps=40)
    # a gris de un canal, mismos cuadros y fps que la fuente
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", alpha, "-vf", "format=gray", "-c:v", "libx264", "-crf", "12", "-pix_fmt", "yuv420p", out], check=True)
    return open(out, "rb").read()


@app.local_entrypoint()
def main(src: str, out: str):
    b = matte.remote(open(src, "rb").read())
    open(out, "wb").write(b)
    print(f"alpha: {len(b)} bytes -> {out}")
