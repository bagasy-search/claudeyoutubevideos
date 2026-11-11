# tramos candidatos de los crudos de YouTube (release yraw-<slug>): escenas, sin caras (haar), con movimiento, no oscuros → ycand_<slug>.json
set -e
python3 -m pip install -q --break-system-packages --ignore-installed opencv-python-headless==4.10.0.84 numpy 2>&1 | tail -2; python3 -c "import cv2; print(cv2.__version__, cv2.__file__)"
mkdir -p raw
gh release view "yraw-$S" -R "$R" --json assets -q '.assets[].name' | grep '\.v\.mp4$' > lista.txt
python3 - <<'PY'
import subprocess, json, os, numpy as np, cv2
fc = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
fp = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_profileface.xml')
S, R = os.environ['S'], os.environ['R']; out = {}
for name in [l.strip() for l in open('lista.txt') if l.strip()]:
    id = name[:-6]; f = 'raw/' + name
    subprocess.run(['gh', 'release', 'download', 'yraw-' + S, '-R', R, '-p', name, '-D', 'raw', '--clobber'])
    if not os.path.exists(f): continue
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', f], capture_output=True, text=True).stdout)
    w, h = pr['streams'][0]['width'], pr['streams'][0]['height']; dur = float(pr['format']['duration'])
    if w <= h: out[id] = {'dur': dur, 'w': w, 'h': h, 'segs': [], 'motivo': 'vertical'}; os.remove(f); continue
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', f, '-vf', 'fps=2,scale=320:180', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    fr = []; col = []
    while True:
        b = p.stdout.read(320 * 180 * 3)
        if len(b) < 320 * 180 * 3: break
        c = np.frombuffer(b, np.uint8).reshape(180, 320, 3); col.append(c); fr.append(c.mean(axis=2).astype(np.uint8))
    p.wait(); os.remove(f)
    n = len(fr); bri = np.array([x.mean() for x in fr]); dif = np.array([0] + [np.abs(fr[i].astype(int) - fr[i - 1]).mean() for i in range(1, n)])
    face = np.zeros(n)
    for i in range(n):
        g = fr[i]; fs = list(fc.detectMultiScale(g, 1.15, 5, minSize=(18, 18))) + list(fp.detectMultiScale(g, 1.15, 5, minSize=(18, 18)))
        face[i] = max([a * b for (_, _, a, b) in fs], default=0) / (320 * 180)
    cut = dif > 28
    segs = []; i = max(int(20 * 2), 0); end = n - int(25 * 2)
    while i < end - 6:
        j = i
        while j < end and j - i < 12 and not (j > i and cut[j]) and face[j] < 0.006 and bri[j] > 38: j += 1
        L = (j - i) / 2
        if L >= 3:
            mot = float(dif[i + 1:j].mean()); stat = mot < 1.2
            if not stat: segs.append({'s': i / 2, 'e': j / 2, 'mot': round(mot, 2), 'bri': round(float(bri[i:j].mean()), 1)})
            i = j
        else: i = j + 1
    if len(segs) > 30: segs = [segs[round(k * (len(segs) - 1) / 29)] for k in range(30)]
    os.makedirs('out/hj', exist_ok=True)
    for sg in segs:
        a, b = int(sg['s'] * 2), int(sg['e'] * 2) - 1
        ix = [round(a + (b - a) * q / 3) for q in range(4)]
        cv2.imwrite(f"out/hj/{id}__{int(sg['s'] * 10)}.jpg", cv2.cvtColor(np.hstack([col[q] for q in ix]), cv2.COLOR_RGB2BGR), [cv2.IMWRITE_JPEG_QUALITY, 82])
    out[id] = {'dur': dur, 'w': w, 'h': h, 'segs': segs}
    del col, fr
    print(id, round(dur), 's', len(segs), 'tramos', flush=True)
json.dump(out, open('out/ycand_' + S + '.json', 'w'))
PY
cd out && tar -cf ycand_${S}.tar ycand_${S}.json hj && cd .. && put out/ycand_${S}.tar
