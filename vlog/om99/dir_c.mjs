// DIRECTOR C — om99: #4 el filtro de cabina · #3 la manija que brilla · #2 el calendario severo · #1 el puerto OBD2 (ClOBDScan scan →
// price) + la tapa floja de Doris · los 3 errores · preguntas · una semana después · cierre: regalo (QR /r + Manual US$27) + gancho
// al ep. 2 (la llave que sólo abre de cerca, ClVideoRef next th_omkey) (párrafos 65-98).
import { S, BI, CLP, DORIS, CAR, DRIVE, SHOP } from "../claudio/lib.mjs";
import { H, DASH } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = "img/om99/";
const GAUGE_LAST = "an analog fuel gauge with a tiny triangle arrow next to the gas pump icon";
const DONE = ["headrest", "hook", "glasses", "trunk", "gas", "visor", "child", "defog", "tire", "wheellock", "spare"];
export const SHOTS = [
  // ── #4 el filtro de cabina
  C(65, "", "ClFeatureTag", { n: 4, title: "The $90 filter", note: "behind the glove box" }),
  S(66, "", "bi", "b_emptyglove", { p: BI(`${H} emptying the glove box of ${CAR}: napkins, papers and a tire gauge pulled out onto the passenger seat.`) }),
  S(66, "it drops down", "kf", "k_glovedrop", { p: BI(`Close view inside a car from the passenger footwell: hands squeezing the sides of an empty glove box so it drops down past its stops.`), d1: "the hands squeeze the sides of the glove box", d2: "the glove box swings down past its stops", sound: "a plastic glove box latch" }),
  S(66, "Behind it is a small cover", "bi", "b_cabincover", { p: BI(`Behind a lowered glove box in ${CAR}: a narrow black plastic cover with two clips, the cabin filter housing.`) }),
  S(66, "It cleans the air you breathe", "cl", "c_filterout", { p: CLP(`Claudio kneeling at the open passenger door of ${CAR}, sliding a very dirty gray cabin air filter full of leaves and dust out of its slot behind the glove box.`) }),
  S(67, "", "bi", "st_invoice", { q: "auto repair invoice", p: BI("A printed auto repair invoice with a blank logo on a service counter, a pen beside it.") }),
  C(67, "The part costs about fifteen", "ClReceipt", { head: "CABIN AIR FILTER", lines: [["Shop", "$60–90"], ["The part", "$15"], ["Your time", "5 min"]], total: ["You save", "$75"] }),
  S(67, "Doris's was black, full of leaves and dust", "bi", "b_dirtyfilter", { p: BI(`Close view of a filthy gray cabin air filter full of dry leaves, dust and bits of a seed pod, held next to a clean white new one.`) }),
  S(67, "like an old basement", "av", ""),
  S(68, "", "bi", "b_filterarrow", { p: BI(`Extreme close view of the edge of a new white cabin air filter frame with a molded airflow arrow.`) }),
  S(68, "so you put the new one in the same way", "kf", "k_filterin", { p: BI(`Close view behind a lowered glove box: ${H} sliding a clean white cabin air filter into its slot.`), d1: "the hands line up the clean filter with the slot", d2: "the filter slides all the way in", sound: "a soft plastic slide" }),
  S(69, "", "bi", "st_acvent", { q: "car air conditioning vent", p: BI(`Close view of a car dashboard air vent, a hand held in front of it feeling the air.`) }),
  S(69, "turn the AC off but leave the fan running", "bi", "b_fanonly", { p: BI(`Close view of a car climate panel: the A/C button light off and the fan knob still turned up, a finger leaving it.`) }),
  // ── #3 la manija que brilla
  C(70, "", "ClFeatureTag", { n: 3, title: "The one that saves lives", note: "inside your trunk" }),
  S(71, "", "bi", "b_trunkup", { p: BI(`Looking up inside the open trunk of ${CAR}: the underside of the lid and a small yellow-green T-shaped release handle hanging near the latch.`) }),
  S(71, "that glows in the dark", "kf", "k_glow", { p: BI(`Inside a nearly closed car trunk in darkness: a small yellow-green release handle glowing softly near the latch.`), d1: "the release handle glows in the dark trunk", d2: "a hand reaches in and pulls the glowing handle, the lid pops up and daylight floods in", sound: "a trunk latch popping" }),
  S(72, "", "bi", "st_hideandseek", { q: "kids playing hide and seek backyard", p: BI("Two small kids playing hide and seek in a suburban backyard, one counting against a tree.") }),
  S(72, "Show it to your grandkids", "bi", "b_showkids", { p: BI(`${DORIS} at the open trunk of ${CAR} in her driveway, showing the glowing trunk release handle to a young grandson.`) }),
  S(72, "Doris made me show her twice", "av", ""),
  S(73, "", "bi", "b_seatrelease", { p: BI(`Inside the open trunk of ${CAR}: a small pull strap on the trunk side of the rear seatback that folds the seat down.`) }),
  S(74, "", "cl", "c_dorispull", { p: CLP(`Claudio standing beside the open trunk of ${CAR} in ${DRIVE}, watching ${DORIS} reach into the trunk with one hand to pull the small glowing release handle, both smiling.`) }),
  C(74, "Don't climb in", "ClDoDont", { yes: { label: "Reach in and pull", img: I + "c_dorispull.jpg" }, no: { label: "Never climb in", img: I + "b_trunkup.jpg" } }),
  S(74, "Frank never told me about this", "bi", "b_dorislaugh", { p: BI(`${DORIS} laughing next to the open trunk of ${CAR}, a hand on her chest, sunny driveway.`) }),
  // ── #2 el calendario severo
  C(75, "", "ClFeatureTag", { n: 2, title: "The page they hope you skip", note: "severe service" }),
  S(76, "", "bi", "b_maintenancepage", { p: BI(`An owner's manual open to a maintenance table with two columns of checkmarks, the words unreadable, a pencil circling one column.`) }),
  C(76, "Normal, and severe", "ClNotebook", { title: "Severe service", rows: [{ k: "Short trips", v: "✓" }, { k: "Stop-and-go", v: "✓" }, { k: "Hot summers", v: "✓" }, { k: "Dusty roads", v: "✓" }], mark: "that's almost everybody" }),
  S(76, "That's almost everybody", "bi", "st_stopgo", { q: "stop and go traffic city", p: BI("Ordinary stop-and-go city traffic on a weekday afternoon.") }),
  S(77, "", "bi", "b_churchdrive", { p: BI(`${CAR} parked in front of a small white church on a Sunday morning, a short trip from home.`) }),
  S(77, "They were changing her oil on the normal one", "bi", "st_oilchange", { q: "quick oil change service", p: BI("A quick-lube oil change bay, a technician under a car's hood.") }),
  S(78, "", "cl", "c_circle", { p: CLP(`Claudio sitting in the driver's seat of ${CAR} with the door open, circling a column in an open owner's manual with a pencil, looking up at the camera.`) }),
  S(78, "three hundred thousand miles", "av", ""),
  C(79, "", "ClReceipt", { head: "THE MATH", lines: [["Extra oil changes", "~$200/yr"], ["Worn-out engine", "$4,000+"]], total: ["Easy call", "severe"] }),
  S(79, "That math is easy", "av", ""),
  // ── #1 el puerto OBD2
  C(80, "", "ClFeatureTag", { n: 1, title: "The plug under your wheel", note: "the $120 secret" }),
  S(81, "", "bi", "b_kneearea", { p: BI(`Looking under the driver's side of ${DASH} near the knee area with a flashlight: the fuse panel cover and a black trapezoid 16-pin plug.`) }),
  C(81, "There's a plug shaped like a trapezoid", "ClOBDScan", { mode: "scan", code: "P0457", meaning: "Gas cap loose" }),
  S(82, "", "bi", "st_checkengine2", { q: "check engine light on dashboard", p: BI(`Close view of ${DASH} with the amber check engine light glowing.`) }),
  S(82, "a hundred and twenty dollars to read", "av", ""),
  S(83, "", "bi", "b_readerplug", { p: BI(`Close view of ${H} plugging a small blue OBD2 code reader into the port under the driver's side of ${DASH}.`) }),
  S(83, "Most auto parts stores will even read it for free", "bi", "st_partsstore", { q: "auto parts store counter", p: BI("The counter of an ordinary auto parts store, shelves of oil and filters behind it.") }),
  C(83, "before anybody quotes you a price", "ClOBDScan", { mode: "price" }),
  S(84, "", "cl", "c_readcode", { p: CLP(`Claudio crouching at the open driver's door of ${CAR}, showing a small blue code reader screen to ${DORIS}, who leans in with her reading glasses on.`) }),
  S(84, "A loose gas cap", "kf", "k_capfix", { p: BI(`Extreme close view of a black gas cap being screwed onto a car filler neck until it clicks.`), d1: "the hand screws the gas cap on", d2: "the cap clicks tight", sound: "three plastic clicks" }),
  S(84, "because of a gas cap", "av", ""),
  // ── los 3 errores
  C(85, "", "ClChapter", { n: 2, title: "The 3 mistakes", sub: "I see every week", alert: true }),
  S(86, "", "bi", "st_checkengine3", { q: "check engine light driving", p: BI("A driver glancing at an amber check engine light on the dashboard while driving.") }),
  S(86, "it's not decoration either", "av", ""),
  S(86, "Read the code", "bi", "b_reader2", { p: BI(`A small blue OBD2 code reader plugged in under ${DASH}, its screen lit, unreadable.`) }),
  S(87, "", "bi", "b_flashing", { p: BI(`Close view of ${DASH}, the amber check engine light glowing brightly, slightly motion-blurred as if flashing.`), ov: { c: "ClStampOv", props: { text: "FLASHING = SAME DAY" } } }),
  S(87, "your catalytic converter", "bi", "st_catconverter", { q: "catalytic converter car underside", p: BI("The underside of a car on a lift, a mechanic's light on the catalytic converter in the exhaust.") }),
  S(88, "", "bi", "b_coupon2", { p: BI(`An oil change coupon flyer on the passenger seat of ${CAR} next to the owner's manual.`) }),
  S(88, "and write it down, like Frank did", "bi", "b_notebook3", { p: BI(`${DORIS}'s hand writing a new line in an old spiral car-maintenance notebook on the hood of ${CAR}.`) }),
  // ── preguntas
  C(89, "", "ClChapter", { n: 3, title: "Quick questions", sub: "the ones I always get" }),
  S(90, "", "bi", "st_oldcar", { q: "older sedan parked driveway", p: BI("An older sedan from the early 2000s parked in a suburban driveway.") }),
  S(90, "required on new cars in America since 2002", "bi", "b_glow2", { p: BI(`Close view of a yellow-green glow-in-the-dark trunk release handle with a small molded pictogram of a person leaving a trunk.`) }),
  S(90, "Check your manual", "av", ""),
  S(91, "", "bi", "b_simplereader", { p: BI(`A simple small blue OBD2 code reader with a short cable lying in the open glove box of ${CAR}.`) }),
  S(91, "you'll use it for years", "av", ""),
  S(92, "", "bi", "st_goodshop", { q: "friendly mechanic talking customer", p: BI(`A friendly mechanic explaining something to an older customer next to a car in ${SHOP}.`) }),
  S(92, "you're asking questions, not just signing", "av", ""),
  // ── una semana después
  S(93, "", "bi", "b_dorisphone2", { p: BI(`${DORIS} on the phone at her kitchen window, smiling, ${CAR} visible in the driveway outside.`) }),
  S(93, "her check engine light was gone", "bi", "b_cleandash", { p: BI(`Close view of ${DASH} with the car running and no warning lights on, daylight.`) }),
  S(93, "she canceled the appointment", "bi", "b_cancel", { p: BI(`A dealership appointment card being torn in half by an older woman's hands over a kitchen table.`) }),
  C(93, "and the visor slid out", "ClCarMap", { done: DONE.concat(["cabin", "glow", "manual", "obd"]), title: "Miss Doris's car" }),
  S(94, "", "bi", "b_frankphoto2", { p: BI(`An old framed photo of a smiling man with a gray mustache and ball cap next to a silver sedan, on a shelf beside a small vase of flowers.`) }),
  S(94, "Frank did all the hard work", "av", ""),
  S(94, "where he put everything", "bi", "b_frankbag", { p: BI(`An old cloth bag, a tire gauge and a spiral notebook neatly arranged in the trunk well of ${CAR}, where someone careful put them years ago.`) }),
  S(95, "", "cl", "c_yearsleft", { p: CLP(`Claudio and ${DORIS} standing next to ${CAR} in ${DRIVE} in warm late-afternoon light, he has a hand on the roof of the car, she is smiling.`) }),
  S(95, "It just needed somebody to listen to it", "av", ""),
  // ── cierre: el regalo + el gancho
  S(96, "", "av", ""),
  C(96, "I made a free guide called Before the Shop", "ClQRCard", { qr: I + "qr.jpg", cover: I + "gift_cover.jpg", text: "the 3 tests, free", kicker: "FREE · BEFORE THE SHOP" }),
  S(96, "one paper towel", "bi", "b_papertowel2", { p: BI(`A white paper towel under the front of ${CAR} on a driveway at dawn, a couple of small colored drip spots on it.`) }),
  C(96, "the full Glovebox Manual", "ClBookPage", { page: I + "page9.jpg", pageNo: 9, stamp: "All 58 tricks · $27" }),
  S(97, "", "bi", "b_porch", { p: BI(`${DORIS} on her front porch pointing her car key fob at ${CAR} parked in the driveway, nothing happening.`) }),
  S(97, "She had to walk right up to the door", "kf", "k_fob", { p: BI(`An older woman's hand pressing a car key fob button right next to the driver's door of a silver sedan.`), d1: "the thumb presses the fob button again", d2: "the car finally unlocks with a blink of the lights", sound: "a car key fob chirp" }),
  S(97, "Her key fob was dying", "bi", "b_fobopen", { p: BI(`A black car key fob split open on a workbench showing a small silver coin battery.`) }),
  C(97, "That's the next video", "ClVideoRef", { thumb: I + "th_omkey.jpg", title: "7 hidden key fob features", next: true }),
  S(98, "", "bi", "b_arrowlast", { p: BI(`Close view of ${GAUGE_LAST} seen from the driver's seat.`) }),
  S(98, "Tell me in the comments", "av", ""),
];
