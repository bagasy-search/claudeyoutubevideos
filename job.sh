# diagnóstico: desfase del audio del reel vs reel.wav por bloques de 4 s, búsqueda ±12 s, en envolvente
set -e
get "${S}_reel.wav"; get "${S}_reel_raw.mp4"
ffprobe -v error -show_entries format=duration:stream=codec_type,duration,nb_frames,r_frame_rate -of csv=p=0 ${S}_reel_raw.mp4 | tee out/probe.txt
python3 - <<'PY' | tee out/lagmap.txt
import json,subprocess,os,numpy as np
S=os.environ['S']
def pcm(p): return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',p,'-ac','1','-ar','8000','-f','f32le','-'],capture_output=True).stdout,np.float32)
a=pcm(f'{S}_reel_raw.mp4'); b=pcm(f'{S}_reel.wav'); print('mp4 %.2f wav %.2f'%(len(a)/8000,len(b)/8000))
print('rms mp4/wav', float(np.sqrt((a**2).mean())), float(np.sqrt((b**2).mean())))
for t in range(0,int(len(b)/8000)-4,4):
    o=t*8000; n=4*8000; ref=b[o:o+n]
    if np.linalg.norm(ref)<1e-3: print(t,'silencio'); continue
    best=(0,-1)
    for lag in range(-96000,96001,40):
        s=o+lag
        if s<0 or s+n>len(a): continue
        x=a[s:s+n]; c=float(np.dot(x,ref)/(np.linalg.norm(x)*np.linalg.norm(ref)+1e-9))
        if c>best[1]: best=(lag/8000,c)
    print(t,'%.3f'%best[0],'%.2f'%best[1])
PY
python3 - <<'PY' | tee out/win.txt
import json
for j in json.load(open('avatar_jobs.json')): print(j['out'], j['offset_s'], j['seconds'], j['timeline_start_s'])
PY
put out/lagmap.txt out/probe.txt out/win.txt
