# eneh01 · "The $1,700 repair that doesn't exist" · planos, piezas, eventos del sótano y foley, anclados a la voz (lo ejecuta plan.py)
# Todo entra a una COLA y se ejecuta ordenado por la posición de la frase en el guion (así el cursor de at() siempre avanza).
# Fotos de Enzo (fotos_cara.json) y clips LTX (pedidos) se anclan solos a su frase; a mano: mundo, eventos, piezas y sonido.
FO, DE, VS = "D:/Proyectos/sfx_pro/foley/", "D:/Proyectos/sfx_pro/design/", "C:/Users/bauti/Downloads/video2/public/sfx/"
MX, KN = "D:/rtmp/sfxlib/mixkit/", "D:/rtmp/sfxlib/kenney/kenney_impact-sounds/Audio/"
SWELL, HIT, STAMP, WHOOSH, WSOFT = DE + "swell_suspense.flac", DE + "impact_drum_subtle.flac", DE + "stamp_rubber.flac", DE + "whoosh_slow_sweep.flac", DE + "whoosh_sweep_small.flac"
PEN, PENC, PAPER, CRINK, TICK, CLICK, POP = DE + "pen_write.flac", DE + "pencil_paper.flac", DE + "paper_slide.flac", FO + "paper_crinkle.flac", DE + "tick_clock_close.flac", DE + "click_interface.flac", DE + "pop_soap_bubble.flac"
WIND, FIRE, SWITCH, PHONE, PHONE2, COINS, HUM, ZAP, CAR, CAR2, DOOR, WATER, CREAK = (MX + "wind/1153.mp3", MX + "fire/1330.mp3", MX + "switch/1891.mp3", MX + "phone-ring/2344.mp3", MX + "phone-ring/2976.mp3",
    MX + "coins/1936.mp3", MX + "hum/1553.mp3", MX + "electricity/2967.mp3", MX + "car/1535.mp3", MX + "car/1536.mp3", MX + "doors/109.mp3", MX + "water/1178.mp3", MX + "creaking-floorboard/176.mp3")
POUR, STIR, SCRUB, KEYS, LIGHT, DRAIN, BUCKET, METAL = MX + "pour/3140.mp3", FO + "stir_coffee.flac", FO + "scrub_pad.flac", FO + "keys_jingle.flac", FO + "light_pull_switch.flac", FO + "washer_drain_water.flac", FO + "bucket_pour.flac", KN + "impactMetal_light_000.ogg"
STEP = [KN + f"footstep_wood_00{i}.ogg" for i in range(3)]
SNOW = [KN + f"footstep_snow_00{i}.ogg" for i in range(3)]

# ---------------- cola ordenada por el guion ----------------
_GW = [norm(x) for x in open(f"D:/rtmp_{SL}/guion.txt", encoding="utf8").read().split() if norm(x)]
_GS = " " + " ".join(_GW) + " "
def _pos(ph):
    q = " " + " ".join(norm(x) for x in ph.split() if norm(x)) + " "
    i = _GS.find(q)
    if i < 0: print("  ? frase que no está en el guion:", ph); return 10 ** 9
    return _GS[:i].count(" ")
_Q = []
_fB, _fO, _fEV, _fKF, _fBL, _fSFX = B, O, EV, KF, BL, SFX
def _q(f, ph, a, k): _Q.append((_pos(ph), k.get("d", 0.0), len(_Q), f, ph, a, k))
def B(ph, *a, **k): _q(_fB, ph, a, k)
def O(ph, *a, **k): _q(_fO, ph, a, k)
def EV(ph_key, ph, *a, **k): _q(lambda p, *x, **y: _fEV(ph_key, p, *x, **y), ph, a, k)
def KF(key, ph, *a, **k): _q(lambda p, *x, **y: _fKF(key, p, *x, **y), ph, a, k)
def BL(ph, *a, **k): _q(_fBL, ph, a, k)
def SFX(ph, *a, **k): _q(_fSFX, ph, a, k)
def EV2(key, ph, ph2):
    """evento del mundo desde una frase hasta otra (la 2ª se busca sin mover el cursor)"""
    def f(p):
        global cur
        a = at(p)
        if a is None: return
        c = cur; b = at(ph2); cur = c
        if b is not None and b > a: EVR.setdefault(key, []).append([a, b])
    _q(f, ph, (), {})
def STEPS(ph, n=3, gap=0.45):
    for i in range(n): SFX(ph, STEP[i % 3], -22, d=i * gap)

# ---------------- fotos de Enzo y clips LTX: cada uno a su frase ----------------
FOTO_FR = {"f08": "she watched me sit at somebody's kitchen table", "f24": "One: Show me. With a picture", "f35": "a sticker tells you what every blink means",
           "f13": "I turn the thermostat up and I watch", "f36": "Dolores calls me, and this time", "f33": "Enzo. Shut up. Listen"}
for it in json.load(open(f"D:/rtmp_{SL}/fotos_cara.json", encoding="utf8")):
    k = it["name"].split("_")[1]
    B(FOTO_FR.get(k, it["frase"]), "img:" + k, None, alt="w:wide")
LTX_ALT = {"l01": "w:outside", "l04": "w:sensor", "l08": "w:van", "l09": "w:stairs", "l10": "w:thermos", "l11": "w:napkin", "l14": "w:thermos", "l16": "w:furn",
           "l17": "w:ign", "l18": "w:burner", "l19": "w:burner", "l21": "w:sensor", "l22": "w:duct", "l24": "w:hx", "l25": "w:house", "l28": "w:stairs", "l29": "w:van",
           "l38": "w:led", "l39": "w:filter", "l41": "w:pump", "l42": "w:pump", "l46": "w:books", "l47": "w:sw", "l53": "w:cigar", "l55": "w:vanside",
           "l56": "w:thermo", "l57": "w:window", "l58": "w:house"}
_cyc = ["w:doll", "w:wide", "w:outside", "w:house", "w:bench", "w:duct"]
for j, it in enumerate(json.load(open(f"D:/rtmp/enzo/ltx/{SL}_pedidos.json", encoding="utf8"))):
    B(it["frase"], "img:" + it["id"], "cut", alt=LTX_ALT.get(it["id"], _cyc[j % len(_cyc)]))

# ======================= GANCHO (0-60 s) =======================
KF("night", "January twenty-fourth, 2022", 1); KF("snow", "January twenty-fourth, 2022", 0.95); KF("tnow", "January twenty-fourth, 2022", 52); KF("tset", "January twenty-fourth, 2022", 68)
B("January twenty-fourth, 2022", "w:outside", "fade")
SFX("January twenty-fourth, 2022", WIND, -24)
O("Nine below zero outside", "thermo", 4.2, from_=20, to=-9, label="JAN 24, 2022 · CHICAGO", x=1500, y=520)
O("You're seventy-eight years old", "tag", 3.2, x=1420, y=300, text="78 YEARS OLD", sub="kitchen table · in her coat")
O("Seventeen hundred dollars. Today", "money", 3.6, from_=0, to=1740, label="THE QUOTE · TONIGHT", col="#ff5a4e", x=1450, y=330, size=130)
SFX("Seventeen hundred dollars. Today", COINS, -27)
O("He calls you young lady", "tag", 3.0, x=1060, y=400, text="\"YOUNG LADY\"", sub="very nice. very fast.")
O("He's already got the paper on a clipboard", "inv", 6.4, rows=[{"at": "He's already got the paper on a clipboard", "item": "Replace integrated control board", "v": 640},
  {"at": "He's already got the paper on a clipboard", "item": "Replace inducer assembly", "v": 780}, {"at": "and there's a line at the bottom", "item": "Labor, emergency rate", "v": 320}],
  totalAt="there's a line at the bottom for your name", sign=True)
SFX("He's already got the paper on a clipboard", PAPER, -24); SFX("there's a line at the bottom for your name", PEN, -24)
B("I'm gonna tell you what was really wrong", "w:sensor", "portal"); EV("dirty", "I'm gonna tell you what was really wrong", 9)
O("It was a dirty little metal stick", "tag", 3.4, pt="sensor", text="THE FLAME SENSOR", sub="the size of a toothpick")
O("I fixed it in two minutes", "timer", 3.2, label="2 MINUTES", sub="WITH A DOLLAR BILL", x=1300, y=300)
O("It doesn't exist. It never existed", "stamp", 2.8, text="DOESN'T EXIST", col="#ff5a4e", rot=-8)
SFX("It doesn't exist. It never existed", STAMP, -20)
O("Today I'm gonna show you ten of those", "big", 3.2, text="10", sub="REPAIRS THEY SELL TO PEOPLE LIKE YOU", x=1150, y=420)
SFX("Today I'm gonna show you ten of those", WSOFT, -27)
O("every widow on Harlem Avenue", "map", 4.0, pins=[{"at": "every widow on Harlem Avenue", "k": "HARLEM AVE", "sub": "EVERY WIDOW"}])
O("the last one is a question", "big", 3.0, text="?", sub="ONE QUESTION · NOBODY ASKS IT", x=1150, y=420, col="#ffb257")
SFX("And the last one, the last one is a question", SWELL, -28)
SFX("And it stops the whole thing cold", HIT, -21)
B("And it stops the whole thing cold", "w:doll", "portal")
O("My name is Enzo Russo", "lower", 5.0, name="ENZO RUSSO", l2="45 WINTERS IN CHICAGO BASEMENTS")
O("we lived on top of a bakery on Grand Avenue", "map", 13.0, pins=[{"at": "we lived on top of a bakery on Grand Avenue", "k": "GRAND AVE", "sub": "1971 · THE BAKERY"},
  {"at": "an old Polish man in Avondale", "k": "AVONDALE", "sub": "1979 · WALT"}, {"at": "Harlem Avenue in Elmwood Park", "k": "ELMWOOD PARK", "sub": "1986 · THE SHOP"}])
O("an old Polish man in Avondale named Walt Kaminski", "person", 3.6, name="WALT KAMINSKI", l2="AVONDALE · 1979 · MY TEACHER")
O("Forty-five winters", "big", 3.0, text="45", sub="WINTERS IN BASEMENTS", x=1150, y=420)
SFX("grab a coffee", POUR, -24); SFX("she makes it so strong the spoon stands up", STIR, -24)
B("And let's go down to the basement", "w:stairs", "portal"); EV("lamp", "And let's go down to the basement", 30)
SFX("And let's go down to the basement", LIGHT, -22); STEPS("And let's go down to the basement", 3)

# ---------------- CTA 1 (min ~1-2): las servilletas de Rosa ----------------
B("My wife Rosa, she does the books", "w:bench", "cut")
EV("napkin", "write the same twelve things on a napkin", 14); SFX("write the same twelve things on a napkin", PENC, -24)
B("What to ask on the phone", "w:napkin", "cut")
O("What to ask on the phone", "chips", 5.2, items=["WHAT TO ASK ON THE PHONE", "WHAT A PART REALLY COSTS", "WHAT TO SAY TO \"TODAY\""], y=900)
SFX("Napkins, receipts, the back of a church bulletin", CRINK, -24)
O("you're gonna die and all of this goes in the garbage", "tag", 3.2, x=1060, y=400, text="\"SIT DOWN.\"", sub="— Rosa")
B("So I sat down. And we put it all in one place", "w:books", "portal"); EV("books", "So I sat down. And we put it all in one place", 12)
O("It's in the first line of the description, if you want it", "qr", 6.5, page="guia", name="DON'T BUY THAT FURNACE", pg="3 BOOKS · 311 PAGES")
SFX("It's in the first line of the description, if you want it", PAPER, -25)
B("Now, the furnace", "w:furn", "portal")

# ======================= 1 · EL SENSOR DE DOS MINUTOS =======================
O("Number one. The two-minute sensor", "step", 3.6, n="1", tx="THE TWO-MINUTE SENSOR"); SFX("Number one. The two-minute sensor", WHOOSH, -25)
O("her name is Irene Sobczak", "person", 3.8, name="IRENE SOBCZAK", l2="78 · WIDOW · HARWOOD HEIGHTS")
O("a little brick bungalow in Harwood Heights", "map", 4.6, pins=[{"at": "a little brick bungalow in Harwood Heights", "k": "HARWOOD HEIGHTS", "sub": "JANUARY · IRENE"}])
B("Her husband Stan worked thirty-one years", "w:house", "cut")
O("he kept that basement so clean", "tag", 3.0, x=1060, y=400, text="STAN", sub="31 years at the plant · spotless basement")
B("Every neighborhood in Chicago has a Dolores", "w:house", "swipeL")
O("Dolores Santangelo, two houses down from Irene", "person", 4.2, name="DOLORES SANTANGELO", l2="83 · TWO HOUSES DOWN · KNOWS EVERYTHING")
O("Who got a new car. Whose son is in trouble", "chips", 4.0, items=["WHO GOT A NEW CAR", "WHOSE SON IS IN TROUBLE"], y=900)
SFX("Dolores calls my house", PHONE, -25)
O("Seven-thirty at night", "clock", 3.0, x=1250, label="7:30 PM")
O("there's a van at Irene's for an hour and a half", "tag", 3.4, x=1060, y=400, text="\"A VAN AT IRENE'S\"", sub="1 hour and a half · Irene's crying")
SFX("So I put my boots on", CREAK, -26)
SFX("Rosa puts coffee in the thermos", POUR, -25)
SFX("The salt on Lawrence is so thick", CAR, -28)
B("The young man was gone by then", "w:outside", "cut")
O("He left the paper on the table", "inv", 7.5, rows=[{"at": "Replace integrated control board", "item": "Replace integrated control board", "v": 640},
  {"at": "Replace inducer assembly", "item": "Replace inducer assembly", "v": 780}, {"at": "Labor, emergency rate", "item": "Labor, emergency rate", "v": 320}],
  totalAt="Labor, emergency rate", sign=True)
SFX("He left the paper on the table", PAPER, -24)
O("you don't sign nothing at night", "stamp", 2.8, text="DON'T SIGN NOTHING AT NIGHT", size=70, col="#ffb257", rot=-6)
SFX("you don't sign nothing at night", STAMP, -22)
STEPS("I go down to the basement", 3)
O("The furnace is a nineteen-ninety-something", "tag", 3.4, pt="furn", text="80% GAS FURNACE", sub="1990s · a good simple machine")
KF("tset", "I turn the thermostat up and I watch", 72)
B("The little fan on the side starts", "w:ind", "portal"); EV2("ind", "The little fan on the side starts", "Now, here is what the young man saw")
O("The little fan on the side starts", "tag", 3.2, pt="ind", text="THE INDUCER", sub="pulls the exhaust out")
SFX("The little fan on the side starts", HUM, -27)
EV("ign", "and the igniter glows orange", 3.2); SFX("Then you hear a click", SWITCH, -24)
O("and the igniter glows orange", "tag", 3.0, pt="ign", text="IGNITER", sub="glows orange")
B("Then, whoosh, the burners light", "w:burner", "cut"); EV("flame", "Then, whoosh, the burners light", 5.2); SFX("Then, whoosh, the burners light", FIRE, -22)
SFX("the flame goes out. Click", SWITCH, -25)
EV("ign", "It tries again. Lights, goes out", 1.6); EV("flame", "It tries again. Lights, goes out", 2.2, d=0.9)
B("the little light on the board starts blinking", "w:led", "cut"); BL("the little light on the board starts blinking", 3, 7)
B("Now, here is what the young man saw", "w:furn", "cut")
O("And here is what he wrote: control board and inducer", "chips", 4.4, items=["CONTROL BOARD", "INDUCER", "$1,700"], y=900)
B("There is a little metal rod that sits right in the flame", "w:sensor", "portal")
EV2("flame", "There is a little metal rod that sits right in the flame", "The furnace is not broken")
EV("sensor", "There is a little metal rod that sits right in the flame", 6)
O("The flame sensor. It's like a toothpick made of steel", "tag", 3.6, pt="sensor", text="FLAME SENSOR", sub="steel rod · white porcelain")
SFX("It does that with a tiny electrical current", ZAP, -32)
EV2("dirty", "that rod gets a coat on it", "Thirty seconds. I put it back")
O("And the coat is like a raincoat", "tag", 3.4, pt="sensor", text="THE COAT", sub="the current can't get through", col="#ff9f43")
O("The furnace is not broken. The furnace is being careful", "stamp", 3.0, text="NOT BROKEN. CAREFUL.", col="#3ecf8e", size=80, rot=-5)
SFX("The furnace is not broken. The furnace is being careful", HIT, -21)
B("I turn the power off with the switch", "w:sw", "portal"); EV2("sw", "I turn the power off with the switch", "power on, thermostat up")
SFX("I turn the power off with the switch", SWITCH, -22)
EV2("panel", "I take out one screw", "power on, thermostat up"); SFX("I take out one screw", METAL, -24)
B("I pull the sensor out", "w:sensor", "cut")
O("Some guys use a fine scrub pad", "chips", 4.6, items=["DOLLAR BILL ✓", "FINE GREEN PAD ✓", "SANDPAPER ✗", "A FILE ✗"], y=900)
SFX("and I rub the rod", SCRUB, -24)
O("Thirty seconds. I put it back", "timer", 2.6, label="30 SECONDS", x=1300, y=300)
SFX("power on, thermostat up", SWITCH, -24)
B("Inducer. Click. Orange glow. Whoosh", "w:burner", "portal"); EV("ind", "Inducer. Click. Orange glow. Whoosh", 30); EV("ign", "Click. Orange glow", 2.4)
EV("flame", "Whoosh. And the flame stays", 120); SFX("Whoosh. And the flame stays", FIRE, -22)
B("And stays. And then the big fan comes on", "w:duct", "cut"); EV("heat", "And then the big fan comes on", 16); SFX("And then the big fan comes on", DE + "whoosh_air.flac", -25)
O("Two minutes. And if the porcelain is cracked", "inv", 8.5, rows=[{"at": "Two minutes. And if the porcelain", "item": "Replace integrated control board", "v": 640, "xAt": "Two minutes. And if the porcelain"},
  {"at": "Two minutes. And if the porcelain", "item": "Replace inducer assembly", "v": 780, "xAt": "And if the porcelain is cracked"},
  {"at": "Two minutes. And if the porcelain", "item": "Labor, emergency rate", "v": 320, "xAt": "A new sensor is about eighteen dollars"},
  {"at": "A new sensor is about eighteen dollars", "item": "Cleaned the sensor with a dollar bill", "v": 0, "fix": True}], totalAt="at the supply house on Harlem. Eighteen")
SFX("Two minutes. And if the porcelain is cracked", PEN, -23)
SFX("I said, Irene, make me a coffee and we're even", DE + "ding_oven.flac", -30)
KF("snow", "guess who is standing on the sidewalk", 1.0); SFX("guess who is standing on the sidewalk", SNOW[0], -22); SFX("guess who is standing on the sidewalk", SNOW[1], -22, d=0.5)
O("Dolores. So? What was it", "tag", 3.2, x=1060, y=400, text="\"SO? WHAT WAS IT?\"", sub="Dolores · nine below · housecoat")
B("Now, why did the young man write seventeen hundred", "w:wide", "portal")
SFX("from a phone call with my own son", SWELL, -29)

# ======================= 2 · LA GRIETA QUE NADIE MUESTRA =======================
O("Number two. The crack nobody can show you", "step", 3.6, n="2", tx="THE CRACK NOBODY CAN SHOW YOU"); SFX("Number two. The crack nobody can show you", WHOOSH, -25)
O("This is the one that sells more furnaces in this city", "stamp", 3.0, text="\"IT'S CRACKED.\"", col="#ff5a4e", size=90, rot=-7)
SFX("Ma'am, your heat exchanger is cracked", STAMP, -22)
O("Tony Ferraro, the young technician, twenty-six", "person", 3.6, name="TONY FERRARO", l2="26 · THE NEW TECH · I'M TEACHING HIM")
B("Inside the furnace, the fire burns inside a metal box", "w:hx", "portal"); EV2("panel", "Inside the furnace, the fire burns inside a metal box", "if that metal really cracks")
EV2("flame", "Inside the furnace, the fire burns inside a metal box", "that's the heat exchanger")
EV("heat", "The air for your house goes around the outside", 10)
O("That metal wall between the fire and your air", "tag", 3.6, pt="hx", text="HEAT EXCHANGER", sub="fire inside · your air outside")
B("Now, if that metal really cracks, it's serious", "w:crack", "portal"); EV("crack", "Now, if that metal really cracks, it's serious", 9)
SFX("Now, if that metal really cracks, it's serious", METAL, -24)
O("Carbon monoxide. You can't smell it", "chips", 4.2, items=["CARBON MONOXIDE", "CAN'T SMELL IT", "CAN'T SEE IT"], y=900)
O("puts a red tag on your furnace", "stamp", 3.0, text="RED TAG = DON'T RUN IT", col="#ff5a4e", size=76, rot=-6)
O("you go outside and you call 911", "big", 3.6, text="911", sub="GO OUTSIDE FIRST · THEN CALL", col="#ff5a4e", x=1150, y=420)
SFX("you go outside and you call 911", DE + "alarm_short.flac", -28)
SFX("is also the most powerful sentence in my whole business", SWELL, -29)
O("And the man knows that the moment he says carbon monoxide", "tag", 3.4, x=1060, y=400, text="\"CARBON MONOXIDE\"", sub="...and you stop asking the price")
O("Let me tell you about Helen Dombrowski", "person", 3.8, name="HELEN DOMBROWSKI", l2="81 · WIDOW · NORRIDGE")
O("She lives in Norridge", "map", 4.4, pins=[{"at": "She lives in Norridge", "k": "NORRIDGE", "sub": "HELEN · SINCE 1987"}])
O("They bought that furnace in 1987", "big", 3.2, text="1987", sub="I PUT IT IN MYSELF", x=1150, y=420)
B("still runs like a Swiss watch", "w:burner", "cut")
O("Free safety inspection for seniors", "stamp", 2.8, text="\"FREE\"", col="#ffb257", size=110, rot=-8)
O("he's in the basement eleven minutes", "timer", 3.4, label="11 MINUTES", sub="HELEN TIMED IT", x=1300, y=300); SFX("he's in the basement eleven minutes", TICK, -26)
O("Seven thousand eight hundred dollars", "money", 3.4, from_=0, to=7800, label="NEW FURNACE · BY THURSDAY", col="#ff5a4e", x=1450, y=330, size=130)
SFX("Seven thousand eight hundred dollars", COINS, -26)
O("Helen has a son-in-law. Gary", "person", 3.8, name="GARY", l2="SON-IN-LAW · SCHAUMBURG")
O("Married to her daughter Karen, they live in Schaumburg", "map", 3.8, pins=[{"at": "they live in Schaumburg", "k": "SCHAUMBURG", "sub": "GARY & KAREN"}])
O("Why is Gary at the house on a Tuesday afternoon", "tag", 3.2, x=1060, y=400, text="TUESDAY AFTERNOON?", sub="good question")
SFX("the house was too much for her", SWELL, -29)
O("Nine thousand four hundred. Eleven thousand two hundred", "money", 4.4, from_=7800, to=11200, label="3 COMPANIES · 3 PRICES", col="#ff5a4e", x=1450, y=330, size=130)
O("You need a special camera to see it", "tag", 3.2, x=1060, y=400, text="\"A SPECIAL CAMERA\"", sub="...in the other truck")
B("He said it was in the other truck", "w:vanside", "cut"); EV("vdoor", "He said it was in the other truck", 4); SFX("He said it was in the other truck", DOOR, -25)
B("So here's what you do", "w:crack", "portal")
O("One: Show me. With a picture", "tag", 4.4, x=1060, y=380, text="1 · \"SHOW ME.\"", sub="a picture, a video, a camera on a wire")
O("Two: What's the carbon monoxide reading", "tag", 4.6, x=1060, y=380, text="2 · \"WHAT'S THE CO READING?\"", sub="vents and exhaust · the meter is in his pocket")
O("Three: Write it down", "tag", 4.6, x=1060, y=380, text="3 · \"WRITE IT DOWN.\"", sub="unsafe · your name · your license number")
SFX("Three: Write it down", PEN, -23)
O("And then you call the gas company", "tag", 4.0, x=1060, y=400, text="THE GAS COMPANY", sub="free 2nd look · they don't sell furnaces")
SFX("We'll come back to that at the end", SWELL, -29)

# ======================= 3 · EL CAPACITOR DE DOCE DÓLARES =======================
KF("night", "Summer now", 0); KF("snow", "Summer now", 0)
O("Number three. The twelve-dollar capacitor", "step", 3.6, n="3", tx="THE $12 CAPACITOR"); SFX("Number three. The twelve-dollar capacitor", WHOOSH, -25)
O("July, ninety-five degrees, wet heat", "thermo", 3.8, from_=70, to=95, label="JULY · WET HEAT", x=1500, y=520)
SFX("Your air conditioner is humming outside", MX + "hum/1597.mp3", -26)
B("Your air conditioner is humming outside", "w:outside", "cut")
O("A capacitor is a little metal can", "tag", 3.4, x=1060, y=400, text="CAPACITOR", sub="a can the size of a tuna can")
O("A good one at the supply house, I paid", "money", 3.4, from_=0, to=11.72, dec=2, label="THE PART · WITH TAX", col="#3ecf8e", x=1450, y=330, size=130)
O("he's on a call alone in Belmont-Cragin", "map", 4.0, pins=[{"at": "he's on a call alone in Belmont-Cragin", "k": "BELMONT-CRAGIN", "sub": "JULY 2023 · TONY ALONE"}])
O("On the side of the capacitor it says thirty-five", "big", 2.8, text="35", sub="ON THE LABEL", x=1150, y=420)
O("And Tony's meter says thirty-three", "big", 2.8, text="33", sub="ON TONY'S METER", col="#ffb257", x=1150, y=420)
SFX("Tony calls me, all excited", PHONE2, -26)
O("Should I quote them a compressor", "tag", 3.0, x=1060, y=400, text="\"QUOTE A COMPRESSOR?\"", sub="my stomach turned")
O("A compressor, my friend, is twenty-eight hundred dollars", "money", 3.6, from_=0, to=2800, label="A COMPRESSOR · MINIMUM", col="#ff5a4e", x=1450, y=330, size=130)
O("Plus or minus six percent", "big", 3.6, text="±6%", sub="35 − 2 = 33 → PERFECTLY FINE", col="#3ecf8e", x=1150, y=420)
O("That capacitor was healthy", "stamp", 2.6, text="HEALTHY", col="#3ecf8e", size=100, rot=-6); SFX("That capacitor was healthy", HIT, -21)
O("The real problem was a burned wire on the contactor", "money", 4.2, from_=2800, to=20, label="THE REAL PROBLEM · A $20 PART", col="#3ecf8e", x=1450, y=330, size=130)
SFX("Sometimes it's a kid who learned from a crook", SWELL, -29)
O("Weak compared to what", "tag", 3.2, x=1060, y=400, text="\"WEAK COMPARED TO WHAT?\"", sub="meter reading vs. the label")
O("somewhere between one hundred fifty and three hundred dollars", "chips", 5.0, items=["FAIR: $150 – $300 INSTALLED", "$500 – $600 = THEY CHARGE FOR THE HEAT"], y=900)
O("don't open that panel yourself", "stamp", 3.0, text="DON'T OPEN THE PANEL", col="#ff5a4e", size=80, rot=-6)
SFX("A capacitor holds a charge even with the power off", ZAP, -28)

# ======================= 4 · EL GAS QUE "SE ACABA" =======================
O("Number four. The freon that runs out", "step", 3.6, n="4", tx="THE FREON THAT \"RUNS OUT\""); SFX("Number four. The freon that runs out", WHOOSH, -25)
O("Father Mike is the priest at St. Rosalie", "person", 3.6, name="FATHER MIKE", l2="ST. ROSALIE · HARWOOD HEIGHTS")
O("over in Harwood Heights. Good man", "map", 3.6, pins=[{"at": "over in Harwood Heights. Good man", "k": "ST. ROSALIE", "sub": "THE RECTORY · A/C FROM 2006"}])
SFX("over in Harwood Heights. Good man", MX + "church-bell/370.mp3", -30)
O("And the bill was three hundred, four hundred, three hundred eighty", "money", 4.0, from_=0, to=380, label="EVERY JUNE · \"TOPPED IT OFF\"", col="#ff5a4e", x=1450, y=330, size=130)
O("drinks freon like my uncle drank", "tag", 3.2, x=1060, y=400, text="\"IS IT NORMAL?\"", sub="Father Mike, after Mass")
O("The freon, the refrigerant", "stamp", 3.0, text="IT DOESN'T GET USED UP", col="#ffb257", size=70, rot=-5)
O("If it's low, it's because there's a leak", "big", 3.0, text="LOW = LEAK", sub="A CLOSED LOOP · 20-30 YEARS", x=1150, y=420)
SFX("Soap bubbles on the fittings", POP, -24); SFX("Soap bubbles on the fittings", POP, -26, d=0.7); SFX("Soap bubbles on the fittings", POP, -25, d=1.5)
O("A valve core. Six dollars", "money", 3.0, from_=0, to=6, label="THE VALVE CORE", col="#3ecf8e", x=1450, y=330, size=140); SFX("A valve core. Six dollars", HIT, -21)
O("eleven hundred dollars of freon went out", "money", 3.6, from_=0, to=1100, label="3 SUMMERS · INTO THE SKY", col="#ff5a4e", x=1450, y=330, size=130)
O("Then find me the little", "tag", 3.2, x=1060, y=400, text="\"THEN FIND ME THE LITTLE.\"", sub="if it's low, where's the leak?")

# ======================= 5 · LA LUZ QUE HABLA =======================
KF("night", "Number five. The light that talks", 1); KF("snow", "Number five. The light that talks", 0.6)
O("Number five. The light that talks", "step", 3.6, n="5", tx="THE LIGHT THAT TALKS"); SFX("Number five. The light that talks", WHOOSH, -25)
B("hands like baseball gloves, little cigars", "w:cigar", "cut")
O("Walt came from Poland after the war", "person", 3.6, name="WALT KAMINSKI", l2="FROM POLAND · NEVER, EVER RUSHED")
O("He says, Enzo. Shut up. Listen", "tag", 3.4, x=1060, y=400, text="\"SHUT UP. LISTEN.\"", sub="Walt, January 1979")
SFX("Walt heard a little click that didn't go all the way", SWITCH, -27)
O("The furnace always tells you what's wrong", "stamp", 3.2, text="THE FURNACE TELLS YOU", col="#ffb257", size=70, rot=-5)
B("there's a little window on the lower door", "w:led", "portal")
BL("Two blinks", 2, 2.2); BL("Three blinks", 3, 2.6); BL("Four. And on the inside of the door", 4, 3.2)
O("three blinks is the pressure switch", "blink", 5.6, n=3); BL("three blinks is the pressure switch", 3, 5.6)
B("the pipe outside is blocked with snow or ice", "w:outside", "cut"); KF("snow", "the pipe outside is blocked with snow or ice", 1.0)
O("Four blinks, on a lot of them, is the limit switch", "blink", 5.4, n=4); BL("Four blinks, on a lot of them", 4, 5.4)
B("that's a dirty filter", "w:filter", "portal"); EV("filter", "that's a dirty filter", 6)
O("Seven dollars at the hardware store", "money", 3.0, from_=0, to=7, label="A NEW FILTER", col="#3ecf8e", x=1450, y=330, size=140)
O("so you read YOUR sticker", "tag", 3.2, x=1060, y=400, text="READ YOUR STICKER", sub="every brand is a little different")
SFX("count the blinks, and write it on a piece of paper", PENC, -24)
O("you say, It's blinking three times", "tag", 3.4, x=1060, y=400, text="\"IT'S BLINKING 3 TIMES.\"", sub="now the man knows that you know")
O("You're the lady who reads the light", "stamp", 3.0, text="THE LADY WHO READS THE LIGHT", col="#3ecf8e", size=64, rot=-5)
B("Irene's furnace, by the way, was blinking", "w:led", "cut"); BL("Irene's furnace, by the way, was blinking", 3, 6); SFX("Irene's furnace, by the way, was blinking", SWELL, -28)

# ======================= 6 · LA BOMBA QUE NO ESTABA ROTA =======================
O("Number six. The pump that wasn't broken", "step", 3.6, n="6", tx="THE PUMP THAT WASN'T BROKEN"); SFX("Number six. The pump that wasn't broken", WHOOSH, -25)
O("Because Dolores, the one who knows everything", "tag", 3.0, x=1060, y=400, text="DOLORES", sub="she got hers too")
KF("night", "August 2023", 0); KF("snow", "August 2023", 0)
O("It's ninety-one degrees, she's eighty-three", "thermo", 3.6, from_=72, to=91, label="AUGUST · DOLORES'S HOUSE", x=1500, y=520)
O("she wanted to see if I would be jealous", "tag", 3.0, x=1060, y=400, text="SHE WANTED ME JEALOUS", sub="that's Dolores")
O("It's the condensate pump", "tag", 3.6, pt="pump", text="CONDENSATE PUMP", sub="the water from the A/C")
B("When the air conditioner runs, it makes water", "w:pump", "cut"); SFX("That water drips into a pan", FO + "drip_sink.flac", -26)
O("there's a safety switch, a float", "tag", 3.2, pt="pump", text="SAFETY FLOAT", sub="shuts the A/C off so you don't flood")
O("Nine hundred, and the coil is another two thousand", "money", 3.8, from_=0, to=2900, label="PUMP + SWITCH + COIL", col="#ff5a4e", x=1450, y=330, size=130)
B("I take the little tube off", "w:pump", "portal"); EV("pump", "I take the little tube off", 22)
O("Algae, like in a fish tank", "tag", 3.0, pt="pump", text="ALGAE", sub="the tube was plugged", col="#7bd85a")
O("Nothing was broken. Nothing", "stamp", 2.8, text="NOTHING WAS BROKEN", col="#3ecf8e", size=80, rot=-6); SFX("Nothing was broken. Nothing", HIT, -21)
SFX("and I sucked. Thirty seconds", DRAIN, -25); SFX("A big gulp of green slime comes out", BUCKET, -24)
SFX("I poured a cup of warm water with a little bit of white vinegar", FO + "water_pour_short.flac", -25)
O("Total cost, zero", "money", 3.2, from_=2900, to=0, label="TOTAL COST", col="#3ecf8e", x=1450, y=330, size=140)
B("Dolores told the whole street", "w:house", "cut")
O("wanted nine hundred dollars for slime", "tag", 3.2, x=1060, y=400, text="$900 FOR SLIME", sub="by Sunday, the whole block knew")
O("Is it too late", "tag", 2.8, x=1060, y=400, text="\"IS IT TOO LATE?\"", sub="Ray. Sorry, Ray.")
O("Is anything actually broken, or is it just clogged", "tag", 4.0, x=1060, y=400, text="\"BROKEN, OR JUST CLOGGED?\"", sub="look at his face")

# ---------------- la llamada de Marco ----------------
O("My son Marco is forty-four", "person", 3.6, name="MARCO", l2="44 · MY SON · RUNS THE COMPANY NOW")
SFX("Basta! Both of you", FO + "lid_close_a.flac", -22)
O("He says, Pop, the world changed", "tag", 3.2, x=1060, y=400, text="\"POP, THE WORLD CHANGED.\"", sub="a furnace a day on our street")
O("Fifteen percent of whatever they sell", "big", 3.4, text="15%", sub="COMMISSION · NO SALE, NO PAY", col="#ff5a4e", x=1150, y=420)
SFX("put the numbers on a board", VS + "marker_drive.mp3", -26)
SFX("They offered me a job too", SWELL, -27); SFX("I didn't tell you", HIT, -23)
O("He has a board with his name on it", "stamp", 3.0, text="A BOARD WITH HIS NAME", col="#ffb257", size=70, rot=-5)

# ---------------- CTA 2 (~55 %): los tres libritos ----------------
O("how am I supposed to remember all this", "chips", 4.4, items=["THE STICKER", "THE BLINKS", "THE TOLERANCE", "A FAIR PRICE"], y=900)
SFX("So I wrote it down for him", PENC, -23)
O("Every number. Every question to ask before you sign", "chips", 6.0, items=["EVERY QUESTION BEFORE YOU SIGN", "FIXES CHEAPER THAN A SANDWICH", "EVERY LINE OF THE QUOTE · FAIR PRICE"], y=900)
O("Give it to the widows", "tag", 3.0, x=1060, y=400, text="\"GIVE IT TO THE WIDOWS.\"", sub="— Rosa")
EV("books", "So we made it into three little books", 14); SFX("So we made it into three little books", PAPER, -24)
O("If one page of it saves you one phone call like Irene's", "qr", 7.0, page="guia", name="DON'T BUY THAT FURNACE", pg="NEVER SIGN · $12 FIXES · $40 OFF EVERY MONTH")

# ======================= 7 · LA LLAVE DE LA PARED =======================
O("Number seven. The switch on the wall", "step", 3.6, n="7", tx="THE SWITCH ON THE WALL"); SFX("Number seven. The switch on the wall", WHOOSH, -25)
O("my sister-in-law Angela, in Berwyn", "person", 3.6, name="ANGELA", l2="ROSA'S SISTER · BERWYN")
O("On the side of every furnace", "map", 3.4, pins=[{"at": "On the side of every furnace", "k": "BERWYN", "sub": "DECEMBER 2021 · ANGELA"}])
O("Sometimes it has a red cover plate", "tag", 3.4, pt="sw", text="FURNACE SWITCH", sub="looks just like a light switch")
B("The grandson looking for the basement light, click", "w:sw", "cut"); EV("sw", "The grandson looking for the basement light, click", 2.6)
SFX("The grandson looking for the basement light, click", SWITCH, -23, d=1.6); SFX("she hits it with her hip", SWITCH, -23, d=0.6)
O("a story about a wedding in 1994", "tag", 3.4, x=1060, y=400, text="THE 1994 WEDDING", sub="who sat at which table · don't ask")
SFX("flipped the switch, and the furnace started", SWITCH, -22); SFX("flipped the switch, and the furnace started", FIRE, -24, d=0.8)
O("Two hundred eighty-nine dollars", "money", 3.4, from_=0, to=289, label="FOR FLIPPING A SWITCH", col="#ff5a4e", x=1450, y=330, size=140); SFX("Two hundred eighty-nine dollars", HIT, -22)
O("If you charge for the switch, God charges you later", "stamp", 3.4, text="GOD CHARGES YOU LATER", col="#ffb257", size=70, rot=-5)
O("So before you call anybody, you check four things", "routine", 19, rows=[{"at": "is the thermostat on Heat", "when": "1", "what": "Thermostat on HEAT, set above the room", "ic": "🌡️"},
  {"at": "does the thermostat have a screen", "when": "2", "what": "Blank screen? Two AA batteries", "ic": "🔋"},
  {"at": "Three, the switch on the furnace", "when": "3", "what": "The switch on the furnace", "ic": "💡"},
  {"at": "Four, the breaker in the electric panel", "when": "4", "what": "The breaker for the furnace", "ic": "⚡"}])
O("Rosa found out at Easter", "tag", 3.0, x=1060, y=400, text="A LONG EASTER", sub="Angela kept the $289 secret a year")

# ======================= 8 · "TIENE VEINTE AÑOS" =======================
O("Number eight. It's twenty years old", "step", 3.6, n="8", tx="\"IT'S TWENTY YEARS OLD\""); SFX("Number eight. It's twenty years old", WHOOSH, -25)
O("Ma'am, this unit is twenty years old", "tag", 3.6, x=1060, y=400, text="\"END OF ITS LIFE.\"", sub="any money is thrown away")
O("Age is not a diagnosis", "stamp", 3.0, text="AGE IS NOT A DIAGNOSIS", col="#3ecf8e", size=72, rot=-5); SFX("Age is not a diagnosis", STAMP, -22)
B("is the metal sound, is the motor quiet", "w:burner", "portal"); EV("flame", "is the metal sound, is the motor quiet", 12)
O("is the metal sound, is the motor quiet", "chips", 6.4, items=["METAL SOUND", "MOTOR QUIET", "FLAME CLEAN & BLUE", "NO CO", "PARTS STILL MADE"], y=900)
O("when the board goes, it's six hundred dollars", "money", 3.2, from_=0, to=600, label="NEW BOARD · NEWER FURNACE", col="#ff5a4e", x=1450, y=330, size=130)
O("there's a video coming where I'll give you my real answer", "tag", 3.4, x=1060, y=400, text="COMING SOON", sub="my honest answer on replacing")
O("The salesman's card. She put it on the refrigerator", "tag", 3.4, x=1060, y=400, text="THE SALESMAN'S CARD", sub="on the fridge, next to the grandkids")
SFX("She put it on the refrigerator with a magnet", METAL, -26)
SFX("Oh, Gary's friend from the gym does furnaces", HIT, -21)
SFX("And she doesn't say anything. But she calls me", SWELL, -28)
O("Because Helen's story isn't finished", "tag", 3.0, x=1060, y=400, text="NOT FINISHED", sub="not even close")

# ======================= 9 · LA INSPECCIÓN GRATIS =======================
KF("night", "Number nine. The free inspection", 0.3); KF("snow", "Number nine. The free inspection", 0.2)
O("Number nine. The free inspection", "step", 3.6, n="9", tx="THE FREE INSPECTION"); SFX("Number nine. The free inspection", WHOOSH, -25)
O("we're doing free furnace safety inspections for seniors", "tag", 3.6, x=1060, y=400, text="\"FREE SAFETY INSPECTION\"", sub="for seniors in the neighborhood")
O("The utility company did not send him", "stamp", 3.0, text="NOBODY SENT HIM", col="#ff5a4e", size=84, rot=-6); SFX("The utility company did not send him", STAMP, -22)
O("In Norridge, the fall of 2023", "map", 4.4, pins=[{"at": "In Norridge, the fall of 2023", "k": "NORRIDGE", "sub": "FALL 2023 · DOOR TO DOOR"}])
SFX("She keeps a list on the back of an envelope", CRINK, -24)
O("Seven houses out of eleven", "big", 3.6, text="7 / 11", sub="SAME SENTENCE: \"IT'S CRACKED\"", col="#ff5a4e", x=1150, y=420); SFX("Seven houses out of eleven", HIT, -21)
O("Furnaces don't catch cracks like a cold", "stamp", 3.0, text="CRACKS AREN'T CONTAGIOUS", col="#ffb257", size=70, rot=-5)
O("You never let anybody into your basement who you didn't call first", "stamp", 3.4, text="ONLY WHO YOU CALLED", col="#3ecf8e", size=80, rot=-5)
O("Will a technician come, or a salesman", "tag", 3.4, x=1060, y=400, text="\"TECHNICIAN OR SALESMAN?\"", sub="ask on the phone, before")
O("a man they call a comfort advisor", "chips", 4.6, items=["\"COMFORT ADVISOR\" = SALESMAN", "NO TOOLS", "A TABLET WITH PRICES"], y=900)

# ======================= 10 · LA PREGUNTA =======================
KF("night", "Number ten. The question", 1); KF("snow", "Number ten. The question", 0.8)
O("Number ten. The question", "step", 3.6, n="10", tx="THE QUESTION"); SFX("Number ten. The question", WHOOSH, -25)
SFX("And it's not a part. It's not a tool", SWELL, -28)
O("If it's not safe to run tonight, will you write that down", "fridge", 9.0, text="\"If it's not safe to run tonight, will you write that down, right here, and sign it with your license number?\"")
SFX("If it's not safe to run tonight, will you write that down", PAPER, -24)
SFX("That's it. That's the whole thing", HIT, -21)
O("An honest technician who found a real problem", "tag", 3.6, x=1060, y=400, text="THE HONEST MAN", sub="writes it in two seconds")
O("I'm turning it off, and I'm calling the gas company", "tag", 3.4, x=1060, y=400, text="\"I'M CALLING THE GAS CO.\"", sub="God bless him · listen to him")
O("A license means something. They can lose it", "stamp", 3.0, text="A LICENSE CAN BE LOST", col="#ffb257", size=72, rot=-5)
O("I'm not saying unsafe, I'm saying at risk", "chips", 4.4, items=["\"THAT'S NOT HOW WE DO IT\"", "\"I'M SAYING AT RISK\"", "\"LET ME TALK TO MY MANAGER\""], y=900)
SFX("he went out to his car", DOOR, -24); SFX("And he sat in that car in the snow", WIND, -27)
O("for twenty minutes", "timer", 3.2, label="20 MINUTES", sub="IN THE CAR · IN THE SNOW", x=1300, y=300); SFX("for twenty minutes", TICK, -26)
B("And then the man drove away", "w:outside", "cut"); SFX("And then the man drove away", CAR2, -25)
SFX("He never came back. And Helen's furnace", HIT, -21)
B("It's running right now. Today", "w:burner", "portal"); EV("flame", "It's running right now. Today", 10)
O("put it on your refrigerator, next to the grandkids", "fridge", 7.0, text="\"If it's not safe, will you write it and sign it with your license number?\"")
O("And then call the gas company for a second look", "tag", 3.0, x=1060, y=400, text="2ND LOOK: THE GAS COMPANY", sub="they don't sell furnaces")

# ---------------- final: la caja de habanos de Irene ----------------
SFX("Irene calls my house. Rosa picks up", PHONE, -26)
B("there's a box. An old cigar box", "w:cigar", "portal")
O("Supply air, one twenty-eight", "thermo", 3.6, from_=66, to=128, label="STAN'S NOTEBOOK · SUPPLY AIR", x=1500, y=520)
SFX("He'd write the number in a notebook every year", PENC, -26)
O("Nineteen sixty-eight to two thousand nine", "big", 3.4, text="1968–2009", sub="40 YEARS OF NUMBERS · STAN'S HANDWRITING", x=1150, y=420, size=170)
SFX("Furnace good. Irene will be okay", SWELL, -28)
B("Your furnace is not your enemy", "w:furn", "portal"); EV("flame", "Your furnace is not your enemy", 14); EV("heat", "It's a simple, honest machine", 8)
O("Ten repairs. And most of them", "chips", 6.0, items=["A DOLLAR BILL", "A $7 FILTER", "A $12 PART", "A QUESTION"], y=900)
KF("tset", "the thermostat in the hallway was set on fifty-eight", 58); KF("tnow", "the thermostat in the hallway was set on fifty-eight", 58)
O("Fifty-eight degrees. In January", "thermo", 3.6, from_=68, to=58, label="IRENE'S HALLWAY · 10:30 PM", x=1500, y=520)
O("Stan always said turn it down at night", "tag", 3.2, x=1060, y=400, text="\"TURN IT DOWN AT NIGHT.\"", sub="— Stan")
SFX("That's a different kind of danger", HIT, -23)
B("I sat there, and I didn't say anything", "w:bench", "cut")
B("But Stan was a different age", "w:window", "cut")
B("that's not saving money", "w:thermo", "cut")
B("When I went upstairs to drink the coffee", "w:stairs", "cut")

# ---------------- próximo video + suscribirse + comentarios ----------------
O("Next time, I'm gonna tell you why I never turn the heat down at night", "next", 9.0, title="Why I Never Turn the Heat Down at Night", sub="THE POLAR VORTEX · 23 BELOW · 3 A.M.")
O("Twenty-three below", "thermo", 3.4, from_=10, to=-23, label="JAN 30, 2019 · POLAR VORTEX", x=1500, y=520)
B("What happened to his kitchen", "w:pipe", "portal"); KF("icek", "the night of the polar vortex", 1.0); EV("ice", "the night of the polar vortex", 12)
EV("burst", "What happened to his kitchen", 7); SFX("What happened to his kitchen", WATER, -24)
O("tell me in the comments what the company told you", "comment", 6.5, text="They said my heat exchanger was cracked. $7,800, sign today.")
B("If you want to help me", "w:house", "fade"); KF("snow", "Ciao. Stay warm", 1.0)
O("And don't sign nothing at night", "stamp", 3.6, text="DON'T SIGN NOTHING AT NIGHT", col="#ffb257", size=70, rot=-6); SFX("And don't sign nothing at night", STAMP, -24)

# ---------------- ejecutar la cola en el orden de la voz ----------------
for _p, _d, _n, f, ph, a, k in sorted(_Q, key=lambda x: (x[0], x[1], x[2])):
    f(ph, *a, **k)
# fotos/clips que cayeron dentro de una ventana del avatar → justo al salir; dos fotos pegadas → la 2ª corre 2,2 s
AVR = [(w["ms"], w["me"]) for w in AVW]
for b in BEATS:
    if not b["base"].startswith("img:"): continue
    for ms, me in AVR:
        if ms - 0.3 <= b["a"] < me: b["a"] = round(me + 0.15, 2); break
BEATS.sort(key=lambda b: b["a"])
for i in range(1, len(BEATS)):
    if BEATS[i]["base"].startswith("img:") and BEATS[i]["a"] - BEATS[i - 1]["a"] < 1.6:
        BEATS[i]["a"] = round(BEATS[i - 1]["a"] + 2.2, 2)
