# mix.py: audio final en la nube. Fase A (sin voz_ids.json): extrae el audio de cada clip Veo que entra al montaje y arma all.mp3 para el ASR.
# Fase B (con voz_ids.json): camas (-40 dB de media, picos a -20) + voz/piano + SFX en su cuadro exacto -> <slug>_mix.wav a -14 LUFS.
import json, subprocess, os, re, sys
S = 'mabel01'; FPS = 30
C = json.load(open('cues.json')); SHOTS, SFX, TOTAL = C['SHOTS'], C['SFX'], C['TOTAL']; DUR = TOTAL / FPS
ff = lambda a: subprocess.run(['ffmpeg', '-v', 'error', '-y'] + a, capture_output=True, text=True)
os.makedirs('beds', exist_ok=True)
vs = [s for s in SHOTS if s.get('veo') and not s.get('album')]
beds = []; acc = 0.0
for s in vs:
    src = 'public/' + s['veo']
    if not os.path.exists(src): print('falta', src); continue
    d = min(s['dur'] / FPS, s['veoDur']); f = f"beds/b{s['id']}.wav"
    ff(['-i', src, '-t', f'{d:.3f}', '-vn', '-ac', '2', '-ar', '48000', f])
    if not os.path.exists(f): continue
    e = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'volumedetect', '-f', 'null', '-'], capture_output=True, text=True).stderr
    mean = float((re.search(r'mean_volume: (-?[\d.]+)', e) or [0, -91])[1]); mx = float((re.search(r'max_volume: (-?[\d.]+)', e) or [0, 0])[1])
    beds.append({'id': s['id'], 'f': f, 'from': s['from'], 'd': round(d, 3), 'mean': mean, 'max': mx, 'at': round(acc, 3)}); acc += d + 1.5
print('camas candidatas', len(beds), 'de', len(vs), 'planos con Veo')
if not os.path.exists('voz_ids.json'):
    ff(['-f', 'lavfi', '-i', 'anullsrc=r=16000:cl=mono', '-t', '1.5', 'beds/sil.wav'])
    L = []
    for b in beds:
        m = b['f'].replace('.wav', '_m.wav'); ff(['-i', b['f'], '-ac', '1', '-ar', '16000', m]); L += [f"file '{os.path.abspath(m)}'", f"file '{os.path.abspath('beds/sil.wav')}'"]
    open('beds/cat.txt', 'w').write('\n'.join(L))
    r = ff(['-f', 'concat', '-safe', '0', '-i', 'beds/cat.txt', '-c:a', 'libmp3lame', '-b:a', '48k', f'out/{S}_beds_all.mp3'])
    json.dump(beds, open(f'out/{S}_beds.json', 'w')); print('fase A lista: all.mp3', round(acc, 1), 's'); sys.exit(0)
voz = set(json.load(open('voz_ids.json')))
ok = [b for b in beds if b['id'] not in voz and b['mean'] > -70]
ins = ['-i', f'{S}.wav']; fc = []
for i, b in enumerate(ok):
    ins += ['-i', b['f']]; g = min(12, -40 - b['mean'], -20 - b['max']); ms = round(b['from'] / FPS * 1000)
    fc.append(f"[{i+1}:a]volume={g:.1f}dB,afade=t=in:d=0.3,afade=t=out:st={max(0, b['d'] - 0.35):.2f}:d=0.35,adelay={ms}|{ms}[b{i}]")
n0 = len(ok) + 1
for i, x in enumerate(SFX):
    ins += ['-i', 'public/' + x['src']]; ms = round(x['from'] / FPS * 1000)
    fc.append(f"[{n0+i}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={x['vol']},adelay={ms}|{ms}[s{i}]")
fc.append('[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v]')
fc.append('[v]' + ''.join(f'[b{i}]' for i in range(len(ok))) + ''.join(f'[s{i}]' for i in range(len(SFX))) + f'amix=inputs={1 + len(ok) + len(SFX)}:normalize=0:dropout_transition=0,apad=whole_dur={DUR:.3f}[o]')
open('fc.txt', 'w').write(';'.join(fc))
r = ff(ins + ['-filter_complex_script', 'fc.txt', '-map', '[o]', '-t', f'{DUR:.3f}', '-ar', '48000', '-c:a', 'pcm_s24le', 'pre.wav'])
if r.returncode: print(r.stderr[-1500:]); sys.exit(1)
# -14 LUFS con ganancia lineal y techo de pico real -1,5 dB (limitador suave sólo si hace falta)
import soundfile as sf, pyloudnorm as pyln, numpy as np
from scipy.signal import resample_poly
x, sr = sf.read('pre.wav', dtype='float32'); m = pyln.Meter(sr); L0 = m.integrated_loudness(x); x *= 10 ** ((-14 - L0) / 20)
tp = 20 * np.log10(np.abs(resample_poly(x, 4, 1, axis=0)).max())
if tp > -1.5:
    from scipy.ndimage import minimum_filter1d, uniform_filter1d
    thr = 10 ** (-1.7 / 20); need = np.minimum(1, thr / np.maximum(np.abs(x).max(1), 1e-9)); need = uniform_filter1d(minimum_filter1d(need, int(.06 * sr)), int(.02 * sr)); x *= need[:, None]
    tp = 20 * np.log10(np.abs(resample_poly(x, 4, 1, axis=0)).max())
sf.write(f'{S}_mix.wav', x, sr, subtype='PCM_16')
res = {'dur': round(len(x) / sr, 3), 'lufs': round(float(m.integrated_loudness(x)), 2), 'tp': round(float(tp), 2), 'camas': len(ok), 'camas_con_voz': len(voz), 'camas_mudas': sum(b['mean'] <= -70 for b in beds), 'sfx': len(SFX), 'lufs_antes': round(float(L0), 2)}
json.dump(res, open('out/mix.json', 'w')); print(res)
