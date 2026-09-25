# §4 AUDITOR sobre el mp4 FINAL de falaurel. python auditor.py [mp4]
# 1 cuadro cada 20 s → agnes-3.0-flash (identidad vs cara ref, luz, laurel sin flores rosadas) + hoja de contactos;
# QR decodificado en el final; sync contra la mezcla; cuadros == TOTAL; PTS parejos; color; primer/último cuadro.
import sys, os, json, base64, subprocess, re, urllib.request, concurrent.futures as cf
import numpy as np, cv2
from PIL import Image
W = "D:/Proyectos/video2-wt/falaurel/"; MP4 = sys.argv[1] if len(sys.argv) > 1 else "D:/videosdeclaude/falaurel.mp4"
O = "D:/rtmp/falaurel_audit/"; os.makedirs(O, exist_ok=True); TOTAL = 50157; FPS = 30
env = dict(l.strip().split("=", 1) for l in open(W + ".env", encoding="utf-8") if "=" in l and not l.startswith("#"))
KEYS = [k.strip() for k in (env.get("AGNES_KEYS") or env["AGNES_KEY"]).split(",") if k.strip()]
def sh(*a): return subprocess.run(a, check=True, capture_output=True, text=True).stdout
def uri(p): return "data:image/jpeg;base64," + base64.b64encode(open(p, "rb").read()).decode()
TL = json.load(open(W + "vlog/falaurel/timeline.json", encoding="utf-8"))["TL"]
def kind_at(f):
    ks = [c["kind"] for c in TL if c["from"] <= f < c["from"] + c["dur"]]
    return "lam" if "lam" in ks else ("T" if any("T_" in (c.get("src") or "") for c in TL if c["from"] <= f < c["from"] + c["dur"]) else "vid")
# ---- muestras cada 20 s
ts = list(range(2, int(TOTAL / FPS), 20))
for t in ts:
    p = O + f"f{t:05d}.jpg"
    if not os.path.exists(p): sh("ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", MP4, "-frames:v", "1", "-vf", "scale=768:432", p)
FACE = O + "face.jpg"; Image.open(W + "public/ref_falaurel_facecrop.png").convert("RGB").save(FACE)
Q = ('Image 1 is a reference face. Image 2 is a frame from a home-cooking vlog. Answer ONLY JSON: {"presenter_visible":true/false,'
     '"same_person":true/false/null,"bright_daylight":true/false,"amber_or_dark":true/false,"pink_or_white_flowers":true/false,"issues":"short"}. '
     'same_person=null if the presenter\'s face is not visible (hands-only close-up, page, other person).')
def ask(t, i):
    body = json.dumps({"model": "agnes-3.0-flash", "messages": [{"role": "user", "content": [{"type": "text", "text": Q},
            {"type": "image_url", "image_url": {"url": uri(FACE)}}, {"type": "image_url", "image_url": {"url": uri(O + f"f{t:05d}.jpg")}}]}]})
    for k in range(3):
        try:
            r = urllib.request.Request("https://apihub.agnes-ai.com/v1/chat/completions", body.encode(), {"Authorization": "Bearer " + KEYS[(i + k) % len(KEYS)], "Content-Type": "application/json"})
            txt = json.load(urllib.request.urlopen(r, timeout=90))["choices"][0]["message"]["content"]
            return t, json.loads(re.search(r"\{.*\}", txt, re.S).group())
        except Exception as e: err = str(e)
    return t, {"error": err[:80]}
with cf.ThreadPoolExecutor(6) as ex: res = dict(ex.map(lambda a: ask(*a), [(t, i) for i, t in enumerate(ts)]))
flag = []
for t in ts:
    v = res[t]; k = kind_at(t * FPS)
    bad = "error" in v or v.get("same_person") is False or v.get("amber_or_dark") or not v.get("bright_daylight", True) or v.get("pink_or_white_flowers")
    if k == "lam" and "error" not in v: bad = False
    if bad: flag.append((t, k, v))
print(f"VISIÓN: {len(ts)} cuadros · marcados {len(flag)}")
for t, k, v in flag: print(f"  {t//60}:{t%60:02d} [{k}] {json.dumps(v, ensure_ascii=False)}")
# hoja de contactos (cuadros cada 20 s, marcados con borde rojo)
th = []
for t in ts:
    im = Image.open(O + f"f{t:05d}.jpg").resize((256, 144))
    if any(t == x[0] for x in flag): im = Image.fromarray(cv2.rectangle(np.array(im), (0, 0), (255, 143), (255, 0, 0), 6))
    th.append(im)
cols = 12; rows = (len(th) + cols - 1) // cols; sheet = Image.new("RGB", (256 * cols, 144 * rows), "white")
for i, im in enumerate(th): sheet.paste(im, ((i % cols) * 256, (i // cols) * 144))
sheet.save(O + "hoja_final.jpg", quality=85)
# ---- QR en el final
det = cv2.QRCodeDetector(); qrs = [c for c in TL if c["kind"] == "qr"]
for c in qrs:
    t = (c["from"] + min(60, c["dur"] // 2)) / FPS; p = O + f"qr_{int(t)}.png"
    sh("ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", MP4, "-frames:v", "1", p)
    val, _, _ = det.detectAndDecode(cv2.imread(p))
    print(f"QR {int(t)//60}:{int(t)%60:02d} dura {c['dur']/FPS:.1f}s → '{val}'", "✓" if val.startswith("https://drfederer.com/firmeza") else "⛔")
# ---- cuadros, PTS, color
n = int(re.search(r"\d+", sh("ffprobe", "-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", MP4)).group())
pts = [float(x) for x in sh("ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "packet=pts_time", "-of", "csv=p=0", MP4).split() if x]
d = np.diff(np.sort(np.array(pts)))
col = sh("ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=pix_fmt,color_range,color_space,color_primaries,color_transfer,r_frame_rate", "-of", "csv=p=0", MP4).strip()
au = sh("ffprobe", "-v", "error", "-select_streams", "a", "-show_entries", "stream=duration,channels,sample_rate", "-of", "csv=p=0", MP4).strip()
vd = sh("ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=duration", "-of", "csv=p=0", MP4).strip()
print(f"cuadros {n} vs TOTAL {TOTAL}", "✓" if n == TOTAL else "⛔", f"· PTS Δ min {d.min()*1000:.2f} max {d.max()*1000:.2f} ms", "✓" if d.max() - d.min() < 0.002 else "⛔")
print("color", col, "· video", vd, "s · audio", au)
# ---- sync: audio final vs mezcla (xcorr en 3 ventanas)
def pcm(p, ss, t):
    r = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(ss), "-t", str(t), "-i", p, "-ac", "1", "-ar", "8000", "-f", "f32le", "-"], capture_output=True)
    return np.frombuffer(r.stdout, np.float32)
for ss in (5, 800, 1600):
    a = pcm(MP4, ss, 20); b = pcm(W + "public/falaurel_mix.wav", ss, 20); m = min(len(a), len(b)); a, b = a[:m], b[:m]
    c = np.fft.irfft(np.fft.rfft(a, 2 * m) * np.conj(np.fft.rfft(b, 2 * m))); lag = int(np.argmax(c)); lag = lag - 2 * m if lag > m else lag
    print(f"sync @{ss}s: {lag/8:.1f} ms", "✓" if abs(lag / 8) <= 1 else "⛔")
lu = subprocess.run(["ffmpeg", "-i", MP4, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
print("loudness", re.findall(r"I:\s+(-?[\d.]+) LUFS", lu)[-1], "LUFS")
for nm, ss in (("primero", "0"), ("ultimo", f"{TOTAL/FPS-0.05:.2f}")):
    sh("ffmpeg", "-v", "error", "-y", "-ss", ss, "-i", MP4, "-frames:v", "1", "-vf", "scale=640:360", O + f"{nm}.jpg")
print("hoja:", O + "hoja_final.jpg")
