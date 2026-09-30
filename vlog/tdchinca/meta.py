# meta.py — public/tdchinca_meta.json (título literal de la tarjeta + descripción + comentario fijado) con los
# capítulos sacados del timeline GLOBAL real (vlog/tdchinca/global.json).
import json
R = 'D:/Proyectos/video2-wt/tdchinca/'
G = {g['id']: g for g in json.load(open(R + 'vlog/tdchinca/global.json', encoding='utf8'))['G']}
def ts(b):
    t = int(G[b]['start']) if b != 'b001' else 0
    return f'{t // 60}:{t % 60:02d}'
CAP = [('b001', 'La prueba de la manguera'), ('b019', 'La receta completa, con medidas'), ('b032', '¿Se puede guardar para el otro día?'),
       ('b037', '¿Kilos o jarras? La proporción que no falla'), ('b042', '¿Sirve sobre pintura vieja? La prueba de la gota'),
       ('b049', 'Seguridad y qué cal comprar'), ('b060', 'Cómo prepararla paso a paso'), ('b079', 'La hoja con todo'),
       ('b086', 'Cómo preparar la pared'), ('b100', 'El error de Ramiro y la primera mano'), ('b114', 'Segunda y tercera mano, color'),
       ('b127', 'El curado'), ('b133', 'La versión para adentro y sus límites'), ('b144', 'La prueba final con el vecino'),
       ('b152', 'El error del cuarto ingrediente'), ('b158', 'Resumen')]
GUIA = ("🔧 LA COLECCIÓN DEL CONSTRUCTOR LIBRE — el Manual de Reparaciones Caseras (76 arreglos, con «Pintura sobre pared que no se descascara», "
        "«Qué pintura va en cada ambiente» y «La pared que mancha la pintura desde abajo») + la Guía Anti-Humedad, Moho y Goteras + El Taller de $50 + "
        "la Hoja de Compras y las Fichas de Emergencia. Pago único · garantía de 7 días · descarga inmediata.\n"
        "👉 https://constructorlibre.com/?src=tfb-pintura")
TRUCO = ("EL TRUCO QUE MENCIONÉ EN EL VIDEO → para las paredes que se mojan mucho con la lluvia.\n"
         "En las dos últimas manos, agrega aceite de linaza crudo: medio litro por cada balde de 20 litros de pintura de cal ya preparada. "
         "Échalo de a chorritos mientras revuelves fuerte, hasta que no veas gotas de aceite flotando.\n"
         "El aceite ayuda a que la lluvia resbale en vez de empapar la cal. El tono queda apenas más cremoso: pruébalo antes en un pedazo.\n"
         "Sólo afuera y sólo en las manos finales: la primera mano va sin aceite, para que la cal entre en los poros. "
         "Y los trapos con aceite de linaza, extendidos a secar al aire libre: hechos un bollo pueden prenderse fuego solos.")
BODY = ("La pintura de cal con cemento blanco es de las cosas más baratas y más viejas que existen para pintar una casa, y bien hecha no se descascara. "
        "Mal hecha, te deja la mano blanca a los pocos meses. En este video la preparo y la aplico de principio a fin, con las medidas exactas y los errores que la arruinan:\n\n"
        "• La receta, todo medido con la misma jarra: 4 de cal hidratada, 1 de cemento blanco, un puñado de sal gruesa disuelta en agua caliente y agua (más o menos el doble que de polvo) hasta que quede como leche.\n"
        "• Por qué no se guarda para el otro día cuando lleva cemento, y por qué la cal sola sí.\n"
        "• Kilos o jarras: por qué medir en volumen con el mismo recipiente.\n"
        "• Dónde NO sirve: sobre látex, esmalte, pintura plástica o yeso pintado se agarra mal. La prueba de la gota para saber si tu pared es mineral.\n"
        "• Cómo preparar la pared: raspar lo flojo, cepillar, tapar piso y ventanas, y mojarla antes de pintar.\n"
        "• Tres o cuatro manos finas y cruzadas (nunca una gruesa), y el curado con rocío de agua los días siguientes.\n"
        "• Color con pigmentos minerales, en tonos suaves.\n"
        "• La versión para adentro: cal sola, sal y agua.\n\n"
        "⚠️ La cal y el cemento son cáusticos: usa gafas y guantes. Si te salta cal a los ojos, lávalos con abundante agua limpia y ve al médico. "
        "El acabado es mate, tipo tiza, y no es pintura lavable. Si la pared tiene humedad que sube del piso, primero hay que resolver eso.\n\n")
chap = '\n'.join(f'{ts(b)} {t}' for b, t in CAP if b in G)
desc = GUIA + '\n\n' + TRUCO + '\n\n' + BODY + chap + '\n\n#pinturadecal #pinturacasera #cal #hazlotumismo #constructorlibre'
meta = {'title': 'LOCO O GENIO: Pinté la Casa con CEMENTO, CAL y AGUA — Pintura de $2 Que No Se Cae', 'description': desc, 'pinned_comment': GUIA + '\n\n' + TRUCO}
json.dump(meta, open(R + 'public/tdchinca_meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(desc), 'caracteres ·', len(meta['title']), 'título')
