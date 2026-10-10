#!/bin/bash
# Cola de avatares RunPod (UNO a la vez): espera el reel.mp4 del que está corriendo, le pasa avatar_post, y dispara el siguiente.
# uso: bash vlog/cv/avcola.sh <slug_corriendo> <slug_sig1> [<slug_sig2> …]
V=D:/Proyectos/video2-wt; log() { echo "$(date -u +%T) $*"; }
first=$1; shift
until grep -q "LISTO reel\|FALLÓ" $V/$first/vlog/$first/avatar/run.log 2>/dev/null; do sleep 60; done
( cd $V/$first && SLUG=$first PYTHONIOENCODING=utf8 python vlog/cv/avatar_post.py ) && log "$first avatar_post OK" || log "⛔ $first avatar_post falló"
for s in "$@"; do
  cd $V/$s; export RUNPOD_KEY=$(grep '^RUNPOD_API_KEY_2' .env | cut -d= -f2- | tr -d '\r\042')
  SLUG=$s node vlog/cv/avatar.mjs run > vlog/$s/avatar/run_out.log 2>&1
  grep -q "LISTO reel" vlog/$s/avatar/run.log && ( SLUG=$s PYTHONIOENCODING=utf8 python vlog/cv/avatar_post.py ) && log "$s avatar OK" || log "⛔ $s avatar falló"
done
log "cola terminada"
