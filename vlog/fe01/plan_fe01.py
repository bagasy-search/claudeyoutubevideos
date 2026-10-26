# fe01 · «Lo que pasa en el panteón cuando todos se van del entierro» (Don Ernesto, el Funerario) · plan del video ENTERO escrito A MANO,
# plano por plano, sobre la frase de ese segundo (at() sobre words.json, frases copiadas del guion). → segs.json, ov.json, avail.json,
# edl.json en src/fe01 y D:/rtmp/fe01_PLAN_MxM.md (una línea por plano). Las ventanas del avatar las manda avwin.json (av_temprano):
# ahí la base es el avatar y al salir vuelve el plano que corresponde.
# Bases: "img:<id>" foto (si su toma LTX-vlog ya llegó, va el clip de Ernesto haciendo eso) · "ph:<id>" foto quieta
# · "ltx:<id>|<respaldo>" clip LTX de lugar (si todavía no llegó, el respaldo) · "bk[:<id>]" foto oscurecida para piezas grandes
# · "fill" el siguiente clip/foto que nadie pidió (nunca se repite nada).
# ⛔ Nunca cuerpos, ataúd abierto ni restos en pantalla. Sin voz todavía: corre con words SIMULADAS del guion (--sim) para probar.
import json, os, re, subprocess, unicodedata, sys, statistics

sys.stdout.reconfigure(encoding="utf-8")
SL = "fe01"
R = f"D:/wt/{SL}/"
S = R + f"src/{SL}/"
PUB = R + "public/"
WAV = PUB + f"{SL}cut.wav"
SIM = "--sim" in sys.argv or not os.path.exists(S + "words.json")

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))

if SIM:  # palabras simuladas del guion (2,55 palabras/s, pausas en punto y aparte) sólo para probar el plan antes de la voz
    W, t = [], 0.4
    for par in open("D:/rtmp_fe01/guion.txt", encoding="utf8").read().split("\n"):
        for w in par.split():
            W.append([w, round(t, 2)]); t += 1 / 2.55 + (0.28 if w[-1] in ".?!" else 0.1 if w[-1] in ",:;" else 0)
        t += 0.55
    END = t + 1.0
else:
    W = [[w, a] for w, a, b in json.load(open(S + "words.json", encoding="utf8"))]
    END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode())
TOK = [norm(w) for w, _ in W]
TS = [float(s) for _, s in W]
AVW = json.load(open(S + "avwin.json", encoding="utf8")).get("win", [])
if not AVW:  # sin av_temprano todavía: ventanas de prueba (0 s + cada ~17 s, 4,5 s) → ~27 %
    AVW = [{"ms": 0.0, "me": 6.0}] + [{"ms": round(x, 2), "me": round(x + 4.6, 2)} for x in [6.0 + 17.0 * k for k in range(1, int(END / 17))] if x + 4.6 < END - 3]
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
    for lo, hi in ((cur, min(len(TOK), cur + 900)), (0, len(TOK))):
        for i in range(lo, hi):
            if score(i) >= need:
                if lo == cur: cur = i
                return round(TS[i] + d, 2)
    miss.append(ph)
    return None

BEATS, OVS = [], []
def B(ph, base, tr=None, d=0.0, why="", **kw):
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr, ph=ph, why=why, **kw))
def O(ph, k, L, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: OVS.append(dict(k=k, a=a, b=round(a + L, 2), **kw))
def T(ph, t0=0.0):
    """segundo de una frase buscando desde t0 (la entrada de la pieza) SIN mover el cursor (para los 'at' internos de las piezas)."""
    global cur
    c = cur; cur = next((i for i, x in enumerate(TS) if x >= t0 - 3), 0); v = at(ph); cur = c; return v
CEMPA, ROJO, VERDE = "#f39a1e", "#b8322a", "#3f9d5a"

# =====================================================================================================================
# 0:00 GANCHO (guion v2, desglose Wilbur) — escena humana + verdad incómoda + DOCUMENTO en los primeros 20 s; el viaje con premio
# (el sobre amarillo) a los 20-45 s. Ningún plano > ~3 s en el 1er minuto; el avatar en 0 s.
# =====================================================================================================================
B("Usted está parado junto a la tumba", "ltx:fe_tripie_coronas|n02", "fade", why="la tumba recién tapada con las coronas de tripié")
B("Ya se fue el último coche", "ltx:fe_ultimo_coche|n03", "cut", why="el coche que se va por el andador")
B("Y tiene en la mano el papel que le dio el panteón", "img:e24", "cut", why="Ernesto con el papel del panteón en la mano")
B("Ya lo leyó", "img:n41", "zoom", why="el título de fosa, letra chiquita")
O("Porque arriba, en letras chiquitas", "recibo", 8.4, title="Título de fosa · Panteón municipal", folio="Sección · Fila · Número",
  rows=[{"at": "en letras chiquitas", "tx": "Derecho de uso"}, {"at": "dice una palabra: temporal", "tx": "Temporal", "v": "por años"}],
  sello={"at": "dice una palabra: temporal", "tx": "TEMPORAL"})
B("Porque arriba, en letras chiquitas", "bk", "zoom", why="el papel: la palabra TEMPORAL")
B("su mamá no se queda ahí para siempre", "img:e01", "cut", why="Ernesto junto a la tumba")
B("Así lo dice el reglamento de panteones de Guadalajara", "img:n44", "cut", why="el reglamento impreso")
O("Así lo dice el reglamento de panteones de Guadalajara", "ficha", 4.4, kicker="REGLAMENTO DE PANTEONES · GUADALAJARA", title="Fosa temporal", sub="se renta por años · hay que refrendar")
B("Así lo dice su papel", "img:n87", "cut", why="el recibo de refrendo")
B("Y nadie se lo explicó", "img:e02", "swipeR", why="la última mirada a la tumba")
B("Yo se lo voy a explicar", "img:e03", "portal", why="Ernesto en la oficina, mirando a cámara")
B("Los primeros veinte minutos", "ltx:fe_sepulturero_lejos|n09", "cut", why="el sepulturero de espaldas, solo")
O("Los primeros veinte minutos, la primera noche", "chips", 5.6, items=["20 MINUTOS", "LA 1ª NOCHE", "9 DÍAS", "1-2 NOV", "6 · 10 · 30 AÑOS"], y=880)
B("la primera noche", "ltx:fe_reja_cierra|n30", "cut", why="la reja que se cierra al anochecer")
B("la noche del primero al dos de noviembre", "img:n71", "swipeL", why="el cempasúchil que marca el camino, de noche")
B("a los seis años, a los diez y a los treinta", "ltx:fe_nombre_borrado|n81", "cut", why="el nombre que ya no se lee")
B("lo que mi papá me puso en la mano al amanecer", "ltx:fe_amanecer_panteon|n85", "fade", why="el amanecer en el Mezquitán")
O("en el Panteón de Mezquitán, en mil novecientos noventa y nueve", "lugar", 3.4, tx="Panteón de Mezquitán", sub="amanecer · 1999")
B("Un sobre amarillo", "img:e45", "zoom", why="EL PREMIO: el sobre amarillo (se paga al ~80 %)")
O("Un sobre amarillo", "stamp", 2.6, text="UN SOBRE AMARILLO", col=CEMPA, rot=-5, x=1400, y=330, size=90)

# Presentación (antes del min 1:30)
B("Mi nombre es Ernesto Navarro", "fill", "cut", why="Ernesto en el escritorio de su papá")
O("Mi nombre es Ernesto Navarro", "lower", 5.5, name="DON ERNESTO NAVARRO", l2="Funerario · más de 40 años · Analco, Guadalajara")
B("Nací en Analco, aquí en Guadalajara", "ltx:fe_analco_templo|n05", "swipeL", why="la calle de Analco y el templo")
O("Nací en Analco, aquí en Guadalajara", "mapa", 4.2, city="gdl", pins=[{"at": "Nací en Analco", "l": "analco", "tx": "ANALCO"}], title="Guadalajara", x=1380, y=520, sc=0.72)
B("Mi papá, Don Refugio, abrió Funerales Navarro", "ltx:fe_oficina_manana|e05", "portal", why="la oficina por la mañana")
O("abrió Funerales Navarro en mil novecientos cincuenta y ocho", "foto", 4.6, src=f"{SL}/img/f02.jpg", pie="Funerales Navarro · 1958", x=1360, y=520, w=620, rot=4)
B("a los trece años yo ya barría su capilla", "img:n04", "cut", why="la escoba en la capilla vieja")
B("funerarias del West Side de San Antonio, Texas", "fill", "cut", why="San Antonio")
O("funerarias del West Side de San Antonio, Texas", "mapa", 3.6, city="sa", pins=[{"at": "del West Side", "l": "westside", "tx": "WEST SIDE"}], title="San Antonio, Texas", x=1400, y=520, sc=0.66)
B("enterré a más de seis mil personas", "bk", "zoom", why="contador: 6.000")
O("enterré a más de seis mil personas", "cuenta", 3.4, from_=0, to=6000, pre="", suf="+", sub="familias que despedí", size=210)
B("Dos países, dos maneras de despedirse", "fill", "cut", why="las dos maneras")
O("Dos países, dos maneras de despedirse", "chips", 3.4, items=["GUADALAJARA", "SAN ANTONIO"], y=880)
B("Si usted ya enterró a su papá o a su mamá", "fill", "cut", why="una familia en el panteón")
B("Suscríbase hoy, en un día tranquilo", "img:e06", "cut", why="Ernesto con su café, día tranquilo")
O("Suscríbase hoy, en un día tranquilo", "stamp", 3.0, text="SUSCRÍBASE · EN UN DÍA TRANQUILO", col=VERDE, rot=-4, x=1300, y=820, size=60)
B("cuando suene el teléfono a las dos de la mañana", "fill", "cut", why="el teléfono de la funeraria de noche")
B("Lo que yo le cuento aquí es lo que yo le diría a mi propia madre", "ltx:fe_cafe_olla|e06", "fade", why="el café de olla en el escritorio")
O("lo que yo le diría a mi propia madre", "quote", 3.8, text="Lo que yo le diría a mi propia madre.", who="Don Ernesto", y=820, w=1100)

# =====================================================================================================================
# 1 · EL ÚLTIMO COCHE (sepulturero, el «sí con la cabeza», el libro de registro = SEMILLA)
# =====================================================================================================================
B("Uno. El último coche", "bk", "zoom", why="capítulo 1")
O("Uno. El último coche", "cap", 3.6, n="1", title="El último coche")
B("Usted ya se fue, pero el sepulturero no", "img:e07", "cut", why="Ernesto con el sepulturero de camisa de trabajo")
B("con la pala recargada en un árbol", "ltx:fe_pala_arbol|n09", "swipeL", why="la pala recargada en el árbol")
B("esperando a que usted terminara de despedirse", "img:n08", "cut", why="el mango pulido de la pala")
B("en el Mezquitán estaba Don Chema", "img:m017", "cut", why="la portada del Mezquitán")
O("en el Mezquitán estaba Don Chema", "tag", 3.4, x=1300, y=420, text="DON CHEMA", sub="sepulturero · Mezquitán", col=CEMPA)
B("Flaquito, sombrero de paja", "fill", "cut", why="el sepulturero de sombrero")
B("En cuanto se iba el último coche, empezaba", "fill", "cut", why="empieza el trabajo")
B("Primero se colocan unas losas de concreto", "ltx:fe_losas_concreto|n10", "cut", why="las losas cubriendo la fosa")
B("Luego la tierra. Paletada por paletada", "img:n11", "cut", why="la tierra que cae")
B("Y se apisona", "ltx:fe_tierra_apisonada|e09", "cut", why="la bota que aprieta la tierra")
B("Don Chema se paraba", "img:e09", "swipeR", why="Ernesto mirando, la pala quieta")
B("Volteaba a ver a la viuda", "fill", "cut", why="la viuda junto a la tumba")
B("Hasta que ella le decía que sí con la cabeza", "fill", "cut", why="el sí con la cabeza")
O("ese sí con la cabeza es todo el entierro", "dicho", 5.6, text="Ese sí con la cabeza es todo el entierro. Ahí es cuando lo deja ir.")
B("ese sí con la cabeza es todo el entierro", "bk", "zoom", why="el dicho de Don Refugio")
B("Hoy casi nadie se queda a ver", "img:n12", "cut", why="los hombres echando la tierra")
O("Y no es falta de cariño", "stamp", 2.4, text="NO ES FALTA DE CARIÑO", col=VERDE, rot=-5, x=1400, y=780, size=64)
B("si usted quiere ese momento, lo puede pedir", "fill", "cut", why="la familia que se queda")
B("dele las gracias al sepulturero, y si puede, una propina", "img:e08", "cut", why="Ernesto le da la mano al sepulturero")
B("con las manos llenas de tierra", "img:n13", "cut", why="las manos con tierra")
B("en su familia, ¿se quedaron a ver cómo tapaban la fosa", "bk", "zoom", why="pedido de 1 palabra")
O("en su familia, ¿se quedaron a ver cómo tapaban la fosa", "chips", 4.0, items=["SÍ", "NO"], y=820)
O("Nada más escriba sí o no", "stamp", 2.4, text="ESCRIBA: SÍ O NO", col=CEMPA, rot=-4, x=1400, y=330, size=70)
B("en la oficina del panteón pasa otra cosa", "fill", "portal", why="la oficina del panteón")
B("Un empleado agarra el permiso de inhumación", "img:n14", "cut", why="el permiso de inhumación sobre el mostrador")
O("lo anota en el libro de registro del panteón", "recibo", 8.0, title="Libro de registro", folio="Panteón municipal",
  rows=[{"at": "Nombre, fecha", "tx": "Nombre y fecha"}, {"at": "sección, fila", "tx": "Sección · fila"}, {"at": "número de fosa", "tx": "Número de fosa"}],
  sello={"at": "número de fosa", "tx": "REGISTRADO"})
B("lo anota en el libro de registro del panteón", "ltx:fe_libro_registro|n15", "cut", why="el libro de registro abierto")
B("son libros grandotes, de pasta dura", "img:n15", "cut", why="los libros de pasta dura, pluma fuente")
B("Acuérdese de ese libro", "bk", "zoom", why="SEMILLA: el libro")
O("Acuérdese de ese libro", "stamp", 3.0, text="ACUÉRDESE DE ESE LIBRO", col=CEMPA, rot=-5, x=960, y=820, size=80)
B("dentro de treinta años, cuando ya nadie de su familia se acuerde", "fill", "cut", why="la tumba vieja")
B("esa línea va a ser lo único que diga que su gente está ahí", "fill", "cut", why="la línea en el libro")
B("me mandaba en camión por la Calzada Independencia", "ltx:fe_camion_calzada|n17", "swipeL", why="el camión por la Calzada")
O("me mandaba en camión por la Calzada Independencia", "mapa", 4.4, city="gdl", pins=[{"at": "por la Calzada", "l": "analco", "tx": "ANALCO"}, {"at": "con el fólder", "l": "mezquitan", "tx": "MEZQUITÁN"}], route={"at": "por la Calzada", "from": "analco", "to": "mezquitan"}, x=1380, y=520, sc=0.72)
B("con el fólder de cada entierro bajo el brazo", "img:n18", "cut", why="el fólder bajo el brazo")
B("no te regreses sin el sello", "img:e11", "cut", why="Ernesto con el fólder sellado")
O("no te regreses sin el sello", "dicho", 4.4, text="Ernesto, no te regreses sin el sello.")
B("Porque un papel sin sello", "ltx:fe_sello_papel|n16", "cut", why="el sello sobre el permiso")

# =====================================================================================================================
# 2 · A DÓNDE SE VAN LAS FLORES (dengue = Secretaría de Salud de Jalisco)
# =====================================================================================================================
B("Dos. A dónde se van las flores", "bk", "zoom", why="capítulo 2")
O("Dos. A dónde se van las flores", "cap", 3.6, n="2", title="A dónde se van las flores")
B("Usted dejó coronas, ramos, gladiolas", "img:n23", "cut", why="coronas, gladiolas, rosas blancas")
B("Y piensa que ahí se quedan", "img:n02", "cut", why="las flores frescas")
B("Con este sol aguantan unos cuantos días", "ltx:fe_flores_secas|e16", "cut", why="las flores secándose al sol")
B("el agua de los floreros se estanca", "img:n24", "cut", why="el agua estancada")
B("Y ahí se cría el mosco del dengue", "img:n25", "cut", why="el mosco en el agua")
B("la Secretaría de Salud de Jalisco", "ltx:fe_florero_arena|e17", "swipeR", why="el florero lleno de arena")
O("la Secretaría de Salud de Jalisco", "ficha", 5.4, kicker="SECRETARÍA DE SALUD DE JALISCO", title="Floreros con arena", sub="cada año antes de Día de Muertos · contra el dengue")
B("Entonces, ¿quién se lleva las flores", "fill", "cut", why="la tumba pelona")
B("Las juntan secas, las ponen en carretillas", "ltx:fe_carretilla_flores|n27", "cut", why="la carretilla de flores secas")
B("y se van a la basura con las de todas las demás tumbas", "img:n27", "cut", why="las carretillas")
B("Las familias regresan a los quince días", "fill", "cut", why="la familia regresa")
B("Nadie se robó nada", "fill", "cut", why="la tumba limpia")
O("Nadie se robó nada", "stamp", 2.4, text="NADIE SE ROBÓ NADA", col=VERDE, rot=-6, x=1420, y=330, size=70)
B("llévese una cosa a su casa. El listón de la corona", "img:n28", "cut", why="el listón de la corona de tripié")
B("con un ramito de cempasúchil de los que venden afuera", "ltx:fe_ramito_cempa|e18", "cut", why="el ramito de cempasúchil")
B("una corona de tripié que dura tres días", "img:e18", "cut", why="Ernesto con el ramito")

# =====================================================================================================================
# 3 · QUIÉN CUIDA DE NOCHE (Don Teófilo, el termo, «yo cuido a los vivos», el bronce por kilo)
# =====================================================================================================================
B("Tres. Quién cuida de noche", "bk", "zoom", why="capítulo 3")
O("Tres. Quién cuida de noche", "cap", 3.6, n="3", title="Quién cuida de noche")
B("La gente cree que el panteón de noche está solo", "ltx:fe_rondin_lampara|n29", "cut", why="el rondín con la lámpara")
B("En los panteones municipales hay veladores", "img:e19", "cut", why="Ernesto con el velador")
B("Una casetita junto a la reja, un radio, un termo", "fill", "cut", why="la caseta del velador")
B("y siempre un perro", "ltx:fe_perro_velador|n29", "swipeL", why="el perro del velador")
B("al Mezquitán con unos papeles para el velador, Don Teófilo", "fill", "cut", why="la reja de noche")
O("para el velador, Don Teófilo", "tag", 3.4, x=1300, y=420, text="DON TEÓFILO", sub="velador · Mezquitán", col=CEMPA)
B("me sirvió café en la tapa de su termo", "img:n38", "cut", why="el café en la tapa del termo")
O("Yo cuido a los vivos", "dicho", 4.6, d=-1.0, text="Mijo, los de aquí nunca me han dado un problema. Yo cuido a los vivos.")
B("Yo cuido a los vivos", "bk", "zoom", why="el dicho de Don Teófilo")
B("para robarse las placas de bronce", "img:e20", "cut", why="la placa de bronce arrancada")
B("Lo que pasa de noche en un panteón no son fantasmas", "fill", "cut", why="el panteón de noche")
O("no son fantasmas. Son robos", "stamp", 2.6, text="SON ROBOS", col=ROJO, rot=-6, x=1420, y=330)
B("Placas, cruces, floreros de latón", "ltx:fe_placa_arrancada|n31", "cut", why="la placa arrancada")
B("floreros de latón, para venderlos por kilo", "img:n32", "cut", why="los floreros de latón")
B("Ponen las letras grabadas en la misma piedra", "img:n34", "cut", why="las letras grabadas en la piedra")
B("La tumba de mi papá tiene una maceta de barro", "fill", "cut", why="la maceta de barro")
O("Nunca nadie se ha robado una maceta de barro", "stamp", 2.6, text="UNA MACETA DE BARRO", col=VERDE, rot=-5, x=1400, y=780, size=70)
B("Escríbame desde dónde me está viendo", "bk", "zoom", why="pedido de 1 palabra")
O("Escríbame desde dónde me está viendo", "comment", 4.6, text="Zacatecas 🙏", x=1300, y=800)
O("Nada más su pueblo o su ciudad", "stamp", 2.4, text="SU PUEBLO O SU CIUDAD", col=CEMPA, rot=-4, x=1400, y=330, size=64)

# =====================================================================================================================
# 4 · LA TIERRA SE MUEVE (lluvias jun-sep, la lápida no ese día, Delgado = mención, los 9 días)
# =====================================================================================================================
B("Cuatro. La tierra se mueve", "bk", "zoom", why="capítulo 4")
O("Cuatro. La tierra se mueve", "cap", 3.6, n="4", title="La tierra se mueve")
B("La noche del entierro la tumba se ve terminada", "fill", "cut", why="la tumba de noche")
B("queda como un montoncito de tierra más alto que el suelo", "img:e10", "cut", why="el montoncito de tierra")
O("Así debe quedar", "stamp", 2.4, text="ASÍ DEBE QUEDAR", col=VERDE, rot=-6, x=1420, y=320)
B("con las lluvias, con el peso", "ltx:fe_lluvia_tumbas|n20", "swipeR", why="la lluvia sobre las tumbas")
B("Aquí en Guadalajara llueve fuerte de junio a septiembre", "img:n20", "cut", why="el aguacero")
O("Aquí en Guadalajara llueve fuerte de junio a septiembre", "ficha", 4.8, kicker="GUADALAJARA", title="Temporada de lluvias", dato="junio → septiembre", sub="esa agua acomoda la tierra")
B("Por eso la lápida no se pone ese día", "img:e12", "cut", why="Ernesto señala la tierra suelta")
B("se le chuequea, se le cuartea", "img:n19", "cut", why="la lápida chueca y rajada")
B("Los marmoleros serios le van a decir que espere", "img:e13", "cut", why="Ernesto con el marmolero")
B("no compre la lápida el mismo día del entierro", "img:e14", "portal", why="Ernesto: no el mismo día")
O("no compre la lápida el mismo día del entierro", "stamp", 3.0, text="NO EL MISMO DÍA", col=ROJO, rot=-6, x=1420, y=330)
B("mármol con letras doradas y foto en porcelana", "img:n22", "cut", why="las letras doradas")
B("foto en porcelana", "img:n21", "cut", why="la foto en porcelana")
B("La señora Delgado", "img:e15", "swipeL", why="Ernesto recordando a la señora Delgado")
O("Le cotizaron once mil dólares", "cuenta", 3.6, from_=0, to=11000, pre="US$", sub="lo que le cotizaron a la señora Delgado", size=190, col=ROJO)
B("Le cotizaron once mil dólares", "bk", "zoom", why="contador")
B("la lápida puede esperar", "fill", "cut", why="la tumba de tierra")
B("son los nueve días de rosario", "ltx:fe_novenario_altar|n53", "cut", why="el altar del novenario")
B("Se levanta la cruz", "img:n54", "cut", why="se levanta la cruz")
B("La tierra se hundió", "img:n55", "cut", why="la tierra hundida")
B("Hay hojas secas encima", "img:n56", "cut", why="hojas secas")
O("No pasó nada malo. Pasó lo normal", "stamp", 2.6, text="PASÓ LO NORMAL", col=VERDE, rot=-5, x=1400, y=330, size=80)
B("llevar una escobita, una cubeta con agua", "ltx:fe_escobita_cubeta|e30", "cut", why="la escobita y la cubeta")
B("y arreglarle su lugar", "img:e30", "cut", why="Ernesto barriendo la tumba")
B("señoras de ochenta años hincadas en la tierra", "img:e31", "cut", why="la señora hincada")
B("platicando con su esposo como si estuviera ahí", "fill", "fade", why="la señora platicando")

# =====================================================================================================================
# 5 · LA NOCHE QUE NADIE SE VA A SU CASA (1999, el bastón, Mezquitán 1896, «Amor eterno», la pregunta de las 2 a.m.)
# =====================================================================================================================
B("Cinco. La noche que nadie se va a su casa", "bk", "zoom", why="capítulo 5")
O("Cinco. La noche que nadie se va a su casa", "cap", 3.6, n="5", title="La noche que nadie se va a su casa")
B("Mil novecientos noventa y nueve. Primero de noviembre", "img:n07", "fade", why="la noche de veladoras de 1999")
O("Mil novecientos noventa y nueve. Primero de noviembre", "lugar", 4.2, tx="Panteón de Mezquitán", sub="1 de noviembre de 1999")
O("La última noche de Día de Muertos que pasé con mi papá", "foto", 4.6, src=f"{SL}/img/f01.jpg", pie="Mi papá, Don Refugio · 1999", x=1360, y=500, w=600, rot=-4)
B("Yo no sabía que era la última", "bk", "zoom", why="la foto de Don Refugio")
B("caminaba despacito, con su bastón", "img:n37", "cut", why="el bastón")
B("este año quiero velar a tu abuela", "fill", "cut", why="la oficina")
B("Usted ya no está para eso", "fill", "cut", why="el padre y el hijo")
O("Por eso. Porque ya no estoy para eso", "dicho", 4.6, text="Por eso. Porque ya no estoy para eso.")
B("Por eso. Porque ya no estoy para eso", "bk", "zoom", why="el dicho")
B("El Mezquitán abrió sus puertas un dos de noviembre", "ltx:fe_mezq_portada_dia|n35", "cut", why="la portada del Mezquitán")
O("El Mezquitán abrió sus puertas un dos de noviembre de mil ochocientos noventa y seis", "ficha", 5.6, kicker="PANTEÓN DE MEZQUITÁN", title="Abrió el 2 de noviembre de 1896", dato="un Día de Muertos", sub="porque el de Belén ya estaba lleno")
B("porque el de Belén ya estaba lleno", "img:n36", "cut", why="mausoleos viejos")
B("Agarramos dos sillas plegables", "ltx:fe_sillas_termo|e22", "cut", why="las sillas plegables y el termo")
B("un termo de café de olla, una cobija, pan de muerto", "img:n39", "cut", why="el pan de muerto")
B("y una cubeta de cempasúchil", "ltx:fe_cempa_montones|e38", "cut", why="la cubeta de cempasúchil")
B("los brazos naranjas del polen", "img:e22", "cut", why="Ernesto con los brazos naranjas")
B("El panteón entero estaba prendido", "ltx:fe_veladoras_noche|e39", "fade", why="miles de veladoras")
B("Señoras tallando las lápidas con cepillo", "ltx:fe_pintar_cal|n70", "cut", why="pintando la tumba con cal")
B("Niños corriendo entre las tumbas", "fill", "cut", why="niños entre las tumbas")
B("Tamales y atole en la entrada", "fill", "cut", why="tamales y atole")
B("Copal, cera, cempasúchil y café", "img:e39", "cut", why="las veladoras y el copal")
B("A la tumba de junto llegó una familia con un mariachi", "ltx:fe_mariachi_lejos|n72", "swipeL", why="el mariachi a lo lejos")
O("le tocaron \"Amor eterno\"", "stamp", 2.4, text="«AMOR ETERNO»", col=CEMPA, rot=-4, x=1400, y=330, size=80)
B("le tocaron \"Amor eterno\"", "img:n73", "cut", why="el mariachi tocando")
B("me agarró del brazo", "fill", "cut", why="el padre y el hijo")
O("La gente no viene al panteón por los muertos", "dicho", 6.0, text="La gente no viene al panteón por los muertos. Viene porque no sabe dónde más poner lo que siente.")
B("La gente no viene al panteón por los muertos", "bk:n74", "zoom", why="el dicho")
B("como a las dos de la mañana, con las veladoras ya bajitas", "img:n40", "fade", why="las veladoras bajitas")
O("tú ya sabes dónde está el papel de esta tumba", "quote", 4.4, text="«Ernesto, ¿tú ya sabes dónde está el papel de esta tumba?»", who="Don Refugio · 2 a.m.", y=820, w=1200)
B("Y yo no supe", "img:e26", "cut", why="Ernesto sin saber dónde estaba el papel")
B("no sabía dónde estaba el papel de mi propia abuela", "fill", "cut", why="la tumba de la abuela")
B("Guárdese esa pregunta", "bk", "zoom", why="la pregunta queda abierta")
O("Guárdese esa pregunta", "stamp", 2.6, text="GUÁRDESE ESA PREGUNTA", col=CEMPA, rot=-5, x=960, y=820, size=74)

# =====================================================================================================================
# 6 · LA COMIDA Y LA MAÑANA DEL TRES (la esencia, el tamal del velador, toneladas de basura, Lalo y la espátula)
# =====================================================================================================================
B("Seis. La comida y la mañana del tres", "bk", "zoom", why="capítulo 6")
O("Seis. La comida y la mañana del tres", "cap", 3.6, n="6", title="La comida y la mañana del tres")
B("El mole, los tamales, la fruta", "ltx:fe_ofrenda_comida|n75", "cut", why="la ofrenda de comida")
B("la cervecita, el tequila, los cigarros", "img:n76", "cut", why="la cervecita y el tequila")
B("Las abuelas dicen que los difuntos toman la esencia", "img:n77", "cut", why="la fruta de la ofrenda")
B("una parte se la llevan los perros y los pájaros", "img:n78", "cut", why="los pájaros en la ofrenda")
B("Otra parte, gente que no tiene qué comer", "fill", "cut", why="la ofrenda")
O("Si el velador se come un tamal de la tumba de mi madre", "dicho", 5.6, text="Si el velador se come un tamal de la tumba de mi madre, mi madre está contenta.")
B("Si el velador se come un tamal", "img:e41", "cut", why="los tamales de la ofrenda")
B("el tres de noviembre es el día más pesado del año", "ltx:fe_basura_dos_nov|n79", "cut", why="la basura del 3 de noviembre")
O("sacan toneladas de basura", "big", 3.0, text="TONELADAS", sub="de basura · 3 de noviembre", x=1400, y=330, size=130, col=ROJO)
B("sacan toneladas de basura", "img:e42", "cut", why="Ernesto con las bolsas de basura")
B("Flores secas, platos, botellas, y la cera", "img:n79", "cut", why="flores secas, platos, botellas")
B("Miles de veladoras derretidas sobre la piedra", "fill", "cut", why="la cera derretida")
B("Eso se quita a mano, con espátula, de rodillas", "fill", "cut", why="la espátula")
B("A mi aprendiz Lalo lo llevé su primera semana", "fill", "cut", why="el aprendiz")
O("A mi aprendiz Lalo", "tag", 3.2, x=1300, y=420, text="LALO", sub="mi aprendiz", col=CEMPA)
B("Creyó que era broma", "fill", "cut", why="Lalo de rodillas")
O("La noche es de las familias", "dicho", 4.4, text="La noche es de las familias. La mañana es de nosotros.")
B("La noche es de las familias", "fill", "fade", why="el amanecer del 3")
B("Flores naturales o de plástico", "bk", "zoom", why="pedido de 1 palabra")
O("Flores naturales o de plástico", "chips", 4.0, items=["NATURALES", "DE PLÁSTICO"], y=820)
O("Una palabra", "stamp", 2.0, text="UNA PALABRA", col=CEMPA, rot=-5, x=1420, y=330, size=80)

# =====================================================================================================================
# 7 · PARA SIEMPRE, Y NO PARA SIEMPRE (perpetuidad/temporal, «le debo una honestidad», reglamento 6/5 años, aviso, osario,
#     Zarzamora = PAGO de la semilla del libro, el calendario de lápiz rojo)
# =====================================================================================================================
B("Siete. Para siempre, y no para siempre", "bk", "zoom", why="capítulo 7")
O("Siete. Para siempre, y no para siempre", "cap", 3.6, n="7", title="Para siempre, y no para siempre")
B("Ahora la parte del dinero", "fill", "cut", why="los papeles")
B("le dan un papel. Un título, una constancia, un recibo", "img:e23", "cut", why="Ernesto lee el título")
O("Un título, una constancia, un recibo", "chips", 3.6, items=["TÍTULO", "CONSTANCIA", "RECIBO"], y=880)
O("si la fosa es a perpetuidad o es temporal", "recibo", 11.0, title="Título de fosa", folio="Sección · Fila · Número",
  rows=[{"at": "A perpetuidad quiere decir", "tx": "A perpetuidad", "v": "para siempre", "ok": 1}, {"at": "Temporal quiere decir", "tx": "Temporal", "v": "por años"}],
  sello={"at": "A eso se le dice el refrendo", "tx": "REFRENDO"})
B("si la fosa es a perpetuidad o es temporal", "bk:n42", "zoom", why="el título: perpetuidad o temporal")
B("Temporal quiere decir que usted está rentando", "img:n43", "cut", why="las gavetas temporales")
B("A eso se le dice el refrendo", "img:m104", "cut", why="el recibo de refrendo")
B("Aquí le debo una honestidad", "fill", "portal", why="Ernesto, honesto, a cámara")
O("Aquí le debo una honestidad", "stamp", 3.0, text="LE DEBO UNA HONESTIDAD", col=CEMPA, rot=-4, x=960, y=820, size=78)
B("eso lo pone cada municipio en su ley de ingresos", "img:m098", "cut", why="la ley de ingresos")
B("Pregunte en la administración del panteón, con su papel en la mano", "img:n16", "cut", why="la ventanilla de la administración")
O("Una exhumación es prematura si se hace antes de seis años", "ficha", 6.0, kicker="REGLAMENTO DE PANTEONES · GUADALAJARA", title="Antes de 6 años, no", dato="6 años · 5 si es menor", sub="salvo permisos especiales")
B("Una exhumación es prematura si se hace antes de seis años", "bk", "zoom", why="ficha del reglamento")
B("Por eso las fosas temporales siempre son de varios años", "fill", "cut", why="las fosas")
O("No llega un camión a media noche", "stamp", 2.4, text="NO LLEGA UN CAMIÓN", col=VERDE, rot=-5, x=1400, y=330, size=70)
B("No llega un camión a media noche", "img:n49", "cut", why="la reja de día, tranquila")
B("Una lista pegada en la entrada del panteón", "ltx:fe_aviso_lista|e27", "cut", why="la lista pegada en la entrada")
B("una notificación a la casa que usted dejó registrada", "img:n50", "cut", why="la notificación")
B("le llega a una casa donde ya nadie lo conoce", "img:n51", "cut", why="la casa donde ya nadie lo conoce")
B("el panteón puede llevar los restos a un osario", "img:n48", "cut", why="el osario (pared de nichos cerrados)")
B("Le pasa a familias buenas", "fill", "cut", why="una familia")
O("El hijo en Texas creía que la hermana de Guadalajara estaba pagando", "chips", 4.6, items=["EL HIJO EN TEXAS", "LA HERMANA EN GDL", "NADIE PAGABA"], y=880)
B("El hijo en Texas creía", "img:n46", "cut", why="el hermano lejos")
B("una familia de la calle Zarzamora", "img:n59", "cut", why="la calle Zarzamora")
B("en la tumba de su abuela ya había otro nombre", "fill", "cut", why="la lápida con otro nombre")
B("una línea en el libro de registro", "img:m033", "cut", why="PAGO de la semilla: el libro de registro")
O("¿Se acuerda del libro", "stamp", 3.0, text="¿SE ACUERDA DEL LIBRO?", col=ROJO, rot=-5, x=960, y=820, size=84)
B("Eso fue todo lo que les quedó", "bk", "zoom", why="lo único que les quedó")
B("Mi papá tenía en la pared de esta oficina un calendario", "ltx:fe_calendario_cocina|n52", "cut", why="el calendario con lápiz rojo")
O("con lápiz rojo apuntaba las fechas de refrendo", "refrendo", 10.5, from_=1990, years=7, venceAt="Porque se les olvidaba", title="Fosa temporal", label="REFRENDO · LÁPIZ ROJO")
B("con lápiz rojo apuntaba las fechas de refrendo", "bk", "zoom", why="el calendario del refrendo")
B("Porque se les olvidaba. A todas", "fill", "cut", why="la puerta en Analco")
O("en marzo vaya a la oficina", "quote", 3.6, text="«Señora, en marzo vaya a la oficina. No se le olvide.»", who="Don Refugio", y=820, w=1100)
B("¿Usted sabía lo del refrendo antes de hoy", "bk", "zoom", why="pedido de 1 palabra")
O("¿Usted sabía lo del refrendo antes de hoy", "chips", 3.6, items=["SÍ", "NO"], y=820)
O("Escríbame sí o no", "stamp", 2.0, text="ESCRIBA: SÍ O NO", col=CEMPA, rot=-4, x=1400, y=330, size=70)

# =====================================================================================================================
# 8 · EN ESTADOS UNIDOS ES OTRA COSA (cierra al atardecer, la retroexcavadora, grave liner: lo pide el cementerio, FTC, NFDA 2023)
# =====================================================================================================================
B("Ocho. En Estados Unidos es otra cosa", "bk", "zoom", why="capítulo 8")
O("Ocho. En Estados Unidos es otra cosa", "cap", 2.8, n="8", title="En Estados Unidos es otra cosa")
B("Muchos de ustedes tienen familia allá", "fill", "cut", why="San Antonio")
O("Le cuento tres diferencias", "big", 2.6, text="3", sub="diferencias", x=1500, y=320, size=180, col=CEMPA)
B("allá el cementerio cierra la reja al atardecer", "img:e32", "cut", why="la reja del cementerio al atardecer")
B("Ni el Día de Muertos se queda nadie", "img:n60", "cut", why="el guardia que pide que se vaya")
B("allá no hay sepulturero con pala", "fill", "cut", why="el pasto del cementerio")
B("una retroexcavadora chiquita", "img:n61", "cut", why="la retroexcavadora chiquita")
B("La familia se despide en una carpa", "img:e33", "cut", why="la carpa con sillas")
B("Y luego llega la máquina", "fill", "cut", why="la máquina")
B("Le dicen grave liner, o vault", "img:e34", "cut", why="Ernesto junto a la caja de concreto")
O("Le dicen grave liner, o vault", "chips", 3.4, items=["GRAVE LINER", "VAULT"], y=880)
B("para que la podadora pase parejito", "img:n63", "cut", why="la podadora en el pasto")
O("eso no lo pide la ley del gobierno", "stamp", 3.2, text="LO PIDE EL CEMENTERIO, NO LA LEY", col=ROJO, rot=-4, x=960, y=820, size=64)
B("eso no lo pide la ley del gobierno", "bk:n62", "zoom", why="sello")
B("la de la Comisión Federal de Comercio", "img:n64", "cut", why="la regla federal")
O("la de la Comisión Federal de Comercio", "ficha", 5.6, kicker="FTC · REGLA DE FUNERALES (EE. UU.)", title="Por escrito: ninguna ley lo obliga", sub="a comprar la caja de concreto")
B("Y esa caja cuesta", "img:e35", "cut", why="Ernesto con la cotización")
O("Y esa caja cuesta", "recibo", 8.6, title="Cementerio · San Antonio", folio="cotización",
  rows=[{"at": "en dos mil veintitrés, puso la bóveda", "tx": "Bóveda (NFDA 2023)", "v": "~US$1,700"}, {"at": "abrir y cerrar la fosa", "tx": "Abrir y cerrar la fosa", "v": "+US$1,000"}],
  total={"at": "pasa de mil dólares", "tx": "Antes de la lápida", "v": "+US$2,700"})
B("abrir y cerrar la fosa", "fill", "cut", why="la fosa en el pasto")

# =====================================================================================================================
# 9 · LAS TUMBAS QUE NADIE VISITA
# =====================================================================================================================
B("Nueve. Las tumbas que nadie visita", "bk", "zoom", why="capítulo 9")
O("Nueve. Las tumbas que nadie visita", "cap", 3.6, n="9", title="Las tumbas que nadie visita")
B("Camine un día por las secciones viejas del Mezquitán", "fill", "cut", why="las secciones viejas")
B("ángeles de cantera sin nariz", "ltx:fe_angeles_cantera|n80", "cut", why="el ángel de cantera sin nariz")
B("Capillitas con la puerta de fierro oxidada", "ltx:fe_capilla_oxidada|e43", "cut", why="la capillita oxidada")
B("Nombres que ya no se leen", "img:e44", "cut", why="el nombre que ya no se lee")
B("Fechas de mil novecientos diez", "img:n81", "cut", why="la fecha 1910")
B("que nadie ha visitado en cincuenta años", "fill", "cut", why="la tumba abandonada")
B("los nietos se fueron a Estados Unidos", "img:n82", "cut", why="los nietos que se fueron")
B("Ser a perpetuidad no quiere decir que alguien lo va a cuidar", "fill", "cut", why="la hierba")
O("la hierba, el tiempo y el olvido no leen papeles", "dicho", 5.0, text="La hierba, el tiempo y el olvido no leen papeles.")
B("la hierba, el tiempo y el olvido no leen papeles", "img:n84", "fade", why="la hierba sobre la tumba")

# =====================================================================================================================
# 10 · EL SOBRE AMARILLO (PAGO del premio, ~80 %) + «lo que yo haría en el escritorio» 1-7
# =====================================================================================================================
B("Diez. El sobre amarillo", "bk", "zoom", why="capítulo 10")
O("Diez. El sobre amarillo", "cap", 3.6, n="10", title="El sobre amarillo")
B("ya cuando empezaba a clarear", "img:n85", "fade", why="el amanecer")
B("sacó de la bolsa de su saco un sobre amarillo", "ltx:fe_sobre_amarillo|e45", "cut", why="las manos sacan el sobre amarillo")
B("Viejo, doblado. Me lo dio", "fill", "cut", why="Ernesto con el sobre amarillo")
B("Adentro estaba el papel de la tumba de mi abuela", "img:n86", "cut", why="el papel de la tumba")
O("Adentro estaba el papel de la tumba de mi abuela", "recibo", 10.0, title="Título · Panteón de Mezquitán", folio="tumba de mi abuela",
  rows=[{"at": "El título, la sección", "tx": "Título · sección", "ok": 1}, {"at": "el número, la fecha", "tx": "Número · fecha", "ok": 1}],
  sello={"at": "Y atrás, con su letra", "tx": "CON SU LETRA"})
O("Entrando a la derecha, junto al pirul grande, la tercera tumba", "dicho", 5.4, d=-0.5, text="Entrando a la derecha, junto al pirul grande, la tercera tumba.")
B("junto al pirul grande, la tercera tumba", "ltx:fe_pirul_grande|e46", "cut", why="el pirul grande")
O("este es el papel más importante que te voy a dar", "dicho", 5.4, text="Este es el papel más importante que te voy a dar. Más que la funeraria.")
B("este es el papel más importante que te voy a dar", "img:e46", "cut", why="Ernesto junto al pirul")
B("La funeraria se puede volver a hacer. Esto no", "bk", "zoom", why="el dicho")
B("Yo pensé que era cosa de viejito", "fill", "cut", why="la oficina")
B("Mi papá se murió en dos mil tres", "fill", "fade", why="la tumba de Don Refugio con su maceta")
O("Mi papá se murió en dos mil tres", "foto", 4.4, src=f"{SL}/img/f01.jpg", pie="Don Refugio Navarro · 1926-2003", x=1360, y=500, w=560, rot=3)
B("lo único en toda la familia que lo tenía todo escrito era ese sobre", "ltx:fe_carpeta_papeles|e47", "cut", why="el sobre con los papeles")
B("lo que yo haría si usted estuviera sentado aquí", "img:e04", "portal", why="Ernesto del otro lado del escritorio")
O("del otro lado de mi escritorio", "stamp", 2.6, text="LO QUE YO HARÍA", col=CEMPA, rot=-4, x=1400, y=330, size=84)
O("Uno. Si quiere ver cómo tapan la fosa", "big", 3.4, text="1", sub="pida ver cómo tapan la fosa", x=1460, y=330, size=190, col=CEMPA)
B("Uno. Si quiere ver cómo tapan la fosa", "fill", "cut", why="la fosa")
O("Dos. Antes de irse del panteón, llévese el listón", "big", 3.2, text="2", sub="llévese el listón", x=1460, y=330, size=190, col=CEMPA)
B("Dos. Antes de irse del panteón, llévese el listón", "fill", "cut", why="el listón")
O("Tres. No compre la lápida el mismo día", "big", 3.2, text="3", sub="la lápida, después de las lluvias", x=1460, y=330, size=190, col=CEMPA)
B("Tres. No compre la lápida el mismo día", "fill", "cut", why="la lápida")
O("Cuatro. Busque el papel", "big", 3.6, text="4", sub="busque el papel · ¿dice temporal?", x=1460, y=330, size=190, col=CEMPA)
B("Cuatro. Busque el papel", "img:e25", "cut", why="Ernesto saca el papel del cajón")
O("Cinco. Atrás, escriba a mano cómo se llega", "big", 3.6, text="5", sub="atrás, a mano, cómo se llega", x=1460, y=330, size=190, col=CEMPA)
B("Cinco. Atrás, escriba a mano cómo se llega", "img:e48", "cut", why="Ernesto escribe atrás del papel")
B("Entrando por Federalismo, a la izquierda", "img:n35", "cut", why="la entrada por Federalismo")
B("un árbol de cincuenta años sigue ahí", "img:n88", "cut", why="el árbol viejo")
O("Seis. Si es temporal, apunte la fecha del refrendo", "big", 3.6, text="6", sub="la fecha del refrendo, con rojo", x=1460, y=330, size=190, col=CEMPA)
B("Seis. Si es temporal, apunte la fecha del refrendo", "img:e28", "cut", why="Ernesto apunta en el calendario")
O("Y al lado, un nombre", "stamp", 2.6, text="UN NOMBRE", col=ROJO, rot=-5, x=1420, y=780, size=90)
O("Siete. Tómele foto al papel y a la tumba", "big", 3.6, text="7", sub="foto al grupo de la familia", x=1460, y=330, size=190, col=CEMPA)
B("Siete. Tómele foto al papel y a la tumba", "img:e49", "cut", why="Ernesto le toma foto a la tumba")
B("ese donde la tía manda los buenos días con flores", "fill", "cut", why="el grupo de la familia")
B("lleve a alguien más joven al panteón", "img:e50", "cut", why="Ernesto con un nieto en el panteón")
B("Enséñele dónde está su bisabuela", "fill", "cut", why="el nieto frente a la tumba")
O("Nada de eso cuesta un peso", "big", 3.0, text="$0", sub="nada de eso cuesta un peso", x=1440, y=330, size=180, col=VERDE)
B("Nada de eso cuesta un peso", "fill", "cut", why="la tumba cuidada")
B("va a llegar derechito a la tumba en diez minutos", "fill", "cut", why="el bisnieto que llega")
B("Y nunca va a saber que fue usted", "fill", "fade", why="la tumba con flores")

# CTA (suscribir + pregunta) · cadena al video 2 · cierre que vuelve a la imagen del inicio
B("Cuénteme en los comentarios cómo despiden a los suyos en su pueblo", "img:e51", "cut", why="Ernesto leyendo comentarios")
O("Cuénteme en los comentarios cómo despiden", "comment", 5.4, text="En mi pueblo nos quedamos toda la noche y los hombres echan la tierra. — Michoacán", x=1300, y=800)
B("¿Se quedan toda la noche", "fill", "cut", why="la noche de veladoras")
B("¿Llevan mariachi, banda, rosario", "fill", "cut", why="el mariachi")
B("Yo los leo todos", "img:m203", "cut", why="Ernesto con los lentes en la punta de la nariz")
O("Mi esposa Rosa se ríe", "tag", 3.0, x=1300, y=420, text="ROSA", sub="mi esposa", col=CEMPA)
B("En el siguiente video le pongo enfrente el papel de la señora Delgado", "fill", "cut", why="el papel de la señora Delgado")
O("Los once mil dólares", "stamp", 2.6, text="US$11,000", col=ROJO, rot=-6, x=1420, y=760)
O("las nueve cosas que yo nunca pagaría", "big", 3.4, text="9", sub="cosas que nunca pagaría", x=1500, y=260, size=200, col=ROJO)
B("las nueve cosas que yo nunca pagaría", "fill", "cut", why="el próximo video")
B("Y cuánto pagó ella al final", "fill", "cut", why="la cotización")
B("Aquel papel dice temporal o a perpetuidad", "img:m093", "cut", why="VUELTA a la imagen del inicio: el papel en la mano")
B("Es alguien que sepa llegar", "fill", "fade", why="la tumba del principio")
B("Que Dios lo bendiga", "img:e52", "fade", why="Ernesto se despide")

# ---------------- medios disponibles ----------------
def clip_len(p):
    try: return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 2)
    except Exception: return 0.0
LTXD = PUB + f"{SL}/ltx/"; IMGD = PUB + f"{SL}/img/"
ltx_ok = {f[:-4] for f in os.listdir(LTXD) if f.endswith(".mp4")} if os.path.isdir(LTXD) else set()
VMAP = json.load(open("D:/rtmp_fe01/ltx_vlog_mapa.json", encoding="utf8")) if os.path.exists("D:/rtmp_fe01/ltx_vlog_mapa.json") else {}
img_ok = {f[:-4] for f in os.listdir(IMGD) if f.endswith(".jpg")} if os.path.isdir(IMGD) else set()
if SIM and not img_ok:  # prueba sin fotos todavía: se asumen todas las del pedido
    img_ok = {k for k in json.load(open("D:/rtmp_fe01/img/anclas.json", encoding="utf8"))} | {"f01", "f02"}
REF = set()
for b in BEATS:
    for p in re.split(r"[:|]", b["base"])[1:]: REF.add(p)
LTX_ALL = [x["id"] for x in json.load(open("D:/rtmp_fe01/ltx/pedidos.json", encoding="utf8"))]
POOL_CLIP = [x for x in LTX_ALL if x not in REF]
# cada foto tiene SU frase (anclas.json / anclas2.json): el relleno de un segundo es la foto libre anclada más cerca de ese segundo
ANC = {}
ANCL = ("anclas_v2.json",) if os.path.exists("D:/rtmp_fe01/img/anclas_v2.json") else ("anclas.json", "anclas2.json")  # v2: frases del guion v2
for fn in ("anclas.json", "anclas2.json", "anclas_v2.json"):
    if os.path.exists("D:/rtmp_fe01/img/" + fn): ANC.update(json.load(open("D:/rtmp_fe01/img/" + fn, encoding="utf8")))
if SIM: img_ok |= {k for fn in ("anclas2.json", "anclas_v2.json") if os.path.exists("D:/rtmp_fe01/img/" + fn) for k in json.load(open("D:/rtmp_fe01/img/" + fn, encoding="utf8"))}
AT = {}
for fn in ANCL:  # cada lista va en el orden del guion → búsqueda secuencial (no la 1ª coincidencia difusa)
    if not os.path.exists("D:/rtmp_fe01/img/" + fn): continue
    c0 = cur; cur = 0
    for k, ph in json.load(open("D:/rtmp_fe01/img/" + fn, encoding="utf8")).items():
        if k in ("f01", "f02"): continue
        v = at(ph)
        if v is not None: AT[k] = v
    cur = c0
POOL_IMG = sorted((x for x in img_ok if x not in REF and x not in ("f01", "f02")), key=lambda x: AT.get(x, 9e9))
used, notes, FILLS_USED = set(), [], []
def fill_img(t=None):
    libres = [f for f in POOL_IMG if f not in used]
    if not libres: return None
    if t is not None:
        cerca = [f for f in libres if f in AT and t - 12 <= AT[f] <= t + 18]
        f = min(cerca, key=lambda f: abs(AT[f] - t - 1.5)) if cerca else None
        if f is None and t is not None: return None
    else: f = libres[0]
    used.add(f); FILLS_USED.append(f); return f
MOVD = PUB + f"{SL}/mov/"  # respaldo de movimiento: la foto animada por agnes multishot (3 s, 0,33×) mientras la cola LTX está frenada
mov_ok = {f[:-4] for f in os.listdir(MOVD) if f.endswith(".mp4") and "_cu" not in f} if os.path.isdir(MOVD) else set()
def mov_o_foto(pid):
    if pid in mov_ok: return {"k": "clip", "src": f"{SL}/mov/{pid}.mp4", "len": clip_len(MOVD + pid + ".mp4"), "id": pid}
    return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": pid}
def clip_libre():
    for c in POOL_CLIP:
        if c in ltx_ok and c not in used:
            used.add(c); return {"k": "clip", "src": f"{SL}/ltx/{c}.mp4", "len": clip_len(LTXD + c + ".mp4"), "id": c}
    return None
def fill_seg(t=None):
    f = fill_img(t)  # 1º la foto de ESA frase
    if f: return mov_o_foto(f)
    c = clip_libre()  # 2º un clip de lugar que nadie pidió
    if c: return c
    # 3º otro recorte (inserto de detalle) de una foto de esa misma frase ya usada
    for u in sorted((u for u in img_ok if u in used and u in AT and abs(AT[u] - t) <= 15) if t is not None else [], key=lambda u: abs(AT[u] - t)):
        if "det_" + u not in used:
            used.add("det_" + u); h = len(used) % 4
            return {"k": "img", "src": f"{SL}/img/{u}.jpg", "id": "det_" + u, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    f = fill_img(None)
    if f: notes.append(f"relleno lejos de su frase @{t}: {f}"); return {"k": "img", "src": f"{SL}/img/{f}.jpg", "id": f}
    # todo usado: un relleno vuelve UNA vez como inserto de detalle (otro recorte, otra zona), nunca el mismo cuadro
    for u in FILLS_USED:
        if "det_" + u not in used:
            used.add("det_" + u); h = len(used) % 4
            return {"k": "img", "src": f"{SL}/img/{u}.jpg", "id": "det_" + u, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    notes.append("¡pool de relleno vacío!"); return {"k": "bk"}

def resolve(base, a):
    """base → dict de plano. Nunca repite un clip ni una foto."""
    if base.startswith("bk"):
        pid = base[3:]
        if pid in img_ok and ("bk_" + pid) not in used: used.add("bk_" + pid); return {"k": "bk", "src": f"{SL}/img/{pid}.jpg"}
        f = fill_img(a) or fill_img(None); return {"k": "bk", "src": f"{SL}/img/{f}.jpg"} if f else {"k": "bk"}
    if base == "fill": return fill_seg(a)
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
    if pid in img_ok and pid not in used:
        used.add(pid); return mov_o_foto(pid)
    if pid in img_ok and ("det_" + pid) not in used:
        used.add("det_" + pid); h = len(used) % 4
        return {"k": "img", "src": f"{SL}/img/{pid}.jpg", "id": "det_" + pid, "det": 1, "dz": [[-260, -60], [0, -120], [240, 60], [-120, 110]][h]}
    notes.append(f"{base} sin medio → relleno"); return fill_seg(a)

BEATS.sort(key=lambda b: b["a"])
ZS = [[1.03, 1.13], [1.13, 1.03], [1.05, 1.12], [1.04, 1.15]]
segs = []
for n, b in enumerate(BEATS):
    g = {"a": b["a"], "tr": b["tr"] or "cut", "why": b["why"], "ph": b["ph"], **resolve(b["base"], b["a"])}
    segs.append(g)
segs[0]["a"] = 0.0
# el avatar pisa sus ventanas; al salir vuelve lo que corresponda (una foto/clip ya empezado no se retoma → relleno)
for w in AVW:
    ms, me = w["ms"], w["me"]
    before = [g for g in segs if g["a"] <= me]
    active = before[-1] if before else segs[0]
    segs = [g for g in segs if not (ms <= g["a"] < me)]
    segs.append({"a": round(ms, 2), "k": "av", "tr": "zoom" if len(segs) % 2 else "iris", "why": "avatar", "ph": ""})
    nxt = [g for g in segs if g["a"] >= me]
    if not nxt or nxt[0]["a"] - me > 0.8:
        r = dict(active); r["a"] = round(me, 2); r["tr"] = "swipeL"
        if r["k"] in ("img", "clip") and active["a"] < ms: r = {"a": round(me, 2), "tr": "swipeL", "why": "relleno tras el avatar", "ph": "", **fill_seg(me)}
        segs.append(r)
    segs.sort(key=lambda g: g["a"])
segs[0]["tr"] = "cut"
out = []
for g in segs:
    if out and g["a"] - out[-1]["a"] < 1.0 and out[-1]["k"] != "av" and g["k"] != "av": out[-1] = g; continue
    out.append(g)
segs = out
# planos largos: foto > ~4 s (3 s en el 1er minuto) o clip que se queda corto → otro plano (nunca > ~4 s quieto)
add = []
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    lim = min(g.get("len", 3) + 1.0, 6.0) if g["k"] == "clip" else (3.0 if g["a"] < 60 else 4.0) if g["k"] == "img" else 5.5 if g["k"] == "bk" else 99
    t0 = g["a"] + lim
    while g["k"] in ("img", "clip", "bk") and b - t0 > 1.2:
        x = {"a": round(t0, 2), "tr": "cut", "why": "el plano se acaba → otro", "ph": "", **fill_seg(t0)}
        add.append(x); t0 += min(x.get("len", 3) + 1.0, 6.0) if x["k"] == "clip" else (3.0 if t0 < 60 else 4.0)
segs = sorted(segs + add, key=lambda g: g["a"])
segs = [g for i, g in enumerate(segs) if g["k"] == "av" or i + 1 >= len(segs) or segs[i + 1]["a"] - g["a"] >= 0.7]
for n, g in enumerate(segs):
    if g.get("k") == "img" and "det" in g:
        g["z"] = [1.32, 1.42]; g["ox"], g["oy"] = g.pop("dz"); g.pop("det")
    elif g.get("k") == "img":
        h = n % 4; g["z"] = ZS[h]; g["ox"] = [0, -30, 30, 0][h]; g["oy"] = [0, 10, -10, -20][h]

# ---------------- piezas: "at" de texto → segundos ----------------
ov = []
for o in OVS:
    for lk in ("items", "rows", "pins"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for it in o[lk]:
                if isinstance(it.get("at"), str):
                    a = T(it["at"], o["a"]); it["at"] = a if a is not None and a < o["b"] else round(o["a"] + 0.6 + 0.7 * o[lk].index(it), 2)
    for dk in ("route", "total", "sello"):
        if dk in o and isinstance(o[dk].get("at"), str):
            a = T(o[dk]["at"], o["a"]); o[dk]["at"] = a if a is not None and a < o["b"] else round(o["b"] - 1.6, 2)
    for kk in ("venceAt",):
        if isinstance(o.get(kk), str):
            v = T(o[kk], o["a"])
            if v is None: print("  ! ancla interna sin encontrar:", o["k"], kk, o[kk]); v = o["a"] + 1.5
            o[kk] = v
    if "from_" in o: o["from"] = o.pop("from_")
    ov.append(o)
# las piezas no van encima del avatar (le tapan la cara): si entra ≥2 s antes de la ventana se recorta; si no, se corre a la
# salida de la ventana (si eso es ≤5 s después de su frase) con su largo; si tampoco, sale
nv = []
for o in sorted(ov, key=lambda o: o["a"]):
    a, b = o["a"], o["b"]
    for _ in range(3):
        w = next((w for w in AVW if a < w["me"] and b > w["ms"]), None)
        if not w: break
        if w["ms"] - a >= 2.0: b = w["ms"]; break
        L = b - a
        if w["me"] - o["a"] <= 7.0: a = w["me"] + 0.15; b = a + L; continue
        # si no, antes de la ventana (anticipa ≤6 s la frase) cuando el hueco previo alcanza
        pw = max((x["me"] for x in AVW if x["me"] <= w["ms"]), default=0)
        a2 = max(w["ms"] - 0.15 - L, pw + 0.15)
        if w["ms"] - 0.15 - a2 >= min(L, 2.2) and o["a"] - a2 <= 6.0: a, b = a2, w["ms"] - 0.15; break
        a = None; break
    if a is None or next((w for w in AVW if a < w["me"] and b > w["ms"]), None):
        notes.append(f"pieza {o['k']} @{o['a']} quedó bajo el avatar → sale"); continue
    x = dict(o); sh = round(a - o["a"], 2); x["a"], x["b"], x["a0"] = round(a, 2), round(b, 2), o["a"]
    if sh:  # las anclas internas se corren con la pieza
        for lk in ("items", "rows", "pins"):
            if lk in x and x[lk] and isinstance(x[lk][0], dict): x[lk] = [{**it, "at": round(it["at"] + sh, 2)} for it in x[lk]]
        for dk in ("route", "total", "sello"):
            if dk in x: x[dk] = {**x[dk], "at": round(x[dk]["at"] + sh, 2)}
        if "venceAt" in x: x["venceAt"] = round(x["venceAt"] + sh, 2)
    nv.append(x)
ov = sorted(nv, key=lambda o: (o["a"], o["k"] != "cap"))  # a la par, el capítulo va primero
# una pieza por vez (el rótulo de nombre/lugar convive): la que entra corta a la anterior; si a la anterior le quedan <1,2 s, la nueva espera
SOLAS = ("lower", "lugar", "tag")
CHICAS = {"stamp": (960, 540), "big": (960, 520), "comment": (1300, 800), "chips": (960, 880)}  # piezas que ocupan un lugar del cuadro
def choca(o, p):  # dos piezas chicas en lugares distintos del cuadro conviven; si alguna ocupa el cuadro entero, chocan
    if o["k"] not in CHICAS or p["k"] not in CHICAS: return True
    (ox, oy), (px, py) = [(z.get("x", CHICAS[z["k"]][0]), z.get("y", CHICAS[z["k"]][1])) for z in (o, p)]
    return abs(oy - py) < 300 and abs(ox - px) < 800
for i, o in enumerate(ov):
    if o["k"] in SOLAS: continue
    for p in ov[:i]:
        if p["k"] in SOLAS or p["b"] <= o["a"] or (abs(o["a0"] - p["a0"]) < 0.6 and "cap" not in (o["k"], p["k"])): continue  # las que entran juntas son un combo a propósito (menos el capítulo)
        if not choca(o, p): continue
        if p["a"] - p["a0"] > 4.0 and o["a"] - o["a0"] < 1.5 and p["k"] not in ("cap", "big"): p["b"] = p["a"]; continue  # la corrida lejos de su frase cede el lugar (sale)
        keep = 3.0 if p["k"] == "cap" else 1.2  # lo mínimo que se ve la anterior (el capítulo, más)
        if o["a"] - p["a"] < keep: o["a"] = round(min(p["b"], p["a"] + keep) + 0.05, 2)  # la nueva espera (su final no se mueve)
        p["b"] = round(min(p["b"], o["a"] - 0.05), 2)
ov = [o for o in ov if o["b"] - o["a"] >= 1.0 or notes.append(f"pieza {o['k']} @{o['a']} quedó <1 s al encimarse → sale")]
# las piezas grandes no tapan una cara: se mira la cara del plano de abajo (haar, cacheado) y si la pieza la pisa se espeja al
# otro lado (las de costado) o se baja/sube (las del centro)
import cv2
_YN = "D:/rtmp/lu30/modelos/yunet.onnx"
_CF = "D:/rtmp_fe01/caras.json"; _CC = json.load(open(_CF)) if os.path.exists(_CF) else {}
def caras(src):
    f = PUB + src
    if not os.path.exists(f): return []
    key = f"{src}|{int(os.path.getmtime(f))}"
    if key not in _CC:
        if f.endswith(".mp4"):
            cap = cv2.VideoCapture(f); n = int(cap.get(cv2.CAP_PROP_FRAME_COUNT)); cap.set(cv2.CAP_PROP_POS_FRAMES, n // 2); ok, im = cap.read(); cap.release()
            im = im if ok else None
        else: im = cv2.imread(f)
        fs = []
        if im is not None:
            hh, ww = im.shape[:2]; d = cv2.FaceDetectorYN.create(_YN, "", (ww, hh), 0.75)
            for r in (d.detect(im)[1] if d.detect(im)[1] is not None else []):
                x, y, w, h = [float(v) for v in r[:4]]
                fs.append([round((x - w * 0.3) / ww * 1920), round((y - h * 0.4) / hh * 1080), round((x + w * 1.3) / ww * 1920), round((y + h * 1.3) / hh * 1080)])
        _CC[key] = fs
    return _CC[key]
GRANDES = {"ficha": (1380, 560, 760, 900), "recibo": (1340, 540, 820, 620), "foto": (1350, 520, 640, 600), "mapa": (960, 540, 640, 640),
           "dicho": (960, 545, 1240, 420), "quote": (960, 545, 1300, 420), "refrendo": (960, 560, 900, 620)}
def caja(o, x=None, y=None):
    if o["k"] == "stamp":
        sz = o.get("size", 110); wd = min(1800, len(o["text"]) * sz * 0.75 + 80); x = o["x"] if x is None else x; y = o["y"] if y is None else y
        x = max(wd / 2 + 60, min(1860 - wd / 2, x)); return (x - wd / 2, y - 95, x + wd / 2, y + 95)
    if o["k"] == "big":
        sz = o.get("size", 220); ss = max(46, sz * 0.2); wd = max(len(o["text"]) * sz * 0.66, len(o.get("sub", "")) * ss * 0.66) + 80
        x = o.get("x", 960) if x is None else x; y = o.get("y", 520) if y is None else y; x = max(wd / 2, min(1920 - wd / 2, x))
        hh = sz + (ss + 14 if o.get("sub") else 0); return (x - wd / 2, y - hh / 2, x + wd / 2, y + hh / 2)
    dx, dy, w, h = GRANDES[o["k"]]; w = o.get("w", w); x = o.get("x", dx) if x is None else x; y = o.get("y", dy) if y is None else y
    if o["k"] in ("dicho", "quote"): return (x - w / 2, y - 210, x + w / 2, y - 210 + h)
    return (x - w / 2, y - h / 2, x + w / 2, y + h / 2)
def pisa(bx, fs): return sum(max(0, min(bx[2], f[2]) - max(bx[0], f[0])) * max(0, min(bx[3], f[3]) - max(bx[1], f[1])) for f in fs)
movidas = 0
for o in ov:
    if o["k"] not in GRANDES and o["k"] not in ("stamp", "big"): continue
    fs = [f for i, g in enumerate(segs) if g["k"] != "av" and g.get("src") and g["a"] < o["b"] and (segs[i + 1]["a"] if i + 1 < len(segs) else END) > o["a"] for f in caras(g["src"])]
    if not fs or not pisa(caja(o), fs): continue
    dx, dy = GRANDES.get(o["k"], (o.get("x"), o.get("y")))[:2]; x0, y0 = o.get("x", dx), o.get("y", dy)
    if o["k"] in ("stamp", "big"): alts = [(x0, 860), (x0, 190), (1920 - x0, y0), (1920 - x0, 860)]
    else: alts = [(1920 - x0, y0)] if abs(x0 - 960) > 150 else [(x0, 790), (x0, 300), (520, y0), (1400, y0)]
    best = min([(x0, y0)] + alts, key=lambda p: pisa(caja(o, *p), fs))
    if best != (x0, y0):
        if o["k"] in ("dicho", "quote") and best[0] != x0: o["w"] = 860
        o["x"], o["y"] = best; movidas += 1
json.dump(_CC, open(_CF, "w"))
notes.append(f"caras: {movidas} piezas corridas para no tapar una cara")
# lo de adentro de una pieza (renglones, pines, sello, total, vence) tiene que pasar mientras se ve: si la pieza quedó más
# corta o corrida y algo cae después de su final, se comprime todo ese adentro entre su entrada y 1 s antes de que salga
apretadas = 0
for o in ov:
    refs = []
    for lk in ("rows", "items", "pins"):
        for it in (o.get(lk) or []):
            if isinstance(it, dict):
                for kk in ("at", "tacha", "ok"):
                    if isinstance(it.get(kk), (int, float)) and it[kk] > 10: refs.append((it, kk))
    for dk in ("route", "total", "sello"):
        if isinstance(o.get(dk), dict) and isinstance(o[dk].get("at"), (int, float)): refs.append((o[dk], "at"))
    if isinstance(o.get("venceAt"), (int, float)): refs.append((o, "venceAt"))
    if not refs: continue
    ts = [d[kk] for d, kk in refs]; lo, hi = o["a"] + 0.5, o["b"] - 1.0
    if max(ts) <= hi and min(ts) >= o["a"]: continue
    t0, t1 = min(ts), max(ts)
    for d, kk in refs: d[kk] = round(lo + (d[kk] - t0) * (hi - lo) / (t1 - t0), 2) if t1 > t0 else round(lo, 2)
    apretadas += 1
notes.append(f"adentro: {apretadas} piezas con renglones/sello apretados para que se vean enteros")
lost = [n for n in notes if n.startswith("pieza")]

reel = os.path.exists(PUB + f"av/{SL}/reel0.mp4")
rl = clip_len(PUB + f"av/{SL}/reel0.mp4") if reel else 0
if not SIM:
    json.dump([{k: v for k, v in g.items() if k not in ("why", "ph", "id")} for g in segs], open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
    json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
    json.dump({"reel": reel, "reelLen": round(rl, 3), "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
    shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"], "src": g.get("src"), "len": g.get("len")} for i, g in enumerate(segs)]
    json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))

# ---------------- el plan minuto a minuto (una línea por plano) ----------------
def mmss(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"
lines = [f"# {SL} · PLAN MxM (generado de plan_fe01.py, escrito a mano plano por plano){' · SIMULADO sin voz' if SIM else ''} · END {mmss(END)}", "mm:ss-mm:ss · frase · plano · componente · sonido", ""]
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    pz = [o["k"] for o in ov if g["a"] - 0.2 <= o["a"] < b]
    what = g["k"] + (":" + (g.get("src") or "").split("/")[-1] if g.get("src") else "")
    snd = "voz" if g["k"] == "av" else "voz + audio nativo del clip −26 dB" if g["k"] == "clip" else "voz + foley suave (viento, pájaros, grava)"
    lines.append(f"{mmss(g['a'])}-{mmss(b)} · {g.get('ph', '')[:48]} · {what} ({g.get('why', '')}) · {', '.join(pz) or '—'} · {snd}")
open(f"D:/rtmp/{SL}_PLAN_MxM{'_SIM' if SIM else ''}.md", "w", encoding="utf8").write("\n".join(lines))

# ---------------- medición ----------------
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "img", "clip", "bk")}
gap, last = 0, 0
for g, d in zip(segs, dur):
    if g["k"] == "av": last = g["a"] + d
    else: gap = max(gap, g["a"] + d - last)
m1 = [d for g, d in zip(segs, dur) if g["a"] < 60]
print(f"{'SIMULADO · ' if SIM else ''}END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · 1er min {len(m1)} planos (máx {max(m1):.1f}s) · {tot} · av {100*tot['av']/END:.0f}% · hueco máx sin avatar {gap:.1f}s")
print(f"piezas {len(ov)} (perdidas bajo el avatar {len(lost)}) · beats {len(BEATS)} · LTX llegados {len(ltx_ok)} · fotos {len(img_ok)} · reel {reel}")
nl = sum(1 for g in segs if "/ltx/" in (g.get("src") or ""))
print(f"clips LTX en pantalla {nl} · respaldos usados {sum(1 for n in notes if n.startswith('LTX'))}")
long_ = [(mmss(g["a"]), round(d, 1), g["k"]) for g, d in zip(segs, dur) if d > 4.6 and g["k"] not in ("av",)]
print("planos > 4,6 s (no avatar):", long_[:20], "…" if len(long_) > 20 else "")
print("SIN ANCLAR:", miss if miss else "ninguna")
for n in notes:
    if not n.startswith("LTX"): print("  ", n)
