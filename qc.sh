#!/bin/bash
S=$1; f=$S.mp4
ffprobe -v error -show_entries format=duration -of json $f > probe_$S.json
ffmpeg -nostats -i $f -an -vf "scale=320:-1,blackframe=amount=98:threshold=24" -f null - 2>&1 | grep blackframe > dets_$S.txt || true
L=$(ffmpeg -nostats -i $f -vn -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):" | tr -s ' ' | tr '\n' ' ')
echo "{\"slug\":\"$S\",\"av_pct\":0,\"blackframes\":$(grep -c blackframe dets_$S.txt),\"loud\":\"$L\"}" > r_$S.json
echo "{}" > q_$S.json
python3 -c "print()" ; ffmpeg -v error -i $f -vf "select=not(mod(n\,900)),scale=480:-1,tile=4x4" -fps_mode vfr -q:v 4 sheet_${S}_%02d.jpg
