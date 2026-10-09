# Inserta párrafos en un guion filmado: python vlog/lnet/ins.py <slug> <ops.json>; ops = [[after|before, substring, [lineas...]], ...]
import json, sys
s, f = sys.argv[1], sys.argv[2]
p = f"D:/Proyectos/video2-wt/lnet/guiones/{s}_filmado.txt"
L = open(p, encoding="utf8").read().split("\n")
for kind, sub, new in json.load(open(f, encoding="utf8")):
    ks = [k for k, l in enumerate(L) if sub in l]
    if not ks: print("NO ENCONTRADO:", sub); continue
    k = ks[0] + 1 if kind == "after" else ks[0]
    L[k:k] = new
open(p, "w", encoding="utf8", newline="\n").write("\n".join(L))
