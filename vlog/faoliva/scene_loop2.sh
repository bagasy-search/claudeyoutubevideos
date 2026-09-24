#!/bin/bash
# reanudación desde disco: genera SÓLO los clips que faltan en state.json, después check (ASR en Modal: whisper-1 sin crédito)
# y regenera los ⛔ (hasta 2 vueltas), y armar. Si el check NO MIDIÓ (ASR/visión caídos) → NO regenera: para (exit 2).
S=$1; cd /d/Proyectos/video2-wt/faoliva
export VLOG_SLOTS_DIR=D:/rtmp/vlog_slots VLOG_MAX=${VLOG_MAX_OVR:-16} PYTHONUTF8=1
L=vlog/faoliva/loop2_$S.log
MISS=$(python -c "import json,os;P=json.load(open('vlog/faoliva/plan_$S.json',encoding='utf-8'));p='vlog/faoliva/$S/clips/state.json';st=json.load(open(p)) if os.path.exists(p) else {};print(' '.join(c['id'] for c in P['clips'] if c['id'] not in st))")
echo "faltan: $MISS" >> $L
[ -n "$MISS" ] && node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json clips $MISS >> $L 2>&1
for v in 1 2 3; do
  modal run modal_clipasr.py --scenes $S --vdir D:/Proyectos/video2-wt/faoliva/vlog/faoliva >> $L 2>&1
  node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json check > vlog/faoliva/check2_${S}_$v.log 2>&1
  NT=$(grep -cE 'dice: "\(timeout\)"|sin respuesta' vlog/faoliva/check2_${S}_$v.log)
  if [ "$NT" -gt 0 ]; then echo "check $v: $NT sin medir (ASR/visión caídos) → NO regenero" >> $L; echo "NO-MIDIO $S" >> $L; exit 2; fi
  BAD=$(grep -E "⛔ REGENERAR|FALTA" vlog/faoliva/check2_${S}_$v.log | awk '{print ($2=="FALTA")?$3:$2}' | sort -u | tr '\n' ' ')
  echo "check $v: malos = $BAD" >> $L
  [ -z "$BAD" ] && break
  [ $v = 3 ] && break
  node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json clips $BAD >> $L 2>&1
done
node scripts/agnes_vlog.mjs vlog/faoliva/plan_$S.json armar >> $L 2>&1
echo "FIN $S" >> $L
