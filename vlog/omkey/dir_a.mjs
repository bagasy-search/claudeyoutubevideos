// DIRECTOR A — omkey (Claudio Old Mechanic #2, "Miss Doris's Car" ep. 2: las 7 cosas de la llave): MINUTO 1 (la llave abierta sobre
// el banco en el seg 0: pila de 3 dólares, chip, hoja metálica → "seven things" → ventanas, arranque con la llave muerta, US$400 →
// el porche del ep. 1 (ClVideoRef th_om99) → loop del cajón de la cocina → credibilidad + 4 chequeos → capítulo) + el porche y la
// agencia (US$65 / US$290) + #7 ventanas abajo (ClFobHold unlock) · #6 ventanas arriba (ClFobHold lock) · #5 la hoja escondida (párrafos 0-30).
import { S, BI, CLP, DORIS, CAR, DRIVE, SHOP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mechanic's weathered tanned hands with a little black grease on the fingers, the rolled navy blue sleeve of a work shirt at the edge of the frame";
export const DH = "an older woman's wrinkled hands with a thin gold wedding ring";
export const KEY = "an ordinary black plastic car key fob for a push-button-start sedan, with four rubber buttons (lock, unlock, trunk and a small red panic button), no brand logo, on a plain metal key ring";
export const DASH = "the dashboard of an ordinary 2012 silver mid-size sedan with no brand badges";
export const KITCHEN = "a modest American kitchen with a wooden table, a flowered tablecloth, a wall calendar and a window over the sink";
const I = "img/omkey/";
export const SHOTS = [
  // ── 0:00 · la llave abierta sobre el banco
  S(0, "", "kf", "k_fobopen", { p: BI(`Extreme close view on a steel workbench: ${KEY} split open in two halves like a clam shell, a silver coin battery inside one half, the small green circuit board visible, a little metal emergency key blade lying next to it.`), d1: "the two halves of the open key fob lie still on the bench", d2: "a mechanic's finger taps the silver coin battery inside", sound: "a quiet workshop, a soft plastic tap" }),
  S(0, "A battery that costs three dollars", "bi", "b_coin3", { p: BI(`Extreme close view of a single silver CR2032 coin battery held between ${H}.`), ov: { c: "ClStampOv", props: { text: "$3" } } }),
  S(0, "A chip that doesn't need that battery", "bi", "b_chip", { p: BI(`Extreme close view of the tiny green circuit board inside an opened car key fob, a small black chip on it, held in ${H}.`) }),
  S(0, "And a real metal key", "bi", "b_blade0", { p: BI(`Close view of ${H} sliding a small metal emergency key blade out of the side of ${KEY}.`) }),
  S(0, "hiding where nobody looks", "av", ""),
  // ── las siete cosas
  S(1, "", "bi", "st_fobhand", { q: "car key fob hand", p: BI(`A hand holding ${KEY}, thumb over the buttons, a parked car blurred behind.`) }),
  S(1, "your dealer never showed you", "bi", "st_dealerdesk", { q: "car dealership salesman keys", p: BI("A car salesman handing a key fob across a dealership desk to a customer.") }),
  S(1, "One rolls every window down", "kf", "k_windows", { p: BI(`${CAR} parked in a sunny grocery store parking lot, all four side windows closed, seen from a few steps away.`), d1: "the car sits still in the sun", d2: "all four side windows slowly roll down by themselves at the same time", sound: "electric window motors humming" }),
  S(1, "One starts your car when the key is completely dead", "bi", "b_startbtn", { p: BI(`Close view of a hand holding ${KEY} flat against the round ENGINE START button of ${DASH}.`) }),
  S(1, "And one can save you four hundred dollars", "bi", "b_twokeys", { p: BI(`Two identical black car key fobs side by side on a kitchen table, a small paper tag tied to one of them.`), ov: { c: "ClStampOv", props: { text: "$400" } } }),
  S(1, "if you do it this week", "av", ""),
  // ── el porche (ep. 1)
  C(2, "", "ClVideoRef", { thumb: I + "th_om99.jpg", title: "Miss Doris's car · episode 1", next: false }),
  S(2, "When I was leaving", "cl", "c_leaving", { p: CLP(`Claudio walking down the driveway toward his old pickup truck in the late afternoon, waving back over his shoulder toward the house.`) }),
  S(2, "she pointed her key at the car", "kf", "k_porch", { p: BI(`Seen from behind ${DORIS} on her front porch: her arm stretched out pointing a car key fob at ${CAR} in the driveway, the car's lights off.`), d1: "she presses the button on the key", d2: "nothing happens, she lowers the key and looks at it, puzzled", sound: "quiet suburban street, a bird" }),
  S(2, "and nothing happened", "bi", "b_darkcar", { p: BI(`Close view of the dark unlit headlight and side mirror of ${CAR} parked in a driveway at dusk, nothing happening.`) }),
  // ── loop: el cajón
  S(3, "", "bi", "b_dorisfob", { p: BI(`Close view of ${DH} holding ${KEY}, pressing the unlock button with her thumb, frustrated.`) }),
  C(3, "The dealership told her", "ClReceipt", { head: "DEALERSHIP QUOTE", lines: [["New key fob", "$240"], ["Programming", "$50"]], total: ["Total", "$290"] }),
  S(3, "What we found in her kitchen drawer", "bi", "b_drawer0", { p: BI(`An open kitchen drawer full of old things: batteries, a tire gauge, rubber bands, a folded white handkerchief at the back.`) }),
  S(3, "made her cry", "bi", "b_dorisglasses", { p: BI(`${DORIS} at her kitchen table, taking off her reading glasses and pressing a tissue to her eye, a small smile.`) }),
  S(3, "I'll get to it", "av", ""),
  // ── credibilidad
  S(4, "", "av", ""),
  S(4, "Thirty-five years as a mechanic", "cl", "c_bench35", { p: CLP(`Claudio at the steel workbench of ${SHOP}, holding a split-open car key fob up to a work light, squinting at it with a half smile.`) }),
  S(4, "my four free checks", "bi", "b_manualkey", { p: BI(`A car owner's manual open on a kitchen table to an index page, a black car key fob lying on top of it, a pen beside.`) }),
  S(4, "to find every hidden feature", "bi", "st_keyshand", { q: "car keys in hand closeup", p: BI(`Close view of a hand turning ${KEY} over, looking at it.`) }),
  S(4, "in about two minutes", "bi", "st_clock", { q: "kitchen wall clock", p: BI("A plain round kitchen wall clock, the second hand moving.") }),
  C(5, "", "ClChapter", { n: 1, title: "Miss Doris's key", sub: "$290 · or $3?" }),
  // ── la llamada, la agencia, Frank
  S(6, "", "bi", "b_phone2", { p: BI(`${DORIS} sitting at her kitchen table talking on an old cordless phone, a car key fob in her other hand.`) }),
  S(6, "the key is dying", "bi", "b_dyingfob", { p: BI(`Extreme close view of ${DH} pressing the unlock button of ${KEY} again and again, nothing happening.`) }),
  S(6, "I have to stand right next to the door", "bi", "b_doorclose", { p: BI(`${DORIS} standing right against the driver's door of ${CAR}, holding the key fob almost touching the handle, pressing it.`) }),
  S(6, "to unlock it", "bi", "st_unlockcar", { q: "unlocking car door key fob woman", p: BI("A woman pressing a key fob right next to her car door to unlock it.") }),
  S(6, "key not detected", "bi", "b_notdetected", { p: BI(`Close view of the small instrument cluster screen of ${DASH} glowing with a plain amber key-shaped warning icon, the car just switched on.`), ov: { c: "ClStampOv", props: { text: "KEY NOT DETECTED" } } }),
  S(7, "", "bi", "st_dealerphone", { q: "service advisor phone dealership", p: BI("A service advisor at a car dealership counter talking on the phone, a computer screen beside him.") }),
  S(7, "Sixty-five dollars to replace the battery", "bi", "b_menuboard", { p: BI(`A dealership service menu board on a wall with a column of prices, blank text lines, a customer looking up at it.`), ov: { c: "ClStampOv", props: { text: "BATTERY · $65" } } }),
  S(7, "or two hundred and ninety for a brand new key", "bi", "b_newfob", { p: BI(`A brand-new black car key fob still in its plastic clamshell package with a plain blank label, on a dealership counter.`) }),
  S(8, "", "bi", "b_frankphoto", { p: BI("An old framed photo on a living-room shelf: a smiling 70-year-old white American man with a gray mustache and a ball cap, leaning on a new silver sedan in 2012.") }),
  C(8, "He had a little routine every spring", "ClNotebook", { title: "Frank's spring list", rows: [{ k: "Key batteries", v: "both" }, { k: "Buttons", v: "clean" }, { k: "The spare", v: "test" }], mark: "every April" }),
  S(8, "She never knew where he kept any of it", "bi", "b_drawers", { p: BI(`${DORIS} opening and closing kitchen drawers one after another, searching.`) }),
  S(9, "", "av", ""),
  S(9, "It's a small computer, a radio, and a real key", "bi", "b_fobparts", { p: BI(`The parts of a disassembled car key fob laid out in a neat row on a steel workbench: the two plastic halves, the green circuit board, a silver coin battery and a small metal key blade.`), ov: { c: "ClStampOv", props: { text: "COMPUTER · RADIO · KEY" } } }),
  S(10, "", "cl", "c_kitchen", { p: CLP(`Claudio and ${DORIS} sitting at the wooden table of ${KITCHEN}, a car key fob, an owner's manual and a coin on the tablecloth between them, coffee mugs.`) }),
  S(10, "and a coin from her purse", "bi", "b_coinpurse", { p: BI(`${DH} taking a nickel out of a small old coin purse over a kitchen table.`) }),
  S(10, "Let me count them down for you", "av", ""),
  // ── #7 ventanas abajo
  C(11, "", "ClFeatureTag", { n: 7, title: "Every window, from outside", note: "hold, don't tap" }),
  S(12, "", "bi", "st_hotlot", { q: "hot parking lot summer cars", p: BI("A grocery store parking lot on a blazing July afternoon, heat shimmer over the asphalt.") }),
  S(12, "Inside it's a hundred and thirty degrees", "bi", "st_hotseat", { q: "car interior sun hot", p: BI(`Harsh sun pouring through the windshield onto the seats of ${CAR}.`), ov: { c: "ClStampOv", props: { text: "130°F INSIDE" } } }),
  S(12, "like an oven", "bi", "b_heatdoor", { p: BI(`A woman opening the driver's door of a hot car in a sunny parking lot and leaning back from the heat, a hand fanning her face.`) }),
  C(13, "", "ClFobHold", { button: "unlock", tap: "unlocks the doors", result: "Every window rolls down" }),
  S(13, "Some even open the sunroof", "bi", "st_sunroof", { q: "car sunroof opening", p: BI("A car sunroof sliding open on a sunny day, seen from inside.") }),
  S(14, "", "bi", "st_windowdown", { q: "car window rolling down", p: BI(`The driver's side window of ${CAR} rolling down in the sun.`) }),
  S(14, "It costs the factory almost nothing", "av", ""),
  S(14, "when this button is held, drop the glass", "bi", "b_holdunlock", { p: BI(`Extreme close view of a thumb pressing and holding the unlock button of ${KEY}.`) }),
  S(15, "", "kf", "k_doriswindows", { p: BI(`${DORIS} standing in her sunny driveway a few steps from ${CAR}, holding a key fob out toward it with her thumb on a button.`), d1: "she holds the button down, waiting", d2: "she looks up, surprised, and laughs with a hand on her chest", sound: "window motors humming, birds" }),
  S(15, "She looked at me like I had done a magic trick", "cl", "c_magic", { p: CLP(`Claudio standing in ${DRIVE} next to ${CAR} with all four windows down, shrugging with a grin while ${DORIS} laughs beside him.`) }),
  S(15, "Eight years with that car", "av", ""),
  S(16, "", "av", ""),
  S(16, "the feature is there but switched off", "bi", "b_settings", { p: BI(`Close view of the small settings menu on the center screen of ${DASH}, a finger touching it, plain blank menu lines.`) }),
  // ── #6 ventanas arriba
  C(17, "", "ClFeatureTag", { n: 6, title: "Every window, from far away", note: "when it starts to rain" }),
  S(18, "", "bi", "st_pharmacy", { q: "pharmacy store entrance", p: BI("The entrance of an ordinary neighborhood pharmacy, automatic doors.") }),
  S(18, "Now it's pouring", "bi", "st_rainlot", { q: "heavy rain parking lot cars", p: BI("Heavy rain pouring on cars in a parking lot.") }),
  S(18, "You're forty feet away in the rain", "bi", "b_crackrain", { p: BI(`Rain falling on ${CAR} parked with its windows cracked open a few inches, water drops landing on the seat inside.`) }),
  C(19, "", "ClFobHold", { button: "lock", result: "Every window rolls up" }),
  S(19, "You hear the motors, and you stay dry", "kf", "k_rainup", { p: BI(`Close view from outside of the rear side window of ${CAR} half open in the rain, raindrops on the glass.`), d1: "rain falls on the half-open window", d2: "the window glass rises and closes all the way", sound: "rain and an electric window motor" }),
  S(20, "", "bi", "st_wetcarpet", { q: "wet car carpet water", p: BI(`A soaked car floor mat and a wet seat inside a car, a towel thrown over it.`) }),
  S(20, "And that car never smells right again", "av", ""),
  S(20, "a button they were holding the whole time", "bi", "b_fobpocket", { p: BI(`A car key fob in an older woman's raincoat pocket, a thumb resting on it.`) }),
  S(21, "", "av", ""),
  C(21, "some need you to keep holding the button", "ClCheck", { title: "Windows up", items: ["Stand near the car", "Hold until they stop", "Let go = they stop halfway"], fast: true }),
  S(22, "", "bi", "st_summerrain", { q: "summer afternoon rain house", p: BI("A sudden summer afternoon rain shower over a quiet suburban street.") }),
  S(22, "with the windows open just a crack", "bi", "b_towelseat", { p: BI(`A folded bath towel spread over the driver's seat of ${CAR}.`) }),
  S(22, "She told me she used to drive home", "bi", "b_crackhome", { p: BI(`${CAR} parked in a driveway under dark rain clouds, its windows cracked open an inch.`) }),
  S(22, "Now she holds one button from the kitchen window", "bi", "b_kitchenwindow", { p: BI(`${DORIS} at her kitchen window holding a car key fob up toward the glass, rain outside, ${CAR} parked in the driveway beyond.`) }),
  // ── #5 la hoja escondida
  C(23, "", "ClFeatureTag", { n: 5, title: "The key inside your key", note: "for a dead battery" }),
  S(24, "", "bi", "st_deadbatt", { q: "car battery dead jumper", p: BI("A car battery under an open hood with jumper cable clamps beside it, evening light.") }),
  S(24, "The doors don't unlock", "bi", "b_handlepull", { p: BI(`A hand pulling the locked driver's door handle of ${CAR} at night in a parking lot.`) }),
  S(24, "You're standing in a cold parking lot at night", "bi", "st_coldlot", { q: "empty parking lot night", p: BI("An empty supermarket parking lot at night under orange lights, breath fog in the cold.") }),
  S(25, "", "bi", "b_fobside", { p: BI(`Extreme close view of the side of ${KEY}: a tiny sliding release button, ${H} about to press it.`) }),
  S(25, "Push it, and a real metal key slides out", "kf", "k_blade", { p: BI(`Extreme close view of ${H} holding ${KEY}, a thumb on the tiny release slide on its side.`), d1: "the thumb pushes the little slide", d2: "a small metal key blade slides out of the end of the fob", sound: "a small metallic click" }),
  S(25, "made for exactly this day", "av", ""),
  S(26, "", "bi", "b_handlecap", { p: BI(`Close view of the driver's door handle of ${CAR}: a small plastic cap at the end of the handle, no keyhole visible.`) }),
  S(26, "It's hiding under a small plastic cap", "bi", "b_capslot", { p: BI(`Extreme close view under the end of a car door handle: a tiny slot under the plastic end cap.`) }),
  S(26, "pop the cap off gently", "kf", "k_capoff", { p: BI(`Extreme close view of ${H} pushing the tip of a small metal key into the slot under the plastic end cap of a car door handle.`), d1: "the key tip goes into the slot and twists", d2: "the plastic cap pops off and shows a round metal keyhole", sound: "a small plastic pop" }),
  S(27, "", "bi", "b_lockcyl", { p: BI(`Extreme close view of a round metal lock cylinder on a car door handle, a small metal key going into it.`) }),
  S(27, "No battery, no electronics, nothing", "bi", "st_dooropen", { q: "opening car door hand", p: BI(`A hand opening the driver's door of ${CAR}.`) }),
  S(27, "The car alarm might go off", "bi", "st_hazards", { q: "car hazard lights flashing night", p: BI("A parked car flashing its hazard lights at night.") }),
  S(27, "It stops when the car starts", "av", ""),
  S(28, "", "bi", "b_stuck", { p: BI(`Close view of ${DH} pressing the side release of ${KEY}, the metal blade not moving, stuck.`) }),
  S(28, "A drop of oil on a paper towel", "bi", "b_oildrop", { p: BI(`${H} dabbing a paper towel with one drop of oil onto the side of a key fob's metal blade.`) }),
  S(28, "it slid out clean", "cl", "c_bladeout", { p: CLP(`Claudio at ${DORIS}'s kitchen table holding up a car key fob with its little metal blade out, ${DORIS} leaning in to look, delighted.`) }),
  S(29, "", "av", ""),
  S(29, "is not the day you want to find out it's stuck", "bi", "st_lockedout", { q: "woman locked out of car", p: BI("A woman standing outside her locked car in a parking lot, looking through the window, frustrated.") }),
  S(30, "", "bi", "st_frozenlock", { q: "frozen car door ice", p: BI(`Ice and frost covering the driver's door and handle of ${CAR} on a winter morning.`) }),
  S(30, "Warm the metal key in your hand", "bi", "b_warmkey", { p: BI(`Close view of ${H} closing around a small metal key to warm it, breath fog in cold air.`) }),
  S(30, "put a little hand sanitizer on it", "bi", "b_sanitizer", { p: BI(`A small bottle of clear hand sanitizer with a plain blank label squeezing a drop onto a small metal car key, outdoors in winter.`) }),
  S(30, "Then turn it slowly", "av", ""),
];
