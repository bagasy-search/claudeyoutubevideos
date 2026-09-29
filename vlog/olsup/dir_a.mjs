// DIRECTOR A — minuto 1 (gancho) + intro + CTA + café + "cómo va la noche"  (párrafos 0-5)
// Minuto 1 = 25 cortes, ninguna toma > 4 s salvo los hablados; stock/archivo REAL + Ole hablando + 3D + componentes.
import { S, BI, OLEP } from "./dir_lib.mjs";
export const SHOTS = [
  // ── P0 · GANCHO (0-25 s)
  S(0, "", "vl", "m1"),
  S(0, "a man walks", "bi", "b_door", { p: BI("The heavy plank door of a log cookhouse standing open at dusk in a snowstorm, a man in a thick wool coat and fur cap stepping in from the snow with frost on his shoulders and beard, warm yellow lantern light pouring out over the snowy steps, stamped boots, other men already inside behind him."), anim: "the snow blows across the doorway and the man steps in over the threshold" }),
  S(0, "and there's a supper", "c", "OleCookhouse3D", { props: { intro: true, dishes: [{ n: 30, kind: "stew", at: 0 }, { n: 29, kind: "beans", at: 0.4 }, { n: 28, kind: "bread", at: 0.8 }, { n: 27, kind: "pie", at: 1.2 }, { n: 26, kind: "soup", at: 1.6 }, { n: 25, kind: "roast", at: 2.0 }, { n: 24, kind: "pancakes", at: 2.4 }], focusN: 30, camTo: 24 } }),
  S(0, "those suppers", "vl", "m1b"),
  S(0, "Here are thirty", "c", "OleFact", { props: { big: "30", unit: "logging camp suppers", text: "counting down to the one they fought over" } }),
  S(0, "to the one every man", "bi", "b_hands", { p: BI("Many rough work-worn hands in wool sleeves reaching in from all sides toward one big steaming cast iron pot of baked beans in the middle of a long plank table, tin plates and cups everywhere, a ladle, lantern light, eager crowded scramble caught mid-action, faces cut off by the frame edge."), anim: "the hands reach and pull back with full tin plates, steam swirls" }),
  S(0, "And that number one", "vl", "m1b"),
  S(0, "Well, it cost next to nothing", "st", "st_embers", { q: "glowing coals embers fire pit night" }),
  S(0, "and it took all day", "st", "st_clockfire", { q: "old wall clock ticking close up" }),

  // ── P1 · QUIÉN ES OLE (25-53 s)
  S(1, "", "vl", "m2", { ov: { c: "OleNameTag", props: { name: "Ole", sub: "camp cook · forty years" } } }),
  S(1, "before the sun came up", "st", "st_dawn", { q: "cabin chimney smoke winter dawn snow" }),
  S(1, "and I stayed in those", "vl", "m2"),
  S(1, "A logger burned", "c", "OleCalorieMeter", { props: { label: "A logger's day", to: 5000, unit: "calories", source: "Minnesota Historical Society" } }),
  S(1, "The cook's day started", "c", "OleDayClock", { props: { startH: 4, endH: 18, marks: [{ h: 4, label: "Cook's up" }, { h: 6, label: "Breakfast" }, { h: 12, label: "Dinner" }, { h: 18, label: "Supper bell" }] } }),
  S(1, "His crew was", "ar", "ar_cookstaff", { arch: "cookstaff", cap: "A camp cook and his crew, ca 1920s", credit: "Public domain · Wikimedia Commons" }),
  S(1, "and a wood range", "bi", "b_range", { p: BI("A huge black cast iron wood range in a log cook shack, six burners covered with big pots and kettles with steam, a cook in a khaki apron seen from behind stirring a pot with a long paddle, split firewood stacked underneath, a young helper in the corner peeling potatoes, warm orange fire glow from the firebox door."), anim: "steam rises from the pots and the cook stirs slowly" }),
  S(1, "The men came in", "bi", "b_wetwool", { p: BI("Inside a log cookhouse, a row of wet wool coats, caps and mittens hanging on a rope line over a black wood stove, steam rising from the drying wool, wet boots on the plank floor below, a lantern hanging from a beam, men's backs at the edge of the frame."), anim: "steam rises from the wet wool over the stove" }),
  S(1, "over the stove", "st", "st_stove_wet", { q: "wet wool mittens and socks drying near wood stove" }),
  S(1, "and sat down at long tables", "ar", "ar_mess1", { arch: "mess1", cap: "Mess hall interior, ca 1920", credit: "Kinsey / Wikimedia Commons · public domain" }),
  S(1, "about twenty to a table", "ar", "ar_mess2", { arch: "mess2", cap: "Long tables, one bench each side", credit: "Kinsey / Wikimedia Commons · public domain" }),
  S(1, "on benches with no backs", "bi", "b_benches", { p: BI("Low angle along a very long rough plank table in a log cookhouse, tin plates and tin cups set in a line, backless plank benches on both sides, a loaf of bread every few places, lantern light and steam, the far end of the table fading into the dim room, nobody seated yet."), anim: "a wisp of steam drifts along the table" }),

  // ── P2 · LA REGLA (53-76 s)
  S(2, "", "av", ""),
  S(2, "Nobody talked", "vl", "m3"),
  S(2, "The old cooks said", "ar", "ar_silent", { arch: "silent", cap: "Every man in his seat, eyes on the plate", credit: "Kinsey / Wikimedia Commons · public domain" }),
  S(2, "and there was a lot of work", "st", "st_axe2", { q: "splitting firewood with axe winter morning" }),
  S(2, "The historical societies", "c", "OleFact", { props: { big: "No talking", unit: "at the table", text: "Camp meals were silent, by rule", source: "Minnesota Historical Society" } }),

  // ── P3 · CTA (77-99.5 s)
  S(3, "", "vl", "m4", { ov: { c: "OleNote", props: { text: "every recipe, every measure", x: 0.7, y: 0.22, rot: -4 } } }),
  S(3, "It's a cookbook now", "c", "OleCTA", { props: { cover: "img/olsup/portada.png", qr: "qr_ole_suppers.png", line1: "Point your phone at this code", line2: "or tap the link in the description" } }),
  S(3, "Now, back to the stove", "st", "st_stove_fire", { q: "wood burning stove fire cast iron door open" }),

  // ── P4 · CAFÉ (99.5-127 s)
  S(4, "", "kf", "d_coffee"),
  S(4, "Always coffee", "st", "st_coffee_pour", { q: "pouring coffee from old pot into metal mug" }),
  S(4, "The old boys said", "av", ""),
  S(4, "float a horseshoe", "bi", "b_horseshoe", { p: BI("A single old rusty horseshoe floating flat on the surface of very black coffee in a big white enamel mug on a rough plank table, a curl of steam, a man's work-worn hand resting on the table beside it in disbelief, a lantern light reflected in the coffee."), anim: "steam curls up from the black coffee" }),
  S(4, "The pot sat at the back", "st", "st_kettle", { q: "black kettle steaming on wood stove" }),
  S(4, "Boil the grounds", "bi", "b_grounds", { p: BI("Close view of a weathered hand tipping a small tin cup of cold water into a blackened enamel coffee pot on the edge of a wood stove, coffee grounds visible on the rim, steam, the stove top dusty with ash."), anim: "the cold water pours into the pot and steam hisses up" }),
  S(4, "That was the whole trick", "st", "st_coffee_steam", { q: "steaming black coffee in enamel cup close up" }),

  // ── P5 · CÓMO VA LA NOCHE (127-141 s)
  S(5, "", "av", ""),
  S(5, "Thirty suppers", "c", "OleCookhouse3D", { props: { intro: true, dishes: [], focusN: 30, camTo: 1 } }),
  S(5, "Some are quick", "bi", "b_cookee_burn", { p: BI("A young cookee in an oversize khaki apron holding up a blackened scorched iron pot with a sheepish grin while an older cook stands next to him with crossed arms shaking his head, the cook shack kitchen with steam and hanging pots behind them, a wood stove."), anim: "smoke curls off the burnt pot" }),
  S(5, "Ready?", "av", ""),
];
