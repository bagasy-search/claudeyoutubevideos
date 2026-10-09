# Pausas a recortar (fumoscasf): cortar casi todos los silencios sin cortar s finales ni mientras habla.
#   python vlog/fumoscasf/pausas.py → vlog/fumoscasf/cortes.json [[a,b],…] (tramos a QUITAR, en s del máster crudo)
import json, math, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/fumoscasf/"; D = R + "vlog/fumoscasf/"; SR = 16000; H = 160  # 10 ms
MIN, COLA, PRE = 0.30, 0.12, 0.06
WAV = R + "public/fumoscasf_raw.wav"
rd = lambda af: np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", WAV, "-af", af, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
def db(x): n = len(x) // H; return 20 * np.log10(np.sqrt((x[:n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
full = db(rd("highpass=f=80")); hi = db(rd("highpass=f=4000,lowpass=f=7900"))
n = min(len(full), len(hi)); full, hi = full[:n], hi[:n]
vf = full > np.percentile(full, 20) + 12; vh = hi > np.percentile(hi, 20) + 10
voz = vf | vh
WM = json.load(open(R + "_v3/fumoscasf_wordms.json", encoding="utf8"))
cortes = []
for i in range(len(WM) - 1):
    a0, b0 = WM[i]["e"], WM[i + 1]["s"]
    if b0 - a0 < MIN: continue
    fa, fb = int((a0 - 0.15) * 100), int((b0 + 0.15) * 100)
    seg = voz[fa:fb]
    best, cur, st = (0, 0, 0), 0, 0
    for k, v in enumerate(seg):
        if not v: cur += 1; st = st if cur > 1 else k
        else: cur = 0
        if cur > best[0]: best = (cur, k - cur + 1, k + 1)
    L, s, e = best
    s_t, e_t = (fa + s) / 100, (fa + e) / 100
    if e_t - s_t < MIN: continue
    fin = WM[i]["w"][-1] in ".?!:;"
    a = max(s_t + COLA, a0 + 0.10) + (0.07 if fin else 0); b = min(e_t - PRE, b0 - 0.06)
    a, b = math.ceil(a * 30) / 30, math.floor(b * 30) / 30  # alineado a CUADRO
    if b - a > 0.05: cortes.append([round(a, 5), round(b, 5)])
json.dump(cortes, open(D + "cortes.json", "w"), indent=0)
tot = sum(b - a for a, b in cortes); T = n / 100
print(f"pausas recortadas {len(cortes)} · quito {tot:.1f} s de {T:.1f} → {T - tot:.1f} s ({(T - tot) / 60:.2f} min) · minuto 1: {sum(b - a for a, b in cortes if a < 60):.1f} s")
