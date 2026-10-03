// DIRECTOR C — dónde vender + fotos + cuidado + el dealer + desenlace de June + regla + CTA (p31-44)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
import { TESTS } from "./dir_a.mjs";
export const SHOTS = [
  S(31, "", "av", "av"),
  S(31, "the best place is usually a regional auction house", "st", "st_auction.3"),
  S(31, "Expect them to take a commission", "c", "HzWhereToSell", { props: { item: "A good cut glass piece", routes: [{ name: "Regional auction house", take: "often ~25%, ask first" }, { name: "Collectors' club & shows", take: "they pay for quality" }, { name: "Online, sold listings", take: "check the real number" }], best: 0, stamp: "start here", bed: "st_auction.4" } }),
  S(31, "They know the collectors", "st", "st_magnifier.2"),
  S(32, "", "bi", "b_show", { p: BI(`A cut glass collectors' show in a hotel ballroom: long tables draped in black cloth covered with sparkling antique cut glass bowls, pitchers and vases, older collectors with loupes examining pieces, bright lights.`), anim: "a collector lifts a sparkling pitcher and turns it under the lights" }),
  S(32, "and they'll pay for quality", "av", "av"),
  S(32, "Those folks know exactly", "st", "st_antiques.4"),
  S(33, "", "st", "st_laptop.1"),
  S(33, "Not the asking prices, the sold ones", "c", "HzSoldListings", { props: { title: "Sold, not asking", rows: [{ item: "Search the maker", price: "Libbey bowl" }, { item: "Or the pattern", price: "hobstar" }, { item: "Filter: sold items", price: "✓" }], every: 26, bed: "st_laptop.2" } }),
  S(34, "", "hz", "h_photo", { p: HZP("She photographs a sparkling cut glass bowl set on a black velvet cloth by the window with an old digital camera, crouching slightly to get the angle.") }),
  S(34, "And always show the signature", "bi", "b_showflaw", { p: BI(`An older woman's hand pointing at a tiny chip on the rim of a cut glass bowl on ${VELVET} while a phone on a small stand photographs it, a notepad with a price beside.`), anim: "the finger points at the chip and the phone screen focuses" }),
  S(34, "Collectors will find a chip anyway", "av", "av"),
  // ── CUIDADO
  S(35, "", "av", "av"),
  S(35, "Never put cut glass in the dishwasher", "c", "HzWorthNothing", { props: { bed: "b_sinkwash", img: "b_dishwasher", title: "the dishwasher", price: "never", note: "the heat clouds it and cracks it", stamp: "never" } }),
  S(35, "Wash it by hand in warm water", "bi", "b_sinkwash", { p: BI(`An old porcelain kitchen sink with a folded towel on the bottom and warm soapy water, an older woman's hands in denim sleeves gently washing a sparkling cut glass bowl with a soft cloth.`), anim: "the hands gently wash the bowl in the soapy water" }),
  S(35, "And never pour hot water into cold crystal", "av", "av"),
  S(35, "with a towel in the bottom of the sink", "st", "st_washdish.1"),
  S(36, "", "bi", "b_punchbowl", { p: BI(`At an estate sale in ${HOUSE.split(":")[0]}: a big antique cut glass punch bowl on a dining table with cups hanging on its rim, a man in a polo shirt carrying it toward the kitchen sink, shoppers watching.`), anim: "the man carries the heavy punch bowl toward the kitchen" }),
  S(36, "It cracked with a sound like a gunshot", "bi", "b_cracked", { p: BI("A big antique cut glass punch bowl in a kitchen sink under a running hot water tap with a fresh long crack running right down its side, steam rising, a shocked man's hands frozen beside it."), anim: "steam rises and the water runs over the cracked bowl" }),
  S(36, "Don't be that man", "av", "av"),
  S(36, "so he rinsed it under the hot tap", "st", "st_washdish.2"),
  // ── EL DEALER
  S(37, "", "av", "av"),
  S(37, "He'll pick it up, give it a little flick", "bi", "b_dealerflick", { p: BI(`In ${GARAGE.split(":")[0]}: a dealer in his fifties in a fishing vest flicking the rim of a sparkling cut glass bowl with his finger, his face blank and unimpressed, other items on the card table.`), anim: "the dealer flicks the rim and listens with a blank face" }),
  S(37, "it's pressed, honey", "c", "HzLotVsPiece", { props: { lotLabel: "the whole table", lotPrice: "$20", pieces: [{ label: "the bowl alone", price: "$1,100" }], total: "take it off the table", leftTitle: "the dealer's offer", rightTitle: "what it's worth", bed: "b_dealerbowl" } }),
  S(38, "", "av", "av"),
  S(38, "Take it off the table", "c", "HzRuleCard", { props: { rule: "Take it off the table.", lines: ["You can sell it next week.", "You can never buy it back."], every: 40, bed: "b_garagebowl" } }),
  S(39, "", "av", "av"),
  S(39, "There are dealers like that", "bi", "b_gooddealer", { p: BI(`In ${HOUSE.split(":")[0]}: an older antiques dealer in a tweed jacket kindly showing a cut glass vase to a gray-haired woman, pointing at its cuts and smiling, both looking at it together.`), anim: "the dealer hands the vase back to the woman with a nod" }),
  S(39, "The ones who rush you", "bi", "b_rusher", { p: BI(`In ${GARAGE.split(":")[0]}: a hurried dealer with an armful of items already in a cardboard box, holding cash out toward an older woman, not looking at her, glancing at the next table.`), anim: "the dealer pushes the cash toward the woman impatiently" }),
  S(39, "who won't look you in the eye", "st", "st_coins.1"),
  // ── DESENLACE
  S(40, "", "bi", "b_offtable", { p: BI(`In ${GARAGE.split(":")[0]}: a widow in her seventies with short white hair and a cardigan carrying a sparkling cut glass bowl in both arms from the sale table into the house through the side door, the $5 sticker still on it.`), anim: "the woman carries the bowl carefully toward the door" }),
  S(40, "It had been holding rubber bands", "bi", "b_rubberbands", { p: BI("A sparkling antique cut glass bowl on a kitchen counter half full of rubber bands, keys and twist ties, a widow's hands emptying it into a coffee can."), anim: "the hands tip the rubber bands out of the bowl into the can" }),
  S(40, "She was a little embarrassed", "st", "st_grandma.1"),
  S(41, "", "st", "st_auction.5"),
  S(41, "June called me afterward", "bi", "b_phone", { p: BI("An older woman with short white hair in a cardigan sitting at a kitchen table holding an old corded wall phone to her ear and laughing, a cup of coffee and an auction catalog open in front of her, seen from the side."), anim: "the woman laughs and wipes her eye while listening on the phone" }),
  S(41, "Turns out she was right", "av", "av"),
  S(41, "Hazel, my mother-in-law always told me", "st", "st_oldphotos.2"),
  // ── CIERRE
  S(42, "", "c", "HzRecap", { props: { items: TESTS, every: 20, start: 4, title: "before you price any glass", bed: "b_hobstar" } }),
  S(42, "And if it passes, it comes off the table", "av", "av"),
  S(42, "Six tests, ten seconds", "st", "st_wineglasses.5"),
  S(43, "", "c", "HzRuleCard", { props: { rule: "Never sell on day one.", lines: ["Find out what it is first."], every: 40, bed: "b_window" } }),
  S(44, "", "av", "av", { ov: { c: "HzSubscribe", props: { line: "don't let the next one go for $5" } } }),
  S(44, "And tell me in the comments", "av", "av2", { ov: { c: "HzAsk", props: { question: "What's the heaviest, fanciest glass in your china cabinet?" } } }),
];
export const BEDS = [
  { name: "b_dishwasher", p: BI("An open kitchen dishwasher with a sparkling antique cut glass bowl wrongly placed on the bottom rack among plates, steam and water spots, a detergent pod door open.") },
];
