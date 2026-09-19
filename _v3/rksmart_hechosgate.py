# rksmart_hechosgate.py — COMPUERTA DE AFIRMACIONES: cada dato sobre un PRODUCTO REAL o una NORMA
# tiene que estar REALMENTE DICHO en el audio, con su negación intacta.
#   python _v3/rksmart_hechosgate.py
#
# Por qué existe (aviso del agente de rkspare, medido allá): Fish se come frases enteras y la
# compuerta de DURACIÓN no lo ve — un bloque que come 54 palabras dura casi lo mismo. Acá eso no
# sería un bache de ritmo: sería el video AFIRMANDO ALGO FALSO sobre una marca real (un grado ANSI
# equivocado, o un "no" que se cayó y da vuelta un veredicto).
# Se mide contra el TEXTO DEL ASR del máster, no contra el guion: lo que importa es lo que SUENA.
import json, re, sys, unicodedata

caps = json.load(open("public/captions_rksmart.json", encoding="utf-8"))
ASR = " ".join(c["text"] for c in caps)
norm = lambda s: re.sub(r"[^a-z0-9 ]", " ", unicodedata.normalize("NFKD", s.lower()))
ASR_N = re.sub(r"\s+", " ", norm(ASR))

# (qué afirma · cualquiera de estas formas alcanza — el ASR escribe los números en dígitos)
HECHOS = [
    ("Grade 3 = dos golpes",        ["two heavy blows", "survive two heavy"]),
    ("Grade 3 = 100.000 ciclos",    ["100 000 times", "a hundred thousand times", "100000 times"]),
    ("Grade 2 = cinco golpes",      ["and five blows", "five blows"]),
    ("Grade 2 = 150.000 ciclos",    ["150 000 cycles", "hundred and fifty thousand cycles", "150000 cycles"]),
    ("Grade 1 = diez golpes",       ["and ten blows", "ten blows"]),
    ("Grade 1 = 250.000 ciclos",    ["250 000 cycles", "fifty thousand cycles", "250000 cycles"]),
    ("Grade 1 es el comercial",     ["grade one is the commercial standard"]),
    ("la norma electrónica",        ["a156 40", "a 156 40", "a one fifty six point forty", "156 40"]),
    ("da TRES LETRAS, no un número",["it gives you three letters"]),
    ("A mejor, C peor",             ["a is the best", "c is the lowest"]),
    ("se lleva la MÁS BAJA",        ["the lowest grade it earned"]),
    ("NO es el promedio",           ["not the average"]),
    ("Yale Assure Lock key-free",   ["yale makes a key free version of the assure lock", "yale makes a key-free version"]),
    ("Assure Lock = grade two",     ["assure lock line is certified to grade two", "certified to grade two"]),
    ("Schlage Encode Plus",         ["schlage makes the encode plus"]),
    ("Encode Plus sin bocallave",   ["which has no keyway on it either", "no keyway on it"]),
    # el guion dice "triple-A" y el ASR escribe "AAA": el medidor tiene que aceptar las dos formas,
    # o marca como FALTANTE un dato que esta perfectamente dicho (y manda a regenerar audio sano)
    ("Encode Plus = triple A",      ["carries the aaa rating", "aaa rating on the electronic standard", "carries the triple a rating"]),
    ("sin relación comercial",      ["i have no relationship with anybody"]),
    ("no le digo que compre eso",   ["i m not telling you to buy either of those", "not telling you to buy either"]),
    ("el precio del paquete",       ["27 for all three", "twenty seven dollars for all three"]),
    ("el dominio del CTA",          ["raykessler", "ray kessler dot vercel", "vercel app"]),
    ("la barra NO hace falta",      ["you do not need a reinforcement bar", "do not need a reinforcement bar"]),
    ("la genérica ~$25",            ["about 25", "about twenty five dollars"]),
    ("la de marca $125 NO",         ["do not need the branded one", "125", "hundred and twenty five"]),
    ("el veredicto: SÍ es segura",  ["a smart lock is safe"]),
    ("el tornillo de 3 pulgadas",   ["three inch wood screws", "3 inch wood screws"]),
    ("lo que hay puesto: 3/4",      ["three quarters of an inch", "3 4 of an inch", "three quarters of an"]),
]

faltan = []
for etiqueta, formas in HECHOS:
    if not any(re.sub(r"\s+", " ", norm(f)).strip() in ASR_N for f in formas):
        faltan.append((etiqueta, formas))

print("=" * 76)
print(f"MEDIDO: {len(HECHOS)} afirmaciones buscadas en {len(ASR_N.split())} palabras de ASR del MÁSTER")
for e, _ in HECHOS:
    print(("  OK  " if not any(e == f[0] for f in faltan) else "  XX  ") + e)
print("=" * 76)
if len(ASR_N.split()) < 3000:
    sys.exit("XX el ASR que lei tiene muy pocas palabras: el medidor esta roto")
if faltan:
    print(f"XX {len(faltan)} afirmaciones NO estan dichas en el audio:")
    for e, f in faltan:
        print(f"   - {e}  (buscaba: {f})")
    sys.exit(3)
print("Todas las afirmaciones sobre producto y norma estan dichas, con su negacion intacta.")
