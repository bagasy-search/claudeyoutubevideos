#!/bin/bash
# espera (≤590 s) a que haya más de N eventos de clips agnes (en cola/OK/FAIL) y muestra los últimos
N=$1; cd D:/Proyectos/video2-wt/lordeviled
c() { grep -hcE 'en cola|OK (m|d_|c_)|FAIL|REJECT|GAVE|TIMEOUT' vlog/lordeviled/M1/clips.log vlog/lordeviled/PIES/run.log | awk '{s+=$1} END{print s}'; }
timeout 590 bash -c "until [ \$(grep -hcE 'en cola|OK (m|d_|c_)|FAIL|REJECT|GAVE|TIMEOUT' vlog/lordeviled/M1/clips.log vlog/lordeviled/PIES/run.log | awk '{s+=\$1} END{print s}') -gt $N ]; do sleep 30; done"
echo "eventos: $(c)"; grep -hE 'en cola|OK (m|d_|c_)|FAIL|REJECT|GAVE|TIMEOUT' vlog/lordeviled/M1/clips.log vlog/lordeviled/PIES/run.log | tail -3; date -u +%H:%M
