# parse.py — lee guion_beats.txt → beats.json (orden global) + guiones/tfbcola.txt (sólo lo que dice la voz máster)
import json, re, sys
L = [l.rstrip('\n') for l in open('guion_beats.txt', encoding='utf8')]
scenes = []; beats = []; sc = None; n = 0
for l in L:
    if not l.strip() or (l.startswith('#') and not l.startswith('#S')): continue
    f = l.split('|')
    if f[0].startswith('#S'):
        sc = {'id': f[0][1:], 'set': f[1], 'nb': f[2] == '1', 'k0': f[3]}; scenes.append(sc); continue
    t = f[0]; b = {'id': f'b{n:03d}', 'scene': sc['id'], 'type': t}; n += 1
    if t == 'A': b.update(text=f[1], A=f[2], K=f[3])
    elif t == 'D': b.update(text=f[1], d1=f[2], d2=f[3])
    elif t == 'V': b.update(line=f[1], A=f[2], K=f[3], secs=int(f[4]))
    elif t == 'X': b.update(d1=f[1], d2=f[2], secs=int(f[3]))
    elif t == 'L': b.update(text=f[1])
    beats.append(b)
json.dump({'scenes': scenes, 'beats': beats}, open('beats.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
voz = [b['text'] for b in beats if b['type'] in 'ADL']
open('../../guiones/tfbcola.txt', 'w', encoding='utf8', newline='\n').write('\n'.join(voz) + '\n')
ch = sum(len(t) for t in voz); cps = 14.5
print('beats', len(beats), {t: sum(1 for b in beats if b['type'] == t) for t in 'ADVXL'}, 'chars voz', ch)
# estimación de tiempos
t = 0; marks = {}
for b in beats:
    d = len(b['text']) / cps + 0.25 if b['type'] in 'ADL' else b['secs'] * 0.8
    t += d; b['est_end'] = t
for m in (60, 120, 180, 360, 420):
    bb = next(b for b in beats if b['est_end'] >= m); print(f'min {m/60:.0f}: {bb["id"]} {bb["scene"]} {bb.get("text", bb.get("line", ""))[:60]}')
print('total est', round(t / 60, 2), 'min')
for s in scenes:
    bs = [b for b in beats if b['scene'] == s['id']]
    print(s['id'], 'anclas', 1 + sum(1 for b in bs if b['type'] in 'AV'), 'clips', sum(1 for b in bs if b['type'] != 'L'), 'det', sum(1 for b in bs if b['type'] in 'DX'))
