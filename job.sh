#!/bin/bash
# hojas de contacto de los clips Veo de $S (3 cuadros por clip: 1,0 / 4,0 / 7,0 s, con el recorte anti-destello) + medida de audio por clip.
set -e; TAG=${GITHUB_REF_NAME##*-}
LISTA=$(cat lista.txt)
mkdir -p v f out/hojas
for c in $LISTA; do get "${S}_v_$c.mp4"; mv "${S}_v_$c.mp4" v/$c.mp4; done
echo "[" > out/clips.json; first=1
for c in $LISTA; do
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 v/$c.mp4)
  vol=$(ffmpeg -hide_banner -i v/$c.mp4 -vn -af volumedetect -f null - 2>&1 | grep -oE "mean_volume: [-0-9.]+" | grep -oE "[-0-9.]+$" || echo "-99")
  for t in 1 4 7; do ffmpeg -v error -y -ss $t -i v/$c.mp4 -frames:v 1 -vf "crop=1186:667:0:26,scale=480:270,drawtext=text='$c  ${t}s':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6" f/${c}_$t.jpg; done
  ffmpeg -v error -y -i f/${c}_1.jpg -i f/${c}_4.jpg -i f/${c}_7.jpg -filter_complex hstack=3 f/${c}_row.jpg
  [ $first = 1 ] || echo "," >> out/clips.json; first=0
  echo "{\"c\":\"$c\",\"dur\":$d,\"vol\":$vol}" >> out/clips.json
done
echo "]" >> out/clips.json
# hojas de 5 clips (1440x1350)
set -- $LISTA; n=0
while [ $# -gt 0 ]; do
  grp=""; k=0; ins=""
  for i in 1 2 3 4 5; do [ $# -gt 0 ] || break; ins="$ins -i f/${1}_row.jpg"; grp="$grp${1}_"; shift; k=$((k+1)); done
  n=$((n+1)); nm=$(printf "out/hojas/h%03d.jpg" $n)
  if [ $k -gt 1 ]; then ffmpeg -v error -y $ins -filter_complex vstack=$k -q:v 4 $nm; else cp f/*_row.jpg $nm 2>/dev/null || true; fi
done
cd out && tar cf ../${S}_hojas_${TAG}.tar hojas clips.json && cd .. && put ${S}_hojas_${TAG}.tar
