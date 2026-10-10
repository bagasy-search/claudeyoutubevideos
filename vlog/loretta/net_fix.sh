#!/bin/bash
# Re-render de un video YA ENTREGADO con el parche de avatar degradado (gen_timeline AV_MAX_OFF, 9-oct): restaura los assets
# del release assets-<slug> (el tar que armó el farm), timeline nuevo, farm, mezcla de vuelta al release, encfin (pisa
# releases/<slug>/<slug>.mp4 = MISMA URL que ya tiene la tarjeta de Bagasy, no hace falta re-entregar).
# uso: bash vlog/loretta/net_fix.sh <slug>
S=$1; cd D:/Proyectos/video2-wt/lnet46 || exit 1; export SLUG=$S PYTHONUTF8=1 AGNES_KF=1; RP=bagasy-search/claudeyoutubevideos
log() { echo "$(date -u +%T) [$S] $*"; }
set -e
T=D:/rtmp/lnet46/fix_$S; mkdir -p $T
if [ ! -f public/avatar_clips/$S/reel30.mp4 ]; then
  log "bajo assets-$S.tar"
  gh release download assets-$S -R $RP -p "assets-$S.tar" -D $T --clobber
  tar --force-local -xf $T/assets-$S.tar -C public; rm -f $T/assets-$S.tar
  # el tar trae SÓLO clips que ya pasaron la revisión a ojo en el 1er render; al extraer cambia el mtime y el sello se cae → re-sellar
  node scripts/agnes_qc.mjs $S > /dev/null || true
  node scripts/agnes_qc.mjs $S --revision "ninguno" > /dev/null || true
fi
[ -f public/$S.wav ] || gh release download assets-$S -R $RP -p "$S.wav" -D public --clobber
[ -f out/${S}_mix.wav ] || gh release download assets-$S -R $RP -p "${S}_mix.wav" -D out --clobber
node vlog/loretta/gen_timeline.mjs --final
python - <<EOF
import json, re
ts = open("src/$S/timeline.gen.ts", encoding="utf8").read(); TL = json.loads(re.search(r"export const TL: any\[\] = (.*);", ts).group(1))
json.dump([{"key": c["clip"].split("/")[-1][:-4], "src": c["clip"], "start": c["from"] / 30, "dur": min(c["dur"], c.get("clipF") or c["dur"]) / 30} for c in TL if c.get("clip")], open("_v3/${S}_cues.json", "w"))
EOF
node scripts/agnes_qc.mjs $S > /dev/null || true
AGNES_QC_OVERRIDE="clips revisados a ojo antes de la 1a entrega; restaurados del tar (cambia el mtime)" node scripts/agnes_qc_gate.mjs $S _${S}_assets.txt
until mkdir out/.gitlock.d 2>/dev/null; do sleep 3; done
( git add -f src/$S/timeline.gen.ts vlog/loretta scripts/agnes_img_gate.mjs scripts/farm.mjs
  git commit -qm "$S: avatar degradado del reel → foto del tema (re-render)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || true
  git push -q origin lnet46-render; git push -q -f origin HEAD:refs/heads/$S-render ) && r=0 || r=$?; rmdir out/.gitlock.d; [ $r = 0 ] || exit 1
F=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$"); ID="$(echo ${S:0:1} | tr a-z A-Z)${S:1}"; C=${CHUNKS:-60}
ok=0
for t in 1 2 3 4; do
  log "farm intento $t ($F cuadros, $C chunks)"
  set +e; ENTRY=src/index_$S.tsx FARM_REF=$S-render STITCH_RAW=1 FARM_FIXED_CHUNKS=1 FARM_NO_LOCK=1 FARM_SKIP_DOWNLOAD=1 AUDIO_FILE=$S.wav node scripts/farm.mjs $S $ID $F $C @_${S}_assets.txt > out/farmfix_${S}_try$t.log 2>&1; r=$?; set -e
  if [ $r = 0 ] && gh api repos/$RP/releases/tags/chunks-$S --jq '.assets|length' | grep -qx "$C"; then ok=1; break; fi
  log "farm falló (exit $r): $(tail -2 out/farmfix_${S}_try$t.log | tr '\n' ' ')"; sleep 240
done
[ $ok = 1 ] || { log "⛔ agoté reintentos del farm"; exit 1; }
rm -f assets-$S.tar
gh release view assets-$S -R $RP >/dev/null 2>&1 || gh release create assets-$S -R $RP --title assets-$S --notes "mezcla final $S"
gh release upload assets-$S out/${S}_mix.wav -R $RP --clobber
bash D:/Proyectos/encfin/push.sh $S $F $C
log "encfin lanzado; espero el release"
for i in $(seq 1 90); do
  sleep 120
  RID=$(gh api "repos/$RP/actions/runs?branch=encfin-$S&per_page=1" --jq '.workflow_runs[0] | "\(.status) \(.conclusion) \(.created_at)"' 2>/dev/null || echo "?")
  case "$RID" in "completed success"*) break;; "completed "*) log "⛔ encfin $RID"; exit 1;; esac
done
node scripts/check_entrega.mjs "https://github.com/$RP/releases/download/$S/$S.mp4"
log "REFIX LISTO (misma URL de entrega)"
