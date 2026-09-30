# montaje.py — arma el video ENTERO desde los mp4 por escena (agnes_vlog `armar`) en el orden GLOBAL del guion:
#   · base: cada beat hablado = su tramo del mp4 de su escena, en el segundo de la voz (cadena continua → cortes de escena
#     donde el guion salta de lugar); insertos encima del beat que los hospeda (la voz sigue).
#   · audio: voz máster (tramos) + audio propio del vecino / detalles mudos + foley de detalles e insertos + cama + SFX,
#     mezclado acá (numpy) y MEDIDO antes de rendear (silencios del minuto 1).
#   · overlays: director.json (componentes de src/tfb anclados a PALABRAS por ASR).
# Salidas: public/tfbpintura/mix.wav · public/tfbpintura/vlog_<P>.mp4 (recomprimidos) · src/tfbpintura/timeline.gen.ts ·
#          @_tfbpintura_assets.txt · vlog/tfbpintura/global.json
import json, os, re, subprocess, sys, unicodedata
import numpy as np
R = 'D:/Proyectos/video2-wt/tfbpintura/'
V, OUTV, PUB = R + 'vlog/tfbpintura/', R + 'out/vlog/', R + 'public/'
FPS, SR = 30, 48000
B = json.load(open(V + 'beats.json', encoding='utf8'))
BY = {b['id']: b for b in B}
TR = {t['beat']: t for t in json.load(open(V + 'tramos.json', encoding='utf8'))}
ASR = json.load(open(R + 'out/tfbpintura/asr.json', encoding='utf8'))['voz']
DIR = json.load(open(V + 'director.json', encoding='utf8'))
ORDER_MOVE = {'b040': 'b048', 'b041': 'b040'}   # la "cuarta pregunta" va después de la tercera
DRY = '--dry' in sys.argv

def sh(*a): return subprocess.run(a, check=True, capture_output=True)
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).decode().strip())
def load(f, ss=0.0, t=None):
    a = ['ffmpeg', '-v', 'error', '-ss', f'{ss:.3f}', '-i', f]
    if t is not None: a += ['-t', f'{t:.3f}']
    b = subprocess.run(a + ['-vn', '-ac', '1', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.int16).astype(np.float32) / 32768
def rms_db(x): return 20 * np.log10(np.sqrt((x ** 2).mean() + 1e-12))
def norm(w):
    w = unicodedata.normalize('NFD', w.lower()); w = ''.join(c for c in w if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9ñ]', '', w)

# ---------- orden global ----------
seq = [b for b in B if b['type'] not in ('I',) and not b.get('skip')]
for mv, after in ORDER_MOVE.items():
    x = next(b for b in seq if b['id'] == mv); seq.remove(x); i = next(i for i, b in enumerate(seq) if b['id'] == after); seq.insert(i + 1, x)
TL = {}
for P in sorted({b['scene'] for b in B if b['scene'] != 'LAM'}):
    f = OUTV + P + f'/timeline_vlog_{P}.json'
    if os.path.exists(f):
        for c in json.load(open(f, encoding='utf8')): TL[c['id']] = {**c, 'P': P}
miss = [b['id'] for b in seq if b['type'] != 'L' and b['id'] not in TL]
if miss: print('⛔ faltan en los timelines de armar:', ' '.join(miss)); sys.exit(2)

def own_len(c):  # audio propio: cortar al final real de la voz/sonido (+0,2 s)
    x = load(OUTV + c['P'] + '/clips/' + c['file'], 0, c['T'])
    n = int(SR * 0.01); m = len(x) // n; e = 20 * np.log10(np.sqrt((x[:m * n].reshape(m, n) ** 2).mean(1) + 1e-12))
    th = e.max() - 30; idx = np.where(e > th)[0]
    return min(c['T'], (idx[-1] + 1) * 0.01 + 0.2) if len(idx) else c['T']

G = []; t = 0.0
for b in seq:
    if b['type'] == 'L': d = TR[b['id']]['len']; G.append({'id': b['id'], 'type': 'L', 'start': t, 'd': d}); t += d; continue
    c = TL[b['id']]
    if b['type'] == 'V': d = own_len(c)
    elif b['type'] == 'DX': d = 3.0 if b['id'] == 'b001' else c['T']
    else: d = c['dur']
    G.append({'id': b['id'], 'type': b['type'], 'P': c['P'], 'start': t, 'd': d, 'vstart': c['vstart'], 'file': c['file'], 'own': b['type'] in ('V', 'DX')}); t += d
TOTAL = t
gi = {g['id']: g for g in G}
# insertos
INS = []
# covers: beats cuyo clip no da labios tras 3+ tomas -> se TAPAN enteros con insertos (la voz sigue)
COV = DIR.get('covers', {}); USED = {i for v in COV.values() for i in v}
for host, ids in COV.items():
    h = gi[host]; t = h['start']; end = h['start'] + h['d']
    for k, iid in enumerate(ids):
        c = TL[iid]; room = c['vdur'] - 0.45; rest = end - t
        d = rest if k == len(ids) - 1 else min(room, rest / (len(ids) - k))
        d = min(d, room)
        if d <= 0.3: break
        INS.append({'id': iid, 'P': c['P'], 'start': t, 'd': d, 'vstart': c['vstart'] + 0.4, 'file': c['file'], 'host': host, 'cover': True}); t += d
    if end - t > 0.05: print(f'⚠ cover {host}: quedan {end - t:.2f}s del clip original a la vista')
for b in B:
    if b['type'] != 'I' or b['id'] not in TL or b['id'] in USED: continue
    h = gi.get(b['host'])
    if not h: continue
    c = TL[b['id']]; L = min(2.2, max(1.4, h['d'] * 0.45))
    s = h['start'] + max(0.25, min(h['d'] * 0.3, h['d'] - L - 0.2)) if h['d'] > L + 0.45 else h['start'] + 0.25
    INS.append({'id': b['id'], 'P': c['P'], 'start': s, 'd': L, 'vstart': c['vstart'] + 0.4, 'file': c['file'], 'host': b['host']})
INS.sort(key=lambda x: x['start'])
for a, b2 in zip(INS, INS[1:]):
    if a.get('cover') and b2.get('cover'): continue
    if b2['start'] < a['start'] + a['d'] + 0.3: a['d'] = max(0.8, b2['start'] - a['start'] - 0.3)

# ---------- palabras con tiempo GLOBAL (para anclar overlays) ----------
NUM = {'1': 'uno', '2': 'dos', '3': 'tres', '4': 'cuatro', '5': 'cinco', '6': 'seis', '10': 'diez', 'una': 'uno', 'un': 'uno'}
def word_time(bid, word=None, nth=0):
    g = gi[bid]
    if not word: return g['start']
    tr = TR[bid]; s0 = tr['start']; hits = []
    for w in ASR:
        ws = w['startMs'] / 1000
        if s0 - 0.05 <= ws <= s0 + tr['len'] and NUM.get(norm(w['text']), norm(w['text'])) == NUM.get(norm(word), norm(word)): hits.append(ws - s0)
    if len(hits) <= nth: print(f'⚠ palabra "{word}" no está en {bid}; uso el inicio'); return g['start']
    return g['start'] + max(0, hits[nth])

# ---------- video: segs ----------
segs = []
for g in G:
    if g['type'] == 'L': continue
    fr0, fr1 = round(g['start'] * FPS), round((g['start'] + g['d']) * FPS)
    segs.append({'key': g['id'], 'src': f'tfbpintura/vlog_{g["P"]}.mp4', 'from': fr0, 'dur': fr1 - fr0, 'startFrom': round(g['vstart'] * FPS)})
for g in INS:
    fr0, fr1 = round(g['start'] * FPS), round((g['start'] + g['d']) * FPS)
    segs.append({'key': g['id'], 'src': f'tfbpintura/vlog_{g["P"]}.mp4', 'from': fr0, 'dur': fr1 - fr0, 'startFrom': round(g['vstart'] * FPS)})
# cámara / ritmo por director
for cm in DIR.get('cam', []):
    for s in segs:
        if s['key'] == cm['id']: s['cam'] = cm['cam']; s.update({k: v for k, v in cm.items() if k in ('rate', 'freezeAt')})
# cámara lenta de insertos marcados (se estira el clip; no pasa de su largo)
overlays = []; sfx = []
for i, o in enumerate(DIR['overlays']):
    t0 = word_time(o['beat'], o.get('word'), o.get('nth', 0)) + o.get('off', 0)
    if 'until' in o: t1 = gi[o['until']]['start'] + gi[o['until']]['d'] + o.get('until_off', 0)
    elif 'untilWord' in o: t1 = word_time(o['untilBeat'], o['untilWord']) + o.get('until_off', 0)
    else: t1 = t0 + o['dur']
    props = dict(o.get('props', {}))
    # 'at' de ítems en segundos-desde-palabra → cuadros relativos
    if o['kind'] == 'TfbBucketRecipe':
        for it in props['items']:
            it['at'] = max(0, round((word_time(it.pop('beat'), it.pop('word')) - t0) * FPS))
    if o['kind'] == 'TfbTitleSlam':
        for w in props['words']:
            w['at'] = max(0, round((word_time(w.pop('beat'), w.pop('word'), w.pop('nth', 0)) - t0) * FPS) if 'beat' in w else w.get('at', 0))
    if o['kind'] == 'TfbLamina':
        for p in props['puntos']: p['f'] = max(0, round((word_time(p.pop('beat'), p.pop('word')) - t0) * FPS)) if 'beat' in p else p['f']
        for m in props.get('marks', []): m['f'] = max(0, round((word_time(m.pop('beat'), m.pop('word')) - t0) * FPS)); m['dur'] = round(m['dur'] * FPS)
    fr0 = round(t0 * FPS); overlays.append({'key': f'o{i}', 'kind': o['kind'], 'from': fr0, 'dur': max(6, round(t1 * FPS) - fr0), 'props': props})
    for s in o.get('sfx', []): sfx.append({'t': t0 + s.get('off', 0), 'src': s['src'], 'db': s.get('db', -14)})
TOTAL_FR = round(TOTAL * FPS)
# minuto 1: toda frontera entre planos de la MISMA escena (toma continua = el detector no ve corte) lleva destello +
# golpe de cámara, así el gancho tiene ≥20 cortes medidos y ritmo de jump-cut
ss = sorted(segs, key=lambda x: x['from']); nfl = 0
for a, b2 in zip(ss, ss[1:]):
    if b2['from'] >= 62 * FPS: break
    if a['src'] == b2['src'] and a['from'] + a['dur'] == b2['from']:
        overlays.append({'key': f'fl{nfl}', 'kind': 'TfbFlash', 'from': b2['from'] - 1, 'dur': 5, 'props': {'peak': 0.8}}); nfl += 1
        cam = dict(b2.get('cam') or {}); cam['punches'] = (cam.get('punches') or []) + [{'at': 0, 'amount': 0.14}]; b2['cam'] = cam
        sfx.append({'t': b2['from'] / FPS - 0.05, 'src': 'sfx/cam_zoom_punch.mp3', 'db': -20})
print('destellos de jump-cut en el minuto 1:', nfl)

# ---------- SFX automáticos: whoosh en los cortes de escena del minuto 1, golpe en los insertos del gancho ----------
for a, b2 in zip(G, G[1:]):
    if b2['start'] < 62 and (b2.get('P') != a.get('P') or b2['type'] in ('D', 'DX') or a['type'] in ('D', 'DX')):
        sfx.append({'t': b2['start'] - 0.12, 'src': 'sfx/sfx_whoosh_soft.mp3', 'db': -17})
for g in INS:
    if g['start'] < 62: sfx.append({'t': g['start'] - 0.1, 'src': 'sfx/whoosh.mp3', 'db': -20})

json.dump({'G': G, 'INS': INS, 'TOTAL': TOTAL, 'sfx': sfx}, open(V + 'global.json', 'w', encoding='utf8'), indent=1)
print(f'TOTAL {TOTAL:.1f}s ({TOTAL/60:.2f} min) · beats {len(G)} · insertos {len(INS)} · overlays {len(overlays)} · sfx {len(sfx)}')
if DRY: sys.exit(0)

# ---------- audio ----------
N = int(TOTAL * SR) + SR
voz = np.zeros(N, np.float32); fol = np.zeros(N, np.float32); fx = np.zeros(N, np.float32)
VREF = None
def put(buf, x, t, gain=1.0):
    i = int(t * SR); j = min(N, i + len(x)); buf[i:j] += x[:j - i] * gain
def fade(x, a=0.01, b=0.03):
    na, nb = int(SR * a), int(SR * b); x = x.copy()
    if len(x) > na + nb: x[:na] *= np.linspace(0, 1, na); x[-nb:] *= np.linspace(1, 0, nb)
    return x
for g in G:
    if g['type'] in ('A', 'D', 'L'):
        x = load(TR[g['id']]['audio']); x = x[:int(g['d'] * SR)]; put(voz, fade(x, 0.003, 0.01), g['start'])
vl = [rms_db(load(TR[g['id']]['audio'])) for g in G[:40] if g['type'] == 'A']; VREF = float(np.median(vl))
for g in G:
    f = OUTV + g.get('P', '') + '/clips/' + g.get('file', '')
    if g['type'] == 'V':
        x = fade(load(f, 0, g['d'])); put(voz, x * 10 ** ((VREF - rms_db(x[np.abs(x) > 0.01]) if (np.abs(x) > 0.01).any() else 0) / 20), g['start'])
    elif g['type'] == 'DX':
        x = fade(load(f, 0, g['d']), 0.005, 0.2); put(fol, x * 10 ** ((VREF - 2 - rms_db(x)) / 20), g['start'])
    elif g['type'] == 'D':
        x = fade(load(f, 0, g['d']), 0.05, 0.2); put(fol, x * 10 ** ((VREF - 13 - rms_db(x)) / 20), g['start'])
for g in INS:
    x = fade(load(OUTV + g['P'] + '/clips/' + g['file'], 0.4, g['d']), 0.05, 0.15); put(fol, x * 10 ** ((VREF - 12 - rms_db(x)) / 20), g['start'])
for s in sfx:
    x = load(PUB + s['src']); put(fx, fade(x, 0.002, 0.05) * 10 ** ((VREF + 6 + s['db'] - max(rms_db(x), -40)) / 20), max(0, s['t']))
# cama: entra en el seg ~6, −22 dB bajo la voz, se baja en la lámina y sale al final
mus = load(PUB + DIR['music']['src']); ML = len(mus); bed = np.zeros(N, np.float32); pos = int(DIR['music'].get('start', 6.0) * SR); XF = int(SR * 2)
while pos < N:
    seg = mus.copy(); seg[:XF] *= np.linspace(0, 1, XF); seg[-XF:] *= np.linspace(1, 0, XF)
    j = min(N, pos + ML); bed[pos:j] += seg[:j - pos]; pos += ML - XF
bed *= 10 ** ((VREF + DIR['music'].get('db', -22) - rms_db(mus)) / 20)
env = np.ones(N, np.float32); ramp = int(SR * 1.5)
env[:int(DIR['music'].get('start', 6.0) * SR)] = 0
e_end = int((TOTAL - 1.0) * SR); env[e_end:] = 0; env[e_end - ramp * 2:e_end] = np.minimum(env[e_end - ramp * 2:e_end], np.linspace(1, 0, ramp * 2))
# ambiente parejo del patio en el minuto 1 (compuerta: 0 silencios) — entra en 0, se va entre 60 y 64 s
amb = load(PUB + 'sfx/ra_ambient_day.mp3'); ab = np.zeros(N, np.float32); pos = 0
while pos < min(N, int(66 * SR)):
    j = min(N, pos + len(amb)); ab[pos:j] += amb[:j - pos]; pos += len(amb)
ab *= 10 ** ((VREF - 11 - rms_db(amb)) / 20)
aenv = np.zeros(N, np.float32); a0, a1 = int(60 * SR), int(64 * SR); aenv[:a0] = 1; aenv[a0:a1] = np.linspace(1, 0, a1 - a0)
mix = voz + fol + fx + bed * env + ab * aenv
peak = np.abs(mix).max(); mix = mix / max(peak, 1e-6) * 0.89
os.makedirs(PUB + 'tfbpintura', exist_ok=True)
tmp = R + 'out/tfbpintura/mix_raw.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 's16le', '-ar', str(SR), '-ac', '1', '-i', '-', tmp], input=(mix[:int(TOTAL * SR)] * 32767).astype(np.int16).tobytes(), check=True)
sh('ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-15:TP=-1.5:LRA=11', '-ar', '48000', '-ac', '2', PUB + 'tfbpintura_fish.wav')

# ---------- mp4 por escena → public (recomprimido) ----------
for P in sorted({g['P'] for g in G if g.get('P')} | {g['P'] for g in INS}):
    src, dst = OUTV + P + f'/vlog_{P}.mp4', PUB + f'tfbpintura/vlog_{P}.mp4'
    if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(src):
        # los clips salen ~15-20 % más oscuros que sus anclas: gamma por escena para igualar el brillo medio a las anclas
        def luma(f, ss=None):
            a = ['ffmpeg', '-v', 'error'] + (['-ss', str(ss)] if ss is not None else []) + ['-i', f, '-frames:v', '1', '-vf', 'scale=160:90,format=gray', '-f', 'rawvideo', '-']
            b = subprocess.run(a, capture_output=True).stdout
            return np.frombuffer(b, np.uint8).mean() / 255 if b else None
        import glob as _g
        la = [luma(f) for f in sorted(_g.glob(OUTV + P + '/anc/K*.png')) if '_raw' not in f]
        D0 = dur(src); lc = [luma(src, D0 * k / 9) for k in range(1, 9)]
        la = [x for x in la if x]; lc = [x for x in lc if x]
        gam = 1.0
        if la and lc:
            ma, mc = float(np.mean(la)), float(np.mean(lc))
            tg = max(ma, 0.34)  # garaje: las anclas ya son oscuras -> piso de brillo
            if mc < tg: gam = float(np.clip(np.log(mc) / np.log(tg), 1.0, 1.6))
        print(f'{P}: luma anclas {np.mean(la):.3f} clips {np.mean(lc):.3f} -> gamma {gam:.2f}')
        sh('ffmpeg', '-v', 'error', '-y', '-i', src, '-an', '-vf', f'eq=gamma={gam:.3f}', '-c:v', 'libx264', '-crf', '21', '-preset', 'medium', '-g', '15', '-pix_fmt', 'yuv420p',
           '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', dst)

data = {'segs': segs, 'overlays': overlays, 'audio': 'tfbpintura_fish.wav'}
open(R + 'src/tfbpintura/timeline.gen.ts', 'w', encoding='utf8').write(
    '// GENERADO por vlog/tfbpintura/montaje.py — no editar\nimport type { VlogData } from "../tfb/TfbVlogMain";\n'
    f'export const TOTAL_FRAMES_TFBPINTURA = {TOTAL_FR};\nexport const DATA_TFBPINTURA: VlogData = {json.dumps(data, ensure_ascii=False)};\n')
assets = sorted({s['src'] for s in segs} | {v for o in overlays for k, v in o['props'].items() if isinstance(v, str) and re.search(r'\.(png|jpg|mp4)$', v)})
open(R + '@_tfbpintura_assets.txt', 'w', encoding='utf8').write('\n'.join(assets) + '\n')
json.dump([round((o['from'] + o['dur'] / 2) / FPS, 2) for o in overlays if o['kind'] == 'TfbQrCard'], open(V + 'cta_times.json', 'w'))
print('OK · frames', TOTAL_FR, '· assets', len(assets))
