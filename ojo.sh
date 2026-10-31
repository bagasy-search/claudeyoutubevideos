#!/bin/bash
S=$1; f=$S.mp4
ffmpeg -v error -i $f -vf "select='between(t\,888.2\,889.0)',scale=480:-1,drawtext=text='%{pts\:hms}':x=w-tw-8:y=h-th-8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black,tile=4x6" -fps_mode vfr -q:v 3 ojo_${S}_fa%02d.jpg
ls ojo_*
python3 lageos.py $S $f > ojo_${S}_lag.json
