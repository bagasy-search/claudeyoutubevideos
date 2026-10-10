# ASR por BLOQUE de la voz Fish (Modal faster-whisper) → compuerta por bloque (similitud texto↔ASR) +
# public/captions_<slug>.json global (offset = suma de duraciones; master.wav = concat directo de b###.wav) → align.py.
#   SLUG=cvporkchops python vlog/cv/asr.py        (salta Modal si ya existe voz/asr.json)
import json, os, re, subprocess, difflib, shutil
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/" + os.environ.get("WT", S) + "/"
V = R + f"vlog/{S}/voz/"; man = json.load(open(V + "manifest.json", encoding="utf8"))
ids = sorted(k for k in man if re.fullmatch(r"b\d{3}", k))
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
if not os.path.exists(V + "asr.json"):
    env = dict(os.environ, PYTHONUTF8="1")
    subprocess.run(["modal", "run", R + "vlog/claudio/modal_asr_blocks.py", "--files", ",".join(V + i + ".wav" for i in ids), "--out", V + "asr.json", "--lang", "en"], check=True, env=env, cwd=R)
A = json.load(open(V + "asr.json", encoding="utf8"))
norm = lambda t: re.sub(r"[^a-z0-9 ]", "", t.lower()).split()
cap, off, bad = [], 0.0, []
for i in ids:
    f = V + i + ".wav"; r = A[f]; m = man[i]; txt = m.get("text") if isinstance(m, dict) else None
    if txt:
        sim = difflib.SequenceMatcher(None, norm(txt), norm(r["text"]), autojunk=False).ratio()
        if sim < 0.9: bad.append((i, round(sim, 3)))
    for w in r["words"]: cap.append({"text": w["w"], "startMs": round((off + w["s"]) * 1000), "endMs": round((off + w["e"]) * 1000)})
    off += dur(f)
print("bloques", len(ids), "· suma", round(off, 2), "s · master", round(dur(V + "master.wav"), 2), "s · sim<0.9:", bad or "ninguno")
os.makedirs(R + "public", exist_ok=True); os.makedirs(R + "_v3", exist_ok=True)
json.dump(cap, open(R + f"public/captions_{S}.json", "w", encoding="utf8"), ensure_ascii=False)
shutil.copy(V + "master.wav", R + f"public/{S}.wav")
