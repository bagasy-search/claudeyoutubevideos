# Clips que agnes no entregó o la compuerta rechazó → lista a2v de LTX-2.5 (Modal): foto = ancla de inicio, audio = tramo EXACTO.
import json, os
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"
SC = "lav frente ferre puerta cocina lav2 patio mesa sala garaje noche techo cierre".split()
LOOK = " Ordinary handheld video by a coworker at eye level, small natural shakes, everything in focus, natural light of the place. He speaks Spanish to the camera, his lips perfectly synced to the audio, natural face and hand movement."
out = []
for s in SC:
    P = D + s + "/"; plan = json.load(open(P + "plan.json", encoding="utf8"))
    st = json.load(open(P + "clips/state.json")) if os.path.exists(P + "clips/state.json") else {}
    chk = json.load(open(P + "vl_check.json", encoding="utf8")) if os.path.exists(P + "vl_check.json") else {}
    for c in plan["clips"]:
        i = c["id"]
        if i in st and chk.get(i, {}).get("ok") and chk[i].get("file") == st[i]["file"]: continue
        out.append({"id": i, "scene": s, "image": P + f"anc/{c['a']}.png", "audio": c["audio"], "dur": round(c["T"] - 0.0, 2) if False else round(float(os.popen(f'ffprobe -v error -show_entries format=duration -of csv=p=0 "{c["audio"]}"').read()), 3),
                    "prompt": c["action"].split(". " + "")[0][:900] + LOOK})
json.dump(out, open(D + "ltx/lista.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(len(out), "clips:", " ".join(x["id"] for x in out))
