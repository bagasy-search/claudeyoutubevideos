# enrm05 · «6 Rules That Took This Truck Past 300,000 Miles» · plan del video ENTERO escrito A MANO, plano por plano, sobre la
# frase de ese segundo (at() sobre words.json). → segs.json, ov.json, cam.json, ev.json, avail.json, edl.json en src/enrm05 y
# D:/rtmp/enrm05_PLAN_MxM.md. Las ventanas del avatar las manda avwin.json (av_temprano).
# Bases: "img:<id>" foto (si hay clip agnes de esa foto, va el clip) · "ph:<id>" foto quieta · "ltx:<id>|<respaldo>" clip LTX
# · "bk" foto real oscurecida (r5kNN) para las piezas grandes · "fill" el próximo detalle real del taller (r5fNNN). Sin taller 3D.
import json, os, re, subprocess, unicodedata, sys, statistics

sys.stdout.reconfigure(encoding="utf-8")
SL = "enrm05"
R = f"D:/wt/{SL}/"
S = R + f"src/{SL}/"
PUB = R + "public/"
W = [[w, a] for w, a, b in json.load(open(S + "words.json", encoding="utf8"))]
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
WAV = R + f"public/{SL}cut.wav"

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))
TOK = [norm(w) for w, _ in W]
TS = [float(s) for _, s in W]
cur = 0
miss = []

def at(ph, d=0.0):
    """tiempo de la 1ª palabra de la frase, buscando hacia adelante desde el cursor (difuso: ≥75 % de las palabras en orden)."""
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
    for lo, hi in ((cur, min(len(TOK), cur + 700)), (0, len(TOK))):
        for i in range(lo, hi):
            if score(i) >= need:
                if lo == cur: cur = i
                return round(TS[i] + d, 2)
    miss.append(ph)
    return None

END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode())
V = {"wide": ([0, 3.4, 10.5], [0, 1.2, -1.2], 42)}
PTV = {}
BEATS, OVS, EVR, LIFT, ODO, BAD = [], [], {}, [[0, 0]], [[0, 0]], []
_E = lambda k: os.path.exists(f"D:/wt/enrm05/public/enrm05/img/{k}.jpg")
KS = [k for k in (f"r5k{i:02d}" for i in range(1, 17)) if _E(k)]
POOL = [k for k in (f"r5f{i:03d}" for i in range(1, 150)) if _E(k)]
def B(ph, base, tr=None, d=0.0, why="", **kw):
    if base == "bk": base = "bk:" + (KS.pop(0) if KS else "")
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr, ph=ph, why=why, **kw))
def O(ph, k, L, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: OVS.append(dict(k=k, a=a, b=round(a + L, 2), **kw))
def T(ph, t0=0.0):
    global cur
    c = cur; cur = next((i for i, x in enumerate(TS) if x >= t0 - 3), 0); v = at(ph); cur = c; return v
def NB(ph, L, rows, title="F-150 · 2004", d=0.0, **kw):
    """la libreta de Kowalski: renglones a lápiz (date · mi · what · cost) que se escriben en su frase"""
    O(ph, "notebook", L, d, rows=[dict(at=r[0], date=r[1], mi=r[2], what=r[3], **({"cost": r[4]} if len(r) > 4 else {})) for r in rows], title=title, **kw)

# =====================================================================================================================
# 0:00 GANCHO — la entrada de noche, el odómetro, la cuota de $700, la F-150 de 318.000 millas, la libreta verde
# =====================================================================================================================
B("You're sitting in your driveway", "img:r501", "fade", why="Ramón en la caja de la camioneta mirando el odómetro (bajo el avatar)")
B("while it cools", "ltx:r5_tick|r557", "cut", why="la F-150 enfriándose al anochecer")
B("The odometer just rolled past", "ph:r557", "zoom", why="el odómetro pasa las 150.000")
O("The odometer just rolled past", "count", 3.4, from_=149990, to=150000, dur=1.6, suf=" mi", sub="the odometer just rolled", x=1430, y=330, size=120)
B("A new truck", "ltx:r5_payment|r588", "swipeL", why="la camioneta nueva con el precio")
O("A new truck", "chips", 4.4, items=["NEW TRUCK", "$700 / MONTH", "× 72 MONTHS"], y=880)
B("if it's going to leave you on the side of I-10", "ltx:r5_hazards|r558", "cut", why="balizas en la banquina de la I-10")
O("in August with the hazards on", "big", 2.6, text="I-10", sub="August · hazards on", x=1460, y=320, size=150, col="#ffb257")
B("drove into my shop on South Sarzamora", "ltx:r5_pullin|r505", "swipeR", why="la F-150 blanca entra al taller")
O("2004 F-150 with 318,000", "count", 3.6, from_=0, to=318000, dur=1.8, suf=" mi", sub="2004 F-150 · original engine", x=1430, y=330, size=120)
B("It didn't leak on my floor", "ltx:r5_cleanfloor|r559", "cut", why="el piso seco bajo el motor")
B("He handed me an old spiral notebook", "img:r502", "cut", why="Ramón con la libreta verde")
O("Ramon, tell them how we did it", "quote", 3.4, text="Ramón, tell them how we did it.", who="Mr. Kowalski · 318,000 mi", y=560)
B("My name is Ramon Trevino", "img:r503", "zoom", why="Ramón de brazos cruzados en el portón")
O("My name is Ramon Trevino", "lower", 5.0, name="RAMÓN TREVIÑO", l2="Mechanic · 46 years in San Antonio")
B("last 37 in my own shop in the west side", "ltx:r5_westside|r503", "swipeL", why="la calle del West Side a la mañana")
B("today I'm going to give you the six rules", "bk", "zoom", why="la promesa: 6 reglas")
O("today I'm going to give you the six rules", "big", 4.4, text="6 RULES", sub="past 300,000 miles", x=960, y=470, size=200, col="#ffd60a")
B("the heat of South Texas", "img:r565", "cut", why="el cartel del banco con la temperatura")
O("the heat of South Texas", "big", 2.8, text="104°F", sub="South Texas", x=1460, y=320, size=150, col="#ff4a3d")
B("And the sixth rule, the last one, costs about a dollar", "img:r549", "swipeR", why="Ramón con la libreta nueva y la birome atada")
O("costs about a dollar", "big", 3.2, text="$1", sub="rule #6 · almost nobody does it", x=1460, y=320, size=200, col="#3fd17a")
B("Stay for that one", "fill", "cut", why="detalle del taller")
B("luxury car and economy price, the flood car", "fill", "cut", why="el video anterior")
O("luxury car and economy price, the flood car", "chips", 3.4, items=["LAST VIDEO", "5 USED CARS I'D NEVER BUY"], y=880)
B("same question in the comments", "bk", "zoom", why="la pregunta de los comentarios")
O("same question in the comments", "comment", 5.0, text="Okay Ramón, so what do I do with the car I already have?", x=1200, y=600)
B("is how you keep the car you have", "img:r529", "cut", why="Ramón palmea el guardabarros de la F-150")
O("older than your grandkids", "stamp", 2.4, text="KEEP IT", col="#3fd17a", rot=-6, x=1400, y=330)
B("notebook, Mr. Kowalski", "img:r550", "swipeL", why="Kowalski señala una columna de la libreta")
O("He's a veteran", "tag", 3.2, x=700, y=360, text="MR. KOWALSKI", sub="veteran · 76")
B("a little house not far from the base", "ltx:r5_fortsam|r560", "cut", why="la torre del reloj de Fort Sam Houston")
O("a little house not far from the base", "map", 4.6, pins=[{"at": "a little house not far", "l": "fortsam", "tx": "FORT SAM HOUSTON"}], x=1440, y=520, sc=0.7)
B("he bought that f-150 new", "ltx:r5_lot2004|r588", "swipeR", why="la F-150 nueva sale de la concesionaria en 2004")
O("in march of 2004 white the smaller", "chips", 4.0, items=["MARCH 2004", "WHITE", "4.6 V8", "4-SPEED AUTO"], y=880)
B("the same afternoon he went to the drug store on Military Drive", "ltx:r5_drugstore|r561", "cut", why="la farmacia de Military Drive")
O("bought a spiral notebook for", "big", 2.8, text="99¢", sub="a spiral notebook", x=1460, y=320, size=170, col="#ffd60a")
B("he wrote on the first page", "ltx:r5_firstpage|r562", "zoom", why="la primera página")
NB("he wrote on the first page", 6.5, [("March 2004", "MAR 2004", "11 mi", "truck")])
B("21 years and every single time he writes it down", "img:r509", "cut", why="Ramón cuenta renglones con el dedo")
O("Every single time", "stamp", 2.2, text="EVERY SINGLE TIME", col="#ffb257", rot=-5, x=1300, y=820, size=70)
B("Don Chigarza the mechanic who taught me in Monterey", "img:r506", "fade", why="la foto vieja de Don Chuy")
O("Don Chigarza the mechanic who taught me", "tag", 3.4, x=700, y=360, text="DON CHUY GARZA", sub="Monterrey · his teacher")
O("Old age is just when the neglect", "quote", 5.6, text="Cars don't die of old age. They die of neglect.", who="Don Chuy Garza", y=560)
B("Old age is just when the neglect", "ltx:r5_rust|r563", "cut", why="el auto oxidado entre el pasto")
B("me give you the six rules one by one", "fill", "swipeL", why="el taller")

# =====================================================================================================================
# REGLA 1 · EL ACEITE (3:02)
# =====================================================================================================================
O("Yes, everybody knows", "chapter", 4.6, n="1", title="The oil", sub="the severe schedule", kicker="RULE · NUMBER")
B("Yes, everybody knows", "bk", "zoom", why="capítulo 1")
B("changes it on the wrong schedule", "img:r569", "cut", why="la góndola de aceites")
B("Let me show you why", "ltx:r5_manual|r507", "swipeR", why="el manual abierto en la tabla de mantenimiento")
O("One is called normal", "schedules", 12.0, items=[{"at": "Driving in extreme heat", "tx": "EXTREME HEAT"}, {"at": "driving on dusty roads", "tx": "DUSTY ROADS"}], pickAt="And underneath the severe one")
B("One is called normal", "bk", "zoom", why="las dos tablas: NORMAL vs SEVERE")
O("Towing a trailer", "chips", 3.2, items=["SHORT TRIPS", "STOP & GO", "TOWING"], y=880)
B("Towing a trailer", "img:r564", "cut", why="el manual: normal y severe")
B("104 degrees in the summer", "ltx:r5_caliche|r508", "cut", why="el polvo de caliche")
O("104 degrees in the summer", "big", 2.6, text="104°F", sub="every summer", x=1460, y=320, size=150, col="#ff4a3d")
B("Stop and go on loop 410", "ltx:r5_410|r566", "swipeL", why="el Loop 410 a las 5")
B("to the HEB and to church and back", "ltx:r5_shorttrip|fill", "cut", why="el estacionamiento del súper")
B("almost nobody drives normal", "fill", "cut", why="detalle")
O("We all drive severe", "stamp", 2.8, text="WE ALL DRIVE SEVERE", col="#ff4a3d", rot=-5, x=960, y=820, size=84)
B("We all drive severe", "bk", "zoom", why="la revelación")
B("the kitchen table with his glasses", "ltx:r5_kitchen|r504", "cut", why="la mesa de la cocina con el manual")
O("Severe, always", "stamp", 2.4, text="SEVERE · ALWAYS", col="#ffb257", rot=-6, x=1400, y=330)
B("changed the oil every 3,000 miles", "ltx:r5_oilpour|fill", "swipeR", why="el aceite dorado entrando al motor")
NB("Never more. 21 years", 9.0, [("Never more. 21 years", "2004", "3,000", "oil · regular"), ("I counted in his notebook", "2009", "5,000", "oil · full synthetic"), ("more than 80 oil changes", "2025", "80+", "oil changes", "")])
B("Never more. 21 years", "bk", "zoom", why="la libreta: 80 cambios de aceite")
O("more than 80 oil changes", "count", 3.0, from_=0, to=80, dur=1.4, pre="", suf="+", sub="oil changes in 21 years", x=520, y=330, size=150)
B("But that's only half of rule number one", "img:r510", "cut", why="Ramón saca la varilla")
B("He parks the truck flat in his driveway", "ltx:r5_flatdrive|fill", "cut", why="la F-150 en la entrada plana")
B("Pulls the dipstick", "ltx:r5_dipstick|r510", "zoom", why="la varilla en el trapo rojo")
B("He looks at the level and he looks at the color", "fill", "cut", why="la varilla")
O("30 seconds", "big", 2.4, text="30 SEC", sub="every other fill-up", x=1460, y=320, size=150, col="#3fd17a")
B("changes and you'll never know until it's too late", "img:r589", "cut", why="el barro negro bajo la tapa")
B("A valve seal, a gasket", "img:r568", "swipeL", why="los retenes, la junta y el aro")
O("A valve seal, a gasket", "chips", 4.0, items=["VALVE SEAL", "GASKET", "RING"], y=880)
B("when it's still a small thing", "fill", "cut", why="detalle")
B("you find out when the bearings are", "fill", "cut", why="detalle")
B("and use the oil the engine asks for", "ltx:r5_oilcap|r511", "zoom", why="la tapa con el grado impreso")
O("5W30, whatever it says", "chips", 3.2, items=["5W-20", "5W-30", "WHATEVER THE CAP SAYS"], y=880)
B("Not what the guy at the counter has on sale", "fill", "cut", why="el mostrador")
B("And a good filter", "ltx:r5_filter|r512", "cut", why="el filtro nuevo")
O("The filter is maybe $8", "chips", 4.6, items=["$8 FILTER", "vs", "$5,000 ENGINE"], y=880)
B("a $5,000 engine", "ph:r512", "cut", why="Ramón compara el filtro nuevo y el viejo")
O("You wouldn't let a man walk around", "quote", 5.6, text="El aceite es la sangre. The oil is the blood.", who="Don Chuy Garza", y=560)
B("You wouldn't let a man walk around", "bk", "zoom", why="la frase de Don Chuy")
B("Rule number two is the one that kills more", "img:r514", "cut", why="el vapor saliendo del capot")

# =====================================================================================================================
# REGLA 2 · EL SISTEMA DE ENFRIAMIENTO · ROSIE (6:14)
# =====================================================================================================================
B("and Rosie is not going to like", "ltx:r5_foodtruck|r570", "swipeR", why="el food truck de Rosie")
B("from her and not from the tow truck", "fill", "cut", why="detalle")
O("the cooling system. Heat is enemy", "chapter", 4.6, n="2", title="The cooling system", sub="heat is the enemy", kicker="RULE · NUMBER")
B("the cooling system. Heat is enemy", "bk", "zoom", why="capítulo 2")
B("She's got a Silverado she uses to tow", "ltx:r5_barbacoa|r523", "cut", why="la barbacoa envuelta")
O("She's got a Silverado", "tag", 3.2, x=700, y=360, text="ROSIE", sub="food truck · West Side")
B("I don't have time to baby a truck", "img:r513", "swipeL", why="Ramón comiendo un taco en el food truck")
B("Highway 90 with the trailer 103 degrees", "ltx:r5_towing|r571", "cut", why="la camioneta con el tráiler por la 90")
O("Highway 90 with the trailer 103 degrees", "map", 5.0, pins=[{"at": "Highway 90", "l": "castroville", "tx": "CASTROVILLE"}], route={"at": "Highway 90", "from": "castroville", "to": "westside"}, x=1440, y=520, sc=0.7)
O("The temperature gauge started climbing", "big", 2.6, text="103°F", sub="Highway 90 · trailer", x=520, y=320, size=150, col="#ff4a3d")
B("The temperature gauge started climbing", "ltx:r5_gauge|r572", "zoom", why="la aguja que sube")
B("She saw it. She told me", "fill", "cut", why="detalle")
B("Steam came out of the hood", "ltx:r5_steam|r514", "cut", why="el vapor en la banquina")
O("the head gasket failed", "stamp", 2.8, text="HEAD GASKET", col="#ff4a3d", rot=-6, x=1350, y=330, size=100)
B("The engine had overheated so bad", "fill", "swipeR", why="detalle")
B("the food truck sitting in my parking lot", "ltx:r5_parked|r573", "cut", why="el food truck cerrado en el taller")
B("A radiator hose, a rubber", "ltx:r5_splithose|r515", "zoom", why="Ramón muestra la manguera partida")
O("hose that cost about $40", "chips", 4.4, items=["$40 HOSE", "→", "$2,500 REPAIR"], y=880)
B("It was old, it was soft and it split", "ph:r515", "cut", why="la grieta")
B("cooling system is the only thing standing", "bk", "zoom", why="el sistema entero")
B("pump, radiator, hoses, thermostat", "img:r574", "cut", why="bomba, termostato, tapa y mangueras")
O("pump, radiator, hoses, thermostat", "chips", 6.0, items=["WATER PUMP", "RADIATOR", "HOSES", "THERMOSTAT", "CAP", "COOLANT"], y=880)
B("here's how Kowalski does it", "img:r516", "cut", why="Ramón señala el radiador")
B("First, the coolant, the antifreeze", "ltx:r5_coolant|r578", "swipeL", why="el refrigerante por el embudo")
B("it wears out, it looks fine", "img:r575", "cut", why="refrigerante viejo vs nuevo")
O("about 100,000 miles sooner", "chips", 3.6, items=["EVERY 5 YEARS", "OR 100,000 MI"], y=880)
B("about 100,000 miles sooner", "fill", "cut", why="detalle")
NB("like he's paying a bill", 5.0, [("like he's paying a bill", "2009", "100,400", "coolant · cap", "$120")])
B("like he's paying a bill", "bk", "zoom", why="la libreta")
B("Second, the hoses", "ltx:r5_squeeze|r517", "cut", why="Ramón aprieta la manguera")
B("feels firm, like a garden hose", "fill", "cut", why="detalle")
B("hard and crunchy or you see little cracks", "ph:r517", "cut", why="la mano en la manguera")
O("That's what Rosie's truck needed", "big", 3.0, text="$40", sub="what Rosie's truck needed", x=1460, y=320, size=200, col="#3fd17a")
B("The cap holds the pressure", "ltx:r5_cap|r518", "zoom", why="la tapa del radiador, el resorte")
O("raises the boiling point about 3 degrees", "boil", 22.0, capAt="A good 16 pound cap", weakAt="When the spring in that cap gets weak")
B("raises the boiling point about 3 degrees", "bk", "zoom", why="212 → 260 °F")
O("A new cap is about $15", "big", 2.8, text="$15", sub="a new cap", x=520, y=320, size=170, col="#3fd17a")
B("In our heat, after enough years, that plastic", "img:r576", "cut", why="el radiador con la grieta en la costura")
B("the seams start to weep", "ltx:r5_weep|r519", "zoom", why="la costra blanca en la costura")
B("You'll see a little crust", "ph:r519", "cut", why="Ramón señala con el destornillador")
NB("He replaced it that same month", 5.2, [("He replaced it that same month", "2012", "140,000", "radiator", "$3xx")])
B("He replaced it that same month", "bk", "zoom", why="la libreta")
B("most important thing, watch the temperature gauge", "ph:r572", "cut", why="la aguja")
O("Fan on high", "chips", 4.6, items=["A/C OFF", "HEAT FULL HOT", "FAN HIGH"], y=880)
B("Fan on high", "ltx:r5_heater|r520", "cut", why="la perilla de la calefacción al máximo")
B("is a little radiator", "fill", "cut", why="detalle")
B("Don't open the radiator cap while it's hot", "img:r521", "cut", why="Ramón frena con la mano")
B("Wait. Call somebody", "ltx:r5_tow|fill", "swipeL", why="la grúa en la banquina")
O("Wait. Call somebody", "chips", 3.8, items=["TOW $100", "vs", "ENGINE $5,000"], y=880)
B("Some of you remember the freeze February of", "ltx:r5_freeze|r522", "fade", why="San Antonio nevado")
O("Some of you remember the freeze February of", "big", 3.0, text="FEB 2021", sub="the freeze", x=1460, y=320, size=150, col="#8fd6ff")
B("Pipes bursting all over the city", "ltx:r5_pipes|r577", "cut", why="el caño reventado")
B("can freeze and crack the engine block", "ltx:r5_crackblock|fill", "zoom", why="el block rajado con hielo")
B("I had customers that week", "img:r522", "cut", why="Ramón en la nieve con la linterna")
O("I had customers that week", "big", 3.0, text="−30°F", sub="what a 50/50 mix protects", x=1460, y=320, size=150, col="#8fd6ff")
B("Same rule, winter or summer", "fill", "cut", why="detalle")
B("She also asked me to tell you that the barbacoa", "ph:r523", "cut", why="Ramón con el taco de barbacoa")

# =====================================================================================================================
# REGLA 3 · LA TRANSMISIÓN (11:03)
# =====================================================================================================================
O("Rule number three. The transmission", "chapter", 4.6, n="3", title="The transmission", sub="the fluid is everything", kicker="RULE · NUMBER")
B("Rule number three. The transmission", "bk", "zoom", why="capítulo 3")
O("You don't buy a car Ramon", "quote", 5.4, text="You don't buy a car, Ramón. You buy a transmission and the engine comes free.", who="Mr. Kowalski", y=560)
B("You don't buy a car Ramon", "bk", "zoom", why="la frase de Kowalski")
B("is a box full of gears", "ltx:r5_gearbox|r524", "cut", why="la caja en el soporte")
B("fluid is the hydraulic pressure", "img:r579", "cut", why="la caja automática")
O("an old rule of thumb in the trade", "halflife", 16.0, hotAt="the life of the fluid gets cut in half")
B("an old rule of thumb in the trade", "bk", "zoom", why="la vida del fluido se parte a la mitad")
B("I-35 in July", "ltx:r5_i35|fill", "cut", why="la I-35 en julio con el camper")
O("That fluid can be running at 220", "big", 2.8, text="240°F", sub="I-35 · July · towing", x=1460, y=320, size=150, col="#ff4a3d")
B("It goes from bright red to brown to black", "ltx:r5_fluids|r525", "zoom", why="los tres frascos")
B("Lifetime means the lifetime of the warranty", "fill", "cut", why="detalle")
O("Lifetime means the lifetime of the warranty", "quote", 5.0, text="Lifetime means the lifetime of the warranty. Not your lifetime.", who="Don Chuy Garza", y=560)
B("Kowalski changed his transmission fluid", "img:r527", "cut", why="el cárter de la caja bajando")
B("He tows a little camper to Lake McQueenie", "ltx:r5_mcqueeney|r581", "swipeR", why="el camper junto al lago")
B("I put an extra transmission", "ltx:r5_cooler|r526", "cut", why="el enfriador extra")
NB("cooler on his truck", 6.0, [("transmission fluid and", "2004", "30,000", "trans fluid + filter"), ("cooler on his truck", "2006", "62,000", "trans cooler", "$200")], d=-4.0)
B("in front of the main radiator. About $200", "bk", "zoom", why="la libreta: el enfriador")
B("in his whole notebook", "fill", "cut", why="detalle")
B("a lot of people get hurt by this", "fill", "cut", why="detalle")
B("the transmission fluid has never been changed", "img:r582", "cut", why="el cárter con barro y viruta")
O("do a high pressure flush", "stamp", 2.8, text="NO POWER FLUSH", col="#ff4a3d", rot=-6, x=1350, y=330, size=100)
B("and do a high pressure flush", "fill", "zoom", why="detalle")
B("send it into places it never went before", "fill", "cut", why="detalle")
B("I drain what comes out of the pan", "ltx:r5_drain|r527", "cut", why="el fluido rojo cayendo al balde")
O("I drain what comes out of the pan", "chips", 4.4, items=["DRAIN", "FILTER", "FILL", "DRIVE"], y=880)
O("again three draining fills", "big", 3.0, text="3×", sub="drain & fill · slow and gentle", x=1460, y=320, size=200, col="#3fd17a")
B("again three draining fills", "fill", "cut", why="detalle")
B("the old transmission slow and gentle", "fill", "cut", why="detalle")
B("in the manual sometimes on the dipstick", "ltx:r5_bottles|r583", "swipeL", why="la góndola de fluidos")
B("the universal bottle that says it works", "img:r528", "cut", why="Ramón lee la etiqueta con anteojos")
O("his goal he told me", "count", 4.0, from_=318000, to=400000, dur=2.0, suf=" mi", sub="Kowalski's goal", x=1430, y=330, size=120, col="#ffd60a")
B("his goal he told me", "fill", "cut", why="detalle")
B("it gets to 400 I'll tell you that story", "fill", "cut", why="detalle")

# =====================================================================================================================
# LAS 5 COSAS QUE NUNCA HIZO (14:17)
# =====================================================================================================================
O("never done in 21 years", "chapter", 4.6, n="5", title="Things he never did", sub="in 21 years", kicker="NEVER · IN 21 YEARS")
B("never done in 21 years", "bk", "zoom", why="las 5 cosas")
B("and number five on this list", "fill", "cut", why="detalle")
B("Seals dry out, batteries die", "ltx:r5_sitcar|r584", "cut", why="el auto quieto con hojas")
O("Seals dry out, batteries die", "chips", 5.0, items=["SEALS", "BATTERY", "FLAT SPOTS", "RUSTY BRAKES", "STALE GAS"], y=880)
B("his neighbor came over and drove it", "img:r530", "swipeR", why="el vecino sube a la F-150")
B("never bought the cheapest tires", "ltx:r5_tires|r585", "cut", why="la cubierta nueva")
B("he rotates them every other oil change", "img:r531", "cut", why="Ramón saca una rueda con la llave de impacto")
B("never ignored a drip", "fill", "cut", why="detalle")
B("a piece of white cardboard under", "ltx:r5_cardboard|fill", "cut", why="el cartón blanco debajo")
B("brings me the cardboard", "ltx:r5_spot|r532", "zoom", why="Ramón con el cartón como prueba")
O("like it's evidence in a trial", "stamp", 2.4, text="EVIDENCE", col="#ffb257", rot=-6, x=1400, y=330)
B("And you know what? It works", "ph:r532", "cut", why="el cartón")
O("The color and the spot tell me", "puddles", 5.4, items=[{"at": "The color and the spot", "col": "#3a2a1a", "tx": "BROWN", "sub": "engine oil"}, {"at": "The color and the spot", "col": "#c2262f", "tx": "RED", "sub": "transmission"}, {"at": "The color and the spot", "col": "#3fd17a", "tx": "GREEN / ORANGE", "sub": "coolant"}])
B("He never believed in the mechanic in a bottle", "ltx:r5_additive|r586", "cut", why="el aditivo por el embudo")
B("a place, a small place", "img:r533", "cut", why="Ramón niega con el frasco")
O("hope you pour in a funnel", "stamp", 2.6, text="HOPE IN A BOTTLE", col="#ffb257", rot=-5, x=1300, y=820, size=80)
B("if it was that easy Ramon would be out", "fill", "cut", why="detalle")
B("the check engine light the oil pressure light", "ltx:r5_oillight|r534", "zoom", why="la luz roja del aceite")
B("it means the engine doesn't have enough oil", "ph:r534", "cut", why="Ramón señala la luz")
B("That next exit cost them an engine", "ltx:r5_exit|fill", "cut", why="el auto rengueando hacia la salida")
O("you pull over and you shut it off", "stamp", 2.8, text="PULL OVER · SHUT IT OFF", col="#ff4a3d", rot=-5, x=960, y=820, size=80)

# =====================================================================================================================
# REGLA 4 · ESCUCHAR (16:22)
# =====================================================================================================================
O("Rule number four. Listen", "chapter", 4.6, n="4", title="Listen to the small things", sub="fix them while they're small", kicker="RULE · NUMBER")
B("Rule number four. Listen", "bk", "zoom", why="capítulo 4")
B("somebody waited on. Every single one", "fill", "cut", why="detalle")
NB("three examples from Kowalski's notebook", 4.8, [("three examples from Kowalski's", "2011", "181,000", "chirp · idler pulley", "$4x"), ("because he wrote them all down", "2014", "212,000", "hum · wheel bearing", "$180"), ("At 181,000 miles", "2018", "260,000", "check engine · EVAP")])
B("three examples from Kowalski's notebook", "bk", "zoom", why="la libreta: 3 cositas")
B("a bird under the hood", "ltx:r5_chirp|r535", "cut", why="la correa en frío")
B("Most people turn up the radio", "fill", "cut", why="detalle")
B("it was the idler pulley", "ltx:r5_pulley|r536", "zoom", why="la polea gastada")
B("If that pulley seizes on the highway", "ph:r536", "cut", why="la polea")
B("that belt runs the water pump", "fill", "cut", why="detalle")
B("And then you're back to Rosie on Highway 90", "ph:r571", "cut", why="la 90 otra vez")
B("an airplane far away", "ltx:r5_highway|r539", "cut", why="adentro de la camioneta en la ruta")
B("That's a wheel bearing on the right side", "ltx:r5_bearing|r537", "zoom", why="el rulemán")
O("About $180 done that week", "big", 2.8, text="$180", sub="done that week", x=1460, y=320, size=170, col="#3fd17a")
B("260,000 the check engine light came on", "fill", "cut", why="detalle")
B("he didn't put a piece of tape over it", "ltx:r5_tape|fill", "cut", why="la cinta sobre la luz")
B("we read the code", "img:r538", "cut", why="Ramón con el lector de códigos")
B("the vapor lines from the gas tank", "ltx:r5_evap|fill", "zoom", why="la manguera de vapores rajada")
B("If something else goes", "fill", "cut", why="detalle")
O("here's how I teach Danny", "tenmin", 34.0, title="RADIO OFF · 10 MIN A WEEK", rows=[{"at": "A squeal when you start it", "tx": "Squeal → belt"}, {"at": "A chirp is a belt or a pulley", "tx": "Chirp → belt or pulley"}, {"at": "A grinding when you brake", "tx": "Grinding → brake pads"}, {"at": "A clunk over bumps", "tx": "Clunk → suspension"}, {"at": "A hum that changes when you turn", "tx": "Hum → bearing"}, {"at": "A click, click, click", "tx": "Click → CV axle"}])
B("here's how I teach Danny", "bk", "zoom", why="la lista de ruidos")
B("A hum that changes when you turn", "bk", "cut", why="la lista sigue")
B("usually a CV axle", "ltx:r5_cvboot|r541", "cut", why="el fuelle roto")
B("it's an axle. None of those noises", "ph:r540", "cut", why="la pastilla gastada")
B("All of them become emergencies", "fill", "cut", why="detalle")
B("I want to tell you something about money", "fill", "cut", why="detalle")

# =====================================================================================================================
# LA PLATA (19:00)
# =====================================================================================================================
B("I sat down with Kowalski's notebook", "ltx:r5_calculator|r542", "cut", why="la calculadora en la cocina")
O("oil change, every filter, every tire", "chips", 5.0, items=["OIL", "FILTERS", "TIRES", "BRAKES", "RADIATOR", "WATER PUMP"], y=880)
B("oil change, every filter, every tire", "fill", "cut", why="detalle")
O("21 years. It came to a little under $20,000", "money", 30.0, newAt="Now a new truck today")
B("21 years. It came to a little under $20,000", "bk", "zoom", why="$20.000 vs $50.400")
B("Marta checks everything twice", "img:r543", "cut", why="Ramón se ríe con la calculadora")
B("more than $50,000", "bk", "zoom", why="la barra grande")
B("new truck, and not the registration", "ltx:r5_newtrucks|fill", "cut", why="la fila de camionetas nuevas")
B("Nobody can take it", "ph:r529", "cut", why="la palmada en el guardabarros")
O("why do we have a car payment", "quote", 4.6, text="Ramón, why do we have a car payment?", who="Marta", y=560)
B("why do we have a car payment", "ph:r504", "cut", why="la cocina de noche")
O("We don't anymore", "stamp", 2.4, text="NO CAR PAYMENT", col="#3fd17a", rot=-5, x=1300, y=820, size=80)

# =====================================================================================================================
# REGLA 5 · CÓMO SE MANEJA (20:07)
# =====================================================================================================================
O("How you drive it", "chapter", 4.6, n="5", title="How you drive it", sub="the engine only knows how it's treated", kicker="RULE · NUMBER")
B("It only knows how it's been treated", "bk", "zoom", why="capítulo 5")
B("drive like there's a cup of", "ltx:r5_coffee|r544", "cut", why="el café sin tapa en el tablero")
O("drive like there's a cup of", "quote", 4.4, text="Drive like there's a cup of hot coffee on the dashboard and no lid.", who="Mr. Kowalski", y=560)
B("No jackrabbit starts from the light on military drive", "ltx:r5_military|fill", "cut", why="el semáforo de Military Drive")
B("The first five minutes matter most", "img:r545", "cut", why="Ramón se pone el cinturón")
O("That's old advice from carburetor days", "drive", 9.0, from_="15 MIN IDLE", to="30 SEC", flipAt="give it 30 seconds")
B("That's old advice from carburetor days", "bk", "zoom", why="15 min → 30 s")
B("your seat belt, and then drive gently", "ph:r545", "cut", why="el cinturón")
B("you only drive two miles to the store", "fill", "cut", why="detalle")
B("That water mixes with the oil and makes sludge", "ph:r589", "zoom", why="el barro")
B("highway 90 out toward Castroville", "ltx:r5_hwy90|r546", "cut", why="la 90 hacia Castroville")
O("highway 90 out toward Castroville", "map", 4.6, pins=[{"at": "highway 90", "l": "castroville", "tx": "CASTROVILLE"}], route={"at": "highway 90", "from": "westside", "to": "castroville"}, x=1440, y=520, sc=0.7)
B("the tires, check the pressure once a month", "ltx:r5_tiregauge|r547", "cut", why="el medidor de lápiz")
B("not the number on the tire", "ltx:r5_sticker|r548", "zoom", why="la etiqueta del marco de la puerta")
O("not the number on the tire", "stamp", 2.6, text="DOOR STICKER · NOT THE TIRE", col="#ffb257", rot=-5, x=960, y=820, size=70)
O("Tire pressure changes", "tiretemp", 13.0, hotAt="on a 100 degree afternoon")
B("Tire pressure changes", "bk", "zoom", why="35 → 39 psi con el calor")
B("Under inflated tires on hot pavement", "ltx:r5_shredded|r590", "cut", why="la banda destrozada")
B("build heat and heat is what makes", "fill", "cut", why="detalle")

# =====================================================================================================================
# REGLA 6 · ESCRIBILO (22:06)
# =====================================================================================================================
B("that brings me to rule number six", "img:r591", "cut", why="la F-150 frente a la iglesia el domingo")
O("Rule number six. Write it down", "chapter", 4.6, n="6", title="Write it down", sub="a $1 notebook", kicker="RULE · NUMBER")
B("Rule number six. Write it down", "bk", "zoom", why="capítulo 6")
B("a pen tied to it with a piece of string", "ltx:r5_glovebox|r592", "cut", why="la guantera con la libreta")
NB("four things the date the mileage", 9.0, [("four things the date", "DATE", "MILES", "WHAT", "COST"), ("what it cost that's it", "06/14", "212,400", "wheel bearing", "$180")], title="4 THINGS · EVERY TIME")
B("four things the date the mileage", "bk", "zoom", why="las 4 columnas")
B("you want be like Kowalski with the gallons", "fill", "cut", why="detalle")
O("first your memory lies", "stamp", 2.6, text="YOUR MEMORY LIES", col="#ff4a3d", rot=-5, x=1300, y=820, size=84)
B("first your memory lies", "fill", "cut", why="detalle")
B("ago then you look and it was four years", "fill", "cut", why="detalle")
B("the notebook doesn't lie Kowalski opens it", "ph:r550", "cut", why="la columna de números")
NB("and says transmission fluid", 6.0, [("and says transmission fluid", "2023", "288,200", "trans fluid · Ramón's", "$165")])
B("no argument second the notebook shows you", "fill", "cut", why="detalle")
B("his gallons and his miles every fill up", "fill", "cut", why="detalle")
B("light on the dash no noise", "ltx:r5_mpg|fill", "cut", why="el surtidor")
O("light on the dash no noise", "chips", 4.0, items=["15 MPG", "→ 14", "→ 13.5"], y=880)
B("it was a dirty air", "ltx:r5_airfilter|r551", "zoom", why="el filtro sucio contra el limpio")
B("you write down every time you add a quart", "fill", "cut", why="detalle")
B("you catch the oil burner", "fill", "cut", why="detalle")
B("a shop tells you that you need a coolant flush", "img:r552", "cut", why="Ramón en el mostrador con la libreta")
O("coolant was done 8,000 miles ago", "chips", 4.4, items=["COOLANT: 8,000 MI AGO", "BRAKES: LAST OIL CHANGE"], y=880)
B("the retired teacher with the Camry", "ltx:r5_invoice|r593", "cut", why="la factura larga")
O("for things her car didn't need", "stamp", 3.0, text="$1,400", col="#ff4a3d", rot=-6, x=1350, y=330, size=130)
B("I'll tell you the whole story of that shop", "fill", "cut", why="detalle")
B("She bought a spiral one with", "ltx:r5_apple|r594", "zoom", why="la libreta de la manzana")
B("And fourth, when it's time to sell", "fill", "cut", why="detalle")
O("what I told you last time", "quote", 5.0, text="I'll take a boring car with a folder full of paper over a pretty car with a story.", who="Ramón", y=560)
B("what I told you last time", "bk", "zoom", why="la frase del video anterior")
B("faster and for more because the buyer", "fill", "cut", why="detalle")
O("When you write it down, you pay attention", "stamp", 2.6, text="YOU PAY ATTENTION", col="#3fd17a", rot=-5, x=960, y=820, size=84)
B("When you write it down, you pay attention", "fill", "cut", why="detalle")
B("you become Kowalski", "ph:r505", "cut", why="el apretón de manos con Kowalski")

# =====================================================================================================================
# REPASO + LA LIBRETA + CIERRE (25:30)
# =====================================================================================================================
B("Let me give you all six rules again", "bk", "zoom", why="el repaso")
O("Let me give you all six rules again", "tenmin", 80.0, title="THE 6 RULES · 300,000 MI", rows=[{"at": "Rule one, the oil", "tx": "1 · Oil: severe schedule"}, {"at": "rule two the cooling system", "tx": "2 · Cooling: hoses, cap, gauge"}, {"at": "three the The transmission", "tx": "3 · Transmission: every 30k"}, {"at": "Listen to the small noises", "tx": "4 · Listen: radio off"}, {"at": "it like there's a hot cup", "tx": "5 · Drive: hot coffee, no lid"}, {"at": "and rule six the one nobody does", "tx": "6 · Write it down · $1"}])
B("in San Antonio we all drive severe", "bk", "cut", why="la lista")
B("new radiator cap every coolant change", "bk", "cut", why="la lista")
B("the exact fluid it asks for", "bk", "cut", why="la lista")
B("A $40 pulley today", "bk", "cut", why="la lista")
B("highway run every week", "bk", "cut", why="la lista")
B("a one dollar notebook in the glove box", "bk", "cut", why="la lista")
B("sat down on the stool by the workbench", "ltx:r5_pages|r553", "fade", why="Ramón lee la libreta en el taburete")
B("the beginning his handwriting is straight", "ph:r562", "zoom", why="la letra firme del principio")
B("Toward the end it's a little", "img:r595", "cut", why="la letra temblorosa de 2017")
NB("Truck ran fine. Ellen was his wife", 11.0, [("Truck ran fine. Ellen", "2017", "241,000", "took Ellen to the doctor"), ("there's a line that says freeze", "FEB 2021", "289,000", "freeze · truck started"), ("Took water to the neighbors", "", "", "took water to the neighbors")], title="F-150 · 2004", d=-4.0)
B("Truck ran fine. Ellen was his wife", "bk", "zoom", why="la libreta: Ellen")
B("Took water to the neighbors", "ltx:r5_water|r554", "cut", why="el agua en la caja de la camioneta")
B("It's 21 years of your life", "ph:r553", "cut", why="Ramón conmovido")
B("Danny was standing next to me", "img:r555", "cut", why="Danny y la libreta de la calavera")
B("Ramon, I'm going to buy a notebook", "fill", "cut", why="detalle")
B("got a skull on the cover", "img:r596", "zoom", why="la libreta negra con la calavera")
O("subscribe because there's a lot", "chips", 3.6, items=["🔔 SUBSCRIBE"], y=880)
O("how many miles does your car have", "comment", 6.0, text="How many miles does your car have right now? And the one thing you do to keep it alive 👇", x=1200, y=780)
B("how many miles does your car have", "fill", "cut", why="detalle")
B("Kowalski wants to know if he's got competition", "fill", "cut", why="detalle")
B("the gas station on Military Drive", "ltx:r5_pump|r597", "cut", why="la F-150 en el surtidor de Military Drive")
B("he squeezed the handle again click", "img:r556", "cut", why="Ramón le agarra el brazo a Kowalski")
O("I don't fill my tank all the way", "stamp", 2.6, text="DON'T TOP OFF", col="#ff4a3d", rot=-6, x=1350, y=330, size=100)
B("top round it up to the dollar", "ph:r597", "zoom", why="el surtidor")
B("about a part most people have never heard of", "ltx:r5_canister|r598", "cut", why="el canister junto al tanque")
O("costs a few", "chips", 3.4, items=["NEXT VIDEO", "THE PART NEXT TO THE GAS TANK"], y=880)
B("hundred dollars every time somebody does", "bk", "zoom", why="cierre")

# ---------------- medios disponibles ----------------
def clip_len(p):
    try: return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 2)
    except Exception: return 0.0
LTXD = PUB + f"{SL}/ltx/"; AGD = PUB + f"broll/{SL}/"; IMGD = PUB + f"{SL}/img/"
ltx_ok = {f[:-4] for f in os.listdir(LTXD) if f.endswith(".mp4")} if os.path.isdir(LTXD) else set()
# 25-oct (regla del creador): LTX = Ramón HACIENDO lo que narra (vlog, cámara fija). Los clips de texto-a-video viejos (r4_*/r5_*) salen;
# cada foto con su cara tiene su toma en un clip de 3 tomas (ltx_vlog.py) → mapa foto → [clip, desde, largo].
ltx_ok = {x for x in ltx_ok if x.startswith("rm05v")}
VMAP = json.load(open("D:/rtmp_enrm05/ltx_vlog_mapa.json", encoding="utf8")) if os.path.exists("D:/rtmp_enrm05/ltx_vlog_mapa.json") else {}
ag_ok = {f[:-4] for f in os.listdir(AGD) if f.endswith(".mp4")} if os.path.isdir(AGD) else set()
img_ok = {f[:-4] for f in os.listdir(IMGD) if f.endswith(".jpg")}
used, notes = set(), []
FILLS_USED = []
def fill_id():
    while POOL:
        f = POOL.pop(0)
        if f in img_ok and f not in used: used.add(f); FILLS_USED.append(f); return f
    return None
def fill_seg():
    f = fill_id()
    if f: return {"k": "img", "src": f"{SL}/img/{f}.jpg", "id": f}
    # pool vacío: un relleno ya usado vuelve UNA vez como inserto de detalle (otro recorte, otra zona), nunca el mismo cuadro
    for u in FILLS_USED:
        if "det_" + u not in used:
            used.add("det_" + u); h = len(used) % 4
            return {"k": "img", "src": f"{SL}/img/{u}.jpg", "id": "det_" + u, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    notes.append("¡pool de relleno vacío!"); return {"k": "bk", "src": f"{SL}/img/r5k16.jpg"}

def resolve(base, a):
    """base → dict de plano. Nunca repite un clip ni una foto: si ya se usó, el taller."""
    if base.startswith("bk"):
        pid = base[3:]
        return {"k": "bk", "src": f"{SL}/img/{pid}.jpg"} if pid in img_ok else {"k": "bk", "src": f"{SL}/img/{fill_id() or FILLS_USED[len(used) % len(FILLS_USED)]}.jpg"}
    if base == "fill": return fill_seg()
    if base.startswith("ltx:"):
        lid, alt = base[4:].split("|")
        if lid in ltx_ok and lid not in used:
            used.add(lid); return {"k": "clip", "src": f"{SL}/ltx/{lid}.mp4", "len": clip_len(LTXD + lid + ".mp4"), "id": lid}
        notes.append(f"LTX {lid} no llegó → {alt}"); base = "img:" + alt
    force_ph = base.startswith("ph:")
    pid = base.split(":", 1)[1]
    if not force_ph and pid in VMAP and VMAP[pid][0] in ltx_ok and ("vl_" + pid) not in used:
        cid, fr, ln = VMAP[pid]; used.add("vl_" + pid); used.add(pid)
        return {"k": "clip", "src": f"{SL}/ltx/{cid}.mp4", "from": fr, "len": ln, "id": "vl_" + pid}
    if not force_ph and pid in ag_ok and ("ag_" + pid) not in used:
        used.add("ag_" + pid); return {"k": "clip", "src": f"broll/{SL}/{pid}.mp4", "len": clip_len(AGD + pid + ".mp4"), "id": "ag_" + pid}
    if pid in img_ok and pid not in used:
        used.add(pid); return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": pid}
    if pid in img_ok and force_ph and ("ag_" + pid) in used and pid not in used:
        used.add(pid); return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": pid}
    if pid in img_ok and ("det_" + pid) not in used:
        # 2º uso de la misma foto = INSERTO de detalle (otro recorte, 1,7×, otra zona): encuadre distinto, no la misma imagen
        used.add("det_" + pid); h = len(used) % 4
        return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": "det_" + pid, "det": [[1.62, 1.78], [-260, 0], [0, -120], [240, 60], [-120, 110]][0], "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    notes.append(f"{base} 3er uso → relleno"); return fill_seg()

BEATS.sort(key=lambda b: b["a"])
ZS = [[1.03, 1.13], [1.13, 1.03], [1.05, 1.12], [1.04, 1.15]]
segs = []
for n, b in enumerate(BEATS):
    g = {"a": b["a"], "tr": b["tr"] or "cut", "why": b["why"], "ph": b["ph"], **resolve(b["base"], b["a"])}
    if g["k"] == "img" and "det" in g:
        g["z"] = [1.32, 1.42]; g["ox"], g["oy"] = g.pop("dz"); g.pop("det")
    elif g["k"] == "img":
        h = n % 4; g["z"] = ZS[h]; g["ox"] = [0, -30, 30, 0][h]; g["oy"] = [0, 10, -10, -20][h]
    if g["k"] == "w" and g["tr"] == "portal" and segs and segs[-1]["k"] == "w": g["tr"] = "cut"
    segs.append(g)
segs[0]["a"] = 0.0
# el avatar pisa sus ventanas; al salir vuelve lo que corresponda (una foto/clip ya empezado no se retoma → el taller)
for w in AVW:
    ms, me = w["ms"], w["me"]
    before = [g for g in segs if g["a"] <= me]
    active = before[-1] if before else segs[0]
    segs = [g for g in segs if not (ms <= g["a"] < me)]
    segs.append({"a": round(ms, 2), "k": "av", "tr": "zoom" if len(segs) % 2 else "iris", "why": "avatar"})
    nxt = [g for g in segs if g["a"] >= me]
    if not nxt or nxt[0]["a"] - me > 0.8:
        r = dict(active); r["a"] = round(me, 2); r["tr"] = "swipeL"
        if r["k"] in ("img", "clip") and active["a"] < ms: r = {"a": round(me, 2), "tr": "swipeL", "why": "relleno tras el avatar", "ph": "", **fill_seg()}
        segs.append(r)
    segs.sort(key=lambda g: g["a"])
segs.sort(key=lambda g: g["a"])
out = []
for g in segs:
    if out and g["a"] - out[-1]["a"] < 1.0 and out[-1]["k"] != "av" and g["k"] != "av": out[-1] = g; continue
    out.append(g)
segs = out
# planos largos: foto >7 s o clip que se queda corto → sigue el taller con otra vista (nunca >~6 s quieto)
add = []
alt_views = ["wideL", "wideR", "bay1", "suv", "truck", "board"]
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    lim = (g.get("len", 3) + 2.2) if g["k"] == "clip" else (4.0 if g["a"] < 60 else 4.5) if g["k"] == "img" else 99
    if g["k"] in ("img", "clip") and b - g["a"] > lim + 0.8:
        add.append({"a": round(g["a"] + lim, 2), "tr": "cut", "why": "el plano se acaba → detalle del taller", "ph": "", **fill_seg()})
segs = sorted(segs + add, key=lambda g: g["a"])
for g in segs:  # insertos de detalle que entraron después (relleno tras el avatar / plano que se acaba)
    if g.get("k") == "img" and "det" in g:
        g["z"] = [1.32, 1.42]; g["ox"], g["oy"] = g.pop("dz"); g.pop("det")
# piezas grandes (bk) que duran demasiado sin pieza encima → nada que hacer; los w largos ganan un movimiento extra de cámara (más abajo)

# ---------------- cámara: llaves por plano del mundo (empuje lento; mundo→mundo = movimiento continuo) ----------------
def push(v, k=0.1):
    p, l, f = V[v]; return [round(p[i] + (l[i] - p[i]) * k, 3) for i in range(3)], l, f
keys = []
for i, g in enumerate(segs):
    if g["k"] not in ("w", "bk"): continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    v = g.get("view", "wide")
    prev = segs[i - 1] if i else None
    if prev is not None and prev["k"] == "w" and g["k"] == "w" and keys:
        keys.append({"t": g["a"], "p": keys[-1]["p"], "l": keys[-1]["l"], "fov": keys[-1]["fov"]})
        p, l, f = V[v]; keys.append({"t": round(g["a"] + 1.8, 2), "p": p, "l": l, "fov": f, "arc": 0.05})
    else:
        p, l, f = V[v]; keys.append({"t": round(max(0, g["a"] - 0.5), 2), "p": p, "l": l, "fov": f})
    p2, l2, f2 = push(v, 0.12 if b - g["a"] < 10 else 0.26)
    keys.append({"t": round(b, 2), "p": p2, "l": l2, "fov": f2})
    if g["k"] == "w" and v in PTV: g["pt"] = PTV[v]
keys.sort(key=lambda k: k["t"])
ded = []
for k in keys:
    if ded and k["t"] <= ded[-1]["t"]: k["t"] = round(ded[-1]["t"] + 0.01, 2)
    ded.append(k)

# ---------------- piezas: "at" de texto → segundos; tag con pt sólo sobre el mundo ----------------
def base_at(t):
    g = [x for x in segs if x["a"] <= t]; return g[-1] if g else segs[0]
ov = []
for o in OVS:
    if o["k"] == "quote" and o.get("y") == -999: continue
    if o["k"] == "tag" and "pt" in o and base_at(o["a"] + 0.4)["k"] != "w": continue
    for lk in ("items", "rows", "pins", "lines"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for it in o[lk]:
                if isinstance(it.get("at"), str):
                    a = T(it["at"], o["a"]); it["at"] = a if a is not None else o["a"] + 0.5
    if "route" in o and isinstance(o["route"].get("at"), str): o["route"]["at"] = T(o["route"]["at"], o["a"]) or o["a"]
    for kk in ("heatAt", "slipAt", "dryAt", "clogAt", "oilAt", "totalAt", "carAt", "rentAt", "splitAt", "ruleAt", "monAt", "notAt", "riseAt", "countAt", "goAt", "flipAt", "pickAt", "capAt", "weakAt", "hotAt", "newAt"):
        if isinstance(o.get(kk), str):
            v = T(o[kk], o["a"])
            if v is None: print("  ! ancla interna sin encontrar:", o["k"], kk, o[kk]); v = o["a"] + 1.5
            o[kk] = v
    if "from_" in o: o["from"] = o.pop("from_")
    # la pieza no puede tapar al avatar: si cae en una ventana, se corre al final de la ventana (o se descarta si no entra)
    ov.append(o)

# piezas que van al CENTRO del cuadro nunca encima del avatar (le tapan la cara): si cruzan una ventana se parten en dos
CENTRO = {"flood", "route", "quote", "schedules", "money", "cvt", "dct", "threeparts", "quarts", "dot", "chapter", "boil", "halflife",
          "rings", "scanner", "web", "notebook", "puddles", "drive", "tiretemp", "cardboard", "big", "stamp", "count", "map", "drop", "lotprice", "tag"}
def centro(o):
    if o["k"] not in CENTRO: return False
    if o["k"] in ("big", "stamp", "count", "tag", "drop"): return 700 < (o.get("x") or 960) < 1260 or (o.get("y") or 540) < 650 and 600 < (o.get("x") or 960) < 1320
    return True
for w in AVW:
    ms, me = w["ms"], w["me"]
    nv = []
    for o in ov:
        if not centro(o) or o["b"] <= ms or o["a"] >= me: nv.append(o); continue
        if ms - o["a"] >= 2.0: x = dict(o); x["b"] = round(ms, 2); nv.append(x)
        if o["b"] - me >= 2.0: y = dict(o); y["a"] = round(me, 2); nv.append(y)
    ov = nv
ov.sort(key=lambda o: o["a"])
ev = {k: sorted(v) for k, v in EVR.items()}
ev["lift"] = sorted(LIFT); ev["odo"] = sorted(ODO); ev["bad"] = sorted(BAD, key=lambda x: x["a"])
reel = os.path.exists(PUB + f"{SL}/reel0.mp4")
rl = clip_len(PUB + f"{SL}/reel0.mp4") if reel else 0
json.dump([{k: v for k, v in g.items() if k not in ("why", "ph", "id")} for g in segs], open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
# CTA de la guía paga (The $2 Mechanic): 2 huecos sin avatar (min ~1 y ~55 %), tapa pantalla → saca lo que se pisa
GU = [dict(k='guia', a=a, b=round(a + 8.5, 2), pag=pg, note=nt) for a, pg, nt in [(69.7, '05_first_click', '200 fixes of $2 or less'), (957.3, '04_dash_lights', 'Know every dash light before it costs you')]]
ov = [o for o in ov if not any(o['a'] < g['b'] and o['b'] > g['a'] for g in GU)] + GU
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"], "src": g.get("src"), "len": g.get("len")} for i, g in enumerate(segs)]
json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))

# ---------------- el plan minuto a minuto (una línea por plano) ----------------
def mmss(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"
lines = [f"# {SL} · PLAN MxM (generado de plan_enrm05.py, escrito a mano plano por plano) · END {mmss(END)}", "mm:ss-mm:ss · frase · plano · componente · sonido", ""]
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    pz = [o["k"] for o in ov if g["a"] - 0.2 <= o["a"] < b]
    what = g["k"] + (":" + g.get("view", "") if g["k"] == "w" else ":" + (g.get("src") or "").split("/")[-1] if g.get("src") else "")
    snd = "voz" if g["k"] == "av" else "voz + audio nativo del clip −26 dB" if g["k"] == "clip" else "voz + foley suave del taller"
    lines.append(f"{mmss(g['a'])}-{mmss(b)} · {g.get('ph', '')[:48]} · {what} ({g.get('why', '')}) · {', '.join(pz) or '—'} · {snd}")
open(f"D:/rtmp/{SL}_PLAN_MxM.md", "w", encoding="utf8").write("\n".join(lines))

# ---------------- medición ----------------
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "w", "img", "clip", "bk")}
gap, last = 0, 0
for g, d in zip(segs, dur):
    if g["k"] == "av": last = g["a"] + d
    else: gap = max(gap, g["a"] + d - last)
sys.stdout.reconfigure(encoding="utf-8")
print(f"END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · {tot} · av {100*tot['av']/END:.0f}% · hueco máx sin avatar {gap:.1f}s")
print(f"piezas {len(ov)} · beats {len(BEATS)} · llaves {len(ded)} · LTX llegados {len(ltx_ok)} · agnes {len(ag_ok)} · fotos {len(img_ok)} · reel {reel}")
nl = sum(1 for g in segs if g.get("src", "").find("/ltx/") >= 0)
print(f"clips LTX en pantalla {nl} · respaldos usados {sum(1 for n in notes if n.startswith('LTX'))}")
print("SIN ANCLAR:", miss if miss else "ninguna")
for n in notes:
    if not n.startswith("LTX"): print("  ", n)
