// shots_peroxido.mjs — Levi Lapp Jardín (ES) · "7 trucos con agua oxigenada en la huerta".
// CLIPS-FIRST. Cada entrada: [ownName, query(s), concept]. ownName = broll/<name>.mp4 o img fallback.
// Secciones = arco del guion (hook, ciencia H2O2, 7 trucos, error, mitos, cierre).
export const SHOTS = {
  hook1: [
    ["px_h_bottle_hand", ["hand holding brown hydrogen peroxide bottle", "peroxide bottle bathroom cabinet"], "botella de agua oxigenada de farmacia en la mano"],
    ["px_h_pour_soil", ["pouring liquid onto garden soil watering", "watering vegetable seedling close up"], "echando agua oxigenada en la tierra"],
    ["px_h_seedling_sprout", ["seed sprouting time lapse soil", "seedling emerging from dark soil"], "semilla brotando de la tierra"],
    ["px_h_wilting_plant", ["wilting yellowing potted plant leaves", "sick droopy tomato plant"], "planta marchita amarilla"],
    ["px_h_healthy_garden", ["lush thriving vegetable garden rows", "healthy green home vegetable garden"], "huerta sana y frondosa"],
  ],
  hook2: [
    ["px_h2_fizz_hand", ["hydrogen peroxide foaming fizzing on skin", "peroxide bubbles foam close up"], "espuma de agua oxigenada burbujeando"],
    ["px_h2_question_garden", ["confused gardener looking at plants", "person thinking in vegetable garden"], "duda / el error a evitar"],
  ],
  abuelo: [
    ["px_gf_tomatoes", ["old farmer tending tomato plants", "elderly man in vegetable garden morning"], "el abuelo cuidando los tomates"],
    ["px_gf_hands_soil", ["old weathered hands in dark garden soil", "farmer hands holding soil"], "manos del abuelo en la tierra"],
  ],
  vecino: [
    ["px_v_store_shelf", ["garden store shelves full of chemical products", "rows of fertilizer bottles garden center"], "estante del vivero lleno de frascos"],
    ["px_v_dead_garden", ["neglected dry struggling vegetable garden", "wilted failing garden plot"], "huerta del vecino, un desastre"],
    ["px_v_money_waste", ["shopping cart with garden chemicals", "buying expensive garden products"], "gastar plata en productos"],
  ],
  science: [
    ["px_sc_water_glass", ["clear water droplet macro slow motion", "glass of clean water close up"], "agua común H2O"],
    ["px_sc_bubbles_o2", ["oxygen bubbles rising in water macro", "fizzing bubbles close up"], "el oxígeno extra liberándose"],
    ["px_sc_pharmacy", ["hydrogen peroxide 3 percent pharmacy bottle label", "brown medical bottle three percent"], "la del 3% de farmacia"],
  ],
  t1_soil: [
    ["px_t1_compacted_soil", ["compacted waterlogged garden soil puddle", "flooded garden bed after rain"], "tierra compactada y encharcada"],
    ["px_t1_roots_soil", ["plant roots in soil cross section", "white healthy roots in dark earth"], "las raíces que respiran"],
    ["px_t1_watering_can", ["watering can pouring at base of plant", "watering vegetable garden base"], "regar con la mezcla en la base"],
    ["px_t1_seedling_perk", ["seedling perking up healthy leaves", "young transplant thriving"], "el plantín levantando las hojas"],
  ],
  t2_seeds: [
    ["px_t2_seeds_hand", ["seeds in palm of hand close up", "vegetable seeds macro"], "semillas en la mano"],
    ["px_t2_soak_bowl", ["seeds soaking in liquid bowl", "presoaking seeds in water"], "remojo de semillas 30 minutos"],
    ["px_t2_sowing", ["hand sowing seeds in soil row", "planting seeds in garden bed"], "sembrando las semillas"],
    ["px_t2_sprout_row", ["row of seedlings sprouting evenly", "even germination seed tray"], "brotan parejas y antes"],
  ],
  t3_rot: [
    ["px_t3_rootrot", ["brown mushy rotten plant roots", "root rot diseased plant roots"], "raíz podrida marrón"],
    ["px_t3_overwater", ["overwatered potted plant soggy soil", "water pooling in plant pot"], "exceso de riego"],
    ["px_t3_drench_soil", ["drenching plant base with liquid", "soaking soil around plant stem"], "empapar la tierra alrededor del tallo"],
    ["px_t3_new_leaf", ["new green leaf sprouting recovery plant", "plant recovering fresh growth"], "hoja nueva = se salvó"],
  ],
  t4_fungus: [
    ["px_t4_powdery", ["powdery mildew white fungus on leaves", "white fungal coating plant leaf"], "oídio, polvillo blanco en la hoja"],
    ["px_t4_spots", ["black spots fungal disease leaf", "brown spots diseased plant leaves"], "manchas de hongo en las hojas"],
    ["px_t4_spray_bottle", ["spraying plants with spray bottle garden", "misting plant leaves close up"], "rociar las hojas, arriba y abajo"],
    ["px_t4_morning_garden", ["early morning dew garden soft light", "garden at dawn golden light"], "temprano a la mañana, nunca al sol"],
  ],
  t5_tools: [
    ["px_t5_pruning", ["pruning shears cutting plant stem", "gardener pruning tomato with scissors"], "podar con la tijera"],
    ["px_t5_wipe_blade", ["wiping garden tool blade with cloth", "cleaning pruning shears"], "desinfectar la tijera entre plantas"],
    ["px_t5_dirty_pots", ["stack of old dirty plant pots", "used terracotta pots pile"], "macetas viejas con hongos"],
    ["px_t5_clean_pots", ["clean empty plant pots washed", "scrubbing a plant pot"], "macetas limpias como nuevas"],
  ],
  t6_gnats: [
    ["px_t6_gnats", ["fungus gnats flying over potted plant soil", "small black flies houseplant soil"], "mosquitos del sustrato volando"],
    ["px_t6_soil_larvae", ["potting soil close up macro", "dark moist potting mix surface"], "las larvas escondidas abajo"],
    ["px_t6_drench_pot", ["watering houseplant soil thoroughly", "soaking potted plant soil"], "empapar la maceta para matar larvas"],
  ],
  t7_water: [
    ["px_t7_stale_water", ["stagnant green algae water in bucket", "murky water in garden barrel"], "agua estancada con verdín"],
    ["px_t7_rain_barrel", ["rain barrel collecting water garden", "water barrel in backyard"], "el agua juntada del abuelo"],
    ["px_t7_fresh_stream", ["fresh mountain stream clear water flowing", "oxygenated running water rocks"], "agua fresca de arroyo (oxigenada)"],
    ["px_t7_strong_roots", ["strong white plant roots healthy", "robust root system plant"], "raíces fuertes toda la temporada"],
  ],
  yapa: [
    ["px_y_flowers_vase", ["cut flowers in glass vase water", "fresh bouquet in vase"], "flores cortadas en el florero"],
    ["px_y_birdbath", ["bird bath water garden", "backyard water basin with algae"], "bebedero de pájaros / tacho"],
  ],
  plants: [
    ["px_p_tomatoes", ["healthy tomato plants heavy with fruit", "ripe tomatoes on vine garden"], "tomates cargados y sanos"],
    ["px_p_houseplants", ["indoor potted houseplants on windowsill", "collection of indoor plants"], "plantas de interior en maceta"],
    ["px_p_lettuce", ["fresh lettuce heads in garden bed", "leafy greens vegetable garden"], "lechugas y verduras de hoja"],
  ],
  error: [
    ["px_e_measuring", ["measuring spoon of liquid careful dose", "tablespoon measuring liquid"], "la dosis justa, una cucharada"],
    ["px_e_burnt_leaf", ["sun scorched burnt plant leaves", "leaf damage burn marks"], "hoja quemada por sobredosis/sol"],
    ["px_e_hot_sun", ["hot midday sun over garden harsh light", "bright sun beating on plants"], "el sol fuerte del mediodía"],
  ],
  myths: [
    ["px_m_dark_bottle", ["dark brown bottle on shelf", "amber medicine bottle close up"], "botella oscura que la protege de la luz"],
    ["px_m_fizz_test", ["hydrogen peroxide fizzing test on metal sink", "peroxide bubbling reaction"], "la prueba: si burbujea, sirve"],
    ["px_m_pantry", ["home pantry shelf simple supplies", "cupboard with household items"], "la respuesta ya estaba en casa"],
  ],
  cta: [
    ["px_c_banana_peel", ["banana peel in hand kitchen", "banana peels compost"], "próximo video: cáscara de banana"],
    ["px_c_thriving", ["gardener happy in thriving vegetable garden", "hands holding harvest vegetables"], "huerta próspera / cierre"],
  ],
  outro: [
    ["px_o_sunset_garden", ["vegetable garden at golden sunset peaceful", "calm garden dusk warm light"], "cierre cálido, atardecer en la huerta"],
  ],
};
