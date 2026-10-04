// DIRECTOR B — el oro (sellos, enchapado, sin sello), el reloj de bolsillo, las cucharas coin silver, las perlas,
// el anillo con diamante old mine (p17-39)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
import { BOX, HKITCHEN } from "./dir_a.mjs";
export const SHOTS = [
  // ── EL ORO
  S(17, "", "av", "av"),
  S(18, "", "bi", "b_chains", { p: BI("On black velvet: several old gold-colored chains laid out side by side, a thick watch chain, a delicate locket on a chain and a thin plain chain, a loupe beside them."), anim: "a hand straightens one of the chains" }),
  S(19, "", "c", "HzGoldStamps", { props: { title: "what the stamp means", rows: [{ stamp: "14K", means: "solid gold", gold: 0.58, tag: "also 417 · 585 · 750" }, { stamp: "GF", means: "gold filled", gold: 0.05, tag: "a thin layer bonded on" }, { stamp: "GP", means: "gold plated", gold: 0.005, tag: "almost no gold" }, { stamp: "—", means: "no stamp?", gold: 0, tag: "old pieces: have it tested" }], every: 40, bed: "b_chains" } }),
  S(20, "", "st", "st_jewelry.2"),
  S(21, "", "av", "av"),
  S(21, "take it to a jeweler and ask them to test it", "bi", "b_jeweler", { p: BI("A jeweler in her forties behind a glass counter in a small-town jewelry store, testing a thin gold chain with an electronic gold tester, a customer's hands resting on the counter."), anim: "the jeweler touches the tester to the chain" }),
  S(22, "", "c", "HzLotVsPiece", { props: { leftTitle: "what it looked like", rightTitle: "what it was", lotLabel: "a tangle of chains", lotPrice: "junk?", pieces: [{ label: "watch chain · GF", price: "collector" }, { label: "locket · 14K", price: "gold value +" }, { label: "plain chain · no stamp", price: "10K (tested)" }], total: "real gold inside", bed: "b_chains" } }),
  // ── EL RELOJ
  S(23, "", "bi", "b_watch", { p: BI("On black velvet: an antique gold-colored pocket watch with a white enamel face, black Roman numerals and a tiny second hand at the bottom, its chain coiled beside it."), anim: "light moves slowly across the watch face" }),
  S(24, "", "av", "av"),
  S(24, "Open the back of the case carefully", "hz", "h_watch", { p: HZP("She opens the back case of an antique pocket watch with her thumbnail and squints at the engraved name and serial number inside through a loupe.") }),
  S(24, "the words guaranteed twenty years, which means gold filled", "c", "HzBottomMark", { props: { title: "open the back", mark: "WALTHAM", sub: "No. 1234567", marks: [{ name: "a maker + serial", years: "look it up", good: true }, { name: "14K inside the case", years: "solid gold", good: true }, { name: "guaranteed 20 years", years: "gold filled", good: false }] } }),
  S(25, "", "c", "HzSoldListings", { props: { title: "pocket watches · sold", rows: [{ item: "gold filled case, ordinary", price: "$50-200" }, { item: "solid gold case", price: "gold value +" }, { item: "railroad-grade movement", price: "much more" }], range: "don't open it with a kitchen knife", bed: "b_watch" } }),
  S(26, "", "av", "av"),
  // ── LAS CUCHARAS
  S(27, "", "bi", "b_spoons", { p: BI("A small faded cloth pouch on a kitchen table with five old thin-handled silver spoons spilling out, a name engraved on each handle in old script."), anim: "a hand fans the spoons out" }),
  S(28, "", "av", "av"),
  S(28, "about ninety percent silver", "c", "HzRuleCard", { props: { eyebrow: "coin silver", rule: "melted-down silver coins, made into spoons", lines: ["about 90% silver", "marked COIN or a silversmith's name", "known makers sell above melt"], stamp: "look for COIN", bed: "b_spoons" } }),
  S(29, "", "st", "st_silver.1"),
  // ── LAS PERLAS
  S(30, "", "bi", "b_pearls", { p: BI("Close view on black velvet of a delicate antique strand of tiny seed pearls, some slightly uneven, coiled in a soft spiral."), anim: "the light glows softly on the pearls" }),
  S(31, "", "hz", "h_pearls", { p: HZP("She gently rubs a tiny pearl against the edge of her front teeth, eyes up in concentration, holding the strand in her other hand.", HKITCHEN) }),
  S(31, "A fake pearl, made of glass or plastic, feels smooth", "c", "HzEdgeCompare", { props: { title: "the tooth test", left: "real · a little gritty", right: "fake · smooth and slippery", bed: "b_pearls" } }),
  S(32, "", "av", "av"),
  // ── EL ANILLO
  S(33, "", "av", "av"),
  S(34, "", "bi", "b_lining", { p: BI(`Close view inside ${BOX}: a loose corner of faded red velvet lining lifted up by a fingertip, and underneath it a tiny thin gold ring with one stone.`), anim: "the finger lifts the velvet corner" }),
  S(34, "it threw little flashes of color, like a tiny fire", "bi", "b_ring", { p: BI("Extreme close view of an antique thin gold ring with one cushion-shaped old mine cut diamond under a desk lamp, throwing little rainbow flashes."), anim: "the ring turns slowly and sparkles" }),
  S(35, "", "av", "av"),
  S(36, "", "bi", "b_microscope", { p: BI("A jeweler looking into a gemological microscope at an antique ring held in tweezers, in the back room of a small jewelry store."), anim: "the jeweler adjusts the focus" }),
  S(36, "Jewelers call it an old mine cut", "c", "HzRing3D", { props: { mark: "old mine", sub: "cut by hand", line1: "a real diamond", line2: "1800s · ~½ carat", title: "under the microscope" } }),
  S(37, "", "c", "HzPriceTag", { props: { front: "$20", frontNote: "the whole box", sold: "~$1,000+", soldLabel: "the ring alone", item: "old mine cut diamond ring", stamp: "under the lining", bed: "b_ring" } }),
  S(38, "", "av", "av"),
  S(39, "", "av", "av"),
  S(39, "lift the lining", "c", "HzRuleCard", { props: { eyebrow: "Hazel's rule", rule: "never sell a jewelry box unopened", lines: ["lift the lining", "check every compartment", "look for a hidden drawer"], stamp: "old ladies hid their best things", bed: "b_lining" } }),
];
export const BEDS = [];
