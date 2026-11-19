#!/bin/bash
# eval: 5 cuadros por componente (ev.txt: nombre t1..t5) -> sheet_<S>_ev_<nombre>.jpg (tile 5x1, 1600 px)
S=$1; f=$S.mp4; mkdir -p ev
while read n t1 t2 t3 t4 t5; do j=0
  for t in $t1 $t2 $t3 $t4 $t5; do j=$((j+1)); ffmpeg -v error -ss $t -i $f -frames:v 1 -vf "scale=640:-1" -q:v 3 ev/${n}_$j.jpg; done
  ffmpeg -v error -i ev/${n}_%d.jpg -vf "scale=320:-1,tile=5x1" -q:v 3 sheet_${S}_ev_${n}.jpg
  ffmpeg -v error -framerate 1 -i ev/${n}_%d.jpg -vf "tile=5x1" -q:v 3 sheet_${S}_evg_${n}.jpg
done < ev.txt
echo '{"av_pct":0}' > r_$S.json; echo '{}' > q_$S.json; : > dets_$S.txt; echo ok > vivo_$S.txt; : > mudo_$S.txt
ffprobe -v error -show_entries format=duration -of json $f > probe_$S.json
