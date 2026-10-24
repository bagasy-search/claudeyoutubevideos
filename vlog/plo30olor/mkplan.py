# mkplan.py — arma src/plo30olor/plan.json desde la VOZ: secciones, guion visual (beats) y piezas (fx), todo en el segundo
# en que se dice. Las frases se buscan en el GUION (texto exacto) y el tiempo sale de alinear guion ↔ palabras del ASR del
# corte (words.json), así los números escritos "treinta" vs "30" no rompen nada.
#   python vlog/plo30olor/mkplan.py
import json, re, os, unicodedata, difflib, sys
W = "D:/wt/plo30olor"; SRC = f"{W}/src/plo30olor"; PUB = f"{W}/public/plo30olor"
def norm(x):
    x = unicodedata.normalize("NFD", x.lower()); x = "".join(c for c in x if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9 ]", " ", x)
words = json.load(open(f"{SRC}/words.json", encoding="utf8"))
END = round(words[-1]["e"] + 1.2, 2)
aw = [norm(w["w"]).split() for w in words]
A, AT = [], []
for w, ws in zip(words, aw):
    for x in ws: A.append(x); AT.append(w["s"])
# guion: tokens con su línea y sección
lines = [l.strip() for l in open(f"{W}/vlog/plo30olor/guion.txt", encoding="utf8") if l.strip()]
G, GL, SECL = [], [], []
for i, l in enumerate(lines):
    m = re.match(r"\[(\w+)\]\s*(.*)", l); SECL.append(m.group(1))
    for x in norm(m.group(2)).split(): G.append(x); GL.append(i)
sm = difflib.SequenceMatcher(None, G, A, autojunk=False)
gt = [None] * len(G)
for a0, b0, n in sm.get_matching_blocks():
    for k in range(n): gt[a0 + k] = AT[b0 + k]
# interpolar huecos
known = [i for i, v in enumerate(gt) if v is not None]
print(f"alineado {len(known)}/{len(G)} palabras del guion", file=sys.stderr)
for i in range(len(gt)):
    if gt[i] is None:
        lo = max([k for k in known if k < i], default=None); hi = min([k for k in known if k > i], default=None)
        if lo is None: gt[i] = gt[hi]
        elif hi is None: gt[i] = gt[lo]
        else: gt[i] = gt[lo] + (gt[hi] - gt[lo]) * (i - lo) / (hi - lo)
def T(ph, after=0.0):
    q = norm(ph).split()
    for i in range(len(G) - len(q) + 1):
        if G[i:i + len(q)] == q and gt[i] >= after - 0.01: return round(gt[i], 2)
    sys.exit(f"⛔ no encuentro «{ph}» después de {after}")
# ---------------- secciones ----------------
starts = []
for i, l in enumerate(lines):
    j = GL.index(i); starts.append((SECL[i], round(gt[j], 2)))
META = {
 "D1": ("kitchen", 1, "EL FREGADERO", "DE LA COCINA"), "D2": ("lav", 2, "EL LAVABO", "EL TAPÓN AUTOMÁTICO"), "D3": ("shower", 3, "LA REGADERA", "PELO + ACONDICIONADOR"),
 "D4": ("tub", 4, "LA TINA", "Y EL REBOSADERO DE ABAJO"), "D5": ("floor", 5, "LA COLADERA DEL PISO", "LA QUE NADIE MOJA"), "D6": ("patio", 6, "LA COLADERA DEL PATIO", "SOL, TIERRA Y CUCARACHAS"),
 "D7": ("washer", 7, "LA LAVADORA", "LA MANGUERA QUE CHUPA"), "D8": ("dish", 8, "EL LAVAVAJILLAS", "EL FILTRO DEL FONDO"), "D9": ("toilet", 9, "EL INODORO", "¿ADENTRO O EN LA BASE?"),
 "D10": ("guest", 10, "EL BAÑO QUE NADIE USA", "TODOS LOS SIFONES SECOS"), "D11": ("over", 11, "EL REBOSADERO", "EL QUE NADIE LIMPIA"),
 "HOOK": ("lav",), "CAUSA": ("kitchen",), "RECETA": ("kitchen",), "DIAGNOSTICO": ("floor",), "ERRORES": ("kitchen",), "MAESTRO": ("lav",), "PREGUNTAS": ("vent",),
}
secs = []
for i, (k, a) in enumerate(starts):
    if secs and secs[-1]["k"] == k: continue
    secs.append({"k": k, "a": a})
for i, s in enumerate(secs):
    s["b"] = secs[i + 1]["a"] if i + 1 < len(secs) else END
    m = META.get(s["k"])
    if m:
        s["dk"] = m[0]
        if len(m) > 1: s["n"], s["name"], s["sub"] = m[1], m[2], m[3]
SA = {s["k"]: s["a"] for s in secs}
def sec(k): return SA[k]
# ---------------- eventos del mundo ----------------
ev = {
 "promise": sec("PROMISE"), "causa": sec("CAUSA"), "baba": T("cubiertos de baba"), "gasfab": T("Y cuando comen, sueltan un gas"), "receta": sec("RECETA"),
 "espuma": T("Después echas el vinagre"), "receta_fin": sec("DIAGNOSTICO"), "diagnostico": sec("DIAGNOSTICO"), "linterna": T("la de la linterna"),
 "d1": sec("D1"), "d1fix": T("En la cocina, la taza va con un paso extra"), "d2": sec("D2"), "d2fix": T("Así que en el lavabo, primero sacas el tapón"),
 "d3": sec("D3"), "d3fix": T("En la regadera, levanta la rejilla"), "d4": sec("D4"), "d4fix": T("En la tina, quita la tapa"),
 "d5seco": T("el agua se evapora"), "d5vaso": T("Le eché un vaso de agua"), "d5aceite": T("Y encima del agua, una cucharada de aceite"), "d6": sec("D6"),
 "d6seco": T("se seca en días"), "d6fix": T("En la coladera del patio, levanta la rejilla"), "d6aceite": T("el vaso de agua con la cucharada de aceite", sec("D6")), "regancho2": sec("REGANCHO2"),
 "d7chupa": T("la manguera chupa"), "d7fix": T("Lo que tienes que hacer: saca la manguera"), "d10": sec("D10"), "d10fix": T("Echa un vaso de agua en cada desagüe de ese baño"),
 "errores": sec("ERRORES"), "maestro": sec("MAESTRO"), "d11": sec("D11"), "d11canal": T("un canal escondido"), "d11fix": T("Así se limpia"), "rutina": sec("RUTINA"),
 "nido": T("con un nido de pájaro"), "variantes": sec("VARIANTES"),
}
# ---------------- piezas ----------------
fx = []
def F(type, a, out=None, dur=4.0, **kw):
    fx.append({"type": type, "a": a, "out": out if out is not None else round(a + dur, 2), **kw})
def nxt(a, ph): return T(ph, a)
# GANCHO
F("stamp", T("te pega en la cara"), dur=2.0, text="OLOR A CLOACA", size=110)
F("rows", T("Echaste cloro"), out=T("Y a la hora el olor volvió"), y=260, items=[{"at": T("Echaste cloro"), "tx": "CLORO", "ok": False}, {"at": T("tallaste el piso"), "tx": "TALLAR EL PISO", "ok": False}, {"at": T("prendiste una vela"), "tx": "UNA VELA", "ok": False}])
F("quote", T("no es que limpies mal"), out=T("Ese olor no sale del piso"), text="NO ES QUE LIMPIES MAL", col="#ffd60a")
F("tag", T("Sale de adentro del desagüe"), out=T("Y se quita con una taza"), dk="lav", trap=True, text="SALE DE ACÁ ADENTRO", sub="DONDE EL CLORO NO LLEGA", col="#ff6b5e")
F("big", T("Una sola taza"), out=T("Hoy te voy a enseñar"), text="1 TAZA", sub="MENOS QUE UN REFRESCO", size=200, x=1400, y=300)
F("chips", T("La cocina, el lavabo"), out=T("Cada uno huele por una razón"), y=780, items=[{"at": T("La cocina, el lavabo"), "tx": "COCINA"}, {"at": T("el lavabo, la regadera"), "tx": "LAVABO"}, {"at": T("la regadera, la coladera"), "tx": "REGADERA"}, {"at": T("la coladera del patio"), "tx": "PATIO"}, {"at": T("la lavadora, el baño"), "tx": "LAVADORA"}, {"at": T("el baño que nadie usa"), "tx": "EL QUE NADIE USA"}])
F("big", T("el último desagüe es el que nadie limpia"), out=T("Ni siquiera muchos plomeros") + 2.5, text="EL Nº 11", sub="EL QUE NADIE LIMPIA", size=170, col="#ff8a7a", edge="#4a0c08", av=True)
F("big", T("Soy plomero hace veinticinco años"), dur=3.2, text="25 AÑOS", sub="DE PLOMERO", size=170, x=1450, y=260, av=True)
F("stamp", T("Nunca mezcles productos"), dur=3.0, text="CLORO + VINAGRE = NUNCA", size=72)
# CTA1
c1 = sec("CTA1")
F("guide", c1 + 0.2, out=sec("CAUSA") - 0.2, open=T("Cada arreglo en una página"), qr=T("o escanea el código con la cámara de tu celular"), desc=T("El link está en la primera línea de la descripción"))
# CAUSA
F("trapdia", T("Se llama sifón, o trampa"), out=T("Entonces el olor a cloaca viene"), mode="seal")
F("rows", T("Entonces el olor a cloaca viene"), out=T("Esa baba tiene nombre"), y=330, items=[{"at": T("O el sifón se quedó sin agua"), "tx": "SIFÓN SIN AGUA", "ok": False}, {"at": T("o el sifón y las paredes"), "tx": "BABA EN EL CAÑO", "ok": False}])
F("big", T("Se llama biopelícula"), dur=3.4, text="BIOPELÍCULA", sub="GRASA · JABÓN · PELO · BACTERIAS", size=130)
F("trapdia", T("Y cuando comen, sueltan un gas"), out=T("Por eso el cloro no sirve"), mode="slime")
F("quote", T("Lo está fabricando tu propio desagüe"), dur=3.2, text="LO FABRICA TU PROPIO DESAGÜE", col="#a6e05c")
F("tag", T("el cloro pasa de largo en dos segundos"), out=T("Para quitar el olor hay que despegar"), dk="kitchen", trap=True, text="EL CLORO PASA DE LARGO", sub="EN 2 SEGUNDOS", col="#ff6b5e")
# RECETA
F("recipe", T("Necesitas una taza de bicarbonato"), out=T("Ahora te voy a ser honesto"), title="LA TAZA · RECETA BASE", steps=[
  {"at": T("Necesitas una taza de bicarbonato"), "ic": "🥄", "tx": "1 taza de bicarbonato (200 g)"}, {"at": T("Una taza de vinagre blanco"), "ic": "🍶", "tx": "1 taza de vinagre blanco"},
  {"at": T("Un trapo húmedo o un tapón"), "ic": "🧽", "tx": "Trapo húmedo o tapón"}, {"at": T("Y unos dos litros de agua bien caliente"), "ic": "♨️", "tx": "2 litros de agua caliente"}])
F("chips", T("El orden es este"), out=T("Ahora te voy a ser honesto"), y=830, items=[{"at": T("Después echas el bicarbonato seco"), "tx": "BICARBONATO SECO"}, {"at": T("Esperas cinco minutos"), "tx": "5 MIN"}, {"at": T("Después echas el vinagre"), "tx": "VINAGRE + TAPAR"}, {"at": T("Lo dejas tapado treinta minutos"), "tx": "30 MIN"}, {"at": T("Y al final, los dos litros"), "tx": "AGUA CALIENTE"}])
F("timer", T("Lo dejas tapado treinta minutos"), dur=3.2, mins=30, label="TAPADO", x=380, y=420)
F("rows", T("La espuma no es magia"), out=T("Juntas, las tres cosas despegan"), y=250, items=[{"at": T("es un polvo que raspa suave"), "tx": "BICARBONATO: RASPA", "ok": True}, {"at": T("La espuma lo empuja"), "tx": "ESPUMA: LO EMPUJA", "ok": True}, {"at": T("Y el agua caliente derrite"), "tx": "AGUA: DERRITE LA GRASA", "ok": True}])
# DIAGNÓSTICO
F("chips", T("Lo primero es la nariz"), out=T("Ahora sí, desagüe por desagüe"), y=820, items=[{"at": T("Lo primero es la nariz"), "tx": "LA NARIZ", "ic": "👃"}, {"at": T("la prueba de los trapos"), "tx": "LOS TRAPOS", "ic": "🧻"}, {"at": T("la de la linterna"), "tx": "LA LINTERNA", "ic": "🔦"}])
F("timer", T("Espera una hora con la puerta cerrada"), dur=3.0, mins=60, label="PUERTA CERRADA", x=400, y=420)
F("tag", T("Si ves el brillo del agua"), out=T("Si ves oscuro y seco"), dk="floor", trap=True, text="BRILLO = SIFÓN LLENO", col="#7dffb4")
F("tag", T("Si ves oscuro y seco"), out=T("Con estas tres pruebas"), dk="floor", trap=True, text="OSCURO = SECO", sub="POR AHÍ ENTRA EL OLOR", col="#ff6b5e")
# D1..D11 títulos
for s in secs:
    if s.get("n"): pass
for k in ["D1", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9", "D10", "D11"]:
    s = next(x for x in secs if x["k"] == k)
    F("title", s["a"] + 0.15, dur=4.6, n=s["n"], name=s["name"], sub=s["sub"], av=True)
# D1 cocina
F("city", T("una señora en Guadalajara"), dur=4.5, city="GUADALAJARA", sub="HACE 8 AÑOS", av=True)
F("big", T("tres aromatizantes"), dur=2.6, text="3 AROMATIZANTES", size=110, col="#ff8a7a", edge="#4a0c08")
F("stamp", T("Grasa podrida"), dur=2.2, text="GRASA PODRIDA", size=100)
F("recipe", T("En la cocina, la taza va con un paso extra"), out=T("Y el error de todos en la cocina"), title="COCINA · PASO EXTRA", steps=[
  {"at": T("echa un litro de agua caliente con un chorrito"), "ic": "🧴", "tx": "1 L agua caliente + jabón"}, {"at": T("Después sí, la taza de bicarbonato", sec("D1")), "ic": "🥄", "tx": "La taza + vinagre"},
  {"at": T("tapado treinta minutos", sec("D1")), "ic": "⏱️", "tx": "30 min tapado"}, {"at": T("Si tu fregadero tiene dos tarjas"), "ic": "🚰", "tx": "Tapa la otra tarja"}])
F("rows", T("tiran el aceite de freír"), out=T("Mi fregadero no huele"), y=300, items=[{"at": T("tiran el aceite de freír"), "tx": "ACEITE DE FREÍR AL FREGADERO", "ok": False}, {"at": T("guardar el aceite usado en una botella"), "tx": "A UNA BOTELLA Y A LA BASURA", "ok": True}, {"at": T("dejo correr agua bien caliente un minuto"), "tx": "1 MINUTO DE AGUA CALIENTE", "ok": True}])
# D2 lavabo
F("tag", T("el tapón automático"), out=T("Una vez saqué de un lavabo"), dk="lav", text="EL TAPÓN AUTOMÁTICO", sub="AHÍ SE ENREDA EL PELO")
F("city", T("de un lavabo en Monterrey"), dur=4.5, city="MONTERREY", sub="UNA MECHA DEL LARGO DE MI MANO", av=True)
F("big", T("media taza de bicarbonato"), out=T("Tapado treinta minutos, y después el agua caliente"), text="½ TAZA", sub="CAÑO MÁS ANGOSTO", size=170)
F("tag", T("tapa también el agujerito de arriba"), out=T("Ese agujerito es importante"), dk="over", text="¡TAPA ESTE AGUJERITO!", sub="(VUELVO A ÉL AL FINAL)", col="#ffd60a")
# D3 regadera
F("big", T("El acondicionador es lo peor"), dur=3.4, text="ACONDICIONADOR", sub="CAPA CEROSA DONDE SE PEGA TODO", size=110, col="#ff8a7a", edge="#4a0c08")
F("timer", T("deja el bicarbonato solo diez minutos"), dur=3.0, mins=10, label="SOLO, ANTES DEL VINAGRE", x=400, y=430)
F("tag", T("Puse una rejilla de malla fina"), out=T("Desde entonces la ducha"), dk="shower", text="REJILLA DE MALLA", sub="ATRAPA EL PELO ANTES", col="#7dffb4")
# D4 tina
F("city", T("Me tocó una casa en Puebla"), dur=4.5, city="PUEBLA", sub="UNA BOLA DE PELO DE PERRO", av=True)
F("big", T("tres litros de agua caliente en vez de dos"), dur=3.0, text="3 LITROS", sub="EL CAÑO DE LA TINA ES MÁS LARGO", size=170)
# REGANCHO1
F("quote", T("Es el agua"), dur=3.0, text="NO ES LA BABA. ES EL AGUA.", col="#8fd6ff", av=True)
# D5 coladera piso
F("trapdia", T("el agua se evapora"), out=T("Esto me pasó en un departamento"), mode="dry")
F("big", T("en dos o tres semanas el sifón queda seco"), dur=3.0, text="2-3 SEMANAS", sub="Y EL SIFÓN QUEDA SECO", size=140, col="#ff8a7a", edge="#4a0c08")
F("city", T("un departamento de Querétaro"), dur=4.5, city="QUERÉTARO", sub="DOS PLOMEROS, Y ERA UN VASO DE AGUA", av=True)
F("timer", T("en cinco minutos el baño dejó de oler"), dur=2.8, mins=5, label="Y DEJÓ DE OLER", x=400, y=430)
F("trapdia", T("Y encima del agua, una cucharada de aceite"), out=T("Así el sifón aguanta lleno semanas") + 3, mode="oil")
F("stamp", T("Así el sifón aguanta lleno semanas"), dur=2.4, text="LLENO POR MESES", col="#3fe08a", rot=-5)
# D6 patio
F("tag", T("le entran cucarachas"), out=T("Así que este arreglo"), dk="patio", text="POR ACÁ SUBEN", sub="LAS CUCARACHAS", col="#ff6b5e")
F("chips", T("En la coladera del patio, levanta la rejilla"), out=T("Lo que hago yo en mi casa"), y=800, items=[{"at": T("saca las hojas y la tierra"), "tx": "HOJAS Y TIERRA"}, {"at": T("Límpialo con la manguera"), "tx": "MANGUERA"}, {"at": T("Después la taza, con tres litros"), "tx": "TAZA + 3 L"}, {"at": T("Y al final el vaso de agua con la cucharada"), "tx": "VASO + ACEITE"}])
F("timer", T("Diez segundos"), dur=2.6, mins=10, label="SEGUNDOS DE MANGUERA", x=400, y=430)
# REGANCHO2
F("quote", T("los que la gente no sospecha"), dur=3.0, text="LOS QUE NADIE SOSPECHA", col="#ffd60a", av=True)
# D7 lavadora
F("tag", T("mete la manguera hasta el fondo"), out=T("El segundo problema"), dk="washer", text="HASTA EL FONDO = MAL", sub="CHUPA EL SIFÓN COMO UN POPOTE", col="#ff6b5e")
F("big", T("Lo correcto es que entre unos diez centímetros"), dur=3.4, text="10 CM", sub="NO MÁS", size=200, col="#7dffb4", edge="#0b3a22")
F("chips", T("Te vas a sorprender de lo que hay ahí"), out=T("Muchas veces el olor de la ropa"), y=800, items=[{"at": T("monedas"), "tx": "MONEDAS", "ic": "🪙"}, {"at": T("botones"), "tx": "BOTONES", "ic": "🔘"}, {"at": T("pelusa"), "tx": "PELUSA", "ic": "🧶"}, {"at": T("un olor a pantano"), "tx": "PANTANO", "ic": "🐸"}])
# D8 lavavajillas
F("tag", T("tiene su propio filtro en el fondo"), out=T("Mucha gente cree"), dk="dish", text="EL FILTRO DEL FONDO", sub="DEBAJO DE LA CANASTA")
F("recipe", T("Saca la canasta de abajo"), out=T("Y una costumbre que te ahorra"), title="LAVAVAJILLAS", steps=[{"at": T("gira el filtro y sácalo"), "ic": "🔄", "tx": "Saca y lava el filtro"}, {"at": T("pon una taza de vinagre parada"), "ic": "🍶", "tx": "Taza de vinagre arriba"}, {"at": T("corre un ciclo vacío"), "ic": "♨️", "tx": "Ciclo vacío caliente"}, {"at": T("espolvorea media taza de bicarbonato"), "ic": "🥄", "tx": "½ taza bicarbonato + ciclo corto"}])
F("stamp", T("raspa los platos a la basura"), dur=2.4, text="RASPAR, NO ENJUAGAR", col="#3fe08a", rot=-5, size=80)
# CTA2
c2 = sec("CTA2")
F("guide", c2 + 0.2, out=sec("D9") - 0.2, open=T("Abres en la página catorce"), qr=T("o escanea el código con la cámara", c2), desc=T("El link está en la primera línea de la descripción", c2))
# D9 inodoro
F("rows", T("Si el olor viene de adentro de la taza"), out=T("La prueba es esta"), y=280, items=[{"at": T("Si el olor viene de adentro de la taza"), "tx": "ADENTRO DE LA TAZA → LA TAZA SIRVE", "ok": True}, {"at": T("el olor viene de la base del inodoro"), "tx": "EN LA BASE → ES EL SELLO", "ok": False}])
F("tag", T("un anillo de cera o de goma"), out=T("La prueba es esta"), dk="toilet", trap=True, text="EL ANILLO DE CERA", col="#ffd60a")
F("stamp", T("ponerle silicón alrededor de la base"), dur=2.6, text="SILICÓN = NO", size=100)
# D10 baño de visitas
F("city", T("una casa en Cuernavaca"), dur=4.5, city="CUERNAVACA", sub="CERRADA TODO EL VERANO", av=True)
F("big", T("con los cuatro sifones secos"), dur=3.0, text="4 SIFONES SECOS", size=120, col="#ff8a7a", edge="#4a0c08")
F("chips", T("Echa un vaso de agua en cada desagüe de ese baño"), out=T("Con eso, ese baño no vuelve a oler"), y=800, items=[{"at": T("Echa un vaso de agua en cada desagüe de ese baño"), "tx": "VASO DE AGUA"}, {"at": T("encima una cucharada de aceite", sec("D10")), "tx": "CUCHARADA DE ACEITE"}, {"at": T("una vez al mes, abre esa llave"), "tx": "1 MINUTO AL MES"}])
# ERRORES
er = [("Error número uno", "AGUA PRIMERO"), ("Error número dos", "NO TAPAR"), ("Error número tres", "CLORO + VINAGRE"), ("Error número cuatro", "HIRVIENDO EN PLÁSTICO"), ("Y error número cinco", "TAPAR EL OLOR")]
F("chips", T(er[0][0]), out=sec("MAESTRO") - 0.3, y=820, red=True, items=[{"at": T(p), "tx": tx, "ic": "✗"} for p, tx in er])
F("stamp", T("Juntos sueltan un gas"), dur=2.6, text="GAS TÓXICO", size=110)
F("timer", T("dejarla reposar tres minutos"), dur=3.0, mins=3, label="FUERA DEL FUEGO", x=400, y=420)
F("quote", T("con perfume de lavanda"), dur=3.0, text="CLOACA CON PERFUME DE LAVANDA", col="#c9a8ff")
F("tag", T("La sosa cáustica es para tapones fuertes"), out=sec("MAESTRO") - 0.3, text="SOSA = TAPONES, NO OLOR", col="#ff6b5e", x=960, y=520)
# MAESTRO
F("big", T("don Ramiro"), dur=3.4, text="DON RAMIRO", sub="MI MAESTRO", size=130, av=True)
F("rows", T("Si está frío y seco por fuera"), out=T("Lo otro que don Ramiro"), y=280, items=[{"at": T("Si está frío y seco por fuera"), "tx": "FRÍO Y SECO → VACÍO", "ok": False}, {"at": T("Si está pesado"), "tx": "PESADO → MUGRE", "ok": False}, {"at": T("Si gotea"), "tx": "GOTEA → SE VACÍA SOLO", "ok": False}])
F("quote", T("el que tapa un olor, lo cobra dos veces"), dur=3.4, text="EL QUE TAPA UN OLOR, LO COBRA DOS VECES", col="#ffd60a", av=True)
# D11 rebosadero
F("tag", T("Se llama rebosadero"), out=T("Y adentro de ese canal"), dk="over", text="EL REBOSADERO", sub="UN CANAL ESCONDIDO", col="#ffd60a")
F("city", T("Era una casa en León"), dur=4.5, city="LEÓN", sub="LA SEÑORA ME LLAMÓ TRES VECES", av=True)
F("stamp", T("Salió negro"), dur=2.4, text="SALIÓ NEGRO", size=120)
F("recipe", T("Así se limpia"), out=T("Lo haces una vez al mes, junto con la taza"), title="EL REBOSADERO", steps=[{"at": T("Consigue un cepillo largo y delgado"), "ic": "🪥", "tx": "Cepillo delgado + jabón"}, {"at": T("echa media taza de bicarbonato disuelto"), "ic": "🥄", "tx": "½ taza bicarbonato (pasta)"}, {"at": T("media taza de vinagre también por el rebosadero"), "ic": "🍶", "tx": "½ taza vinagre, despacio"}, {"at": T("Termina con un litro de agua caliente"), "ic": "♨️", "tx": "1 L agua caliente"}])
# RUTINA
F("calendar", T("Una vez por semana", sec("RUTINA")), out=T("Parece mucho dicho así", sec("RUTINA")), items=[{"at": T("Una vez por semana", sec("RUTINA")), "when": "CADA SEMANA", "tx": "1 min de agua caliente", "ic": "♨️"}, {"at": T("Una vez al mes: la taza"), "when": "CADA MES", "tx": "La taza + el rebosadero", "ic": "🥄"}, {"at": T("Cada tres meses"), "when": "CADA 3 MESES", "tx": "Filtros + tapón del lavabo", "ic": "🔧"}, {"at": T("Y en verano, o antes de irte de vacaciones"), "when": "VERANO / VIAJE", "tx": "Agua + aceite en coladeras", "ic": "🌞"}])
F("receipt", T("Haz la cuenta"), out=T("Yo no estoy en contra"), rows=[{"at": T("Un kilo de bicarbonato te alcanza"), "item": "1 kg bicarbonato", "v": "5 tazas"}, {"at": T("Un litro de vinagre, para cuatro"), "item": "1 L vinagre", "v": "4 tazas"}, {"at": T("Con lo que cuesta un aromatizante"), "item": "= 1 aromatizante", "v": "1 mes"}], total={"at": T("Y con lo que cuesta una visita del plomero"), "item": "1 VISITA", "v": "AÑOS"})
# PREGUNTAS
pq = [("tengo fosa séptica", "¿FOSA SÉPTICA?", "SÍ, SIN PROBLEMA"), ("los caños son de fierro", "¿CAÑOS DE FIERRO?", "CADA 15 DÍAS"), ("Puedo usar sal en vez de bicarbonato", "¿SAL?", "SOLA NO"), ("hice todo y el olor sigue", "¿Y SI SIGUE?", "LA VENTILACIÓN"), ("cada cuánto, de verdad", "¿CADA CUÁNTO?", "1 VEZ AL MES"), ("el olor que viene del departamento de al lado", "¿EDIFICIO?", "TU COLADERA PRIMERO")]
for i, (p, q, r) in enumerate(pq):
    a = T(p); b = T(pq[i + 1][0]) if i + 1 < len(pq) else sec("VARIANTES")
    F("big", a, out=min(a + 4.0, b - 0.3), text=q, sub=r, size=110, x=1380, y=250, col="#8fd6ff", edge="#06263a")
F("tag", T("Toda casa tiene un tubo que sube hasta el techo"), out=T("Eso ya es para un plomero"), dk="vent", text="EL TUBO DE VENTILACIÓN", sub="UN NIDO LO TAPA", col="#ffd60a")
F("quote", T("un glu glu en el lavabo"), dur=2.8, text="GLU GLU = VENTILACIÓN", col="#8fd6ff")
# VARIANTES
F("rows", T("En lugares de clima muy caliente"), out=sec("RECAP") - 0.3, y=280, items=[{"at": T("En lugares de clima muy caliente"), "tx": "CALOR SECO → CADA 2 SEMANAS", "ok": True}, {"at": T("En lugares húmedos y fríos"), "tx": "FRÍO → 3 LITROS", "ok": True}, {"at": T("En casas con agua dura"), "tx": "AGUA DURA → VINAGRE TODA LA NOCHE", "ok": True}, {"at": T("Y en departamentos chicos"), "tx": "DEPTO → LA COLADERA PRIMERO", "ok": True}])
# RECAP
F("recipe", sec("RECAP") + 0.2, out=T("En la cocina, primero un litro"), title="REPASO · LA TAZA", steps=[{"at": T("una de bicarbonato seco primero"), "ic": "🥄", "tx": "Bicarbonato seco"}, {"at": T("cinco minutos, una de vinagre"), "ic": "🍶", "tx": "5 min → vinagre"}, {"at": T("tapado media hora"), "ic": "⏱️", "tx": "Tapado 30 min"}, {"at": T("y dos litros de agua muy caliente"), "ic": "♨️", "tx": "2 L, no hirviendo"}])
# CIERRE
F("comment", T("después me cuentas en los comentarios"), out=T("Yo leo todos los comentarios") + 3, q="¿De qué desagüe venía el olor en tu casa?", replies=["🚿 de la regadera", "🕳️ la coladera del piso", "😳 ¡del rebosadero!"])
F("guide", T("Si quieres tener los cincuenta arreglos en papel"), out=T("En el próximo video"), open=T("Si quieres tener los cincuenta arreglos en papel") + 0.6, qr=T("el olor a cloaca está en la página catorce de Plomería Casera"), desc=T("y el link está en la primera línea de la descripción", sec("CIERRE")))
F("subscribe", T("Suscríbete y activa la campanita"), dur=3.4, av=True)
F("quote", T("tu casa no tiene que oler a nada"), dur=3.4, text="TU CASA NO TIENE QUE OLER A NADA", col="#7dffb4", av=True)
fx.sort(key=lambda f: f["a"])
# ---------------- guion visual (beats) ----------------
fotos = json.load(open("D:/rtmp_plo30olor/fotos.json", encoding="utf8"))
G_TXT = [norm(re.sub(r"^\[\w+\]\s*", "", l)) for l in lines]
img = []
for it in fotos:
    if not os.path.exists(f"{PUB}/img_{it['name']}.jpg"): continue
    try: img.append((T(it["frase"]), it["name"]))
    except SystemExit as ex: print(ex, file=sys.stderr)
img.sort()
win = json.load(open(f"{SRC}/avwin.json", encoding="utf8"))["win"]
W2 = [(w["ms"], w["me"]) for w in win]
def inwin(t): return any(a - 0.05 <= t < b for a, b in W2)
# zonas "tapadas" por una pieza grande (guía): ahí no hace falta toma
COVER = [(f["a"], f["out"]) for f in fx if f["type"] == "guide"]
DIMFX = [(f["a"], f["out"]) for f in fx if f["type"] in ("trapdia", "recipe", "receipt", "calendar", "quote", "comment", "big")]
def secof(t): return next((s for s in secs if s["a"] <= t < s["b"]), secs[-1])
CYC = {}
def worldpose(t):
    s = secof(t); dk = s.get("dk"); k = s["k"]
    n = CYC.get(k, 0); CYC[k] = n + 1
    if k in ("RUTINA", "RECAP", "VARIANTES", "PROMISE", "REGANCHO1", "REGANCHO2"): return ["house", "under", "overL", "overC", "overB", "overR", "bano"][n % 7]
    if k == "PREGUNTAS": return ["ventall", "roof", "under", "house"][n % 4]
    if not dk: return "house"
    return [dk, dk + "T", dk + "W", "under" if n % 6 == 3 else dk + "T"][n % 4]
LTXS = set(json.load(open("D:/wt/plo30olor/src/plo30olor/avail.json"))["ltx"])
beats = []
used = set()
# recorre el tiempo en pasos: fotos en su segundo (máx 4,6 s), el resto mundo (cambia de pose cada ~5 s)
t = 0.0; ii = 0
evs = sorted([(a, "img", n) for a, n in img] + [(a, "fx", None) for a, b in DIMFX])
while t < END - 0.5:
    if inwin(t):
        b = min(b for a, b in W2 if a - 0.05 <= t < b); t = b; continue
    # siguiente ventana
    nw = min([a for a, b in W2 if a > t] + [END])
    # foto que cae en [t, nw)
    cand = [(a, n) for a, n in img if n not in used and t - 4.0 <= a < nw]
    dim = any(a <= t + 0.2 < b for a, b in DIMFX)
    if cand:
        a, n = cand[0]; used.add(n)
        st = max(t, a);
        if st > t + 0.8: beats.append({"a": round(t, 2), "v": "w:" + worldpose(t)}); t = st
        beats.append({"a": round(t, 2), "v": ("imgd:" if dim else "img:") + n}); t = min(t + (2.9 if n in LTXS else 4.6), nw)
        nxt_img = [x for x, m in img if m not in used and x > beats[-1]["a"]]
        if nxt_img and nxt_img[0] < t: t = max(beats[-1]["a"] + 1.6, nxt_img[0])
    else:
        dimk = "wd:" if dim else "w:"
        beats.append({"a": round(t, 2), "v": dimk + worldpose(t)})
        nx = [x for x, m in img if m not in used and x > t + 1.5]
        t = min(t + 5.2, nw, (nx[0] if nx else 1e9))
# fusiona tomas iguales seguidas
clean = []
for b in beats:
    if clean and clean[-1]["v"] == b["v"]: continue
    clean.append(b)
plan = {"end": END, "secs": secs, "beats": clean, "fx": fx, "ev": ev}
json.dump(plan, open(f"{SRC}/plan.json", "w", encoding="utf8"), ensure_ascii=False)
ni = sum(1 for b in clean if b["v"].startswith("img")); nw_ = sum(1 for b in clean if b["v"].startswith("w"))
avs = sum(b - a for a, b in W2)
print(f"END {END:.1f}s · secciones {len(secs)} · beats {len(clean)} (fotos {ni}/{len(img)}, mundo {nw_}) · fx {len(fx)} · avatar {avs:.0f}s = {100*avs/END:.0f}%")
missing = [n for a, n in img if n not in used]
if missing: print("fotos sin usar:", missing, file=sys.stderr)
