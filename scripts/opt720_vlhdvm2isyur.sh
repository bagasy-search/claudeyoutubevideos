#!/bin/bash
cd "$(dirname "$0")/.."
D=public/broll/vlhdvm2isyur
n=0; done_=0
for f in $D/*.mp4; do
  n=$((n+1))
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f" 2>/dev/null | head -1)
  sz=$(stat -c%s "$f" 2>/dev/null)
  if [ -z "$h" ]; then echo "SKIP(no video) $f"; continue; fi
  if [ "$h" -le 720 ] && [ "$sz" -lt 6000000 ]; then continue; fi
  t="${f%.mp4}._t.mp4"
  ffmpeg -y -v error -t 12 -i "$f" -vf "scale=-2:720" -c:v libx264 -preset ultrafast -crf 25 -an -pix_fmt yuv420p "$t" 2>/dev/null
  if [ -s "$t" ]; then mv -f "$t" "$f"; done_=$((done_+1)); else rm -f "$t"; fi
done
echo "procesados $done_/$n · peso final: $(du -sh $D | cut -f1)"
