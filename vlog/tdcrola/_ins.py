F = 'vlog/tdcrola/beats.txt'
L = open(F, encoding='utf8').read().split('\n')
def ins(anchor, block):
    idx = [i for i, l in enumerate(L) if anchor in l]
    assert len(idx) == 1, (anchor, len(idx))
    L[idx[0] + 1:idx[0] + 1] = block.strip().split('\n')
def rep(a, b):
    idx = [i for i, l in enumerate(L) if a in l]; assert len(idx) == 1, a
    L[idx[0]] = L[idx[0]].replace(a, b)

# cierre: partir el último beat (muy largo)
rep(' En el próximo, algo para calentar el galpón con una garrafa vieja. Pero antes, el paso que nunca hay que saltarse. Nos vemos en el taller.',
    ' En el próximo, algo para calentar el galpón con una garrafa vieja. Pero antes, el paso que nunca hay que saltarse.')
L.append("[PD|A: he waves to the camera with the ring roller behind him and the nephew waving from the gate|K: he stands waving with a warm smile, the nephew waving behind him at the gate, ending] Nos vemos en el taller.")

ins('Mi sobrino Nico tiene un portón', """
[PA|A: he walks along the gate frame running a hand along its top bar, looking at it|K: he stands by the gate frame resting a hand on its top bar, looking at the camera] Es el portón de la casa de la abuela. Lo hizo el abuelo, de hierro, y se oxidó tanto que hubo que rehacerlo.
""")
ins('Yo probé doblarlo a mano', """
[PA|A: he leans a long steel tube across a vice and pushes down on its free end with his body weight, the tube bowing unevenly|K: he leans on the long tube in the vice with his whole weight, the tube bending unevenly with a flat spot, looking at it grimly] Con la morsa y mi peso se dobla, pero por donde quiere: se achata en un punto y queda recto en otro.
""")
ins('Ahí se me ocurrió: una roladora', """
[PA|A: he kneels and sketches three circles and an arrow on the concrete with chalk|K: he kneels beside three chalk circles drawn on the concrete with an arrow, looking at the camera] La idea es simple: dos rodillos abajo, uno arriba. El caño pasa por el medio, y el de arriba lo empuja.
""")
ins('El inventario. Todo lo que llevan', """
[G1|A: he picks up a washing-machine drum bearing from a box of old parts, looking at it|K: he holds an old washing-machine bearing up between two fingers, looking at the camera] Los rulemanes salen de un lavarropas roto: en cualquier service hay tambores tirados, con los rulemanes adentro.
""")
ins('Planchuela de diez milímetros, de un portón viejo', """
[G1|D: close view of three steel pulleys with V-grooves lying on a wooden workbench || the same pulleys stacked, one held up toward the camera] Las poleas son de un motor viejo y de un compresor. Pero ya te cuento qué hay que cambiarles.
""")
ins('Si te gustan estos inventos con chatarra', """
[GT|A: he lays three steel pulleys on the workbench in a triangle, two low and one high, tapping each with a finger|K: he points with a pencil at three pulleys arranged two low one high on the bench, looking at the camera] Primero, cómo funciona. Dos rodillos abajo, separados. Y uno arriba, justo en el medio de los dos.
[GT|A: he lays a tube across the two lower pulleys and presses down on the top one with a finger|K: he presses down on the top pulley with a finger over a tube resting on two lower pulleys, looking at the camera] Cuando bajas el de arriba, el caño se dobla solo en ese punto, porque no tiene dónde apoyarse.
[GT|A: he slides the tube a few centimetres along and presses again, repeating the motion|K: he slides the tube along the pulleys and presses the top one again, looking at the camera] Lo haces avanzar, y se dobla el tramo siguiente. Y así, tramo a tramo, el caño termina cerrando un círculo.
[GT|A: he presses the top pulley lower with a finger and the curve on the tube gets tighter, showing it with his other hand|K: he holds a more tightly curved tube against the pulleys, looking at the camera] Cuanto más bajas el de arriba, más cerrada la curva. Por eso la ranura del bastidor: ahí corre ese rodillo.
[GT|A: he taps a chalk circle on the floor with a pencil, looking at the camera|K: he taps a forty centimetre chalk circle on the floor with a pencil, looking at the camera calmly] El círculo más chico que logré fue de cuarenta centímetros. Más cerrado, y el caño se arruga.
""")
ins('Las dos iguales. Si una ranura', """
[G3|A: he lays both side plates together and drills the two shaft holes through both at once with a drill, looking down|K: he holds the drilled stack of two plates up to the light, seeing light through both holes] Los agujeros de abajo, los de los ejes fijos, los taladro con las dos planchuelas juntas. Así quedan alineados.
""")
ins('Y gira suave como un reloj', """
[G4|A: he taps a centre punch at the middle of a steel disc held in a vice, looking down|K: he holds a centre punch on the middle of a disc, looking down at it] El centro de cada polea es la clave: si queda corrido un milímetro, el rodillo golpea y el caño sale ondulado.
[G4|D: close view of a scriber held fixed beside a spinning pulley on a shaft to check wobble || the same pulley turning with the scriber barely touching it, steady] Lo compruebo con una punta fija al lado. Si la polea no se mueve de costado cuando gira, está centrada.
""")
ins('Pruebo el recorrido', """
[G5|A: he threads the screw through the nut all the way, counting turns on his fingers|K: he holds the screw fully threaded through the nut and looks at the camera] La tuerca la dejo larga, de cuatro vueltas de rosca, para que el esfuerzo se reparta y no se pele.
""")
ins('La manija. Un brazo de cuarenta', """
[G6|A: he holds a short crank next to a long one, comparing, looking at the camera|K: he holds a long crank handle toward the camera next to a short one, nodding] Los comentarios decían: manija más larga, más palanca. Cuarenta centímetros: más, y se choca con el banco.
""")
ins('Y atornillada al banco con cuatro bulones', """
[G6|A: he turns the crank of the empty machine with one finger, the rollers turning smoothly|K: he turns the empty roller crank with one finger, watching the rollers turn, looking pleased] Antes de probar con caño, la hago girar vacía. Los tres rodillos tienen que girar libres, sin ruidos.
""")
ins('Y el caño no avanza. Patina', """
[PB|A: he applies more pressure on the screw and cranks again, the tube wrinkling on one side, looking at it|K: he looks at the wrinkled side of the tube coming out of the rollers with a pained face, hand on the crank] Lo intento otra vez, apretando más. Y empeora: el caño se arruga de un lado.
""")
ins('Ay, no. Eso es un óvalo', """
[PB|A: he pulls the tube out and shows the wrinkled flattened side to the camera|K: he holds the wrinkled tube toward the camera, shaking his head slowly] Apretar más no arregla nada. El problema no es la fuerza. Y eso es lo que casi nadie te dice.
""")
ins('Y la tracción. Los comentarios decían', """
[G7|A: he places a bent tube on the bench and mimes the outer wall stretching and the inner wall compressing with his hands|K: he holds both hands showing the outside of a curve stretching and the inside squeezing, looking at the camera] Cuando curvas un caño, la pared de afuera se estira y la de adentro se comprime. Si no tiene apoyo, se achata.
[G7|A: he nods slowly at the camera, hands on the bench|K: he stands with both hands flat on the bench looking at the camera, nodding slowly] Cada vez que algo falla, pregúntate por qué. Dos preguntas, dos respuestas, y ninguna era más fuerza.
""")
ins('Entra justo, sin sobra', """
[G8|A: he sets three roughly grooved rollers side by side on the bench and checks they match, looking at them|K: he holds three finished grooved rollers lined up side by side on the bench, looking at them with a nod] Hago los tres rodillos así, con el mismo canal. Así el caño no se escapa de ninguno.
""")
ins('Y, como decían los comentarios, imprimación', """
[G8|A: he paints the frame with matt black paint using a brush, leaving the crank handle with a red coat|K: he holds the brush over the frame next to the handle painted red, looking at it with a smile] Y pintura negra mate, con un toque de rojo en la manija, que es lo que vas a ver cuando la agarres.
""")
ins('A ver si esta vez no lo ovalas', """
[PC|A: he takes a deep breath and looks at the tube, then at the camera|K: he holds the tube at the entrance of the rollers and looks at the camera, tense] Cuento hasta tres. Si sale ovalado, volvemos al banco. Tres, dos, uno.
""")
ins('Esa es la tracción de los cordones', """
[PC|A: he turns the crank with one hand easily, showing the long handle, looking at the camera|K: he turns the crank with just one hand, looking at the camera with a relaxed smile] Con la manija de cuarenta centímetros, la giro con una sola mano. Con una de diez, imposible.
""")
ins('Lo apoyo en la plantilla de sesenta', """
[PC|A: he makes a second ring on the machine quickly and puts it next to the first, looking at the camera|K: he holds two identical rings side by side toward the camera, looking at it with a smile] Hago otro, para confirmar que no fue suerte. Mismo tiempo, mismo resultado: dos círculos iguales.
""")
ins('En el otro, sesenta y medio', """
[PE|A: he passes a caliper over the curved part of the ring and reads it, looking at the reading|K: he holds the caliper on the curved tube, showing twenty-one millimetres, looking at it] Y el diámetro del caño en la curva: veintiuno, igual que antes de rolarlo. No se aplastó.
""")
ins('Corto un pedazo y miro la sección', """
[PE|A: he holds up a forty centimetre ring and puts it next to the sixty centimetre one, looking at the camera|K: he holds two rings of different sizes side by side toward the camera, looking at it] Y el más chico que hice: cuarenta centímetros. Más cerrado, el caño se empieza a arrugar por dentro.
""")
ins('Y despeja el espacio alrededor', """
[PE|A: he shakes his head and shrugs with a small laugh, looking at the camera|K: he stands with open hands, shrugging with an honest face, looking at the camera] ¿Y aluminio, o tubo cuadrado de una pulgada? No lo probé. No te lo prometo, y no voy a inventarte nada.
[PE|A: he points at the frame and the pulleys one by one with a pencil, looking at the camera|K: he holds the pencil on the top roller, looking at the camera with a small frown] Lo que cambiaría: una manija doble, una de cada lado, para poder sacar el caño sin desarmar nada.
""")
ins('Tres horas de roladora', """
[PD|A: he and the nephew weld the new arch onto the top of the gate frame, the nephew holding it steady while he tacks it, helmet down|K: he lifts his welding helmet beside the nephew, the arch tack welded at the top of the gate frame, looking at it] Primero puntos, con Nico sosteniendo el arco. Después cordón completo, y el portón vuelve a ser portón.
[PD|V: the nephew stands in front of the finished gate with arch, hands in the pockets of his grey hooded sweatshirt, looking up with a soft smile|K: the nephew looking up at the black gate with its arch, a soft emotional smile] «Mi abuelo estaría orgulloso.»
[PD|A: he stands beside the nephew in front of the gate looking at it, then turns to the camera|K: he stands beside the nephew in front of the black gate with its arch, looking at the camera with a warm smile] Un portón con arco, hecho con la chatarra de dos lavarropas, un gato y un fin de semana.
""")
open(F, 'w', encoding='utf8', newline='\n').write('\n'.join(L))
print('ok')
