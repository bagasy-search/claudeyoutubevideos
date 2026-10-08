// DIRECTOR E — fufruta: planos de stock extra (metraje real ≥25 %): parten tomas largas de imagen con objetos genéricos (nunca personajes).
import { S, BI } from "../claudio/lib.mjs";
const X = (p, at, name, q, scene) => S(p, at, "bi", name, { q, p: BI(scene) });
export const SHOTS = [
  X(16, "debajo de la rejilla", "st_x_drain16", "sink drain", "A kitchen sink drain close up."),
  X(17, "una papa o una cebolla olvidada", "st_x_potato17", "potatoes onions", "Potatoes and onions in a bag."),
  X(30, "donde más vuelan", "st_x_fruit30", "fruit bowl", "A fruit bowl on a table."),
  X(37, "temprano", "st_x_dawn37", "sunrise window", "Early morning light through a window."),
  X(42, "el trapo de la cocina", "st_x_towel42", "dish towel", "A dish towel by a sink."),
  X(52, "El vinagre viejo, lleno de mosquitas", "st_x_vinegar52", "vinegar", "Vinegar in a glass."),
  X(73, "en el medio de la mesa", "st_x_bananas73", "bananas", "Yellow bananas on a table."),
  X(16, "humedad todo el", "st_y_drain16", "bathroom sink drain", "Bathroom sink drain."),
  X(39, "pegada a las", "st_y_pipe39", "drain pipe", "Drain pipe."),
  X(40, "chorreaba un líquido", "st_y_potatoes40", "old potatoes", "Old potatoes."),
  X(51, "siguen naciendo unos", "st_y_tap51", "kitchen tap water", "Kitchen tap water."),
  X(57, "a las que", "st_y_spray57", "spray can", "Spray can."),
  X(59, "Se paran toman", "st_y_glass259", "glass on table", "Glass on table."),
  X(64, "en las paredes", "st_y_bath64", "bathroom tiles", "Bathroom tiles."),
  X(69, "al refrigerador Las", "st_y_fruits69", "fresh fruit", "Fresh fruit."),
  X(72, "Dos que seguramente", "st_y_bowl72", "fruit basket", "Fruit basket."),
  S(23, "Si sólo pones el vaso", "c", "ClGlassTrap", { props: { mode: "cone" } }),
];
