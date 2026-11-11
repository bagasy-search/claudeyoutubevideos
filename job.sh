#!/bin/bash
set -e; S=$(cat slug.txt); R=$GITHUB_REPOSITORY
mkdir -p c y; gh release download ycand-$S -R $R -p "*.mp4" -D c
python3 - <<'PY'
import json,subprocess
for c in json.load(open('cortes.json')):
    src='c/'+c['vid']+'.mp4'; segs=c['segs']; n=len(segs)
    fc=''.join(f"[0:v]trim=start={a}:duration={l},setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1[v{i}];" for i,(a,l) in enumerate(segs))
    fc+=''.join(f'[v{i}]' for i in range(n))+f'concat=n={n}:v=1:a=0[o]'
    subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-filter_complex',fc,'-map','[o]','-an','-c:v','libx264','-crf','19','-preset','medium','-pix_fmt','yuv420p',f"y/y{c['id']}.mp4"],check=True)
print('cortados',len(json.load(open('cortes.json'))))
PY
tar cf y_$S.tar y && gh release upload ycand-$S y_$S.tar -R $R --clobber
