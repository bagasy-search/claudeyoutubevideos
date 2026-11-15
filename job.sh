#!/bin/bash
# PLACA LIMPIA (receta alb14): el reel de RunPod mete manchas de color en el fondo desde ~la mitad; fondo = cuadro limpio de la 1ª ventana fuera de la silueta
set -e; R=$GITHUB_REPOSITORY; pip install -q pillow >/dev/null 2>&1 || true
python3 - <<'PY'
from PIL import Image, ImageDraw, ImageFilter
w,h=1920,1080; m=Image.new('L',(w,h),255); d=ImageDraw.Draw(m)
d.ellipse([0.37*w,-0.03*h,0.61*w,0.42*h],fill=0)
d.polygon([(0.35*w,0.24*h),(0.65*w,0.24*h),(0.73*w,0.33*h),(0.76*w,0.55*h),(0.79*w,0.75*h),(0.81*w,1.0*h),(0.19*w,1.0*h),(0.21*w,0.75*h),(0.25*w,0.55*h),(0.27*w,0.33*h)],fill=0)
m=m.filter(ImageFilter.GaussianBlur(14)); m.save('mask.png')
PY
for S in $(cat slugs.txt); do
  gh release download aud-$S -R $R -p "${S}_av.tar" --clobber; rm -rf w && mkdir w && tar -xf ${S}_av.tar -C w
  gh release view aud-$S -R $R --json assets -q '.assets[].name' | grep -q "${S}_av_orig.tar" || { cp ${S}_av.tar ${S}_av_orig.tar; gh release upload aud-$S ${S}_av_orig.tar -R $R; }
  F=$(ls w/a | sort | head -1); ffmpeg -v error -y -ss 0.5 -i w/a/$F -frames:v 1 plate_$S.png
  mkdir -p o/a; for f in $(ls w/a); do
    ffmpeg -v error -y -i w/a/$f -loop 1 -i plate_$S.png -loop 1 -i mask.png -filter_complex "[1:v]format=gbrp[p];[2:v]format=gray,format=gbrp[m3];[0:v]format=gbrp[b];[b][p][m3]maskedmerge,format=yuv420p[v]" -map "[v]" -an -shortest -frames:v $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 w/a/$f) -c:v libx264 -crf 17 -preset veryfast o/a/$f
  done
  L=$(ls o/a | sort); N=$(echo "$L" | wc -l); i=0
  for f in $(echo "$L" | awk -v n=$N 'NR==int(n*0.5)||NR==int(n*0.85)||NR==n'); do i=$((i+1)); ffmpeg -v error -y -ss 0.5 -i o/a/$f -frames:v 1 -vf scale=960:-2 -q:v 3 out/${S}_p$i.jpg; done
  ffmpeg -v error -y -i out/${S}_p1.jpg -i out/${S}_p2.jpg -i out/${S}_p3.jpg -filter_complex "[0][1][2]vstack=inputs=3" out/${S}_placa.jpg
  (cd o && tar -cf ../${S}_av.tar a); gh release upload aud-$S ${S}_av.tar out/${S}_placa.jpg -R $R --clobber; rm -rf o w
done
