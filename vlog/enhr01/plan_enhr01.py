# enhr01 · «I've Sat With 3,000 Dying Patients — Weeks Before Death, They All Start Doing This» (Hospice Chaplain Rosa) · plan del video ENTERO escrito A MANO,
# plano por plano, sobre la frase de ese segundo (at() sobre words.json, frases copiadas del guion). → segs.json, ov.json, avail.json,
# edl.json en src/enhr01 y D:/rtmp/enhr01_PLAN_MxM.md (una línea por plano). Las ventanas del avatar las manda avwin.json (av_temprano):
# ahí la base es el avatar y al salir vuelve el plano que corresponde.
# Bases: "img:<id>" foto (si su toma LTX-vlog ya llegó, va el clip de Ernesto haciendo eso) · "ph:<id>" foto quieta
# · "ltx:<id>|<respaldo>" clip LTX de lugar (si todavía no llegó, el respaldo) · "bk[:<id>]" foto oscurecida para piezas grandes
# · "fill" el siguiente clip/foto que nadie pidió (nunca se repite nada).
# ⛔ Nunca un paciente con cara de moribundo: manos, espaldas, la familia. Sin voz todavía: corre con words SIMULADAS del guion (--sim) para probar.
import json, os, re, subprocess, unicodedata, sys, statistics

sys.stdout.reconfigure(encoding="utf-8")
SL = "enhr01"
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
    for par in open("D:/rtmp/hospice/enhr01/guion.txt", encoding="utf8").read().split("\n"):
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

# enhr01 · los PLANOS y las PIEZAS escritos a mano sobre la frase de ese segundo (se pegan dentro de plan_enhr01.py).
# Bases: "img:rNN" Rosa haciendo lo que cuenta (si su clip LTX-vlog llegó, va el clip) · "img:nNN" detalle sin cara · "bk[:id]" foto
# oscurecida para piezas grandes · "fill" la foto anclada más cerca de ese segundo. ⛔ Nunca un paciente con cara de moribundo.
AZ, LILA, ROJO, VERDE = "#f0c24b", "#b49ad8", "#b8322a", "#2f8a4e"

# =====================================================================================================================
# 0:00 GANCHO — la escena de las 2 a. m. junto a la cama + la promesa (9 cosas, la última nadie la hace). Planos ≤3 s; avatar en 0 s.
# =====================================================================================================================
B("if you found this video at two in the morning", "img:n04", "cut", why="el reloj de la pieza marca las 2")
O("if you found this video at two in the morning", "reloj", 4.2, h=2, m=0, label="2:00 A.M.", sub="NEXT TO THE BED")
B("sitting next to a bed", "img:r01", "cut", why="Rosa junto a la cama, la mano de la paciente")
B("just looked at the corner of the room and said a name", "img:n01", "zoom", why="el rincón vacío del cuarto")
B("a name of somebody who has been gone for thirty years", "img:n02", "cut", why="la foto vieja en la mesa de luz")
B("Don't be scared. Sit down", "img:n03", "cut", why="la silla vacía junto a la cama")
B("I've sat in that chair more than", "img:r02", "cut", why="Rosa en el sillón junto a la cama")
O("I've sat in that chair more than", "cuenta", 3.6, from_=0, to=3000, pre="", suf="+", sub="BEDSIDES IN 34 YEARS", size=200)
B("Weeks before the end, sometimes a whole month before", "fill", "cut", why="el reloj de la pared")
B("A rancher from Bandera", "img:n05", "swipeL", why="la tranquera del rancho en Bandera")
O("A rancher from Bandera, a choir lady from the East Side", "chips", 6.4, items=[{"at": "A rancher from Bandera", "tx": "A RANCHER · BANDERA"}, {"at": "a choir lady from the East Side", "tx": "A CHOIR LADY · EAST SIDE"}, {"at": "a German man from New Braunfels", "tx": "A BAKER · NEW BRAUNFELS"}, {"at": "my own mother", "tx": "MY OWN MOTHER"}], y=880)
B("a choir lady from the East Side", "img:n06", "cut", why="la iglesia bautista del East Side")
B("a German man from New Braunfels", "img:n07", "cut", why="New Braunfels")
B("my own mother", "img:n78", "cut", why="las manos con el pañuelo blanco")
B("Nine of them", "bk", "zoom", why="EL NÚMERO: 9")
O("Nine of them", "big", 3.0, text="9", sub="THINGS THEY ALL START DOING", size=360, y=440, col=AZ)
B("you're going to understand what your parent is trying to tell you", "fill", "cut", why="la mano sobre el edredón")
O("by the time we get to the last one", "stamp", 2.8, text="THE LAST ONE: ALMOST NOBODY DOES IT", col=ROJO, rot=-4, x=960, y=880, size=54)
B("Because nobody ever told them what to look for", "img:n08", "cut", why="los folletos del hospicio")
B("That's why I'm here", "img:r03", "fade", why="Rosa sirve dos cafés")

# Presentación (antes del min 1:30)
B("My name is Rosa Navarro", "img:r04", "cut", why="Rosa en su mesa con el café")
O("My name is Rosa Navarro", "lower", 5.5, name="ROSA NAVARRO", l2="Hospice Chaplain · 34 years · San Antonio, Texas")
B("I was born in Guadalajara, in the old Analco neighborhood", "img:n09", "swipeL", why="Analco")
O("I was born in Guadalajara, in the old Analco neighborhood", "mapa", 3.8, city="gdl", pins=[{"at": "in the old Analco neighborhood", "l": "analco", "tx": "ANALCO · 1964"}], title="Guadalajara, Jalisco", x=1380, y=520, sc=0.7)
B("to the West Side, to Prospect Hill", "img:n10", "cut", why="Prospect Hill")
O("to the West Side, to Prospect Hill", "mapa", 4.8, city="sa", pins=[{"at": "to Prospect Hill", "l": "prospect", "tx": "PROSPECT HILL"}, {"at": "of Guadalupe on El Paso", "l": "guadalupe", "tx": "OUR LADY OF GUADALUPE"}], title="San Antonio, Texas", x=1400, y=520, sc=0.68)
B("of Guadalupe on El Paso Street", "img:r05", "cut", why="Rosa frente a la iglesia")
B("I studied pastoral theology at Incarnate Word", "img:n11", "cut", why="Incarnate Word")
B("in 1991 I became a hospice chaplain", "img:n12", "cut", why="el bolso, la Biblia y el pager de 1991")
O("in 1991 I became a hospice chaplain", "lugar", 3.4, tx="Alamo Home Hospice", sub="1991 · house to house")
B("going house to house", "img:r06", "cut", why="Rosa golpea una puerta de mosquitero")
B("and I never left", "fill", "cut", why="la casa del West Side")
O("and I never left", "big", 2.6, text="34", sub="YEARS", x=1460, y=330, size=200, col=AZ)
B("with my cafecito", "img:r07", "cut", why="Rosa revuelve el cafecito")
B("Ernie is somewhere in the back looking for his reading glasses", "img:r08", "cut", why="Rosa señala el pasillo, los lentes en la mesa")
B("Ernie is a funeral director", "img:n13", "swipeR", why="la funeraria de Ernie")
O("Ernie is a funeral director", "tag", 3.0, x=1120, y=420, text="ERNIE", sub="my husband · funeral director", col=AZ)
B("or you cry every day", "img:n14", "fade", why="dos tazas en la mesa")

# El aviso (sin autoridad médica) + suscribir
B("I'm not a doctor, and I'm not a nurse", "bk:n15", "zoom", why="la tarjeta: no soy médica ni enfermera")
O("I'm not a doctor, and I'm not a nurse", "tarjeta", 6.0, kicker="BEFORE WE START", title="I'm not a doctor. I'm not a nurse.", mano="I was the chaplain.")
B("the nurse takes care of the body", "img:n15", "cut", why="la enfermera llega con su bolso")
B("The chaplain sits with the person", "img:r09", "cut", why="Rosa con la mano en el brazo del paciente")
B("Catholics, Baptists, Jewish families", "img:n16", "cut", why="rosario, Biblia, menorá")
B("Nobody dies alone", "img:n17", "cut", why="dos manos juntas")
O("Nobody dies alone, and nobody's family is alone either", "stamp", 3.2, text="NOBODY DIES ALONE", col=LILA, rot=-3, x=960, y=820, size=70)
B("So whatever you see, call your hospice nurse", "img:r16", "cut", why="Rosa llama por teléfono")
O("So whatever you see, call your hospice nurse", "stamp", 3.0, text="CALL YOUR HOSPICE NURSE", col=ROJO, rot=-4, x=1400, y=975, size=56)  # QC clips: bajo la barbilla de r16 → abajo
B("at two in the morning too", "img:n18", "cut", why="el celular en la mesa de luz")
B("From the chair", "img:r11", "fade", why="Rosa en la silla con la libreta")
B("subscribe, so you can find me again when you need me", "img:r12", "cut", why="Rosa lee en la mesa")
O("subscribe, so you can find me again", "stamp", 3.0, text="SUBSCRIBE · FIND ME AGAIN", col=VERDE, rot=-4, x=1300, y=820, size=60)
B("This is a long road", "img:n19", "cut", why="la ruta larga")
B("tell me down in the comments who you're taking care of", "fill", "cut", why="Rosa lee los comentarios")
O("tell me down in the comments who you're taking care of", "comment", 5.4, text="My mom, 87. Three months on hospice. — Laredo, TX", x=1300, y=800)
B("Let's start with the one that scares families the most", "img:n20", "fade", why="la puerta entreabierta")

# =====================================================================================================================
# NÚMERO 1 · DUERMEN
# =====================================================================================================================
B("Number one. They start sleeping", "bk:m33", "zoom", why="número 1")
O("Number one. They start sleeping", "num", 3.8, n="1", title="They start sleeping. A lot.")
B("Your dad used to watch the Spurs game every night", "img:n22", "cut", why="el sillón vacío frente al partido")
B("Then he's sleeping through lunch", "img:m45", "cut", why="duerme de espaldas")
O("Then he's sleeping through lunch", "big", 3.0, text="18-20", sub="HOURS OF SLEEP A DAY", x=1440, y=330, size=170, col=AZ)
B("the family starts whispering in the kitchen", "img:n23", "cut", why="la familia susurra en la cocina")
B("Let me tell you what I learned from Lola", "img:n24", "cut", why="la cartera negra y el rosario de Lola")
O("Lola Benavides was the chaplain who trained me", "lugar", 3.6, tx="Lola Benavides", sub="the chaplain who trained me · 1991")
B("she had been doing hospice since before most people even knew the word", "fill", "cut", why="Lola")
O("Rosa, the dying are never in a hurry", "dicho", 5.2, text="Rosa, the dying are never in a hurry. We are.", who="Lola Benavides")
B("Rosa, the dying are never in a hurry", "bk:n25", "zoom", why="el dicho de Lola")
B("It's the body turning inward", "img:n26", "fade", why="el cuarto en penumbra, el ventilador")
B("you know when you're getting ready for a long trip", "img:n27", "cut", why="la valija lista")
B("the cousin who drove in from Laredo", "img:n28", "cut", why="la camioneta del primo")
B("You let him sleep", "img:r13", "cut", why="Rosa le sube el edredón")
B("hi, Dad, it's me, I'm right here", "img:r14", "cut", why="Rosa le habla bajito")
B("hearing is one of the last things to go", "img:n29", "zoom", why="la oreja sobre la almohada")
O("hearing is one of the last things to go", "tarjeta", 5.6, kicker="IN HOSPICE WE SAY", title="Hearing is one of the last things to go.", mano="so talk to him")
B("Tell him the score of the game", "img:r15", "cut", why="Rosa con la radio en la rodilla")
B("Tell him the grandkids are fine", "img:n30", "cut", why="los dibujos de los nietos")
B("that's when you call your hospice nurse", "fill", "cut", why="el teléfono")

# =====================================================================================================================
# NÚMERO 2 · DEJAN DE COMER
# =====================================================================================================================
B("Number two. They stop eating", "bk:n31", "zoom", why="número 2")
O("Number two. They stop eating", "num", 3.8, n="2", title="They stop eating. And drinking.")
B("food is love", "img:n32", "cut", why="el caldo en la olla")
B("the caldo you made the way she taught you", "img:n33", "cut", why="el caldo intacto")
B("I've watched daughters cry over a bowl of rice", "img:n34", "cut", why="la hija con la cabeza en las manos")
B("you people are starving her", "img:n35", "swipeL", why="el pasillo")
O("Near the end, the person stops wanting the food", "stamp", 3.0, text="PUSHING DOESN'T HELP", col=ROJO, rot=-4, x=1300, y=820, size=62)
B("There was a man on the South Side", "img:n36", "cut", why="la gorra de chofer")
O("There was a man on the South Side", "lugar", 3.6, tx="Mr. Salinas", sub="retired bus driver · South Side")
B("made him enchiladas every single day", "img:n37", "cut", why="las enchiladas")
B("he would take one bite to make her happy", "img:n38", "cut", why="un solo bocado")
B("Tell her it's not her cooking", "img:n39", "cut", why="las manos con el delantal")
B("I sat with Doña Lupita at her kitchen table", "img:r17", "cut", why="Rosa con Doña Lupita")
B("hold a little ice chip to his lips", "img:r18", "cut", why="el hielo en los labios")
B("wet his lips with a little sponge", "img:n40", "cut", why="la esponjita")
B("the dances at the old pavilion", "img:n41", "fade", why="el pabellón de baile")
B("he died two weeks later, very peaceful, holding her hand", "img:n42", "cut", why="las manos con anillos")
B("You offer, you don't force", "img:n43", "cut", why="la cuchara ofrecida")
O("You offer, you don't force", "chips", 4.0, items=[{"at": "You offer", "tx": "OFFER"}, {"at": "you don't force", "tx": "DON'T FORCE"}, {"at": "ask your hospice nurse", "tx": "ASK THE NURSE"}], y=880)
B("Your voice. Your hand. Your stories", "img:n44", "cut", why="el álbum de fotos")

# =====================================================================================================================
# NÚMERO 3 · HABLAN CON GENTE QUE NO VEMOS (el del título)
# =====================================================================================================================
B("Number three. They start talking to people we can't see", "bk:n45", "zoom", why="número 3")
O("Number three. They start talking to people we can't see", "num", 4.2, n="3", title="They talk to people we can't see.", sub="the one in the title")
B("running to the emergency room at three in the morning", "img:m104", "cut", why="la guardia de noche")
B("we were in the kitchen in Monterrey", "img:n47", "cut", why="la cocina de Monterrey")
B("up near the ceiling, and she smiles", "img:n48", "cut", why="el rincón del techo con luz")
B("A baby she lost when she was twenty-two", "img:n49", "cut", why="los zapatitos tejidos")
B("Let me tell you about Mr. Delgado", "fill", "cut", why="Mr. Delgado")
O("Mr. Delgado was a Korean War veteran", "mapa", 5.2, city="sa", pins=[{"at": "He worked at Kelly Field", "l": "kelly", "tx": "KELLY FIELD"}, {"at": "off Culebra Road", "l": "culebra", "tx": "CULEBRA RD"}], title="Mr. Delgado's San Antonio", x=1400, y=520, sc=0.68)
B("He worked at Kelly Field for thirty years", "img:n50", "cut", why="Kelly Field")
B("his little brother, Ramiro", "img:n51", "cut", why="los dos hermanos de uniforme")
O("Ramiro was killed in Korea in 1951", "foto", 4.6, src="enhr01/img/n64.jpg", pie="Ramiro · Korea, 1951", x=1360, y=520, w=600, rot=4)
B("years of silence. And now", "img:n52", "cut", why="la bandera doblada")
B("in that little bedroom off Culebra Road", "img:n53", "cut", why="Culebra Road")
B("at the foot of the bed", "img:n54", "cut", why="el pie de la cama")
B("I'm almost ready, hermano", "img:n55", "fade", why="la mano abierta")
O("I'm almost ready, hermano", "quote", 4.0, text="I'm almost ready, hermano. Wait for me.", who="Mr. Delgado", x=1300, y=880, w=900)
B("His daughter called me so scared", "img:r19", "cut", why="Rosa atiende el teléfono de la pared")
B("I went over, and I sat with them", "img:r20", "cut", why="Rosa en el cuarto de Mr. Delgado")
B("He asked me about my kids", "img:n56", "cut", why="la foto familiar")
B("Even as a chaplain, I don't pretend to know", "img:r21", "cut", why="Rosa con el rosario")
B("There's a hospice doctor up in Buffalo, New York", "img:n57", "swipeL", why="Buffalo")
O("He asked hundreds of his patients about their dreams and visions", "tarjeta", 6.4, kicker="HOSPICE STUDY · BUFFALO, NY", title="had at least one dream or vision", dato="9 in 10", mano="most said: comforting")
B("close to nine out of ten", "bk:n58", "zoom", why="el estudio")
B("Not scary. Comforting", "img:n59", "fade", why="la luz en el encaje")
B("we're waiting for you", "img:n60", "cut", why="la ventana abierta")
B("These peaceful visits are one thing", "fill", "cut", why="la regla de Rosa")
O("Peaceful and calm, and they still know you", "libreta", 9.0, title="Rosa's rule", rows=[
    {"at": "Peaceful and calm, and they still know you", "tx": "Peaceful + knows you", "ok": "That's usually a visit"},
    {"at": "That's usually a visit", "tx": "→ a visit. Let it be."},
    {"at": "Scared, agitated, fighting", "tx": "Scared + doesn't know you"},
    {"at": "Call your hospice nurse right away", "tx": "→ CALL THE NURSE NOW"}])
B("That's what the night line is for", "img:n61", "cut", why="el teléfono de noche")
B("They correct them", "fill", "cut", why="corrigen")
B("Ramiro's been dead for seventy years", "img:n62", "cut", why="las chapas del ejército")
B("So don't correct. Ask", "img:r22", "cut", why="Rosa pregunta junto a la cama")
O("So don't correct. Ask", "stamp", 2.8, text="DON'T CORRECT. ASK.", col=AZ, rot=-4, x=1480, y=900, size=76)  # QC clips: le tapaba la cara en r22 → sobre la espalda del hijo
O("who's here, Dad?", "chips", 4.6, items=[{"at": "who's here, Dad?", "tx": "WHO'S HERE, DAD?"}, {"at": "What is Ramiro saying?", "tx": "WHAT IS HE SAYING?"}, {"at": "Does he look good?", "tx": "DOES HE LOOK GOOD?"}], y=880)
B("Does he look good?", "img:n63", "cut", why="la mano que señala el rincón")
B("her father told her about Korea", "img:n64", "cut", why="la foto de Corea")
B("three days later he was gone", "img:n65", "fade", why="la cama vacía")
B("Ernie's funeral home actually", "img:r23", "cut", why="Rosa en la capilla de Ernie")
B("Because she didn't correct him. She asked", "fill", "cut", why="ella preguntó")
O("I'll tell you what Mr. Delgado saw at the very end, in the next video", "stamp", 3.0, text="WHAT MR. DELGADO SAW → NEXT VIDEO", col=LILA, rot=-3, x=960, y=830, size=52)

# =====================================================================================================================
# NÚMERO 4 · HABLAN DE UN VIAJE
# =====================================================================================================================
B("Number four. They start talking about a trip", "bk:n66", "zoom", why="número 4")
O("Number four. They start talking about a trip", "num", 3.8, n="4", title="They talk about a trip.")
B("nearing death awareness", "img:n67", "cut", why="el libro en la mesa")
O("a long time ago. they call that nearing", "tag", 3.2, x=700, y=430, text="NEARING DEATH AWARENESS", sub="two hospice nurses named it", col=AZ)
B("My very first patient, in 1991", "img:n68", "cut", why="el pan alemán")
O("a man named Herman Vogel", "lugar", 3.8, tx="Mr. Herman Vogel", sub="New Braunfels · my first patient, 1991")
B("Where is my suitcase?", "img:n69", "cut", why="la valija en el placard")
B("Did you find my passport?", "img:n70", "cut", why="el pasaporte")
B("The train leaves soon", "img:n71", "cut", why="el andén")
B("you can't even walk to the bathroom", "img:n72", "cut", why="el andador")
O("Rosa, he's not confused", "dicho", 5.6, text="He's not confused. He's telling you he's leaving. Give the man his suitcase.", who="Lola Benavides", x=1000, y=650, w=1180)  # QC clips: centrada le tapaba la cara a Rosa en r24 → más abajo (y 850 se cortaba)
B("Rosa, he's not confused", "bk:n73", "zoom", why="el dicho de Lola")
B("His wife brought the old brown suitcase", "img:r24", "cut", why="Rosa deja la valija al pie de la cama")
B("Mr. Vogel looked at it and he smiled", "img:n74", "cut", why="la mano sobre la valija")
B("with his shoes lined up at the foot of the bed", "img:r25", "fade", why="los zapatos alineados")
B("I need to get my ticket", "img:n75", "cut", why="las llaves del auto")
O("I need to get my ticket", "chips", 5.4, items=[{"at": "I need to get my ticket", "tx": "MY TICKET"}, {"at": "Where are the car keys?", "tx": "THE CAR KEYS"}, {"at": "Is the bus here?", "tx": "IS THE BUS HERE?"}, {"at": "I have to pack", "tx": "I HAVE TO PACK"}], y=880)
B("Is the bus here?", "img:n76", "cut", why="la parada")
B("what time the bus to Guadalajara left", "img:r26", "cut", why="Rosa con la foto de la terminal")
B("She hadn't been on that bus in forty years", "img:n77", "cut", why="la terminal de micros")
B("You go along with it, gently", "fill", "cut", why="seguirle la corriente")
B("Do you need anything for the trip?", "img:n79", "cut", why="el bolsito para el viaje")

# =====================================================================================================================
# NÚMERO 5 · TERMINAN SUS ASUNTOS
# =====================================================================================================================
B("Number five. They start finishing their business", "bk:n80", "zoom", why="número 5")
O("Number five. They start finishing their business", "num", 3.8, n="5", title="They finish their business.")
B("A sister in Houston", "img:n81", "cut", why="Houston")
B("An old friend from the Air Force", "img:n82", "cut", why="la gorra de la Fuerza Aérea")
B("The dog", "img:n83", "cut", why="el perro junto a la cama")
B("Who's going to take care of the roses", "img:n84", "cut", why="el rosal")
B("Did the property taxes get paid", "img:n85", "cut", why="las facturas")
B("I had a patient on the East Side, Mrs. Ophelia Washington", "img:n86", "swipeL", why="las togas del coro")
O("I had a patient on the East Side, Mrs. Ophelia Washington", "lugar", 4.0, tx="Mrs. Ophelia Washington", sub="East Side · 50 years in the choir")
B("I need to talk to Keisha", "img:n87", "cut", why="el celular y el himnario")
B("He found her working at a gas station off the I-10", "img:n88", "cut", why="la estación de servicio")
B("opened both arms", "img:n89", "cut", why="los brazos abiertos")
B("baby, I just needed you to know that I'm proud of you", "img:n90", "cut", why="la mano joven en la vieja")
O("baby, I just needed you to know that I'm proud of you", "quote", 4.6, text="Baby, I just needed you to know that I'm proud of you.", who="Mrs. Washington", x=1300, y=560, w=900)
B("And then she started humming", "img:n91", "cut", why="el himnario abierto")
B("Became a medical assistant", "img:n92", "cut", why="el ambo celeste")
B("Most of the time it's one sentence", "bk:n93", "zoom", why="LAS CINCO FRASES")
O("I forgive you. Forgive me. Thank you", "cinco", 9.0, title="THE FIVE THINGS", items=[{"at": "I forgive you", "tx": "I forgive you."}, {"at": "Forgive me", "tx": "Forgive me."}, {"at": "Thank you. I love you", "tx": "Thank you."}, {"at": "I love you. Goodbye", "tx": "I love you."}, {"at": "Goodbye. In hospice", "tx": "Goodbye."}])
B("Listen for the name", "img:r27", "cut", why="Rosa anota el nombre")
B("Make the call", "img:r28", "cut", why="Rosa sostiene el teléfono en la oreja")
O("Make the call", "stamp", 2.6, text="MAKE THE CALL", col=VERDE, rot=-4, x=1300, y=330, size=84)
B("Put the phone right up to their ear", "img:n94", "cut", why="el celular contra la almohada")
B("from a base in Germany", "img:n95", "cut", why="la base en Alemania")
B("Like something heavy just fell off of him", "img:n96", "fade", why="la mano que se afloja")

# Respiro a mitad de camino
B("Okay, take a breath with me, mija", "img:r29", "cut", why="Rosa respira")
B("Drink some water", "img:n97", "cut", why="el vaso de agua")
O("We're halfway there", "libreta", 5.9, title="So far", rows=[
    {"at": "We're halfway there", "tx": "1 · they sleep more", "ok": "We're halfway there"},
    {"at": "We're halfway there", "tx": "2 · eat and drink less"},
    {"at": "We're halfway there", "tx": "3 · talk to people we can't see"},
    {"at": "the next four are the ones", "tx": "4 · talk about a trip"},
    {"at": "the next four are the ones", "tx": "5 · finish their business"}])
B("The last one is the one almost nobody does", "fill", "cut", why="la promesa")
# CTA de la guía (26-oct, Hotmart LISTA): tapa 3D del libro 1 que se abre en la tabla real «lo que paga sola la familia vs. hospice»
O("And remember what I said at the start", "guia", 6.4, pag="m5", tapa="tapa", note="What Medicare already pays for")

# =====================================================================================================================
# NÚMERO 6 · MANOS QUE BUSCAN
# =====================================================================================================================
B("Number six. They start reaching", "bk:n98", "zoom", why="número 6")
O("Number six. They start reaching", "num", 3.8, n="6", title="They reach. They pick. They look up.")
B("they pick at the sheets", "img:n99", "cut", why="los dedos en la sábana")
B("like a little kid who wants to be picked up", "img:n100", "cut", why="los brazos en alto")
B("some of it can be restlessness", "fill", "cut", why="díganle a la enfermera")
O("always mention it to your nurse", "stamp", 2.8, text="TELL YOUR NURSE WHAT YOU SEE", col=ROJO, rot=-3, x=1300, y=820, size=56)
B("a retired mailman from Leon Valley", "img:n101", "cut", why="el bolso del cartero")
O("a retired mailman from Leon Valley", "lugar", 3.4, tx="Leon Valley", sub="a retired mailman")
B("opening and closing his fingers", "img:n102", "cut", why="la mano en el aire")
B("Somebody's throwing me a rope", "img:n103", "cut", why="la soga")
O("I'm trying to catch the rope", "quote", 4.2, text="I'm trying to catch the rope. Somebody's throwing me a rope.", who="a mailman from Leon Valley", x=1300, y=560, w=900)
B("Hold the hand that's reaching", "img:r30", "cut", why="Rosa toma la mano que busca")
B("If you pray", "img:n104", "cut", why="las manos con el rosario")
B("a soft blanket or a small towel in their hands", "img:n105", "cut", why="la toallita")
B("a little white handkerchief that belonged to her mother, Mamá Chela", "img:r31", "cut", why="Rosa dobla el pañuelo")
O("that belonged to her mother", "foto", 4.2, src="enhr01/img/n106.jpg", pie="Mamá Chela", x=1360, y=520, w=560, rot=-3)
B("keep the room calm. Soft light", "img:n107", "fade", why="la lamparita")
B("The radio low, with the music they love", "img:r32", "cut", why="Rosa prende la radio")
B("For my mother it was Pedro Infante", "img:n108", "cut", why="el disco")
O("For my mother it was Pedro Infante", "chips", 5.2, items=[{"at": "Pedro Infante", "tx": "PEDRO INFANTE"}, {"at": "Washington, it was gospel", "tx": "GOSPEL"}, {"at": "played old German songs", "tx": "OLD GERMAN SONGS"}], y=880)
B("For Mrs. Washington, it was gospel", "img:n109", "cut", why="el casete y el abanico de iglesia")
B("old German songs on a little cassette player", "img:n110", "cut", why="el grabadorcito")
O("The room matters, honey", "stamp", 2.6, text="THE ROOM MATTERS", col=LILA, rot=-3, x=1300, y=330, size=80)

# =====================================================================================================================
# NÚMERO 7 · SE ALEJAN
# =====================================================================================================================
B("Number seven. They pull away", "bk:m66", "zoom", why="número 7")
O("Number seven. They pull away", "num", 3.8, n="7", title="They pull away. Even from you.")
B("They turn their face to the wall", "img:n112", "cut", why="de cara a la pared")
B("the grandkids running in", "img:n113", "cut", why="las zapatillas de los nietos")
B("I've had so many daughters come out to my car and cry", "img:r33", "cut", why="Rosa abraza a una hija junto al auto")
O("And honey, you did nothing wrong", "stamp", 2.8, text="YOU DID NOTHING WRONG", col=VERDE, rot=-4, x=1300, y=330, size=72)
B("First the newspaper. Then the neighbors", "img:n114", "cut", why="el diario sin abrir")
B("the circle gets very, very small", "img:n115", "zoom", why="una sola silla")
B("A lot of people die right when the family steps out of the room", "img:n116", "cut", why="la silla con el saquito")
B("the H-E-B on Bandera Road", "img:n117", "cut", why="el estacionamiento del súper")
B("to buy one cup of coffee", "img:n118", "cut", why="el café en el tablero")
O("It was not your fault", "stamp", 3.0, text="IT WAS NOT YOUR FAULT", col=LILA, rot=-3, x=960, y=830, size=70)
B("It was not your fault", "img:n119", "fade", why="la hija en el escalón al amanecer")
B("Sit in the chair and read a book", "img:r34", "cut", why="Rosa lee en el sillón")
B("Pray quietly if you pray", "img:n120", "cut", why="la vela y la Virgen")
B("we call it being with, instead of doing for", "img:r35", "cut", why="Rosa sólo está")
O("we call it being with, instead of doing for", "tarjeta", 5.4, kicker="IN HOSPICE WE CALL IT", title="Being with, instead of doing for.", mano="just sit with them")
B("calling the pharmacy", "img:n121", "cut", why="la nota junto al teléfono")

# =====================================================================================================================
# NÚMERO 8 · ESPERAN
# =====================================================================================================================
B("Number eight. They wait", "bk:n122", "zoom", why="número 8")
O("Number eight. They wait", "num", 3.6, n="8", title="They wait.")
B("A grandson coming in from Fort Bliss", "img:n123", "cut", why="el bolso del ejército")
B("Christmas", "img:n124", "cut", why="el arbolito")
B("I had a patient named Walt Pruitt", "img:n125", "swipeL", why="las botas y el sombrero")
O("I had a patient named Walt Pruitt", "lugar", 3.8, tx="Walt Pruitt", sub="rancher · Bandera, Texas")
B("she was stuck because of a storm", "img:n126", "cut", why="la tormenta")
B("with her suitcase still in her hand", "img:n127", "cut", why="la valija en la puerta")
B("it has to do with huevos rancheros", "img:n128", "cut", why="los huevos rancheros")
O("it has to do with huevos rancheros", "stamp", 2.8, text="HUEVOS RANCHEROS → NEXT VIDEO", col=AZ, rot=-4, x=1300, y=330, size=58)
O("he waited for her", "stamp", 2.6, text="HE WAITED FOR HER", col=LILA, rot=-3, x=960, y=830, size=72)
B("A son who isn't coming", "img:n129", "cut", why="la entrada vacía")

# =====================================================================================================================
# NÚMERO 9 · NECESITAN PERMISO (el que nadie hace)
# =====================================================================================================================
B("Number nine. They need permission", "bk:n130", "zoom", why="número 9")
O("Number nine. They need permission", "num", 4.2, n="9", title="They need permission.", sub="the one almost nobody does")
B("That the bills will get paid", "img:n131", "cut", why="la carpeta de papeles")
B("Making sure you had shoes", "img:n132", "cut", why="los zapatitos")
B("Fight, Mom. We need you", "img:n133", "cut", why="las manos de la familia")
O("you're not allowed to go yet", "stamp", 3.0, text="\"YOU'RE NOT ALLOWED TO GO YET\"", col=ROJO, rot=-4, x=960, y=330, size=56)
B("I had a family once, in Alamo Heights", "img:n134", "swipeL", why="Alamo Heights")
O("I had a family once, in Alamo Heights", "lugar", 3.4, tx="Alamo Heights", sub="a very loving family")
B("The doctors couldn't find a reason", "img:n135", "cut", why="la carpeta del hospicio")
B("have you told him it's okay", "img:r36", "cut", why="Rosa le pregunta a la esposa")
B("She closed the door", "img:r37", "cut", why="Rosa cierra la puerta")
B("she held his face in both her hands", "img:n136", "cut", why="las dos manos")
B("And he died that night, about two hours later", "img:n137", "fade", why="la ventana de noche")
B("Hold their hand. And tell them the truth", "img:n138", "cut", why="las manos entrelazadas")
O("That you love them", "libreta", 7.2, title="Tell them the truth", rows=[
    {"at": "That you love them", "tx": "I love you."}, {"at": "you're going to miss them so much", "tx": "I'm going to miss you so much."},
    {"at": "you're going to be okay", "tx": "I'm going to be okay."}, {"at": "That they can rest", "tx": "You can rest now."}])
B("That they can rest", "img:n139", "fade", why="el edredón alisado")
B("I said it to my own mother, in March of 2015", "img:r38", "cut", why="Rosa con la foto de su mamá")
O("I said it to my own mother, in March of 2015", "lugar", 3.6, tx="My mother's bedroom", sub="March 2015")
B("with the little handkerchief in her hands and Pedro Infante on the radio", "img:n140", "cut", why="la radio y el pañuelo")
O("Because when it's your own mother, honey, you're not a chaplain", "stamp", 3.0, text="YOU'RE A DAUGHTER", col=LILA, rot=-3, x=1300, y=330, size=78)

# =====================================================================================================================
# REPASO · las 9 en la libreta
# =====================================================================================================================
B("So let's put all nine together", "img:r39", "cut", why="Rosa abre la libreta")
O("Number one, they sleep more", "libreta", 30.0, title="The nine things", x=1480, w=760, rows=[
    {"at": "Number one, they sleep more", "tx": "1 · they sleep more"}, {"at": "Number two, they eat and drink less", "tx": "2 · eat and drink less"},
    {"at": "Number three, they talk to people we can't see", "tx": "3 · talk to people we can't see"}, {"at": "Number four, they talk about a trip", "tx": "4 · talk about a trip"},
    {"at": "Number five, they finish their business", "tx": "5 · finish their business"}, {"at": "Number six, they reach", "tx": "6 · reach, pick, look up"},
    {"at": "Number seven, they pull away", "tx": "7 · pull away"}, {"at": "Number eight, they wait for something", "tx": "8 · wait for something"},
    {"at": "And number nine, they need permission", "tx": "9 · need permission"}])
B("Every death is as different as every life", "img:n141", "cut", why="las fotos de familia")
B("Getting ready", "img:n142", "fade", why="el amanecer sobre el West Side")

# =====================================================================================================================
# TAREA · los nombres, el número de noche, una de las cinco frases
# =====================================================================================================================
B("I don't want you to just watch this and feel sad", "img:n143", "cut", why="la libreta y el café")
B("First. Write down the names", "img:r40", "cut", why="Rosa escribe")
O("First. Write down the names", "big", 3.2, text="1", sub="WRITE DOWN THE NAMES", x=1500, y=300, size=190, col=AZ)
B("today it's the only record that exists of her uncle", "img:n144", "cut", why="la libreta con la foto del tío")
B("put the night number on the refrigerator", "img:r41", "cut", why="Rosa pega la tarjeta en la heladera")
O("put the night number on the refrigerator", "tarjeta", 7.4, kicker="HOSPICE NIGHT LINE", title="Call. Any hour.", dato="24/7", mano="You're not bothering anybody.")
# 2º momento de la guía: «7 days a week, and you are allowed to use it» → el libro 1 abierto en «The team Medicare already pays for»
O("7 days a week, and you are allowed to use it", "guia", 9.6, pag="m20", tapa="tapa", kicker="BOOK 1 OF 5 · MEDICARE ALREADY PAYS FOR THIS", note="The team you're allowed to call")
B("I didn't know who to call", "img:n145", "cut", why="la heladera con la tarjeta")
B("we wish we had called sooner", "img:n146", "cut", why="el celular y el café frío")
B("And third. Say one of the five things today", "img:r42", "cut", why="Rosa toma la mano")
O("And third. Say one of the five things today", "big", 3.2, text="3", sub="SAY ONE OF THE FIVE THINGS TODAY", x=960, y=900, size=190, col=AZ)
B("The moment you have is the one you have", "img:n147", "fade", why="el limonero al sol")

# Comentarios + cadena al video 2 + cierre
B("Who are they talking to?", "img:r43", "cut", why="Rosa lee los comentarios")
O("Who are they talking to?", "comment", 5.4, text="My dad talked to his mother all week. She died in 1962. — San Antonio", x=1300, y=800)
B("You're not the only one awake tonight", "img:n148", "cut", why="las ventanas encendidas")
B("In the next video, I'm going to take you through the last forty-eight hours", "img:n149", "cut", why="el reloj y el calendario")
O("In the next video, I'm going to take you through the last forty-eight hours", "linea", 8.0, title="NEXT: THE LAST 48 HOURS", stages=[
    {"at": "the last forty-eight hours", "tx": "WEEKS"}, {"at": "Hour by hour", "tx": "DAYS"}, {"at": "the breathing that scares everybody", "tx": "HOURS", "sub": "what you'll see · what to do"}])
B("frozen in the doorway", "img:n151", "cut", why="la puerta de noche")
B("what Walt Pruitt did the night his daughter walked in from Houston", "fill", "cut", why="Walt")
B("she looked at me on the last morning", "img:n152", "fade", why="la luz de la mañana en el edredón")
O("mija, no tengas miedo", "dicho", 6.0, text="Mija, no tengas miedo. Ya me vinieron a buscar.", who="my mother, Doña Cuca · 2015")
B("mija, no tengas miedo", "bk:n78", "zoom", why="la frase de su mamá")
B("I've thought about that every single day for ten years", "img:r44", "cut", why="Rosa mira el limonero")
B("So don't be afraid, honey", "img:n153", "fade", why="el limonero por la ventana")
B("Go hold their hand", "img:r45", "fade", why="Rosa se despide")

# ---------------- medios disponibles ----------------
def clip_len(p):
    try: return round(float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p]).decode()), 2)
    except Exception: return 0.0
LTXD = PUB + f"{SL}/ltx/"; IMGD = PUB + f"{SL}/img/"
ltx_ok = {f[:-4] for f in os.listdir(LTXD) if f.endswith(".mp4")} if os.path.isdir(LTXD) else set()
VMAP = json.load(open("D:/rtmp_enhr01/ltx_vlog_mapa.json", encoding="utf8")) if os.path.exists("D:/rtmp_enhr01/ltx_vlog_mapa.json") else {}
img_ok = {f[:-4] for f in os.listdir(IMGD) if f.endswith(".jpg")} if os.path.isdir(IMGD) else set()
ASUMIR = "--asumir" in sys.argv  # sin fotos todavía: se asumen todas las del pedido (sólo mide, no escribe)
if (SIM or ASUMIR) and not img_ok:  # prueba sin fotos todavía: se asumen todas las del pedido
    img_ok = {k for k in json.load(open("D:/rtmp_enhr01/img/anclas.json", encoding="utf8"))} | {"f01", "f02"}
REF = set()
for b in BEATS:
    for p in re.split(r"[:|]", b["base"])[1:]: REF.add(p)
LTX_ALL = [x["id"] for x in json.load(open("D:/rtmp_enhr01/ltx/pedidos.json", encoding="utf8"))]
POOL_CLIP = [x for x in LTX_ALL if x not in REF]
# cada foto tiene SU frase (anclas.json / anclas2.json): el relleno de un segundo es la foto libre anclada más cerca de ese segundo
ANC = {}
ANCL = ("anclas_v2.json",) if os.path.exists("D:/rtmp_enhr01/img/anclas_v2.json") else ("anclas.json", "anclas2.json")  # v2: frases del guion v2
for fn in ("anclas.json", "anclas2.json", "anclas_v2.json"):
    if os.path.exists("D:/rtmp_enhr01/img/" + fn): ANC.update(json.load(open("D:/rtmp_enhr01/img/" + fn, encoding="utf8")))
if SIM: img_ok |= {k for fn in ("anclas2.json", "anclas_v2.json") if os.path.exists("D:/rtmp_enhr01/img/" + fn) for k in json.load(open("D:/rtmp_enhr01/img/" + fn, encoding="utf8"))}
AT = {}
for fn in ANCL:  # cada lista va en el orden del guion → búsqueda secuencial (no la 1ª coincidencia difusa)
    if not os.path.exists("D:/rtmp_enhr01/img/" + fn): continue
    c0 = cur; cur = 0
    for k, ph in json.load(open("D:/rtmp_enhr01/img/" + fn, encoding="utf8")).items():
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
        if c in ltx_ok and c not in used and c[3:] not in used:
            used.add(c); used.add(c[3:]); return {"k": "clip", "src": f"{SL}/ltx/{c}.mp4", "len": clip_len(LTXD + c + ".mp4"), "id": c}
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
        cid, fr, ln = VMAP[pid]; used.add("vl_" + pid); used.add(pid); used.add(cid)
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
                for kk2 in ("ok", "tacha"):
                    if isinstance(it.get(kk2), str):
                        v2 = T(it[kk2], o["a"]); it[kk2] = v2 if v2 is not None and v2 < o["b"] else round(o["a"] + 1.2 + 0.7 * o[lk].index(it), 2)
                if isinstance(it.get("at"), str):
                    a = T(it["at"], o["a"])
                    if a is not None and a < o["b"] + 6 and lk == "items": o["b"] = max(o["b"], round(a + 1.8, 2))  # QC 26-oct: el chip que se dice más tarde estira la pieza
                    it["at"] = a if a is not None and a < o["b"] else round(o["a"] + 0.6 + 0.7 * o[lk].index(it), 2)
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
    if o["k"] == "libreta" and (o.get("x") or 1500) >= 1400:  # QC 26-oct: la libreta va a la derecha (x 1500) y no le tapa la cara → puede ir sobre el avatar
        nv.append({**o, "a0": o["a"]}); continue
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
ov = sorted(nv, key=lambda o: o["a"])
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
        if p["k"] in SOLAS or p["b"] <= o["a"] or abs(o["a0"] - p["a0"]) < 0.6: continue  # las que entran juntas son un combo a propósito
        if not choca(o, p): continue
        if p["a"] - p["a0"] > 4.0 and o["a"] - o["a0"] < 1.5 and p["k"] not in ("cap", "big"): p["b"] = p["a"]; continue  # la corrida lejos de su frase cede el lugar (sale)
        keep = 3.0 if p["k"] == "cap" else 1.2  # lo mínimo que se ve la anterior (el capítulo, más)
        if o["a"] - p["a"] < keep: o["a"] = round(min(p["b"], p["a"] + keep) + 0.05, 2)  # la nueva espera (su final no se mueve)
        p["b"] = round(min(p["b"], o["a"] - 0.05), 2)
ov = [o for o in ov if o["b"] - o["a"] >= 1.0 or notes.append(f"pieza {o['k']} @{o['a']} quedó <1 s al encimarse → sale")]
lost = [n for n in notes if n.startswith("pieza")]

reel = os.path.exists(PUB + f"av/{SL}/reel0.mp4")
rl = clip_len(PUB + f"av/{SL}/reel0.mp4") if reel else 0
if not SIM and not ASUMIR:
    json.dump([{k: v for k, v in g.items() if k not in ("why", "ph", "id")} for g in segs], open(S + "segs.json", "w", encoding="utf8"), ensure_ascii=False)
    json.dump(ov, open(S + "ov.json", "w", encoding="utf8"), ensure_ascii=False)
    json.dump({"reel": reel, "reelLen": round(rl, 3), "end": round(END, 3)}, open(S + "avail.json", "w", encoding="utf8"))
    shots = [{"a": g["a"], "b": round(segs[i + 1]["a"] if i + 1 < len(segs) else END, 2), "k": g["k"], "src": g.get("src"), "len": g.get("len")} for i, g in enumerate(segs)]
    json.dump({"end": round(END, 3), "shots": shots}, open(S + "edl.json", "w", encoding="utf8"))

# ---------------- el plan minuto a minuto (una línea por plano) ----------------
def mmss(x): return f"{int(x // 60):02d}:{x % 60:04.1f}"
lines = [f"# {SL} · PLAN MxM (generado de plan_enhr01.py, escrito a mano plano por plano){' · SIMULADO sin voz' if SIM else ''} · END {mmss(END)}", "mm:ss-mm:ss · frase · plano · componente · sonido", ""]
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
