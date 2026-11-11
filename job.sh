# avcut: reel en mano (RunPod + enmano) -> ventanas a/win-NNN.mp4 (1920x1080, 30 fps, sin audio) con desfase medido
# contra <S>_reel.wav, + av_still.png (cuadro de 1 s de la ventana 1) -> avcut_<S>.tar
set -e; pip install -q numpy >/dev/null 2>&1
get "${S}_reel_enmano.mp4" "${S}_reel.wav" avatar_jobs.json
mkdir -p a
python3 - <<'PY'
import json,subprocess,os,numpy as np
S=os.environ['S']; REEL=f'{S}_reel_enmano.mp4'; jobs=json.load(open('avatar_jobs.json'))
def pcm(p): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','1000','-f','f32le','-'],capture_output=True).stdout,np.float32)
a=pcm(REEL); b=pcm(f'{S}_reel.wav'); RAT=len(a)/len(b); print('reel mp4 %.2f s · wav %.2f s · ratio %.6f'%(len(a)/1000,len(b)/1000,RAT),flush=True)
res=[]
for j in jobs:
    o=int(j['offset_s']*1000); n=int(max(3,min(j['seconds'],6))*1000); ref=b[o:o+n]; best=(0.0,-1.0); oa=o
    for lag in range(-500,501,1):
        s=oa+lag
        if s<0 or s+n>len(a): continue
        x=a[s:s+n]; c=float(np.dot(x,ref)/(np.linalg.norm(x)*np.linalg.norm(ref)+1e-9))
        if c>best[1]: best=(lag/1000,c)
    lag=best[0] if best[1]>0.4 else (j['offset_s']*RAT-j['offset_s'])
    ss=max(0,j['offset_s']+lag); nf=round((j['timeline_start_s']+j['seconds'])*30)-round(j['timeline_start_s']*30)+1
    subprocess.run(['ffmpeg','-v','error','-y','-ss','%.3f'%ss,'-i',REEL,'-an','-vf','fps=30,scale=1920:1080:flags=lanczos,setsar=1','-frames:v',str(nf),'-c:v','libx264','-crf','17','-preset','veryfast','-pix_fmt','yuv420p',f"a/{j['out']}"],check=True)
    got=int(subprocess.run(['ffprobe','-v','error','-count_frames','-select_streams','v:0','-show_entries','stream=nb_read_frames','-of','csv=p=0',f"a/{j['out']}"],capture_output=True,text=True).stdout.strip() or 0)
    res.append({'win':j['win'],'ss':round(ss,3),'lag':round(lag,3),'c':round(best[1],2),'frames':nf,'got':got}); print(res[-1],flush=True)
json.dump(res,open('out/av_lag.json','w'))
subprocess.run(['ffmpeg','-v','error','-y','-ss','1','-i','a/'+jobs[0]['out'],'-frames:v','1','out/av_still.png'],check=True)
print('cortas',sum(1 for r in res if r['got']<r['frames']-1),'baja corr',sum(1 for r in res if r['c']<0.5))
PY
tar -cf out/avcut_${S}.tar a
put out/avcut_${S}.tar out/av_lag.json out/av_still.png
