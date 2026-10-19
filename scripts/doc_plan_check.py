# doc_plan_check.py — compuerta del estilo doc-naturaleza-ciencia-en v2: mide el PLAN antes del farm.
#
# Uso: python scripts/doc_plan_check.py plan.json [--video v,clip,real,yt,stock] [--gfx g,map,num,stat,chart,comp]
# plan.json: {"end": s, "shots":[{"a":0,"b":3.2,"k":"v","real":true?,"sfx":"revelacion"?,"big":true?}, ...]}
#   real  = metraje real (no IA). Si no está, cuenta como real k en {real, yt, stock, ar} o src que empiece con px/yt/nasa/noaa/pd.
#   big   = componente grande (mapa 3D, escala, corte, timeline 3D...).
# Sale con 1 si alguna medida no da (ver D:/claude-brain/estilos/doc-naturaleza-ciencia-en/ESTILO.md).
import argparse, json, statistics, sys

ap = argparse.ArgumentParser()
ap.add_argument("plan")
ap.add_argument("--video", default="v,clip,real,yt,stock,agnes")
ap.add_argument("--gfx", default="g,gfx,map,num,stat,chart,comp")
a = ap.parse_args()
P = json.load(open(a.plan, encoding="utf8"))
S = sorted(P["shots"], key=lambda s: s["a"])
end = float(P.get("end") or S[-1].get("b", S[-1]["a"] + 3))
for i, s in enumerate(S):
    s.setdefault("b", S[i + 1]["a"] if i + 1 < len(S) else end)
VID, GFX = set(a.video.split(",")), set(a.gfx.split(","))
REALK = {"real", "yt", "stock", "ar"}
def is_real(s):
    if "real" in s: return bool(s["real"])
    src = str(s.get("src", "")).lower()
    return s.get("k") in REALK or src.startswith(("px", "yt", "nasa", "noaa", "pd", "cm_"))
dur = lambda s: s["b"] - s["a"]
T = sum(dur(s) for s in S)
pv = sum(dur(s) for s in S if s.get("k") in VID) / T
pr = sum(dur(s) for s in S if is_real(s)) / T
med = statistics.median(dur(s) for s in S)
intro = [dur(s) for s in S if s["a"] < 60]
med_i = statistics.median(intro) if intro else 0
larg = max((s for s in S if not s.get("gancho") and "gc_" not in str(s.get("src", ""))), key=dur)   # el gancho found-footage (12-20 s, regla 19-oct) va entero a propósito
big = sum(1 for s in S if s.get("big")) or sum(1 for s in S if s.get("k") in GFX)
rev = sum(1 for s in S if s.get("sfx") == "revelacion")
chk = [("% tiempo en video", pv * 100, ">=", 65), ("% metraje real", pr * 100, ">=", 35),
       ("plano mediano (s)", med, "<=", 3.0), ("plano mediano 0-60 s (s)", med_i, "<=", 1.8),
       ("plano mas largo (s)", dur(larg), "<=", 4.0), ("s por componente grande", end / max(big, 1), "<=", 45),
       ("revelaciones marcadas", rev, ">=", 3)]
mal = 0
for n, v, op, lim in chk:
    ok = v >= lim if op == ">=" else v <= lim
    mal += not ok
    print(f"{'OK ' if ok else 'MAL'}  {n:28s} {v:7.1f}  (pide {op} {lim})")
print(f"plano mas largo: {larg.get('src')} en {larg['a']:.1f} s, {len(S)} planos, {end/60:.1f} min")
sys.exit(1 if mal else 0)
