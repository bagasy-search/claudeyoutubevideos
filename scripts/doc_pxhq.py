# doc_pxhq.py — deja listas las tomas de video del plan literal y escribe hq_res.json para la pasada 2 de doc_litplan:
#   px_* (Pexels HD): baja el archivo HD entero (1 vez por clip, a ≤1920 h264) → <pub>/<slug>/lit/v/<vid>.mp4
#   resto (farm lithq): mueve <dl>/*/<key>.mp4 → <pub>/<slug>/lit/v/ y junta los hq_*.json
# Uso: python -I scripts/doc_pxhq.py <plan.json> <raiz_lit> <public/> <slug> [dir_artifacts_lithq]
import json, sys, os, glob, shutil, subprocess, urllib.request
P = json.load(open(sys.argv[1], encoding='utf8')); R, PUB, SLUG = sys.argv[2], sys.argv[3], sys.argv[4]
DL = sys.argv[5] if len(sys.argv) > 5 else None
PX = json.load(open(os.path.join(R, 'pexels.json'), encoding='utf8')) if os.path.exists(os.path.join(R, 'pexels.json')) else {}
OUT = os.path.join(PUB, SLUG, 'lit', 'v'); os.makedirs(OUT, exist_ok=True)
RES = os.path.join(R, 'hq_res.json'); res = json.load(open(RES, encoding='utf8')) if os.path.exists(RES) else {}
if DL:
    for f in glob.glob(os.path.join(DL, '*', 'hq_*.json')):
        for k, v in json.load(open(f, encoding='utf8')).items():
            src = os.path.join(os.path.dirname(f), k + '.mp4')
            if os.path.exists(src): shutil.move(src, os.path.join(OUT, k + '.mp4'))
            if os.path.exists(os.path.join(OUT, k + '.mp4')): res[k] = {**v, 'cred': 'METRAJE DE ARCHIVO'}
from concurrent.futures import ThreadPoolExecutor
def baja(vid):   # 1 descarga + encode por clip (3 a la vez)
    m = PX[vid]; dst = os.path.join(OUT, vid + '.mp4')
    if not os.path.exists(dst):
        tmp = dst + '.dl'
        try:
            rq = urllib.request.Request(m['hd'], headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})   # sin UA → 403
            with urllib.request.urlopen(rq, timeout=120) as r, open(tmp, 'wb') as fo: fo.write(r.read())
        except Exception as e: print('X', vid, e); return 0
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-vf', "scale='min(1920,iw)':-2", '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
                        '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-movflags', '+faststart', dst], check=False)
        os.remove(tmp); return 1
    return 0
vids = sorted({q['vid'] for q in P['hq'] if q['vid'].startswith('px_') and q['key'] not in res and q['vid'] in PX})
with ThreadPoolExecutor(3) as ex: n = sum(ex.map(baja, vids))
for q in P['hq']:
    if not q['vid'].startswith('px_') or q['key'] in res or q['vid'] not in PX: continue
    m = PX[q['vid']]; dst = os.path.join(OUT, q['vid'] + '.mp4')
    if not os.path.exists(dst): continue
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', dst], capture_output=True, text=True).stdout)
    res[q['key']] = {'dur': round(float(pr['format']['duration']), 2), 't_in': float(q['t']), 'w': pr['streams'][0]['width'], 'h': pr['streams'][0]['height'],
                     'v': f"{SLUG}/lit/v/{q['vid']}", 'cred': f"{m['user']} · Pexels" if m.get('user') else 'Pexels'}
json.dump(res, open(RES, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print('hq_res', len(res), '· px nuevos', n, '· baja res', sum(1 for v in res.values() if v.get('h', 1080) < 700))
