#!/bin/bash
# loop anti-throttle: re-corre fetchstock (saltea existentes) hasta completar o agotar intentos
cd "$(dirname "$0")/.."
for i in $(seq 1 40); do
  before=$(ls public/broll/vlhdvm2isyur/*.mp4 2>/dev/null | wc -l)
  node fetchstock.mjs --slug vlhdvm2isyur public/broll/dense_vlhdvm2isyur.json > /tmp/fs_vlh.log 2>&1
  after=$(ls public/broll/vlhdvm2isyur/*.mp4 2>/dev/null | wc -l)
  echo "[pasada $i] $before -> $after clips"
  if [ "$after" -ge 300 ]; then echo "SUFICIENTE: $after clips"; break; fi
  if [ "$after" -le "$before" ]; then echo "sin progreso, espero 60s"; sleep 60; fi
done
echo "FINAL: $(ls public/broll/vlhdvm2isyur/*.mp4 2>/dev/null | wc -l) clips"
