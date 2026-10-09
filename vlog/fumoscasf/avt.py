# -*- coding: utf-8 -*-
# imprime el tiempo (video armado) de cada frase que le pases por parámetro
import json, re, sys, unicodedata
R = "D:/Proyectos/video2-wt/fumoscasf/"
C = json.load(open(R + "vlog/fumoscasf/cortes.json"))
def mapear(t):
    q = 0.0
    for a, b in C:
        if t >= b: q += b - a
        elif t > a: q += t - a
    return t - q
WM = json.load(open(R + "_v3/fumoscasf_wordms.json", encoding="utf8"))
nw = lambda w: re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in unicodedata.normalize("NFD", w.lower()) if unicodedata.category(c) != "Mn"))
W = [nw(w["w"]) for w in WM]
for frase in sys.argv[1:]:
    q = [nw(x) for x in frase.split()]
    hit = None
    for i in range(len(W) - len(q) + 1):
        if W[i:i + len(q)] == q: hit = i; break
    if hit is None: print(f"  ✗ {frase}"); continue
    s = mapear(WM[hit]["s"]); e = mapear(WM[hit + len(q) - 1]["e"])
    print(f"{s:8.2f} → {e:7.2f}  {frase}")
