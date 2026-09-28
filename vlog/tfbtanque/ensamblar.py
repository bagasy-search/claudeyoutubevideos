# Ensambla el video base del vlog: concatena los mp4 de cada escena (armar) y el hueco de la lámina en UN mp4 30 fps CFR,
# arma la pista de VOZ global (tramos del máster + audio propio del vecino/foley F) y el mapa global de palabras y clips.
# Salidas: public/tfbtanque_vlog.mp4 · out/tfbtanque/voz_global.wav · vlog/tfbtanque/global.json
# uso: python vlog/tfbtanque/ensamblar.py
import json, os, subprocess, re, unicodedata
import numpy as np, soundfile as sf
R = 'D:/Proyectos/video2-wt/tfbtanque/'
order = json.load(open(R + 'vlog/tfbtanque/order.json', encoding='utf8'))
T = {t['id']: t for t in json.load(open(R + 'vlog/tfbtanque/tramos.json', encoding='utf8'))}
caps = json.load(open(R + 'public/captions_tfbtanque.json', encoding='utf8'))
FPS = 30; SR = 48000
TMP = R + 'out/tfbtanque/_ens/'; os.makedirs(TMP, exist_ok=True)
def run(*a): subprocess.run(a, check=True, capture_output=True, creationflags=0x08000000)
def nframes(f): return int(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', f], capture_output=True, text=True, creationflags=0x08000000).stdout.strip().split(',')[0])
def load(f):
    x, sr = sf.read(f, dtype='float32', always_2d=True); x = x.mean(1)
    if sr != SR: x = np.interp(np.arange(0, len(x) * SR / sr) * sr / SR, np.arange(len(x)), x).astype('float32')
    return x
vparts, apar, clips, words, segs = [], [], [], [], []
F0 = 0
PARCIAL = os.environ.get('PARCIAL') == '1'   # prueba: escenas sin armar van como hueco negro con su voz
for o in order:
    if o['type'] == 'scene' and PARCIAL and not os.path.exists(o['out']):
        P = json.load(open(o['plan'], encoding='utf8'))
        o = {'seg': o['seg'], 'type': 'hueco', 'tramos': [{'id': c['id'], 'audio': c['audio'], 'len': T[c['id']]['len']} for c in P['clips'] if c.get('audio')]}
    if o['type'] == 'scene':
        mp4 = o['out']; tl = json.load(open(os.path.dirname(mp4) + '/timeline_' + os.path.basename(mp4).replace('.mp4', '.json'), encoding='utf8'))
        nf = nframes(mp4); v = TMP + o['seg'] + '_v.mp4'; run('ffmpeg', '-v', 'error', '-y', '-i', mp4, '-an', '-c:v', 'copy', v)
        a = load(os.path.dirname(mp4) + '/audio_' + os.path.basename(mp4).replace('.mp4', '.wav'))
        for c in tl:
            g = {**c, 'seg': o['seg'], 'gstart': F0 / FPS + c['start'], 'gvstart': F0 / FPS + c['vstart'], 'dir': os.path.dirname(mp4) + '/clips/'}
            clips.append(g)
            t = T.get(c['id'])
            if t and 'a' in t and c.get('mode') != 'own':
                for w in caps:
                    ws = w['startMs'] / 1000
                    if t['a'] - 0.02 <= ws < t['b']: words.append({'w': w['text'].strip(), 't': round(g['gstart'] + ws - t['a'], 3), 'e': round(g['gstart'] + w['endMs'] / 1000 - t['a'], 3), 'id': c['id']})
            elif t and t['type'] == 'V':
                words.append({'w': '[V] ' + t['text'], 't': round(g['gstart'], 3), 'e': round(g['gstart'] + c['dur'], 3), 'id': c['id']})
    else:  # lámina: audio de sus tramos, video negro
        a = np.concatenate([load(t['audio']) for t in o['tramos']]); nf = int(round(len(a) / SR * FPS))
        a = np.pad(a, (0, max(0, int(nf / FPS * SR) - len(a))))[:int(nf / FPS * SR)]
        v = TMP + o['seg'] + '_v.mp4'
        run('ffmpeg', '-v', 'error', '-y', '-f', 'lavfi', '-i', f'color=c=0x1a1410:s=1920x1080:r=30', '-frames:v', str(nf), '-c:v', 'libx264', '-crf', '18', '-preset', 'veryfast', '-pix_fmt', 'yuv420p', v)
        acc = 0.0
        for t in o['tramos']:
            for w in caps:
                ws = w['startMs'] / 1000; tt = T[t['id']]
                if tt['a'] - 0.02 <= ws < tt['b']: words.append({'w': w['text'].strip(), 't': round(F0 / FPS + acc + ws - tt['a'], 3), 'e': round(F0 / FPS + acc + w['endMs'] / 1000 - tt['a'], 3), 'id': t['id']})
            acc += t['len']
    a = np.pad(a, (0, max(0, int(round(nf / FPS * SR)) - len(a))))[:int(round(nf / FPS * SR))]
    segs.append({'seg': o['seg'], 'type': o['type'], 'f0': F0, 'nf': nf}); vparts.append(v); apar.append(a); F0 += nf
OUTV = R + 'public/tfbtanque_vlog.mp4'
# concat por FILTRO (el demuxer concat perdía ~5 % de cuadros al mezclar fuentes de encoders distintos)
ins = sum([['-i', p] for p in vparts], [])
graph = ''.join(f'[{i}:v]setpts=PTS-STARTPTS,fps=30[v{i}];' for i in range(len(vparts))) + ''.join(f'[v{i}]' for i in range(len(vparts))) + f'concat=n={len(vparts)}:v=1:a=0[out]'
open(TMP + 'graph.txt', 'w').write(graph)
run('ffmpeg', '-v', 'error', '-y', *ins, '-/filter_complex', TMP + 'graph.txt', '-map', '[out]', '-an', '-r', '30', '-fps_mode', 'cfr', '-c:v', 'libx264', '-crf', '20', '-preset', 'veryfast',
    '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv', '-g', '30', OUTV)
voz = np.concatenate(apar); sf.write(R + 'out/tfbtanque/voz_global.wav', voz, SR, subtype='PCM_16')
nf = nframes(OUTV)
json.dump({'frames': F0, 'segs': segs, 'clips': clips, 'words': words}, open(R + 'vlog/tfbtanque/global.json', 'w', encoding='utf8'), ensure_ascii=False, indent=0)
print(f'video {nf} cuadros (esperado {F0}) {"✓" if nf == F0 else "⛔ NO COINCIDEN"} · voz {len(voz) / SR:.2f}s · {F0 / FPS:.2f}s · palabras {len(words)} · clips {len(clips)}')
