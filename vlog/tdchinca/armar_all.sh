cd D:/Proyectos/video2-wt/tdchinca
for p in "$@"; do echo "== $p"; node scripts/agnes_vlog.mjs vlog/tdchinca/plan_$p.json armar > vlog/tdchinca/armar_$p.log 2>&1; tail -n 2 vlog/tdchinca/armar_$p.log | cut -c1-200; done
echo ARMAR_TERMINADO
