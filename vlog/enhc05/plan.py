# enhc05 · plan del video ENTERO anclado a la voz (motor de enhc01, ver D:/rtmp/hector/MUNDO.md). Cada foto, clip, pieza
# y evento del mundo entra con la frase que se dice en ese segundo → segs/ov/cam/ev/avail/edl en src/enhc05.
#
import json, os, re, subprocess, unicodedata, statistics

SLUG = "enhc05"
R = f"D:/wt/{SLUG}/"; S = R + f"src/{SLUG}/"; PUB = R + f"public/{SLUG}/"; REEL = R + f"public/av/{SLUG}/reel0.mp4"
W = json.load(open(S + "words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
SHOTS = []
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

_dur = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
CLN = {f[2:-4]: _dur(PUB + f) for f in os.listdir(PUB) if f.startswith("c_") and f.endswith(".mp4")}
RATE = {k: 0.55 for k in CLN if k[0] == "c" and k[1:].isdigit()}   # agnes (~2,7 s, sin audio): cámara lenta en el render
CLN = {k: v / RATE.get(k, 1) for k, v in CLN.items()}
# ---------------- planos: cada foto (cNN, con su clip agnes si llegó) y cada clip LTX en SU frase ----------------
SH = [
("h_lot_flags", "You're standing next to a silver SUV"), ("h_lanyard", "a young man with a lanyard around his neck"),
("c01", "And you smile back, because you're a nice person"), ("h_couple_walk", "before you've even touched the car"),
("c02", "for forty years I was the one asking"), ("c43", "A lot of you wrote, Hector, I did the"),
("c42", "Today we go to the beginning"), ("c38", "And now I'm on your side of the desk"),
("c04", "I am not telling you to lie about your age"),
# 1 size-up
("h_window_1975", "stands with me at the big front window of the showroom"), ("c03", "And we watch the cars pull into the lot"),
("s_shoes_watch", "The car you drove in. Your shoes"), ("c05", "Whether you walk straight to one car"),
("s_wander", "or you wander around looking at everything"), ("c06", "You can't hide your grey hair"),
# 2 questions
("q_coffee_desk", "So we asked other questions. Friendly questions"), ("c07", "I could tell you a monthly payment"),
("q_payment_sheet", "A payment customer thinks"), ("q_term_box", "I just stretch the loan longer"), ("c08", "The payment fits, and you pay thousands more"),
("q_rugelach", "He brought us a box of rugelach"), ("c09", "So here's what you say to all these questions"),
("q_kitchen_table", "do your homework before you walk in"), ("c10", "Thirty minutes at the kitchen table"),
# 3 trade-in
("t_green_sedan", "came to Bird Road in a sedan"), ("c11", "Seat covers still on"), ("t_odometer", "That's less than"),
("t_appraisal", "the used car manager knew"), ("c13", "Low miles, one owner, perfect inside"), ("c12", "And what did we offer the Feinbergs"),
("t_online_offer", "There are companies now that will give you an offer online"), ("c15", "Now you have a number"),
("c14", "park your car around the corner"), ("t_corner_park", "They'll still find out about it eventually"),
# 4 friend
("d_blue_dress", "a blue dress, her purse on her lap the whole time"), ("d_window_abe", "he looked out the window at her"),
("d_coffee_three", "I brought her coffee with milk and three sugars"), ("c17", "It was a trick with loneliness"),
("c18", "Just to sit next to you"), ("d_witness", "Because now there's a witness"),
# 5 walk out
("c19", "He buttoned his jacket"), ("w_jacket_button", "linen jacket even in August"), ("w_walk_out", "And he walked out the door"),
("w_palm_car", "under the palm tree by the service entrance"), ("c21", "When the number is right, call me"),
("w_phone_ring", "I called him the next morning"), ("c20", "stand up, politely, and leave"),
# 6 keys
("k_wall_clock", "A retiree can be kept four, five, six hours"), ("c23", "Their back hurts from the chair"),
("k_keys_drawer", "Sometimes the keys are sitting in a drawer"), ("k_night_showroom", "when he finally got to my office"),
("c26", "And he signed whatever"), ("c25", "Eat before you go"), ("k_snack", "Bring a bottle of water and a little snack"),
("c24", "I need my keys back now, please"),
# 7 credit
("c_credit_app", "there's your date of birth"), ("c27", "on the application, I knew exactly which products"),
("c_insurance_form", "Credit life insurance is optional"), ("c28", "with a separate place where you sign"),
("c29", "talk to your own insurance agent"), ("c_long_road", "Lower payment, yes. But"),
# 8 service contract
("x_engine_parts", "These new cars are computers on wheels"), ("c31", "Some service contracts are fine"),
("x_warranty_book", "a new car already comes with a factory warranty"), ("c32", "Read it. Most of the time"),
("c33", "At my age, I don't buy things the same day"),
# 9 son/daughter
("f_split", "Why don't you take the test drive with your son"), ("f_hospital", "a nurse at Jackson"),
("c34", "And Yolanda just smiled"), ("c35", "Let me text my son what you're offering"),
("f_phone_photo", "Take a picture of every paper"), ("c36", "somebody at home, sitting calmly on a couch"),
# 10 email
("c37", "Do the whole thing from your kitchen table"), ("e_email_three", "Then you email three dealerships"),
("e_slippers", "In your slippers"), ("e_inbox", "Answers will come back"), ("c22", "just for standing up and walking to his car"), ("c30", "on a car that's worth very little by then"),
("c39", "They walked into my office with a printed email"), ("e_printed_email", "you check that the out-the-door on the paper"),
("c40", "If it's different, you show them the email"),
# cierre
("c16", "Marisol found an old Rolodex card in the garage"), ("e_rolodex", "I sat in the garage with that little card"),
("c44", "I'm still making peace with it"), ("e_whiteboard", "a number on a whiteboard"), ("c41", "and the last day of the month"),
("e_sunset", "You'll laugh when you hear which one"), ("c45", "I'll see you in the next one"),
]
for n, ph in SH:
    a = at(ph) if ph != "x" else None
    if a is not None: BEATS.append(dict(a=a, base="img:" + n, tr=None))
cur = 0

# ======================= GUION =======================
B("You're standing next to a silver SUV", "img:h_lot_flags", "fade")
O("You two retired", "quote", 3.5, text="Beautiful day, folks! You two retired?", who="THE SALESMAN", w=1000)
O("the nine things a dealer does", "big", 4.5, text="YOUR AGE", sub="what they do the second they know it", size=180)
O("My name is Hector", "lower", 6.0, name="HECTOR", l2="SOLD CARS IN MIAMI · 1975–2015")
O("I'm not selling you anything", "big", 4.0, text="NEVER LIE", sub="just don't hand it to them", size=170)
# ---- 1
B("Okay. Number one. The size-up", "bk", "zoom")
O("Okay. Number one. The size-up", "q", 5.5, n=1, label="TELL", q="THE SIZE-UP", stamp="CONTROL THE FIRST SENTENCE")
O("My first week on the floor", "year", 4.0, year="JUNE 1975", place="CORAL WAY MOTORS")
O("That's an up", "tag", 4.0, pt="door", text="\"AN UP\"", sub="the next customer")
B("An up is what we call the next customer", "w:door", "portal")
O("Gray hair pays thicker", "quote", 5.0, text="Grey hair pays sticker.", who="ABE FELDMAN, 1975", w=1000)
O("What do they look at? Everything", "chips", 6.0, items=["YOUR CAR", "YOUR SHOES", "YOUR WATCH", "ALONE OR A COUPLE"])
O("We're here to look at this one", "say", 6.0, text="We're here to look at this one. What's the out-the-door price?")
# ---- 2
B("Number two. The questions that aren't about age", "bk", "zoom")
O("Number two. The questions that aren't about age", "q", 6.0, n=2, label="TELL", q="THE QUESTIONS THAT AREN'T ABOUT AGE", stamp="DON'T ANSWER")
O("Are you still working, or are you enjoying", "check", 10.0, head="EVERY ONE IS A DOOR INTO YOUR AGE", w=1100, rows=[
  {"at": "Are you still working, or are you enjoying", "tx": "Still working?"}, {"at": "What did you do before you retired", "tx": "What did you do before?"},
  {"at": "How many grandkids", "tx": "How many grandkids?"}, {"at": "When was the last time you bought a car", "tx": "Last time you bought a car?"}])
O("That one was gold", "big", 3.5, text="GOLD", sub="you don't know today's prices", size=200)
O("A payment customer thinks", "chips", 7.0, items=["PRICE CUSTOMER: WHAT DOES IT COST?", "PAYMENT CUSTOMER: CAN I AFFORD $400?"])
O("A retired couple from Coral Springs", "lower", 5.0, name="MR. & MRS. PINCUS", l2="RETIRED DENTIST · CORAL SPRINGS")
O("I have to watch every penny", "quote", 4.5, text="I'm on Social Security and a little pension now. I have to watch every penny.", who="MR. PINCUS, 2004")
O("The salesman found him a car at exactly", "money", 4.5, to=349, label="A MONTH · 72 MONTHS", sub="price $2,000 too high")
O("Let's talk about the car first. Smile", "say", 5.0, text="Let's talk about the car first.")
O("I don't shop by payment", "say", 5.0, text="I don't shop by payment. What's the out-the-door price?")
# ---- 3
B("Number three. Your trade-in tells them your age", "bk", "zoom")
O("Number three. Your trade-in tells them your age", "q", 6.0, n=3, label="TELL", q="YOUR TRADE-IN TELLS YOUR AGE", stamp="PARK AROUND THE CORNER")
O("A couple from Aventura", "map", 4.0, pins=[{"at": "A couple from Aventura", "n": "Aventura", "sub": "THE FEINBERGS, 2012"}])
O("Seat covers still on", "check", 7.0, head="WHAT THE CAR TOLD US", w=1000, rows=[{"at": "Seat covers still on", "tx": "Seat covers"},
  {"at": "Little air freshener", "tx": "Tree air freshener"}, {"at": "A parking sticker from their condo", "tx": "Condo parking sticker"}, {"at": "And a handicap placard", "tx": "Handicap placard"}])
O("You know what we call a car like that", "big", 4.0, text="\"CREAM PUFF\"", sub="low miles · one owner · perfect inside", size=160)
O("Our words came out of his mouth", "quote", 4.5, text="Well, it's an old car.", who="MR. FEINBERG — REPEATING OUR WORDS", w=1000)
O("I haven't decided. Let's agree on the price", "say", 5.5, text="I haven't decided. Let's agree on the price of this car first.")
# ---- 4
B("Number four. She's buying a friend", "bk", "zoom")
O("Number four. She's buying a friend", "q", 5.5, n=4, label="TELL", q="\"SHE'S BUYING A FRIEND\"", stamp="BRING A WITNESS")
O("Coral Way Motors. Mrs. Shapiro came in alone", "year", 4.0, year="1988", place="CORAL WAY MOTORS")
O("A widow from Kendall", "map", 4.0, pins=[{"at": "A widow from Kendall", "n": "Kendall", "sub": "MRS. DOTTIE SHAPIRO, 74"}])
O("She's not buying a car", "quote", 7.0, text="Seventy-four and alone. Hector, she's not buying a car. She's buying a friend. Be her friend, and she'll sign anything.", who="ABE FELDMAN, 1988", rev=True)
O("For three hours", "clock", 4.5, **{"from": 600, "to": 780}, label="3 HOURS OF \"FRIENDSHIP\"")
O("It was a trick with loneliness", "big", 4.0, d=0.3, text="A TRICK WITH LONELINESS", size=120, rev=True)
O("I'm only looking today", "say", 5.5, text="I'm only looking today. I'm not buying today.")
# ---- 5
B("Number five. Polite people don't walk out", "bk", "zoom")
O("Number five. Polite people don't walk out", "q", 5.5, n=5, label="TELL", q="POLITE PEOPLE DON'T WALK OUT", stamp="STAND UP")
O("Judge Arturo Prieto", "lower", 5.5, name="JUDGE ARTURO PRIETO, 73", l2="RETIRED CIRCUIT JUDGE · CORAL GABLES")
B("The salesman, the manager, the four-square", "w:pad", "portal")
ON("pad", "The salesman, the manager, the four-square", "Judge, this is the best we can do")
O("Thank you for your time, gentlemen", "quote", 5.0, text="Thank you for your time, gentlemen. I'll think about it at home.", who="JUDGE PRIETO, 2003")
O("I called him the next morning with a price", "money", 4.5, to=1100, label="LOWER · THE NEXT MORNING", sub="for standing up and walking out", rev=True)
O("Thank you. I'll think about it at home. Then stand up", "say", 5.5, text="Thank you. I'll think about it at home.")
# ---- 6
B("Number six. They have all day", "bk", "zoom")
O("Number six. They have all day", "q", 5.5, n=6, label="TELL", q="THEY HAVE ALL DAY", stamp="TWO HOURS. THEN LEAVE.")
B("the finance office, is always at the end", "w:box", "portal")
B("Let me get your keys so the used car manager", "w:keys", "portal")
EV("keys", "Let me get your keys so the used car manager", 14.0)
O("Mr. Oscar Bermúdez", "lower", 5.0, name="OSCAR BERMÚDEZ, 71", l2="RETIRED POSTAL CARRIER · WESTCHESTER")
O("he sat at Bird Road for six hours", "clock", 5.0, **{"from": 870, "to": 1245}, label="6 HOURS 10 MINUTES")
O("Just give me the papers, I'll sign whatever", "quote", 4.5, text="Hector, I came at two-thirty. Just give me the papers, I'll sign whatever.", who="MR. BERMÚDEZ, 1997")
O("I have two hours today", "say", 5.0, text="I have two hours today.")
O("I need my keys back now, please", "say", 4.5, text="I need my keys back now, please.")
O("I'll come back tomorrow morning", "say", 5.0, text="I'll come back tomorrow morning to do the paperwork.")
# ---- 7
B("Number seven. The credit application", "bk", "zoom")
O("Number seven. The credit application", "q", 6.0, n=7, label="TELL", q="THE CREDIT APPLICATION", stamp="PRICE FIRST")
O("the Equal Credit Opportunity Act", "big", 4.5, text="AGE IS PROTECTED", sub="Equal Credit Opportunity Act", size=150)
O("And the first one was credit life insurance", "big", 4.0, text="CREDIT LIFE", sub="pays the loan if you die or become disabled", size=170)
O("You don't want to leave this debt", "quote", 6.0, text="Mr. Gomez, you don't want to leave this debt to your children.", who="WHAT I SAID")
O("Credit life insurance is optional", "big", 4.0, text="OPTIONAL", sub="if you didn't ask for it, it comes off", size=190)
O("If you need a long loan to afford the car", "big", 4.5, text="TOO EXPENSIVE", sub="buy a less expensive car", size=160)
# ---- 8
B("Number eight. At your age, you don't want surprises", "bk", "zoom")
O("Number eight. At your age, you don't want surprises", "q", 6.0, n=8, label="TELL", q="\"AT YOUR AGE, YOU DON'T WANT SURPRISES\"", stamp="IT CAN WAIT")
O("at this stage in life", "quote", 7.0, text="At this stage in life, the last thing you want is a surprise. This plan is peace of mind.", who="THE PITCH, 26 YEARS")
B("Peace of mind. That's the phrase", "w:drawer", "portal")
EV("drawer", "Peace of mind. That's the phrase", 7.0)
O("First, a new car already comes", "check", 22.0, head="WHAT THE FINANCE MANAGER WON'T TELL YOU", w=1100, rows=[
  {"at": "First, a new car already comes", "tx": "You already have a factory warranty"}, {"at": "Second, you don't have to buy it today", "tx": "You can buy it later"},
  {"at": "Third, and this is the one", "tx": "The price is negotiable"}])
O("At my age, I don't buy things the same day", "say", 5.5, text="At my age, I don't buy things the same day I hear about them.")
# ---- 9
B("Number nine. When you bring your son", "bk", "zoom")
O("Number nine. When you bring your son", "q", 6.0, n=9, label="TELL", q="WHEN YOU BRING YOUR SON OR DAUGHTER", stamp="STAY TOGETHER")
O("Come on, Dad, you deserve it", "quote", 4.0, text="Come on, Dad, you deserve it. Just get it.", who="OUR BEST SALESMAN", w=1000)
O("Mr. and Mrs. Alvarez from Hialeah", "map", 4.0, pins=[{"at": "Mr. and Mrs. Alvarez from Hialeah", "n": "Hialeah", "sub": "THE ALVAREZ FAMILY + YOLANDA"}])
O("you decide three things", "check", 7.0, head="DECIDE AT HOME", w=900, rows=[{"at": "The car, the most you'll pay", "tx": "The car"},
  {"at": "the most you'll pay out-the-door", "tx": "The most out-the-door"}, {"at": "and who talks", "tx": "Who talks"}])
O("We'll all go together", "say", 4.0, text="We'll all go together.")
O("I like it, but my daughter says", "say", 5.5, text="I like it, but my daughter says it's too much. I can't go against her.")
O("He says, Tío, the moment", "quote", 6.0, text="The moment they send a photo of the paper to somebody who isn't in the room, I know I'm not getting any gravy.", who="DANNY, SELLS IN DORAL")
# ---- 10
B("And now, number ten", "bk", "zoom")
O("And now, number ten", "q", 6.5, n=10, label="TELL", q="DON'T WALK ON THE LOT UNTIL THE DEAL IS DONE", stamp="THE ONE NOBODY DOES")
O("I want to buy this car, stock number", "note", 14.0, title="Email to 3 dealers", rows=[{"at": "I want to buy this car, stock number", "tx": "I want to buy this car, stock #____."},
  {"at": "Please send me your out-the-door price", "tx": "Send me your out-the-door price, in writing,"}, {"at": "with every fee listed separately", "tx": "with every fee listed separately."},
  {"at": "I have my own financing", "tx": "I have my own financing."}, {"at": "I will buy this week from the dealer", "tx": "I buy this week from the best price."}])
O("Don't say your age. Don't say you're retired", "chips", 5.0, items=["NO AGE", "NO \"RETIRED\"", "NO TRADE-IN", "NO PAYMENT"])
O("Please send me the number in writing first", "say", 4.5, text="Please send me the number in writing first.")
O("Can you beat this", "say", 3.5, text="Can you beat this?")
O("That's how you make your age disappear", "big", 4.5, text="YOUR AGE DISAPPEARS", sub="decide everything before you're in the room", size=130, rev=True)
# ---- recap
O("One, the size-up", "check", 50.0, head="THE 10 TELLS", w=1150, rows=[
  {"at": "One, the size-up", "tx": "Size-up → ask the out-the-door"}, {"at": "Two, the friendly questions", "tx": "Questions → car first"},
  {"at": "Three, the trade-in tells your age", "tx": "Trade-in → keep it out"}, {"at": "Four, she's buying a friend", "tx": "Buying a friend → bring a witness"},
  {"at": "Five, polite people don't walk out", "tx": "Polite → stand up"}, {"at": "Six, they have all day", "tx": "All day → two hours, keys back"},
  {"at": "Seven, the credit application", "tx": "Credit app → price first"}, {"at": "Eight, at your age you don't want surprises", "tx": "Surprises → it can wait"},
  {"at": "Nine, bring your son or daughter", "tx": "Son or daughter → the wall"}, {"at": "And ten, the one nobody does", "tx": "Do the deal by email"}])
# ---- Rolodex
O("Dottie Shapiro. Kendall. Coffee with milk", "note", 9.0, title="Rolodex card", rows=[{"at": "Dottie Shapiro. Kendall", "tx": "Dottie Shapiro. Kendall."},
  {"at": "Coffee with milk, three sugars", "tx": "Coffee w/ milk, 3 sugars."}, {"at": "Grandkids in New Jersey", "tx": "Grandkids in New Jersey."}, {"at": "Irving", "tx": "Irving.", "red": True}], rev=True)
B("Next time, something a lot more cheerful", "w:lot", "portal")
O("If this was useful, subscribe", "end", 14.0, q="What was the first question the salesman asked you last time?", next="Former Car Dealer: The BEST Month for Seniors to Buy a Car",
  qAt="what was the first question", nAt="I'll tell you if it's true", until="I'll see you in the next one")

# CTA guía (The Other Side of the Desk): libro 3D + página real del PDF + QR, sin URL en pantalla
O("Today we go to the beginning", "guia", 8.5, pag="script_pago")
O("But at some point, if you're financing", "guia", 8.5, pag="tasa")

# ======================= ARMADO (igual para todos los videos) =======================
BEATS.sort(key=lambda b: b["a"])
used = set()
for b in BEATS:
    if b["base"].startswith("img:"):
        i = b["base"][4:]
        if i in used or not (os.path.exists(PUB + "i_" + i + ".jpg") or os.path.exists(PUB + "c_" + i + ".mp4")): b["base"] = "skip"
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
    L = CLN.get(g.get("id")); thr = min(L - 0.3, 14.0) if L else 6.0
    if g["k"] == "img" and b - g["a"] > thr + 2.5: add.append({"a": round(g["a"] + thr, 2), "k": "w", "view": ["wide", "lot", "desk", "box", "pad", "price"][i % 6], "tr": "portal"})
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

def push(v, k=0.1):
    p, l, f = V[v]; return [round(p[i] + (l[i] - p[i]) * k, 3) for i in range(3)], l, f
keys = []
for i, g in enumerate(segs):
    if g["k"] not in ("w", "bk"): continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    v = g.get("view") or ["wide", "box", "lot", "desk"][i % 4]
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
for o in ov:   # piezas grandes sobre el avatar: abajo, sin taparle la cara
    if o['k'] in ('big', 'money') and ov_av(o['a'], o['b']): o['y'] = 900; o['size'] = min(o.get('size', 220), 130)
ev = {k: sorted(v) for k, v in EVR.items()}; ev["padq"] = sorted(PADQ, key=lambda x: x["a"])
clips = sorted(f[2:-4] for f in os.listdir(PUB) if f.startswith("c_") and f.endswith(".mp4"))
reel = os.path.exists(REEL)
dur_of = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
rl = dur_of(REEL) if reel else 0
json.dump(segs, open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "clips": clips, "clipLen": {c: round(CLN.get(c, dur_of(PUB + "c_" + c + ".mp4")), 2) for c in clips}, "rate": {c: RATE[c] for c in clips if c in RATE}, "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
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
