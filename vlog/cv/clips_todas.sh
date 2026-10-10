#!/bin/bash
# clips + check + armar por escena (3 escenas a la vez; cada una manda sus clips en paralelo por agnes_pool).
#   SLUG=x bash vlog/cv/clips_todas.sh S01 S02 ...   → log por escena en vlog/<slug>/<S>/run.log
R=D:/Proyectos/video2-wt/${WT:-$SLUG}; cd $R
uno() { P=vlog/$SLUG/$1/plan.json; L=vlog/$SLUG/$1/run.log
  node scripts/agnes_vlog.mjs $P clips > $L 2>&1 && node scripts/agnes_vlog.mjs $P check >> $L 2>&1; node scripts/agnes_vlog.mjs $P armar >> $L 2>&1
  echo "$(date -u +%T) $1 fin: $(grep -E 'MEDIDO|⛔' $L | tail -2 | tr '\n' ' ')"; }
export -f uno; export SLUG R
printf "%s\n" "$@" | xargs -P 3 -I{} bash -c 'uno {}'
echo "TODAS FIN"
