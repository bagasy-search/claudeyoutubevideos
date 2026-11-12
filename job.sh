# avfr ck11d: hoja de cuadros del reel (1 cada 40 s) para ver si el color se degrada al final (como swl11a)
set -e
curl -sfL --retry 4 -o orig.mp4 "$(cat url_orig.txt)"
ffmpeg -v error -i orig.mp4 -vf "fps=1/40,scale=480:-2,tile=4x4" -frames:v 2 out/avfr_%d.jpg
ls -la out
put out/avfr_1.jpg out/avfr_2.jpg
