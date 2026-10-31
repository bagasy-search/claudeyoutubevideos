#!/bin/bash
# cuadro por cuadro: 888.3-888.9 s y 1189.8-1198.2 s
S=$1; f=$S.mp4
ffmpeg -v error -ss 888.2 -i $f -t 0.8 -vf "scale=480:-1,drawtext=text='%{pts\:flt}':x=w-tw-8:y=h-th-8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black:expansion=normal,tile=4x6" -copyts -fps_mode passthrough -q:v 3 ojo_${S}_fa%02d.jpg
ffmpeg -v error -ss 1189.8 -i $f -t 8.4 -vf "scale=384:-1,drawtext=text='%{pts\:flt}':x=w-tw-6:y=h-th-6:fontsize=18:fontcolor=yellow:box=1:boxcolor=black,tile=5x6" -copyts -fps_mode passthrough -q:v 4 ojo_${S}_fb%02d.jpg
python3 lageos.py $S $f > ojo_${S}_lag.json
