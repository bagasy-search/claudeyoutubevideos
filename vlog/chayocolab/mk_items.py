# chayocolab · fotos: Chayo sola (ref chayo_face), Chayo + Claudio juntos (refs de las 2 caras), manos/objetos sin cara.
import json, sys
RCH = "D:/claude-brain/canales/chayo/refs/chayo_face.png"; RCL = "C:/Users/bauti/Downloads/plan_claudio_cocina/face.png"
CHAR = ("Doña Chayo is the woman in the first reference photo, a 67-year-old Mexican ranch cook from Michoacán with brown skin, deep smile wrinkles, "
        "black hair with grey streaks pulled back in a low bun, small gold hoop earrings, a burgundy long-sleeve cotton blouse and a cream apron printed with small red flowers.")
CLAU = ("Claudio is the man in the second reference photo, a 48-year-old Mexican fonda cook with dark curly hair with grey, a short grey beard, brown skin with laugh lines, "
        "a light blue long-sleeve shirt rolled to the elbows, a white cotton apron with old stains and a red-and-white checkered kitchen towel over his right shoulder.")
KIT = ("Chayo's rustic ranch kitchen in Michoacán: rough adobe brick walls, ONE low wood-fired adobe stove (fogón) against the back wall with oak logs burning under a big round black comal, "
       "clay pots hanging on nails, a basket of dried chiles, a black stone molcajete, a worn wooden table, an open side looking out to a dirt yard with a small lemon tree.")
HANDS = "The hands are those of a 67-year-old Mexican woman with brown wrinkled skin, a burgundy cotton sleeve and the edge of a cream apron with small red flowers."
LIGHT = ("Warm late-morning daylight from the open side of the kitchen plus the orange glow of the fire, natural rich colors, soft shadows. "
         "Real photograph, natural skin texture, sharp detail, almost everything in focus and nothing blurred out, background included. No text, no logos, no readable labels, no phones, no people other than the ones described.")
F = []
def cara(n, s): F.append({"name": n, "prompt": f"{s} {KIT} {CHAR} She stands on the packed-earth floor, absorbed in what her hands are doing, mouth closed. {LIGHT}", "ref": RCH})
def dos(n, s): F.append({"name": n, "prompt": f"{s} {KIT} {CHAR} {CLAU} Both are fully visible from the waist up or more, natural, mouths closed. {LIGHT}", "ref": [RCH, RCL]})
def manos(n, s): F.append({"name": n, "prompt": f"{s} {HANDS} Only her hands and forearms are in frame, her face is not visible. Background showing the adobe ranch kitchen with the wood fire. {LIGHT}", "ref": RCH})
def solo(n, s): F.append({"name": n, "prompt": f"{s} {LIGHT}"})
# gancho / visita
manos("h_olla", "Close-up from above of a black clay pot (olla de barro) full of glossy brown bayo beans in their dark broth, a sprig of epazote on top, steam rising, a wooden spoon lifting some beans.")
dos("h_llega", "Claudio arrives at the open side of Chayo's kitchen carrying a small paper bag, smiling, and Chayo welcomes him wiping her hands on her apron.")
dos("h_prueba", "Claudio sits at Chayo's wooden table tasting a spoonful of bean broth from a clay bowl, eyes closed, surprised and moved, while Chayo stands beside him watching with her hands on her hips, amused.")
dos("h_otro", "Chayo serves a second ladle of beans into Claudio's clay bowl at the wooden table, he holds up the bowl, both laughing.")
solo("h_duros", "A home stove at three in the afternoon: a steel pot of beans still hard and wrinkled, a wooden spoon pressing a bean that does not break, a wall clock in the background.")
solo("h_aguados", "A white bowl of burst, watery pale beans with split skins floating in thin grey water, unappetizing, in a city kitchen.")
solo("h_fonda_plato", "On a flowered plastic tablecloth in a small Mexican fonda: a plate of rice, a stew and a side of watery thin beans spilling at the rim, a customer's hand pushing the plate away.")
cara("i_fogon", "Chayo pushes an oak log into the mouth of the adobe stove, sparks and flames rising, a black clay pot of beans on top.")
cara("i_cta", "Chayo sits at the worn wooden table writing by hand in a thick old notebook with yellowed pages, a pencil in her hand, a clay pot of beans beside the notebook.")
dos("i_libretas", "At Chayo's wooden table, Claudio shows Chayo his thick grease-stained hardcover recipe notebook with dog-eared pages, and she shows him her own clean handwritten notebook, both comparing pages and smiling.")
# historia
solo("s_nina", "An old faded 1960s color photograph with white borders: a Mexican girl of eight with two braids sitting on a woven palm petate with a tray, picking little stones out of dry beans, an elderly woman in a dark rebozo by a wood fire behind her.")
manos("s_escoger", "Close-up of hands spreading dry bayo beans on a wooden tray and picking out tiny stones and broken beans, a small pile of rejects to the side.")
solo("s_abuela", "An old faded color family photograph from the 1960s, slightly yellowed with white borders: an elderly Mexican ranch woman with a long braid and a dark rebozo stirring a black clay pot of beans over a wood fire.")
cara("s_olla", "Chayo lifts a blackened clay bean pot with its clay lid down from a nail on the adobe wall with both hands.")
solo("s_ollas", "On a wooden table side by side: a thick heavy black clay pot, a big thick enamel peltre pot, and a thin cheap shiny aluminum pot, morning light.")
dos("s_platica", "Chayo and Claudio stand side by side at her fogón talking and gesturing toward the clay pot, Claudio with his towel on his shoulder, Chayo laughing.")
# 1 · frijol nuevo
solo("u_nuevo", "Macro close-up of fresh shiny bayo beans with smooth glossy even skins in a clay bowl, morning light.")
solo("u_viejo", "Macro close-up of old dull wrinkled beans with dusty matte skins and some cracks in a plastic bag.")
dos("u_mercado", "At a Mexican market stall with open sacks of beans (bayo, flor de mayo, black), Chayo and Claudio inspect a handful of beans in her palm, the vendor's hand holding a metal scoop.")
solo("u_costales", "Open burlap sacks of different dry beans at a Mexican market: light brown bayo, speckled pink flor de mayo, pale yellow peruano and shiny black beans, metal scoops, no readable signs.")
solo("u_negros", "A clay bowl of black beans de olla in their dark broth with a sprig of epazote, Veracruz style, on a wooden table.")
# 2 · remojo
manos("d_remojo", "Close-up of hands pouring cold water over dry beans in a big clay bowl so it covers them twice their height, evening light from a lamp.")
solo("d_manana", "A clay bowl of plump swollen soaked beans in cloudy water the next morning, daylight.")
manos("d_tirar", "Close-up of the cloudy soaking water being drained off the beans through a colander held over the dirt of the yard.")
dos("d_contraria", "Claudio raises a finger, smiling, making a point to Chayo at the table, while she listens with her arms crossed and a playful skeptical look, a bowl of soaked beans between them.")
# 3 · comal
manos("t_comal", "Close-up of half a white onion cut side down and two whole garlic cloves in their skin roasting on a hot black comal over the wood fire, blackened in spots, a wooden spatula.")
solo("t_negro", "Macro close-up of an onion half on a black comal, its cut surface charred black and caramelized.")
manos("t_entero", "Close-up of hands dropping a whole roasted onion half and whole roasted garlic cloves into a clay pot of beans and water.")
dos("t_callado", "Claudio, holding a spoon, looks at Chayo with raised eyebrows after tasting the bean broth from the pot, speechless, while she smiles proudly at the fogón.")
solo("t_siete", "On a wooden table, seven clay plates in a row each with a different dish made from beans: enfrijoladas, molletes, bean soup with nopales, frijoles puercos, tacos dorados, refried beans with egg, and a bowl of beans de olla with cheese.")
# 4 · agua
manos("c_fria", "Close-up of cold water from a clay jug poured into a clay pot of soaked beans on the unlit fogón.")
manos("c_tetera", "Close-up of hot water poured from a blackened enamel kettle into the clay pot of beans simmering on the fogón, steam rising.")
solo("c_jarro", "A clay water jug (jarro) warming on the edge of an adobe wood stove beside a clay pot of beans, steam curling from both.")
dos("c_fonda", "In a small fonda kitchen with white walls and blue-and-white talavera tiles, Claudio lifts the lid of a big pot of boiling water on an old white gas stove, steam rising, Chayo visiting beside him looking in.")
# 5 · al final
solo("f_jitomate", "Close-up of a chopped red tomato and a halved lime next to a clay pot of beans on a wooden table, with a small handwritten-looking cross mark made of two sticks of cinnamon laid over them like an X.")
manos("f_dedos", "Close-up of fingers squeezing a cooked bayo bean that mashes softly like butter, over the clay pot.")
manos("f_sal", "Close-up of a hand sprinkling a spoonful of coarse salt from a small clay bowl into the pot of soft cooked beans.")
solo("f_charros", "A clay bowl of frijoles charros with tomato, chorizo, bacon, onion, cilantro and serrano chile, on a wooden table.")
# 6 · manteca y epazote
manos("m_manteca", "Close-up of a spoon of snow-white pork lard dropped into the clay pot of simmering beans, melting into the broth.")
manos("m_epazote", "Close-up of a hand dropping a fresh sprig of epazote into the bubbling bean pot.")
dos("m_carniceria", "At a Mexican butcher counter with white tiles, Claudio points at a tub of white pork lard while Chayo holds her cloth shopping bag, the butcher's hands scooping lard onto paper.")
# 7 · fuego bajito + soplar
solo("s7_tiembla", "Close-up of a black clay pot of beans barely simmering, a few small bubbles at one edge, the clay lid half open.")
solo("s7_reventados", "Close-up of a pot of beans boiling violently, burst bean skins floating in murky water.")
manos("s7_soplar", "Close-up of a wooden spoon held near the lips with five cooked beans on it being blown on, the skin of the beans curling open and lifting.")
# secreto de Claudio
dos("cl_confiesa", "Claudio leans on Chayo's wooden table telling her something in confidence, one hand at the side of his mouth, she leans in listening with wide eyes.")
dos("cl_fonda", "In Claudio's fonda kitchen with talavera tiles and an old white gas stove, Claudio ladles cooked beans from a big pot into small steel containers to cool, Chayo watching beside him.")
solo("cl_refri", "A commercial fonda refrigerator with several small steel containers of cooked beans in their broth, lids on.")
manos("cl_hoja", "Close-up of a single dark green avocado leaf toasting on a black comal over the wood fire, its edges curling, a wisp of smoke.")
manos("cl_hoja_olla", "Close-up of a toasted avocado leaf being dropped into the clay pot of beans.")
dos("cl_robar", "Chayo tastes the beans from a wooden spoon with her eyes closed and a delighted expression, Claudio beside her grinning with his arms crossed, the clay pot steaming between them.")
# sobras
solo("x_sopa", "A clay bowl of creamy bean soup with fried tortilla strips, cream and crumbled fresh cheese.")
manos("x_refritos", "Close-up of beans being mashed in a black pan with lard using a wooden bean masher, turning into thick refried beans.")
solo("x_molletes", "Molletes: halved bolillo rolls spread with refried beans and melted cheese, topped with pico de gallo, on a clay plate.")
solo("x_enfrijoladas", "A clay plate of enfrijoladas: folded tortillas covered in smooth bean sauce with cream, crumbled cheese and raw onion rings.")
# problemas
manos("p_machacar", "Close-up of a wooden spoon pressing a handful of cooked beans against the inner wall of the clay pot to thicken the broth.")
solo("p_refri", "A home refrigerator shelf with small glass containers of cooked beans in their broth with lids.")
# dinero / cierre
cara("z_kilo", "Chayo pours one kilo of dry bayo beans from a paper bag into a clay bowl on the wooden table, a few coins next to the bag.")
solo("z_familia", "A ranch family at a long wooden table eating beans de olla from clay bowls with warm tortillas in an embroidered cloth, laughing, an older man, a woman of 45 and children, warm light.")
dos("z_despedida", "At the open side of Chayo's kitchen, Chayo and Claudio say goodbye with a warm hug and a laugh, his paper bag in his hand, the lemon tree in the yard behind.")
dos("z_mesa", "Chayo and Claudio sit together at her wooden table with two clay bowls of beans and a stack of tortillas, both eating and laughing.")
json.dump(F, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(F), "items", sum(1 for f in F if "ref" in f), "con ref", sum(1 for f in F if isinstance(f.get("ref"), list)), "con 2 caras")
