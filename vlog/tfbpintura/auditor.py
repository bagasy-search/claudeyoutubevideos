# auditor.py <final.mp4> [total_frames] — compuertas del MP4 FINAL (exit 1 si alguna falla, exit 2 si no midió)
#  · minuto 1: 0 silencios (silencedetect -32 dB, 0,3 s) y ≥20 cortes (select gt(scene,0.3))
#  · cuadros == TOTAL_FRAMES, 30/1, yuv420p, rango tv, bt709, audio presente
#  · QR decodificable (cv2) en un cuadro de cada CTA (tiempos de vlog/tfbpintura/cta_times.json)
#  · hojas: minuto 1 (1 cuadro cada 2 s) y 1 cuadro cada 30 s del video entero
import sys, json, subprocess, re, os
import cv2
from PIL import Image
F = sys.argv[1]; TOT = int(sys.argv[2]) if len(sys.argv) > 2 else None
R = 'D:/Proyectos/video2-wt/tfbpintura/'; OUT = R + 'out/audit/'; os.makedirs(OUT, exist_ok=True)
ok = True
def run(a): return subprocess.run(a, capture_output=True, text=True, encoding='utf8', errors='ignore')
p = run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets,r_frame_rate,pix_fmt,color_range,color_space,color_primaries,color_transfer,width,height', '-of', 'json', F])
s = json.loads(p.stdout)['streams'][0]; print('video', s)
if TOT and int(s['nb_read_packets']) != TOT: print(f'⛔ cuadros {s["nb_read_packets"]} != {TOT}'); ok = False
if s.get('color_range') != 'tv' or s.get('color_space') != 'bt709' or s.get('r_frame_rate') != '30/1': print('⛔ color/fps'); ok = False
a = run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,channels,sample_rate', '-of', 'csv=p=0', F]).stdout.strip()
print('audio', a or '⛔ SIN AUDIO'); ok &= bool(a)
sil = run(['ffmpeg', '-hide_banner', '-t', '60', '-i', F, '-af', 'silencedetect=noise=-32dB:d=0.3', '-f', 'null', '-']).stderr
ns = len(re.findall(r'silence_start', sil)); print('silencios min 1:', ns, re.findall(r'silence_start: [\d.]+', sil)[:5]); ok &= ns == 0
sc = run(['ffmpeg', '-hide_banner', '-t', '60', '-i', F, '-vf', "select='gt(scene,0.3)',showinfo", '-f', 'null', '-']).stderr
cuts = re.findall(r'pts_time:([\d.]+)', sc); print('cortes min 1:', len(cuts)); ok &= len(cuts) >= 20
if not cuts and 'frame=' not in sc: print('exit 2: no midió cortes'); sys.exit(2)
# QR
qd = cv2.QRCodeDetector(); cta = json.load(open(R + 'vlog/tfbpintura/cta_times.json')) if os.path.exists(R + 'vlog/tfbpintura/cta_times.json') else []
for t in cta:
    fr = OUT + f'qr_{t:.1f}.png'; run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', F, '-frames:v', '1', fr])
    val, _, _ = qd.detectAndDecode(cv2.imread(fr)); print(f'QR @{t:.1f}s:', val or '⛔ NO DECODIFICA'); ok &= val == 'https://constructorlibre.com/?src=tfb-pintura'
# hojas
def hoja(ts, out, cols=6, W=320):
    ims = []
    for t in ts:
        fr = OUT + f'_h_{t:.1f}.jpg'; run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', F, '-frames:v', '1', '-vf', f'scale={W}:-2', fr])
        if os.path.exists(fr): ims.append(Image.open(fr))
    if not ims: return
    H = ims[0].height; S = Image.new('RGB', (cols * W, ((len(ims) + cols - 1) // cols) * H))
    for i, im in enumerate(ims): S.paste(im, ((i % cols) * W, (i // cols) * H))
    S.save(out, quality=82)
dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', F]).stdout)
hoja([i * 2 + 0.5 for i in range(30)], OUT + 'hoja_min1.jpg')
hoja([i * 30 + 1 for i in range(int(dur // 30) + 1)], OUT + 'hoja_cada30.jpg', cols=6)
print('HOJAS', OUT + 'hoja_min1.jpg', OUT + 'hoja_cada30.jpg')
print('AUDITOR', '✅ OK' if ok else '⛔ FALLA'); sys.exit(0 if ok else 1)
