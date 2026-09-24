# falaurel — mapa de sonido: ambiente por escena + efectos SÓLO en acciones concretas.
# OWN  = plano de detalle keyframe (agnes trae foley real): se usa el audio propio del clip, entero.
# GATE = hablado con acción (MMAudio sobre el clip con la cara tapada + compuerta de transitorios).
# Todo clip que no figura = sólo voz + ambiente.
AMB = {
    "kitchen": "quiet empty home kitchen room tone in daytime, very soft steady refrigerator hum, faint distant birds outside an open window, calm, no people",
    "bath": "quiet small tiled bathroom room tone, soft steady ventilation hum, slight tiled room ambience, calm, no people",
    "living": "quiet living room room tone in daytime, very faint distant street outside a closed window, soft air, calm, no people",
    "garden": "quiet small back patio in the late morning, gentle breeze, birds singing, faint distant neighborhood, calm, no people",
    "store": "quiet small neighborhood grocery store in the daytime, faint fluorescent light hum, distant street through an open door, calm, no voices",
}
SCENE_AMB = {"S1": "kitchen", "S2": "kitchen", "S3": "living", "S4": "bath", "S5": "kitchen", "S6": "kitchen", "S7": "garden",
             "S8": "kitchen", "S9": "kitchen", "S10": "bath", "S11": "living", "S12": "store", "S13": "living"}
GATE = {
    "s1_01": "a dry bay leaf snapped in half, crisp dry crack",
    "s1_03": "a small plastic bag crinkling in hands",
    "s1_05": "dry leaf pieces dropped into an empty glass jar, light tapping on glass",
    "s1_07": "a glass jar set into a steel pot of water, soft clink, gas stove knob clicking",
    "s1_10": "a metal cap screwed onto a small glass bottle, bottle placed on a wooden shelf",
    "s2_02": "a glass jar picked up from a marble counter, liquid sloshing inside",
    "s2_03": "a glass jar set down on a marble counter with a knock",
    "s2_08": "a glass jar lifted from water in a steel pot, water dripping, jar set back with a soft clink",
    "s2_12": "a metal lid placed on a glass jar with a soft clink",
    "s3_03": "an adhesive bandage wrapper being peeled open, paper tearing softly",
    "s3_07": "a wooden chair pushed back on a tiled floor, footsteps",
    "s4_01": "a soft towel patting a face",
    "s4_08": "a sheet of paper being unfolded, paper rustling",
    "s5_01": "a wooden cupboard door opened, soft creak",
    "s5_02": "a metal lid screwed onto a glass jar, jar placed inside a wooden cupboard",
    "s5_04b": "two glass jars set down on a marble counter, soft taps on metal lids",
    "s5_14": "a wooden cupboard door closed with a soft thud",
    "s6_01": "a front door opening, footsteps entering a hallway",
    "s6_03": "wooden chairs pulled out on a tiled floor, people sitting down",
    "s6_08b": "a handbag zipper opened, small glass bottle taken out",
    "s6_14": "coffee poured from a pot into a ceramic cup",
    "s7_03": "a plastic tube picked up from a plastic table outdoors",
    "s7_06": "a straw hat put on, straw rustling",
    "s7_09": "footsteps on a stone patio, glass door handle",
    "s8_04": "a kitchen tap running into a metal sink, hands rinsed under water",
    "s9_03d": "a glass of water put down on a wooden table",
    "s10_02": "a bathroom tap running, water splashed on a face",
    "s10_06b": "cotton gloves pulled onto hands, soft fabric rustle",
    "s11_01": "notebook pages being turned",
    "s12_10": "a small plastic bag taken from a shelf, footsteps on a store floor",
    "s13_05": "a hardcover book picked up from a wooden coffee table",
}
