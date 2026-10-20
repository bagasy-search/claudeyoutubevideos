# doc_mixmundo.py — audio de un documental "mundo continuo" ENTERO (M1.tsx + mundo.json): voz + sonido REAL de cada toma
# bajo la voz (ducking), música propia (doc_score) y efectos SÓLO donde el mundo cambia (doc_sfx_mix), a -14 LUFS / -1,5 dBTP.
# Los planos se funden (no hay cortes) → nada de whoosh por plano: whoosh suave al abrir/cerrar cada portal,
# revelación (riser → silencio → braam) al entrar a cada sitio, cierre al final; la música queda en cama ("calma") bajo la narración.
# Uso: python -I scripts/doc_mixmundo.py <mundo.json> <voz.wav> <public/> <salida_dir> [eventos_previos.json hasta_s]
#   eventos_previos: los del minuto 1 (se usan tal cual antes de hasta_s; después van los del cuerpo)
#   → <salida_dir>/mix.wav · voz_st.wav · eventos.json · final.wav (el que va al encode)
import json, os, subprocess, sys, numpy as np
sys.stdout.reconfigure(encoding="utf8", errors="replace")
from collections import Counter
S = os.path.dirname(os.path.abspath(__file__)); SR = 48000; TAIL = 1.0; PAD = 0.15
M = json.load(open(sys.argv[1], encoding='utf8')); VOZ, PUB, O = sys.argv[2], sys.argv[3].rstrip('/') + '/', sys.argv[4].rstrip('/') + '/'
PREV = json.load(open(sys.argv[5], encoding='utf8')) if len(sys.argv) > 6 else []; HASTA = float(sys.argv[6]) if len(sys.argv) > 6 else 0.0
os.makedirs(O, exist_ok=True); END = M['end']; XF = M.get('xf', 0.32)

def rd(path, ss=None, dur=None, af=None):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None: cmd += ['-ss', f'{ss:.3f}']
    if dur is not None: cmd += ['-t', f'{dur:.3f}']
    cmd += ['-i', path] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, dtype=np.float32).copy()
_G = {}
def ganancia(p, objetivo):   # ganancia FIJA por clip (medido entero); mudo → None. Nunca loudnorm por plano.
    if p in _G: return _G[p]
    o = subprocess.run(['ffmpeg', '-nostats', '-i', p, '-vn', '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf8', errors='replace').stderr
    I = [l for l in o.splitlines() if l.strip().startswith('I:')]
    v = float(I[-1].split()[1]) if I else -999
    _G[p] = None if v < -55 else min(12.0, objetivo - v); return _G[p]

N = int((END + TAIL) * SR)
voz = rd(VOZ, 0, END); vz = np.zeros(N, np.float32); vz[:len(voz)] = voz[:N]
amb = np.zeros(N, np.float32); nat = np.zeros(N, np.float32); falta, noaud, n = set(), 0, 0
for p in M['portals']:
    its = p['items']
    for i, s in enumerate(its):
        if 'v' not in s: continue
        f = PUB + s['v'] + '.mp4'
        if not os.path.exists(f): falta.add(s['v']); continue
        r = s.get('rate') or 1.0; gc = str(s.get('src', '')).startswith('gc_')
        a0 = max(0, s['a'] - (XF / 2 if i else 0) - PAD); b0 = s['b'] + (XF / 2 if i < len(its) - 1 else 0) + PAD; d = b0 - a0
        ss = (s.get('from') or 0) - (s['a'] - a0) * r
        g = ganancia(f, -15 if gc else -26)
        if g is None: noaud += 1; continue
        x = rd(f, max(0, ss), d * r + 0.1, f'highpass=f=60,volume={g:.1f}dB' + (f',atempo={r}' if abs(r - 1) > 0.01 else ''))[:int(d * SR)]
        if not len(x): noaud += 1; continue
        k = min(int((0.12 if gc else XF + 0.1) * SR), len(x) // 2); env = np.ones(len(x), np.float32)
        if k: env[:k] = np.linspace(0, 1, k); env[-k:] = np.linspace(1, 0, k)
        j = int(a0 * SR); m = min(len(x), N - j); (nat if gc else amb)[j:j + m] += (x * env)[:m]; n += 1
kk = int(0.05 * SR); ev = np.convolve(np.abs(vz), np.ones(kk) / kk, mode='same')
duck = 1 - 0.6 * np.clip(ev / 0.05, 0, 1)
bus = np.clip(vz + nat + amb * 10 ** (-17 / 20) * duck, -0.89, 0.89)
w = lambda arr, o: subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', '-c:a', 'pcm_s16le', o],
                                  input=(np.repeat(arr[:, None], 2, 1) * 0.7071).astype(np.float32).tobytes(), check=True)
w(bus, O + 'mix.wav'); w(vz, O + 'voz_st.wav')
print('mezcla:', n, 'tomas con sonido ·', len(falta), 'faltan', sorted(falta)[:6], '· mudas', noaud)

# eventos del cuerpo: el mundo cambia en los portales; revelación al entrar a cada sitio (su pin); calma bajo la narración
evs = [e for e in PREV if e['t'] < HASTA]
for p in M['portals']:
    if p['t0'] >= HASTA: evs.append({'t': round(p['t0'], 2), 'tipo': 'corte'}); evs.append({'t': round(p['t0'] + 2.5, 2), 'tipo': 'calma'})
    if p['t1'] >= HASTA and p['t1'] < END - 2: evs.append({'t': round(p['t1'] - 0.3, 2), 'tipo': 'corte'})
for q in M.get('pins', []):
    if q['t0'] >= HASTA: evs += [{'t': round(q['t0'] - 4.0, 2), 'tipo': 'tension'}, {'t': round(q['t0'], 2), 'tipo': 'revelacion'}]
evs.append({'t': round(END - 0.06, 2), 'tipo': 'cierre'})
evs.sort(key=lambda e: e['t']); json.dump(evs, open(O + 'eventos.json', 'w'), indent=0)
print('eventos', dict(Counter(e['tipo'] for e in evs)))

def run(*a):
    r = subprocess.run(a, capture_output=True, text=True, encoding='utf8', errors='replace'); print((r.stdout + r.stderr).strip()[-400:])
    if r.returncode: sys.exit(1)
run(sys.executable, '-I', S + '/doc_score.py', '--in', O + 'mix.wav', '--voz', O + 'voz_st.wav', '--eventos', O + 'eventos.json', '--out', O + 'mix_mus.wav', '--stem', O + 'musica.wav')
run(sys.executable, '-I', S + '/doc_sfx_mix.py', '--in', O + 'mix_mus.wav', '--voz', O + 'voz_st.wav', '--eventos', O + 'eventos.json', '--out', O + 'final_pre.wav')
def lufs(p):
    o = subprocess.run(['ffmpeg', '-hide_banner', '-i', p, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True, encoding='utf8', errors='replace').stderr
    return float([l for l in o.splitlines() if l.strip().startswith('I:')][-1].split()[1]), float([l for l in o.splitlines() if l.strip().startswith('Peak:')][-1].split()[1])
I, _ = lufs(O + 'final_pre.wav'); gdb = -14 - I
for _ in range(4):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', O + 'final_pre.wav', '-af', f'volume={gdb:.2f}dB,aresample=192000,alimiter=limit=0.75:attack=1:release=60:level=false,aresample=48000', '-c:a', 'pcm_s16le', O + 'final.wav'], check=True)
    I, P = lufs(O + 'final.wav')
    if abs(I + 14) <= 0.5: break
    gdb += -14 - I
print(f'AUDIO_LISTO I={I:.1f} LUFS pico={P:.1f} dBTP · {END:.1f} s')
