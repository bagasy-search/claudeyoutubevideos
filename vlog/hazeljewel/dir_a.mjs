// DIRECTOR A — minuto 1 (la última hora de la venta, la caja de $20) + Hazel + la caja + el broche de luto + el
// camafeo (p0-16)
import { S, BI, HZP, HOUSE, SHOP, GARAGE, VELVET } from "./dir_lib.mjs";
export const BOX = "a small antique walnut jewelry box with a brass keyhole escutcheon and a faded red velvet lining, about the size of a loaf of bread";
export const HKITCHEN = "her own kitchen table at night under a hanging lamp, a cup of tea, a magnifying loupe and a small flashlight on a dish towel";
export const SHOTS = [
  // ── MINUTO 1 (abre con Hazel)
  S(0, "", "av", "av"),
  S(0, "Everything was half price", "bi", "b_halfprice", { p: BI(`${HOUSE.split(":")[0]} in the last hour of an estate sale: picked-over folding tables, a hand-lettered sign that says EVERYTHING HALF PRICE taped to a lamp, a few tired shoppers.`), anim: "a shopper picks up a teacup and puts it back" }),
  S(0, "on the top shelf, behind a stack of old hat boxes", "bi", "b_closet", { p: BI(`The top shelf of an old hall closet: a stack of round striped hat boxes and, half hidden behind them, ${BOX}.`), anim: "a hand reaches up and slides the hat boxes aside" }),
  S(1, "", "bi", "b_salesman", { p: BI(`A tired man in his sixties in a flannel shirt running an estate sale, standing by a card table with a cash box, holding ${BOX} and shrugging.`), anim: "the man shrugs and holds out the box" }),
  S(1, "My feet hurt and I wanted to go home", "av", "av"),
  S(2, "", "hz", "h_pry", { p: HZP(`She carefully pries open the lid of ${BOX} with a butter knife at her kitchen table, leaning in, reading glasses on.`, HKITCHEN) }),
  S(2, "Some of it was worth real money", "av", "av"),
  S(3, "", "av", "av"),
  S(3, "the simple tests anybody can do at home", "c", "HzRecap", { props: { title: "today", items: ["open the box piece by piece", "the at-home tests", "what each thing really sells for", "the one thing I couldn't sell"], every: 24, start: 4, bed: "b_closet" } }),
  // ── HAZEL
  S(4, "", "av", "av", { ov: { c: "HzNameTag", props: { name: "Hazel", line: "40 years of estate sales · Ohio" } } }),
  // ── LA CAJA
  S(5, "", "bi", "b_boxlabel", { p: BI(`Close view of the bottom of ${BOX} turned over on a kitchen table, a small yellowed paper jeweler's label from Cincinnati glued to the wood, hand-cut brass hinges.`), anim: "a finger traces the old paper label" }),
  S(5, "Boxes like that were made in the eighteen hundreds", "c", "HzPriceTag", { props: { front: "$20", frontNote: "the whole box", sold: "$50-200", soldLabel: "the empty box alone", item: "antique walnut jewelry box", stamp: "already safe", bed: "b_boxlabel" } }),
  S(6, "", "c", "HzBoxOpen", { props: { title: "what was inside the $20 box", paid: "$20", items: [{ label: "the walnut box", price: "$50-200" }, { label: "mourning brooch (jet)", price: "$100s" }, { label: "shell cameo, 14K", price: "$100-300" }, { label: "pocket watch, gold filled", price: "~$100" }, { label: "the surprise at the bottom", price: "?", hi: true }], every: 26, bed: "b_tangle" } }),
  S(6, "a tangle of chains and brooches", "bi", "b_tangle", { p: BI(`Inside an open antique jewelry box on a kitchen table: a tangle of old gold chains, brooches and little bundles wrapped in yellowed tissue paper, under a warm lamp.`), anim: "a hand lifts a chain out of the tangle" }),
  // ── EL BROCHE DE LUTO
  S(7, "", "bi", "b_brooch", { p: BI(`Close view on black velvet: an antique black oval mourning brooch with a small glass window, a lock of brown hair woven into a tiny basket pattern behind the glass.`), anim: "light glints across the glass of the brooch" }),
  S(8, "", "av", "av"),
  S(8, "especially after the Civil War", "st", "st_civilwar.1"),
  S(9, "", "bi", "b_engraving", { p: BI(`Extreme close view of the gold back of an antique brooch with tiny engraved script reading In memory of our dear Samuel 1864, a jeweler's loupe resting beside it.`), anim: "the loupe slides over the engraving" }),
  S(10, "", "av", "av"),
  S(10, "Jet feels warm and very light in your hand", "c", "HzMagnetTest", { props: { title: "jet or black glass?", left: { label: "jet", sticks: false, verdict: "warm · very light" }, right: { label: "black glass", sticks: false, verdict: "cold · heavier" } } }),
  S(11, "", "av", "av"),
  // ── EL CAMAFEO
  S(12, "", "bi", "b_cameo", { p: BI(`On black velvet: an antique carved shell cameo brooch of a lady's profile with curly hair, in a fine gold frame, warm window light.`), anim: "the light shifts slowly across the cameo" }),
  S(13, "", "av", "av"),
  S(13, "Newer ones, and a lot of cheap ones, are molded plastic", "st", "st_jewelry.1"),
  S(14, "", "c", "HzCameoLight", { props: { title: "put a light behind it", bed: "b_cameo" } }),
  S(15, "", "hz", "h_flashlight", { p: HZP("She holds a small cameo up in front of a little flashlight at her kitchen table, the cameo glowing soft pink, peering at it through her glasses.", HKITCHEN) }),
  S(15, "stamped on the back with a tiny fourteen K", "c", "HzHallmark3D", { props: { stamp: "14K", sub: "585", verdict: "solid gold frame", good: true, title: "turn it over" } }),
  S(16, "", "c", "HzSoldListings", { props: { title: "cameos · sold listings", rows: [{ item: "hand-carved shell, gold frame", price: "$100-300" }, { item: "carved stone, known carver", price: "much more" }, { item: "molded plastic", price: "$10-20" }], range: "light behind it first", bed: "b_cameo" } }),
];
export const BEDS = [];
