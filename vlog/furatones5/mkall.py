# Junta las 13 escenas en UN plan (vlog/furatones5/all/plan.json + clips/state.json) para `agnes_vlog.mjs … armar` de una sola pasada
# (fronteras acumuladas en cuadros → el video dura exactamente lo que el máster). Clip que no pasó la compuerta (o no llegó):
#   --fallback → su ancla de inicio K(n-1) como foto con Ken-Burns lento (T s, 24 fps 1280x720) → <escena>/clips/<id>_kb.mp4
#   python vlog/furatones5/mkall.py [--fallback]
import json, os, sys, subprocess
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"; A = D + "all/"
SC = "lav frente ferre puerta cocina lav2 patio mesa sala garaje noche techo cierre".split()
os.makedirs(A + "clips", exist_ok=True); os.makedirs(A + "anc", exist_ok=True)
J = lambda f, d=None: json.load(open(f, encoding="utf8")) if os.path.exists(f) else d
clips, state, ov, falta = [], {}, {}, []
for s in SC:
    P = D + s + "/"; plan = J(P + "plan.json"); st = J(P + "clips/state.json", {}); chk = J(P + "vl_check.json", {})
    for c in plan["clips"]:
        i = c["id"]; ok = i in st and chk.get(i, {}).get("ok") and chk[i].get("file") == st[i]["file"]
        if not ok:
            kb = f"{i}_kb.mp4"
            if "--fallback" in sys.argv and not os.path.exists(P + "clips/" + kb):
                T = c["T"]; nf = T * 24
                subprocess.run(["ffmpeg", "-v", "error", "-y", "-loop", "1", "-i", P + f"anc/{c['a']}.png", "-vf",
                                f"scale=2560:1440,zoompan=z='1+0.06*on/{nf}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={nf}:s=1280x720:fps=24", "-frames:v", str(nf),
                                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "16", P + "clips/" + kb], check=True)
            if os.path.exists(P + "clips/" + kb): st[i] = {"file": kb, "T": c["T"]}; ov[i] = {"mode": "trunc", "cut": True}; falta.append(i + "(foto)")
            else: falta.append(i); continue
        state[i] = {**st[i], "file": f"../../{s}/clips/{st[i]['file']}"}
        clips.append({**c, "scene": s}); ov.setdefault(i, {"mode": "trunc"})
    # cada escena arranca con CORTE (otro lugar)
    first = plan["clips"][0]["id"]; ov[first] = {**ov.get(first, {}), "cut": True}
json.dump({"dir": A, "face": R + "public/ref_furatones5_face256.png", "k0_from": R + "public/ref_furatones5.png", "pronoun": "he",
           "anchors": [], "clips": clips, "overrides": ov, "out": A + "vlog.mp4"}, open(A + "plan.json", "w", encoding="utf8"), indent=1)
json.dump(state, open(A + "clips/state.json", "w", encoding="utf8"), indent=1)
print("clips en el armado", len(clips), "/ 76 · faltan/foto:", " ".join(falta) or "-")
