# ARMADOR MIXTO ccmuslos: un video en TIEMPO DEL MÁSTER (30 fps, 1920x1080), tramo por tramo de segs.json, más su mezcla de sonido.
#   av  → reel del avatar (InfiniteTalk, 25 fps 832x464) en FULL; t_reel = off + (t − ms) + LIP (adelanto de labios medido)
#   kf  → D:/rtmp/cc/ccmuslos/kf/out/<id>.mp4 (agnes 2.5 kf, sonido real a −22 dB)
#   st  → public/broll/ccmuslos_st/<id>.mp4 (stock real, mudo) · si no, gap/out/<id>.mp4 (agnes i2v, sonido a −26 dB)
#         tramo sin toma: lo cubre la toma vecina de la misma escena estirada (velocidad ≥ 0,5×), nunca repetida
#   vl  → vlog/ccmuslos/<esc>/clips (vl_check ok), trunc al tramo, mudo (la voz es el máster) · sin clip: Ken-Burns K(n-1)→Kn
#   cmp → cama del componente (Ken-Burns lento); el componente lo pone Remotion encima (ov.json)
# Salida: D:/rtmp/cc/ccmuslos/arm/vlog_full.mp4 (mudo) + arm/mix_full.wav (voz + clips) + arm/armado.json (qué fuente usó cada tramo)
#   LIP=0.10 python vlog/ccmuslos/armar.py [--solo ids,coma]   (re-hace sólo esos tramos y vuelve a concatenar)
import json, os, subprocess, sys, numpy as np
R = "D:/Proyectos/video2-wt/ccfrijoles/"; D = R + "vlog/ccmuslos/"; C = "D:/rtmp/cc/ccmuslos/"; O = os.environ.get("ARM", "C:/rtmp_cc/ccmuslos/arm/")
os.makedirs(O + "seg", exist_ok=True)
FPS, W, H, SR = 30, 1920, 1080, 48000
LIP = float(os.environ.get("LIP", "0"))
J = lambda f, d=None: json.load(open(f, encoding="utf8")) if os.path.exists(f) else d
segs = J(D + "segs.json"); AVW = J(R + "_v3/ccmuslos_avwin.json"); AVW2 = J(R + "_v3/ccmuslos_avwin2.json"); LG2 = J(R + "_v3/ccmuslos_lag2.json", {"scale": 1.0, "lag": LIP})
SOLO = set(sys.argv[sys.argv.index("--solo") + 1].split(",")) if "--solo" in sys.argv else None
fr = lambda t: round(t * FPS)
dur = lambda f: float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout or 0)
ENC = ["-c:v", "libx264", "-crf", "17", "-preset", "veryfast", "-bf", "0", "-pix_fmt", "yuv420p", "-r", "30", "-an"]
COVER = f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},setsar=1"
CMP_BED = {"m01": R + "public/img/ccmuslos/bed_piel.jpg", "m02": R + "public/img/ccmuslos/antes.jpg"}

def run(a): subprocess.run(["ffmpeg", "-v", "error", "-y"] + a, check=True)
def clip(src, out, n, ss=0.0, speed=1.0, vf=""):
    """n cuadros a 30 fps desde src (ss en s de la fuente); speed<1 = cámara lenta; si la fuente no alcanza, congela el último cuadro."""
    f = f"{vf}{COVER},setpts=(PTS-STARTPTS)/{speed},fps={FPS},tpad=stop_mode=clone:stop_duration=30"
    run(["-ss", f"{ss:.3f}", "-i", src, "-vf", f, "-frames:v", str(n)] + ENC + [out])
def kenburns(a, b, out, n):
    za = f"scale=2560:1440,zoompan=z='1+0.05*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS}"
    if b is None: run(["-loop", "1", "-i", a, "-vf", za, "-frames:v", str(n)] + ENC + [out]); return
    zb = f"scale=2560:1440,zoompan=z='1.05-0.05*on/{n}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS}"
    # corte SECO a la mitad (como un cambio de toma), nunca fundido: el fundido entre dos poses dejaba a Claudio "fantasma"
    if n < 3.2 * FPS: run(["-loop", "1", "-i", a, "-vf", za, "-frames:v", str(n)] + ENC + [out]); return
    n1 = n // 2; n2 = n - n1
    za1 = za.replace(f"/{n}'", f"/{n1}'").replace(f"d={n}:", f"d={n1}:"); zb2 = zb.replace(f"/{n}'", f"/{n2}'").replace(f"d={n}:", f"d={n2}:")
    run(["-loop", "1", "-i", a, "-loop", "1", "-i", b, "-filter_complex", f"[0]{za1},trim=end_frame={n1},setpts=PTS-STARTPTS[a];[1]{zb2},trim=end_frame={n2},setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1",
         "-frames:v", str(n)] + ENC + [out])

# ---- fuentes por tramo -------------------------------------------------------------------------------------------------------
vlok = {}
for sc in sorted({s["sc"] for s in segs if s["kind"] in ("vl", "av2")}):
    P = D + sc + "/"; st = J(P + "clips/state.json", {}); chk = J(P + "vl_check.json", {}); plan = J(P + "plan.json")
    for c in plan["clips"]:
        i = c["id"]
        hv = J(P + "clips/check_hist.json", {}).get(i, {}).get(st.get(i, {}).get("file"), {}).get("verd")   # veredicto de `agnes_vlog check`
        if i in st and ((chk.get(i, {}).get("ok") and chk[i].get("file") == st[i]["file"]) or hv == "ok"): vlok[i] = (P + "clips/" + st[i]["file"], None)
        else: vlok[i] = (None, (P + f"anc/{c['a']}.png", P + f"anc/{c['b']}.png"))
def st_src(i):
    for f, g in ((R + f"public/broll/ccmuslos_st/{i}.mp4", None), (C + f"gap/out/{i}.mp4", -26)):
        if os.path.exists(f): return f, g
    return None, None

import glob
KFI = {}
for pf in sorted(glob.glob(C + "kf/pares*.json")):
    for p_ in J(pf, []): KFI.setdefault(p_["id"], p_["first"])
plan = []  # (seg, n, tipo, fuente, ss, speed, gain_db)
k = 0
while k < len(segs):
    s = segs[k]; n = fr(s["e"]) - fr(s["s"])
    if s["kind"] == "st":
        f, g = st_src(s["id"])
        if f is None and plan and plan[-1][2] == "st" and plan[-1][0]["sc"] == s["sc"] and plan[-1][3]:
            p = plan.pop(); k0 = p[0]; tot = p[1] + n                       # la toma anterior cubre también este tramo
            L = dur(p[3]); sp = max(0.5, min(1.0, L / (tot / FPS)))
            plan.append(({**k0, "id": k0["id"] + "+" + s["id"], "e": s["e"]}, tot, "st", p[3], 0.0, sp, p[6])); k += 1; continue
        if f is None:                                                      # primero de la escena sin toma: lo cubre la siguiente
            j = k + 1
            while j < len(segs) and segs[j]["kind"] == "st" and segs[j]["sc"] == s["sc"] and st_src(segs[j]["id"])[0] is None: j += 1
            if j < len(segs) and segs[j]["kind"] == "st" and segs[j]["sc"] == s["sc"]:
                f, g = st_src(segs[j]["id"]); tot = fr(segs[j]["e"]) - fr(s["s"]); L = dur(f); sp = max(0.5, min(1.0, L / (tot / FPS)))
                plan.append(({**s, "id": "+".join(x["id"] for x in segs[k:j + 1]), "e": segs[j]["e"]}, tot, "st", f, 0.0, sp, g)); k = j + 1; continue
            plan.append((s, n, "hueco", None, 0, 1, None)); k += 1; continue
        plan.append((s, n, "st", f, 0.0, max(0.5, min(1.0, dur(f) / (n / FPS))), g))
    elif s["kind"] == "kf":
        f = C + f"kf/out/{s['id']}.mp4"
        if os.path.exists(f): plan.append((s, n, "kf", f, 0.0, 1.0, -22))
        elif os.path.exists(KFI.get(s["id"], "")): plan.append((s, n, "kf_kb", KFI[s["id"]], 0, 1, None))   # agnes no llegó: KB de su foto (nunca esperar)
        else: plan.append((s, n, "kf", None, 0.0, 1.0, -22))
    elif s["kind"] == "av":
        w = next(w for w in AVW["win"] if w["s"] - 0.01 <= s["s"] <= w["e"]); plan.append((s, n, "av", R + "out/ccmuslos_avatar/reel.mp4", w["off"] + (s["s"] - w["ms"]) + LIP, 1.0, None))
    elif s["kind"] == "av2":   # 2º /run del avatar (formato nuevo: avatar ~25 %, sin esperar a agnes)
        w = next(w for w in AVW2["win"] if w["s"] - 0.01 <= s["s"] <= w["e"]); plan.append((s, n, "av", R + "out/ccmuslos_avatar2/reel.mp4", LG2["scale"] * (w["off"] + (s["s"] - w["ms"])) + LG2["lag"], 1.0, None))   # deriva lineal InfiniteTalk (vlog/cc/avlag.py)
    elif s["kind"] == "vl":
        f, kb = vlok[s["id"]]; plan.append((s, n, "vl" if f else "vl_kb", f or kb, 0.0, 1.0, None))
    elif s["kind"] == "cmp":
        plan.append((s, n, "cmp", CMP_BED[s["id"]], 0, 1, None))
    k += 1

# ---- render por tramo ----------------------------------------------------------------------------------------------------------
lst, rep = [], []
for i, (s, n, t, f, ss, sp, g) in enumerate(plan):
    out = O + f"seg/{i:03d}_{s['id'].split('+')[0]}.mp4"; lst.append(out)
    rep.append({"i": i, "id": s["id"], "kind": t, "src": f if isinstance(f, str) else (f[0] if f else None), "s": s["s"], "e": s["e"], "n": n, "speed": round(sp, 3), "gain": g})
    if os.path.exists(out) and (SOLO is None or not (set(s["id"].split("+")) & SOLO)): continue
    if t in ("st", "kf", "vl") and f: clip(f, out, n, ss, sp)
    elif t == "av": clip(f, out, n, ss, 1.0, vf="unsharp=5:5:0.6,")
    elif t == "vl_kb": kenburns(f[0], f[1] if os.path.exists(f[1]) else None, out, n) if os.path.exists(f[0]) else kenburns(R + "public/ref_ccmuslos.png", None, out, n)
    elif t in ("cmp", "kf_kb"): kenburns(f, None, out, n)
    else: run(["-f", "lavfi", "-i", f"color=c=black:s={W}x{H}:r={FPS}", "-frames:v", str(n)] + ENC + [out])   # hueco / kf aún sin clip
    print(f"{i:03d} {s['id']:<10} {t:<6} {n:>4} cuadros", flush=True)
open(O + "concat.txt", "w").write("".join(f"file '{x}'\n" for x in lst))
run(["-f", "concat", "-safe", "0", "-i", O + "concat.txt", "-c", "copy", O + "vlog_full.mp4"])
json.dump(rep, open(O + "armado.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)

# ---- mezcla: voz del máster + sonido real de los clips agnes (kf −22 dB, huecos −26 dB respecto de la voz) ---------------------
def load(f):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f, "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()
rms = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
V = load(R + "public/ccmuslos.wav"); N = len(V); vdb = rms(V[np.abs(V).max(1) > 0.02])
A = np.zeros_like(V)
for (s, n, t, f, ss, sp, g) in plan:
    if g is None or not isinstance(f, str) or not os.path.exists(f) or sp < 0.999: continue   # estirada = sin sonido (se oiría lento)
    x = load(f)
    if not len(x) or rms(x) < -60: continue
    i0 = int(round(fr(s["s"]) / FPS * SR)); L = min(len(x), int(n / FPS * SR), N - i0); x = x[:L] * 10 ** ((vdb + g - rms(x)) / 20)
    fk = min(int(0.12 * SR), L // 4); r = np.linspace(0, 1, fk, dtype=np.float32)[:, None]; x[:fk] *= r; x[-fk:] *= r[::-1]
    A[i0:i0 + L] += x
mix = V + A; pk = np.abs(mix).max()
if pk > 0.98: mix *= 0.98 / pk
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "pcm_s16le", O + "mix_full.wav"], input=mix.astype(np.float32).tobytes(), check=True)
from collections import Counter
cnt = Counter(r["kind"] for r in rep); sec = Counter()
for r in rep: sec[r["kind"]] += r["n"] / FPS
print("ARMADO", round(fr(segs[-1]["e"]) / FPS, 2), "s ·", " · ".join(f"{k} {cnt[k]} ({sec[k]:.0f} s)" for k in cnt))
print("metraje real (stock):", round(sum(r["n"] for r in rep if r["kind"] == "st" and "broll" in (r["src"] or "")) / FPS, 1), "s")
