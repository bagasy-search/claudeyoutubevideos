# mix.py: voz (con 1 s de pausa en cada título) + camas con el audio real de los clips (sin habla ni música) + SFX → <S>_mix.wav a −14 LUFS
import json, os, subprocess as sp, re
import numpy as np
S = os.environ['S']; C = json.load(open('cues.json')); FPS = C['FPS']; T = C['TOTAL'] / FPS
def run(a): return sp.run(a, capture_output=True, text=True)
# 1) voz con pausas de 1 s antes de cada título
gaps = C['gaps']; segs = []; t0 = 0.0
for g in gaps: segs.append((t0, g)); t0 = g
segs.append((t0, None))
fc = []; parts = []
for i, (a, b) in enumerate(segs):
    fc.append(f"[0:a]atrim=start={a:.3f}" + (f":end={b:.3f}" if b else '') + f",asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo[s{i}]")
    parts.append(f'[s{i}]')
    if i < len(segs) - 1:
        fc.append(f"anullsrc=r=48000:cl=stereo,atrim=duration=1.0[z{i}]"); parts.append(f'[z{i}]')
fc.append(''.join(parts) + f"concat=n={len(parts)}:v=0:a=1[o]")
open('fv.txt', 'w').write(';'.join(fc))
sp.run(['ffmpeg', '-v', 'error', '-y', '-i', f'{S}_voz.wav', '-/filter_complex', 'fv.txt', '-map', '[o]', '-ar', '48000', 'voz_gap.wav'], check=True)
# 2) audio de cada clip: sin palabras (whisper tiny) y con aspecto de ruido de cocina (no música)
from faster_whisper import WhisperModel
import librosa
wm = WhisperModel('tiny.en', device='cpu', compute_type='int8')
cache = {}
def apto(f):
    if f in cache: return cache[f]
    w = f[:-4] + '.wav'
    run(['ffmpeg', '-v', 'error', '-y', '-i', f, '-vn', '-ac', '1', '-ar', '16000', w])
    if not os.path.exists(w): cache[f] = None; return None
    y, sr = librosa.load(w, sr=16000)
    if len(y) < sr or float(np.sqrt(np.mean(y ** 2))) < 1e-4: cache[f] = None; return None
    sg, _ = wm.transcribe(w, vad_filter=True, language='en'); txt = ' '.join(s.text for s in sg).strip()
    words = len(re.findall(r'[a-zA-Z]{2,}', txt))
    H, P = librosa.effects.hpss(y); hr = float(np.sum(H ** 2) / (np.sum(P ** 2) + np.sum(H ** 2) + 1e-9))
    fl = float(np.mean(librosa.feature.spectral_flatness(y=y)))
    cache[f] = dict(ok=(words == 0 and hr < 0.75 and fl > 0.004), words=words, hr=round(hr, 3), fl=round(fl, 4)); return cache[f]
beds = []
for s in C['SHOTS']:
    if s['k'] not in ('Y', 'V') or not s.get('src'): continue
    pieces = [(s['src'], s.get('at') or 0, (s['cut'] if s.get('src2') else s['dur']) / FPS, s['from'])]
    if s.get('src2'): pieces.append((s['src2'], s.get('at2') or 0, (s['dur'] - s['cut']) / FPS, s['from'] + s['cut']))
    for src, at, d, fr in pieces:
        f = 'pub/' + src
        if not os.path.exists(f): continue
        a = apto(f)
        if a and a['ok']: beds.append((f, at, d, fr))
json.dump(cache, open('out/clip_audio.json', 'w'))
print('camas aptas', len(beds), 'de', sum(1 for s in C['SHOTS'] if s['k'] in ('Y', 'V')))
# 3) voz + camas (−38 dB de media, picos ≤ −22) + SFX + tono de sala muy bajo
ins = ['-i', 'voz_gap.wav']; fc = ['[0:a]aformat=sample_rates=48000:channel_layouts=stereo[v]']; lab = ['[v]']; n = 1
for f, at, d, fr in beds:
    e = run(['ffmpeg', '-hide_banner', '-ss', f'{at:.2f}', '-t', f'{d:.2f}', '-i', f, '-af', 'volumedetect', '-f', 'null', '-']).stderr
    mean = float((re.search(r'mean_volume: (-?[\d.]+)', e) or [0, -91])[1]); mx = float((re.search(r'max_volume: (-?[\d.]+)', e) or [0, 0])[1])
    if mean < -70: continue
    g = min(14, -38 - mean, -22 - mx); ms = round(fr / FPS * 1000)
    ins += ['-ss', f'{at:.2f}', '-t', f'{d + 0.25:.2f}', '-i', f]
    fc.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={g:.1f}dB,afade=t=in:d=0.25,afade=t=out:st={max(0, d - 0.1):.2f}:d=0.35,adelay={ms}|{ms}[b{n}]"); lab.append(f'[b{n}]'); n += 1
for x in C['SFX']:
    p = 'pub/' + x['src']
    if not os.path.exists(p): print('falta sfx', p); continue
    ms = round(x['from'] / FPS * 1000); ins += ['-i', p]
    fc.append(f"[{n}:a]aformat=sample_rates=48000:channel_layouts=stereo,volume={x['vol']},adelay={ms}|{ms}[s{n}]"); lab.append(f'[s{n}]'); n += 1
fc.append(f"anoisesrc=r=48000:c=brown:a=0.0035:d={T:.3f},aformat=channel_layouts=stereo,lowpass=f=900[rt]"); lab.append('[rt]')
fc.append(''.join(lab) + f"amix=inputs={len(lab)}:normalize=0:dropout_transition=0,apad=whole_dur={T:.3f}[m]")
open('fc.txt', 'w').write(';'.join(fc))
sp.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-/filter_complex', 'fc.txt', '-map', '[m]', '-t', f'{T:.3f}', '-ar', '48000', '-c:a', 'pcm_s16le', 'pre.wav'], check=True)
# 4) loudnorm en dos pasadas: −14 LUFS, pico −1,5
e = run(['ffmpeg', '-hide_banner', '-i', 'pre.wav', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']).stderr
m = json.loads(e[e.rindex('{'):e.rindex('}') + 1])
af = f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true"
sp.run(['ffmpeg', '-v', 'error', '-y', '-i', 'pre.wav', '-af', af, '-ar', '48000', '-c:a', 'pcm_s16le', f'out/{S}_mix.wav'], check=True)
print('camas', len(beds), '· sfx', len(C['SFX']), '· total', round(T, 2))
