# Clips que faltan o hay que rehacer porque su foto base cambió (no aprobada en la ronda 1 de agnes_img_pro), con la foto FINAL.
#   python vlog/hh/clips2.py     → _v3/<slug>_i2v_c.json (y mueve a backup los clips viejos hechos sobre una foto rechazada)
import json, os, shutil, time
R = "D:/Proyectos/video2-wt/lhh/"; W = R + "public/img/_hh_agnes/_agnes_pro/"
SL = ["hhdollar", "hhwinter", "hhexpire", "hhfreeze", "hhgrocery", "hhscraps", "hhvinegar", "hhperox", "hhtoilet", "hhnever"]
g1 = json.load(open(W + "_ronda1/_g1.json", encoding="utf8")); g2 = json.load(open(W + "_ronda1/_g2.json", encoding="utf8"))
r1ok = {k for k in g1 if g1[k].get("ok") and g2.get(k, {}).get("ok")}
base2 = {x["name"] for x in json.load(open(R + "_v3/base2.json"))}
tot = 0
for s in SL:
    L = json.load(open(R + f"_v3/{s}_i2v.json", encoding="utf8")); hecho = {x["nombre"] for x in json.load(open(R + f"_v3/{s}_i2v_a.json", encoding="utf8"))}
    todo = []
    for it in L:
        n = it["nombre"]; k = f"{s}__{n}"
        if k in base2: continue
        if not os.path.exists(R + f"public/img/_hh_agnes/{k}.png"): continue          # todavía sin aprobar
        clip = R + f"public/broll/{s}/{n}.mp4"
        if n in hecho and k in r1ok and os.path.exists(clip): continue                # clip sobre la foto aprobada
        if os.path.exists(clip):
            os.makedirs(R + f"_v3/bak_{s}/qc", exist_ok=True); shutil.move(clip, R + f"_v3/bak_{s}/qc/{n}_fotovieja_{int(time.time())}.mp4")
        png = R + f"public/img/{s}/{n}.png"
        if os.path.exists(png): os.remove(png)
        todo.append(it)
    json.dump(todo, open(R + f"_v3/{s}_i2v_c.json", "w", encoding="utf8"), indent=1); tot += len(todo)
    print(s, len(todo), [x["nombre"] for x in todo][:8])
print("clips a hacer:", tot)
