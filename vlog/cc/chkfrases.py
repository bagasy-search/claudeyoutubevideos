# ¿Existen en el máster (wordms) todas las frases que usa mkov.py / intro.py?  SLUG=x python vlog/cc/chkfrases.py
import json, re, unicodedata, os
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/ccfrijoles/"
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))]
src = open(R + f"vlog/{S}/mkov.py", encoding="utf8").read()
fr = re.findall(r'at\("([^"]+)"', src) + re.findall(r'for x in \(([^)]*)\)', src)
fr = [x for f in fr for x in (re.findall(r'"([^"]+)"', f) if '"' in f else [f])]
bad = []
for f in dict.fromkeys(fr):
    q = [nw(x) for x in f.split() if nw(x)]
    if not any(W[i:i + len(q)] == q for i in range(len(W) - len(q) + 1)): bad.append(f)
print(S, len(fr), "frases ·", "FALTAN: " + " | ".join(bad) if bad else "todas OK")
