cd D:/Proyectos/video2-wt/tdchinca
for f in vlog/tdchinca/plan_*.json; do p=$(basename $f .json); [ -f out/vlog/${p#plan_}/clips/state.json ] || continue; echo "== $p"; node scripts/agnes_vlog.mjs $f check --recheck > vlog/tdchinca/check_${p#plan_}.log 2>&1; tail -n 3 vlog/tdchinca/check_${p#plan_}.log; done
echo CHECK_TERMINADO
