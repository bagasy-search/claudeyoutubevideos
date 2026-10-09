# Loretta's House Hacks — guion DIRIGIDO (texto + marcas de plano en la misma línea) → guion limpio + plan.
#   python vlog/hh/hh.py parse <slug> [<slug> ...]     (o "all")
# Formato de guiones/<slug>_hh.txt: un párrafo por línea ("#" = comentario). Marcas INLINE, antes de la palabra donde arranca:
#   planos : {av} · {pg 11} / {pg 11 low} (página real del libro; low = mitad de abajo) · {lor nombre: escena con Loretta (gpt+cara)}
#            {bi nombre: escena sin cara (agnes)} · {cl nombre: escena || movimiento} (agnes foto + clip i2v) · {ei nombre: año | escena}
#            {qr} (tarjeta QR del CTA 2)
#   encima : {care 11} (línea verde BE CAREFUL con el limit del truco de la pág. 11) · {tt 11} (rótulo del truco) · {name}
#   meta   : {x hhfreeze} (referencia cruzada) · {cta1} {cta2} {cta3} · {ch Título del capítulo}
# Compuertas: largo ≥ 26.500 car · grep prohibido = 0 · avatar estimado ≤ 560 s · páginas dichas = páginas del capítulo ·
#             planos 8-15 s (min 1: 4-9 s) · nombres únicos · QR 8-10 s.
import json, re, sys, os
R = "D:/Proyectos/video2-wt/lhh/"; BR = "D:/claude-brain/canales/loretta-house-hacks/"
CPS = 14.6
SERIE = {v["slug"]: v for v in json.load(open(BR + "serie.json", encoding="utf8"))}
ALL = list(SERIE)
WORDN = {"one": 1, "two": 2, "three": 3, "four": 4, "five": 5, "six": 6, "seven": 7, "eight": 8, "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
         "thirteen": 13, "fourteen": 14, "fifteen": 15, "sixteen": 16, "seventeen": 17, "eighteen": 18, "nineteen": 19, "twenty": 20,
         "thirty": 30, "forty": 40, "fifty": 50, "sixty": 60, "seventy": 70, "eighty": 80, "ninety": 90}
def spoken_num(s):
    s = s.lower().replace("-", " ").split(); tot = 0; cur = 0; ok = False
    for w in s:
        if w in WORDN: cur += WORDN[w]; ok = True
        elif w == "hundred": cur = max(cur, 1) * 100; ok = True
        elif w == "and": continue
        else: break
    return cur if ok else None
MK = re.compile(r"\{([^{}]*)\}")
SHOT = {"av", "pg", "lor", "bi", "cl", "ei", "qr"}

def parse(slug):
    v = SERIE[slug]; lines = [l.rstrip() for l in open(R + f"guiones/{slug}_hh.txt", encoding="utf8").read().split("\n")]
    paras, marks, wi, ci = [], [], 0, 0
    pages_ch = {it["page"] for it in v["items"]}; limit = {it["page"]: (it.get("limit") if it.get("limit") and not it["limit"].startswith("None") else None) for it in v["items"]}
    for li, line in enumerate(lines):
        if not line.strip() or line.lstrip().startswith("#"): continue
        clean, pos = [], 0
        for m in MK.finditer(line):
            txt = line[pos:m.start()]; clean.append(txt); pos = m.end()
            sofar = re.sub(r"\s+", " ", "".join(clean)).strip()
            w_here = wi + (len(sofar.split()) if sofar else 0); c_here = ci + len(sofar)
            body = m.group(1).strip(); head, _, rest = body.partition(":"); hp = head.split()
            k = hp[0]; mk = {"k": k, "w": w_here, "c": c_here, "para": len(paras), "line": li + 1}
            if k in ("bi", "cl", "lor", "ei"):
                mk["name"] = hp[1]; pr = rest.strip()
                if k == "cl": pr, _, mo = pr.partition("||"); mk["motion"] = mo.strip()
                if k == "ei": yr, _, pr = pr.partition("|"); mk["year"] = yr.strip()
                mk["prompt"] = pr.strip()
            elif k in ("pg", "tt"): mk["page"] = int(hp[1]); mk["half"] = hp[2] if len(hp) > 2 else ""
            elif k == "care": mk["page"] = int(hp[1]); mk["text"] = " ".join(hp[2:])
            elif k == "x": mk["ref"] = hp[1]
            elif k == "ch": mk["title"] = body[3:].strip()
            elif k not in ("av", "qr", "name", "cta1", "cta2", "cta3"): raise SystemExit(f"{slug}:{li+1} marca desconocida {{{body}}}")
            marks.append(mk)
        clean.append(line[pos:])
        t = re.sub(r"\s+", " ", "".join(clean)).strip()
        if not t: continue
        paras.append(t); wi += len(t.split()); ci += len(t) + 1
    text = "\n".join(paras); n = len(text)
    # ── compuertas
    E, Wn = [], []
    if n < 26500: E.append(f"largo {n} < 26.500 car")
    bad = re.findall(r"\bfree\b|gratis|\$27|\.vercel|http|twenty-seven dollars", text, re.I)
    if bad: E.append(f"grep prohibido: {bad}")
    for m in re.finditer(r"page (\w+(?:[- ]\w+){0,2})", text):
        num = re.match(r"\d+", m.group(1)); p = int(num.group()) if num else spoken_num(m.group(1))
        if p is None: continue
        okp = p in pages_ch or p == v["chapter_page"] or any(p == it["page"] for s2 in SERIE.values() for it in s2["items"]) or p in (5, 21, 22, 37, 54, 55, 58, 74, 75, 76, 92, 93, 105, 106, 124, 125, 128, 163, 166)
        if not okp and not (1 <= p <= 168): E.append(f"página dicha que no existe en el libro: '{m.group(0)}'")
        elif p not in pages_ch and p not in (v["chapter_page"],): Wn.append(f"página de otro capítulo: '{m.group(0)}'")
    shots = [m for m in marks if m["k"] in SHOT]
    if not shots or shots[0]["w"] != 0 or shots[0]["k"] != "av": E.append("el video no abre con {av} en la palabra 0")
    names = {}
    for m in shots:
        if "name" in m:
            if m["name"] in names: E.append(f"nombre repetido {m['name']} (líneas {names[m['name']]} y {m['line']})")
            names[m["name"]] = m["line"]
            if len(m.get("prompt", "")) < 60: Wn.append(f"prompt corto {m['name']}")
            if m["k"] == "cl" and not m.get("motion"): E.append(f"clip sin movimiento {m['name']}")
    pgs = {}
    for m in shots:
        if m["k"] == "pg":
            key = (m["page"], m["half"])
            if key in pgs: E.append(f"página {key} repetida (líneas {pgs[key]} y {m['line']})")
            pgs[key] = m["line"]
    for m in marks:
        if m["k"] == "care" and not m.get("text") and not limit.get(m["page"]): E.append(f"care {m['page']} sin limit en serie.json (línea {m['line']})")
    seen_pg = {p for (p, _) in pgs}
    for it in v["items"]:
        if it["page"] not in seen_pg: Wn.append(f"truco #{it['num']} (pág {it['page']}) sin plano de página")
        if limit.get(it["page"]) and not any(m["k"] == "care" and m["page"] == it["page"] for m in marks): Wn.append(f"truco #{it['num']} con limit sin {{care}}")
    # duraciones estimadas
    est = []
    for i, m in enumerate(shots):
        c1 = shots[i + 1]["c"] if i + 1 < len(shots) else n
        d = (c1 - m["c"]) / CPS; t0 = m["c"] / CPS; est.append((m, t0, d))
    av_s = sum(d for m, t0, d in est if m["k"] == "av")
    if av_s > 560: E.append(f"avatar estimado {av_s:.0f} s > 560")
    for m, t0, d in est:
        lo, hi = (3.5, 9.5) if t0 < 60 else (6.0, 20.5)
        if m["k"] == "av": lo, hi = (2.5, 22) if t0 < 60 else (3.5, 27)
        if m["k"] == "qr": lo, hi = 7.5, 11
        if d < lo or d > hi:
            mid = ""
            if d > hi:
                cm = int(m["c"] + (d * CPS) / 2); seg = text[cm:cm + 160].replace("\n", " "); mm = re.search(r"(?<=[.,;?!] )([A-Z][^.,;?!]{12,60})", seg)
                mid = f' · corte en: "{mm.group(1)[:48]}"' if mm else f' · cerca de: "{seg[:48]}"'
            Wn.append(f"plano {m['k']}:{m.get('name', m.get('page', ''))} @{t0/60:.1f}m dura ~{d:.1f} s{mid}")
    for k in ("cta1", "cta2", "cta3"):
        c = [m for m in marks if m["k"] == k]
        if len(c) != 1: E.append(f"{k}: {len(c)} marcas")
    if sum(1 for m in shots if m["k"] == "qr") != 1: E.append("QR: tiene que salir exactamente una vez")
    refs = sorted({m["ref"] for m in marks if m["k"] == "x"})
    for r in refs:
        if r not in ALL and not r.startswith(("fo", "fh", "ck", "cl", "su")): E.append(f"ref desconocida {r}")
    os.makedirs(R + "_v3", exist_ok=True)
    open(R + f"guiones/{slug}.txt", "w", encoding="utf8", newline="\n").write(text)
    json.dump({"slug": slug, "chars": n, "est_s": round(n / CPS, 1), "words": len(text.split()), "marks": marks}, open(R + f"_v3/{slug}_plan.json", "w", encoding="utf8"), indent=0, ensure_ascii=False)
    cnt = {}
    for m in shots: cnt[m["k"]] = cnt.get(m["k"], 0) + 1
    ctas = {m["k"]: round(m["c"] / CPS / 60, 1) for m in marks if m["k"].startswith("cta")}
    xs = [(m["ref"], round(m["c"] / CPS / 60, 1)) for m in marks if m["k"] == "x"]
    print(f"── {slug}: {n} car · ~{n/CPS/60:.1f} min · párrafos {len(paras)} · planos {len(shots)} {cnt} · avatar ~{av_s:.0f} s · CTA {ctas} · refs {xs}")
    for e in E: print("   ⛔", e)
    for w in Wn[:40]: print("   ⚠️", w)
    if len(Wn) > 40: print(f"   ⚠️ … {len(Wn) - 40} avisos más")
    return not E

if __name__ == "__main__":
    cmd, *slugs = sys.argv[1:]
    if slugs == ["all"]: slugs = ALL
    if cmd == "parse":
        ok = [parse(s) for s in slugs]
        sys.exit(0 if all(ok) else 1)
