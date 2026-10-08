// DIRECTOR A — om500k (Claudio Old Mechanic #3, "Miss Doris's Car" ep. 3: los 6 hábitos de 500.000 millas): MINUTO 1 (la válvula PCV
// en los dedos en el seg 0 → ClOdoRace 130.000 vs 500.000 → Doris "how long can it last" (ClVideoRef th_omkey) → loop del cuaderno de
// Frank: 4 de 6 → credibilidad + "una hoja de papel" → capítulo) + el garaje (el vecino, el miedo, la regla, el cuaderno) + #6 los
// primeros 5 minutos + #5 el filtro de aire (párrafos 0-26).
import { S, BI, CLP, DORIS, CAR, DRIVE, SHOP } from "../claudio/lib.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
export const H = "a mechanic's weathered tanned hands with a little black grease on the fingers, the rolled navy blue sleeve of a work shirt at the edge of the frame";
export const DH = "an older woman's wrinkled hands with a thin gold wedding ring";
export const DASH = "the dashboard of an ordinary 2012 silver mid-size sedan with no brand badges";
export const BAY = "the engine bay of an ordinary 2012 silver mid-size sedan with the hood open, a plain black plastic engine cover with no logo";
export const GARAGE = "the open two-car garage of a modest one-story American suburban house: a pegboard with old hand tools, a chest freezer, a workbench with a coffee can of screws";
export const NOTEBOOK = "a small worn spiral notebook with handwritten rows of dates, mileage and notes in faded blue pen, the words too small to read";
export const PCV = "a small black-and-gray plastic PCV valve about the size of a thumb, with a short rubber elbow";
const I = "img/om500k/";
export const SHOTS = [
  // ── 0:00 · la válvula
  S(0, "", "bi", "b_pcvfingers", { p: BI(`Extreme close view of ${PCV} held between ${H}, the open engine bay of a car behind.`) }),
  S(0, "It costs about five dollars", "bi", "b_pcvpack", { p: BI(`A new PCV valve in a small clear plastic bag with a plain blank parts-store label on a workbench, next to a five dollar bill.`), ov: { c: "ClStampOv", props: { text: "ABOUT $5" } } }),
  S(0, "between an engine that dies", "bi", "st_scrapyard", { q: "car scrapyard junkyard old cars", p: BI("Rows of old wrecked cars in a scrapyard.") }),
  S(0, "and one that goes past five hundred thousand", "av", ""),
  C(1, "One owner sends it to the scrapyard", "ClOdoRace", { a: 130000, b: 500000, labelA: "Owner A", labelB: "Owner B" }),
  S(1, "The other one is still driving it", "bi", "st_oldcardrive", { q: "old car driving road", p: BI(`An older silver sedan driving down a quiet country road.`) }),
  S(1, "It's not luck", "av", ""),
  S(1, "It's six small habits", "bi", "b_sixhabits", { p: BI(`Close view of ${NOTEBOOK} lying open on a car hood, a pen across it.`), ov: { c: "ClStampOv", props: { text: "6 HABITS" } } }),
  // ── Doris
  C(2, "", "ClVideoRef", { thumb: I + "th_omkey.jpg", title: "Miss Doris's car · episode 2", next: false }),
  S(2, "Frank's car has two hundred eighty thousand miles", "bi", "b_odo280", { p: BI(`Close view of the odometer of ${DASH}: a digital display, warm daylight.`), ov: { c: "ClStampOv", props: { text: "280,000 MILES" } } }),
  S(2, "How long can it really last", "bi", "b_dorisgarage", { p: BI(`${DORIS} standing in ${GARAGE} next to ${CAR}, arms crossed, looking at the car with worry.`) }),
  S(3, "", "bi", "k_notebook", { p: BI(`Extreme close view of ${DH} opening an old small spiral notebook on a workbench in a garage.`), d1: "the hands open the notebook cover", d2: "the pages fall open showing rows of handwriting in blue pen", sound: "paper pages, a quiet garage" }),
  S(3, "four of the six", "bi", "b_checkmarks", { p: BI(`Close view of a pencil making small check marks in the margin of ${NOTEBOOK}.`), ov: { c: "ClStampOv", props: { text: "4 OF 6" } } }),
  S(3, "The two he missed", "bi", "st_headgasket", { q: "mechanic engine repair head", p: BI(`A disassembled engine on a shop bench, the cylinder head off.`) }),
  S(3, "I'll show you which", "av", ""),
  S(4, "", "av", ""),
  S(4, "Thirty-five years as a mechanic", "cl", "c_shop35", { p: CLP(`Claudio leaning on the open hood of a car in ${SHOP}, a flashlight in his hand, looking at the camera with a calm half smile.`) }),
  S(4, "less than a tank of gas", "bi", "st_gaspump", { q: "gas pump nozzle filling car", p: BI(`A gas pump nozzle in the tank of ${CAR}.`) }),
  S(4, "the one sheet of paper", "bi", "b_onesheet", { p: BI(`A single sheet of lined paper with a short handwritten list taped to the inside of a garage cabinet door, the words too small to read.`) }),
  S(4, "decides if your car makes it", "av", ""),
  C(5, "", "ClChapter", { n: 1, title: "Borrowed time?", sub: "280,000 miles · how long can it last" }),
  // ── el garaje
  S(6, "", "bi", "b_dorisdrive", { p: BI(`${DORIS} driving ${CAR} through her quiet neighborhood on a sunny morning, both hands on the wheel, smiling.`) }),
  S(6, "Then her neighbor told her", "bi", "b_neighbor", { p: BI(`An older white man in a ball cap leaning on a mailbox, talking across the lawn to ${DORIS} standing next to her car in the driveway.`) }),
  S(6, "Sell it before it dies on you", "bi", "st_forsale", { q: "for sale sign car window", p: BI("A for sale sign in the rear window of a parked used car.") }),
  S(7, "", "bi", "b_dorisphone", { p: BI(`${DORIS} at her kitchen table on an old cordless phone, worried, a car key fob on the table.`) }),
  S(7, "Is this car about to quit on me", "av", ""),
  S(8, "", "cl", "c_phone", { p: CLP(`Claudio in ${SHOP} talking on his phone, leaning on a workbench, calm and reassuring.`) }),
  S(8, "They die of dirt, heat and neglect", "bi", "st_dirtyengine", { q: "dirty old car engine", p: BI(`A dirty, oily old car engine bay.`) }),
  S(8, "The miles on the dash don't matter", "bi", "st_odometer", { q: "car odometer high mileage", p: BI(`A car odometer showing a high mileage number.`) }),
  S(8, "what happened during those miles", "av", ""),
  S(9, "", "cl", "c_garage", { p: CLP(`Claudio and ${DORIS} sitting on two folding chairs in ${GARAGE}, an old spiral notebook open on his knee, ${CAR} parked beside them.`) }),
  S(9, "written down in blue pen for ten years", "bi", "b_bluepen", { p: BI(`Extreme close view of ${NOTEBOOK}, a page full of neat rows.`) }),
  C(9, "I could tell you exactly", "ClNotebook", { title: "Frank's notebook", rows: [{ k: "Oil", v: "every 5,000 ✓" }, { k: "Tires", v: "monthly ✓" }, { k: "Brake fluid", v: "—" }, { k: "Coolant", v: "8 years ago" }], mark: "two blind spots" }),
  S(9, "with two blind spots", "av", ""),
  S(10, "", "bi", "b_garagebench", { p: BI(`${GARAGE} seen from the driveway in daylight, the silver sedan inside, the hood up.`) }),
  S(10, "The ones Frank did", "av", ""),
  // ── #6 los primeros 5 minutos
  C(11, "", "ClFeatureTag", { n: 6, title: "The first five minutes", note: "of every drive" }),
  S(12, "", "bi", "st_frostcar", { q: "car parked overnight frost morning", p: BI(`${CAR} parked in a driveway on a cold early morning, dew on the windows.`) }),
  S(12, "the oil drains down into the pan", "bi", "st_oildrain", { q: "engine oil pouring", p: BI("Golden engine oil pouring slowly into an engine.") }),
  S(12, "parts are turning with very little oil", "bi", "st_engineinside", { q: "engine pistons animation", p: BI(`A cutaway training model of a car engine on a shop shelf, the pistons and crankshaft visible.`) }),
  S(12, "That's when most engine wear happens", "av", ""),
  S(12, "In your driveway", "bi", "st_startcar", { q: "starting car engine key morning", p: BI(`A hand pressing a car's start button on a cold morning, breath fog on the windshield.`) }),
  S(13, "", "bi", "st_idling", { q: "car idling exhaust cold morning", p: BI("White exhaust from a car idling in a driveway on a cold morning.") }),
  S(13, "That's an old habit from carburetor days", "bi", "st_carburetor", { q: "old carburetor engine", p: BI("Close view of an old carburetor on a vintage engine.") }),
  S(13, "Idling a cold engine for a long time", "av", ""),
  S(13, "and it takes forever to get warm", "bi", "b_tempcold", { p: BI(`Close view of the temperature gauge of ${DASH}, the needle resting all the way on C.`) }),
  S(14, "", "av", ""),
  S(14, "Wait about thirty seconds", "kf", "k_seatbelt", { p: BI(`Inside ${CAR} on a cool morning, seen from the passenger seat: ${DORIS} in the driver's seat reaching for her seat belt, the engine just started.`), d1: "she pulls the seat belt across", d2: "she clicks it and puts her hands on the wheel", sound: "a seat belt click, a quiet idling engine" }),
  S(14, "stay under half the needle", "bi", "b_tach", { p: BI(`Close view of the tachometer of ${DASH} while driving, the needle low, around two.`) }),
  S(14, "until the temperature gauge starts to move", "bi", "b_tempmove", { p: BI(`Close view of the temperature gauge of ${DASH}, the needle a quarter of the way up from C.`) }),
  S(15, "", "bi", "st_floorit", { q: "foot pressing gas pedal", p: BI("A foot pressing a car's gas pedal hard.") }),
  S(15, "Cold oil is thick", "bi", "st_thickoil", { q: "thick oil pouring slow", p: BI("Thick golden oil dripping slowly off a dipstick.") }),
  S(15, "it hasn't reached everything yet", "av", ""),
  S(16, "", "bi", "st_scrapeice", { q: "scraping ice windshield", p: BI("A person scraping ice off a car windshield on a winter morning.") }),
  S(16, "The engine warms up faster driving softly", "av", ""),
  S(16, "Do that first, because you need to see", "bi", "st_winterdrive", { q: "car driving snow road", p: BI("A car driving slowly on a snowy suburban street.") }),
  S(17, "", "bi", "st_turbo", { q: "car turbocharger engine", p: BI("Close view of a turbocharger on a car engine.") }),
  S(17, "Let it idle thirty seconds", "av", ""),
  S(18, "", "bi", "b_capitals", { p: BI(`Close view of the inside front cover of an old spiral notebook with a short line written in big capital letters in blue pen, the words too small to read.`), ov: { c: "ClStampOv", props: { text: "30 SECONDS, THEN EASY" } } }),
  S(18, "Doris laughed", "bi", "b_dorislaugh", { p: BI(`${DORIS} in ${GARAGE} laughing with a hand over her mouth, holding an old spiral notebook.`) }),
  S(18, "and I thought he was just being stubborn", "av", ""),
  // ── #5 el filtro de aire
  C(19, "", "ClFeatureTag", { n: 5, title: "Let it breathe", note: "the air filter" }),
  S(20, "", "bi", "st_airfilter", { q: "car engine air filter", p: BI("A clean new white pleated engine air filter held in two hands.") }),
  S(20, "It sits in a black plastic box under the hood", "bi", "b_airbox", { p: BI(`${BAY}: a big black plastic air filter box with metal clips, connected to a large intake hose, ${H} pointing at it.`) }),
  S(21, "", "av", ""),
  S(21, "You feel it as lazy acceleration", "bi", "st_slowmerge", { q: "car merging highway traffic", p: BI("A car slowly merging onto a highway.") }),
  S(21, "a tank of gas that doesn't go as far", "bi", "b_fuelgauge", { p: BI(`Close view of the fuel gauge of ${DASH}, the needle near E, the low fuel light on.`) }),
  S(21, "It's the filter", "av", ""),
  S(22, "", "bi", "st_pophood", { q: "opening car hood", p: BI(`A hand lifting the open hood of ${CAR} and setting the prop rod.`) }),
  S(22, "Two to four metal clips hold the lid", "kf", "k_clips", { p: BI(`Extreme close view of ${H} on the metal spring clip of a black plastic car air filter box under the hood.`), d1: "the thumb pushes the metal clip", d2: "the clip snaps open", sound: "a metal clip snapping" }),
  S(22, "and pull the filter straight up", "bi", "b_pullfilter", { p: BI(`${H} lifting a dirty gray pleated air filter straight up out of its black plastic box under the hood.`) }),
  S(23, "", "bi", "k_lighttest", { p: BI(`${DH} holding a gray pleated car air filter up toward the bright open garage door, daylight behind it.`), d1: "the hands raise the filter toward the light", d2: "light glows through the pleats", sound: "a quiet garage, birds outside" }),
  C(23, "If you can barely see light", "ClDoDont", { yes: { label: "Light comes through: fine", img: I + "b_filterclean.jpg" }, no: { label: "Barely any light: replace", img: I + "b_filterdirty.jpg" } }),
  S(23, "Put the new one in the same way", "bi", "b_filterclean", { p: BI(`A clean white pleated car air filter held up to the sun, bright light shining through the pleats.`) }),
  S(23, "Five minutes, about twenty dollars", "av", ""),
  S(24, "", "bi", "st_aircompressor", { q: "air compressor blowing dust", p: BI("Compressed air blowing a cloud of dust off a filter in a workshop.") }),
  S(24, "You make tiny holes you can't see", "bi", "b_filterdirty", { p: BI(`A dark gray clogged car air filter held up to the sun, almost no light coming through.`) }),
  S(24, "the dirt goes straight into your engine", "av", ""),
  S(25, "", "bi", "st_gravelroad", { q: "car driving gravel road dust", p: BI("A car driving on a dusty gravel road, a cloud of dust behind it.") }),
  S(25, "brown as a paper bag", "bi", "b_brownfilter", { p: BI(`A very dirty brown car air filter on a workbench next to a brown paper grocery bag.`) }),
  S(26, "", "bi", "b_frankfilter", { p: BI(`Close view of ${NOTEBOOK}, a pencil pointing at one line.`), ov: { c: "ClStampOv", props: { text: "AIR FILTER ✓" } } }),
  S(26, "She held it up to the garage light", "cl", "c_filterlight", { p: CLP(`Claudio standing next to ${DORIS} in ${GARAGE}; she holds a clean air filter up to the light, he smiles and nods.`) }),
  S(26, "then Frank did his job", "av", ""),
];
