#!/bin/bash
# lanza `clips` de una escena en segundo plano (semáforo compartido de mis procesos: 10 en vuelo)
cd D:/Proyectos/video2-wt/tfbpiso
export VLOG_SLOTS_DIR=D:/Proyectos/video2-wt/tfbpiso/vlog/tfbpiso/_slots VLOG_MAX=${VLOG_MAX:-10}
s=$1; shift
nohup node scripts/agnes_vlog.mjs vlog/tfbpiso/plan_$s.json clips "$@" >> vlog/tfbpiso/clips_$s.log 2>&1 &
echo "lanzado $s pid $!"
