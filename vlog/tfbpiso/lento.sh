#!/bin/bash
# supervisor LENTO (cupo gratis de agnes agotado, orden del orquestador): 1 clip en vuelo, reintento cada 10 min.
# Primero las regeneraciones del minuto 1, después los faltantes en orden de la línea de tiempo.
cd D:/Proyectos/video2-wt/tfbpiso
export VLOG_SLOTS_DIR=D:/Proyectos/video2-wt/tfbpiso/vlog/tfbpiso/_slots VLOG_MAX=1 VLOG_RETRY_MS=600000
run() { echo "$(date -u +%T) $1 $2"; node scripts/agnes_vlog.mjs vlog/tfbpiso/plan_$1.json clips $2 >> vlog/tfbpiso/clips_$1.log 2>&1; }
[ -f vlog/tfbpiso/STOP ] && exit 0
for x in "S1 s1_01" "S1 s1_03" "S3B s3b_05" "S9B s9b_02"; do set -- $x; [ -f vlog/tfbpiso/STOP ] && exit 0; run $1 $2; done
for s in S2 S3 S4 S6 S7 S8 S9 S10; do
  for id in $(node -e "const fs=require('fs'),p=require('./vlog/tfbpiso/plan_$s.json');const st={};for(const f of ['state.json','state_det.json']){const q=p.dir+'/clips/'+f;if(fs.existsSync(q))Object.assign(st,JSON.parse(fs.readFileSync(q)))}console.log(p.clips.filter(c=>!st[c.id]).map(c=>c.id).join(' '))"); do
    [ -f vlog/tfbpiso/STOP ] && exit 0; run $s $id; done
done
