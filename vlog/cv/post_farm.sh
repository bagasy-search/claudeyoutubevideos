#!/bin/bash
# Después del farm: espera la corrida → mezcla a assets-<slug> → borra el concat crudo → encfin (final 2K EN EL FARM) → espera el mp4 → cuadros por cabecera.
# uso: bash vlog/cv/post_farm.sh <slug> <run_id> <frames>
S=$1; RUN=$2; F=$3; CH=${CHUNKS:-60}; REPO=bagasy-search/claudeyoutubevideos; cd D:/Proyectos/video2-wt/$S
log() { echo "$(date -u +%T) [$S] $*"; }
node scripts/esperar_run.mjs $RUN || { log "farm falló"; exit 1; }
log "FARM OK"
gh release upload assets-$S out/${S}_mix.wav -R $REPO --clobber && log "mezcla subida"
gh release delete-asset $S $S.mp4 -R $REPO -y 2>/dev/null
bash D:/Proyectos/encfin/push.sh $S $F $CH && log "encfin lanzado"
until gh release view $S -R $REPO --json assets -q '.assets[].name' 2>/dev/null | grep -qx "$S.mp4"; do sleep 120; done
U=https://github.com/$REPO/releases/download/$S/$S.mp4
N=$(ffprobe -v error -select_streams v -show_entries stream=nb_frames -of csv=p=0 "$U" | tr -dc 0-9)
[ "$N" = "$F" ] && log "cuadros OK $N" || log "⛔ cuadros $N != $F"
log "LISTO PARA DELIVER · $U"
