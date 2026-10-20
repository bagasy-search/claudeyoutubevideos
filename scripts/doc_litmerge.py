# doc_litmerge.py — une el JSON del minuto 1 (mundo continuo) con el del cuerpo (doc_litplan) en UN solo mundo:
# el portal que el min 1 deja abierto sigue con los planos del cuerpo (sin cerrarse ni reabrirse) y la cámara continúa.
# Uso: python -I scripts/doc_litmerge.py <m1.json> <cuerpo.json> <salida.json>
import json, sys
A = json.load(open(sys.argv[1], encoding='utf8')); B = json.load(open(sys.argv[2], encoding='utf8'))
end = A['end']; O = dict(A)
P = [dict(p) for p in A['portals']]; BP = [dict(p) for p in B['portals']]
last = P[-1]
if not last.get('close', True) and BP and abs(BP[0]['t0'] - end) < 0.6:
    b0 = BP.pop(0)
    it = b0['items']; it[0]['a'] = max(it[0]['a'], end)
    last['items'] = last['items'] + it; last['t1'] = b0['t1']; last['close'] = True
O['portals'] = P + BP
O['cams'] = [c for c in A['cams'] if c[0] <= end] + [c for c in B['cams'] if c[0] > end]
O['cams'].sort(key=lambda c: c[0])
for k in ('pins', 'names', 'overs'): O[k] = A.get(k, []) + B.get(k, [])
O['routes'] = B.get('routes', [])
O['end'] = B['end']
json.dump(O, open(sys.argv[3], 'w', encoding='utf8'), ensure_ascii=False)
n = sum(len(p['items']) for p in O['portals'])
print(f"end {O['end']} · portales {len(O['portals'])} · planos {n} · cams {len(O['cams'])} · overs {len(O['overs'])} · rutas {len(O['routes'])}")
