# medir_versiones.py <P> <id> — mide con `check` TODAS las versiones en disco de un clip (check sólo mide la de state.json)
import json, sys, glob, os, subprocess
P, cid = sys.argv[1], sys.argv[2]
D = f'out/vlog/{P}/clips/'; SF = D + 'state.json'
H = json.load(open(D + 'check_hist.json', encoding='utf8')) if os.path.exists(D + 'check_hist.json') else {}
for f in sorted(glob.glob(D + cid + 'r*.mp4')):
    fn = os.path.basename(f)
    if fn in H.get(cid, {}): continue
    st = json.load(open(SF)); st[cid]['file'] = fn; json.dump(st, open(SF, 'w'), indent=1)
    subprocess.run(['node', 'scripts/agnes_vlog.mjs', f'vlog/tdchinca/plan_{P}.json', 'check'], capture_output=True)
    H = json.load(open(D + 'check_hist.json', encoding='utf8'))
subprocess.run(['node', 'scripts/agnes_vlog.mjs', f'vlog/tdchinca/plan_{P}.json', 'check'], capture_output=True)
H = json.load(open(D + 'check_hist.json', encoding='utf8'))
for fn, h in H.get(cid, {}).items(): print(cid, fn, h.get('score'), (h.get('labios') or {}).get('corr'), h.get('line', '')[:90])
print('elegido:', json.load(open(SF))[cid]['file'])
