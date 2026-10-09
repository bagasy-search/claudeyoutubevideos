# Post de los clips LTX: vlog/<slug>/ltx/out/<id>.mp4 → public/vid/<slug>/ (1920x1080 30/1 CFR mudo, sin cola negra) + foley d_* + hoja QC. SLUG=x python vlog/loretta/ltx_post.py
import json, os, re, subprocess, sys
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/lnet/"; SRC = R + f"vlog/{S}/ltx/out/"; DST = R + f"public/vid/{S}/"; QC = R + f"_v3/{S}_ltxqc/"
os.makedirs(DST, exist_ok=True); os.makedirs(QC, exist_ok=True); H = 0x08000000
def run(a, **k): return subprocess.run(a, capture_output=True, text=True, creationflags=H, **k)
ids = sys.argv[1:] or sorted(f[:-4] for f in os.listdir(SRC) if f.endswith(".mp4"))
def luma_at(f, t):
    r = run(["ffmpeg", "-v", "info", "-ss", f"{t:.3f}", "-i", f, "-frames:v", "1", "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"])
    m = re.findall(r"YAVG=([0-9.]+)", r.stderr); return float(m[0]) if m else -1
rep = {}
for i in ids:
    f = SRC + i + ".mp4"
    dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).stdout)
    # cola en negro / fundido: busca desde el final el último cuadro con luma >= 60 % de la media del clip
    base = sorted(luma_at(f, dur * k) for k in (0.2, 0.4, 0.6, 0.8))[1]
    end = dur
    for k in range(0, 16):
        t = dur - 0.04 - k * 0.083
        if luma_at(f, t) >= 0.75 * base: end = t + 0.04; break
    trim = round(dur - end, 2)
    out = DST + i + ".mp4"
    run(["ffmpeg", "-v", "error", "-y", "-i", f, "-t", f"{end:.3f}", "-an", "-vf", "scale=1920:1080:flags=lanczos,fps=30,tpad=stop_mode=clone:stop_duration=1,format=yuv420p", "-c:v", "libx264", "-crf", "19", "-preset", "veryfast", "-bf", "0", "-r", "30", out])
    if i.startswith("d_"):
        r = run(["ffmpeg", "-hide_banner", "-nostats", "-i", f, "-vn", "-af", "ebur128=framelog=quiet", "-f", "null", "-"]); m = re.search(r"I:\s+(-?[0-9.]+) LUFS", r.stderr)
        I = float(m.group(1)) if m else -30
        if I > -70: run(["ffmpeg", "-v", "error", "-y", "-i", f, "-t", f"{end:.3f}", "-vn", "-af", f"volume={-30 - I:.1f}dB,afade=t=in:d=0.15", "-ar", "48000", "-c:a", "aac", "-b:a", "128k", DST + i + "_foley.m4a"])
    ts = [0.3, end * 0.4, end * 0.8, end - 0.1]
    inp = []; fl = []
    for k, t in enumerate(ts):
        inp += ["-ss", f"{t:.2f}", "-t", "0.2", "-i", out]; fl.append(f"[{k}:v]select=eq(n\\,0),scale=480:270[t{k}]")
    run(["ffmpeg", "-y", "-v", "error", *inp, "-filter_complex", ";".join(fl) + ";[t0][t1][t2][t3]hstack=inputs=4[o]", "-map", "[o]", "-frames:v", "1", "-q:v", "4", QC + i + ".jpg"])
    rep[i] = {"dur": round(dur, 2), "trim_cola": trim, "luma_base": round(base), "luma_ult": round(luma_at(out, max(0, end - 0.1)))}
    print(i, rep[i], flush=True)
json.dump(rep, open(QC + "_rep.json", "w"), indent=1)
