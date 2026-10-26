# enhc04 · plan del video ENTERO anclado a la voz (motor de enhc01, ver D:/rtmp/hector/MUNDO.md). Cada foto, clip, pieza
# y evento del mundo entra con la frase que se dice en ese segundo → segs/ov/cam/ev/avail/edl en src/enhc04.
#
import json, os, re, subprocess, unicodedata, statistics

SLUG = "enhc04"
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
TRA = json.load(open(f"D:/rtmp_{SLUG}/ltx_tramos.json"))
OFF, SRC = {}, {}   # LTX 25-oct: v01 (28 s, 3 tomas con corte) -> v01_1/_2/_3, cada una anclada a su frase
for k in [k for k in CLN if k[0] == "v" and k[1:].isdigit()]:
    for j in (1, 2, 3):   # sólo el tramo LIMPIO de cada toma (ltx_tramos.json de tramos_av.py); <2 s = afuera
        o, l = TRA.get(f"{k}_{j}", (0, 0))
        if l >= 2 and CLN[k] >= o + l: CLN[f"{k}_{j}"] = l; OFF[f"{k}_{j}"] = o; SRC[f"{k}_{j}"] = k
    del CLN[k]
# ---------------- planos: cada foto (cNN, con su clip agnes si llegó) y cada clip LTX en SU frase ----------------
SH = [
("f_office", "You're sitting in a little office with no windows"), ("f_pen_line", "He puts his pen right on the line"),
("f_showroom_coffee", "your wife is out in the showroom drinking"), ("c01", "I was that man in the nice tie"),
("c02", "there's no such thing. On that paper"), ("c43", "Some of you wrote to me and said"),
("f_freedom_plane", "on the Freedom Flights"), ("f_coralway_lot", "I sold cars on the floor at Coral Way Motors"),
("f_birdroad_sign", "I was the finance manager at Bird Road Auto Plaza"), ("f_box_door", "They called my office"),
("c38", "Now I'm on your side of the desk"),
# 1 dealer prep
("c03", "I've got a mustache I was very proud of"), ("c09", "a straw hat he never took off"),
("c06", "there's a new line on it"), ("c39", "And I tell him what Abe told me to say"),
("p_pdi_wash", "We wash it, we check the fluids"), ("p_plastic_peel", "we take off the plastic"),
("p_checklist", "the little checklist with all the boxes"), ("p_sticker_glass", "Look at the window sticker on a new car"),
("c05", "But you will not find"), ("c07", "you are being asked to pay twice for the same wash"),
("c08", "You say this, slowly, nicely"), ("p_line_cross", "Then lower the price of the car by the same amount"),
("c41", "Now, there's one exception, and I'm gonna be honest"), ("c04", "Mr. Ruiz, by the way, drove that cream sedan"),
# 2 second sticker
("a_hurricane", "Hurricane Andrew. If you lived in South Dade"), ("c10", "cars were crushed under trees"),
("a_addendum", "there was a second sticker. Right next to the factory sticker"), ("c11", "That's the second sticker. In the business"),
("c42", "the second sticker is written by the dealer"), ("a_kendall_condo", "who'd bought a condo in Kendall Lakes"),
("a_pen_pocket", "Then he took a pen out of his shirt pocket"), ("c12", "and he drew a line through"),
# 3 VIN etching
("v_etch_glass", "they etch it into the windows with a little stencil"), ("v_etch_kit", "He's got a little cardboard box on the table"),
("c14", "You want the VIN on your windows"), ("c13", "You can buy a kit yourself"),
("v_police_lot", "some police departments here in Miami-Dade"), ("c40", "That's the truth about the box"),
# 4 nitrogen
("c15", "This one makes me laugh"), ("n_green_caps", "They put green caps on the valve stems"),
("n_airplane_hangar", "a mechanic for Eastern Airlines at Miami"), ("n_gauge", "with a gauge that costs"),
("c16", "cold, in the morning, before you drive"), ("n_door_sticker", "The right number is on the sticker inside your driver's door"),
("c17", "you can put regular air in them"), ("c18", "Then I took them back out of the trash"),
("n_caps_jar", "They're in a jar in my garage"), ("c44", "Speaking of Marisol"),
# 5 appearance package
("ap_jugs", "we had big jugs"), ("c19", "One said paint sealant"), ("ap_buffer", "would put the sealant on the paint with a buffer"),
("ap_fabric_spray", "Spray the seats with the fabric stuff"), ("c20", "What did the product cost us"),
("ap_wax_driveway", "Here in Miami, with the sun"), ("c21", "a good wax twice a year"),
("ap_undercoat", "And undercoating? On a new car"), ("c22", "Write that number down"),
("ap_phone_photo", "Take a picture of it with your phone"), ("ap_gravy", "You know what Abe used to call the appearance package"),
("c23", "The car is the meat"), ("c24", "seniors were the best gravy customers we had"),
# Dottie
("c25", "I was still on the floor at Coral Way Motors, but that year"), ("d_purse", "with her purse on her lap the whole time"),
("d_synagogue_road", "miles to the synagogue"), ("d_doorway", "because Abe was watching from the door"),
# 6 doc fee
("doc_fees", "The doc fee. The documentation fee"), ("doc_back_office", "the person in the back office"),
("c27", "It's usually in tiny letters near the fee"), ("c28", "You need the total to come down"),
("c30", "Say it on the phone"), ("doc_email", "Say it by email"), ("doc_palmetto", "before you drive over the Palmetto"),
("c26", "take a pen, and put a little"), ("doc_red_pen", "with her reading glasses on a chain and a red pen"),
# ley
("law_court", "a federal court threw it out"), ("c31", "And one more thing people get wrong"),
# 7 rate markup
("r_banks_screen", "the finance manager sends your application to banks"), ("c33", "That's called the buy rate"),
("r_rate_type", "So I could write your contract at"), ("c32", "Let me give you the numbers"),
("r_credit_union", "go to your bank or your credit union"), ("r_letter", "They give you a letter with a rate"),
("c34", "Show them your credit union letter"), ("r_wallet_card", "so you can write them on a card"),
("c35", "And the sentence for all of them"), ("c29", "On paper or by email"),
# Ruiz y cierre
("c36", "I promised I'd come back to Mr. Teodoro Ruiz"), ("e_strawhat", "under that hat, and he said"),
("c37", "That's why I make these videos"), ("e_sunset_lot", "Who paid the gravy because they thought"),
("c45", "I'll see you in the next one"),
]
LTXB = [(f"v{i // 3 + 1:02d}_{i % 3 + 1}", ph) for i, (ph, _) in enumerate(json.load(open("D:/rtmp_enhc04/ltx_av/beats_" + SLUG + ".json", encoding="utf8")))]
SH = [x for x in SH if x[1] not in {ph for _, ph in LTXB}] + LTXB   # 25-oct: Héctor HACIENDO lo que narra (LTX 3 tomas)
for n, ph in SH:
    a = at(ph)
    if a is not None: BEATS.append(dict(a=a, base="img:" + n, tr=None))
cur = 0

# ======================= GUION =======================
B("You're sitting in a little office with no windows", "img:f_office", "fade")
EV("papers", "Sign here, here, and initial here", 6.0)
O("Seven. And every single one of them", "big", 4.5, text="7 FEES", sub="you can say no to every one")
O("And the seventh one", "big", 4.0, d=0.6, text="#7", sub="THE ONE NOBODY SEES", rev=True)
O("My name is Hector", "lower", 6.0, name="HECTOR", l2="SOLD CARS IN MIAMI · 1975–2015")
O("on the Freedom Flights", "year", 4.0, year="1966", place="HAVANA → MIAMI")
O("They called my office", "tag", 4.0, pt="box", text="THE BOX", sub="the finance office")
B("Let's start with the first one", "w:price", "portal")
# ---- #1 dealer prep
B("Number one. The dealer prep fee", "bk", "zoom")
O("Number one. The dealer prep fee", "q", 6.0, n=1, q="DEALER PREP FEE", label="FEE", stamp="CROSS IT OUT")
O("I'm two years on the floor at Coral Way Motors", "year", 4.0, year="1977", place="CORAL WAY MOTORS")
O("a retired bus driver from Little Havana", "map", 4.0, pins=[{"at": "a retired bus driver from Little Havana", "n": "Little Havana", "sub": "MR. TEODORO RUIZ, 66"}])
O("That was two weeks of Mr. Ruiz's pension", "money", 4.5, to=245, label="DEALER PREPARATION", sub="two weeks of his pension")
B("Here's what I didn't tell him", "w:desk", "portal")
O("It's called the pre-delivery inspection", "big", 4.5, text="P.D.I.", sub="the factory already pays the dealer")
O("So when you see dealer prep", "check", 7.0, head="SAME FEE, DIFFERENT NAMES", w=1000, rows=[{"at": "So when you see dealer prep", "tx": "Dealer prep"},
  {"at": "or pre-delivery service", "tx": "Pre-delivery service"}, {"at": "or reconditioning on a new car", "tx": "Reconditioning"}])
O("my nephew Danny, who sells at a store in Doral", "lower", 5.0, name="DANNY", l2="MY NEPHEW · SELLS IN DORAL TODAY")
O("The manufacturer already pays you for prep", "say", 7.0, text="The manufacturer already pays you for prep. I'm not paying it twice. Please take it off.")
O("The customer who talks the most, pays the most", "quote", 5.0, text="The customer who talks the most, pays the most.", who="ABE FELDMAN")
O("Then everybody's overpaying", "say", 5.0, head="IF THEY PUSH", text="Then everybody's overpaying. Not me.")
# ---- #2 second sticker
B("Number two. The second sticker", "bk", "zoom")
O("Number two. The second sticker", "q", 6.0, n=2, q="THE SECOND STICKER", label="FEE", stamp="IT'S NOT THE LAW")
O("Hurricane Andrew. If you lived in South Dade", "year", 4.5, year="AUG 1992", place="HURRICANE ANDREW")
O("Homestead was gone", "map", 4.5, pins=[{"at": "Homestead was gone", "n": "Homestead"}, {"at": "Cutler Ridge, Kendall", "n": "Kendall"}])
B("Every family in South Dade needed a car", "w:lot", "portal")
ON("rain", "Every family in South Dade needed a car", "And the next morning")
B("And the next morning, on every new car", "w:price", "cut")
ON("sale", "And the next morning, on every new car", "That's the second sticker")
O("And on it, one line", "money", 4.5, to=2995, label="MARKET ADJUSTMENT", sub="on the second sticker")
O("Today the market adjustment line has nicknames", "chips", 6.0, items=["A.D.M.", "ADDITIONAL DEALER MARKUP", "DEMAND PRICING"])
O("It is not the law", "big", 4.5, text="IT'S NOT THE LAW", sub="it's the dealer's opinion", size=150)
O("who'd bought a condo in Kendall Lakes", "lower", 5.0, name="THE HENDERSONS", l2="SNOWBIRDS FROM DAYTON, OHIO")
O("and he wrote next to it", "quote", 4.5, text="No, thank you.", who="MR. HENDERSON, 1992", w=900)
O("couples that week? They paid it", "big", 4.0, text="40 COUPLES PAID IT", size=140)
O("you ask the salesman", "say", 5.5, head="BEFORE YOU SIT DOWN", text="Is there a dealer addendum on this car? A second sticker?")
O("I'll pay the factory sticker", "say", 5.5, text="I'll pay the factory sticker, or less. I don't pay addendums.")
O("Protection package", "chips", 5.0, items=["PROTECTION PACKAGE", "APPEARANCE PACKAGE", "SECURITY PACKAGE"])
# ---- #3 VIN etching
B("Number three. VIN etching", "bk", "zoom")
O("Number three. VIN etching", "q", 6.0, n=3, q="VIN ETCHING", label="FEE", stamp="A $20 KIT")
O("Abe Feldman called me into the back room", "year", 4.0, year="1984", place="CORAL WAY MOTORS")
O("The kid from the car wash", "calc", 6.5, keys="249-19.95", res="$229 profit", resAt="And then Abe taught me how to sell it", note="15 MINUTES OF WORK")
O("So you sell the fear", "big", 4.0, text="SELL THE FEAR", sub="not the glass")
O("he saw one at", "money", 4.5, to=999, label="ETCHING TODAY", sub="with a \"theft guarantee\"")
O("So the sentence is: I don't want the etching", "say", 6.0, text="I don't want the etching. Please take it off, or I'll take the car without it.")
O("Then that was your decision, not mine", "say", 4.5, head="IF IT'S ALREADY ON THE GLASS", text="Then that was your decision, not mine.")
B("That's the truth about the box", "w:box", "portal")
# ---- #4 nitrogen
B("Number four. Nitrogen", "bk", "zoom")
O("Number four. Nitrogen", "q", 5.5, n=4, q="NITROGEN TIRE FILL", label="FEE", stamp="THE AIR IS 78% NITROGEN")
O("I've got my own office, my name on the door", "year", 4.0, year="2011", place="BIRD ROAD AUTO PLAZA")
B("I've got my own office, my name on the door", "w:hall", "portal")
O("And the line on the paper", "money", 4.0, to=199, label="NITROGEN TIRE FILL")
O("And there's a customer, Mr. Gus Navarro", "lower", 5.5, name="GUS NAVARRO, 70", l2="EASTERN AIR LINES MECHANIC · WESTCHESTER")
O("You're charging me", "quote", 5.5, text="You're charging me $199 for the other 22.", who="MR. NAVARRO, 2011")
O("Regular air is already about", "big", 4.0, text="78%", sub="of plain air is already nitrogen")
O("Check the pressure once a month", "check", 8.0, head="WHAT REALLY KEEPS TIRES HEALTHY", w=1000, rows=[{"at": "Check the pressure once a month", "tx": "Check once a month"},
  {"at": "with a gauge that costs", "tx": "A $5 gauge"}, {"at": "cold, in the morning, before you drive", "tx": "Cold, in the morning"},
  {"at": "The right number is on the sticker inside", "tx": "Number on the door sticker"}])
O("So the sentence: I don't want nitrogen", "say", 5.0, text="I don't want nitrogen. Take the charge off.")
O("Fine. Then it's free", "say", 4.0, head="IF IT'S ALREADY IN THE TIRES", text="Fine. Then it's free.")
EV("drawer", "I kept them in my drawer", 5.0)
# ---- #5 appearance package
B("Number five. Paint protection", "bk", "zoom")
O("Number five. Paint protection", "q", 6.5, n=5, q="THE APPEARANCE PACKAGE", label="FEE", stamp="IT'S GRAVY")
O("In the back room behind the service department", "year", 4.0, year="1999", place="BIRD ROAD AUTO PLAZA")
O("And on the paper we wrote", "money", 4.5, to=895, label="PAINT & FABRIC PROTECTION")
O("What did the product cost us", "calc", 6.0, keys="895-50", res="≈ $845 profit", resAt="Plus Ramiro's hour", note="40 MINUTES WITH A BUFFER")
O("Today Danny tells me it's called", "money", 4.5, **{"from": 1000}, to=2500, label="\"CERAMIC COATING\" TODAY")
O("So the sentence for this one", "say", 6.0, text="No appearance package. No paint, no fabric, no undercoating. Please remove it.")
O("If the number moves in the box", "big", 4.0, text="THE NUMBER MOVES?", sub="you stand up", size=150)
O("He'd say, The car is the meat", "quote", 6.0, text="The car is the meat. The packages are the gravy.", who="ABE FELDMAN")
# ---- Dottie
O("I was still on the floor at Coral Way Motors, but that year", "year", 4.0, year="1988", place="CORAL WAY MOTORS")
O("from Kendall. A widow", "map", 4.0, pins=[{"at": "from Kendall. A widow", "n": "Kendall", "sub": "MRS. DOTTIE SHAPIRO, 74"}])
O("I wrote a service contract into her payment", "money", 4.5, to=1495, label="SERVICE CONTRACT", sub="she never saw it as a line")
O("She saw it as", "big", 4.0, text="+$26 A MONTH", sub="that's all she saw", size=150, rev=True)
O("Irving always took care", "quote", 5.0, text="Irving always took care of these things.", who="MRS. SHAPIRO, 1988")
EV("sign", "And she signed", 3.0)
B("Before I give you number six", "w:door", "portal")
# ---- #6 doc fee
B("Okay. Number six. The doc fee", "bk", "zoom")
O("Okay. Number six. The doc fee", "q", 6.0, n=6, q="THE DOC FEE", label="FEE", stamp="TAKE IT OFF THE PRICE")
O("Sometimes it's called dealer fee", "chips", 5.5, items=["DEALER FEE", "PROCESSING FEE", "ADMINISTRATIVE FEE"])
O("Here in Florida, there's no limit", "big", 4.0, text="NO LIMIT", sub="on doc fees in Florida")
O("Danny tells me in Miami today", "money", 4.5, **{"from": 900}, to=1300, label="MIAMI DOC FEES TODAY")
O("Profit. It's right there", "big", 4.0, text="\"PROFIT\"", sub="printed on your buyer's order in Florida", size=170, rev=True)
O("So the sentence is: I understand you can't remove", "say", 7.0, text="I understand you can't remove the doc fee. Then take the same amount off the price of the car.")
O("You negotiate the out-the-door price", "big", 4.5, text="OUT-THE-DOOR", sub="one number · everything included", size=150)
O("Government fees: sales tax", "order", 22.0, title="G OR D?", rows=[{"at": "Government fees: sales tax", "item": "Sales tax (G)", "v": 1800},
  {"at": "the title fee, the registration", "item": "Title & registration (G)", "v": 225}, {"at": "Dealer fees: everything else. Dealer prep", "item": "Dealer prep (D)", "v": 495, "x": True},
  {"at": "Doc fee. Electronic filing fee", "item": "Doc fee (D)", "v": 999, "x": True}, {"at": "Etching. Nitrogen. Packages", "item": "Etching (D)", "v": 299, "x": True}],
  xAt="Then you add up the", totalAt="That number, my friend")
O("a retired pharmacist from Coral Gables", "lower", 5.0, name="MRS. INES CARBALLO", l2="RETIRED PHARMACIST · CORAL GABLES")
O("this is my gift to you", "quote", 6.5, text="Mr. Valdés, this is my gift to you. $2,100. I am not feeling generous today.", who="MRS. CARBALLO, 2009")
# ---- la ley
O("a federal court threw it out", "big", 4.5, text="CARS RULE: THROWN OUT", sub="federal court · January 2025", size=130)
O("The federal cooling-off rule does not cover cars", "big", 4.5, text="NO 3-DAY COOLING-OFF", sub="for cars bought at a dealership", size=130)
# ---- #7 rate markup
B("Number seven. The rate markup", "bk", "zoom")
O("Number seven. The rate markup", "q", 6.0, n=7, q="THE RATE MARKUP", label="FEE", stamp="THE ONE NOBODY SEES")
EV("drawer", "That's called the buy rate", 8.0)
O("Let me give you the numbers", "loan", 20.0, la={"name": "BUY RATE", "pay": 579, "months": 60, "apr": "5.9%"},
  lb={"name": "WHAT I WROTE", "pay": 607, "months": 60, "apr": "7.9%"}, totAt="Doesn't sound like much, right", diffAt="For nothing. For me typing", head="$30,000 FINANCED · 60 MONTHS")
O("Mr. Ernesto Lugo, from Hialeah", "lower", 5.5, name="ERNESTO LUGO, 68", l2="RETIRED ELECTRICIAN · HIALEAH · CREDIT 780")
O("And he said, Thank you, Hector", "quote", 4.5, text="Thank you, Hector, that's a good rate.", who="MR. LUGO, 2008", rev=True)
O("What's the buy rate the bank approved me at", "say", 5.0, text="What's the buy rate the bank approved me at?")
O("Beat this rate, or I'll use my credit union", "say", 5.0, text="Beat this rate, or I'll use my credit union.")
# ---- recap
O("dealer prep. The factory already pays it", "check", 26.0, head="THE 7 FEES · CROSS THEM OUT", w=1100, rows=[
  {"at": "dealer prep. The factory already pays it", "tx": "Dealer prep", "no": True}, {"at": "the second sticker, the market adjustment", "tx": "The second sticker", "no": True},
  {"at": "VIN etching. A", "tx": "VIN etching", "no": True}, {"at": "nitrogen. The air is already", "tx": "Nitrogen", "no": True},
  {"at": "the appearance package, paint, fabric", "tx": "Appearance package", "no": True}, {"at": "the doc fee. They might not remove it", "tx": "Doc fee → off the price"},
  {"at": "the rate markup. Ask for the buy rate", "tx": "Rate markup → ask for the buy rate"}])
O("What's my out-the-door price, in writing", "say", 5.5, head="THE ONE SENTENCE", text="What's my out-the-door price, in writing?")
# ---- Ruiz
O("I paid it because you were a young Cuban boy", "quote", 7.0, text="I paid it because you were a young Cuban boy and I wanted you to eat.", who="MR. TEODORO RUIZ", rev=True)
B("Next time, I'm gonna tell you about something", "w:lot", "portal")
O("If this helped you, subscribe", "end", 14.0, q="Which of these 7 fees did they put on your last car?", next="Never Tell a Car Dealer Your Age – Former Salesman Explains",
  qAt="which of these seven fees", nAt="I'll tell you if it's true", until="I'll see you in the next one")

# CTA guía (The Other Side of the Desk): libro 3D + página real del PDF + QR, sin URL en pantalla
O("can I actually cross out with a pen", "guia", 8.5, pag="lapiz_rojo")
O("The price of the car is the price you agreed to", "guia", 8.5, pag="market_adjustment")

# ======================= ARMADO (igual para todos los videos) =======================
BEATS.sort(key=lambda b: b["a"])
used = set()
for b in BEATS:
    if b["base"].startswith("img:"):
        i = b["base"][4:]
        if i in used or not (os.path.exists(PUB + "i_" + i + ".jpg") or i in CLN): b["base"] = "skip"
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
clips = sorted(CLN)
reel = os.path.exists(REEL)
dur_of = lambda f: float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).decode())
rl = dur_of(REEL) if reel else 0
json.dump(segs, open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "clips": clips, "clipLen": {c: round(CLN[c], 2) for c in clips}, "rate": {c: RATE[c] for c in clips if c in RATE}, "off": OFF, "src": SRC, "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
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
