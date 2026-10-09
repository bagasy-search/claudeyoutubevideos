#!/bin/bash
# Revisión de la entrega: cuadros del MP4 == TOTAL_FRAMES, QR legible EN el video, hoja de muestra (3 primeros min + medio + final).
S=$1; cd D:/Proyectos/video2-wt/lnet46; U=https://github.com/bagasy-search/claudeyoutubevideos/releases/download/$S/$S.mp4
D=C:/Users/bauti/AppData/Local/Temp/rev_$S; rm -rf $D; mkdir -p $D
F=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$")
N=$(ffprobe -v error -select_streams v -show_entries stream=nb_frames -of csv=p=0 "$U"); DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$U")
Q=$(python -c "
import re,json
ts=open('src/$S/timeline.gen.ts',encoding='utf8').read();TL=json.loads(re.search(r'export const TL: any\[\] = (.*);',ts).group(1))
print(' '.join(f\"{c['from']/30+4:.1f}\" for c in TL if c.get('name')=='LorQR'))")
ffmpeg -v error -y -ss $Q -i "$U" -frames:v 1 $D/qr.png
QD=$(python -c "import cv2;print(cv2.QRCodeDetector().detectAndDecode(cv2.imread('$D/qr.png'))[0])")
i=0; for t in 0.5 8 20 40 60 90 120 160 $Q 600 1000 1400 1700 $(python -c "print(int($DUR)-8)"); do i=$((i+1)); ffmpeg -v error -y -ss $t -i "$U" -frames:v 1 -vf scale=480:-1 $D/$(printf %02d $i).jpg; done
ffmpeg -v error -y -start_number 1 -i $D/%02d.jpg -vf tile=4x4 $D/sheet.jpg
echo "$S · cuadros $N / timeline $F $([ "$N" = "$F" ] && echo ✓ || echo ✗) · dur $DUR · QR a ${Q}s → $QD · hoja $D/sheet.jpg"
