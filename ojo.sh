#!/bin/bash
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,avg_frame_rate,nb_frames -of json $f > probe_$S.json
ffmpeg -nostats -i $f -vf "blackdetect=d=0.3:pix_th=0.10" -an -f null - 2> det_$S.txt; grep -E "black_start" det_$S.txt > dets_$S.txt || true
python3 ojo_farm.py $S $f cortes_$S.txt $(cat chunklen_$S.txt)
L=$(ffmpeg -nostats -i $f -af ebur128 -vn -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
echo "{\"slug\":\"$S\",\"lufs\":\"$L\",\"black\":$(grep -c black_start dets_$S.txt)}" > q_$S.json
