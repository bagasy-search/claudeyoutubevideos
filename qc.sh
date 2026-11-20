#!/bin/bash
# qc.sh <slug>: blackdetect(d=0) + freezedetect + medir_mp4 + hojas cada 600f + hojas a MITAD de cada plano + cara al 1 s + avatar_vivo
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0:pix_th=0.10,freezedetect=n=0.003:d=2.5" -an -f null - 2> det_$S.txt
grep -E "black_start|freeze_start|freeze_duration" det_$S.txt > dets_$S.txt || true
python3 medir_mp4.py $S $f > r_$S.json
ffmpeg -v error -i $f -vf "select=not(mod(n\,600)),scale=480:-1,drawtext=text='%{pts\:hms}':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 sheet_${S}_%02d.jpg
ffmpeg -v error -ss 1 -i $f -frames:v 1 -vf scale=960:-1 -q:v 3 sheet_${S}_cara1s.jpg
mkdir -p mid; i=0
while read t id; do i=$((i+1)); ffmpeg -v error -ss $t -i $f -frames:v 1 -vf "scale=480:-1,drawtext=text='$id $t':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black" -q:v 4 mid/$(printf %03d $i).jpg; done < mids.txt
ffmpeg -v error -framerate 1 -i mid/%03d.jpg -vf tile=4x4 -q:v 4 sheet_${S}_mid%02d.jpg
python3 avatar_vivo.py $S $f > vivo_$S.txt 2>&1; echo "exit=$?" >> vivo_$S.txt
mean=$(ffmpeg -nostats -i $f -af ebur128=peak=true -vn -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | tr '\n' ' ')
echo "{\"slug\":\"$S\",\"loud\":\"$mean\",\"black\":$(grep -c black_start dets_$S.txt),\"freeze\":$(grep -c freeze_start dets_$S.txt)}" > q_$S.json
