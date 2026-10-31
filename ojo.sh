#!/bin/bash
# cuadro por cuadro: 888.2-889.0 s y 1189.8-1198.2 s
S=$1; f=$S.mp4
ffmpeg -v error -i $f -vf "select='between(t\,888.2\,889.0)',scale=480:-1,drawtext=text='%{pts\:hms}':x=w-tw-8:y=h-th-8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x6" -fps_mode vfr -q:v 3 ojo_${S}_fa%02d.jpg
ffmpeg -v error -i $f -vf "select='between(t\,1189.8\,1198.2)',scale=384:-1,drawtext=text='%{pts\:hms}':x=w-tw-6:y=h-th-6:fontsize=18:fontcolor=yellow:box=1:boxcolor=black,tile=5x6" -fps_mode vfr -q:v 4 ojo_${S}_fb%02d.jpg
ls ojo_*
python3 lageos.py $S $f > ojo_${S}_lag.json
