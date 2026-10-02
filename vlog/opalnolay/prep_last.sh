#!/bin/bash
# último cuadro de cada clip (agnes v2.0 y stock) → <clip>_last.jpg (cola del plano ≤2,5 s, misma toma: nunca repetir el clip)
cd D:/Proyectos/video2-wt/opalnolay/public
n=0; for f in broll/opalnolay/*.mp4 broll/opalnolay_st/*.mp4; do j="${f%.mp4}_last.jpg"
  if [ ! -f "$j" ] || [ "$f" -nt "$j" ]; then ffmpeg -v error -y -sseof -0.25 -i "$f" -update 1 -q:v 3 "$j"; n=$((n+1)); fi; done
echo "_last.jpg generados: $n"
