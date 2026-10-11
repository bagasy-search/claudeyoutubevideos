// DIRECTOR A — rhgrout: MINUTO 1 plano por plano (la frase + la línea blanca entre las grises en el mismo segundo → promesa con
// números en pantalla desde el ~4 → ráfaga con antes/después a los ~33 s → 3 loops (el cepillo, el trapeador, el sellador) → Rhonda)
// + EL ARREGLO completo + las 3 zonas (p0-20). Contraste en cada corte: Rhonda (celeste) / componente de color / macro gris / piso claro.
import { B, BS, ST, K, R, A, C, I, KIT, FLOOR } from "./h.mjs";
const LINE = `${FLOOR}, and one single grout line that is bright clean white`;
export const SHOTS = [
  // ── 0:00 · la frase + la línea blanca
  A(0, ""),
  K(0, "That's dirt", "k_whiteline", `Close view of ${LINE}, a yellow rubber-gloved fingertip resting on the white line.`, "the gloved fingertip rests on the white grout line", "the fingertip slides slowly along the white line", "a fingertip rubbing on tile"),
  R(1, "", "r_pointline", `She kneels on the kitchen floor of ${KIT}, pointing down at one single bright white grout line among the gray ones and looking up at the camera with raised eyebrows.`),
  // promesa con números en pantalla desde el ~4 (overlay sobre las tomas siguientes)
  B(1, "Same grout as all the others", "b_linemacro", `Extreme close view of ${LINE}, the white line running straight between two gray lines.`, "the view creeps slowly along the white line; nothing else moves",
    { ov: { c: "RhPromise", dur: 9.6, props: { img: I("b_floorafter"), items: ["½ cup baking soda", "¼ cup peroxide", "1 squirt dish soap", "15 minutes", "No $1,200 regrout"], result: "Same floor" } } }),
  B(1, "same floor", "b_floorwide", `Wide view of the floor of ${KIT}, one grout line near the stove is bright white.`, "the window light shifts slowly; nothing else moves"),
  B(1, "same age", "b_oldkitchen", `An older kitchen with oak cabinets, a white stove and a wall calendar, the tile floor worn in front of the sink.`, "a curtain moves a little; nothing else moves"),
  A(1, "I cleaned that one line"),
  B(1, "ten minutes ago", "b_bowlpaste", `A small white bowl of thick white paste with a spoon in it and a nylon grout brush, sitting on ${FLOOR}.`, "a few bubbles rise in the paste; nothing else moves"),
  C(1, "Every gray line in this kitchen", "RhFloorMap", { bed: I("b_floorwide"), title: "EVERY LINE", cols: 7, rows: 5 }),
  B(1, "down underneath", "b_poremacro", `Extreme close view of a dirty gray grout line between two beige tiles, tiny holes in the grout packed with dark dirt.`, "the view creeps slowly along the grout; nothing else moves"),
  // ── la promesa hablada
  K(2, "", "k_sodapour", `Close view of baking soda being poured from a measuring cup into a small white bowl on a kitchen counter.`, "the measuring cup tips over the bowl", "the white powder pours into the bowl", "powder pouring into a bowl"),
  C(2, "a quarter cup of the brown bottle", "RhBottle3D", { title: "3% hydrogen peroxide", sub: "the regular drugstore kind", tag: "¼ cup" }),
  K(2, "and one squirt of dish soap", "k_dishsoap", `Close view of a hand squeezing a plain white dish soap bottle over a small white bowl of baking soda paste.`, "the hand squeezes the bottle", "a drop of soap falls into the paste", "a squeeze bottle squirt"),
  B(2, "Fifteen minutes of waiting", "b_timer", `A white kitchen timer set to fifteen minutes sitting on ${FLOOR} next to a line of white paste.`, "the timer dial turns a tiny bit; nothing else moves"),
  B(2, "the right brush", "b_nylonbrush", `A narrow stiff white nylon grout brush with a blue handle lying across ${FLOOR}.`, "a light glint moves along the bristles; nothing else moves"),
  R(2, "and your floor comes back", "r_proudfloor", `She kneels on a clean kitchen floor with bright white grout lines in ${KIT}, sitting back on her heels and smiling proudly at the camera, a grout brush in her yellow-gloved hand.`),
  B(2, "the day they put it in", "b_newfloor", `A kitchen floor of beige square ceramic tiles with clean bright white grout lines, sunlight from a window across it.`, "the sunlight moves slowly across the floor; nothing else moves"),
  C(2, "And you keep the twelve hundred dollars", "RhQuoteStamp", { bed: I("b_floorwide"), price: "$1,200", stamp: "NOT NEEDED", instead: "a box of baking soda" }),
  // ── la ráfaga (con su sonido real)
  K(3, "", "k_mix", `Close view of a spoon stirring thick white baking soda paste in a small white bowl.`, "the spoon starts to stir", "the paste turns smooth and thick like frosting", "a spoon stirring thick paste"),
  K(3, "Spread it in the line", "k_spread", `Close view of a nylon grout brush spreading white paste along a dirty gray grout line between beige tiles.`, "the brush touches the grout line", "the brush spreads the white paste along the line", "a brush spreading paste"),
  K(3, "Wait", "k_fizz", `Extreme close view of white paste sitting in a grout line between beige tiles, tiny bubbles on its surface.`, "the paste sits still", "tiny bubbles fizz and pop on the paste", "soft fizzing bubbles"),
  K(3, "Scrub", "k_scrub", `Close view of a yellow-gloved hand scrubbing a grout line with a narrow nylon brush, gray paste around the bristles.`, "the brush scrubs back and forth", "the paste turns gray as the dirt comes up", "a stiff brush scrubbing tile grout"),
  K(3, "Wipe", "k_wipe", `Close view of a yellow sponge wiping gray paste off a grout line between beige tiles, the line underneath clean and white.`, "the sponge wipes across the line", "the clean white grout line shows", "a wet sponge wiping tile"),
  R(3, "And look at that", "r_wow", `She kneels on a kitchen floor in ${KIT} with a wet sponge in one yellow-gloved hand, pointing at a bright white grout line with the other and laughing at the camera, delighted.`),
  C(3, "Same floor, before and after", "RhWipeReveal", { before: I("b_floorbefore"), after: I("b_floorafter"), lb: "Before", la: "After" }),
  BS(3, "", "b_floorbefore", `Close view of ${FLOOR} in front of a white stove, every grout line dark gray.`, { skip: true }),
  BS(3, "", "b_floorafter", `Close view of beige square ceramic floor tiles in front of a white stove, every grout line clean and bright white.`, { skip: true }),
  // ── 3 loops
  A(4, "", { kick: { txt: "stay with me", hand: true } }),
  B(4, "there's one brush that ruins grout", "b_wirebrush", `A small wire brush with a wooden handle and steel bristles lying on ${FLOOR}.`, "a light glint runs along the steel bristles; nothing else moves"),
  B(4, "you've got one in your garage", "b_garage", `A garage pegboard with hand tools hanging on it, a small wire brush with a wooden handle hanging in the middle.`, "the wire brush swings a tiny bit on its hook; nothing else moves"),
  C(4, "There's the real reason your grout went gray", "RhGroutJoint3D", { mode: "mop", bed: I("b_floorwide"), labels: { grout: "Grout", week: "THE REASON" } }),
  B(4, "and it's something you do every single week", "b_mopbucket", `A string mop standing in a yellow bucket of gray dirty water on ${FLOOR}.`, "the gray water ripples a little; nothing else moves"),
  R(4, "to keep it clean", "r_mopping", `She mops the kitchen floor of ${KIT} with a string mop, looking at the camera over her shoulder with a knowing look.`),
  A(4, "And there's one last step"),
  B(4, "the one a contractor charges you for", "b_contractor", `A man in work clothes kneeling on ${FLOOR} measuring it with a tape measure, a clipboard on the floor.`, "the man pulls the tape measure out a little; nothing else moves"),
  B(4, "that costs about as much as a sandwich", "b_sandwich", `A sandwich on a paper plate next to a small bottle of grout sealer with a plain blank label on a kitchen counter.`, "the light shifts slowly; nothing else moves"),
  // ── quién soy
  A(5, "", { ov: { c: "RhNameTag", props: { name: "Rhonda", sub: "34 years cleaning other people's houses" } } }),
  ST(5, "houses in Ohio", "st_ohio6", "ohio small town houses", "A small Ohio town street with houses."),
  R(5, "and I've been on my knees", "r_knees", `She kneels on a kneeling pad on the kitchen floor of ${KIT}, scrubbing a grout line with a nylon brush, glancing up at the camera.`),
  B(5, "than I can count", "b_kneepad", `A worn blue kneeling pad, a yellow bucket and a grout brush on a kitchen tile floor.`, "the light shifts slowly; nothing else moves"),
  A(5, "So let me show you"),
  // ── 1:00 · EL ARREGLO
  C(6, "", "RhChapter", { n: 1, title: "The whole fix", sub: "page 14 of my book" }),
  B(6, "Gloves on", "b_gloves", `A pair of bright yellow rubber gloves lying on a kitchen counter next to a sponge.`, "a glove finger uncurls slightly; nothing else moves"),
  BS(6, "You need the brown bottle", "b_brownbottle", `A brown plastic bottle of 3% hydrogen peroxide with a plain blank white label standing on a kitchen counter in window light.`),
  B(6, "A box of baking soda", "b_sodabox", `An orange box of baking soda with a plain blank label on a kitchen counter, a little white powder spilled beside it.`, "the light shifts slowly; nothing else moves"),
  B(6, "Regular dish soap", "b_dishsoapbottle", `A plain white dish soap bottle with a blank label next to a kitchen sink.`, "a drop of soap slides down the bottle; nothing else moves"),
  C(6, "A small bowl", "RhCheck", { title: "What you need", items: ["Brown bottle, 3%", "Baking soda", "Dish soap", "Bowl + spoon", "Nylon grout brush", "Sponge + clean water"], fast: true }),
  B(6, "a sponge and a bucket of clean water", "b_cleanbucket", `A yellow bucket of clean clear water with a yellow sponge floating in it on ${FLOOR}.`, "the water ripples a little; nothing else moves"),
  // aspirar
  A(7, ""),
  K(7, "vacuum the floor", "k_vacuum", `Close view of the nozzle of a vacuum cleaner moving along a grout line on ${FLOOR}, crumbs and grit in the line.`, "the vacuum nozzle moves along the line", "the crumbs disappear into the nozzle", "a vacuum cleaner humming"),
  B(7, "every bit of grit", "b_grit", `Extreme close view of crumbs, sand and grit sitting in a gray grout line between beige floor tiles.`, "the view creeps slowly along the grit; nothing else moves"),
  C(7, "If you wet a floor with dirt on it", "RhGroutJoint3D", { mode: "mop", bed: I("b_floorwide"), labels: { week: "WET + GRIT = MUD" } }, { kick: { txt: "WET + GRIT = MUD", red: true } }),
  // la pasta
  C(8, "", "RhChapter", { n: 2, title: "The paste", sub: "mix it right before" }),
  K(8, "Half a cup of baking soda", "k_halfcup", `Close view of a half cup measuring cup full of baking soda being leveled with a butter knife over a white bowl.`, "the knife slides across the cup", "the extra powder falls into the bowl", "a knife scraping powder"),
  BS(8, "A quarter cup of peroxide", "b_quartercup", `A quarter cup measuring cup full of clear liquid next to a brown plastic bottle with a plain blank label and a white bowl of baking soda.`),
  K(8, "One teaspoon of dish soap", "k_teaspoon", `Close view of a teaspoon of clear dish soap being tipped into a white bowl of baking soda.`, "the teaspoon tips over the bowl", "the soap drips into the powder", "a liquid dripping"),
  K(8, "Stir it with the spoon", "k_stir2", `Close view of a spoon lifting thick white paste out of a small bowl, the paste holding its shape like frosting.`, "the spoon lifts out of the paste", "the thick paste holds its peak on the spoon", "a spoon in thick paste"),
  B(8, "If it's runny", "b_runny", `Close view of runny white paste dripping off a spoon into a small bowl.`, "the paste drips off the spoon; nothing else moves"),
  // fresca y nunca tapada
  A(9, ""),
  B(9, "Never put it in a bottle with the cap on", "b_capbottle", `A plastic squeeze bottle with its cap screwed on, half full of white paste, on a kitchen counter.`, "the light shifts slowly; nothing else moves", { kick: { txt: "NEVER CAPPED", red: true } }),
  C(9, "Peroxide gives off a little oxygen", "RhGroutJoint3D", { mode: "paste", bed: I("b_floorwide"), labels: { paste: "Oxygen bubbles" } }),
  C(9, "That one batch does about ten square feet", "RhFloorMap", { bed: I("b_floorwide"), title: "1 BATCH ≈ 10 SQ FT", cols: 4, rows: 3 }),
  // aplicar
  K(10, "", "k_spread2", `Close view of a narrow nylon brush pushing white paste down into a gray grout line between beige floor tiles.`, "the brush pushes into the line", "the paste fills the line", "a brush pressing paste"),
  B(10, "Not on the whole tile", "b_lineonly", `Top view of beige floor tiles with white paste only along the grout lines in a neat grid, the tiles clean.`, "the light shifts slowly; nothing else moves"),
  R(10, "Push it in a little", "r_push", `She kneels on ${FLOOR} in ${KIT}, pressing white paste into a grout line with a nylon brush, concentrating.`),
  // esperar
  A(11, ""),
  C(11, "Ten to fifteen minutes", "RhTimer30", { minutes: 15, fast: true, label: "Then scrub" }),
  K(11, "You'll see it fizz", "k_fizz2", `Extreme close view of white paste in a dirty grout line with tiny bubbles forming on top.`, "the paste sits in the line", "tiny bubbles form and pop on top", "soft fizzing"),
  C(11, "That's the peroxide going to work", "RhGroutJoint3D", { mode: "paste", bed: I("b_floorwide"), labels: { pore: "Little holes", dirt: "The dirt", paste: "Paste" } }),
  K(11, "mist it with a little more peroxide", "k_mist", `Close view of a spray bottle misting clear liquid onto white paste in a grout line on a beige tile floor.`, "the spray bottle trigger is squeezed", "a fine mist lands on the paste", "a spray bottle misting"),
  // fregar
  C(12, "", "RhChapter", { n: 3, title: "Scrub, rinse, dry", sub: "let the bristles work" }),
  K(12, "short strokes", "k_strokes", `Close view of a yellow-gloved hand scrubbing a grout line with short strokes of a nylon brush, white paste foaming.`, "the brush scrubs with short strokes", "the paste foams and turns gray", "a brush scrubbing quickly"),
  R(12, "You don't need to push hard", "r_gentle", `She kneels on the kitchen floor of ${KIT}, scrubbing a grout line lightly with a nylon brush held loosely in her yellow-gloved fingers, talking to the camera.`),
  B(12, "You'll see the gray come right up", "b_graypaste", `Close view of white paste turned gray along a grout line after scrubbing, a nylon brush resting beside it.`, "the light shifts slowly; nothing else moves"),
  // enjuagar
  K(13, "", "k_sponge", `Close view of a yellow sponge being wrung out over a bucket of water next to a beige tile floor.`, "the hand squeezes the sponge", "water pours out of the sponge into the bucket", "water squeezed from a sponge"),
  A(13, "here's the part people get wrong", { kick: { txt: "CHANGE THE WATER", red: true } }),
  B(13, "The minute it looks gray", "b_graybucket", `A yellow bucket of murky gray water on a kitchen floor with a sponge in it.`, "the gray water ripples; nothing else moves"),
  K(13, "Dirty rinse water", "k_dump", `Close view of a yellow bucket of gray water being poured into a utility sink.`, "the bucket tips over the sink", "the gray water pours into the sink", "dirty water pouring into a sink"),
  C(13, "into the grout you just cleaned", "RhGroutJoint3D", { mode: "drop", bed: I("b_floorwide"), labels: { grout: "Drinks it back" } }),
  // secar
  B(14, "", "b_wetgrout", `Close view of freshly rinsed grout lines between beige tiles, still wet and darker, water beads on the tiles.`, "a water bead slides a little; nothing else moves"),
  R(14, "Give it a few hours", "r_coffee", `She sits at the kitchen table in ${KIT} with a cup of coffee, looking down at the drying floor and then at the camera with a patient smile.`),
  // resumen
  C(15, "", "RhCheck", { title: "The main fix", items: ["Vacuum", "Mix", "Spread", "Wait", "Scrub", "Rinse, clean water", "Let it dry"], fast: true }),
  // antes / después otra vez
  A(16, ""),
  C(16, "before and after", "RhWipeReveal", { before: I("b_stovebefore"), after: I("b_stoveafter"), lb: "Before", la: "After" }),
  BS(16, "", "b_stovebefore", `Close view of the beige tile floor in front of a white kitchen stove, the grout lines dark gray-brown.`, { skip: true }),
  BS(16, "", "b_stoveafter", `Close view of the beige tile floor in front of a white kitchen stove, the grout lines clean and white.`, { skip: true }),
  B(16, "Nothing ripped out", "b_notools", `A grout saw and a tile chisel lying unused in a closed toolbox in a garage.`, "the light shifts slowly; nothing else moves"),
  R(16, "Just the dirt that was living down in it", "r_satisfied", `She stands in ${KIT} with her yellow-gloved hands on her hips, looking down at a clean white-grouted floor and nodding, satisfied.`),
  // ── las 3 zonas
  C(17, "", "RhFloorMap", { bed: I("b_floorwide"), title: "3 WORST SPOTS", zones: [{ label: "STOVE", x: 0.2, y: 0.3 }, { label: "SINK", x: 0.6, y: 0.25 }, { label: "BACK DOOR", x: 0.82, y: 0.78 }] }),
  A(17, "and each one needs a little something extra"),
  ST(18, "", "st_stovecook", "cooking on stove pan", "A pan frying on a white kitchen stove."),
  B(18, "Grease is sticky", "b_greasegrout", `Extreme close view of black greasy grout lines on beige tiles in front of a stove, a few crumbs stuck in them.`, "the view creeps slowly; nothing else moves"),
  K(18, "scrub with a little dish soap and warm water first", "k_soapscrub", `Close view of a brush scrubbing soapy warm water along a black greasy grout line in front of a stove.`, "the brush scrubs the soapy line", "suds lift the grease", "a brush scrubbing soapy water"),
  C(18, "The soap cuts the grease", "RhCheck", { title: "In front of the stove", items: ["1 · Dish soap + warm water", "2 · Rinse", "3 · Then the paste"], fast: true }),
  ST(19, "", "st_sinkdishes", "washing dishes kitchen sink", "Hands washing dishes in a kitchen sink."),
  B(19, "Drips, splashes, the wet dishcloth", "b_dishcloth", `A wet dishcloth fallen on beige floor tiles in front of a kitchen sink, a few water drops around it.`, "a drop falls from the counter edge; nothing else moves"),
  B(19, "that gray green look", "b_greengrout", `Extreme close view of greenish gray grout lines between beige tiles in front of a kitchen sink cabinet.`, "the view creeps slowly; nothing else moves"),
  R(19, "and then dry it good", "r_drytowel", `She kneels in front of the sink in ${KIT}, drying the floor with an old towel under her yellow-gloved hand.`),
  ST(20, "", "st_backdoor", "muddy shoes door mat", "Muddy shoes on a door mat by a back door."),
  B(20, "Sand and dirt off everybody's shoes", "b_sandgrout", `Close view of sand and grit on beige floor tiles just inside a back door, the grout lines dark.`, "the light from the door shifts; nothing else moves"),
  K(20, "That's the one you vacuum twice", "k_vacuum2", `Close view of a vacuum nozzle passing slowly over gritty grout lines by a back door.`, "the nozzle passes slowly", "the grit is sucked up", "a vacuum cleaner"),
  B(20, "And put a rug outside that door", "b_rugoutside", `A coir door mat on a back porch step outside a kitchen door.`, "a leaf blows across the step; nothing else moves"),
];
