# rksmart_moments.py — ESQUELETO DE MOMENTOS: una frase = un momento, anclado al ms REAL.
#
#   python _v3/rksmart_moments.py
#
# ⛔ La duración de cada plano la decide LO QUE SE DICE, no un reloj. Partir por FRASE hereda la
#    dispersión natural del habla (frases cortas de enumeración, frases largas que explican) y por
#    eso NO sale metrónomo: no hace falta ninguna escalera artificial de duraciones.
# Reglas: una frase de <1,6 s se funde con la siguiente (no alcanza para un plano);
#         una de >8,5 s se parte en DOS planos (el 2º lleva sufijo `x` y necesita su propio prompt).
import json, re, sys
from pathlib import Path

G = Path("canales/rksmart_GUION.txt").read_text(encoding="utf-8")
W = json.load(open("_v3/rksmart_words.json", encoding="utf-8"))
TOTAL = 1588.824

paras = []
pos = 0
for p in G.strip().split("\n\n"):
    i = G.index(p, pos)
    paras.append((i, i + len(p)))
    pos = i + len(p)

# cortes de oración dentro del guion
cortes = [0]
for m in re.finditer(r"[.!?]['\")\]]?(?=\s)", G):
    cortes.append(m.end())
cortes.append(len(G))
cortes = sorted(set(cortes))

tDe = lambda c: next((w["t"] for w in W if w["c0"] >= c), TOTAL)

raw = []
for a, b in zip(cortes, cortes[1:]):
    txt = G[a:b].strip()
    if not txt:
        continue
    raw.append({"c0": a + (len(G[a:b]) - len(G[a:b].lstrip())), "c1": b, "txt": re.sub(r"\s+", " ", txt)})

# fundir las que no llegan a 1,6 s
mom = []
for r in raw:
    r["t"] = tDe(r["c0"])
    if mom and r["t"] - mom[-1]["t"] < 1.6:
        mom[-1]["txt"] += " " + r["txt"]
        mom[-1]["c1"] = r["c1"]
        continue
    mom.append(r)
for i, m in enumerate(mom):
    m["end"] = mom[i + 1]["t"] if i + 1 < len(mom) else TOTAL
    m["dur"] = round(m["end"] - m["t"], 3)
    m["para"] = next(k for k, (a, b) in enumerate(paras) if a <= m["c0"] <= b + 1)

durs = sorted(m["dur"] for m in mom)
q = lambda p: durs[min(len(durs) - 1, int(len(durs) * p))]
largos = [m for m in mom if m["dur"] > 8.5]
print("MEDIDO: momentos %d · párrafos %d · total %.1f s" % (len(mom), len(paras), TOTAL))
print("  duración de FRASE: min %.2f · p25 %.2f · mediana %.2f · p75 %.2f · max %.2f"
      % (durs[0], q(.25), q(.5), q(.75), durs[-1]))
print("  frases >8,5 s (se parten en 2 planos): %d  →  planos totales estimados %d"
      % (len(largos), len(mom) + len(largos)))
json.dump(mom, open("_v3/rksmart_mom.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)

out = []
for i, m in enumerate(mom):
    out.append("%3d  p%03d  %7.2f  %5.2fs  %s" % (i, m["para"], m["t"], m["dur"], m["txt"]))
Path("_v3/rksmart_mom.txt").write_text("\n".join(out), encoding="utf-8")
print("→ _v3/rksmart_mom.json · _v3/rksmart_mom.txt")
if len(mom) < 50:
    sys.exit("⛔ medí muy pocos momentos")
