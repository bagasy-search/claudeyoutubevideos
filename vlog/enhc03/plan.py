# enhc01 · plan del video ENTERO anclado a la voz (at() sobre words.json): cada foto, pieza y evento del mundo de la
# concesionaria entra con la frase que se dice en ese segundo → segs/ov/cam/ev/avail/edl en src/enhc01.
# Molde para hc02-07: copiá este archivo, cambiá SLUG y la sección "GUION" (vistas V, eventos y reglas quedan iguales).
import json, os, re, subprocess, unicodedata, statistics

SLUG = "enhc03"
R = f"D:/wt/{SLUG}/"; S = R + f"src/{SLUG}/"; PUB = R + f"public/{SLUG}/"; REEL = R + f"public/av/{SLUG}/reel0.mp4"
W = json.load(open(f"D:/rtmp_{SLUG}/words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
SHOTS = json.load(open(f"D:/rtmp_{SLUG}/shots.json", encoding="utf8"))
WAV = R + f"public/{SLUG}cut.wav"

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))
TOK = [norm(w) for _, w in W]; TS = [float(s) for s, _ in W]
cur = 0; miss = []
def at(ph, d=0.0):
    """1ª palabra de la frase, buscando hacia adelante desde el cursor (difuso: ≥75 % de las palabras en orden)."""
    global cur
    q = [norm(x) for x in ph.split() if norm(x)]
    def score(i):
        j, k, hit = i, 0, 0
        while k < len(q) and j < len(TOK) and j < i + len(q) + 3:
            if TOK[j] == q[k] or (len(q[k]) > 4 and TOK[j][:5] == q[k][:5]): hit += 1; k += 1; j += 1
            elif k + 1 < len(q) and TOK[j] == q[k + 1]: k += 1
            else: j += 1
        return hit
    need = max(2, int(0.75 * len(q) + 0.5)) if len(q) > 1 else 1
    for lo, hi in ((cur, min(len(TOK), cur + 900)), (0, len(TOK))):
        for i in range(lo, hi):
            if (TOK[i] == q[0] or (len(q) > 1 and TOK[i] == q[1])) and score(i) >= need:
                if lo == cur: cur = i
                return round(TS[i] + d, 2)
    miss.append(ph); return None

END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode()) + 1.0

# ---------------- vistas del mundo (dealer3d.tsx): [pos, mirar, fov] ----------------
V = {
    "wide": ([0.6, 4.6, 9.6], [-0.3, 0.6, 0.6], 40), "lot": ([-1.0, 1.35, 6.4], [-1.5, 0.55, 3.0], 38),
    "sign": ([-3.0, 2.1, 7.2], [-4.6, 3.0, 4.4], 34), "price": ([-1.7, 0.75, 4.7], [-1.8, 0.48, 3.2], 30),
    "door": ([0.3, 1.25, 4.3], [0.2, 1.0, 1.5], 38), "floor": ([-0.9, 1.75, 3.7], [-1.3, 0.6, 0.0], 40),
    "desk": ([1.35, 1.45, 2.2], [1.2, 0.75, 0.45], 34), "pad": ([1.3, 1.35, 0.9], [1.25, 0.77, 0.45], 30),
    "keys": ([1.7, 1.1, 1.0], [1.6, 0.77, 0.35], 26), "tower": ([0.7, 1.45, 1.3], [0.15, 1.2, -1.0], 38),
    "coffee": ([-2.5, 1.35, 0.4], [-3.3, 1.0, -1.25], 34), "clock": ([-0.9, 2.0, 0.3], [-1.0, 2.3, -1.6], 26),
    "hall": ([1.5, 1.35, 1.5], [2.6, 1.0, -0.3], 36), "box": ([3.3, 2.2, 2.0], [3.7, 0.8, -0.7], 40),
    "drawer": ([4.35, 1.15, 0.25], [4.12, 0.64, -0.6], 28), "pen": ([3.55, 1.1, -0.1], [3.55, 0.78, -0.6], 24),
    "boat": ([3.5, 1.6, 0.6], [3.7, 1.7, -1.58], 30), "night": ([-0.4, 2.3, 7.8], [-1.0, 1.0, 2.5], 40),
}
PTV = {"lot": "lot", "sign": "sign", "price": "price", "door": "door", "floor": "floorcar", "desk": "desk", "pad": "pad", "keys": "keys",
       "tower": "tower", "coffee": "coffee", "clock": "clock", "hall": "boxdoor", "box": "box", "drawer": "drawer", "pen": "pen", "boat": "boat", "night": "lot"}
FULL = {"q", "four", "loan", "order", "tila", "map", "check", "menu", "note", "end", "guia"}   # piezas que tapan la pantalla

BEATS, OVS, EVR, PADQ = [], [], {}, []
def B(ph, base, tr=None, d=0.0):
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr))
def O(ph, k, dur, d=0.0, **kw):
    global cur
    a = at(ph, d)
    if a is None: return
    c0 = cur; o = dict(k=k, a=a, b=round(a + dur, 2), **kw)
    for key, v in list(o.items()):   # "...At" como frase → segundos (buscando desde la pieza)
        if key.endswith("At") and isinstance(v, str): o[key] = at(v) or round(a + 1.5, 2)
    for lk in ("items", "rows", "cells", "pins"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for it in o[lk]:
                if isinstance(it.get("at"), str): it["at"] = at(it["at"]) or round(a + 0.5, 2)
    if isinstance(o.get("until"), str):
        u = at(o.pop("until")); o["b"] = u if u else o["b"]
    cur = c0; OVS.append(o)
def EV(key, ph, dur, d=0.0):
    a = at(ph, d)
    if a is not None: EVR.setdefault(key, []).append([a, round(a + dur, 2)])
def ON(key, ph, ph2):
    global cur
    a = at(ph); c0 = cur; b = at(ph2); cur = c0
    if a is not None and b is not None and b > a: EVR.setdefault(key, []).append([a, b])
def PQ(ph, q):
    a = at(ph)
    if a is not None: PADQ.append({"a": a, "q": q})

# ---------------- fotos: cada una en SU frase (shots.json); RE = frase nueva si la original cae bajo una pieza ----------------
RE = {'f07': 'repair. Gold had a little less.', 'f10': 'suit, every day, even in August.', 'f14': 'those two points were about thirteen', 'f17': 'Thirty years driving a cab in', 'h17': "if you want one: what's your", 'f30': "I'm tired. I'll come back tomorrow", 'f31': 'divided by seventy-two months, divided by', 'h32': 'gap, the tire and wheel, the'}
for sh in SHOTS:
    a = at(RE.get(sh["name"], sh["at"]))
    if a is not None: BEATS.append(dict(a=a, base="img:" + sh["name"], tr=None))
cur = 0

# ======================= GUION =======================
B("In the last video I told you about the drawer", "w:box", "fade")
O("Top right, in my desk", "tag", 4.0, pt="drawer", text="THE DRAWER", sub="top right")
B("You're sitting in a little room with no windows", "w:boat", "portal")
O("the air conditioning is a little too cold, on purpose", "big", 4.0, text="64°F", sub="on purpose")
B("he slides a piece of paper across the desk", "w:desk", "portal")
O("three tricks have already started", "big", 4.0, text="3 TRICKS", sub="before you read one word")
O("My name is Hector", "lower", 6.0, name="HECTOR", l2="F&I MANAGER · BIRD ROAD AUTO PLAZA · 1989–2015")
O("Fourteen on the lot, twenty-six in the box", "chips", 5.0, items=["14 YEARS ON THE LOT", "26 YEARS IN THE BOX"])
O("the ten tricks I kept in that drawer", "chips", 6.0, items=["10 TRICKS", "WHO I USED THEM ON", "THE EXACT WORDS"])
# ---- the drawer
B("First, the drawer", "w:drawer", "portal")
ON("drawer", "First, the drawer", "Okay. Trick number one")
O("A heavy gold pen", "tag", 4.0, pt="pen", text="THE GOLD PEN")
O("A gray one, with big buttons", "calc", 6.0, keys="??? ", res="never shown", resAt="I never let the customer see the screen", note="THE GRAY CALCULATOR")
O("the customer sees the answer, never the arithmetic", "quote", 5.0, text="The customer sees the answer, never the arithmetic.", who="ABE FELDMAN, 1975", w=1000)
# ---- T1
B("Trick number one. The menu", "bk", "zoom")
O("Trick number one. The menu", "q", 6.0, n=1, q="The menu.", label="TRICK", stamp="TRICK #1")
O("three bottles of wine on the table", "chips", 5.5, items=["CHEAP", "THE MIDDLE ONE", "EXPENSIVE"])
B("At the top, the names", "bk", "zoom")
O("At the top, the names", "menu", 16.0, pk=[{"n": "PLATINUM", "pay": "$612", "items": ["7-yr service", "Gap", "Tire & wheel", "Paint & fabric", "Key + dent"]}, {"n": "GOLD", "pay": "$568", "items": ["7-yr service", "Gap", "Tire & wheel"]},
  {"n": "PREFERRED", "pay": "$531", "items": ["5-yr service", "Gap"]}, {"n": "BASIC", "pay": "$489", "items": ["Just the car"]}], hl=1, hlAt="And people, nice people, chose Gold")
O("Gold was usually about two thousand five hundred", "big", 4.0, text="$2,500–3,000", sub="the Gold package")
O("I'd like the payment for the car only, with nothing added", "say", 6.5, text="I'd like the payment for the car only, with nothing added. Then I'll decide.")
# ---- T2
B("Trick number two", "bk", "zoom")
O("Trick number two", "q", 6.0, n=2, q="The payment that already had the products inside.", label="TRICK", stamp="TRICK #2")
O("Let's say, four hundred eighty-nine a month", "chips", 6.0, items=["SALESMAN: $489", "CAR ALONE: $445"])
O("We called that a leg", "big", 4.0, text="\"A LEG\"", sub="left in the payment")
O("Nineteen ninety-three. Mr. Sid Gold", "year", 4.0, year="1993", place="MR. SID GOLD, 76")
O("Retired tailor from North Miami Beach", "map", 4.0, pins=[{"at": "Retired tailor from North Miami Beach", "n": "Miami Beach", "sub": "RETIRED TAILOR"}])
O("You just took something in at the waist", "quote", 5.0, text="I've been measuring men my whole life. You just took something in at the waist.", who="MR. SID GOLD")
O("what is the payment for the car alone, with nothing added", "say", 6.0, text="What is the payment for the car alone, with nothing added?")
# ---- T3
B("Trick number three. The rate sheet face down", "bk", "zoom")
O("Trick number three. The rate sheet face down", "q", 6.0, n=3, q="The rate sheet face down.", label="TRICK", stamp="TRICK #3")
B("On my desk there were sheets from the banks", "w:box", "portal")
EV("papers", "On my desk there were sheets from the banks", 8.0)
O("That's the buy rate", "tag", 4.0, pt="box", text="BUY RATE", sub="what the bank really approved")
O("A retired fireman from Kendall", "map", 3.5, pins=[{"at": "A retired fireman from Kendall", "n": "Kendall", "sub": "RETIRED FIREMAN · 800+ CREDIT"}])
O("The bank said four point nine", "loan", 11.0, la={"name": "BANK SAID", "pay": 470.7, "months": 60, "apr": "4.9%"}, lb={"name": "I TOLD HIM", "pay": 494.0, "months": 60, "apr": "6.9%"},
  totAt="On a twenty-five thousand dollar loan", diffAt="those two points were about thirteen hundred dollars", head="$25,000 · 60 MONTHS")
O("what is the buy rate the bank approved me at", "say", 6.0, text="What is the buy rate the bank approved me at?")
# ---- T4
B("Trick number four. The bank called back", "bk", "zoom")
O("Trick number four. The bank called back", "q", 6.0, n=4, q="The bank called back.", label="TRICK", stamp="TRICK #4")
B("You buy the car on a Saturday", "w:lot", "portal")
EV("keys", "You buy the car on a Saturday", 8.0)
O("They call it spot delivery", "big", 4.0, text="SPOT DELIVERY", sub="the car leaves before the loan is final")
O("Two thousand two. Mr. Raymond Pierre", "year", 3.5, year="2002", place="MR. RAYMOND PIERRE")
O("Retired taxi driver, from Little Haiti", "map", 4.0, pins=[{"at": "Retired taxi driver, from Little Haiti", "n": "Little Haiti", "sub": "30 YEARS DRIVING A CAB"}])
O("I thought when you sign, it's done", "quote", 5.0, text="I thought when you sign, it's done, Mr. Hector.", who="MR. PIERRE, 2002")
O("People call this yo-yo financing", "big", 4.0, text="YO-YO FINANCING")
O("Is my financing final", "say", 6.5, text="Is my financing final? Has the bank approved this contract, or is this conditional?")
# ---- Dottie III
O("Nineteen eighty-eight. Coral Way Motors", "year", 4.0, year="1988", place="CORAL WAY MOTORS")
B("Mrs. Shapiro had put Irving's insurance check back in her purse", "w:desk", "portal")
O("Will I be covered", "quote", 5.0, text="Do I need one of those? Will I be covered?", who="MRS. SHAPIRO, 1988")
B("And I opened the drawer", "w:drawer", "portal")
EV("drawer", "And I opened the drawer", 7.0)
# ---- T5
B("Trick number five. Fear", "bk", "zoom")
O("Trick number five. Fear", "q", 6.0, n=5, q="Fear. The transmission speech.", label="TRICK", stamp="TRICK #5")
O("Four thousand, five thousand dollars", "money", 4.0, to=5000, label="A TRANSMISSION")
O("Twenty-four hundred dollars", "big", 4.0, text="$2,400", sub="7 years · 100,000 miles")
O("Sometimes we doubled it", "chips", 5.0, items=["YOU PAY: $2,400", "DEALER COST: $1,200"])
O("So three sentences", "check", 12.0, head="THE SERVICE CONTRACT", w=1050, rows=[{"at": "First: I'm not buying it today", "tx": "I'm not buying it today."}, {"at": "what's your cost on this contract", "tx": "What's your cost on this contract?"}, {"at": "most of these contracts can be cancelled later", "tx": "You can cancel later for a refund."}])
# ---- T6
B("Trick number six. The gap with a big price", "bk", "zoom")
O("Trick number six. The gap with a big price", "q", 6.0, n=6, q="The gap with a big price.", label="TRICK", stamp="TRICK #6")
O("that difference is the gap", "big", 4.0, text="THE GAP", sub="what you owe − what it's worth")
O("for six, seven, eight hundred dollars", "chips", 5.5, items=["DEALER: $600–800+", "YOUR INSURER: A FEW $/MONTH"])
O("Two thousand nine. A couple from Hialeah Gardens", "map", 4.0, pins=[{"at": "A couple from Hialeah Gardens", "n": "Hialeah", "sub": "BOTH RETIRED FROM THE POST OFFICE"}])
O("They put down twelve thousand on a twenty-two thousand dollar car", "order", 9.0, title="THEY DIDN'T NEED GAP", totalAt=1e9, rows=[{"at": "twenty-two thousand dollar car", "item": "CAR", "v": 22000}, {"at": "Twelve thousand down", "item": "DOWN", "v": 12000}, {"at": "I sold them gap for seven ninety-five", "item": "GAP", "v": 795, "x": True}], xAt="Because it was on the menu")
O("I'll get it through my insurance company", "say", 5.5, text="I'll get it through my insurance company.")
# ---- T7
B("Trick number seven. Insurance for the loan if you die", "bk", "zoom")
O("Trick number seven. Insurance for the loan if you die", "q", 6.0, n=7, q="Insurance for the loan if you die.", label="TRICK", stamp="TRICK #7")
O("Credit life insurance", "big", 4.0, text="CREDIT LIFE", sub="pays the loan if you die")
O("It was the easiest signature in the business", "quote", 4.5, text="The easiest signature in the business.", who="HECTOR", w=900)
O("Nineteen ninety. Bird Road", "year", 3.5, year="1990", place="BIRD ROAD AUTO PLAZA")
O("I already have life insurance, thank you", "say", 5.5, text="I already have life insurance, thank you.")
O("twelve dollars a month on a six-year loan", "calc", 6.0, keys="12 × 72", res="= $864", resAt="is eight hundred sixty-four dollars", note="\"ONLY $12 A MONTH\"")
# ---- the clock
B("Let me give you a word about the clock", "w:clock", "portal")
O("Let me give you a word about the clock", "clock", 7.0, **{"from": 600, "to": 900}, label="HOUR FOUR")
B("that little plastic chair on the showroom floor", "w:floor", "portal")
O("Go in the morning, right when they open", "check", 9.0, head="BEAT THE CLOCK", w=1000, rows=[{"at": "Go in the morning, right when they open", "tx": "Go in the morning"}, {"at": "Eat something before", "tx": "Eat before"}, {"at": "Bring a bottle of water", "tx": "Water + granola bar"}, {"at": "if it passes three hours", "tx": "3 hours → come back tomorrow"}])
# ---- T8
B("Trick number eight. The calculator I never showed you", "bk", "zoom")
O("Trick number eight. The calculator I never showed you", "q", 6.0, n=8, q="The calculator I never showed you.", label="TRICK", stamp="TRICK #8")
O("Less than your cafecito at the Versailles", "map", 3.5, pins=[{"at": "Less than your cafecito at the Versailles", "n": "Little Havana", "sub": "A CAFECITO"}])
O("Eighteen hundred dollars divided by seventy-two months", "calc", 7.0, keys="1800 ÷ 72 ÷ 30", res="≈ $0.83/day", resAt="is about eighty-three cents a day", note="PENNIES A DAY")
O("what's the total price of that product, by itself, in dollars", "say", 6.0, text="What's the total price of that product, by itself, in dollars?")
# ---- T9
B("Trick number nine. The bank requires it", "bk", "zoom")
O("Trick number nine. The bank requires it", "q", 6.0, n=9, q="The bank requires it.", label="TRICK", stamp="THE LIE")
O("the bank is going to require the service contract", "quote", 5.0, text="With your credit, the bank is going to require the service contract.", who="THROUGH THE WALL")
O("please show me in writing where the bank requires that", "say", 6.5, text="Please show me in writing where the bank requires that.")
# ---- Dottie's hand
B("let me tell you about Mrs. Shapiro's hand", "w:pen", "portal")
B("I had a stack of papers", "w:box", "portal")
EV("papers", "I had a stack of papers", 10.0)
O("Fourteen signatures", "big", 4.5, text="14 SIGNATURES", sub="she never read one page")
EV("sign", "And her hand just kept signing", 3.0)
# ---- T10
B("Trick number ten. The one nobody catches", "bk", "zoom")
O("Trick number ten. The one nobody catches", "q", 7.0, n=10, q="The signing ceremony.", label="TRICK", stamp="THE ONE NOBODY CATCHES")
O("The danger is the five minutes at the end", "big", 4.0, text="THE LAST 5 MINUTES", size=130)
O("I'm going to read the contract now", "say", 6.0, text="I'm going to read the contract now. Please give me a few minutes.")
B("there is a box with four numbers", "bk", "zoom")
O("there is a box with four numbers", "tila", 16.0, v=["6.9%", "$4,640", "$25,000", "$29,640"], hl=0, hlAt="is the APR the rate he said out loud")
O("Sixty is sixty, not seventy-two", "big", 4.0, text="60 IS 60", sub="not 72")
O("I said no to this", "say", 5.5, text="I said no to this. Please take it out and print a new contract.")
O("give me a moment, I'm reading", "say", 5.0, text="Give me a moment, I'm reading.")
O("a little signing pad with a plastic pen on a cord", "big", 4.0, text="1 SIGNATURE = 14 PAGES", size=120)
O("I'd like to see each document on the screen", "say", 6.0, text="Before I sign, I'd like to see each document on the screen, or a printed copy.")
# ---- bonus 11
O("a little bonus, number eleven", "big", 4.0, text="BONUS #11", sub="the prepaid maintenance plan")
O("eight ninety-nine", "chips", 6.0, items=["PLAN: $899", "6 OIL CHANGES: ~$450"])
O("I'll pay for my oil changes when I need them", "say", 5.0, text="I'll pay for my oil changes when I need them. Thank you.")
# ---- already signed
O("Here's what you do. Find your contract", "check", 10.0, head="IF YOU ALREADY SIGNED", w=1050, rows=[{"at": "Look for the itemization", "tx": "Find the itemization"}, {"at": "Write down every product and its price", "tx": "List every product"}, {"at": "for the word cancellation", "tx": "Look for \"cancellation\""}, {"at": "I'd like to cancel these products", "tx": "Call: cancel these products"}])
O("your state attorney general's office", "tag", 4.5, text="ATTORNEY GENERAL", sub="if someone lied to you")
# ---- recap
O("One. The menu. Say", "say", 5.0, head="1 · THE MENU", text="Car only, nothing added.")
O("Two. The leg in the payment", "say", 5.0, head="2 · THE LEG", text="Compare the paper with the box.")
O("Three. The rate sheet", "say", 5.0, head="3 · RATE SHEET", text="What's the buy rate?")
O("Four. The bank called back", "say", 5.0, head="4 · BANK CALLED BACK", text="Is my financing final?")
O("Five. The transmission speech", "say", 5.0, head="5 · FEAR", text="Not today. What's your cost?")
O("Six. Gap with a big price", "say", 5.0, head="6 · GAP", text="Call your insurance agent.")
O("Seven. Insurance on the loan if you die", "say", 5.0, head="7 · CREDIT LIFE", text="I'll check with my own agent.")
O("Eight. Pennies a day", "say", 5.0, head="8 · PENNIES A DAY", text="What's the total, in dollars?")
O("Nine. The bank requires it", "say", 5.0, head="9 · THE LIE", text="Show me in writing.")
O("Ten. The signing ceremony", "say", 5.5, head="10 · THE CEREMONY", text="Put the pen down. I'm reading.")
# ---- the end
O("when I retired in twenty fifteen", "year", 3.5, year="2015", place="THE LAST DAY")
B("I cleaned out the drawer", "w:drawer", "portal")
ON("drawer", "I cleaned out the drawer", "And the gold pen")
B("And the gold pen", "w:pen", "portal")
O("So I don't forget how heavy it was", "quote", 5.0, text="So I don't forget how heavy it was.", who="HECTOR", w=900)
O("seven fees I charged seniors", "big", 4.0, text="7 FEES", sub="next video")
O("Subscribe so you don't miss it", "end", 22.0, q="What did the finance manager tell you was required? The exact words.", qAt="what did the finance manager tell you",
  next="I Was a Car Salesman 40 Years: 7 Fees I Charged Seniors That You Can Refuse", nAt="I read every single one", until="I'll see you in the box")
B("I'll see you in the box", "w:wide", "fade")


# CTA guía (The Other Side of the Desk): libro 3D + página real + QR a /q, en un hueco sin avatar
O("that drawer. The ones I used on retirees", "guia", 8.5, pag="market_adjustment")
O("it's only twelve dollars a month, you remember", "guia", 8.5, pag="lapiz_rojo")
# fin CTA
# ======================= ARMADO (igual para todos los videos) =======================
for o in OVS:   # cierre hasta el final del video
    if o["k"] == "end" and END - o["b"] < 6: o["b"] = round(END, 2)
BEATS.sort(key=lambda b: b["a"])
used = set()
for b in BEATS:
    if b["base"].startswith("img:"):
        i = b["base"][4:]
        if i in used or not os.path.exists(PUB + "i_" + i + ".jpg"): b["base"] = "skip"
        used.add(i)
BEATS = [b for b in BEATS if b["base"] != "skip"]
def ov_av(a, b): return any(not (b <= w["ms"] or a >= w["me"]) for w in AVW)
for o in OVS:   # la pregunta sobre el avatar va abajo, sin taparle la cara (no recorta ventanas pagas)
    if o["k"] == "q" and ov_av(o["a"], o["b"]): o["low"] = True
def vis(a, b):   # segundos de la pieza fuera de las ventanas del avatar
    v = b - a
    for w in AVW: v -= max(0, min(b, w["me"]) - max(a, w["ms"]))
    return v
CLIP = []   # piezas que se quedan enteras (recortan el avatar): casi todas bajo una ventana
for o in OVS:
    if o["k"] in FULL and not o.get("low"):
        if vis(o["a"], o["b"]) >= min(4.0, 0.6 * (o["b"] - o["a"])):   # el avatar entra y sale; la pieza se esconde mientras habla
            o["gaps"] = [[w["ms"], w["me"]] for w in AVW if not (o["b"] <= w["ms"] or o["a"] >= w["me"])]
        else: CLIP.append(o)
DROP = [o for o in CLIP if o["k"] != "end"]   # casi entera bajo el avatar: no se muestra (habla él)
OVS = [o for o in OVS if o not in DROP]; CLIP = [o for o in CLIP if o not in DROP]
print("piezas bajo el avatar (fuera):", [(o['k'], o['a']) for o in DROP] or "ninguna")
fulls = sorted([(o["a"], o["b"]) for o in OVS if o["k"] in FULL and not o.get("low")])
fullsC = sorted([(o["a"], o["b"]) for o in CLIP])
def in_full(t): return any(a - 0.05 <= t < b for a, b in fulls)
lost = [b["base"] for b in BEATS if in_full(b["a"]) and b["base"].startswith("img:")]
BEATS = [b for b in BEATS if not (in_full(b["a"]) and b["base"] != "bk")]
for a, b in fulls:   # bajo cada pieza que tapa: fondo bk desde su inicio y después de cada ventana del avatar
    if not any(abs(x["a"] - a) < 0.05 and x["base"] == "bk" for x in BEATS): BEATS.append(dict(a=a, base="bk", tr="zoom"))
    for w in AVW:
        if a < w["me"] < b - 1.0: BEATS.append(dict(a=round(w["me"], 2), base="bk", tr="cut"))
BEATS.sort(key=lambda b: b["a"])

TRS = ["swipeL", "cut", "up", "swipeR", "wipe", "cut", "down", "zoom"]
def seg_of(b, a, tr):
    k, x = b["base"].split(":", 1) if ":" in b["base"] else (b["base"], None)
    g = {"a": round(a, 2), "tr": tr}
    if k == "img":
        g.update(k="img", id=x); h = sum(map(ord, x)) % 4
        g["z"] = [[1.03, 1.14], [1.14, 1.03], [1.05, 1.12], [1.04, 1.16]][h]; g["ox"] = [0, -30, 30, 0][h]; g["oy"] = [0, 10, -10, -20][h]
    elif k == "w": g.update(k="w", view=x)
    else: g.update(k="bk")
    return g
segs = []
for n, b in enumerate(BEATS):
    g = seg_of(b, b["a"], b["tr"] or TRS[n % len(TRS)])
    if g["k"] == "w" and g["tr"] == "portal" and segs and segs[-1]["k"] == "w": g["tr"] = "cut"
    segs.append(g)
segs[0]["a"] = 0.0
# avatar en sus ventanas, recortadas donde hay una pieza que tapa la pantalla
avw = []
for w in AVW:
    parts = [(w["ms"], w["me"])]
    for a, b in fullsC:
        nxt = []
        for ms, me in parts:
            if b <= ms or a >= me: nxt.append((ms, me)); continue
            if a - ms > 1.5: nxt.append((ms, a))
            if me - b > 1.5: nxt.append((b, me))
        parts = nxt
    avw += parts
for ms, me in avw:
    before = [g for g in segs if g["a"] <= me]
    active = before[-1] if before else segs[0]
    segs = [g for g in segs if not (ms <= g["a"] < me)]
    segs.append({"a": round(ms, 2), "k": "av", "tr": "zoom" if len(segs) % 2 else "iris"})
    nxt = [g for g in segs if g["a"] >= me]
    if not nxt or nxt[0]["a"] - me > 0.8:
        r = dict(active); r["a"] = round(me, 2); r["tr"] = "swipeL"
        if r["k"] == "img" and active["a"] < ms: r = {"a": round(me, 2), "k": "w", "view": "wide", "tr": "portal"}
        segs.append(r)
    segs.sort(key=lambda g: g["a"])
segs.sort(key=lambda g: g["a"])
out = []
for g in segs:   # sin planos de menos de 1,2 s
    if out and g["a"] - out[-1]["a"] < 1.2 and out[-1]["k"] != "av" and g["k"] != "av": out[-1] = g; continue
    out.append(g)
segs = out
add = []
for i, g in enumerate(segs):   # fotos largas → sigue el mundo
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    if g["k"] == "img" and b - g["a"] > 8.5: add.append({"a": round(g["a"] + 6.0, 2), "k": "w", "view": ["floor", "lot", "desk", "box"][i % 4], "tr": "portal"})
segs = sorted(segs + add, key=lambda g: g["a"])

# fondo oscuro "bk" sin pieza encima (pieza bajada o ya terminada) → vuelve el mundo iluminado
FO = [(o["a"], o["b"]) for o in OVS if o["k"] in FULL and not o.get("low")]
add = []
for i, g in enumerate(segs):
    if g["k"] != "bk": continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    cov = [(pa, pb) for pa, pb in FO if pa < b and pb > g["a"] + 0.3]
    if not cov: g["k"] = "w"; g["view"] = ["wide", "floor", "lot", "desk"][i % 4]; continue
    pe = max(pb for _, pb in cov)
    if pe < b - 1.0: add.append({"a": round(pe + 0.3, 2), "k": "w", "view": ["floor", "lot", "desk", "wide"][i % 4], "tr": "portal"})
segs = sorted(segs + add, key=lambda g: g["a"])

# sin flashes: un plano (no avatar) de menos de 1 s se funde con el anterior
out = []
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    if out and g["k"] != "av" and b - g["a"] < 1.0: continue
    out.append(g)
segs = out

def push(v, k=0.1):
    p, l, f = V[v]; return [round(p[i] + (l[i] - p[i]) * k, 3) for i in range(3)], l, f
keys = []
for i, g in enumerate(segs):
    if g["k"] not in ("w", "bk"): continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    v = g.get("view") or ["wide", "floor", "box", "lot"][i % 4]
    prev = segs[i - 1] if i else None
    if prev is not None and prev["k"] == "w" and g["k"] == "w" and keys:
        keys.append({"t": g["a"], "p": keys[-1]["p"], "l": keys[-1]["l"], "fov": keys[-1]["fov"]})
        p, l, f = V[v]; keys.append({"t": round(g["a"] + 1.8, 2), "p": p, "l": l, "fov": f, "arc": 0.05})
    else:
        p, l, f = V[v]; keys.append({"t": round(max(0, g["a"] - 0.5), 2), "p": p, "l": l, "fov": f})
    p2, l2, f2 = push(v, 0.12 if b - g["a"] < 12 else 0.22)
    keys.append({"t": round(b, 2), "p": p2, "l": l2, "fov": f2})
    if g["k"] == "w" and v in PTV: g["pt"] = PTV[v]
keys.sort(key=lambda k: k["t"])
ded = []
for k in keys:
    if ded and k["t"] <= ded[-1]["t"]: k["t"] = round(ded[-1]["t"] + 0.01, 2)
    ded.append(k)
def base_at(t):
    g = [x for x in segs if x["a"] <= t]; return g[-1] if g else segs[0]
ov = [o for o in OVS if not (o["k"] == "tag" and "pt" in o and base_at(o["a"] + 0.4)["k"] != "w")]
ev = {k: sorted(v) for k, v in EVR.items()}; ev["padq"] = sorted(PADQ, key=lambda x: x["a"])
clips = sorted(f[2:-4] for f in os.listdir(PUB) if f.startswith("c_") and f.endswith(".mp4"))
reel = os.path.exists(REEL)
dur_of = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
rl = dur_of(REEL) if reel else 0
json.dump(segs, open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "clips": clips, "clipLen": {c: round(dur_of(PUB + "c_" + c + ".mp4"), 2) for c in clips}, "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"]} for i, g in enumerate(segs)]
json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "w", "img", "bk")}
gap, last = 0, 0
for g, d in zip(segs, dur):
    if g["k"] == "av": last = g["a"] + d
    else: gap = max(gap, g["a"] + d - last)
print(f"END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · {tot} · av {100*tot['av']/END:.1f}% · hueco máx sin avatar {gap:.1f}s")
print(f"piezas {len(ov)} · eventos {sum(len(v) for v in EVR.values())} · llaves {len(ded)} · clips {len(clips)} · reel {reel}")
print("fotos tapadas por piezas:", lost or "ninguna")
print("fotos sin usar:", sorted({f[2:-4] for f in os.listdir(PUB) if f.startswith("i_")} - used) or "ninguna")
print("SIN ANCLAR:", miss if miss else "ninguna")
