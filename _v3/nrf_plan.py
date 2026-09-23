# nrf_plan.py — momentos del DIRECTOR → _v3/nrfloaters_plan.json (formato de build_nrfloaters.mjs).
# Decide por momento con los assets REALES en disco (mide cada mp4 con ffprobe):
#   A → ventana de avatar (win-NNN.mp4, una por ventana fusionada)
#   S → clip de stock (+ 2º plano x_ si el director lo pidió); si el clip no alcanza, el sobrante lo toma el x_
#       o, si no hay, la foto de presentador más cercana
#   F → clip de stock + capa procedural de floaters (FloaterClip)
#   P/D → clip agnes (si pasó QC) + cola en foto, o foto sola
#   C → componente con CAMA = un cuadro del plano ANTERIOR (mismo contexto; nunca vacío = nunca negro)
#   L → lámina; los L CONSECUTIVOS se funden en UN beat (Lamina3D re-entra en cada montaje) con keys relativas
import json, os, subprocess, sys
SLUG = "nrfloaters"; PUB = "public"; END_MS = 1191400
M = json.load(open(f"_v3/{SLUG}_moments.json", encoding="utf-8"))
wins = json.load(open(f"_avatar_fp8/{SLUG}/windows.json"))
def dur(rel):
    p = os.path.join(PUB, rel)
    if not os.path.exists(p): return 0.0
    try: return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], text=True).strip())
    except Exception: return 0.0
img = lambda i: f"img/{SLUG}/{i}.jpg"
agn = lambda i: f"broll/{SLUG}/{i}.mp4"
stk = lambda n: f"broll/{SLUG}/{n}.mp4"
fotos = [(m["ms"], img(m["id"])) for m in M if m["t"] == "P" and os.path.exists(os.path.join(PUB, img(m["id"])))]
def foto_cerca(ms, excl=()):
    c = [f for f in fotos if f[1] not in excl] or fotos
    return min(c, key=lambda f: abs(f[0] - ms))[1] if c else None
ALIAS = {"@m_eye": "Your eye, the ball of your eye, isn't empty.", "@m_pvd": "it shrinks a little and it pulls away from the back wall of the eye."}
by_snip = {m["snip"]: m for m in M}
def fix_props(p):
    if isinstance(p, dict): return {k: fix_props(v) for k, v in p.items()}
    if isinstance(p, list): return [fix_props(v) for v in p]
    if isinstance(p, str) and p in ALIAS: return img(by_snip[ALIAS[p]]["id"])
    return p
def cama_de(prev):
    """un cuadro del plano anterior como cama del componente (mismo contexto visual)."""
    if not prev: return foto_cerca(0)
    if prev["tipo"] == "imagen": return prev["src"]
    src = prev.get("src") or prev.get("clip")
    if not src or not src.endswith(".mp4"): return foto_cerca(prev["ms_in"])
    out = f"img/{SLUG}/bed_{os.path.basename(src)[:-4]}.jpg"
    if not os.path.exists(os.path.join(PUB, out)):
        t = max(0.2, min(dur(src) * 0.5, (prev["ms_out"] - prev["ms_in"]) / 2000))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.2f}", "-i", os.path.join(PUB, src), "-frames:v", "1", "-vf", "scale=1920:1080", "-q:v", "3", os.path.join(PUB, out)], check=True)
    return out

beats, overlays, faltan, usados = [], [], [], set()
def push(**b): beats.append(b)
wi = 0
for k, m in enumerate(M):
    a = m["ms"]; z = m["ms_out"] or END_MS; t = m["t"]
    xq = m.get("x"); xs = 0.0
    if xq:
        xd = dur(stk("x_" + m["id"]))
        if xd > 1.5: xs = min((z - a) / 2000, 4.5, xd - 0.1)
        else: faltan.append("x_" + m["id"])
    zm = z - int(xs * 1000)
    if t == "A":
        if beats and beats[-1]["tipo"] == "avatar" and beats[-1]["ms_out"] == a:
            beats[-1]["ms_out"] = z; continue
        wi += 1
        push(tipo="avatar", ms_in=a, ms_out=z, clip=f"avatar/{SLUG}/win-{wi:03d}.mp4")
        continue
    if t in "SF":
        src = stk("s_" + m["id"]); sd = dur(src)
        if sd < 1.5:
            faltan.append("s_" + m["id"]); f = foto_cerca(a); push(tipo="imagen", ms_in=a, ms_out=zm, src=f); usados.add(f)
        else:
            push(tipo="floaters" if t == "F" else "clip", ms_in=a, ms_out=zm, src=src, **({"kind": m["fl"]} if t == "F" else {}))
            if (zm - a) / 1000 > sd - 0.1:
                cut = a + int((sd - 0.1) * 1000); beats[-1]["ms_out"] = cut
                if xs:      # el 2º plano arranca antes y se queda con todo el sobrante
                    xs = (z - cut) / 1000; zm = cut
                else:
                    f = foto_cerca(cut, usados); usados.add(f); push(tipo="imagen", ms_in=cut, ms_out=zm, src=f)
    elif t in "PD":
        f = img(m["id"])
        if not os.path.exists(os.path.join(PUB, f)): faltan.append(f); f = foto_cerca(a)
        usados.add(f)
        ad = dur(agn(m["id"])) if m.get("anim") else 0
        if ad > 1.5:
            cut = min(zm, a + int((ad - 0.1) * 1000))
            push(tipo="clip", ms_in=a, ms_out=cut, src=agn(m["id"]))
            nxtA = k + 1 < len(M) and M[k + 1]["t"] == "A"
            if zm - cut > 300 or nxtA: push(tipo="imagen", ms_in=cut, ms_out=zm, src=f)
            else: beats[-1]["_pull"] = cut      # el plano siguiente arranca antes (nunca estirar el clip)
        else:
            push(tipo="imagen", ms_in=a, ms_out=zm, src=f)
    elif t == "C":
        prev = next((b for b in reversed(beats) if b["tipo"] in ("clip", "imagen", "floaters")), None)
        push(tipo="componente", ms_in=a, ms_out=zm, componente=m["comp"], props=dict(fix_props(m["props"]), bed=cama_de(prev)))
    elif t == "L":
        keys = [dict(at_ms=kk["at_ms"], x=kk["x"], y=kk["y"], w=kk["w"], h=kk["h"], **({"mark": False} if kk.get("mark") is False else {})) for kk in m["keys"]]
        if beats and beats[-1]["tipo"] == "lamina" and beats[-1]["ms_out"] == a:     # fundir con el L anterior
            beats[-1]["ms_out"] = zm; beats[-1]["_keys"] += keys
            if m.get("cta_ms"): beats[-1]["_cta"] = m["cta_ms"]
        else:
            push(tipo="lamina", ms_in=a, ms_out=zm, src=f"img/{SLUG}_lamina.jpg", _keys=keys, _cta=m.get("cta_ms"))
    if xs: push(tipo="clip", ms_in=zm, ms_out=z, src=stk("x_" + m["id"]))
    if m["snip"].startswith("And there's a variant of the glide"):
        overlays.append(dict(ms_in=a + 600, ms_out=z, props=dict(eyebrow="IN THE DESCRIPTION", title="The Reading Glide", sub="For a floater that keeps landing on the line you read", showQr=False)))
# keys relativas al inicio del beat de lámina
for b in beats:
    if b["tipo"] == "lamina":
        b["keys"] = [dict({k: v for k, v in kk.items() if k != "at_ms"}, at=round(max(0, (kk["at_ms"] - b["ms_in"]) / 1000), 2)) for kk in b.pop("_keys")]
        c = b.pop("_cta")
        if c: b["cta"] = round((c - b["ms_in"]) / 1000, 2)
for i in range(len(beats) - 1):
    if "_pull" in beats[i]: beats[i + 1]["ms_in"] = beats[i].pop("_pull")
# apertura: el avatar abre y se sostiene >= 3 s (regla del creador); win-001 trae 3,17 s de video
if beats[0]["tipo"] == "avatar" and beats[1]["ms_in"] < 3000: beats[1]["ms_in"] = 3000
for i in range(len(beats) - 1): beats[i]["ms_out"] = beats[i + 1]["ms_in"]
beats[-1]["ms_out"] = END_MS
assert wi == len(wins), f"ventanas del plan {wi} != windows.json {len(wins)}"
json.dump(dict(totalMs=END_MS + 400, beats=beats, overlays=overlays), open(f"_v3/{SLUG}_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print("beats", len(beats), dict(Counter(b["tipo"] for b in beats)), "overlays", len(overlays))
if faltan: print("⚠️ faltan/cortos:", len(faltan), faltan[:30])
rel = [b for b in beats if b["tipo"] in ("clip", "floaters") and "/s_" in b["src"] or "/x_" in b.get("src", "")]
print("metraje REAL (stock) %.1f%%" % (100 * sum(b["ms_out"] - b["ms_in"] for b in rel) / END_MS))
