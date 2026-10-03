// DIRECTOR C — la cámara, cómo terminó, el manzano, pregunta de Ruth, cierre (p32-38)
import { S, BI, HZP, COOP, YARD, BARN, KITCHEN, STORE, HENS } from "./dir_lib.mjs";
import { FOUR } from "./dir_a.mjs";
export const SHOTS = [
  S(32, "", "av", "av"),
  S(32, "About two in the morning", "bi", "b_mink", { p: BI("A black-and-white infrared trail camera picture at night with visible sensor noise: a long skinny dark mink with a pointed face slinking along the bottom of a wooden coop wall toward a small vent covered with new wire, a timestamp bar along the bottom reading 02:07 AM."), anim: "the mink slinks along the wall, sniffs the new wire and turns away" }),
  S(32, "sniffed around the new wire for a good minute", "av", "av"),
  S(33, "", "c", "OpCaseLog", { props: { title: "on the trail camera", rows: [{ day: "night 1", n: 0, note: "sniffed, left" }, { day: "night 2", n: 0, note: "came back" }, { day: "night 3", n: 0, note: "never got in" }], every: 30, max: 1, bed: "b_trailcam" } }),
  S(34, "", "av", "av"),
  S(34, "I buried them under the apple tree", "bi", "b_appletree", { p: BI("An old apple tree at the edge of a farm yard in autumn, a few fallen apples in the grass, three small mounds of fresh dirt under it with a little stone on each, soft morning light."), anim: "a few leaves fall slowly from the apple tree" }),
  S(34, "The other hens came back down", "st", "st_hens.3"),
  // ── PREGUNTA DE LA SEMANA
  S(35, "", "av", "av"),
  S(35, "This week it's from Ruth", "c", "OpViewerQ", { props: { name: "Ruth", place: "Tennessee", hens: "11 hens", question: "Should I get a rooster to protect my hens?", bed: "st_rooster.1" } }),
  S(36, "", "st", "st_rooster.2"),
  S(36, "But a rooster won't stop a raccoon", "av", "av"),
  S(36, "A rooster is the alarm bell", "c", "OpSignCard", { props: { bed: "b_rooster", see: "a good rooster", means: "the alarm, not the lock", ok: true } }),
  S(36, "and sometimes fight off a hawk", "st", "st_hawk.3"),
  // ── CIERRE
  S(37, "", "av", "av"),
  S(37, "How many, where, what was eaten", "c", "OpChecklist", { props: { items: FOUR, every: 20, title: "stop, breathe, look", bed: "st_coop.2" } }),
  S(38, "", "av", "av", { ov: { c: "OpSubscribe", props: {} } }),
  S(38, "And tell me in the comments", "av", "av2", { ov: { c: "OpAsk", props: { question: "Where are you — and what predators do you have?" } } }),
  S(38, "I'll see you next week", "bi", "b_safecoop", { p: BI(`${YARD.split(":")[0]} at dusk: the red coop with fresh hardware cloth over its vents and windows, the little hen door closed, a warm light glowing inside, a trail camera on the fence post.`), anim: "the warm light glows as dusk deepens" }),
];
export const BEDS = [
  { name: "b_featherring", p: BI("A circle of plucked reddish-brown feathers on short green grass out in the open of a farm yard in daylight, nothing gory, a fence in the background.") },
  { name: "b_neckfeathers", p: BI("Close view of the back of a reddish-brown hen's neck feathers parted by an older woman's fingers showing two tiny dark puncture marks close together in the skin, nothing gory.") },
  { name: "b_flashlight", p: BI("A small solar-powered red flashing predator deterrent light mounted on a fence post beside a chicken run at dusk, its red light glowing.") },
  { name: "b_scent", p: BI("On a feed store shelf: small bottles of predator urine scent deterrent with plain labels and a price tag $17.99.") },
  { name: "b_rooster", p: BI(`A big red and black rooster standing tall on top of a fence post in ${YARD.split(":")[0]} looking up at the sky, crowing, ${HENS} pecking below.`) },
];
