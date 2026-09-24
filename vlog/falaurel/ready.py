import json, os, sys
S = sys.argv[1]; upto = sys.argv[2] if len(sys.argv) > 2 else None   # upto = última ancla aprobada (ej K7)
p = json.load(open(f"D:/Proyectos/video2-wt/falaurel/vlog/falaurel/plan_{S}.json", encoding="utf-8")); A = p["dir"] + "/anc/"
st = json.load(open(p["dir"] + "/clips/state.json")) if os.path.exists(p["dir"] + "/clips/state.json") else {}
lim = int(upto[1:]) if upto else 10**9
ids = [c["id"] for c in p["clips"] if c["id"] not in st and os.path.exists(A + c["a"] + ".png") and os.path.exists(A + c["b"] + ".png") and int(c["b"][1:]) <= lim and (c.get("kf") or c.get("line") or c.get("audio"))]
print(" ".join(ids))
