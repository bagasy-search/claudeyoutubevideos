# valvaselina15_avcut.py — corta el mp4 de InfiniteTalk (1 /run) en las ventanas visibles, con el LAG MEDIDO por ventana.
# lag = correlación del audio del mp4 contra reel.wav alrededor de cada ventana (la deriva viene en escalones).
# Salida: public/avatar_clips/valvaselina15/w###.mp4 (1920x1080 30/1 CFR, sin audio) + _work/valvaselina15/av/lags.json
import json, subprocess, numpy as np, sys, os
W = '_work/valvaselina15/av'
RAW = f'{W}/avatar_raw.mp4'
segs = json.load(open(f'{W}/segs.json'))
wins = json.load(open(f'{W}/windows.json'))
def pcm(src, ss=None, t=None):
    a = ['ffmpeg', '-v', 'error']
    if ss is not None: a += ['-ss', f'{ss:.3f}']
    if t is not None: a += ['-t', f'{t:.3f}']
    a += ['-i', src, '-ac', '1', '-ar', '8000', '-f', 's16le', '-']
    return np.frombuffer(subprocess.run(a, capture_output=True, check=True).stdout, dtype=np.int16).astype(np.float32)
dur = lambda f: float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f], capture_output=True, text=True).stdout.strip())
R = dur(RAW); REEL = dur(f'{W}/reel.wav')
print(f'mp4 {R:.2f} s · reel {REEL:.2f} s · dif {R-REEL:+.2f}')
if R < REEL - 1.0: print('⛔ el mp4 vino CORTO'); sys.exit(2)
mp4a = pcm(RAW); reel = pcm(f'{W}/reel.wav')
SR = 8000
def lag_at(t0, t1):
    a = int(t0 * SR); b = int(t1 * SR)
    ref = reel[a:b]; M = int(0.6 * SR)
    seg = mp4a[max(0, a - M): b + M]
    if len(ref) < SR or len(seg) < len(ref): return 0.0, 0.0
    ref = (ref - ref.mean()); seg = seg - seg.mean()
    c = np.correlate(seg, ref, mode='valid')
    k = int(np.argmax(c)); off = (k - (a - max(0, a - M))) / SR
    q = c[k] / (np.linalg.norm(ref) * np.linalg.norm(seg[k:k + len(ref)]) + 1e-9)
    return off, float(q)
os.makedirs('public/avatar_clips/valvaselina15', exist_ok=True)
lags = []
for w in wins:
    g = next(s for s in segs if s['start'] - 1e-3 <= w['start'] and w['end'] <= s['end'] + 0.5)
    r0 = g['off'] + (w['start'] - g['start']); r1 = r0 + (w['end'] - w['start'])
    lag, q = lag_at(max(0, r0 - 1), min(REEL, r1 + 1))
    if q < 0.5: lag = lags[-1]['lag'] if lags else 0.0
    lags.append({'name': w['name'], 'lag': round(lag, 3), 'q': round(q, 3)})
    d = w['end'] - w['start']
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, r0 + lag):.3f}', '-i', RAW, '-t', f'{d + 0.1:.3f}', '-an',
                    '-vf', 'scale=1920:1080:flags=lanczos,fps=30,setsar=1,format=yuv420p,tpad=stop_mode=clone:stop_duration=0.5',
                    '-t', f'{d + 0.1:.3f}', '-r', '30', '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', f'public/avatar_clips/valvaselina15/{w["name"]}.mp4'], check=True)
json.dump(lags, open(f'{W}/lags.json', 'w'), indent=1)
L = [x['lag'] for x in lags]
print(f'ventanas {len(wins)} · lag min {min(L):+.3f} max {max(L):+.3f} · q<0.5: {sum(1 for x in lags if x["q"] < 0.5)}')
