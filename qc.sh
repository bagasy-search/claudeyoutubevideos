#!/bin/bash
# ojo: planilla 1 cuadro/10 s + cortes de escena + lageos
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0.3:pix_th=0.10,freezedetect=n=0.003:d=2.5" -an -f null - 2> det_$S.txt
grep -E "black_start|freeze_start|freeze_duration" det_$S.txt > dets_$S.txt || true
python3 medir_mp4.py $S $f > r_$S.json
python3 lag.py $S $f > q_$S.json
ffmpeg -v error -i $f -vf "select=not(mod(n\,300)),scale=640:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=26:fontcolor=yellow:box=1:boxcolor=black,tile=4x3" -fps_mode vfr -q:v 3 sheet_${S}_%02d.jpg
ffmpeg -v error -i $f -vf "select='gt(scene,0.35)',scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=5x4" -fps_mode vfr -q:v 4 sheet_${S}_corte%02d.jpg
