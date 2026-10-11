#!/bin/bash
# Render en el farm + mezcla al release + encfin 2K, en serie.  bash vlog/cc/farm_final.sh <slug>
# ⛔ farm.mjs RECREA el release assets-<slug> (borra la mezcla): la mezcla se sube DESPUÉS del farm, siempre.
set -e
S=$1; C=$(python -c "print('$S'[0].upper()+'$S'[1:])"); cd /d/Proyectos/video2-wt/ccfrijoles
N=$(grep -o '[0-9]\+' src/$S/total.ts)
git add src/$S src/index_$S.tsx src/claudio/ClIntro.tsx vlog/cc vlog/$S/armar.py _${S}_assets.txt 2>/dev/null || true
git diff --cached --quiet || git commit -qm "$S: montaje $(python -c "print(round($N/30/60,2))") min

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git push -q origin ccfrijoles-render 2>&1 | grep -v "^remote" || true
mkdir -p /d/rtmp/cc/tar; rm -f public/${S}_fish.wav
RUN=$(FARM_DEREFERENCE_LINKS=1 ENTRY=src/index_$S.tsx FARM_REF=ccfrijoles-render TAR_DIR=D:/rtmp/cc/tar FARM_NOWAIT=1 timeout 3600 node scripts/farm.mjs $S $C $N 60 @_${S}_assets.txt 2>&1 | grep -o "WAIT_RUN: [0-9]*" | cut -d' ' -f2)
rm -f /d/rtmp/cc/tar/assets-$S.tar public/${S}_fish.wav
[ -n "$RUN" ] || { echo "✗ $S: farm no disparó"; exit 1; }
echo "$(date +%T) $S render $RUN ($N cuadros)"
gh release upload assets-$S C:/rtmp_cc/out/${S}_mix.wav --clobber --repo bagasy-search/claudeyoutubevideos
node scripts/esperar_run.mjs $RUN 2>&1 | tail -n 1
bash D:/Proyectos/encfin/push.sh $S $N 60 | tail -n 1; sleep 40
E=$(gh run list --repo bagasy-search/claudeyoutubevideos --branch encfin-$S --limit 1 --json databaseId -q '.[0].databaseId')
echo "$(date +%T) $S encfin $E"
node scripts/esperar_run.mjs $E 2>&1 | tail -n 1
gh release view $S --repo bagasy-search/claudeyoutubevideos --json assets -q '.assets[] | "\(.name) \(.size)"'
