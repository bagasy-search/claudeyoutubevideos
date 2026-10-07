# vlog/beforeus/entrega.py <slug> <total_frames> <run_id> — entrega del canal Before Us.
# 1) pega los chunks del farm LOCAL (scripts/stitch_local.mjs, exige suma de cuadros == total)
# 2) un solo reencode: PTS rehechos (setpts N/30), color full->tv bt709, -bf 0 (pts==dts), audio = máster estéreo
# 3) 8 compuertas, todas con medición explícita (exit 2 si alguna no midió, 1 si falla):
#    streams · color · cadencia · cuadros == total · deriva vs máster · saltos de PTS · audio audible en 4 puntos
#    · blackdetect · luminancia cuadro a cuadro (cuadros negros sueltos)
# Salida: D:/rtmp/<slug>_final.mp4 + D:/rtmp/<slug>/entrega_report.json
import json, os, re, subprocess, sys
SLUG, TOTAL, RUN = sys.argv[1], int(sys.argv[2]), sys.argv[3]
REPO = f"D:/Proyectos/video2-wt/{SLUG}/"; R = f"D:/rtmp/{SLUG}/"
CAT = R + "farm_cat.mp4"; OUT = f"D:/rtmp/{SLUG}_final.mp4"; WAV = REPO + f"public/ah/{SLUG}/{SLUG}.wav"
def sh(cmd, **k): return subprocess.run(cmd, capture_output=True, text=True, **k)
if not os.path.exists(CAT) or "--restitch" in sys.argv:
    r = sh(["node", "scripts/stitch_local.mjs", RUN, str(TOTAL), CAT], cwd=REPO)
    print(r.stdout[-800:], r.stderr[-800:])
    if r.returncode != 0 or not os.path.exists(CAT): sys.exit("stitch local falló")
if not os.path.exists(OUT) or "--reencode" in sys.argv or "--restitch" in sys.argv:
    r = sh(["ffmpeg", "-y", "-v", "error", "-i", CAT, "-i", WAV, "-map", "0:v", "-map", "1:a",
            "-vf", "setpts=N/30/TB,scale=in_range=full:out_range=limited:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p",
            "-r", "30", "-fps_mode", "cfr", "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
            "-c:v", "libx264", "-preset", "faster", "-crf", "20", "-maxrate", "8M", "-bufsize", "12M", "-bf", "0",
            "-g", "60", "-keyint_min", "60", "-sc_threshold", "0", "-threads", "6",
            "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2", "-af", "apad", "-frames:v", str(TOTAL), "-shortest", "-movflags", "+faststart", OUT])
    if r.returncode != 0: sys.exit("reencode falló: " + r.stderr[-600:])
rep = {}; fail = []; nomide = []
def gate(name, ok, measured, info):
    rep[name] = {"ok": ok, "midio": measured, "info": info}
    print(("✓" if ok else ("? NO MIDIÓ" if not measured else "✗")), name, info)
    if not measured: nomide.append(name)
    elif not ok: fail.append(name)
p = json.loads(sh(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", OUT]).stdout)
v = [s for s in p["streams"] if s["codec_type"] == "video"]; a = [s for s in p["streams"] if s["codec_type"] == "audio"]
gate("1 streams", len(v) == 1 and len(a) == 1, bool(p["streams"]), f"video {len(v)} audio {len(a)}")
vs = v[0] if v else {}
gate("2 color", (vs.get("pix_fmt"), vs.get("color_range"), vs.get("color_space")) == ("yuv420p", "tv", "bt709"), bool(vs), f'{vs.get("pix_fmt")},{vs.get("color_range")},{vs.get("color_space")}')
gate("3 cadencia", vs.get("r_frame_rate") == vs.get("avg_frame_rate") == "30/1", bool(vs), f'{vs.get("r_frame_rate")} / {vs.get("avg_frame_rate")}')
nb = int(sh(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", OUT]).stdout.strip().strip(",") or 0)
gate("4 cuadros == total", nb == TOTAL, nb > 0, f"{nb} vs {TOTAL}")
dur = float(p["format"]["duration"]); wd = float(sh(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).stdout.strip() or 0)
gate("5 deriva vs máster", abs(dur - min(wd, TOTAL / 30)) < 0.7, wd > 0, f"mp4 {dur:.2f} s · máster {wd:.2f} s · comp {TOTAL/30:.2f} s")
pk = sh(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "packet=pts_time,dts_time", "-of", "csv=p=0", OUT]).stdout.split()
pts = []; neq = 0
for l in pk:
    x = l.strip().split(",")
    if len(x) >= 2 and x[0] and x[1]:
        pts.append(float(x[0])); neq += abs(float(x[0]) - float(x[1])) > 1e-6
jumps = sum(1 for i in range(1, len(pts)) if abs(pts[i] - pts[i - 1] - 1 / 30) > 0.004)
gate("6 PTS (saltos y pts==dts)", jumps == 0 and neq == 0, len(pts) > 1000, f"{len(pts)} paquetes · saltos {jumps} · pts!=dts {neq}")
pts_s = [30, dur * 0.35, dur * 0.7, dur - 40]; levels = []
for t in pts_s:
    r = sh(["ffmpeg", "-v", "info", "-ss", str(t), "-t", "8", "-i", OUT, "-vn", "-af", "volumedetect", "-f", "null", "-"])
    m = re.search(r"mean_volume: (-?[0-9.]+) dB", r.stderr); levels.append(float(m.group(1)) if m else None)
gate("7 audio audible (4 puntos)", all(l is not None and l > -35 for l in levels), all(l is not None for l in levels), f"{levels}")
r = sh(["ffmpeg", "-v", "info", "-i", OUT, "-an", "-vf", "blackdetect=d=0.5:pix_th=0.08", "-f", "null", "-"])
bl = re.findall(r"black_start:([0-9.]+) black_end:([0-9.]+)", r.stderr)
gate("8a blackdetect", len(bl) == 0, "frame=" in r.stderr, f"{len(bl)} tramos {bl[:5]}")
r = sh(["ffmpeg", "-v", "info", "-i", OUT, "-an", "-vf", "scale=160:90,signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"])
ys = [float(x) for x in re.findall(r"YAVG=([0-9.]+)", r.stderr)]
single = [i for i in range(1, len(ys) - 1) if ys[i] < 16 and ys[i - 1] > 40 and ys[i + 1] > 40]
gate("8b luminancia cuadro a cuadro", len(single) == 0, len(ys) > TOTAL * 0.9, f"{len(ys)} cuadros · destellos negros sueltos {len(single)} · media {sum(ys)/max(1,len(ys)):.1f}")
json.dump(rep, open(R + "entrega_report.json", "w"), indent=1)
print(f"MEDIDO: {len(rep)} compuertas · fallan {fail} · no midieron {nomide} · {OUT}")
sys.exit(2 if nomide else (1 if fail else 0))
