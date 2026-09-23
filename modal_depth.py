# modal_depth.py — mapas de PROFUNDIDAD (Depth Anything V2) en GPU de Modal, para el 2.5D del kit.
# Uso: PYTHONUTF8=1 modal run modal_depth.py --src public/img/nrtinnitus --out public/img/nrtinnitus/depth
# Sube cada .jpg (sin _blur), devuelve un PNG 16-bit-equivalente (8-bit, cerca=blanco) del MISMO tamaño.
import modal, os, io
app = modal.App("depth-anything")
image = modal.Image.debian_slim().pip_install("torch", "transformers==4.46.3", "pillow", "numpy")

@app.function(image=image, gpu="T4", timeout=1200)
def depth_batch(items: list[tuple[str, bytes]]) -> list[tuple[str, bytes]]:
    from transformers import pipeline
    from PIL import Image
    import numpy as np
    pipe = pipeline("depth-estimation", model="depth-anything/Depth-Anything-V2-Base-hf", device=0)
    out = []
    for name, b in items:
        im = Image.open(io.BytesIO(b)).convert("RGB")
        d = pipe(im)["predicted_depth"].squeeze().cpu().numpy()
        d = (d - d.min()) / max(1e-6, d.max() - d.min())
        dm = Image.fromarray((d * 255).astype("uint8")).resize(im.size, Image.BICUBIC)
        buf = io.BytesIO(); dm.save(buf, "PNG"); out.append((name, buf.getvalue()))
    return out

@app.local_entrypoint()
def main(src: str, out: str):
    os.makedirs(out, exist_ok=True)
    files = sorted(f for f in os.listdir(src) if f.lower().endswith(".jpg") and "_blur" not in f and not os.path.exists(os.path.join(out, f[:-4] + ".png")))
    items = [(f, open(os.path.join(src, f), "rb").read()) for f in files]
    print(f"depth: {len(items)} imágenes a procesar")
    for i in range(0, len(items), 40):
        for name, b in depth_batch.remote(items[i:i + 40]):
            open(os.path.join(out, name[:-4] + ".png"), "wb").write(b)
        print(f"  {min(i + 40, len(items))}/{len(items)}")
    print(f"✓ {len(os.listdir(out))} mapas en {out}")
