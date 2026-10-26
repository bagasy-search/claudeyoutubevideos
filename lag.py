# lag.py <slug> <mp4>: tirones = cuadro repetido en medio de movimiento (diff≈0 entre dos cuadros que se mueven)
#   y saltos = diff muy por encima de los vecinos sin ser corte. 1 línea JSON + lista.
import sys, json, subprocess, numpy as np
s, f = sys.argv[1], sys.argv[2]; W, H = 320, 180
p = subprocess.Popen(["ffmpeg","-loglevel","error","-i",f,"-vf",f"scale={W}:{H}","-f","rawvideo","-pix_fmt","gray","-"],stdout=subprocess.PIPE)
d, prev = [], None
while True:
    b = p.stdout.read(W*H)
    if len(b) < W*H: break
    g = np.frombuffer(b, np.uint8).astype(np.int16)
    d.append(0.0 if prev is None else float(np.abs(g-prev).mean())); prev = g
d = np.array(d); n = len(d); fps = 30
dup = [i for i in range(2, n-2) if d[i] < 0.05 and d[i-1] > 0.6 and d[i+1] > 0.6]
salto = []
for i in range(3, n-3):
    v = np.median(np.r_[d[i-3:i], d[i+1:i+4]])
    if v > 0.3 and d[i] > 4*v and d[i] < 12: salto.append(i)  # >12 ≈ corte de escena
par = sorted(set(round(i/fps,1) for i in dup)); sal = sorted(set(round(i/fps,1) for i in salto))
print(json.dumps({"slug": s, "cuadros": n, "tirones_dup": len(dup), "saltos": len(salto), "dup_s": par[:300], "salto_s": sal[:300]}))
