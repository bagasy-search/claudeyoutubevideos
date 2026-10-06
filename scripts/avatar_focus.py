# avatar_focus.py <slug> — detecta dónde está la CARA del presentador en el frame del avatar
# (para centrar bien el split 50/50). Sin dependencias pesadas: ffmpeg saca ~24 frames chicos en
# gris crudo, numpy calcula la VARIANZA TEMPORAL por pixel (la cabeza/boca se mueven, el fondo no)
# restringida a la franja SUPERIOR (donde está la cara, no las manos). El pico marca x/y de la cara.
# Escribe public/<slug>_focus.json = {"x":0..1,"y":0..1}.
import sys, subprocess, json, os, numpy as np
slug = sys.argv[1]
src = f"public/{slug}_opt.mp4"
if not os.path.exists(src): sys.exit(f"no existe {src}")
W,H,N = 160,90,24
# 24 frames repartidos por el video, gris crudo a stdout
dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","default=nw=1:nk=1",src],capture_output=True,text=True).stdout.strip() or 60)
fps = N/max(dur,1)
raw = subprocess.run(["ffmpeg","-v","error","-i",src,"-vf",f"fps={fps},scale={W}:{H},format=gray","-frames:v",str(N),"-f","rawvideo","-"],capture_output=True).stdout
arr = np.frombuffer(raw[:W*H*N], dtype=np.uint8).astype(np.float32).reshape(-1,H,W)
std = arr.std(axis=0)  # varianza temporal por pixel
# franja de la CARA: filas 8%..55% (cabeza), evita manos/torso abajo
top = std[int(H*0.08):int(H*0.55), :]
colvar = top.sum(axis=0)
# suavizar y tomar el pico
k = np.ones(9)/9; colvar = np.convolve(colvar, k, mode="same")
x = float(np.argmax(colvar))/(W-1)
# y: fila de más varianza SOLO en la zona de la cabeza (8%..45%); la cara vive en el tercio superior
band = std[int(H*0.08):int(H*0.45), :]
rowvar = np.convolve(band.sum(axis=1), np.ones(5)/5, mode="same")
y = (int(H*0.08) + float(np.argmax(rowvar)))/(H-1)
# clamp sano: cara en el tercio superior, x sin pegarse a los bordes
x = min(0.82, max(0.18, x)); y = min(0.40, max(0.20, y))
json.dump({"x":round(x,3),"y":round(y,3)}, open(f"public/{slug}_focus.json","w"))
print(f"{slug} focus -> x={x:.3f} y={y:.3f}")
