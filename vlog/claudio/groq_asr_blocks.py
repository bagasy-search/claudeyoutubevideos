# groq_asr_blocks.py --files a.wav,b.wav --out res.json [--lang es] : misma salida que modal_asr_blocks.py, con Groq gratis (asr_groq.py)
import json, os, subprocess, sys, tempfile, argparse
ap = argparse.ArgumentParser(); ap.add_argument("--files"); ap.add_argument("--out"); ap.add_argument("--lang", default="es"); a = ap.parse_args()
G = "C:/Users/bauti/Downloads/video2/scripts/asr_groq.py"
out = {}
for f in [x for x in a.files.split(",") if x]:
    cap = os.path.join(tempfile.gettempdir(), "gq_" + os.path.basename(f) + ".json")
    r = subprocess.run([sys.executable, G, "blk", a.lang, "--wav", f, "--out", cap], capture_output=True, text=True, env={**os.environ, "PYTHONUTF8": "1"})
    if r.returncode: sys.exit("groq: " + r.stdout[-300:] + r.stderr[-300:])
    ws = [{"w": " " + c["text"].strip(), "s": round(c["startMs"] / 1000, 3), "e": round(c["endMs"] / 1000, 3)} for c in json.load(open(cap, encoding="utf8"))]
    out[f] = {"text": " ".join(x["w"].strip() for x in ws), "words": ws}
json.dump(out, open(a.out, "w", encoding="utf-8"), ensure_ascii=False)
print(f"ASR Groq: {len(out)} bloques -> {a.out}")
