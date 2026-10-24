# voz_rescate.py — retoma la voz tras el reinicio sin re-generar Fish ni re-transcribir el máster:
# 1) compuerta de los bloques pendientes con el _t1 ya generado (ASR cacheado de groq; sólo pide lo que falta)
# 2) máster crudo = concat de los bloques aprobados
# 3) ASR del máster = palabras de cada bloque corridas por su offset (mismo formato que groq_asr_blocks)
# 4) align + pausas + cut de fab → public/plo30olorcut.wav
import os, sys, json, subprocess, tempfile, difflib, wave
os.chdir("D:/wt/plo30olor"); os.environ["SLUG"] = "plo30olor"
sys.path.insert(0, "D:/wt/plo30olor/vlog/fab"); sys.path.insert(0, "D:/wt/plo30olor")
import fish_factory as FF, re, unicodedata
deacc = lambda w: "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn")
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", deacc(w))
R = "D:/wt/plo30olor/"; OUT = R + "vlog/plo30olor/voz/"; G = "C:/Users/bauti/Downloads/video2/scripts/asr_groq.py"
blocks = FF.split_blocks(open(R + "guiones/plo30olor_voz.txt", encoding="utf-8").read(), 900)
clean = lambda t: re.sub(r"\[[^\]]+\]\s*", "", t)
norm = lambda t: [nw(w) for w in clean(t).split() if nw(w)]
def gap(txt, asr):
    A, B = norm(txt), norm(asr); sm = difflib.SequenceMatcher(None, A, B, autojunk=False); g = 0
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag == "delete": g = max(g, i2 - i1)
        elif tag == "replace": n, m = i2 - i1, j2 - j1; g = max(g, n if m * 2 < n else max(0, n - m))
    return g, round(sm.ratio(), 3)
def words(f):
    cap = os.path.join(tempfile.gettempdir(), "gq_" + os.path.basename(f) + ".json")
    if not (os.path.exists(cap) and os.path.getmtime(cap) > os.path.getmtime(f)):
        r = subprocess.run([sys.executable, G, "blk", "es", "--wav", f, "--out", cap], capture_output=True, text=True, env={**os.environ, "PYTHONUTF8": "1"})
        if r.returncode: sys.exit("groq: " + r.stdout[-300:] + r.stderr[-300:])
        print("  ASR nuevo", os.path.basename(f), flush=True)
    return [{"w": " " + c["text"].strip(), "s": round(c["startMs"] / 1000, 3), "e": round(c["endMs"] / 1000, 3)} for c in json.load(open(cap, encoding="utf8"))]
gate = json.load(open(OUT + "gate.json", encoding="utf-8"))
malos = []
for i in range(len(blocks)):
    k = f"b{i:03d}"
    if gate.get(k, {}).get("ok"): continue
    f = OUT + f"{k}_t1.wav"; ws = words(f); txt = " ".join(x["w"].strip() for x in ws)
    g, ratio = gap(blocks[i], txt); d = FF.wav_dur(__import__("pathlib").Path(f))
    ok = g < 4
    gate[k] = {"file": f"{k}_t1.wav", "gap": g, "ratio": ratio, "dur": round(d, 2), "ok": ok, "intentos": 1}
    print(f"  {k}: hueco {g} · sim {ratio} · {d:.1f}s {'OK' if ok else 'MAL'}", flush=True)
    if not ok: malos.append(k)
json.dump(gate, open(OUT + "gate.json", "w", encoding="utf-8"), indent=1)
if malos: sys.exit(f"⛔ bloques que no pasan: {malos} → regenerar con voz.py --only")
# máster + ASR por offset
lst = OUT + "concat.txt"
open(lst, "w", encoding="utf-8").write("\n".join(f"file '{OUT}{gate[f'b{i:03d}']['file']}'" for i in range(len(blocks))))
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-c:a", "pcm_s16le", "-ar", "44100", "-ac", "1", R + "public/plo30olor_raw.wav"], check=True)
allw, off = [], 0.0
for i in range(len(blocks)):
    f = OUT + gate[f"b{i:03d}"]["file"]
    allw += [{"w": w["w"], "s": round(w["s"] + off, 3), "e": round(w["e"] + off, 3)} for w in words(f)]
    with wave.open(f, "rb") as w: off += w.getnframes() / w.getframerate()
json.dump({R + "public/plo30olor_raw.wav": {"text": " ".join(x["w"].strip() for x in allw), "words": allw}}, open(R + "_v3/plo30olor_asr_raw.json", "w", encoding="utf-8"), ensure_ascii=False)
print(f"máster {off:.1f} s · {len(allw)} palabras", flush=True)
import fab
fab.W(R + "public/captions_plo30olor.json", [{"text": w["w"].strip(), "startMs": round(w["s"] * 1000), "endMs": round(w["e"] * 1000)} for w in allw])
r = subprocess.run(["python", "vlog/claudio/align.py"], capture_output=True, text=True); print(r.stdout[-1500:], r.stderr[-800:])
fab.pausas(); fab.cut()
T = fab.total_frames(); print(f"FIN voz: sin pausas {T / 30:.1f} s = {T} cuadros ({T / 30 / 60:.2f} min)")
