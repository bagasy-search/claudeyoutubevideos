# fe02 · «Después de 40 años de funerario, estas son las 9 cosas que nunca pagaría» (Don Ernesto) · plan del video ENTERO a mano,
# frase por frase (at() sobre words.json). La base fuera del avatar es SIEMPRE el MUNDO 3D (Funerales Navarro en corte): cada
# B() pone la cámara en una ESTACIÓN (mundo3d.tsx: ST) y entre dos planos de mundo seguidos la cámara VUELA (sin corte).
# "bk:<estación>" = el mundo desenfocado y oscurecido detrás de una pieza grande. Ventanas del avatar = avwin.json (fijas, pagas).
# → segs.json, ov.json, cams.json, ev.json, avail.json, edl.json en src/fe02 y D:/rtmp/fe02_PLAN_MxM.md.
# ⛔ Nunca cuerpos, ataúd abierto ni restos en pantalla. ⛔ Después de que llega el avatar NO se re-planifica.
import json, os, re, subprocess, unicodedata, sys, statistics

sys.stdout.reconfigure(encoding="utf-8")
SL = "fe02"
R = f"D:/wt/{SL}/"
S = R + f"src/{SL}/"
PUB = R + "public/"
WAV = PUB + f"{SL}cut.wav"

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))

W = [[w, a] for w, a, b in json.load(open(S + "words.json", encoding="utf8"))]
END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode())
TOK = [norm(w) for w, _ in W]
TS = [float(s) for _, s in W]
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
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

BEATS, OVS, EVS = [], [], {}
def B(ph, st, why="", d=0.0, **kw):
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, st=st, ph=ph, why=why, **kw))
def O(ph, k, L=None, d=0.0, **kw):
    a = at(ph, d)
    if a is None: return
    if L is None:  # duración = 0,8 s + palabras ÷ 2,5 del texto que se lee
        txt = " ".join(str(kw.get(x, "")) for x in ("title", "text", "dato", "sub", "kicker", "back", "note", "tx", "name", "l2"))
        L = max(2.6, 0.8 + len(txt.split()) / 2.5)
    OVS.append(dict(k=k, a=a, b=round(a + L, 2), **kw))
def T(ph, t0=0.0):
    """segundo de una frase buscando desde t0 SIN mover el cursor."""
    global cur
    c = cur; cur = next((i for i, x in enumerate(TS) if x >= t0 - 3), 0); v = at(ph); cur = c; return v
def EV(name, ph, d=0.0):
    a = at(ph, d)
    if a is not None: EVS.setdefault(name, []).append(a)
CEMPA, ROJO, VERDE = "#f39a1e", "#b8322a", "#3f9d5a"

# =====================================================================================================================
# 0:00 GANCHO «vos estás ahí»: el espectador frente al escritorio, la cotización y la pluma; Ernesto le frena la mano.
# =====================================================================================================================
B("Usted está sentado frente al escritorio de la funeraria", "escritorio", "el lugar del espectador: el escritorio, la veladora")
B("Tiene la cotización en la mano", "cotizacion", "la hoja: $86.400")
O("Tiene la cotización en la mano", "tag", 2.6, x=1250, y=360, text="$86.400", sub="la cotización", col=CEMPA)
B("y la pluma ya está tocando el papel", "pluma", "la punta de la pluma sobre la línea de la firma")
B("Espérese", "retrato", "Ernesto (el retrato) le frena la mano")
O("No firme todavía", "stamp", 2.4, text="NO FIRME TODAVÍA", col=ROJO, rot=-5, x=1300, y=820, size=86)
B("Déjeme ver esa hoja", "cotizacion", "la hoja de cerca")
B("Porque en esa hoja hay por lo menos nueve renglones", "pluma", "renglón por renglón")
O("hay por lo menos nueve renglones que yo nunca pagaría", "big", 3.0, text="9 RENGLONES", sub="que yo nunca pagaría", x=1350, y=470, size=170)
B("Y nadie se los va a tachar más que usted", "escritorio", "la pluma ahora es de usted")
B("La otra vez le conté lo que pasa en el panteón", "lapida", "callback a fe01: el panteón, el nicho de cantera")
B("Hoy nos quedamos antes, aquí, en la oficina", "oficina", "vuelta a la oficina en corte")
B("en el momento en que se decide casi todo el dinero", "cotizacion", "donde se decide el dinero")
B("Mi nombre es Ernesto Navarro", "fotos", "la pared: Don Refugio y el crucifijo")
O("Mi nombre es Ernesto Navarro", "lower", 5.0, name="DON ERNESTO NAVARRO", l2="Funerario · más de 40 años · Analco, Guadalajara")
B("Mi papá, Don Refugio, abrió Funerales Navarro en Analco", "ventana", "la ventana a Analco")
B("en Analco en 1958", "cupula", "la cúpula del templo de Analco al atardecer")
O("en Analco en 1958", "lugar", 3.2, tx="Funerales Navarro", sub="Analco, Guadalajara · 1958")
B("veinticinco años en funerarias del West Side", "bk:corte", "San Antonio")
O("veinticinco años en funerarias del West Side", "mapa", 3.6, city="sa", pins=[{"at": "del West Side", "l": "westside", "tx": "WEST SIDE"}], title="San Antonio, Texas", x=1400, y=520, sc=0.66)
B("Enterré a más de seis mil personas", "corte", "la funeraria entera en corte, de frente")
O("Enterré a más de seis mil personas", "cuenta", 3.2, from_=0, to=6000, pre="", suf="+", sub="familias que despedí", size=200, x=1380, y=300)
B("Y vi a muchas familias firmar esta misma hoja", "cotizacion", "la misma hoja")
B("con los ojos llenos de lágrimas, sin leerla", "veladora", "la veladora del escritorio")
B("Le voy a enseñar las nueve cosas que yo nunca pagaría", "exhibicion", "la sala donde se gasta el dinero")
B("con su precio de verdad", "tag1", "una etiqueta colgante")
B("Y al final le voy a enseñar un solo renglón", "bk:cotizacion", "EL PREMIO: el renglón")
O("El renglón que le ahorra la mitad de la cuenta", "lista", 4.6, title="El renglón que ahorra la mitad", sub="lo dejo para el final",
  rows=[{"tx": "Ataúd"}, {"tx": "Bóveda"}, {"tx": "Urna"}, {"tx": "Flores"}, {"tx": "¿ · · · ?"}], hi=4, hiAt="El renglón que le ahorra la mitad")
B("Ese lo dejo para el último", "sobre", "el sobre amarillo cerrado: lo que se guarda para el final")
B("Si usted ya enterró a su papá o a su mamá", "capilla", "la capilla de velación")
B("suscríbase hoy, en un día tranquilo", "veladoras", "las veladoras, un día tranquilo")
O("suscríbase hoy, en un día tranquilo", "stamp", 3.0, text="SUSCRÍBASE · EN UN DÍA TRANQUILO", col=VERDE, rot=-4, x=1250, y=830, size=58)
B("Para que el día que le pongan esa hoja enfrente", "cotizacion", "la hoja enfrente")
B("usted ya sepa qué tachar", "pluma", "la pluma lista")
B("Y cuénteme en los comentarios", "ventana", "afuera: ciudades y pueblos")
O("¿desde qué ciudad o qué pueblo me está viendo?", "comment", 3.6, text="¿Desde qué ciudad o pueblo me ve?", x=1300, y=820)
B("Mi papá decía una cosa que yo repito todos los días", "fotos", "la foto de Don Refugio")
B("el precio se da por escrito, o no se da", "bk:sobre", "la regla de Don Refugio sale del sobre")
O("Mi papá decía una cosa que yo repito", "sobre", 7.5, openAt="el precio se da por escrito", text="El precio se da por escrito, o no se da.", who="Don Refugio Navarro")
B("Con esa regla vamos a recorrer la funeraria", "corte", "la funeraria entera: el recorrido")
B("Empezamos por la sala donde se gasta más dinero", "exhibicion", "la sala de exhibición")

# =====================================================================================================================
# 1 · EL ATAÚD SELLADO
# =====================================================================================================================
B("Número uno. El ataúd sellado", "bk:ataud1", "capítulo 1")
O("Número uno. El ataúd sellado", "cap", 3.4, n="1", title="El ataúd sellado", sub="«de protección»")
B("Usted entra a la sala de exhibición", "exhibicion", "entra a la sala")
B("y el vendedor se para junto a un ataúd con una goma en la tapa", "tapa", "la goma de la tapa (cerrado)")
B("Le dice que es de protección", "ataud1", "el sellado de bronce")
B("que su mamá va a estar protegida", "tag1", "la etiqueta todavía dice ¿Cuánto?")
B("Y cuesta varios miles de pesos más", "tag1", "la etiqueta se da vuelta: $20.500")
EV("tags", "Y cuesta varios miles de pesos más")
O("cuesta varios miles de pesos más que el de al lado", "tag", 3.6, x=760, y=560, dx=-160, dy=-220, text="+$11.000", sub="que el de al lado · sólo por la goma", col=CEMPA)
B("Fíjese bien en lo que no le dice", "ataud2", "el de al lado, sencillo")
B("En Estados Unidos, la ley de la FTC para funerarias", "bk:ataud1", "la ley")
O("la ley de la FTC para funerarias prohíbe decir", "ficha", None, kicker="LEY DE LA FTC · FUNERARIAS (EE. UU.)", title="Prohibido decir que el ataúd conserva el cuerpo", sub="porque no es cierto")
B("La goma sirve para que no entre la lluvia un tiempo", "tapa", "la goma: sólo la lluvia")
O("La goma sirve para que no entre la lluvia un tiempo. Nada más", "stamp", 2.6, text="NADA MÁS", col=ROJO, rot=-6, x=1350, y=320, size=110)
B("¿Cuándo sí hace falta un ataúd sellado?", "carroza", "el viaje: la carroza")
B("Cuando el cuerpo viaja a otro país", "faros", "a otro país")
O("Cuando el cuerpo viaja a otro país", "chips", 3.4, items=["AEROLÍNEA", "CONSULADO", "OTRO PAÍS"], y=880)
B("Para velar aquí en la ciudad y enterrar mañana", "capilla", "velar aquí")
B("un ataúd normal cumple igual", "tag2", "la etiqueta del de madera: $9.500")
EV("tags", "un ataúd normal cumple igual")
B("Mi regla en Funerales Navarro era simple", "escritorio", "vuelta al escritorio")
O("el sellado se pide por papel, no por palabra", "dicho", None, text="El sellado se pide por papel, no por palabra.", who="la regla de Funerales Navarro")
B("el sellado se pide por papel", "bk:escritorio", "la regla")
B("Si le dicen que es obligatorio, usted pregunta", "cotizacion", "la pregunta")
O("¿qué ley o qué aerolínea lo pide? Escríbamelo", "quote", 3.6, text="¿Qué ley o qué aerolínea lo pide? Escríbamelo.", who="lo que usted pregunta", y=820, w=1150)
B("Primer renglón tachado", "pluma", "PLUMA TACHA: el sellado")
EV("strikes", "Primer renglón tachado", 0.3)
B("Y fíjese que el vendedor no es mala persona", "exhibicion", "la sala, el vendedor no está en cuadro")
B("Muchas veces gana una comisión", "tag3", "la etiqueta del metálico")
O("gana una comisión por cada cosa que le suma", "tag", 3.0, x=1300, y=380, text="COMISIÓN", sub="por cada cosa que suma", col=CEMPA)
B("y le enseñaron a ofrecer primero lo más caro", "ataud1", "lo más caro primero")
B("Por eso usted no va solo", "sillas", "las sillas: alguien al lado")
O("Lleve a un compadre, a una sobrina", "chips", 3.6, items=["UN COMPADRE", "UNA SOBRINA", "ALGUIEN QUE NO ESTÉ LLORANDO"], y=880)
B("Con alguien al lado, la conversación cambia", "escritorio", "dos sillas frente al escritorio")

# =====================================================================================================================
# 2 · EL EMBALSAMAMIENTO
# =====================================================================================================================
B("Número dos. El embalsamamiento", "bk:capilla", "capítulo 2")
O("Número dos. El embalsamamiento", "cap", 3.4, n="2", title="El embalsamamiento", sub="cuando no hay velorio")
B("Embalsamar cuesta de tres mil a seis mil pesos", "cotizacion", "el renglón en la hoja")
O("Embalsamar cuesta de tres mil a seis mil pesos", "big", 3.0, text="$3.000 – 6.000", sub="embalsamar", x=1300, y=360, size=150)
B("Y se lo ofrecen como si fuera parte del servicio", "capilla", "la capilla")
B("No siempre hace falta", "veladoras", "las veladoras")
B("La Ley General de Salud pide inhumar o cremar", "bk:capilla", "la ley")
O("La Ley General de Salud pide inhumar o cremar", "ficha", None, kicker="LEY GENERAL DE SALUD · MÉXICO", title="Inhumar o cremar", dato="12 a 48 h", sub="del fallecimiento")
B("Si la familia va a cremar directo, sin velación", "urnas", "cremar directo")
B("no hay ley que lo obligue a embalsamar", "bk:urnas", "ninguna ley")
O("no hay ley que lo obligue a embalsamar", "stamp", 2.8, text="NINGUNA LEY LO OBLIGA", col=ROJO, rot=-4, x=960, y=520, size=90)
B("Se embalsama cuando pasan más de 48 horas", "carroza", "traslado largo")
O("Se embalsama cuando pasan más de 48 horas", "chips", 3.8, items=["+48 HORAS", "TRASLADO LARGO", "VELORIO DE VARIOS DÍAS"], y=880)
B("Esa es una decisión de ustedes, no del vendedor", "escritorio", "la decisión es suya")
B("Cuando yo era muchacho, en Analco", "cupula", "Analco, el templo")
O("Cuando yo era muchacho, en Analco", "lugar", 3.0, tx="Analco", sub="los velorios en la casa")
B("con café de olla y pan dulce", "veladoras", "una sola noche, veladoras")
B("Nadie hablaba de embalsamar", "capilla", "la capilla sencilla")
B("Así que la pregunta es una sola", "cotizacion", "la pregunta")
O("¿la ley me lo pide para lo que vamos a hacer?", "quote", 3.6, text="¿La ley me lo pide para lo que vamos a hacer?", who="la pregunta", y=820, w=1150)
B("Si la respuesta es no, ese renglón se tacha", "pluma", "PLUMA TACHA: embalsamamiento")
EV("strikes", "ese renglón se tacha", 0.2)
B("Escríbame en los comentarios una palabra", "ventana", "afuera")
O("¿a usted se lo ofrecieron alguna vez? Sí o no", "comment", 3.4, text="¿Se lo ofrecieron alguna vez? Sí o no.", x=1300, y=820)

# =====================================================================================================================
# 3 · LA BÓVEDA DE LUJO
# =====================================================================================================================
B("Número tres. La bóveda de lujo", "bk:bovedas", "capítulo 3")
O("Número tres. La bóveda de lujo", "cap", 3.4, n="3", title="La bóveda de lujo")
B("Esto lo aprendí en San Antonio", "bovedas", "las dos bóvedas")
B("Allá muchos cementerios piden que el ataúd vaya dentro de una caja de concreto", "boveda_llana", "la caja de concreto")
B("Eso es regla del cementerio, no de la ley", "bk:boveda_llana", "regla del cementerio")
O("Eso es regla del cementerio, no de la ley", "tag", 3.0, x=1250, y=380, text="REGLA DEL CEMENTERIO", sub="no de la ley", col=CEMPA)
B("Y ahí empieza la venta", "boveda_lujo", "la de lujo, el forro de bronce")
B("Le enseñan la bóveda con forro de bronce", "boveda_lujo", "el bronce de cerca", side=1)
B("Según la asociación de funerarios de Estados Unidos", "bk:bovedas", "el dato")
O("la mediana de una bóveda ya anda en unos mil setecientos dólares", "ficha", None, kicker="ASOCIACIÓN DE FUNERARIOS · EE. UU.", title="Mediana de una bóveda", dato="US$1.700", sub="y las de lujo, mucho más")
B("Lo que el cementerio pide se cumple con la más sencilla", "boveda_llana", "la sencilla cumple")
B("Nadie va a ver la bóveda", "patio", "el patio: se echa la tierra")
B("Aquí en Guadalajara pasa lo mismo con las gavetas", "nicho", "el muro de nichos")
O("pague lo que pide el panteón, con su recibo oficial", "chips", 3.4, items=["LO QUE PIDE EL PANTEÓN", "CON RECIBO OFICIAL"], y=880)
B("Lo demás es adorno que nadie va a ver", "pluma", "PLUMA TACHA: bóveda de lujo")
EV("strikes", "Lo demás es adorno que nadie va a ver", 0.5)
B("Y ahora le debo una honestidad", "veladora", "la veladora: honestidad")
B("Hay familias que quieren la bóveda buena porque así se quedan en paz", "boveda_lujo", "la de lujo, sin juicio")
B("Lo que yo no quiero es que la pague porque le dijeron que la ley se la pide", "bk:boveda_lujo", "la mentira")
O("porque le dijeron que la ley se la pide", "stamp", 2.6, text="ESO NO ES CIERTO", col=ROJO, rot=-5, x=960, y=520, size=96)

# =====================================================================================================================
# 4 · LA URNA CARA
# =====================================================================================================================
B("Número cuatro. La urna cara para la cremación", "bk:urnas", "capítulo 4")
O("Número cuatro. La urna cara para la cremación", "cap", 3.4, n="4", title="La urna cara", sub="para la cremación")
B("Si la familia decide cremar, la funeraria le ofrece una urna", "urnas", "la repisa de urnas")
B("Una urna sencilla cuesta de 800 a 2.500 pesos", "urnas", "la sencilla", side=-1)
O("Una urna sencilla cuesta de 800 a 2.500 pesos", "etiqueta", 3.6, flipAt="Una urna sencilla cuesta", front="¿Sencilla?", back="$800–2.500", sub="urna sencilla", x=1420, y=420, w=460)
B("Una de madera o de barro, de mercado", "urna_barro", "la de barro: $300-800")
O("Una de madera o de barro, de mercado", "etiqueta", 3.6, flipAt="de barro, de mercado", front="¿Barro?", back="$300–800", sub="de mercado", x=1420, y=420, w=460)
B("Las de mármol o de metal fino cuestan mucho más", "urna_marmol", "la de mármol")
O("y guardan exactamente lo mismo", "stamp", 2.6, text="GUARDAN LO MISMO", col=CEMPA, rot=-4, x=1250, y=830, size=80)
B("Yo llevé muchas urnas de barro a casa de las familias", "urna_barro", "el barro de cerca")
O("las cenizas no saben si el barro es fino", "dicho", None, text="Las cenizas no saben si el barro es fino.", who="Don Ernesto")
B("las cenizas no saben si el barro es fino", "pluma", "PLUMA TACHA: urna de mármol")
EV("strikes", "las cenizas no saben si el barro es fino", 1.0)
B("Usted puede comprar una urna de barro en Tlaquepaque", "urna_barro", "Tlaquepaque")
O("Usted puede comprar una urna de barro en Tlaquepaque", "lugar", 3.0, tx="Tlaquepaque", sub="barro de mercado")
B("Muchas la reciben; pregunte antes si cobran algo", "escritorio", "pregunte en el escritorio")
B("En Estados Unidos es más claro todavía", "bk:urnas", "la ley")
O("la ley de la FTC dice que la funeraria no puede negarse", "ficha", None, kicker="LEY DE LA FTC · EE. UU.", title="No pueden negarse a su urna o ataúd de afuera", sub="ni cobrarle un cargo por eso")
B("Mi esposa Rosa tiene en la sala una urna de barro", "urna_barro", "la urna de Rosa", side=1)
B("con una piedra de Analco encima", "cupula", "Analco")
O("una urna con historia vale más que una de tienda", "quote", 3.4, text="Una urna con historia vale más que una de tienda.", who="Rosa", y=820, w=1100)

# =====================================================================================================================
# 5 · LAS FLORES
# =====================================================================================================================
B("Número cinco. Las flores de la funeraria", "bk:flores", "capítulo 5")
O("Número cinco. Las flores de la funeraria", "cap", 3.4, n="5", title="Las flores de la funeraria")
B("Las flores de la funeraria son caras", "flores", "la corona de la funeraria")
B("muchas veces son las mismas flores del mercado con un moño", "flores", "las mismas flores", side=1)
B("y la corona grande se presenta como si fuera obligatoria", "capilla", "la corona grande")
O("la corona grande se presenta como si fuera obligatoria. No lo es", "stamp", 2.4, text="NO LO ES", col=ROJO, rot=-5, x=1350, y=330, size=110)
B("Mi esposa dice que el cempasúchil del mercado San Juan de Dios", "flores", "el cempasúchil")
O("el cempasúchil del mercado San Juan de Dios", "mapa", 3.6, city="gdl", pins=[{"at": "San Juan de Dios", "l": "analco", "tx": "SAN JUAN DE DIOS"}], title="Guadalajara", x=1380, y=520, sc=0.7)
B("La misma flor, con menos intermediario", "veladoras", "la misma flor")
B("Usted va al mercado de flores de su colonia", "patio", "macetas de barro con cempasúchil")
B("¿cobra algo por recibir las flores que yo traigo?", "escritorio", "la pregunta en el escritorio")
O("¿cobra algo por recibir las flores que yo traigo?", "quote", 3.4, text="¿Cobra algo por recibir las flores que yo traigo?", who="la pregunta", y=820, w=1150)
B("Lo que importa es el cariño", "pluma", "PLUMA TACHA: flores")
EV("strikes", "Lo que importa es el cariño", 0.4)
B("Las flores que más me han hecho llorar", "veladora", "la veladora")
O("de una nieta, en un frasco de vidrio", "tag", 3.0, x=1250, y=380, text="UN FRASCO DE VIDRIO", sub="las de una nieta", col=CEMPA)
B("Escríbame en los comentarios: en su pueblo", "flores", "cempasúchil")
O("¿qué flor se lleva a los muertos?", "comment", 3.4, text="En su pueblo, ¿qué flor se lleva a los muertos?", x=1300, y=820)

# =====================================================================================================================
# 6 · EL TRASLADO URGENTE
# =====================================================================================================================
B("Número seis. El traslado urgente", "bk:cochera", "capítulo 6")
O("Número seis. El traslado urgente", "cap", 3.4, n="6", title="El traslado urgente")
EV("faros", "Número seis. El traslado urgente", 1.5)
B("Este es el que más me enoja", "carroza", "la carroza con los faros prendidos")
B("en el pasillo aparece un señor muy amable", "cochera", "la cochera")
O("con una tarjeta sin dirección y mucha prisa", "tag", 3.0, x=1250, y=380, text="SIN DIRECCIÓN", sub="una tarjeta y mucha prisa", col=CEMPA)
B("Ese señor no trabaja para el hospital", "bk:cochera", "para quién trabaja")
O("Trabaja para la funeraria que le paga por cada familia", "stamp", 2.8, text="COBRA POR FAMILIA", col=ROJO, rot=-4, x=960, y=520, size=90)
B("Y el traslado cuesta lo que él diga", "faros", "los faros")
B("Un traslado dentro de la ciudad tiene un precio de referencia", "bk:carroza", "el precio")
O("Un traslado dentro de la ciudad tiene un precio de referencia", "big", 3.2, text="$1.500 – 3.500", sub="traslado dentro de la ciudad", x=960, y=420, size=150)
O("Si le cobran 5.000 sin explicación", "stamp", 2.8, text="$5.000 = ALARMA", col=ROJO, rot=-4, x=960, y=760, size=90)
B("Fíjese en las palabras que usa", "carroza", "las palabras")
O("urgente, ya, ahorita", "chips", 3.0, items=["URGENTE", "YA", "AHORITA"], y=880)
B("Hay prisa, sí, pero no tanta", "veladora", "hay tiempo")
O("La ley le da de 12 a 48 horas", "tag", 3.0, x=1250, y=380, text="12 A 48 HORAS", sub="le alcanza para dos llamadas", col=CEMPA)
B("Así que usted dice esta frase", "bk:escritorio", "la frase")
O("hoy necesito el traslado y la autorización", "dicho", None, text="Hoy necesito el traslado y la autorización. El resto lo decido mañana con mi familia.", who="la frase")
B("Y pide el precio del traslado por escrito", "pluma", "PLUMA TACHA: traslado urgente")
EV("strikes", "Y pide el precio del traslado por escrito", 0.8)

# =====================================================================================================================
# 7 · LA GESTORÍA
# =====================================================================================================================
B("Número siete. Los trámites que usted puede hacer", "bk:archivero", "capítulo 7")
O("Número siete. Los trámites que usted puede hacer", "cap", 3.4, n="7", title="Los trámites", sub="que usted puede hacer")
B("En la cotización aparece un renglón que dice gestoría", "cotizacion", "el renglón gestoría")
O("o trámites de 800 a 2.000 pesos", "etiqueta", 3.4, flipAt="de 800 a 2.000 pesos", front="¿Gestoría?", back="$800–2.000", sub="trámites", x=1420, y=420, w=460)
B("Lo que hace la gestoría es hacer fila en el Registro Civil", "archivero", "los archiveros, los formatos")
B("Eso usted lo puede hacer en una mañana", "escritorio", "una mañana")
O("con el certificado de defunción que le da el médico y su identificación", "chips", 3.6, items=["CERTIFICADO DEL MÉDICO", "SU IDENTIFICACIÓN"], y=880)
B("El gasto real son las copias certificadas del acta", "cotizacion", "las copias")
O("pida varias de una vez", "chips", 3.6, items=["EL BANCO", "EL SEGURO SOCIAL", "LA AFORE"], y=880, d=1.2)
B("Si pide una sola, va a regresar tres veces", "ventana", "tres vueltas")
B("Como le digo a Lalo", "fotos", "la pared de la oficina")
O("no le cobres a la familia por hacer una fila que puede hacer ella", "dicho", None, text="No le cobres a la familia por hacer una fila que puede hacer ella.", who="lo que le digo a Lalo")
B("no le cobres a la familia por hacer una fila", "pluma", "PLUMA TACHA: gestoría")
EV("strikes", "no le cobres a la familia por hacer una fila", 1.2)
B("Y si la familia de veras no puede ir", "escritorio", "por escrito")

# =====================================================================================================================
# 8 · EL FUNERAL A FUTURO
# =====================================================================================================================
B("Número ocho. El funeral a futuro que vence", "bk:sobre", "capítulo 8")
O("Número ocho. El funeral a futuro que vence", "cap", 3.4, n="8", title="El funeral a futuro", sub="que vence, o la funeraria que cierra")
B("Esto se lo voy a decir con cuidado", "veladora", "con cuidado")
B("El problema es el plan mal hecho", "sobre", "el contrato en el sobre")
B("Vi a una familia de Analco que firmó un contrato", "cupula", "Analco")
B("Dos años después, la funeraria había cambiado de dueños", "bk:corte", "cambio de dueño")
O("la funeraria había cambiado de dueños", "refrendo", 4.0, from_=2019, years=2, venceAt="la funeraria había cambiado", title="El contrato", label="CAMBIÓ DE DUEÑOS")
B("en los comentarios de este tema leía un señor", "ventana", "los comentarios")
O("su abuelo pagó doce mil dólares hace cuarenta años", "comment", 4.0, text="Mi abuelo pagó US$12.000 hace 40 años… y la funeraria la vendieron.", x=1250, y=800)
B("Otros planes tienen un plazo", "bk:escritorio", "el plazo")
O("Se pagan por años, y si un año no se paga, el plan vence", "stamp", 2.8, text="EL PLAN VENCE", col=ROJO, rot=-4, x=960, y=520, size=100)
B("Antes de firmar un plan a futuro, una pregunta de diez segundos", "pluma", "la pluma se queda quieta")
O("¿su contrato está registrado en Profeco?", "quote", 3.6, text="¿Su contrato está registrado en Profeco? ¿Me da el número?", who="la pregunta de 10 segundos", y=820, w=1150)
B("Si le contestan con evasivas", "escritorio", "entonces no firmo hoy")
O("entonces no firmo hoy", "stamp", 2.6, text="ENTONCES NO FIRMO HOY", col=ROJO, rot=-4, x=1250, y=830, size=72)
B("Y si alguien llega al velorio con folletos de planes", "sillas", "el velorio")
B("Un plan bueno se compra con calma", "capilla", "con calma, no en la misa")
B("Escríbame una palabra: ¿en su familia alguien tiene un plan a futuro?", "ventana", "afuera")
O("¿en su familia alguien tiene un plan a futuro? Sí o no", "comment", 3.4, text="¿En su familia alguien tiene un plan a futuro? Sí o no.", x=1300, y=820)

# =====================================================================================================================
# CTA 1 · LA CARPETA DE LA FAMILIA (3D sobre el escritorio: se abre en la página 25 y vuelve al mundo)
# =====================================================================================================================
B("Antes del último, una cosa", "oficina", "vuelta al escritorio")
B("Todo esto que le estoy diciendo lo escribí completo", "carpeta", "LA CARPETA en el escritorio")
EV("book_open", "lo escribí completo, con calma, en La Carpeta", 0.6)
O("en La Carpeta de la Familia. Son cinco libros", "tag", 3.4, x=1250, y=330, text="LA CARPETA DE LA FAMILIA", sub="5 libros", col=CEMPA)
B("Ahí están las 37 decisiones del funeral", "carpeta", "las 37 decisiones", side=1)
O("Ahí están las 37 decisiones del funeral", "big", 3.0, text="37", sub="decisiones del funeral, con su precio", x=1450, y=360, size=170)
B("La frase está en la página veinticinco", "carpeta", "la página 25 abierta", side=-1)
O("La frase está en la página veinticinco", "stamp", 3.0, text="PÁGINA 25", col=CEMPA, rot=-4, x=1400, y=320, size=90)
O("El enlace está en la primera línea de la descripción", "lower", 4.0, name="LA CARPETA DE LA FAMILIA", l2="link en la 1ª línea de la descripción")
EV("book_close", "Y ahora sí, el último", 0.0)
B("Y ahora sí, el último", "oficina", "vuelve al mundo")

# =====================================================================================================================
# 9 · EL PAQUETE (EL PREMIO pagado)
# =====================================================================================================================
B("Número nueve. El paquete", "bk:cotizacion", "capítulo 9")
O("Número nueve. El paquete", "cap", 3.4, n="9", title="El paquete", sub="el renglón que le prometí")
B("Aquí está el renglón que le prometí", "cotizacion", "arriba de la hoja")
O("Es una palabra, arriba de la hoja: paquete", "stamp", 2.8, text="PAQUETE", col=ROJO, rot=-6, x=1300, y=330, size=130)
B("El paquete suena fácil", "corte", "todo incluido")
B("un ataúd de más, una carroza de más", "tag3", "un ataúd de más")
EV("tags", "un ataúd de más")
B("tres días de capilla cuando la familia sólo iba a estar una tarde", "capilla", "tres días de capilla")
B("En México, la norma de Profeco", "bk:escritorio", "la norma")
O("la norma de Profeco para servicios funerarios", "ficha", None, kicker="NORMA DE PROFECO · SERVICIOS FUNERARIOS", title="Precios y qué incluye cada servicio", sub="por escrito, antes de contratar")
B("Estados Unidos, desde 1984, la ley", "bk:cotizacion", "la lista de precios general")
O("la ley de la FTC obliga a darle la lista de precios general", "lista", 5.0, title="Lista de precios general", sub="FTC · desde 1984",
  rows=[{"tx": "Servicio básico", "v": "$"}, {"tx": "Traslado", "v": "$"}, {"tx": "Embalsamamiento", "v": "$"}, {"tx": "Ataúd", "v": "$"}, {"tx": "Cada cosa por separado", "v": "✓"}], hi=4, hiAt="con cada cosa por separado")
B("La lista es su derecho, no un favor del vendedor", "cotizacion", "su derecho")
B("Así que usted dice esta frase, la del renglón", "bk:carpeta", "LA FRASE")
O("antes de elegir paquete, quiero el precio de cada cosa por separado", "dicho", None, text="Antes de elegir paquete, quiero el precio de cada cosa por separado. Por escrito.", who="la frase del renglón")
B("Y luego hace lo que hicimos hoy", "bk:cotizacion", "la hoja completa")
O("Tacha el sellado que no necesita", "pluma", 13.0, title="COTIZACIÓN",
  rows=[{"tx": "Servicio básico", "v": "$18.500"}, {"tx": "Ataúd sencillo de madera", "v": "$9.500"},
        {"tx": "Ataúd sellado «de protección»", "v": "$11.000", "at": "Tacha el sellado"}, {"tx": "Embalsamamiento", "v": "$4.800", "at": "Tacha el embalsamamiento"},
        {"tx": "Bóveda de lujo", "v": "$14.000", "at": "Tacha la bóveda de lujo"}, {"tx": "Urna de mármol", "v": "$3.900", "at": "la urna de mármol"},
        {"tx": "Flores con moño", "v": "$6.500", "at": "las flores con moño"}, {"tx": "Traslado «urgente»", "v": "$3.000", "at": "el traslado inflado"},
        {"tx": "Gestoría", "v": "$2.000", "at": "y la gestoría"}, {"tx": "Fosa y panteón", "v": "$13.200"}],
  total={"from": "$86.400", "to": "$41.200", "at": "la baja a 41 mil"})
O("la baja a 41 mil, la mitad", "stamp", 2.8, text="LA MITAD", col=VERDE, rot=-5, x=560, y=300, size=120, d=1.2)
B("En San Antonio vi pasar eso cientos de veces", "corte", "San Antonio, cientos de veces")
B("Una señora, Mrs. Delgado", "ventana", "una sola mención: Mrs. Delgado")
O("con una cotización de once mil dólares", "tag", 3.0, x=1250, y=380, text="US$11.000", sub="Mrs. Delgado · otro día se la cuento", col=CEMPA)
B("Nomás le digo que pagó la mitad", "cotizacion", "la mitad")
B("Por eso le digo que con un solo renglón que no pague", "carpeta", "CTA 2: la Carpeta otra vez")
B("La Carpeta de la Familia ya se pagó sola", "bk:carpeta", "la balanza")
EV("book_open", "con un solo renglón que no pague", 0.4)
O("La Carpeta de la Familia ya se pagó sola", "balanza", 5.0, left="UN RENGLÓN", right="LA CARPETA", lv="$3.000+", rv="se pagó sola", tiltAt="ya se pagó sola", x=960, y=560, w=1050)
B("Cuesta menos que una corona de flores de funeraria", "bk:flores", "una corona de flores")
EV("book_close", "Y no le estoy diciendo que haga un funeral pobre", 0.0)
B("Y no le estoy diciendo que haga un funeral pobre", "bk:capilla", "un funeral suyo")
O("Le estoy diciendo que haga un funeral suyo", "stamp", 2.8, d=2.6, text="UN FUNERAL SUYO", col=CEMPA, rot=-4, x=1300, y=320, size=100)
B("Con las flores que su mamá quería", "flores", "las flores que ella quería")
B("con el café de olla de la familia", "veladoras", "el café, la familia")
B("Lo caro es lo que nadie va a recordar", "bk:boveda_lujo", "lo caro")

# =====================================================================================================================
# CIERRE · cuidar a los vivos · «Tome la pluma, sí. Pero para tachar» · gancho a fe03 · lápida
# =====================================================================================================================
B("Mi papá me enseñó que este oficio es para cuidar a los vivos", "fotos", "Don Refugio en la pared")
EV("sobre", "Mi papá me enseñó que este oficio", 1.0)
B("A los muertos ya los cuida Dios", "sobre", "el sobre amarillo se abre")
O("este oficio es para cuidar a los vivos", "quote", 3.6, text="Este oficio es para cuidar a los vivos.", who="Don Refugio Navarro", y=820, w=1100)
B("Y cuidar a los vivos también es cuidarles el dinero", "cotizacion", "la hoja tachada")
B("Así que la próxima vez que esté frente a ese escritorio", "escritorio", "el escritorio, el mismo plano del gancho")
B("Tome la pluma, sí. Pero para tachar", "pluma", "la pluma: para tachar")
O("Tome la pluma, sí. Pero para tachar", "stamp", 2.8, text="PERO PARA TACHAR", col=ROJO, rot=-5, x=1300, y=330, size=100)
B("Y ahora, una cosa que me duele más que el dinero", "exhibicion", "la sala, los ataúdes CERRADOS")
B("En el próximo video le digo cuáles son", "bk:ataud2", "gancho a fe03")
O("las nueve cosas que nunca debe poner en el ataúd de su madre", "ficha", None, kicker="PRÓXIMO VIDEO", title="9 cosas que nunca debe poner en el ataúd de su madre")
B("Suscríbase para que no se lo pierda", "bk:nicho", "el patio")
O("cómo despiden a los suyos en su pueblo", "comment", 3.4, text="¿Cómo despiden a los suyos en su pueblo?", x=1300, y=820)
B("Lo que yo le diría a mi propia madre", "lapida", "la lápida tallada: la frase")
EV("lapida", "Lo que yo le diría a mi propia madre")

# =====================================================================================================================
# ARMADO
# =====================================================================================================================
notes = []
BEATS.sort(key=lambda b: b["a"])
BEATS[0]["a"] = 0.0
segs = [{"a": b["a"], "k": "bk" if b["st"].startswith("bk:") else "w", "st": b["st"].split(":")[-1], "why": b["why"], "ph": b["ph"], **{k: b[k] for k in ("side",) if k in b}} for b in BEATS]
# el avatar pisa sus ventanas; al salir vuelve el mundo en la estación que estaba vigente (la cámara retoma desde ahí)
TRIN = ["iris", "zoom", "portal", "swipeL", "iris", "zoom", "up", "portal"]
TROUT = ["zoom", "swipeR", "iris", "down", "zoom", "fade"]
STK = [next((round(w["me"] + 0.5, 2) for w in AVW if w["ms"] - 0.3 <= x < w["me"] + 0.3), x) for x in EVS.get("strikes", [])]
for n, w in enumerate(AVW):
    ms, me = w["ms"], w["me"]
    before = [g for g in segs if g["a"] <= me]
    active = before[-1] if before else segs[0]
    segs = [g for g in segs if not (ms <= g["a"] < me)]
    segs.append({"a": round(ms, 2), "k": "av", "tr": "cut" if n == 0 else TRIN[n % len(TRIN)], "why": "avatar", "ph": ""})
    nxt = [g for g in segs if g["a"] >= me]
    sk = next((x for x in STK if me <= x <= me + 1.6), None)
    if sk is not None:  # la tacha corrida a la salida del avatar: se vuelve directo a la pluma y se queda ahí hasta que termina
        segs = [g for g in segs if not (me <= g["a"] < sk + 1.2)]
        segs.append({"a": round(me, 2), "k": "w", "st": "pluma", "why": "vuelta a la pluma: la tacha", "ph": ""})
    elif not nxt or nxt[0]["a"] - me > 0.8:
        r = {k: v for k, v in active.items() if k != "tr"}; r["a"] = round(me, 2); r["why"] = "vuelta al mundo: " + active.get("why", "")
        segs.append(r)
    segs.sort(key=lambda g: g["a"])
# transiciones: avatar→mundo con 2D (el mundo arranca en su estación), mundo→mundo = VUELO (sin corte), mundo→avatar con 2D
for i, g in enumerate(segs):
    if g["k"] == "av": continue
    p = segs[i - 1] if i else None
    if p is None: g["tr"] = "cut"; continue
    if p["k"] == "av": g["tr"] = TROUT[i % len(TROUT)]; g["fly"] = 0
    else: g["tr"] = "fade" if (p["k"] == "bk") != (g["k"] == "bk") else "cut"; g["fly"] = 1
# planos de mundo muy cortos (<1,2 s) se funden con el siguiente (la cámara no llega)
out = []
for g in segs:
    if out and g["a"] - out[-1]["a"] < 1.2 and out[-1]["k"] != "av" and g["k"] != "av" and len(out) > 1:
        out[-1] = {**g, "a": out[-1]["a"], "tr": out[-1].get("tr", "cut"), "fly": out[-1].get("fly", 0)}; continue
    out.append(g)
segs = out
# un plano de mundo largo (> 7 s) se parte con una segunda mirada desde la misma estación (empuje del otro lado)
add = []
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    if g["k"] in ("w",) and b - g["a"] > 7.0:
        add.append({**g, "a": round(g["a"] + (b - g["a"]) / 2, 2), "side": -(g.get("side") or 1), "tr": "cut", "fly": 1, "why": "segunda mirada"})
segs = sorted(segs + add, key=lambda g: g["a"])

# ---------------- eventos del mundo ----------------
# una tacha que cae dentro de una ventana del avatar pasa al salir (la cámara vuelve a la pluma)
EVS["strikes"] = [next((round(w["me"] + 0.5, 2) for w in AVW if w["ms"] - 0.3 <= x < w["me"] + 0.3), x) for x in EVS.get("strikes", [])]
ev = {"strikes": EVS.get("strikes", []), "tags": (EVS.get("tags", []) + [9999] * 3)[:3],
      "book": [[a, b] for a, b in zip(EVS.get("book_open", []), EVS.get("book_close", []))],
      "sobre": (EVS.get("sobre") or [9999])[0], "faros": (EVS.get("faros") or [9999])[0], "lapida": (EVS.get("lapida") or [9999])[0]}
if len(ev["strikes"]) != 7: notes.append(f"⚠ tachas = {len(ev['strikes'])} (deberían ser 7)")
# las tachas tienen que pasar con la cámara mirando la hoja: si el plano de esa tacha no es pluma/cotizacion, se avisa
for s_ in ev["strikes"]:
    g = [x for x in segs if x["a"] <= s_ + 0.05][-1]
    if g["k"] == "av" or g.get("st") not in ("pluma", "cotizacion"): notes.append(f"⚠ tacha @{s_} cae en {g['k']}:{g.get('st')}")

# ---------------- cámara: un tramo por plano de mundo ----------------
cams = []
for i, g in enumerate(segs):
    if g["k"] == "av": continue
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    cams.append({"a": g["a"], "b": round(b, 2), "st": g["st"], "fly": g.get("fly", 0), "side": g.get("side", [0.6, -0.6, 0.3, -0.3][i % 4]), "push": 0.12})

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
    for kk in ("venceAt", "flipAt", "hiAt", "tiltAt", "openAt"):
        if isinstance(o.get(kk), str):
            v = T(o[kk], o["a"])
            if v is None: notes.append(f"ancla interna sin encontrar: {o['k']} {kk} {o[kk]}"); v = o["a"] + 1.0
            o[kk] = v
    if "from_" in o: o["from"] = o.pop("from_")
    ov.append(o)
# las piezas no van encima del avatar: se corren a la salida de la ventana (≤7 s) o antes; si no, salen
nv = []
for o in sorted(ov, key=lambda o: o["a"]):
    a, b = o["a"], o["b"]
    for _ in range(3):
        w = next((w for w in AVW if a < w["me"] and b > w["ms"]), None)
        if not w: break
        if w["ms"] - a >= 2.2: b = w["ms"]; break
        L = b - a
        if w["me"] - o["a"] <= 7.0: a = w["me"] + 0.15; b = a + L; continue
        pw = max((x["me"] for x in AVW if x["me"] <= w["ms"]), default=0)
        a2 = max(w["ms"] - 0.15 - L, pw + 0.15)
        if w["ms"] - 0.15 - a2 >= min(L, 2.2) and o["a"] - a2 <= 6.0: a, b = a2, w["ms"] - 0.15; break
        a = None; break
    if a is None or next((w for w in AVW if a < w["me"] and b > w["ms"]), None):
        notes.append(f"pieza {o['k']} @{o['a']} quedó bajo el avatar → sale"); continue
    x = dict(o); sh = round(a - o["a"], 2); x["a"], x["b"], x["a0"] = round(a, 2), round(b, 2), o["a"]
    if sh:
        for lk in ("items", "rows", "pins"):
            if lk in x and x[lk] and isinstance(x[lk][0], dict): x[lk] = [{**it, **({"at": round(it["at"] + sh, 2)} if isinstance(it.get("at"), (int, float)) else {})} for it in x[lk]]
        for dk in ("route", "total", "sello"):
            if dk in x: x[dk] = {**x[dk], "at": round(x[dk]["at"] + sh, 2)}
        for kk in ("venceAt", "flipAt", "hiAt", "tiltAt", "openAt"):
            if kk in x: x[kk] = round(x[kk] + sh, 2)
    nv.append(x)
ov = sorted(nv, key=lambda o: (o["a"], o["k"] != "cap"))
# una pieza por vez (rótulo de nombre/lugar/tag conviven): la que entra corta a la anterior
SOLAS = ("lower", "lugar", "tag")
CHICAS = {"stamp": (960, 540), "big": (960, 520), "comment": (1300, 800), "chips": (960, 880)}
def choca(o, p):
    if o["k"] not in CHICAS or p["k"] not in CHICAS: return True
    (ox, oy), (px, py) = [(z.get("x", CHICAS[z["k"]][0]), z.get("y", CHICAS[z["k"]][1])) for z in (o, p)]
    return abs(oy - py) < 300 and abs(ox - px) < 800
for i, o in enumerate(ov):
    if o["k"] in SOLAS: continue
    for p in ov[:i]:
        if p["k"] in SOLAS or p["b"] <= o["a"]: continue
        if not choca(o, p): continue
        keep = 3.0 if p["k"] == "cap" else 1.4
        if o["a"] - p["a"] < keep: o["a"] = round(min(p["b"], p["a"] + keep) + 0.05, 2)
        p["b"] = round(min(p["b"], o["a"] - 0.05), 2)
ov = [o for o in ov if o["b"] - o["a"] >= 1.0 or notes.append(f"pieza {o['k']} @{o['a']} quedó <1 s al encimarse → sale")]
# lo de adentro (renglones, total, vuelta de etiqueta) tiene que pasar mientras se ve
for o in ov:
    refs = []
    for lk in ("rows", "items", "pins"):
        for it in (o.get(lk) or []):
            if isinstance(it, dict) and isinstance(it.get("at"), (int, float)) and it["at"] > 10: refs.append((it, "at"))
    for dk in ("route", "total", "sello"):
        if isinstance(o.get(dk), dict) and isinstance(o[dk].get("at"), (int, float)): refs.append((o[dk], "at"))
    for kk in ("venceAt", "flipAt", "hiAt", "tiltAt", "openAt"):
        if isinstance(o.get(kk), (int, float)): refs.append((o, kk))
    if not refs: continue
    ts = [d[kk] for d, kk in refs]; lo, hi = o["a"] + 0.5, o["b"] - 1.0
    if max(ts) <= hi and min(ts) >= o["a"]: continue
    t0, t1 = min(ts), max(ts)
    for d, kk in refs: d[kk] = round(lo + (d[kk] - t0) * (hi - lo) / (t1 - t0), 2) if t1 > t0 else round(lo, 2)
    notes.append(f"adentro apretado: {o['k']} @{o['a']}")

# ---------------- salida ----------------
def clip_len(p):
    return float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode())
reel = os.path.exists(PUB + f"av/{SL}/reel0.mp4")
rl = clip_len(PUB + f"av/{SL}/reel0.mp4") if reel else 0
json.dump([{k: v for k, v in g.items() if k not in ("why", "ph")} for g in segs], open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(cams, open(S + "cams.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
json.dump({"reel": reel, "reelLen": round(rl, 3), "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": "img" if g["k"] != "av" else "av", "src": None} for i, g in enumerate(segs)]
json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))

def mmss(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"
lines = [f"# {SL} · PLAN MxM (plan_fe02.py, frase por frase) · END {mmss(END)}", "mm:ss-mm:ss · frase · plano · piezas", ""]
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    pz = [o["k"] for o in ov if g["a"] - 0.2 <= o["a"] < b]
    lines.append(f"{mmss(g['a'])}-{mmss(b)} · {g.get('ph', '')[:48]} · {g['k']}:{g.get('st', '')} ({g.get('why', '')}) · {', '.join(pz) or '—'}")
open(f"D:/rtmp/{SL}_PLAN_MxM.md", "w", encoding="utf8").write("\n".join(lines))
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "w", "bk")}
print(f"END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · {tot} · av {100*tot['av']/END:.0f}% · piezas {len(ov)} · beats {len(BEATS)}")
print("ev:", json.dumps(ev))
print("SIN ANCLAR:", miss if miss else "ninguna")
for n in notes: print("  ", n)
