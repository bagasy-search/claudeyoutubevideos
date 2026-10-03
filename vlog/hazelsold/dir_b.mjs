// DIRECTOR B — Beanie Babies, enciclopedias, piano, National Geographic, platos de colección, tres más
// (vidrio Depression, bijou, colchas, Singer) (p14-27)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
export const SHOTS = [
  // ── 5 BEANIE BABIES
  S(14, "", "c", "HzLotCard", { props: { n: 5, of: 10, title: "Beanie Babies", where: "in little plastic cases", bed: "b_beanies" } }),
  S(14, "Somebody listed it for ten thousand dollars", "c", "HzListedVsSold", { props: { item: "that famous bear", listed: "$10,000", sold: "$5", note: "listed is not sold", bed: "b_beanies" } }),
  S(14, "Look at the sold listings", "av", "av"),
  S(14, "A big bag of them often goes for twenty dollars", "bi", "b_beanies", { p: BI("A big clear plastic storage bin overflowing with small plush beanbag animals with heart-shaped tags, some in little clear plastic tag protectors, on a carpeted floor."), anim: "a hand lifts a plush bear out of the bin" }),
  S(15, "", "hz", "h_beanies", { p: HZP("She holds up a small plush beanbag bear in a little plastic case, gives the camera a sympathetic little shrug and a half smile.") }),
  // ── 6 ENCYCLOPEDIAS
  S(16, "", "c", "HzLotCard", { props: { n: 6, of: 10, title: "encyclopedias & book sets", where: "the gold lettering", bed: "b_encyclo" } }),
  S(16, "The leather-looking set of encyclopedias", "bi", "b_encyclo", { p: BI("A long row of matching burgundy encyclopedia volumes with gold lettering on a bookcase in an older living room, next to a row of condensed book volumes."), anim: "light moves along the gold spines" }),
  S(16, "box after box", "bi", "b_bookboxes", { p: BI(`Cardboard boxes full of matching encyclopedia volumes stacked by the curb in front of an older Ohio house, a hand-written sign taped on one box.`), anim: "a man sets down another box on the stack" }),
  S(16, "Most book dealers won't take them", "av", "av"),
  S(17, "", "st", "st_books.1"),
  S(17, "has an author's signature", "st", "st_books.2"),
  S(17, "use them to prop up a wobbly table like I do", "hz", "h_wobbly", { p: HZP("She slides a thick old encyclopedia volume under the short leg of a small wooden side table and pushes on the table top to test it, grinning at the camera.") }),
  // ── 7 PIANO
  S(18, "", "c", "HzLotCard", { props: { n: 7, of: 10, title: "the old upright piano", where: "the living room wall", bed: "b_piano" } }),
  S(18, "a piano feels like it must be worth something", "bi", "b_piano", { p: BI("An old dark wood upright piano against a flowered wallpaper wall in an older Midwestern living room, family photos and a doily on top, sheet music on the stand."), anim: "light moves slowly across the piano lid" }),
  S(19, "", "av", "av"),
  S(19, "pay someone to haul them away", "bi", "b_pianomove", { p: BI("Two movers in work gloves rolling an old upright piano on a dolly down a short ramp from the front porch of an older house to a box truck."), anim: "the movers ease the piano down the ramp" }),
  S(19, "A free piano listed online", "c", "HzPriceTag", { props: { front: "$2,800", frontNote: "what it cost new", sold: "FREE", soldLabel: "and still no taker", item: "old upright piano", stamp: "or pay to haul", bed: "b_piano" } }),
  S(19, "find a church, a school, or a young family", "st", "st_piano.1"),
  // ── 8 NATIONAL GEOGRAPHIC
  S(20, "", "c", "HzLotCard", { props: { n: 8, of: 10, title: "National Geographic", where: "the yellow spines", bed: "b_natgeo" } }),
  S(20, "The yellow spines lined up on the bookshelf", "bi", "b_natgeo", { p: BI("Shelves completely filled with decades of yellow-spined magazines lined up neatly in a basement den with wood paneling."), anim: "a finger runs along the yellow spines" }),
  S(20, "Most sell for a dollar or less each", "c", "HzWorthNothing", { props: { title: "yellow magazines", price: "$1 or less", note: "each, if they sell", stamp: "printed by the million", bed: "b_natgeo" } }),
  // ── 9 COLLECTOR PLATES
  S(21, "", "c", "HzLotCard", { props: { n: 9, of: 10, title: "collector plates", where: "with a certificate", bed: "b_plates" } }),
  S(21, "with a painting of a lighthouse", "bi", "b_plates", { p: BI("A wall in an older dining room hung with a dozen decorative collector plates on wire hangers, each painted with a lighthouse, a country barn, a little girl with a puppy, a covered bridge."), anim: "light slides across the painted plates" }),
  S(21, "Here's the thing about limited editions", "c", "HzRuleCard", { props: { eyebrow: "Hazel's rule", rule: "\"limited edition\" = limited to whoever ordered", lines: ["most sell for a few dollars", "the certificate adds nothing"], stamp: "not worth it", bed: "b_plates" } }),
  // ── TRES MÁS
  S(22, "", "av", "av"),
  S(23, "", "bi", "b_depression", { p: BI("Pink and pale green pressed glass dishes, a cake plate and a little candy dish with a lid, on a windowsill in an older kitchen, sunlight shining through the colored glass."), anim: "sunlight glows through the pink glass" }),
  S(23, "Most common pieces sell for five to twenty five dollars", "c", "HzSoldListings", { props: { title: "pink & green glass · sold", rows: [{ item: "sherbet dish", price: "$6" }, { item: "dinner plate", price: "$12" }, { item: "cake plate", price: "$25" }, { item: "rare pattern set", price: "more" }], range: "most: $5-25", bed: "b_depression" } }),
  S(23, "tiny bubbles and slight wobbles", "hz", "h_bubbles", { p: HZP("She holds a pink glass dish up to the tall window and squints through it with a jeweler's loupe, looking for tiny bubbles.") }),
  S(24, "", "bi", "b_jewelrybox", { p: BI(`An open old jewelry box on a dresser spilling big rhinestone brooches, strands of fake pearls and clip-on earrings, on a lace doily.`), anim: "a hand stirs through the sparkling jewelry" }),
  S(24, "turn every piece over and look for a name", "c", "HzBottomMark", { props: { title: "turn every piece over", mark: "signed", sub: "on the clasp", marks: [{ name: "a maker's name", years: "real money", good: true }, { name: "14K · sterling · 925", years: "sells by weight", good: true }, { name: "no mark at all", years: "a few dollars", good: false }], bed: "b_jewelrybox" } }),
  S(25, "", "bi", "b_quilt", { p: BI(`An old hand-stitched quilt in faded reds and blues folded over the back of a wooden rocking chair by a window in an older bedroom.`), anim: "a breeze moves the curtain beside the quilt" }),
  S(25, "Look at the back", "bi", "b_quiltback", { p: BI("Close view of the back of an old quilt held in an older woman's hands, rows of tiny even hand stitches visible in window light."), anim: "fingers trace the tiny stitches" }),
  S(25, "Keep it out of the sun", "av", "av"),
  S(26, "", "st", "st_sewing.1"),
  S(26, "Read the serial number before you sell", "av", "av"),
  S(27, "", "av", "av"),
];
export const BEDS = [];
