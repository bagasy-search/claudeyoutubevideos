# Corta tramos del máster (public/olsup.wav) para los clips hablados de agnes: python tramos.py id:s:e ...
import sys, subprocess, os
os.makedirs("vlog/olsup/tramos", exist_ok=True)
for a in sys.argv[1:]:
    i, s, e = a.split(":"); s = max(0, float(s)); e = float(e)
    out = f"vlog/olsup/tramos/{i}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{s:.3f}", "-to", f"{e:.3f}", "-i", "public/olsup.wav", "-ac", "1", "-ar", "44100", out], check=True)
    print(i, round(e - s, 2))
