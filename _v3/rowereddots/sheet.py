# sheet.py out.jpg cols W file1 file2 ...  (mp4 → frame a 40%)
import sys, subprocess, os, io
from PIL import Image, ImageDraw
out, cols, W = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
H = W * 9 // 16
def load(f):
    if f.endswith(".mp4"):
        d = float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",f],text=True).strip().rstrip(","))
        b = subprocess.run(["ffmpeg","-v","error","-ss",str(d*0.4),"-i",f,"-frames:v","1","-f","image2pipe","-vcodec","mjpeg","-"],capture_output=True).stdout
        return Image.open(io.BytesIO(b))
    return Image.open(f)
rows = (len(files)+cols-1)//cols
S = Image.new("RGB",(cols*W, rows*(H+18)),(20,20,20)); d = ImageDraw.Draw(S)
for i,f in enumerate(files):
    try: im = load(f).convert("RGB").resize((W,H))
    except Exception as e: im = Image.new("RGB",(W,H),(90,0,0))
    x,y = (i%cols)*W, (i//cols)*(H+18)
    S.paste(im,(x,y+18)); d.text((x+3,y+3), os.path.basename(f).rsplit(".",1)[0][:40], fill=(255,230,0))
S.save(out, quality=82); print("sheet", out, len(files))
