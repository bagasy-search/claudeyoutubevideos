// DIRECTOR A — minuto 1 (la Featherweight de $40 en la venta de garaje de Dayton) + Hazel + la verdad + el número
// de serie + Featherweight (p0-16)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
const LADY = "a woman in her fifties with short auburn hair, reading glasses on a cord and a green cardigan";
export const MACHINE_FW = "a small black Singer Featherweight portable sewing machine with gold decals, sitting on the open base of its scuffed black carrying case";
export const MACHINE_CELERY = "a small pale celery-green Singer Featherweight portable sewing machine, sitting on the open base of its carrying case";
export const SHOTS = [
  // ── MINUTO 1
  S(0, "", "vl", "m1"),
  S(0, "A little black sewing machine on a card table", "bi", "b_cardtable", { p: BI(`In ${GARAGE.split(":")[0]}: ${MACHINE_CELERY} on a folding card table between a crock pot and a box of Christmas lights, a strip of masking tape on the case with $40 written in black marker.`), anim: "a breeze lifts the corner of the masking tape" }),
  S(0, "sitting in a scuffed case", "st", "st_garagesale.4"),
  S(0, "The lady running the sale said", "bi", "b_lady", { p: BI(`${LADY} sitting in a folding lawn chair at the entrance of ${GARAGE.split(":")[0]}, a cash box on her lap, smiling and pointing toward the card tables.`), anim: "the woman points toward the tables and smiles" }),
  S(0, "Forty dollars and it's yours", "st", "st_antique.5"),
  S(1, "", "av", "av"),
  S(1, "I told her to take the tape off", "vl", "m2"),
  S(1, "and read the number stamped into the metal", "bi", "b_tilt", { p: BI(`Close view: an older woman's hands with a thin silver ring tipping ${MACHINE_CELERY.replace("sitting on the open base of its carrying case", "")} toward the morning light on a card table, the metal bed of the machine showing a stamped serial number.`), anim: "the hands tip the machine toward the light" }),
  S(1, "And that little machine had sold", "c", "HzPriceTag", { props: { bed: "b_cardtable", front: "$40", frontNote: "masking tape", sold: "$1,000+", soldLabel: "what they've sold for", item: "pale green Featherweight", flipAt: 20, stamp: "take the tape off" } }),
  S(2, "", "bi", "b_ladysit", { p: BI(`${LADY} sitting down hard in her folding lawn chair in ${GARAGE.split(":")[0]}, one hand over her mouth, eyes wide, looking at the small green sewing machine on the table.`), anim: "the woman sits down slowly with her hand over her mouth" }),
  S(2, "I was going to sell it to the first person", "av", "av"),
  S(3, "", "av", "av"),
  S(3, "there are millions of old Singer sewing machines", "st", "st_sewingmachine.1"),
  S(3, "in attics, basements and spare bedrooms", "st", "st_attic.1"),
  S(3, "almost all of them are worth forty dollars", "c", "HzMachineShelf", { props: { title: "almost all of them", items: [{ name: "cabinet machine", price: "$40-150" }, { name: "treadle", price: "$40-150" }, { name: "a few little ones", price: "much more", small: true, hi: true }], every: 30, bed: "st_attic.2" } }),
  S(3, "And the difference is written right on the machine", "av", "av"),
  // ── HAZEL
  S(4, "", "av", "av", { ov: { c: "HzNameTag", props: { name: "Hazel", line: "40 years of estate sales · Ohio" } } }),
  S(4, "I've probably carried more Singer sewing machines", "hz", "h_carry", { p: HZP("She carries a heavy black sewing machine head in both arms out of a house toward a folding table, a little out of breath and smiling at the camera.", HOUSE) }),
  S(4, "Today I'm going to show you where the serial number is", "c", "HzRecap", { props: { items: ["where the number is", "how to read it", "the 3 or 4 worth money", "real sold prices", "where to sell"], every: 26, start: 4, title: "today", bed: "st_sewing.1" } }),
  S(5, "", "av", "av"),
  S(5, "because I see families make it every single month", "st", "st_sewing.2"),
  // ── LA VERDAD
  S(6, "", "av", "av"),
  S(6, "Singer made tens of millions of sewing machines", "bi", "b_factory", { p: BI("An old black-and-white looking sewing machine factory floor with long rows of identical black sewing machine heads on wooden benches, iron columns and tall windows, a few workers in aprons."), anim: "a worker lifts a machine head off the line" }),
  S(6, "The big heavy black machine that drops down into a wooden cabinet", "bi", "b_cabinet", { p: BI(`In ${HOUSE.split(":")[0]}: a dark wooden sewing cabinet with the lid flipped open and a heavy black sewing machine raised up out of it, a spool of thread and a pincushion on top.`), anim: "the machine rises slowly out of the cabinet" }),
  S(6, "or the one on the iron treadle base", "bi", "b_treadle", { p: BI("An antique sewing machine on an ornate black cast-iron treadle base with a wide foot pedal, standing on a wood floor in an old farmhouse, the iron scrollwork spelling out a maker's name."), anim: "the foot pedal rocks and the big wheel turns" }),
  S(6, "built like tanks", "st", "st_sewingmachine.2"),
  S(6, "most of them sell for somewhere between forty", "c", "HzSoldListings", { props: { title: "Sold — common Singer machines", rows: [{ item: "Cabinet machine, works", price: "$40–150" }, { item: "Treadle machine", price: "$50–150" }, { item: "Heavy, hard to move", price: "often less" }], range: "$40–150", every: 30, bed: "b_cabinet" } }),
  S(7, "", "av", "av"),
  S(7, "But keep reading the number", "hz", "h_reading", { p: HZP("She leans over a black sewing machine on her worktable with a small flashlight, reading the metal bed through her reading glasses, concentrating.") }),
  // ── EL NÚMERO
  S(8, "", "av", "av"),
  S(8, "it's stamped right into the metal bed of the machine", "c", "HzSerialPlate", { props: { serial: "AK 123456", letters: "letters", lettersMean: "the factory", numbers: "numbers", numbersMean: "the year", title: "the number on the bed", bed: "b_bedclose" } }),
  S(8, "You might need a flashlight and a damp cloth", "bi", "b_wipe", { p: BI("Close view: an older woman's hand wiping old oil and dust off the flat black metal bed of a sewing machine with a damp white cloth, revealing stamped letters and numbers, a small flashlight beside it."), anim: "the cloth wipes and the stamped numbers appear" }),
  S(9, "", "bi", "b_bedclose", { p: BI("Extreme close view of the flat black metal bed of an old sewing machine near the hand wheel, a stamped serial number of two letters and six digits catching the light from a flashlight."), anim: "the flashlight beam slides across the numbers" }),
  S(9, "Write it down exactly, letters and all", "bi", "b_notepad", { p: BI("A small spiral notepad on a worktable next to an old black sewing machine, an older woman's hand writing a serial number in pencil."), anim: "the pencil writes on the notepad" }),
  S(10, "", "av", "av"),
  S(10, "Type Singer serial number and your number", "bi", "b_laptop", { p: BI(`In ${SHOP.split(":")[0]}: an open laptop on the worktable showing a long table of numbers and years on a plain web page, an older woman's hand on the trackpad, an old sewing machine beside it.`), anim: "the hand scrolls the page" }),
  S(10, "Singer had factories in New Jersey, in Scotland", "c", "HzRuleCard", { props: { eyebrow: "made in", rule: "New Jersey · Scotland · Germany · Canada · Russia", lines: ["the number tells you which"], every: 30, bed: "b_factory" } }),
  S(11, "", "av", "av"),
  S(11, "What matters most is which model it is", "st", "st_sewing.3"),
  S(11, "So let me show you the ones I always look for", "av", "av"),
  // ── FEATHERWEIGHT
  S(12, "", "c", "HzLotCard", { props: { n: 1, of: 4, title: "The Featherweight", where: "model 221", bed: "b_fwcase" } }),
  S(12, "It's small, it's black", "bi", "b_fwcase", { p: BI(`On ${SHOP.split(":")[0]} worktable: ${MACHINE_FW}, the little folding bed flipped up on its side, white cotton gloves next to it.`), anim: "a gloved hand folds the little side bed down" }),
  S(12, "It usually comes in a little black case", "bi", "b_fwbox", { p: BI("A small black box-shaped sewing machine carrying case with a leather handle on top and two metal latches, sitting on a closet floor next to old shoe boxes."), anim: "a hand pops open one of the metal latches" }),
  S(12, "and it has a bed that folds up on the side", "hz", "h_fold", { p: HZP(`She folds up the little side bed of ${MACHINE_FW} on her worktable, smiling at the camera like she is showing off a trick.`) }),
  S(13, "", "av", "av"),
  S(13, "Quilters love them", "st", "st_quilt.1"),
  S(13, "light enough to carry to a quilting class", "bi", "b_quiltclass", { p: BI("A small community room quilting class: several women of different ages at folding tables with small black portable sewing machines and colorful quilt blocks, a design wall of quilt squares behind."), anim: "a woman feeds fabric through her little machine" }),
  S(13, "and that keeps the price up", "av", "av"),
  S(14, "", "c", "HzSoldListings", { props: { title: "Sold — Singer Featherweight 221", rows: [{ item: "Black, works, with case", price: "$300–600" }, { item: "Beautiful, all the parts", price: "can go higher" }, { item: "No case", price: "noticeably less" }], range: "$300–600", every: 30, bed: "b_fwcase" } }),
  S(14, "One in beautiful condition", "av", "av"),
  S(15, "", "av", "av"),
  S(15, "were made in Scotland in white or a pale green color", "bi", "b_celery", { p: BI(`On a lace tablecloth by a window: ${MACHINE_CELERY}, a small green attachment box open beside it, soft morning light.`), anim: "the light shifts across the pale green machine" }),
  S(15, "Those, in good shape with their case", "c", "HzPriceTag", { props: { bed: "b_celery", front: "pale green", frontNote: "made in Scotland", sold: "$1,000+", soldLabel: "sold, with case", item: "Featherweight 221K", flipAt: 20, stamp: "slow down" } }),
  S(15, "It had been sitting in a closet for thirty years", "bi", "b_closet", { p: BI("The back of an old bedroom closet with the door open: winter coats on hangers, a stack of hat boxes and, on the floor, a small sewing machine carrying case covered in a little dust."), anim: "the closet door swings open and light falls on the case" }),
  S(16, "", "c", "HzRuleCard", { props: { eyebrow: "the first two letters", rule: "A + a letter → New Jersey", lines: ["E or F + a letter → Scotland", "then look at the color"], every: 34, bed: "b_bedclose2" } }),
  S(16, "Look it up, and look at the color", "av", "av"),
];
export const BEDS = [
  { name: "b_bedclose2", p: BI("Close view of the stamped serial number on the black metal bed of a small portable sewing machine, a magnifying glass resting beside it.") },
];
