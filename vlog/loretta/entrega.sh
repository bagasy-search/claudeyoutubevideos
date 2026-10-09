#!/bin/bash
# Re-encode de ENTREGA (el mp4 del farm nunca va crudo): PTS rehechos (cuadros == TOTAL_FRAMES), yuv420p/tv/bt709, g=60, faststart,
# -bf 0, audio = la mezcla final determinista (out/<slug>_mix.wav). uso: SLUG=x bash vlog/loretta/entrega.sh <farm.mp4> <salida.mp4>
set -e
IN=$1; OUT=$2; cd D:/Proyectos/video2-wt/lnet46
N=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$SLUG/timeline.gen.ts | grep -oE "[0-9]+$")
ffmpeg -v error -y -i "$IN" -i out/${SLUG}_mix.wav -map 0:v:0 -map 1:a:0 \
  -vf "setpts=N/(30*TB),scale=in_range=full:out_range=limited:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p" \
  -fps_mode passthrough -frames:v $N -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -preset faster -crf 20 -bf 0 -maxrate 8M -bufsize 12M -g 60 -keyint_min 60 -sc_threshold 0 -threads 8 \
  -c:a aac -b:a 192k -ar 48000 -ac 2 -t $(python -c "print($N/30)") -movflags +faststart "$OUT"
ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets,pix_fmt,color_range,color_space -of csv=p=0 "$OUT"
