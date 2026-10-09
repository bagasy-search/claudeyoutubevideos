# AUDITOR de olsup sobre el MP4 FINAL (fail-closed: cada compuerta imprime lo que MIDIÓ; exit 2 = no midió).
# python vlog/olsup/audit.py <final.mp4>
import sys, json, re, subprocess, os
import numpy as np
R = "D:/Proyectos/video2-wt/olsup/"
mp4 = sys.argv[1]
ts = open(R + "src/olsup/timeline_olsup.gen.ts", encoding="utf8").read()
grab = lambda k: json.loads(re.search(rf"export const {k}: any\[\] = (.*);", ts).group(1))
TL, OV = grab("TL"), grab("OV")
TOTAL = int(re.search(r"TOTAL_FRAMES_OLSUP = (\d+)", ts).group(1))
res = []; fails = []
def gate(name, val, ok, unit="", note=""):
    st = "OK " if ok else "FALLA"
    print(f"GATE {name}: midió={val}{unit} {note} → {st}")
    res.append(dict(gate=name, val=val, ok=bool(ok)))
    if not ok: fails.append(name)
def run(cmd, **k): return subprocess.run(cmd, capture_output=True, text=True, **k)
def probe(entries, sel="v:0"):
    r = run(["ffprobe", "-v", "error", "-select_streams", sel, "-show_entries", entries, "-of", "json", mp4]); return json.loads(r.stdout)
# 1 cuadros == TOTAL_FRAMES
r = run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets,pix_fmt,color_range,color_space,color_primaries,color_transfer,r_frame_rate,has_b_frames,width,height", "-of", "json", mp4])
s = json.loads(r.stdout)["streams"][0]
gate("cuadros == TOTAL_FRAMES", int(s["nb_read_packets"]), int(s["nb_read_packets"]) == TOTAL, "", f"(esperado {TOTAL})")
gate("resolución/fps", f'{s["width"]}x{s["height"]} {s["r_frame_rate"]}', (s["width"], s["height"], s["r_frame_rate"]) == (1920, 1080, "30/1"))
gate("yuv420p/tv/bt709", f'{s["pix_fmt"]}/{s.get("color_range")}/{s.get("color_space")}', s["pix_fmt"] == "yuv420p" and s.get("color_range") == "tv" and s.get("color_space") == "bt709")
# 2 pts==dts (sin B-frames)
r = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "packet=pts,dts", "-of", "csv=p=0", mp4])
rows = [l.split(",") for l in r.stdout.strip().splitlines() if "," in l]
bad = sum(1 for a in rows if a[0] != a[1])
gate("pts==dts (paquetes distintos)", bad, len(rows) > 1000 and bad == 0, "", f"sobre {len(rows)} paquetes")
# 3 audio: LUFS y duración
r = run(["ffmpeg", "-hide_banner", "-i", mp4, "-af", "ebur128=peak=true", "-vn", "-f", "null", "-"])
m = re.findall(r"I:\s+(-?[0-9.]+) LUFS", r.stderr); lufs = float(m[-1]) if m else None
gate("LUFS integrado", lufs, lufs is not None and abs(lufs + 16) <= 0.7, " LUFS", "(objetivo -16 ±0,7)")
dv = float(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=duration", "-of", "csv=p=0", mp4]).stdout.strip().strip(",").split(",")[0])
da = float(run(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries", "stream=duration", "-of", "csv=p=0", mp4]).stdout.strip().strip(",").split(",")[0])
gate("audio == video (duración)", f"{da:.3f}/{dv:.3f}", abs(da - dv) < 0.06, " s")
# 4 sync 0 ms contra el máster en 4 puntos (correlación cruzada de envolvente)
def pcm(path, ss, t):
    o = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(ss), "-t", str(t), "-i", path, "-ac", "1", "-ar", "8000", "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(o, np.float32)
lags = []
for t0 in (100, 420, 800, 1180):
    a = pcm(mp4, t0, 12); b = pcm(R + "public/olsup.wav", t0, 12)
    n = min(len(a), len(b)); a = a[:n]; b = b[:n]
    ea = np.abs(a); eb = np.abs(b)
    ea = np.convolve(ea, np.ones(40) / 40, "same"); eb = np.convolve(eb, np.ones(40) / 40, "same")
    ea -= ea.mean(); eb -= eb.mean()
    c = np.correlate(ea, eb, "full"); lag = (np.argmax(c) - (n - 1)) / 8000 * 1000
    lags.append(lag)
gate("sync vs máster (4 puntos)", [round(x, 1) for x in lags], all(abs(x) <= 20 for x in lags), " ms")
# 5 minuto 1: silencios y cortes
r = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", mp4, "-af", "silencedetect=noise=-32dB:d=0.3", "-f", "null", "-"])
sil = len(re.findall(r"silence_start", r.stderr))
gate("minuto 1: silencios (>0,3 s, -32 dB)", sil, sil == 0)
r = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", mp4, "-vf", "select='gt(scene,0.12)',showinfo", "-an", "-f", "null", "-"])
cuts = len(re.findall(r"pts_time", r.stderr))
gate("minuto 1: cortes (scene>0,12)", cuts, cuts >= 20)
# 6 negros
r = run(["ffmpeg", "-hide_banner", "-i", mp4, "-vf", "blackdetect=d=0.2:pix_th=0.10", "-an", "-f", "null", "-"])
neg = re.findall(r"black_start:([0-9.]+)", r.stderr)
gate("negros (>0,2 s)", len(neg), len(neg) == 0, "", ("en " + ",".join(neg[:6])) if neg else "")
# 7 % avatar y % real (del timeline generado)
tot = sum(c["dur"] for c in TL)
av = sum(c["dur"] for c in TL if c["k"] == "av" or c.get("fallback")) / tot * 100
real = sum(c["dur"] for c in TL if (c["k"] in ("st", "ar") or (c["k"] in ("vl", "kf") and c.get("src")))) / tot * 100
gate("avatar visible %", round(av, 1), 15 <= av <= 32, "%")
gate("metraje REAL % (stock+archivo+agnes filmado)", round(real, 1), real >= 25, "%")
# 8 los 30 platos en orden (placas OleCountdown / OleCountdownCard)
seq = []
for c in TL:
    if c["k"] == "comp" and c.get("cname") == "OleCountdownCard": seq.append((c["from"], c["props"]["n"]))
for o in OV:
    if o["name"] == "OleCountdown": seq.append((o["from"], o["props"]["n"]))
seq.sort(); ns = [n for _, n in seq]
gate("30 platos presentes y en orden", len(ns), ns == list(range(30, 0, -1)), "", f"orden={ns[:6]}…")
# 9 QR legible en el cuadro rendeado
try:
    import cv2
    cta = [c for c in TL if c["k"] == "comp" and c.get("cname") == "OleCTA"]
    ok = 0; url = "https://ole-camp-cookbook.vercel.app/?src=ole-suppers"
    for c in cta:
        for frac in (0.6, 0.8):
            tt = (c["from"] + c["dur"] * frac) / 30
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{tt:.2f}", "-i", mp4, "-frames:v", "1", R + "out/_qr.png"])
            v, _, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(R + "out/_qr.png"))
            if v == url: ok += 1
    gate("QR legible en el cuadro (cv2)", f"{ok}/{len(cta) * 2}", ok >= 2 and cta and ok >= len(cta))
except Exception as e:
    print("GATE QR: NO MIDIÓ", e); fails.append("QR no midió")
# 10 hoja de contactos
os.makedirs(R + "out/audit", exist_ok=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mp4, "-vf", "fps=1/12,scale=384:-1,tile=6x8", "-frames:v", "3", R + "out/audit/hoja_%d.jpg"])
json.dump(res, open(R + "out/audit/gates.json", "w"), indent=1)
print("\nFALLAS:", fails if fails else "ninguna")
sys.exit(1 if fails else 0)
