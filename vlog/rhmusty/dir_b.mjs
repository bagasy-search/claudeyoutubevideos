// DIRECTOR B — rhmusty p21-48: LUGAR 3 alfombras (historia Elyria) · LUGAR 4 desagües que no usás (trampa llena/seca/aceite, historia
// $3,000) · LUGAR 5 heladera (bandeja, rejilla, lavavajillas) · LUGAR 6 placares de pared exterior · cuenta · prueba · CTA a mitad · humedad.
import { B, BS, ST, K, R, A, C, I, KIT, HOUSE, SINKCAB } from "./h.mjs";
const RUG = "a small beige kitchen rug on beige vinyl floor in front of a kitchen sink";
const FRIDGE = "the bottom front of a white refrigerator standing on beige vinyl kitchen floor, a black plastic grille at the bottom";
const CLOSET = "a small bedroom closet with clothes on hangers, shoes on the floor and cardboard boxes in the corner, a plain white back wall";
export const SHOTS = [
  // camas de componentes (sin plano propio)
  BS(21, "", "b_sinkcab", `${SINKCAB}, seen from the kitchen floor with the cabinet doors open.`, { skip: true }),
  BS(21, "", "b_fridgelow", `${FRIDGE}, seen from low on the floor.`, { skip: true }),
  BS(21, "", "b_closetback", `${CLOSET}.`, { skip: true }),
  // ── LUGAR 3 · alfombras
  C(21, "", "RhHousePlan3D", { active: 3, title: "PLACE 3" }),
  K(22, "Lift the corners of every rug", "k_liftrug2", `Close view of a hand lifting the corner of a braided rug in front of a back door.`, "the hand grips the rug corner", "the hand lifts the corner and the floor underneath shows", "a rug lifting off a floor"),
  R(22, "Smell the floor under it", "r_smellrug", `She kneels on the floor of ${KIT}, holding up the corner of a rug and bending down to sniff the floor under it.`),
  K(22, "A rug pad holds water like a sponge", "k_pad", `Close view of a yellow-gloved hand pressing on a gray felt rug pad, a little water seeping out around the fingers.`, "the gloved hand rests on the rug pad", "the hand presses and water seeps out of the pad", "a hand pressing a wet pad"),
  R(23, "The worst one is always the rug in front of the kitchen sink", "r_sinkrug", `She stands at the kitchen sink of ${KIT}, pointing down at ${RUG} with a yellow-gloved finger, looking at the camera.`),
  K(23, "Every drip, every splash", "k_splash", `Close view of water splashing out of a kitchen sink onto ${RUG}.`, "a hand rinses a plate under the faucet", "water splashes over the edge onto the rug", "water splashing in a sink"),
  B(23, "every wet dish towel lands there", "b_dishtowel", `A wet dish towel lying crumpled on ${RUG}.`, "the light shifts slowly; nothing else moves"),
  B(23, "where wet boots sit all winter", "b_boots", `A pair of wet snow boots on a rug by a back door, puddles around them.`, "a drop of melted snow slides down a boot; nothing else moves"),
  // historia Elyria
  A(24, "I had a client in Elyria", { kick: { txt: "ELYRIA, OHIO", hand: true } }),
  B(24, "a candle burning in every room", "b_candleroom", `A living room in ${HOUSE} with lit candles on the coffee table, the bookshelf and the windowsill.`, "the candle flames flicker; nothing else moves"),
  A(24, "She was embarrassed to have people over"),
  R(24, "followed my nose", "r_follownose", `She walks slowly through a dining room in ${HOUSE}, eyes half closed, sniffing the air, one yellow-gloved hand out in front of her.`, "she takes one slow step forward, sniffing"),
  B(24, "right where the dog's water bowl sat", "b_dogbowl", `A dog's steel water bowl sitting on a rug under a wooden dining table, a few drops spilled around it.`, "the water in the bowl ripples a little; nothing else moves"),
  C(24, "Ten years of little splashes", "RhPins", { img: I("b_dogbowl"), pins: [{ x: 0.42, y: 0.6, label: "Water bowl" }, { x: 0.68, y: 0.78, label: "Rug pad: 10 yrs" }] }),
  R(24, "We threw that pad out", "r_pleased", `She stands in a dining room in ${HOUSE}, holding up a rolled-up old rug pad under one arm and smiling at the camera, amused.`),
  // arreglo
  A(25, "If the floor under a rug is damp"),
  K(25, "take the rug outside", "k_rugoutside", `Close view of a rug hanging over a porch railing in the sun.`, "the rug hangs still on the railing", "the rug sways a little in the breeze", "a rug flapping on a railing"),
  B(25, "let the floor dry with a fan", "b_fanfloor", `A small white box fan on a kitchen floor blowing across a bare damp spot where a rug was.`, "the fan blades spin; nothing else moves"),
  C(25, "spray it with peroxide, ten minutes, wipe it dry", "RhCheck", { title: "Under a rug", items: ["Rug outside", "Fan till dry", "Peroxide, 10 min", "Wipe dry"], fast: true }),
  C(25, "don't wash it. Throw it out", "RhDoDont", { yes: { label: "Pad smells: throw out", img: I("b_newpad") }, no: { label: "Washing the pad", img: I("b_washpad") } }),
  BS(25, "", "b_newpad", `A new gray felt rug pad still rolled up, leaning against a wall.`, { skip: true }),
  BS(25, "", "b_washpad", `An old stained rug pad stuffed into a washing machine drum.`, { skip: true }),
  R(25, "cheaper than a candle habit", "r_candle", `She stands in a living room in ${HOUSE}, holding a lit jar candle and raising one eyebrow at the camera.`),
  // ── LUGAR 4 · desagües que no usás
  C(26, "", "RhHousePlan3D", { active: 4, title: "PLACE 4" }),
  A(27, "Every drain has a curve in the pipe"),
  C(27, "That water is a plug", "RhDrainTrap", { mode: "full", bed: I("b_guestshower"), labels: { water: "Water plug" } }),
  B(27, "where it belongs", "b_ptrap", `The white curved drain pipe under a bathroom sink, seen up close in a cabinet.`, "the light shifts slowly; nothing else moves"),
  A(28, "But a guest shower nobody uses"),
  B(28, "a basement floor drain", "b_basedrain", `A round metal floor drain in a gray concrete basement floor next to a water heater.`, "dust drifts in the light; nothing else moves"),
  B(28, "the tub in the spare bathroom", "b_sparetub", `A dry white tub in a spare bathroom, a folded towel on its edge, unused.`, "the light shifts slowly; nothing else moves"),
  C(28, "that water dries up in a few weeks", "RhDrainTrap", { mode: "dry", bed: I("b_sparetub") }),
  // arreglo
  A(29, "The fix costs nothing", { kick: { txt: "$0 FIX", hand: true } }),
  K(29, "Run the water for a minute", "k_runtub", `Close view of water pouring from a tub faucet into a white tub drain.`, "the faucet is off", "water pours out and swirls into the drain", "a tub faucet running"),
  C(29, "That fills the curve back up", "RhDrainTrap", { mode: "full", bed: I("b_sparetub"), labels: { water: "Plug is back" } }),
  K(29, "pour in a pitcher of water", "k_pitcher", `Close view of a plastic pitcher pouring water into a round metal floor drain in a concrete basement floor.`, "the pitcher tips over the drain", "the water pours into the drain", "water pouring into a drain"),
  // historia $3,000
  A(30, "I had a couple selling their house"),
  B(30, "the buyers smelled the basement", "b_buyers", `A couple in their thirties standing in an unfinished basement, the woman holding her hand near her nose.`, "the woman turns her head a tiny bit; nothing else moves"),
  C(30, "Somebody quoted three thousand dollars", "RhQuoteStamp", { bed: I("b_basedrain"), price: "$3,000", stamp: "NOT NEEDED", instead: "a pitcher of water" }),
  R(30, "poured a pitcher of water into the floor drain", "r_pitcher", `She crouches in an unfinished basement, pouring a plastic pitcher of water into a round floor drain and glancing at the camera.`),
  R(30, "and it was a pitcher of water", "r_laugh", `She stands in an unfinished basement holding an empty plastic pitcher, laughing at the camera.`),
  // truco del aceite
  A(31, "Here's my trick so it doesn't dry out again"),
  K(31, "one tablespoon of cooking oil", "k_oil", `Close view of a tablespoon of golden cooking oil being poured into a round metal floor drain.`, "the spoon of oil tips over the drain", "the oil pours into the drain", "oil dripping"),
  C(31, "The oil floats on the water", "RhDrainTrap", { mode: "oil", bed: I("b_basedrain") }),
  // ── LUGAR 5 · heladera
  C(32, "", "RhHousePlan3D", { active: 5, title: "PLACE 5" }),
  A(33, "Not inside", { kick: { txt: "NOT INSIDE", red: true } }),
  B(33, "behind that little grille", "b_grille", `Close view of ${FRIDGE}.`, "the light shifts slowly; nothing else moves"),
  C(33, "Every bit of water from the defrost", "RhFridgeGrille", { bed: I("b_fridgelow"), label: "The drip pan" }),
  B(33, "in the warm air from the motor", "b_coils", `Dusty black coils and a small motor behind the bottom grille of a refrigerator, lit by a flashlight.`, "dust drifts in the flashlight beam; nothing else moves"),
  K(34, "The grille just pulls off", "k_grille2", `Close view of hands pulling the plastic grille off the bottom of a white refrigerator.`, "the hands grip the grille", "the grille comes off in their hands", "a plastic grille clicking off"),
  R(34, "Shine your flashlight in there", "r_flashfridge", `She kneels on the floor of ${KIT} in front of a white refrigerator with its bottom grille off, shining a flashlight underneath.`),
  B(34, "slimy water or black fuzz", "b_drippan", `A shallow white plastic drip pan under a refrigerator holding murky water with black fuzzy spots, lit by a flashlight.`, "the flashlight beam wobbles slightly; nothing else moves"),
  R(34, "since the day the refrigerator came home", "r_disgust", `She kneels in ${KIT} holding a grimy drip pan at arm's length, making a disgusted face at the camera.`),
  // arreglo
  K(35, "Dump it, wash it with hot soapy water", "k_washpan", `Close view of yellow-gloved hands scrubbing a white plastic drip pan with a sponge in a sink full of soapy water.`, "the gloved hands hold the pan in the suds", "the sponge scrubs the pan clean", "scrubbing in soapy water"),
  K(35, "spray it full strength with peroxide", "k_spraypan", `Close view of a brown spray bottle misting a clean white plastic drip pan on a towel.`, "the nozzle points at the pan", "a fine mist covers the pan", "a spray bottle spritzing"),
  C(35, "Ten minutes, wipe it dry, slide it back", "RhCheck", { title: "The drip pan", items: ["Dump", "Hot soapy water", "Peroxide, 10 min", "Dry, slide back"], fast: true }),
  B(35, "a long bottle brush and paper towels", "b_bottlebrush", `A long thin bottle brush and a roll of paper towels on the floor in front of a refrigerator.`, "the light shifts slowly; nothing else moves"),
  K(36, "vacuum the coils and the dust", "k_coils", `Close view of a vacuum cleaner crevice tool sucking dust off black coils under a refrigerator.`, "the nozzle reaches toward the dusty coils", "the dust disappears into the nozzle", "a vacuum cleaner humming"),
  // lavavajillas
  A(37, "And open your dishwasher"),
  K(37, "Pull out the bottom rack", "k_rack", `Close view of a hand pulling out the bottom rack of an open dishwasher.`, "the hand grips the rack", "the rack rolls out", "a dishwasher rack rolling"),
  B(37, "the round filter in the floor of it", "b_filter", `The round plastic filter in the floor of a dishwasher, grease and food bits around it.`, "the light shifts slowly; nothing else moves"),
  K(37, "It twists out", "k_filter", `Close view of a hand twisting the round filter out of the floor of a dishwasher.`, "the hand grips the filter", "the hand twists and lifts the filter out", "a plastic twist click"),
  K(37, "Rinse it under hot water with a soft brush", "k_rinsefilter", `Close view of a dishwasher filter under a running faucet, a soft brush scrubbing it.`, "the filter sits under the water", "the brush scrubs and the grease rinses off", "water running in a sink"),
  B(37, "leave the door cracked open", "b_dwcracked", `A dishwasher with its door cracked open a few inches in ${KIT}.`, "the light shifts slowly; nothing else moves"),
  // ── LUGAR 6 · placares
  C(38, "", "RhHousePlan3D", { active: 6, title: "PLACE 6" }),
  A(38, "Closets on outside walls"),
  B(39, "the coldest spot in the house", "b_closetdoor", `A closed bedroom closet door on the outside wall of a bedroom, frost on the window beside it.`, "the light shifts slowly; nothing else moves"),
  K(39, "like a glass of iced tea", "k_icedtea", `Close view of a glass of iced tea on a table, drops of condensation sliding down the outside.`, "the glass sits on the table", "a drop of water slides down the glass", "ice clinking in a glass"),
  K(40, "Push your clothes to the side", "k_clothes", `Close view of hands pushing hanging clothes along the rod in ${CLOSET}.`, "the hands reach into the clothes", "the hands push the clothes aside and the back wall shows", "clothes hangers sliding on a rod"),
  R(40, "lay your hand flat on the back wall", "r_closetwall", `She stands in an open bedroom closet with the clothes pushed aside, her yellow-gloved hand flat on the back wall, looking at the camera.`),
  B(40, "Little white or green spots on leather shoes", "b_mildewshoe", `Close view of a brown leather shoe with small white and green fuzzy spots on the toe, sitting on a closet floor.`, "the light shifts slowly; nothing else moves"),
  // arreglo
  K(41, "Pull everything out, wipe the wall", "k_wipewall", `Close view of a yellow-gloved hand wiping the white back wall of an empty closet with a cloth.`, "the cloth rests on the wall", "the cloth wipes across the wall", "a cloth wiping a wall"),
  C(41, "spray it with peroxide, ten minutes", "RhCheck", { title: "The closet", items: ["Everything out", "Peroxide, 10 min", "Wipe dry", "Door open, a few days"], fast: true }),
  B(41, "leave a hand's width of air", "b_handgap", `Clothes on hangers in a closet with a gap of about a hand's width between them and the back wall.`, "the clothes sway a tiny bit; nothing else moves"),
  B(41, "never put away anything damp", "b_dampshirt", `A damp shirt on a hanger, hanging from a closet doorknob to dry.`, "the shirt sways a tiny bit; nothing else moves"),
  B(42, "A pile of shoes by the door", "b_shoepile", `A messy pile of shoes and boots on a mat by a front door.`, "the light shifts slowly; nothing else moves"),
  K(42, "Let them dry out in the open air", "k_shoesdry", `Close view of a pair of leather shoes sitting on a porch step in the sun, a cloth wiping one toe.`, "the shoes sit in the sun", "the cloth wipes a spot off the toe", "a cloth rubbing leather"),
  // cuenta + prueba
  C(43, "That's all six", "RhHousePlan3D", { title: "ALL 6" }),
  A(43, "Five minutes, in that order"),
  A(44, "Try it right now", { kick: { txt: "TRY IT NOW", hand: true } }),
  K(44, "Go outside for two minutes", "k_porch", `Close view of a front door opening from a porch into ${HOUSE}, a hand on the knob.`, "the hand turns the doorknob", "the door opens into the house", "a front door opening"),
  C(44, "walk slow through the kitchen", "RhNoseMeter", { bed: I("b_cleankitchen"), steps: ["2 min outside", "Eyes closed", "Walk slow", "Strongest = look here"], found: "FOUND IT" }),
  R(44, "I've done it in hundreds of houses", "r_hundreds", `She stands in ${KIT} with her arms crossed, smiling confidently at the camera.`),
  // ── CTA a mitad (pág 15)
  C(45, "", "RhBookPage", { page: I("book_p15"), stamp: "Page 15 · Rhonda's book" }),
  A(45, "Ninety two fixes"),
  C(45, "The link's in the description", "RhQRCard", { qr: I("qr"), cover: I("book_cover") }),
  // ── la casa entera húmeda
  C(46, "", "RhChapter", { n: 3, title: "The whole house", sub: "when the air itself is wet" }),
  A(46, "It's the whole house"),
  B(47, "Get a little humidity meter", "b_hygro", `A small white digital humidity meter showing 72 percent sitting on a living room bookshelf.`, "the light shifts slowly; nothing else moves"),
  C(47, "Indoors, you want it under sixty percent", "RhHygrometer", { bed: I("b_hygro"), from: 72, to: 48, stamp: "UNDER 60%" }),
  R(47, "everything in your house stays a little damp", "r_hygro", `She stands in a living room in ${HOUSE}, holding up a small white humidity meter to the camera.`),
  A(48, "run a dehumidifier"),
  B(48, "especially in a basement", "b_dehumid", `A white dehumidifier running in an unfinished basement with a concrete floor.`, "the light shifts slowly; nothing else moves"),
  B(48, "fills up every single day", "b_dehumidtank", `The full water tank of a dehumidifier pulled out, water to the top line.`, "the water ripples a little; nothing else moves"),
  B(48, "Check the outside first", "b_gutter", `A gutter on an older Ohio house overflowing with water in the rain.`, "the water spills over the gutter edge; nothing else moves"),
  B(48, "where the ground slopes toward the house", "b_slope", `The side of an older house where the dirt slopes down toward the foundation, a puddle against the wall.`, "the puddle ripples a little; nothing else moves"),
];
