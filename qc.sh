#!/bin/bash
# qc.sh <slug>: blackdetect + freezedetect (>4 s) + luminancia cuadro a cuadro (destellos negros) + loudness + hojas de cuadros
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0.03:pix_th=0.10,freezedetect=n=0.003:d=4,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=yavg_$S.txt" -an -f null - 2> det_$S.txt
grep -E "black_start|freeze_start|freeze_duration" det_$S.txt > dets_$S.txt || true
python3 lum.py yavg_$S.txt > lum_$S.json
python3 medir_mp4.py $S $f > r_$S.json
ffmpeg -v error -i $f -vf "select=not(mod(n\,600)),scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 sheet_${S}_%02d.jpg
lufs=$(ffmpeg -nostats -i $f -vn -af ebur128=peak=true -f null - 2>&1 | grep -A12 Summary | grep -E "I:|Peak:" | tr -s ' ' | tr '\n' ' ')
echo "{\"slug\":\"$S\",\"loud\":\"$lufs\",\"black\":$(grep -c black_start dets_$S.txt),\"freeze\":$(grep -c freeze_start dets_$S.txt)}" > q_$S.json
