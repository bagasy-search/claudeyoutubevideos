# modal_seg.py — máscara de SUJETO (BiRefNet, MIT) en GPU de Modal para el 2.5D: recorte sólido de personas/objetos.
# Uso: PYTHONUTF8=1 modal run modal_seg.py --src public/img/nrtinnitus --out public/img/nrtinnitus/seg
import modal, os, io
app = modal.App("birefnet-seg")
image = (modal.Image.debian_slim().apt_install("libgl1", "libglib2.0-0")
         .pip_install("torch", "torchvision", "transformers==4.46.3", "timm", "kornia", "einops", "pillow", "numpy"))

@app.function(image=image, gpu="T4", timeout=1800)
def seg_batch(items):
    import torch, numpy as np
    from PIL import Image
    from torchvision import transforms
    from transformers import AutoModelForImageSegmentation
    m = AutoModelForImageSegmentation.from_pretrained("ZhengPeng7/BiRefNet", trust_remote_code=True).cuda().eval().half()
    tf = transforms.Compose([transforms.Resize((1024, 1024)), transforms.ToTensor(),
                             transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
    out = []
    for name, b in items:
        im = Image.open(io.BytesIO(b)).convert("RGB")
        x = tf(im).unsqueeze(0).cuda().half()
        with torch.no_grad(): p = m(x)[-1].sigmoid().float().cpu()[0, 0].numpy()
        mk = Image.fromarray((p * 255).astype("uint8")).resize(im.size, Image.BILINEAR)
        buf = io.BytesIO(); mk.save(buf, "PNG"); out.append((name, buf.getvalue()))
    return out

@app.local_entrypoint()
def main(src: str, out: str):
    os.makedirs(out, exist_ok=True)
    files = sorted(f for f in os.listdir(src) if f.lower().endswith(".jpg") and "_blur" not in f and f.startswith("m") and not os.path.exists(os.path.join(out, f[:-4] + ".png")))
    items = [(f, open(os.path.join(src, f), "rb").read()) for f in files]
    print(f"seg: {len(items)} imágenes")
    for i in range(0, len(items), 40):
        for name, b in seg_batch.remote(items[i:i + 40]):
            open(os.path.join(out, name[:-4] + ".png"), "wb").write(b)
        print(f"  {min(i + 40, len(items))}/{len(items)}")
    print(f"✓ {len(os.listdir(out))} máscaras en {out}")
