// DIRECTOR B — rhwasher: por qué apesta (puerta, pliegue, agua, frío, jabón) + la mamá de Mentor + el cajón y su techo (loop 1)
// + CTA 2 + la tapita de abajo y el filtro (loop 2) + nunca mezclar (p16-44).
import { S, BI, RHP, BOTTLE } from "../rhonda/lib.mjs";
import { LAUNDRY, SEAL } from "./dir_a.mjs";
const C = (p, at, name, props = {}, o = {}) => S(p, at, "c", name, { props, ...o });
const I = (n) => `img/rhwasher/${n}.jpg`;
export const SHOTS = [
  // ── 3:09 · por qué apesta
  C(16, "", "RhChapter", { n: 2, title: "Why it stinks", sub: "your grandma's washer never did" }),
  S(16, "A top loader your grandma had", "bi", "b_toploader", { q: "old top loading washer", p: BI("An old white top-loading washing machine with its lid open in a 1970s laundry room.") }),
  S(17, "", "av", ""),
  S(17, "So there's a rubber seal", "bi", "st_washerdoor", { q: "front load washer door", p: BI("The open door of a front-loading washer.") }),
  C(17, "the bottom of that fold is the lowest point", "RhGasketFold3D", { mode: "fold", labels: { fold: "Lowest point", water: "Water sits here" } }),
  S(18, "", "kf", "k_drip", { p: BI(`Close view of water drops running down the inside of a washer door seal and collecting in the bottom fold.`), d1: "drops run down the rubber", d2: "the drops collect in a small puddle in the fold", sound: "water dripping into rubber" }),
  C(18, "And then you shut the door", "RhGasketFold3D", { mode: "closed", labels: { fold: "Dark, warm, wet" } }),
  S(19, "", "av", ""),
  S(19, "and there's food", "bi", "b_residue", { p: BI("Extreme close view of sticky gray detergent and fabric softener residue and lint inside a washer door seal fold."), anim: "the view creeps slowly; nothing else moves" }),
  S(19, "They grow a slimy film", "bi", "b_slimefilm", { p: BI(`Extreme close view of a black slimy film on gray rubber inside the fold of a washer door seal, glistening.`), anim: "the slime glistens as light moves; nothing else moves" }),
  S(20, "", "bi", "b_drum", { q: "washing machine drum inside", p: BI("Looking into the empty stainless steel drum of a front-loading washer, light reflecting on the holes.") }),
  S(20, "Soft, folded, wet and dark", "av", ""),
  S(21, "", "rh", "r_secret", { p: RHP(`She leans in close to the camera in ${LAUNDRY}, holding a towel up, like she is telling a secret.`) }),
  S(21, "Your clothes tumble right past that fold", "bi", "st_tumble", { q: "clothes tumbling washer", p: BI("Clothes tumbling in a washer.") }),
  S(21, "little dark spots on your clothes", "bi", "b_spots", { p: BI("A light blue T-shirt laid out on a folding table with a few small gray-black spots on it after washing."), anim: "the light shifts slowly; nothing else moves" }),
  S(22, "", "av", ""),
  C(22, "Cold water doesn't kill much of anything", "RhCycleThermo", { bed: I("b_laundryroom") }),
  S(22, "the soap that doesn't rinse out", "bi", "b_soapgoo", { p: BI("A detergent jug with a blank label dripping thick blue soap down its side onto the top of a white washer."), anim: "the soap drip creeps down slowly; nothing else moves" }),
  // ── 4:38 · la mamá de Mentor
  S(23, "", "rh", "r_mom", { p: RHP(`She stands in a busy family laundry room in Mentor, Ohio with a tired mom holding a pile of towels, kids' sneakers by the door.`) }),
  S(23, "rewashing her towels three times", "bi", "st_towelpile", { q: "pile of towels laundry", p: BI("A pile of towels in a laundry basket.") }),
  S(23, "She'd bought new towels, twice", "bi", "b_newtowels", { p: BI("Two sets of brand-new folded towels with store tags still on them, stacked on a dryer."), anim: "the light shifts slowly; nothing else moves" }),
  S(24, "", "bi", "b_momstep", { p: BI("A tired mom stepping back in the doorway of a laundry room, hand over her mouth, looking at an open front-loading washer."), anim: "she steps back a little; nothing else moves" }),
  S(24, "there's a sock in there", "bi", "b_sockfilter", { p: BI("A yellow-gloved hand holding up a soggy gray sock just pulled out of a washer drain filter, water dripping into a pan."), anim: "the sock drips; nothing else moves" }),
  S(24, "and she just stood there sniffing them", "rh", "r_momsniff", { p: RHP(`She smiles in a laundry room while a mom holds a fresh towel to her face, eyes closed, delighted.`) }),
  // ── 5:12 · el cajón y su techo (loop 1)
  C(25, "", "RhChapter", { n: 3, title: "The soap drawer", sub: "worse than the fold" }),
  S(26, "", "kf", "k_drawertab", { p: BI("Close view of a finger pressing the release tab in the middle of a washer soap drawer and lifting the drawer out."), d1: "the finger presses the tab", d2: "the drawer lifts out", sound: "a plastic tab click" }),
  S(26, "Check your manual", "bi", "b_manual", { p: BI("An open washing machine owner's manual lying on top of a white dryer, a pencil beside it."), anim: "a page lifts slightly; nothing else moves" }),
  S(27, "", "kf", "k_drawersoak", { p: BI("Close view of a gunky white washer soap drawer sinking into a sink of hot steaming water."), d1: "the drawer goes into the hot water", d2: "steam rises from the sink", sound: "water splashing in a sink" }),
  S(27, "scrub every little corner", "bi", "b_drawerscrub", { p: BI("A yellow-gloved hand scrubbing the corners of a washer soap drawer with an old toothbrush at a sink."), anim: "the toothbrush scrubs a corner; nothing else moves" }),
  C(28, "", "RhDrawerFlashlight", { img: I("b_drawerhole") }),
  S(28, "The water sprays down from up there", "bi", "b_sprayholes", { p: BI("Looking up at the ceiling of a washer soap drawer slot, a row of small water spray holes crusted with black gunk."), anim: "a drop of water forms at one hole; nothing else moves" }),
  S(29, "", "bi", "b_softenercap", { p: BI("A small plastic siphon cap pulled off the fabric softener cup of a washer drawer, a ring of sticky gunk under it, on a paper towel."), anim: "the light shifts slowly; nothing else moves" }),
  S(30, "", "kf", "k_sprayup", { p: BI(`Close view of ${BOTTLE} with a trigger sprayer misting up inside the empty soap drawer slot of a washer.`), d1: "the sprayer mists up into the slot", d2: "the black ceiling turns wet", sound: "a quick spray" }),
  S(30, "You'll be amazed what comes off", "bi", "b_blackcloth", { p: BI("A white cloth held up by a yellow-gloved hand, smeared with black gunk, in front of a washer."), anim: "the cloth sways a little; nothing else moves" }),
  // ── CTA 2
  C(31, "", "RhBookPage", { page: I("book_p13"), stamp: "Page 13" }),
  C(31, "Fix number one is free on the page", "RhQRCard", { qr: I("qr"), cover: I("book_cover") }),
  // ── 6:30 · la tapita de abajo (loop 2)
  C(32, "", "RhChapter", { n: 4, title: "The little door", sub: "at the bottom" }),
  S(33, "", "bi", "b_filterpanel2", { p: BI("The bottom front of a white front-loading washer, its small access panel open showing a round white filter cap and a tiny rubber drain hose."), anim: "light glints slowly; nothing else moves" }),
  S(33, "It catches everything", "av", ""),
  S(34, "", "kf", "k_towelspan", { p: BI("Close view of hands laying old towels on a laundry room floor and sliding a shallow baking pan under the open access panel of a washer."), d1: "the hands lay the towels down", d2: "the pan slides under the little door", sound: "a metal pan sliding on a floor" }),
  S(34, "never do this right after a hot wash", "rh", "r_hotwarn", { p: RHP(`She holds up one yellow-gloved hand in a stop gesture beside a front-loading washer, serious face.`) }),
  S(35, "", "kf", "k_hose", { p: BI("Close view of a hand holding a small rubber drain hose from a washer over a baking pan and pulling off its cap; gray water streams out."), d1: "the cap comes off the little hose", d2: "gray water streams into the pan", sound: "water draining into a metal pan" }),
  C(36, "", "RhPumpFilter", { img: I("b_filterpanel2"), finds: [{ img: I("f_sock"), label: "a sock" }, { img: I("f_coins"), label: "coins" }, { img: I("f_hairties"), label: "hair ties" }, { img: I("f_lint"), label: "lint and hair" }] }),
  S(36, "", "bi", "f_sock", { p: BI("A wet gray sock on a white paper towel, just pulled from a washer filter."), skip: true }),
  S(36, "", "bi", "f_coins", { p: BI("A few wet coins and a button on a white paper towel."), skip: true }),
  S(36, "", "bi", "f_hairties", { p: BI("A small pile of wet hair ties and bobby pins on a white paper towel."), skip: true }),
  S(36, "", "bi", "f_lint", { p: BI("A wet gray clump of lint and hair on a white paper towel."), skip: true }),
  S(36, "rinse it under the faucet", "bi", "b_filterrinse", { p: BI("A washer drain pump filter being rinsed under a running utility sink faucet by a yellow-gloved hand."), anim: "water runs over the filter; nothing else moves" }),
  S(37, "", "rh", "r_tooth", { p: RHP(`She laughs and holds up a tiny object between two gloved fingers next to an open washer filter, amused.`) }),
  S(38, "", "kf", "k_tighten", { p: BI("Close view of a yellow-gloved hand screwing a round white drain filter back into the bottom of a washer, turning it tight."), d1: "the hand turns the filter clockwise", d2: "the filter seats tight", sound: "plastic threads turning" }),
  S(38, "A loose filter is a puddle", "bi", "st_puddle2", { q: "water leak floor", p: BI("Water spreading across a floor.") }),
  S(39, "", "bi", "b_sticker", { p: BI("A model number sticker with blank fields inside the door rim of a white washing machine, a phone camera aimed at it."), anim: "the phone steadies; nothing else moves" }),
  C(40, "", "RhMoldCalendar", { mode: "weekly", img: I("b_sealclean") }),
  // ── 8:09 · nunca mezclar
  C(41, "", "RhChapter", { n: 5, title: "Never mix", sub: "where people get hurt", alert: true }),
  C(42, "", "RhNeverMix", { a: "Bleach", b: "Peroxide", verdict: "Not the same cycle" }),
  C(43, "", "RhNeverMix", { a: "Bleach", b: "Vinegar", verdict: "Chlorine gas" }),
  C(43, "And don't mix peroxide and vinegar", "RhNeverMix", { a: "Peroxide", b: "Vinegar", verdict: "Not in one bottle", soft: true }),
  S(44, "", "bi", "b_manporch", { p: BI("A middle-aged man standing out on a front porch taking deep breaths of fresh air, the front door open behind him."), anim: "he breathes deeply; nothing else moves" }),
  S(44, "He opened that door", "bi", "st_openwin2", { q: "opening window fresh air", p: BI("Opening windows for fresh air.") }),
  S(44, "Nobody got hurt", "av", ""),
];
