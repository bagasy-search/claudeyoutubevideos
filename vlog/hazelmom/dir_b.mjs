// DIRECTOR B — ítems 5-10 (Navidad, colchas, discos, juguetes, platería, papeles) (p16-26)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
export const SHOTS = [
  S(16, "", "c", "HzLotCard", { props: { n: 5, of: 10, title: "Christmas boxes", where: "the attic", bed: "st_grandma.1" } }),
  S(16, "Old glass ornaments", "bi", "b_ornaments", { p: BI("An old cardboard box of vintage glass Christmas ornaments from the 1950s opened in a dusty attic: rows of shiny round balls in faded pinks, blues and silvers with original metal caps, the printed box lid beside it."), anim: "an older woman's hand lifts one shiny ornament from the box" }),
  S(16, "A box of a dozen common ones", "c", "HzSoldListings", { props: { title: "Sold — vintage ornaments", rows: [{ item: "Box of a dozen common ones", price: "$20–60" }, { item: "Old hand-blown, unusual shapes", price: "more" }], every: 60, range: "sell in the fall", bed: "st_grandma.2" } }),
  S(16, "Old light-up decorations", "st", "st_ornaments.1"),
  S(16, "especially the ones still in their original boxes", "st", "st_ornaments.2"),
  S(17, "", "bi", "b_ornamentclose", { p: BI("Macro view of a thin, slightly worn vintage glass Christmas ornament with its original thin metal hanger, held up between an older woman's fingers against a window."), anim: "the ornament turns slowly on its hanger catching the light" }),
  S(17, "Sell them in the fall", "av", "av"),
  // ── 6 · COLCHAS
  S(18, "", "c", "HzLotCard", { props: { n: 6, of: 10, title: "The quilts", where: "the cedar chest", bed: "st_quilt2.1" } }),
  S(18, "A handmade quilt", "bi", "b_quilt", { p: BI(`An old cedar chest opened at the foot of a bed in ${HOUSE.split(":")[0]}, a handmade patchwork quilt in faded calico colors being lifted out and unfolded by an older woman's hands.`), anim: "the hands unfold the old quilt" }),
  S(18, "Look at the stitching", "hz", "h_stitch", { p: HZP("She examines the stitching of an old patchwork quilt spread on a bed through her reading glasses, running her fingertip along a line of small hand stitches.", HOUSE) }),
  S(18, "Machine quilting is perfectly even", "c", "HzMagnetTest", { props: { title: "look at the stitching", left: { label: "hand quilted", sticks: true, verdict: "small, uneven stitches" }, right: { label: "machine", sticks: false, verdict: "perfect long lines" }, bed: "b_quilt" } }),
  S(18, "can sell for a hundred dollars", "av", "av"),
  S(19, "", "av", "av"),
  S(19, "And never wash an old quilt", "av", "av"),
  // ── 7 · DISCOS
  S(20, "", "c", "HzLotCard", { props: { n: 7, of: 10, title: "The records", where: "the hi-fi cabinet", bed: "st_recordstore.1" } }),
  S(20, "Most old record albums sell for a dollar or two", "c", "HzWorthNothing", { props: { bed: "b_records", img: "b_records", title: "most old records", price: "$1–2", note: "easy listening, Christmas, big orchestras" } }),
  S(21, "", "st", "st_records.1"),
  S(21, "Check the condition first", "bi", "b_recordlight", { p: BI("An older woman's hands holding a black vinyl record by its edges up to a window, checking the grooves for scratches, the paper sleeve under her arm, an old wooden hi-fi cabinet behind."), anim: "the hands tilt the record in the light" }),
  S(21, "have a local record store look at it", "st", "st_turntable.1"),
  S(21, "early rock and roll, blues, jazz", "st", "st_turntable.2"),
  S(21, "can bring fifty, a hundred", "av", "av"),
  S(21, "If it's scratched and dull", "st", "st_records.2"),
  // ── 8 · JUGUETES
  S(22, "", "c", "HzLotCard", { props: { n: 8, of: 10, title: "The toys", where: "the attic", bed: "st_garage.1" } }),
  S(22, "Tin toys, old board games", "bi", "b_toys", { p: BI("A dusty attic floor with an open cardboard box of old toys from the 1950s to 1970s: a tin wind-up robot, a boxed board game, a small toy train, action figures in a shoebox, morning light from a small window."), anim: "a hand lifts the tin robot out of the box" }),
  S(22, "and the action figures your brother kept", "st", "st_toys.1"),
  S(23, "", "c", "HzLotVsPiece", { props: { lotLabel: "loose", lotPrice: "$", pieces: [{ label: "in its original box", price: "several times more" }], total: "the box matters", leftTitle: "toy alone", rightTitle: "toy + box", bed: "b_toys" } }),
  S(23, "can be worth several times", "av", "av"),
  // ── 9 · PLATERÍA
  S(24, "", "c", "HzLotCard", { props: { n: 9, of: 10, title: "The silverware drawer", where: "the dining room", bed: "b_forks" } }),
  S(24, "Turn over a fork", "c", "HzHallmark3D", { props: { stamp: "STERLING", sub: "925", verdict: "solid silver", good: true, title: "turn it over" } }),
  S(24, "If it says silverplate, or EPNS", "bi", "b_forks", { p: BI("A kitchen drawer pulled open full of mixed silverware, an older woman's hand holding one fork turned over showing a tiny stamped mark on the back of the handle, everyday steel knives mixed in."), anim: "the hand turns the fork to show the stamp" }),
  S(24, "Families throw sterling away", "st", "st_silverware.1"),
  // ── 10 · PAPELES
  S(25, "", "c", "HzLotCard", { props: { n: 10, of: 10, title: "The paper", where: "every box of it", bed: "st_oldphotos.1" } }),
  S(25, "But old envelopes with the stamps still on them", "bi", "b_letters", { p: BI("A shoebox of old letters and envelopes from the 1920s on a table, faded stamps and postmarks, a few tied with ribbon, an older woman's fingers sorting them."), anim: "the fingers fan through the old envelopes" }),
  S(25, "especially from before the nineteen thirties", "st", "st_letters.2"),
  S(25, "like a savings bond nobody cashed", "bi", "b_bond", { p: BI("An old coffee can in a basement holding folded vintage paper savings bonds and documents, an older woman's hand pulling one bond out and unfolding it."), anim: "the hand unfolds the old savings bond" }),
  S(26, "", "av", "av"),
  S(26, "I've seen families find uncashed savings bonds", "st", "st_letters.1"),
];
