# doc_cortes_check.py — compuerta de CORTES y CÁMARA de los documentales (megaprompt v3, 19-oct-2026).
# Va al lado de doc_plan_check.py; ninguna de las dos se saltea.
#
# Uso: python scripts/doc_cortes_check.py plan.json words.json [--desde 0] [--hasta 1e9] [--gancho 15]
#   plan.json : {"end": s, "shots": [{"a", "b", "cam": [z0,fx0,fy0,z1,fx1,fy1], "mov": "push|pull|pan|tilt|drift|quieto|parallax|crash"?,
#                                     "punto": true?  (corte de cambio de punto 7→6: no cuenta en el salto de cuadro)}]}
#   words.json: [{"w", "a", "b"}]  (ASR Groq al ms, ya corrido al tiempo del video)
# Mide (objetivos del §2.1 y §2.3):
#   cortes dentro de una palabra (±30 ms)        <= 3 %
#   cortes en pausa o en el arranque de palabra  >= 85 %   (arranque = ±60 ms del inicio; pausa = entre fin e inicio de la siguiente)
#   CV de la duración (desvío/mediana)           >= 0,55
#   ninguna duración (redondeada a 0,1 s)        <= 5 % de los planos
#   planos sin cam                               == 0
#   ningún tipo de movimiento                    <= 20 % de los planos
#   mismo tipo dos veces seguidas                == 0
#   ningún par (z0,z1) repetido                  <= 3 % de los planos
# Exit 0 = todo en verde · 1 = alguna medida falla · 2 = NO MIDIÓ (faltan datos): nunca se toma como verde.
import argparse, collections, json, statistics, sys

ap = argparse.ArgumentParser()
ap.add_argument("plan"); ap.add_argument("words")
ap.add_argument("--desde", type=float, default=0); ap.add_argument("--hasta", type=float, default=1e9)
ap.add_argument("--gancho", type=float, default=0, help="segundos del gancho found-footage (va entero, no se mide)")
a = ap.parse_args()
try:
    P = json.load(open(a.plan, encoding="utf8")); W = json.load(open(a.words, encoding="utf8"))
except Exception as e:
    print("NO MIDIÓ:", e); sys.exit(2)
S = sorted(P.get("shots", []), key=lambda s: s["a"])
W = sorted((w for w in W if w.get("b", 0) > w.get("a", 0)), key=lambda w: w["a"])
end = float(P.get("end") or (S[-1]["b"] if S else 0))
for i, s in enumerate(S): s.setdefault("b", S[i + 1]["a"] if i + 1 < len(S) else end)
lo, hi = max(a.desde, a.gancho), a.hasta
S = [s for s in S if s["a"] >= lo - 1e-6 and s["a"] < hi]
if len(S) < 8 or len(W) < 10:
    print(f"NO MIDIÓ: {len(S)} planos, {len(W)} palabras en el tramo"); sys.exit(2)

# ---------- §2.1 cortes contra la voz ----------
cuts = [s["a"] for s in S[1:]]
TOL, ACC = 0.03, 0.06
def clase(t):
    import bisect
    i = bisect.bisect_right([w["a"] for w in W], t) - 1          # última palabra que arrancó antes de t
    if i >= 0 and W[i]["a"] + TOL < t < W[i]["b"] - TOL:
        return "acento" if abs(t - W[i]["a"]) <= ACC else "dentro"
    if i + 1 < len(W) and abs(t - W[i + 1]["a"]) <= ACC: return "acento"
    if i >= 0 and abs(t - W[i]["a"]) <= ACC: return "acento"
    return "pausa"                                                 # entre fin de una palabra e inicio de la siguiente (o sin voz)
cl = collections.Counter(clase(t) for t in cuts)
nC = max(1, len(cuts))
dentro = cl["dentro"] / nC * 100
bueno = (cl["pausa"] + cl["acento"]) / nC * 100
dur = [s["b"] - s["a"] for s in S]
med = statistics.median(dur)
cv = statistics.pstdev(dur) / med if med else 0
red = collections.Counter(round(d, 1) for d in dur)
top_d, top_n = red.most_common(1)[0]
pct_top = top_n / len(dur) * 100 if top_n > 2 else 0.0   # máx(5 %, 2 planos): en un tramo de 30 planos el 5 % pediría 30 duraciones distintas

# ---------- §2.3 cámara ----------
def tipo(s):
    if s.get("mov"): return s["mov"]
    c = s.get("cam")
    if not c: return None
    z0, fx0, fy0, z1, fx1, fy1 = c
    if abs(z1 - z0) < 0.015 and abs(fx1 - fx0) < 0.02 and abs(fy1 - fy0) < 0.02: return "quieto"
    if abs(fx1 - fx0) >= 0.04 and abs(fx1 - fx0) >= abs(fy1 - fy0): return "pan"
    if abs(fy1 - fy0) >= 0.04: return "tilt"
    return "push" if z1 > z0 else "pull"
sin_cam = [s for s in S if not s.get("cam") and not s.get("mov")]
tipos = [tipo(s) for s in S]
tc = collections.Counter(t for t in tipos if t)
t_top, t_n = tc.most_common(1)[0] if tc else ("-", 0)
pct_tipo = t_n / len(S) * 100
seguidos = sum(1 for i in range(1, len(tipos)) if tipos[i] and tipos[i] == tipos[i - 1])
pares = collections.Counter((round(s["cam"][0], 2), round(s["cam"][3], 2)) for s in S if s.get("cam"))
p_top, p_n = pares.most_common(1)[0] if pares else ((0, 0), 0)
pct_par = p_n / len(S) * 100 if p_n >= 2 else 0.0   # "repetido" = aparece 2+ veces (en tramos de <34 planos 1 sola ya pasaba el 3 %)

chk = [
    ("cortes dentro de una palabra (%)", dentro, "<=", 3),
    ("cortes en pausa o acento (%)", bueno, ">=", 85),
    ("CV duración (desvío/mediana)", cv, ">=", 0.55),
    (f"duración más repetida {top_d:.1f} s (% planos)", pct_top, "<=", 5),
    ("planos sin cam", len(sin_cam), "<=", 0),
    (f"movimiento más usado «{t_top}» (% planos)", pct_tipo, "<=", 20),
    ("mismo movimiento dos veces seguidas", seguidos, "<=", 0),
    (f"par (z0,z1) más repetido {p_top} (% planos)", pct_par, "<=", 3),
]
mal = 0
print(f"tramo {lo:.1f}-{min(hi, end):.1f} s · {len(S)} planos · {len(cuts)} cortes · mediana {med:.2f} s · "
      f"pausa {cl['pausa']} / acento {cl['acento']} / dentro {cl['dentro']}")
for n, v, op, obj in chk:
    ok = v <= obj if op == "<=" else v >= obj
    mal += not ok
    print(f"  {'OK ' if ok else 'MAL'} {n:<48} {v:8.2f}  (objetivo {op} {obj})")
if cl["dentro"]:
    print("  cortes dentro de palabra:", ", ".join(f"{t:.2f}" for t in cuts if clase(t) == "dentro")[:400])
print("VERDE" if not mal else f"FALLA ({mal})")
sys.exit(1 if mal else 0)
