# Guion Vaquero (## [set] estado = marca de escena) → guiones/<slug>.txt (locución, 1 párrafo por línea)
# + guiones/<slug>_filmado.txt ("[Snn] párrafo") + vlog/<slug>/marks.json (Snn → set, estado).
#   SLUG=cvporkchops python vlog/cv/mk_guion.py
import os, re, json
S = os.environ["SLUG"]; R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"
src = open(f"C:/Users/bauti/Downloads/plan_claudio_cocina/guiones_vaquero/{S}.txt", encoding="utf8").read().split("\n")
marks, paras, fil, cur = {}, [], [], None
for l in src:
    l = l.strip()
    if not l: continue
    m = re.match(r"^## \[(\S+) ([^\]]+)\]\s*(.*)$", l)
    if m: cur = f"S{len(marks):02d}"; marks[cur] = {"set": m.group(1), "lugar": m.group(2), "estado": m.group(3)}; continue
    if l.startswith("#"): continue
    assert cur, l
    paras.append(l); fil.append(f"[{cur}] {l}")
os.makedirs(R + f"vlog/{S}", exist_ok=True)
open(R + f"guiones/{S}.txt", "w", encoding="utf8", newline="\n").write("\n".join(paras) + "\n")
open(R + f"guiones/{S}_filmado.txt", "w", encoding="utf8", newline="\n").write("\n".join(fil) + "\n")
json.dump(marks, open(R + f"vlog/{S}/marks.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(S, len(marks), "marcas ·", len(paras), "párrafos ·", sum(len(p.split()) for p in paras), "palabras")
