# inserta bloques de beats después de la línea que contiene el ancla (una sola vez). Uso: python _ins.py
import re
F = 'vlog/tdchinca/beats.txt'
L = open(F, encoding='utf8').read().split('\n')
def ins(anchor, block):
    idx = [i for i, l in enumerate(L) if anchor in l]
    assert len(idx) == 1, (anchor, len(idx))
    L[idx[0] + 1:idx[0] + 1] = [b for b in block.strip().split('\n')]
def rep(a, b):
    idx = [i for i, l in enumerate(L) if a in l]; assert len(idx) == 1, a
    L[idx[0]] = L[idx[0]].replace(a, b)

rep('Y hay una última cosa. Con el mismo vástago y un caño más chico, clavo varillas para los tutores de la huerta.','Y hay una última cosa que no te conté.')
rep('Hace un mes, volviendo del taller, pasé al lado de una obra.', 'Justo esa semana, volviendo del taller, pasé al lado de una obra.')
rep('Estaca de dos por dos, tierra del patio, la misma de todo el video. Le pongo la copa encima.', 'Estaca de dos por dos, tierra del patio, la misma de todo el video. Le apoyo la copa encima, aunque no baja del todo.')

ins('Hice las cuentas', """
[PA|A: he holds a post-hole digger standing in the grass and shakes his head at it, looking at the camera|K: he stands with a post-hole digger planted in the grass, shaking his head at the camera with a wry face] Una hoyadora te hace el pozo, pero para estacas finas es matar una hormiga con un cañón: cien pozos, y encima hay que rellenar.
""")
ins('Sin girar, solo el golpe', """
[PA|A: he crosses his arms and looks at the neighbour with a mischievous half smile, chin up|K: he stands with arms crossed facing the neighbour, a challenging half smile] Y se lo dije al vecino: si clavo una estaca en menos de un minuto, el asado del domingo lo pones tú.
[PA|V: the neighbour uncrosses his arms and puts out a big rough hand to shake, laughing|K: the neighbour with his hand held out over the fence wire, a big challenging grin] «Trato hecho. Y si pierdes, la carne la pones tú y la leña también.»
[PA|A: he shakes the neighbour's hand firmly and turns back to the camera, eyebrows raised|K: he holds the shaken hand up, looking at the camera with a raised eyebrow and a half smile] Ya no era solo por la espalda. Ahora había un asado en juego, y no pensaba perderlo.
""")
ins('Ya sé lo que estás pensando', """
[VO|A: he sits on the kerb next to the skip and turns the hammer drill over in his hands, looking at its worn end|K: he sits on the kerb with the hammer drill across his knees, looking at it, a small smile] Pesaba unos cinco kilos, de puro golpe. Nada de electrónica rara: un mecanismo simple y bruto.
[VO|A: he stands and sets off along the street with the tool on his shoulder, the skip behind him|K: he walks away with the hammer drill on his shoulder, looking back over it at the camera] De los que se arreglan con un destornillador. Justo lo que quería.
""")
ins('Las estacas: eucalipto de dos por dos', """
[G1|A: he opens a cardboard box on the bench and takes out a few welding electrodes and a spare cutting disc, showing them|K: he holds three welding electrodes and a worn cutting disc in one hand, looking at the camera] Y de consumibles: tres electrodos, un disco de corte, y arena seca para más adelante.
[G1|A: he taps his chest with a greasy hand and shrugs with a proud half smile|K: he stands with his arms crossed and a proud half smile, looking at the camera, the scrap pile behind him] Lo que te va a costar de verdad: unos electrodos y un rato. El resto, lo tiran otros.
""")
ins('Un poco de grasa en el frente', """
[G3|A: he puts on ear defenders and safety glasses in front of the camera, touching each in turn|K: he stands with ear defenders and safety glasses on, a thumb up toward the camera] Protección de oídos, anteojos, guantes. Esto hace un ruido que te deja sordo si no te proteges.
""")
ins('Prueba en un tablón', """
[GT|A: he sets an opened-up hammer drill mechanism on the bench and points into it with a screwdriver, talking|K: he points with a screwdriver at the open mechanism of a hammer drill, looking at the camera] ¿Y por qué solo percusión? Porque adentro el rotomartillo tiene un pistón que empuja el aire.
[GT|A: he mimes a punch with his fist toward the camera, the open mechanism on the bench|K: he holds his fist forward like a punch, looking at the camera, the open mechanism on the bench] Ese aire empuja un percutor, y el percutor golpea la cola del cincel. Miles de golpes por minuto.
[GT|A: he holds the chisel end of the hammer drill toward the camera, shaking his head slightly|K: he holds the chisel end of the hammer drill toward the camera, a small serious frown] Esa energía es la que necesitamos. Pero no está hecho para clavar madera, y hay que dársela por la cola.
[GT|A: he gestures at the adapter parts on the bench with both hands|K: he gestures with both hands open toward the adapter parts on the bench, looking at the camera] Por eso el adaptador: la copa recibe el golpe del vástago y se lo pasa a la estaca sin romperla.
[GT|A: he sets a stake on the bench and lays a pipe ring on its top like a cap, pressing it down|K: he presses the pipe ring down onto the head of a stake on the bench, looking at the camera] Es como un dedal en la cabeza de la estaca. La copa la abraza, y el golpe baja derecho.
""")
ins('Esto es acero templado, muy duro.', """
[G4|A: he puts the cut shank into a small tin and shakes it, grinning at the camera|K: he holds a small tin with the cut shank inside, shaking it lightly, grinning] Y el resto de la mecha no se tira: lo guardo, que siempre sirve para un punzón o un pasador.
""")
ins('Le saco el filo con la lima', """
[G5|A: he holds a hole saw core bit in one hand and the pipe ring in the other, comparing them, looking at the camera|K: he holds up a metal core bit and the pipe ring side by side, looking at the camera with an evaluating frown] Alguien me va a decir: usa una corona de perforar. Sirve, pero hay que gastar una buena. Un caño de chatarra no cuesta nada.
[G5|D: close view of a caliper measuring the inside of the cut pipe ring, reading sixty-eight millimetres || the same caliper measuring across the diagonal of a square stake head, reading seventy millimetres] Ojo con estos números. Por dentro el caño mide sesenta y ocho. La diagonal de una estaca de dos por dos, setenta.
[G5|A: he tries to press a square stake head into the pipe ring, it does not go in, he frowns at the camera|K: he holds the stake head against the pipe ring, showing it does not enter, looking at the camera with a wry smile] O sea que no entra. Todavía no lo sabía, pero ese centímetro me iba a dar dos problemas.
""")
ins('Paso cinco. Soldar.', """
[G6|A: he holds up a welding electrode toward the camera with the ground clamp visible on the bench|K: he holds a welding electrode up toward the camera, the ground clamp clipped on the bench behind it, looking at it] Electrodo de dos coma cinco, bien seco. Ropa de algodón o de cuero, nada sintético que se derrita, y con ventilación.
""")
ins('Le saco la escoria.', """
[G6|V: the neighbour appears at the open workshop door frame with a mug in his hand, peering in at the welding bench|K: the neighbour leaning on the doorframe with his mug, the presenter at the bench with the welded disc in his hands] «¿Y eso qué es? ¿Un sombrero para las estacas?»
[G6|A: he looks at the neighbour over his glasses with a dry look, holding up the disc|K: he lowers the disc and looks toward the doorway with a dry half smile] Un sombrero, sí. Un sombrero de acero para estacas. Pasa y mira, pero con anteojos.
""")
ins('Uno el disco al caño con tres puntos', """
[ES|A: he cuts a long eucalyptus board into stake lengths with a handsaw on a sawhorse in the yard, sawdust flying|K: he saws through an eighty-centimetre stake with the handsaw on the sawhorse, looking down at the cut] Paso seis, las estacas. Las corto de ochenta, con serrucho, en el caballete. Cuarenta van enterrados.
[ES|A: he compares two wooden stakes, one dense eucalyptus and one soft pine, tapping them together, looking at the camera|K: he holds a dense eucalyptus stake and a soft pine stake side by side toward the camera] Un consejo con la madera: eucalipto, o algo duro. Con pino blando, la cabeza se aplasta antes de entrar.
[ES|A: he stands a stake on a chopping block and sharpens one end to a wedge point with a hatchet, chips flying|K: he holds the stake with a freshly cut wedge point up to the light, looking at it] Le hago punta en cuña con el hacha, así entra en la tierra sin trabarse.
[ES|D: close view of a blowtorch flame charring the pointed end of a wooden stake, thin smoke and black crust forming || the same stake end fully charred black and glossy, the flame moving away] Y quemo con el soplete la parte que va bajo tierra. Carbonizada, la madera se pudre más despacio.
[ES|A: he carries a bundle of stakes over his shoulder to the grass and looks at the camera with a doubtful smile|K: he stands with a bundle of stakes on his shoulder, looking at the camera with a doubtful smile] Y ya están las estacas listas, con las esquinas todavía sin biselar. ¿Ves por dónde va la cosa?
""")
ins('La estaca entra torcida', """
[G7|D: close view of a caliper across the diagonal of a square stake head reading seventy millimetres, then across the inside of a pipe ring reading sixty-eight || the same stake head with its corners planed, the caliper reading sixty across the diagonal] La cuenta era esta: setenta de diagonal, sesenta y ocho de hueco. No entra. Con las esquinas biseladas, sesenta. Entra justo.
""")
ins('Ahora sí: electrodo básico', """
[G8|A: he hits the finished weld hard several times with a hammer and listens, then shows it to the camera|K: he holds the disc with its shank toward the camera after hammering, the weld intact, nodding] La prueba del martillazo: le doy unos golpes fuertes a la soldadura. Si suena limpio y no salta nada, sirve.
""")
ins('Un cordón parejo, sin poros', """
[G8|A: he presses the finished cup onto a chamfered stake on the bench and wiggles it to test the fit|K: he lifts the cup with the stake hanging inside it by friction, smiling at the camera] Y pruebo el encaje en seco. Entra justo, con un poco de juego. La estaca cuelga sola, sin caerse.
""")
ins('Yo te tomo el tiempo', """
[PC|A: he takes a slow breath and looks at the stake, one hand raising three fingers|K: he holds up three fingers slowly with the hammer drill in the other hand, looking at the camera, tense] Respiro. Tres, dos, uno.
""")
ins('Miro la tapa, miro la soldadura', """
[PT|A: he sets a spirit level against a stake standing in the grass and checks that it is vertical, looking at the bubble|K: he holds the spirit level against a stake, bending to look at the bubble, calm] Un truco de oficio: primero el nivel. La estaca tiene que estar recta antes del primer golpe, porque después no la enderezas.
[PT|A: he pulses the trigger briefly so the hammer drill taps the stake and the stake seats itself in the soil|K: he holds the hammer drill on the stake with light pressure, the stake seated a few centimetres, looking down at it] Los primeros golpes, cortitos, para que la estaca agarre. Recién ahí, gatillo a fondo.
[PT|A: he stands with legs apart and elbows against his body, the hammer drill vertical over a stake|K: he stands solidly with the hammer drill vertical over the stake, elbows tucked, looking at the top] Los pies separados, los codos pegados al cuerpo, y el rotomartillo bien vertical. Que el peso vaya derecho.
[PT|A: he lifts the hammer drill off and the cup stays stuck on the stake, he taps it loose and tilts it to look inside|K: he holds the cup adapter upside down looking at the inside, checking for wear] Al terminar, a veces la copa queda pegada por la vibración. Un golpecito, y sale.
[PT|A: he pushes a stake sideways with both hands to test how firm it is in the ground|K: he holds the top of a driven stake with both hands, shaking it to test it, looking at the camera with a satisfied nod] Y pruebo si aguanta, empujándola para los costados. Firme, como si la hubiera clavado un tractor.
""")
ins('Tres minutos y medio con la maza', """
[PE|A: he fits the cup on an unchamfered stake on purpose and hammers a short burst, the stake head splitting|K: he lifts the hammer drill off a stake whose head has split open along the grain, looking at the camera with a shrug] Y para que no me creas solo a mí: le puse una estaca sin biselar, a propósito. Mira cómo se abre.
[PE|A: he holds the split stake next to a clean chamfered one, looking at the camera|K: he holds the split stake and the clean chamfered stake side by side, looking at the camera, nodding] Misma copa, misma tierra, mismo rotomartillo. La única diferencia son cuatro biseles de un minuto de trabajo.
""")
ins('Si hay una piedra, la estaca rebota', """
[PE|A: he holds a small notebook with a pencil and writes numbers, looking at the camera|K: he holds up a small notebook with a column of scribbled numbers toward the camera, tapping it with the pencil] Anoté diez estacas seguidas: entre siete y diez segundos cada una. Cien estacas son unos quince minutos de golpe puro.
[PE|A: he shrugs, looking at the camera, and spreads his hands|K: he stands with both hands open, shrugging, looking at the camera, honest face] Después está mover el alargue, medir cada metro veinte, y descansar. Por eso me llevó una mañana, no quince minutos.
""")
ins('A la número sesenta y dos', """
[PD|A: he points at a thick corner post set by hand at the end of the fence with a shovel leaning on it|K: he stands beside a thick corner post with a shovel leaning on it, looking at the camera] Los esquineros, en cambio, siguen yendo a pala: van más gruesos y más hondos, y esos no los clava esto.
""")
ins('Me callo. Pero me lo prestas', """
[PD|A: he looks at the neighbour and raises an eyebrow, pointing at him|K: he points at the neighbour with a raised eyebrow and a half smile] Un momento: ¿y el asado de la apuesta?
[PD|V: the neighbour groans, lifting his palms in surrender, laughing|K: the neighbour with both palms raised in surrender, laughing under his cap] «Está bien, está bien. El domingo. La carne la pongo yo.»
[PD|A: he leans against a fence post and looks along the finished line, then at the camera|K: he leans on a fence post beside the finished stakes, looking at the camera with a satisfied smile] Lo que me gastó de verdad: dos electrodos, un disco y la mitad de un domingo. Lo demás, del volquete.
""")
ins('Y hay una última cosa', """
[PD|A: he holds a small pipe ring adapter over a thin steel rod pressed into vegetable garden soil, tapping it|K: he holds a small adapter over the head of a steel rod standing in the vegetable garden, looking at the camera] Con un caño más chico, el mismo vástago y la misma idea, clavo varillas para los tutores de los tomates.
[PD|A: he counts on his fingers, looking at the camera|K: he holds up four fingers toward the camera, serious but warm] Resumen de seguridad: anteojos, protección de oídos, guantes, y el rotomartillo siempre en martillo solo. Con eso te cuidas.
[PD|A: he holds up the three parts of the fix one by one, the thick disc, the planed stake and the sand bucket, looking at the camera|K: he stands holding the thick disc in one hand and a planed stake in the other, nodding at the camera] Y lo que aprendí a los golpes: chapa gruesa, precalentar la soldadura, y biselar las esquinas de la estaca. Tres cosas.
""")
open(F, 'w', encoding='utf8', newline='\n').write('\n'.join(L))
print('ok')
