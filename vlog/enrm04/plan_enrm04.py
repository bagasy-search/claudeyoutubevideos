# enrm04 · «Never Buy These 5 Used Cars» · plan del video ENTERO escrito A MANO, plano por plano, sobre la frase de ese segundo
# (at() sobre words.json, frases copiadas del ASR). → segs.json, ov.json, cam.json, ev.json, avail.json, edl.json en src/enrm04
# y D:/rtmp/enrm04_PLAN_MxM.md (una línea por plano). Las ventanas del avatar las manda avwin.json (av_temprano): ahí la base
# es el avatar y al salir vuelve el plano que corresponde.
# Bases: "w:<vista>" el taller 3D · "img:<id>" foto de Ramón (si ya hay clip agnes de esa foto, va el clip) · "ph:<id>" foto quieta
# · "ltx:<id>|<respaldo>" clip LTX (si todavía no llegó, el respaldo) · "bk" fondo oscurecido para las piezas grandes.
import json, os, re, subprocess, unicodedata, sys, statistics

sys.stdout.reconfigure(encoding="utf-8")
SL = "enrm04"
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

# ---------------- vistas del taller (p, l, fov) ----------------
V = {
    "wide": ([0, 3.4, 10.5], [0, 1.2, -1.2], 42), "wideL": ([-5.5, 2.6, 7.5], [-1.5, 1.2, -1.0], 40), "wideR": ([5.8, 2.7, 7.6], [1.2, 1.2, -1.0], 40),
    "bay1": ([-1.4, 2.0, 4.8], [-4.2, 1.7, 0], 36), "under": ([-2.9, 0.45, 2.7], [-4.2, 1.95, -0.1], 42), "pan": ([-3.3, 0.9, 2.1], [-4.2, 1.7, 0.55], 30),
    "suv": ([2.4, 2.1, 5.0], [0, 1.0, 0], 36), "engine": ([0.05, 2.8, 3.7], [0, 1.0, 1.15], 32), "xray": ([2.7, 1.6, 3.0], [0, 0.85, 0.5], 34),
    "suvlow": ([-1.9, 0.7, 3.4], [0, 0.6, -0.4], 36), "truck": ([6.3, 2.0, 5.3], [4.2, 1.0, 0], 36), "cab": ([4.75, 1.55, 2.7], [4.0, 1.25, 1.2], 30),
    "bench": ([-2.2, 1.75, -1.5], [-2.4, 0.95, -3.2], 34), "book": ([-1.72, 1.62, -2.55], [-1.75, 0.98, -3.15], 26),
    "board": ([1.9, 1.8, -1.3], [1.9, 1.8, -3.6], 38), "door": ([-2.3, 2.5, 0.9], [0.2, 1.9, -4.2], 42), "sign": ([0, 2.5, 1.0], [0, 3.45, -3.6], 34),
}
PTV = {"bay1": "lift", "under": "lift", "pan": "pan", "suv": "suv", "engine": "engine", "xray": "gearbox", "suvlow": "floodline",
       "truck": "truck", "cab": "odo", "bench": "bench", "book": "notebook", "board": "board", "door": "door", "sign": "sign"}

BEATS, OVS, EVR, LIFT, ODO, BAD = [], [], {}, [[0, 0]], [[0, 0]], []
# 26-oct: el taller 3D low-poly se veía de juguete al lado de las fotos reales → SALE como base. Cada beat "w:" pasa a una foto
# REAL del taller hecha para esa frase (img2/mapa.json) y las piezas grandes van sobre una foto real oscurecida.
MAPA = json.load(open("D:/rtmp_enrm04/img2/mapa.json", encoding="utf8"))
POOL = list(MAPA["f"]) + [f"r4g{i:02d}" for i in range(1, 61)]  # 2ª tanda de detalles (img3)
def B(ph, base, tr=None, d=0.0, why="", **kw):
    if base.startswith("w:"): base = "img:" + MAPA["w"][ph] if ph in MAPA["w"] else "fill"
    elif base == "bk": base = "bk:" + MAPA["k"].get(ph, "")
    if tr == "portal": tr = "zoom"
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr, ph=ph, why=why, **kw))
def O(ph, k, L, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: OVS.append(dict(k=k, a=a, b=round(a + L, 2), **kw))
def EV(key, ph, dur, d=0.0):
    a = at(ph, d)
    if a is not None: EVR.setdefault(key, []).append([a, round(a + dur, 2)])
def KF(lst, ph, v, d=0.0):
    a = at(ph, d)
    if a is not None: lst.append([a, v])
def BADP(ph, dur, part, d=0.0):
    a = at(ph, d)
    if a is not None: BAD.append(dict(a=a, b=round(a + dur, 2), part=part))
def T(ph, t0=0.0):
    """segundo de una frase buscando desde t0 (la entrada de la pieza) SIN mover el cursor (para los 'at' internos de las piezas)."""
    global cur
    c = cur; cur = next((i for i, x in enumerate(TS) if x >= t0 - 3), 0); v = at(ph); cur = c; return v

# =====================================================================================================================
# 0:00 GANCHO — el lote de Castroville Road, 98 °F, el hombre del clipboard (los mejores LTX, la promesa en pantalla)
# =====================================================================================================================
B("a Saturday in July", "ltx:r4_ninetyeight|r461", "fade", why="calor sobre el capot: 98 °F")
O("It's 98 degrees", "big", 2.6, text="98°F", sub="a Saturday in July", x=1500, y=300, size=170, col="#ffb257")
B("the man with the clipboard", "ltx:r4_clipboard|r401", "cut", why="la mano con el clipboard golpeando la birome")
B("car in front of you is a steel", "img:r401", "swipeL", why="Ramón escéptico en el lote")
B("Leather seats, a sunroof", "ltx:r4_lot|r455", "cut", why="caminata por la fila de autos")
O("Leather seats, a sunroof", "lotprice", 5.4, price="$8,900", items=[{"at": "Leather seats", "tx": "LEATHER"}, {"at": "a sunroof", "tx": "SUNROOF"}, {"at": "89,000 miles", "tx": "89,000 MI"}])
# AV 16.0-21.6
B("your daughter needs a ride", "ltx:r4_oldcar|r456", "swipeR", why="el auto viejo que hace ruido frente a la casa")
B("My name is Ramon Trevino", "ltx:r4_zarza|r402", "portal", why="el taller de S. Zarzamora")
O("My name is Ramon Trevino", "lower", 5.5, name="RAMÓN TREVIÑO", l2="Mechanic · 46 years in San Antonio")
B("The last 37 in my own shop", "w:door", "portal", why="el portón del taller 3D, el cartel")
EV("lift", "The last 37 in my own shop", 0.1)
# AV 32.9-38.7
B("Not even if the man with the clipboard", "img:r405", "cut", why="Ramón apoyado, media sonrisa: ni con descuento")
O("knocks off another 500", "stamp", 2.4, text="-$500?", col="#ffb257", rot=-8, x=1480, y=320)
B("Because of what's under it", "w:xray", "iris", why="rayos X: lo que hay debajo del capot")
EV("xray", "Because of what's under it", 6.5); EV("hood", "Because of what's under it", 6.5)
BADP("The engine. The transmission", 1.6, "engine"); BADP("The transmission. The one part", 3.0, "trans", d=0.9)
O("The engine. The transmission", "chips", 4.5, items=["THE ENGINE", "THE TRANSMISSION", "THE ONE PART"], y=880)
# AV 50.9-55.7
B("With a family standing next to it", "ltx:r4_lifts|r403", "swipeL", why="el sedán subiendo en el elevador")
B("Doing the math on their fingers", "img:r442", "cut", why="la pareja mirando debajo del auto con Ramón")
B("the last one is the one nobody checks", "ltx:r4_newsuv|r488", "zoom", why="la SUV brillante con globos: la última")
O("the one nobody checks", "stamp", 3.0, text="#5 · NOBODY CHECKS", col="#ff4a3d", rot=-6, x=1350, y=780)
# AV 67.9-71.9
B("Last time I told you about the free button", "w:bench", "portal", why="el banco del taller (el video anterior)")
O("A lot of you wrote to me", "comment", 3.6, text="I pressed the button. Saved $340. Thank you Ramón!", x=1300, y=780)
B("Marta reads me your comments", "ltx:r4_kitchen|r404", "swipeR", why="la mesa de la cocina de noche")
# AV 81.7-86.1
B("people are smarter than you", "img:r404", "cut", why="Ramón y Marta en la cocina")
B("before the car is even yours", "w:wide", "zoom", why="el taller entero")
O("the cheapest repair in the world", "quote", 4.6, text="The cheapest repair in the world is the car you never bought.", who="Ramón", y=560)
# AV 98.9-104.0
B("Chui had a little shop with a dirt floor", "ltx:r4_dirtfloor|r457", "fade", why="el taller de tierra en Monterrey")
B("A cheap car is like a dog from the street", "ltx:r4_streetdog|r456", "cut", why="el perro de la calle")
O("A cheap car is like a dog from the street", "quote", 5.4, text="A cheap car is like a dog from the street. Sometimes it bites.", who="Don Chuy Garza · Monterrey", y=620)
# AV 116.4-119.9
B("Most cheap cars are good dogs", "w:wideL", "portal", why="el taller, las 3 bahías")
O("they bite the same way every time", "chips", 3.6, items=["SAME WAY", "EVERY TIME"], y=880)

# =====================================================================================================================
# #1 EL LUJO A PRECIO DE ECONÓMICO (2:10)
# =====================================================================================================================
O("So let me show you which ones. Number one", "chapter", 5.0, d=1.6, n="1", title="The luxury car at an economy price", sub="air suspension")
B("So let me show you which ones", "bk", "zoom", why="capítulo 1")
# AV 130.3-136.2
B("to work on a Monday with a face like somebody died", "img:r406", "cut", why="Danny de espaldas con Ramón")
O("Danny is 24", "tag", 3.4, x=760, y=380, text="DANNY SALAS", sub="apprentice · 24")
B("His cousin Marcus had just bought", "ltx:r4_luxsedan|r463", "swipeL", why="el sedán alemán negro al atardecer")
O("11 years old, 94,000", "chips", 3.2, items=["11 YEARS", "94,000 MI", "$8,900"], y=880)
# AV 149.5-155.5
B("leather that smelled like a new wallet", "img:r458", "cut", why="el cuero con la llave en la consola")
B("he drove it to his grandmother's house", "ltx:r4_leonvalley|r456", "swipeR", why="la entrada de la casa de ladrillo en Leon Valley")
O("in Leon Valley just so the neighbors", "map", 4.0, pins=[{"at": "in Leon Valley", "l": "leonvalley", "tx": "LEON VALLEY"}], route={"at": "in Leon Valley", "from": "castroville", "to": "leonvalley"}, x=1440, y=520, sc=0.7)
# AV 166.3-170.6
B("Marcus came out of his apartment", "ltx:r4_sag|r407", "cut", why="la cola del sedán casi en el piso")
B("low rider from the old days on Commerce Street", "img:r460", "swipeL", why="el lowrider de los 60")
O("Only he didn't do it on purpose", "stamp", 2.4, text="NOT ON PURPOSE", col="#ff4a3d", rot=-7, x=1400, y=300)
# AV 181.2-185.6
B("rubber bags full of air at each corner", "ltx:r4_airbag|r408", "cut", why="el fuelle de goma silbando")
O("rubber bags full of air", "tag", 3.6, x=1100, y=520, text="AIR SPRING", sub="rubber bag + compressor", col="#8fd6ff")
B("it rides like a cloud", "w:under", "portal", why="la panza del sedán en el elevador 3D")
KF(LIFT, "it rides like a cloud", 0.0, d=-1.5); KF(LIFT, "rubber and San Antonio heat", 1.0)
BADP("rubber and San Antonio heat are not friends", 5.0, "air")
B("Sitting in a parking", "ltx:r4_heatlot|r461", "swipeR", why="la reverberación del estacionamiento a mediodía")
# AV 197.8-203.8
B("tiny cracks. The air leaks out", "img:r408", "cut", why="Ramón muestra el fuelle rajado")
B("until one day it burns itself out", "ltx:r4_compressor|r462", "cut", why="el compresor caliente echando humo")
O("burns itself out", "stamp", 2.2, text="BURNED OUT", col="#ff4a3d", rot=6, x=1450, y=760)
# AV 214.3-218.9
B("air springs cracked the compressor tired", "img:r407", "cut", why="Ramón agachado junto a la rueda caída")
B("I found oil on the bottom of the engine", "img:r410", "swipeL", why="la linterna en la panza aceitosa")
B("one of them was dripping right onto the belt", "ltx:r4_oildrip|r410", "cut", why="el aceite goteando sobre la correa")
EV("drip", "one of them was dripping right onto the belt", 6)
# AV 232.6-238.3 (el cartón)
O("wrote the numbers on a piece of cardboard", "cardboard", 22.0, rows=[{"at": "two air springs around $700", "item": "2 AIR SPRINGS", "v": 1400}, {"at": "the compressor around $600", "item": "COMPRESSOR", "v": 600}, {"at": "the gaskets and the labor on top", "item": "GASKETS + LABOR", "v": 1800}], totalAt="the labor on top a little more", total="$3,800+", carAt="Half the price of the car three months", car=8900)
B("each and that's the cheap brand", "ltx:r4_cardboard|r409", "cut", why="la mano con el marcador en el cartón")
B("the gaskets and the labor on top", "img:r409", "cut", why="Ramón escribe los precios")
# AV 249.0-254.9
B("Now here's the thing nobody tells you", "ltx:r4_depreciation|r463", "swipeR", why="la fila de sedanes de lujo usados con precio")
B("car was cheap because the people who knew", "w:bay1", "portal", why="el sedán en el elevador 3D")
# AV 265.6-269.3
O("lose more than half their value", "count", 4.4, from_=100, to=45, dur=2.0, suf="%", sub="value left after 5 years", x=1400, y=420)
B("the first five years and they keep falling", "bk", "zoom", why="contador: valor que queda")
B("The price is not a gift", "img:r463", "cut", why="el sedán caído con cartel de venta")
O("The price is a warning", "stamp", 2.8, text="THE PRICE IS A WARNING", col="#ff4a3d", rot=-5, x=960, y=820, size=80)
# AV 282.5-288.1
O("he lost almost five thousand dollars", "drop", 4.0, v="-$5,000", label="IN 4 MONTHS", x=1450, y=430)
B("he lost almost five thousand dollars", "ph:r463", "cut", why="la pérdida sobre el auto en venta")
B("Then he bought a plain little sedan", "ltx:r4_church|r493", "swipeL", why="el sedán sencillo que sigue andando")
B("So here's my rule for number one", "w:bench", "portal", why="la regla #1")
# AV 300.4-305.6
O("ask the price of three things", "threeparts", 12.0, items=[{"at": "a front strut or air spring", "tx": "STRUT", "v": 700}, {"at": "a headlight", "tx": "HEADLIGHT", "v": 900}, {"at": "and a water pump", "tx": "WATER PUMP", "v": 650}], rentAt="more than a month of your rent")
B("ask the price of three things", "ltx:r4_partsphone|r411", "cut", why="el teléfono del mostrador de repuestos")
B("If those three numbers together", "bk", "zoom", why="la balanza: 3 repuestos vs un mes de alquiler")
# AV 317.9-322.6
B("it's been sitting all night", "img:r412", "cut", why="Ramón al amanecer mirando la altura del auto")
O("If one corner is lower than the others", "stamp", 3.2, text="SAVED $4,000", col="#3fd17a", rot=-6, x=1420, y=760)
B("Number two is the one I see the most", "img:r403", "swipeL", why="Ramón bajo el sedán en el elevador")

# =====================================================================================================================
# #2 LA CVT TEMPRANA (5:34)
# =====================================================================================================================
# AV 334.4-338.8
B("if you hear that noise on a test drive", "ltx:r4_testdrive|r416", "cut", why="por el parabrisas en el test drive")
O("you walk, you don't argue", "chips", 4.0, items=["YOU WALK", "DON'T ARGUE", "DON'T NEGOTIATE"], y=880)
O("Number two, The early continuously", "chapter", 4.6, n="2", title="The early CVT", sub="continuously variable transmission · the first ones")
B("Number two, The early continuously", "bk", "zoom", why="capítulo 2")
# AV 351.0-356.4
B("A normal automatic has gears", "img:r413", "cut", why="Ramón dibuja los conos con tiza")
O("It has two cones like two funnels", "cvt", 27.0, heatAt="the fluid in that transmission cooks", slipAt="the belt starts to slip on the cones")
B("It has two cones like two funnels", "bk", "zoom", why="la CVT animada: conos + correa")
# AV 369.4-374.9
B("No shifting. good idea saves gas", "ltx:r4_cones|r464", "cut", why="la CVT en corte girando")
B("now think about san antonio", "bk", "zoom", why="la CVT sigue, empieza el calor")
# AV 386.1-390.5
B("degrees outside the engine hot", "ltx:r4_410|r414", "cut", why="el 410 parado a las 5 de la tarde")
O("102 degrees", "big", 2.6, d=0, text="102°F", sub="Loop 410 · 5 PM", x=1500, y=300, size=150, col="#ff6a3d")
B("the fluid in that transmission cooks", "ltx:r4_fluidcook|r465", "cut", why="el fluido quemado cayendo al balde")
# AV 400.8-404.6
B("A nurse named Gloria came to see me", "img:r415", "cut", why="Gloria de ambo azul en el mostrador")
B("in converse and she drives to the hospital", "ltx:r4_converse|r469", "swipeL", why="la calle de Converse al amanecer")
O("in converse and she drives", "map", 4.2, pins=[{"at": "in converse", "l": "converse", "tx": "CONVERSE"}], x=1450, y=520, sc=0.7)
# AV 417.4-422.8
B("getting on I-35 at Walsham Road", "ltx:r4_onramp|r466", "cut", why="la crossover en la rampa de la I-35")
B("A truck behind", "img:r468", "cut", why="la camioneta frenando atrás")
# AV 434.1-438.9
B("I drove it around the block", "img:r416", "cut", why="Ramón saca la crossover del taller")
B("like driving over the grooves on the shoulder", "ltx:r4_shoulder|r472", "cut", why="las ruedas sobre las estrías de la banquina")
O("there was a shudder", "stamp", 2.6, text="SHUDDER", col="#ffb257", rot=-6, x=1450, y=320)
# AV 451.4-455.9
B("like a vacuum cleaner in the next room", "img:r417", "cut", why="Ramón escuchando, radio apagada")
O("That's the noise", "chips", 3.6, items=["SHUDDER", "+ WHINE", "= DAMAGED"], y=880)
B("When you feel that, the belt and the cones", "w:xray", "portal", why="rayos X: la caja encendida")
EV("xray", "When you feel that, the belt and the cones", 7); BADP("When you feel that, the belt and the cones", 6.5, "trans")
# AV 468.2-474.0
O("two hundred dollars installed", "drop", 4.6, d=-0.2, v="$4,200", label="NEW TRANSMISSION", x=1450, y=440)
B("and ten maybe eight hundred but who knows", "ltx:r4_junkyard|r467", "cut", why="el Pick-n-Pull de la 410")
B("a car worth maybe five thousand", "img:r469", "cut", why="la crossover con precio en el vidrio")
# AV 486.0-490.6
B("got its fluid changed on time", "img:r418", "cut", why="Ramón mira la varilla de la caja a la luz")
O("10 years or a hundred and twenty thousand", "chips", 4.0, items=["WARRANTY EXTENDED", "10 YEARS", "120,000 MI"], y=880)
B("so many of them were coming back", "w:engine", "portal", why="el motor de la SUV abierto")
EV("hood", "so many of them were coming back", 14)
# AV 504.6-509.6
B("factory knows so here's what I do", "img:r405", "cut", why="Ramón: lo que hago yo")
O("roughly 2007 to 2015 with", "big", 3.2, text="2007–2015", sub="+100,000 miles", x=1450, y=360, size=150)
B("a small crossover from those early years", "ph:r469", "swipeL", why="la crossover en el lote")
# AV 521.2-525.5
B("when the transmission fluid was changed", "ltx:r4_fluidpaper|r418", "cut", why="la carpeta de recibos")
O("not the oil the transmission fluid", "stamp", 2.8, text="TRANSMISSION FLUID", col="#ff6a8a", rot=-5, x=1300, y=800, size=80)
O("every 30,000 to 50,000 miles", "big", 3.0, text="30–50K", sub="miles · in this heat", x=1450, y=360, size=160)
# AV 535.7-539.1
B("I drive it 20 minutes", "ltx:r4_testdrive|r419", "cut", why="test drive largo")
O("I don't drive it five minutes", "drive", 5.0, from_="5 MIN", to="20 MIN", flipAt="I drive it 20 minutes")
B("shows its face when it's hot", "img:r419", "cut", why="Ramón mira el reloj manejando")
# AV 551.3-556.8
B("That's where the shutter lives", "ltx:r4_redlight|r472", "cut", why="el semáforo y la salida suave")
O("15 to", "big", 2.8, d=-0.5, text="15→40", sub="mph · gentle", x=1450, y=330, size=150)
B("Air on low. And I listen", "img:r417", "cut", why="radio off, escuchar")
# AV 568.9-574.3
B("a automatic now and she says she sleeps better", "w:wide", "zoom", why="el taller tranquilo")
O("you can is $4,200", "drop", 3.6, v="$4,200", label="THE PRICE OF SLEEP", col="#3fd17a", x=1450, y=430)
B("number three is a cousin of number two", "w:board", "portal", why="el tablero de herramientas")

# =====================================================================================================================
# #3 EL DOBLE EMBRAGUE SECO (9:45)
# =====================================================================================================================
# AV 585.1-589.6
B("the sellers have a sentence they always say", "img:r422", "cut", why="la ceja levantada")
O("three the dry dual clutch", "chapter", 4.6, n="3", title="The dry dual-clutch", sub="small economy cars · 2011–2016")
B("three the dry dual clutch", "bk", "zoom", why="capítulo 3")
# AV 601.9-607.8
O("a dual clutch is a manual transmission", "dct", 22.0, dryAt="dry dry means the clutches")
B("a dual clutch is a manual transmission", "bk", "zoom", why="el doble embrague: impares/pares")
# AV 618.4-623.0
B("some of the small cheap cars got a version", "ltx:r4_dctcut|r470", "cut", why="la caja de doble embrague en corte")
B("like the clutch in your old pickup", "img:r420", "cut", why="Ramón muestra el disco gastado")
# AV 636.3-641.0
B("a sweet lady from Leon Valley", "img:r421", "cut", why="Mrs. Delgado de espaldas con Ramón")
B("for her grandson when he started a UTSA", "ltx:r4_utsa|r471", "swipeL", why="el sedán azul entrando al campus")
O("for her grandson when he started", "map", 3.6, pins=[{"at": "a sweet lady from Leon Valley", "l": "leonvalley", "tx": "MRS. DELGADO"}], x=1450, y=520, sc=0.65)
# AV 652.0-656.4
O("very low for the age", "chips", 3.2, items=["12 YEARS", "68,000 MI", "$5,500"], y=880)
B("grandma the car shakes", "ltx:r4_cattleguard|r472", "cut", why="el auto sobre el guardaganado, temblando")
# AV 665.4-670.8
B("they all do that", "img:r422", "cut", why="la cara de Ramón ante la frase")
O("they all do that", "quote", 4.4, text="Ma'am, that's normal. They all do that.", who="the man who sold it", y=520)
B("he's half right a lot of them do that", "w:xray", "portal", why="rayos X: la caja")
EV("xray", "he's half right a lot of them do that", 6.5); BADP("he's half right a lot of them do that", 6, "trans")
# AV 682.8-688.2
B("oil from a leaking seal getting on the clutch", "ltx:r4_seal|r420", "cut", why="el retén llorando aceite")
B("the little computer that runs the transmission", "ltx:r4_neutral|r459", "cut", why="la palanca parpadeando en el semáforo")
# AV 699.1-703.9
O("two thousand dollars the module around 900", "chips", 4.4, items=["CLUTCH $1,500–2,000", "MODULE ~$900"], y=880)
B("two thousand dollars the module", "img:r420", "cut", why="el disco otra vez en la mano")
B("the new clutch can start shuddering again", "w:board", "portal", why="el tablero: el diseño es el diseño")
# AV 716.6-722.1
B("were warranty extensions seven years", "img:r473", "cut", why="papeles legales y factura en la mesa")
O("low miles don't save", "stamp", 2.8, text="LOW MILES DON'T SAVE YOU", col="#ff4a3d", rot=-5, x=960, y=820, size=74)
# AV 735.2-740.6
B("the number on the little plate at the", "ltx:r4_vinplate|r474", "cut", why="la placa del VIN bajo el parabrisas")
O("the number on the little plate", "tag", 3.4, x=900, y=620, text="17-CHARACTER VIN", col="#8fd6ff")
# AV 750.3-756.3
O("free. It takes 30 seconds", "web", 13.0, url="nhtsa.gov/recalls", title="Check for open recalls", lines=[{"at": "an open recall that was never fixed", "tx": "✓ 30 seconds · free"}, {"at": "the word shutter", "tx": "search: “shudder”", "col": "#b3261e"}])
B("free. It takes 30 seconds", "ltx:r4_laptop|r492", "cut", why="la laptop vieja en el banco")
B("If you find a thousand", "bk", "zoom", why="la web sigue: mil quejas")
# AV 769.9-774.6
B("creep. Let it roll in traffic", "img:r424", "cut", why="Ramón en la rampa del estacionamiento")
O("Do it 10 times", "big", 2.6, text="×10", sub="creep · gas · brake", x=1480, y=330, size=170)
B("Go up the ramp in a parking garage", "ltx:r4_garage|r475", "swipeL", why="la rampa del garage cerca del Alamodome")
# AV 786.3-790.2
O("it shakes if it rolls back", "chips", 3.6, items=["SHAKES?", "ROLLS BACK?", "CLUNKS?"], y=880)
B("you thank the man and you go home", "ph:r475", "cut", why="el garage del Alamodome")
B("you know mr kowalski the veteran", "ltx:r4_f150|r425", "swipeR", why="la F-150 blanca frente al taller")
# AV 800.0-804.7
B("says ramon you don't buy a car", "w:truck", "portal", why="la F-150 de Kowalski en la bahía 3")
O("you don't buy a car", "quote", 5.4, text="You don't buy a car. You buy a transmission, and the engine comes free.", who="Mr. Kowalski · Fort Sam", y=560)
O("more than 300,000 miles", "count", 3.6, from_=0, to=300000, dur=1.6, suf=" mi", sub="the 2004 F-150", x=1400, y=300, size=120)
# AV 817.0-822.1
B("Kowalski would never in his life", "img:r425", "cut", why="Ramón y Kowalski riéndose junto a la F-150")
O("and say nope next", "stamp", 2.4, text="NOPE. NEXT.", col="#ff4a3d", rot=-7, x=1420, y=320)
B("number four is the one that is sneaky", "w:engine", "portal", why="el motor: el sigiloso")
EV("hood", "number four is the one that is sneaky", 16)

# =====================================================================================================================
# #4 EL QUE QUEMA ACEITE (14:00)
# =====================================================================================================================
# AV 833.0-837.8
B("until one day a light comes on", "img:r459", "cut", why="la luz en el tablero")
B("the engine has been drinking", "img:r426", "cut", why="Ramón saca la varilla casi seca")
O("Not gas, oil", "stamp", 2.0, text="OIL", col="#ffb257", rot=-8, x=1450, y=330, size=130)
O("Number four, the", "chapter", 4.2, d=0.4, n="4", title="The oil burner", sub="2007–2011 · by design")
# AV 849.2-853.3
B("2007 to 2011 that started burning oil", "bk", "zoom", why="capítulo 4 sigue")
B("One example I see a lot is a 2.4", "w:xray", "portal", why="rayos X: el motor encendido")
EV("xray", "One example I see a lot is a 2.4", 6.5); BADP("One example I see a lot is a 2.4", 6, "engine")
# AV 865.5-871.3
O("the piston rings the little rings", "rings", 13.0, clogAt="Over time the small holes", oilAt="starts sneaking up past them")
B("the piston rings the little rings", "ltx:r4_piston|r476", "cut", why="el pistón con sus aros girando en la mano")
# AV 882.2-886.9
B("starts sneaking up past them and burning", "bk", "zoom", why="los aros: el aceite sube y se quema")
B("Another group is some of the V6 engines", "w:engine", "portal", why="el V6 que apaga cilindros")
EV("hood", "Another group is some of the V6 engines", 12)
O("shut off half the cylinders", "chips", 3.6, items=["V6 · 2008–2013", "HALF THE CYLINDERS OFF"], y=880)
# AV 899.8-905.4
B("their spark plugs and start burning oil too", "img:r431", "cut", why="la bujía aceitosa frente a cámara")
O("I've seen a quart every thousand", "quarts", 10.5, dur=6.0)
B("I've seen a quart every thousand", "bk", "zoom", why="los cuartos que se van")
# AV 917.9-922.3
B("that's when the bearings start to knock", "ltx:r4_lowoil|r426", "cut", why="la varilla casi seca")
O("the bearings start to knock", "chips", 3.4, items=["BEARINGS KNOCK", "CHAIN RATTLES"], y=880)
# AV 933.1-936.9
B("people steal those right out from", "ltx:r4_catthief|r477", "cut", why="el estacionamiento del H-E-B de noche")
B("a man named Teodoro from the south side", "img:r427", "cut", why="Teodoro con el catalizador tapado")
O("a man named Teodoro", "map", 3.4, pins=[{"at": "a man named Teodoro", "l": "southside", "tx": "TEODORO"}], x=1450, y=520, sc=0.65)
# AV 949.1-954.8
B("he noticed a little blue smoke", "ltx:r4_bluesmoke|r478", "cut", why="el humo azul del escape a la mañana")
B("the catalytic converter was gone", "ltx:r4_cat|r427", "cut", why="el catalizador oxidado en el banco")
O("the catalytic converter was gone", "drop", 3.6, v="$1,700", label="CATALYTIC CONVERTER", x=1450, y=440)
# AV 966.8-972.6
B("he thought that was normal", "w:pan", "portal", why="el cárter del sedán en el elevador")
EV("smoke", "he thought that was normal", 6); BADP("he thought that was normal", 5.5, "oil")
O("they don't now let me", "stamp", 2.2, text="THEY DON'T", col="#ff4a3d", rot=-7, x=1420, y=320)
B("Ellison some of you know her", "ltx:r4_heb|r428", "swipeL", why="el H-E-B de Bandera Road un sábado")
O("Retired school teacher, 2009", "chips", 3.0, items=["MRS. ELLISON", "2009", "212,000 MI"], y=880)
# AV 985.4-990.1
B("Every Saturday morning when she does", "ph:r428", "cut", why="Mrs. Ellison con el capot abierto, Ramón aprueba")
O("at the HEB on Bandera", "map", 4.2, pins=[{"at": "at the HEB on Bandera", "l": "bandera", "tx": "H-E-B · BANDERA RD"}], x=1450, y=520, sc=0.7)
B("checks her oil with a", "ltx:r4_papertowel|r479", "cut", why="la toalla de papel en la varilla")
# AV 1002.4-1007.3
B("keeps a bottle in the trunk", "img:r479", "cut", why="el baúl con la botella de aceite")
O("I taught fourth grade for 31 years", "quote", 5.0, text="I taught fourth grade for thirty-one years. I know how to check homework.", who="Mrs. Ellison", y=560)
B("That's the difference. If you already own", "w:bench", "portal", why="el banco")
# AV 1019.2-1024.2
B("First, put your finger inside the tailpipe", "img:r429", "cut", why="Ramón con el dedo en el escape")
B("If it comes out black and oily", "ltx:r4_tailpipe|r429", "cut", why="el dedo sale negro")
O("black and oily wet", "chips", 3.6, items=["BLACK + OILY = BURNER", "DRY GRAY = OK"], y=880)
# AV 1036.9-1042.0
B("and watch the exhaust in the mirror", "img:r430", "cut", why="Ramón mira el humo azul en el espejo")
B("third pull the dipstick", "img:r426", "cut", why="la varilla")
# AV 1054.3-1059.0
B("not a gift either sometimes that's somebody hiding", "ph:r418", "cut", why="aceite nuevo dorado = esconder")
O("hiding the evidence", "stamp", 2.8, text="HIDING THE EVIDENCE", col="#ff4a3d", rot=-5, x=1300, y=800, size=80)
B("a real oil change has a sticker", "img:r451", "cut", why="la carpeta de recibos")
# AV 1068.7-1073.4
B("oily plug doesn't lie now before I tell you", "ph:r431", "cut", why="la bujía aceitosa")
B("any car can bite any", "w:wide", "zoom", why="el taller entero")

# =====================================================================================================================
# LA PRUEBA DE LOS 10 MINUTOS (18:06)
# =====================================================================================================================
# AV 1086.0-1091.5
B("My son Junior hates this part", "img:r432", "cut", why="Ramón y Junior en el mostrador")
O("My son Junior hates this part", "tag", 3.6, x=760, y=400, text="JUNIOR", sub="runs the front counter")
# AV 1102.3-1106.6
O("That's better. The 10-minute test", "tenmin", 225.0, rows=[{"at": "One, the code start", "tx": "Cold start"}, {"at": "Two, look at the ground", "tx": "The ground"}, {"at": "three open the hood", "tx": "Oil cap + coolant"}, {"at": "for the tires look at all four", "tx": "The tires"}, {"at": "Five, look down the side", "tx": "Paint + bolts"}, {"at": "6. The air conditioning", "tx": "The A/C"}, {"at": "7. And this is my favorite", "tx": "The $20 scanner"}])
B("That's better. The 10-minute test", "w:wideR", "portal", why="la lista de los 10 minutos entra")
B("When you call the seller", "ltx:r4_coldstart|r433", "cut", why="el sedán arrancando al amanecer")
B("you put your hand on the hood", "img:r433", "cut", why="la mano en el capot")
# AV 1119.1-1124.1
O("Rattles that start up, smoke", "chips", 3.4, items=["RATTLES", "SMOKE", "HARD START"], y=900)
B("at the ground. Where the car has been parked", "ltx:r4_ground|r434", "cut", why="las manchas en el piso")
O("Black spots oil", "puddles", 13.5, items=[{"at": "Black spots oil", "col": "#141008", "tx": "BLACK", "sub": "oil"}, {"at": "or pink transmission fluid", "col": "#c2203a", "tx": "RED / PINK", "sub": "transmission"}, {"at": "green or orange and", "col": "#3fae4a", "tx": "GREEN / ORANGE", "sub": "coolant"}, {"at": "clear water under the front", "col": "#9fd2ee", "tx": "CLEAR", "sub": "A/C · normal", "ok": True}])
# AV 1136.6-1141.2
B("a little sweet smelling coolant", "img:r480", "cut", why="el charco rojo")
B("that's just the air conditioning dripping", "ltx:r4_acdrip|r434", "cut", why="el agua del aire goteando")
# AV 1151.1-1155.1
B("there's a creamy milky stuff", "ltx:r4_milky|r435", "cut", why="la tapa con la crema")
O("like a chocolate milkshake", "tag", 3.4, x=1000, y=480, text="HEAD GASKET?", col="#ff6a3d")
B("then look in the coolant reservoir", "img:r435", "cut", why="Ramón muestra la tapa")
# AV 1168.7-1172.8
B("one you walk for the tires", "ltx:r4_rainbow|r481", "cut", why="el arcoíris en el refrigerante")
B("three or one brand and one is different", "ltx:r4_tires|r482", "cut", why="las 4 cubiertas, una distinta")
# AV 1184.8-1189.3
B("alignment is off maybe from a pothole", "img:r436", "cut", why="la cubierta lisa por dentro")
O("for the dot code the last four", "dot", 16.0, code="2119", splitAt="the week and the year it was made", ruleAt="in our heat i don't trust a tire")
B("for the dot code the last four", "ltx:r4_dot|r437", "cut", why="el código DOT en el costado")
# AV 1198.8-1203.0
B("the 21st week of 2019", "bk", "zoom", why="el código se parte: semana / año")
B("the rubber cooks from the inside", "img:r437", "cut", why="Ramón lee el código")
# AV 1215.2-1221.4
B("If one door is a slightly different color", "ltx:r4_reflection|r438", "cut", why="el reflejo ondulado en la chapa")
B("Open the hood and look at the bolts", "img:r439", "cut", why="el bulón del guardabarros")
O("that panel has been repainted", "stamp", 2.6, text="REPAINTED", col="#ffb257", rot=-6, x=1400, y=320)
# AV 1233.5-1237.9
B("But it's a question and you want an answer", "img:r438", "cut", why="Ramón agachado mirando el costado")
B("This is San Antonio. Turn it on max", "ltx:r4_thermo|r440", "cut", why="el termómetro en la rejilla")
# AV 1250.6-1254.7
O("minutes it should read around 40 to 45", "big", 3.2, text="40–45°F", sub="at the vent", x=1460, y=330, size=150, col="#8fd6ff")
B("minutes it should read around 40", "img:r440", "cut", why="Ramón mide")
O("an AC compressor can run", "drop", 3.4, v="$1,200", label="A/C COMPRESSOR", x=1450, y=440)
# AV 1266.8-1272.9
B("Buy a little code reader", "ltx:r4_obd|r441", "cut", why="la mano enchufa el escáner")
O("since 1996 has that plug", "tag", 3.0, x=900, y=640, text="SINCE 1996", col="#8fd6ff")
B("since 1996 has that plug", "img:r483", "cut", why="el puerto OBD")
# AV 1283.8-1289.7
O("it can mean somebody just cleared the codes", "scanner", 14.0, monAt="it can mean somebody just cleared", notAt="right before you showed up")
B("it can mean somebody just cleared the codes", "img:r441", "cut", why="Ramón con el escáner")
B("A car that's been driven normally", "bk", "zoom", why="el escáner: NOT READY")
# AV 1303.0-1307.2
B("you pay an independent shop", "ltx:r4_inspection|r442", "cut", why="el auto subiendo, linterna")
O("you pay an independent shop", "big", 3.2, text="$100–150", sub="a lift + an honest look", x=1450, y=330, size=140)
B("to put it on a lift and look underneath", "w:under", "portal", why="la panza en el elevador 3D")
KF(LIFT, "to put it on a lift and look underneath", 1.0)
# AV 1318.2-1322.5
B("I've talked many more people out of buying", "img:r442", "cut", why="Ramón con la pareja bajo el auto")
B("My wife Marta has her own rule", "img:r443", "swipeL", why="Marta levantando el dedo en la cocina")
# AV 1333.3-1337.8
O("you're not. When somebody says", "quote", 5.4, d=-1.0, text="If the seller is in a hurry, you're not.", who="Marta", y=560)
B("When somebody says another buyer", "ph:r443", "cut", why="la cocina")
B("Number five, the one nobody checks", "w:suvlow", "portal", why="la SUV baja: la #5")

# =====================================================================================================================
# #5 EL AUTO INUNDADO (22:30)
# =====================================================================================================================
# AV 1350.1-1354.8
O("Number five, the flood car", "chapter", 4.6, n="5", title="The flood car", sub="any car · the one nobody checks")
B("Number five, the flood car", "bk", "zoom", why="capítulo 5")
B("In August of 2017, Hurricane Harvey", "ltx:r4_harvey|r484", "cut", why="Houston inundada desde el aire")
# AV 1366.4-1371.3
B("Some places got more than 50 inches", "img:r485", "cut", why="el pluviómetro rebalsado")
O("Some places got more than 50 inches", "big", 2.8, text="50+ in", sub="of rain", x=1460, y=330, size=160, col="#8fd6ff")
O("between half a million and a million", "route", 15.5, countAt="between half a million and a million", goAt="Houston is three hours east")
B("between half a million and a million", "bk", "zoom", why="1.000.000 + la ruta por la I-10")
# AV 1382.5-1386.7
B("Some of those cars got crushed", "ltx:r4_i10|r486", "cut", why="las madrinas con autos sucios por la I-10")
B("started traveling to auctions", "ltx:r4_auction|r486", "cut", why="miles de autos con la línea de barro")
# AV 1399.7-1406.1
O("they call that title washing", "stamp", 2.8, text="TITLE WASHING", col="#ff4a3d", rot=-5, x=1300, y=800, size=90)
B("know what they call this part of Texas", "ltx:r4_lowwater|r487", "cut", why="el cruce bajo con agua marrón")
O("flash flood alley", "tag", 3.6, x=960, y=420, text="FLASH FLOOD ALLEY", col="#8fd6ff")
B("Leon Creek and the car floats", "img:r487", "cut", why="el cruce bajo")
# AV 1417.4-1421.1
B("young man named Adrian came into my shop", "img:r444", "cut", why="Adrian y su esposa embarazada")
B("a midsize SUV, a 2015, for $14,000", "ltx:r4_newsuv|r488", "cut", why="la SUV con globos")
O("a midsize SUV, a 2015, for $14,000", "chips", 3.4, items=["2015", "$14,000", "CLEAN REPORT"], y=880)
# AV 1434.7-1439.3
B("The windows would go down by themselves", "ltx:r4_windows|r489", "cut", why="las ventanillas bajando solas de noche")
O("ABS light would come on", "chips", 3.4, items=["WINDOWS", "ABS LIGHT", "CHECK ENGINE"], y=880)
# AV 1449.2-1453.6
B("And after it rained, the inside smelled", "ltx:r4_radio|r489", "cut", why="la radio que se prende sola")
B("the lift. And then I did the thing", "w:suvlow", "portal", why="la SUV en el taller 3D: aparece la marca")
EV("flood", "the lift. And then I did the thing", 46)
# AV 1463.4-1468.8
B("silt. Dry now, but you could write", "ltx:r4_silt|r445", "cut", why="el barro gris bajo la alfombra")
B("The bolts that hold the seats to the floor", "img:r490", "cut", why="los bulones oxidados del asiento")
O("those bolts should look like the day", "stamp", 2.6, text="RUST = WATER", col="#ffb257", rot=-6, x=1400, y=330)
# AV 1482.5-1488.1
B("the part that's always rolled up inside", "ltx:r4_belt|r446", "cut", why="la punta del cinturón con la línea marrón")
B("in the back mud little pebbles", "ltx:r4_sparewell|r447", "cut", why="el hueco del auxilio con barro")
# AV 1499.3-1503.9 (seats … sold it)
O("seats somebody had dried it", "flood", 9.0, d=-1.0, riseAt="seats somebody had dried it", dryAt="put in new carpet on top")
B("sold it i had to tell adrian", "img:r448", "cut", why="Ramón cabizbajo")
B("junior brought her", "img:r432", "cut", why="Junior y Ramón en el mostrador")
# AV 1514.3-1519.5
B("a modern car has miles of wires", "ltx:r4_connector|r491", "cut", why="el conector con la corrosión verde")
B("They corrode slowly", "img:r491", "cut", why="el conector")
O("They corrode slowly", "chips", 3.6, d=0.4, items=["6 MONTHS", "A YEAR", "A YEAR AND A HALF"], y=880)
# AV 1532.2-1537.2
B("the brakes, the airbags", "w:xray", "portal", why="rayos X: la SUV entera")
EV("xray", "the brakes, the airbags", 9)
O("a hundred things forever", "stamp", 2.6, text="100 THINGS · FOREVER", col="#ff4a3d", rot=-5, x=1300, y=800, size=80)
# AV 1547.0-1551.6
O("flood car is the problem", "quote", 4.4, d=-1.4, text="A flood car is not a car with a problem. A flood car is the problem.", who="Ramón", y=560)
B("Adrian got a lawyer and it took", "img:r473", "cut", why="los papeles del abogado")
B("Here is how you check and it", "w:suvlow", "portal", why="la SUV: cómo se revisa")
# AV 1564.8-1569.6
B("musty smell like an old basement", "img:r449", "cut", why="Ramón olfateando con las puertas cerradas")
O("car that smells like 10 air fresheners", "stamp", 2.4, text="10 AIR FRESHENERS = HIDING", col="#ffb257", rot=-5, x=1250, y=800, size=70)
# AV 1581.3-1586.3
B("for silt, rust or water stains", "img:r445", "cut", why="Ramón levanta la alfombra")
B("look at the seat bolts and the screws", "ph:r490", "cut", why="los bulones")
# AV 1595.3-1599.2
B("Fifth, look inside the headlights", "ltx:r4_headlight|r450", "cut", why="el faro con la línea de agua")
B("in the trunk and look in the spare tire well", "img:r447", "cut", why="Ramón señala el barro del auxilio")
B("Go to the website of the National", "img:r492", "swipeL", why="la laptop en el banco")
# AV 1612.7-1618.1
O("that reports to them paid out", "web", 11.0, d=-0.6, url="nicb.org/vincheck", title="VINCheck · free", lines=[{"at": "paid out on that car as a flood", "tx": "FLOOD · TOTAL LOSS", "col": "#b3261e"}, {"at": "even if the title got washed", "tx": "even if the title was washed"}])
B("that reports to them paid out", "bk", "zoom", why="la web del NICB")
# AV 1629.0-1634.7
B("If a car spent the fall of 2017 in Harris County", "ph:r486", "cut", why="la subasta de autos inundados")
O("in Harris County, and then suddenly appears", "chips", 3.6, items=["FALL 2017 · HARRIS COUNTY", "→ NEW STATE, NEW TITLE"], y=880)
B("So let me tell you what I would buy instead", "w:wide", "zoom", why="el taller: qué compraría")

# =====================================================================================================================
# QUÉ COMPRARÍA + REPASO + CIERRE (27:30)
# =====================================================================================================================
# AV 1646.9-1651.5
O("A plain engine without a turbo", "chips", 10.0, items=["NO TURBO", "CHAIN OR EASY BELT", "AUTOMATIC WITH GEARS", "POPULAR = PARTS"], y=880)
B("A plain engine without a turbo", "w:engine", "portal", why="el motor sencillo")
EV("hood", "A plain engine without a turbo", 12)
B("A car that's popular so the", "ph:r467", "cut", why="el Pick-n-Pull")
# AV 1664.7-1669.9
B("I'll take a boring car with a folder", "img:r451", "cut", why="la carpeta junto al sedán beige")
B("a sedan that some retired couple drove to church", "ltx:r4_church|r493", "cut", why="el sedán en la iglesia el domingo")
# AV 1681.1-1687.6
B("Those are not exciting. They're boring", "img:r493", "cut", why="el sedán grande de V6")
B("boring is beautiful when you're on the 410", "ltx:r4_410night|r494", "cut", why="el 410 de noche")
O("boring is beautiful", "stamp", 2.6, text="BORING IS BEAUTIFUL", col="#3fd17a", rot=-5, x=960, y=800, size=84)
O("Let me give you the five again", "quote", 1.0, text="", who="", y=-999)  # (marcador vacío para el cursor)
B("Let me give you the five again", "bk", "zoom", why="el repaso: la lista de 5")
O("Let me give you the five again", "tenmin", 54.0, title="THE 5 I NEVER BUY", rows=[{"at": "1. The luxury car at", "tx": "Luxury at economy price"}, {"at": "early CVT with high miles", "tx": "Early CVT, no records"}, {"at": "3. The dry dual clutch", "tx": "Dry dual-clutch"}, {"at": "oil burner. Finger in the tailpipe", "tx": "The oil burner"}, {"at": "5. The flood car. The one nobody checks", "tx": "The flood car"}])
# AV 1700.8-1705.7 (mientras el avatar, la lista queda)
# AV 1717.6-1722.6
# AV 1733.4-1738.0
O("$100 to a shop you trust", "big", 3.6, d=0.5, text="$100", sub="the cheapest insurance", x=1460, y=330, size=170, col="#3fd17a")
B("to a shop you trust", "w:bay1", "portal", why="el elevador")
B("Junior was at the counter", "img:r452", "swipeL", why="Ramón y la chica en el mostrador")
O("to buy that afternoon. A small crossover", "chips", 3.6, items=["EARLY CVT", "130,000 MI", "NO RECORDS"], y=880)
# AV 1766.1-1771.1
B("She didn't buy it. We didn't make a dollar", "ph:r452", "cut", why="el mostrador")
B("on her car and you're giving her advice", "ltx:r4_counter|r402", "swipeR", why="el portón bajando al atardecer")
# AV 1781.8-1787.2
B("her brother's. That's how a shop on Zarzamora", "w:sign", "portal", why="el cartel TREVIÑO AUTO REPAIR · 1988")
B("say the car doesn't lie", "img:r453", "fade", why="Ramón con la mano en el capot, luz dorada")
O("say the car doesn't lie", "quote", 9.0, text="The car doesn't lie. The seller lies. The car always tells you the truth.", who="Don Chuy Garza", y=560)
# AV 1798.5-1802.5
B("Now you know how to listen. If this helped", "w:wide", "zoom", why="el taller")
O("If this helped you subscribe", "chips", 3.8, items=["🔔 SUBSCRIBE"], y=880)
O("tell me in the comments what's the car", "comment", 6.0, text="What's the car you bought that bit you? Year · model · miles 👇", x=1200, y=780)
# AV 1812.5-1816.6
B("I read him at night with Marta", "ph:r404", "cut", why="la cocina de noche")
B("Mr. Kowalski's F-150, the 2004", "w:cab", "portal", why="el tablero de la F-150")
EV("odo", "Mr. Kowalski's F-150, the 2004", 0.1); KF(ODO, "Mr. Kowalski's F-150, the 2004", 1.0)
# AV 1828.5-1834.4
O("the original engine and the original transmission", "count", 4.0, d=-1.0, from_=0, to=318000, dur=2.0, suf=" mi", sub="original engine · original transmission", x=1400, y=320, size=120)
B("He got out, he handed me an old spiral notebook", "ltx:r4_notebook|r454", "cut", why="la libreta verde en el asiento")
B("tell him how we did it", "w:book", "portal", why="la libreta verde se abre en el banco 3D")
EV("book", "tell him how we did it", 14)
# AV 1846.2-1849.8
O("The sixth one costs about a dollar", "big", 3.4, text="$1", sub="rule #6 · next video", x=1460, y=330, size=200, col="#ffd60a")
B("The sixth one costs about a dollar", "img:r454", "cut", why="Ramón con la libreta")

# ---------------- medios disponibles ----------------
def clip_len(p):
    try: return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 2)
    except Exception: return 0.0
LTXD = PUB + f"{SL}/ltx/"; AGD = PUB + f"broll/{SL}/"; IMGD = PUB + f"{SL}/img/"
ltx_ok = {f[:-4] for f in os.listdir(LTXD) if f.endswith(".mp4")} if os.path.isdir(LTXD) else set()
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
    notes.append("¡pool de relleno vacío!"); return {"k": "bk", "src": f"{SL}/img/r455.jpg"}

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
    for kk in ("heatAt", "slipAt", "dryAt", "clogAt", "oilAt", "totalAt", "carAt", "rentAt", "splitAt", "ruleAt", "monAt", "notAt", "riseAt", "countAt", "goAt", "flipAt"):
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
GU = [dict(k='guia', a=a, b=round(a + 8.5, 2), pag=pg, note=nt) for a, pg, nt in [(86.1, '01_oil_change_600', 'Stop paying $100+ for $2 fixes'), (1042.0, '04_dash_lights', 'Read your own dash lights for $20')]]
ov = [o for o in ov if not any(o['a'] < g['b'] and o['b'] > g['a'] for g in GU)] + GU
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"], "src": g.get("src"), "len": g.get("len")} for i, g in enumerate(segs)]
json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))

# ---------------- el plan minuto a minuto (una línea por plano) ----------------
def mmss(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"
lines = [f"# {SL} · PLAN MxM (generado de plan_enrm04.py, escrito a mano plano por plano) · END {mmss(END)}", "mm:ss-mm:ss · frase · plano · componente · sonido", ""]
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
