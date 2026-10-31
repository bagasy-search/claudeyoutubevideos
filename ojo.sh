#!/bin/bash
S=$1; f=$S.mp4
ffmpeg -v error -i $f -vf "select='between(t\,435.4\,441.4)',scale=384:-1,drawtext=text='%{pts\:hms}':x=w-tw-6:y=h-th-6:fontsize=18:fontcolor=yellow:box=1:boxcolor=black,tile=5x6" -fps_mode vfr -q:v 4 ojo_${S}_fd%02d.jpg
ls ojo_*
python3 lageos.py $S $f > ojo_${S}_lag.json
