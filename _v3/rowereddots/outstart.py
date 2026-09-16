# tn_outstart.py — mide dónde cayó REALMENTE cada ventana dentro del mp4 de RunPod (recorta ~99 ms
# cada pocas ventanas) correlacionando la envolvente del audio del mp4 contra la de cada ventana.
# Uso: python _v3/tn/tn_outstart.py public/castorglove_avatar.mp4
import json, subprocess, sys, wave, os
import numpy as np

os.chdir("D:/Proyectos/video2-wt/rowereddots")
MP4 = sys.argv[1]
SR = 8000
J = json.load(open("_v3/rowereddots/windows.json", encoding="utf-8"))

def pcm(args):
    raw = subprocess.run(["ffmpeg", "-v", "error", *args, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32)

def env(x, hop=80):  # envolvente a 100 Hz
    n = len(x) // hop
    return np.abs(x[: n * hop]).reshape(n, hop).mean(axis=1)

full = env(pcm(["-i", MP4, "-vn"]))
print(f"mp4 audio {len(full) / 100:.1f}s · reel esperado {J['reel_dur']:.1f}s · {len(J['windows'])} ventanas")
if full.max() <= 0: raise SystemExit("⛔ el mp4 no trae audio: no se puede medir")
prev = 0.0
for k, w in enumerate(J["windows"]):
    seg = env(pcm(["-i", f"_v3/rowereddots/reel/w{k:02d}.wav"]))
    seg = (seg - seg.mean()) / (seg.std() + 1e-6)
    c0 = int(round(w["reel_start"] * 100))
    best, bo = -1e9, 0
    for off in range(-150, 151):
        s = c0 + off
        if s < 0 or s + len(seg) > len(full): continue
        a = full[s: s + len(seg)]
        a = (a - a.mean()) / (a.std() + 1e-6)
        v = float((a * seg).mean())
        if v > best: best, bo = v, off
    w["out_start"] = round((c0 + bo) / 100, 3)
    print(f"  w{k:02d} reel {w['reel_start']:8.2f} → mp4 {w['out_start']:8.2f} (Δ {bo * 10:+5d} ms, r={best:.2f})")
json.dump(J, open("_v3/rowereddots/windows.json", "w", encoding="utf-8"), indent=1)
print("out_start escrito en _v3/rowereddots/windows.json")
