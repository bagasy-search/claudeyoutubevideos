# valnacar_avcut.py — corta el mp4 de RunPod en las ventanas, midiendo el LAG POR VENTANA
# (correlación del audio del mp4 contra reel.wav en ese tramo) y conformando a 1920x1080 30/1 CFR sin audio.
# Uso: python _v3/valnacar_avcut.py <reel.mp4>
import json, subprocess, sys, os
import numpy as np
REEL = sys.argv[1]
W = '_work/valnacar/av'
win = json.load(open(f'{W}/windows_reel.json', encoding='utf-8'))
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip())
def pcm(f, ss=None, t=None):
    a = ['ffmpeg', '-v', 'error']
    if ss is not None: a += ['-ss', f'{ss:.3f}']
    a += ['-i', f]
    if t is not None: a += ['-t', f'{t:.3f}']
    a += ['-ac', '1', '-ar', '8000', '-f', 's16le', '-']
    return np.frombuffer(subprocess.check_output(a), dtype=np.int16).astype(np.float32)
R = dur(REEL); ref_all = pcm(f'{W}/reel.wav'); mp_all = pcm(REEL)
tot = sum(w['wdur'] for w in win)
print(f'mp4 {R:.2f} s · reel.wav {tot:.2f} s · diferencia {R - tot:+.2f} s')
if R < tot - 1.0:
    print('⛔ el mp4 vino CORTO: no corto nada'); sys.exit(2)
os.makedirs('public/avatar_clips/valnacar', exist_ok=True)
SR = 8000; lags = []
for w in win:
    off, d = w['off'], w['wdur']
    a = ref_all[int(off * SR): int((off + d) * SR)]
    best, bl = -1, 0.0
    for L in range(-int(0.6 * SR), int(0.6 * SR) + 1, 8):
        s0 = int(off * SR) + L
        if s0 < 0: continue
        b = mp_all[s0: s0 + len(a)]
        if len(b) < len(a) * 0.9: continue
        n = min(len(a), len(b)); aa, bb = a[:n], b[:n]
        c = float(np.dot(aa - aa.mean(), bb - bb.mean()) / (np.linalg.norm(aa - aa.mean()) * np.linalg.norm(bb - bb.mean()) + 1e-9))
        if c > best: best, bl = c, L / SR
    lags.append(bl)
    ss = max(0.0, off + bl)
    out = f"public/avatar_clips/valnacar/{w['name']}.mp4"
    subprocess.check_call(['ffmpeg', '-v', 'error', '-y', '-ss', f'{ss:.3f}', '-t', f'{d:.3f}', '-i', REEL, '-an',
        '-vf', f'scale=1936:1080,crop=1920:1080,fps=30,tpad=stop_mode=clone:stop_duration=1.0,trim=duration={d+0.6:.3f},setsar=1,format=yuv420p',
        '-c:v', 'libx264', '-crf', '19', '-preset', 'veryfast', '-r', '30', out])
    print(f"  {w['name']} off {off:7.2f} dur {d:5.2f} lag {bl*1000:+5.0f} ms corr {best:.2f} -> {dur(out):.2f}")
print(f'lag ms: min {min(lags)*1000:+.0f} max {max(lags)*1000:+.0f}')
