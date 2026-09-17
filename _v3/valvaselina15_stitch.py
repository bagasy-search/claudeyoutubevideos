# valvaselina15_stitch.py — concat LOCAL de los chunks del farm + audio de chunks (trae SFX) recortado cuadro a cuadro,
# re-encode de ENTREGA (PTS rehechos, bt709 tv, audio estéreo 48k) y medición de sync contra el máster.
# Uso: python _v3/valvaselina15_stitch.py   (chunks ya bajados en D:/rtmp/vvs_entrega/chunks)
import subprocess, glob, json, os, re, numpy as np, sys
W = 'D:/rtmp/vvs_entrega'; C = f'{W}/chunks'
FR = 45550; FPS = 30
def run(a, **k): return subprocess.run(a, capture_output=True, text=True, **k)
def frames(f): return int(run(['ffprobe', '-v', 'error', '-select_streams', 'v', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f]).stdout.strip().split(',')[0])
L = sorted(glob.glob(f'{C}/chunk_*.mp4'), key=lambda f: int(re.findall(r'(\d+)', os.path.basename(f))[0]))
tot = 0; parts = []
for f in L:
    n = frames(f); tot += n; parts.append((f, n))
print(f'chunks {len(L)} · cuadros {tot} (esperado {FR})')
if tot != FR: print('⛔ cuadros no coinciden'); sys.exit(2)
# video: concat copy
open(f'{W}/list.txt', 'w').write('\n'.join(f"file '{os.path.abspath(f)}'" for f, _ in parts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{W}/list.txt', '-map', '0:v', '-c', 'copy', f'{W}/video.mp4'], check=True)
# audio: cada chunk decodificado y recortado EXACTO a sus cuadros
aparts = []
for k, (f, n) in enumerate(parts):
    o = f'{W}/a{k:03d}.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-vn', '-af', f'aresample=48000,atrim=start_sample=2064,asetpts=N/SR/TB,apad,atrim=end_sample={round(n / FPS * 48000)}', '-ac', '2', '-c:a', 'pcm_s16le', o], check=True)
    aparts.append(o)
open(f'{W}/alist.txt', 'w').write('\n'.join(f"file '{os.path.abspath(a)}'" for a in aparts))
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', f'{W}/alist.txt', '-c', 'copy', f'{W}/audio.wav'], check=True)
# sync contra el máster (voz) en 6 puntos
def pcm(src, ss, t):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(ss), '-t', str(t), '-i', src, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(r, dtype=np.int16).astype(np.float32)
res = []
for t in [20, 300, 600, 900, 1200, 1480]:
    a = pcm(f'{W}/audio.wav', t, 8); m = pcm('public/valvaselina15.wav', t - 0.5, 9)
    a -= a.mean(); m -= m.mean()
    c = np.correlate(m, a, mode='valid'); k = int(np.argmax(c))
    res.append(round(0.5 - k / 8000, 3))
print('desfase audio_chunks vs máster (s, + = chunks atrasado):', res)
if max(abs(x) for x in res) > 0.045: print('⛔ desfase > 45 ms')
json.dump(res, open(f'{W}/sync.json', 'w'))
