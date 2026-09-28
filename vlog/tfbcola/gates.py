# gates.py <final.mp4> <TOTAL_FRAMES> <qr_seconds,…> — compuertas de entrega sobre el MP4 FINAL (exit 1 si falla, 2 si no midió)
import sys, subprocess, re, json
import cv2
f, total, qrs = sys.argv[1], int(sys.argv[2]), [float(x) for x in sys.argv[3].split(',')]
NW = 0x08000000
def run(a): return subprocess.run(a, capture_output=True, text=True, creationflags=NW)
ok = True; out = {}
# 1) 0 silencios en el minuto 1
r = run(['ffmpeg', '-hide_banner', '-t', '60', '-i', f, '-af', 'silencedetect=noise=-32dB:d=0.3', '-f', 'null', '-'])
sil = re.findall(r'silence_start: ([\d.]+)', r.stderr); out['silencios_min1'] = [float(x) for x in sil]
if 'Stream' not in r.stderr: print('NO MIDIÓ silencios'); sys.exit(2)
if sil: ok = False
# 2) cortes del minuto 1
r = run(['ffmpeg', '-hide_banner', '-t', '60', '-i', f, '-vf', "select='gt(scene,0.3)',showinfo", '-an', '-f', 'null', '-'])
cuts = re.findall(r'pts_time:([\d.]+)', r.stderr); out['cortes_min1'] = len(cuts)
if len(cuts) < 20: ok = False
# 3) cuadros == TOTAL_FRAMES, streams, color
r = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets,width,height,r_frame_rate,color_range,color_space,color_primaries,color_transfer,pix_fmt', '-of', 'json', f])
v = json.loads(r.stdout)['streams'][0]; out['video'] = v
if int(v['nb_read_packets']) != total: ok = False; out['cuadros_mal'] = f"{v['nb_read_packets']} != {total}"
if v.get('color_range') != 'tv' or v.get('color_space') != 'bt709': ok = False
r = run(['ffprobe', '-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name,sample_rate,channels', '-of', 'json', f]); out['audio'] = json.loads(r.stdout)['streams']
if not out['audio']: ok = False
# 4) pts == dts (sin B-frames reordenados)
r = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-read_intervals', '%+20', '-show_entries', 'packet=pts,dts', '-of', 'csv=p=0', f])
bad = [l for l in r.stdout.split() if l and len(set(l.split(','))) > 1]; out['pts_ne_dts'] = len(bad)
if bad: ok = False
# 5) QR decodifica en un cuadro del MP4 final
det = cv2.QRCodeDetector(); qr_ok = []
for t in qrs:
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(t), '-i', f, '-frames:v', '1', '_qr.png'], creationflags=NW)
    im = cv2.imread('_qr.png'); d = det.detectAndDecode(im)[0] if im is not None else ''
    qr_ok.append((t, d))
out['qr'] = qr_ok
if not all(d.startswith('https://constructorlibre.com') for _, d in qr_ok): ok = False
print(json.dumps(out, ensure_ascii=False, indent=1)); print('COMPUERTAS', 'OK' if ok else '⛔ FALLAN'); sys.exit(0 if ok else 1)
