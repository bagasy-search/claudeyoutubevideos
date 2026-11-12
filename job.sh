#!/bin/bash
set -e; S=$(cat slug.txt); R=$GITHUB_REPOSITORY
mkdir -p c out/fr; gh release download ycand-$S -R $R -p "*.mp4" -D c
python3 - <<'PY'
import os,subprocess,json,re
res={}
for f in sorted(os.listdir('c')):
    p='c/'+f; v=f[:-4]
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',p],capture_output=True,text=True).stdout.strip() or 0)
    if d<2: continue
    for k,q in enumerate([0.1,0.37,0.63,0.9]):
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{d*q:.2f}','-i',p,'-frames:v','1','-vf','scale=640:-2','-q:v','4',f'out/fr/{v}_{k}.jpg'])
    e=subprocess.run(['ffmpeg','-hide_banner','-i',p,'-vf',"select='gt(scene,0.32)',showinfo",'-an','-f','null','-'],capture_output=True,text=True).stderr
    cuts=[round(float(m),2) for m in re.findall(r'pts_time:([0-9.]+)',e)]
    w=subprocess.run(['ffprobe','-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',p],capture_output=True,text=True).stdout.strip()
    res[v]={'d':round(d,2),'cuts':cuts,'wh':w}
json.dump(res,open('out/fr/escenas.json','w'))
print(len(res),'candidatos')
PY
cd out && tar czf ../fr_$S.tgz fr && cd .. && gh release upload ycand-$S fr_$S.tgz -R $R --clobber
