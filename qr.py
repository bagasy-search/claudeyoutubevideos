# qr.py <slug> <mp4>: el QR de cada CTA se lee con cv2 en el MP4 final; cuenta los segundos con lectura correcta (>= 8 s por CTA)
import json, subprocess, sys, cv2, numpy as np
S, src = sys.argv[1], sys.argv[2]; URL = f'https://garys-blackout.vercel.app/g?src={S}'
C = json.load(open(f'cues_{S}.json')); D = cv2.QRCodeDetector(); out = []
for s in [s for s in C['SHOTS'] if s.get('cta')]:
    a, b = s['from'] / 30, (s['from'] + s['dur']) / 30; ok = 0; t = a + 0.5; leidos = set()
    while t < b:
        r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', src, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
        if len(r) == 1920 * 1080 * 3:
            im = np.frombuffer(r, np.uint8).reshape(1080, 1920, 3); d, _, _ = D.detectAndDecode(im)
            if d: leidos.add(d)
            if d == URL: ok += 1
        t += 1
    out.append({'cta': s['cta'], 'desde': round(a, 1), 'dur': round(b - a, 1), 'seg_qr_ok': ok, 'leidos': sorted(leidos)})
    print(out[-1])
print(S, 'QR OK' if out and all(o['seg_qr_ok'] >= 8 for o in out) else 'QR FALLA', json.dumps(out)); json.dump(out, open(f'qr_{S}.json', 'w'))
