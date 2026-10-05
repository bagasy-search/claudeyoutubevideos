# PNG de gptimg → JPG q90 (gen_timeline busca .jpg) + anclas de clips como foto de respaldo (img/<slug>/K<id>.jpg) + hojas de contactos
# de fotos y stock (_v3/<slug>_img*.jpg, _v3/<slug>_stock.jpg) con el _last.jpg de cada stock. SLUG=x python vlog/loretta/post_imgs.py
import glob, os, subprocess, sys
from PIL import Image
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/lor3/"; I = R + f"public/img/{S}/"
for f in glob.glob(I + "*.png"): Image.open(f).convert("RGB").save(f[:-4] + ".jpg", quality=90); os.remove(f)
for f in glob.glob(R + f"vlog/{S}/M1/anc/K*.png"):
    n = os.path.basename(f)[1:-4]
    if "_raw" in f or n == "0": continue
    Image.open(f).convert("RGB").resize((1920, 1080)).save(I + f"K{n}.jpg", quality=88)
fs = sorted(f for f in glob.glob(I + "*.jpg") if not os.path.basename(f).startswith("K"))
sheet = lambda out, files: subprocess.run([sys.executable, R + "vlog/loretta/sheet.py", out, "8", "250", *files], check=True)
for k in range(0, len(fs), 56): sheet(R + f"_v3/{S}_img{k // 56 + 1}.jpg", fs[k:k + 56])
tmp = R + f"_v3/{S}_stfr/"; os.makedirs(tmp, exist_ok=True); fr = []
for f in sorted(glob.glob(R + f"public/broll/{S}_st/*.mp4")):
    n = os.path.basename(f)[:-4]
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "1.5", "-i", f, "-frames:v", "1", "-vf", "scale=320:-1", tmp + n + ".jpg"], creationflags=0x08000000)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", f, "-frames:v", "1", "-q:v", "3", f[:-4] + "_last.jpg"], creationflags=0x08000000)
    fr.append(tmp + n + ".jpg")
if fr: subprocess.run([sys.executable, R + "vlog/loretta/sheet.py", R + f"_v3/{S}_stock.jpg", "7", "280", *fr], check=True)
print("jpg", len(fs), "· stock", len(fr))
