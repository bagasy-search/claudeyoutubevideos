# Supervisor de clips furatones5: cada 8 min, por escena → vl_check (incremental) · si el proceso `clips` de la escena terminó y hay
# clips faltantes (REJECT quota / FAIL / TIMEOUT) o rechazados por la compuerta → relanza `clips <ids>` (un proceso por escena, máx 3
# intentos por clip). Log: vlog/furatones5/sup.log · estado: sup_state.json.   python vlog/furatones5/sup.py
import json, os, subprocess, time, datetime
R = "D:/Proyectos/video2-wt/furatones5/"; D = R + "vlog/furatones5/"
SC = "lav frente ferre puerta cocina lav2 patio mesa sala garaje noche techo cierre".split()
ST = D + "sup_state.json"; st = json.load(open(ST)) if os.path.exists(ST) else {"tries": {}}
procs = {}
def log(*a):
    with open(D + "sup.log", "a", encoding="utf8") as f: f.write(datetime.datetime.now().strftime("%H:%M:%S ") + " ".join(map(str, a)) + "\n")
def J(f, d=None):
    try: return json.load(open(f, encoding="utf8"))
    except Exception: return d
def main_done(s): return f"{s} clips terminó" in open(D + "chain.log", encoding="utf8").read()
env = {**os.environ, "SLUG": "furatones5", "PYTHONUTF8": "1", "AGNES_KEYS_OTRA_PC": ","}
while True:
    resumen = []
    for s in SC:
        P = D + s + "/"; plan = J(P + "plan.json"); ids = [c["id"] for c in plan["clips"]]
        state = J(P + "clips/state.json", {}); chk = J(P + "vl_check.json", {})
        if any(i in state and (i not in chk or chk[i].get("file") != state[i]["file"]) for i in ids):
            subprocess.run(["python", R + "vlog/claudio/vl_check.py"], env={**env, "VL_DIR": P}, capture_output=True, timeout=900)
            chk = J(P + "vl_check.json", {})
        ok = [i for i in ids if i in chk and chk[i].get("ok") and chk[i].get("file") == state.get(i, {}).get("file")]
        bad = [i for i in ids if i not in ok]
        resumen.append(f"{s} {len(ok)}/{len(ids)}")
        busy = (s in procs and procs[s].poll() is None) or not main_done(s)
        if bad and not busy:
            redo = [i for i in bad if st["tries"].get(i, 0) < 3]
            if redo:
                for i in redo: st["tries"][i] = st["tries"].get(i, 0) + 1
                json.dump(st, open(ST, "w"), indent=1)
                log(s, "relanzo", redo, {i: chk.get(i, {}).get("r") for i in redo})
                procs[s] = subprocess.Popen(["node", R + "scripts/agnes_vlog.mjs", P + "plan.json", "clips", *redo], cwd=R, env=env,
                                            stdout=open(D + f"clips_{s}.log", "a"), stderr=subprocess.STDOUT)
    log("ESTADO", " · ".join(resumen))
    if all(r.split()[1].split("/")[0] == r.split()[1].split("/")[1] for r in resumen): log("TODOS OK"); break
    time.sleep(480)
