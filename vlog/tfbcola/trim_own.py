# trim_own.py <S> — recorta el T de los clips con audio propio (vecino) al final real de su voz + 0,25 s (sin silencio
# muerto) y fija el T de los planos X (sólo foley) según XT. Escribe state.json / state_det.json de la escena.
import sys, json, subprocess, numpy as np, os
S = sys.argv[1]; D = f'out/vlog/{S}/clips/'
XT = {'b000': 3.2, 'b001': 2.2, 'b147': 3.4}
P = json.load(open(f'vlog/tfbcola/{S}.json', encoding='utf8'))
st = json.load(open(D + 'state.json')) if os.path.exists(D + 'state.json') else {}
sd = json.load(open(D + 'state_det.json')) if os.path.exists(D + 'state_det.json') else {}
def fin(f):
    b = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-vn', '-ac', '1', '-ar', '16000', '-f', 's16le', '-'], capture_output=True, creationflags=0x08000000).stdout
    x = np.frombuffer(b, np.int16).astype(float) / 32768; n = len(x) // 160
    e = 20 * np.log10(np.sqrt((x[:n * 160].reshape(n, 160) ** 2).mean(1)) + 1e-7); th = e.max() - 30
    idx = np.where(e > th)[0]; return (idx[-1] + 1) * 0.01 if len(idx) else None
for c in P['clips']:
    if c.get('line') and c['id'] in st:
        v = st[c['id']]; e = fin(D + v['file'])
        if e: v['T'] = round(min(float(v.get('T_orig', v['T'])), e + 0.25), 2); v.setdefault('T_orig', c['secs']); print(S, c['id'], 'T', v['T'])
for k, t in XT.items():
    if k in sd: sd[k]['T'] = t; print(S, k, 'X T', t)
json.dump(st, open(D + 'state.json', 'w'), indent=1); json.dump(sd, open(D + 'state_det.json', 'w'), indent=1)
