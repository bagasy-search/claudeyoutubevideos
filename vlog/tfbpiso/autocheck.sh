#!/bin/bash
# corre `check` (ASR local) de cada escena apenas tiene todos sus clips; termina cuando todas están chequeadas
cd D:/Proyectos/video2-wt/tfbpiso
declare -A done
while true; do
  pend=0
  while read s a an c cc; do
    h=${cc%/*}; t=${cc#*/}
    if [ "$h" = "$t" ]; then
      m=$(stat -c %Y vlog/tfbpiso/$s/clips/state*.json | sort -n | tail -1)
      if [ "${done[$s]}" != "$m" ]; then CHECK_ASR=local node scripts/agnes_vlog.mjs vlog/tfbpiso/plan_$s.json check > vlog/tfbpiso/check_$s.log 2>&1; done[$s]=$m; echo "chequeado $s"; fi
    else pend=1; fi
  done < <(vlog/tfbpiso/estado.sh)
  [ $pend = 0 ] && break
  sleep 120
done
