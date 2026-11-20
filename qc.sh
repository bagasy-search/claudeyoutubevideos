#!/bin/bash
# qc.sh <slug>: blackdetect + freezedetect + medir_mp4 + hojas de cuadros (1 cada 20 s, 4x4 por hoja)
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0.3:pix_th=0.10,freezedetect=n=0.003:d=2.5" -an -f null - 2> det_$S.txt
grep -E "black_start|freeze_start|freeze_duration" det_$S.txt > dets_$S.txt || true
python3 medir_mp4.py $S $f > r_$S.json
ffmpeg -v error -i $f -vf "select=not(mod(n\,225)),scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 sheet_${S}_%02d.jpg
mean=$(ffmpeg -nostats -i $f -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume" | tr '\n' ' ')
echo "{\"slug\":\"$S\",\"vol\":\"$mean\",\"black\":$(grep -c black_start dets_$S.txt),\"freeze\":$(grep -c freeze_start dets_$S.txt)}" > q_$S.json

# anti-mudo: mean_volume por tramos de 60 s + loudness
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $f | cut -d. -f1)
for ((t=0;t<d;t+=60)); do v=$(ffmpeg -nostats -ss $t -t 60 -i $f -af volumedetect -vn -f null - 2>&1 | grep mean_volume | awk '{print $5}'); echo "$t $v"; done > tramos_$S.txt
ffmpeg -nostats -i $f -af ebur128 -vn -f null - 2>&1 | grep -E "^\s+I:" | tail -1 > lufs_$S.txt
awk '$2<-45{n++} END{print "tramos_bajo_45:",n+0}' tramos_$S.txt >> lufs_$S.txt
