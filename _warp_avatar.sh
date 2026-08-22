#!/usr/bin/env bash
# _warp_avatar.sh — recorta el avatar en los tramos de _avatar_segments.json, ajusta la velocidad de cada uno
# (setpts) para que caiga sobre su ancla del master, y concatena. El audio se descarta (-an): el audio final
# es out/fedcolageno/master.wav, horneado al final.
# ⚠️ GOTCHA: -ss y -t van ANTES de -i (opciones de ENTRADA). Si -t va después de -i limita la SALIDA, y
# entonces ffmpeg lee de más para llenarla y el setpts queda anulado (los tramos salen con su largo original).
set -e
SRC=_avatar_fedcolageno_raw.mp4
TMP=_avwarp
mkdir -p $TMP
rm -f $TMP/*.mp4 $TMP/list.txt

N=$(node -e "console.log(require('./_avatar_segments.json').length)")
echo "tramos: $N"
for i in $(seq 0 $((N-1))); do
  read FROM DUR FACTOR <<< $(node -e "
    const s=require('./_avatar_segments.json')[$i];
    console.log(s.av_from.toFixed(3), s.dur_av.toFixed(3), s.factor.toFixed(6));
  ")
  NAME=$(printf "%03d" $i)
  ffmpeg -y -v error -ss "$FROM" -t "$DUR" -i "$SRC" \
    -vf "setpts=(PTS-STARTPTS)*${FACTOR}" -an -r 25 -fps_mode cfr \
    -c:v libx264 -crf 22 -preset veryfast -pix_fmt yuv420p "$TMP/$NAME.mp4"
  echo "file '$NAME.mp4'" >> $TMP/list.txt
  printf "."
done
echo ""
echo "concatenando..."
ffmpeg -y -v error -f concat -safe 0 -i $TMP/list.txt -c copy _avatar_fedcolageno_warp.mp4
echo -n "duracion final: "
ffprobe -v error -show_entries format=duration -of csv=p=0 _avatar_fedcolageno_warp.mp4
