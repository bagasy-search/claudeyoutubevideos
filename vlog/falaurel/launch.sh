# lanza los clips listos (anclas existentes) que no se lanzaron todavía. uso: bash launch.sh S1 S2 ...
cd /d/Proyectos/video2-wt/falaurel
for s in "$@"; do ids=""; for i in $(python vlog/falaurel/ready.py $s); do grep -qx "$i" vlog/falaurel/launched.txt || ids="$ids $i"; done
  if [ -n "$ids" ]; then echo "$s:$ids"; for i in $ids; do echo $i >> vlog/falaurel/launched.txt; done
    (VLOG_SLOTS_DIR=D:/rtmp/vlog_slots VLOG_MAX=12 nohup node scripts/agnes_vlog.mjs vlog/falaurel/plan_$s.json clips $ids >> vlog/falaurel/clips_$s.log 2>&1 &); fi; done
