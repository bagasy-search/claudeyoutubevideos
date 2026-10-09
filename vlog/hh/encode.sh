#!/bin/bash
# Encode de ENTREGA en el farm (rama encode-<slug>, workflow encode.yml de encode-olcanned): sube out/<slug>_mix.wav como
# mezcla.wav al release <slug>, arma chunks.json (16 tramos) y empuja la rama. uso: bash vlog/hh/encode.sh <slug> <run_id_render>
set -e
S=$1; RUN=$2; W=/d/Proyectos/video2-wt/lhh; REPO=bagasy-search/claudeyoutubevideos
N=$(grep -oE "TOTAL_FRAMES = [0-9]+" $W/src/$S/timeline.gen.ts | grep -oE "[0-9]+$")
gh release view $S -R $REPO >/dev/null 2>&1 || gh release create $S -R $REPO --title $S --notes "$S entrega"
mkdir -p /d/rtmp/enc_$S; cp $W/out/${S}_mix.wav /d/rtmp/enc_$S/mezcla.wav
for t in 1 2 3 4 5; do gh release upload $S /d/rtmp/enc_$S/mezcla.wav -R $REPO --clobber && break; sleep 60; done
python - "$RUN" "$N" > /d/rtmp/enc_$S/chunks.json <<'PY'
import json,sys
run,tot=sys.argv[1],int(sys.argv[2]); n=24; f=-(-tot//n)
print(json.dumps({"run":run,"total":tot,"tramos":[{"k":k,"a":k*f,"f":min(f,tot-k*f)} for k in range(n) if k*f<tot]}))
PY
cd $W
H1=$(MSYS_NO_PATHCONV=1 git show origin/encode-olcanned:.github/workflows/encode.yml | git hash-object -w --stdin)
H2=$(git hash-object -w /d/rtmp/enc_$S/chunks.json)
TW=$(printf "100644 blob $H1\tencode.yml\n" | git mktree); TG=$(printf "040000 tree $TW\tworkflows\n" | git mktree)
T=$(printf "040000 tree $TG\t.github\n100644 blob $H2\tchunks.json\n" | git mktree)
C=$(echo "encode $S (run $RUN, $N cuadros)" | git commit-tree $T)
for t in 1 2 3 4 5; do git push -f origin $C:refs/heads/encode-$S && break; sleep 60; done
echo "encode-$S empujada ($C) · $N cuadros"
