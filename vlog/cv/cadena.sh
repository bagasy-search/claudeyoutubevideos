#!/bin/bash
# Cadena final de un cv* (formato híbrido): ensamblar2 → recorte → mkov → mezcla → commit+push → farm (nowait) → post_farm (encfin, cuadros).
# Requiere: avatar reel30 listo, anclas listas, stock revisado, src/index_<slug>.tsx, public/img/<slug>/{page*.jpg,qr.png,cover.jpg}.
# uso: bash vlog/cv/cadena.sh <slug>
S=$1; V=D:/Proyectos/video2-wt; cd $V/$S || exit 1; export SLUG=$S PYTHONIOENCODING=utf8
log() { echo "$(date -u +%T) [$S] $*"; }
[ -f public/avatar_clips/$S/reel30.mp4 ] || { log "⛔ falta reel30 del avatar"; exit 1; }
node vlog/cv/ensamblar2.mjs | tail -2 || { log "⛔ ensamblar2"; exit 1; }
rm -rf vlog/$S/_ens2
python vlog/cv/recorte.py | tail -1 || { log "⛔ recorte"; exit 1; }
rm -f public/vid/$S/vlog_raw.mp4
python vlog/cv/mkov.py | grep -E "⚠️|MEDIDO" || { log "⛔ mkov"; exit 1; }
python vlog/cv/mezcla.py | tail -1 || { log "⛔ mezcla"; exit 1; }
[ -d public/sfx ] || cp -r C:/Users/bauti/Downloads/video2/public/sfx public/sfx
[ -d public/med ] || cp -r C:/Users/bauti/Downloads/video2/public/med public/med
{ echo "vid/$S"; for f in public/img/$S/*; do echo "${f#public/}"; done; } > _${S}_assets.txt
F=$(grep -oE "[0-9]+" src/$S/total.ts | tail -1); ID="$(echo ${S:0:1} | tr a-z A-Z)${S:1}"
git add vlog/cv src/$S src/index_$S.tsx _${S}_assets.txt vlog/$S/*.json vlog/$S/*.py vlog/$S/*.mjs vlog/$S/*.txt 2>/dev/null
git commit -qm "$S: timeline final (híbrido)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"; git push -q origin $S-render 2>/dev/null
mkdir -p D:/rtmp/$S out
ENTRY=src/index_$S.tsx FARM_REF=$S-render TAR_DIR=D:/rtmp/$S FARM_NOWAIT=1 node scripts/farm.mjs $S $ID $F 60 @_${S}_assets.txt > out/farm_$S.log 2>&1 || { log "⛔ farm (ver out/farm_$S.log)"; tail -5 out/farm_$S.log; exit 1; }
rm -f D:/rtmp/$S/*.tar
RUN=$(grep -oE "WAIT_RUN: [0-9]+" out/farm_$S.log | grep -oE "[0-9]+$"); log "farm lanzado run $RUN ($F cuadros)"
bash vlog/cv/post_farm.sh $S $RUN $F
