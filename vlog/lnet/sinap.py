# Hoja a ojo de las imágenes agnes_img_pro que el juez no aprobó (muchas por 429) + aceptar las buenas.
#   python vlog/lnet/sinap.py <slug>                → _v3/<slug>_sinap_<k>.jpg (rotuladas)
#   python vlog/lnet/sinap.py <slug> --ok all|n1,n2 [--no n3,n4]   → copia la última versión como public/img/<slug>/<n>.jpg
import json, os, sys, glob
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; R = "D:/Proyectos/video2-wt/lnet/"; P = R + f"public/img/{S}/_agnes_pro/"
names = [x["name"] for x in json.load(open(P + "_sin_aprobar.json", encoding="utf8"))] if os.path.exists(P + "_sin_aprobar.json") else []
def last(n):
    c = sorted(glob.glob(P + f"_rechazadas/{n}__r*.png") + glob.glob(P + f"_raw/{n}.png"), key=os.path.getmtime)  # la MÁS NUEVA (una corrida nueva reescribe __r1)
    return c[-1] if c else None
arg = sys.argv[2:]
if "--ok" in arg:
    ok = arg[arg.index("--ok") + 1]; no = set(arg[arg.index("--no") + 1].split(",")) if "--no" in arg else set()
    sel = names if ok == "all" else ok.split(","); n_ok = 0
    for n in sel:
        f = last(n)
        if n in no or not f: continue
        Image.open(f).convert("RGB").save(R + f"public/img/{S}/{n}.jpg", quality=90); n_ok += 1
    print(f"{S}: aceptadas a ojo {n_ok}/{len(names)}"); sys.exit()
fs = [(n, last(n)) for n in names if last(n)]
font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 22); W, H = 400, 225
for k in range(0, len(fs), 30):
    ch = fs[k:k + 30]; sh = Image.new("RGB", (W * 6, H * ((len(ch) + 5) // 6)), "white")
    for i, (n, f) in enumerate(ch):
        im = Image.open(f).convert("RGB").resize((W, H)); d = ImageDraw.Draw(im); d.rectangle([0, 0, 120, 28], fill="black"); d.text((4, 2), n, font=font, fill="yellow")
        sh.paste(im, ((i % 6) * W, (i // 6) * H))
    sh.save(R + f"_v3/{S}_sinap_{k // 30}.jpg", quality=80)
print(S, len(fs), "sin aprobar en hojas")
