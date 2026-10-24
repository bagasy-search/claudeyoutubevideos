# plo30taza · plan del video ENTERO anclado a la voz. Cada plano, pieza y evento del mundo 3D se ancla a la frase que
# se dice en ese segundo (at() sobre words.json) → segs.json, ov.json, cam.json, ev.json, avail.json en src/plo30taza.
# Las ventanas del avatar las manda avwin.json (av_temprano): ahí la base es el avatar, y al salir se vuelve al mundo.
import json, os, re, subprocess, unicodedata, sys

R = "D:/wt/plo30taza/"
S = R + "src/plo30taza/"
PUB = R + "public/plo30taza/"
W = json.load(open(S + "words.json", encoding="utf8"))
AVW = json.load(open(S + "avwin.json", encoding="utf8"))["win"]
WAV = R + "public/plo30tazacut.wav"

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

# ---------------- vistas del mundo ----------------
V = {
    "wide": ([1.5, 1.45, 1.1], [0, 0.5, -0.9], 40), "bowl": ([0.05, 1.25, -0.15], [0, 0.38, -0.8], 34),
    "bowlc": ([0.0, 0.95, -0.42], [0, 0.36, -0.82], 32), "side": ([1.05, 0.42, -0.95], [0, 0.25, -0.98], 34),
    "plug": ([0.55, 0.4, -1.05], [0, 0.34, -1.06], 26), "tank": ([0.55, 1.45, -0.75], [0, 0.85, -1.38], 34),
    "flap": ([0.22, 1.3, -1.05], [0, 0.65, -1.37], 30), "valve": ([-0.6, 0.45, -1.0], [-0.24, 0.16, -1.58], 32),
    "under": ([1.5, -0.3, 4.0], [1.3, -0.9, 1.4], 42), "chamber": ([3.2, 0.4, 2.7], [2.6, -0.75, 1.3], 36),
    "vent": ([0.6, 2.3, 4.4], [-1.6, 2.5, 1.45], 42), "kitchen": ([3.4, 1.45, 0.3], [3.5, 0.95, -1.15], 40),
    "mug": ([3.0, 1.25, -0.6], [3.0, 0.96, -1.12], 30), "kettle": ([3.5, 1.3, -0.55], [3.55, 1.0, -1.15], 30),
    "book": ([4.05, 1.55, -0.86], [4.05, 0.9, -1.12], 30), "bucket": ([1.1, 0.95, 0.25], [0.5, 0.2, -0.6], 36),
}
PTV = {"bowl": "bowl", "bowlc": "bowl", "side": "trap", "plug": "plug", "tank": "tank", "flap": "flapper", "valve": "valve",
       "under": "drain", "chamber": "chamber", "vent": "vent", "mug": "mug", "kettle": "kettle", "book": "book", "bucket": "bucket"}

BEATS, OVS, EVR, PLUG, LEVEL, PAGES, MARKS = [], [], {}, [], [], [], []
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

LEVEL.append([0, 0.55]); PLUG.append([0, 1])
# ======================= GANCHO =======================
B("Son las once de la noche", "img:h_visitas", "fade")
O("Son las once de la noche", "clock", 4.5, label="11:00 PM")
B("alguien acaba de salir del baño", "img:h_espera")
B("El agua de la taza está subiendo", "w:bowl", "portal")
KF(LEVEL, "El agua de la taza está subiendo", 0.55); KF(LEVEL, "Con papel flotando", 0.95)
O("Con papel flotando", "tag", 3.5, pt="bowl", text="EL AGUA SUBE", col="#ff4a3d")
B("con la mano todavía en la palanca", "img:h_palanca")
B("si le doy otra vez a la cadena", "img:h_sube")
O("No le des", "stamp", 2.6, text="NO LE DES", col="#ff4a3d", rot=-8)
B("Esa segunda descarga es la que inunda", "img:e_desborda")
B("ir a la cocina y traer una sola taza", "w:kitchen", "swipeL")
B("algo que ya tienes junto al fregadero", "w:mug", "cut")
B("Y un balde de agua caliente", "img:h_balde_cal")
O("Sin destapacaños, sin químicos", "chips", 4.0, items=["SIN DESTAPACAÑOS", "SIN QUÍMICOS", "SIN LLAMAR A NADIE"])
B("En 8 de cada 10 inodoros", "img:h_taza_det")
O("En 8 de cada 10 inodoros", "big", 3.4, text="8 DE 10", sub="inodoros tapados")
B("la receta exacta, con las medidas", "img:h_baja")
B("qué hacer en esos dos casos", "w:wide", "zoom")
B("un movimiento que hacemos los plomeros", "img:h_tapa_tanque")
B("Ese último no lo hace casi nadie", "w:tank", "portal")
EV("tank", "Ese último no lo hace casi nadie", 4.5)
# ======================= PRESENTACION =======================
O("Ya me conoces, soy Claudio", "lower", 5.0, name="CLAUDIO", l2="Plomero · 25 años de oficio")
B("Empecé de ayudante", "img:p_joven", "fade")
B("un maestro que se llamaba Don Aurelio", "img:p_aurelio")
O("más de 3.000 inodoros", "big", 3.4, text="+3.000", sub="inodoros destapados")
B("En casas, en edificios", "img:p_furgon")
B("en un hospital una vez", "img:p_hospital")
B("la mayoría de esas llamadas no necesitaban", "w:wide", "zoom")
B("Y uno de ustedes me lo pidió", "img:p_comentario")
O("Me escribió: y para el inodoro", "comment", 4.0, text="¿Y para el inodoro, Claudio?")
O("hacen falta veintitrés minutos", "comment", 4.5, text="Hacen falta 23 minutos para decir con qué lo destapas 🙄")
# ======================= CTA1 =======================
B("me senté y escribí todo lo que sé", "img:c_escribe", "fade")
B("Se llama Plomería Casera", "w:book", "portal")
PG("Se llama Plomería Casera", "pk006", 26)
O("cincuenta arreglos por menos de lo que cuesta", "price", 6.5, gAt=None)
B("está en la página seis", "w:book", "cut")
MK("con la lista de lo que necesitas", 8, [0.08, 0.18, 0.92, 0.3])
O("Puedes escanear el código", "qr", 9.0, page="pk006", name="PLOMERÍA CASERA", pg="Página 6 · el inodoro tapado")
B("Y ahora sí, vamos al baño", "w:wide", "swipeR")
# ======================= RECETA =======================
B("La receta. Anótala", "img:c_carpeta", "fade")
B("Una taza de detergente líquido", "img:r_frasco")
O("Una taza de detergente líquido", "step", 4.5, n="1", tx="1 TAZA DE DETERGENTE DE PLATOS")
B("Una taza de las de café con leche", "img:r_mide")
O("Una taza de las de café con leche", "big", 3.2, text="250 ml", sub="una taza de café con leche")
B("Lo echas directo en la taza del inodoro", "w:bowlc", "portal")
EV("mug", "Lo echas directo en la taza del inodoro", 3.0); EV("pour", "Lo echas directo en la taza del inodoro", 40)
B("Y lo dejas bajar solo", "img:r_echa")
B("el detergente es más pesado que el agua", "w:side", "iris")
EV("xray", "el detergente es más pesado que el agua", 8)
O("se va al fondo, hacia la salida", "tag", 3.5, pt="plug", text="BAJA HASTA EL TAPÓN", col="#3fd17a")
B("pones a calentar agua", "w:kettle", "swipeL")
EV("steam", "pones a calentar agua", 7)
O("Unos 4 o 5 litros", "step", 4.5, n="2", tx="4-5 LITROS DE AGUA CALIENTE")
B("el error número uno de casi todos", "img:r_olla")
O("el agua no tiene que hervir", "stamp", 2.8, text="NO HIERVE", col="#ff4a3d")
B("que todavía puedas meter un dedo", "img:r_dedo")
O("Unos sesenta grados", "thermo", 4.5, to=60)
B("Si la tienes en la tetera", "img:r_burbujas")
B("Te voy a explicar por qué en un minuto", "img:r_vierte")
B("la echas desde la altura de tu cintura", "w:bucket", "portal")
EV("bucket", "la echas desde la altura de tu cintura", 5); EV("hot", "la echas desde la altura de tu cintura", 30)
O("la echas desde la altura de tu cintura", "step", 4.5, n="3", tx="DESDE LA CINTURA, AL AGUJERO")
B("Un chorro firme, todo de una vez", "img:r_chorro")
B("lo más difícil de toda la receta", "img:r_reloj")
O("Esperas veinte minutos", "timer", 5.5, label="20 MIN", sub="sin tocar nada")
B("Te vas a tomar un café", "img:r_cafe")
B("No tiras la cadena, no metes la mano", "img:r_cadena")
B("vas a ver que el nivel bajó solo", "w:bowlc", "portal")
KF(LEVEL, "vas a ver que el nivel bajó solo", 0.95); KF(LEVEL, "se oye un gorgoteo", 0.2)
KF(PLUG, "vas a ver que el nivel bajó solo", 1); KF(PLUG, "se oye un gorgoteo", 0)
B("se oye un gorgoteo y el agua se va", "img:r_gorgoteo")
O("Ahí, y recién ahí, tiras la cadena", "step", 4.0, n="4", tx="20 MIN · RECIÉN AHÍ, LA CADENA")
B("Esa es la receta completa", "bk", "zoom")
O("Esa es la receta completa", "kit", 9.5, items=[{"at": "Una taza de detergente,", "ic": "🧴", "tx": "1 taza de detergente"},
    {"at": "medio balde de agua caliente", "ic": "🪣", "tx": "½ balde a 60 °C"}, {"at": "desde la altura de la cintura", "ic": "⬇️", "tx": "desde la cintura"},
    {"at": "y veinte minutos de paciencia", "ic": "⏱️", "tx": "20 min sin tocar"}])
B("Ahora déjame explicarte por qué funciona", "w:wide", "zoom")
KF(PLUG, "Ahora déjame explicarte por qué funciona", 1)
# ======================= POR QUE =======================
B("El inodoro no es un tubo derecho", "w:side", "cut")
EV("xray", "El inodoro no es un tubo derecho", 44)
O("Esa curva se llama sifón", "tag", 4.0, pt="trap", text="EL SIFÓN", sub="cuello de cisne")
O("Es un sello de agua", "tag", 3.5, pt="bowl", text="SELLO DE AGUA", col="#8fd6ff")
B("la parte de arriba de esa curva es angosta", "w:plug", "cut")
O("no tiene más de cinco centímetros", "big", 3.2, text="5 cm", x=1450, y=300, size=180)
B("El papel higiénico llega en un bollo grande", "img:q_curva")
O("se arma un tapón como un corcho mojado", "tag", 3.5, pt="plug", text="EL TAPÓN", col="#ffb257")
B("Ahora piensa qué hace el detergente", "w:plug", "iris")
EV("pour", "Ahora piensa qué hace el detergente", 12)
B("Es como cuando quieres sacar un anillo", "img:q_anillo")
B("Y el agua caliente hace la otra mitad", "img:q_papel_agua")
EV("hot", "Y el agua caliente hace la otra mitad", 12)
B("Entonces tienes un tapón que está blando", "w:side", "portal")
O("Entonces tienes un tapón que está blando", "chips", 6.5, items=["TAPÓN BLANDO", "CURVA RESBALOSA", "PESO DEL AGUA"])
B("si lo que tapa es un juguete", "img:q_juguete")
B("reconocer qué tipo de tapón tienes", "img:q_corte")
# ======================= TEMPERATURA =======================
B("Ahora, lo del agua hirviendo", "img:t_hirviendo", "fade")
B("La porcelana del inodoro es dura", "w:bowl", "portal")
EV("boil", "Ahora, lo del agua hirviendo", 5)
O("digamos veinte grados", "thermo", 5.0, to=100)
EV("crack", "Y aparece una fisura", 10)
O("Y aparece una fisura", "tag", 3.5, pt="bowl", text="FISURA", col="#ff4a3d")
B("una rayita fina como un pelo", "img:t_raja")
B("empieza a gotear por abajo", "w:side", "cut")
B("Doña Teresa", "img:t_teresa")
O("en el año 2009", "big", 3.0, text="2009", sub="Doña Teresa · el inodoro rajado")
B("Y la taza se rajó de arriba a abajo", "img:t_raja2" if False else "w:bowlc", "cut")
B("Si tu casa tiene caños de plástico", "img:t_pvc")
B("Por eso: caliente, muy caliente", "w:kettle", "swipeL")
EV("steam", "Por eso: caliente, muy caliente", 10)
O("Sesenta grados. Si no tienes termómetro", "thermo", 4.5, to=60)
B("la regla de la tetera", "img:t_tetera")
B("O la mezcla de la casa", "img:t_termometro")
O("O la mezcla de la casa", "chips", 6.0, items=["3 PARTES DEL CALENTADOR", "1 PARTE HERVIDA", "= 60 °C"])
# ======================= TIPO DE TAPON =======================
B("Antes de echar nada, tómate quince segundos", "bk", "zoom")
O("Antes de echar nada, tómate quince segundos", "diag", 26.0, items=[
    {"at": "Primera señal: cómo baja el agua", "sw": "BAJA LENTO", "tx": "sube y baja despacito", "res": "PAPEL → la taza", "ok": True}])
B("Si al tirar la cadena el agua sube", "img:k_lento")
B("Segunda señal", "img:k_nino")
O("Segunda señal", "diag", 14.0, items=[{"at": "Segunda señal", "sw": "NO BAJA + NIÑOS", "tx": "un juguete, un cepillo", "res": "OBJETO → sacar", "ok": False}])
B("Eso lo tienes que sacar hacia arriba", "w:side", "iris")
EV("xray", "Eso lo tienes que sacar hacia arriba", 5)
B("Tercera señal, y esta es importante", "img:k_ducha")
B("se oye un glu glu en el lavabo", "img:k_lavabo")
B("el agua sale por la rejilla del patio", "img:k_rejilla")
B("Está más abajo, en el caño", "w:under", "portal")
EV("stuck", "Está más abajo, en el caño", 16)
O("Está más abajo, en el caño", "tag", 4.0, pt="chamber", text="EL CAÑO PRINCIPAL", col="#ffb257")
B("un vecino mío se pasó un fin de semana", "img:k_vecino")
B("en la cámara del patio", "w:chamber", "cut")
O("a cinco metros", "big", 3.0, text="5 m", x=1450, y=300, size=180)
B("Y una cuarta señal que casi nadie mira", "img:k_olor")
B("el sello de agua del sifón se haya perdido", "w:side", "portal")
EV("xray", "el sello de agua del sifón se haya perdido", 6)
KF(LEVEL, "el sello de agua del sifón se haya perdido", 0.4); KF(LEVEL, "Eso pasa cuando el tapón deja", 0.0)
O("Quince segundos de mirar te ahorran", "big", 3.5, text="15 s", sub="de mirar = 1 hora ahorrada")
# ======================= ERROR CADENA =======================
B("Y volvamos a esa escena del principio", "w:bowl", "zoom")
KF(LEVEL, "Cuando el inodoro está tapado, la taza ya está casi llena", 0.95)
B("El tanque de atrás tiene", "w:tank", "cut")
O("El tanque de atrás tiene", "liters", 6.0)
EV("flush", "Si aprietas otra vez", 3)
B("Se van por arriba. Al piso", "img:e_desborda2" if False else "img:e_tanque")
B("al techo del vecino", "img:e_techo")
O("si tiraste una vez y el agua sube", "stamp", 3.5, text="NO VUELVAS A TIRAR", col="#ff4a3d")
B("hay un movimiento que te salva", "w:flap", "portal")
EV("tank", "hay un movimiento que te salva", 6)
O("la palanca se suelta", "big", 4.0, text="SUELTA LA PALANCA", size=110)
# ======================= SIN DESTAPACAÑOS =======================
B("qué haces si echaste la taza", "img:s_repite", "fade")
O("Repite una vez", "big", 3.0, text="× 2", sub="otra taza, otro balde, otros 20 min")
B("Muchas veces el primer intento ablandó", "w:plug", "portal")
KF(PLUG, "Muchas veces el primer intento ablandó", 1); KF(PLUG, "el segundo lo termina de mover", 0.5)
EV("xray", "Muchas veces el primer intento ablandó", 7)
B("ahí vamos al plan B", "bk", "zoom")
O("ahí vamos al plan B", "step", 3.5, n="B", tx="PLAN B · SIN DESTAPACAÑOS")
B("tiene el de copa redonda", "img:s_copa")
B("El primero es el golpe de agua", "img:s_balde")
O("Llenas un balde entero", "big", 3.0, text="10 L", sub="agua tibia")
B("lo levantas a la altura del pecho", "w:bucket", "portal")
EV("bucket", "lo vacías de una sola vez", 4)
B("No en el borde, no en la porcelana", "img:s_golpe")
O("El tanque deja caer el agua desde", "chips", 6.5, items=["TANQUE: 40 cm", "TÚ: 1 METRO", "EL DOBLE DE AGUA"])
B("Esa presión empuja el tapón blando", "w:side", "iris")
EV("xray", "Esa presión empuja el tapón blando", 6); KF(PLUG, "Esa presión empuja el tapón blando", 0.5); KF(PLUG, "Ojo: esto solo lo haces", 0)
B("primero sacas un poco con un vaso", "img:s_vaso")
# ======================= FILM =======================
B("El segundo truco sin destapacaños", "w:bowl", "fade")
KF(PLUG, "El segundo truco sin destapacaños", 1)
O("Film transparente de cocina", "big", 3.2, text="FILM DE COCINA", size=120)
B("Primero secas bien el borde", "img:f_seca")
B("Después estiras el film de un lado", "img:f_estira")
EV("film", "Después estiras el film de un lado", 40)
O("Pones tres o cuatro capas", "step", 4.0, n="3-4", tx="CAPAS CRUZADAS, COMO UN TAMBOR")
B("Ahora tiras la cadena", "w:bowlc", "portal")
EV("flush", "Ahora tiras la cadena", 2.5)
B("El film se va a inflar hacia arriba", "img:f_globo")
B("con la palma de la mano, abierta", "img:f_empuja")
B("usar todo el inodoro como si fuera", "w:side", "iris")
EV("xray", "usar todo el inodoro como si fuera", 8)
KF(PLUG, "El aire y el agua atrapados", 1); KF(PLUG, "Cuando sientes que el globo se desinfla", 0)
B("Quitas el film con cuidado", "w:bowlc", "cut")
B("Esto lo aprendí de una clienta", "img:f_senora")
O("Veinticinco años de oficio y una señora", "comment", 4.5, text="25 años de oficio… y me lo enseñó una señora de 80 👵")
# ======================= BOTELLA =======================
B("Un tercero, por si no tienes film", "img:x_botellas", "fade")
B("Le cortas la base con un cuchillo", "img:b_corta")
O("Te quedó como un embudo con tapa", "chips", 4.5, items=["BOTELLA DE 2 L", "SIN BASE", "CON TAPA"])
B("metes la parte cortada dentro del agujero", "img:b_empuja")
B("Y si nada de esto funcionó", "w:side", "zoom")
EV("xray", "Y si nada de esto funcionó", 9)
O("Es otra cosa", "stamp", 2.6, text="NO ES PAPEL", col="#ffb257")
# ======================= OBJETO =======================
B("Cuando hay un objeto, la regla de oro", "w:plug", "cut")
O("no lo empujes más adentro", "stamp", 3.0, text="NO LO EMPUJES", col="#ff4a3d")
B("Lo primero: guantes largos", "img:o_guantes")
B("Después, con una linterna", "img:o_linterna")
B("Un cepillo de dientes, un juguete", "img:o_cepillo")
B("lo sacas con la mano o con unas pinzas", "img:o_pinza")
B("la herramienta correcta es una sonda corta", "img:o_sonda")
B("Se mete despacio, girando la manivela", "img:o_gira")
O("Lo primero: guantes largos", "kit", 30.0, items=[{"at": "Lo primero: guantes largos", "ic": "🧤", "tx": "guantes hasta el codo"},
    {"at": "Después, con una linterna", "ic": "🔦", "tx": "linterna"}, {"at": "unas pinzas largas de cocina", "ic": "🥢", "tx": "pinzas largas"},
    {"at": "una sonda corta de inodoro", "ic": "🌀", "tx": "sonda corta"}, {"at": "un gancho de ropa de alambre", "ic": "🪝", "tx": "gancho de alambre", "no": True}], y=880)
B("agarrar un gancho de ropa de alambre", "img:o_gancho")
B("Ese alambre raya la porcelana", "img:o_rayas")
# ======================= CTA2 =======================
B("Y aquí te quiero mostrar una cosa", "w:kitchen", "fade")
B("lo tengo escrito en la Guía del Desagüe", "w:book", "cut")
PG("lo tengo escrito en la Guía del Desagüe", "gd014", 34)
MK("Ahí está el inodoro: qué no hacer", 14, [0.08, 0.14, 0.92, 0.34])
B("Lo pensé para que lo tengas impreso", "img:g_guia")
O("Cincuenta arreglos por menos de lo que te cobra", "price", 6.5, gAt=None)
O("Escanea el código de la pantalla", "qr", 9.0, page="gd014", name="GUÍA DEL DESAGÜE", pg="Página 14 · el plan B completo")
B("Escanea el código de la pantalla", "w:book", "cut")
# ======================= DESTAPADOR =======================
B("Si tienes un destapador", "img:d_dos", "fade")
O("el 90% de la gente", "big", 3.0, text="90 %", sub="lo usa mal")
B("Y el de reborde", "img:d_reborde")
O("Ese es el del inodoro", "chips", 5.0, items=["COPA ✗ lavabo", "REBORDE ✓ inodoro"])
B("La manga entra en el agujero y sella", "w:bowlc", "portal")
EV("plunger", "La manga entra en el agujero y sella", 4)
B("tiene que haber agua", "img:d_mete")
B("el primer empujón tiene que ser suave", "img:d_salpica")
O("el primer empujón tiene que ser suave", "step", 4.0, n="1º", tx="EL PRIMERO, SUAVE")
B("Después sí, empujas con ritmo", "w:side", "iris")
EV("plunger", "Después sí, empujas con ritmo", 12); EV("xray", "Después sí, empujas con ritmo", 12)
O("15 o 20 veces seguidas", "big", 3.0, text="15-20", sub="veces seguidas", x=1450, y=300, size=170)
O("La fuerza importante es hacia arriba", "tag", 4.0, pt="plug", text="⬆ LA FUERZA VA HACIA ARRIBA", col="#3fd17a")
KF(PLUG, "Al final, un tirón fuerte", 1); KF(PLUG, "Si el agua baja de golpe", 0)
B("Si el agua baja de golpe con un ruido", "img:d_succion")
B("si antes echaste algún destapador químico", "img:d_bombea")
O("si antes echaste algún destapador químico", "stamp", 3.5, text="QUÍMICO = SIN DESTAPADOR", col="#ff4a3d")
# ======================= QUIMICOS =======================
B("hablemos de los químicos", "bk", "fade")
O("Primero, porque el tapón del inodoro", "err", 6.0, n=1, tx="SE DILUYE EN EL AGUA")
O("Segundo, porque si no destapa", "err", 7.0, n=2, tx="QUEDA UN AGUA QUE QUEMA")
B("Tercero, porque generan calor", "w:bowl", "portal")
EV("hot", "Tercero, porque generan calor", 6)
O("Tercero, porque generan calor", "err", 5.0, n=3, tx="CALOR QUE CASTIGA LA PORCELANA")
B("echa otro distinto encima", "img:x_ventana")
O("Mezclar productos de limpieza", "err", 5.0, n=4, tx="MEZCLAR LARGA GASES")
B("Por eso en mi pack, en la página dos", "w:book", "portal")
PG("Por eso en mi pack, en la página dos", "pk002", 12)
MK("nunca mezcles productos", 7, [0.08, 0.36, 0.92, 0.46], "#ff6b5e")
B("El detergente de platos es justo lo contrario", "img:x_vapor")
O("no quema, no reacciona", "chips", 5.0, items=["NO QUEMA", "NO REACCIONA", "NO DAÑA LOS CAÑOS"])
# ======================= ERRORES =======================
B("los cinco errores que veo todas las semanas", "bk", "zoom")
O("Error uno, el que ya vimos", "err", 4.0, n=1, tx="TIRAR OTRA VEZ LA CADENA")
O("Error dos: el agua hirviendo", "err", 4.0, n=2, tx="EL AGUA HIRVIENDO")
O("Error tres: el gancho de alambre", "err", 5.0, n=3, tx="EL GANCHO DE ALAMBRE")
B("Error cuatro, y este casi nadie lo sabe", "img:e_bicarb")
O("Error cuatro, y este casi nadie lo sabe", "err", 5.0, n=4, tx="BICARBONATO + VINAGRE")
B("se neutralizan entre sí en unos segundos", "w:side", "iris")
EV("xray", "se neutralizan entre sí en unos segundos", 9)
B("Y error cinco, el que más plata cuesta", "img:e_toallitas")
O("Y error cinco, el que más plata cuesta", "err", 5.0, n=5, tx="LAS TOALLITAS HÚMEDAS")
B("se van juntando en el caño de abajo", "w:under", "portal")
EV("wipes", "Y error cinco, el que más plata cuesta", 6); EV("stuck", "se van juntando en el caño de abajo", 8)
B("del tamaño de un brazo", "img:e_tapon_brazo")
O("van al tacho de basura, siempre", "stamp", 3.0, text="AL TACHO", col="#3fd17a")
# ======================= TOALLITAS =======================
B("la prueba que hago con los clientes", "img:w_frascos", "fade")
B("Tomo dos frascos de vidrio con agua", "bk", "zoom")
O("Tomo dos frascos de vidrio con agua", "jars", 22.0, shake=None)
B("La toallita sale entera", "img:w_entera")
B("Puedes hacer esta prueba en tu casa", "img:w_papel")
B("la toallita llega, se apoya en una unión", "w:under", "portal")
EV("stuck", "la toallita llega, se apoya en una unión", 6)
B("los hilos dentales, los algodones", "img:w_cosas")
O("Al inodoro van tres cosas y nada más", "chips", 5.5, items=["LO DE TU CUERPO", "PAPEL HIGIÉNICO", "AGUA"])
# ======================= PREGUNTAS =======================
B("varias preguntas que me dejaron", "img:a_pregunta", "fade")
O("se puede hacer como prevención", "comment", 4.0, text="¿Se puede hacer como prevención? ¿Cada cuánto?")
B("una vez al mes, de noche", "w:bowlc", "portal")
O("una vez al mes, de noche", "big", 3.5, text="1 VEZ AL MES", sub="de noche, sin tirar hasta la mañana", size=120)
EV("pour", "Echas la taza, el medio balde", 10)
B("los agujeritos de abajo del borde", "img:q_orificios")
O("los agujeritos de abajo del borde", "comment", 4.0, text="¿Y los agujeritos del borde que se tapan?")
B("con vinagre de alcohol, tibio", "img:q_vinagre_papel")
B("con un alambre fino o un palillo", "img:q_palillo")
B("cómo evito las raíces", "img:q_raices")
O("cómo evito las raíces", "comment", 4.0, text="¿Cómo evito las raíces en el caño?")
B("una unión del caño enterrado", "w:under", "portal")
B("suena el agua en el lavabo de al lado", "img:q_lavabo_glu")
O("suena el agua en el lavabo de al lado", "comment", 4.0, text="Al tirar la cadena hace glu glu el lavabo 🤔")
B("un problema en la ventilación del caño", "w:vent", "portal")
EV("vent", "un problema en la ventilación del caño", 14)
O("el tubo que sale por el techo", "tag", 4.0, pt="vent", text="LA VENTILACIÓN", col="#8fd6ff")
B("tapada por hojas o por un nido", "img:q_ventilacion")
# ======================= MAS PREGUNTAS =======================
B("Sirve el champú en lugar del detergente", "img:m_champu", "fade")
O("Sirve el champú en lugar del detergente", "stamp", 2.6, text="CHAMPÚ ✓", col="#3fd17a", x=1450, y=300, size=80)
B("Y el jabón en polvo", "img:m_polvo")
O("Y el jabón en polvo", "stamp", 2.6, text="POLVO ✗", col="#ff4a3d", x=1450, y=300, size=80)
B("Y la sal gruesa", "img:m_sal")
O("En el inodoro, no hace nada útil", "stamp", 2.6, text="SAL ✗", col="#ff4a3d", x=1450, y=300, size=80)
B("Y la Coca-Cola? Eso lo vi", "img:m_cola")
O("Pegastas la botella y el tapón", "stamp", 2.6, text="COLA ✗", col="#ff4a3d", x=1450, y=300, size=80)
B("Y si tengo pozo séptico", "img:m_fosa")
B("Y si vives en un edificio", "img:m_edificio")
B("el tapón está en la bajada común", "w:under", "portal")
EV("stuck", "el tapón está en la bajada común", 6)
# ======================= DON AURELIO =======================
B("lo que Don Aurelio, mi maestro", "img:p_aurelio2" if False else "w:wide", "fade")
B("Entraba, miraba, preguntaba", "img:a_tres")
O("Desde cuándo", "chips", 7.0, items=["¿DESDE CUÁNDO?", "¿DE GOLPE O LENTO?", "¿HAY NIÑOS?", "¿TOALLITAS?", "¿BAJA LA DUCHA?"])
O("el que empuja sin preguntar", "big", 4.5, text="«El que empuja sin preguntar, empuja dos veces»", size=64)
B("nunca usaba fuerza contra la porcelana", "w:bowl", "portal")
B("nunca se iba sin probar tres descargas", "w:tank", "cut")
O("nunca se iba sin probar tres descargas", "three", 14.0, ats=["Por eso él tiraba la cadena", "y la tiraba otra vez", "y otra. Tres veces"])
EV("flush", "Por eso él tiraba la cadena", 2.5); EV("flush", "y la tiraba otra vez", 2.5); EV("flush", "y otra. Tres veces", 2.5)
B("después de destapar, siempre echaba un balde", "img:a_balde_det")
O("Él la hacía hace cuarenta años", "big", 3.0, text="40 AÑOS", sub="la misma taza de prevención")
# ======================= INODOROS =======================
B("Hablemos de tu inodoro en particular", "w:wide", "fade")
B("de bajo consumo", "img:i_bajo")
O("descargan 4 o 6 litros", "big", 3.0, text="4-6 L", sub="bajo consumo", x=1450, y=300, size=170)
B("un inodoro de doble botón", "img:i_doble")
O("acostúmbrate a usar el grande", "chips", 4.5, items=["BOTÓN CHICO = LÍQUIDOS", "BOTÓN GRANDE = PAPEL"])
B("con el tanque arriba en la pared", "img:i_alto")
B("los suspendidos", "img:i_suspendido")
B("en un baño de servicio que casi no se usa", "img:i_servicio")
B("el agua del sifón se evapora", "w:side", "iris")
EV("xray", "el agua del sifón se evapora", 6)
KF(LEVEL, "el agua del sifón se evapora", 0.55); KF(LEVEL, "ahí no es un tapón, es olor", 0.0); KF(LEVEL, "Le tiras la cadena una vez por semana", 0.55)
# ======================= HABITO =======================
B("Y ahora el hábito", "bk", "zoom")
O("Primero: cuánto papel", "routine", 44.0, hl=None, rows=[
    {"at": "Primero: cuánto papel", "when": "1", "what": "Mucho papel → descarga en dos veces", "ic": "🧻"},
    {"at": "Segundo: el papel que compras", "when": "2", "what": "Papel grueso → siempre en dos veces", "ic": "📦"},
    {"at": "Tercero: un tacho de basura", "when": "3", "what": "Tacho con tapa al lado del inodoro", "ic": "🗑️"},
    {"at": "Cuarto: una vez al mes", "when": "4", "what": "1 vez al mes: la taza de noche", "ic": "🌙"},
    {"at": "Y quinto, revisa que el tanque llene", "when": "5", "what": "Que el tanque llene a su nivel", "ic": "🚽"}])
B("de los inodoros tapados que yo destapé", "img:hb_papel")
B("Los papeles muy gruesos", "img:hb_grueso")
B("Si no hay tacho, la gente tira todo", "img:hb_tacho")
B("revisa que el tanque llene bien", "img:hb_nivel")
B("el arreglo veintiséis", "w:book", "portal")
PG("el arreglo veintiséis", "pk026", 12)
MK("el del inodoro que descarga débil", 8, [0.08, 0.14, 0.92, 0.26])
# ======================= ULTIMO =======================
B("lo que te prometí al principio", "w:wide", "fade")
B("levanta la tapa del tanque de atrás", "img:u_tapa_toalla")
EV("tank", "levanta la tapa del tanque de atrás", 75)
B("Mira adentro del tanque", "w:flap", "portal")
O("hay una goma redonda que tapa", "tag", 5.0, pt="flapper", text="EL SAPITO", sub="flapper", col="#ffb257")
B("con una mano tiras la cadena", "img:u_mano")
EV("flush", "con una mano tiras la cadena", 3)
B("bajas esa goma con la mano", "img:u_baja_goma")
B("En ese momento el tanque deja de largar", "w:flap", "cut")
O("Es como tener un freno de mano", "big", 3.5, text="FRENO DE MANO", size=120)
B("el agua del tanque es agua limpia", "img:u_flapper")
B("hay una llavecita en el caño", "w:valve", "portal")
EV("valve", "Esa es la llave de paso del inodoro", 10)
O("Esa es la llave de paso del inodoro", "tag", 5.0, pt="valve", text="LLAVE DE PASO", col="#8fd6ff")
B("Si la cierras antes de tirar la cadena", "img:u_llave")
B("una vez al año ábrela y ciérrala", "img:u_gira")
O("Dos movimientos, uno en el tanque", "chips", 5.0, items=["LA MANO EN EL SAPITO", "O LA LLAVE CERRADA"])
# ======================= RECAP =======================
B("Te hago el repaso en un minuto", "bk", "zoom")
O("Te hago el repaso en un minuto", "recap", 70.0, rows=[
    {"at": "Inodoro tapado: no vuelves a tirar", "tx": "No vuelvas a tirar la cadena", "no": True},
    {"at": "Miras quince segundos", "tx": "15 s de mirar: papel, objeto o caño"},
    {"at": "Si es papel: una taza de detergente", "tx": "1 taza de detergente + ½ balde a 60 °C"},
    {"at": "Veinte minutos sin tocar nada", "tx": "20 min sin tocar · repetir 1 vez"},
    {"at": "golpe de agua con el balde", "tx": "Balde desde el pecho · film · botella"},
    {"at": "Si tienes destapador, el de reborde", "tx": "Reborde: 1º suave, la fuerza hacia arriba"},
    {"at": "Si es un objeto, se saca hacia arriba", "tx": "Objeto: hacia arriba, nunca alambre"},
    {"at": "Nada de químicos, nada de agua hirviendo", "tx": "Químicos, hirviendo, toallitas", "no": True},
    {"at": "Antes de probar, la tapa del tanque", "tx": "Mano en el sapito o llave cerrada"},
    {"at": "tres descargas seguidas", "tx": "3 descargas seguidas para confirmar"}])
# ======================= CIERRE =======================
B("Eso es todo lo que sé del inodoro", "w:wide", "fade")
B("el pack Plomería Casera con la Guía", "w:book", "portal")
PG("el pack Plomería Casera con la Guía", "pk006", 16)
O("el pack Plomería Casera con la Guía", "qr", 10.0, page="pk006", name="PLOMERÍA CASERA", pg="Página 6 · Guía pág. 14")
O("Déjame en los comentarios", "comment", 5.0, text="¿Qué es lo que más se te tapa en tu casa? 👇")
B("Y suscríbete, que el próximo", "img:z_limpio")
O("Y suscríbete, que el próximo", "chips", 5.0, items=["🔔 SUSCRÍBETE", "PRÓXIMO: EL OLOR A CLOACA"])
B("Soy Claudio, el plomero", "w:wide", "zoom")

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
    if g["k"] == "img" and b - g["a"] > 8.5: add.append({"a": round(g["a"] + 6.0, 2), "k": "w", "view": "bowl" if i % 2 else "wide", "tr": "portal"})
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
    for lk in ("items", "rows"):
        if lk in o and o[lk] and isinstance(o[lk][0], dict):
            for it in o[lk]:
                a = at(it["at"]) if isinstance(it["at"], str) else it["at"]
                it["at"] = a if a is not None else o["a"] + 0.5
    if o["k"] == "three": o["ats"] = [at(x) or o["a"] for x in o["ats"]]
    if o["k"] == "jars": o["shake"] = at("les pongo la tapa y agito") or o["a"] + 4
    if o["k"] == "price": o["gAt"] = round(o["a"] + 2.2, 2)
    if o["k"] == "routine": o["hl"] = -1
    ov.append(o)
for o in ov:  # las piezas grandes llevan el fondo del mundo quieto
    if o["k"] in ("diag", "recap", "routine", "jars", "kit"):
        if base_at(o["a"] + 0.5)["k"] not in ("bk", "av"): pass

ev = {k: sorted(v) for k, v in EVR.items()}
ev["plug"] = sorted(PLUG); ev["level"] = sorted(LEVEL); ev["pages"] = PAGES; ev["marks"] = MARKS
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
