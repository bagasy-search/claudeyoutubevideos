# nrt_avatar_cut.py — corta el mp4 de RunPod (UN job con las ventanas visibles concatenadas) en
# public/avatar/nrtinnitus/win-NNN.mp4, una por ventana del timeline.
#  1) offset REAL por ventana: correlación de la envolvente del audio del mp4 contra el wav de la ventana
#     (RunPod recorta ~99 ms en escalones: el offset lineal se corre). Busca ±0,6 s alrededor del esperado.
#  2) labios ADELANTADOS 0,25 s constantes (medido mdgutter): el video de cada ventana arranca 0,25 s ANTES
#     (en el primero se clona el cuadro inicial con tpad).
#  3) 832x464 → 1920x1080 lanczos + unsharp, 30/1 CFR (fps=30, duplicación simple), sin audio.
# Compuertas: último cuadro REAL del mp4 (el header miente) >= fin de la última ventana; imprime el desfase de cada una.
import json, os, subprocess, glob, sys
import numpy as np
SLUG = "nrtinnitus"; B = f"_avatar_fp8/{SLUG}/runpod"; OUT = f"public/avatar/{SLUG}"; os.makedirs(OUT, exist_ok=True)
LEAD = 0.25; SR = 8000
jobs = json.load(open(f"{B}/jobs.json"))
big = glob.glob(f"{B}/_gen/*.mp4")[0]
last = float(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "frame=best_effort_timestamp_time", "-of", "csv=p=0", big], text=True).strip().splitlines()[-1].strip(","))
need = jobs[-1]["offset_s"] + jobs[-1]["seconds"]
print(f"mp4 último cuadro REAL {last:.2f}s · el reel pide {need:.2f}s")
if last < need - 0.3: sys.exit(f"⛔ el mp4 vino TRUNCADO ({last:.2f} < {need:.2f}): hace falta un 2º /run SÓLO con la cola")
def pcm(src, ss=None, t=None):
    a = ["ffmpeg", "-v", "error"] + (["-ss", str(ss)] if ss is not None else []) + (["-t", str(t)] if t else []) + ["-i", src, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"]
    x = np.frombuffer(subprocess.run(a, capture_output=True).stdout, dtype=np.int16).astype(np.float32)
    # envolvente (abs + media móvil 10 ms)
    k = SR // 100; e = np.convolve(np.abs(x), np.ones(k) / k, mode="same"); return e - e.mean()
allmp4 = pcm(big)
shifts = []
for j in jobs:
    w = pcm(f"{B}/_wav/{j['out'].replace('.mp4', '.wav')}")
    w = w[: int(min(len(w), 6 * SR))]           # primeros 6 s de la ventana
    exp = int(j["offset_s"] * SR); lo = max(0, exp - int(0.6 * SR)); hi = min(len(allmp4) - len(w), exp + int(0.6 * SR))
    best, bk = -1e18, exp
    for k in range(lo, hi, 8):
        c = float(np.dot(allmp4[k:k + len(w)], w))
        if c > best: best, bk = c, k
    real = bk / SR; shifts.append(round((real - j["offset_s"]) * 1000))
    ss = real - LEAD; pad = max(0.0, -ss); ss = max(0.0, ss)
    vf = (f"tpad=start_duration={pad:.3f}:start_mode=clone," if pad > 0 else "") + "scale=1920:1080:flags=lanczos,unsharp=5:5:0.8:5:5:0.0,fps=30,format=yuv420p"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{ss:.3f}", "-i", big, "-t", f"{j['seconds'] + 0.4:.3f}", "-an", "-vf", vf,
                    "-c:v", "libx264", "-crf", "17", "-preset", "veryfast", "-movflags", "+faststart", f"{OUT}/{j['out']}"], check=True)
print(f"ventanas cortadas {len(jobs)} · desfase medido vs lineal (ms): {shifts}")
cortos = [j["out"] for j in jobs if float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f"{OUT}/{j['out']}"], text=True)) < j["seconds"] - 0.05]
print(f"clips más cortos que su ventana: {len(cortos)} {cortos}")
