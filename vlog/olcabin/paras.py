# Párrafos del guion filmado con su ms real (desde _v3/olcabin_wordms.json) → _v3/olcabin_paras.json
import json, re
W = json.load(open("_v3/olcabin_wordms.json", encoding="utf8"))
out = []; k = 0
for i, line in enumerate(open("vlog/olcabin/guion_filmado.txt", encoding="utf8").read().splitlines()):
    m = re.match(r"^\[([^\]]*)\]\s*(.*)$", line)
    if not m: continue
    tag, text = m.group(1), m.group(2)
    n = len(re.findall(r"\S+", text))
    ws = W[k:k + n]; k += n
    sec, _, act = tag.partition("|")
    out.append({"i": len(out), "sec": sec.strip(), "act": act.strip(), "text": text, "s": ws[0]["s"], "e": ws[-1]["e"], "w0": k - n, "nw": n})
json.dump(out, open("_v3/olcabin_paras.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
assert k == len(W), (k, len(W))
for p in out: print(f'{p["i"]:3d} {p["s"]:7.2f}-{p["e"]:7.2f} {p["sec"][:22]:22s} {p["text"][:60]}')
