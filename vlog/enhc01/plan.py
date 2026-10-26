# enhc01 · plan del video ENTERO anclado a la voz (at() sobre words.json): cada foto, pieza y evento del mundo de la
# concesionaria entra con la frase que se dice en ese segundo → segs/ov/cam/ev/avail/edl en src/enhc01.
# Molde para hc02-07: copiá este archivo, cambiá SLUG y la sección "GUION" (vistas V, eventos y reglas quedan iguales).
import json, os, re, subprocess, unicodedata, statistics

SLUG = "enhc01"
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
RE = {"f12": "He took a pen and drew a cross", "f14": "That's called payment packing", "f19": "he can move money between the boxes",
      "f23": "Ten minutes, he says", "f25": "The copy of the license went to the sales desk", "f29": "Here's something most people don't know",
      "f32": "the little desk up high", "f40": "When you say retired", "f46": "And when the paper comes back, read every line",
      "f49": "That was my first month in the box", "h25": "they all say okay and they follow him to the back", "h26": "Then you hold that paper",
      "f51": "Once you sign in that office and drive off", "f23": "Nineteen eighty-one, Coral Way Motors", "f36": "thirty-one years in the stables", "h29": "And that's hard for nice people", "h34": "Marisol says I read them instead of fixing the screen door"}
for sh in SHOTS:
    a = at(RE.get(sh["name"], sh["at"]))
    if a is not None: BEATS.append(dict(a=a, base="img:" + sh["name"], tr=None))
cur = 0

# ======================= GUION =======================
B("You're standing on a car lot", "w:lot", "fade")
O("It's ninety-one degrees", "tag", 4.0, pt="price", text="91°F · MIAMI", sub="the asphalt is soft")
O("the ten questions we asked every senior", "chips", 6.0, items=["10 QUESTIONS", "WHAT WE DID", "WHAT YOU SAY"])
O("And the last one, number ten", "big", 4.5, text="#10", sub="THE ONE NOBODY DOES")
O("My name is Hector", "lower", 6.0, name="HECTOR", l2="SOLD CARS IN MIAMI · 1975–2015")
O("on the Freedom Flights from Havana", "year", 4.0, year="1966", place="HAVANA → MIAMI")
O("in nineteen seventy-five I got a job on the lot", "year", 4.0, year="1975", place="CORAL WAY MOTORS")
B("I was the finance manager at Bird Road Auto Plaza", "w:sign", "portal")
O("I was the finance manager at Bird Road Auto Plaza", "tag", 4.5, pt="sign", text="FINANCE MANAGER", sub="1989 – 2015", dx=260, dy=60)
B("That's where the real money is made", "w:box", "portal")
O("That's where the real money is made", "tag", 4.0, pt="box", text="THE BOX", sub="the finance office")
O("he said, Hector, the customer who talks the most pays the most", "quote", 6.0, d=0.9, text="The customer who talks the most pays the most.", who="ABE FELDMAN, 1975")
B("Every question on a car lot has one job", "w:pad", "portal")
# ---- Q1
B("Question number one", "bk", "zoom")
O("Question number one", "q", 6.5, n=1, q="What brings you in today?", sAt="It's about your clock", stamp="DON'T ANSWER")
B("August nineteen ninety-two", "w:lot", "fade")
ON("rain", "August nineteen ninety-two", "Homestead, Cutler Ridge")
O("August nineteen ninety-two", "year", 4.5, year="AUG 1992", place="HURRICANE ANDREW")
B("I watched the sales managers that month", "w:lot", "portal")
ON("sale", "I watched the sales managers that month", "So what do you say back")
O("Sticker price, plus every add-on", "big", 4.0, text="STICKER PRICE", sub="+ every add-on")
O("You say: I'm comparing a few cars", "say", 7.0, text="I'm comparing a few cars, and I'm buying this month from whoever gives me the best out-the-door price.")
O("A rental for three days is a hundred and fifty dollars", "chips", 6.0, items=["RENTAL: $150", "DESPERATE: $2,500"])
# ---- Q2
B("Question number two", "bk", "zoom")
O("Question number two", "q", 7.5, n=2, q="What kind of monthly payment are you looking for?", sAt="the one Abe loved", stamp="DON'T ANSWER")
B("Top left, the price of the car", "bk", "cut")
O("Top left, the price of the car", "four", 18.0, cells=[{"at": "Top left, the price of the car", "v": "$30,000"}, {"at": "Top right, your trade-in", "v": "$4,000"},
  {"at": "Bottom left, your down payment", "v": "$2,000"}, {"at": "Bottom right, the monthly payment", "v": "$500?"}], hl=3, hlAt="the customer can only watch one box at a time")
O("Let's say the car is thirty thousand dollars", "loan", 24.0, la={"name": "60 MONTHS", "pay": 592.6, "months": 60, "apr": "6.9%"},
  lb={"name": "84 MONTHS", "pay": 451.3, "months": 84, "apr": "6.9%"}, totAt="You're happy. You're under five hundred", diffAt="you just paid about two thousand", head="$30,000 CAR · SAME RATE")
O("Two thousand dollars of extras", "calc", 7.0, keys="2000 ÷ 84", res="≈ $30/mo", resAt="You don't even feel it", note="PAYMENT PACKING")
B("And I'll tell you something else about the seven-year loan", "w:lot", "portal")
O("They call it being upside down", "big", 4.5, d=0.3, text="UPSIDE DOWN", sub="you owe more than the car is worth")
O("Abe had a word for those customers", "quote", 5.0, text="Annuities.", who="ABE, ON REPEAT CUSTOMERS", w=900)
O("Every time, word for word", "say", 7.0, text="I don't shop by the payment. What's the out-the-door price?")
# ---- Dottie I
O("April nineteen eighty-eight", "year", 4.0, year="APRIL 1988", place="CORAL WAY MOTORS")
O("She lived in Kendall", "map", 4.5, pins=[{"at": "She lived in Kendall", "n": "Kendall", "sub": "MRS. DOTTIE SHAPIRO, 74"}])
O("Whatever you think is fair, Hector", "quote", 5.0, text="Whatever you think is fair, Hector.", who="MRS. SHAPIRO, 1988")
# ---- Q3
B("Question number three", "bk", "zoom")
O("Question number three", "q", 6.0, n=3, q="Are you going to be trading in a vehicle today?", sAt="But remember the four-square", stamp="DON'T ANSWER")
B("Here's how it works. You want a good price", "w:pad", "portal")
ON("pad", "Here's how it works. You want a good price", "Same money. Different box")
PQ("So I give you a beautiful price on the new car", 0); PQ("two thousand less for your trade", 1); PQ("I give you a fat number for your trade", 1); PQ("I just don't move on the price", 0)
O("So you say: let's settle the price", "say", 6.5, text="Let's settle the price of the new car first, as if I don't have a trade.")
O("Danny sells today at a dealership in Doral", "lower", 5.0, name="DANNY", l2="MY NEPHEW · SELLS IN DORAL TODAY")
O("So get two or three real written offers", "say", 6.0, head="BEFORE YOU GO", text="Get two or three written offers for your car. Bring the paper.")
# ---- Q4
B("Question number four", "bk", "zoom")
O("Question number four", "q", 7.0, n=4, q="Can I have your keys? Our used car manager just wants a quick look.", sAt="one of the oldest tricks", stamp="DON'T ANSWER")
O("Nineteen eighty-one, Coral Way Motors", "year", 3.5, year="1981", place="CORAL WAY MOTORS")
B("He used to take the customer's keys", "w:keys", "portal")
EV("keys", "and the keys would", 14.0)
B("with a cold coffee", "w:coffee", "cut")
B("His car is out there", "w:clock", "portal")
O("His car is out there", "clock", 5.0, **{"from": 600, "to": 790}, label="LOCKED UP")
O("We called it locking up the customer", "big", 4.0, text="LOCKED UP", sub="the customer can't leave")
B("Now, most dealers today won't hide your keys", "w:door", "portal")
O("they hold your exit", "tag", 4.5, pt="door", text="YOUR EXIT", sub="the only power you have")
O("So when he says, can I have your keys, you say", "say", 7.0, text="Sure, look at it right now while I stand here. Then I'd like my keys back.")
# ---- Q5
B("Question number five", "bk", "zoom")
O("Question number five", "q", 6.5, n=5, q="Can I make a copy of your driver's license?", sAt="this one is partly true", stamp="PARTLY TRUE")
O("It was a credit application", "big", 4.0, d=0.4, text="CREDIT APPLICATION", sub="not a test-drive form")
B("And once they pull your credit, they know everything", "w:tower", "portal")
O("So you say: you can copy my license", "say", 7.0, text="You can copy my license for the test drive. You do not have my permission to run my credit.")
O("we have a customer looking for your exact model", "quote", 5.5, text="We have a customer looking for your exact model…", who="THE LETTER IN YOUR MAILBOX")
O("There's no customer. There's a list", "big", 4.0, d=0.3, text="THERE'S NO CUSTOMER", sub="there's a list")
# ---- Q6
B("Question number six", "bk", "zoom")
O("Question number six", "q", 6.0, n=6, q="How's your credit? Do you know your credit score?", sAt="But not if you say it out loud first", stamp="DON'T ANSWER")
B("the dealer sends your application to a bank", "w:box", "portal")
EV("drawer", "That's called the buy rate", 9.0)
O("We called it the reserve", "big", 4.0, text="THE RESERVE", sub="the dealer's cut of your rate")
O("On a thirty thousand dollar loan for six years", "loan", 11.0, la={"name": "BANK SAID", "pay": 495.8, "months": 72, "apr": "5.9%"},
  lb={"name": "I TOLD YOU", "pay": 524.5, "months": 72, "apr": "7.9%"}, totAt="two extra points is a little over", diffAt="For four minutes of my time", head="SAME CAR · TWO EXTRA POINTS")
O("you say: I already have my financing", "say", 6.0, text="I already have my financing. If you can beat my rate, I'll look at it.")
# ---- Q7
B("Question number seven", "bk", "zoom")
O("Question number seven", "q", 6.5, n=7, q="If I can get you to that number, will you buy the car today?", sAt="This one is the hook", stamp="THE HOOK")
B("He's going to take your number to the sales manager", "w:tower", "portal")
O("Only today. Only today", "quote", 4.5, text="Only today.", who="ABE FELDMAN, THE T.O.", w=800)
O("you say: if the numbers are right on paper", "say", 6.5, text="If the numbers are right on paper, I'll consider it. I never decide at the desk.")
O("Go to the Versailles on Calle Ocho", "map", 2.8, pins=[{"at": "Go to the Versailles on Calle Ocho", "n": "Little Havana", "sub": "A CAFECITO, AWAY FROM THE DESK"}])
O("The paper doesn't change when you leave", "big", 4.5, text="THE PAPER DOESN'T CHANGE", sub="only your feelings do", size=140)
# ---- Alvarez
B("Now the couple from Hialeah", "w:sign", "portal")
O("October nineteen ninety-six", "year", 4.0, year="OCT 1996", place="BIRD ROAD AUTO PLAZA")
O("from Palm Avenue in Hialeah", "map", 3.5, pins=[{"at": "from Palm Avenue in Hialeah", "n": "Hialeah", "sub": "ROGELIO & NILDA ALVAREZ"}])
O("And in that notebook she had written sentences", "note", 9.0, title="Nilda's notebook", rows=[{"at": "And in that notebook she had written sentences", "tx": "We don't shop by the payment."}, {"at": "Like the ones I'm giving you today", "tx": "What's the out-the-door price?"}])
O("Two times they stood up", "big", 4.0, text="THEY WALKED OUT. TWICE.", size=130)
O("she said three words to me", "big", 4.5, text="3 WORDS", sub="coming later in this series")
# ---- Q8
B("Question number eight", "bk", "zoom")
O("Question number eight", "q", 6.0, n=8, q="So, what do you do? Are you working, or are you retired?", sAt="On a car lot there is no small talk", stamp="NO SMALL TALK")
O("Hears you have time", "check", 7.0, head="WHEN YOU SAY \"RETIRED\", HE HEARS:", w=1000, rows=[{"at": "Hears you have time", "tx": "You have time"}, {"at": "Hears you have savings", "tx": "You have savings"}, {"at": "And hears you probably won't fight", "tx": "You won't fight"}])
O("You can say, I'd rather not get into that", "say", 6.0, text="I'd rather not get into that. Let's talk about the car.")
O("January two thousand four", "year", 3.5, year="JAN 2004", place="SUNNY ISLES")
O("They come into Bird Road to buy a little car", "map", 3.5, pins=[{"at": "They come into Bird Road to buy a little car", "n": "Sunny Isles", "sub": "WINTER CONDO"}, {"at": "to buy a little car for the winter", "n": "Bird Road", "sub": "THE DEALERSHIP"}])
O("He just told us his clock", "big", 4.0, text="3 DAYS", sub="he just told us his clock")
O("the answer is, long enough to find the right car", "say", 5.0, text="Long enough to find the right car.")
# ---- Q9
B("Question number nine", "bk", "zoom")
O("Question number nine", "q", 6.0, n=9, q="What would it take to earn your business today?", sAt="It's a trap", stamp="IT'S A TRAP")
O("And whoever says the first number loses", "quote", 4.5, text="Whoever says the first number loses.", who="ABE FELDMAN", w=1000)
B("Let's say the car is listed at thirty-two thousand", "bk", "zoom")
O("Let's say the car is listed at thirty-two thousand", "order", 15.0, title="WHO WENT FIRST?", totalAt=1e9, rows=[{"at": "listed at thirty-two thousand", "item": "LISTED", "v": 32000},
  {"at": "I was thinking maybe thirty", "item": "YOU SAID", "v": 30000}, {"at": "thirty-one five is the absolute best", "item": "MANAGER", "v": 31500}, {"at": "you meet in the middle at thirty-one", "item": "YOU PAID", "v": 31000}])
O("maybe that car would have gone for twenty-nine five", "big", 4.0, text="$29,500?", sub="you never found out")
O("So you say: your best out-the-door price", "say", 6.5, text="Your best out-the-door price, in writing, with every fee listed line by line.")
B("Dealer fee, doc fee, the prep fee", "bk", "zoom")
O("Dealer fee, doc fee, the prep fee", "order", 9.0, title="THE FEES", totalAt="Some of those you can refuse", rows=[{"at": "Dealer fee", "item": "Dealer fee", "v": 899}, {"at": "doc fee", "item": "Doc fee", "v": 999},
  {"at": "the prep fee", "item": "Prep fee", "v": 495}, {"at": "the nitrogen in the tires", "item": "Nitrogen", "v": 199}, {"at": "the etching on the windows", "item": "Window etching", "v": 299}])
# ---- Dottie II
B("That afternoon in April of eighty-eight", "w:floor", "portal")
O("Sal, is out with his gallbladder", "quote", 5.0, text="Sal is out with his gallbladder. You do the papers.", who="ABE FELDMAN, APRIL 1988")
B("and I walked her to the back office", "w:hall", "portal")
B("And I closed the door", "w:box", "cut")
EV("door", "And I closed the door", 8.0)
# ---- Q10
B("So. Question number ten", "bk", "zoom")
O("So. Question number ten", "q", 9.0, n=10, q="Now our finance manager is just going to go over a little paperwork with you.", sAt="A little paperwork. And everybody says", stamp="THE ONE NOBODY DOES")
O("The finance office is the second negotiation", "big", 4.5, text="THE 2ND NEGOTIATION", sub="where the dealer makes the most", size=140)
B("At Bird Road, on a lot of deals", "w:box", "portal")
EV("papers", "At Bird Road, on a lot of deals", 9.0)
O("I made more in the box in forty minutes", "chips", 5.0, items=["BOX: 40 MIN", "LOT: 4 HRS"])
O("you say: before I go in there", "say", 7.5, text="Before I go in there, print me the buyer's order with the out-the-door price. I'll sign it here.")
B("the finance man starts talking about protection plans", "w:drawer", "portal")
ON("drawer", "the finance man starts talking about protection plans", "you put that paper on his desk")
O("you put that paper on his desk and you say", "say", 6.0, text="Anything that is not on this paper, the answer is no.")
B("And one more thing, because everybody gets this wrong", "w:lot", "portal")
O("there is no three-day cooling-off period", "big", 5.0, text="NO 3-DAY COOLING-OFF", sub="not for a car bought at the dealer", size=130)
# ---- recap
O("One. What brings you in", "say", 5.5, head="1 · WHAT BRINGS YOU IN?", text="I'm comparing. Best out-the-door price wins.")
O("Two. What payment are you looking for", "say", 5.5, head="2 · WHAT PAYMENT?", text="I don't shop by the payment.")
O("Three. Do you have a trade", "say", 5.5, head="3 · A TRADE?", text="New car first, as if I have no trade.")
O("Four. Can I have your keys", "say", 5.5, head="4 · YOUR KEYS?", text="Look now. I'd like my keys back.")
O("Five. Can I copy your license", "say", 5.5, head="5 · YOUR LICENSE?", text="No permission to run my credit.")
O("Six. How's your credit", "say", 5.5, head="6 · YOUR CREDIT?", text="I already have my financing.")
O("Seven. If I get you to that number", "say", 5.5, head="7 · BUY TODAY?", text="I never decide at the desk.")
O("Eight. What do you do", "say", 5.5, head="8 · RETIRED?", text="Let's talk about the car.")
O("Nine. What would it take", "say", 5.5, head="9 · WHAT WOULD IT TAKE?", text="Best price in writing. Then silence.")
O("And ten. The finance manager", "say", 5.5, head="10 · A LITTLE PAPERWORK?", text="Not on this paper? The answer is no.")
O("That's it. Ten sentences", "check", 7.0, head="THE 10 SENTENCES · ON AN INDEX CARD", rows=[{"at": "That's it. Ten sentences", "tx": "I'm comparing. Best out-the-door price wins."}, {"at": "That's it. Ten sentences", "tx": "I don't shop by the payment."}, {"at": "That's it. Ten sentences", "tx": "New car first, as if I have no trade."}, {"at": "That's it. Ten sentences", "tx": "Look now. I'd like my keys back."}, {"at": "That's it. Ten sentences", "tx": "No permission to run my credit."}, {"at": "That's it. Ten sentences", "tx": "I already have my financing."}, {"at": "That's it. Ten sentences", "tx": "I never decide at the desk."}, {"at": "That's it. Ten sentences", "tx": "Let's talk about the car."}, {"at": "That's it. Ten sentences", "tx": "Best price in writing. Then silence."}, {"at": "That's it. Ten sentences", "tx": "Not on this paper? The answer is no."}])
O("A bonus, because you stayed with me", "big", 4.0, text="BONUS", sub="the sentence to leave")
O("So here it is. Thank you for your time", "say", 7.5, head="THE SENTENCE TO LEAVE", text="Thank you for your time. I'm going to think about it. Here's my phone number if the price changes.")
O("The price is good tomorrow", "big", 4.0, text="THE PRICE IS GOOD TOMORROW", size=120)
B("You know, people ask me, Hector, why are you doing this", "w:night", "fade")
ON("night", "You know, people ask me, Hector, why are you doing this", "Now, number ten is the door to the box")
O("So now I'm the one talking", "quote", 5.0, text="So now I'm the one talking. And this time, it doesn't cost you anything.", who="HECTOR")
B("Now, number ten is the door to the box", "w:box", "portal")
EV("drawer", "the forty minutes, the menu, the pen", 7.0)
EV("sign", "the speech I gave a thousand times", 3.0)
O("Are you paying cash", "big", 4.5, text="\"ARE YOU PAYING CASH?\"", size=130)
O("Subscribe so you don't miss it", "end", 22.0, q="Tell me what the dealer told you, the exact words. I'll tell you if it's true.", qAt="tell me what the dealer told you",
  next="I Was a Finance Manager: Why Retirees Should Never Pay Cash for a Car", nAt="tell me what the dealer told you", until="Marisol says I read them instead")
B("See you in the box", "w:wide", "fade")


# CTA guía (The Other Side of the Desk): libro 3D + página real + QR a /q, en un hueco sin avatar
O("I don't sell anything anymore", "guia", 8.5, pag="script_pago")
O("I already have my financing", "guia", 8.5, pag="tasa")
# fin CTA
# ======================= ARMADO (igual para todos los videos) =======================
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

# 26-oct: el plano av no puede pasar del fin de su ventana: después el reel trae relleno NEGRO (QC: 0,3 s de negro en 669 s)
fin_av = {round(ms, 2): me for ms, me in avw}
for i, g in enumerate(segs[:-1]):
    me = fin_av.get(round(g["a"], 2))
    if g["k"] == "av" and me is not None and segs[i + 1]["k"] != "av" and segs[i + 1]["a"] > me + 0.04:
        segs[i + 1]["a"] = round(me, 2)   # reel negro: el plano siguiente entra justo al terminar la ventana

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
