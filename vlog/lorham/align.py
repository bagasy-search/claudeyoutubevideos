# Alineación GLOBAL guion↔ASR (difflib) → ms por palabra del guion + reporte de huecos (frases comidas por Fish).
import json, re, difflib, sys
norm = lambda w: re.sub(r"[^a-z0-9']", "", w.lower())
script = open("guiones/lorham.txt", encoding="utf8").read()
sw = [w for w in re.findall(r"\S+", script)]
asr = json.load(open("_v3/lorham_asr.json", encoding="utf8"))["words"]
A = [norm(w["word"]) for w in asr]; S = [norm(w) for w in sw]
sm = difflib.SequenceMatcher(None, S, A, autojunk=False)
ms = [None] * len(S); gaps = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): ms[i1 + k] = [asr[j1 + k]["start"], asr[j1 + k]["end"]]
    elif j2 > j1:
        a, b = asr[j1]["start"], asr[j2 - 1]["end"]
        for k in range(i2 - i1): ms[i1 + k] = [a + (b - a) * k / max(1, i2 - i1), a + (b - a) * (k + 1) / max(1, i2 - i1)]
    if tag in ("delete", "replace") and (i2 - i1) >= 4:
        gaps.append({"tag": tag, "guion": " ".join(sw[i1:i2]), "asr": " ".join(w["word"] for w in asr[j1:j2]), "t": asr[min(j1, len(asr) - 1)]["start"]})
last = [0, 0]
for i in range(len(ms)):
    if ms[i] is None: ms[i] = [last[1], last[1]]
    if ms[i][0] < last[0]: ms[i] = [last[0], max(last[0], ms[i][1])]
    last = ms[i]
json.dump([{"w": sw[i], "s": round(ms[i][0], 3), "e": round(ms[i][1], 3)} for i in range(len(sw))], open("_v3/lorham_wordms.json", "w", encoding="utf8"))
print("ratio", round(sm.ratio(), 4), "palabras", len(S), "asr", len(A))
for g in gaps: print(json.dumps(g, ensure_ascii=False)[:300])
