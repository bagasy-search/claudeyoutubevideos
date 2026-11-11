# veo en la nube: barras (cropdetect) → 1920x1080 30 fps con audio, duraciones, hojas de contacto, audio de camas para ASR
import subprocess,glob,os,re,json,io
from PIL import Image, ImageDraw
os.makedirs('v',exist_ok=True); os.makedirs('out',exist_ok=True)
dur={};crop=0
for raw in sorted(glob.glob('raw/v*.mp4')):
    n=os.path.basename(raw); f='v/'+n
    r=subprocess.run(['ffmpeg','-hide_banner','-ss','1','-i',raw,'-t','3','-vf','cropdetect=24:2:0','-f','null','-'],capture_output=True,text=True).stderr
    m=re.findall(r'crop=(\d+):(\d+):(\d+):(\d+)',r); vf='scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1'
    pr=subprocess.run(['ffprobe','-v','error','-select_streams','v','-show_entries','stream=width,height','-of','csv=p=0',raw],capture_output=True,text=True).stdout.strip().split(',')
    if m and len(pr)>=2:
        w,h,x,y=map(int,m[-1]); W0,H0=int(pr[0]),int(pr[1])
        if (w<W0-8 or h<H0-8) and w>W0*0.6 and h>H0*0.6: vf=f'crop={w}:{h}:{x}:{y},'+vf; crop+=1
    subprocess.run(['ffmpeg','-v','error','-y','-i',raw,'-vf',vf,'-c:v','libx264','-crf','18','-preset','veryfast','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k',f],check=True)
    dur[n]=float(subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.strip() or 0)
json.dump(dur,open('out/veo_dur.json','w'),indent=1)
print('procesados',len(dur),'con barras',crop)
L=sorted(glob.glob('v/v*.mp4'))
for k in range(0,len(L),15):
    S=Image.new('RGB',(3*3*256,5*144),'black'); d=ImageDraw.Draw(S)
    for i,f in enumerate(L[k:k+15]):
        for j,t in enumerate([0.3,3.5,7.0]):
            p=subprocess.run(['ffmpeg','-v','error','-ss',str(t),'-i',f,'-frames:v','1','-vf','scale=256:144','-f','image2pipe','-vcodec','png','-'],capture_output=True).stdout
            if p: S.paste(Image.open(io.BytesIO(p)).convert('RGB'),((i%3)*768+j*256,(i//3)*144))
        d.rectangle([(i%3)*768,(i//3)*144,(i%3)*768+46,(i//3)*144+13],fill='black'); d.text(((i%3)*768+2,(i//3)*144+1),os.path.basename(f)[:-4],fill='yellow')
    S.save(f'out/veo_hoja{k//15}.jpg',quality=78)
# audio de todos los clips, 1,5 s de silencio entre medio → un mp3 para el ASR (lo corre la PC: sólo red)
acc=0;mapa=[];lst=[]
subprocess.run(['ffmpeg','-v','error','-y','-f','lavfi','-i','anullsrc=r=16000:cl=mono','-t','1.5','sil.wav'])
for f in L:
    m=f.replace('.mp4','_m.wav'); subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-vn','-ac','1','-ar','16000',m])
    if not os.path.exists(m): continue
    d=dur[os.path.basename(f)]; mapa.append({'v':os.path.basename(f),'at':acc,'d':d}); acc+=d+1.5; lst+= [f"file '{os.path.abspath(m)}'",f"file '{os.path.abspath('sil.wav')}'"]
open('cat.txt','w').write('\n'.join(lst))
subprocess.run(['ffmpeg','-v','error','-y','-f','concat','-safe','0','-i','cat.txt','-c:a','libmp3lame','-b:a','64k','out/veo_audio.mp3'],check=True)
json.dump(mapa,open('out/veo_audio_map.json','w'),indent=1)
subprocess.run(['tar','cf','out/veo_proc.tar','v'],check=True)
