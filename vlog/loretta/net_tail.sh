#!/bin/bash
# Post-farm de net_final (render ya hecho, chunks-<slug> completo): mezcla al release → encfin → espera → check → meta. uso: bash vlog/loretta/net_tail.sh <slug>
S=$1; cd D:/Proyectos/video2-wt/lnet46 || exit 1; export SLUG=$S PYTHONUTF8=1; RP=bagasy-search/claudeyoutubevideos
log() { echo "$(date -u +%T) [$S] $*"; }
set -e
F=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$"); C=${CHUNKS:-60}
gh release view assets-$S -R $RP >/dev/null 2>&1 || gh release create assets-$S -R $RP --title assets-$S --notes "mezcla final $S"
gh release upload assets-$S out/${S}_mix.wav -R $RP --clobber
bash D:/Proyectos/encfin/push.sh $S $F $C
log "encfin lanzado; espero el release"
for i in $(seq 1 90); do
  sleep 120
  RID=$(gh api "repos/$RP/actions/runs?branch=encfin-$S&per_page=1" --jq '.workflow_runs[0] | "\(.status) \(.conclusion)"' 2>/dev/null || echo "?")
  case "$RID" in "completed success") break;; "completed "*) log "⛔ encfin $RID"; exit 1;; esac
done
node scripts/check_entrega.mjs "https://github.com/$RP/releases/download/$S/$S.mp4"
python vlog/loretta/net_meta.py
log "LISTO PARA DELIVER"
