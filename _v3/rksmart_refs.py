import json, os, subprocess, sys

W = json.load(open('_v3/rkfob_words.json', encoding='utf-8'))
cands = json.load(open('_v3/rkfob_refcands.json', encoding='utf-8'))
pick = [93.16, 345.70, 683.54]
sel = [c for c in cands if round(c[0], 2) in [round(p, 2) for p in pick]]
refs = []
for n, (t, d, txt) in enumerate(sel, 1):
    s = min(range(len(W)), key=lambda i: abs(W[i]['t'] - t))
    e = s
    while e + 1 < len(W) and W[e + 1]['t'] <= t + d + 0.01:
        e += 1
    a = max(0, W[s]['t'] - 0.22)
    nxt = W[e + 1]['t'] if e + 1 < len(W) else W[e]['t'] + 0.7
    b = min(nxt - 0.05, W[e]['t'] + 0.9)
    out = '_v3/rksmart/ref%d.wav' % n
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '%.3f' % a, '-t', '%.3f' % (b - a),
                    '-i', 'public/rkfob.wav', '-ac', '1', '-ar', '44100', '-c:a', 'pcm_s16le', out], check=True)
    refs.append({"wav": os.path.abspath(out).replace(os.sep, '/'), "text": txt})
    print('ref%d: %.2f->%.2f (%.2fs) %d chars' % (n, a, b, b - a, len(txt)))
    print('   ', txt)
json.dump(refs, open('_v3/rksmart/refs.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('MEDIDO: referencias escritas', len(refs))
if len(refs) != 3:
    sys.exit('faltan referencias')
