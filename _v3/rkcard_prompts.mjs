// _v3/rkcard_prompts.mjs — POOL del DIRECTOR de rkcard (la tarjeta plástica y el pestillo de resorte).
//
// VARA (brief §4): "fotograma accidental de un video común" — _v3/rkcard_vara.mjs (BASE + luz + look +
// cláusula AVOID). Probada con 4 imágenes (_v3/rkcard/vt_sheet.jpg) antes del lote.
// ⛔ ENCUADRE DEFENSIVO: Ray en SU casa, mostrando la pieza o el arreglo. Nunca la técnica de entrada,
//    nunca un intruso, nunca una tarjeta metida en una puerta.
// ⛔ Cerraduras mecánicamente correctas (comentario real: "all the photos of the locks are WRONG"):
//    se describe la pieza (pestillo con bisel + émbolo al lado, cerrojo de cara cuadrada, placa con
//    abertura rectangular y dos tornillos) en vez de nombrarla suelta.
// ⛔ Planos SIN presentador: "nobody else in the frame" (vt3 trajo el brazo de un desconocido).
// campos: id · sec · lugar · c (1 = Ray, va con ref de cara) · enc (wide|medium|close) · mo (voz de
//         OBJETO para agnes) · prompt
import { P, RAY, PUERTA } from './rkcard_vara.mjs';

const NADIE = ' Nobody else is in the frame.';
const KR = ', a brass keyring with a dozen worn keys clipped to his belt loop';
const R = (s, env, fuera = false) => P(`${RAY}, ${s} Around him: ${env}.`, fuera);
const O = (s, env, fuera = false) => P(`${s}${NADIE} Around it: ${env}.`, fuera);

export const ITEMS = [
  // ── S1 · HOOK: la tarjeta, quién es Ray, el loop ─────────────────────────────────────────
  { id: 's1_01', sec: 'S1', lugar: 'kitchen', c: 1, enc: 'medium', mo: 'the card tilts a little in his fingers',
    prompt: R('standing at his own kitchen counter holding up a plain blank white plastic card between thumb and two fingers of his right hand toward the person filming, his left hand resting on the edge of an open kitchen drawer, one eyebrow raised, mouth closed in a flat, unimpressed line.', 'an open drawer full of loose gift cards, rubber bands and takeaway menus, a toaster with crumbs around it, a fruit bowl with two bananas, a dish rack with a few plates, a window over the sink') },
  { id: 's1_02', sec: 'S1', lugar: 'kitchen', c: 0, enc: 'medium', mo: 'the cards shift slightly as the drawer settles',
    prompt: O('seen from a step back, looking down into an open kitchen junk drawer: six or seven plain plastic cards with no printing lying at different angles among rubber bands, a roll of tape, two dead batteries, a pencil stub, a book of matches and a bent paper clip, the drawer runner and the pale wood of the drawer bottom visible', 'the edge of the laminate counter, a coffee maker cut off by the frame, a tea towel hanging from the oven handle, a crumb-covered cutting board, a phone charger cable') },
  { id: 's1_03', sec: 'S1', lugar: 'hall', c: 1, enc: 'wide', mo: 'he taps the edge of the door lightly with the card',
    prompt: R(`seen from across the room with his whole body and most of the room in view, standing just inside his own front door, the door open toward the hallway, holding a blank white plastic card flat against his chest with his right hand and resting his left hand on the edge of the door, looking at the person filming with a calm, serious expression and his jaw set${KR}. The door is ${PUERTA}.`, 'a coat rack with two jackets, a pair of boots on a rubber mat, a small table with a bowl of keys and unopened mail, a light switch, a framed photo slightly crooked on the wall') },
  { id: 's1_04', sec: 'S1', lugar: 'hall', c: 1, enc: 'medium', mo: 'he turns his head from the door to the camera',
    prompt: R(`half turned toward his own open front door with his reading glasses pulled down onto his nose, pointing with one finger at the brass latch plate on the edge of the door while he looks at the camera with his eyebrows up and his mouth open mid-word. The door is ${PUERTA}.`, 'a staircase with a worn carpet runner, a radiator with a scarf over it, a small rug slightly rucked up, a shoe rack with three pairs of shoes, a dim ceiling light') },
  { id: 's1_05', sec: 'S1', lugar: 'porch', c: 0, enc: 'wide', mo: 'the leaves on the porch drift a little in the breeze',
    prompt: O('a plain suburban American front door seen from the front walk in the afternoon, a white six-panel door with a round brass knob and no deadbolt above it, a faded doormat, a porch light, two potted plants, a folded newspaper on the step, the house siding a little weathered', 'a porch rail with peeling paint, a mailbox on the wall, dry leaves on the steps, a garden hose coiled by the steps, a car parked in the driveway at the edge of the frame', true) },
  { id: 's1_06', sec: 'S1', lugar: 'hall', c: 0, enc: 'close', mo: 'the light on the brass plate shifts slightly',
    prompt: O(`a close view of the edge of ${PUERTA}, the door standing half open, the brass latch plate with two slotted screws, the paint around the plate chipped where the door has been rubbing for years, fingerprints on the knob`, 'the white wooden door frame with a strike plate, a light switch, the hallway carpet worn by the door swing, the corner of a coat on a hook, a baseboard with a line of dust') },
  { id: 's1_07', sec: 'S1', lugar: 'workshop', c: 1, enc: 'medium', mo: 'he sets the card down on the bench',
    prompt: R('sitting on a stool at a cluttered workbench in his own garage, a blank white plastic card in one hand and an old brass door latch taken out of a door in the other, looking from one to the other with his brow furrowed and his mouth slightly pursed.', 'a pegboard with hand tools, a coffee can full of screws, a vise bolted to the bench, a shop light hanging on a chain, a roll of blue masking tape, a radio with a bent antenna') },

  // ── S2 · el pestillo de resorte ──────────────────────────────────────────────────────────
  { id: 's2_01', sec: 'S2', lugar: 'hall', c: 1, enc: 'medium', mo: 'the door swings a few centimetres',
    prompt: R(`bending slightly at his own front door with the door open, looking closely at its edge with his reading glasses on, lips pressed together in concentration, one hand holding the door steady by the knob. The door is ${PUERTA}.`, 'a coat rack, a pair of muddy boots on a mat, an umbrella stand, a small table with a lamp and a bowl of keys, a family photo on the wall') },
  { id: 's2_02', sec: 'S2', lugar: 'hall', c: 0, enc: 'close', mo: 'a little dust drifts across the brass plate',
    prompt: O('a close side view of a brass spring latch bolt sticking out of the edge of an open white door, its slanted face clearly angled like a small ramp, right beside it a separate small flat deadlatch plunger, the brass latch plate held by two worn screws, paint drips along the door edge', 'the round brass knob just visible at the edge, the painted door surface with fingerprints, the hallway wall behind out of the way, a baseboard, a scrap of carpet') },
  { id: 's2_03', sec: 'S2', lugar: 'hall', c: 1, enc: 'wide', mo: 'the door drifts closed a little further',
    prompt: R(`seen from across the room with his whole body and most of the room in view, pulling his own front door shut behind him from inside by the knob with one hand, mid-motion, his body turned away, glancing back at the door with a small knowing look. The door is ${PUERTA}.`, 'a hallway runner rug, a coat rack with a flat cap on a hook, a small mirror, a basket of shoes, a light switch with a smudge around it') },
  { id: 's2_04', sec: 'S2', lugar: 'porch', c: 0, enc: 'medium', mo: 'the door settles against its frame',
    prompt: O('a white front door just pulled shut, seen from the side at knob height outside, the round brass knob, the thin line of the gap between door and frame, the door stop molding on the frame, a faded doormat below', 'porch boards with scuffs, a potted geranium, a porch light, a pair of garden gloves on the rail, a doorbell button', true) },
  { id: 's2_05', sec: 'S2', lugar: 'hall', c: 0, enc: 'close', mo: 'the light across the strike plate shifts a little',
    prompt: O('a close view of the brass strike plate screwed into a painted white door frame, the rectangular opening where the latch goes, a small curved lip on the plate, two slotted screws with paint in the slots, rub marks on the paint around the opening', 'the edge of the open door with its knob, a light switch, a crack in the paint at the corner of the frame, a bit of hallway wallpaper, a baseboard') },
  { id: 's2_06', sec: 'S2', lugar: 'workshop', c: 1, enc: 'medium', mo: 'the latch bolt springs back out in his hand',
    prompt: R('at his garage workbench pressing the slanted face of a loose brass door latch with his thumb so the bolt slides into its case, the other hand holding the latch body, looking down at it with mild interest and his mouth slightly open.', 'a pegboard of tools, a coffee can of screws, a magnifying lamp, a pencil behind a jar, a vise, sawdust on the bench') },

  // ── S3 · por qué cede ────────────────────────────────────────────────────────────────────
  { id: 's3_01', sec: 'S3', lugar: 'workshop', c: 1, enc: 'medium', mo: 'the card bends slightly in his fingers',
    prompt: R('at his workbench holding a blank white plastic card up to the light and flexing it slightly between his fingers, his eyes on the card, eyebrows pulled together in a skeptical look.', 'an old toolbox with its lid open, loose keys on a ring, a spool of wire, a coffee mug with a chipped rim, a pegboard with pliers and screwdrivers') },
  { id: 's3_02', sec: 'S3', lugar: 'workshop', c: 0, enc: 'medium', mo: 'the objects on the bench stay still while the light flickers slightly',
    prompt: O('seen from a step back, a scatter of thin stiff plastic things on a scarred wooden workbench: two blank plastic cards, a cut strip of clear plastic, a plastic ruler, an old laminated luggage tag with nothing written on it, lying at different angles', 'a coffee can of screws, a pencil, a tape measure, a small pile of sawdust, a worn leather glove') },
  { id: 's3_03', sec: 'S3', lugar: 'workshop', c: 1, enc: 'medium', mo: 'he closes the lid of the old toolbox slowly',
    prompt: R(`sitting on a stool beside an old wooden locksmith toolbox with brass corners, lifting out a faded canvas roll of tools, a wry half smile at the corner of his mouth${KR}.`, 'a key cutting machine on the bench, a board of blank keys, a radio, a stack of old trade catalogues, a dusty shop window') },
  { id: 's3_04', sec: 'S3', lugar: 'hall', c: 1, enc: 'wide', mo: 'the knob button clicks and the door stays still',
    prompt: R(`seen from across the room with his whole body and most of the room in view, standing inside his own front door pushing the small lock button on the inside of the round brass knob with his thumb, looking at the person filming with a flat, unconvinced expression and one eyebrow up. The door is ${PUERTA}.`, 'a coat rack, a boot tray, a hall table with a dish of coins, a thermostat on the wall, a small framed print') },
  { id: 's3_05', sec: 'S3', lugar: 'porch', c: 0, enc: 'close', mo: 'the knob catches a little more light',
    prompt: O('a close view of a round brass exterior doorknob with a keyhole in its center on a white front door, the brass worn to a duller color where hands grip it, a thin scratch around the keyhole', 'the edge of the door frame, the painted door panel, the corner of a doormat, a porch board, the shadow of a porch rail', true) },
  { id: 's3_06', sec: 'S3', lugar: 'street', c: 0, enc: 'wide', mo: 'a car passes far down the street and the trees sway',
    prompt: O('an ordinary American suburban street on a grey afternoon, a row of houses with different front doors: one painted red, one white with a storm door, one brown with side windows, porches and small lawns, a parked pickup truck', 'wheelie bins at the curb, a maple tree losing its leaves, a basketball hoop over a garage, telephone wires, a sidewalk with cracks', true) },
  { id: 's3_07', sec: 'S3', lugar: 'backyard', c: 0, enc: 'medium', mo: 'the screen door moves slightly in the wind',
    prompt: O('the back door of an ordinary house seen from the yard: a white door that swings outward with its hinges visible on the outside, a small window in it, a worn concrete step, a boot scraper', 'a garden hose, a plastic chair, a bag of potting soil, a rake leaning on the wall, a trash can with a lid', true) },
  { id: 's3_08', sec: 'S3', lugar: 'kitchen', c: 1, enc: 'wide', mo: 'he spreads his hands slightly on the table',
    prompt: R('seen from across the room with his whole body and most of the room in view, sitting at his kitchen table and explaining something to the person filming, both hands open over the table as if weighing two things, head tilted, an earnest, patient look.', 'a mug of coffee, a newspaper folded in half, a salt shaker, a bowl of oranges, a wall calendar, a fridge covered in magnets behind him') },

  // ── S4 · la botella · sin marcas · latched ≠ locked ─────────────────────────────────────
  { id: 's4_01', sec: 'S4', lugar: 'kitchen', c: 1, enc: 'wide', mo: 'the plastic bottle crackles slightly in his hand',
    prompt: R('seen from across the room with his whole body and most of the room in view, standing in his kitchen holding an empty clear plastic water bottle in one hand and a blank plastic card in the other, looking at the person filming with a dry, knowing smile.', 'a recycling bin with a few bottles, a sink with a dripping tap, a dish towel on the counter, a spice rack, a kitchen window with the blind half down') },
  { id: 's4_02', sec: 'S4', lugar: 'porch', c: 0, enc: 'medium', mo: 'the door stands still and the light on the porch shifts',
    prompt: O('an empty porch, no people anywhere, a close front view of an intact white front door with its brass knob, perfectly undamaged, no scratches, no splinters, the frame straight and clean, seen from the porch in flat morning light', 'a doormat, a pair of shoes by the door, a potted plant, a porch light, a folded umbrella leaning on the wall', true) },
  { id: 's4_03', sec: 'S4', lugar: 'hall', c: 0, enc: 'medium', mo: 'the light on the frame changes slightly',
    prompt: O('seen from a step back, a close view of a painted door frame and the edge of a closed white door next to its knob, the paint perfectly intact, no dents, no pry marks, no broken wood, only ordinary scuffs from years of use', 'a strip of weatherstripping, a light switch, the hallway wallpaper, a coat hook, a baseboard') },
  { id: 's4_04', sec: 'S4', lugar: 'livingroom', c: 0, enc: 'wide', mo: 'the curtain sways a little by the window',
    prompt: O('an ordinary living room in the morning, everything calm and in place: a sofa with a knitted blanket, a coffee table with a remote and a mug, a television on a stand, a bookshelf, the front door visible at the far end of the room closed', 'a floor lamp, a rug with one corner turned up, a houseplant, a basket of magazines, a window with net curtains') },
  { id: 's4_05', sec: 'S4', lugar: 'hall', c: 1, enc: 'medium', mo: 'he taps the knob twice with a finger',
    prompt: R(`standing at his own closed front door from the inside and tapping the round brass knob with one finger, turning to the person filming with his eyebrows raised and his mouth pulled to one side. The door is ${PUERTA}.`, 'a coat rack, a small hall table with keys and a flashlight, a boot tray, a wall clock, a light switch') },
  { id: 's4_06', sec: 'S4', lugar: 'kitchen', c: 1, enc: 'medium', mo: 'he lowers the card onto the table',
    prompt: R(`sitting at his kitchen table with a blank plastic card flat under his fingertips, leaning forward on his elbows and looking at the person filming with a steady, serious look${KR}.`, 'a mug of tea, a pair of reading glasses cases, a newspaper, a pepper grinder, a window with morning light, a fridge with magnets') },

  // ── S5 · el test: contar metales · el émbolo ────────────────────────────────────────────
  { id: 's5_01', sec: 'S5', lugar: 'hall', c: 1, enc: 'medium', mo: 'the hallway light flickers a little',
    prompt: R(`standing inside his house in front of his own closed front door, bending toward the edge of the door next to the knob and peering at the thin gap between door and frame, his mouth slightly open in concentration. The door is ${PUERTA}.`, 'a coat rack, a small rug, a bench with a pair of boots under it, a lamp on a hall table, a stair banister') },
  { id: 's5_02', sec: 'S5', lugar: 'hall', c: 0, enc: 'close', mo: 'the light along the edge of the door shifts slightly',
    prompt: O('a close view looking at the edge of a closed white front door from inside where it meets the painted frame beside the round brass knob, the thin dark gap between door and frame, the edge of the brass latch plate just visible in the gap', 'the painted door panel, the door frame molding, a light switch, the corner of a hallway runner, a coat on a hook') },
  { id: 's5_03', sec: 'S5', lugar: 'hall', c: 1, enc: 'medium', mo: 'he holds up one finger and it barely moves',
    prompt: R(`beside his own open front door holding up one finger to the person filming while his other hand rests on the brass latch plate on the edge of the door, an eyebrow up, lips pressed together. The door is ${PUERTA}.`, 'a hall mirror, a coat rack, an umbrella stand, a wall clock, a rug with fringes') },
  { id: 's5_04', sec: 'S5', lugar: 'hall', c: 0, enc: 'close', mo: 'a little dust drifts across the latch',
    prompt: O('an extreme but ordinary close view of the edge of an open door: a brass latch plate with one angled spring latch bolt and, right beside it in the thickness of the door, a small separate half-round deadlatch plunger slightly shorter than the latch, two slotted screws above and below', 'the painted door edge with chips, the brass knob rose at the edge of the frame, a strip of the hallway floor, a baseboard, a scuff mark') },
  { id: 's5_05', sec: 'S5', lugar: 'hall', c: 1, enc: 'medium', mo: 'he presses the small plunger and lets it go',
    prompt: R(`crouching at the edge of his own open front door with his reading glasses on, pressing the small deadlatch plunger next to the latch with the tip of his index finger, looking at it closely with a satisfied, slight nod. The door is ${PUERTA}.`, 'a pair of boots on a tray, a coat rack, a dog leash on a hook, a small table with a bowl of keys, a stair banister') },
  { id: 's5_06', sec: 'S5', lugar: 'workshop', c: 0, enc: 'medium', mo: 'the loose latches rock slightly on the bench',
    prompt: O('three loose door latch assemblies laid out on a scarred workbench, each with a brass faceplate, an angled spring latch bolt and a small deadlatch plunger beside it, one older latch without any plunger, lying at different angles', 'a coffee can of screws, a screwdriver with a worn handle, a small parts tray, a pencil, a shop rag') },
  { id: 's5_07', sec: 'S5', lugar: 'hall', c: 1, enc: 'wide', mo: 'the door closes the last few centimetres',
    prompt: R(`seen from across the room with his whole body and most of the room in view, closing his own front door slowly from the inside with one hand on the knob and his head tilted to watch the edge of the door as it meets the frame, a focused, curious look. The door is ${PUERTA}.`, 'a coat rack, a hall table with mail, a boot tray, a light switch, a small rug') },

  // ── S6 · la holgura ─────────────────────────────────────────────────────────────────────
  { id: 's6_01', sec: 'S6', lugar: 'hall', c: 0, enc: 'close', mo: 'the light on the strike plate shifts slightly',
    prompt: O('a close view of a brass strike plate on a white door frame with shiny rub marks on the paint beside it, showing that the latch has been hitting a little low for years, one screw slightly loose and sticking out', 'the door edge with its brass latch plate, a crack in the frame paint, a light switch, a baseboard, a scrap of hallway carpet') },
  { id: 's6_02', sec: 'S6', lugar: 'exterior', c: 0, enc: 'wide', mo: 'the clouds move slowly above the house',
    prompt: O('an older two-storey wooden house seen from the sidewalk, its porch sagging a little, a front door slightly out of square in its frame, repainted trim, a gutter with a dent', 'a mailbox on a post, an overgrown hedge, a cracked front walk, a car in the driveway, a maple tree', true) },
  { id: 's6_03', sec: 'S6', lugar: 'hall', c: 1, enc: 'wide', mo: 'he wiggles the top hinge screw with his fingertip',
    prompt: R(`seen from across the room with his whole body and most of the room in view, standing on the first step of a small ladder at his own front door, reaching up to the top hinge on the frame side and touching one screw with his fingertip, looking at it with a frown.`, 'a coat rack, a small toolbox open on the floor, a screwdriver in his back pocket, a hall table with a lamp, a stair banister') },
  { id: 's6_04', sec: 'S6', lugar: 'hall', c: 0, enc: 'close', mo: 'a little flake of paint falls from the hinge',
    prompt: O('a close view of the top hinge of an old front door, the hinge leaves painted over several times, one screw backed out a few millimetres, a thin crack in the paint where the leaf meets the frame', 'the door edge, the white frame molding, a cobweb in the corner, the top of the door, the ceiling line') },
  { id: 's6_05', sec: 'S6', lugar: 'porch', c: 0, enc: 'close', mo: 'the weatherstrip flutters slightly in the draft',
    prompt: O('a close view of new foam weatherstripping stapled along a painted door frame next to the brass strike plate, a little proud of the frame, the edge of a closed white door not quite pressing against it', 'layers of old paint on the frame, a door stop molding, a doormat edge, a porch board, a chipped paint corner', true) },
  { id: 's6_06', sec: 'S6', lugar: 'hall', c: 1, enc: 'medium', mo: 'he runs his thumb along the edge of the door',
    prompt: R(`running his thumb along the painted edge of his own front door where the paint has built up in thick layers, lips pursed, a mildly annoyed, knowing look.`, 'a can of paint with dried drips on a newspaper on the floor, a paint scraper, a coat rack, a hall table, a light switch') },

  // ── S7 · los 10 segundos · la guía ──────────────────────────────────────────────────────
  { id: 's7_01', sec: 'S7', lugar: 'hall', c: 0, enc: 'close', mo: 'the thin line of daylight flickers slightly',
    prompt: O('a close view from inside a dim hallway of the gap between a closed white front door and its frame near the brass knob, a thin bright line of outside daylight showing through the gap beside the latch', 'the painted door panel, the frame molding, a light switch, a coat on a hook, the corner of a runner rug') },
  { id: 's7_02', sec: 'S7', lugar: 'hall', c: 1, enc: 'medium', mo: 'the sheet of paper slides up and down in the gap',
    prompt: R(`standing at his closed front door from the inside, sliding the edge of an ordinary sheet of white printer paper into the gap beside the knob and moving it up and down, watching the paper with narrowed eyes.`, 'a coat rack, a hall table with a bowl of keys, a boot tray, a thermostat, a framed print') },
  { id: 's7_03', sec: 'S7', lugar: 'hall', c: 1, enc: 'medium', mo: 'the door swings in slowly toward the frame',
    prompt: R(`crouching beside his own front door and closing it very slowly with one hand while his face is close to the edge, watching the small plunger meet the strike plate, eyebrows raised in concentration. The door is ${PUERTA}.`, 'a hallway runner, a coat rack, a pair of slippers, a light switch, a small hall table') },
  { id: 's7_04', sec: 'S7', lugar: 'kitchen', c: 1, enc: 'medium', mo: 'the pages of the booklet lift slightly',
    prompt: R(`sitting at his kitchen table with a thin printed booklet open in front of him and a pencil in his hand, making a small tick on the page, glancing up at the person filming with a quiet, warm look${KR}.`, 'a mug of coffee, a tape measure, a small box of screws, a notepad, a window with daylight, a fridge with magnets') },
  { id: 's7_05', sec: 'S7', lugar: 'kitchen', c: 0, enc: 'medium', mo: 'the pencil rolls slightly on the table',
    prompt: O('seen from a step back, a thin printed guide booklet lying open on a wooden kitchen table with blank lined pages and simple sketches of a door edge, a pencil, a tape measure and a handful of long wood screws next to it, a coffee ring on the table', 'a mug, a pair of reading glasses, a salt shaker, the corner of a newspaper, a phone face down') },
  { id: 's7_06', sec: 'S7', lugar: 'store', c: 1, enc: 'wide', mo: 'the aisle lights flicker slightly',
    prompt: R('seen from across the room with his whole body and most of the room in view, standing in a hardware store aisle in front of a wall of door hardware in blister packs, looking at a short handwritten list on a scrap of paper in his hand, lips moving slightly as he reads.', 'rows of hanging packages of hinges and screws, a shopping basket on his arm, a price rail, bright fluorescent tubes overhead, a floor with scuffs') },

  // ── S8 · arreglo 1: el cerrojo que ya tenés ─────────────────────────────────────────────
  { id: 's8_01', sec: 'S8', lugar: 'hall', c: 1, enc: 'medium', mo: 'the thumb turn rotates under his fingers',
    prompt: R('standing at his own front door from the inside and turning the thumb turn of the deadbolt above the doorknob with his fingers, looking at the person filming with a small, satisfied nod.', 'a coat rack, a hall table with a lamp, a bowl of keys, a boot tray, a family photo') },
  { id: 's8_02', sec: 'S8', lugar: 'hall', c: 0, enc: 'close', mo: 'the thumb turn catches the light',
    prompt: O('a close view of the inside of a front door showing a brass deadbolt thumb turn mounted above a round brass doorknob, the thumb turn in the vertical unlocked position, fingerprints on the brass, the painted door panel around it', 'the door frame edge, a light switch, a coat hook, the top of a hall table, a wall with a small crack') },
  { id: 's8_03', sec: 'S8', lugar: 'porch', c: 0, enc: 'close', mo: 'the key ring swings slightly',
    prompt: O('a close view of a key sitting in the keyed cylinder of a brass deadbolt above a round brass knob on a white front door seen from outside, a small ring of three keys hanging from it', 'the painted door panel, the edge of the frame, a doorbell button, a house number plate without numbers, a porch light', true) },
  { id: 's8_04', sec: 'S8', lugar: 'porch', c: 1, enc: 'wide', mo: 'he pulls the key out of the lock',
    prompt: R('seen from across the room with his whole body and most of the room in view, on his own front porch pulling his key out of the deadbolt after locking it, his body half turned toward the steps, glancing back at the door with a calm, habitual look, a canvas shopping bag over his other arm.', 'a doormat, a potted plant, a porch light, a mailbox on the wall, a car parked in the driveway', true) },
  { id: 's8_05', sec: 'S8', lugar: 'kitchen', c: 1, enc: 'wide', mo: 'the kitchen light dims slightly',
    prompt: R('seen from across the room with his whole body and most of the room in view, in his kitchen at night checking that the stove knobs are all off with one hand, a small warm light over the stove, his face relaxed and tired, glancing toward the hallway.', 'a kettle, a clean frying pan on the stove, a dish rack, a wall clock reading late evening, a window with the blind down') },
  { id: 's8_06', sec: 'S8', lugar: 'hall', c: 0, enc: 'medium', mo: 'the hall light glows steadily',
    prompt: O('a front hallway at night lit by a single warm ceiling light, the front door closed with its brass deadbolt thumb turn in the horizontal locked position above the knob, a coat rack and a pair of shoes', 'a hall table with a bowl of keys, a small rug, a light switch, a staircase in the shadows, a framed picture') },
  { id: 's8_07', sec: 'S8', lugar: 'workshop', c: 0, enc: 'medium', mo: 'the deadbolt rocks slightly on the bench',
    prompt: O('seen from a step back, a loose residential deadbolt lying on a workbench next to a loose spring latch for comparison: the deadbolt with a square-ended solid bolt extended, the spring latch with its angled face, both brass, with their faceplates and screws', 'a screwdriver, a coffee can of screws, a pencil, a shop rag, a bit of sawdust') },

  // ── S9 · arreglo 2: tornillo de 3" ──────────────────────────────────────────────────────
  { id: 's9_01', sec: 'S9', lugar: 'hall', c: 1, enc: 'medium', mo: 'he turns the screwdriver a quarter turn',
    prompt: R(`standing on a small step stool at his front door with the door open, unscrewing one short screw from the top hinge on the frame side with a hand screwdriver, lips pressed together in effort.`, 'an open toolbox on the floor, a box of long screws on the stool, a coat rack, a hall table, a light switch') },
  { id: 's9_02', sec: 'S9', lugar: 'workshop', c: 0, enc: 'medium', mo: 'the screws roll slightly on the bench',
    prompt: O('seen from a step back, two wood screws lying side by side on a workbench for comparison: a short three-quarter-inch hinge screw and a long three-inch wood screw, both with Phillips heads, next to a steel tape measure opened to three inches', 'a small paper bag from a hardware store, a pencil, a coffee can, a bit of sawdust, a worn glove') },
  { id: 's9_03', sec: 'S9', lugar: 'hall', c: 1, enc: 'medium', mo: 'the drill spins and the screw sinks in',
    prompt: R('on a step stool at his own front door driving a long screw into the frame side of the top hinge with a cordless drill held level, his other hand steadying the door, his eyes on the screw, mouth set in a firm line.', 'an open toolbox on the floor, a small box of screws, a coat rack, a light switch, the top of the door frame') },
  { id: 's9_04', sec: 'S9', lugar: 'hall', c: 0, enc: 'close', mo: 'a curl of paint drops from the hinge',
    prompt: O('a close view of the frame side of the top hinge of an open front door, one new long screw fully seated in the middle hole next to two old painted-over short screws, the hinge knuckle visible in the gap between door edge and frame, a few flakes of paint on the floor', 'the painted frame, the top edge of the door, a cobweb, the ceiling line, a light fixture edge') },
  { id: 's9_05', sec: 'S9', lugar: 'hall', c: 1, enc: 'wide', mo: 'the door swings shut easily',
    prompt: R(`seen from across the room with his whole body and most of the room in view, closing his own front door with a light push after the fix and listening, his head tilted, a pleased half smile. The door is ${PUERTA}.`, 'a drill resting on the hall table, a small box of screws, a coat rack, a rug, a light switch') },
  { id: 's9_06', sec: 'S9', lugar: 'store', c: 0, enc: 'medium', mo: 'the hanging packages sway a little',
    prompt: O('a hardware store bin shelf full of loose long wood screws in small cardboard trays and a rack of small plastic bags of screws, a hand-written price tag clipped to the shelf edge without legible writing', 'a paper bag dispenser, a shopping basket on the floor, fluorescent tubes, a price rail, a scuffed floor') },

  // ── S10 · arreglo 3: el cerradero ───────────────────────────────────────────────────────
  { id: 's10_01', sec: 'S10', lugar: 'hall', c: 1, enc: 'medium', mo: 'he holds the strike plate against the frame',
    prompt: R('kneeling at the latch side of his open front door holding a brass strike plate against the frame in a slightly different spot and marking it with a carpenter pencil, one eye narrowed, lips pursed.', 'an open toolbox, a small file, a tube of wood glue, a few wooden golf tees, a hallway runner rug') },
  { id: 's10_02', sec: 'S10', lugar: 'hall', c: 0, enc: 'close', mo: 'fine metal dust drifts from the file',
    prompt: O('a close view of a metal file resting in the rectangular opening of a brass strike plate on a painted door frame, fresh bright metal where the edge of the opening was filed, a little metal dust on the frame', 'a pencil mark on the paint, a screwdriver, the edge of the door, a light switch, a baseboard') },
  { id: 's10_03', sec: 'S10', lugar: 'hall', c: 0, enc: 'close', mo: 'a drop of glue slides down the golf tee',
    prompt: O('a close view of two old screw holes in a painted door frame plugged with wooden golf tees dipped in glue and snapped off flush, next to a removed brass strike plate lying on the floor', 'a tube of wood glue, a small hammer, a utility knife, a pencil, flakes of paint') },
  { id: 's10_04', sec: 'S10', lugar: 'hall', c: 1, enc: 'medium', mo: 'he tightens the last screw of the strike',
    prompt: R('driving a long screw into a brass strike plate on his own door frame with a hand screwdriver, his wrist turning, the door open beside him, a focused, contented look.', 'a toolbox, a box of long screws, a small file, a coat rack, a light switch') },
  { id: 's10_05', sec: 'S10', lugar: 'hall', c: 0, enc: 'close', mo: 'the door edge meets the frame',
    prompt: O('a close view of the edge of a closing white door meeting a brass strike plate: the angled latch bolt entering the rectangular opening and the small deadlatch plunger pressed flat against the face of the plate beside the opening', 'the painted frame, a door stop molding, two long screws in the plate, a light switch, a strip of hallway floor') },

  // ── S11 · arreglo 4: pomo con deadlatch ─────────────────────────────────────────────────
  // s11_01 (Ray leyendo una caja en la ferretería) rechazado 2 veces por safety de gpt-image: fuera del pool
  { id: 's11_02', sec: 'S11', lugar: 'store', c: 0, enc: 'medium', mo: 'the packages on the hooks sway slightly',
    prompt: O('a hardware store wall of boxed and blister-packed doorknob sets and deadbolts in brass, nickel and black finishes, hanging on metal hooks in uneven rows, some hooks empty, a few boxes crooked', 'a price rail, a floor sign base, fluorescent tubes, a shopping cart, a scuffed concrete floor') },
  { id: 's11_03', sec: 'S11', lugar: 'store', c: 0, enc: 'close', mo: 'the plastic of the package reflects the light',
    prompt: O('a close view of a doorknob set in a clear plastic blister package held on a store hook, the latch visible through the plastic with its angled bolt and a small deadlatch plunger beside it', 'the neighbouring packages, the metal hook, a price rail, a store shelf edge, fluorescent reflection') },
  { id: 's11_04', sec: 'S11', lugar: 'hall', c: 1, enc: 'medium', mo: 'the new knob turns and clicks',
    prompt: R(`kneeling at his own front door fitting a new round brass knob into the existing holes with a screwdriver, the old knob lying on a folded towel on the floor, a calm, practical look.`, 'an open toolbox, the empty cardboard box of the new knob, the old latch on the towel, a coat rack, a hallway rug') },
  { id: 's11_05', sec: 'S11', lugar: 'workshop', c: 0, enc: 'medium', mo: 'the two knobs rock slightly on the bench',
    prompt: O('seen from a step back, an old tarnished brass doorknob set next to a new one on a workbench, the old latch with only an angled bolt and no plunger, the new latch with an angled bolt and a small deadlatch plunger beside it', 'a screwdriver, a paper receipt without legible print, a coffee can of screws, a pencil, a shop rag') },
  { id: 's11_06', sec: 'S11', lugar: 'store', c: 1, enc: 'medium', mo: 'he puts the box back on the hook',
    prompt: R('in a hardware store aisle hanging a doorknob box back on its hook with a slight shake of his head, lips pressed together, choosing another one with his other hand.', 'rows of boxed door hardware, a shopping basket on his arm, a price rail, fluorescent tubes, a floor with scuffs') },

  // ── S12 · arreglo 5: latch guard ────────────────────────────────────────────────────────
  { id: 's12_01', sec: 'S12', lugar: 'backyard', c: 1, enc: 'medium', mo: 'he taps the steel plate with a knuckle',
    prompt: R('standing outside the side door of his own house, a door that swings outward with its hinges outside, holding a flat steel latch guard plate against the door edge beside the knob to check the fit, one eye closed, lips pursed.', 'a tape measure clipped to his pocket, a drill on a plastic crate, a garden hose, a trash can, a rake leaning on the wall', true) },
  { id: 's12_02', sec: 'S12', lugar: 'backyard', c: 0, enc: 'close', mo: 'the light on the steel plate shifts slightly',
    prompt: O('a close view of a steel latch guard plate installed on the outside of an outward-swinging side door beside a round brass knob, covering the gap between door and frame at the latch, with round-headed carriage bolts, slightly scratched', 'the painted door, the frame, a doorbell, a porch light, a strip of siding', true) },
  { id: 's12_03', sec: 'S12', lugar: 'garage', c: 0, enc: 'medium', mo: 'the garage light hums and flickers slightly',
    prompt: O('the side door of an ordinary garage seen from outside, a plain metal door with a round knob, the frame a little dented, a small window beside it, a gravel path', 'a wheelbarrow, a stack of firewood, a garden hose reel, a trash can, a bicycle leaning on the wall', true) },
  { id: 's12_04', sec: 'S12', lugar: 'backyard', c: 1, enc: 'wide', mo: 'the tape measure blade retracts',
    prompt: R('seen from across the room with his whole body and most of the room in view, measuring the width of the trim beside the knob on his own side door with a tape measure, head tilted, a skeptical, careful look.', 'a small notepad on the step, a pencil behind his ear, a drill on a crate, a doormat, a potted plant', true) },
  { id: 's12_05', sec: 'S12', lugar: 'kitchen', c: 1, enc: 'medium', mo: 'the phone screen lights up in his hand',
    prompt: R('sitting at his kitchen table holding a phone to his ear, a latch guard in its package on the table in front of him, one hand spread on the table, a patient, polite expression as if asking permission.', 'a mug, a notepad, a pen, a rental agreement stack of papers without legible text, a window with daylight') },

  // ── S13 · arreglo 6: cerrojo de 1" · tornillos largos · barra genérica ──────────────────
  { id: 's13_01', sec: 'S13', lugar: 'hall', c: 1, enc: 'medium', mo: 'the drill spins slowly',
    prompt: R('kneeling at the edge of his own open front door holding a drill with a hole saw attached to a paper template taped on the door above the knob, a serious, careful look.', 'an open deadbolt box, a hole saw kit case, a chisel, a pencil, a folded drop cloth on the floor') },
  { id: 's13_02', sec: 'S13', lugar: 'hall', c: 0, enc: 'close', mo: 'the deadbolt bolt slides out slowly',
    prompt: O('a close view of the edge of an open white door with a newly installed brass deadbolt above the knob latch, the square-ended bolt extended a full inch out of its faceplate, the latch below it with its angled bolt', 'the painted door edge, fresh wood dust, a pencil line, a chisel lying on the floor, the frame at the edge of the frame') },
  { id: 's13_03', sec: 'S13', lugar: 'hall', c: 1, enc: 'medium', mo: 'he turns the key and nods slightly',
    prompt: R('at his own front door from the inside turning the thumb turn of a newly installed brass deadbolt, looking at the person filming with a quiet, satisfied look and a slight nod.', 'an empty deadbolt box on the hall table, a drill, a coat rack, a boot tray, a light switch') },
  { id: 's13_04', sec: 'S13', lugar: 'workshop', c: 0, enc: 'medium', mo: 'the tape measure blade wobbles slightly',
    prompt: O('seen from a step back, a residential brass deadbolt lying on a workbench with its square bolt extended, a steel tape measure laid against the bolt showing about one inch, the heavy strike plate and four long screws beside it', 'an open box, a pencil, a coffee can of screws, a shop rag, a small square') },
  { id: 's13_05', sec: 'S13', lugar: 'hall', c: 1, enc: 'medium', mo: 'the long screw sinks into the strike',
    prompt: R(`driving three-inch screws through a heavy deadbolt strike plate into his own door frame with a cordless drill, his shoulder close to the frame, jaw set, eyes narrowed.`, 'a box of long screws, an open toolbox, a coat rack, a hall table, a light switch') },
  { id: 's13_06', sec: 'S13', lugar: 'hall', c: 0, enc: 'medium', mo: 'the bar sits still against the knob',
    prompt: O('a plain adjustable steel door security bar wedged under the round knob of a closed front door from the inside, its rubber foot on the hallway floor, at night under a warm hall light', 'a rug, a coat rack, a pair of shoes, a small table with keys, a light switch') },
  { id: 's13_07', sec: 'S13', lugar: 'apartment', c: 1, enc: 'wide', mo: 'the bar clicks into place',
    prompt: R('seen from across the room with his whole body and most of the room in view, in a small rented apartment hallway adjusting a plain steel security bar under the knob of the apartment door, bending with one hand on his knee, a practical, unfussed look.', 'a coat hook, a shoe rack, a small mirror, a light switch, an umbrella') },
  { id: 's13_08', sec: 'S13', lugar: 'garage', c: 1, enc: 'medium', mo: 'the boxes shift slightly on the bench',
    prompt: R(`in his garage opening the cardboard box of a new deadbolt on his workbench, lifting out the bolt and turning it in his fingers, eyebrows raised in approval${KR}.`, 'a pegboard of tools, a hole saw kit case, a coffee can of screws, a shop light, a radio') },

  // ── S14 · el orden · sin búnker · las otras puertas ─────────────────────────────────────
  { id: 's14_01', sec: 'S14', lugar: 'kitchen', c: 1, enc: 'wide', mo: 'the pencil taps the paper',
    prompt: R('seen from across the room with his whole body and most of the room in view, at his kitchen table writing a short list on a notepad with a pencil, tapping the pencil on the paper as he thinks, lips moving slightly, a calm, organised look.', 'a mug of coffee, a tape measure, a small box of screws, a pair of reading glasses case, a fridge with magnets') },
  { id: 's14_02', sec: 'S14', lugar: 'garage', c: 0, enc: 'medium', mo: 'the garage light flickers slightly',
    prompt: O('the door from an attached garage into the house, seen from inside the garage: a plain white door with a cheap round knob and no deadbolt, two wooden steps up to it, a doormat', 'a chest freezer, shelves of paint cans, a recycling bin, a bicycle, a car bumper at the edge of the frame') },
  { id: 's14_03', sec: 'S14', lugar: 'garage', c: 1, enc: 'medium', mo: 'he taps the cheap knob with a finger',
    prompt: R('standing in his garage on the step in front of the door into the house, pointing at its cheap round knob with one finger and looking back at the person filming with a raised eyebrow.', 'a chest freezer, a shelf of paint cans, a bag of birdseed, a snow shovel, a car bumper') },
  { id: 's14_04', sec: 'S14', lugar: 'backyard', c: 0, enc: 'medium', mo: 'the screen door moves slightly in the breeze',
    prompt: O('the back door off a kitchen seen from the backyard: a white door with a cheap round knob and a torn screen door in front of it, a concrete step, a small window beside it', 'a grill with a cover, a garden chair, a potted herb, a garden hose, a trash can', true) },
  { id: 's14_05', sec: 'S14', lugar: 'hall', c: 1, enc: 'wide', mo: 'he closes the notepad',
    prompt: R('seen from across the room with his whole body and most of the room in view, walking through his own house with a small notepad and pencil, stopping at an interior doorway to look back toward the back door, a thoughtful, steady look.', 'a hallway with family photos, a light switch, a rug, a laundry basket, a window with daylight') },
  { id: 's14_06', sec: 'S14', lugar: 'livingroom', c: 1, enc: 'wide', mo: 'he spreads his hands slightly',
    prompt: R('seen from across the room with his whole body and most of the room in view, sitting in an armchair in his living room talking to the person filming with both hands open, a wry, amused look, shaking his head slightly.', 'a side table with a lamp and a mug, a bookshelf, a television on a stand, a window with net curtains, a rug') },
  { id: 's14_07', sec: 'S14', lugar: 'exterior', c: 0, enc: 'wide', mo: 'the leaves stir in the yard',
    prompt: O('an ordinary suburban house seen from the corner of the yard showing three doors: the front door on the porch, a side door by the driveway and the garage door, a late afternoon sky', 'a lawn with fallen leaves, a car in the driveway, a garden hose, a mailbox, a fence', true) },
  { id: 's14_08', sec: 'S14', lugar: 'garage', c: 1, enc: 'medium', mo: 'the note flutters on the door',
    prompt: R(`in his garage sticking a small blank yellow note on the door into the house, pressing it flat with his thumb, a quiet, determined look${KR}.`, 'a chest freezer, a shelf of paint cans, a pegboard, a snow shovel, a bicycle') },

  // ── S15 · vuelta al principio · CTA ─────────────────────────────────────────────────────
  { id: 's15_01', sec: 'S15', lugar: 'kitchen', c: 1, enc: 'medium', mo: 'the drawer slides shut',
    prompt: R('dropping a blank plastic card back into his open kitchen junk drawer and pushing the drawer shut with his hip, glancing at the person filming with a small smile.', 'a toaster, a fruit bowl, a dish rack, a kitchen window, a roll of paper towels') },
  { id: 's15_02', sec: 'S15', lugar: 'hall', c: 1, enc: 'wide', mo: 'he points toward the front door',
    prompt: R(`seen from across the room with his whole body and most of the room in view, standing in his hallway pointing toward his own front door with an open hand, looking at the person filming with an encouraging, warm look. The door is ${PUERTA}.`, 'a coat rack, a hall table with a lamp, a boot tray, a framed photo, a rug') },
  { id: 's15_03', sec: 'S15', lugar: 'hall', c: 0, enc: 'medium', mo: 'the evening light fades slightly in the hallway',
    prompt: O('a front hallway in the early evening, the front door closed, the brass deadbolt thumb turn in the locked position above the knob, a warm ceiling light on, a coat rack with coats, shoes lined up on a tray', 'a hall table with a bowl of keys, a small lamp, a rug, a staircase, a framed photo') },
  { id: 's15_04', sec: 'S15', lugar: 'kitchen', c: 1, enc: 'medium', mo: 'the booklet pages turn slowly',
    prompt: R(`at his kitchen table holding up a thin printed booklet with a plain cover toward the person filming, a proud, modest smile${KR}.`, 'a mug of coffee, a tape measure, a small box of screws, a notepad, a window with daylight') },
  { id: 's15_05', sec: 'S15', lugar: 'porch', c: 1, enc: 'wide', mo: 'he gives a small wave and turns',
    prompt: R('seen from across the room with his whole body and most of the room in view, on his front porch at dusk giving a small wave to the person filming as he turns to go inside, the porch light on, a relaxed, friendly look.', 'a doormat, a potted plant, a porch rail, a mailbox, a bench', true) },

  // ── agregados para la vara de encuadre (presentador ≥55 %, abierto ≥25 %) ──
  { id: 's3_09', sec: 'S3', lugar: 'porch', c: 1, enc: 'wide', mo: 'he straightens up slowly',
    prompt: R('seen from the front walk with his whole body and the porch in view, standing on his own front porch outside a white door that has only a round brass knob and no deadbolt, bending a little to look at the knob with his hands on his knees, a doubtful frown.', 'a doormat, two potted plants, a porch light, a folded newspaper on the step, a porch rail with peeling paint', true) },
  { id: 's6_07', sec: 'S6', lugar: 'hall', c: 1, enc: 'wide', mo: 'he presses the weatherstrip with his thumb',
    prompt: R('seen from down the hallway with his whole body and the front door in view, kneeling at the latch side of his open front door pressing a strip of foam weatherstripping on the frame with his thumb, lips pursed, a skeptical look.', 'a coat rack, a small toolbox, a roll of weatherstripping, a hall table with a lamp, a boot tray') },
];
