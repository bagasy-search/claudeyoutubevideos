# vallimon_align.py — alineación GLOBAL guion↔ASR (difflib), un seg por palabra del guion.
# Entrada: public/captions_vallimon.json (Modal, una caption por palabra). Salida: _v3/vallimon_wordms.json
# Reporta tramos 'delete' (guion sin ASR) >= 12 palabras = Modal se comió una frase.
import json, re, unicodedata, difflib

NUM = {'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez',
       '24':'veinticuatro','30':'treinta','71':'setenta y uno','98':'noventa y ocho','20':'veinte','72':'setenta y dos','100':'cien','2016':'dos mil dieciseis','50':'cincuenta','52':'cincuenta y dos','68':'sesenta y ocho','100':'cien','24':'veinticuatro','50':'cincuenta','41':'cuarenta y uno','2016':'dos mil dieciseis','7':'siete','15':'quince','69':'sesenta y nueve','25':'veinticinco','12':'doce','40':'cuarenta','90':'noventa'}
def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

G = norm(open('GUION_vallimon.txt', encoding='utf-8').read()).split(' ')
caps = json.load(open('public/captions_vallimon.json', encoding='utf-8'))
A = []
for c in caps:
    toks = norm(c['text']).split(' ')
    toks2 = []
    for t in toks:
        if t in NUM: toks2 += NUM[t].split(' ')
        elif t: toks2.append(t)
    n = len(toks2)
    for k, t in enumerate(toks2):
        A.append((t, (c['startMs'] + (c['endMs'] - c['startMs']) * k / max(1, n)) / 1000))
sm = difflib.SequenceMatcher(None, G, [a[0] for a in A], autojunk=False)
ms = [None] * len(G); eq = 0; dels = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1): ms[i1 + k] = A[j1 + k][1]
        eq += i2 - i1
    elif j2 > j1:
        a, b = A[j1][1], A[j2 - 1][1]
        for k in range(i2 - i1): ms[i1 + k] = a + (b - a) * k / max(1, i2 - i1)
    if tag in ('delete', 'replace') and (i2 - i1) - (j2 - j1) >= 12:
        dels.append((i1, i2, ' '.join(G[i1:i1 + 8])))
last = 0.0
for i in range(len(ms)):
    if ms[i] is None: ms[i] = last
    ms[i] = max(ms[i], last); last = ms[i]
# palabras con el mismo tiempo -> repartir entre vecinas
i = 0
while i < len(ms):
    j = i
    while j + 1 < len(ms) and ms[j + 1] == ms[i]: j += 1
    if j > i:
        nxt = ms[j + 1] if j + 1 < len(ms) else ms[i] + 0.3 * (j - i + 1)
        for k in range(i, j + 1): ms[k] = ms[i] + (nxt - ms[i]) * (k - i) / (j - i + 1)
    i = j + 1
json.dump([round(x, 3) for x in ms], open('_v3/vallimon_wordms.json', 'w'))
print(f'guion {len(G)} palabras · asr {len(A)} · exactas {eq} ({100*eq/len(G):.1f}%) · ratio {sm.ratio():.3f} · huecos>=12: {len(dels)}')
for d in dels: print('  DELETE', d)
