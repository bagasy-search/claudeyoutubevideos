// lib.mjs — constantes y glosario compartidos por los videos de Abuela Rosa (ES general; los prompts van en inglés).
export const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
export const WHO = "Rosa, an 81-year-old Latina grandmother with silver-grey hair pulled back in a low bun, gentle wrinkles, warm brown eyes, a cream blouse under a floral apron, old hands with age spots and veins";
export const KIT = "her small old kitchen: terracotta floor tiles, a white enamel stove, wooden shelves with clay pots and jars, a window with a lace curtain at the left, a wooden table with a crocheted cloth, a small white enamel pot";
export const TAIL = " One ordinary frame from a normal home video shot at eye level with a consumer camera, casual slightly imperfect framing, something cut by the edge of the frame. Almost everything in focus, nothing blurred out: the background stays readable with ordinary everyday objects. Only the light the place really has, correctly exposed, automatic white balance, moderate contrast, mild sensor noise, true-to-life colors. Real materials with wear and use. No text, no letters, no labels, no logos.";
export const EITAIL = " Faded warm colors of old print film, slightly soft print, casual family snapshot of ordinary people caught mid-action, nobody posing for a professional, someone cut by the edge of the frame, the room around them readable, nothing blurred out. No text, no letters, no signs, no logos.";
export const FRAMES = [
  "seen from above at the stove", "close from the side with steam visible", "from across the table at eye level", "slightly from below, the edge of the table cutting the frame",
  "from the doorway of the kitchen, the room around it readable", "a hand just entering the frame at the edge", "next to a window out of shot that lights it from one side",
];
// [regex sobre texto sin tildes, escena EN, consulta web EN]
export const GLOSS = [
  [/lentej/, "a small enamel pot of brown lentils with rice and fried onion on a stove", "lentils pot"],
  [/cebolla.*dor|dorar|doras la cebolla/, "thin onion slices turning golden in oil in a small pan", "frying onion pan"],
  [/ajos?/, "a head of garlic and sliced garlic cloves on a worn wooden board", "garlic cloves"],
  [/pan duro|pan del dia|migas|pan tostado|rebanada/, "slices of stale bread on a wooden board next to a bread knife and crumbs", "stale bread"],
  [/huevos?/, "brown eggs in a chipped bowl and one egg cracking into a small pot", "cracking egg pan"],
  [/arroz con leche|canela/, "creamy rice pudding in a bowl dusted with cinnamon", "rice pudding cinnamon"],
  [/arroz/, "white rice grains sliding into a small pot of simmering broth", "rice cooking pot"],
  [/(papa|papas|patata|pure)/, "peeled potatoes in a pot of water on a stove and a potato masher", "boiling potatoes"],
  [/garbanzo/, "cooked chickpeas in a small pot with paprika broth", "chickpea stew"],
  [/frijol/, "dark beans simmering in a pot with a bay leaf", "pot of beans"],
  [/polenta|harina de maiz/, "yellow polenta bubbling in a pot with a wooden spoon", "polenta pot"],
  [/calabaza|zapallo/, "orange pumpkin cubes in a pot on a stove, a cut pumpkin on the table", "pumpkin cubes pot"],
  [/mazorca|maiz/, "a fresh corn cob and loose corn kernels on a wooden table", "fresh corn cob"],
  [/tomates?/, "ripe red tomatoes being grated into a small pot", "ripe tomatoes"],
  [/(fideo|tallarin|pasta)/, "short thin noodles dropping into a pot of boiling broth", "noodles boiling pot"],
  [/(sopa|caldo)/, "a steaming bowl of simple homemade soup with a spoon on a crocheted tablecloth", "homemade soup bowl"],
  [/(atun|lata)/, "an open tin of tuna and a small pot on a kitchen counter", "tuna tin"],
  [/(hueso|puchero|carne)/, "a soup bone and a piece of beef simmering in a pot with foam being skimmed", "beef bone broth simmering"],
  [/queso/, "grated white cheese melting over a hot dish", "grated cheese melting"],
  [/mantequilla/, "a piece of butter melting in a small pan", "butter melting pan"],
  [/chorizo|salchicha/, "sliced red sausage rounds browning in a pan", "sausage slices pan"],
  [/pollo/, "a chicken thigh simmering in a pot with carrot and onion", "chicken soup pot"],
  [/puerro|apio|zanahoria|verdura/, "chopped carrots celery and leek on a cutting board with a knife", "chopped vegetables"],
  [/olla pequena|olla/, "a small white enamel pot with a lid on a gas stove, a wooden spoon resting on the lid", "small pot stove"],
  [/(tapa|tapad|tapo)/, "the lid of a small enamel pot with steam escaping at the edge", "pot lid steam"],
  [/(fuego|hornilla|llama)/, "a low blue gas flame under a small pot", "gas flame low stove"],
  [/frasco|congel/, "glass jam jars filled with golden broth lined up on a kitchen shelf", "broth glass jars"],
  [/libreta|cuaderno|escrib/, "an old spiral notebook open with handwritten recipes and a pencil on a table", "handwritten recipe notebook"],
  [/(despensa|mercado|compra)/, "a pantry shelf with jars of lentils, rice, beans, pasta, flour and oil", "pantry shelf rice lentils"],
  [/ventana/, "a window with a lace curtain and soft daylight over a kitchen sink", "kitchen window curtain"],
  [/(mesa|plato|cuchara)/, "a place set for one at a small wooden table: a plate, a spoon, a glass and a folded napkin", "table set for one"],
  [/te|taza/, "a cup of tea with steam next to a plain biscuit on a saucer", "cup of tea"],
  [/leche/, "milk being poured into a small pot", "pouring milk pot"],
  [/(azucar|dulce)/, "a spoon of sugar over a bowl, a sugar jar beside it", "sugar spoon"],
  [/pimenton|comino|laurel|especia/, "small jars of paprika, cumin and bay leaves on a wooden shelf", "spices jars paprika"],
  [/fregadero|platos sucios|lavar|enjuague/, "a clean empty kitchen sink with a single small pot drying on the rack", "empty kitchen sink"],
  [/radio|tejer|regar|plantas/, "a small kitchen windowsill with potted plants and an old radio", "kitchen windowsill plants radio"],
];
GLOSS.push(
  [/empanada/, "golden fried empanadas on a floured wooden table with a fork beside them", "fried empanadas"],
  [/hamburguesa/, "a homemade hamburger patty frying on a flat griddle", "homemade hamburger"],
  [/flan/, "a caramel flan on a plate with dripping caramel", "caramel flan"],
  [/bunuelo/, "golden fried fritters being lifted from hot oil", "fried fritters"],
  [/higado/, "a pan of liver steaks with golden onions", "liver and onions"],
  [/(radio)/, "an old kitchen radio on a shelf next to a window", "old kitchen radio"],
  [/(telefono|disco)/, "an old wall rotary telephone with a long curly cord in a kitchen", "rotary phone wall kitchen"],
  [/(mantel|plastico)/, "a floral plastic tablecloth on a kitchen table with plates and glasses", "floral tablecloth kitchen table"],
  [/olla de presion|silba/, "a pressure cooker on a gas stove with steam hissing from its valve", "pressure cooker steam"],
  [/(nochebuena|navidad|pavo)/, "a long family dinner table with a roast turkey, potatoes and salads", "family christmas dinner table"],
  [/(pizza)/, "a homemade pizza with tomato sauce and cheese in a black skillet", "homemade pizza skillet"],
  [/gelatina/, "milk gelatin dessert set in glass cups", "milk gelatin dessert"],
  [/chocolate/, "a cup of thick hot chocolate with bread beside it", "hot chocolate"],
);
// acciones de Rosa (la primera que coincide con el texto)
export const ROSA_ACT = [
  [/revuel|cuchara/, "She stands at the stove stirring a small enamel pot with a wooden spoon, looking down at it with a calm, content expression."],
  [/(tapa|tapad|tapo)/, "She lifts the lid of a small enamel pot with one hand, a puff of steam rising, her head tilted to smell it, eyes half closed."],
  [/prob|sabor|olor|oler/, "She holds a spoon to her lips to taste the stew, eyes closed, a small satisfied smile."],
  [/escrib|libreta|cuaderno/, "She sits at the table writing in an old notebook with a pencil, glasses low on her nose, thoughtful."],
  [/ventana|silencio|extran|pena|llore/, "She sits at a small kitchen table by the window with a cup of tea, looking out with a quiet wistful expression."],
  [/mesa|sientate|siento|sentada|plato/, "She sits at a small table set for one with a bowl of steaming food in front of her, hands resting on either side of the bowl, a gentle smile."],
  [/frasco|congel/, "She pours golden broth from a ladle into a glass jar on the counter, concentrating."],
  [/cebolla|cortar|pic/, "She slices an onion on a wooden board with a small knife, an easy relaxed expression."],
  [/pan/, "She tears a piece of stale bread into a pot with both hands, a faint amused smile."],
  [/regal|vecina|olla grande/, "She stands at the open kitchen door holding a big pot out toward someone off frame, a mix of relief and tenderness on her face."],
  [/./, "She stands in her kitchen wiping her hands on her apron and looking toward the camera with a warm calm expression."],
];
