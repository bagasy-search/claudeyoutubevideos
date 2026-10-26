# lageos.py <slug> <mp4>: diff medio entre cuadros consecutivos (160x90 gris). Lageo = cuadro igual al anterior (d<0.15)
# con movimiento antes Y después (d>1.2 en ambos lados) → tirón visible. También tirones en costuras de chunks.
import sys, json, subprocess, numpy as np
S, src = sys.argv[1], sys.argv[2]
W, H = 160, 90
p = subprocess.Popen(["ffmpeg", "-loglevel", "error", "-i", src, "-vf", f"scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], stdout=subprocess.PIPE)
prev = None; d = []
while True:
    b = p.stdout.read(W * H)
    if len(b) < W * H: break
    a = np.frombuffer(b, np.uint8).astype(np.int16)
    if prev is not None: d.append(float(np.abs(a - prev).mean()))
    prev = a
d = np.array(d); n = len(d) + 1
lag = [i + 1 for i in range(1, len(d) - 1) if d[i] < 0.15 and d[i - 1] > 1.2 and d[i + 1] > 1.2]
# picos aislados (salto brusco 1 cuadro, típico de costura o cuadro de más)
pico = [i + 1 for i in range(1, len(d) - 1) if d[i] > 6 * max(d[i - 1], d[i + 1], 0.5) and d[i] > 8 and d[i - 1] < 3 and d[i + 1] < 3]
seg = {}
for c in lag: seg[c // 30] = seg.get(c // 30, 0) + 1
quieto = []  # tramos >4 s sin movimiento (d<0.3 sostenido)
run = 0
for i, x in enumerate(d):
    run = run + 1 if x < 0.3 else 0
    if run == 120: quieto.append(round((i - 119) / 30, 1))
print(json.dumps({"slug": S, "cuadros": n, "lageos": len(lag), "seg_con_lageo": sorted(seg.items(), key=lambda t: -t[1])[:40],
                  "picos": [round(c / 30, 2) for c in pico][:60], "quieto_4s_desde": quieto,
                  "mov_medio": round(float(d.mean()), 3)}))
