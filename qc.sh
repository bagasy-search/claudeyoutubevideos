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
ffmpeg -nostats -i $f -af silencedetect=noise=-50dB:d=3 -vn -f null - 2> sil_$S.txt; grep silence_start sil_$S.txt > mudo_$S.txt || true
echo "{\"slug\":\"$S\",\"mudo\":$(grep -c silence_start mudo_$S.txt),\"loud\":\"$mean\",\"black\":$(grep -c black_start dets_$S.txt),\"freeze\":$(grep -c freeze_start dets_$S.txt)}" > q_$S.json
# tdp16 (19-nov): hoja de contactos por COMPONENTE para el EVALUADOR: 5 cuadros (entrada −0,3/+0,2/+0,6, medio, salida −0,3) en tile 5x1 a 1600 px
if [ -s comps.txt ]; then mkdir -p comp; while read a b id; do k=0; for t in $(python3 -c "a,b=$a,$b;print(' '.join(f'{x:.2f}' for x in [max(0,a-0.3),a+0.2,a+0.6,(a+b)/2,b-0.3]))"); do k=$((k+1)); ffmpeg -v error -ss $t -i $f -frames:v 1 -vf "scale=480:-1" -q:v 3 comp/${id}_$k.jpg; done
  ffmpeg -v error -y -i comp/${id}_1.jpg -i comp/${id}_2.jpg -i comp/${id}_3.jpg -i comp/${id}_4.jpg -i comp/${id}_5.jpg -filter_complex "hstack=inputs=5" -q:v 3 sheet_${S}_comp_${id}.jpg; done < comps.txt; fi

# tdp16 (19-nov): primeros 25 s de audio para el ASR (Groq) de la compuerta del AUDITOR
ffmpeg -v error -t 25 -i $f -vn -ac 1 -ar 16000 -b:a 64k sheet_${S}_asr25.mp3 || true
