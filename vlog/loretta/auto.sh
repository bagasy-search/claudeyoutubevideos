#!/bin/bash
# Auto-encadenador de un video de Loretta: espera el avatar → post → timeline --final → mezcla → commit en rama congelada <slug>-render
# → espera que GitHub Actions esté operativo → farm (reintenta si el runner no se consigue). uso: bash vlog/loretta/auto.sh <slug>
S=$1; cd D:/Proyectos/video2-wt/lor3; export SLUG=$S PYTHONUTF8=1
log() { echo "$(date -u +%T) [$S] $*"; }
until [ -f out/${S}_avatar/status_final.json ]; do sleep 60; done
if [ ! -f public/avatar_clips/$S/reel30.mp4 ]; then
  python vlog/loretta/avatar_post.py || { log "avatar_post falló"; exit 1; }
  node vlog/loretta/gen_timeline.mjs --final || { log "--final falló"; exit 1; }
  python vlog/loretta/mix.py || exit 1
  ( flock 9; git add src/$S/timeline.gen.ts && git commit -qm "$S: timeline final con avatar

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"; git push -q origin lor3-render; git push -q -f origin HEAD:refs/heads/$S-render ) 9>out/.gitlock
  log "listo para farm"
fi
F=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$"); ID="$(echo ${S:0:1} | tr a-z A-Z)${S:1}"
for t in 1 2 3 4 5 6; do
  until curl -s https://www.githubstatus.com/api/v2/components.json | python -c "import json,sys;d=json.load(sys.stdin);sys.exit(0 if [c['status'] for c in d['components'] if c['name']=='Actions'][0]in ('operational','degraded_performance') else 1)"; do sleep 120; done
  log "farm intento $t ($F cuadros)"
  ENTRY=src/index_$S.tsx FARM_REF=$S-render STITCH_RAW=1 AUDIO_FILE=$S.wav node scripts/farm.mjs $S $ID $F 80 @_${S}_assets.txt > out/farm_${S}_try$t.log 2>&1
  if grep -q "la corrida fallo" out/farm_${S}_try$t.log; then log "corrida falló, reintento"; sleep 300; continue; fi
  log "FARM OK"; tail -n 5 out/farm_${S}_try$t.log; exit 0
done
log "agoté reintentos"; exit 1
