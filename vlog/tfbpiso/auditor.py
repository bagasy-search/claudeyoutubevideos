# tfbpiso — §4 AUDITOR sobre el MP4 FINAL: compuertas del minuto 1 (0 silencios, ≥20 cortes), streams (tv/bt709,
# cuadros == TOTAL, pts==dts), QR decodificable con cv2, hoja del minuto 1 y 1 cuadro cada 30 s.
# Uso: python vlog/tfbpiso/auditor.py <final.mp4> <TOTAL_FRAMES> <qr_seg>   → exit 1 si una compuerta falla, 2 si no midió
import sys, subprocess, json, re, os
import cv2
from PIL import Image, ImageDraw
mp4, total, qr_t = sys.argv[1], int(sys.argv[2]), float(sys.argv[3])
out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "_auditor"); os.makedirs(out, exist_ok=True)
fail = []
def run(a): return subprocess.run(a, capture_output=True, text=True)
# 1) silencios en el minuto 1
r = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", mp4, "-af", "silencedetect=noise=-32dB:d=0.3", "-f", "null", "-"])
sil = re.findall(r"silence_start: ([\d.]+)", r.stderr)
if "silencedetect" not in r.stderr and "size=" not in r.stderr: print("⛔ silencedetect NO MIDIÓ"); sys.exit(2)
print("silencios min 1:", len(sil), sil[:10]); (fail.append("silencios") if sil else None)
# 2) cortes del minuto 1
r = run(["ffmpeg", "-hide_banner", "-t", "60", "-i", mp4, "-vf", "select='gt(scene,0.3)',showinfo", "-f", "null", "-"])
cuts = re.findall(r"pts_time:([\d.]+)", r.stderr)
print("cortes min 1:", len(cuts), [round(float(c), 1) for c in cuts])
if len(cuts) < 20: fail.append(f"cortes {len(cuts)}<20")
gaps = [float(b) - float(a) for a, b in zip([0] + cuts, cuts + [60])]
print("toma más larga min 1: %.2f s" % max(gaps))
# 3) streams
p = json.loads(run(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", mp4]).stdout)
v = [s for s in p["streams"] if s["codec_type"] == "video"][0]
nb = int(run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", mp4]).stdout.strip().strip(","))
print("video", v["width"], v["height"], v.get("r_frame_rate"), v.get("color_range"), v.get("color_space"), v.get("color_primaries"), v.get("color_transfer"), "cuadros", nb, "/", total)
if nb != total: fail.append(f"cuadros {nb}!={total}")
if v.get("color_range") != "tv" or v.get("color_space") != "bt709": fail.append("color")
pk = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-read_intervals", "%+10", "-show_entries", "packet=pts,dts", "-of", "csv=p=0", mp4]).stdout.split()
bad = sum(1 for l in pk if len(set(l.split(","))) > 1)
print("pts!=dts en los primeros 10 s:", bad); (fail.append("pts!=dts") if bad else None)
# 4) QR
ok = False
for dt in (0, 1.0, 2.0, 3.0):
    fn = os.path.join(out, f"qr_{dt}.png"); run(["ffmpeg", "-v", "error", "-y", "-ss", str(qr_t + dt), "-i", mp4, "-frames:v", "1", fn])
    d, pts, _ = cv2.QRCodeDetector().detectAndDecode(cv2.imread(fn))
    if d: print("QR:", d, "en", qr_t + dt); ok = "constructorlibre.com" in d; break
if not ok: fail.append("QR")
# 5) hojas: minuto 1 (1 cuadro/2 s) y 1 cada 30 s
def hoja(ts, name, cols=6, w=320):
    ims = []
    for t in ts:
        fn = os.path.join(out, "_t.jpg"); run(["ffmpeg", "-v", "error", "-y", "-ss", str(t), "-i", mp4, "-frames:v", "1", "-vf", f"scale={w}:-2", fn])
        try: ims.append((t, Image.open(fn).copy()))
        except Exception: pass
    h = ims[0][1].height; rows = (len(ims) + cols - 1) // cols
    S = Image.new("RGB", (cols * w, rows * (h + 18))); dr = ImageDraw.Draw(S)
    for i, (t, im) in enumerate(ims):
        x, y = (i % cols) * w, (i // cols) * (h + 18); S.paste(im, (x, y + 18)); dr.text((x + 3, y + 2), f"{int(t // 60)}:{t % 60:04.1f}", fill="yellow")
    S.save(os.path.join(out, name), quality=82)
dur = float(p["format"]["duration"])
hoja([i * 2 + 0.5 for i in range(30)], "min1.jpg")
hoja([i * 30 + 5 for i in range(int(dur // 30))], "cada30.jpg", cols=6)
print("hojas en", out)
print("⛔ FALLA:", fail) if fail else print("✓ compuertas OK")
sys.exit(1 if fail else 0)
