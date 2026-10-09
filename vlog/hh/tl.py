# Plan + ASR alineado → tomas al ms → src/<slug>/timeline.gen.ts (formato LorMain) + _v3/<slug>_shots.json (para avatar_run build)
# + _<slug>_assets.txt (farm) + _v3/<slug>_tl.json (métricas, capítulos, CTAs, refs con su minuto REAL).
#   python vlog/hh/tl.py <slug> [--final]
# Reglas: corte 40 ms antes de la palabra · toma <1 s se cae (la anterior se estira) · página >15 s se parte en arriba/abajo ·
#         overlays: nombre 5 s, rótulo del truco 5 s, BE CAREFUL 9 s · avatar visible ≤ 580 s (un solo job de RunPod).
import json, os, sys, re, subprocess
R = "D:/Proyectos/video2-wt/lhh/"; BR = "D:/claude-brain/canales/loretta-house-hacks/"
S = sys.argv[1]; FINAL = "--final" in sys.argv; FPS = 30; F = lambda t: int(round(t * FPS))
SERIE = {v["slug"]: v for v in json.load(open(BR + "serie.json", encoding="utf8"))}; V = SERIE[S]
ITEM = {it["page"]: it for it in V["items"]}
P = json.load(open(R + f"_v3/{S}_plan.json", encoding="utf8")); W = json.load(open(R + f"_v3/{S}_wordms.json", encoding="utf8"))
assert len(W) == P["words"], (len(W), P["words"])
END = W[-1]["e"] + 0.8
T = lambda w: 0.0 if w <= 0 else (W[w]["s"] - 0.04 if w < len(W) else END)
SHOTK = {"av", "pg", "lor", "bi", "cl", "ei", "qr"}
shots = [dict(m, t=T(m["w"])) for m in P["marks"] if m["k"] in SHOTK]
for i in range(1, len(shots)):  # monotonía
    shots[i]["t"] = max(shots[i]["t"], shots[i - 1]["t"])
# tomas cortas (<1 s) se caen; dos av seguidos → uno
out = []
for i, s in enumerate(shots):
    nx = shots[i + 1]["t"] if i + 1 < len(shots) else END
    if nx - s["t"] < 1.0 and i > 0: continue
    if out and out[-1]["k"] == "av" and s["k"] == "av": continue
    out.append(s)
shots = out
for i, s in enumerate(shots): s["e"] = shots[i + 1]["t"] if i + 1 < len(shots) else END
# página larga → arriba / abajo
used = {(s["page"], s.get("half", "")) for s in shots if s["k"] == "pg"}; ext = []
for s in shots:
    if s["k"] == "pg" and s["e"] - s["t"] > 15 and not s.get("half") and (s["page"], "low") not in used:
        mid = s["t"] + (s["e"] - s["t"]) / 2; ws = [w["s"] - 0.04 for w in W if s["t"] + 4 < w["s"] < s["e"] - 4]
        if ws: mid = min(ws, key=lambda x: abs(x - mid))
        ext.append(dict(s, t=mid, half="low", auto=1)); s["e"] = mid; used.add((s["page"], "low"))
shots = sorted(shots + ext, key=lambda s: s["t"])
for i, s in enumerate(shots): s["e"] = shots[i + 1]["t"] if i + 1 < len(shots) else END
# ── avatar
av = [s for s in shots if s["k"] == "av"]; av_s = sum(s["e"] - s["t"] for s in av)
json.dump({"END": END, "shots": [{"kind": s["k"], "name": s.get("name", ""), "start": round(s["t"], 3), "end": round(s["e"], 3)} for s in shots]},
          open(R + f"_v3/{S}_shots.json", "w"), indent=0)
avwin = json.load(open(R + f"_v3/{S}_avwin.json"))["win"] if os.path.exists(R + f"_v3/{S}_avwin.json") else []
AVSRC = f"avatar_clips/{S}/reel30.mp4"; AV_READY = os.path.exists(R + "public/" + AVSRC)
ex = lambda p: os.path.exists(R + "public/" + p)
def probe(p):
    try: return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", R + "public/" + p], capture_output=True, text=True).stdout)
    except Exception: return 0
TOTAL = F(END + 0.4); cues, ovs, sfx, warn = [], [], [], []
for i, s in enumerate(shots):
    f0 = F(s["t"]); f1 = F(shots[i + 1]["t"]) if i + 1 < len(shots) else TOTAL
    c = {"k": s["k"], "from": f0, "dur": max(1, f1 - f0), "seed": (f0 * 2654435761) % 4294967296}
    k = s["k"]
    if k == "av":
        w = next((w for w in avwin if s["t"] >= w["s"] - 0.15 and s["e"] <= w["e"] + 0.2), None)
        if avwin and not w: warn.append(f"av sin ventana @{s['t']:.1f}")
        c.update(k="av", src=AVSRC if AV_READY else None, sf=F(s["t"] - w["ms"] + w["off"] + w.get("lag", 0)) if w else 0)
    elif k in ("bi", "lor", "cl"):
        img = f"img/{S}/{s['name']}.jpg"; c.update(k="img", img=img if ex(img) else None)
        if not ex(img): warn.append(f"falta imagen {s['name']}")
        clip = f"broll/{S}/{s['name']}.mp4"
        if k == "cl" and ex(clip): c.update(clip=clip, clipF=int(probe(clip) * FPS) - 1, real=1)
        elif k == "cl": warn.append(f"falta clip {s['name']}")
    elif k == "ei":
        img = f"img/{S}/{s['name']}.jpg"; c.update(k="snap", img=img if ex(img) else None)
        if not ex(img): warn.append(f"falta snapshot {s['name']}")
    elif k == "pg":
        c.update(k="comp", name="LorPage", props={"src": f"img/hhpages/p{s['page']:03d}.jpg", "page": s["page"], "half": s.get("half", "")}, real=1)
        sfx.append({"from": f0, "dur": 30, "src": "sfx/papers.mp3", "vol": 0.16})
    elif k == "qr":
        c.update(k="comp", name="LorQR", props={"src": f"img/hhpages/qr_{S}.png", "cover": "img/hhpages/cover.png"})
        sfx.append({"from": f0, "dur": 30, "src": "sfx/sfx_pop.mp3", "vol": 0.22})
    cues.append(c)
for m in P["marks"]:
    t = T(m["w"]); f0 = F(t)
    if m["k"] == "name": ovs.append({"from": f0 + 9, "dur": F(5), "name": "LorNameTag", "props": {"name": "Loretta", "sub": "81 · farm wife & church cook · Iowa"}})
    elif m["k"] == "tt":
        it = ITEM.get(m["page"]);
        if it: ovs.append({"from": f0 + 6, "dur": F(5), "name": "LorNameTag", "props": {"name": it["h"], "sub": f"No. {it['num']} · page {it['page']} of the House Book"}})
    elif m["k"] == "care":
        txt = m.get("text") or (ITEM.get(m["page"]) or {}).get("limit")
        if txt: ovs.append({"from": f0 + 3, "dur": min(F(9), TOTAL - f0 - 3), "name": "LorCareful", "props": {"text": txt}}); sfx.append({"from": f0 + 3, "dur": 20, "src": "sfx/sfx_chime.mp3", "vol": 0.12})
for o in ovs:
    if o["name"] == "LorNameTag": sfx.append({"from": o["from"] + 4, "dur": 15, "src": "sfx/sfx_paper_tick.mp3", "vol": 0.18})
gaps = [i for i in range(1, len(cues)) if cues[i]["from"] != cues[i - 1]["from"] + cues[i - 1]["dur"]]
assert not gaps, gaps[:5]
os.makedirs(R + f"src/{S}", exist_ok=True)
open(R + f"src/{S}/timeline.gen.ts", "w", encoding="utf8").write(
    f"// GENERADO por vlog/hh/tl.py (SLUG={S}) — no editar a mano\nexport const TOTAL_FRAMES = {TOTAL};\nexport const AUDIO = \"{S}.m4a\";\n"
    f"export const TL: any[] = {json.dumps(cues)};\nexport const OV: any[] = {json.dumps(ovs)};\nexport const SFX: any[] = {json.dumps(sfx)};\nexport const FOLEY: any[] = [];\n")
refs = {f"{S}.m4a", "ref_lor.png"}
def walk(o):
    if isinstance(o, str):
        if re.match(r"^(img|broll|vid|sfx|avatar_clips)/.+\.(jpg|png|mp4|m4a|mp3|wav)$", o): refs.add(o)
    elif isinstance(o, dict): [walk(v) for v in o.values()]
    elif isinstance(o, list): [walk(v) for v in o]
walk(cues); walk(ovs); walk(sfx)
for c in cues:
    if c.get("clip") and c["clipF"] < c["dur"]: refs.add(c["clip"].replace(".mp4", "_last.jpg"))
falt = sorted(r for r in refs if not ex(r) and r != f"{S}.m4a")
open(R + f"_{S}_assets.txt", "w").write("\n".join(sorted(r for r in refs if ex(r) or r == f"{S}.m4a")) + "\n")
# métricas
dur = lambda kk: sum(c["dur"] for c in cues if c["k"] == kk) / FPS
clip_s = sum(min(c["dur"], c.get("clipF", 0)) for c in cues if c.get("clip")) / FPS
pg_s = sum(c["dur"] for c in cues if c.get("name") == "LorPage") / FPS
snap_s = dur("snap")
mm = lambda t: f"{int(t // 60)}:{int(t % 60):02d}"
info = {"slug": S, "dur": round(TOTAL / FPS, 1), "avatar_s": round(av_s, 1), "avatar_pct": round(100 * av_s / END, 1),
        "real_pct": round(100 * (pg_s + clip_s + snap_s) / END, 1), "pages_pct": round(100 * pg_s / END, 1), "clips_pct": round(100 * clip_s / END, 1),
        "cta": {m["k"]: mm(T(m["w"])) for m in P["marks"] if m["k"].startswith("cta")},
        "qr": [mm(s["t"]) + f" ({s['e'] - s['t']:.1f} s)" for s in shots if s["k"] == "qr"],
        "refs": [(m["ref"], mm(T(m["w"]))) for m in P["marks"] if m["k"] == "x"],
        "chapters": [(mm(T(m["w"])), m["title"]) for m in P["marks"] if m["k"] == "ch"],
        "shots": len(cues), "shot_median_s": sorted(c["dur"] for c in cues)[len(cues) // 2] / FPS}
json.dump(info, open(R + f"_v3/{S}_tl.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
print(f"{S}: {info['dur']} s · tomas {len(cues)} (mediana {info['shot_median_s']:.1f} s) · avatar {av_s:.0f} s ({info['avatar_pct']} %) · real {info['real_pct']} % (págs {info['pages_pct']} · clips {info['clips_pct']}) · CTA {info['cta']} · QR {info['qr']} · avatar {'LISTO' if AV_READY else 'pendiente'}")
if av_s > 580: print("⛔ avatar visible > 580 s: no entra en un job")
if falt: print(f"⚠️ faltan {len(falt)} assets: {falt[:6]}")
if warn: print(f"⚠️ {len(warn)} avisos: {warn[:6]}")
if FINAL and (falt or warn or not AV_READY): sys.exit("⛔ --final: faltan assets / avatar")
