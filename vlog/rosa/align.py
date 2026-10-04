# align.py <slug> — alineación GLOBAL guion<->ASR (difflib) -> ms por palabra, momentos y sección de cada uno.
# Entradas: canales/<slug>_GUION.txt (párrafos separados por línea en blanco) · public/captions_<slug>.json (ASR por palabra)
# Salidas : D:/rtmp/<slug>/wordms.json, moments.json
import json, re, difflib, sys, unicodedata, statistics as st
slug = sys.argv[1]
REPO = "C:/Users/bauti/Downloads/video2/"
SCRIPT = REPO + f"canales/{slug}_GUION.txt"
CAP = REPO + f"public/captions_{slug}.json"
OUT = f"D:/rtmp/{slug}/"
import os; os.makedirs(OUT, exist_ok=True)

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]", "", w)

NUMS = {n: i for i, n in enumerate("uno dos tres cuatro cinco seis siete ocho nueve diez once doce trece catorce quince dieciseis diecisiete dieciocho diecinueve veinte veintiuno veintidos veintitres veinticuatro veinticinco veintiseis veintisiete veintiocho veintinueve treinta treintaiuno treintaidos treintaitres treintaicuatro treintaicinco treintaiseis treintaisiete treintaiocho treintainueve cuarenta cuarentaiuno cuarentaidos cuarentaitres cuarentaicuatro cuarentaicinco".split(), 1)}

for _u, _n in enumerate("uno dos tres cuatro cinco seis siete ocho nueve".split(), 1): NUMS["treintay" + _n] = 30 + _u; NUMS["cuarentay" + _n] = 40 + _u
text = open(SCRIPT, encoding="utf8").read()
paras = [p.strip() for p in text.split("\n\n") if p.strip()]
sw = []
for pi, p in enumerate(paras):
    for w in p.split(): sw.append((w, pi))

cap = json.load(open(CAP, encoding="utf8"))
cap = cap["words"] if isinstance(cap, dict) and "words" in cap else cap
def g(c, *ks):
    for k in ks:
        if k in c and c[k] is not None: return c[k]
aw = [str(g(c, "word", "text")).strip() for c in cap]
ast = [float(g(c, "start") if g(c, "start") is not None else g(c, "startMs") / 1000) for c in cap]
aen = [float(g(c, "end") if g(c, "end") is not None else g(c, "endMs") / 1000) for c in cap]
A = [norm(w) for w in aw]; S = [norm(w) for w, _ in sw]
sm = difflib.SequenceMatcher(None, S, A, autojunk=False)
ms_in = [None] * len(S); ms_out = [None] * len(S)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            ms_in[i1 + k] = ast[j1 + k] * 1000; ms_out[i1 + k] = aen[j1 + k] * 1000
    elif tag == "replace" and j2 > j1:
        t0, t1 = ast[j1] * 1000, aen[j2 - 1] * 1000; n = i2 - i1
        for k in range(n):
            ms_in[i1 + k] = t0 + (t1 - t0) * k / n; ms_out[i1 + k] = t0 + (t1 - t0) * (k + 1) / n
matched = sum(1 for x in ms_in if x is not None)
for i in range(len(S)):
    if ms_in[i] is None:
        a = next((j for j in range(i - 1, -1, -1) if ms_out[j] is not None), None)
        b = next((j for j in range(i + 1, len(S)) if ms_in[j] is not None), None)
        t0 = ms_out[a] if a is not None else 0; t1 = ms_in[b] if b is not None else t0 + 300
        ms_in[i] = t0; ms_out[i] = max(t0, t1)
for i in range(1, len(S)):
    if ms_in[i] < ms_in[i - 1]: ms_in[i] = ms_in[i - 1]
    if ms_out[i] < ms_in[i]: ms_out[i] = ms_in[i]
words = [{"w": w, "p": p, "in": round(ms_in[i]), "out": round(ms_out[i])} for i, (w, p) in enumerate(sw)]
json.dump(words, open(OUT + "wordms.json", "w", encoding="utf8"), ensure_ascii=False)
print(f"ancla exacta {matched}/{len(S)} = {matched/len(S):.1%}")

# frases y sub-frases
sents, cur = [], []
for i, x in enumerate(words):
    cur.append(i)
    if re.search(r"[.!?:]\W*$", x["w"]) or i == len(words) - 1: sents.append(cur); cur = []
def split_long(idx):
    dur = (words[idx[-1]]["out"] - words[idx[0]]["in"]) / 1000
    if dur <= 7.5: return [idx]
    cuts = [k for k in range(3, len(idx) - 3) if words[idx[k]]["w"].endswith(",")]
    if not cuts:
        mid = len(idx) // 2; return split_long(idx[:mid]) + split_long(idx[mid:])
    k = min(cuts, key=lambda k: abs(k - len(idx) / 2))
    return split_long(idx[:k + 1]) + split_long(idx[k + 1:])
frags = []
for s in sents: frags += split_long(s)
moments = [{"i": 0, "p": words[fr[0]]["p"], "text": " ".join(words[k]["w"] for k in fr), "ms_in": words[fr[0]]["in"], "ms_out": words[fr[-1]]["out"], "w0": fr[0], "w1": fr[-1]} for fr in frags]
merged = []
for m in moments:
    if merged and (merged[-1]["ms_out"] - merged[-1]["ms_in"]) < 2200 and merged[-1]["p"] == m["p"]:
        merged[-1]["text"] += " " + m["text"]; merged[-1]["ms_out"] = m["ms_out"]; merged[-1]["w1"] = m["w1"]
    else: merged.append(dict(m))
# cada momento se estira hasta el inicio del siguiente (cobertura 100 % por construcción)
for i, m in enumerate(merged):
    m["i"] = i
    if i + 1 < len(merged): m["ms_out"] = max(m["ms_out"], merged[i + 1]["ms_in"])
merged[0]["ms_in"] = 0

# sección/ítem de cada párrafo
sec = {}
cur = "hook"
for pi, p in enumerate(paras):
    head = p[:220]
    num = None
    m2 = re.match(r"(?:Y ahora, atenci[oó]n, que viene |Y ya, la [uú]ltima\. La que te promet[ií]\. |Y ya, el [uú]ltimo\. El que te promet[ií]\. |Y ahora s[ií], |Y ahora, )?(?:[Ll]a n[uú]mero|[Ee]l truco n[uú]mero) (\w+(?: y \w+)?)", p)
    if m2 and norm(m2.group(1)) in NUMS and cur not in ("hook",): num = NUMS[norm(m2.group(1))]
    m3 = re.match(r"(?:Y ahora s[ií], )?la (\w+), la que te prometí", p)
    if m3 and norm(m3.group(1)) in NUMS and cur not in ("hook",): num = NUMS[norm(m3.group(1))]
    if re.match(r"Pasa, si[eé]ntate", p): cur = "intro"
    elif p.startswith("Y antes de empezar, déjame explicarte por qué hoy hablo de esto") or re.match(r"(Cuando una persona queda sola|Yo pasé por eso|Desde entonces tengo una regla)", p): cur = "porque"
    elif p.startswith("Y antes de seguir, quiero enseñarte las cinco cosas") or re.match(r"(Primero, pan\.|Segundo, queso\.|Tercero, huevos\.|Cuarto, tomates y fruta|Y quinto, latas|Con esas cinco cosas)", p): cur = "cinco"
    elif p.startswith("Y a mitad de camino, déjame hablarte del cansancio que no se ve") or re.match(r"(Hay un cansancio de piernas|Yo lo conozco bien|Por eso estas comidas no son solo|Si hoy estás cansado de ese cansancio)", p): cur = "cansancio"
    elif p.startswith("Una última cosa. Hay una hora"): cur = "hora"
    elif p.startswith("Y antes de seguir, déjame hablarte de la carnicería") or re.match(r"(La carnicería de don Aurelio|Don Aurelio era un hombre|Mi madre y él tenían una sociedad|Y de ese mostrador salió)", p): cur = "carniceria"
    elif p.startswith("Y aquí, a mitad de camino, quiero contarte cómo se cocinaba en el campo") or re.match(r"(En el campo no había nevera|Por eso nacieron tantos trucos|Y de esas cocinas de campo bajaron|Hoy, cuando guiso un trozo duro)", p): cur = "campo"
    elif p.startswith("Y para entender estos trucos, primero hay que entender") or p.startswith("La carne tiene fibras"): cur = "fibras"
    elif p.startswith("Te voy a contar una última historia") or re.match(r"(Esa noche lloré en la cocina|Al domingo siguiente, hice otro asado)", p): cur = "historia"
    elif p.startswith("Y para empezar bien, déjame explicarte cómo era el calendario") or re.match(r"(El día uno del mes|Y así, mes tras mes)", p): cur = "calendario"
    elif p.startswith("Y antes de seguir, déjame contarte cómo se ponía la mesa") or re.match(r"(El mantel siempre estaba limpio|Nadie se servía antes|Y al terminar, nadie dejaba|Mi madre me enseñó que la dignidad)", p): cur = "mesa"
    elif p.startswith("Y a mitad de camino, quiero decirte lo que me enseñó el fin de mes") or re.match(r"(Me enseñó a (planificar|compartir|no esconder)|Y me enseñó a agradecer|Ahora entiendo que no fuimos pobres)", p): cur = "ensenanza"
    elif p.startswith("Hay una frase de mi madre que guardo") : cur = "frase"
    elif p.startswith("Y antes de seguir, una cosa sobre las medidas") or re.match(r"(Medía con las manos|Cuando yo empecé a cocinar, quise|Por eso, cuando alguien me pregunta cuánto)", p): cur = "medidas"
    elif p.startswith("Y ahora, a mitad de camino, déjame hablarte de los errores") or re.match(r"El error (de la prisa|de la sal temprana|de destapar|de apretar)|Y el error de desperdiciar", p): cur = "errores"
    elif p.startswith("Hay algo más que quiero decirte, y es sobre la libreta") or p.startswith("Cuando era niña, le pregunté una vez") or p.startswith("No supe qué decirle") or p.startswith("Yo escribo lo que puedo"): cur = "libreta"
    elif p.startswith("Y no creas que estos trucos son cosa del pasado") or p.startswith("Lo que sí ha cambiado es el tiempo") or p.startswith("Porque al final, todos estos trucos"): cur = "hoy"
    elif p.startswith("Y aquí, a mitad de camino, déjame enseñarte los cinco") or re.match(r"(El primero: el pan|El segundo: espesar|El tercero: la papa|El cuarto: el huevo|Y el quinto, el más importante)", p): cur = "trucos"
    elif p.startswith("Y antes de seguir, tengo que contarte de la tienda") or p.startswith("La tienda de don Ramiro") or p.startswith("Uno entraba, saludaba") or p.startswith("Ese viernes pagaba") or p.startswith("Cuando pienso en las cenas de los setenta"): cur = "tienda"
    elif p.startswith("Y antes de empezar, quiero mostrarte esa despensa") or re.match(r"(La lata de atún\.|La maicena\.|El sobre de sopa\.|La leche en polvo\.|Y la libreta\.)", p): cur = "despensa"
    elif p.startswith("Y antes de las últimas, déjame contarte cómo era una cocina compartida") or p.startswith("En mi cuadra éramos cinco") or p.startswith("Mientras se amasaba") or p.startswith("Y cuando una de nosotras") or p.startswith("Hoy casi nadie comparte la cocina"): cur = "cocina"
    elif p.startswith("Y te voy a contar el día en que no hubo nada"): cur = "nada"
    elif p.startswith("Hay una cosa más que quiero decirte, y es sobre los domingos") or p.startswith("Los domingos de los años setenta") or p.startswith("Y de noche, cuando ya todos") or p.startswith("Hoy, cuando cocino una de estas cenas para mí"): cur = "domingos"
    elif p.startswith("Quiero contarte también algo de mi madre y su lata") or p.startswith("Mi madre guardaba las latas") or p.startswith("Cuando ella murió, encontré"): cur = "lata"
    elif p.startswith("Y quiero añadir algo sobre la olla del barrio") or p.startswith("En mi cuadra había una olla comunitaria") or p.startswith("Aquella olla recorrió"): cur = "barrio"
    elif p.startswith("Y antes, un momento para ponernos") or p.startswith("Las cocinas eran pequeñas") or p.startswith("Ahora sí. Vamos con la primera"): cur = "epoca" if not p.startswith("Ahora sí") else cur
    elif p.startswith("Y antes de seguir, quiero que mires") or re.match(r"(Primero, la olla|Segundo, la radio|Tercero, el mantel|Cuarto, el teléfono|Y quinto, la ventana)", p): cur = "objetos"
    elif p.startswith("Y aquí, a mitad de camino") or re.match(r"El (lunes|martes|miércoles|jueves|viernes|sábado) ", p) or p.startswith("Y el domingo, el día") or p.startswith("Así, sin planilla"): cur = "diasemana"
    elif p.startswith("Y a estas alturas ya habrás notado") or p.startswith("Eso es lo que me gustaría que te llevaras") or p.startswith("Y si hoy cocinas para una o dos personas"): cur = "mirada"
    elif p.startswith("Si no sabes por cuál empezar"): cur = "elegir"
    elif p.startswith("Antes de empezar con la lista") or p.startswith("La primera: usa") or p.startswith("La segunda:") or p.startswith("Y la tercera"): cur = "reglas"
    elif p.startswith("Antes de cocinar, una cosa") or p.startswith("Arroz. Lentejas") or p.startswith("¿Sabes por qué te lo digo"): cur = "despensa"
    elif p.startswith("Y aquí quiero detenerme") or p.startswith("¿Te acuerdas de la olla grande") or p.startswith("Esa misma tarde fui") or p.startswith("Eso es la olla pequeña"): cur = "interludio"
    elif p.startswith("Y ahora, a mitad de camino") or p.startswith("Mi sistema es muy simple") or p.startswith("Los frascos son") or p.startswith("Y la libreta") or p.startswith("Seguimos con la veintiuno"): cur = "semana"
    elif p.startswith("Ya sé lo que estás pensando") or re.match(r"El (primer|segundo|tercer|cuarto) error", p) or p.startswith("Y el quinto") or p.startswith("Si hoy comes solo, y esta noche"): cur = "errores"
    elif p.startswith("Te voy a contar algo que no le he contado") or p.startswith("Esa sopa fue su receta") or p.startswith("Por eso te digo que estas cenas") or p.startswith("Y ahora, déjame hablarte") or p.startswith("Comer solo no es lo mismo") or p.startswith("Yo empecé esta lista") or p.startswith("Por eso cada una"): cur = "corazon"
    elif p.startswith("Y si no sabes por cuál") or p.startswith("Si hoy") or p.startswith("Cualquiera de estas"): cur = "elegir"
    elif p.startswith("Hoy te di treinta") or p.startswith("Las medidas exactas") or p.startswith("Y ahora, repasemos") or p.startswith("En el próximo video") or p.startswith("Gracias por sentarte") or p.startswith("Aquí estaré"): cur = "cierre"
    elif num is not None: cur = f"i{num}"
    sec[pi] = cur
for m in merged: m["item"] = sec[m["p"]]
durs = sorted((m["ms_out"] - m["ms_in"]) / 1000 for m in merged)
print(f"momentos {len(merged)} · mediana {st.median(durs):.2f} · p75 {durs[int(len(durs)*.75)]:.2f} · max {max(durs):.1f} · >=5s {sum(d>=5 for d in durs)/len(durs):.0%} · audio {merged[-1]['ms_out']/60000:.1f} min")
json.dump(merged, open(OUT + "moments.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
from collections import Counter
print(Counter(m["item"] for m in merged))
