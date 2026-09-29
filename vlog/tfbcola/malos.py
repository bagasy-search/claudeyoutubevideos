# malos.py S… — por clip, la versión vigente (state.json): labios, palabras, cara, salto → lista de regeneración
import json, sys, re
for S in sys.argv[1:]:
    d = f'out/vlog/{S}/clips/'; st = json.load(open(d + 'state.json', encoding='utf8')); h = json.load(open(d + 'check_hist.json', encoding='utf8'))
    P = json.load(open(f'vlog/tfbcola/{S}.json', encoding='utf8')); own = {c['id'] for c in P['clips'] if c.get('line')}
    bad = []
    for k, v in st.items():
        r = h.get(k, {}).get(v['file'])
        if not r: continue
        line = r.get('line', ''); why = []
        if r.get('labios') and not r['labios'].get('ok'): why.append(f"labios {r['labios']['corr']}")
        m = re.search(r'de más: ([^·]*)', line)
        if m and len(m.group(1).split()) >= 2: why.append('palabras: ' + m.group(1).strip())
        if 'NO ES' in line and k not in own: why.append('cara')
        if why: bad.append(f"{k}({'; '.join(why)})")
    print(S, ' '.join(bad))
