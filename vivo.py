# vivo.py <slug> <mp4>: ¿la boca del avatar se mueve? (versión nube de qc/avatar_vivo.py) Compara el cambio en la boca contra la frente
# en 3 ventanas del avatar. La zona de la boca/frente sale de vivo_crop.json (medida sobre la foto del avatar). exit 1 = quieto.
import json, subprocess, sys
S, src = sys.argv[1], sys.argv[2]
C = json.load(open(f'cues_{S}.json')); K = json.load(open('vivo_crop.json'))
av = [{'ms': a['from'] / 30, 'me': (a['from'] + a['dur']) / 30, 'mods': a.get('mods') or []} for a in C['AVATAR']]
av = [w for w in av if w['me'] - w['ms'] >= 3.5 and not w['mods']] or [w for w in av if w['me'] - w['ms'] >= 3.5]
def zona(t, crop):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', src, '-t', '2.5', '-an', '-vf', f'crop={crop},scale=48:24,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    F = [r[i * 1152:(i + 1) * 1152] for i in range(len(r) // 1152)]
    return sum(sum(abs(a - b) for a, b in zip(F[i], F[i + 1])) / 1152 for i in range(len(F) - 1)) / max(1, len(F) - 1)
res = []
for w in [av[len(av) // 4], av[len(av) // 2], av[3 * len(av) // 4]]:
    best = (0, 0, 0)
    for dt in (0.5, 2.0, 3.5):
        t = w['ms'] + dt
        if t + 2.5 > w['me'] and dt > 0.5: continue
        b, f = zona(t, K['boca']), zona(t, K['frente']); r = b / max(f, 0.05)
        if r > best[0]: best = (r, b, f)
    res.append(round(best[0], 2)); print(f"{S} t={w['ms']:.1f} boca {best[1]:.2f} frente {best[2]:.2f} razón {res[-1]}")
ok = sorted(res)[1] >= 1.6
print(S, 'AVATAR VIVO OK' if ok else 'AVATAR QUIETO (o no se pudo medir)', res); sys.exit(0 if ok else 1)
