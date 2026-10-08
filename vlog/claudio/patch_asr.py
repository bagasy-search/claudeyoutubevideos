# Parche de ASR: Modal whisper a veces se come frases que Fish SÍ dijo. Transcribe con whisper-1 (palabra por palabra) los tramos
# dados y los reemplaza en public/captions_<slug>.json; después correr align.py + paras.py. SLUG=x python vlog/claudio/patch_asr.py 748:14 [s:d ...]
import os, sys, json, re, subprocess, shutil
S = os.environ["SLUG"]; R = os.environ.get("R") or (os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/")
key = [re.sub(r"^OPENAI_API_KEY\s*=\s*", "", l).strip().strip("'\"") for l in open(R + ".env", encoding="utf8") if l.startswith("OPENAI_API_KEY")][0]
p = R + f"public/captions_{S}.json"; cap = json.load(open(p, encoding="utf8")); shutil.copy(p, p + ".modal")
for arg in sys.argv[1:]:
    s, d = map(float, arg.split(":")); seg = R + f"out/_asr_{int(s)}.wav"; os.makedirs(R + "out", exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s), "-t", str(d), "-i", R + f"public/{S}.wav", "-ar", "16000", "-ac", "1", seg], check=True)
    o = subprocess.run(["curl", "-s", "https://api.openai.com/v1/audio/transcriptions", "-H", f"Authorization: Bearer {key}", "-F", "model=whisper-1", "-F", "language=es",
                        "-F", "response_format=verbose_json", "-F", "timestamp_granularities[]=word", "-F", f"file=@{seg}"], capture_output=True, text=True, encoding="utf-8").stdout
    w = json.loads(o)["words"]; a, b = (s + 0.3) * 1000, (s + d - 0.3) * 1000
    nw = [{"text": " " + x["word"], "startMs": round((s + x["start"]) * 1000), "endMs": round((s + x["end"]) * 1000)} for x in w if a <= (s + x["start"]) * 1000 <= b]
    keep = [c for c in cap if not (nw[0]["startMs"] <= c["startMs"] <= nw[-1]["endMs"])]
    print(s, len(cap) - len(keep), "->", len(nw), "·", json.loads(o)["text"][:120])
    cap = sorted(keep + [{**cap[0], **x} for x in nw], key=lambda c: c["startMs"]); os.remove(seg)
json.dump(cap, open(p, "w", encoding="utf8"), ensure_ascii=False, indent=1)
