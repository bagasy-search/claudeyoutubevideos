# nrf_emit.py — de _v3/nrfloaters_moments.json a las listas de generación:
#   _v3/nrf_gpt.json (P con ref de cara / D sin ref) · _v3/nrf_stock.json (S, F y 2º planos x_) · _v3/nrf_agnes.json
import json
M = json.load(open("_v3/nrfloaters_moments.json", encoding="utf-8"))
XSHOT = {"The brain filters out constant things.": "ticking wall clock", "What that does is it swirls the gel a little.": "woman reading book",
 "There was a small study from Taiwan": "fresh pineapple market", "And there's a variant of the glide that works even better": "reading book lamp",
 "She quilts.": "sewing machine", "The lamp moved behind her shoulder instead of above the fabric.": "quilt patchwork",
 "Which is... I mean, it's true.": None}
END = 1192600
gpt, stock, agn = [], [], []
for m in M:
    d = ((m["ms_out"] or END) - m["ms"]) / 1000
    if m["t"] == "P": gpt.append(dict(name=m["id"], prompt=m["prompt"], ref="public/ref_nrfloaters_face.png"))
    if m["t"] == "D": gpt.append(dict(name=m["id"], prompt=m["prompt"]))
    if m["t"] in "SF": stock.append(dict(name="s_" + m["id"], concept=m["q"], query=m["q"], dur=round(min(d, 10), 1)))
    if XSHOT.get(m["snip"]):
        m["x"] = XSHOT[m["snip"]]; stock.append(dict(name="x_" + m["id"], concept=m["x"], query=m["x"], dur=4))
    if m.get("anim"): agn.append(dict(nombre=m["id"], motion=m["mo"], **({"pres": True} if m["t"] == "P" else {})))
miss = [k for k, v in XSHOT.items() if v and k not in {m["snip"] for m in M}]
assert not miss, miss
qs = [s["query"] for s in stock]; dq = {q for q in qs if qs.count(q) > 1}
assert not dq, f"consultas repetidas: {dq}"
json.dump(M, open("_v3/nrfloaters_moments.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for f, x in (("_v3/nrf_gpt.json", gpt), ("_v3/nrf_stock.json", stock), ("_v3/nrf_agnes.json", agn)):
    json.dump(x, open(f, "w", encoding="utf-8"), ensure_ascii=False, indent=1); print(f, len(x))
