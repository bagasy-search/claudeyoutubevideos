# §4 AUDITOR sobre el MP4 FINAL (compuertas que MIDEN; cada una imprime cuánto midió):
#  1) streams: video yuv420p/tv/bt709 30/1, audio presente, cuadros == TOTAL_FRAMES, pts==dts, sin saltos de PTS
#  2) minuto 1: silencedetect (−32 dB, 0,3 s) = 0 y cortes select(scene>0.3) ≥ 20
#  3) QR: decodifica en un cuadro del CTA (cv2, recorte con el aspecto correcto, varias escalas)
#  4) negros (blackdetect) y volumen en 5 puntos
#  5) hoja de contactos del minuto 1 (1 cuadro/2 s) y 1 cuadro cada 30 s → out/auditor/
# uso: python vlog/tfbtanque/auditor.py <final.mp4>
import sys, json, subprocess, re, os
import numpy as np, cv2
from PIL import Image
R = 'D:/Proyectos/video2-wt/tfbtanque/'; F = sys.argv[1]; OUT = R + 'out/auditor/'; os.makedirs(OUT, exist_ok=True)
CF = 0x08000000
def run(a): return subprocess.run(a, capture_output=True, text=True, creationflags=CF)
TOT = int(re.search(r'TOTAL_FRAMES_TFBTANQUE = (\d+)', open(R + 'src/tfbtanque/timeline.gen.ts', encoding='utf8').read()).group(1))
ok = True
def gate(name, cond, info):
    global ok; ok &= bool(cond); print(('✓ ' if cond else '⛔ ') + name + ' · ' + info)
s = json.loads(run(['ffprobe', '-v', 'error', '-show_entries', 'stream=codec_type,pix_fmt,color_range,color_space,color_primaries,color_transfer,r_frame_rate,avg_frame_rate', '-of', 'json', F]).stdout)['streams']
v = [x for x in s if x['codec_type'] == 'video'][0]; a = [x for x in s if x['codec_type'] == 'audio']
gate('video tv/bt709 yuv420p 30/1', v.get('pix_fmt') == 'yuv420p' and v.get('color_range') == 'tv' and v.get('color_space') == 'bt709' and v['r_frame_rate'] == '30/1' and v['avg_frame_rate'] == '30/1', json.dumps(v))
gate('pista de audio', len(a) == 1, f'{len(a)} pistas')
nf = int(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', F]).stdout.strip().split(',')[0])
gate('cuadros == TOTAL_FRAMES', nf == TOT, f'{nf} vs {TOT}')
pk = run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'packet=pts,dts', '-of', 'csv=p=0', F]).stdout.split()
pts = np.array([int(x.split(',')[0]) for x in pk if x.split(',')[0] not in ('N/A', '')]); dts = np.array([int(x.split(',')[1]) for x in pk if len(x.split(',')) > 1 and x.split(',')[1] not in ('N/A', '')])
gate('pts==dts (sin B-frames reordenados)', len(pts) == len(dts) and np.all(pts == dts), f'{len(pts)} paquetes, distintos {int(np.sum(pts != dts)) if len(pts) == len(dts) else "?"}')
ps = np.sort(pts); d = np.diff(ps); step = np.median(d)
gate('sin saltos de PTS', int(np.sum(np.abs(d - step) > step * 0.1)) == 0, f'saltos {int(np.sum(np.abs(d - step) > step * 0.1))} de {len(d)}')
sil = run(['ffmpeg', '-hide_banner', '-t', '60', '-i', F, '-af', 'silencedetect=noise=-32dB:d=0.3', '-vn', '-f', 'null', '-']).stderr
ns = sil.count('silence_start'); gate('minuto 1: 0 silencios (−32 dB, 0,3 s)', ns == 0, f'{ns} silencios · midió {"sí" if "Stream #0:1" in sil or "Audio" in sil else "¿?"}')
sc = run(['ffmpeg', '-hide_banner', '-t', '60', '-i', F, '-vf', "select='gt(scene,0.3)',metadata=print", '-an', '-f', 'null', '-']).stderr
nc = len(re.findall(r'lavfi\.scene_score', sc)); gate('minuto 1: ≥ 20 cortes (scene>0.3)', nc >= 20, f'{nc} cortes')
bd = run(['ffmpeg', '-hide_banner', '-i', F, '-vf', 'blackdetect=d=0.5:pix_th=0.10', '-an', '-f', 'null', '-']).stderr
nb = bd.count('black_start'); gate('sin negros ≥ 0,5 s', nb == 0, f'{nb}')
dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', F]).stdout)
vols = []
for t in [30, dur * 0.25, dur * 0.5, dur * 0.75, dur - 40]:
    m = re.search(r'mean_volume: (-?[\d.]+)', run(['ffmpeg', '-hide_banner', '-nostats', '-ss', f'{t:.1f}', '-t', '4', '-i', F, '-vn', '-af', 'volumedetect', '-f', 'null', '-']).stderr)
    vols.append(float(m.group(1)) if m else -99)
gate('volumen en 5 puntos (> −35 dB)', all(x > -35 for x in vols), str(vols))
# QR en los CTA
tl = open(R + 'src/tfbtanque/timeline.gen.ts', encoding='utf8').read()
ctas = [(int(m.group(1)), int(m.group(2))) for m in re.finditer(r'"kind": "cta",\s*"from": (\d+),\s*"dur": (\d+)', tl)]
det = cv2.QRCodeDetector(); dec = []
for f0, du in ctas:
    t = (f0 + min(du - 10, 60)) / 30; p = OUT + f'qr_{f0}.png'
    run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', F, '-frames:v', '1', p]); img = cv2.imread(p); txt = ''
    for sc_ in (1.0, 0.6, 1.5):
        im = cv2.resize(img, None, fx=sc_, fy=sc_); txt, _, _ = det.detectAndDecode(im)
        if txt: break
    dec.append(txt)
gate('QR decodifica en cada CTA', ctas and all(x == 'https://constructorlibre.com/?src=tfb-tanque' for x in dec), f'{len(ctas)} CTA · {dec}')
# hojas
def hoja(ts, name, w=480):
    ims = []
    for t in ts:
        p = OUT + '_h.jpg'; run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', F, '-frames:v', '1', '-vf', f'scale={w}:-2', p]); ims.append(Image.open(p).copy())
    cols = 5; h = ims[0].height; S = Image.new('RGB', (cols * w, ((len(ims) + cols - 1) // cols) * h))
    for i, im in enumerate(ims): S.paste(im, ((i % cols) * w, (i // cols) * h))
    S.save(OUT + name, quality=80)
hoja([0.5 + 2 * i for i in range(30)], 'min1.jpg', 384); hoja([15 + 30 * i for i in range(int(dur // 30))], 'cada30.jpg', 384)
print('AUDITOR', 'OK' if ok else '⛔ FALLA', '· hojas en', OUT)
sys.exit(0 if ok else 1)
