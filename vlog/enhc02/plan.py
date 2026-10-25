# enhc01 · plan del video ENTERO anclado a la voz (at() sobre words.json): cada foto, pieza y evento del mundo de la
# concesionaria entra con la frase que se dice en ese segundo → segs/ov/cam/ev/avail/edl en src/enhc01.
# Molde para hc02-07: copiá este archivo, cambiá SLUG y la sección "GUION" (vistas V, eventos y reglas quedan iguales).
import json, os, re, subprocess, unicodedata, statistics

SLUG = "enhc02"
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
RE = {'h02': 'Coach thought cash was power', 'f09': 'And Coach was happy, because the', 'h12': "it. Because I've seen deposits become", 'h24': 'bank. And only when the price', 'f44': 'from Pinecrest. March two thousand thirteen.'}
for sh in SHOTS:
    a = at(RE.get(sh["name"], sh["at"]))
    if a is not None: BEATS.append(dict(a=a, base="img:" + sh["name"], tr=None))
cur = 0

# ======================= GUION =======================
B("Last time, I left you at the door of the finance office", "w:hall", "fade")
O("The box", "tag", 4.0, pt="box", text="THE BOX", sub="the finance office")
B("So come in. Sit down", "w:box", "portal")
EV("door", "So come in. Sit down", 6.0)
O("I'm paying cash", "big", 4.0, text="\"I'M PAYING CASH.\"", size=130)
O("for twenty-six years, I was the man in the nice tie", "year", 4.0, year="26 YEARS", place="IN THE BOX")
O("My name is Hector", "lower", 6.0, name="HECTOR", l2="FINANCE MANAGER · BIRD ROAD AUTO PLAZA · 1989–2015")
O("I'm gonna give you nine reasons", "chips", 6.0, items=["9 REASONS", "REAL NUMBERS", "+ THE ONE NOBODY DOES"])
# ---- Coach Willis
O("June two thousand six", "year", 4.0, year="JUNE 2006", place="BIRD ROAD AUTO PLAZA")
O("at a high school in Westchester", "map", 4.0, pins=[{"at": "at a high school in Westchester", "n": "Westchester", "sub": "COACH EARL WILLIS · 34 YEARS"}])
B("Coach walked into Bird Road Auto Plaza on a Saturday morning", "w:lot", "portal")
O("Twenty-six thousand dollars", "money", 4.5, to=26000, label="CASHIER'S CHECK")
O("I'm a cash buyer, I don't want any of your financing games", "quote", 5.5, text="Son, I'm a cash buyer. I don't want any of your financing games.", who="COACH WILLIS, 2006")
O("a little over six thousand dollars", "big", 4.5, text="−$6,000+", sub="lost in one afternoon")
# ---- R1
B("Reason number one", "bk", "zoom")
O("Reason number one", "q", 6.0, n=1, q="The moment you say cash, the dealer stops discounting.", stamp="REASON #1")
B("Remember Abe Feldman's four-square", "w:pad", "portal")
ON("pad", "Remember Abe Feldman's four-square", "The finance office")
PQ("Price, trade, down payment", 0); PQ("monthly payment. Four boxes", 3)
O("there's a fifth box nobody draws", "big", 4.5, text="THE 5TH BOX", sub="the finance office")
O("It's called the reserve", "tag", 4.0, pt="box", text="THE RESERVE", sub="extra points on your rate")
B("up in the tower", "w:tower", "portal")
O("cash deal? Hold the price", "quote", 4.5, text="Cash deal? Hold the price.", who="THE TOWER", w=800)
B("The car was listed at twenty-four thousand nine hundred", "bk", "zoom")
O("The car was listed at twenty-four thousand nine hundred", "order", 12.0, title="COACH'S DISCOUNT", totalAt=1e9, rows=[{"at": "listed at twenty-four thousand nine hundred", "item": "LISTED", "v": 24900},
  {"at": "go down about twelve hundred for a finance deal", "item": "FINANCE BUYER", "v": 23700}, {"at": "he went down two hundred", "item": "COACH (CASH)", "v": 24700}])
O("Coach just lost his first thousand dollars", "big", 4.0, text="−$1,000", sub="before he sat down")
O("you say: I haven't decided yet", "say", 6.5, text="I haven't decided yet. Let's agree on the price first.")
# ---- R2
B("Reason number two", "bk", "zoom")
O("Reason number two", "q", 6.0, n=2, q="The rebates that only exist if you finance.", stamp="REASON #2")
B("puts money on the hood of a car", "w:price", "portal")
EV("sale", "puts money on the hood of a car", 8.0)
O("The captive lender, we called it", "tag", 4.0, pt="tower", text="CAPTIVE LENDER", sub="the car company's own bank")
O("Coach Willis's car had a twenty-five hundred dollar bonus", "big", 4.0, text="−$2,500", sub="rebate · finance required")
O("My nephew Danny", "lower", 5.0, name="DANNY", l2="MY NEPHEW · SELLS IN DORAL TODAY")
O("the cash buyer pays more than the finance buyer", "big", 4.5, text="CASH PAYS MORE", sub="same car · same day", size=130)
O("Is there any rebate or discount that requires financing", "say", 6.5, text="Is there any rebate or discount that requires financing?")
O("Same rule, different box", "say", 6.5, head="DOWN PAYMENT", text="Price first, in writing. Then trade. The down payment is the last thing you tell.")
O("the word refundable", "check", 7.0, head="IF YOU EVER GIVE A DEPOSIT", w=1000, rows=[{"at": "the word refundable", "tx": "\"Fully refundable\""}, {"at": "And the date", "tx": "The date"}, {"at": "And you ask them to sign it", "tx": "Their signature"}])
# ---- R3
B("Reason number three. Where the cash came from", "bk", "zoom")
O("Reason number three. Where the cash came from", "q", 6.0, n=3, q="Where the cash came from.", stamp="REASON #3")
O("all twenty-six thousand counted as income", "big", 4.5, text="+$26,000 INCOME", sub="on top of pension + Social Security", size=120)
O("once a certain kind of income passes thirty-two thousand dollars", "chips", 7.0, items=["$32,000 → UP TO 50% TAXED", "$44,000 → UP TO 85% TAXED"])
O("They call it IRMAA", "tag", 4.0, text="IRMAA", sub="the Medicare surcharge")
O("Coach paid around three thousand dollars", "big", 4.0, text="−$3,000", sub="for being a cash buyer")
O("Ask one question: if I take this money out this year", "say", 6.5, head="ASK YOUR TAX PERSON", text="If I take this money out this year, what does it cost me?")
# ---- Dottie II
O("April nineteen eighty-eight. Coral Way Motors", "year", 4.0, year="APRIL 1988", place="CORAL WAY MOTORS")
B("I'd just closed the door of the finance office", "w:box", "portal")
EV("door", "I'd just closed the door of the finance office", 6.0)
O("Irving always said, Dottie, never borrow for a car", "quote", 5.0, text="Dottie, never borrow for a car.", who="IRVING SHAPIRO")
O("A cash deal in the box is a dead deal", "quote", 4.5, text="A cash deal in the box is a dead deal.", who="ABE FELDMAN", w=900)
O("Let me get you a nice small payment instead", "quote", 5.5, text="Keep Irving's money in the bank. Let me get you a nice small payment instead.", who="ME, 1988")
B("And I slid the papers across the desk", "w:desk", "portal")
# ---- R4
B("Reason number four", "bk", "zoom")
O("Reason number four", "q", 6.0, n=4, q="Cash is oxygen when you're retired.", stamp="REASON #4")
O("The hurricane money doesn't get touched", "quote", 4.5, text="The hurricane money doesn't get touched.", who="MARISOL", w=900)
B("in September two thousand seventeen, Hurricane Irma came through", "w:night", "fade")
ON("rain", "Hurricane Irma came through", "And we paid it the next week")
O("in September two thousand seventeen", "year", 4.0, year="SEPT 2017", place="HURRICANE IRMA")
O("The roof was fourteen thousand dollars", "money", 4.0, to=14000, label="THE ROOF")
O("a credit card at twenty-four percent instead of a car loan at five", "chips", 5.5, items=["CREDIT CARD 24%", "CAR LOAN 5%"])
O("how many months of life do I still have in the bank", "say", 6.0, head="BEFORE ANY CAR", text="After I pay for this, how many months of life do I still have in the bank?")
# ---- R5
B("Reason number five", "bk", "zoom")
O("Reason number five", "q", 6.0, n=5, q="Your money can work while the loan is cheap.", stamp="REASON #5")
O("You borrow at zero, your money earns four", "loan", 10.0, la={"name": "LOAN", "pay": 416.7, "months": 60, "apr": "0%"}, lb={"name": "YOUR BANK", "pay": 83.3, "months": 12, "apr": "4%"},
  totAt="On twenty-five thousand dollars", diffAt="For doing nothing", head="$25,000 · BORROW AT 0, EARN 4")
O("banks are smart, they never use their own money", "quote", 4.5, text="Banks are smart. They never use their own money.", who="ABE FELDMAN", w=900)
# ---- R6
B("Reason number six. The envelope of hundreds", "bk", "zoom")
O("Reason number six. The envelope of hundreds", "q", 6.0, n=6, q="The envelope of hundreds.", stamp="REASON #6")
O("Nineteen seventy-nine, Coral Way Motors", "year", 3.5, year="1979", place="CORAL WAY MOTORS")
O("eleven thousand dollars in twenties and fifties", "money", 4.0, to=11000, label="IN A CIGAR BOX")
O("Form eighty-three hundred", "tag", 4.5, text="FORM 8300", sub="cash over $10,000 → reported")
O("That part is a crime", "big", 4.0, text="NEVER SPLIT IT", sub="that part is a crime")
# ---- tally
O("Because we're at about four thousand five hundred now", "order", 9.0, title="WHAT COACH LOST", totalAt="And it happened in my office", rows=[{"at": "A thousand on the price", "item": "Price", "v": 1000}, {"at": "twenty-five hundred rebate", "item": "Rebate", "v": 2500}, {"at": "three thousand in taxes", "item": "Taxes", "v": 3000}])
# ---- R7
B("Reason number seven", "bk", "zoom")
O("Reason number seven", "q", 6.0, n=7, q="The cash buyer gets hit harder in the box.", stamp="REASON #7")
B("I still had a quota", "w:drawer", "portal")
ON("drawer", "I still had a quota", "Coach Willis bought a seven-year service contract")
O("Coach Willis bought a seven-year service contract", "menu", 8.0, pk=[{"n": "PLATINUM", "pay": "$2,090", "items": ["7-yr service contract $1,495", "Paint & fabric $595"]}, {"n": "BASIC", "pay": "$0", "items": ["Just the car", "Factory warranty: 3 yrs"]}], hl=0, hlAt="Fourteen hundred and ninety-five dollars")
O("He wrote me a second check for the products", "big", 4.0, text="−$2,090", sub="products he didn't need")
O("Let me add it for you", "order", 9.0, title="COACH WILLIS · 2006", totalAt="Eight thousand and change", rows=[{"at": "A thousand on the price", "item": "Price", "v": 1000}, {"at": "Twenty-five hundred in rebate", "item": "Rebate", "v": 2500}, {"at": "About three thousand in taxes", "item": "Taxes", "v": 3000}, {"at": "two thousand in products", "item": "Products", "v": 2090}])
O("anything that's not on that paper, the answer is no, thank you", "say", 6.0, text="Anything that's not on this paper: no, thank you.")
# ---- R8
B("Reason number eight", "bk", "zoom")
O("Reason number eight", "q", 6.0, n=8, q="You lose the one weapon you have at the end.", stamp="REASON #8")
B("the dealer needs the bank to say yes", "w:tower", "portal")
O("fine, I'll use my credit union", "say", 5.5, text="Fine. I'll use my credit union.")
O("it's in the we owe", "tag", 4.5, text="THE \"WE OWE\"", sub="what the dealer still owes you")
# ---- R9
B("Reason number nine", "bk", "zoom")
O("Reason number nine", "q", 6.0, n=9, q="Watch out for a penalty for paying early.", stamp="REASON #9")
O("Prepayment penalty", "big", 4.0, text="PREPAYMENT PENALTY", size=120)
O("is this simple interest, and is there any penalty", "say", 6.5, text="Is this simple interest, and is there any penalty if I pay it off early?")
# ---- Katz
B("This was Mr. Leonard Katz", "w:box", "portal")
O("This was Mr. Leonard Katz", "map", 4.0, pins=[{"at": "This was Mr. Leonard Katz", "n": "Pinecrest", "sub": "MR. LEONARD KATZ · RETIRED PHARMACIST"}])
O("March two thousand thirteen", "year", 3.5, year="MARCH 2013", place="BIRD ROAD AUTO PLAZA")
O("Inside, three papers", "check", 8.0, head="MR. KATZ'S FOLDER", w=1000, rows=[{"at": "A signed buyer's order", "tx": "Signed out-the-door price"}, {"at": "A letter from his credit union", "tx": "Credit union: 3.9%"}, {"at": "a printout of the manufacturer's offer", "tx": "Maker: 0.9% + $1,000 bonus"}])
O("Eleven times, I counted afterwards", "big", 4.0, text="11 × \"NO, THANK YOU\"")
O("he paid off the entire loan on the fourth month", "big", 4.0, text="PAID OFF · MONTH 4")
# ---- R10
B("And reason number ten", "bk", "zoom")
O("And reason number ten", "q", 7.0, n=10, q="The one nobody does. The answer to Mrs. Shapiro.", stamp="REASON #10")
O("Here's the play, start to finish", "check", 14.0, head="THE PLAY", w=1050, rows=[{"at": "You don't say cash", "tx": "Don't say cash. Agree on the price."}, {"at": "is there any rebate or discount if I finance with you", "tx": "Ask about finance rebates"}, {"at": "And you say no to every product", "tx": "No to every product"},
  {"at": "you make your first three payments on time", "tx": "3 payments on time"}, {"at": "on the fourth month, you call the lender yourself", "tx": "Month 4: pay it off"}])
O("Coach would have kept more than four thousand dollars", "big", 4.0, text="+$4,000", sub="in Coach's pocket")
O("Who's holding the pen", "big", 4.5, text="WHO'S HOLDING THE PEN?", size=130)
B("Who's holding the pen", "w:pen", "portal")
EV("sign", "When you finance the way I just told you", 3.0)
# ---- Hector
O("Marisol has never, in forty-four years of marriage", "year", 3.5, year="44 YEARS", place="MARRIED TO MARISOL")
O("in the parking lot of the Publix on Bird Road", "year", 3.5, year="AUG 2019", place="BIRD ROAD")
O("And I said, no, thank you, son", "say", 5.0, text="No, thank you, son.")
# ---- recap
O("One. The moment you say cash", "say", 5.5, head="1 · SAY CASH?", text="I haven't decided. Let's agree on the price.")
O("Two. Some rebates and discounts only exist", "say", 5.5, head="2 · REBATES", text="Ask, and write the answer down.")
O("Three. Before you take money from a retirement account", "say", 5.5, head="3 · RETIREMENT MONEY", text="Ask your tax person first.")
O("Four. Cash is oxygen", "say", 5.0, head="4 · OXYGEN", text="Keep your hurricane money.")
O("Five. When the loan is cheap", "say", 5.0, head="5 · CHEAP LOAN", text="Let your money work.")
O("Six. Never carry a bag of cash", "say", 5.5, head="6 · NO BAG OF CASH", text="Cashier's check, after the price is signed.")
O("Seven. The cash buyer gets pushed harder", "say", 5.5, head="7 · THE BOX", text="Not on my paper? No.")
O("Eight. A pre-approval from your credit union", "say", 5.5, head="8 · YOUR WEAPON", text="Bring your credit union letter.")
O("Nine. Simple interest, no prepayment penalty", "say", 5.0, head="9 · PAY EARLY", text="Ask out loud. Initial it.")
O("And ten. Finance to get the deal", "say", 5.5, head="10 · YOU HOLD THE PEN", text="Finance, 3 payments, pay it off.")
O("came back to see me in two thousand eight", "year", 3.5, year="2008", place="COACH COMES BACK")
O("it's not your fault, son", "quote", 4.5, text="It's not your fault, son.", who="COACH WILLIS", w=800)
B("I had a desk drawer. Top right", "w:drawer", "portal")
ON("drawer", "I had a desk drawer. Top right", "I had ten tricks")
O("I had ten tricks", "big", 4.0, text="10 TRICKS", sub="next video")
O("Subscribe so you don't miss it", "end", 22.0, q="Did a dealer ever tell you you'd get a better deal paying cash? The exact words.", qAt="did a dealer ever tell you",
  next="10 Finance Office Tricks Dealers Use on Seniors (Former Finance Manager)", nAt="I read every one", until="I'll see you in the box")
B("I'll see you in the box", "w:wide", "fade")


# CTA guía (The Other Side of the Desk): libro 3D + página real + QR a /q, en un hueco sin avatar
O("I was the finance manager at Bird Road", "guia", 8.5, pag="tasa", until="in and just pay cash for")
O("to stay under the ten thousand", "guia", 8.5, pag="lapiz_rojo")
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
