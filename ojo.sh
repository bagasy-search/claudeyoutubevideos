#!/bin/bash
# ojo.sh <slug>: planilla cada 10 s (3x3, 640 px) + hoja de cortes de escena + lageos (cuadro repetido en medio de movimiento) + costuras
S=$1; f=$S.mp4
ffmpeg -v error -i $f -vf "select=not(mod(n\,300)),scale=640:-1,drawtext=text='%{pts\:hms}':x=w-tw-10:y=h-th-10:fontsize=26:fontcolor=yellow:box=1:boxcolor=black,tile=3x3" -fps_mode vfr -q:v 3 ojo_${S}_p%02d.jpg
ffmpeg -v error -i $f -vf "select='gt(scene,0.22)',scale=480:-1,drawtext=text='%{pts\:hms}':x=w-tw-10:y=h-th-10:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x4" -fps_mode vfr -q:v 4 ojo_${S}_c%02d.jpg
python3 lageos.py $S $f > ojo_${S}_lag.json
