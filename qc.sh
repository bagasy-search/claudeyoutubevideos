#!/bin/bash
# qc.sh <slug>: blackdetect + freezedetect + medir_mp4 + hojas de cuadros (1 cada 20 s, 4x4 por hoja)
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0.3:pix_th=0.10,freezedetect=n=0.003:d=2.5" -an -f null - 2> det_$S.txt
grep -E "black_start|freeze_start|freeze_duration" det_$S.txt > dets_$S.txt || true
python3 medir_mp4.py $S $f > r_$S.json
ffmpeg -v error -i $f -vf "select=not(mod(n\,600)),scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 sheet_${S}_%02d.jpg
mean=$(ffmpeg -nostats -i $f -af volumedetect -vn -f null - 2>&1 | grep -E "mean_volume|max_volume" | tr '\n' ' ')
echo "{\"slug\":\"$S\",\"vol\":\"$mean\",\"black\":$(grep -c black_start dets_$S.txt),\"freeze\":$(grep -c freeze_start dets_$S.txt)}" > q_$S.json
# --- OJO DEL DIRECTOR ---
ffmpeg -v error -i $f -vf "select=not(mod(n\,300)),scale=640:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black,tile=3x3" -fps_mode vfr -q:v 3 ojo10_${S}_%02d.jpg
ffmpeg -v error -i $f -vf "select='gt(scene,0.25)',scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 ojocut_${S}_%02d.jpg
ffmpeg -v error -i $f -vf "scale=640:-1,signalstats,metadata=print:key=lavfi.signalstats.YDIF:file=ydif_${S}.txt" -an -f null -
ffprobe -v error -select_streams v:0 -show_entries packet=pts_time,duration_time -of csv=p=0 $f | awk -F, 'NR>1{d=$1-p; if (d>0.0345||d<0.032) n++} {p=$1} END{print "pts_irregulares " n+0}' > fps_${S}.txt
