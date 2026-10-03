// DIRECTOR A — minuto 1 (la vitrina "tu jubilación") + Hazel + vendido vs pedido + Hummel, Precious Moments,
// porcelana, Waterford (p0-13)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
export const DAUGHTER = "a woman in her late forties with shoulder-length brown hair, a grey cardigan and tired red eyes";
export const CABINET = "a tall dark wood china cabinet with glass doors in an older Midwestern dining room: shelves of Hummel figurines, a cut crystal vase, a stacked set of white bone china with gold rims, and a row of Beanie Babies in little plastic cases";
export const SHOTS = [
  // ── MINUTO 1 (abre con Hazel)
  S(0, "", "av", "av"),
  S(0, "Her mother had passed", "bi", "b_daughterphone", { p: BI(`${DAUGHTER} sitting at a kitchen table in an older Midwestern house, holding a phone to her ear, a tissue in her other hand, a framed photo of an old woman on the table.`), anim: "she wipes her eye while listening on the phone" }),
  S(0, "the china cabinet was her inheritance", "bi", "b_cabinet", { p: BI(`${CABINET}, morning light from a side window.`), anim: "light slides slowly across the glass doors" }),
  S(0, "that's your retirement, honey", "st", "st_figurine.1"),
  S(1, "", "av", "av"),
  S(1, "I had to sit down at her kitchen table", "hz", "h_kitchen", { p: HZP(`She sits across a kitchen table from ${DAUGHTER}, her hand resting gently on the woman's forearm, a notepad between them.`, "an older Midwestern kitchen with flowered wallpaper") }),
  S(1, "worth less than she paid for the gas", "c", "HzWorthNothing", { props: { title: "the china cabinet", price: "less than the gas", note: "to drive over", stamp: "most of it", bed: "b_cabinet" } }),
  S(2, "", "av", "av"),
  S(2, "she almost gave to a neighbor for free", "c", "HzCabinetScale", { props: { title: "the china cabinet vs. the garage", left: [{ label: "Hummels", price: "?" }, { label: "Waterford", price: "?" }, { label: "bone china", price: "?" }, { label: "Beanie Babies", price: "?" }], right: { label: "the thing in the garage", price: "?" }, reveal: false, every: 16, bed: "b_cabinet" } }),
  S(3, "", "av", "av"),
  S(3, "the things people store in the attic for decades", "st", "st_attic.1"),
  S(3, "sold prices, not asking prices", "av", "av"),
  S(3, "Some of these are going to sting a little", "c", "HzRecap", { props: { title: "today", items: ["10 things families think are valuable", "what they REALLY sold for", "the surprise at number 10", "where to sell the good stuff"], every: 24, start: 4, bed: "st_attic.2" } }),
  // ── HAZEL
  S(4, "", "av", "av", { ov: { c: "HzNameTag", props: { name: "Hazel", line: "40 years of estate sales · Ohio" } } }),
  S(4, "at more kitchen tables than I can count", "hz", "h_estatesale", { p: HZP("She stands at a folding table during an estate sale, writing a price on a little white sticker and pressing it onto a teapot, a few shoppers browsing behind her.", HOUSE) }),
  S(5, "", "av", "av"),
  S(5, "use the filter that shows only sold listings", "bi", "b_laptop", { p: BI("An older woman's hands with a thin silver ring on a laptop keyboard on a kitchen table, the screen showing a generic shopping site search results page, a cup of coffee and reading glasses beside it."), anim: "a finger taps the trackpad" }),
  S(5, "The asking prices are just wishes", "c", "HzListedVsSold", { props: { item: "the same Hummel", listed: "$450", sold: "$25", listedLabel: "asking price", soldLabel: "sold price", note: "only the SOLD price is real", bed: "b_laptop" } }),
  // ── 1 HUMMEL
  S(6, "", "c", "HzLotCard", { props: { n: 1, of: 10, title: "Hummel figurines", where: "every grandmother's shelf", bed: "b_hummelshelf" } }),
  S(6, "the boy with the umbrella", "bi", "b_hummelshelf", { p: BI("A shelf in an older living room lined with small German porcelain figurines of rosy-cheeked children: a boy with an umbrella, a girl feeding geese, a boy with a fishing pole, a lace doily under them."), anim: "light shifts across the little figurines" }),
  S(6, "Collectors paid hundreds of dollars", "av", "av"),
  S(7, "", "av", "av"),
  S(7, "far more Hummels for sale", "bi", "b_hummelboxes", { p: BI(`On folding tables in ${HOUSE.split(":")[0]}: dozens and dozens of little porcelain children figurines crowded together, each with a small white price sticker, nobody looking at them.`), anim: "a shopper walks past without stopping" }),
  S(7, "Most common Hummels sell", "c", "HzSoldListings", { props: { title: "Hummels · sold listings", rows: [{ item: "boy with umbrella", price: "$18" }, { item: "girl with geese", price: "$24" }, { item: "lot of 6", price: "$40" }, { item: "large figure, old mark", price: "$150" }], range: "most: $10-50", bed: "b_hummelboxes" } }),
  S(8, "", "av", "av"),
  S(8, "Turn it over and look at the mark", "c", "HzBottomMark", { props: { title: "turn it over", mark: "GOEBEL", sub: "W. Germany", marks: [{ name: "crown mark", years: "oldest", good: true }, { name: "full bee", years: "to late 1950s", good: true }, { name: "stylized bee", years: "later", good: false }, { name: "Goebel Germany", years: "common", good: false }], bed: "b_hummelshelf" } }),
  S(8, "So check the mark, but don't expect a fortune", "hz", "h_mark", { p: HZP("She turns a small porcelain figurine of a girl feeding geese upside down and reads the mark on its base through her reading glasses, eyebrows raised.") }),
  // ── 2 PRECIOUS MOMENTS
  S(9, "", "c", "HzLotCard", { props: { n: 2, of: 10, title: "Precious Moments", where: "still in the box", bed: "b_pmboxes" } }),
  S(9, "almost everybody kept them in the box", "bi", "b_pmboxes", { p: BI("A closet shelf stacked with small white and blue gift boxes, a few open showing small white porcelain figurines of children with big teardrop eyes."), anim: "a hand pulls one box off the stack" }),
  S(9, "Most sell for five to twenty dollars", "c", "HzWorthNothing", { props: { title: "Precious Moments", price: "$5-20", note: "big lots: even less", stamp: "sell as a group", bed: "b_pmboxes" } }),
  S(9, "sell them as a group to one buyer", "av", "av"),
  // ── 3 BONE CHINA
  S(10, "", "c", "HzLotCard", { props: { n: 3, of: 10, title: "fine bone china", where: "the Thanksgiving set", bed: "b_china" } }),
  S(10, "the one that came out only at Thanksgiving", "bi", "b_china", { p: BI("A Thanksgiving dinner table in an older Midwestern dining room set with white bone china plates with gold rims, cut crystal glasses and cloth napkins, a turkey platter in the middle."), anim: "a hand sets down the last plate" }),
  S(10, "This is the one that breaks hearts", "av", "av"),
  S(10, "can't put in the dishwasher or the microwave", "st", "st_dishes.1"),
  S(10, "A full service of common bone china", "c", "HzSoldListings", { props: { title: "bone china · sold listings", rows: [{ item: "service for 12, common", price: "$180" }, { item: "service for 8", price: "$95" }, { item: "dinner plate", price: "$4" }, { item: "cup + saucer", price: "$3" }], range: "a few hundred at most", bed: "b_china" } }),
  S(11, "", "av", "av"),
  S(11, "companies that buy and sell replacement china", "st", "st_dishes.2"),
  S(11, "Look on the back of a plate", "hz", "h_plateback", { p: HZP("She holds a white china plate with a gold rim up and turns it over, pointing to the maker's name printed on the back.") }),
  // ── 4 WATERFORD
  S(12, "", "c", "HzLotCard", { props: { n: 4, of: 10, title: "Waterford crystal", where: "the wedding gift", bed: "b_waterford" } }),
  S(12, "Waterford was expensive when it was new", "bi", "b_waterford", { p: BI(`A heavy cut crystal vase and a cut crystal bowl on a lace runner on top of ${CABINET.split(":")[0]}, sparkling in window light.`), anim: "sparkles move across the cut crystal" }),
  S(12, "sell for twenty to sixty dollars", "c", "HzPriceTag", { props: { front: "$250", frontNote: "in the store", sold: "$20-60", soldLabel: "sold listings", item: "cut crystal vase", stamp: "today", bed: "b_waterford" } }),
  S(12, "most don't come close", "av", "av"),
  S(13, "", "bi", "b_etch", { p: BI(`Close view: an older woman's hands holding a cut crystal vase upside down against a bright window, tilting it to find a very faint etched mark on the bottom.`), anim: "the vase tilts slowly in the window light" }),
  S(13, "Then check those sold listings", "av", "av"),
];
export const BEDS = [];
