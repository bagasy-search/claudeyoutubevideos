# Formato nuevo (sin esperar a agnes): pasa tramos vl "a cámara" a av2 (2º /run del avatar, ≤240 s) hasta ~META s.
# Prioridad: escenas donde Claudio sólo habla (salón, preguntas, costo, mesa) y nunca un tramo con clip agnes ya aprobado.
#   SLUG=x python vlog/cc/av2sel.py [META=200]  → reescribe vlog/<slug>/segs.json (backup en segs_pre_av2.json)
import json, os, sys, shutil
S = os.environ["SLUG"]; R = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))).replace("\\", "/") + "/"
META = float(sys.argv[1]) if len(sys.argv) > 1 else 200.0
D = R + f"vlog/{S}/"; p = D + "segs.json"
if not os.path.exists(D + "segs_pre_av2.json"): shutil.copy(p, D + "segs_pre_av2.json")
segs = json.load(open(D + "segs_pre_av2.json", encoding="utf8"))
J = lambda f, d=None: json.load(open(f, encoding="utf8")) if os.path.exists(f) else d
ok = set()
for sc in {s["sc"] for s in segs if s["kind"] == "vl"}:
    st = J(D + sc + "/clips/state.json", {}); chk = J(D + sc + "/vl_check.json", {})
    ok |= {i for i, v in st.items() if chk.get(i, {}).get("ok") and chk[i].get("file") == v.get("file")}
PRI = ["salon", "preguntas", "costo", "costo_b", "mesa_res", "mesa_ama", "mesa_cta1", "mesa_err", "mesa_hist", "retoma", "mercado", "mesa_cmp"]
tot = 0.0; marc = []
for sc in PRI:
    for s in segs:
        if s["kind"] == "vl" and s["sc"] == sc and s["id"] not in ok:
            d = s["e"] - s["s"]
            if tot + d > META + 8: continue
            s["kind"] = "av2"; tot += d; marc.append(s["id"])
json.dump(segs, open(p, "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(f"{S}: av2 {len(marc)} tramos · {tot:.1f} s · {' '.join(marc)}")
