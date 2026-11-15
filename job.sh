#!/bin/bash
# reel: corta de la voz las ventanas visibles del avatar -> <slug>_reel.wav (16 kHz mono, para RunPod) + mp3 de los primeros 25 s (ASR)
set -e; S=$(cat slug.txt); R=$GITHUB_REPOSITORY
gh release download aud-$S -R $R -p "${S}_voz.wav"
python3 - <<PY
import json,subprocess
J=json.load(open('avatar_jobs.json')); parts=[]
for i,j in enumerate(J):
    a=j['timeline_start_s']; b=a+j['seconds']; parts.append(f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS[a{i}]")
fc=';'.join(parts)+';'+''.join(f'[a{i}]' for i in range(len(J)))+f'concat=n={len(J)}:v=0:a=1[o]'
open('fc.txt','w').write(fc)
subprocess.run(['ffmpeg','-v','error','-y','-i','${S}_voz.wav','-filter_complex_script','fc.txt','-map','[o]','-ar','16000','-ac','1','${S}_reel.wav'],check=True)
PY
echo "reel: $(ffprobe -v error -show_entries format=duration -of csv=p=0 ${S}_reel.wav) s"
ffmpeg -v error -y -t 25 -i ${S}_reel.wav -b:a 48k ${S}_reel25.mp3
gh release upload aud-$S ${S}_reel.wav ${S}_reel25.mp3 -R $R --clobber
