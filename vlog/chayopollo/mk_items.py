# chayo · fotos (gpt-image-2 low Batch). Con cara = ref chayo_face (Chayo HACIENDO lo que dice); sin cara = manos/objetos/otra gente.
import json, sys
REF = "D:/claude-brain/canales/chayo/refs/chayo_face.png"
CHAR = ("The cook is the woman in the reference photo, Doña Chayo, a 67-year-old Mexican ranch cook from Michoacán with brown skin, deep smile wrinkles, "
        "black hair with grey streaks pulled back in a low bun, small gold hoop earrings, a burgundy long-sleeve cotton blouse and a cream apron printed with small red flowers.")
HANDS = "The hands are those of a 67-year-old Mexican woman with brown wrinkled skin, a burgundy cotton sleeve and the edge of a cream apron with small red flowers."
KIT = ("Her rustic ranch kitchen in Michoacán: rough adobe brick walls, ONE low wood-fired adobe stove (fogón) built against the back wall with oak logs burning under a big round black comal, "
       "clay pots hanging on nails on the wall, a basket of dried chiles, a black stone molcajete, a worn wooden table, an open side looking out to a dirt yard with a small lemon tree.")
LIGHT = ("Warm late-morning daylight from the open side of the kitchen plus the orange glow of the fire, natural rich colors, soft shadows. "
         "Real photograph, natural skin texture, sharp detail, almost everything in focus and nothing blurred out, background included. No text, no logos, no readable labels, no phones, no people other than the ones described.")
BODY = "She stands on the packed-earth floor, the stove at the height of her hips beside her, never in front of her body."
F = []
def cara(n, s): F.append({"name": n, "prompt": f"{s} {KIT} {CHAR} {BODY} She looks at what her hands are doing, absorbed, mouth closed. {LIGHT}", "ref": REF})
def caraM(n, s): F.append({"name": n, "prompt": f"{s} {CHAR} {LIGHT}", "ref": REF})
def manos(n, s): F.append({"name": n, "prompt": f"{s} {HANDS} Only her hands and forearms are in frame, her face is not visible. Background showing the adobe ranch kitchen with the wood fire. {LIGHT}", "ref": REF})
def solo(n, s): F.append({"name": n, "prompt": f"{s} {LIGHT}"})
# gancho
manos("h_plato", "Close-up from slightly above of a deep clay bowl of golden clear Mexican chicken soup with a chicken leg, big pieces of carrot, chayote, corn on the cob and zucchini, little golden drops of fat shining on the surface, steam rising, a lime half and cilantro on the side.")
cara("h_olla", "Chayo lifts the clay lid of a huge clay pot on the fogón, a cloud of steam rising, golden chicken broth bubbling gently inside, she smells it with closed eyes.")
solo("h_fonda", "A small Mexican fonda in Uruapan: tables with flowered plastic tablecloths, a radio on a shelf, a menu chalkboard without readable text, a few customers eating, midday light from the street door.")
solo("h_fonda_plato", "On a flowered plastic tablecloth in a fonda: a white melamine bowl of pale watery chicken soup with a dry shredded white chicken breast and mushy white rice sunk at the bottom, overcooked zucchini, a plastic spoon, fluorescent light, a little sad.")
solo("h_lavar", "A home kitchen sink with a raw whole chicken being rinsed under the tap, water splashing onto the counter, a dish towel and plates right beside, an ordinary city kitchen.")
solo("h_aguado", "A pot of pale cloudy chicken soup boiling hard with big bubbles on a gas stove in a small city kitchen, foam stuck to the sides, vegetables falling apart.")
cara("i_fogon", "Chayo kneels slightly to push an oak log into the mouth of the adobe stove, sparks and flames rising, the black comal above heating, smoke curling up to the roof beams.")
caraM("i_taza", "In a simple ranch bedroom with whitewashed adobe walls, Chayo hands a steaming clay mug of chicken broth to an elderly man in bed under a wool blanket, his face not visible, a lime on a saucer.")
cara("i_cta", "Chayo sits at the worn wooden table writing by hand in a thick old notebook with yellowed pages, a pencil in her hand, a clay cup of coffee and a whole raw chicken on a board beside the notebook.")
# historia
solo("s_gallinas", "A dirt patio of an old Michoacán ranch with brown and white hens walking free, an adobe wall, a stone washing basin (lavadero), a wooden stool, morning light, 1960s.")
solo("s_nina", "An old faded 1960s color photograph with white borders: a Mexican girl of eight with two braids sitting on a little wooden stool by a stone lavadero, plucking a hen dipped in a bucket of hot water, steam, an elderly woman in a dark rebozo watching.")
solo("s_abuela", "An old faded color family photograph from the 1960s, slightly yellowed with white borders: an elderly Mexican ranch woman with a long braid and a dark rebozo standing by a big clay pot over a wood fire in an adobe kitchen.")
cara("s_olla_barro", "Chayo lifts a big old clay pot with two handles down from a nail on the adobe wall with both hands, carefully, among other hanging clay pots.")
solo("s_olla_delgada", "Side by side on a wooden table: a thick heavy old clay pot and a thin cheap shiny aluminum pot, both empty, morning light.")
# 1 · pollo entero + patitas
caraM("u_polleria", "At a Mexican market chicken stall with white tiles, Chayo points at a whole yellow chicken while the vendor's hands cut it into pieces with a cleaver on a wooden block, chicken feet in a tray beside.")
solo("u_pechugas", "A supermarket styrofoam tray of pale skinless boneless chicken breasts under plastic wrap on a cold shelf.")
manos("u_piezas", "Top-down on a wooden board: a whole chicken cut into pieces: two legs, two thighs, two wings, the back (huacal), two breast halves, the gizzard and heart, and beside them a pile of clean chicken feet.")
manos("u_patitas", "Close-up of hands placing clean pale chicken feet into a big clay pot of cold water on the fogón, other chicken pieces already inside.")
solo("u_gelatina", "Close-up of a glass bowl of cold chicken broth from the fridge set into a wobbly golden jelly, a spoon cutting into it, a thin white layer of fat on top.")
caraM("u_gallina", "In the dirt patio of the ranch, Chayo holds a big brown hen in her arms, smiling, other hens pecking around her feet, an adobe wall behind.")
manos("u_molleja", "Close-up of hands dropping a chicken gizzard and heart into the pot of broth, golden fat drops floating.")
# 2 · no lavar + agua fría
solo("d_salpica", "Close-up of a kitchen sink: water from the tap hits a raw chicken and splashes in droplets onto a cutting board, a dish towel and a stack of clean plates beside the sink.")
manos("d_cuchillo", "Close-up of hands trimming a loose flap of skin from a raw chicken leg with a small knife on a wooden board reserved for chicken, no water, no sink.")
manos("d_jabon", "Close-up of hands being washed with a bar of soap and lots of foam under the tap of a stone lavadero outside the kitchen.")
manos("d_agua_fria", "Close-up of cold clear water being poured from a clay jug into a big clay pot full of raw chicken pieces and feet, on an unlit fogón.")
manos("d_sal", "Close-up of a hand sprinkling a spoonful of coarse salt from a small clay bowl into a pot of cold water with chicken pieces.")
# 3 · comal
manos("t_comal", "Close-up of half a white onion cut side down, three garlic cloves in their skin and a whole red tomato roasting on a hot black comal over the wood fire, their skins blackened in spots, a wooden spatula.")
cara("t_voltear", "Chayo turns blackened onion halves and a tomato on the black comal with a wooden spatula, smoke and steam curling, concentrated.")
solo("t_negro", "Macro close-up of an onion half on a black comal with its surface charred black and caramelized edges, a garlic clove with blackened papery skin beside it.")
manos("t_pelar", "Close-up of fingers peeling the burnt skin off a roasted garlic clove over a clay plate, revealing the soft golden clove.")
manos("t_a_la_olla", "Close-up of hands dropping the roasted blackened onion, garlic and tomato into a big clay pot of simmering chicken broth, splash of golden broth.")
solo("t_color", "Two clear glass cups side by side on a wooden table: one with pale cloudy chicken broth, the other with golden amber clear chicken broth like tea, backlit by daylight.")
# 4 · espuma
solo("c_espuma", "Close-up looking into a big clay pot of chicken pieces in water just starting to boil, a layer of grey foam on the surface.")
manos("c_jicara", "Close-up of a hand skimming grey foam off the top of the chicken broth with a gourd jícara, the foam inside the jícara.")
cara("c_parada", "Chayo stands beside the big clay pot on the fogón skimming foam with a large spoon, patient, a little clay bowl for the foam in her other hand.")
manos("c_hierbabuena", "Close-up of a hand dropping a fresh sprig of mint (hierbabuena) into clear golden chicken broth in a clay pot.")
# CTA2 · semana
solo("w_tinga", "On a wooden table: crispy tostadas topped with chicken tinga in red chipotle sauce, cream, crumbled fresh cheese and sliced onion, on a clay plate.")
solo("w_enchiladas", "A clay plate of green enchiladas filled with shredded chicken, covered with green tomatillo sauce, cream, raw onion rings and crumbled cheese.")
cara("w_libro", "Chayo sits at the wooden table with an open thick cookbook with yellowed pages, pointing at a page with her finger, smiling, a clay pot steaming behind her.")
# 5 · fuego bajito + pechuga
solo("f_borbotones", "A pot of chicken soup boiling violently with big bubbles and the lid rattling on a gas stove in a city kitchen, broth spilling over the rim.")
solo("f_tiembla", "Close-up of a clay pot of clear golden chicken broth barely simmering, just a few small bubbles rising at one edge, the lid half open.")
manos("f_sacar_pechuga", "Close-up of a slotted spoon lifting a whole white cooked chicken breast out of the golden broth onto a clay plate, steam rising.")
manos("f_deshebrar", "Close-up of two forks shredding a warm juicy cooked chicken breast on a clay plate into long tender strands.")
solo("f_seca", "Close-up of an overcooked, dry, stringy chicken breast falling apart in cloudy broth on a white plate.")
manos("f_tetera", "Close-up of hot water poured from a blackened enamel kettle into the clay pot of chicken broth on the fogón, steam.")
solo("f_presion", "An aluminum pressure cooker on a gas burner in a simple home kitchen, its valve hissing a little jet of steam.")
# 6 · verduras en orden + arroz aparte
manos("v_elote", "Close-up of hands dropping thick pieces of corn on the cob and big chunks of carrot into golden chicken broth in a clay pot.")
manos("v_papa", "Close-up of hands adding peeled potato quarters and chayote quarters into the simmering broth.")
manos("v_calabacita", "Close-up of hands adding big chunks of green zucchini (calabacita) and green beans into the pot, the other vegetables already floating.")
solo("v_atole", "Close-up of a bowl of soup where the zucchini has turned to mush and a carrot is still raw and hard, cloudy broth.")
cara("v_arroz", "Chayo stirs white rice in a small clay cazuela on the comal, separate from the big pot of chicken soup that steams beside it.")
manos("v_servir", "Close-up of a spoonful of fluffy white rice placed in a clay bowl, then golden chicken broth with a piece of chicken poured over it from a ladle.")
# 7 · al final + mesa
manos("s7_cilantro", "Close-up of a hand dropping a handful of fresh cilantro with stems and a sprig of mint into a clay pot of golden chicken soup just taken off the fire.")
cara("s7_tapa", "Chayo puts the clay lid on the big pot of chicken soup that is resting off the fire, wiping her hands on her apron, satisfied.")
solo("s7_mesa", "A rustic wooden table set for a family: small clay bowls of chopped onion, chopped cilantro, chopped serrano chiles, halved limes, fried chiles de árbol, a molcajete of red salsa, and warm tortillas in an embroidered cloth, bowls of chicken soup steaming.")
manos("s7_limon", "Close-up of a hand squeezing half a lime over a bowl of golden chicken soup, juice dripping.")
# variantes
solo("x_tlalpeno", "A clay bowl of caldo tlalpeño: smoky red-orange chicken broth with chickpeas, shredded chicken, carrot, a chipotle chile, avocado slices and a lime on the side.")
caraM("x_lupe", "In a simple whitewashed adobe ranch bedroom, Chayo sits on the edge of the bed holding a steaming clay mug of broth for her husband Lupe, a 71-year-old Mexican man with a grey moustache wrapped in a wool blanket, smiling weakly.")
solo("x_fideo", "A clay bowl of Mexican sopa de fideo in red tomato chicken broth, thin noodles, a lime half beside it, on a wooden table.")
solo("x_flautas", "Golden crispy rolled chicken flautas on a clay plate with cream, crumbled cheese and green salsa, a small cup of chicken broth beside.")
# problemas
solo("p_turbio", "A clay bowl of cloudy, murky chicken soup with bits of grey foam floating, unappetizing.")
manos("p_grasa", "Close-up of a spoon lifting a hard yellow disc of cold chicken fat off the top of jellied broth in a glass container from the fridge.")
solo("p_refri", "A home refrigerator shelf with several small glass containers of golden chicken broth with lids, cool light.")
# dinero
caraM("m_mercado", "At a Mexican market, Chayo pays a vendor at a chicken stall, a whole chicken in a plastic bag and a bag of chicken feet on the counter, coins in her hand.")
solo("m_familia", "A ranch family of six around a wooden table eating chicken soup from clay bowls, tortillas in a cloth, laughing, faces of an older man, a woman of 45, a teenage boy and a little girl visible, warm light.")
# cierre
cara("z_cebolla", "Chayo places half an onion on the hot black comal over the wood fire with a smile, looking toward the open side of the kitchen.")
cara("z_servir", "Chayo ladles golden chicken soup with a chicken leg into a clay bowl at the fogón, steam rising, smiling softly.")
json.dump(F, open(sys.argv[1], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(F), "items", sum(1 for f in F if "ref" in f), "con ref")
