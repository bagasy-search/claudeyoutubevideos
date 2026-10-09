# Verificador del guion FILMADO de la red Loretta 4-6 (guiones/<slug>_filmado.txt). python vlog/loretta/chk_guion.py <slug> [<slug>…]
# Formato: 1 párrafo por línea, empieza con [SEC] y enseguida un marcador [@…]; marcadores inline antes de las palabras que cubren.
# Mide por CÓDIGO: caracteres de voz (≥26.500), palabras prohibidas en voz, marcadores válidos, largo de cada plano (a 14,5 car/s),
# segundos de avatar (≤540), QR único, CTAs, páginas citadas dentro del libro del canal.
import re, sys, json
sys.stdout.reconfigure(encoding="utf-8")
R = "D:/Proyectos/video2-wt/lnet46/"
BOOK = {"ck": 69, "fo": 55, "cl": 52, "fh": 51, "su": 59}
CPS = 14.5
KINDS = r"(av|pg \d+( (top|mid|bot))?|img: .+|clip: .+ \|\| .+|st: .+ \|\| .+|ei \d{4}: .+|care: .+|nevermix|temps|2h|verse: .+ \| .+|qr|card: .+ \| .+|year \d{4}: .+)"
BAD = re.compile(r"(\bfree\b|gratis|\$\d|\.com|http|vercel|bug-free|\bwhop\b|\bprice\b|twenty-seven dollars|27 dollars)", re.I)
def check(slug):
    ch = slug[:2]; maxp = BOOK[ch]; errs, warn = [], []
    lines = [l.rstrip("\n") for l in open(R + f"guiones/{slug}_filmado.txt", encoding="utf8") if l.strip()]
    voice_all, t, shots, av = [], 0.0, [], 0.0
    nqr = 0
    for i, l in enumerate(lines):
        m = re.match(r"^\[([A-Z0-9_]+)\]\s*(\[@.*)$", l)
        if not m: errs.append(f"L{i+1}: no empieza con [SEC] + marcador [@…]: {l[:70]}"); continue
        body = m.group(2)
        for mk in re.findall(r"\[@([^\]]*)\]", body):
            if not re.fullmatch(KINDS, mk): errs.append(f"L{i+1}: marcador inválido [@{mk[:60]}]")
            if mk == "qr": nqr += 1
            pm = re.match(r"pg (\d+)", mk)
            if pm and not (2 <= int(pm.group(1)) <= maxp): errs.append(f"L{i+1}: página {pm.group(1)} fuera del libro (2-{maxp})")
        if re.search(r"\[@(?!care:|nevermix)[^\]]*\]\s*$", body): errs.append(f"L{i+1}: marcador al FINAL del párrafo sin texto detrás (movelo antes de las palabras que cubre)")
        if re.search(r"\[(?!@)[^\]]*\]", body): errs.append(f"L{i+1}: corchete que no es marcador [@…] (se borraría de la voz)")
        # tramos entre marcadores
        parts = re.split(r"(\[@[^\]]*\])", body)
        cur = None
        for p in parts:
            if p.startswith("[@"):
                k = p[2:-1]
                if k.startswith(("care:", "nevermix")): continue  # overlays: no cortan plano
                cur = {"k": k.split(":")[0].split(" ")[0], "t": t, "c": 0, "L": i + 1}; shots.append(cur)
            else:
                txt = re.sub(r"\s+", " ", p).strip()
                if txt and cur is not None: cur["c"] += len(txt) + 1
                t += len(txt) / CPS
        clean = re.sub(r"\s{2,}", " ", re.sub(r"\[[^\]]*\]", "", body)).strip()
        voice_all.append(clean)
        for bm in BAD.finditer(clean): errs.append(f"L{i+1}: PROHIBIDO en voz «{bm.group(0)}»")
        for pm in re.finditer(r"page (\d+)", clean):
            if not (2 <= int(pm.group(1)) <= maxp): errs.append(f"L{i+1}: 'page {pm.group(1)}' fuera del libro")
    # avatar y largos de plano
    for s in shots:
        d = s["c"] / CPS
        if s["k"] == "av": av += d
        lim = 18 if s["k"] in ("av", "verse", "card", "temps", "2h", "qr") else 16
        if d > lim: warn.append(f"L{s['L']} plano {s['k']} ~{d:.0f}s (>{lim})")
        if d < 2.5 and s["t"] > 60: warn.append(f"L{s['L']} plano {s['k']} ~{d:.1f}s (<2,5)")
    n = sum(len(v) for v in voice_all) + len(voice_all) - 1
    txt = "\n".join(voice_all)
    if n < 26500: errs.append(f"VOZ {n} caracteres < 26.500 (faltan {26500 - n})")
    if av > 540: errs.append(f"AVATAR ~{av:.0f} s > 540")
    if nqr != 1: errs.append(f"[@qr] aparece {nqr} veces (tiene que ser 1)")
    if not shots or shots[0]["k"] != "av": errs.append("el plano 1 no es [@av] (Loretta en el segundo 0)")
    low = txt.lower()
    for need in ["little book", "description", "point your phone"]:
        if need not in low: errs.append(f"falta en voz: «{need}»")
    if ch in ("ck", "fo") and not any(s["k"] == "temps" for s in shots): errs.append("falta [@temps] (temperaturas seguras en pantalla)")
    if ch in ("ck", "fo") and not any(s["k"] == "2h" for s in shots): errs.append("falta [@2h] (regla de las 2 horas)")
    if ch == "su" and sum(s["k"] == "verse" for s in shots) < 5: errs.append("Sunday: menos de 5 [@verse]")
    kinds = {}
    for s in shots: kinds[s["k"]] = kinds.get(s["k"], 0) + 1
    qr_t = next((s["t"] for s in shots if s["k"] == "qr"), None)
    if qr_t is not None and not (0.35 * t <= qr_t <= 0.65 * t): errs.append(f"el QR (CTA 2) cae en el min {qr_t/60:.1f}: tiene que ir A LA MITAD (min {0.35*t/60:.0f}-{0.65*t/60:.0f})")
    print(f"== {slug}: voz {n} car (~{n/CPS/60:.1f} min) · párrafos {len(lines)} · planos {len(shots)} · avatar ~{av:.0f}s · QR ~min {qr_t/60 if qr_t else -1:.1f} · {json.dumps(kinds)}")
    for e in errs: print("  ⛔", e)
    for w in warn[:25]: print("  ⚠️", w)
    if len(warn) > 25: print(f"  ⚠️ … {len(warn)-25} avisos más")
    return not errs
ok = all([check(s) for s in sys.argv[1:]])
sys.exit(0 if ok else 1)
