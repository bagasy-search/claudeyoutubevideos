import os; S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/lnet/"
# Párrafos del guion filmado con su ms real → _v3/<slug>_paras.json. SLUG=x python vlog/loretta/paras.py
import json, re
W = json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))
out = []; k = 0
for i, line in enumerate(open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().splitlines()):
    m = re.match(r"^\[([^\]]*)\]\s*(.*)$", line)
    if not m: continue
    tag, text = m.group(1), m.group(2)
    text = re.sub(r"\s{2,}", " ", re.sub(r"\[[^\]]*\]", "", text)).strip()
    n = len(re.findall(r"\S+", text))
    ws = W[k:k + n]; k += n
    sec, _, act = tag.partition("|")
    out.append({"i": len(out), "sec": sec.strip(), "act": act.strip(), "text": text, "s": ws[0]["s"], "e": ws[-1]["e"], "w0": k - n, "nw": n})
json.dump(out, open(R + f"_v3/{S}_paras.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
assert k == len(W), (k, len(W))
for p in out: print(f'{p["i"]:3d} {p["s"]:7.2f}-{p["e"]:7.2f} {p["sec"][:22]:22s} {p["text"][:60]}')
