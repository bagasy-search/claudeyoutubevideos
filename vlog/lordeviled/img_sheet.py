# Hojas de contactos de las imágenes gpt (rótulo = nombre). python vlog/lordeviled/img_sheet.py  → _v3/img_sheet_N.jpg
import glob, os, subprocess
fs = sorted(glob.glob("public/img/lordeviled/*.jpg")); fs = [f for f in fs if "thumb_card" not in f and "_blur" not in f]; N = 30
for pg in range(0, len(fs), N):
    part = fs[pg:pg + N]; inp = []; fl = []
    for i, f in enumerate(part):
        inp += ["-i", f]
        fl.append(f"[{i}:v]scale=384:216,drawtext=fontfile='C\:/Windows/Fonts/arialbd.ttf':text='{os.path.basename(f)[:-4]}':x=6:y=4:fontsize=20:fontcolor=yellow:box=1:boxcolor=black@0.6[t{i}]")
    flt = ";".join(fl) + ";" + "".join(f"[t{i}]" for i in range(len(part))) + f"concat=n={len(part)}:v=1:a=0[c];[c]tile=6x5:padding=3:color=white[o]"
    out = f"_v3/img_sheet_{pg // N + 1}.jpg"
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inp, "-filter_complex", flt, "-map", "[o]", "-frames:v", "1", "-q:v", "5", out], check=True, creationflags=0x08000000)
    print(out, len(part))
