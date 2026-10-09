# guiones/<slug>_filmado.txt → guiones/<slug>.txt (limpio, 1 párrafo por línea) + _voz.txt (tags Fish moderados). SLUG=x python vlog/loretta/mk_guion.py
import re, os, subprocess
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/lnet46/"
f = open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().strip().split("\n")
clean = [re.sub(r"\s{2,}", " ", re.sub(r"\[[^\]]*\]", "", l)).strip() for l in f if l.strip()]
open(R + f"guiones/{S}.txt", "w", encoding="utf8", newline="\n").write("\n".join(clean))
n = sum(len(c) for c in clean); print(len(clean), "párrafos ·", n, "chars · ~", round(n / 14.9 / 60, 1), "min")
subprocess.run(["python", R + "vlog/loretta/tag_voz.py", R + f"guiones/{S}.txt", R + f"guiones/{S}_voz.txt"], check=True)
