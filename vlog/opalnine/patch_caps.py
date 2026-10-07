# Parcha captions de Modal en tramos que se salteó (whisper-1 con timestamps por palabra). Uso:
#   python vlog/opalnine/patch_caps.py <t0> [<t1> ...]   (cada tramo = [t, t+12] s; reemplaza [t+1, t+11])
import json, re, subprocess, sys
SLUG = "opalnine"
env = {}
for l in open(".env", encoding="utf8"):
    m = re.match(r"\s*([A-Z0-9_]+)\s*=\s*(.*)", l)
    if m: env[m.group(1)] = m.group(2).strip().strip("\"'")
caps = json.load(open(f"public/captions_{SLUG}.json", encoding="utf8"))
for s in map(float, sys.argv[1:]):
    seg = f"out/seg_{int(s)}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", str(s), "-t", "12", "-i", f"public/{SLUG}.wav", "-ac", "1", "-ar", "16000", seg], check=True)
    r = subprocess.run(["curl", "-s", "https://api.openai.com/v1/audio/transcriptions", "-H", "Authorization: Bearer " + env["OPENAI_API_KEY"], "-F", "model=whisper-1", "-F", "language=en", "-F", "response_format=verbose_json", "-F", "timestamp_granularities[]=word", "-F", f"file=@{seg}"], capture_output=True, text=True)
    W = json.loads(r.stdout)["words"]
    a, b = s + 1.0, s + 11.0
    new = [{"text": " " + w["word"], "startMs": int((s + w["start"]) * 1000), "endMs": int((s + w["end"]) * 1000), "timestampMs": None, "confidence": 1} for w in W if a <= s + w["start"] <= b]
    old = [c for c in caps if a * 1000 <= c["startMs"] <= b * 1000]
    caps = sorted([c for c in caps if not (a * 1000 <= c["startMs"] <= b * 1000)] + new, key=lambda c: c["startMs"])
    print(s, "viejas", len(old), "nuevas", len(new))
json.dump(caps, open(f"public/captions_{SLUG}.json", "w", encoding="utf8"))
