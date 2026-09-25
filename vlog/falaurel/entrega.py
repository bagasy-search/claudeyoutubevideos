# falaurel — entrega: chunks del farm (release chunks-falaurel) → concat → + mezcla → re-encode de entrega → mediciones.
# python entrega.py  → D:/videosdeclaude/falaurel.mp4
import subprocess, os, glob, json, re
R = "bagasy-search/claudeyoutubevideos"; W = "D:/Proyectos/video2-wt/falaurel/"; D = "D:/rtmp/falaurel_chunks/"
OUT = "D:/videosdeclaude/falaurel.mp4"; TOTAL = 50157; FPS = 30
os.makedirs(D, exist_ok=True); os.makedirs(os.path.dirname(OUT), exist_ok=True)
def sh(*a, **k): return subprocess.run(a, check=True, capture_output=True, text=True, **k).stdout
def nfr(f): return int(re.search(r"\d+", sh("ffprobe", "-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f)).group())
if len(glob.glob(D + "chunk_*.mp4")) < 60:
    sh("gh", "release", "download", "chunks-falaurel", "-R", R, "--dir", D, "--pattern", "chunk_*.mp4", "--clobber")
ch = sorted(glob.glob(D + "chunk_*.mp4"), key=lambda f: int(re.search(r"(\d+)", os.path.basename(f)).group()))
fr = [nfr(c) for c in ch]
print(len(ch), "chunks ·", sum(fr), "cuadros vs TOTAL", TOTAL)
if len(ch) != 60 or sum(fr) != TOTAL: raise SystemExit("⛔ cuadros de los chunks != TOTAL_FRAMES")
open(D + "list.txt", "w").write("".join(f"file '{c}'\n" for c in ch))
sh("ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", D + "list.txt", "-c", "copy", D + "raw.mp4")
# re-encode de entrega: CFR 30, PTS rehechos, yuv420p tv bt709, g=60, faststart; audio = la mezcla (mono→estéreo, -16 LUFS)
sh("ffmpeg", "-v", "error", "-y", "-i", D + "raw.mp4", "-i", W + "public/falaurel_mix.wav",
   "-map", "0:v", "-map", "1:a", "-vf", "setpts=N/(30*TB),format=yuv420p", "-fps_mode", "passthrough", "-video_track_timescale", "15360",
   "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-g", "60", "-bf", "2",
   "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
   "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "48000",
   "-movflags", "+faststart", OUT)
n = nfr(OUT)
pr = json.loads(sh("ffprobe", "-v", "error", "-show_entries", "stream=codec_type,duration,pix_fmt,color_range,color_space,channels", "-of", "json", OUT))
print("final", n, "cuadros", "✓" if n == TOTAL else "⛔", json.dumps(pr["streams"]))
