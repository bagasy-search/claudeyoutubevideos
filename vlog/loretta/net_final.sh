#!/bin/bash
# Red Loretta 4-6 — fases E/F de UN video, cuando el avatar está y el QC de clips quedó sellado:
# avatar_post → JPG + hojas → timeline --final → mezcla → entry → commit en rama congelada <slug>-render → farm (STITCH_RAW, sin esperar
# a otros) → mezcla al release assets-<slug> → codificación FINAL en el farm (encfin) → espera el release → meta.
# uso: bash vlog/loretta/net_final.sh <slug>     (log en out/final_<slug>.log)
S=$1; cd D:/Proyectos/video2-wt/lnet46 || exit 1; export SLUG=$S PYTHONUTF8=1 AGNES_KF=1; RP=bagasy-search/claudeyoutubevideos
log() { echo "$(date -u +%T) [$S] $*"; }
set -e
[ -f out/${S}_avatar/status_final.json ] || { log "⛔ falta el avatar"; exit 1; }
[ -f public/avatar_clips/$S/reel30.mp4 ] || python vlog/loretta/avatar_post.py
python vlog/loretta/post_imgs.py > /dev/null
python - <<EOF
import json, subprocess, glob, os
S = "$S"
for f in glob.glob(f"public/broll/{S}/K*.mp4") + glob.glob(f"public/broll/{S}_st/*.mp4"):
    j = f[:-4] + "_last.jpg"
    if not os.path.exists(j) or os.path.getmtime(j) < os.path.getmtime(f):
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-sseof", "-0.1", "-i", f, "-frames:v", "1", "-q:v", "3", j], check=True)
EOF
# ACEPTAR_FALTAN=1: la cola de agnes da ~20 clips/h para todas las sesiones (9-oct) → los clips que no llegaron van con su ANCLA
# (foto con Ken-Burns) a propósito; se corta el agnes_i2v de este slug para no gastar cupo.
if [ -n "$ACEPTAR_FALTAN" ]; then
  powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { \$_.CommandLine -match 'agnes_i2v\.mjs _v3/${S}_agnes_clips' } | ForEach-Object { Stop-Process -Id \$_.ProcessId -Force }" || true
  python - <<EOF
import json, os
S = "$S"; n = json.load(open(f"_v3/{S}_need.json", encoding="utf8"))
f = [c["name"] for c in n["clips"] if not os.path.exists(f"public/broll/{S}/K{c['name']}.mp4")]
json.dump(f, open(f"_v3/{S}_aceptados.json", "w")); print(S, "clips con su ancla:", len(f), "de", len(n["clips"]))
EOF
fi
node vlog/loretta/gen_timeline.mjs --final
python - <<EOF
import json, re
ts = open("src/$S/timeline.gen.ts", encoding="utf8").read(); TL = json.loads(re.search(r"export const TL: any\[\] = (.*);", ts).group(1))
# segundos; el clip pasa UNA vez y después queda su último cuadro (LorMain) → dur = lo que se ve del clip
json.dump([{"key": c["clip"].split("/")[-1][:-4], "src": c["clip"], "start": c["from"] / 30, "dur": min(c["dur"], c.get("clipF") or c["dur"]) / 30} for c in TL if c.get("clip")], open("_v3/${S}_cues.json", "w"))
EOF
node scripts/agnes_qc.mjs $S > /dev/null
node scripts/agnes_qc_gate.mjs $S _${S}_assets.txt
python vlog/loretta/mix.py
node vlog/loretta/mk_entry.mjs
until mkdir out/.gitlock.d 2>/dev/null; do sleep 3; done   # sin flock en git bash: candado por mkdir
( git add -f scripts/agnes_img_gate.mjs src/index_$S.tsx tsconfig.$S.json src/$S/timeline.gen.ts vlog/$S/dir_a.mjs guiones/${S}_filmado.txt guiones/$S.txt src/loretta vlog/loretta
  git commit -qm "$S: timeline final con avatar (red Loretta 4-6)

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>" || true
  git push -q origin lnet46-render; git push -q -f origin HEAD:refs/heads/$S-render ) && r=0 || r=$?; rmdir out/.gitlock.d; [ $r = 0 ] || exit 1
F=$(grep -oE "TOTAL_FRAMES = [0-9]+" src/$S/timeline.gen.ts | grep -oE "[0-9]+$"); ID="$(echo ${S:0:1} | tr a-z A-Z)${S:1}"; C=${CHUNKS:-60}
rm -f D:/videosdeclaude/$S.mp4
ok=0
for t in 1 2 3 4; do
  log "farm intento $t ($F cuadros, $C chunks)"
  set +e; ENTRY=src/index_$S.tsx FARM_REF=$S-render STITCH_RAW=1 FARM_FIXED_CHUNKS=1 FARM_NO_LOCK=1 AUDIO_FILE=$S.wav node scripts/farm.mjs $S $ID $F $C @_${S}_assets.txt > out/farm_${S}_try$t.log 2>&1; r=$?; set -e
  if [ $r = 0 ] && gh api repos/$RP/releases/tags/chunks-$S --jq '.assets|length' | grep -qx "$C"; then ok=1; break; fi
  log "farm falló (exit $r): $(tail -2 out/farm_${S}_try$t.log | tr '\n' ' ')"; sleep 240
done
[ $ok = 1 ] || { log "⛔ agoté reintentos del farm"; exit 1; }
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
