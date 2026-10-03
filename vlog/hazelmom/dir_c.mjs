// DIRECTOR C — lo que NO vale, dónde vender, desenlace de la caja de Columbus, regla, CTA (p27-36)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
import { ITEMS10 } from "./dir_a.mjs";
export const SHOTS = [
  S(27, "", "av", "av"),
  S(27, "The good china", "c", "HzWorthNothing", { props: { bed: "b_china", img: "b_china", title: "the good china", price: "very little", note: "check a replacement service first" } }),
  S(27, "Replacement services buy some patterns", "st", "st_china.1"),
  S(28, "", "c", "HzWorthNothing", { props: { bed: "b_figurines", img: "b_figurines", title: "figurines & collector plates", price: "a few dollars each", note: "the kids don't want them" } }),
  S(29, "", "st", "st_magazines.1"),
  S(29, "and the big wooden furniture", "c", "HzWorthNothing", { props: { bed: "b_brownfurniture", img: "b_brownfurniture", title: "brown furniture", price: "hard to sell", note: "donate it, don't feel bad" } }),
  S(29, "Donate it, or give it to family", "st", "st_furniture.1"),
  // ── DÓNDE VENDER
  S(30, "", "av", "av"),
  S(30, "Get two or three to come look", "c", "HzWhereToSell", { props: { item: "A whole houseful", routes: [{ name: "Estate sale company", take: "often ~1/3 · ask what's left over" }, { name: "Collectors / auction house", take: "the special pieces" }, { name: "Sold listings first", take: "know what you hold" }], best: 0, stamp: "get 2-3 quotes", bed: "st_estate.1" } }),
  S(30, "Ask what they do with what doesn't sell", "av", "av"),
  S(31, "", "av", "av"),
  S(31, "And always check the sold listings first", "st", "st_laptop.2"),
  S(31, "to collectors or through an auction house", "av", "av"),
  // ── DESENLACE
  S(32, "", "bi", "b_sorted", { p: BI("On a kitchen table: dozens of heavy colorful Bakelite buttons sorted out from a big pile of plain ones, an old cookie tin beside, an older woman's fingers sliding a carved cherry-red button into the Bakelite pile."), anim: "the fingers slide another red button into the sorted pile" }),
  S(32, "Those sold as a lot online", "c", "HzPriceTag", { props: { bed: "b_sorted", front: "trash", frontNote: "where it was going", sold: "$200+", soldLabel: "sold as a lot", item: "about forty Bakelite buttons", flipAt: 40, stamp: "sold" } }),
  S(32, "The mixing bowls were a set of three", "c", "HzPriceTag", { props: { bed: "b_pyrexshelf", front: "trash", frontNote: "where they were going", sold: "about $150", soldLabel: "sold", item: "three bright mixing bowls", flipAt: 36, stamp: "sold" } }),
  S(32, "mixed in with hundreds of ordinary ones", "st", "st_buttons.4"),
  S(33, "", "av", "av"),
  S(33, "the man's son asked if he could have them", "bi", "b_soldier", { p: BI("A young man in his twenties in a plain military t-shirt sitting at a kitchen table carefully holding an old medal with a faded ribbon, looking at it quietly, an old black-and-white soldier photo and a velvet case on the table."), anim: "the young man turns the medal over in his fingers" }),
  S(33, "His great-grandfather's medals are hanging on his wall", "bi", "b_shadowbox", { p: BI("A wooden shadow box frame hanging on a living room wall holding old military medals with ribbons, a few patches and a black-and-white photo of a young soldier, warm lamp light."), anim: "the lamp light shifts slightly across the shadow box glass" }),
  S(34, "", "c", "HzLotVsPiece", { props: { lotLabel: "the dumpster", lotPrice: "$0", pieces: [{ label: "buttons", price: "$200+" }, { label: "bowls", price: "~$150" }, { label: "the medals", price: "priceless" }], total: "check first", leftTitle: "where it was going", rightTitle: "what it was", every: 20, bed: "b_boxtrash" } }),
  S(34, "That's why I tell you, check first", "av", "av"),
  S(35, "", "c", "HzRuleCard", { props: { rule: "Never sell on day one.", lines: ["And never throw away on day one either."], every: 50, bed: "b_boxtrash" } }),
  S(36, "", "av", "av", { ov: { c: "HzSubscribe", props: { line: "don't throw away what you can't get back" } } }),
  S(36, "And tell me in the comments", "av", "av2", { ov: { c: "HzAsk", props: { question: "What are you afraid of throwing away by mistake?" } } }),
];
export const BEDS = [
  { name: "b_china", p: BI(`A dining table in ${HOUSE.split(":")[0]} covered with a complete white and gold china dinner set, stacks of plates, cups and a gravy boat, a handwritten sign reading $40 for all.`) },
  { name: "b_figurines", p: BI("A shelf of porcelain figurines of children and decorative collector plates on stands with their certificates, on an estate sale table with small price stickers reading $2 and $5.") },
  { name: "b_brownfurniture", p: BI(`A big dark wooden bedroom set, a heavy dresser with mirror and a matching china cabinet, standing in an emptying room of ${HOUSE.split(":")[0]} with a sign reading Make an offer.`) },
  { name: "b_records", p: BI("A wooden crate of old vinyl record albums on a living room floor, worn sleeves of easy listening and Christmas orchestra albums, a price sign reading 50 cents each.") },
];
