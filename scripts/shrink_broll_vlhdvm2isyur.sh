#!/bin/bash
cd "$(dirname "$0")/.."
D=public/broll/vlhdvm2isyur
n=0
while read -r name; do
  f="$D/$name.mp4"
  [ -f "$f" ] || continue
  h=$(ffprobe -v error -select_streams v:0 -show_entries stream=height -of csv=p=0 "$f" 2>/dev/null)
  sz=$(stat -c %s "$f")
  if [ "${h:-0}" -gt 720 ] || [ "$sz" -gt 6000000 ]; then
    ffmpeg -y -loglevel error -i "$f" -t 12 -an -vf "scale=-2:720" -c:v libx264 -preset veryfast -crf 24 -pix_fmt yuv420p "$D/_s_$name.mp4" 2>/dev/null \
      && mv -f "$D/_s_$name.mp4" "$f" && n=$((n+1))
  fi
  if [ $((n % 40)) -eq 0 ] && [ $n -gt 0 ]; then echo "  ...$n reencodeados"; fi
done < public/broll/_used_vlhdvm2isyur.txt
echo "REENCODE_OK $n clips · peso ahora: $(du -sh $D | cut -f1)"
