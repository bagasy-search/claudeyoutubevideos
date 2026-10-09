# AUDITOR del MP4 FINAL de olwinter2. Uso: python vlog/olwinter2/auditor.py <final.mp4>
# Compuertas (todas MEDIDAS; si una no pudo medir → exit 2, nunca "0" sin mirar):
#  cuadros == TOTAL_FRAMES · pts==dts (sin B-frames) · yuv420p/tv/bt709 · -16 LUFS ±0,8 · audio == video (±50 ms)
#  sync del audio del MP4 vs el máster (public/olwinter2.wav) en 4 puntos: lag 0 · minuto 1: ≥20 cortes y 0 silencios
#  0 negros · QR legible (cv2) en el cuadro del CTA · % avatar y % real del timeline · hojas de contacto (minuto 1 y c/30 s)
import json, re, subprocess, sys, os
import numpy as np
R = "D:/Proyectos/video2-wt/olwinter2/"
MP4 = sys.argv[1]; FPS = 30
res, nomidio = {}, []
def run(a, **k): return subprocess.run(a, capture_output=True, **({"text": True} | k))
ts = open(R + "src/olwinter2/timeline_olwinter2.gen.ts", encoding="utf8").read()
TOTAL = int(re.search(r"TOTAL_FRAMES_OLWINTER2 = (\d+)", ts).group(1))
TL = json.loads(re.search(r"export const TL: any\[\] = (.*);", ts).group(1))
OV = json.loads(re.search(r"export const OV: any\[\] = (.*);", ts).group(1))
# 1) cuadros y pts==dts
o = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets,pix_fmt,color_range,color_space,color_primaries,color_transfer,has_b_frames", "-of", "json", MP4]).stdout
try:
    s = json.loads(o)["streams"][0]
    res["cuadros"] = (int(s["nb_read_packets"]), TOTAL, int(s["nb_read_packets"]) == TOTAL)
    res["color"] = (s.get("pix_fmt"), s.get("color_range"), s.get("color_space"), s.get("color_primaries"), s.get("color_transfer"), s.get("pix_fmt") == "yuv420p" and s.get("color_range") == "tv" and s.get("color_space") == "bt709")
    res["sin_bframes"] = (s.get("has_b_frames"), str(s.get("has_b_frames")) == "0")
except Exception as e: nomidio.append(f"ffprobe video: {e}")
o = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-read_intervals", "%+30", "-show_entries", "packet=pts,dts", "-of", "csv=p=0", MP4]).stdout.split()
if o: res["pts_eq_dts_30s"] = (sum(1 for l in o if l.split(",")[0] != l.split(",")[1]), sum(1 for l in o if l.split(",")[0] != l.split(",")[1]) == 0)
else: nomidio.append("pts/dts")
# 2) duraciones y loudness
d = lambda sel: float(run(["ffprobe", "-v", "error", "-select_streams", sel, "-show_entries", "stream=duration", "-of", "csv=p=0", MP4]).stdout.strip().strip(",").split(",")[0] or 0)
dv, da = d("v:0"), d("a:0")
res["audio_vs_video"] = (round(dv, 3), round(da, 3), abs(dv - da) <= 0.05) if dv and da else nomidio.append("duraciones") or None
o = run(["ffmpeg", "-hide_banner", "-nostats", "-i", MP4, "-vn", "-af", "ebur128=peak=true:framelog=quiet", "-f", "null", "-"]).stderr
m = re.search(r"I:\s+(-?[0-9.]+) LUFS", o)
if m: res["lufs"] = (float(m.group(1)), abs(float(m.group(1)) + 16) <= 0.8)
else: nomidio.append("LUFS")
# 3) sync vs máster (envolvente 300-3400 Hz, tramas 10 ms) en 4 puntos
def env(f, t0, dur):
    raw = run(["ffmpeg", "-v", "error", "-ss", str(t0), "-t", str(dur), "-i", f, "-vn", "-ac", "1", "-ar", "8000", "-af", "highpass=f=300,lowpass=f=3400", "-f", "s16le", "-"], text=False).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32); n = len(x) // 80
    return np.sqrt((x[: n * 80].reshape(n, 80) ** 2).mean(1) + 1e-6)
lags = []
for t in [30, dv * 0.33, dv * 0.66, dv - 40]:
    a, b = env(MP4, t, 20), env(R + "public/olwinter2.wav", t, 20)
    if len(a) < 1000 or len(b) < 1000: nomidio.append(f"sync @{t:.0f}"); continue
    n = min(len(a), len(b)); a, b = a[:n], b[:n]; best, bl = -9, 0
    for L in range(-30, 31):
        x = a[max(0, L): n + min(0, L)]; y = b[max(0, -L): n - max(0, L)]
        r = np.corrcoef(x, y)[0, 1]
        if r > best: best, bl = r, L
    lags.append((round(t), bl * 10, round(float(best), 3)))
res["sync_ms"] = (lags, all(abs(l[1]) <= 10 for l in lags) and len(lags) == 4)
# 4) minuto 1: cortes y silencios
o = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", MP4, "-vf", "scale=320:180,select='gt(scene,0.3)',showinfo", "-an", "-f", "null", "-"]).stderr
cortes = len(re.findall(r"pts_time:", o)); res["min1_cortes"] = (cortes, cortes >= 20)
o = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", MP4, "-vn", "-af", "silencedetect=noise=-32dB:d=0.3", "-f", "null", "-"]).stderr
if "Output" in o or "size=" in o: sil = len(re.findall(r"silence_start", o)); res["min1_silencios"] = (sil, sil == 0)
else: nomidio.append("silencios min 1")
# 5) negros
o = run(["ffmpeg", "-hide_banner", "-i", MP4, "-vf", "scale=320:180,blackdetect=d=0.25:pix_th=0.08", "-an", "-f", "null", "-"]).stderr
neg = re.findall(r"black_start:([0-9.]+) black_end:([0-9.]+)", o); res["negros"] = (neg[:5], len(neg) == 0)
# 6) QR del CTA (cuadro medio del CTA a pantalla completa)
try:
    import cv2
    cta = [c for c in TL if c.get("k") == "comp" and c.get("name") == "OleCTA"][0]
    ok = []
    for f in [cta["from"] + int(cta["dur"] * k) for k in (0.4, 0.6, 0.8)]:
        run(["ffmpeg", "-v", "error", "-y", "-ss", f"{f / FPS:.3f}", "-i", MP4, "-frames:v", "1", R + "out/_qr.png"])
        v, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(R + "out/_qr.png")); ok.append(v)
    res["qr"] = (ok, any("ole-camp-cookbook.vercel.app" in v for v in ok))
except Exception as e: nomidio.append(f"QR: {e}")
# 7) % avatar / real / placeholders en el timeline
av = sum(c["dur"] for c in TL if c["k"] == "av"); real = sum(c["dur"] for c in TL if c.get("real"))
vlk = sum(c["dur"] for c in TL if c["k"] in ("vl", "kf"))
ph = [c for c in TL if (c["k"] in ("av", "vl", "kf") and not c.get("src")) or (c["k"] in ("img", "arch") and not c.get("img") and not c.get("clip"))]
res["avatar_pct"] = round(100 * av / TOTAL, 1); res["real_pct"] = (round(100 * real / TOTAL, 1), real / TOTAL >= 0.25)
res["agnes_filmado_pct"] = round(100 * vlk / TOTAL, 1); res["placeholders"] = (len(ph), len(ph) == 0)
# 8) hojas de contacto: minuto 1 cada 2 s y 1 cuadro cada 30 s
os.makedirs(R + "out/auditor", exist_ok=True)
run(["ffmpeg", "-v", "error", "-y", "-t", "60", "-i", MP4, "-vf", "fps=1/2,scale=384:216,tile=6x5", "-frames:v", "1", R + "out/auditor/min1.jpg"])
run(["ffmpeg", "-v", "error", "-y", "-i", MP4, "-vf", "fps=1/30,scale=384:216,tile=6x4", "-frames:v", "1", R + "out/auditor/cada30.jpg"])
fallas = [k for k, v in res.items() if isinstance(v, tuple) and v[-1] is False]
print(json.dumps(res, indent=1, default=str))
print("NO MIDIÓ:", nomidio) if nomidio else None
print("⛔ FALLAN:", fallas) if fallas else print("✅ compuertas medidas en verde")
sys.exit(2 if nomidio else (1 if fallas else 0))
