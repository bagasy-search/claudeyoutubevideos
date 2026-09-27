# hoja de clips: python cliphoja.py out.jpg clip1.mp4 clip2.mp4 ...  (3 cuadros por clip: inicio, medio, final)
import sys, subprocess, os
from PIL import Image, ImageDraw
out = sys.argv[1]; fs = sys.argv[2:]; w = 300; h = 169
S = Image.new("RGB", (3 * w + 120, len(fs) * h), "black"); d = ImageDraw.Draw(S)
for i, f in enumerate(fs):
    try: D = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
    except Exception: continue
    for j, t in enumerate((0.15, D / 2, max(0, D - 0.3))):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", f, "-frames:v", "1", "-vf", f"scale={w}:{h}", "_ch.jpg"])
        try: S.paste(Image.open("_ch.jpg"), (120 + j * w, i * h))
        except Exception: pass
    d.text((4, i * h + 4), os.path.basename(f)[:14], fill="yellow"); d.text((4, i * h + 22), f"{D:.1f}s", fill="yellow")
S.save(out, quality=80)
