# COMPUERTA DE SONIDO del canal Rhonda. SLUG=x R=<worktree> python vlog/rhonda/sfx_gate.py [--prev D:/Proyectos/video2-wt/rhtoiletrim/:rhtoiletrim ...]
#  1) 0 efectos de los videos anteriores: ni la misma ruta, ni el mismo archivo (md5), ni el mismo sonido (huella de envolvente,
#     correlación ≥0,92 con duración parecida) — contra TODO lo que sonó en esos videos (SFX, FOLEY, ambiente de mix.py, public/sfx).
#  2) minuto 1: ≥1 efecto que arranca en cada corte (de -0,35 a +0,6 s del corte).
#  3) ninguna escena sin ambiente: cada cuadro del video cae dentro de un tramo AMB.
# Sale con 1 si falla algo; imprime JSON con los números.
import json, re, os, sys, hashlib, subprocess, glob, numpy as np
S = os.environ["SLUG"]; R = os.environ.get("R")
prev = [a.rsplit(":", 1) for a in sys.argv[sys.argv.index("--prev") + 1:]] if "--prev" in sys.argv else []
FPS = 30
def tl(root, slug):
    ts = open(root + f"src/{slug}/timeline.gen.ts", encoding="utf8").read()
    g = lambda k: json.loads(m.group(1)) if (m := re.search(rf"export const {k}: any\[\] = (.*);", ts)) else []
    return ts, g
def fp(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", "8000", "-t", "20", "-f", "s16le", "-"], capture_output=True).stdout
    x = np.frombuffer(raw, np.int16).astype(np.float32)
    if len(x) < 800: return None, 0
    n = len(x) // 80; e = np.sqrt((x[: n * 80].reshape(n, 80) ** 2).mean(1) + 1e-6); e = np.log(e + 1)
    return (e - e.mean()) / (e.std() + 1e-6), len(x) / 8000
md5 = lambda p: hashlib.md5(open(p, "rb").read()).hexdigest()
# ── lo que sonó en los videos anteriores
old = set()
for root, slug in prev:
    ts, g = tl(root, slug)
    for s in g("SFX") + g("FOLEY") + g("AMB"): old.add(root + "public/" + s["src"])
    mx = open(root + "vlog/rhonda/mix.py", encoding="utf8").read() if os.path.exists(root + "vlog/rhonda/mix.py") else ""
    for m in re.findall(r'"((?:sfx|sfx_pro)/[^"]+\.(?:mp3|wav|flac|m4a))"', mx): old.add(root + "public/" + m)
    for f in glob.glob(root + "public/sfx/*"): old.add(f.replace("\\", "/"))
old = [p for p in old if os.path.isfile(p)]
# ── lo que suena en ESTE video
ts, g = tl(R, S); SFX, AMB, FOLEY = g("SFX"), g("AMB"), g("FOLEY"); TL = g("TL")
TOTAL = int(re.search(r"TOTAL_FRAMES = (\d+)", ts).group(1))
cur = sorted({s["src"] for s in SFX + AMB + FOLEY})
fails = []
oldmd5 = {md5(p): p for p in old}; oldfp = [(p,) + fp(p) for p in old]
for c in cur:
    p = R + "public/" + c
    if not os.path.isfile(p): fails.append(f"no existe {c}"); continue
    if any(os.path.basename(c) == os.path.basename(o) for o in old): fails.append(f"mismo nombre que el video anterior: {c}")
    if md5(p) in oldmd5: fails.append(f"mismo archivo que {oldmd5[md5(p)]}: {c}"); continue
    e, d = fp(p)
    if e is None: continue
    for o, eo, do in oldfp:
        if eo is None or abs(do - d) > 0.25 * max(d, do): continue
        k = min(len(e), len(eo)); r = float(np.corrcoef(e[:k], eo[:k])[0, 1]) if k > 20 else 0
        if r >= 0.92: fails.append(f"mismo sonido (r={r:.2f}) que {o}: {c}")
# ── minuto 1: cada corte con su efecto
cuts = [c["from"] for c in TL if 0 < c["from"] < 60 * FPS]
starts = sorted(s["from"] for s in SFX)
sin = [round(f / FPS, 2) for f in cuts if not any(-0.35 * FPS <= s - f <= 0.6 * FPS for s in starts)]
if sin: fails.append(f"cortes del minuto 1 sin efecto: {sin}")
# ── ninguna escena sin ambiente
cov = np.zeros(TOTAL, bool)
for a in AMB: cov[a["from"]: a["from"] + a["dur"]] = True
huecos = int((~cov).sum())
if huecos: fails.append(f"{huecos} cuadros sin ambiente")
res = {"efectos_distintos": len(cur), "sfx": len(SFX), "ambientes": len(AMB), "previos_comparados": len(old), "cortes_min1": len(cuts), "cortes_min1_sin_efecto": len(sin), "cuadros_sin_ambiente": huecos, "fallas": fails}
print(json.dumps(res, ensure_ascii=False, indent=1))
sys.exit(1 if fails else 0)
