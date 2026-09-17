# re-transcribe con whisper-1 las ventanas donde Modal se comió frases y las pega en las captions
import json, sys, subprocess, urllib.request, os
wins = [tuple(map(float, w.split(":"))) for w in sys.argv[1:]]  # start:dur
key = [l.split("=",1)[1].strip() for l in open(".env",encoding="utf8") if l.startswith("OPENAI_API_KEY=")][0]
caps = json.load(open("_v3/famarioneta_captions_fix.json", encoding="utf8"))
for s, d in wins:
    f = f"work/famarioneta/seg_{int(s)}.wav"
    subprocess.run(["ffmpeg","-v","error","-y","-ss",str(s),"-t",str(d),"-i","public/famarioneta.wav","-ac","1","-ar","16000",f], check=True)
    out = subprocess.run(["curl","-s","https://api.openai.com/v1/audio/transcriptions","-H",f"Authorization: Bearer {key}","-F","model=whisper-1","-F","language=es","-F","response_format=verbose_json","-F","timestamp_granularities[]=word","-F",f"file=@{f}"], capture_output=True, text=True, encoding="utf8").stdout
    w = json.loads(out)["words"]
    a, b = s*1000, (s+d)*1000
    # recorto los bordes 0.4 s para no duplicar palabras partidas
    w = [x for x in w if x["start"] >= 0.4 and x["start"] <= d - 0.4]
    lo, hi = a + 400, b - 400
    caps = [c for c in caps if not (lo <= c["startMs"] < hi)]
    caps += [{"text": " " + x["word"], "startMs": round(a + x["start"]*1000), "endMs": round(a + x["end"]*1000), "timestampMs": round(a + x["end"]*1000), "confidence": 0.9} for x in w]
    print(s, d, len(w), " ".join(x["word"] for x in w)[:160])
caps.sort(key=lambda c: c["startMs"])
json.dump(caps, open("_v3/famarioneta_captions_fix.json", "w", encoding="utf8"), ensure_ascii=False)
