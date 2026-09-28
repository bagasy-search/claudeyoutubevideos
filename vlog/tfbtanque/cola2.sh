#!/bin/bash
# cola 2 (runner con candados: 1 clip en vuelo por máquina, espera 10 min ante el límite de cuenta, retoma pendientes)
cd D:/Proyectos/video2-wt/tfbtanque
# esperar a que terminen los procesos viejos (no se pueden matar desde acá)
while [ "$(powershell -NoProfile -Command "(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { \$_.CommandLine -match 'tfbtanque/plans' -and \$_.CommandLine -match ' clips' }).Count")" != "0" ]; do sleep 120; done
echo "viejos terminados $(date)"
C() { node scripts/agnes_vlog.mjs vlog/tfbtanque/plans/$1.json clips "${@:2}" >> out/logs/cola2_$1.log 2>&1; }
for s in S0 S2 S4 S5 S6 S6b S7 S7B S8 S9 S10 S11 S11B S13; do C $s; done
C S1 S1_01; C S3 S3_04b S3_06b S3_12; C S4 S4_09; C S10 S10_01 S12_13a; C S12 S12_01 S12_06
echo COLA2_FIN
