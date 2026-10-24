# words.json en la línea de tiempo RECORTADA (palabras alineadas al guion + cortes de pausas)
import json, sys
sys.path.insert(0, "D:/wt/plo30olor/vlog/fab")
import os; os.chdir("D:/wt/plo30olor")
from comun import palabras, cortes, mapear
C = cortes(); WM = palabras()
out = [{"w": w["w"].strip(), "s": round(mapear(w["s"], C), 3), "e": round(mapear(w["e"], C), 3)} for w in WM]
json.dump(out, open("src/plo30olor/words.json", "w", encoding="utf8"), ensure_ascii=False)
print(len(out), "palabras · última", out[-1])
