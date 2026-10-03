F = 'vlog/tdcrola/beats.txt'
L = open(F, encoding='utf8').read().split('\n')
def ins(anchor, block):
    idx = [i for i, l in enumerate(L) if anchor in l]
    assert len(idx) == 1, (anchor, len(idx))
    L[idx[0] + 1:idx[0] + 1] = block.strip().split('\n')
ins('Y el gato de un auto. De ahí sale el husillo', """
[G1|A: he lays the jack spindle on the bench and rolls it with a finger, looking at its thread|K: he holds the jack screw up close to the camera showing its thick square thread, looking at it] ¿Por qué el gato y no un tornillo común? Porque su rosca es gruesa y está hecha para levantar un auto: aguanta el esfuerzo.
""")
ins('El centro de cada polea es la clave', """
[G4|A: he drops a bearing into a pulley bore and spins it, listening, looking at the camera|K: he holds the pulley with the bearing inside next to his ear, looking at the camera with a smile] ¿Por qué rulemanes y no bujes? Porque la fricción se come la fuerza. Con rulemán, el rodillo gira con un dedo.
""")
ins('La tuerca la dejo larga', """
[G5|A: he greases the screw thread with a finger from a small tin, looking down|K: he holds a greasy finger over the screw thread, looking down at it calmly] Un poco de grasa en la rosca, y el husillo gira suave con una sola mano. Sin grasa se traba.
""")
ins('Hago otro, para confirmar', """
[PC|A: he wipes his hands on a rag and looks at the two rings, then at the camera|K: he stands with the rag over his shoulder and the two rings on the bench, looking at the camera, satisfied] Y no fue solo suerte: es el canal a medida. El canal a medida es el detalle que te dije al principio.
""")
ins('Lo que cambiaría: una manija doble', """
[PE|A: he points to the top screw and holds a finger up, looking at the camera|K: he points at the top screw with one finger, looking at the camera honestly] Y algo que no resolví: la tuerca del husillo se calienta, si doblas mucho seguido. Hay que dejarla enfriar.
[PE|A: he lifts the machine's end plate lightly to show it is solid, looking at the camera|K: he rests a hand on the side plate of the machine, looking at the camera calmly] Esto es una máquina de taller, para una pieza o dos por semana. No es para producir cien arcos por día.
""")
ins('Un portón con arco, hecho con la chatarra', """
[PD|A: he draws on a piece of cardboard with a marker and a tape measure, looking down|K: he holds the cardboard with a drawn arch and a tape measure on it, looking at the camera] ¿Y cómo sabes qué radio le tienes que dar al arco? Mides la luz del portón y la altura del arco.
[PD|A: he writes numbers on the cardboard with a marker, looking at it|K: he holds up the cardboard with the numbers written on it, tapping them with the marker] Mi portón: luz de un metro veinte, y arco de treinta centímetros de alto. Eso da un radio de setenta y cinco.
[PD|A: he leans toward the camera and lowers his voice, serious|K: he leans slightly toward the camera with a serious look] La cuenta es luz al cuadrado, dividida ocho veces la altura, más la mitad de la altura. Con eso no fallas.
""")
open(F, 'w', encoding='utf8', newline='\n').write('\n'.join(L))
