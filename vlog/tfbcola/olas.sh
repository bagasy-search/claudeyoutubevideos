#!/bin/bash
# olas.sh — espera a que no quede ningún `agnes_vlog … clips` corriendo y lanza la ola siguiente (2-3 escenas por vez)
cd "$(dirname "$0")/../.."
corriendo() { powershell -NoProfile -Command "@(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { \$_.CommandLine -match 'tfbcola.*S[0-9]+[a-z]*\.json clips' }).Count"; }
for ola in "S9m S9b S10" "S10b S11 S12 S13"; do
  while [ "$(corriendo | tr -d '\r')" -gt 3 ]; do sleep 120; done
  echo "$(date +%T) lanzo $ola"; bash vlog/tfbcola/clips_escena.sh $ola > out/ola_${ola// /_}.log 2>&1 &
  sleep 300
done
wait; echo "$(date +%T) olas terminadas"
