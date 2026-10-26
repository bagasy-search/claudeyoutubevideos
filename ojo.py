# ojo.py <slug>: planillas de contacto + tiras de cortes + lageos (cuadro repetido dentro de movimiento) del MP4 final.
import sys, json, os, subprocess, cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont
S = sys.argv[1]; os.makedirs("out", exist_ok=True)
cortes = json.load(open("cortes.json"))
cap = cv2.VideoCapture(f"{S}.mp4"); fps = cap.get(cv2.CAP_PROP_FPS); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
fnt = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 22)
quiero = {}  # cuadro -> etiqueta
for f in range(0, n, int(round(fps * 10))): quiero.setdefault(f, ("g", f))
for i, t in enumerate(cortes):
    for j, dt in enumerate((-0.5, 0.1, 1.0, 2.0, 3.0)):
        f = min(n - 1, max(0, int(round((t + dt) * fps))))  # 26-oct: el 1er corte pedía -0,5 s → casillero vacío que el director leía como «cuadro 0 negro»
        if 0 <= f < n: quiero[f] = quiero.get(f, ()) + (("c", i, j),) if f in quiero else (("c", i, j),)
grilla, tiras = {}, {}
dif = np.zeros(n); prev = None; f = 0
while True:
    ok, im = cap.read()
    if not ok: break
    g = cv2.cvtColor(cv2.resize(im, (320, 180)), cv2.COLOR_BGR2GRAY).astype(np.float32)
    if prev is not None: dif[f] = np.mean(np.abs(g - prev))
    prev = g
    if f in quiero:
        th = Image.fromarray(cv2.cvtColor(cv2.resize(im, (480, 270)), cv2.COLOR_BGR2RGB))
        d = ImageDraw.Draw(th); s = f / fps; d.rectangle([0, 0, 120, 28], fill="black"); d.text((6, 2), f"{int(s//60)}:{s%60:05.2f}", font=fnt, fill="yellow")
        q = quiero[f]
        if f % int(round(fps * 10)) == 0: grilla[f] = th
        for e in (q if isinstance(q[0], tuple) else ()):
            if e[0] == "c": tiras.setdefault(e[1], {})[e[2]] = th
    f += 1
n = f
# planillas 4x4 de la grilla de 10 s
ks = sorted(grilla)
for h in range(0, len(ks), 16):
    o = Image.new("RGB", (480 * 4, 270 * 4))
    for i, k in enumerate(ks[h:h + 16]): o.paste(grilla[k], ((i % 4) * 480, (i // 4) * 270))
    o.save(f"out/grilla_{S}_{h//16:02d}.jpg", quality=80)
# tiras de cortes: 5 cuadros por corte, 6 cortes por hoja
cs = sorted(tiras)
for h in range(0, len(cs), 6):
    o = Image.new("RGB", (480 * 5, 270 * 6), "black")
    for r, c in enumerate(cs[h:h + 6]):
        for j, th in tiras[c].items(): o.paste(th, (j * 480, r * 270))
    o.save(f"out/cortes_{S}_{h//6:02d}.jpg", quality=80)
# lageos: cuadro casi idéntico al anterior (dif<0.15) con movimiento claro a ambos lados (>0.8)
lag = []
for i in range(2, n - 1):
    if dif[i] < 0.15 and dif[i - 1] > 0.8 and dif[i + 1] > 0.8: lag.append(round(i / fps, 2))
# tirón: salto brusco aislado (dif > 6x la mediana local y >4), fuera de cortes
cortf = set(int(round(t * fps)) + k for t in cortes for k in range(-2, 3))
tir = []
for i in range(5, n - 5):
    loc = np.median(dif[i - 5:i + 6])
    if i not in cortf and dif[i] > 4 and dif[i] > 6 * max(loc, 0.3): tir.append(round(i / fps, 2))
# tiras de tirones: cuadro anterior / el del salto / el siguiente (hasta 12)
if tir:
    sel = tir[:: max(1, len(tir) // 12)][:12]
    cap2 = cv2.VideoCapture(f"{S}.mp4"); o = Image.new("RGB", (480 * 3, 270 * len(sel)), "black")
    for r, t in enumerate(sel):
        fi = int(round(t * fps))
        for j, ff in enumerate((fi - 1, fi, fi + 1)):
            cap2.set(cv2.CAP_PROP_POS_FRAMES, ff); ok, im = cap2.read()
            if ok:
                th = Image.fromarray(cv2.cvtColor(cv2.resize(im, (480, 270)), cv2.COLOR_BGR2RGB)); d = ImageDraw.Draw(th); d.rectangle([0, 0, 170, 28], fill="black"); d.text((6, 2), f"{ff} {ff/fps:.2f}", font=fnt, fill="yellow"); o.paste(th, (j * 480, r * 270))
    o.save(f"out/tirones_{S}.jpg", quality=80)
quietos = []; a = None
for i in range(1, n):
    if dif[i] < 0.05:
        a = i if a is None else a
    else:
        if a is not None and (i - a) / fps >= 1.5: quietos.append([round(a / fps, 2), round((i - a) / fps, 2)])
        a = None
pr = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=r_frame_rate,avg_frame_rate,nb_frames", "-of", "json", f"{S}.mp4"], capture_output=True, text=True).stdout
json.dump({"slug": S, "fps": fps, "cuadros": n, "probe": json.loads(pr), "lageos": lag, "tirones": tir, "quietos_1_5s": quietos}, open(f"out/lag_{S}.json", "w"), indent=1)
print("lageos", len(lag), "tirones", len(tir), "quietos", len(quietos))
