# words.json (línea de tiempo CORTADA) + secs.json (sección → [a,b]) desde _v3/<slug>_wordms.json y guion.txt
import json, re, sys
sys.path.insert(0, "vlog/fab")
from comun import mapear, cortes
W = json.load(open("_v3/tswwater_wordms.json", encoding="utf8")); C = cortes()
L = [l for l in open("vlog/tswwater/guion.txt", encoding="utf8").read().split("\n") if l.strip()]
paras = [(re.match(r"\[([A-Z0-9_]+)\]", l).group(1), re.sub(r"^\[[^\]]*\]\s*", "", l).split()) for l in L]
n = sum(len(p[1]) for p in paras); print("guion palabras", n, "wordms", len(W))
assert n == len(W), "conteo distinto"
out = [{"w": w["w"], "s": round(mapear(w["s"], C), 3), "e": round(mapear(w["e"], C), 3)} for w in W]
for i in range(1, len(out)):
    if out[i]["s"] < out[i-1]["e"]: out[i-1]["e"] = out[i]["s"]
    if out[i]["e"] < out[i]["s"]: out[i]["e"] = out[i]["s"]
secs = {}; i = 0; pl = []
for sec, ws in paras:
    a, b = out[i]["s"], out[i + len(ws) - 1]["e"]; pl.append({"sec": sec, "a": a, "b": b, "i0": i, "n": len(ws)}); i += len(ws)
    if sec in secs: secs[sec]["b"] = b
    else: secs[sec] = {"sec": sec, "a": a, "b": b}
R = "C:/Users/bauti/tswwater_tmp/w"
json.dump(out, open(f"{R}/words.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(list(secs.values()), open(f"{R}/secs.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
json.dump(pl, open(f"{R}/paras.json", "w", encoding="utf8"), ensure_ascii=False, indent=0)
print("fin", out[-1]["e"], "secciones", len(secs))
