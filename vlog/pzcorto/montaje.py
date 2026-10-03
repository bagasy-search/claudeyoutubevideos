# montaje.py — formato NARRADOR: timeline = la voz; cada beat reparte su tramo entre sus visuales (foto real / gpt / clip agnes).
# Salidas: public/SLUG_fish.wav (mezcla) · src/SLUG/timeline.gen.ts · _SLUG_assets.txt · vlog/SLUG/global.json
import json, os, re, subprocess, sys, unicodedata
import numpy as np
SLUG = os.path.basename(os.path.dirname(os.path.abspath(__file__)))
R = os.getcwd().replace(chr(92), '/') + '/'; V = R + 'vlog/' + SLUG + '/'; PUB = R + 'public/'; FPS, SR = 30, 48000
B = json.load(open(V + 'beats.json', encoding='utf8')); TR = {t['beat']: t for t in json.load(open(V + 'tramos.json', encoding='utf8'))}
ASR = json.load(open(R + 'out/' + SLUG + '/asr.json', encoding='utf8'))['voz']; DIR = json.load(open(V + 'director.json', encoding='utf8'))

def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn'); return re.sub(r'[^a-z0-9ñ]', '', w)
NUM = {'1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco', '6': 'seis', '10': 'diez', 'una': 'uno', 'un': 'uno'}
def load(f, ss=0.0, t=None):
    a = ['ffmpeg', '-v', 'error', '-ss', '%.3f' % ss, '-i', f] + (['-t', '%.3f' % t] if t is not None else [])
    return np.frombuffer(subprocess.run(a + ['-vn', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout, np.int16).astype(np.float32) / 32768
def rms_db(x): return 20 * np.log10(np.sqrt((x ** 2).mean() + 1e-12))
def fade(x, a=0.01, b=0.03):
    na, nb = int(SR * a), int(SR * b); x = x.copy()
    if len(x) > na + nb: x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb)
    return x

G = {}; segs = []; ORG = [[35, 50], [62, 45], [48, 38], [55, 60], [40, 42]]; k = 0
for b in B:
    t = TR[b['id']]; start, L = t['start'], t['len']; G[b['id']] = {'start': start, 'd': L}
    n = len(b['visuals']); early = start < 60
    for i, v in enumerate(b['visuals']):
        name = '%s_%d' % (b['id'], i); s0 = start + L * i / n; d = L / n
        clip = 'public/%s/clips/%s.mp4' % (SLUG, name)
        if v['k'] == 'A' and os.path.exists(R + clip): src = '%s/clips/%s.mp4' % (SLUG, name); cam = {'push': [1.0, 1.04]}
        else:
            src = '%s/img/%s.jpg' % (SLUG, name)
            if not os.path.exists(R + 'public/' + src): print('FALTA', src); sys.exit(2)
            cam = {'push': [1.0, 1.10 + 0.03 * (k % 3)] if k % 2 == 0 else [1.12, 1.0], 'origin': ORG[k % 5]}
        if i == 0 and k > 0 and not early: cam['whipIn'] = 5; cam['whipDir'] = 1 if k % 2 == 0 else -1
        fr0 = round(s0 * FPS); fr1 = round((s0 + d) * FPS)
        segs.append({'key': name, 'src': src, 'from': fr0, 'dur': max(2, fr1 - fr0), 'startFrom': 0, 'cam': cam}); k += 1
TOTAL = max(g['start'] + g['d'] for g in G.values()) + float(DIR.get('tail', 0)); TOTAL_FR = round(TOTAL * FPS)
segs[-1]['dur'] = TOTAL_FR - segs[-1]['from']

def word_time(bid, word=None, nth=0):
    g = G[bid]
    if not word: return g['start']
    tr = TR[bid]; s0 = tr['start']
    hits = [w['startMs'] / 1000 - s0 for w in ASR if s0 - 0.05 <= w['startMs'] / 1000 <= s0 + tr['len'] and NUM.get(norm(w['text']), norm(w['text'])) == NUM.get(norm(word), norm(word))]
    if len(hits) <= nth: print('AVISO palabra "%s" no esta en %s' % (word, bid)); return g['start']
    return g['start'] + max(0, hits[nth])

overlays = []; sfx = []
for i, o in enumerate(DIR['overlays']):
    t0 = word_time(o['beat'], o.get('word'), o.get('nth', 0)) + o.get('off', 0)
    t1 = (G[o['until']]['start'] + G[o['until']]['d'] + o.get('until_off', 0)) if 'until' in o else t0 + o['dur']
    props = dict(o.get('props', {}))
    if o['kind'] == 'TdcTitleSlam':
        for w in props['words']:
            w['at'] = max(0, round((word_time(w.pop('beat'), w.pop('word'), w.pop('nth', 0)) - t0) * FPS)) if 'beat' in w else w.get('at', 0)
    fr0 = round(t0 * FPS); overlays.append({'key': 'o%d' % i, 'kind': o['kind'], 'from': fr0, 'dur': max(6, round(t1 * FPS) - fr0), 'props': props})
    for s in o.get('sfx', []): sfx.append({'t': t0 + s.get('off', 0), 'src': s['src'], 'db': s.get('db', -14)})
for sg in segs:   # whoosh suave en cada cambio de visual del minuto 1
    if 0 < sg['from'] < 58 * FPS: sfx.append({'t': sg['from'] / FPS - 0.04, 'src': 'sfx/sfx_whoosh_soft.mp3', 'db': -27})
json.dump({'G': [dict(id=k_, **v) for k_, v in G.items()], 'TOTAL': TOTAL}, open(V + 'global.json', 'w', encoding='utf8'), indent=1)
print('TOTAL %.1fs (%.2f min) visuales %d overlays %d sfx %d' % (TOTAL, TOTAL / 60, len(segs), len(overlays), len(sfx)))
if '--dry' in sys.argv: sys.exit(0)

N = int(TOTAL * SR) + SR; voz = np.zeros(N, np.float32); fx = np.zeros(N, np.float32)
x = load(R + 'out/%s/voz.wav' % SLUG); voz[:len(x)] = x[:N]; VREF = rms_db(x[np.abs(x) > 0.01])
for s in sfx:
    y = load(PUB + s['src']); i = int(max(0, s['t']) * SR); y = fade(y, 0.002, 0.05) * 10 ** ((VREF + 6 + s['db'] - max(rms_db(y), -40)) / 20); j = min(N, i + len(y)); fx[i:j] += y[:j - i]
mus = load(PUB + DIR['music']['src']); ML = len(mus); bed = np.zeros(N, np.float32); st = DIR['music'].get('start', 3.0); pos = int(st * SR); XF = SR * 2
while pos < N:
    sg = mus.copy(); sg[:XF] *= np.linspace(0, 1, XF); sg[-XF:] *= np.linspace(1, 0, XF); j = min(N, pos + ML); bed[pos:j] += sg[:j - pos]; pos += ML - XF
bed *= 10 ** ((VREF + DIR['music'].get('db', -22) - rms_db(mus)) / 20)
env = np.ones(N, np.float32); env[:int(st * SR)] = 0; e_end = int((TOTAL - 1.0) * SR); env[e_end:] = 0; env[e_end - SR * 3:e_end] = np.minimum(env[e_end - SR * 3:e_end], np.linspace(1, 0, SR * 3))
amb_f = DIR.get('amb'); ab = np.zeros(N, np.float32); aenv = np.zeros(N, np.float32)
if amb_f:
    amb = fade(load(PUB + amb_f), 0.25, 0.25); pos = 0
    while pos < min(N, int(66 * SR)): j = min(N, pos + len(amb)); ab[pos:j] += amb[:j - pos]; pos += len(amb) - int(0.25 * SR)
    ab *= 10 ** ((VREF - 12 - rms_db(amb)) / 20); a0, a1 = int(58 * SR), int(64 * SR); aenv[:a0] = 1; aenv[a0:a1] = np.linspace(1, 0, a1 - a0)
mix = voz + fx + bed * env + ab * aenv; mix = mix / max(np.abs(mix).max(), 1e-6) * 0.89
tmp = R + 'out/%s/mix_raw.wav' % SLUG
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', tmp], input=(mix[:int(TOTAL * SR)] * 32767).astype(np.int16).tobytes(), check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '2', PUB + SLUG + '_fish.wav'], check=True)
os.makedirs(R + 'src/' + SLUG, exist_ok=True)
data = {'segs': segs, 'overlays': overlays, 'audio': SLUG + '_fish.wav'}
open(R + 'src/%s/timeline.gen.ts' % SLUG, 'w', encoding='utf8').write('// GENERADO por vlog/%s/montaje.py\nimport type { VlogData } from "../tdc/TdcVlogMain";\nexport const TOTAL_FRAMES_%s = %d;\nexport const DATA_%s: VlogData = %s;\n' % (SLUG, SLUG.upper(), TOTAL_FR, SLUG.upper(), json.dumps(data, ensure_ascii=False)))
assets = sorted({s['src'] for s in segs}); assets.append('sfx') if False else None
open(R + '_%s_assets.txt' % SLUG, 'w', encoding='utf8').write('\n'.join(assets) + '\n')
print('OK frames', TOTAL_FR, 'assets', len(assets))
