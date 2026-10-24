# mkmix.py — mezcla final: voz (-14 LUFS / -1,5 dBTP) + golpe SÓLO en las revelaciones (sellos, guía) con swell suave,
# + 1 s de silencio al final. Sin música, sin ambientes. Sale D:/rtmp_plo30olor/plo30olor_mix.wav
import json, subprocess
W = "D:/wt/plo30olor"; SFX = "C:/Users/bauti/Downloads/video2/public/sfx"
plan = json.load(open(f"{W}/src/plo30olor/plan.json", encoding="utf8"))
END = plan["end"]
hits = [f["a"] for f in plan["fx"] if f["type"] == "stamp"]
swell = [f["a"] for f in plan["fx"] if f["type"] == "guide"] + [s["a"] for s in plan["secs"] if s["k"] == "D11"]
ins, flt = ["-i", f"{W}/public/plo30oloricut.wav".replace("oloricut", "olorcut")], []
n = 1
for t in hits:
    ins += ["-i", f"{SFX}/deep-cinematic-impact-1.mp3"]; flt.append(f"[{n}:a]volume=0.22,adelay={int(t*1000)}|{int(t*1000)}[s{n}]"); n += 1
for t in swell:
    d = max(0, int((t - 1.6) * 1000))
    ins += ["-i", f"{SFX}/cp_riser.wav"]; flt.append(f"[{n}:a]volume=0.12,afade=t=in:d=0.8,adelay={d}|{d}[s{n}]"); n += 1
mix = "".join(f"[s{i}]" for i in range(1, n))
flt.append(f"[0:a]loudnorm=I=-14:TP=-1.5:LRA=7[v]")
flt.append(f"[v]{mix}amix=inputs={n}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=7,aresample=48000,apad=whole_dur={END + 1.0:.2f},atrim=0:{END + 1.0:.2f}[o]")
cmd = ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *ins, "-filter_complex", ";".join(flt), "-map", "[o]", "-ar", "48000", "-ac", "2", "D:/rtmp_plo30olor/plo30olor_mix.wav"]
subprocess.run(cmd, check=True)
print("mix OK", len(hits), "golpes", len(swell), "swells", f"{END + 1.0:.1f}s")
