#!/bin/bash
# clips → check → regenera los ⛔ (hasta 2 vueltas) → armar. Uso: bash scene_loop.sh S1 [skipclips]
S=$1; cd /d/Proyectos/video2-wt/faoliva
export VLOG_SLOTS_DIR=D:/rtmp/vlog_slots VLOG_MAX=12
L=vlog/faoliva/loop_$S.log
[ "$2" = "skipclips" ] || node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json clips >> $L 2>&1
for v in 1 2 3; do
  node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json check > vlog/faoliva/check_${S}_$v.log 2>&1
  BAD=$(grep -E "⛔ REGENERAR|FALTA" vlog/faoliva/check_${S}_$v.log | awk '{print ($2=="FALTA")?$3:$2}' | sort -u | tr '\n' ' ')
  echo "check $v: malos = $BAD" >> $L
  [ -z "$BAD" ] && break
  [ $v = 3 ] && break
  node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json clips $BAD >> $L 2>&1
done
node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json armar >> $L 2>&1
echo "FIN $S" >> $L
