#!/bin/bash
# mezcla de $S: el audio real de los mismos cortes de la edl (mix_plan.json) + room tone continuo → -14 LUFS, anti-mudo. Sin música, sin voz.
set -e
mkdir -p v
for c in $(python3 -c "import json;print(' '.join(sorted({s['c'] for s in json.load(open('mix_plan.json'))['segs']})))"); do
  get "${S}_v_$c.mp4"; ffmpeg -v error -y -i "${S}_v_$c.mp4" -vn -ar 48000 -ac 2 -c:a pcm_s16le v/$c.wav || ffmpeg -v error -y -f lavfi -i anullsrc=r=48000:cl=stereo -t 8 v/$c.wav; rm -f "${S}_v_$c.mp4"
done
python3 mix.py
ffmpeg -v error -y -i ${S}_mix.wav -c:a aac -b:a 192k ${S}_mix.m4a
put ${S}_mix.wav ${S}_mix.m4a out/mix.json
