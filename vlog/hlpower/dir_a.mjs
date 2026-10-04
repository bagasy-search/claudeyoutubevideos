// DIRECTOR A — minuto 1 (el hombre al final del camino, "a las 11") + Harlan + el árbol de la red + el estimado +
// el mapa (p0-15)
import { S, BI, HZP, GARAGE, KITCH, HOUSE, STORM } from "./dir_lib.mjs";
export const ROADMAN = "a white man in his thirties in a hooded winter coat and a ball cap, standing at the end of a rural gravel road in an ice storm";
export const SHOTS = [
  // ── MINUTO 1 (abre con Harlan)
  S(0, "", "av", "av"),
  S(0, "a man flagged down my truck", "bi", "b_flagdown", { p: BI(`${ROADMAN}, waving his arm at a utility bucket truck with amber lights coming down the road at dusk, ice on the trees.`), anim: "the man waves his arm at the truck" }),
  S(0, "The power company website said", "bi", "b_phoneest", { p: BI("Close view of a man's cold hand holding a phone in the cab of a pickup at night, the screen showing a simple outage page with an estimated restoration time of 11:00 PM, ice on the windshield."), anim: "the thumb refreshes the page" }),
  S(1, "", "bi", "b_snapped", { p: BI(`${STORM}: three wooden power poles snapped and leaning in a row along a country road, a big oak tree lying across the sagging lines, a transformer lying in the snow.`), anim: "ice-covered branches sway in the wind" }),
  S(1, "pack a bag and go to your sister's house", "av", "av"),
  S(2, "", "c", "ElCoolerBoard", { props: { title: "the estimate vs. the truth", rows: [{ item: "website said", price: "11 PM tonight" }, { item: "lights came back", price: "day 5", hi: true }], every: 30, bed: "b_snapped" } }),
  S(3, "", "av", "av"),
  S(3, "you can look out your own window", "st", "st_window.1"),
  // ── HARLAN
  S(4, "", "av", "av", { ov: { c: "ElNameTag", props: { name: "Harlan", line: "40 years climbing poles · Kentucky" } } }),
  S(4, "hurricanes, ice storms, tornadoes and floods", "av", "av"),
  // ── EL ÁRBOL
  S(5, "", "av", "av"),
  S(6, "", "c", "HlPowerTree", { props: { title: "power comes back from the trunk out", labels: ["transmission lines", "substations", "main lines (feeders)", "side streets", "your house"], you: "last", every: 30 } }),
  S(6, "the tall steel towers", "st", "st_towers.1"),
  S(6, "those fenced yards full of equipment", "st", "st_substation.1"),
  S(7, "", "av", "av"),
  S(7, "hospitals, water plants and emergency services", "st", "st_hospital.1"),
  S(8, "", "c", "HlRestoreOrder", { props: { title: "one repair, five thousand homes", steps: ["fix the main line", "5,000 homes come back", "then the side streets", "then single houses"], every: 30 } }),
  S(9, "", "bi", "b_neighbor", { p: BI(`A dark house at night in a snowy neighborhood, while the house directly across the street has warm lights glowing in every window, a man standing in his dark doorway looking over at it.`), anim: "the man shakes his head in the doorway" }),
  S(9, "And those single wires get fixed last", "av", "av"),
  // ── EL ESTIMADO
  S(10, "", "av", "av"),
  S(11, "", "st", "st_computer.1"),
  S(11, "then they get pushed back, again and again", "av", "av"),
  S(12, "", "bi", "b_assessor", { p: BI(`A utility damage assessor in a reflective vest and hard hat standing beside his pickup on an icy country road, writing on a clipboard and looking up at a broken pole.`), anim: "the assessor writes on the clipboard" }),
  S(12, "that assessment alone can take a day or two", "av", "av"),
  S(13, "", "c", "ElLabelLine", { props: { line: "the first estimate", means: "a computer's guess", good: false, bed: "b_phoneest" } }),
  S(14, "", "c", "ElCoolerBoard", { props: { title: "read the outage map", rows: [{ item: "assessing", price: "nobody's looked yet" }, { item: "crew assigned", price: "on the way" }, { item: "crew on site", price: "they're there", hi: true }], every: 32, bed: "b_phoneest" } }),
  S(14, "plan for a long one", "av", "av"),
  S(15, "", "av", "av"),
  S(15, "the crews are getting close", "st", "st_buckettruck.1"),
];
export const BEDS = [];
