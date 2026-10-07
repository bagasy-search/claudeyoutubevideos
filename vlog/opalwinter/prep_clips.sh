#!/bin/bash
# clips agnes 2.5 hablados (mejor versión según check → state.json) → public/vid/opalwinter/<id>.mp4, 1920x1080 30/1 CFR mudo
cd D:/Proyectos/video2-wt/opalwinter
CL=vlog/opalwinter/M1/clips
for id in ${IDS:-m1 m2 m3}; do f=$(python -c "import json;print(json.load(open('$CL/state.json'))['$id']['file'])")
  ffmpeg -v error -y -i $CL/$f -an -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p" -r 30 -c:v libx264 -crf 19 -preset veryfast public/vid/opalwinter/$id.mp4
  echo "$id <- $f $(ffprobe -v error -show_entries format=duration -of csv=p=0 public/vid/opalwinter/$id.mp4)"; done
