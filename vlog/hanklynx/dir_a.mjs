// DIRECTOR A — minuto 1 (camino de las Highlands, la suelta secreta) + Hank + qué es un lince + por qué se fue +
// los ciervos + la suelta y la captura (p0-14)
import { S, BI, HZP, ROAD, RANCH, FARM, COAST, FOREST, AXIS } from "./dir_lib.mjs";
export const LYNX = AXIS;
export const SHOTS = [
  // ── MINUTO 1 (abre con Hank)
  S(0, "", "av", "av"),
  S(0, "there's heather on the hills", "st", "st_highlands.1"),
  S(0, "opened some crates, and turned four wild lynx loose", "bi", "b_crates", { p: BI(`At night on a dark forestry track in the Scottish Highlands, lit only by the headlights of a van: two open wooden animal crates on the ground, empty, pine trees all around, mist.`), anim: "mist drifts through the headlights" }),
  S(1, "", "bi", "b_roadlynx", { p: BI(`${LYNX} walking across a narrow country road in broad daylight near a small Highland village, a parked car in the distance, seen through a car windshield.`), anim: "the lynx walks across the road" }),
  S(1, "The police got involved", "st", "st_police.1"),
  S(1, "Not all of them survived it", "av", "av"),
  S(2, "", "c", "HkHighlandMap", { props: { title: "the Cairngorms, Scotland", park: "Cairngorms National Park", town: "Kingussie", dots: 4, caught: "all 4 caught within days" } }),
  S(3, "", "av", "av"),
  S(3, "a lot like Colorado and the wolves", "st", "st_wolf.1"),
  // ── HANK
  S(4, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Hank", line: "just a guy from Louisiana with questions" } } }),
  // ── QUÉ ES UN LINCE
  S(5, "", "c", "SpeciesFile", { props: { photo: "img/hanklynx/b_lynxportrait.jpg", common: "Eurasian lynx", latin: "Lynx lynx", facts: [{ k: "size", v: "a medium dog" }, { k: "ears", v: "black tufts" }, { k: "eats", v: "mostly deer" }, { k: "habits", v: "shy · dawn and dusk · alone" }], stamp: "gone from Britain" } }),
  S(5, "those famous black tufts", "bi", "b_lynxportrait", { p: BI(`Close portrait of ${LYNX} sitting in snow among Scots pines, looking slightly past the camera, its ear tufts and facial ruff clearly visible, soft winter light.`), anim: "the lynx's ears twitch" }),
  S(5, "It's a shy animal", "st", "st_lynx.1"),
  S(6, "", "c", "HkGoneSince", { props: { title: "what Britain lost", items: [{ name: "lynx", gone: "500-1,300 years" }, { name: "wolf", gone: "centuries" }, { name: "bear", gone: "1,000+ years" }], every: 26 } }),
  S(6, "People cut down most of the forests", "st", "st_moor.1"),
  // ── LOS CIERVOS
  S(7, "", "av", "av"),
  S(7, "red deer and roe deer have spread everywhere", "st", "st_deer.1"),
  S(7, "That's one reason why so much of the Highlands looks bare and open", "c", "HkFenceSplit", { props: { title: "same hill, one deer fence", inside: "inside: young pines", outside: "outside: bare", bgIn: "img/hanklynx/b_fenceinside.jpg", bgOut: "img/hanklynx/b_fenceoutside.jpg" } }),
  S(8, "", "av", "av"),
  S(8, "sheep farmers, who are very much against it", "st", "st_sheep.1"),
  S(9, "", "av", "av"),
  // ── LA SUELTA
  S(10, "", "bi", "b_kingussie", { p: BI(`${FARM.split(":")[0]} (Kingussie) on a grey January morning: a quiet main street of grey stone buildings, a few parked cars, frost on the pavement, pine hills behind.`), anim: "a car drives slowly down the street" }),
  S(10, "Somebody filmed one by the side of the road", "bi", "b_phonefilm", { p: BI(`A person's hand holding a phone filming out a car window, the phone screen showing ${LYNX.split(",")[0]} standing in the grass verge by a Highland road.`), anim: "the phone follows the lynx" }),
  S(10, "Animals that had probably been raised in captivity", "av", "av"),
  S(11, "", "c", "FieldNote", { props: { lines: ["4 lynx · 2 pairs", "deliberate, illegal release", "raised around people", "dead of winter · no plan"], bed: "b_crates" } }),
  S(12, "", "bi", "b_rescue", { p: BI(`Two keepers in dark green jackets and a vet carrying a padded animal crate across a snowy field at the edge of a pine forest in the Scottish Highlands, a Land Rover parked behind them.`), anim: "the keepers carry the crate across the field" }),
  S(12, "a lynx on your lawn", "bi", "b_lawnlynx", { p: BI(`${LYNX} standing on a frosty garden lawn behind a grey stone cottage in the Highlands, seen through a kitchen window with a kettle on the sill.`), anim: "the lynx turns its head toward the window" }),
  S(13, "", "c", "HkFourCaught", { props: { title: "four lynx · a few days", labels: ["lynx 1", "lynx 2", "lynx 3", "lynx 4"], lostIndex: 3, lostNote: "died after capture", stamp: "caught", bed: "b_rescue" } }),
  S(14, "", "av", "av"),
];
export const BEDS = [];
