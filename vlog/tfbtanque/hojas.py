# Hojas de contactos de las anclas por escena (PIL, con rótulo) + filtro previo gratis con agnes-3.0-flash.
# uso: python vlog/tfbtanque/hojas.py [ESCENA …]   → out/hojas/<ESC>.jpg + out/hojas/filtro.json
import json, os, sys, base64, re, io, concurrent.futures as cf, urllib.request
from PIL import Image, ImageDraw, ImageFont
R = 'D:/Proyectos/video2-wt/tfbtanque/'
env = dict(l.split('=', 1) for l in open(R + '.env', encoding='utf8').read().splitlines() if '=' in l and not l.startswith('#'))
KS = [k.strip() for k in env['AGNES_KEYS'].split(',') if k.strip()]
order = json.load(open(R + 'vlog/tfbtanque/order.json', encoding='utf8'))
OUT = R + 'out/hojas/'; os.makedirs(OUT, exist_ok=True)
FACE = R + 'public/ref_tfbtanque_face.png'; VF = R + 'public/ref_vecino_face.png'
sel = sys.argv[1:]
def b64(p, box=512):
    im = Image.open(p).convert('RGB'); im.thumbnail((box, box)); b = io.BytesIO(); im.save(b, 'JPEG', quality=85); return 'data:image/jpeg;base64,' + base64.b64encode(b.getvalue()).decode()
Q = ('Image 1 is the reference face of the presenter. Image 2 is a video frame from his home repair video. Answer ONLY JSON: '
     '{"presenter_visible":true/false,"same_person":true/false/null,"olive_shirt_and_brown_leather_apron":true/false/null,'
     '"extra_people":"none or who","bright_enough":true/false,"weird":"deformed hands, melted objects, impossible things, or none"}')
def ask(i, img):
    body = {'model': 'agnes-3.0-flash', 'messages': [{'role': 'user', 'content': [{'type': 'text', 'text': Q}, {'type': 'image_url', 'image_url': {'url': b64(FACE, 256)}}, {'type': 'image_url', 'image_url': {'url': b64(img)}}]}]}
    for t in range(3):
        try:
            rq = urllib.request.Request('https://apihub.agnes-ai.com/v1/chat/completions', data=json.dumps(body).encode(), headers={'Authorization': 'Bearer ' + KS[(i + t) % len(KS)], 'Content-Type': 'application/json'})
            j = json.loads(urllib.request.urlopen(rq, timeout=60).read()); c = j['choices'][0]['message']['content']
            return json.loads(re.search(r'\{[\s\S]*\}', c).group(0))
        except Exception as e: err = str(e)
    return {'error': err}
filt = json.load(open(OUT + 'filtro.json', encoding='utf8')) if os.path.exists(OUT + 'filtro.json') else {}
jobs = []
for o in order:
    if o['type'] != 'scene' or (sel and o['seg'] not in sel): continue
    P = json.load(open(o['plan'], encoding='utf8')); anc = P['dir'] + 'anc/'
    files = [(a['id'], anc + a['id'] + '.png') for a in P['anchors'] if os.path.exists(anc + a['id'] + '.png')]
    for aid, f in files:
        k = o['seg'] + '/' + aid
        if k not in filt and not aid.startswith('D'): jobs.append((k, f))
    # hoja
    W, H = 400, 225; cols = 5; rows = (len(files) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * W, rows * (H + 26)), (20, 20, 20)); d = ImageDraw.Draw(sheet)
    try: font = ImageFont.truetype('arial.ttf', 20)
    except Exception: font = ImageFont.load_default()
    for n, (aid, f) in enumerate(files):
        im = Image.open(f).convert('RGB').resize((W, H)); x, y = (n % cols) * W, (n // cols) * (H + 26)
        sheet.paste(im, (x, y + 26)); d.text((x + 6, y + 3), aid, fill=(255, 210, 31), font=font)
    sheet.save(OUT + o['seg'] + '.jpg', quality=82)
with cf.ThreadPoolExecutor(8) as ex:
    for (k, f), r in zip(jobs, ex.map(lambda a: ask(*a), [(i, f) for i, (k, f) in enumerate(jobs)])): filt[k] = r
json.dump(filt, open(OUT + 'filtro.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
bad = {k: v for k, v in filt.items() if (not sel or k.split('/')[0] in sel) and (v.get('error') or v.get('same_person') is False or v.get('olive_shirt_and_brown_leather_apron') is False
       or (v.get('extra_people') not in (None, 'none', 'None', '') and 'neighbour' not in str(v.get('extra_people')).lower()) or v.get('bright_enough') is False or (v.get('weird') and v.get('weird').lower() not in ('none', 'none.')))}
print('medidas', len(jobs), 'nuevas · marcadas', len(bad))
for k, v in bad.items(): print(' ', k, json.dumps(v, ensure_ascii=False)[:220])
