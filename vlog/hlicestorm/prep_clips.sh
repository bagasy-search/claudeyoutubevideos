#!/bin/bash
# clips agnes 2.5 hablados (mejor versión según check → state.json) → public/vid/hlicestorm/<id>.mp4, 1920x1080 30/1 CFR mudo
cd D:/Proyectos/video2-wt/hlicestorm
CL=vlog/hlicestorm/M1/clips
for id in m1; do f=$(python -c "import json;print(json.load(open('$CL/state.json'))['$id']['file'])")
  ffmpeg -v error -y -i $CL/$f -an -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,format=yuv420p" -r 30 -c:v libx264 -crf 19 -preset veryfast public/vid/hlicestorm/$id.mp4
  echo "$id <- $f $(ffprobe -v error -show_entries format=duration -of csv=p=0 public/vid/hlicestorm/$id.mp4)"; done
