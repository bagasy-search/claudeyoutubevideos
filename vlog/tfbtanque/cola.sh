#!/bin/bash
# cola de clips: de a 3 escenas a la vez (cola de agnes compartida entre 6 agentes)
cd D:/Proyectos/video2-wt/tfbtanque
run() { node scripts/agnes_vlog.mjs vlog/tfbtanque/plans/$1.json clips $2 > out/logs/cola_$1.log 2>&1; }
run S0 & (node scripts/agnes_vlog.mjs vlog/tfbtanque/plans/S2.json clips S2_03 > out/logs/cola_S2.log 2>&1) & run S5 & wait
(node scripts/agnes_vlog.mjs vlog/tfbtanque/plans/S4.json clips S4_06 S4_07 > out/logs/cola_S4.log 2>&1; node scripts/agnes_vlog.mjs vlog/tfbtanque/plans/S10.json clips S10_05 S10_06 > out/logs/cola_S10.log 2>&1) &
run S6 & run S6b & run S7 & run S11 & wait
run S7B & run S8 & run S9 & wait
run S11B & run S13 & wait
echo COLA_FIN
