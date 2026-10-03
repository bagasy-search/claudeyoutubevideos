// DIRECTOR B — la estufa misma (sello, volcado, apagado, qué comprar), chicos y mascotas, 3 pies, piso, nunca de noche,
// detectores, baño, señales, mitos, casas viejas, el cable, a combustible, si se prende fuego (p16-32)
import { S, BI, HZP, GARAGE, KITCH } from "./dir_lib.mjs";
import { BEDROOM, LIVING } from "./dir_a.mjs";
export const SHOTS = [
  S(16, "", "av", "av"),
  S(17, "", "bi", "b_label", { p: BI("Close view of the back of a white space heater on a store shelf, a small round testing-lab certification sticker and a rating label with watts and amps printed on it, a hand turning it toward the light."), anim: "the hand turns the heater toward the light" }),
  S(17, "The cheapest no-name heater on the internet", "av", "av"),
  S(18, "", "bi", "b_tipover", { p: BI(`A dog trotting past a small ceramic space heater on the wood floor of ${LIVING.split(":")[0]}, its tail brushing the heater.`), anim: "the dog's tail brushes the heater and it rocks" }),
  S(18, "it shuts right off instead of setting the carpet on fire", "c", "ElCoolerBoard", { props: { title: "buy one with", rows: [{ item: "a testing-lab label (UL · ETL · CSA)" }, { item: "a tip-over switch" }, { item: "an overheat shutoff", hi: true }], every: 26, stamp: "or replace it", stampGood: true, bed: "b_label" } }),
  S(19, "", "av", "av"),
  S(20, "", "av", "av"),
  S(20, "An oil-filled radiator", "bi", "b_oilheater", { p: BI(`A white oil-filled radiator space heater on little wheels beside the bed in ${BEDROOM.split(":")[0]}, a small dial on its side, slippers on the floor.`), anim: "the lamp light warms slowly on the radiator fins" }),
  S(20, "It's what I keep in my own bedroom", "hz", "h_bedroom", { p: HZP("He rolls a white oil-filled radiator heater on little wheels into place beside a bed and taps it with his hand, nodding at the camera.", BEDROOM) }),
  S(20, "A ceramic heater with a fan", "st", "st_heater.3"),
  S(20, "The ones with glowing red coils", "bi", "b_coils", { p: BI(`An old radiant space heater with bright glowing orange coils behind a wire grille, sitting a little too close to a long curtain in ${LIVING.split(":")[0]}.`), anim: "the coils glow and the curtain sways slightly" }),
  S(21, "", "bi", "b_toddler", { p: BI(`A toddler in pajamas crawling across the rug of ${LIVING.split(":")[0]} toward a small space heater, a grown-up's hand reaching in from the edge to scoop the child up.`), anim: "the hand scoops the toddler up" }),
  S(21, "A cat will curl up right next to it", "st", "st_cat.1"),
  S(21, "never leave them alone in a room with a heater running", "av", "av"),
  // ── 3 PIES
  S(22, "", "c", "HlThreeFeet", { props: { title: "three feet, every direction", radius: "3 ft", items: ["curtains", "bed", "blankets", "couch", "the dog's bed", "Christmas tree"], rule: "walk all the way around it", bed: "b_coils" } }),
  S(22, "if you can't walk all the way around it", "hz", "h_walkaround", { p: HZP(`He slowly walks all the way around a small space heater in the middle of a bedroom floor, arms out a little, measuring the space with his eyes.`, BEDROOM) }),
  S(23, "", "bi", "b_floor", { p: BI(`A small space heater sitting on a bare hard wood floor in ${BEDROOM.split(":")[0]}, a clear space all around it, the bed and curtains well back.`), anim: "the heater's light glows steadily" }),
  S(23, "where somebody's going to trip on it in the dark", "av", "av"),
  // ── NUNCA DE NOCHE
  S(24, "", "av", "av"),
  S(24, "a space heater running all night next to the bed", "bi", "b_nightbed", { p: BI(`${BEDROOM.split(":")[0]} at night, lit only by the orange glow of a space heater close to the bed, a quilt hanging off the edge of the bed toward it, someone asleep.`), anim: "the orange glow flickers on the quilt" }),
  S(24, "Turn it off, unplug it, and pile on an extra blanket", "bi", "b_blanket", { p: BI(`An older woman's hands unplugging a space heater from a bedroom wall outlet, then pulling a thick wool blanket over a bed.`), anim: "the hands spread the blanket over the bed" }),
  S(25, "", "bi", "b_testalarm", { p: BI("A man on a short step stool pressing the test button on a white ceiling smoke alarm in the hallway of an older house, a new 9-volt battery in his other hand."), anim: "he presses the test button" }),
  S(25, "That's the only reason", "av", "av"),
  // ── BAÑO
  S(26, "", "bi", "b_gfci", { p: BI("Close view of a white bathroom wall outlet with little TEST and RESET buttons between the sockets, beside a sink, a towel hanging near it."), anim: "a finger presses the test button" }),
  S(26, "never, ever have a heater anywhere near a bathtub", "c", "ElLabelLine", { props: { line: "heater + bathtub", means: "electrocution risk", good: false, bed: "b_gfci" } }),
  // ── SEÑALES
  S(27, "", "av", "av"),
  S(27, "A smell like hot plastic or fish", "c", "ElCoolerBoard", { props: { title: "the warning signs", rows: [{ item: "hot plastic or fish smell" }, { item: "lights flicker or dim" }, { item: "warm outlet cover" }, { item: "buzzing or crackling" }, { item: "scorch marks on the plug" }, { item: "breaker trips over and over", hi: true }], every: 22, stamp: "unplug · find out why", bed: "b_badoutlet" } }),
  S(27, "Lights that flicker or dim", "bi", "b_flicker", { p: BI(`A table lamp in ${LIVING.split(":")[0]} at night dimming for a moment as a space heater on the floor clicks on, a man in an armchair looking up at the lamp.`), anim: "the lamp dims and comes back" }),
  S(27, "Scorch marks on the plug", "bi", "b_scorch", { p: BI("Close view in an older man's weathered palm: a space heater plug with one prong blackened and a brown scorch mark on the plastic."), anim: "the hand turns the plug to show the scorch" }),
  // ── MITOS
  S(28, "", "av", "av"),
  S(28, "a heavy duty power strip with a big switch", "bi", "b_hdstrip", { p: BI("A thick heavy-duty power strip with a big orange switch lying on a workbench, its printed warning label visible on the back, a hand turning it over to read it."), anim: "the hand turns the strip over" }),
  S(28, "without ever tripping a thing", "av", "av"),
  // ── CASAS VIEJAS
  S(29, "", "av", "av"),
  S(29, "outlets with only two holes", "bi", "b_twoprong", { p: BI("Close view of an old ivory two-hole wall outlet with no round ground hole, the paint worn around the cover plate, on old plaster wall."), anim: "a flashlight beam passes over it" }),
  S(29, "old cloth-covered wiring", "bi", "b_clothwire", { p: BI("Old cloth-covered electrical wiring running along a wooden beam in a dusty basement of an old house, porcelain knobs holding it."), anim: "a flashlight beam follows the old wire" }),
  S(29, "A visit from an electrician costs a lot less than a fire", "st", "st_electrician.2"),
  // ── EL CABLE
  S(30, "", "hz", "h_cordcheck", { p: HZP("He runs a space heater's cord slowly through his gloved hands at his workbench, inspecting it, stopping at a flattened spot.") }),
  // ── A COMBUSTIBLE
  S(31, "", "bi", "b_kerosene", { p: BI(`A kerosene space heater with its round glowing burner on in ${KITCH.split(":")[0]}, a window cracked open a few inches beside it.`), anim: "the burner glows and the curtain moves in the draft" }),
  S(31, "have a carbon monoxide detector", "bi", "b_codetector", { p: BI("A plug-in carbon monoxide detector with a small digital display reading zero, in an outlet in a hallway outside a bedroom door at night."), anim: "the little green light blinks" }),
  // ── SI SE PRENDE FUEGO
  S(32, "", "av", "av"),
  S(32, "Never throw water on an electrical fire", "c", "ElLabelLine", { props: { line: "water + electrical fire", means: "never", good: false, bed: "b_extinguisher" } }),
  S(32, "Pull the pin, aim at the bottom of the fire", "bi", "b_extinguisher", { p: BI("A red home fire extinguisher on a kitchen wall bracket, a hand pulling it off the bracket and gripping the pin."), anim: "the hand pulls the extinguisher off the wall" }),
  S(32, "Get everybody out, close the door behind you", "st", "st_firetruck.2"),
  S(32, "Things can be replaced. People can't", "av", "av"),
];
export const BEDS = [];
