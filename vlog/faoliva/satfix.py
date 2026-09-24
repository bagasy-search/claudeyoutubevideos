# deriva de saturación de la cadena de anclas gpt-image (medida: +30-60 % de K0 a K20) → factor por clip satA/satB = sat(K0)/sat(ancla)
import json, sys, numpy as np
from PIL import Image
V = "D:/Proyectos/video2-wt/faoliva/vlog/faoliva/"
def sat(p): return np.asarray(Image.open(p).convert("HSV").resize((272, 152))).astype(float)[..., 1].mean()
for S in sys.argv[1:]:
    P = json.load(open(V + f"plan_{S}.json", encoding="utf-8")); A = P["dir"] + "/anc/"
    s0 = sat(A + "K0.png"); f = lambda k: float(min(1.05, max(0.62, s0 / sat(A + k + ".png"))))
    prev = 1.0
    for c in P["clips"]:
        if c.get("kf"): c["satA"] = c["satB"] = prev
        else: c["satA"], c["satB"] = f(c["a"]), f(c["b"]); prev = c["satB"]
    json.dump(P, open(V + f"plan_{S}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(S, " ".join(f"{c['satB']:.2f}" for c in P["clips"][::4]))
