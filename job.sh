# vsheet: hoja de control de TODOS los clips de <S>_y.tar (cuadro del medio de cada uno, uid encima, 8x5 por hoja)
set -e
get ${S}_y.tar; tar -xf ${S}_y.tar; rm -f ${S}_y.tar
mkdir -p vf
for f in y/*.mp4; do u=$(basename $f .mp4)
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $f || echo 2)
  h=$(python3 -c "print(max(0.0,float('$d' or 2)/2-0.05))")
  ffmpeg -nostdin -v error -y -ss $h -i $f -frames:v 1 -vf "scale=320:180,drawtext=text='$u':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6" vf/$u.jpg || ffmpeg -nostdin -v error -y -i $f -frames:v 1 -vf "scale=320:180,drawtext=text='$u':x=4:y=4:fontsize=18:fontcolor=yellow:box=1:boxcolor=black@0.6" vf/$u.jpg || echo "sin cuadro $u"
done
echo cuadros $(ls vf | wc -l) clips $(ls y/*.mp4 | wc -l)
ls vf/*.jpg | sort > l.txt; split -l 40 -d l.txt part_; i=0
for p in part_*; do
  n=$(wc -l < $p); args=""; for f in $(cat $p); do args="$args -i $f"; done
  k=$n; while [ $k -lt 40 ]; do args="$args -f lavfi -i color=black:s=320x180:d=0.04"; k=$((k+1)); done
  ffmpeg -nostdin -v error -y $args -filter_complex "$(for j in $(seq 0 39); do printf "[$j:v]"; done)xstack=inputs=40:layout=$(python3 -c "print('|'.join(f'{(j%8)*320}_{(j//8)*180}' for j in range(40)))")" -frames:v 1 -q:v 4 out/ysheet_$i.jpg
  i=$((i+1))
done
put out/ysheet_*.jpg
