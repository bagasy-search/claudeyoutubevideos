# local_parallax.py — RESPALDO LOCAL (CPU) de modal_parallax.py cuando Modal no tiene saldo
# (medido 30-sep-2026: "workspace has exceeded its spend limit"). Mismas salidas y mismo formato:
#   <out>/<name>_pf.webp (sujeto RGBA, cuadro entero) · <out>/<name>_pb.jpg (fondo con el sujeto borrado)
#   <out>/_parallax_cov.json (cobertura de cada máscara; la fábrica usa 4-65 %)
# Segmentación con rembg (ONNX en CPU, modelo isnet-general-use) en vez de BiRefNet en GPU.
#   python factory/py/local_parallax.py --lista <lista.txt> --out <dir> [--workers 4]
import argparse, os, io, json
from concurrent.futures import ProcessPoolExecutor

MODEL = os.environ.get("PX_MODEL", "isnet-general-use")
_sess = None


def capa(ruta):
    global _sess
    import numpy as np, cv2
    from PIL import Image
    from rembg import remove, new_session
    if _sess is None:
        _sess = new_session(MODEL)
    im = Image.open(ruta).convert("RGB")
    W, H = im.size
    mk = np.array(remove(im, session=_sess, only_mask=True).convert("L").resize((W, H)))
    cov = float((mk > 128).mean())
    rgba = im.copy(); rgba.putalpha(Image.fromarray(mk))
    fb = io.BytesIO(); rgba.save(fb, "WEBP", quality=88, method=4)
    arr = np.array(im)
    small = cv2.resize(arr, (W // 2, H // 2), interpolation=cv2.INTER_AREA)
    msk = cv2.resize(((mk > 60) * 255).astype("uint8"), (W // 2, H // 2), interpolation=cv2.INTER_NEAREST)
    msk = cv2.dilate(msk, np.ones((25, 25), np.uint8))
    fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), msk, 9, cv2.INPAINT_TELEA)
    fill = cv2.cvtColor(cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB)
    m3 = cv2.resize(msk, (W, H))[..., None] / 255.0
    bg = (arr * (1 - m3) + fill * m3).astype("uint8")
    bb = io.BytesIO(); Image.fromarray(bg).save(bb, "JPEG", quality=88)
    return os.path.splitext(os.path.basename(ruta))[0], fb.getvalue(), bb.getvalue(), cov


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lista", required=True); ap.add_argument("--out", required=True); ap.add_argument("--workers", type=int, default=4)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    rutas = [l.strip() for l in open(a.lista, encoding="utf-8") if l.strip()]
    pend = [r for r in rutas if not (os.path.exists(os.path.join(a.out, os.path.splitext(os.path.basename(r))[0] + "_pf.webp"))
                                     and os.path.exists(os.path.join(a.out, os.path.splitext(os.path.basename(r))[0] + "_pb.jpg")))]
    print(f"parallax local ({MODEL}, CPU): {len(rutas)} imágenes · {len(pend)} pendientes", flush=True)
    covf = os.path.join(a.out, "_parallax_cov.json")
    cov = json.load(open(covf)) if os.path.exists(covf) else {}
    with ProcessPoolExecutor(a.workers) as ex:
        for i, (n, fg, bg, c) in enumerate(ex.map(capa, pend), 1):
            open(os.path.join(a.out, f"{n}_pf.webp"), "wb").write(fg)
            open(os.path.join(a.out, f"{n}_pb.jpg"), "wb").write(bg)
            cov[n] = round(c, 4)
            if i % 20 == 0 or i == len(pend):
                json.dump(cov, open(covf, "w"), indent=1); print(f"  {i}/{len(pend)}", flush=True)
    json.dump(cov, open(covf, "w"), indent=1)
    usables = sum(1 for v in cov.values() if 0.04 <= v <= 0.65)
    print(f"GATE parallaxCapas: midió={len(cov)} sobre {len(rutas)} · usables (4-65 %) {usables}")


if __name__ == "__main__":
    main()
