# reel de RunPod (URL en reel_url.txt) → ventanas win-NNN.mp4 1920x1080 30 fps (duplicado simple), con el desfase medido por ventana
# contra boone01_reel.wav. Sube a_boone01.tar + av_lag.json + los primeros 25 s en mp3 (para verificar por ASR que el audio es el propio) + hoja.
set -e
get "${S}_reel.wav"
curl -sfL --max-time 900 -o reel.mp4 "$(cat reel_url.txt)"
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate -of csv=p=0 reel.mp4
mkdir -p a fr
python3 - <<'PY'
import json,subprocess,os,numpy as np
S=os.environ['S']; jobs=json.load(open('avatar_jobs.json'))
def pcm(p): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','8000','-f','f32le','-'],capture_output=True).stdout,np.float32)
a=pcm('reel.mp4'); b=pcm(f'{S}_reel.wav'); print('reel mp4 %.2f s · reel wav %.2f s'%(len(a)/8000,len(b)/8000))
assert len(a)/8000 > len(b)/8000-1.0, 'el reel volvió CORTO'
lags=[]
for j in jobs:
    o=int(j['offset_s']*8000); n=int(min(j['seconds'],6)*8000); ref=b[o:o+n]; best=(0,-1)
    for lag in range(-3200,3201,40):
        s=o+lag
        if s<0 or s+n>len(a): continue
        x=a[s:s+n]; c=float(np.dot(x,ref)/(np.linalg.norm(x)*np.linalg.norm(ref)+1e-9))
        if c>best[1]: best=(lag/8000,c)
    lags.append(best)
# suavizado: mediana móvil de 5 ventanas, y sólo se confía en corr>=0,35
L=[l if c>=0.35 else None for l,c in lags]
sm=[]
for i in range(len(L)):
    v=[x for x in L[max(0,i-2):i+3] if x is not None]; sm.append(float(np.median(v)) if v else 0.0)
if os.path.exists('lag_fijo.json'):
    for k,v in json.load(open('lag_fijo.json')).items(): sm[int(k)-1]=v
print('desfase crudo:',' '.join('%.3f'%l for l,_ in lags)); print('corr:',' '.join('%.2f'%c for _,c in lags)); print('usado:',' '.join('%.3f'%l for l in sm))
for j,lag in zip(jobs,sm):
    ss=max(0,j['offset_s']+lag); n=round((j['timeline_start_s']+j['seconds'])*30)-round(j['timeline_start_s']*30)+1
    subprocess.run(['ffmpeg','-v','error','-y','-ss','%.3f'%ss,'-i','reel.mp4','-an','-vf','fps=30,scale=1920:1080:flags=lanczos,setsar=1','-frames:v',str(n),'-c:v','libx264','-crf','17','-preset','veryfast','-pix_fmt','yuv420p',f"a/{j['out']}"],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-ss','1','-i',f"a/{j['out']}",'-frames:v','1','-vf','scale=240:135',f"fr/{j['win']:03d}.jpg"])
json.dump([{'win':j['win'],'lag':l,'crudo':r[0],'c':r[1]} for j,l,r in zip(jobs,sm,lags)],open('out/av_lag.json','w'))
PY
ffmpeg -v error -y -pattern_type glob -i 'fr/*.jpg' -vf "tile=8x6" -q:v 4 out/av_hoja.jpg
ffmpeg -v error -y -t 25 -i reel.mp4 -vn -ar 16000 -ac 1 -b:a 48k out/reel_25s.mp3
tar -cf out/a_${S}.tar a
put out/a_${S}.tar out/av_lag.json out/av_hoja.jpg out/reel_25s.mp3
