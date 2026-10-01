// DIRECTOR de ollarder — «How Logging Camps Kept 100 Men's Food From Freezing and Rotting All Winter (No Electricity)»
// S(p, frase, kind, name, opts): p = párrafo del guion filmado · frase = palabras donde CORTA (contiguas, dentro del párrafo)
// kind: av (avatar InfiniteTalk) · vl (hablado agnes 2.5) · st (stock Pexels REAL: name = s_* → stock_pick.json)
//       ar (archivo REAL dominio público: name = a_*) · ole (foto gpt con Ole, /edits) · bi (foto gpt sin Ole)
//       c (componente Olr*/Ole*) · opts: { p: prompt, anim: movimiento agnes v2 (mano/objeto SIN cara), props, ov: overlay {c, props} }
import { S, BI, CAMP, OLEP } from "./dir_lib.mjs";
export const SHOTS = [
  // ══ P0 HOOK — minuto 1 (≥20 cortes, ninguna toma >4 s, Ole HABLANDO desde el cuadro 0) ══
  S(0, "", "vl", "m1"),
  S(0, "a hundred hungry men", "ar", "a_cookhall"),
  S(0, "five long months", "bi", "b_deepsnow", { p: BI(`Exterior of a small old log cook shack with a stovepipe and a lean-to shed on its side, buried in deep snow under heavy pines, smoke rising from the chimney, a path trodden through the snow to the door, bright overcast winter daylight.`), anim: "thin smoke rises from the stovepipe and a little snow slides off the roof" }),
  S(0, "and not a refrigerator", "bi", "b_nofridge", { p: CAMP(`A bare log wall with a plank shelf, a black iron wood cookstove in the corner and a wooden icebox-sized empty spot with nothing electric anywhere, only a coiled kerosene lantern on a nail and a frosty window, nobody in frame.`), anim: "the lantern flame flickers and the window frost glints" }),
  S(0, "So how did that food", "vl", "m2"),
  S(0, "Give me a few minutes", "vl", "m2"),
  S(0, "camp cook carried", "c", "OlrZones3D", { props: { mode: "tease" } }),
  S(0, "And stick around", "vl", "m4"),
  S(0, "will ruin a cellar", "bi", "b_sprouts", { p: BI(`Close view of a wooden crate of potatoes with long pale white sprouts growing out of them in the dark of a root cellar, a few shriveled soft ones on top, one lantern-lit shelf edge beside it.`), anim: "the long pale sprouts sway very slightly as if in a draft" }),
  S(0, "and most folks do it", "bi", "b_applepotato", { p: BI(`A wooden crate of red apples sitting right beside a crate of potatoes on a cellar shelf, side by side touching, a hand-written paper tag on neither, a kerosene lantern glow, cobweb in the corner.`), anim: "the lantern light flickers across the two crates" }),
  // ══ P1 EL PROBLEMA ══
  S(1, "", "vl", "m5"),
  S(1, "both at once", "bi", "b_coldfriend", { p: CAMP(`A cold pantry shelf with frost on the window glass beside it and, a few steps away, a warm lantern glowing over an old man's two hands wrapped around a steaming blue enamel mug on a plank table, nobody's face in frame.`), anim: "steam rises from the mug and frost glints on the glass" }),
  S(1, "Cold slows rot down", "bi", "s_snowcabin", { p: BI(`A small log cabin buried to its windowsills in snow in a still pine forest, cold blue shadows, one thin line of chimney smoke, long icicles along the eaves, no people.`), anim: "powder snow slides slowly off the roof edge" }),
  S(1, "Nothing spoils fast", "bi", "b_frostjar", { p: BI(`A glass jar of milk-white butter and a crock with a plate lid sitting on a log windowsill, white frost feathers on the cold window glass behind them, deep snow outside, nobody in frame.`), anim: "frost glints and a little breath of cold mist drifts off the jar" }),
  S(1, "But freeze the wrong food", "bi", "b_frozenpotato", { p: BI(`A potato cut in half with dark watery brown-gray flesh and tiny ice crystals glistening in it, on a cold wooden board, a knife beside it, frost on the board edge.`), anim: "a drop of water slides down the cut face" }),
  S(1, "Potatoes turn to mush", "bi", "b_mush", { p: BI(`A pile of limp, mushy, collapsed potatoes oozing water on a plain white enamel plate, a fork pressed into one that has sunk like a sponge, kitchen table.`), anim: "the fork sinks slowly into the mushy potato" }),
  S(1, "Jars burst", "kf", "d_jar"),
  S(1, "So the whole job", "c", "OlrQuestion", { props: {} }),
  S(1, "how cold does THIS", "ole", "o_thermo", { p: OLEP(`He holds a potato in one hand and a small round tin thermometer in the other, studying the thermometer with his eyebrows raised, tilting his head as if asking it a question.`) }),
  // ══ P2 CONTEXTO: TRINEOS / KEEP-OVERS ══
  S(2, "", "ar", "a_logcamp"),
  S(2, "Most logging crews", "ar", "a_horsesled"),
  S(2, "because frozen ground", "bi", "s_horsesleigh", { p: BI(`Two draft horses in harness pulling a heavy sleigh loaded high with logs along a packed-snow forest road between tall pines, their breath steaming, the driver a dark figure seen from behind on the load.`), anim: "the horses plod forward and their breath steams" }),
  S(2, "So the camp got built first", "c", "OlrCampRoute", { props: {} }),
  S(2, "There was no running", "bi", "b_snowtrail", { p: BI(`An unplowed snowy wagon track winding away between tall dark pines under a flat white winter sky, deep snow, the tracks of sleigh runners and a lone horse's hoofprints, nobody in frame.`), anim: "a gust lifts fine snow dust off the track" }),
  S(2, "Whatever that crew", "bi", "b_standingfood", { p: CAMP(`Floor-to-beam piles of barrels, burlap sacks and wooden crates stacked in the camp storeroom, a plank walkway through them, lantern light on the stacks, nobody in frame.`), anim: "dust floats slowly in the lantern light" }),
  // ══ P3 CTA (una vez) ══
  S(3, "", "av", ""),
  S(3, "Everything I know", "bi", "b_cookbookpantry", { p: CAMP(`An open cookbook with blank pages lying on the rough plank table beside a crock of sauerkraut, a jar of white lard and a basket of potatoes, a blue enamel mug, lantern and window light, nobody in frame.`), anim: "the lantern light flickers across the open book" }),
  S(3, "It's a cookbook now", "c", "OleCTA", { props: { cover: "img/ole/portada.png", qr: "qr_ole_ollarder.png", kicker: "THE WHOLE LARDER, WRITTEN DOWN", point: "Point your phone here", line: "50 old camp recipes" } }),
  S(3, "Now back to the cook shack", "av", ""),
  // ══ P4 QUÉ COMÍAN ══
  S(4, "", "bi", "b_saltpork", { p: BI(`A thick slab of salt pork with a white salted rind and pink streaks lying on a rough plank cutting board beside a heavy butcher knife and a coarse crock of salt, kerosene lantern glow.`), anim: "a few grains of coarse salt roll off the slab" }),
  S(4, "navy beans", "bi", "s_beans", { p: BI(`Close view of dry white navy beans being scooped out of an open burlap sack with a tin scoop onto a rough wooden table, a few beans bouncing, hand and sleeve only, no face.`), anim: "beans pour off the scoop and bounce" }),
  S(4, "flour molasses", "bi", "b_molasses", { p: BI(`A dented tin pail of dark molasses with a wooden dipper beside an open sack of flour on a plank shelf, a dark drip running down the pail's rim, log wall behind.`), anim: "a heavy dark drop of molasses stretches and falls from the dipper" }),
  S(4, "dried fruit prunes", "bi", "b_prunes", { p: BI(`A cloth sack of dried prunes and a shallow wooden box of dried apple rings on a plank table in a log cabin, one prune lying wrinkled and glossy in the foreground, window light.`), anim: "a hand takes one prune out of the sack" }),
  S(4, "Later camps added", "bi", "s_doughnuts", { p: BI(`Golden doughnuts cooling on a wire rack beside a black cast iron pot of hot fat on a wood stove in a log cook shack, steam rising, window light, nobody in frame.`), anim: "steam rises off the doughnuts" }),
  S(4, "The old accounts say", "ar", "a_cookhigh"),
  S(4, "A hundred or more men", "ar", "a_crewcold"),
  S(4, "The cook's job was", "ole", "o_pantryfail", { p: OLEP(`He stands beside a nearly empty barrel with its lid off, looking into it with a worried frown and one hand on his white beard, then glancing up toward the camera.`) }),
  // ══ P5 LAS TRES ZONAS ══
  S(5, "", "c", "OlrZones3D", { props: { mode: "full", at: { z1: "@Zone one is", z2: "@Zone two is", z3: "@Zone three is", bed: "@Every food in that camp" } } }),
  S(5, "Put a food in the wrong zone", "vl", "m6"),
  // ══ P6 ZONA 1: CARNE CONGELADA ══
  S(6, "", "bi", "b_frozenside", { p: BI(`The unheated lean-to shed on the side of an old log cook shack, its plank door open, frost-covered quarters of beef hanging and stacked inside in deep shadow, snow drifted against the wall, bright winter daylight.`), anim: "a breath of cold fog drifts out of the open shed door" }),
  S(6, "The old records talk", "bi", "b_beefquarters", { p: BI(`Close view of frost-covered frozen beef quarters stacked on rough planks inside a cold shed, white rime on the dark red meat, an iron meat hook, a wooden mallet leaning beside.`), anim: "a flake of frost drops off the frozen meat" }),
  S(6, "and stacked up outside", "bi", "b_cordwood", { p: BI(`Frozen quarters of beef stacked like cordwood against the outside log wall of a cook shack under the eaves, white frost on the meat, deep snow on the ground and on the stack, an iron meat hook on the wall, bright winter daylight.`), anim: "powder snow slides off the top of the frozen stack" }),
  S(6, "Out beside the kitchen", "bi", "b_sawshed", { p: BI(`A rough plank shed beside a log kitchen with a sawbuck workbench inside, a hand saw hanging on a nail, a pile of frozen meat chunks on the bench and sawdust of frost on the floor, snow outside the open side.`), anim: "frost sawdust drifts down from the bench edge" }),
  S(6, "got sawed into", "kf", "d_saw"),
  S(6, "Sawed friend like lumber", "ole", "o_saw", { p: OLEP(`He grins broadly holding a long bone saw in one hand and patting a block of frozen beef on the plank table with the other, as if it were a log, chuckling at the camera.`) }),
  S(6, "I can tell you", "bi", "s_butcher", { p: BI(`A bright spotless modern butcher shop counter with neat trays of cut steaks and chops behind glass, a butcher's hands wrapping a package in white paper, no face.`), anim: "the hands fold the paper around the package" }),
  // ══ P7 POR QUÉ SE CONSERVA / EL RELOJ ══
  S(7, "", "bi", "s_frozenmeat", { p: BI(`Close view of a frozen roast and steaks with white ice crystals on them in a chest freezer, frost on the freezer wall, cold light.`), anim: "cold mist drifts off the frozen meat" }),
  S(7, "Because the germs", "c", "OlrThawClock", { props: { at: { frozen: "@The folks at", sleep: "@Freezing puts those germs", thaw: "@the clock starts", } } }),
  S(7, "So a camp cook cut", "bi", "b_dayportion", { p: BI(`An old hand slicing one portion of frozen beef off a large frozen quarter at the edge of a cook shack workbench, the rest of the pile still stacked in frost behind, a lantern and a tin plate beside, sleeve and hand only, no face.`), anim: "the knife slides through the portion and a little frost falls" }),
  // ══ P8 TU COCINA: DESCONGELAR ══
  S(8, "", "av", ""),
  S(8, "Don't thaw a roast", "bi", "b_counterroast", { p: BI(`A frozen roast in a wet plastic-free paper wrapper left sitting on a bright kitchen counter with a puddle of meltwater spreading around it, a kitchen clock on the wall behind showing late afternoon, nobody in frame.`), anim: "meltwater slowly spreads across the counter" }),
  S(8, "Thaw it in the refrigerator", "bi", "b_fridgethaw", { p: BI(`A roast on a plate on the bottom shelf of an open home refrigerator, cold light inside, a few bowls and jars around it, covered with a plain cloth.`), anim: "a thin mist of cold air drifts out of the open fridge" }),
  S(8, "or in cold water", "bi", "b_coldwaterbowl", { p: BI(`A roast sealed in a plain bag submerged in a big metal bowl of clear cold water in a kitchen sink, a few ice cubes floating, a thermometer hanging on the bowl rim.`), anim: "the water surface ripples slightly and an ice cube turns" }),
  S(8, "A frozen roast sitting out", "ole", "o_roast", { p: OLEP(`He shakes his head with a disapproving frown, pointing a finger down at a roast sitting out on the plank table in a puddle of meltwater, a lantern behind him.`) }),
  S(8, "Cold keeps the meat", "av", ""),
  // ══ P9 DESHIELO ══
  S(9, "", "bi", "b_dripeaves", { p: BI(`Icicles dripping on the eaves of a log cabin roof in weak winter sun, snow sliding off the shingles, wet dark patches on the logs, a puddle forming under the drip line.`), anim: "drops fall steadily off the icicles" }),
  S(9, "when the shed sags", "bi", "b_softpile", { p: BI(`A pile of beef quarters in a shed gone dull and soft at the edges, wet red meat with melting frost dripping from the edges, a puddle on the floor boards, daylight leaking in through a gap in the door.`), anim: "a drip falls from the soft meat into the puddle" }),
  S(9, "A good cook watched", "bi", "s_thermoweather", { p: BI(`A round tin thermometer on a cabin porch post in weak sunshine with melting snow dripping from the roof edge behind it, the needle just above freezing, nobody in frame.`), anim: "a drop of meltwater falls past the thermometer" }),
  S(9, "Whatever had started", "bi", "b_cookfirst", { p: CAMP(`A big black iron skillet on a cast iron wood cookstove with thick slabs of beef sizzling in it, steam rising, a ladle and a tin pan of more meat beside, lantern and window light.`), anim: "steam and a wisp of smoke rise from the sizzling meat" }),
  S(9, "You'd do the same", "bi", "b_freezerdoor", { p: BI(`The open door of a modern home chest freezer in a dark basement with water pooling on the floor beneath it, soft thawing packages and ice chunks inside, a flashlight beam across them.`), anim: "a flashlight beam sweeps across the dripping packages" }),
  // ══ P10 ORDEN DE CARNES ══
  S(10, "", "c", "OlrWinterOrder", { props: { mode: "meat", at: { a: "@Fresh beef went first", b: "@The salt pork", c: "@That's the whole strategy" } } }),
  S(10, "It's the same thing", "bi", "s_fishmarket", { p: BI(`Fresh whole fish on crushed ice on a plank table beside a neat stack of tin cans, a cook's apron edge at the frame side, bright light.`), anim: "a fish glistens on the ice" }),
  // ══ P11 LO QUE NO VA EN LA ZONA FRÍA ══
  S(11, "", "bi", "b_shedpotatoes", { p: BI(`A wooden crate of potatoes left in an unheated plank shed, the potatoes dark and frost-glazed with white ice crystals on them, a thermometer on the wall frosted over, snow drifting in under the door.`), anim: "a little powder snow blows in under the door" }),
  S(11, "Freeze a potato", "c", "OlrFreezeBreak", { props: { mode: "potato", at: { freeze: "@Freeze a potato", thaw: "@When it thaws" } } }),
  S(11, "Freeze a jar", "c", "OlrFreezeBreak", { props: { mode: "jar", at: { freeze: "@Freeze a jar", crack: "@and cracks the glass" } } }),
  S(11, "So the cook never", "ole", "o_nopotato", { p: OLEP(`He stands shaking his head firmly, one hand held up in a stop sign, in front of a crate of potatoes on the floor right beside a frosty cold plank door, a thermometer on the wall.`) }),
  S(11, "But a potato wants", "bi", "b_potatoshelf", { p: CAMP(`A plank shelf with a neat row of clean sound potatoes laid out in a wooden slatted crate in the dim cool storeroom, a small thermometer hanging above it, lantern light, nobody in frame.`), anim: "the lantern light shifts slowly across the potatoes" }),
  // ══ P12 ZONA 2: EL DINGLE ══
  S(12, "", "av", ""),
  S(12, "Some of the old camps", "c", "OlrZones3D", { props: { mode: "dingle", at: { cold: "@One side was unheated", warm: "@The other side was heated", wall: "@One little building" } } }),
  S(12, "That's the whole idea", "bi", "b_dingleoutside", { p: BI(`A small lean-to addition built onto the side of an old log kitchen, with two plank doors side by side, a little stovepipe poking out of one half and frost on the other half's door, snow on the roof, no people.`), anim: "smoke curls out of the small stovepipe on one half" }),
  // ══ P13 LA TIERRA + LOS NÚMEROS DEL LIBRO ══
  S(13, "", "c", "OlrCellar3D", { props: { mode: "earth", at: { swing: "@even when the air above", steady: "@because the earth" } } }),
  S(13, "Now every food has", "c", "OlrRangeBoard", { props: { at: { p: "@Potatoes want", o: "@Onions", c: "@Carrots", a: "@Apples", k: "@Cabbage" } } }),
  // ══ P14 POR QUÉ LA PAPA QUIERE MÁS TIBIO ══
  S(14, "", "av", ""),
  S(14, "Hold a potato too cold", "c", "OlrSweeten", { props: { at: { cold: "@Hold a potato", sugar: "@it starts turning", good: "@The good news", warm: "@Bring them into" } } }),
  S(14, "But a cook with", "ole", "o_potatoes", { p: OLEP(`He turns a sound potato over in his big hand, examining it with a patient little smile, a thermometer on a log post behind him reading just above forty, a slatted crate of potatoes beside him.`) }),
  // ══ P15 LADO HÚMEDO / LADO SECO ══
  S(15, "", "av", ""),
  S(15, "It had a wet side", "c", "OlrCellar3D", { props: { mode: "sides", at: { wet: "@It had a wet side", sand: "@with the carrots layered", dry: "@Onions want it dry", braid: "@hung in a braid" } } }),
  S(15, "A cook who mixes", "bi", "b_moldyonions", { p: BI(`Close view of cured onions with fuzzy gray-green mold and soft black patches in a damp crate, beside a limp rubbery shriveled carrot, dim cellar light, nobody in frame.`), anim: "a drip of water slides down a limp carrot" }),
  // ══ P16 EL PAGO: MANZANAS JUNTO A PAPAS ══
  S(16, "", "vl", "m7"),
  S(16, "Apples give off a gas", "c", "OlrCellar3D", { props: { mode: "ethylene", at: { gas: "@Apples give off", sprout: "@that gas makes potatoes", bitter: "@turns carrots bitter", you: "@You can't see it", whisk: "@growing whiskers" } } }),
  S(16, "Keep the apples on the far side", "bi", "b_applewrapped", { p: BI(`Red apples each wrapped in a sheet of plain brown paper and packed in a slatted crate on a far plank shelf of a root cellar, the potato bins on the opposite side of the room in the background, a lantern hanging between.`), anim: "the lantern swings very slightly and the light slides across the wrapped apples" }),
  // ══ P17 LA PÁGINA DEL LIBRO ══
  S(17, "", "c", "OleBookPage", { props: { src: "img/ollarder/book_root.png", aspect: 1347 / 1743, label: "A PAGE FROM THE BOOK", sub: "The Root-Cellar Shelf", keys: [[0, 0.5, 0.5, 1], ["@Shelf", 0.27, 0.33, 2.1], ["@Every number", 0.2, 0.56, 2.6], ["@And at the bottom", 0.4, 0.905, 2.3]], marks: [{ t: "@Shelf", x0: 0.074, y0: 0.345, x1: 0.52, y1: 0.345 }, { t: "@Every number", x0: 0.074, y0: 0.476, x1: 0.355, y1: 0.476 }, { t: "@I just gave you", x0: 0.074, y0: 0.530, x1: 0.34, y1: 0.530 }, { t: "@is right there", x0: 0.074, y0: 0.586, x1: 0.345, y1: 0.586 }, { t: "@with the humidity", x0: 0.074, y0: 0.624, x1: 0.345, y1: 0.624 }, { t: "@next to it", x0: 0.074, y0: 0.662, x1: 0.35, y1: 0.662 }, { t: "@never eat green", x0: 0.15, y0: 0.912, x1: 0.732, y1: 0.912 }] } }),
  S(17, "I won't ever tell", "ole", "o_throwout", { p: OLEP(`He tosses a green sprouted potato into a wooden bucket with a firm, decided little nod, his other hand on his hip, looking at the camera.`) }),
  // ══ P18 ARMAR LA BODEGA ══
  S(18, "", "av", ""),
  S(18, "First sort everything", "bi", "s_sorting", { p: BI(`Both old hands sorting potatoes into two wooden crates, laying firm clean ones in one crate and setting a bruised cut one aside, sleeves only, no face, cellar light.`), anim: "the hand sets a firm potato into the crate" }),
  S(18, "Second cure the onions", "bi", "b_curing", { p: BI(`Onions spread in a single layer on a wooden slatted drying rack in a shaded airy open-sided shed, bright snowless fall light, braids of onions hanging from the beam above, nobody in frame.`), anim: "a light breeze sways the hanging onion braids" }),
  S(18, "Third don't wash them", "bi", "b_dirtyspuds", { p: BI(`Unwashed potatoes with dried dirt still clinging to them piled in a wooden slatted crate, a stiff brush lying on top with a little loose dirt brushed off beside, plank floor, window light.`), anim: "a pinch of loose dirt crumbles off a potato" }),
  S(18, "And fourth go look", "c", "OlrSteps", { props: { at: { s1: 0.3, s2: 1.3, s3: 2.3, s4: 3.3 } } }),
  // ══ P19 EL TERMÓMETRO ══
  S(19, "", "bi", "b_thermowall", { p: CAMP(`Close view of a small round tin thermometer nailed to a log post above a slatted crate of potatoes, its needle just above forty degrees, lantern light on the log, cold mist in the dark corner, nobody in frame.`), anim: "the lantern flame flickers a little across the thermometer" }),
  S(19, "A few degrees is", "c", "OlrThermo", { props: { at: { spring: "@potatoes that last", dec: "@sprout in December" } } }),
  S(19, "You can't judge cold", "ole", "o_hand", { p: OLEP(`He holds one open bare hand out in front of him, palm down, with a skeptical wry look at the camera, as if the hand were untrustworthy, a thermometer nailed to the log post behind him.`) }),
  S(19, "Hang a thermometer", "bi", "b_hangthermo", { p: CAMP(`An old hand hammering a small nail to hang a round tin thermometer at the height of a potato bin on a log post, a slatted crate of potatoes below, lantern glow, hand and sleeve only, no face.`), anim: "the hammer taps the nail and the thermometer swings slightly" }),
  // ══ P20 LOS TRES ERRORES ══
  S(20, "", "av", ""),
  S(20, "One apples beside", "c", "OlrMistakes", { props: { at: { m1: "@One apples beside", m2: "@Two washed", m3: "@Three ignoring" } } }),
  S(20, "Every one of those", "av", ""),
  S(20, "That's why the book puts", "c", "OleBookPage", { props: { src: "img/ollarder/book_root.png", aspect: 1347 / 1743, label: "UNDER EVERY RECIPE", sub: "common mistakes", keys: [[0, 0.5, 0.5, 1], [0.7, 0.3, 0.83, 2.8]], marks: [{ t: 1.2, x0: 0.074, y0: 0.82, x1: 0.535, y1: 0.82 }, { t: 2.0, x0: 0.074, y0: 0.838, x1: 0.612, y1: 0.838 }, { t: 2.8, x0: 0.074, y0: 0.857, x1: 0.557, y1: 0.857 }] } }),
  S(20, "I earned every one", "ole", "o_sheepish", { p: OLEP(`He gives a sheepish half-smile and a small shrug, one hand scratching the back of his neck, standing next to a shelf with a few spoiled apples on it.`) }),
  // ══ P21 QUÉ SE VA PRIMERO ══
  S(21, "", "bi", "b_softapple", { p: BI(`A single bruised brown soft apple with a dent and a wet patch lying among firm red apples in a slatted crate, a finger pointing at it from the side of the frame, cellar lantern light.`), anim: "the pointing finger taps beside the bruised apple" }),
  S(21, "That's why you eat in an order", "c", "OlrWinterOrder", { props: { mode: "veg", at: { a: "@Apples and cabbage", b: "@Carrots and potatoes", c: "@Onions last", d: "@And come spring" } } }),
  S(21, "And come spring", "bi", "b_springsprout", { p: BI(`Potatoes on a cellar shelf with fat white sprouts and a few green patches, a crack of bright spring daylight coming in through the cellar door at the top of the steps, dust in the light, nobody in frame.`), anim: "dust floats through the bar of daylight from the door" }),
  // ══ P22 ZONA 3: EL LADO SECO ══
  S(22, "", "c", "OlrZones3D", { props: { mode: "dry", at: { go: "@This is where the flour" } } }),
  S(22, "the tea and the coffee", "bi", "b_tincoffee", { p: CAMP(`A dry plank shelf near the cast iron wood stove holding tin canisters of tea and coffee, a glass jar of sugar, a small box of baking soda, a tin of cream of tartar, labels blank, stove glow on the tins.`), anim: "the stove light flickers on the tins" }),
  S(22, "A sack of flour", "bi", "b_flourdamp", { p: BI(`Close view of a burlap flour sack with a damp dark stain along its bottom edge sitting on a bare cold floor, the flour inside clumped into hard lumps, a little musty gray at the seam.`), anim: "a pinch of flour falls from the damp clump" }),
  S(22, "and then the bugs", "bi", "b_flourbugs", { p: BI(`Extreme close view of dusty flour with a few tiny brown weevil beetles crawling across its surface, pale threads of webbing, harsh side light.`), anim: "a tiny weevil crawls across the flour" }),
  // ══ P23 MANTENER SECO ══
  S(23, "", "av", ""),
  S(23, "Off the floor", "bi", "b_offfloor", { p: CAMP(`Barrels of flour with tight wooden lids standing up on two timber rails off the plank floor, a covered wooden bin beside them, everything dry and clean, a broom leaning on the wall, lantern light, nobody in frame.`), anim: "dust floats gently in the lantern light" }),
  S(23, "Dry beans", "bi", "s_drybeans", { p: BI(`Dry white beans pouring from a metal scoop into a big clear glass jar on a plank table, a few beans on the wood, hand and sleeve only, no face.`), anim: "beans stream from the scoop into the jar" }),
  S(23, "dried apples", "bi", "b_driedapples", { p: BI(`Strings of dried apple rings hanging from a nail beside a clear glass jar of dry navy beans and a bag of rice on a plank shelf, soft window light, no people.`), anim: "the strings of apple rings sway very slightly" }),
  S(23, "A bean doesn't care", "bi", "b_beanjar", { p: BI(`A big clear glass jar of dry white navy beans with a tin lid sitting on a frost-edged windowsill in winter, a shovel of snow outside, one bean on the sill, no people.`), anim: "the light changes slightly across the beans as a cloud passes" }),
  S(23, "And a dry bean", "bi", "s_beanpot", { p: BI(`A black iron pot of baked beans with a ladle resting in it steaming on a plank table in a log cabin kitchen, bread and a blue enamel mug beside, window light.`), anim: "steam rises off the beans" }),
  // ══ P24 REGLA DE LOS CINCO SEGUNDOS ══
  S(24, "", "vl", "m8"),
  S(24, "If it's wet inside", "c", "OlrSortRule", { props: { at: { wet: "@If it's wet inside", meat: "@If it's meat", dry: "@If it's dry", end: "@That's it" } } }),
  // ══ P25 LA SAL ══
  S(25, "", "bi", "b_saltbarrel", { p: CAMP(`A wooden pork barrel with its lid off, thick slabs of salt pork packed in coarse white salt and a cloudy brine at the top, a wooden paddle and a crock lid beside it, log wall, lantern light, nobody in frame.`), anim: "a ripple moves across the cloudy brine at the top of the barrel" }),
  S(25, "Pack pork in enough salt", "c", "OlrSaltBrine", { props: { at: { salt: "@Pack pork", pull: "@the salt pulls", germ: "@A germ without", thats: "@That's all salting" } } }),
  S(25, "It's older than the camps", "kf", "d_salt"),
  S(25, "The cook just kept", "bi", "b_underbrine", { p: CAMP(`Looking into an open pork barrel at pieces of salt pork held down under cloudy brine by a round wooden board with a heavy stone on top, a hand lifting the lid edge, hand and sleeve only, no face.`), anim: "the brine ripples around the stone as the lid lifts" }),
  S(25, "he cut a slab", "bi", "b_rinsepork", { p: BI(`An old hand rinsing a slab of salt pork under a thin stream of water from a dipper over a tin basin, white salt crystals washing off the rind, sleeve and hand only, no face.`), anim: "the water streams over the slab and salt crystals wash off" }),
  // ══ P26 EL HOYO DE FRIJOLES ══
  S(26, "", "bi", "b_beanhole", { p: BI(`A hole dug in sandy ground with glowing red coals in it and a black cast iron lidded bean pot being lowered in with a hooked iron lifter by two old hands, early dawn light, sand and smoke, sleeves only, no faces.`), anim: "heat shimmer and thin smoke rise off the coals around the pot" }),
  S(26, "The old accounts", "ar", "a_beanhole"),
  S(26, "and the cookees were", "bi", "b_cookeefire", { p: BI(`A teenage kitchen helper in a wool cap and heavy coat crouching beside a bean hole in the snow feeding split wood into a fire in the dark before dawn, the lantern at his feet, his back mostly to the camera.`), anim: "the fire flares up as he adds a piece of wood" }),
  S(26, "A hundred men's", "bi", "s_morningcamp", { p: BI(`Dawn in a snowy logging camp, smoke rising from the cook shack chimney, men in wool coats and caps walking toward the lit doorway with lanterns across packed snow, seen from behind and at a distance.`), anim: "chimney smoke curls up into the cold air" }),
  S(26, "No pot to watch", "bi", "b_fireground", { p: BI(`A smoldering bed of ash and coals in the ground with a small mound of earth and a slab of bark heaped over it in the snow, a thin thread of smoke rising, the log cook shack in the background at dawn, nobody in frame.`), anim: "a thin thread of smoke curls up from the mound" }),
  // ══ P27 MANTECA ══
  S(27, "", "bi", "b_fatscraps", { p: BI(`A tin tray piled with creamy white pork fat trimmings and scraps beside a sharp knife on a plank table, a heavy cast iron pot waiting on the stove behind, window light.`), anim: "the knife slides through a piece of fat" }),
  S(27, "Chill the fat", "bi", "s_cuttingfat", { p: BI(`A sharp knife cutting a slab of cold white pork fat into small cubes on a wooden board, an old hand holding it steady, sleeve only, no face.`), anim: "the knife slices through the fat" }),
  S(27, "over the lowest heat", "c", "OlrLard", { props: { phase: "render", at: { heat: 0.5, time: "@for an hour and a half", clear: "@When the fat runs clear", strain: "@strain it through", jar: "@into clean jars" } } }),
  S(27, "High heat scorches", "bi", "b_scorched", { p: BI(`Close view of scorched dark brown burnt fat in a pot, smoking, with a black crust at the bottom, a spoon holding some of the bitter-looking brown liquid, harsh light.`), anim: "thin smoke curls off the burnt fat" }),
  S(27, "Low heat gives you", "bi", "b_whitelard", { p: BI(`A clean glass jar of pure creamy white lard with a wooden spoon beside it on a plank shelf next to a lantern, window light on the glass, nobody in frame.`), anim: "the lantern glow shifts over the white lard" }),
  // ══ P28 CUÁNTO DURA LA MANTECA ══
  S(28, "", "c", "OlrLard", { props: { phase: "keep", at: { fridge: "@keep that lard in", freezer: "@or in the freezer", bacon: "@Bacon fat", smell: "@If it smells sour" } } }),
  S(28, "And never leave fat", "bi", "b_garlicoil", { p: BI(`A clear glass jar of oil with whole garlic cloves and sprigs of herbs floating in it left sitting on a kitchen counter next to a window, afternoon sun on the jar, nobody in frame.`), anim: "the sun slides slowly across the jar" }),
  S(28, "All of that is on the page", "ole", "o_page", { p: OLEP(`He taps one finger on an open cookbook lying on the plank table with text-free blank pages in front of him, nodding with a reassuring smile at the camera, a blue enamel mug beside the book.`) }),
  // ══ P29 NADA SE TIRA ══
  S(29, "", "ar", "a_galley"),
  S(29, "The bacon rind", "bi", "b_rind", { p: BI(`A bacon rind being dropped into a black iron bean pot full of white navy beans with a wooden spoon beside it, steam rising, hand and sleeve only, no face.`), anim: "the rind slides down into the beans and steam rises" }),
  S(29, "The fat went into", "bi", "b_lardcrock", { p: CAMP(`A brown glazed crock filled with white lard with a wooden spoon standing in it on a plank shelf, a clean cloth cover folded beside, lantern glow, nobody in frame.`), anim: "the lantern glow shifts over the lard crock" }),
  S(29, "The cracklings from", "bi", "s_cornbread", { p: BI(`Golden cornbread in a cast iron skillet with crisp brown pork cracklings baked into the top, steam rising, a wooden spoon beside it, window light, nobody in frame.`), anim: "steam rises off the cornbread" }),
  S(29, "The cabbage core", "bi", "b_cabbagecore", { p: BI(`A green cabbage core cut out and lying on a chopping board next to a shredded pile of cabbage and a big knife, an old hand gathering the core into the pile, sleeve only, no face.`), anim: "the hand sweeps the cut core into the shredded cabbage" }),
  S(29, "A pantry isn't only", "av", ""),
  // ══ P30 CHUCRUT: INTRO ══
  S(30, "", "bi", "b_cabbageheads", { p: CAMP(`A pile of whole green cabbage heads on a plank shelf in a cellar, more heads crowding a wooden crate on the floor with no room left, lantern light, nobody in frame.`), anim: "the lantern glow flickers across the cabbage heads" }),
  S(30, "but there's a limit", "bi", "b_fullcellar", { p: CAMP(`A cellar so full that wooden crates of cabbages are stacked to the ceiling beams and more heads sit on the floor between barrels, no room left anywhere, lantern light, nobody in frame.`), anim: "the lantern light shifts across the stacked cabbages" }),
  S(30, "So the cook did something", "ole", "o_clever", { p: OLEP(`He gives a clever, knowing little smile and taps the side of his nose with one finger, a big green cabbage head on the plank table in front of him and a coarse salt crock beside it.`) }),
  S(30, "That's all it takes", "bi", "s_shredcabbage", { p: BI(`A big knife shredding a green cabbage into thin ribbons on a wooden board, a mound of shreds growing beside it, an old hand guiding the cabbage, sleeve only, no face.`), anim: "the knife slices fine ribbons off the cabbage" }),
  S(30, "The salt pulls", "bi", "b_brinepool", { p: BI(`Close view of salted shredded cabbage in a big wooden bowl, limp and glistening with a pool of clear brine collecting at the bottom, a pair of old hands pressing it, sleeves only, no face.`), anim: "the hands press down and brine wells up between the shreds" }),
  S(30, "That's sauerkraut", "bi", "b_crockkraut", { p: CAMP(`A big glazed stoneware crock of pale sauerkraut with a round board and a heavy stone on top and a cloth cover folded beside it, standing on the cool cellar floor, lantern glow, nobody in frame.`), anim: "a small bubble rises and pops in the brine beside the stone" }),
  // ══ P31 MÉTODO DEL CHUCRUT ══
  S(31, "", "bi", "b_shred2lb", { p: BI(`Two pounds of cabbage on a kitchen scale beside a sharp knife and a mound of finely shredded cabbage on a chopping board, an old hand holding the cabbage, sleeve only, no face.`), anim: "the knife slices thin shreds off the cabbage" }),
  S(31, "and weigh the salt", "bi", "b_scalesalt", { p: BI(`Fine white salt being spooned onto a small digital kitchen scale beside a bowl of shredded cabbage, the scale display blank, an old hand holding the spoon, sleeve only, no face.`), anim: "salt trickles from the spoon onto the scale" }),
  S(31, "Knead the salted cabbage", "bi", "b_knead", { p: BI(`Both old hands squeezing and kneading salted shredded cabbage in a big bowl until it gleams wet, brine running between the fingers, sleeves only, no face.`), anim: "the hands squeeze and brine runs down between the fingers" }),
  S(31, "Pack it tight", "c", "OlrKrautJar", { props: { mode: "pack", at: { pack: "@Pack it tight", press: "@press it under", temp: "@and set it somewhere" } } }),
  // ══ P32 BAJO LA SALMUERA ══
  S(32, "", "c", "OlrKrautJar", { props: { mode: "brine", at: { under: "@Under the brine", over: "@Above the brine", press: "@you press it down" } } }),
  S(32, "Taste it after a week", "ole", "o_taste", { p: OLEP(`He pulls a long forkful of pale sauerkraut out of a stoneware crock and tastes it with a puckered, delighted face, eyebrows up, a lantern and barrels behind him.`) }),
  S(32, "Then put it in the refrigerator", "bi", "b_krautfridge", { p: BI(`A glass jar of sauerkraut on a refrigerator shelf next to a jar of mustard and a bowl of leftovers, cold white fridge light, a thermometer dial hanging on the shelf.`), anim: "a thin mist of cold air drifts across the jar" }),
  S(32, "If you see fuzzy mold", "bi", "b_moldkraut", { p: BI(`Close view of the top of a jar of fermenting cabbage with fuzzy blue-green mold growing in spots on the surface above the brine line, a wooden spoon beside it, harsh kitchen light.`), anim: "a drop slides down the inside of the glass" }),
  S(32, "A flat white film", "bi", "b_whitefilm", { p: BI(`Close view of a smooth flat thin white film floating on the surface of cloudy brine in a jar of fermenting vegetables, no fuzz, a clean spoon beside the jar.`), anim: "the film trembles slightly as a bubble rises beneath it" }),
  // ══ P33 TRUCOS DE ENCURTIDOS ══
  S(33, "", "bi", "s_pickledonions", { p: BI(`A glass jar of bright pink pickled red onion slices on a plank kitchen counter with a bay leaf and peppercorns visible, window light, nobody in frame.`), anim: "a bubble rises slowly in the brine" }),
  S(33, "pour the brine on hot", "bi", "b_hotbrine", { p: BI(`Steaming hot brine being poured from a small saucepan over thin red onion slices packed in a pint glass jar on a kitchen counter, steam rising, old hand on the pan handle, sleeve only, no face.`), anim: "steam rises as the brine pours over the onions" }),
  S(33, "For the dill pickles", "bi", "b_icewater", { p: BI(`Small firm green pickling cucumbers soaking in a bowl of ice water with ice cubes floating on it, sprigs of dill beside the bowl, kitchen counter, window light.`), anim: "an ice cube turns slowly in the water" }),
  S(33, "and trim a sixteenth", "bi", "b_blossom", { p: BI(`Extreme close view of a knife trimming a thin slice off the blossom end of a small pickling cucumber on a wooden board, an old thumb holding it steady, no face.`), anim: "the knife slices a thin disk off the cucumber end" }),
  S(33, "A big old cucumber", "bi", "b_bigcuke", { p: BI(`A big old overgrown yellowing cucumber split open showing a hollow soft center with big seeds, lying beside a few small firm fresh ones on a wooden board.`), anim: "the knife presses and the big cucumber's soft middle gives way" }),
  // ══ P34 NOTA HONESTA: ENCURTIDOS DE HELADERA ══
  S(34, "", "av", ""),
  S(34, "The pickles in my book", "bi", "b_fridgepickles", { p: BI(`Two glass jars, one of bright pink pickled onions and one of dill pickles, sitting on a refrigerator shelf in cold white light beside a milk carton and a jar of jam.`), anim: "a mist of cold air drifts across the jars" }),
  S(34, "Onions in a hot brine", "bi", "b_onionjar", { p: BI(`Thin red onion slices packed in a pint glass jar with hot brine being poured over them on a counter, steam, an old hand holding the jar, sleeve only, no face.`), anim: "steam rises as the brine pours in" }),
  S(34, "and then they live", "bi", "b_jarsfridge", { p: BI(`A refrigerator shelf lined with glass jars of pickles and pink onions closing behind a cold door, white fridge light, no people.`), anim: "cold mist drifts across the jars" }),
  S(34, "They are not for", "bi", "b_nopantry", { p: BI(`A sunlit open wooden pantry shelf with jars of pickles sitting there at room temperature in warm afternoon light, a hand pulling one jar back toward the camera, sleeve only, no face.`), anim: "the hand slides the jar a little back", ov: { c: "OleStamp", props: { text: "FRIDGE ONLY", sub: "not a canning recipe", at: 0.5, x: 0.24, y: 0.26 } } }),
  S(34, "Canning for the shelf", "av", ""),
  // ══ P35 UN DÍA EN EL COOK SHACK ══
  S(35, "", "ar", "a_dininghall"),
  S(35, "The cook was up", "bi", "b_predawn", { p: CAMP(`A cook in a canvas apron lighting the cast iron wood cookstove in the pre-dawn dark, a kerosene lantern on the table, the window black, a big pot and a pile of split wood beside the stove, seen from behind, his face turned away.`), anim: "the match flares and the firebox light grows" }),
  S(35, "Long oilcloth tables", "ar", "a_longtables"),
  S(35, "And the rule of silence", "bi", "b_silence", { p: BI(`Men in wool shirts eating with their heads down in total silence at a long oilcloth-covered table in a log cook shack, backless benches, tin plates and tin cups, a sign-less log wall, seen from the end of the table, all faces turned down to their plates.`), anim: "forks lift and lower and steam rises from the tin cups" }),
  S(35, "Not because the cook", "ole", "o_cookclock", { p: OLEP(`He glances at the old wall clock beside the stove with a knowing half smile, a heavy ladle in his hand and a big steaming pot on the stove, as if already on the next meal.`) }),
  S(35, "A cook's whole day", "bi", "b_clock", { p: CAMP(`A plain old round wall clock on a log wall above a stove with a steaming pot, hands near five in the morning, lantern light, nobody in frame.`), anim: "steam from the pot drifts across the clock" }),
  // ══ P36 EL ALMUERZO AL BOSQUE ══
  S(36, "", "ar", "a_dinnerwoods"),
  S(36, "The cookees carried it", "bi", "b_yoke", { p: BI(`A teenage kitchen helper in a wool cap and heavy coat trudging through knee-deep snow between pines with a wooden yoke across his shoulders and a covered pail hanging at each end, seen from behind, steam from the pails.`), anim: "the pails swing gently from the yoke as he walks" }),
  S(36, "or pushed a little sled", "bi", "b_sled", { p: BI(`A small single-runner sled with plow handles loaded with covered pails and wooden food boxes standing in the snow on a forest track, a helper's mittened hands on the handles, no face.`), anim: "the sled creaks forward a little over the snow" }),
  S(36, "The cook went out ahead", "bi", "b_firewoods", { p: BI(`A small campfire built in the snow in a forest clearing with a black iron pot and a coffee pot hung over it, a cook in a canvas apron tending it, logging crew tools stacked against a stump, bright winter light.`), anim: "flames flicker and steam rises from the pot" }),
  S(36, "It was cold enough", "bi", "b_tinplate", { p: BI(`A tin plate of beans and gravy with white frost crystals forming on the gravy surface and a fork frozen into it, held at the edge of the frame in a gloved hand, snowy forest behind, no face.`), anim: "a wisp of steam rises and freezes over the plate" }),
  S(36, "That's how cold it was", "av", ""),
  // ══ P37 LAS TRES ZONAS EN TU CASA ══
  S(37, "", "av", ""),
  S(37, "Your freezer is zone one", "c", "OlrHomeZones", { props: { at: { z1: 0.3, z2: "@Your zone two" } } }),
  S(37, "or the refrigerator's crisper drawer", "bi", "b_crisper", { p: BI(`An open home refrigerator crisper drawer filled with carrots, red apples and a head of cabbage in neat sections, cold white light, a thermometer dial hanging on the shelf above, no people.`), anim: "cold mist drifts out of the crisper drawer" }),
  S(37, "And zone three", "c", "OlrHomeZones", { props: { pre: 2, at: { z3: 0.3, all: "@That's the whole camp" } } }),
  // ══ P38 SIN BODEGA ══
  S(38, "", "bi", "b_basementcorner", { p: BI(`A cool dark corner of an unfinished basement with slatted crates of potatoes and mesh bags of onions on a wooden pallet against a stone foundation wall, a small thermometer on the wall, a single bulb switched off, daylight from a small window.`), anim: "dust floats in the thin light from the basement window" }),
  S(38, "If you use a garage", "bi", "b_porchthermo", { p: BI(`A small thermometer nailed to the post of an unheated porch with a frosty view of a snowy yard behind it, the needle pointing low, white frost on the rail, a slatted crate of potatoes by the wall.`), anim: "a gust moves a little powder snow across the porch floor" }),
  S(38, "and watch what it says", "bi", "b_coldestnight", { p: BI(`A thermometer on an unheated porch post at night under a porch light with frost glittering on the rail and a bitterly cold blue yard behind, the needle far down, no people.`), anim: "frost glitters as the porch light flickers" }),
  S(38, "because a porch that's", "bi", "b_porchoct", { p: BI(`The same unheated porch in a mild October afternoon with a crate of potatoes by the wall, dry leaves on the boards, a thermometer reading mild, golden light, no people.`), anim: "a leaf skitters across the porch boards" }),
  S(38, "and that's a potato", "bi", "b_puddlepotato", { p: BI(`A frozen potato thawed into a gray puddle of mush on the floor of an unheated porch beside a crate, dark liquid spreading on the boards, bleak winter light.`), anim: "the dark liquid slowly spreads across the boards" }),
  S(38, "Use slatted crates", "bi", "b_slattedcrates", { p: BI(`Neatly stacked slatted wooden crates with air gaps between them, each crate holding a different kind of vegetable, sorted by kind, in a cool basement, one crate pulled forward at the front.`), anim: "light shifts slowly across the slatted crates" }),
  S(38, "and move the old stock", "bi", "b_oldfront", { p: BI(`An old hand sliding an older crate of potatoes forward to the front of a shelf and a newer crate behind it, a pencil date mark on a plain paper tag, sleeve only, no face.`), anim: "the hand slides the crate forward along the shelf" }),
  // ══ P39 EMPEZÁ POR UN ESTANTE ══
  S(39, "", "av", ""),
  S(39, "One bin of potatoes", "bi", "b_onebin", { p: BI(`One slatted bin of potatoes, one hanging mesh bag of onions, a round thermometer and a bucket of damp sand with carrots standing in it, all on and around a single plank shelf in a cool basement corner, nobody in frame.`), anim: "the light shifts gently across the shelf" }),
  S(39, "and a bucket of damp sand", "bi", "b_sandcarrots", { p: BI(`A galvanized bucket filled with damp sand with the green-topped orange carrots pushed upright into it side by side, a trowel beside the bucket, a plank floor, window light.`), anim: "a pinch of damp sand falls from a carrot" }),
  S(39, "Run it for a month", "bi", "b_monthlater", { p: BI(`A calendar-free close view of potatoes in a slatted crate in a cool corner, a pencil lying across the crate rim and a small notebook with blank pages open beside a thermometer on the wall, lantern light.`), anim: "the lantern light shifts across the crate" }),
  S(39, "and what you learn", "ole", "o_look", { p: OLEP(`He bends to look closely at a thermometer hanging on the log post above a crate of potatoes, a pencil behind his ear, one hand cupping his chin in a thoughtful squint.`) }),
  // ══ P40 TAREA ══
  S(40, "", "av", ""),
  S(40, "One put a thermometer", "c", "OlrHomework", { props: { at: { h1: "@One put a thermometer", h2: "@Two if apples", h3: "@Three go through" } } }),
  // ══ P41 CIERRE ══
  S(41, "", "av", ""),
  S(41, "Cold where it wanted", "c", "OlrRecap", { props: { at: { cold: "@Cold where it wanted", cool: "@cool where it wanted", dry: "@dry where it needed", eyes: "@and a cook with" } } }),
  S(41, "And if you want the pantry", "av", "", { ov: { c: "OleCTA", props: { compact: true, cover: "img/ole/portada.png", qr: "qr_ole_ollarder.png", text: "The cookbook's link is in the description" } } }),
  S(41, "Now tell me", "vl", "m9", { ov: { c: "OleAsk", props: { text: "What's the coldest place in your house?", sub: "and what's living in it right now? tell me in the comments" } } }),
];
