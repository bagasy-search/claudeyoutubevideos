# ycand: baja por PROXY (Webshare, enmascarado) tramos de 6 s a <=720p sin audio de cada candidato de ycand.json,
# saca 3 cuadros por tramo y arma una hoja por plano (filas = tramos). Sube ycand_<slug>.tar (tramos) + ysheets_<slug>.tar.
set -e
pip install -q -U yt-dlp pillow >/dev/null 2>&1
mkdir -p c sh
python3 - <<'PY'
import os,json,subprocess,re,concurrent.futures as cf
from PIL import Image,ImageDraw
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
J=json.load(open('ycand.json')); segs=[g for s in J for g in s['segs']]
print('tramos',len(segs),'proxies',len(GOOD),flush=True)
def dl(n,g):
    out=f"c/{g['k']}.mp4"
    for a in range(3):
        px=L[GOOD[(n+a*7)%len(GOOD)]]
        try:
            r=subprocess.run(['yt-dlp','--proxy',px,'--js-runtimes','node','--remote-components','ejs:github','--extractor-args','youtube:player_client=web_embedded',
                '-f','bestvideo[height<=720][height>=360]/best[height<=720]','--download-sections',f"*{g['t']}-{g['t']+6}",'--no-warnings','-q','--no-part',
                '-o',f"c/{g['k']}.%(ext)s",'https://www.youtube.com/watch?v='+g['vid']],capture_output=True,text=True,timeout=150)
        except Exception: continue
        fs=[f for f in os.listdir('c') if f.startswith(g['k']+'.')]
        if r.returncode==0 and fs:
            f='c/'+fs[0]
            if f!=out:
                subprocess.run(['ffmpeg','-v','error','-y','-i',f,'-an','-c:v','libx264','-crf','20','-preset','veryfast','-pix_fmt','yuv420p',out]); os.remove(f)
            return g['k'],os.path.exists(out)
    return g['k'],False
ok=0
with cf.ThreadPoolExecutor(12) as ex:
    for k,good in ex.map(lambda a: dl(*a), enumerate(segs)):
        ok+=good
print('bajados',ok,'/',len(segs),flush=True)
TW,TH=320,180
for s in J:
    rows=[g for g in s['segs'] if os.path.exists(f"c/{g['k']}.mp4")]
    if not rows: continue
    im=Image.new('RGB',(TW*3,TH*len(rows)),'black'); d=ImageDraw.Draw(im)
    for i,g in enumerate(rows):
        f=f"c/{g['k']}.mp4"
        o=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f],capture_output=True,text=True).stdout.strip()
        try: du=float(o)
        except ValueError: du=0.0
        if du<=0.5: g['dur']=0; continue
        g['dur']=round(du,2)
        for j,p in enumerate((0.15,0.5,0.85)):
            subprocess.run(['ffmpeg','-v','error','-y','-ss',f'{du*p:.2f}','-i',f,'-frames:v','1','-strict','unofficial','-vf',f'scale={TW}:{TH}:force_original_aspect_ratio=decrease,pad={TW}:{TH}:(ow-iw)/2:(oh-ih)/2','fr.jpg'])
            if os.path.exists('fr.jpg'): im.paste(Image.open('fr.jpg'),(j*TW,i*TH)); os.remove('fr.jpg')
        d.rectangle([0,i*TH,34,i*TH+30],fill='black'); d.text((8,i*TH+8),str(i),fill='yellow')
    s['rows']=[g['k'] for g in rows]; s['durs']=[g['dur'] for g in rows]
    im.save(f"sh/s{s['sid']}.jpg",quality=80)
json.dump(J,open('out/ycand_res.json','w'))
PY
tar -cf out/ycand_${S}.tar c; tar -cf out/ysheets_${S}.tar sh
put out/ycand_${S}.tar out/ysheets_${S}.tar out/ycand_res.json
