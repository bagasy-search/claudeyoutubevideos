# doc_litprep.py — prepara los videos del mundo continuo para el farm (tar de assets < 2 GB):
# cada plano de video del cuerpo se recorta a SU tramo usado (+0,8 s de margen), sin audio (en Remotion va muted; el sonido
# real ya está en la mezcla), 1080p CRF 24 → <pub>/<slug>/lit/c/<n>.mp4, y en el JSON queda v = ese recorte con from ≈ 0.
# Uso: python -I scripts/doc_litprep.py <mundo.json> <public/> [desde_s=0]   (reescribe mundo.json; idempotente)
import json, sys, os, subprocess
from concurrent.futures import ThreadPoolExecutor
P, PUB = sys.argv[1], sys.argv[2].rstrip('/') + '/'; T0 = float(sys.argv[3]) if len(sys.argv) > 3 else 0.0
M = json.load(open(P, encoding='utf8')); XF = M.get('xf', 0.32); FPS = 30
slug = os.path.basename(os.path.dirname(os.path.abspath(P)))
OUT = f"{slug}/lit/c"; os.makedirs(PUB + OUT, exist_ok=True)
jobs = []
for p in M['portals']:
    its = p['items']
    for i, it in enumerate(its):
        if 'v' not in it or it['a'] < T0 or it['v'].startswith(OUT): continue
        a0 = it['a'] - (XF / 2 if i else 0); b0 = it['b'] + (XF / 2 if i < len(its) - 1 else 0)
        r = it.get('rate') or 1.0
        # mismo cálculo que el Portal de M1.tsx: arranca 10 cuadros antes; startFrom = from·FPS − (a·FPS − F0)·rate
        F0 = round(a0 * FPS) - 10; sf = max(0, round(it['from'] * FPS - (it['a'] * FPS - F0) * r)) / FPS
        dur = ((b0 - a0) + 14 / FPS + 0.8) * r
        dst = f"{OUT}/{os.path.basename(it['v'])}_{int(it['a'] * 1000)}"
        jobs.append((it, PUB + it['v'] + '.mp4', sf, dur, dst, (sf - 0.0)))
def cut(j):
    it, src, ss, dur, dst, _ = j
    if not os.path.exists(PUB + dst + '.mp4'):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{ss:.3f}', '-t', f'{dur:.3f}', '-i', src, '-an', '-vf', "scale='min(1920,iw)':-2,fps=30",
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', PUB + dst + '.mp4'])
    return os.path.exists(PUB + dst + '.mp4')
with ThreadPoolExecutor(2) as ex: ok = list(ex.map(cut, jobs))   # 2 a la vez: con 6, x264 se queda sin memoria (apex02)
n = 0
for (it, src, ss, dur, dst, off), good in zip(jobs, ok):
    if not good: print('X', src); continue
    # el recorte empieza en ss → from nuevo = from − ss (el startFrom del Portal da ≈ 0)
    it['src_v'] = it['v']; it['v'] = dst; it['from'] = round(it['from'] - ss, 3); n += 1
json.dump(M, open(P, 'w', encoding='utf8'), ensure_ascii=False)
tot = sum(os.path.getsize(os.path.join(PUB + OUT, f)) for f in os.listdir(PUB + OUT)) / 1e6
print(f'recortes {n}/{len(jobs)} · {tot:.0f} MB en {OUT}')
