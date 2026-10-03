F = 'vlog/tdcgarrafa/beats.txt'
L = open(F, encoding='utf8').read().split('\n')
def ins(anchor, block):
    idx = [i for i, l in enumerate(L) if anchor in l]
    assert len(idx) == 1, (anchor, len(idx))
    L[idx[0] + 1:idx[0] + 1] = block.strip().split('\n')
ins('Y ahí, atrás del galpón, la garrafa vieja', """
[G:a small old electric fan heater and a gas heater with a half empty cylinder in a cold workshop corner § W:gas heater] Probé de todo. Calefactores eléctricos que saltaban la térmica, y una estufa a gas que se llevaba una garrafa por semana.
[P:Claudio counting coins on a workbench in a cold workshop with a worried face § G:a household gas cylinder weighed on a bathroom scale in a workshop] Una garrafa por semana en invierno, y el galpón seguía frío. Algo no cerraba en esa cuenta.
""")
ins('Una estufa a leña es un tubo de chapa', """
[W:radiator heat waves above a metal stove § G:a drawing on a blackboard of a stove with arrows showing heat radiating from the metal surface into the room] El secreto de una salamandra es la superficie: una chapa grande y caliente que irradia calor para todos lados.
[P:Claudio holding his hand near a warm metal surface feeling the radiant heat, in a workshop § G:an old black wood stove glowing slightly in a dim room] Una garrafa tiene mucha chapa en poco espacio: es casi la forma ideal para calentar un galpón.
""")
ins('El inventario. Casi todo es chatarra', """
[W:welding helmet and gloves on a workbench § G:a pair of leather welding gloves, safety glasses and a welding helmet laid on a workbench] Herramientas: soldadora, amoladora, taladro, escuadra y nivel. Y protección: anteojos, guantes de cuero y careta.
""")
ins('Si te gustan estos inventos con chatarra', """
[G:a stopwatch and a notebook on a workbench with a pencil § P:Claudio checking his watch near the stove materials, time to start] Todo el trabajo me llevó un fin de semana, con las pausas para curar la pintura y para probar.
""")
ins('Paso uno. Una garrafa vacía no está vacía', """
[W:gas flame blue § G:a diagram chalk drawn on a blackboard showing gas heavier than air pooling at the floor of a room beside a cylinder] El gas de las garrafas es más pesado que el aire. No se va para arriba: se junta abajo, en el piso y en los pozos.
[P:Claudio lifting an old gas cylinder with both hands and feeling its weight, outdoors § G:a gas cylinder placed on a bathroom scale outdoors on a wooden board] Una garrafa vacía pesa lo que dice la tara. Si pesa de más, todavía tiene gas, y hay que esperar o llevarla a gasificar.
""")
ins('La dejo así, llena de agua', """
[G:an old gas cylinder lying on its side filled with water in a yard with a plastic cap on the valve hole § A:the surface of the water in the open hole of a cylinder reflecting the sky::a gentle ripple moves across the water surface] Mientras esté llena hasta arriba, no hay gas adentro, no hay mezcla, y no hay chispa que importe. Esa es la lógica.
""")
ins('Paso dos, la puerta. La marco', """
[G:two wooden blocks and clamps holding a gas cylinder steady on a workbench so that it cannot roll § P:Claudio tightening a clamp that holds a gas cylinder on blocks, looking at it carefully] Antes de cortar, la trabo con dos tacos de madera y una prensa: una garrafa que rueda mientras cortas es un accidente.
""")
ins('Lima en los bordes, para que no corten', """
[W:steel sheet edge deburring § G:a hand sliding along a freshly filed edge of a steel opening wearing a leather glove] Y paso la mano con guante por todo el borde. Una chapa cortada es una cuchilla.
""")
ins('Con nivel, sí o sí', """
[P:Claudio shaking the stove by its upper edge to test its stability on four legs on the concrete floor § G:a gas cylinder on four steel legs standing on a concrete floor with a thin shim under one leg] La sacudo con la mano: no tiene que bailar. Si baila, le pongo una chapita debajo de la pata que cojea.
""")
ins('Atención acá: la chimenea tiene que salir afuera', """
[W:hot air rising above a flame § G:a blackboard drawing showing warm smoke rising in a tall chimney pulling air in through a lower door of a stove] ¿Por qué tira una chimenea? Porque el aire caliente sube, y al subir arrastra aire fresco por la puerta. Cuanto más alta, más fuerte.
[G:a four inch and a six inch steel chimney pipe side by side on a workbench § P:Claudio measuring the diameter of a chimney pipe with a caliper] El diámetro: cuatro pulgadas me alcanzó para esta garrafa. Más grande, enfría el humo y tira peor.
""")
ins('Con la chapita abierta, el fuego se aviva', """
[A:a fire inside a stove growing brighter as the air regulator slot is opened::the flames grow stronger and lean toward the slot § W:stove air control] Abierta del todo, la leña arde fuerte y rápido. Cerrada a medias, dura horas y calienta parejo. Es la mejor parte del diseño.
""")
ins('Protegen la chapa del calor directo', """
[G:gloved hands arranging a loose row of fire bricks on the floor of a stove, leaving small gaps § W:fire bricks stacked] Sin cemento ni mezcla: los ladrillos van sueltos, así se mueven con la dilatación y no se rajan.
""")
ins('Y ojo con el fondo: sin agujeros', """
[W:ash falling from a fireplace § G:a steel ash tray sliding under a stove, the tray catching a little ash] La ceniza cae por la rejilla del frente al cenicero, que se saca por abajo. Y el fondo de la garrafa queda entero.
""")
ins('Con tres metros, tira como una locomotora', """
[W:steam locomotive smoke § P:Claudio looking up at the chimney outdoors with smoke rising straight, hands on hips, satisfied] Y esto aplica a cualquier chimenea: si no tira, antes de tocar la estufa, mide la altura. Casi siempre es eso.
""")
ins('Y la dejo secar un día entero', """
[P:Claudio looking at the sky and then at the painted stove drying in the sun in his yard § W:sun drying paint] La pintura de alta temperatura se cura con calor: la primera vez que prendes, huele y larga humo.
[G:a workshop with its sliding door and window wide open and a stove burning a small fire with faint smoke § P:Claudio opening a window of the workshop while the new stove burns a small fire] Por eso el primer encendido es chico, tres veces, con todo abierto, hasta que no huela más.
""")
ins('La llevamos al galpón', """
[W:fireproof floor tile § G:a steel plate under a stove on a concrete floor, bricks around it in a workshop] Y debajo de la estufa, una chapa más, por si cae una brasa. Una brasa en un piso de madera es un incendio.
""")
ins('Y esto, que no es opcional', """
[G:a smoke detector and a carbon monoxide detector installed side by side on a workshop wall § P:Claudio pressing the test button on the carbon monoxide detector, the light blinking] Lo pruebo con el botón, y lo cambio cuando se cumple la fecha de vencimiento. Un detector vencido no detecta.
""")
ins('Un galpón que amanecía a seis', """
[W:cozy warm room from a fire § P:Claudio leaning on his workbench near the stove, relaxed and warm, working with a pencil] Y ese calor se queda: la chapa y los ladrillos guardan temperatura, y el galpón no se enfría de golpe cuando se apaga el fuego.
""")
ins('Pero ojo, que no es una comparación justa en todo', """
[G:an electric bill and a pile of firewood side by side on a workbench with a calculator § P:Claudio weighing options with his hands like a balance, looking at the camera] Por el lado del costo, la leña me sale casi gratis, porque la junto de podas. La luz, en cambio, es una factura.
""")
ins('La ceniza se saca con el cenicero', """
[G:a metal bucket with a lid holding grey ash beside a stove on a concrete floor § W:metal ash bucket] Y mientras haya brasas, la estufa no se deja sola. Ni se va uno a dormir con fuego dentro de casa.
[P:Claudio sweeping the chimney with a long brush at the end of a rod, standing on a stool outdoors § W:chimney sweep brush] Una vez por temporada, y con frecuencia si usas leña húmeda, limpio la chimenea. El hollín se acumula, y eso es lo que se prende fuego.
""")
ins('En mi versión, por simpleza', """
[G:a vertical gas cylinder stove with a small door at the bottom and a chimney on top compared with a horizontal one on a blackboard drawing § P:Claudio comparing two sketches of stoves with a pencil, thinking] También puedes hacerla vertical, parada. Es más chica en el piso, pero la leña tiene que ser más corta.
""")
ins('Y limpia la chimenea cada tanto', """
[P:Claudio looking proudly at the finished stove in his workshop, tools resting on the bench § G:a clean tidy workshop with the black stove glowing in the corner and tools arranged on a pegboard] En total: un fin de semana, unos electrodos, discos y pintura. Y un galpón que dejó de ser un freezer.
""")
open(F, 'w', encoding='utf8', newline='\n').write('\n'.join(L))
print('ok')
