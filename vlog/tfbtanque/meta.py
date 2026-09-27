# public/tfbtanque_meta.json — título literal de la tarjeta + descripción value-first + comentario fijado.
# Cada ítem de la guía verificado contra manual-reparaciones-caseras/content/oferta.ts y guia/manual.json (arreglos 31 y 67).
# Capítulos desde global.json (inicio real de cada segmento). uso: python vlog/tfbtanque/meta.py
import json
R = 'D:/Proyectos/video2-wt/tfbtanque/'
G = json.load(open(R + 'vlog/tfbtanque/global.json', encoding='utf8'))
st = {s['seg']: s['f0'] / 30 for s in G['segs']}
def mmss(t): t = int(t); return f'{t // 60}:{t % 60:02d}'
CAP = [(0, 'La grieta que tira agua (y lo que dice el vecino)'), (st['S1'], 'El arreglo completo en un minuto'), (st['S2'], 'Por qué el pegamento no agarra'),
       (st['S3'], 'Qué plástico es tu tanque (y la trampa de las tapitas)'), (st['S4'], 'Agua potable: qué va adentro y qué no'), (st['S5'], 'La herramienta y el punto justo del calor'),
       (st['S6'], 'La hoja que tienes que guardar'), (st['S7'], 'Marcar la grieta y frenarla con 2 agujeritos'), (st['S8'], 'Abrir en V y fundir con el borde'),
       (st['S9'], 'La malla: solo afuera y a media altura'), (st['S10'], 'Por dentro, y cómo enfriarlo'), (st['S11'], 'La base y la prueba de 24 horas'),
       (st['S12'], 'Los 3 errores y cuándo cambiar el tanque'), (st['S13'], 'La prueba de la gota: por qué el pegamento nunca sirve')]
GUIA = ("🔧 LA COLECCIÓN DEL CONSTRUCTOR LIBRE — el Manual de Reparaciones Caseras (76 arreglos, con «Caño que pierde, arreglado sin soldar» y «El agua que se va sin que la veas») "
        "+ la Guía Anti-Humedad y Moho + la Hoja de Compras + la guía exclusiva de herramientas y las Fichas de Emergencia. Pago único · garantía de 7 días · te llega al correo apenas compras.\n"
        "👉 https://constructorlibre.com/?src=tfb-tanque")
TRUCO = ("EL TRUCO QUE MENCIONÉ EN EL VIDEO → la grieta en una curva o en una esquina del tanque, donde la malla no se acomoda.\n"
         "Ahí van grapas en vez de malla. Corta trozos de alambre de acero inoxidable de 0,8 mm y dóblalos en U, de 15 mm de ancho.\n"
         "Con la grieta ya abierta en V y rellena, apoya cada grapa cruzando la grieta y caliéntala con la punta del cautín hasta que se hunda a la mitad del espesor del plástico (que nunca lo atraviese).\n"
         "Una cada 10 mm, alternando un poco el ángulo, en zigzag. Después tápalas todas con una capa de plástico del mismo número, con los bordes en rampa.\n"
         "Solo por fuera: por dentro, donde toca el agua, nada de metal.")
BODY = ("Un tanque de plástico rajado casi siempre se puede arreglar, pero no con pegamento: el polietileno casi no pega con nada, y con la presión del agua y el sol se despega. "
        "En este video lo cierro fundiendo el mismo plástico, de principio a fin:\n\n"
        "• Cómo saber de qué plástico es tu tanque (el triángulo con 2, 4 o las letras PE) y por qué muchas tapitas de refresco no sirven (son 5, polipropileno).\n"
        "• Marcar la grieta con el tanque lleno y hacer un agujerito de 3 mm en cada punta para que no siga avanzando.\n"
        "• Abrir la grieta en V y rellenarla con tiras de un bidón del mismo número, fundidas JUNTO con el borde del tanque.\n"
        "• La malla metálica solo por fuera, 2 cm más grande que la grieta por cada lado y hundida a media altura; por dentro, una capa de plástico limpio sin malla (es agua para tomar).\n"
        "• Enfriar 30 minutos a la sombra, sin agua, y la prueba de llenado de 24 horas con un papel seco debajo.\n"
        "• Por qué el pegamento, la silicona y la cinta se despegan: la prueba de la gota.\n\n"
        "Cuándo NO vale la pena y conviene cambiar el tanque: grieta de más de un palmo o varias grietas, grieta en la base o en la rosca de salida, o plástico que se quiebra como galleta al doblarlo (cristalizado por el sol). "
        "Los tanques viejos grises de fibrocemento no se raspan ni se lijan (pueden tener amianto): se reemplazan. Los de fibra de vidrio se arreglan con resina, no con este método.\n"
        "Cuando digo \"sin soldar\" hablo de soldadura de metal: aquí no hay soldador ni equipo, se funde el mismo plástico del tanque con un cautín.\n\n"
        "Seguridad: el humo del plástico no se respira (al aire libre o con la puerta abierta). Si el tanque está en altura: vacíalo, escalera firme y entre dos; mejor bajarlo.\n\n"
        "CAPÍTULOS\n" + "\n".join(f"{mmss(t)} {n}" for t, n in CAP) + "\n\n"
        "Cuéntame en los comentarios: ¿de qué plástico es tu tanque y dónde se rajó?")
meta = {"title": "Cómo Reparar un TANQUE de Agua Rajado por $2 (Sin Soldar, 100% Efectivo)",
        "description": GUIA + "\n\n" + TRUCO + "\n\n" + BODY,
        "pinned_comment": GUIA + "\n\n" + TRUCO}
assert "Claudio" not in json.dumps(meta, ensure_ascii=False)
json.dump(meta, open(R + 'public/tfbtanque_meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(meta['description']), 'caracteres de descripción ·', len(CAP), 'capítulos')
