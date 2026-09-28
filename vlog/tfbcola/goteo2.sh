#!/bin/bash
# goteo2.sh — supervisor de clips con cupo escaso: 1 en vuelo mientras agnes rechaza ("free users"); si los 2 últimos
# envíos entraron a la cola en < 3 min, sube a 3 en vuelo (tope: somos 6 agentes). Reintento de POST cada ≥10 min.
# Frenar prolijo: touch vlog/tfbcola/STOP2 (no lanza más; los que están en vuelo terminan).
cd "$(dirname "$0")/../.."
export AGNES_RETRY_MS=600000
ORD="S3 S6 S8 S9 S9m S9b S10 S10b S11 S12 S13"
pend() { for S in $ORD; do python -c "import json,os;p=json.load(open('vlog/tfbcola/$S.json',encoding='utf8'));f=p['dir']+'clips/state.json';st=json.load(open(f)) if os.path.exists(f) else {};print('\n'.join('$S '+c['id'] for c in p['clips'] if not c.get('detail') and c['id'] not in st))"; done | grep .; }
declare -A PID T0 OKQ; fast=0; K=1
while true; do
  for k in "${!PID[@]}"; do kill -0 ${PID[$k]} 2>/dev/null || unset PID[$k]; done
  for k in "${!PID[@]}"; do id=${k#* }; [ -z "${OKQ[$k]}" ] && grep -q "en cola $id" out/goteo2_${k%% *}.log 2>/dev/null && { OKQ[$k]=1; dt=$(( $(date +%s) - T0[$k] )); if [ $dt -lt 180 ]; then fast=$((fast+1)); else fast=0; fi; echo "$(date +%T) $k aceptado en ${dt}s (rápidos seguidos: $fast)"; }; done
  if [ $fast -ge 2 ]; then K=3; else K=1; fi
  [ -f vlog/tfbcola/STOP2 ] && { [ ${#PID[@]} -eq 0 ] && { echo "$(date +%T) STOP2"; exit 0; }; sleep 60; continue; }
  P=$(pend); [ -z "$P" ] && [ ${#PID[@]} -eq 0 ] && { echo "$(date +%T) sin pendientes"; exit 0; }
  while read -r S id; do
    [ -z "$id" ] && continue; [ ${#PID[@]} -ge $K ] && break; [ -n "${PID["$S $id"]}" ] && continue
    node scripts/agnes_vlog.mjs D:/Proyectos/video2-wt/tfbcola/vlog/tfbcola/$S.json clips $id >> out/goteo2_$S.log 2>&1 &
    PID["$S $id"]=$!; T0["$S $id"]=$(date +%s); echo "$(date +%T) lanzo $S $id (K=$K)"
  done <<< "$P"
  sleep 60
done
