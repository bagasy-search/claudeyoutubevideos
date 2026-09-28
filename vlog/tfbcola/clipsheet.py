# clipsheet.py <out.jpg> <mp4>... — 4 cuadros por clip (0, 1/3, 2/3, final) en una fila por clip
import sys, subprocess, os
from PIL import Image, ImageDraw
out, fs = sys.argv[1], sys.argv[2:]; W, H = 320, 180
S = Image.new('RGB', (W * 4, H * len(fs)), (20, 20, 20)); d = ImageDraw.Draw(S)
for r, f in enumerate(fs):
    D = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], creationflags=0x08000000).decode())
    for c, t in enumerate([0.05, D / 3, 2 * D / 3, max(0, D - 0.12)]):
        tmp = out + f'.{r}_{c}.jpg'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', f, '-frames:v', '1', '-vf', f'scale={W}:{H}', tmp], creationflags=0x08000000)
        if os.path.exists(tmp): S.paste(Image.open(tmp), (c * W, r * H)); os.remove(tmp)
    d.rectangle([0, r * H, 150, r * H + 18], fill=(0, 0, 0)); d.text((3, r * H + 3), os.path.basename(f)[:24], fill=(255, 255, 0))
S.save(out, quality=80); print(out, S.size)
