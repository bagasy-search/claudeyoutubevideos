// DIRECTOR C — lo que no uso, Penny, baño de tierra, desenlace de Clover, pregunta de Dale, rutina, cierre (p36-48)
import { S, BI, HZP, COOP, YARD, BARN, KITCHEN, STORE, HENS } from "./dir_lib.mjs";
import { CHECKS } from "./dir_a.mjs";
export const SHOTS = [
  S(36, "", "av", "av"),
  S(36, "everybody dusted their chickens with garden bug powder", "c", "OpWontBuy", { props: { bed: "b_oldpowder", n: "1", item: "Garden bug powder", why: "never made for chickens", stamp: "not anymore" } }),
  S(36, "It was never made for chickens", "st", "st_tomato.2"),
  S(36, "Use a product that's labeled for poultry", "av", "av"),
  // ── PENNY
  S(37, "", "av", "av"),
  S(37, "I lost a little bantam hen named Penny", "bi", "b_penny", { p: BI(`A small speckled bantam hen sitting alone hunched in the corner of ${COOP} on a snowy winter day, fluffed up, pale comb, snow visible outside the open door.`), anim: "the little hen closes her eyes, snowflakes drift outside" }),
  S(37, "When I finally picked her up", "bi", "b_pennyhands", { p: BI("Close view of an older woman's weathered hands holding a small light bantam hen with a very pale, almost white comb, in a dim winter coop."), anim: "the hands hold the little hen still" }),
  S(37, "That's the hen I think about", "av", "av"),
  S(37, "I thought she was just cold", "st", "st_autumn.3"),
  S(37, "Mites. They'd been at her", "st", "st_roost.5"),
  S(37, "and I never once looked", "av", "av"),
  // ── LO QUE NO COMPRO
  S(38, "", "c", "OpWontBuy", { props: { bed: "b_oilspray", n: "2", item: "Fancy natural oil sprays", why: "the lice didn't mind them one bit" } }),
  S(39, "", "c", "OpWontBuy", { props: { bed: "b_dedust", n: "3", item: "White powder in the dust bath", why: "they breathe it, and so do you", stamp: "careful" } }),
  S(39, "and when the hens kick it up", "bi", "b_dustcloud", { p: BI("A hen dust bathing in a dirt hollow kicking up a cloud of fine white powder in a farm run, the dust hanging in the air in the sunlight."), anim: "the hen flaps and the fine white dust cloud rises" }),
  S(40, "", "st", "st_dustbath.1"),
  S(40, "Chickens take care of a lot of bugs", "st", "st_dustbath.2"),
  S(40, "In the winter, I fill an old tire", "bi", "b_tire", { p: BI(`An old car tire filled with dry dirt set in the corner of a covered chicken run in winter, a reddish-brown hen rolling and dust bathing in it, light snow outside the run.`), anim: "the hen rolls in the dry dirt flicking it over her back" }),
  // ── DESENLACE
  S(41, "", "hz", "h_check2", { p: HZP("Two weeks later in the evening coop, she holds the red hen Clover on her lap on a towel and parts the feathers under its tail, smiling with relief.", COOP) }),
  S(41, "The skin was clean and pink again", "bi", "b_cleanskin", { p: BI("Close view of clean pink hen skin under parted cream feathers with no eggs or bugs, a few short new pin feathers coming in, in an older woman's fingers."), anim: "the fingers part the feathers revealing new quills" }),
  S(41, "Her back end is starting to come in", "c", "OpLens", { props: { bed: "b_newcoming", from: { x: 1400, y: 300 }, to: { x: 960, y: 560 }, label: "new pin feathers", sub: "a real molt now", ok: true } }),
  S(42, "", "bi", "b_cloverboss", { p: BI(`In ${YARD}: a slightly scruffy reddish-brown hen with a bright red comb chasing two young pullets away from a pile of scratch grains, wings half out, bossy.`), anim: "the hen chases the pullets away from the grain" }),
  S(42, "she's eating like a horse", "st", "st_chickfeed.1"),
  S(43, "", "c", "OpCaseLog", { props: { title: "lice found · whole flock", rows: [{ day: "Clover", n: 1, note: "lots" }, { day: "Pearl", n: 1, note: "a few" }, { day: "June", n: 1, note: "a few" }, { day: "the rest", n: 0, note: "clean" }], every: 24, max: 1, bed: "st_hens.3" } }),
  // ── PREGUNTA DE LA SEMANA
  S(44, "", "av", "av"),
  S(44, "This one is from Dale", "c", "OpViewerQ", { props: { name: "Dale", place: "Ohio", hens: "15 hens", question: "How often should I check my hens for bugs?", bed: "st_hens.4" } }),
  S(45, "", "av", "av"),
  S(45, "Pick her up in the evening", "st", "st_roost.4"),
  S(45, "And I check everybody in the fall", "av", "av"),
  S(46, "", "c", "OpChecklist", { props: { items: [{ t: "First Sunday, after supper", cost: "monthly" }, { t: "Under every tail", cost: "free" }, { t: "Legs and comb", cost: "free" }, { t: "Paper towel on the roost", cost: "free" }, { t: "Write it down", cost: "free" }], every: 60, title: "my monthly bug check", bed: "st_sunset.1" } }),
  S(46, "It takes me about half an hour", "hz", "h_notebook", { p: HZP("She sits on an upturned bucket by the coop door at dusk writing in a small spiral notebook on her knee, a flashlight beside her, a hen pecking at her boot.") }),
  S(46, "Then I wipe the roost", "av", "av"),
  // ── CIERRE
  S(47, "", "av", "av"),
  S(47, "Look at the floor, look for pin feathers", "c", "OpChecklist", { props: { items: CHECKS.slice(0, 3), every: 30, title: "before you guess", bed: "b_stillhen" } }),
  S(48, "", "av", "av", { ov: { c: "OpSubscribe", props: {} } }),
  S(48, "And tell me in the comments", "av", "av2", { ov: { c: "OpAsk", props: { question: "Where are you watching from — and how many hens?" } } }),
  S(48, "I'll see you next week", "bi", "b_eveningcoop", { p: BI(`${YARD.split(":")[0]} at dusk in October: the red coop with its little door open and a warm light inside, ${HENS} going up the ramp to roost one by one.`), anim: "the hens walk one by one up the ramp into the coop" }),
];
export const BEDS = [
  { name: "b_cleanfloor", p: BI(`The clean pine shaving floor of ${COOP} with almost no feathers on it, and one reddish-brown hen standing in the middle with a ragged bare back end.`) },
  { name: "b_pinsclose", p: BI("Close view of the bare neck and shoulder of a reddish-brown hen in an older woman's hands with many short pale bluish pin feathers poking out of the skin like little straws, some opening at the tips.") },
  { name: "b_nits", p: BI("Macro view of the base of a few fluffy cream chicken feathers held apart by an older woman's fingertips, tiny clusters of white grains stuck along the feather shafts near the skin, soft daylight") },
  { name: "b_fowlmites2", p: BI("Close view of dirty grey matted feathers under a hen's tail parted by fingers, with tiny dark specks of mites and greyish clumps at the base of the feathers.") },
  { name: "b_roostnight", p: BI(`Night inside ${COOP} lit only by a flashlight beam: the underside of an old wooden roost bar with hens asleep on top, the beam making a bright circle on the wood.`) },
  { name: "b_scalylegs", p: BI("Close view of a hen's yellow legs and feet held in an older woman's hand, the scales lifted up, crusty and rough, whitish deposits between them. Only her hands and forearms in navy blue flowered sleeves are visible; her face and body are out of the frame.") },
  { name: "b_oilspray", p: BI("On a feed store shelf: small pretty spray bottles of natural herbal coop spray with leafy labels and essential oils, a price tag $14.99.") },
  { name: "b_dedust", p: BI("A large paper bag of white diatomaceous earth powder open on a shed floor with a scoop in it, a little white powder spilled around.") },
  { name: "b_newcoming", p: BI("Close view of a hen's back end in an older woman's hands with clean pink skin and dozens of short new pin feathers coming in across the formerly bare spot.") },
];
