# tfbpiedra — §4 AUDITOR sobre el MP4 FINAL: compuertas medidas (exit 1 si alguna falla, exit 2 si NO pudo medir).
#  · streams: 1920x1080, 30/1, tv, bt709, cuadros == TOTAL, audio presente
#  · minuto 1: 0 silencios (silencedetect -32 dB d=0.3) y ≥ 20 cortes (select gt(scene,0.3))
#  · QR decodifica (cv2) en algún cuadro de cada ventana de QR
#  · hojas: minuto 1 (1 cuadro/2 s) + 1 cuadro cada 30 s  →  vlog/tfbpiedra/audit/
import json, re, subprocess, sys, os
import numpy as np
R = "D:/Proyectos/video2-wt/tfbpiedra/"; V = R + "vlog/tfbpiedra/"; A = V + "audit/"; os.makedirs(A, exist_ok=True)
mp4 = sys.argv[1]; TOTAL = int(sys.argv[2])
NW = 0x08000000
def sh(a): return subprocess.run(a, capture_output=True, text=True, creationflags=NW)
fallas, nomide = [], []
p = json.loads(sh(["ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", mp4]).stdout or "{}")
vs = [s for s in p.get("streams", []) if s["codec_type"] == "video"]; au = [s for s in p.get("streams", []) if s["codec_type"] == "audio"]
if not vs: nomide.append("sin stream de video")
else:
    v = vs[0]
    for k, want in [("width", 1920), ("height", 1080), ("r_frame_rate", "30/1"), ("color_range", "tv"), ("color_space", "bt709"), ("color_primaries", "bt709"), ("color_transfer", "bt709")]:
        if v.get(k) != want: fallas.append(f"{k}={v.get(k)} (quiero {want})")
    n = sh(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", mp4]).stdout.strip()
    if not n.isdigit(): nomide.append("no pude contar cuadros")
    elif int(n) != TOTAL: fallas.append(f"cuadros {n} != {TOTAL}")
    print("cuadros", n, "/", TOTAL)
if not au: fallas.append("sin audio")
# minuto 1
s = sh(["ffmpeg", "-t", "60", "-i", mp4, "-af", "silencedetect=noise=-32dB:d=0.3", "-f", "null", "-"]).stderr
sil = re.findall(r"silence_start: ([\d.]+)", s)
if "silencedetect" not in s and "size=" not in s: nomide.append("silencedetect no corrió")
print("silencios min 1:", len(sil), sil[:10])
if sil: fallas.append(f"{len(sil)} silencios en el minuto 1: {sil[:6]}")
s = sh(["ffmpeg", "-t", "60", "-i", mp4, "-vf", "select='gt(scene,0.3)',showinfo", "-an", "-f", "null", "-"]).stderr
cuts = re.findall(r"pts_time:([\d.]+)", s)
print("cortes min 1:", len(cuts))
if len(cuts) < 20: fallas.append(f"sólo {len(cuts)} cortes en el minuto 1 (quiero ≥20)")
# QR: en cada ventana de QR del timeline, 3 cuadros, al menos uno decodifica la URL
try:
    import cv2
    T = open(R + "src/tfbpiedra/timeline.gen.ts", encoding="utf-8").read()
    FX = json.loads(re.search(r"export const FX: Fx\[\] = (\[.*?\]);\n", T, re.S).group(1))
    qrs = [x for x in FX if x["kind"] == "qr"]
    for q in qrs:
        ok = False
        for fr in [q["from"] + 12, q["from"] + q["dur"] // 2, q["from"] + q["dur"] - 12]:
            o = A + f"qr_{fr}.png"; sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{fr / 30:.3f}", "-i", mp4, "-frames:v", "1", o])
            im = cv2.imread(o)
            if im is not None:
                d, _, _ = cv2.QRCodeDetector().detectAndDecode(im)
                if "constructorlibre.com" in (d or ""): ok = True; print("QR ok en", fr, d); break
        if not ok: fallas.append(f"QR no decodifica en la ventana {q['from']}..{q['from'] + q['dur']}")
    if not qrs: fallas.append("no hay QR en el timeline")
except Exception as e: nomide.append("QR: " + str(e)[:100])
# hojas
def hoja(ts, name, cols):
    fs = []
    for t in ts:
        o = A + f"f_{t:07.2f}.jpg"; sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", mp4, "-frames:v", "1", "-vf", "scale=384:-2", o]); fs.append(o)
    sh(["python", V + "hoja.py", A + name, str(cols), "384"] + fs)
dur = float(p.get("format", {}).get("duration", 0) or 0)
hoja([i * 2 + 0.5 for i in range(30)], "min1.jpg", 6)
hoja([i * 30 + 1 for i in range(int(dur // 30) + 1)], "cada30.jpg", 6)
print("FALLAS:", fallas or "ninguna"); print("NO MIDIÓ:", nomide or "-")
sys.exit(2 if nomide else 1 if fallas else 0)
