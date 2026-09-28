#!/bin/bash
# clips_escena.sh S1 S2 … — lanza los clips HABLADOS/vecino (no los detalles) de cada escena, en paralelo por escena, y espera
cd "$(dirname "$0")/../.."
for S in "$@"; do
  ids=$(python -c "import json;p=json.load(open('vlog/tfbcola/$S.json',encoding='utf8'));import os;st=json.load(open(p['dir']+'clips/state.json')) if os.path.exists(p['dir']+'clips/state.json') else {};print(' '.join(c['id'] for c in p['clips'] if not c.get('detail') and c['id'] not in st))")
  [ -z "$ids" ] && { echo "$S: nada que generar"; continue; }
  echo "$S: $ids"
  node scripts/agnes_vlog.mjs D:/Proyectos/video2-wt/tfbcola/vlog/tfbcola/$S.json clips $ids > out/clips_$S.log 2>&1 &
done
wait
echo "listas: $*"
