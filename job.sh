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
set +e; python3 avatar_vivo.py $S $V > out/avatar_vivo.txt 2>&1; echo "exit $?" >> out/avatar_vivo.txt; set -e
# hojas: el cuadro del MEDIO de cada plano (mids.json), 5x4 por hoja, numeradas
python3 - <<'PY'
import json,subprocess,os
from PIL import Image, ImageDraw
V=os.environ['S']+'.mp4'; m=json.load(open('mids.json')); os.makedirs('fr',exist_ok=True)
for i,x in enumerate(m):
    subprocess.run(['ffmpeg','-v','error','-y','-ss',f"{x['t']:.2f}",'-i',V,'-frames:v','1','-vf','scale=384:216',f'fr/{i:04d}.jpg'])
W,H,C,R=384,216,5,4
for s in range(0,len(m),C*R):
    sh=Image.new('RGB',(W*C,H*R),'black'); d=ImageDraw.Draw(sh)
    for j,x in enumerate(m[s:s+C*R]):
        try: im=Image.open(f'fr/{s+j:04d}.jpg')
        except Exception: continue
        X,Y=(j%C)*W,(j//C)*H; sh.paste(im,(X,Y)); d.rectangle([X,Y,X+170,Y+22],fill='yellow'); d.text((X+3,Y+4),f"{s+j} {x['id']} {x['v']} {int(x['t']//60)}:{int(x['t']%60):02d}",fill='black')
    sh.save(f'out/hoja_{s//(C*R):02d}.jpg',quality=80)
for t in [0.5,1,2,3]: subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',V,'-frames:v','1','-vf','scale=640:360',f'out/av_{t}.jpg'])
print(len(m),'planos')
PY
ffmpeg -v error -y -i $S.mp4 -t 25 -vn -ac 1 -ar 16000 -b:a 48k out/asr25.mp3
cat out/lufs.txt; wc -l out/negros.txt out/congelados.txt out/silencios.txt; cat out/avatar_vivo.txt
tar -cf aud_$S.tar -C out . && put aud_$S.tar
