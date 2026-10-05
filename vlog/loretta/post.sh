#!/bin/bash
# Post-farm de un video de Loretta: espera "FARM OK" del auto.sh → re-encode de entrega (cuadros == TOTAL_FRAMES) → auditor del minuto 1
# (hojas en _v3/audit_<slug>/) → release <slug> con <slug>.mp4 (HTTP 200). El deliver_card lo corro yo tras mirar las hojas.
S=$1; cd D:/Proyectos/video2-wt/lor3; export SLUG=$S PYTHONUTF8=1; R=bagasy-search/claudeyoutubevideos
log() { echo "$(date -u +%T) [$S] $*"; }
until grep -q "FARM OK" out/auto_$S.log 2>/dev/null; do grep -q "agoté\|falló" out/auto_$S.log 2>/dev/null && { log "auto.sh falló"; exit 1; }; sleep 60; done
mkdir -p out/up; IN=D:/videosdeclaude/$S.mp4
bash vlog/loretta/entrega.sh $IN out/up/$S.mp4 || { log "entrega falló"; exit 1; }
N=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$")
G=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 out/up/$S.mp4)
[ "$G" = "$N" ] && log "cuadros OK $G" || { log "⛔ cuadros $G != $N"; exit 1; }
python vlog/loretta/audit.py out/up/$S.mp4
gh release view $S -R $R >/dev/null 2>&1 || gh release create $S -R $R --title $S --notes "$S entrega"
gh release upload $S out/up/$S.mp4 -R $R --clobber && log "release subido"
log "HTTP $(curl -sIL -o /dev/null -w '%{http_code}' https://github.com/$R/releases/download/$S/$S.mp4) · LISTO PARA DELIVER"
