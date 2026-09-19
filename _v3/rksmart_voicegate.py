# rksmart_voicegate.py — COMPUERTA DURA DE INTELIGIBILIDAD de la locución Fish, POR BLOQUE.
# Fish devolvió audio ININTELIGIBLE en 3 videos del Free Builder y se explicó como ruido 3 veces.
# Acá no se explica: si un bloque mide mal, se regenera.
#
#   python _v3/rksmart_voicegate.py
#
# Mide, por bloque: % de palabras del guion ancladas EXACTO contra el ASR · la RACHA más larga de
# palabras seguidas que el ASR no dijo (la firma del garbling: un hueco aislado es un número,
# cinco seguidas es audio roto) · y la confianza media del ASR en ese tramo.
# ⛔ Imprime SIEMPRE cuántos bloques y cuántas palabras midió: una compuerta que puede dar 0 sin
#    mirar nada tiene que decir cuánto miró.
import json, sys, importlib.util, re
from pathlib import Path

spec = importlib.util.spec_from_file_location("ff", "fish_factory.py")
ff = importlib.util.module_from_spec(spec)
sys.modules["ff"] = ff
try:
    spec.loader.exec_module(ff)
except SystemExit:
    pass

# ⛔ EL HUECO POR SÍ SOLO NO DECIDE. Medido acá: las 17 rachas ≥3 del primer pase eran las 17
#    CIFRAS del guion ("four hundred and sixty dollars") que el ASR escribe en dígitos ("$460").
#    Cero basura léxica. Un medidor que cuenta eso como garbling manda a regenerar audio sano —
#    es el mismo defecto que una compuerta que da verde sin mirar, sólo que al revés.
#    Una racha sólo cuenta si NO es una cifra: palabras de número/moneda contra dígitos en el ASR.
NUMPAL = set("""zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen
fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety
hundred thousand million dollar dollars cent cents percent point and a an dot app vercel b c""".split())


def es_cifra(pal, asr):
    """La racha es una CIFRA leída: sólo palabras de número y el ASR responde con dígitos/símbolos."""
    if not all(re.sub(r"[^a-z]", "", p.lower()) in NUMPAL for p in pal):
        return False
    return bool(re.search(r"\d", asr))


TXT = Path("canales/rksmart_GUION.txt").read_text(encoding="utf-8")
blocks = ff.split_blocks(TXT, 1200)
W = json.load(open("_v3/rksmart_words.json", encoding="utf-8"))
caps = json.load(open("public/captions_rksmart.json", encoding="utf-8"))

# offset de caracteres de cada bloque dentro del guion (split_blocks no cambia el texto, sólo corta)
pos, spans = 0, []
for b in blocks:
    i = TXT.find(b.strip()[:60], pos)
    if i < 0:
        i = pos
    spans.append((i, i + len(b.strip())))
    pos = i + len(b.strip())

malos, n_pal = [], 0
print("bloque  palabras  exacto%  racha  cifras  conf  dur     veredicto")
for k, (c0, c1) in enumerate(spans):
    ws = [w for w in W if w["c0"] >= c0 and w["c1"] <= c1 + 2]
    if not ws:
        malos.append((k, "sin palabras"))
        continue
    n_pal += len(ws)
    ex = sum(1 for w in ws if w["exact"]) / len(ws)
    t0, t1 = ws[0]["t"], ws[-1]["t"]
    # racha REAL = la más larga de palabras seguidas que el ASR no dijo Y que no son una cifra
    mx, cur, n_cifra = 0, [], 0
    for w in ws + [{"exact": True, "w": "", "t": t1}]:
        if not w["exact"]:
            cur.append(w)
            continue
        if cur:
            a = "".join(c["text"] for c in caps
                        if cur[0]["t"] - 0.4 <= c["startMs"] / 1000 <= cur[-1]["t"] + 1.0)
            if es_cifra([x["w"] for x in cur], a):
                n_cifra += 1
            else:
                mx = max(mx, len(cur))
            cur = []
    cf = [c["confidence"] for c in caps if t0 <= c["startMs"] / 1000 <= t1]
    conf = sum(cf) / len(cf) if cf else 0
    mal = mx >= 4 or conf < 0.72
    if mal:
        malos.append((k, "racha REAL %d conf %.2f (exacto %.0f%%)" % (mx, conf, 100 * ex)))
    print("b%03d    %5d     %5.1f   %4d  %4d  %.2f  %6.1fs  %s"
          % (k, len(ws), 100 * ex, mx, n_cifra, conf, t1 - t0, "GARBLED" if mal else "ok"))

print("\nMEDIDO: bloques %d · palabras %d · marcados %d" % (len(spans), n_pal, len(malos)))
if len(spans) < 5 or n_pal < 500:
    sys.exit("⛔ el medidor midió muy poco — está roto")
for k, why in malos:
    print("  ⛔ b%03d: %s" % (k, why))
sys.exit(3 if malos else 0)
