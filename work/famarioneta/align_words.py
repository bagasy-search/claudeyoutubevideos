# alinea TODAS las palabras del guion (mismo tokenizado que moments.mjs) contra las captions de Modal → _v3/famarioneta_wordms.json
import json, re, sys, difflib, unicodedata
def norm(s):
    s = unicodedata.normalize("NFD", s); s = "".join(c for c in s if not unicodedata.combining(c)).lower()
    return re.sub(r"[^a-z0-9ñ]", "", s)
mom = json.load(open("_v3/famarioneta_moments.json", encoding="utf8"))
G = [w for m in mom for w in (norm(x) for x in m["txt"].split()) if w]
caps = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "public/captions_famarioneta.json", encoding="utf8"))
A = [(norm(c["text"]), c["startMs"]) for c in caps]; A = [a for a in A if a[0]]
sm = difflib.SequenceMatcher(None, G, [a[0] for a in A], autojunk=False)
ms = [None] * len(G); dels = []; ins = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): ms[i1 + k] = A[j1 + k][1]
    elif tag == "replace":
        a, b = A[j1][1], A[j2 - 1][1]; n = i2 - i1
        for k in range(n): ms[i1 + k] = a + (b - a) * k / max(1, n)
        if (j2 - j1) - (i2 - i1) >= 4: ins.append((i1, " ".join(G[i1:i2]), " ".join(a[0] for a in A[j1:j2])))
    elif tag == "delete":
        if i2 - i1 >= 3: dels.append((i1, i2 - i1, " ".join(G[i1:i2])))
    elif tag == "insert":
        if j2 - j1 >= 3: ins.append((i1, "", " ".join(a[0] for a in A[j1:j2])))
exact = sum(1 for x in ms if x is not None)
# huecos: interpolar entre vecinos
for k in range(len(ms)):
    if ms[k] is None:
        p = next((ms[j] for j in range(k - 1, -1, -1) if ms[j] is not None), 0)
        q = next((ms[j] for j in range(k + 1, len(ms)) if ms[j] is not None), p)
        ms[k] = p + (q - p) * 0.5
for k in range(1, len(ms)): ms[k] = max(ms[k], ms[k - 1])
json.dump([{"w": w, "ms": round(t)} for w, t in zip(G, ms)], open("_v3/famarioneta_wordms.json", "w", encoding="utf8"))
print(f"palabras guion {len(G)} · asr {len(A)} · exactas {exact} ({100*exact/len(G):.1f}%) · ratio {sm.ratio():.3f}")
print("DELETES>=3:", len(dels)); [print("  ", d) for d in dels]
print("INSERTS>=3:", len(ins)); [print("  ", d) for d in ins]
