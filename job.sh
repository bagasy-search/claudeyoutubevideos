#!/bin/bash
# clips reales de ck11a: corta los tramos elegidos (y_cut.json) de los tars de candidatos → y/y<id>.mp4 1920x1080 30 fps CON su audio
set -e
mkdir -p c y
[ -f tars.txt ] && for t in $(cat tars.txt); do get "$t"; tar xf "$t" -C c; done
if [ -f run.txt ]; then mkdir -p hq; gh run download $(cat run.txt) -R $R -D hq || true; find hq -name "*.mp4" ! -name "_*" -exec mv {} c/ \; ; fi
[ -f px.json ] && python3 -c "
import json,urllib.request
for k,v in json.load(open('px.json')).items(): open('c/'+k+'.mp4','wb').write(urllib.request.urlopen(urllib.request.Request(v['hd'],headers={'User-Agent':'Mozilla/5.0'}),timeout=300).read())
"
python3 - <<'PY'
import json,subprocess,os,webrtcvad
VAD=webrtcvad.Vad(2)
cut=json.load(open('y_cut.json')); res={}
for c in cut:
    segs=c['segs']; n=len(segs); ins=[]; fc=''
    for i,s in enumerate(segs):
        ins+=['-ss',str(s['a']),'-t',str(s['l']+0.05),'-i','c/'+s['vid']+'.mp4']
        has_a=subprocess.run(['ffprobe','-v','error','-select_streams','a','-show_entries','stream=index','-of','csv=p=0','c/'+s['vid']+'.mp4'],capture_output=True,text=True).stdout.strip()!=''
        if has_a and not s.get('mute'):
            pa=subprocess.run(['ffmpeg','-v','error','-ss',str(s['a']),'-t',str(s['l']),'-i','c/'+s['vid']+'.mp4','-vn','-ac','1','-ar','16000','-f','s16le','-'],capture_output=True).stdout
            fr=[pa[k:k+960] for k in range(0,len(pa)-960,960)]
            vz=sum(VAD.is_speech(x,16000) for x in fr)/max(1,len(fr))
            if vz>0.3: s['mute']=True; print('voz',c['id'],s['vid'],round(vz,2))
        fc+=f"[{i}:v]trim=duration={s['l']},setpts=PTS-STARTPTS,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1[v{i}];"
        if has_a and not s.get('mute'): fc+=f"[{i}:a]atrim=duration={s['l']},asetpts=PTS-STARTPTS,aresample=48000,aformat=channel_layouts=stereo,afade=t=in:d=0.06,afade=t=out:st={max(0,s['l']-0.08)}:d=0.08[a{i}];"
        else: fc+=f"anullsrc=r=48000:cl=stereo,atrim=duration={s['l']}[a{i}];"
    fc+=''.join(f'[v{i}][a{i}]' for i in range(n))+f'concat=n={n}:v=1:a=1[o][oa]'
    out=f"y/y{c['id']}.mp4"
    r=subprocess.run(['ffmpeg','-v','error','-y',*ins,'-filter_complex',fc,'-map','[o]','-map','[oa]','-c:v','libx264','-crf','19','-preset','medium','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k',out],capture_output=True,text=True)
    if r.returncode: print('X',c['id'],r.stderr[-300:]); continue
    d=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',out],capture_output=True,text=True).stdout)
    res[c['id']]={'file':f"y{c['id']}.mp4",'dur':round(d,2)}
json.dump(res,open('out/y_hechos.json','w')); print('cortados',len(res),'de',len(cut))
PY
tar cf y_${S}.tar y && put y_${S}.tar out/y_hechos.json
