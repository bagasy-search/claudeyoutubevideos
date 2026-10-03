cd D:/Proyectos/video2-wt/tdcrola
for f in vlog/tdcrola/plan_*.json; do p=$(basename $f .json); [ -f out/vlog/${p#plan_}/clips/state.json ] || continue; echo "== $p"; node scripts/agnes_vlog.mjs $f check --recheck > vlog/tdcrola/check_${p#plan_}.log 2>&1; tail -n 3 vlog/tdcrola/check_${p#plan_}.log; done
echo CHECK_TERMINADO
