cd D:/Proyectos/video2-wt/tdcrola
for p in "$@"; do echo "== $p"; node scripts/agnes_vlog.mjs vlog/tdcrola/plan_$p.json armar > vlog/tdcrola/armar_$p.log 2>&1; tail -n 2 vlog/tdcrola/armar_$p.log | cut -c1-200; done
echo ARMAR_TERMINADO
