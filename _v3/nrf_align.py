# nrt_align.py — alinea el GUION contra las captions (ASR por palabra) con difflib GLOBAL.
# Salida: _v3/nrtinnitus_wordms.json = [{w, ms}] una entrada por palabra del guion.
# Compuerta de Fish: imprime similitud y la RACHA más larga de palabras del guion SIN match
# (Fish saltea 8-20 palabras cuando hay anáfora; el largo del wav no lo ve).
import json, re, difflib, sys

SLUG = "nrfloaters"
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower().replace("’", "'"))
guion = open(f"guiones/{SLUG}.txt", encoding="utf-8").read()
gw = [w for w in re.findall(r"\S+", guion)]
gn = [norm(w) for w in gw]
caps = json.load(open(f"public/captions_{SLUG}.json", encoding="utf-8"))
aw = []
for c in caps:
    t = c.get("text") or c.get("word") or ""
    ms = c.get("startMs", c.get("start_ms", c.get("start", 0)))
    if isinstance(ms, float) and ms < 5000 and "startMs" not in c: ms = ms * 1000
    for w in t.split():
        aw.append((norm(w), float(ms)))
an = [a for a, _ in aw]
sm = difflib.SequenceMatcher(None, gn, an, autojunk=False)
ms = [None] * len(gn)
eq = [False] * len(gn)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): ms[i1 + k] = aw[j1 + k][1]; eq[i1 + k] = True
    elif j2 > j1:
        a, b = aw[j1][1], aw[j2 - 1][1]
        for k in range(i2 - i1): ms[i1 + k] = a + (b - a) * k / max(1, i2 - i1)
last = 0
for i in range(len(ms)):
    if ms[i] is None: ms[i] = last
    ms[i] = max(ms[i], last); last = ms[i]
# racha sin match
run = best = 0; bestEnd = 0
for i, e in enumerate(eq):
    run = 0 if e else run + 1
    if run > best: best, bestEnd = run, i
print(f"palabras guion {len(gn)} · asr {len(an)} · similitud {sm.ratio():.3f} · exactas {sum(eq)/len(eq)*100:.1f}%")
print(f"racha max sin match: {best} palabras -> '{' '.join(gw[bestEnd-best+1:bestEnd+1])}'")
json.dump([{"w": w, "ms": round(m)} for w, m in zip(gw, ms)], open(f"_v3/{SLUG}_wordms.json", "w", encoding="utf-8"))
if best >= 8: print("⛔ posible texto SALTEADO por Fish: escuchar ese tramo"); sys.exit(1)
