# avcut fb14a: reel de RunPod (url.txt) → ventanas win-NNN.mp4 1920x1080 30 fps con el desfase (deriva) medido por ventana contra fb14a_reel.wav
# + av25.mp3 (ASR: que el reel diga MI guion) + boca viva + cuadro del segundo 1 + av_still.png
set -e
curl -sfL --retry 4 -o reel.mp4 "$(cat url.txt)"
# PLACA LIMPIA: el reel de RunPod mete manchas de color en el fondo; fondo = cuadro del s 3 fuera de la silueta de Claudio (sentado, brazos abiertos hasta las manos sobre la mesa)
mv reel.mp4 orig.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 orig.mp4 | tee wh.txt
ffmpeg -v error -ss 3 -i orig.mp4 -frames:v 1 plate.png
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFilter
w,h=[int(x) for x in open('wh.txt').read().strip().split(',')[:2]]
m=Image.new('L',(w,h),255); d=ImageDraw.Draw(m)
d.ellipse([0.40*w,-0.02*h,0.60*w,0.46*h],fill=0)
d.polygon([(0.40*w,0.33*h),(0.60*w,0.33*h),(0.74*w,0.40*h),(0.77*w,0.60*h),(0.83*w,0.86*h),(0.83*w,1.0*h),(0.19*w,1.0*h),(0.19*w,0.86*h),(0.24*w,0.60*h),(0.27*w,0.40*h)],fill=0)
m=m.filter(ImageFilter.GaussianBlur(int(0.005*w))); m.save('mask.png')
PY
ffmpeg -v error -i orig.mp4 -loop 1 -i plate.png -loop 1 -i mask.png -filter_complex "[1:v]format=gbrp[p];[2:v]format=gray,format=gbrp[m3];[0:v]format=gbrp[b];[b][p][m3]maskedmerge,format=yuv420p[v]" -map "[v]" -map 0:a -c:v libx264 -preset veryfast -crf 15 -c:a copy -shortest reel.mp4
ffmpeg -v error -i reel.mp4 -vf "fps=1/40,scale=480:-2,tile=4x4" -frames:v 1 -pix_fmt yuvj420p -q:v 4 out/plate_hoja.jpg
ffmpeg -v error -ss 560 -i reel.mp4 -frames:v 1 -pix_fmt yuvj420p -q:v 3 out/plate_560.jpg
ffmpeg -v error -ss 300 -i reel.mp4 -frames:v 1 -pix_fmt yuvj420p -q:v 3 out/plate_300.jpg
ffmpeg -v error -ss 420 -i reel.mp4 -frames:v 1 -pix_fmt yuvj420p -q:v 3 out/plate_420.jpg
ffmpeg -v error -ss 505 -i reel.mp4 -frames:v 1 -pix_fmt yuvj420p -q:v 3 out/plate_505.jpg
cp plate.png out/av_plate.png
get "${S}_reel.wav"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of json reel.mp4 > out/reel_probe.json; tr -d '\n ' < out/reel_probe.json; echo
python3 cut.py reel.mp4 "${S}_reel.wav" a
ffmpeg -v error -y -i reel.mp4 -t 25 -vn -ac 1 -ar 16000 -b:a 48k out/av25.mp3
python3 - <<'PY'
import json,subprocess
J=json.load(open('avatar_jobs.json')); pick=[J[1],J[len(J)//3],J[2*len(J)//3],J[-1]]
for k,j in enumerate(pick):
    subprocess.run(['ffmpeg','-v','error','-y','-i',f"a/{j['out']}",'-vf',"select='not(mod(n,4))*lt(n,24)',crop=760:560:580:120,scale=380:280,tile=6x1",'-frames:v','1','-pix_fmt','yuvj420p','-q:v','4',f'm{k}.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-i','m0.jpg','-i','m1.jpg','-i','m2.jpg','-i','m3.jpg','-filter_complex','vstack=inputs=4','-pix_fmt','yuvj420p','-q:v','4','out/mouth.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','0.9','-i',f"a/{J[0]['out']}",'-frames:v','1','-vf','scale=960:-2','-pix_fmt','yuvj420p','-q:v','4','out/av_1s.jpg'],check=True)
subprocess.run(['ffmpeg','-v','error','-y','-ss','2','-i',f"a/{J[1]['out']}",'-frames:v','1','out/av_still.png'],check=True)
PY
tar -cf "out/${S}_av.tar" a
put "out/${S}_av.tar" out/av25.mp3 out/mouth.jpg out/av_1s.jpg out/av_lag.json out/reel_probe.json out/av_still.png out/plate_hoja.jpg out/plate_560.jpg out/plate_300.jpg out/plate_420.jpg out/plate_505.jpg out/av_plate.png
