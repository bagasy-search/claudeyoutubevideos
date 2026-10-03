# meta.py — public/tdcrola_meta.json: título literal de la tarjeta + descripción + comentario fijado (capítulos del timeline GLOBAL real)
import json
R = 'D:/Proyectos/video2-wt/tdcrola/'
G = {g['id']: g for g in json.load(open(R + 'vlog/tdcrola/global.json', encoding='utf8'))['G']}
def ts(b):
    t = int(G[b]['start']) if b != 'b001' else 0
    return f'{t // 60}:{t % 60:02d}'
CAP = [('b001', 'El resultado: una estaca en 8 segundos'), ('b009', 'El problema: 100 estacas para un alambrado'), ('b020', 'El rotomartillo del volquete'),
       ('b026', 'La chatarra que vas a necesitar'), ('b034', 'Los 6 pasos'), ('b038', 'Paso 1: dejar el rotomartillo andando (y el modo de percusión)'),
       ('b046', 'Cómo funciona por dentro'), ('b051', 'Pasos 2 y 3: el vástago y el caño'), ('b062', 'Paso 4: la tapa'), ('b065', 'Paso 5: soldar'),
       ('b072', 'Paso 6: preparar las estacas'), ('b077', 'Primera prueba: se rompe'), ('b085', 'Por qué se rompió'), ('b093', 'El arreglo'),
       ('b105', 'La prueba de fuego: 8 segundos'), ('b114', 'La técnica'), ('b119', 'Contra la maza, y los límites honestos'), ('b131', 'Las 100 estacas y la vuelta de tuerca')]
MAT = ("LISTA DE MATERIALES (todo chatarra)\n"
       "• Rotomartillo SDS-max viejo (el mío salió de un volquete), usado SIEMPRE en modo de percusión, sin rotación\n"
       "• Caño de 76 mm de diámetro exterior (pared ~4 mm), 10 cm de largo (de un bastidor de cama)\n"
       "• Chapa de 10 mm para la tapa (la mía, de una tapa de alcantarilla), con un agujero de 18 mm en el centro\n"
       "• 10 cm de la cola de una mecha SDS-max rota (acero templado: hay que precalentarla antes de soldar)\n"
       "• Electrodos básicos de 2,5 mm, disco de corte, arena seca\n"
       "• Estacas de eucalipto de 2×2 pulgadas y 80 cm, con las 4 esquinas de la cabeza biseladas a 45° (la diagonal de la estaca, 70 mm, no entra en un caño que mide 68 mm por dentro)")
SEG = ("⚠️ SEGURIDAD: anteojos, protección de oídos y guantes. Rotomartillo SIEMPRE en martillo solo (sin rotación). Nunca la mano cerca de la estaca. "
       "Careta de soldar antes de encender el arco, y ropa de algodón o cuero. Antes de clavar, fíjate por dónde pasan caños y cables enterrados. "
       "Hace falta corriente: yo usé un alargue de 30 m.")
LIM = ("LÍMITES (sin trampa): los 8 segundos son con una estaca de 2×2 y unos 40 cm enterrados, en tierra blanda de patio, sin piedras. En tierra seca y dura (sin mojar) me tardó 20 segundos. "
       "Si hay una piedra, la estaca rebota. Con la maza, en el mismo suelo, tardó 3 min 30 s. No lo probé con postes gruesos de 4 pulgadas; los esquineros siguen yendo a pala.")
BODY = ("Un rotomartillo que alguien tiró a la basura, un caño, una chapa y la cola de una mecha rota: así armé un hincapostes que clava una estaca en 8 segundos. "
        "Te muestro los 6 pasos con las medidas, y los dos errores que me rompieron las primeras estacas (tapa de 3 mm que se dobla y soldadura sobre acero templado en frío), con su solución.")
chap = '\n'.join(f'{ts(b)} {t}' for b, t in CAP if b in G)
Q = "¿Qué harías vos con un rotomartillo viejo?"
desc = (SEG + '\n\n' + BODY + '\n\n' + MAT + '\n\n' + LIM + '\n\n' + chap +
        "\n\nSi te gustan estos inventos con chatarra, suscríbete: en el próximo video doblo un caño en un círculo perfecto con la chatarra que me sobró.\n\n" + Q +
        "\n\n#hincapostes #rotomartillo #chatarra #inventoscaseros #taller")
meta = {'title': 'Hice un hincapostes con un rotomartillo viejo — clava una estaca en 8 segundos', 'description': desc, 'pinned_comment': MAT + '\n\n' + Q}
json.dump(meta, open(R + 'public/tdcrola_meta.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)
print(len(desc), 'caracteres'); print(chap)
