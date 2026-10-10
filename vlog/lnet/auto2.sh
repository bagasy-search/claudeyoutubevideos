#!/bin/bash
# Auto-encadenador de un video de la red Loretta (worktree lnet): espera el avatar → avatar_post → timeline --final → mezcla →
# commit en la rama congelada <slug>-render → farm (STITCH_RAW, chunks guardados en chunks-<slug>) → FINAL codificado EN EL FARM
# (encfin: setpts N/30, bt709 tv, -bf 0, cuadros == TOTAL_FRAMES, mezcla determinista) → release <slug>/<slug>.mp4.
# uso: bash vlog/lnet/auto2.sh <slug>   (= auto.sh + AV_MAX_OFF de gen_timeline + mezcla reusada/serializada)   (nada de render ni encode pesado local: esta PC es la laptop)
S=$1; cd D:/Proyectos/video2-wt/lnet; export SLUG=$S PYTHONUTF8=1; REPO=bagasy-search/claudeyoutubevideos; CH=${CHUNKS:-60}
log() { echo "$(date -u +%T) [$S] $*"; }
until [ -f out/${S}_avatar/status_final.json ]; do sleep 60; done
python vlog/loretta/post_imgs.py >/dev/null 2>&1   # PNG aprobados → JPG (si no, --final dice "falta imagen")
if [ ! -f public/avatar_clips/$S/reel30.mp4 ]; then python vlog/loretta/avatar_post.py || { log "avatar_post falló (¿mp4 corto?)"; exit 1; }; fi
for f in public/broll/$S/*.mp4; do [ -f "${f%.mp4}_last.jpg" ] || ffmpeg -v error -y -sseof -0.1 -i "$f" -frames:v 1 -q:v 3 "${f%.mp4}_last.jpg"; done   # último cuadro de cada clip agnes (el plano sigue congelado si es más largo)
node vlog/lnet/gen_timeline.mjs --final || { log "--final falló"; exit 1; }
# auto2 (10-oct): la mezcla no depende del recorte de avatar → si ya existe no se rehace; y de a una (varias a la vez = MemoryError)
if [ ! -s out/${S}_mix.wav ]; then until mkdir out/.mixlock.d 2>/dev/null; do sleep 10; done; python vlog/loretta/mix.py; rc=$?; rmdir out/.mixlock.d; [ $rc = 0 ] || { log "mix falló"; exit 1; }; fi
node vlog/loretta/mk_entry.mjs
until mkdir out/.gitlock.d 2>/dev/null; do sleep 5; done; ( git add src/$S src/index_$S.tsx tsconfig.$S.json src/loretta vlog/lnet _${S}_assets.txt 2>/dev/null; git commit -qm "$S: timeline final con avatar

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"; git push -q origin lnet-render; git push -q -f origin HEAD:refs/heads/$S-render ); rmdir out/.gitlock.d   # lock por mkdir (Git Bash no trae flock)
F=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$"); ID="$(echo ${S:0:1} | tr a-z A-Z)${S:1}"
log "farm ($F cuadros, $CH chunks)"
for t in 1 2 3; do
  ENTRY=src/index_$S.tsx FARM_REF=$S-render STITCH_RAW=1 FARM_FIXED_CHUNKS=1 FARM_NO_LOCK=1 AUDIO_FILE=$S.wav node scripts/farm.mjs $S $ID $F $CH @_${S}_assets.txt > out/farm_${S}_try$t.log 2>&1
  RC=$?; [ $RC = 0 ] || { log "farm salió $RC (ver out/farm_${S}_try$t.log), reintento"; grep -q "PRE-VUELO" out/farm_${S}_try$t.log && { log "pre-vuelo: no reintento"; exit 1; }; sleep 300; continue; }   # sólo exit 0 = OK (antes cualquier salida contaba como OK)
  log "FARM OK"; OK=1; break
done
[ "$OK" = 1 ] || { log "agoté reintentos del farm"; exit 1; }
# final en el farm: la mezcla al release assets-<slug> + rama encfin-<slug>
gh release view assets-$S -R $REPO >/dev/null 2>&1 || gh release create assets-$S -R $REPO --title assets-$S --notes "assets $S"
gh release upload assets-$S out/${S}_mix.wav -R $REPO --clobber && log "mezcla subida"
gh release delete-asset $S $S.mp4 -R $REPO -y 2>/dev/null   # el concat crudo del farm NO es la entrega
rm -f D:/videosdeclaude/$S.mp4
bash D:/Proyectos/encfin/push.sh $S $F $CH && log "encfin lanzado"
until gh release view $S -R $REPO --json assets -q '.assets[].name' 2>/dev/null | grep -qx "$S.mp4"; do sleep 120; done
mkdir -p out/up; gh release download $S -R $REPO -p "$S.mp4" -D out/up --clobber
N=$(ffprobe -v error -count_packets -select_streams v -show_entries stream=nb_read_packets -of csv=p=0 out/up/$S.mp4 | tr -dc 0-9)
[ "$N" = "$F" ] && log "cuadros OK $N" || log "⛔ cuadros $N != $F"
python vlog/loretta/audit.py out/up/$S.mp4
log "LISTO PARA DELIVER · https://github.com/$REPO/releases/download/$S/$S.mp4"
