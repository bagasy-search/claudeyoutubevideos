# voz.py — (1) comprime pausas del máster Fish a <=0,25 s  (2) ASR por palabra (Modal) (3) difflib GLOBAL contra el guion
#          (4) corta un tramo por beat hablado (A, D, L) en el medio de la pausa entre beats.
# python vlog/pztanque/voz.py comprimir <master.wav>   -> out/pztanque/voz.wav
# python vlog/pztanque/voz.py tramos                    -> out/pztanque/tramos/<beat>.wav + vlog/pztanque/tramos.json
import sys, json, os, re, subprocess, difflib, unicodedata
import numpy as np
R = 'D:/Proyectos/video2-wt/pztanque/'
V = R + 'vlog/pztanque/'
O = R + 'out/pztanque/'
SR = 48000
MAXP = 0.25

def load(f):
    b = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'])
    return np.frombuffer(b, np.int16).astype(np.float32) / 32768
def save(x, f):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', f],
                   input=(np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes(), check=True)
def env_db(x, win=0.01):
    n = int(SR * win); m = len(x) // n
    e = np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1) + 1e-12)
    return 20 * np.log10(e)

if sys.argv[1] == 'comprimir':
    x = load(sys.argv[2]); e = env_db(x); th = e.max() - 42
    quiet = e < th; runs = []; i = 0
    while i < len(quiet):
        if quiet[i]:
            j = i
            while j < len(quiet) and quiet[j]: j += 1
            runs.append((i, j)); i = j
        else: i += 1
    keep = []; cur = 0; cut = 0.0; n = int(SR * 0.01)
    for a, b in runs:
        L = (b - a) * 0.01
        if L > MAXP and a > 0 and b < len(quiet):
            h = int(MAXP / 2 * SR)
            s0, s1 = a * n + h, b * n - h
            keep.append(x[cur:s0]); cur = s1; cut += (s1 - s0) / SR
    keep.append(x[cur:])
    y = np.concatenate(keep)
    # micro-fundido en cada unión para que no haga clic
    os.makedirs(O, exist_ok=True); save(y, O + 'voz.wav')
    print(f'pausas >{MAXP}s: {sum(1 for a,b in runs if (b-a)*0.01>MAXP)} · recortado {cut:.1f}s · {len(x)/SR:.1f}s -> {len(y)/SR:.1f}s')

def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9ñ]', '', w)

if sys.argv[1] == 'tramos':
    B = json.load(open(V + 'beats.json', encoding='utf8'))
    asr = json.load(open(O + 'asr.json', encoding='utf8'))
    caps = list(asr.values())[0]
    aw = [(norm(c['text']), c['startMs'] / 1000, c['endMs'] / 1000) for c in caps]; aw = [a for a in aw if a[0]]
    x = load(O + 'voz.wav'); D = len(x) / SR; e = env_db(x)
    SP = [b for b in B if b['type'] in ('A', 'D', 'L') and b['text']]
    sw, owner = [], []
    for bi, b in enumerate(SP):
        for w in b['text'].split():
            if norm(w): sw.append(norm(w)); owner.append(bi)
    sm = difflib.SequenceMatcher(None, sw, [a[0] for a in aw], autojunk=False)
    st = [None] * len(sw); en = [None] * len(sw); holes = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): st[i1 + k], en[i1 + k] = aw[j1 + k][1], aw[j1 + k][2]
        elif tag == 'replace':
            a, bb = aw[j1][1], aw[j2 - 1][2]
            for k in range(i2 - i1): st[i1 + k] = a + (bb - a) * k / (i2 - i1); en[i1 + k] = a + (bb - a) * (k + 1) / (i2 - i1)
            if (i2 - i1) > (j2 - j1) + 2: holes.append((sw[i1:i2], [a[0] for a in aw[j1:j2]]))
        elif tag == 'delete':
            holes.append((sw[i1:i2], []))
        elif tag == 'insert' and j2 - j1 > 2:
            holes.append(([], [a[0] for a in aw[j1:j2]]))
    for i in range(len(st)):
        if st[i] is None: st[i] = en[i] = (en[i - 1] if i else 0)
    first, last = {}, {}
    for i, o in enumerate(owner): first.setdefault(o, i); last[o] = i
    # corte entre beats: mínimo de energía dentro de la pausa entre la última palabra y la primera del siguiente
    cuts = [0.0]
    for bi in range(len(SP) - 1):
        a, b2 = en[last[bi]], st[first[bi + 1]]
        if b2 <= a: b2 = a + 0.02
        ia, ib = int(a * 100), max(int(a * 100) + 1, int(b2 * 100))
        seg = e[ia:ib]; c = (ia + int(np.argmin(seg))) * 0.01 if len(seg) else (a + b2) / 2
        cuts.append(max(cuts[-1] + 0.3, c))
    cuts.append(D)
    os.makedirs(O + 'tramos', exist_ok=True); T = []
    for bi, b in enumerate(SP):
        s, t = cuts[bi], cuts[bi + 1]; f = O + f'tramos/{b["id"]}.wav'
        save(x[int(s * SR):int(t * SR)], f)
        T.append({'beat': b['id'], 'scene': b['scene'], 'type': b['type'], 'audio': f, 'start': round(s, 3), 'len': round(t - s, 3), 'text': b['text']})
    json.dump(T, open(V + 'tramos.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
    Ls = [t['len'] for t in T if t['type'] != 'L']
    print(f'similitud {sm.ratio():.3f} · tramos {len(T)} · largo min {min(Ls):.2f} max {max(Ls):.2f} · total {D:.1f}s')
    print('>11.8s:', [t['beat'] for t in T if t['len'] > 11.8 and t['type'] != 'L'])
    print('huecos (guion vs asr):', [(' '.join(h[0])[:60], ' '.join(h[1])[:60]) for h in holes][:20])
