set -e
mkdir -p seg out
ls segs/*.sh | xargs -P "$(nproc)" -n 1 bash
ffmpeg -v error -y -f concat -safe 0 -i lista.txt -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -bf 0 -c:a copy -movflags +faststart out/fun28a.mp4
ls -la out
