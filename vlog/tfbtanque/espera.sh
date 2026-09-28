#!/bin/bash
# espera hasta 580 s o hasta que entren 3 clips más / termine la cola; imprime el estado
cd D:/Proyectos/video2-wt/tfbtanque
a=$(python vlog/tfbtanque/estado.py | tail -1 | awk '{print $2}'); t0=$(date +%s)
while [ $(( $(date +%s) - t0 )) -lt 575 ]; do
  n=$(python vlog/tfbtanque/estado.py | tail -1 | awk '{print $2}')
  [ "$n" -ge $((a+3)) ] && break; grep -q COLA2_FIN out/logs/cola2.log 2>/dev/null && echo COLA2_FIN && break
  sleep 45
done
echo "$(date +%H:%M) clips $(python vlog/tfbtanque/estado.py | tail -1 | awk '{print $2}')/176 · tope $(cat D:/rtmp/agnes_slots/_max_tope 2>/dev/null) · $(tail -n1 out/logs/cola.log out/logs/cola2.log 2>/dev/null | tr '\n' ' ' | cut -c1-100)"
