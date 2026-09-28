# tramos.py — alinea el ASR por palabra del máster comprimido con los beats (difflib GLOBAL) y corta un tramo por beat
# en el medio de la pausa. Beats > 9,5 s se parten en la pausa interna más cercana al medio.
# Entrada: beats.json, asr.json (Modal), out/tfbcola/master_c.wav · Salida: tramos.json + out/tfbcola/tramos/*.wav
import json, re, difflib, subprocess, os, math, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '../..')).replace('\\', '/')
BJ = json.load(open(os.path.join(HERE, 'beats.json'), encoding='utf8'))
beats = [b for b in BJ['beats'] if b['type'] in 'ADL']
ASR = json.load(open(os.path.join(HERE, 'asr.json'), encoding='utf8')); caps = list(ASR.values())[0]
WAV = ROOT + '/out/tfbcola/master_c.wav'; OUT = ROOT + '/out/tfbcola/tramos/'; os.makedirs(OUT, exist_ok=True)
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]', '', w)
NUM = {'1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco'}
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip())
D = dur(WAV)
aw = [(NUM.get(norm(c['text']), norm(c['text'])), c['startMs'] / 1000, c['endMs'] / 1000) for c in caps]; aw = [x for x in aw if x[0]]
sw, owner = [], []
for bi, b in enumerate(beats):
    for w in b['text'].split():
        n = norm(w)
        if n: sw.append(n); owner.append(bi)
sm = difflib.SequenceMatcher(None, sw, [x[0] for x in aw], autojunk=False)
st = [None] * len(sw); en = [None] * len(sw); holes = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1): st[i1 + k] = aw[j1 + k][1]; en[i1 + k] = aw[j1 + k][2]
    elif j2 > j1:
        a, bb = aw[j1][1], aw[j2 - 1][2]
        for k in range(i2 - i1): st[i1 + k] = a + (bb - a) * k / max(1, i2 - i1); en[i1 + k] = a + (bb - a) * (k + 1) / max(1, i2 - i1)
    if tag in ('delete', 'replace') and (i2 - i1) > (j2 - j1) + 2: holes.append((' '.join(sw[i1:i2]), i2 - i1 - (j2 - j1)))
for i in range(len(st)):
    if st[i] is None: st[i] = en[i - 1] if i else 0; en[i] = st[i]
print(f'similitud {sm.ratio():.3f} · huecos (palabras del guion que Fish no dijo): {holes[:10]}')
wt = list(zip(owner, st, en))
first, last = {}, {}
for i, (o, s, e) in enumerate(wt): first.setdefault(o, i); last[o] = i
tramos = []; prev = 0.0
def corte(z):  # medio de la pausa después de la palabra z
    e = wt[z][2]; s = wt[z + 1][1] if z + 1 < len(wt) else D
    return D if z + 1 >= len(wt) else (e + s) / 2 if s > e else e + 0.02
for bi, b in enumerate(beats):
    i0, i1 = first[bi], last[bi]; bs, be = wt[i0][1], wt[i1][2]; pieces = [(i0, i1)]
    if be - bs > 9.5 and b['type'] != 'L':
        best = None
        for i in range(i0 + 2, i1 - 2):
            gap = wt[i + 1][1] - wt[i][2]; mid = (wt[i][2] - bs) / (be - bs)
            if wt[i][2] - bs < 3.6 or be - wt[i + 1][1] < 3.6: continue
            sc = gap - abs(mid - 0.5) * 1.5
            if best is None or sc > best[0]: best = (sc, i)
        if best: pieces = [(i0, best[1]), (best[1] + 1, i1)]
    words = b['text'].split()
    for pi, (a, z) in enumerate(pieces):
        c = corte(z); tid = b['id'] + ('' if len(pieces) == 1 else 'ab'[pi]); f = OUT + tid + '.wav'
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', WAV, '-ss', f'{prev:.3f}', '-to', f'{c:.3f}', '-ac', '1', '-ar', '44100', f], check=True)
        # texto de la pieza por conteo de palabras normalizables
        idx = [k for k, w in enumerate(words) if norm(w)]
        txt = b['text'] if len(pieces) == 1 else ' '.join(words[idx[a - i0]: (idx[z - i0 + 1] if z - i0 + 1 < len(idx) else len(words))])
        tramos.append({'id': tid, 'beat': b['id'], 'scene': b['scene'], 'type': b['type'], 'piece': pi, 'npieces': len(pieces), 'audio': f, 'start': round(prev, 3), 'len': round(c - prev, 3), 'text': txt})
        prev = c
json.dump(tramos, open(os.path.join(HERE, 'tramos.json'), 'w', encoding='utf8'), ensure_ascii=False, indent=1)
Ls = [t['len'] for t in tramos if t['type'] != 'L']
print('tramos', len(tramos), 'min', min(Ls), 'max', max(Ls), 'total', round(sum(t['len'] for t in tramos), 1), 'de', round(D, 1))
print('>11.8 s:', [t['id'] for t in tramos if t['len'] > 11.8 and t['type'] != 'L'])
# dónde caen los minutos (voz sola; el armado suma las líneas del vecino y los planos X)
for m in (60, 120, 180, 420):
    t = next((t for t in tramos if t['start'] + t['len'] >= m), None)
    if t: print(f'min {m // 60}: {t["id"]} {t["scene"]} {t["text"][:60]}')
