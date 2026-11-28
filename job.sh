set -e
mkdir -p seg out
ls segs/*.sh | xargs -P "$(nproc)" -n 1 bash
ffmpeg -v error -y -f concat -safe 0 -i lista.txt -vf format=yuv420p -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 -c:v libx264 -preset faster -crf 20 -maxrate 5M -bufsize 10M -g 60 -keyint_min 60 -sc_threshold 0 -bf 0 -c:a copy -movflags +faststart out/hue27a.mp4
ls -la out
