# parse.py — vlog/SLUG/beats.txt -> beats.json + guiones/SLUG.txt   (formato NARRADOR + b-roll)
# Línea:  [W:query § G:prompt § A:prompt::movimiento § P:prompt] texto hablado
#   W = foto REAL de la web (Pexels, filtrada por visión)      G = imagen gpt-image-2 (low, Batch) sin gente conocida
#   P = imagen gpt con el presentador (/edits + cara 128x192)   A = imagen gpt + clip agnes v2.0 (2 s a 0,5x = 4 s)
# '#' comentario · '~' al inicio = beat omitido
import re, json, sys, os
SLUG = os.path.basename(os.path.dirname(os.path.abspath(__file__)))
B = []; n = 0
for ln in open(f'vlog/{SLUG}/beats.txt', encoding='utf8'):
    ln = ln.strip()
    if not ln or ln.startswith('#'): continue
    m = re.match(r'\[([^\]]*)\]\s*(.*)$', ln); head, text = m.group(1), m.group(2).strip()
    n += 1; vis = []
    for part in head.split('§'):
        part = part.strip()
        if not part: continue
        k, v = part[0].upper(), part[2:].strip()
        mv = ''
        if k == 'A' and '::' in v: v, mv = [x.strip() for x in v.split('::', 1)]
        vis.append({'k': k, 'v': v, **({'motion': mv} if mv else {})})
    B.append({'id': f'b{n:03d}', 'type': 'A', 'scene': 'N', 'P': 'N', 'text': text, 'visuals': vis})
json.dump(B, open(f'vlog/{SLUG}/beats.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
tot = sum(len(b['text']) for b in B)
os.makedirs('guiones', exist_ok=True)
open(f'guiones/{SLUG}.txt', 'w', encoding='utf8', newline='\n').write('\n'.join(b['text'] for b in B) + '\n')
from collections import Counter
c = Counter(v['k'] for b in B for v in b['visuals'])
print('beats', len(B), 'chars', tot, 'min est', round(tot / 14.3 / 60, 1), 'visuales', dict(c))
