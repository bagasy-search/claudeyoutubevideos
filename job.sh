#!/bin/bash
set -e
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate -of json e.mp4 > out/probe.json
ffmpeg -v error -y -i e.mp4 -vf "fps=1/5,scale=480:-1,tile=6x4" -frames:v 1 out/sheet.jpg
ffmpeg -hide_banner -i e.mp4 -vf blackdetect=d=0.5:pix_th=0.08 -af ebur128 -f null - 2> log.txt || true
grep -E "black_start|I:|Peak" log.txt | tail -8 > out/qc.txt
