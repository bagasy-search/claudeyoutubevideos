# cut.py: reel de RunPod -> ventanas win-NNN.mp4 (30 fps por duplicado, 1920x1080), con el desfase medido por ventana (correlación reel mp4 <-> reel.wav)
import json, subprocess, sys, os, numpy as np
REEL, WAV, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(OUT, exist_ok=True)
jobs = json.load(open('avatar_jobs.json'))
def pcm(p): return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-ac', '1', '-ar', '8000', '-f', 'f32le', '-'], capture_output=True).stdout, np.float32)
a = pcm(REEL); b = pcm(WAV); print('reel mp4 %.2f s · reel wav %.2f s' % (len(a) / 8000, len(b) / 8000))
if len(a) < len(b) - 8000 * 2: print('::error::el mp4 volvió MAS CORTO que el audio (%.1f s de menos)' % ((len(b) - len(a)) / 8000)); sys.exit(1)
lags = []
for j in jobs:
    o = int(j['offset_s'] * 8000); n = int(min(j['seconds'], 6) * 8000); ref = b[o:o + n]; best = (0.0, -1.0)
    for lag in range(-3200, 3201, 40):   # ±0,4 s, paso 5 ms
        s = o + lag
        if s < 0 or s + n > len(a): continue
        x = a[s:s + n]; c = float(np.dot(x, ref) / (np.linalg.norm(x) * np.linalg.norm(ref) + 1e-9))
        if c > best[1]: best = (lag / 8000, c)
    lags.append(best)
print('desfase por ventana (s):', ' '.join('%.3f' % l for l, _ in lags)); print('corr:', ' '.join('%.2f' % c for _, c in lags))
# el reel de RunPod salta ~0,1 s en bloque hacia el final (medido en varios videos): mediana móvil de 5 ventanas de lo medido
M = [l for l, _ in lags]
use = [float(np.median(M[max(0, i - 2):i + 3])) for i in range(len(jobs))]
print('desfase aplicado (s):', ' '.join('%.3f' % l for l in use))
for j, lag in zip(jobs, use):
    ss = max(0, j['offset_s'] + lag); n = round((j['timeline_start_s'] + j['seconds']) * 30) - round(j['timeline_start_s'] * 30) + 1
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '%.3f' % ss, '-i', REEL, '-an', '-vf', 'fps=30,scale=1920:1080:flags=lanczos,setsar=1', '-frames:v', str(n),
                    '-c:v', 'libx264', '-crf', '17', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', f"{OUT}/{j['out']}"], check=True)
json.dump([{'win': j['win'], 'lag': l, 'medido': m, 'c': c} for j, l, (m, c) in zip(jobs, use, lags)], open('out/av_lag.json', 'w'))
print('ventanas', len(jobs))
