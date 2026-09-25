# arma jobs de MMAudio para los clips GATE ya generados que todavía no tienen su flac
import json, os, glob
from soundmap import GATE
B = "D:/Proyectos/video2-wt/falaurel/vlog/falaurel/"
J = []
for f in glob.glob(B + "S*/clips/state.json"):
    st = json.load(open(f)); D = os.path.dirname(f) + "/"
    for cid, s in st.items():
        if cid in GATE and not os.path.exists(B + f"foley/out_gate/{cid}.flac"):
            J.append({"name": cid, "video": D + s["file"], "dur": s["T"], "prompt": GATE[cid]})
json.dump(J, open(B + "foley/jobs_gate.json", "w", encoding="utf-8"), indent=0); print(len(J), "jobs")
