#!/bin/bash
# vigía: cuando agnes vuelve a aceptar (2 clips "en cola" en los últimos 30 min), frena lento.sh y pasa a 3 en vuelo
# (orden del creador: somos 6 agentes, máximo 3). Reintento de POST cada 2 min en modo rápido.
cd D:/Proyectos/video2-wt/tfbpiso
V=vlog/tfbpiso
while true; do
  now=$(date -u +%s)
  n=$(grep -h "en cola" $V/clips_*.log 2>/dev/null | awk -v now=$now '{split($1,a,":"); t=a[1]*3600+a[2]*60+a[3]; d=(now%86400)-t; if(d<0)d+=86400; if(d<1800) c++} END{print c+0}')
  if [ "$n" -ge 2 ]; then echo "$(date -u +%T) agnes acepta ($n en cola en 30 min) → modo 3 en vuelo"; break; fi
  sleep 300
done
touch $V/STOP
while pgrep -f lento.sh >/dev/null 2>&1 || powershell -NoProfile -Command "if (Get-CimInstance Win32_Process -Filter \"Name='bash.exe'\" | Where-Object { \$_.CommandLine -match 'lento.sh' }) { exit 0 } else { exit 1 }"; do sleep 60; done
rm -f $V/STOP
export VLOG_SLOTS_DIR=D:/Proyectos/video2-wt/tfbpiso/vlog/tfbpiso/_slots VLOG_MAX=3 VLOG_RETRY_MS=120000
for s in S1 S2 S3 S3B S4 S6 S7 S8 S9 S9B S10; do
  ids=$(node -e "const fs=require('fs'),p=require('./$V/plan_$s.json');const st={};for(const f of ['state.json','state_det.json']){const q=p.dir+'/clips/'+f;if(fs.existsSync(q))Object.assign(st,JSON.parse(fs.readFileSync(q)))}const reg={S1:['s1_01','s1_03'],S9B:['s9b_02']}['$s']||[];const h=JSON.parse(fs.existsSync(p.dir+'/clips/check_hist.json')?fs.readFileSync(p.dir+'/clips/check_hist.json'):'{}');console.log([...p.clips.filter(c=>!st[c.id]).map(c=>c.id),...reg.filter(r=>Object.keys(h[r]||{}).length<2)].join(' '))")
  [ -n "$ids" ] && { echo "$(date -u +%T) $s: $ids"; node scripts/agnes_vlog.mjs $V/plan_$s.json clips $ids >> $V/clips_$s.log 2>&1 & }
done
wait
echo "$(date -u +%T) modo rápido terminado"
