# guiones/<slug>_filmado.txt ([SEC|acto] texto) → guiones/<slug>.txt (limpio, 1 párrafo por línea) + guiones/<slug>_voz.txt (tags Fish
# DIRIGIDOS a mano desde vlog/<slug>/tags.json: {"frase exacta": "[tag]"} — se antepone el tag a esa frase; nunca cambia palabras).
# SLUG=x python vlog/rhonda/mk_guion.py
import re, os, json, sys
S = os.environ["SLUG"]; R = os.environ.get("R", "D:/Proyectos/video2-wt/rhtoiletrim/")
f = open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().strip().split("\n")
clean = [re.sub(r"\s{2,}", " ", re.sub(r"^\[[^\]]*\]\s*", "", l)).strip() for l in f if l.strip()]
open(R + f"guiones/{S}.txt", "w", encoding="utf8", newline="\n").write("\n".join(clean))
n = sum(len(c) for c in clean); print(len(clean), "párrafos ·", n, "chars · ~", round(n / 17.6 / 60, 2), "min a 17,6 car/s")
tags = json.load(open(R + f"vlog/{S}/tags.json", encoding="utf8"))
voz = "\n".join(clean)
for frase, tag in tags.items():
    if voz.count(frase) != 1: sys.exit(f"⛔ la frase del tag no aparece exactamente 1 vez: {frase!r} ({voz.count(frase)})")
    voz = voz.replace(frase, tag + " " + frase)
assert re.sub(r"\[[^\]]+\] ", "", voz) == "\n".join(clean), "los tags cambiaron el texto"
open(R + f"guiones/{S}_voz.txt", "w", encoding="utf8", newline="\n").write(voz)
print("tags", len(tags), ":", ", ".join(sorted(set(tags.values()))))
