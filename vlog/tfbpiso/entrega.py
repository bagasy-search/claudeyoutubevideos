# tfbpiso — entrega: mp4 del farm (stitch crudo) → re-encode CFR 30, PTS rehechos, tv/bt709, SIN B-frames (pts==dts),
# audio = public/tfbpiso.wav (mezcla máster). python vlog/tfbpiso/entrega.py <crudo.mp4> → D:/videosdeclaude/tfbpiso.mp4
import subprocess, sys, re, os
RAW = sys.argv[1]; W = "D:/Proyectos/video2-wt/tfbpiso/"; OUT = "D:/videosdeclaude/tfbpiso_final.mp4"; TOTAL = 30029
NW = 0x08000000
def sh(*a): return subprocess.run(a, check=True, capture_output=True, text=True, creationflags=NW).stdout
def nfr(f): return int(re.search(r"\d+", sh("ffprobe", "-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", f)).group())
n0 = nfr(RAW); print("crudo", n0, "cuadros vs", TOTAL)
if n0 != TOTAL: raise SystemExit("⛔ cuadros del crudo != TOTAL")
sh("ffmpeg", "-v", "error", "-y", "-i", RAW, "-i", W + "public/tfbpiso.wav", "-map", "0:v", "-map", "1:a",
   "-vf", "setpts=N/(30*TB),format=yuv420p", "-fps_mode", "passthrough", "-video_track_timescale", "15360",
   "-c:v", "libx264", "-preset", "medium", "-crf", "19", "-g", "60", "-bf", "0",
   "-color_range", "tv", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
   "-bsf:v", "h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0",
   "-c:a", "aac", "-b:a", "192k", "-ac", "2", "-ar", "48000", "-shortest", "-movflags", "+faststart", OUT)
print("final", nfr(OUT), "cuadros ·", OUT)
