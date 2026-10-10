#!/bin/bash
# Corre net_fix.sh en serie para varios slugs ya entregados y libera su media al terminar cada uno. uso: bash net_fix_chain.sh s1 s2 ...
cd D:/Proyectos/video2-wt/lnet46
for s in "$@"; do
  bash vlog/loretta/net_fix.sh $s >> out/fix_$s.log 2>&1 && echo "$(date -u +%T) $s REFIX OK" || echo "$(date -u +%T) $s REFIX FALLÓ"
  rm -rf public/broll/$s public/broll/${s}_st public/avatar_clips/$s public/$s.wav public/${s}_fish.wav out/${s}_mix.wav D:/rtmp/lnet46/fix_$s assets-$s.tar
done
