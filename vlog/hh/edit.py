# Aplica reemplazos exactos (cada "a" tiene que aparecer UNA vez) a un guion: python vlog/hh/edit.py <slug> <reemplazos.json>
# reemplazos.json = [[a, b], ...]
import json, sys
p = f"D:/Proyectos/video2-wt/lhh/guiones/{sys.argv[1]}_hh.txt"
import re
s = re.sub(r"}[ 	]+", "}", open(p, encoding="utf8").read())
for a, b in json.load(open(sys.argv[2], encoding="utf8")):
    a = re.sub(r"}[ 	]+", "}", a); n = s.count(a)
    if n != 1: raise SystemExit(f"⛔ aparece {n} veces: {a[:80]}")
    s = s.replace(a, b)
open(p, "w", encoding="utf8", newline="\n").write(s)
print("ok")
