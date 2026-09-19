# scripts/rksafe_align.py <slug> — ANCLAJE AL MS + COMPUERTA DE INTELIGIBILIDAD (canal Ray Kessler).
#
# Hace las dos cosas de una sola alineacion, porque son la misma medicion:
#   1) `_v3/<slug>_words.json` = [{w, c0, t}] — cada palabra del GUION con su offset de caracter y su
#      milisegundo real. Es lo que consume scripts/rksafe_plan.mjs para anclar cada plano.
#   2) el informe de GARBLING de Fish por BLOQUE.
#
# ⛔⛔ NO se busca frase por frase en las captions. Medido: el match literal ancla el 27 % de los
#    momentos (las frases cortas no entran, el ASR escribe "$140" donde el guion dice "a hundred and
#    forty dollars", y un match tardio arrastra el cursor). Se alinean las DOS secuencias de palabras
#    UNA vez con difflib y se lee el ms de ahi: los numeros y las palabras comidas caen DENTRO de un
#    bloque `replace` y se interpolan.
#
# ⛔⛔ LA COMPUERTA QUE IMPORTA ES LA RACHA, NO EL LARGO DEL WAV. Fish s2.1 se come 10-50 palabras
#    seguidas y devuelve un wav de la duracion ESPERADA: ninguna compuerta de formato lo ve. Lo unico
#    que lo caza es la peor racha de palabras del guion SIN match en el ASR.
# ⛔ Y hay que EXIMIR la normalizacion de numeros: el ASR escribe "35" donde el guion dice "thirty
#    five" y "$27" donde dice "twenty seven dollars" -> 10-15 rachas FALSAS por video.
#
#   python scripts/rksafe_align.py <slug> [--racha 5] [--pct 88]
import argparse, difflib, json, re, sys
from pathlib import Path

for _s in (sys.stdout, sys.stderr):
    try: _s.reconfigure(encoding="utf-8", errors="replace")
    except Exception: pass

ap = argparse.ArgumentParser()
ap.add_argument("slug")
ap.add_argument("--racha", type=int, default=5)
ap.add_argument("--pct", type=float, default=88.0)
a = ap.parse_args()

guion = Path("canales/%s_GUION.txt" % a.slug).read_text(encoding="utf8")
caps = json.loads(Path("public/captions_%s.json" % a.slug).read_text(encoding="utf8"))
blocks = json.loads(Path("_v3/%s_blocks.json" % a.slug).read_text(encoding="utf8"))

# ── palabras del GUION, con su offset de caracter ────────────────────────────
GW = [(m.group(0), m.start()) for m in re.finditer(r"[A-Za-z0-9'’$%.,-]*[A-Za-z0-9][A-Za-z0-9'’$%-]*", guion)]
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
gw = [norm(w) for w, _ in GW]

# ── palabras del ASR ─────────────────────────────────────────────────────────
AW = [(norm(c["text"]), c["startMs"] / 1000.0, float(c.get("confidence", 1.0))) for c in caps]
AW = [x for x in AW if x[0]]
aw = [x[0] for x in AW]

sm = difflib.SequenceMatcher(None, gw, aw, autojunk=False)
ops = sm.get_opcodes()
ms = [None] * len(gw)
matched = [False] * len(gw)
for tag, i1, i2, j1, j2 in ops:
    if tag == "equal":
        for k in range(i2 - i1):
            ms[i1 + k] = AW[j1 + k][1]
            matched[i1 + k] = True
    elif j2 > j1 and i2 > i1:                      # replace: se interpola DENTRO del bloque
        t0, t1 = AW[j1][1], AW[j2 - 1][1]
        n = i2 - i1
        for k in range(n):
            ms[i1 + k] = t0 + (t1 - t0) * k / max(1, n - 1 if n > 1 else 1)

# relleno + monotonia forzada
last = 0.0
for i in range(len(ms)):
    if ms[i] is None: ms[i] = last
    ms[i] = max(ms[i], last)
    last = ms[i]

words = [{"w": gw[i], "c0": GW[i][1], "t": round(ms[i], 3)} for i in range(len(gw))]
Path("_v3/%s_words.json" % a.slug).write_text(json.dumps(words), encoding="utf8")

eq = sum(1 for m in matched if m)
pct_glob = eq / len(gw) * 100

# ── EXIMIR la normalizacion de numeros ───────────────────────────────────────
# Una racha de palabras sin match que contiene un numero escrito con letras Y cuyo tramo del ASR
# trae una CIFRA es la misma cosa dicha de otra forma, no audio comido.
NUMS = set(("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen "
            "fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy "
            "eighty ninety hundred thousand million percent dollars dollar point and a").split())

# ── racha maxima y %, POR BLOQUE ─────────────────────────────────────────────
# Cada bloque de Fish ocupa un tramo consecutivo de palabras del guion.
cursor = 0
filas = []
peor_racha = 0
for bi, b in enumerate(blocks):
    n = len(re.findall(r"[A-Za-z0-9'’$%.,-]*[A-Za-z0-9][A-Za-z0-9'’$%-]*", b))
    i0, i1 = cursor, min(cursor + n, len(gw))
    cursor = i1
    if i1 <= i0: continue
    seg = matched[i0:i1]
    pal = gw[i0:i1]
    # ⚠️ el % TAMBIEN tiene que eximir los numeros, no solo la racha: medido en rkspots, los 4
    #    bloques marcados por pct eran cifras bien dichas ("about four thousand doors" -> "4,000")
    #    y tenian racha 0. Sin esta exencion el gate da rojo sobre audio sano.
    utiles = [k for k in range(len(seg)) if not ((pal[k] in NUMS) or pal[k].isdigit())]
    if len(utiles) < 8: continue        # con menos de 8 palabras utiles el % no significa nada
    ok = sum(1 for k in utiles if seg[k])
    pct = ok / len(utiles) * 100
    r = rmax = 0
    ini = 0
    peor_ini = 0
    for k, m in enumerate(seg):
        if not m:
            if r == 0: ini = k
            r += 1
            if r > rmax: rmax, peor_ini = r, ini
        else:
            r = 0
    # exencion por numeros
    tramo = pal[peor_ini:peor_ini + rmax]
    if rmax and all((w in NUMS) or w.isdigit() for w in tramo):
        rmax = 0
    conf = sum(AW[j][2] for j in range(len(AW))) / max(1, len(AW))
    filas.append((bi, len(seg), pct, rmax, " ".join(tramo[:12])))
    peor_racha = max(peor_racha, rmax)

conf_med = sorted(x[2] for x in AW)[len(AW) // 2]
malos = [f for f in filas if f[2] < a.pct or f[3] > a.racha]

print("=" * 74)
print("MEDIDO: %d palabras de guion contra %d del ASR · %d bloques" % (len(gw), len(aw), len(filas)))
print("  anclaje global difflib   : %.2f %% EXACTO  (%d palabras)" % (pct_glob, eq))
print("  racha maxima de palabras del guion SIN match: %d   (umbral <=%d)" % (peor_racha, a.racha))
print("  confianza ASR mediana    : %.3f" % conf_med)
print("  bloques marcados         : %d de %d" % (len(malos), len(filas)))
for bi, n, pct, rmax, tramo in malos:
    print("   b%03d  %d pal · %.1f %% oidas · racha %d  «%s»" % (bi, n, pct, rmax, tramo))
print("  -> _v3/%s_words.json (%d palabras con su ms)" % (a.slug, len(words)))
print("=" * 74)
sys.exit(2 if malos else 0)
