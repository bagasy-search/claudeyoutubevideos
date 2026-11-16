# yfinpx: como yfin pero la fuente es Pexels (CDN directo, sin proxy).
# yfin: clips REALES finales. Por cada plano aprobado (yfin.json) baja por PROXY (enmascarado) el tramo de 6 s CON audio,
# reencuadra a 1920x1080 con empuje lento, gradúa (contraste/temperatura/grano), 30 fps, SIN audio → y/y<sid>.mp4;
# el audio del mismo tramo → bed/b<sid>.wav (48 kHz mono) y se marca si tiene VOZ (faster-whisper tiny.en en la nube).
# Sube yfin_<slug>.tar (y/ + bed/) + yfin_res.json.
set -e; TANDA=$(cat TANDA 2>/dev/null || true)
pip install -q -U yt-dlp faster-whisper numpy pillow >/dev/null 2>&1
mkdir -p raw y bed
python3 - <<'PY'
import os,json,subprocess,re,concurrent.futures as cf
J=json.load(open('yfin.json')); print('planos',len(J),flush=True)
VF=("fps=30,scale=2400:1350:force_original_aspect_ratio=increase,crop=2400:1350,"
    "zoompan=z='1.0+0.0009*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1080:fps=30,"
    "eq=contrast=1.05:saturation=0.9:gamma=0.98,colorbalance=rs=0.025:gs=0.0:bs=-0.03,format=yuv420p")
import threading; LK={}
def bajar(g):
    f=f"raw/{g['vid']}.mp4"
    LK.setdefault(g['vid'],threading.Lock())
    with LK[g['vid']]:
        for a in range(3):
            if os.path.exists(f) and os.path.getsize(f)>10000: return f
            subprocess.run(['curl','-sfL','--retry','3','-A','Mozilla/5.0','-o',f,g['url']],timeout=300)
    return f if os.path.exists(f) and os.path.getsize(f)>10000 else None
def one(n,g):
    sid=g['sid']; src=bajar(g)
    if not src: return sid,None
    d=g['dur']; t=g['t']
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',src,'-t',str(d),'-vf',VF,'-an','-c:v','libx264','-crf','18','-preset','medium',f'y/y{sid}.mp4'])
    au=subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',src,'-t',str(d),'-vn','-ac','1','-ar','48000',f'bed/b{sid}.wav'],capture_output=True)
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
# hoja de verificación (y_verify): 4 cuadros del clip FINAL (8/36/64/92 %) en 2x2 de 960x540 → vs/v<sid>.jpg
os.makedirs('vs',exist_ok=True)
from PIL import Image
for sid,v in res.items():
    im=Image.new('RGB',(1920,1080),'black')
    for j,p in enumerate((0.08,0.36,0.64,0.92)):
        fr=f'vs/_{sid}_{j}.jpg'
        subprocess.run(['ffmpeg','-v','error','-y','-ss',f"{v['dur']*p:.2f}",'-i',f'y/y{sid}.mp4','-frames:v','1','-vf','scale=960:540',fr])
        if os.path.exists(fr): im.paste(Image.open(fr),((j%2)*960,(j//2)*540)); os.remove(fr)
    im.save(f'vs/v{sid}.jpg',quality=82)
T=open('TANDA').read().strip() if os.path.exists('TANDA') else ''
json.dump(res,open(f'out/yfin_res{T}.json','w'),indent=0)
print('con voz',sum(1 for v in res.values() if v.get('voz')),'limpios',sum(1 for v in res.values() if v.get('voz') is False),flush=True)
PY
tar -cf out/yfin_${S}${TANDA}.tar y bed vs
put out/yfin_${S}${TANDA}.tar out/yfin_res${TANDA}.json
