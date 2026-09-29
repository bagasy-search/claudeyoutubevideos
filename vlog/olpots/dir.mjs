// DIRECTOR olpots — una toma por frase (regla plano = lo dicho EN ESE SEGUNDO). En props, "@frase" = segundos
// desde el inicio de la toma hasta esa frase (lo resuelve gen_timeline con el ms real del anclaje difflib).
import { S, BI, CAMP, OLEP, SNAP } from "./dir_lib.mjs";
export const SHOTS = [
  // ── MINUTO 1: 24 tomas, ninguna >4 s, Ole hablando en el cuadro 1, la repisa 3D en "Five pots"
  S(0, "", "vl", "m1"),
  S(0, "I cooked for loggers", "ar", "a_logging_cookhouse"),
  S(0, "and every pot", "kf", "d_shelf", { sf: 0.4 }),
  S(0, "fit right there", "c", "OlePotShelf3D", { props: { tags: ["1", "2", "3", "4", "5"], appear: [0.2, 0.5, 0.8, 1.1, 1.4], spinDegPerSec: 14 } }),
  S(0, "And I'd buy every one", "vl", "m2"),
  S(1, "", "bi", "b_threepots", { p: BI("Three ordinary cheap cooking pots side by side on a kitchen counter: a scratched black nonstick frying pan, a thin dented shiny aluminum stockpot, and a bright glazed pottery pot with an orange and yellow pattern, morning light from a window."), anim: "slow push in on the three pots" }),
  S(1, "would never buy", "vl", "m3"),
  S(1, "One of those", "bi", "b_pancabinet", { p: BI("An open ordinary kitchen cabinet with a scratched black nonstick frying pan hanging on a hook among mixing bowls and a colander, a kitchen window and a dish rack beside it."), anim: "slow push in toward the pan" }),
  S(1, "kitchen right now", "st", "st_hand_pan"),
  S(1, "I'd bet the coffee", "kf", "d_mug", { sf: 0.6 }),
  S(2, "", "vl", "m4"),
  S(2, "so you know where", "bi", "b_notebooklist", { p: CAMP("Close view of an old man's hand with a stubby pencil about to write the number 1 at the top of a blank list on a worn cloth-bound cook's notebook lying open on the rough plank table beside a blue enamel mug. No face in the frame."), anim: "the pencil touches the paper" }),
  S(2, "A cast iron Dutch oven", "st", "st_dutch"),
  S(2, "A twelve inch", "st", "st_skillet"),
  S(2, "A big enamel stockpot", "bi", "b_enamel", { p: CAMP("A tall white speckled enamel stockpot with a blue rim and blue handles sitting on the plank table, its speckles and a small chip on the rim clearly visible, window light on it.") , anim: "slow push in on the speckled enamel" }),
  S(2, "A stainless steel", "st", "st_stainless"),
  S(2, "And one little heavy", "st", "st_saucepan"),
  S(2, "That's the whole shelf", "c", "OlePotShelf3D", { props: { tags: ["1", "2", "3", "4", "5"], appear: [0, 0, 0, 0, 0], spinDegPerSec: 10 } }),
  S(2, "What matters is the why", "vl", "m5"),
  S(2, "because the why", "st", "st_store"),
  S(3, "", "vl", "m6"),
  S(3, "Brands change every", "bi", "b_storeshelf", { p: BI("A cookware aisle in a big-box store: shelves packed with colorful pots and pans in many colors and matching sets in boxes, bright ceiling lights, a shopping cart at the edge of the frame."), anim: "slow push down the aisle" }),
  S(3, "What a pot is made", "c", "OleHeatSpreadMap", { props: { kicker: "WHERE THE FLAME GOES", pots: [
    { label: "Thin aluminum", sub: "hot spot", layers: [{ name: "al", color: "#b8bcc2", thick: 0.06 }], spread: 0.55, peak: 0.95, slow: 2.5, verdict: "bad", note: "scorches over the flame" },
    { label: "Thick-base stainless", sub: "aluminum core", layers: [{ name: "ss", color: "#9aa1a8", thick: 0.05 }, { name: "al", color: "#d4d8dc", thick: 0.22 }, { name: "ss", color: "#9aa1a8", thick: 0.05 }], spread: 1.6, peak: 0.1, slow: 2.6, verdict: "ok", note: "spreads it out" },
    { label: "Cast iron", sub: "holds it", layers: [{ name: "fe", color: "#6a655e", thick: 0.32 }], spread: 1.7, peak: 0.05, slow: 4.5, verdict: "ok", note: "slow, steady" } ] } }),
  S(3, "that doesn't change", "vl", "m7"),
  // ── (resto del video: se dirige después del OK de la compuerta 2)
  S(4, "Four questions", "av", ""),
];
