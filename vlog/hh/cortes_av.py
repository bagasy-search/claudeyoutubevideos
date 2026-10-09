# Tramos de avatar > 20 s → puntos de corte para un plano de b-roll de ~9 s (1 si dura ≤ 34 s, 2 si más).
#   python vlog/hh/cortes_av.py list            → _v3/cortes_av.json (slug, id, palabra de entrada/salida, texto que se dice)
#   python vlog/hh/cortes_av.py apply <prompts.json>  → inserta {bi id: prompt} y {av} en guiones/<slug>_hh.txt (por índice de palabra)
import json, re, sys
R = "D:/Proyectos/video2-wt/lhh/"
SL = ["hhdollar", "hhwinter", "hhexpire", "hhfreeze", "hhgrocery", "hhscraps", "hhvinegar", "hhperox", "hhtoilet", "hhnever"]
if sys.argv[1] == "list":
    out = []
    for s in SL:
        W = json.load(open(R + f"_v3/{s}_wordms.json", encoding="utf8"))
        sh = json.load(open(R + f"_v3/{s}_shots.json"))["shots"]
        k = 0
        for x in sh:
            d = x["end"] - x["start"]
            if x["kind"] != "av" or d <= 20: continue
            n = 1 if d <= 34 else 2
            for j in range(n):
                tc = x["start"] + d * (j + 1) / (n + 1) - 4.5
                wa = min(range(len(W)), key=lambda i: abs(W[i]["s"] - tc) + (0 if W[i]["w"][:1].isupper() or (i and W[i-1]["w"][-1:] in ".,?!") else 1.5))
                wb = min(range(len(W)), key=lambda i: abs(W[i]["s"] - (W[wa]["s"] + 9)) + (0 if (i and W[i-1]["w"][-1:] in ".,?!") else 1.0))
                if W[wb]["s"] - W[wa]["s"] < 6 or W[wb]["s"] > x["end"] - 3: continue
                k += 1
                out.append({"slug": s, "id": f"x{k:02d}", "wa": wa, "wb": wb, "t": round(W[wa]["s"], 1), "dur": round(W[wb]["s"] - W[wa]["s"], 1),
                            "texto": " ".join(w["w"] for w in W[max(0, wa - 12):wb])})
    json.dump(out, open(R + "_v3/cortes_av.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
    for o in out: print(f'{o["slug"]} {o["id"]} @{o["t"]//60:.0f}:{o["t"]%60:04.1f} ({o["dur"]} s) | {o["texto"]}')
    print(len(out), "cortes")
elif sys.argv[1] == "apply":
    P = json.load(open(sys.argv[2], encoding="utf8")); C = {(o["slug"], o["id"]): o for o in json.load(open(R + "_v3/cortes_av.json", encoding="utf8"))}
    for s in SL:
        ins = {}
        for (sl, i), o in C.items():
            if sl != s or f"{s}:{i}" not in P: continue
            ins.setdefault(o["wa"], []).append("{bi " + i + ": " + P[f"{s}:{i}"] + "}"); ins.setdefault(o["wb"], []).append("{av}")
        if not ins: continue
        src = open(R + f"guiones/{s}_hh.txt", encoding="utf8").read().split("\n"); out = []; w = 0
        for line in src:
            if not line.strip() or line.lstrip().startswith("#"): out.append(line); continue
            # recorrer tokens de texto (sin marcas) contando palabras; insertar antes de la palabra w
            parts = re.split(r"(\{[^{}]*\})", line); new = []
            for p in parts:
                if p.startswith("{"): new.append(p); continue
                toks = re.split(r"(\s+)", p); buf = []
                for t in toks:
                    if t and not t.isspace():
                        if w in ins: buf.append("".join(ins.pop(w)))
                        w += 1
                    buf.append(t)
                new.append("".join(buf))
            out.append("".join(new))
        assert not ins, ins
        open(R + f"guiones/{s}_hh.txt", "w", encoding="utf8", newline="\n").write("\n".join(out))
        print(s, "ok")
