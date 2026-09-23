# nrt_plan.py — momentos del DIRECTOR → _v3/nrtinnitus_plan.json (formato de build_nrtinnitus.mjs).
# Decide por momento, con los assets REALES en disco (mide cada mp4 con ffprobe):
#   A → ventana de avatar (win-NNN.mp4, una por ventana fusionada)
#   S → clip de stock; si el clip es más corto que el momento, el resto lo cubre el 2º plano o una foto vecina
#   P/G/H → clip agnes (si pasó QC) + cola en foto (≤ lo que falte), o foto sola
#   x → 2º plano de stock al final del momento (≤4 s)
#   C → componente con CAMA = la foto más cercana del plan (nunca vacío = nunca negro)
#   L → lámina con keys relativas al inicio del tramo y CTA (portada + QR)
import json, os, subprocess, sys
SLUG = "nrtinnitus"; PUB = "public"; END_MS = 1100125
M = json.load(open("_v3/nrt_moments.json", encoding="utf-8"))
wins = json.load(open(f"_avatar_fp8/{SLUG}/windows.json"))
def dur(rel):
    p = os.path.join(PUB, rel)
    if not os.path.exists(p): return 0.0
    try: return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], text=True).strip())
    except Exception: return 0.0
img = lambda i: f"img/{SLUG}/{i}.jpg"
agn = lambda i: f"broll/{SLUG}/{i}.mp4"
stk = lambda n: f"broll/{SLUG}/{n}.mp4"
# fotos disponibles, por tiempo (para camas y relleno)
fotos = [(m["ms"], img(m["id"])) for m in M if m["t"] in "PGH" and os.path.exists(os.path.join(PUB, img(m["id"])))]
def foto_cerca(ms, excl=()):
    c = [f for f in fotos if f[1] not in excl]
    return min(c, key=lambda f: abs(f[0] - ms))[1] if c else None
ALIAS = {"@m_cochlea": "Inside your ear, in a little spiral", "@m_anat": "is through the bones and the muscles of your head and neck.", "@m_harold_back": "Six weeks later he came back."}
by_snip = {m["snip"]: m for m in M}
def fix_props(p):
    if isinstance(p, dict): return {k: fix_props(v) for k, v in p.items()}
    if isinstance(p, list): return [fix_props(v) for v in p]
    if isinstance(p, str) and p in ALIAS: return img(by_snip[ALIAS[p]]["id"])
    return p

beats, overlays, faltan, usados = [], [], [], set()
def push(**b): beats.append(b)
wi = 0
for k, m in enumerate(M):
    a = m["ms"]; z = m["ms_out"] or END_MS; d = (z - a) / 1000
    xq = m.get("x"); xs = 0.0
    if xq:
        xd = dur(stk("x_" + m["id"]))
        if xd > 1.5: xs = min(d / 2, 4.0, xd - 0.1)
        else: faltan.append("x_" + m["id"])
    zm = z - int(xs * 1000)   # fin de la parte principal
    t = m["t"]
    if t == "A":
        if beats and beats[-1]["tipo"] == "avatar" and beats[-1]["ms_out"] == a:   # fusionada: se estira
            beats[-1]["ms_out"] = z; continue
        wi += 1
        push(tipo="avatar", ms_in=a, ms_out=z, clip=f"avatar/{SLUG}/win-{wi:03d}.mp4")
        continue
    if t == "S":
        src = stk("s_" + m["id"]); sd = dur(src)
        if sd < 1.5: faltan.append("s_" + m["id"]); f = foto_cerca(a); push(tipo="imagen", ms_in=a, ms_out=zm, src=f); usados.add(f)
        else:
            push(tipo="clip", ms_in=a, ms_out=zm, src=src)
            if (zm - a) / 1000 > sd - 0.1:   # el clip no alcanza: el sobrante lo toma una foto vecina
                cut = a + int((sd - 0.1) * 1000); beats[-1]["ms_out"] = cut
                f = foto_cerca(cut, usados); usados.add(f); push(tipo="imagen", ms_in=cut, ms_out=zm, src=f)
    elif t in "PGH":
        f = img(m["id"])
        if not os.path.exists(os.path.join(PUB, f)): faltan.append(f); f = foto_cerca(a)
        usados.add(f)
        ad = dur(agn(m["id"])) if m.get("anim") else 0
        if ad > 1.5:
            cut = min(zm, a + int((ad - 0.1) * 1000))
            push(tipo="clip", ms_in=a, ms_out=cut, src=agn(m["id"]))
            if zm - cut > 300: push(tipo="imagen", ms_in=cut, ms_out=zm, src=f)
            else: beats[-1]["ms_out"] = zm
        else:
            push(tipo="imagen", ms_in=a, ms_out=zm, src=f)
    elif t == "C":
        bed = foto_cerca(a)
        push(tipo="componente", ms_in=a, ms_out=zm, componente=m["comp"], props=dict(fix_props(m["props"]), bed=bed))
    elif t == "L":
        keys = [dict(at=round(max(0, (kk["at_ms"] - a) / 1000), 2), x=kk["x"], y=kk["y"], w=kk["w"], h=kk["h"], **({"mark": False} if kk.get("mark") is False else {})) for kk in m["keys"]]
        b = dict(tipo="lamina", ms_in=a, ms_out=zm, src=f"img/{SLUG}_lamina.jpg", keys=keys)
        if m.get("cta_ms"): b["cta"] = round((m["cta_ms"] - a) / 1000, 2)
        beats.append(b)
    if xs: push(tipo="clip", ms_in=zm, ms_out=z, src=stk("x_" + m["id"]))
    if m.get("ov") == "desc":
        overlays.append(dict(ms_in=a + 600, ms_out=z, props=dict(eyebrow="IN THE DESCRIPTION", title="The Jaw-Drum Combo", sub="Step by step, for ringing that changes when you clench", showQr=False)))
# ── v2: viaje continuo cóclea → células ciliadas (UN plano, sin corte) ──
ja = next(i for i, b in enumerate(beats) if b.get("src", "").endswith("/m027.jpg"))
jb = ja + 1
while not beats[jb].get("src", "").split("/")[-1].startswith("m028"): jb += 1
end = beats[jb]["ms_out"]
for x in range(jb + 1, len(beats)):
    if beats[x].get("src", "").split("/")[-1].startswith("m028"): end = beats[x]["ms_out"]
    else: break
at = round((beats[jb]["ms_in"] - beats[ja]["ms_in"]) / 1000, 2)
jr = dict(tipo="journey", ms_in=beats[ja]["ms_in"], ms_out=end, a=img("m027"), b=img("m028"), at=at, fx=0.72, fy=0.52)
beats = beats[:ja] + [jr] + [b for b in beats[ja + 1:] if not (b["ms_in"] < end and b["ms_in"] >= beats[ja]["ms_in"])]
# ── v3: PRIMER MINUTO inmersivo (tiempos relativos al inicio de cada cue, desde el mapa palabra→ms) ──
def swap(a_ms, z_ms, beat):
    global beats
    beats = [b for b in beats if not (a_ms <= b["ms_in"] < z_ms)]
    beats.append(beat); beats.sort(key=lambda b: b["ms_in"])
R = lambda s, base: round(s - base, 2)
swap(11520, 25560, dict(tipo="premium", comp="HonestKnob", ms_in=11520, ms_out=25560, props=dict(bed=img("m001"),
     tStamp=R(12.5, 11.52), tKnob=R(17.7, 11.52), tTurn0=R(20.2, 11.52), tTurn1=R(21.5, 11.52), tMin=R(22.2, 11.52), tLonger=R(24.6, 11.52))))
swap(33320, 55040, dict(tipo="premium", comp="NightShot", ms_in=33320, ms_out=55040, props=dict(a=img("room_a"), b=img("room_b"), c=img("room_c2"), d=img("room_d"),
     at=dict(tvOff=R(35.5, 33.32), lampOff=R(36.9, 33.32), loud=R(39.6, 33.32), hiss=R(40.9, 33.32), whistle=R(41.6, 33.32), crickets=R(43.6, 33.32), oldTv=R(47.1, 33.32), day=R(49.6, 33.32), night=R(51.9, 33.32)))))
swap(60080, 72020, dict(tipo="premium", comp="FearThoughts", ms_in=60080, ms_out=72020, props=dict(bg=img("room_c2"),
     lines=[dict(text="Am I going deaf?", at=R(60.1, 60.08)), dict(text="Is something wrong with my brain?", at=R(61.2, 60.08)), dict(text="Is this… for the rest of my life?", at=R(62.9, 60.08))],
     tDim=R(65.7, 60.08), quote="You'll just have to learn to live with it.", tQuote=R(70.0, 60.08), tCrack=R(71.3, 60.08))))
overlays[:0] = [dict(comp="OpeningHUD", ms_in=0, ms_out=11520, props=dict(tNow=1.0, tSixty=6.3, tHands=10.2, tEnd=11.52)),
                dict(comp="ThumbOpen", ms_in=0, ms_out=1000, props=dict(src="img/nrtinnitus_thumb.jpg")),
                dict(comp="WhichGroup", ms_in=27400, ms_out=33320, props=dict(tAsk=R(32.1, 27.4)))]
# contigüidad estricta
for i in range(len(beats) - 1): beats[i]["ms_out"] = beats[i + 1]["ms_in"]
beats[-1]["ms_out"] = END_MS
assert wi == len(wins), f"ventanas del plan {wi} != windows.json {len(wins)}"
json.dump(dict(totalMs=END_MS + 400, beats=beats, overlays=overlays), open(f"_v3/{SLUG}_plan.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
from collections import Counter
print("beats", len(beats), dict(Counter(b["tipo"] for b in beats)), "overlays", len(overlays))
if faltan: print("⚠️ faltan/cortos:", len(faltan), faltan[:20])
