# nrt_conform.py — normaliza los clips de stock de public/broll/nrfloaters/{s_,x_}*.mp4:
# 1920x1080 cover-crop · 30/1 CFR (fps=30, duplicación simple) · yuv420p · sin audio · faststart · ≤10 s.
# Si el clip ARRANCA oscuro (fundido desde negro: YAVG mínimo de los primeros 0,7 s < 40) se recorta el arranque.
# Original respaldado en D:/rtmp/nrf_work/stock_orig (nunca se borra). Imprime cuántos midió.
import os, re, subprocess, shutil, glob, sys
D = "public/broll/nrfloaters"; BAK = "D:/rtmp/nrf_work/stock_orig"; os.makedirs(BAK, exist_ok=True)
def yavg_min(p, ss=0.0):
    out = subprocess.run(["ffmpeg", "-v", "info", "-ss", str(ss), "-t", "0.7", "-i", p, "-an", "-vf", "scale=320:180,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"], capture_output=True, text=True).stderr
    v = [float(x) for x in re.findall(r"YAVG=([0-9.]+)", out)]
    return min(v) if v else -1
import json
M = json.load(open("_v3/nrfloaters_moments.json", encoding="utf-8"))
NEED = {}
for m in M:
    d = ((m["ms_out"] or 1191400) - m["ms"]) / 1000
    NEED["s_" + m["id"]] = d
    NEED["x_" + m["id"]] = 5.0
n = ok = trim = 0
for p in sorted(glob.glob(f"{D}/[sx]_m*.mp4")):
    name = os.path.basename(p); orig = os.path.join(BAK, name)
    if not os.path.exists(orig): shutil.copy2(p, orig)
    rate = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate,width,height", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip()
    n += 1
    if rate == "1920,1080,30/1" and os.path.getmtime(p) > os.path.getmtime(orig) + 1: ok += 1; continue
    ss = 0.0
    for cand in (0.0, 0.8, 1.6, 2.4):
        y = yavg_min(orig, cand)
        if y >= 40: ss = cand; break
    if ss: trim += 1
    tmp = p + ".part.mp4"
    r = subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(ss), "-i", orig, "-t", f"{min(16, max(8, NEED.get(name[:-4], 8) + 0.8)):.1f}", "-an", "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1,format=yuv420p", "-c:v", "libx264", "-crf", "20", "-preset", "veryfast", "-movflags", "+faststart", tmp])
    if r.returncode == 0: os.replace(tmp, p); ok += 1
    else: print("⛔ falló", name)
print(f"conform: {n} clips medidos · {ok} a 1920x1080 30/1 · {trim} con arranque oscuro recortado")
