# modal_lama.py — rehace el FONDO de las capas 2.5D con LaMa (inpainting con textura creíble).
# El TELEA de OpenCV deja rayas radiales que asoman en el borde del sujeto cuando las capas se mueven
# (medido 27-sep-2026 en olebreakfast). Toma la máscara del <name>_pf.webp ya hecho (alfa), la dilata
# y reemplaza <name>_pb.jpg.   python -m modal run factory/py/modal_lama.py --dir <px_dir> --src <img_dir>
import modal, os, io

app = modal.App("lama-bg")
image = (modal.Image.debian_slim().apt_install("libgl1", "libglib2.0-0")
         .pip_install("simple-lama-inpainting", "pillow", "numpy", "opencv-python-headless"))


@app.function(image=image, gpu="T4", timeout=3600)
def fondo(items):
    import numpy as np, cv2
    from PIL import Image
    from simple_lama_inpainting import SimpleLama
    lama = SimpleLama()
    out = []
    for name, jpg, pf in items:
        im = Image.open(io.BytesIO(jpg)).convert("RGB")
        a = np.array(Image.open(io.BytesIO(pf)).convert("RGBA"))[..., 3]
        W, H = im.size
        msk = ((a > 40) * 255).astype("uint8")
        msk = cv2.dilate(msk, np.ones((31, 31), np.uint8))
        # LaMa trabaja mejor cerca de 1024: se procesa a media resolución y se re-compone sólo en la máscara
        s = im.resize((W // 2, H // 2), Image.LANCZOS)
        ms = Image.fromarray(cv2.resize(msk, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST))
        r = lama(s, ms).resize((W, H), Image.LANCZOS)
        m3 = cv2.GaussianBlur(msk, (21, 21), 0)[..., None] / 255.0
        bg = (np.array(im) * (1 - m3) + np.array(r)[:H, :W] * m3).astype("uint8")
        b = io.BytesIO(); Image.fromarray(bg).save(b, "JPEG", quality=88)
        out.append((name, b.getvalue()))
    return out


@app.local_entrypoint()
def main(dir: str, src: str):
    items = []
    for f in sorted(os.listdir(dir)):
        if not f.endswith("_pf.webp"): continue
        n = f[:-8]
        items.append((n, open(os.path.join(src, n + ".jpg"), "rb").read(), open(os.path.join(dir, f), "rb").read()))
    print(f"lama: {len(items)} fondos")
    lotes = [items[i:i + 20] for i in range(0, len(items), 20)]
    k = 0
    for res in fondo.map(lotes):
        for n, b in res:
            open(os.path.join(dir, f"{n}_pb.jpg"), "wb").write(b); k += 1
        print(f"  {k}/{len(items)}")
    print(f"GATE lamaFondos: midió={k} sobre {len(items)}")
