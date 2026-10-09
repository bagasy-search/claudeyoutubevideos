# Máster con SALA por bloque: voz seca v4 (voz/gate.json) → SoX por sala → bloques encadenados (pausa 0,35 s, la cola de eco
# del bloque A se superpone a la entrada del B: sin silencios agregados) → public/furatones5.wav + vlog/furatones5/salas.json
import json, subprocess, numpy as np, os
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"; SR = 44100
SOX = os.path.expandvars("C:/Users/bauti/AppData/Local/Microsoft/WinGet/Packages/ChrisBagwell.SoX_Microsoft.Winget.Source_8wekyb3d8bbwe/sox-14.4.2/sox")
FX = {"laundry": ["reverb", "22", "50", "30", "100", "0", "-2"], "kitchen": ["reverb", "22", "50", "30", "100", "0", "-2"],
      "living": ["reverb", "28", "55", "45"], "garage": ["reverb", "45", "30", "70", "100", "0", "-3"],
      "store": ["reverb", "40", "45", "85", "100", "0", "-3"], "out": ["highpass", "90"]}
BL = json.load(open(R + "guiones/furatones5_voz_blocks.json", encoding="utf8")); G = json.load(open(D + "voz/gate.json"))
def rd(f): return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout, np.float32)
def edges(x, thr_db=-42):
    h = 441; e = 20 * np.log10(np.array([np.sqrt(np.mean(x[i:i + h] ** 2)) + 1e-9 for i in range(0, len(x) - h, h)]))
    on = np.where(e > thr_db)[0]; return on[0] * h, (on[-1] + 1) * h
os.makedirs(D + "sala", exist_ok=True); out = np.zeros(SR * 800, np.float32); t = 0; salas = []
for i, b in enumerate(BL):
    x = rd(D + "voz/" + G[f"b{i:03d}"]["file"]); s0, s1 = edges(x)
    s0 = max(0, s0 - int(0.12 * SR)); s1 = min(len(x), s1 + int(0.15 * SR)); seg = x[s0:s1]
    src = D + f"sala/b{i:03d}_seco.wav"; dst = D + f"sala/b{i:03d}_{b['room']}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_f32le", src], input=seg.tobytes(), check=True)
    subprocess.run([SOX, src, dst, "pad", "0", "0.6"] + FX[b["room"]], check=True)
    y = rd(dst); start = t if i == 0 else t + int(0.35 * SR)  # t = fin de la VOZ del bloque anterior (sin su cola)
    out[start:start + len(y)] += y; salas.append({"i": i, "room": b["room"], "s": round(start / SR, 3), "e": round((start + len(seg)) / SR, 3), "tags": b["tags"]})
    t = start + len(seg)
out = out[:t + int(0.6 * SR)]; pk = np.abs(out).max(); out = out / pk * 0.89 if pk > 0.89 else out
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "1", "-i", "-", "-c:a", "pcm_s16le", R + "public/furatones5.wav"], input=out.astype(np.float32).tobytes(), check=True)
json.dump(salas, open(D + "salas.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print("máster con sala:", round(len(out) / SR, 2), "s ·", [(s["room"], s["s"]) for s in salas])
