# Meta de entrega de la red Loretta 4-6 → public/<slug>_meta.json {title, description, pinned_comment}. SLUG=x python vlog/loretta/net_meta.py
# Título = el de la tarjeta, literal. Descripción: link del canal con ?src arriba, medidas exactas de cada receta/trabajo/método que el
# video cita (leídas del PDF real), capítulos con el minuto REAL (paras.json), "More from Loretta" y hashtags.
import os, re, json
import pymupdf
S = os.environ["SLUG"]; R = "D:/Proyectos/video2-wt/lnet46/"; CH = S[:2]
LIB = "D:/claude-brain/canales/loretta-red/libros/"
PDF = {"ck": "Lorettas-Church-Supper-Cookbook.pdf", "fo": "Supper-for-One.pdf", "cl": "The-Best-Way-to-Clean-It.pdf", "fh": "The-Bug-Free-Farmhouse.pdf", "su": "52-Sunday-Mornings-with-Loretta.pdf"}[CH]
URL = {"ck": "https://cookbook.lorettaschurch.com/?src=", "fo": "https://lorettaschurch.com/one?src=", "cl": "https://lorettaschurch.com/clean?src=", "fh": "https://lorettaschurch.com/farm?src=", "su": "https://lorettaschurch.com/sunday?src="}[CH] + S
CHAN = {"ck": "Loretta's Church Kitchen", "fo": "Loretta Cooks for One", "cl": "Loretta's Clean Home", "fh": "Loretta's Farmhouse", "su": "Loretta's Sunday Morning"}[CH]
T = {  # títulos de tarjeta (Bagasy) y de House Hacks (BIBLIA)
 "ckgravy": "Most People Make Turkey Gravy Wrong! The Church Lady Trick That Never Gets Lumpy", "ckroast": "Most People Are Cooking Pot Roast Wrong! Try These Church Lady Tricks for Fork-Tender Roast Every Time",
 "ckgreenbean": "The BEST Green Bean Casserole You'll Ever Make (The Church Lady Way)", "ck3dollar": "STOP Buying Frozen Dinners! The $3 Church Supper That Feeds Four (The Church Lady Way)",
 "ck30min": "Learn to Cook Like a Church Lady in 30 Minutes (5 Suppers, 5 Rules)", "ck7": "NEVER Fry Your Pork Chops Again — Try This Old Church Supper Trick",
 "fodump": "10 Dump and Bake Suppers for Seniors Living Alone — No Chopping, No Stirring", "focasse": "8 Small Casseroles for Seniors Living Alone — No Giant Pans of Leftovers",
 "foslow": "10 Cheap 3-Ingredient Slow Cooker Suppers for Seniors Living Alone", "fopot": "10 Cheap One-Pot Suppers for Seniors Living Alone (The Church Lady Way)",
 "fogrocery": "I'm 81 and Only Buy Groceries Twice a Month — My $85 Haul for One",
 "clwasher": "What Actually Happens When You Pour Vinegar in Your Washing Machine (It's Not What the Bottle Says)", "cloven": "The Best Way to Clean Your Oven Before Thanksgiving (The Church Lady Way)",
 "clpillow": "The Best Way to Wash Your Pillows (The Church Lady Way)", "cltowels": "The Laundry Mistake Silently Destroying Your Towels (Why They Smell the Second They Get Wet)",
 "cltoilet": "5 Toilet Cleaning Mistakes That Make Your Bathroom Smell (The Church Lady Way)",
 "fhbug": "I've Never Had a Bug in My House in 60 Years — The Old Farm Trick My Mother Swore By", "fhfruitfly": "I've Never Had a Fruit Fly in My Kitchen in 60 Years — The Old Farm Trick",
 "fhmice": "My Mother Never Bought Mouse Poison — The Kitchen Mix and the One Rule That Kept Every Mouse Out", "fhfrost": "Mice Are Moving In RIGHT NOW — Seal These 5 Spots Before the First Frost",
 "fhpoor": "15 Forgotten Household Tricks Only Poor Farm Families Knew (People Spend Thousands on These Now)",
 "sufamily": "7 Family Members My Mother Kept at a Distance (And the Bible Was Right About Every One)", "suchurch": "9 Things You Should NEVER Do in Church (And 3 Every Church Lady Made Us Do)",
 "suwidow": "7 Things Widows Should Never Do the First Year (What 60 Years of Casseroles at the Door Taught Me)", "sunight": "6 Things My Mother Did Every Night Before Bed (The Bible Was Right About Every One)",
 "sublessing": "The Thanksgiving Prayer My Mother Said Over Every Table for 60 Years",
 "hhfreeze": "15 Foods Church Ladies Always Freeze (Stop Throwing Food Away)", "hhvinegar": "15 Ways Church Ladies Use White Vinegar (Most People Don't Know)",
 "hhgrocery": "12 Farm Kitchen Habits That Make Your Groceries Last Twice as Long", "hhexpire": "15 Foods Iowa Farm Wives Keep That Practically Never Expire (Stock Up Before Prices Rise)",
 "hhwinter": "25 Winter Tricks Church Ladies Use to Stay Warm for Pennies (Seniors Living Alone)",
}
ON = {"ck": "Church Kitchen", "fo": "Cooks for One", "cl": "Clean Home", "fh": "Farmhouse", "su": "Sunday Morning", "hh": "House Hacks"}
CHAIN = {"ckgreenbean": ("ckgravy", "ck3dollar", "cloven"), "ck3dollar": ("ckgreenbean", "ck30min", "focasse"), "ck30min": ("ck3dollar", "ck7", "suchurch"),
 "focasse": ("fodump", "foslow", "ck3dollar"), "foslow": ("focasse", "fopot", "ckroast"), "fopot": ("foslow", "fogrocery", "hhfreeze"),
 "cloven": ("clwasher", "clpillow", "ckgreenbean"), "clpillow": ("cloven", "cltowels", "sunight"), "cltowels": ("clpillow", "cltoilet", "hhvinegar"),
 "fhfruitfly": ("fhbug", "fhmice", "hhgrocery"), "fhmice": ("fhfruitfly", "fhfrost", "hhexpire"), "fhfrost": ("fhmice", "fhpoor", "hhwinter"),
 "suchurch": ("sufamily", "suwidow", "ck3dollar"), "suwidow": ("suchurch", "sunight", "focasse"), "sunight": ("suwidow", "sublessing", "fhfruitfly")}
TAGS = {"ck": "#churchsupper #churchladyway #oldfashionedrecipes #iowa #potluck #comfortfood", "fo": "#cookingforone #seniorslivingalone #churchladyway #easysuppers #smallbatch",
        "cl": "#cleaninghacks #churchladyway #oldfashionedcleaning #cleaningtips #homemaking", "fh": "#farmhouse #pestcontrol #oldfarmtricks #churchladyway #mice",
        "su": "#sundaymorning #faith #kjv #churchlady #devotional #widowhood"}[CH]
doc = pymupdf.open(LIB + PDF)
def page_info(n):
    pg = doc[n - 1]; d = pg.get_text("dict"); spans = []
    for b in d["blocks"]:
        for l in b.get("lines", []):
            t = "".join(s["text"] for s in l["spans"]).strip(); sz = max((s["size"] for s in l["spans"]), default=0)
            if t: spans.append((sz, t))
    big = [t for sz, t in spans if sz >= max(sz for sz, _ in spans) - 0.5 and not t.isdigit()]
    title = " ".join(big)[:90] if big else ""
    lines = [l.strip() for l in pg.get_text().split("\n") if l.strip()]
    flat = [re.sub(r"(?<=\b\w) (?=\w\b)", "", l) for l in lines]
    items = []; take = False
    for raw, l in zip(lines, flat):
        L = l.replace(" ", "").upper()
        if L in ("YOU'LLNEED", "YOU’LLNEED", "INGREDIENTS"): take = True; continue
        if take and (L.startswith("HOW") or L in ("METHOD",) or L.startswith("LORETTA")): break
        if take: items.append(raw)
    # renglones partidos ("Salt, pepper, 1/4 teaspoon" + "paprika…"): pegar los que empiezan en minúscula
    out = []
    for it in items:
        if out and (it[:1].islower() or out[-1].endswith(",")): out[-1] += " " + it
        else: out.append(it)
    return title, out
paras = json.load(open(R + f"_v3/{S}_paras.json", encoding="utf8"))
film = [l for l in open(R + f"guiones/{S}_filmado.txt", encoding="utf8").read().splitlines() if l.startswith("[")]
ts = lambda s: f"{int(s)//60}:{int(s)%60:02d}"
# páginas citadas, en orden
pages = []
for l in film:
    for m in re.finditer(r"\[@pg (\d+)", l):
        n = int(m.group(1))
        if n not in pages: pages.append(n)
recipes = []
for n in pages:
    t, it = page_info(n)
    if CH == "su":
        txt = doc[n - 1].get_text().replace("\n", " ")
        m = re.search(r"W\s*E\s*E\s*K\s*([\d ]+)", txt)
        if m: recipes.append(f"Week {m.group(1).replace(' ', '')} · {t} (page {n})")
    elif len(it) >= 2: recipes.append(f"{t.upper()} (page {n})\n" + "\n".join("- " + x for x in it))
# capítulos: primer párrafo de cada sección nueva; título = la página del libro de esa sección (o un rótulo)
LBL = {"HOOK": "Come sit with me, honey", "PAIN": "What goes wrong", "PROMISE": "What I'll show you", "STORY": "A story from the farm", "END": "What to remember", "NEXT": "What's next", "SUMMARY": "What to remember", "CLOSE": "Before you go"}
chap, seen = [], set()
for i, p in enumerate(paras):
    sec = re.sub(r"\d+$", "", p["sec"]) if p["sec"].startswith(("CTA", "QR")) else p["sec"]
    if sec in seen or sec.startswith(("CTA", "QR")): continue
    seen.add(sec)
    m = re.search(r"\[@pg (\d+)", film[i]) if i < len(film) else None
    title = None
    if m and not sec.startswith(("HOOK", "PAIN", "PROMISE", "STORY")):
        t, _ = page_info(int(m.group(1))); title = t
    if not title:
        title = LBL.get(re.sub(r"\d+$", "", sec), sec.title().replace("_", " "))
    if chap and p["s"] - chap[-1][0] < 15: continue
    chap.append((0 if not chap else p["s"], title))
prev, nxt, cross = CHAIN[S]
desc = f"""📖 My little book, every one of these on its own page with the exact amounts: {URL}

Come sit a while, honey. I'm Loretta, 81, sixty years in the church kitchen out here in Iowa. Here is everything from today's video, written down so you never have to hunt for it again.

{"THE WEEKS IN THIS VIDEO" if CH == "su" else "EXACT AMOUNTS (from my little book)"}
""" + "\n\n".join(recipes) + f"""

CHAPTERS
""" + "\n".join(f"{ts(s)} {t}" for s, t in chap) + f"""

MORE FROM LORETTA
- Last time: {T[prev]}
- Next: {T[nxt]}
- On my {ON[cross[:2]]} channel: {T[cross]}

Questions? bagasystudio@gmail.com

{TAGS}"""
desc = desc[:4900]
pinned = f"Every one of these is on its own page in my little book, with the exact amounts: {URL} — Now tell me, honey: what did your mother do about this? I read every one."
json.dump({"title": T[S], "description": desc, "pinned_comment": pinned}, open(R + f"public/{S}_meta.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(S, "meta:", len(desc), "car ·", len(chap), "capítulos ·", len(recipes), "bloques del libro")
