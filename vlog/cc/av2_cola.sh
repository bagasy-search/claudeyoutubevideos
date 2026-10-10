#!/bin/bash
# Cola SERIE de avatares (un /run de RunPod por vez). Args: slug (2º run, av2) o slug:1 (1er run, av). Espera a que no haya otro run/poll vivo.
cd /d/Proyectos/video2-wt/ccfrijoles
K2=$(grep -h '^RUNPOD_API_KEY_2=' .env ../../video2/.env 2>/dev/null | head -1 | cut -d= -f2- | tr -d '\r"')
for a in "$@"; do
  v=${a%%:*}; if [ "$a" != "$v" ]; then T=""; K=av; else T=2; K=av2; fi
  while ps -ef | grep -v grep | grep -qE "avatar_run.mjs (run|poll)"; do sleep 30; done
  echo "$(date +%T) >>> $v$T"
  AVTAG=$T AVK=$K SLUG=$v RUNPOD_KEY=$K2 node vlog/cc/avatar_run.mjs run > /c/rtmp_cc/avatar_${v}$T.log 2>&1
  echo "$(date +%T) <<< $v$T $(tail -n 1 /c/rtmp_cc/avatar_${v}$T.log)"
done
