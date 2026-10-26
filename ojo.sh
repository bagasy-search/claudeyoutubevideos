#!/bin/bash
# ojo.sh <slug>: planilla 1 cuadro/10 s (hojas de 4x3) + cuadros de corte de escena + lageos (mpdecimate por segundo) + probe
set -e; S=$1; M=$S.mp4
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate,avg_frame_rate,nb_frames,width,height -show_entries format=duration -of json $M > ojo_${S}_probe.json
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $M | cut -d. -f1)
mkdir -p f; t=0; i=0
while [ $t -le $D ]; do
  ffmpeg -v error -ss $t -i $M -frames:v 1 -vf "scale=640:-2,drawtext=text='$(printf %d:%02d $((t/60)) $((t%60)))':x=8:y=8:fontsize=30:fontcolor=yellow:box=1:boxcolor=black@0.7" f/$(printf %04d $i).jpg; t=$((t+10)); i=$((i+1))
done
ffmpeg -v error -y -framerate 1 -i f/%04d.jpg -vf "tile=4x3:padding=4:margin=4" ojo_${S}_p%02d.jpg
# cortes de escena
ffmpeg -v error -i $M -vf "select='gt(scene,0.35)',showinfo" -vsync vfr -f null - 2>&1 | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 > ojo_${S}_cortes.txt || true
echo "cortes: $(wc -l < ojo_${S}_cortes.txt)"
# lageos: cuadros NO duplicados por segundo (mpdecimate). En movimiento ~30; quieto ~0-2; intermedio (3-24) = posible tirón
ffmpeg -v error -i $M -vf "mpdecimate=hi=200:lo=64:frac=0.1,showinfo" -f null - 2>&1 | grep -o 'pts_time:[0-9.]*' | cut -d: -f2 | awk '{s=int($1); c[s]++} END{for(k in c) print k, c[k]}' | sort -n > ojo_${S}_vivos.txt
awk 'BEGIN{print "{\"tirones\":["} $2>=3 && $2<=22 {printf "%s[%d,%d]", (n++?",":""), $1, $2} END{print "]}"}' ojo_${S}_vivos.txt > ojo_${S}_lag.json
# segundos totalmente quietos seguidos (plano muerto)
awk -v D=$D '{v[$1]=$2} END{run=0; for(s=0;s<=D;s++){ if((v[s]+0)<=1){run++} else { if(run>=4) printf "quieto %d-%d (%ds)\n", s-run, s-1, run; run=0 } } }' ojo_${S}_vivos.txt > ojo_${S}_quietos.txt
cat ojo_${S}_lag.json; cat ojo_${S}_quietos.txt
