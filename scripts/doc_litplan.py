# doc_litplan.py — plan del CUERPO de un documental "mundo continuo" con planos LITERALES (doc_cliprank).
# Une: frases/palabras de la voz + rank.json (candidatos por concepto) + cfg (tramos de globo, rutas, rótulos)
# → JSON con portales (planos que se funden anclados a la voz), cámaras, pins, nombres, rutas, overs y pedidos HQ.
# Uso: python -I scripts/doc_litplan.py <frases.json> <words.json> <rank.json> <cfg.json> <raiz_lit> <salida.json> [hq_res.json]
#   pasada 1 (sin hq_res): arma y escribe "hq" = tomas de video a bajar en HQ (farm, doc_lithq.mjs)
#   pasada 2 (con hq_res): cada toma usa SU tramo sin cortes de escena; si no alcanza, cae al siguiente candidato
import json, sys, math, os, re
F = json.load(open(sys.argv[1], encoding='utf8')); WD = json.load(open(sys.argv[2], encoding='utf8'))
RK = json.load(open(sys.argv[3], encoding='utf8')); CFG = json.load(open(sys.argv[4], encoding='utf8'))
ROOT = sys.argv[5]; OUT = sys.argv[6]; HQ = json.load(open(sys.argv[7], encoding='utf8')) if len(sys.argv) > 7 else None
XF, MIN, TGT, MAX = 0.32, 2.6, 4.1, 6.4
fa = lambda i: F[i]['a'] if i < len(F) else F[-1]['b'] + 1.0
END = F[-1]['b'] + 1.0
SLUG = CFG['slug']
site = lambda k: CFG.get('m1sitio', {}).get(k, k)

# ── tramos: globo (portal cerrado) vs portal; cada fila del rank vale hasta la siguiente
G = sorted(CFG['globo'], key=lambda g: g['f'][0])
filas = sorted([r for r in RK if r['cands']], key=lambda r: r['desde'])
def fila_de(i):
    cur = None
    for r in filas:
        if r['desde'] <= i: cur = r
    return cur
def en_globo(i): return any(g['f'][0] <= i <= g['f'][1] for g in G)

# ── cortes anclados a la voz: inicio de frase; frase larga → arranque de palabra tras la pausa más larga cerca del medio
def cortes(i0, i1):
    pts = []
    for i in range(i0, i1 + 1):
        a, b = fa(i), fa(i + 1); pts.append(a)
        if b - a > MAX - 0.4:
            n = math.ceil((b - a) / TGT) - 1
            ws = [w for w in WD if a + 1.5 < w['a'] < b - 1.5]
            for j in range(1, n + 1):
                m = a + (b - a) * j / (n + 1)
                best = min(ws, key=lambda w: abs(w['a'] - m) - 2.5 * max(0, w['a'] - max([x['b'] for x in WD if x['b'] <= w['a']] or [w['a']])), default=None)
                if best and all(abs(best['a'] - p) > MIN for p in pts): pts.append(best['a'])
    return sorted(pts)

def tramos_portal():
    seg, i = [], 0
    i = next(k for k in range(len(F)) if F[k]['a'] >= CFG['t0'] - 0.05)
    cur = None
    for k in range(i, len(F)):
        g = en_globo(k)
        if not g and cur is None: cur = [k, k]
        elif not g: cur[1] = k
        elif cur: seg.append(cur); cur = None
    if cur: seg.append(cur)
    return seg

import importlib.util
_sp = importlib.util.spec_from_file_location('doc_frameqc', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'doc_frameqc.py'))
_m = importlib.util.module_from_spec(_sp); _sp.loader.exec_module(_m); QC = _m.QC(ROOT)
# créditos y tamaño real de cada foto → tarjeta (FotoCard) si es chica, vertical o histórica (tipo h en commons_q.tsv)
META, TIPOQ = {}, {}
for fn in ('_fuentes_commons.json', '_fuentes_q.json'):
    fp = os.path.join(ROOT, 'fotos', fn)
    if os.path.exists(fp):
        for v in json.load(open(fp, encoding='utf8')).values():
            for m in v: META[m['f']] = m
if os.path.exists(os.path.join(ROOT, 'commons_q.tsv')):
    for li, l in enumerate(x for x in open(os.path.join(ROOT, 'commons_q.tsv'), encoding='utf8').read().splitlines() if x.strip()): TIPOQ[f"q{li:02d}_"] = l.split('	')[1]
from PIL import Image
def foto_info(p):
    w, h = Image.open(os.path.join(ROOT, p)).size; m = META.get(p, {}); b = os.path.basename(p)
    hist = TIPOQ.get(b[:4]) == 'h'
    cred = ' · '.join(x for x in [re.sub(r'\s+', ' ', m.get('artist', '')).strip()[:40], m.get('lic', ''), 'Wikimedia Commons'] if x) if m else ''
    return {'card': w < 1400 or w / h < 1.3 or hist, 'cred': cred}
usados = set()
def vecinas(r):   # la fila primero; agotada → filas del mismo sitio por cercanía (la "-" = resumen: cualquiera)
    fs = [x for x in filas if x is not r and (r['clave'] == '-' or x['clave'] == r['clave'])]
    return [r] + sorted(fs, key=lambda x: abs(x['desde'] - r['desde']))
def pick(r, need, hqok=True):
    for c in (c for x in vecinas(r) for c in x['cands']):
        key = c['p'] if c['vid'] == 'fotos' else f"{c['k']}/{c['vid']}@{c['t']}"
        if key in usados or QC.malo(c['p'], c['vid'] != 'fotos'): continue
        if c['vid'] != 'fotos' and HQ is not None:
            h = HQ.get(f"{c['vid']}_{c['t']}")
            if not h or h['dur'] < min(need, 3.2) * 0.7: continue
        usados.add(key); return c
    return None

CAMS = [[1.04, .5, .5, 1.14, .5, .5], [1.15, .5, .5, 1.05, .5, .5], [1.12, .38, .5, 1.12, .62, .5], [1.12, .62, .5, 1.12, .38, .5],
        [1.13, .5, .62, 1.13, .5, .4], [1.06, .45, .55, 1.16, .55, .45]]
hq, portales, nshot = [], [], 0
for (i0, i1) in tramos_portal():
    pts = cortes(i0, i1) + [fa(i1 + 1)]
    # fusiona cortes muy juntos y respeta el cambio de fila (concepto) aunque el plano quede corto
    sh, a = [], pts[0]
    for p in pts[1:]:
        fl_a, fl_p = fila_de(max(k for k in range(len(F)) if F[k]['a'] <= a + 0.01)), fila_de(max(k for k in range(len(F)) if F[k]['a'] <= p - 0.01))
        cambio = fl_a is not fl_p or p == pts[-1]
        if p - a >= TGT * 0.8 or (cambio and p - a >= MIN) or p == pts[-1]:
            if sh and p - a < MIN and not cambio: sh[-1][1] = p
            else: sh.append([a, p])
            a = p
    items = []
    for (a, b) in sh:
        k = max(k for k in range(len(F)) if F[k]['a'] <= a + 0.01); r = fila_de(k)
        c = pick(r, b - a)
        if not c:   # sin candidato nuevo: el plano anterior se estira (nunca se repite una toma)
            if items: items[-1]['b'] = b
            continue
        cm = CAMS[nshot % len(CAMS)]; nshot += 1
        it = {'a': round(a, 3), 'b': round(b, 3), 'fila': r['desde'], 'k': r['clave'], 'real': True}
        if c['vid'] == 'fotos':
            fn = os.path.basename(c['p']); it.update({'img': f"{SLUG}/lit/f/{fn}", 'src': c['p'], 'cam': cm, **foto_info(c['p'])})
        else:
            key = f"{c['vid']}_{c['t']}"; it.update({'hq': key, 'vid': c['vid'], 't': c['t'], 'src': c['p'], 'cam': [max(1.12, x) if j % 3 == 0 else x for j, x in enumerate(cm)]})
            if HQ:
                h = HQ[key]; need = b - a + XF + 0.45
                it['v'] = f"{SLUG}/lit/v/{key}"; it['rate'] = round(min(1.0, max(0.62, h['dur'] / need)), 3)
                it['from'] = round(max(0.0, min(h['t_in'] - 0.6, h['dur'] - need * it['rate'])), 2)
            else:
                hq.append({'key': key, 'k': c['k'], 'vid': c['vid'], 't': c['t'], 'need': round(b - a + 1.0, 2)})
        items.append(it)
    k0 = items[0]['k'] if items else 'stonehenge'
    lon, lat = CFG['sitios'][k0]
    t0p = CFG['t0'] if not portales else fa(i0)
    if items: items[0]['a'] = round(min(items[0]['a'], t0p), 3)
    portales.append({'site': site(k0), 'lon': lon, 'lat': lat, 't0': round(t0p, 3), 't1': round(fa(i1 + 1), 3), 'close': True, 'items': items})

# ── cámaras, pins, nombres y rutas del globo (portal cerrado)
cams, pins, names, rutas = [], [], [], []
for p in portales:
    cams += [[round(p['t0'] - 0.6, 2), p['lon'], p['lat'], 5200], [round(p['t1'] - 0.1, 2), p['lon'], p['lat'], 5600]]
for g in G:
    a, b = fa(g['f'][0]), fa(g['f'][1] + 1); lon, lat = CFG['sitios'][g['a']]
    if 'c' in g: cams.append([round(a + 1.2, 2), g['c'][0], g['c'][1], g['R']])
    if 'ruta' in g:
        r = g['ruta']; r = {**r, 'tDraw': fa(r['fDraw']), 'tKm': fa(r['fKm']) + 0.3, 't1': b - 0.4, 'dDraw': min(2.4, max(1.2, (b - fa(r['fDraw'])) * 0.45))}
        rutas.append(r)
    if 'fin' in g or 'pin' in g: cams.append([round(b - 0.35, 2), lon, lat, g.get('fin', {}).get('R', g['R'])])
    if 'pin' in g: pins.append({'site': site(g['a']), 'n': g['pin']['n'], 'label': g['pin']['label'], 'sub': g['pin']['sub'], 't0': round(fa(g['pin']['f']), 2), 'lon': lon, 'lat': lat})
    for n in g.get('names', []): names.append({'text': n['text'], 'lon': n['lon'], 'lat': n['lat'], 't0': round(fa(n['f']), 2), 't1': round(min(b - 0.3, fa(n['f']) + 2.4), 2), 'size': n['size']})
cams.sort(key=lambda c: c[0])
overs = []
for o in CFG['overs']:
    a = fa(o['f']); b = fa(o.get('f2', o['f']) + 1) - 0.25
    if b - a < 2.2: b = a + 2.2
    overs.append({'n': o['n'], 'a': round(a + 0.15, 2), 'b': round(b, 2), 'p': o['p']})
QC.save()
out = {'end': round(END, 2), 'portals': portales, 'cams': cams, 'pins': pins, 'names': names, 'routes': rutas, 'overs': overs, 'hq': hq}
json.dump(out, open(OUT, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
nv = sum(1 for p in portales for i in p['items'] if 'vid' in i); nf = sum(1 for p in portales for i in p['items'] if 'img' in i)
dur = [i['b'] - i['a'] for p in portales for i in p['items']]; dur.sort()
print(f"portales {len(portales)} · planos {len(dur)} (video {nv}, foto {nf}) · mediana {dur[len(dur)//2]:.2f}s · min {dur[0]:.2f} · max {dur[-1]:.2f} · hq {len(hq)}")
