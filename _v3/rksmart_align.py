# rksmart_align.py — ANCLAJE AL MS por alineación GLOBAL (difflib), no por búsqueda frase-a-frase.
#
#   python _v3/rksmart_align.py <guion.txt> <captions.json> <out_words.json>
#
# Medido (fedguante): buscar cada frase en las captions ancla 27%; la alineación global, 91%.
# Los números ("ninety" vs "90") caen DENTRO de un bloque `replace` y se interpolan.
# Salida: [{i, w, c0, c1, t, exact}] — una entrada por PALABRA DEL GUION, con su ms.
import json, re, sys, difflib

guion_p, caps_p, out_p = sys.argv[1], sys.argv[2], sys.argv[3]
G = open(guion_p, encoding="utf-8").read()
caps = json.load(open(caps_p, encoding="utf-8"))

# palabras del GUION con su offset de caracteres
gw = [(m.group(0), m.start(), m.end()) for m in re.finditer(r"[A-Za-z0-9'’]+", G)]
norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
GW = [norm(w) for w, _, _ in gw]

# palabras del ASR con su ms de ARRANQUE
aw = [(norm(c["text"]), c["startMs"] / 1000.0) for c in caps if norm(c["text"])]
AW = [w for w, _ in aw]

sm = difflib.SequenceMatcher(None, GW, AW, autojunk=False)
ms = [None] * len(GW)
exact = [False] * len(GW)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            ms[i1 + k] = aw[j1 + k][1]
            exact[i1 + k] = True
    elif j2 > j1 and i2 > i1:                       # replace: se interpola dentro del bloque
        a, b = aw[j1][1], aw[j2 - 1][1]
        n = i2 - i1
        for k in range(n):
            ms[i1 + k] = a + (b - a) * k / max(1, n - 1 if n > 1 else 1)

# monotonía forzada + relleno de los que quedaron en None
last = 0.0
for i in range(len(ms)):
    if ms[i] is None:
        ms[i] = last
    ms[i] = max(ms[i], last)
    last = ms[i]

words = [{"i": i, "w": gw[i][0], "c0": gw[i][1], "c1": gw[i][2], "t": round(ms[i], 3), "exact": exact[i]}
         for i in range(len(gw))]
json.dump(words, open(out_p, "w", encoding="utf-8"), ensure_ascii=False)
n_ex = sum(exact)
print(f"MEDIDO: palabras guion {len(GW)} · palabras ASR {len(AW)} · ancladas EXACTO {n_ex} "
      f"({100*n_ex/max(1,len(GW)):.1f}%) · ratio similitud {sm.ratio():.3f}")
if len(GW) < 50:
    sys.exit("⛔ medí menos de 50 palabras: el medidor está roto")
if n_ex / max(1, len(GW)) < 0.85:
    print("⛔ anclaje EXACTO por debajo del 85% — revisar antes de usar estos ms")
    sys.exit(3)
