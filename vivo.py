# vivo.py <slug> <mp4>: ¿la boca de Gary se mueve en el MP4 final? Ubica la cara con haar en cada ventana A (cámara en mano: se mide
# por ventana) y compara el cambio de la boca contra la frente. exit 1 = quieto.
import json, subprocess, sys, cv2, numpy as np
S, src = sys.argv[1], sys.argv[2]
C = json.load(open(f'cues_{S}.json'))
av = [{'ms': s['from'] / 30, 'me': (s['from'] + s['dur']) / 30} for s in C['SHOTS'] if s['k'] == 'A']
av = [w for w in av if w['me'] - w['ms'] >= 3.5]
H = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')
def frame(t):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', src, '-frames:v', '1', '-vf', 'scale=960:540', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
    return np.frombuffer(r, np.uint8).reshape(540, 960) if len(r) == 960 * 540 else None
def zona(t, crop):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', src, '-t', '2.5', '-an', '-vf', f'scale=960:540,crop={crop},scale=48:24,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    F = [r[i * 1152:(i + 1) * 1152] for i in range(len(r) // 1152)]
    return sum(sum(abs(a - b) for a, b in zip(F[i], F[i + 1])) / 1152 for i in range(len(F) - 1)) / max(1, len(F) - 1)
res = []
for w in [av[len(av) // 5], av[2 * len(av) // 5], av[3 * len(av) // 5], av[4 * len(av) // 5]]:
    t = w['ms'] + 0.8; g = frame(t)
    if g is None: continue
    fs = H.detectMultiScale(g, 1.1, 5, minSize=(60, 60))
    if len(fs) == 0: print(S, f't={t:.1f} sin cara'); continue
    x, y, fw, fh = max(fs, key=lambda f: f[2] * f[3])
    boca = f'{int(fw*0.5)}:{int(fh*0.22)}:{int(x+fw*0.25)}:{int(y+fh*0.70)}'; frente = f'{int(fw*0.5)}:{int(fh*0.15)}:{int(x+fw*0.25)}:{int(y+fh*0.12)}'
    b, f = zona(t, boca), zona(t, frente); r = round(b / max(f, 0.05), 2); res.append(r)
    print(f'{S} t={t:.1f} cara {fw}px boca {b:.2f} frente {f:.2f} razón {r}')
ok = len(res) >= 3 and sorted(res)[len(res) // 2] >= 1.6
print(S, 'AVATAR VIVO OK' if ok else 'AVATAR QUIETO (o no se pudo medir)', res); sys.exit(0 if ok else 1)
