# jobs de MMAudio desde los clips aprobados: FULL (detalle, video tal cual) y GATE (hablado, cara tapada después con mask_faces.py)
import json, sys, os
sys.path.insert(0, "."); from soundmap import FULL, GATE
V = "D:/Proyectos/video2-wt/faoliva/vlog/faoliva/"
full, gate = [], []
for s in [f"S{i}" for i in range(1, 12)]:
    P = json.load(open(V + f"plan_{s}.json", encoding="utf-8")); st = json.load(open(V + f"{s}/clips/state.json", encoding="utf-8"))
    for c in P["clips"]:
        cid = c["id"]
        if cid not in FULL and cid not in GATE: continue
        if cid not in st: continue
        if os.path.exists(f"out_full/{cid}.flac") or os.path.exists(f"out_gate/{cid}.flac"): continue
        j = {"name": cid, "video": V + f"{s}/clips/" + st[cid]["file"], "dur": st[cid]["T"], "prompt": FULL.get(cid) or GATE[cid]}
        if cid in FULL: j["kf"] = True; full.append(j)
        else: gate.append(j)
json.dump(full, open("jobs_full.json", "w", encoding="utf-8"), ensure_ascii=False)
json.dump(gate, open("jobs_gate.json", "w", encoding="utf-8"), ensure_ascii=False)
print("full", len(full), "gate", len(gate), "de", len(FULL), len(GATE))
