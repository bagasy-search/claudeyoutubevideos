#!/bin/bash
# veoprep: por cada <id> de lista.txt → get <id>.mp4 (crudo Veo) → <id>_c.mp4 (crop anti-flash, 1280x720, 24 fps, aac 48k)
#          + <id>_q.jpg (3 cuadros: 1 s, 4 s, 7 s) + <id>.mp3 (64k mono para ASR) + fila en prep_<tanda>.jsonl (dur, lufs, dims)
set -e; TANDA=$(cat TANDA); OUT=prep_$TANDA.jsonl; : > $OUT
while read -r id; do [ -z "$id" ] && continue
  get "$id.mp4" || { echo "{\"id\":\"$id\",\"err\":\"get\"}" >> $OUT; continue; }
  dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$id.mp4")
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$id.mp4")
  ffmpeg -v error -y -i "$id.mp4" -vf "crop=1186:667:0:26,scale=1280:720:flags=lanczos,fps=24,setsar=1" -c:v libx264 -preset medium -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 "${id}_c.mp4"
  for t in 1 4 7; do ffmpeg -v error -y -ss $t -i "${id}_c.mp4" -frames:v 1 -vf scale=480:-2 f$t.png; done
  ffmpeg -v error -y -i f1.png -i f4.png -i f7.png -filter_complex "hstack=3" -q:v 3 "${id}_q.jpg"
  ffmpeg -v error -y -i "$id.mp4" -vn -ac 1 -ar 16000 -b:a 64k "$id.mp3"
  lufs=$(ffmpeg -nostats -i "$id.mp4" -af ebur128=framelog=quiet -f null - 2>&1 | grep -E "^\s+I:" | tail -1 | awk '{print $2}')
  echo "{\"id\":\"$id\",\"dims\":\"$dims\",\"dur\":$dur,\"lufs\":\"$lufs\"}" >> $OUT
  put "${id}_c.mp4" "${id}_q.jpg" "$id.mp3"; rm -f "$id.mp4" "${id}_c.mp4" f*.png
done < lista.txt
put $OUT; cp $OUT out/
