# AUDITOR técnico en la nube: duración, negros, congelados, silencios, LUFS, minutos bajos, cara en el s 1, avatar vivo, QR, hojas de cuadros
set -e
for n in 1 2 3 4 5; do gh release download "$S" -R "$R" -p "$S.mp4" --clobber && break; sleep $((n*8)); done
V=$S.mp4; ls -la $V
ffprobe -v error -show_entries format=duration:stream=codec_name,width,height,r_frame_rate,nb_frames -of json $V > out/probe.json
ffmpeg -hide_banner -i $V -vf "blackdetect=d=0.4:pix_th=0.06" -an -f null - 2> bl.txt || true; grep -o "black_start:[^ ]* black_end:[^ ]* black_duration:[^ ]*" bl.txt > out/negros.txt || true
ffmpeg -hide_banner -i $V -vf "freezedetect=n=0.002:d=3" -an -f null - 2> fr.txt || true; grep -o "freeze_start: [0-9.]*\|freeze_duration: [0-9.]*" fr.txt > out/congelados.txt || true
ffmpeg -hide_banner -i $V -vn -af "silencedetect=n=-50dB:d=2.5" -f null - 2> si.txt || true; grep -o "silence_start: [0-9.]*\|silence_duration: [0-9.]*" si.txt > out/silencios.txt || true
ffmpeg -hide_banner -i $V -vn -af ebur128 -f null - 2> lu.txt || true; grep -A3 "Integrated loudness" lu.txt | tail -3 > out/lufs.txt
python3 - <<'PY'
import subprocess, json, numpy as np, cv2, os
S = os.environ['S']; V = S + '.mp4'
a = subprocess.run(['ffmpeg', '-v', 'error', '-i', V, '-vn', '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(a, np.int16).astype(np.float32) / 32768; m = []
for i in range(0, len(x) - 8000 * 10, 8000 * 60): m.append(float(round(20 * np.log10(np.sqrt((x[i:i + 8000 * 60] ** 2).mean()) + 1e-9), 1)))
def frame(t, w=640, h=360):
    r = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.2f}', '-i', V, '-frames:v', '1', '-vf', f'scale={w}:{h}', '-pix_fmt', 'bgr24', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(r, np.uint8)[:w * h * 3].reshape(h, w, 3) if len(r) >= w * h * 3 else None
d = cv2.FaceDetectorYN.create('yunet.onnx', '', (640, 360), 0.7)
caras = {}
for t in (0.5, 1.0, 2.0):
    g = frame(t); _, fs = d.detect(g); caras[t] = 0 if fs is None else len(fs)
qr = {}
if os.path.exists('qr_t.txt'):
    for t in [float(l) for l in open('qr_t.txt') if l.strip()]:
        g = frame(t, 1920, 1080); txt, _, _ = cv2.QRCodeDetector().detectAndDecode(g); qr[t] = txt
json.dump({'min60_db': m, 'min60_min': min(m), 'caras_inicio': caras, 'qr': qr}, open('out/varios.json', 'w'), indent=1)
print('min60', min(m), 'caras', caras, 'qr', qr)
PY
python3 avatar_vivo.py $S $V > out/avatar_vivo.txt 2>&1; echo "exit $?" >> out/avatar_vivo.txt || true
# hojas: 1 cuadro cada 6 s, 8x6 por hoja, con el segundo
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 $V); mkdir -p fr
ffmpeg -v error -i $V -vf "fps=1/6,scale=320:180" -q:v 5 fr/%05d.jpg
python3 - <<'PY'
import os, glob
from PIL import Image, ImageDraw
F = sorted(glob.glob('fr/*.jpg')); per = 48
for k in range(0, len(F), per):
    sh = Image.new('RGB', (8 * 320, 6 * 180), 'black'); dr = ImageDraw.Draw(sh)
    for j, f in enumerate(F[k:k + per]):
        im = Image.open(f); x, y = (j % 8) * 320, (j // 8) * 180; sh.paste(im, (x, y))
        t = (k + j) * 6; dr.rectangle([x, y, x + 70, y + 20], fill='black'); dr.text((x + 3, y + 3), f'{t // 60}:{t % 60:02d}', fill='yellow')
    sh.save(f'out/hoja_{k // per:02d}.jpg', quality=80)
print(len(F), 'cuadros')
PY
cat out/lufs.txt; wc -l out/negros.txt out/congelados.txt out/silencios.txt; cat out/avatar_vivo.txt
