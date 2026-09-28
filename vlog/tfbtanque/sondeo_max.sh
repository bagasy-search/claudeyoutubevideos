#!/bin/bash
# sube el tope de clips en vuelo a 3 cuando agnes acepta varios seguidos, lo baja a 1 ante el límite de cuenta
cd D:/Proyectos/video2-wt/tfbtanque; mkdir -p D:/rtmp/agnes_slots
while ! grep -q COLA2_FIN out/logs/cola2.log 2>/dev/null; do
  last=$(cat out/logs/cola_S*.log out/logs/cola2_*.log 2>/dev/null | grep -a "en cola\|límite de cuenta" | sort | tail -n 3)
  if [ -n "$last" ] && ! echo "$last" | grep -q "límite" && [ $(echo "$last" | wc -l) -ge 3 ]; then echo 3 > D:/rtmp/agnes_slots/_max_tope; else echo 1 > D:/rtmp/agnes_slots/_max_tope; fi
  sleep 300
done
