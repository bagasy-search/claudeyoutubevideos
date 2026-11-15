# mid.py <slug> <mp4>: un cuadro a la MITAD de cada plano (y de cada overlay de pantalla completa) -> hojas 6x5 con el id y el segundo
import json, subprocess, sys, os
from PIL import Image, ImageDraw
S, MP4 = sys.argv[1], sys.argv[2]; C = json.load(open(f'cues_{S}.json')); FPS = 30
pts = [(f"{s['k']}{s['id']}", (s['from'] + s['dur'] / 2) / FPS) for s in C['SHOTS']]
pts += [(f"ov:{o['type']}", (o['from'] + o['dur'] * 0.6) / FPS) for o in C['OVERLAYS'] if o['type'] in ('scene', 'map', 'carousel', 'esc', 'price', 'stat', 'kinetic', 'quote', 'cta', 'polaroid', 'split')]
pts.sort(key=lambda x: x[1]); os.makedirs('mf', exist_ok=True)
W, H, CO, RO = 320, 180, 6, 5
for i, (n, t) in enumerate(pts):
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{max(0, t - 1):.3f}', '-i', MP4, '-ss', f'{min(1, t):.3f}', '-frames:v', '1', '-vf', f'scale={W}:{H}', '-q:v', '4', f'mf/{i:04d}.jpg'])
for p in range(0, len(pts), CO * RO):
    part = pts[p:p + CO * RO]; sh = Image.new('RGB', (W * CO, (H + 16) * ((len(part) + CO - 1) // CO)), (20, 20, 20)); d = ImageDraw.Draw(sh)
    for j, (n, t) in enumerate(part):
        x, y = (j % CO) * W, (j // CO) * (H + 16); f = f'mf/{p + j:04d}.jpg'
        if os.path.exists(f): sh.paste(Image.open(f), (x, y))
        d.text((x + 3, y + H + 2), f'{n} · {t:.1f}s', fill=(255, 220, 120))
    sh.save(f'sheet_{S}_mid_{p // (CO * RO):02d}.jpg', quality=78)
print('cuadros', len(pts))
