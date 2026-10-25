# al30capil · plan del video ENTERO anclado a la voz. Cada plano, pieza y evento del mundo 3D se ancla a la frase que
# se dice en ese segundo (at() sobre words.json) → segs.json, ov.json, cam.json, ev.json, avail.json en src/al30capil.
# Las ventanas del avatar las manda avwin.json (av_temprano): ahí la base es el avatar, y al salir se vuelve al mundo.
import json, os, re, subprocess, unicodedata, sys

R = "D:/wt/al30capil/"
S = R + "src/al30capil/"
PUB = R + "public/al30capil/"
W = json.load(open(S + "words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
WAV = R + "public/al30capilcut.wav"

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

# ---------------- vistas del mundo (la pared de Doña Carmen: dormitorio adentro, patio de tierra afuera, canaleta y zanja) ----------------
V = {
    "wide": ([0.2, 1.45, -3.4], [0, 0.7, 0], 40), "wall": ([0, 0.75, -1.7], [0, 0.6, -0.15], 38),
    "base": ([0.3, 0.35, -1.05], [0.2, 0.2, -0.15], 34), "foil": ([0.9, 0.5, -0.85], [0.95, 0.45, -0.15], 30),
    "pick": ([-0.6, 0.7, -1.4], [-0.6, 0.5, -0.15], 36), "inject": ([-0.3, 0.4, -0.85], [-0.3, 0.15, -0.15], 30),
    "cut": ([-3.6, 0.9, 0.2], [-2, 0.2, 0.1], 36), "under": ([-3.2, 0.1, 0.4], [-2, -0.4, 0.1], 36),
    "out": ([0.4, 1.5, 3.6], [0, 0.3, 0.4], 40), "soil": ([0.6, 0.75, 1.9], [0, 0.15, 0.5], 34),
    "spout": ([2.2, 0.9, 1.6], [1.25, 0.3, 0.4], 34), "patio": ([1.5, 1.8, 4.2], [0, 0, 1.6], 42),
    "trench": ([-1.3, 1.0, 2.5], [-0.3, 0.25, 0.2], 40),
    "book": ([1.55, 1.22, -1.32], [1.55, 0.74, -1.75], 30), "xray": ([-0.4, 0.8, -1.9], [-0.2, 0.45, 0], 38),
}
PTV = {"wall": "wall", "base": "base", "foil": "foil", "pick": "pick", "inject": "inject", "cut": "cut", "under": "found",
       "out": "wall", "soil": "soil", "spout": "spout", "patio": "slope", "trench": "trench", "book": "book", "xray": "stain"}

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

WET.append([0, 0.8]); SOIL.append([0, 0.15])
ON("salt", "un polvito blanco abajo", "Volví a la casa de Doña Carmen cuatro meses después")
# el zócalo de cerámica del yerno está puesto hasta que lo sacamos al final
ON("zoc", "el zócalo manchado", "Sacamos el zócalo de cerámica")
# la canaleta tira el agua al pie de la pared hasta que le ponemos el caño
ON("rain", "La canaleta del techo terminaba en un caño", "8 dólares")
# ======================= GANCHO =======================
B("Usted está ahí, parado frente a esa pared", "img:h_parado", "fade")
B("La mancha oscura que sale del piso y sube", "w:wall", "portal")
O("hasta la altura de la rodilla", "tag", 3.5, pt="stain", text="SUBE DEL PISO", col="#ff4a3d")
EV("blister", "La pintura inflada", 50)
B("Ya la pintó. Ya le puso un impermeabilizante", "img:h_latas")
B("A lo mejor ya le pagó a alguien", "img:h_paga")
B("es humedad por capilaridad", "w:cut", "portal")
EV("xray", "es humedad por capilaridad", 9)
O("es humedad por capilaridad", "big", 3.5, text="CAPILARIDAD", sub="agua que sube del suelo por adentro", size=110)
B("casi todo lo que se vende para arreglarla, no la arregla", "img:h_gondola")
O("las tres soluciones que sí funcionan", "chips", 5.5, items=["1 · AFUERA", "2 · EL REVOQUE", "3 · LA BARRERA"])
B("los errores que hacen que la mancha suba más alto", "img:h_errores")
B("la que casi nadie conoce", "w:trench", "portal")
O("Cuesta casi nada, se hace afuera", "chips", 4.5, items=["CASI NADA", "SE HACE AFUERA", "SIN TOCAR ADENTRO"])
# ======================= PRESENTACION =======================
O("Soy Claudio. Treinta años de albañil", "lower", 5.0, name="CLAUDIO", l2="Albañil · 30 años de oficio")
B("Aprendí con Don Ramiro", "img:p_ramiro", "fade")
B("se iban derecho al patio", "img:p_patio")
O("el agua de abajo no nace en la pared, nace en la tierra", "big", 4.5, text="«No nace en la pared: nace en la tierra»", size=64)
B("Entro, miro la mancha, y salgo al patio", "img:p_sale")
B("en la mitad de las casas, la respuesta está afuera", "w:out", "portal")
# ======================= CTA1 =======================
B("Todo lo que aprendí lo escribí en un manual", "img:c_escribe", "fade")
B("Se llama el Manual del Albañil", "w:book", "portal")
PG("Se llama el Manual del Albañil", "al001", 28)
O("Son 66 arreglos de la casa", "chips", 5.0, items=["66 ARREGLOS", "LISTA DE FERRETERÍA", "MEDIDAS Y PASOS"])
O("un tratamiento contra la humedad hecho por una empresa", "price", 6.5, gAt=None)
B("La humedad que sube del piso está en la página once", "w:book", "cut")
PG("La humedad que sube del piso está en la página once", "al011", 20)
MK("La humedad que sube del piso está en la página once", 7, [0.07, 0.43, 0.93, 0.53])
O("o escanee este código con la cámara", "qr", 9.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="Página 11 · la humedad que sube del piso")
B("Ahora sí, vamos", "w:wide", "swipeR")
# ======================= LA CASA =======================
B("me llamó una señora que se llama Doña Carmen", "img:r_telefono", "fade")
B("vive con su hija en una casa de ladrillo", "img:r_casa")
B("tengo el dormitorio y la cocina con la pared mojada", "img:r_carmen")
B("En el dormitorio, la pared del costado", "w:wall", "portal")
O("desde el zócalo hasta unos 80 centímetros", "big", 3.4, text="80 cm", sub="del zócalo para arriba", x=1450, y=300, size=170)
B("como la marca que deja el agua en una playa", "img:r_playa")
B("Debajo de la ventana la pintura colgaba en tiras", "w:base", "portal")
EV("peel", "Debajo de la ventana la pintura colgaba en tiras", 6)
B("detrás de la heladera el revoque se deshacía en arena", "img:r_heladera")
# ======================= LA HISTORIA =======================
B("Doña Carmen ya había probado de todo", "img:r_probado", "fade")
O("un pintor raspó y pintó con pintura impermeable", "receipt", 34.0, title="LA MISMA PARED", rows=[
    {"at": "un pintor raspó y pintó con pintura impermeable", "item": "pintor · impermeable", "$": 180},
    {"at": "el yerno le puso un zócalo de cerámica", "item": "zócalo de cerámica", "$": 90},
    {"at": "una cajita que prometía secar los muros", "item": "la «cajita»", "$": 340}], totalAt="más de 600 dólares")
B("un pintor raspó y pintó con pintura impermeable", "img:r_pintor")
B("el yerno le puso un zócalo de cerámica alto", "img:r_yerno")
B("La mancha subió por encima del zócalo", "w:base", "portal")
B("una cajita que prometía secar los muros con ondas", "img:r_cajita")
B("Lo tuvo enchufado ocho meses", "img:r_enchufe")
B("cada invierno el dormitorio olía a humedad", "img:r_hija")
O("no me crea a mí, créale a la pared", "big", 4.0, text="«Créale a la pared»", size=90)
# ======================= QUE ES =======================
B("Le explico qué es la capilaridad", "w:cut", "fade")
ON("xray", "están llenos de canalitos chiquitos", "es la altura hasta donde el agua alcanza a subir")
O("están llenos de canalitos chiquitos", "tag", 4.0, pt="cut", text="CANALITOS", sub="tan finos que no se ven", col="#8fd6ff")
B("Cuando la base de la pared está en contacto con tierra húmeda", "w:under", "portal")
B("Igual que sube el café por un terrón de azúcar", "img:q_terron")
B("o el agua por una servilleta de papel", "img:q_servilleta")
B("Sube hasta que la cantidad de agua que entra por abajo", "w:xray", "portal")
O("Sube hasta que la cantidad de agua que entra por abajo", "chips", 6.0, items=["ENTRA POR ABAJO", "= SE EVAPORA POR LA CARA"])
B("Por eso la mancha tiene un borde de arriba parejo", "w:wall", "cut")
O("Por eso la mancha tiene un borde de arriba parejo", "tag", 4.0, pt="stain", text="EL BORDE PAREJO", col="#ffd60a")
# ======================= POR QUE AHORA =======================
B("por qué ahora, si la casa tiene cincuenta años", "img:pa_casa_vieja", "fade")
B("las casas viejas se hacían con una capa aislante abajo", "w:under", "portal")
ON("xray", "las casas viejas se hacían con una capa aislante abajo", "nunca se puso bien")
O("las casas viejas se hacían con una capa aislante abajo", "tag", 4.5, pt="dpc", text="LA CAPA AISLADORA", sub="rota", col="#ffb257")
B("algo cambió afuera", "w:out", "portal")
O("Se subió el nivel del patio", "chips", 9.0, items=["PATIO MÁS ALTO", "VEREDA NUEVA", "JARDINERA", "PATIO TAPADO CON CEMENTO"])
B("se hizo una vereda nueva más alta", "img:pa_vereda")
B("se tapó con cemento un patio", "w:patio", "portal")
EV("slope", "se tapó con cemento un patio", 7)
O("La pared no cambió. Cambió lo que hay alrededor", "big", 4.0, text="CAMBIÓ LO DE ALREDEDOR", size=90)
# ======================= DIAGNOSTICO =======================
B("Lo primero es estar seguro de que es capilaridad", "w:wall", "fade")
O("empieza en el zócalo sube", "diag", 38.0, items=[
    {"at": "empieza en el zócalo sube", "sw": "DESDE EL ZÓCALO", "tx": "50 cm a 1 m, borde parejo, salitre", "res": "CAPILARIDAD", "ok": False},
    {"at": "La condensación, en cambio, aparece arriba", "sw": "ARRIBA + PUNTOS NEGROS", "tx": "esquinas, detrás de muebles", "res": "CONDENSACIÓN", "ok": True},
    {"at": "Y la filtración de lluvia aparece en manchas sueltas", "sw": "MANCHAS SUELTAS", "tx": "cerca de ventanas y canaletas", "res": "LLUVIA", "ok": False}])
B("casi siempre trae salitre", "w:base", "portal")
B("La condensación, en cambio, aparece arriba", "img:d_moho")
B("Y la filtración de lluvia aparece en manchas sueltas", "img:d_filtracion")
B("haga la prueba del aluminio", "w:foil", "portal")
ON("foil", "haga la prueba del aluminio", "el agua viene de adentro del muro")
O("48 horas", "timer", 4.5, label="48 H", sub="aluminio sellado")
EV("foilwet", "Si sale mojado del lado de la pared", 5)
# ======================= ERROR UNO =======================
B("Ahora, antes de las soluciones, los errores", "bk", "fade")
O("El primer error es pintar con pintura impermeable", "err", 5.0, n=1, tx="PINTURA IMPERMEABLE ADENTRO")
B("Parece lógico: si hay agua, la tapo", "img:e1_rodillo")
B("La pintura impermeable no le impide subir", "w:xray", "iris")
EV("xray", "La pintura impermeable no le impide subir", 12)
O("Le impide salir", "tag", 3.5, pt="blister", text="NO LA DEJA SALIR", col="#ff4a3d")
KF(WET, "La sube más alto, buscando por dónde salir", 0.8); KF(WET, "y con ampollas", 0.95); KF(WET, "Una pared con capilaridad necesita respirar", 0.8)
B("la mancha casi siempre aparece unos centímetros más arriba", "w:wall", "cut")
# ======================= ERROR DOS =======================
B("El segundo error es el zócalo de cerámica", "w:base", "fade")
O("El segundo error es el zócalo de cerámica", "err", 5.0, n=2, tx="EL ZÓCALO DE CERÁMICA")
B("Una tira de cerámica de 15 centímetros", "img:e2_ceramica")
B("Entonces el agua sube por encima del zócalo", "w:xray", "iris")
EV("xray", "Entonces el agua sube por encima del zócalo", 8)
O("ahora llega a ochenta", "chips", 5.0, items=["ANTES: 60 cm", "CON ZÓCALO: 80 cm"])
B("la mancha estaba 20 centímetros más alta", "img:e2_dos_paredes")
B("Lo que se pone en una pared con capilaridad es un zócalo de madera", "img:e2_madera")
# ======================= ERROR TRES =======================
B("El tercer error es comprar aparatos milagrosos", "img:e3_cajita", "fade")
O("El tercer error es comprar aparatos milagrosos", "err", 5.0, n=3, tx="LOS APARATOS MILAGROSOS")
O("Carmen pagó 340 dólares", "big", 3.4, text="$340", sub="una cajita enchufada")
B("La pared sigue apoyada en la tierra mojada", "w:under", "portal")
B("pregúntele por la garantía por escrito", "img:e3_garantia")
O("No hay atajo eléctrico", "stamp", 3.0, text="NO HAY ATAJO", col="#ff4a3d")
# ======================= REGANCHO 1 =======================
B("lo que encontré en el patio de Doña Carmen", "img:g1_patio", "fade")
B("caminé a lo largo de esa pared", "w:patio", "portal")
O("vi tres cosas que nadie había visto en veinte años", "big", 3.5, text="3 COSAS", sub="que nadie vio en 20 años")
O("costaba más de 10 dólares", "big", 3.0, text="< $10", sub="cada arreglo")
B("por qué la mancha de la cocina era más alta", "w:out", "zoom")
# ======================= ERROR CUATRO =======================
B("El cuarto error es revocar con cemento puro", "img:e4_cemento", "fade")
O("El cuarto error es revocar con cemento puro", "err", 5.0, n=4, tx="CEMENTO PURO EN CASA VIEJA")
B("en una casa vieja, de ladrillo blando", "w:cut", "portal")
B("o en una de adobe", "img:e4_adobe")
B("el agua no sale por el revoque y se queda en el ladrillo", "w:xray", "iris")
EV("xray", "el agua no sale por el revoque y se queda en el ladrillo", 8)
B("En esas casas se revoca con cal", "img:e4_cal")
# ======================= ERROR CINCO =======================
B("Y el quinto error, el más caro", "img:e5_empresa", "fade")
O("Y el quinto error, el más caro", "err", 5.0, n=5, tx="EMPEZAR POR LO MÁS FUERTE")
B("le hace inyecciones en toda la casa", "img:e5_inyecciones")
B("si el agua está entrando por una jardinera", "w:soil", "portal")
O("El orden correcto es al revés", "chips", 8.0, items=["1 · AFUERA (LO BARATO)", "2 · EL REVOQUE", "3 · LA BARRERA"])
B("Así gasta lo justo", "w:wide", "zoom")
# ======================= SOLUCION UNO =======================
B("La primera solución es cortar el agua por afuera", "w:out", "fade")
O("La primera solución es cortar el agua por afuera", "step", 4.5, n="1", tx="CORTAR EL AGUA POR AFUERA")
O("Uno: si hay tierra, una jardinera", "routine", 40.0, hl=None, rows=[
    {"at": "Uno: si hay tierra, una jardinera", "when": "1", "what": "Tierra apoyada, más alta que el piso", "ic": "🪴"},
    {"at": "Dos: si la canaleta del techo descarga", "when": "2", "what": "Canaleta que descarga al pie", "ic": "🌧️"},
    {"at": "Tres: si el patio, la vereda o la acera", "when": "3", "what": "Pendiente hacia la casa", "ic": "📐"},
    {"at": "Cuatro: si hay una llave de agua", "when": "4", "what": "Llave, lavadero o manguera que gotea", "ic": "🚰"},
    {"at": "5 Si hay pasto plantas", "when": "5", "what": "Plantas que tapan la base", "ic": "🌿"}])
B("Uno: si hay tierra, una jardinera", "w:soil", "portal")
B("Dos: si la canaleta del techo descarga", "w:spout", "cut")
B("Tres: si el patio, la vereda o la acera", "w:patio", "cut")
EV("slope", "Tres: si el patio, la vereda o la acera", 7)
B("Cuatro: si hay una llave de agua", "img:s1_llave")
B("5 Si hay pasto plantas", "img:s1_plantas")
O("es un vaso de agua que la pared toma todos los días", "big", 3.5, text="UN VASO POR DÍA", size=100)
# ======================= CARMEN PATIO =======================
B("En el patio de Doña Carmen encontramos tres", "img:cp_patio", "fade")
B("La canaleta del techo terminaba en un caño", "w:spout", "portal")
O("La canaleta del techo terminaba en un caño", "tag", 4.0, pt="spout", text="1 · LA CANALETA", col="#59b8ff")
B("la tierra ahí abajo estaba siempre barrosa", "img:cp_barro")
B("una franja de tierra con plantas, apoyada contra el muro", "w:soil", "portal")
O("15 centímetros más alta que el piso de adentro", "tag", 4.0, pt="soil", text="2 · TIERRA +15 cm", col="#ffb257")
B("tenía una pendiente suave hacia la casa", "w:patio", "portal")
EV("slope", "tenía una pendiente suave hacia la casa", 8)
O("tenía una pendiente suave hacia la casa", "tag", 4.0, pt="slope", text="3 · PENDIENTE HACIA LA CASA", col="#ff4a3d")
B("Todos miraban la mancha", "w:wall", "zoom")
# ======================= ARREGLO AFUERA =======================
B("A la canaleta le pusimos un codo y un tramo de caño", "w:spout", "fade")
EV("spoutfix", "A la canaleta le pusimos un codo y un tramo de caño", 9999)
EV("away", "para llevar el agua lejos de la pared", 7)
B("para llevar el agua lejos de la pared", "img:aa_cano")
O("8 dólares", "big", 3.0, text="$8", sub="un codo y 2 m de caño")
B("La tierra de las plantas la bajamos", "w:soil", "portal")
KF(SOIL, "La tierra de las plantas la bajamos", 0.15); KF(SOIL, "y las plantas las corrimos medio metro", -0.15)
EV("noplants", "las plantas las corrimos medio metro hacia afuera", 9999)
B("las plantas las corrimos medio metro hacia afuera", "img:aa_plantas")
B("en la franja pegada a la pared hicimos lo que le voy a mostrar al final", "w:trench", "portal")
B("en seis semanas la mancha del dormitorio bajó", "w:wall", "portal")
KF(WET, "en seis semanas la mancha del dormitorio bajó", 0.8); KF(WET, "a 40 centímetros", 0.4)
O("de 80 a 40 centímetros", "chips", 5.0, items=["ANTES: 80 cm", "6 SEMANAS: 40 cm"])
B("ya no le entraba agua nueva", "img:aa_carmen")
# ======================= SOLUCION DOS =======================
B("La segunda solución es el revoque que respira", "w:pick", "fade")
O("La segunda solución es el revoque que respira", "step", 4.5, n="2", tx="EL REVOQUE QUE RESPIRA")
B("saque el salitre en seco, con un cepillo de alambre", "img:s2_cepillo")
EV("brush", "saque el salitre en seco, con un cepillo de alambre", 6)
B("golpee la pared con el mango de un martillo", "img:s2_golpea")
B("Píquelo hasta el ladrillo", "w:pick", "portal")
ON("pick", "Píquelo hasta el ladrillo", "La segunda solución es el revoque que respira. Ésta")
ON("pick", "Píquelo hasta el ladrillo", "Y revoque en dos capas")
O("siga 30 centímetros más arriba", "tag", 4.0, pt="pick", text="+30 cm", col="#ffd60a")
B("Deje el ladrillo al aire una semana", "img:s2_ventana")
B("Y revoque en dos capas", "img:s2_capa")
EV("render1", "Y revoque en dos capas", 9999); EV("render2", "y la segunda alisada con la llana", 9999)
# ======================= LA MEZCLA =======================
B("La mezcla depende de la casa", "img:mz_baldes", "fade")
O("un balde de cemento y tres baldes de arena fina", "big", 3.5, text="1 : 3", sub="+ hidrófugo en el agua")
B("el hidrófugo líquido en el agua de la mezcla", "img:mz_hidro")
B("Si la casa es vieja, de ladrillo blando", "w:pick", "portal")
EV("lime", "Si la casa es vieja, de ladrillo blando", 9999)
O("una parte de cemento, una de cal y cinco o seis de arena", "big", 3.8, text="1 : 1 : 5-6", sub="cemento : cal : arena")
B("en adobe, sólo cal y arena", "img:mz_adobe")
O("le decían revoque de sacrificio", "big", 3.5, text="REVOQUE DE SACRIFICIO", size=96)
# ======================= FERRETERIA =======================
B("Le digo lo que tiene que pedir en la ferretería", "img:k_ferreteria", "fade")
O("Un cepillo de alambre de mano", "kit", 46.0, items=[
    {"at": "Un cepillo de alambre de mano", "ic": "🪥", "tx": "cepillo de alambre"},
    {"at": "Un cortafierro y una maceta", "ic": "🔨", "tx": "cortafierro + maceta"},
    {"at": "Una cuchara de albañil, una llana de madera", "ic": "🧱", "tx": "cuchara, llana, regla"},
    {"at": "Cemento común", "ic": "🪨", "tx": "1 bolsa de cemento"},
    {"at": "Arena fina", "ic": "⏳", "tx": "arena fina (no gruesa)"},
    {"at": "Hidrófugo líquido", "ic": "🧴", "tx": "hidrófugo líquido"},
    {"at": "cal hidratada, una bolsa", "ic": "🥛", "tx": "cal hidratada"},
    {"at": "un par de guantes de goma y unas gafas", "ic": "🧤", "tx": "guantes, gafas, mascarilla"}])
B("Un cortafierro y una maceta", "img:k_herramientas")
B("Arena fina, de la que se usa para revoque", "img:k_arena")
B("Pida también un par de guantes de goma", "img:k_guantes")
O("entre 30 y 40 dólares", "big", 3.5, text="$30-40", sub="una pared entera")
# ======================= COMO PICAR =======================
B("Un consejo para cuando pique", "w:pick", "fade")
B("Marque primero con una tiza dónde termina la mancha", "img:cp_tiza")
B("Pique con el cortafierro inclinado", "img:cp_inclinado")
B("Si un ladrillo sale flojo o se deshace", "img:cp_ladrillo")
B("moje la pared con un pincel grueso, apenas", "img:cp_pincel")
O("Mojarla para revocar sí", "chips", 5.0, items=["✓ MOJAR PARA REVOCAR", "✗ MOJAR PARA LIMPIAR"])
# ======================= CTA2 =======================
B("Y aquí le quiero mostrar algo", "w:book", "fade")
PG("Y aquí le quiero mostrar algo", "al011", 42)
MK("Con una caja negra que dice lo que tiene que pedir", 9, [0.07, 0.54, 0.93, 0.585])
MK("Son 66 arreglos así", 7, [0.07, 0.68, 0.93, 0.82], "#3fd17a")
B("paredes, techos, pisos, azulejos", "img:g2_manual")
O("Cada uno con materiales de uno o dos dólares", "price", 6.5, gAt=None)
O("o escanee este código con la cámara del teléfono. Y sigamos", "qr", 9.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="Página 11 · la humedad que sube del piso")
B("Y sigamos con la tercera solución", "w:book", "cut")
# ======================= SOLUCION TRES =======================
B("La tercera solución es la barrera química", "w:inject", "fade")
O("La tercera solución es la barrera química", "step", 4.5, n="3", tx="LA BARRERA QUÍMICA")
B("como en una medianera o un sótano", "img:s3_medianera")
B("en la base de la pared se hace una fila de agujeros", "w:cut", "portal")
ON("xray", "en la base de la pared se hace una fila de agujeros", "ya no puede subir por encima de esa línea")
EV("dpc", "Es como ponerle a la pared, desde adentro", 12)
O("Es como ponerle a la pared, desde adentro", "tag", 4.5, pt="dpc", text="LA CAPA QUE LE FALTA", col="#3fd17a")
# ======================= INYECCION =======================
B("Con una tiza, marque una línea a 15 centímetros del piso", "img:in_tiza", "fade")
O("Con una tiza, marque una línea a 15 centímetros del piso", "tag", 4.5, pt="inject", text="15 cm DEL PISO · CADA 10-12 cm", col="#8fd6ff")
B("Sobre esa línea, marque un punto cada 10 o 12", "w:inject", "portal")
B("en la junta de mortero entre ladrillos", "img:in_junta")
B("Con un taladro y una mecha", "w:inject", "cut")
ON("drill", "Con un taladro y una mecha", "Sople el polvo de adentro")
O("hasta dos tercios del ancho de la pared", "big", 3.5, text="⅔", sub="del ancho de la pared", x=1450, y=300, size=170)
B("Sople el polvo de adentro", "img:in_sopla")
B("llene cada agujero desde el fondo hacia afuera", "w:inject", "portal")
ON("inject", "llene cada agujero desde el fondo hacia afuera", "Tape los agujeros con un poco de mortero")
EV("injdone", "Tape los agujeros con un poco de mortero", 9999)
B("Tape los agujeros con un poco de mortero", "img:in_tapa")
# ======================= DESPUES INYECCION =======================
B("la crema tarda unas semanas en hacer efecto", "w:xray", "fade")
O("un mes por cada centímetro de espesor de pared", "big", 3.8, text="1 MES × cm", sub="en el peor de los casos")
B("el revoque viejo de abajo va a seguir sacando salitre", "w:base", "portal")
B("Un tubo de crema de los de ferretería", "img:di_tubo")
# ======================= CUAL ELIJO =======================
B("Entonces, ¿cuál necesita su casa", "bk", "fade")
O("Si del otro lado de la pared hay algo que la moja", "diag", 40.0, items=[
    {"at": "Si del otro lado de la pared hay algo que la moja", "sw": "ALGO LA MOJA AFUERA", "tx": "tierra, canaleta, plantas", "res": "1 · AFUERA, Y ESPERAR", "ok": True},
    {"at": "Si la mancha baja pero no se va", "sw": "BAJA PERO NO SE VA", "tx": "después de 2 meses", "res": "2 · + EL REVOQUE", "ok": True},
    {"at": "Y si después de las dos, a los meses", "sw": "SIGUE PASANDO", "tx": "o pared enterrada", "res": "3 · LA BARRERA", "ok": False}])
B("En la casa de Doña Carmen hicimos la primera y la segunda", "img:ce_carmen")
# ======================= CUANTO ESPERAR =======================
B("cuánto esperar antes de pintar", "w:wall", "fade")
O("espere como mínimo tres semanas, y mejor cuatro", "weeks", 6.0, per=1.2, max=4)
B("haga la prueba del plástico", "w:foil", "portal")
ON("bag", "haga la prueba del plástico", "Cuando sale seca, pinte")
O("24 horas", "timer", 4.0, label="24 H", sub="bolsa sellada")
EV("bagwet", "Si al otro día tiene gotitas por dentro", 5)
B("Cuando sale seca, pinte con fijador al agua", "img:ce_pinta")
EV("paint", "Cuando sale seca, pinte con fijador al agua", 6)
O("Nunca esmalte, nunca pintura impermeable", "chips", 5.0, items=["✗ ESMALTE", "✗ IMPERMEABLE ADENTRO", "✗ ZÓCALO CERÁMICO"])
# ======================= LO QUE NUNCA =======================
B("lo que Don Ramiro nunca hacía con una pared de capilaridad", "img:n_ramiro", "fade")
O("Nunca entraba a revocar sin haber dado la vuelta por afuera", "chips", 30.0, items=["✗ REVOCAR SIN MIRAR AFUERA", "✗ AGUA AL SALITRE", "✗ CEMENTO EN ADOBE", "✗ CERÁMICA ABAJO", "✗ INYECTAR PRIMERO"])
B("Nunca le tiraba agua a una pared con salitre", "img:n_agua")
B("pintaba antes de tocar la pared con la palma de la mano", "img:n_palma")
O("la capilaridad no se gana con fuerza, se gana con orden", "big", 4.5, text="«Se gana con orden»", size=80)
# ======================= VARIANTES =======================
B("no todas las casas son iguales", "w:wide", "fade")
B("Si su casa es un departamento en un piso alto", "img:vr_depto")
B("Si la pared es medianera", "img:vr_medianera")
B("Si la casa es de adobe", "img:vr_adobe")
B("Y si la mancha está en un sótano", "img:vr_sotano")
# ======================= OBRA NUEVA =======================
B("si usted está por construir una pieza nueva", "img:ob_obra", "fade")
O("prevenir cuesta diez veces menos que curar", "big", 3.5, text="× 10", sub="más barato prevenir")
B("Entre el cimiento y la primera hilada de ladrillos", "w:under", "portal")
ON("dpc", "Entre el cimiento y la primera hilada de ladrillos", "Que el piso de adentro quede")
O("como una U acostada", "tag", 4.0, pt="dpc", text="LA CAPA AISLADORA EN U", col="#3fd17a")
B("Que no quede cortada en ningún lado", "img:ob_capa")
O("Que el piso de adentro quede por lo menos 15 centímetros", "chips", 9.0, items=["PISO +15 cm", "VEREDA HACIA AFUERA", "CANALETA LEJOS"])
B("Que la vereda alrededor tenga pendiente para afuera", "w:patio", "portal")
EV("away", "Que la vereda alrededor tenga pendiente para afuera", 7)
B("pregúntele por la capa aisladora", "img:ob_pregunta")
# ======================= PREGUNTAS =======================
B("Me hacen siempre las mismas preguntas", "img:q_comentarios", "fade")
O("Sirve poner sal gruesa o arroz", "comment", 4.0, text="¿Sirve sal gruesa o arroz para chupar la humedad?")
B("Sirve poner sal gruesa o arroz", "img:qq_arroz")
O("Y un deshumidificador", "comment", 3.5, text="¿Y un deshumidificador?")
O("Puedo pintar con pintura antihumedad", "comment", 4.0, text="¿Pintura antihumedad?")
O("Cuánto cuesta todo", "chips", 14.0, items=["1 · AFUERA: < $20", "2 · REVOQUE: $30-40", "3 · BARRERA: $40-80"])
B("Una empresa le cobra muchas veces eso", "img:qq_empresa")
# ======================= MAS PREGUNTAS =======================
B("y si hago las tres soluciones juntas", "w:wall", "fade")
O("y si hago las tres soluciones juntas", "comment", 4.0, text="¿Y si hago las tres juntas, por las dudas?")
B("Marque con un lápiz, en la pared, hasta dónde llega hoy", "img:mp_lapiz")
B("Y si alquilo", "img:mp_alquila")
O("Y si alquilo", "comment", 3.5, text="¿Y si alquilo?")
B("Y el moho que sale con la humedad", "img:mp_moho")
EV("mold", "Y el moho que sale con la humedad", 5)
B("se puede pintar el exterior para que no entre", "w:out", "portal")
# ======================= REGANCHO 2 =======================
B("Ya casi terminamos, pero le debo lo más importante", "w:wide", "fade")
B("Es lo que hicimos en la franja pegada a la pared", "w:trench", "portal")
# ======================= FINAL CARMEN =======================
B("Volví a la casa de Doña Carmen cuatro meses después", "img:fc_vuelve", "fade")
B("La mancha del dormitorio había bajado a menos de 20", "w:wall", "portal")
KF(WET, "Volví a la casa de Doña Carmen cuatro meses después", 0.4); KF(WET, "La mancha del dormitorio había bajado a menos de 20", 0.18); KF(WET, "y pintamos con pintura a la cal", 0.0)
B("Picamos lo que quedaba flojo abajo", "img:fc_pica")
B("pintamos con pintura a la cal", "img:fc_pinta")
EV("paint", "pintamos con pintura a la cal", 6)
B("Sacamos el zócalo de cerámica y pusimos uno de madera", "w:base", "portal")
EV("zocwood", "Sacamos el zócalo de cerámica y pusimos uno de madera", 9999)
B("Y la cajita enchufada la desenchufamos", "img:fc_cajita")
O("entre el caño de la canaleta, la piedra", "receipt", 24.0, title="EL ARREGLO", rows=[
    {"at": "entre el caño de la canaleta", "item": "caño de canaleta", "$": 8},
    {"at": "la piedra", "item": "piedra partida", "$": 12},
    {"at": "la cal, el cemento, la arena", "item": "cal, cemento, arena", "$": 32},
    {"at": "y la pintura", "item": "pintura a la cal", "$": 40}], totalAt="gastamos 92 dólares")
B("Doña Carmen había gastado más de", "img:fc_carmen")
O("Doña Carmen había gastado más de", "chips", 5.0, items=["ANTES: +$600", "AHORA: $92"])
B("el dormitorio ya no huele a humedad", "img:fc_hija")
# ======================= ULTIMO =======================
B("Y la solución que casi nadie conoce es ésta", "w:trench", "fade")
O("Se llama la zanja de grava", "big", 3.5, text="LA ZANJA DE GRAVA", size=100)
B("se cava una zanja de unos 30 centímetros de ancho", "img:ul_cava")
O("se cava una zanja de unos 30 centímetros de ancho", "chips", 7.0, items=["30 cm DE ANCHO", "40-50 cm DE HONDO", "NUNCA BAJO EL CIMIENTO"])
B("El fondo de la zanja se hace con un poquito de pendiente", "w:trench", "portal")
EV("gravel", "Y se llena con piedra partida o grava gruesa", 9999)
B("Y se llena con piedra partida o grava gruesa", "img:ul_grava")
B("en vez de quedarse pegada a la pared en la tierra mojada", "w:trench", "cut")
EV("rain", "El agua de la lluvia y del riego", 8)
O("La base de la pared queda al aire", "tag", 4.0, pt="trench", text="LA BASE AL AIRE", col="#3fd17a")
B("Un par de bolsas de piedra, una pala, y un sábado", "img:ul_claudio")
O("Casi nadie la hace porque no se ve", "big", 4.0, text="«Lo que no se ve, no se cobra»", size=72)
# ======================= RECAP =======================
B("Le hago el resumen en un minuto", "bk", "zoom")
O("Le hago el resumen en un minuto", "recap", 70.0, rows=[
    {"at": "La capilaridad es agua que sube de la tierra", "tx": "Agua que sube de la tierra"},
    {"at": "Confírmelo con el aluminio", "tx": "Confirmar con el aluminio"},
    {"at": "No la tape por dentro", "tx": "Impermeable, cerámica, cajitas, cemento puro", "no": True},
    {"at": "Primera solución, afuera", "tx": "1 · Afuera + la zanja de grava"},
    {"at": "Segunda, el revoque que respira", "tx": "2 · Revoque que respira"},
    {"at": "Tercera, sólo si hace falta", "tx": "3 · Barrera a 15 cm, cada 10-12"},
    {"at": "confírmelo con la bolsa de plástico", "tx": "Bolsa de plástico + pintura que respire"}])
# ======================= CIERRE =======================
B("Si este arreglo le sirvió", "w:wide", "fade")
B("en el Manual del Albañil tiene 65 más", "w:book", "portal")
PG("en el Manual del Albañil tiene 65 más", "al001", 14)
O("en el Manual del Albañil tiene 65 más", "qr", 10.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="66 arreglos · link en la 1ª línea de la descripción")
B("la condensación, la del moho en las esquinas", "img:zz_condensacion")
O("Y déjeme en los comentarios hasta dónde le llega la mancha", "comment", 5.0, text="¿Hasta dónde le llega la mancha y qué hay del otro lado? 👇")
O("Yo leo todos", "chips", 5.0, items=["🔔 SUSCRÍBASE", "PRÓXIMO: LA CONDENSACIÓN"])
B("Soy Claudio, treinta años de albañil", "w:wide", "zoom")

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
    if g["k"] == "img" and b - g["a"] > 8.5: add.append({"a": round(g["a"] + 6.0, 2), "k": "w", "view": "base" if i % 2 else "wall", "tr": "portal"})
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
