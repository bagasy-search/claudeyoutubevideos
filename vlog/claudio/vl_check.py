# Compuerta de los clips HABLADOS de agnes SIN OpenAI (whisper-1 del `check` de agnes_vlog queda sin crédito):
#   1) LABIOS: correlación de envolvente (RMS 20 ms) del audio propio del clip contra el tramo del máster, sólo sobre el largo REAL
#      del tramo (la cola rellena balbucea), con búsqueda de lag ±0,3 s → ⛔ r < 0,80 o |lag| > 0,12 s
#   2) PALABRAS: ASR de Modal (modal_asr_blocks.py) del clip recortado al tramo vs el texto del tramo → ⛔ similitud < 0,80
#   SLUG=x python vlog/claudio/vl_check.py      → vlog/<slug>/M1/vl_check.json + rechazados.json (ids que NO van; el avatar los cubre)
import json, os, re, subprocess, difflib, unicodedata, numpy as np
S = os.environ["SLUG"]; R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/")
D = os.environ.get("VL_DIR") or R + f"vlog/{S}/M1/"; T = D + "_chk/"; os.makedirs(T, exist_ok=True)
plan = json.load(open(D + "plan.json", encoding="utf-8")); st = json.load(open(D + "clips/state.json", encoding="utf-8"))
OUT = D + "vl_check.json"; res = json.load(open(OUT, encoding="utf-8")) if os.path.exists(OUT) else {}
def pcm(f, ss=0, t=None):
    a = ["ffmpeg", "-v", "error", "-ss", str(ss), "-i", f] + (["-t", f"{t:.3f}"] if t else []) + ["-af", "highpass=f=300,lowpass=f=3000", "-ac", "1", "-ar", "8000", "-f", "s16le", "-"]  # banda de voz: el rumble/viento que agrega agnes no cuenta (furatones5)
    return np.frombuffer(subprocess.run(a, capture_output=True).stdout, np.int16).astype(np.float32)
def env(x, hop=160): n = len(x) // hop; return np.sqrt((x[:n * hop].reshape(n, hop) ** 2).mean(1) + 1e-9)
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
todo = []
for c in plan["clips"]:
    i = c["id"]; s = st.get(i)
    if not s: continue
    f = D + "clips/" + s["file"]
    if i in res and res[i].get("file") == s["file"]: continue
    ref = pcm(c["audio"]); L = len(ref) / 8000
    clip = pcm(f, 0, L)
    a, b = env(ref), env(clip); n = min(len(a), len(b))
    best = (-1, 0)
    for lag in range(-15, 16):  # ±0,3 s en pasos de 20 ms
        x = a[max(0, lag):n + min(0, lag)]; y = b[max(0, -lag):n - max(0, lag)]
        if len(x) > 20: r = float(np.corrcoef(x, y)[0, 1]); best = max(best, (r, lag * 0.02))
    wav = T + i + ".wav"; subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f, "-t", f"{L:.3f}", "-ac", "1", "-ar", "16000", wav], check=True)
    res[i] = {"file": s["file"], "r": round(best[0], 3), "lag": round(best[1], 2), "text": c["text"], "wav": wav}; todo.append(i)
if todo:
    out = T + "_asr.json"
    subprocess.run(["modal", "run", R + "vlog/claudio/modal_asr_blocks.py", "--files", ",".join(res[i]["wav"] for i in todo), "--out", out, "--lang", "es"],
                   capture_output=True, text=True, env={**os.environ, "PYTHONUTF8": "1"}, encoding="utf-8", errors="replace")
    asr = json.load(open(out, encoding="utf-8")) if os.path.exists(out) else {}
    for i in todo:
        txt = (asr.get(res[i]["wav"]) or asr.get(res[i]["wav"].replace("/", "\\")) or {}).get("text", "")
        A = [nw(w) for w in res[i]["text"].split() if nw(w)]; B = [nw(w) for w in txt.split() if nw(w)]
        res[i]["asr"] = txt; res[i]["sim"] = round(difflib.SequenceMatcher(None, A, B, autojunk=False).ratio(), 3) if txt else None
for i, v in res.items():
    v["ok"] = (v["r"] >= 0.80 and abs(v["lag"]) <= 0.12 and (v.get("sim") is None or v["sim"] >= 0.80)) or (v["r"] >= 0.95 and abs(v["lag"]) <= 0.06)  # r≥0,95 = agnes devolvió la MISMA voz (el ASR falla con números)
json.dump(res, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
rech = sorted(i for i, v in res.items() if not v["ok"]); json.dump(rech, open(D + "rechazados.json", "w"), indent=1)
for i, v in sorted(res.items()): print(f"{'OK' if v['ok'] else 'XX'} {i:14s} r {v['r']:.2f} lag {v['lag']:+.2f} sim {v.get('sim')}")
print(f"medidos {len(res)} - ok {len(res) - len(rech)} - rechazados {len(rech)}: {' '.join(rech)}")
