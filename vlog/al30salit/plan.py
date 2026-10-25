# al30salit · plan del video ENTERO anclado a la voz. Cada plano, pieza y evento del mundo 3D se ancla a la frase que
# se dice en ese segundo (at() sobre words.json) → segs.json, ov.json, cam.json, ev.json, avail.json en src/al30salit.
# Las ventanas del avatar las manda avwin.json (av_temprano): ahí la base es el avatar, y al salir se vuelve al mundo.
import json, os, re, subprocess, unicodedata, sys

R = "D:/wt/al30salit/"
S = R + "src/al30salit/"
PUB = R + "public/al30salit/"
W = json.load(open(S + "words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
WAV = R + "public/al30salitcut.wav"

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

# ---------------- vistas del mundo (el pasillo de Don Julio: la pared con sal, el caño adentro, el medidor afuera) ----------------
V = {
    "wide": ([0.2, 1.45, -3.4], [0, 0.7, 0], 40), "wall": ([0, 0.75, -1.7], [0, 0.6, -0.15], 38),
    "base": ([0.3, 0.35, -1.05], [0.2, 0.2, -0.15], 34), "salt": ([0.55, 0.3, -0.7], [0.5, 0.15, -0.15], 28),
    "test": ([-1.3, 1.1, -0.85], [-1.35, 1.05, -0.15], 30), "pick": ([-0.6, 0.7, -1.4], [-0.6, 0.5, -0.15], 36),
    "cut": ([-3.6, 0.9, 0.2], [-2, 0.2, 0.1], 36), "under": ([-3.2, 0.1, 0.4], [-2, -0.4, 0.1], 36),
    "out": ([0.4, 1.5, 3.6], [0, 0.3, 0.4], 40), "soil": ([0.6, 0.75, 1.9], [0, 0.15, 0.5], 34),
    "spout": ([2.2, 0.9, 1.6], [1.25, 0.3, 0.4], 34), "patio": ([1.5, 1.8, 4.2], [0, 0, 1.6], 42),
    "book": ([1.55, 1.22, -1.32], [1.55, 0.74, -1.75], 30), "xray": ([-0.4, 0.8, -1.9], [-0.2, 0.45, 0], 38),
    "pipe": ([0.9, 0.75, -1.0], [0.6, 0.45, 0], 34), "meter": ([-0.85, 0.75, 2.6], [-1.4, 0.05, 1.9], 32),
}
PTV = {"wall": "wall", "base": "base", "salt": "salt", "test": "test", "pick": "pick", "cut": "cut", "under": "found",
       "out": "wall", "soil": "soil", "spout": "spout", "patio": "slope", "book": "book", "xray": "stain", "pipe": "pipe", "meter": "meter"}

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

WET.append([0, 0.55]); SOIL.append([0, 0.1])
# el salitre está a la vista casi todo el video, hasta que deja de salir
ON("salt", "hay un polvito blanco que parece sal", "En la octava, ya no salió nada")
ON("leak", "Usted está ahí, agachado frente a la pared", "Llamamos a un plomero")
# ======================= GANCHO =======================
B("Usted está ahí, agachado frente a la pared", "img:h_espatula", "fade")
B("hay un polvito blanco que parece sal", "w:salt", "portal")
O("unas pelusas blancas que crecen como si fueran algodón", "tag", 3.5, pt="salt", text="SALITRE", col="#e9e3d0")
EV("peel", "y la pintura levantada en escamas", 8)
B("raspa fuerte, pasa un trapo mojado", "img:h_trapo")
B("a la semana el polvo blanco está otra vez ahí", "w:base", "portal")
KF(WET, "a la semana el polvo blanco está otra vez ahí", 0.55); KF(WET, "Más grande", 0.8)
O("Más blanco. Más alto. Más grande", "chips", 4.0, items=["MÁS BLANCO", "MÁS ALTO", "MÁS GRANDE"])
O("No raspe así", "stamp", 2.6, text="NO RASPE ASÍ", col="#ff4a3d", rot=-8)
B("Ese polvo no es suciedad, es un aviso", "img:h_aviso")
B("la prueba de una gota de agua", "img:h_cuchara")
O("le dice en diez segundos si es salitre", "big", 3.0, text="10 SEGUNDOS", sub="la prueba de la gota")
B("los cinco errores que lo hacen salir más blanco", "img:h_errores")
B("cuesta lo que cuesta un lápiz", "w:test", "portal")
O("cuesta lo que cuesta un lápiz", "big", 3.4, text="✏️ UN LÁPIZ", sub="y sabe si el salitre se va o gana")
KF(WET, "Soy Claudio. Treinta años de albañil", 0.55)
# ======================= PRESENTACION =======================
O("Soy Claudio. Treinta años de albañil", "lower", 5.0, name="CLAUDIO", l2="Albañil · 30 años de oficio")
B("Aprendí el oficio con Don Ramiro", "img:p_ramiro", "fade")
B("Una semana entera, en el sótano de una casa vieja", "img:p_sotano")
B("Yo pensaba que era un castigo", "img:p_cepilla_joven")
O("el salitre no es el problema, es el mensajero", "big", 4.5, text="«No es el problema: es el mensajero»", size=64)
B("sigo pensando en eso cada vez que veo una pared blanca", "w:wall", "zoom")
# ======================= CTA1 =======================
B("lo escribí en un manual", "img:c_escribe", "fade")
B("Se llama el Manual del Albañil", "w:book", "portal")
PG("Se llama el Manual del Albañil", "al001", 28)
O("Son 66 arreglos de la casa", "chips", 5.0, items=["66 ARREGLOS", "LISTA DE FERRETERÍA", "MEDIDAS Y PASOS"])
O("el que viene a rasquetear y pintar esa pared", "price", 6.5, gAt=None)
B("están en la página once", "w:book", "cut")
PG("están en la página once", "al011", 20)
MK("están en la página once", 7, [0.07, 0.43, 0.93, 0.53])
O("o escanee este código con la cámara", "qr", 9.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="Página 11 · el salitre")
B("Y ahora sí, vamos a la pared", "w:wide", "swipeR")
# ======================= LA CASA =======================
B("Hace un tiempo me llamó un señor", "img:r_telefono", "fade")
B("vive en una casa de esquina con un pasillo largo", "img:r_pasillo")
O("tengo un polvo blanco en el pasillo", "comment", 4.0, text="«Ya lo raspé, lo lavé, lejía, vinagre… y sale más»")
B("Ya lo raspé, ya lo lavé", "img:r_productos")
B("El pasillo tenía las dos paredes blancas de sal", "w:wall", "portal")
KF(WET, "El pasillo tenía las dos paredes blancas de sal", 0.9)
O("hasta la altura de la cintura", "tag", 4.0, pt="stain", text="HASTA LA CINTURA", col="#ff4a3d")
B("eran como bigotes blancos", "img:r_bigotes")
B("el revoque se deshacía en arenita", "img:r_arenita")
B("una línea de polvo blanco, como si alguien hubiera echado harina", "w:salt", "portal")
# ======================= LA HISTORIA =======================
B("Don Julio me contó la historia completa", "img:r_julio_cuenta", "fade")
B("raspaba ese pasillo con una espátula", "img:r_domingo")
O("Todos los domingos, desde hacía dos años", "chips", 6.0, items=["DOMINGO: RASPA", "MIÉRCOLES: VUELVE", "× 2 AÑOS"])
B("le vendió un sellador antisalitre", "img:r_sellador")
O("encima 210 dólares", "big", 3.4, text="$210", sub="sellador + pintura")
B("la pintura nueva salió entera en escamas", "w:base", "portal")
EV("peel", "la pintura nueva salió entera en escamas", 7)
O("el salitre al principio llegaba hasta la rodilla", "chips", 6.0, items=["ANTES: LA RODILLA", "AHORA: LA CINTURA"])
B("Cuanto más lo limpiaba, más alto subía", "w:xray", "iris")
EV("xray", "Cuanto más lo limpiaba, más alto subía", 7)
# ======================= QUE ES =======================
B("Le explico qué es el salitre", "w:wall", "fade")
O("El salitre es sal", "big", 3.0, text="ES SAL", size=130)
B("Sales minerales que vienen disueltas en el agua", "w:cut", "portal")
ON("xray", "Puede ser el agua de la tierra", "El salitre no es el problema. Es la prueba")
O("Puede ser el agua de la tierra", "chips", 8.0, items=["LA TIERRA", "LA LLUVIA", "UN CAÑO QUE PIERDE"])
B("llega a la superficie, y ahí se evapora", "w:xray", "cut")
B("cuando usted deja una olla con agua salada al fuego", "img:q_olla")
B("cada pelusa blanca que ve en la pared", "w:salt", "portal")
O("es la marca de un litro de agua", "tag", 4.0, pt="salt", text="1 PELUSA = AGUA QUE PASÓ", col="#8fd6ff")
# ======================= POR QUE ROMPE =======================
B("Y además de feo, el salitre rompe", "img:pr_escamas", "fade")
B("Cuando la sal se seca, forma cristalitos", "img:pr_cristales")
B("pero si se forman un poquito adentro", "w:base", "portal")
EV("blister", "pero si se forman un poquito adentro", 14)
O("al crecer empujan como cuñas", "tag", 4.0, pt="blister", text="CRISTALES = CUÑAS", col="#ff4a3d")
B("usted pasa el dedo y el revoque se le desarma", "img:pr_dedo")
O("Es un martillito que nunca para", "big", 3.5, text="UN MARTILLITO QUE NO PARA", size=90)
# ======================= PRUEBA GOTA =======================
B("antes de hacer nada, hay que estar seguro", "w:salt", "fade")
O("La prueba es la de la gota de agua", "timer", 4.5, label="10 s", sub="la prueba de la gota")
B("Agarre un poquito de ese polvo blanco", "img:g_cuchillo")
B("póngalo en una cuchara, y échele una gota", "img:g_gota")
O("Si el polvo se disuelve y desaparece", "diag", 30.0, items=[
    {"at": "Si el polvo se disuelve y desaparece", "sw": "SE DISUELVE", "tx": "como azúcar en el café", "res": "SALITRE", "ok": True},
    {"at": "Si el polvo no se disuelve", "sw": "QUEDA BARRITO", "tx": "blanco en el fondo", "res": "CAL VIEJA", "ok": True},
    {"at": "Si lo que tiene en la cuchara son pelusas", "sw": "PELUSAS + ENCIERRO", "tx": "no se deshacen", "res": "MOHO BLANCO", "ok": False}])
B("Si el polvo no se disuelve", "img:g_barrito")
B("eso no es salitre: es moho blanco", "img:g_moho")
B("En la casa de Don Julio, el polvo desapareció", "img:g_desaparece")
# ======================= OTRA PRUEBA =======================
B("hay una segunda prueba que le dice algo todavía más importante", "w:wall", "fade")
B("Si su casa es nueva", "img:o_obra")
B("El cemento, la arena y el ladrillo nuevos traen sales", "img:o_ladrillos")
O("Pasa en casi todas las obras nuevas", "chips", 5.0, items=["OBRA NUEVA", "SE VA SOLO", "CEPILLO EN SECO"])
B("Pero si la casa tiene años", "w:xray", "portal")
EV("xray", "Pero si la casa tiene años", 9)
O("Eso es agua que está entrando todos los días", "stamp", 3.0, text="ENTRA AGUA", col="#ff4a3d")
# ======================= ERROR UNO =======================
B("los cinco errores que lo hacen salir más blanco. El primero", "bk", "fade")
O("es lavarlo con agua", "err", 5.0, n=1, tx="LAVARLO CON AGUA")
B("usted la limpia con un trapo mojado", "img:e1_trapo")
B("El agua disolvió la sal", "w:xray", "iris")
EV("xray", "El agua disolvió la sal", 10)
O("la volvió a meter adentro de la pared", "tag", 4.0, pt="salt", text="LA SAL VUELVE ADENTRO", col="#8fd6ff")
B("Por eso a los tres días está otra vez", "img:e1_vuelve")
O("El salitre se saca siempre en seco. Siempre", "big", 3.5, text="SIEMPRE EN SECO", size=110)
# ======================= ERROR DOS =======================
B("El segundo error es rasparlo con fuerza", "img:e2_raspa", "fade")
O("El segundo error es rasparlo con fuerza", "err", 5.0, n=2, tx="RASPARLO CON FUERZA")
B("le saca la capita dura de afuera, abre los poros", "w:base", "portal")
B("Es como rascarse una herida", "img:e2_lija")
B("Lo que se hace es cepillar, no raspar", "img:e2_cepillo")
EV("brush", "Lo que se hace es cepillar, no raspar", 8)
O("de arriba hacia abajo, sin apretar", "chips", 5.0, items=["⬇ DE ARRIBA ABAJO", "SIN APRETAR", "SÓLO LO SUELTO"])
# ======================= ERROR TRES =======================
B("El tercer error es echarle ácido, vinagre o lejía", "img:e3_botellas", "fade")
O("El tercer error es echarle ácido, vinagre o lejía", "err", 5.0, n=3, tx="ÁCIDO, VINAGRE O LEJÍA")
B("El vinagre es un ácido suave", "img:e3_vinagre")
B("el ácido muriático, que mucha gente usa", "img:e3_muriatico")
B("en ladrillo visto de afuera, sin revoque", "img:e3_ladrillo_visto")
B("el ácido come el cemento, ablanda el revoque", "w:base", "portal")
O("Para el salitre por adentro, nada de líquidos", "chips", 5.0, items=["CEPILLO", "ASPIRADORA", "PACIENCIA"])
# ======================= REGANCHO 1 =======================
B("Antes de ver el cuarto error", "w:wide", "fade")
B("El salitre era mucho más alto en una pared que en la otra", "img:g1_dos_paredes")
O("En una llegaba a la rodilla", "chips", 5.0, items=["UNA: LA RODILLA", "OTRA: LA CINTURA"])
B("Algo pasaba del otro lado de una de ellas", "w:xray", "portal")
EV("xray", "Algo pasaba del otro lado de una de ellas", 8)
B("con el medidor del agua", "w:meter", "portal")
EV("meter", "con el medidor del agua", 6)
# ======================= ERROR CUATRO =======================
B("El cuarto error es tapar el salitre con pintura", "img:e4_sellador", "fade")
O("El cuarto error es tapar el salitre con pintura", "err", 5.0, n=4, tx="TAPARLO CON PINTURA O SELLADOR")
B("Y quedó preciosa, dos meses", "img:e4_preciosa")
B("la sal se quedó justo debajo de la pintura", "w:base", "portal")
EV("blister", "la sal se quedó justo debajo de la pintura", 12); EV("peel", "Levantaron la pintura entera", 7)
B("es como ponerle una tapa a una olla hirviendo", "img:e4_olla_tapa")
# ======================= ERROR CINCO =======================
B("Y el quinto error, el que más gente hace", "img:e5_prolijo", "fade")
O("Y el quinto error, el que más gente hace", "err", 5.0, n=5, tx="LIMPIAR Y NADA MÁS")
O("Se arregla cortando el agua", "big", 3.5, text="CORTAR EL AGUA", size=110)
B("como secar el piso debajo de una llave que gotea", "img:e5_canilla")
B("Don Julio llevaba dos años limpiando", "img:e5_julio_cepilla")
B("hay tres lugares donde buscar", "w:wide", "zoom")
# ======================= TRES LUGARES =======================
B("El primero es el suelo", "w:cut", "fade")
O("El primero es el suelo", "step", 4.0, n="1", tx="EL SUELO · CAPILARIDAD")
EV("xray", "el agua de la tierra sube por los ladrillos", 9)
B("como sube el café por un terrón de azúcar", "img:t_terron")
B("El segundo es la lluvia", "w:spout", "portal")
EV("rain", "El segundo es la lluvia", 8)
O("El segundo es la lluvia", "step", 4.0, n="2", tx="LA LLUVIA")
B("Y el tercero, el que nadie busca, es una cañería", "w:pipe", "portal")
ON("xray", "Y el tercero, el que nadie busca, es una cañería", "Ése era el de Don Julio")
O("Y el tercero, el que nadie busca, es una cañería", "step", 4.0, n="3", tx="UN CAÑO QUE PIERDE")
O("Un caño de agua o un desagüe que pierde", "tag", 4.0, pt="pipe", text="LA FUGA", col="#59b8ff")
O("aunque no llueva, aunque sea verano", "chips", 5.0, items=["SIN LLUVIA", "EN VERANO", "NO PARA NUNCA"])
# ======================= PRUEBA MEDIDOR =======================
B("La prueba del medidor es así", "img:m_llaves", "fade")
O("Cierre todas las llaves de agua de la casa", "step", 4.0, n="1", tx="TODAS LAS LLAVES CERRADAS")
B("que no esté funcionando la lavadora", "img:m_lavadora")
B("vaya al medidor del agua", "w:meter", "portal")
ON("meter", "vaya al medidor del agua", "y muchas veces ese caño está justo adentro")
O("Anote el número, o haga una marca", "step", 4.0, n="2", tx="ANOTE EL NÚMERO")
B("haga una marca con un marcador en la ruedita", "img:m_marca")
O("Espere 30 minutos sin usar nada de agua", "timer", 5.0, label="30 MIN", sub="sin usar agua")
B("Si el número cambió o la ruedita se movió", "w:meter", "cut")
O("Una fuga", "stamp", 2.6, text="FUGA", col="#ff4a3d")
B("Puede ser un depósito del inodoro que pierde", "img:m_inodoro")
B("la fuga está en un caño", "w:pipe", "portal")
# ======================= DON JULIO CAÑO =======================
B("En la casa de Don Julio, el medidor se movió", "w:meter", "fade")
EV("meter", "En la casa de Don Julio, el medidor se movió", 6)
B("donde pasaba el caño que lleva el agua al fregadero", "img:j_fregadero")
B("Ese caño era de hierro galvanizado", "w:pipe", "portal")
EV("xray", "Ese caño era de hierro galvanizado", 18)
O("Ese caño era de hierro galvanizado", "tag", 4.0, pt="pipe", text="HIERRO GALVANIZADO", sub="una gota, adentro de la pared", col="#59b8ff")
B("el ladrillo subía el agua hasta la cintura", "w:xray", "cut")
B("Llamamos a un plomero, que cambió un metro de caño", "img:j_plomero")
O("caño 120 dólares", "big", 3.4, text="$120", sub="1 metro de caño")
# ======================= REVISAR AFUERA =======================
B("Si el medidor no se mueve", "w:meter", "fade")
B("hay que mirar afuera, del otro lado de la pared", "bk", "zoom")
O("Uno: si hay tierra, una jardinera", "routine", 40.0, hl=None, rows=[
    {"at": "Uno: si hay tierra, una jardinera", "when": "1", "what": "Tierra apoyada, más alta que el piso", "ic": "🪴"},
    {"at": "Dos: si la canaleta del techo descarga", "when": "2", "what": "Canaleta que descarga al pie", "ic": "🌧️"},
    {"at": "Tres: si la acera o el patio tienen la pendiente", "when": "3", "what": "Pendiente hacia la casa", "ic": "📐"},
    {"at": "Cuatro: si hay una llave de agua", "when": "4", "what": "Llave, lavadero o manguera que gotea", "ic": "🚰"},
    {"at": "Cinco: si hay pasto, enredaderas", "when": "5", "what": "Enredaderas: sombra y humedad", "ic": "🌿"}])
B("Uno: si hay tierra, una jardinera", "w:soil", "portal")
KF(SOIL, "Uno: si hay tierra, una jardinera", 0.1); KF(SOIL, "Dos: si la canaleta del techo descarga", 0.1)
B("Dos: si la canaleta del techo descarga", "w:spout", "cut")
EV("rain", "Dos: si la canaleta del techo descarga", 6)
B("Tres: si la acera o el patio tienen la pendiente", "w:patio", "cut")
EV("slope", "Tres: si la acera o el patio tienen la pendiente", 7)
B("Cuatro: si hay una llave de agua", "img:v_llave")
B("Cinco: si hay pasto, enredaderas", "img:v_enredadera")
# ======================= LA RUTINA =======================
B("Ahora le doy la rutina completa", "bk", "fade")
O("Paso uno: la gota de agua", "recap", 62.0, rows=[
    {"at": "Paso uno: la gota de agua", "tx": "1 · La gota: ¿es salitre?"},
    {"at": "Paso dos: la prueba del medidor", "tx": "2 · El medidor: ¿hay fuga?"},
    {"at": "Paso tres: mirar afuera", "tx": "3 · Afuera: las 5 cosas"},
    {"at": "Paso cuatro: cortar el agua", "tx": "4 · Cortar el agua"},
    {"at": "Paso cinco: cepillar en seco", "tx": "5 · Cepillar en seco"},
    {"at": "Paso seis: aspirar o barrer", "tx": "6 · Aspirar y a la basura"},
    {"at": "Paso siete: esperar y vigilar", "tx": "7 · Esperar y vigilar"},
    {"at": "Y paso ocho, sólo cuando ya no sale más", "tx": "8 · Revoque + pintura que respire"}])
B("Paso cinco: cepillar en seco", "w:salt", "portal")
EV("brush", "Paso cinco: cepillar en seco", 5)
B("Don Julio hacía sólo el cinco", "img:u_julio_domingo")
# ======================= FERRETERIA =======================
B("para que no le vendan lo que no necesita", "img:k_ferreteria", "fade")
O("necesito un cepillo de cerdas duras", "kit", 30.0, items=[
    {"at": "necesito un cepillo de cerdas duras", "ic": "🧹", "tx": "cepillo de cerdas duras"},
    {"at": "un cepillo de alambre de bronce suave", "ic": "🪥", "tx": "cepillo de bronce suave"},
    {"at": "una mascarilla para polvo", "ic": "😷", "tx": "mascarilla + anteojos"},
    {"at": "una bolsa de cemento, una bolsa de cal", "ic": "🧱", "tx": "cemento, cal, arena"},
    {"at": "un litro de hidrófugo para mortero", "ic": "🧴", "tx": "1 L hidrófugo"},
    {"at": "un litro de fijador sellador al agua", "ic": "🪣", "tx": "fijador + pintura al agua"},
    {"at": "Si el vendedor le ofrece un sellador antisalitre", "ic": "🚫", "tx": "sellador antisalitre", "no": True}])
B("Si el vendedor le ofrece un sellador antisalitre", "img:k_vendedor")
B("Herramientas: un martillo", "img:k_herramientas")
# ======================= CEPILLADO =======================
B("Le explico bien cómo se cepilla", "img:cp_mascarilla", "fade")
B("Ponga un plástico o un diario en el piso", "img:cp_diario")
B("Use un cepillo de cerdas duras", "w:salt", "portal")
ON("brush", "Use un cepillo de cerdas duras", "Cuando termine, pase la aspiradora")
O("Cepille de arriba hacia abajo", "tag", 4.0, pt="salt", text="⬇ SIEMPRE HACIA ABAJO", col="#3fd17a")
B("pase la aspiradora por la pared y por el piso", "img:cp_aspira")
B("Nunca lo barra hacia el patio ni lo eche en una maceta", "img:cp_maceta")
O("Nunca lo barra hacia el patio ni lo eche en una maceta", "stamp", 3.0, text="NUNCA A LA MACETA", col="#ff4a3d")
# ======================= CTA2 =======================
B("Y aquí le quiero mostrar algo", "w:book", "fade")
PG("Y aquí le quiero mostrar algo", "al011", 40)
MK("Con una caja negra que dice lo que usted tiene que pedir", 9, [0.07, 0.54, 0.93, 0.585])
MK("Son 66 arreglos así", 7, [0.07, 0.68, 0.93, 0.82], "#3fd17a")
B("paredes, techos, pisos, azulejos", "img:g2_manual")
O("Cada uno con materiales de uno o dos dólares", "price", 6.5, gAt=None)
O("o escanee este código con la cámara del teléfono. Y sigamos", "qr", 9.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="Página 11 · el salitre")
B("Y sigamos, porque ahora viene cuánto tiempo", "w:book", "cut")
# ======================= CUANTO ESPERAR =======================
B("Ya cortó el agua y ya cepilló", "w:salt", "fade")
O("el salitre va a seguir saliendo un tiempo", "stamp", 3.0, text="ES BUENA SEÑAL", col="#3fd17a")
B("la pared tiene años de agua y de sal guardadas", "w:xray", "portal")
EV("xray", "la pared tiene años de agua y de sal guardadas", 10)
KF(WET, "la pared tiene años de agua y de sal guardadas", 0.9); KF(WET, "Don Julio cepilló siete semanas", 0.35)
B("cada vez va a ser menos", "img:ce_menos")
O("Usted cepilla en seco una vez por semana", "weeks", 8.0, per=1.0, max=8)
B("Don Julio cepilló siete semanas", "w:wall", "portal")
O("En la octava, ya no salió nada", "big", 3.0, text="SEMANA 8", sub="ni una pelusa")
# ======================= SECAR RAPIDO =======================
B("hay cosas que ayudan a que la pared se seque", "img:sr_ventanas", "fade")
O("Abra las ventanas de ese ambiente todos los días", "chips", 24.0, items=["½ HORA DE VENTANAS", "MUEBLES A 10 cm", "VENTILADOR CHICO", "DESHUMIDIFICADOR ✓", "✗ ESTUFA PEGADA"])
B("Separe los muebles de esa pared", "img:sr_muebles")
B("deje un ventilador chico apuntando a la pared", "img:sr_ventilador")
B("Si tiene un deshumidificador", "img:sr_deshumi")
B("no ponga estufas ni calefactores pegados", "img:sr_estufa")
B("La pared se seca de a poco", "w:wall", "zoom")
# ======================= PISO PATIO =======================
B("el piso al pie de la pared", "w:base", "fade")
B("Mire bien dónde se junta más salitre en el piso", "img:pp_rincon")
O("Si es en un rincón", "diag", 22.0, items=[
    {"at": "Si es en un rincón", "sw": "EN UN RINCÓN", "tx": "más sal en un punto", "res": "UN CAÑO CERCA", "ok": False},
    {"at": "Si es parejo a lo largo de toda la pared", "sw": "PAREJO", "tx": "toda la pared igual", "res": "SUBE DEL SUELO", "ok": False},
    {"at": "Y si está justo debajo de una ventana", "sw": "BAJO LA VENTANA", "tx": "el alféizar", "res": "LLUVIA", "ok": False}])
B("Y si está justo debajo de una ventana", "img:pp_ventana")
B("Afuera, en el patio, haga lo mismo", "w:out", "portal")
O("si el salitre de afuera está más alto", "chips", 6.0, items=["MÁS ALTO AFUERA → AGUA DE AFUERA", "MÁS ALTO ADENTRO → AGUA DE ADENTRO"])
# ======================= REPARAR =======================
B("toca reparar el revoque que quedó dañado", "w:pick", "fade")
B("Golpee la pared con el mango de un martillo", "img:rp_golpea")
O("Donde suena seco, el revoque está sano", "chips", 5.0, items=["SECO = SANO", "HUECO = SE PICA"])
B("Marque con una tiza todo lo que suena hueco", "img:rp_tiza")
B("píquelo con un cortafierro", "w:pick", "portal")
ON("pick", "píquelo con un cortafierro", "Y revoque en dos capas")
O("siguiendo treinta centímetros más arriba", "tag", 4.0, pt="pick", text="+30 cm", col="#ffd60a")
B("Y revoque en dos capas", "img:rp_revoca")
EV("render1", "Y revoque en dos capas", 9999)
O("un balde de cemento y tres de arena fina", "big", 3.5, text="1 : 3", sub="cemento : arena + hidrófugo en el agua")
O("Espere tres o cuatro semanas antes de pintar", "weeks", 5.0, per=1.1, max=4)
# ======================= VIEJO NUEVO =======================
B("cómo sé yo si el salitre que estoy viendo es viejo o es nuevo", "w:salt", "fade")
B("Pase la yema del dedo por la mancha", "img:vn_dedo")
O("Si el polvito sale suelto, seco", "diag", 26.0, items=[
    {"at": "Si el polvito sale suelto, seco", "sw": "SUELTO Y SECO", "tx": "revoque duro abajo", "res": "VIEJO · se cepilla", "ok": True},
    {"at": "Pero si el polvito está pegado, húmedo", "sw": "PEGADO Y HÚMEDO", "tx": "revoque frío, se desarma", "res": "NUEVO · entra agua", "ok": False}])
B("Pero si el polvito está pegado, húmedo", "img:vn_humedo")
B("Otra cosa que miro es el borde de la mancha", "w:wall", "portal")
O("Si el borde tiene como una aureola más oscura", "tag", 4.0, pt="stain", text="AUREOLA = CRECE", col="#ff4a3d")
B("a la mañana temprano, cuando la casa está fresca", "img:vn_manana")
# ======================= REVOQUE CAL =======================
B("un truco de los de antes", "img:rc_ramiro", "fade")
O("Una parte de cemento, una de cal y cinco o seis de arena", "big", 3.8, text="1 : 1 : 5-6", sub="cemento : cal : arena")
B("El revoque con cal es más blando y más poroso", "w:pick", "portal")
EV("lime", "El revoque con cal es más blando y más poroso", 9999); EV("render2", "El revoque con cal es más blando y más poroso", 9999)
B("le decían revoque de sacrificio", "img:rc_cal")
O("le decían revoque de sacrificio", "big", 3.5, text="REVOQUE DE SACRIFICIO", size=96)
B("en una casa de adobe o de ladrillo muy viejo", "img:rc_adobe")
# ======================= LO QUE NUNCA =======================
B("lo que Don Ramiro nunca hacía con el salitre", "img:n_ramiro", "fade")
O("Nunca lo lavaba con agua", "chips", 30.0, items=["✗ LAVARLO", "✗ PINTAR ESA SEMANA", "✗ ESMALTE", "✗ ZÓCALO CERÁMICO", "✗ A LAS MACETAS"])
B("Nunca usaba pintura plástica brillante", "img:n_esmalte")
B("Nunca ponía zócalo de cerámica", "w:base", "portal")
EV("zoc", "Nunca ponía zócalo de cerámica", 6)
B("Nunca echaba el salitre en las macetas", "img:n_macetas")
O("te está vendiendo algo para el mensajero", "big", 4.5, text="«Al ladrón hay que buscarlo en otro lado»", size=64)
# ======================= PINTURA =======================
B("Cuando la pared ya no saca salitre", "w:wall", "fade")
B("Primero, un fijador sellador al agua", "img:pi_fijador")
EV("paint", "una mano pareja en toda la pared", 6)
B("dos manos de pintura al agua, mate", "img:pi_rodillo")
O("dos manos de pintura al agua, mate", "timer", 4.0, label="4 H", sub="entre mano y mano")
B("es una maravilla", "img:pi_cal")
O("Lo que nunca: esmalte, pintura impermeable", "chips", 5.0, items=["✗ ESMALTE", "✗ IMPERMEABLE ADENTRO", "✗ ANTISALITRE"])
# ======================= VARIANTES =======================
B("no todas las paredes son iguales", "w:wide", "fade")
B("en una pared de ladrillo visto, por afuera", "img:vr_ladrillo")
B("Si el salitre sale en el piso, entre las baldosas", "img:vr_baldosas")
B("Si sale en el techo, es agua de arriba", "img:vr_techo")
B("en la pared de un sótano", "img:vr_sotano")
# ======================= PREGUNTAS =======================
B("Me hacen siempre las mismas preguntas", "img:q_comentarios", "fade")
O("Sirve el bicarbonato", "comment", 4.0, text="¿Sirve el bicarbonato?")
O("Y la sal gruesa, para que chupe la humedad", "comment", 4.0, text="¿Y sal gruesa para que chupe la humedad?")
B("Y la sal gruesa", "img:qq_sal")
O("Puedo usar un deshumidificador", "comment", 4.0, text="¿Sirve un deshumidificador?")
O("Es peligroso respirar el salitre", "comment", 4.0, text="¿Es peligroso respirarlo?")
B("Irrita la nariz y la garganta", "img:qq_mascarilla")
O("Cuánto gasto", "receipt", 16.0, title="EL PASILLO", rows=[
    {"at": "Un cepillo, una mascarilla", "item": "cepillo + mascarilla", "$": 8},
    {"at": "un fijador y la pintura", "item": "fijador + pintura", "$": 22},
    {"at": "Si hay que revocar, sume cemento", "item": "revoque", "$": 20}], totalAt="El que lo raspa y pinta")
B("El que lo raspa y pinta le cobra más de cien", "img:qq_pintor")
# ======================= REGANCHO 2 =======================
B("Ya casi terminamos, pero le debo lo más importante", "w:wide", "fade")
B("el día exacto en que podía pintar", "img:g3_calendario")
# ======================= FINAL JULIO =======================
B("Volví a la casa de Don Julio diez semanas después", "img:fj_vuelve", "fade")
B("El medidor quieto", "w:meter", "portal")
B("Las dos paredes del pasillo ya no tenían ni una pelusa", "w:wall", "portal")
KF(WET, "Las dos paredes del pasillo ya no tenían ni una pelusa", 0.35); KF(WET, "Picamos la parte de abajo", 0.0)
B("Picamos la parte de abajo de la pared de la cocina", "img:fj_pica")
B("Fijador, y dos manos de pintura a la cal", "img:fj_pinta")
O("gastamos 185 dólares", "receipt", 22.0, title="EL ARREGLO", rows=[
    {"at": "En total, entre el plomero", "item": "plomero · caño", "$": 120},
    {"at": "el cemento, la cal, la arena", "item": "cemento, cal, arena", "$": 25},
    {"at": "el fijador y la pintura", "item": "fijador + pintura a la cal", "$": 40}], totalAt="gastamos 185 dólares")
B("Don Julio había gastado 210", "img:fj_julio")
O("Don Julio había gastado 210", "chips", 5.0, items=["ANTES: $210 + 2 AÑOS", "AHORA: $185, PARA SIEMPRE"])
B("me mandó una foto del pasillo", "img:fj_foto")
# ======================= ULTIMO =======================
B("Y el truco que no hace nadie es éste", "w:wall", "fade")
O("Se llama la marca del lápiz", "big", 3.5, text="LA MARCA DEL LÁPIZ", size=100)
B("agarre un lápiz y marque en la pared el borde de arriba", "img:ul_marca")
B("Y al lado, escriba la fecha", "img:ul_fecha")
B("Cada semana, después de cepillar", "img:ul_marcas")
O("Si las marcas van bajando", "chips", 7.0, items=["BAJAN → VA GANANDO", "QUIETAS O SUBEN → ENTRA AGUA"])
B("Si las marcas van bajando", "w:wall", "portal")
B("Si las marcas quedan en el mismo lugar o suben", "img:ul_suben")
O("dos semanas seguidas, ése es el día", "stamp", 3.0, text="ESE ES EL DÍA", col="#3fd17a")
B("Un lápiz. Ningún pintor lo hace", "img:ul_claudio")
# ======================= RECAP =======================
B("Le hago el resumen en un minuto", "bk", "zoom")
O("Le hago el resumen en un minuto", "recap", 75.0, rows=[
    {"at": "El salitre es sal que trae el agua", "tx": "Salitre = sal que trae el agua"},
    {"at": "la gota de agua en una cuchara", "tx": "La gota: salitre, cal o moho"},
    {"at": "Si la casa es nueva", "tx": "Casa nueva: cepillo y paciencia"},
    {"at": "la prueba del medidor", "tx": "Medidor: 30 min con todo cerrado"},
    {"at": "y la lista de afuera", "tx": "Afuera: tierra, canaleta, pendiente, llave"},
    {"at": "Cepille en seco, de arriba hacia abajo", "tx": "Cepillo en seco, hacia abajo"},
    {"at": "Nunca agua, nunca lejía", "tx": "Agua, lejía, vinagre, sellador", "no": True},
    {"at": "Marque con lápiz y fecha", "tx": "Lápiz y fecha cada semana"},
    {"at": "repare el revoque, mejor con cal", "tx": "Revoque con cal + pintura que respire"}])
# ======================= CIERRE =======================
B("Si este arreglo le sirvió", "w:wide", "fade")
B("en el Manual del Albañil tiene 65 más", "w:book", "portal")
PG("en el Manual del Albañil tiene 65 más", "al001", 14)
O("en el Manual del Albañil tiene 65 más", "qr", 10.0, page="al011", name="MANUAL DEL ALBAÑIL", pg="66 arreglos · link en la 1ª línea de la descripción")
B("las tres soluciones de verdad para la humedad que sube del piso", "img:zz_capilaridad")
O("Y déjeme en los comentarios hasta dónde le llega", "comment", 5.0, text="¿Hasta dónde le llega el salitre: rodilla, cintura o más? 👇")
O("Yo leo todos", "chips", 5.0, items=["🔔 SUSCRÍBASE", "PRÓXIMO: LA CAPILARIDAD"])
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
    if g["k"] == "img" and b - g["a"] > 8.5: add.append({"a": round(g["a"] + 6.0, 2), "k": "w", "view": "salt" if i % 2 else "wall", "tr": "portal"})
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
