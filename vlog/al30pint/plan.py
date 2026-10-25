# al30pint · plan del video ENTERO anclado a la voz. Cada plano, pieza y evento del mundo 3D se ancla a la frase que
# se dice en ese segundo (at() sobre words.json) → segs.json, ov.json, cam.json, ev.json, avail.json en src/al30pint.
# Las ventanas del avatar las manda avwin.json (av_temprano): ahí la base es el avatar, y al salir se vuelve al mundo.
import json, os, re, subprocess, unicodedata, sys

R = "D:/wt/al30pint/"
S = R + "src/al30pint/"
PUB = R + "public/al30pint/"
W = json.load(open(S + "words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
WAV = R + "public/al30pintcut.wav"

def norm(x):
    x = unicodedata.normalize("NFD", x.lower())
    return re.sub(r"[^a-z0-9ñ]", "", "".join(c for c in x if unicodedata.category(c) != "Mn"))
TOK = [norm(w) for _, w in W]
TS = [float(s) for s, _ in W]
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
    need = max(2, int(0.75 * len(q) + 0.5))
    for lo, hi in ((cur, min(len(TOK), cur + 700)), (0, len(TOK))):
        for i in range(lo, hi):
            if TOK[i] == q[0] or (len(q) > 1 and TOK[i] == q[1]) or score(i) >= need:
                if score(i) >= need:
                    if lo == cur: cur = i
                    return round(TS[i] + d, 2)
    miss.append(ph)
    return None

END = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", WAV]).decode()) + 1.0

# ---------------- vistas del mundo (la pared de Doña Rosa: adentro la sala, afuera el patio y la jardinera) ----------------
V = {
    "wide": ([0.2, 1.45, -3.4], [0, 0.7, 0], 40), "wall": ([0, 0.75, -1.7], [0, 0.6, -0.15], 38),
    "base": ([0.3, 0.35, -1.05], [0.2, 0.2, -0.15], 34), "foil": ([0.9, 0.5, -0.85], [0.95, 0.45, -0.15], 30),
    "test": ([-1.3, 1.1, -0.85], [-1.35, 1.05, -0.15], 30), "pick": ([-0.6, 0.7, -1.4], [-0.6, 0.5, -0.15], 36),
    "cut": ([-3.6, 0.9, 0.2], [-2, 0.2, 0.1], 36), "under": ([-3.2, 0.1, 0.4], [-2, -0.4, 0.1], 36),
    "out": ([0.4, 1.5, 3.6], [0, 0.3, 0.4], 40), "soil": ([0.6, 0.75, 1.9], [0, 0.15, 0.5], 34),
    "spout": ([2.2, 0.9, 1.6], [1.25, 0.3, 0.4], 34), "patio": ([1.5, 1.8, 4.2], [0, 0, 1.6], 42),
    "book": ([1.55, 1.22, -1.32], [1.55, 0.74, -1.75], 30), "xray": ([-0.4, 0.8, -1.9], [-0.2, 0.45, 0], 38),
}
PTV = {"wall": "wall", "base": "base", "foil": "foil", "test": "test", "pick": "pick", "cut": "cut", "under": "found",
       "out": "wall", "soil": "soil", "spout": "spout", "patio": "slope", "book": "book", "xray": "stain"}

BEATS, OVS, EVR, WET, SOIL, PAGES, MARKS = [], [], {}, [], [], [], []
def B(ph, base, tr=None, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: BEATS.append(dict(a=a, base=base, tr=tr, **kw))
def O(ph, k, dur, d=0.0, **kw):
    a = at(ph, d)
    if a is not None: OVS.append(dict(k=k, a=a, b=round(a + dur, 2), **kw))
def EV(key, ph, dur, d=0.0):
    a = at(ph, d)
    if a is not None: EVR.setdefault(key, []).append([a, round(a + dur, 2)])
def KF(lst, ph, v, d=0.0):
    a = at(ph, d)
    if a is not None: lst.append([a, v])
def PG(ph, pg, dur):
    a = at(ph)
    if a is not None: PAGES.append(dict(a=a, b=round(a + dur, 2), pg=pg))
def MK(ph, dur, box, col="#ffd60a"):
    a = at(ph)
    if a is not None: MARKS.append(dict(at=a, out=round(a + dur, 2), box=box, col=col))
def ON(key, ph, ph2):
    """evento desde una frase hasta otra (tramos largos del mundo)"""
    global cur
    a = at(ph); c0 = cur; b = at(ph2); cur = c0  # el fin no mueve el cursor
    if a is not None and b is not None and b > a: EVR.setdefault(key, []).append([a, b])

WET.append([0, 0.6]); SOIL.append([0, 0.3])
# ======================= GANCHO =======================
B("Usted está ahí, con el rodillo en la mano", "img:h_rodillo", "fade")
B("Tiene una mancha oscura abajo", "w:base", "portal")
EV("blister", "Tiene una mancha oscura abajo", 60); EV("salt", "Tiene una mancha oscura abajo", 60)
O("unas burbujitas en la pintura, como ampollas", "tag", 3.5, pt="blister", text="AMPOLLAS", col="#ff4a3d")
B("le doy dos manos de pintura buena", "img:h_lata_cara")
O("No. No la pinte todavía", "stamp", 2.6, text="NO LA PINTE", col="#ff4a3d", rot=-8)
B("en tres meses esa pared se le llena de ampollas", "w:wall", "portal")
EV("peel", "la pintura se le cae en tiras", 6)
B("Y usted va a pensar que la pintura era mala", "img:h_tira_pintura")
O("No era la pintura", "big", 3.0, text="NO ERA LA PINTURA", size=110)
B("la prueba de 48 horas", "w:foil", "zoom")
EV("foil", "la prueba de 48 horas", 4)
O("la prueba de 48 horas", "big", 3.0, text="48 HORAS", sub="de dónde viene el agua")
B("los cinco errores que hace casi todo el mundo", "img:h_errores")
B("la forma de pintar esa pared para que la pintura dure años", "img:h_pared_blanca")
B("Y el último paso, el que guardo para el final", "w:test", "portal")
EV("test", "Y el último paso, el que guardo para el final", 6)
O("Cuesta menos de un dólar", "big", 3.0, text="< $1", sub="y le dice si la pared está lista")
# ======================= PRESENTACION =======================
O("Soy Claudio. Treinta años de albañil", "lower", 5.0, name="CLAUDIO", l2="Albañil · 30 años de oficio")
B("cargando bolsas de cemento para un maestro", "img:p_bolsas", "fade")
B("un hombre callado que hablaba poco y miraba mucho", "img:p_ramiro")
B("Me enseñó a mirar una pared antes de tocarla", "img:p_mira_pared")
O("la pared siempre te cuenta lo que le pasa", "big", 4.5, text="«La pared siempre te cuenta lo que le pasa»", size=64)
B("He visto cientos de paredes pintadas tres", "img:p_cientos")
B("Fue culpa de pintar antes de tiempo", "w:wide", "zoom")
# ======================= CTA1 =======================
B("me senté y escribí todo lo que sé en un manual", "img:c_escribe", "fade")
B("Se llama el Manual del Albañil", "w:book", "portal")
PG("Se llama el Manual del Albañil", "al001", 30)
O("Son 66 arreglos de la casa", "chips", 5.0, items=["66 ARREGLOS", "LISTA DE FERRETERÍA", "MEDIDAS Y PASOS"])
O("una sola visita del pintor", "price", 6.5, gAt=None)
B("está en la página once", "w:book", "cut")
PG("está en la página once", "al011", 20)
MK("con todo lo que le digo en este video", 7, [0.07, 0.43, 0.93, 0.53])
O("o escanee este código con la cámara", "qr", 9.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="Página 11 · la pared húmeda")
B("Ahora sí, vamos a la pared", "w:wide", "swipeR")
# ======================= LA CASA =======================
B("Hace unos meses me llamó una señora", "img:r_telefono", "fade")
B("vive sola en una casa de esas viejas", "img:r_casa")
B("una jardinera pegada a la pared del frente", "w:out", "portal")
O("una jardinera pegada a la pared del frente", "tag", 4.0, pt="soil", text="LA JARDINERA", col="#ffb257")
B("Fui un jueves por la mañana", "img:r_llega")
B("La pared del frente, la que da al patio", "w:wall", "portal")
O("Desde el piso hasta un poco más arriba de la rodilla", "tag", 4.0, pt="stain", text="HASTA LA RODILLA", col="#ff4a3d")
B("Ampollas grandes, del tamaño de una moneda", "w:base", "cut")
B("con un polvito blanco saliendo por las grietas", "img:r_polvito")
O("con un polvito blanco saliendo por las grietas", "tag", 3.5, pt="salt", text="SALITRE", col="#e9e3d0")
B("Como si la pared tuviera dos mitades", "w:wall", "zoom")
# ======================= LA HISTORIA =======================
B("Doña Rosa me contó todo", "img:r_rosa_cuenta", "fade")
B("La primera vez la pintó su sobrino", "img:r_sobrino")
O("La primera vez la pintó su sobrino", "receipt", 46.0, title="LA MISMA PARED", rows=[
    {"at": "La primera vez la pintó su sobrino", "item": "1ª pintada", "$": 35},
    {"at": "caras. 140 dólares", "item": "2ª · el pintor", "$": 140},
    {"at": "otros 160 dólares", "item": "3ª · impermeable", "$": 160}], totalAt="Más de trescientos dólares en la misma pared")
B("La segunda vez llamó a un pintor del barrio", "img:r_pintor")
B("raspó lo flojo, pasó enduido", "img:r_enduido")
B("esta vez le dijo que había que usar pintura impermeable", "img:r_lata_imper")
B("Y a los dos meses, peor que nunca", "w:base", "portal")
B("sentada en su sillón mirando esas ampollas", "img:r_sillon")
# ======================= EL PORQUE =======================
B("no fue mala suerte, y el pintor tampoco era malo", "w:wall", "fade")
B("Una ampolla en la pintura no es un defecto", "w:xray", "iris")
ON("xray", "Una ampolla en la pintura no es un defecto", "Le cerró la última salida")
O("Es un aviso", "big", 3.0, text="ES UN AVISO", size=120)
O("Es agua empujando desde adentro", "tag", 4.0, pt="blister", text="AGUA EMPUJANDO", col="#8fd6ff")
B("Entonces empuja, despega la pintura del revoque", "w:base", "cut")
B("Por eso la pintura impermeable del pintor fue la peor", "img:r_lata_imper2")
O("Le cerró la última salida", "stamp", 3.0, text="SIN SALIDA", col="#ff4a3d")
# ======================= LA REGLA =======================
B("Así que la regla de hoy es ésta", "bk", "zoom")
O("una pared húmeda no se pinta, se seca", "big", 5.0, text="NO SE PINTA: SE SECA", size=100)
O("Primero se encuentra de dónde viene el agua", "chips", 8.0, items=["1 · ENCONTRAR EL AGUA", "2 · CORTARLA", "3 · SECAR", "4 · RECIÉN PINTAR"])
B("Si usted cambia el orden", "img:g_orden")
B("sin aparatos caros y sin llamar a nadie", "img:g_sin_aparatos")
B("hay tres lugares de donde puede venir", "w:wide", "zoom")
# ======================= TRES AGUAS =======================
B("El primero es el aire de la casa", "img:t_vapor", "fade")
O("El primero es el aire de la casa", "step", 4.0, n="1", tx="EL AIRE · CONDENSACIÓN")
B("como en un vaso de agua helada", "img:t_vaso")
B("El segundo es la lluvia", "w:spout", "portal")
EV("rain", "El segundo es la lluvia", 7)
O("El segundo es la lluvia", "step", 4.0, n="2", tx="LA LLUVIA")
B("Y el tercero es el suelo", "w:cut", "portal")
O("Y el tercero es el suelo", "step", 4.0, n="3", tx="EL SUELO · CAPILARIDAD")
EV("xray", "El agua de la tierra sube por adentro del ladrillo", 12)
B("como sube el café por un terrón de azúcar", "img:t_terron")
B("las tres manchas se parecen", "w:wall", "cut")
B("El pintor de Doña Rosa nunca se preguntó", "img:t_pintor_pinta")
# ======================= LEER MANCHA =======================
B("Antes de la prueba, mire la mancha", "img:l_mira", "fade")
O("Si la mancha empieza en el zócalo", "diag", 34.0, items=[
    {"at": "Si la mancha empieza en el zócalo", "sw": "ABAJO + OLA + SAL", "tx": "del zócalo hasta ~1 m", "res": "SUBE DEL SUELO", "ok": False},
    {"at": "Si la mancha está arriba, en las esquinas", "sw": "ESQUINAS + PUNTOS NEGROS", "tx": "techo, muebles, ventana", "res": "CONDENSACIÓN", "ok": True},
    {"at": "Y si es una mancha redonda o un chorrito", "sw": "REDONDA / CHORRITO", "tx": "más después de llover", "res": "LLUVIA QUE ENTRA", "ok": False}])
B("con un borde parejo como una ola", "w:base", "portal")
B("con puntitos negros", "img:l_moho_esquina")
B("o aparece más después de que llueve", "img:l_chorrito")
B("La pared de Doña Rosa era de manual", "w:wall", "zoom")
B("Pero yo no me fío sólo de los ojos", "img:l_ojos")
# ======================= PRUEBA ALUMINIO =======================
B("se la enseño a todo el que me pregunta", "img:a_rollo", "fade")
B("Corte un cuadrado de papel aluminio", "img:a_corta")
O("Corte un cuadrado de papel aluminio", "step", 4.0, n="1", tx="ALUMINIO 30 × 30 cm")
B("Péguelo sobre la mancha, bien plano", "w:foil", "portal")
ON("foil", "Péguelo sobre la mancha, bien plano", "Agua de adentro")
O("con cinta de embalar por los cuatro lados", "step", 4.0, n="2", tx="CINTA EN LOS 4 LADOS")
B("que no entre aire por ningún borde", "img:a_cinta")
O("no lo toque por 48 horas", "timer", 5.0, label="48 H", sub="sin tocarlo")
B("Después lo despega con cuidado y mira", "img:a_despega")
O("Si las gotitas están del lado de afuera", "chips", 9.0, items=["GOTAS AFUERA → EL AIRE", "GOTAS ADENTRO → LA PARED"])
B("el que tocaba la pared, el agua viene de la pared", "w:foil", "cut")
EV("foilwet", "En la casa de Doña Rosa, el aluminio salió mojado", 8)
B("con la pared oscura debajo", "img:a_mojado")
# ======================= ERROR UNO =======================
B("el primer error de los cinco", "bk", "fade")
O("el primer error de los cinco", "err", 5.0, n=1, tx="IMPERMEABLE POR ADENTRO")
B("Si hay agua, pongo algo que no deje pasar el agua", "img:e1_lata")
B("El agua viene desde el ladrillo, desde atrás", "w:xray", "iris")
EV("xray", "El agua viene desde el ladrillo, desde atrás", 12); EV("blister", "El agua viene desde el ladrillo, desde atrás", 14)
O("sólo le impide salir", "tag", 3.5, pt="blister", text="NO LA DEJA SALIR", col="#ff4a3d")
B("Lo mismo pasa con el esmalte sintético", "img:e1_esmalte")
B("se pinta con pintura que respire", "img:e1_respira")
# ======================= ERROR DOS =======================
B("El segundo error es pintar cuando la pared está seca al tacto", "img:e2_mano", "fade")
O("El segundo error es pintar cuando la pared está seca al tacto", "err", 5.0, n=2, tx="SECA AL TACTO NO ES SECA")
B("una pared de ladrillo de veinte o treinta centímetros", "w:cut", "portal")
O("La superficie se seca en dos días", "chips", 5.5, items=["AFUERA: 2 DÍAS", "EL CENTRO: SEMANAS"])
B("esa agua que estaba esperando adentro sale para afuera", "w:base", "cut")
B("La regla que me enseñó Don Ramiro", "img:e2_ventana")
O("como mínimo tres semanas, y mejor cuatro", "weeks", 6.0, per=1.2, max=4)
# ======================= ERROR TRES =======================
B("El tercer error es lavar el salitre", "w:base", "fade")
O("El tercer error es lavar el salitre", "err", 5.0, n=3, tx="LAVAR EL SALITRE")
B("como queda la sal en una olla", "img:e3_olla")
B("lo lava con agua y un trapo", "img:e3_trapo")
B("a los pocos días sale otra vez, más blanca", "w:base", "portal")
B("El salitre se saca siempre en seco", "img:e3_cepillo")
EV("brush", "El salitre se saca siempre en seco", 6)
O("Nunca con agua, nunca con trapo húmedo", "chips", 5.0, items=["✗ AGUA", "✗ TRAPO HÚMEDO", "✗ VINAGRE", "✓ CEPILLO EN SECO"])
# ======================= ERROR CUATRO =======================
B("El cuarto error es tapar con enduido", "img:e4_enduido", "fade")
O("El cuarto error es tapar con enduido", "err", 5.0, n=4, tx="TAPAR CON ENDUIDO")
B("Quedó preciosa. Una semana", "img:e4_lisa")
B("son como una esponja", "img:e4_esponja")
B("es como poner papel sobre un charco", "w:base", "portal")
B("viene con una pasta blanda adentro", "img:e4_pasta")
B("Es un revoque nuevo con hidrófugo", "img:e4_hidrofugo")
# ======================= REGANCHO 1 =======================
B("antes del quinto error, le quiero decir algo", "w:wide", "fade")
B("Estaba afuera, en el patio, a un metro de la pared", "w:out", "portal")
B("que ella veía todos los días", "img:g1_patio")
B("la mitad del problema se arregló sola", "w:out", "zoom")
# ======================= ERROR CINCO =======================
B("El quinto error es pintar toda la pared", "img:e5_sala", "fade")
O("El quinto error es pintar toda la pared", "err", 5.0, n=5, tx="PINTAR TODA LA PARED")
O("Y gasta veinte litros de pintura", "big", 3.0, text="20 LITROS", sub="para un metro enfermo")
B("Primero arregla sólo la parte enferma", "w:wall", "portal")
O("más treinta centímetros por arriba", "tag", 4.0, pt="pick", text="+30 cm", col="#ffd60a")
B("Espera a que se seque", "img:e5_espera")
B("falla en un pedacito, no en toda la habitación", "w:wall", "cut")
# ======================= LO DE AFUERA =======================
B("Salí al patio, me paré frente a esa pared", "img:f_patio", "fade")
B("La jardinera. Una jardinera de ladrillo", "w:soil", "portal")
O("La jardinera. Una jardinera de ladrillo", "tag", 4.0, pt="soil", text="LA JARDINERA", col="#ffb257")
B("la tierra de la jardinera estaba más alta que el piso", "w:cut", "portal")
O("Unos treinta centímetros más alta", "big", 3.4, text="+30 cm", sub="la tierra, más alta que el piso de adentro")
B("cada vez que Doña Rosa regaba sus plantas", "img:f_riega")
B("la pared chupaba esa agua como una mecha", "w:cut", "iris")
EV("xray", "la pared chupaba esa agua como una mecha", 10)
B("Veinte años regando las plantas", "img:f_rosa_plantas")
B("qué hay del otro lado de esa pared", "w:out", "zoom")
# ======================= REVISAR AFUERA =======================
B("aquí va la lista de lo que tiene que mirar afuera", "bk", "fade")
O("aquí va la lista de lo que tiene que mirar afuera", "routine", 46.0, hl=None, rows=[
    {"at": "Uno: si hay tierra, una jardinera", "when": "1", "what": "Tierra apoyada, más alta que el piso", "ic": "🪴"},
    {"at": "Dos: si la canaleta del techo descarga", "when": "2", "what": "Canaleta que descarga al pie", "ic": "🌧️"},
    {"at": "Tres: si el patio o la acera tienen la pendiente", "when": "3", "what": "Patio con pendiente hacia la casa", "ic": "📐"},
    {"at": "Cuatro: si hay una manguera", "when": "4", "what": "Manguera, llave o desagüe que gotea", "ic": "🚰"},
    {"at": "Cinco: si hay pasto o enredaderas", "when": "5", "what": "Enredaderas: sombra y humedad", "ic": "🌿"}])
B("Dos: si la canaleta del techo descarga", "w:spout", "portal")
EV("rain", "Dos: si la canaleta del techo descarga", 6)
B("Tres: si el patio o la acera tienen la pendiente", "w:patio", "cut")
EV("slope", "Tres: si el patio o la acera tienen la pendiente", 7)
B("Cuatro: si hay una manguera", "img:v_manguera")
B("Cinco: si hay pasto o enredaderas", "img:v_enredadera")
B("usted puede pintar mil veces adentro", "w:wall", "zoom")
# ======================= ARREGLO AFUERA =======================
B("En la casa de Doña Rosa hicimos esto", "img:x_pala", "fade")
B("Bajamos la tierra de la jardinera", "w:soil", "portal")
KF(SOIL, "Bajamos la tierra de la jardinera", 0.3); KF(SOIL, "hasta quince centímetros por debajo", -0.15)
O("hasta quince centímetros por debajo", "big", 3.2, text="−15 cm", sub="debajo del piso de adentro")
B("pusimos una franja de piedra partida", "img:x_piedra")
EV("gravel", "pusimos una franja de piedra partida", 9999)
B("para que el agua del riego baje rápido", "w:soil", "cut")
B("Y las plantas las corrimos un poquito", "img:x_plantas")
O("una bolsa de piedra de cinco dólares", "chips", 5.0, items=["1 SÁBADO", "PIEDRA $5", "LA PALA QUE YA TENÍA"])
B("a las tres semanas la mancha ya había bajado", "w:wall", "portal")
KF(WET, "a las tres semanas la mancha ya había bajado", 0.6); KF(WET, "bajado 10 centímetros", 0.5)
O("bajado 10 centímetros", "big", 3.0, text="−10 cm", sub="la mancha, en 3 semanas")
B("Es lo más barato de todo", "img:x_rosa_feliz")
# ======================= LA RUTINA =======================
B("le voy a dar la rutina completa", "bk", "fade")
O("Paso uno: el aluminio", "recap", 62.0, rows=[
    {"at": "Paso uno: el aluminio", "tx": "1 · Aluminio 48 h"},
    {"at": "Paso dos: si viene de afuera", "tx": "2 · Cortar el agua afuera"},
    {"at": "Paso tres: saco el salitre en seco", "tx": "3 · Salitre en seco"},
    {"at": "Paso cuatro: golpeo el revoque", "tx": "4 · Picar lo hueco +30 cm"},
    {"at": "Paso cinco: dejo el ladrillo al aire", "tx": "5 · Ladrillo al aire 1 semana"},
    {"at": "revoco con hidrófugo", "tx": "6 · Revoque con hidrófugo"},
    {"at": "Paso siete: espero tres o cuatro semanas", "tx": "7 · Esperar 3-4 semanas"},
    {"at": "Y paso ocho, recién ahí", "tx": "8 · Fijador + pintura que respire"}])
B("Paso cuatro: golpeo el revoque", "w:pick", "portal")
B("Ocho pasos. El pintor hizo sólo el último", "img:u_pintor_ultimo")
# ======================= FERRETERIA =======================
B("para que no le vendan cosas que no necesita", "img:k_ferreteria", "fade")
O("necesito una bolsa de cemento", "kit", 22.0, items=[
    {"at": "necesito una bolsa de cemento", "ic": "🧱", "tx": "1 bolsa de cemento"},
    {"at": "arena fina", "ic": "⏳", "tx": "arena fina"},
    {"at": "un litro de hidrófugo para mortero", "ic": "🧴", "tx": "1 L hidrófugo"},
    {"at": "un cepillo de alambre", "ic": "🪥", "tx": "cepillo de alambre"},
    {"at": "un litro de fijador sellador al agua", "ic": "🥛", "tx": "1 L fijador al agua"},
    {"at": "pintura al agua para frentes, mate", "ic": "🪣", "tx": "pintura al agua, mate"},
    {"at": "pintura impermeable para adentro", "ic": "🚫", "tx": "impermeable adentro", "no": True}])
B("Si el vendedor le ofrece pintura impermeable", "img:k_vendedor")
B("un rollo de papel aluminio, cinta de embalar", "img:k_cocina")
B("Herramientas: un martillo", "img:k_herramientas")
O("no gasta más de cuarenta dólares en total", "big", 3.5, text="< $40", sub="un metro de pared")
# ======================= PICAR =======================
B("Le explico bien lo de picar", "w:pick", "fade")
B("Usted agarra un martillo y lo da vuelta", "img:k_mango")
B("Donde la pared está sana, suena seco", "img:k_golpea")
O("Donde el revoque está flojo, suena hueco", "chips", 5.0, items=["SECO = SANO", "HUECO = SE PICA"])
B("Con una tiza marca todo lo que suena hueco", "img:k_tiza")
B("saca ese revoque hasta que aparece el ladrillo", "w:pick", "portal")
ON("pick", "saca ese revoque hasta que aparece el ladrillo", "Ya tiene el revoque nuevo")
O("sigue treinta centímetros más arriba", "tag", 4.0, pt="pick", text="+30 cm DE LA MANCHA", col="#ffd60a")
B("Use mascarilla y anteojos", "img:k_mascarilla")
# ======================= REVOQUE =======================
B("Para el revoque nuevo, la mezcla es simple", "img:m_baldes", "fade")
O("Un balde de cemento y tres baldes de arena fina", "big", 3.5, text="1 : 3", sub="cemento : arena fina")
B("El hidrófugo viene líquido, en botella", "img:m_hidro_agua")
O("va en el agua con la que usted moja la mezcla", "tag", 4.0, pt="pick", text="EL HIDRÓFUGO VA EN EL AGUA", col="#8fd6ff")
B("Se aplica en dos capas", "w:pick", "portal")
EV("render1", "La primera capa se tira fuerte", 9999); EV("render2", "La segunda se pone encima", 9999)
B("La primera capa se tira fuerte con la cuchara", "img:m_salpica")
B("se alisa con la llana de madera", "img:m_fratacho")
B("moje apenas el ladrillo con un pincel", "img:m_pincel")
# ======================= CTA2 =======================
B("Y aquí le quiero mostrar algo", "w:book", "fade")
PG("Y aquí le quiero mostrar algo", "al011", 40)
MK("Con una caja negra que dice exactamente", 9, [0.07, 0.54, 0.93, 0.585])
MK("Son 66 arreglos así", 7, [0.07, 0.68, 0.93, 0.82], "#3fd17a")
B("Paredes, techos, pisos, azulejos", "img:g2_manual")
O("Cada uno con materiales de uno o dos dólares", "price", 6.5, gAt=None)
O("o escanee este código con la cámara del teléfono. Y sigamos", "qr", 9.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="Página 11 · la pared húmeda")
B("Y sigamos, porque ahora viene cuánto esperar", "w:book", "cut")
# ======================= CUANTO ESPERAR =======================
B("Ya tiene el revoque nuevo", "w:wall", "fade")
B("El revoque nuevo tiene mucha agua adentro", "w:cut", "portal")
O("mínimo tres semanas, y mejor cuatro", "weeks", 6.0, per=1.2, max=4)
O("En invierno, o en un lugar sin sol, cinco", "big", 3.0, text="5", sub="semanas en invierno", x=1450, y=300, size=170)
B("deje la ventana abierta todo lo que pueda", "img:w_ventana")
O("no apoye muebles contra esa pared", "chips", 6.0, items=["VENTANA ABIERTA", "✗ MUEBLES", "✗ CUADROS", "✗ CORTINAS"])
B("La pared tiene que respirar por los dos lados", "w:wall", "zoom")
B("Si a las dos semanas aparece una mancha oscura", "img:w_mancha_nueva")
# ======================= PRUEBA SECO =======================
B("le prometí una prueba de un dólar", "img:s_bolsa", "fade")
B("péguela sobre el revoque nuevo con cinta", "w:foil", "portal")
ON("bag", "péguela sobre el revoque nuevo con cinta", "es la prueba que hago en todas las paredes")
O("Déjela veinticuatro horas", "timer", 5.0, label="24 H", sub="sellada")
B("Si al otro día el plástico tiene gotitas por dentro", "w:foil", "cut")
EV("bagwet", "Si al otro día el plástico tiene gotitas por dentro", 7)
O("No pinte", "stamp", 2.6, text="NO PINTE", col="#ff4a3d")
B("Espere una semana más y repita", "img:s_espera")
B("Cuando el plástico sale seco, sin una gota", "img:s_seco")
O("Cuando el plástico sale seco, sin una gota", "stamp", 3.0, text="LISTA", col="#3fd17a")
# ======================= FIJADOR =======================
B("Ahora sí, a pintar. Pero no directo", "img:fj_lata", "fade")
B("Es un líquido lechoso que viene en lata", "img:fj_lechoso")
O("Hay dos tipos: al agua y al aguarrás", "chips", 5.0, items=["✓ AL AGUA", "✗ AL AGUARRÁS"])
O("una parte de fijador y tres o cuatro de agua", "big", 3.5, text="1 : 3-4", sub="fijador : agua")
B("una sola mano pareja en toda la superficie", "w:wall", "portal")
EV("paint", "una sola mano pareja en toda la superficie", 6)
B("Si lo da sólo en el parche", "img:fj_parche")
O("normalmente unas seis horas", "timer", 4.0, label="6 H", sub="secado del fijador")
# ======================= PINTURA RESPIRA =======================
B("Y la pintura. Aquí está la parte que más le va a sorprender", "img:pr_latas", "fade")
O("Se compra la que respira", "big", 3.5, text="LA QUE RESPIRA", size=110)
B("Pintura al agua, látex, de buena calidad", "img:pr_latex")
O("Lo que no se usa nunca por dentro en esa pared", "chips", 7.0, items=["✗ ESMALTE", "✗ ACEITE", "✗ IMPERMEABILIZANTE", "✗ «FRENA LA HUMEDAD»"])
B("Dos manos, con cuatro horas entre una y otra", "img:pr_rodillo")
EV("paint", "Dos manos, con cuatro horas entre una y otra", 6)
B("agréguele a la pintura un aditivo antihongos", "img:pr_aditivo")
# ======================= LO QUE NUNCA =======================
B("Le cuento lo que Don Ramiro nunca hacía", "img:n_ramiro_mano", "fade")
O("Nunca pintaba una pared que no había tocado", "chips", 26.0, items=["✗ PINTAR SIN TOCARLA", "✗ VIERNES → LUNES", "✗ ENDUIDO ABAJO", "✗ ZÓCALO DE CERÁMICA"])
B("Nunca pintaba un lunes una pared que había revocado", "img:n_calendario")
B("Nunca usaba enduido abajo de un metro", "w:base", "cut")
B("el zócalo de cerámica es una tapa", "w:base", "portal")
EV("zoc", "el zócalo de cerámica es una tapa", 6)
B("sin antes haber mirado del otro lado de la pared", "w:out", "portal")
O("la mitad de su oficio era saber cuándo no pintar", "big", 4.5, text="«Saber cuándo no pintar»", size=72)
B("Yo tardé quince años en entender", "img:n_claudio_pensando")
# ======================= ZOCALO =======================
B("Y ya que hablamos del zócalo", "w:base", "fade")
ON("zoc", "Y ya que hablamos del zócalo", "tiene que ser de madera")
B("pone un zócalo de cerámica alto", "img:z_ceramica")
B("Pero a los meses aparece más arriba", "w:xray", "iris")
KF(WET, "Pero a los meses aparece más arriba", 0.5); KF(WET, "y más alta que antes", 0.85); KF(WET, "tiene que ser de madera", 0.85); KF(WET, "Lo sacamos, y la pared empezó a secar", 0.5)
EV("xray", "Pero a los meses aparece más arriba", 14)
O("el agua sube más alto hasta encontrar", "tag", 4.0, pt="stain", text="EL AGUA SUBE MÁS", col="#ff4a3d")
B("el zócalo tiene que ser de madera", "w:base", "cut")
EV("zocwood", "el zócalo tiene que ser de madera", 8)
B("Doña Rosa tenía uno de cerámica", "img:z_saca")
# ======================= VARIANTES =======================
B("no todas las casas son iguales", "w:wide", "fade")
B("Si su casa es de bloque de cemento", "img:vr_bloque")
B("Si la casa es de adobe", "img:vr_adobe")
EV("lime", "el adobe necesita revoque de cal", 8)
B("Si vive en un lugar muy húmedo", "img:vr_rio")
B("Y si la pared es de un departamento", "img:vr_depto")
B("La prueba del aluminio sirve en todos los casos", "w:foil", "portal")
EV("foil", "La prueba del aluminio sirve en todos los casos", 5)
# ======================= CONDENSACION =======================
B("si su prueba del aluminio le dio que el agua viene del aire", "img:cd_vidrio", "fade")
B("Abra las ventanas diez minutos todas las mañanas", "img:cd_ventanas")
O("Abra las ventanas diez minutos todas las mañanas", "routine", 36.0, hl=None, rows=[
    {"at": "Abra las ventanas diez minutos", "when": "☀", "what": "10 min de ventanas, de lado a lado", "ic": "🪟"},
    {"at": "Después de bañarse", "when": "🚿", "what": "Baño abierto después de bañarse", "ic": "🚪"},
    {"at": "Cuando cocina, tape las ollas", "when": "🍲", "what": "Ollas tapadas", "ic": "🍲"},
    {"at": "que ropa dentro", "when": "👕", "what": "Nada de ropa secando adentro", "ic": "👕"},
    {"at": "Separe los muebles de las paredes", "when": "↔", "what": "Muebles a 5 cm de la pared", "ic": "🛋️"}])
B("Cuando cocina, tape las ollas", "img:cd_ollas")
B("Separe los muebles de las paredes", "img:cd_muebles")
B("Y limpie el moho con vinagre blanco puro", "img:cd_vinagre")
EV("mold", "Y limpie el moho con vinagre blanco puro", 5)
O("La condensación se arregla con hábitos", "big", 3.5, text="HÁBITOS, NO PINTURA", size=100)
# ======================= PREGUNTAS =======================
B("Me hacen siempre las mismas preguntas", "img:q_comentarios", "fade")
O("Puedo pintar con la pintura que me sobró", "comment", 4.5, text="¿Puedo usar la pintura que me sobró de otra pared?")
B("Si es al agua y es mate, sí", "img:q_sobrante")
O("Sirve el cemento de contacto, o los selladores en aerosol", "comment", 4.5, text="¿Y los selladores en aerosol?")
B("No, son tapas, y el agua empuja por detrás igual", "w:base", "portal")
O("Y si la pared es alquilada y no puedo picar", "comment", 4.5, text="Alquilo, no puedo picar la pared 😕")
B("Haga la prueba, saque el salitre en seco", "img:q_alquila")
O("Cuánto cuesta todo esto", "comment", 4.0, text="¿Cuánto cuesta todo?")
O("menos de cuarenta dólares para un metro de pared", "big", 3.5, text="< $40", sub="hecho por usted")
B("Un pintor le cobra eso sólo por venir a mirar", "img:q_pintor_mira")
# ======================= MAS PREGUNTAS =======================
B("y las inyecciones contra la humedad", "w:base", "fade")
O("y las inyecciones contra la humedad", "comment", 4.5, text="¿Sirven las inyecciones contra la humedad?")
B("Funcionan, pero son el último paso", "w:cut", "portal")
EV("drill", "una fila de agujeros a quince centímetros del piso", 6)
EV("inject", "se inyecta una crema contra la humedad", 7); EV("injdone", "se inyecta una crema contra la humedad", 14)
O("una fila de agujeros a quince centímetros del piso", "tag", 4.0, pt="inject", text="15 cm DEL PISO · CADA 10-12 cm", col="#8fd6ff")
B("Pero empezar por ahí es caro", "img:mp_inyeccion")
O("puedo usar pintura antihumedad con bicarbonato o con cal", "comment", 4.5, text="¿Pintura con bicarbonato o con cal casera?")
B("La cal sí, la pintura a la cal respira muy bien", "img:mp_cal")
O("El bicarbonato, no; eso es un mito", "stamp", 2.8, text="MITO", col="#ff4a3d")
# ======================= REGANCHO 2 =======================
B("Ya casi terminamos, pero todavía le debo", "w:wide", "fade")
B("No es la prueba del plástico, que ya le di", "w:foil", "cut")
B("hoy, un año y medio después, esa pared sigue blanca", "img:g3_pared_blanca")
# ======================= FINAL ROSA =======================
B("Volví a la casa de Doña Rosa cinco semanas después", "img:fr_vuelve", "fade")
B("La jardinera ya estaba baja, con su franja de piedra", "w:soil", "portal")
B("El revoque nuevo tenía el mismo color arriba y abajo", "w:wall", "portal")
KF(WET, "El revoque nuevo tenía el mismo color arriba y abajo", 0.5); KF(WET, "La bolsa de plástico salió seca", 0.0)
B("Le di el fijador a toda la pared", "img:fr_fijador")
B("Dos manos de pintura al agua para frentes", "img:fr_pinta")
EV("paint", "Dos manos de pintura al agua para frentes", 8)
O("Gasté en total, entre la piedra", "receipt", 30.0, title="LA PARED · ARREGLO", rows=[
    {"at": "entre la piedra", "item": "piedra partida", "$": 5},
    {"at": "el cemento, la arena", "item": "cemento + arena", "$": 18},
    {"at": "el hidrófugo", "item": "hidrófugo", "$": 12},
    {"at": "el fijador y la pintura", "item": "fijador", "$": 14},
    {"at": "la pintura. 83 dólares", "item": "pintura al agua", "$": 34}], totalAt="83 dólares")
B("Doña Rosa había gastado más de trescientos", "img:fr_rosa_sillon")
O("Doña Rosa había gastado más de trescientos", "chips", 5.0, items=["ANTES: +$300", "AHORA: $83"])
B("me mandó una foto: la pared blanca", "img:fr_foto")
# ======================= ULTIMO =======================
B("Y el paso que no hace nadie es éste", "w:test", "fade")
O("Se llama el cuadro de prueba", "big", 3.5, text="EL CUADRO DE PRUEBA", size=96)
B("un solo cuadrado de 50 x 50", "w:test", "portal")
ON("test", "un solo cuadrado de 50 x 50", "Por eso vuelven")
O("un solo cuadrado de 50 x 50", "tag", 4.0, pt="test", text="50 × 50 cm", col="#ffd60a")
B("Y espera siete días", "img:ul_calendario")
O("Y espera siete días", "timer", 4.5, label="7 DÍAS", sub="sin tocarlo")
B("pega un pedazo de cinta de embalar", "img:ul_cinta")
EV("tape", "pega un pedazo de cinta de embalar", 7)
B("lo arranca de golpe", "w:test", "cut")
B("Si la cinta sale limpia, sin pintura pegada", "img:ul_limpia")
O("Si la cinta sale limpia, sin pintura pegada", "stamp", 3.0, text="LISTA", col="#3fd17a")
B("Si sale pintura en la cinta", "img:ul_sucia")
O("usted perdió un cuadradito de pintura y no veinte litros", "chips", 5.0, items=["PIERDE: 50 × 50", "NO: 20 LITROS"])
B("Ningún pintor lo hace", "img:ul_claudio")
# ======================= RECAP =======================
B("Le hago el resumen en un minuto", "bk", "zoom")
O("Le hago el resumen en un minuto", "recap", 75.0, rows=[
    {"at": "Una ampolla es agua empujando", "tx": "Ampolla = agua empujando desde adentro"},
    {"at": "Primero, el aluminio", "tx": "Aluminio 48 h: ¿aire o pared?"},
    {"at": "Si viene de la pared, mire afuera", "tx": "Afuera: tierra, canaleta, pendiente, manguera"},
    {"at": "Saque el salitre en seco", "tx": "Salitre en seco, nunca lavado"},
    {"at": "Pique lo que suena hueco", "tx": "Picar lo hueco +30 cm"},
    {"at": "Revoque con hidrófugo", "tx": "Revoque con hidrófugo, 2 capas"},
    {"at": "Espere tres o cuatro semanas", "tx": "3-4 semanas + la bolsa de plástico"},
    {"at": "Fijador al agua en toda la pared", "tx": "Fijador al agua en toda la pared"},
    {"at": "cuadro de prueba de 50 por 50", "tx": "Cuadro 50×50, 1 semana, la cinta"},
    {"at": "Nunca impermeable por dentro", "tx": "Impermeable, enduido, zócalo de cerámica", "no": True}])
# ======================= CIERRE =======================
B("Si esta pared le sirvió", "w:wide", "fade")
B("manual del albañil tiene 65 arreglos más", "w:book", "portal")
PG("manual del albañil tiene 65 arreglos más", "al001", 14)
O("manual del albañil tiene 65 arreglos más", "qr", 10.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="66 arreglos · link en la 1ª línea de la descripción")
B("qué es exactamente ese polvito blanco", "img:zz_salitre")
O("Y déjeme en los comentarios dónde tiene usted la mancha", "comment", 5.0, text="¿Dónde tiene la mancha: abajo, en las esquinas o en el techo? 👇")
O("Yo leo todos", "chips", 5.0, items=["🔔 SUSCRÍBASE", "PRÓXIMO: EL SALITRE"])
B("Soy Claudio, treinta años de albañil", "w:wide", "zoom")
_pa = 0
for _b in BEATS:
    if _b['a'] < _pa - 2: print('  ⚠ fuera de orden:', _b['base'], _b['a'], '<', _pa)
    _pa = max(_pa, _b['a'])
# ---------------- base: avatar en sus ventanas, el resto según los anclajes ----------------
BEATS.sort(key=lambda b: b["a"])
used = set()
for b in BEATS:
    if b["base"].startswith("img:"):
        i = b["base"][4:]
        if i in used or not os.path.exists(PUB + "i_" + i + ".jpg"): b["base"] = "w:wide"; print("  ↺ sin foto / repetida:", i)
        used.add(i)
fotos = {f[2:-4] for f in os.listdir(PUB) if f.startswith("i_")}
print("fotos sin usar:", sorted(fotos - used))

TRS = ["swipeL", "cut", "up", "swipeR", "wipe", "cut", "down", "zoom"]
def seg_of(b, a, tr):
    k, x = b["base"].split(":", 1) if ":" in b["base"] else (b["base"], None)
    g = {"a": round(a, 2), "tr": tr}
    if k == "img":
        g.update(k="img", id=x); h = hash(x) % 4
        g["z"] = [[1.03, 1.14], [1.14, 1.03], [1.05, 1.12], [1.04, 1.16]][h]; g["ox"] = [0, -30, 30, 0][h]; g["oy"] = [0, 10, -10, -20][h]
    elif k == "w": g.update(k="w", view=x)
    else: g.update(k="bk")
    return g

segs = []
for n, b in enumerate(BEATS):
    tr = b["tr"] or TRS[n % len(TRS)]
    g = seg_of(b, b["a"], tr)
    if g["k"] == "w" and tr == "portal" and segs and segs[-1]["k"] == "w": g["tr"] = "cut"
    segs.append(g)
segs[0]["a"] = 0.0
# el avatar pisa sus ventanas; al salir vuelve lo que corresponda (si era una foto ya empezada → el mundo)
for w in AVW:
    ms, me = w["ms"], w["me"]
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
# sin planos de menos de 1,2 s (se come el más corto)
segs.sort(key=lambda g: g["a"])
out = []
for g in segs:
    if out and g["a"] - out[-1]["a"] < 1.2 and out[-1]["k"] != "av" and g["k"] != "av": out[-1] = g; continue
    out.append(g)
segs = out
# planos de foto largos (>8 s) → el mundo sigue
add = []
for i, g in enumerate(segs):
    b = segs[i + 1]["a"] if i + 1 < len(segs) else END
    if g["k"] == "img" and b - g["a"] > 8.5: add.append({"a": round(g["a"] + 6.0, 2), "k": "w", "view": "wall" if i % 2 else "wide", "tr": "portal"})
segs = sorted(segs + add, key=lambda g: g["a"])

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
    p2, l2, f2 = push(v, 0.12 if b - g["a"] < 12 else 0.22)
    keys.append({"t": round(b, 2), "p": p2, "l": l2, "fov": f2})
    if g["k"] == "w" and v in PTV: g["pt"] = PTV[v]
keys.sort(key=lambda k: k["t"])
ded = []
for k in keys:
    if ded and k["t"] <= ded[-1]["t"]: k["t"] = round(ded[-1]["t"] + 0.01, 2)
    ded.append(k)

# ---------------- piezas: tag con pt sólo sobre el mundo; "at" de listas → segundos ----------------
def base_at(t):
    g = [x for x in segs if x["a"] <= t]; return g[-1] if g else segs[0]
ov = []
for o in OVS:
    if o["k"] == "tag" and "pt" in o and base_at(o["a"] + 0.4)["k"] != "w": continue
    cur = max(0, next((i for i, s in enumerate(TS) if s >= o["a"] - 0.5), 0))  # las listas se buscan desde la pieza, no desde el final
    for lk in ("items", "rows"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for it in o[lk]:
                a = at(it["at"]) if isinstance(it["at"], str) else it["at"]
                it["at"] = a if a is not None else o["a"] + 0.5
    if o["k"] == "three": o["ats"] = [at(x) or o["a"] for x in o["ats"]]
    if o["k"] == "jars": o["shake"] = at("les pongo la tapa y agito") or o["a"] + 4
    if o["k"] == "receipt": o["totalAt"] = at(o["totalAt"]) or round(o["b"] - 3, 2)
    if o["k"] == "price": o["gAt"] = round(o["a"] + 2.2, 2)
    if o["k"] == "routine": o["hl"] = -1
    ov.append(o)
for o in ov:  # las piezas grandes llevan el fondo del mundo quieto
    if o["k"] in ("diag", "recap", "routine", "jars", "kit"):
        if base_at(o["a"] + 0.5)["k"] not in ("bk", "av"): pass

ev = {k: sorted(v) for k, v in EVR.items()}
ev["wet"] = sorted(WET); ev["soil"] = sorted(SOIL); ev["pages"] = PAGES; ev["marks"] = MARKS
clips = sorted(f[2:-4] for f in os.listdir(PUB) if f.startswith("c_") and f.endswith(".mp4"))
reel = os.path.exists(PUB + "reel0.mp4")
rl = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + "reel0.mp4"]).decode()) if reel else 0
json.dump(segs, open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
json.dump({"keys": ded}, open(S + "cam.json", "w", encoding="utf8"))
json.dump(ev, open(S + "ev.json", "w", encoding="utf8"))
cl = {c: round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", PUB + "c_" + c + ".mp4"]).decode()), 2) for c in clips}
json.dump({"reel": reel, "reelLen": round(rl, 3), "clips": clips, "clipLen": cl, "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))

shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"]} for i, g in enumerate(segs)]
json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))
# ---------------- medición ----------------
dur = [(segs[i + 1]["a"] if i + 1 < len(segs) else END) - g["a"] for i, g in enumerate(segs)]
import statistics
tot = {k: round(sum(d for g, d in zip(segs, dur) if g["k"] == k), 1) for k in ("av", "w", "img", "bk")}
gap, last = 0, 0
for g, d in zip(segs, dur):
    if g["k"] == "av": last = g["a"] + d
    else: gap = max(gap, g["a"] + d - last)
print(f"END {END:.1f}s · planos {len(segs)} · mediana {statistics.median(dur):.1f}s · máx {max(dur):.1f}s · {tot} · av {100*tot['av']/END:.0f}% · hueco máx sin avatar {gap:.1f}s")
print(f"piezas {len(ov)} · eventos {sum(len(v) for k, v in EVR.items())} · llaves {len(ded)} · clips {len(clips)} · reel {reel}")
print("SIN ANCLAR:", miss if miss else "ninguna")
