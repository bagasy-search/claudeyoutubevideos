# cuadros del reel crudo (sin zoom) para armar el fondo limpio y medir cuánto se corre la persona
set -e
for n in 1 2 3 4 5; do gh release download "insumos-$S" -R "$R" -p "${S}_reel_raw.mp4" --clobber && break; sleep $((n*8)); done
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration -of default=nw=1 ${S}_reel_raw.mp4 | tee out/probe.txt
ffmpeg -v error -y -ss 0.4 -i ${S}_reel_raw.mp4 -frames:v 1 -vf scale=1920:1080:flags=lanczos out/av_plate.png
for t in 2 100 200 300 400 500 570; do ffmpeg -v error -y -ss $t -i ${S}_reel_raw.mp4 -frames:v 1 -vf scale=960:540 -q:v 3 out/r_$t.jpg; done
