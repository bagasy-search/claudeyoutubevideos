#!/bin/bash
# re-encode de ENTREGA: PTS rehechos (N/30), rango tv + bt709, keyframe cada 2 s, sin B-frames (pts==dts), audio = MÁSTER mezclado
# uso: bash vlog/tfbtanque/entrega.sh <farm.mp4> <salida.mp4>
IN="$1"; OUT="$2"; cd D:/Proyectos/video2-wt/tfbtanque
N=$(grep -o "TOTAL_FRAMES_TFBTANQUE = [0-9]*" src/tfbtanque/timeline.gen.ts | grep -o "[0-9]*$")
ffmpeg -v error -y -i "$IN" -i public/tfbtanque.wav -map 0:v:0 -map 1:a:0 \
  -vf "setpts=N/(30*TB),scale=in_range=auto:out_range=limited:out_color_matrix=bt709,format=yuv420p" -frames:v $N -r 30 -fps_mode cfr \
  -c:v libx264 -preset faster -crf 20 -bf 0 -g 60 -keyint_min 60 -sc_threshold 0 -maxrate 8M -bufsize 12M -threads 6 \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -t $(python -c "print($N/30)") -movflags +faststart "$OUT"
echo "entrega → $OUT ($(ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=nb_read_packets -of csv=p=0 "$OUT") cuadros de $N)"
