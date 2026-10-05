# §4 AUDITOR sobre el MP4 FINAL (el re-encodeado de entrega). python vlog/lorham/audit.py <final.mp4>
# -> compuertas del minuto 1 (silencios, cortes), hoja de contactos del minuto 1 (cada 2 s) + 1 cuadro cada 30 s, primer cuadro, lag/foley de audio.
import subprocess, sys, re, os
F = sys.argv[1]; HIDE = 0x08000000
def run(a): return subprocess.run(a, capture_output=True, text=True, creationflags=HIDE)
sil = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", F, "-af", "silencedetect=noise=-32dB:d=0.3", "-f", "null", "-"]).stderr
ns = len(re.findall("silence_start", sil))
sc = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", F, "-vf", "select='gt(scene,0.3)',showinfo", "-f", "null", "-"]).stderr
nc = len(re.findall(r"pts_time:", sc))
print(f"MINUTO 1 - silencios >=0,3 s a -32 dB: {ns} (exigido 0) - cortes scene>0,3: {nc} (exigido >=20)")
os.makedirs("_v3/audit", exist_ok=True)
def sheet(times, out, cols, w=320):
    inp = []; fl = []
    for i, t in enumerate(times):
        inp += ["-ss", f"{t:.2f}", "-t", "0.2", "-i", F]
        fl.append(f"[{i}:v]select=eq(n\\,0),scale={w}:{int(w*9/16)},drawtext=fontfile='C\\:/Windows/Fonts/arialbd.ttf':text='{t:.0f}s':x=5:y=4:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6[t{i}]")
    rows = (len(times) + cols - 1) // cols
    flt = ";".join(fl) + ";" + "".join(f"[t{i}]" for i in range(len(times))) + f"concat=n={len(times)}:v=1:a=0[c];[c]tile={cols}x{rows}:padding=3:color=white[o]"
    subprocess.run(["ffmpeg", "-y", "-v", "error", *inp, "-filter_complex", flt, "-map", "[o]", "-frames:v", "1", "-q:v", "4", out], check=True, creationflags=HIDE)
sheet([0.3 + 2 * i for i in range(30)], "_v3/audit/min1.jpg", 6)
dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", F]).stdout)
ts = [t for t in range(30, int(dur) - 5, 30)]
for k in range(0, len(ts), 40): sheet(ts[k:k + 40], f"_v3/audit/full_{k // 40 + 1}.jpg", 8, 240)
print("hojas:", os.listdir("_v3/audit"), "- dur", round(dur, 1))
