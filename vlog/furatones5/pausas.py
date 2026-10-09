# Pausas a recortar (furatones5, pedido del creador: "cortar casi todos los silencios sin cortar s finales ni mientras habla").
# Voz = máster con sala. Hablando = energía total O energía de agudos 4-8 kHz (s, f, ch finales) sobre su piso; sólo ENTRE palabras
# (tiempos ASR) y pausa > MIN. Se deja COLA s después del último sonido y PRE s antes del siguiente → pausa final ≈ COLA+PRE.
#   python vlog/furatones5/pausas.py → vlog/furatones5/cortes.json [[a,b],…] (tramos a QUITAR, en s del máster)
import json, subprocess, numpy as np
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"; SR = 16000; H = 160  # 10 ms
MIN, COLA, PRE = 0.30, 0.12, 0.06
rd = lambda af: np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", R + "public/furatones5.wav", "-af", af, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
def db(x): n = len(x) // H; return 20 * np.log10(np.sqrt((x[:n * H].reshape(n, H) ** 2).mean(1)) + 1e-9)
full = db(rd("highpass=f=80")); hi = db(rd("highpass=f=4000,lowpass=f=7900"))
n = min(len(full), len(hi)); full, hi = full[:n], hi[:n]
vf = full > np.percentile(full, 20) + 12; vh = hi > np.percentile(hi, 20) + 10
voz = vf | vh
WM = json.load(open(R + "_v3/furatones5_wordms.json", encoding="utf8"))
cortes = []
for i in range(len(WM) - 1):
    a0, b0 = WM[i]["e"], WM[i + 1]["s"]
    if b0 - a0 < MIN: continue
    # dentro del hueco ASR, buscar el último cuadro con voz después de a0-0.1 y el primero antes de b0+0.1
    fa, fb = int((a0 - 0.15) * 100), int((b0 + 0.15) * 100)
    seg = voz[fa:fb]
    # bloque de silencio más largo dentro del hueco
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
    if b - a > 0.05: cortes.append([round(a, 3), round(b, 3)])
json.dump(cortes, open(D + "cortes.json", "w"), indent=0)
tot = sum(b - a for a, b in cortes); T = n / 100
print(f"pausas recortadas {len(cortes)} · quito {tot:.1f} s de {T:.1f} → {T - tot:.1f} s ({(T - tot) / 60:.2f} min) · minuto 1: {sum(b - a for a, b in cortes if a < 60):.1f} s")
