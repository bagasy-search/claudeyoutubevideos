#!/bin/bash
# Avatar siguiente en la cola: espera que <log_cola_previa> diga "cola terminada", después corre los slugs dados (run + avatar_post), uno a uno.
# uso: bash vlog/cv/avsig.sh <log_cola_previa> <slug> [<slug> …]
V=D:/Proyectos/video2-wt; log() { echo "$(date -u +%T) $*"; }
prev=$1; shift
until grep -q "cola terminada" "$prev" 2>/dev/null; do sleep 60; done
for s in "$@"; do
  cd $V/$s; export RUNPOD_KEY=$(grep '^RUNPOD_API_KEY_2' .env | cut -d= -f2- | tr -d '\r\042')
  SLUG=$s node vlog/cv/avatar.mjs run > vlog/$s/avatar/run_out.log 2>&1
  grep -q "LISTO reel" vlog/$s/avatar/run.log && ( SLUG=$s PYTHONIOENCODING=utf8 python vlog/cv/avatar_post.py ) && log "$s avatar OK" || log "⛔ $s avatar falló"
done
log "cola terminada"
