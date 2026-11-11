# yfin: clips REALES finales. Por cada plano aprobado (yfin.json) baja por PROXY (enmascarado) el tramo de 6 s CON audio,
# reencuadra a 1920x1080 con empuje lento, gradúa (contraste/temperatura/grano), 30 fps, SIN audio → y/y<sid>.mp4;
# el audio del mismo tramo → bed/b<sid>.wav (48 kHz mono) y se marca si tiene VOZ (faster-whisper tiny.en en la nube).
# Sube yfin_<slug>.tar (y/ + bed/) + yfin_res.json.
set -e; TANDA=$(cat TANDA 2>/dev/null || true)
pip install -q -U yt-dlp faster-whisper numpy >/dev/null 2>&1
mkdir -p raw y bed
python3 - <<'PY'
import os,json,subprocess,re,concurrent.futures as cf
def norm(l):
    l=l.strip()
    if not l or l.startswith('#'): return None
    if '://' in l: return l
    p=l.split(':'); return f"http://{p[2]}:{p[3]}@{p[0]}:{p[1]}" if len(p)==4 else None
L=[norm(x) for x in os.environ.get('YTPX','').splitlines()]; L=[x for x in L if x]
for x in L:
    for part in re.split(r'[:/@]+',x):
        if len(part)>3 and part not in ('http','https'): print('::add-mask::'+part,flush=True)
GOOD=[i-1 for i in (1,4,5,6,7,8,9,10,11,12,13,14,16,17,18,19,20) if i<=len(L)]
J=json.load(open('yfin.json')); print('planos',len(J),flush=True)
VF=("fps=30,scale=2400:1350:force_original_aspect_ratio=increase,crop=2400:1350,"
    "zoompan=z='1.0+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,"
    "eq=contrast=1.05:saturation=0.9:gamma=0.98,colorbalance=rs=0.025:gs=0.0:bs=-0.03,noise=alls=3:allf=t,format=yuv420p")
def one(n,g):
    sid=g['sid']; base=f"raw/{sid}"
    for a in range(3):
        px=L[GOOD[(n+a*7)%len(GOOD)]]
        try:
            r=subprocess.run(['yt-dlp','--proxy',px,'--js-runtimes','node','--remote-components','ejs:github','--extractor-args','youtube:player_client=web_embedded',
                '-f','bestvideo[height<=1080][height>=360]+bestaudio/best[height<=1080]','--download-sections',f"*{g['t']}-{g['t']+6}",'--no-warnings','-q','--no-part',
                '--merge-output-format','mkv','-o',base+'.%(ext)s','https://www.youtube.com/watch?v='+g['vid']],capture_output=True,text=True,timeout=180)
        except Exception: continue
        fs=[f for f in os.listdir('raw') if f.startswith(f'{sid}.')]
        if r.returncode==0 and fs: break
    fs=[f for f in os.listdir('raw') if f.startswith(f'{sid}.')]
    if not fs: return sid,None
    src='raw/'+fs[0]; off=g.get('off',0.25); d=g['dur']
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(off),'-i',src,'-t',str(d),'-vf',VF,'-an','-c:v','libx264','-crf','18','-preset','medium',f'y/y{sid}.mp4'])
    au=subprocess.run(['ffmpeg','-v','error','-y','-ss',str(off),'-i',src,'-t',str(d),'-vn','-ac','1','-ar','48000',f'bed/b{sid}.wav'],capture_output=True)
    pr=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f'y/y{sid}.mp4'],capture_output=True,text=True).stdout.strip()
    return sid,{'dur':float(pr or 0),'bed':os.path.exists(f'bed/b{sid}.wav')}
res={}
with cf.ThreadPoolExecutor(8) as ex:
    for sid,v in ex.map(lambda a: one(*a), enumerate(J)):
        if v and v['dur']>0.8: res[str(sid)]=v
print('listos',len(res),'/',len(J),flush=True)
from faster_whisper import WhisperModel
m=WhisperModel('tiny.en',device='cpu',compute_type='int8')
for sid,v in res.items():
    f=f'bed/b{sid}.wav'
    if not v['bed']: v['voz']=None; continue
    lv=subprocess.run(['ffmpeg','-v','info','-i',f,'-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
    mm=re.search(r'mean_volume: (-?[\d.]+)',lv); v['mean_db']=float(mm.group(1)) if mm else None
    import wave,numpy as np
    try:
        w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)/32768.0
        a=a[::3] if w.getframerate()==48000 else a
        segs,_=m.transcribe(a,vad_filter=True,language='en')
    except Exception as e:
        print('whisper',sid,e,flush=True); v['voz']=None; continue
    txt=' '.join(s.text.strip() for s in segs if s.no_speech_prob<0.6).strip()
    v['voz']=len(re.findall(r'[A-Za-z]+',txt))>=2; v['txt']=txt[:80]
T=open('TANDA').read().strip() if os.path.exists('TANDA') else ''
json.dump(res,open(f'out/yfin_res{T}.json','w'),indent=0)
print('con voz',sum(1 for v in res.values() if v.get('voz')),'limpios',sum(1 for v in res.values() if v.get('voz') is False),flush=True)
PY
tar -cf out/yfin_${S}${TANDA}.tar y bed
put out/yfin_${S}${TANDA}.tar out/yfin_res${TANDA}.json
