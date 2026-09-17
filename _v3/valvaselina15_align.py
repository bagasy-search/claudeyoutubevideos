# valvaselina15_align.py — alineación GLOBAL guion↔ASR (difflib), un ms por palabra del guion
# + reporte de huecos (palabras del guion que faltan en el audio) con su bloque de Fish.
# Uso: python _v3/valvaselina15_align.py <captions.json> [--blocks]
import json, re, unicodedata, difflib, sys, os, wave

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn')
    s = re.sub(r'[^a-z0-9 ]', ' ', s)
    return re.sub(r'\s+', ' ', s).strip()

NUM = {'0':'cero','1':'uno','2':'dos','3':'tres','4':'cuatro','5':'cinco','6':'seis','7':'siete','8':'ocho','9':'nueve','10':'diez',
       '15':'quince','24':'veinticuatro','48':'cuarenta y ocho','71':'setenta y uno','80':'ochenta','98':'noventa y ocho','2016':'dos mil dieciseis','50':'cincuenta'}
G = norm(open('GUION_valvaselina15.txt', encoding='utf-8').read()).split(' ')
caps = json.load(open(sys.argv[1], encoding='utf-8-sig'))
A = []
for w in caps:
    for t in norm(w['text']).split(' '):
        if not t: continue
        rep = NUM.get(t)
        toks = rep.split(' ') if rep else [t]
        for k, tt in enumerate(toks):
            A.append((tt, w['startMs'] / 1000.0 + k * 0.12))
sm = difflib.SequenceMatcher(None, G, [a[0] for a in A], autojunk=False)
ms = [None] * len(G); eq = 0; gaps = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        for k in range(i2 - i1): ms[i1 + k] = A[j1 + k][1]
        eq += i2 - i1
    else:
        if j2 > j1:
            a, b = A[j1][1], A[j2 - 1][1]
            for k in range(i2 - i1): ms[i1 + k] = a + (b - a) * k / max(1, i2 - i1)
        if (i2 - i1) >= 4 and (i2 - i1) - (j2 - j1) >= 3:
            gaps.append((i1, i2, j1, ' '.join(G[i1:i2]), ' '.join(a[0] for a in A[j1:j2])))
last = 0.0
for i in range(len(ms)):
    if ms[i] is None: ms[i] = last
    ms[i] = max(ms[i], last); last = ms[i]
# repartir palabras con el mismo tiempo entre vecinas
i = 0
while i < len(ms):
    j = i
    while j + 1 < len(ms) and abs(ms[j + 1] - ms[i]) < 1e-6: j += 1
    if j > i:
        nxt = ms[j + 1] if j + 1 < len(ms) else ms[i] + 0.3 * (j - i + 1)
        for k in range(i, j + 1): ms[k] = ms[i] + (nxt - ms[i]) * (k - i) / (j - i + 1)
    i = j + 1
json.dump([round(x, 3) for x in ms], open('_v3/valvaselina15_wordms.json', 'w'))
print(f'guion {len(G)} palabras · asr {len(A)} · exactas {eq} ({100*eq/len(G):.1f}%) · huecos≥4 {len(gaps)}')
# bloques
bd = 'out/valvaselina15'
offs = []; t0 = 0.0
k = 0
while os.path.exists(f'{bd}/block_{k:03d}.wav'):
    with wave.open(f'{bd}/block_{k:03d}.wav') as w: d = w.getnframes() / w.getframerate()
    offs.append((k, t0, t0 + d)); t0 += d; k += 1
for i1, i2, j1, g, a in gaps:
    t = ms[i1]
    blk = next((b for b, s, e in offs if s <= t < e), None)
    print(f'  hueco t={t:7.1f}s bloque={blk} faltan={i2-i1}: «{g[:120]}» | asr «{a[:80]}»')
