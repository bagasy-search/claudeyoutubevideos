#!/bin/bash
# Orquestador de assets red Loretta 4-6: lanza net_assets.sh de cada slug cuando su voz+director está listo (máx 4 a la vez).
cd D:/Proyectos/video2-wt/lnet46
L="ckgreenbean cloven fhfrost focasse foslow fopot clpillow cltowels fhfruitfly fhmice suchurch suwidow sunight ck3dollar ck30min"
while true; do
  act=$(for s in $L; do [ -f out/assets_$s.log ] && ! grep -q "ASSETS LISTOS" out/assets_$s.log && echo $s; done | wc -l)
  for s in $L; do
    [ $act -ge 4 ] && break
    if grep -q "VOZ+DIRECTOR LISTOS" out/voice_$s.log 2>/dev/null && [ ! -f out/assets_$s.log ]; then
      echo "$(date -u +%T) lanzo assets $s"; node vlog/loretta/bg.mjs out/assets_$s.log bash vlog/loretta/net_assets.sh $s; act=$((act+1))
    fi
  done
  n=$(for s in $L; do grep -q "ASSETS LISTOS" out/assets_$s.log 2>/dev/null && echo $s; done | wc -l); [ $n = 15 ] && { echo TODOS; exit 0; }
  sleep 60
done
