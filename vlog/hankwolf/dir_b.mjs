// DIRECTOR B — los ataques, la ranchera, las pérdidas ocultas, los pagos, las herramientas (fladry, jinetes, perros,
// carcasas), la noche con el jinete, la captura de Copper Creek, los dos lados (p18-33)
import { S, BI, HZP, ROAD, RANCH, FARM, COAST, FOREST } from "./dir_lib.mjs";
import { WOLVES, RANCHER } from "./dir_a.mjs";
const RANCHWOMAN = "a white ranch woman in her forties with a long braid, a quilted vest over a flannel shirt and work gloves";
export const SHOTS = [
  S(18, "", "av", "av"),
  S(18, "sheep killed in the night", "bi", "b_sheepnight", { p: BI(`A band of white sheep bunched tightly together on a dark sagebrush hillside at night in western Colorado, lit by a truck's headlights, a big white guard dog in front.`), anim: "the sheep shuffle closer together" }),
  S(18, "looked at the bite marks and the tracks", "bi", "b_tracks", { p: BI("Close view of big canine paw prints pressed into fresh snow beside a barbed wire fence, a wildlife officer's gloved hand holding a measuring tape next to one print."), anim: "the tape extends beside the print" }),
  S(18, "many of them traced back to the same family", "av", "av"),
  S(19, "", "bi", "b_ranchwoman", { p: BI(`${RANCHWOMAN} standing by a pickup truck at ${RANCH.split(":")[0]}, holding her phone and looking at it with a tight face, cattle behind her.`), anim: "she lowers the phone and looks at the pasture" }),
  S(19, "You can't pay me for walking out every morning", "av", "av"),
  S(19, "so scared they won't put on weight", "st", "st_cattle.3"),
  S(20, "", "bi", "b_bunched", { p: BI(`Black Angus cattle bunched tightly together in a corner of a frosty pasture in ${ROAD.split(":")[0].replace("a gravel ranch road in ", "")}, heads up, alert, looking toward the treeline.`), anim: "the cattle shift nervously, heads up" }),
  S(20, "Ranchers call those the hidden losses", "c", "ElCoolerBoard", { props: { title: "the hidden losses", rows: [{ item: "cattle bunch up, don't graze right" }, { item: "some lose weight" }, { item: "some lose their calves" }, { item: "hard to prove", hi: true }], every: 28, bed: "b_bunched" } }),
  S(21, "", "av", "av"),
  S(21, "the state can pay you back for it", "c", "ReceiptPrinter", { props: { title: "STATE OF COLORADO · LOSS CLAIM", lines: [{ l: "CONFIRMED WOLF LOSS", r: "paid" }, { l: "PREVENTION HELP", r: "paid" }, { l: "---", r: "" }, { l: "HIDDEN LOSSES", r: "hard to claim" }, { l: "PAPERWORK", r: "slow" }], totalLabel: "UNCONFIRMED", total: "$0" } }),
  S(21, "the paperwork is a pain", "av", "av"),
  // ── HERRAMIENTAS
  S(22, "", "av", "av"),
  S(23, "", "bi", "b_fladry", { p: BI(`A long rope fence strung on thin posts around a pasture in ${RANCH.split(":")[0]}, bright red and orange flags hanging every couple of feet and flapping in the wind, cattle grazing beyond.`), anim: "the red flags flap in the wind" }),
  S(23, "for some reason wolves don't like to cross it", "c", "HkFladry", { props: { title: "fladry", tools: ["range riders", "guard dogs", "haul away dead stock"], caption: "works best for a while", bed: "b_fladry" } }),
  S(24, "", "bi", "b_rider", { p: BI(`A young range rider on horseback in a canvas coat riding slowly along the edge of a herd of black cattle in a sagebrush pasture at dusk, snowy mountains behind.`), anim: "the horse walks slowly along the herd" }),
  S(24, "Wolves don't like people", "av", "av"),
  S(25, "", "bi", "b_guarddog", { p: BI(`A huge fluffy white Great Pyrenees farm dog with floppy ears, a thick shaggy coat and a red collar, lying among a band of sheep on a Colorado mountain hillside, head up, looking toward the trees.`), anim: "the dog lifts its head and barks" }),
  S(26, "", "st", "st_ranch.1"),
  S(26, "Hauling those away", "av", "av"),
  S(27, "", "av", "av"),
  // ── LA NOCHE CON EL JINETE
  S(28, "", "av", "av"),
  S(28, "We drove the edge of a big pasture with a spotlight", "hz", "h_ridealong", { p: HZP("At night in the passenger seat of a ranch pickup truck, he holds a handheld spotlight out the open window, the beam crossing a dark pasture, his breath fogging in the cold.", "a dark cattle pasture in Grand County, Colorado at night") }),
  S(28, "he picked up two warm shapes on the scope", "c", "HkThermalCount", { props: { label: "THERMAL · RANGE RIDER · MIDNIGHT", to: 2, unit: "wolves on the ridge", caption: "watching the herd" } }),
  S(28, "honked, flashed the lights", "bi", "b_headlights", { p: BI(`A ranch pickup truck on a dirt track along a barbed wire fence at night, its headlights flashing on high beam toward a dark ridge, cattle eyes reflecting in the pasture.`), anim: "the headlights flash bright" }),
  S(28, "Most nights nothing happens", "av", "av"),
  S(28, "he hadn't slept a full night in two months", "bi", "b_ridertired", { p: BI(`A tired young range rider in his twenties in a canvas coat and wool cap sitting behind the wheel of a pickup truck at dawn, rubbing his eyes, a thermos on the dash.`), anim: "he rubs his eyes and yawns" }),
  // ── LA CAPTURA
  S(29, "", "av", "av"),
  S(29, "They were the first family of wolves", "st", "st_wolf.4"),
  S(30, "", "av", "av"),
  S(30, "They went out and caught the whole family", "bi", "b_capture", { p: BI(`A wildlife officer in a uniform jacket kneeling beside a large covered animal transport crate in the bed of a pickup truck on a mountain dirt road, summer, sagebrush.`), anim: "the officer checks the crate latch" }),
  S(30, "moved them to a holding facility", "c", "ElLabelLine", { props: { line: "the Copper Creek pack · summer 2024", means: "caught and moved off the land", good: false, bed: "b_capture" } }),
  S(31, "", "av", "av"),
  S(31, "the father wolf died", "st", "st_wolfsnow.2"),
  // ── DOS LADOS
  S(32, "", "av", "av"),
  S(32, "The ranchers said, see", "bi", "b_meeting", { p: BI(`A crowded public meeting in a small-town community hall in Colorado: ranchers in cowboy hats and people in fleece jackets in folding chairs, one man standing and speaking angrily, officials at a table in front.`), anim: "the man gestures and people murmur" }),
  S(32, "caught right in the middle", "av", "av"),
  S(33, "", "av", "av"),
];
export const BEDS = [];
