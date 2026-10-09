#!/bin/bash
# Después de la voz: espera VOZ+ASR OK → director → b-roll contextual → reel de avatar → /run RunPod (un job). uso: bash vlog/lnet/tras_voz.sh <slug>
S=$1; cd D:/Proyectos/video2-wt/lnet; export SLUG=$S PYTHONUTF8=1
log() { echo "$(date -u +%T) [$S] $*"; }
until grep -q "VOZ+ASR OK" out/voz_$S.log 2>/dev/null; do grep -qE "falló|sin master" out/voz_$S.log 2>/dev/null && { log "voz falló"; exit 1; }; sleep 30; done
node vlog/lnet/dir.mjs > out/dir_$S.log 2>&1 || { log "dir falló"; exit 1; }
cp _v3/${S}_shots.json _v3/${S}_shots_dir.json
node vlog/lnet/autobroll.mjs > out/autobroll_$S.log 2>&1 || log "autobroll falló (sigue con genéricas)"
node vlog/loretta/avatar_run.mjs build >> out/dir_$S.log 2>&1 || { log "avatar build falló"; exit 1; }
log "listo para avatar: $(tail -1 out/dir_$S.log)"
node vlog/loretta/avatar_run.mjs run > out/${S}_avatar_run.log 2>&1
log "avatar terminó: $(tail -1 out/${S}_avatar/run.log)"
