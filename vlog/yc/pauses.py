# pauses.py — inserta las pausas de cuenta regresiva ([[PAUSE]] del guion) en el máster de voz y corre los tiempos.
# Entradas: D:/rtmp/__SLUG__/{master_voz.wav, wordms.json, pauses.json}  → salidas: fish_out/__SLUG__/master.wav (con pausas),
#           wordms.json y moments.json corridos, pause_ms.json (inicio/fin de cada pausa en el audio final)
import json, subprocess, numpy as np, sys
R = "D:/rtmp/__SLUG__/"; PAUSE = float(sys.argv[1]) if len(sys.argv) > 1 else 5.6
SR = 48000
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", R + "master_voz.wav", "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2)
W = json.load(open(R + "wordms.json", encoding="utf8")); P = json.load(open(R + "pauses.json"))
cuts = []
for wi in P:
    a = W[wi]["out"]; b = W[wi + 1]["in"] if wi + 1 < len(W) else a
    cuts.append(int(((a + b) / 2) / 1000 * SR))
out, last, shift, pms = [], 0, 0, []
ins = int(PAUSE * SR)
for c in cuts:
    out.append(x[last:c]); out.append(np.zeros((ins, 2), np.float32)); pms.append({"in": round((c + shift) / SR * 1000), "out": round((c + shift + ins) / SR * 1000)}); shift += ins; last = c
out.append(x[last:])
y = np.concatenate(out)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", "C:/Users/bauti/Downloads/video2/fish_out/__SLUG__/master.wav"], input=y.tobytes(), check=True)
def sh(ms):
    k = sum(1 for c in cuts if c / SR * 1000 <= ms); return ms + k * PAUSE * 1000
for w in W: w["in"] = round(sh(w["in"])); w["out"] = round(sh(w["out"]))
json.dump(W, open(R + "wordms.json", "w", encoding="utf8"), ensure_ascii=False)
M = json.load(open(R + "moments.json", encoding="utf8"))
for m in M: m["ms_in"] = round(sh(m["ms_in"])); m["ms_out"] = round(sh(m["ms_out"]))
json.dump(M, open(R + "moments.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
json.dump(pms, open(R + "pause_ms.json", "w"))
print(f"pausas {len(pms)} · audio {len(y)/SR:.1f} s")
