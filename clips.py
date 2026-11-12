# clips.py <lista.json> : baja tramos con yt-dlp por proxies (secreto YTPX), los conforma a 1920x1080 30 fps, mide cortes y arma hojas
import json,os,sys,subprocess as sp,random,glob,re
import cv2, numpy as np
L=json.load(open(sys.argv[1])); S=os.environ['S']
PX=[p.strip() for p in re.split(r'[\s,]+',os.environ.get('YTPX','')) if p.strip()]
assert PX, 'sin proxies: no se baja nada'
random.seed(len(L))
os.makedirs('raw',exist_ok=True); os.makedirs('out/c',exist_ok=True)
FR=[0.08, 0.2, 0.32, 0.44, 0.56, 0.68, 0.8, 0.92]; WL=5.4
meta={}
def ytdlp(vid,secs,px):
  # video entero ≤720p con el descargador nativo (por el proxy); los tramos se cortan acá del archivo local
  a=['yt-dlp','-q','--no-warnings','--no-playlist','--proxy',px,'--js-runtimes','node','-f','bv*[height<=720][height>=480][ext=mp4]+ba[ext=m4a]/bv*[height<=720][height>=480]+ba/b[height>=480]','--merge-output-format','mkv','-o',f'raw/{vid}_full.%(ext)s','--socket-timeout','30','--retries','5','--http-chunk-size','10M', f'https://www.youtube.com/watch?v={vid}']
  r=sp.run(a,capture_output=True,text=True,timeout=900)
  full=glob.glob(f'raw/{vid}_full.*')
  full=[f for f in full if not f.endswith('.part')]
  if r.returncode==0 and full:
    for s in secs:
      sp.run(['ffmpeg','-v','error','-y','-ss','%.2f'%s,'-i',full[0],'-t',str(WL),'-map','0:v:0','-map','0:a:0?','-c:v','libx264','-crf','16','-preset','veryfast','-c:a','aac','-b:a','160k',f'raw/{vid}_{int(s)}.mkv'])
    for f in full: os.remove(f)
  for f in glob.glob(f'raw/{vid}_full.*'): os.remove(f)
  return r.returncode, (r.stderr or '')[-300:].replace(px,'<px>')
for it in L:
  vid,t,d=it['id'],it['tema'],it['d']
  secs=[max(3,d*f) for f in FR]
  ok=False
  for intento in range(4):
    px=random.choice(PX)
    try: rc,err=ytdlp(vid,secs,px)
    except Exception as e: rc,err=1,str(e)[:200]
    got=[g for g in glob.glob(f'raw/{vid}_*') if '_full' not in g]
    if got: ok=True; break
    print('fallo',vid,intento,err.strip().split('\n')[-1][:160],flush=True)
  print(vid,t,'tramos',len(glob.glob(f'raw/{vid}_*')),flush=True)
  for f in sorted(glob.glob(f'raw/{vid}_*')):
    st=int(re.search(r'_(\d+)\.',f).group(1)); o=f'out/c/{t}__{vid}__{st}.mp4'
    sp.run(['ffmpeg','-v','error','-y','-i',f,'-t',str(WL),'-vf','scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=30,setsar=1','-c:v','libx264','-crf','21','-preset','veryfast','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-ar','48000','-ac','2',o])
    os.remove(f)
    if not os.path.exists(o): continue
    cap=cv2.VideoCapture(o); prev=None; cuts=[]; i=0; mids=None; n=int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    while True:
      okf,fr=cap.read()
      if not okf: break
      sm=cv2.resize(fr,(64,36)); h=cv2.calcHist([cv2.cvtColor(sm,cv2.COLOR_BGR2HSV)],[0,1],None,[16,8],[0,180,0,256]); cv2.normalize(h,h)
      if prev is not None and cv2.compareHist(prev,h,cv2.HISTCMP_BHATTACHARYYA)>0.45: cuts.append(round(i/30,2))
      prev=h
      if i==n//2: mids=fr.copy()
      i+=1
    cap.release()
    meta[os.path.basename(o)]={'dur':round(i/30,2),'cuts':cuts}
    if mids is not None: cv2.imwrite(o.replace('.mp4','.jpg'),cv2.resize(mids,(384,216)),[cv2.IMWRITE_JPEG_QUALITY,80])
json.dump(meta,open(f'out/meta_{os.environ.get("SH","0")}.json','w'))
# hojas por tema: filas = videos, columnas = tramos, con etiqueta corta
temas=sorted(set(i['tema'] for i in L))
for t in temas:
  jp=sorted(glob.glob(f'out/c/{t}__*.jpg'))
  vids=sorted(set(os.path.basename(j).split('__')[1] for j in jp))
  if not vids: continue
  rows=[]
  for vi,v in enumerate(vids):
    cells=[]
    for st in sorted(glob.glob(f'out/c/{t}__{v}__*.jpg'),key=lambda x:int(x.rsplit('__',1)[1][:-4])):
      im=cv2.imread(st); k=os.path.basename(st)[:-4]; m=meta.get(k+'.mp4',{})
      lab=f"{vi}{chr(97+len(cells))} c{len(m.get('cuts',[]))}"
      cv2.rectangle(im,(0,0),(120,30),(0,0,0),-1); cv2.putText(im,lab,(4,22),cv2.FONT_HERSHEY_SIMPLEX,0.7,(255,255,255),2)
      cells.append(im)
    while len(cells)<len(FR): cells.append(np.zeros((216,384,3),np.uint8))
    rows.append(np.hstack(cells[:len(FR)]))
  cv2.imwrite(f'out/hoja_{t}.jpg',np.vstack(rows),[cv2.IMWRITE_JPEG_QUALITY,78])
  json.dump({f'{vi}':v for vi,v in enumerate(vids)},open(f'out/hoja_{t}.json','w'))
