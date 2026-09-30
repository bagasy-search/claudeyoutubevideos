# modal_seg.py — recorte de OBJETO/SUJETO con alfa (BiRefNet, MIT) en GPU de Modal → PNG RGBA.
# Para las piezas flotantes de la edición (cascada de precios, recortes 2.5D). Procedencia: modal_seg.py
# de nrtinnitus (sólo máscara); acá devuelve el PNG ya recortado.
#   python -m modal run factory/py/modal_seg.py --src <a.png,b.jpg,...> --out <dir>
import modal, os, io

app = modal.App("birefnet-cutout")
image = (modal.Image.debian_slim().apt_install("libgl1", "libglib2.0-0")
         .pip_install("torch", "torchvision", "transformers==4.46.3", "timm", "kornia", "einops", "pillow", "numpy"))


@app.function(image=image, gpu="T4", timeout=1800)
def cut(items):
    import torch
    from PIL import Image
    from torchvision import transforms
    from transformers import AutoModelForImageSegmentation
    m = AutoModelForImageSegmentation.from_pretrained("ZhengPeng7/BiRefNet", trust_remote_code=True).cuda().eval().half()
    tf = transforms.Compose([transforms.Resize((1024, 1024)), transforms.ToTensor(),
                             transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
    out = []
    for name, b in items:
        im = Image.open(io.BytesIO(b)).convert("RGB")
        with torch.no_grad():
            p = m(tf(im).unsqueeze(0).cuda().half())[-1].sigmoid().float().cpu()[0, 0].numpy()
        mk = Image.fromarray((p * 255).astype("uint8")).resize(im.size, Image.BILINEAR)
        rgba = im.copy(); rgba.putalpha(mk)
        bb = rgba.getbbox()
        if bb: rgba = rgba.crop(bb)                       # sin aire de más: el componente lo acomoda
        buf = io.BytesIO(); rgba.save(buf, "PNG"); out.append((name, buf.getvalue()))
    return out


@app.local_entrypoint()
def main(src: str, out: str):
    os.makedirs(out, exist_ok=True)
    files = [f for f in src.split(",") if f]
    res = cut.remote([(os.path.splitext(os.path.basename(f))[0], open(f, "rb").read()) for f in files])
    for name, b in res:
        open(os.path.join(out, name + ".png"), "wb").write(b)
    print(f"✓ {len(res)} recortes en {out}")
