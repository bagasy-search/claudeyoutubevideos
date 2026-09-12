# -*- coding: utf-8 -*-
# rkalarm_align.py — ancla cada momento del plan al MILISEGUNDO del audio real.
#
# ⛔⛔ NO se busca cada frase en el ASR. Medido en `fedguante`: buscar frase->ASR anclo 129 de 477
#     momentos (27%); la alineacion GLOBAL anclo 433 (91%) con el mismo guion y las mismas
#     captions. Falla por tres causas ESTRUCTURALES, no por mala suerte:
#       1. las frases de 3 palabras no entran en un findMs que pide 4-7 seguidas;
#       2. Whisper NO escribe lo que dice el guion (escribe "50" donde el guion dice "fifty",
#          "138/82", "9:30") -> cualquier match literal se cae en CADA numero;
#       3. el cursor se ARRASTRA: un match tardio se come todos los momentos siguientes.
#
# ✅ Lo que si funciona: alinear las DOS secuencias de palabras UNA vez con difflib, leer el ms de
#    ahi, e interpolar dentro de los bloques `replace` (donde caen justamente los numeros).
#
# ⛔ Y los momentos NO se ubican con guion.find(texto): el separador de frases fusiona pedazos de
#    parrafos distintos y esa cadena no existe tal cual. Se consumen palabras EN ORDEN con cursor.
import io, json, re, sys, difflib

GUION = sys.argv[1] if len(sys.argv) > 1 else "D:/rkalarm/rkalarm_GUION.txt"
ASR   = sys.argv[2] if len(sys.argv) > 2 else "D:/rkalarm/audio/rkalarm_asr.json"
PLAN  = sys.argv[3] if len(sys.argv) > 3 else "D:/rkalarm/rkalarm_plan.json"
OUT   = sys.argv[4] if len(sys.argv) > 4 else "D:/rkalarm/rkalarm_anclado.json"

norm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())

guion = io.open(GUION, encoding="utf-8").read()
asr   = json.load(io.open(ASR, encoding="utf-8"))
plan  = json.load(io.open(PLAN, encoding="utf-8"))

# --- palabras del guion, conservando su posicion de caracter ---
gw, gpos = [], []
for m in re.finditer(r"\S+", guion):
    n = norm(m.group(0))
    if n:
        gw.append(n); gpos.append(m.start())
aw = [norm(w["w"]) for w in asr["words"]]
at = [w["t"] for w in asr["words"]]
print("palabras · guion %d · ASR %d" % (len(gw), len(aw)))

# --- ALINEACION GLOBAL ---
sm = difflib.SequenceMatcher(None, gw, aw, autojunk=False)
ms = [None] * len(gw)
ig = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            ms[i1 + k] = at[j1 + k]
        ig += i2 - i1
    elif j2 > j1 and i2 > i1:
        a, b = at[j1], at[j2 - 1]
        for k in range(i2 - i1):
            ms[i1 + k] = a + (b - a) * k / max(1, i2 - i1)
print("similitud guion<->ASR: %.1f%%  ·  palabras en bloques EQUAL: %d (%.1f%%)"
      % (100 * sm.ratio(), ig, 100.0 * ig / len(gw)))

# relleno de huecos + monotonia forzada
ult = 0.0
for i in range(len(ms)):
    if ms[i] is None: ms[i] = ult
    ms[i] = max(ms[i], ult); ult = ms[i]
sin = sum(1 for x in ms if x is None)
print("palabras sin ms tras el relleno: %d" % sin)

# --- ubicar cada momento EN EL GUION consumiendo palabras en orden ---
M = plan["momentos"]
cur = 0
anclados, fallidos = 0, []
for m in M:
    d = [norm(w) for w in re.findall(r"\S+", m.get("dice") or "")]
    d = [x for x in d if x]
    if not d:
        m["ms"] = ms[min(cur, len(ms) - 1)]; fallidos.append(m["id"]); continue
    # el texto del momento tiene que arrancar en el cursor (particionan el guion en orden)
    if gw[cur:cur + len(d)] == d:
        m["ms"] = ms[cur]; cur += len(d); anclados += 1
    else:
        # tolerancia: buscar el arranque cerca del cursor
        hall = -1
        for off in range(0, 60):
            if gw[cur + off:cur + off + len(d)] == d: hall = cur + off; break
        if hall >= 0:
            m["ms"] = ms[hall]; cur = hall + len(d); anclados += 1
        else:
            m["ms"] = ms[min(cur, len(ms) - 1)]; fallidos.append(m["id"])

print("\nmomentos anclados EXACTO: %d de %d (%.1f%%)" % (anclados, len(M), 100.0 * anclados / len(M)))
print("sin anclaje exacto: %d %s" % (len(fallidos), fallidos[:8]))

# --- compuertas ---
fail = []
mss = [m["ms"] for m in M]
if any(mss[i] < mss[i - 1] - 0.001 for i in range(1, len(mss))):
    fail.append("los ms NO son monotonos")
if mss[0] > 3.0:
    fail.append("el primer momento arranca en %.1fs (deberia ser ~0)" % mss[0])
if mss[-1] > asr["dur"]:
    fail.append("el ultimo momento (%.1fs) cae despues del audio (%.1fs)" % (mss[-1], asr["dur"]))
cob = 100.0 * mss[-1] / asr["dur"]
print("cobertura temporal del plan: %.1f%% del audio (ultimo momento %.1fs de %.1fs)" % (cob, mss[-1], asr["dur"]))
if cob < 90: fail.append("el plan solo cubre el %.1f%% del audio" % cob)
if anclados / len(M) < 0.90: fail.append("anclaje exacto %.1f%% (<90%%)" % (100.0 * anclados / len(M)))

plan["audio_dur"] = asr["dur"]
json.dump(plan, io.open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("escrito: %s" % OUT)
if fail:
    print("\n⛔ %d FALLAS:" % len(fail))
    for f in fail: print("   -", f)
    sys.exit(1)
print("\nOK · anclaje valido")
