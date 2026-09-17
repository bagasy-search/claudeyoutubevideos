# decodifica el QR en cuadros del MP4 FINAL (inicio+2,5 s y fin-1 s de cada CTA)
import cv2, subprocess, numpy as np, sys
MP4 = sys.argv[1]
TS = [508.33, 519.23, 935.13, 944.67, 1486.80, 1501.93]
URL = 'https://recetario-doctora.vercel.app/?src=val-vaselina15'
ok = 0
d = cv2.QRCodeDetector()
for t in TS:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t), '-i', MP4, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], capture_output=True).stdout
    img = np.frombuffer(raw, np.uint8).reshape(1080, 1920, 3)
    v, _, _ = d.detectAndDecode(img)
    if v != URL:
        crop = cv2.resize(img[330:930, 850:1450], None, fx=2, fy=2, interpolation=cv2.INTER_CUBIC)
        v, _, _ = d.detectAndDecode(crop)
    print(f't={t}: {v or "NO DECODIFICA"}'); ok += v == URL
print(f'QR ok {ok}/{len(TS)}')
sys.exit(0 if ok == len(TS) else 1)
