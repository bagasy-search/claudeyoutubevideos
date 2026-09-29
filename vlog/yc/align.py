# Alineación GLOBAL guion<->ASR (difflib) -> ms por palabra del GUION, frases y momentos.
# Salida: D:/rtmp/__SLUG__/wordms.json, moments.json
import json, re, difflib, sys
SCRIPT = "C:/Users/bauti/Downloads/video2/canales/__SLUG__.md"
CAP = "D:/rtmp/__SLUG__/captions.json"
OUT = "D:/rtmp/__SLUG__/"

norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
text = open(SCRIPT, encoding="utf8").read()
paras = [p.strip() for p in text.split("\n\n") if p.strip()]
sw = []  # palabras del guion: (word, para_idx)
pauses = []  # índice de la palabra DESPUÉS de la cual va una pausa de cuenta regresiva ([[PAUSE]] en el guion)
for pi, p in enumerate(paras):
    for w in p.split():
        if w == "[[PAUSE]]": pauses.append(len(sw) - 1); continue
        sw.append((w, pi))
json.dump(pauses, open(OUT + "pauses.json", "w"))
cap = json.load(open(CAP, encoding="utf8"))["words"]
aw = [(c.get("word") if c.get("word") is not None else c.get("text", "")).strip() for c in cap]
ast = [float(c["start"]) for c in cap]; aen = [float(c["end"]) for c in cap]
A = [norm(w) for w in aw]; S = [norm(w) for w, _ in sw]
sm = difflib.SequenceMatcher(None, S, A, autojunk=False)
ms_in = [None] * len(S); ms_out = [None] * len(S)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            ms_in[i1 + k] = ast[j1 + k] * 1000; ms_out[i1 + k] = aen[j1 + k] * 1000
    elif tag == "replace" and j2 > j1:
        t0, t1 = ast[j1] * 1000, aen[j2 - 1] * 1000
        n = i2 - i1
        for k in range(n):
            ms_in[i1 + k] = t0 + (t1 - t0) * k / n; ms_out[i1 + k] = t0 + (t1 - t0) * (k + 1) / n
matched = sum(1 for x in ms_in if x is not None)
# interpolar huecos
for i in range(len(S)):
    if ms_in[i] is None:
        a = next((j for j in range(i - 1, -1, -1) if ms_out[j] is not None), None)
        b = next((j for j in range(i + 1, len(S)) if ms_in[j] is not None), None)
        t0 = ms_out[a] if a is not None else 0; t1 = ms_in[b] if b is not None else t0 + 300
        ms_in[i] = t0; ms_out[i] = t1
# monotonía
for i in range(1, len(S)):
    if ms_in[i] < ms_in[i - 1]: ms_in[i] = ms_in[i - 1]
    if ms_out[i] < ms_in[i]: ms_out[i] = ms_in[i]
words = [{"w": w, "p": p, "in": round(ms_in[i]), "out": round(ms_out[i])} for i, (w, p) in enumerate(sw)]
json.dump(words, open(OUT + "wordms.json", "w", encoding="utf8"), ensure_ascii=False)
print(f"ancla exacta {matched}/{len(S)} = {matched/len(S):.1%}")

# frases (y sub-frases por coma si son largas)
sents = []; cur = []
for i, x in enumerate(words):
    cur.append(i)
    if re.search(r"[.!?]\"?$", x["w"]) or i == len(words) - 1:
        sents.append(cur); cur = []
def split_long(idx):
    dur = (words[idx[-1]]["out"] - words[idx[0]]["in"]) / 1000
    if dur <= 7.5: return [idx]
    cuts = [k for k in range(3, len(idx) - 3) if words[idx[k]]["w"].endswith(",")]
    if not cuts:
        mid = len(idx) // 2; return split_long(idx[:mid]) + split_long(idx[mid:])
    k = min(cuts, key=lambda k: abs(k - len(idx) / 2))
    return split_long(idx[:k + 1]) + split_long(idx[k + 1:])
frags = []
for s in sents: frags += split_long(s)
moments = []
for fr in frags:
    moments.append({"i": len(moments), "p": words[fr[0]]["p"], "text": " ".join(words[k]["w"] for k in fr),
                    "ms_in": words[fr[0]]["in"], "ms_out": words[fr[-1]]["out"], "w0": fr[0], "w1": fr[-1]})
# fundir los muy cortos (<2.2 s) con el siguiente del mismo párrafo
merged = []
for m in moments:
    cruza_pausa = merged and any(merged[-1]["w1"] <= pw < m["w0"] for pw in pauses)
    if merged and not cruza_pausa and (merged[-1]["ms_out"] - merged[-1]["ms_in"]) < 2200 and merged[-1]["p"] == m["p"]:
        merged[-1]["text"] += " " + m["text"]; merged[-1]["ms_out"] = m["ms_out"]; merged[-1]["w1"] = m["w1"]
    else: merged.append(dict(m))
for i, m in enumerate(merged): m["i"] = i
# ítem al que pertenece cada momento
item = "hook"
for m in merged:
    g = re.match(r"(?:\[[^\]]*\]\s*)?(?:And )?[Nn]umber (\w+)[.,]", m["text"])
    para = paras[m["p"]]
    g2 = re.match(r"(?:And )?(?:[Nn]umber|Question) ([\w-]+)\.", para)
    if g2 and m["w0"] == min(k for k, (w, p) in enumerate(sw) if p == m["p"]):
        item = g2.group(1)
    if para.startswith("That's the list"): item = "outro"
    m["item"] = item
durs = sorted((m["ms_out"] - m["ms_in"]) / 1000 for m in merged)
import statistics as st
print(f"momentos {len(merged)} · mediana {st.median(durs):.2f} · p75 {durs[int(len(durs)*.75)]:.2f} · max {max(durs):.1f} · >=5s {sum(d>=5 for d in durs)/len(durs):.0%}")
json.dump(merged, open(OUT + "moments.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
from collections import Counter
print(Counter(m["item"] for m in merged))
