// DIRECTOR A — minuto 1 (camino de Grand County, vacas y lobos) + Hank + la historia (exterminio, Yellowstone, la
// votación 114 partida por la montaña, el ranchero) + la suelta + collares + cachorros (p0-17)
import { S, BI, HZP, ROAD, RANCH, FARM, COAST, FOREST, AXIS } from "./dir_lib.mjs";
export const WOLVES = AXIS;
export const RANCHER = "a weathered white rancher in his sixties with a grey mustache, a sweat-stained felt cowboy hat and a canvas ranch coat";
export const SHOTS = [
  // ── MINUTO 1 (abre con Hank)
  S(0, "", "av", "av"),
  S(0, "there's frost on the sagebrush", "bi", "b_frost", { p: BI(`Close view of frost-covered grey-green sagebrush beside ${ROAD.split(":")[0]} at sunrise, black cattle small in the pasture below.`), anim: "the sun slowly lights the frost" }),
  S(0, "Cattle. Hundreds of them", "st", "st_cattle.1"),
  S(0, "Wild gray wolves", "bi", "b_wolfridge", { p: BI(`Two ${WOLVES} standing on a snowy sagebrush ridge in the Colorado Rockies at dawn, looking down toward a valley, seen from far away through a long lens.`), anim: "one wolf turns its head toward the valley" }),
  S(1, "", "av", "av"),
  S(1, "The voters", "st", "st_vote.1"),
  S(1, "some folks can hear them howling at night", "bi", "b_ranchnight", { p: BI(`A ranch house in ${RANCH.split(":")[0]} at night under a full moon, one porch light on, snowy mountains faintly visible, a man standing on the porch listening.`), anim: "the man turns his head toward the hills" }),
  S(2, "", "st", "st_wolf.1"),
  S(2, "They killed cattle", "bi", "b_rancherfence", { p: BI(`${RANCHER} standing at a barbed wire fence in a frosty pasture looking out at his black cattle, jaw set, a pickup truck behind him.`), anim: "the rancher grips the fence post" }),
  S(2, "catch an entire wolf family, and take it off the land", "c", "ElLabelLine", { props: { line: "the state's own wolves", means: "caught and removed", good: false, bed: "b_wolfridge" } }),
  S(3, "", "av", "av"),
  S(3, "the ranchers losing animals", "st", "st_cattle.2"),
  S(3, "I drove out here to find out", "hz", "h_truck", { p: HZP("He leans on the open door of his old pickup truck parked on the gravel road, looking out over the pasture with binoculars in one hand, then lowers them and looks at the camera.") }),
  // ── HANK
  S(4, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Hank", line: "just a guy from Louisiana with questions" } } }),
  S(4, "And this one has been eating at me", "c", "HkFenceSplit", { props: { title: "two sides of the same fence", inside: "the ranchers", outside: "the wolf supporters", bgIn: "img/hankwolf/b_rancherfence.jpg", bgOut: "img/hankwolf/b_wolfridge.jpg" } }),
  // ── LA HISTORIA
  S(5, "", "av", "av"),
  S(5, "Gray wolves lived all over the American West", "st", "st_wolf.2"),
  S(5, "Trapping, poison, bounties", "c", "FieldNote", { props: { lines: ["about 100 years of:", "trapping · poison · bounties", "by the 1940s: gone from Colorado"], bed: "st_mountains.1" } }),
  S(6, "", "st", "st_yellowstone.1"),
  S(6, "flown in from Canada", "c", "ElCoolerBoard", { props: { title: "the road back", rows: [{ item: "1940s · gone from Colorado" }, { item: "1990s · Yellowstone, ~31 from Canada" }, { item: "today · across the Northern Rockies", hi: true }], every: 30, bed: "st_yellowstone.2" } }),
  S(7, "", "av", "av"),
  S(7, "We've got the elk and the deer", "st", "st_elk.1"),
  // ── LA VOTACIÓN
  S(8, "", "av", "av"),
  S(8, "Proposition one fourteen", "c", "DocHighlighter", { props: { source: "Colorado ballot · November 2020", lines: ["~", "Proposition 114", "Restoration of Gray Wolves", "west of the Continental Divide", "~"], highlight: [1, 3], kicker: "on the ballot" } }),
  S(8, "Fifty point nine percent to forty nine point one", "c", "HkBallotMap", { props: { title: "Proposition 114 · 2020", yes: 50.9, no: 49.1 } }),
  S(10, "", "bi", "b_rancher", { p: BI(`${RANCHER} leaning on a wooden corral gate at ${RANCH.split(":")[0]}, talking with someone just off camera, early light.`), anim: "the rancher gestures toward the hills" }),
  S(10, "people who'll never see a wolf", "av", "av"),
  S(10, "The way it got here", "bi", "b_rancher2", { p: BI(`Close view of ${RANCHER} looking away toward the mountains, squinting, a cattle dog sitting by his boots.`), anim: "the dog looks up at him" }),
  // ── LA SUELTA
  S(11, "", "av", "av"),
  S(11, "how to pay ranchers back for losses", "st", "st_meeting.1"),
  S(11, "right before Christmas, they did it", "bi", "b_crates", { p: BI(`Aluminum animal transport crates set in a row on deep snow in ${FOREST.split(":")[0]}, wildlife officers in winter gear standing beside them, pine trees, grey light.`), anim: "an officer reaches for a crate door" }),
  S(12, "", "bi", "b_release", { p: BI(`A big gray wolf standing for a second in the open door of an aluminum transport crate on snow in ${FOREST.split(":")[0]}, seen from a distance.`), anim: "the wolf steps out and bounds away into the snow" }),
  S(12, "and then ran off into the snow", "st", "st_wolfsnow.1"),
  S(12, "Colorado had wolves again", "av", "av"),
  S(13, "", "c", "ElCoolerBoard", { props: { title: "the releases", rows: [{ item: "Dec 2023 · 10 wolves from Oregon" }, { item: "Grand + Summit counties" }, { item: "2025 · 15 more from Canada (B.C.)", hi: true }], every: 30, bed: "b_crates" } }),
  // ── COLLARES
  S(14, "", "c", "HkCollarTrack", { props: { title: "every wolf wears a GPS collar", release: "release site", note: "ranchers check the map like the weather", wanderer: "hundreds of miles" } }),
  S(14, "Ranchers check those maps", "bi", "b_phonemap", { p: BI(`A rancher's weathered hands holding a phone over the steering wheel of a pickup truck, the screen showing a simple map with shaded areas, a frosty pasture through the windshield.`), anim: "a thumb scrolls the map" }),
  S(15, "", "av", "av"),
  S(15, "They had pups", "bi", "b_pups", { p: BI("Three fluffy gray wolf pups tumbling together outside a den dug into a sagebrush hillside, early summer grass, seen from far away through a long lens."), anim: "the pups wrestle and roll" }),
  S(16, "That was the first litter", "c", "ElLabelLine", { props: { line: "first pups in ~80 years", means: "the Copper Creek pack", good: true, bed: "b_pups" } }),
  S(17, "", "st", "st_wolf.3"),
];
export const BEDS = [];
