# listas.py — escenas con TODOS sus clips (hablados + detalles) → imprime sus ids
import json, os, glob
for f in sorted(glob.glob('vlog/tfbcola/S*.json')):
    p = json.load(open(f, encoding='utf8')); d = p['dir'] + 'clips/'
    st = json.load(open(d + 'state.json')) if os.path.exists(d + 'state.json') else {}
    sd = json.load(open(d + 'state_det.json')) if os.path.exists(d + 'state_det.json') else {}
    falt = [c['id'] for c in p['clips'] if c['id'] not in (sd if c.get('detail') else st)]
    print(os.path.basename(f)[:-5], 'LISTA' if not falt else 'faltan ' + ' '.join(falt))
