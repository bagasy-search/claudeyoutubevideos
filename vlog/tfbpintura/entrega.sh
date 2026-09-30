#!/usr/bin/env bash
# entrega.sh — baja el MP4 crudo del farm (curl -L), re-encodea con la receta de entrega (tv, bt709, CFR, cuadros ==
# TOTAL, audio = mezcla final), corre el AUDITOR y reemplaza el asset del release.
set -e
cd D:/Proyectos/video2-wt/tfbpintura
R=bagasy-search/claudeyoutubevideos; S=tfbpintura; TOT=30157; D=D:/videosdeclaude
mkdir -p $D/_dl_$S
[ -s $D/_dl_$S/raw.mp4 ] || curl -sL -o $D/_dl_$S/raw.mp4 "https://github.com/$R/releases/download/$S/$S.mp4"
ls -la $D/_dl_$S/raw.mp4
ffprobe -v error -select_streams v -show_entries stream=pix_fmt,color_range,color_space,r_frame_rate -of csv=p=0 $D/_dl_$S/raw.mp4
ffmpeg -v error -y -i $D/_dl_$S/raw.mp4 -i public/${S}_fish.wav -map 0:v:0 -map 1:a:0 \
  -vf "setpts=N/(30*TB),scale=in_range=full:out_range=limited:in_color_matrix=bt470bg:out_color_matrix=bt709,format=yuv420p" \
  -fps_mode cfr -r 30 -frames:v $TOT \
  -color_range tv -colorspace bt709 -color_primaries bt709 -color_trc bt709 \
  -c:v libx264 -preset faster -crf 20 -maxrate 8M -bufsize 12M -g 60 -keyint_min 60 -sc_threshold 0 -bf 0 -threads 8 \
  -c:a aac -b:a 192k -ar 48000 -movflags +faststart $D/$S.mp4
PYTHONIOENCODING=utf8 python vlog/tfbpintura/auditor.py $D/$S.mp4 $TOT
