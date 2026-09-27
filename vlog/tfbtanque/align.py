# Alinea el guion dirigido (líneas T/D/L) contra el ASR por palabra del máster (difflib GLOBAL) y corta los TRAMOS.
# Salida: vlog/tfbtanque/tramos.json + out/tfbtanque/tramos/<id>.wav
# uso: python vlog/tfbtanque/align.py
import json, re, difflib, unicodedata, subprocess, os
import numpy as np, soundfile as sf
R = 'D:/Proyectos/video2-wt/tfbtanque/'
PLAN = R + 'vlog/tfbtanque/guion_plan.txt'
ASR = json.load(open(R + 'public/captions_tfbtanque.json', encoding='utf8'))
WAV = R + 'public/tfbtanque.wav'
OUT = R + 'out/tfbtanque/tramos/'; os.makedirs(OUT, exist_ok=True)
MAXT = 9.0
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9ñ]', '', w)
L = [l.rstrip('\n').split('|') for l in open(PLAN, encoding='utf8') if l.strip() and not l.startswith('#')]
lines = []
cnt = {}
for t, s, a, x in L:
    cnt[s] = cnt.get(s, 0) + 1
    lines.append({'id': f'{s}_{cnt[s]:02d}', 'type': t, 'scene': s, 'action': a, 'text': x.strip()})
sw, owner = [], []
for li, ln in enumerate(lines):
    if ln['type'] not in 'TDL': continue
    for w in ln['text'].split():
        n = norm(w)
        if n: sw.append(n); owner.append(li)
aw = [(norm(c['text']), c['startMs'] / 1000, c['endMs'] / 1000) for c in ASR]; aw = [a for a in aw if a[0]]
sm = difflib.SequenceMatcher(None, sw, [a[0] for a in aw], autojunk=False)
st = [None] * len(sw); en = [None] * len(sw); holes = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1): st[i1 + k] = aw[j1 + k][1]; en[i1 + k] = aw[j1 + k][2]
    elif j2 > j1 and i2 > i1:
        a, b = aw[j1][1], aw[j2 - 1][2]
        for k in range(i2 - i1): st[i1 + k] = a + (b - a) * k / (i2 - i1); en[i1 + k] = a + (b - a) * (k + 1) / (i2 - i1)
    if tag in ('delete', 'replace') and (i2 - i1) - (j2 - j1) >= 3:
        holes.append((tag, ' '.join(sw[i1:i2]), ' '.join(a[0] for a in aw[j1:j2])))
    if tag == 'insert' and j2 - j1 >= 3: holes.append(('insert', '', ' '.join(a[0] for a in aw[j1:j2])))
for i in range(len(st)):
    if st[i] is None: st[i] = en[i - 1] if i else 0.0; en[i] = st[i]
for i in range(1, len(st)): st[i] = max(st[i], st[i - 1]); en[i] = max(en[i], st[i])
print('similitud', round(sm.ratio(), 4), '· huecos >=3 palabras:', len(holes))
for h in holes: print('  ', h)
x, sr = sf.read(WAV, dtype='float32'); D = len(x) / sr
mono = x if x.ndim == 1 else x.mean(1)
def e_min(t0, t1):  # instante de menor energía (ventanas 10 ms) entre t0 y t1
    a, b = int(t0 * sr), int(t1 * sr)
    if b - a < int(0.02 * sr): return (t0 + t1) / 2
    seg = mono[a:b]; hop = int(0.01 * sr); n = len(seg) // hop
    e = [np.mean(seg[k * hop:(k + 1) * hop] ** 2) for k in range(n)]
    return t0 + (int(np.argmin(e)) + 0.5) * 0.01
# palabras por línea
wi = {}
for k, li in enumerate(owner): wi.setdefault(li, []).append(k)
spoken = [li for li in range(len(lines)) if li in wi]
# cortes entre líneas habladas consecutivas (en el mínimo de energía entre fin de una y arranque de la otra)
cuts = {}
for p, li in enumerate(spoken):
    ks = wi[li]; s0, e0 = st[ks[0]], en[ks[-1]]
    lines[li]['w0'], lines[li]['w1'] = round(s0, 3), round(e0, 3)
for p, li in enumerate(spoken):
    if p == 0: lines[li]['a'] = 0.0
    else:
        prev = spoken[p - 1]; t = e_min(lines[prev]['w1'], max(lines[prev]['w1'], lines[li]['w0']))
        lines[li]['a'] = round(t, 3); lines[prev]['b'] = round(t, 3)
lines[spoken[-1]]['b'] = round(D, 3)
# partir las > MAXT en la pausa interna más grande cerca del medio
tramos = []
for li, ln in enumerate(lines):
    if li not in wi: tramos.append({**ln}); continue
    ks = wi[li]; a, b = ln['a'], ln['b']; pieces = [(a, b)]
    while any(q - p > MAXT for p, q in pieces):
        out = []
        for p, q in pieces:
            if q - p <= MAXT: out.append((p, q)); continue
            cands = [(st[k + 1] - en[k], k) for k in ks[:-1] if p + 2.0 < en[k] < q - 2.0]
            if not cands: out.append((p, q)); continue
            mid = (p + q) / 2
            g, k = max(cands, key=lambda c: c[0] - abs((en[c[1]] + st[c[1] + 1]) / 2 - mid) * 0.08)
            t = e_min(en[k], max(en[k], st[k + 1])); out += [(p, t), (t, q)]
        if out == pieces: break
        pieces = out
    for n, (p, q) in enumerate(pieces):
        tid = ln['id'] + ('' if len(pieces) == 1 else 'abcdef'[n])
        toks = [w for w in ln['text'].split() if norm(w)]
        assert len(toks) == len(ks), ln['id']
        txt = ln['text'] if len(pieces) == 1 else ' '.join(toks[j] for j, k in enumerate(ks) if (n == 0 or st[k] >= p - 0.05) and (n == len(pieces) - 1 or st[k] < q))
        f = OUT + tid + '.wav'; sf.write(f, x[int(p * sr):int(q * sr)], sr, subtype='PCM_16')
        tramos.append({**ln, 'id': tid, 'a': round(p, 3), 'b': round(q, 3), 'len': round(q - p, 3), 'audio': f, 'piece': n, 'npieces': len(pieces), 'text_piece': txt})
json.dump(tramos, open(R + 'vlog/tfbtanque/tramos.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
spk = [t for t in tramos if 'len' in t]
print('tramos', len(spk), '· max', max(t['len'] for t in spk), '· >9.5s', [t['id'] for t in spk if t['len'] > 9.5], '· <1.2s', [(t['id'], t['len']) for t in spk if t['len'] < 1.2])
print('dur máster', round(D, 2), '· suma tramos', round(sum(t['len'] for t in spk), 2))
