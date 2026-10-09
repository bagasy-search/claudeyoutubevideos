# public/<slug>_meta.json (título literal de la tarjeta, descripción value-first ≤ 4.950 car, comentario fijado). python vlog/hh/meta.py <slug>
# Arriba el link (lorettaschurch.com/house?src=<slug>), las medidas exactas de cada truco (serie.json), capítulos con su minuto REAL
# (_v3/<slug>_tl.json), "More from Loretta" con los videos que nombra, hashtags y soporte.
import json, sys
R = "D:/Proyectos/video2-wt/lhh/"; BR = "D:/claude-brain/canales/loretta-house-hacks/"
S = sys.argv[1]; SER = {v["slug"]: v for v in json.load(open(BR + "serie.json", encoding="utf8"))}; V = SER[S]
TL = json.load(open(R + f"_v3/{S}_tl.json", encoding="utf8"))
URL = f"https://lorettaschurch.com/house?src={S}"
SIB = {"fopan": "Loretta Cooks for One — 10 one-pan suppers for seniors living alone", "fhfrost": "Loretta's Farmhouse — the 5 spots mice use to get in before the first frost",
       "ck3dollar": "Loretta's Church Kitchen — the $3 church supper that feeds four", "fomuffin": "Loretta Cooks for One — 12 muffin-tin suppers you make once and eat all month",
       "clsmell": "Loretta's Clean Home — 15 tricks that make a little house smell like Sunday dinner", "fhgarlic": "Loretta's Farmhouse — planting garlic in October the old farm way",
       "clwasher": "Loretta's Clean Home — what vinegar really does in your washing machine", "sufuneral": "Loretta's Sunday Morning — 7 things you should never do at a funeral",
       "cltoilet": "Loretta's Clean Home — 5 toilet cleaning mistakes that make the bathroom smell", "fogrocery": "Loretta Cooks for One — my $85 grocery haul for a whole month"}
TAGS = {"hhdollar": "#DollarTree #WinterPrep", "hhwinter": "#StayWarm #HeatingBill", "hhexpire": "#Pantry #StockUp", "hhfreeze": "#Freezer #FoodWaste",
        "hhgrocery": "#Groceries #FoodWaste", "hhscraps": "#RegrowVegetables #KitchenScraps", "hhvinegar": "#WhiteVinegar #CleaningHacks",
        "hhperox": "#HydrogenPeroxide #CleaningHacks", "hhtoilet": "#HydrogenPeroxide #BathroomCleaning", "hhnever": "#FrugalLiving #NeverBuy"}
def build(detail):
    L = [URL, "", f"Come sit a while, honey. These are the tricks from chapter {V['ch']} of my House Book, \"{V['chapter_title']}\" (starts on page {V['chapter_page']}), and here are the exact amounts so you don't have to write them down.", ""]
    L.append("THE EXACT AMOUNTS")
    for it in V["items"]:
        if it.get("materials"):
            L.append(f"{it['num']}. {it['h']} (page {it['page']}): " + "; ".join(it["materials"][:detail]) + ".")
        elif it.get("lines"):
            L.append(f"{it['num']}. {it['h']} (page {it['page']}): {it['lines'][0]}")
        lim = it.get("limit")
        if detail >= 3 and lim and not lim.startswith("None"): L.append(f"   Be careful: {lim}")
    ch = TL["chapters"] if TL["chapters"] and TL["chapters"][0][0] == "0:00" else [["0:00", "Come sit down, honey"]] + TL["chapters"]
    L += ["", "CHAPTERS"] + [f"{t} {c}" for t, c in ch]
    seen, more = set(), []
    for r, _ in TL["refs"]:
        if r in seen or r == S: continue
        seen.add(r); more.append(f"- {SER[r]['title']}" if r in SER else f"- {SIB.get(r, r)}")
    L += ["", "MORE FROM LORETTA"] + more
    L += ["", "Never mix bleach with vinegar, ammonia or peroxide. Everything here is for cleaning and cooking, not for health.",
          "Questions about the book: bagasystudio@gmail.com", "", f"#LorettasHouseHacks #ChurchLady #SeniorsLivingAlone #FrugalLiving {TAGS[S]}"]
    return "\n".join(L)
for detail in (99, 4, 3, 2, 1):
    d = build(detail)
    if len(d) <= 4950: break
pinned = f"The exact amounts for every trick in this video are in the description, honey. And if you want all 133 of them in one place, one a page, my House Book is here: {URL} — now tell me, which one are you trying first?"
json.dump({"title": V["title"], "description": d, "pinned_comment": pinned}, open(R + f"public/{S}_meta.json", "w", encoding="utf8"), indent=1, ensure_ascii=False)
print(S, "descripción", len(d), "car · detalle", detail, "· capítulos", len(TL["chapters"]), "· más:", len(set(r for r, _ in TL["refs"])) )
assert "loretta-church-lady" not in d + pinned
