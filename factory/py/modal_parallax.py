# modal_parallax.py — capas 2.5D para las FOTOS del montaje (paquete de efectos, factory/lib/fxpack.mjs).
# Por cada imagen: máscara del sujeto (BiRefNet, MIT) → <name>_pf.webp (primer plano RGBA, cuadro entero)
# y <name>_pb.jpg (fondo con el sujeto borrado por inpainting, para que al mover las capas no aparezca
# un "fantasma" del sujeto detrás). Se imprime la cobertura de cada máscara: la fábrica sólo usa las que
# caen entre 4 % y 65 % del cuadro (0 = no encontró sujeto; casi 100 = recortó el fondo entero).
#   python -m modal run factory/py/modal_parallax.py --lista <lista.txt> --out <dir>
# lista = rutas absolutas de JPG, una por línea. Reanudable: saltea las que ya tienen sus dos salidas.
import modal, os, io, json

app = modal.App("parallax-2p5d")
image = (modal.Image.debian_slim().apt_install("libgl1", "libglib2.0-0")
         .pip_install("torch", "torchvision", "transformers==4.46.3", "timm", "kornia", "einops", "pillow", "numpy", "opencv-python-headless"))


@app.function(image=image, gpu="T4", timeout=3600)
def capas(items):
    import torch, numpy as np, cv2
    from PIL import Image
    from torchvision import transforms
    from transformers import AutoModelForImageSegmentation
    m = AutoModelForImageSegmentation.from_pretrained("ZhengPeng7/BiRefNet", trust_remote_code=True).cuda().eval().half()
    tf = transforms.Compose([transforms.Resize((1024, 1024)), transforms.ToTensor(),
                             transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])
    out = []
    for name, b in items:
        im = Image.open(io.BytesIO(b)).convert("RGB")
        W, H = im.size
        with torch.no_grad():
            p = m(tf(im).unsqueeze(0).cuda().half())[-1].sigmoid().float().cpu()[0, 0].numpy()
        mk = cv2.resize((p * 255).astype("uint8"), (W, H), interpolation=cv2.INTER_LINEAR)
        cov = float((mk > 128).mean())
        rgba = im.copy(); rgba.putalpha(Image.fromarray(mk))
        fb = io.BytesIO(); rgba.save(fb, "WEBP", quality=88, method=4)
        # fondo: borrar el sujeto (máscara dilatada) con inpainting a media resolución
        arr = np.array(im)
        small = cv2.resize(arr, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
        msk = cv2.resize(((mk > 60) * 255).astype("uint8"), (W // 2, H // 2), interpolation=cv2.INTER_NEAREST)
        msk = cv2.dilate(msk, np.ones((25, 25), np.uint8))
        fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), msk, 9, cv2.INPAINT_TELEA)
        fill = cv2.cvtColor(cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB)
        m3 = cv2.resize(msk, (W, H))[..., None] / 255.0
        bg = (arr * (1 - m3) + fill * m3).astype("uint8")
        bb = io.BytesIO(); Image.fromarray(bg).save(bb, "JPEG", quality=88)
        out.append((name, fb.getvalue(), bb.getvalue(), cov))
    return out


@app.local_entrypoint()
def main(lista: str, out: str):
    os.makedirs(out, exist_ok=True)
    rutas = [l.strip() for l in open(lista, encoding="utf-8") if l.strip()]
    pend = []
    for r in rutas:
        n = os.path.splitext(os.path.basename(r))[0]
        if os.path.exists(os.path.join(out, f"{n}_pf.webp")) and os.path.exists(os.path.join(out, f"{n}_pb.jpg")):
            continue
        pend.append((n, open(r, "rb").read()))
    print(f"parallax: {len(rutas)} imágenes · {len(pend)} pendientes")
    cov = {}
    covf = os.path.join(out, "_parallax_cov.json")
    if os.path.exists(covf): cov = json.load(open(covf))
    lotes = [pend[i:i + 24] for i in range(0, len(pend), 24)]
    for res in capas.map(lotes):
        for n, fg, bg, c in res:
            open(os.path.join(out, f"{n}_pf.webp"), "wb").write(fg)
            open(os.path.join(out, f"{n}_pb.jpg"), "wb").write(bg)
            cov[n] = round(c, 4)
        json.dump(cov, open(covf, "w"), indent=1)
        print(f"  lote listo · total con capas {len(cov)}")
    usables = sum(1 for v in cov.values() if 0.04 <= v <= 0.65)
    print(f"GATE parallaxCapas: midió={len(cov)} sobre {len(rutas)} · usables (4-65 %) {usables}")
