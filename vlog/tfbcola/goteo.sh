#!/bin/bash
# goteo.sh — con el cupo gratis de agnes agotado (27-sep): UN clip en vuelo, reintento de POST cada ≥10 min, en orden de escena.
# Se frena prolijo creando vlog/tfbcola/STOP.
cd "$(dirname "$0")/../.."
export AGNES_RETRY_MS=600000
for S in S3 S6 S8 S9 S9m S9b S10 S10b S11 S12 S13; do
  for id in $(python -c "import json,os;p=json.load(open('vlog/tfbcola/$S.json',encoding='utf8'));f=p['dir']+'clips/state.json';st=json.load(open(f)) if os.path.exists(f) else {};print(' '.join(c['id'] for c in p['clips'] if not c.get('detail') and c['id'] not in st))"); do
    [ -f vlog/tfbcola/STOP ] && { echo "$(date +%T) STOP"; exit 0; }
    echo "$(date +%T) $S $id"; node scripts/agnes_vlog.mjs D:/Proyectos/video2-wt/tfbcola/vlog/tfbcola/$S.json clips $id >> out/goteo_$S.log 2>&1
    grep -h " OK \| FAIL\| REJECT\|GAVE\|TIMEOUT" out/goteo_$S.log | tail -1
  done
done
echo "$(date +%T) goteo terminado"
