# hoja de un mp4 armado: python vhoja.py out.jpg cada_seg vid1.mp4 [vid2...]
import sys, subprocess, os
from PIL import Image, ImageDraw
out, step = sys.argv[1], float(sys.argv[2]); ims = []
for f in sys.argv[3:]:
    D = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],capture_output=True,text=True).stdout)
    t = step / 2
    while t < D:
        subprocess.run(["ffmpeg","-v","error","-y","-ss",str(t),"-i",f,"-frames:v","1","-vf","scale=240:-2","_v.jpg"])
        ims.append((os.path.basename(f)[5:-4] + f" {t:.0f}", Image.open("_v.jpg").copy())); t += step
cols = 8; h = ims[0][1].height; S = Image.new("RGB", (cols * 240, ((len(ims) + cols - 1) // cols) * (h + 14))); d = ImageDraw.Draw(S)
for i, (l, im) in enumerate(ims):
    x, y = (i % cols) * 240, (i // cols) * (h + 14); S.paste(im, (x, y + 14)); d.text((x + 2, y), l, fill="yellow")
S.save(out, quality=75)
