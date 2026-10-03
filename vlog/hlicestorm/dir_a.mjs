// DIRECTOR A — minuto 1 (la noche de los árboles que explotan) + Harlan + cargar todo + agua + heladera/freezer +
// la moneda + el cuarto tibio (p0-12)
import { S, BI, HZP, GARAGE, HOUSE, KITCH, STORM } from "./dir_lib.mjs";
export const SHOTS = [
  S(0, "", "av", "av"),
  S(0, "Then another one", "bi", "b_treecrack", { p: BI(`${STORM.split(":")[0]} at night: a big oak tree glazed in thick ice with a huge limb splitting off the trunk, ice chunks flying, lit by the amber flashing lights of a utility truck.`), anim: "the iced limb cracks and falls" }),
  S(0, "It was January, it was dark", "bi", "b_bucket", { p: BI(`${STORM}: a utility bucket truck parked on the shoulder, a lineman in a hard hat and reflective jacket standing next to it looking up at the trees, breath visible.`), anim: "the amber lights flash and snow falls" }),
  S(0, "That's what ice does", "st", "st_ice.1"),
  S(0, "and the weight keeps building until something gives", "c", "HlIceLoad", { props: { title: "what ice does to a line", label: "inches of ice", bed: "b_bucket" } }),
  S(1, "", "bi", "b_darktown", { p: BI("A small American town at night during an ice storm with every house dark, no street lights, ice glazing the trees and power lines, one car's headlights on the road."), anim: "the car's headlights move slowly down the icy street" }),
  S(1, "Some of them were out for two weeks", "st", "st_ice.2"),
  S(1, "They were the ones who spent one evening", "av", "av"),
  S(2, "", "av", "av"),
  S(2, "Water, heat, food, the pipes", "c", "ElCoolerBoard", { props: { title: "tonight's checklist", rows: [{ item: "water · heat · food" }, { item: "pipes · car · generator" }, { item: "downed power lines", hi: true }], every: 30, bed: "st_ice.3" } }),
  S(2, "Because that one could save your life", "av", "av"),
  // ── HARLAN
  S(3, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Harlan", line: "40 years on the poles · retired lineman" } } }),
  S(3, "and I've seen what a cold, dark house does to people", "hz", "h_bucketold", { p: HZP("He stands next to an old utility bucket truck in a snowy parking lot, hand on the truck door, looking at the camera with a calm, serious face.", "a snowy utility company yard in winter") }),
  // ── CARGAR
  S(4, "", "c", "ElLabelLine", { props: { n: "1", line: "charge everything", means: "tonight, all the way", good: true, bed: "b_chargers" } }),
  S(4, "the little battery packs you got for Christmas", "bi", "b_chargers", { p: BI(`On a kitchen counter in ${KITCH.split(":")[0]}: a row of phones, a tablet, cordless drill batteries and small power banks all plugged into a power strip, little charging lights glowing.`), anim: "a charging light blinks green" }),
  S(4, "Your car is a big battery on wheels", "st", "st_car.1"),
  S(4, "your phone is how you call for help", "av", "av"),
  // ── AGUA
  S(5, "", "c", "ElLabelLine", { props: { n: "2", line: "water", means: "the one people forget", good: true, bed: "b_tub" } }),
  S(5, "your well pump runs on electricity", "bi", "b_wellpump", { p: BI("A well pump and pressure tank in the corner of a cold basement next to a water heater, pipes covered in frost, a flashlight beam on it."), anim: "the flashlight beam moves across the pump" }),
  S(5, "Not to drink, not to cook, not to flush", "av", "av"),
  S(6, "", "bi", "b_tub", { p: BI("A white bathtub filling to the top with clear water from the faucet in an ordinary bathroom, a plastic bucket on the floor beside it."), anim: "the water rises in the tub" }),
  S(6, "A bucket of water poured into the toilet bowl", "st", "st_water.1"),
  S(6, "Then fill every pitcher and big pot", "bi", "b_pitchers", { p: BI(`On the table of ${KITCH.split(":")[0]}: pitchers, big cooking pots and plastic jugs all filled with water, a hand filling one more jug at the sink.`), anim: "the hand fills the jug at the sink" }),
  S(6, "A person needs about a gallon a day", "c", "ElCoolerBoard", { props: { title: "drinking water", rows: [{ item: "per person, per day", price: "1 gallon" }, { item: "times people times days", hi: true }], every: 34, bed: "b_pitchers" } }),
  // ── FREEZER
  S(7, "", "c", "ElLabelLine", { props: { n: "3", line: "freezer and fridge", means: "coldest setting tonight", good: true, bed: "b_freezerjugs" } }),
  S(7, "fill the empty space in the freezer", "bi", "b_freezerjugs", { p: BI("An open chest freezer with frozen food and the empty spaces packed with frozen plastic water jugs and bags of ice, frost on the edges."), anim: "a hand sets one more frozen jug in" }),
  S(7, "Those frozen jugs also become your ice for the cooler", "st", "st_ice.4"),
  S(8, "", "av", "av"),
  S(8, "put a coin on top of the ice", "c", "HlCoinCup", { props: { title: "the coin on the ice", good: "coin on top: stayed frozen", bad: "coin on the bottom: it thawed" } }),
  S(8, "and you need to think hard before you eat any of it", "av", "av"),
  S(9, "", "bi", "b_fridgeshut", { p: BI(`A white refrigerator in a dark ${KITCH.split(":")[0]} during a power outage, a sticky note on the door that says KEEP SHUT in marker, a flashlight lying on the counter.`), anim: "the flashlight on the counter flickers" }),
  S(9, "A closed refrigerator will keep food cold", "c", "ElCoolerBoard", { props: { title: "doors shut", rows: [{ item: "fridge, closed", price: "~4 hours" }, { item: "full freezer, closed", price: "~2 days", hi: true }], every: 34, bed: "b_fridgeshut" } }),
  // ── CUARTO TIBIO
  S(10, "", "c", "ElLabelLine", { props: { n: "4", line: "pick your warm room", means: "one room, not the house", good: true, bed: "b_blanketdoor" } }),
  S(10, "your house starts losing heat right away", "st", "st_frost.1"),
  S(10, "So don't try", "av", "av"),
  S(11, "", "c", "HlWarmRoom", { props: { title: "heat one room, not the house", roomLabel: "the warm room", tips: ["blanket over the door", "towel at the bottom", "curtains closed", "everybody in here"] } }),
  S(11, "Hang a blanket over the doorway", "bi", "b_blanketdoor", { p: BI("An interior doorway of an ordinary house with a heavy quilt hung over it with thumbtacks, a rolled towel along the bottom of the door, a battery lantern on the floor."), anim: "the quilt sways slightly in a draft" }),
  S(11, "Everybody sleeps in that room", "bi", "b_family", { p: BI("A small bedroom lit by a battery lantern during a power outage: a family of four wrapped in sleeping bags and blankets on the floor and the bed, a dog curled up with them, everyone in hats."), anim: "the dog lifts its head and the kids giggle" }),
  S(11, "People are surprised how warm a small room can stay", "av", "av"),
  S(12, "", "st", "st_layers.1"),
  S(12, "You lose a lot of heat through your head", "hz", "h_hat", { p: HZP("He pulls a knit wool hat out of his jacket pocket and holds it up to the camera with a small grin.") }),
];
export const BEDS = [];
