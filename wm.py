# wm_fotos.py <slug> <public_dir> [ids] — respaldo de px_fotos.py cuando Pexels da 429:
# foto REAL de Wikimedia Commons (sin clave) para las tomas de <slug>G/plan.json que todavía no tienen foto.
# Elige por palabras del título contra lo que se quiere; sólo apaisadas (>=1600 px, w/h >= 1.25);
# recorta al centro a 1920x1080 (PIL, still). Registra en <slug>G/fotos.json con src=wm, licencia y autor.
import json, os, re, sys, glob, io, time, html, urllib.request, urllib.parse
from PIL import Image
S = sys.argv[1]; PUB = "y"
SOLO = None
UA = {"User-Agent": "alb-photo-research/1.0 (stock lookup)"}
CF = "wm_cache.json"; cache = json.load(open(CF, encoding="utf-8")) if os.path.exists(CF) else {}
MALAS = re.compile(r"logo|map|diagram|poster|drawing|illustration|painting|svg|chart|coat of arms|flag|EFTA|screenshot|museum|church interior|statue", re.I)
def buscar(q):
    if q in cache: return cache[q]
    u = "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode({"action": "query", "format": "json", "generator": "search",
        "gsrsearch": q + " filetype:bitmap", "gsrnamespace": 6, "gsrlimit": 40, "prop": "imageinfo", "iiprop": "url|size|extmetadata", "iiurlwidth": 1920})
    for t in range(5):
        try: d = json.load(urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=40)); break
        except Exception as e: print("  wm err", e); time.sleep(10)
    else: return []
    r = []
    for p in (d.get("query") or {}).get("pages", {}).values():
        ii = (p.get("imageinfo") or [{}])[0]; m = ii.get("extmetadata", {})
        w, h = ii.get("width", 0), ii.get("height", 1)
        if w < 1600 or w / h < 1.25 or MALAS.search(p["title"]): continue
        art = re.sub(r"<[^>]+>", "", html.unescape(m.get("Artist", {}).get("value", "")))[:80].strip()
        r.append({"id": p["pageid"], "t": p["title"], "thumb": ii.get("thumburl") or ii["url"], "page": ii.get("descriptionurl", ""),
                  "lic": m.get("LicenseShortName", {}).get("value", ""), "autor": art})
    cache[q] = r; json.dump(cache, open(CF, "w", encoding="utf-8")); return r
STOP = set("a an the of on in with and or to by for from at its his her their into over under is are be this that close up view new claudio mexican modest house detail closer same moment different angle file jpg jpeg png".split())
tok = lambda s: {w for w in re.findall(r"[a-z]+", s.lower()) if w not in STOP and len(w) > 2}
PRE = json.load(open("previo.json")); USADAS = set(PRE["usadas"])
for f in glob.glob("out/fotos_*.json"):
    USADAS |= {str(v["pid"]) for v in json.load(open(f, encoding="utf-8")).values()}
REG = f"out/fotos_{S}.json"; reg = json.load(open(REG, encoding="utf-8")) if os.path.exists(REG) else {}
P = json.load(open(f"plan_{S}.json", encoding="utf-8"))
os.makedirs(f"{PUB}/{S}/g", exist_ok=True)
for s in P:
    i = str(s["id"])
    if SOLO and i not in SOLO: continue
    dst = f"{PUB}/{S}/g/g{int(i):04d}.jpg"
    if i in reg or i in PRE["tiene"].get(S, []): continue
    qs, want = s["spec"].split("||"); qs = [q.strip() for q in qs.split("|")]; tw = tok(want)
    el = None
    for q in qs:
        tq = tok(q)
        cands = [c for c in buscar(q) if "wm" + str(c["id"]) not in USADAS]
        # el título tiene que tener al menos una palabra de la búsqueda
        cands = [c for c in cands if tq & tok(c["t"])]
        if cands:
            cands.sort(key=lambda c: -(2 * len(tq & tok(c["t"])) + len(tw & tok(c["t"]))))
            el = (q, cands[0]); break
    if not el: print("sin foto", i, qs[0]); continue
    q, c = el
    im = None
    for t in range(6):
        try:
            im = Image.open(io.BytesIO(urllib.request.urlopen(urllib.request.Request(c["thumb"], headers=UA), timeout=90).read())).convert("RGB"); break
        except Exception as e: print("baja", i, e); time.sleep(20 * (t + 1))
    if im is None: continue
    w, h = im.size; k = max(1920 / w, 1080 / h); im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
    w, h = im.size; x, y = (w - 1920) // 2, (h - 1080) // 2
    im.crop((x, y, x + 1920, y + 1080)).save(dst, quality=90)
    USADAS.add("wm" + str(c["id"]))
    reg[i] = {"pid": "wm" + str(c["id"]), "url": c["page"], "autor": c["autor"], "alt": c["t"], "q": q, "lic": c["lic"], "src": "wm"}
    json.dump(reg, open(REG, "w", encoding="utf-8"), ensure_ascii=False, indent=0)
    print(i, "<-", c["t"][:70]); time.sleep(3)
print(S, "fotos", len(reg), "de", len(P))
